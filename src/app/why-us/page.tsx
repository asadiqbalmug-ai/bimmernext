import { Check, ArrowRight, ShieldCheck, Award, Wrench, Clock, Users } from "lucide-react";

const reasons = [
  {
    icon: Wrench,
    title: "Ex-BMW Trained Technicians",
    desc: "Our lead technician spent years inside BMW dealerships. He knows these cars inside and out — from E30 classics to the latest G80 M3s.",
  },
  {
    icon: Users,
    title: "Hands-On Owner Involvement",
    desc: "The founder personally inspects and oversees major repairs. You're not dealing with a corporate chain — you're dealing with someone who owns the outcome.",
  },
  {
    icon: ShieldCheck,
    title: "We Fix What Others Walk Away From",
    desc: "Electrical nightmares, transmission rebuilds, coding mysteries — these are our bread and butter. If another workshop gave up, bring it to us.",
  },
  {
    icon: Award,
    title: "Dealer-Level Tools, Workshop Prices",
    desc: "We run BMW ISTA, coding software, and factory diagnostic equipment. You get dealership accuracy without the dealership invoice.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround, Honest Communication",
    desc: "No waiting weeks for a diagnosis. We communicate clearly, work quickly, and never upsell you on services your car doesn't need.",
  },
];

const bullets = [
  "Ex-BMW trained technicians",
  "Hands-on owner involvement",
  "Specialists in complex issues",
  "Premium service approach",
  "Hundreds of happy clients in Ajman",
];

export default function WhyUsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            Why BimmerNext
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Expertise You Can Trust.<br />
            <span className="text-cyan">Results You Can Feel.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            There are hundreds of workshops in Ajman. But only one where the technician 
            is as obsessed with your car as you are. Here is why we are different.
          </p>
        </div>
      </section>

      {/* Reasons Grid */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main feature card */}
            <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-2 gap-12 items-center mb-8">
              <div className="relative h-72 md:h-96 overflow-hidden">
                <img
                  src="/YYGYGY.JPG"
                  alt="BimmerNext Workshop"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
                  The BimmerNext Difference
                </p>
                <h2
                  className="text-3xl md:text-4xl text-black-main uppercase tracking-tight leading-[0.95] mb-6"
                  style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
                >
                  We Don&apos;t Just Fix Cars.<br />
                  <span className="text-cyan">We Solve Problems.</span>
                </h2>
                <p className="text-muted-custom text-sm leading-relaxed mb-6">
                  Built on passion, precision and experience. Our founder works hands-on 
                  with every car. We don&apos;t just fix cars — we solve problems others couldn&apos;t.
                </p>
                <ul className="space-y-3">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-black-main text-sm">
                      <span className="w-5 h-5 rounded-full bg-cyan flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {reasons.map((r) => (
              <div
                key={r.title}
                className="bg-white border border-black-main/5 p-6 rounded-2xl hover:border-cyan/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                  <r.icon size={22} className="text-cyan" />
                </div>
                <h3 className="font-ui font-bold text-black-main uppercase tracking-wide mb-2">
                  {r.title}
                </h3>
                <p className="text-muted-custom text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black-main text-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-5xl uppercase tracking-tight leading-[0.95] mb-4"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Stop Guessing.<br />
            <span className="text-cyan">Bring It to the Specialists.</span>
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
            BMW. MINI. ROLLS-ROYCE. Only The Best.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
            >
              Book Inspection <ArrowRight size={16} />
            </a>
            <a
              href="https://wa.me/971523842422"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-cyan text-cyan px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-cyan/10"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
