CREATE TABLE IF NOT EXISTS `user`(
    `user_id`  INT(11) NOT NULL auto_increment,
    `username` VARCHAR(255) NOT NULL distinct,
    `password` VARCHAR(255) NOT NULL,
    `token`    VARCHAR(255) DEFAULT NULL,
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `address` VARCHAR(255) DEFAULT NULL,
    `email`   VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY(`user_id`)
) 
engine=innodb 
DEFAULT charset=utf8;
