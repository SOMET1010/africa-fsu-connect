import React from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAdvancedSubmissions } from '@/hooks/useAdvancedSubmissions';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusConfig = {
  draft: { label: 'Brouillon', icon: Edit, variant: 'secondary' as const },
  submitted: { label: 'Soumis', icon: Clock, variant: 'outline' as const },
  under_review: { label: 'En revue', icon: Clock, variant: 'outline' as const },
  approved: { label: 'Approuvé', icon: CheckCircle, variant: 'default' as const },
  rejected: { label: 'Rejeté', icon: XCircle, variant: 'destructive' as const },
};

const typeLabels = {
  project: 'Projet',
  position: 'Bonne pratique',
  regulation: 'Ressource',
  funding: 'Financement',
};

export const MyContributions = () => {
  const navigate = useNavigate();
  const { submissions, loading } = useAdvancedSubmissions();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Mes contributions
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivez l'état de vos soumissions au réseau SUTEL
            </p>
          </div>
          
          <Button onClick={() => navigate('/submit')} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle contribution
          </Button>
        </div>

        {/* Liste des contributions */}
        {submissions.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune contribution
              </h3>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore partagé d'initiative avec le réseau.
              </p>
              <Button onClick={() => navigate('/submit')}>
                Partager une initiative
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const status = statusConfig[submission.status as keyof typeof statusConfig] || statusConfig.draft;
              const StatusIcon = status.icon;
              
              return (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[submission.type as keyof typeof typeLabels] || submission.type}
                          </Badge>
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground">
                          {submission.title}
                        </h3>
                        
                        {submission.content?.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {submission.content.description}
                          </p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          Créé {formatDistanceToNow(new Date(submission.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {submission.status === 'draft' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/submit?edit=${submission.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyContributions;
