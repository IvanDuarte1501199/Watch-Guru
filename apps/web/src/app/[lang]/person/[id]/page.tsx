import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { parseIdParam, routes } from '@/lib/routes';
import { pageMetadata, summarize } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { getPerson } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import { JsonLd } from '@/components/JsonLd';
import { PersonCredits } from '@/components/detail/PersonCredits';
import { Backdrop } from '@/components/layout/Backdrop';

export const revalidate = 3600;

// Rendered on first request, then cached and revalidated like the data it shows.
export function generateStaticParams() {
  return [];
}

async function resolvePerson(params: PageProps<'/[lang]/person/[id]'>['params']) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const personId = parseIdParam(id);
  if (personId === null) notFound();

  const person = await getPerson(personId, lang);
  if (!person) notFound();

  const canonical = routes.person(lang, person.id, person.name);
  if (canonical.split('/').pop() !== id) permanentRedirect(canonical);
  return { lang, person, canonical };
}

export async function generateMetadata({ params }: PageProps<'/[lang]/person/[id]'>): Promise<Metadata> {
  const { lang, person, canonical } = await resolvePerson(params);
  return pageMetadata({
    lang,
    path: canonical.slice(lang.length + 1),
    alternatePath: `/person/${person.id}`,
    title: person.name,
    description: summarize(person.biography),
    image: tmdbImage(person.profile_path, 'w500'),
  });
}

export default async function PersonPage({ params }: PageProps<'/[lang]/person/[id]'>) {
  const { lang, person, canonical } = await resolvePerson(params);
  const t = await getDictionary(lang);

  const photo = tmdbImage(person.profile_path, 'w500');
  const backdropSource = person.movies.find((item) => item.backdrop_path) ?? person.tvShows.find((item) => item.backdrop_path);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: person.name,
          url: `${SITE_URL}${canonical}`,
          image: photo ?? undefined,
          birthDate: person.birthday ?? undefined,
          deathDate: person.deathday ?? undefined,
          birthPlace: person.place_of_birth ?? undefined,
        }}
      />
      <Backdrop src={tmdbImage(backdropSource?.backdrop_path, 'original')} />

      <section className="flex animate-fade-in flex-col items-start gap-8 pt-4 pb-10 md:flex-row md:pt-12">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={person.name}
            className="mx-auto w-2/3 max-w-xs rounded-xl object-cover shadow-2xl sm:w-1/2 md:mx-0 md:w-1/3"
          />
        )}
        <div className="w-full md:w-2/3">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">{person.name}</h1>

          <dl className="mb-6 space-y-2 text-slate-200">
            {person.known_for_department && (
              <div>
                <dt className="inline font-semibold">{t.knownFor}: </dt>
                <dd className="inline">{person.known_for_department}</dd>
              </div>
            )}
            {person.birthday && (
              <div>
                <dt className="inline font-semibold">{t.born}: </dt>
                <dd className="inline">
                  {formatDate(person.birthday)}
                  {person.place_of_birth && ` ${t.inWord} ${person.place_of_birth}`}
                </dd>
              </div>
            )}
            {person.deathday && (
              <div>
                <dt className="inline font-semibold">{t.died}: </dt>
                <dd className="inline">{formatDate(person.deathday)}</dd>
              </div>
            )}
          </dl>

          {person.biography && (
            <div className="p-guru mb-6 space-y-3 whitespace-pre-line">{person.biography}</div>
          )}

          {person.homepage && (
            <a href={person.homepage} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
              {t.visitOfficialWebsite}
            </a>
          )}
        </div>
      </section>

      <PersonCredits movies={person.movies} tvShows={person.tvShows} />
    </>
  );
}
