import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface LearningCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  durationMinutes: number;
  modules: number;
  progress: number;
  enrolled: number;
  updatedAt: string;
  country: string;
}

export interface LearningWebinar {
  id: string;
  startTimestamp: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  presenter: string;
  presenterCountry: string;
  presenterFlag: string;
  attendees: number;
  isUpcoming: boolean;
  isLive: boolean;
  virtualLink?: string | null;
}

const flagFromLabel = (label?: string | null) => {
  const cleaned = ((label || 'AF').toUpperCase().replace(/[^A-Z]/g, ''))
    .padEnd(2, 'A')
    .slice(0, 2);
  const points = [...cleaned].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...points);
};

export const formatMinutesToLabel = (minutes: number) => {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m ? ` ${m}m` : ''}`;
  }
  return `${minutes} min`;
};

const computeLevelFromTags = (tags?: string[]) => {
  if (!tags || tags.length === 0) return 'Intermédiaire';
  const normalized = tags.map(tag => tag.toLowerCase());
  if (normalized.some(tag => tag.includes('avancé') || tag.includes('expert'))) return 'Avancé';
  if (normalized.some(tag => tag.includes('débutant') || tag.includes('introduction'))) return 'Débutant';
  return 'Intermédiaire';
};

const mapDocumentToCourse = (doc: any): LearningCourse => {
  const sizeMinutes = Math.max(30, Math.min(150, Math.round((doc.file_size ?? 0) / 250000) + 30));
  const modules = Math.max(4, Math.round((doc.download_count ?? 0) / 10) || 4);
  const enrolled = doc.view_count ?? doc.download_count ?? 0;
  const progress = Math.min(100, Math.round((doc.download_count ?? 0) / 2));
  const level = computeLevelFromTags(doc.tags || []);
  const category = doc.document_type ? doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1) : 'Ressource';

  return {
    id: doc.id,
    title: doc.title,
    description: doc.description ?? 'Contenu disponible prochainement',
    category,
    level,
    durationMinutes: sizeMinutes,
    modules,
    progress,
    enrolled,
    updatedAt: doc.updated_at,
    country: doc.country ?? 'Afrique',
  };
};

const mapEventToWebinar = (event: any): LearningWebinar => {
  const start = new Date(event.start_date ?? Date.now());
  const end = new Date(event.end_date ?? start.getTime() + 60 * 60 * 1000);
  const diff = end.getTime() - start.getTime();
  const rawMinutes = Number.isFinite(diff) && diff > 0 ? Math.round(diff / 60000) : 60;
  const durationMinutes = Math.max(30, rawMinutes);
  const now = Date.now();
  const isLive = start.getTime() <= now && end.getTime() >= now;
  const isUpcoming = start.getTime() > now;
  const presenterCountry = event.location || 'Réseau UDC';
  const presenterFlag = flagFromLabel(presenterCountry);
  const presenter = `${presenterCountry} · Présenté par UDC`;

  const time = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const date = start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return {
    id: event.id,
    startTimestamp: event.start_date ?? new Date().toISOString(),
    title: event.title,
    description: event.description ?? 'Session collaborative du réseau UDC',
    date,
    time,
    duration: formatMinutesToLabel(durationMinutes),
    presenter,
    presenterCountry,
    presenterFlag,
    attendees: event.current_attendees ?? 0,
    isUpcoming,
    isLive,
    virtualLink: event.virtual_link,
  };
};

export const fetchLearningCourses = async (limit = 8): Promise<LearningCourse[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('id,title,description,document_type,download_count,view_count,country,file_size,updated_at,tags,is_public')
    .eq('is_public', true)
    .in('document_type', ['guide', 'presentation', 'rapport'])
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Failed to load learning documents', error);
    throw error;
  }

  return (data || []).map(mapDocumentToCourse);
};

export const fetchLearningWebinars = async (limit = 12): Promise<LearningWebinar[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('id,title,description,start_date,end_date,location,is_virtual,virtual_link,current_attendees')
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) {
    logger.error('Failed to load learning events', error);
    throw error;
  }

  return (data || []).map(mapEventToWebinar);
};
