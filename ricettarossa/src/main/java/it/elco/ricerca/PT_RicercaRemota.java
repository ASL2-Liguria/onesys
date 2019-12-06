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
package it.elco.ricerca;

import it.elco.IniReader;
import it.elco.db.PianoTerapeutico;
import it.elco.db.Tabella;
import it.elco.xml.ModelloTBC;
import it.elco.xml.ModelloTBI;
import it.elco.xml.ModelloTBV;
import it.ws.attachment.ReturnFromSALServiceStub;
import it.ws.attachment.ReturnFromSALServiceStub.MetadatiType;
import it.ws.attachment.ReturnFromSALServiceStub.Richiesta;
import it.ws.attachment.ReturnFromSALServiceStub.RichiestaSAL;
import it.ws.attachment.ReturnFromSALServiceStub.Risposta;
import it.ws.attachment.ReturnFromSALServiceStub.RispostaSAL;
import it.ws.attachment.ReturnFromSALServiceStub.TipoStringa16;
import it.ws.attachment.ReturnFromSALServiceStub.TipoStringa255;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.activation.DataHandler;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;

import org.apache.axis2.Constants;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.transport.http.HTTPConstants;
import org.apache.axis2.transport.http.HttpTransportProperties.Authenticator;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import sun.misc.BASE64Encoder;

import CifraRSA.RSAtools;

public class PT_RicercaRemota {
	
	public Connection connessione;
	public static IniReader ini = null;
	
	public String userSession = null;
	private String certificato = null;
	private String pincode = null;
	private static String pincodeCifrato = "";
	private String fs = System.getProperty("file.separator");
	int timeout=60;
	
	public PT_RicercaRemota(){
		
	}
	
	public void inizializza() throws Exception{
		ini = new IniReader("integrazione.ini");
		certificato = ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "CERTIFICATO");
		pincode = ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "PINCODE");
		try {
			timeout = Integer.parseInt(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "TIMEOUT"));

		} catch (Exception e) {
			timeout=60;
		}
	}
	
	public void setConnections(Connection dbConn) throws Exception {
		try{
			this.connessione = dbConn;
			inizializza();
			System.out.println("Richiamato: setConnections - " + dbConn.toString());
		}catch(Exception e){
			e.printStackTrace();
			throw new Exception(e);
		}			
	}
	
	public void setUserSession(String userSession) throws Exception{
		this.userSession = userSession;
	}
	
	public void RimuoviDati() throws Exception {
		System.out.println("Richiamato: RimuoviDati");
		Tabella tabMetadati = new Tabella(connessione, 10);
		tabMetadati.setQuery("DELETE FROM PT_REMOTE_METADATI WHERE REMOTE_USER = ? " + 
		"OR DATA_INS < (SYSDATE + NUMTODSINTERVAL (-1, 'DAY'))");
		tabMetadati.setDato(1, userSession);
		tabMetadati.eseguiUpdate();
		tabMetadati.closeStatement();
		//try{svuotaCartella(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "CARTELLA_FILE"));}catch(Exception e){}
	}
	
	private static void svuotaCartella(String cartella) throws Exception{
		File directory = new File(cartella); 
		String[] list = directory.list();
		File file;
		for (int j = 0; j < list.length; j++) {
		      file = new File(cartella, list[j]);
		      if(file.getName().toLowerCase().endsWith(".xml") || file.getName().toLowerCase().endsWith(".zip")){
		    	  file.delete();
		      }
		}
	}
	
	public String ricercaPerCodFiscAss(String codiceFiscaleAssistito) throws Exception{
		System.out.println("Richiamata ricerca per codice fiscale assistito.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("PAZ_COD_FISC", codiceFiscaleAssistito);
		return eseguiRicerca(datiRicerca);
	}
	
	public String ricercaPerCodFiscAssData(String codiceFiscaleAssistito,String dataDA,String dataA) throws Exception{
		System.out.println("Richiamata ricerca per codice fiscale assistito.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("PAZ_COD_FISC", codiceFiscaleAssistito);
		datiRicerca.put("DATA_DA", dataDA);
		datiRicerca.put("DATA_A", dataA);
		return eseguiRicerca(datiRicerca);
	}
	
	public String ricercaPerCodFiscPrescr(String codiceFiscalePrescr) throws Exception{
		System.out.println("Richiamata ricerca per codice fiscale prescrittore.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("PRESCR_COD_FISC", codiceFiscalePrescr);
		return eseguiRicerca(datiRicerca);
	}

	public String ricercaPerNomCogn(String nome, String cognome) throws Exception{
		System.out.println("Richiamata ricerca nome e cognome.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("PAZ_NOME", nome);
		datiRicerca.put("PAZ_COGNOME", cognome);
		return eseguiRicerca(datiRicerca);
	}
	
	public String ricercaPerNumSAL(String numSAL) throws Exception{
		System.out.println("Richiamata ricerca per numero SAL.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("IDEN_SAL", numSAL);
		return eseguiRicerca(datiRicerca);
	}

	public String ricercaPerIdPT(String idenPT) throws Exception{
		System.out.println("Richiamata ricerca per identificativo PT.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("IDEN_PT", idenPT);
		return eseguiRicerca(datiRicerca);
	}
	
	public String ricercaPerData(String dataDA, String dataA) throws Exception{
		System.out.println("Richiamata ricerca per identificativo PT.");
		HashMap<String, String> datiRicerca = new HashMap<String, String>();
		datiRicerca.put("DATA_DA", dataDA);
		datiRicerca.put("DATA_A", dataA);
		return eseguiRicerca(datiRicerca);
	}
	
	public String eseguiRicerca(HashMap<String, String> datiRicerca) throws Exception{
		if(pincodeCifrato.equals("")){
			try{
				RSAtools rsa = new RSAtools();
				byte[] testocifrato[] = new byte[1][1];
				BASE64Encoder encoder = new BASE64Encoder();
				rsa.Cifra_cf2(this.pincode, testocifrato, this.certificato);
				pincodeCifrato = encoder.encodeBuffer(testocifrato[0]);
			}catch(Throwable e1){
				e1.printStackTrace();
			}
		}
		
		/*Creo oggetti necessari*/
		Richiesta rich = new Richiesta();
		RichiestaSAL richSAL = new RichiestaSAL();
		Options opzioni = new Options();
		Authenticator authenticator = new Authenticator();
		
		/*Setto i dati di ricerca*/
		TipoStringa255 pincode = new TipoStringa255();
		pincode.setTipoStringa255(pincodeCifrato);
		richSAL.setPincodeSAL(pincode);
		
		TipoStringa255 tipoFlusso = new TipoStringa255();
		tipoFlusso.setTipoStringa255("IPT");
		richSAL.setTipoFlusso(tipoFlusso);
		
		TipoStringa255 protocolloSAL = new TipoStringa255();
		if(datiRicerca.get("IDEN_SAL") != null){
			System.out.println("Iden SAL: "+datiRicerca.get("IDEN_SAL"));
			protocolloSAL.setTipoStringa255(datiRicerca.get("IDEN_SAL"));
			richSAL.setProtocolloSAL(protocolloSAL);
		}
		
		TipoStringa16 cfAssistito = new TipoStringa16();
		if(datiRicerca.get("PAZ_COD_FISC") != null){
			System.out.println("Codice fiscale paziente: "+datiRicerca.get("PAZ_COD_FISC"));
			cfAssistito.setTipoStringa16(datiRicerca.get("PAZ_COD_FISC"));
			richSAL.setCfAssistito(cfAssistito);
		}
		
		TipoStringa16 cfPrescrittore = new TipoStringa16();
		if(datiRicerca.get("PRESCR_COD_FISC") != null){
			System.out.println("Codice fiscale prescrittore: "+datiRicerca.get("PRESCR_COD_FISC"));
			cfPrescrittore.setTipoStringa16(datiRicerca.get("PRESCR_COD_FISC"));
			richSAL.setCfPrescrittore(cfPrescrittore);
		}
		
		TipoStringa255 cognomeAssistito = new TipoStringa255();
		if(datiRicerca.get("PAZ_COGNOME") != null){
			System.out.println("Cognome paziente: "+datiRicerca.get("PAZ_COGNOME"));
			cognomeAssistito.setTipoStringa255(datiRicerca.get("PAZ_COGNOME"));
			richSAL.setCognomeAssistito(cognomeAssistito);
		}
		
		TipoStringa255 nomeAssistito = new TipoStringa255();
		if(datiRicerca.get("PAZ_NOME") != null){
			System.out.println("Nome paziente: "+datiRicerca.get("PAZ_NOME"));
			nomeAssistito.setTipoStringa255(datiRicerca.get("PAZ_NOME"));
			richSAL.setNomeAssistito(nomeAssistito);
		}
		
		TipoStringa255 idenPT = new TipoStringa255();
		TipoStringa255 tiponumerazione = new TipoStringa255();
		if(datiRicerca.get("IDEN_PT") != null){
			System.out.println("Iden piano terapeutico: "+datiRicerca.get("IDEN_PT"));
			idenPT.setTipoStringa255(datiRicerca.get("IDEN_PT"));
			tiponumerazione.setTipoStringa255("PSP");
			richSAL.setNumeroIdentificativo(idenPT);
			richSAL.setTipoNumerazione(tiponumerazione);
		}
		
		TipoStringa255 dataDA = new TipoStringa255();
		if(datiRicerca.get("DATA_DA") != null){
			System.out.println("Da data: "+datiRicerca.get("DATA_DA"));
			dataDA.setTipoStringa255(datiRicerca.get("DATA_DA"));
			richSAL.setDataCompilazioneDa(dataDA);
		}
		
		TipoStringa255 dataA = new TipoStringa255();
		if(datiRicerca.get("DATA_A") != null){
			System.out.println("A data: "+datiRicerca.get("DATA_A"));
			dataA.setTipoStringa255(datiRicerca.get("DATA_A"));
			richSAL.setDataCompilazioneA(dataA);
		}
				
		/*Gestione autenticazione*/
        List<String> auth = new ArrayList<String>();
        auth.add(Authenticator.BASIC);
        authenticator.setAuthSchemes(auth);
        authenticator.setUsername(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "USERNAME"));
        authenticator.setPassword(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "PASSWORD"));
        opzioni.setProperty(Constants.Configuration.ENABLE_MTOM, Constants.VALUE_TRUE);
        opzioni.setProperty(HTTPConstants.AUTHENTICATE, authenticator);
        opzioni.setTo(new EndpointReference(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "URL")));
		
        /*Chiamata servizio*/
        ReturnFromSALServiceStub proxy = new ReturnFromSALServiceStub(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "URL"));
        opzioni.setTimeOutInMilliSeconds(timeout*1000);
        proxy._getServiceClient().setOptions(opzioni);
		rich.setRichiesta(richSAL);
		Risposta risp = proxy.getFileFromSAL(rich, this.userSession);
		RispostaSAL rispSAL = risp.getRisposta();
		
		
		if(rispSAL.getParametriInvioFile().getCodEsito().getTipoStringa255().equals("000") ||
				rispSAL.getParametriInvioFile().getCodEsito().getTipoStringa255().equals("010")	){
			
			RimuoviDati();
			rispSAL.getMetadati();
			System.out.println("Ricerca avvenuta con successo, controllo i risultati.");
			System.out.println(rispSAL.getParametriInvioFile().getCodEsito());
			System.out.println(rispSAL.getParametriInvioFile().getDescEsito());
			System.out.println(rispSAL.getParametriInvioFile().getNomeFileAllegato());
			MetadatiType[] metaTemp = rispSAL.getMetadati();
			
			if(metaTemp == null){
				/*Nessun risultato per la ricerca*/
				System.out.println("Nessun risultato.");
				return "-1";
			}else{
				Statement stm = connessione.createStatement();
				HashMap hmTest = new HashMap(); 
				try{
					for(int k = 0; k < metaTemp.length; k++){
						
						String insert = "insert into pt_remote_metadati (";
						
						String campi = "";
						String valori = "";
						
						if(metaTemp[k].getAziendaInviante() != null){
							campi += "AZIENDA_INVIANTE,";
							valori += "'"+metaTemp[k].getAziendaInviante()+"',";
						}
						if(metaTemp[k].getCfAssistito() != null){
							campi += "CF_ASSISTITO,";
							valori += "'"+metaTemp[k].getCfAssistito()+"',";
						}
						if(metaTemp[k].getCfInviante() != null){
							campi += "CF_INVIANTE,";
							valori += "'"+metaTemp[k].getCfInviante()+"',";
						}
						if(metaTemp[k].getCfPrescrittore() != null){
							campi += "CF_PRESCRITTORE,";
							valori += "'"+metaTemp[k].getCfPrescrittore()+"',";
						}
						if(metaTemp[k].getCognomeInviante() != null){
							campi += "COGNOME_INVIANTE,";
							valori += "'"+metaTemp[k].getCognomeInviante()+"',";
						}
						if(metaTemp[k].getDataAccoglienzaDestFinale() != null){
							campi += "DATA_ACCOGLIENZA_DEST_FINALE,";
							String data = formattaData(metaTemp[k].getDataAccoglienzaDestFinale().getTime(),"yyyyMMddhhmmss");
							valori += "'"+data+"',";
						}
						if(metaTemp[k].getDataCompilazione() != null){
							campi += "DATA_COMPILAZIONE,";
							String data = formattaData(metaTemp[k].getDataCompilazione().getTime(),"yyyyMMddhhmmss");
							valori += "'"+data+"',";
						}
						if(metaTemp[k].getDataInvio() != null){
							campi += "DATA_INVIO,";
							String data = formattaData(metaTemp[k].getDataInvio().getTime(),"yyyyMMddhhmmss");
							valori += "'"+data+"',";
						}
						if(metaTemp[k].getDataRicezione() != null){
							campi += "DATA_RICEZIONE,";
							String data = formattaData(metaTemp[k].getDataRicezione().getTime(),"yyyyMMddhhmmss");
							valori += "'"+data+"',";
						}
						if(metaTemp[k].getFlgInviatoDestFinale() != null){
							campi += "FLG_INVIATO_DEST_FINALE,";
							valori += "'"+metaTemp[k].getFlgInviatoDestFinale()+"',";
						}
						if(metaTemp[k].getNomeFileDettaglio() != null){
							campi += "NOME_FILE_DETTAGLIO,";
							valori += "'"+metaTemp[k].getNomeFileDettaglio()+"',";
						}
						if(metaTemp[k].getNomeFileInvioDestFinale() != null){
							campi += "NUM_FILE_INVIO_DEST_FINALE,";
							valori += "'"+metaTemp[k].getNomeFileInvioDestFinale()+"',";
						}
						if(metaTemp[k].getNomeFileRicevuto() != null){
							campi += "NOME_FILE_RICEVUTO,";
							valori += "'"+metaTemp[k].getNomeFileRicevuto()+"',";
						}
						if(metaTemp[k].getNomeInviante() != null){
							campi += "NOME_INVIANTE,";
							valori += "'"+metaTemp[k].getNomeInviante()+"',";
						}
						if(metaTemp[k].getNumeroPsp() != null){
							campi += "NUMERO_PSP,";
							valori += "'"+metaTemp[k].getNumeroPsp()+"',";
							hmTest.put(metaTemp[k].getNumeroPsp(),metaTemp[k].getAziendaInviante() );
						}
						if(metaTemp[k].getNumeroRel() != null){
							campi += "NUMERO_REL,";
							valori += "'"+metaTemp[k].getNumeroRel()+"',";
						}
						if(metaTemp[k].getNumeroRps() != null){
							campi += "NUMERO_RPS,";
							valori += "'"+metaTemp[k].getNumeroRps()+"',";
						}
						if(metaTemp[k].getNumFilesDettaglioRicevuti() != null){
							campi += "NUM_FILES_DETTAGLIO_RICEVUTI,";
							valori += "'"+metaTemp[k].getNumFilesDettaglioRicevuti()+"',";
						}
						if(metaTemp[k].getNumFilesInvDestFinale() != null){
							campi += "NUM_FILES_INV_DEST_FINALE,";
							valori += "'"+metaTemp[k].getNumFilesInvDestFinale()+"',";
						}
						if(metaTemp[k].getOperazioneIcv() != null){
							campi += "OPERAZIONE_ICV,";
							valori += "'"+metaTemp[k].getOperazioneIcv()+"',";
						}
						if(metaTemp[k].getProtocolloDestFinale() != null){
							campi += "PROTOCOLLO_DEST_FINALE,";
							valori += "'"+metaTemp[k].getProtocolloDestFinale()+"',";
						}
						if(metaTemp[k].getProtocolloSAL() != null){
							campi += "PROTOCOLLO_SAL,";
							valori += "'"+metaTemp[k].getProtocolloSAL()+"',";
						}
						if(metaTemp[k].getTipoFlusso() != null){
							campi += "TIPO_FLUSSO,";
							valori += "'"+metaTemp[k].getTipoFlusso()+"',";
						}
						if(metaTemp[k].getTipoNumerazione() != null){
							campi += "TIPO_NUMERAZIONE,";
							valori += "'"+metaTemp[k].getTipoNumerazione()+"',";
						}
						if(metaTemp[k].getTipoPrescrizione() != null){
							campi += "TIPO_PRESCRIZIONE,";
							valori += "'"+metaTemp[k].getTipoPrescrizione()+"',";
						}
						
						campi += "REMOTE_USER,";
						valori += "'"+this.userSession+"',";
						
						campi = campi.substring(0, campi.length()-1);
						campi += ") values (";
						valori = valori.substring(0, valori.length()-1)+")";
						insert += campi + valori;
						if(metaTemp[k].getOperazioneIcv()!=null && metaTemp[k].getOperazioneIcv().equals("I"))
						{stm.execute(insert);}
					}
					connessione.commit();
					File zip = new File(ini.readParameter(ini.readParameter("INTEGRAZIONE", "MODULO_DATI"), "CARTELLA_FILE")+this.userSession+".zip");
					
					if(!zip.exists() || rispSAL.getParametriInvioFile().getCodEsito().getTipoStringa255().equals("010")){
						/*Non ci sono allegati, la ricerca e' andata a buon fine ma ci sono troppi valori*/
						System.out.println("Nessun allegato restituito, troppi valori, affinare la ricerca.");
						return "0";
					}else{
						int BUFFER = 1024;
						BufferedOutputStream dest = null;
						FileInputStream fis = new FileInputStream(zip.getAbsolutePath());
				        ZipInputStream zis = new ZipInputStream(new BufferedInputStream(fis));
				        ZipEntry entry;
				        String nomeXML = "";
						while((entry = zis.getNextEntry()) != null) {
							int count;
							byte data[] = new byte[BUFFER];
							FileOutputStream fos = new FileOutputStream(zip.getParent()+fs+entry.getName());
							nomeXML = entry.getName();
						   	dest = new BufferedOutputStream(fos, BUFFER);
						    while ((count = zis.read(data, 0, BUFFER)) != -1) {
						       dest.write(data, 0, count);
						    }
						    dest.flush();
						    dest.close();
				         }
				         zis.close();
				         fis.close();
				         return elaboraXML(new File(zip.getParent()+fs+nomeXML),hmTest);
					}

				}catch(Exception e){
					e.printStackTrace();
					System.out.println("Errore durante il trattamento del risultato: "+e.getMessage());
				}
				finally{
					//try{this.RimuoviDati();}catch(Exception e){}
					try{
						stm.close();}catch(Exception e){}
				}
			}
		}else{
			System.out.println("Errore durante la ricerca.");
			System.out.println(rispSAL.getParametriInvioFile().getCodEsito());
			System.out.println(rispSAL.getParametriInvioFile().getDescEsito());
			System.out.println(rispSAL.getParametriInvioFile().getNomeFileAllegato());
		}
		
		return "-1";
	}
	
	public String elaboraXML(File xml, HashMap hmassocIDremAzienda) throws Exception{
		String result = "";
		JAXBContext jc=null;
		try{
		 jc = JAXBContext.newInstance("it.elco.xml");
		}
		catch(Throwable e){
		e.printStackTrace();	
		}
		
		/*Prendo solo l'ultimo evento per ogni Piano*/
		XPathFactory xPathFactory = XPathFactory.newInstance();
		XPath xPath = xPathFactory.newXPath();
		Document xmlDocument;
		xmlDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(xml); 
		
		String expression = "/PianiTerapeutici/child::node()[child::IdentificativoPiano]/IdentificativoPiano";
		XPathExpression xExpression = xPath.compile(expression);
		Object xmlResult = xExpression.evaluate(xmlDocument,XPathConstants.NODESET);
		
		HashMap<String, Object> idensPT = new HashMap<String, Object>();
		
		NodeList nodes = (NodeList) xmlResult;
		for (int i = 0; i < nodes.getLength(); i++) {
			String idenPT = nodes.item(i).getFirstChild().getNodeValue();
			if(!idensPT.containsKey(idenPT)){
				idensPT.put(idenPT, getLastModello(idenPT, xml, jc));
			}
		}
		
		/*Elaboro l'ultimo evento di ogni piano*/
		Tabella testata = new Tabella(connessione);
		testata.setQuery("select iden from pt_testata where iden_remote = ?");
		Set<String> keys = idensPT.keySet();
	    Iterator<String> iter = keys.iterator();
	    String key;
	    Object value;
	    while (iter.hasNext()) {
	    	key = iter.next();
	    	value = idensPT.get(key);
	    	if(value.getClass().equals(ModelloTBI.class)){
	    		ModelloTBI tbi = (ModelloTBI)value;
	    		testata.setDato(1, tbi.getIdentificativoPiano());
	    		testata.eseguiQuery();
	    		
	    		if(!testata.result.next()){
	    			PianoTerapeutico piano = new PianoTerapeutico(this.connessione);
		    		piano.inserisciPiano(tbi,(String)hmassocIDremAzienda.get(tbi.getIdentificativoPiano()));
		    		System.out.println("Piano Terapeutico inserito correttamente");
		    	}else{
		    		System.out.println("Piano già esistente.");
		    	}
	    		
	    		result += tbi.getIdentificativoPiano()+"','";	
	    	}else if(value.getClass().equals(ModelloTBV.class)){
	    		ModelloTBV tbv = (ModelloTBV)value;
	    		testata.setDato(1, tbv.getIdentificativoPiano());
	    		testata.eseguiQuery();
	    		
	    		if(!testata.result.next()){
	    			PianoTerapeutico piano = new PianoTerapeutico(this.connessione);
		    		piano.modificaPiano(tbv);
		    		System.out.println("Piano Terapeutico modificato correttamente");
	    		}else{
		    		System.out.println("Piano già esistente.");
		    	}
	    		
	    		result +=tbv.getIdentificativoPiano()+"','";
	    	}else if(value.getClass().equals(ModelloTBC.class)){
	    		ModelloTBC tbc = (ModelloTBC)value;
	    		testata.setDato(1, tbc.getIdentificativoPiano());
	    		testata.eseguiQuery();
	    		
	    		if(testata.result.next()){
		    		PianoTerapeutico piano = new PianoTerapeutico(this.connessione);
		    		piano.cancelloPiano(tbc);
		    		System.out.println("Piano Terapeutico cancellato correttamente");
	    		}else{
		    		System.out.println("Piano non esistente.");
		    	}
	    		
	    		result += tbc.getIdentificativoPiano()+"','";
	    	}
	    }
	    testata.closeStatement();
		
	    result = "'"+result.substring(0,result.length()-2);
	    
		return result;
	}
	
	private Object getLastModello(String identificativoPiano, File xml, JAXBContext jc) throws Exception{
		/*Prendo solo l'ultimo evento per ogni Piano*/
		XPathFactory xPathFactory = XPathFactory.newInstance();
		XPath xPath = xPathFactory.newXPath();
		Document xmlDocument;
		xmlDocument = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(xml); 
		
		Object result = null;
		
		String expression = "/PianiTerapeutici/child::node()[IdentificativoPiano='"+identificativoPiano+"'][last()]";
		XPathExpression xExpression = xPath.compile(expression);
		result = xExpression.evaluate(xmlDocument,XPathConstants.NODESET);
		NodeList finalRes = (NodeList) result;
		Object modello = null;
		
		for(int i = 0; i < finalRes.getLength(); i++){
			Node temp = finalRes.item(i);
			Unmarshaller m = jc.createUnmarshaller();
			modello = m.unmarshal(temp);
		}
		
		return modello;
	}
	
	public static String GetDate(String strformat) {
	    Calendar cal = Calendar.getInstance();
	    SimpleDateFormat sdf = new SimpleDateFormat(strformat);
	    return sdf.format(cal.getTime());
	}
	
	public static String formattaData(Date data, String pattern){
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(data);
	}
	
	public static byte[] toBytes(DataHandler dh) throws Exception {
	    ByteArrayOutputStream bos = new ByteArrayOutputStream(1024);
	    InputStream in = dh.getInputStream();
	    byte[] buffer = new byte[1024];
	    int bytesRead;
	    while ( (bytesRead = in.read(buffer)) >= 0 ) {
	        bos.write(buffer, 0, bytesRead);
	    }
	    return bos.toByteArray();
	}

	
}
