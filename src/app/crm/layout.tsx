"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wrench,
  LogOut,
  Car,
  Shield,
  ChevronRight,
  FileText,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/crm/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/crm/customers", icon: Users },
  { label: "Appointments", href: "/crm/appointments", icon: Calendar },
  { label: "Service Jobs", href: "/crm/services", icon: Wrench },
  { label: "Invoices", href: "/crm/invoices", icon: FileText },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, fetch from Supabase auth
    // For demo, check localStorage mock session
    const session = localStorage.getItem("crm_session");
    if (!session && pathname !== "/crm/login") {
      router.push("/crm/login");
      return;
    }
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser({ email: "admin@bimmernext.ae" });
      }
    }
    setLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("crm_session");
    router.push("/crm/login");
  };

  if (pathname === "/crm/login") return <>{children}</>;
  if (loading)
    return (
      <div className="min-h-screen bg-black-main flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black-main text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black-soft border-r border-white/5 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <Link href="/crm/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan flex items-center justify-center">
              <Car size={20} className="text-black-main" />
            </div>
            <div>
              <p className="font-ui font-bold text-white text-sm tracking-wide">
                BIMMER<span className="text-cyan">NEXT</span>
              </p>
              <p className="text-white/40 text-[10px] font-ui font-semibold uppercase tracking-widest">
                CRM System
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-ui font-semibold transition-all ${
                  isActive
                    ? "bg-cyan text-black-main"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
              <Shield size={14} className="text-cyan" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.email || "Admin"}</p>
              <p className="text-[10px] text-white/40">Workshop Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-ui font-semibold text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <LogOut size={18} />
            Sign Out
          </button>
          <Link
            href="/"
            className="block text-center text-[11px] text-white/30 hover:text-white/60 transition-colors py-2"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
