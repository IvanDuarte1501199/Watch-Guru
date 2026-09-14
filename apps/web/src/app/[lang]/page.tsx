import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { rotatingPick } from '@/lib/site';
import { discover, getCategory, getGenres, getTrendingAll, getTrendingPeople } from '@/lib/tmdb/api';
import { AdSlot } from '@/components/ads/AdSlot';
import { HeroCarousel } from '@/components/media/HeroCarousel';
import { MagicSuggest } from '@/components/media/MagicSuggest';
import { MatchPromo } from '@/components/media/MatchPromo';
import { PopularGuides } from '@/components/seo/PopularGuides';
import { MediaRail } from '@/components/media/MediaRail';
import { PeopleRail } from '@/components/media/PeopleRail';

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: '', title: t.siteTitle, absoluteTitle: true, description: t.siteDescription });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [t, trending, popularMovies, trendingTv, topRatedTv, upcomingMovies, people, movieGenres, tvGenres] =
    await Promise.all([
      getDictionary(lang),
      getTrendingAll(lang),
      getCategory('movie', 'popular', lang),
      getCategory('tv', 'trending', lang),
      getCategory('tv', 'top-rated', lang),
      getCategory('movie', 'upcoming', lang),
      getTrendingPeople(lang),
      getGenres('movie', lang),
      getGenres('tv', lang),
    ]);

  const [movieGenreA, movieGenreB] = rotatingPick(movieGenres, 2);
  const [tvGenreA, tvGenreB] = rotatingPick(tvGenres, 2, 7);
  const [moviesA, moviesB, tvA, tvB] = await Promise.all([
    discover('movie', lang, { genres: [movieGenreA.id] }),
    discover('movie', lang, { genres: [movieGenreB.id] }),
    discover('tv', lang, { genres: [tvGenreA.id] }),
    discover('tv', lang, { genres: [tvGenreB.id] }),
  ]);

  const genreName = new Map([...movieGenres, ...tvGenres].map((genre) => [genre.id, genre.name]));
  const heroItems = trending.results.slice(0, 5).map((item) => ({
    ...item,
    genreNames: item.genre_ids
      .map((id) => genreName.get(id))
      .filter((name): name is string => Boolean(name))
      .slice(0, 3),
  }));
  const halfPeople = Math.ceil(people.length / 2);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute -top-56 -left-40 -z-10 h-[620px] w-[620px] rounded-full bg-secondary/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute top-64 -right-52 -z-10 h-[560px] w-[560px] rounded-full bg-tertiary/15 blur-[120px]" />

      <div className="flex animate-fade-in flex-col-reverse gap-2 pt-6 pb-6 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-8">
        <h1 className="flex flex-col gap-2">
          <span className="text-4xl leading-none font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            {t.homeHeadingTitle}
          </span>
          <span className="text-base font-normal text-muted sm:text-lg md:text-[22px]">
            {t.homeHeadingSubtitle.split('{highlight}')[0]}
            <span className="bg-[linear-gradient(transparent_62%,rgba(95,179,205,0.45)_62%)] font-semibold text-white">
              {t.homeHeadingHighlight}
            </span>
            {t.homeHeadingSubtitle.split('{highlight}')[1]}
          </span>
        </h1>
        <p className="text-xs font-bold tracking-[0.2em] text-secondary uppercase md:pb-2 md:text-[13px]">{t.heroTopLabel}</p>
      </div>

      <HeroCarousel items={heroItems} />

      <MagicSuggest lang={lang} t={t} />
      <MatchPromo lang={lang} t={t} />
      <PopularGuides lang={lang} t={t} />
      <AdSlot />

      <p className="mb-8 text-center md:mb-12">
        <Link
          href={routes.search(lang)}
          className="h2-guru text-secondary transition duration-200 hover:underline"
        >
          {t.advancedSearch} &rarr;
        </Link>
      </p>

      <MediaRail
        title={t.popularMovies}
        items={popularMovies.results}
        lang={lang}
        href={routes.category(lang, 'movie', 'popular')}
        viewMoreLabel={t.viewAll}
      />
      <MediaRail
        title={format(t.moviesOfGenre, { genre: movieGenreA.name })}
        items={moviesA.results}
        lang={lang}
        href={routes.genre(lang, 'movie', movieGenreA.id, movieGenreA.name)}
        viewMoreLabel={t.viewAll}
      />
      <PeopleRail title={t.featuredPeople} people={people.slice(0, halfPeople)} lang={lang} />
      <MediaRail
        title={t.trendingTvShows}
        items={trendingTv.results}
        lang={lang}
        href={routes.category(lang, 'tv', 'trending')}
        viewMoreLabel={t.viewAll}
      />
      <MediaRail
        title={format(t.tvShowsOfGenre, { genre: tvGenreA.name })}
        items={tvA.results}
        lang={lang}
        href={routes.genre(lang, 'tv', tvGenreA.id, tvGenreA.name)}
        viewMoreLabel={t.viewAll}
      />
      <PeopleRail title={t.featuredPeople} people={people.slice(halfPeople)} lang={lang} />
      <MediaRail
        title={t.upcomingMovies}
        items={upcomingMovies.results}
        lang={lang}
        href={routes.category(lang, 'movie', 'upcoming')}
        viewMoreLabel={t.viewAll}
      />
      <MediaRail
        title={format(t.moviesOfGenre, { genre: movieGenreB.name })}
        items={moviesB.results}
        lang={lang}
        href={routes.genre(lang, 'movie', movieGenreB.id, movieGenreB.name)}
        viewMoreLabel={t.viewAll}
      />
      <MediaRail
        title={t.topRatedTvShows}
        items={topRatedTv.results}
        lang={lang}
        href={routes.category(lang, 'tv', 'top-rated')}
        viewMoreLabel={t.viewAll}
      />
      <MediaRail
        title={format(t.tvShowsOfGenre, { genre: tvGenreB.name })}
        items={tvB.results}
        lang={lang}
        href={routes.genre(lang, 'tv', tvGenreB.id, tvGenreB.name)}
        viewMoreLabel={t.viewAll}
      />
    </>
  );
}
