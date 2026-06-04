"use client";

import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

const STATUSES = ["all", "Draft", "Open", "In Progress", "Waiting Parts", "Ready", "Completed", "Cancelled"];

export default function JobsSearch({
  defaultQ,
  defaultStatus,
}: {
  defaultQ?: string;
  defaultStatus?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (q: string, status: string) => {
      const p = new URLSearchParams();
      if (q) p.set("q", q);
      if (status && status !== "all") p.set("status", status);
      startTransition(() => {
        router.push(`/admin/jobs?${p.toString()}`);
      });
    },
    [router]
  );

  const currentStatus = defaultStatus || "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          defaultValue={defaultQ}
          onChange={(e) => update(e.target.value, currentStatus)}
          placeholder="Search name, plate, VIN, job number…"
          className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-[#00C2C7]/40 placeholder:text-white/20 transition-colors"
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => update(defaultQ || "", s)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize whitespace-nowrap ${
              currentStatus === s
                ? "bg-[#00C2C7] text-[#0A0A0A]"
                : "bg-[#0A0A0A] text-white/40 border border-white/10 hover:text-white"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>
    </div>
  );
}
