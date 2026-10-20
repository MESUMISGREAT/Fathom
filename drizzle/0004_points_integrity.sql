ALTER TABLE "attempts" ADD COLUMN "local_day" date;--> statement-breakpoint
ALTER TABLE "attempts" ADD COLUMN "due_review" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "review_items" ADD COLUMN "pays_xp" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "active_day" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "active_day_zone" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "combo" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "combo_at" timestamp with time zone;--> statement-breakpoint
-- Students who already have XP: their current local day is the latest one they earned on, started in their stored zone.
UPDATE "users" SET "active_day" = "d"."day", "active_day_zone" = "users"."time_zone"
	FROM (SELECT "user_id", max("local_day") AS "day" FROM "xp_events" GROUP BY "user_id") AS "d"
	WHERE "d"."user_id" = "users"."id";--> statement-breakpoint
-- The live combo moves from "the latest answer that could earn XP" to the user's row.
UPDATE "users" SET "combo" = "a"."combo", "combo_at" = "a"."created_at"
	FROM (SELECT DISTINCT ON ("user_id") "user_id", "combo", "created_at" FROM "attempts"
		WHERE "combo" IS NOT NULL ORDER BY "user_id", "created_at" DESC) AS "a"
	WHERE "a"."user_id" = "users"."id";
