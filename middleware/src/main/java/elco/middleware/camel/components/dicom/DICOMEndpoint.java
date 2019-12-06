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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.camel.Component;
import org.apache.camel.Consumer;
import org.apache.camel.Processor;
import org.apache.camel.Producer;
import org.apache.camel.api.management.ManagedAttribute;
import org.apache.camel.api.management.ManagedResource;
import org.apache.camel.impl.DefaultEndpoint;
import org.apache.commons.lang3.StringUtils;

import elco.insc.Constants;

/**
 * @author Roberto Rizzo
 */
@ManagedResource(description = "Managed DICOMEndpoint")
public final class DICOMEndpoint extends DefaultEndpoint {

	private String localAET;
	private ArrayList<String> remoteAETs;
	private String ip;
	private int port = 104;
	private String operationType;
	private boolean stgCmt = false;
	private String abstractSyntaxBean = "";
	private String transferSyntaxBean = "";
	private String tlsConfigurationBean = "";
	private String charset = Constants.DEFAULT_VM_CHARSET;

	public DICOMEndpoint(String uri, Component component, String ip, int port) {
		super(uri, component);
		this.ip = ip;
		this.port = port;
	}

	@Override
	public Producer createProducer() throws Exception {
		return new DICOMProducer(this);
	}

	@Override
	public Consumer createConsumer(Processor processor) throws Exception {
		return new DICOMConsumer(this, processor);
	}

	@Override
	@ManagedAttribute(description = "Singleton")
	public boolean isSingleton() {
		return true;
	}

	@ManagedAttribute(description = "Camel id")
	public String getCamelId() {
		return this.getCamelContext().getName();
	}

	@ManagedAttribute(description = "Endpoint State")
	public String getState() {
		return getStatus().name();
	}

	@ManagedAttribute(description = "Storage commitment")
	public void setStgCmt(boolean stgCmt) {
		this.stgCmt = stgCmt;
	}

	@ManagedAttribute(description = "Storage commitment")
	public boolean getStgCmt() {
		return stgCmt;
	}

	@ManagedAttribute(description = "Local DICOM AET")
	public void setLocalAET(String localAET) {
		this.localAET = localAET;
	}

	@ManagedAttribute(description = "Local DICOM AET")
	public String getLocalAET() {
		return localAET;
	}

	@ManagedAttribute(description = "Remote DICOM AETs")
	public void setRemoteAETs(String remoteAET) {
		remoteAETs = new ArrayList<>(Arrays.asList(remoteAET.split(",")));
	}

	@ManagedAttribute(description = "Remote DICOM AETs")
	public String getRemoteAETs() {
		return StringUtils.join(remoteAETs, ",");
	}

	public List<String> getRemoteAETsAsList() {
		return remoteAETs;
	}

	@ManagedAttribute(description = "DICOM Port")
	public void setPort(int port) {
		this.port = port;
	}

	@ManagedAttribute(description = "DICOM Port")
	public int getPort() {
		return port;
	}

	@ManagedAttribute(description = "Operation Type")
	public void setOperationType(String operationType) {
		this.operationType = operationType;
	}

	@ManagedAttribute(description = "Operation Type")
	public String getOperationType() {
		return operationType;
	}

	@ManagedAttribute(description = "IP")
	public void setIp(String ip) {
		this.ip = ip;
	}

	@ManagedAttribute(description = "IP")
	public String getIp() {
		return ip;
	}

	@ManagedAttribute(description = "Abstract syntax bean")
	public void setAbstractSyntaxBean(String abstractSyntaxBean) {
		this.abstractSyntaxBean = abstractSyntaxBean;
	}

	@ManagedAttribute(description = "Abstract syntax bean")
	public String getAbstractSyntaxBean() {
		return abstractSyntaxBean;
	}

	@ManagedAttribute(description = "Transfer syntax bean")
	public void setTransferSyntaxBean(String transferSyntaxBean) {
		this.transferSyntaxBean = transferSyntaxBean;
	}

	@ManagedAttribute(description = "Transfer syntax bean")
	public String getTransferSyntaxBean() {
		return transferSyntaxBean;
	}

	@ManagedAttribute(description = "TLS configuration bean")
	public void setTlsConfigurationBean(String tlsConfigurationBean) {
		this.tlsConfigurationBean = tlsConfigurationBean;
	}

	@ManagedAttribute(description = "TLS configuration bean")
	public String getTlsConfigurationBean() {
		return tlsConfigurationBean;
	}

	@ManagedAttribute(description = "Exchange Charset")
	public String getEncoding() {
		return charset;
	}

	@ManagedAttribute(description = "Exchange Charset")
	public void setEncoding(String charset) {
		this.charset = charset;
	}
}
