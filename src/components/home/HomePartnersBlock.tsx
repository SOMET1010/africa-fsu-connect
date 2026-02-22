import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import atuLogo from "@/assets/atu-logo.png";
import { useHomepageContent } from "@/hooks/useHomepageContent";

export function HomePartnersBlock() {
  const { getBlock } = useHomepageContent();
  const content = getBlock('partners');
  const items = (content?.items as string[]) || [];

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">Partenaires</span>
            <img src={atuLogo} alt="ATU" className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            {items.map((partner, i) => (
              <span key={i} className="text-sm font-medium text-gray-500 px-3 py-1.5 rounded-full border border-gray-200 bg-white">
                {partner}
              </span>
            ))}
          </div>
          <Button asChild className="bg-amber-500 text-white hover:bg-amber-600 font-semibold shrink-0">
            <Link to="/projects" className="flex items-center gap-2">
              Proposer un Projet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
