
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
  Info,
  Calendar,
  DollarSign,
  Target,
  Users
} from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;

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

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {agency.region}
          </Badge>
          
          {/* SUTEL Type Badge */}
          {agency.metadata && typeof agency.metadata === 'object' && 'sutel_type' in agency.metadata && agency.metadata.sutel_type && (
            <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              SUTEL
            </Badge>
          )}
          
          {/* Governance Type Badge */}
          {agency.metadata && typeof agency.metadata === 'object' && 'governance_type' in agency.metadata && agency.metadata.governance_type && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {agency.metadata.governance_type === 'autonomous_agency' ? 'Agence autonome' :
               agency.metadata.governance_type === 'unit_within_regulator' ? 'Unité régulateur' :
               agency.metadata.governance_type === 'ministry_unit' ? 'Unité ministérielle' :
               String(agency.metadata.governance_type)}
            </Badge>
          )}
          
          {/* Parent Authority Badge */}
          {agency.metadata && typeof agency.metadata === 'object' && 'parent_authority' in agency.metadata && agency.metadata.parent_authority && (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
              via {String(agency.metadata.parent_authority)}
            </Badge>
          )}
          
          {/* Organization Type Badge */}
          {agency.metadata && typeof agency.metadata === 'object' && 'type' in agency.metadata && agency.metadata.type && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              {agency.metadata.type === 'continental_organization' ? 'Continental' :
               agency.metadata.type === 'regional_organization' ? 'Régional' :
               String(agency.metadata.type)}
            </Badge>
          )}
          
          {/* Funding Rate Badge */}
          {agency.metadata && typeof agency.metadata === 'object' && 'funding_rate' in agency.metadata && agency.metadata.funding_rate && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {String(agency.metadata.funding_rate)}
            </Badge>
          )}
          
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

      {/* Enhanced metadata display */}
      {(agency.established_date || 
        (agency.metadata && typeof agency.metadata === 'object' && ('focus' in agency.metadata || 'scope' in agency.metadata))) && (
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
          {agency.established_date && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Créée en {new Date(agency.established_date).getFullYear()}
            </div>
          )}
          {agency.metadata && typeof agency.metadata === 'object' && 'focus' in agency.metadata && agency.metadata.focus && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              Focus: {String(agency.metadata.focus).replace('_', ' ')}
            </div>
          )}
          {agency.metadata && typeof agency.metadata === 'object' && 'scope' in agency.metadata && agency.metadata.scope && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              Portée: {String(agency.metadata.scope).replace('_', ' ')}
            </div>
          )}
        </div>
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
