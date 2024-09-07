type HeaderProps = {
  width?: number
  height?: number
  color?: 'white' | 'black'
}

export function Header({}: HeaderProps): JSX.Element {
  return (
    <header className="grid relative place-items-center place-content-center">
      <div className="w-screen bg-medium-purple pt-4 pb-4">
        <span className="container mx-auto p-4 max-w-screen-xl px-4 m-auto lg:px-12 flex items-center justify-between">
          <img src="src/assets/react.svg" alt="" />
          <p className="text-soft-cloud">
            developed by <span className="font-bold">Ivan Duarte</span>
          </p>
        </span>
      </div>
    </header>
  )
}
