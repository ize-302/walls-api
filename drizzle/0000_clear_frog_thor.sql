CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`password` text
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`userid` text,
	`email` text,
	`name` text,
	`bio` text(150),
	`gender` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usernameIndex` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `userIdIndex` ON `profiles` (`userid`);