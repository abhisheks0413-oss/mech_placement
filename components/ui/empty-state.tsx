import { FileSearch } from "lucide-react";

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="glass mx-auto flex max-w-xl flex-col items-center rounded-xl p-10 text-center shadow-panel">
      <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-cyan/10 text-cyan">
        <div className="absolute inset-5 rounded-full border border-cyan/30" />
        <FileSearch size={44} />
      </div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      {text && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{text}</p>}
    </div>
  );
}
