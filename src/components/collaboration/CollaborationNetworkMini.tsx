import { motion } from "framer-motion";
import type { CrossBorderProject } from "./crossBorderData";

const FLAG_MAP: Record<string, string> = {
  "Côte d'Ivoire": "🇨🇮", "Ghana": "🇬🇭", "Sénégal": "🇸🇳", "Mali": "🇲🇱",
  "Burkina Faso": "🇧🇫", "Kenya": "🇰🇪", "Tanzanie": "🇹🇿", "Ouganda": "🇺🇬",
  "Cameroun": "🇨🇲", "Niger": "🇳🇪", "Togo": "🇹🇬", "Bénin": "🇧🇯",
  "Rwanda": "🇷🇼", "RDC": "🇨🇩", "Madagascar": "🇲🇬",
};

export function CollaborationNetworkMini({ projects }: { projects: CrossBorderProject[] }) {
  // Build link counts between country pairs
  const links = new Map<string, number>();
  projects.forEach(p => {
    const countries = p.partner_countries;
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        const key = [countries[i], countries[j]].sort().join(" ↔ ");
        links.set(key, (links.get(key) ?? 0) + 1);
      }
    }
  });

  const sorted = [...links.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-[hsl(var(--nx-border))] bg-[hsl(var(--nx-night)/0.5)] p-5"
    >
      <h3 className="text-sm font-semibold text-white mb-4">Liens de collaboration</h3>
      <div className="space-y-2">
        {sorted.map(([pair, count]) => {
          const [a, b] = pair.split(" ↔ ");
          return (
            <div key={pair} className="flex items-center justify-between text-xs">
              <span className="text-[hsl(var(--nx-text-700))]">
                {FLAG_MAP[a] ?? "🏳️"} {a} — {FLAG_MAP[b] ?? "🏳️"} {b}
              </span>
              <span className="text-[hsl(var(--nx-gold))] font-medium">
                {count} projet{count > 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-xs text-[hsl(var(--nx-text-500))]">Aucun lien détecté</p>
        )}
      </div>
    </motion.div>
  );
}
