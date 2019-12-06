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
package configurazioneReparto.interfaccia;

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.sql.SqlQueryException;

import java.sql.Connection;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import core.Global;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author not attributable
 * @version 1.0
 */
public class Header extends servletEngine{

    private Connection vConn;

    @SuppressWarnings("deprecation")
	public Header() throws SqlQueryException {
/*        super.hSessione = WebContextFactory.get().getSession();
        super.sContxt  = super.hSessione.getServletContext();*/
    	super();
        this.vConn = Global.getUser(hSessione).db.getDataConnection();

    }

    public Header(ServletContext pCont,HttpServletRequest pReq) throws SqlQueryException {
        super(pCont, pReq);
        this.vConn =this.bUtente.db.getDataConnection();
    }

    public String getBody(){

        StringBuffer body = new StringBuffer();
        try {
            ListaSchede lstSchede = new ListaSchede(this.vConn);
            body.append(lstSchede.getHtml());

            ListaParametri lstParametri = new ListaParametri(this.vConn);
            body.append(lstParametri.getHtml());

            body.append("<div id=\"ContenitoreDefinizione\"></div>");

            ListaRecords lstRecords = new ListaRecords(this.vConn);
            body.append(lstRecords.getHtml());

            ListaMenu lstMenu = new ListaMenu(this.vConn);
            body.append(lstMenu.getHtml());

        } catch (Exception ex) {
            this.log.error(ex);
            body.append(ex.getMessage());
        }

        return body.toString();
    }

    public String getListaParametri(String pTipoScheda)  {
        try {
            ListaParametri lstParametri = new ListaParametri(this.vConn);
            return lstParametri.getHtml(pTipoScheda);
        } catch (Exception ex) {
            this.log.error(ex);
            return ex.getMessage();
        }
    }

    public String getDefinizioneParametro(String pCodice){
        try {
            Definizione def = new Definizione(this.vConn);
            return def.getHtml(pCodice);
        } catch (Exception ex) {
            this.log.error(ex);
            return ex.getMessage();
        }
    }

    private String[] executeStatement(String pFileName, String pStatementName,String [] pBinds,int pOuts){
        String[] resp = null;
        try {
            StatementFromFile SFF = new StatementFromFile(this.hSessione);
            resp = SFF.executeStatement(pFileName,pStatementName,pBinds,pOuts);
        } catch (Exception ex) {
            resp[0] = "KO";
            resp[1] = ex.getMessage();
            log.error(ex);
        }
        return resp;
    }

    private String[] executeStatement(String pFileName, String pStatementName,String [] pBinds){
        return executeStatement(pFileName,pStatementName,pBinds,0);
    }

    public String[] salvaDefinizioneParametro(String[] pBinds /*String pCodice , String pDescrizione ,String pDB , String pWEB , String pCLIENT*/){
        return this.executeStatement("configurazioni.xml","SetDefinizione",pBinds/*new String[]{pCodice,pDescrizione,pDB,pWEB,pCLIENT}*/);
    }

    public String getRecordsConfigurazione(String pKey, String pType, String pMenuAttivo){
        try {
            ListaRecords lstRecords = new ListaRecords(this.vConn);
            return lstRecords.getHtml(pKey,pType,pMenuAttivo);
        } catch (Exception ex) {
            this.log.error(ex);
            return ex.getMessage();
        }
    }

    public String[] setRecordConfigurazione(String[] pBinds /*String pRowId,String pSito,String pStruttura,String pReparto,String pValore*/){
        return this.executeStatement("configurazioni.xml","SetDefinizione",pBinds/*new String[]{pRowId,pSito,pStruttura,pReparto,pValore}*/);
    }

    public String[] cancellaRecordConfigurazione(String pRowId,String pKey, String pType,String pMenuAttivo){
        String[] resp = null;
         try{
             resp = this.executeStatement("configurazioni.xml","RimuoviRecordConfigurazione",new String[]{pRowId});
             if(resp[0].equals("OK")){
                 ListaRecords lstRecords = new ListaRecords(this.vConn);
                 resp[1] = lstRecords.getHtml(pKey,pType,pMenuAttivo);
             }
         }catch(Exception ex){
             resp[0] = "KO";
             resp[1] = ex.getMessage();
             log.error(ex);
         }
        return resp;
    }

    public String[] inserisciRecordConfigurazione(String pKey, String pType,String pMenuAttivo){
        String[] resp = null;
         try{
             resp = this.executeStatement("configurazioni.xml","InserisciRecordConfigurazione",new String[]{pKey});
             if(resp[0].equals("OK")){
                 ListaRecords lstRecords = new ListaRecords(this.vConn);
                 resp[1] = lstRecords.getHtml(pKey,pType,pMenuAttivo);
             }
         }catch(Exception ex){
             resp[0] = "KO";
             resp[1] = ex.getMessage();
             log.error(ex);
         }
        return resp;
    }

    public String getMenu(String pProcedura,String pCodiceReparto, String pIdenPadre){
        try {
            ListaMenu lstMenu = new ListaMenu(this.vConn);
            return lstMenu.getHtml(pProcedura,pCodiceReparto,pIdenPadre);
        } catch (Exception ex) {
            this.log.error(ex);
            return ex.getMessage();
        }
    }

	@Override
	public String getBottomScript() {
		return "";
	}
	
	@Override
	protected String getTitle() {
		return "";
	}
}
