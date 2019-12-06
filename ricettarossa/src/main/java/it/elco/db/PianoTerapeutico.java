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
package it.elco.db;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import it.elco.xml.ModelloTBC;
import it.elco.xml.ModelloTBI;
import it.elco.xml.ModelloTBV;
import it.elco.xml.ModelloTF;

public class PianoTerapeutico {
	
	private Connection conn = null;
	
	public PianoTerapeutico(Connection conn) throws Exception{
		this.conn = conn;
	}
	
	public void inserisciPiano(ModelloTBI tbi, String stringAzienza) throws Exception{
		List<ModelloTF> modelliTF = new ArrayList<ModelloTF>();
		modelliTF = tbi.getModelloTF();
		HashMap<String, String> datiPiano = new HashMap<String, String>();
		
		/*Gestione Paziente*/
		Tabella anag = new Tabella(conn);
		anag.setQuery("select * from anag a, cod_est_anag cea where a.iden = cea.iden_anag and a.cod_fisc = ?");
		anag.setDato(1, tbi.getCodiceFiscaleAssistito());
		anag.eseguiQuery();
		
		if(!anag.result.next()){
			throw new Exception("Paziente non trovato.");
		}
				
		/*Gestione Prescrittore*/
		Tabella tabPer = new Tabella(conn);
		tabPer.setQuery("select * from tab_per where cod_fisc = ?");
		tabPer.setDato(1, tbi.getCodiceFiscalePrescrittore());
		tabPer.eseguiQuery();
		
		String idenMed = "";
		if(!tabPer.result.next()){
			idenMed = gestisciMedicoPrescrittore(tbi);
		}else{
			idenMed = tabPer.result.getString("IDEN");
		}
		if(idenMed.equals("")){
			throw new Exception("Errore durante l'inserimento del medico prescrittore.");
		}
		
		/*Gestione dettaglio*/
		String unita = "";
		String terapia = "";
		String descrTerapia = "";
		String litri = "";
		String ore = "";
		String durata = "";
		String indicazioneLig = "";
		String periodoSomm = "";
		for(int i = 0; i < modelliTF.size(); i++){
			Tabella terapie = new Tabella(conn);
			Tabella farmaci = new Tabella(conn);
			ModelloTF tf = modelliTF.get(i);
			
			terapie.setQuery("select * from pt_terapie where codice_terapia = ?");
			terapie.setDato(1, tf.getCodiceTerapia());
			terapie.eseguiQuery();
			
			if(terapie.result.next()){
				farmaci.setQuery("select * from pt_farmaci where minsan10 = ?");
				farmaci.setDato(1, terapie.result.getString("CODICE_FARMACO"));
				farmaci.eseguiQuery();
				
				if(farmaci.result.next()){
					/*Gestione Dettaglio*/
					periodoSomm += tf.getPeriodoSomministrazione()+"@";
					unita += tf.getUnita()+"@";
					terapia += terapie.result.getString("CODICE_TERAPIA")+"@";
					descrTerapia += farmaci.result.getString("DESCR")+"@";
					litri +=tf.getNumeroLitri()!=null ? tf.getNumeroLitri().toString()+"@":"@";
					ore += tf.getNumeroOre()!=null ? tf.getNumeroOre().toString()+"@" : "@";
					durata += String.valueOf(tf.getDurataTrattamento())+"@";
					indicazioneLig += terapie.result.getString("INDICAZIONE_LIG")+"@";
				}
			}
			terapie.closeStatement();
			farmaci.closeStatement();
		}

		/*Riempio campi testata*/
		datiPiano.put("DATA_ATTIVAZIONE", toPattern(tbi.getDataPiano(),"dd/MM/yyyy"));
		datiPiano.put("DATA_SCADENZA", toPattern(tbi.getDataScadenzaPiano(),"dd/MM/yyyy"));
		datiPiano.put("ANAG_IDEN", anag.result.getString("IDEN"));
		datiPiano.put("MED_IDEN", tabPer.result.getString("IDEN"));
		datiPiano.put("ID_REMOTO", gestisciCaratteriSpeciali(anag.result.getString("ID1")));
		datiPiano.put("MED_NOME", gestisciCaratteriSpeciali(tbi.getNomePrescrittore()));
		datiPiano.put("MED_COGN", gestisciCaratteriSpeciali(tbi.getCognomePrescrittore()));
		datiPiano.put("MED_COD_FISC", tbi.getCodiceFiscalePrescrittore());
		String protocolloSal = "";
		for (int k=0;k<tbi.getDatoAggiuntivo().size();k++){
			if (tbi.getDatoAggiuntivo().get(k).getName()!=null &&
					tbi.getDatoAggiuntivo().get(k).getName().equals("ProtSAL")){
				protocolloSal=tbi.getDatoAggiuntivo().get(k).getValue();
			}
		}
		
		/*Riempio campi dettaglio*/
		String[] temp = unita.trim().split("@");
		String unitaOk = "";
		for(int k = 0; k < temp.length; k++){
			unitaOk += String.valueOf(Float.valueOf(temp[k].trim().replaceAll("@", "")).intValue())+"@";
		}
		datiPiano.put("UNITA", gestisciCaratteriSpeciali(unitaOk));
		datiPiano.put("TERAPIA", gestisciCaratteriSpeciali(terapia));
		datiPiano.put("DESCR_TERAPIA", gestisciCaratteriSpeciali(descrTerapia));
		datiPiano.put("LITRI", gestisciCaratteriSpeciali(litri));
		datiPiano.put("ORE", gestisciCaratteriSpeciali(ore));
		datiPiano.put("DURATA", gestisciCaratteriSpeciali(durata));
		datiPiano.put("INDICAZIONE_LIG", gestisciCaratteriSpeciali(indicazioneLig));
		datiPiano.put("PERIODO_SOM", gestisciCaratteriSpeciali(periodoSomm));
				
		int idenTestata = callFunction(datiPiano);
		if(idenTestata > 0){
			Tabella update = new Tabella(conn);
			update.setQuery("update pt_testata set iden_remote = ?,protocollo_sal=coalesce(protocollo_sal,?),azienda=? where iden = ?");
			update.setDato(1, tbi.getIdentificativoPiano());
			update.setDato(2, protocolloSal);
			update.setDato(3, stringAzienza);
			update.setDato(4, idenTestata);
			update.eseguiUpdate();
			update.closeStatement();
		}else{
			throw new Exception("Iden testata non ritornato dalla funzione.");
		}
		
		anag.closeStatement();
		tabPer.closeStatement();
	}
	
	public void modificaPiano(ModelloTBV tbv) throws Exception{
		
	}
	
	public void cancelloPiano(ModelloTBC tbc) throws Exception{
		
	}
	
	private String gestisciCaratteriSpeciali(String input){
		input = input.replaceAll("&", "&amp;");
		input = input.replaceAll("<", "&lt;");
		input = input.replaceAll(">", "&gt;");
		input = input.replaceAll("\"","&quot;");
		input = input.replaceAll("'", "&apos;");
		return input;
	}
	
	private String gestisciMedicoPrescrittore(ModelloTBI tbi) throws Exception{
		
		Tabella tabPer = new Tabella(conn);
		Tabella dual = new Tabella(conn);
		
		try{
			String nome = tbi.getNomePrescrittore();
			String cognome = tbi.getCognomePrescrittore();
			String codFisc = tbi.getCodiceFiscalePrescrittore();
			String codRegioneStruttura = tbi.getCodRegioneStrutturaPrescrittore();
			String telefono = tbi.getTelefonoPrescrittore();
			
			if(nome == null){
				nome = "";
			}
			if(cognome == null){
				cognome = "";
			}
			if(codFisc == null){
				codFisc = "";
			}
			if(codRegioneStruttura == null){
				codRegioneStruttura = "";
			}
			if(telefono == null){
				telefono = "";
			}
			
			tabPer.setQuery("insert into tab_per (nome, cognome, titolo, cod_fisc, telefono, cod_regionale, attivo,KEY_PREGRESSO) values (?,?,?,?,?,?,?,?)");
			tabPer.setDato(1, nome);
			tabPer.setDato(2, cognome);
			tabPer.setDato(3, "DOTT.");
			tabPer.setDato(4, codFisc);
			tabPer.setDato(5, telefono);
			tabPer.setDato(6, codRegioneStruttura);
			tabPer.setDato(7, "N");
			tabPer.setDato(8, "REM_SEARCH_PT");
			
			tabPer.eseguiUpdate();
			
			dual.setQuery("select seq_tab_per.currval as IDEN from dual");
			dual.eseguiQuery();
			if(dual.result.next()){
				return dual.result.getString("IDEN");
			}else{
				return "";
			}
		}finally{
			tabPer.closeStatement();
			dual.closeStatement();
		}
	}
	
	private int callFunction(HashMap<String, String> dati) throws Exception{
		CallableStatement clStat = null;
		
    	clStat = conn.prepareCall("{? = call radsql_bck.insert_pt_xml(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}");
		
    	/*Ritorna l'IDEN di TESTATA*/
    	clStat.registerOutParameter(1, Types.NUMERIC);
    	
		clStat.setString(2, dati.get("ANAG_IDEN"));
		clStat.setString(3, dati.get("ID_REMOTO"));
		clStat.setString(4, dati.get("MED_IDEN"));
		clStat.setString(5, dati.get("MED_NOME"));
		clStat.setString(6, dati.get("MED_COGN"));
		clStat.setString(7, dati.get("MED_COD_FISC"));
		clStat.setString(8, dati.get("DATA_ATTIVAZIONE"));
		clStat.setString(9, dati.get("DATA_SCADENZA"));
		clStat.setString(10, dati.get("TERAPIA").substring(0, dati.get("TERAPIA").length()-1));
		clStat.setString(11, dati.get("DESCR_TERAPIA").substring(0, dati.get("DESCR_TERAPIA").length()-1));
		clStat.setString(12, dati.get("INDICAZIONE_LIG").substring(0, dati.get("INDICAZIONE_LIG").length()-1));
		clStat.setString(13, dati.get("LITRI").substring(0, dati.get("LITRI").length()-1));
		clStat.setString(14, dati.get("ORE").substring(0, dati.get("ORE").length()-1));
		clStat.setString(15, dati.get("PERIODO_SOM").substring(0, dati.get("PERIODO_SOM").length()-1));
		clStat.setString(16, dati.get("UNITA").substring(0, dati.get("UNITA").length()-1));
		clStat.setString(17, dati.get("DURATA").substring(0, dati.get("DURATA").length()-1));
		clStat.setString(18, null);//diagnosi nulla
		
		Set<String> keys = dati.keySet();
	    Iterator<String> iter = keys.iterator();
	    String key;
	    String value;
	    while (iter.hasNext()) {
	    	key = iter.next();
	    	value = dati.get(key);
	    	System.out.println(key+" = "+value);
	    }
	    
	    clStat.execute();
	    return clStat.getInt(1);
	}
	
	private static String toPattern(String data, String pattern) throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'+01:00'" );
        TimeZone tz = TimeZone.getTimeZone( "UTC" );
        df.setTimeZone( tz );
        SimpleDateFormat formatter = new SimpleDateFormat(pattern);
		Date date = df.parse(data);
        return formatter.format(date);
    }

}
