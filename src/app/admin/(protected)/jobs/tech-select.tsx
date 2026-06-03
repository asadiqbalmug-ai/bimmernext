"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

interface StaffMember { id: string; full_name: string; role: string }

export function TechSelect({
  selected,
  staff,
  onChange,
}: {
  selected: string[];
  staff: StaffMember[];
  onChange: (names: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const techStaff = staff.filter((s) => s.role !== "owner");

  const toggle = (name: string) =>
    onChange(
      selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]
    );

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1 items-center min-h-[28px]">
        {selected.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
          >
            {name.split(" ")[0]}
            <button
              type="button"
              onClick={() => onChange(selected.filter((n) => n !== name))}
              className="opacity-50 hover:opacity-100 hover:text-red-400 leading-none ml-0.5"
            >
              ×
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-white/25 hover:text-[#00C2C7] transition-colors"
        >
          <Plus size={10} />
          Tech
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            {techStaff.length === 0 ? (
              <p className="px-3 py-3 text-xs text-white/30 text-center">
                No staff yet — add via Staff tab
              </p>
            ) : (
              techStaff.map((s) => {
                const active = selected.includes(s.full_name);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.full_name)}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2.5 transition-colors hover:bg-white/5 ${
                      active ? "text-[#00C2C7]" : "text-white/60"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                        active ? "bg-[#00C2C7] border-[#00C2C7]" : "border-white/20"
                      }`}
                    >
                      {active && <Check size={9} className="text-[#0A0A0A]" />}
                    </span>
                    {s.full_name}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
