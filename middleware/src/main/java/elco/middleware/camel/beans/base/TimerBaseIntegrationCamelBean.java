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
package elco.middleware.camel.beans.base;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.concurrent.RejectedExecutionException;

import org.apache.camel.Exchange;
import org.apache.camel.Handler;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mina2.Mina2Component;
import org.apache.camel.component.mina2.Mina2Configuration;
import org.apache.camel.component.mina2.Mina2Endpoint;
import org.apache.camel.util.UnsafeUriCharactersEncoder;

import ca.uhn.hl7v2.HL7Exception;
import elco.insc.GenericUtils;
import elco.middleware.camel.beans.HL7Document;

/**
 * <p>
 * Base Camel bean class for Timer<br>
 * Extends {@link BaseIntegrationCamelBean}
 * </p>
 * <p>
 * <h1>sendWithInternalSender(String _destination, HL7Document _message)</h1>
 * </p>
 * <p>
 * <h1>sendWithInternalSender(String _destination, String _message)</h1>
 * </p>
 *
 * @deprecated
 * @author Roberto Rizzo
 */
@Deprecated
public abstract class TimerBaseIntegrationCamelBean extends BaseIntegrationCamelBean { // NOSONAR

	private final HashMap<String, Mina2Endpoint> endPointsTable = new HashMap<>();
	private ProducerTemplate producerTemplate = null;
	private Mina2Component minaComponent = null;
	private boolean isProducerStarted = false;
	private boolean closeHL7Connections = false;

	/**
	 * The only Camel handler
	 *
	 * @param pexchange
	 *            Exchange object
	 * @throws SQLException
	 */
	@Handler
	public final synchronized void camelHandler(Exchange pexchange) throws SQLException {
		try {
			baseHandler(pexchange);
			getDBManagement();
			verifyParsers(); // to verify if this is the right place to call this function
			handler();
		} catch (Exception ex) {
			throw new SQLException(ex);
		} finally {
			closeDefaultDBM();
			exchange = null;
		}
	}

	/**
	 * If the parameter is set to true all Mina connections will be closed after sent a message and received a response. If parameter is false leave connections open<br>
	 * <b>Default false</b>
	 *
	 * @param close
	 *            true/false
	 */
	public void setCloseHL7Connections(boolean close) {
		closeHL7Connections = close;
	}

	/**
	 * <p>
	 * Send the message to an HL7 server and return the response as a pipe message String
	 * </p>
	 * <p>
	 * Connection will be closed
	 * </p>
	 *
	 * @param destination
	 *            'IP:PORT'
	 * @param message
	 *            HL7 message to send
	 * @param timeout
	 *            response timeout in milliseconds
	 * @return response as pipe message String
	 * @throws HL7Exception
	 */
	public String sendWithInternalSender(String destination, HL7Document message, String timeout) throws HL7Exception {
		return sendWithInternalSender(destination, message.toPipe(), timeout);
	}

	/**
	 * <p>
	 * Send the message to an HL7 server and return the response as a pipe message String
	 * </p>
	 * <p>
	 * Connection will be closed
	 * </p>
	 *
	 * @param destination
	 *            'IP:PORT'
	 * @param message
	 *            HL7 message to send
	 * @param timeout
	 *            response timeout in milliseconds
	 * @return response as pipe message String
	 * @throws HL7Exception
	 */
	public String sendWithInternalSender(String destination, String message, String timeout) throws HL7Exception {
		try {
			if (producerTemplate == null) {
				producerTemplate = exchange.getContext().createProducerTemplate();
				isProducerStarted = true;
				minaComponent = new Mina2Component(exchange.getContext());
				Mina2Configuration conf = new Mina2Configuration();
				conf.setDisconnect(closeHL7Connections);
				conf.setSync(true);
				conf.setTimeout(Long.parseLong(timeout));
				minaComponent.setConfiguration(conf);
			} else {
				if (!isProducerStarted) {
					producerTemplate.start();
					isProducerStarted = true;
				}
			}

			Mina2Endpoint endPoint = endPointsTable.get(destination);
			if (endPoint == null) {
				String encodedUri = UnsafeUriCharactersEncoder.encode("mina2:tcp://" + destination + "?codec=#hl7codec");
				endPoint = (Mina2Endpoint) minaComponent.createEndpoint(encodedUri);
				endPointsTable.put(destination, endPoint);
			}

			String response = producerTemplate.requestBody(endPoint, message, String.class);
			if (closeHL7Connections) {
				GenericUtils.threadSleep(500L);
			}
			return response;
		} catch (Exception ex) {
			if (ex.getCause() instanceof RejectedExecutionException) { // can happen after camel context restart
				endPointsTable.clear();
				stopSender();
			}
			throw new HL7Exception(ex);
		}
	}

	/**
	 * Release Mina sender
	 */
	private void stopSender() {
		try {
			producerTemplate.stop();
			isProducerStarted = false;
			GenericUtils.threadSleep(500L);
		} catch (Exception ex) {
			logger.error("Problem releasing sender", ex);
		}
	}

	/**
	 * Called on a new timer event. This is the main function to use for timer events handling
	 *
	 * @throws Exception
	 */
	protected abstract void handler() throws Exception; // NOSONAR
}
