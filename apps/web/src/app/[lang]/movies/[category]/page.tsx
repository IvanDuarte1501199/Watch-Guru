import { categoryMetadata, renderCategory } from '@/components/pages/listRoutes';

export function generateMetadata({ params }: PageProps<'/[lang]/movies/[category]'>) {
  return categoryMetadata('movie', params);
}

export default function Page({ params, searchParams }: PageProps<'/[lang]/movies/[category]'>) {
  return renderCategory('movie', params, searchParams);
}
