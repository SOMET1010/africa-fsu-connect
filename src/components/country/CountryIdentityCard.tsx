import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock } from "lucide-react";
import type { CountryStatus } from "@/types/countryStatus";
import { getStatusClasses } from "@/types/countryStatus";

interface CountryIdentityCardProps {
  country: {
    code: string;
    name: string;
    flag: string;
    status: CountryStatus;
    lastContribution?: string;
  };
}

const getStatusBadge = (status: CountryStatus, t: (key: string) => string) => {
  const classes = getStatusClasses(status, false);
  const translationKey = `country.status.${status}`;
  const fallback: Record<CountryStatus, string> = {
    active: 'Actif',
    member: 'Membre',
    onboarding: 'En intégration',
    observer: 'Observateur',
  };
  
  return (
    <Badge className={classes}>
      {t(translationKey) || fallback[status]}
    </Badge>
  );
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
