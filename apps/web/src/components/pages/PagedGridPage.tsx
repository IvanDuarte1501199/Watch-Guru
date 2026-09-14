import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { MediaSummary, Paged } from '@/lib/tmdb/types';
import { Backdrop } from '@/components/layout/Backdrop';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Pagination } from '@/components/ui/Pagination';

interface PagedGridPageProps {
  title: string;
  data: Paged<MediaSummary>;
  basePath: string;
  lang: Locale;
  t: Dictionary;
  backdrop?: string | null;
}

export function parsePage(value: string | string[] | undefined): number {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : 1;
}

/** A titled grid of media with crawlable pagination links. */
export function PagedGridPage({ title, data, basePath, lang, t, backdrop }: PagedGridPageProps) {
  return (
    <>
      <Backdrop src={backdrop} />
      <section className="animate-fade-in-up">
        <h1 className="h1-guru pt-4 pb-6 text-center md:pt-8 md:pb-10">{title}</h1>
        {data.results.length > 0 ? (
          <MediaGrid items={data.results} lang={lang} />
        ) : (
          <p className="p-guru py-8 text-center">{t.noItems}</p>
        )}
        <Pagination
          currentPage={data.page}
          totalPages={data.total_pages}
          hrefForPage={(page) => (page === 1 ? basePath : `${basePath}?page=${page}`)}
          t={t}
        />
      </section>
    </>
  );
}
