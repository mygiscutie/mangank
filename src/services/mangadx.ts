const MANGADX_BASE_URL = 'https://api.mangadx.org';

export interface MangaDxManga {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    altTitles: Array<Record<string, string>>;
    description: Record<string, string>;
    isLocked: boolean;
    links: Record<string, string>;
    originalLanguage: string;
    lastVolume: string | null;
    lastChapter: string | null;
    publicationDemographic: string | null;
    status: string;
    year: number | null;
    contentRating: string;
    tags: Array<{
      id: string;
      type: string;
      attributes: {
        name: Record<string, string>;
        description: Record<string, string>;
        group: string;
        version: number;
      };
    }>;
    state: string;
    chapterNumbersResetOnNewVolume: boolean;
    createdAt: string;
    updatedAt: string;
    version: number;
    availableTranslatedLanguages: string[];
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: any;
  }>;
}

export interface MangaDxChapter {
  id: string;
  type: string;
  attributes: {
    volume: string | null;
    chapter: string;
    title: string | null;
    translatedLanguage: string;
    externalUrl: string | null;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    pages: number;
    version: number;
  };
  relationships: Array<{
    id: string;
    type: string;
  }>;
}

export interface MangaDxAtHome {
  result: string;
  baseUrl: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

export class MangaDxService {
  private static async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, MANGADX_BASE_URL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`MangaDx API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  static async searchManga(title: string, limit = 20): Promise<{ data: MangaDxManga[] }> {
    return this.request('/manga', {
      title,
      limit,
      'includes[]': ['cover_art', 'author', 'artist'],
      'contentRating[]': ['safe', 'suggestive', 'erotica'],
      'order[relevance]': 'desc'
    });
  }

  static async getManga(id: string): Promise<{ data: MangaDxManga }> {
    return this.request(`/manga/${id}`, {
      'includes[]': ['cover_art', 'author', 'artist']
    });
  }

  static async getMangaByIds(ids: string[]): Promise<{ data: MangaDxManga[] }> {
    return this.request('/manga', {
      'ids[]': ids,
      'includes[]': ['cover_art', 'author', 'artist'],
      limit: ids.length
    });
  }

  static async getChapters(mangaId: string, limit = 100, offset = 0): Promise<{ data: MangaDxChapter[] }> {
    return this.request('/chapter', {
      manga: mangaId,
      'translatedLanguage[]': 'en',
      'order[chapter]': 'asc',
      limit,
      offset
    });
  }

  static async getChapter(chapterId: string): Promise<{ data: MangaDxChapter }> {
    return this.request(`/chapter/${chapterId}`);
  }

  static async getAtHome(chapterId: string): Promise<MangaDxAtHome> {
    return this.request(`/at-home/server/${chapterId}`);
  }

  static async getCoverUrl(coverId: string, mangaId: string, size: 'small' | 'medium' | 'large' = 'medium'): Promise<string> {
    // MangaDx cover URLs follow this pattern
    const sizeMap = {
      small: '256.jpg',
      medium: '512.jpg', 
      large: '.jpg'
    };
    return `https://uploads.mangadx.org/covers/${mangaId}/${coverId}${sizeMap[size]}`;
  }

  static getTitle(manga: MangaDxManga, language = 'en'): string {
    return manga.attributes.title[language] || 
           manga.attributes.title['en'] || 
           Object.values(manga.attributes.title)[0] || 
           'Unknown Title';
  }

  static getDescription(manga: MangaDxManga, language = 'en'): string {
    return manga.attributes.description[language] || 
           manga.attributes.description['en'] || 
           Object.values(manga.attributes.description)[0] || 
           'No description available';
  }

  static getAuthor(manga: MangaDxManga): string {
    const author = manga.relationships.find(rel => rel.type === 'author');
    return author?.attributes?.name || 'Unknown Author';
  }

  static getArtist(manga: MangaDxManga): string {
    const artist = manga.relationships.find(rel => rel.type === 'artist');
    return artist?.attributes?.name || 'Unknown Artist';
  }

  static getCoverArt(manga: MangaDxManga): string | null {
    const cover = manga.relationships.find(rel => rel.type === 'cover_art');
    return cover?.attributes?.fileName || null;
  }

  static getGenres(manga: MangaDxManga): string[] {
    return manga.attributes.tags
      .filter(tag => tag.attributes.group === 'genre')
      .map(tag => tag.attributes.name.en || Object.values(tag.attributes.name)[0])
      .filter(Boolean);
  }

  static createSlug(manga: MangaDxManga): string {
    const title = this.getTitle(manga);
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}