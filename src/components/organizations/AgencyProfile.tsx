
import { Badge } from "@/components/ui/badge";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernModal } from "@/components/ui/modern-modal";
import { ModernTabsWithIcon } from "@/components/ui/modern-tabs";
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Calendar,
  Users,
  FileText,
  Activity
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

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
  established_date?: string;
  sync_status: string;
  logo_url?: string;
  last_sync_at?: string;
}

interface AgencyProfileProps {
  agency: Agency;
  onClose: () => void;
}

export const AgencyProfile = ({ agency, onClose }: AgencyProfileProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRegionalOrganization = (region: string) => {
    const regionalOrgs = {
      'CEDEAO': 'Communauté Économique des États de l\'Afrique de l\'Ouest',
      'SADC': 'Communauté de Développement d\'Afrique Australe',
      'EACO': 'East African Communications Organization',
      'UMA': 'Union du Maghreb Arabe',
      'Europe': 'Union Européenne',
      'Asie': 'Coopération Asie-Pacifique',
      'Amérique': 'Organisation des États Américains'
    };
    return regionalOrgs[region as keyof typeof regionalOrgs] || region;
  };

  const tabs = [
    {
      value: "overview",
      label: "Aperçu",
      icon: <Building2 className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations institutionnelles
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {[agency.address, agency.country].filter(Boolean).join(', ')}
                  </span>
                </div>
                {agency.established_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Créée le {formatDate(agency.established_date)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getRegionalOrganization(agency.region)}</span>
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
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Statut de synchronisation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">État actuel</span>
                  <Badge 
                    variant={agency.sync_status === 'synced' ? 'default' : 'secondary'}
                  >
                    {agency.sync_status === 'synced' ? 'Synchronisé' : 
                     agency.sync_status === 'pending' ? 'En attente' : 
                     agency.sync_status === 'failed' ? 'Échec' : 'Partiel'}
                  </Badge>
                </div>
                {agency.last_sync_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dernière sync</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(agency.last_sync_at)}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agency.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${agency.contact_email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {agency.contact_email}
                  </a>
                </div>
              )}
              {agency.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{agency.phone}</span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )
    },
    {
      value: "mission",
      label: "Mission",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <GlassCard className="p-8">
          <h3 className="font-semibold mb-6">Mission et mandat</h3>
          {agency.description ? (
            <p className="text-sm leading-relaxed">{agency.description}</p>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
              <p className="text-lg mb-2">Informations de mission en cours de collecte</p>
              <p className="text-sm">
                Les données seront disponibles après synchronisation avec le site officiel
              </p>
            </div>
          )}
        </GlassCard>
      )
    },
    {
      value: "cooperation",
      label: "Coopération",
      icon: <Users className="h-4 w-4" />,
      content: (
        <GlassCard className="p-8">
          <h3 className="font-semibold mb-6">Partenariats et coopération</h3>
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <p className="text-lg mb-2">Informations de coopération en cours de collecte</p>
            <p className="text-sm">
              Accords de partenariat et projets conjoints seront affichés ici
            </p>
          </div>
        </GlassCard>
      )
    },
    {
      value: "resources",
      label: "Ressources",
      icon: <Globe className="h-4 w-4" />,
      content: (
        <GlassCard className="p-8">
          <h3 className="font-semibold mb-6">Publications et ressources</h3>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <p className="text-lg mb-2">Ressources en cours de collecte</p>
            <p className="text-sm">
              Publications officielles et documents réglementaires seront disponibles
            </p>
          </div>
        </GlassCard>
      )
    }
  ];

  return (
    <ModernModal 
      isOpen={true} 
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-4">
          {agency.logo_url && (
            <img 
              src={agency.logo_url} 
              alt={`Logo ${agency.name}`}
              className="w-12 h-12 object-contain"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{agency.name}</h2>
            {agency.acronym && (
              <p className="text-muted-foreground">({agency.acronym})</p>
            )}
          </div>
        </div>
      }
    >
      <ModernTabsWithIcon tabs={tabs} defaultValue="overview" />
    </ModernModal>
  );
};
