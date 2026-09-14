import { genreMetadata, renderGenre } from '@/components/pages/listRoutes';

export function generateMetadata({ params }: PageProps<'/[lang]/movies/genre/[id]'>) {
  return genreMetadata('movie', params);
}

export default function Page({ params, searchParams }: PageProps<'/[lang]/movies/genre/[id]'>) {
  return renderGenre('movie', params, searchParams);
}
