var logger = "";
var finestra = "";
var nomehost = "";
var checkNomeHost = false;

var version = '1.6.0';

$(document).ready(function() 
{
	setVeloNero('content','div');
	if (deployJava.versionCheck('1.6.0_30+'))
	{
		if (properties["ATTIVA_APPLET"]=='S'){
			var $newobj = $('<OBJECT type="application/x-java-applet" height="0" width="0" id="ElcoApplet">'+
							'<param name="code" value="it.elco.applet.NomeHostSmartCard.class">'+
							'<param name="archive" value="std/app/SignedAppletHostSmartCard.jar">'+
							'</OBJECT>');
				$('body').append($newobj);
			/*fix focus su Chrome*/
			$newobj.focus();
		}else{
			$("#butSmart").show();
			$("#nomeHost").val(clsKillHomeJsObject.getHostName());
			removeVeloNero();
		}
	}else{
		$("#nomeHost").val(clsKillHomeJsObject.getHostName());
		removeVeloNero();
	}
	$("#username").focus();
	$('#username').keypress(function(event){
		if (event.keyCode == '13'){
			event.preventDefault();
			login();
		}
	});
	$('#password').keypress(function(event){
		if (event.keyCode == '13'){
			event.preventDefault();
			login();
		}
	});	
	$('#password').focus(function(){
		$(this).select();
	});
	$("#butLogin").click(function(){
		login();
	});

	$("#butCambiaPwd").click(function(){
		attivaCambiaPwd();
	});
	
	$("#butCambiaPwdOk").click(function(){
		CambiaPwd();
	});
	
	$("#butCambiaPwdAnnulla").click(function(){
		attivaLogin();
	});
	
	$("#butSmart").click(function(){
		logInComped();
	});

	/*Controllo se il comped è attivo*/
	if (properties["ATTIVA_COMPED"]=='S'){
		if (typeof $newobj != 'undefined')
			$("#butSmart").hide();
		else	
			$("#butSmart").show();
	}		
	$("#content").after('<div id="help"><a href="javascript:;" id="icoHelp"></a><p>Per assistenza tecnica (software) contattare il numero 338 7233938, oppure nei casi non urgenti inviare una mail all indirizzo support.cartella@elco.it</p></div>');
	$("#icoHelp").click(function(){
		$("#help p").toggle();
	});

	
/*	$("#errorMsg").html("ATTENZIONE:<br/> Il giorno 13/08/2012 sarà reso obbligatorio il cambio della password a tutti gli utenti che utilizzano la password predefinita. Per effettuare il cambio password, inserire il proprio utente e cliccare su \"Cambia Pwd\".");
	$("#errorMsg").show();*/
});

function logInComped()
{
	var dgst = new ActiveXObject("CCypher.Digest");
	var risposta=dgst.GetSmartCardProperty(16);
	eseguiLoginSmartcard(risposta);
}

function LoginSmartCard(cf)
{
	eseguiLoginSmartcard(cf);
}

function LogoutSmart()
{
	location.reload();
	try{
	finestra.close();
	}catch(e){}
}

function setHostName(nome_host, ip_rilevato, host_domain)
{
	var valore = '';
    if (typeof host_domain!='undefined' && host_domain!=''){
    	valore = host_domain;
    }
    if (valore == '' && typeof nome_host!='undefined' && nome_host!=''){
    	valore = nome_host;
    }
    if (valore != '') {
    	checkNomeHost = false;
        $("#nomeHost").val(valore); /*.toUpperCase()*/
    	removeVeloNero();
    }
	/*Nascondo il button del comped, l'applet ha finito la init()*/
	$("#butSmart").hide();
}

function loggerFunction()
{
	var log = "log="+logger;
	$.ajax({
        url: "LogAction", 
        type: "POST",
        data: log,     
        cache: false,
        dataType:"text",
         
        success: function (response) 
        {       
			var resp 	= response.toString().split("$")[0];
			var msg		= response.toString().split("$")[1];
        },
        error:function()
        {
            $("#errorMsg").html("Logger : AJAX communication error.");
        }
    });
	
	
}

function authentication(form, function_success) {
	var qs = $(form).serialize();
	$.ajax({
        url: "Authentication", 
        type: "POST",
        data: qs,     
        cache: false,
        dataType:"text",
         
        success: function_success,
        
        error: function() {
            $("#errorMsg").html("AJAX communication error.");
        }
    });
}

//	Richiama la servlet Authentication (fu executeLogin) che verifica la login
function login()
{
	authentication(
			"form#formLogin",
			function (response) {
				
				var resp 	= response.toString().split("$")[0];
				var msg		= response.toString().split("$")[1];
				
				switch(resp) {
					//	Accesso negato
					case 'KO':
						$("#errorMsg").html(msg);
						$("#errorMsg").show();
						break;
					case 'KP': // Password scaduta
						$("#errorMsg").html(msg);
						attivaCambiaPwd();
						$("#errorMsg").show();
						break;
					case 'KU': // Utente scaduto
						$("#errorMsg").html(msg);
						$("#errorMsg").show();
						break;
					case 'FF': //	L'utente risulta gia' loggato, chiede conferma per il logout forzato.
						$("#errorMsg").html("Utente già loggato");
						$("#errorMsg").show();
						var obj = jQuery.parseJSON(msg);
						
						if(confirm("Disconnettere utente già autenticato su\n" + obj.IP + "\n" + obj.DATA_ACCESSO + "\n" + obj.WEBSERVER + "?")) {
							$("#forceLogout").val("S");
							$("#errorMsg").html("forza logout e richiama login()");
							login();
						}
						break;
					
					//	Login corretto, redirect alla url ricevuta
					case 'OK':
						$("#errorMsg").html("OK - " + msg);
						$("#errorMsg").show();
						
						var altezza = screen.availHeight;
						var largh = screen.availWidth;
						
						if($.browser.chrome) {
							window.open('', '_self', '');
							window.close();
						}
						
						if($.browser.safari) {
							altezza = altezza - 100;
							largh = largh -10;
							
							var finestra = window.open(msg,"main","toolbar=no, menubar=no, resizable=no, height=" + altezza + ", width=" + largh + ",status=no");
						}
						else
							var finestra = window.open(msg,"main","toolbar=no, menubar=no, resizable=no, height=" + altezza + ", width=" + largh + ",top=0,left=0,status=no,location=no");
						
						if(finestra.name != "main") chiudiHomepage();
						
						break;
					default:
						$("#errorMsg").html("Errore: " + msg);
						$("#errorMsg").show();
				}
				
	        });
}

function chiudiHomepage()
{
    if($.browser.safari || navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1)
    {
        //IE 7 or Safari
        window.open('','_self');
        window.close();
    }
    else if($.browser.mozilla )
	{
    	window.open('', '_parent', '');
        window.close();
	}
    else
    {
        //IE 6 in giù...
        window.opener = null;
        self.close();
    }
}

function attivaCambiaPwd()
{
	if (properties["LOGIN_LDAP"]=='S'){
		alert('Per modificare la password premere su Ctrl-Alt-Canc e premere su Cambia Password');
		return;
	}
	$("#username_cambiapwd").val($("#username").val());
	$("#password_attuale").val($("#password").val());
	$("#form_cambia_pwd").show();
	$("#form_login").hide();
	$("#buttons_cambia_pwd").show();
	$("#buttons_login").hide();
	$("#errorMsg").hide();
	if($("#password_attuale").val().length == 0) {
		$("#password_attuale").focus();
	} else {
		$("#password_nuova").focus();
	}
}

function attivaLogin()
{
	$("#form_cambia_pwd").hide();
	$("#form_login").show();
	$("#buttons_cambia_pwd").hide();
	$("#buttons_login").show();
	$("#errorMsg").hide();
}

function CambiaPwd() {
	
	var username = $("#username_cambiapwd");
	var pwd = $("#password_attuale");
	var pwd_nuova = $("#password_nuova");
	var pwd_nuova_2 = $("#password_nuova_2");
	
	if (username.val().length == 0) {
		$("#errorMsg").html("Inserire il nome utente");
		attivaLogin();
		$("#errorMsg").show();
		$("#username").focus();
		return;
	}
	
	if (pwd.val().length == 0 || pwd_nuova.val().length == 0 || pwd_nuova_2.val().length == 0) {
		$("#errorMsg").html("Compilare tutti i campi password");
		$("#errorMsg").show();
		return;
	}
	
	if (pwd.val() == pwd_nuova.val()) {
		$("#errorMsg").html("La nuova password deve essere diversa dalla password attuale");
		$("#password_nuova").val("");
		$("#password_nuova_2").val("");
		$("#errorMsg").show();
		$("#password_nuova").focus();
		return;
	}
	
	if (pwd_nuova.val() != pwd_nuova_2.val()) {
		$("#errorMsg").html("Le password non corrispondono");
		$("#errorMsg").show();
		$("#password_nuova_2").focus();
		return;
	}
	
	authentication(
			"form#formCambiaPwd",
			function (response) {
				
				var resp 	= response.toString().split("$")[0];
				var msg		= response.toString().split("$")[1];
				
				$("#errorMsg").show();
				
				switch(resp) {
					case 'KO':
						$("#errorMsg").html(msg);
						break;
					case 'OK':
						if (confirm("Cambio password effettuato. Procedo al login?")) {
							attivaLogin();
							$("#username").val($("#username_cambiapwd").val());
							$("#password").val($("#password_nuova").val());
							login();
						} else {
							window.location.reload();
						}
						break;
					default:
						$("#errorMsg").html("Errore: " + msg);
				}
				
	        });
}

function getProfilo(parametro1,parametro2) {
	this.firstproperty=parametro1;
	this.secondproperty=parametro2;
}

function eseguiLoginSmartcard(cf)
{
	try
	{
		var qs = "codFisc=" + cf;
		$.ajax({
			url: "AuthenticationSiss", 
			type: "POST",
			data: qs,     
			cache: false,
			dataType:"text",
         
			success: function (response) 

			{   
				var resp 	= response.toString().split("$")[0];
				var msg		= response.toString().split("$")[1];

				$("#errorMsg").show();
				switch(resp)
				{
					//	Accesso negato
					case 'KO':
						logger=logger+" eseguiLoginSmartcard() - errore nel recupero del codice fiscale o nella parte ajax; "+msg+ " <!!!>";		
						$("#errorMsg").html(msg);
						break;
				
					//	Login corretto, redirect alla url ricevuta
					case 'OK':
						$("#errorMsg").hide();
						var webuser	= msg.split("#")[0];
						var psw		= msg.split("#")[1];
					
					//alert("webuser = " + webuser + "\nPassword = " + psw);
						$("#username").val(webuser);
						$("#password").val(psw);
						login();
						break;
					default:
						$("#errorMsg").html("Errore: "+resp + msg);
				}
			},
			error:function()

			{	
				logger=logger+" eseguiLoginSmartcard() - AJAX communication error. <!!!>";		
				$("#errorMsg").html("AJAX communication error.");
			}
		});
	}
	catch(e)
	{
		$("#errorMsg").show();

		logger=logger+" eseguiLoginSmartcard() - ERRORE COMPED: DESCRIZIONE: " + e.description +" NUMERO ERRORE: "+e.number +"<!!!>";		
		$("#errorMsg").html("Error: " + e.description);
	}
}


function setVeloNero(id,appendToElement) {
	//alert('setVeloNero');
	obj = document.getElementById(id);
	var objPosition = $(obj).position();
	var objWidth = $(obj).width();
	var objHeight = $(obj).height();
	var div = document.createElement('div');
	div.className='velonero';
	div.name=obj.id;
	//se typeof appendToElement==undefined lo appende al body(di solito su un iframe)
	if (typeof appendToElement=='undefined')
		document.body.appendChild(div);
	else
		obj.appendChild(div);
	$(div).css({'position':'absolute','top':objPosition.top,'left':objPosition.left});
	$(div).height(objHeight);
	$(div).width(objWidth);
}

function removeVeloNero() {
	$('div.velonero').remove();
};


