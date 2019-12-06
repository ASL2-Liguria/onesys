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
    File: cartellaPaziente.java
    Autore: Fra
 */

package cartellaclinica.cartellaPaziente;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;
import imago.http.classIFrameHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import menuAlbero.menuAlbero;
import cartellaclinica.dwr.dwrTraceUserAction;

public class cartellaPaziente extends servletEngine {

    private cDatiCartellaPaziente vDati = null;
    private final StatementFromFile sff;

    public cartellaPaziente(ServletContext cont, HttpServletRequest req) throws Exception {
        super(cont, req);
        sff = getStatementFromFile();
		setBaseObject(true, true, true, true);
    }

    @Override
    public String getBody() {

        String sOut = "";

        BODY.addAttribute("class","singolo");

        String divModalitaCartella;

        try {

            if(!"".equals(param("ModalitaAccesso"))){
                bUtente.modalita_accesso = param("ModalitaAccesso");
            }

            if("".equals(param("iden_evento")) && !"".equals(param(("ricovero")))){
                decodeNumeroRicovero();
            }

            vDati = new cDatiCartellaPaziente(this.hSessione,
                                              param("iden_evento"),
                                              param("iden_anag"),
                                              param("reparto")
                    );

            log.debug("TRACE_APERTURA_CARTELLA : " + this.bReparti.getValue(vDati.getReparto().getCodCdc(),"TRACE_APERTURA_CARTELLA"));

            if(this.bReparti.getValue(vDati.getReparto().getCodCdc(),"TRACE_APERTURA_CARTELLA").equals("S")){
                dwrTraceUserAction tua = new dwrTraceUserAction(hSessione);
                tua.openTraceUserAction("NOSOLOGICI_PAZIENTE", vDati.getAccesso().getIden(), vDati.getPaziente().getIden(),vDati.getAccesso().getIden());
            }

            menuAlbero cMenu = new menuAlbero(hSessione,vDati.getReparto().getCodCdc(),true);

            setMenuLabels(cMenu);

            cMenu.setMenu(vDati.getReparto().getCodCdc(),"schedaRicoveratiMenuConfronto","slideMenuMain","z49",vDati.getRicovero().getTipologia());

            divModalitaCartella=cMenu.getMenu();

            sOut += getHeaderCartella();

            cMenu.setMenu(vDati.getReparto().getCodCdc(),"schedaRicoveratiMenu","slideMenuLEFT","z48",vDati.getRicovero().getTipologia());

            String htmlConsultazione = "<div id=AlberoConsultazione >\n";

            htmlConsultazione +="<div id=AlberoConsultazioneLEFT>";

            htmlConsultazione +=cMenu.getMenu();

            htmlConsultazione+="<div id=slideMenuVersioniLEFT class=jqueryslidemenu></div>\n";

            htmlConsultazione+=divModalitaCartella;

            htmlConsultazione+=getIntestazioniCartella();

            htmlConsultazione+="</div>\n";

            htmlConsultazione +="<div id=AlberoConsultazioneRIGHT>";

            cMenu.setAttribute("id","slideMenuRIGHT");
            htmlConsultazione+=cMenu.getMenu();

            htmlConsultazione+="<div id=slideMenuVersioniRIGHT class=jqueryslidemenu></div>\n";

            htmlConsultazione+=getIntestazioniCartella();


            htmlConsultazione+="</div></div>";

            sOut += htmlConsultazione;

            sOut += getFrame("frameWork","classIFWork").toString();
            sOut += getFrame("frameConfronto","classIFConfronto").toString();

//            sOut += getForm().toString();

            sOut += this.vDati.getPaziente().toHtmlForm("frmPaziente");

            sOut += this.vDati.getPrericovero().toHtmlForm("frmPrericovero");

            sOut += this.vDati.getRicovero().toHtmlForm("frmRicovero");

            sOut += this.vDati.getAccesso().toHtmlForm("frmAccesso");

            sOut += this.vDati.getAccesso().getRepartoAppoggio().toHtmlForm("frmRepartoAppoggio");

            sOut += this.vDati.getReparto().toHtmlForm("frmReparto");

            sOut += this.vDati.getModalita().toHtmlForm("frmModalita");

        } catch (SQLException ex){
            log.error(ex);
            sOut = ex.getMessage();
        } catch (NoDataFoundException ex) {
            log.error(ex);
            sOut = ex.getMessage();
        } catch (Exception ex) {
            log.error(ex);
            sOut = ex.getMessage();
        } finally{
            if(vDati != null) {
                vDati.close();
            }
            this.sff.close();
        }

        return sOut;
    }

    private String getDataFiltro() {
    	String htmlFiltroData = "";
    	htmlFiltroData	+= "<div id='divFiltroCartellaDate' >";
    	htmlFiltroData	+= "<div id='daData' class='filtro'>";
    	htmlFiltroData	+= "<label>Da Data</label><a class=\"previous\"></a><input /><a class=\"next\"></a>";
    	htmlFiltroData	+= "</div>";
    	htmlFiltroData	+= "<div id='aData' class='filtro'>";
    	htmlFiltroData	+= "<label>A Data</label><a class=\"previous\"></a><input /><a class=\"next\"></a>";
    	htmlFiltroData	+= "</div>";
    	htmlFiltroData	+= "</div>";
		return htmlFiltroData;
	}

    private String getFiltroNumeroRecords(){
    	String htmlFiltroNrRecord = "";
    	htmlFiltroNrRecord	+= "<div id='divFiltroNrRecords' class='filtro'>";
    	htmlFiltroNrRecord	+= "<div><label>Numero Richieste</label><select id='slNrRecord' name='slNrRecord'></select></div>";
    	htmlFiltroNrRecord	+= "</div>";
    	return htmlFiltroNrRecord;
    }
    private String getButtonRefreshCartella() {
    	String htmlBtnFiltroCartella = "";
    	htmlBtnFiltroCartella = "<label class=\"refreshPage\" id=\"btnRefreshCartella\">Aggiorna</label>";
    	return htmlBtnFiltroCartella;
    }
	private String getRadioFiltriCartella() {
        StringBuilder resp= new StringBuilder();
        resp.append("<div id=\"divFiltroCartella\">");

        resp.append(getHtmlFiltro("lblBtnPaziente","IDEN_ANAG",false));
        resp.append(getHtmlFiltro("lblBtnPazienteReparto","ANAG_REPARTO",true));
        resp.append(getHtmlFiltro("lblBtnPazienteStruttura","ANAG_STRUTTURA",true));
        resp.append(getHtmlFiltro("lblBtnNosologico","NUM_NOSOLOGICO",true));
        resp.append(getHtmlFiltro("lblBtnEpisodio","IDEN_VISITA",true));
        resp.append(getHtmlFiltro("lblBtnPS","PS_RICOVERO",false));

        resp.append("</div>");
        return resp.toString();
    }

    private String getHtmlFiltro(String pIdLabel,String pValue,boolean pWithMenu){
        StringBuilder html = new StringBuilder();
        html.append("<div class=\"filtro "+ (pWithMenu ? "Menu" : "") +"\" value=\""+pValue+"\">");
        html.append("<label id=\""+pIdLabel+"\"></label>");
        html.append("<div class=\"btnMenu\"></div>");
        html.append("</div>");
        return html.toString();
    }

    private void setMenuLabels(menuAlbero pMenu){
        pMenu.addLabel("idenRicovero",vDati.getRicovero().getIden().equals("")?0:Long.valueOf(vDati.getRicovero().getIden()));
        pMenu.addLabel("idenVisita",vDati.getAccesso().getIden().equals("")?0:Long.valueOf(vDati.getAccesso().getIden()));
        pMenu.addLabel("idenAnag",vDati.getPaziente().getIden().equals("")?0:Long.valueOf(vDati.getPaziente().getIden()));
        pMenu.addLabel("codiceReparto",vDati.getReparto().getCodCdc());
        pMenu.addLabel("numNosologico",vDati.getRicovero().getCodice());
    }

    private classIFrameHtmlObject getFrame(String id,String className){
        classIFrameHtmlObject  cFrame;

        cFrame = new classIFrameHtmlObject("blank.htm");
        cFrame.addAttribute("id",id);
        cFrame.addAttribute("name",id);
        cFrame.addAttribute("class",className);
        cFrame.addAttribute("frameborder","0");
        cFrame.addAttribute("scroll","yes");
        return cFrame;
    }
/*
    private classFormHtmlObject getForm() throws SqlQueryException, SQLException {
        classFormHtmlObject cForm = new classFormHtmlObject("EXTERN","","");

        cForm.appendSome(new classInputHtmlObject("hidden", "ModalitaCartella",cParam.getParam("ModalitaCartella").trim()));
        cForm.appendSome(new classInputHtmlObject("hidden", "funzione", cParam.getParam("funzione").trim()));
        cForm.appendSome(new classInputHtmlObject("hidden", "DatiInterfunzione", cParam.getParam("DatiInterfunzione")));

        return cForm;
    }*/
    private String getHeaderCartella() throws SQLException, Exception {

        String header="<div class=header>";

        header+= getLabel("lblLetto");
        header+= getLabel("lblStanza");
        header+= getLabel("lblRepartoUbicazione");
        header+= getLabel("lblEmergenzaMedica");
        
        

        header += "<div class=\"intestazioneCartella\"></div>";

        ResultSet rs = this.sff.executeQuery("configurazioni.xml","getConfigMenuReparto",new String[]{
                                   "CARTELLA_PAZIENTE_BTN",
                                   this.bReparti.getValue(vDati.getReparto().getCodCdc(),"CARTELLA_PAZIENTE_BTN"),
                                   bUtente.tipo
        });
        String buttons = new String("");
        while(rs.next()){
            buttons = "<div class='btn "+rs.getString("FUNZIONE")+"' title='"+rs.getString("LABEL")+"'></div>" + buttons;
        }

        header+=buttons;

        header+="</div>";

        this.sff.close();

        return header;
    }

    private String getIntestazioniCartella() throws NumberFormatException,SQLException, SqlQueryException {


        String divIntestazioneSezione ="";

        divIntestazioneSezione = "<div id=intest>";
        divIntestazioneSezione += getButtonRefreshCartella();
        divIntestazioneSezione += "<label class=head id=lblFiltro>Filtro: </label>";
        divIntestazioneSezione += getRadioFiltriCartella();

        divIntestazioneSezione += getDataFiltro();
        divIntestazioneSezione += getFiltroNumeroRecords();
        divIntestazioneSezione += "<div id=\"wrapperMenuInfo\">";
        divIntestazioneSezione += getLabel("lblFunzione");


        divIntestazioneSezione += "<div class=\"btnMenuVersioni\"></div>";
        divIntestazioneSezione += getLabel("lblCartella");
        divIntestazioneSezione += getLabel("lblReparto");
        divIntestazioneSezione += getLabel("lblDataInizioRicovero");
        divIntestazioneSezione += getLabel("lblGiorniRicovero");
        divIntestazioneSezione += getLabel("lblDataFineRicovero");
        divIntestazioneSezione += getLabel("lblDataInizio");
        divIntestazioneSezione += getLabel("lblGiorni");
        divIntestazioneSezione += getLabel("lblDataFine");
        divIntestazioneSezione+= "</div>";
        divIntestazioneSezione += "</div>";

        return divIntestazioneSezione;

    }

    private String getLabel(String pLabelId){
        StringBuilder label = new StringBuilder();
        label.append("<label class=\"head\" id=\""+pLabelId+"Int\"></label>");
        label.append("<label class=\"data\" id=\""+pLabelId+"\"></label>");
        return label.toString();
    }

    /* classHeadHtmlObject createHead() throws SQLException, ImagoHttpException -> riportata in commento in servletEngine */

	@Override
	protected String getBottomScript() {
		return "";
	}

	@Override
	protected String getTitle() {
		return "";
	}

    private void decodeNumeroRicovero() throws Exception{
        ResultSet rs = this.sff.executeQuery("cartellaPaziente.xml", "getIdenRicovero", new String[]{param("ricovero")});
        if(rs.next()){
            this.hashRequest.put("iden_evento", rs.getString("IDEN"));
        }else{
            throw new Exception("Numero di Ricovero non riconosciuto");
        }
    }
}
