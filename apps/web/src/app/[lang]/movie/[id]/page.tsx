import { detailMetadata, renderDetail } from '@/components/pages/detailRoutes';

export const revalidate = 3600;

// Rendered on first request, then cached and revalidated like the data it shows.
export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<'/[lang]/movie/[id]'>) {
  return detailMetadata('movie', params);
}

export default function Page({ params }: PageProps<'/[lang]/movie/[id]'>) {
  return renderDetail('movie', params);
}
