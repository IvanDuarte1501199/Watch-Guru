import { categoryMetadata, renderCategory } from '@/components/pages/listRoutes';

export function generateMetadata({ params }: PageProps<'/[lang]/tv-shows/[category]'>) {
  return categoryMetadata('tv', params);
}

export default function Page({ params, searchParams }: PageProps<'/[lang]/tv-shows/[category]'>) {
  return renderCategory('tv', params, searchParams);
}
