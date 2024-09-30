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
      <div className="m-auto max-w-screen-xl px-4 lg:px-12">
        {showHeader && <Header />}
        <main>{children}</main>
        <Footer />
      </div>
    </>
  )
}
