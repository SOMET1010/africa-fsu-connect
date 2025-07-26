import { useQuery } from "@tanstack/react-query";
import { CountriesService, Country } from "@/services/countriesService";

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => CountriesService.getCountries(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useCountryName = (countryCode: string, language: 'fr' | 'en' = 'fr') => {
  return useQuery({
    queryKey: ["country-name", countryCode, language],
    queryFn: () => CountriesService.getCountryName(countryCode, language),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useAfricanCountries = () => {
  return useQuery({
    queryKey: ["african-countries"],
    queryFn: () => CountriesService.getAfricanCountries(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};