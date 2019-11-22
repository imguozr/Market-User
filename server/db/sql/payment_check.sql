CREATE TABLE IF NOT EXISTS `payment_check` (
    `payment_id`     INT(11) NOT NULL auto_increment,
    `account_type`   VARCHAR(10) NOT NULL,
    `account_name`   VARCHAR(256) NOT NULL,
    `account_number` INT(10) NOT NULL,
    `routing_number` INT(10) NOT NULL,
    PRIMARY KEY (`payment_id`),
    FOREIGN KEY(`payment_id`)
)
engine=innodb
DEFAULT charset=utf8; 
