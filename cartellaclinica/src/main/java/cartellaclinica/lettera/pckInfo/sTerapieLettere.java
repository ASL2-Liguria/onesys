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

import generic.servletEngine;
import generic.statements.StatementFromFile;
import imago.http.classColDataTable;
import imago.http.classInputHtmlObject;
import imago.http.classRowDataTable;
import imago.http.classTableHtmlObject;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class sTerapieLettere extends servletEngine{

	private HttpServletRequest request = null; 

	public sTerapieLettere(ServletContext pCont,HttpServletRequest pReq){
		super(pCont,pReq);
		this.request = pReq;
	}


	public String getBody(){

		String body=""; // "<body>";
		try{
			classTableHtmlObject cTable = null;
			classRowDataTable cRow = null;
			classColDataTable cCol = null;
			int maxLettereDaVisualizzare;
			try {
				StatementFromFile sff = new StatementFromFile(this.hSessione);
				String[] valore = sff.executeStatement("configurazioni.xml","getValueCdc",new String[]{request.getParameter("reparto"),"LETTERE_PRECEDENTI"},1);
				maxLettereDaVisualizzare = Integer.parseInt(valore[2]);
				sff.close();
			} catch (Exception e) {
				log.info("Errore o assenza parametro di configurazione LETTERE_PRECEDENTI");
				maxLettereDaVisualizzare = 50;
			} 
			
			StatementFromFile sff = null;
			ResultSet rs = null;
			
			try {
/*				String sql = "Select /*+first_rows(20)* IDEN_LETTERA,STATO_LETTERA,to_char(DATA_INSERIMENTO,'dd/mm/yyyy hh24:mi') data_inserimento," +
						"PRIMO_CICLO,FARMACO,IDEN_FARMACO,COD_DEC,IDEN_SOSTANZA,IDEN_TIPO_TERAPIA,DOSE,UDM,ORARI,DURATA,NUM_SCATOLE,CATEGORIA" +
						" from radsql.VIEW_WK_LETTERA_FARMACI w where iden_visita in " +
						"(select iden from nosologici_paziente where iden_anag=? and cod_cdc=?) order by w.data_inserimento desc,farmaco";
				PreparedStatement ps = fDB.getConnectData().prepareCall(sql);
				ps.setInt(1,Integer.parseInt(request.getParameter("idenAnag")));
				ps.setString(2,request.getParameter("reparto"));
				ResultSet rs = ps.executeQuery();*/
				
				sff = new StatementFromFile(this.hSessione);
    			sff.executeStatement("terapie.xml", "set_dati_farmacie", new String[] {this.cParam.getParam("reparto").trim()},0);
    			sff.close();
    			sff = new StatementFromFile(this.hSessione);
				rs = sff.executeQuery("terapie.xml", "domiciliari.precedenti", new String[]{request.getParameter("idenAnag"),request.getParameter("reparto")});

				cTable = new classTableHtmlObject("60%");
				cTable.addAttribute("class","classDataTable");
				cTable.addAttribute("id","tabWkTerapieLettera");
				cRow = new classRowDataTable();
				cCol= new classColDataTable("th","5%","1° Ciclo");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","30%","Farmaco Terapia Domiciliare");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","25%","Posologia");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","20%","Durata");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","5%","Scatole");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","10%","Categoria");
				cRow.addCol(cCol);
				cCol= new classColDataTable("th","5%","Seleziona");
				cRow.addCol(cCol);
				cTable.appendSome(cRow.toString());
				int idenLetteraPrec = -1;
				int letteraCounter = 0;
				while (rs.next())
				{
					int idenLetteraCur = rs.getInt("IDEN_LETTERA");
					if (idenLetteraPrec!=idenLetteraCur) {
						if (letteraCounter==maxLettereDaVisualizzare) {
							break; 
						}
						letteraCounter++;
						cRow = new classRowDataTable();
						cRow.addAttribute("class", "gruppoTerapia");
						String firmata = rs.getString("STATO_LETTERA").matches("F")?" (Firmata digitalmente)":"";
						cCol = new classColDataTable("","","Lettera del "+rs.getString("DATA_INSERIMENTO") + firmata);
						cCol.addAttribute("colspan","6");
						cRow.addCol(cCol);
						classInputHtmlObject check = new classInputHtmlObject("checkbox","", "");
						check.addEvent("onClick","javascript:selectLettera(this);");
						cCol= new classColDataTable("","",check);
						cCol.addAttribute("iden_lettera", Integer.toString(idenLetteraCur));
						//    					cCol.addAttribute("class","canc");
						cRow.addCol(cCol);
						cTable.appendSome(cRow.toString());
						idenLetteraPrec = idenLetteraCur;
					}

					cRow = new classRowDataTable();
					cRow.addAttribute("iden_lettera", Integer.toString(idenLetteraCur));

					cCol= new classColDataTable("","","");
					/*if (rs.getString("PRIMO_CICLO").matches("S") || rs.getString("PRIMO_CICLO").matches("1")) {
						cCol.addAttribute("class","Spunta");
						cCol.addAttribute("checked","S");
					} else if (rs.getString("PRIMO_CICLO").matches("N")) {
						cCol.addAttribute("class","Spunta");
						cCol.addAttribute("checked","N");
					} else { 
						cCol.addAttribute("class","NoSpunta");
					}*/
                    if (rs.getString("PRIMO_CICLO") == null) {
                        cCol.addAttribute("class", "NoSpunta");
                        cCol.addEvent("onClick", "javascript:apriAltriFarmaci();");
                    } else if (rs.getString("PRIMO_CICLO").matches("S") || rs.getString("PRIMO_CICLO").matches("1")) {
                        cCol.addAttribute("class", "Spunta");
                        cCol.addAttribute("checked", "S");
                        cCol.addEvent("onClick", "javascript:spunta(this);");
                    } else if (rs.getString("PRIMO_CICLO").matches("N") || rs.getString("PRIMO_CICLO").matches("0")) {
                        cCol.addAttribute("class", "Spunta");
                        cCol.addAttribute("checked", "N");
                        cCol.addEvent("onClick", "javascript:spunta(this);");
                    }
					cRow.addCol(cCol);
					cCol= new classColDataTable("","",rs.getString("FARMACO"));
					cCol.addAttribute("iden_far",rs.getString("IDEN_FARMACO"));
					cCol.addAttribute("cod_dec",rs.getString("COD_DEC"));
					cCol.addAttribute("id_sos",rs.getString("IDEN_SOSTANZA")==null?"":rs.getString("IDEN_SOSTANZA"));
					cCol.addAttribute("tipo_ter",rs.getString("IDEN_TIPO_TERAPIA"));

					String dose = rs.getString("DOSE")!=null ? rs.getString("DOSE"):"";
					if (rs.getString("UDM")!=null) {
						dose += " " + rs.getString("UDM");
					}
					if (rs.getString("ORARI")!=null) {
						dose += " (" + rs.getString("ORARI") + ")";
					}
					cRow.addCol(cCol);
					classInputHtmlObject cDose = new classInputHtmlObject("","", dose);
					cDose.addAttribute("style","width:95%");
					cCol= new classColDataTable("","",cDose);
					cCol.addAttribute("align", "center");
					cRow.addCol(cCol);
					String durata = rs.getString("DURATA")!=null?rs.getString("DURATA"):"";
					classInputHtmlObject cDurata = new classInputHtmlObject("","",durata);
					cDurata.addAttribute("style","width:95%");
					cDurata.addAttribute("class", "autocomplete");
					cCol= new classColDataTable("","",cDurata);
					cCol.addAttribute("align", "center");
					cRow.addCol(cCol);
					String scatole = rs.getString("NUM_SCATOLE")!=null?rs.getString("NUM_SCATOLE"):"";
					classInputHtmlObject cInput = new classInputHtmlObject("","",scatole);
					/*if (rs.getString("PRIMO_CICLO").matches("S") || rs.getString("PRIMO_CICLO").matches("1"))
						cInput.addAttribute("style","width:20px");
					else 
						cInput.addAttribute("style","width:20px; visibility:hidden");*/
                    if (rs.getString("PRIMO_CICLO") == null) {
                        cInput.addAttribute("style", "width:20px; visibility:hidden");
                    } else {
                        if (rs.getString("PRIMO_CICLO").matches("S") || rs.getString("PRIMO_CICLO").matches("1")) {
                            cInput.addAttribute("style", "width:20px");
                        } else {
                            cInput.addAttribute("style", "width:20px; visibility:hidden");
                        }
                    }                    
					cInput.addAttribute("maxlength","2");
					cInput.addEvent("onBlur","javascript:isNumber(this);");
					cCol= new classColDataTable("","", cInput);
					cCol.addAttribute("align", "center");
					cRow.addCol(cCol);
					cCol= new classColDataTable("","",rs.getString("CATEGORIA"));
					cCol.addAttribute("align", "center");
					cCol.addAttribute("class", "categoria");
					cRow.addCol(cCol);
					classInputHtmlObject check = new classInputHtmlObject("checkbox","", "");
					check.addEvent("onClick","javascript:selectRow(this);");
					cCol= new classColDataTable("","",check);
					cRow.addCol(cCol);
					cTable.appendSome(cRow.toString());
				}
//				fDB.close(rs);
				body += "<div id='tableContainer'>" + cTable.toString() + "</div>";

			}
			catch (SqlQueryException ex) {
				body = "cWkTerapie - getHtml(): " + ex.getMessage();
			}
			catch (SQLException ex) {
				body = "cWkTerapie - getHtml(): " + ex.getMessage();
			} finally {
				try {rs.close();} catch (Exception e1) {}
				try {sff.close();} catch (Exception e2) {}
			}
//			body += "</div><br/>\n";
			body += "<span id=btnReload class=btn onclick='sostituisciTerapie();' >Sostituisci nella lettera</span>";
			body += "<span id=btnGeneraTerapie class=btn onclick='aggiungiTerapie();' >Aggiungi nella lettera</span>";
			//            body+= "</body>\n";

		}catch(Exception e){
			//            body="<body>"+e.getMessage()+"</body>";
			body=e.getMessage();
		}
		return body;

	}


	@Override
	public String getBottomScript() {
		return "";
	}

	@Override
	protected String getTitle() {
		return "";
	}
}
