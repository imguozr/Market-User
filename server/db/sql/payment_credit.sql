CREATE TABLE IF NOT EXISTS `payment_credit` (
    `payment_id`   INT(11) NOT NULL auto_increment,
    `card_type`    VARCHAR(10) NOT NULL,
    `card_number`  INT(16) NOT NULL,
    `card_name`    VARCHAR(256) NOT NULL,
    `expire_month` INT(2) NOT NULL,
    `expire_year`  INT(4) NOT NULL,
    `security_code` INT(3) NOT NULL,
    PRIMARY KEY (`payment_id`),
    FOREIGN KEY (`payment_id`)
)
engine=innodb
DEFAULT charset=utf8; 

