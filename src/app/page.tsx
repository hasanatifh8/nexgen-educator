import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ExamEngine from "@/components/ExamEngine";
import CourseCatalog from "@/components/CourseCatalog";
import Institutions from "@/components/Institutions";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <ExamEngine />
        <CourseCatalog />
        <Institutions />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
