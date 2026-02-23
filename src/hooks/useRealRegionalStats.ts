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

// Bidirectional mapping: geographic name ↔ community code
const REGION_TO_CODE: Record<string, string> = {
  "Afrique de l'Ouest": "CEDEAO",
  "Afrique Australe": "SADC",
  "Afrique de l'Est": "EAC",
  "Afrique Centrale": "CEMAC",
  "Afrique du Nord": "COMESA",
};

const CODE_TO_REGION: Record<string, string> = Object.fromEntries(
  Object.entries(REGION_TO_CODE).map(([k, v]) => [v, k])
);

// Some agencies may use variant codes (EACO instead of EAC, ECOWAS instead of CEDEAO)
const CODE_ALIASES: Record<string, string> = {
  EACO: "EAC",
  ECOWAS: "CEDEAO",
  CRTEL: "CEDEAO", // francophone community maps to West Africa
  UMA: "COMESA",   // Maghreb maps to North Africa
  CPLP: "SADC",    // Lusophone maps to Southern Africa
};

function normalizeToCode(regionOrCode: string | null): string | null {
  if (!regionOrCode) return null;
  // Already a known code
  if (CODE_TO_REGION[regionOrCode]) return regionOrCode;
  // Geographic name → code
  if (REGION_TO_CODE[regionOrCode]) return REGION_TO_CODE[regionOrCode];
  // Alias → canonical code
  if (CODE_ALIASES[regionOrCode]) return CODE_ALIASES[regionOrCode];
  return null;
}

const CANONICAL_REGIONS = ["CEDEAO", "SADC", "EAC", "COMESA", "CEMAC"] as const;
const MAX_COUNTRIES: Record<string, number> = { CEDEAO: 15, SADC: 16, EAC: 7, COMESA: 12, CEMAC: 6 };

export const useRealRegionalStats = () => {
  return useQuery({
    queryKey: ["real-regional-stats"],
    queryFn: async () => {
      const [agenciesRes, projectsRes, countriesRes] = await Promise.all([
        supabase.from("agencies").select("id, region, country, is_active").eq("is_active", true),
        supabase.from("agency_projects").select("agency_id, status"),
        supabase.from("countries").select("code, region, sutel_community"),
      ]);

      if (agenciesRes.error) throw agenciesRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (countriesRes.error) throw countriesRes.error;

      const agencies = agenciesRes.data ?? [];
      const projects = projectsRes.data ?? [];
      const countries = countriesRes.data ?? [];

      // Init stats
      const regionStats: Record<string, RegionalData> = {};
      for (const code of CANONICAL_REGIONS) {
        regionStats[code] = { name: code, countries: 0, projects: 0, agencies: 0, coverage: 0, color: "" };
      }

      // Count countries by geographic region
      const regionCountrySets: Record<string, Set<string>> = {};
      for (const c of countries) {
        const code = normalizeToCode(c.region);
        if (code && regionStats[code]) {
          if (!regionCountrySets[code]) regionCountrySets[code] = new Set();
          regionCountrySets[code].add(c.code);
        }
      }
      for (const [code, set] of Object.entries(regionCountrySets)) {
        regionStats[code].countries = set.size;
      }

      // Count agencies — their `region` field may be a code or alias
      const agencyIdToCode: Record<string, string> = {};
      for (const agency of agencies) {
        const code = normalizeToCode(agency.region);
        if (code && regionStats[code]) {
          regionStats[code].agencies++;
          agencyIdToCode[agency.id] = code;
        }
      }

      // Count projects by agency region
      for (const project of projects) {
        const code = agencyIdToCode[project.agency_id];
        if (code && regionStats[code]) {
          regionStats[code].projects++;
        }
      }

      // Coverage
      for (const code of CANONICAL_REGIONS) {
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
