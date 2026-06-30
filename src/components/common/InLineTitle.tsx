import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

type InLineTitleProps = {
  label: string;
  viewMoreText?: string;
  href?: string;
  showViewMore?: boolean;
};

export function InLineTitle({
  label,
  viewMoreText,
  href = '/',
  showViewMore = true,
}: InLineTitleProps): JSX.Element {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];
  const displayViewMoreText = viewMoreText || `${t.viewMore} ${label}`;

  return (
    <header className="flex pb-4 justify-between items-center">
      <h2 className="h2-guru">{label}</h2>
      {showViewMore && (
        <Link
          className="text-secondary/90 hover:text-secondary font-semibold text-xs md:text-sm transition-colors duration-200"
          to={href}
        >
          {displayViewMoreText} &rarr;
        </Link>
      )}
    </header>
  );
}
