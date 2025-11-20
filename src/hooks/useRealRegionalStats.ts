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

export const useRealRegionalStats = () => {
  return useQuery({
    queryKey: ["real-regional-stats"],
    queryFn: async () => {
      // Fetch agencies with country info
      const { data: agencies, error: agenciesError } = await supabase
        .from("agencies")
        .select("region, country, is_active")
        .eq("is_active", true);

      if (agenciesError) throw agenciesError;

      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from("agency_projects")
        .select("agency_id, status");

      if (projectsError) throw projectsError;

      // Fetch countries
      const { data: countries, error: countriesError } = await supabase
        .from("countries")
        .select("code, region");

      if (countriesError) throw countriesError;

      // Map region names to standardized format
      const regionMapping: { [key: string]: string } = {
        "West Africa": "CEDEAO",
        "Southern Africa": "SADC",
        "East Africa": "EAC",
        "Central Africa": "CEMAC",
        "North Africa": "COMESA"
      };

      // Calculate stats by region
      const regionStats: { [key: string]: RegionalData } = {
        "CEDEAO": { name: "CEDEAO", countries: 0, projects: 0, agencies: 0, coverage: 0, color: "bg-blue-500" },
        "SADC": { name: "SADC", countries: 0, projects: 0, agencies: 0, coverage: 0, color: "bg-green-500" },
        "EAC": { name: "EAC", countries: 0, projects: 0, agencies: 0, coverage: 0, color: "bg-purple-500" },
        "COMESA": { name: "COMESA", countries: 0, projects: 0, agencies: 0, coverage: 0, color: "bg-orange-500" },
        "CEMAC": { name: "CEMAC", countries: 0, projects: 0, agencies: 0, coverage: 0, color: "bg-red-500" }
      };

      // Count countries by region
      const regionCountries: { [key: string]: Set<string> } = {};
      countries?.forEach(country => {
        const mappedRegion = regionMapping[country.region || ""] || country.region;
        if (mappedRegion && regionStats[mappedRegion]) {
          if (!regionCountries[mappedRegion]) {
            regionCountries[mappedRegion] = new Set();
          }
          regionCountries[mappedRegion].add(country.code);
        }
      });

      Object.keys(regionCountries).forEach(region => {
        regionStats[region].countries = regionCountries[region].size;
      });

      // Count agencies by region
      const agencyByRegion: { [key: string]: string[] } = {};
      agencies?.forEach(agency => {
        const mappedRegion = regionMapping[agency.region || ""] || agency.region;
        if (mappedRegion && regionStats[mappedRegion]) {
          regionStats[mappedRegion].agencies++;
          if (!agencyByRegion[mappedRegion]) {
            agencyByRegion[mappedRegion] = [];
          }
          agencyByRegion[mappedRegion].push(agency.country);
        }
      });

      // Count projects by region
      const agencyRegionMap: { [agencyId: string]: string } = {};
      agencies?.forEach(agency => {
        const mappedRegion = regionMapping[agency.region || ""] || agency.region;
        if (mappedRegion) {
          agencyRegionMap[agency.country] = mappedRegion;
        }
      });

      projects?.forEach(project => {
        // Find agency region
        const agency = agencies?.find(a => a.country === project.agency_id);
        if (agency) {
          const mappedRegion = regionMapping[agency.region || ""] || agency.region;
          if (mappedRegion && regionStats[mappedRegion]) {
            regionStats[mappedRegion].projects++;
          }
        }
      });

      // Calculate coverage
      const maxCountries = { CEDEAO: 15, SADC: 16, EAC: 7, COMESA: 12, CEMAC: 6 };
      Object.keys(regionStats).forEach(region => {
        const max = maxCountries[region as keyof typeof maxCountries] || 10;
        regionStats[region].coverage = Math.round((regionStats[region].countries / max) * 100);
      });

      // Global stats
      const totalCountries = Object.values(regionStats).reduce((sum, r) => sum + r.countries, 0);
      const totalProjects = Object.values(regionStats).reduce((sum, r) => sum + r.projects, 0);
      const totalAgencies = agencies?.length || 0;

      return {
        regions: Object.values(regionStats),
        globalStats: {
          countries: totalCountries,
          projects: totalProjects,
          agencies: totalAgencies,
          users: Math.round(totalAgencies * 3500) // Estimate based on agencies
        }
      };
    },
  });
};
