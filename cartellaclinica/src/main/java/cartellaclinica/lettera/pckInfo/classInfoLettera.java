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

import generatoreEngine.components.html.htmlTable;
import generatoreEngine.components.html.htmlTd;
import generatoreEngine.components.html.htmlTh;
import generatoreEngine.components.html.htmlTr;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;
import imago_jack.imago_function.db.functionDB;

import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class classInfoLettera {
	public String label;
	private String id;
	private String processClass=null;
	private String sql=null;
	private String orientamento;

	private functionDB fDB;
	private HttpServletRequest myReq;
	private HttpSession mySess;
	
	protected final ElcoLoggerInterface log=new ElcoLoggerImpl(this.getClass());

	public classInfoLettera(HttpServletRequest in_req,HttpSession in_sess,functionDB db,String lbl,String cls){
		this.myReq = in_req;
		this.mySess = in_sess;
		this.fDB = db;
		this.processClass = cls;
		String lblSplit[] = lbl.split("#");
		this.label = lblSplit[0];
		this.id = lblSplit[lblSplit.length-1];
	}
	public classInfoLettera(functionDB db,String lbl,String query,String orient){
		this.sql=query;
		this.orientamento=orient;
		this.fDB = db;
		String lblSplit[] = lbl.split("#");
		this.label = lblSplit[0];
		this.id = lblSplit[lblSplit.length-1];
	}

	public String toHTML(boolean show) throws Exception {
		String resp = "";

		if (show)
			resp="<div id =" + this.id + " class=tabShow>\n";
		else
			resp="<div id =" + this.id + " class=tabHide>\n";

		if (this.processClass!=null && !this.processClass.equals(""))
			resp+= getDivFromClass(this.processClass);

		if (this.sql!=null && !this.sql.equals(""))
			resp+= getDatiFromSql();

		resp+="</div>\n";
		return resp;
	}

	private String getDivFromClass(String cls) throws Exception {


		Class myClass = Class.forName(cls);
		ILetteraInfo myInt = null;
		myInt = (ILetteraInfo) myClass.newInstance();

		myInt.setRequest(this.myReq,this.mySess,this.fDB);

		String resp=myInt.getHtml();
		return resp;
	}

	private String getDatiFromSql()  {

		String resp="<div class=dataContainer>\n";

		//       ResultSet rs= fDB.openRs(this.sql);
		
		PreparedStatement ps;
		ResultSet rs = null;
		try {
			ps = fDB.getConnectWeb().prepareStatement(this.sql);
			rs= ps.executeQuery();
			if(this.orientamento.equals("ORIZZONTALE"))
				resp += getTableFromRs(rs);
			else if (this.orientamento.equals("VERTICALE"))
				resp += getTableFromRecord(rs);
			else if (this.orientamento.equals("VERTICALE_TITLE"))
				resp += getTableFromRecord(rs,"TITLE");
			else
				resp += getTableFromRecordFlow(rs);

			
		} catch (SqlQueryException e) {
			// TODO Auto-generated catch block
			log.error("Errore nella generazione delle tab con intestazione "+this.label+" di info: "+e.getMessage());
			resp += "<div class=\"divError\">Procedura di recupero dati "+this.label+" nella lettera di dimissione in errore: prego contattare l'assistenza per notificare il problema</div>";
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error("Errore nella generazione delle tab con intestazione "+this.label+" di info: "+e.getMessage());
			resp += "<div class=\"divError\">Procedura di recupero dati "+this.label+" nella lettera di dimissione in errore: prego contattare l'assistenza per notificare il problema</div>";
		} finally{
			try {
				fDB.close(rs);
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		//rs.close();
		return resp + "</div>\n";
	}

	private String getTableFromRecord(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd=rs.getMetaData();

		String resp ="";

		String spanHeader;
		String spanDetail;
		if(rs.next()){
			for(int i=1;i<=rsmd.getColumnCount();i++){
				spanHeader = "<span class=header onselectstart=\"abilitaSelezione();\">"+rsmd.getColumnLabel(i)+"</span>\n";
				spanDetail = "<span class=detail onselectstart=\"abilitaSelezione();\">"+chkNull(rs.getString(rsmd.getColumnLabel(i)))+"</span>\n";

				resp+= "<div class=row>"+ spanHeader + spanDetail + "</div>\n";
			}

		}else{
			resp+= "<div class=row>Nessun dato presente</div>\n";
		}


		return resp;
	}

    private String getTableFromRecord(ResultSet rs, String campoTitle) throws SQLException {
        ResultSetMetaData rsmd = rs.getMetaData();

        String resp = "";

        String spanHeader;
        String spanDetail;
        String table = "<table>";
        boolean resultSetAperto = true;
        if (resultSetAperto && rs.isBeforeFirst()) {
            resultSetAperto = false;
            while (rs.next()) {
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    if (chkNull(rs.getString(rsmd.getColumnLabel(i))).equalsIgnoreCase(campoTitle))    
                    {
                        spanHeader = "<th colspan=\"2\" class=header_title onselectstart=\"abilitaSelezione();\">" + rsmd.getColumnLabel(i) + "</th>\n";
                        table += "<tr>" + spanHeader + "</tr>";
                    }
                    else if (rsmd.getColumnLabel(i).equalsIgnoreCase(campoTitle)){
                        spanHeader = "<th colspan=\"2\" class=header_title onselectstart=\"abilitaSelezione();\">" + chkNull(rs.getString(rsmd.getColumnLabel(i))) + "</th>\n";
                        table += "<tr>" + spanHeader + "</tr>";                        
                    }
                    else if (!rsmd.getColumnLabel(i).equalsIgnoreCase("IDEN_VISITA") && !rsmd.getColumnLabel(i).equalsIgnoreCase(campoTitle)) {
                        if (!(chkNull(rs.getString(rsmd.getColumnLabel(i)))).trim().equalsIgnoreCase("")) {
                            spanHeader = "<th class=header onselectstart=\"abilitaSelezione();\">" + rsmd.getColumnLabel(i) + "</td>\n";
                            spanDetail = "<td class=detail onselectstart=\"abilitaSelezione();\">" + chkNull(rs.getString(rsmd.getColumnLabel(i))).trim() + "</td>\n";
                            table += "<tr class=row>" + spanHeader + spanDetail + "</tr>\n";
                        }
                    }
                }
            }
        }else{
            table+= "<tr><th class=row>Nessun dato presente</th></tr>\n";
        }

        table += "</table>";
        return table;
    }

	private String getTableFromRs(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd=rs.getMetaData();

		String resp ="";

		resp+= "<table>\n<tr>\n";

		for(int i=1;i<=rsmd.getColumnCount();i++)
			resp += "<th onselectstart=\"event.cancelBubble=true;\">"+rsmd.getColumnLabel(i)+"</th>\n";


		resp+="</tr>\n";

		while(rs.next()){
			resp+="<tr>\n";
			for(int i=1;i<=rsmd.getColumnCount();i++)
				resp += "<td onselectstart=\"event.cancelBubble=true;\">"+chkNull(rs.getString(rsmd.getColumnLabel(i)))+"</td>\n";

			resp+="</tr>\n";
		}

		resp+="</table>\n";

		return resp;
	}

	private String getTableFromRecordFlow(ResultSet rs) throws SQLException {
		ResultSetMetaData rsmd=rs.getMetaData();
		ResultSetMetaData rsmd_tmp=null;
		ResultSet rst=null;

		String resp = "";
		String spanHeader;
		String spanDetail;
		String [] strTable= null;

		htmlTh tabTh = new htmlTh();
		htmlTr tabTr =null;

		if(rs.next()){
			for(int i=1;i<=rsmd.getColumnCount();i++){
				if (rs.getObject(rsmd.getColumnLabel(i)) instanceof java.sql.ResultSet) {

					rst = (ResultSet)rs.getObject(rsmd.getColumnLabel(i));

					iHtmlTagBase table = new htmlTable();
					table.addAttribute("id", "tableInfoFromRs");

					rsmd_tmp = rst.getMetaData();

					tabTh.setTagValue(rsmd.getColumnLabel(i)).addAttribute("class", "header_title_info").addAttribute("colspan",Integer.toString(rsmd_tmp.getColumnCount()));
					while(rst.next()){

						tabTr = new htmlTr();
						tabTr.addAttribute("onselectstart","abilitaSelezione();").addAttribute("class","detail");

						for (int x=1;x<=rsmd_tmp.getColumnCount();x++){
							if (rst.getObject(rsmd_tmp.getColumnLabel(x)) instanceof java.sql.Array)
							{
								java.sql.Array test = (Array) rst.getObject(rsmd_tmp.getColumnLabel(x));
								strTable = (String[]) test.getArray();

								for( int j=0;j<=strTable.length-1;j++){
									tabTr.appendChild(new htmlTd().setTagValue(chkNull(strTable[j])));
								}
							}else{
								tabTr.appendChild(new htmlTd().setTagValue(rst.getString(rsmd_tmp.getColumnLabel(x))));			
							}
						}
						table.appendChild(tabTr);
					}
					if (tabTh.getAttribute("colspan").getValue().equalsIgnoreCase("1")){
						tabTh.removeAttribute("colspan");
						tabTh.addAttribute("colspan",Integer.toString(strTable.length));							
					}

					resp += table.appendTagValue(tabTh.generateTagHtml()).generateTagHtml();

				}else{
					spanHeader = "<span class=header_title onselectstart=\"abilitaSelezione();\">"+rsmd.getColumnLabel(i)+"</span>\n";
					spanDetail = "<span class=detail_title onselectstart=\"abilitaSelezione();\">"+chkNull(rs.getString(rsmd.getColumnLabel(i)))+"</span>\n";

					resp+= "<div style=\"clear:both\" class=rowHead>"+ spanHeader + "</div>\n";
					resp+= "<div style=\"clear:both\" class=rowDetail>"+ spanDetail + "</div>\n";
				}
			}

		}else{
			resp+= "<div class=row>Nessun dato presente</div>\n";
		}


		return resp;
	}

	private String chkNull(String in){
		if (in==null)
			return"";
		else
			return in;
	}
}
