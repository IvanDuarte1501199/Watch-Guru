import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/PasswordRecovery';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/reset-password'>) {
  return privatePageMetadata(params, 'resetTitle');
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center py-10">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
