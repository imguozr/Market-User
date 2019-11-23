CREATE TABLE IF NOT EXISTS `user`(
    `user_id`  VARCHAR(50) NOT NULL auto_increment,
    `username` VARCHAR(20) NOT NULL distinct,
    `password` VARCHAR(20) NOT NULL,
    `token`    VARCHAR(255) DEFAULT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `address` VARCHAR(255) DEFAULT NULL,
    `email`   VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY(`user_id`)
) 
engine=innodb 
DEFAULT charset=utf8;
