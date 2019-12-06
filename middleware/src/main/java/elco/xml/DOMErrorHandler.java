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
package elco.xml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.DOMError;
import org.w3c.dom.Node;

/**
 * <p>
 * <b>org.w3c.dom.DOMErrorHandler interface implementation</b>
 * </p>
 * <p>
 * org.w3c.dom.DOMErrorHandler is a callback interface that the DOM implementation can call when reporting errors that happens while processing XML
 * data, or when doing some other processing (e.g. validating a document). A DOMErrorHandler object can be attached to a Document using the
 * "error-handler" on the DOMConfiguration interface. If more than one error needs to be reported during an operation, the sequence and numbers of the
 * errors passed to the error handler are implementation dependent.
 * </p>
 * <p>
 * The application that is using the DOM implementation is expected to implement this interface.
 * </p>
 *
 * @author Roberto Rizzo
 */
public final class DOMErrorHandler implements org.w3c.dom.DOMErrorHandler {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Override
	public boolean handleError(DOMError error) {
		if (logger.isDebugEnabled()) {
			logger.debug("severty = {}, type = {}, message = {}", error.getSeverity(), error.getType(), error.getMessage());
			Node node = error.getLocation().getRelatedNode();
			if (node != null) {
				logger.debug("nodeName = {}", node.getNodeName());
			}
		}

		return true;
	}
}
