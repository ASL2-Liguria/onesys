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
package unisys.login;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

import javax.naming.NamingException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import core.Global;

import polaris.security.LDAP;
import unisys.Tools;

/**
 * @author stage
 *
 */
public class LoginLDAP extends LoginAbstract 
{
	public LoginLDAP(ServletContext cont, HttpServletRequest req, HttpServletResponse resp) 
	{
		super(cont, req, resp);
	}

	@Override
	public void verifyLogin(String user, String psw) throws Exception 
	{
		try 
		{
			LDAP ldap = new LDAP(dbConns.getWebConnection());
			ldap.VerifyLogin(user, psw);
		}
		catch (NamingException ne) 
		{
			logger.info(ne.getMessage());
			throw new Exception("KO$" +  ne.getLocalizedMessage(),ne);
		}
		catch (Exception e) 
		{
			logger.error(e.getMessage());
			throw new Exception("KO$" +  e.getLocalizedMessage(),e);
		}
		updatePwdLDAP(user,psw);
	}

	@Override
	public void cambiaPwd(String user, String psw, String newpsw) throws Exception {
		throw new Exception("KO$Effettuare il cambio password secondo le modalita' definite dall'amministratore di sistema.");
	}
	
/**
 * Funzione che aggiorna automaticamente la password nel caso di login ldap
 * 
 * @param user = imagoweb.webuser
 * @param psw  = imagoweb.webpassword
 */
	private void updatePwdLDAP(String user, String psw){
		Connection	conn    = null;
		try{
			String query = "begin :pResult :=UTENTI.aggiornaPasswordLDAP(:pUser,:pPsw,:pApplicazione); end;";
			conn = this.dbConns.getWebConnection();
			CallableStatement ps= conn.prepareCall(query);

			ps.registerOutParameter("pResult", Types.VARCHAR);
			ps.setString("pUser", user);
			ps.setString("pPsw", Tools.fromByteToString(Tools.cryptPassword(this.context, psw)));
			ps.setString("pApplicazione", Global.getApplicazione());

			ps.executeQuery();

			String result = ps.getString("pResult");
		}catch(Exception e){

		}finally{
			try {
				conn.close();
				conn = null;
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
	}
}
