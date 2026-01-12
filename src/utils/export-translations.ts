import * as XLSX from 'xlsx';
import frTranslations from '@/i18n/translations/fr.json';
import enTranslations from '@/i18n/translations/en.json';
import ptTranslations from '@/i18n/translations/pt.json';
import arTranslations from '@/i18n/translations/ar.json';

export interface TranslationRow {
  key: string;
  fr: string;
  en: string;
  pt: string;
  ar: string;
  section: string;
  completeness: number;
}

export interface TranslationStats {
  totalKeys: number;
  frCount: number;
  enCount: number;
  ptCount: number;
  arCount: number;
  frPercentage: number;
  enPercentage: number;
  ptPercentage: number;
  arPercentage: number;
}

/**
 * Extract section from translation key
 */
const getSection = (key: string): string => {
  const parts = key.split('.');
  if (parts.length > 0) {
    const sectionMap: Record<string, string> = {
      nav: 'Navigation',
      network: 'Réseau',
      members: 'Membres',
      country: 'Pays',
      common: 'Commun',
      dashboard: 'Tableau de bord',
      actions: 'Actions',
      auth: 'Authentification',
      nexus: 'NEXUS',
      map: 'Carte',
      resources: 'Ressources',
      hero: 'Héros',
      features: 'Fonctionnalités',
      regions: 'Régions',
      feed: 'Flux',
      forum: 'Forum',
      projects: 'Projets',
      admin: 'Administration',
      enrichment: 'Enrichissement',
      activity: 'Activité',
      placeholder: 'Placeholders',
      security: 'Sécurité',
      time: 'Temps',
      welcome: 'Bienvenue',
      compare: 'Comparaison',
      submit: 'Soumission',
      events: 'Événements',
      form: 'Formulaire',
      assistant: 'Assistant',
      presentation: 'Présentation',
      elearning: 'E-Learning',
      library: 'Bibliothèque',
      focal: 'Points focaux',
      cta: 'Appel à l\'action',
    };
    return sectionMap[parts[0]] || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return 'Autre';
};

/**
 * Get all unique keys from all translation files
 */
export const getAllTranslationKeys = (): string[] => {
  const allKeys = new Set<string>();
  
  Object.keys(frTranslations).forEach(key => allKeys.add(key));
  Object.keys(enTranslations).forEach(key => allKeys.add(key));
  Object.keys(ptTranslations).forEach(key => allKeys.add(key));
  Object.keys(arTranslations).forEach(key => allKeys.add(key));
  
  return Array.from(allKeys).sort();
};

/**
 * Build consolidated translation data
 */
export const buildTranslationData = (): TranslationRow[] => {
  const allKeys = getAllTranslationKeys();
  const fr = frTranslations as Record<string, string>;
  const en = enTranslations as Record<string, string>;
  const pt = ptTranslations as Record<string, string>;
  const ar = arTranslations as Record<string, string>;
  
  return allKeys.map(key => {
    const hasValues = [fr[key], en[key], pt[key], ar[key]].filter(Boolean);
    const completeness = Math.round((hasValues.length / 4) * 100);
    
    return {
      key,
      fr: fr[key] || '',
      en: en[key] || '',
      pt: pt[key] || '',
      ar: ar[key] || '',
      section: getSection(key),
      completeness,
    };
  });
};

/**
 * Calculate translation statistics
 */
export const getTranslationStats = (): TranslationStats => {
  const allKeys = getAllTranslationKeys();
  const totalKeys = allKeys.length;
  
  const fr = frTranslations as Record<string, string>;
  const en = enTranslations as Record<string, string>;
  const pt = ptTranslations as Record<string, string>;
  const ar = arTranslations as Record<string, string>;
  
  const frCount = Object.keys(fr).length;
  const enCount = Object.keys(en).length;
  const ptCount = Object.keys(pt).length;
  const arCount = Object.keys(ar).length;
  
  return {
    totalKeys,
    frCount,
    enCount,
    ptCount,
    arCount,
    frPercentage: Math.round((frCount / totalKeys) * 100),
    enPercentage: Math.round((enCount / totalKeys) * 100),
    ptPercentage: Math.round((ptCount / totalKeys) * 100),
    arPercentage: Math.round((arCount / totalKeys) * 100),
  };
};

/**
 * Export translations to Excel file
 */
export const exportToExcel = (): void => {
  const data = buildTranslationData();
  const stats = getTranslationStats();
  
  // Prepare data for Excel
  const excelData = data.map(row => ({
    'Clé': row.key,
    'Français': row.fr,
    'Anglais': row.en,
    'Portugais': row.pt,
    'Arabe': row.ar,
    'Section': row.section,
    'Complétude': `${row.completeness}%`,
  }));
  
  // Create workbook and main worksheet
  const wb = XLSX.utils.book_new();
  
  // Translations sheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 40 },  // Key
    { wch: 60 },  // FR
    { wch: 60 },  // EN
    { wch: 60 },  // PT
    { wch: 60 },  // AR
    { wch: 20 },  // Section
    { wch: 12 },  // Completeness
  ];
  
  XLSX.utils.book_append_sheet(wb, ws, 'Traductions');
  
  // Stats sheet
  const statsData = [
    { 'Métrique': 'Total des clés', 'Valeur': stats.totalKeys },
    { 'Métrique': 'Français', 'Valeur': `${stats.frCount} (${stats.frPercentage}%)` },
    { 'Métrique': 'Anglais', 'Valeur': `${stats.enCount} (${stats.enPercentage}%)` },
    { 'Métrique': 'Portugais', 'Valeur': `${stats.ptCount} (${stats.ptPercentage}%)` },
    { 'Métrique': 'Arabe', 'Valeur': `${stats.arCount} (${stats.arPercentage}%)` },
  ];
  const statsWs = XLSX.utils.json_to_sheet(statsData);
  statsWs['!cols'] = [{ wch: 20 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, statsWs, 'Statistiques');
  
  // Missing keys sheet (only PT and AR)
  const missingKeys = data.filter(row => !row.pt || !row.ar);
  const missingData = missingKeys.map(row => ({
    'Clé': row.key,
    'Français (référence)': row.fr,
    'Portugais manquant': !row.pt ? 'OUI' : '',
    'Arabe manquant': !row.ar ? 'OUI' : '',
  }));
  
  if (missingData.length > 0) {
    const missingWs = XLSX.utils.json_to_sheet(missingData);
    missingWs['!cols'] = [{ wch: 40 }, { wch: 60 }, { wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, missingWs, 'Clés manquantes');
  }
  
  // Download
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `traductions-sutel-${date}.xlsx`);
};

/**
 * Export translations to CSV
 */
export const exportToCSV = (): void => {
  const data = buildTranslationData();
  
  const excelData = data.map(row => ({
    'Clé': row.key,
    'Français': row.fr,
    'Anglais': row.en,
    'Portugais': row.pt,
    'Arabe': row.ar,
    'Section': row.section,
    'Complétude': `${row.completeness}%`,
  }));
  
  const ws = XLSX.utils.json_to_sheet(excelData);
  const csv = XLSX.utils.sheet_to_csv(ws);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `traductions-sutel-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export translations to JSON (consolidated)
 */
export const exportToJSON = (): void => {
  const data = {
    exportDate: new Date().toISOString(),
    stats: getTranslationStats(),
    translations: buildTranslationData(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `traductions-sutel-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
