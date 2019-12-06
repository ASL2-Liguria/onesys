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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.naming.NamingException;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.commons.jxpath.AbstractFactory;
import org.apache.commons.jxpath.JXPathContext;
import org.apache.commons.jxpath.JXPathNotFoundException;
import org.apache.commons.jxpath.Pointer;
import org.apache.commons.jxpath.ri.model.dom.DOMNodePointer;
import org.apache.xerces.dom.DocumentImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

import elco.insc.B64;
import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.insc.GenericUtils;
import elco.insc.XML;
import elco.middleware.camel.beans.storeobjects.FileStore;

/**
 * <p>
 * Class for managing XML
 * </p>
 * <p>
 * Default document factory: org.apache.xerces.jaxp.DocumentBuilderFactoryImpl
 * </p>
 *
 * @author Roberto Rizzo
 */
public class XMLDocument {

	private static final Map<String, FileStore> files = new HashMap<>();
	private String factory = Constants.DOCUMENTBUILDERFACTORY;
	private Logger logger = null;
	protected JXPathContext jxPathContext = null;
	protected Document doc = null;
	protected final String characterset;
	/**
	 * path to the root of the document
	 */
	public static final String root = "/"; // NOSONAR

	protected XMLDocument(String document, String characterset) throws SAXException {
		this.characterset = characterset;
		doc = parse(document, true);
		init(doc);
	}

	protected XMLDocument(Node node, String characterset) throws ParserConfigurationException {
		this.characterset = characterset;

		if (node.getOwnerDocument() != null) {
			doc = DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument();
			doc.appendChild(doc.importNode(node, true));
		} else {
			doc = (Document) node.cloneNode(true);
		}

		init(doc);
	}

	/**
	 * Return an XMLDocument from an XML String
	 *
	 * @param document
	 *            XML document
	 * @param characterset
	 *            character set to use
	 * @return input XML as XMLDocument
	 * @throws IOException
	 */
	public static XMLDocument getDocument(String document, String characterset) throws IOException {
		try {
			return new XMLDocument(document, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return an XMLDocument from an XML file
	 *
	 * @param filePath
	 *            file path to an XML document
	 * @param characterset
	 *            character set to use
	 * @return input XML as XMLDocument
	 * @throws IOException
	 */
	public static XMLDocument getDocumentFromFile(String filePath, String characterset) throws IOException {
		try {
			String document = getFileStore(filePath, characterset).getFile(); // NOSONAR
			return getDocument(document, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return an XMLDocument from an XML w3c Node
	 *
	 * @param node
	 *            XML node
	 * @param characterset
	 *            character set to use
	 * @return input XML as XMLDocument
	 * @throws ParserConfigurationException
	 */
	public static XMLDocument getDocument(Node node, String characterset) throws ParserConfigurationException {
		return new XMLDocument(node, characterset);
	}

	/**
	 * Return, as a copy, an XMLDocument representing a sub document of this document
	 *
	 * @param xpath
	 *            path to the sub document
	 * @return XMLDocument representing the sub document
	 * @throws IOException
	 */
	public XMLDocument getSubDocument(String xpath) throws IOException {
		try {
			return getDocument(getNode(xpath), characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * <p>
	 * Registers a namespace prefix if not already present. If present a NamingException will be thrown
	 * </p>
	 *
	 * @param pPrefix
	 *            A namespace prefix
	 * @param namespaceURI
	 *            A URI for that prefix
	 * @throws NamingException
	 */
	public void registerNamespace(String pPrefix, String namespaceURI) throws NamingException {
		String uri = jxPathContext.getNamespaceURI(pPrefix);
		if (uri == null) {
			jxPathContext.registerNamespace(pPrefix, namespaceURI);
		} else {
			throw new NamingException("Namespace prefix already present");
		}
	}

	/**
	 * <p>
	 * Registers a namespace prefix for default namespace "xmlns" if not already present. If present a NamingException will be thrown.<br>
	 * If no attributes are present or default attribute is not present, a NamingException will be thrown.
	 * </p>
	 *
	 * @param prefix
	 *            A namespace prefix
	 * @throws NamingException
	 */
	public void registerDefaultNamespaceAs(String prefix) throws NamingException {
		NamedNodeMap attributes = getNode(root).getFirstChild().getAttributes();
		if (attributes != null) {
			Node defaultNS = attributes.getNamedItem("xmlns");
			if (defaultNS != null) {
				registerNamespace(prefix, defaultNS.getNodeValue());
			} else {
				throw new NamingException("The default namespace is not present");
			}
		} else {
			throw new NamingException("There're no attributes");
		}
	}

	/**
	 * Return the value of a node as String or NULL if no value can be found
	 *
	 * @param xpath
	 *            path to node
	 * @return node value or NULL if no value can be found
	 */
	public String getString(String xpath) {
		return (String) jxPathContext.getValue(xpath, String.class);
	}

	/**
	 * <p>
	 * Return the value of a node as String or NULL if no value can be found (since 5.0.0)
	 * </p>
	 * <p>
	 * ex. //wsa:MessageID -> xpath = //, localName = MessageID
	 * </p>
	 * <p>
	 * //*[local-name() = 'localName']
	 * </p>
	 *
	 * @param xpath
	 *            path to node excluding node name
	 * @param localName
	 *            node name without namespace
	 * @return node value or NULL if no value can be found
	 */
	public String getStringUsingLocalName(String xpath, String localName) {
		return (String) jxPathContext.getValue(makeLocalNamePath(xpath, localName), String.class);
	}

	/**
	 * <p>
	 * Return a List of nodes (since 5.0.0)
	 * </p>
	 * <p>
	 * ex. //rim:ObjectRef -> xpath = //, localName = ObjectRef
	 * </p>
	 * <p>
	 * //*[local-name() = 'localName']
	 * </p>
	 *
	 * @param xpath
	 *            path to node excluding node name
	 * @param localName
	 *            node name without namespace
	 * @return list of matching Node objects
	 */
	@SuppressWarnings("unchecked")
	public List<Node> getNodeListUsingLocalName(String xpath, String localName) {
		return jxPathContext.selectNodes(makeLocalNamePath(xpath, localName));
	}

	/**
	 * Return the value of a node as Object[1] or NULL if no value can be found
	 *
	 * @param xpath
	 *            path to node
	 * @return node value as Object[1] or NULL if no value can be found
	 */
	public Object[] getStringAsArray(String xpath) {
		String value = getString(xpath);
		if (value == null) {
			return null; // NOSONAR
		}

		return GenericUtils.getArray(value);
	}

	/**
	 * Try to decode the value as base 64. If it isn't base 64, return 'the value'. If no value can be found return NULL
	 *
	 * @deprecated use getBase64(String xpath). Will be removed in version 7.1.0
	 * @param xpath
	 *            path to node
	 * @return decoded base 64 if value is base 64 else 'the value'. If no value can be found return NULL
	 * @throws JXPathNotFoundException
	 */
	@Deprecated
	public byte[] getB64(String xpath) {
		String value = getString(xpath);
		if (value == null) {
			return null; // NOSONAR
		}

		if (B64.isB64(value)) {
			return B64.decodeB64(value);
		}

		return value.getBytes();
	}

	/**
	 * Decode the value as base 64. If no value can be found return NULL
	 *
	 * @param xpath
	 *            path to node
	 * @return decoded base 64. If no value can be found return NULL
	 * @throws JXPathNotFoundException
	 */
	public byte[] getBase64(String xpath) {
		String value = getString(xpath);
		if (value == null) {
			return null; // NOSONAR
		}

		return B64.decodeB64(value);
	}

	/**
	 * Set node value as String
	 *
	 * @param xpath
	 *            path to node
	 * @param nodeValue
	 *            new node value
	 */
	public void setString(String xpath, String nodeValue) {
		jxPathContext.setValue(xpath, nodeValue);
	}

	/**
	 * Replace the value of the first node found. The old value is used to search the node
	 *
	 * @param oldValue
	 *            value used to search the node
	 * @param newValue
	 *            new node value (String)
	 */
	public void replaceFirstValue(String oldValue, String newValue) {
		replaceValueAtPosition(oldValue, newValue, 1);
	}

	/**
	 * Replace the value of the last node found. The old value is used to search the node
	 *
	 * @param oldValue
	 *            value used to search the node
	 * @param newValue
	 *            new node value (String)
	 */
	public void replaceLastValue(String oldValue, String newValue) {
		String xpath = "(//*[text()='" + oldValue + "'])[last()]";
		setString(xpath, newValue);
	}

	/**
	 * Replace the value of the 'position' node. The old value is used to search the node
	 *
	 * @param oldValue
	 *            value used to search the node
	 * @param newValue
	 *            new node value (String)
	 * @param position
	 *            position of the node ('1' is the position of the first node)
	 */
	public void replaceValueAtPosition(String oldValue, String newValue, int position) {
		String xpath = "(//*[text()='" + oldValue + "'])[" + position + "]";
		setString(xpath, newValue);
	}

	/**
	 * Replace the value of all found nodes, using XPATH 1.0 functions, with the new value
	 *
	 * @param functions
	 *            functions used to search the matching nodes
	 * @param newValue
	 *            new nodes value (String)
	 */
	public void replaceAllFunctions(String functions, String newValue) {
		String xpath = "//*[" + functions + "]";

		Iterator<?> it = iterator(xpath);
		while (it.hasNext()) {
			((DOMNodePointer) it.next()).setValue(newValue);
		}
	}

	/**
	 * Replace the value of all found nodes with the new value. The old value is used to search the nodes
	 *
	 * @param oldValue
	 *            value used to search the nodes
	 * @param newValue
	 *            new nodes value (String)
	 */
	public void replaceAllValues(String oldValue, String newValue) {
		String xpath = "//*[text()='" + oldValue + "']";

		Iterator<?> it = iterator(xpath);
		while (it.hasNext()) {
			((DOMNodePointer) it.next()).setValue(newValue);
		}
	}

	/**
	 * Replace all instances, present in the XMLDocument object, of HashMap key with HashMap value. Values will be transformed to String objects using 'String.valueOf'
	 *
	 * @param keysValues
	 *            Map of 'old values'/'new values'
	 */
	public void replaceAllValues(Map<String, Object> keysValues) {
		Entry<String, Object> entry;

		Iterator<Entry<String, Object>> it = keysValues.entrySet().iterator();
		while (it.hasNext()) {
			entry = it.next();
			replaceAllValues(entry.getKey(), String.valueOf(entry.getValue()));
		}
	}

	/**
	 * Return an Iterator of 'DOMNodePointer' objects that matching the path
	 *
	 * @param xpath
	 *            xpath to iterate
	 * @return Iterator
	 */
	public Iterator<?> iterator(String xpath) { // NOSONAR
		return jxPathContext.iteratePointers(xpath);
	}

	/**
	 * Return an Iterator of all results found for the path. If the xpath matches no properties in the graph, the Iterator will be empty, but not NULL
	 *
	 * @param xpath
	 *            xpath to iterate
	 * @return Iterator
	 */
	public Iterator<?> iteratorValues(String xpath) { // NOSONAR
		return jxPathContext.iterate(xpath);
	}

	/**
	 * Return XML content as String
	 */
	@Override
	public String toString() {
		String value = "";

		try {
			value = XML.xml2String(doc, characterset);
		} catch (Exception ex) {
			logger.error("", ex);
			value = "";
		}

		return value;
	}

	/**
	 * @param prettyPrint
	 *            pretty print true/false
	 * @param newLine
	 *            new line characters to use
	 * @return XML formatted into a String
	 */
	public String toString(boolean prettyPrint, String newLine) {
		String value = "";

		try {
			// value = XML.xml2String(doc, characterset, prettyPrint, newLine).replaceAll(" ", "&nbsp;");
			value = XML.xml2String(doc, characterset, prettyPrint, newLine);
		} catch (Exception ex) {
			logger.error("", ex);
			value = "";
		}

		return value;
	}

	/**
	 * Get the prefix associated with the specified namespace URI
	 *
	 * @param namespaceURI
	 *            the ns URI to check
	 * @return String prefix
	 */
	public String getPrefix(String namespaceURI) {
		return jxPathContext.getPrefix(namespaceURI);
	}

	/**
	 * Given a prefix, returns a registered namespace URI. If the requested prefix was not defined explicitly using the registerNamespace method, JXPathContext will then check the
	 * context node to see if the prefix is defined there
	 *
	 * @param prefix
	 *            The namespace prefix to look up
	 * @return namespace URI or null if the prefix is undefined
	 */
	public String getNamespaceURI(String prefix) {
		return jxPathContext.getNamespaceURI(prefix);
	}

	/**
	 * Simple call to toString()
	 *
	 * @deprecated use toString(). Will be removed in version 7.1.0
	 * @return XML representation as String
	 */
	@Deprecated
	public String getString() {
		return toString();
	}

	/**
	 * Return the node as a w3c Node
	 *
	 * @param xpath
	 *            path to node
	 * @return first matching Node or NULL
	 */
	public Node getNode(String xpath) {
		return (Node) jxPathContext.selectSingleNode(xpath);
	}

	/**
	 * @param xpath
	 *            path to node
	 * @param namespaceURI
	 *            normally an empty String
	 * @param newName
	 *            new name of the node
	 */
	public void renameNode(String xpath, String namespaceURI, String newName) {
		doc.renameNode(getNode(xpath), namespaceURI, newName);
	}

	/**
	 * @param pXpath
	 *            path to node
	 * @param position
	 *            node position 1 is first node
	 * @param namespaceURI
	 *            normally an empty String
	 * @param newName
	 *            new name of the node
	 */
	public void renameNodeAtPosition(String pXpath, int position, String namespaceURI, String newName) {
		String xpath = pXpath + "[" + position + "]";
		renameNode(xpath, namespaceURI, newName);
	}

	/**
	 * Return the node as a w3c Element
	 *
	 * @param xpath
	 *            path to element
	 * @return first matching Element or NULL
	 */
	public Element getElement(String xpath) {
		return (Element) getNode(xpath);
	}

	/**
	 * Return a List of nodes
	 *
	 * @param xpath
	 *            path to node
	 * @return list of matching Node objects
	 */
	public List<?> getNodeList(String xpath) { // NOSONAR
		return jxPathContext.selectNodes(xpath);
	}

	/**
	 * Return an array of nodes
	 *
	 * @param xpath
	 *            path to node
	 * @return array of matching Node objects
	 */
	public Object[] getNodeArray(String xpath) {
		return getNodeList(xpath).toArray();
	}

	/**
	 * Return true if exists the node else false
	 *
	 * @param xpath
	 * @return true if node exist
	 */
	public boolean existsNode(String xpath) {
		return getNode(xpath) != null;
	}

	/**
	 * Return the number of nodes
	 *
	 * @param xpath
	 *            path to the node
	 * @return number of matching nodes
	 */
	public int countNodes(String xpath) {
		return getNodeList(xpath).size();
	}

	/**
	 * Add a node. Creates missing elements of the path
	 *
	 * @param xpath
	 *            path to the node
	 * @return added Node/Element
	 */
	public Element add(String xpath) {
		Object obj = jxPathContext.createPath(xpath).getNode();
		if (obj instanceof DocumentImpl) {
			return ((DocumentImpl) obj).getDocumentElement();
		}

		return (Element) obj;
	}

	/**
	 * Add a node and set its value as a String or a w3c Node child. Creates missing elements of the path
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            can be a simple String (ex. 'test') or a value to add as a child of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @return added Node/Element (the last node in the xpath variable)
	 */
	public Element add(String xpath, String value) {
		return add(xpath, value, true);
	}

	/**
	 * Add a node and set its value as a String or a w3c Node child. Creates missing elements of the path
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            can be a simple String (ex. 'test') or a value to add as a child of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return added Node/Element (the last node in the xpath variable)
	 */
	public Element add(String xpath, String value, boolean namespaceAware) {
		Element elm = null;

		try {
			elm = parse(value, namespaceAware).getDocumentElement();
		} catch (Exception ex) {
			logger.error("", ex);
			return (Element) jxPathContext.createPathAndSetValue(xpath, value).getNode();
		}
		Node node = add(xpath);
		node.appendChild(doc.importNode(elm, true));

		return (Element) node;
	}

	/**
	 * Add a comment to the node represented by xpath (since 5.0.0)
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            Comment to add
	 */
	public void addComment(String xpath, String value) {
		Node node = add(xpath);
		node.appendChild(doc.createComment(value));
	}

	/**
	 * Add a child to an existing node. Return NULL if the child can't be add
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            an XMLDocument to add as a child of the node
	 * @return added child Node/Element
	 */
	public Element addChild(String xpath, XMLDocument value) {
		return addChild(xpath, value.toString());
	}

	/**
	 * Add a child to an existing node. Return NULL if the child can't be add. Namespace aware is true
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            a child of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @return added child Node/Element
	 */
	public Element addChild(String xpath, String value) {
		return addChild(xpath, value, true);
	}

	/**
	 * Add a child to an existing node. Return NULL if the child can't be add
	 *
	 * @param xpath
	 *            path to the node
	 * @param value
	 *            a child of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return added child Node/Element
	 */
	public Element addChild(String xpath, String value, boolean namespaceAware) {
		Element child = null;

		try {
			Element elm = parse(value, namespaceAware).getDocumentElement();
			child = addChild(xpath, elm);
		} catch (Exception ex) {
			logger.error("", ex);
			child = null;
		}

		return child;
	}

	/**
	 * Add a child to an existing node. Return NULL if the child can't be add
	 *
	 * @param xpath
	 *            path to the node
	 * @param pNode
	 *            w3c Node to add as a child
	 * @return added child Node/Element
	 */
	public Element addChild(String xpath, Node pNode) {
		return (Element) addChildReturnNode(xpath, pNode);
	}

	/**
	 * Add a CDATA section to an existing node (since 5.0.0)
	 *
	 * @param xpath
	 *            path to the node
	 * @param data
	 *            the data for the CDATASection contents
	 * @return added child Node
	 */
	public Node addCDATASection(String xpath, String data) {
		Node child = null;

		try {
			CDATASection dataSection = doc.createCDATASection(data);
			child = addChildReturnNode(xpath, dataSection);
		} catch (Exception ex) {
			logger.error("", ex);
			child = null;
		}

		return child;
	}

	/**
	 * Remove the matching node
	 *
	 * @param xpath
	 *            path to the node
	 */
	public void remove(String xpath) {
		jxPathContext.removePath(xpath);
	}

	/**
	 * Add an attribute and set its value
	 *
	 * @param xpath
	 *            path to node
	 * @param name
	 *            attribute name
	 * @param value
	 *            attribute value
	 * @return Node/Element on which the attribute was set
	 */
	public Element addAttribute(String xpath, String name, String value) {
		Element elm = getElement(xpath);
		elm.setAttribute(name, value);

		return elm;
	}

	/**
	 * Remove an attribute
	 *
	 * @param xpath
	 *            path to node
	 * @param name
	 *            attribute to remove
	 * @return Node/Element on which the attribute was removed
	 */
	public Element removeAttribute(String xpath, String name) {
		Element elm = getElement(xpath);
		elm.removeAttribute(name);

		return elm;
	}

	/**
	 * Add a sibling to an existing node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            an XMLDocument to add as a sibling of the node
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSibling(String xpath, XMLDocument value) throws IOException {
		try {
			return addSibling(xpath, value.toString());
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling of the node indicated in the path. The node must exist. Namespace aware is true
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSibling(String xpath, String value) throws IOException {
		try {
			return addSibling(xpath, value, true);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling of the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return added Node/Element (the sibling)
	 * @throws SAXException
	 */
	public Element addSibling(String xpath, String value, boolean namespaceAware) throws SAXException {
		Element elm = parse(value, namespaceAware).getDocumentElement();
		return addSibling(xpath, elm);
	}

	/**
	 * Add the w3c Node as sibling of the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param node
	 *            node to add as sibling of the node
	 * @return added Node/Element (the sibling)
	 */
	public Element addSibling(String xpath, Node node) {
		Node newNode = node;
		if (node instanceof Document) {
			newNode = ((Document) node).getDocumentElement();
		}
		return (Element) getNode(xpath).getParentNode().appendChild(doc.importNode(newNode, true));
	}

	/**
	 * Add a sibling before an existing node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            an XMLDocument to add as a sibling of the node
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingBefore(String xpath, XMLDocument value) throws IOException {
		try {
			return addSiblingBefore(xpath, value.toString());
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling before the node indicated in the path. The node must exist. Namespace aware is true
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingBefore(String xpath, String value) throws IOException {
		try {
			return addSiblingBefore(xpath, value, true);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling before the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingBefore(String xpath, String value, boolean namespaceAware) throws IOException {
		try {
			Element elm = parse(value, namespaceAware).getDocumentElement();
			return addSiblingBefore(xpath, elm);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the w3c Node as sibling before the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param node
	 *            node to add as sibling of the node
	 * @return added Node/Element (the sibling)
	 */
	public Element addSiblingBefore(String xpath, Node node) {
		Node newNode = node;
		if (node instanceof Document) {
			newNode = ((Document) node).getDocumentElement();
		}
		Node ref = getNode(xpath);
		return (Element) ref.getParentNode().insertBefore(doc.importNode(newNode, true), ref);
	}

	/**
	 * Add a sibling after an existing node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            an XMLDocument to add as a sibling of the node
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingAfter(String xpath, XMLDocument value) throws IOException {
		try {
			return addSiblingAfter(xpath, value.toString());
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling after the node indicated in the path. The node must exist. Namespace aware is true
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingAfter(String xpath, String value) throws IOException {
		try {
			return addSiblingAfter(xpath, value, true);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the value in XML style as sibling after the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param value
	 *            value to add as sibling of the node (ex. &lt;NEWNODE&gt;...&lt;/NEWNODE&gt;)
	 * @param namespaceAware
	 *            Name space aware true/false
	 * @return added Node/Element (the sibling)
	 * @throws IOException
	 */
	public Element addSiblingAfter(String xpath, String value, boolean namespaceAware) throws IOException {
		try {
			Element elm = parse(value, namespaceAware).getDocumentElement();
			return addSiblingAfter(xpath, elm);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Add the w3c Node as sibling after the node indicated in the path. The node must exist
	 *
	 * @param xpath
	 *            path to node
	 * @param node
	 *            node to add as sibling of the node
	 * @return added Node/Element (the sibling)
	 */
	public Element addSiblingAfter(String xpath, Node node) {
		Node newNode = node;
		if (node instanceof Document) {
			newNode = ((Document) node).getDocumentElement();
		}
		Node ref = getNode(xpath);
		Node before = ref.getNextSibling();
		return (Element) ref.getParentNode().insertBefore(doc.importNode(newNode, true), before);
	}

	/**
	 * Duplicate the document
	 *
	 * @return duplicate of the document
	 * @throws IOException
	 */
	public XMLDocument duplicate() throws IOException {
		try {
			return getDocument(doc.cloneNode(true), characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * log level TRACE
	 */
	public void ltrace() {
		ltrace("");
	}

	/**
	 * log level TRACE
	 *
	 * @param prefix
	 */
	public void ltrace(String prefix) {
		logger.trace("{}{}", prefix, this.toString());
	}

	/**
	 * log level DEBUG
	 */
	public void ldebug() {
		ldebug("");
	}

	/**
	 * log level DEBUG
	 *
	 * @param prefix
	 */
	public void ldebug(String prefix) {
		if (logger.isDebugEnabled()) {
			logger.debug("{}{}", prefix, this.toString());
		}
	}

	/**
	 * log level INFO
	 */
	public void linfo() {
		linfo("");
	}

	/**
	 * log level INFO
	 *
	 * @param prefix
	 */
	public void linfo(String prefix) {
		logger.info("{}{}", prefix, this.toString());
	}

	/**
	 * log level WARN
	 */
	public void lwarn() {
		lwarn("");
	}

	/**
	 * log level WARN
	 *
	 * @param prefix
	 */
	public void lwarn(String prefix) {
		logger.warn("{}{}", prefix, this.toString());
	}

	/**
	 * log level ERROR
	 */
	public void lerror() {
		lerror("");
	}

	/**
	 * log level ERROR
	 *
	 * @param prefix
	 */
	public void lerror(String prefix) {
		logger.error("{}{}", prefix, this.toString());
	}

	/**
	 * <p>
	 * Json representation of the XML document<br>
	 * forceTopLevelObject = true<br>
	 * skipWhitespace = true<br>
	 * skipNamespaces = true<br>
	 * removeNamespacePrefixFromElements = true<br>
	 * </p>
	 *
	 * @return json representation of the XML
	 */
	public String getJson() {
		return XML.xml2json(toString());
	}

	/**
	 * Set the XML factory
	 *
	 * @param factory
	 *            Document Builder Factory
	 */
	public void setFactory(String factory) {
		this.factory = factory;
	}

	/**
	 * Apply an XSLT to the document
	 *
	 * @param xsltFile
	 *            path to XSLT file relative to 'configs/xsltFiles/' directory
	 * @return transformed XML as XMLDocument
	 * @throws IOException
	 */
	public XMLDocument transform(String xsltFile) throws IOException {
		try {
			FileStore fStore = getFileStore(FileUtils.verifyPath(Constants.xsltFiles) + xsltFile, characterset);
			String newDocument = XML.transform(toString(), fStore.getFile().getBytes(characterset)); // NOSONAR

			return getDocument(newDocument, characterset);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Save the document as an XML String
	 *
	 * @param path
	 *            File path
	 * @throws IOException
	 */
	public void saveString(String path) throws IOException {
		FileUtils.saveString(path, toString());
	}

	/**
	 * Append the document as an XML String. The parent directory will be created if it does not exist
	 *
	 * @param path
	 *            File path
	 * @throws IOException
	 */
	public void openAppendString(String path) throws IOException {
		FileUtils.openAppendString(path, toString());
	}

	/**
	 * Document Characterset
	 *
	 * @return document characterset
	 */
	public String getCharacterSet() {
		return characterset;
	}

	/**
	 * Preserve the white space in all elements of the document. Work with all XML parsers
	 */
	public void setPreserveWhiteSpace() {
		doc.getDocumentElement().setAttribute("xml:space", "preserve");
	}

	/**
	 * Preserve the white space in the node and in all descendants of that element
	 *
	 * @param xpath
	 *            Path to the node
	 */
	public void setPreserveWhiteSpace(String xpath) {
		addAttribute(xpath, "xml:space", "preserve");
	}

	/**
	 * @return org.w3c.dom.Document
	 */
	public Document getDocument() {
		return doc;
	}

	protected static FileStore getFileStore(String filePath, String characterset) throws IOException {
		long lastRead = 0;
		FileStore fStore = files.get(filePath);
		if (fStore != null) {
			lastRead = fStore.getCreationTime();
		}
		if (org.apache.commons.io.FileUtils.isFileNewer(new File(filePath), lastRead)) {
			fStore = FileStore.getStore(FileUtils.loadString(filePath, characterset));
			files.put(filePath, fStore);
		}

		return fStore;
	}

	private void init(Object obj) {
		logger = LoggerFactory.getLogger(this.getClass());
		jxPathContext = JXPathContext.newContext(obj);
		jxPathContext.setFactory(new NodeFactory());
		jxPathContext.setLenient(true);
	}

	private Document parse(String value, boolean namespaceAware) throws SAXException {
		System.setProperty("javax.xml.parsers.DocumentBuilderFactory", factory);
		Document document = null;
		try {
			document = XML.string2XML(value, namespaceAware, characterset);
		} catch (Exception ex) {
			throw new SAXException(ex);
		}

		return document;
	}

	private class NodeFactory extends AbstractFactory {
		@Override
		public boolean createObject(JXPathContext context, Pointer pointer, Object parent, String name, int index) {
			Node node = (Node) parent;
			Document owner = node.getOwnerDocument();
			Node newNode = owner.createElement(name);
			node.appendChild(newNode);
			return true;
		}
	}

	private String makeLocalNamePath(String xpath, String localName) {
		return xpath + "*[local-name() = '" + localName + "']";
	}

	private Node addChildReturnNode(String xpath, Node pNode) {
		Node child = null;

		try {
			Node node = getNode(xpath);
			if (node instanceof Document) {
				node = ((Document) node).getDocumentElement();
			}
			child = node.appendChild(doc.importNode(pNode, true));
		} catch (Exception ex) {
			logger.error("", ex);
			child = null;
		}

		return child;
	}
}
