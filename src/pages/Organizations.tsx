import { useState } from 'react';
import { Plus, Globe, Wifi, WifiOff, Settings, Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAgencies } from '@/hooks/useAgencies';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';

const REGIONS = {
  'CEDEAO': 'ECOWAS (Afrique de l\'Ouest)',
  'SADC': 'SADC (Afrique Australe)',
  'EACO': 'EACO (Afrique de l\'Est)',
  'ECCAS': 'ECCAS (Afrique Centrale)',
  'UMA': 'UMA (Afrique du Nord)'
};

const SYNC_STATUS_COLORS = {
  'active': 'bg-success text-success-foreground',
  'pending': 'bg-warning text-warning-foreground',
  'error': 'bg-destructive text-destructive-foreground',
  'inactive': 'bg-muted text-muted-foreground'
};

const SYNC_STATUS_ICONS = {
  'active': Wifi,
  'pending': Settings,
  'error': WifiOff,
  'inactive': WifiOff
};

export default function Organizations() {
  const { agencies, loading } = useAgencies();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || agency.region === selectedRegion;
    const matchesStatus = selectedStatus === 'all' || agency.sync_status === selectedStatus;
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agences Partenaires</h1>
          <p className="text-muted-foreground">
            Réseau fédéré des organismes de régulation des télécommunications africains
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une agence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{agencies.length}</p>
                <p className="text-sm text-muted-foreground">Agences totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Wifi className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {agencies.filter(a => a.sync_status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Connectées</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Settings className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {agencies.filter(a => a.sync_status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <WifiOff className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {agencies.filter(a => a.sync_status === 'error').length}
                </p>
                <p className="text-sm text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Input
          placeholder="Rechercher une agence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-sm"
        />
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les régions</SelectItem>
            {Object.entries(REGIONS).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Connectée</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="error">Erreur</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => {
          const StatusIcon = SYNC_STATUS_ICONS[agency.sync_status as keyof typeof SYNC_STATUS_ICONS];
          
          return (
            <Card key={agency.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{agency.acronym}</CardTitle>
                    <CardDescription className="font-medium">
                      {agency.name}
                    </CardDescription>
                  </div>
                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{agency.country}</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {agency.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {REGIONS[agency.region as keyof typeof REGIONS]}
                  </Badge>
                  <Badge 
                    className={SYNC_STATUS_COLORS[agency.sync_status as keyof typeof SYNC_STATUS_COLORS]}
                  >
                    {agency.sync_status}
                  </Badge>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAgencies.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune agence trouvée</h3>
          <p className="text-muted-foreground">
            Aucune agence ne correspond à vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
}