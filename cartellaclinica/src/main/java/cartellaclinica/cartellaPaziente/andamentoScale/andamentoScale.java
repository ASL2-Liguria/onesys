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
package cartellaclinica.cartellaPaziente.andamentoScale;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class andamentoScale extends servletEngine {
	private HttpServletRequest request = null; 
	private final ElcoLoggerInterface logInterface = new ElcoLoggerImpl(andamentoScale.class);
	String lingue=null;

	public andamentoScale(ServletContext pCont, HttpServletRequest pReq) {
		super(pCont, pReq);
		this.request = pReq;
		this.bReparti = super.bReparti;
	}

	@Override
	protected String getBody() {
		String sOut="";
		String idenVisita = request.getParameter("idenVisita");
		String scala = request.getParameter("scala");
		StatementFromFile sff = null;
		classRowDataTable cRow,cRowIntestazione=null;
		classDivHtmlObject cDivMain,cDivLeft,cDivDati;
		classTableHtmlObject cTableLeft,cTableDati;
		String datiRighe = null;

		int cont=2;

		lingue=caricaLingue(scala);
		try {

			cDivMain = new classDivHtmlObject("divMain");
			cDivLeft = new classDivHtmlObject("divLeft");
			cDivDati = new classDivHtmlObject("divDati");

			cTableLeft = new classTableHtmlObject();
			cTableLeft.addAttribute("id", "tabLeft");

			cTableDati = new classTableHtmlObject();
			cTableDati.addAttribute("id", "tabDati");	

			sff = new  StatementFromFile(this.hSessione);
			ResultSet rs = sff.executeQuery("andamentoScale.xml",scala,new String[]{idenVisita});
			ResultSetMetaData rsmd = rs.getMetaData();
			//recupero le date di registrazione 
			cRowIntestazione = new classRowDataTable();
			cRow = new classRowDataTable();
			LinkedHashMap<Integer, Object> hrighe =new LinkedHashMap<Integer, Object>();


			cRow = new classRowDataTable();
			cRow.addCol(getTr("&nbsp;","classIntestazione"));
			cTableLeft.appendSome("<thead>"+cRow.toString()+"</thead><tbody>");

			while (rs.next())
			{	
				cRowIntestazione.addCol(getTr(rs.getString("DATA_REG"),"classIntestazione"));

				for (int i = 2; i <= rsmd.getColumnCount(); i++) {
					//se è la prima riga creo gli array a cui aggiungere i dati
					if(cont==2){
						cRow = new classRowDataTable();
						if (rsmd.getColumnLabel(i).length()>12 && rsmd.getColumnLabel(i).substring(0,12).equals("INTESTAZIONE")){
							cRow.addCol(getTd(rs.getString(rsmd.getColumnLabel(i)),"classSubIntestazione"));
						}
						else{
							cRow.addCol(getTd(getDescrFromLingue(rsmd.getColumnLabel(i)),"classVoci"));
						}
						cTableLeft.appendSome(cRow.toString());

						cRow = new classRowDataTable();
						if (rsmd.getColumnLabel(i).length()>12 && rsmd.getColumnLabel(i).substring(0,12).equals("INTESTAZIONE")){
							cRow.addCol(getTd("&nbsp;","classSubIntestazione"));
						}
						else if (rsmd.getColumnLabel(i).toUpperCase().contains("TOTALE") || rsmd.getColumnLabel(i).toUpperCase().contains("PUNTEGGIO") || rsmd.getColumnLabel(i).toUpperCase().contains("TINETTISCORE")){
							cRow.addCol(getTd(rs.getString(rsmd.getColumnLabel(i)),"classTotale"));
						}
						else{
							cRow.addCol(getTd(rs.getString(rsmd.getColumnLabel(i)),"classDati"));
						}
						hrighe.put(i, cRow);
					}     				
					else{
						cRow=(classRowDataTable) hrighe.get(i);
						if (rsmd.getColumnLabel(i).length()>12 && rsmd.getColumnLabel(i).substring(0,12).equals("INTESTAZIONE")){
							cRow.addCol(getTd("&nbsp;","classSubIntestazione"));
						}
						else if (rsmd.getColumnLabel(i).toUpperCase().contains("TOTALE") || rsmd.getColumnLabel(i).toUpperCase().contains("PUNTEGGIO") || rsmd.getColumnLabel(i).toUpperCase().contains("TINETTISCORE")){
							cRow.addCol(getTd(rs.getString(rsmd.getColumnLabel(i)),"classTotale"));
						}
						else{
							cRow.addCol(getTd(rs.getString(rsmd.getColumnLabel(i)),"classDati"));
						}
						hrighe.put(i, cRow);
					}
				}                
				cont+=1;
			}

			//nessuna registrazione effettuata
			if(cont==2){
				cDivLeft = new classDivHtmlObject("divAvviso", "", "Nessuna registrazione effettuata per la scala selezionata");
				cDivMain.appendSome(cDivLeft.toString());
			}
			else{
				//aggiungo alla tabella dei dati la riga di intestazione
				cTableDati.appendSome("<thead>"+cRowIntestazione.toString()+"</thead><tbody>");

				//aggiungo alla tabella le righe dei dati
				for (Integer in: hrighe.keySet()) {
					cTableDati.appendSome(hrighe.get(in).toString());
				}
				cTableDati.appendSome("</tbody>");
				cTableDati.addAttribute("width",cont * 200 + "px");

				cTableLeft.appendSome("</tbody>");

				cDivLeft.appendSome(cTableLeft.toString());
				cDivDati.appendSome(cTableDati.toString());

				cDivMain.appendSome(cDivLeft.toString());
				cDivMain.appendSome(cDivDati.toString());
			}
			sOut += cDivMain.toString();

		} catch (Exception e) {
			sOut=e.getMessage();
			logInterface.error(e.getMessage(), e);
		}
		finally{
			sff.close();
		}


		return sOut;
	}



	private  String caricaLingue(String scalaIn){
		StatementFromFile sff = null;
		String sOut="";
		try {
			sff = new  StatementFromFile(this.hSessione);
			ResultSet rs = sff.executeQuery("andamentoScale.xml","caricaLingue",new String[]{scalaIn});
			if (rs.next()){
				sOut=rs.getString("TRAD1");
			}
		} catch (Exception e) {
			sOut=e.getMessage();
			logInterface.error(e.getMessage(), e);
		}
		finally{
			sff.close();
		}
		return sOut;

	}

	private String getDescrFromLingue(String campo){
		String sOut="";
		sOut=lingue.substring(lingue.indexOf("=",lingue.indexOf(campo+"="))+1,lingue.indexOf("*",lingue.indexOf(campo+"=")));
		return sOut;
	}

	private classColDataTable getTableColumn(String tagName, String text, String className) {
		classColDataTable column = new classColDataTable(tagName, "", text);
		column.addAttribute("class", className);
		return column;
	}

	private classColDataTable getTd(String text, String className) {
		if(text==null){
			text="&nbsp";
		}
		return this.getTableColumn("TD", text, className);
	}
	private classColDataTable getTr(String text, String className) {
		return this.getTableColumn("TR", text, className);
	}

	@Override
	protected String getTitle() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected String getBottomScript() throws Exception {
		return "";
	}


}
