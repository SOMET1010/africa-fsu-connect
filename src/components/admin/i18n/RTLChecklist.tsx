import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CheckStatus = 'ok' | 'problem' | 'untested';

interface CheckItem {
  id: string;
  label: string;
  description: string;
}

const RTL_CHECKS: CheckItem[] = [
  { id: 'text_direction', label: 'Direction du texte arabe', description: 'Le texte arabe s\'affiche de droite à gauche' },
  { id: 'icon_alignment', label: 'Alignement des icônes', description: 'Les icônes sont positionnées côté droit en RTL' },
  { id: 'sidebar_nav', label: 'Navigation latérale inversée', description: 'La sidebar s\'affiche à droite en mode arabe' },
  { id: 'forms_inputs', label: 'Formulaires et inputs', description: 'Les labels et champs sont alignés à droite' },
  { id: 'tables_lists', label: 'Tableaux et listes', description: 'Les colonnes et éléments sont inversés' },
  { id: 'buttons_dropdowns', label: 'Boutons et dropdowns', description: 'Les menus déroulants s\'ouvrent correctement' },
  { id: 'breadcrumbs', label: 'Fil d\'Ariane', description: 'Les breadcrumbs sont inversés (← au lieu de →)' },
  { id: 'cards_layout', label: 'Grilles de cartes', description: 'L\'ordre des cartes est inversé en RTL' },
  { id: 'modals_dialogs', label: 'Modales et dialogues', description: 'Le contenu des modales respecte la direction RTL' },
  { id: 'animations', label: 'Animations et transitions', description: 'Les animations slide sont inversées en RTL' },
];

const STORAGE_KEY = 'i18n-qa-rtl-checklist';

const statusConfig: Record<CheckStatus, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'outline' }> = {
  ok: { label: '✅ OK', variant: 'default' },
  problem: { label: '❌ Problème', variant: 'destructive' },
  untested: { label: '⬜ Non testé', variant: 'secondary' },
};

export const RTLChecklist = () => {
  const [checks, setChecks] = useState<Record<string, CheckStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  }, [checks]);

  const cycleStatus = (id: string) => {
    const order: CheckStatus[] = ['untested', 'ok', 'problem'];
    const current = checks[id] || 'untested';
    const next = order[(order.indexOf(current) + 1) % order.length];
    setChecks(prev => ({ ...prev, [id]: next }));
  };

  const okCount = Object.values(checks).filter(s => s === 'ok').length;
  const problemCount = Object.values(checks).filter(s => s === 'problem').length;
  const total = RTL_CHECKS.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Checklist RTL (Arabe)</span>
          <div className="flex gap-2 text-sm font-normal">
            <Badge variant="default">{okCount} OK</Badge>
            <Badge variant="destructive">{problemCount} Problèmes</Badge>
            <Badge variant="secondary">{total - okCount - problemCount} Non testés</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {RTL_CHECKS.map(check => {
            const status = checks[check.id] || 'untested';
            const config = statusConfig[status];
            return (
              <button
                key={check.id}
                onClick={() => cycleStatus(check.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors',
                  status === 'ok' && 'border-primary/30 bg-primary/5',
                  status === 'problem' && 'border-destructive/30 bg-destructive/5',
                  status === 'untested' && 'border-border bg-card hover:bg-muted/50',
                )}
              >
                <div>
                  <p className="font-medium text-sm text-foreground">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.description}</p>
                </div>
                <Badge variant={config.variant} className="shrink-0 ml-3">
                  {config.label}
                </Badge>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
