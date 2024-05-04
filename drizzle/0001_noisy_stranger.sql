ALTER TABLE `profiles` RENAME COLUMN `name` TO `displayName`;--> statement-breakpoint
ALTER TABLE profiles ADD `avatar_url` text;