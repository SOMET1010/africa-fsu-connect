import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock } from "lucide-react";

interface CountryIdentityCardProps {
  country: {
    code: string;
    name: string;
    flag: string;
    status: 'active' | 'member' | 'joining';
    lastContribution?: string;
  };
}

const getStatusBadge = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          {t('country.status.active') || 'Actif'}
        </Badge>
      );
    case 'member':
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          {t('country.status.member') || 'Membre'}
        </Badge>
      );
    case 'joining':
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          {t('country.status.joining') || 'En adhésion'}
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary">
          {t('country.status.member') || 'Membre'}
        </Badge>
      );
  }
};

export const CountryIdentityCard = ({ country }: CountryIdentityCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-4">
      {/* Drapeau + Nom */}
      <div className="space-y-2">
        <span className="text-7xl">{country.flag}</span>
        <h1 className="text-4xl font-bold text-foreground">
          {country.name}
        </h1>
      </div>

      {/* Statut réseau */}
      <div className="flex items-center justify-center gap-3">
        {getStatusBadge(country.status, t)}
        <span className="text-muted-foreground">
          {t('country.network.member') || 'Membre du réseau SUTEL'}
        </span>
      </div>

      {/* Dernière contribution */}
      {country.lastContribution && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t('country.last.contribution') || 'Dernière contribution :'} {country.lastContribution}
          </span>
        </div>
      )}
    </div>
  );
};
