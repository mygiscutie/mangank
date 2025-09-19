import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useManga = () => {
  return useQuery({
    queryKey: ['manga'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .order('view_count', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
};

export const useMangaBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['manga', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manga')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });
};

export const useChaptersByManga = (mangaId: string) => {
  return useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', mangaId)
        .order('chapter_number', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!mangaId
  });
};

export const useChapter = (mangaSlug: string, chapterNumber: number) => {
  return useQuery({
    queryKey: ['chapter', mangaSlug, chapterNumber],
    queryFn: async () => {
      // First get manga by slug
      const { data: manga, error: mangaError } = await supabase
        .from('manga')
        .select('*')
        .eq('slug', mangaSlug)
        .single();
      
      if (mangaError) throw mangaError;
      
      // Then get specific chapter
      const { data: chapter, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('manga_id', manga.id)
        .eq('chapter_number', chapterNumber)
        .single();
      
      if (chapterError) throw chapterError;
      
      return { chapter, manga };
    },
    enabled: !!mangaSlug && !!chapterNumber
  });
};