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
package gestLettera;

import generic.utility.html.HeaderUtils;
import generatoreEngine.components.html.htmlIFrame;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classHeadHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Doctype;
import org.apache.ecs.Document;
import org.apache.ecs.html.Body;

import cartellaclinica.lettera.pckInfo.classInfoLettera;
import cartellaclinica.utils.gestBloccoFunzioni.controlloBlocco;
import configurazioneReparto.baseReparti;
 


public abstract class GestioneStrutturaBase extends functionObj 
{
	protected functionDB fDB 	= null;
	protected functionStr fStr 	= null;

	protected String idenVisita		= new String("");
	protected String idenVisitaRegistrazione= new String("");
	protected String idenRicovero	= new String("");
	protected String idenAnag 		= new String("");
	protected String reparto 	  	= new String("");
	protected String repartoDest 	= new String("");
	protected String ricovero 		= new String("");
	protected String funzione 		= new String("");
	protected String idenVersione 	= new String("");
	protected String readonly	  	= "N";
	protected String stato			= "";
	protected String attivo			= "";
	protected String iden_terapia_associata = "";
	
	protected String controlloAccesso = new String("");

	private String procSezioni 	= "";
	private String procInfo	 	= "";	
	private String procButton  	= "";	
	private String procFirma  	= "";	
	private String typeFirma	= "";
	baseReparti Reparto;

	protected ArrayList<classSezioneLettera> 	lstSezioni 	= new ArrayList<classSezioneLettera>();
	protected ArrayList<classInfoLettera> 		lstInfo 	= new ArrayList<classInfoLettera>();

	protected classDivHtmlObject divBottomBar = new classDivHtmlObject("footer");
	protected classDivHtmlObject divIntestazione = new classDivHtmlObject("divIntestazione");
	
	protected classFormHtmlObject formGesti = new classFormHtmlObject("frmGestionePagina","","POST","");
	protected classFormHtmlObject formFirma = new classFormHtmlObject("frmImpostazioniFirma","","POST","");

	
    protected ElcoLoggerInterface			logger	 = null;
	
	public GestioneStrutturaBase(ServletContext cont, HttpServletRequest req,HttpSession sess) 
	{
		super(cont, req, sess);
		fDB	 = new functionDB(this);
		fStr = new functionStr();
		Reparto = super.bReparti;//Global.getReparti(sess);
		this.logger			= new ElcoLoggerImpl(this.getClass().getName()+".class");
		
	}

	public GestioneStrutturaBase(ServletContext cont, HttpServletRequest req) 
	{
		this(cont, req, req.getSession(false));
	}	

	public String init()throws IllegalAccessException,InstantiationException, ClassNotFoundException,NumberFormatException
	{			
		this.logger.info("init - ReadDati");
		readDati();
		return gestione();
	}
	
	public String gestione() throws IllegalAccessException,InstantiationException, ClassNotFoundException,NumberFormatException 
	{	
		
		this.logger.info("gestione() -  creazione struttura pagina");
		String sOut = new String("");
		
		boolean show=true;
		int count=0;

		Document cDoc = new Document();
		cDoc.setDoctype(new Doctype.Html401Transitional());
		Body cBody = new Body();
		cBody.setID("idBody");
		cBody.addAttribute("onload","initGlobalObject();");
		cBody.addAttribute("onbeforeunload","unLock();");
		cBody.addAttribute("onselectstart","return false;");

		
		classDivHtmlObject divHeader = new classDivHtmlObject("divHeader");
		classDivHtmlObject divBody	 = new classDivHtmlObject("divBody");
		
		classDivHtmlObject headerLeft  = new classDivHtmlObject("headerLeft");
		classDivHtmlObject headerRight = new classDivHtmlObject("headerRight");

		classDivHtmlObject divSections = new classDivHtmlObject("sections");
		classDivHtmlObject divInfos    = new classDivHtmlObject("infos");
		classDivHtmlObject divFrame	 = new classDivHtmlObject("divFrame");		

		classULHtmlObject cUL = new classULHtmlObject();
		
		this.logger.info("gestione() -  compilazione pagina");
		try 
		{
			this.logger.info("gestione() -  controllo della pagina");
            if ("M".equalsIgnoreCase(super.bUtente.tipo)){
                controlloBlocco cb = new controlloBlocco(hSessione,"CC_LETTERA_VERSIONI",this.funzione,Integer.valueOf(idenVisita));
                if(cb.isLocked()){
                        cBody.addElement("<script>alert('" + cb.getMessage() +  "');</script>");
                        this.readonly = "S";
                }
            }
			
			this.logger.info("gestione() -  controllo idenVersione");
			this.checkVersione();
			this.logger.info("gestione() -  idenVersione:"+this.idenVersione);
			try
			{
				if(this.idenVersione.equals(""))
				{
					this.logger.info("gestione() -  lettura configurazione da tabella");
					this.readConfigurazioniSezioni();
				}
				else
				{
					this.logger.info("gestione() -  lettura configurazione da vista");
					this.loadConfigurazioneFromXml();
				}
			}catch (Exception e){
				e.printStackTrace();
				this.logger.info("gestione() -  errore lettura da tabella o da vista - "+e.getMessage());
			}
			this.logger.info("gestione() -  lettura configurazione info e button");			
			this.readConfigurazioniInfo();
			this.readConfigurazioniButton();			
			this.logger.info("gestione() -  inizio creazione pagina");	
			
			cDoc.appendHead(this.createHead());
			this.logger.info("gestione() -  aggiunta sezioni");			
			for(int i=0;i<lstSezioni.size();i++){
				if(show)
					cUL.appendSome("<li class=active><span onclick=\"javascript:showSection("+count+");\" ordine="+count+">"+lstSezioni.get(i).label+"</span></li>");
				else
					cUL.appendSome("<li><span onclick=\"javascript:showSection("+count+");\" ordine="+count+">"+lstSezioni.get(i).label+"</span></li>");

				divSections.appendSome(lstSezioni.get(i).toHTML(show));
				count++;
			}
			this.logger.info("gestione() -  fine aggiunta sezioni");
			cUL.addAttribute("id","tabSections");
			headerLeft.appendSome(cUL);

			cUL=new classULHtmlObject();
			show = true;
			count=0;
			this.logger.info("gestione() -  aggiunta info");	
			for(int i=0;i<lstInfo.size();i++){
				if(show)
					cUL.appendSome("<li class=active><span onclick=\"javascript:showInfo("+count+");\" ordine="+count+">"+lstInfo.get(i).label+"</span></li>");
				else
					cUL.appendSome("<li><span onclick=\"javascript:showInfo("+count+");\" ordine="+count+">"+lstInfo.get(i).label+"</span></li>");
				divInfos.appendSome(lstInfo.get(i).toHTML(show));
				show=false;
				count++;
			}
			this.logger.info("gestione() -  fine aggiunta info");
			cUL.addAttribute("id","tabInfos");
			headerRight.appendSome(cUL);

			divHeader.appendSome(headerLeft);
			divHeader.appendSome(headerRight);

			divBody.appendSome(divSections);
			divBody.appendSome(divInfos);

			htmlIFrame frameConsenso = new htmlIFrame();
			String src = "consenso.html?";
			src += "tabella=RADSQL.NOSOLOGICI_PAZIENTE";
			src += "&statement_to_load=loadConsensoEspressoDocumento";
			src += "&iden="+this.idenVisita;
			src += "&tipologia_documento="+this.funzione;			
			frameConsenso.setId("idFrameConsenso");
			frameConsenso.setSrc(src);
			divFrame.appendSome(frameConsenso.generateTagHtml());
			divBody.appendSome(divFrame);				
			
			cBody.addElement(divIntestazione.toString());
			cBody.addElement(divHeader.toString());
			cBody.addElement(divBody.toString());

			cBody.addElement(this.divBottomBar.toString());

			cBody.addElement(this.getForm());
	
			cDoc.setBody(cBody);
			sOut = cDoc.toString();
			this.logger.info("gestione() -  fine creazione pagina");
		}
		catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			this.logger.info("gestione() -  SQLQueryError " +sOut );
		}
		catch (SQLException ex) {
			sOut = ex.getMessage();
			this.logger.info("gestione() -  SQLError " +sOut);
		} catch (Exception ex) {
			sOut = ex.getMessage();
			this.logger.info("gestione() - Exception " + sOut);
		}


		return sOut;
	}

	/**
	 * Recupero Parametri dalla request
	 * 	idenVisita,idenAnag,reparto
	 *  ricovero(numero nosologico)
	 *  funzione(campo funzione di CONFIG_MENU_REPARTO)
	 *  idenVersione(iden di CC_LETTERA_VERSIONI)
	 */
	protected void readDati()
	{
		this.idenVisita 	= this.cParam.getParam("idenVisita").trim();
		this.idenVisitaRegistrazione 	= this.cParam.getParam("idenVisitaRegistrazione").trim();
		this.idenRicovero 	= this.cParam.getParam("idenRicovero").trim();
		if (this.idenVisita.equals("") == true)
			this.idenVisita = this.idenRicovero;
		this.idenAnag 		= this.cParam.getParam("idenAnag").trim();
		this.reparto 		= this.cParam.getParam("reparto").trim();
		this.repartoDest 	= this.cParam.getParam("repartoDest").trim();
		this.ricovero 		= this.cParam.getParam("ricovero").trim();
		this.funzione 		= this.cParam.getParam("funzione").trim();
		this.controlloAccesso = this.cParam.getParam("CONTROLLO_ACCESSO").trim();
	}

	/**
	 * Lettura configurazione lettera(sezioni di sinistra) dalla tabella di configurazione su cc_config_menu_reparto  
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected abstract void readConfigurazioniSezioni();

	/**
	 * Lettura configurazione lettera(sezioni di sinistra) da vista:
	 * 1) Refertazione Consulenze 	: VIEW_CC_CONSULENZE_SEZ
	 * 2) Lettera Dimissione		: VIEW_CC_LETTERA_SEZ_CLOB
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected abstract void loadConfigurazioneFromXml();
	
	/**
	 * Check Iden Versione:
	 * 1) Refertazione Consulenze: iden passato tramite request;
	 * 2) Lettera Dimissione: iden ricavato da select sulla tabella CC_LETTERA_VERSIONI; 
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected abstract void checkVersione();
	
	/**
	 * Lettura configurazione lettera INFO
	 * @throws SQLException
	 * @throws SqlQueryException
	 */  
	protected abstract void readConfigurazioniInfo(); 

	/**
	 * Lettura configurazione lettera BUTTON
	 * @throws SQLException
	 * @throws SqlQueryException
	 */ 	
	protected abstract void readConfigurazioniButton();
	
	private classHeadHtmlObject createHead()  throws SQLException, SqlQueryException, Exception 
	{
		this.logger.info("createHead() -  TAB_EXT_FILES");
		
		classHeadHtmlObject cHead = HeaderUtils.createHeadWithIncludesNoDefault(this.getClass().getName(), hSessione);

		cHead.addElement(classJsObject.javaClass2jsClass(this.bUtente));
		this.logger.info("createHead() -  Fine Aggiunta TAB_EXT_FILES");
		return cHead;

	}

	/**
	 * Creazione Form:
	 * form dati della pagina e form per la firma
	 */
	protected String getForm() throws Exception
	{
		this.logger.info("getForm() -  form di gestione");
		

		String strForms;

		this.formGesti.appendSome(new classInputHtmlObject("hidden","idenVisita",idenVisita));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","idenVisitaRegistrazione",idenVisitaRegistrazione));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","iden_terapia_associata",iden_terapia_associata));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","idenAnag"	,idenAnag));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","reparto"	,reparto));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","repartoDest"	,repartoDest));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","ricovero"	,ricovero));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","funzione"	,funzione));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","idenVersione",idenVersione));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","readonly"	,readonly));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","stato"		,stato));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","attivo"	,attivo));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","CONTROLLO_ACCESSO" ,controlloAccesso));
		
		this.logger.info("getForm() -  form di gestione della firma");
		
		strForms=this.formGesti.toString()+"\n";

		
		this.formFirma.appendSome(new classInputHtmlObject("hidden","idenVisita",idenVisita));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","idenVisitaRegistrazione",idenVisitaRegistrazione));		
		this.formFirma.appendSome(new classInputHtmlObject("hidden","whereReport",idenVisita));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","campoDaFiltrare","IDEN_VISITA"));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","typeProcedure",funzione));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","typeFirma",Reparto.getValue(this.reparto,getTypeFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","reparto",Reparto.getValue(this.reparto,getProcFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","repartoDest",Reparto.getValue(this.repartoDest,getProcFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","repartoDati",this.reparto));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","allegaDatiStr","N#"));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","idenAnag",idenAnag));

		this.logger.info("getForm() -  chiusura form gestione firma");		
		
		strForms+=this.formFirma.toString()+"\n";

		return "\n"+strForms;
	}



	protected String chkNull(String input){
		if (input==null)
			return "";
		else
			return input;
	}

	public void setProcSezioni(String procSezioni) {
		this.procSezioni = procSezioni;
	}

	public String getProcSezioni() {
		return procSezioni;
	}	
	
	public void setProcInfo(String procSezioni) {
		this.procInfo = procSezioni;
	}

	public String getProcInfo() {
		return procInfo;
	}
	public void setProcButton(String procSezioni) {
		this.procButton = procSezioni;
	}

	public String getProcButton() {
		return procButton;
	}
	
	public String getProcFirma() {
		return procFirma;
	}

	public void setProcFirma(String procFirma) {
		this.procFirma = procFirma;
	}

	public String getTypeFirma() {
		return typeFirma;
	}

	public void setTypeFirma(String typeFirma) {
		this.typeFirma = typeFirma;
	}




}
