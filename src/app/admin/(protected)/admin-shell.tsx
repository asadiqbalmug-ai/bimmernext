"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, ClipboardList, FileText, Users, LogOut,
  Menu, X, ChevronRight, Car, Upload,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",   href: "/admin/dashboard",     icon: LayoutDashboard },
  { label: "Job Cards",   href: "/admin/jobs",           icon: ClipboardList   },
  { label: "Bulk Import", href: "/admin/bulk-import",    icon: Upload          },
  { label: "Invoices",    href: "/admin/invoices",       icon: FileText        },
  { label: "Staff",       href: "/admin/staff",          icon: Users           },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email?: string; name?: string; role?: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const initials = (user.name || user.email || "A").charAt(0).toUpperCase();

  const NavLinks = () => (
    <>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              active
                ? "bg-[#00C2C7] text-[#0A0A0A]"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <item.icon size={17} />
            {item.label}
            {active && <ChevronRight size={13} className="ml-auto" />}
          </Link>
        );
      })}
    </>
  );

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#00C2C7] flex items-center justify-center shrink-0">
          <Car size={18} className="text-[#0A0A0A]" />
        </div>
        <div>
          <p className="font-bold text-sm text-white tracking-wide">
            BIMMER<span className="text-[#00C2C7]">NEXT</span>
          </p>
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest">
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <NavLinks />
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <div className="px-4 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00C2C7]/20 flex items-center justify-center text-[#00C2C7] font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.name || user.email?.split("@")[0] || "Admin"}
            </p>
            <p className="text-[10px] text-white/30 capitalize">{user.role || "owner"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 bg-[#0A0A0A] border-r border-white/5 fixed h-full z-40">
        <SidebarInner />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-[#0A0A0A] border-r border-white/5 z-50 transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-3 border-b border-white/5">
          <button onClick={() => setMobileOpen(false)} className="text-white/40 p-1.5">
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-52px)]">
          <SidebarInner />
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-white/5 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="text-white/60 p-1">
            <Menu size={22} />
          </button>
          <span className="font-bold text-sm tracking-wide">
            BIMMER<span className="text-[#00C2C7]">NEXT</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-[#00C2C7]/20 flex items-center justify-center text-[#00C2C7] font-bold text-xs">
            {initials}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-7 max-w-6xl mx-auto w-full pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
