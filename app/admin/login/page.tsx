"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Lock, LogIn } from "lucide-react";
import { Nav } from "@/components/ui/nav";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password, remember }) });
    setLoading(false);
    if (!res.ok) return toast.error("Invalid username or password");
    toast.success("Welcome back");
    router.push("/admin");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(212, 175, 55,.18),transparent_32%),linear-gradient(135deg,#f7fbff,#eef5fb)] dark:bg-[radial-gradient(circle_at_top,rgba(212, 175, 55,.12),transparent_32%),linear-gradient(135deg,#030914,#07111f)]">
      <Nav />
      <section className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
        <form onSubmit={submit} className="glass w-full max-w-md rounded-xl p-7 shadow-panel">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold"><Lock /></div>
          <h1 className="font-display text-3xl font-black text-navy dark:text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Secure access for Mechanical Association placement coordinators.</p>
          <div className="mt-6 space-y-4">
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
            <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember Login</label>
            <button disabled={loading} className="btn-primary w-full"><LogIn size={18} /> {loading ? "Signing in..." : "Login"}</button>
            <Link className="block text-center text-sm text-gold" href="/">Back to portal</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
