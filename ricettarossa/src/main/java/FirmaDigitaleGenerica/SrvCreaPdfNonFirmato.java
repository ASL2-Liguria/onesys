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
package FirmaDigitaleGenerica;

import imago.http.baseClass.baseUser;
import imago.sql.dbConnections;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import matteos.servlets.Logger;
import matteos.servlets.polaris.PolarisContext;

import org.apache.commons.codec.binary.Base64;

import stampe.crystalclear.Stampe;

public class SrvCreaPdfNonFirmato extends HttpServlet {
    private ServletConfig sConfig = null;
    private ServletContext myContext = null;
    byte[] pdfdaDB	= null;
    String idenTestata = "";
    HttpSession mySession =null;
    baseUser bUtente = null;

    @Override
	public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.sConfig = config;
        this.myContext = this.sConfig.getServletContext();
       
    }

    protected void processRequest(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException 
    {
        this.mySession = null;
        this.mySession 		= request.getSession(false);
        this.bUtente = (baseUser) this.mySession.getAttribute("login");
        Stampe stampe 	= null;
        Hashtable<String, String> Param	= new Hashtable<String, String>();
        Connection conn = null;
        try 
        {
        		stampe = new Stampe();
        		Param = getObjectForm(request);
        		Enumeration keys=Param.keys();
        		while(keys.hasMoreElements()) {
        			String paramname=(String) keys.nextElement();
        			String paramvalue = Param.get(paramname);
        			if (paramname.equalsIgnoreCase("pIdenTestata"))
        				this.idenTestata=paramvalue;
        			
        			if (paramname.equalsIgnoreCase("ReportPath")){
        				stampe.setParam(paramname, this.myContext.getRealPath("") + "/report");
        			}
        			else if (paramname.equalsIgnoreCase("report"))
        			{
        				stampe.setParam(paramname, paramvalue);       				
        			}
        			else
        			{
        				stampe.setParam("prompt<"+paramname+">", paramvalue);
        			}
    			}
        		conn = getDataConnectionFromSession(mySession);
        		stampe.setConnectionOrRelevantObject(conn);
        		stampe.getBytes();
        		this.pdfdaDB = Base64.encodeBase64(stampe.getBytes());
        		InserisciInTabella(this.pdfdaDB,idenTestata);
        } catch (Exception ex) 
        {
            ex.getMessage();
            ex.getLocalizedMessage();
        }finally{
        	try {
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	
        }
    }

    private void InserisciInTabella(byte[] pdfdaDB,String idenTestata) throws Exception {
		// TODO Auto-generated method stub
    	PreparedStatement ps;
        Connection conn = null;
        ResultSet rs =null;
    	String sql_iden = "select max(progr) progr from cc_firma_pdf where iden_tab = ? and funzione=?";
    	int Progr=0;
		conn = getDataConnectionFromSession(mySession);
		try {
			ps	= conn.prepareStatement(sql_iden);
			ps.setInt(1,Integer.valueOf(idenTestata) );
			ps.setString(2,"PIANO_TERAPEUTICO");
			rs 	= ps.executeQuery();
			while (rs.next()){
				Progr = rs.getInt("progr")+1;
			}
		} catch (SQLException e) 
		{
			e.printStackTrace();
		}
		finally
		{
			try 
			{
				rs.close();
			} catch (SQLException e) 
			{
				e.printStackTrace();
			}
		}
    	
		ps 	= null;
		rs	= null;
    	int rsInsert=0;
    	String sql_ins = "insert into cc_firma_pdf (IDEN_VISITA,TABELLA_SORGENTE,IDEN_TAB,FUNZIONE,PROGR,IDEN_UTE,deleted,PDF_FIRMATO,PDF_FIRMATO_CREATO) values(?,?,?,?,?,?,?,?,?)";
    	try {
			ps	= conn.prepareStatement(sql_ins);
			ps.setInt(1, 0);
			ps.setString(2,"PT_TESTATA" );
			ps.setInt(3,Integer.valueOf(idenTestata) );
			ps.setString(4,"PIANO_TERAPEUTICO");
			ps.setInt(5,Progr);			
			ps.setInt(6,this.bUtente.iden_per);
			ps.setString(7,"N");
			ps.setString(8, new String(pdfdaDB));		
			ps.setString(9,"N");

			rsInsert = ps.executeUpdate();
			
		} catch (SQLException e) 
		{
			e.printStackTrace();
    		throw new Exception("KO$" + e.getMessage());  
		}
		finally
		{
		}  
	}

	@Override
	protected void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException,IOException 
    {
        processRequest(request, response);
    }

    @Override
	protected void doPost(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException 
    {
        processRequest(request, response);
    }

    @Override
	public void destroy() {
    }
    
    public static Hashtable getObjectForm(HttpServletRequest myRequest){
    	int                     i=0;
    	Enumeration             paramNames =null;
    	Hashtable               myHash=null;
    	// log.writeInfo("Inizializzazione dei Parametri di Stampa");
//    	i = myRequest.getParameterMap().size();
//    	if (i > 0) {
    		paramNames = myRequest.getParameterNames();
    		myHash = new Hashtable();
    		while(paramNames.hasMoreElements()) {
    			String parm = (String)paramNames.nextElement();
    			myHash.put(parm,myRequest.getParameter(parm));
    		}
//    	}
    	return myHash;
    }

    
	private Connection getDataConnectionFromSession(HttpSession session) {
		try 
		{
			return getUserDbConnections(session).getDataConnection();
		} 
		catch (Exception e) 
		{
			Logger.getLogger().error("getDataConnectionFromSession - " + e.getMessage(), e);
			return null;
		}
	}
    
	private dbConnections getUserDbConnections(HttpSession session) {
		try 
		{
			return PolarisContext.getUser(session).db;
		} 
		catch (Exception e) 
		{
			Logger.getLogger().error("getUserDbConnections - " + e.getMessage(), e);
			return null;
		}
	}  
}


