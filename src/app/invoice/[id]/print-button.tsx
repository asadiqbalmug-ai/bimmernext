"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-[#00C2C7] text-[#0A0A0A] px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-[#0094FF] hover:text-white transition-all"
    >
      Print / Save as PDF
    </button>
  );
}
