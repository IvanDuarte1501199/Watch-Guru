import { LegalPage, legalMetadata } from '@/components/pages/LegalPage';

export function generateMetadata({ params }: PageProps<'/[lang]/terms'>) {
  return legalMetadata(params, 'terms');
}

export default function TermsPage({ params }: PageProps<'/[lang]/terms'>) {
  return <LegalPage params={params} kind="terms" />;
}
