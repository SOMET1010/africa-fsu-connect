import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Mail, UserCheck, UserX, Search, Filter, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFocalPoints, useCreateFocalPoint, useSendFocalPointInvitation, type CreateFocalPointData } from '@/hooks/useFocalPoints';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupportedLanguage } from '@/i18n/languages';

const languageLabels: Record<SupportedLanguage, string> = {
  fr: '🇫🇷 Français',
  en: '🇬🇧 English',
  pt: '🇵🇹 Português',
  ar: '🇸🇦 العربية',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  invited: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-orange-100 text-orange-800',
  revoked: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  invited: 'Invité',
  active: 'Actif',
  suspended: 'Suspendu',
  revoked: 'Révoqué',
};

export default function FocalPointsManagement() {
  const { t } = useTranslation();
  const { data: focalPoints, isLoading } = useFocalPoints();
  const createFocalPoint = useCreateFocalPoint();
  const sendInvitation = useSendFocalPointInvitation();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedFocalPointId, setSelectedFocalPointId] = useState<string | null>(null);
  const [inviteLanguage, setInviteLanguage] = useState<SupportedLanguage>('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<CreateFocalPointData>({
    country_code: '',
    designation_type: 'primary',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    whatsapp_number: '',
    organization: '',
    job_title: '',
    designated_by: '',
    notes: '',
  });

  // Fetch countries for dropdown
  const { data: countries } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('code, name_fr')
        .order('name_fr');
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFocalPoint.mutateAsync(formData);
    setIsDialogOpen(false);
    setFormData({
      country_code: '',
      designation_type: 'primary',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      whatsapp_number: '',
      organization: '',
      job_title: '',
      designated_by: '',
      notes: '',
    });
  };

  const handleOpenInviteDialog = (focalPointId: string) => {
    setSelectedFocalPointId(focalPointId);
    setInviteLanguage('fr');
    setIsInviteDialogOpen(true);
  };

  const handleSendInvitation = async () => {
    if (!selectedFocalPointId) return;
    await sendInvitation.mutateAsync({ 
      focalPointId: selectedFocalPointId, 
      language: inviteLanguage 
    });
    setIsInviteDialogOpen(false);
    setSelectedFocalPointId(null);
  };

  // Filter focal points
  const filteredFocalPoints = focalPoints?.filter((fp) => {
    const matchesSearch =
      searchTerm === '' ||
      fp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fp.country_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || fp.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || fp.country_code === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Stats
  const stats = {
    total: focalPoints?.length || 0,
    active: focalPoints?.filter((fp) => fp.status === 'active').length || 0,
    pending: focalPoints?.filter((fp) => fp.status === 'pending').length || 0,
    invited: focalPoints?.filter((fp) => fp.status === 'invited').length || 0,
  };

  // Get unique countries from focal points
  const uniqueCountries = [...new Set(focalPoints?.map((fp) => fp.country_code) || [])];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Points Focaux</h1>
          <p className="text-muted-foreground">
            Gérez les points focaux désignés par les États membres pour la saisie des données FSU
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un point focal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau point focal</DialogTitle>
              <DialogDescription>
                Enregistrez les informations du point focal désigné par l'État membre
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Select
                    value={formData.country_code}
                    onValueChange={(value) => setFormData({ ...formData, country_code: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name_fr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation_type">Type de désignation *</Label>
                  <Select
                    value={formData.designation_type}
                    onValueChange={(value: 'primary' | 'secondary') =>
                      setFormData({ ...formData, designation_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Point focal principal</SelectItem>
                      <SelectItem value="secondary">Point focal secondaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    placeholder="+225 XX XX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organisation</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Ministère, Agence..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job_title">Fonction</Label>
                  <Input
                    id="job_title"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designated_by">Désigné par</Label>
                  <Input
                    id="designated_by"
                    value={formData.designated_by}
                    onChange={(e) => setFormData({ ...formData, designated_by: e.target.value })}
                    placeholder="Autorité de désignation"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informations complémentaires..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createFocalPoint.isPending}>
                  {createFocalPoint.isPending ? 'Création...' : 'Créer le point focal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Invités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.invited}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="invited">Invité</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
                <SelectItem value="revoked">Révoqué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[200px]">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les pays</SelectItem>
                {uniqueCountries.map((code) => (
                  <SelectItem key={code} value={code}>
                    {countries?.find((c) => c.code === code)?.name_fr || code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pays</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredFocalPoints?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun point focal trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredFocalPoints?.map((fp) => (
                  <TableRow key={fp.id}>
                    <TableCell className="font-medium">
                      {countries?.find((c) => c.code === fp.country_code)?.name_fr || fp.country_code}
                    </TableCell>
                    <TableCell>
                      <Badge variant={fp.designation_type === 'primary' ? 'default' : 'secondary'}>
                        {fp.designation_type === 'primary' ? 'Principal' : 'Secondaire'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {fp.first_name} {fp.last_name}
                    </TableCell>
                    <TableCell>{fp.email}</TableCell>
                    <TableCell>{fp.organization || '-'}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[fp.status]}>
                        {statusLabels[fp.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {fp.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenInviteDialog(fp.id)}
                            disabled={sendInvitation.isPending}
                          >
                            <Mail className="mr-1 h-4 w-4" />
                            Inviter
                          </Button>
                        )}
                        {fp.status === 'active' && (
                          <Button size="sm" variant="ghost">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invitation Language Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('focal.invitation.language')}
            </DialogTitle>
            <DialogDescription>
              Sélectionnez la langue dans laquelle l'invitation sera envoyée
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('focal.invitation.language')}</Label>
              <Select
                value={inviteLanguage}
                onValueChange={(value) => setInviteLanguage(value as SupportedLanguage)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(languageLabels) as [SupportedLanguage, string][]).map(([code, label]) => (
                    <SelectItem key={code} value={code}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={sendInvitation.isPending}
              >
                <Mail className="mr-2 h-4 w-4" />
                {sendInvitation.isPending ? t('focal.invitation.sending') : t('focal.invitation.send')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
