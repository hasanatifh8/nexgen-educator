import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Institutions from "@/components/Institutions";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Faq from "@/components/home/Faq";
import CareerOutcomes from "@/components/home/CareerOutcomes";
import { HomeCredentials, HomeExamEngine, HomeExplorer, HomeFinder, SectionSkeleton } from "@/components/home/HomeCatalog";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CareerOutcomes />
        <Suspense fallback={<SectionSkeleton />}>
          <HomeCredentials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HomeExplorer />
        </Suspense>
        <HowItWorks />
        <Suspense fallback={<SectionSkeleton dark />}>
          <HomeFinder />
        </Suspense>
        <Features />
        <Suspense fallback={<SectionSkeleton />}>
          <HomeExamEngine />
        </Suspense>
        <Institutions />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
