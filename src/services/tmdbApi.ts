import axios from 'axios';

const API_KEY = 'd00eee98241f72c5cf8fa9bb5c648e05';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export default tmdbApi;