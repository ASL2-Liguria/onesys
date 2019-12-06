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
/*
 * SERVLETreadFromDBengine.java
 *
 * Created on 19 luglio 2006, 11.44
 */

package Scanner;
import imago.a_sql.CLogError;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.basePC;
import imago.http.baseClass.baseUser;
import imago.http.baseClass.baseWrapperInfo;
import imagoAldoUtil.classEsame;
import imagoAldoUtil.classStringUtil;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

//import matteos.stampe.ImagoStampeException;

import worklist.ImagoWorklistException;
import java.sql.Blob;
import java.sql.ResultSet;
import imago.sql.*;

import java.sql.SQLException;

/**
 *
 * @author  fabioc
 */
public class ServleTReadDocumentEng {
	HttpSession                         mySession;
	ServletContext                      myContext;
	HttpServletRequest                  myRequest;
	String                              requestIden = "", funzioChiamata="",chiaSorgernte="",requestAnteprima="",requestProgr="";
	byte[]                      pdfdaDB=null;
	private baseGlobal                  infoGlobali=null;
	private basePC                      infoPC = null;
	private baseWrapperInfo             myBaseInfo =null;
	private baseUser                    logged_user=null;  /** Creates a new instance of SERVLETreadFromDBengine */

	public ServleTReadDocumentEng(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {
		super();
		try {

			mySession = myInputSession;
			myContext = myInputContext;
			myRequest = myInputRequest;
			leggiDatiInput(myRequest,mySession);
			//System.out.println(requestIden);

		} catch (Exception ex) {

		}

	}


	public byte[] LeggiDBCreaServlet() throws Exception {



		baseUser                            logged_user=null;
		classEsame                          myEsame=null;
		byte[]                              pdfdaDB=null;
		CLogError                           log=null;
		baseGlobal							v_globali=null;
		Blob                  myBlob=null;




		logged_user = core.Global.getUser(mySession);
		try{
			log=new CLogError(logged_user.db.getWebConnection(), myRequest, "SERVLETreadFromDB", logged_user.login);
		} catch (Exception ex) {    }
		log.setFileName("SERVLETreadFromDB.java");
		log.setClassName("src.Sel_Stampa.SERVLETreadFromDB");
		if (requestIden=="a")
		{ pdfdaDB=null;
		log.writeLog("Problemi durante la creazione del pdf(vedi Errore Precedente) verra visualizzata la pagina di errore",CLogError.LOG_ERROR);}
		else{
			TableResultSet myTable = null;
			myTable = new TableResultSet();
			String mySql = "select documento from documenti_allegati where iden=" +
					this.requestIden;
			ResultSet rs = null;
			try {
				rs = myTable.returnResultSet(this.logged_user.db.getDataConnection(), mySql);

				if (rs.next()) {
					myBlob = rs.getBlob("documento");
					long lngLunghezza = myBlob.length () ;
					this.pdfdaDB = myBlob.getBytes ( 1 , ( int ) lngLunghezza + 1 ) ;
					myTable.close();
				}


			} catch (SqlQueryException ex1) {
				//System.out.println(ex1.getMessage());
			} catch (SQLException ex) {
				/** @todo Handle this exception */
				//System.out.println(ex.getMessage());
			}




		}
		return  this.pdfdaDB;
	}


	private void leggiDatiInput( HttpServletRequest myInputRequest,HttpSession myInputSession) throws ImagoWorklistException {
		CLogError               log=null;
		classStringUtil         myStringUtil=null;
		mySession = myInputSession;
		logged_user= core.Global.getUser(mySession);
		try {
			log=new CLogError(logged_user.db.getWebConnection(), myRequest, "SERVLETreadFromDB", logged_user.login);
		} catch (Exception ex) { }
		log.setFileName("SERVLETreadFromDB.java");
		log.setClassName("src.Sel_Stampa.SERVLETreadFromDB");
		try {
			// parsing dati in ingresso
			this.requestIden = myStringUtil.checkNull(myRequest.getParameter("iden"));
			infoGlobali = new baseGlobal();
			infoGlobali.loadInitValue(logged_user.db.getWebConnection());
		} catch (Exception ex) {
			log.writeLog("Errore leggendo il requstIden dalle myRequest",CLogError.LOG_ERROR);


		} }
	public byte[] get_pdfdaDB() {
		return pdfdaDB;
	}
}

