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
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Actif</Badge>;
    case 'member':
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">Membre</Badge>;
    case 'joining':
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">En adhésion</Badge>;
    default:
      return <Badge variant="secondary" className="text-xs">Membre</Badge>;
  }
};

export const MemberCountryCard = ({ country }: MemberCountryCardProps) => {
  const { t } = useTranslation();

  return (
    <Link to={`/country/${country.code}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer h-full">
        <CardContent className="p-4 text-center">
          {/* Drapeau emoji - grande taille */}
          <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
            {country.flag}
          </span>
          
          {/* Nom du pays */}
          <h3 className="font-medium text-sm mb-2 group-hover:text-primary transition-colors truncate">
            {country.name}
          </h3>
          
          {/* Badge statut */}
          {getStatusBadge(country.status)}
        </CardContent>
      </Card>
    </Link>
  );
};
