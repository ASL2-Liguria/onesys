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
package stampe.anteprima;

import imago.a_sql.CLogError;
import imago.http.baseClass.baseUser;

import org.directwebremoting.WebContextFactory;

import core.Global;
/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: </p>
 *
 * <p>Company: </p>
 *
 * @author Fabio
 * @version 1.0
 */
public class LogJavascript {
    private CLogError log=null;
 public LogJavascript()  {

 }
public String WriteError (String var) {
String Error="";
    String[] ArrayScript=var.split("[*]");
 try {
     baseUser logged_user = Global.getUser(WebContextFactory.get().getSession(false));

     log=new CLogError(logged_user.db.getWebConnection(), null ,ArrayScript[0], logged_user.login);
     log.setFileName("Javascript");
     log.setClassName("Javascript"+ArrayScript[0]);
     log.writeError(ArrayScript[1]);


 }
         catch (Exception ex)
     {System.out.println(ex.getMessage()); 
        	 }
     
return Error;
}

 public String WriteInfo (String var) {
 String Error="";
     String[] ArrayScript=var.split("[*]");
  try {
      baseUser logged_user = Global.getUser((WebContextFactory.get()).getSession(false));

      log=new CLogError(logged_user.db.getWebConnection(), WebContextFactory.get().getHttpServletRequest() , ArrayScript[0], logged_user.login);
      log.setFileName("Javascript");
      log.setClassName("Javascript "+ArrayScript[0]);
      log.writeInfo(ArrayScript[1]);


  }
          catch (Exception ex)
      {System.out.println(ex.getMessage()); }
 return Error;
}


}
