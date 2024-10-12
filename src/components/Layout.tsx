import { Footer } from '@components/common/Footer';
import { Header } from '@components/common/Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export function Layout({
  children,
  showHeader = true,
}: LayoutProps): JSX.Element {
  return (
    <>
      {showHeader && <Header />}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex-1">
        <main className="h-full">{children}</main>
      </div>
      <Footer />
    </>
  );
}
