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
package cartellaclinica.lettera.pckInfo;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import generic.utility.controlStructure;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import cartellaclinica.gestioneTerapia.ricerca.filtri;
import configurazioneReparto.baseReparti;


public class sProntuario extends servletEngine{

    controlStructure cs=new controlStructure();
    private baseReparti bReparti;

    public sProntuario(ServletContext pCont,HttpServletRequest pReq){
        super(pCont,pReq);
        bReparti = super.bReparti;//Global.getReparti(hSessione);
        this.setBaseUser(true);
        this.setBaseReparti(true);
    }
    @Override
	public String getBody(){

        if(!hashRequest.containsKey("statoTerapia"))
            hashRequest.put("statoTerapia","I");


        String body=""; /*<body onLoad=\"init();\" class="+getBoxStyle()+" ";
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
                body += getBoxRicerca();
            }
            if(param("modality").equals("V")){
            }

//            body+= getFormRequest();
//            body+= "</body>\n";

        }catch(Exception e){
//            body="<body>"+e.getMessage()+"</body>";
            body=e.getMessage();
        }
        return body;

    }
    private String getBoxRicerca() throws Exception {

        filtri  tFiltri=new filtri(bReparti,param("reparto"),param("tipoTerapia"),param("statoTerapia")) ;
        String box="<div id=boxRicerca>";
        box+= tFiltri.getHtml();
        box+= "<iframe src=\"blank.htm\" id=wkSearchFarmaci frameBorder=0 scrolling=no></iframe>\n";

        box+="<div class=BarraHeader>\n";
        box+="<span class=pulsanteBarraHeader><a onclick=\"chiudi();\" href=\"#\">Chiudi</a></span>\n";
        box+="</div>\n";

        return box+="</div>";
    }

    private String getBoxStyle(){
        String style="";
        if(param("modality").equals("I")){

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
     * @see cartellaclinica.gestioneTerapia.plgTerapia#getBottomScript()
     */
    @Override
	public String getBottomScript() throws Exception{
        return "<script>"+bReparti.getValue(param("reparto"),"TERAPIA_INS_CONTROLLI_JS")+"</script>";
    }

	@Override
	protected String getTitle() {
		return "";
	}
}
