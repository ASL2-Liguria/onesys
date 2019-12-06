-- phpMyAdmin SQL Dump
-- version 2.10.3deb1ubuntu0.2
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generato il: 05 Giu, 2008 at 11:47 AM
-- Versione MySQL: 5.0.45
-- Versione PHP: 5.2.3-1ubuntu6.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `ELCO_XDS_REGISTRY`
-- 

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Association`
-- 

CREATE TABLE IF NOT EXISTS `Association` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(128) NOT NULL default '',
  `objectType` varchar(32) default 'Association',
  `associationType` varchar(128) NOT NULL default '',
  `sourceObject` varchar(64) NOT NULL default '',
  `targetObject` varchar(128) NOT NULL default '',
  `isConfirmedBySourceOwner` tinyint(1) NOT NULL default '0',
  `isConfirmedByTargetOwner` tinyint(1) NOT NULL default '0',
  PRIMARY KEY  (`key_prog`,`id`),
  KEY `targetObject` (`targetObject`),
  KEY `sourceObject` (`sourceObject`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `Association`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ATNA`
-- 

CREATE TABLE IF NOT EXISTS `ATNA` (
  `ID` int(11) NOT NULL auto_increment,
  `host` varchar(100) NOT NULL default '',
  `port` varchar(20) NOT NULL default '',
  `ACTIVE` char(1) NOT NULL default 'A',
  `DESCRIPTION` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`ID`),
  KEY `ACTIVE` (`ACTIVE`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- 
-- Dump dei dati per la tabella `ATNA`
-- 

INSERT INTO `ATNA` (`ID`, `host`, `port`, `ACTIVE`, `DESCRIPTION`) VALUES 
(1, '172.18.8.67', '4000', 'O', 'ATNA REGISTRY');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `AuditableEvent`
-- 

CREATE TABLE IF NOT EXISTS `AuditableEvent` (
  `id` int(64) NOT NULL auto_increment,
  `objectType` varchar(32) default 'AuditableEvent',
  `eventType` varchar(128) NOT NULL default '',
  `registryObject` varchar(64) NOT NULL default '',
  `timeStamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `Source` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `AuditableEvent`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `classCode`
-- 

CREATE TABLE IF NOT EXISTS `classCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `classCode`
-- 

INSERT INTO `classCode` (`code`, `display`, `codingScheme`) VALUES 
('Communication', 'Communication', 'Connect-a-thon classCodes'),
('Evaluation and management', 'Evaluation and management', 'Connect-a-thon classCodes'),
('Conference', 'Conference', 'Connect-a-thon classCodes'),
('Case conference', 'Case conference', 'Connect-a-thon classCodes'),
('Consult', 'Consult', 'Connect-a-thon classCodes'),
('Confirmatory consultation', 'Confirmatory consultation', 'Connect-a-thon classCodes'),
('Counseling', 'Counseling', 'Connect-a-thon classCodes'),
('Group counseling', 'Group counseling', 'Connect-a-thon classCodes'),
('Education', 'Education', 'Connect-a-thon classCodes'),
('History and Physical', 'History and Physical', 'Connect-a-thon classCodes'),
('Admission history and physical', 'Admission history and physical', 'Connect-a-thon classCodes'),
('Comprehensive history and physical', 'Comprehensive history and physical', 'Connect-a-thon classCodes'),
('Targeted history and physical', 'Targeted history and physical', 'Connect-a-thon classCodes'),
('Initial evaluation', 'Initial evaluation', 'Connect-a-thon classCodes'),
('Admission evaluation', 'Admission evaluation', 'Connect-a-thon classCodes'),
('Pre-operative evaluation and management', 'Pre-operative evaluation and management', 'Connect-a-thon classCodes'),
('Subsequent evaluation', 'Subsequent evaluation', 'Connect-a-thon classCodes'),
('Summarization of episode', 'Summarization of episode', 'Connect-a-thon classCodes'),
('Transfer summarization', 'Transfer summarization', 'Connect-a-thon classCodes'),
('Discharge summarization', 'Discharge summarization', 'Connect-a-thon classCodes'),
('Summary of death', 'Summary of death', 'Connect-a-thon classCodes'),
('Transfer of care referral', 'Transfer of care referral', 'Connect-a-thon classCodes'),
('Supervisory direction', 'Supervisory direction', 'Connect-a-thon classCodes'),
('Telephone encounter', 'Telephone encounter', 'Connect-a-thon classCodes'),
('Interventional Procedure', 'Interventional Procedure', 'Connect-a-thon classCodes'),
('Operative', 'Operative', 'Connect-a-thon classCodes'),
('Pathology Procedure', 'Pathology Procedure', 'Connect-a-thon classCodes'),
('Autopsy', 'Autopsy', 'Connect-a-thon classCodes');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Classification`
-- 

CREATE TABLE IF NOT EXISTS `Classification` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(128) NOT NULL default '',
  `objectType` varchar(32) default 'Classification',
  `classificationNode` varchar(64) default NULL,
  `classificationScheme` varchar(128) default NULL,
  `classifiedObject` varchar(128) NOT NULL default '',
  `nodeRepresentation` varchar(128) NOT NULL default 'Radiology',
  PRIMARY KEY  (`key_prog`),
  KEY `classifiedObject` (`classifiedObject`,`nodeRepresentation`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `Classification`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ClassificationNode`
-- 

CREATE TABLE IF NOT EXISTS `ClassificationNode` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'ClassificationNode',
  `code` varchar(64) default NULL,
  `parent` varchar(64) default NULL,
  `path` varchar(255) default NULL,
  `Name_value` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `ClassificationNode`
-- 

INSERT INTO `ClassificationNode` (`accessControlPolicy`, `id`, `objectType`, `code`, `parent`, `path`, `Name_value`) VALUES 
(NULL, 'urn:uuid:415715f1-fc0b-47c4-90e5-c180b7b82db6', 'ClassificationNode', 'XDS', 'urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb', '/urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb/XDS', 'XDS object type'),
(NULL, 'urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1', 'ClassificationNode', 'XDSDocumentEntry', 'urn:uuid:415715f1-fc0b-47c4-90e5-c180b7b82db6', '/urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb/XDS/XDSDocumentEntry', 'XDSDocumentEntry'),
(NULL, 'urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd', 'ClassificationNode', 'XDSSubmissionSet', 'urn:uuid:415715f1-fc0b-47c4-90e5-c180b7b82db6', '/urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb/XDS/XDSSubmissionSet', 'XDSSubmissionSet'),
(NULL, 'urn:uuid:d9d542f3-6cc4-48b6-8870-ea235fbc94c2', 'ClassificationNode', 'XDSFolder', 'urn:uuid:415715f1-fc0b-47c4-90e5-c180b7b82db6', '/urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb/XDS/XDSFolder', 'XDSFolder'),
(NULL, 'urn:uuid:10aa1a4b-715a-4120-bfd0-9760414112c8', 'ClassificationNode', 'XDSDocumentEntryStub', 'urn:uuid:415715f1-fc0b-47c4-90e5-c180b7b82db6', '/urn:uuid:3188a449-18ac-41fb-be9f-99a1adca02cb/XDS/XDSDocumentEntryStub', 'XDSDocumentEntryStub'),
(NULL, 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', 'ClassificationNode', 'XDS', 'urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS', 'XDS'),
(NULL, 'urn:uuid:917dc511-f7da-4417-8664-de25b34d3def', 'ClassificationNode', 'APND', 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS/APND', 'APND'),
(NULL, 'urn:uuid:60fd13eb-b8f6-4f11-8f28-9ee000184339', 'ClassificationNode', 'RPLC', 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS/RPLC', 'RPLC'),
(NULL, 'urn:uuid:ede379e6-1147-4374-a943-8fcdcf1cd620', 'ClassificationNode', 'XFRM', 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS/XFRM', 'XFRM'),
(NULL, 'urn:uuid:b76a27c7-af3c-4319-ba4c-b90c1dc45408', 'ClassificationNode', 'XFRM_RPLC', 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS/XFRM_RPLC', 'XFRM_RPLC'),
(NULL, 'urn:uuid:8ea93462-ad05-4cdc-8e54-a8084f6aff94', 'ClassificationNode', 'signs', 'urn:uuid:f9653189-fdd2-4c31-afbc-86c96ac8f0ad', '/urn:uuid:6902675f-2f18-44b8-888b-c91db8b96b4d/XDS/signs', 'signs');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `ClassificationScheme`
-- 

CREATE TABLE IF NOT EXISTS `ClassificationScheme` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'ClassificationScheme',
  `expiration` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `majorVersion` int(11) NOT NULL default '1',
  `minorVersion` int(11) NOT NULL default '0',
  `stability` varchar(128) default NULL,
  `status` varchar(128) NOT NULL default '',
  `userVersion` varchar(64) default NULL,
  `isInternal` tinyint(1) NOT NULL default '0',
  `nodeType` varchar(32) NOT NULL default 'UniqueCode',
  `Name_value` varchar(255) NOT NULL default '',
  `Description_value` text NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `Name_value` (`Name_value`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `ClassificationScheme`
-- 

INSERT INTO `ClassificationScheme` (`accessControlPolicy`, `id`, `objectType`, `expiration`, `majorVersion`, `minorVersion`, `stability`, `status`, `userVersion`, `isInternal`, `nodeType`, `Name_value`, `Description_value`) VALUES 
(NULL, 'urn:uuid:554ac39e-e3fe-47fe-b233-965d2a147832', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSSubmissionSet.sourceId', ''),
(NULL, 'urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSSubmissionSet.patientId', ''),
(NULL, 'urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSDocumentEntry.patientId', ''),
(NULL, 'urn:uuid:f64ffdf0-4b97-4e06-b79f-a52b38ec2f8a', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSFolder.patientId', ''),
(NULL, 'urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSDocumentEntry.uniqueId', ''),
(NULL, 'urn:uuid:75df8f67-9973-4fbe-a900-df66cefecc5a', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSFolder.uniqueId', ''),
(NULL, 'urn:uuid:96fdda7c-d067-4183-912e-bf5ee74998a8', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 1, 'EmbeddedPath', 'XDSSubmissionSet.uniqueId', ''),
(NULL, 'urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.classCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.confidentialityCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:2c6b8cb7-8b2a-4051-b291-b1ae6a575ef4', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.eventCodeList', 'An XDSDocumentEntry may have zero or more Classification of this type.'),
(NULL, 'urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.formatCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.healthCareFacilityTypeCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.practiceSettingCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:f0306f51-975f-434e-a61c-c59651d33983', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.typeCode', 'An XDSDocumentEntry must have exactly one Classification of this type.'),
(NULL, 'urn:uuid:aa543740-bdda-424e-8c96-df4873be8500', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSSubmissionSet.contentTypeCode', ''),
(NULL, 'urn:uuid:1ba97051-7806-41a8-a48b-8fce7af683c5', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSFolder.codeList', ''),
(NULL, 'urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSSubmissionSet.authorDescription', ''),
(NULL, 'urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d', 'ClassificationScheme', '2007-05-15 14:38:58', 1, 0, NULL, '', NULL, 0, 'EmbeddedPath', 'XDSDocumentEntry.authorDescription', '');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `classScheme`
-- 

CREATE TABLE IF NOT EXISTS `classScheme` (
  `class_Scheme` varchar(255) NOT NULL default '',
  `name` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`class_Scheme`),
  KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `classScheme`
-- 

INSERT INTO `classScheme` (`class_Scheme`, `name`) VALUES 
('urn:uuid:aa543740-bdda-424e-8c96-df4873be8500', 'contentTypeCode'),
('urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a', 'classCode'),
('urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f', 'confidentialityCode'),
('urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d', 'formatCode'),
('urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1', 'healthcareFacilityTypeCode'),
('urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead', 'practiceSettingCode'),
('urn:uuid:1ba97051-7806-41a8-a48b-8fce7af683c5', 'codeList'),
('urn:uuid:f0306f51-975f-434e-a61c-c59651d33983', 'typeCode'),
('', 'mimeType');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `codeList`
-- 

CREATE TABLE IF NOT EXISTS `codeList` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `codeList`
-- 

INSERT INTO `codeList` (`code`, `display`, `codingScheme`) VALUES 
('Anesthesia', 'Anesthesia', 'Connect-a-thon codeList'),
('Cardiology', 'Cardiology', 'Connect-a-thon codeList'),
('Case Manager', 'Case Manager', 'Connect-a-thon codeList'),
('Chaplain', 'Chaplain', 'Connect-a-thon codeList'),
('Chemotherapy', 'Chemotherapy', 'Connect-a-thon codeList'),
('Chiropractic', 'Chiropractic', 'Connect-a-thon codeList'),
('Critical Care', 'Critical Care', 'Connect-a-thon codeList'),
('Dentistry', 'Dentistry', 'Connect-a-thon codeList'),
('Diabetology', 'Diabetology', 'Connect-a-thon codeList'),
('Dialysis', 'Dialysis', 'Connect-a-thon codeList'),
('Emergency', 'Emergency', 'Connect-a-thon codeList'),
('Endocrinology', 'Endocrinology', 'Connect-a-thon codeList'),
('Gastroenterology', 'Gastroenterology', 'Connect-a-thon codeList'),
('General Medicine', 'General Medicine', 'Connect-a-thon codeList'),
('General Surgery', 'General Surgery', 'Connect-a-thon codeList'),
('Gynecology', 'Gynecology', 'Connect-a-thon codeList'),
('Labor and Delivery', 'Labor and Delivery', 'Connect-a-thon codeList'),
('Laboratory', 'Laboratory', 'Connect-a-thon codeList'),
('Multidisciplinary', 'Multidisciplinary', 'Connect-a-thon codeList'),
('Neonatal Intensive Care', 'Neonatal Intensive Care', 'Connect-a-thon codeList'),
('Neurosurgery', 'Neurosurgery', 'Connect-a-thon codeList'),
('Nursery', 'Nursery', 'Connect-a-thon codeList'),
('Nursing', 'Nursing', 'Connect-a-thon codeList'),
('Obstetrics', 'Obstetrics', 'Connect-a-thon codeList'),
('Occupational Therapy', 'Occupational Therapy', 'Connect-a-thon codeList'),
('Ophthalmology', 'Ophthalmology', 'Connect-a-thon codeList'),
('Optometry', 'Optometry', 'Connect-a-thon codeList'),
('Orthopedics', 'Orthopedics', 'Connect-a-thon codeList'),
('Otorhinolaryngology', 'Otorhinolaryngology', 'Connect-a-thon codeList'),
('Pathology', 'Pathology', 'Connect-a-thon codeList'),
('Perioperative', 'Perioperative', 'Connect-a-thon codeList'),
('Pharmacacy', 'Pharmacacy', 'Connect-a-thon codeList'),
('Physical Medicine', 'Physical Medicine', 'Connect-a-thon codeList'),
('Plastic Surgery', 'Plastic Surgery', 'Connect-a-thon codeList'),
('Podiatry', 'Podiatry', 'Connect-a-thon codeList'),
('Psychiatry', 'Psychiatry', 'Connect-a-thon codeList'),
('Pulmonary', 'Pulmonary', 'Connect-a-thon codeList'),
('Radiology', 'Radiology', 'Connect-a-thon codeList'),
('Social Services', 'Social Services', 'Connect-a-thon codeList'),
('Speech Therapy', 'Speech Therapy', 'Connect-a-thon codeList'),
('Thyroidology', 'Thyroidology', 'Connect-a-thon codeList'),
('Tumor Board', 'Tumor Board', 'Connect-a-thon codeList'),
('Urology', 'Urology', 'Connect-a-thon codeList'),
('Veterinary Medicine', 'Veterinary Medicine', 'Connect-a-thon codeList');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `confidentialityCode`
-- 

CREATE TABLE IF NOT EXISTS `confidentialityCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `confidentialityCode`
-- 

INSERT INTO `confidentialityCode` (`code`, `display`, `codingScheme`) VALUES 
('C', 'Celebrity', 'Connect-a-thon confidentialityCodes'),
('D', 'Clinician', 'Connect-a-thon confidentialityCodes'),
('I', 'Individual', 'Connect-a-thon confidentialityCodes'),
('N', 'Normal', 'Connect-a-thon confidentialityCodes'),
('R', 'Restricted', 'Connect-a-thon confidentialityCodes'),
('S', 'Sensitive', 'Connect-a-thon confidentialityCodes'),
('T', 'Taboo', 'Connect-a-thon confidentialityCodes');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `CONFIG`
-- 

CREATE TABLE IF NOT EXISTS `CONFIG` (
  `CACHE` char(1) NOT NULL default '',
  `PATIENTID` char(1) NOT NULL default '',
  `LOG` char(1) NOT NULL,
  `STAT` char(1) NOT NULL,
  `FOLDER` char(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `CONFIG`
-- 

INSERT INTO `CONFIG` (`CACHE`, `PATIENTID`, `LOG`, `STAT`, `FOLDER`) VALUES 
('H', 'O', 'A', 'A', 'O');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `contentTypeCode`
-- 

CREATE TABLE IF NOT EXISTS `contentTypeCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `contentTypeCode`
-- 

INSERT INTO `contentTypeCode` (`code`, `display`, `codingScheme`) VALUES 
('Communication', 'Communication', 'Connect-a-thon contentTypeCodes'),
('Evaluation and management', 'Evaluation and management', 'Connect-a-thon contentTypeCodes'),
('Conference', 'Conference', 'Connect-a-thon contentTypeCodes'),
('Case conference', 'Case conference', 'Connect-a-thon contentTypeCodes'),
('Consult', 'Consult', 'Connect-a-thon contentTypeCodes'),
('Confirmatory consultation', 'Confirmatory consultation', 'Connect-a-thon contentTypeCodes'),
('Counseling', 'Counseling', 'Connect-a-thon contentTypeCodes'),
('Group counseling', 'Group counseling', 'Connect-a-thon contentTypeCodes'),
('Education', 'Education', 'Connect-a-thon contentTypeCodes'),
('History and Physical', 'History and Physical', 'Connect-a-thon contentTypeCodes'),
('Admission history and physical', 'Admission history and physical', 'Connect-a-thon contentTypeCodes'),
('Comprehensive history and physical', 'Comprehensive history and physical', 'Connect-a-thon contentTypeCodes'),
('Targeted history and physical', 'Targeted history and physical', 'Connect-a-thon contentTypeCodes'),
('Initial evaluation', 'Initial evaluation', 'Connect-a-thon contentTypeCodes'),
('Admission evaluation', 'Admission evaluation', 'Connect-a-thon contentTypeCodes'),
('Pre-operative evaluation and management', 'Pre-operative evaluation and management', 'Connect-a-thon contentTypeCodes'),
('Subsequent evaluation', 'Subsequent evaluation', 'Connect-a-thon contentTypeCodes'),
('Summarization of episode', 'Summarization of episode', 'Connect-a-thon contentTypeCodes'),
('Transfer summarization', 'Transfer summarization', 'Connect-a-thon contentTypeCodes'),
('Discharge summarization', 'Discharge summarization', 'Connect-a-thon contentTypeCodes'),
('Summary of death', 'Summary of death', 'Connect-a-thon contentTypeCodes'),
('Transfer of care referral', 'Transfer of care referral', 'Connect-a-thon contentTypeCodes'),
('Supervisory direction', 'Supervisory direction', 'Connect-a-thon contentTypeCodes'),
('Telephone encounter', 'Telephone encounter', 'Connect-a-thon contentTypeCodes'),
('Interventional Procedure', 'Interventional Procedure', 'Connect-a-thon contentTypeCodes'),
('Operative', 'Operative', 'Connect-a-thon contentTypeCodes'),
('Pathology Procedure', 'Pathology Procedure', 'Connect-a-thon contentTypeCodes'),
('Autopsy', 'Autopsy', 'Connect-a-thon contentTypeCodes');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Counters`
-- 

CREATE TABLE IF NOT EXISTS `Counters` (
  `id` bigint(255) NOT NULL default '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `Counters`
-- 

INSERT INTO `Counters` (`id`) VALUES 
(0);

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Description`
-- 

CREATE TABLE IF NOT EXISTS `Description` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `charset` varchar(32) default NULL,
  `lang` varchar(32) NOT NULL default 'it-it',
  `value` varchar(255) NOT NULL default '',
  `parent` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`key_prog`,`lang`,`value`,`parent`),
  KEY `parent` (`parent`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `Description`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `EmailAddress`
-- 

CREATE TABLE IF NOT EXISTS `EmailAddress` (
  `address` varchar(64) NOT NULL default '',
  `type` varchar(32) default NULL,
  `parent` varchar(64) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `EmailAddress`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ExternalIdentifier`
-- 

CREATE TABLE IF NOT EXISTS `ExternalIdentifier` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(128) NOT NULL default '',
  `objectType` varchar(32) default 'ExternalIdentifier',
  `registryObject` varchar(128) NOT NULL default '',
  `identificationScheme` varchar(128) NOT NULL default '',
  `value` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`key_prog`),
  KEY `value` (`value`),
  KEY `registryObject` (`registryObject`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `ExternalIdentifier`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ExternalLink`
-- 

CREATE TABLE IF NOT EXISTS `ExternalLink` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'ExternalLink',
  `externalURI` varchar(255) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `ExternalLink`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ExtrinsicObject`
-- 

CREATE TABLE IF NOT EXISTS `ExtrinsicObject` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(128) NOT NULL default '',
  `objectType` varchar(128) default 'text/xml',
  `expiration` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `majorVersion` int(11) NOT NULL default '0',
  `minorVersion` int(11) NOT NULL default '1',
  `stability` varchar(128) default NULL,
  `status` varchar(128) NOT NULL default '',
  `userVersion` varchar(64) default NULL,
  `isOpaque` tinyint(1) NOT NULL default '0',
  `mimeType` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`key_prog`,`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `ExtrinsicObject`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `formatCode`
-- 

CREATE TABLE IF NOT EXISTS `formatCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `formatCode`
-- 

INSERT INTO `formatCode` (`code`, `display`, `codingScheme`) VALUES 
('PDF/IHE 1.x', 'PDF/IHE 1.x', 'Connect-a-thon formatCodes'),
('CDA/IHE 1.0', 'CDA/IHE 1.0', 'Connect-a-thon formatCodes'),
('CDAR2/IHE 1.0', 'CDAR2/IHE 1.0', 'Connect-a-thon formatCodes'),
('CCR/IHE 0.9', 'CCR/IHE 0.9', 'Connect-a-thon formatCodes'),
('HL7/Lab 2.5', 'HL7/Lab 2.5', 'Connect-a-thon formatCodes'),
('IHE/PCC/MS/1.0', 'XDS-MS', 'Connect-a-thon formatCodes'),
('IHE/multipart', 'multipart', 'Connect-a-thon formatCodes'),
('1.2.840.10008.5.1.4.1.1.88.59', 'Key Object Selection Document', '1.2.840.10008.2.6.1');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `healthcareFacilityTypeCode`
-- 

CREATE TABLE IF NOT EXISTS `healthcareFacilityTypeCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `healthcareFacilityTypeCode`
-- 

INSERT INTO `healthcareFacilityTypeCode` (`code`, `display`, `codingScheme`) VALUES 
('Home', 'Home', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Assisted Living', 'Assisted Living', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Home Health Care', 'Home Health Care', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Hospital Setting', 'Hospital Setting', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Acute care hospital', 'Acute care hospital', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Hospital Unit', 'Hospital Unit', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Critical Care Unit', 'Critical Care Unit', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Emergency Department', 'Emergency Department', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Observation Ward', 'Observation Ward', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Rehabilitation hospital', 'Rehabilitation hospital', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Nursing Home', 'Nursing Home', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Skilled Nursing Facility', 'Skilled Nursing Facility', 'Connect-a-thon healthcareFacilityTypeCodes'),
('Outpatient', 'Outpatient', 'Connect-a-thon healthcareFacilityTypeCodes');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `HL7_MESSAGES`
-- 

CREATE TABLE IF NOT EXISTS `HL7_MESSAGES` (
  `IDMESSAGE` bigint(20) NOT NULL auto_increment,
  `TEXT` longtext,
  `ACK` varchar(255) default NULL,
  `RECEIVED` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `STATUS` char(1) NOT NULL default 'R',
  `ACKED` timestamp NOT NULL default '0000-00-00 00:00:00',
  PRIMARY KEY  (`IDMESSAGE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `HL7_MESSAGES`
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
('NORMAL', 'A');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `mimeType`
-- 

CREATE TABLE IF NOT EXISTS `mimeType` (
  `code` varchar(255) NOT NULL default '',
  KEY `code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `mimeType`
-- 

INSERT INTO `mimeType` (`code`) VALUES 
('application/dicom'),
('application/pdf'),
('application/x-hl7'),
('multipart/related'),
('text/plain'),
('text/x-cda-r2+xml'),
('text/xml');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Name`
-- 

CREATE TABLE IF NOT EXISTS `Name` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `charset` varchar(32) default NULL,
  `lang` varchar(32) NOT NULL default 'it-it',
  `value` varchar(255) NOT NULL default '',
  `parent` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`key_prog`),
  KEY `parent` (`parent`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `Name`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `NAV`
-- 

CREATE TABLE IF NOT EXISTS `NAV` (
  `NAV` char(1) NOT NULL default '',
  `NAV_FROM` varchar(100) NOT NULL default '',
  `NAV_TO` varchar(100) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `NAV`
-- 

INSERT INTO `NAV` (`NAV`, `NAV_FROM`, `NAV_TO`) VALUES 
('O', 'xxx@email.com', 'yyy@email.com');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `Organization`
-- 

CREATE TABLE IF NOT EXISTS `Organization` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'Organization',
  `parent` varchar(64) default NULL,
  `primaryContact` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `Organization`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `Patient`
-- 

CREATE TABLE IF NOT EXISTS `Patient` (
  `ID` int(11) NOT NULL auto_increment,
  `PID3` varchar(255) NOT NULL default '',
  `InsertDate` datetime NOT NULL default '0000-00-00 00:00:00',
  `UpdateDate` datetime default NULL,
  `PriorPID3` varchar(128) default NULL,
  PRIMARY KEY  (`ID`),
  KEY `PID3` (`PID3`),
  KEY `PriorPID3` (`PriorPID3`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;


-- --------------------------------------------------------

-- 
-- Struttura della tabella `PostalAddress`
-- 

CREATE TABLE IF NOT EXISTS `PostalAddress` (
  `city` varchar(64) default NULL,
  `country` varchar(64) default NULL,
  `postalCode` varchar(64) default NULL,
  `state` varchar(64) default NULL,
  `street` varchar(64) default NULL,
  `streetNumber` varchar(32) default NULL,
  `parent` varchar(64) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `PostalAddress`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `practiceSettingCode`
-- 

CREATE TABLE IF NOT EXISTS `practiceSettingCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `practiceSettingCode`
-- 

INSERT INTO `practiceSettingCode` (`code`, `display`, `codingScheme`) VALUES 
('Anesthesia', 'Anesthesia', 'Connect-a-thon practiceSettingCodes'),
('Cardiology', 'Cardiology', 'Connect-a-thon practiceSettingCodes'),
('Case Manager', 'Case Manager', 'Connect-a-thon practiceSettingCodes'),
('Chaplain', 'Chaplain', 'Connect-a-thon practiceSettingCodes'),
('Chemotherapy', 'Chemotherapy', 'Connect-a-thon practiceSettingCodes'),
('Chiropractic', 'Chiropractic', 'Connect-a-thon practiceSettingCodes'),
('Critical Care', 'Critical Care', 'Connect-a-thon practiceSettingCodes'),
('Dentistry', 'Dentistry', 'Connect-a-thon practiceSettingCodes'),
('Diabetology', 'Diabetology', 'Connect-a-thon practiceSettingCodes'),
('Dialysis', 'Dialysis', 'Connect-a-thon practiceSettingCodes'),
('Emergency', 'Emergency', 'Connect-a-thon practiceSettingCodes'),
('Endocrinology', 'Endocrinology', 'Connect-a-thon practiceSettingCodes'),
('Gastroenterology', 'Gastroenterology', 'Connect-a-thon practiceSettingCodes'),
('General Medicine', 'General Medicine', 'Connect-a-thon practiceSettingCodes'),
('General Surgery', 'General Surgery', 'Connect-a-thon practiceSettingCodes'),
('Gynecology', 'Gynecology', 'Connect-a-thon practiceSettingCodes'),
('Labor and Delivery', 'Labor and Delivery', 'Connect-a-thon practiceSettingCodes'),
('Laboratory', 'Laboratory', 'Connect-a-thon practiceSettingCodes'),
('Multidisciplinary', 'Multidisciplinary', 'Connect-a-thon practiceSettingCodes'),
('Neonatal Intensive Care', 'Neonatal Intensive Care', 'Connect-a-thon practiceSettingCodes'),
('Neurosurgery', 'Neurosurgery', 'Connect-a-thon practiceSettingCodes'),
('Nursery', 'Nursery', 'Connect-a-thon practiceSettingCodes'),
('Nursing', 'Nursing', 'Connect-a-thon practiceSettingCodes'),
('Obstetrics', 'Obstetrics', 'Connect-a-thon practiceSettingCodes'),
('Occupational Therapy', 'Occupational Therapy', 'Connect-a-thon practiceSettingCodes'),
('Ophthalmology', 'Ophthalmology', 'Connect-a-thon practiceSettingCodes'),
('Optometry', 'Optometry', 'Connect-a-thon practiceSettingCodes'),
('Orthopedics', 'Orthopedics', 'Connect-a-thon practiceSettingCodes'),
('Otorhinolaryngology', 'Otorhinolaryngology', 'Connect-a-thon practiceSettingCodes'),
('Pathology', 'Pathology', 'Connect-a-thon practiceSettingCodes'),
('Perioperative', 'Perioperative', 'Connect-a-thon practiceSettingCodes'),
('Pharmacacy', 'Pharmacacy', 'Connect-a-thon practiceSettingCodes'),
('Physical Medicine', 'Physical Medicine', 'Connect-a-thon practiceSettingCodes'),
('Plastic Surgery', 'Plastic Surgery', 'Connect-a-thon practiceSettingCodes'),
('Podiatry', 'Podiatry', 'Connect-a-thon practiceSettingCodes'),
('Psychiatry', 'Psychiatry', 'Connect-a-thon practiceSettingCodes'),
('Pulmonary', 'Pulmonary', 'Connect-a-thon practiceSettingCodes'),
('Radiology', 'Radiology', 'Connect-a-thon practiceSettingCodes'),
('Social Services', 'Social Services', 'Connect-a-thon practiceSettingCodes'),
('Speech Therapy', 'Speech Therapy', 'Connect-a-thon practiceSettingCodes'),
('Thyroidology', 'Thyroidology', 'Connect-a-thon practiceSettingCodes'),
('Tumor Board', 'Tumor Board', 'Connect-a-thon practiceSettingCodes'),
('Urology', 'Urology', 'Connect-a-thon practiceSettingCodes'),
('Veterinary Medicine', 'Veterinary Medicine', 'Connect-a-thon practiceSettingCodes');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `RegistryPackage`
-- 

CREATE TABLE IF NOT EXISTS `RegistryPackage` (
  `key_prog` bigint(20) NOT NULL auto_increment,
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(64) default 'RegistryPackage',
  `expiration` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `majorVersion` int(11) NOT NULL default '0',
  `minorVersion` int(11) NOT NULL default '1',
  `stability` varchar(128) default NULL,
  `status` varchar(128) NOT NULL default '',
  `userVersion` varchar(64) default NULL,
  PRIMARY KEY  (`key_prog`),
  KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `RegistryPackage`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `Service`
-- 

CREATE TABLE IF NOT EXISTS `Service` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'Service',
  `expiration` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `majorVersion` int(11) NOT NULL default '0',
  `minorVersion` int(11) NOT NULL default '1',
  `stability` varchar(128) default NULL,
  `status` varchar(128) NOT NULL default '',
  `userVersion` varchar(64) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `Service`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `ServiceBinding`
-- 

CREATE TABLE IF NOT EXISTS `ServiceBinding` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'ServiceBinding',
  `service` varchar(64) NOT NULL default '',
  `accessURI` varchar(255) default NULL,
  `targetBinding` varchar(64) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `ServiceBinding`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `Slot`
-- 

CREATE TABLE IF NOT EXISTS `Slot` (
  `key_prog` bigint(100) NOT NULL auto_increment,
  `name` varchar(128) NOT NULL default '',
  `slotType` varchar(128) default NULL,
  `value` varchar(255) NOT NULL default '',
  `parent` varchar(128) NOT NULL default '',
  PRIMARY KEY  (`key_prog`),
  KEY `parent` (`parent`),
  KEY `value` (`value`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dump dei dati per la tabella `Slot`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `SpecificationLink`
-- 

CREATE TABLE IF NOT EXISTS `SpecificationLink` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'SpecificationLink',
  `service` varchar(64) NOT NULL default '',
  `serviceBinding` varchar(64) NOT NULL default '',
  `specificationObject` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `SpecificationLink`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `STATS`
-- 

CREATE TABLE IF NOT EXISTS `STATS` (
  `ID` int(11) NOT NULL auto_increment,
  `REPOSITORY` varchar(20) NOT NULL,
  `DATA` datetime NOT NULL,
  `EXECUTION_TIME` varchar(20) NOT NULL,
  `OPERATION` varchar(50) NOT NULL,
  PRIMARY KEY  (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;



-- --------------------------------------------------------

-- 
-- Struttura della tabella `TelephoneNumber`
-- 

CREATE TABLE IF NOT EXISTS `TelephoneNumber` (
  `areaCode` varchar(4) default NULL,
  `countryCode` varchar(4) default NULL,
  `extension` varchar(8) default NULL,
  `number` varchar(16) default NULL,
  `phoneType` varchar(32) default NULL,
  `url` varchar(255) default NULL,
  `parent` varchar(64) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `TelephoneNumber`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `typeCode`
-- 

CREATE TABLE IF NOT EXISTS `typeCode` (
  `code` varchar(255) NOT NULL default '',
  `display` varchar(255) NOT NULL default '',
  `codingScheme` varchar(255) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `typeCode`
-- 

INSERT INTO `typeCode` (`code`, `display`, `codingScheme`) VALUES 
('34096-8', 'Nursing Home Comprehensive History and Physical Note', 'LOINC'),
('34121-4', 'Interventional Procedure Note', 'LOINC'),
('18743-5', 'Autopsy Note', 'LOINC'),
('34095-0', 'Comprehensive History and Physical Note', 'LOINC'),
('34098-4', 'Conference Evaluation Note', 'LOINC'),
('11488-4', 'Consultation Note', 'LOINC'),
('28574-2', 'Discharge Note', 'LOINC'),
('18842-5', 'Discharge Summarization Note', 'LOINC'),
('34109-9', 'Evaluation And Management Note', 'LOINC'),
('34117-2', 'History And Physical Note', 'LOINC'),
('28636-9', 'Initial Evaluation Note', 'LOINC'),
('28570-0', 'Procedure Note', 'LOINC'),
('11506-3', 'Subsequent Visit Evaluation Note', 'LOINC'),
('34133-9', 'Summarization of Episode Note', 'LOINC'),
('11504-8', 'Surgical Operation Note', 'LOINC'),
('34138-8', 'Targeted History And Physical Note', 'LOINC'),
('34140-4', 'Transfer of Care Referral Note', 'LOINC'),
('18761-7', 'Transfer Summarization Note', 'LOINC'),
('34100-8', 'Critical Care Unit Consultation Note', 'LOINC'),
('34126-3', 'Critical Care Unit Subsequent Visit Evaluation Note', 'LOINC'),
('34111-5', 'Emergency Department Evaluation And Management Note', 'LOINC'),
('15507-7', 'Emergency Department Subsequent Visit Evaluation Note', 'LOINC'),
('34107-3', 'Home Health Education Procedure Note', 'LOINC'),
('34118-0', 'Home Health Initial Evaluation Note', 'LOINC'),
('34129-7', 'Home Health Subsequent Visit Evaluation Note', 'LOINC'),
('34104-0', 'Hospital Consultation Note', 'LOINC'),
('34105-7', 'Hospital Discharge Summarization Note', 'LOINC'),
('34114-9', 'Hospital Group Counseling Note', 'LOINC'),
('11492-6', 'Hospital History and Physical Note', 'LOINC'),
('34130-5', 'Hospital Subsequent Visit Evaluation Note', 'LOINC'),
('34112-3', 'Inpatient Evaluation And Management Note', 'LOINC'),
('34097-6', 'Nursing Home Conference Evaluation Note', 'LOINC'),
('34113-1', 'Nursing Home Evaluation And Management Note', 'LOINC'),
('34119-8', 'Nursing Home Initial Evaluation Note', 'LOINC'),
('24611-6', 'Outpatient Confirmatory Consultation Note', 'LOINC'),
('34108-1', 'Outpatient Evaluation And Management', 'LOINC'),
('34120-6', 'Outpatient Initial Evaluation Note', 'LOINC'),
('34131-3', 'Outpatient Subsequent Visit Evaluation Note', 'LOINC'),
('34137-0', 'Outpatient Surgical Operation Note', 'LOINC'),
('34123-0', 'Anesthesia Hospital Pre-Operative Evaluation And Management Note', 'LOINC'),
('28655-9', 'Attending Physician Discharge Summarization Note', 'LOINC'),
('28654-2', 'Attending Physician Initial Evaluation Note', 'LOINC'),
('18733-6', 'Attending Physician Subsequent Visit Evaluation Note', 'LOINC'),
('34134-7', 'Attending Physician Outpatient Supervisory Note', 'LOINC'),
('34135-4', 'Attending Physician Cardiology Outpatient Supervisory Note', 'LOINC'),
('34136-2', 'Attending Physician Gastroenterology Outpatient Supervisory Note', 'LOINC'),
('34099-2', 'Cardiology Consultation Note', 'LOINC'),
('34094-3', 'Cardiology Hospital Admission History And Physical Note', 'LOINC'),
('34124-8', 'Cardiology Outpatient Subsequent Visit Evaluation Note', 'LOINC'),
('34125-5', 'Case Manager Home Health Care Subsequent Visit Evaluation Note', 'LOINC'),
('28581-7', 'Chiropractor Initial Evaluation Note', 'LOINC'),
('18762-5', 'Chiropractor Subsequent Visit Evaluation Note', 'LOINC'),
('18763-3', 'Consulting Physician Initial Evaluation Note', 'LOINC'),
('28569-2', 'Consulting Physician Subsequent Visit Evaluation Note', 'LOINC'),
('34127-1', 'Dental Hygienist Outpatient Subsequent Visit Evaluation Note', 'LOINC'),
('29761-4', 'Dentistry Discharge Summarization Note', 'LOINC'),
('28572-6', 'Dentistry Initial Evaluation Note', 'LOINC'),
('28577-5', 'Dentistry Procedure Note', 'LOINC'),
('28617-9', 'Dentistry Subsequent Visit Evaluation Note', 'LOINC'),
('28583-3', 'Dentistry Surgical Operation Note', 'LOINC'),
('28618-7', 'Dentistry Visit Note', 'LOINC'),
('34128-9', 'Dentistry Outpatient Subsequent Visit Evaluation Note', 'LOINC'),
('34110-7', 'Diabetology Outpatient Evaluation And Management Note', 'LOINC'),
('18748-4', 'Diagnostic Imaging Report', 'LOINC'),
('34101-6', 'General Medicine Outpatient Consultation Note', 'LOINC'),
('34115-6', 'Medical Student Hospital History and Physical Note', 'LOINC'),
('28621-1', 'Nurse Practitioner Initial Evaluation Note', 'LOINC'),
('18764-1', 'Nurse Practitioner Subsequent Visit Evaluation Note', 'LOINC'),
('28622-9', 'Nursing Discharge Assessment Note', 'LOINC'),
('29753-1', 'Nursing Initial Evaluation Note', 'LOINC'),
('28623-7', 'Nursing Subsequent Visit Evaluation Note', 'LOINC'),
('34139-6', 'Nursing Telephone Encounter Note', 'LOINC'),
('28651-8', 'Nursing Transfer Summarization Note', 'LOINC'),
('18734-4', 'Occupational Therapy Initial Evaluation Note', 'LOINC'),
('11507-1', 'Occupational Therapy Subsequent Visit Evaluation Note', 'LOINC'),
('34122-2', 'Pathology Pathology Procedure Note', 'LOINC'),
('34132-1', 'Pharmacy Outpatient Subsequent Visit Evaluation Note', 'LOINC'),
('18735-1', 'Physical Therapy Initial Evaluation Note', 'LOINC'),
('11508-9', 'Physical Therapy Subsequent Visit Evaluation Note', 'LOINC'),
('28579-1', 'Physical Therapy Visit Note', 'LOINC'),
('11490-0', 'Physician Discharge Summarization Note', 'LOINC'),
('28626-0', 'Physician History and Physical Note', 'LOINC'),
('18736-9', 'Physician Initial Evaluation Note', 'LOINC'),
('11505-5', 'Physician Procedure Note', 'LOINC'),
('28573-4', 'Physician Surgical Operation Note', 'LOINC'),
('28616-1', 'Physician Transfer Summarization Note', 'LOINC'),
('28568-4', 'Physician Emergency Department Visit Note', 'LOINC'),
('34106-5', 'Physician Hospital Discharge Summarization Note', 'LOINC'),
('34116-4', 'Physician Nursing Home History and Physical Note', 'LOINC'),
('18737-7', 'Podiatry Initial Evaluation Note', 'LOINC'),
('28625-2', 'Podiatry Procedure Note', 'LOINC'),
('11509-7', 'Podiatry Subsequent Visit Evaluation Note', 'LOINC'),
('28624-5', 'Podiatry Surgical Operation Note', 'LOINC'),
('28635-1', 'Psychiatry Initial Evaluation Note', 'LOINC'),
('28627-8', 'Psychiatry Subsequent Visit Evaluation Note', 'LOINC'),
('34102-4', 'Psychiatry Hospital Consultation Note', 'LOINC'),
('18738-5', 'Psychology Initial Evaluation Note', 'LOINC'),
('11510-5', 'Psychology Subsequent Visit Evaluation Note', 'LOINC'),
('34103-2', 'Pulmonary Consultation Note', 'LOINC'),
('18739-3', 'Social Service Initial Evaluation Note', 'LOINC'),
('28656-7', 'Social Service Subsequent Visit Evaluation Note', 'LOINC'),
('28653-4', 'Social Service Visit Note', 'LOINC'),
('18740-1', 'Speech Therapy Initial Evaluation Note', 'LOINC'),
('11512-1', 'Speech Therapy Subsequent Visit Evaluation Note', 'LOINC');

-- --------------------------------------------------------

-- 
-- Struttura della tabella `UsageDescription`
-- 

CREATE TABLE IF NOT EXISTS `UsageDescription` (
  `charset` varchar(32) default NULL,
  `lang` varchar(32) NOT NULL default '',
  `value` varchar(255) NOT NULL default '',
  `parent` varchar(64) NOT NULL default '',
  PRIMARY KEY  (`parent`,`lang`,`value`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `UsageDescription`
-- 


-- --------------------------------------------------------

-- 
-- Struttura della tabella `UsageParameter`
-- 

CREATE TABLE IF NOT EXISTS `UsageParameter` (
  `value` varchar(255) NOT NULL default '',
  `parent` varchar(64) NOT NULL default ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `UsageParameter`
-- 


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

-- --------------------------------------------------------

-- 
-- Struttura della tabella `User_`
-- 

CREATE TABLE IF NOT EXISTS `User_` (
  `accessControlPolicy` varchar(64) default NULL,
  `id` varchar(64) NOT NULL default '',
  `objectType` varchar(32) default 'User',
  `email` varchar(128) NOT NULL default '',
  `organization` varchar(64) NOT NULL default '',
  `personName_firstName` varchar(64) default NULL,
  `personName_middleName` varchar(64) default NULL,
  `personName_lastName` varchar(64) default NULL,
  `url` varchar(255) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dump dei dati per la tabella `User_`
-- 

