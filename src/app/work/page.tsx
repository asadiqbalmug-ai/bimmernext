import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "BMW M4 Engine Rebuild",
    desc: "Complete timing chain, VANOS, and valvetronic overhaul. Car running better than new.",
    img: "/1a.JPG",
    tags: ["Engine", "M4"],
  },
  {
    title: "MINI Cooper S Transmission",
    desc: "Automatic gearbox rebuild with new mechatronic unit. Jerking and harsh shifts eliminated.",
    img: "/2a.JPG",
    tags: ["Transmission", "MINI"],
  },
  {
    title: "BMW 7 Series Coding",
    desc: "Retrofit blind spot monitoring, ambient lighting control, and hidden feature activation.",
    img: "/3a.JPG",
    tags: ["Coding", "7 Series"],
  },
  {
    title: "Rolls-Royce Ghost Detailing",
    desc: "Full paint correction, ceramic coating, and interior leather restoration.",
    img: "/4a.JPG",
    tags: ["Detailing", "Rolls-Royce"],
  },
  {
    title: "BMW X5 Suspension Overhaul",
    desc: "Complete front and rear suspension refresh with air suspension rebuild.",
    img: "/5a.JPG",
    tags: ["Suspension", "X5"],
  },
];

export default function WorkPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-black-main text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-cyan text-xs font-ui font-bold tracking-widest uppercase mb-4">
            Our Work
          </p>
          <h1
            className="text-4xl md:text-6xl uppercase tracking-tight leading-[0.95] mb-6"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Cars We&apos;ve<br />
            <span className="text-cyan">Brought Back to Life.</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">
            Every car tells a story. These are the transformations, repairs, and restorations 
            that made us Ajman&apos;s most trusted BMW, MINI & Rolls-Royce workshop.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.title}
                className="group relative overflow-hidden bg-black-main"
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black-main/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex gap-2 mb-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-ui font-bold uppercase tracking-wider bg-cyan/20 text-cyan px-2 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3
                    className="text-xl text-white uppercase tracking-tight leading-tight mb-2"
                    style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black-main text-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2
            className="text-3xl md:text-5xl uppercase tracking-tight leading-[0.95] mb-4"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Want Your Car Featured Here?
          </h2>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
            Bring your BMW, MINI, or Rolls-Royce to us and let&apos;s make it shine again.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-cyan text-black-main px-7 py-3 rounded-xl font-ui font-bold text-sm transition-all duration-300 hover:bg-[#01A5B1]"
          >
            Book Inspection <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
