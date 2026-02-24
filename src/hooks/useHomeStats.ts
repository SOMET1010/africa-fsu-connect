import { useQuery } from "@tanstack/react-query";
import { HomeStatsService, type HomeStats } from "@/services/homeStatsService";

export const useHomeStats = () => {
  return useQuery<HomeStats, Error>({
    queryKey: ["home-stats"],
    queryFn: () => HomeStatsService.getHomeStats(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
