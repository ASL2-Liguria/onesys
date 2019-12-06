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
package elco.middleware.jdbc.xml;

import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;

import elco.insc.Constants;

/**
 * @author Roberto Rizzo
 */
final class SAXHandler implements ContentHandler {

	private String xmlTag = "<?xml version=\"1.0\" encoding=\"" + Constants.DEFAULT_VM_CHARSET + "\"?>";
	private String tempValue = "";
	private String document = "";

	/**
	 * Default VM character set to use in xml encoding property
	 */
	public SAXHandler() {
		// OK
	}

	/**
	 * @param characterset
	 *            character set to use in xml encoding property
	 */
	public SAXHandler(String characterset) {
		xmlTag = "<?xml version=\"1.0\" encoding=\"" + characterset + "\"?>";
	}

	public String getDocument() {
		return document;
	}

	private String makeOpenTag(String tag) {
		return "<" + tag + ">";
	}

	private String makeCloseTag(String tag) {
		return "</" + tag + ">";
	}

	@Override
	public void characters(char[] ch, int start, int length) throws SAXException {
		tempValue += new String(ch, start, length);
	}

	@Override
	public void endDocument() throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void processingInstruction(String target, String data) throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void setDocumentLocator(Locator locator) {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void startDocument() throws SAXException {
		document = xmlTag;
	}

	@Override
	public void endElement(String uri, String localName, String qName) throws SAXException {
		document += tempValue + makeCloseTag(qName);
		tempValue = "";
	}

	@Override
	public void endPrefixMapping(String prefix) throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void skippedEntity(String name) throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}

	@Override
	public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
		document += makeOpenTag(qName);
	}

	@Override
	public void startPrefixMapping(String prefix, String uri) throws SAXException {
		// TODO Auto-generated method stub // NOSONAR
	}
}
