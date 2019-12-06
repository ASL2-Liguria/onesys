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

import org.apache.camel.Exchange;
import org.apache.camel.Handler;

import elco.exceptions.BaseIntegrationException;

/**
 * Use if the message synchronization is necessary
 *
 * @author Roberto Rizzo
 */
public final class MiddlewareSynchronizedBean extends MainMiddlewareBean {

	/**
	 * @param class2Use
	 *            name of the Class to load and then create a new instance
	 */
	public MiddlewareSynchronizedBean(String class2Use) {
		this.class2Use = class2Use;
	}

	/**
	 * @param class2Use
	 *            name of the Class to load and then create a new instance
	 * @param configurationBeans
	 *            name of beans to use for configuration purpose
	 */
	public MiddlewareSynchronizedBean(String class2Use, String configurationBeans) {
		this.class2Use = class2Use;
		this.configurationBeans = configurationBeans;
	}

	/**
	 * org.apache.camel.Handler (synchronized method)
	 *
	 * @param exchange
	 *            org.apache.camel.Exchange object
	 * @throws BaseIntegrationException
	 */
	@Override
	@Handler
	public synchronized void handler(Exchange exchange) throws BaseIntegrationException {
		super.handler(exchange);
	}
}
