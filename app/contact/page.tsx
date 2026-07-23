import { Footer } from "@/components/ui/footer";
import { Nav } from "@/components/ui/nav";
import { Mail, Phone, UserRound } from "lucide-react";

const contacts = [
  {
    title: "Mechanical Association Secretary",
    name: "Abhishek S",
    className: "Representative Mechanical Department",
    phone: "+91 85905 56784",
    email: "abhisheks7004@gmail.com"
  },
  {
    title: "Placement Coordinator",
    name: "Shivahari Pradeepkumar",
    className: "Mech M2 Placement Coordinator",
    phone: "+91 79079 45281",
    email: "shivdfb1106@gmail.com"
  },
  {
    title: "Placement Coordinator",
    name: "Sidharth Jalal",
    className: "Mech M1 Placement Coordinator",
    phone: "+91 77362 51186",
    email: "sidhuanju22@gmail.com"
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#030914]">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-display text-4xl font-black text-navy dark:text-white">Contact Us</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Use these contacts for placement communication, coordination, and official updates.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {contacts.map((person) => (
            <article key={person.title + person.name} className="glass rounded-xl p-5 shadow-panel">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cyan/15 text-cyan">
                <UserRound size={28} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-cyan">{person.title}</p>
              <h2 className="mt-2 font-display text-2xl font-bold">{person.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{person.className}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2"><Phone size={16} /> {person.phone}</p>
                <p className="flex items-center gap-2"><Mail size={16} /> {person.email}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
