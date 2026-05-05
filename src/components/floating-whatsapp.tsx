"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubble */}
      {open && (
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-4 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-cyan flex items-center justify-center">
              <MessageCircle size={20} className="text-black-main" />
            </div>
            <div>
              <p className="text-sm font-bold text-black-main">BimmerNext</p>
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Typically replies in minutes
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-black-main/30 hover:text-black-main transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <div className="bg-cream rounded-xl p-3 mb-3">
            <p className="text-xs text-black-main/80 leading-relaxed">
              Hi there! How can we help with your BMW, MINI, or Rolls-Royce today?
            </p>
          </div>
          <a
            href="https://wa.me/971523842422"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-cyan text-black-main py-2.5 rounded-xl font-ui font-bold text-sm transition-all hover:bg-[#01A5B1]"
          >
            <MessageCircle size={16} />
            Start Chat on WhatsApp
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-cyan shadow-[0_4px_20px_rgba(0,194,199,0.4)] flex items-center justify-center text-black-main transition-all hover:scale-110 hover:shadow-[0_6px_30px_rgba(0,194,199,0.5)] active:scale-95"
        aria-label="Open WhatsApp chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
