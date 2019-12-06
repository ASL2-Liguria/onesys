/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
package elco.internaldb;

import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.camel.CamelContext;
import org.apache.camel.ExchangeProperty;
import org.apache.camel.Handler;
import org.apache.camel.spi.Registry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.Constants;
import elco.middleware.camel.beans.DBManagement;

/**
 * Bean to delete internal db old logs
 *
 * @author Roberto Rizzo
 */
public final class DeleteOldLogs {

	private static final Logger logger = LoggerFactory.getLogger(DeleteOldLogs.class);
	private DBManagement dbManagement = null;
	private final AtomicReference<DBManagement> ardbm = new AtomicReference<>(null);
	private static final String DELETELOGBACKEVENT = "delete from LOGBACK_EVENT where DATE_TIME <= TIMESTAMPADD(SQL_TSI_DAY, ?, sysdate) and context = ?";
	private static final String DELETELOGBACKEMMARKERREFERENCES = "delete from logback_em_marker_references where iden_event in (select iden from LOGBACK_EVENT_MESSAGES where DATE_TIME <= TIMESTAMPADD(SQL_TSI_DAY, ?, sysdate) and context = ?)";
	private static final String DELETELOGBACKEVENTMESSAGES = "delete from LOGBACK_EVENT_MESSAGES where DATE_TIME <= TIMESTAMPADD(SQL_TSI_DAY, ?, sysdate) and context = ?";

	@Handler
	public final void handler(Registry registry, @ExchangeProperty(value = "contextsList") List<CamelContext> contextsList) throws SQLException {
		if (dbManagement == null) {
			ardbm.compareAndSet(null, DBManagement.getDBManagement(registry, Constants.INTERNALDBPOOLNAME));
			dbManagement = ardbm.get();
		}

		contextsList.parallelStream().forEach(context -> { // NOSONAR
			int deleteTime = Constants.deleteOldLogDBDays;
			String paramDeleteString = context.getGlobalOption("deleteOldLogDBDays");
			if (paramDeleteString != null) {
				deleteTime = Integer.parseInt(paramDeleteString);
			}

			logger.debug("Context {}: try delete file older than {} day(s)", context.getName(), String.valueOf(deleteTime));

			int numberOfDeletedLogs;
			try {
				numberOfDeletedLogs = dbManagement.delete(DELETELOGBACKEVENT, -deleteTime, context.getName());
				logger.debug("Deleted {} rows from table LOGBACK_EVENT", numberOfDeletedLogs);
			} catch (Exception ex) {
				logger.warn("", ex);
			}

			try {
				numberOfDeletedLogs = dbManagement.delete(DELETELOGBACKEMMARKERREFERENCES, -deleteTime, context.getName());
				logger.debug("Deleted {} rows from table logback_em_marker_references", numberOfDeletedLogs);
			} catch (Exception ex) {
				logger.warn("", ex);
			}

			try {
				numberOfDeletedLogs = dbManagement.delete(DELETELOGBACKEVENTMESSAGES, -deleteTime, context.getName());
				logger.debug("Deleted {} rows from table LOGBACK_EVENT_MESSAGES", numberOfDeletedLogs);
			} catch (Exception ex) {
				logger.warn("", ex);
			}
		});
	}
}
