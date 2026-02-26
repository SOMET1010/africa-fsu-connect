import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';

interface ResourceFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: ResourceFilterValues) => void;
  initialFilters?: ResourceFilterValues;
}

export interface ResourceFilterValues {
  type?: string;
  theme?: string;
  country?: string;
  language?: string;
  tags?: string[];
}

interface SavedFilter {
  id: string;
  name: string;
  filters: ResourceFilterValues;
  search: string;
}

const STORAGE_KEY = 'resource_saved_filters';

const DOCUMENT_TYPES = [
  { value: 'guide', labelFr: 'Guide', labelEn: 'Guide', labelAr: 'دليل', labelPt: 'Guia', icon: '📘' },
  { value: 'report', labelFr: 'Rapport', labelEn: 'Report', labelAr: 'تقرير', labelPt: 'Relatório', icon: '📊' },
  { value: 'note-conceptuelle', labelFr: 'Note conceptuelle', labelEn: 'Concept Note', labelAr: 'مذكرة مفاهيمية', labelPt: 'Nota conceitual', icon: '💡' },
  { value: 'bonne-pratique', labelFr: 'Bonne pratique', labelEn: 'Best Practice', labelAr: 'أفضل ممارسة', labelPt: 'Boa prática', icon: '✨' },
  { value: 'modele', labelFr: 'Modèle / Template', labelEn: 'Template', labelAr: 'نموذج', labelPt: 'Modelo', icon: '📝' },
  { value: 'presentation', labelFr: 'Présentation', labelEn: 'Presentation', labelAr: 'عرض تقديمي', labelPt: 'Apresentação', icon: '📽️' },
  { value: 'form', labelFr: 'Formulaire', labelEn: 'Form', labelAr: 'استمارة', labelPt: 'Formulário', icon: '📋' },
  { value: 'other', labelFr: 'Autre', labelEn: 'Other', labelAr: 'أخرى', labelPt: 'Outro', icon: '📄' },
];

const THEMES = [
  { value: 'connectivity', labelFr: 'Connectivité', labelEn: 'Connectivity', labelAr: 'الاتصال', labelPt: 'Conectividade' },
  { value: 'funding', labelFr: 'Financement', labelEn: 'Funding', labelAr: 'التمويل', labelPt: 'Financiamento' },
  { value: 'regulation', labelFr: 'Régulation', labelEn: 'Regulation', labelAr: 'التنظيم', labelPt: 'Regulação' },
  { value: 'governance', labelFr: 'Gouvernance', labelEn: 'Governance', labelAr: 'الحوكمة', labelPt: 'Governança' },
  { value: 'digital-inclusion', labelFr: 'Inclusion numérique', labelEn: 'Digital Inclusion', labelAr: 'الشمول الرقمي', labelPt: 'Inclusão digital' },
  { value: 'infrastructure', labelFr: 'Infrastructure', labelEn: 'Infrastructure', labelAr: 'البنية التحتية', labelPt: 'Infraestrutura' },
  { value: 'education', labelFr: 'Éducation', labelEn: 'Education', labelAr: 'التعليم', labelPt: 'Educação' },
  { value: 'health', labelFr: 'Santé', labelEn: 'Health', labelAr: 'الصحة', labelPt: 'Saúde' },
];

const LANGUAGES = [
  { value: 'fr', labelFr: 'Français', labelEn: 'French', labelAr: 'الفرنسية', labelPt: 'Francês' },
  { value: 'en', labelFr: 'Anglais', labelEn: 'English', labelAr: 'الإنجليزية', labelPt: 'Inglês' },
  { value: 'pt', labelFr: 'Portugais', labelEn: 'Portuguese', labelAr: 'البرتغالية', labelPt: 'Português' },
  { value: 'ar', labelFr: 'Arabe', labelEn: 'Arabic', labelAr: 'العربية', labelPt: 'Árabe' },
];

const L: Record<string, Record<string, string>> = {
  search:       { fr: 'Rechercher une ressource...', en: 'Search resources...', ar: 'البحث عن مورد...', pt: 'Pesquisar recurso...' },
  clear:        { fr: 'Effacer', en: 'Clear', ar: 'مسح', pt: 'Limpar' },
  allTypes:     { fr: 'Tous les types', en: 'All types', ar: 'جميع الأنواع', pt: 'Todos os tipos' },
  allThemes:    { fr: 'Tous les thèmes', en: 'All themes', ar: 'جميع المواضيع', pt: 'Todos os temas' },
  allCountries: { fr: 'Tous les pays', en: 'All countries', ar: 'جميع الدول', pt: 'Todos os países' },
  allLanguages: { fr: 'Toutes les langues', en: 'All languages', ar: 'جميع اللغات', pt: 'Todos os idiomas' },
  type:         { fr: 'Type', en: 'Type', ar: 'النوع', pt: 'Tipo' },
  theme:        { fr: 'Thème', en: 'Theme', ar: 'الموضوع', pt: 'Tema' },
  country:      { fr: 'Pays', en: 'Country', ar: 'الدولة', pt: 'País' },
  language:     { fr: 'Langue', en: 'Language', ar: 'اللغة', pt: 'Idioma' },
  savedFilters: { fr: 'Filtres sauvegardés', en: 'Saved filters', ar: 'فلاتر محفوظة', pt: 'Filtros salvos' },
  saveFilter:   { fr: 'Sauvegarder ce filtre', en: 'Save this filter', ar: 'حفظ هذا الفلتر', pt: 'Salvar este filtro' },
  filterName:   { fr: 'Nom du filtre...', en: 'Filter name...', ar: 'اسم الفلتر...', pt: 'Nome do filtro...' },
  save:         { fr: 'Sauvegarder', en: 'Save', ar: 'حفظ', pt: 'Salvar' },
  noSaved:      { fr: 'Aucun filtre sauvegardé', en: 'No saved filters', ar: 'لا توجد فلاتر محفوظة', pt: 'Nenhum filtro salvo' },
  advanced:     { fr: 'Filtres avancés', en: 'Advanced filters', ar: 'فلاتر متقدمة', pt: 'Filtros avançados' },
  tags:         { fr: 'Tags', en: 'Tags', ar: 'العلامات', pt: 'Tags' },
  activeFilters:{ fr: 'filtres actifs', en: 'active filters', ar: 'فلاتر نشطة', pt: 'filtros ativos' },
};

const t = (key: string, lang: string) => L[key]?.[lang] ?? L[key]?.fr ?? key;
const label = (item: any, lang: string) => {
  if (lang === 'ar') return item.labelAr || item.labelFr;
  if (lang === 'pt') return item.labelPt || item.labelFr;
  if (lang === 'en') return item.labelEn || item.labelFr;
  return item.labelFr;
};

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  onSearch,
  onFilterChange,
  initialFilters = {},
}) => {
  const { currentLanguage } = useTranslation();
  const lang = currentLanguage || 'fr';
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ResourceFilterValues>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [countries, setCountries] = useState<{ code: string; name_fr: string; name_en: string }[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load countries from DB
  useEffect(() => {
    supabase.from('countries').select('code, name_fr, name_en').order('name_fr').then(({ data }) => {
      if (data) setCountries(data);
    });
  }, []);

  // Load available tags from documents
  useEffect(() => {
    supabase.from('documents').select('tags').not('tags', 'is', null).then(({ data }) => {
      if (data) {
        const allTags = data.flatMap(d => d.tags || []);
        setAvailableTags([...new Set(allTags)].sort());
      }
    });
  }, []);

  // Load saved filters from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedFilters(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleFilterChange = useCallback((key: keyof ResourceFilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const toggleTag = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    const newFilters = { ...filters, tags: newTags.length > 0 ? newTags : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    onSearch('');
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  const activeFilterCount = [
    filters.type, filters.theme, filters.country, filters.language,
    ...(filters.tags || [])
  ].filter(Boolean).length;

  const hasActiveFilters = searchQuery || activeFilterCount > 0;

  // Save current filter preset
  const handleSaveFilter = useCallback(() => {
    if (!saveFilterName.trim()) return;
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: saveFilterName.trim(),
      filters: { ...filters },
      search: searchQuery,
    };
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSaveFilterName('');
  }, [saveFilterName, filters, searchQuery, savedFilters]);

  const applySavedFilter = useCallback((saved: SavedFilter) => {
    setSearchQuery(saved.search);
    setFilters(saved.filters);
    onSearch(saved.search);
    onFilterChange(saved.filters);
  }, [onSearch, onFilterChange]);

  const deleteSavedFilter = useCallback((id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, [savedFilters]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search', lang)}
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-12 h-12 text-base bg-background border-border/50 focus:border-primary/50"
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            {t('clear', lang)}
          </Button>
        )}
      </div>

      {/* Primary filter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Type */}
        <Select value={filters.type || 'all'} onValueChange={(v) => handleFilterChange('type', v)}>
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={t('type', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTypes', lang)}</SelectItem>
            {DOCUMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">{type.icon} {label(type, lang)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Theme */}
        <Select value={filters.theme || 'all'} onValueChange={(v) => handleFilterChange('theme', v)}>
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={t('theme', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allThemes', lang)}</SelectItem>
            {THEMES.map((theme) => (
              <SelectItem key={theme.value} value={theme.value}>
                {label(theme, lang)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Country — DB-driven */}
        <Select value={filters.country || 'all'} onValueChange={(v) => handleFilterChange('country', v)}>
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={t('country', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCountries', lang)}</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {lang === 'en' ? c.name_en : c.name_fr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language */}
        <Select value={filters.language || 'all'} onValueChange={(v) => handleFilterChange('language', v)}>
          <SelectTrigger className="h-10 bg-background border-border/50">
            <SelectValue placeholder={t('language', lang)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allLanguages', lang)}</SelectItem>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {label(l, lang)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced toggle + active filter count */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {t('advanced', lang)}
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFilterCount} {t('activeFilters', lang)}
            </Badge>
          )}
        </Button>

        {/* Saved filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              {t('savedFilters', lang)}
              {savedFilters.length > 0 && (
                <Badge variant="secondary" className="text-xs">{savedFilters.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 space-y-3">
            <p className="text-sm font-medium">{t('savedFilters', lang)}</p>

            {savedFilters.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t('noSaved', lang)}</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {savedFilters.map((sf) => (
                  <div key={sf.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50 group">
                    <button
                      onClick={() => applySavedFilter(sf)}
                      className="flex items-center gap-2 text-sm text-left flex-1 truncate"
                    >
                      <BookmarkCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{sf.name}</span>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavedFilter(sf.id)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {hasActiveFilters && (
              <div className="flex gap-2 pt-2 border-t">
                <Input
                  placeholder={t('filterName', lang)}
                  value={saveFilterName}
                  onChange={(e) => setSaveFilterName(e.target.value)}
                  className="h-8 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveFilter()}
                />
                <Button size="sm" onClick={handleSaveFilter} disabled={!saveFilterName.trim()} className="h-8 shrink-0">
                  {t('save', lang)}
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Advanced: Tags section */}
      {showAdvanced && availableTags.length > 0 && (
        <div className="space-y-2 p-4 rounded-lg border border-border/50 bg-muted/20 animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Tag className="h-4 w-4" />
            {t('tags', lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags?.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer transition-colors hover:bg-primary/20"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceFilters;
