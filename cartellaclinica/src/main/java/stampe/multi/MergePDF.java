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
package stampe.multi;

import imago.sql.ElcoLoggerInterface;
import it.elco.core.actions.LoadPropertiesFile;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Properties;

import matteos.servlets.Logger;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfCopyFields;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;

import core.Global;

public class MergePDF 
{
	ElcoLoggerInterface log = Logger.getLogger();
	public static final String PAGE_PATH_CONF = "/WEB-INF/properties/pageGlobal.properties";	
	public static final String X_DIMENSION = "xdimension";
	public static final String Y_DIMENSION = "ydimension";
	/**
	 * Classe che utilizza la libreria itextpdf per unire più pdf   
	 * @author alessandroc - linob
	 */
	MergePDF(){
		
	}
	
	/**
	 * Metodo per concatenare piu pdf insieme a partire dal vettore contenente il byte array del pdf  e ordinati per un indice numerico 
	 * @param Hashtable : insieme dei byte array ordinati per un numero intero(key=numero,valore=byte[])
	 * @param int 		: key della Hashtable 
	 * @author linob
	 */
	public byte[] MergiaAllPdf(Hashtable<Integer, byte[]> allReport,int num)
	{
		OutputStream returnPdf 	= new ByteArrayOutputStream();
		byte[] returnByte	= null;
		byte[] tmpByte		= null;
		log.debug("Inizio funzione di merge");
		try{	
			PdfReader reader; 
			PdfCopyFields pcf = new PdfCopyFields(returnPdf);
			log.debug("Inizio gestione hashtable byte di array");
			try
			{
				for (int i=0;i<=num;i++)
				{
					tmpByte = allReport.get(i);
					if (tmpByte.length>1)
					{
						reader = new PdfReader(tmpByte);
						pcf.addDocument(reader);
					}
				}
			}
			catch(IOException ex)
			{
				log.error("Mergia pdf errore gestione HashTable byte array: "+ex.getMessage());
			}
			log.debug("fine gestione hashtable byte di array");
			try{
			pcf.close();
			}catch (Exception ex){
				ex.getMessage();
			}
		} 
		catch (DocumentException e) 
		{
			e.printStackTrace();
			log.error("Mergia pdf eccezione: "+e.getMessage());
		} 
		log.debug("fine funzione di merge");
		returnByte =((ByteArrayOutputStream) returnPdf).toByteArray();
		log.debug("ritorno byte");
		return returnByte;
	}

	/**
	 * Metodo per concatenare piu pdf insieme a partire dal vettore contenente il byte array del pdf  
	 * @param Hashtable : insieme dei byte array ordinati per un numero intero(key=iden pdf firmato,valore=byte[])
	 * @param int 		: key della Hashtable (iden della lettera firmata)
	 * @author linob
	 */
	public byte[] MergiaAllPdf(Hashtable<Integer, byte[]> allReport)
	{
		OutputStream returnPdf 	= new ByteArrayOutputStream();
		byte[] returnByte	= null;
		byte[] tmpByte		= null;
		log.debug("Inizio funzione di merge");
		try{	
			PdfReader reader; 
			PdfCopyFields pcf = new PdfCopyFields(returnPdf);
			log.debug("Inizio gestione hashtable byte di array");
			try
			{
				for (Enumeration e = allReport.keys() ; e.hasMoreElements() ;) {
					tmpByte = allReport.get(e.nextElement());
					if (tmpByte.length>1)
					{
						reader = new PdfReader(tmpByte);
						pcf.addDocument(reader);
					}
			     }
			}
			catch(IOException ex)
			{
				log.error("Mergia pdf errore gestione HashTable byte array: "+ex.getMessage());
			}
			log.debug("fine gestione hashtable byte di array");
			pcf.close();
		} 
		catch (DocumentException e) 
		{
			e.printStackTrace();
			log.error("Mergia pdf eccezione: "+e.getMessage());
		} 
		log.debug("fine funzione di merge");
		returnByte =((ByteArrayOutputStream) returnPdf).toByteArray();
		log.debug("ritorno byte");
		return returnByte;
	}	
	
	public byte[] MergiaByte(byte[] report,byte[] pdf)
	{
		OutputStream returnPdf 	= new ByteArrayOutputStream();
		byte[] returnByte	= null;
		log.debug("Inizio funzione di merge");
		try{	
			PdfReader reader;
			PdfCopyFields pcf = new PdfCopyFields(returnPdf);
			log.debug("Inizio gestione hashtable byte di array");
			try
			{
				if (report.length > 0) {
					reader = new PdfReader(report);
					pcf.addDocument(reader);
				}
				if (pdf.length > 0) {
					reader = new PdfReader(pdf);
					pcf.addDocument(reader);
				}
			}
			catch(IOException ex)
			{
				log.error("Mergia pdf errore gestione HashTable byte array: "+ex.getMessage());
			}
			log.debug("fine gestione hashtable byte di array");
			pcf.close();
		} 
		catch (DocumentException e) 
		{
			e.printStackTrace();
			log.error("Mergia pdf eccezione: "+e.getMessage());
		} 
		log.debug("fine funzione di merge");
		returnByte =((ByteArrayOutputStream) returnPdf).toByteArray();
		log.debug("ritorno byte");
		return returnByte;
	}
	
	public byte[] numPage(byte[] pdfConcatenato) {
		log.debug("inizio funzione di numerazione");
		OutputStream returnPdf = new ByteArrayOutputStream();
		byte[] returnByte;
		Properties props = null;
		log.debug("Inizio lettura file properties");
		try {
			props = readFromPropertiesFile();
		} catch (FileNotFoundException e1) {
			log.error(e1);
			props = new Properties();
			props.setProperty(X_DIMENSION, "20");	
			props.setProperty(Y_DIMENSION, "20");
		} catch (IOException e1) {
			log.error(e1);
			props = new Properties();
			props.setProperty(X_DIMENSION, "20");	
			props.setProperty(Y_DIMENSION, "20");
		}
		
		try {
			PdfReader reader1 = new PdfReader(pdfConcatenato);
			PdfStamper pdfStamper = new PdfStamper(reader1, returnPdf);
			PdfGState gs = new PdfGState();

			BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA_BOLD,
					BaseFont.WINANSI, BaseFont.EMBEDDED);
			int i = 0;
			int number_of_pages = reader1.getNumberOfPages();
			
			int X = Integer.valueOf(props.getProperty(X_DIMENSION));
			int Y = Integer.valueOf(props.getProperty(Y_DIMENSION));
			log.debug("X: "+Integer.toString(X)+"---Y:"+Integer.toString(X));
			log.debug("Numero di pagine totali"
					+ Integer.toString(number_of_pages));
			while (i < number_of_pages) {

				i++;
				PdfContentByte overContent = pdfStamper.getOverContent(i);
				gs.setFillOpacity(0.8f);
				overContent.setGState(gs);
				overContent.beginText();
				overContent.setFontAndSize(bf, 8);
				overContent.setColorFill(BaseColor.BLACK);
				
				// Yone = Integer.valueOf(Y1R);
				// Ytwo = Integer.valueOf(Y2R);
				overContent.showTextAligned(
						Element.ALIGN_CENTER,
						Integer.toString(i) + "/"+ Integer.toString(number_of_pages),
						reader1.getPageSize(i).getWidth() - X,
						Y, 
						0);
				overContent.endText();
				overContent.stroke();

			}
			pdfStamper.close();

		} catch (IOException e) {
			log.error("Errore lettura file per l'inserimento della numerazione di pagina"
					+ e.getMessage());
		} catch (DocumentException e) {
			log.error("Errore lettura file per l'inserimento della numerazione di pagina"
					+ e.getMessage());
		} catch (Exception e){
			log.error(e);
		}
		log.debug("fine funzione di numerazione");
		returnByte = ((ByteArrayOutputStream) returnPdf).toByteArray();
		log.debug("ritorno byte");
		return returnByte;

	}
	
	public Properties readFromPropertiesFile() throws FileNotFoundException, IOException{
			Properties props = new LoadPropertiesFile(Global.context.getRealPath(".")+ PAGE_PATH_CONF).execute();
			return props;
	}
	
}
