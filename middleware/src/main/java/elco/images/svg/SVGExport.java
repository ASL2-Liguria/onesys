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

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.StringReader;
import java.io.Writer;

import org.apache.batik.transcoder.Transcoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.w3c.dom.Document;
import org.xml.sax.XMLFilter;
import org.xml.sax.XMLReader;

import elco.exceptions.SVGExportException;

/**
 *
 * @author Roberto Rizzo
 */
public final class SVGExport {

	private Transcoder			transcoder;
	private TranscoderInput		in;
	private TranscoderOutput	out;

	public TranscoderInput getInput() {
		return in;
	}

	public SVGExport setInput(TranscoderInput in) {
		this.in = in;

		return this;
	}

	public SVGExport setInput(Document doc) {
		in = new TranscoderInput(doc);

		return this;
	}

	public SVGExport setInput(String uri) {
		in = new TranscoderInput(uri);

		return this;
	}

	public SVGExport setInput(InputStream in) {
		this.in = new TranscoderInput(in);

		return this;
	}

	public SVGExport setInput(Reader reader) {
		in = new TranscoderInput(reader);

		return this;
	}

	public SVGExport setInput(XMLReader reader) {
		in = new TranscoderInput(reader);

		return this;
	}

	public SVGExport setInputAsString(String svg) {
		in = new TranscoderInput(new StringReader(svg));

		return this;
	}

	public TranscoderOutput getOutput() {
		return out;
	}

	public SVGExport setOutput(TranscoderOutput out) {
		this.out = out;

		return this;
	}

	public SVGExport setOutput(Document document) {
		out = new TranscoderOutput(document);

		return this;
	}

	public SVGExport setOutput(Writer writer) {
		out = new TranscoderOutput(writer);

		return this;
	}

	public SVGExport setOutput(OutputStream outputStream) {
		out = new TranscoderOutput(outputStream);

		return this;
	}

	public SVGExport setOutput(String uri) {
		out = new TranscoderOutput(uri);

		return this;
	}

	public SVGExport setOutput(XMLFilter filter) {
		out = new TranscoderOutput(filter);

		return this;
	}

	public Transcoder getTranscoder() {
		return transcoder;
	}

	public SVGExport setTranscoder(Transcoder transcoder) {
		this.transcoder = transcoder;

		return this;
	}

	public SVGExport setTranscoder(Format format) throws SVGExportException {
		transcoder = format.getTranscoderInstance();

		return this;
	}

	public SVGExport transcode() throws SVGExportException {
		try {
			transcoder.transcode(in, out);
		} catch (TranscoderException ex) {
			throw new SVGExportException(ex);
		}

		return this;
	}
}
