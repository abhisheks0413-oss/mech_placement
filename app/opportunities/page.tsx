import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { OpportunitiesView } from "@/components/public-data";

export default function OpportunitiesPage() {
  return <Shell title="Opportunities" subtitle="Internships and placements posted by the department."><OpportunitiesView /></Shell>;
}

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main className="min-h-screen bg-slate-50 dark:bg-[#030914]"><Nav /><section className="mx-auto max-w-7xl px-4 py-10"><h1 className="font-display text-4xl font-black text-navy dark:text-white">{title}</h1><p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p><div className="mt-8">{children}</div></section><Footer /></main>;
}
