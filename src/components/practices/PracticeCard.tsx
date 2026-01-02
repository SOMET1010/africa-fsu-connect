import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";

interface PracticeCardProps {
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  theme: string;
  date: string;
  // Nouvelles props pour l'impact et la voix humaine
  impact?: { value: string; label: string };
  agency?: string;
  featured?: boolean;
}

export function PracticeCard({
  title,
  description,
  country,
  countryFlag,
  theme,
  date,
  impact,
  agency,
  featured = false,
}: PracticeCardProps) {
  return (
    <Card className={`
      overflow-hidden group nx-transition nx-hover-lift
      ${featured ? 'border-primary/20 shadow-md' : ''}
    `}>
      <CardContent className="p-5">
        {/* Ligne thème + pays */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {theme}
          </span>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="text-base">{countryFlag}</span>
            <span>{country}</span>
          </div>
        </div>

        {/* Titre - fort */}
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Ligne d'impact - si présente */}
        {impact && (
          <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <span className="text-2xl font-bold text-primary nx-icon-bounce">
              {impact.value}
            </span>
            <span className="text-sm text-muted-foreground">
              {impact.label}
            </span>
          </div>
        )}
        
        {/* Description narrative */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Attribution - voix humaine */}
        {agency && (
          <p className="text-xs text-muted-foreground/80 italic mb-3">
            Porté par {agency}
          </p>
        )}

        {/* Date discrète */}
        <p className="text-xs text-muted-foreground/60 mb-4 pb-4 border-b">
          {date}
        </p>

        {/* Actions - espacées */}
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 group/btn">
            <Eye className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
            Découvrir
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 group/btn">
            <MessageCircle className="h-4 w-4 mr-2 transition-transform group-hover/btn:scale-110" />
            Contacter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
