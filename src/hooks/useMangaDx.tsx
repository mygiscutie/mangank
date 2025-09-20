import { useQuery } from '@tanstack/react-query';
import { MangaDxService, MangaDxManga } from '@/services/mangadx';

// Popular manga IDs from MangaDx for initial load
const POPULAR_MANGA_IDS = [
  '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0', // Solo Leveling
  '304ceac3-8cdb-4fe7-acf7-2b6ff7a60613', // Tower of God  
  'b0b721ff-c388-4486-aa0f-c2b0bb321512', // Attack on Titan
  '58bc83a0-1808-484e-88b9-17e167469e23', // One Piece
  '0aea9f43-d85a-40e7-b1f3-7f3d21a4d706', // Demon Slayer
  '37f5cce0-8070-4ada-96e5-fa24b1bd4ff9', // My Hero Academia
  'a1c7c817-4e59-43b7-9365-09675a149a6f', // Jujutsu Kaisen
  'd1a9fdeb-f713-407f-960c-8326b586e6fd', // Chainsaw Man
];

interface TransformedManga {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  artist: string;
  status: string;
  coverImageUrl: string;
  rating: number;
  viewCount: number;
  genres: string[];
  createdAt: string;
  updatedAt: string;
}

interface TransformedChapter {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title: string | null;
  pagesCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  contentUrl: string;
}

export const usePopularManga = () => {
  return useQuery({
    queryKey: ['manga', 'popular'],
    queryFn: async (): Promise<TransformedManga[]> => {
      const response = await MangaDxService.getMangaByIds(POPULAR_MANGA_IDS);
      
      const transformedManga = await Promise.all(
        response.data.map(async (manga: MangaDxManga): Promise<TransformedManga> => {
          const coverArt = MangaDxService.getCoverArt(manga);
          const coverImageUrl = coverArt 
            ? await MangaDxService.getCoverUrl(coverArt, manga.id, 'medium')
            : '/placeholder.svg';
          
          return {
            id: manga.id,
            title: MangaDxService.getTitle(manga),
            slug: MangaDxService.createSlug(manga),
            description: MangaDxService.getDescription(manga),
            author: MangaDxService.getAuthor(manga),
            artist: MangaDxService.getArtist(manga),
            status: manga.attributes.status,
            coverImageUrl,
            rating: Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
            viewCount: Math.floor(Math.random() * 100000) + 10000, // Mock view count
            genres: MangaDxService.getGenres(manga),
            createdAt: manga.attributes.createdAt,
            updatedAt: manga.attributes.updatedAt
          };
        })
      );
      
      return transformedManga;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useMangaSearch = (query: string) => {
  return useQuery({
    queryKey: ['manga', 'search', query],
    queryFn: async (): Promise<TransformedManga[]> => {
      if (!query.trim()) return [];
      
      const response = await MangaDxService.searchManga(query, 20);
      
      const transformedManga = await Promise.all(
        response.data.map(async (manga: MangaDxManga): Promise<TransformedManga> => {
          const coverArt = MangaDxService.getCoverArt(manga);
          const coverImageUrl = coverArt 
            ? await MangaDxService.getCoverUrl(coverArt, manga.id, 'medium')
            : '/placeholder.svg';
          
          return {
            id: manga.id,
            title: MangaDxService.getTitle(manga),
            slug: MangaDxService.createSlug(manga),
            description: MangaDxService.getDescription(manga),
            author: MangaDxService.getAuthor(manga),
            artist: MangaDxService.getArtist(manga),
            status: manga.attributes.status,
            coverImageUrl,
            rating: Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
            viewCount: Math.floor(Math.random() * 100000) + 10000, // Mock view count
            genres: MangaDxService.getGenres(manga),
            createdAt: manga.attributes.createdAt,
            updatedAt: manga.attributes.updatedAt
          };
        })
      );
      
      return transformedManga;
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useMangaBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['manga', 'slug', slug],
    queryFn: async (): Promise<TransformedManga | null> => {
      // For now, search by title since we don't have a slug-to-ID mapping
      const searchQuery = slug.replace(/-/g, ' ');
      const response = await MangaDxService.searchManga(searchQuery, 1);
      
      if (response.data.length === 0) return null;
      
      const manga = response.data[0];
      const coverArt = MangaDxService.getCoverArt(manga);
      const coverImageUrl = coverArt 
        ? await MangaDxService.getCoverUrl(coverArt, manga.id, 'medium')
        : '/placeholder.svg';
      
      return {
        id: manga.id,
        title: MangaDxService.getTitle(manga),
        slug: MangaDxService.createSlug(manga),
        description: MangaDxService.getDescription(manga),
        author: MangaDxService.getAuthor(manga),
        artist: MangaDxService.getArtist(manga),
        status: manga.attributes.status,
        coverImageUrl,
        rating: Math.floor(Math.random() * 2) + 4, // Mock rating 4-5
        viewCount: Math.floor(Math.random() * 100000) + 10000, // Mock view count
        genres: MangaDxService.getGenres(manga),
        createdAt: manga.attributes.createdAt,
        updatedAt: manga.attributes.updatedAt
      };
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useChaptersByManga = (mangaId: string) => {
  return useQuery({
    queryKey: ['chapters', mangaId],
    queryFn: async (): Promise<TransformedChapter[]> => {
      const response = await MangaDxService.getChapters(mangaId, 100);
      
      return response.data.map((chapter): TransformedChapter => ({
        id: chapter.id,
        mangaId,
        chapterNumber: parseFloat(chapter.attributes.chapter) || 0,
        title: chapter.attributes.title,
        pagesCount: chapter.attributes.pages,
        publishedAt: chapter.attributes.publishAt,
        createdAt: chapter.attributes.createdAt,
        updatedAt: chapter.attributes.updatedAt,
        contentUrl: `/api/chapter/${chapter.id}` // We'll handle this in the reader
      }));
    },
    enabled: !!mangaId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useChapter = (mangaSlug: string, chapterNumber: number) => {
  return useQuery({
    queryKey: ['chapter', mangaSlug, chapterNumber],
    queryFn: async () => {
      // First get manga by slug
      const searchQuery = mangaSlug.replace(/-/g, ' ');
      const mangaResponse = await MangaDxService.searchManga(searchQuery, 1);
      
      if (mangaResponse.data.length === 0) {
        throw new Error('Manga not found');
      }
      
      const manga = mangaResponse.data[0];
      
      // Get chapters for this manga
      const chaptersResponse = await MangaDxService.getChapters(manga.id, 500);
      
      // Find the specific chapter
      const chapter = chaptersResponse.data.find(
        ch => parseFloat(ch.attributes.chapter) === chapterNumber
      );
      
      if (!chapter) {
        throw new Error('Chapter not found');
      }
      
      const coverArt = MangaDxService.getCoverArt(manga);
      const coverImageUrl = coverArt 
        ? await MangaDxService.getCoverUrl(coverArt, manga.id, 'medium')
        : '/placeholder.svg';
      
      return {
        chapter: {
          id: chapter.id,
          mangaId: manga.id,
          chapterNumber: parseFloat(chapter.attributes.chapter),
          title: chapter.attributes.title,
          pagesCount: chapter.attributes.pages,
          publishedAt: chapter.attributes.publishAt,
          createdAt: chapter.attributes.createdAt,
          updatedAt: chapter.attributes.updatedAt,
          contentUrl: `/api/chapter/${chapter.id}`
        },
        manga: {
          id: manga.id,
          title: MangaDxService.getTitle(manga),
          slug: MangaDxService.createSlug(manga),
          description: MangaDxService.getDescription(manga),
          author: MangaDxService.getAuthor(manga),
          artist: MangaDxService.getArtist(manga),
          status: manga.attributes.status,
          coverImageUrl,
          rating: Math.floor(Math.random() * 2) + 4,
          viewCount: Math.floor(Math.random() * 100000) + 10000,
          genres: MangaDxService.getGenres(manga),
          createdAt: manga.attributes.createdAt,
          updatedAt: manga.attributes.updatedAt
        }
      };
    },
    enabled: !!mangaSlug && !!chapterNumber,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useChapterPages = (chapterId: string) => {
  return useQuery({
    queryKey: ['chapter-pages', chapterId],
    queryFn: async (): Promise<string[]> => {
      const atHomeResponse = await MangaDxService.getAtHome(chapterId);
      
      // Construct image URLs
      const pages = atHomeResponse.chapter.data.map(filename => 
        `${atHomeResponse.baseUrl}/data/${atHomeResponse.chapter.hash}/${filename}`
      );
      
      return pages;
    },
    enabled: !!chapterId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

// Legacy exports for compatibility
export const useManga = usePopularManga;