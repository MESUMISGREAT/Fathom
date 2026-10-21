CREATE TABLE "topic_recoveries" (
	"user_id" uuid NOT NULL,
	"topic_id" text NOT NULL,
	"slipped_at" timestamp with time zone NOT NULL,
	"secured_at" timestamp with time zone,
	CONSTRAINT "topic_recoveries_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "show_points" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "topic_recoveries" ADD CONSTRAINT "topic_recoveries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Badge catalogue v2 (docs/design/fun-and-points.md §4): move earned badges to their nearest new ids.
-- Streak badges and First Spark are retired. The old 'on-a-roll' was a streak badge, so it is deleted
-- before 'combo-5' takes over that id.
DELETE FROM "user_badges" WHERE "badge_id" IN ('first-spark', 'on-a-roll', 'week-warrior', 'unstoppable');--> statement-breakpoint
UPDATE "user_badges" SET "badge_id" = 'first-steps' WHERE "badge_id" = 'off-the-blocks'
	AND NOT EXISTS (SELECT 1 FROM "user_badges" "b" WHERE "b"."user_id" = "user_badges"."user_id" AND "b"."badge_id" = 'first-steps');--> statement-breakpoint
UPDATE "user_badges" SET "badge_id" = 'on-a-roll' WHERE "badge_id" = 'combo-5'
	AND NOT EXISTS (SELECT 1 FROM "user_badges" "b" WHERE "b"."user_id" = "user_badges"."user_id" AND "b"."badge_id" = 'on-a-roll');--> statement-breakpoint
UPDATE "user_badges" SET "badge_id" = 'in-the-zone' WHERE "badge_id" = 'combo-10'
	AND NOT EXISTS (SELECT 1 FROM "user_badges" "b" WHERE "b"."user_id" = "user_badges"."user_id" AND "b"."badge_id" = 'in-the-zone');--> statement-breakpoint
DELETE FROM "user_badges" WHERE "badge_id" IN ('off-the-blocks', 'combo-5', 'combo-10');
