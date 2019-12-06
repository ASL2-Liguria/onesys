var posTop = 362;
var posLeft = 527;

var bolUserExists = false;
var bolPwdExpired = true;
var bolLoginExpired = true;

var focusOnPassword = false;

/*
 * Funzione per scrivere in homepage avvisi a tutti gli utenti
 */
function avvisi() {
/*	
	var avviso_title="24/07/2012 - Scadenza password";
	var avviso="ATTENZIONE: Il giorno <strong>06/08/2012</strong> sarà reso obbligatorio il cambio della password a tutti gli utenti che utilizzano la password predefinita." +
			"<br><br>Per effettuare ora il cambio password, inserire il proprio utente, la password attuale, e cliccare su <strong>Cambia Pwd</strong>.";
*/
	
	if (typeof avviso != 'undefined' && avviso != "") {
		var content = "";
		if (typeof avviso_title != 'undefined' && avviso_title != "")
			content = content + "<h3>" + avviso_title + "</h3>";
		content = content + '<p style="">' + avviso + '</p>';
		
		document.write('<div id="avvisi" style="');
		document.write('background: white;');
		document.write('position: absolute;');
		document.write('top: ' + (100) + ';');
		document.write('left: ' + (posLeft) + ';');
		document.write('width: ' + (500) + ';');
		document.write('padding: 1em;');
		document.write('border: red 2px solid;');
		document.write('">' + content + '</div>');
	}
}

function initGlobalObject() {
	
	var cssBackground=(window.location.pathname.toLowerCase().indexOf('/pianiterapeutici') >= 0) ?'backgroundPT':'backgroundRR';
	$('body').addClass(cssBackground);

	var ipRilevato = "";
	// setto gestione eventi per la password
	document.accesso.Password.onfocus = function() {
		focusOnPassword = true;
	};
	document.accesso.Password.onblur = function() {
		focusOnPassword = false;
	};
	// ***********
	initbaseGlobal();
	initbasePC();

	if (clsKillHome) {
		try {
			if (baseGlobal.USO_DHCP != "S") {
				document.accesso.ipPC.value = clsKillHome.getIpAddress();
			} else {
				document.accesso.ipPC.value = clsKillHome.getHostName();
			}
		} catch (e) {
			
		}
		document.all.lblInfoPolaris.innerText = document.all.lblInfoPolaris.innerText
				+ " - ip: " + document.accesso.ipPC.value;
	}

	document.accesso.UserName.focus();
	// fare chiamata a jscript per la creazione eventuale
	// del pulsante per la gestione della smartcard
	// recoverDataFromDb();
	var smart;
/*	if (baseGlobal.LOGIN_LDAP != "S") {
		try {
			dgst = new ActiveXObject("CCypher.Digest");
			startUpSmartCardManagement();
		} catch (e) {
		}
	}*/

	//
	fillLabels(arrayLabelName, arrayLabelValue);
	tutto_schermo();
/*	try {
		var oggetto;
		oggetto = document.getElementById("lblInfoPolaris");
		if (oggetto){
			oggetto.innerText = oggetto.innerText + " - Versione 2.0.0";
		}
	} catch (e) {
		alert("Can't set ris version");
	} */
	try {
		document.frmLogin.screenHeight.value = screen.height;
		document.frmLogin.screenWidth.value = screen.width;
	} catch (e) {
		alert(e.description);
	}

	avvisi();
}

function chiudiHomepage() {
	if (navigator.userAgent.toLowerCase().indexOf("msie 7") != -1
			|| navigator.userAgent.toLowerCase().indexOf("msie 8") != -1) {
		// IE 7...
		window.open('', '_self');
		window.close();
	} else {
		// IE 6 in giù...
		window.opener = null;
		self.close();
	}
}

// ************* FUNCTION IntercettaTasti
function intercetta_tasti() {
	// controllo se sto inserendo la pwd prima dell'utente
	if ((document.accesso.UserName.value == "") && (focusOnPassword == true)) {
		window.event.returnValue = false;
		alert(ritornaJsMsg("jsmsgFillLoginFirst"));
		document.accesso.UserName.focus();
		document.accesso.Password.value = "";
	}
	// ***
	if (window.event.keyCode == 13) {
		window.event.returnValue = false;
		autenticaLogin();
	}
}

// ************** FUNCTION SwitchLinkPwd
function switch_link_psw() {
	var utente = document.accesso.UserName.value;
	if (utente == "")
		return;
	// azzero a prescindere la password
	document.frm_check_pwd.holdPwd.value = "";
	document.accesso.Password.value = "";
	if (utente.toLowerCase() != "manager") {
		callExistUser(utente);
	} 
	else 
	{	
		if (baseGlobal.LOGIN_LDAP.toString().toUpperCase() == "S")
			abilitaCambioPassword(false);
		else
			abilitaCambioPassword(true);
	}

	/* codice aggiunto elena */
	/*
	 * document.accesso.action = 'classStartImagex'; document.accesso.target =
	 * '_self'; document.accesso.submit();
	 */
	/* fine elena */
	document.accesso.Password.focus();
}

// permette di abilitare
// il pulsante per il cambio password
function abilitaCambioPassword(valore) {
	if (valore) {
		document.getElementById("oLinkPsw").href = "javascript:mostraLayerCambioPwd()";
	} else {
		if (baseGlobal.LOGIN_LDAP.toString().toUpperCase() == "S")
			{
			document.getElementById("oLinkPsw").href = "javascript:ldapAlert()";}
		else
			{document.getElementById("oLinkPsw").href = "#";}
	}

}

function ldapAlert(){
	alert('Per modificare la password premere su Ctrl-Alt-Canc e premere su Cambia Password');
}

// ************ FUNCTION Ute_inesistente
function ute_inesistente() {
	alert(ritornaJsMsg("jsmsgUsrUnknow"));
	riattiva_login();
	document.accesso.UserName.focus();
}

// ************ FUNCTION FindObject

function MM_findObj(n, d) {
	var p, i, x;
	if (!d)
		d = document;
	if ((p = n.indexOf("?")) > 0 && parent.frames.length) {
		d = parent.frames[n.substring(p + 1)].document;
		n = n.substring(0, p);
	}
	if (!(x = d[n]) && d.all)
		x = d.all[n];
	for (i = 0; !x && i < d.forms.length; i++)
		x = d.forms[i][n];
	for (i = 0; !x && d.layers && i < d.layers.length; i++)
		x = MM_findObj(n, d.layers[i].document);
	if (!x && d.getElementById)
		x = d.getElementById(n);
	return x;
}

// ************ FUNCTION ShowHideLayer
function MM_showHideLayers() {
	var i, p, v, obj, args = MM_showHideLayers.arguments;
	for (i = 0; i < (args.length - 2); i += 3)
		if ((obj = MM_findObj(args[i])) != null) {
			v = args[i + 2];
			if (obj.style) {
				obj = obj.style;
				v = (v == 'show') ? 'visible' : (v == 'hide') ? 'hidden' : v;
			}
			obj.visibility = v;
		}
}

// ************ FUNCTION Riattiva_login
// resetta form per login
// mostra il layer per autenticazione
function riattiva_login() {

	var myIp = "";

	myIp = document.accesso.ipPC.value;
	document.accesso.reset();
	document.accesso.ipPC.value = myIp;
	document.frm_check_pwd.reset();
	document.frm_check_pwd.holdPwd.value = "";
	document.all.oLayPwd.style.posTop = 0;
	document.all.oLayPwd.style.posLeft = 0;
	bolUserExists = false;
	bolPwdExpired = true;
	bolLoginExpired = true;

	MM_showHideLayers('oLayPwd', '', 'hide', 'oLayMain', '', 'show',
			'oLayPwd_manager', '', 'hide');
	document.accesso.UserName.focus();
}

// funzione che gestisce la
// visualizzazione dei livelli per
// il cambio password
function mostraLayerCambioPwd() {
	// nascondo livello principale e mostro il cambia pwd");
	if (document.accesso.UserName.value == "manager") {
		document.all.oLayPwd_manager.style.posTop = posTop;
		document.all.oLayPwd_manager.style.posLeft = posLeft;
		MM_showHideLayers('oLayPwd', '', 'hide', 'oLayMain', '', 'hide',
				'oLayPwd_manager', '', 'show');
		document.frm_check_pwd_manager.oldPwd.focus();
	} else {
		// carico vecchia password
		callGetFlatPwd(document.accesso.UserName.value);
		document.all.oLayPwd.style.posTop = posTop;
		document.all.oLayPwd.style.posLeft = posLeft;
		MM_showHideLayers('oLayPwd', '', 'show', 'oLayMain', '', 'hide',
				'oLayPwd_manager', '', 'hide');
		document.frm_check_pwd.oldPwd.focus();
	}
}

// funzione che richiama la servlet incaricata del controllo
// dell corretta procedura del cambio pwd
function cambiaPassword() {

	var holdPwd = document.frm_check_pwd.holdPwd.value;
	var oldPwd = document.frm_check_pwd.oldPwd.value;
	var newPwd = document.frm_check_pwd.newPwd.value;
	var newPwd2 = document.frm_check_pwd.newPwd2.value;
	var pwd_manager = document.frm_check_pwd_manager.oldPwd.value;
	var nlicenze = document.frm_check_pwd_manager.nlicenze.value;
	if (document.accesso.UserName.value == "manager") {
		if (pwd_manager == "") {
			alert(ritornaJsMsg("jsmsgPwdEmpty"));
			document.frm_check_pwd_manager.oldPwd.focus();
			return;
		}
		callCheckManagerPwd(pwd_manager);
		return;
	}
	// controllo che non siano vuote");
	if (oldPwd == "") {
		alert(ritornaJsMsg("jsmsgInsOldPwd"));
		document.frm_check_pwd.oldPwd.focus();
		return;
	}
	if (newPwd == "") {
		alert(ritornaJsMsg("jsmsgInsNewPwd"));
		document.frm_check_pwd.newPwd.focus();
		return;
	}
	if (newPwd2 == "") {
		alert(ritornaJsMsg("jsmsgRptPwd"));
		document.frm_check_pwd.newPwd2.focus();
		return;
	}
	if (oldPwd != holdPwd) {
		alert(ritornaJsMsg("jsmsgOldPwdErr"));
		document.frm_check_pwd.oldPwd.focus();
		return;
	}
	if (oldPwd == newPwd) {
		alert(ritornaJsMsg("jsmsgOldNewPwdErr"));
		document.frm_check_pwd.newPwd.focus();
		return;
	}
	if (baseGlobal.VERIFICA_LUNGH_PW == "S") {
		if (newPwd.length < 8) {
			alert(ritornaJsMsg("jsmsg8minChar"));
			document.frm_check_pwd.newPwd.focus();
			return;
		}
	}
	s = newPwd;
	i = 0;
	esci = 0;
	while (i < s.length && esci == 0) {
		ch = s.substr(i, 1);
		if ((ch > "@" && ch < "[") || (ch > "/" && ch < ":")
				|| (ch > "'" && ch < "{")) {
			esci = 0;
		} else {
			esci = 1;
		}
		i++;
	}

	if (esci == 1) {
		alert(ritornaJsMsg("jsmsgAlphaPwd"));
		document.frm_check_pwd.newPwd.focus();
		return;
	}
	if (newPwd != newPwd2) {
		alert(ritornaJsMsg("jsmsgNewPwdErr"));
		document.frm_check_pwd.newPwd2.focus();
		return;
	}
	callChangeUserPassword(document.accesso.UserName.value, newPwd);
}

// ************ FUNCTION autenticaLogin

function autenticaLogin() {

	var utente = document.accesso.UserName.value;
	var pwd = document.accesso.Password.value;

	if ((utente == "") || (pwd == "")) {
		alert(ritornaJsMsg("jsmsgPwdUsrEmpty"));
		return;
	}
	if (utente.toLowerCase() == "manager") {
		callCheckManagerPwd(pwd);
	} else {
		if (bolLoginExpired) {
			alert(ritornaJsMsg("jsmsgUsrExpired"));
			return;
		}
		if (bolPwdExpired) {
			alert(ritornaJsMsg("jsmsgPwdExpired"));
			return;
		}
		if (baseGlobal.VERIFICA_LUNGH_PW == "S") {
			if (pwd.length < 8) {
				alert(ritornaJsMsg("jsmsg8minChar"));
				return;
			}
		}

		/*
		 * Controllo PC
		 */
		var nomePc = document.accesso.ipPC.value;
		if (nomePc == "") {
			return;
		}
		try {
			ajaxPcManage.ajaxPcCheck(
					nomePc,
					function(returnValue) {
						var utente;
						var pwd;

						if (returnValue) { // esiste il pc
							/*
							 * Controllo Utente
							 */
							utente = document.accesso.UserName.value;
							pwd = document.accesso.Password.value;

							if (utente == "") {
								return;
							}

							try {
								callCheckUserPwd(utente, pwd);
							} catch (e) {
								alert("Error: " + e.description);
							}
						} else {
							// KO non esiste il pc
							alert(ritornaJsMsg("jsmsgPcNotExist"));
							return;
						}
					});
		} catch (e) {
			alert("Controllo PC - " + e.description);
		}
	}
}

function callCheckUserPwd(utente, pwd) {
	// autenticazione classica
	if (baseGlobal.LOGIN_LDAP.toString().toUpperCase() != "S") {
		ajaxUserManage.ajaxCheckUserPwd(
				utente,
				pwd,
				function(returnValue) {
					var altezza = screen.availHeight;
					var largh = screen.availWidth;

					var utente = document.accesso.UserName.value;
					var ip = document.accesso.ipPC.value;

					if (returnValue) {
						callGetIndexUtenteDifferenteIp(utente, ip);
					} else {
						// errore
						alert(ritornaJsMsg("jsmsgLoginErr"));
						document.accesso.Password.value = "";
						document.accesso.Password.focus();
					}
				});
	} else {
		// autenticazione LDAP
		ajaxManageLDAP.checkAuthenticationByLdap(
				baseGlobal.IP_SERVER_LDAP,
				baseGlobal.SERVER_PORT_LDAP,
				baseGlobal.BASE_DN_LDAP,
				baseGlobal.SSL_TYPE_LDAP,
				baseGlobal.KEYSTORE_LDAP, utente,
				pwd, baseGlobal.LDAP_KEYSTORE_PWD,
				function(returnValue) {
					var altezza = screen.availHeight;
					var largh = screen.availWidth;
					var listaInfo;

					var ldapLoginDaysLeft = "";
					var ldapPwdDaysLeft = "";

					listaInfo = returnValue.split("*");

					if (listaInfo[0].toString().toUpperCase() == "OK") {

						// devo verificare scadenza utente e password
						// baseGlobal.LDAPWARNINGDAYS_PWDEXPIRED
						ldapLoginDaysLeft = listaInfo[1];
						ldapPwdDaysLeft = listaInfo[2];
						try {
							if (parseInt(ldapPwdDaysLeft) <= 7) {
								alert("Attenzione: la password scadrà tra: " + ldapPwdDaysLeft);
							}
						} catch (e) {
							// impossibile convertire in numero
							alert("replyCheckAuthenticationByLdap - Error: " + e.description);

						}

						// autenticazione corretta
						// devo aggiornare la password in locale per tenerla allineata
						callChangeUserPassword(document.accesso.UserName.value,
								document.accesso.Password.value);
					} else {
						// errore
						alert(ritornaJsMsg("jsmsgLoginErr") + " \n" + listaInfo[1]);
						document.accesso.Password.value = "";
						document.accesso.Password.focus();
					}
				});
	}
}

// *************************************
// **************************
// ******** AJAX ************
// **************************

// controlla se utente esiste
function callExistUser(utente) {

	if (utente == "") {
		return;
	}
	try {
		ajaxUserManage.ajaxExistUser(
						utente,
						function(returnValue) {

							var utente = document.accesso.UserName.value;

							bolUserExists = returnValue;

							if (utente == "") {
								return;
							}
							if (returnValue) {
								// esiste
								document.frm_check_pwd.utente.value = document.accesso.UserName.value;
								// abilito link per cambio password
								// controllo se la login è ldap o meno. Se lo è, disabilito il cambia password
								if (baseGlobal.LOGIN_LDAP.toString().toUpperCase() == "S"){
									abilitaCambioPassword(false);
									bolLoginExpired = false;
									bolPwdExpired = false;
								}
								else
									abilitaCambioPassword(true);
								// controllo se utente scaduto
								callLoginExpired(document.accesso.UserName.value);
							} else {
								abilitaCambioPassword(false);
								ute_inesistente();
								return;
							}

						});
	} catch (e) {
		alert("callExistUser - " + e.description);
	}
}

// ******* ritorna password in chiaro
function callGetFlatPwd(utente) {
	if (utente == "") {
		return;
	}
	try {
		ajaxUserManage.ajaxGetFlatPwd(utente, function(returnValue) {
			document.frm_check_pwd.holdPwd.value = returnValue;
		});
	} catch (e) {
		alert("callGetFlatPwd - " + e.description);
	}

}

// metodo che controlla se pwd è scaduta
function callPasswordExpired(utente) {

	if (utente == "") {
		return;
	}
	try {
		ajaxUserManage.ajaxPasswordExpired(utente, function(returnValue) {
			bolPwdExpired = returnValue;
			if (returnValue == true) {
				document.frm_check_pwd.password_scaduta.value = "S";
				alert(ritornaJsMsg("jsmsgPwdExpired"));
			} else {
				document.frm_check_pwd.password_scaduta.value = "N";
			}
		});
	} catch (e) {
		alert("callPasswordExpired Error: " + e.description);
	}

}

// metodo che che controlla se l'utente è stato disattivato
function callLoginExpired(utente) {

	if (utente == "") {
		return;
	}
	try {
		// controllo utente expired
		ajaxUserManage.ajaxLoginExpired(utente, function(returnValue) {
			var utente = document.accesso.UserName.value;

			bolLoginExpired = returnValue;
			
			if (returnValue == true) {
				document.frm_check_pwd.utente_scaduto.value = "S";
				alert(ritornaJsMsg("jsmsgUsrExpired"));
				riattiva_login();
				return;
			} else {
				document.frm_check_pwd.utente_scaduto.value = "N";
				// controllo se password scaduta
				callPasswordExpired(utente);
			}

		});
	} catch (e) {
		alert("callLoginExpired - " + e.description);
	}
}

// metodo per il cambio password
function callChangeUserPassword(utente, pwd) {
	if ((utente == "") || (pwd == "")) {
		return;
	}

	try {
		if (baseGlobal.LOGIN_LDAP.toString().toUpperCase() != "S") {
			ajaxUserManage.ajaxChangeUserPassword(
					utente,
					pwd,
					function(returnValue) {
						if (returnValue) {
							// tutto ok
							// riporto vecchia password
							document.frmLogin.vecchiaPwd.value = document.frm_check_pwd.holdPwd.value;
							// segnalo il cambio login
							document.frmLogin.cambioPwd.value = "S";
							// ***
							bolPwdExpired = false;
							// fare cambio layer
							MM_showHideLayers('oLayPwd', '', 'hide',
									'oLayMain', '', 'show',
									'oLayPwd_manager', '', 'hide');
							// copia incolla pwd corretta
							document.accesso.Password.value = document.frm_check_pwd.newPwd.value;
							// forzare autenticazione
							autenticaLogin();
						} else {
							// problemi
							bolPwdExpired = true;
							alert(ritornaJsMsg("jsmsgPwdUpdErr"));
						}
					});
		} else {
			// LDAP
			ajaxUserManage.ajaxChangeUserPassword(
					utente,
					pwd,
					function(returnValue) {

						if (returnValue) {
		
							var utente = document.accesso.UserName.value;
							var ip = document.accesso.ipPC.value;
		
							callGetIndexUtenteDifferenteIp(utente, ip);
						} else {
							// problemi
							alert(ritornaJsMsg("jsmsgPwdUpdErr"));
						}
					});
		}
	} catch (e) {
		alert("Error: " + e.description);
	}
}

function callCheckManagerPwd(pwd) {
	if (pwd == "") {
		return;
	}
	try {
		ajaxUserManage.ajaxCheckManagerPwd(pwd, function(returnValue) {
			if (returnValue) {
				startup();
			} else {
				// KO
				alert(ritornaJsMsg("jsmsgLoginErr"));
				document.accesso.Password.value = "";
				document.accesso.Password.focus();
			}
		});
	} catch (e) {
		alert("Error: " + e.description);
	}
}

// funzione
// per controllare se l'utente
// è già loggato su un differente ip
function callGetIndexUtenteDifferenteIp(utente, ip) {
	try {
		ajaxGetIndexUtenteDifferenteIp.getIndexUtenteDifferenteIp(utente, ip,
				function(returnValue) {
					var listaInfo;
					var webUser = "";
					var webServer = "";
					var ip = "";
					var dataAccesso = "";
					var nome_host = "";
					var indiceIp;
					var descrUtente = "";

					listaInfo = returnValue.split("*");
					try {
						// parsing
						indiceIp = parseInt(listaInfo[0]);
						webUser = listaInfo[1];
						ip = listaInfo[2];
						dataAccesso = listaInfo[3];
						webServer = listaInfo[4];
						nome_host = listaInfo[5];
						descrUtente = listaInfo[6];
						// returnValue = -1
						// se NON è stato trovato
						if (indiceIp != -1) {
							// trovato loggato su un altro ip

							if (!confirm(ritornaJsMsg("jsmsgAlreadyLogged")
									+ ip + " " + dataAccesso + " " + webServer
									+ " ?")) {
								return;
							} else {
								startup();
							}
						} else {
							// utente NON trovato
							// su altre postazioni
							// quindi proseguo
							startup();
						}
					} catch (e) {
						alert("replyGetIndexUtenteDifferenteIp - "
								+ e.description);
					}
				});
	} catch (e) {
		alert("Error: " + e.description);
	}
}

function startup() {

	var altezza = screen.availHeight;
	var largh = screen.availWidth;

	var array_utenti_for_demo = new Array('');

	for ( var i = 0; i < array_utenti_for_demo.length; i++)
		if (document.accesso.UserName.value == array_utenti_for_demo[i]) {
			var a = window.showModalDialog(
					"modalUtility/sceltaSezioneWhale.html",
					document.accesso.UserName.value, "dialogHeight:"
							+ (screen.availHeight) + "px;dialogWidth:"
							+ (screen.availWidth)
							+ "px;dialogLeft:0px;dialogTop:0px;scroll:no");
		}

	document.frmLogin.utente.value = document.accesso.UserName.value;
	document.frmLogin.psw.value = document.accesso.Password.value;
	document.frmLogin.ipRilevato.value = document.accesso.ipPC.value;
	
	var url=(window.location.pathname.toLowerCase().indexOf('/pianiterapeutici') >= 0) ?'SL_RicercaPazienteFrameset?rf1%3D112%26rf2%3D%2A%26rf3%3D0%26provenienza%3DPianiTerapeutici%26tipo_ricerca%3D8':'SL_RicercaPazienteFrameset?rf1%3D112%26rf2%3D%2A%26rf3%3D0%26provenienza%3DRicettaRossa%26tipo_ricerca%3D8';
	var finestra = window.open("", "CR_wndMain",
			"toolbar=no, menubar=no, resizable=yes, height=" + altezza
					+ ", width=" + largh + ",top=0,left=0,status=yes");
	if (finestra) {
		finestra.focus();
	}
	document.frmLogin.action = 'inizioServlet?load='+url;
	document.frmLogin.submit();
}

// carica on the fly un js esterno
// ATTENZIONE
// il file esterno NON può essere caricato
// e subito richiamata una sua funzione
// per via dei tempi di caricamento
// quindi è necessario fare una chiamata ritardata ad una funzione
// che viene "temporizzata" dopo il caricamento
// 
function dhtmlLoadScript(url, idScript, functionToCallAfter) {
	var fileref;
	try {
		fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", url);
		// fileref.text = "function nuovoAlert() {alert('hello world');}";
		fileref.setAttribute("id", idScript);
		fileref.onreadystatechange = function extFileLoaded() {
			toDoAfter(idScript, functionToCallAfter);
		};
		document.getElementsByTagName("head").item(0).appendChild(fileref);
	} catch (e) {
		alert("Error: " + e.description);
	}
	return false;
}

// gestisce cosa fare
// quando il file esterno è stato caricato
function toDoAfter(idFileScript, toDoAfter) {
	var oggetto;

	if (toDoAfter == "") {
		return;
	}

	try {
		oggetto = document.getElementById(idFileScript);
		if (oggetto.readyState != "loading") {
			eval(toDoAfter);
		}
	} catch (e) {
		;
	}
}
// funzione che inizializza e crea
// gli eventuali controlli per la smart card
function startUpSmartCardManagement() {
	// recoverDataFromDb();
	var abilita = "S";
	var jsFile = "std/jscript/smartcard/siss.js";

	// controllo se è abilitata la smartcard sul pc
	if (abilita == "S") {
		// if (basePC.ABILITA_LOGIN_SMART_CARD=="S"){
		// tiro su dinicamicamente il jscript che gestisce
		// l'autenticazione della smartcard
		// NB questo file DOVRA' avere una "sorta" di interfaccia
		// comune a tutti i tipo di integrazione con smartcard
		// if (basePC.JS_FILE_SMART_CARD==""){
		if (jsFile == "") {
			// nessuna gestione SMART_CARD
			alert("CONFIGURA_PC.JS_FILE_SMART_CARD is not defined");
			return;
		}
		dhtmlLoadScript(jsFile, "idScriptSmartCard",
				"initSmartCardManagement()");
	} else {
		alert("CONFIGURA_PC.ABILITA_LOGIN_SMART_CARD is not defined");
		return;
	}
}

// dopo aver caricato
// il file esterno viene inizializzato il
// pulsante per la gestione
function initSmartCardManagement() {
	var linkToCall = '';
	// la funzione js da chiamare
	// sul click del pulsante può essere ritornata
	// da un funzione definita per ogni JS linkato al volo
	try {
		linkToCall = getJsFunctionToCall();
	} catch (e) {
		alert(" initSmartCardManagement.getJsFunctionToCall - " + e.description);
	}
	if (linkToCall == "") {
		// alert(ritornaJsMsg("jsmsgNoLinkSmartCard"));
		return;
	}
	addButtonToFirstRow('UP', linkToCall);
	// carico testo
	// del pulsante della smartcard
	initLabelButtonSmartCard("idLinkSmartCard");
}

// funzione che aggiunge al volo
// un pulsante alla prima riga
// il parametro rigaValue
// può essere UP o DOWN (prima o seconda riga)
function addButtonToFirstRow(rigaValue, linkButton) {
	// aggiungo cella alla fine della riga
	var trObject;

	if (rigaValue.toUpperCase() == "UP") {
		trObject = document.getElementById("trFirstRowLogin");
	} else {
		trObject = document.getElementById("trSecondRowLogin");
	}
	if (trObject) {
		var tdObject = trObject.insertCell(-1);
		tdObject.className = "LoginButton";
		var pulsante = getButton("idLinkSmartCard", linkButton);
		tdObject.insertBefore(pulsante);
	} else {
		alert(ritornaJsMsg("jsmsgNoRow") + " " + rigaValue);
	}
}

function initLabelButtonSmartCard(id) {

	var objectNode;
	var testo;

	objectNode = document.getElementById(id)
	if (objectNode) {
		testo = ritornaJsMsg(id);
		objectNode.innerText = testo;
	}
}

// funzione che ritorna l'oggetto
// pulsante da gestire
function getButton(idValue, hrefValue) {

	// esempio
	//	<div class='pulsante'><a id='oLinkPsw' href='#'></a></div>

	var divObject;
	var aObject;

	divObject = document.createElement("DIV");
	divObject.className = "pulsante";

	aObject = document.createElement("A");
	aObject.id = idValue;
	aObject.href = hrefValue;

	divObject.appendChild(aObject);

	return divObject;
}

