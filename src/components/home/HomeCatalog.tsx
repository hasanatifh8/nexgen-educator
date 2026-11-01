import { connection } from "next/server";
import { toCourseOutline, toPublicProgram } from "@/lib/catalog";
import { getPublicCatalog } from "@/lib/catalogStore";
import CourseExplorer from "./CourseExplorer";
import CourseFinder from "./CourseFinder";
import CredentialShowcase from "./CredentialShowcase";
import Certificate from "../Certificate";
import ExamEngine from "../ExamEngine";
import { getSettings } from "@/lib/settings";

/** Live catalog sections for the home page — reflect admin changes without a rebuild. */
export async function HomeExplorer() {
  await connection();
  const { courses, programs } = await getPublicCatalog();
  return <CourseExplorer courses={courses.map(toCourseOutline)} programs={programs.map(toPublicProgram)} />;
}

export async function HomeFinder() {
  await connection();
  const { courses, programs } = await getPublicCatalog();
  return <CourseFinder courses={courses.map(toCourseOutline)} programs={programs.map(toPublicProgram)} />;
}

/** Program cards with curriculum path, competencies and a live certificate preview. */
export async function HomeCredentials() {
  await connection();
  const [{ courses, programs }, settings] = await Promise.all([getPublicCatalog(), getSettings()]);
  return <CredentialShowcase courses={courses.map(toCourseOutline)} programs={programs.map(toPublicProgram)} settings={settings} />;
}

export function SectionSkeleton({ dark = false }: { dark?: boolean }) {
  return <div className={`h-[40rem] animate-pulse ${dark ? "bg-navy-900" : "bg-slate-50"}`} />;
}

/** Free diagnostic with the admin's certificate branding. */
export async function HomeExamEngine() {
  await connection();
  return <ExamEngine settings={await getSettings()} />;
}

/** The real certificate design in the hero, with the admin's branding (organisation, signatories). */
export async function HeroCertificate() {
  await connection();
  const settings = await getSettings();
  return (
    <Certificate
      settings={settings}
      className="!shadow-black/40"
      data={{ name: "Priya Sharma", title: "Certified AI-Ready Educator", score: 23, total: 25, credentialId: "SAMPLE-2026-48A1F2C9", issuedOn: "12 October 2026", sample: true }}
    />
  );
}
