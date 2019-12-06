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
package elco.images.svg;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.dcm4che2.util.CloseUtils;
import org.w3c.dom.Attr;

import elco.exceptions.SVGExportException;
import elco.middleware.camel.beans.XMLDocument;

/**
 * @author Roberto Rizzo
 */
public final class SVGImages {

	private SVGImages() {
	}

	private static byte[] svg2format(String input, Format format) throws SVGExportException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		try {
			SVGExport svgExp = new SVGExport();
			svgExp.setInputAsString(input).setOutput(out).setTranscoder(format.getTranscoderInstance()).transcode();
		} finally {
			CloseUtils.safeClose(out);
		}

		return out.toByteArray();
	}

	/**
	 * Convert SVG image to PNG image
	 *
	 * @param input
	 *            SVG image
	 * @return PNG image
	 * @throws SVGExportException
	 */
	public static byte[] svg2png(XMLDocument input) throws SVGExportException {
		return svg2png(input.toString());
	}

	/**
	 * Convert SVG image to PNG image
	 *
	 * @param input
	 *            SVG image
	 * @return PNG image
	 * @throws SVGExportException
	 */
	public static byte[] svg2png(String input) throws SVGExportException {
		return svg2format(input, Format.PNG);
	}

	/**
	 * Convert SVG image to JPEG image
	 *
	 * @param input
	 *            JPEG image
	 * @return PNG image
	 * @throws SVGExportException
	 */
	public static byte[] svg2jpeg(XMLDocument input) throws SVGExportException {
		return svg2jpeg(input.toString());
	}

	/**
	 * Convert SVG image to JPEG image
	 *
	 * @param input
	 *            JPEG image
	 * @return PNG image
	 * @throws SVGExportException
	 */
	public static byte[] svg2jpeg(String input) throws SVGExportException {
		return svg2format(input, Format.JPEG);
	}

	/**
	 * Convert SVG image to TIFF image
	 *
	 * @param input
	 *            SVG image
	 * @return TIFF image
	 * @throws SVGExportException
	 */
	public static byte[] svg2tiff(XMLDocument input) throws SVGExportException {
		return svg2tiff(input.toString());
	}

	/**
	 * Convert SVG image to TIFF image
	 *
	 * @param input
	 *            SVG image
	 * @return TIFF image
	 * @throws SVGExportException
	 */
	public static byte[] svg2tiff(String input) throws SVGExportException {
		return svg2format(input, Format.TIFF);
	}

	/**
	 * Transforms rgba to rgb plus opacity
	 *
	 * @param xml
	 *            SVG document
	 */
	public static XMLDocument rgba2rgb(XMLDocument xml) {
		@SuppressWarnings("unchecked")
		List<Attr> attributes = (List<Attr>) xml.getNodeList("//attribute::*[contains(., 'rgba')]");

		attributes.parallelStream().forEach(attribute -> {
			String nodeValue = StringUtils.substringBetween(attribute.getNodeValue(), "(", ")");
			String[] values = StringUtils.split(nodeValue, ",");
			attribute.setNodeValue("rgb(" + values[0].trim() + "," + values[1].trim() + "," + values[2].trim() + ")");
			attribute.getOwnerElement().setAttribute(attribute.getNodeName() + "-opacity", values[3].trim());
		});

		return xml;
	}
}
