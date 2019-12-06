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
 * Serv_GestCampi_OpeEngine.java
 *
 * Created on 5 settembre 2006, 10.20
 */

package src.Gestione_Campi;
import imago.a_sql.CLogError;
import imago.http.ImagoHttpException;
import imago.http.classTypeInputHtmlObject;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseRetrieveBaseGlobal;
import imago.http.baseClass.baseUser;

import java.util.ArrayList;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import core.Global;
/**
 *
 * @author  fabioc
 */
public class Serv_GestCampi_OpeEngine {
    private ServletContext contesto=null;
    private HttpSession sessione=null;
private baseUser logged_user = null;
    private baseGlobal infoGlobali=null;
    private CLogError log = null;
    private String where_condition = "";
    private String hidManualOrderAsc = "";
    private String hidManualOrderDesc = "";
    private HttpServletRequest myRequest=null;
    private String hidWhere="";
    private String hidUtente="";
    private String hidRowsel="";
    /** Creates a new instance of RisultatiRicercaPagina */


    /*Costruttore chiamato dalla servlet RisultatiRicerca che carica il layout nel frame contenente
     *i record risultanti dalla ricerca
     */
    public Serv_GestCampi_OpeEngine(HttpServletRequest request,HttpSession myInputSession,
    ServletContext myInputContext){
        contesto=myInputContext;
        sessione=myInputSession;

        myRequest=request;
        logged_user = Global.getUser(myRequest.getSession());
        //this.tipo_ricerca = tipo_ricerca;
       try{
        this.log = new CLogError(logged_user.db.getWebConnection(), request, "Serv_GestCampi_Campi", logged_user.login);
            log.setFileName("Serv_GestCampi_Ope");
            log.setClassName("src.Gestione_Campi.Serv_GestCampi_Ope");
            }
          catch(Exception ex){
            //System.out.println(ex);
           }
//        this.log.setClassName("src.GestioneCampi.Serv_GestCampi_CampiEngine");

        //this.client_param = client_param;
    }

    private String crea_where_condition(){
       try{
         hidRowsel=(String) myRequest.getParameter("hidRowsel");
         if (hidRowsel== null || hidRowsel.equalsIgnoreCase(""))
        hidRowsel="";
           hidWhere =(String) myRequest.getParameter("hidWhere");
        hidUtente ="";
        if (hidWhere== null || hidWhere.equalsIgnoreCase(""))
        {
            hidWhere="";
            if (hidUtente== null || hidUtente.equalsIgnoreCase(""))
                    {
                        hidUtente="";
                    }
          else
                 {
                     where_condition= "where utente='"+hidUtente+"' or utente ='' or utente is null";
                 }
      }

      else
        {
            if (hidUtente== null || hidUtente.equalsIgnoreCase(""))
        {
            this.where_condition ="where scheda like '"+hidWhere+"'";
        }
        else
        {
            where_condition= "where scheda like '"+hidWhere+"' and ( utente='" +hidUtente+"'utente ='' or utente is null)";        }}

         }
       catch (Exception e) {log.writeLog("Errore creando la where condition probabile mancanza parametri "+e.getMessage(),CLogError.LOG_ERROR);}
        return this.where_condition;
        //
//        hidWhere =(String) myRequest.getParameter("hidWhere");
//        hidUtente =(String) myRequest.getParameter("hidUtente");
//        if (hidWhere== null)
//            hidWhere="";
//        if (hidUtente== null)
//            hidUtente="";
//        this.where_condition =  hidWhere + hidUtente;
//         if(this.where_condition.equalsIgnoreCase("")||where_condition==null)
//            this.where_condition = "";
//        return this.where_condition;
    }

    private String creaWorklist(){
        Hashtable      hashDati = new Hashtable();
        Hashtable      hashHeader = new Hashtable();
        ArrayList lista_nomi_ope_array = new ArrayList();
        ArrayList lista_nomi_array = new ArrayList();

        int pagina_da_vis = 1;
        String pag = (String) myRequest.getParameter("pagina_da");

        try{
            pagina_da_vis = Integer.parseInt(pag);
        }
        catch(Exception e){
            pagina_da_vis = 1;
        }

        String select = crea_where_condition();
        String illumina = "illumina(this.sectionRowIndex);cambiacampi()";



        String nome_worklist = "";
        if (select.equalsIgnoreCase("")||select.length()<2)
        {    nome_worklist = "WK_GEST_SCHEDA";
            lista_nomi_ope_array.add("iden");
        lista_nomi_array.add("iden");
        lista_nomi_ope_array.add("Scheda");
        lista_nomi_array.add("Scheda");
        }
        else
        {    nome_worklist = "WK_GEST_SCHEDE_WHERE";
        lista_nomi_ope_array.add("iden");
        lista_nomi_array.add("iden");
        lista_nomi_ope_array.add("Scheda");
        lista_nomi_array.add("Scheda");
        }
        try {
                       this.infoGlobali = baseRetrieveBaseGlobal.getBaseGlobal(this.
                               contesto, this.sessione);
                   } catch (ImagoHttpException ex) {
            }
        FabioCreateWK worklist =  new FabioCreateWK(logged_user,
        nome_worklist, "TIPO_WK", null, hashDati, hashHeader, pagina_da_vis, select,
        lista_nomi_ope_array, lista_nomi_array, illumina, this.log, this.hidManualOrderAsc, this.hidManualOrderDesc,infoGlobali);
        worklist.setSrvContext(contesto);
        worklist.setRequest(this.myRequest);
        String file_js = "std/jscript/src/Gest_Campi/Gestione_principale.js*";
        //String file_js = "std/jscript/src/Worklist/fo*";
        worklist.addLinkJs(file_js);
        worklist.setNomeTabellaLabel("ServletGestCampi_ope");
        ArrayList funzioni = new ArrayList();
        ArrayList label = new ArrayList();
        label.add("titolo");
        String wk = "";

        worklist.setFormPage("form_schede", "", "form_schede",  "GestCampi_Scheda", "POST");//action RicercaMagazzini
        /*
             Campi nascosti della worklist per poter fare la ricerca durante la paginazione
         */
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "pagina_da", String.valueOf(pagina_da_vis));
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "Azione", "");
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hidWhere", hidWhere);
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hidUtente",hidUtente);
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "hidRowsel",hidRowsel);
        worklist.addInputElementToForm(classTypeInputHtmlObject.typeHIDDEN, "selezionato", "");
        worklist.creaHeader("titolo", funzioni, label, "");


            /*
             Gestione delle funzioni per la paginazione
             */
        int indietro = pagina_da_vis - 1;
        funzioni.add("indietro(" + indietro + ");");
        int avanti = pagina_da_vis + 1;
        funzioni.add("avanti(" + avanti + ");");
        label.add("indietro");
        label.add("avanti");
        worklist.creaAvantiIndietro("indietro(" + indietro + ");", "avanti(" + avanti + ");", "indietro", "avanti");
        funzioni.clear();
        label.clear();
            /*
            Context_menu
             */

        if (nome_worklist.equalsIgnoreCase("WK_GEST_SCHEDA"))
        {String tab_elem_menudd_procedura = "Gest_campi_princ";
            worklist.addContextMenu(logged_user, tab_elem_menudd_procedura, this.sessione);}
         if (nome_worklist.equalsIgnoreCase("WK_GEST_SCHEDE_WHERE"))
         {String tab_elem_menudd_procedura = "Gest_campi_princ_W";
        worklist.addContextMenu(logged_user, tab_elem_menudd_procedura, this.sessione);
       if (!hidRowsel.equalsIgnoreCase(""))
       {worklist.illuminapre();
       }
    }
        /*
             Numero di form gestite oltre quella contenente la worklist
         */


        try{
            wk = worklist.creaPagina();

        }
        catch(Exception e){
            this.log.writeLog(e, CLogError.LOG_ERROR);
        }
        return wk;
    }

    public String creaPaginaHtml(){
        return (creaWorklist().toString());
    }
}







