const stats = [
  { img: "/1z.png", value: "10+", label: "YEARS OF\nEXPERIENCE" },
  { img: "/2z.png", value: "1000+", label: "CARS\nSERVED" },
  { img: "/3z.png", value: "95%", label: "CLIENT\nSATISFACTION" },
  { img: "/4z.png", value: "0", label: "COMPROMISES\nON QUALITY" },
];

export default function Stats() {
  return (
    <section className="bg-cream py-12 md:py-16 border-b border-black-main/10">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-0">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-4 md:gap-5">
              {/* Icon */}
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                <img src={s.img} alt={s.label} className="w-full h-full object-contain" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <span className="text-3xl md:text-4xl font-bold text-black-main leading-none tracking-tight">
                  {s.value}
                </span>
                <span className="text-[11px] md:text-xs font-bold text-black-main uppercase tracking-wide leading-tight mt-1 whitespace-pre-line">
                  {s.label}
                </span>
              </div>

              {/* Vertical divider (not on last item) */}
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-12 bg-black-main/15 ml-4 md:ml-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
