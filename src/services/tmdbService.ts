import { TimeWindow } from '@types/service/imdb'
import tmdbApi from './tmdbApi'

export const getTrendingAll = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/all/${time}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular data:', error)
    throw error
  }
}
