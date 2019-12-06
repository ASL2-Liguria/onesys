var home = window;

$(document).ready(function ()
{
    NS_LOGIN.init();
    NS_LOGIN.setEvents();

    NS_LOGIN.focusUser();
});


var NS_LOGIN = {

    init: function()
    {
        try
        {
            var nomeHost = AppStampa.GetLocalHostname().toUpperCase();
        }
        catch (ex)
        {
            if (window.console)
                console.log("Java error [\"var nomeHost = AppStampa.GetLocalHostname().toUpperCase();\"]")
        }

        $("#h5NomeHostVal").html(nomeHost);
        $("#nomeHost").val(nomeHost);

        if ($.browser.ipad || $.browser.iphone || $.browser.android)
        {
            $("#h5NomeHostVal").html('IPAD');
            $("#nomeHost").val('IPAD');
        }
    },

    setEvents: function()
    {
        $(window).resizeEnd(
            {
                onDragEnd: function ()
                {
                    window.moveTo(0,0);
                    window.resizeTo(screen.width, screen.height);
                },
                runOnStart: true
            });

        $('#username').keypress(NS_LOGIN.enterEvent);
        $('#password').keypress(NS_LOGIN.enterEvent);

        $('#password').focus(function ()
        {
            $(this).select();
        });

        $("#butLogin").click(NS_LOGIN.aux_login);
        $("#butLoginRIS").click(function(){NS_LOGIN.aux_login('RIS', '1');}); // TODO: DA RIMUOVERE, USATO SOLO PER PROVA!!!

        $("#butPassword").click(function ()
        {
            NS_LOADING.showLoading({timeout: 0});
        });

        $('#butCambia').on('click',NS_CAMBIA_LOGIN.cambiaPassword);
    },

    enterEvent: function(e)
    {
        if (e.keyCode == '13')
        {
            e.preventDefault();

            NS_LOGIN.aux_login();
        }
    },
    checkHostname:function(){
        if($("#nomeHost").val()==""){
            $("#errorMsg").html("Hostname mancante. Premere F5");
            $("#errorMsg").show();
            return false;
        }
        return true;

    },
    aux_login: function(sito, versione)
    {
        $.cookie('username', $('#username').val(), { expires: 7 });

        $("form#formLogin input#SITO").val(sito);
        $("form#formLogin input#VERSIONE").val(versione);

        if(NS_LOGIN.checkHostname())NS_LOGIN.login();

    },

    login: function()
    {
        NS_LOADING.showLoading({timeout: 0});

        var qs = $("form#formLogin").serialize();

        $.ajax({
            url: "Login",
            type: "POST",
            data: qs,
            cache: false,
            dataType: "text",
            timeout: 15000,

            success: function (response)
            {
                var resp = response.toString().split("$")[0];
                var msg = response.toString().split("$")[1];
                $("#errorMsg").show();

                switch (resp)
                {
                    //	Accesso negato
                    case 'KO':
                        $("#errorMsg").html(msg);
                        NS_LOADING.hideLoading();
                        if($("#codice").val() != "")
                        {
                            $("#codice").val("");
                        }
                        break;

                    //	L'utente risulta gia' loggato, chiede conferma per il logout forzato
                    case 'FF':
                        $("#errorMsg").html("Utente loggato su altra postazione");
                        var obj = jQuery.parseJSON(msg);
                        NS_LOADING.hideLoading();
                   /*  // Parte inutile se invece che il fialog metto la notifica
                       if(obj.IP ==  $("#nomeHost").val())
                        {
                            $("#forceLogout").val("S");
                            login();
                            //Sreturn;
                        }

                        if($("#codice").val() != "")
                        {
                            $("#username").val("");
                            $("#forceLogout").val("S");
                            login();
                            return;
                        }
                     */
                        if($("#codice").val() != "") {
                            $("#username").val("");
                        }
                            home.NOTIFICA.warning({title:'Attenzione', message:'Utente loggato su altra postazione'});
                            $("#forceLogout").val("S");
                            login();                  
                            NS_LOADING.hideLoading();
                        


                        //$("#dialog-btn_Continua").focus();


                        break;

                    //	Login corretto, redirect alla url ricevuta
                    case 'OK':
                        $("#errorMsg").hide();

                        var altezza = screen.availHeight;
                        var larghezza = screen.availWidth;
                        var finestra = null;

                        if(msg.indexOf("?") > 0)
                            msg += "&";
                        else
                            msg += "?";

                        msg += "SITO=" + $("#SITO").val() + "&VERSIONE=" + $("#VERSIONE").val();
                        msg += '&time=' + new Date().getTime();

                        if ($.browser.chrome || $.browser.ipad || $.browser.iphone || $.browser.safari || $.browser.mozilla)
                        {
                            window.location = msg;
                        }
                        else
                        {
                            finestra = window.open(msg, "main", "toolbar=no, menubar=no, resizable=no, height=" + altezza + ", width=" + larghezza + ",top=0,left=0,status=no,location=no");
                            if (finestra.name != "main")
                            {
                                chiudiHomepage();
                            }
                        }

                        break;

                    default:
                        $("#errorMsg").html("Errore: " + msg);
                        NS_LOADING.hideLoading();
                }

            },

            error: function (x, t, m)
            {
                var msg = "AJAX communication error.";
                if (t === "timeout")
                {
                    msg = "AJAX Timeout";
                }
                $("#errorMsg").html(msg);
                NS_LOADING.hideLoading();
            }
        });
    },

    focusUser: function()
    {
        if($.cookie('username') != null)
        {
            window.focus();
            $('#username').val($.cookie('username'))
            $('#password').focus();
        }
        else
        {
            window.focus();
            $("#username").focus();
        }
    }
}

var NS_CAMBIA_LOGIN = {

    cambiaPassword: function()
    {
        var frm = $(document.createElement('form'))
            .attr({"id": "frmDialog"})
            .append(
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtUsername", "id": "lblUsername"}).text(traduzione.cpUsername),
                $(document.createElement('input')).attr({"id": "txtUsername", "name": "txtUsername", "type": "text"}).val($('#username').val())
            ),
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtOldPassword", "id": "lblOldPassword"}).text(traduzione.cpOldPassword),
                $(document.createElement('input')).attr({"id": "txtOldPassword", "name": "txtOldPassword", "type": "password"}).val($('#password').val())
            ),
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtNewPassword", "id": "lblNewPassword"}).text(traduzione.cpNewPassword),
                $(document.createElement('input')).attr({"id": "txtNewPassword", "name": "txtNewPassword", "type": "password"})
            ),
            $(document.createElement('p')).append(
                $(document.createElement('label')).attr({"for": "txtConfirmPassword", "id": "lblConfirmPassword"}).text(traduzione.cpConfirmPassword),
                $(document.createElement('input')).attr({"id": "txtConfirmPassword", "name": "txtConfirmPassword", "type": "password"})
            ),
            $(document.createElement('div')).attr({"id": "cambiaPasswordErrorMsg", "class": "hide errorMsg"})
        );

        var txtUsername = frm.find('#txtUsername');
        var txtOldPassword = frm.find('#txtOldPassword');
        var txtNewPassword = frm.find('#txtNewPassword');
        var txtConfirmPassword = frm.find('#txtConfirmPassword');

        var dial = $.dialog(frm,
            {
                id: "dialogCambiaPassword",
                title: traduzione.cpTitolo,
                width: 250,
                showBtnClose: false,
                movable: true,
                buttons: [
                    {
                        label: traduzione.cpCambia, action: function (ctx)
                    {
                        NS_CAMBIA_LOGIN.checkCambiaPassword(dial, ctx.data.getForm())
                    }
                    },
                    {
                        label: traduzione.cpAnnulla, action: function (ctx)
                    {
                        ctx.data.close();
                    }
                    }
                ]
            });

        txtNewPassword.focus();

        if (txtOldPassword.val() == '')
            txtOldPassword.focus();

        if (txtUsername.val() == '')
            txtUsername.focus();

        $('#dialogCambiaPassword').on('keypress', 'input', function (e)
        {
            if (e.keyCode == 13)
            {
                NS_CAMBIA_LOGIN.checkCambiaPassword(dial,dial.getForm());
            }
        });
    },

    checkCambiaPassword: function(ctx, data)
    {
        var $d = $('#dialogCambiaPassword');

        var $msg = $d.find('#cambiaPasswordErrorMsg');
        $msg.hide();

        if(!data[0].value)
        {
            $msg.text(traduzione.errUsername).show();
            $d.find('#txtUsername').focus();

            return false;
        }

        if(!data[1].value)
        {
            $msg.text(traduzione.errOldP).show();
            $d.find('#txtOldPassword').focus();

            return false;
        }

        if(!data[2].value)
        {
            $msg.text(traduzione.errNewP).show();
            $d.find('#txtNewPassword').focus();

            return false;
        }

        if(!data[3].value)
        {
            $msg.text(traduzione.errConfirmP).show();
            $d.find('#txtConfirmPassword').focus();

            return false;
        }

        //  Controllo se new password e confirm password corrispondono
        if(data[2].value != data[3].value)
        {
            $msg.text(traduzione.errCorrisp).show();

            $d.find('#txtConfirmPassword').select()//.focus();

            return false;
        }

        NS_CAMBIA_LOGIN.dwrCambiaPassword(ctx, data);
    },

    dwrCambiaPassword: function(ctx, data)
    {
        NS_LOADING.showLoading({timeout: 0});

        var p_username = data[0].value;
        var p_old_password = data[1].value;
        var p_new_password = data[2].value;

        toolKitDB.cambiaPassword(p_username, p_old_password, p_new_password,
            {
                callback: function (response)
                {
                    NS_LOADING.hideLoading();

                    switch (response.result)
                    {
                        case 'OK':
                            NS_CAMBIA_LOGIN.okCambiaPassword(p_new_password, ctx);

                            break;

                        case 'KO':

                            NS_CAMBIA_LOGIN.koCambiaPassword(response.message);
                            break;
                    }
                },
                timeout: 5000,
                errorHandler: function (response)
                {
                    NS_LOADING.hideLoading();
                    NS_CAMBIA_LOGIN.koCambiaPassword(response);
                }
            });
    },

    okCambiaPassword: function(newPassword, ctx)
    {
        ctx.close();

        $('#password').val(newPassword);
        $("#errorMsg").html(traduzione.cpOk).show();

        NS_LOGIN.aux_login();
    },

    koCambiaPassword: function(message)
    {
        var $d = $('#dialogCambiaPassword');

        var $msg = $d.find('#cambiaPasswordErrorMsg');
        $msg.text(message).show();
    }
}


function login(){NS_LOGIN.login()};

/*
 * Metodo richiamato dall'Applet
 * Visualizza l'Errore di login con smartcard
 */
function SCError(msg)
{
    $("#errorMsg").show();
    $("#errorMsg").html(msg);
}

/*
 * Metodo richiamato dall'Applet
 * Effettua il login con smartcard
 */
function SCLogin(codice)
{
    $("#codice").val(codice);
    login();
}



function chiudiHomepage()
{
    if ($.browser.safari || navigator.userAgent.toLowerCase().indexOf("msie") != -1)
    {
        //IE 7 or Safari
        window.open('', '_self');
        window.close();
    }
    else if ($.browser.mozilla)
    {
        window.open('', '_parent', '');
        window.close();
    }
}
