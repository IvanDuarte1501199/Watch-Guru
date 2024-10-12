type FooterProps = {};

export function Footer({ }: FooterProps): JSX.Element {
  return (
    <footer className="w-full bg-tertiary py-6">
      <div className="m-auto text-center">
        <p className="p-guru">
          &copy; {new Date().getFullYear()} Watch Guru. All Rights Reserved.
        </p>
        <p className="p-guru">
          Developed by <span className="font-bold">Ivan Duarte</span>
        </p>
      </div>
    </footer>
  );
}