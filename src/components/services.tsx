import { Activity, Cog, Zap, CircleDot, ShieldCheck, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Advanced Diagnostics",
    desc: "Dealer-level scanning & advanced fault finding.",
    img: "/1w1.JPG",
  },
  {
    icon: Cog,
    title: "Engine & Transmission",
    desc: "Expert in complex engine & gear box repairs.",
    img: "/2w2.JPG",
  },
  {
    icon: Zap,
    title: "Electrical & Coding",
    desc: "Programming, coding & electrical system repair.",
    img: "/3w3.JPG",
  },
  {
    icon: CircleDot,
    title: "Suspension & Performance",
    desc: "Suspension tuning, performance upgrades & more.",
    img: "/4w4.JPG",
  },
  {
    icon: ShieldCheck,
    title: "Preventive Maintenance",
    desc: "Keep your car in perfect condition always.",
    img: "/5w5.JPG",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-cream py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-xs font-ui font-bold tracking-widest text-muted-custom uppercase mb-3">
          Our Services
        </p>
        <h2
          className="text-3xl md:text-5xl text-black-main mb-10 uppercase tracking-tight"
          style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
        >
          Precision. Performance. Perfection.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="group bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Cyan icon badge */}
                <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-cyan flex items-center justify-center">
                  <s.icon size={20} className="text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-ui font-bold text-black-main uppercase tracking-wide mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-custom text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-2 border border-black-main text-black-main px-7 py-3 rounded-xl font-ui font-semibold text-sm transition-all duration-300 hover:bg-black-main hover:text-white"
          >
            View All Services <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
