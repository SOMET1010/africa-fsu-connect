
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Users,
  TrendingUp,
  Database,
  Activity
} from "lucide-react";

import type { Tables } from "@/integrations/supabase/types";

type Agency = Tables<"agencies">;

interface EnrichedAgencyCardProps {
  agency: Agency;
  onViewProfile: (agency: Agency) => void;
}

const SYNC_STATUS_ICONS = {
  synced: <CheckCircle className="h-4 w-4 text-green-600" />,
  pending: <Clock className="h-4 w-4 text-yellow-600" />,
  failed: <AlertTriangle className="h-4 w-4 text-red-600" />,
  partial: <AlertTriangle className="h-4 w-4 text-yellow-600" />
};

export const EnrichedAgencyCard = ({ agency, onViewProfile }: EnrichedAgencyCardProps) => {
  const metadata = agency.metadata as any;
  const enrichedData = metadata?.enriched || {};
  const statistics = enrichedData.statistics || {};
  const contactInfo = enrichedData.contact_info || {};
  const activities = enrichedData.activities || [];

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={enrichedData.logo_url || agency.logo_url} 
              alt={`Logo ${agency.name}`}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
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

      {/* Informations enrichies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {contactInfo.address_details || [agency.address, agency.country].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Contacts enrichis */}
        <div className="flex flex-wrap gap-2">
          {contactInfo.emails && contactInfo.emails.length > 0 && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-blue-600">
                {contactInfo.emails[0]}
              </span>
            </div>
          )}
          
          {contactInfo.phones && contactInfo.phones.length > 0 && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-blue-600">
                {contactInfo.phones[0]}
              </span>
            </div>
          )}
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

        {/* Statistiques enrichies */}
        {Object.keys(statistics).length > 0 && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50 rounded-lg">
            {statistics.budget && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Budget: {statistics.budget.toLocaleString()}
                </span>
              </div>
            )}
            {statistics.projets && (
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Projets: {statistics.projets}
                </span>
              </div>
            )}
            {statistics.beneficiaires && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Bénéficiaires: {statistics.beneficiaires.toLocaleString()}
                </span>
              </div>
            )}
            {statistics.couverture && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-700">
                  Couverture: {statistics.couverture}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Activités détectées */}
        {activities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activities.slice(0, 3).map((activity: string) => (
              <Badge key={activity} variant="secondary" className="text-xs">
                {activity}
              </Badge>
            ))}
            {activities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{activities.length - 3} autres
              </Badge>
            )}
          </div>
        )}

        {/* Badges existants */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {agency.region}
          </Badge>
          
          {metadata?.sutel_type && (
            <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              SUTEL
            </Badge>
          )}
          
          {metadata?.governance_type && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {metadata.governance_type === 'autonomous_agency' ? 'Agence autonome' :
               metadata.governance_type === 'unit_within_regulator' ? 'Unité régulateur' :
               metadata.governance_type === 'ministry_unit' ? 'Unité ministérielle' :
               String(metadata.governance_type)}
            </Badge>
          )}
          
          <Badge 
            variant={agency.sync_status === 'synced' ? 'default' : 'outline'}
            className="text-xs"
          >
            <Database className="h-3 w-3 mr-1" />
            {agency.sync_status === 'synced' ? 'Données enrichies' : 
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

      {/* Indicateur de dernière mise à jour */}
      <div className="pt-2 border-t flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {agency.last_sync_at ? (
            <>
              <Activity className="h-3 w-3 mr-1 inline" />
              Dernière collecte: {new Date(agency.last_sync_at).toLocaleDateString()}
            </>
          ) : (
            'Institution partenaire officielle'
          )}
        </div>
        {contactInfo.emails && contactInfo.emails.length > 0 && (
          <a 
            href={`mailto:${contactInfo.emails[0]}`}
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
