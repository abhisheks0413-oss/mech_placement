"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BarChart3, BriefcaseBusiness, LogOut, Plus, Trash2, Users, Pencil, Upload, MessageSquareText, X } from "lucide-react";
import { AlumniInsight, Opportunity, PlacementStat } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { Counter } from "@/components/ui/counter";

type Section = "opportunities" | "statistics" | "alumni";
type AdminRow = Opportunity | PlacementStat | AlumniInsight;

const blankOpportunity = { type: "Internship", status: "Applications Open", company: "", description: "", applicationLink: "", applicationLinks: [{ name: "Application Form", url: "" }], deadline: "", deadlineDate: "", deadlineTime: "", stipend: "", compensation: [{ label: "Offer 1", amount: 0 }], documents: [], logo: "" };
const blankStatistic = { company: "", package: "", placementMode: "On Campus", years: [new Date().getFullYear()], notes: "" };
const blankAlumni = { name: "", company: "", passoutYear: new Date().getFullYear(), position: "", placementMode: "On Campus", ctc: "", review: "" };

export function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("opportunities");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [statistics, setStatistics] = useState<PlacementStat[]>([]);
  const [alumni, setAlumni] = useState<AlumniInsight[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [modal, setModal] = useState<Section | null>(null);

  async function refresh() {
    const [opp, stat, alum] = await Promise.all([fetch("/api/opportunities").then((r) => r.json()), fetch("/api/statistics").then((r) => r.json()), fetch("/api/alumni").then((r) => r.json())]);
    setOpportunities(opp.data || []);
    setStatistics(stat.data || []);
    setAlumni(alum.data || []);
  }

  useEffect(() => { refresh(); }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const cards = [
    { label: "Total Opportunities", value: opportunities.length, icon: BriefcaseBusiness },
    { label: "Total Companies", value: new Set(statistics.map((item) => item.company)).size, icon: BarChart3 },
    { label: "Total Alumni Reviews", value: alumni.length, icon: Users }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#030914]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-ink/80 lg:block">
          <h1 className="font-display text-2xl font-black text-navy dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">CET Mechanical placements</p>
          <nav className="mt-8 space-y-2">
            <SideButton active={section === "opportunities"} onClick={() => setSection("opportunities")} icon={BriefcaseBusiness} label="Manage Opportunities" />
            <SideButton active={section === "statistics"} onClick={() => setSection("statistics")} icon={BarChart3} label="Manage Placement Statistics" />
            <SideButton active={section === "alumni"} onClick={() => setSection("alumni")} icon={Users} label="Manage Alumni Insights" />
          </nav>
          <button className="btn-secondary mt-3 w-full" onClick={logout}><LogOut size={17} /> Logout</button>
        </aside>
        <section className="flex-1 p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><h2 className="font-display text-3xl font-black text-navy dark:text-white">Dashboard Home</h2><p className="text-sm text-slate-500">Create, update, delete, and publish records without a page refresh.</p></div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary lg:hidden" onClick={logout}><LogOut size={17} /> Logout</button>
            </div>
          </div>
          <div className="mb-8 grid gap-4 md:grid-cols-3">{cards.map((card) => <div key={card.label} className="glass rounded-xl p-5 shadow-panel"><card.icon className="text-gold" /><p className="mt-4 text-sm text-slate-500">{card.label}</p><p className="font-display text-3xl font-bold"><Counter value={card.value} /></p></div>)}</div>
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden"><button className="btn-secondary" onClick={() => setSection("opportunities")}>Opportunities</button><button className="btn-secondary" onClick={() => setSection("statistics")}>Statistics</button><button className="btn-secondary" onClick={() => setSection("alumni")}>Alumni</button></div>
          <CrudPanel section={section} opportunities={opportunities} statistics={statistics} alumni={alumni} onAdd={() => { setEditing(null); setModal(section); }} onEdit={(item: AdminRow) => { setEditing(item); setModal(section); }} onDelete={async (id: number) => { if (!confirm("Delete this record?")) return; await remove(section, id); toast.success("Deleted"); refresh(); }} />
        </section>
      </div>
      <Modal title={editing ? "Update Record" : "Create Record"} open={!!modal} onClose={() => setModal(null)}>
        {modal === "opportunities" && <OpportunityForm initial={editing || blankOpportunity} onDone={() => { setModal(null); refresh(); }} />}
        {modal === "statistics" && <StatisticForm initial={editing || blankStatistic} onDone={() => { setModal(null); refresh(); }} />}
        {modal === "alumni" && <AlumniForm initial={editing || blankAlumni} onDone={() => { setModal(null); refresh(); }} />}
      </Modal>
    </main>
  );
}

function SideButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${active ? "bg-gold/15 text-navy dark:text-gold" : "hover:bg-slate-100 dark:hover:bg-white/10"}`}><Icon size={18} /> {label}</button>;
}

function CrudPanel({ section, opportunities, statistics, alumni, onAdd, onEdit, onDelete }: any) {
  const rows = section === "opportunities" ? opportunities : section === "statistics" ? statistics : alumni;
  return <div className="glass rounded-xl p-5 shadow-panel"><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-xl font-bold">{section === "opportunities" ? "Manage Opportunities" : section === "statistics" ? "Manage Placement Statistics" : "Manage Alumni Insights"}</h3><button className="btn-primary" onClick={onAdd}><Plus size={17} /> Add</button></div><div className="overflow-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b border-slate-200 text-left dark:border-white/10"><th className="p-3">Primary</th><th className="p-3">Details</th><th className="p-3">{section === "opportunities" ? "Application Deadline" : section === "statistics" ? "Years" : "Passout"}</th><th className="p-3 text-right">Actions</th></tr></thead><tbody>{rows.map((row: any) => <tr key={row.id} className="border-b border-slate-100 dark:border-white/10"><td className="p-3 font-semibold">{row.company || row.name}</td><td className="p-3 text-slate-500">{row.type || row.position || (section === "statistics" ? `${formatPackage(row.package)} (${row.placementMode || "On Campus"})` : `${row.package} LPA`)}</td><td className="p-3">{row.deadline ? formatForTable(row.deadline) : Array.isArray(row.years) ? row.years.join(", ") : row.year || row.passoutYear}</td><td className="p-3 text-right"><button className="icon-btn mr-2" onClick={() => onEdit(row)} aria-label="Edit"><Pencil size={16} /></button><button className="icon-btn" onClick={() => onDelete(row.id)} aria-label="Delete"><Trash2 size={16} /></button></td></tr>)}</tbody></table>{rows.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No records yet.</p>}</div></div>;
}

async function remove(section: Section, id: number) {
  const base = section === "opportunities" ? "opportunities" : section === "statistics" ? "statistics" : "alumni";
  await fetch(`/api/${base}/${id}`, { method: "DELETE" });
}

function OpportunityForm({ initial, onDone }: any) {
  const initialDeadline = splitDateTime(initial.deadline);
  const today = localDateString(new Date());
  const nowTime = localTimeString(new Date());
  const [form, setForm] = useState<any>({
    ...initial,
    deadline: toDateTimeLocal(initial.deadline),
    deadlineDate: initialDeadline.date,
    deadlineTime: initialDeadline.time,
    applicationLinks: initial.applicationLinks?.length ? initial.applicationLinks : [{ name: "Application Form", url: initial.applicationLink || "" }],
    compensation: initial.compensation?.length ? initial.compensation : [{ label: "Offer 1", amount: 0 }],
    documents: normalizeDocuments(initial.documents || [])
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [updates, setUpdates] = useState<any[]>([]);
  const id = initial.id;
  useEffect(() => {
    if (!id) return;
    fetch(`/api/opportunities/${id}/updates`).then((res) => res.json()).then((json) => setUpdates(json.data || []));
  }, [id]);
  async function upload(files: FileList | null, key: "documents" | "logo") {
    if (!files?.length) return;
    const body = new FormData();
    Array.from(files).forEach((file) => body.append("files", file));
    const res = await fetch("/api/opportunities/upload", { method: "POST", body });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Upload failed");
    setForm((current: any) => key === "logo" ? { ...current, logo: json.data[0] } : { ...current, documents: [...(current.documents || []), ...json.data.map((url: string) => ({ name: cleanFileName(url), url }))] });
    toast.success("Uploaded");
  }
  function setOffer(index: number, key: "label" | "amount", value: string) {
    setForm((current: any) => ({ ...current, compensation: current.compensation.map((offer: any, i: number) => i === index ? { ...offer, [key]: key === "amount" ? Number(value) : value } : offer) }));
  }
  function setLink(index: number, key: "name" | "url", value: string) {
    setForm((current: any) => ({ ...current, applicationLinks: current.applicationLinks.map((link: any, i: number) => i === index ? { ...link, [key]: value } : link) }));
  }
  function setDocumentName(index: number, name: string) {
    setForm((current: any) => ({ ...current, documents: current.documents.map((doc: any, i: number) => i === index ? { ...doc, name } : doc) }));
  }
  async function postUpdate() {
    if (!id || !updateMessage.trim()) return;
    const res = await fetch(`/api/opportunities/${id}/updates`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: updateMessage }) });
    const json = await res.json();
    if (!res.ok) return toast.error(json.error || "Could not post update");
    setUpdates((current) => [json.data, ...current]);
    setUpdateMessage("");
    toast.success("Update posted");
  }
  async function submitOpportunity() {
    const payload = prepareOpportunityPayload(form);
    if (!payload.deadline) {
      toast.error("Please set a deadline date and time");
      return;
    }
    const deadline = new Date(payload.deadline);
    if (Number.isNaN(deadline.getTime())) {
      toast.error("Please enter a valid deadline");
      return;
    }
    if (deadline.getTime() < Date.now() && payload.deadline !== initial.deadline) {
      toast.error("Deadline cannot be earlier than the current date and time");
      return;
    }
    await save("opportunities", id, payload, onDone);
  }
  return (
    <FormShell onSubmit={submitOpportunity}>
      <LabeledSelect label="Opportunity Type" value={form.type} onChange={(value) => setForm({ ...form, type: value, compensation: form.compensation?.length ? form.compensation : [{ label: "Offer 1", amount: 0 }], stipend: form.stipend || "" })} options={["Internship", "Placement"]} />
      <LabeledSelect label="Application Status" value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={["Applications Open", "Applications Closed"]} />
      <Field label="Company Name" value={form.company} onChange={(company) => setForm({ ...form, company })} minLength={2} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
        <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} minLength={10} required />
      </div>

      <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Application Links</p>
          <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, applicationLinks: [...form.applicationLinks, { name: `Link ${form.applicationLinks.length + 1}`, url: "" }] })}>
            <Plus size={15} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {form.applicationLinks.map((link: any, index: number) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[180px_1fr_40px]">
              <Field label="Link Name" value={link.name} onChange={(value) => setLink(index, "name", value)} />
              <Field label="Link URL" value={link.url} type="url" onChange={(value) => setLink(index, "url", value)} pattern="https?://.+" />
              <button type="button" className="icon-btn" onClick={() => setForm({ ...form, applicationLinks: form.applicationLinks.filter((_: any, i: number) => i !== index) })} aria-label="Remove link">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
        <p className="mb-3 text-sm font-semibold">Application Deadline</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Deadline Date" type="date" value={form.deadlineDate} onChange={(deadlineDate) => setForm({ ...form, deadlineDate })} min={today} />
          <Field label="Deadline Time" type="time" value={form.deadlineTime} onChange={(deadlineTime) => setForm({ ...form, deadlineTime })} min={form.deadlineDate === today ? nowTime : undefined} />
        </div>
      </div>

      {form.type === "Internship" ? (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <p className="mb-3 text-sm font-semibold">Stipend</p>
          <Field label="Monthly Stipend" type="number" value={form.stipend} onChange={(value) => setForm({ ...form, stipend: value })} min="0" />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">Expected CTC Offers</p>
            <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, compensation: [...form.compensation, { label: `Offer ${form.compensation.length + 1}`, amount: 0 }] })}>
              <Plus size={15} /> Add Offer
            </button>
          </div>
          <div className="space-y-2">
            {form.compensation.map((offer: any, index: number) => (
              <div key={index} className="grid gap-2 sm:grid-cols-[1fr_140px_40px]">
                <Field label="Offer Label" value={offer.label} onChange={(value) => setOffer(index, "label", value)} />
                <Field label="CTC (LPA)" type="number" value={offer.amount} onChange={(value) => setOffer(index, "amount", value)} min="0" />
                <button type="button" className="icon-btn" onClick={() => setForm({ ...form, compensation: form.compensation.filter((_: any, i: number) => i !== index) })} aria-label="Remove offer">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Slab is calculated automatically: up to 6 LPA Slab 1, more than 6 and below 12 LPA Slab 2, 12 LPA and above Slab 3.</p>
        </div>
      )}

      <label className="btn-secondary cursor-pointer">
        <Upload size={16} /> Upload PDF/DOC
        <input hidden multiple type="file" accept=".pdf,.doc,.docx" onChange={(e) => upload(e.target.files, "documents")} />
      </label>

      {form.documents.length > 0 && (
        <div className="space-y-2 rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <p className="text-sm font-semibold">Document Display Names</p>
          {form.documents.map((doc: any, index: number) => (
            <div key={`${doc.url}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_40px]">
              <Field label="Document Name" value={doc.name} onChange={(value) => setDocumentName(index, value)} />
              <button type="button" className="icon-btn" onClick={() => setForm({ ...form, documents: form.documents.filter((_: any, i: number) => i !== index) })} aria-label="Remove document">
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="btn-secondary cursor-pointer">
        <Upload size={16} /> Upload Logo
        <input hidden type="file" accept="image/*" onChange={(e) => upload(e.target.files, "logo")} />
      </label>
      {form.logo && <p className="text-xs text-slate-500">Logo uploaded. It appears on public opportunity cards and detail headers.</p>}

      {id && (
        <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <MessageSquareText size={16} /> Admin-only posting area for future updates
          </p>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Update Message</label>
            <textarea className="input min-h-20" value={updateMessage} onChange={(e) => setUpdateMessage(e.target.value)} />
          </div>
          <button className="btn-secondary mt-2" type="button" onClick={postUpdate}>
            Post Update
          </button>
          <div className="mt-3 space-y-2">
            {updates.map((update) => (
              <div key={update.id} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-white/5">
                <p>{update.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatForTable(update.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </FormShell>
  );
}

function StatisticForm({ initial, onDone }: any) {
  const [form, setForm] = useState<any>({
    ...initial,
    package: initial.package ?? "",
    placementMode: initial.placementMode || "On Campus",
    years: initial.years?.length ? initial.years : [new Date().getFullYear()]
  });
  const [yearInput, setYearInput] = useState(String(new Date().getFullYear()));
  return (
    <FormShell onSubmit={() => save("statistics", initial.id, form, onDone)}>
      <Field label="Company Name" value={form.company} onChange={(company) => setForm({ ...form, company })} minLength={2} />
      <Field label="Package/LPA" type="number" value={form.package} onChange={(value) => setForm({ ...form, package: value })} min="0" required={false} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Placement Mode</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={form.placementMode === "On Campus" ? "btn-primary" : "btn-secondary"}
            onClick={() => setForm({ ...form, placementMode: "On Campus" })}
          >
            On Campus
          </button>
          <button
            type="button"
            className={form.placementMode === "Off Campus" ? "btn-primary" : "btn-secondary"}
            onClick={() => setForm({ ...form, placementMode: "Off Campus" })}
          >
            Off Campus
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 dark:border-white/10">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold">Years</p>
          <button type="button" className="btn-secondary" onClick={() => {
            const year = Number(yearInput);
            if (!Number.isFinite(year)) return;
            setForm({ ...form, years: Array.from(new Set([...(form.years || []), year])).sort((a: number, b: number) => b - a) });
          }}>
            <Plus size={15} /> Add Year
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(form.years || []).map((year: number) => (
            <span key={year} className="inline-flex items-center gap-2 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white">
              {year}
              <button type="button" onClick={() => setForm({ ...form, years: form.years.filter((item: number) => item !== year) })}>Ã—</button>
            </span>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Field label="Year Input" type="number" value={yearInput} onChange={setYearInput} min="2000" />
          <div className="flex items-end">
            <button type="button" className="btn-secondary" onClick={() => {
              const year = Number(yearInput);
              if (!Number.isFinite(year)) return;
              setForm({ ...form, years: Array.from(new Set([...(form.years || []), year])).sort((a: number, b: number) => b - a) });
            }}>Add</button>
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Notes</label>
        <textarea className="input min-h-24" value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>
    </FormShell>
  );
}

function AlumniForm({ initial, onDone }: any) {
  const [form, setForm] = useState<any>({ ...initial, ctc: initial.ctc ?? "" });
  return (
    <FormShell onSubmit={() => save("alumni", initial.id, form, onDone)}>
      <Field label="Alumni Name" value={form.name} onChange={(name) => setForm({ ...form, name })} minLength={2} />
      <Field label="Company" value={form.company} onChange={(company) => setForm({ ...form, company })} minLength={2} />
      <Field label="Year of Passout" type="number" value={form.passoutYear} onChange={(passoutYear) => setForm({ ...form, passoutYear })} min="1950" />
      <Field label="Position" value={form.position} onChange={(position) => setForm({ ...form, position })} minLength={2} />
      <LabeledSelect label="Placement Mode" value={form.placementMode || "On Campus"} onChange={(value) => setForm({ ...form, placementMode: value })} options={["On Campus", "Off Campus"]} />
      <Field label="CTC Obtained (LPA)" type="number" value={form.ctc} onChange={(ctc) => setForm({ ...form, ctc })} min="0" required={false} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Review / Insight</label>
        <textarea className="input min-h-28" value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} minLength={10} required />
      </div>
    </FormShell>
  );
}

function Field({ value, onChange, label, type = "text", minLength, pattern, min, required = true }: { value: string | number; onChange: (value: string) => void; label: string; type?: string; minLength?: number; pattern?: string; min?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} minLength={minLength} pattern={pattern} min={min} />
    </div>
  );
}

function LabeledSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function FormShell({ children, onSubmit }: { children: React.ReactNode; onSubmit: () => Promise<void> | void }) {
  return <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>{children}<button className="btn-primary w-full" type="submit">Save Record</button></form>;
}

async function save(base: string, id: number | undefined, form: any, onDone: () => void) {
  const res = await fetch(`/api/${base}${id ? `/${id}` : ""}`, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
  const json = await safeJson(res);
  if (!res.ok) {
    toast.error(json.error || "Save failed");
    return;
  }
  toast.success("Saved successfully");
  onDone();
}

function toDateTimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function localDateString(value: Date) {
  const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function localTimeString(value: Date) {
  const offsetDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(11, 16);
}

function splitDateTime(value: string) {
  const local = toDateTimeLocal(value);
  if (!local) return { date: "", time: "" };
  const [date, time] = local.split("T");
  return { date: date || "", time: time || "" };
}

function prepareOpportunityPayload(form: any) {
  const applicationLinks = (form.applicationLinks || []).filter((link: any) => link.name?.trim() && link.url?.trim());
  const deadline = form.deadlineDate && form.deadlineTime ? `${form.deadlineDate}T${form.deadlineTime}` : form.deadline;
  const compensation = form.type === "Internship"
    ? [{ label: "Stipend", amount: Number(form.stipend || 0) }]
    : form.compensation;
  return {
    ...form,
    applicationLink: applicationLinks[0]?.url || "",
    applicationLinks,
    deadline,
    compensation,
    documents: normalizeDocuments(form.documents || []).filter((doc: any) => doc.name?.trim() && doc.url?.trim())
  };
}

function normalizeDocuments(documents: any[]) {
  return documents.map((doc) => typeof doc === "string" ? { name: cleanFileName(doc), url: doc } : doc);
}

function cleanFileName(url: string) {
  return url.split("/").pop()?.replace(/^\d+-/, "") || "Document";
}

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

function formatForTable(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Not Available";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", hour12: true }).format(date);
}

function formatPackage(value: number | null | undefined) {
  return value === null || value === undefined || Number.isNaN(Number(value)) ? "Data Not Available" : `${Number(value).toFixed(2)} LPA`;
}

