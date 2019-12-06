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
package generic.statements;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.SqlQueryException;
import imago.sql.dbConnections;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.Reader;
import java.sql.CallableStatement;
import java.sql.Clob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import javax.servlet.http.HttpSession;

import matteos.utils.StringUtils;
import matteos.utils.XmlUtils;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import core.Global;
import core.cache.CacheManager;
import core.database.PoolFactory;
import java.io.StringReader;

import java.util.HashMap;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author FrancescoG
 * @version 1.0
 */
public class StatementFromFile {

    private String ContextPath;

    /**
     * Lo usiamo come controllo per evitare accessi indesiderati non autenticati?
     */
    private HttpSession session;
    private baseUser user;
    private CallableStatement cs;
    private ResultSet rs = null;
    private ElcoLoggerImpl logger = null;
    private HashMap<Integer,Integer> ParamsType;
    private Connection connection;

    public StatementFromFile(HttpSession pSession) throws Exception {

    	this.session = pSession;
        this.logger = new ElcoLoggerImpl(this.getClass());

        try{
            this.ContextPath = Global.context.getRealPath(".");
            if (pSession != null) {
                this.user = Global.getUser(pSession);
            }

        }catch(Exception ex){
            logger.error(ex);
            throw ex;
        }
    }

    public void close(){
        try{
            if (rs != null) {
                rs.close();
            }
        }catch(Exception ex){
            logger.error(ex);
        }
        try{
            if (cs != null) {
                cs.close();
            }
        }catch(Exception ex){
            logger.error(ex);
        }
        rs = null;
        cs = null;

    }

    private void setStatement(String pFileName, String pStatementName) throws SQLException, SqlQueryException, NumberFormatException, IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException, JDOMException, Exception {
        setStatement(pFileName, pStatementName, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
    }

    private void setStatement(String pFileName, String pStatementName, int resultSetType, int resultSetConcurrency) throws SQLException, SqlQueryException, NumberFormatException, IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException, JDOMException, Exception {

		CacheManager cache = new CacheManager("StatementFromFile");
        Document doc = (Document) cache.getObject(pFileName);
		if (doc == null) {
			doc = XmlUtils.parseJDomDocumentFromFile(this.ContextPath + "/WEB-INF/statements/" + pFileName);
			cache.setObject(pFileName, doc);
		}

        XPath xp = XPath.newInstance("//statement[@name='" + pStatementName + "']");

        Element elmStatement = (Element) xp.selectSingleNode(doc);

        String sql = elmStatement.getChildText("sql");
        String pool = elmStatement.getChildText("pool");
        if (pool == null) {
        	String schema = elmStatement.getChildText("schema");
            schema = (schema==null?"RADSQL":schema);
            dbConnections dbConns = (user == null ? new dbConnections() : user.db);
            this.connection = schema.equalsIgnoreCase("IMAGOWEB") ? dbConns.getWebConnection() : dbConns.getDataConnection();
        } else {
        	this.connection = PoolFactory.getConnection(pool, elmStatement.getChildText("catalogo"), this.session); /* puo' essere null, in tal caso configurazione di default*/
        }

        this.setParametersType(elmStatement);
        this.cs = connection.prepareCall(sql, resultSetType, resultSetConcurrency);

        String timeout = elmStatement.getChildText("timeout");
        timeout = (timeout==null?"20":timeout);
        this.cs.setQueryTimeout(Integer.valueOf(timeout));

    }

    private void setParametersType(Element elmStatement) throws SecurityException, NoSuchFieldException, IllegalAccessException, NumberFormatException, IllegalArgumentException {

        ParamsType = new HashMap<Integer,Integer>();
        List lstParam;
        try{
            lstParam = elmStatement.getChild("params").getChildren();
        }catch(Exception ex){
            ParamsType = null;
            return;
        }

        Element elmParam;

        for (int i = 0; i < lstParam.size(); i++) {
            elmParam = ((Element) lstParam.get(i));
            ParamsType.put(Integer.valueOf(elmParam.getAttributeValue("index")),Types.class.getDeclaredField(elmParam.getAttributeValue("type")).getInt(null));
        }
    }

    public String[] executeStatement(String pFileName,String pStatementName,String[] pBinds,int pOuts) throws Exception {
        try{
            logger.debug("generic.statements.StatementFromFile.executeStatement : '" + pFileName +"' '" + pStatementName +"' [ "+ StringUtils.arrayToString(pBinds) + " ]");
            this.setStatement(pFileName, pStatementName);
            return this.executeStatement(pBinds, pOuts);
        }catch(Exception ex){
            logger.error("generic.statements.StatementFromFile.executeStatement : '" + pFileName +"' '" + pStatementName +"' [ "+ StringUtils.arrayToString(pBinds) + " ]");
            logger.error(ex);
            throw ex;
            //return new String[]{"KO",ex.getMessage()};
        } finally {
        	this.close();
        }
    }

    public String[][] executeBatchStatement(String pFileName, String pStatementName, String[][] pBinds, int pOuts) throws Exception {
        try {
            String[][] vResp = new String[1 + pBinds.length][2 + pOuts];
            this.setStatement(pFileName, pStatementName);
            this.connection.setAutoCommit(false);
            for (int i = 0; i < pBinds.length; i++) {
                try {
                    logger.debug("generic.statements.StatementFromFile.executeBatchStatement : '" + pFileName + "' '" + pStatementName + "' [ " + StringUtils.arrayToString(pBinds[i]) + " ]");
                    vResp[i] = this.executeStatement(pBinds[i], pOuts);
                } catch (SQLException ex) {
                    connection.rollback();
                    throw ex;
                }
            }
            this.connection.commit();
            return vResp;
        } catch (Exception ex) {
            logger.error(ex);
            //return new String[][]{{"KO", ex.getMessage()}};
            throw ex;
        } finally {
            this.close();
            try {
                if (this.connection != null) {
                    this.connection.setAutoCommit(true);
                }
            } catch (SQLException e) {
                logger.error("generic.statements.StatementFromFile.executeBatchStatement : errore nel risettare Autocommit(true)");
            }
        }
    }

    public ResultSet executeQuery(String pFileName, String pStatementName) throws Exception{
        return executeQuery(pFileName, pStatementName, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
    }

    public ResultSet executeQuery(String pFileName, String pStatementName, int resultSetType, int resultSetConcurrency) throws Exception{
        return executeQuery(pFileName, pStatementName, new String[]{}, resultSetType, resultSetConcurrency);
    }

    public ResultSet executeQuery(String pFileName, String pStatementName, String[] pBinds) throws Exception{
        return executeQuery(pFileName, pStatementName, pBinds, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
    }

    public ResultSet executeQuery(String pFileName, String pStatementName, String[] pBinds, int resultSetType, int resultSetConcurrency) throws Exception{
        try{
            logger.debug("generic.statements.StatementFromFile.executeQuery : '" + pFileName +"' '" + pStatementName +"' [ "+ StringUtils.arrayToString(pBinds) + " ] '" + resultSetType+"' '" + resultSetConcurrency +"'");
            this.close();
            this.setStatement(pFileName, pStatementName, resultSetType, resultSetConcurrency);
            this.setResultSet(pBinds);
            return this.rs;
        }catch(Exception ex){
            logger.error("generic.statements.StatementFromFile.executeQuery : '" + pFileName +"' '" + pStatementName +"' [ "+ StringUtils.arrayToString(pBinds) + " ] '" + resultSetType+"' '" + resultSetConcurrency +"'");
            logger.error(ex);
            this.close();
            throw ex;
        }
    }

    private String[] executeStatement(String[] pBinds,int pOuts) throws IOException, SQLException {

        String[]  resp = new String[pOuts+2];

        for (int i = 0; i < pBinds.length; i++) {
            this.setParameterIn(1 + i, pBinds[i]);
        }
        for (int i = 0; i < pOuts; i++) {
            this.setParameterOut(pBinds.length + i + 1);
        }

        cs.execute();
        for (int i = 0; i < pOuts; i++) {
            resp[2 + i] = this.getParameter(pBinds.length + i + 1);
        }

        resp[0]="OK";

        return resp;

    }
    /*private String[][] executeBatch(String[][] pArrayBinds,int pOuts) throws IOException {
    	String[][] batchResponse = null;

    	try {
    		for (String[] pBinds : pArrayBinds) {
    			String[] resp;
    			resp = this.executeStatement(pBinds, pOuts);
    		}
    	}catch (SQLException e) {
			// TODO: handle exception
		}
    	return batchResponse;
    }*/

    private void setResultSet(String[] pBinds) throws SQLException {
        for (int i = 0; i < pBinds.length; i++) {
            this.setParameterIn(1+i,(pBinds[i] == null || pBinds[i].length() < 1 ? null : pBinds[i]));
        }
        rs = cs.executeQuery();
    }

    private void setParameterIn(int pIndex,String pValue) throws SQLException {
        if(pValue == null || pValue.equals("")){
             this.cs.setNull(pIndex,(ParamsType==null?Types.VARCHAR:ParamsType.get(pIndex)));
        }else if(this.ParamsType == null){
            this.cs.setString(pIndex, pValue);
        }else{
            if(ParamsType.get(pIndex) == Types.CLOB){
                this.cs.setClob(pIndex, new StringReader(pValue));
            }else{
                this.cs.setObject(pIndex, pValue, ParamsType.get(pIndex));
            }
        }
    }

    private void setParameterOut(int pIndex) throws SQLException {
        if(this.ParamsType == null){
            this.cs.registerOutParameter(pIndex,Types.VARCHAR);
        }else{
            this.cs.registerOutParameter(pIndex,ParamsType.get(pIndex));
        }
    }

    private String getParameter(int pIndex) throws SQLException, IOException {
        String value;

        if(this.ParamsType != null && this.ParamsType.get(pIndex) == Types.CLOB){
            value =this.clobToString(this.cs.getClob(pIndex));
            this.cs.getClob(pIndex).free();
        }else{
            value = this.cs.getString(pIndex);
        }
        return value;
    }

    private String clobToString(Clob data) throws SQLException, IOException {
        StringBuilder sb = new StringBuilder();

        Reader reader = data.getCharacterStream();
        BufferedReader br = new BufferedReader(reader);
        String line;
        while (null != (line = br.readLine())) {
            sb.append(line);
        }
        br.close();

        return sb.toString();
    }

}
