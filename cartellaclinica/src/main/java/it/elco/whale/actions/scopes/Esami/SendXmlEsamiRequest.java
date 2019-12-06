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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package it.elco.whale.actions.scopes.Esami;

import core.Global;
import generic.statements.StatementFromFile;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionParameter;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.actions.annotations.NotNull;
import it.elco.whale.actions.annotations.Setter;
import it.elco.whale.actions.scopes.Esami.beans.Prestazione;
import it.elco.whale.actions.scopes.Esami.beans.Response;
import it.elco.whale.actions.scopes.Esami.beans.Richiesta;
import java.util.ArrayList;
import java.util.Iterator;
import matteos.utils.XmlUtils;
import org.jdom.Document;
import org.jdom.Element;

/**
 *
 * @author francescog
 */
public class SendXmlEsamiRequest extends Action{
    
    public class MetodoValues{
        public final static String Inserimento = "INSERIMENTO";
        public final static String Cancellazione = "CANCELLAZIONE";
        public final static String Modifica = "MODIFICA";
    }
    
    public class SendXmlEsamiRequestResponse extends ActionResponse{

        private SendXmlEsamiRequestResponse(Response response, String xml_response){
            super(new ActionParameter("StructuredResponse",response),new ActionParameter("XmlResponse",xml_response));            
        }     
        
        public Response getStructuredResponse() throws Throwable{
            return (Response) this.getOutParameter("StructuredResponse");
        }        
        
        public String getXmlResponse() throws Throwable{
            return this.getOutParameterString("XmlResponse");
        }
        
    }    

    @NotNull
    private StatementFromFile sff;
    
    @NotNull
    private ArrayList<Richiesta> richieste;
    
    @NotNull
    private String metodo;
    
    private String motivo_annullamento;
         
    public SendXmlEsamiRequest(){
        super();
    }    
    
    private SendXmlEsamiRequest(StatementFromFile sff,String metodo,ArrayList<Richiesta> richieste, String motivo_annullamento){        
        this.sff = sff;
        this.metodo = metodo;
        this.richieste = richieste;
        this.motivo_annullamento = motivo_annullamento;
    }

    @Setter(key="sff")
    public void setStatementFromFile(StatementFromFile sff) {
        this.sff = sff;
    }

    @Setter(key="LISTA_RICHIESTE")
    public void setRichieste(ArrayList<Richiesta> richieste) {
        this.richieste = richieste;
    }

    @Setter(key="METODO")
    public void setMetodo(String metodo) {
        this.metodo = metodo;
    }   

    @Setter(key="MOTIVO_ANNULLAMENTO")
    public void setMotivoAnnullamento(String motivo_annullamento) {
        this.motivo_annullamento = motivo_annullamento;
    }    
    
    @Override
    public SendXmlEsamiRequestResponse execute() throws Throwable {
        Document doc = XmlUtils.parseJDomDocumentFromFile(Global.context.getRealPath(".") + "/WEB-INF/templates/integrazioni/ambulatorio_non_strumentale/request.xml");
        
        Element request = doc.getRootElement();
        
        setChildText(request,"METODO",this.metodo);    
        
        if(this.motivo_annullamento != null){
            setChildText(request,"MOTIVO_ANNULLAMENTO",this.motivo_annullamento); 
        }
        
        for(Richiesta richiesta : this.richieste){        
            request.getChild("LISTA_RICHIESTE").addContent(this.getRichiestaElement(richiesta));
        }
        
        String[] outs = this.sff.executeStatement("PST_Prenotazione.xml", "sendXmlEsamiRequest", new String[]{XmlUtils.getStringFromDocument(doc)}, 1);
        
        Response response = new Response(outs[2]);
        
        
        return new SendXmlEsamiRequestResponse(response,outs[2]);
    }    
 
    public static SendXmlEsamiRequestResponse execute(StatementFromFile sff,String metodo,ArrayList<Richiesta> richieste) throws Throwable{
        return execute(sff,metodo,richieste, null);
    }
    
    public static SendXmlEsamiRequestResponse execute(StatementFromFile sff,String metodo,ArrayList<Richiesta> richieste, String motivo_annullamento) throws Throwable{
        
        SendXmlEsamiRequest sender = new SendXmlEsamiRequest(sff,metodo,richieste, motivo_annullamento);
        return sender.execute();   
        
    }
    
    private Element getRichiestaElement(Richiesta richiesta) throws Exception{
        Element elmRichiesta = XmlUtils.parseJDomDocumentFromFile(Global.context.getRealPath(".") + "/WEB-INF/templates/integrazioni/ambulatorio_non_strumentale/richiesta.xml").detachRootElement();
        
        setChildText(elmRichiesta,"ID_RIS_PAZIENTE",richiesta.getIdRisPaziente());
        
        setChildText(elmRichiesta,"OCCUPA_SLOT",richiesta.getOccupaSlot());
        setChildText(elmRichiesta,"TIPO",richiesta.getTipo());
        
        setChildText(elmRichiesta,"COD_URGENZA",richiesta.getCodUrgenza());
        setChildText(elmRichiesta,"COD_PROV",richiesta.getCodProv());
        
        Iterator<String> it = richiesta.getIdentificiativiEsterni().keySet().iterator();
        while(it.hasNext()){
            String position = it.next();
            elmRichiesta.getChild("IDENTIFICATIVI_RICHIESTA").addContent(getIdentificativoEsterno(position, richiesta.getIdentificativoEsterno(position)));            
        }
        
        for(Prestazione prestazione : richiesta.getPrestazioni()){        
            elmRichiesta.getChild("LISTA_PRESTAZIONI").addContent(this.getPrestazioneElement(prestazione));
        }
        
        return elmRichiesta;
    }
       
    private Element getPrestazioneElement(Prestazione prestazione) throws Exception{
        Element elmPrestazione = XmlUtils.parseJDomDocumentFromFile(Global.context.getRealPath(".") + "/WEB-INF/templates/integrazioni/ambulatorio_non_strumentale/prestazione.xml").detachRootElement();
        
        setChildText(elmPrestazione,"COD_PREST",prestazione.getCodPrest());
        setChildText(elmPrestazione,"COD_AREA",prestazione.getCodArea());
        setChildText(elmPrestazione,"DATA_APP",prestazione.getDataApp());
        setChildText(elmPrestazione,"ORA_APP",prestazione.getOraApp());
        
        Iterator<String> it = prestazione.getIdentificiativiEsterni().keySet().iterator();
        while(it.hasNext()){
            String position = it.next();
            elmPrestazione.addContent(getIdentificativoEsterno(position, prestazione.getIdentificativoEsterno(position)));            
        }
        
        return elmPrestazione;
    }
    
    private Element getIdentificativoEsterno(String position,String value){
        Element identificativo_esterno = new Element("ID");
        identificativo_esterno.setAttribute("position",position);
        identificativo_esterno.setText(value);
        return identificativo_esterno;
    }    
    
   private void setChildText(Element elm,String node_name,String value){
       elm.getChild(node_name).setText(value);
   }    
}
