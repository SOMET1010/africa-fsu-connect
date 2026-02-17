import { useState, useMemo } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RTLChecklist } from '@/components/admin/i18n/RTLChecklist';
import { QALanguagePreview } from '@/components/admin/i18n/QALanguagePreview';
import { getTranslationStats, buildTranslationData } from '@/utils/export-translations';
import { LANGUAGES, LANGUAGE_LIST, type SupportedLanguage } from '@/i18n/languages';
import { useLanguage } from '@/hooks/useLanguage';
import { Globe, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const coverageColor = (pct: number) => {
  if (pct >= 90) return 'text-primary';
  if (pct >= 60) return 'text-yellow-500';
  return 'text-destructive';
};

const coverageBadge = (pct: number) => {
  if (pct >= 90) return 'default' as const;
  if (pct >= 60) return 'secondary' as const;
  return 'destructive' as const;
};

const I18nQAChecklist = () => {
  const stats = useMemo(() => getTranslationStats(), []);
  const data = useMemo(() => buildTranslationData(), []);
  const [previewLang, setPreviewLang] = useState<SupportedLanguage>('fr');
  const { setLanguage } = useLanguage();

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, { total: number; missing: Record<SupportedLanguage, number> }>();
    data.forEach(row => {
      if (!map.has(row.section)) {
        map.set(row.section, { total: 0, missing: { fr: 0, en: 0, pt: 0, ar: 0 } });
      }
      const s = map.get(row.section)!;
      s.total++;
      if (!row.fr) s.missing.fr++;
      if (!row.en) s.missing.en++;
      if (!row.pt) s.missing.pt++;
      if (!row.ar) s.missing.ar++;
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  const langStats = [
    { code: 'fr' as const, count: stats.frCount, pct: stats.frPercentage },
    { code: 'en' as const, count: stats.enCount, pct: stats.enPercentage },
    { code: 'pt' as const, count: stats.ptCount, pct: stats.ptPercentage },
    { code: 'ar' as const, count: stats.arCount, pct: stats.arPercentage },
  ];

  return (
    <PageContainer size="xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            QA Checklist i18n
          </h1>
          <p className="text-muted-foreground mt-1">Vérification interactive des traductions et du support RTL</p>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">📊 Couverture</TabsTrigger>
            <TabsTrigger value="sections">📋 Par section</TabsTrigger>
            <TabsTrigger value="preview">👁️ Aperçu live</TabsTrigger>
            <TabsTrigger value="rtl">🔄 RTL</TabsTrigger>
          </TabsList>

          {/* Tab 1: Dashboard */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {langStats.map(({ code, count, pct }) => {
                const lang = LANGUAGES[code];
                return (
                  <Card key={code}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                        {pct >= 90 ? <CheckCircle2 className="h-4 w-4 text-primary ml-auto" /> :
                         pct >= 60 ? <AlertTriangle className="h-4 w-4 text-yellow-500 ml-auto" /> :
                         <XCircle className="h-4 w-4 text-destructive ml-auto" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${coverageColor(pct)}`}>{pct}%</div>
                      <p className="text-xs text-muted-foreground">{count} / {stats.totalKeys} clés</p>
                      <Progress value={pct} className="mt-2 h-2" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Total des clés de traduction : <strong className="text-foreground">{stats.totalKeys}</strong>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: By section */}
          <TabsContent value="sections" className="space-y-3">
            {sections.map(([section, info]) => (
              <Card key={section}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{section} ({info.total} clés)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['fr', 'en', 'pt', 'ar'] as const).map(lang => {
                      const missing = info.missing[lang];
                      const pct = Math.round(((info.total - missing) / info.total) * 100);
                      return (
                        <div key={lang} className="flex items-center gap-2">
                          <span className="text-sm">{LANGUAGES[lang].flag}</span>
                          <Progress value={pct} className="h-2 flex-1" />
                          <Badge variant={coverageBadge(pct)} className="text-xs shrink-0">
                            {missing === 0 ? '✓' : `-${missing}`}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab 3: Live preview */}
          <TabsContent value="preview" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {LANGUAGE_LIST.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setPreviewLang(lang.code);
                    setLanguage(lang.code);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    previewLang === lang.code
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-muted'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
            <QALanguagePreview selectedLang={previewLang} />
          </TabsContent>

          {/* Tab 4: RTL */}
          <TabsContent value="rtl">
            <RTLChecklist />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default I18nQAChecklist;
