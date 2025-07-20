
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
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
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="mission">Mission</TabsTrigger>
              <TabsTrigger value="cooperation">Coopération</TabsTrigger>
              <TabsTrigger value="resources">Ressources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
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
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
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
                </Card>
              </div>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Contact</h3>
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
              </Card>
            </TabsContent>

            <TabsContent value="mission" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Mission et mandat</h3>
                {agency.description ? (
                  <p className="text-sm leading-relaxed">{agency.description}</p>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>Informations de mission en cours de collecte</p>
                    <p className="text-xs mt-2">
                      Les données seront disponibles après synchronisation avec le site officiel
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="cooperation" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Partenariats et coopération</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Informations de coopération en cours de collecte</p>
                  <p className="text-xs mt-2">
                    Accords de partenariat et projets conjoints seront affichés ici
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Publications et ressources</h3>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>Ressources en cours de collecte</p>
                  <p className="text-xs mt-2">
                    Publications officielles et documents réglementaires seront disponibles
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};
