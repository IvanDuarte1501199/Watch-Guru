import { NavLink } from "react-router-dom";

type HeaderProps = {
  width?: number;
  height?: number;
  color?: "white" | "black";
};

const LINKS = [
  { name: "TV Shows", href: "/tv-shows" },
  { name: "Movies", href: "/movies" },
];

export function Header({ }: HeaderProps): JSX.Element {
  return (
    <header className="fixed top-0 left-0 w-full bg-primary z-50 shadow-md">
      <div className="container m-auto mx-auto flex max-w-screen-xl items-center justify-between p-4 px-4 lg:px-0">
        <NavLink
          to="/"
          className="nav-link-guru hover:underline transition duration-200 ease-in-out"
        >
          <img src="/logo.png" alt="Watch Guru Logo" className="w-10 h-10" />
        </NavLink>
        <nav className="flex items-center gap-12">
          {LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `nav-link-guru hover:underline transition duration-200 ease-in-out ${isActive ? "font-bold" : ""
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}