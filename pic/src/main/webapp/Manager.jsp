<%@ page import="it.elco.baseObj.iBase.iBaseGlobal" %>
<%@ page import="it.elco.baseObj.factory.baseFactory" %>
<%@ page import="java.util.Properties" %>
<%@ page import="it.elco.listener.ElcoContextInfo" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.net.URL" %>
<%--
    File: Manager.jsp
    Autore: jack
--%>

<%@ page contentType="text/html;charset=ISO-8859-1" language="java" %>
<%
    String          id_files    = String.valueOf(System.currentTimeMillis());
    String          urlServer   = new String("");
    ServletContext  context     = pageContext.getServletContext();
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
    <title><%=ElcoContextInfo.getSystemParameter("SITO")%> - Manager pool connection</title>
    <link rel="stylesheet" href="<%=urlServer%>css/mix.css?t=<%=id_files%>" type="text/css"/>
    <!--[if IE 7]>
    <link rel="stylesheet" href="<%=urlServer%>css/ie7.css?t=<%=id_files%>" type="text/css"/>
    <![endif]-->
    <script type="text/javascript">
        var traduzione = {};
        var baseUser = {};
        var basePC = {};
        var baseGlobal = {};
        var jsonData = {};
	 var home = window;
	 var basePermission = {"RICHIESTE":{"ACCETTA":"S","ANNULLA":"S","PRENOTA":"S"},"ESAMI":{"CANCELLA":"S","INSERISCI":"S","PRENOTA":"S"},"DEBUGGER":{"clearButton":"S"},"GESTIONE_AGENDE":{"modificaAttive":"S"},"RICHIESTE_MODIFICA":{"notifiche":"S","inserimento":"S","esecuzione":"S"},"ESECUZIONE":{"ESEGUI":"S","ANNULLA_ESEGUI":"S"},"REFERTAZIONE":{"REFERTA":"S","ANNULLA_REFERTO":"S"}};
	 home.basePermission = basePermission;
    </script>

    <script type="text/javascript" id="scriptPlugin">
        var SCRIPT_PLUGIN = new Array();
    </script>
</head>
<body id='body'>
    <div class="sfLight" id="menuBar">
        <div class="jsm jqueryslidemenu" id="slidemenu">
            <ul>
                <li>
                    <a href="#" title="" id="mPool">Pool</a>
                    <ul>
                        <li>
                            <a href="javascript:MANAGER.apriPagina({url:MANAGER.parameters.url_server + 'manager/PoolManager.jsp?a=1',id:'POOL_MANAGER',fullscreen:false,showloading:false});" title="" id="mPoolManager">Manager</a>
                        </li>
                        <li>
                            <a href="javascript:MANAGER.purge('ALL');" title="" id="mPoolPurge">Purge pools</a>
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="#" title="" id="mContext">Spring context</a>
                    <ul>
                        <li>
                            <a href="javascript:MANAGER.context('REFRESH');" title="" id="mContextRefresh">Refresh</a>
                        </li>
                        <!--<li>
                            <a href="javascript:MANAGER.context('CLOSE');" title="" id="mContextClose">Close</a>
                        </li>-->
                        <li>
                            <a href="javascript:MANAGER.context('STOP');" title="" id="mContextStop">Stop</a>
                        </li>
                        <li>
                            <a href="javascript:MANAGER.context('START');" title="" id="mContextStart">Start</a>
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="#" title="" id="mCache">Cache</a>
                    <ul>
                        <li>
                            <a href="javascript:MANAGER.apriPagina({url:'manager/JCSAdmin.jsp?a=1', id:'CACHE_MANAGER',fullscreen:false,showloading:false});" title="" id="mCacheManager">Manager</a>
                        </li>
                        <li>
                            <a href="javascript:MANAGER.cache('clearAllRegions')" title="" id="mCacheCleaner">Clear</a>
                        </li>
                        <li>
                            <a href="javascript:MANAGER.cache('disable')" title="" id="mCacheDisable">Disable</a>
                        </li>
                        <li>
                            <a href="javascript:MANAGER.cache('enable')" title="" id="mCacheEnable">Enable</a>
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="#" title="" id="mLogBack">LogBack</a>
                    <ul>
                        <li>
                            <a href="javascript:MANAGER.logback('REFRESH');" title="" id="mLogBackRefresh">Refresh config</a>
                        </li>
                    </ul>
                </li>

                <%
                    // Controllo se ci sono altri server da cui switchare
                    String[]    a_server_ip     = new String[0];
                    String[]    a_server_name   = new String[0];
                    int         index_server    = -1;

                    try
                    {
                        Properties prop = new Properties();

                        /*if(urlServer.length() > 0)
                            prop.load(new URL(urlServer + "manager/servers.properties").openStream());
                        else*/
                            prop.load(new FileInputStream(ElcoContextInfo.getContextPath() + "manager/servers.properties"));

                        a_server_ip     = prop.getProperty("balancer_server_ip").split(",");
                        a_server_name   = prop.getProperty("balancer_server_name").split(",");

                        if(request.getParameter("SERVER_SELECT") != null && request.getParameter("SERVER_SELECT").trim().length() > 0)
                            index_server = Integer.valueOf(request.getParameter("SERVER_SELECT"));
                        else
                            index_server = Integer.valueOf(prop.getProperty("server"));
                    }
                    catch(Exception ex)
                    { }

                    if(a_server_ip.length > 0)
                    {
                        %>
                <li>
                    <a href="#" title="" id="mServers">Server: <%=a_server_name[index_server]%></a>
                    <ul>
                        <%
                        for(int i = 0; i < a_server_ip.length; i++)
                        {
                        %>
                        <li>
                            <a href="javascript:MANAGER.switch_server('<%=String.valueOf(i)%>', '<%=a_server_ip[i]%>', '<%=a_server_name[i]%>');" title="" id="mServer<%=String.valueOf(i)%>"><%=a_server_name[i]%></a>
                        </li>
                        <%
                        }
                        %>
                    </ul>
                </li>
                        <%
                    }

                    if(request.getParameter("SHOW_CLOSE") != null && request.getParameter("SHOW_CLOSE").equalsIgnoreCase("S"))
                    {
                %>
                <li>
                    <a href="javascript:top.NS_FENIX_TOP.chiudiUltima();" title="" id="mChiudi">Chiudi</a>
                </li>
                <%
                    }
                %>
            </ul>
        </div>
    </div>
    <div class id="content">
        <iframe frameBorder="0" class id="iContent" width="100%"></iframe>
    </div>
</body>
    <script type="text/javascript" src="<%=urlServer%>js/Base/LIB.js?t=<%=id_files%>"></script>
    <script type="text/javascript" src="<%=urlServer%>manager/js/Manager.js?t=<%=id_files%>"></script>
<script>
    <%
            if(request.getParameter("SHOW_CLOSE") != null && request.getParameter("SHOW_CLOSE").equalsIgnoreCase("S"))
            {
            %>
        MANAGER.apriPagina({url:'manager/PoolManager.jsp',id:'POOL_MANAGER',fullscreen:false,showloading:false});

    <%
             }
             %>

$slidemenu.buildmenuClick("slidemenu");
</script>
</html>