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
package cartellaclinica.gestioneTerapia.ricerca;

import generic.statements.StatementFromFile;
import generic.utility.controlStructure;
import imago.sql.SqlQueryException;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import configurazioneReparto.baseReparti;

public class filtri {

//    functionDB fDB;
    String reparto;
    String tipoTerapia;
    String statoTerapia;

    controlStructure cs=new controlStructure();
    private baseReparti bReparti;

    public filtri(baseReparti pBaseReparti, /*functionDB p_fDB,*/ String pReparto,String pTipoTerapia,String pStatoTerapia) {
//        fDB = p_fDB;
        bReparti = pBaseReparti;
        reparto = pReparto;
        tipoTerapia = pTipoTerapia;
        statoTerapia = pStatoTerapia;
    }

    public String getHtml() throws Exception {
        String tab="<table>\n";

        if (statoTerapia.matches("L") || statoTerapia.matches("R")) {
        	// nessun criterio per scelta tipo terapia
        } else {
        	 /*riga per inserimento nuova terapia*/
            tab+=getTrSomministrazione();
        }

        /*riga per la selezione del tipo di ricerca*/
        tab+=getTrRicerca();

        /*riga per criterio di ricerca*/
        /*tab+="<tr>\n";
        tab+="<th>Criterio ricerca</th>";
        tab+= "<td><input id=txtRicerca /></td>";
        tab+="</tr>\n";*/
        return tab+="</table>\n";
    }

    private String getTrSomministrazione() throws Exception {
    	String html = "<tr>\n";
    	html +="<th>Tipo somministrazione</th>";
    	html +="<td>"+getTipoFarmaco()+getConfScheda()+"</td>";
    	html +="</tr>\n";
    	return html;
    }
    public String getHtmlSomministrazione() throws Exception {
    	String tab = "<table>\n";
    	tab +=getTrSomministrazione();
    	return tab+="</table>\n";
    }
    private String getTrRicerca() throws SqlQueryException, SQLException {
    	String html = "<tr class=ricerca>\n";
    	html+="<th >Tipo ricerca</th>";
    	html+= "<td>"+getTipoRicerca()+"</td>";
    	html+="</tr>\n";
    	return html;
    }

    public String getHtmlRicerca() throws SqlQueryException, SQLException {
    	String tab = "<table>\n";
    	tab +=getTrRicerca();
    	return tab+="</table>\n";
    }

    private String getTipoFarmaco() throws Exception {
    	String html= "<span class='tipiTerapie'><select id='cmbTipoTerapia'>";
    	ResultSet rs;
    	StatementFromFile sff = null;
    	try {
    		sff= new StatementFromFile(null);
	    	rs = sff.executeQuery("terapie.xml", "filtri.getTipoFarmaco", new String[]{reparto});
	/*    	PreparedStatement ps =fDB.getConnectData().prepareCall("Select t.iden,t.descrizione from CC_TERAPIE_REPARTO r inner join  CC_TERAPIE_TYPE t on(t.iden=r.iden_terapia) where codice_reparto=? and r.attivo='S' order by r.ordine");
	    	ps.setString(1,reparto);
	    	rs= ps.executeQuery();*/
	    	html += "<option value='-1'>&nbsp;</option>";
	    	while(rs.next()){
	    		html+="<option "+cs.ifControl(tipoTerapia.equals(rs.getString("IDEN"))," selected")+" value=\""+rs.getString("IDEN")+"\" >"+rs.getString("DESCRIZIONE")+"</option>";
	    	}
    	} finally {
//    	fDB.close(rs);
    		if (sff!=null)
    			sff.close();
    	}
    	return html+="</select></span>";
    }
    /**
     * getConfScheda
     *
     * @return String
     */
    private String getConfScheda()throws Exception  {
        String html="<span class='confScheda'>";
        ResultSet rs;
    	StatementFromFile sff = null;
    	try {
    		sff= new StatementFromFile(null);
	    	rs = sff.executeQuery("terapie.xml", "filtri.getConfScheda", new String[]{reparto,statoTerapia});
/*	        PreparedStatement ps =fDB.getConnectData().prepareCall("Select * from VIEW_CC_TERAPIE_CONF_SCHEDA where codice_reparto=? and stato_terapia=? ");
	        ps.setString(1,reparto);
	        ps.setString(2,statoTerapia);
	        rs= ps.executeQuery();*/
	        while(rs.next()){
	            html+="<span class='Button' style=\"display:none;\" id=\"Scheda"+rs.getString("IDEN")+"\" tipo_terapia=\""+rs.getString("TIPO_TERAPIA")+"\" iden_confScheda=\""+rs.getString("IDEN")+"\"><label>"+rs.getString("DESCRIZIONE")+"</label></span>\n";
	        }
//	        fDB.close(rs);
    	} finally {
    		if (sff!=null)
    			sff.close();
    	}
        return html+"</span>";
    }

    private String getTipoRicerca() throws SqlQueryException, SQLException {

        String html="";
        /* ResultSet rs;
         PreparedStatement ps =fDB.getConnectWeb().prepareCall("Select * from CONFIG_MENU_REPARTO where procedura=? and codice_reparto=? and (tipo_ute=? or tipo_ute is   ) order by ordinamento");
         ps.setString(1,"terapiaTipoRicercaFarmaco");
         ps.setString(2,bReparti.getValue(reparto,"terapiaTipoRicercaFarmaco"));
         ps.setString(3,tipoUte);
         rs= ps.executeQuery();
         while(rs.next()){
             html+="<input type=radio name=radioTipoRicerca id="+rs.getString("GRUPPO")+" value="+rs.getString("ORDINE")+" onclick=\""+rs.getString("FUNZIONE")+"\" "+setChecked(rs.getString("RIFERIMENTI"))+"/><label for="+rs.getString("GRUPPO")+">"+rs.getString("LABEL")+"</label>\n";
         }
         fDB.close(rs);*/

        SAXBuilder builder;
        Document docXml;
        try{
            InputStream is = new ByteArrayInputStream((bReparti.getValue(reparto,"TERAPIA_CONFIGURAZIONE_RICERCA_FARMACI").replace("\n","").replace("\t","").replace("\r","")).getBytes());
            builder = new SAXBuilder();
            docXml = builder.build(is);

            Element elmNodoStato;
            List lst = docXml.getRootElement().getChildren("NODO_STATO");
            Iterator it = lst.iterator();

            List lstTipi,lstKey;
            Iterator itTipi,itKey;
            Element elmTipo,elmKey;

            while(it.hasNext()){
                elmNodoStato = (Element) it.next();
                if(elmNodoStato.getAttributeValue("stato").equals(statoTerapia)){
                    lstTipi = elmNodoStato.getChildren("NODO_RICERCA");
                    itTipi = lstTipi.iterator();

                    html += "<div>\n";

                    while(itTipi.hasNext()){
                        elmTipo = (Element) itTipi.next();
                        if (elmTipo.getAttributeValue("newLine") != null && elmTipo.getAttributeValue("newLine").equalsIgnoreCase("S"))
                        	html += "<br/>\n";
//                        html+= "<input type=radio name=radioTipoRicerca id="+elmTipo.getAttributeValue("codice")+" onclick=\"setRicerca(this,'"+chkNull(elmTipo.getAttributeValue("where"))+"');\"><label for="+elmTipo.getAttributeValue("codice")+" >"+elmTipo.getAttributeValue("descrizione")+"</label>";
                        html+= "<span class='Button radio' name=radioTipoRicerca id="+elmTipo.getAttributeValue("codice")+" onclick=\"setRicerca(this,'"+chkNull(elmTipo.getAttributeValue("where"))+"');\"><label>"+elmTipo.getAttributeValue("descrizione")+"</label></span>";
                    }

                    html += "</div>\n";

                    itTipi = lstTipi.iterator();

                    html += "<div id=\"divContenitoreRicerche\">\n";

                    while (itTipi.hasNext()) {
                        elmTipo = (Element) itTipi.next();
                        lstKey = elmTipo.getChildren("NODO_KEY_LEGAME");
                        itKey = lstKey.iterator();

                        html += "<div id=\"div"+elmTipo.getAttributeValue("codice")+"\" style=\"display:none;\">\n";

                        while(itKey.hasNext()){
                            elmKey = (Element) itKey.next();

//                            html += "<input type=radio name=radioKeyLegame id=" + elmKey.getAttributeValue("codice") + " onclick=\"setKeyLegame('"+elmKey.getAttributeValue("key_legame")+"','"+ chkNull(elmKey.getAttributeValue("tipo_wk")) +"','"+chkNull(elmKey.getAttributeValue("where"))+"');\"><label for=" + elmKey.getAttributeValue("codice") + " >" + elmKey.getAttributeValue("descrizione") + "</label>";
                            html += "<span class='Button radio' name=radioKeyLegame id=" + elmKey.getAttributeValue("codice") + " onclick=\"setKeyLegame('"+elmKey.getAttributeValue("key_legame")+"','"+ chkNull(elmKey.getAttributeValue("tipo_wk")) +"','"+chkNull(elmKey.getAttributeValue("where"))+"');\"><label>" + elmKey.getAttributeValue("descrizione") + "</label></span>";
                        }
                        if(elmTipo.getAttributeValue("abilitaTxt").equals("S")){
                            html +="<input id=\"txtRicerca\" onblur=\"setTxt(this.value);\" onkeyup=\"intercetta(this.value);\" />\n";
                            html += "<span id=btnCerca class=Button onclick=\"cerca();\">Cerca</span>";
                        }
                        /*if(elmTipo.getAttribute("filtroReparto")!=null && elmTipo.getAttributeValue("filtroReparto").equals("S")){
                        	html+="<select id=\"cmbReparto\" >";
                        	for (classCentroDiCosto cdc : bUtente.listaOggettiReparto) {
                        		html+="<option value='"+cdc.cod_cdc+"' "+(cdc.cod_cdc.matches(reparto)?" selected":"")+">"+cdc.descr+"</option>\n";
                        	}
                        	html+="</select>";
                        }*/

                        html += "</div>\n";
                    }

                   html += "</div>\n";



                }
            }

        }catch(Exception ex){
            String a = ex.getMessage();
        }

        return html;
    }


    private String chkNull(String in ){
        if(in==null)
            return "";
        else
            return in;
    }
}
