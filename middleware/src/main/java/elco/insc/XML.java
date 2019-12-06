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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.bootstrap.DOMImplementationRegistry;
import org.w3c.dom.ls.DOMImplementationLS;
import org.w3c.dom.ls.LSInput;
import org.w3c.dom.ls.LSOutput;
import org.w3c.dom.ls.LSParser;
import org.w3c.dom.ls.LSSerializer;

import elco.exceptions.PackageException;
import elco.exceptions.XMLException;
import elco.middleware.camel.beans.XMLDocument;
import elco.xml.DOMErrorHandler;
import elco.xml.XMLLSParserFilter;
import elco.xslt.Transformer;
import net.sf.json.JSON;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;
import net.sf.json.xml.XMLSerializer;

/**
 * XML utilities
 *
 * @author Roberto Rizzo
 */
public final class XML {

	private XML() {
	}

	/**
	 * Return an array of two String. First is 'error code' or null, second 'error description' or null
	 *
	 * @deprecated
	 * @param xml
	 *            XML returned from package
	 * @return return an array of two String. Error code and description
	 * @throws XMLException
	 */
	@Deprecated
	public static String[] getPackageError(byte[] xml) throws XMLException {
		try {
			String[] error = new String[2];

			XMLDocument doc = getDocument(xml);
			if (doc.existsNode("//RESPONSE/ERRORE")) {
				error[0] = doc.getString("//RESPONSE/ERRORE/CODICE");
				error[1] = doc.getString("//RESPONSE/ERRORE/DESCRIZIONE");
			} else if (doc.existsNode("//RISPOSTA/ERRORE")) { // NOSONAR
				error[0] = doc.getString("//RISPOSTA/ERRORE");
				error[1] = doc.getString("//RISPOSTA/ERRORE");
			}

			return error;
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * Throw an Exception if package error description isn't null
	 *
	 * @deprecated
	 * @param xml
	 *            XML returned from package
	 * @throws XMLException
	 */
	@Deprecated
	public static void havePackageError(byte[] xml) throws XMLException {
		try {
			String[] error = getPackageError(xml);
			if (error[1] != null) {
				throw new PackageException(error[1]);
			}
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * Apply an XSLT to an XML and verify the result using an XSD
	 *
	 * @param xmlInput
	 *            XML to transform
	 * @param xsltPath
	 *            XSLT file path
	 * @param xsdPath
	 *            XSD file path
	 * @param characterset
	 *            character set to use
	 * @param transformerFactory
	 *            Transformer Factory to use
	 * @return transformed XML
	 * @throws XMLException
	 */
	public static String transform(String xmlInput, String xsltPath, String xsdPath, String characterset, String transformerFactory) throws XMLException {
		try {
			byte[] xsd = null;
			if (xsdPath != null) {
				xsd = FileUtils.loadByteArray(xsdPath);
			}

			if (transformerFactory != null) {
				System.setProperty("javax.xml.transform.TransformerFactory", transformerFactory);
			}
			Transformer transformer = Transformer.getTransformer(xsltPath);
			transformer.setOutputEncoding(characterset);

			return new String(transformer.transform(xmlInput.getBytes(characterset), xsd), characterset);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * Apply an XSLT to an XML
	 *
	 * @param xmlInput
	 *            XML to transform
	 * @param xslt
	 *            array of bytes representing an XSLT
	 * @param characterset
	 *            character set to use
	 * @param transformerFactory
	 *            Transformer Factory to use
	 * @return transformed XML
	 * @throws XMLException
	 */
	public static String transform(String xmlInput, byte[] xslt, String characterset, String transformerFactory) throws XMLException {
		try {
			if (transformerFactory != null) {
				System.setProperty("javax.xml.transform.TransformerFactory", transformerFactory);
			}
			Transformer transformer = Transformer.getTransformer(xslt);
			transformer.setOutputEncoding(characterset); /* 20170621 davidec */

			return new String(transformer.transform(xmlInput.getBytes(characterset)), characterset);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * Apply an XSLT to an XML
	 *
	 * @param xmlInput
	 *            XML to transform
	 * @param xsltPath
	 *            path to XSLT file
	 * @param characterset
	 *            character set to use
	 * @param transformerFactory
	 *            Transformer Factory to use
	 * @return transformed XML
	 * @throws XMLException
	 */
	public static String transform(String xmlInput, String xsltPath, String characterset, String transformerFactory) throws XMLException {
		try {
			byte[] xsltFile = FileUtils.loadByteArray(xsltPath);
			return transform(xmlInput, xsltFile, characterset, transformerFactory);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Apply an XSLT to an XML
	 * </p>
	 * <p>
	 * transformer factory: net.sf.saxon.TransformerFactoryImpl
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param xmlInput
	 *            XML to transform
	 * @param xsltPath
	 *            path to XSLT file
	 * @return transformed XML
	 * @throws XMLException
	 */
	public static String transform(String xmlInput, String xsltPath) throws XMLException {
		try {
			return transform(xmlInput, xsltPath, Constants.DEFAULT_VM_CHARSET, Constants.SAXONTRANSFORMERFACTORY);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Apply an XSLT to an XML
	 * </p>
	 * <p>
	 * transformer factory: net.sf.saxon.TransformerFactoryImpl
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param xmlInput
	 *            XML to transform
	 * @param xslt
	 *            array of bytes representing an XSLT
	 * @return transformed XML
	 * @throws XMLException
	 */
	public static String transform(String xmlInput, byte[] xslt) throws XMLException {
		return transform(xmlInput, xslt, Constants.DEFAULT_VM_CHARSET, Constants.SAXONTRANSFORMERFACTORY);
	}

	/**
	 * Json representation of an XML String
	 *
	 * @param xml
	 *            XML input
	 * @param forceTopLevelObject
	 * @param skipWhitespace
	 * @param skipNamespaces
	 * @param removeNamespacePrefixFromElements
	 * @return XML transformed to a json
	 */
	public static String xml2json(String xml, boolean forceTopLevelObject, boolean skipWhitespace, boolean skipNamespaces, boolean removeNamespacePrefixFromElements) {
		XMLSerializer xmlSerializer = new XMLSerializer();
		xmlSerializer.setForceTopLevelObject(forceTopLevelObject);
		xmlSerializer.setSkipWhitespace(skipWhitespace);
		xmlSerializer.setSkipNamespaces(skipNamespaces);
		xmlSerializer.setRemoveNamespacePrefixFromElements(removeNamespacePrefixFromElements);
		JSON json = xmlSerializer.read(xml);

		return json.toString();
	}

	/**
	 * <p>
	 * Json representation of an XML String
	 * </p>
	 * <p>
	 * forceTopLevelObject = true, skipWhitespace = true, skipNamespaces = true, removeNamespacePrefixFromElements = true
	 * </p>
	 *
	 * @param xml
	 * @return json String
	 */
	public static String xml2json(String xml) {
		return xml2json(xml, true, true, true, true);
	}

	/**
	 * <p>
	 * Json representation of an XMLDocument
	 * </p>
	 * <p>
	 * forceTopLevelObject = true, skipWhitespace = true, skipNamespaces = true, removeNamespacePrefixFromElements = true
	 * </p>
	 *
	 * @param xml
	 * @return json String
	 */
	public static String xmlDocument2json(XMLDocument xml) {
		return xml2json(xml.toString());
	}

	/**
	 * XML representation of a JSONObject
	 *
	 * @param jsonObject
	 *            JSON input
	 * @param characterset
	 *            character set to use
	 * @param forceTopLevelObject
	 * @param skipWhitespace
	 * @param skipNamespaces
	 * @param removeNamespacePrefixFromElements
	 * @return json transformed into an XML String
	 */
	public static String json2xml(JSON jsonObject, String characterset, boolean forceTopLevelObject, boolean skipWhitespace, boolean skipNamespaces,
			boolean removeNamespacePrefixFromElements) {
		XMLSerializer xmlSerializer = new XMLSerializer();
		xmlSerializer.setForceTopLevelObject(forceTopLevelObject);
		xmlSerializer.setSkipWhitespace(skipWhitespace);
		xmlSerializer.setSkipNamespaces(skipNamespaces);
		xmlSerializer.setRemoveNamespacePrefixFromElements(removeNamespacePrefixFromElements);

		return xmlSerializer.write(jsonObject, characterset);
	}

	/**
	 * <p>
	 * XML representation of a JSONObject
	 * </p>
	 * <p>
	 * forceTopLevelObject = true, skipWhitespace = true, skipNamespaces = true, removeNamespacePrefixFromElements = true
	 * </p>
	 *
	 * @param jsonObject
	 * @param characterset
	 *            character set to use
	 * @return json transformed into an XML String
	 */
	public static String json2xml(JSON jsonObject, String characterset) {
		return json2xml(jsonObject, characterset, true, true, true, true);
	}

	/**
	 * <p>
	 * XML representation of a JSON String
	 * </p>
	 * <p>
	 * forceTopLevelObject = true, skipWhitespace = true, skipNamespaces = true, removeNamespacePrefixFromElements = true
	 * </p>
	 *
	 * @param json
	 *            JSON String
	 * @param characterset
	 *            character set to use
	 * @return json String transformed into an XML String
	 */
	public static String json2xml(String json, String characterset) {
		return json2xml(jsonString2JSONObject(json), characterset);
	}

	/**
	 * <p>
	 * XML representation of a JSON String
	 * </p>
	 * <p>
	 * forceTopLevelObject = true, skipWhitespace = true, skipNamespaces = true, removeNamespacePrefixFromElements = true
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param json
	 *            JSON String
	 * @return json transformed into an XML String
	 */
	public static String json2xml(String json) {
		return json2xml(jsonString2JSONObject(json), Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * JSON string to JSON object
	 *
	 * @param json
	 *            JSON String
	 * @return json String transformed into a JSONObject
	 */
	public static JSONObject jsonString2JSONObject(String json) {
		return (JSONObject) JSONSerializer.toJSON(json);
	}

	/**
	 * String representation of an XML w3c Document. New line: "& #10;". Pretty print: false
	 *
	 * @param document
	 *            XML document
	 * @param characterset
	 *            character set to use
	 * @return XML Document as String
	 * @throws XMLException
	 */
	public static String xml2String(Document document, String characterset) throws XMLException {
		try {
			return xml2String(document, characterset, false, Constants.xml_newline);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * String representation of an XML w3c Document
	 *
	 * @param document
	 *            XML document
	 * @param characterset
	 *            character set to use
	 * @param prettyPrint
	 *            pretty print true/false
	 * @param newLine
	 *            new line characters to use
	 * @return XML Document as String
	 * @throws XMLException
	 */
	public static String xml2String(Document document, String characterset, boolean prettyPrint, String newLine) throws XMLException {
		try {
			DOMImplementationRegistry registry = DOMImplementationRegistry.newInstance();
			DOMImplementationLS impl = (DOMImplementationLS) registry.getDOMImplementation("LS");
			LSSerializer writer = impl.createLSSerializer();
			LSOutput lso = impl.createLSOutput();
			lso.setEncoding(characterset);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			lso.setByteStream(baos);
			writer.getDomConfig().setParameter("format-pretty-print", prettyPrint);
			writer.setNewLine(newLine);
			writer.write(document, lso);

			return baos.toString(characterset);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * String representation of an XML W3C Node. Use VM default characterset
	 *
	 * @param node
	 * @param indent
	 *            yes/no
	 * @return String representation of a W3C Node
	 */
	public static String xml2StringTranformer(Node node, String indent) {
		StringWriter writer = new StringWriter();

		try {
			javax.xml.transform.Transformer trans = TransformerFactory.newInstance().newTransformer();
			trans.setOutputProperty(OutputKeys.VERSION, "1.0");
			trans.setOutputProperty(OutputKeys.INDENT, indent);
			if (!(node instanceof Document)) {
				trans.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			}
			trans.transform(new DOMSource(node), new StreamResult(writer));
		} catch (TransformerConfigurationException ex) {
			throw new IllegalStateException(ex);
		} catch (TransformerException ex) {
			throw new IllegalArgumentException(ex);
		}

		return writer.toString();
	}

	/**
	 * Convert an XML String to a w3c Document. Use VM default characterset
	 *
	 * @param xml
	 *            XML document as String
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return XML document as w3c DOM Document
	 * @throws XMLException
	 */
	public static Document string2XML(String xml, boolean namespaceAware) throws XMLException {
		return string2XML(xml, namespaceAware, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * Convert an XML String to a w3c Document
	 *
	 * @param xml
	 *            XML document as String
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @param characterset
	 *            characterset to use
	 * @return XML document as w3c DOM Document
	 * @throws XMLException
	 */
	public static Document string2XML(String xml, boolean namespaceAware, String characterset) throws XMLException {
		try {
			DOMImplementationRegistry registry = DOMImplementationRegistry.newInstance();
			DOMImplementationLS impl = (DOMImplementationLS) registry.getDOMImplementation("LS");
			LSParser parser = impl.createLSParser(DOMImplementationLS.MODE_SYNCHRONOUS, null);
			parser.getDomConfig().setParameter("error-handler", new DOMErrorHandler());
			LSInput lsi = impl.createLSInput();
			lsi.setEncoding(characterset);
			lsi.setByteStream(new ByteArrayInputStream(xml.getBytes(characterset)));
			if (!namespaceAware) {
				parser.getDomConfig().setParameter("namespaces", false); // namespace aware true/false. Can give problem with XML to pipe
																			// transformation
			}
			parser.setFilter(new XMLLSParserFilter());

			return parser.parse(lsi);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * String representation of an XML w3c Document. Use VM default characterset
	 * </p>
	 * <p>
	 * character set: default vm
	 * </p>
	 *
	 * @param document
	 *            XML document
	 * @return XML Document as String
	 * @throws XMLException
	 */
	public static String xml2string(Document document) throws XMLException { // NOSONAR
		return xml2String(document, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * <p>
	 * Return an XMLDocument from an XML String
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param document
	 *            XML document as String
	 * @return XMLDocument object
	 * @throws XMLException
	 */
	public static XMLDocument getDocument(String document) throws XMLException {
		try {
			return XMLDocument.getDocument(document, Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Return an XMLDocument from an XML file
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param filePath
	 *            file path to an XML document
	 * @return XMLDocument object
	 * @throws XMLException
	 */
	public static XMLDocument getDocumentFromFile(String filePath) throws XMLException {
		try {
			return XMLDocument.getDocumentFromFile(filePath, Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Return an XMLDocument representing a sub document of the XML input String
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param document
	 *            XML document as String
	 * @param xpath
	 *            path to the sub document
	 * @return XMLDocument object
	 * @throws XMLException
	 */
	public static XMLDocument getSubDocument(String document, String xpath) throws XMLException {
		try {
			Node subNode = XMLDocument.getDocument(document, Constants.DEFAULT_VM_CHARSET).getNode(xpath);
			return XMLDocument.getDocument(subNode, Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Return an XMLDocument from an XML byte[]
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param document
	 *            XML document as String
	 * @return XMLDocument object
	 * @throws XMLException
	 */
	public static XMLDocument getDocument(byte[] document) throws XMLException {
		try {
			return XMLDocument.getDocument(new String(document, Constants.DEFAULT_VM_CHARSET), Constants.DEFAULT_VM_CHARSET);
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * <p>
	 * Return an XMLDocument from an XML w3c Node
	 * </p>
	 * <p>
	 * character set: default VM
	 * </p>
	 *
	 * @param node
	 *            XML node
	 * @return XMLDocument object
	 * @throws ParserConfigurationException
	 */
	public static XMLDocument getDocument(Node node) throws ParserConfigurationException {
		return XMLDocument.getDocument(node, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * <p>
	 * Remove preamble from XML
	 * </p>
	 *
	 * @param xmlString
	 *            XML to analyze
	 * @return XML without preamble
	 */
	public static String removeXmlStringPreamble(String xmlString) {
		return xmlString.replaceAll("(<\\?[^<]*\\?>)?", ""); // remove preamble
	}

	/**
	 * <p>
	 * Remove all namespaces declaration, prefix and preamble from XML
	 * </p>
	 *
	 * @param xmlString
	 *            XML to analyze
	 * @return XML without namespace declaration, prefix and preamble
	 */
	public static String removeXmlStringNamespaceAndPreamble(String xmlString) {
		String newXMLString = removeXmlStringPreamble(xmlString) // remove preamble
				.replaceAll("(<)(\\w+:)(.*?>)", "$1$3") // remove opening tag prefix
				.replaceAll("(</)(\\w+:)(.*?>)", "$1$3"); // remove closing tags prefix

		return removeXmlStringNamespaceDeclaration(newXMLString);
	}

	/**
	 * <p>
	 * Remove all namespaces from XML
	 * </p>
	 *
	 * @param xmlString
	 *            XML to analyze
	 * @return XML without namespace declaration
	 */
	public static String removeXmlStringNamespaceDeclaration(String xmlString) {
		return xmlString.replaceAll("xmlns.*?(\"|\').*?(\"|\')", "");
	}

	/**
	 * <p>
	 * Remove only the default namespace from XML (es. xmlns="http://test")
	 * </p>
	 *
	 * @param xmlString
	 *            XML to analyze
	 * @return XML without default namespace declaration
	 */
	public static String removeXmlStringDefaultNamespace(String xmlString) {
		return xmlString.replaceAll("xmlns=(\"|\').*?(\"|\')", "");
	}
}
