CREATE TABLE IF NOT EXISTS "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"userid" text,
	"email" text,
	"name" text,
	"bio" varchar(150),
	"gender" "gender"
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "userIdIndex" ON "profiles" ("userid");