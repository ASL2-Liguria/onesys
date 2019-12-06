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
package cartellaclinica.lettera.pckSezioni;

import generic.statements.StatementFromFile;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import oracle.jdbc.OraclePreparedStatement;

public class classSezioneLettera {

	public String label;
	private int vIdenVisita;
	private String vFunzione;
	private String vRicovero;
	private functionDB fDB;

	public ArrayList<classTextAreaLettera> lstTxtArea = new ArrayList<classTextAreaLettera>();

	public classSezioneLettera(String lbl, functionDB db,int pIdenVisita, String ricovero,String funzione){
		this.label = lbl;
		this.vIdenVisita = pIdenVisita;
		this.vRicovero = ricovero;
		this.fDB = db;
		this.vFunzione = funzione;
	}

	public classSezioneLettera(String lbl,functionDB db,String idenPadre,String reparto,String funzione, int pIdenVisita, String ricovero) throws SqlQueryException, SQLException {

		this.label = lbl;
		this.vIdenVisita = pIdenVisita;
		this.vRicovero = ricovero;
		this.fDB = db;
		this.vFunzione = funzione;
		OraclePreparedStatement psQuery;
		ResultSet rsQuery;
		String vContenuto="";

		String sql = "Select GRUPPO,LABEL,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA='letteraDimissioniSezioni' and CODICE_REPARTO=? and FUNZIONE=?  and IDEN_PADRE=? and ATTIVO='S' order by ORDINAMENTO";
		PreparedStatement ps = fDB.getConnectWeb().prepareCall(sql);
		ps.setString(1,reparto);
		ps.setString(2,funzione);
		ps.setInt(3,Integer.valueOf(idenPadre));

		ResultSet rs = ps.executeQuery();
		while(rs.next()){
                    vContenuto="";
			if(rs.getString("QUERY")!=null) {
				psQuery=(OraclePreparedStatement) fDB.getConnectData().prepareCall(rs.getString("QUERY"));
				try {
					psQuery.setIntAtName("idenVisita",this.vIdenVisita);
				}catch(Exception e) {

				}
				rsQuery=psQuery.executeQuery();
				if(rsQuery.next()) {
					vContenuto = rsQuery.getString(1);	
				}
			}
			lstTxtArea.add(new classTextAreaLettera(rs.getString("GRUPPO"),rs.getString("LABEL"),rs.getString("RIFERIMENTI"),vContenuto));

		}
		fDB.close(rs);

	}

	public classSezioneLettera(String procedura,String lbl,functionDB fDB,String idenPadre,String reparto,String funzione, int pIdenVisita) throws SqlQueryException, SQLException {

		this.vIdenVisita = pIdenVisita;
		this.label = lbl;
		this.vFunzione=funzione;
		OraclePreparedStatement psQuery;
		ResultSet rsQuery;
		String vContenuto="";

		String sql = "Select GRUPPO,LABEL,QUERY,RIFERIMENTI from CONFIG_MENU_REPARTO where PROCEDURA=? and CODICE_REPARTO=? and FUNZIONE=?  and IDEN_PADRE=? and ATTIVO='S' order by ORDINAMENTO";
		PreparedStatement ps = fDB.getConnectWeb().prepareCall(sql);
		ps.setString(1,procedura);
		ps.setString(2,reparto);
		ps.setString(3,funzione);
		ps.setInt(4,Integer.valueOf(idenPadre));

		ResultSet rs = ps.executeQuery();
		while(rs.next()){
                        vContenuto="";
			if(rs.getString("QUERY")!=null) {
				psQuery=(OraclePreparedStatement) fDB.getConnectData().prepareCall(rs.getString("QUERY"));
				try {
					psQuery.setIntAtName("idenVisita",this.vIdenVisita);
				}catch(Exception e) {

				}
				rsQuery=psQuery.executeQuery();
				if(rsQuery.next()) {
					vContenuto = rsQuery.getString(1);	
				}
			}
			lstTxtArea.add(new classTextAreaLettera(rs.getString("GRUPPO"),rs.getString("LABEL"),rs.getString("RIFERIMENTI"),vContenuto));

		}
		fDB.close(rs);

	}

	public String toHTML(boolean show){
		String resp;
		if(show)
			resp = "<div class=tabShow>";
		else
			resp = "<div class=tabHide>";
		if (!this.vFunzione.equalsIgnoreCase("CONSULENZE_REFERTAZIONE"))
		{
			resp += loadDatiRicovero();
		}

		
		for (int i=0;i<lstTxtArea.size();i++)
			resp+=((classTextAreaLettera) lstTxtArea.get(i)).toHTML(this.label);

		resp+=       "</div>";

		return resp;
	}


	/*public String toHTML(boolean show,String temp){
		String resp;

		if(show)
			resp = "<div class=tabShow>";
		else
			resp = "<div class=tabHide>";
		if (!this.vFunzione.equalsIgnoreCase("CONSULENZE_REFERTAZIONE"))
		{
			resp += "<script> $(document).ready(function () { $('#txtRicDal').html(parent.$('#lblDataInizio').html() + ' ');});</script>";
			resp += "<script> $(document).ready(function () { $('#txtRicAl').html(parent.$('#lblDataFine').html());});</script>";
		}
		//        resp += "<script>$('#txtRicAl').datepick({showOnFocus: false, showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'});</script>";

		for (int i=0;i<lstTxtArea.size();i++)
			resp+=((classTextAreaLettera) lstTxtArea.get(i)).toHTML(this.label);

		resp+=       "</div>";

		return resp;
	}*/


	public void addTxtArea(String id,String lbl,String rows,String value){
		lstTxtArea.add(new classTextAreaLettera(id,lbl,"rows="+rows,value));
	}

	private String loadDatiRicovero() {

		StatementFromFile stf 		= null;
		ResultSet rs				= null;
		ResultSet rsPs				= null;
        String datiRicovero 		= "<label>Periodo di ricovero: </label>";
		String dataFineRicovero		= "";
		String dataFineRicoveroAdt	= "";
		String ricoveroPs			= "";
		String allegaDatiStr 		= "N##";
		String out					= "";
		
		try {
			stf = new StatementFromFile(fDB.hSessione); 
            /*Recupero info del ps associate al ricovero*/
            rsPs = stf.executeQuery("lettere.xml", "infoRicoveroPS", new String[] {Integer.toString(vIdenVisita)});
			while (rsPs.next()) {
                ricoveroPs="<label>Ricoverato " + rsPs.getString("DEA_DATA_INGRESSO").substring(6,8)+"/" + rsPs.getString("DEA_DATA_INGRESSO").substring(4,6)+"/"+rsPs.getString("DEA_DATA_INGRESSO").substring(0,4)+" dal PRONTO SOCCORSO</label><br/>";					
			}
            
            /*Recupero info del ricovero e dei vari trasferimenti*/
            rs = stf.executeQuery("lettere.xml", "infoRicovero", new String[] {Integer.toString(vIdenVisita)});
			while (rs.next()) {
                datiRicovero += "<br/><label> - dal " + formatData(rs.getString("DATAIN"));
                datiRicovero += rs.getString("DATAOUT")!= null ? " al " + formatData(rs.getString("DATAOUT")) : "";
                datiRicovero += " in " + rs.getString("REP") + "</label>";  

                if(rs.getString("DATAOUT")!=null)
                    dataFineRicoveroAdt=rs.getString("DATAOUT");
                else
                    dataFineRicoveroAdt="";	
			}

			datiRicovero +="<input name='dataFineRicoveroAdt' id='dataFineRicoveroAdt' value='"+dataFineRicoveroAdt+"'  type='hidden'>";


		}  catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
                rsPs.close();
				rs.close();
				stf.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		//VALORIZZO LA DATA DEL RICOVERO
		try {

			stf = new StatementFromFile(fDB.hSessione);
			String tmpFunzione = fDB.cParam.getParam("funzione").trim();
			rs = stf.executeQuery("lettere.xml", "dataFineRicovero", new String[] {Integer.toString(this.vIdenVisita),tmpFunzione});

			if (rs.next()) {
				if (rs.getString("DATA_FINE_RICOVERO")!=null)	
					dataFineRicovero=rs.getString("DATA_FINE_RICOVERO");	
			}
		}  catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stf.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		//INPUT DATI STRUTTURATI ALLEGATI
		try {

			stf = new StatementFromFile(fDB.hSessione); 
			rs = stf.executeQuery("lettere.xml", "allegaDatiStrutturati", new String[] {Integer.toString(this.vIdenVisita)});

			if (rs.next()) {
				if (rs.getString("ALLEGA_DATI_STRUTTURATI")!= null)	
					allegaDatiStr	= rs.getString("ALLEGA_DATI_STRUTTURATI");
			}
		}  catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				rs.close();
				stf.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		out=ricoveroPs+datiRicovero;
                
                //INPUT MEDICO PEDIATRA
                boolean infoMedPed = false;
                try {
                    stf = new StatementFromFile(fDB.hSessione);
                    rs = stf.executeQuery("lettere.xml", "getRicovero", new String[] {Integer.toString(this.vIdenVisita)});
                    
                    if (rs.next()) {
                        infoMedPed = "NIDO_SV".equals(rs.getString("COD_CDC")) || "PEDI_SV".equals(rs.getString("COD_CDC")) ? true : false;
                    }
                } catch(Exception e) {
                    e.printStackTrace();
                } finally {
                    try {
                        rs.close();
                        stf.close();
                    } catch(SQLException e) {
                        e.printStackTrace();
                    }
                }
                
                String scanDBjs = "<script src='std/jscript/engine/scandb.js'></script>";
                String medPed = "";
                
                if (infoMedPed) {
                    // Controllo se è già stato salvato:
                    // - se si carico i valori
                    try {
                        stf = new StatementFromFile(fDB.hSessione);
                        rs = stf.executeQuery("lettere.xml", "getMedicoPediatraSaved", new String[] {Integer.toString(this.vIdenVisita)});

                        if (rs.next()) {
                            String descrMedPed = rs.getString("TXT_MED_PED") != null ? rs.getString("TXT_MED_PED") : "";
                            String idenMedPed = rs.getString("H_MED_PED") != null ? rs.getString("H_MED_PED") : "";
                            medPed += "<LABEL onclick='javascript:launch_scandb_link(this);' id=lblMedPed name='lblMedPed' SCANDB_PROC='TAB_MED_PED' SCANDB_RIC='txtMedPed'>Pediatra di riferimento</LABEL><INPUT id=txtMedPed style='WIDTH: 80%' name=txtMedPed STATO_CAMPO='E' value='"+descrMedPed+"'></INPUT><INPUT id=hMedPed type=hidden name=hMedPed STATO_CAMPO='E' value='"+idenMedPed+"'></INPUT>";
                        }
                    } catch(Exception e) {
                        e.printStackTrace();
                    } finally {
                        try {
                            rs.close();
                            stf.close();
                        } catch(SQLException e) {
                            e.printStackTrace();
                        }
                    }
                    // - altrimenti recupero da anag il medico di base (se presente)
                    if (medPed == "") {
                        try {
                            stf = new StatementFromFile(fDB.hSessione);
                            rs = stf.executeQuery("lettere.xml", "getMedicoPediatraLoaded", new String[] {Integer.toString(this.vIdenVisita)});

                            if (rs.next()) {
                                String descrMedPed = rs.getString("DESCR") != null ? rs.getString("DESCR") : "";
                                String idenMedPed = rs.getString("IDEN") != null ? rs.getString("IDEN") : "";
                                medPed += "<LABEL onclick='javascript:launch_scandb_link(this);' id=lblMedPed name='lblMedPed' SCANDB_PROC='TAB_MED_PED' SCANDB_RIC='txtMedPed'>Pediatra di riferimento</LABEL><INPUT id=txtMedPed style='WIDTH: 80%' name=txtMedPed STATO_CAMPO='E' value='"+descrMedPed+"'></INPUT><INPUT id=hMedPed type=hidden name=hMedPed STATO_CAMPO='E' value='"+idenMedPed+"'></INPUT>";
                            } else {
                                medPed += "<LABEL onclick='javascript:launch_scandb_link(this);' id=lblMedPed name='lblMedPed' SCANDB_PROC='TAB_MED_PED' SCANDB_RIC='txtMedPed'>Pediatra di riferimento</LABEL><INPUT id=txtMedPed style='WIDTH: 80%' name=txtMedPed STATO_CAMPO='E'></INPUT><INPUT id=hMedPed type=hidden name=hMedPed STATO_CAMPO='E'></INPUT>";
                            }
                        } catch(Exception e) {
                            e.printStackTrace();
                        } finally {
                            try {
                                rs.close();
                                stf.close();
                            } catch(SQLException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }
                
		out+="<br/><DIV id='divDataFineRicovero'><label>Data fine ricovero: </label><input id=txtFineRicovero name=txtFineRicovero value='" + dataFineRicovero + "'  maxLength=10 size=10></input></DIV> ";
                if (infoMedPed) {out+="<br/><DIV id='divPedRif'>" + scanDBjs + medPed + "</DIV>";}
                out += "<script> jQuery(document).ready(function(){$('#txtFineRicovero').datepick({onClose: function(){jQuery(this).focus();},showOnFocus: false, showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'});$('input[name=\"allegaDatiStr\"]').val('" + allegaDatiStr.trim() + "');}); </script>";
		
                return out;
	}

	private String formatData(String data) {
		return data.substring(6, 8) + "/" + data.substring(4, 6) + "/" + data.substring(0, 4);
	}
}
