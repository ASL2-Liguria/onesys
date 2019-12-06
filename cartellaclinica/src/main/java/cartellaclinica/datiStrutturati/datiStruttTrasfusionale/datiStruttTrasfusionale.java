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
package cartellaclinica.datiStrutturati.datiStruttTrasfusionale;

import generic.servletEngine;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.CLOB;

import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import core.database.UtilityLobs;

public class datiStruttTrasfusionale extends servletEngine {
	private String idPaziente = new String("");

	private String nosologico = new String("");

	private String reparto = new String("");

	private String idenRichiesta = new String("");

	String URI;

	String uriSS;

	String MIMETYPE;

	Connection conn;

	String numRicIn = "";

	String htmlNumRichieste;

	String numRichieste = new String("");

	String intestazione = new String("");

	classFormHtmlObject cFormDati = null;

	classInputHtmlObject cInput = null;

	ArrayList<String> idenRichieste;

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(datiStruttTrasfusionale.class);

	classImgHtmlObject cImgGraf = null;

	String classTd = "";

	private functionDB fDB = null;

	ServletContext cContext;

	HttpServletRequest cRequest;

	HttpSession session = null;

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

	public datiStruttTrasfusionale(ServletContext cont, HttpServletRequest req) {
		super(cont, req);
		setBaseObject(true, true, true, true);
	}

	@Override
	public String getBody() {
		String sOut = new String("");

		classTableHtmlObject cTable = null;
		classTableHtmlObject datiTable = null;
		classTableHtmlObject leftTable = null;

		classRowDataTable cRow = null;
		classColDataTable cCol = null;
		classDivHtmlObject cDiv = null;
		classDivHtmlObject cDivMain = null;
		Iterator iterator = null;
		org.jdom.Document xml = null;
		ArrayList<String> alAnalisi = new ArrayList<String>();
		ArrayList<String> idenRichieste = new ArrayList<String>();
		int contCol = 0;
		String button[] = null;

		String confReparto = param("confReparto");
		if (confReparto == null || confReparto == "")

			try {
				readDati();
				htmlNumRichieste = getOptionRichieste();
				xml = getXml();

			} catch (Exception e) {
				BODY.setOnLoad("setVisible();");
				sOut = e.getMessage();
				logInterface.error(e.getMessage(), e);
			}

		// se l'xml è vuoto....o non ci sono richieste
		if (xml == null) {
			cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di laboratorio presente");
			sOut += cDiv.toString();
		}
		// altrimenti...
		else {

			// try {

			cFormDati = new classFormHtmlObject("formDati", "", "");
			cInput = new classInputHtmlObject("hidden", "numRichieste", htmlNumRichieste);
			cFormDati.appendSome(cInput);

			Element datiConf = xml.getRootElement().getChild("DATICONF");
			cInput = new classInputHtmlObject("hidden", "dataMinima", datiConf.getChildText("DATAMINIMA"));
			cFormDati.appendSome(cInput);
			cInput = new classInputHtmlObject("hidden", "codProRep", datiConf.getChildText("COD_PRO_REP"));
			cFormDati.appendSome(cInput);

			Element datiAnag = datiConf.getChild("DATIANAG");
			if (datiAnag != null) {
				cInput = new classInputHtmlObject("hidden", "cognome", datiAnag.getAttributeValue("COGNOME"));
				cFormDati.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "nome", datiAnag.getAttributeValue("NOME"));
				cFormDati.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "codfisc", datiAnag.getAttributeValue("CODFISC"));
				cFormDati.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "sesso", datiAnag.getAttributeValue("SESSO"));
				cFormDati.appendSome(cInput);
				cInput = new classInputHtmlObject("hidden", "datanasc", datiAnag.getAttributeValue("DATANASC"));
				cFormDati.appendSome(cInput);

				if (intestazione.equals("S")) {
					sOut += "<div class=header><div class='btn chiudi' onClick='self.close();' title='Chiudi'></div></div><div class='intestazione'><label id='lblIntestazioneMain'>" + datiAnag.getAttributeValue("COGNOME") + " " + datiAnag.getAttributeValue("NOME") + " " + datiAnag.getAttributeValue("DATANASC") + "</label></div>";
				}
			} else {
				if (intestazione.equals("S")) {
					sOut += "<div class=header><div class='btn chiudi' onClick='self.close();' title='Chiudi'></div></div><div class='intestazione'></div>";
				}

			}

			sOut += cFormDati.toString();

			if (!xml.getRootElement().getChild("ANALISI").getChildren().iterator().hasNext()) {
				cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di trasfusionale presente");
				sOut += cDiv.toString();
			}
			// altrimenti...
			else {

				cDivMain = new classDivHtmlObject("divMain");
				cDiv = new classDivHtmlObject("divMenu");
				try {
					button = checkButton();
					// cDiv.appendSome(cUL.toString());
					if (button[0].equals("S")) {
						// cDiv.appendSome("<SPAN class=pulsanteLabWhale onclick=AutomateExcel();><A href=\"#\">Esporta in excel</A></SPAN>");
						cDiv.appendSome("<SPAN class=pulsanteLabWhale><A href=javascript:AutomateExcel();>Esporta in excel</A></SPAN>");

					}
					if (button[1].equals("S")) {
						// cDiv.appendSome("<SPAN class=pulsanteLabWhale onclick=esportaPdf(\""+reparto+"\",\""+nosologico+"\",\""+idenRichiesta+"\",\"\",\""+bReparti.getValue(reparto,"orientamentoStampaDatiLabo")+"\");><A href=\"#\">Esporta in pdf</A></SPAN>");
						cDiv.appendSome("<SPAN class=pulsanteLabWhale><A href=javascript:esportaPdf(\"" + reparto + "\",\"" + nosologico + "\",\"" + idenRichiesta + "\",\"\",\"" + bReparti.getValue(reparto, "orientamentoStampaDatiLabo") + "\",\"" + idPaziente + "\",\"" + numRichieste + "\");>Esporta in pdf</A></SPAN>");

					}
					sOut += cDiv.toString();

					cDiv = new classDivHtmlObject("divOption");
					// cTable = new classTableHtmlObject();

					// htmlNumRichieste=getOptionRichieste();

					// se è attivo il filtro delle richieste e
					if (!htmlNumRichieste.equals("")) {
						cDiv.appendSome("<DIV class=divOptionSelect><SPAN  class=thLabel><label>N° rich. visualizzate:</label></SPAN><SPAN  class=thSelect>" + htmlNumRichieste + "</SPAN></DIV><DIV class=divOptionAgg><SPAN class=pulsanteLabWhaleAgg><A href=javascript:aggiornaDatiStrut(\"" + reparto + "\",\"" + nosologico + "\",\"" + idPaziente + "\")>Aggiorna</A></SPAN></DIV>");
					}

					if (idenRichiesta.equals(""))
						cDiv.appendSome("<DIV title=\"Inserimento Richieste\" class=pulsWkRich onclick=top.inserisciRichiestaConsulenza();><A href=\"#\"></A></DIV>");

					sOut += cDiv.toString();

					cTable = new classTableHtmlObject();
					cTable.addAttribute("id", "tabellaBloc");

					cRow = new classRowDataTable();
					// mi carico i nosologici per la chiamata (mi seviranno per
					// andare a filtrare nella query dei grafici)

					Element itemNos = xml.getRootElement().getChild("NOSOLOGICI");

					// div di intestazion bloccato in alto a sinistra
					// ------------------------------------------

					// a inizio riga aggiungo una colonna contenente icona
					// identificante possibilità elaborare grafico

					/*
					 * cCol= new classColDataTable("TH","","<BR>");
					 * cCol.addAttribute("class", "colGrafInt");
					 * cRow.addCol(cCol);
					 */

					cCol = new classColDataTable("TH", "", "ESAME<BR>");
					cCol.addAttribute("class", "colEsameInt");

					cRow.addCol(cCol);

					cCol = new classColDataTable("TH", "", "V.MIN<BR>");
					cCol.addAttribute("class", "colValMinInt");
					cRow.addCol(cCol);
					cCol = new classColDataTable("TH", "", "V.MAX<BR>");
					cCol.addAttribute("class", "colValMaxInt");
					cRow.addCol(cCol);
					if (button.length > 2 && button[2] != null && button[2].equals("S")) {
						cCol = new classColDataTable("TH", "", "U.M.<BR>");
						cCol.addAttribute("class", "colUnMisInt");
						cRow.addCol(cCol);
					}
					cTable.appendSome(cRow.toString());
					cDiv = new classDivHtmlObject("divBloc");
					cDiv.appendSome(cTable);
					// cBody.addElement(cDiv.toString());
					cDivMain.appendSome(cDiv.toString());

					// fine div di intestazion bloccato in alto a sinistra
					// ------------------------------------------

					// div di intestazione delle richieste
					// ------------------------------------------------------
					contCol = 5;

					cTable = new classTableHtmlObject();
					cTable.addAttribute("id", "tabellaInt");
					cRow = new classRowDataTable();
					iterator = xml.getRootElement().getChild("ANALISI").getChildren().iterator();
					while (iterator.hasNext()) {
						Element item = (Element) iterator.next();
						alAnalisi.add(item.getName());

						idenRichieste.add(item.getAttributeValue("IDEN_RICHIESTA"));

						cCol = new classColDataTable("TD", "", item.getAttributeValue("data").substring(6, 8) + "/" + item.getAttributeValue("data").substring(4, 6) + "/" + item.getAttributeValue("data").substring(0, 4) + "<BR>" + item.getAttributeValue("ora"));

						cCol.addAttribute("class", "tdInt");
						cCol.addAttribute("IDEN_RICHIESTA", item.getAttributeValue("IDEN_RICHIESTA"));
						cCol.addAttribute("DESCRPROV", item.getAttributeValue("descrprov"));
						cRow.addCol(cCol);
						contCol += 1;

					}
					cTable.appendSome(cRow.toString());

					cDiv = new classDivHtmlObject("divInt");
					cTable.addAttribute("width", String.valueOf(alAnalisi.size() * 100) + "px");
					cDiv.appendSome(cTable.toString());
					cDivMain.appendSome(cDiv.toString());

					// cBody.addElement(cDiv.toString());

					// fine div di intestazione delle
					// richieste-------------------------------------------------------------------

				} catch (Exception e) {
					BODY.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}

				// --------------------------------------

				// mi carico le righe della tabella

				datiTable = new classTableHtmlObject();
				datiTable.addAttribute("id", "datiTable");

				leftTable = new classTableHtmlObject();
				leftTable.addAttribute("id", "tabellaLeft");

				try {

					// ciclo i gruppi presenti
					Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();
					while (iterGruppi.hasNext()) {

						// aggiungo la riga di descrizione del gruppo al div di
						// sinistra

						// ---------------
						Element itemGruppo = (Element) iterGruppi.next();
						// if(itemGruppo.getAttributeValue("COD_GRUPPO").equals("1")){
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")) {
							cCol = new classColDataTable("TD", "", itemGruppo.getAttributeValue("DESCR_GRUPPO"));
							cCol.addAttribute("class", "tdGruppo");
						} else
							cCol = new classColDataTable("TD", "", "&nbsp");
						cCol.addAttribute("colspan", String.valueOf(6));
						cRow.addCol(cCol);
						leftTable.appendSome(cRow.toString());

						// aggiungo una riga vuota per l'intestazione del gruppo
						// al div dei dati

						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						cCol = new classColDataTable("TD", "", "&nbsp");
						cCol.addAttribute("colspan", String.valueOf(contCol));
						cRow.addCol(cCol);
						datiTable.appendSome(cRow.toString());
						// }
						// ------------------

						// ciclo tutti gli esami presenti per ogni singolo
						// gruppo
						iterator = itemGruppo.getChildren().iterator();
						while (iterator.hasNext()) {
							cRow = new classRowDataTable();

							Element itemEsame = (Element) iterator.next();

							cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("descr"));
							cCol.addAttribute("class", "colEsame");
							cRow.addCol(cCol);

							cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("VALORERIFMIN"));
							cCol.addAttribute("class", "colValMin");
							cRow.addCol(cCol);
							cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("VALORERIFMAX"));
							cCol.addAttribute("class", "colValMax");
							cRow.addCol(cCol);
							if (button.length > 2 && button[2] != null && button[2].equals("S")) {
								cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("UNMISURA"));
								cCol.addAttribute("class", "colUnMis");
								cRow.addCol(cCol);
							}
							leftTable.appendSome(cRow.toString());

							// per ogni esame ciclo l'elenco delle richieste
							// ...creo una nuova riga e la inserisco nel div dei
							// dati
							cRow = new classRowDataTable();
							for (int i = 0; i < alAnalisi.size(); i++) {
								Element itemRichiesta = itemEsame.getChild(alAnalisi.get(i));

								classTd = "";
								// se è presente la richiesta per lo specifico
								// esame inserisco il risultato nella colonna
								// specifica
								if (itemRichiesta != null) {
									cCol = new classColDataTable("TD", "", itemRichiesta.getValue());
									cCol.addAttribute("title", itemRichiesta.getAttributeValue("NOTA"));

									if (itemRichiesta.getAttributeValue("NOTA") != null && !itemRichiesta.getAttributeValue("NOTA").equals(""))
										classTd = " classTitle ";

									if (itemRichiesta.getAttributeValue("COLORE") != null && !itemRichiesta.getAttributeValue("COLORE").equals("")) {

										if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")) {
											cCol.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD; ");
										}

										else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")) {

											cCol.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD; ");
										}
									}

									if (classTd.equals(""))
										classTd = "colDati";
									else
										classTd += ",colDati";

									if (!classTd.equals(""))
										cCol.addAttribute("class", classTd);
									cRow.addCol(cCol);
								}
								// altrimenti inserisco una cella vuota
								else {
									cCol = new classColDataTable("TD", "", "&nbsp");
									if (classTd.equals(""))
										classTd = "colDati";
									else
										classTd += ",colDati";

									if (!classTd.equals(""))
										cCol.addAttribute("class", classTd);
									cRow.addCol(cCol);
								}
							}

							datiTable.appendSome(cRow.toString());

						}
					}

				}

				catch (Exception e) {
					BODY.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}

				cDiv = new classDivHtmlObject("divLeft");
				cDiv.appendSome(leftTable.toString());
				// cBody.addElement(cDiv.toString());
				cDivMain.appendSome(cDiv.toString());

				cDiv = new classDivHtmlObject("divDati");
				datiTable.addAttribute("width", String.valueOf(alAnalisi.size() * 100) + "px");
				cDiv.appendSome(datiTable.toString());

				cDiv.addEvent("onScroll", "javascript:divInt.scrollLeft=divDati.scrollLeft;divLeft.scrollTop=divDati.scrollTop;");

				// cBody.addElement(cDiv.toString());
				cDivMain.appendSome(cDiv.toString());

				sOut += cDivMain.toString();

				BODY.setOnLoad("setVisible();");
				BODY.setOnLoad("calcolaDimensioni();");

			}

			// per mettere un'allerta su whale solo se mi trovo nella wk dei
			// ricoverati
			/*
			 * if (idenRichiesta.equals(""))
			 * controllaDocumentiVisionati(idenRichieste);
			 */
		}

		return sOut;

	}

	private void readDati() {

		this.idPaziente = this.cParam.getParam("idPatient").trim();
		this.reparto = this.cParam.getParam("reparto").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
		this.idenRichiesta = this.cParam.getParam("idenRichiesta").trim();
		this.numRichieste = this.cParam.getParam("numRichieste").trim();
		this.intestazione = this.cParam.getParam("intestazione").trim();
		
	}

	public org.jdom.Document getXml() throws SQLException, SqlQueryException {
		String sStat = new String("");
		OracleCallableStatement cs = null;
		CLOB myLob=null;

		// String clobIn;
		org.jdom.Document docXml = null;

		baseUser utente = super.fDB.bUtente;
		ArrayList listaReparti = utente.listaReparti;

		if (reparto != null && reparto.equals(""))
			reparto = (String) listaReparti.get(0);

		// se non è riconducibile a un numero lo metto vuoto
		try {
			Integer.parseInt(numRichieste);
		} catch (Exception e) {
			numRichieste = "";
		}

		try {

			sStat = "{ call CC_GET_XML_TRASFUSIONALE(?, ?, ?, ?, ?, ?, ?) }";
			cs = (OracleCallableStatement) super.fDB.getConnectData().prepareCall(sStat);

			cs.setString(1, reparto);
			cs.setString(2, nosologico);
			cs.setString(3, idenRichiesta);
			cs.setString(4, idPaziente);
			cs.setString(5, numRichieste);
			cs.registerOutParameter(6, Types.CLOB);
			cs.registerOutParameter(7, Types.VARCHAR);

			cs.executeUpdate();

			myLob = cs.getCLOB(6);

			InputStream is = myLob.getAsciiStream();

			String error = cs.getString(7);

			if (error != null && !error.equals("")) {

				throw new Exception(error);

			}

			// ---------------------
			// ---------------------------------------------

			/*
			 * if (is != null) { Writer writer = new StringWriter(); char[]
			 * buffer = new char[1024]; try { Reader reader = new
			 * BufferedReader( new InputStreamReader(is, "UTF-8")); int n; while
			 * ((n = reader.read(buffer)) != -1) { writer.write(buffer, 0, n); }
			 * } finally { is.close(); } writer.toString(); } else { }
			 */
			// ---------------------
			// ---------------------------------------------

			SAXBuilder builder = new SAXBuilder();
			// docXml = builder.build(is) ;
			docXml = builder.build(new InputStreamReader(is, "ISO-8859-1"));

		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				cs.close();
				cs = null;
                UtilityLobs.freeClob(myLob);
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}
		}
		return docXml;

	}

	public void controllaDocumentiVisionati(ArrayList<String> idenRich) {

		String sStat = new String("");
		CallableStatement cs = null;

		try {
			Array oraIdenRichieste = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_VALUE", this.fDB.getConnectData()), this.fDB.getConnectData(), idenRich.toArray());

			baseUser utente = this.fDB.bUtente;

			sStat = "{ call CC_LABO_CONFERMA_LETTURA(?, ?, ?) }";
			cs = this.fDB.getConnectData().prepareCall(sStat);

			cs.setInt(1, utente.iden_per);
			cs.setArray(2, oraIdenRichieste);
			cs.registerOutParameter(3, Types.VARCHAR);
			cs.executeUpdate();
			String error = cs.getString(3);

			if (error != null && !error.equals("")) {

				throw new Exception(error);

			}

		} catch (Exception e) {
			logInterface.error(e.getMessage(), e);
		} finally {
			try {
				cs.close();
				cs = null;
			} catch (SQLException e) {
				logInterface.error(e.getMessage(), e);
			}

		}

	}

	public String getOptionRichieste() throws Exception {
		String htmlOut = "";
		String outVal = "";

		// se mi viene passata la singola richiesta e non il nosologico non
		// metto in ogni caso il filtro richieste
		if (idenRichiesta.equals("")) {
			htmlOut = "<select name='selectRichieste'>";
			outVal = bReparti.getValue(reparto, "VISUALIZZATORE_NUM_RICH_TR");

			String[] valori = new String[2];
			if (outVal != null && !outVal.equals("")) {
				valori = outVal.split("#");

				String[] temp = valori[0].split(",");

				// se non è settato il parametro nella chiamata della servlet
				if (numRichieste == null || numRichieste.equals("")) {
					if (valori.length > 1) {
						numRicIn = valori[1];
						numRichieste = valori[1];
					} else
					// se non è presente il valore iniziale lo setto con il più
					// basso dei valori
					{
						numRicIn = temp[0];
						numRichieste = temp[0];
					}
				} else
					numRicIn = numRichieste;

				for (int i = 0; i < temp.length; i++)
					if (temp[i].equals(numRicIn)) {
						htmlOut += "<option value='" + temp[i] + "' SELECTED>" + temp[i] + "</option>";
					} else {
						htmlOut += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
					}
				htmlOut += "</select>";

				// se non è presente il valore iniziale lo setto con il più
				// basso dei valori

				if (numRicIn.equals("")) {
					numRicIn = temp[0];
				}
			} else {
				htmlOut = "";
			}
		}
		return htmlOut;
	}

	public String[] checkButton() throws SQLException, Exception {

		String result[] = { "S", "N", "N" };
		String outVal = "";

		outVal = bReparti.getValue(reparto, "VISUALIZZATORE_BUTTON_LABO_TR");

		String[] valori = new String[3];
		if (outVal != null && !outVal.equals("")) {
			valori = outVal.split("#");
			if (valori.length > 0) {
				result[0] = valori[0];
			}
			if (valori.length > 1) {
				result[1] = valori[1];
			}
			if (valori.length > 2) {
				result[2] = valori[2];
			}
		}

		return result;

	}

	public static String apici(String tmpVal) {
		tmpVal = tmpVal.replaceAll("'", "''");

		return tmpVal;
	}

	@Override
	protected String getBottomScript() {
		return "<script>disabilitaTastoDx();</script><script>setAltezzaCol();</script>";
	}

	@Override
	protected String getTitle() {
		return "";
	}
}
