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
package it.elco.whale.hl7.servlet;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;
import generic.statements.StatementFromFile;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Servlet in ascolto [RICEZIONE] per il salvataggio delle richieste HL7
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 */
public class Rescuer extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private final ElcoLoggerInterface logger = new ElcoLoggerImpl(this.getClass());
    private Configuration _CFG;
    private static final String _DIR_TEMPL_HL7 = "WEB-INF/templates/freemarker/hl7";
    private static final String _FILE_TEMPL_OMG_O19 = "OMG_O19.ftl";
    private HashMap<String, encodeID> _ID_ENCODING;
    
    /**
     * Inizializza la servlet.
     * @param   theConfig
     * @throws  ServletException 
     */
    
        @Override
    public void init(ServletConfig theConfig) throws ServletException {
    	
        _CFG = new Configuration();
        _CFG.setServletContextForTemplateLoading(theConfig.getServletContext(), _DIR_TEMPL_HL7);
        _CFG.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        setDecodeID();
        
    }
    
    /**
     * Mappa le informazioni contenute nell'header.
     * @param request
     * @return
     */
    private Map<String, String> getHeadersInfo(HttpServletRequest request) {
   	 
    	Map<String, String> map = new HashMap<String, String>();
    	Enumeration<String> headerNames = request.getHeaderNames();
    	
    	while (headerNames.hasMoreElements()) {
    		String key = (String) headerNames.nextElement();
    		String value = request.getHeader(key);
    		map.put(key, value);
    	}
     
    	return map;
    	
    }
    
    /**
     * Mappa i parametri contenuti nella request.
     * @param request
     * @return
     */
    private Map<String, String> getParameter(HttpServletRequest request) {
   	 
    	Map<String, String> map = new HashMap<String, String>();
    	
    	Enumeration<String> parameterNames = request.getParameterNames();
    	
    	while (parameterNames.hasMoreElements()) {
    		String paramName = parameterNames.nextElement();
    		String[] paramValues = request.getParameterValues(paramName);
                for (String paramValue : paramValues) {
                    map.put(paramName, paramValue);
                }
    	}
    	
    	return map;
    	
    }     
    
    /**
     * Codifica colonne COD_EST_ANAG.
     */
    private enum encodeID {
    	
        ID1, ID2, ID3, ID4, ID5, ID6, ID7, ID8
        
    }
    
    /**
     * Associa il sito all'id con cui decodificare l'IDEN ANAG.
     */
    private void setDecodeID() {
    	
        _ID_ENCODING = new HashMap<String, encodeID>();
        //_ID_ENCODING.put("SAVON", encodeID.ID1);    
        //_ID_ENCODING.put("PS_SV", encodeID.ID1); 
        
    }
   
    /**
     * Gestione richieste GET/POST.
     * @param request
     * @param response
     * @throws ServletException 
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException {
    	
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
    	Map<String, String> mapParameter = getParameter(request);
                
        PrintWriter out = null;
        StatementFromFile sff = null;
        
        try {
            out = response.getWriter();

            JSONObject jsonObj = decodeCampi(request.getSession(), new JSONObject(mapParameter.get("KEY_FIELDS")));
            jsonObj = putFields(request.getSession(), jsonObj);
            Map<String, JSONObject> root = new HashMap<String, JSONObject>();            
            root.put("json", jsonObj);

            logger.info("Generazione XML richiesta");
            logger.debug(jsonObj.toString());
            
            Template t = _CFG.getTemplate(_FILE_TEMPL_OMG_O19);
            StringWriter sw = new StringWriter();
            t.process(root, sw);
            
            logger.info("Salvataggio XML richiesta");
            logger.debug(sw.toString());
            
            sff = new StatementFromFile(request.getSession());
            String[] resp = sff.executeStatement("hl7.xml", "salvaRichiesta", new String[]{sw.toString()}, 1);
            if ("KO".equalsIgnoreCase(resp[0])) {
                throw new Exception(resp[1]);
            }
            logger.info(String.format("ID richiesta inserita: %s", resp[2]));
            out.write("{\"status\":\"OK\",\"message\":\"ACCEPT\", id:"+resp[2]+"}");
            
        } catch (TemplateException e) {
        	logger.error(e);
            out.write("{\"status\":\"KO\",\"message\":\"TemplateException: "+e.getMessage()+"\"}");
        } catch (JSONException e) {
        	logger.error(e);
            out.write("{\"status\":\"KO\",\"message\":\"JSONException: "+e.getMessage()+"\"}");
        } catch (IOException e) {
        	logger.error(e);
            out.write("{\"status\":\"KO\",\"message\":\"IOException: "+e.getMessage()+"\"}");
        } catch (Exception e) {
            logger.error(e);
            out.write("{\"status\":\"KO\",\"message\":\"Exception: "+e.getMessage()+"\"}");
        } finally {   
            if(sff != null){
                sff.close();    
            }
            if(out != null){
                out.close();
            }
        }
        
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        processRequest(request, response);
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
        processRequest(request, response);
        
    }

    @Override
    public String getServletInfo() {
    	
        return "Short description";
        
    }// </editor-fold>
    
    /**
     * Decodifica l'elenco degli esami, recuperando:
     * - gli iden degli esami (se non è quello presente in TAB_ESA)
     * - le metodiche degli esami
     * - la tipologia degli esami
     * @param   session
     * @param   JSONObject
     * @return  JSONObject contenente l'elenco degli esami decodificato.
     * @throws Exception 
     */
    private JSONObject decodeElencoEsami(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding elenco esami: hl7.xml/decodeElencoEsami");
        
        StatementFromFile sff = new StatementFromFile(session);

        try {
            logger.debug(String.format("assignAuthorityMittente: \"%s\"", jsonObj.getString("assignAuthorityMittente")));
            logger.debug(String.format("elencoIdenEsami: \"%s\"", jsonObj.getString("elencoIdenEsami")));
            logger.debug(String.format("elencoLateralitaEsami: \"%s\"", jsonObj.getString("elencoLateralitaEsami")));
            
            String[] resp = sff.executeStatement("hl7.xml", "decodeElencoEsami", new String[]{jsonObj.getString("assignAuthorityMittente"), jsonObj.getString("elencoIdenEsami"), jsonObj.getString("elencoLateralitaEsami")}, 3);
            if ("KO".equalsIgnoreCase(resp[0])) {
                throw new Exception(resp[1]);
            } else {                
                jsonObj.remove("elencoIdenEsami");
                jsonObj.put("elencoIdenEsami", resp[2] == null ? JSONObject.NULL : resp[2]);
                jsonObj.put("elencoMetodicheEsami", resp[3] == null ? JSONObject.NULL : resp[3]);
                jsonObj.put("tipologiaEsami", resp[4] == null ? JSONObject.NULL : resp[4]);
            }
        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            sff.close();
        }

        return jsonObj; 
        
    }    
    
    /**
     * Decodifica il CENTRO DI COSTO del reparto destinatario.
     * @param   session
     * @param   JSONObject
     * @return  JSONObject contenente il CENTRO DI COSTO decodificato.
     * @throws Exception 
     */
    private JSONObject decodeCdcRepartoDestinatario(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding reparto destinatario: hl7.xml/decodeCdcRepartoDestinatario");
        
        StatementFromFile sff = null;
        ResultSet rs = null;

        try {
            logger.debug(String.format("repartoDestinatario: \"%s\"", jsonObj.getString("repartoDestinatario")));
            
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("hl7.xml", "decodeCdcRepartoDestinatario", new String[]{jsonObj.getString("repartoDestinatario")});
            if (rs.next()) {
                jsonObj.remove("DESTINATARIO");
                jsonObj.put("DESTINATARIO", rs.getString("cod_cdc"));
                jsonObj.remove("repartoDestinatario");
                jsonObj.put("repartoDestinatario", rs.getString("cod_cdc"));
            }else{
                throw new Exception("Impossibile identificare il reparto destinatario");
            }
        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            try {
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Decodifica l'IDEN ANAG.
     * @param   session
     * @param   JSONObject
     * @return  JSONObject contenente l'IDEN ANAG decodificato.
     * @throws Exception 
     */
    private JSONObject decodeIdenAnag(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding anagrafica");
        
        StatementFromFile sff = null;
        ResultSet rs = null;
                
        try {
            if (_ID_ENCODING.get(jsonObj.getString("repartoDestinatario")) == null) {
            	return jsonObj;
            } else {
            	sff = new StatementFromFile(session);
	            switch(_ID_ENCODING.get(jsonObj.getString("repartoDestinatario"))) {
	                case ID1:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID1");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID1", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID2:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID2");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID2", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID3:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID3");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID3", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID4:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID4");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID4", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break; 
	                case ID5:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID5");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID5", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID6:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID6");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID6", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID7:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID7");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID7", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;
	                case ID8:
                            logger.debug("Decoding anagrafica: hl7.xml/decodeIdenAnagID8");
                            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
	                    rs = sff.executeQuery("hl7.xml", "decodeIdenAnagID8", new String[]{jsonObj.getString("idenAnag")});
	                    if (rs.next()) {
	                        jsonObj.remove("idenAnag");
	                        jsonObj.put("idenAnag", rs.getString("iden_anag"));                  
	                    }                    
	                    break;   
	            }
            }

        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            try {
            	if (rs != null) {
                    rs.close();
                    rs = null;            
                    sff.close();	
            	}
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Decodifica il NOSOLOGICO.
     * @param session
     * @param jsonObj
     * @return
     * @throws Exception 
     */
    private JSONObject decodeIdenNosologico(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding nosologico: hl7.xml/decodeIdenNosologico");                            
        
        StatementFromFile sff = null;
        ResultSet rs = null;

        try {
            logger.debug(String.format("numNosologico: \"%s\"", jsonObj.getString("numNosologico")));
            logger.debug(String.format("idenAnag: \"%s\"", jsonObj.getString("idenAnag")));
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("hl7.xml", "decodeIdenNosologico", new String[]{jsonObj.getString("numNosologico"), jsonObj.getString("idenAnag")});
            if (rs.next()) {
                jsonObj.put("idenNosologico", rs.getString("iden"));
            } else {
                throw new Exception("Non è stato possibile trovare un evento per la coppia paziente/numero evento");
                //jsonObj.put("idenNosologico", JSONObject.NULL);
            }
        } catch (Exception e) {
        	//logger.error(e);
        	throw e;
        } finally {          
            try {
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Decodifica i campi ricevuti via GET/POST.
     * @param   session
     * @param   jsonObj
     * @return  JSONObject conenente i campi decodificati ricevuti via GET/POST.
     * @throws Exception 
     */
    private JSONObject decodeCampi(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        //try {
			jsonObj = decodeElencoEsami(session, jsonObj);
	        jsonObj = decodeCdcRepartoDestinatario(session, jsonObj);
	        jsonObj = decodeIdenAnag(session, jsonObj); 
	        jsonObj = decodeIdenNosologico(session, jsonObj);
		/*} catch (Exception e) {
        	logger.error(e);
        	throw e;
		}*/
        
        return jsonObj;
        
    }
    
    /**
     * Recupera il CDC del reparto dove è ricoverato il paziente.
     * @param session
     * @param jsonObj
     * @return 
     * @throws Exception 
     */
    private JSONObject putCdcPosizionePaziente(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding reparto richiedente: hl7.xml/cdcPosizionePaziente"); 
        
        StatementFromFile sff = null;
        ResultSet rs = null;

        try {
            logger.debug(String.format("idenPosizionePaziente: \"%s\"", jsonObj.getString("idenPosizionePaziente")));
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("hl7.xml", "cdcPosizionePaziente", new String[]{jsonObj.getString("idenPosizionePaziente")});
            /**
             * @TODO chiedere a FRA
             */
            if (rs.next()) {
                jsonObj.put("cdcPosizionePaziente", rs.getString("cod_cdc"));
            } else { 
            	jsonObj.put("cdcPosizionePaziente", JSONObject.NULL);
            }
        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            try {
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Recupera il webuser dell'utente che ha effettuato la richiesta.
     * @param session
     * @param jsonObj
     * @return 
     * @throws Exception 
     */
    private JSONObject putUserLogin(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding utente richiedente: hl7.xml/webuser"); 
        
        StatementFromFile sff = null;
        ResultSet rs = null;

        try {
            logger.debug(String.format("idenMedicoOrdinante: \"%s\"", jsonObj.getString("idenMedicoOrdinante")));
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("hl7.xml", "webuser", new String[]{jsonObj.getString("idenMedicoOrdinante")});
            if (rs.next()) {
                jsonObj.put("USER_LOGIN", rs.getString("webuser"));
            } else {
                jsonObj.put("USER_LOGIN", JSONObject.NULL);
            }
        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            try {
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Recupera la descrizione del dell'utente che ha effettuato la richiesta.
     * @param session
     * @param jsonObj
     * @return 
     * @throws Exception 
     */
    private JSONObject putDescrizioneMedicoOrdinante(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        logger.debug("Decoding medico richiedente: hl7.xml/descrizioneMedicoOrdinante"); 
        
        StatementFromFile sff = null;
        ResultSet rs = null;

        try {
            logger.debug(String.format("idenMedicoOrdinante: \"%s\"", jsonObj.getString("idenMedicoOrdinante")));
            sff = new StatementFromFile(session);
            rs = sff.executeQuery("hl7.xml", "descrizioneMedicoOrdinante", new String[]{jsonObj.getString("idenMedicoOrdinante")});
            if (rs.next()) {
                jsonObj.put("descrizioneMedicoOrdinante", rs.getString("descr"));
            } else {
                jsonObj.put("descrizioneMedicoOrdinante", JSONObject.NULL);
            }
        } catch (Exception e) {
        	logger.error(e);
        	throw e;
        } finally {          
            try {
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException e) {
            	logger.error(e);
            	throw e;
            }
        }
        
        return jsonObj;
        
    }
    
    /**
     * Effettua il put dei campi non presenti all'interno del json.
     * @param session
     * @param jsonObj
     * @return
     * @throws Exception 
     */
    private JSONObject putFields(HttpSession session, JSONObject jsonObj) throws Exception {
    	
        try {
			jsonObj = putCdcPosizionePaziente(session, jsonObj);
	        jsonObj = putUserLogin(session, jsonObj);
	        jsonObj = putDescrizioneMedicoOrdinante(session, jsonObj);
		} catch (Exception e) {
        	logger.error(e);
        	throw e;
		}
        
        return jsonObj;
        
    }    
}
