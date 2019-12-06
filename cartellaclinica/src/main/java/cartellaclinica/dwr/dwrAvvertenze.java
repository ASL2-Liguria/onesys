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
package cartellaclinica.dwr;

import generic.statements.StatementFromFile;
import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.directwebremoting.WebContextFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import configurazioneReparto.baseReparti;
import core.Global;
import core.cache.CacheManager;

public class dwrAvvertenze {

	Connection conn = null;
	baseUser User=null;
	HttpSession session=null;
	HttpServletRequest req=null;
    private baseReparti bReparti;	
	final protected ElcoLoggerInterface log=new ElcoLoggerImpl(this.getClass());
	StatementFromFile sff = null;


	public dwrAvvertenze() throws SqlQueryException{
		init();
	}

	private void init() throws SqlQueryException{
		session= WebContextFactory.get().getSession();
		req = WebContextFactory.get().getHttpServletRequest();
		User=Global.getUser(session);
		conn=User.db.getDataConnection();
		bReparti = Global.getReparti(session);
		try {
			sff = new StatementFromFile(session);
		} catch (Exception e) {
			log.error(e);
		}
	}



	public List<String> getHtml(String strObject, String procedura) throws Exception  {

		List<String> resp = new ArrayList<String>();

		JSONArray records = null;
		JSONObject item = null;
		JSONObject jObject=null;
		JSONObject jConfStatement=null;
		JSONObject jLivelli=null;
		JSONObject jLivelloOut=null;
		String[] arParametri=null;
		String[] arParametriValue=null;
		String[] respStat=null;
		String avvRecord = null;
		Map<String,Map<String,String>> avvertenzeTab=null;
		ArrayList<configMenuRep> recordConf=null;
		Iterator<configMenuRep> iterator=null;
		configMenuRep avvertenza=null;
		String valAvv;
		String fromTabAvv;
		String tipoUte=null;
		String strIdenVisita="";
	    jObject = new JSONObject(strObject);


			
			records = (JSONArray) jObject.get("records");
			
			//ciclo i records per concatenare tutti gli iden_visita/iden_ricovero
			for (int i = 0; i < records.length(); ++i) {
				item = records.getJSONObject(i);
				if(!strIdenVisita.equals("")){
					strIdenVisita+=","; 
				}
				strIdenVisita+= (String)item.get("IDEN_RICOVERO")+','+(String)item.get("IDEN_VISITA");
			}
			
			//prendo le avvertenze tabellate in TAB_AVVERTENZE
		    avvertenzeTab=getAvvertenzeTab(strIdenVisita);

			//ciclo i record della worklist
			for (int i = 0; i < records.length(); ++i) {
				avvRecord="";
				item = records.getJSONObject(i);

				//prendo le configurazioni delle avvertenze da elaborare
				recordConf = getConfigMenuReparto((String) item.get("REPARTO"),(String) item.get("COD_TIPO_RICOVERO"),procedura);				
				
			//ciclo le avvertenze per il singolo record
				iterator = recordConf.iterator();
				while (iterator.hasNext() && req.isRequestedSessionIdValid()) {
				 avvertenza=iterator.next();
				 
				   
				 try {
						tipoUte=(String) jObject.get("TIPO_UTE");
					} catch (JSONException e1) {
						 log.error(e1);
					}
				 
				//controllo che l'utente loggato possa vedere questa avvertenza, altrimenti passo alla successiva
					if (avvertenza.getTipoUte()!=null && !avvertenza.getTipoUte().equals(tipoUte)){continue;}
				//se l'avvertenza è un link diretto 	
					if(avvertenza.getGruppo()!=null){
						avvRecord+=getHtmlAvvertenza(avvertenza.getGruppo(),avvertenza.getFunzione(),avvertenza.getRiferimenti());
					}
				
					else
					{
					 try {	
						jConfStatement = new JSONObject(avvertenza.getStatement());
						
							try {
								fromTabAvv=jConfStatement.get("fromTabAvvertenze").toString();
							} catch (JSONException e1) {
								fromTabAvv="N";
							}
						
						//se l'avvertenza è tra quelle tabellate su TAB_AVVERTENZE	
						if(fromTabAvv.equals("S")){
						  try{
							valAvv=avvertenzeTab.get(item.get("NUM_NOSOLOGICO")).get(jConfStatement.get("nome"));
							jLivelli= new JSONObject(jConfStatement.get("livelli").toString());
							jLivelloOut= new JSONObject(jLivelli.get(valAvv).toString());
							avvRecord+=getHtmlAvvertenza((String)jLivelloOut.get("classe"),avvertenza.getFunzione(),(String)jLivelloOut.get("titolo"));
						  }
						  catch (Exception e){}
						}
						
						//eseguo la query da statement
						else
						{
								arParametri=jConfStatement.get("parametri").toString().split(",");
								arParametriValue=new String[arParametri.length];
								for (int a = 0; a < arParametri.length; a++){
									if(arParametri[a].equals("TIPO_UTE") || arParametri[a].equals("IDEN_PER")){
										arParametriValue[a]=(String) jObject.get(arParametri[a]);
									}
										else{
										arParametriValue[a]=(String) item.get(arParametri[a]);
									}
							        	
							            }
								
								try {
									sff = new StatementFromFile(session);
									respStat = sff.executeStatement("avvertenze.xml",(String) jConfStatement.get("nome"),arParametriValue, 2);
									avvRecord+=getHtmlAvvertenza(respStat[2],avvertenza.getFunzione(),respStat[3]);
								} catch (Exception e) {
									log.error(e);
								}
								finally{
									sff.close();
								}
						}
					 } catch (JSONException e1) {
						 log.error(e1);
						}
					}
					
				}
				resp.add(avvRecord);
			} 

		return resp;
	}
	
	public String getHtmlAvvertenza(String classCss,String funzioneJs,String title){
	 String out="";	
	 if (classCss!=null && !classCss.equals("")){	
		 out="<div id=\"divButtonWk\" class=\"divButtonWk "+classCss+"\" title=\"" + title + "\" onClick=\"" +funzioneJs+ "\"></div>";
	 }
	 return out;
	}
	


	public ArrayList<configMenuRep> getConfigMenuReparto(String reparto, String codTipoRic, String procedura) throws Exception{

		ArrayList<configMenuRep> resp;
		configMenuRep cmr=null;

//		baseReparti bReparti = Global.getReparti(session);
		String codice_reparto = bReparti.getValue(reparto, procedura,codTipoRic);


		CacheManager cache = new CacheManager("avvertenze");
		String cachestring = procedura+"@" + codice_reparto+"@"+codTipoRic;
		resp =  (ArrayList<configMenuRep>) cache.getObject(cachestring);

		if (resp == null) {
			ResultSet rs = null;
		    resp = new ArrayList<configMenuRep>();

			try {
				rs = sff.executeQuery("configurazioni.xml", "getConfigMenuRepartoAvv", new String[]{procedura,codice_reparto});
				while (rs.next()) {
					cmr = new configMenuRep();
					cmr.setFunzione(rs.getString("FUNZIONE"));
					cmr.setTipoUte(rs.getString("TIPO_UTE"));
					cmr.setLabel(rs.getString("LABEL"));
					cmr.setQuery(rs.getString("QUERY"));
					cmr.setGruppo(rs.getString("GRUPPO"));
					cmr.setRiferimenti(rs.getString("RIFERIMENTI"));
					cmr.setQueryControllo(rs.getString("QUERY_CONTROLLO"));
					cmr.setStatement(rs.getString("STATEMENT"));
					resp.add(cmr);
				}
			 cache.setObject(cachestring, resp);
			} catch (SQLException sqle) {
				log.error(sqle);
			} catch (Exception e) {
				log.error(e);
			} finally {
				try {
					if (rs != null) {
	                    rs.close();
	                }
	                sff.close();				
				} catch (Exception x){log.error(x);}
			}
		}  	
		return resp;

	}
	
	public Map<String, Map<String,String>> getAvvertenzeTab(String nosologici){
		
		Map<String, Map<String,String>> resp=null;
		Map<String,String> mapNos=null;
		String vNosologico="";
		ResultSet rs = null;
	  
		try {
			rs = sff.executeQuery("avvertenze.xml", "getTabAvvertenze", new String[]{nosologici});
			resp = new HashMap<String,Map<String,String>>();
			mapNos = new HashMap<String,String>();
			while (rs.next()) {
				if(!vNosologico.equals("") && !rs.getString("NUM_NOSOLOGICO").equals(vNosologico)){
					resp.put(vNosologico, mapNos);
					mapNos = new HashMap<String,String>();
				}
				mapNos.put(rs.getString("AVVERTENZA"), rs.getString("VALORE"));
				vNosologico=rs.getString("NUM_NOSOLOGICO");
			}
			resp.put(vNosologico, mapNos);
		} catch (SQLException sqle) {
			log.error(sqle);
		} catch (Exception e) {
			log.error(e);
		} finally {
			try {
				 if (rs != null) {
	                    rs.close();
	                }
	                sff.close();			
			} catch (Exception x){log.error(x);}
		}
		
		
		return resp;
	}
	
	
	public class configMenuRep{ 
		String funzione;
		String tipo_ute;
		String label;	
		String query;
		String gruppo;
		String riferimenti;
		String query_controllo;
		String statement;

		public String getFunzione( )
		{
			return funzione;
		}
		public void setFunzione (String input)
		{
			funzione = input;           
		}
		public String getTipoUte( )
		{
			return tipo_ute;
		}
		public void setTipoUte (String input)
		{
			tipo_ute = input;           
		}
		
		public String getLabel( )
		{
			return label;
		}
		public void setLabel (String input)
		{
			label = input;           
		}
		public String getQuery( )
		{
			return query;
		}
		public void setQuery (String input)
		{
			query = input;           
		}
		public String getGruppo( )
		{
			return gruppo;
		}
		public void setGruppo (String input)
		{
			gruppo = input;           
		}
		public String getRiferimenti( )
		{
			return riferimenti;
		}
		public void setRiferimenti (String input)
		{
			riferimenti = input;           
		}
		public String getQueryControllo( )
		{
			return query_controllo;
		}
		public void setQueryControllo (String input)
		{
			query_controllo = input;           
		}
		public String getStatement( )
		{
			return statement;
		}
		public void setStatement (String input)
		{
			statement = input;           
		}
	}

}