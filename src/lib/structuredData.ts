import { priceWithGst, type Course, type Program } from "./catalog";
import { OFFICES, ORG, PRIMARY_OFFICE, SITE_URL, absoluteUrl } from "./organization";

/** schema.org descriptions of the organisation, site and courses, for search engines and AI assistants. */

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const postalAddress = (o: (typeof OFFICES)[number]) => ({
  "@type": "PostalAddress",
  streetAddress: o.street,
  addressLocality: o.locality,
  addressRegion: o.region,
  ...(o.postalCode ? { postalCode: o.postalCode } : {}),
  addressCountry: "IN",
});

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORG_ID,
    name: ORG.name,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl(ORG.logo), width: 512, height: 512 },
    image: absoluteUrl(ORG.logo),
    slogan: ORG.tagline,
    description: ORG.description,
    telephone: ORG.phone.e164,
    address: postalAddress(PRIMARY_OFFICE),
    location: OFFICES.map((o) => ({ "@type": "Place", name: `${ORG.name} — ${o.label}, ${o.city}`, address: postalAddress(o) })),
    contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", telephone: ORG.phone.e164, areaServed: "IN", availableLanguage: ["English", "Hindi"] }],
    areaServed: { "@type": "Country", name: ORG.areaServed },
    parentOrganization: { "@type": "Organization", name: ORG.parent.name, url: ORG.parent.url },
    knowsAbout: ["Teacher professional development", "Artificial intelligence in education", "Assessment design", "Classroom management", "Early childhood education", "CBSE and ICSE teaching"],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: ORG.name,
    url: SITE_URL,
    inLanguage: ORG.language,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** Course with its fee, format and the certificate it leads to. */
export function courseLd(course: Course, program?: Program) {
  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const free = course.price === 0;
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${absoluteUrl(`/courses/${course.id}`)}#course`,
    name: course.title,
    description: course.blurb,
    url: absoluteUrl(`/courses/${course.id}`),
    provider: { "@type": "Organization", "@id": ORG_ID, name: ORG.name, sameAs: SITE_URL },
    inLanguage: ORG.language,
    educationalLevel: course.level,
    about: course.category,
    teaches: course.outcomes,
    isAccessibleForFree: free,
    timeRequired: `PT${Math.round(course.hours)}H`,
    ...(course.instructor ? { instructor: { "@type": "Person", name: course.instructor.name, jobTitle: course.instructor.title } } : {}),
    ...(program ? { educationalCredentialAwarded: { "@type": "EducationalOccupationalCredential", name: program.title, credentialCategory: "certificate" } } : {}),
    offers: {
      "@type": "Offer",
      category: free ? "Free" : "Paid",
      price: free ? 0 : priceWithGst(course.price),
      priceCurrency: "INR",
      url: absoluteUrl(`/courses/${course.id}`),
      availability: course.launch ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
      ...(course.launch?.on ? { availabilityStarts: course.launch.on } : {}),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `PT${Math.round(course.hours)}H`,
      ...(course.launch?.on ? { startDate: course.launch.on } : {}),
    },
    ...(lessons ? { syllabusSections: course.modules.map((m) => ({ "@type": "Syllabus", name: m.title })) } : {}),
  };
}

export function courseListLd(courses: Course[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${ORG.name} courses`,
    itemListElement: courses.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/courses/${c.id}`), name: c.title })),
  };
}

export function faqLd(faqs: readonly (readonly [string, string])[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
