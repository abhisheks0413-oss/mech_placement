import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { AlumniView } from "@/components/public-data";

export default function AlumniPage() {
  return <main className="min-h-screen bg-slate-50 dark:bg-[#030914]"><Nav /><section className="mx-auto max-w-7xl px-4 py-10"><h1 className="font-display text-4xl font-black text-navy dark:text-white">Alumni Insights</h1><p className="mt-2 text-slate-600 dark:text-slate-400">Placement preparation stories and role insights from Mechanical alumni.</p><div className="mt-8"><AlumniView /></div></section><Footer /></main>;
}
