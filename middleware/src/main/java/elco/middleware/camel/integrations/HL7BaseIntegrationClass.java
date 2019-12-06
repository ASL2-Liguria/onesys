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
package elco.middleware.camel.integrations;

import java.io.IOException;
import java.net.URISyntaxException;
import java.sql.SQLException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.xml.parsers.ParserConfigurationException;

import org.apache.camel.CamelContext;
import org.apache.camel.Exchange;
import org.apache.camel.component.hl7.HL7MLLPCodec;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Node;

import ca.uhn.hl7v2.HL7Exception;
import elco.exceptions.BaseIntegrationException;
import elco.exceptions.XMLException;
import elco.hl7.parser.DefaultXMLParser;
import elco.insc.Camel;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.HL7;
import elco.middleware.camel.beans.Config;
import elco.middleware.camel.beans.DBManagement;
import elco.middleware.camel.beans.HL7Document;
import elco.middleware.camel.beans.XMLDocument;

/**
 * <p>
 * HL7 base integration class
 * </p>
 * <p>
 * <h1><font color='red'>defaultDBM is an instance of DBManagement initialized only if the property 'pool' is set. Otherwise will be NULL</font></h1> </p> <p> <h1>logger: slf4j
 * instance</h1> </p> <p> <h1>getDBManagement(String _beanName)</h1> </p> <p> <h1>getXMLDocument(String _document)</h1> </p> <p> <h1>getArray(Object... params)</h1> </p> <p>
 * <h1>getHL7Document(String _document)</h1> </p> <p> <h1>getHL7DocumentFromPipe(String _pipeMessage)</h1> </p> <p> <h1>getConfigurationBean(String _beanName)</h1> </p> <p>
 * <h1>sendHL7PipeMessage(String _destination, String _pipeMessage, String _timeout)</h1> </p> <p> <h1>getLogger(String _name)</h1> </p> <p> <h1>getContext()</h1> </p> <p>
 * <h1>getHL7DocumentFromTemplate(String _relativeFilePath)</h1> </p> <p> <h1>setOutputBody(Object _body)</h1> </p> <p> <h1>addEscapeToPipeParser(String _escape, Character
 * _translate)</h1> </p>
 *
 * @author Roberto Rizzo
 */
abstract class HL7BaseIntegrationClass {

	private final Map<String, Logger> loggers = new ConcurrentHashMap<>();
	private String defaultPool = null;
	private String defaultQueriesBean = null;
	protected final Logger logger = LoggerFactory.getLogger(this.getClass());
	protected DBManagement defaultDBM = null;
	protected String templateDirAbsPath = "";
	protected boolean preserveWhiteSpace = true;
	protected elco.hl7.parser.PipeParser pipeParser = null;
	protected DefaultXMLParser xmlParser = null;
	protected String hl7Codec = null;
	protected String characterset = null;
	Exchange exchange;

	HL7BaseIntegrationClass() {
		templateDirAbsPath = FileUtils.verifyPath(Constants.messagesTemplates);
		pipeParser = HL7.getMiddlewarePipeParser(true);
		xmlParser = HL7.getMiddlewareXMLParser(true);
		xmlParser.setPipeParser(pipeParser);
	}

	/**
	 * XPATH: preserve spaces and escapes in all elements of the document
	 *
	 * @param preserve
	 *            true/false
	 */
	public void setPreserveWhiteSpace(boolean preserve) {
		preserveWhiteSpace = preserve;
	}

	/**
	 * @param keep
	 *            Set to true to keep all segments as original
	 */
	public void setKeepAllAsOriginal(boolean keep) {
		xmlParser.setKeepAllAsOriginal(keep);
	}

	/**
	 * From 5.0.0
	 *
	 * @param keepEmptyFields
	 *            Set to true to keep all empty fields (Default = false)
	 */
	public void setKeepEmptyFields(boolean keepEmptyFields) {
		xmlParser.setKeepEmptyFields(keepEmptyFields);
	}

	/**
	 * Convenience's function. Return a DBManagement from a pool
	 *
	 * @param beanPoolName
	 *            pool bean name
	 * @return DBManagement
	 */
	public final DBManagement getDBManagement(String beanPoolName) throws SQLException {
		return DBManagement.getDBManagement(exchange.getContext().getRegistry(), beanPoolName);
	}

	/**
	 * Convenience's function. Return an XMLDocument from an XML String
	 *
	 * @param document
	 *            XML String or an empty String
	 * @return XMLDocument object
	 * @throws XMLException
	 */
	public final XMLDocument getXMLDocument(String document) throws XMLException {
		XMLDocument xmlDocument;

		try {
			xmlDocument = XMLDocument.getDocument(document, Constants.DEFAULT_VM_CHARSET);
		} catch (IOException ex) {
			throw new XMLException(ex);
		}

		return xmlDocument;
	}

	/**
	 * Convenience's function. Return an XMLDocument from an XML w3c Node
	 *
	 * @param node
	 *            XML w3c Node representing an XML Node
	 * @return XMLDocument object
	 * @throws ParserConfigurationException
	 */
	public final XMLDocument getXMLDocument(Node node) throws ParserConfigurationException {
		return XMLDocument.getDocument(node, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * Convenience's function. Return an HL7Document from an XML String
	 *
	 * @param document
	 *            XML String representing an HL7 document
	 * @return HL7Document object
	 * @throws HL7Exception
	 */
	public final HL7Document getHL7Document(String document) throws HL7Exception {
		HL7Document newDoc = HL7.getDocument(exchange.getContext(), document, characterset);
		if (xmlParser != null) {
			xmlParser.setPipeParser(pipeParser);
			newDoc.setParser(xmlParser);
		}
		if (preserveWhiteSpace) {
			newDoc.setPreserveWhiteSpace();
		}
		return newDoc;
	}

	/**
	 * Convenience's function. Return an HL7Document object from an HL7 pipe message String
	 *
	 * @param pipeMessage
	 *            HL7 pipe message String
	 * @return HL7Document object
	 * @throws HL7Exception
	 */
	public final HL7Document getHL7DocumentFromPipe(String pipeMessage) throws HL7Exception {
		HL7Document newDoc = HL7.getDocumentFromPipe(exchange.getContext(), pipeMessage, pipeParser, xmlParser);
		if (xmlParser != null) {
			xmlParser.setPipeParser(pipeParser);
			newDoc.setParser(xmlParser);
		}
		if (preserveWhiteSpace) {
			newDoc.setPreserveWhiteSpace();
		}
		return newDoc;
	}

	/**
	 * <p>
	 * Convenience's function. Return an HL7Document from an HashMap of templates
	 * </p>
	 * <p>
	 * The path is relative to 'configs/messagesTemplates' directory
	 * </p>
	 *
	 * @param relativeFilePath
	 *            relative file path
	 * @return file as HL7Document
	 * @throws HL7Exception
	 */
	public final HL7Document getHL7DocumentFromTemplate(String relativeFilePath) throws HL7Exception {
		HL7Document newDoc = HL7.getDocumentFromFile(exchange.getContext(), templateDirAbsPath + relativeFilePath);
		if (xmlParser != null) {
			xmlParser.setPipeParser(pipeParser);
			newDoc.setParser(xmlParser);
		}
		if (preserveWhiteSpace) {
			newDoc.setPreserveWhiteSpace();
		}
		return newDoc;
	}

	/**
	 * <p>
	 * Convenience's function. Return an HL7Document from an HashMap of templates
	 * </p>
	 * <p>
	 * The path is relative to 'configs/messagesTemplates' directory
	 * </p>
	 *
	 * @param relativeFilePath
	 *            relative file path
	 * @param characterset
	 *            character set
	 * @return file as HL7Document
	 * @throws HL7Exception
	 */
	public final HL7Document getHL7DocumentFromTemplate(String relativeFilePath, String characterset) throws HL7Exception {
		HL7Document newDoc = HL7.getDocumentFromFile(exchange.getContext(), templateDirAbsPath + relativeFilePath, characterset);
		if (xmlParser != null) {
			xmlParser.setPipeParser(pipeParser);
			newDoc.setParser(xmlParser);
		}
		if (preserveWhiteSpace) {
			newDoc.setPreserveWhiteSpace();
		}
		return newDoc;
	}

	/**
	 * Set the default pool bean name that will be used by getDBManagement()
	 *
	 * @param defaultPool
	 *            default pool name
	 */
	public final void setPool(String defaultPool) {
		if (defaultPool != null && defaultPool.trim().length() > 0) {
			this.defaultPool = defaultPool;
		}
	}

	/**
	 * Set the default queries bean name that will be used by getDBManagement()
	 *
	 * @param defaultQueriesBean
	 *            default bean name for queries config
	 */
	public final void setQueries(String defaultQueriesBean) {
		if (defaultQueriesBean != null && defaultQueriesBean.trim().length() > 0) {
			this.defaultQueriesBean = defaultQueriesBean;
		}
	}

	/**
	 * Get a configuration bean
	 *
	 * @param beanName
	 *            name of the configuration bean to load
	 * @return Config object
	 */
	public final Config getConfigurationBean(String beanName) {
		return Camel.getConfigurationBean(exchange.getContext().getRegistry(), beanName);
	}

	/**
	 * Send an HL7 pipe message and return the ACK as a pipe message too
	 *
	 * @param destination
	 *            "IP:PORT"
	 * @param pipeMessage
	 *            HL7 pipe String
	 * @param timeout
	 *            response timeout
	 * @return ACK as an HL7 pipe String
	 * @throws HL7Exception
	 */
	public final String sendHL7PipeMessage(String destination, String pipeMessage, String timeout) throws HL7Exception {
		return HL7.sendMessage(exchange.getContext(), destination, pipeMessage, timeout);
	}

	/**
	 * Return a named slf4j logger
	 *
	 * @param name
	 *            logger name
	 * @return Logger object
	 */
	public final Logger getLogger(String name) {
		Logger loggerTemp = loggers.get(name);
		if (loggerTemp == null) {
			loggerTemp = LoggerFactory.getLogger(name);
			loggers.put(name, loggerTemp);
		}

		return loggerTemp;
	}

	/**
	 * Returns the container so that a processor can resolve endpoints from URIs
	 *
	 * @return the container which owns this exchange
	 */
	public final CamelContext getContext() {
		return exchange.getContext();
	}

	/**
	 * Add a couple of values "escape <-> translate" (e.g. \\X000d\\ <-> \r) to pipe parser
	 *
	 * @param escape
	 *            escape
	 * @param translate
	 *            value
	 */
	public final void addEscapeToPipeParser(String escape, Character translate) {
		pipeParser.addEscape(escape, translate);
	}

	/**
	 * Set hl7 codec used by internal sender. If not set the server codec will be used
	 *
	 * @param hl7Codec
	 *            codec to use
	 */
	public void setInternalSenderCodec(String hl7Codec) {
		this.hl7Codec = hl7Codec;
	}

	/**
	 * Set characterset to use. If not set try to use HL7MLLPCodec if present, else use VM default
	 *
	 * @param characterset
	 *            characterset to use
	 */
	public void setCharacterset(String characterset) {
		this.characterset = characterset;
	}

	/**
	 * Set the output body as an object an copy input message headers to the output message
	 *
	 * @param body
	 *            New output body as an object
	 */
	protected final void setOutputBody(Object body) {
		exchange.getOut().setHeaders(exchange.getIn().getHeaders());
		exchange.getOut().setBody(body);
	}

	/**
	 * @return message headers
	 */
	protected final Map<String, Object> getHeaders() {
		return exchange.getIn().getHeaders();
	}

	/**
	 * @return route properties
	 */
	protected final Map<String, Object> getProperties() {
		return exchange.getProperties();
	}

	/**
	 * if there isn't a personal pipe parser then I'll create one
	 */
	protected void verifyParsers() {
		if (pipeParser == null) {
			pipeParser = elco.hl7.parser.PipeParser.getInstanceWithNoValidation();
		}
		if (xmlParser != null) {
			xmlParser.setPipeParser(pipeParser);
		}
	}

	final void baseHandler(Exchange exchange) {
		this.exchange = exchange;
		if (hl7Codec == null) {
			try {
				Map<String, Object> parameters = Camel.getEndpointURIParameters(exchange.getFromEndpoint());
				hl7Codec = (String) parameters.get("codec");
			} catch (URISyntaxException ex) {
				logger.warn("", ex);
			}
		}

		if (characterset == null && hl7Codec != null) {
			String codecBeanName = StringUtils.substringAfter(hl7Codec, "#");
			HL7MLLPCodec hL7MLLPCodec = exchange.getContext().getRegistry().lookupByNameAndType(codecBeanName, HL7MLLPCodec.class);
			if (hL7MLLPCodec != null) {
				characterset = hL7MLLPCodec.getCharset().name();
			} else {
				characterset = Constants.DEFAULT_VM_CHARSET;
			}
		}
	}

	final void getDBManagement() throws SQLException {
		if (defaultDBM == null && defaultPool != null) {
			defaultDBM = DBManagement.getDBManagement(exchange.getContext().getRegistry(), defaultPool, defaultQueriesBean);
		}
	}

	@SuppressWarnings("unused")
	final void closeDefaultDBM() throws BaseIntegrationException {
	}
}
