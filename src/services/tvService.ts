import { TimeWindow } from '@types/service/imdb'
import tmdbApi from './tmdbApi'

export const getTrendingTv = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/tv/${time}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular tv shows:', error)
    throw error
  }
}

export const getTvById = async (id: String) => {
  try {
    const response = await tmdbApi.get(`/tv/${id}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching tv shows by id:', error)
    throw error
  }
}

export const searchTv = async (query: string) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: { query },
    })
    return response.data.results
  } catch (error) {
    console.error('Error searching tv shows:', error)
    throw error
  }
}
