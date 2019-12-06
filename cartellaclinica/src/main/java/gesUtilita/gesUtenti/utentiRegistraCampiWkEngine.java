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
package gesUtilita.gesUtenti ;

import imago.http.classHeadHtmlObject;
import imago.http.classMetaHtmlObject;
import imago.http.baseClass.baseUser;
import imagoAldoUtil.classStringUtil;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ecs.Document;
import org.apache.ecs.html.Body;
import org.apache.ecs.html.Title;

import worklist.ImagoWorklistException;
import worklist.IworklistEngine;
import core.Global;

public class utentiRegistraCampiWkEngine
	implements IworklistEngine
{

    HttpSession                         mySession;
    ServletContext myContext ;
    HttpServletRequest myRequest ;
    private         baseUser logged_user = null ;
    String          inputIdenCampi = "";
    boolean         flgOk = true;

    public utentiRegistraCampiWkEngine (HttpSession myInputSession,
    ServletContext myInputContext,
    HttpServletRequest myInputRequest
    ) throws
    ImagoWorklistException {
        // inizializzazione engine della worklist
        super();
        try {
            mySession = myInputSession;
            myContext = myInputContext;
            myRequest = myInputRequest;
            // ATTENZIONE
            initMainObjects();
            // *******
            leggiDatiInput();
        } catch (ImagoWorklistException ex) {
            throw ex;
        }
    }

    private void initMainObjects(){

         this.logged_user = Global.getUser(mySession);
     }


     /**
      * metodo che legge i dati in input
      * dell'oggetto Request
      */
     private void leggiDatiInput() throws ImagoWorklistException {
         inputIdenCampi = classStringUtil.checkNull(this.myRequest.getParameter("idenCampi"));
         return;
    }


    /**
     * addBottomJScode
     *
     * @return String
     * @todo Implement this worklist.IworklistEngine method
     */
    public String addBottomJScode ()
    {
        StringBuffer sb = null;


        sb = new StringBuffer();
        sb.append("<SCRIPT>\n");
        if (!flgOk){
            sb.append("alert('Error on saving');\n");
        }
        sb.append("top.leftFrame.apri(\"worklist\");\n");
        sb.append("</SCRIPT>\n");
	return sb.toString() ;
    }

    /**
     * addTopJScode
     *
     * @return String
     * @todo Implement this worklist.IworklistEngine method
     */
    public String addTopJScode ()
    {
	return "" ;
    }

    /**
     * creaBodyHtml
     *
     * @return Body
     * @throws ImagoWorklistException
     * @todo Implement this worklist.IworklistEngine method
     */
    public Body creaBodyHtml ()
	    throws ImagoWorklistException
    {
        Body       corpoHtml = null;

        corpoHtml = new Body();

        // aggiunge codice JS in fondo pagina
        corpoHtml.addElement(addBottomJScode());
        return corpoHtml;
    }

    /**
     * creaDocumentoHtml
     *
     * @return Document
     * @throws ImagoWorklistException
     * @todo Implement this worklist.IworklistEngine method
     */
    public Document creaDocumentoHtml ()
	    throws ImagoWorklistException
    {
        Document doc = null;
        doc = new Document();
        try {
            salvaCampiWk();
            doc.setBody(creaBodyHtml());
            // attacco Head al documento
            doc.setHead(creaHeadHtml());
        } catch (java.lang.NullPointerException ex) {
            ImagoWorklistException newEx = new ImagoWorklistException(ex);
            ex.printStackTrace();
            throw newEx;
        } catch (ImagoWorklistException ex) {
            ex.printStackTrace();
            throw ex;
        }
        return doc;
    }

    /**
     * creaHeadHtml
     *
     * @return classHeadHtmlObject
     * @throws ImagoWorklistException
     * @todo Implement this worklist.IworklistEngine method
     */
    public classHeadHtmlObject creaHeadHtml ()
	    throws ImagoWorklistException
    {
	return null ;
    }

    /**
     * creaMetaHtml
     *
     * @return classMetaHtmlObject
     * @throws ImagoWorklistException
     * @todo Implement this worklist.IworklistEngine method
     */
    public classMetaHtmlObject creaMetaHtml ()
	    throws ImagoWorklistException
    {
	return null ;
    }

    /**
     * creaTitoloHtml
     *
     * @return Title
     * @throws ImagoWorklistException
     * @todo Implement this worklist.IworklistEngine method
     */
    public Title creaTitoloHtml ()
	    throws ImagoWorklistException
    {
	return null ;
    }

    private void salvaCampiWk(){
       imago.sql.TableUpdate myUpdate = null;

        // parsing dati in ingresso
        myUpdate = new imago.sql.TableUpdate();
              try{
                  myUpdate.setConnection(logged_user.db.getWebConnection());
                  myUpdate.setTableNameUpd("WEB");
                  // attenzione problema oracle/
                  myUpdate.setColumnValueString("worklist",inputIdenCampi);
                  // azzero campo relativo all'ordinamento dei campi della wk
                  myUpdate.setColumnValueString("posizione_campi_wk","");
                  // azzero anche l'ordinamento per colonna in quanto
                  // potrebbe non + esistere la colonna per la quale si ordina
                  myUpdate.setColumnValueString("personal_order_wk","");
                  myUpdate.setWhereClause(" webuser=\'" + logged_user.login + "\'");
                  myUpdate.doUpdate();
                  // aggiorno campi dell'utente loggato
                  logged_user.loadInitValue();
                  // per sicurezza lo azzero a mano
//                  logged_user.listSortedFieldOfWorklist = new Hashtable();
              }
              catch(java.lang.Exception ex){
                  ex.printStackTrace();
                  flgOk= false;
              }
              finally{
                  try{
                      myUpdate.doUpdate();
                      myUpdate.close();
                  }
                  catch(java.lang.Exception ex1){
                  }
              }
    }

}
