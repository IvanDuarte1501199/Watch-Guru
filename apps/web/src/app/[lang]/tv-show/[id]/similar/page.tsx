import { renderSimilar, similarMetadata } from '@/components/pages/similarRoutes';

export const revalidate = 86400;

// Rendered on first request, then cached.
export function generateStaticParams() {
  return [];
}

export function generateMetadata({ params }: PageProps<'/[lang]/tv-show/[id]/similar'>) {
  return similarMetadata('tv', params);
}

export default function Page({ params }: PageProps<'/[lang]/tv-show/[id]/similar'>) {
  return renderSimilar('tv', params);
}
