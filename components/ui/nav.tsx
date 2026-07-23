"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";

const links = [
  ["Home", "/"],
  ["Opportunities", "/opportunities"],
  ["Placement Statistics", "/statistics"],
  ["Alumni Insights", "/alumni"],
  ["Contact Us", "/contact"],
  ["Admin Login", "/admin/login"]
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-ink/75">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-cyan shadow-glow">
            <Building2 size={22} />
          </span>
          <span>
            <span className="block font-display text-base font-bold">CET Mechanical</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Placement Portal</span>
          </span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === href ? "bg-cyan/15 text-navy dark:text-cyan" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="icon-btn" onClick={toggle} aria-label="Toggle dark mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-btn lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-slate-100 bg-white/95 px-4 py-3 dark:border-white/10 dark:bg-ink">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-medium">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
