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

import java.util.List;
import java.util.Map;

import javax.activation.DataHandler;
import javax.activation.DataSource;

import org.apache.camel.CamelContext;
import org.apache.camel.Endpoint;
import org.apache.camel.Exchange;
import org.apache.camel.ExchangePattern;
import org.apache.camel.Message;
import org.apache.camel.Producer;
import org.apache.camel.util.ExchangeHelper;

import elco.crypt.CryptInterface;
import elco.exceptions.MailException;
import elco.middleware.camel.beans.Config;

/**
 * Send e-mail utilities
 *
 * @author Roberto Rizzo
 */
public final class Mail {

	private Mail() {
	}

	/**
	 * Send an e-mail with attachments
	 *
	 * @param configurationBean
	 *            Bean containing smtp server configurations
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc (can be NULL)
	 * @param bcc
	 *            e-mail BCc (can be NULL)
	 * @param contentType
	 *            content Type: text/plain (default), text/html (can be NULL)
	 * @param headers
	 *            e-mail headers (can be NULL)
	 * @param attachments
	 *            e-mail attachments (can be NULL)
	 * @param type
	 *            e-mail Message type (es. String.class)
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static <T extends Object> T sendWithAttachments(String configurationBean, CamelContext camelcontext, String subject, T message, String from, String to, String cc,
			String bcc, String contentType, Map<String, Object> headers, List<DataSource> attachments, Class<T> type) throws MailException {
		Object response = null;
		Producer producer = null;
		Endpoint endpoint = null;

		try {
			String uri = createURI(camelcontext, subject, from, to, cc, bcc, contentType, configurationBean);

			endpoint = camelcontext.getEndpoint(uri);
			Exchange exchange = endpoint.createExchange(ExchangePattern.InOut);
			Message in = exchange.getIn();
			in.setBody(message);

			if (attachments != null && !attachments.isEmpty()) {
				for (DataSource dataSource : attachments) {
					DataHandler dataHandler = new DataHandler(dataSource);
					in.addAttachment(dataHandler.getName(), dataHandler);
				}
			}

			if (headers != null && headers.size() > 0) {
				in.setHeaders(headers);
			}

			producer = endpoint.createProducer();
			producer.start();
			producer.process(exchange);

			response = ExchangeHelper.extractResultBody(exchange, exchange.getPattern());
		} catch (Exception ex) {
			throw new MailException(ex);
		} finally {
			Camel.stopProducerSafe(producer);
			Camel.stopEndpointSafe(endpoint);
		}

		return camelcontext.getTypeConverter().convertTo(type, response);
	}

	/**
	 * Send an e-mail with attachments. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc (can be NULL)
	 * @param bcc
	 *            e-mail BCc (can be NULL)
	 * @param contentType
	 *            content Type: text/plain (default), text/html (can be NULL)
	 * @param headers
	 *            e-mail headers (can be NULL)
	 * @param attachments
	 *            e-mail attachments (can be NULL)
	 * @param type
	 *            e-mail Message type (es. String.class)
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static <T extends Object> T sendWithAttachments(CamelContext camelcontext, String subject, T message, String from, String to, String cc, String bcc, String contentType,
			Map<String, Object> headers, List<DataSource> attachments, Class<T> type) throws MailException {
		return sendWithAttachments("mailconfigs", camelcontext, subject, message, from, to, cc, bcc, contentType, headers, attachments, type);
	}

	/**
	 * Send an e-mail with attachments. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message as String
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc
	 * @param attachments
	 *            e-mail attachments
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static String sendWithAttachments(CamelContext camelcontext, String subject, String message, String from, String to, String cc, List<DataSource> attachments)
			throws MailException {
		return sendWithAttachments(camelcontext, subject, message, from, to, cc, null, null, null, attachments, String.class);
	}

	/**
	 * Send an e-mail with attachments. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message as String
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc
	 * @param headers
	 *            e-mail headers
	 * @param attachments
	 *            e-mail attachments
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static String sendWithAttachments(CamelContext camelcontext, String subject, String message, String from, String to, String cc, Map<String, Object> headers,
			List<DataSource> attachments) throws MailException {
		return sendWithAttachments(camelcontext, subject, message, from, to, cc, null, null, headers, attachments, String.class);
	}

	/**
	 * Send an e-mail. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc
	 * @param headers
	 *            e-mail headers
	 * @param type
	 *            e-mail Message type (es. String.class)
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static <T extends Object> T send(CamelContext camelcontext, String subject, T message, String from, String to, String cc, Map<String, Object> headers, Class<T> type)
			throws MailException {
		return sendWithAttachments(camelcontext, subject, message, from, to, cc, null, null, headers, null, type);
	}

	/**
	 * Send an e-mail. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc
	 * @param headers
	 *            e-mail headers
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static String send(CamelContext camelcontext, String subject, String message, String from, String to, String cc, Map<String, Object> headers) throws MailException {
		return send(camelcontext, subject, message, from, to, cc, headers, String.class);
	}

	/**
	 * Send an e-mail. Use default bean configuration "mailconfigs"
	 *
	 * @param camelcontext
	 *            Camel context
	 * @param subject
	 *            e-mail Subject
	 * @param message
	 *            e-mail Message
	 * @param from
	 *            e-mail From
	 * @param to
	 *            e-mail To
	 * @param cc
	 *            e-mail Cc
	 * @return Can be NULL. Input Body can be returned
	 * @throws MailException
	 */
	public static String send(CamelContext camelcontext, String subject, String message, String from, String to, String cc) throws MailException {
		return send(camelcontext, subject, message, from, to, cc, null);
	}

	/*
	 * Create e-mail URI
	 */
	private static String createURI(CamelContext camelcontext, String subject, String from, String to, String cc, String bcc, String contentType, String configurationBean)
			throws MailException {
		try {
			Config mc = Camel.getConfigurationBean(camelcontext, configurationBean);

			String uri = "smtp://" + mc.getString("server") + ":" + mc.getString("port") + "?subject=" + subject + "&from=" + from + "&to=" + to;
			if (mc.getString("user") != null && mc.getString("user").length() > 0) {
				String password = mc.getString("password");
				String cryptBeanID = mc.getStringQuietly("cryptBean");
				if (cryptBeanID != null) {
					CryptInterface crypt = camelcontext.getRegistry().lookupByNameAndType(cryptBeanID, CryptInterface.class);
					if (crypt != null) {
						password = crypt.deCrypt(password.getBytes());
					}
				}

				uri += "&username=" + mc.getString("user") + "&password=" + password;
			}
			if (cc != null && cc.trim().length() > 0) {
				uri += "&CC=" + cc;
			}
			if (bcc != null && bcc.trim().length() > 0) {
				uri += "&BCC=" + bcc;
			}
			if (contentType != null && contentType.trim().length() > 0) {
				uri += "&contentType=" + contentType;
			}

			return uri;
		} catch (Exception ex) {
			throw new MailException(ex);
		}
	}
}
