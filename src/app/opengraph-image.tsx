import { OG_SIZE, ogCard } from "@/lib/ogCard";

export const alt = "NextGen Educator — online teacher training and certification in India";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "Teacher training · India",
    title: "Practical courses, certification exams and verifiable certificates for teachers",
    details: ["AI for teachers", "Assessment design", "Early years & primary", "CBSE & ICSE"],
  });
}
