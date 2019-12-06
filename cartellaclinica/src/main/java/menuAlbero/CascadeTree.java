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
package menuAlbero;

import generic.statements.StatementFromFile;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imago.sql.SqlQueryException;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.directwebremoting.WebContextFactory;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author not attributable
 * @version 1.0
 */
public class CascadeTree{

    private StatementFromFile sff;
    private ElcoLoggerInterface log;
    //private String vGruppo;

    public CascadeTree() throws Exception {
        this.log=new ElcoLoggerImpl(this.getClass());
        this.sff = new StatementFromFile(WebContextFactory.get().getSession());
    }

    public String[] getBody(String pGruppo,String pAbilitaRicercaDescrizione,String pAbilitaRicercaCodice,String pIdenPadre)  {
        StringBuffer body = new StringBuffer();

        try {
            body.append("<div id=\"Gruppo_"+pGruppo+"\">");

            if(pAbilitaRicercaDescrizione.equals("S") || pAbilitaRicercaCodice.equals("S")){
                body.append("<div id=\"Search\">");

                if(pAbilitaRicercaDescrizione.equals("S")){
                    body.append("<label>Descrizione</label><input id=\"txtDescrizione\"/>");
                }

                if(pAbilitaRicercaCodice.equals("S")){
                    body.append("<label>Codice</label><input id=\"txtCodice\"/>        ");
                }

                body.append("<a id=\"btnCerca\">Cerca</a>");
                body.append("<a id=\"btnEsplora\">Esplora</a>");
                body.append("</div>");
            }

            body.append("<ul loaded=\"1\" id=\"CascadeTree\">");

            String[] RootResponse = this.getNodo(pGruppo,pIdenPadre);
            if(RootResponse[0].equals("OK"))
                body.append(RootResponse[1]);
            body.append("</ul>");

            if(pAbilitaRicercaDescrizione.equals("S") || pAbilitaRicercaCodice.equals("S")){
                body.append("<ul id=\"Result\"></ul>");
            }
            body.append("</div>");

        }catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO",ex.getMessage()};
        }

        return new String[]{"OK",body.toString()};
    }

    public String[] getNodo(String pGruppo,String pIdenPadre){

        try {
            return new String[]{"OK",this.getNodo(pGruppo,pIdenPadre,null,null)};
        } catch (Exception ex) {
            this.log.error(ex);
            return new String[]{"KO",ex.getMessage()};
        }
    }

    private String getNodo(String pGruppo,String pIdenPadre,String pRefContenuto,String pContenuto) throws SQLException, SqlQueryException, Exception {

        ResultSet rs = sff.executeQuery("Alberi.xml","queryRamo",new String[]{pGruppo,pIdenPadre});

        StringBuffer list = new StringBuffer();
        String[] Paths;

        while (rs.next()){
        	Paths = rs.getString("PATH").split("[|]");

        	list.append("<li>");

        	if (rs.getString("IMG_INFO")!=null){	
        		list.append("<img  class='divInfo'");	
               	
            		list.append(" src=\""+rs.getString("IMG_INFO")+"\"");	
            	
            	if (rs.getString("LINK_INFO")!=null){
            		list.append(" onclick=\""+rs.getString("LINK_INFO")+"\" ");	
            	}
            	list.append("/>");
        	}
        	

        	
            list.append("<a ref=\""+rs.getString("REF")+"\" iden=\""+rs.getString("IDEN")+"\" codice=\""+chkNull(rs.getString("CODICE"))+"\" path=\""+Paths[0]+"\" path_descr=\""+Paths[1]+"\">"+rs.getString("DESCRIZIONE")+"</a>");
 
            if(pRefContenuto !=  null && pRefContenuto.equals(rs.getString("REF"))){
                list.append("<ul loaded=\"1\">");
                list.append(pContenuto);
                list.append("</ul>");
            }else{
                list.append("<ul loaded=\"0\"></ul>");
            }
            
        
            
            
            list.append("</li>");
        }
        sff.close();

        return list.toString();
    }

    public String[] getNodoByPath(String pGruppo,String pPath)  {

        String[] ArRef = pPath.split("[.]");
        String list;
        try {
            list = this.getNodo(pGruppo,ArRef[ArRef.length-1],null,null);
            for (int i=ArRef.length-2;i>=0;i--){

                list = this.getNodo(pGruppo,ArRef[i], ArRef[i + 1], list);
            }
        } catch (Exception ex) {
            this.log.error(ex);
            return new String[]{"KO",ex.getMessage()};
        }

        return new String[]{"OK",list};
    }

    public String[] getNodiRicerca(String pFileName , String pStatementName, String[] pParameters) throws Exception{

        ResultSet rs = sff.executeQuery(pFileName,pStatementName,pParameters);
        StringBuffer list = new StringBuffer();
        String vPath;
        String vDescrizione;

        try {
            while (rs.next()) {
                vPath = rs.getString("PATH_PLUS_SEQUENZA").split("[|]")[0];
                vDescrizione = rs.getString("PATH_PLUS_SEQUENZA").split("[|]")[1];
                list.append("<li path=\""+vPath+"\" path_descr=\""+vDescrizione+"\">"+rs.getString("DESCRIZIONE")+"</li>");
            }
            sff.close();
        } catch (Exception ex) {
            log.error(ex);
            return new String[]{"KO",ex.getMessage()};
        }
        return new String[]{"OK",list.toString()};
    }

    private String chkNull(String in){return (in==null?"":in);}

}
