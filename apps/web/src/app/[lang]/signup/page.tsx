import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/signup'>) {
  return privatePageMetadata(params, 'signupTitle');
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center py-10">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
