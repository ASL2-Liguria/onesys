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
package cartellaclinica.beans;

import generic.statements.StatementFromFile;

import java.sql.ResultSet;
import java.util.Hashtable;

import javax.servlet.http.HttpSession;

public class ParametroType implements java.io.Serializable {
	
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 26412451990068576L;
	private String descrizione;
	private String decodifica;
	private String separatore;
	private String codice;
	private String nrilevazioni;
	private int valore_minimo;
	private int valore_massimo;
	private String campiAgg;
	
	public ParametroType() {}
	
	public String getDescrizione() {
		return descrizione;
	}
	
	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}
	
	public String getDecodifica() {
		return decodifica;
	}
	
	public void setDecodifica(String decodifica) {
		this.decodifica = decodifica;
	}
	
	public String getSeparatore() {
		return separatore;
	}
	
	public void setSeparatore(String separatore) {
		this.separatore = separatore;
	}

	public String getCodice() {
		return codice;
	}
	
	public void setCodice(String codice) {
		this.codice = codice;
	}
	
	public int getValoreMinimo(){
		return valore_minimo;	
	}
	
	public void setValoreMinimo(int vmin){
		valore_minimo=vmin;
	}
	
	public int getValoreMassimo(){
		return valore_massimo;
	}
	public void setValoreMassimo(int vmax){
		valore_massimo=vmax;
	}
	public String getNRilevazioni() {
		return nrilevazioni;
	}
	
	public void setNRilevazioni(String vril){
		nrilevazioni=vril;
	}
	public String getCampiAggiuntivi() {
		return campiAgg;
	}
	
	public void setCampiAggiuntivi(String vconf){
		campiAgg=vconf;
	}
	
	@SuppressWarnings("unchecked")
	public static ParametroType getParametroType(int idenParametro, HttpSession pSession) throws Exception{

		Object parametri = pSession.getAttribute("PianoGiornaliero.Parametri");
		if (parametri == null) {
			StatementFromFile sff = new StatementFromFile(pSession);
			ResultSet rs = sff.executeQuery("pianoGiornaliero.xml", "getParametriType",new String[0]);
			Hashtable<Integer, ParametroType> htParametriType = new Hashtable<Integer, ParametroType>();
			while(rs.next()) {
				ParametroType pt = new ParametroType();
				pt.setDescrizione(rs.getString("DESCRIZIONE"));
				pt.setDecodifica(rs.getString("DECODIFICA"));
				pt.setSeparatore(rs.getString("SEPARATORE"));
				pt.setCodice(rs.getString("COD_DEC"));
				pt.setValoreMinimo(rs.getInt("VALORE_MINIMO"));
				pt.setValoreMassimo(rs.getInt("VALORE_MASSIMO"));
				pt.setNRilevazioni(rs.getString("NRILEVAZIONI"));
				pt.setCampiAggiuntivi(rs.getString("CAMPI_AGGIUNTIVI"));
				htParametriType.put(rs.getInt("IDEN"), pt);
			}
			pSession.setAttribute("PianoGiornaliero.Parametri",htParametriType);
			parametri = htParametriType; 
			rs.close();
			sff.close();
		}
		ParametroType parametro = ((Hashtable<Integer, ParametroType>)parametri).get(idenParametro);
		return parametro;
	}
}
