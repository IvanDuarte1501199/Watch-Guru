import { MediaType } from '@appTypes/common/MediaType';
import { Footer } from '@components/common/Footer';
import { Header } from '@components/common/Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string
  showSearch?: boolean;
  searchType?: MediaType;
}

export function Layout({
  children,
  showHeader = true,
  className = '',
  /* temporally show search by default */
  showSearch = true,
  searchType
}: LayoutProps): JSX.Element {
  return (
    <>
      {showHeader && <Header searchType={searchType} showSearch={showSearch} />}
      <div className={`container mx-auto px-4 md:px-8 lg:px-12 flex-1 ${className}`}>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
