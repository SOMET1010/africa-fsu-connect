import { useState, useMemo } from "react";
import { Handshake } from "lucide-react";
import { NexusLayout } from "@/components/layout/NexusLayout";
import { NexusSectionHero } from "@/components/shared/NexusSectionHero";
import { CrossBorderFilters } from "@/components/collaboration/CrossBorderFilters";
import { CrossBorderProjectCard } from "@/components/collaboration/CrossBorderProjectCard";
import { CrossBorderStats } from "@/components/collaboration/CrossBorderStats";
import { CollaborationNetworkMini } from "@/components/collaboration/CollaborationNetworkMini";
import { DEMO_PROJECTS } from "@/components/collaboration/crossBorderData";

const CrossBorderCollaboration = () => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [theme, setTheme] = useState("all");
  const [status, setStatus] = useState("all");

  const clearFilters = () => {
    setSearch(""); setCountry("all"); setTheme("all"); setStatus("all");
  };

  const filtered = useMemo(() => {
    return DEMO_PROJECTS.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (country && country !== "all" && !p.partner_countries.includes(country)) return false;
      if (theme && theme !== "all" && p.theme !== theme) return false;
      if (status && status !== "all" && p.status !== status) return false;
      return true;
    });
  }, [search, country, theme, status]);

  return (
    <NexusLayout>
      <NexusSectionHero
        badge="Collaboration transfrontalière"
        badgeIcon={Handshake}
        title="Projets Inter-Agences"
        subtitle="Initiatives collaboratives impliquant plusieurs pays du réseau UDC — connectivité, éducation, santé, agriculture et gouvernance."
        size="md"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* KPIs */}
        <CrossBorderStats projects={filtered} />

        {/* Filters */}
        <CrossBorderFilters
          search={search} onSearchChange={setSearch}
          country={country} onCountryChange={setCountry}
          theme={theme} onThemeChange={setTheme}
          status={status} onStatusChange={setStatus}
          onClear={clearFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Project Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((p, i) => (
                <CrossBorderProjectCard key={p.id} project={p} index={i} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-[hsl(var(--nx-text-500))]">
                Aucun projet ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>

          {/* Network sidebar */}
          <div className="lg:col-span-1">
            <CollaborationNetworkMini projects={filtered} />
          </div>
        </div>
      </div>
    </NexusLayout>
  );
};

export default CrossBorderCollaboration;
