import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Search from './Search';
import { MediaType } from '@appTypes/common/MediaType';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setLanguage } from '@slice/language/languageSlice';
import { translations } from '../../i18n/translations';

type HeaderProps = {
  showSearch?: boolean;
  searchType?: MediaType;
  color?: 'transparent' | 'primary' | 'secondary' | 'tertiary';
};

export function Header({ showSearch = false, searchType, color = 'transparent' }: HeaderProps): JSX.Element {
  const [isOpaque, setIsOpaque] = useState(false);
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  const LINKS = [
    { name: t.tvShows, href: '/tv-shows' },
    { name: t.movies, href: '/movies' },
  ];

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

  const handleLanguageChange = (lang: 'en' | 'es') => {
    if (lang !== currentLanguage) {
      dispatch(setLanguage(lang));
      window.location.reload();
    }
  };

  // Map color options to static classes so Tailwind compiles them correctly
  const headerBgClass = isOpaque 
    ? 'bg-slate-950/80 border-slate-800/50 backdrop-blur-lg shadow-lg' 
    : color === 'primary' 
      ? 'bg-primary border-transparent' 
      : color === 'secondary' 
        ? 'bg-secondary border-transparent' 
        : color === 'tertiary' 
          ? 'bg-tertiary border-transparent' 
          : 'bg-transparent border-transparent';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b transition-colors duration-300 ${headerBgClass}`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto py-3 px-4 md:px-8 lg:px-12">
        <NavLink
          to="/"
          className="flex items-center gap-2 hover:scale-105 transition duration-200 ease-in-out"
        >
          <img src="/logo.svg" alt="Watch Guru Logo" className="w-9 h-9" />
          <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Watch<span className="text-secondary">Guru</span>
          </span>
        </NavLink>
        {showSearch && <Search type={searchType} />}
        <nav className="flex items-center gap-6 md:gap-8">
          {LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide hover:text-secondary transition duration-200 ease-in-out ${isActive ? 'text-secondary border-b-2 border-secondary pb-1' : 'text-slate-300'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          {/* Language Switcher Pill */}
          <div className="flex bg-slate-900/80 border border-slate-800 p-0.5 rounded-full backdrop-blur-sm ml-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition duration-200 ${currentLanguage === 'en' ? 'bg-secondary text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('es')}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition duration-200 ${currentLanguage === 'es' ? 'bg-secondary text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              ES
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
