type HeaderProps = {
  width?: number
  height?: number
  color?: 'white' | 'black'
}

export function Header({}: HeaderProps): JSX.Element {
  return (
    <header className="relative grid place-content-center place-items-center">
      <div className="w-screen bg-medium-purple pb-4 pt-4">
        <span className="container m-auto mx-auto flex max-w-screen-xl items-center justify-between p-4 px-4 lg:px-12">
          <img src="src/assets/react.svg" alt="" />
          <p className="text-soft-cloud">
            developed by <span className="font-bold">Ivan Duarte</span>
          </p>
        </span>
      </div>
    </header>
  )
}
