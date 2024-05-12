CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`author_id` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`parent_id` text
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`parent_id` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`author_id` text NOT NULL,
	`timestamp` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `commenIdIndex` ON `comments` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `likeIdIndex` ON `likes` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `postIdIndex` ON `posts` (`id`);