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
package cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classLIHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import plugin.getPoolConnection;

public class listDocumentLabEngine extends functionObj {

	private String idPaziente = new String("");
	private String idReferto = new String("");
	private String nosologico = new String("");
	private String daData = new String("");
	private String aData = new String("");
//	private String [] arrayDocument;
//	private String indiceColonna = new String("");
	String URI;
	String uriSS;
	String MIMETYPE;
	Connection conn;
	getPoolConnection myPoolConnection = null;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(listDocumentLabEngine.class);

	classImgHtmlObject cImgGraf = null;

	private functionDB fDB = null;
	ServletContext cContext;
	HttpServletRequest cRequest;
	Hashtable<Integer, Hashtable> hashColonne = new Hashtable<Integer, Hashtable>();
	/**
	 * Contiene i parametri di configurazione provenienti da applicativo
	 * intestazione ordine larghezza in % metodo da chiamare per reperire il
	 * dato parametri del metodo intervallati da §
	 */
	ArrayList<String> ArJoin;
	Hashtable<String, String> hashRequest = new Hashtable<String, String>();
	/**
	 * contiene i parametri generici dataIni dataFine URN documento DocStatus
	 * DocType User repartoProduttore riferito al documento repartoUtente per la
	 * configurazione
	 */
	Hashtable<String, String> hashMetadatiRichiesti = new Hashtable<String, String>();

	/**
	 * contiene le coppie name§value per filtrare i documenti
	 */

	public listDocumentLabEngine(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		cContext = cont;
		cRequest = req;

	}

	public listDocumentLabEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {
		String sOut = new String("");

		Document cDoc = new Document();
		Body cBody = new Body();
//    classFormHtmlObject cForm = null;
//    classTabHeaderFooter HeadSection = null;
		classTableHtmlObject cTable = null;
		classRowDataTable cRow = null;
		classColDataTable cCol = null;
//    classInputHtmlObject cInput = null;
//    classIFrameHtmlObject cFrame = null;
		classDivHtmlObject cDiv = null;
//    classImgHtmlObject cImg = null;
		ResultSet rs = null;
		ResultSet rs1 = null;
		double valore_min = 0.0;
		double valore_max = 0.0;
		double risultato = 0.0;
		boolean risultatoOk = true;
		String sql = "";
		HashMap<String, String> mapColonneData = null;
		HashMap<String, String> mapColonneRef = null;
		String[] dataPrelievo = null;

		String confReparto = cRequest.getParameter("confReparto");
		if (confReparto == null) {
			confReparto = "DEFAULT";
		}

		try {
			readDati();

			dataPrelievo = getDataIni();

			cDoc.appendHead(this.createHead());

			classULHtmlObject cUL = null;
			classLIHtmlObject cLI = null;

			cUL = new classULHtmlObject();
			cUL.addAttribute("id", "navExcel");
			cLI = new classLIHtmlObject(false);
			cLI.appendSome("<a id='buttonExcel' href='javascript:AutomateExcelRepository();'>Esporta in excel</a>");
			cUL.appendSome(cLI);
			cBody.addElement(cUL.toString());

			cTable = new classTableHtmlObject();
			cTable.addAttribute("id", "tabella");

			cRow = new classRowDataTable();

//  a inizio riga aggiungo una colonna contenente icona identificante possibilita' elaborare grafico
			cCol = new classColDataTable("TH", "", "");
			cRow.addCol(cCol);

			Statement stm = null;
			//   conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();
			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);

			/*     if (!nosologico.equals("")){
			 // sql="SELECT DISTINCT(DATA_PRELIEVO||ORA_PRELIEVO) DATAORA_PRELIEVO FROM  xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d  WHERE l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='"+nosologico+"') and radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+idPaziente+"' order by DATA_PRELIEVO||ORA_PRELIEVO DESC ";
			 sql="SELECT DATA_PRELIEVO||ORA_PRELIEVO as DATAORA_PRELIEVO,id_referto FROM  xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d  WHERE l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='"+nosologico+"') and radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+idPaziente+"' group by DATA_PRELIEVO||ORA_PRELIEVO,id_referto order by DATA_PRELIEVO||ORA_PRELIEVO DESC, id_referto desc ";
			 }
			 else{ */
			//	  sql="SELECT DATA_PRELIEVO||ORA_PRELIEVO as DATAORA_PRELIEVO,id_referto FROM  xdsregistry.view_risultati_lab WHERE radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+idPaziente+"' and DATA_PRELIEVO>='"+daData+"' and DATA_PRELIEVO<='"+aData+"' and codice_esame in (select distinct(codice_esame) from risultati_lab where id_referto='"+idReferto+"') group by DATA_PRELIEVO||ORA_PRELIEVO,id_referto order by DATA_PRELIEVO||ORA_PRELIEVO DESC, id_referto desc ";
			sql = "SELECT DATA_PRELIEVO||ORA_PRELIEVO as DATAORA_PRELIEVO,id_referto FROM  xdsregistry.view_risultati_lab WHERE id_paziente='" + idPaziente + "' and DATA_PRELIEVO>='" + dataPrelievo[0] + "' and DATA_PRELIEVO<='" + dataPrelievo[1] + "' and codice_esame in (select distinct(codice_esame) from risultati_lab where id_referto='" + idReferto + "') group by DATA_PRELIEVO||ORA_PRELIEVO,id_referto order by DATA_PRELIEVO||ORA_PRELIEVO DESC, id_referto desc ";
   // 	  }

			rs = stm.executeQuery(sql);

			cCol = new classColDataTable("TH", "", "ESAME");
    //  cCol.appendSome("<p class='slide'><a href='#' class='btn-slide'>Filtri</a></p>");

			cRow.addCol(cCol);

			mapColonneData = new HashMap<String, String>();
			mapColonneRef = new HashMap<String, String>();

			int contCol = 2;

			while (rs.next()) {

				mapColonneData.put(rs.getString("DATAORA_PRELIEVO"), String.valueOf(contCol));
				mapColonneRef.put(rs.getString("id_referto"), String.valueOf(contCol));

				cCol = new classColDataTable("TH", "", rs.getString("DATAORA_PRELIEVO").substring(6, 8) + "/" + rs.getString("DATAORA_PRELIEVO").substring(4, 6) + "/" + rs.getString("DATAORA_PRELIEVO").substring(0, 4) + " " + rs.getString("DATAORA_PRELIEVO").substring(8, 13));
				cRow.addCol(cCol);

				contCol += 1;

			}

			cCol = new classColDataTable("TH", "", "VALORE MINIMO");
			cRow.addCol(cCol);
			cCol = new classColDataTable("TH", "", "VALORE MASSIMO");
			cRow.addCol(cCol);

			cCol = new classColDataTable("TH", "", "UNITA' MISURA");
			cRow.addCol(cCol);

			//   cTable.appendSome("<thead>"+cRow.toString()+"</thead>");
			cTable.appendSome(cRow.toString());

		} catch (Exception e) {
			cBody.setOnLoad("setVisible();");
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				fDB.close(rs);
				fDB.close(rs1);
				//	conn.close();
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {
				sOut = e.getMessage();
				logInterface.error(e.getMessage(), e);
			}

		}

     //-------------------------------------- 
      //mi carico le righe della tabella
		cDiv = new classDivHtmlObject("riqLab");

		if (!nosologico.equals("")) {
			//sql=" select DATA_PRELIEVO||ORA_PRELIEVO AS DATAORA_PRELIEVO,CODICE_ESAME,VALORE_MIN,VALORE_MAX,RISULTATO,UNITA_MISURA,DESCR_ESAME,COLOR  FROM  xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d  WHERE l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='"+nosologico+"') and radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+idPaziente+"' order by descr_esame asc, codice_esame asc,data_prelievo||ora_prelievo desc ";
			sql = " select DATA_PRELIEVO||ORA_PRELIEVO AS DATAORA_PRELIEVO,id_referto,CODICE_ESAME,VALORE_MIN,VALORE_MAX,RISULTATO,UNITA_MISURA,DESCR_ESAME,COLOR  FROM  xdsregistry.view_risultati_lab l, xdsregistry.view_documenti d  WHERE l.id_referto=d.idrefertolab and d.id in (select distinct(parent) from xdsregistry.slot where name='nosologico' and value='" + nosologico + "') and radsql.utility.GET_TOKEN(id_paziente,'1','^')='" + idPaziente + "' order by descr_esame asc, codice_esame asc,data_prelievo||ora_prelievo desc,id_referto desc ";
		} else {
			//sql = " select DATA_PRELIEVO||ORA_PRELIEVO AS DATAORA_PRELIEVO,CODICE_ESAME,VALORE_MIN,VALORE_MAX,RISULTATO,UNITA_MISURA,DESCR_ESAME,COLOR from xdsregistry.view_risultati_lab where radsql.utility.GET_TOKEN(id_paziente,'1','^')='"+idPaziente+"' and DATA_PRELIEVO>='"+daData+"' and DATA_PRELIEVO<='"+aData+"' order by descr_esame asc, codice_esame asc,data_prelievo||ora_prelievo desc ";     
			sql = " select DATA_PRELIEVO||ORA_PRELIEVO AS DATAORA_PRELIEVO,id_referto,CODICE_ESAME,VALORE_MIN,VALORE_MAX,RISULTATO,UNITA_MISURA,DESCR_ESAME,COLOR from xdsregistry.view_risultati_lab where id_paziente='" + idPaziente + "' and DATA_PRELIEVO>='" + dataPrelievo[0] + "' and DATA_PRELIEVO<='" + dataPrelievo[1] + "' and codice_esame in (select distinct(codice_esame) from risultati_lab where id_referto='" + idReferto + "')  order by descr_esame asc, codice_esame asc,data_prelievo||ora_prelievo desc,id_referto desc ";
		}

		try {
			//  rs= this.fDB.openRs(sql_campi);  
			Statement stm = null;
			//   conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();

			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
			rs = stm.executeQuery(sql);

			String codiceEsameOld = "";
			String codiceEsame = "";
			String valore_min_string = "";
			String valore_max_string = "";
			String unita_misura_string = "";

			if (rs.next()) {
				//indica la posizione delle colonne riguardanti le date degli esami...quindi si parte dalla seconda...la prima e' la descrizione    	
				int contRs = 2;

				String tBody = new String("<tbody>");
				rs.beforeFirst();

				// ciclo tutti i record di esami di laboratorio ordinato per tipo di esame
				while (rs.next()) {

					codiceEsame = rs.getString("CODICE_ESAME");
      // ogni volta che cambia il tipo di esame aggiungo una riga

					if (!codiceEsame.equalsIgnoreCase(codiceEsameOld)) {

						// se ho gia' inserito una riga ...devo aggiungerla al body prima di crearne un'altra      	
						if (!codiceEsameOld.equals("")) {

        		// se devo cambiar riga, devo aggiungere ancora le eventuuali colonne vuote riguardanti ad esami non effettuati per quelle date 
							while ((mapColonneRef.size() + 2) != contRs) {
								cCol = new classColDataTable("TD", "", "");
								cRow.addCol(cCol);
								contRs += 1;
							}

							cCol = new classColDataTable("TD", "", valore_min_string);
							cRow.addCol(cCol);
							cCol = new classColDataTable("TD", "", valore_max_string);
							cRow.addCol(cCol);
							cCol = new classColDataTable("TD", "", unita_misura_string);
							cRow.addCol(cCol);

							cTable.appendSome(cRow.toString());

							//resetto il contatore al cambio della riga...dell'esame
							contRs = 2;

						}

						cRow = new classRowDataTable();
						cRow.addAttribute("onMouseOver", "javascript:trHover(this,\"listDocumentLab\");");
						cRow.addAttribute("onClick", "javascript:trClick(this,\"listDocumentLab\");");
						//  cRow.addAttribute("onDblClick","javascript:trDblClickLab(this);");
						cRow.addAttribute("onMouseOut", "javascript:tableOut(this,\"listDocumentLab\");");
						cRow.addAttribute("codiceEsame", rs.getString("CODICE_ESAME"));
						cRow.addAttribute("descrEsame", rs.getString("DESCR_ESAME"));
						cRow.addAttribute("selected", "0");

						valore_min_string = rs.getString("VALORE_MIN");
						valore_max_string = rs.getString("VALORE_MAX");
						unita_misura_string = rs.getString("UNITA_MISURA");

						cCol = new classColDataTable("TD", "", "");

						if (risultatoOk) {

							cCol.addAttribute("onClick", "javascript:grafLab(this);");
							//  cCol.addAttribute("style","CURSOR: hand; COLOR: black; TEXT-DECORATION: underline");
							cCol.addAttribute("idPatient", this.idPaziente);
							cCol.addAttribute("nosologico", this.nosologico);
              //     cCol.addAttribute("daData",this.daData);
							//     cCol.addAttribute("aData",this.aData);
							cCol.addAttribute("daData", dataPrelievo[0]);
							cCol.addAttribute("aData", dataPrelievo[1]);
							classDivHtmlObject grafDiv = new classDivHtmlObject("", "", "&nbsp");
							grafDiv.addAttribute("class", "imageGraf");
							cCol.appendSome(grafDiv.toString());
                 //  cCol.appendSome(cImgGraf);

						}

						cRow.addCol(cCol);

						cCol = new classColDataTable("TD", "", rs.getString("DESCR_ESAME"));

						/*           if (risultatoOk)
						 { 
              	
						 cCol.addAttribute("onClick", "javascript:grafLab(this);"); 
						 cCol.addAttribute("style","CURSOR: hand; COLOR: black; TEXT-DECORATION: underline");
						 cCol.addAttribute("idPatient",this.idPaziente);
                  
                 
						 }*/
						cRow.addCol(cCol);

                //fino a quando la data dell'esame non corrisponde a quella dell'intestazione della tabella aggiungo colonne vuote
						//   while(!mapColonneData.get(rs.getString("DATAORA_PRELIEVO")).equals(String.valueOf(contRs))){
						while (!mapColonneRef.get(rs.getString("id_referto")).equals(String.valueOf(contRs))) {
							cCol = new classColDataTable("TD", "", "");
							cRow.addCol(cCol);
							contRs += 1;
						}

						cCol = new classColDataTable("TD", "", rs.getString("RISULTATO"));

						if (rs.getString("COLOR") != null) {
							if (rs.getString("COLOR").equalsIgnoreCase("BLUE")) //	   cCol.addAttribute("class", "BLUE");
							{
								cCol.addAttribute("style", "COLOR: blue; FONT-WEIGHT:BOLD;");
							} else if (rs.getString("COLOR").equalsIgnoreCase("RED")) {
								cCol.addAttribute("style", "COLOR: red; FONT-WEIGHT:BOLD;");
							}
							//	   cCol.addAttribute("class", "RED");
						}

						cRow.addCol(cCol);

					} // se e' lo stesso esame ma di una data precedente lo aggiungo alla stessa riga   
					else {

        	 //fino a quando la data dell'esame non corrisponde a quella dell'intestazione della tabella aggiungo colonne vuote
						//   while(!mapColonneData.get(rs.getString("DATAORA_PRELIEVO")).equals(String.valueOf(contRs))){
						while (!mapColonneRef.get(rs.getString("id_referto")).equals(String.valueOf(contRs))) {
							cCol = new classColDataTable("TD", "", "");
							cRow.addCol(cCol);
							contRs += 1;
						}

						cCol = new classColDataTable("TD", "", rs.getString("RISULTATO"));
						if (rs.getString("COLOR") != null) {
							if (rs.getString("COLOR").equalsIgnoreCase("BLUE")) {
								cCol.addAttribute("style", "COLOR: blue; FONT-WEIGHT:BOLD;");
							} //  	 cCol.addAttribute("class", "BLUE");
							else if (rs.getString("COLOR").equalsIgnoreCase("RED")) {
								cCol.addAttribute("style", "COLOR: red; FONT-WEIGHT:BOLD;");
							}
							//	 cCol.addAttribute("class", "RED");
						}
						cRow.addCol(cCol);
					}

					codiceEsameOld = codiceEsame;
					contRs += 1;
					risultatoOk = true;

				}

          //aggiungo l'ultima riga
				// se devo cambiar riga, devo aggiungere ancora le eventuuali colonne vuote riguardanti ad esami non effettuati per quelle date 
				while (!String.valueOf(mapColonneRef.size() + 2).equals(String.valueOf(contRs))) {
					cCol = new classColDataTable("TD", "", "");
					cRow.addCol(cCol);
					contRs += 1;
				}

				cCol = new classColDataTable("TD", "", valore_min_string);
				cRow.addCol(cCol);
				cCol = new classColDataTable("TD", "", valore_max_string);
				cRow.addCol(cCol);
				cCol = new classColDataTable("TD", "", unita_misura_string);
				cRow.addCol(cCol);

        //  tBody+=cRow.toString();
         // tBody+="</tbody>";
				//  cTable.appendSome(tBody); 
				cTable.appendSome(cRow.toString());

			}
		} catch (Exception e) {
			cBody.setOnLoad("setVisible();");
			sOut = e.getMessage();
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				fDB.close(rs);
				//	new Connessione().chiudi(conn,cContext);
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {

				sOut = e.getMessage();
				logInterface.error(e.getMessage(), e);
			}

		}

   //   cDiv.appendSome(cTable.toString());
		//   cBody.addElement(cDiv.toString());
		cBody.addElement(cTable.toString());

		cBody.addElement("<script>\n espandiTabella(\"listDocumentLab\"); \n</script>");
    //  cBody.addElement("<script type='text/javascript'>fxheaderInit('tabella',600,1,0);fxheader();</script>"); 

   //   cBody.addElement("<script type='text/javascript'>$(document).ready(function(){$('#tabella').chromatable({width: \"99%\", height: \"200px\",scrolling: \"yes\" });});</script>"); 
  //    cBody.addElement("<SCRIPT>AutomateExcel()</SCRIPT>");
		/*   classULHtmlObject cUL=null;
		 classLIHtmlObject cLI=null;
      
		 cUL = new classULHtmlObject();
		 cUL.addAttribute("id", "navExcel");
		 cLI = new classLIHtmlObject(false);  
		 cLI.appendSome("<a id='buttonExcel' href='javascript:AutomateExcel();'>Esporta in excel</a>");
		 cUL.appendSome(cLI);       
		 cBody.addElement(cUL.toString());
      
		 */
		cBody.setOnLoad("setVisible();");

		cBody.addElement("<script>disabilitaTastoDx()</script>");

		cDoc.setBody(cBody);
		sOut = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">" + cDoc.toString();

		return sOut;

	}

	private classHeadHtmlObject createHead() throws SqlQueryException, SQLException, Exception {
		return HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);
	}

	private String chkNull(String input) {
		if (input == null) {
			return "";
		} else {
			return input;
		}
	}

	private void readDati() {

		this.idPaziente = this.cParam.getParam("idPatient").trim();
		this.idReferto = this.cParam.getParam("idReferto").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
 //     this.daData = this.cParam.getParam("daData").trim();
		//     this.aData = this.cParam.getParam("aData").trim();
	}

	private String[] getDataIni() {
		String[] data = new String[2];
		ResultSet rsData = null;

		Statement stm = null;

		try {
			//   conn= new Connessione().getConnection(cContext);
			myPoolConnection = new getPoolConnection(cContext.getInitParameter("RegistryPoolName"), cContext.getInitParameter("RegistryUser"), cContext.getInitParameter("RegistryPwd"), cContext.getInitParameter("CryptType"));
			conn = myPoolConnection.getConnection();

			stm = conn.prepareStatement("select", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);

			String sql = "select distinct(to_char((to_date(data_prelievo,'yyyymmdd')-15),'yyyymmdd')) data_prelievo_ini,data_prelievo from risultati_lab where id_referto='" + idReferto + "' ";

			rsData = stm.executeQuery(sql);

			while (rsData.next()) {

				data[0] = rsData.getString("DATA_PRELIEVO_INI");
				data[1] = rsData.getString("DATA_PRELIEVO");

			}
		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				fDB.close(rsData);
				//		conn.close();
				myPoolConnection.chiudi(conn);
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}
		}
		return data;
	}

	public static String apici(String tmpVal) {
		tmpVal = tmpVal.replaceAll("'", "''");

		return tmpVal;
	}

}
