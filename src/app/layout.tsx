import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { ORG, SITE_URL } from "@/lib/organization";
import { organizationLd, websiteLd } from "@/lib/structuredData";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const DESCRIPTION =
  "Online teacher training in India: self-paced courses on AI for teachers, assessment design, classroom management, early years and CBSE/ICSE subject teaching — each with a certification exam and a verifiable certificate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "NextGen Educator — Teacher Training, AI Courses & Certification in India", template: "%s | NextGen Educator" },
  description: DESCRIPTION,
  applicationName: ORG.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: ORG.name,
    locale: "en_IN",
    url: "/",
    title: "NextGen Educator — Train. Test. Certify.",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "NextGen Educator — Train. Test. Certify.", description: DESCRIPTION },
  // Add these in Vercel → Settings → Environment Variables once you register the site with Google / Bing.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
      </body>
    </html>
  );
}
