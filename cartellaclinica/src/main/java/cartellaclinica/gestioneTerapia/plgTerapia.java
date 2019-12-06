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
package cartellaclinica.gestioneTerapia;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import generic.utility.controlStructure;
import imago.sql.SqlQueryException;

import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import cartellaclinica.gestioneTerapia.ricerca.filtri;
import configurazioneReparto.baseReparti;
/**
 *
 * <p>Title: plgTerapia</p>
 *
 * <p>Description: Classe generica per l'inserimento/visualizzazione terapia</p>
 *
 * <p>modality: </p>
 * <p>I=inserimento</p>
 * <p>V=visualizzazione</p>
 *
 * <p>layout: </p>
 * <p>O=orizzontale</p>
 * <p>V=verticale</p>
 *
 * <p>statoTerapia: </p>
 * <p>Lo stato che viene utilizzato per cercare/inserire le terapie in modo da differenziare i dati inseriti </p>
 *
 * <p>Copyright: Copyright (c) 2010</p>
 *
 * <p>Company: </p>
 *
 * @author Fra
 * @version 1.0
 */
public class plgTerapia extends servletEngine{

    controlStructure cs=new controlStructure();
    private baseReparti bReparti;

    public plgTerapia(ServletContext pCont,HttpServletRequest pReq){
        super(pCont,pReq);
        bReparti = super.bReparti;//Global.getReparti(hSessione);
        this.setBaseUser(true);
        this.setBaseReparti(true);
    }
    @Override
	public String getBody(){

        if(!hashRequest.containsKey("statoTerapia"))
            hashRequest.put("statoTerapia","I");

        String body = ""; /* "<body onLoad=\"init();\" class="+getBoxStyle()+" ";
        body+= cs.ifControl(!param("onClick").equals(""),"onClick="+param("onClick"));
        body+= cs.ifControl(!param("onDblClick").equals(""),"onDblClick="+param("onDblClick"));
        body+= cs.ifControl(!param("onBeforeUnload").equals(""),"onBeforeUnload="+param("onBeforeUnload"));
        body+= ">";*/
        this.BODY.setOnLoad("init();");
        this.BODY.setClass(getBoxStyle());
        if (!param("onClick").equals(""))
        	this.BODY.setOnClick(param("onClick"));
        if (!param("onDblClick").equals(""))
        	this.BODY.setOnDblClick(param("onDblClick"));
        if (!param("onBeforeUnload").equals(""))
        	this.BODY.addAttribute("onBeforeUnload",param("onBeforeUnload"));
        try{
            StatementFromFile SFF = new StatementFromFile(this.hSessione);
            SFF.executeStatement("terapie.xml","set_dati_farmacie",new String[]{param("reparto")},0);
                if(param("modality").equals("I")){
                    filtri  tFiltri=new filtri(bReparti,param("reparto"),param("tipoTerapia"),"I") ;
                    body += getBoxRicerca(tFiltri);
                    body += getBoxTerapie(tFiltri);
                } else if (param("modality").equals("F")) {
                    filtri  tFiltri=new filtri(bReparti,param("reparto"),param("tipoTerapia"),param("statoTerapia")) ;
                    body += getBoxRicercaFarmaciOnly(tFiltri);
                } else if(param("modality").equals("V")){
                    body += getBoxTerapie(null);
                } else if (param("modality").equals("Vis")){
                    filtri  tFiltri=new filtri(bReparti,param("reparto"),param("tipoTerapia"),"I") ;
                    body += getBoxTerapie(tFiltri);
                }

            body+="<div id=\"wrapperBarraHeader\">\n ";

            String divLeft= "<div class=\"BarraHeader Sx\" >", divRigth = "<div class=\"BarraHeader Dx\">";

            if(!param("btnGenerali").equals("")){
                String[] arBtn = param("btnGenerali").split("@");
                for (int i = arBtn.length - 1; i >= 0; i--) {
                    String [] btn = arBtn[i].split("::");
                    if(btn.length>=3){

                        divLeft += " <span class='pulsanteBarraHeader '><a href=\"javascript:" +
                                btn[1] + "\" >" +
                                btn[0] + "</a></span>\n";
                    }else{
                        divRigth += " <span class='pulsanteBarraHeader '><a href=\"javascript:" +
                                btn[1] + "\" >" +
                                btn[0] + "</a></span>\n </div> \n";
                    }
                }
            }
            divLeft +="</div>";
            divRigth +="</div>";

            body += divLeft + divRigth;

            body+="</div>\n";
//            body+= getFormRequest();
//            body+= "</body>\n";

        }catch(Exception e){
//            body="<body>"+e.getMessage()+"</body>";
            body=e.getMessage();
        }
        return body;

    }
    private String getBoxRicerca(filtri tFiltri) throws Exception {

        
        String box="<div id=boxRicerca><div id='headBoxRicerca' class='toggle head'><span class='open'>Ricerca Farmaci</span></div><div class='inner'>";
    	box+= tFiltri.getHtml();
        box+= "<div id='frameSearchFarmaci'><iframe src=\"blank.htm\" id=wkSearchFarmaci frameBorder=0 scrolling=yes></iframe></div>\n";

        return box+="</div></div>";
    }
    private String getBoxRicercaFarmaciOnly(filtri tFiltri) throws SqlQueryException, SQLException {
    	
    	
    	String box="<div id=boxRicerca><div id='headBoxRicerca' class='head'><span>Ricerca Farmaci</span></div><div class='inner'>";
    	box+= tFiltri.getHtmlRicerca();
    	box+= "<div id='frameSearchFarmaci'><iframe src=\"blank.htm\" id=wkSearchFarmaci frameBorder=0 scrolling=yes></iframe></div>\n";
    	
    	return box+="</div></div>";
    }

    private String getBoxTerapie(filtri tFiltri) throws SqlQueryException, SQLException{

        String box="<div id=boxTerapie>";
        box+="<div id='headBoxTerapie' class='toggle head'><span class='open'>Prescrizioni</span></div><div class='inner'>";
        box += "<div class=\"tabber\"></div>";
        box += "<div class=\"FramesContainer\"></div>";
        return box+="</div></div>";
    }
 
    private String getBoxStyle(){
        String style="";
        if(param("modality").equals("I") || param("modality").equals("Vis")){

            if(param("layout").equals("O"))
                style = "inserimentoOrizzontale";

            if(param("layout").equals("V"))
                style = "inserimentoVerticale";

        }
        if(param("modality").equals("V"))
            style = "visualizza";

        return style;
    }
    /*
     * (non-Javadoc)
     * @see cartellaclinica.lettera.pckInfo.sProntuario#getBottomScript()
     */
    @Override
	public String getBottomScript(){
        return "";//"<script>"+bReparti.getValue(param("reparto"),"TERAPIA_INS_CONTROLLI_JS")+"</script>";
    }

	@Override
	protected String getTitle() {
		return "";
	}
}
