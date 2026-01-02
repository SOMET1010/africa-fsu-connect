import { useState } from "react";
import { PracticesHero } from "@/components/practices/PracticesHero";
import { PracticeFilters } from "@/components/practices/PracticeFilters";
import { FeaturedPractices } from "@/components/practices/FeaturedPractices";
import { PracticeGrid } from "@/components/practices/PracticeGrid";
import { SharePracticeCTA } from "@/components/practices/SharePracticeCTA";
import { AfricanSection, AfricanDivider } from "@/components/shared/AfricanPattern";

export default function Practices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    theme: "all",
    country: "all",
    type: "all",
  });

  return (
    <div className="min-h-screen">
      {/* Hero - fond avec pattern subtil */}
      <AfricanSection variant="premium" className="py-4">
        <div className="container mx-auto px-4 max-w-6xl">
          <PracticesHero 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>
      </AfricanSection>

      {/* Featured - fond chaud africain */}
      <AfricanSection variant="warm" className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <FeaturedPractices />
        </div>
      </AfricanSection>

      {/* Filtres + Grid - fond frais */}
      <AfricanSection variant="cool" className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <PracticeFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          <PracticeGrid 
            searchQuery={searchQuery} 
            filters={filters} 
          />
        </div>
      </AfricanSection>

      {/* CTA */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <AfricanDivider variant="default" className="mb-10" />
        <SharePracticeCTA />
      </div>
    </div>
  );
}
