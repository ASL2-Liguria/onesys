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
package ajax;

import imago.sql.SqlQueryException;
import imago.sql.Utils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;

import org.directwebremoting.WebContextFactory;

import ACR.DecodificaPwd;


public class dwrSISS {

    public dwrSISS() {
    }

    public String AccessoSmartCard (String var) {
        new Utils();
        
        Connection conn		 = null;
        ResultSet rst		 = null;
        PreparedStatement ps = null;
        
        String myRet="";
        try {
        	ServletContext sContext=null;
//Connessione tramite i dati passati alla servlet			
        	sContext= WebContextFactory.get().getServletContext();
            new DecodificaPwd();
            String pwd = DecodificaPwd.decodificaPwd(sContext,sContext.getInitParameter("DataPwd"));
            String user = sContext.getInitParameter("WebUser");
			conn=Utils.getTemporaryConnection(user, pwd);
//Ricerca del webuser e della webpassword			
            ps = ((Connection) conn).prepareStatement("select w.webuser,w.webpassword from radsql.tab_per tp,imagoweb.web w " +
            					 "where ((tp.tipo=? and tp.tipo_med is null) or (tp.tipo_med=? or tp.tipo_med=?))" +
            					 " and tp.attivo=? and w.attivo=? and w.deleted=? and w.iden_per=tp.iden and tp.cod_fisc=?");
            // Definizione parametri Query
            ps.setString(1,"I");
            ps.setString(2,"I");
            ps.setString(3,"R");
            ps.setString(4,"S");
            ps.setString(5,"S");
            ps.setString(6,"N");
            ps.setString(7,var);
            
            rst = ps.executeQuery();
            if (rst.next())
            {
                myRet= "OK*"+  rst.getString("webuser")+"*"+DecodificaPwd.decodificaPwd(sContext,rst.getString("webpassword"));
            }
            else
            {
                myRet="KO*Nessun Utente associato alla Smart Card";
            }
        } catch (SqlQueryException ex) 
        {
            myRet="KO*"+ex.getMessage();
        
        } catch (SQLException ex) 
        {
            myRet="KO*"+ex.getMessage();
        
        }finally{
        	try {
				rst.close();
				conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	
        }

        return myRet;
    }

}
