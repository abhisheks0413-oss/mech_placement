"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bar, Doughnut } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, ArcElement, Tooltip } from "chart.js";
import { CalendarClock, ExternalLink, FileText, IndianRupee, MessageSquareText, SlidersHorizontal, UserRound } from "lucide-react";
import { AlumniInsight, Opportunity, OpportunityUpdate, PlacementStat } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Counter } from "@/components/ui/counter";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

async function load<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  return json.data || [];
}

export function OpportunitiesView() {
  const [items, setItems] = useState<Opportunity[]>([]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("latest");
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [updates, setUpdates] = useState<OpportunityUpdate[]>([]);

  useEffect(() => { load<Opportunity>("/api/opportunities").then(setItems); }, []);
  useEffect(() => {
    if (!selected) return setUpdates([]);
    load<OpportunityUpdate>(`/api/opportunities/${selected.id}/updates`).then(setUpdates);
  }, [selected]);

  const filtered = useMemo(() => items
    .filter((item) => type === "All" || item.type === type)
    .filter((item) => item.company.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "deadline" ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [items, query, type, sort]);

  return (
    <>
      <Toolbar query={query} setQuery={setQuery} extra={<><select className="input" value={type} onChange={(e) => setType(e.target.value)}><option>All</option><option>Internship</option><option>Placement</option></select><select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="latest">Latest First</option><option value="deadline">Deadline Closest</option></select></>} />
      {items.length === 0 ? <EmptyState title="No opportunities available so far." text="New internships and placements will appear here once posted by the admin." /> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <motion.article
              key={item.id}
              className={`glass flex h-full min-h-[360px] flex-col rounded-xl p-5 shadow-panel ${item.status === "Applications Closed" ? "cursor-not-allowed opacity-60 grayscale" : ""}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={item.status === "Applications Closed" ? undefined : { y: -5 }}
            >
              <div className="flex items-start gap-3">
                <Logo src={item.logo} company={item.company} />
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-navy dark:text-gold">{item.type}</span>
                  <h3 className="mt-3 truncate font-display text-xl font-bold">{item.company}</h3>
                </div>
              </div>
              <p className="mt-3 h-20 overflow-hidden text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
              <Compensation item={item} />
              <div className="mt-auto pt-4">
              <p className="flex items-start gap-2 rounded-lg bg-white/60 p-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300"><CalendarClock className="mt-0.5 shrink-0 text-gold" size={16} /> <span><span className="block text-xs font-semibold uppercase text-slate-400">Application closes</span>{formatDateTime(item.deadline)}</span></p>
              <button className="btn-primary mt-5 w-full" disabled={item.status === "Applications Closed"} onClick={() => setSelected(item)}>
                {item.status === "Applications Closed" ? "Applications Closed" : "View Details"}
              </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.company || "Opportunity"}>
        {selected && <div className="space-y-5 text-sm">
          <div className="flex items-center gap-4">
            <Logo src={selected.logo} company={selected.company} large />
            <div><p className="font-semibold">{selected.type}</p><p className="text-slate-500">{selected.status}</p></div>
          </div>
          <p className="leading-7 text-slate-700 dark:text-slate-300">{selected.description}</p>
          <Compensation item={selected} detailed />
          <div className="space-y-2">
            <p className="font-semibold">Application Links</p>
            {selected.applicationLinks?.length ? selected.applicationLinks.map((link) => (
              <a key={`${link.name}-${link.url}`} className="flex items-center gap-2 text-gold" href={link.url} target="_blank">
                <ExternalLink size={16} /> {link.name}
              </a>
            )) : <a className="btn-primary" href={selected.applicationLink} target="_blank">Application Link <ExternalLink size={16} /></a>}
          </div>
          <div><p className="font-semibold">Application Deadline</p><p>{formatDateTime(selected.deadline)}</p></div>
          <div><p className="font-semibold">Date Posted</p><p>{formatDateOnly(selected.createdAt)}</p></div>
          <div className="space-y-2"><p className="font-semibold">Attached Documents</p>{selected.documents.length ? selected.documents.map((doc) => <a key={`${doc.name}-${doc.url}`} className="flex items-center gap-2 text-gold" href={doc.url} target="_blank"><FileText size={16} /> {doc.name}</a>) : <p>No documents attached.</p>}</div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="mb-3 flex items-center gap-2 font-semibold"><MessageSquareText size={17} /> Admin Updates</p>
            {updates.length ? updates.map((update) => <div key={update.id} className="border-t border-slate-200 py-3 first:border-t-0 dark:border-white/10"><p className="leading-6">{update.message}</p><p className="mt-1 text-xs text-slate-500">{formatDateTime(update.createdAt)}</p></div>) : <p className="text-slate-500">No updates have been posted yet.</p>}
          </div>
        </div>}
      </Modal>
    </>
  );
}

export function StatisticsView() {
  const [items, setItems] = useState<PlacementStat[]>([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("All");
  const [sort, setSort] = useState("desc");
  useEffect(() => { load<PlacementStat>("/api/statistics").then(setItems); }, []);
  const years = Array.from(new Set(items.flatMap((item) => item.years || []))).sort((a, b) => b - a);
  const filtered = useMemo(() => items.filter((item) => year === "All" || item.years.includes(Number(year))).filter((item) => item.company.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (sort === "asc" ? packageNumber(a.package) - packageNumber(b.package) : packageNumber(b.package) - packageNumber(a.package))), [items, query, year, sort]);
  const priced = filtered.filter((item) => item.package !== null && Number.isFinite(Number(item.package)));
  const highest = priced.length ? Math.max(...priced.map((item) => Number(item.package))) : null;
  const avg = priced.length ? priced.reduce((sum, item) => sum + Number(item.package), 0) / priced.length : null;
  const chartData = { labels: priced.map((item) => item.company), datasets: [{ label: "Package (LPA)", data: priced.map((item) => Number(item.package)), backgroundColor: "rgba(212, 175, 55,.72)", borderRadius: 8 }] };
  return items.length === 0 ? <EmptyState title="No placement statistics available so far." text="Company package records and charts will be shown here." /> : (
    <div className="space-y-6">
      <Toolbar query={query} setQuery={setQuery} extra={<><select className="input" value={year} onChange={(e) => setYear(e.target.value)}><option>All</option>{years.map((item) => <option key={item}>{item}</option>)}</select><select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="desc">Package High to Low</option><option value="asc">Package Low to High</option></select></>} />
      <div className="grid gap-4 md:grid-cols-3"><Metric title="Total Companies" value={filtered.length} /><Metric title="Highest Package" value={highest === null ? "Data Not Available" : highest} suffix=" LPA" /><Metric title="Average Package" value={avg === null ? "Data Not Available" : avg} suffix=" LPA" /></div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_.8fr]">{priced.length ? <><div className="glass rounded-xl p-5 shadow-panel"><Bar data={chartData} /></div><div className="glass rounded-xl p-5 shadow-panel"><Doughnut data={chartData} /></div></> : <div className="glass rounded-xl p-6 text-sm text-slate-500 shadow-panel lg:col-span-2">No package values have been entered yet.</div>}</div>
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10"><table className="w-full bg-white/70 text-sm dark:bg-white/5"><thead className="bg-navy text-left text-white"><tr><th className="p-4">Company</th><th className="p-4">Package/LPA</th><th className="p-4">Mode</th><th className="p-4">Years</th><th className="p-4">Notes</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-slate-100 dark:border-white/10"><td className="p-4 font-semibold">{item.company}</td><td className="p-4">{formatPackage(item.package)}</td><td className="p-4">{item.placementMode || "On Campus"}</td><td className="p-4">{item.years.join(", ")}</td><td className="p-4">{item.notes || "-"}</td></tr>)}</tbody></table></div>
    </div>
  );
}

export function AlumniView() {
  const [items, setItems] = useState<AlumniInsight[]>([]);
  const [selected, setSelected] = useState<AlumniInsight | null>(null);
  useEffect(() => { load<AlumniInsight>("/api/alumni").then(setItems); }, []);
  return items.length === 0 ? <EmptyState title="No alumni insights available so far." text="Alumni placement stories will appear here once added." /> : (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item, index) => <motion.button key={item.id} className="glass rounded-xl p-5 text-left shadow-panel" onClick={() => setSelected(item)} whileHover={{ y: -5 }} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gold/15 text-gold"><UserRound /></div><div><h3 className="font-display text-lg font-bold">{item.name}</h3><p className="text-sm text-slate-500">{item.position}</p></div></div><p className="mt-4 text-sm font-semibold">{item.company} - Passout {item.passoutYear}</p><p className="mt-1 text-sm text-gold">CTC obtained: {formatCtc(item.ctc)}</p><p className="mt-1 text-xs text-slate-500">{item.placementMode || "On Campus"}</p><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.review}</p></motion.button>)}</div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || "Alumni Insight"}>{selected && <div className="space-y-3"><p className="text-sm font-semibold text-gold">{selected.position} at {selected.company} - Passout {selected.passoutYear} - CTC {formatCtc(selected.ctc)}</p><p className="text-sm text-slate-500">CTC may be shown as Data Not Available when blank or zero.</p><p className="leading-7 text-slate-700 dark:text-slate-300">{selected.review}</p></div>}</Modal>
    </>
  );
}

function Toolbar({ query, setQuery, extra }: { query: string; setQuery: (value: string) => void; extra: React.ReactNode }) {
  return <div className="glass mb-6 grid gap-3 rounded-xl p-4 shadow-panel md:grid-cols-[minmax(260px,1fr)_auto_auto]"><input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by company name" /><div className="flex items-center gap-2 text-sm text-slate-500"><SlidersHorizontal size={17} /> Filters</div>{extra}</div>;
}

function Metric({ title, value, suffix = "" }: { title: string; value: number | string; suffix?: string }) {
  return <div className="glass rounded-xl p-5 shadow-panel"><p className="text-sm text-slate-500">{title}</p><p className="mt-2 font-display text-3xl font-bold text-navy dark:text-white">{typeof value === "number" ? <Counter value={value} suffix={suffix} /> : value}</p></div>;
}

function Logo({ src, company, large = false }: { src?: string | null; company: string; large?: boolean }) {
  const size = large ? "h-16 w-16" : "h-12 w-12";
  return <div className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-sm font-bold text-navy shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-gold`}>{src ? <img src={src} alt={`${company} logo`} className="h-full w-full object-cover" /> : company.slice(0, 2).toUpperCase()}</div>;
}

function formatPackage(value: number | null) {
  return value === null || Number.isNaN(Number(value)) ? "Data Not Available" : `${Number(value).toFixed(2)} LPA`;
}

function packageNumber(value: number | null) {
  return value === null || Number.isNaN(Number(value)) ? -Infinity : Number(value);
}

function Compensation({ item, detailed = false }: { item: Opportunity; detailed?: boolean }) {
  const label = item.type === "Internship" ? "Stipend" : "Expected CTC";
  if (!item.compensation?.length) return null;
  const offers = item.type === "Internship" ? item.compensation.slice(0, 1) : item.compensation;
  return <div className={`mt-4 ${detailed ? "space-y-2" : "flex flex-wrap gap-2"}`}>{detailed && <p className="font-semibold">{label}</p>}{offers.map((offer, index) => <span key={`${offer.label}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white"><IndianRupee size={13} /> {item.type === "Internship" ? `${offer.amount}/month` : `${offer.label}: ${offer.amount} LPA · ${slabFor(offer.amount)}`}</span>)}</div>;
}

function slabFor(ctc: number) {
  if (ctc <= 6) return "Slab 1";
  if (ctc < 12) return "Slab 2";
  return "Slab 3";
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Not Available";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true
  }).format(date);
}

function formatDateOnly(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Not Available";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatCtc(value: number | null) {
  if (value === null || value === undefined || Number(value) === 0) return "Not Available";
  return `${Number(value).toFixed(2)} LPA`;
}
