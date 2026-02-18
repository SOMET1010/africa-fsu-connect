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

export const useUnifiedSearch = (query: string) => {
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

        const [docsRes, forumRes, projectsRes] = await Promise.all([
          supabase
            .from('documents')
            .select('id, title, description')
            .eq('is_public', true)
            .or(`title.ilike.${pattern},description.ilike.${pattern}`)
            .limit(5),
          supabase
            .from('forum_posts')
            .select('id, title, content')
            .or(`title.ilike.${pattern},content.ilike.${pattern}`)
            .limit(5),
          supabase
            .from('agency_projects')
            .select('id, title, description, location')
            .or(`title.ilike.${pattern},description.ilike.${pattern}`)
            .limit(5),
        ]);

        if (id !== abortRef.current) return; // stale

        const documents: SearchResult[] = (docsRes.data || []).map(d => ({
          id: d.id,
          title: d.title,
          description: d.description || '',
          type: 'document',
          url: '/resources',
        }));

        const forum: SearchResult[] = (forumRes.data || []).map(f => ({
          id: f.id,
          title: f.title,
          description: (f.content || '').slice(0, 100),
          type: 'forum',
          url: '/forum',
        }));

        const projects: SearchResult[] = (projectsRes.data || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description || p.location || '',
          type: 'project',
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
  }, [query]);

  const hasResults = results.documents.length > 0 || results.forum.length > 0 || results.projects.length > 0;

  return { results, loading, hasResults };
};
