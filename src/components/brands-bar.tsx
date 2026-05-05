export default function BrandsBar() {
  return (
    <section className="bg-black-soft border-y border-white/5 py-5">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        {/* Left text */}
        <p className="text-xs font-ui font-bold tracking-[0.2em] text-cyan uppercase hidden md:block text-left">
          WE SPECIALIZE IN
        </p>

        {/* Logos — centered */}
        <div className="flex items-center justify-center gap-8 md:gap-12">
          <img
            src="/bmwlogo.png"
            alt="BMW"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <img
            src="/minilogo-removebg-preview (3).png"
            alt="MINI"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <div className="hidden md:block w-px h-8 bg-white/20" />
          <img
            src="/rrlogo11.JPG"
            alt="Rolls-Royce"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        {/* Right text */}
        <p className="text-xs font-ui font-bold tracking-[0.15em] uppercase hidden md:block text-right leading-relaxed">
          <span className="text-cyan">ONLY GERMAN LUXURY.</span><br /><span className="text-gray-400">ONLY THE BEST.</span>
        </p>
      </div>
    </section>
  );
}
