import { AsyncLocalStorage } from "node:async_hooks";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import postgres from "postgres";

/**
 * Persistence for JSON documents (users, catalog, enquiries, settings) and private files (ID documents, CVs).
 *
 * - With DATABASE_URL (or POSTGRES_URL) set — e.g. Neon/Supabase on Vercel — everything lives in Postgres.
 *   Serverless filesystems are read-only and wiped between requests, so this is required in production.
 * - Without it (local development), documents are JSON files under data/ and files under data/uploads.
 */
const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const usingDatabase = DB_URL !== "";

const DATA_DIR = path.join(process.cwd(), "data");

// ─────────────────────────────── Postgres ───────────────────────────────

type Sql = postgres.Sql;
const g = globalThis as unknown as { __ngeSql?: Sql; __ngeSchema?: Promise<void> };

function sql(): Sql {
  // Small pool: serverless instances are short-lived; use the provider's pooled connection string.
  g.__ngeSql ??= postgres(DB_URL, { max: 5, idle_timeout: 20, prepare: false, onnotice: () => {} });
  return g.__ngeSql;
}

/** Queries inside withLock() run on the locking transaction's connection. */
const txContext = new AsyncLocalStorage<postgres.TransactionSql>();
const q = (): Sql => (txContext.getStore() as unknown as Sql | undefined) ?? sql();

function ensureSchema() {
  g.__ngeSchema ??= (async () => {
    await sql()`create table if not exists app_documents (key text primary key, value jsonb not null, updated_at timestamptz not null default now())`;
    await sql()`create table if not exists app_files (key text primary key, data bytea not null, mime text not null, created_at timestamptz not null default now())`;
  })().catch((e) => {
    g.__ngeSchema = undefined;
    throw e;
  });
  return g.__ngeSchema;
}

// ─────────────────────────────── JSON documents ───────────────────────────────

const docFile = (key: string) => path.join(DATA_DIR, `${key}.json`);

export async function getJson<T>(key: string): Promise<T | undefined> {
  if (usingDatabase) {
    await ensureSchema();
    const rows = await q()`select value from app_documents where key = ${key}`;
    return rows.length ? (rows[0].value as T) : undefined;
  }
  try {
    return JSON.parse(await readFile(docFile(key), "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw e;
  }
}

export async function setJson(key: string, value: unknown) {
  if (usingDatabase) {
    await ensureSchema();
    const json = q().json(value as postgres.JSONValue);
    await q()`insert into app_documents (key, value, updated_at) values (${key}, ${json}, now())
              on conflict (key) do update set value = excluded.value, updated_at = now()`;
    return;
  }
  // Write to a temp file and rename, so a crash mid-write never leaves a truncated file.
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${docFile(key)}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(tmp, JSON.stringify(value, null, 2));
  await rename(tmp, docFile(key));
}

const localQueues = new Map<string, Promise<unknown>>();

/**
 * Serialises read-modify-write cycles on one document. Without it, two concurrent requests both read the
 * old value and the last write wins. Postgres uses a transaction-scoped advisory lock, so this also holds
 * across serverless instances; locally an in-process queue is enough.
 */
export function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (usingDatabase) {
    if (txContext.getStore()) return fn(); // already inside a lock
    return ensureSchema().then(() =>
      sql().begin(async (tx) => {
        await tx`select pg_advisory_xact_lock(hashtext(${key}))`;
        return txContext.run(tx, fn);
      }) as Promise<T>,
    );
  }
  const run = (localQueues.get(key) ?? Promise.resolve()).then(fn);
  localQueues.set(key, run.catch(() => undefined));
  return run;
}

// ─────────────────────────────── Private files ───────────────────────────────

const localFile = (key: string) => path.join(DATA_DIR, "uploads", ...key.split("/"));

export async function putFile(key: string, data: Buffer, mime: string) {
  if (usingDatabase) {
    await ensureSchema();
    await q()`insert into app_files (key, data, mime) values (${key}, ${data}, ${mime})
              on conflict (key) do update set data = excluded.data, mime = excluded.mime, created_at = now()`;
    return;
  }
  await mkdir(path.dirname(localFile(key)), { recursive: true });
  await writeFile(localFile(key), data, { mode: 0o600 });
}

export async function getFile(key: string): Promise<Buffer | null> {
  if (usingDatabase) {
    await ensureSchema();
    const rows = await q()`select data from app_files where key = ${key}`;
    return rows.length ? Buffer.from(rows[0].data as Uint8Array) : null;
  }
  try {
    return await readFile(localFile(key));
  } catch {
    return null;
  }
}

export async function deleteFile(key: string) {
  if (usingDatabase) {
    await ensureSchema();
    await q()`delete from app_files where key = ${key}`;
    return;
  }
  await rm(localFile(key), { force: true });
}
