import { useTranslation } from 'react-i18next';
import { Navigate, Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useMyFocalPoint, useCountryFocalPoints } from '@/hooks/useFocalPoints';
import { useSubmissionStats, useMySubmissions, useSubmissionsByStatus } from '@/hooks/useIndicatorSubmissions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FocalChatWidget } from '@/components/focal-chat';
import { useCreateDirectConversation } from '@/hooks/useFocalChat';

export default function FocalDashboard() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const { data: myFocalPoint, isLoading: fpLoading } = useMyFocalPoint();
  const { data: countryFocalPoints } = useCountryFocalPoints(myFocalPoint?.country_code || null);
  const { data: submissionStats } = useSubmissionStats(myFocalPoint?.country_code);
  const { data: mySubmissions } = useMySubmissions();
  const { data: pendingValidation } = useSubmissionsByStatus('submitted', myFocalPoint?.country_code || undefined);

  // Get country name
  const { data: country } = useQuery({
    queryKey: ['country', myFocalPoint?.country_code],
    queryFn: async () => {
      if (!myFocalPoint?.country_code) return null;
      const { data, error } = await supabase
        .from('countries')
        .select('name_fr, code')
        .eq('code', myFocalPoint.country_code)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!myFocalPoint?.country_code,
  });

  // Get indicator definitions count
  const { data: indicatorCount } = useQuery({
    queryKey: ['indicator-definitions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('indicator_definitions')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  if (authLoading || fpLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!myFocalPoint) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Vous n'êtes pas enregistré comme point focal. Contactez l'administrateur UAT si vous
              pensez que c'est une erreur.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.history.back()}>
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = indicatorCount
    ? Math.round(((submissionStats?.published || 0) / indicatorCount) * 100)
    : 0;

  const otherFocalPoint = countryFocalPoints?.find((fp) => fp.id !== myFocalPoint.id);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Point Focal</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Badge variant="outline">{country?.name_fr || myFocalPoint.country_code}</Badge>
            <span>•</span>
            <span>
              {myFocalPoint.designation_type === 'primary' ? 'Point focal principal' : 'Point focal secondaire'}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/submit">
              <FileText className="mr-2 h-4 w-4" />
              Saisir des données
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Indicateurs saisis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              sur {indicatorCount} indicateurs
            </p>
            <Progress value={completionPercentage} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente de validation</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{submissionStats?.submitted || 0}</div>
            <p className="text-xs text-muted-foreground">à valider par le 2ème point focal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Validés</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submissionStats?.validated || 0}</div>
            <p className="text-xs text-muted-foreground">en attente de publication</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Publiés</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{submissionStats?.published || 0}</div>
            <p className="text-xs text-muted-foreground">visibles publiquement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Validation */}
          {(pendingValidation?.length || 0) > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Soumissions à valider
                </CardTitle>
                <CardDescription>
                  Ces données ont été soumises et attendent votre validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingValidation?.slice(0, 5).map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{submission.indicator_code}</p>
                        <p className="text-sm text-muted-foreground">
                          Année: {submission.year} {submission.quarter && `• T${submission.quarter}`}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Valider
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Mes dernières soumissions</CardTitle>
              <CardDescription>Historique de vos contributions récentes</CardDescription>
            </CardHeader>
            <CardContent>
              {mySubmissions?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune soumission pour le moment</p>
                  <Button className="mt-4" variant="outline" asChild>
                    <Link to="/submit">Commencer à saisir des données</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mySubmissions?.slice(0, 5).map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{submission.indicator_code}</p>
                        <p className="text-sm text-muted-foreground">
                          {submission.submitted_value} {submission.unit} • {submission.year}
                        </p>
                      </div>
                      <Badge
                        variant={
                          submission.status === 'published'
                            ? 'default'
                            : submission.status === 'validated'
                            ? 'secondary'
                            : submission.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {submission.status === 'draft'
                          ? 'Brouillon'
                          : submission.status === 'submitted'
                          ? 'Soumis'
                          : submission.status === 'validated'
                          ? 'Validé'
                          : submission.status === 'rejected'
                          ? 'Rejeté'
                          : 'Publié'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          {/* My Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mon profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">
                  {myFocalPoint.first_name} {myFocalPoint.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{myFocalPoint.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organisation</p>
                <p className="font-medium">{myFocalPoint.organization || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fonction</p>
                <p className="font-medium">{myFocalPoint.job_title || '-'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Other Focal Point */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Autre point focal
              </CardTitle>
              <CardDescription>Votre partenaire pour la validation des données</CardDescription>
            </CardHeader>
            <CardContent>
              {otherFocalPoint ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">
                      {otherFocalPoint.first_name} {otherFocalPoint.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {otherFocalPoint.designation_type === 'primary'
                        ? 'Point focal principal'
                        : 'Point focal secondaire'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{otherFocalPoint.email}</p>
                  </div>
                  <Badge
                    variant={otherFocalPoint.status === 'active' ? 'default' : 'secondary'}
                  >
                    {otherFocalPoint.status === 'active' ? 'Actif' : 'En attente'}
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun autre point focal désigné</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/submit">
                  <FileText className="mr-2 h-4 w-4" />
                  Saisir des indicateurs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/my-country">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Voir le profil pays
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/indicators">
                  <Calendar className="mr-2 h-4 w-4" />
                  Consulter les indicateurs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Widget pour les points focaux */}
      <FocalChatWidget />
    </div>
  );
}
