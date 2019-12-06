<%@ page import="it.elco.toolkit.toolKitShortcut" %>
<%@ page import="java.util.Date" %>
<%@ page import="it.elco.caronte.dataManager.impl.iDataManager" %>
<%@ page import="it.elco.caronte.factory.utils.CaronteFactory" %>
<%@ page import="org.springframework.jdbc.support.rowset.SqlRowSet" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="org.slf4j.Logger" %>
<%@ page import="org.slf4j.LoggerFactory" %>
<%@ page import="it.elco.baseObj.iBase.iBaseGlobal" %>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<html>
<head><title>Verbale di Pronto Soccorso</title></head>
<body>
    <% 
        final Logger log = LoggerFactory.getLogger(getClass());
        final String idenContatto = request.getParameter("idenContatto");
        final String checkSession = request.getParameter("CHECK_SESSION");
        
        log.info("Recupero il verbale di pronto soccorso relativo al contatto:" + idenContatto);
                    
        if(toolKitShortcut.checkSession(request, response)){
            iBaseGlobal bg = baseFactory.getBaseGlobal("PS", "1");
            
            final String datasource = "ADT";             
            final String query = "ARCHIVIO.VISUALIZZA_PDF_VERBALE_PS";                
            
            iDataManager dataManager = CaronteFactory.getFactory().createDataManager(datasource, toolKitShortcut.generateClientID(request.getSession(false)));

            HashMap<String,String> params = new HashMap<String, String>();
            params.put("iden", idenContatto);
            SqlRowSet sq = dataManager.getSqlRowSetByQuery(query, params);
            
            String url; 
            if (sq.next()) {
                log.info("Risulta un documento firmato relativo al Verbale richiesto, recupero del contenuto in corso");
                url = "../../showDocumentoAllegato?IDEN=" + idenContatto + "&QUERY=ARCHIVIO.VISUALIZZA_PDF_VERBALE_PS&DATASOURCE=ADT&CHECK_SESSION=" + checkSession;
            } else {
               log.info("Non risulta un documento firmato relativo al Verbale richiesto, generazione del report in corso");
               url = bg.get("PRINT_URL") + "report=/usr/local/report/fenix/PS/1/VERBALE_PS.RPT&init=pdf&promptpIdenContatto=" + idenContatto + "&promptpFirma=N&promptpBozza=N&promptpStatoVerbale=R&ts=" + new Date().getTime();
            }                

            log.info("verbale " + idenContatto + ", url:" + url);
            
            response.sendRedirect(url);
        }else{                
            out.println("Successo qualcosa?");
        }
    %>
</body>
</html>
