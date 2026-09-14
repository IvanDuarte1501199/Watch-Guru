import { notFound } from 'next/navigation';

/** Sends any unmatched URL under a locale to that locale's styled 404 page. */
export default function CatchAllPage() {
  notFound();
}
