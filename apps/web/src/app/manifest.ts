import type { MetadataRoute } from 'next';

/** Lets phones install WatchGuru to the home screen (handy for Match nights). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WatchGuru',
    short_name: 'WatchGuru',
    description: 'Qué ver hoy: recomendaciones, dónde verlo y Match con amigos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08042c',
    theme_color: '#08042c',
    icons: [{ src: '/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
