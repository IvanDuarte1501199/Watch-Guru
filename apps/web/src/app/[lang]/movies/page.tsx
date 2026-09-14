import { hubMetadata, renderHub } from '@/components/pages/listRoutes';

export const revalidate = 3600;

export function generateMetadata({ params }: PageProps<'/[lang]/movies'>) {
  return hubMetadata('movie', params);
}

export default function Page({ params }: PageProps<'/[lang]/movies'>) {
  return renderHub('movie', params);
}
