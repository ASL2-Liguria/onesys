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
package ajax ;

import imago.sql.TableResultSet;
import imagoAldoUtil.classRsUtil;
import imagoAldoUtil.classStringUtil;
import imagoAldoUtil.checkUser.classUserManage;

import java.sql.Connection;
import java.sql.ResultSet;

import javax.naming.NamingException;
import javax.servlet.ServletContext;

import org.directwebremoting.WebContextFactory;

import polaris.security.LDAP;
import polaris.security.LDAPUserProperties;

public class ajaxManageLDAP
{
    public ajaxManageLDAP ()
    {
    }

    /**
     * procedura che autentica l'utente
     * attraverso un server LDAP
     *
     * @param strIp String
     * @param strPorta String
     * @param strBaseDn String
     * @param strSSLtype String
     * @param strKeystore String
     * @param strUser String
     * @param strPwd String
     * @return String OK(nessun altro msg) oppure   KO*msg Errore
     *
     *
     *
     */
    public String checkAuthenticationByLdap(String strIp, String strPorta, String strBaseDn, String strSSLtype, String strKeystore, String strUser, String strPwd, String keyStorePwd){

       polaris.security.LDAP        objLDAP = null;
       boolean                      bolEsito = false;
       String                       groupLDAP = "";
       String                       sql = "";
       ServletContext       myContext = null;
       Connection                   myConn = null;
       TableResultSet               myTable = null;
       ResultSet                    rs = null;
       classRsUtil                  myUtil = new classRsUtil() ;
       String                       strEsito = "";
       LDAPUserProperties           ldapProp = null;

       // per verfica: mettere come gruppo il dominio elco2009.it
       // server 192.168.1.16
      // porta 386
      // fare la login utilizzando il proprio utente di sistema (es.metti aldo.giannuzzi)


       try {
           // ATTENZIONE
           // per estrapolare infoGruppoLDAP
           // dell'utente loggato
           // da passare come parametro a LDAP
           // quindi chiudere la connessione!!
           myContext = WebContextFactory.get().getServletContext();
           WebContextFactory.get().getSession(false);
           // devo recuperare il gruppo dell'utente
           sql = "select infoGruppoLDAP from web where webuser ='" + classStringUtil.repapici(strUser) +"'";
           //logToOutputConsole.writeLogToSystemOutput(this, "Sql for having ldap group: " + sql,imago.a_sql.CLogError.LOG_DEBUG, myContext, session);
           String user = myContext.getInitParameter ( "WebUser" );
           String pwd = classUserManage.decodificaPwd ( myContext , myContext.getInitParameter ( "WebPwd" ) );
           myConn = imago.sql.Utils.getTemporaryConnection(user, pwd);

           myTable = new TableResultSet();
           rs = myTable.returnResultSet(myConn, sql);
           if (rs.next()){
               groupLDAP = myUtil.returnStringFromRs(rs,"infoGruppoLDAP");
//                 public LDAP(String hostname, String port, String base_dn, String ssl_type, String ssl_keystore, String ssl_keystore_password) throws Exception { }
//               objLDAP = new LDAP(strIp, strPorta, strBaseDn, strSSLtype, strKeystore, keyStorePwd);
//               objLDAP.SetGroup(groupLDAP);
               objLDAP = new LDAP(myConn);
               try{
		   objLDAP.VerifyLogin ( strUser , strPwd ) ;
                   bolEsito = true;
                   ldapProp = objLDAP.getLDAPUser();
	       }
               catch(NamingException ex){
                   bolEsito = false;
                   strEsito = "KO*" + ex.getMessage();
               }

           }
           else{
               bolEsito = false;
               strEsito = "KO*Non e' definito alcun gruppo LDAP dell'utente";
           }
       }
       catch (Exception ex) {
           bolEsito = false;
           try{
               System.out.println ("Exception authenticating on LDAP - strIp: "+ strIp + ", strPorta: " + strPorta +", strBaseDn: " + strBaseDn +", strSSLtype: " + strSSLtype + ", strKeystore: " + strKeystore +", groupLDAP: " + groupLDAP +"\n");
               System.out.println ("Other params - user: "+ strUser + ", pwd: " + strPwd );
           }
           catch(Exception e){strEsito = "KO*" + e.getMessage();}
           ex.printStackTrace();
       }
       finally{
           try{
	       if ( myConn != null )
	       {
		   imago.sql.Utils.closeTemporaryConnection ( myConn ) ;
		   myConn = null ;
	       }
               if (rs!=null){
		   rs.close () ;
                   rs = null;
	       }
               if (myTable!= null){
                   myTable.close();
                   myTable = null;
               }
	   }
           catch(Exception ex){
               ex.printStackTrace();
           }
       }
       if (bolEsito){
           strEsito = "OK";
           if (ldapProp!=null){
               strEsito += "*" + String.valueOf (ldapProp.daysAccountExpire) + "*" + String.valueOf (ldapProp.daysPasswordExpire);
           }
       }
       return strEsito;
   }


}
