import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { CastMember } from '@/lib/tmdb/types';
import { Carousel } from '@/components/ui/Carousel';

export function CastList({ title, cast, lang }: { title: string; cast: CastMember[]; lang: Locale }) {
  if (cast.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16">
      <h2 className="h2-guru mb-4">{title}</h2>
      <Carousel label={title} itemClassName="w-[34%] sm:w-[22%] md:w-[16%] xl:w-[12.5%]">
        {cast.slice(0, 20).map((member) => {
          const photo = tmdbImage(member.profile_path, 'w185');
          return (
            <Link key={member.id} href={routes.person(lang, member.id, member.name)} className="group block">
              <div className="mb-2 aspect-[2/3] overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={member.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/user.svg" alt="" className="h-full w-full bg-white/90 object-contain p-6" />
                )}
              </div>
              <p className="line-clamp-1 text-sm font-semibold text-white group-hover:text-secondary">{member.name}</p>
              {member.character && <p className="line-clamp-1 text-xs text-slate-400">{member.character}</p>}
            </Link>
          );
        })}
      </Carousel>
    </section>
  );
}
