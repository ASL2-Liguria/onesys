<html>
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

    <head><title>Verbale di Pronto Soccorso</title></head>
    <body>
        <%
            final Logger log = LoggerFactory.getLogger(getClass());
            final String idenContatto = request.getParameter("idenContatto");
            final String numeroPratica = request.getParameter("numeroPratica");
            final String sito = "PS";
            final String versione = "1";
            String datasource = "PS";

            log.info("Recupero il verbale di pronto soccorso relativo al contatto:" + idenContatto);

            if(!toolKitShortcut.checkSession(request, response, true)){
            //    session.setAttribute("BASEUSER", new BaseUser(request.getParameter("username")));
            //    String ipAddress = request.getHeader("X-FORWARDED-FOR");
            //    if (ipAddress == null) {
            //       ipAddress = request.getRemoteAddr();
            //    }
            //    session.setAttribute("BASEPC", new BasePC(ipAddress));
            //    session.setAttribute("SITO", "PS");

            //    session.invalidate();
            //    session = request.getSession(true);
            //    LoginDbWebuserSP login = new LoginDbWebuserSP(application, request, response, config, sito, versione);
            //    login.executeLogin(request.getParameter("username") , request.getParameter("password"), session.getId());
            return;
            }

            iBaseGlobal bg = baseFactory.getBaseGlobal(sito, versione);

            final String query ;
            HashMap<String,String> params = new HashMap<String, String>();


            //se è valorizzato idenContatto vado per iden contatto
            if(idenContatto != null ){
                query = "CONTATTO.VISUALIZZA_PDF_VERBALE_PS_FROM_IDEN";
                params.put("iden", idenContatto);
            }
            else
            {
            //se non è valorizzato l'idenContatto vado per numeroPratica
                query = "CONTATTO.VISUALIZZA_PDF_VERBALE_PS_FROM_NUM_PRATICA";
                params.put("codice", numeroPratica);
            }

            iDataManager dataManager = CaronteFactory.getFactory().createDataManager(datasource, toolKitShortcut.generateClientID(session));
            SqlRowSet sq = dataManager.getSqlRowSetByQuery(query, params);

            String url;
            String stato = request.getParameter("stato") == null ? "R" : request.getParameter("stato");

            if (sq.next() && "F".equals(stato)) {
                final String checkSession = request.getParameter("CHECK_SESSION");

                log.info("Risulta un documento firmato relativo al Verbale richiesto, recupero del contenuto in corso");
                url = "../../showDocumentoAllegato?IDEN=" + idenContatto + "&QUERY="+query+"&DATASOURCE="+datasource+"&CHECK_SESSION=" + checkSession;
            } else {

                String firma = request.getParameter("firma") == null ? "N" : request.getParameter("firma");
                String bozza = request.getParameter("bozza") == null ? "N" : request.getParameter("bozza");

                log.info("Non risulta un documento firmato relativo al Verbale richiesto, generazione del report in corso");
                url = bg.get("PRINT_URL") +"report="+bg.get("PRINT_REPOSITORY_REPORT") +"/1/VERBALE_PS.RPT&init=pdf&promptpIdenContatto=" + idenContatto + "&promptpFirma=" + firma + "&promptpBozza=" + bozza + "&promptpStatoVerbale="+stato+"&ts=" + new Date().getTime();
            }

            log.info("verbale " + idenContatto + ", url:" + url);

            response.sendRedirect(url);

        %>
    </body>
</html>
