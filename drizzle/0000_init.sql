CREATE TABLE "app_meta" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"response" jsonb NOT NULL,
	"outcome" text NOT NULL,
	"score" real NOT NULL,
	"self_assessed" boolean NOT NULL,
	"context" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"user_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"target_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_kind_target_id_pk" PRIMARY KEY("user_id","kind","target_id")
);
--> statement-breakpoint
CREATE TABLE "enrollments" (
	"user_id" uuid NOT NULL,
	"subject_code" text NOT NULL,
	"version_id" text NOT NULL,
	"target_level" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "enrollments_user_id_subject_code_pk" PRIMARY KEY("user_id","subject_code")
);
--> statement-breakpoint
CREATE TABLE "lesson_objectives" (
	"lesson_id" text NOT NULL,
	"objective_id" text NOT NULL,
	CONSTRAINT "lesson_objectives_lesson_id_objective_id_pk" PRIMARY KEY("lesson_id","objective_id")
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"user_id" uuid NOT NULL,
	"lesson_id" text NOT NULL,
	"step_reached" integer DEFAULT 0 NOT NULL,
	"step_count" integer NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "lesson_progress_user_id_lesson_id_pk" PRIMARY KEY("user_id","lesson_id")
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"id" text PRIMARY KEY NOT NULL,
	"version_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"position" integer NOT NULL,
	"minutes" integer NOT NULL,
	"kind" text NOT NULL,
	"prerequisites" text[] NOT NULL,
	"provenance" jsonb NOT NULL,
	"blocks" jsonb NOT NULL,
	"search_text" text NOT NULL,
	"content_hash" text NOT NULL,
	"archived_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "objectives" (
	"id" text PRIMARY KEY NOT NULL,
	"version_id" text NOT NULL,
	"topic_id" text NOT NULL,
	"code" text NOT NULL,
	"text" text NOT NULL,
	"guidance" text,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_objectives" (
	"question_id" text NOT NULL,
	"objective_id" text NOT NULL,
	CONSTRAINT "question_objectives_question_id_objective_id_pk" PRIMARY KEY("question_id","objective_id")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"version_id" text NOT NULL,
	"format" text NOT NULL,
	"difficulty" integer NOT NULL,
	"position" integer NOT NULL,
	"spec" jsonb NOT NULL,
	"view" jsonb NOT NULL,
	"reveal" jsonb NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "review_items" (
	"user_id" uuid NOT NULL,
	"question_id" text NOT NULL,
	"box" integer NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"last_reviewed_at" timestamp with time zone NOT NULL,
	CONSTRAINT "review_items_user_id_question_id_pk" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"code" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"description" text NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "subjects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "syllabus_sections" (
	"id" text PRIMARY KEY NOT NULL,
	"version_id" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"level" text NOT NULL,
	"papers" text[] NOT NULL,
	"strand" text,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "syllabus_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_code" text NOT NULL,
	"label" text NOT NULL,
	"exam_years" integer[] NOT NULL,
	"source_url" text NOT NULL,
	"source_version" text NOT NULL,
	"checked_at" text NOT NULL,
	"wording" text NOT NULL,
	"notes" text,
	"is_current" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" text PRIMARY KEY NOT NULL,
	"version_id" text NOT NULL,
	"section_id" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"display_name" text,
	"role" text DEFAULT 'student' NOT NULL,
	"theme" text DEFAULT 'system' NOT NULL,
	"lesson_mode" text DEFAULT 'steps' NOT NULL,
	"age_confirmed_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_subject_code_subjects_code_fk" FOREIGN KEY ("subject_code") REFERENCES "public"."subjects"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_objectives" ADD CONSTRAINT "lesson_objectives_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_objectives" ADD CONSTRAINT "lesson_objectives_objective_id_objectives_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_objectives" ADD CONSTRAINT "question_objectives_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_objectives" ADD CONSTRAINT "question_objectives_objective_id_objectives_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_items" ADD CONSTRAINT "review_items_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syllabus_sections" ADD CONSTRAINT "syllabus_sections_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syllabus_versions" ADD CONSTRAINT "syllabus_versions_subject_code_subjects_code_fk" FOREIGN KEY ("subject_code") REFERENCES "public"."subjects"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_version_id_syllabus_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."syllabus_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topics" ADD CONSTRAINT "topics_section_id_syllabus_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."syllabus_sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_user_time_idx" ON "attempts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "attempts_user_question_idx" ON "attempts" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "lesson_objectives_obj_idx" ON "lesson_objectives" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "lessons_topic_idx" ON "lessons" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "objectives_topic_idx" ON "objectives" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "question_objectives_obj_idx" ON "question_objectives" USING btree ("objective_id");--> statement-breakpoint
CREATE INDEX "questions_lesson_idx" ON "questions" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "review_items_due_idx" ON "review_items" USING btree ("user_id","due_at");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sections_version_idx" ON "syllabus_sections" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "topics_section_idx" ON "topics" USING btree ("section_id");