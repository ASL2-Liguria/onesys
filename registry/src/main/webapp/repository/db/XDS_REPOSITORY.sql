-- phpMyAdmin SQL Dump
-- version 2.10.3deb1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generato il: 21 Nov, 2007 at 11:51 AM
-- Versione MySQL: 5.0.45
-- Versione PHP: 5.2.3-1ubuntu6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `ELCO_XDS_REPOSITORY`
-- 

-- --------------------------------------------------------

-- 
-- Struttura della tabella `ATNA`
-- 

CREATE TABLE IF NOT EXISTS `ATNA` (
  `ID` int(11) NOT NULL auto_increment,
  `HOST` varchar(100) NOT NULL default '',
  `PORT` varchar(20) NOT NULL default '',
  `ACTIVE` char(1) NOT NULL default 'A',
  `DESCRIPTION` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`ID`),
  KEY `ACTIVE` (`ACTIVE`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- 
-- Dump dei dati per la tabella `ATNA`
-- 

INSERT INTO `ATNA` (`ID`, `HOST`, `PORT`, `ACTIVE`, `DESCRIPTION`) VALUES 
(1, '10.135.0.91', '4000', 'O', 'ATNA NODE');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `AUDITABLEEVENT`
-- 

CREATE TABLE IF NOT EXISTS `AUDITABLEEVENT` (
  `ID` int(64) NOT NULL auto_increment,
  `OBJECTTYPE` varchar(32) default 'AuditableEvent',
  `EVENTTYPE` varchar(128) NOT NULL default '',
  `REGISTRYOBJECT` varchar(255) NOT NULL default '',
  `TIME_STAMP` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `SOURCE` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `AUDITABLEEVENT`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `CONFIG`
-- 


CREATE TABLE IF NOT EXISTS `CONFIG` (
  `WWW` varchar(100) NOT NULL default '',
  `LOG` char(1) NOT NULL default '0',
  `CACHE` char(1) NOT NULL default '0',
  `FILES` char(1) NOT NULL default '0',
  `JAVA_PATH` varchar(255) NOT NULL,
  `UNIQUEID` varchar(100) NOT NULL,
  PRIMARY KEY  (`WWW`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `CONFIG`
-- 

INSERT INTO `CONFIG` (`WWW`, `LOG`, `CACHE`, `FILES`, `JAVA_PATH`, `UNIQUEID`) VALUES 
('/ELCO_XDS/repository-a/', 'A', 'O', 'H', '', '');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `DOCUMENTS`
-- 

CREATE TABLE IF NOT EXISTS `DOCUMENTS` (
  `KEY_PROG` int(11) NOT NULL auto_increment,
  `XDSDOCUMENTENTRY_UNIQUEID` varchar(255) NOT NULL default '',
  `DATA` datetime NOT NULL default '0000-00-00 00:00:00',
  `URI` varchar(128) NOT NULL,
  PRIMARY KEY  (`KEY_PROG`),
  KEY `XDSDOCUMENTENTRY_UNIQUEID` (`XDSDOCUMENTENTRY_UNIQUEID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `DOCUMENTS`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `HTTP`
-- 

CREATE TABLE IF NOT EXISTS `HTTP` (
  `HTTPD` varchar(20) NOT NULL default '',
  `ACTIVE` char(1) NOT NULL default 'O',
  KEY `ACTIVE` (`ACTIVE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `HTTP`
-- 

INSERT INTO `HTTP` (`HTTPD`, `ACTIVE`) VALUES 
('TLS', 'O'),
('NORMAL', 'A');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `KNOWN_SOUCES_IDS`
-- 

CREATE TABLE IF NOT EXISTS `KNOWN_SOUCES_IDS` (
  `ID` int(20) NOT NULL auto_increment,
  `XDSSUBMISSIONSET_SOURCEID` varchar(255) NOT NULL default '',
  `SOURCE_DESCRIPTION` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`ID`,`XDSSUBMISSIONSET_SOURCEID`),
  KEY `VALUE` (`XDSSUBMISSIONSET_SOURCEID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=34 ;

-- 
-- Dump dei dati per la tabella `KNOWN_SOUCES_IDS`
-- 

INSERT INTO `KNOWN_SOUCES_IDS` (`ID`, `XDSSUBMISSIONSET_SOURCEID`, `SOURCE_DESCRIPTION`) VALUES 
(31, 'DCM4CHEE', 'DCM4CHEE'),
(32, 'testkit', 'testkit'),
(33, 'Script_source', 'Script_source');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `MIMETYPE`
-- 

CREATE TABLE IF NOT EXISTS `MIMETYPE` (
  `CODE` varchar(255) NOT NULL default '',
  `EXTENSION` varchar(125) NOT NULL default '',
  KEY `CODE` (`CODE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `MIMETYPE`
-- 

INSERT INTO `MIMETYPE` (`CODE`, `EXTENSION`) VALUES 
('application/pdf', 'pdf'),
('text/x-cda-r2+xml', 'xml'),
('text/xml', 'xml'),
('application/x-hl7', 'hl7'),
('application/dicom', 'dcm'),
('text/plain', 'txt'),
('multipart/related', 'mr'),
('text/x-cdar2+xml', 'xml');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `REGISTRY`
-- 

CREATE TABLE IF NOT EXISTS `REGISTRY` (
  `ID` bigint(30) NOT NULL auto_increment,
  `HOST` varchar(250) NOT NULL default '',
  `PORT` int(100) NOT NULL default '0',
  `PATH` varchar(255) NOT NULL default '',
  `ACTIVE` char(1) NOT NULL default 'O',
  `HTTP` varchar(30) NOT NULL default 'NORMAL',
  `SERVICE` varchar(255) NOT NULL default 'SUBMISSION',
  `DESCRIPTION` text NOT NULL,
  PRIMARY KEY  (`ID`),
  KEY `ACTIVE` (`ACTIVE`),
  KEY `SERVICE` (`SERVICE`),
  KEY `HTTP` (`HTTP`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- 
-- Dump dei dati per la tabella `REGISTRY`
-- 

INSERT INTO `REGISTRY` (`ID`, `HOST`, `PORT`, `PATH`, `ACTIVE`, `HTTP`, `SERVICE`, `DESCRIPTION`) VALUES 
(1, '10.135.0.92', 80, '/ELCO_XDS/registry-b/registry.php', 'A', 'NORMAL', 'SUBMISSION', 'REGISTRY');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `REPOSITORY`
-- 

CREATE TABLE IF NOT EXISTS `REPOSITORY` (
  `ID` bigint(30) NOT NULL auto_increment,
  `HOST` varchar(250) NOT NULL default '',
  `PORT` int(100) NOT NULL default '80',
  `SERVICE` varchar(255) NOT NULL default '',
  `ACTIVE` char(1) NOT NULL default 'A',
  `HTTP` varchar(30) NOT NULL default 'NORMAL',
  PRIMARY KEY  (`ID`),
  KEY `SERVICE` (`SERVICE`,`ACTIVE`),
  KEY `HTTP` (`HTTP`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- 
-- Dump dei dati per la tabella `REPOSITORY`
-- 

INSERT INTO `REPOSITORY` (`ID`, `HOST`, `PORT`, `SERVICE`, `ACTIVE`, `HTTP`) VALUES 
(1, '10.135.0.92', 80, 'SUBMISSION', 'A', 'NORMAL');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `USERS`
-- 

CREATE TABLE IF NOT EXISTS `USERS` (
  `LOGIN` varchar(30) NOT NULL default '',
  `PASSWORD` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`LOGIN`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `USERS`
-- 

INSERT INTO `USERS` (`LOGIN`, `PASSWORD`) VALUES 
('xds', 'xdSwGC7.aBWxk');
