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
package gestLettera;

import imago.sql.SqlQueryException;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import matteos.database.DbUtils;
import cartellaclinica.lettera.pckInfo.classInfoLettera;

public class letteraDimEngine extends GestioneStrutturaBase
{
	protected String idenVersione 	= new String("");
	
	public letteraDimEngine(ServletContext cont, HttpServletRequest req,HttpSession sess) 
	{
		super(cont, req, sess);
	}

	public letteraDimEngine(ServletContext cont, HttpServletRequest req) {
		this(cont, req, req.getSession(false));
	}

	public String gestione() throws IllegalAccessException,InstantiationException, ClassNotFoundException,NumberFormatException 
	{
		setProcedure();
		String sOut_1 	= "";		
		
		sOut_1 += super.gestione();
		
		return sOut_1;
	}

	private void setProcedure() 
	{
		setProcSezioni("SEZIONI");
		setProcInfo("INFO");	
		setProcButton("BUTTON");
		setProcFirma("reportFirma");
		setTypeFirma("typeFirma");
	}
	
	/**
	 * Lettura configurazione lettera(sezioni di sinistra) da database
	 * TABELLA: IMAGOWEB.CONFIG_MENU_REPARTO, 
	 * CONFIGURAZIONE ASL2: PROCEDURA = 'SEZIONI',
	 * CODICE_REPARTO = 'LETTERA_DIMISSIONI' O 'LETTERA_AL_CURANTE' O 'LETTERA_PRIMO_CICLO'
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected void readConfigurazioniSezioni() 
	{

		PreparedStatement ps;

		ResultSet rs=null;

		String sql = "Select GRUPPO,LABEL,IDEN_FIGLIO,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=? and ATTIVO=? and IDEN_PADRE is null  order by ORDINAMENTO";

		try
		{
			ps = fDB.getConnectWeb().prepareStatement(sql);
			ps.setString(1,getProcSezioni());
			ps.setString(2,funzione);
			ps.setString(3,"S");

			rs = ps.executeQuery();
			while(rs.next())
			{
				super.lstSezioni.add(new classSezioneLettera(getProcSezioni(),rs.getString("LABEL"),fDB,rs.getString("IDEN_FIGLIO"),"",funzione, Integer.valueOf(idenVisita),this.ricovero));
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	protected  void readConfigurazioniInfo() 
	{
		this.logger.info("readConfigurazioniInfoButton() -  creazione sezioni info");
		PreparedStatement ps;
		ResultSet rs = null;
		String sql = "Select GRUPPO,LABEL,IDEN_FIGLIO,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=? and ATTIVO=? and IDEN_PADRE is null  order by ORDINAMENTO";
		try
		{
			ps = fDB.getConnectWeb().prepareStatement(sql);
			ps.setString(1,getProcInfo());
			/*ps.setString(2,Reparto.getValue(this.repartoDest,getProcInfo()));*/
			ps.setString(2,funzione);
			ps.setString(3,"S");
			
	
			rs = ps.executeQuery();
			while(rs.next()){
				sql="";
				if(rs.getString("QUERY")!=null){
					sql = rs.getString("QUERY").replaceAll("#IDEN_VISITA#",this.idenVisita).replaceAll("#IDEN_ANAG#",this.idenAnag).replaceAll("#CODICE_REPARTO#",this.reparto).replaceAll("#NUM_NOSOLOGICO#",this.ricovero);
					lstInfo.add(new classInfoLettera(this.fDB,rs.getString("LABEL"),sql,rs.getString("GRUPPO")));
				}else{
					lstInfo.add(new classInfoLettera(this.hRequest,this.hSessione,this.fDB,rs.getString("LABEL"),rs.getString("RIFERIMENTI")));
				}
	
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		this.logger.info("readConfigurazioniInfoButton() -  fine creazione sezioni info");

		this.logger.info("readConfigurazioniInfoButton() -  inizio creazione button");
	}
	protected  void readConfigurazioniButton() 
	{		
		this.logger.info("readConfigurazioniInfoButton() -  creazione sezioni info");
		PreparedStatement ps;
		ResultSet rs = null;
		classButton btn;
		String sql = "Select FUNZIONE,LABEL,GRUPPO from CONFIG_MENU_REPARTO where PROCEDURA=?  and CODICE_REPARTO=? and (TIPO_UTE=? or TIPO_UTE is null) and ATTIVO='S' order by ORDINAMENTO desc";
		try
		{		
			ps = fDB.getConnectWeb().prepareStatement(sql);
			/* CONFIGURAZIONE DA FARE LATO JAVASCRIPT
			if (this.stato.equalsIgnoreCase("F"))
				setProcButton("refertaConsulenzeBottomButtonFirma");
			else
				setProcButton("refertaConsulenzeBottomButton");*/
			ps.setString(1,getProcButton());
			ps.setString(2,funzione);
			ps.setString(3,bUtente.tipo);
			rs = ps.executeQuery();
			while(rs.next())
			{
				/* la funzione è associata dinamicamente al button*/
				btn= new classButton(rs.getString("LABEL"),rs.getString("GRUPPO"),"");				
				this.divBottomBar.appendSome(btn.getHtmlId());
			}
		}	
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		this.logger.info("readConfigurazioniInfoButton() -  fine creazione button");
	}

	
	
	
	protected void checkVersione()
	{
		PreparedStatement ps;
		ResultSet rs=null;

		try
		{
			ps=fDB.getConnectData().prepareCall("select IDEN,STATO,ATTIVO,IDEN_TERAPIA_ASSOCIATA from CC_LETTERA_VERSIONI where iden_visita=? and ATTIVO=? and funzione=?");
			ps.setInt(1,Integer.valueOf(idenVisita));
			ps.setString(2,"S");
			ps.setString(3,funzione);
			rs=ps.executeQuery();
			/* Se trovo una lettera per quel iden visita, per quella funzione, attiva(sempre e solo una)
			 * popolo il campo idenVersione*/
			if(rs.next())
			{
				this.idenVersione = rs.getString("IDEN");
				super.idenVersione = this.idenVersione;
				super.stato = rs.getString("STATO");
				super.attivo = rs.getString("ATTIVO");
				super.iden_terapia_associata = DbUtils.checkNullString(rs.getString("IDEN_TERAPIA_ASSOCIATA"));
			}
			else
			{
				super.idenVersione = "";
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * Lettura configurazione lettera(sezioni di sinistra) da xml -> si verifica quando si apre la lettera ed e' presente 
	 * una lettera salvata precedentemente. Lettura sulla vista VIEW_CC_LETTERA_SEZ_CLOB  
	 * @throws SQLException
	 * @throws SqlQueryException
	 */
	protected void loadConfigurazioneFromXml()
	{
		Integer idx=null;

		PreparedStatement ps;
		ResultSet rs=null;
		
		try
		{
			ps = fDB.getConnectData().prepareCall( "select * from VIEW_CC_LETTERA_SEZ_CLOB_GEN where iden_versione=? and funzione=?");
			ps.setInt(1, Integer.valueOf(this.idenVersione));
			ps.setString(2, this.funzione);
			rs = ps.executeQuery();

			while (rs.next()) 
			{
				for(int i=0;i<lstSezioni.size();i++)
				{
					if(lstSezioni.get(i).label.equals(chkNull(rs.getString("SEZIONE"))))
						idx=i;
				}
				if(idx==null)
				{
					lstSezioni.add(new classSezioneLettera(chkNull(rs.getString("SEZIONE")),fDB, Integer.valueOf(idenVisita), ricovero,funzione));
					idx=lstSezioni.size()-1;
				}
				lstSezioni.get(idx).addTxtArea(rs.getString("ID_ELEMENTO"),rs.getString("LABEL"),rs.getString("ROWS"),rs.getString("TESTO_HTML"));
				this.stato = rs.getString("STATO");
				this.attivo = rs.getString("ATTIVO");
				idx = null;
			}
		}
		catch (SQLException e)
		{
			e.printStackTrace();
		}
		catch (SqlQueryException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

}

