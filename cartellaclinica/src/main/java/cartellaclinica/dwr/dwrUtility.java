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
package cartellaclinica.dwr;

import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import it.elco.whale.actions.Action;
import it.elco.whale.actions.ActionFactory;
import it.elco.whale.actions.ActionResponse;
import it.elco.whale.converters.MapFactory;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import menuAlbero.menuAlbero;

import org.directwebremoting.WebContextFactory;

import configurazioneReparto.baseReparti;
import core.Global;

public class dwrUtility {

    private Connection connD = null;
    private Connection connW = null;
    private baseUser User = null;
    private baseReparti bReparti;
    private HttpSession session = null;
    private StatementFromFile sff;
    private ElcoLoggerInterface log = new ElcoLoggerImpl(this.getClass());

    public dwrUtility() throws SqlQueryException {
        super();
        init();
    }

    public dwrUtility(HttpSession pSession) throws SqlQueryException {
        this.session = pSession;
        init();
    }

    private void init() throws SqlQueryException {
        if (session == null) {
            session = WebContextFactory.get().getSession();
        }
        User = Global.getUser(session);
        bReparti = Global.getReparti(session);
        connD = User.db.getDataConnection();
        connW = User.db.getWebConnection();
    }

/*    public String[] getDatiFunzione(String pFunzione, String pReparto, int pIdenVisita, int pIdenAnag) {
        String[] resp = new String[5];
        CallableStatement CS = null;

        try {

            CS = connD.prepareCall("{call CC_GET_CONF_SCHEDA_XML (?,?,?,?,?,?,?,?)}");
            CS.setString(1, pFunzione);
            CS.setString(2, pReparto);
            CS.setInt(3, pIdenVisita);
            CS.setInt(4, pIdenAnag);

            CS.registerOutParameter(5, Types.VARCHAR);
            CS.registerOutParameter(6, Types.VARCHAR);
            CS.registerOutParameter(7, Types.INTEGER);
            CS.registerOutParameter(8, Types.VARCHAR);

            CS.execute();
            resp[1] = CS.getString(5);
            resp[2] = CS.getString(6);
            resp[3] = CS.getString(7);
            resp[4] = CS.getString(8);

            resp[0] = "OK";

            CS.close();

            if (bReparti.getValue(pReparto, "TRACE_" + pFunzione).equals("S")) {
                dwrTraceUserAction tua = new dwrTraceUserAction(session);
                tua.openTraceUserAction(pFunzione, String.valueOf(pIdenVisita));
            }

        } catch (Exception ex) {
            resp[0] = "KO";
            resp[1] = ex.getMessage();
            log.equals(ex);
        } finally {
            CS = null;
        }
        return resp;
    }*/

    @Deprecated
    public String getValore(String sql, String tipoConnection) {
        String resp = "";
        ResultSet rs = null;
        try {

            if (tipoConnection.equals("WEB")) {
                rs = connW.createStatement().executeQuery(sql);
            } else {
                rs = connD.createStatement().executeQuery(sql);
            }

            if (rs.next()) {
                resp = rs.getString(1);
            }

        } catch (Exception ex) {
            resp = ex.getMessage();
        } finally {
            try {
                rs.getStatement().close();
                rs.close();
            } catch (SQLException e) {
                resp = e.getMessage();
            }
            rs = null;
        }
        return resp;
    }

    public String impSchedaPregressa(int idenVisita, String tipoScheda, int idenScheda) {

        String resp = "";

        CallableStatement CS;
        try {

            CS = connD.prepareCall("{call CC_IMP_SCHEDA_PREGRESSA (?,?,?,?,?)}");

            CS.setInt(1, User.iden_per);
            CS.setInt(2, idenVisita);
            CS.setString(3, tipoScheda);
            CS.setInt(4, idenScheda);
            CS.registerOutParameter(5, Types.VARCHAR);

            CS.execute();
            resp = CS.getString(5);

            CS.close();

        } catch (Exception ex) {
            resp = ex.getMessage();
            log.error(ex);
        } finally {
            CS = null;
        }
        return resp;
    }

    public String getTableResult(String id, String cls, String sql, String tipoConnection) {
        String resp = "OK*";
        try {
            ResultSet rs;
            ResultSetMetaData rsmd;

            if (tipoConnection.equals("WEB")) {
                rs = connW.createStatement().executeQuery(sql);
            } else {
                rs = connD.createStatement().executeQuery(sql);
            }

            rsmd = rs.getMetaData();
            resp += "<table id=\"" + id + "\" class=\"" + cls + "\">\n<tr>\n";
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                resp += "<th>" + rsmd.getColumnLabel(i) + "</th>\n";
            }
            resp += "</tr>\n";
            while (rs.next()) {
                resp += "<tr>\n";
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    resp += "<td>" + chkNullHtml(rs.getString(rsmd.getColumnLabel(i))) + "</td>\n";
                }
                resp += "</tr>\n";
            }
            resp += "</table>\n";
        } catch (Exception ex) {
            resp = "KO*" + ex.getMessage();
            log.error(ex);
        }
        return resp;
    }

    public String[] getUlAlbero(String pReparto, String pProcedura, String classZindex, String[] pTipo, String[] pLabel, String[] pValori) {

        try {
            menuAlbero menu = new menuAlbero(session, pReparto,true);
            for (int i = 0; i < pTipo.length; i++) {
                if (pTipo[i].equals("LONG")) {
                    menu.addLabel(pLabel[i], Long.valueOf(pValori[i]));
                }
                if (pTipo[i].equals("STRING")) {
                    menu.addLabel(pLabel[i], pValori[i]);
                }
            }

            return new String[]{"OK", "", menu.getUl(pReparto, pProcedura, classZindex)};
        } catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO", ex.getMessage(), ""};
        }

    }

    public String[] getUlAlberoRicovero(String pReparto, String pProcedura, String classZindex, String CodiceRicovero, String[] pTipo, String[] pLabel, String[] pValori) {

        try {
            menuAlbero menu = new menuAlbero(session, pReparto,true);
            for (int i = 0; i < pTipo.length; i++) {
                if (pTipo[i].equals("LONG")) {
                    menu.addLabel(pLabel[i], Long.valueOf(pValori[i]));
                }
                if (pTipo[i].equals("STRING")) {
                    menu.addLabel(pLabel[i], pValori[i]);
                }
            }

            return new String[]{"OK", "", menu.getUl(pReparto, pProcedura, classZindex,CodiceRicovero)};
        } catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO", ex.getMessage(), ""};
        }
    }





    public String[] getSectionReloaded(String pTipoSection, int pIden, String pDataFrom, String pDataTo, String pFileName, String pStatementName, String[] pBinds, int pOuts) {
        String[] resp = new String[3];
        resp[0] = "OK";
        try {
            String resp1[] = this.executeStatement(pFileName, pStatementName, pBinds, pOuts);
            if (resp1[0].equals("OK")) {
                String[] resp2 = null;
                if (pTipoSection.equals("TERAPIA")) {
                    resp2 = this.executeStatement("pianoGiornaliero.xml", "ReloadTerapia", new String[]{String.valueOf(pIden), "", "", pDataFrom, pDataTo}, 1);
                } else if (pTipoSection.equals("RILEVAZIONE")) {
                    resp2 = this.executeStatement("pianoGiornaliero.xml", "ReloadRilevazione", new String[]{String.valueOf(pIden), "", "", pDataFrom, pDataTo}, 1);
                } else if (pTipoSection.equals("PROCEDURA")) {
                    resp2 = this.executeStatement("pianoGiornaliero.xml", "ReloadProcedura", new String[]{String.valueOf(pIden), "", "", pDataFrom, pDataTo}, 1);
                }
                resp[1] = resp1[1 + pOuts];
                resp[2] = resp2[2];
            } else {
                resp = resp1;
            }
        } catch (Exception ex) {
            log.error(ex);
            resp[0] = "KO";
            resp[1] = ex.getMessage();
        }
        return resp;
    }

    public String[] executeStatement(String pFileName, String pStatementName, String[] pBinds, int pOuts) {
        StatementFromFile sFF = null;
        try {
            sFF = new StatementFromFile(this.session);
            return sFF.executeStatement(pFileName, pStatementName, pBinds, pOuts);
        } catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO", ex.getMessage()};
        } finally {
            if (sFF != null) {
                sFF.close();
            }
        }
    }

    public String[][] executeBatchStatement(String pFileName, String pStatementName, String[][] pBinds, int pOuts) {
        StatementFromFile sFF = null;
        try {
            sFF = new StatementFromFile(this.session);
            return sFF.executeBatchStatement(pFileName, pStatementName, pBinds, pOuts);
        } catch (Exception ex) {
            log.error(ex);
            return new String[][]{{"KO", ex.getMessage()}};
        } finally {
            if (sFF != null) {
                sFF.close();
            }
        }
    }

    @Deprecated
    public String[][] executeQueryXml(String pFileName, String pStatementName, String[] pBinds) {
        return executeQuery(pFileName, pStatementName, pBinds);
    }

    public String[][] executeQuery(String pFileName, String pStatementName, String[] pBinds) {
        String[][] resp = null;
        ResultSet rs = null;
        ResultSetMetaData rsmd;
        ArrayList<String[]> al = new ArrayList<String[]>();
        StatementFromFile sFF = null;
        String[] ArColums;
        /**
         * genera bidimensionale con il primo elemento di 'log'
         */
        try {
            sFF = new StatementFromFile(this.session);
            rs = sFF.executeQuery(pFileName, pStatementName, pBinds);
            rsmd = rs.getMetaData();
            int nColumn = rsmd.getColumnCount();
            ArColums = new String[nColumn];
            for (int i = 1; i <= nColumn; i++) {
                ArColums[i - 1] = rsmd.getColumnName(i);
            }

            while (rs.next()) {
                String[] ar = new String[nColumn];
                for (int i = 0; i < nColumn; i++) {
                    ar[i] = chkNull(rs.getString(i + 1));
                }
                al.add(ar);
            }

            resp = new String[al.size() + 2][nColumn];
            resp[1] = ArColums;

            for (int i = 0; i < al.size(); i++) {
                resp[i + 2] = al.get(i);
            }
            resp[0][0] = "OK";

        } catch (Exception ex) {
            log.error(ex);
            resp = new String[1][2];
            resp[0] = new String[]{"KO", ex.getMessage()};
        } finally {
            sFF.close();
            rsmd = null;
            rs = null;
        }
        return resp;
    }

    public String[] getConfigurazioneReparto(String pCodCdc) {
        try {
//            return new String[]{"OK", bReparti.getConfigurazioneReparto(pCodCdc).object2js()};
          return new String[]{"OK", bReparti.getConfigurazione(pCodCdc).object2js()};
        } catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO", ex.getMessage()};
        }
    }

    public String[] getValoreConfigurazioneReparto(String pCodCdc,String pKey, String pRicovero) {
        String[] returnArray = null; 
        String returnValue = null; 
    	try {
    		returnValue = bReparti.getValue(pCodCdc, pKey, pRicovero);
    		if ("KO".equalsIgnoreCase(returnValue)){
    			//Non ho trovato i dati lato webserver, li cerco sul db
    			returnArray = executeStatement("configurazioni.xml", "getValueCdc", new String[]{pCodCdc, pKey }, 1);
    		}else{
        		returnArray = new String[]{"OK","",returnValue};    			
    		}
        } catch (Exception ex) {
            log.error(ex);
            returnArray =  new String[]{"KO", ex.getMessage(),""};
        }
    	return returnArray;
    }    
    
    public boolean removeSessionObject(String key) {
        try {
            this.session.removeAttribute(key);
            return true;
        } catch (Exception ex) {
            log.error(ex);
            return false;
        }
    }

    public HashMap executeAction(String scope,String key, /*HashMap parameters*/ String source)  {
        try {

           Map<String, Object> parameters = MapFactory.fromJSonString(source);

            this.sff = new StatementFromFile(session);

            parameters.put(Action.sff, sff);
            parameters.put(Action.session, session);
            parameters.put(Action.synchronizedExecution,false);

            return ActionFactory.executeAction(scope, key, parameters).getOutParameters();

        }catch(Throwable t){
            log.error(t);
            return new ActionResponse(t).getOutParameters();
        }finally{
            this.sff.close();
        }
    }

    private String chkNull(String in) {
        return (in == null ? "" : in);
    }

    private String chkNullHtml(String in) {
        return (in == null ? "&nbsp;" : in);
    }

    public String getBaseUrl() {
    	return Global.getBaseUrl();
    }

    public String getApplicationUrl(String application) {
    	return Global.getApplicationUrl(application.toLowerCase());
    }
}
