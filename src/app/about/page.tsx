import { ArrowRight, Users, ShieldCheck, Wrench, Star } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: ShieldCheck,
    title: "Precision First",
    desc: "We treat every car as if it were our own. No shortcuts, no compromises. Just dealer-level expertise applied to every bolt and every line of code.",
  },
  {
    icon: Users,
    title: "Hands-On Owner",
    desc: "Our founder personally oversees every repair. You're not dealing with a corporate chain — you're dealing with someone who genuinely loves these cars.",
  },
  {
    icon: Wrench,
    title: "Specialist Knowledge",
    desc: "BMW. MINI. Rolls-Royce. We don't do everything — we do these three brands better than anyone else in the UAE.",
  },
  {
    icon: Star,
    title: "Real Results",
    desc: "We solve problems others walk away from. Complex electrical issues, transmission failures, coding nightmares — we fix them.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            Who We Are
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Built on Passion.<br />
            <span className="text-cyan">Driven by Precision.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            BimmerNext is not just another workshop. We are a team of ex-BMW trained technicians 
            who decided to bring genuine specialist service to Ajman — without the dealership price tag.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-80 md:h-[480px] overflow-hidden">
              <img
                src="/YYGYGY.JPG"
                alt="BimmerNext Workshop"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div>
              <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
                Our Story
              </p>
              <h2
                className="text-3xl md:text-4xl text-black-main uppercase tracking-tight leading-[0.95] mb-6"
                style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
              >
                From a Garage Dream to <span className="text-cyan">Ajman&apos;s Best.</span>
              </h2>
              <div className="space-y-4 text-muted-custom text-sm leading-relaxed">
                <p>
                  It started with a single technician who spent years inside BMW dealerships, 
                  learning every system, every module, every quirk of German engineering. 
                  He saw customers paying premium prices for mediocre service — and knew there was a better way.
                </p>
                <p>
                  In 2014, BimmerNext opened its doors in Ajman. No fluff. No upselling. 
                  Just honest, expert-level care for BMW, MINI, and Rolls-Royce owners who 
                  demand the best for their vehicles.
                </p>
                <p>
                  Today, we&apos;ve served over 1,000 cars, built a reputation as the go-to 
                  specialist for complex issues, and grown into a team of passionate technicians 
                  who share the same obsession with perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-black-main text-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
              Our Values
            </p>
            <h2
              className="text-3xl md:text-4xl uppercase tracking-tight leading-[0.95]"
              style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
            >
              What Drives Us Every Day
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-black-elevated border border-white/5 p-6 rounded-2xl hover:border-cyan/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-cyan" />
                </div>
                <h3 className="font-ui font-bold text-white uppercase tracking-wide mb-2">
                  {v.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-cream py-12 border-y border-black-main/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {[
              { value: "10+", label: "YEARS OF EXPERIENCE" },
              { value: "1,000+", label: "CARS SERVED" },
              { value: "95%", label: "CLIENT SATISFACTION" },
              { value: "3", label: "BRANDS SPECIALIZED" },
            ].map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <span className="text-3xl md:text-4xl font-bold text-black-main leading-none tracking-tight block">
                  {s.value}
                </span>
                <span className="text-xs font-bold text-black-main uppercase tracking-wide mt-1 block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-5xl text-black-main uppercase tracking-tight leading-[0.95] mb-4"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Experience the Difference.
          </h2>
          <p className="text-muted-custom text-sm mb-8 max-w-lg mx-auto">
            Book your inspection today and see why BMW, MINI & Rolls-Royce owners across Ajman trust BimmerNext.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1] hover:-translate-y-0.5"
          >
            Book Inspection <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
