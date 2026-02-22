import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'forum' | 'project';
  url: string;
}

export interface GroupedResults {
  documents: SearchResult[];
  forum: SearchResult[];
  projects: SearchResult[];
}

export interface SearchFilters {
  types: ('document' | 'forum' | 'project')[];
  country?: string;
  documentType?: string;
}

const DEFAULT_FILTERS: SearchFilters = {
  types: ['document', 'forum', 'project'],
};

export const useUnifiedSearch = (query: string, filters: SearchFilters = DEFAULT_FILTERS) => {
  const [results, setResults] = useState<GroupedResults>({ documents: [], forum: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults({ documents: [], forum: [], projects: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const id = ++abortRef.current;

    const timer = setTimeout(async () => {
      try {
        const pattern = `%${trimmed}%`;

        const docsPromise = filters.types.includes('document')
          ? (() => {
              let q = supabase
                .from('documents')
                .select('id, title, description')
                .eq('is_public', true)
                .or(`title.ilike.${pattern},description.ilike.${pattern}`);
              if (filters.country) q = q.eq('country', filters.country);
              if (filters.documentType) q = q.eq('document_type', filters.documentType as any);
              return q.limit(5);
            })()
          : Promise.resolve({ data: [] as any[] });

        const forumPromise = filters.types.includes('forum')
          ? supabase
              .from('forum_posts')
              .select('id, title, content')
              .or(`title.ilike.${pattern},content.ilike.${pattern}`)
              .limit(5)
          : Promise.resolve({ data: [] as any[] });

        const projectsPromise = filters.types.includes('project')
          ? (() => {
              let q = supabase
                .from('agency_projects')
                .select('id, title, description, location')
                .or(`title.ilike.${pattern},description.ilike.${pattern}`);
              if (filters.country) q = q.eq('location', filters.country);
              return q.limit(5);
            })()
          : Promise.resolve({ data: [] as any[] });

        const [docsRes, forumRes, projectsRes] = await Promise.all([docsPromise, forumPromise, projectsPromise]);

        if (id !== abortRef.current) return;

        const documents: SearchResult[] = (docsRes.data || []).map(d => ({
          id: d.id,
          title: d.title,
          description: d.description || '',
          type: 'document' as const,
          url: '/resources',
        }));

        const forum: SearchResult[] = (forumRes.data || []).map(f => ({
          id: f.id,
          title: f.title,
          description: (f.content || '').slice(0, 100),
          type: 'forum' as const,
          url: '/forum',
        }));

        const projects: SearchResult[] = (projectsRes.data || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || p.location || '',
          type: 'project' as const,
          url: '/projects',
        }));

        setResults({ documents, forum, projects });
      } catch {
        // silently fail
      } finally {
        if (id === abortRef.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, filters]);

  const hasResults = results.documents.length > 0 || results.forum.length > 0 || results.projects.length > 0;

  return { results, loading, hasResults };
};
