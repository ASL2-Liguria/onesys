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
package elco.logback.appenders;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.apache.camel.CamelContext;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Marker;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import elco.exceptions.LogNullEmptyValueException;
import elco.insc.Camel;
import elco.insc.Constants;
import elco.insc.LogbackUtils;

/**
 * <p>
 * logback activemq appender
 * </p>
 * <p>
 * log - getLoggerName, getThreadName, getLevel, getFormattedMessage
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class ActivemqAppender extends AppenderBase<ILoggingEvent> {

	private String bean;
	private String queues;
	private CamelContext contextManager = null;
	private final AtomicReference<CamelContext> arcc = new AtomicReference<>(null);

	/**
	 * @param bean
	 *            bean name (e.g. activemqlog)
	 */
	public void setBean(String bean) {
		this.bean = bean;
	}

	/**
	 * @param queues
	 *            destination queues (e.g. FOO.BAR,FOO.TEST)
	 */
	public void setQueues(String queues) {
		this.queues = queues;
	}

	@Override
	protected void append(ILoggingEvent eventObject) {
		if (Constants.camelRegistry != null) {
			if (contextManager == null) {
				arcc.compareAndSet(null, Constants.camelRegistry.lookupByNameAndType(Constants.camelManagerContext, CamelContext.class));
				contextManager = arcc.get();
			}

			try {
				String logText = LogbackUtils.getErrorDescription(eventObject);
				if (StringUtils.isBlank(logText)) {
					throw new LogNullEmptyValueException("Log an empty or NULL message is useless");
				}

				Map<String, Object> headers = new HashMap<>();
				headers.put("loggerName", eventObject.getLoggerName());
				headers.put("threadName", eventObject.getThreadName());
				headers.put("level", eventObject.getLevel().toString());
				headers.put("camelContextId", eventObject.getMDCPropertyMap().get("camel.contextId"));
				headers.put("camelRouteId", eventObject.getMDCPropertyMap().get("camel.routeId"));
				headers.put("timeStamp", eventObject.getTimeStamp());

				Marker oMarker = eventObject.getMarker();
				if (oMarker != null) {
					headers.put("marker", oMarker.getName());
					if (oMarker.hasReferences()) { // NOSONAR
						int index = 1;
						Iterator<Marker> it = oMarker.iterator();
						while (it.hasNext()) {
							Marker reference = it.next();
							headers.put("markerReference" + index++, reference.getName());
						}
					}
				}

				Camel.toActivemq(contextManager, bean, queues, logText, headers);
			} catch (Exception ex) { // NOSONAR
				System.err.println("elco.logback.appenders.ActivemqAppender append: " + ex.getLocalizedMessage()); // NOSONAR
			}
		}
	}
}
