import { genreMetadata, renderGenre } from '@/components/pages/listRoutes';

export function generateMetadata({ params }: PageProps<'/[lang]/tv-shows/genre/[id]'>) {
  return genreMetadata('tv', params);
}

export default function Page({ params, searchParams }: PageProps<'/[lang]/tv-shows/genre/[id]'>) {
  return renderGenre('tv', params, searchParams);
}
