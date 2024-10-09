import { TimeWindow } from '@types/service/imdb'
import tmdbApi from './tmdbApi'
import { TrendingResponse } from '@types/common/tmdbResponse'

export const getTrendingAll = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get<TrendingResponse>(`/trending/all/${time}`)
    console.log('response', response)
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular data:', error)
    throw error
  }
}
