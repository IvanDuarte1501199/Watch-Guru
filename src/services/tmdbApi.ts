import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
  console.log('API_KEY', API_KEY)
  console.log('BASE_URL', BASE_URL)
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
})

export default tmdbApi