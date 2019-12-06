DROP INDEX IF EXISTS IDX_LB_CONTEXT_ROUTE;
DROP INDEX IF EXISTS IDX_LB_LOG_LEVEL;
DROP INDEX IF EXISTS IDX_LB_acknowledge;

CREATE TABLE IF NOT EXISTS logback_event
(
	iden		   IDENTITY,
    logger_name    VARCHAR(254) NOT NULL,
    thread_name    VARCHAR(254),
    log_level      VARCHAR(254) NOT NULL,
    log_message    CLOB NOT NULL,
	context		   VARCHAR(500),
	route		   VARCHAR(500),
	marker		   VARCHAR(500),
	acknowledge	   VARCHAR(1) DEFAULT 'N' NOT NULL,
	DATE_TIME	   TIMESTAMP DEFAULT SYSDATE NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_LB_CONTEXT_ROUTE_LEVEL_DATE ON logback_event (CONTEXT, ROUTE, LOG_LEVEL, DATE_TIME);
CREATE INDEX IF NOT EXISTS IDX_LB_CONTEXT_ROUTE_DATE_LEVEL ON logback_event (CONTEXT, ROUTE, DATE_TIME, LOG_LEVEL);
CREATE INDEX IF NOT EXISTS IDX_LB_LOG_LEVEL_acknowledge ON logback_event (LOG_LEVEL, acknowledge);
CREATE INDEX IF NOT EXISTS IDX_LB_MARKER ON logback_event (marker);
CREATE INDEX IF NOT EXISTS IDX_LB_DATE_TIME ON logback_event (date_time);

---------------------------------------------------------------------------------------------------------------------

DROP INDEX IF EXISTS IDX_LBEM_CONTEXT_ROUTE;
DROP INDEX IF EXISTS IDX_LBEM_LOG_LEVEL;
DROP INDEX IF EXISTS IDX_LBEM_acknowledge;

CREATE TABLE IF NOT EXISTS logback_event_messages
(
	iden		   IDENTITY,
    logger_name    VARCHAR(254) NOT NULL,
    thread_name    VARCHAR(254),
    log_level      VARCHAR(254) NOT NULL,
    log_message    CLOB NOT NULL,
	context		   VARCHAR(500),
	route		   VARCHAR(500),
	marker		   VARCHAR(500),
	acknowledge	   VARCHAR(1) DEFAULT 'N' NOT NULL,
	DATE_TIME	   TIMESTAMP DEFAULT SYSDATE NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_LBEM_CONTEXT_ROUTE_LEVEL_DATE ON logback_event_messages (CONTEXT, ROUTE, LOG_LEVEL, DATE_TIME);
CREATE INDEX IF NOT EXISTS IDX_LBEM_CONTEXT_ROUTE_DATE_LEVEL ON logback_event_messages (CONTEXT, ROUTE, DATE_TIME, LOG_LEVEL);
CREATE INDEX IF NOT EXISTS IDX_LBEM_LOG_LEVEL_acknowledge ON logback_event_messages (LOG_LEVEL, acknowledge);
CREATE INDEX IF NOT EXISTS IDX_LBEM_MARKER ON logback_event_messages (marker);
CREATE INDEX IF NOT EXISTS IDX_LBEM_DATE_TIME ON logback_event_messages (date_time);

---------------------------------------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS logback_em_marker_references
(
	iden_event	   integer,
	reference	   VARCHAR(500),
	DATE_TIME	   TIMESTAMP DEFAULT SYSDATE NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_LBEMMR_IDEN_EVENT ON logback_em_marker_references (IDEN_EVENT);
CREATE INDEX IF NOT EXISTS IDX_LBEMMR_reference ON logback_em_marker_references (reference);
CREATE INDEX IF NOT EXISTS IDX_LBEMMR_DATE_TIME ON logback_em_marker_references (date_time);

---------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE VIEW VIEW_EVENT_BY_MARKER_REFERENCE AS
SELECT lem.*, lemmr.reference FROM logback_event_messages lem, logback_em_marker_references lemmr WHERE lem.iden = lemmr.iden_event;

---------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE VIEW VIEW_EVENTS AS 
select 'LOGBACK_EVENT' TABLE_NAME, LOGBACK_EVENT.* from LOGBACK_EVENT
union all
select 'LOGBACK_EVENT_MESSAGES' TABLE_NAME, LOGBACK_EVENT_MESSAGES.* from LOGBACK_EVENT_MESSAGES;
