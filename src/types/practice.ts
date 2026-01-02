import type { ThemeType } from "@/components/shared/ThemeIllustration";

export interface Practice {
  id?: string;
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  theme: ThemeType;
  date: string;
  impact?: { value: string; label: string };
  agency?: string;
  
  // Image fields with fallback support
  cover_image_url?: string;    // Main image for featured cards / detail page
  thumbnail_url?: string;      // Small thumbnail for compact grids
  gallery?: string[];          // Gallery for detail page
}
