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

import java.io.File;
import java.util.ArrayList;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.component.file.GenericFile;
import org.apache.camel.impl.DefaultProducer;
import org.dcm4che2.util.CloseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.dicom.store.Store;
import elco.insc.Camel;
import elco.insc.DICOM;
import elco.insc.GenericUtils;
import elco.middleware.camel.beans.Config;

/**
 * @author Roberto Rizzo
 */
public final class DICOMProducer extends DefaultProducer {

	private static final Logger logger = LoggerFactory.getLogger(DICOMProducer.class);
	private final String localAET;
	private final String remoteAET;
	private final String ip;
	private int port = 104;
	private boolean stgCmt = false;
	private final Config tlsConfiguration;

	public DICOMProducer(DICOMEndpoint endpoint) {
		super(endpoint);
		stgCmt = endpoint.getStgCmt();
		logger.info("Storage commitment: {}", stgCmt);

		localAET = endpoint.getLocalAET();
		ip = endpoint.getIp();
		port = endpoint.getPort();
		remoteAET = endpoint.getRemoteAETsAsList().get(0);

		tlsConfiguration = Camel.getConfigurationBean(endpoint.getCamelContext(), endpoint.getTlsConfigurationBean());
	}

	@Override
	public void process(Exchange exchange) throws Exception {
		Store sender = null;

		try { // NOSONAR
			Message inMessage = exchange.getIn();
			ArrayList<String> pathToObjects = parseBody(inMessage.getBody());

			Message outMessage = exchange.getOut();
			outMessage.setHeader("callingAET", localAET);
			outMessage.setHeader("calledAET", remoteAET);
			outMessage.setHeader("numberOfFilesSent", 0);
			outMessage.setHeader("numberOfFilesToSend", 0);
			outMessage.setBody(inMessage.getBody());

			if (!pathToObjects.isEmpty()) {
				sender = new Store(localAET);
				sender.setRemoteHost(ip);
				sender.setRemotePort(port);
				sender.setRemoteAETitle(remoteAET);
				sender.setStorageCommitment(stgCmt);

				for (String path : pathToObjects) {
					sender.addFile(path, false);
				}

				sender.configureTransferCapability(); // must be called after addFile

				DICOM.tlsConfiguration(sender, tlsConfiguration);

				sender.open();
				sender.send();

				if (sender.isStorageCommitment() && sender.commit()) {
					try { // NOSONAR
						outMessage.setHeader("stgCmtResult", sender.waitForStgCmtResult());
					} catch (Exception ex) {
						exchange.setException(ex);
					}
				}

				outMessage.setHeader("numberOfFilesSent", sender.getNumberOfFilesSent());
				outMessage.setHeader("numberOfFilesToSend", sender.getNumberOfFilesToSend());
				outMessage.setHeader("fileInfos", sender.getFileInfos());
			}
		} finally {
			CloseUtils.safeClose(sender);
		}
	}

	@Override
	public DICOMEndpoint getEndpoint() {
		return (DICOMEndpoint) super.getEndpoint();
	}

	@SuppressWarnings("unchecked")
	private ArrayList<String> parseBody(Object objectBody) {
		ArrayList<String> pathToObjects = null;

		if (objectBody != null) {
			if (objectBody instanceof ArrayList<?>) {
				pathToObjects = GenericUtils.castTo(objectBody, ArrayList.class);
			} else {
				pathToObjects = new ArrayList<>(1);
				if (objectBody instanceof String) {
					pathToObjects.add(GenericUtils.castTo(objectBody, String.class));
				} else if (objectBody instanceof File) {
					pathToObjects.add(GenericUtils.castTo(objectBody, File.class).getAbsolutePath());
				} else if (objectBody instanceof GenericFile) {
					pathToObjects.add(GenericUtils.castTo(objectBody, GenericFile.class).getAbsoluteFilePath());
				}
			}
		}

		if (pathToObjects == null) {
			throw new NullPointerException("Message Body must be of type ArrayList<String>, String, File or GenericFile");
		}

		return pathToObjects;
	}
}
