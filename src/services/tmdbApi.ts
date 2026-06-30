import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

// Read saved language from localStorage (defaults to 'en')
const savedLanguage = localStorage.getItem('language') || 'en';
const tmdbLanguage = savedLanguage === 'es' ? 'es-ES' : 'en-US';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: tmdbLanguage,
  },
});

export const setApiLanguage = (lang: 'en' | 'es') => {
  tmdbApi.defaults.params.language = lang === 'es' ? 'es-ES' : 'en-US';
};

export default tmdbApi;
