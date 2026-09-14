import { LegalPage, legalMetadata } from '@/components/pages/LegalPage';

export function generateMetadata({ params }: PageProps<'/[lang]/privacy'>) {
  return legalMetadata(params, 'privacy');
}

export default function PrivacyPage({ params }: PageProps<'/[lang]/privacy'>) {
  return <LegalPage params={params} kind="privacy" />;
}
