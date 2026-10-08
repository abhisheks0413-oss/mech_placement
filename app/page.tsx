"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BriefcaseBusiness, Users } from "lucide-react";
import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";

const cards = [
  { icon: BriefcaseBusiness, title: "Opportunities", href: "/opportunities", text: "Internship and placement openings curated by the department." },
  { icon: BarChart3, title: "Package Records", href: "/statistics", text: "Company-wise package history, analytics, and year filters." },
  { icon: Users, title: "Alumni Insights", href: "/alumni", text: "Placement preparation notes and role stories from CET Mechanical alumni." }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(212, 175, 55,.20),transparent_34%),linear-gradient(135deg,#f7fbff,#eef5fb)] dark:bg-[radial-gradient(circle_at_top_left,rgba(212, 175, 55,.14),transparent_32%),linear-gradient(135deg,#030914,#07111f)]">
      <Nav />
      <section className="engineering-grid bg-grid relative mx-auto flex min-h-[calc(100vh-68px)] max-w-4xl flex-col items-center justify-center gap-10 px-4 py-14 text-center">
        <div className="absolute right-8 top-16 hidden h-44 w-44 rounded-full border border-gold/20 lg:block" />
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="flex flex-col items-center">
          <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-navy dark:text-gold">
            A Mechanical Association Initiative
          </p>
          <h1 className="font-display text-5xl font-black leading-tight text-navy dark:text-white md:text-7xl">
            Placement Website
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A centralized, professional platform for CET Mechanical students to discover opportunities, compare placement trends, and learn from alumni career journeys.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/opportunities" className="btn-primary">Explore Opportunities <ArrowRight size={18} /></Link>
            <Link href="/admin/login" className="btn-secondary">Admin Login</Link>
          </div>
        </motion.div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div key={card.title} whileHover={{ y: -6 }} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
            <Link href={card.href} className="glass block h-full rounded-xl p-6 shadow-panel transition hover:border-gold/50">
              <card.icon className="mb-4 text-gold" size={30} />
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
