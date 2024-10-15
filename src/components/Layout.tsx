import { Footer } from '@components/common/Footer';
import { Header } from '@components/common/Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string
}

export function Layout({
  children,
  showHeader = true,
  className = ''
}: LayoutProps): JSX.Element {
  return (
    <>
      {showHeader && <Header />}
      <div className={`container mx-auto px-4 md:px-8 lg:px-12 flex-1 ${className}`}>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
