CREATE TABLE IF NOT EXISTS `user_payment`(
    `user_id`      INT(11) NOT NULL auto_increment,
    `payment_type` VARCHAR(10) NOT NULL,
    `payment_id`   INT(11) NOT NULL auto_increment,
    `payment_nickname` VARCHAR(256),
    PRIMARY KEY(`user_id`, `payment_id`),
    FOREIGN KEY(`user_id`)
) 
engine=innodb 
DEFAULT charset=utf8; 
