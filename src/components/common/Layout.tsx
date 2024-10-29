import { MediaType } from '@appTypes/common/MediaType';
import { Footer } from '@components/common/Footer';
import { Header } from '@components/common/Header';
import BackgroudImg from '@components/shared/BackgroudImg';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  headerColor?: 'transparent' | 'primary' | 'secondary' | 'tertiary';
  className?: string
  showSearch?: boolean;
  searchType?: MediaType;
  backgroundSrc?: string;
}

export function Layout({
  children,
  showHeader = true,
  className = '',
  showSearch = true,
  searchType,
  backgroundSrc,
  headerColor
}: LayoutProps): JSX.Element {
  return (
    <>
      {backgroundSrc && <BackgroudImg src={backgroundSrc} />}
      {showHeader && <Header color={headerColor} searchType={searchType} showSearch={showSearch} />}
      <div className={`container mx-auto px-4 md:px-8 lg:px-12 flex-1 ${className}`}>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
