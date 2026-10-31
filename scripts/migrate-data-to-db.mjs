// Copies local data/ (users, catalog, enquiries, settings, uploaded documents) into the Postgres database.
// Usage: DATABASE_URL="postgres://..." node scripts/migrate-data-to-db.mjs
// Existing rows with the same keys are overwritten, so run it once, before people start using the live site.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Set DATABASE_URL first.");
  process.exit(1);
}
const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });
const DATA = path.join(process.cwd(), "data");
const MIME = { jpg: "image/jpeg", png: "image/png", pdf: "application/pdf", doc: "application/msword", docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

await sql`create table if not exists app_documents (key text primary key, value jsonb not null, updated_at timestamptz not null default now())`;
await sql`create table if not exists app_files (key text primary key, data bytea not null, mime text not null, created_at timestamptz not null default now())`;

for (const key of ["users", "catalog", "enquiries", "settings"]) {
  try {
    const value = JSON.parse(await readFile(path.join(DATA, `${key}.json`), "utf8"));
    await sql`insert into app_documents (key, value) values (${key}, ${sql.json(value)})
              on conflict (key) do update set value = excluded.value, updated_at = now()`;
    console.log(`✓ ${key}${Array.isArray(value) ? ` (${value.length})` : ""}`);
  } catch (e) {
    if (e.code === "ENOENT") console.log(`– ${key}: no local file, skipped`);
    else throw e;
  }
}

let files = 0;
const uploads = path.join(DATA, "uploads");
for (const user of await readdir(uploads).catch(() => [])) {
  for (const name of await readdir(path.join(uploads, user)).catch(() => [])) {
    const data = await readFile(path.join(uploads, user, name));
    const mime = MIME[name.split(".").pop()] ?? "application/octet-stream";
    await sql`insert into app_files (key, data, mime) values (${`${user}/${name}`}, ${data}, ${mime})
              on conflict (key) do update set data = excluded.data, mime = excluded.mime`;
    files++;
  }
}
console.log(`✓ ${files} uploaded document(s)`);
await sql.end();
