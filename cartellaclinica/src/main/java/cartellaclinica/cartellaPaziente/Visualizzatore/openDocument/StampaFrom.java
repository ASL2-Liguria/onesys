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
package cartellaclinica.cartellaPaziente.Visualizzatore.openDocument;

import java.awt.print.PrinterException;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

import javax.print.PrintService;
import javax.print.PrintServiceLookup;

import org.bouncycastle.cms.CMSException;

import matteos.utils.xml.PolarisUtilsXmlException;
import matteos.utils.xml.Xsl;
import polaris.digitalsign.RetrieveSignInfo;
import stampe.pdfone.PDFOneConfig;

import com.gnostice.pdfone.PdfDocument;
import com.gnostice.pdfone.PdfException;
import com.gnostice.pdfone.PdfPrinter;
import com.gnostice.pdfone.PdfReader;
import org.apache.commons.io.IOUtils;

/**
 * @author Fabio Capra
 *
 *Classe per la Stampa di un PDF
 *da File da URL o dall Array di byte che rappresenta il PDF
 *
 */
/**
 * @author Administrator
 *
 */
/**
 * @author Administrator
 *
 */
public class StampaFrom {
	private String stampante = new String("");
	private String range = new String("");
	private int n_copie = 1;
	private byte[] byteToPrint;
	private boolean PrintFromFile = false;
	private boolean StampaSu = false;
	private File fileToPrint;
	private int pageSize = 0;

	/**
	 * @param inUrl
	 *            PUBE Costruttore della classe a cui viene passato la stringa
	 *            che rappresenta la url da stampare
	 */
	public StampaFrom(String inUrl) throws StampaPdfException {
		PDFOneConfig.activate();

		try {

			this.byteToPrint = GetArrayBytesFromUrl(inUrl);
			//this.byteToPrint = Xsl.xml2pdf(arg0, arg1)
		} catch (StampaPdfException ex) {
			throw ex;
		}

	}
	/*
	 *  Costruttore a cui passo 2 url : uno col documento xml e l'altro con il foglio di stile
	 *  la classe Xsl ricostruisce il pdf come array di byte
	 */
	public StampaFrom(String inUrlDoc, String inUrlFoglioStile) throws StampaPdfException, PolarisUtilsXmlException {
		byte[] xmlDoc;
		byte[] xmlFoglioStile;

		PDFOneConfig.activate();
		try {
			xmlDoc = GetArrayBytesFromUrl(inUrlDoc);
			xmlFoglioStile = GetArrayBytesFromUrl(inUrlFoglioStile);
			try{
				this.byteToPrint = Xsl.xml2pdf(xmlDoc, xmlFoglioStile);
			}catch (PolarisUtilsXmlException pe){
				throw pe;
			}

		} catch (StampaPdfException ex) {
			throw ex;
		}

	}
	/**
	 * @param inFile
	 *
	 */
	/**
	 * @param inFile
	 * @param boolean isFile Costruttore della classe a cui viene passato il
	 *        file PDF da stampare e una variabile booleana che indica che sto
	 *        stampando un file
	 */

	public StampaFrom(File inFile, boolean isFile) throws StampaPdfException {
		PDFOneConfig.activate();
		if (inFile.exists()) {
			this.PrintFromFile = true;
			this.fileToPrint = inFile;
		} else {
			throw new StampaPdfException("File Non Trovato");
		}
	}

	/**
	 * @param inStringFile
	 * @param itsFile
	 *            Costruttore della classe a cui viene passato il percorso del
	 *            file PDF da stampare
	 */
	public StampaFrom(String inStringFile, boolean isFile)
			throws StampaPdfException {
		PDFOneConfig.activate();
		this.PrintFromFile = true;
		this.fileToPrint = new File(inStringFile);
		if (!this.fileToPrint.exists()) {
			throw new StampaPdfException("File Non Trovato");
		}

	}

	/**
	 * @param inByte
	 *            Costruttore della Classe a cui viene passato il PDF gia'
	 *            codificato in byte
	 */
	public StampaFrom(byte[] inByte) throws StampaPdfException {
		PDFOneConfig.activate();
		if (inByte.length > 10) {
			this.byteToPrint = inByte;
		} else {
			throw new StampaPdfException("Array di byte Errato");
		}
	}

	/**
	 * @param myUrl
	 * @return array di byte
	 *
	 *         Metodo a cui passando una url vengono ritornati i byte della
	 *         risposta
	 */
	public static byte[] GetArrayBytesFromUrl(String myUrl)
			throws StampaPdfException {
		ByteArrayOutputStream tmpOut = new ByteArrayOutputStream();
        InputStream in = null;
		URL pdf = null;
		URLConnection connection = null;

		try {
			pdf = new URL(myUrl);
			connection = pdf.openConnection();
			connection.setConnectTimeout(10000);
			int contentLength = connection.getContentLength();
			in = pdf.openStream();
            IOUtils.copy(in, tmpOut);
/*			byte[] buf = new byte[512];
			int len;
			while (true) {
				len = in.read(buf);
				if (len == -1) {
					break;
				}
				tmpOut.write(buf, 0, len);
			}*/
		} catch (MalformedURLException e) {
			e.printStackTrace();
			throw new StampaPdfException(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			throw new StampaPdfException(e.getMessage());
		} catch (OutOfMemoryError e){
			e.printStackTrace();
			throw new StampaPdfException(e.getMessage());
        } catch (Exception e ){
			e.printStackTrace();
			throw new StampaPdfException(e.getMessage());
        }finally{
            IOUtils.closeQuietly(in);
        }

		System.out.println(tmpOut.size());
		return tmpOut.toByteArray();

	}

	/**
	 * @param inStampante
	 * @param inRange
	 * @param inNcopie
	 * @return Metodo che stampa Passandogli Stampante, range di pagine da
	 *         Stampare e nmero copie
	 */
	public boolean print(String inStampante, String inRange, int inNcopie)
			throws StampaPdfException {

		boolean retBool = false;
		this.stampante = inStampante;
		this.range = inRange;
		this.n_copie = inNcopie;
		try {
			retBool = this.doPrint();
		} catch (StampaPdfException e) {
			retBool = false;
			throw e;
		}
		return retBool;
	}

	/**
	 * @param inStampante
	 * @param inRange
	 * @return Metodo che stampa Passandogli Stampante e range di pagine da
	 *         Stampare
	 */
	public boolean print(String inStampante, String inRange)
			throws StampaPdfException {
		boolean retBool = false;
		this.stampante = inStampante;
		this.range = inRange;
		try {
			retBool = this.doPrint();
		} catch (StampaPdfException e) {
			retBool = false;
			throw e;
		}
		return retBool;
	}

	/**
	 * @param inStampante
	 * @param inNcopie
	 * @return Metodo che stampa Passandogli Stampante e numero di copie da
	 *         Stampare
	 */
	public boolean print(String inStampante, int inNcopie)
			throws StampaPdfException {
		boolean retBool = false;
		this.stampante = inStampante;
		this.n_copie = inNcopie;
		try {
			retBool = this.doPrint();
		} catch (StampaPdfException e) {
			retBool = false;
			throw e;
		}
		return retBool;
	}

	/**
	 * Metodo che stampa utilizzando i parametri passati o quelli di default se
	 * non valorizzati. Default: Stampante = Stampante predefinita di window N*
	 * copie= 1 Range = Tutto il documento
	 *
	 * @return
	 */
	public boolean print() throws StampaPdfException {
		boolean retBool = false;
		try {
			retBool = this.doPrint();
		} catch (StampaPdfException e) {
			retBool = false;
			throw e;
		}
		return retBool;
	}

	/**
	 * Metodo che setta se aprire o no la finestra di dialogo. Di default e' no
	 *
	 * @param inStampaSu
	 */
	public void setStampaSu(boolean inStampaSu) {
		this.StampaSu = inStampaSu;
	}

	/**
	 * @param inStampante
	 *            Metodo che setta la Stampante se non passato prende la
	 *            Stampante di Default di Windows
	 */
	public void setStampante(String inStampante) {
		this.stampante = inStampante;
	}

	/**
	 * @param inRange
	 *            Metodo che setta il pange range se non passato stampa tutto il
	 *            PDF
	 */
	public void setRange(String inRange) {
		this.range = inRange;
	}

	/**
	 * @param inN_copie
	 *            metodo che setta il numero di copie se non settato stampa 1
	 *            copia per documento
	 */
	public void setNCopie(int inN_copie) {
		this.n_copie = inN_copie;
	}

	public void setPageSize(int pgSize){
		this.pageSize=pgSize;
	}
	/**
	 *metodo per ottenere la stampante di default di Windows
	 *
	 * @return
	 */
	private String GetStampanteDefault() {
		PrintService printer = PrintServiceLookup.lookupDefaultPrintService();
		return printer.getName();
	}

	/**
	 * @return Metodo che lancia la stampa vera e propria.
	 */
	private boolean doPrint() throws StampaPdfException {

		boolean retBool = false;
		PdfReader r = null;
		PdfPrinter pdfPrinter;
		byte[] bToprint = null;
		try {

			pdfPrinter = new PdfPrinter();
			if (this.PrintFromFile) {
				r = PdfReader.fileReader(this.fileToPrint);
			} else {
				RetrieveSignInfo si = null;
				/*Aggiunte nuovi java per la gestione di questa classe*/
				/*try {
					si = new RetrieveSignInfo();
					bToprint = si.originalData; // ritrova i dati senza la firma
				} catch (SignException ex) {
					bToprint = this.byteToPrint; // dati non firmati uso gli originali
				}*/
				try {
					si = new RetrieveSignInfo();
					bToprint = si.GetPdfFromP7m(this.byteToPrint); // ritrova i dati senza la firma
				} catch (CMSException e) {
					// TODO Auto-generated catch block
					bToprint = this.byteToPrint; // dati non firmati uso gli originali
					e.printStackTrace();
				}
				r = PdfReader.memoryReader(bToprint);
			}
			PdfDocument PdfDOC = new PdfDocument(r);
			pdfPrinter.setDocument(PdfDOC);
			pdfPrinter.setPageScale(1);
			if (this.stampante.equalsIgnoreCase("")) {
				this.stampante = GetStampanteDefault();
			}
			if (this.range.equalsIgnoreCase("")) {
				this.range = "1-" + Integer.toString(PdfDOC.getPageCount());
			}

			if (this.StampaSu) {
				pdfPrinter.showPrintDialog();
			} else {
				pdfPrinter.print(this.stampante, this.range, this.n_copie);
			}
			retBool = true;
		} catch (PdfException e) {
			e.printStackTrace();
			retBool = false;
			throw new StampaPdfException(e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			retBool = false;
			throw new StampaPdfException(e.getMessage());
		} catch (PrinterException e) {
			e.printStackTrace();
			retBool = false;
			throw new StampaPdfException(e.getMessage());
		}

		return retBool;
	}

	public  byte[] GetbyteToPrint()
	 {
		return this.byteToPrint;
	 }

}
