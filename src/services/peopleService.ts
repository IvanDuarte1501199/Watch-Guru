import { TimeWindow } from '@types/service/imdb'
import tmdbApi from './tmdbApi'

export const getTrendingPeople = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/person/${time}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular people:', error)
    throw error
  }
}
