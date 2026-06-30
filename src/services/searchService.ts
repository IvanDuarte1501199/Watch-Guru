import tmdbApi from '@services/tmdbApi';
import { MediaType } from '@appTypes/common/MediaType';

export const searchByType = async (query: string, type?: MediaType, page: number = 1) => {
  try {
    const savedLanguage = localStorage.getItem('language') || 'en';
    const tmdbLanguage = savedLanguage === 'es' ? 'es-ES' : 'en-US';
    const response = await tmdbApi.get(`/search/${type ?? 'multi'}`, {
      params: {
        query,
        page,
        language: tmdbLanguage,
      },
    });
    const resultsWithMediaType = response.data.results.map((item: any) => {
      if (!item.media_type && type) {
        return {
          ...item,
          media_type: type,
        };
      }
      return item;
    });

    return {
      ...response.data,
      results: resultsWithMediaType,
    };
  } catch (error) {
    console.error(`Error searching ${type}:`, error);
    throw error;
  }
};
