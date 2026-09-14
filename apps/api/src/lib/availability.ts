import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  availabilitySnapshot,
  libraryEntry,
  notification,
  tasteProfile,
  user,
  type AvailabilityNotificationData,
  type MediaType,
} from '../db/schema.js';
import { env } from '../env.js';
import { sendEmail, type Email } from './mailer.js';
import { tmdbGet } from './tmdb.js';

interface ProviderInfo {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

type ProvidersResponse = { results: Record<string, { flatrate?: ProviderInfo[] } | undefined> };

export interface AvailabilityRunResult {
  checked: number;
  notifications: number;
  emails: number;
}

/**
 * Checks every watchlisted title of users who told us their services and
 * country. The first check of a title only records a baseline; afterwards,
 * services that newly carry it produce an in-app notification and, for users
 * with a verified email, one summary email per run.
 */
export async function runAvailabilityCheck(): Promise<AvailabilityRunResult> {
  const rows = await db
    .select({
      userId: libraryEntry.userId,
      mediaType: libraryEntry.mediaType,
      tmdbId: libraryEntry.tmdbId,
      title: libraryEntry.title,
      posterPath: libraryEntry.posterPath,
      region: tasteProfile.region,
      providers: tasteProfile.providers,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      snapshotRegion: availabilitySnapshot.region,
      snapshotProviders: availabilitySnapshot.providerIds,
    })
    .from(libraryEntry)
    .innerJoin(tasteProfile, eq(tasteProfile.userId, libraryEntry.userId))
    .innerJoin(user, eq(user.id, libraryEntry.userId))
    .leftJoin(
      availabilitySnapshot,
      and(
        eq(availabilitySnapshot.userId, libraryEntry.userId),
        eq(availabilitySnapshot.mediaType, libraryEntry.mediaType),
        eq(availabilitySnapshot.tmdbId, libraryEntry.tmdbId),
      ),
    )
    .where(
      and(
        eq(libraryEntry.status, 'watchlist'),
        sql`${tasteProfile.region} IS NOT NULL`,
        sql`cardinality(${tasteProfile.providers}) > 0`,
      ),
    );

  // One TMDB lookup per title, shared by everyone who watchlisted it.
  const lookups = new Map<string, Promise<ProvidersResponse | null>>();
  const providersFor = (kind: MediaType, id: number) => {
    const key = `${kind}:${id}`;
    if (!lookups.has(key)) {
      lookups.set(key, tmdbGet<ProvidersResponse>(`/${kind}/${id}/watch/providers`, {}, { cache: false }).catch(() => null));
    }
    return lookups.get(key)!;
  };

  const newByUser = new Map<string, { email: string; name: string; verified: boolean; titles: string[] }>();
  let created = 0;

  for (const row of rows) {
    const response = await providersFor(row.mediaType, row.tmdbId);
    if (!response) continue;

    const region = row.region!;
    const available = (response.results[region]?.flatrate ?? []).filter((provider) =>
      row.providers.includes(provider.provider_id),
    );
    const availableIds = available.map((provider) => provider.provider_id);

    // A missing snapshot, or one for another country, is a fresh baseline.
    const hadBaseline = row.snapshotProviders !== null && row.snapshotRegion === region;
    const newlyAvailable = hadBaseline ? available.filter((p) => !row.snapshotProviders!.includes(p.provider_id)) : [];

    await db
      .insert(availabilitySnapshot)
      .values({ userId: row.userId, mediaType: row.mediaType, tmdbId: row.tmdbId, region, providerIds: availableIds })
      .onConflictDoUpdate({
        target: [availabilitySnapshot.userId, availabilitySnapshot.mediaType, availabilitySnapshot.tmdbId],
        set: { region, providerIds: availableIds, checkedAt: new Date() },
      });

    if (newlyAvailable.length === 0) continue;

    const data: AvailabilityNotificationData = {
      region,
      providers: newlyAvailable.map((p) => ({ id: p.provider_id, name: p.provider_name, logoPath: p.logo_path })),
    };
    await db.insert(notification).values({
      userId: row.userId,
      type: 'available',
      mediaType: row.mediaType,
      tmdbId: row.tmdbId,
      title: row.title,
      posterPath: row.posterPath,
      data,
    });
    created++;

    const summary = newByUser.get(row.userId) ?? { email: row.email, name: row.name, verified: row.emailVerified, titles: [] };
    summary.titles.push(`${row.title} (${data.providers.map((p) => p.name).join(', ')})`);
    newByUser.set(row.userId, summary);
  }

  let emails = 0;
  for (const summary of newByUser.values()) {
    if (!summary.verified) continue;
    await sendEmail(availabilityEmail(summary)).then(
      () => emails++,
      (error) => console.error('Failed to send availability email', error),
    );
  }

  return { checked: rows.length, notifications: created, emails };
}

function availabilityEmail(summary: { email: string; name: string; titles: string[] }): Email {
  const escape = (value: string) => value.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const listUrl = `${env.WEB_URL}/es/my-list`;
  const items = summary.titles.map((title) => `<li style="margin:6px 0">${escape(title)}</li>`).join('');
  return {
    to: summary.email,
    subject:
      summary.titles.length === 1
        ? `Ya podés ver ${summary.titles[0].replace(/ \(.*\)$/, '')} en tus plataformas`
        : `${summary.titles.length} títulos de tu lista llegaron a tus plataformas`,
    html: `<!doctype html><html><body style="background:#08042c;color:#e2e8f0;font-family:Arial,sans-serif;padding:24px">
<h2 style="color:#fff">Hola ${escape(summary.name || summary.email)} 👋</h2>
<p>Estos títulos de tu lista "Quiero ver" ya están en tus plataformas:</p>
<ul>${items}</ul>
<p><a href="${listUrl}" style="background:#5fb3cd;color:#08042c;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Ver mi lista</a></p>
</body></html>`,
    text: `Estos títulos de tu lista "Quiero ver" ya están en tus plataformas:\n\n${summary.titles.map((t) => `- ${t}`).join('\n')}\n\nVer mi lista: ${listUrl}`,
  };
}

export async function markNotificationsRead(userId: string, ids?: number[]) {
  await db
    .update(notification)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notification.userId, userId),
        sql`${notification.readAt} IS NULL`,
        ids?.length ? inArray(notification.id, ids) : undefined,
      ),
    );
}
