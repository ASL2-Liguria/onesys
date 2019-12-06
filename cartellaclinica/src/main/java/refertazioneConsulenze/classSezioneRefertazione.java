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
package refertazioneConsulenze;

import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;

import java.lang.reflect.InvocationTargetException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.http.HttpSession;

import oracle.jdbc.OraclePreparedStatement;
import refertazioneConsulenze.pckObject.*;

public class classSezioneRefertazione {

	private String vLabel		= "";
	private String vFunzione	= "";
	private String vRicovero	= "";
	private String vReparto		= "";
	private String vIdenVisita  = "";
	private baseUser bUtente 	= null;
	private functionDB vfDB;
	private HttpSession pSess;
	public ArrayList<iRefLetObject> lstPckGeneric = new ArrayList<iRefLetObject>();

	public classSezioneRefertazione(String lblPadre,HttpSession pSession,functionDB fDB,String pIdenVisita, String ricovero,String funzione,String reparto,baseUser pUtente) throws Exception{
		this.vLabel 		= lblPadre;
		this.vIdenVisita 	= pIdenVisita;
		this.vRicovero 		= ricovero;
		this.vfDB 			= fDB;
		this.vFunzione 		= funzione;
		this.pSess			= pSession;
		this.vReparto		= reparto;
		this.bUtente		= pUtente;
	}

	public String toHTML(boolean show) throws SqlQueryException, SQLException{
		String resp;
		if(show)
			resp = "<div class=tabShow>";
		else
			resp = "<div class=tabHide>";

		for (int i=0;i<lstPckGeneric.size();i++)
			resp+=((iRefLetObject) lstPckGeneric.get(i)).toHtml(this.vLabel);

		resp+=       "</div>";

		return resp;
	}


	public void addTxtArea(String id,String lbl,String rows,String value){
		lstPckGeneric.add(new pckTextArea(id,lbl,rows,value));
	}

	public void readHtml(String html,String id_elemento, String lblPadre) {
		// TODO Auto-generated method stub
		lstPckGeneric.add(new pckObjectXml(this.pSess,html,id_elemento,lblPadre));

	}

	public void addTxtArea(String id,String lbl,String rows,String value,String ordinamento){
		lstPckGeneric.add(new pckTextArea(id,lbl,rows,value,ordinamento));
	}

	public void readHtml(String html,String id_elemento, String lblPadre,String ordinamento) {
		// TODO Auto-generated method stub
		lstPckGeneric.add(new pckObjectXml(this.pSess,html,id_elemento,lblPadre,ordinamento));

	}    
    
	public void creaSezione(String procedura,String idenPadre) {
		// TODO Auto-generated method stub
		OraclePreparedStatement psQuery;
		ResultSet rsQuery 	= null;
		ResultSet rs		= null;
		String vContenuto="";
		StatementFromFile sff = null;
		boolean vCheckQueryControllo =  true;
		
		try {
			sff = new StatementFromFile(this.pSess);
			rs = sff.executeQuery("refertazione.xml","consulenze.getSectionsValue",new String[]{
					procedura,
					this.vReparto,
					this.vFunzione,
					idenPadre,
					this.bUtente.tipo
			});

			while(rs.next()){
                                vContenuto="";
				if(rs.getString("QUERY")!=null) {
					/*Utilizzata per ritornare un valore particolare con il quale popolare la text area*/
					psQuery=(OraclePreparedStatement) vfDB.getConnectData().prepareCall(rs.getString("QUERY"));
					try {
						psQuery.setIntAtName("idenVisita",Integer.valueOf(this.vIdenVisita));
						rsQuery=psQuery.executeQuery();
						if(rsQuery.next()) {
							vContenuto = rsQuery.getString(1);	
						}
					}catch(Exception e) {

					}finally{
						rsQuery.close();
                        if(psQuery != null){
                            psQuery.close();
                            psQuery = null;
                        }
                    }
				}
				
				try{
					Class<iRefLetObject> myClass = (Class<iRefLetObject>) Class.forName(rs.getString("RIFERIMENTI"));
					lstPckGeneric.add( (iRefLetObject) myClass.getConstructor(new Class[] {HttpSession.class,String.class,String.class,String.class}).newInstance(this.pSess,rs.getString("GRUPPO"),this.vLabel,rs.getString("ORDINAMENTO")));
				}catch(ClassNotFoundException ex){
					lstPckGeneric.add(new pckTextArea(rs.getString("GRUPPO"),rs.getString("LABEL"),rs.getString("RIFERIMENTI"),vContenuto,rs.getString("ORDINAMENTO")));
				} catch (InstantiationException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					e.printStackTrace();
				}
			}

		} catch (Exception ex) {
			ex.printStackTrace();
		} finally{
			sff.close();
		}
	}
	
	public String getvLabel() {
		return vLabel;
	}

	public void setvLabel(String vLabel) {
		this.vLabel = vLabel;
	}
}
