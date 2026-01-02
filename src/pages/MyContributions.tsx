import React from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PageHero } from '@/components/shared/PageHero';
import { GlassCard } from '@/components/ui/glass-card';
import { ModernButton } from '@/components/ui/modern-button';
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
      <div className="min-h-screen bg-[hsl(var(--nx-bg))] flex items-center justify-center">
        <div className="text-white/60">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        
        {/* Hero */}
        <PageHero
          badge="Mes Contributions"
          badgeIcon={FileText}
          title="Suivi de vos Soumissions"
          subtitle="Suivez l'état de vos soumissions au réseau SUTEL"
          ctaLabel="Nouvelle contribution"
          ctaIcon={Plus}
          onCtaClick={() => navigate('/submit')}
        />

        {/* Liste des contributions */}
        {submissions.length === 0 ? (
          <GlassCard className="p-12 text-center border-dashed animate-fade-in">
            <FileText className="h-12 w-12 mx-auto text-white/30 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aucune contribution
            </h3>
            <p className="text-white/60 mb-6">
              Vous n'avez pas encore partagé d'initiative avec le réseau.
            </p>
            <ModernButton onClick={() => navigate('/submit')}>
              Partager une initiative
            </ModernButton>
          </GlassCard>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {submissions.map((submission) => {
              const status = statusConfig[submission.status as keyof typeof statusConfig] || statusConfig.draft;
              const StatusIcon = status.icon;
              
              return (
                <GlassCard key={submission.id} className="p-6 hover:bg-white/[0.08] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                          {typeLabels[submission.type as keyof typeof typeLabels] || submission.type}
                        </Badge>
                        <Badge 
                          variant={status.variant} 
                          className={`gap-1 ${status.variant === 'default' ? 'bg-green-500' : status.variant === 'secondary' ? 'bg-white/10 text-white/70' : ''}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white">
                        {submission.title}
                      </h3>
                      
                      {submission.content?.description && (
                        <p className="text-sm text-white/60 line-clamp-2">
                          {submission.content.description}
                        </p>
                      )}
                      
                      <p className="text-xs text-white/50">
                        Créé {formatDistanceToNow(new Date(submission.created_at), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {submission.status === 'draft' && (
                        <>
                          <ModernButton
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/submit?edit=${submission.id}`)}
                            aria-label="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </ModernButton>
                          <ModernButton
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ModernButton>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyContributions;
