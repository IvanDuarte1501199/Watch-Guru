CREATE TABLE "match_participant" (
	"id" text PRIMARY KEY NOT NULL,
	"room_code" text NOT NULL,
	"user_id" text,
	"nickname" text NOT NULL,
	"token_hash" text NOT NULL,
	"is_host" boolean DEFAULT false NOT NULL,
	"genres" integer[] DEFAULT '{}'::integer[] NOT NULL,
	"ready" boolean DEFAULT false NOT NULL,
	"is_voter" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_participant_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "match_room" (
	"code" text PRIMARY KEY NOT NULL,
	"media_type" text NOT NULL,
	"status" text DEFAULT 'lobby' NOT NULL,
	"lang" text DEFAULT 'es' NOT NULL,
	"deck" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"deck_pages" smallint DEFAULT 0 NOT NULL,
	"voter_count" smallint DEFAULT 0 NOT NULL,
	"matches" integer[] DEFAULT '{}'::integer[] NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_vote" (
	"room_code" text NOT NULL,
	"participant_id" text NOT NULL,
	"card_index" smallint NOT NULL,
	"liked" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_vote_participant_id_card_index_pk" PRIMARY KEY("participant_id","card_index")
);
--> statement-breakpoint
ALTER TABLE "match_participant" ADD CONSTRAINT "match_participant_room_code_match_room_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."match_room"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_participant" ADD CONSTRAINT "match_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_vote" ADD CONSTRAINT "match_vote_room_code_match_room_code_fk" FOREIGN KEY ("room_code") REFERENCES "public"."match_room"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_vote" ADD CONSTRAINT "match_vote_participant_id_match_participant_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."match_participant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "match_participant_room_idx" ON "match_participant" USING btree ("room_code");--> statement-breakpoint
CREATE INDEX "match_room_expires_at_idx" ON "match_room" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "match_vote_room_card_idx" ON "match_vote" USING btree ("room_code","card_index");