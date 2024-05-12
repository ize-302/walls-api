ALTER TABLE `follows` RENAME COLUMN `followed_id` TO `user_id`;--> statement-breakpoint
ALTER TABLE `follows` RENAME COLUMN `follower_id` TO `followed_by`;