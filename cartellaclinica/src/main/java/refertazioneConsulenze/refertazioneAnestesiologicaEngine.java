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

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class refertazioneAnestesiologicaEngine extends srvRefertazioneConsulenze{


	public refertazioneAnestesiologicaEngine(ServletContext cont, HttpServletRequest req) throws Exception
	{
		super(cont, req);
        super.attributeUnLoad = "unLock()";
		setProcedure();
	}

	private void setProcedure()
	{
        setProcSezioni("refertaAnestesiologicoSezione");
        setProcInfo("refertaAnestesiologicoInfo");
        /*Aggiungere controllo in entrambe le classi, di refertazione consulenza e non per la gestione dei bottoni dalla classe che estende*/
        /* Viene usata gli stessi bottoni della refertazione delle consulenze
        setProcButton("refertaAnestesiologicoBottomButton");
        */
        setProcFirma("reportFirma");
        setTypeFirma("typeFirma");
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

*/


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
			ResultSet rs = super.sff.executeQuery("refertazione.xml","anestesiologica.getConfigFromViewSezioni",new String[]{
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
					lstSezioni.get(idx).readHtml(rs.getString("TESTO_HTML"),rs.getString("ID_ELEMENTO"),chkNull(rs.getString("SEZIONE")),rs.getString("ORDINAMENTO"));
				else
					lstSezioni.get(idx).addTxtArea(rs.getString("ID_ELEMENTO"),rs.getString("LABELAREA"),rs.getString("NUMERORIGHE"),rs.getString("TESTO_HTML"),rs.getString("ORDINAMENTO"));
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
				ResultSet rs = super.sff.executeQuery("refertazione.xml","getVersioneRefertazione",new String[]{
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
		super.formFirma.appendSome(new classInputHtmlObject("hidden","idenTes",super.idenTes));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","idenReferto",getIdenVersione()));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","validaFirma","N"));
		super.formFirma.appendSome(new classInputHtmlObject("hidden","allegaDatiStr","N##"));
        return super.getForm();
	}


	@Override
	protected String getIntestazione(){return "";}

    @Override
    protected boolean loadConfigurazioneFromDb(String pIdenVisita, String pFunzione) {
		Integer idx=null;
        String lastIdenRef="";
		try
		{
			ResultSet rs = super.sff.executeQuery("refertazione.xml","valutazionePreOperatoria.anestesiologica.getLastIdenRef",new String[]{
					pIdenVisita,pFunzione
			});

			while (rs.next())
			{
                lastIdenRef = chkNull(rs.getString("IDEN"));
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

        if ("".equalsIgnoreCase(lastIdenRef)){
            return false;
        }else{
            try
            {
                ResultSet rs = super.sff.executeQuery("refertazione.xml","anestesiologica.getConfigFromViewSezioni",new String[]{
                        lastIdenRef
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
                        lstSezioni.get(idx).readHtml(rs.getString("TESTO_HTML"),rs.getString("ID_ELEMENTO"),chkNull(rs.getString("SEZIONE")),rs.getString("ORDINAMENTO"));
                    else
                        lstSezioni.get(idx).addTxtArea(rs.getString("ID_ELEMENTO"),rs.getString("LABELAREA"),rs.getString("NUMERORIGHE"),rs.getString("TESTO_HTML"),rs.getString("ORDINAMENTO"));
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
            return true;
        }

    }

}

