import tmdbApi from '@services/tmdbApi';
import { MediaType } from '@appTypes/common/MediaType';

export const searchByType = async (query: string, type?: MediaType, page: number = 1) => {
  try {
    const response = await tmdbApi.get(`/search/${type ?? 'multi'}`, {
      params: {
        query,
        page,
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
