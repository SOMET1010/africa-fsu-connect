import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Globe, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAfricanCountries } from "@/hooks/useCountries";
import { HomeMemberMap } from "@/components/home/HomeMemberMap";
import { getCountryActivity } from "@/components/map/activityData";

type StatusFilter = "all" | "active" | "onboarding";

const getCountryFlag = (code: string): string => {
  if (!code || code.length !== 2) return "🌍";
  const codePoints = code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  high: { label: "Actif", className: "bg-uat-active-bg text-uat-active border-uat-active-border" },
  medium: { label: "Actif", className: "bg-uat-active-bg text-uat-active border-uat-active-border" },
  onboarding: { label: "En intégration", className: "bg-uat-onboarding-bg text-uat-onboarding border-uat-onboarding-border" },
  observer: { label: "Observateur", className: "bg-uat-observer-bg text-uat-observer border-uat-observer-border" },
};

export const NetworkMembersGrid = () => {
  const { data: countries, isLoading } = useAfricanCountries();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const enrichedCountries = useMemo(() => {
    if (!countries) return [];
    return countries.map((c) => {
      const activity = getCountryActivity(c.code);
      return { ...c, activity };
    });
  }, [countries]);

  const filtered = useMemo(() => {
    return enrichedCountries.filter((c) => {
      if (search && !c.name_fr.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter === "active" && !["high", "medium"].includes(c.activity.level)) return false;
      if (statusFilter === "onboarding" && c.activity.level !== "onboarding") return false;
      return true;
    });
  }, [enrichedCountries, search, statusFilter]);

  const displayed = filtered.slice(0, 6);
  const remaining = filtered.length - displayed.length;

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "active", label: "Actif" },
    { key: "onboarding", label: "En intégration" },
  ];

  if (isLoading) {
    return (
      <section className="py-12 bg-white dark:bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="h-64 flex items-center justify-center text-gray-400">Chargement…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white dark:bg-card">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Country list */}
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">Pays Membres</h2>
              </div>
              <Link to="/members" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Voir tout <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Filters + search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      statusFilter === f.key
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-card text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="pl-8 h-8 text-xs rounded-lg border-gray-200 dark:border-border"
                />
              </div>
            </div>

            {/* Country cards */}
            <div className="grid grid-cols-2 gap-3">
              {displayed.map((c) => {
                const status = STATUS_CONFIG[c.activity.level] ?? STATUS_CONFIG.observer;
                return (
                  <Link
                    key={c.code}
                    to={`/members?search=${encodeURIComponent(c.name_fr)}`}
                    className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border shadow-sm p-4 hover:border-primary/30 transition-colors duration-200 block"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl leading-none">{getCountryFlag(c.code)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-foreground truncate">{c.name_fr}</p>
                        <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md border ${status.className}`}>
                          {status.label}
                        </span>
                        <p className="text-[11px] text-gray-500 dark:text-muted-foreground mt-1.5">
                          {c.activity.projects} projets
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {remaining > 0 && (
              <Link
                to="/members"
                className="block text-center text-sm text-primary hover:underline font-medium py-2"
              >
                +{remaining} autres pays →
              </Link>
            )}
          </div>

          {/* Right — Map */}
          <div className="rounded-xl border border-gray-200 dark:border-border shadow-sm overflow-hidden bg-white dark:bg-card">
            <div className="relative" style={{ height: "420px" }}>
              <div className="absolute inset-0 bg-gray-900 rounded-t-xl overflow-hidden">
                {countries && countries.length > 0 && (
                  <HomeMemberMap countries={countries} mode="members" />
                )}
              </div>
            </div>
            {/* Legend */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-border flex flex-wrap gap-4 text-xs text-gray-500 dark:text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Actif
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-uat-onboarding" />
                En intégration
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                Observateur
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
