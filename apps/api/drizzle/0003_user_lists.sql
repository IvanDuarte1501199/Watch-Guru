CREATE TABLE "user_list" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_list_item" (
	"list_id" text NOT NULL,
	"media_type" text NOT NULL,
	"tmdb_id" integer NOT NULL,
	"title" text NOT NULL,
	"poster_path" text,
	"release_date" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_list_item_list_id_media_type_tmdb_id_pk" PRIMARY KEY("list_id","media_type","tmdb_id"),
	CONSTRAINT "user_list_item_media_type" CHECK ("user_list_item"."media_type" IN ('movie', 'tv'))
);
--> statement-breakpoint
ALTER TABLE "user_list" ADD CONSTRAINT "user_list_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_list_item" ADD CONSTRAINT "user_list_item_list_id_user_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."user_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_list_user_idx" ON "user_list" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_list_public_updated_idx" ON "user_list" USING btree ("is_public","updated_at");