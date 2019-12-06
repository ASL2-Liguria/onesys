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
package refertazioneConsulenze;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classDivHtmlObject;
import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;
import imago.http.classULHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.html.Body;

import cartellaclinica.lettera.classButton;
import cartellaclinica.lettera.pckInfo.classInfoLettera;
import cartellaclinica.utils.gestBloccoFunzioni.controlloBlocco;
import generatoreEngine.components.html.htmlIFrame;
public abstract class srvRefertazioneConsulenze extends servletEngine{
	protected HttpServletRequest request 	= null;

	protected String idenVisita		= "";
	protected String idenAnag 		= "";
	protected String reparto 	  	= "";
	protected String repartoDest 	= "";
	protected String ricovero 		= "";
	protected String funzione 		= "";
	protected String idenVersione 	= "";
	protected String readonly	  	= "N";
	protected String stato			= "";
	protected String attivo			= "";
	protected String idRemoto		= "";
	protected String tipo			= "";
	protected String idenTes		= "";
	protected String paziente		= "";
    protected String attributeUnLoad= "";

	private String procSezioni 	= "";
	private String procInfo	 	= "";
	private String procButton  	= "";
	private String procFirma  	= "";
	private String typeFirma  	= "";

	protected StatementFromFile sff;

	protected ArrayList<classSezioneRefertazione> 	lstSezioni;
	protected ArrayList<classInfoLettera> 		lstInfo;

	private classDivHtmlObject divBottomBar;

	protected classFormHtmlObject formGesti;
	protected classFormHtmlObject formFirma;

	public srvRefertazioneConsulenze(ServletContext pCont,HttpServletRequest pReq) throws Exception{
		super(pCont,pReq);
		this.request = pReq;
		this.setBaseObject(false, false, false, false);
		this.readDati();
		sff = getStatementFromFile();
        lstSezioni  	= new ArrayList<classSezioneRefertazione>();
        lstInfo 	= new ArrayList<classInfoLettera>();
        divBottomBar = new classDivHtmlObject("footer");
        formGesti = new classFormHtmlObject("frmGestionePagina","","POST","");
        formFirma = new classFormHtmlObject("frmImpostazioniFirma","","POST","");
	}

	@Override
	protected String getBody() {
		log.info("gestione() -  creazione struttura pagina");
		String sOut = new String("");

		boolean show=true;
		int count=0;

		Body cBody = new Body();
		cBody.setID("idBody");
		cBody.addAttribute("onload","initGlobalObject();");
		cBody.addAttribute("onbeforeunload",this.attributeUnLoad);
		cBody.addAttribute("onselectstart","return false;");

		classDivHtmlObject divIntestazione = new classDivHtmlObject("divIntestazione");
		classDivHtmlObject divHeader = new classDivHtmlObject("divHeader");
		classDivHtmlObject divBody	 = new classDivHtmlObject("divBody");
		classDivHtmlObject divFrame	 = new classDivHtmlObject("divFrame");
		
		classDivHtmlObject headerLeft  = new classDivHtmlObject("headerLeft");
		classDivHtmlObject headerRight = new classDivHtmlObject("headerRight");

		classDivHtmlObject divSections = new classDivHtmlObject("sections");
		classDivHtmlObject divInfos    = new classDivHtmlObject("infos");

		classULHtmlObject cUL = new classULHtmlObject();

		log.info("gestione() -  compilazione pagina");
		try
		{
			log.info("gestione() -  controllo della pagina");
			controlloBlocco cb = new controlloBlocco(hSessione,"CC_LETTERA_VERSIONI",this.funzione,Integer.valueOf(this.idenTes));
			if(cb.isLocked()){
				cBody.addElement("<script>alert('" + cb.getMessage() +  "');</script>");
				this.readonly = "S";
			}

			log.info("gestione() -  controllo idenVersione");
			this.checkVersione();
			log.info("gestione() -  idenVersione:"+this.idenVersione);
			try
			{
				if(this.idenVersione.equals(""))
				{
                    if ("VISITA_ANESTESIOLOGICA".equalsIgnoreCase(this.funzione)){
                        /*Cerco una visita precedente con referto associato allo stesso iden visita e carico al volo quello*/
                        if (!this.loadConfigurazioneFromDb(this.idenVisita,this.funzione)){
                            log.info("gestione() -  lettura configurazione da tabella");
                            this.readConfigurazioniSezioni();
                        }
                    }else{
                        log.info("gestione() -  lettura configurazione da tabella");
                        this.readConfigurazioniSezioni();
                    }
				}
				else
				{
					log.info("gestione() -  lettura configurazione da vista");
					this.loadConfigurazioneFromXml();
				}
			}catch (Exception e){
				e.printStackTrace();
				log.info("gestione() -  errore lettura da tabella o da vista - "+e.getMessage());
			}
			log.info("gestione() -  lettura configurazione info e button");
			this.readConfigurazioniInfoButton();

			log.info("gestione() -  inizio creazione pagina");

			for(int i=0;i<lstSezioni.size();i++){
				if(show)
					cUL.appendSome("<li class=active><span onClick=\"showSection(this.ordine);\" ordine="+count+">"+lstSezioni.get(i).getvLabel()+"</span></li>");
				else
					cUL.appendSome("<li><span onClick=\"showSection(this.ordine);\" ordine="+count+">"+lstSezioni.get(i).getvLabel()+"</span></li>");

				divSections.appendSome(lstSezioni.get(i).toHTML(show));
				count++;
			}

			cUL.addAttribute("id","tabSections");
			headerLeft.appendSome(cUL);

			cUL=new classULHtmlObject();
			show = true;
			count=0;

			for(int i=0;i<lstInfo.size();i++){
				if(show)
					cUL.appendSome("<li class=active><span  onClick=\"showInfo(this.ordine);\" ordine="+count+">"+lstInfo.get(i).label+"</span></li>");
				else
					cUL.appendSome("<li><span  onClick=\"showInfo(this.ordine);\" ordine="+count+">"+lstInfo.get(i).label+"</span></li>");
				try {
					divInfos.appendSome(lstInfo.get(i).toHTML(show));
				} catch (ClassNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (InstantiationException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				show=false;
				count++;
			}

			cUL.addAttribute("id","tabInfos");
			headerRight.appendSome(cUL);

            if ("CONSULENZE_REFERTAZIONE".equalsIgnoreCase(this.funzione) || "PRESA_IN_CARICO".equalsIgnoreCase(this.funzione)){
                divIntestazione.appendSome(getIntestazione());
            }

			divHeader.appendSome(headerLeft);
			divHeader.appendSome(headerRight);

			divBody.appendSome(divSections);
			divBody.appendSome(divInfos);

			cBody.addElement(divIntestazione.toString());
			cBody.addElement(divHeader.toString());
			
			htmlIFrame frameConsenso = new htmlIFrame();
			String src = "consenso.html?";
			src += "tabella=INFOWEB.TESTATA_RICHIESTE";
			src += "&statement_to_load=loadConsensoEspressoDocumento";
			src += "&iden="+this.idenTes;
			src += "&tipologia_documento="+this.funzione;			
			frameConsenso.setId("idFrameConsenso");
			frameConsenso.setSrc(src);			
			divFrame.appendSome(frameConsenso.generateTagHtml());
			divBody.appendSome(divFrame);

			cBody.addElement(divBody.toString());

			cBody.addElement(this.divBottomBar.toString());

			cBody.addElement(this.getForm());

			sOut = cBody.toString();
			log.info("gestione() -  fine creazione pagina");
		}
		catch (SqlQueryException ex) {
			sOut = ex.getMessage();
			log.error("gestione() -  SQLQueryError" +sOut );
		}
		catch (SQLException ex) {
			sOut = ex.getMessage();
			log.error("gestione() -  SQLError" +sOut);
		} 
		catch (Exception ex) {
			sOut = ex.getMessage();
			log.error("gestione() -  SQLError" +sOut);
		}


		return sOut;
	}

	@Override
	protected String getTitle() {
		// TODO Auto-generated method stub
		return "Consolle di Refertazione";
	}

	@Override
	protected String getBottomScript() {
		// TODO Auto-generated method stub
		return "";
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
		this.idenVisita 	= cParam.getParam("idenVisita").trim();
		this.idenAnag 		= cParam.getParam("idenAnag").trim();
		this.reparto 		= cParam.getParam("reparto").trim();
		this.repartoDest 	= cParam.getParam("repartoDest").trim();
		this.ricovero 		= cParam.getParam("ricovero").trim();
		this.funzione 		= cParam.getParam("funzione").trim();
		this.idRemoto 		= cParam.getParam("idRemoto").trim();
		this.tipo 			= cParam.getParam("tipo").trim();
		this.idenTes		= cParam.getParam("idenTes").trim();
		this.paziente		= cParam.getParam("paziente").trim();
	}


	protected abstract String getIntestazione();
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
     * 3) Valutazione PreOperatoria :
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected abstract void loadConfigurazioneFromXml();

    /**
	 * Valutazione PreOperatoria, prima di caricare una consolle di refertazione vuota, carico, se esiste il referto della visita precedente
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
    protected abstract boolean loadConfigurazioneFromDb(String pIdenVisita,String pFunzione);

	/**
	 * Check Iden Versione:
	 * 1) Refertazione Consulenze: iden passato tramite request;
	 * 2) Lettera Dimissione: iden ricavato da select sulla tabella CC_LETTERA_VERSIONI;
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected abstract void checkVersione();

	/**
	 * Lettura configurazione lettera Info e button
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
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

	/**
	 * Creazione Form:
	 * form dati della pagina e form per la firma
	 */
	protected String getForm() throws Exception	{
		log.info("getForm() -  form di gestione");
		String strForms;
		this.formGesti.appendSome(new classInputHtmlObject("hidden","readonly"	,readonly));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","stato"		,stato));
		this.formGesti.appendSome(new classInputHtmlObject("hidden","attivo"	,attivo));
		log.info("getForm() -  form di gestione della firma");

		strForms=this.formGesti.toString()+"\n";


		this.formFirma.appendSome(new classInputHtmlObject("hidden","idenVisita",idenVisita));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","whereReport",idenVisita));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","campoDaFiltrare","IDEN_VISITA"));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","typeProcedure",funzione));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","typeFirma",this.bReparti.getValue(this.repartoDest,getTypeFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","reparto",this.bReparti.getValue(this.reparto,getProcFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","repartoDest",this.bReparti.getValue(this.repartoDest,getProcFirma())));
		this.formFirma.appendSome(new classInputHtmlObject("hidden","stato",stato));

		log.info("getForm() -  chiusura form gestione firma");

		strForms+=this.formFirma.toString()+"\n";

		return "\n"+strForms;
	}


	protected void readConfigurazioniInfoButton() throws SQLException, SqlQueryException
	{
		log.info("readConfigurazioniInfoButton() -  creazione sezioni info");
		String sql="";
		try
		{
			ResultSet rs = this.sff.executeQuery("refertazione.xml","consulenze.getConfigMenuRepartoInfo",new String[]{
					getProcInfo(),
					this.bReparti.getValue(this.repartoDest,getProcInfo()),
					funzione,
					this.bUtente.tipo
			});
			while(rs.next()){
				sql="";
				if(rs.getString("QUERY")!=null){
					sql = rs.getString("QUERY").replaceAll("#IDEN_VISITA#",this.idenVisita).replaceAll("#IDEN_ANAG#",this.idenAnag).replaceAll("#CODICE_REPARTO#",this.reparto).replaceAll("#NUM_NOSOLOGICO#",this.ricovero);
					lstInfo.add(new classInfoLettera(this.fDB,rs.getString("LABEL"),sql,rs.getString("GRUPPO")));
				}else{
					lstInfo.add(new classInfoLettera(this.hRequest,this.hSessione,this.fDB,rs.getString("LABEL"),rs.getString("RIFERIMENTI")));
				}
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			log.info("readConfigurazioniSezioni() - Exception:"+ex.getMessage());
		}
		finally
		{
			this.sff.close();
		}

		log.info("readConfigurazioniInfoButton() -  fine creazione sezioni info");

		log.info("readConfigurazioniInfoButton() -  inizio creazione button");

		if (this.stato.equalsIgnoreCase("F"))
			setProcButton("refertaConsulenzeBottomButtonFirma");
		else
			setProcButton("refertaConsulenzeBottomButton");

		classButton btn;
		try
		{
			ResultSet rs = this.sff.executeQuery("refertazione.xml","consulenze.getConfigMenuRepartoButton",new String[]{
					getProcButton(),
					this.bReparti.getValue(this.repartoDest,getProcButton()),
					bUtente.tipo,funzione
			});
			while(rs.next())
			{
				btn= new classButton(rs.getString("LABEL"),null,rs.getString("GRUPPO"));
				this.divBottomBar.appendSome(btn.getHtml());
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			log.info("readConfigurazioniSezioni() - Exception:"+ex.getMessage());
		}
		finally
		{
			this.sff.close();
		}
		log.info("readConfigurazioniInfoButton() -  fine creazione button");
	}

}
