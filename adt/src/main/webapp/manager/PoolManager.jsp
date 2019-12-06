<%@ page import="it.elco.caronte.factory.pools.component.ElcoPoolOracleComponent" %>
<%@ page import="oracle.ucp.jdbc.PoolDataSource" %>
<%@ page import="java.util.Map" %>
<%@ page import="it.elco.baseObj.iBase.iBaseGlobal" %>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<%--
    File: PoolManager.jsp
    Autore: jack
--%>

<%@ page contentType="text/html;charset=ISO-8859-1" language="java" %>
<%
    String                      id_files    = String.valueOf(System.currentTimeMillis());
    String                      urlServer   = new String("../");
    ServletContext              context     = pageContext.getServletContext();
    Map<String, PoolDataSource> list_pool   = ElcoPoolOracleComponent.getPool();
    iBaseGlobal                 bg = null;

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
    <title><%=context.getInitParameter("SITO")%> - Manager pool connection</title>
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
    <div class="tabs" id="tabPool">
    	<ul id="tabs-Pool" class="ulTabs">
            <%
                if(list_pool != null)
                    for(String id_pool : list_pool.keySet())
                    {
            %>
            <li id="li-tab<%=id_pool%>" data-tab="<%=id_pool%>"><%=id_pool%></li>
            <%
                    }
            %>
    	</ul>
        <div class="contentTabs">
            <%
                if(list_pool != null)
                    for(String id_pool : list_pool.keySet())
                    {
            %>
            <div data-title="<%=id_pool%>" class="divtab" id="tab<%=id_pool%>" data-id-pool="<%=id_pool%>">
                <iframe frameBorder="0" class="iPool" id="i<%=id_pool%>"></iframe>
            </div>
            <%
                    }
            %>
        </div>
        <div class="footerTabs sfDark">
            <div class="buttons">
                <button type="button" class="btn butAggiorna" id="tabPool-butAggiorna">Aggiorna</button>
                <button type="button" class="btn butAggiorna" id="tabPool-butPurge">Purge</button>
            </div>
        </div>
    </div>
</body>
    <script type="text/javascript" src="<%=urlServer%>js/Base/LIB.js?t=<%=id_files%>"></script>
    <script type="text/javascript" src="<%=urlServer%>js/Base/NS_FENIX.js?t=<%=id_files%>"></script>
    <!--[if IE]>
    <script type="text/javascript" src="<%=urlServer%>js/Base/NO-min/ecma.js?t=<%=id_files%>"></script>
    <![endif]-->
    <script type="text/javascript" src="<%=urlServer%>/manager/js/Manager.js?t=<%=id_files%>"></script>
    <script type="text/javascript" src="<%=urlServer%>/manager/js/PoolManager.js?t=<%=id_files%>"></script>
</html>