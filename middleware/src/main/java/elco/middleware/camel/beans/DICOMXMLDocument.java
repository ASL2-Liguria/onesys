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

import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import elco.insc.DICOM;
import elco.insc.XML;

/**
 * XML representation of a DICOM object without pixel data
 *
 * @author Roberto Rizzo
 */
public class DICOMXMLDocument extends XMLDocument {

	protected DICOMXMLDocument(String document, String characterset) throws SAXException {
		super(document, characterset);
	}

	protected DICOMXMLDocument(Node node, String characterset) throws ParserConfigurationException {
		super(node, characterset);
	}

	/**
	 * Return a DICOMXMLDocument from an XML String
	 *
	 * @param document
	 *            DICOM XML document
	 * @param characterset
	 *            character set to use
	 * @return input XML as DICOMXMLDocument
	 * @throws IOException
	 */
	public static DICOMXMLDocument getDocument(String document, String characterset) throws IOException {
		try {
			return new DICOMXMLDocument(document, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return a DICOMXMLDocument from an XML file
	 *
	 * @param filePath
	 *            file path to a DICOM XML document
	 * @param characterset
	 *            character set to use
	 * @return input XML as DICOMXMLDocument
	 * @throws IOException
	 */
	public static DICOMXMLDocument getDocumentFromFile(String filePath, String characterset) throws IOException {
		try {
			String document = getFileStore(filePath, characterset).getFile();
			return getDocument(document, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return a DICOMXMLDocument from a DICOM XML w3c Node
	 *
	 * @param node
	 *            DICOM XML node
	 * @param characterset
	 *            character set to use
	 * @return input XML as DICOMXMLDocument
	 * @throws ParserConfigurationException
	 */
	public static DICOMXMLDocument getDocument(Node node, String characterset) throws ParserConfigurationException {
		return new DICOMXMLDocument(node, characterset);
	}

	/**
	 * Return, as a copy, a DICOMXMLDocument representing a sub document of this document
	 *
	 * @param tag
	 *            Tag name (ex. Tag.AccessionNumber)
	 * @return DICOMXMLDocument representing the sub document
	 * @throws IOException
	 */
	public DICOMXMLDocument getSubDocument(int tag) throws IOException {
		try {
			return getDocument(getNode(tag), characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return the node as a w3c Element
	 *
	 * @param tag
	 *            Tag name (ex. Tag.AccessionNumber)
	 * @return first matching Element or NULL
	 */
	public Element getElement(int tag) {
		return (Element) getNode(tag);
	}

	/**
	 * Return the value of a node as String or NULL if no value can be found
	 *
	 * @param tag
	 *            Tag name (ex. Tag.AccessionNumber)
	 * @return node value or NULL if no value can be found
	 */
	public String getString(int tag) {
		return getString(tag2xpath(tag));
	}

	/**
	 * Return the node as a w3c Node
	 *
	 * @param tag
	 *            Tag name (ex. Tag.AccessionNumber)
	 * @return first matching Node or NULL
	 */
	public Node getNode(int tag) {
		return getNode(tag2xpath(tag));
	}

	/**
	 * <p>
	 * Json representation of the XML document<br>
	 * forceTopLevelObject = true<br>
	 * skipWhitespace = false<br>
	 * skipNamespaces = true<br>
	 * removeNamespacePrefixFromElements = true<br>
	 * </p>
	 *
	 * @return json representation of the XML
	 */
	@Override
	public String getJson() {
		return XML.xml2json(toString(), true, false, true, true);
	}

	private String tag2xpath(int tag) {
		return "//attr[@tag='" + DICOM.tagName2HexValue(tag) + "']";
	}
}
