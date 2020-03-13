<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="org.apache.jcs.admin.*" %>
<%@ page import="it.elco.cache.*" %>

<jsp:useBean id="jcsBean" scope="request" class="org.apache.jcs.admin.JCSAdminBean" />
<html>
    <head>
        <title>Fenix Cache</title>
        <link href="../css/mix.css" rel="stylesheet">
        <script type="text/javascript">var traduzione = {};</script>
        <style>
            body{
                background: #cdcdcd;
            }
            .content{
                width: 60%;
                background: #fefefe;
                border: 1px solid #565656;
                margin: 50px auto;
            }
            .cell{
                padding:5px;
            }
            .label{
                font-weight: bold;

            }
            .textRight{
                text-align: right;
            }
            .textCenter{
                text-align: center;
            }
        </style>
    </head>
    <body>

            <%
                HashMap context = new HashMap();

                iCache JCScache = new JCSCache();

                context.put( "cacheInfoRecords", jcsBean.buildCacheInfo() );
            %>
    <div class="content">
        <div class="row">
            <div class="cell c-1-2"><p class="textRight"><span class="label" >Server (select what do you want)</span></p></div>
            <div class="cell c-1-2">
                <select id="serverList" multiple="multiple">
                <%
                    //String [] arr_server = {"192.168.3.190:8080/fenix-ris","localhost:8080/fenix-ris"};
                    String [] arr_server = {"10.67.2.196:8080/fenix","10.67.2.197:8080/fenix","10.67.2.198:8080/fenix","10.67.2.199:8080/fenix"};
                    for(int i=0;i<arr_server.length;i++)
                    {
                %>
                    <option  value="http://<%=arr_server[i]%>/manager/JCSAdmin.jsp"><%=arr_server[i]%></option>
                <%
                    }
                %>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="cell c-1-2"><p class="textRight"><span class="label">Cache Region</span></p></div>
            <div class="cell c-1-2">
                <select id="cacheName">
                    <%
                        List listSelect = (List)context.get( "cacheInfoRecords" );
                        Iterator itSelect = listSelect.iterator();
                        while ( itSelect.hasNext() )
                        {
                            CacheRegionInfo record = (CacheRegionInfo)itSelect.next();
                    %>
                            <option value="<%=record.getCache().getCacheName()%>"><%=record.getCache().getCacheName()%></option>
                    <%
                        }
                    %>
                </select>
            </div>
        </div>
        <div class="row">
            <div class="footerTabs sfDark c-1-1">
                <p class="textCenter"><button id="butClearRegion">Clear Selected Region</button></p>
            </div>
        </div>
    </div>
        <script type="text/javascript" src="../js/Base/LIB.js"></script>
        <script type="text/javascript" src="js/cache.js"></script>
    </body>

</html>

