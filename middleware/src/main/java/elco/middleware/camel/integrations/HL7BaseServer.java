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
package elco.middleware.camel.integrations;

import java.util.HashMap;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.component.mina2.Mina2Component;
import org.apache.camel.component.mina2.Mina2Endpoint;
import org.apache.camel.util.UnsafeUriCharactersEncoder;

import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import elco.exceptions.BaseIntegrationException;
import elco.insc.GenericUtils;
import elco.insc.HL7;
import elco.middleware.camel.beans.HL7Document;
import elco.middleware.camel.beans.base.MiddlewareBaseComunicationInterface;

/**
 * <p>
 * HL7 base Server class<br>
 * extends {@link HL7BaseIntegrationClass}<br>
 * implements {@link MiddlewareBaseComunicationInterface}
 * </p>
 * <p>
 * <h1>setOutputMessage(HL7Document _hl7document)</h1>
 * </p>
 * <p>
 * <h1>setOutputMessage(String _message)</h1>
 * </p>
 * <p>
 * <h1>setOutputMessage(Message _message)</h1>
 * </p>
 * <p>
 * <h1>Object getOutputMessage()</h1>
 * </p>
 * <p>
 * <h1>sendWithInternalSender(String _destination, HL7Document _message)</h1>
 * </p>
 * <p>
 * <h1>sendWithInternalSender(String _destination, String _message)</h1>
 * </p>
 *
 * @author Roberto Rizzo
 */
public abstract class HL7BaseServer extends HL7BaseIntegrationClass implements MiddlewareBaseComunicationInterface {

	private Object outputMessage = null;
	private final HashMap<String, Mina2Endpoint> endPointsTable = new HashMap<>();
	private ProducerTemplate producerTemplate = null;
	private Mina2Component minaComponent = null;
	private boolean isProducerStarted = false;
	private boolean closeHL7Connections = false;

	@Override
	public void init(CamelContext context, String configurationBeans) throws BaseIntegrationException {
	}

	@Override
	public final void handler(Exchange pexchange) throws BaseIntegrationException {
		try {
			outputMessage = null;

			baseHandler(pexchange); // set base information

			getDBManagement(); // if configured create a DBManagement

			String messageStringPreParsed = preParsingString(exchange.getIn().getBody(String.class)); // a chance to change String content before
																										// transform it in a Message

			verifyParsers();
			Message message = preParsingMessage(HL7.getMessage(messageStringPreParsed, pipeParser));

			HL7Document hl7Document = HL7.getDocumentFromMessage(exchange.getContext(), message, xmlParser, characterset);
			if (preserveWhiteSpace) {
				hl7Document.setPreserveWhiteSpace(); // preserve white space using XPATH (comprendono anche gli \r, \n e \t)
			}
			hl7Document.setParser(xmlParser); // new xml parser. Can be NULL

			middlewareHandler(hl7Document, exchange); // main handler

			if (outputMessage != null) { // if not NULL will be sent as output message
				setOutputBody(outputMessage);
			}
		} catch (Exception ex) {
			throw new BaseIntegrationException(ex);
		} finally {
			if (closeHL7Connections) {
				stopSender();
			}

			closeDefaultDBM();
			exchange = null;
			outputMessage = null;
		}
	}

	/**
	 * If the parameter is true close all Mina connections will be close when exit from the bean. If parameter is false leave connections open when exit from the bean
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
	 * Connection will be closed if setCloseHL7Connections(true)
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
	 * Connection will be closed if setCloseHL7Connections(true)
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
			} else {
				if (!isProducerStarted) {
					producerTemplate.start();
					isProducerStarted = true;
				}
			}

			Mina2Endpoint endPoint = endPointsTable.get(destination);
			if (endPoint == null) {
				String encodedUri = UnsafeUriCharactersEncoder.encode("mina2:tcp://" + destination + "?sync=true&codec=" + hl7Codec + "&timeout=" + timeout);
				endPoint = (Mina2Endpoint) minaComponent.createEndpoint(encodedUri);
				endPointsTable.put(destination, endPoint);
			}

			return producerTemplate.requestBody(endPoint, message, String.class);
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}
	}

	/**
	 * Release Mina sender. Override this function if you want connections remain open between each bean call
	 */
	protected void stopSender() {
		if (producerTemplate != null) {
			try {
				producerTemplate.stop();
				isProducerStarted = false;
				GenericUtils.threadSleep(500L);
			} catch (Exception ex) {
				logger.error("", ex);
			}
		}
	}

	/**
	 * Set HL7 output message
	 *
	 * @param hl7document
	 *            HL7 output message
	 * @throws HL7Exception
	 */
	public void setOutputMessage(HL7Document hl7document) throws HL7Exception {
		outputMessage = hl7document.toMessage();
	}

	/**
	 * Set HL7 output message
	 *
	 * @param message
	 *            HL7 output message
	 */
	public void setOutputMessage(String message) {
		outputMessage = message;
	}

	/**
	 * Set HL7 output message
	 *
	 * @param message
	 *            HL7 output message
	 */
	public void setOutputMessage(Message message) {
		outputMessage = message;
	}

	/**
	 * Get HL7 output message
	 *
	 * @return HL7 output message (can be NULL)
	 */
	public Object getOutputMessage() {
		return outputMessage;
	}

	/**
	 * <p>
	 * Function to use for pre-parsing an HL7 message as String if necessary. Default implementation simply return the input object as String
	 * </p>
	 * <p>
	 * This function is called before <b>preParsingMessage</b> and <b>handler</b> functions
	 * </p>
	 *
	 * @param message
	 *            HL7 pipe message as String
	 * @return HL7 pipe message as String
	 * @throws Exception
	 */
	protected String preParsingString(String message) throws Exception { // NOSONAR
		return message;
	}

	/**
	 * <p>
	 * Function to use for pre-parsing an HL7 message if necessary. Default implementation simply return the input object
	 * </p>
	 * <p>
	 * This function is called before <b>handler</b> function
	 * </p>
	 *
	 * @param message
	 *            HL7 Message object
	 * @return Message object
	 * @throws Exception
	 */
	protected Message preParsingMessage(Message message) throws Exception { // NOSONAR
		return message;
	}

	/**
	 * Called on a new HL7 message. This is the main function to use for HL7 message handling
	 *
	 * @param message
	 *            HL7 message
	 * @param exchange
	 *            Camel Exchange
	 * @throws Exception
	 */
	protected abstract void middlewareHandler(HL7Document message, Exchange exchange) throws Exception; // NOSONAR
}
