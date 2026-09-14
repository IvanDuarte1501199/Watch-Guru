ALTER TABLE "match_participant" ADD COLUMN "providers" integer[] DEFAULT '{}'::integer[] NOT NULL;--> statement-breakpoint
ALTER TABLE "match_room" ADD COLUMN "region" text;