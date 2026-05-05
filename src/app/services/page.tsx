import { Activity, Cog, Zap, CircleDot, ShieldCheck, ArrowRight, Check } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Advanced Diagnostics",
    short: "Dealer-level scanning & advanced fault finding.",
    full: "We use BMW ISTA, INPA, and other factory-grade diagnostic tools to read every module in your vehicle. From engine management to hidden fault codes, we find problems that generic scanners miss entirely.",
    features: ["Full system scanning", "Hidden fault detection", "Live data analysis", "Module programming prep"],
    img: "/1w1.JPG",
  },
  {
    icon: Cog,
    title: "Engine & Transmission",
    short: "Expert in complex engine & gear box repairs.",
    full: "Our technicians have rebuilt hundreds of BMW and MINI engines and transmissions. Whether it's a timing chain rattle, turbo failure, or gearbox judder, we have the tools and experience to fix it right.",
    features: ["Timing chain replacement", "Turbo repairs", "Gearbox rebuilds", "Valvetronic service"],
    img: "/2w2.JPG",
  },
  {
    icon: Zap,
    title: "Electrical & Coding",
    short: "Programming, coding & electrical system repair.",
    full: "Modern BMWs are computers on wheels. We specialize in F and G series coding, retrofitting, module replacement, and chasing down the electrical gremlins that drive owners and other workshops crazy.",
    features: ["BMW ISTA programming", "Module coding & retrofitting", "Key programming", "Wiring fault tracing"],
    img: "/3w3.JPG",
  },
  {
    icon: CircleDot,
    title: "Suspension & Performance",
    short: "Suspension tuning, performance upgrades & more.",
    full: "From worn bushings to full coilover installs, we handle everything that keeps your BMW planted to the road. We also offer performance remaps and upgrades for those who want more from their drive.",
    features: ["Bushing & control arm replacement", "Coilover & spring installs", "Performance remapping", "Alignment & corner balancing"],
    img: "/4w4.JPG",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Maintenance",
    short: "Keep your car in perfect condition always.",
    full: "The best repair is the one you never need. Our preventive maintenance follows BMW's own schedules — but adapted to UAE heat and driving conditions. We catch issues before they become expensive problems.",
    features: ["Oil service & inspection", "Brake system overhaul", "Cooling system service", "Pre-purchase inspection"],
    img: "/5w5.JPG",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            What We Do
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Precision.<br />
            <span className="text-cyan">Performance. Perfection.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Every service we offer is built around one idea: German luxury cars deserve 
            specialist care. Not generalist guesswork. Here is everything we do — and how we do it better.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 space-y-16">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`grid md:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl md:[direction:ltr]">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-cyan flex items-center justify-center">
                  <s.icon size={24} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="md:[direction:ltr]">
                <h2
                  className="text-2xl md:text-3xl text-black-main uppercase tracking-tight leading-[0.95] mb-3"
                  style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
                >
                  {s.title}
                </h2>
                <p className="text-muted-custom text-sm font-ui font-semibold uppercase tracking-wide mb-4">
                  {s.short}
                </p>
                <p className="text-black-main/80 text-sm leading-relaxed mb-6">
                  {s.full}
                </p>
                <ul className="space-y-2 mb-6">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-black-main">
                      <span className="w-5 h-5 rounded-full bg-cyan flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-cyan text-black-main px-6 py-2.5 rounded-lg font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
                >
                  Book This Service <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black-main text-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-5xl uppercase tracking-tight leading-[0.95] mb-4"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Not Sure What You Need?
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
            Book a full diagnostic inspection. We will tell you exactly what your car needs — and what it does not.
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
