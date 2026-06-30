import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Film, Tv } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

const MagicSuggest: React.FC = () => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  return (
    <section className="my-8 md:my-12 mx-auto max-w-4xl px-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-slate-800/80 p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        
        {/* Neon Glow spots */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content Info */}
        <div className="flex items-start gap-4 z-10">
          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary animate-pulse mt-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {t.dontKnowWhatToWatch}
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-1 max-w-md">
              {t.magicSuggestBody}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
          <Link
            to="/random/movie"
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-secondary hover:bg-secondary/90 text-slate-950 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-secondary/20 hover:scale-102 text-sm md:text-base text-center"
          >
            <Film className="w-4 h-4" />
            {t.randomMovie}
          </Link>
          <Link
            to="/random/tv-show"
            className="flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 text-white font-bold rounded-xl transition-all duration-300 hover:bg-slate-850 hover:scale-102 text-sm md:text-base text-center"
          >
            <Tv className="w-4 h-4" />
            {t.randomTvShow}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MagicSuggest;
