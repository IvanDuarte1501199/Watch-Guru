import { AccountPanel } from '@/components/account/AccountPanel';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/account'>) {
  return privatePageMetadata(params, 'account');
}

export default function AccountPage() {
  return <AccountPanel />;
}
