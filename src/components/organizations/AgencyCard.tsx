
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info
} from "lucide-react";

interface Agency {
  id: string;
  name: string;
  acronym?: string;
  country: string;
  region: string;
  website_url?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  description?: string;
  sync_status: string;
  logo_url?: string;
}

interface AgencyCardProps {
  agency: Agency;
  onViewProfile: (agency: Agency) => void;
}

const SYNC_STATUS_ICONS = {
  synced: <CheckCircle className="h-4 w-4 text-green-600" />,
  pending: <Clock className="h-4 w-4 text-yellow-600" />,
  failed: <AlertTriangle className="h-4 w-4 text-red-600" />,
  partial: <AlertTriangle className="h-4 w-4 text-yellow-600" />
};

export const AgencyCard = ({ agency, onViewProfile }: AgencyCardProps) => {
  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {agency.logo_url ? (
            <img 
              src={agency.logo_url} 
              alt={`Logo ${agency.name}`}
              className="w-12 h-12 object-contain"
            />
          ) : (
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{agency.name}</h3>
            {agency.acronym && (
              <p className="text-sm text-muted-foreground">({agency.acronym})</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {SYNC_STATUS_ICONS[agency.sync_status as keyof typeof SYNC_STATUS_ICONS]}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewProfile(agency)}
          >
            <Info className="h-4 w-4 mr-1" />
            Profil
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {[agency.address, agency.country].filter(Boolean).join(', ')}
          </span>
        </div>

        {agency.website_url && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a 
              href={agency.website_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Site officiel <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {agency.region}
          </Badge>
          <Badge 
            variant={agency.sync_status === 'synced' ? 'default' : 'outline'}
            className="text-xs"
          >
            {agency.sync_status === 'synced' ? 'Données à jour' : 
             agency.sync_status === 'pending' ? 'Collecte en cours' : 
             agency.sync_status === 'failed' ? 'Erreur collecte' : 'Données partielles'}
          </Badge>
        </div>
      </div>

      {agency.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {agency.description}
        </p>
      )}

      <div className="pt-2 border-t flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Institution partenaire officielle
        </div>
        {agency.contact_email && (
          <a 
            href={`mailto:${agency.contact_email}`}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            Contact
          </a>
        )}
      </div>
    </Card>
  );
};
