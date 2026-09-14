/** Faded full-width image behind the top of the page. */
export function Backdrop({ src }: { src: string | null | undefined }) {
  if (!src) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[70vh]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full animate-fade-in object-cover object-[50%_20%] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary" />
    </div>
  );
}
