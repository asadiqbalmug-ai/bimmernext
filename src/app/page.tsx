import Hero from "@/components/hero";
import BrandsBar from "@/components/brands-bar";
import Services from "@/components/services";
import Expertise from "@/components/expertise";
import Stats from "@/components/stats";
import OurWork from "@/components/our-work";
import Testimonials from "@/components/testimonials";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <>
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
