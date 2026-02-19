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
        <div className="rounded-[var(--nx-radius-lg)] border border-white/10 bg-white/5 backdrop-blur-md p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icône */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--nx-gold)/0.2)] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[hsl(var(--nx-gold))]" />
              </div>
            </div>
            
            {/* Contenu */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Badge 
                  variant="outline" 
                  className="bg-[hsl(var(--nx-coop-600)/0.15)] text-[hsl(var(--nx-cyan))] border-[hsl(var(--nx-coop-600)/0.3)]"
                >
                  {currentLanguage === 'en' ? 'Network Secretariat' : 'Secrétariat du Réseau'}
                </Badge>
                
                <h3 className="text-xl font-semibold text-white">
                  {currentLanguage === 'en' ? 'UAT - ADCA Network Coordination' : 'UAT - Coordination du Réseau ADCA'}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {currentLanguage === 'en' 
                    ? "The Technical Assistance Unit (UAT) coordinates the network of African universal service agencies. It facilitates exchanges, harmonizes practices, and supports member countries in their mission of universal access to telecommunications."
                    : "L'Unité d'Assistance Technique (UAT) assure la coordination du réseau des agences africaines du service universel. Elle facilite les échanges, harmonise les pratiques et accompagne les pays membres dans leur mission d'accès universel aux télécommunications."}
                </p>
              </div>
              
              {/* Langues de travail */}
              <div className="flex items-center gap-3 pt-2">
                <Globe className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/60">
                  {currentLanguage === 'en' ? 'Working languages:' : 'Langues de travail :'}
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">🇫🇷 FR</Badge>
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">🇬🇧 EN</Badge>
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">🇵🇹 PT</Badge>
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">🇸🇦 AR</Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Link to="/about" className="inline-flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {currentLanguage === 'en' ? 'Learn more' : 'En savoir plus'}
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
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
