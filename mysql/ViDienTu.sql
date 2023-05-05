SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=1;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=1;

SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `VIDIENTU` DEFAULT CHARACTER SET UTF8MB4 COLLATE UTF8MB4_0900_AI_CI;

USE `VIDIENTU`;

-- drop table ACCOUNTS;
-- drop table TRANSACTIONS;
CREATE TABLE IF NOT EXISTS `VIDIENTU`.`ACCOUNTS` (
  `ID_USER` INT NOT NULL AUTO_INCREMENT,
  `ACCOUNT_NO` VARCHAR(60) NOT NULL,
  `OWNER` VARCHAR(60) NOT NULL,
  `BALANCE` DOUBLE NOT NULL,
  `USERNAME`VARCHAR(20) NOT NULL,
  `PASSWORD`VARCHAR(255) NOT NULL,
  `EMAIL`VARCHAR(50) NOT NULL,
  `REWARDS` INT,
  PRIMARY KEY (`ID_USER`)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `VIDIENTU`.`TRANSACTIONS` (
  `ID_TRANSACTION` INT NOT NULL AUTO_INCREMENT,
  `FROM` VARCHAR(60),
  `TO` VARCHAR(60),
  `AMOUNT` DOUBLE,
  `MESSAGE` VARCHAR(500),
  PRIMARY KEY (`ID_TRANSACTION`)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS `VIDIENTU`.`BLOCK` (
  `ID_TRANSACTION` INT,
  `ID_BLOCK` INT NOT NULL AUTO_INCREMENT,
  `PREHASH` VARCHAR(255) NOT NULL,
  `HASH` VARCHAR(255) NOT NULL,
  `TIMESTAMP`DATETIME,
  PRIMARY KEY (`ID_BLOCK`)
);

INSERT INTO ACCOUNTS VALUES(
  '1',
  '123456789',
  'Ryu',
  1000000,
  'ryu',
  '$2a$10$v9ojYqWPRgd59dGi2aVUFu0vlMcHnCImJ0EPnFsIBjBKLezkhFfLi',
  'ryu@',
  100
);

INSERT INTO ACCOUNTS VALUES(
  '2',
  '111111111',
  'Jake',
  2000000,
  'jake',
  '$2a$10$V9ua6xi7VuaT.4mLFraYQeNw/4uMVxzJZvsfvOvlkGw2XidPj7UTG',
  'jake@',
  200
);

SELECT
  *
FROM
  ACCOUNTS;

SELECT
  *
FROM
  BLOCK;

SELECT
  *
FROM
  TRANSACTIONS;