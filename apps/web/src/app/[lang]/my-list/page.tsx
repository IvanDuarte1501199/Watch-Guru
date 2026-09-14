import { MyLibrary } from '@/components/library/MyLibrary';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/my-list'>) {
  return privatePageMetadata(params, 'myList');
}

export default function MyListPage() {
  return <MyLibrary />;
}
