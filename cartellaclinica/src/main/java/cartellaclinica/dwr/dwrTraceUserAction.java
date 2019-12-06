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

import imago.crypto.ImagoCryptoException;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.Array;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Hashtable;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import oracle.jdbc.OracleCallableStatement;
import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;

import org.directwebremoting.WebContextFactory;

import plugin.getPoolConnection;
import core.Global;

public class dwrTraceUserAction {

    private String tipoChiamata = "interna";

    private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(dwrTraceUserAction.class);
    private HttpSession session = null;
    private ServletContext context = null;
    private Connection conn = null;
    private Hashtable<String, String> hash = new Hashtable<String, String>();

    public dwrTraceUserAction() throws SqlQueryException, ClassNotFoundException, ImagoCryptoException, InstantiationException, IllegalAccessException {
        init();
    }

    public dwrTraceUserAction(HttpSession pSess) throws SqlQueryException, ClassNotFoundException, ImagoCryptoException, InstantiationException, IllegalAccessException {
        session = pSess;
        init();
    }

    private void init() throws IllegalAccessException, InstantiationException, ImagoCryptoException, ClassNotFoundException, SqlQueryException {

    	
    	if (session == null) {
            session = WebContextFactory.get().getSession(false); //caso dwr
            tipoChiamata = "dwr";
        }
    	
        if (session == null) { //caso chiamata esterna ad es visualizzatore
            getPoolConnection myPoolConnection = null;

            context = (ServletContext) (WebContextFactory.get()).getServletContext();
            myPoolConnection = new getPoolConnection(getContext("PoolName"), getContext("WebUser"), getContext("WebPwd"), getContext("CryptType"));
            conn = myPoolConnection.getConnection();
            tipoChiamata = "esterna";

            try {
                setParametro("ip", InetAddress.getLocalHost().getHostAddress());
            } catch (UnknownHostException ex1) {
                setParametro("ip", "");
            }

            try {
                this.setParametro("nomeClient", InetAddress.getLocalHost().getCanonicalHostName());
            } catch (UnknownHostException ex) {
                setParametro("nomeClient", "");
            }

        } else {

            baseUser logged_user = Global.getUser(session);
            basePC infoPC = (basePC) session.getAttribute("parametri_pc");

            setParametro("webUser", logged_user.login);
            setParametro("descr", logged_user.description);
            setParametro("ip", infoPC.ip);
            setParametro("nomeClient", infoPC.nome_host);

            conn = logged_user.db.getWebConnection();
        }
        
    }

    private String getContext(String param) {
        return context.getInitParameter(param);
    }

    private void setParametro(String key, String valore) {
        if (hash.containsKey(key))
            hash.remove(key);
        hash.put(key, valore);
    }

    private String getParametro(String key) {
        return chkNull(hash.get(key));
    }

    private String chkNull(String in) {
        if (in == null)
            return "";
        else
            return in;
    }

    private String callTraceUserAction(String actionIn, String[] funzioneIn, String[] id) {
        OracleCallableStatement cs = null;
        String sOut = "";

        try {

            Array oraId = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH", conn), conn, id);
            Array oraFunzione = new ARRAY(ArrayDescriptor.createDescriptor("ARRAY_HASH", conn), conn, funzioneIn);

            cs = (OracleCallableStatement) conn.prepareCall("{call IMAGOWEB.SP_TRACEUSERACTION( ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,?,?) }");

            cs.setString(1, getParametro("webUser"));
            cs.setString(2, getParametro("descr"));
            cs.setString(3, getParametro("ip"));
            cs.setString(4, actionIn);
            cs.setString(5, getParametro("nomeClient"));
            cs.setString(6, getParametro("idenAnag"));
            cs.setString(7, getParametro("idenEsame"));
            cs.setString(8, getParametro("idenRef"));
            cs.setArray(9, oraId);
            cs.setArray(10, oraFunzione);
            cs.setString(11, getParametro("reparto"));
            cs.setString(12, getParametro("idenVisita"));
       //     cs.setString(13, getParametro("note"));

            cs.execute();

        } catch (Exception e) {
            sOut = e.getMessage();
            logInterface.error(e.getMessage(), e);
        } finally {

            try {
                cs.close();
            } catch (SQLException e) {
                cs = null;
            }
         /*   if (!this.tipoChiamata.equals("interna"))
                try {
                    conn.close();
                } catch (SQLException e) {
                    conn = null;
                }*/
        }

        return sOut;

    }

    private String callTraceUserAction(String actionIn, String funzioneIn, String id) {
        return callTraceUserAction(actionIn, new String[] {funzioneIn}, new String[] {id});
    }

    private String callTraceUserAction(String actionIn, String funzioneIn, String[] id) {
        String[] arFunzione = new String[id.length];
        for (int i = 0; i < id.length; i++)
            arFunzione[i] = funzioneIn;
        return callTraceUserAction(actionIn, arFunzione, id);
    }

    public String callTraceUserAction(String repartoIn, String actionIn, String id, String funzioneIn) {

        setParametro("reparto", repartoIn);

        return callTraceUserAction(actionIn, funzioneIn, id);
    }

    public String openTraceUserAction(String funzioneIn, String id, String idenAnag, String idenVisita) {
        return openTraceUserAction(new String[] {funzioneIn}, new String[] {id}, idenAnag, idenVisita);
    }

    public String openTraceUserAction(String funzioneIn, String[] id, String idenAnag, String idenVisita) {
        String[] arFunzione = new String[id.length];
        for (int i = 0; i < id.length; i++)
            arFunzione[i] = funzioneIn;
        return openTraceUserAction(arFunzione, id, idenAnag, idenVisita);
    }

    public String openTraceUserAction(String[] funzioneIn, String[] id, String idenAnag, String idenVisita) {
        setParametro("idenAnag", idenAnag);
        setParametro("idenVisita", idenVisita);
        return callTraceUserAction("APRI", funzioneIn, id);
    }
    
    public String openTraceUserActionEmergenza(String funzioneIn,String idenAnag,String action,String note, String idenVisita) {
        setParametro("idenAnag", idenAnag);
        setParametro("idenVisita", idenVisita);
        setParametro("action", action);
        setParametro("note", note);
        return callTraceUserAction(action, funzioneIn,"EMERGENZA");
    }

    public String openTraceUserAction(String funzioneIn, String id) {
        return openTraceUserAction(new String[] {funzioneIn}, new String[] {id});
    }

    public String openTraceUserAction(String funzioneIn, String[] id) {
        String[] arFunzione = new String[id.length];
        for (int i = 0; i < id.length; i++)
            arFunzione[i] = funzioneIn;
        return openTraceUserAction(arFunzione, id);
    }

    public String openTraceUserAction(String[] funzioneIn, String[] id) {
        return callTraceUserAction("APRI", funzioneIn, id);
    }
    
    public String openTraceUserAction(String action,String funzioneIn, String id) {
        return callTraceUserAction(action, funzioneIn, id);
    }

    public String closeTraceUserAction(String funzioneIn, String id) {
        return closeTraceUserAction(new String[] {funzioneIn}, new String[] {id});
    }

  /*  public String closeTraceUserAction(String funzioneIn, String[] id) {
        String[] arFunzione = new String[id.length];
        for (int i = 0; i < id.length; i++)
            arFunzione[i] = funzioneIn;
        return closeTraceUserAction(arFunzione, id);
    }*/

    private String closeTraceUserAction(String[] funzioneIn, String[] id) {
        return callTraceUserAction("CHIUDI", funzioneIn, id);
    }
}
