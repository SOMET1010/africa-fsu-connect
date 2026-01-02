import { PracticesHero } from "@/components/practices/PracticesHero";
import { PracticeFilters } from "@/components/practices/PracticeFilters";
import { FeaturedPractices } from "@/components/practices/FeaturedPractices";
import { PracticeGrid } from "@/components/practices/PracticeGrid";
import { SharePracticeCTA } from "@/components/practices/SharePracticeCTA";

export default function Practices() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PracticesHero />
      <PracticeFilters />
      <FeaturedPractices />
      <PracticeGrid />
      <SharePracticeCTA />
    </div>
  );
}
