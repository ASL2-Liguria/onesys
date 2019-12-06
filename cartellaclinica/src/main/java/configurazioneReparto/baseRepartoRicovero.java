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

public class baseRepartoRicovero implements ibaseReparto {

    private static final long serialVersionUID = 1000L;
    private HashMap<String, HashMap<String,objParametro>> hashValoriWebserver;
    private HashMap<String, HashMap<String,objParametro>> hashValoriClient;
    private HashMap<String, objParametro> hashValoriFiglio;
    private String vCodCdc;
    private transient ElcoLoggerInterface log = null;

    public baseRepartoRicovero(String cod_cdc, dbConnections db) {
    	log=new ElcoLoggerImpl(this.getClass());
        this.vCodCdc = cod_cdc;
        Connection conn = null;

        ResultSet rs = null;
        PreparedStatement ps = null;
        hashValoriWebserver = new HashMap<String, HashMap<String,objParametro>>();
        hashValoriClient = new HashMap<String, HashMap<String,objParametro>>();
        
        String currentKey = "";
        try {

            conn = db.getWebConnection();
            if ("".equalsIgnoreCase(this.vCodCdc)){
                ps = conn.prepareCall("select * from table(imagoweb.getConfigurazioniGlobal) where sessione_webserver='S' or sessione_client='S'");
                            	
            }else{
                ps = conn.prepareCall("select * from table(imagoweb.getConfigurazioniCdcRicovero(?)) where sessione_webserver='S' or sessione_client='S'");            	
                ps.setString(1, this.vCodCdc);
            }
            

            rs = ps.executeQuery();
            while (rs.next()) {
                if ("S".equals(rs.getString("SESSIONE_WEBSERVER"))) {
                    hashValoriWebserver.put(rs.getString("KEY"), this.getObjHashParametro(rs,currentKey.equalsIgnoreCase(rs.getString("KEY"))));
                }
                if ("S".equals(rs.getString("SESSIONE_CLIENT"))) {
                	hashValoriClient.put(rs.getString("KEY"), this.getObjHashParametro(rs,currentKey.equalsIgnoreCase(rs.getString("KEY"))));
                }
                currentKey = rs.getString("KEY");
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

	private HashMap<String,objParametro> getObjHashParametro(ResultSet rs, boolean chk) throws SQLException {
		if (!chk){
			hashValoriFiglio = new HashMap<String, objParametro>();
		}
		String codiceRicovero = "".equals(chkNull(rs.getString("CODICE_RICOVERO")))?"ALL":rs.getString("CODICE_RICOVERO");
		
		if (!hashValoriFiglio.containsKey(codiceRicovero)){
			hashValoriFiglio.put(codiceRicovero,this.getObjParametro(rs));			
		}
		return hashValoriFiglio;
	}
	
	@Override
    public String object2js() {
        StringBuilder sb = new StringBuilder("{\n");
           
        Iterator<String> it = hashValoriClient.keySet().iterator();
        while (it.hasNext()) {
            String  key = it.next();
            HashMap<String,objParametro> HashMapFiglio = hashValoriClient.get(key); 
            Iterator<String> itFiglio =HashMapFiglio.keySet().iterator();
            sb.append("        \"");
            sb.append(key);
            sb.append("\":{");
            while (itFiglio.hasNext()){
            	String  keyFiglio = itFiglio.next();
            	if (HashMapFiglio.get(keyFiglio).sessionClient) {
            		sb.append("\"");
            		sb.append(keyFiglio);
            		sb.append("\":\"");
            		sb.append(HashMapFiglio.get(keyFiglio).value);
            		sb.append("\"");
                }
            	if (itFiglio.hasNext()){
            		sb.append( ",");
            	}
            }
            if (it.hasNext()){
            	sb.append("},\n");
            }else{
            	sb.append("}\n");
            }
        }
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
	public String getParam(String key, String ricovero){
		String returnValue = "";
		if ("".equals(ricovero) || ricovero == null){
			ricovero = "ALL";
		}else{
			if (hashValoriWebserver.containsKey(key)) {
	        	if (!hashValoriWebserver.get(key).keySet().contains(ricovero)){
	        		 ricovero = "ALL";  		
	        	}
	        }	
		}
        if (hashValoriWebserver.containsKey(key)) {
        	if (hashValoriWebserver.get(key).containsKey(ricovero)){
        		returnValue =  chkNull(hashValoriWebserver.get(key).get(ricovero).value);        		
        	}
        }else {
        	returnValue = "KO";
        	
        }
		return returnValue;
    }    
    
	@Override
	public String getParam(String key) {
		// TODO Auto-generated method stub
		return null;
	}  
}
