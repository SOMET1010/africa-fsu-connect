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
        <div className="rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-card shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Icône */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            {/* Contenu */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Badge 
                  variant="outline" 
                  className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                >
                  {currentLanguage === 'en' ? 'Network Secretariat' : 'Secrétariat du Réseau'}
                </Badge>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                  {currentLanguage === 'en' ? 'ATU - UDC Network Coordination' : 'UAT - Coordination du Réseau UDC'}
                </h3>
                
                <p className="text-gray-600 dark:text-muted-foreground leading-relaxed">
                  {currentLanguage === 'en' 
                    ? "The African Telecommunications Union (ATU) coordinates the network of African universal service agencies. It facilitates exchanges, harmonizes practices, and supports member countries in their mission of universal access to telecommunications."
                    : "L'Union Africaine des Télécommunications (UAT) assure la coordination du réseau des agences africaines du service universel. Elle facilite les échanges, harmonise les pratiques et accompagne les pays membres dans leur mission d'accès universel aux télécommunications."}
                </p>
              </div>
              
              {/* Langues de travail */}
              <div className="flex items-center gap-3 pt-2">
                <Globe className="w-4 h-4 text-gray-400 dark:text-muted-foreground" />
                <span className="text-sm text-gray-500 dark:text-muted-foreground">
                  {currentLanguage === 'en' ? 'Working languages:' : 'Langues de travail :'}
                </span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border">🇫🇷 FR</Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border">🇬🇧 EN</Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border">🇵🇹 PT</Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-muted text-gray-600 dark:text-muted-foreground border-gray-200 dark:border-border">🇸🇦 AR</Badge>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="border-gray-200 dark:border-border text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-muted"
                >
                  <Link to="/about" className="inline-flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {currentLanguage === 'en' ? 'Learn more' : 'En savoir plus'}
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground hover:bg-gray-50 dark:hover:bg-muted"
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
