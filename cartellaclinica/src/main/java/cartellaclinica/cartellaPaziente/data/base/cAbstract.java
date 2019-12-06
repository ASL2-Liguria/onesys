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
package cartellaclinica.cartellaPaziente.data.base;

import generic.statements.StatementFromFile;
import generic.statements.Exception.NoDataFoundException;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Hashtable;
import java.util.Iterator;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author Fra
 * @version 1.0
 */
public abstract class cAbstract {

    private Hashtable<String,String> htRs;

    protected cAbstract(){
        htRs = new Hashtable<String,String>();
    }

    public cAbstract(StatementFromFile sff,String pStatementName,String[] pBinds) throws SQLException,NoDataFoundException, Exception {
        this(sff,pStatementName,pBinds,false);
    }

    public cAbstract(StatementFromFile sff,String pStatementName,String[] pBinds, boolean CanBeEmpty) throws SQLException,NoDataFoundException, Exception {

        this();

        String vStatementFile = "cartellaPaziente.xml";

        ResultSet rs = sff.executeQuery(vStatementFile, pStatementName, pBinds);
        if(rs.next())
            this.setValues(rs);
        else{
            if(!CanBeEmpty)
                throw new NoDataFoundException(this, vStatementFile, pStatementName, pBinds);
        }
    }

    private void setValues(ResultSet pRs) throws SQLException {

        ResultSetMetaData rsmd = pRs.getMetaData();
        for (int i = 0; i < rsmd.getColumnCount(); i++) {
            htRs.put(rsmd.getColumnName(i + 1), chkNull(pRs.getString(i + 1)));
        }

    }

    protected void setValues(Hashtable<String,String> pHtRs){
        this.htRs = pHtRs;

    }

    public Hashtable<String,String> getValues(){
        return this.htRs;
    }

    protected void setValue(String pKey,String pValue){
        if(htRs.containsKey(pKey))
            htRs.remove(pKey);
        htRs.put(pKey,pValue);
    }
    protected String getValue(String pKey){
        try{
            return (htRs.containsKey(pKey) ?  htRs.get(pKey) : "");
        }catch(Exception e){
            return "";
        }
    }

    protected String chkNull(String in){return ( in == null ? "" : in );}

    public String toHtmlForm(String pFormName){
        StringBuffer html = new StringBuffer();
        html.append("<form name=\""+pFormName+"\">\n");

        Iterator it =(Iterator) htRs.keySet().iterator();
        while(it.hasNext()){
            String key = (String) it.next();
            String value = (String) htRs.get(key);
            html.append("    <input type=\"hidden\" name=\""+key+"\" value=\""+value+"\"/>\n");
        }

        html.append("</form>\n");
        return html.toString();
    }
}
