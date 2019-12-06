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

package stampe.PDFfromDB;
import imago.http.baseClass.baseGlobal;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classStringUtil;

import java.sql.Clob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

import polaris.digitalsign.RetrieveSignInfo;

import worklist.ImagoWorklistException;
import core.Global;

/**
 * 
 * @author fabioc
 */
public class ServleTReadPDFEngine {
	HttpSession mySession;

	ServletContext myContext;

	HttpServletRequest myRequest;

	String requestIden = "", funzioChiamata = "", chiaSorgernte = "", requestAnteprima = "", requestProgr = "";

	byte[] pdfdaDB = null;

	private baseGlobal infoGlobali = null;

	private baseUser logged_user = null;
	
	private ElcoLoggerInterface logger	= null;
	
	/** Creates a new instance of SERVLETreadFromDBengine */

	public ServleTReadPDFEngine(HttpSession myInputSession, ServletContext myInputContext, HttpServletRequest myInputRequest) {
		super();
		try {

			mySession = myInputSession;
			myContext = myInputContext;
			myRequest = myInputRequest;
			this.logger			= new ElcoLoggerImpl(this.getClass().getName()+".class");
			leggiDatiInput(myRequest, mySession);

		} catch (Exception ex) {

		}

	}

	public byte[] LeggiDBCreaServlet() throws Exception {
		
		RetrieveSignInfo retrievePDF = new RetrieveSignInfo();
		
		Clob myClob = null;

		logged_user = Global.getUser(mySession);
		
		this.logger.info("ServleTReadPDFEngine - LeggiDBCreaServlet()");

		
		if (requestIden == "a") {

			pdfdaDB = null;
			this.logger.error("Problemi durante la creazione del pdf(vedi Errore Precedente) verra visualizzata la pagina di errore");

		} else {
			String mySql = "";
			PreparedStatement ps = null;
			try
			{
				if (("").equalsIgnoreCase(this.funzioChiamata)){
					this.logger.info("Radsql.CC_FIRMA_PDF normale");
					mySql = "select PDF_FIRMATO from Radsql.CC_FIRMA_PDF where iden_tab=? ";
					ps = this.logged_user.db.getDataConnection().prepareStatement(mySql);
					ps.setInt(1,Integer.valueOf(this.requestIden));
				}else{
					if (!("PIANO_TERAPEUTICO").equalsIgnoreCase(this.funzioChiamata)){
						this.logger.info("Radsql.CC_FIRMA_PDF normale");
						mySql = "select PDF_FIRMATO from Radsql.CC_FIRMA_PDF where iden_tab=? and funzione=?";
						ps = this.logged_user.db.getDataConnection().prepareStatement(mySql);
						ps.setInt(1,Integer.valueOf(this.requestIden));
						ps.setString(2,this.funzioChiamata);
					}
					else
					{
						this.logger.info("Radsql.CC_FIRMA_PDF PIANO_TERAPEUTICO");					
						mySql = "select PDF_FIRMATO from Radsql.CC_FIRMA_PDF where iden_tab=? and funzione=? and progr=?";
						ps = this.logged_user.db.getDataConnection().prepareStatement(mySql);
						ps.setInt(1,Integer.valueOf(this.requestIden));
						ps.setString(2,this.funzioChiamata);
						ps.setInt(3,Integer.valueOf(this.requestProgr));				
						
					}
				}
			}
			catch (SQLException ex) {
				this.logger.error(ex.getMessage());				
				// System.out.println(ex.getMessage());
			}
			catch (SqlQueryException ex) {
				this.logger.error(ex.getMessage());				
				// System.out.println(ex.getMessage());
			}
			ResultSet rs = null;

			try {
				rs = ps.executeQuery();

				if (rs.next()) {
					myClob = rs.getClob("PDF_FIRMATO");
					//rs.getString("PDF_FIRMATO");
					byte[] filebyte = IOUtils.toByteArray(myClob.getAsciiStream());
					//byte[] filebyte = atr.toByteArray(myClob);

					this.pdfdaDB = Base64.decodeBase64(retrievePDF.GetPdfFromP7m(filebyte));
//					this.pdfdaDB = Base64.decodeBase64(filebyte);

				}

			} catch (SQLException ex) {
				this.logger.error(ex.getMessage());				
				// System.out.println(ex.getMessage());
			}finally{
				myClob.free();
				rs.close();
                                if (ps!= null){
                                    ps.close();
                                    ps = null;
                                }
			}

		}
		return this.pdfdaDB;
	}

	
	private void leggiDatiInput(HttpServletRequest myInputRequest, HttpSession myInputSession) throws ImagoWorklistException {

		mySession = myInputSession;
		logged_user = Global.getUser(mySession);

		this.logger.info("ServleTReadPDFEngine");
		this.funzioChiamata = classStringUtil.checkNull(myRequest.getParameter("funzione"));		
		try
		{
			this.requestProgr	= classStringUtil.checkNull(myRequest.getParameter("progressivo"));
		}
		catch(Exception ex)
		{
			this.logger.error("Parametri utili solo per il Piano Terapeutico");
		}
		
		try 
		{
			// parsing dati in ingresso
			this.requestIden 	= classStringUtil.checkNull(myRequest.getParameter("iden"));	
			infoGlobali = new baseGlobal();
			infoGlobali.loadInitValue(logged_user.db.getWebConnection());
		}
		catch (Exception ex) 
		{
			this.logger.error(ex.getMessage());
		}
		this.logger.info("Iden PDF su cc_firma_pdf"+this.requestIden);
	}

	public byte[] get_pdfdaDB() {
		return pdfdaDB;

	}

}
