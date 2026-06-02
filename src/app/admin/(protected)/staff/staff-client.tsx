"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, Loader2, Shield, Trash2, ChevronDown, UserCheck, UserX } from "lucide-react";

const ROLES = ["owner","admin","technician","receptionist","staff"];
const ROLE_COLORS: Record<string, string> = {
  owner: "bg-[#00C2C7]/20 text-[#00C2C7]",
  admin: "bg-purple-500/20 text-purple-300",
  technician: "bg-amber-500/20 text-amber-300",
  receptionist: "bg-blue-500/20 text-blue-300",
  staff: "bg-white/10 text-white/50",
};

interface StaffMember {
  id: string; full_name: string; role: string;
  phone?: string; is_active: boolean; created_at: string;
}

export default function StaffClient({ staff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [role, setRole]         = useState("technician");
  const [password, setPassword] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    setError("");
    const supabase = createClient();

    // Create auth user via admin API (needs service role — use API route)
    const res = await fetch("/api/admin/create-staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, role, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Failed to create staff member.");
      setSaving(false);
      return;
    }
    setShowForm(false);
    setName(""); setEmail(""); setPhone(""); setPassword(""); setRole("technician");
    router.refresh();
    setSaving(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    const supabase = createClient();
    await supabase.from("profiles").update({ is_active: !active }).eq("id", id);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      {/* Create form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all"
        >
          <Plus size={16} /> Add Staff Member
        </button>
      ) : (
        <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-[#00C2C7]/20">
          <h2 className="text-xs font-bold tracking-widest text-[#00C2C7] uppercase mb-5">New Staff Account</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-style">Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ahmad Al-Rashid" className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ahmad@bimmernext.ae" className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 000 0000" className="input-style w-full" />
              </div>
              <div>
                <label className="label-style">Role</label>
                <div className="relative">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="input-style w-full appearance-none pr-8">
                    {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="label-style">Temporary Password *</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" className="input-style w-full" />
              </div>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
            )}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[#00C2C7] text-[#0A0A0A] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0094FF] hover:text-white transition-all disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                {saving ? "Creating…" : "Create Account"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff list */}
      <div className="bg-[#0A0A0A] rounded-2xl border border-white/5 overflow-hidden">
        {staff.length === 0 ? (
          <div className="p-12 text-center">
            <Shield size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No staff members yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#00C2C7]/10 flex items-center justify-center text-[#00C2C7] font-bold text-sm shrink-0">
                    {(member.full_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${member.is_active ? "text-white" : "text-white/40 line-through"}`}>
                        {member.full_name}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[member.role] || ROLE_COLORS.staff}`}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-white/30">{member.phone || "No phone"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => toggleActive(member.id, member.is_active)}
                    className={`p-2 rounded-lg transition-colors ${member.is_active ? "text-green-400/60 hover:text-red-400 hover:bg-red-400/10" : "text-white/20 hover:text-green-400 hover:bg-green-400/10"}`}
                    title={member.is_active ? "Deactivate" : "Activate"}
                  >
                    {member.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
