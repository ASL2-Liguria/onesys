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
package cartellaclinica.cartellaPaziente.Visualizzatore.connection;

import imago.crypto.CryptPasswordInterface;
import imago.crypto.ImagoCryptoException;
import imago.sql.SqlQueryException;
import imago.sql.UtilsPoolConnection;

import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletContext;

public class Connessione {
	
UtilsPoolConnection poolConn;
	
Connection conn = null;




public Connection getConnection(ServletContext myInputContext) throws SqlQueryException, ClassNotFoundException, ImagoCryptoException, InstantiationException, IllegalAccessException{
	
	String password="";
	String user=myInputContext.getInitParameter("RegistryUser");
	String criptPassword=myInputContext.getInitParameter("RegistryPwd");
	String Param_cript = myInputContext.getInitParameter("CryptType");
	String poolName = myInputContext.getInitParameter("RegistryPoolName");
	
	UtilsPoolConnection poolConn = new UtilsPoolConnection(poolName);	


         Class<?> obj = Class.forName(Param_cript);
         CryptPasswordInterface cpi = (CryptPasswordInterface) (obj.newInstance());
         password = cpi.deCrypt(criptPassword.getBytes());
         cpi = null;
     
        
   conn= poolConn.getConnection(user, password);
  try{
	poolConn.verifyConnection(conn, "Verifica connessione pool registry");
  }
  catch (Exception e){
	  conn= poolConn.getConnection(user, password);
	  
  }


return conn;	
}

public void chiudi(Connection connIn,ServletContext myInputContext) throws SQLException {	
	
String poolName = myInputContext.getInitParameter("RegistryPoolName");
UtilsPoolConnection poolConn = new UtilsPoolConnection(poolName);	
	
//poolConn.closeConnection(connIn);

poolConn.closeConnection(connIn, "Connection closed");

}





}





