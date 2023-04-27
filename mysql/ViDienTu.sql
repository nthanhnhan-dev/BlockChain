SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=1;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=1;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `vidientu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `vidientu` ;

-- drop table ACCOUNTS;
-- drop table TRANSACTIONS;
CREATE TABLE IF NOT EXISTS `vidientu`.`ACCOUNTS` (
  `ID_User` INT NOT NULL auto_increment,
  `Account_No` VARCHAR(60) NOT NULL,
  `Owner` VARCHAR(60) NOT NULL,
  `Balance` DOUBLE NOT NULL,
  `Username`VARCHAR(20) NOT NULL,
  `Password`VARCHAR(255) NOT NULL,
  `Email`varchar(50) NOT NULL,
  `Rewards` int ,
  PRIMARY KEY (`ID_User`)
)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `vidientu`.`TRANSACTIONS` (
  `ID_Transaction` INT NOT NULL auto_increment,
  `From` INT NOT NULL,
  `To` INT NOT NULL,
  `Amount` double NOT NULL,
 
  PRIMARY KEY (`ID_Transaction`)
)
ENGINE = InnoDB;
CREATE TABLE IF NOT EXISTS `vidientu`.`BLOCK` (
  `ID_Transaction` INT NOT NULL ,
  `ID_Block` INT NOT NULL auto_increment,
  `PreHash` VARCHAR(255) NOT NULL,
  `Hash` VARBINARY(255) NOT NULL,
  `Data` VARCHAR(100) NOT NULL,
  
  PRIMARY KEY (`ID_Transaction`)
);

insert into ACCOUNTS values('1','123456789','Ryu',1000000,'ryu','$2a$10$v9ojYqWPRgd59dGi2aVUFu0vlMcHnCImJ0EPnFsIBjBKLezkhFfLi','ryu@');
insert into ACCOUNTS values('2','111111111','Jake',2000000,'jake','$2a$10$V9ua6xi7VuaT.4mLFraYQeNw/4uMVxzJZvsfvOvlkGw2XidPj7UTG','jake@');

select * from ACCOUNTS;




