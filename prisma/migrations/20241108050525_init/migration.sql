/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ADMIN', 'SUB_ADMIN', 'MENTOR', 'USER') NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
