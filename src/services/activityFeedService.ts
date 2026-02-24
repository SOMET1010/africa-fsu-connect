import { supabase } from '@/integrations/supabase/client';
import { CountriesService } from '@/services/countriesService';
import { logger } from '@/utils/logger';

export type ActivityType = 'project' | 'document' | 'event' | 'discussion';

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  country: string;
  flag: string;
  action: string;
  title: string;
  timestamp: string;
  meta?: string;
}

const normalizeLabel = (value?: string | null) => {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toUpperCase()
    .trim();
};

const toFlagEmoji = (code?: string) => {
  if (!code) return '🌍';
  const normalized = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return '🌍';
  const [first, second] = normalized;
  return String.fromCodePoint(
    0x1f1e6 + first.charCodeAt(0) - 65,
    0x1f1e6 + second.charCodeAt(0) - 65
  );
};

const buildCountryFlagMap = async () => {
  const countries = await CountriesService.getCountries();
  const map: Record<string, string> = {};
  countries.forEach((country) => {
    const normalizedCode = normalizeLabel(country.code);
    if (normalizedCode) map[normalizedCode] = country.code;
    const normalizedFr = normalizeLabel(country.name_fr);
    if (normalizedFr) map[normalizedFr] = country.code;
    const normalizedEn = normalizeLabel(country.name_en);
    if (normalizedEn) map[normalizedEn] = country.code;
  });
  return map;
};

const resolveFlagFromLabel = (label: string | undefined, flagMap: Record<string, string>) => {
  const normalized = normalizeLabel(label);
  const bestCode = flagMap[normalized];
  return toFlagEmoji(bestCode ?? normalized.slice(0, 2));
};

const mapProjectEntry = (entry: any, flagMap: Record<string, string>): ActivityFeedItem => {
  const countryLabel = entry?.agencies?.country || 'Réseau UDC';
  return {
    id: `project-${entry.id}`,
    type: 'project',
    country: countryLabel,
    flag: resolveFlagFromLabel(countryLabel, flagMap),
    action: 'a mis à jour un projet',
    title: entry.title,
    timestamp: entry.updated_at || entry.created_at || new Date().toISOString(),
    meta: entry.status || undefined,
  };
};

const mapDocumentEntry = (entry: any, flagMap: Record<string, string>): ActivityFeedItem => {
  const countryLabel = entry.country || 'Réseau UDC';
  const action = entry.document_type === 'guide' ? 'a partagé un guide' : 'a partagé un document';
  return {
    id: `document-${entry.id}`,
    type: 'document',
    country: countryLabel,
    flag: resolveFlagFromLabel(countryLabel, flagMap),
    action,
    title: entry.title,
    timestamp: entry.updated_at || entry.created_at || new Date().toISOString(),
    meta: entry.document_type,
  };
};

const mapEventEntry = (entry: any, flagMap: Record<string, string>): ActivityFeedItem => {
  const countryLabel = entry.location || 'Réseau UDC';
  return {
    id: `event-${entry.id}`,
    type: 'event',
    country: countryLabel,
    flag: resolveFlagFromLabel(countryLabel, flagMap),
    action: entry.is_virtual ? 'organise un webinaire' : 'organise un événement',
    title: entry.title,
    timestamp: entry.start_date || entry.created_at || new Date().toISOString(),
    meta: entry.location || (entry.is_virtual ? 'virtuel' : 'présentiel'),
  };
};

const mapDiscussionEntry = (entry: any, flagMap: Record<string, string>): ActivityFeedItem => {
  const countryLabel = entry.forum_categories?.name || 'Réseau UDC';
  const replies = entry.reply_count ?? 0;
  return {
    id: `discussion-${entry.id}`,
    type: 'discussion',
    country: countryLabel,
    flag: resolveFlagFromLabel(countryLabel, flagMap),
    action: 'a lancé une discussion',
    title: entry.title,
    timestamp: entry.updated_at || entry.created_at || new Date().toISOString(),
    meta: replies ? `${replies} réponse${replies > 1 ? 's' : ''}` : '0 réponse',
  };
};

const sortActivities = (items: ActivityFeedItem[]) => {
  return [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const fetchActivityFeed = async (maxItems = 5): Promise<ActivityFeedItem[]> => {
  const flagMap = await buildCountryFlagMap();

  const [projectsRes, documentsRes, eventsRes, discussionsRes] = await Promise.all([
    supabase
      .from('agency_projects')
      .select('id,title,status,updated_at,created_at,agencies (country)')
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase
      .from('documents')
      .select('id,title,document_type,updated_at,created_at,country')
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase
      .from('events')
      .select('id,title,start_date,end_date,location,is_virtual,created_at')
      .order('start_date', { ascending: false })
      .limit(6),
    supabase
      .from('forum_posts')
      .select('id,title,reply_count,updated_at,created_at,forum_categories (name)')
      .order('updated_at', { ascending: false })
      .limit(6),
  ]);

  const error = projectsRes.error || documentsRes.error || eventsRes.error || discussionsRes.error;
  if (error) {
    logger.error('Activity feed query failed', error);
    throw error;
  }

  const feedItems: ActivityFeedItem[] = [];
  (projectsRes.data || []).forEach((entry) => feedItems.push(mapProjectEntry(entry, flagMap)));
  (documentsRes.data || []).forEach((entry) => feedItems.push(mapDocumentEntry(entry, flagMap)));
  (eventsRes.data || []).forEach((entry) => feedItems.push(mapEventEntry(entry, flagMap)));
  (discussionsRes.data || []).forEach((entry) => feedItems.push(mapDiscussionEntry(entry, flagMap)));

  return sortActivities(feedItems).slice(0, maxItems);
};
