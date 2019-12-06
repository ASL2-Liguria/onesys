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

import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;
import java.util.Arrays;

import javax.net.ssl.SSLSocket;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.data.UID;
import org.dcm4che2.net.Association;
import org.dcm4che2.net.PDVInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Roberto Rizzo
 */
final class Receiver4Consumer extends elco.dicom.receive.Receiver {

	private static final Logger logger = LoggerFactory.getLogger(Receiver4Consumer.class);
	private final DICOMConsumer consumer;
	private final ArrayList<String> remoteAETs;
	private String operationType;
	private boolean stgCmt = false;
	private String[] tSUIDS = { UID.ExplicitVRLittleEndian, UID.ImplicitVRLittleEndian, UID.ExplicitVRBigEndian };

	public Receiver4Consumer(DICOMConsumer consumer) {
		super(consumer.getEndpoint().getLocalAET(), consumer.getAdditionalAbstractsSyntax());
		this.consumer = consumer;
		stgCmt = consumer.getEndpoint().getStgCmt();

		if (stgCmt) {
			setStgCmtReuseFrom(true);
			setStgCmtReuseTo(true);
		}

		remoteAETs = (ArrayList<String>) consumer.getEndpoint().getRemoteAETsAsList();
		operationType = consumer.getEndpoint().getOperationType();
		if (operationType == null) {
			operationType = "in";
		}

		setTransferSyntax(null); // set default transfers syntax

		logger.info("Storage commitment: {} - Operation type: {}", stgCmt, operationType);
	}

	@Override
	public void setTransferSyntax(String[] pTSUIDS) {
		if (pTSUIDS != null && pTSUIDS.length > 0) {
			ArrayList<String> listTSUIDS = new ArrayList<>(Arrays.asList(tSUIDS));
			for (String tsuid : pTSUIDS) {
				if (!listTSUIDS.contains(tsuid)) {
					listTSUIDS.add(tsuid);
					logger.info("Added transfer syntax {}", tsuid);
				} else {
					logger.info("Transfer syntax {} already present", tsuid);
				}
			}
			tSUIDS = listTSUIDS.toArray(new String[listTSUIDS.size()]);
		}

		super.setTransferSyntax(tSUIDS);
	}

	@Override
	protected boolean isStgcmtEnabled() {
		return stgCmt;
	}

	@Override
	protected boolean isStoreFile() {
		return true;
	}

	@Override
	protected void onCStoreRQ(Association as, int pcid, DicomObject rq, PDVInputStream dataStream, String tsuid, DicomObject rsp) throws IOException {
		Exchange exchange = consumer.getEndpoint().createExchange();
		exchange.setProperty(Exchange.CHARSET_NAME, consumer.getEndpoint().getEncoding());

		Socket socket = as.getSocket();
		if (socket instanceof SSLSocket) {
			logger.info("Using chiper suite: {}", ((SSLSocket) socket).getSession().getCipherSuite());
		}

		String remoteAET = as.getRemoteAET();

		Message in = exchange.getIn();
		in.setBody(dataStream, PDVInputStream.class);
		in.setHeader("association", as);
		in.setHeader("request", rq);
		in.setHeader("response", rsp);
		in.setHeader("pcid", pcid);
		in.setHeader("tsuid", tsuid);
		in.setHeader("localAET", as.getLocalAET());
		in.setHeader("remoteAET", remoteAET);
		in.setHeader("callingAET", as.getCallingAET());
		in.setHeader("calledAET", as.getCalledAET());
		in.setHeader("affectedSOPClassUID", rq.getString(Tag.AffectedSOPClassUID));
		in.setHeader("affectedSOPInstanceUID", rq.getString(Tag.AffectedSOPInstanceUID));
		in.setHeader("moveOriginatorApplicationEntityTitle", rq.getString(Tag.MoveOriginatorApplicationEntityTitle));
		in.setHeader("moveOriginatorMessageID", rq.getInt(Tag.MoveOriginatorMessageID));
		in.setHeader("messageID", rsp.getInt(Tag.MessageIDBeingRespondedTo));
		in.setHeader("status", rsp.getInt(Tag.Status));

		try {
			verifyAETs(remoteAET);
			consumer.getProcessor().process(exchange);
		} catch (Exception ex) {
			exchange.setException(ex);
		}

		// handle any thrown exception
		if (exchange.getException() != null) {
			consumer.getExceptionHandler().handleException("Error processing exchange", exchange, exchange.getException());
			throw new IOException(exchange.getException());
		}
	}

	private void verifyAETs(String premoteAET) throws IOException {
		if (remoteAETs != null) {
			if ("in".equalsIgnoreCase(operationType)) {
				if (!remoteAETs.contains(premoteAET)) {
					throw new IOException("Not allowed from AET: " + premoteAET);
				}
			} else if ("notin".equalsIgnoreCase(operationType)) {
				if (remoteAETs.contains(premoteAET)) {
					throw new IOException("Not allowed from AET: " + premoteAET);
				}
			} else {
				throw new IOException("Invalid operation type: " + operationType);
			}
		}
	}
}
