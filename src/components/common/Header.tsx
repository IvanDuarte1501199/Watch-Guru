import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

type HeaderProps = {
    width?: number;
    height?: number;
    color?: 'white' | 'black';
};

const LINKS = [
    { name: 'TV Shows', href: '/tv-shows' },
    { name: 'Movies', href: '/movies' },
];

export function Header({}: HeaderProps): JSX.Element {
    const [isOpaque, setIsOpaque] = useState(false);

    const handleScroll = () => {
        const scrollY = window.scrollY;
        setIsOpaque(scrollY > 50);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 shadow-md transition-opacity duration-300 ${isOpaque ? 'bg-tertiary-80 backdrop-blur-md' : 'bg-tertiary'}`}
        >
            <div className="flex items-center justify-between max-w-7xl mx-auto py-4 px-4 md:px-8 lg:px-12">
                <NavLink
                    to="/"
                    className="nav-link-guru hover:underline transition duration-200 ease-in-out"
                >
                    <img
                        src="/logo.png"
                        alt="Watch Guru Logo"
                        className="w-10 h-10"
                    />
                </NavLink>
                <nav className="flex items-center gap-12">
                    {LINKS.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) =>
                                `nav-link-guru hover:underline transition duration-200 ease-in-out ${isActive ? 'font-bold underline' : ''}`
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
