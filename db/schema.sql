-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema gamezone
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gamezone
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gamezone` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `gamezone` ;

-- -----------------------------------------------------
-- Table `gamezone`.`genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`genres` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_genres_name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`games` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `age_rating` ENUM('E', 'E10+', 'T', 'M', 'AO', 'RP') NOT NULL,
  `description` TEXT NOT NULL,
  `genre_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_games_name` (`name` ASC) VISIBLE,
  INDEX `fk_games_genre` (`genre_id` ASC) VISIBLE,
  CONSTRAINT `fk_games_genre`
    FOREIGN KEY (`genre_id`)
    REFERENCES `gamezone`.`genres` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`achievements`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`achievements` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `game_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(80) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `type` ENUM('simple', 'progress', 'dated') NOT NULL,
  `target` INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_achievements_game_name` (`game_id` ASC, `name` ASC) VISIBLE,
  CONSTRAINT `fk_achievements_game`
    FOREIGN KEY (`game_id`)
    REFERENCES `gamezone`.`games` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(30) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_users_username` (`username` ASC) VISIBLE,
  UNIQUE INDEX `uq_users_email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`achievement_progress`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`achievement_progress` (
  `user_id` INT UNSIGNED NOT NULL,
  `achievement_id` INT UNSIGNED NOT NULL,
  `progress` INT UNSIGNED NOT NULL DEFAULT '0',
  `unlocked_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `achievement_id`),
  INDEX `fk_progress_achievement` (`achievement_id` ASC) VISIBLE,
  CONSTRAINT `fk_progress_achievement`
    FOREIGN KEY (`achievement_id`)
    REFERENCES `gamezone`.`achievements` (`id`),
  CONSTRAINT `fk_progress_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `gamezone`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`purchases`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`purchases` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `game_id` INT UNSIGNED NOT NULL,
  `purchased_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price_paid` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_purchases_user_game` (`user_id` ASC, `game_id` ASC) VISIBLE,
  INDEX `fk_purchases_game` (`game_id` ASC) VISIBLE,
  INDEX `ix_purchases_date` (`purchased_at` ASC) VISIBLE,
  CONSTRAINT `fk_purchases_game`
    FOREIGN KEY (`game_id`)
    REFERENCES `gamezone`.`games` (`id`),
  CONSTRAINT `fk_purchases_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `gamezone`.`users` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`library_entries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`library_entries` (
  `user_id` INT UNSIGNED NOT NULL,
  `game_id` INT UNSIGNED NOT NULL,
  `downloaded` TINYINT(1) NOT NULL DEFAULT '0',
  `hours_played` DECIMAL(8,1) NOT NULL DEFAULT '0.0',
  `last_played_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `game_id`),
  CONSTRAINT `fk_library_purchase`
    FOREIGN KEY (`user_id` , `game_id`)
    REFERENCES `gamezone`.`purchases` (`user_id` , `game_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `game_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `hours_played` DECIMAL(8,1) NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_reviews_user_game` (`user_id` ASC, `game_id` ASC) VISIBLE,
  INDEX `ix_reviews_game` (`game_id` ASC) VISIBLE,
  CONSTRAINT `fk_reviews_purchase`
    FOREIGN KEY (`user_id` , `game_id`)
    REFERENCES `gamezone`.`purchases` (`user_id` , `game_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`tags` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_tags_name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `gamezone`.`review_tags`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gamezone`.`review_tags` (
  `review_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`review_id`, `tag_id`),
  INDEX `fk_rt_tag` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_rt_review`
    FOREIGN KEY (`review_id`)
    REFERENCES `gamezone`.`reviews` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_rt_tag`
    FOREIGN KEY (`tag_id`)
    REFERENCES `gamezone`.`tags` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
