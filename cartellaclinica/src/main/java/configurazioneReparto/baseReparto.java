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
package configurazioneReparto;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.dbConnections;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;

public class baseReparto implements ibaseReparto {

    private static final long serialVersionUID = 1000L;
    private HashMap<String, objParametro> hashValoriWebserver;
    private HashMap<String, objParametro> hashValoriClient;
    private String vCodCdc;
    private transient ElcoLoggerInterface log = null;

    public baseReparto(String cod_cdc, dbConnections db) {
    	log=new ElcoLoggerImpl(this.getClass());
        this.vCodCdc = cod_cdc;
        Connection conn = null;

        ResultSet rs = null;
        PreparedStatement ps = null;
        hashValoriWebserver = new HashMap<String, objParametro>();
        hashValoriClient = new HashMap<String, objParametro>();

        try {

            conn = db.getWebConnection();
            if (this.vCodCdc.equals("")) {
                ps = conn.prepareCall("select * from table(imagoweb.PCK_CONFIGURAZIONI.getConfigurazioniGlobal) where sessione_webserver='S' or sessione_client='S'");
            }else {
                ps = conn.prepareCall("select * from table(imagoweb.PCK_CONFIGURAZIONI.getConfigurazioniCdc(?)) where sessione_webserver='S' or sessione_client='S'");
                ps.setString(1, this.vCodCdc);
            }

            rs = ps.executeQuery();
            while (rs.next()) {
                if ("S".equals(rs.getString("SESSIONE_WEBSERVER"))) {
                    hashValoriWebserver.put(rs.getString("KEY"), this.getObjParametro(rs));
                }
                if ("S".equals(rs.getString("SESSIONE_CLIENT"))) {
                	hashValoriClient.put(rs.getString("KEY"), this.getObjParametro(rs));
                }
            }
            rs.close();
            ps.close();

        } catch (Exception ex) {
        	log.error(ex);
        } finally {
            rs = null;
            ps = null;
        }
    }

    @Override
	public String object2js() {

        StringBuilder sb = new StringBuilder();

        sb.append("{\n");
           
        Iterator<String> it = hashValoriClient.keySet().iterator();
        while (it.hasNext()) {
            String  key = it.next();
            if (hashValoriClient.get(key).sessionClient) {
                sb.append("        \"" + key + "\":\"" + hashValoriClient.get(key).value + "\",\n");
            }
        }
        sb.append("        \"\":\"\"\n");
        sb.append("    }");
        return sb.toString();

    }

    @Override
	public String chkNull(String in) {
        if (in == null) {
            return "";
        }else {
            return in;
        }
    }

    @Override
	public objParametro getObjParametro(ResultSet rs) throws SQLException {
        objParametro newObj = new objParametro(chkNull(rs.getString("KEY")));
        newObj.setValue(chkNull(rs.getString("VALORE")));
        newObj.setSessionDb(chkNull(rs.getString("SESSIONE_DB")));
        newObj.setSessionWeb(chkNull(rs.getString("SESSIONE_WEBSERVER")));
        newObj.setSessionClient(chkNull(rs.getString("SESSIONE_CLIENT")));
        return newObj;
    }

    @Override
	public String getParam(String key) {
        if (hashValoriWebserver.containsKey(key)) {
            return chkNull(hashValoriWebserver.get(key).value);
        }else {
            return "KO";
        }
    }    
    
	@Override
	public String getParam(String key, String ricovero) {
		// TODO Auto-generated method stub
		return getParam(key);
	}
}
