import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 dark:border-white/10 dark:bg-ink">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold">College of Engineering Trivandrum</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Mechanical Engineering Department placement platform by the Mechanical Association.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Contact</h4>
          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <a href="https://www.google.com/maps/place/CET+Main+Block,+CET+Parking+Dr,+Ambady+Nagar,+Thiruvananthapuram,+Kerala+695016/@8.5456608,76.9057564,18.83z/data=!4m15!1m8!3m7!1s0x3b05bec7feafd27b:0x935f004df51720aa!2sCET+Main+Block,+CET+Parking+Dr,+Ambady+Nagar,+Thiruvananthapuram,+Kerala+695016!3b1!8m2!3d8.5458653!4d76.9063408!16s%2Fg%2F1hhmn29nj!3m5!1s0x3b05bec7feafd27b:0x935f004df51720aa!8m2!3d8.5458653!4d76.9063408!16s%2Fg%2F1hhmn29nj?entry=ttu&g_ep=EgoyMDI2MDYyMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition hover:text-gold">
              <MapPin size={16} /> CET Campus, Thiruvananthapuram
            </a>
            <p className="flex items-center gap-2"><Mail size={16} /> mechanicalassociation@cet.ac.in</p>
          </div>
        </div>
        <div className="text-sm text-slate-500 md:text-right">
          <p>Mechanical Engineering Association</p>
          <p className="mt-2">Copyright {new Date().getFullYear()} CET Mechanical Association</p>
        </div>
      </div>
    </footer>
  );
}
