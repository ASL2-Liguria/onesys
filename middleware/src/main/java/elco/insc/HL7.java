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

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.apache.camel.CamelContext;
import org.apache.camel.CamelExecutionException;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import ca.uhn.hl7v2.AcknowledgmentCode;
import ca.uhn.hl7v2.HL7Exception;
import ca.uhn.hl7v2.model.Message;
import ca.uhn.hl7v2.parser.DefaultXMLParser;
import ca.uhn.hl7v2.parser.PipeParser;
import ca.uhn.hl7v2.util.Terser;
import elco.middleware.camel.beans.HL7Document;

/**
 * HL7 utilities
 *
 * @author Roberto Rizzo
 */
public final class HL7 {

	private HL7() {
	}

	/**
	 * Transform an HL7 pipe message String into HL7 XML message String using a middleware XML parser with keepAllAsOriginal = true
	 *
	 * @param pipeMessage
	 *            pipe format
	 * @param characterset
	 *            charcterset to use
	 * @return hl7 message XML format
	 * @throws HL7Exception
	 */
	public static String hl7String2XmlString(String pipeMessage, String characterset) throws HL7Exception {
		String response = "";

		try {
			Message message = getMessage(pipeMessage);
			response = hl7Message2XMLString(message, characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return response;
	}

	/**
	 * Transform an HL7 pipe message String into HL7 XML message String
	 *
	 * @param pipeMessage
	 *            pipe format
	 * @param characterset
	 *            characterset to use
	 * @param pipeParser
	 *            PipeParser to use
	 * @param xmlParser
	 *            XMLParser to use
	 * @return hl7 message XML format
	 * @throws HL7Exception
	 */
	public static String hl7String2XmlString(String pipeMessage, String characterset, PipeParser pipeParser, elco.hl7.parser.XMLParser xmlParser) throws HL7Exception {
		String response = "";

		try {
			Message message = getMessage(pipeMessage, pipeParser);
			response = hl7Message2XMLString(message, characterset, xmlParser);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return response;
	}

	/**
	 * Transform an HL7 Message object into HL7 XML message String using a middleware XML parser with keepAllAsOriginal = true
	 *
	 * @param message
	 *            HL7 Message object
	 * @param characterset
	 *            charcterset to use
	 * @return HL7 message XML format String
	 * @throws HL7Exception
	 */
	public static String hl7Message2XMLString(Message message, String characterset) throws HL7Exception {
		return hl7Message2XMLString(message, characterset, getMiddlewareXMLParser(true));
	}

	/**
	 * Transform an HL7 Message object into HL7 XML message String
	 *
	 * @param message
	 *            HL7 Message object
	 * @param characterset
	 *            charcterset to use
	 * @param xmlParser
	 *            XMLParser to use
	 * @return HL7 message XML format String
	 * @throws HL7Exception
	 */
	public static String hl7Message2XMLString(Message message, String characterset, elco.hl7.parser.XMLParser xmlParser) throws HL7Exception {
		String response = "";

		try {
			if (xmlParser == null) {
				throw new HL7Exception("HL7.hl7Message2XMLString: No HL7/XML parser defined");
			}
			xmlParser.getParserConfiguration().setValidating(false);
			xmlParser.setTextEncoding(characterset);
			response = XML.xml2String(xmlParser.encodeDocument(message), characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return response;
	}

	/**
	 * Transform an HL7 XML String in an HL7 Message object
	 *
	 * @param document
	 *            HL7 XML String
	 * @param characterset
	 *            charcterset to use
	 * @param xmlParser
	 *            XMLParser to use
	 * @return HL7 Message object
	 * @throws HL7Exception
	 */
	public static Message hl7XML2Message(String document, String characterset, elco.hl7.parser.XMLParser xmlParser) throws HL7Exception {
		Message message = null;

		try {
			if (xmlParser == null) {
				throw new HL7Exception("HL7.hl7XML2Message: No HL7/XML parser defined");
			}
			xmlParser.getParserConfiguration().setValidating(false);
			xmlParser.setTextEncoding(characterset);
			message = xmlParser.parse(document);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return message;
	}

	/**
	 * Transform an HL7 XML String in an HL7 Message object
	 *
	 * @param document
	 *            HL7 XML String
	 * @param characterset
	 *            charcterset to use
	 * @return HL7 Message object
	 * @throws HL7Exception
	 */
	public static Message hl7XML2Message(String document, String characterset) throws HL7Exception {
		return hl7XML2Message(document, characterset, null);
	}

	/**
	 * Transform an HL7 w3c DOM Document in an HL7 Message object
	 *
	 * @param document
	 *            HL7 DOM Document
	 * @param characterset
	 *            charcterset to use
	 * @param version
	 *            version
	 * @return HL7 Message object
	 * @throws HL7Exception
	 */
	public static Message hl7Document2Message(Document document, String characterset, String version) throws HL7Exception {
		return hl7Document2Message(document, characterset, version, null);
	}

	/**
	 * Transform an HL7 w3c DOM Document in an HL7 Message object using an XML HAPI parser
	 *
	 * @param document
	 *            HL7 DOM Document
	 * @param characterset
	 *            charcterset to use
	 * @param version
	 *            HL7 version
	 * @param keepAsOriginalNodes
	 *            List of nodes to keep as original
	 * @return HL7 Message object
	 * @throws HL7Exception
	 */
	public static Message hl7Document2Message(Document document, String characterset, String version, String[] keepAsOriginalNodes) throws HL7Exception {
		Message message = null;

		try {
			DefaultXMLParser xmlParser = new DefaultXMLParser();
			xmlParser.getParserConfiguration().setValidating(false);
			xmlParser.setTextEncoding(characterset);
			if (keepAsOriginalNodes != null) {
				xmlParser.getParserConfiguration().setXmlDisableWhitespaceTrimmingOnNodeNames(keepAsOriginalNodes);
			}
			message = xmlParser.parseDocument(document, version);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return message;
	}

	/**
	 * Transform an HL7 pipe message String into HL7 XML message byte[]
	 *
	 * @param pipeMessage
	 *            pipe format
	 * @param characterset
	 *            charcterset to use
	 * @return hl7 message XML format
	 * @throws HL7Exception
	 */
	public static byte[] hl7String2XmlBytes(String pipeMessage, String characterset) throws HL7Exception {
		byte[] response = null;

		try {
			response = hl7String2XmlString(pipeMessage, characterset).getBytes(characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return response;
	}

	/**
	 * Transform an HL7 pipe message String into HL7 Message object
	 *
	 * @param message
	 *            pipe format String
	 * @return Message HL7
	 * @throws HL7Exception
	 */
	public static Message getMessage(String message) throws HL7Exception {
		return getMessage(message, PipeParser.getInstanceWithNoValidation());
	}

	/**
	 * Transform an HL7 pipe message String into HL7 Message object using the PipeParser passed as parameter
	 *
	 * @param message
	 *            pipe format String
	 * @param parser
	 *            PipeParser
	 * @return Message HL7
	 * @throws HL7Exception
	 */
	public static Message getMessage(String message, PipeParser parser) throws HL7Exception {
		Message messageNew = null;

		try {
			messageNew = parser.parse(message);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return messageNew;
	}

	/**
	 * <p>
	 * Return an elco.hl7.parser.PipeParser instance with <font color='red'><b>no</b></font> validation context </p>
	 *
	 * @param escapes
	 *            Set true for escapes conversion = \X0D\ --> \r, \X0A\ --> \n
	 * @return elco.hl7.parser.PipeParser object
	 */
	public static elco.hl7.parser.PipeParser getMiddlewarePipeParser(boolean escapes) {
		elco.hl7.parser.PipeParser pipeParser = elco.hl7.parser.PipeParser.getInstanceWithNoValidation();
		if (escapes) {
			pipeParser.addEscape("\\X0D\\", '\r');
			pipeParser.addEscape("\\X0A\\", '\n');
		}

		return pipeParser;
	}

	/**
	 * <p>
	 * Return an elco.hl7.parser.PipeParser instance with a validation context
	 * </p>
	 *
	 * @param escapes
	 *            Set true for escapes conversion = \X0D\ --> \r, \X0A\ --> \n
	 * @return elco.hl7.parser.PipeParser object
	 */
	public static elco.hl7.parser.PipeParser getMiddlewarePipeParserWithValidation(boolean escapes) {
		elco.hl7.parser.PipeParser pipeParser = elco.hl7.parser.PipeParser.getInstanceWithValidation();
		if (escapes) {
			pipeParser.addEscape("\\X0D\\", '\r');
			pipeParser.addEscape("\\X0A\\", '\n');
		}

		return pipeParser;
	}

	/**
	 * Return an elco.hl7.parser.DefaultXMLParser instance with no validation context
	 *
	 * @param keepAllAsOriginal
	 *            Set to true to keep all segments as original
	 * @return elco.hl7.parser.DefaultXMLParser object
	 */
	public static elco.hl7.parser.DefaultXMLParser getMiddlewareXMLParser(boolean keepAllAsOriginal) {
		elco.hl7.parser.DefaultXMLParser xmlParser = elco.hl7.parser.DefaultXMLParser.getInstanceWithNoValidation();
		xmlParser.setKeepAllAsOriginal(keepAllAsOriginal);

		return xmlParser;
	}

	/**
	 * <p>
	 * Regenerate an HL7 Message object
	 * </p>
	 * <p>
	 * Transform the input object in a String object then parse it again and create a new Message object
	 * </p>
	 *
	 * @param message
	 *            Message object
	 * @return regenerated Message object
	 * @throws HL7Exception
	 */
	public static Message regenerateMessage(Message message) throws HL7Exception {
		return regenerateMessage(message, PipeParser.getInstanceWithNoValidation());
	}

	/**
	 * <p>
	 * Regenerate an HL7 Message object
	 * </p>
	 * <p>
	 * Transform the input object in a String object then parse it again and create a new Message object
	 * </p>
	 *
	 * @param message
	 *            Message object
	 * @param parser
	 *            PipeParser to use
	 * @return regenerated Message object
	 * @throws HL7Exception
	 */
	public static Message regenerateMessage(Message message, PipeParser parser) throws HL7Exception {
		Message messageNew = null;

		try {
			message.setParser(parser);
			messageNew = getMessage(message.toString(), parser);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return messageNew;
	}

	/**
	 * Return a Terser object for an HL7 Message object
	 *
	 * @param message
	 * @return Terser object
	 */
	public static Terser getTerser(Message message) {
		return new Terser(message);
	}

	/**
	 * Return a duplicate of a Message object
	 *
	 * @param message
	 * @return duplicated Message
	 */
	public static Message duplicateMessage(Message message) {
		return message.getMessage();
	}

	/**
	 * Generate an HL7 pipe message positive ACK from an HL7 String pipe message
	 *
	 * @param message
	 *            pipe or xml format
	 * @return ACK
	 * @throws HL7Exception
	 */
	public static String makePositiveResponse(String message) throws HL7Exception {
		return makeResponse(message, "AA", null);
	}

	/**
	 * Generate an HL7 pipe message negative ACK from an HL7 String pipe message. If '_exception' is NULL no ERR segment will be create
	 *
	 * @param message
	 *            pipe format
	 * @param exception
	 *            can be NULL
	 * @return NACK AE
	 * @throws HL7Exception
	 */
	public static String makeNegativeResponse(String message, Exception exception) throws HL7Exception {
		return makeResponse(message, "AE", exception);
	}

	/**
	 * Generate an HL7 pipe message negative ACK from an HL7 String pipe message without ERR segment
	 *
	 * @param message
	 *            pipe format
	 * @return NACK AE
	 * @throws HL7Exception
	 */
	public static String makeNegativeResponse(String message) throws HL7Exception {
		return makeResponse(message, "AE", null);
	}

	/**
	 * Generate an HL7 pipe message negative ACK from an HL7 String pipe message. If '_errorDescription' is NULL no ERR segment will be create
	 *
	 * @param message
	 *            pipe format
	 * @param errorDescription
	 *            can be NULL
	 * @return NACK AE
	 * @throws HL7Exception
	 */
	public static String makeNegativeResponse(String message, String errorDescription) throws HL7Exception {
		return makeResponse(message, "AE", errorDescription);
	}

	/**
	 * Generate an HL7 pipe message ACK (AA, AE, AR) from an HL7 String pipe message. If '_error' is NULL no ERR segment will be create
	 *
	 * @param message
	 *            pipe format
	 * @param type
	 *            AA, AE, AR
	 * @param error
	 *            can be NULL
	 * @return ACK
	 * @throws HL7Exception
	 */
	public static String makeResponse(String message, String type, Object error) throws HL7Exception {
		String response = "";

		try {
			HL7Exception exc = null;
			if (error != null) {
				if (error instanceof Exception) {
					exc = new HL7Exception((Exception) error);
				} else if (error instanceof String) {
					exc = new HL7Exception((String) error);
				}
			}

			Message msg = getMessage(message);
			Terser tMsg = HL7.getTerser(msg);
			String msh31 = tMsg.get("/MSH-3-1");
			String msh41 = tMsg.get("/MSH-4-1");
			String msh51 = tMsg.get("/MSH-5-1");
			String msh61 = tMsg.get("/MSH-6-1");

			Message rsp = msg.generateACK(AcknowledgmentCode.valueOf(type), exc);
			Terser tRsp = HL7.getTerser(rsp);
			tRsp.set("/MSH-3-1", msh51);
			tRsp.set("/MSH-4-1", msh61);
			tRsp.set("/MSH-5-1", msh31);
			tRsp.set("/MSH-6-1", msh41);
			response = rsp.toString();
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return response;
	}

	/**
	 * Verify if the input Pipe HL7 message is a positive HL7 ACK
	 *
	 * @param ackPipe
	 *            pipe HL7 message String
	 * @return error description if it isn't a positive ACK else an empty String
	 */
	public static String isPositiveACKPipe(String ackPipe) throws HL7Exception {
		String ackXML = hl7String2XmlString(ackPipe, Constants.DEFAULT_VM_CHARSET);

		return isPositiveACKXML(ackXML);
	}

	/**
	 * Verify if the input XML HL7 message is a positive HL7 ACK
	 *
	 * @param ackXML
	 *            XML HL7 message String
	 * @return error description if it isn't a positive ACK (MSA.1 != 'AA' && MAS.1 != 'CA') else an empty String
	 */
	public static String isPositiveACKXML(String ackXML) {
		String error = "";

		try {
			HL7Document response = getDocument(null, ackXML);
			String msa1 = response.getString("//MSA.1");
			if (!"AA".equalsIgnoreCase(msa1) && !"CA".equalsIgnoreCase(msa1)) {
				if (response.existsNode("//ERR")) {
					throw new HL7Exception(response.getString("//HELD.4/CE.5"));
				}

				throw new HL7Exception("Response error");
			}
			error = "";
		} catch (Exception ex) { // NOSONAR
			error = ex.getLocalizedMessage();
		}

		return error;
	}

	/**
	 * Generate a unique random value. Current time in milliseconds plus a random long
	 *
	 * @return String representing a unique random value
	 */
	public static String getRandomUniqueID() {
		long randomValue = (new Random()).nextLong();
		if (randomValue == Long.MIN_VALUE) {
			randomValue = Long.MAX_VALUE;
		}
		return Long.toString(System.currentTimeMillis() + Math.abs(randomValue));
	}

	/**
	 * Generate a unique value. Current time in milliseconds
	 *
	 * @return String representing a unique value (currentTimeMillis)
	 */
	public static String getUniqueIDTime() {
		return Long.toString(System.currentTimeMillis());
	}

	/**
	 * Generate a random UUID
	 *
	 * @return random universally unique identifier
	 */
	public static String getRandomUUID() {
		return UUID.randomUUID().toString();
	}

	/**
	 * Generate a random URN
	 *
	 * @return random urn universally unique identifier
	 */
	public static String getRandomURN() {
		return "urn:uuid:" + getRandomUUID();
	}

	/**
	 * Send an HL7 message to a destination using MLLP
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param destination
	 *            IP:PORT
	 * @param message
	 *            HL7 pipe message
	 * @param timeout
	 *            Server response timeout
	 * @param sync
	 *            true/false
	 * @param codec
	 *            codec name without # (es. hl7codec)
	 * @param headers
	 *            Map of camel headers
	 * @return HL7 pipe message response
	 * @throws HL7Exception
	 */
	public static String sendMessage(CamelContext camelcontext, String destination, String message, String timeout, boolean sync, String codec, Map<String, Object> headers)
			throws HL7Exception {
		String returnMessage = "";

		try {
			returnMessage = Camel.to(camelcontext, "mina2:tcp://" + destination + "?sync=" + sync + "&codec=#" + codec + "&timeout=" + timeout + "&disconnect=false", message,
					headers);
		} catch (CamelExecutionException ex) {
			throw new HL7Exception(ex);
		}

		return returnMessage;
	}

	/**
	 * Send an HL7 message to a destination using MLLP
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param destination
	 *            IP:PORT
	 * @param message
	 *            HL7 pipe message
	 * @param sync
	 *            true/false
	 * @param codec
	 *            codec name without # (es. hl7codec)
	 * @param headers
	 *            Map of camel headers
	 * @return HL7 pipe message response
	 * @throws HL7Exception
	 */
	public static String sendMessage(CamelContext camelcontext, String destination, String message, boolean sync, String codec, Map<String, Object> headers) throws HL7Exception {
		return sendMessage(camelcontext, destination, message, "10000", sync, codec, headers);
	}

	/**
	 * <p>
	 * Send an HL7 message to a destination using MLLP
	 * </p>
	 * <p>
	 * sync=true, must be defined hl7codec
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param destination
	 *            IP:PORT
	 * @param message
	 *            HL7 pipe message
	 * @return HL7 pipe message response
	 * @throws HL7Exception
	 */
	public static String sendMessage(CamelContext camelcontext, String destination, String message) throws HL7Exception {
		return sendMessage(camelcontext, destination, message, true, "hl7codec", null);
	}

	/**
	 * <p>
	 * Send an HL7 message to a destination using MLLP. Manage timeout
	 * </p>
	 * <p>
	 * sync=true, must be defined hl7codec
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param destination
	 *            IP:PORT
	 * @param message
	 *            HL7 pipe message
	 * @param timeout
	 *            Server response timeout in milliseconds
	 * @return HL7 pipe message response
	 * @throws HL7Exception
	 */
	public static String sendMessage(CamelContext camelcontext, String destination, String message, String timeout) throws HL7Exception {
		return sendMessage(camelcontext, destination, message, timeout, true, "hl7codec", null);
	}

	/**
	 * <p>
	 * Send an HL7 message to a destination using MLLP
	 * </p>
	 * <p>
	 * sync=true, must be defined hl7codec
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param destination
	 *            IP:PORT
	 * @param message
	 *            HL7 pipe message
	 * @param headers
	 *            Map of camel headers
	 * @return HL7 pipe message response
	 * @throws HL7Exception
	 */
	public static String sendMessage(CamelContext camelcontext, String destination, String message, Map<String, Object> headers) throws HL7Exception {
		return sendMessage(camelcontext, destination, message, true, "hl7codec", headers);
	}

	/**
	 * Return YYYYMMDD from YYYYMMDDHH24MISS
	 *
	 * @param dateTime
	 *            YYYYMMDDHH24MISS
	 * @return YYYYMMDD
	 */
	public static String getDatePart(String dateTime) {
		return dateTime.substring(0, 8);
	}

	/**
	 * Return HH24:MI from YYYYMMDDHH24MISS
	 *
	 * @param dateTime
	 *            YYYYMMDDHH24MISS
	 * @return HH24:MI
	 */
	public static String getTimePart(String dateTime) {
		return dateTime.substring(8, 10) + ":" + dateTime.substring(10, 12);
	}

	/**
	 * call GenericUtils.getDate()
	 *
	 * @return now date yyyyMMdd
	 */
	public static String getDate() {
		return GenericUtils.getDate();
	}

	/**
	 * call GenericUtils.getTime()
	 *
	 * @return now time HH:mm
	 */
	public static String getTime() {
		return GenericUtils.getTime();
	}

	/**
	 * @return now yyyyMMddHHmmss
	 */
	public static String getDateTime() {
		return getDateTime("yyyyMMddHHmmss");
	}

	/**
	 * @param format
	 *            date/time format (ex. yyyyMMddHHmmss)
	 * @return formatted date/time
	 */
	public static String getDateTime(String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(new Date());
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 XML message
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param camelcontext
	 *            Camel context object
	 * @param document
	 *            HL7 document
	 * @return HL7Document object
	 * @throws HL7Exception
	 */
	public static HL7Document getDocument(CamelContext camelcontext, String document) throws HL7Exception {
		HL7Document hL7Document = null;

		try {
			hL7Document = HL7Document.getDocument(camelcontext, document, Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hL7Document;
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 XML message
	 * </p>
	 *
	 * @param camelcontext
	 *            Camel context object
	 * @param document
	 *            HL7 document
	 * @param characterset
	 *            to use
	 * @return HL7Document object
	 * @throws HL7Exception
	 */
	public static HL7Document getDocument(CamelContext camelcontext, String document, String characterset) throws HL7Exception {
		HL7Document hL7Document = null;

		try {
			hL7Document = HL7Document.getDocument(camelcontext, document, characterset);
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hL7Document;
	}

	/**
	 * <p>
	 * Return an HL7Document from a Node representing an HL7 part
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext
	 * @param node
	 *            HL7 node
	 * @return HL7Document object
	 * @throws HL7Exception
	 */
	public static HL7Document getDocument(CamelContext camelcontext, Node node) throws HL7Exception {
		HL7Document hL7Document = null;

		try {
			hL7Document = HL7Document.getDocument(camelcontext, node, Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hL7Document;
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 pipe String
	 * </p>
	 * <p>
	 * character set: default vm
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param pipeMessage
	 *            HL7 pipe String
	 * @return input HL7 pipe as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromPipe(CamelContext camelcontext, String pipeMessage) throws HL7Exception {
		return HL7Document.getDocumentFromPipe(camelcontext, pipeMessage, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 pipe String
	 * </p>
	 * <p>
	 * character set: default vm
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param pipeMessage
	 *            HL7 pipe String
	 * @param pipeParser
	 *            PipeParser to use
	 * @param xmlParser
	 *            XMLParser to use
	 * @return input HL7 pipe as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromPipe(CamelContext camelcontext, String pipeMessage, PipeParser pipeParser, elco.hl7.parser.XMLParser xmlParser) throws HL7Exception {
		return HL7Document.getDocumentFromPipe(camelcontext, pipeMessage, Constants.DEFAULT_VM_CHARSET, pipeParser, xmlParser);
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 Message object
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param message
	 *            HL7 Message object
	 * @return input HL7 Message as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromMessage(CamelContext camelcontext, Message message) throws HL7Exception {
		HL7Document hl7document = null;

		try {
			String document = HL7.hl7Message2XMLString(message, Constants.DEFAULT_VM_CHARSET);
			hl7document = HL7.getDocument(camelcontext, document);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7document;
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 Message object
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param message
	 *            HL7 Message object
	 * @param xmlParser
	 *            Parser to use
	 * @return input HL7 Message as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromMessage(CamelContext camelcontext, Message message, elco.hl7.parser.XMLParser xmlParser) throws HL7Exception {
		return getDocumentFromMessage(camelcontext, message, xmlParser, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 Message object
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param message
	 *            HL7 Message object
	 * @param xmlParser
	 *            Parser to use
	 * @return input HL7 Message as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromMessage(CamelContext camelcontext, Message message, elco.hl7.parser.XMLParser xmlParser, String characterset) throws HL7Exception {
		HL7Document hl7document = null;

		try {
			String document = HL7.hl7Message2XMLString(message, characterset, xmlParser);
			hl7document = HL7.getDocument(camelcontext, document, characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7document;
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 message file
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param filePath
	 *            file path
	 * @return file as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromFile(CamelContext camelcontext, String filePath) throws HL7Exception {
		return getDocumentFromFile(camelcontext, filePath, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * <p>
	 * Return an HL7Document from an HL7 message file
	 * </p>
	 *
	 * @param camelcontext
	 *            CamelContext object
	 * @param filePath
	 *            file path
	 * @param characterset
	 *            character set
	 * @return file as HL7Document
	 * @throws HL7Exception
	 */
	public static HL7Document getDocumentFromFile(CamelContext camelcontext, String filePath, String characterset) throws HL7Exception {
		HL7Document hl7document = null;

		try {
			hl7document = HL7Document.getDocumentFromFile(camelcontext, filePath, characterset);
		} catch (HL7Exception ex) {
			throw ex;
		} catch (Exception ex) {
			throw new HL7Exception(ex);
		}

		return hl7document;
	}

	/**
	 * Throw an HL7Exception
	 *
	 * @param object
	 *            Exception or other object type like String, int, etc.
	 * @throws HL7Exception
	 */
	public static void newException(Object object) throws HL7Exception {
		throw new HL7Exception(GenericUtils.getException(object));
	}

	/**
	 * Verify a date
	 *
	 * @param inDate
	 *            Date as a String
	 * @param before
	 *            years
	 * @param after
	 *            years
	 * @return true if inDate is a valid date and is >= (now - before) and <= (now + after)
	 */
	public static boolean isValidDate(String inDate, String format, int before, int after) {
		return GenericUtils.isValidDate(inDate, format, before, after);
	}
}
