import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import type { SupportedLanguage } from '@/i18n/languages';

export interface ContentBlock {
  id: string;
  block_key: string;
  content: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
  updated_at: string;
}

const LANG_COLUMN_MAP: Record<SupportedLanguage, string> = {
  fr: 'content_fr',
  en: 'content_en',
  ar: 'content_ar',
  pt: 'content_pt',
};

export function useHomepageContent() {
  const { currentLanguage } = useTranslation();

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['homepage-content-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content_blocks' as any)
        .select('*')
        .order('sort_order');
      if (error) {
        // Table doesn't exist or query failed — gracefully return empty
        console.warn('Homepage content blocks not available, using i18n fallback');
        return [];
      }
      return (data || []) as any[];
    },
    staleTime: 10 * 60 * 1000, // 10 min
    retry: false, // Don't retry if table doesn't exist
  });

  const getBlock = (key: string): Record<string, unknown> | null => {
    const block = blocks.find((b: any) => b.block_key === key && b.is_visible);
    if (!block) return null;
    const col = LANG_COLUMN_MAP[currentLanguage] || 'content_fr';
    const content = block[col] || block.content_fr;
    return content as Record<string, unknown>;
  };

  const getBlockRaw = (key: string) => {
    return blocks.find((b: any) => b.block_key === key) || null;
  };

  return { blocks, isLoading, getBlock, getBlockRaw, currentLanguage };
}

export function useHomepageContentAdmin() {
  const queryClient = useQueryClient();

  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['homepage-content-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_content_blocks' as any)
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const updateBlock = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase
        .from('homepage_content_blocks' as any)
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-content-blocks'] });
    },
  });

  return { blocks, isLoading, updateBlock };
}
