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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PracticesHero 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      <PracticeFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      <FeaturedPractices />
      <PracticeGrid 
        searchQuery={searchQuery} 
        filters={filters} 
      />
      <SharePracticeCTA />
    </div>
  );
}
