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
package cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLabWhale;

import generic.utility.html.HeaderUtils;
import imago.http.classColDataTable;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classImgHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.CLOB;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLab.listDocumentLabEngine;
import core.database.UtilityLobs;

public class listDocumentLabEngineWhale extends functionObj {

	// functionObj - servletEngine

	private String idPaziente = new String("");
	private String idReferto = new String("");
	private String nosologico = new String("");
	private String daData = new String("");
	private String aData = new String("");
	private String idAccettazione = new String("");
	private String elencoEsami = new String("");
	private String idRichiestaWhale = new String("");
	private String reparto = new String("");
	private String idenRichiesta = new String("");
	private String orientamentoStampa = new String("");
	private String gruppi = new String("");
	private String esami = new String("");
	private String codEsami = new String("");

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

	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(listDocumentLabEngine.class);

	classImgHtmlObject cImgGraf = null;

	String classTd = "";
	String datiPs[] = null;

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

	/**
	 * contiene le coppie name§value per filtrare i documenti
	 */

	public listDocumentLabEngineWhale(ServletContext cont, HttpServletRequest req, HttpSession sess) {

		super(cont, req, sess);
		fDB = new functionDB(this);
		cContext = cont;
		cRequest = req;
		session = sess;
		bReparti = super.bReparti;//Global.getReparti(hSessione);//(baseReparti) hSessione.getAttribute("baseReparti");

	}

	public listDocumentLabEngineWhale(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));

	}

	public String gestione() {

		String sOut = new String("");
		Document cDoc = new Document();
		Body cBody = new Body();
		classTableHtmlObject cTable = null;
		classTableHtmlObject datiTable = null;
		classTableHtmlObject leftTable = null;

		classRowDataTable cRow = null;
		classColDataTable cCol = null;

		classDivHtmlObject cDiv = null;
		classDivHtmlObject cDiv2 = null;
		classDivHtmlObject cDiv3 = null;
		classDivHtmlObject cDivMain = null;

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
		Iterator iterator = null;
		org.jdom.Document xml = null;
		ArrayList<String> alAnalisi = new ArrayList<String>();
		ArrayList<String> idenRichieste = new ArrayList<String>();
		String nosologici = "";
		int contCol = 0;
		String button[] = null;
		String classCss;

		String confReparto = cRequest.getParameter("confReparto");
		if (confReparto == null) {
			try {
				readDati();
				datiPs = checkRisultatiPs();
				htmlNumRichieste = "";
				// htmlNumRichieste	= getOptionRichieste();
				xml = getXml();

				cDoc.appendHead(this.createHead());

			} catch (Exception e) {
				cBody.setOnLoad("setVisible();");
				sOut = e.getMessage();
				logInterface.error(e.getMessage(), e);
			}
		}

		// se l'xml è vuoto
		if (xml == null) {
			cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di laboratorio presente");
			cBody.addElement(cDiv.toString());
		} else {
			// Creo Form Dati Generici
			cFormDati = new classFormHtmlObject("formDati", "", "");
			cInput = new classInputHtmlObject("hidden", "numRichieste", htmlNumRichieste);
			cFormDati.appendSome(cInput);
			cInput = new classInputHtmlObject("hidden", "datiPs", datiPs[0]);
			cFormDati.appendSome(cInput);
			cInput = new classInputHtmlObject("hidden", "datiPsGiorni", datiPs[1]);
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
					cBody.addElement("<div class=header><div class='btn chiudi' onClick='self.close();' title='Chiudi'></div></div><div class='intestazione'><label id='lblIntestazioneMain'>" + datiAnag.getAttributeValue("COGNOME") + " " + datiAnag.getAttributeValue("NOME") + " " + datiAnag.getAttributeValue("DATANASC") + "</label></div>");
				}
			} else {
				if (intestazione.equals("S")) {
					cBody.addElement("<div class=header><div class='btn chiudi' onClick='self.close();' title='Chiudi'></div></div><div class='intestazione'></div>");
				}

			}

			// Appendo Il Form Dato Generici
			cBody.addElement(cFormDati.toString());

			if (!xml.getRootElement().getChild("ANALISI").getChildren().iterator().hasNext()) {
				cDiv = new classDivHtmlObject("divNull", "", "Nessun dato strutturato di laboratorio presente");
				cBody.addElement(cDiv.toString());
			} else {

				cDivMain = new classDivHtmlObject("divMain");
				cDiv = new classDivHtmlObject("divMenu");
				try {
					button = checkButton();
					if (button[0].equals("S")) {
						cDiv.appendSome("<SPAN id='expExcel' class='pulsanteLabWhale'><A href=javascript:AutomateExcel();>Esporta in excel</A></SPAN>");
					}
					if (button[1].equals("S")) {
						if (datiPs[0].equals("S") && idenRichiesta.equals("")) {
							cDiv.appendSome("<SPAN id='expPdf' class=pulsanteLabWhale><A href=javascript:esportaPdf(\"" + reparto + "\",\"" + nosologico + "\",\"" + idenRichiesta + "\",\"" + datiPs[1] + "\",\"" + bReparti.getValue(reparto, "orientamentoStampaDatiLabo") + "\",\"" + idPaziente + "\",\"" + numRichieste + "\");>Esporta in pdf</A></SPAN>");

						} else {
							//    cDiv.appendSome("<SPAN class=pulsanteLabWhale onclick=esportaPdf(\""+reparto+"\",\""+nosologico+"\",\""+idenRichiesta+"\",\"\",\""+bReparti.getValue(reparto,"orientamentoStampaDatiLabo")+"\");><A href=\"#\">Esporta in pdf</A></SPAN>");	  
							cDiv.appendSome("<SPAN class=pulsanteLabWhale><A href=javascript:esportaPdf(\"" + reparto + "\",\"" + nosologico + "\",\"" + idenRichiesta + "\",\"\",\"" + bReparti.getValue(reparto, "orientamentoStampaDatiLabo") + "\",\"" + idPaziente + "\",\"" + numRichieste + "\");>Esporta in pdf</A></SPAN>");

						}
					}
					cBody.addElement(cDiv.toString());
					cDiv = new classDivHtmlObject("divOption");
					//   cTable = new classTableHtmlObject();      
					//   htmlNumRichieste=getOptionRichieste(); 

					// se è attivo il filtro delle richieste e 
					if (!htmlNumRichieste.equals("")) {
						cDiv.appendSome("<DIV class=divOptionSelect><SPAN  class=thLabel><label>N° rich. visualizzate:</label></SPAN><SPAN  class=thSelect>" + htmlNumRichieste + "</SPAN></DIV><DIV class=divOptionAgg><SPAN class=pulsanteLabWhaleAgg><A href=javascript:aggiornaDatiStrut(\"" + reparto + "\",\"" + nosologico + "\",\"" + idPaziente + "\")>Aggiorna</A></SPAN></DIV>");
					}

					if (idenRichiesta.equals("")) {
						cDiv.appendSome("<DIV title=\"Inserimento Richieste\" class=pulsWkRich onclick=top.inserisciRichiestaConsulenza();><A href=\"#\"></A></DIV>");
					}
					cBody.addElement(cDiv.toString());

					cTable = new classTableHtmlObject();
					cTable.addAttribute("id", "tabellaBloc");

					cRow = new classRowDataTable();
						// mi carico i nosologici per la chiamata (mi seviranno per andare a filtrare nella query dei grafici) 

					Element itemNos = xml.getRootElement().getChild("NOSOLOGICI");
					nosologici = itemNos.getValue();

						// 	div di intestazion bloccato in alto a sinistra ------------------------------------------      
					//  a inizio riga aggiungo una colonna contenente icona identificante possibilità elaborare grafico
					cCol = new classColDataTable("TH", "", "<div id=\"divAddRisultato\"></div>");
					cCol.addAttribute("class", "colGrafInt colIntestazione");
					cRow.addCol(cCol);

					cCol = new classColDataTable("TH", "", "<label>ESAME</label>");
					cCol.addAttribute("class", "colEsameInt colIntestazione");

					cRow.addCol(cCol);

					cCol = new classColDataTable("TH", "", "<label>V.MIN</label>");
					cCol.addAttribute("class", "colValMinInt colIntestazione");
					cRow.addCol(cCol);
					cCol = new classColDataTable("TH", "", "<label>V.MAX</label>");
					cCol.addAttribute("class", "colValMaxInt colIntestazione");
					cRow.addCol(cCol);

					if (button.length > 2 && button[2] != null && button[2].equals("S")) {
						cCol = new classColDataTable("TH", "", "<label>U.M.</label>");
						cCol.addAttribute("class", "colUnMisInt colIntestazione");
						cRow.addCol(cCol);
					}
					cTable.appendSome(cRow.toString());
					cDiv = new classDivHtmlObject("divBloc");
					cDiv.appendSome(cTable);

					cDivMain.appendSome(cDiv.toString());

					    // fine div di intestazion bloccato in alto a sinistra ------------------------------------------ 
					// 	div di intestazione delle richieste ------------------------------------------------------      
					contCol = 6;

					cTable = new classTableHtmlObject();
					cTable.addAttribute("id", "tabellaInt");
					cRow = new classRowDataTable();
					iterator = xml.getRootElement().getChild("ANALISI").getChildren().iterator();

					while (iterator.hasNext()) {
						Element item = (Element) iterator.next();
						alAnalisi.add(item.getName());
						if (item.getAttributeValue("tipo").equals("LAB")) {
							idenRichieste.add(item.getAttributeValue("IDEN_RICHIESTA"));
						}

						cCol = new classColDataTable("TD", "", item.getAttributeValue("data").substring(6, 8) + "/" + item.getAttributeValue("data").substring(4, 6) + "/" + item.getAttributeValue("data").substring(0, 4) + "<BR>" + item.getAttributeValue("ora"));

						if (item.getAttributeValue("codcdc").equals(reparto)) {
							classCss = "tdInt";
						} else {
							classCss = "tdIntAltriRep";
							//	  cCol.addAttribute("title",item.getAttributeValue("descrprov"));
						}
						if (item.getAttributeValue("tipo").equals("LAB")) {
							classCss += " link";
							cCol.addAttribute("onClick", "javascript:apriReferto(" + item.getAttributeValue("IDEN_RICHIESTA") + ")");
							cCol.addAttribute("title", "Apri documento");
						}
						cCol.addAttribute("class", classCss);
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

					    //	cBody.addElement(cDiv.toString());
					    //	fine div di intestazione delle richieste-------------------------------------------------------------------     
				} catch (Exception e) {
					cBody.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}

				//mi carico le righe della tabella
				datiTable = new classTableHtmlObject();
				datiTable.addAttribute("id", "datiTable");

				leftTable = new classTableHtmlObject();
				leftTable.addAttribute("id", "tabellaLeft");

				try {
					//ciclo i gruppi presenti
					Iterator iterGruppi = xml.getRootElement().getChild("ESAMI").getChildren().iterator();
					while (iterGruppi.hasNext()) {

						// aggiungo la riga di descrizione del gruppo al div di sinistra	
						Element itemGruppo = (Element) iterGruppi.next();
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						if (itemGruppo.getAttributeValue("DESCR_GRUPPO") != null && !itemGruppo.getAttributeValue("DESCR_GRUPPO").trim().equalsIgnoreCase("")) {
							cCol = new classColDataTable("TD", "", itemGruppo.getAttributeValue("DESCR_GRUPPO"));
							cCol.addAttribute("class", "tdGruppo");
						} else {
							cCol = new classColDataTable("TD", "", "&nbsp");
						}
						cCol.addAttribute("colspan", String.valueOf(6));
						cRow.addCol(cCol);
						leftTable.appendSome(cRow.toString());

						//aggiungo una riga vuota per l'intestazione del gruppo al div dei dati
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "rigaGruppo");
						cCol = new classColDataTable("TD", "", "&nbsp");
						cCol.addAttribute("colspan", String.valueOf(contCol));
						cRow.addCol(cCol);
						datiTable.appendSome(cRow.toString());

						/* 	cDiv = new classDivHtmlObject("TR");
						 cDiv2 = new classDivHtmlObject("TD","","");
						 cDiv.appendSome(cDiv2.toString());       		  
						 cDiv3.appendSome(cDiv.toString());	
						 */
						//ciclo tutti gli esami presenti per ogni singolo gruppo   	  
						iterator = itemGruppo.getChildren().iterator();
						while (iterator.hasNext()) {

							cRow = new classRowDataTable();
							Element itemEsame = (Element) iterator.next();
							// cRow.addAttribute("onClick","javascript:trClick(this,\"listDocumentLab\");");

							//aggiungo come prima colonna l'icona dell'apertura grafico, poi la descrizione, i valori di riferimento...tutti nel div di sinistra
							cCol = new classColDataTable("TD", "", "");
							cCol.addAttribute("class", "colGraf");
							cCol.addAttribute("onClick", "javascript:grafLabWhale(this);");
							if (itemEsame.getAttributeValue("CODICEESA") != null && !itemEsame.getAttributeValue("CODICEESA").equalsIgnoreCase("")) {
								cCol.addAttribute("codiceEsame", itemEsame.getAttributeValue("CODICEESA"));
							} else {
								cCol.addAttribute("codiceEsame", itemEsame.getName().substring(5, itemEsame.getName().length()));
							}

							//se magari mi viene passata solo la richiesta il grafico non serve
							cCol.addAttribute("idenRichiesta", idenRichiesta);
							cCol.addAttribute("elencoNosologici", nosologici);
							cCol.addAttribute("idPaziente", idPaziente);
							cCol.addAttribute("materiale", chkNull(itemEsame.getAttributeValue("CODICE_MATERIALE")));
							cCol.addAttribute("provenienza", chkNull(itemEsame.getAttributeValue("PROVENIENZA")));
							classDivHtmlObject grafDiv = new classDivHtmlObject("", "", "&nbsp");
							grafDiv.addAttribute("class", "imageGraf");
							cCol.appendSome(grafDiv.toString());

							cRow.addCol(cCol);

							cCol = new classColDataTable("TD", "", itemEsame.getAttributeValue("descr") + " " + chkNull(itemEsame.getAttributeValue("MATERIALE")) + " " + chkNull(itemEsame.getAttributeValue("PROVENIENZA")));
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

							//per ogni esame ciclo l'elenco delle richieste ...creo una nuova riga e la inserisco nel div dei dati
							cRow = new classRowDataTable();
							for (int i = 0; i < alAnalisi.size(); i++) {
								Element itemRichiesta = itemEsame.getChild(alAnalisi.get(i));

								classTd = "";
								//se è presente la richiesta per lo specifico esame inserisco il risultato nella colonna specifica
								if (itemRichiesta != null) {
									cCol = new classColDataTable("TD", "", itemRichiesta.getValue());
									cCol.addAttribute("title", itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO"));
									cCol.addAttribute("GERMI", chkNull(itemRichiesta.getAttributeValue("GERMI")));
									cCol.addAttribute("RICHIESTA", chkNull(itemRichiesta.getAttributeValue("IDEN_RICHIESTA")));
									cCol.addAttribute("PROGRANALISI", chkNull(itemRichiesta.getAttributeValue("PROGRANALISI")));
									cCol.addAttribute("PROGRANALISIPR", chkNull(itemRichiesta.getAttributeValue("PROGRANALISIPR")));

									if (itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO") != null && !itemRichiesta.getAttributeValue("RISULTATOESAMELUNGO").equals("")) {
										classTd = " classTitle ";
									}

									if (itemRichiesta.getAttributeValue("COLORE") != null && !itemRichiesta.getAttributeValue("COLORE").equals("")) {

										if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("BLUE")) {

											if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
												cCol.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
											} else {
												cCol.addAttribute("style", "COLOR:blue; FONT-WEIGHT:BOLD; ");
											}
										} else if (itemRichiesta.getAttributeValue("COLORE").equalsIgnoreCase("RED")) {

											if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
												cCol.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD;  background:#DCE0E0;");
											} else {
												cCol.addAttribute("style", "COLOR:red; FONT-WEIGHT:BOLD; ");
											}
										}
									} else if (!itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
										cCol.addAttribute("style", "background:#DCE0E0;");
									}

									if (itemRichiesta.getAttributeValue("RICHIESTA_VALIDATA").equalsIgnoreCase("8")) {
										if (classTd.equals("")) {
											classTd = "colDati";
										} else {
											classTd += " colDati";
										}
									}

									if (!itemRichiesta.getAttributeValue("GERMI").equalsIgnoreCase("0")) {
										if (classTd.equals("")) {
											classTd = "datiMicrobiologia";
										} else {
											classTd += " datiMicrobiologia";
										}
									}

									if (!classTd.equals("")) {
										cCol.addAttribute("class", classTd);
									}

									cRow.addCol(cCol);
								} else {
									// altrimenti inserisco una cella vuota
									cCol = new classColDataTable("TD", "", "&nbsp");
									if (classTd.equals("")) {
										classTd = "colDati";
									} else {
										classTd += " colDati";
									}

									if (!classTd.equals("")) {
										cCol.addAttribute("class", classTd);
									}

									cRow.addCol(cCol);
								}
							}

							datiTable.appendSome(cRow.toString());

						}
					}

				} catch (Exception e) {
					cBody.setOnLoad("setVisible();");
					sOut = e.getMessage();
					logInterface.error(e.getMessage(), e);
				}

				cDiv = new classDivHtmlObject("divLeft");
				cDiv.appendSome(leftTable.toString());
				//   cBody.addElement(cDiv.toString());
				cDivMain.appendSome(cDiv.toString());

				cDiv = new classDivHtmlObject("divDati");
				datiTable.addAttribute("width", String.valueOf(alAnalisi.size() * 100) + "px");
				cDiv.appendSome(datiTable.toString());

				cDiv.addEvent("onScroll", "javascript:divInt.scrollLeft=divDati.scrollLeft;divLeft.scrollTop=divDati.scrollTop;");

				//  cBody.addElement(cDiv.toString());
				cDivMain.appendSome(cDiv.toString());

				cBody.addElement(cDivMain.toString());

				cBody.setOnLoad("setVisible();");

				cBody.addElement("<script>disabilitaTastoDx();</script>");
				cBody.setOnLoad("calcolaDimensioni();");

				cBody.addElement("<script>setAltezzaCol();</script>");

			}

			// per mettere un'allerta su whale solo se mi trovo nella wk dei ricoverati
			if (idenRichiesta.equals("")) {
				controllaDocumentiVisionati(idenRichieste);
			}

		}

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
		this.idAccettazione = this.cParam.getParam("idAccettazione").trim();
		this.elencoEsami = this.cParam.getParam("elencoEsami").trim();
		//      this.nosologico = this.cParam.getParam("nosologico").trim();     
		this.reparto = this.cParam.getParam("reparto").trim();
		this.nosologico = this.cParam.getParam("nosologico").trim();
		this.idenRichiesta = this.cParam.getParam("idenRichiesta").trim();
		this.gruppi = this.cParam.getParam("gruppi").trim();
		this.esami = this.cParam.getParam("esami").trim();
		this.codEsami = this.cParam.getParam("codEsami").trim();
		this.numRichieste = this.cParam.getParam("numRichieste").trim();
		this.intestazione = this.cParam.getParam("intestazione").trim();

		this.aData = this.cParam.getParam("aData").trim();
		this.daData = this.cParam.getParam("daData").trim();

		this.idRichiestaWhale = this.cParam.getParam("idRichiestaWhale").trim();
	}

	public org.jdom.Document getXml() throws SQLException, SqlQueryException {

		String sStat = new String("");
		OracleCallableStatement cs = null;

		org.jdom.Document docXml = null;
		String repartiUtente = "";

		baseUser utente = this.fDB.bUtente;
		ArrayList listaReparti = utente.listaReparti;
		String dsid = utente.description;
		String sa = utente.CDC_UTENTE;
		int num_ric;
		CLOB myLob = null;
		if (reparto != null && reparto.equals("")) {
			reparto = (String) listaReparti.get(0);
		}

		/*
		 // Il Numero di Richieste non Viene più Elaborato per la gestione del caso configurate
		 // Definisco il Numero di Richieste
		 try{
		 int a = Integer.parseInt(numRichieste);
		 }
		 catch(Exception e){
		 numRichieste="";
		 }
		 */
		try {

			sStat = "{ call CC_GET_XML_ESAMI_LABO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) }";
			cs = (OracleCallableStatement) this.fDB.getConnectData().prepareCall(sStat);

			cs.setString(1, reparto);
			cs.setString(2, nosologico);
			cs.setString(3, idenRichiesta);
			cs.setString(4, idPaziente);
			cs.setString(5, esami);
			cs.setString(6, codEsami);
			cs.setString(7, numRichieste);
			if (datiPs[0].equals("S") && idenRichiesta.equals("")) {
				cs.setString(8, datiPs[1]);
			} else {
				cs.setString(8, null);
			}
			if (intestazione.equals("S")) {
				cs.setString(9, intestazione);
			} else {
				cs.setString(9, null);
			}

			cs.setString(10, daData);
			cs.setString(11, aData);

			cs.registerOutParameter(12, Types.CLOB);
			cs.registerOutParameter(13, Types.VARCHAR);

			cs.executeUpdate();

			logInterface.warn("fine CC_GET_XML_ESAMI_LABO");

			myLob = cs.getCLOB(12);

			InputStream is = myLob.getAsciiStream();

			String error = cs.getString(13);

			if (error != null && !error.equals("")) {
				throw new Exception(error);
			}

			/*
			 if (is != null) {               
			 Writer writer = new StringWriter(); 
			 char[] buffer = new char[1024]; 
			 try {       	               
			 Reader reader = new BufferedReader(    	                      
			 new InputStreamReader(is, "UTF-8"));      	                
			 int n;                   
			 while ((n = reader.read(buffer)) != -1) {      	                   
			 writer.write(buffer, 0, n);      	                
			 }       	           
			 } finally {       	                
			 is.close();       	             
			 }       	          
			 writer.toString(); 
			 } else {           
			 }    */
			SAXBuilder builder = new SAXBuilder();
			//  	    docXml = builder.build(is) ;
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

	public String getOptionRichieste() {

		String htmlOut = "";
		String outVal = "";

	// se idenRichiesta non è null Non Creo la Select con il Numero delle Richieste
		// La Select delle Richieste è Stata Spostata nel Filtro della Cartella
		if (idenRichiesta.equals("")) {

			htmlOut = "<select name='selectRichieste'>";
			try {
				outVal = bReparti.getValue(reparto, "VISUALIZZATORE_NUM_RICH");
			} catch (Exception e) {
				logInterface.error("baseReparti getValue Error", e);
			} 

			String[] valori = new String[2];

			if (outVal != null && !outVal.equals("")) {

				valori = outVal.split("#");
				String[] temp = valori[0].split(",");

				// Se Non Viene Passato in Get il Numero delle Richieste Lo Prendo dalla Pagina (baseReparti) 
				if (numRichieste == null || numRichieste.equals("")) {

					if (valori.length > 1) {
						numRicIn = valori[1];
						numRichieste = valori[1];
					} else {
						// Se non esiste il Valore di default viene settato con il piu basso della Select
						numRicIn = temp[0];
						numRichieste = temp[0];
					}
				} else {
					numRicIn = numRichieste;
				}

				// Creo La Select
				for (int i = 0; i < temp.length; i++) {
					if (temp[i].equals(numRicIn)) {
						htmlOut += "<option value='" + temp[i] + "' SELECTED>" + temp[i] + "</option>";
					} else {
						htmlOut += "<option value='" + temp[i] + "'>" + temp[i] + "</option>";
					}
				}

				htmlOut += "</select>";

				//se non è presente il valore iniziale lo setto con il più basso dei valori		 
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

		String result[] = {"S", "S", "N"};
		String outVal = "";

		outVal = bReparti.getValue(reparto, "VISUALIZZATORE_BUTTON_LABO");

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

	public String[] checkRisultatiPs() throws SQLException, Exception {

		String result[] = {"N", "0"};
		String outVal = "";

		outVal = bReparti.getValue(reparto, "VISUALIZZATORE_DATI_PS");
		String[] valori = new String[2];
		if (outVal != null) {
			valori = outVal.split("#");
			if (valori.length > 0) {
				result[0] = valori[0];
			}
			if (valori.length > 1) {
				result[1] = valori[1];
			}

		}

		return result;

	}

	public static String apici(String tmpVal) {
		tmpVal = tmpVal.replaceAll("'", "''");

		return tmpVal;
	}

}
