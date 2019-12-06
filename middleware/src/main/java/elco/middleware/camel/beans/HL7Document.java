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

import java.io.IOException;
import java.util.HashMap;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.camel.CamelContext;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.parser.GenericParser;
import ca.uhn.hl7v2.parser.Parser;
import ca.uhn.hl7v2.parser.PipeParser;
import elco.hl7.parser.DefaultXMLParser;
import elco.insc.Constants;
import elco.insc.HL7;
import elco.middleware.camel.beans.storeobjects.FileStore;
import elco.middleware.camel.beans.storeobjects.HL7DocumentStore;

/**
 * Class for HL7 messages management
 *
 * @author Roberto Rizzo
 */
public final class HL7Document extends XMLDocument {

	private static final HashMap<String, HL7DocumentStore> templates = new HashMap<>();
	private CamelContext camelcontext = null;
	private elco.hl7.parser.XMLParser xmlParser = null;
	private static final String[] keepAsOriginalNodes = null;

	protected HL7Document(CamelContext camelcontext, String document, String characterset) throws SAXException {
		super(document, characterset);
		this.camelcontext = camelcontext;
	}

	protected HL7Document(CamelContext camelcontext, Node node, String characterset) throws ParserConfigurationException {
		super(node, characterset);
		this.camelcontext = camelcontext;
	}

	/**
	 * Create an HL7Document from an HL7 XML String
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param document
	 *            HL7 document in XML format
	 * @param characterset
	 *            character set to use
	 * @return input XML as HL7Document
	 * @throws IOException
	 */
	public static HL7Document getDocument(CamelContext camelcontext, String document, String characterset) throws IOException {
		try {
			return new HL7Document(camelcontext, document, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * @param camelcontext
	 *            CamelContext object
	 * @param filePath
	 *            file path to HL7 document in XML format
	 * @param characterset
	 *            character set to use
	 * @return input XML as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromFile(CamelContext camelcontext, String filePath, String characterset) throws HL7Exception {
		HL7Document hl7Document = null;

		try {
			FileStore templateFile = getFileStore(filePath, characterset);
			HL7DocumentStore template = templates.get(filePath);
			if (template == null || !template.getSHA1().equals(templateFile.getSHA1())) {
				HL7Document document = getDocument(camelcontext, templateFile.getFile(), characterset);
				template = HL7DocumentStore.getStore(document, templateFile.getSHA1());
				templates.put(filePath, template);
			}
			hl7Document = template.getDocument().duplicate();
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7Document;
	}

	/**
	 * Create an HL7Document from an HL7 w3c Node
	 *
	 * @param camelcontext
	 * @param node
	 * @param characterset
	 * @return input w3c Node as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocument(CamelContext camelcontext, Node node, String characterset) throws HL7Exception {
		HL7Document hl7Document = null;

		try {
			hl7Document = new HL7Document(camelcontext, node, characterset);
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7Document;
	}

	/**
	 * Create an HL7Document from an HL7 pipe String
	 *
	 * @param pipeMessage
	 *            HL7 document in pipe format
	 * @param characterset
	 *            character set to use
	 * @return input HL7 pipe as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromPipe(CamelContext camelcontext, String pipeMessage, String characterset) throws HL7Exception {
		HL7Document hl7Document = null;

		try {
			String document = HL7.hl7String2XmlString(pipeMessage, characterset);
			hl7Document = new HL7Document(camelcontext, document, characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7Document;
	}

	/**
	 * Create an HL7Document from an HL7 pipe String
	 *
	 * @param pipeMessage
	 *            HL7 document in pipe format
	 * @param characterset
	 *            character set to use
	 * @param pipeParser
	 *            PipeParser to use
	 * @return input HL7 pipe as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromPipe(CamelContext camelcontext, String pipeMessage, String characterset, PipeParser pipeParser, elco.hl7.parser.XMLParser xmlParser)
			throws HL7Exception {
		HL7Document hl7Document = null;

		try {
			String document = HL7.hl7String2XmlString(pipeMessage, characterset, pipeParser, xmlParser);
			hl7Document = new HL7Document(camelcontext, document, characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7Document;
	}

	/**
	 * Verify if the input Pipe HL7 message is a positive HL7 ACK
	 *
	 * @param ackPipe
	 *            pipe HL7 message String
	 * @return error description if it isn't a positive ACK else an empty String
	 */
	public String isPositiveACKPipe(String ackPipe) throws HL7Exception {
		String ackXML = HL7.hl7String2XmlString(ackPipe, Constants.DEFAULT_VM_CHARSET);

		return isPositiveACKXML(ackXML);
	}

	/**
	 * Verify if the input XML HL7 message is a positive HL7 ACK
	 *
	 * @param ackXML
	 *            XML HL7 message String
	 * @return error description if it isn't a positive ACK else an empty String
	 */
	public String isPositiveACKXML(String ackXML) {
		return HL7.isPositiveACKXML(ackXML);
	}

	/**
	 * Version dependent:<br>
	 * > 2.3 ->'MSH.9/MSG.1'_'MSH.9/MSG.2'<br>
	 * <= 2.3 -> 'MSH.9/CM_MSG.1'_'MSH.9/CM_MSG.2'
	 *
	 * @return 'MSH.9/MSG.1'_'MSH.9/MSG.2' or 'MSH.9/CM_MSG.1'_'MSH.9/CM_MSG.2'
	 */
	public String getType() {
		String msg1 = getString("//MSH/MSH.9/MSG.1");
		String msg2 = getString("//MSH/MSH.9/MSG.2");
		if (msg1 == null || msg2 == null) { // version <= 2.3
			msg1 = getString("//MSH/MSH.9/CM_MSG.1");
			msg2 = getString("//MSH/MSH.9/CM_MSG.2");
		}
		if (msg1 == null || msg2 == null) {
			return "UNKNOWN";
		}

		return msg1.toUpperCase() + "_" + msg2.toUpperCase();
	}

	/**
	 * Version dependent: MSH.12/VID.1 or MSH.12
	 *
	 * @return MSH.12/VID.1 or MSH.12
	 */
	public String getVersion() {
		String version = getString("//MSH/MSH.12/VID.1");
		if (version == null) { // version <= 2.3
			version = getString("//MSH/MSH.12");
		}
		if (version == null) {
			return "UNKNOWN";
		}

		return version;
	}

	/**
	 * MSH.10
	 *
	 * @return MSH.10
	 */
	public String getControlID() {
		return getString("//MSH/MSH.10");
	}

	/**
	 * @param xpath
	 *            path to YYYYMMDDHH24MISS
	 * @return YYYYMMDD
	 */
	public String getDate(String xpath) {
		return HL7.getDatePart(getString(xpath));
	}

	/**
	 * @param xpath
	 *            path to YYYYMMDDHH24MISS
	 * @return HH24:MI
	 */
	public String getTime(String xpath) {
		return HL7.getTimePart(getString(xpath));
	}

	/**
	 * Return a String representing the message in pipe format
	 *
	 * @return HL7 document as a String in pipe format
	 * @throws HL7Exception
	 */
	public String toPipe() throws HL7Exception {
		Message message = toMessage();
		if (message.getParser() instanceof elco.hl7.parser.PipeParser) {
			return message.toString();
		}

		// viene cambiato il parser per usarne uno senza validazioni. Sarebbe da rivedere
		Parser oldParser = message.getParser();
		message.setParser(PipeParser.getInstanceWithNoValidation());
		String pipeString = message.toString();
		message.setParser(oldParser);

		return pipeString;
	}

	/**
	 * Return a Message object from the HL7Document
	 *
	 * @return message as HL7 Message object
	 * @throws HL7Exception
	 */
	public Message toMessage() throws HL7Exception {
		Message message = null;

		try {
			if (xmlParser != null) {
				DefaultXMLParser elcoPrivateParser = (DefaultXMLParser) xmlParser;
				elcoPrivateParser.setTextEncoding(characterset);
				elcoPrivateParser.getParserConfiguration().setValidating(false);
				if (keepAsOriginalNodes != null) { // NOSONAR
					elcoPrivateParser.setKeepAsOriginalNodes(keepAsOriginalNodes);
				}
				message = elcoPrivateParser.parseDocument(doc, getVersion());
			} else {
				message = HL7.hl7Document2Message(doc, characterset, getVersion(), keepAsOriginalNodes);
			}
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return message;
	}

	/**
	 * Create a duplicate of the message
	 *
	 * @return duplicate of message as HL7Document
	 * @throws IOException
	 */
	@Override
	public HL7Document duplicate() throws IOException {
		return getDocument(camelcontext, toString(), characterset);
	}

	/**
	 * Try base HL7 validation on the object
	 *
	 * @throws HL7Exception
	 */
	public void validate() throws HL7Exception {
		try {
			GenericParser parser = new GenericParser();
			parser.parse(toString());
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}
	}

	/**
	 * Create an ACK for the message
	 *
	 * @return ACK
	 * @throws HL7Exception
	 */
	public String makePositiveResponse() throws HL7Exception {
		String ack;

		try {
			ack = HL7.makePositiveResponse(toPipe());
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return ack;
	}

	/**
	 * Create a NACK for the message
	 *
	 * @param exception
	 *            Exception included in the NACK
	 * @return NACK
	 * @throws HL7Exception
	 */
	public String makeNegativeResponse(Exception exception) throws HL7Exception {
		String ack;

		try {
			ack = HL7.makeNegativeResponse(toPipe(), exception);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return ack;
	}

	/**
	 * Create a NACK for the message
	 *
	 * @param message
	 *            Error message included in the NACK
	 * @return NACK
	 * @throws HL7Exception
	 */
	public String makeNegativeResponse(String message) throws HL7Exception {
		String ack;

		try {
			ack = HL7.makeNegativeResponse(toPipe(), message);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return ack;
	}

	/**
	 * Set a personal parser to use as XML parser
	 *
	 * @param parser
	 *            elco.hl7.parser.DefaultXMLParser parser instance. Pass NULL to remove personal parser
	 */
	public void setParser(DefaultXMLParser parser) {
		xmlParser = parser;
	}

	// //////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////

	/**
	 * Patient Name (//PID/PID.5/XPN.2)
	 *
	 * @return patient name
	 */
	public String getPatientName() {
		return getString("//PID/PID.5/XPN.2");
	}

	/**
	 * Patient Surname (//PID/PID.5/XPN.1/FN.1)
	 *
	 * @return patient surname
	 */
	public String getPatientSurname() {
		return getString("//PID/PID.5/XPN.1/FN.1");
	}

	/**
	 * Patient Birthday (//PID/PID.7/TS.1)
	 *
	 * @return patient birthday
	 */
	public String getPatientBirthday() {
		return getString("//PID/PID.7/TS.1");
	}

	/**
	 * Patient Sex (//PID/PID.8)
	 *
	 * @return patient sex
	 */
	public String getPatientSex() {
		return getString("//PID/PID.8");
	}

	/**
	 * Patient account number (//PID/PID.18/CX.1) (CODICE FISCALE)
	 *
	 * @return patient account number
	 */
	public String getPatientAccountNumber() {
		return getString("//PID/PID.18/CX.1");
	}

	/**
	 * Patient Birth Place (//PID/PID.23) (COMUNE DI NASCITA)
	 *
	 * @return patient birth place
	 */
	public String getPatientBirthPlace() {
		return getString("//PID/PID.23");
	}

	/**
	 * Patient Class PV1 (//PV1/PV1.2)
	 *
	 * @return patient class
	 */
	public String getPatientClass() {
		return getString("//PV1/PV1.2");
	}

	/**
	 * Assigned Patient Location (//PV1/PV1.3/PL.1)
	 *
	 * @return assigned patient location
	 */
	public String getPatientAssignedLocation() {
		return getString("//PV1/PV1.3/PL.1");
	}

	/**
	 * Patient Visit Number (//PV1/PV1.19/CX.1)
	 *
	 * @return patient visit number
	 */
	public String getPatientVisitNumber() {
		return getString("//PV1/PV1.19/CX.1");
	}
}
