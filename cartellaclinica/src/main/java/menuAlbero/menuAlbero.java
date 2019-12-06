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
package menuAlbero;

import generic.statements.StatementFromFile;
import imago.http.classDivHtmlObject;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpSession;

import menuAlbero.dati.objReplace;
import oracle.jdbc.OraclePreparedStatement;
import configurazioneReparto.baseReparti;
import core.Global;
import core.cache.CacheManager;

public class menuAlbero {


    private Connection connW;
    private Connection connD;
    private String reparto,tipoUtente,procedura;
    private ArrayList<objReplace> lstReplace;
    private classDivHtmlObject divMenu;
    private StatementFromFile sff;
    private baseUser bUtente;
    private basePC bPc;
    private baseReparti bReparti;
    
    public menuAlbero(HttpSession session,String pReparto) throws  SqlQueryException {
        bUtente = Global.getUser(session);
        bPc = (basePC) session.getAttribute("parametri_pc");
        connW = bUtente.db.getWebConnection();
        connD = bUtente.db.getDataConnection();
        tipoUtente = bUtente.tipo;
        reparto = pReparto;
        lstReplace = new ArrayList<objReplace>();
        try {
            sff = new StatementFromFile(session);
        } catch (Exception ex) {
            Logger.getLogger(menuAlbero.class.getName()).log(Level.SEVERE, null, ex);
        }
        bReparti = Global.getReparti(session);
    }
    public menuAlbero(HttpSession session,String pReparto,boolean setDefaultLabel) throws  SqlQueryException {
        this(session,pReparto);
        if(setDefaultLabel) {
            this.setDefaultLabel();
        }
    }
    public menuAlbero(HttpSession session,String pReparto,String pProcedura) throws  SqlQueryException, SQLException {
        this(session,pReparto);
        this.procedura=pProcedura;
        setMenu(pReparto,procedura);
    }
    public menuAlbero(HttpSession session,String pReparto,String pProcedura,boolean setDefaultLabel) throws  SqlQueryException, SQLException {
        this(session,pReparto,pProcedura);
        if(setDefaultLabel) {
            this.setDefaultLabel();
        }
    }

    private void setDefaultLabel(){
        addLabel("idenPer",Long.valueOf(bUtente.iden_per));
        addLabel("hostName",bPc.nome_host);
        addLabel("webUser",bUtente.login);
        addLabel("tipoUte",bUtente.tipo);
    }
    public String getMenu(){
        //divMenu.appendSome("<br style='clear:left'/>\n");
        return divMenu.toString();
    }

    public void setMenu(String pReparto,String pProcedura) throws SqlQueryException, SQLException{
        setMenu(pReparto,pProcedura,"myslidemenu","z99");
    }
    public void setMenu (String pReparto,String pProcedura,String idMenu) throws SQLException,SqlQueryException {
        setMenu(pReparto,pProcedura,idMenu,"z99");
    }
    public void setMenu(String pReparto,String pProcedura,String idMenu,String classZindex) throws SqlQueryException, SQLException {

        divMenu = new classDivHtmlObject(idMenu);
        divMenu.addAttribute("class","jqueryslidemenu");
        divMenu.appendSome(getUl(pReparto,pProcedura,classZindex));

    }

    public void setMenu(String pReparto,String pProcedura,String idMenu,String classZindex,String pCodiceRicovero) throws SqlQueryException, SQLException {

        divMenu = new classDivHtmlObject(idMenu);
        divMenu.addAttribute("class","jqueryslidemenu");
        divMenu.appendSome(getUl(pReparto,pProcedura,classZindex,pCodiceRicovero));

    }

    public String getUl(String pReparto,String pProcedura)throws SqlQueryException, SQLException{
        return getUl(pReparto,pProcedura,"z99");
    }

    public String getUl(String pReparto,String pProcedura,String classZindex)throws SqlQueryException, SQLException{   	
    	ResultSet rs = null;
        try {
        	reparto = bReparti.getValue(pReparto, pProcedura, "");
        	if ("".equalsIgnoreCase(reparto)){
        		rs = this.sff.executeQuery("menu.xml", "menuAlbero.getConfigurazioneCdc",new String[]{pReparto,pProcedura});
        		rs.next();
        		reparto = rs.getString(1);
        	}
        } catch (Exception ex) {
            Logger.getLogger(menuAlbero.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
            rs.close();
            this.sff.close();
        }
        return drawFactory(pReparto,reparto,pProcedura,"");
    }

    public String getUl(String pReparto,String pProcedura,String classZindex, String pCodiceRicovero)throws SqlQueryException, SQLException{
    	ResultSet rs = null;
        try {
            reparto = bReparti.getValue(pReparto, pProcedura, pCodiceRicovero);
            if ("".equalsIgnoreCase(reparto)){
            	rs = this.sff.executeQuery("menu.xml", "menuAlbero.getConfigurazioneCdcRicovero",new String[]{pReparto,pProcedura,pCodiceRicovero});
                rs.next();
                reparto = rs.getString(1);            	
            }
        } catch (Exception ex) {
            Logger.getLogger(menuAlbero.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
        	if (rs != null){
                rs.close();        		
        	}
            this.sff.close();
        }
        return drawFactory(pReparto,reparto,pProcedura,pCodiceRicovero);
    }

    public String draw(String pReparto,String pProcedura,String classZindex) throws SqlQueryException, SQLException{
        reparto = pReparto;
        procedura = pProcedura;

        String items = "";

        PreparedStatement ps;
        ResultSet rs;

        Hashtable<String,String> hashRiferimenti = new Hashtable<String,String>();
        String[] arRiferimenti;

        ps = connW.prepareCall("select * from CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_padre is null  order by ordinamento");
        ps.setString(1,procedura);
        if(reparto == null){
            ps.setNull(2, Types.VARCHAR);
        }else{
            ps.setString(2, reparto);
        }
        ps.setString(3, tipoUtente);
        rs = ps.executeQuery();



        while (rs.next()) {

            if(checkVoceMenu(chkNull(rs.getString("QUERY_CONTROLLO")))){
            	items += "<li><a href=\"#\"";
                items += " onclick=\"" + chkNull(rs.getString("FUNZIONE")) +"\"";
                items += " class=\"" + chkNull(rs.getString("GRUPPO")) + "\">" + chkNull(rs.getString("LABEL"));

                if (rs.getString("IDEN_FIGLIO") != null) {
                    items += gestFigliInner(rs.getInt("IDEN_FIGLIO"));
                }

                items +=  "</a>\n";

                if (rs.getString("IDEN_FIGLIO") != null) {
                    items += gestFigli(rs.getInt("IDEN_FIGLIO"));
                }

                if (rs.getString("QUERY") != null) {
                    try {
                        if (rs.getString("RIFERIMENTI") != null) {
                            arRiferimenti = rs.getString("RIFERIMENTI").split("§");
                            for (int i = 0; i < arRiferimenti.length; i++) {
                                hashRiferimenti.put(arRiferimenti[i].split("=")[0],rs.getString(arRiferimenti[i].split("=")[1]));
                            }
                        }
                    } catch (Exception ex) {}
                    gestQuery(rs.getString("QUERY"), hashRiferimenti);
                    hashRiferimenti = new Hashtable<String, String>();
                }

                items += "</li>\n";
            }
        }
        rs.close();
        ps.close();

        return "<ul class="+classZindex+">\n" + items + "</ul>\n";
    }

    private String gestQuery(String query,Hashtable<String,String> riferimenti) throws SqlQueryException, SQLException{

        Hashtable<String,String> hashRiferimenti = new Hashtable<String,String>();
        String[] arRiferimenti;

        String items = "";

        OraclePreparedStatement psQuery;
        ResultSet rsQuery;

        String key;

        psQuery = (OraclePreparedStatement) connD.prepareStatement(query);

        this.doReplaces(psQuery);

        Enumeration e = riferimenti.keys();
        while (e.hasMoreElements())
        {
            key = (String) e.nextElement();
            try{doSingleReplace(psQuery,key, riferimenti.get(key));}catch(SQLException ex){/**/}
        }

        rsQuery= psQuery.executeQuery();
        while(rsQuery.next()){
            if(checkVoceMenu(getRsField(rsQuery,"QUERY_CONTROLLO"))){
                items += "<li><a href=\"#\" ";
                items += " class=\"" + getRsField(rsQuery,"GRUPPO") + "\"";
                items += " onclick=\"" + getRsField(rsQuery,"FUNZIONE") + "\"";

                if(!getRsField(rsQuery,"LABEL").equals("")) {
                    items += ">" + getRsField(rsQuery,"LABEL");
                }
                else {
                    items += ">" + chkNull(rsQuery.getString(1));
                }

                if (!getRsField(rsQuery,"IDEN_FIGLIO").equals("")) {
                    items += gestFigliInner(rsQuery.getInt("IDEN_FIGLIO"));
                }

                items += "</a>\n";

                if (!getRsField(rsQuery,"IDEN_FIGLIO").equals("")) {
                    items += gestFigli(rsQuery.getInt("IDEN_FIGLIO"));
                }

                if (!getRsField(rsQuery,"QUERY").equals("")){
                    try {
                        if (rsQuery.getString("RIFERIMENTI") != null) {
                            arRiferimenti = rsQuery.getString("RIFERIMENTI").split("§");
                            for (int i = 0; i < arRiferimenti.length; i++) {
                                hashRiferimenti.put(arRiferimenti[i].split("=")[0],rsQuery.getString(arRiferimenti[i].split("=")[1]));
                            }
                        }
                    } catch (Exception ex) {}
                    items+=gestQuery(rsQuery.getString("QUERY"), hashRiferimenti);
                    hashRiferimenti = new Hashtable<String, String>();
                }
                items += "</li>\n";
            }
        }
        rsQuery.close();
        psQuery.close();

        return "<ul>\n" + items +  "</ul>\n";
    }
    private String gestFigli(int idenPadre) throws SqlQueryException, SQLException{
        PreparedStatement psFigli;
        ResultSet rsFigli;
        String items = "";

        psFigli = connW.prepareCall("select * from CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_padre=? and (gruppo is null or gruppo<>'INNER')  order by ordinamento");

        psFigli.setString(1, procedura);
        psFigli.setString(2, reparto);
        psFigli.setString(3, tipoUtente);
        psFigli.setInt(4, idenPadre);

        rsFigli = psFigli.executeQuery();

        while(rsFigli.next()){
            if(checkVoceMenu(chkNull(rsFigli.getString("QUERY_CONTROLLO")))){
                items += "<li id=\""+chkNull(rsFigli.getString("LABEL"))+"\"><a href=\"#\"";
                items += " class=\"" + chkNull(rsFigli.getString("GRUPPO")) + "\"";
                items += " onclick=\"" + chkNull(rsFigli.getString("FUNZIONE")) + "\">" + chkNull(rsFigli.getString("LABEL"));

                if (!getRsField(rsFigli,"IDEN_FIGLIO").equals("")) {
                    items+= gestFigliInner(rsFigli.getInt("IDEN_FIGLIO"));
                }

                items += "</a>\n";

                if (!getRsField(rsFigli,"IDEN_FIGLIO").equals("")) {
                    items+= gestFigli(rsFigli.getInt("IDEN_FIGLIO"));
                }
                if (!getRsField(rsFigli,"QUERY").equals("")) {
                    items += gestQuery(rsFigli.getString("QUERY"),new Hashtable<String, String>());
                }

                items += "</li>\n";
            }
        }
        rsFigli.close();
        psFigli.close();

        return (items.equals("") ? "" : "<ul>\n" +items+ "</ul>\n");
    }

    private String gestFigliInner(int idenPadre) throws SqlQueryException, SQLException{

        String  inners = "";

        PreparedStatement psFigli;
        ResultSet rsFigli;

        psFigli = connW.prepareCall("select * from CONFIG_MENU_REPARTO where procedura=? and CODICE_REPARTO=? and ATTIVO='S' and (TIPO_ute is null or TIPO_UTE=?) and iden_padre=? and gruppo='INNER'  order by ordinamento");

        psFigli.setString(1, procedura);
        psFigli.setString(2, reparto);
        psFigli.setString(3, tipoUtente);
        psFigli.setInt(4, idenPadre);

        rsFigli = psFigli.executeQuery();

        while(rsFigli.next()){
            inners += "<span onclick=\"" + chkNull(rsFigli.getString("FUNZIONE")) + "\">" + chkNull(rsFigli.getString("LABEL")) + "</span>";
        }
        rsFigli.close();
        psFigli.close();

        return inners;
    }

    private boolean checkVoceMenu(String query) throws SQLException {
        boolean ret=true;
        if(!query.equals("")){
            OraclePreparedStatement ps = (OraclePreparedStatement) connD.prepareStatement(query);
            this.doReplaces(ps);
            ResultSet rs = ps.executeQuery();
            ret = rs.next();
            rs.close();
            ps.close();
        }
        return ret;
    }
    public void setAttribute(String name,String value){divMenu.addAttribute(name,value);}
    public void append(String element){divMenu.appendSome(element);}

    private String chkNull(String in){if(in==null)return "";else return in;}

    public void addLabel(String label,String value){
        lstReplace.add(new objReplace(label,value));
    }
    public void addLabel(String label,Long value){
        lstReplace.add(new objReplace(label,value));
    }

    private void doReplaces(OraclePreparedStatement ps){
        for(int i=0;i<lstReplace.size();i++){
            try{
                switch (lstReplace.get(i).tipoDato){
                    case 0:doSingleReplace(ps,lstReplace.get(i).lbl, lstReplace.get(i).longVal);
                        break;
                    case 1:doSingleReplace(ps,lstReplace.get(i).lbl, lstReplace.get(i).stringVal);
                        break;
                    default:throw new Exception("Casistica non prevista");

                }
            }catch(SQLException ex){/**/}
            catch (Exception ex) {/**/}

        }

    }
    private void doSingleReplace(OraclePreparedStatement ps,String label,String value) throws SQLException {
        ps.setStringAtName(label, value);
    }
    private void doSingleReplace(OraclePreparedStatement ps,String label,Long value) throws SQLException {
        ps.setLongAtName(label, value);
    }

    private String getRsField(ResultSet rs,String label){
        String value="";
        try {
            value=chkNull(rs.getString(label));
        } catch (Exception ex) {
            value="";
        }
        return value;
    }
    
    private String drawFactory(String pRepartoMenu,String pReparto, String pProcedura, String pCodiceRicovero) throws SqlQueryException, SQLException{
    	CacheManager cache = new CacheManager(pProcedura);
    	String vCodiceRicovero = "";
    	if ("".equalsIgnoreCase(pCodiceRicovero)){
    		vCodiceRicovero = pCodiceRicovero;
    	}
		String cachestring = pProcedura + "@" + pRepartoMenu + "@" + pCodiceRicovero + "@" + tipoUtente;
		String temp_ul = (String) cache.getObject(cachestring);
		if (temp_ul == null) {
			temp_ul = draw(pReparto, pProcedura, "z99");
			cache.setObject(cachestring, temp_ul);
		}
		
		return temp_ul;
    }
}
