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
package elco.middleware.camel.components.dicom;

import org.apache.camel.Processor;
import org.apache.camel.impl.DefaultConsumer;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.Camel;
import elco.insc.DICOM;
import elco.middleware.camel.beans.Config;

/**
 * @author Roberto Rizzo
 */
public final class DICOMConsumer extends DefaultConsumer {

	private static final Logger logger = LoggerFactory.getLogger(DICOMConsumer.class);
	private final Receiver4Consumer receiver;
	private String[] additionalAbstractsSyntax = null;
	private String[] additionalTransfersSyntax = null;

	public DICOMConsumer(DICOMEndpoint endpoint, Processor processor) {
		super(endpoint, processor);

		Config config = Camel.getConfigurationBean(endpoint.getCamelContext(), endpoint.getAbstractSyntaxBean());
		if (config != null) {
			additionalAbstractsSyntax = config.getValuesAsString();
		}

		config = Camel.getConfigurationBean(endpoint.getCamelContext(), endpoint.getTransferSyntaxBean());
		if (config != null) {
			additionalTransfersSyntax = config.getValuesAsString();
		}

		receiver = new Receiver4Consumer(this);
		receiver.setPort(endpoint.getPort());
		receiver.setTransferSyntax(additionalTransfersSyntax);
		logger.info("Supported transfers syntax: {}", StringUtils.join(receiver.getTransferSyntax(), ","));
		logger.info("Supported abstracts syntax: {}", StringUtils.join(receiver.getSupportedPresentationContext(), ","));
		receiver.setPackPDV(true);
		receiver.setTcpNoDelay(true);
		receiver.initTransferCapability();

		config = Camel.getConfigurationBean(endpoint.getCamelContext(), endpoint.getTlsConfigurationBean());
		DICOM.tlsConfiguration(receiver, config);
	}

	/**
	 * Get configured additional abstracts syntax
	 *
	 * @return Additional abstracts syntax
	 */
	public String[] getAdditionalAbstractsSyntax() {
		return additionalAbstractsSyntax;
	}

	/**
	 * Get configured additional transfers syntax
	 *
	 * @return Additional transfers syntax
	 */
	public String[] getAdditionalTransfersSyntax() {
		return additionalTransfersSyntax;
	}

	@Override
	public DICOMEndpoint getEndpoint() {
		return (DICOMEndpoint) super.getEndpoint();
	}

	@Override
	protected void doStart() throws Exception {
		if (receiver != null) {
			receiver.start();
		}
	}

	@Override
	protected void doStop() throws Exception {
		if (receiver != null) {
			receiver.stop();
		}
	}
}
