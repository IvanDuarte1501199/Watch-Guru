import { Footer } from '@components/common/Footer'
import { Header } from '@components/common/Header'

interface LayoutProps {
  children: React.ReactNode
  showHeader?: boolean
}

export function Layout({
  children,
  showHeader = true,
}: LayoutProps): JSX.Element {
  return (
    <>
      {showHeader && <Header />}
      <div className="container mx-auto px-4 md:px-0">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  )
}
