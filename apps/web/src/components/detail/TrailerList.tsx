'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { Video } from '@/lib/tmdb/types';
import { Carousel } from '@/components/ui/Carousel';

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const { t } = useI18n();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={video.name}
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute -top-12 right-0 rounded-full bg-slate-900 p-2 text-white hover:text-secondary"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1`}
            title={video.name}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function TrailerList({ videos }: { videos: Video[] }) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState<Video | null>(null);

  if (videos.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16">
      <h2 className="h2-guru mb-4">{t.trailers}</h2>
      <Carousel label={t.trailers} itemClassName="w-[80%] sm:w-[48%] lg:w-[32%]">
        {videos.slice(0, 12).map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setPlaying(video)}
            aria-label={format(t.playTrailer, { name: video.name })}
            className="group block w-full text-left"
          >
            <span className="relative block aspect-video overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105 group-hover:brightness-75"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-black/50 transition-transform duration-300 group-hover:scale-110 group-hover:bg-secondary">
                  <Play className="ml-1 h-6 w-6 fill-white text-white" />
                </span>
              </span>
            </span>
            <span className="mt-2 line-clamp-1 block text-sm font-medium text-slate-200">{video.name}</span>
          </button>
        ))}
      </Carousel>
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </section>
  );
}
