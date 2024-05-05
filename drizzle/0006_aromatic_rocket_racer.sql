DROP INDEX IF EXISTS `followedIdIndex`;--> statement-breakpoint
CREATE UNIQUE INDEX `idIndex` ON `follows` (`id`);