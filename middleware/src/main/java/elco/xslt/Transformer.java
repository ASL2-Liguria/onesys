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
package elco.xslt;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Result;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.dcm4che2.util.CloseUtils;

import elco.insc.Constants;
import elco.insc.FileUtils;
import elco.xml.XMLValidator;

/**
 * XML transformation and validation. VM charset used as default
 *
 * @author Roberto Rizzo
 */
public final class Transformer {

	private TransformerFactory tFactory;
	private javax.xml.transform.Transformer transformerObj = null;
	private Result result = null;
	private ByteArrayOutputStream resultStream = null;

	protected Transformer(String xsltPath, String transformerFactory) throws TransformerConfigurationException, IOException {
		this(FileUtils.loadByteArray(xsltPath), transformerFactory);
	}

	protected Transformer(byte[] xslt, String transformerFactory) throws TransformerConfigurationException {
		this(new ByteArrayInputStream(xslt), transformerFactory);
	}

	protected Transformer(InputStream xslt, String transformerFactory) throws TransformerConfigurationException {
		init(xslt, transformerFactory);
	}

	/**
	 * Default character set default VM
	 *
	 * @param xsltPath
	 *            path to the XSLT file
	 * @return new Transformer object
	 * @throws TransformerConfigurationException
	 */
	public static Transformer getTransformer(String xsltPath) throws TransformerConfigurationException {
		try {
			return new Transformer(xsltPath, null);
		} catch (Exception ex) {
			throw new TransformerConfigurationException(ex);
		}
	}

	/**
	 * Default character set default VM
	 *
	 * @param xslt
	 *            byte array that contains the XSLT
	 * @return new Transformer object
	 * @throws TransformerConfigurationException
	 */
	public static Transformer getTransformer(byte[] xslt) throws TransformerConfigurationException {
		return new Transformer(xslt, null);
	}

	/**
	 * Default character set default VM
	 *
	 * @param xslt
	 *            InputStream to the XSLT
	 * @return new Transformer object
	 * @throws TransformerConfigurationException
	 */
	public static Transformer getTransformer(InputStream xslt) throws TransformerConfigurationException {
		return new Transformer(xslt, null);
	}

	/**
	 * @param xslt
	 *            byte array that contains the XSLT
	 * @param transformerFactory
	 *            class of the factory to use
	 * @return new Transformer object
	 * @throws TransformerConfigurationException
	 */
	public static Transformer getTransformer(byte[] xslt, String transformerFactory) throws TransformerConfigurationException {
		return new Transformer(xslt, transformerFactory);
	}

	/**
	 * @param sourceXMLPath
	 *            path to the XSLT file
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(String sourceXMLPath) throws TransformerException {
		try {
			return transform(new FileInputStream(sourceXMLPath), null);
		} catch (Exception ex) {
			throw new TransformerException(ex);
		}
	}

	/**
	 * @param sourceXMLPath
	 *            path to the XSLT file
	 * @param xsdPath
	 *            path to the XSD file used to validate output XML
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(String sourceXMLPath, String xsdPath) throws TransformerException {
		try {
			return transform(new FileInputStream(sourceXMLPath), new FileInputStream(xsdPath)); // NOSONAR
		} catch (Exception ex) {
			throw new TransformerException(ex);
		}
	}

	/**
	 * @param sourceXML
	 *            byte array containing the XML to transform
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(byte[] sourceXML) throws TransformerException {
		return transform(new ByteArrayInputStream(sourceXML), null);
	}

	/**
	 * @param sourceXML
	 *            byte array containing the XML to transform
	 * @param xsd
	 *            byte array containing the XSD used to validate output XML (can be NULL)
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(byte[] sourceXML, byte[] xsd) throws TransformerException {
		return transform(new ByteArrayInputStream(sourceXML), xsd != null ? new ByteArrayInputStream(xsd) : null);
	}

	/**
	 * @param sourceXML
	 *            InputStream to the XML to transform
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(InputStream sourceXML) throws TransformerException {
		return transform(sourceXML, null);
	}

	/**
	 * @param sourceXML
	 *            InputStream to the XML to transform
	 * @param xsd
	 *            InputStream to the XSD used to validate output XML
	 * @return byte array containing transformed XML
	 * @throws TransformerException
	 */
	public byte[] transform(InputStream sourceXML, InputStream xsd) throws TransformerException {
		try { // NOSONAR
			byte[] outputXML = null;

			if (result == null) {
				resultStream = new ByteArrayOutputStream();
				result = new StreamResult(resultStream);
			}

			transformerObj.transform(new StreamSource(sourceXML), result);
			outputXML = resultStream.toByteArray();

			if (xsd != null) { // validate xml output with an xsd file
				XMLValidator validator = new XMLValidator(xsd);
				validator.validate(outputXML);
			}

			return outputXML;
		} catch (Exception ex) {
			throw new TransformerException(ex);
		} finally {
			CloseUtils.safeClose(sourceXML);
			CloseUtils.safeClose(xsd);
		}
	}

	/**
	 * Add an input parameter
	 *
	 * @param name
	 *            name of the parameter
	 * @param value
	 *            value of the parameter
	 */
	public void addInputParameter(String name, String value) {
		transformerObj.setParameter(name, value);
	}

	/**
	 * Clear all parameters set with addInputParameter
	 */
	public void clearInputParameters() {
		transformerObj.clearParameters();
	}

	/**
	 * Set output encoding
	 *
	 * @param encoding
	 */
	public void setOutputEncoding(String encoding) {
		transformerObj.setOutputProperty(OutputKeys.ENCODING, encoding);
	}

	/**
	 * Set a Result object and a stream where the result is write. Default used: StreamResult and ByteArrayOutputSteam
	 *
	 * @param result
	 * @param stream
	 */
	public void setResult(Result result, ByteArrayOutputStream stream) {
		this.result = result;
		resultStream = stream;
	}

	/**
	 * Reset transformer to its original configuration when was created. Charset set to default VM
	 */
	public void reset() {
		transformerObj.reset();
		clearInputParameters();
		setOutputEncoding(Constants.DEFAULT_VM_CHARSET);
	}

	private void init(InputStream xslt, String transformerFactory) throws TransformerConfigurationException {
		if (transformerFactory == null) {
			tFactory = TransformerFactory.newInstance();
		} else {
			tFactory = TransformerFactory.newInstance(transformerFactory, null);
		}
		tFactory.setErrorListener(new ErrorHandler());
		transformerObj = tFactory.newTransformer(new StreamSource(xslt));
		setOutputEncoding(Constants.DEFAULT_VM_CHARSET);
	}
}
