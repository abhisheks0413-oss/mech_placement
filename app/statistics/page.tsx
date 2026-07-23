import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { StatisticsView } from "@/components/public-data";

export default function StatisticsPage() {
  return <main className="min-h-screen bg-slate-50 dark:bg-[#030914]"><Nav /><section className="mx-auto max-w-7xl px-4 py-10"><h1 className="font-display text-4xl font-black text-navy dark:text-white">Placement Statistics</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Company package records, dashboards, tables, and charts.</p><div className="mt-8"><StatisticsView /></div></section><Footer /></main>;
}
