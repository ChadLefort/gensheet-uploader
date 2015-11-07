CREATE DATABASE  IF NOT EXISTS `hulls`
USE `hulls`;

DROP TABLE IF EXISTS `hulls`;
CREATE TABLE `hulls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL,
  `name` varchar(100) DEFAULT 'No Name',
  `gensheet` varchar(100) NOT NULL,
  `image` varchar(100) DEFAULT 'placeholder.png',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `search` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=latin1;