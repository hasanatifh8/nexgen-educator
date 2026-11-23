import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Institutions from "@/components/Institutions";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Faq from "@/components/home/Faq";
import CareerOutcomes from "@/components/home/CareerOutcomes";
import TeacherWorries from "@/components/home/TeacherWorries";
import BuiltForYou from "@/components/home/BuiltForYou";
import ResearchEvidence from "@/components/home/ResearchEvidence";
import FreeAiStrip from "@/components/home/FreeAiStrip";
import TeacherPersonas from "@/components/home/TeacherPersonas";
import FinalCta from "@/components/home/FinalCta";
import FinderCta from "@/components/home/FinderCta";
import { HomeCredentials, HomeExamEngine, HomeExplorer, SectionSkeleton } from "@/components/home/HomeCatalog";

/**
 * Story order for the target visitor (an experienced Indian school teacher, anxious about their career and
 * not confident with technology): name the worry → remove the fear → "this is for you" → proof → act.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TeacherWorries />
        <ResearchEvidence />
        <FreeAiStrip />
        <BuiltForYou />
        <TeacherPersonas />
        <HowItWorks />
        <FinderCta />
        <CareerOutcomes />
        <Suspense fallback={<SectionSkeleton />}>
          <HomeCredentials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HomeExplorer />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <HomeExamEngine />
        </Suspense>
        <Institutions />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
