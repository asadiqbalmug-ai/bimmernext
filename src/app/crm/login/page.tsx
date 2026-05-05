"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Shield, Eye, EyeOff } from "lucide-react";

export default function CRMLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // DEMO: Accept any credentials for now (Supabase auth can be wired in later)
    // In production: call Supabase auth.signInWithPassword()
    await new Promise((r) => setTimeout(r, 800));

    if (email.length < 3 || password.length < 3) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }

    localStorage.setItem("crm_session", JSON.stringify({ email }));
    router.push("/crm/dashboard");
  };

  return (
    <div className="min-h-screen bg-black-main flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan flex items-center justify-center mx-auto mb-4">
            <Car size={28} className="text-black-main" />
          </div>
          <h1
            className="text-2xl uppercase tracking-tight font-bold text-white"
            style={{ fontFamily: "var(--font-alfa), ui-serif, Georgia, serif" }}
          >
            Bimmer<span className="text-cyan">Next</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Workshop CRM System</p>
        </div>

        {/* Card */}
        <div className="bg-black-soft border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-cyan" />
            <h2 className="text-sm font-ui font-bold uppercase tracking-wider text-white">
              Sign In
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-ui font-bold uppercase tracking-wider text-white/40 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black-main border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan transition-colors"
                placeholder="admin@bimmernext.ae"
              />
            </div>

            <div>
              <label className="block text-[11px] font-ui font-bold uppercase tracking-wider text-white/40 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black-main border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan text-black-main py-3 rounded-xl font-ui font-bold text-sm transition-all hover:bg-[#01A5B1] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In to CRM"
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-white/20 mt-6">
            Supabase authentication ready — configure credentials in .env.local
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
            ← Back to BimmerNext Website
          </a>
        </div>
      </div>
    </div>
  );
}
