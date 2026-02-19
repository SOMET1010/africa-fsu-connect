import { useAuth } from '@/contexts/AuthContext';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LANGUAGES, type SupportedLanguage } from '@/i18n/languages';

const SLOGAN_FIELDS = ['badge', 'title', 'subtitle_highlight', 'description'] as const;

interface FieldStatus {
  field: string;
  missingIn: SupportedLanguage[];
}

export function AdminLocaleConsistencyAlert() {
  const { profile } = useAuth();
  const { blocks, isLoading } = useHomepageContent();
  const [dismissed, setDismissed] = useState(false);

  const isAdmin = profile?.role && ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);

  if (!isAdmin || isLoading || dismissed) return null;

  // Find the hero block raw data (all locales)
  const heroBlock = blocks.find((b: any) => b.block_key === 'hero');
  if (!heroBlock) return null;

  const locales: SupportedLanguage[] = ['fr', 'en', 'ar', 'pt'];
  const localeColumns: Record<SupportedLanguage, string> = {
    fr: 'content_fr',
    en: 'content_en',
    ar: 'content_ar',
    pt: 'content_pt',
  };

  const issues: FieldStatus[] = [];

  for (const field of SLOGAN_FIELDS) {
    const missingIn: SupportedLanguage[] = [];
    for (const lang of locales) {
      const content = (heroBlock as any)[localeColumns[lang]];
      const value = content?.[field];
      if (value === undefined || value === null) {
        missingIn.push(lang);
      }
    }
    if (missingIn.length > 0) {
      issues.push({ field, missingIn });
    }
  }

  const hasIssues = issues.length > 0;

  return (
    <div
      className={cn(
        'mx-auto max-w-4xl mt-4 rounded-lg border px-4 py-3 text-sm flex items-start gap-3',
        hasIssues
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      )}
    >
      {hasIssues ? (
        <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0 text-amber-400" />
      ) : (
        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-400" />
      )}

      <div className="flex-1">
        {hasIssues ? (
          <>
            <p className="font-semibold">Incohérence de slogan détectée</p>
            <ul className="mt-1 space-y-0.5 text-xs text-amber-300/80">
              {issues.map((issue) => (
                <li key={issue.field}>
                  <span className="font-mono">{issue.field}</span> — manquant en{' '}
                  {issue.missingIn.map((l) => LANGUAGES[l]?.flag ?? l).join(', ')}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-amber-300/60">
              Mettez à jour via{' '}
              <a href="/admin/homepage-editor" className="underline hover:text-amber-200">
                l'éditeur de page d'accueil
              </a>
              .
            </p>
          </>
        ) : (
          <p>Slogan cohérent dans les 4 langues (FR, EN, AR, PT).</p>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
