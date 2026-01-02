import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

interface MemberCountryCardProps {
  country: {
    code: string;
    name: string;
    flag: string;
    status: 'active' | 'member' | 'joining';
  };
  variant?: 'light' | 'dark';
}

const getStatusBadge = (status: string, isDark: boolean) => {
  const baseClass = "text-xs";
  
  switch (status) {
    case 'active':
      return (
        <Badge className={`${baseClass} ${isDark 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
          Actif
        </Badge>
      );
    case 'member':
      return (
        <Badge className={`${baseClass} ${isDark 
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
          : 'bg-blue-500/10 text-blue-600 border-blue-500/20'}`}>
          Membre
        </Badge>
      );
    case 'joining':
      return (
        <Badge className={`${baseClass} ${isDark 
          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
          En adhésion
        </Badge>
      );
    default:
      return <Badge variant="secondary" className={baseClass}>Membre</Badge>;
  }
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
          {getStatusBadge(country.status, isDark)}
        </CardContent>
      </Card>
    </Link>
  );
};
