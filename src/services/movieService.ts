import { TimeWindow } from '@types/service/imdb'
import tmdbApi from './tmdbApi'

export const getTrendingMovies = async (time: TimeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${time}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching popular movies:', error)
    throw error
  }
}

export const getMovieById = async (id: String) => {
  try {
    const response = await tmdbApi.get(`/movie/${id}`)
    return response.data.results
  } catch (error) {
    console.error('Error fetching movie by id:', error)
    throw error
  }
}
