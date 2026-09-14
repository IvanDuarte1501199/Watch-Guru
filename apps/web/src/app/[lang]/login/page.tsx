import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/login'>) {
  return privatePageMetadata(params, 'loginTitle');
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center py-10">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}
