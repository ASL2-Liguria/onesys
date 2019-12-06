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

import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Enumeration;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import matteos.database.DbUtils;
import matteos.servlets.ImagoServletException;
import matteos.servlets.polaris.Engine4ServletPolarisHtml;
import matteos.utils.XmlUtils;
import oracle.sql.CLOB;

import org.apache.ecs.Doctype;
import org.apache.ecs.html.Form;
import org.apache.ecs.html.Input;
import org.apache.ecs.html.Script;
import org.apache.ecs.html.Title;
import org.jdom.Element;

import cartellaclinica.gestioneTerapia.elements.GruppoFarmaci;
import cartellaclinica.gestioneTerapia.elements.Terapia;
import cartellaclinica.gestioneTerapia.elements.tools.TerapiaXmlConst;
import java.util.HashMap;
import java.util.Iterator;

public class TerapiaEngine extends Engine4ServletPolarisHtml {

    private enum Stato {
        ANNULLACONFERMA, BOZZA, CONFERMATA, DUPLICA, LETTURA, MODELLO;
    }
    
    private Stato STATO;
    private String select;
    private int iden;
    private final String terapia_sessione = "schede_terapia_correnti";
    private HashMap<String,String> parameters = new HashMap<String, String>();

    public TerapiaEngine(ServletContext context, HttpServletRequest request, HttpServletResponse response) throws ImagoServletException {
        super(context, request, response);
        
        Iterator it = request.getParameterMap().keySet().iterator();
        while(it.hasNext()){
            String key = (String) it.next();
            parameters.put(key, request.getParameter(key)); 
        }
    }

    private void checkRequiredParameters(String[] required) throws ImagoServletException {
        for (String p : required) {
            //if (DbUtils.isVuoto(request.getParameter(p))) {
            if (DbUtils.isVuoto(parameters.get(p))) {
                throw new ImagoServletException("Parametro richiesto " + p + " non valorizzato.");
            }
        }
    }

    public TerapiaEngine() throws ImagoServletException {
        super();
    }

    @Override
    public void work() throws ImagoServletException {

        doc.setDoctype(new Doctype.Html401Transitional());

        Form EXTERN = new Form();
        EXTERN.setName("EXTERN");
        Enumeration<String> enm = request.getParameterNames();
        while (enm.hasMoreElements()) {
            String name = enm.nextElement();
            String value = request.getParameter(name);
            EXTERN.addElement(new Input(Input.HIDDEN, name, value));
        }
        doc.appendBody(EXTERN);

        STATO = Stato.valueOf(request.getParameter("STATO"));

        String ID_SESSIONE = request.getParameter("ID_SESSIONE");

        /*switch (STATO) {
            case BOZZA:
                checkRequiredParameters(new String[]{"IDEN_CONF_SCHEDA", "IDEN_VISITA", "ID_SESSIONE"});
                int iden_conf_scheda = Integer.parseInt(request.getParameter("IDEN_CONF_SCHEDA"));
                PreparedStatement ps = null;
                ResultSet rst = null;
                try {
                    ps = getDataConnection().prepareStatement("select IDEN from VIEW_CC_TERAPIE_SCHEDA where IDEN_CONF_SCHEDA=? and UTE_INS=? and IDEN_VISITA=? and STATO='I'");
                    ps.setInt(1, iden_conf_scheda);
                    ps.setInt(2, logged_user.iden_per);
                    ps.setInt(3, Integer.parseInt(request.getParameter("IDEN_VISITA")));
                    rst = ps.executeQuery();
                    if (rst.next()) {
                        iden = rst.getInt(1);
                        select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                    } else {
                        iden = iden_conf_scheda;
                        select = "select CONFIGURAZIONE , PATH_CONFIGURAZIONE , ATTRIBUTO_DESCR , ATTRIBUTO_TIPO_TERAPIA, IDEN from VIEW_TERAPIE_CONF_SCHEDA where IDEN=?";
                    }
                } catch (SQLException e) {
                    log.error(e);
                } finally {
                    DbUtils.close(rst);
                    rst = null;
                    DbUtils.close(ps);
                    ps = null;
                }
                break;
            case ANNULLACONFERMA:
                checkRequiredParameters(new String[]{"IDEN_TERAPIA", "IDEN_SCHEDA"});
                CallableStatement cs = null;
                try {
                    String sql = "declare";
                    sql += "  vIdenTerapia number:=?;";
                    sql += "begin";
                    sql += "  update CC_TERAPIE_RICOVERO set STATO='I' where IDEN =vIdenTerapia;";
                    //sql       += "  update CC_TERAPIE_SCHEDA set stato='X' where IDEN_TERAPIA=vIdenTerapia;";
                    sql += "  delete from CC_TERAPIE_DETTAGLI where IDEN_TERAPIA=vIdenTerapia;";
                    sql += "end;";
                    cs = getDataConnection().prepareCall(sql);
                    cs.setInt(1, Integer.parseInt(request.getParameter("IDEN_TERAPIA")));
                    cs.execute();
                } catch (SQLException e) {
                    log.error(e);
                    doc.appendBody(new Script("alert('" + e.getMessage() + "');"));
                    return;
                } finally {
                    DbUtils.close(cs);
                    cs = null;
                }
            case CONFERMATA:
            case LETTURA:
                try {
                    checkRequiredParameters(new String[]{"IDEN_SCHEDA"});
                    select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                    iden = Integer.parseInt(request.getParameter("IDEN_SCHEDA"));
                } catch (Exception e) {
                    checkRequiredParameters(new String[]{"IDEN_TERAPIA"});
                    select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN_TERAPIA=? and DATA_FINE not null";
                    iden = Integer.parseInt(request.getParameter("IDEN_TERAPIA"));
                }
                break;
            case DUPLICA:
                checkRequiredParameters(new String[]{"IDEN_SCHEDA", "ID_SESSIONE"});
                iden = Integer.parseInt(request.getParameter("IDEN_SCHEDA"));
                select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                break;
            case MODELLO:
                checkRequiredParameters(new String[]{"IDEN_MODELLO", "ID_SESSIONE"});
                iden = Integer.parseInt(request.getParameter("IDEN_MODELLO"));
                select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_MODELLI where IDEN=?";
                break;
            default:
                throw new ImagoServletException("Non e' stato specificato un parametro necessario");
        }*/

        try {
            /*Terapia t = getTerapiaFromDb();
            
            setSessionObject(ID_SESSIONE, t);*/
        
            Terapia t = getTerapia(ID_SESSIONE);
            
            doc.appendBody(t.getDiv());
        
        } catch (Exception e) {
            log.error(e);
            doc.appendBody(new Script("alert('" + e.getMessage() + "');"));
        }
    }

    private Terapia getTerapia(String ID_SESSIONE) throws Exception{
        
        switch (STATO) {
            case BOZZA:
                checkRequiredParameters(new String[]{"IDEN_CONF_SCHEDA", "IDEN_VISITA", "ID_SESSIONE"});
                //int iden_conf_scheda = Integer.parseInt(request.getParameter("IDEN_CONF_SCHEDA"));
                int iden_conf_scheda = Integer.parseInt( (String) parameters.get("IDEN_CONF_SCHEDA"));
                PreparedStatement ps = null;
                ResultSet rst = null;
                try {
                    ps = getDataConnection().prepareStatement("select IDEN from VIEW_CC_TERAPIE_SCHEDA where IDEN_CONF_SCHEDA=? and UTE_INS=? and IDEN_VISITA=? and STATO='I'");
                    ps.setInt(1, iden_conf_scheda);
                    ps.setInt(2, logged_user.iden_per);
                    //ps.setInt(3, Integer.parseInt(request.getParameter("IDEN_VISITA")));
                    ps.setInt(3, Integer.parseInt( (String) parameters.get("IDEN_CONF_SCHEDA")));
                    
                    rst = ps.executeQuery();
                    if (rst.next()) {
                        iden = rst.getInt(1);
                        select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                    } else {
                        iden = iden_conf_scheda;
                        select = "select CONFIGURAZIONE , PATH_CONFIGURAZIONE , ATTRIBUTO_DESCR , ATTRIBUTO_TIPO_TERAPIA, IDEN from VIEW_TERAPIE_CONF_SCHEDA where IDEN=?";
                    }
                } catch (SQLException e) {
                    log.error(e);
                } finally {
                    DbUtils.close(rst);
                    rst = null;
                    DbUtils.close(ps);
                    ps = null;
                }
                break;
            case ANNULLACONFERMA:
                checkRequiredParameters(new String[]{"IDEN_TERAPIA", "IDEN_SCHEDA"});
                CallableStatement cs = null;
                try {
                    String sql = "declare";
                    sql += "  vIdenTerapia number:=?;";
                    sql += "begin";
                    sql += "  update CC_TERAPIE_RICOVERO set STATO='I' where IDEN =vIdenTerapia;";                    
                    sql += "  delete from CC_TERAPIE_DETTAGLI where IDEN_TERAPIA=vIdenTerapia;";
                    sql += "end;";
                    cs = getDataConnection().prepareCall(sql);
                    //cs.setInt(1, Integer.parseInt(request.getParameter("IDEN_TERAPIA")));
                    cs.setInt(1, Integer.parseInt((String) parameters.get("IDEN_TERAPIA")));
                    cs.execute();
                } catch (SQLException e) {
                    log.error(e);
                    throw e;
                } finally {
                    DbUtils.close(cs);
                    cs = null;
                }
            case CONFERMATA:
            case LETTURA:
                try {
                    checkRequiredParameters(new String[]{"IDEN_SCHEDA"});
                    select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                    //iden = Integer.parseInt(request.getParameter("IDEN_SCHEDA"));
                    iden = Integer.parseInt((String) parameters.get("IDEN_SCHEDA"));
                } catch (Exception e) {
                    checkRequiredParameters(new String[]{"IDEN_TERAPIA"});
                    select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN_TERAPIA=? and DATA_FINE not null";
                   // iden = Integer.parseInt(request.getParameter("IDEN_TERAPIA"));
                    iden = Integer.parseInt((String) parameters.get("IDEN_TERAPIA"));
                }
                break;
            case DUPLICA:
                checkRequiredParameters(new String[]{"IDEN_SCHEDA", "ID_SESSIONE"});
                //iden = Integer.parseInt(request.getParameter("IDEN_SCHEDA"));
                 iden = Integer.parseInt((String) parameters.get("IDEN_SCHEDA"));
                select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_SCHEDA where IDEN=?";
                break;
            case MODELLO:
                checkRequiredParameters(new String[]{"IDEN_MODELLO", "ID_SESSIONE"});
                //iden = Integer.parseInt(request.getParameter("IDEN_MODELLO"));
                 iden = Integer.parseInt((String) parameters.get("IDEN_MODELLO"));
                select = "select IMPOSTAZIONI , null from VIEW_CC_TERAPIE_MODELLI where IDEN=?";
                break;
            default:
                throw new ImagoServletException("Non e' stato specificato un parametro necessario");
        }       
        
            Terapia t = getTerapiaFromDb();
            
            setSessionObject(ID_SESSIONE, t);        
            
            return t;
    }
    
    @Override
    public Title getTitle() {
        return new Title("");
    }

    private GruppoFarmaci getGruppoFarmaci(Terapia t, String TIPO_GRUPPO) throws Exception {
        Element gfelem = t.getElementByXPath("//" + GruppoFarmaci.class.getSimpleName() + "[@tipo=" + TIPO_GRUPPO + "]");
        return (GruppoFarmaci) t.getInstance(gfelem);
    }

    public String[] getFarmaco(String TIPO_GRUPPO, String IDEN_FARMACO, String ID_SESSIONE) {
        try {
            Terapia t = getTerapiaFromSession(ID_SESSIONE);
            GruppoFarmaci gf = getGruppoFarmaci(t, TIPO_GRUPPO);
            String html = gf.addFarmaco(IDEN_FARMACO).getHtml();
            return new String[]{"OK", html};
        } catch (Exception e) {
            log.error(e);
            return new String[]{"KO", e.getMessage()};
        }
    }

    public String[] removeFarmaco(String TIPO_GRUPPO, String IDEN_FARMACO, String ID_SESSIONE) {
        try {
            Terapia t = getTerapiaFromSession(ID_SESSIONE);
            GruppoFarmaci gf = getGruppoFarmaci(t, TIPO_GRUPPO);
            if (gf.removeFarmaco(IDEN_FARMACO)) {
                return new String[]{"OK", ""};
            } else {
                return new String[]{"KO", "Farmaco non rimosso"};
            }
        } catch (Exception e) {
            log.error(e);
            return new String[]{"KO", ""};
        }
    }

    private Terapia getTerapiaFromDb() throws Exception {
    	//checkRequiredParameters(new String[]{"REPARTO"});
    	PreparedStatement ps = null;
        ResultSet rst = null;
        Clob clobdoc = null;
        try {

            ps = getDataConnection().prepareStatement(select);
            ps.setInt(1, iden);
            rst = ps.executeQuery();
            if (rst.next()) {
                Element el = null;
                if (rst.getString(2) != null) {
                    el = XmlUtils.parseJDomDocumentFromFile(session.getServletContext().getRealPath(".") + "/WEB-INF/templates/" + rst.getString(2)).getRootElement();
                    el.setAttribute("descr", rst.getString(3)).setAttribute("TIPO_TERAPIA", rst.getString(4)).setAttribute("IDEN_CONF_SCHEDA", rst.getString(5));
                } else {
                    clobdoc = rst.getClob(1);
                    el = XmlUtils.parseJDomDocumentFromInputStream(clobdoc.getAsciiStream()).getRootElement();
                }

                Terapia t = new Terapia(el, null, context, request, response, logged_user,parameters.get("REPARTO"));
                switch (STATO) {
                    case ANNULLACONFERMA:
                    case BOZZA:
                    case DUPLICA:
                    case MODELLO:
                        t.setModalitaAccesso(TerapiaXmlConst.Accesso.inserimento);
                        break;
                    case CONFERMATA:
                        t.setModalitaAccesso(TerapiaXmlConst.Accesso.modifica);
                        break;
                    case LETTURA:
                        t.setModalitaAccesso(TerapiaXmlConst.Accesso.lettura);
                        break;
                }
                t.setAttributes();
                return t;
            }
            log.warn("Scheda terapia non generata.");
            return null;
        } catch (Exception e) {
            throw e;
        } finally {
            if (clobdoc != null) {
                try {
                    clobdoc.free();
                } catch (Exception e) {
                }
            }
            clobdoc = null;
            DbUtils.close(rst);
            DbUtils.close(ps);
            rst = null;
            ps = null;
        }
    }

    public void saveInSession(String[] xpaths, String[] values, String ID_SESSIONE) {
        Terapia t = getTerapiaFromSession(ID_SESSIONE);
        t.setAllValuesByXpath(xpaths, values);
    }
     
    public Map<String,String> setInSessionAndSaveByIdenScheda(String procedura, String[] xpaths, String[] values, String IDEN_VISITA, String IDEN_SCHEDA, String CODICE_REPARTO, String ID_SESSIONE, String STATO_TERAPIA, String IDEN_CICLO, String NUMERO_CICLO){        
        try {        
            setTerapiaByIdenScheda(IDEN_SCHEDA);
            Map<String,String> parameters = new HashMap<String, String>();
            parameters.put("ID_SESSIONE",ID_SESSIONE);
            parameters.put("PROCEDURA",procedura);
            parameters.put("IDEN_VISITA",IDEN_VISITA);
            parameters.put("IDEN_SCHEDA","0");
            parameters.put("CODICE_REPARTO",CODICE_REPARTO);
            parameters.put("STATO_TERAPIA",STATO_TERAPIA);
            parameters.put("IDEN_CICLO",IDEN_CICLO);
            parameters.put("NUMERO_CICLO",NUMERO_CICLO);
            parameters.put("IDEN_PARENT",null);
            
            //return esegui(procedura,  xpaths,  values, IDEN_VISITA, "0",  CODICE_REPARTO,  ID_SESSIONE,  STATO_TERAPIA,  IDEN_CICLO,  NUMERO_CICLO);
            return esegui(parameters,xpaths, values);
        } catch (Exception ex) {
            log.error(ex.getMessage());
            Map<String,String> out = new HashMap<String,String>();
            out.put("success","KO");
            out.put("message",ex.getMessage());
            return out;
        }
        
    }
    
   //public HashMap<String,String>/*String[]*/ esegui(String procedura, String[] xpaths, String[] values, String IDEN_VISITA, String IDEN_SCHEDA, String CODICE_REPARTO, String ID_SESSIONE, String STATO_TERAPIA, String IDEN_CICLO, String NUMERO_CICLO) {
    public HashMap<String,String>/*String[]*/ esegui(Map<String,String> parameters, String[] xpaths, String[] values) {
        CallableStatement cs = null;
        ResultSet rst = null;
        Clob impostazioni = null;
        
        String ID_SESSIONE = parameters.get("ID_SESSIONE");
        String PROCEDURA = parameters.get("PROCEDURA");
        String IDEN_VISITA = parameters.get("IDEN_VISITA");
        String IDEN_SCHEDA = parameters.get("IDEN_SCHEDA");
        String IDEN_TERAPIA = parameters.get("IDEN_TERAPIA");
        String CODICE_REPARTO = parameters.get("CODICE_REPARTO");
        String STATO_TERAPIA = parameters.get("STATO_TERAPIA");
        String IDEN_CICLO = parameters.get("IDEN_CICLO");
        String NUMERO_CICLO = parameters.get("NUMERO_CICLO");
        String IDEN_PARENT = parameters.get("IDEN_PARENT");
        
        try {

            Terapia t = getTerapiaFromSession(ID_SESSIONE);
            t.setAllValuesByXpath(xpaths, values);
            Connection conn = getDataConnection();
            cs = conn.prepareCall("begin CC_TERAPIA.esegui(?,?,?,?,?,?,?,?,?,?,?,?,?); end;");

            cs.setString(1, PROCEDURA);

            impostazioni = CLOB.createTemporary(conn, true, CLOB.DURATION_SESSION);
            impostazioni.setString(1, t.getXml());
            cs.setClob(2, impostazioni);

            cs.setInt(3, Integer.parseInt(IDEN_VISITA));
            cs.setInt(4, logged_user.iden_per);

            if (!DbUtils.isVuoto(IDEN_SCHEDA)) {
                cs.setInt(5, Integer.parseInt(IDEN_SCHEDA));
            } else {
                cs.setInt(5, 0);
            }

            cs.registerOutParameter(5, Types.INTEGER);

            cs.setString(6, CODICE_REPARTO);
            cs.setString(7, STATO_TERAPIA);

            if(IDEN_TERAPIA == null){
                cs.setNull(8, Types.INTEGER);
            }else{
                cs.setInt(8, Integer.valueOf(IDEN_TERAPIA));
            }
            cs.registerOutParameter(8, Types.INTEGER);

            cs.registerOutParameter(9, Types.INTEGER);
            cs.registerOutParameter(12, Types.VARCHAR);
            cs.registerOutParameter(13, Types.VARCHAR);
            if (IDEN_CICLO != null && !IDEN_CICLO.equals("")) {
                cs.setInt(9, Integer.parseInt(IDEN_CICLO));
            } else {
                cs.setNull(9, Types.INTEGER);
            }

            if (NUMERO_CICLO != null && !NUMERO_CICLO.equals("")) {
                cs.setInt(10, Integer.valueOf(NUMERO_CICLO));
            } else {
                cs.setNull(10, Types.INTEGER);
            }
           
            if (IDEN_PARENT != null && !IDEN_PARENT.equals("")) {
            	cs.setInt(11, Integer.valueOf(IDEN_PARENT));
            } else {
            	cs.setNull(11, Types.INTEGER);
            }

            int numprove = 0;
            boolean done = false;
            while (!done && numprove <= 3) {
                try {
                    cs.execute();
                    done = true;
                } catch (SQLException sqle) {
                    if (DbUtils.ifOracleInvalidPackageState(sqle)) {
                        numprove++;

                    } else {
                        throw sqle;
                    }
                }
            }
            int iden_scheda = cs.getInt(5);
            int iden_terapia = cs.getInt(8);
            int iden_ciclo = cs.getInt(9);
            String success = cs.getString(12);
            String message = cs.getString(13);
            
            HashMap<String,String> out = new HashMap<String,String>();
            
            out.put("success",success);
            out.put("message",message);
            out.put("iden_scheda",String.valueOf(iden_scheda));
            out.put("iden_terapia",String.valueOf(iden_terapia));
            out.put("iden_ciclo",String.valueOf(iden_ciclo));
            
            return out;
            //return new String[]{success, message, iden_scheda + "", String.valueOf(iden_terapia), String.valueOf(iden_ciclo)};
        } catch (Exception e) {
            log.error(e);
            HashMap<String,String> out = new HashMap<String,String>();
            out.put("success","KO");
            out.put("message",e.getMessage());
            return out;
            //return new String[]{"KO", e.getMessage()};
        } finally {
            if (impostazioni != null) {
                try {
                    impostazioni.free();
                } catch (Exception e) {
                }
            }
            impostazioni = null;
            DbUtils.close(rst);
            rst = null;
            DbUtils.close(cs);
            cs = null;
        }
    }

    private Terapia getTerapiaFromSession(String ID_SESSIONE) {
        return ((Map<String, Terapia>) session.getAttribute(terapia_sessione)).get(ID_SESSIONE);
    }

    private void setSessionObject(String ID_SESSIONE,Terapia TERAPIA) {
        if (session != null) {
            Map<String, Terapia> ht = (Map<String, Terapia>) session.getAttribute(terapia_sessione);
            if (ht == null) {
                ht = new HashMap<String, Terapia>();
                session.setAttribute(terapia_sessione, ht);
            } 
            ht.put(ID_SESSIONE, TERAPIA);
        }
    }

    public void removeSessionObject(String ID_SESSIONE) {
        Map<String, Terapia> ht = (Map<String, Terapia>) session.getAttribute(terapia_sessione);
        ht.remove(ID_SESSIONE);

        if (ht.size() < 1) {
            session.removeAttribute(this.terapia_sessione);
        }
    }
    
    public void removeSessionObjects() {
        session.removeAttribute(this.terapia_sessione);
    }    
    
    public String getTerapiaByIdenScheda(String IDEN_SCHEDA){
        try {
            
            setTerapiaByIdenScheda(IDEN_SCHEDA);            
            return "OK";
        } catch (Exception ex) {
            log.error(ex.getMessage());
           return "KO"; 
        }
    }
    
    private void setTerapiaByIdenScheda(String IDEN_SCHEDA) throws Exception{
            STATO = Stato.valueOf("CONFERMATA");
            parameters.put("IDEN_SCHEDA",IDEN_SCHEDA);
            
            getTerapia(IDEN_SCHEDA);        
    }
    
}
