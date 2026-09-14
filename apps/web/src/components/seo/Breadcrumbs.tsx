import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';
import { JsonLd } from '@/components/JsonLd';

export interface Crumb {
  name: string;
  href: string;
}

/** Visible breadcrumb trail plus BreadcrumbList structured data. The last crumb is the current page. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  if (items.length < 2) return null;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.href}`,
          })),
        }}
      />
      <nav aria-label={label} className="pt-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-slate-400">
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={item.href} className="flex min-w-0 items-center gap-1">
                {last ? (
                  <span aria-current="page" className="truncate text-slate-300">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="truncate hover:text-secondary">
                      {item.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
