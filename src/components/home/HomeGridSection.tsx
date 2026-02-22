import { Link } from "react-router-dom";
import { Globe, ArrowRight, Clock, Calendar, MapPin } from "lucide-react";
import { useAfricanCountries } from "@/hooks/useCountries";
import { getCountryActivity, ACTIVITY_LEVELS } from "@/components/map/activityData";
import { cn } from "@/lib/utils";
import { HomeMemberMap } from "@/components/home/HomeMemberMap";
import { motion } from "framer-motion";

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code.toUpperCase().split("").map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Simulated activity feed
const RECENT_ACTIVITY = [
  { color: "#10B981", title: "Côte d'Ivoire", desc: "Lancement programme écoles connectées", time: "il y a 2h" },
  { color: "#3B82F6", title: "Kenya", desc: "Partage données couverture mobile", time: "il y a 5h" },
  { color: "#F59E0B", title: "Sénégal", desc: "Document stratégique publié", time: "il y a 1j" },
  { color: "#10B981", title: "Maroc", desc: "Programme villages connectés", time: "il y a 2j" },
  { color: "#3B82F6", title: "Rwanda", desc: "Initiative smart villages", time: "il y a 3j" },
];

const UPCOMING_EVENTS = [
  { month: "MARS", day: "15", title: "Forum Régional USF", location: "Abidjan, Côte d'Ivoire" },
  { month: "AVR", day: "08", title: "Atelier Données Ouvertes", location: "Nairobi, Kenya" },
  { month: "MAI", day: "22", title: "Conférence Annuelle UDC", location: "Dakar, Sénégal" },
];

export function HomeGridSection() {
  const { data: countries = [] } = useAfricanCountries();

  const displayCountries = countries.slice(0, 6);
  const remaining = Math.max(0, countries.length - 6);

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1: Member countries */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900">Pays Membres</h3>
              </div>
              <Link to="/network" className="text-xs text-primary hover:underline flex items-center gap-1">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {displayCountries.map((country) => {
                const activity = getCountryActivity(country.code);
                const levelColor = ACTIVITY_LEVELS[activity.level]?.color ?? "#9CA3AF";
                return (
                  <div key={country.code} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <span className="text-lg">{getCountryFlag(country.code)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 truncate">{country.name_fr}</p>
                      <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: levelColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: levelColor }} />
                        {activity.level === 'high' ? 'Actif' : activity.level === 'medium' ? 'Membre' : 'En intégration'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {remaining > 0 && (
              <Link to="/network" className="block mt-3 text-center text-xs text-gray-400 hover:text-primary transition-colors">
                +{remaining} autres pays →
              </Link>
            )}
          </div>

          {/* Column 2: Network Map */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Carte du Réseau UDC</h3>
              <Link to="/network" className="text-xs text-primary hover:underline flex items-center gap-1">
                Plein écran <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-900" style={{ height: '280px' }}>
              {countries.length > 0 && (
                <HomeMemberMap countries={countries} mode="members" />
              )}
            </div>
          </div>

          {/* Column 3: Activity + Events */}
          <div className="space-y-4">
            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-gray-900">Activité Récente</h3>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color }} />
                      {i < RECENT_ACTIVITY.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                    </div>
                    <div className="pb-3">
                      <p className="text-xs font-medium text-gray-800">{item.title}</p>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-gray-900">Prochains Événements</h3>
              </div>
              <div className="space-y-3">
                {UPCOMING_EVENTS.map((evt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold text-primary uppercase leading-none">{evt.month}</span>
                      <span className="text-sm font-bold text-gray-900 leading-none">{evt.day}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800">{evt.title}</p>
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" />
                        {evt.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
