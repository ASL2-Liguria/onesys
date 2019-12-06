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
package plugin;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivHtmlObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

public class plgHiddenFormConnection extends baseAttributeEngine {
    private Connection otherConnection = null;
    private String 	cDiv2  = null;
    private String 	cDiv3  = null;
    private functionDB fDB = null;
    private functionObj fObj = null;
    private ServletContext contxt = null;
    private HttpServletRequest req = null;

    
    




    public plgHiddenFormConnection()//costruttore che identifica l'attributo ATTRIBUTO_ENGINE
    {
        super();
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);
    }

    public Object get_attribute_engine()//questo metodo essenziale per la compilazione di tutto
    {
        classDivHtmlObject cDiv1 = new classDivHtmlObject("DIV_VERTICAL_MENU");

        /*funzione da richiamare*/
        cDiv1.appendSome(this.cDiv2);
        cDiv1.appendSome(this.cDiv3);
        return cDiv1;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        this.contxt = context;
        this.req 	= request;
        this.fObj 	= new functionObj(this.contxt, this.req);
        this.fDB 	= new functionDB(this.fObj);
    }
    
    public void setOtherConnection(String poolName, String user, String pwdCriptata, String tipoCriptazione) throws SQLException {
        getPoolConnection pool = new getPoolConnection(poolName, user, pwdCriptata, tipoCriptazione);
        try {
            this.otherConnection = pool.getConnection();
        }
        catch(Exception e) {
            this.otherConnection.close();
        }
        

    }
//    select * from v_unisys_anagrafe where PAZ_CODICEFISCALE ='#idRemoto#'; select per dati_anagrafici
//  select * from v_unisys_dea where ric_str='#RIC_STR#' and RIC_CARTELLA='#RIC_CARTELLA#' AND RIC_ANNO='#RIC_ANNO#' ='#idRemoto#'; select per dati_generali_di PS
 
    
    public void testRisultato(){ //in questo metodo definisco una query e un resultset che andra' compilato dentro un div
    	
    	String cod_fisc = req.getParameter("idRemoto");
    	System.out.println(cod_fisc);
    	ResultSet rs=null;
    	String risultato="";
//    	this.cDiv2 = "<div>PUPPA :"+cod_fisc+"</div>";	
    	String sql = "select paz_iden from v_unisys_anagrafe where paz_codicefiscale='"+cod_fisc+"'";
    	try{
    	rs=this.fDB.open(sql,this.otherConnection);
    	while (rs.next()){
    		
    		risultato=rs.getString("paz_iden").toString();
        	this.cDiv2 = "<div>PUPPA :"+risultato+"</div>";	
    	}
    	}catch(Exception e)
    	{
    		e.printStackTrace();
    		try {
				this.otherConnection.close();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
    	}finally{

    	}
    	
    }
    
public void testRisultatoDea(){ //in questo metodo definisco una query e un resultset che andra' compilato dentro un div
    
	/*con il metodo request prendo il nosologico e lo splitto in tre parti*/
	String ricovero = req.getParameter("ricovero");
    String [] arraySplit = null;
    arraySplit = ricovero.split("-");
    	
    	ResultSet rs=null;
    	String risultato="";
    	String sql = "select paz_iden from v_unisys_dea where ric_str="+arraySplit[0]+" and ric_cartella="+arraySplit[2]+" and ric_anno="+arraySplit[1];
    	try{
    	rs=this.fDB.open(sql,this.otherConnection);
    	while (rs.next()){
    		
    		risultato=rs.getString("paz_iden").toString();
        	this.cDiv3 = "<div>PUPPA :"+risultato+"</div>";	
    	}
    	}catch(Exception e)
    	{
    		e.printStackTrace();
    		try {
				this.otherConnection.close();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
    	}finally{
    		try {
				this.otherConnection.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
    	}
    	
    }
 

    

    
    
}