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

import imago.http.baseClass.baseUser;
import imagoAldoUtil.classTraceUserAction;
import imagoAldoUtil.classTypeUserAction;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.json.JSONObject;

import core.Global;

public class ajaxTraceUserAction
{
    public ajaxTraceUserAction ()
    {
    }
    /**
     *
     * @param myAction classTypeUserAction
     */
    public void saveAction(String info){
        HttpServletRequest   myRequest = null;
        HttpSession          mySession = null;
        classTypeUserAction  myAction = null;
        JSONObject           myInfo = null, objTmp=null ;
        org.json.JSONArray   myInfoArray = null;
        String               strAction = "", strIden_anag="", strIden_esa="", strIden_ref="";


        WebContextFactory.get ().getServletContext ();
        myRequest = WebContextFactory.get().getHttpServletRequest();
        mySession = WebContextFactory.get().getSession(false);
        try{
            myInfo = new JSONObject(info);
            if (myInfo!=null){
                myInfoArray = myInfo.getJSONArray("userAction");
                objTmp = (JSONObject) myInfoArray.get(0);
                strAction = objTmp.getString("action").toString();
                strIden_anag = objTmp.getString("iden_anag").toString();
                strIden_esa = objTmp.getString("iden_esame").toString();
                strIden_ref = objTmp.getString("iden_ref").toString();
                myAction = new classTypeUserAction(strAction,strIden_anag , strIden_esa, strIden_ref );
		classTraceUserAction.saveAction ( myAction , mySession , myRequest ) ;
	    }
	}
        catch(Exception ex){
            ex.printStackTrace();
        }
    }

    /**
     * ritorna le info
     * relative all'ultima azione
     * compiuta dall'utente passato
     * come parametro al metodo
     *
     * @param userID String
     * @return JSONObject
     */
    public String getLastAction(String userID){

        JSONObject                myObject = null;
        classTypeUserAction       myAction =null;
        baseUser                  logged_user = null;

        try{

            logged_user = Global.getUser(WebContextFactory.get().getSession(false));
            if (logged_user!=null){
		myAction = classTypeUserAction.getLastUserAction ( logged_user.
			db.getWebConnection () , userID ) ;
                myObject = new JSONObject(myAction,false);
	    }
            // "userAction": [        {"action": "", "iden_anag": "", "iden_esame": "" , "iden_ref":""}

        }
        catch(Exception ex){
            ex.printStackTrace();
        }
        return myObject.toString();
    }
}
