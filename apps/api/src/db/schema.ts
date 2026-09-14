import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

/* ------------------------------------------------------------------ */
/* Better Auth core tables                                             */
/* Property names must match Better Auth's field names; columns are    */
/* snake_case in Postgres.                                             */
/* ------------------------------------------------------------------ */

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  ...timestamps,
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [index('session_user_id_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    ...timestamps,
  },
  (table) => [index('account_user_id_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

/* ------------------------------------------------------------------ */
/* WatchGuru tables                                                    */
/* ------------------------------------------------------------------ */

export const MEDIA_TYPES = ['movie', 'tv'] as const;
export const LIBRARY_STATUSES = ['watchlist', 'watching', 'watched'] as const;

export type MediaType = (typeof MEDIA_TYPES)[number];
export type LibraryStatus = (typeof LIBRARY_STATUSES)[number];

/**
 * One row per user and title: its list status and/or Guru rating.
 * Title metadata is a snapshot so "My list" renders without calling TMDB.
 */
export const libraryEntry = pgTable(
  'library_entry',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaType: text('media_type').$type<MediaType>().notNull(),
    tmdbId: integer('tmdb_id').notNull(),
    status: text('status').$type<LibraryStatus>(),
    /** Guru rating from 1 to 10 (half stars in the UI). */
    rating: smallint('rating'),
    title: text('title').notNull(),
    posterPath: text('poster_path'),
    releaseDate: text('release_date'),
    genreIds: integer('genre_ids').array().notNull().default(sql`'{}'::integer[]`),
    watchedAt: timestamp('watched_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    unique('library_entry_user_title_unique').on(table.userId, table.mediaType, table.tmdbId),
    index('library_entry_user_status_idx').on(table.userId, table.status),
    index('library_entry_title_rating_idx').on(table.mediaType, table.tmdbId, table.rating),
    check('library_entry_rating_range', sql`${table.rating} IS NULL OR ${table.rating} BETWEEN 1 AND 10`),
    check('library_entry_media_type', sql`${table.mediaType} IN ('movie', 'tv')`),
    check(
      'library_entry_status',
      sql`${table.status} IS NULL OR ${table.status} IN ('watchlist', 'watching', 'watched')`,
    ),
  ],
);

export const episodeProgress = pgTable(
  'episode_progress',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    tvId: integer('tv_id').notNull(),
    seasonNumber: smallint('season_number').notNull(),
    episodeNumber: smallint('episode_number').notNull(),
    watchedAt: timestamp('watched_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tvId, table.seasonNumber, table.episodeNumber] })],
);

/** Answers from the taste onboarding, used for personalized picks. */
export const tasteProfile = pgTable('taste_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  likedGenres: integer('liked_genres').array().notNull().default(sql`'{}'::integer[]`),
  dislikedGenres: integer('disliked_genres').array().notNull().default(sql`'{}'::integer[]`),
  providers: integer('providers').array().notNull().default(sql`'{}'::integer[]`),
  region: text('region'),
  ...timestamps,
});
