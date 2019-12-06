<%--
    File: PoolStatistic.jsp
    Autore: jack
--%>
<%@ page import="java.util.Date" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="oracle.ucp.jdbc.PoolDataSource" %>
<%@ page import="oracle.ucp.jdbc.JDBCConnectionPoolStatistics" %>
<%@ page import="it.elco.caronte.factory.pools.component.ElcoPoolOracleComponent" %>
<%@ page import="it.elco.baseObj.iBase.iBaseGlobal" %>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<%@ page contentType="text/html;charset=ISO-8859-1" language="java" %>
<%
    String          id_files    = String.valueOf(System.currentTimeMillis());
    String          urlServer   = new String("../");
    String          id_pool     = request.getParameter("ID_POOL");
    ServletContext  context     = pageContext.getServletContext();
    PoolDataSource  pds         = ElcoPoolOracleComponent.getPoolDataSource(id_pool);
    iBaseGlobal     bg          = null;

    try
    {
        if(bg == null)
        {
            baseFactory baseFact = new baseFactory();

            bg = baseFact.createBaseGlobal("", context.getInitParameter("SITO"), "1");
        }

        if(context.getInitParameter("ABILITA_FILE_SERVER") != null && context.getInitParameter("ABILITA_FILE_SERVER").equalsIgnoreCase("S") &&  bg.get("PERCORSO_FILE_SERVER_UPLOAD") != null && bg.get("PERCORSO_FILE_SERVER_UPLOAD").length()>10)
            urlServer  = bg.get("PERCORSO_FILE_SERVER");
    }
    catch (Exception e)
    {
    }
%>
<html>
<head>
    <meta/>
    <title><%=context.getInitParameter("SITO")%> - Pool: <%=id_pool%></title>
    <link rel="stylesheet" href="<%=urlServer%>css/mix.css?t=<%=id_files%>" type="text/css"/>
    <!--[if IE 7]>
    <link rel="stylesheet" href="<%=urlServer%>css/ie7.css?t=<%=id_files%>" type="text/css"/>
    <![endif]-->
    <script id="scriptHome">
    var home = null;var wnd = window;
    var n = 0;
    while (wnd.name != "home" && n < 5)
    {
        wnd = wnd.parent;
        n++;
    }
    home = (n<5) ? wnd : window;
    </script>
    <script type="text/javascript">
        var traduzione = {};
        var baseUser = {};
        var basePC = {};
        var baseGlobal = {};
        var jsonData = {};
    </script>

    <script type="text/javascript" id="scriptPlugin">
        var SCRIPT_PLUGIN = new Array();
    </script>
</head>
<body>
        <%
        if(pds != null)
        {
            SimpleDateFormat    sdf     = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss.SSS");
            Date                date    = new Date(Long.parseLong(pds.getDescription()));
        %>
        <div class="contentTabs">
            <fieldset class="fldCampi" id="fldDP" style="float: left;width: 48%;">
                <legend>Impostazioni connessione</legend>
                <table class="campi null">
                    <tr>
                        <td class="tdLbl">Creation time:</td>
                        <td class="tdText"><%=sdf.format(date)%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">URL:</td>
                        <td class="tdText"><%=pds.getURL()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Abandoned connection timeout:</td>
                        <td class="tdText"><%=pds.getAbandonedConnectionTimeout()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Inactive connection timeout (seconds):</td>
                        <td class="tdText"><%=pds.getInactiveConnectionTimeout()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Max connection reuse time (seconds):</td>
                        <td class="tdText"><%=pds.getMaxConnectionReuseTime()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Timeout check interval (seconds):</td>
                        <td class="tdText"><%=pds.getTimeoutCheckInterval()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Max statements:</td>
                        <td class="tdText"><%=pds.getMaxStatements()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Initial pool size:</td>
                        <td class="tdText"><%=pds.getInitialPoolSize()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Min pool size:</td>
                        <td class="tdText"><%=pds.getMinPoolSize()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Max pool size:</td>
                        <td class="tdText"><%=pds.getMaxPoolSize()%></td>
                    </tr>
                </table>
            </fieldset>
            <%
                JDBCConnectionPoolStatistics stats = pds.getStatistics();
                if(stats != null)
                {
            %>
            <fieldset class="fldCampi" id="fldDP" style="float: right;width: 48%;">
                <legend>Statistiche del pool</legend>
                <table class="campi null">
                    <tr>
                        <td class="tdLbl">Abandoned connections count:</td>
                        <td class="tdText"><%=stats.getAbandonedConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Available connections count:</td>
                        <td class="tdText"><%=stats.getAvailableConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Borrowed connections count:</td>
                        <td class="tdText"><%=stats.getBorrowedConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Connections closed count:</td>
                        <td class="tdText"><%=stats.getConnectionsClosedCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Connections created count:</td>
                        <td class="tdText"><%=stats.getConnectionsCreatedCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Peak connections count:</td>
                        <td class="tdText"><%=stats.getPeakConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Labeled connections count:</td>
                        <td class="tdText"><%=stats.getLabeledConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Total connections count:</td>
                        <td class="tdText"><%=stats.getTotalConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Pending requests count:</td>
                        <td class="tdText"><%=stats.getPendingRequestsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Peak connection wait time:</td>
                        <td class="tdText"><%=stats.getPeakConnectionWaitTime()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Remaining pool capacity count:</td>
                        <td class="tdText"><%=stats.getRemainingPoolCapacityCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Average borrowed connections count:</td>
                        <td class="tdText"><%=stats.getAverageBorrowedConnectionsCount()%></td>
                    </tr>
                    <tr>
                        <td class="tdLbl">Average connection wait time (seconds):</td>
                        <td class="tdText"><%=stats.getAverageConnectionWaitTime()%></td>
                    </tr>
                </table>
            </fieldset>
            <%
                }
            %>
        </div>
        <%
        }
        else
        {
        %>
        <H2>Pool not available</H2>
        <%
        }
        %>
</body>
    <script type="text/javascript" src="<%=urlServer%>js/Base/LIB.js?t=<%=id_files%>"></script>
    <!--[if IE]>
    <script type="text/javascript" src="<%=urlServer%>js/Base/NO-min/ecma.js?t=<%=id_files%>"></script>
    <![endif]-->
</html>