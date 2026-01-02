import { useState } from "react";
import { PracticesHero } from "@/components/practices/PracticesHero";
import { PracticeFilters } from "@/components/practices/PracticeFilters";
import { FeaturedPractices } from "@/components/practices/FeaturedPractices";
import { PracticeGrid } from "@/components/practices/PracticeGrid";
import { SharePracticeCTA } from "@/components/practices/SharePracticeCTA";

export default function Practices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    theme: "all",
    country: "all",
    type: "all",
  });

  return (
    <div className="min-h-screen">
      {/* Hero - fond neutre */}
      <div className="container mx-auto px-4 max-w-6xl">
        <PracticesHero 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
      </div>

      {/* Featured - fond chaud (ivoire) */}
      <div className="nx-section-warm py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <FeaturedPractices />
        </div>
      </div>

      {/* Filtres + Grid - fond frais (bleu très léger) */}
      <div className="nx-section-cool py-10">
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
      </div>

      {/* CTA - fond neutre */}
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <SharePracticeCTA />
      </div>
    </div>
  );
}
