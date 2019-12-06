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
package elco.insc;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.apache.camel.CamelContext;
import org.apache.camel.ProducerTemplate;

/**
 * Template for working with Camel and sending Message instances in an Exchange to an Endpoint<br>
 * The CamelProducerTemplate is <b>thread safe</b><br>
 * <br>
 * All the <b>sendTo</b> methods will return the content according to this strategy:
 * <ul>
 * <li>throws org.apache.camel.CamelExecutionException if processing failed during routing with the caused exception wrapped</li>
 * <li>The fault.body if there is a fault message set and its not null</li>
 * <li>Either IN or OUT body according to the message exchange pattern. If the pattern is Out capable then the OUT body is returned, otherwise IN</li>
 * </ul>
 * Before using the template it must be started. And when you are done using the template, make sure to stop() the template<br>
 * <br>
 *
 * @author Roberto Rizzo
 * @param <E>
 */
public final class CamelProducerTemplate<E> {

	private ProducerTemplate producerTemplate = null;
	private boolean isStarted = false;

	/**
	 * Create a CamelProducerTemplate which is <b>started</b> and therefore ready to use right away
	 *
	 * @param camelcontext
	 *            CamelContext object
	 */
	public CamelProducerTemplate(CamelContext camelcontext) {
		producerTemplate = camelcontext.createProducerTemplate();
		isStarted = true;
	}

	/**
	 * Starts the service
	 *
	 * @throws Exception
	 *             is thrown if starting failed
	 */
	public void start() throws Exception {
		if (producerTemplate != null && !isStarted) {
			producerTemplate.start();
			isStarted = true;
		}
	}

	/**
	 * Stops the service
	 *
	 * @throws Exception
	 *             is thrown if stopping failed
	 */
	public void stop() throws Exception {
		if (producerTemplate != null && isStarted) {
			producerTemplate.stop();
			GenericUtils.threadSleep(500);
			isStarted = false;
		}
	}

	/**
	 * Service status
	 *
	 * @return true or false
	 */
	public boolean isStarted() {
		return isStarted;
	}

	/**
	 * Sends the message asynchronously to an endpoint with the specified headers and header values
	 *
	 * @param uri
	 *            the endpoint URI to send to
	 * @param message
	 *            message to send
	 * @param headers
	 *            headers
	 * @param type
	 *            the expected response type
	 * @return a handle to be used to get the response in the future
	 */
	public CompletableFuture<E> sendToAsync(String uri, Object message, Map<String, Object> headers, Class<E> type) {
		CompletableFuture<E> rvMessage = null;
		if (producerTemplate != null && isStarted) {
			if (headers != null) {
				rvMessage = producerTemplate.asyncRequestBodyAndHeaders(uri, message, headers, type);
			} else {
				rvMessage = producerTemplate.asyncRequestBody(uri, message, type);
			}
		}

		return rvMessage;
	}

	/**
	 * Sends the message to an endpoint with the specified headers and header values
	 *
	 * @param uri
	 *            the endpoint URI to send to
	 * @param message
	 *            message to send
	 * @param headers
	 *            headers
	 * @param type
	 *            the expected response type
	 * @return the result
	 */
	public <T extends Object> T sendTo(String uri, Object message, Map<String, Object> headers, Class<T> type) {
		T rvMessage = null;
		if (producerTemplate != null && isStarted) {
			if (headers != null) {
				rvMessage = producerTemplate.requestBodyAndHeaders(uri, message, headers, type);
			} else {
				rvMessage = producerTemplate.requestBody(uri, message, type);
			}
		}

		return rvMessage;
	}

	/**
	 * Send the message to an endpoint returning any result output message
	 *
	 * @param uri
	 *            the endpoint URI to send to
	 * @param message
	 *            message to send
	 * @param type
	 *            the expected response type
	 * @return the result
	 */
	public <T extends Object> T sendTo(String uri, Object message, Class<T> type) {
		return sendTo(uri, message, null, type);
	}

	/**
	 * Send the message to an endpoint returning any result output message
	 *
	 * @param uri
	 *            the endpoint URI to send to
	 * @param message
	 *            message to send
	 * @return the result
	 */
	public String sendTo(String uri, String message) {
		return sendTo(uri, message, null, String.class);
	}

	/**
	 * Send the message to an endpoint returning any result output message
	 *
	 * @param uri
	 *            the endpoint URI to send to
	 * @param message
	 *            message to send
	 * @return the result
	 */
	public byte[] sendTo(String uri, byte[] message) {
		return sendTo(uri, message, null, byte[].class);
	}

	@Override
	protected void finalize() throws Throwable { // NOSONAR
		stop();
		super.finalize();
	}
}
