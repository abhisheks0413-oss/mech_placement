"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, BriefcaseBusiness, Cpu, Users } from "lucide-react";
import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { Counter } from "@/components/ui/counter";

const cards = [
  { icon: BriefcaseBusiness, title: "Opportunities", href: "/opportunities", text: "Internship and placement openings curated by the department." },
  { icon: BarChart3, title: "Package Records", href: "/statistics", text: "Company-wise package history, analytics, and year filters." },
  { icon: Users, title: "Alumni Insights", href: "/alumni", text: "Placement preparation notes and role stories from CET Mechanical alumni." }
];

export default function Home() {
  const [metrics, setMetrics] = useState({ recruiters: 0, peakPackage: 0, alumniNotes: 0 });

  useEffect(() => {
    async function loadMetrics() {
      const [stats, alumni] = await Promise.all([
        fetch("/api/statistics").then((res) => res.json()).catch(() => ({ data: [] })),
        fetch("/api/alumni").then((res) => res.json()).catch(() => ({ data: [] }))
      ]);
      const statRows = stats.data || [];
      setMetrics({
        recruiters: new Set(statRows.map((item: { company: string }) => item.company)).size,
        peakPackage: Math.max(0, ...statRows.map((item: { package: number }) => Number(item.package))),
        alumniNotes: (alumni.data || []).length
      });
    }
    loadMetrics();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(23,212,255,.20),transparent_34%),linear-gradient(135deg,#f7fbff,#eef5fb)] dark:bg-[radial-gradient(circle_at_top_left,rgba(23,212,255,.14),transparent_32%),linear-gradient(135deg,#030914,#07111f)]">
      <Nav />
      <section className="engineering-grid bg-grid relative mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr]">
        <div className="absolute right-8 top-16 hidden h-44 w-44 rounded-full border border-cyan/20 lg:block" />
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <p className="mb-4 inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-sm font-semibold text-navy dark:text-cyan">
            A Mechanical Association Initiative
          </p>
          <h1 className="font-display text-5xl font-black leading-tight text-navy dark:text-white md:text-7xl">
            Placement Website
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A centralized, professional platform for CET Mechanical students to discover opportunities, compare placement trends, and learn from alumni career journeys.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/opportunities" className="btn-primary">Explore Opportunities <ArrowRight size={18} /></Link>
            <Link href="/admin/login" className="btn-secondary">Admin Login</Link>
          </div>
        </motion.div>
        <motion.div className="relative" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.75, delay: 0.1 }}>
          <div className="glass rounded-xl p-5 shadow-panel">
            <div className="rounded-lg bg-navy p-5 text-white">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan">Department Dashboard</p>
                  <h2 className="font-display text-2xl font-bold">Mechanical Placement Hub</h2>
                </div>
                <Cpu className="text-cyan" />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-bold"><Counter value={metrics.recruiters} /></p>
                  <p className="text-xs text-slate-300">Recruiters</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-bold"><Counter value={metrics.peakPackage} suffix=" LPA" /></p>
                  <p className="text-xs text-slate-300">Peak Package</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-bold"><Counter value={metrics.alumniNotes} /></p>
                  <p className="text-xs text-slate-300">Alumni Notes</p>
                </div>
              </div>
              <div className="mt-5 h-44 rounded-lg border border-cyan/20 bg-[linear-gradient(120deg,rgba(23,212,255,.22),rgba(255,255,255,.06)),url('https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
            </div>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div key={card.title} whileHover={{ y: -6 }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <Link href={card.href} className="glass block h-full rounded-xl p-6 shadow-panel transition hover:border-cyan/50">
              <card.icon className="mb-4 text-cyan" size={30} />
              <h3 className="font-display text-xl font-bold">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{card.text}</p>
            </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
