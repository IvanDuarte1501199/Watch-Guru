import React from 'react';

type InLineTitleProps = {
  label: string;
  viewMoreText?: string;
  href?: string;
  showViewMore?: boolean;
};

export function InLineTitle({
  label,
  viewMoreText = `View more ${label}`,
  href = '/',
  showViewMore = true,
}: InLineTitleProps): JSX.Element {
  return (
    <header className="flex pb-4 justify-between items-center">
      <h2 className="h2-guru">{label}</h2>
      {showViewMore && <a className="text-default underline text-xs md:text-lg hover:text-secondary" href={href}>{viewMoreText} &gt;</a>}
    </header>
  );
}
