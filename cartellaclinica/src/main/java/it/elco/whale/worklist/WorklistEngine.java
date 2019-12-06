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
package it.elco.whale.worklist;

import it.elco.whale.freemarker.ResultSetModel;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;
import freemarker.template.TemplateSequenceModel;
import generic.statements.StatementFromFile;

/**
 * Servlet di elaborazione e creazione delle WORKLIST: ricevere delle richieste "strutturate" GET/POST ed elabora delle worklist.
 * 
 * Parametri GET/POST:
 * - wkTemplate -> nome del file FTL nel quale è definito il template della worklist [OBBLIGATORIO];
 * - pFileName -> nome del file XML dal quale estrapolare la query da eseguire [FACOLTATIVO; default = worklist.xml];
 * - pStatementName -> nome dello statement da richiamare all'interno di pFileName [OBBLIGATORIO];
 * - pBinds -> elenco di bind variables in un oggetto JSON (es. pBinds={"bind":[1,"a",...,n}) [FACOLTATIVO];
 * - array -> elenco di coppie (K,V) per la costruzione dell'array (V) relativo alla colonna indicata (K) [FACOLTATIVO].
 * Es. url = "WorklistEngine?template=TEMPLATE.ftl&file=FILE.xml&statement=STATEMENT&bind={"list":[int,"String",...]}&array=COLUMN1_NAME,ARRAY1_NAME|COLUMN2_NAME,ARRAY2_NAME";
 * 
 * La servlet trasforma l'elenco di pBinds (se presente) in un array di stringhe e successivamente esegue la query.
 * Il ResultSet ottenuto viene processato dal template (TEMPLATE.ftl) e restituito dalla response della servlet stessa.
 * NB: 
 * - le pBinds verranno inserite nell'ordine passato.
 * - le colonne indicate nel parametro array non vengono visualizzate in worklist.
 * 
 * @author marcoulr <marco.ubertonelarocca at elco.it>
 
@WebServlet(urlPatterns = "/WorklistEngine")*/
public class WorklistEngine extends HttpServlet {
    private ServletConfig config = null;
    private ServletContext context = null;
    private Configuration cfg = null;
    
    private static String _PATH_FILE_FTL = "WEB-INF/templates/freemarker/worklist";
    private static String _NAME_FILE_XML = "worklist.xml";
    
    /**
     * Funzione di inizializzazione della servlet.
     * 
     * @param config
     * @throws ServletException 
     */
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.config = config;
	this.context = this.config.getServletContext();
        setConfiguration();
    }
    
    /**
     * Funzione per creare e regolare la configurazione.
     */
    private void setConfiguration() {
        cfg = new Configuration();
        cfg.setServletContextForTemplateLoading(this.context, _PATH_FILE_FTL);
        cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);        
    }
  
    /**
     * Funzione per trasformare in maiuscolo il primo carattere di ogni parola.
     * 
     * @param column
     * @return 
     */
    private String upperFirstChar(String column) {
        StringBuilder sb = new StringBuilder(column);
        int i = 0;
        
        do {
          sb.replace(i, i + 1, sb.substring(i, i + 1).toUpperCase());
          i =  sb.indexOf(" ", i) + 1;
        } while (i > 0 && i < sb.length());

        return sb.toString();        
    }
    
    /**
     * Funzione per configurare i dati delle righe e delle colonne della worklist.
     * Recupera i metadata delle colonne presenti nel ResultSet.
     * Crea una mappa ordinata dove l'associazione (K,V) è:
     * - K -> nome della colonna in maiuscolo;
     * - V -> nome della colonna elaborato (es. "IDEN_VISITA" diviene "Iden Visita").
     * 
     * @param rs
     * @param array
     * @return 
     */
    private Map<String, String> setColumns(ResultSet rs, Map<String, Object> array) {
        Map<String, String> columns = new LinkedHashMap<String, String>();
        Map<String, String> list = (Map<String, String>) array.get("list");
        
        try {
            int count = rs.getMetaData().getColumnCount();
            int index = 1;
            while (index <= count) {
                String key = rs.getMetaData().getColumnName(index).toUpperCase();
                if (list == null || !list.containsKey(key)) {
                    columns.put(key, upperFirstChar(rs.getMetaData().getColumnName(index).toLowerCase().replace("_", " ")));
                }
                index++;
            }
        } catch (SQLException ex) {
            Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        return columns;        
    }
    
    /**
     * Funzione per impostare i valori da inserire nella table all'interno del template.
     * 
     * @param rs
     * @param parameter
     * @return 
     */
    private Map<String, Object> setTable(ResultSet rs, Map<String, Object> parameter) {
        Map<String, Object> table = new HashMap<String, Object>();

        table.put("rows",       new ResultSetModel(rs));
        table.put("columns",    setColumns(rs, (Map<String, Object>) parameter.get("array")));
        //table.put("array",      (Map<String, Object>) parameter.get("array"));
        
        return table;
    }    

    /**
     * Funzione che crea una mappa per l'associazione tra il nome della colonna e il nome dell'array associato.
     * 
     * @param request
     * @return 
     */
    private Map<String, Object> setArray(HttpServletRequest request) {
        Map<String, Object> array = null;
        Map<String, String> list = null;
        String[] tmpList = null;
        
        tmpList = request.getParameter("array").split("[|]");
        int listCount = tmpList.length;
        
        int index = 0;
        while (index < listCount) {
            String[] tmp = tmpList[index].split(",");
            if (tmp.length == 2) {
                if (list == null) {
                    list = new LinkedHashMap<String, String>();
                }
                list.put(tmp[0].toUpperCase(), tmp[1].toLowerCase());
            }
            index++;
        }
        
        array = new HashMap<String, Object>();
        array.put("list", list);
        if (list != null) {
            array.put("enable", 1);
        } else {
            array.put("enable", 0);
        }
        
        return array;
    }    
    
    /**
     * Funzione per l'inserimento delle bind variables in un array di stinghe.
     * 
     * @param request Richiesta ricevuta dalla servlet.
     * @return String[] Array di stringhe contente le bind variables.
     */
    private String[] setBind(HttpServletRequest request) {
        String[] pBinds = null;
        JSONObject bindJsonObj = null;
        JSONArray bindJsonArr = null;
        
        try {
            bindJsonObj = it.elco.whale.converters.JsonFactory.fromString(request.getParameter("bind"));
            bindJsonArr = bindJsonObj.getJSONArray("list");

            int pBindsCount = bindJsonArr.length();
            pBinds = (pBindsCount != 0) ? new String[pBindsCount] : null;

            int index = 0;
            while (index < pBindsCount) {
                pBinds[index] = bindJsonArr.getString(index);
                index++;
            }
        } catch (JSONException ex) {
            Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
            
        return pBinds;
    }    
    
    /**
     * Funzione che raccoglie i parametri passati alla servlet e li salva in un HashMap.
     * 
     * @param request
     * @return 
     */
    private Map<String, Object> setParameter(HttpServletRequest request) {
        Map<String, Object> parameter = new HashMap<String, Object>();
        
        parameter.put("template",   (request.getParameter("template")   != null) ? request.getParameter("template")     : null);
        parameter.put("file",       (request.getParameter("file")       != null) ? request.getParameter("file")         : _NAME_FILE_XML);
        parameter.put("statement",  (request.getParameter("statement")  != null) ? request.getParameter("statement")    : null);
        parameter.put("bind",       (request.getParameter("bind")       != null) ? setBind(request)                     : null);
        parameter.put("array",      (request.getParameter("array")      != null) ? setArray(request)                    : null);
        
        return parameter;
    }

    /**
     * Funzione per la gestione delle richeste GET/POST.
     * 
     * @param request Richiesta ricevuta dalla servlet.
     * @param response Risposta data dalla servlet.
     * @throws ServletException
     * @throws IOException
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StatementFromFile sff = null;
        ResultSet rs = null;        
        Map<String, Object> parameter = null, table = null, array = null;
        
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            parameter = setParameter(request);
            sff = new StatementFromFile(request.getSession());
            rs = ((String[]) parameter.get("bind") != null) ? sff.executeQuery((String) parameter.get("file"), (String) parameter.get("statement"), (String[]) parameter.get("bind")) : sff.executeQuery((String) parameter.get("file"), (String) parameter.get("statement"));          
            
            rs = sff.executeQuery(
                    (String) parameter.get("file"), 
                    (String) parameter.get("statement"),
                    (String[]) parameter.get("bind") != null ? (String[]) parameter.get("bind") : new String[]{},
                    ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_UPDATABLE
                );
            
            table = setTable(rs, parameter);
            array = (Map<String, Object>) parameter.get("array");
                    
            Map root = new HashMap();
            root.put("rows",    (TemplateSequenceModel) table.get("rows"));
            root.put("columns", (Map<String, String>) table.get("columns"));
            root.put("enable",  (Integer) array.get("enable"));
            root.put("array",   (Map<String, String>) array.get("list"));

            Template template = cfg.getTemplate((String) parameter.get("template")); 
            template.process(root, out);
//        } catch (TemplateModelException ex) {
//            Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
//        } catch (TemplateException ex) {
//            Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
        } catch (Exception ex) {
            Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
        } finally {          
            try {
                out.close();
                rs.close();
                rs = null;            
                sff.close();
            } catch (SQLException ex) {
                Logger.getLogger(WorklistEngine.class.getName()).log(Level.SEVERE, null, ex);
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
}
