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
package refertazioneConsulenze.pckObject;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.servlet.http.HttpSession;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.commons.io.IOUtils;


public class pckObjectXml implements iRefLetObject {

	private final String nameOfFieldSet = "divXmlObject"; 
	private final String pXslPath_ini 	= "/WEB-INF/templates/refertazione/xsl/";
	private final String pXslPath_fin 	= ".xsl";
	private final String pXmlPath_ini 	= "/WEB-INF/templates/refertazione/oggetto/";
	private final String pXmlPath_fin 	= ".xml";
	protected final ElcoLoggerInterface log=new ElcoLoggerImpl(this.getClass());
	
	private String pXslPath;
	private String pXmlPath;
	
	private String pPathGlobale = "";
	private TransformerFactory tf;
	private StringReader xmlreader;
	private HttpSession pSess;
	private String valueLabel;
	private String ordinamento;
    
	public pckObjectXml(HttpSession sess,String id_elemento,String labelPadre,String ordinamento){
		this.pSess = sess;
		this.pPathGlobale = this.pSess.getServletContext().getRealPath(".");
		setPathFile(id_elemento);
		this.valueLabel = labelPadre;
        this.ordinamento = ordinamento;
	}
	
	public pckObjectXml(HttpSession sess,String xml,String id_elemento,String labelPadre,String ordinamento){
		this.xmlreader = new StringReader(xml);
		this.pSess = sess;
		this.pPathGlobale = this.pSess.getServletContext().getRealPath(".");
		setPathFile(id_elemento);
		this.valueLabel = labelPadre;
        this.ordinamento = ordinamento;
	}

	private void setPathFile(String nomeFile){
		this.pXslPath = pXslPath_ini+nomeFile+pXslPath_fin;
		this.pXmlPath = pXmlPath_ini+nomeFile+pXmlPath_fin;
	}
	
	@Override
	public String toHtml() {
		return null;
	}

	@Override
	public String toHtml(String xml) {
		return this.transform();

	}

	private TransformerFactory getTransformerFactory() {
		if (this.tf == null) {
			this.tf = TransformerFactory.newInstance();
		}
		return this.tf;
	}	
	
	protected String transform() {
		String html="";
		FileInputStream xslt = null;
		try {
			xslt = new FileInputStream(new File(this.pPathGlobale+this.pXslPath));
		} catch (FileNotFoundException e1) {
			log.error(e1.getMessage());
		}

		FileInputStream xmlFile = null;
		try {
			xmlFile = new FileInputStream(new File(this.pPathGlobale+this.pXmlPath));
		} catch (FileNotFoundException e1) {
			log.error(e1.getMessage());
		}
		
		StreamSource ss = new StreamSource();

//		Imposto il file alla streamSource, recuperandolo dal db se referto già salvato		
		if (this.xmlreader == null){
			ss.setInputStream(xmlFile);
			}
		else{
			ss.setReader(this.xmlreader);
		}
		
		StreamSource xslSource = null;
		StringWriter writer = null;		
		try {
			writer = new StringWriter();
			xslSource =  new StreamSource();
			xslSource.setInputStream(xslt);
			TransformerFactory tFactory = getTransformerFactory();
			Transformer transformer = tFactory.newTransformer(xslSource);
			transformer.setParameter("NameObjectXml", this.nameOfFieldSet);
			transformer.setParameter("SezioneLabel", this.valueLabel);
			transformer.setParameter("ordinamento", this.ordinamento);
            transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
			transformer.setOutputProperty(OutputKeys.METHOD, "html");
			transformer.transform( 
					ss,
					new StreamResult(writer));
			html = writer.toString();
		} catch( Exception ex ) { 
			log.error(ex.getMessage()); 
		}finally{
//			Chiudo tutto		
			try {
				if (this.xmlreader == null){
					ss.getInputStream().close();
				}else{
					ss.getReader().close();					
				}
			} catch (IOException e) {
				log.error(e.getMessage()); 
			} catch (Exception ex){
				log.error(ex.getMessage());
			}
			
			try {
				xslSource.getInputStream().close();
			} catch (IOException e) {
				log.error(e.getMessage()); 
			} catch (Exception ex){
				log.error(ex.getMessage());
			}
			
			try {
				writer.close();
				xslt.close();
				xmlFile.close();	
			} catch (IOException e) {
				log.error(e.getMessage()); 
			} catch (Exception ex){
				log.error(ex.getMessage());
			}
			
			
		}
		return html;
	}

}