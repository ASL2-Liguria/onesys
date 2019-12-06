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

import imago.http.classFormHtmlObject;
import imago.http.classInputHtmlObject;

import java.sql.Connection;
import java.sql.SQLException;

public class plgHiddenFormDatiPS {
	
	private Connection otherConnection = null;
	
	private classFormHtmlObject cForm  = null;
	
	private classInputHtmlObject cInput;
	
	/**disegno il form a cui come nome passo sempre hiddenForm*/
	public void drawForm (String hForm,String azione,String target)
    {
    	this.cForm = new classFormHtmlObject(hForm, azione, target);
    }
    
	/**setto la connessione passando tutti i parametri*/
    public void setOtherConnection(String poolName, String user, String pwdCriptata, String tipoCriptazione) throws SQLException {
        getPoolConnection pool = new getPoolConnection(poolName, user, pwdCriptata, tipoCriptazione);
        try {
            otherConnection = pool.getConnection();
        }
        catch(Exception e) {
            otherConnection.close();
        }
    }
    
    public classInputHtmlObject creaHidden(String nome)//,String poolName, String user, String pwdCriptata, String tipoCriptazione)
    {	
try 
		{
//			setOtherConnection(poolName, user, pwdCriptata, tipoCriptazione);
//			rs = this.fDB.open(sSql, otherConnection);
			
//			while (rs.next())
//			{
	    	
//				if	(nome.equals("hidNome"))
//					valore=rs.getString("paz_nome");
//				else
//					valore=rs.getString("paz_nome");	
	    	
				this.cInput = new classInputHtmlObject("hidden",nome,"puppa");
//			}
		}
		catch (Exception e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
//     	this.cForm.appendSome(cInput);
		return this.cInput;
    }

}
