<%@page contentType="text/html;charset=windows-1252"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="windows-1252"/>
    <title>FeniX Login
    </title>
    <link rel="stylesheet" href="css/mix.css" type="text/css"/>
    <link rel="stylesheet" href="css/Login/login.css" type="text/css"/>
    <!--[if IE 7]>
    <link rel="stylesheet" href="css/LOGIN_PAGE/loginIE7.css" style="text/css"/>
    <![endif]-->
</head>
<body>
<img height="169" width="253" alt="" src="img/logoFenix.png" id="logo">
<div class id="divFormLogin"  style="width: 600px">
    <div class="hRiq hRiq26">
				<span class="hSx">
				</span>
        <div class="hC">
        </div>
				<span class="hDx">
				</span>
    </div>
    <div class id="contentLogin">
        <div style="display: block;">
            <div id="errorMsg">
                <div style="float: left;width: 25%;">
                    <img height="110" width="100" alt=""  src="img/sdj_error.png">
                    <button onclick="javascript:login();" class="button" id="butLogin" style="width:100px;">Login</button>
                    <br />
                    <button onclick="javascript:closeWindow();" class="button" id="butClose" style="width:100px;">Chiudi</button>
                </div>
                <div style="float: left;width: 75%;"><textarea style="width:100%;" rows="25" id="MESSAGE_ERROR"><% out.println(request.getParameter("MSG")); %></textarea></div>
            </div>
        </div>

        <SCRIPT>function closeWindow(){window.open('','_self','');window.close();}</SCRIPT>
    </div>
</div>
<script type="text/javascript">
    var home = null;
    var n = 0;
    var wnd = window;
    while ((wnd.name != "home") && (n < 5))
    {
        wnd = wnd.parent;
        n++;
    }
    home = wnd;

    if(typeof home.NS_LOADING !== 'undefined')
        home.NS_LOADING.hideLoading();



    function login()
    {
        if(home.NS_FENIX_TOP)
            home.NS_FENIX_TOP.logout("CHANGELOGIN");
        else
            home.location = ".";
    }
</script>
</body>
</html>
