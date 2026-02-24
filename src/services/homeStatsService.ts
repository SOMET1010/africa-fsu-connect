import { supabase } from "@/integrations/supabase/client";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

type CountBuilder = PostgrestFilterBuilder<any>;

const fetchCount = async (
  table: string,
  applyFilters?: (builder: CountBuilder) => CountBuilder
): Promise<number> => {
  let builder = supabase.from(table).select("id", { head: true, count: "exact" });
  if (applyFilters) {
    builder = applyFilters(builder);
  }

  const { count, error } = await builder;
  if (error) {
    throw error;
  }

  return count ?? 0;
};

export interface HomeStats {
  countries: number;
  projects: number;
  partners: number;
  events: number;
  newProjectsThisQuarter: number;
  newPartnersThisMonth: number;
  eventsThisYear: number;
  refreshedAt: string;
}

const DAYS_IN_QUARTER = 90;

export class HomeStatsService {
  static async getHomeStats(): Promise<HomeStats> {
    const now = new Date();
    const quarterAgo = new Date(now);
    quarterAgo.setDate(quarterAgo.getDate() - DAYS_IN_QUARTER);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const yearAgo = new Date(now);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const [
      countries,
      projects,
      partners,
      events,
      newProjects,
      newPartners,
      eventsYear,
    ] = await Promise.all([
      fetchCount("countries"),
      fetchCount("agency_projects"),
      fetchCount("agencies"),
      fetchCount("events"),
      fetchCount("agency_projects", (builder) => builder.gte("created_at", quarterAgo.toISOString())),
      fetchCount("agencies", (builder) => builder.gte("created_at", monthAgo.toISOString())),
      fetchCount("events", (builder) => builder.gte("start_date", yearAgo.toISOString())),
    ]);

    return {
      countries,
      projects,
      partners,
      events,
      newProjectsThisQuarter: newProjects,
      newPartnersThisMonth: newPartners,
      eventsThisYear: eventsYear,
      refreshedAt: now.toISOString(),
    };
  }
}
