import { Building2, Globe, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

export const UATCoordinationSection = () => {
  const { currentLanguage } = useTranslation();

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="rounded-[var(--nx-radius-lg)] border border-[hsl(var(--nx-border))] bg-gradient-to-br from-[hsl(var(--nx-surface))] to-[hsl(var(--nx-bg))] p-8 shadow-[var(--nx-shadow-md)]">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icône */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--nx-brand-900)/0.1)] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[hsl(var(--nx-brand-700))]" />
              </div>
            </div>
            
            {/* Contenu */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Badge 
                  variant="outline" 
                  className="bg-[hsl(var(--nx-coop-600)/0.1)] text-[hsl(var(--nx-coop-600))] border-[hsl(var(--nx-coop-600)/0.3)]"
                >
                  {currentLanguage === 'en' ? 'Network Secretariat' : 'Secrétariat du Réseau'}
                </Badge>
                
                <h3 className="text-xl font-semibold text-[hsl(var(--nx-text-900))]">
                  {currentLanguage === 'en' ? 'UAT - SUTEL Network Coordination' : 'UAT - Coordination du Réseau SUTEL'}
                </h3>
                
                <p className="text-[hsl(var(--nx-text-500))] leading-relaxed">
                  {currentLanguage === 'en' 
                    ? "The Technical Assistance Unit (UAT) coordinates the network of African universal service agencies. It facilitates exchanges, harmonizes practices, and supports member countries in their mission of universal access to telecommunications."
                    : "L'Unité d'Assistance Technique (UAT) assure la coordination du réseau des agences africaines du service universel. Elle facilite les échanges, harmonise les pratiques et accompagne les pays membres dans leur mission d'accès universel aux télécommunications."}
                </p>
              </div>
              
              {/* Langues de travail */}
              <div className="flex items-center gap-3 pt-2">
                <Globe className="w-4 h-4 text-[hsl(var(--nx-text-500))]" />
                <span className="text-sm text-[hsl(var(--nx-text-500))]">
                  {currentLanguage === 'en' ? 'Working languages:' : 'Langues de travail :'}
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">🇫🇷 FR</Badge>
                  <Badge variant="secondary" className="text-xs">🇬🇧 EN</Badge>
                  <Badge variant="secondary" className="text-xs">🇵🇹 PT</Badge>
                  <Badge variant="secondary" className="text-xs">🇸🇦 AR</Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-[hsl(var(--nx-border))] hover:bg-[hsl(var(--nx-surface))]"
                >
                  <Link to="/about" className="inline-flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {currentLanguage === 'en' ? 'Learn more' : 'En savoir plus'}
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-[hsl(var(--nx-text-500))] hover:text-[hsl(var(--nx-text-700))]"
                >
                  <Mail className="w-3.5 h-3.5 mr-2" />
                  {currentLanguage === 'en' ? 'Contact' : 'Contacter'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
