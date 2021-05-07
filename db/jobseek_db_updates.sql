-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.18 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for jobseek
DROP DATABASE IF EXISTS `jobseek`;
CREATE DATABASE IF NOT EXISTS `jobseek` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `jobseek`;

-- Dumping structure for table jobseek.city
DROP TABLE IF EXISTS `city`;
CREATE TABLE IF NOT EXISTS `city` (
  `CityId` bigint(20) NOT NULL AUTO_INCREMENT,
  `CityName` varchar(50) NOT NULL,
  `StateId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`CityId`),
  KEY `FK_city_state` (`StateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table jobseek.employer
DROP TABLE IF EXISTS `employer`;
CREATE TABLE IF NOT EXISTS `employer` (
  `EmployerId` bigint(20) NOT NULL AUTO_INCREMENT,
  `EmployerName` varchar(50) NOT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`EmployerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table jobseek.job
CREATE TABLE `job` (
	`JobId` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`JobTitle` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`JobDescription` VARCHAR(10000) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`EmployerId` BIGINT(20) NOT NULL,
	`RequiredExperience` INT(11) NULL DEFAULT NULL,
	`PreferredExperience` INT(11) NULL DEFAULT NULL,
	`Remote` ENUM('Y','N') NOT NULL DEFAULT 'N' COLLATE 'utf8mb4_0900_ai_ci',
	`JobType` ENUM('F','P') NOT NULL DEFAULT 'P' COLLATE 'utf8mb4_0900_ai_ci',
	`Notes` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`LastUpdatedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`JobId`) USING BTREE,
	INDEX `FK_job_employer` (`EmployerId`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;


-- Data exporting was unselected.

-- Dumping structure for table jobseek.job_skill_map
DROP TABLE IF EXISTS `job_skill_map`;
CREATE TABLE IF NOT EXISTS `job_skill_map` (
  `JobSkillMapId` bigint(20) NOT NULL AUTO_INCREMENT,
  `JobId` bigint(20) NOT NULL,
  `SkillId` bigint(20) NOT NULL,
  PRIMARY KEY (`JobSkillMapId`),
  KEY `FK_job_skill_map_job` (`JobId`),
  KEY `FK_job_skill_map_skill` (`SkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table jobseek.skill
DROP TABLE IF EXISTS `skill`;
CREATE TABLE IF NOT EXISTS `skill` (
  `SkillId` bigint(20) NOT NULL AUTO_INCREMENT,
  `SkillName` varchar(20) NOT NULL,
  `SkillDescription` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`SkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table jobseek.state
DROP TABLE IF EXISTS `state`;
CREATE TABLE IF NOT EXISTS `state` (
  `StateId` bigint(20) NOT NULL AUTO_INCREMENT,
  `StateName` varchar(50) NOT NULL,
  `StateCode` varchar(5) NOT NULL,
  PRIMARY KEY (`StateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
