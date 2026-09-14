import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { PersonSummary } from '@/lib/tmdb/types';
import { Carousel } from '@/components/ui/Carousel';

export function PeopleRail({ title, people, lang }: { title: string; people: PersonSummary[]; lang: Locale }) {
  if (people.length === 0) return null;

  return (
    <section className="mb-12 md:mb-16">
      <h2 className="h2-guru mb-4">{title}</h2>
      <Carousel label={title} itemClassName="w-[38%] sm:w-[26%] md:w-[18%] xl:w-[15%]">
        {people.map((person) => {
          const photo = tmdbImage(person.profile_path, 'w342');
          return (
            <Link key={person.id} href={routes.person(lang, person.id, person.name)} className="group block">
              <div className="mb-2 aspect-[2/3] overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    loading="lazy"
                    src={photo}
                    alt={person.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/user.svg" alt="" className="h-full w-full bg-white/90 object-contain p-8" />
                )}
              </div>
              <h3 className="line-clamp-1 text-base font-semibold text-white group-hover:text-secondary">
                {person.name}
              </h3>
              <p className="text-sm text-slate-400">{person.known_for_department}</p>
            </Link>
          );
        })}
      </Carousel>
    </section>
  );
}
