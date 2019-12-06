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
package elco.middleware.camel.components.netprotocol;

import javax.naming.OperationNotSupportedException;

import org.apache.camel.Component;
import org.apache.camel.Consumer;
import org.apache.camel.Processor;
import org.apache.camel.Producer;
import org.apache.camel.api.management.ManagedAttribute;
import org.apache.camel.api.management.ManagedResource;
import org.apache.camel.impl.DefaultEndpoint;

import elco.dicom.utils.ConversionUtils;
import elco.insc.Constants;

/**
 * @author Roberto Rizzo
 */
@ManagedResource(description = "Managed TextLineEndpoint")
public final class NetEndpoint extends DefaultEndpoint {

	private String ip = "0.0.0.0"; // NOSONAR
	private int port = -1;
	private int queue = 50;
	private byte[] messageTerminator = ConversionUtils.hexStringToByteArray("0D0A");
	private int readTimeout = 900; // seconds
	private String charset = Constants.DEFAULT_VM_CHARSET;

	public NetEndpoint(String uri, Component component, String ip, int port) {
		super(uri, component);
		this.ip = ip;
		this.port = port;
	}

	@Override
	public Producer createProducer() throws Exception {
		throw new OperationNotSupportedException();
	}

	@Override
	public Consumer createConsumer(Processor processor) throws Exception {
		return new NetConsumer(this, processor);
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

	@ManagedAttribute(description = "Listening Port")
	public void setPort(int port) {
		this.port = port;
	}

	@ManagedAttribute(description = "Listening Port")
	public int getPort() {
		return port;
	}

	@ManagedAttribute(description = "Binding address")
	public void setAddress(String ip) {
		this.ip = ip;
	}

	@ManagedAttribute(description = "Binding address")
	public String getAddress() {
		return ip;
	}

	@ManagedAttribute(description = "Incoming connection queue")
	public void setQueue(int queue) {
		this.queue = queue;
	}

	@ManagedAttribute(description = "Incoming connection queue")
	public int getQueue() {
		return queue;
	}

	@ManagedAttribute(description = "Message terminator")
	public void setMessageTerminator(byte[] messageTerminator) {
		this.messageTerminator = ConversionUtils.hexStringToByteArray(new String(messageTerminator));
	}

	@ManagedAttribute(description = "Message terminator")
	public byte[] getMessageTerminator() {
		return messageTerminator;
	}

	@ManagedAttribute(description = "Read timeout")
	public void setReadTimeout(int readTimeout) {
		this.readTimeout = readTimeout;
	}

	@ManagedAttribute(description = "Read timeout")
	public int getReadTimeout() {
		return readTimeout;
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
