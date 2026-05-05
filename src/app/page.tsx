import type { Metadata } from "next";
import Hero from "@/components/hero";
import BrandsBar from "@/components/brands-bar";
import Services from "@/components/services";
import Expertise from "@/components/expertise";
import Stats from "@/components/stats";
import OurWork from "@/components/our-work";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";
import StructuredData from "@/components/structured-data";

export const metadata: Metadata = {
  title: "BimmerNext | BMW, MINI & Rolls-Royce Specialists in Ajman, UAE",
  description:
    "Premium BMW, MINI & Rolls-Royce car repair workshop in Ajman, UAE. Dealer-level diagnostics, expert mechanics, genuine parts. Book your car service today.",
  keywords: [
    "BMW repair Ajman",
    "MINI service UAE",
    "Rolls-Royce workshop",
    "car repair Ajman",
    "BMW specialist",
    "German car workshop UAE",
    "luxury car repair",
  ],
  alternates: {
    canonical: "https://bimmernext.ae",
  },
};

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="flex-1">
        <Hero />
        <BrandsBar />
        <Services />
        <Expertise />
        <Stats />
        <OurWork />
        <Testimonials />
        <CTA />
      </main>
    </>
  );
}
