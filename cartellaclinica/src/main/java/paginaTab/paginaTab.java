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
/*

    Autore: Dario
 */

package paginaTab;

import generic.servletEngine;
import imago.http.classIFrameHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import oracle.jdbc.OraclePreparedStatement;
import cartellaclinica.cartellaPaziente.cDatiCartellaPaziente;
import cartellaclinica.lettera.pckInfo.ILetteraInfo;

public class paginaTab extends servletEngine {
	private Connection connD;

	private Connection connW;

//	private functionDB fDB = null;

	private String reparto = new String("");

	private String idenVisita = new String("");

	private String procedura = new String("");

	private String tipoUtente = new String("");

	private String repProcedura = new String("");

	private cDatiCartellaPaziente vDati;

	Hashtable<String, String> hDatiTab = new Hashtable<String, String>();

	datiSezioni datiSez;

	public ElcoLoggerInterface log = new ElcoLoggerImpl(this.getClass());

	public paginaTab(ServletContext cont, HttpServletRequest req) throws SqlQueryException {
		super(cont, req);
		setBaseObject(true, true, true, true);
		connW = bUtente.db.getWebConnection();
		connD = bUtente.db.getDataConnection();
		tipoUtente = bUtente.tipo;
	}

	public paginaTab() throws SqlQueryException {
		super();
	//	fDB = new functionDB(this);
	//	bReparti = Global.getReparti(hSessione);
	//	bUtente = Global.getUser(hSessione);
		connW = bUtente.db.getWebConnection();
		connD = bUtente.db.getDataConnection();
		tipoUtente = bUtente.tipo;

		datiSez = new datiSezioni();

	}

	@Override
	public String getBody() {

		String sOut = new String("");
		
		try {
			this.readDati();
			vDati = new cDatiCartellaPaziente(hSessione, idenVisita, "", "");
			repProcedura = bReparti.getValue(reparto, procedura);
			
			hashRequest.put("iden_anag", vDati.getPaziente().getIden());
			hashRequest.put("cod_dec_Reparto", vDati.getAccesso().getReparto().getCodDec());
			hashRequest.put("idRemoto", vDati.getPaziente().getIdRemoto());
			hashRequest.put("reparto", vDati.getAccesso().getReparto().getCodCdc());
			hashRequest.put("ricovero", vDati.getRicovero().getCodice());
			hashRequest.put("iden_visita", idenVisita);
			hashRequest.put("iden_pro", vDati.getAccesso().getReparto().getIdenProvenienza());
			hashRequest.put("USER_ID", String.valueOf(bUtente.iden_per));
			hashRequest.put("tipoUtente",  String.valueOf(bUtente.tipo));
			hashRequest.put("USER_LOGIN", bUtente.login);
			hashRequest.put("DataInizioRicovero", vDati.getAccesso().getDataInizioISO());
			hashRequest.put("DataFineRicovero", vDati.getAccesso().getDataFineISO());
			hashRequest.put("CodCdcAppoggio", vDati.getAccesso().getRepartoAppoggio().getCodCdc());
			hashRequest.put("IdenProAppoggio", vDati.getAccesso().getRepartoAppoggio().getIdenProvenienza());
			hashRequest.put("procedura", this.procedura);
	
			sOut += getTabulatori();

			
			
			
			//		sOut += getForm().toString();
			
		} catch (Exception ex) {
			log.error(ex);
			sOut = ex.getMessage();
		}

		return sOut;
	}

	private String getTabulatori() {
		PreparedStatement psTab = null;
		ResultSet rsTab = null;

		classULHtmlObject cUL = new classULHtmlObject();
		cUL.addAttribute("id", "navTab");
		String div = "";
		String[] datiTab = new String[2];
		String varJsDatiTab = "<script>\n var datiTabulatori={\n";
		
		String sOut = "";
		
		try {
			connW = bUtente.db.getWebConnection();
			psTab = connW.prepareCall("select * from CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_figlio is not null  order by ordinamento");

			psTab.setString(1, procedura);
			psTab.setString(2, repProcedura);
			psTab.setString(3, tipoUtente);
			rsTab = psTab.executeQuery();

			int contTab = 0;
			while (rsTab.next()) {
				if (checkQuery(chkNull(rsTab.getString("QUERY_CONTROLLO")))) {

					// se sto inserendo il primo tabulatore
					if (chkNull(rsTab.getString("RIFERIMENTI")).equals("LOAD_ON_STARTUP")) {
						cUL.appendSome("<LI><a ordineTab=\"" + contTab + "\" class=selTab id=" + chkNull(rsTab.getString("FUNZIONE")) + "  href='javascript:PAGINA_TAB.caricaTab(\"" + chkNull(rsTab.getString("FUNZIONE")) + "\");' >" + chkNull(rsTab.getString("LABEL")) + "</a></LI>");
						div += "<DIV id=div" + chkNull(rsTab.getString("FUNZIONE")) + " ordineTab=\"" + contTab + "\">";
						div += getContenutoTab(rsTab.getInt("IDEN_FIGLIO"), chkNull(rsTab.getString("FUNZIONE")));
						div += "</DIV>";
					} else {
						cUL.appendSome("<LI ><a ordineTab=\"" + contTab + "\" class=deselTab id=" + chkNull(rsTab.getString("FUNZIONE")) + "  href='javascript:PAGINA_TAB.caricaTab(\"" + chkNull(rsTab.getString("FUNZIONE")) + "\");' >" + chkNull(rsTab.getString("LABEL")) + "</a></LI>");
						div += "<DIV id=div" + chkNull(rsTab.getString("FUNZIONE")) + " ordineTab=\"" + contTab + "\">";
						div += "</DIV>";
					}
					if (!varJsDatiTab.equals("<script>\n var datiTabulatori={\n")) {
						varJsDatiTab += ",\n";
					}
					varJsDatiTab += "\"" + rsTab.getString("FUNZIONE") + "\":{}";

				}

				contTab += 1;
			}
			varJsDatiTab += "}\n</script>\n";
			
			sOut += varJsDatiTab;

			// aggiorno la variabile js datiTabulatori con i dati dei tab
			// caricati all'onload
			Iterator<String> itr;
			String str;
			Set<String> set = hDatiTab.keySet();
			itr = set.iterator();
			while (itr.hasNext()) {
				str = itr.next();
				sOut += hDatiTab.get(str);
			}

			sOut += cUL.toString();
			sOut += "<div id=divContainer>" + div + "</div>";

		} catch (Exception ex) {
			log.error(ex);
			sOut = ex.getMessage();
		} finally {

			try {
				rsTab.close();
				psTab.close();
			} catch (SQLException e) {
				log.error(e);
			}
		}
		return sOut;

	}

	public String[] getTab(String idTab, String idProcedura, String tipoUtente, String vReparto, String vIdenVisita) {
		String resp[] = new String[3];

		PreparedStatement ps = null;
		ResultSet rs = null;

		reparto = vReparto;
		idenVisita = vIdenVisita;
		procedura = idProcedura;

		resp[0] = "";
		resp[1] = idTab;
		resp[2] = "";

		try {
			repProcedura = bReparti.getValue(reparto, procedura);
		} catch (Exception ex) {
			log.error("BaseReparti getValue Error",ex);
		} 
		try {
			vDati = new cDatiCartellaPaziente(hSessione, idenVisita, "", "");
			connW = bUtente.db.getWebConnection();
			ps = connW.prepareCall("select * from IMAGOWEB.CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_padre=(select iden_figlio from imagoweb.config_menu_reparto where procedura=? and CODICE_REPARTO=? and funzione=? and (TIPO_ute is null or TIPO_UTE=?)  and ATTIVO='S') order by ordinamento");
			ps.setString(1, procedura);
			ps.setString(2, repProcedura);
			ps.setString(3, tipoUtente);
			ps.setString(4, procedura);
			ps.setString(5, repProcedura);
			ps.setString(6, idTab);
			ps.setString(7, tipoUtente);

			rs = ps.executeQuery();

			while (rs.next()) {
				resp[0] += getSezione(chkNull(rs.getString("FUNZIONE")), chkNull(rs.getString("PROCEDURA")), chkNull(rs.getString("TIPO_UTE")));
			}

			resp[2] = datiSez.getValDatiSezioni(idTab);
		} catch (Exception ex) {
			log.error(ex);
		} finally {

			try {
				rs.close();
				ps.close();
			} catch (SQLException e) {
				log.error(e);
			}
		}
		return resp;

	}

	public String getSezione(String idSezione, String idProcedura, String tipoUtente) {
		String resp = "";
		String src = "";
		Hashtable<String, String> hDatiSez;
		hDatiSez = getDatiSezione(idSezione, idProcedura, tipoUtente);

		if (hDatiSez.get("TIPO_DATO") != null && hDatiSez.get("TIPO_DATO").equals("DIV")) {
			resp = getDiv(chkNull(hDatiSez.get("LABEL")), chkNull(hDatiSez.get("QUERY")), chkNull(hDatiSez.get("GRUPPO")), idSezione, chkNull(hDatiSez.get("CLASS")), chkNull(hDatiSez.get("DIMENSION")));
		} else if (hDatiSez.get("TIPO_DATO") != null && hDatiSez.get("TIPO_DATO").equals("IFRAME")) {
			src = chkNull(hDatiSez.get("QUERY"));
			src = src.replace("#IDEN_VISITA#", idenVisita);
			src = src.replace("#IDEN_RICOVERO#", vDati.getAccesso().getIdenRicovero());
			src = src.replace("#IDEN_ANAG#", vDati.getPaziente().getIden());
			src = src.replace("#NUM_NOSOLOGICO#", vDati.getRicovero().getCodice());
			src = src.replace("#CODICE_REPARTO#", vDati.getReparto().getCodCdc());
			src = src.replace("#IDEN_PER#", String.valueOf(bUtente.iden_per));
			resp = getFrame(src, idSezione, chkNull(hDatiSez.get("CLASS")), chkNull(hDatiSez.get("LABEL")), chkNull(hDatiSez.get("DIMENSION")));

		}

		else if (hDatiSez.get("TIPO_DATO") != null && hDatiSez.get("TIPO_DATO").equals("CLASS")) {
			resp = getDivFromClass(chkNull(hDatiSez.get("QUERY")), chkNull(hDatiSez.get("ID")), chkNull(hDatiSez.get("CLASS")), chkNull(hDatiSez.get("LABEL")), chkNull(hDatiSez.get("DIMENSION")));
		}

		datiSez.addSezione(idSezione, hDatiSez);

		return resp;
	}

	private Hashtable<String, String> getDatiSezione(String vSezione, String vProcedura, String vTipoUtente) {

		PreparedStatement ps = null;
		ResultSet rs = null;
		Hashtable<String, String> hDatiSezione = null;
		String str;
		try {
			connW = bUtente.db.getWebConnection();
			ps = connW.prepareCall("select * from CONFIG_MENU_REPARTO where funzione=? and procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) ");
			ps.setString(1, vSezione);
			ps.setString(2, vProcedura);
			ps.setString(3, repProcedura);
			ps.setString(4, vTipoUtente);
			rs = ps.executeQuery();

			if (rs.next()) {
				if (checkQuery(chkNull(rs.getString("QUERY_CONTROLLO")))) {
					hDatiSezione = new Hashtable<String, String>();
					hDatiSezione.put("LABEL", rs.getString("LABEL"));
					hDatiSezione.put("QUERY", rs.getString("QUERY"));
					hDatiSezione.put("GRUPPO", rs.getString("GRUPPO"));

					Hashtable<String, String> hTemp = getRiferimenti(rs.getString("RIFERIMENTI"));
					Set<String> set = hTemp.keySet();
					Iterator<String> itr = set.iterator();
					while (itr.hasNext()) {
						str = itr.next();
						hDatiSezione.put(str, hTemp.get(str));
					}
				}
			}
		} catch (Exception ex) {
			log.error(ex);
		} finally {
			try {
				rs.close();
				ps.close();
			} catch (SQLException e) {
				log.error(e);
			}
		}
		return hDatiSezione;
	}

	private Hashtable<String, String> getRiferimenti(String vRif) {
		String[] temp;
		String[] temp2;
		Hashtable<String, String> hDatiRif = new Hashtable<String, String>();

		temp = vRif.split("#");
		for (int i = 0; i < temp.length; i++) {
			temp2 = temp[i].split("=");
			hDatiRif.put(temp2[0].toUpperCase(), temp2[1]);
		}

		return hDatiRif;

	}

	private String getContenutoTab(int idenFiglio, String idTab) {
		PreparedStatement psCont = null;
		ResultSet rsCont = null;
		String out = "";
		String src = "";
		String query = "";

		try {
			connW = bUtente.db.getWebConnection();
			psCont = connW.prepareCall("select * from CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_padre=?  order by ordinamento");
			psCont.setString(1, procedura);
			psCont.setString(2, repProcedura);
			psCont.setString(3, tipoUtente);
			psCont.setInt(4, idenFiglio);

			rsCont = psCont.executeQuery();

			datiSez = new datiSezioni();
			Hashtable<String, String> hDatiRif = null;

			while (rsCont.next()) {
				if (checkQuery(chkNull(rsCont.getString("QUERY_CONTROLLO")))) {
					hDatiRif = getRiferimenti(chkNull(rsCont.getString("RIFERIMENTI")));

					if (chkNull(hDatiRif.get("TIPO_DATO")).equals("DIV")) {

						query = chkNull(rsCont.getString("QUERY"));
						/*
						 * query = query.replace("#IDEN_VISITA#",idenVisita);
						 * query =
						 * query.replace("#IDEN_ANAG#",vDati.getIdenAnag());
						 * query =
						 * query.replace("#NUM_NOSOLOGICO#",vDati.getNumeroRicovero
						 * ()); query =
						 * query.replace("#CODICE_REPARTO#",vDati.getCodCdcReparto
						 * ()); query =
						 * query.replace("#IDEN_PER#",String.valueOf
						 * (bUtente.iden_per));
						 */

						hDatiRif.put("QUERY", query);
						hDatiRif.put("LABEL", rsCont.getString("LABEL"));
						hDatiRif.put("GRUPPO", rsCont.getString("GRUPPO"));
						hDatiRif.put("FUNZIONE", rsCont.getString("FUNZIONE"));

						out += getDiv(chkNull(rsCont.getString("LABEL")), chkNull(rsCont.getString("QUERY")), chkNull(rsCont.getString("GRUPPO")), chkNull(rsCont.getString("FUNZIONE")), chkNull(hDatiRif.get("CLASS")), chkNull(hDatiRif.get("DIMENSION")));

					} else if (chkNull(hDatiRif.get("TIPO_DATO")).equals("IFRAME")) {
						src = chkNull(rsCont.getString("QUERY"));
						src = src.replace("#IDEN_VISITA#", idenVisita);
						src = src.replace("#IDEN_RICOVERO#", vDati.getAccesso().getIdenRicovero());
						src = src.replace("#IDEN_ANAG#", vDati.getPaziente().getIden());
						src = src.replace("#NUM_NOSOLOGICO#", vDati.getRicovero().getCodice());
						src = src.replace("#CODICE_REPARTO#", vDati.getReparto().getCodCdc());
						src = src.replace("#IDEN_PER#", String.valueOf(bUtente.iden_per));
						out += getFrame(src, chkNull(rsCont.getString("FUNZIONE")), chkNull(hDatiRif.get("CLASS")), chkNull(rsCont.getString("LABEL")), chkNull(hDatiRif.get("DIMENSION")));

						hDatiRif.put("SRC", rsCont.getString("QUERY"));
						hDatiRif.put("FUNZIONE", rsCont.getString("FUNZIONE"));
						hDatiRif.put("LABEL", rsCont.getString("LABEL"));
					} else if (chkNull(hDatiRif.get("TIPO_DATO")).equals("CLASS")) {
						out += getDivFromClass(chkNull(rsCont.getString("QUERY")), chkNull(rsCont.getString("FUNZIONE")), chkNull(hDatiRif.get("CLASS")), chkNull(rsCont.getString("LABEL")), chkNull(hDatiRif.get("DIMENSION")));

						hDatiRif.put("QUERY", rsCont.getString("QUERY"));
						hDatiRif.put("FUNZIONE", rsCont.getString("FUNZIONE"));
						hDatiRif.put("LABEL", rsCont.getString("LABEL"));

					}

				}

				datiSez.addSezione(rsCont.getString("FUNZIONE"), hDatiRif);

			}

			hDatiTab.put(idTab, "<script>\n" + datiSez.getValDatiSezioni(idTab) + "</script>\n");

		} catch (Exception ex) {
			log.error(ex);
		} finally {

			try {
				rsCont.close();
				psCont.close();
			} catch (SQLException e) {
				log.error(e);
			}
		}
		return out;
	}

	private String[] getDatiFromSql(String query, String orientamento, String id, String classCss, String label, String dimension) {
		ResultSet rs = null;
		OraclePreparedStatement ps = null;
		String resp[] = new String[2];
		resp[1] = id;
		resp[0] = "<div id=" + id + " name=div" + id;
		if (classCss != null && !classCss.equals(""))
			resp[0] += " class='" + classCss + "' ";

		if (dimension != null && !dimension.equals(""))
			;
		resp[0] += " style='" + dimension + "' ";

		resp[0] += ">\n";

		if (label != null && !label.equals(""))
			resp[0] += "<div class=titleTable>" + label + "</div>";

		try {
			connD = bUtente.db.getDataConnection();
			ps = (OraclePreparedStatement) connD.prepareCall(query);

			if (query.contains(":IDEN_VISITA"))
				ps.setIntAtName("IDEN_VISITA", Integer.parseInt(idenVisita));
			if (query.contains(":IDEN_RICOVERO"))
				ps.setStringAtName("IDEN_RICOVERO", vDati.getAccesso().getIdenRicovero());
			if (query.contains(":NUM_NOSOLOGICO"))
				ps.setStringAtName("NUM_NOSOLOGICO", vDati.getRicovero().getCodice());
			if (query.contains(":CODICE_REPARTO"))
				ps.setStringAtName("CODICE_REPARTO", vDati.getReparto().getCodCdc());
			if (query.contains(":IDEN_PER"))
				ps.setIntAtName("IDEN_PER", bUtente.iden_per);
			if (query.contains(":IDEN_ANAG"))
				ps.setIntAtName("IDEN_ANAG", Integer.parseInt(vDati.getPaziente().getIden()));
			rs = ps.executeQuery();

			if (orientamento.equals("ORIZZONTALE"))
				resp[0] += getTableFromRs(rs);
			else if (orientamento.equals("VERTICALE"))
				resp[0] += getTableFromRecord(rs);
			else
				resp[0] += getTableFromRecordFlow(rs);

		}

		catch (Exception ex) {
			log.error(ex);
		} finally {

			try {
				fDB.close(rs);
			} catch (SQLException e) {
				log.error(e);
			}
		}
		resp[0] += "</div>\n";
		return resp;
	}

	public String[] getDatiFromSql(String query, String orientamento, String id, String classCss, String label, String dimension, int pIdenVisita, String pNumNosologico, String pCodiceReparto, int pIdenPer, int pIdenAnag) {
		ResultSet rs = null;
		OraclePreparedStatement ps = null;
		String resp[] = new String[2];
		resp[1] = id;
		resp[0] = "<div id=" + id + " name=div" + id;
		if (classCss != null && !classCss.equals(""))
			resp[0] += " class='" + classCss + "' ";

		if (dimension != null && !dimension.equals(""))
			;
		resp[0] += " style='" + dimension + "' ";

		resp[0] += ">\n";

		if (label != null && !label.equals(""))
			resp[0] += "<div class=titleTable>" + label + "</div>";

		try {
			connD = bUtente.db.getDataConnection();
			ps = (OraclePreparedStatement) connD.prepareCall(query);

			if (query.contains(":IDEN_VISITA"))
				ps.setIntAtName("IDEN_VISITA", pIdenVisita);
			if (query.contains(":NUM_NOSOLOGICO"))
				ps.setStringAtName("NUM_NOSOLOGICO", pNumNosologico);
			if (query.contains(":CODICE_REPARTO"))
				ps.setStringAtName("CODICE_REPARTO", pCodiceReparto);
			if (query.contains(":IDEN_PER"))
				ps.setIntAtName("IDEN_PER", pIdenPer);
			if (query.contains(":IDEN_ANAG"))
				ps.setIntAtName("IDEN_ANAG", pIdenAnag);
			rs = ps.executeQuery();

			if (orientamento.equals("ORIZZONTALE"))
				resp[0] += getTableFromRs(rs);
			else if (orientamento.equals("VERTICALE"))
				resp[0] += getTableFromRecord(rs);
			else
				resp[0] += getTableFromRecordFlow(rs);

		}

		catch (Exception ex) {
			log.error(ex);
		} finally {

			try {
				fDB.close(rs);
			} catch (SQLException e) {
				log.error(e);
			}
		}
		resp[0] += "</div>\n";
		return resp;
	}

	private String getDiv(String label, String query, String gruppo, String id, String classCss, String dimension) {
		String out = "";

		if (query != null && !query.equals("")) {

			/*
			 * query = query.replace("#IDEN_VISITA#",idenVisita); query =
			 * query.replace("#IDEN_ANAG#",vDati.getIdenAnag()); query =
			 * query.replace("#NUM_NOSOLOGICO#",vDati.getNumeroRicovero());
			 * query =
			 * query.replace("#CODICE_REPARTO#",vDati.getCodCdcReparto()); query
			 * = query.replace("#IDEN_PER#",String.valueOf(bUtente.iden_per));
			 */

			out += getDatiFromSql(query, gruppo, id, classCss, label, dimension)[0];

		}
		return out;
	}

	private String getDivFromClass(String cls, String id, String classCss, String label, String dimension) {
		String resp = "";

		resp = "<div id =" + id + " class='" + classCss + "' ";
		if (dimension != null && !dimension.equals(""))
			resp += " style='" + dimension + "' ";

		resp += " >";

		if (label != null && !label.equals(""))
			resp += "<div class=titleTable>" + label + "</div>";
		try {
			Class myClass = Class.forName(cls);
			ILetteraInfo myInt = null;
			myInt = (ILetteraInfo) myClass.newInstance();
			myInt.setRequest(this.hRequest, this.hSessione, this.fDB);
			resp = myInt.getHtml();
		}

		catch (Exception ex) {
			log.error(ex);
		}
		resp += "</div>\n";
		return resp;
	}

	private String getFrame(String src, String id, String classCss, String label, String dimension) {
		String out;

		out = "<DIV id=" + id + " name=" + id + " class='" + classCss + "'";
		if (dimension != null && !dimension.equals(""))
			out += " style='" + dimension + "' ";
		out += ">";

		if (label != null && !label.equals(""))
			out += "<div class=titleTable>" + label + "</div>";
		classIFrameHtmlObject cFrame = new classIFrameHtmlObject(src);

		// if (dimension !=null && !dimension.equals(""))
		cFrame.addAttribute("style", "width:100%;");

		out += cFrame.toString() + "</DIV>";
		return out;
	}

	private String getTableFromRecord(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd = rs.getMetaData();

		String resp = "";

		String spanHeader;
		String spanDetail;
		if (rs.next()) {
			for (int i = 1; i <= rsmd.getColumnCount(); i++) {
				spanHeader = "<span class=header>" + rsmd.getColumnLabel(i) + "</span>\n";
				spanDetail = "<span class=detail>" + chkNull(rs.getString(rsmd.getColumnLabel(i))) + "</span>\n";

				resp += "<div class=row>" + spanHeader + spanDetail + "</div>\n";
			}

		} else {
			resp += "<div class=row>Nessun dato presente</div>\n";
		}

		return resp;
	}

	private String getTableFromRs(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd = rs.getMetaData();

		String resp = "";
		resp += "<DIV class=divTable >";
		resp += "<table>\n<tr>\n";

		for (int i = 1; i <= rsmd.getColumnCount(); i++)
			resp += "<th>" + rsmd.getColumnLabel(i) + "</th>\n";

		resp += "</tr>\n";

		while (rs.next()) {
			resp += "<tr>\n";
			for (int i = 1; i <= rsmd.getColumnCount(); i++)
				resp += "<td>" + chkNull(rs.getString(rsmd.getColumnLabel(i))) + "</td>\n";

			resp += "</tr>\n";
		}

		resp += "</table>\n";
		resp += "</DIV>";
		return resp;
	}

	private String getTableFromRecordFlow(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd = rs.getMetaData();

		String resp = "";

		String spanHeader;
		String spanDetail;
		if (rs.next()) {
			for (int i = 1; i <= rsmd.getColumnCount(); i++) {
				spanHeader = "<span class=header onselectstart=\"abilitaSelezione();\">" + rsmd.getColumnLabel(i) + "</span>\n";
				spanDetail = "<span class=detail onselectstart=\"abilitaSelezione();\">" + chkNull(rs.getString(rsmd.getColumnLabel(i))) + "</span>\n";

				resp += "<div style=\"clear:both\" class=rowHead>" + spanHeader + "</div>\n";
				resp += "<div style=\"clear:both\" class=rowDetail>" + spanDetail + "</div>\n";
			}

		} else {
			resp += "<div class=row>Nessun dato presente</div>\n";
		}

		return resp;
	}

	private boolean checkQuery(String query) {
		boolean ret = true;
		ResultSet rs = null;
		OraclePreparedStatement ps = null;
		if (!query.equals("")) {
			try {
				ps = (OraclePreparedStatement) connD.prepareStatement(query);
				rs = ps.executeQuery();
				ret = rs.next();
			} catch (Exception ex) {
				log.error(ex);
			} finally {

				try {
					rs.close();
					ps.close();
				} catch (SQLException e) {
					log.error(e);
				}
			}

		}
		return ret;
	}

	private void readDati() throws SQLException, SqlQueryException {
		reparto = cParam.getParam("REPARTO").trim();
		idenVisita = cParam.getParam("IDEN_VISITA").trim();
		procedura = cParam.getParam("PROCEDURA").trim();
	}

	@Override
	protected String getBottomScript() {
		return "";
	}

	@Override
	protected String getTitle() {
		return "";
	}
}
