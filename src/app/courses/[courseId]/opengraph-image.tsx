import { connection } from "next/server";
import { formatINR, launchLabel } from "@/lib/catalog";
import { getPublicCatalog } from "@/lib/catalogStore";
import { OG_SIZE, ogCard } from "@/lib/ogCard";

export const alt = "NextGen Educator course";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Course share card: title, fee, length and level — what people see when a course link is shared on WhatsApp. */
export default async function Image({ params }: { params: Promise<{ courseId: string }> }) {
  await connection();
  const { courseId } = await params;
  const course = (await getPublicCatalog()).courses.find((c) => c.id === courseId);
  if (!course) return ogCard({ eyebrow: "Course", title: "Teacher training courses", details: ["nextgeneducator.in"] });
  return ogCard({
    eyebrow: course.launch ? launchLabel(course.launch) : course.category,
    title: course.title,
    details: [course.price === 0 ? "Free" : `${formatINR(course.price)} + GST`, `${course.hours} hours`, course.level, "Certificate"],
  });
}
