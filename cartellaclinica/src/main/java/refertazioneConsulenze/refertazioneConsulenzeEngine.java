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

import imago.http.classInputHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class refertazioneConsulenzeEngine extends srvRefertazioneConsulenze{


	public refertazioneConsulenzeEngine(ServletContext cont, HttpServletRequest req) throws Exception
	{
		super(cont, req);
        super.attributeUnLoad ="opener.parent.applica_filtro();unLock();";
        setProcedure(req.getParameter("tipo"));
	}

	private void setProcedure(String tipo)
	{
		if (tipo.matches("teleconsulto")) {
			setProcSezioni("refertaTeleConsultoSezione");
			setProcInfo("refertaTeleConsultoInfo");
			setProcButton("refertaConsulenzeBottomButton");
			setProcFirma("reportFirma");
			setTypeFirma("typeFirma");
		} else {
			setProcSezioni("refertaConsulenzeSezione");
			setProcInfo("refertaConsulenzeInfo");
			setProcButton("refertaConsulenzeBottomButton");
			setProcFirma("reportFirma");
			setTypeFirma("typeFirma");
		}
	}

	public String getIdenVersione() {
		return super.idenVersione;
	}

	public void setIdenVersione(String idenVersione) {
		super.idenVersione = idenVersione;
	}


	@Override
	protected void readDati()
	{
		setIdenVersione(this.cParam.getParam("idenReferto").trim());
		super.readDati();
	}


	/**
	 * Lettura configurazione refertazione consulenza(sezioni di sinistra) da database
	 * TABELLA: IMAGOWEB.CONFIG_MENU_REPARTO,
	 * CONFIGURAZIONE ASL2: PROCEDURA = 'refertaConsulenzeSezione',
	 * CODICE_REPARTO = 'ASL2',
	 * FUNZIONE = 'CONSULENZE_REFERTAZIONE'
	 * @throws NumberFormatException
	 * @throws SQLException
	 * @throws SqlQueryException

	protected void readConfigurazioniSezioni()
	{
		log.info("readConfigurazioniSezioni()");
		try
		{
			ResultSet rs = super.sff.executeQuery("refertazione.xml","consulenze.getConfigMenuRepartoSezioni",new String[]{
					getProcSezioni(),
					this.bReparti.getValue(this.repartoDest,getProcSezioni()),
					funzione,
					this.bUtente.tipo
			});
			while(rs.next()){
				lstSezioni.add(new classSezioneLettera(getProcSezioni(),rs.getString("LABEL"),fDB,rs.getString("IDEN_FIGLIO"),this.bReparti.getValue(this.repartoDest,getProcSezioni()),funzione,this.bUtente.tipo, Integer.valueOf(idenVisita)));
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			log.info("readConfigurazioniSezioni() - Exception:"+ex.getMessage());
		}
		finally
		{
			super.sff.close();
		}
	}*/


	@Override
	protected void readConfigurazioniSezioni()
	{
		log.info("readConfigurazioniSezioni()");
		classSezioneRefertazione clsRef = null;
		ResultSet rs = null;
		try
		{
			rs = 	super.sff.executeQuery("refertazione.xml","consulenze.getConfigMenuRepartoSezioni",new String[]{
					getProcSezioni(),
					this.bReparti.getValue(this.repartoDest,getProcSezioni()),
					super.funzione,
					this.bUtente.tipo
			});
			while(rs.next()){

				clsRef = new classSezioneRefertazione(rs.getString("LABEL"),super.hSessione,super.fDB, idenVisita,ricovero,super.funzione,this.bReparti.getValue(this.repartoDest,getProcSezioni()),this.bUtente);
				clsRef.creaSezione(getProcSezioni(),rs.getString("IDEN_FIGLIO"));
				lstSezioni.add(clsRef);
			}
		}
		catch (Exception ex){
			ex.printStackTrace();
			log.info("readConfigurazioniSezioni() - Exception:"+ex.getMessage());
		}
		finally
		{
			super.sff.close();
			try {
				rs.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}


	@Override
	protected void loadConfigurazioneFromXml()
	{

		Integer idx=null;
		try
		{
			ResultSet rs = super.sff.executeQuery("refertazione.xml","consulenze.getConfigFromViewSezioni",new String[]{
					super.idenVersione
			});

			while (rs.next())
			{
				for(int i=0;i<lstSezioni.size();i++)
				{
					if(lstSezioni.get(i).getvLabel().equals(chkNull(rs.getString("SEZIONE"))))
						idx=i;
				}
				if(idx==null)
				{
					lstSezioni.add(new classSezioneRefertazione(chkNull(rs.getString("SEZIONE")),super.hSessione,super.fDB,super.idenVisita,super.ricovero,super.funzione,this.bReparti.getValue(this.repartoDest,getProcSezioni()),this.bUtente));
					idx=lstSezioni.size()-1;
				}

				if (rs.getString("NUMERORIGHE").equalsIgnoreCase("0"))
					lstSezioni.get(idx).readHtml(rs.getString("TESTO_HTML"),rs.getString("ID_ELEMENTO"),chkNull(rs.getString("SEZIONE")),chkNull(rs.getString("ORDINAMENTO")));
				else
					lstSezioni.get(idx).addTxtArea(rs.getString("ID_ELEMENTO"),rs.getString("LABELAREA"),rs.getString("NUMERORIGHE"),rs.getString("TESTO_HTML"));
				this.stato = rs.getString("STATO");
				this.attivo = rs.getString("ATTIVO");
				idx = null;
			}
		}catch(Exception ex)
		{
			ex.printStackTrace();
			log.error("loadConfigurazioneFromXml() - Exception:"+ex.getMessage());
		}
		finally
		{
			super.sff.close();
		}
	}
    /*
        Non Implementata, non dovrebbe servire dentro le consulenze
    */
	@Override
	protected boolean loadConfigurazioneFromDb(String idenVisita, String Funzione){
        return false;
    }

	@Override
	protected void checkVersione()
	{
		if(Integer.valueOf(getIdenVersione())<0)
		{
			super.idenVersione="";
		}
		else
		{
			try
			{
				ResultSet rs = super.sff.executeQuery("refertazione.xml","consulenze.getVersioneRefertazione",new String[]{
						idenVisita,
						super.funzione,
						getIdenVersione()
				});

				if(rs.next())
				{
					super.idenVersione = getIdenVersione();
					super.stato = rs.getString("STATO");
					super.attivo = rs.getString("ATTIVO");
				}

			}
			catch(Exception ex)
			{
				ex.printStackTrace();
				log.error("checkVersione() - Exception:"+ex.getMessage());
			}
			finally
			{
				super.sff.close();
			}
		}
	}


	@Override
	protected String getForm() throws Exception
	{
		String []DataOra = null;
		//intestazioneRefConsulenze utilInt = new intestazioneRefConsulenze(getPaziente(), "", "", fDB, fStr, super.idenTes);

		//super.formGesti.appendSome(new classInputHtmlObject("hidden","idenEsame",getIdenEsam()));
		//super.formGesti.appendSome(new classInputHtmlObject("hidden","idenTes",super.idenTes));
		//super.formGesti.appendSome(new classInputHtmlObject("hidden","datiPaz",getPaziente()));

		DataOra=this.getDataOra(idenTes);
		super.formFirma.appendSome(new classInputHtmlObject("hidden","dataEsame",fStr.converti_data(DataOra[1])));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","oraEsame",DataOra[2]));
		//super.formFirma.appendSome(new classInputHtmlObject("hidden","idenEsame",getIdenEsam()));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","idenTes",super.idenTes));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","idenReferto",getIdenVersione()));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","validaFirma","N"));
		return super.getForm();
	}


	@Override
	protected String getIntestazione()
    {
		String []DataOra		;

    	String spanDatiAnagrafici = "<span class='header' id='spDatiAnagr'>" +
    								"<label>Paziente: "+super.paziente+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>";

    	String spanMedicoRefertan = "<label>Medico Refertante: "+bUtente.description+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>";

    	String spanRepartoRichied = "<label>Provenienza: "+reparto+"&nbsp&nbsp&nbsp&nbsp&nbsp</label>" +
									"</span>";

    	DataOra					  = this.getDataOra(idenTes);
    	if (DataOra[0].equals("R"))
    		DataOra[0]="ReadOnly";
    	else
    		DataOra[0]="";


    	String spanData			  = "<table class=\"tabDataOra\">" +
    								"<tr class=\"trDataOra\"><td class=\"tdDataOra\">"+
									"<label>Data di esecuzione: </label></td>" +
									"<td><input type=\"text\" id=\"idDataEsecuzione\" value=\""+DataOra[1]+"\" "+DataOra[0]+"></input>"+
									"</td>";

    	String spanOra			  = "<td class=\"tdDataOra\">"+
									"<label>Ora di esecuzione: </label></td>" +
									"<td><input type=\"text\" id=\"idOraEsecuzione\" value=\""+DataOra[2]+"\" "+DataOra[0]+" ></input>"+
									"</td></tr></table>";

    	String spanEsami = "<div class='fieldset' id='spEsami'><span>Esami Associati</span>"+this.getDescrizioneEsami()+"</div>";

	   return spanDatiAnagrafici+spanMedicoRefertan+spanRepartoRichied+spanData+spanOra+spanEsami;
	}


	private String[] getDataOra(String idenTes){
		/*Imposto la data e ora di sysdate*/
		String[] ret	= {"NR",getDateTime("dd/MM/yyyy"),getDateTime("HH:mm")};
		try
		{
			ResultSet rs = super.sff.executeQuery("refertazione.xml","consulenze.getDataOraRefertazione",new String[]{
						idenTes
						});
			/*Se la consulenza è refertata, sostituisco il campo data e ora con quello di data_refertazione,ora_refertazione*/
			if(rs.next())
			{
				if (rs.getString("STATO_RICHIESTA").equalsIgnoreCase("R")){
					ret[0] = "R";
					ret[1] = fStr.formatta_data(rs.getString("DATA_REFERTAZIONE"));
					ret[2] = fStr.formatta_data(rs.getString("ORA_REFERTAZIONE"));
				}
			}

		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			log.error("getDataOra() - Exception:"+ex.getMessage());
		}
		finally
		{
			super.sff.close();
		}
		return ret;
	}

    private String getDateTime(String formato)
    {
    	String Data    = "";

        DateFormat dateFormat 	= new SimpleDateFormat(formato);
        Date date 				= new Date();
        Data = dateFormat.format(date).toString();
        if (formato.equals("dd/MM/yyyy"))
        	log.info("getDateTime - DATA: "+Data);
        else
        	log.info("getDateTime - ORA: "+Data);
        return Data;
    }


	private String getDescrizioneEsami(){
		String ret		= "";
		String retSql 	= "DESCR";
		try
		{
			ResultSet rs = super.sff.executeQuery("refertazione.xml","consulenze.getDescrTabEsaConcat",new String[]{
					idenTes			});

			if(rs.next())
			{
				ret +="<li class='esami'>" + chkNull(rs.getString(retSql))+"</li>";
				log.info("Descrizione Esami"+ret);
			}

		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			log.error("getDescrizioneEsami() - Exception:"+ex.getMessage());
		}
		finally
		{
			super.sff.close();
		}
		return ret;
	}


}

