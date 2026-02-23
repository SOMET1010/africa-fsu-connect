import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RegionalData {
  name: string;
  countries: number;
  projects: number;
  agencies: number;
  coverage: number;
  color: string;
}

// Canonical region names (now consistent between countries and agencies tables)
const REGION_CODES: Record<string, string> = {
  "Afrique de l'Ouest": "CEDEAO",
  "Afrique Australe": "SADC",
  "Afrique de l'Est": "EAC",
  "Afrique Centrale": "CEMAC",
  "Afrique du Nord": "COMESA",
};

const MAX_COUNTRIES: Record<string, number> = {
  CEDEAO: 15, SADC: 16, EAC: 7, COMESA: 12, CEMAC: 6,
};

export const useRealRegionalStats = () => {
  return useQuery({
    queryKey: ["real-regional-stats"],
    queryFn: async () => {
      const [agenciesRes, projectsRes, countriesRes] = await Promise.all([
        supabase.from("agencies").select("id, region, country, is_active").eq("is_active", true),
        supabase.from("agency_projects").select("agency_id, status"),
        supabase.from("countries").select("code, region"),
      ]);

      if (agenciesRes.error) throw agenciesRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (countriesRes.error) throw countriesRes.error;

      const agencies = agenciesRes.data ?? [];
      const projects = projectsRes.data ?? [];
      const countries = countriesRes.data ?? [];

      // Init stats per canonical code
      const regionStats: Record<string, RegionalData> = {};
      for (const [regionName, code] of Object.entries(REGION_CODES)) {
        regionStats[code] = { name: code, countries: 0, projects: 0, agencies: 0, coverage: 0, color: "" };
      }

      // Count countries by region (both tables now use geographic names)
      const regionCountrySets: Record<string, Set<string>> = {};
      for (const c of countries) {
        const code = REGION_CODES[c.region ?? ""];
        if (code) {
          if (!regionCountrySets[code]) regionCountrySets[code] = new Set();
          regionCountrySets[code].add(c.code);
        }
      }
      for (const [code, set] of Object.entries(regionCountrySets)) {
        regionStats[code].countries = set.size;
      }

      // Count agencies by region
      const agencyIdToCode: Record<string, string> = {};
      for (const agency of agencies) {
        const code = REGION_CODES[agency.region ?? ""];
        if (code && regionStats[code]) {
          regionStats[code].agencies++;
          agencyIdToCode[agency.id] = code;
        }
      }

      // Count projects by agency
      for (const project of projects) {
        const code = agencyIdToCode[project.agency_id];
        if (code && regionStats[code]) {
          regionStats[code].projects++;
        }
      }

      // Coverage
      for (const code of Object.values(REGION_CODES)) {
        const max = MAX_COUNTRIES[code] || 10;
        regionStats[code].coverage = Math.round((regionStats[code].countries / max) * 100);
      }

      const totalCountries = Object.values(regionStats).reduce((s, r) => s + r.countries, 0);
      const totalProjects = Object.values(regionStats).reduce((s, r) => s + r.projects, 0);
      const totalAgencies = agencies.length;

      return {
        regions: Object.values(regionStats),
        globalStats: {
          countries: totalCountries,
          projects: totalProjects,
          agencies: totalAgencies,
          users: Math.round(totalAgencies * 3500),
        },
      };
    },
  });
};
