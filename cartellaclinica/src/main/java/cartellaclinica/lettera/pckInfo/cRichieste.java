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
package cartellaclinica.lettera.pckInfo;

import generic.statements.StatementFromFile;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imagoAldoUtil.classTabExtFiles;
import imago_jack.imago_function.db.functionDB;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import configurazioneReparto.baseReparti;
import core.Global;


public class cRichieste implements ILetteraInfo{

	HttpServletRequest Request;
	HttpSession Session;
	functionDB fDB;
	baseReparti bReparti;
	private ElcoLoggerInterface logInterface = new ElcoLoggerImpl(cRichieste.class);


	@Override
	public void setRequest(HttpServletRequest req,HttpSession p_sess,functionDB p_fDB){
		this.Request = req;
		this.Session = p_sess;
		this.fDB = p_fDB;
		bReparti = Global.getReparti(Session);

	}

	@Override
	public String getHtml() throws SqlQueryException, SQLException, Exception{


		String resp=""; 

		resp+="<div class=divFiltroRichieste>\n";

		resp+="<div style='display:block;clear:both;'>\n";
		resp +="<input type=radio name=radioFiltroRic id=radioFiltroStr checked onclick=\"NS_CRICHIESTE.filtraRichieste('STR');\"/><label>Esami strumentali</label>\n";
		resp +="<input type=radio name=radioFiltroRic id=radioFiltroLabo onclick=\"NS_CRICHIESTE.filtraRichieste('LABO');\"/><label>Esami di laboratorio</label>\n";
		resp+="</div>\n";



		resp+="</div>\n";

		resp+= "<div class=dataContainerRic id=divRichiesteStr onselectstart=abilitaSelezione();>\n<table>\n<tr>\n";

		StatementFromFile sff =null;
		ResultSet rs=null;
		SAXBuilder builder;
		Document docXml = null;
		ArrayList<String> arBind;
		String [] pBind;




		InputStream is = new ByteArrayInputStream(bReparti.getValue(this.Request.getParameter("reparto").trim(),"STATEMENTS_RICHIESTE_LETTERA").getBytes());
		builder = new SAXBuilder();
		try {
			docXml = builder.build(is);
		}				catch(Exception e){

			logInterface.error(e.getMessage(), e);
		}
		Element elmNodoFunzione, elmNodoStatement;
		List lst = docXml.getRootElement().getChildren("FUNZIONE");
		Iterator it = lst.iterator();

		List lstStatement;
		List lstTipologia;
		List lstLabo;
		Iterator itStatement = null;
		Iterator itTipologia = null;
		Iterator itLabo = null;
		Element elmTipo,elmKey;
		int i=0;
		String[] param=new String[]{Request.getParameter("ricovero")};

		while(it.hasNext()){
			elmNodoFunzione = (Element) it.next();
			if(elmNodoFunzione.getAttributeValue("name").equals(this.Request.getParameter("funzione"))){

				lstTipologia = elmNodoFunzione.getChildren("TIPOLOGIA");
				itTipologia = lstTipologia.iterator();

				while(itTipologia.hasNext()){
					elmNodoFunzione = (Element) itTipologia.next();	
					if(elmNodoFunzione.getAttributeValue("name").equals("STRUMENTALI")){
						lstStatement = elmNodoFunzione.getChildren("STATEMENT");
						itStatement = lstStatement.iterator();
					}
					else if(elmNodoFunzione.getAttributeValue("name").equals("LABORATORIO")){
						lstLabo = elmNodoFunzione.getChildren("STATEMENT");
						itLabo = lstLabo.iterator();
					}

				}

				break;
			}
		}

		while (itStatement.hasNext()){
			i+=1;  

			try{
				elmNodoStatement=(Element)itStatement.next();

				//se è lo statement che cerca i dati di ps su polaris bisogna prima richiamare lo statement	checkDatiPs	
				if(elmNodoStatement.getAttributeValue("name").equals("getRichiestePs"))
				{ 
					try{
						sff = new StatementFromFile(this.Session);
						String[] res = sff.executeStatement("letteraSezioniInfo.xml","checkDatiPs",new String[]{Request.getParameter("ricovero")},3);
						if(res[0].equals("KO") || res[2]==null || res[3]==null || res[2]==""){
							continue;            
						}
						else{
							param=new String[]{res[2],res[3],res[4]};	

						}

					}
					catch(Exception e){

						logInterface.error(e.getMessage(), e);
					}
					finally {
						try {sff.close();} catch (Exception x){}
					}
				}
				else
				{
					arBind = new ArrayList();
					pBind= elmNodoStatement.getAttributeValue("param").split(",");
					for(int u = 0;u< pBind.length; u++){
						arBind.add(Request.getParameter(pBind[u]));
					}

					param=arBind.toArray(new String[arBind.size()]);

				}


				sff = new StatementFromFile(this.Session);
				rs = sff.executeQuery("letteraSezioniInfo.xml",elmNodoStatement.getAttributeValue("name"),param);
				ResultSetMetaData rsmd=rs.getMetaData();

				//se è il primo statement metto l'intestazione
				if(i==1){
					for(int q=1;q<=rsmd.getColumnCount();q++)
						resp += "<th>"+rsmd.getColumnLabel(q)+"</th>\n";
					resp+="</tr>\n";
				}


				while(rs.next()){
					resp+="<tr>\n";
					for(int q=1;q<=rsmd.getColumnCount();q++)
						resp += "<td>"+chkNull(rs.getString(rsmd.getColumnLabel(q)))+"</td>\n";

					resp+="</tr>\n";
				}

			}
			catch(Exception e){

				logInterface.error(e.getMessage(), e);
			}
			finally {
				try {rs.close();} catch (Exception x){}
				try {sff.close();} catch (Exception x){}
			}

		}

		resp+="</table>\n</div>\n";

		resp+= "<div class=dataContainerRic id=divRichiesteLabo onselectstart=abilitaSelezione();>\n<table>\n<tr>\n";
		i=0;
		while (itLabo.hasNext()){
			i+=1;  
			try{
				elmNodoStatement=(Element)itLabo.next();

				arBind = new ArrayList();
				pBind= elmNodoStatement.getAttributeValue("param").split(",");
				for(int u = 0;u< pBind.length; u++){
					arBind.add(Request.getParameter(pBind[u]));
				}

				param=arBind.toArray(new String[arBind.size()]);


				sff = new StatementFromFile(this.Session);
				rs = sff.executeQuery("letteraSezioniInfo.xml",elmNodoStatement.getAttributeValue("name"),param);
				ResultSetMetaData rsmd=rs.getMetaData();

				//se è il primo statement metto l'intestazione
				if(i==1){
				for(int q=1;q<=rsmd.getColumnCount();q++)
					resp += "<th>"+rsmd.getColumnLabel(q)+"</th>\n";
				resp+="</tr>\n";
				}


				while(rs.next()){
					resp+="<tr>\n";
					for(int q=1;q<=rsmd.getColumnCount();q++)
						resp += "<td>"+chkNull(rs.getString(rsmd.getColumnLabel(q)))+"</td>\n";

					resp+="</tr>\n";
				}

			}
			catch(Exception e){

				logInterface.error(e.getMessage(), e);
			}
			finally {
				try {rs.close();} catch (Exception x){}
				try {sff.close();} catch (Exception x){}
			}
		}

		resp+="</table>\n</div>\n";
		resp+= getSpecificLink();

		return resp;

	}

	private String getSpecificLink() throws SqlQueryException, SQLException {
        return classTabExtFiles.getIncludeString(fDB.getConnectWeb(), "TAB_EXT_FILES", this.getClass().getName(), "");
	}

	private String chkNull(String in ){
		if(in==null)
			return "";
		else
			return in;
	}

}
