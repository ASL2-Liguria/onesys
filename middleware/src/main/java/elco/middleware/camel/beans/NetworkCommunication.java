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
package elco.middleware.camel.beans;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.Socket;

import org.apache.commons.io.IOUtils;

/**
 * @author Roberto Rizzo
 */
public final class NetworkCommunication {

	private Socket				clientSocket	= null;
	private BufferedReader		input			= null;
	private DataOutputStream	output			= null;

	/**
	 * @param serverAddress
	 *            remote server IP or address
	 * @param serverPort
	 *            remote server port
	 * @throws IOException
	 */
	public NetworkCommunication(String serverAddress, int serverPort) throws IOException {
		clientSocket = new Socket(serverAddress, serverPort);
		input = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
		output = new DataOutputStream(clientSocket.getOutputStream());
	}

	/**
	 * Send a String
	 *
	 * @param message
	 *            message to send as String
	 * @return the number of bytes copied
	 * @throws IOException
	 */
	public long send(String message) throws IOException {
		return send(message.getBytes());
	}

	/**
	 * Send an array of bytes
	 *
	 * @param message
	 *            message to send as byte[]
	 * @return the number of bytes copied
	 * @throws IOException
	 */
	public long send(byte[] message) throws IOException {
		ByteArrayInputStream streamMessage = new ByteArrayInputStream(message);
		return send(streamMessage);
	}

	/**
	 * Copy data from message InputStream to socket OutputStream. The InputStream will not be closed
	 *
	 * @param message
	 *            message to send as InputStream
	 * @return the number of bytes copied
	 * @throws IOException
	 */
	public long send(InputStream message) throws IOException {
		long bNumber = IOUtils.copyLarge(message, output);
		output.flush();
		return bNumber;
	}

	/**
	 * This function transforms each int value read into its equivalent char representation and return all values as a String
	 *
	 * @param endReadResponse
	 *            when this value is encountered then function stop to read response
	 * @return response as String
	 * @throws IOException
	 */
	public String receive(int endReadResponse) throws IOException {
		ByteArrayOutputStream response = new ByteArrayOutputStream();
		receive(endReadResponse, response);
		return response.toString();
	}

	/**
	 * This function read integers and return all values as byte[]
	 *
	 * @param endReadResponse
	 *            when this value is encountered then function stop to read response
	 * @return response as byte[]
	 * @throws IOException
	 */
	public byte[] receiveBytes(int endReadResponse) throws IOException {
		ByteArrayOutputStream response = new ByteArrayOutputStream();
		receive(endReadResponse, response);
		return response.toByteArray();
	}

	/**
	 * Copy response to the OutputStream passed as parameter. The OutputStream will not be closed
	 *
	 * @param endReadResponse
	 *            when this value is encountered then function stop to read response
	 * @param output
	 *            response will be write to this OutputStream
	 * @throws IOException
	 */
	public void receive(int endReadResponse, OutputStream output) throws IOException {
		int value = input.read();
		while (value != -1 && value != endReadResponse) {
			output.write(value);
			value = input.read();
		}
	}

	/**
	 * Close quietly input stream, output stream and socket
	 */
	public void close() {
		IOUtils.closeQuietly(input);
		IOUtils.closeQuietly(output);
		IOUtils.closeQuietly(clientSocket);
	}

	/**
	 * @return true if the socket is connected
	 */
	public boolean isConnected() {
		return clientSocket.isConnected();
	}
}
