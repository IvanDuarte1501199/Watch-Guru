import { Suspense } from 'react';
import { ForgotPasswordForm } from '@/components/auth/PasswordRecovery';
import { privatePageMetadata } from '@/components/pages/privatePage';

export function generateMetadata({ params }: PageProps<'/[lang]/forgot-password'>) {
  return privatePageMetadata(params, 'forgotTitle');
}

export default function Page() {
  return (
    <div className="flex min-h-[70vh] items-center py-10">
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
