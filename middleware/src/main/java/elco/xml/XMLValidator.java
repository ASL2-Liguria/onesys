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
package elco.xml;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javax.xml.XMLConstants;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.validation.Validator;

import elco.exceptions.XMLException;
import elco.middleware.camel.beans.XMLDocument;

/**
 * XML validator<br>
 * since 5.0.0
 *
 * @author Roberto Rizzo
 */
public class XMLValidator {

	private Validator validator = null;

	/**
	 * @param xsd
	 *            XSD used to validate
	 * @throws XMLException
	 */
	public XMLValidator(String xsd) throws XMLException {
		this(xsd.getBytes());
	}

	/**
	 * @param xsd
	 *            XSD used to validate
	 * @throws XMLException
	 */
	public XMLValidator(byte[] xsd) throws XMLException {
		this(new ByteArrayInputStream(xsd));
	}

	/**
	 * @param xsd
	 *            XSD used to validate
	 * @throws XMLException
	 */
	public XMLValidator(InputStream xsd) throws XMLException {
		try {
			SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
			Schema schemaXSD = schemaFactory.newSchema(new StreamSource(xsd));
			validator = schemaXSD.newValidator();
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}

	/**
	 * Validate an XML
	 *
	 * @param xml
	 *            XML to validate
	 * @throws XMLException
	 */
	public void validate(XMLDocument xml) throws XMLException {
		validate(xml.toString());
	}

	/**
	 * Validate an XML
	 *
	 * @param xml
	 *            XML to validate
	 * @throws XMLException
	 */
	public void validate(String xml) throws XMLException {
		validate(xml.getBytes());
	}

	/**
	 * Validate an XML
	 *
	 * @param xml
	 *            XML to validate
	 * @throws XMLException
	 */
	public void validate(byte[] xml) throws XMLException {
		validate(new ByteArrayInputStream(xml));
	}

	/**
	 * Validate an XML
	 *
	 * @param xml
	 *            XML to validate
	 * @throws XMLException
	 */
	public void validate(InputStream xml) throws XMLException {
		try {
			validator.validate(new StreamSource(xml));
		} catch (Exception ex) {
			throw new XMLException(ex);
		}
	}
}
