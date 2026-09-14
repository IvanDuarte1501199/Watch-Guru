import { hubMetadata, renderHub } from '@/components/pages/listRoutes';

export const revalidate = 3600;

export function generateMetadata({ params }: PageProps<'/[lang]/tv-shows'>) {
  return hubMetadata('tv', params);
}

export default function Page({ params }: PageProps<'/[lang]/tv-shows'>) {
  return renderHub('tv', params);
}
