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
package elco.digitalsign;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import org.apache.jempbox.xmp.XMPMetadata;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDDocumentNameDictionary;
import org.apache.pdfbox.pdmodel.PDEmbeddedFilesNameTreeNode;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.COSObjectable;
import org.apache.pdfbox.pdmodel.common.PDMetadata;
import org.apache.pdfbox.pdmodel.common.filespecification.PDComplexFileSpecification;
import org.apache.pdfbox.pdmodel.common.filespecification.PDEmbeddedFile;
import org.fusesource.hawtbuf.ByteArrayInputStream;

import elco.insc.Constants;
import elco.middleware.camel.beans.XMLDocument;

/**
 * @author Roberto Rizzo
 */
public class PDFDocument {

	private static final String BASETAG = "//*[local-name() = 'Description']";
	private static final String BASEXML = "<x:xmpmeta xmlns:x=\"adobe:ns:meta/\"><rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\" xmlns:dc=\"http://purl.org/dc/elements/1.1/\"><rdf:Description></rdf:Description></rdf:RDF></x:xmpmeta>";
	private final SimpleDateFormat datesFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:s");
	private PDDocument document = null;
	private final PDDocumentCatalog catalog;
	private int attachmentIndex = 1;

	/**
	 * @param document
	 *            array of bytes representing a PDF document
	 * @throws IOException
	 */
	public PDFDocument(byte[] document) throws IOException {
		this.document = PDDocument.load(new ByteArrayInputStream(document));
		catalog = this.document.getDocumentCatalog();
	}

	/**
	 * Add signers information to the PDF document's metadata
	 *
	 * @param infos
	 *            array of SignInfo objects
	 * @throws Exception
	 */
	public final void addSignInfoToMetadata(SignInfo[] infos) throws Exception {
		XMLDocument metadataXML = XMLDocument.getDocument(BASEXML, Constants.DEFAULT_VM_CHARSET);
		for (int index = 0; index < infos.length; index++) {
			metadataXML.addChild(BASETAG, "<dc:signer" + index + ">" + infos[index].getSigner() + "</dc:signer" + index + ">", false);
			metadataXML.addChild(BASETAG, "<dc:signerCommonName" + index + ">" + infos[index].getSignerCommonName() + "</dc:signerCommonName" + index + ">", false);
			Date sd = infos[index].getSignerSignDate();
			if (sd != null) {
				metadataXML.addChild(BASETAG, "<dc:signerSignDate" + index + ">" + datesFormat.format(sd) + "</dc:signerSignDate" + index + ">", false);
			}
			metadataXML.addChild(BASETAG, "<dc:signerOrganization" + index + ">" + infos[index].getSignerOrganization() + "</dc:signerOrganization" + index + ">", false);
			metadataXML.addChild(BASETAG, "<dc:signerOrganizationUnit" + index + ">" + infos[index].getSignerOrganizationUnit() + "</dc:signerOrganizationUnit" + index + ">",
					false);
			Date ts = infos[index].getSignerTimestampDate();
			if (ts != null) {
				metadataXML.addChild(BASETAG, "<dc:signerTimeStamp" + index + ">" + datesFormat.format(ts) + "</dc:signerTimeStamp" + index + ">", false);
			}
			metadataXML.addChild(BASETAG, "<dc:documentModified" + index + ">" + infos[index].isDocumentModified() + "</dc:documentModified" + index + ">", false);
			metadataXML.addChild(BASETAG, "<dc:documentRevision" + index + ">" + infos[index].getRevisionNumber() + "</dc:documentRevision" + index + ">", false);
		}
		metadataXML.addChild(BASETAG, "<dc:totalRevisions>" + infos.length + "</dc:totalRevisions>", false);

		addMetadataToDocument(metadataXML);
	}

	/**
	 * Add metadata to PDF document
	 *
	 * @param metadataXML
	 *            metadata
	 * @throws Exception
	 */
	public final void addMetadataToDocument(XMLDocument metadataXML) throws Exception {
		PDMetadata metadata = new PDMetadata(document);
		metadata.importXMPMetadata((new XMPMetadata(metadataXML.getDocument())).asByteArray());
		catalog.setMetadata(metadata);
	}

	/**
	 * Add an attachment to the PDF document
	 *
	 * @param attachment
	 *            array of bytes representing the attachment
	 * @param attachmentName
	 *            attachment name
	 * @param attachmentMimeType
	 *            attachment mime type
	 * @throws IOException
	 */
	public final void addAttachment(byte[] attachment, String attachmentName, String attachmentMimeType) throws IOException {
		try {
			PDEmbeddedFile ef = new PDEmbeddedFile(document, new ByteArrayInputStream(attachment));
			ef.setSubtype(attachmentMimeType);
			ef.setSize(attachment.length);
			ef.setCreationDate(new GregorianCalendar());

			PDComplexFileSpecification fs = new PDComplexFileSpecification();
			fs.setFile(attachmentName);
			fs.setEmbeddedFile(ef);

			PDDocumentNameDictionary names = new PDDocumentNameDictionary(catalog);
			PDEmbeddedFilesNameTreeNode actualEfTree = names.getEmbeddedFiles();
			Map<String, COSObjectable> efMap = new HashMap<>();
			if (actualEfTree != null) {
				efMap.putAll(actualEfTree.getNames());
			}
			efMap.put("document" + attachmentIndex++, fs);
			PDEmbeddedFilesNameTreeNode efTree = new PDEmbeddedFilesNameTreeNode();
			efTree.setNames(efMap);
			names.setEmbeddedFiles(efTree);
			catalog.setNames(names);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * Return an array of bytes representing the PDF document and close the underlying COSDocument object
	 *
	 * @return array of bytes representing a PDF document
	 * @throws IOException
	 */
	public final byte[] toByteArray() throws IOException {
		try {
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			document.save(out);
			document.close();

			return out.toByteArray();
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * <p>
	 * Returns the number of pages in the set. To enable advanced printing features, it is recommended that Pageable implementations return the true number of pages rather than the
	 * UNKNOWN_NUMBER_OF_PAGES constant.
	 * </p>
	 *
	 * @return the number of pages in this Pageable
	 */
	public int getNumberOfPages() {
		return document.getNumberOfPages();
	}

	/**
	 * Return a page in the document
	 *
	 * @param index
	 *            Index of the page
	 * @return PDPage object
	 */
	public PDPage getPage(int index) {
		return (PDPage) catalog.getAllPages().get(index);
	}
}
