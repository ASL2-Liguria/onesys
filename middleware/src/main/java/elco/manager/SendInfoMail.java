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
package elco.manager;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.camel.CamelContext;
import org.apache.camel.ExchangeProperty;
import org.apache.camel.Handler;
import org.apache.camel.Route;

import elco.insc.Constants;
import elco.insc.Mail;
import elco.middleware.camel.beans.DBManagement;
import elco.middleware.camel.beans.TableRow;

/**
 * @author Roberto Rizzo
 */
public final class SendInfoMail extends BaseManager {

	private static final String LASTSENTMAILPROPERTY = "ELCO_LastSentMail";
	private static final String LASTERRORSNUMBERPROPERTY = "ELCO_LastErrorsNumber";
	private static final long SENDMAILEVERYMILLIS = 3600000L; // 60 minuti
	private DBManagement dbManagement = null;
	private final AtomicReference<DBManagement> ardbm = new AtomicReference<>(null);

	@Handler
	public final void handler(CamelContext context, @ExchangeProperty(value = "contextsList") List<CamelContext> contextsList) {
		contextsList.stream().filter(contextEl -> !contextEl.equals(context)).forEach(contextEl -> { // NOSONAR
			try {
				Map<String, String> properties = contextEl.getGlobalOptions();
				String subject = properties.get("Subject");
				String message = properties.get("Message");
				String to = properties.get("To");
				String cc = properties.get("Cc");

				if (to != null) { // Try to send e-mail if any recipient is configured
					long lLastSentMail = 0;
					String sLastSentMail = properties.get(LASTSENTMAILPROPERTY);
					if (sLastSentMail == null) {
						properties.put(LASTSENTMAILPROPERTY, "0");
					} else {
						lLastSentMail = Long.valueOf(sLastSentMail);
					}
					int iLastErrorsNumber = 0;
					String sLastErrors = properties.get(LASTERRORSNUMBERPROPERTY);
					if (sLastErrors == null) {
						properties.put(LASTERRORSNUMBERPROPERTY, "0");
					} else {
						iLastErrorsNumber = Integer.parseInt(sLastErrors);
					}

					int errors = getContextErrorsCamel(contextEl) + getContextErrorsDB(contextEl);
					if (errors > 0) { // I have at least one error
						if ((System.currentTimeMillis() - lLastSentMail) > SENDMAILEVERYMILLIS || errors > iLastErrorsNumber) { // NOSONAR
							Mail.send(contextEl, subject, message, "ElcoMiddlewareInfoSystem@elco.it", to, cc);
							properties.put(LASTSENTMAILPROPERTY, String.valueOf(System.currentTimeMillis()));
							properties.put(LASTERRORSNUMBERPROPERTY, String.valueOf(errors));
							logger.info("Sent e-mail for CamelContext: {}", contextEl.getName());
						}
					} else if (iLastErrorsNumber > 0) { // I had errors, but now I haven't anymore. Reset sending e-mail for this context
						properties.put(LASTSENTMAILPROPERTY, "0");
						properties.put(LASTERRORSNUMBERPROPERTY, "0");
					}
				}
			} catch (Exception ex) {
				logger.warn("SendInfoMail problem for CamelContext: {}. Error: {}", contextEl.getName(), ex);
			}
		});
	}

	// Read errors from the route of the context. If I read them directly from the context, even if I reset the route, I could have them anyway
	private int getContextErrorsCamel(CamelContext context) {
		int errors = 0;

		for (Route route : context.getRoutes()) {
			errors += getRouteErrors(context.getName(), route.getId());
		}

		return errors;
	}

	// Get errors logged on db for the context
	private int getContextErrorsDB(CamelContext context) throws SQLException {
		int errors = 0;

		if ("enabled".equalsIgnoreCase(Constants.ENABLEINTERNALDB)) {
			if (dbManagement == null) {
				ardbm.compareAndSet(null, getDBManagementInternalDB(context));
				dbManagement = ardbm.get();
			}

			TableRow[] rows = dbManagement.select(
					"select count(*) from VIEW_EVENTS where CONTEXT = ? and log_level = 'ERROR' and acknowledge = 'N' and DATE_TIME >= TIMESTAMPADD(SQL_TSI_DAY, -3, sysdate)",
					context.getName());
			if (rows != null) {
				errors = rows[0].getInteger(1);
			}
		}

		return errors;
	}
}
