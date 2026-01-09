import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import type { CountryStatus } from "@/types/countryStatus";
import { getStatusClasses } from "@/types/countryStatus";

interface MemberCountryCardProps {
  country: {
    code: string;
    name: string;
    flag: string;
    status: CountryStatus;
  };
  variant?: 'light' | 'dark';
}

const getStatusBadge = (status: CountryStatus, isDark: boolean, t: (key: string) => string) => {
  const baseClass = "text-xs";
  const classes = getStatusClasses(status, isDark);
  const translationKey = `country.status.${status}`;
  const fallback: Record<CountryStatus, string> = {
    active: 'Actif',
    member: 'Membre',
    onboarding: 'En intégration',
    observer: 'Observateur',
  };
  
  return (
    <Badge className={`${baseClass} ${classes}`}>
      {t(translationKey) || fallback[status]}
    </Badge>
  );
};

export const MemberCountryCard = ({ country, variant = 'light' }: MemberCountryCardProps) => {
  const { t } = useTranslation();
  const isDark = variant === 'dark';

  return (
    <Link to={`/country/${country.code}`}>
      <Card className={`
        group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full
        ${isDark 
          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[hsl(var(--nx-gold)/0.4)]' 
          : 'border-border/50 hover:shadow-lg'
        }
      `}>
        <CardContent className="p-4 text-center">
          {/* Drapeau emoji - grande taille */}
          <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
            {country.flag}
          </span>
          
          {/* Nom du pays */}
          <h3 className={`font-medium text-sm mb-2 transition-colors truncate ${
            isDark 
              ? 'text-white group-hover:text-[hsl(var(--nx-gold))]' 
              : 'group-hover:text-primary'
          }`}>
            {country.name}
          </h3>
          
          {/* Badge statut */}
          {getStatusBadge(country.status, isDark, t)}
        </CardContent>
      </Card>
    </Link>
  );
};
