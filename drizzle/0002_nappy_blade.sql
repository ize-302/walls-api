CREATE TABLE `follows` (
	`followed_id` text PRIMARY KEY NOT NULL,
	`follower_id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `followedIdIndex` ON `follows` (`followed_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `followerIdIndex` ON `follows` (`follower_id`);