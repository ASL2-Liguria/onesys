

var finestra_principale="";
var posTop = 362;
var posLeft = 527;

var bolUserExit = false;
var bolPwdExpired = true;
var bolLoginExpired = true;

var focusOnPassword = false;
// variabile usata per sapere
// quale azione l'utente manager
// vuole fare dopo la verifica
// della passwrd (LICENCE/LOGIN)
var strAzioneManager="LOGIN";


// funzione che ritorna 
// l'ip del client
function getIPclient(){
	
	var strOutput = "";
	try{
		if (baseGlobal.USAOCXKILLHOME=="S"){		
			if (document.all.clsKillHome){
				strOutput = document.all.clsKillHome.getIpAddress();
			}
			else{return "";}
		}
		else{		
			if (clsKillHomeJsObject){
				strOutput = clsKillHomeJsObject.getIpAddress();
			}
			else{return "";}
		}

		
	}
	catch(e){
		;
	}
	return strOutput;	
}

// funzione che ritorna
// l'host name del client
function getHostNameClient(){
	var strOutput = "";
	
	try{
		// clsKillHomeJsObject
		if (baseGlobal.USAOCXKILLHOME=="S"){
			strOutput = document.all.clsKillHome.getHostName(getIPclient());
		}
		else{
			strOutput = clsKillHomeJsObject.getHostName()
		}
	}
	catch(e){
		;
	}
	return strOutput;
}


// modifica del 17-2-2015
function cleanCache(){
	try{
		var strToExecute = "RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 8";
		if (baseGlobal.USAOCXKILLHOME=="S"){
			document.all.clsKillHome.openShell(strToExecute,0);
		}
		else{
			clsKillHomeJsObject.openShell(strToExecute,0);
		}
	}
	catch(e){;}			
}
// **************
function initGlobalObject(){
	
	var ipRilevato = "";
	// setto gestione eventi per la password
	document.accesso.Password.onfocus = function(){focusOnPassword=true;}
	document.accesso.Password.onblur = function(){focusOnPassword=false;}	
	// ***********
	initbaseGlobal();
	initbasePC();
	initPage();
	// modifica del 17-2-2015
	try{cleanCache(); }catch(e){;}  
	// **************
	try{
		document.frmLogin.screenHeight.value = screen.height;
		document.frmLogin.screenWidth.value = screen.width;	
	}
	catch(e){
		document.frmLogin.screenHeight.value = 1024;
		document.frmLogin.screenWidth.value = 768;	
	}
	// controllo cambio pwd
	controlloCambioPwd();
	// ***

	if (baseGlobal.USO_DHCP!="S"){
		document.accesso.ipPC.value = getIPclient();
	}
	else{
		document.accesso.ipPC.value = getHostNameClient();			
	}
	document.all.lblInfoPolaris.innerText = document.all.lblInfoPolaris.innerText + " - ip: " + document.accesso.ipPC.value;
	callGetNumLicences();

	document.accesso.UserName.focus();		
	// fare chiamata a jscript per la creazione eventuale
	// del pulsante per la gestione della smartcard
	startUpSmartCardManagement();
	fillLabels(arrayLabelName,arrayLabelValue);
	tutto_schermo();	
	try{getRisVersion();}catch(e){alert("Can't set ris version");}

}

function controlloCambioPwd(){
	try{
		if (baseGlobal.MOSTRA_CAMBIA_PWD!="S"){
			document.getElementById("oLinkPsw").parentNode.style.visibility = "hidden";
		}
	}
	catch(e){
		alert("controlloCambioPwd - Error: " + e.description);
	}
			 
}

function initPage(){
	window.onunload = function scaricaHomepage(){scarica();};	
}
		
function chiudiHomepage(){
    if(navigator.userAgent.toLowerCase().indexOf("msie 7") != -1 || navigator.userAgent.toLowerCase().indexOf("msie 8") != -1)
    {
        //IE 7...
        window.open('','_self');
        window.close();
    }
    else
    {
        //IE 6 in giù...
        window.opener = null;
        self.close();
    }
}

// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	// controllo se sto inserendo la pwd prima dell'utente
	if ((document.accesso.UserName.value=="")&&(focusOnPassword==true)){
		window.event.returnValue=false;
  	    alert(ritornaJsMsg("jsmsgFillLoginFirst"));		
		document.accesso.UserName.focus();
		document.accesso.Password.value = "";
	}
	// ***
	 if (window.event.keyCode==13)
	 {
		 window.event.returnValue=false;
		 autenticaLogin();
	 }
}




// ************** FUNCTION SwitchLinkPwd
function switch_link_psw(){
	
	var utente = "";
	

	
	utente = document.accesso.UserName.value;
	// azzero a prescindere la password
    document.frm_check_pwd.holdPwd.value = "";	
	document.accesso.Password.value = "";
	if (utente.toLowerCase()!="manager"){
		// deprecato !!!
		callExistUser(utente);
		// 20100907 aggiunto
		 document.frm_check_pwd.utente.value = document.accesso.UserName.value;		
		 // abilito link per cambio password
		abilitaCambioPassword(true);
	}
	else{
		abilitaCambioPassword(true);		 
	}


	/*codice aggiunto elena*/
/*	document.accesso.action = 'classStartImagex';
	document.accesso.target = '_self';
	document.accesso.submit();
	*/
	/*fine elena*/
	 document.accesso.Password.focus();
}

// permette di abilitare
// il pulsante per il cambio password
function abilitaCambioPassword(valore){
	if (valore==""){return;}
	if (valore){
		document.getElementById("oLinkPsw").href = "javascript:mostraLayerCambioPwd()";
	}
	else{
		document.getElementById("oLinkPsw").href = "#";		
	}
		
}



// ************ FUNCTION Ute_inesistente
function ute_inesistente(){
   	alert(ritornaJsMsg("jsmsgUsrUnknow"));	
	riattiva_login();
	document.accesso.UserName.focus();
}

// ************ FUNCTION FindObject

function MM_findObj(n, d) {
var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
if(!x && d.getElementById) x=d.getElementById(n); return x;
}

// ************ FUNCTION ShowHideLayer
function MM_showHideLayers() {
var i,p,v,obj,args=MM_showHideLayers.arguments;
for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
obj.visibility=v; }
}

// ************ FUNCTION Riattiva_login
// resetta form per login
// mostra il layer per autenticazione
function riattiva_login(){
	
	var myIp = "";
		
	myIp = document.accesso.ipPC.value;
	document.accesso.reset();
	document.accesso.ipPC.value = myIp;
	document.frm_check_pwd.reset();
	document.frm_check_pwd.holdPwd.value = "";
	document.all.oLayPwd.style.posTop = 0;
	document.all.oLayPwd.style.posLeft = 0;
	bolUserExit = false;
	bolPwdExpired = true;
	bolLoginExpired = true;	 
	
	MM_showHideLayers('oLayPwd','','hide','oLayMain','','show','oLayPwd_manager','','hide');
	document.accesso.UserName.focus();
}

// funzione che gestisce la
// visualizzazione dei livelli per
// il cambio password
function mostraLayerCambioPwd(){
	try{
		// nascondo livello principale e mostro il cambia pwd");
		if (document.accesso.UserName.value=="manager"){
			 document.all.oLayPwd_manager.style.posTop = posTop;
			 document.all.oLayPwd_manager.style.posLeft = posLeft;
			MM_showHideLayers('oLayPwd','','hide','oLayMain','','hide','oLayPwd_manager','','show');
			document.frm_check_pwd_manager.oldPwd.focus();
		}
		else{
			// carico vecchia password
			callGetFlatPwd(document.accesso.UserName.value);
			document.all.oLayPwd.style.posTop = posTop;
			document.all.oLayPwd.style.posLeft = posLeft;
			MM_showHideLayers('oLayPwd','','show','oLayMain','','hide','oLayPwd_manager','','hide');
			document.frm_check_pwd.oldPwd.focus();
		}
	}
	catch(e){
		alert("mostraLayerCambioPwd - Error: " + e.description);
	}
}



// funzione che richiama la servlet incaricata del controllo
// dell corretta procedura del cambio pwd
function cambiaPassword(){

	var holdPwd = document.frm_check_pwd.holdPwd.value;
	var oldPwd = document.frm_check_pwd.oldPwd.value;
	var newPwd = document.frm_check_pwd.newPwd.value;
	var newPwd2 = document.frm_check_pwd.newPwd2.value;
	var pwd_manager = document.frm_check_pwd_manager.oldPwd.value;
	var nlicenze = document.frm_check_pwd_manager.nlicenze.value;
	
	
	try{
		if (document.accesso.UserName.value=="manager"){
			 if (pwd_manager==""){
				 alert(ritornaJsMsg("jsmsgPwdEmpty"));			 
				 document.frm_check_pwd_manager.oldPwd.focus();
				 return;}
			 if ((nlicenze=="")||(isNaN(nlicenze))){
				 alert(ritornaJsMsg("jsmsgLicNumber"));
				 document.frm_check_pwd_manager.nlicenze.focus();
				 return;}
			 // devo controllare che la pwd sia corretta
			 strAzioneManager = "LICENCE";
			 callCheckManagerPwd(pwd_manager);
			 return;
		}
		//controllo che non siano vuote;
		if (oldPwd==""){
			alert(ritornaJsMsg("jsmsgInsOldPwd"));
			document.frm_check_pwd.oldPwd.focus();
			return;}
		if (newPwd==""){
			alert(ritornaJsMsg("jsmsgInsNewPwd"));		
			document.frm_check_pwd.newPwd.focus();
			return;}
		if (newPwd2==""){
			alert(ritornaJsMsg("jsmsgRptPwd"));				
			document.frm_check_pwd.newPwd2.focus();
			return;}
		
		if (oldPwd!=holdPwd){
			alert(ritornaJsMsg("jsmsgOldPwdErr"));						
			document.frm_check_pwd.oldPwd.focus();
			return;}
		// controllo differenza tra vecchia password e quella nuova
		if (oldPwd==newPwd){
			alert(ritornaJsMsg("jsmsgOldNewPwdErr"));					
			document.frm_check_pwd.newPwd.focus();
			return;}
		if (baseGlobal.VERIFICA_LUNGH_PW=="S"){
			if (newPwd.length<8){
				alert(ritornaJsMsg("jsmsg8minChar"));			
				document.frm_check_pwd.newPwd.focus();
				return;}
		}
		s=newPwd; i=0; esci=0;
		while (i<s.length && esci==0){
			ch=s.substr(i,1);
			if ((ch>"@" && ch<"[") || (ch>"/" && ch<":") || (ch>"'" && ch<"{")){
				 esci=0;
			 }
			 else{
				 esci=1;
			 }
			 i++;
		}
		// controllo che non ci siano caratteri strani
		if (esci==1){
			alert(ritornaJsMsg("jsmsgAlphaPwd"));			
			document.frm_check_pwd.newPwd.focus();
			 return;}
		// controllo differenza tra nuova pwd e conferma della stessa
		if (newPwd!=newPwd2){
			alert(ritornaJsMsg("jsmsgNewPwdErr"));					
			document.frm_check_pwd.newPwd2.focus();
			return;}
	//	callChangeUserPwdAndOldOne(document.accesso.UserName.value , oldPwd , newPwd);
		callChangeUserPassword(document.accesso.UserName.value,newPwd);
	}
	catch(e){
		alert("cambiaPassword - Error: " + e.description);
	}
}

// ************ FUNCTION autenticaLogin
        
function autenticaLogin(){
	
	var utente="";
	var pwd = "";
	
	
	utente = document.accesso.UserName.value;
	pwd = document.accesso.Password.value;
	if ((utente=="")||(pwd=="")){
    	alert(ritornaJsMsg("jsmsgPwdUsrEmpty"));
		return ;
	}
	if (utente.toLowerCase() =="manager"){
		strAzioneManager = "LOGIN";
		callCheckManagerPwd(pwd);
	}
	else{
		if (baseGlobal.LOGIN_LDAP.toString().toUpperCase()!="S"){
			// effetto i controlli se e solo
			// se NON sono nel caso di LDAP
			// in tal caso lascio ad LDAP il controllo
			/*
			if (bolLoginExpired){
				alert(ritornaJsMsg("jsmsgUsrExpired"));			
				return;
			}		
			if (bolPwdExpired){
				alert(ritornaJsMsg("jsmsgPwdExpired"));			
				return;
			}
			if (baseGlobal.VERIFICA_LUNGH_PW=="S"){
				if (pwd.length<8){
					alert(ritornaJsMsg("jsmsg8minChar"));							
					return;
				}
			}
			*/
		}
		// ************************
		// ******* INIZIO CONTROLLI 
		// ************************
		callDoAllCheck(utente, pwd, document.accesso.ipPC.value);
		
		//callExitPc(document.accesso.ipPC.value);
		//callCheckUserPwd(utente,pwd);
	}
}





// ************ funtion nolicenze
function nolicenze(){
	 try{
		 alert(ritornaJsMsg("jsmsgNoLicence"));		
		 document.accesso.reset();
		 document.accesso.UserName.focus();
	 }
	 catch(e){
		 alert("nolicenze - Error: " + e.description);
	 }
}


// funzione
// che scarica tutti gli
// oggetti instanziati
function scarica(){
	// dealloco oggetto 
	try{
		ajaxUserManage = null;	
	}
	catch(e){;}
	try{	
		ajaxPcManage = null;
	}
	catch(e){;}	
	try{	
		ajaxLicenceCheck = null;
	}
	catch(e){;}	
	try{	
		ajaxGetIndexUtenteDifferenteIp = null;
	}
	catch(e){;}	
	try{	
		ajaxManageLDAP = null;
	}
	catch(e){;}	
}

// *************************************
// **************************
// ******** AJAX ************
// **************************

// controlla se utente esiste
function callExistUser(utente){

	if (utente==""){return;}
	try{
		ajaxUserManage.ajaxExistUser(utente,replyExistUser);
	}
	catch(e){
		alert("callExistUser - " + e.description)
	}
}

// funzione di callback
var replyExistUser = function (returnValue){
	
	var utente = "";

	bolUserExit = returnValue;
	utente = document.accesso.UserName.value;
	
	if (utente==""){return ;}
	if (returnValue){
		// esiste
		 document.frm_check_pwd.utente.value = document.accesso.UserName.value;		
		 // abilito link per cambio password
		abilitaCambioPassword(true);		
		// controllo se utente scaduto
		callLoginExpired(document.accesso.UserName.value);
	}
	else{
		abilitaCambioPassword(false);
		ute_inesistente();
		return;
	}

}

function callDoAllCheck(user, pwd, ip){
	try{
		dwr.engine.setAsync(false);	
		ajaxDoAllLoginCheck.doAllCheck(user, pwd, ip, replyDoAllCheck);
	}
	catch(e){
		alert("callDoAllCheck - Error: " + e.description);
	}
	finally{
		dwr.engine.setAsync(true);	
	}
}

var replyDoAllCheck = function(returnValue){
	var listaInfo ;
	var esito = "";
	var webUser="";
	var webServer="";
	var ip = "";
	var dataAccesso = "";
	var nome_host = "";
	var indiceIp ;
	var descrUtente = "";	
	var jsMsgReturned = "";
	
	// messaggio in uscita
	var strOutput = "";
	var bolEntra = false;
	
	try{
		listaInfo = returnValue.split("*");
		esito = listaInfo[0];
		jsMsgReturned = listaInfo[1];
		indiceIp = parseInt(listaInfo[2]);
		webUser = listaInfo[3];
		ip = listaInfo[4];
		dataAccesso = listaInfo[5];
		webServer = listaInfo[6];
		nome_host = listaInfo[7];
		descrUtente = listaInfo[8];		
		if (esito.toString().toUpperCase() == "OK"){
			// tutto ok 
			startup();
		}
		else{
			switch (jsMsgReturned){
				case "jsmsgUsrExpired":
					strOutput = ritornaJsMsg (jsMsgReturned);
					// login scaduta
					break;
				case "jsmsgPwdExpired":
					strOutput = ritornaJsMsg (jsMsgReturned);				
					// pwd scaduta
					break;
				case "jsmsgMaxLicErr":
					strOutput = ritornaJsMsg (jsMsgReturned);				
					// max num.lic.
					break;
				case "jsmsgPcNotExist":
					strOutput = ritornaJsMsg (jsMsgReturned);				
					break;
				case "jsmsgLoginErr":
					strOutput = ritornaJsMsg (jsMsgReturned);				
					break;
				case "jsmsgAlreadyLogged":
					strOutput = ritornaJsMsg (jsMsgReturned);	
					strOutput += "/n"+  ip + " " + dataAccesso +" "+ webServer +" ?"
					if (!confirm(strOutput + " " + ip + " " + dataAccesso +" "+ webServer +" ?")){
						return;
					}
					else{
						bolEntra = true;
						startup();
					}
				

					break;
				case "strContestoNullo":
					strOutput = "Critical Error: context is null!! Please contact system administrator.";
					break;
				default:
					break;
			}
			if (!bolEntra){
				alert(strOutput);
			}
		}
		
	}
	catch(e){
		alert("replyDoAllCheck - Error: " + e.description);
	}
		
}


// funzione
// per il controllo se esiste il pc
function callExitPc(nomePc){
	if (nomePc==""){return;}
	try{
		ajaxPcManage.ajaxPcCheck(nomePc,replyExistPc)
	}
	catch(e){
		alert("callExitPc - " + e.description)
	}	
}

var replyExistPc = function(returnValue){
	var utente ;
	var pwd ;	

	if (returnValue){
		// esiste il pc OK
		utente = document.accesso.UserName.value;
		pwd = document.accesso.Password.value;			
		callCheckUserPwd(utente,pwd);		
	}
	else{
		// KO non esiste il pc
		alert(ritornaJsMsg("jsmsgPcNotExist"));
		return;
	}
}

// ******* ritorna password in chiaro
function callGetFlatPwd(utente){
	if (utente==""){return;}
	try{
		ajaxUserManage.ajaxGetFlatPwd(utente,replyGetFlatPwd);
	}
	catch(e){
		alert("callGetFlatPwd - " + e.description)
	}	
	
}

var replyGetFlatPwd = function (returnValue){
	document.frm_check_pwd.holdPwd.value = returnValue;
}


// metodo che controlla se pwd è scaduta
function callPasswordExpired(utente){
	

	if (utente==""){return;}
	try{
		ajaxUserManage.ajaxPasswordExpired(utente,replyPasswordExpired);
	}
	catch(e){
		alert("callPasswordExpired Error: " + e.description)
	}		

}

function replyPasswordExpired(returnValue){
	bolPwdExpired = returnValue;
	if (returnValue==true){
		document.frm_check_pwd.password_scaduta.value = "S";	
		alert(ritornaJsMsg("jsmsgPwdExpired"));
	}
	else{
		document.frm_check_pwd.password_scaduta.value = "N";	
	}
}


// metodo che che controlla se l'utente è stato disattivato
function callLoginExpired(utente){

	if (utente==""){return;}
	try{
		// controllo utente expired
		ajaxUserManage.ajaxLoginExpired(utente,replyLoginExpired);
	}
	catch(e){
		alert("callLoginExpired - " + e.description)
	}		
}

function replyLoginExpired(returnValue){
	var utente = "";	
	
	bolLoginExpired = returnValue;
	utente = document.accesso.UserName.value;	
	if (returnValue==true){
		document.frm_check_pwd.utente_scaduto.value = "S";	
		alert(ritornaJsMsg("jsmsgUsrExpired"));		
		riattiva_login();
		return;
	}
	else{
		document.frm_check_pwd.utente_scaduto.value = "N";	
		// controllo se password scaduta
		callPasswordExpired(utente); 		
	}	
	
}

// ********** ritorna numero di linceze
function callGetNumLicences(){
	

	var oggetto = ajaxUserManage;
	try{
		oggetto.ajaxGetNumLicences(replyGetNumLicences);
	}
	catch(e){
		alert("callGetNumLicences - " + e.description)
	}	

	
}

var replyGetNumLicences = function (returnValue){
	document.frm_check_pwd_manager.nlicenze.value = returnValue;
}




// metodo che controlla se la password è corretta o meno
function callCheckUserPwd(utente, pwd){
	
	if (utente==""){return;}
	
	// autenticazione classica
	if (baseGlobal.LOGIN_LDAP.toString().toUpperCase()!="S"){
		try{
			ajaxUserManage.ajaxCheckUserPwd(utente,pwd,replyCheckUserPwd);
		}
		catch(e){
			alert("Error: " + e.description)
		}	
	}
	else{
		// autenticazione LDAP
		try{
			ajaxManageLDAP.checkAuthenticationByLdap(baseGlobal.IP_SERVER_LDAP, baseGlobal.SERVER_PORT_LDAP, baseGlobal.BASE_DN_LDAP, baseGlobal.SSL_TYPE_LDAP, baseGlobal.KEYSTORE_LDAP, utente,pwd, baseGlobal.LDAP_KEYSTORE_PWD, replyCheckAuthenticationByLdap);
		}
		catch(e){
			alert("Error: " + e.description)
		}			
	}
}

var replyCheckUserPwd = function (returnValue){
	var altezza = screen.availHeight;
	var largh = screen.availWidth;

	
	if (returnValue==true){
		// autenticazione corretta
		// controllo se si sta superando
		// numero massimo di licenze
		callCheckLicence();
	}
	else{
		// errore
		alert(ritornaJsMsg("jsmsgLoginErr"));		
		document.accesso.Password.value = "";
		document.accesso.Password.focus();
	}
}

// funzione uguale alla precedente
// al momento non è ancora personalizzata 
// per la callback dell'autenticazione tramite LDAP
var replyCheckAuthenticationByLdap = function (returnValue){
	var altezza = screen.availHeight;
	var largh = screen.availWidth;
	var listaInfo ;
	
	var ldapLoginDaysLeft ="";
	var ldapPwdDaysLeft ="";	

	listaInfo = returnValue.split("*");
	
	if (listaInfo[0].toString().toUpperCase()=="OK"){
		
		// devo verificare scadenza utente e password
		// baseGlobal.LDAPWARNINGDAYS_PWDEXPIRED 
		ldapLoginDaysLeft = listaInfo[1];
		ldapPwdDaysLeft = listaInfo[2];
		try{
		 	if (parseInt(ldapPwdDaysLeft) <= parseInt(baseGlobal.LDAPWARNINGDAYS_PWDEXPIRED) ){
				alert("Attenzione: la password scadrà tra: " + ldapPwdDaysLeft);
			}
		}
		catch(e){
			// impossibile convertire in numero
			alert("replyCheckAuthenticationByLdap - Error: " + e.description);
		
		}
		
		
		// autenticazione corretta
		// devo aggiornare la password in locale per tenerla allineata
		callChangeUserPassword(document.accesso.UserName.value,document.accesso.Password.value);
		// quindi controllo se si sta superando
		// numero massimo di licenze
	}
	else{
		// errore
		alert(ritornaJsMsg("jsmsgLoginErr") +" \n" + listaInfo[1]);		
		document.accesso.Password.value = "";
		document.accesso.Password.focus();
	}	
}

// ***** nuovo 20100913
// ********************
function callChangeUserPwdAndOldOne(utente, oldPwd, newPwd){
	try{
		dwr.engine.setAsync(false);	
		ajaxChangeUserPasswordAndCheckOldOne(utente, oldPwd, newPwd, replyCallChangeUserPwdAndOldOne);
	}
	catch(e){
	}
	finally{
		dwr.engine.setAsync(true);			
	}
}


var replyCallChangeUserPwdAndOldOne = function(returnValue){
	if (returnValue){
		//tutto ok
		// riporto vecchia password
		// su attivazione layer cambio pwd
		// viene fatta chiamata ajax per fare
		// retrieve della vecchia pwd
		document.frmLogin.vecchiaPwd.value = document.frm_check_pwd.holdPwd.value;
		// segnalo il cambio login
		document.frmLogin.cambioPwd.value = "S";
		// *** 
		bolPwdExpired = false;
		// fare cambio layer
		MM_showHideLayers('oLayPwd','','hide','oLayMain','','show','oLayPwd_manager','','hide');
		// copia incolla pwd corretta
		document.accesso.Password.value = document.frm_check_pwd.newPwd.value;
		// forzare autenticazione
		autenticaLogin();
	}
	else{
		// problemi
		bolPwdExpired = true;		
		alert(ritornaJsMsg("jsmsgPwdUpdErr"));			
	}	
}




// metodo per il cambio password
function callChangeUserPassword(utente,pwd){
	try{
		if ((utente=="")||(pwd=="")){return;}
		
		if (baseGlobal.LOGIN_LDAP.toString().toUpperCase()!="S"){	
			try{
				ajaxUserManage.ajaxChangeUserPassword(utente,pwd,replyChangeUserPassword);
			}
			catch(e){
				alert("Error: " + e.description)
			}	
		}
		else{
			// LDAP
			try{
				ajaxUserManage.ajaxChangeUserPassword(utente,pwd,replyChangeUserPasswordWithLDAP);
			}
			catch(e){
				alert("Error: " + e.description);
			}		
		}
	}
	catch(e){
		alert("callChangeUserPassword - Error: "+ e.description);
	}
}

var replyChangeUserPassword = function (returnValue){
	
	try{
		if (returnValue){
			//tutto ok
			// riporto vecchia password
			document.frmLogin.vecchiaPwd.value = document.frm_check_pwd.holdPwd.value;
			// segnalo il cambio login
			document.frmLogin.cambioPwd.value = "S";
			// *** 
			bolPwdExpired = false;
			// fare cambio layer
			MM_showHideLayers('oLayPwd','','hide','oLayMain','','show','oLayPwd_manager','','hide');
			// copia incolla pwd corretta
			document.accesso.Password.value = document.frm_check_pwd.newPwd.value;
			// forzare autenticazione
			autenticaLogin();
		}
		else{
			// problemi
			bolPwdExpired = true;		
			alert(ritornaJsMsg("jsmsgPwdUpdErr"));			
		}
	}
	catch(e){
		alert("replyChangeUserPassword - Error: " + e.description);
	}
		
}

var replyChangeUserPasswordWithLDAP = function (returnValue){
	
	if (returnValue){
		callCheckLicence();
	}
	else{
		// problemi
		alert(ritornaJsMsg("jsmsgPwdUpdErr"));			
	}
}


function callCheckManagerPwd(pwd){
	if (pwd==""){return;}
	try{
		ajaxUserManage.ajaxCheckManagerPwd(pwd,replyCheckManagerPwd);
	}
	catch(e){
		alert("Error: " + e.description)
	}	
}

var replyCheckManagerPwd = function(returnValue){
	try{
		if (returnValue){
			// OK
			if (strAzioneManager.toUpperCase()=="LICENCE"){
				var pwd_manager = document.frm_check_pwd_manager.oldPwd.value;
				var nlicenze = document.frm_check_pwd_manager.nlicenze.value;
				callSetLicencesValue(nlicenze, pwd_manager)
			}
			else if (strAzioneManager.toUpperCase()=="LOGIN"){
				startup();
			}
	
		}
		else{
			// KO
			alert(ritornaJsMsg("jsmsgLoginErr"));
			document.frm_check_pwd_manager.oldPwd.value = "";
			document.frm_check_pwd_manager.oldPwd.focus();
		} 
	}
	catch(e){
		alert("replyCheckManagerPwd - Error: " + e.description);
	}
}


function callSetLicencesValue(numLic, pwd){
	if ((numLic=="")||(pwd =="")){
		alert(ritornaJsMsg("jsmsgLicErr"));		
		return;
	}
	try{
		ajaxUserManage.ajaxSetLicencesValue(numLic, pwd,replySetLicencesValue);
	}
	catch(e){
		alert("Error: " + e.description)
	}		
}


var replySetLicencesValue = function (returnValue){
	try{
		if (returnValue){
			// tutto ok 
			// licenze cambiate
			// cancello pwd
			document.frm_check_pwd_manager.oldPwd.value = "";
			// riattivo layer principale		
			alert(ritornaJsMsg("jsmsgLicUpdOk"));		
			riattiva_login();
		}
		else{
			// PROBLEMI
			alert(ritornaJsMsg("jsmsgLicUpdKo"));		
		}
	}
	catch(e){
		alert("replySetLicencesValue - Error: " + e.description);
	}
}


// funzione
// che controlla se viene superato il numero max di licenze
function callCheckLicence(){
	try{
		ajaxLicenceCheck.ajaxCheckLicence(replyCheckLicence);
	}
	catch(e){
		alert("Error: " + e.description)
	}		
}

var replyCheckLicence = function(returnValue){
	
	var utente = "";
	var ip = "";
	
	utente = document.accesso.UserName.value ;
	ip= document.accesso.ipPC.value;
	
	if (returnValue){
		// controllo se autenticato
		// già su un'altra postazione
		callGetIndexUtenteDifferenteIp(utente,ip);
	}
	else{
		alert(ritornaJsMsg("jsmsgMaxLicErr"));			
	}
	
}


// funzione
// per controllare se l'utente
// è già loggato su un differente ip
function callGetIndexUtenteDifferenteIp(utente,ip){
	try{
		ajaxGetIndexUtenteDifferenteIp.getIndexUtenteDifferenteIp(utente,ip,replyGetIndexUtenteDifferenteIp);
	}
	catch(e){
		alert("Error: " + e.description);
	}
}

var replyGetIndexUtenteDifferenteIp = function(returnValue){
	var listaInfo
	var webUser="";
	var webServer="";
	var ip = "";
	var dataAccesso = "";
	var nome_host = "";
	var indiceIp ;
	var descrUtente = "";
	
	listaInfo = returnValue.split("*");
	try{
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
		if (indiceIp!=-1){
			// trovato loggato su un altro ip
			if (!confirm(ritornaJsMsg("jsmsgAlreadyLogged")+ ip + " " + dataAccesso +" "+ webServer +" ?")){
				return;
			}
			else{
				startup();
			}
		}
		else{
			// utente NON trovato
			// su altre postazioni
			// quindi proseguo
			startup();
		}
	}
	catch(e){
		alert("replyGetIndexUtenteDifferenteIp - " + e.description);
	}
}


// funzione
// che rimuove dalla lista del server
// la coppia utente/ip
/*
function callRemoveLoggedUser(utente,ip){
	try{
		ajaxRemoveLoggedUser.removeLoggedUser(utente,ip,replyRemoveLoggedUser);
	}
	catch(e){
		alert("Error: " + e.description);
	}	
}

var replyRemoveLoggedUser = function(returnValue){
	// returnValue: 
	// true OK
	// false KO
	if (returnValue){
		// utente rimosso dalla lista
		// quindi posso 
		// continuare caricando la servlet successiva
		startup();
	}
	else{
		// problemi nella rimozione dell'utente
		alert(ritornaJsMsg("jsmsgDelUsrErr"));		
	}
}
*/
// ****************
// ****************

function startup(){
	
	var altezza = screen.availHeight;
	var largh = screen.availWidth;
	
	document.frmLogin.utente.value = document.accesso.UserName.value ;
	document.frmLogin.psw.value = document.accesso.Password.value ;
	document.frmLogin.ipRilevato.value = document.accesso.ipPC.value;
	// finestra target CR_wndMain
	var finestra = window.open("","CR_wndMain","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","CR_wndMain","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");
	}
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
function dhtmlLoadScript(url, idScript, functionToCallAfter)
{
	var fileref;
	try{
		fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", url);	   
//		fileref.text = "function nuovoAlert() {alert('hello world');}";		
		fileref.setAttribute("id", idScript);	   
		fileref.onreadystatechange = function extFileLoaded(){toDoAfter(idScript,functionToCallAfter);};				
		document.getElementsByTagName("head").item(0).appendChild(fileref)		
	}
	catch(e){
		alert("Error: " + e.description);
	}
	return false;
}



// gestisce cosa fare
// quando il file esterno è stato caricato
function toDoAfter(idFileScript, toDoAfter){
	var oggetto
	
	if (toDoAfter==""){return;}

	try{
		oggetto = document.getElementById(idFileScript);
		if(oggetto.readyState!="loading"){
			eval(toDoAfter);
		}
	}
	catch(e){
		;
	}
}

// funzione che inizializza e crea
// gli eventuali controlli per la smart card
function startUpSmartCardManagement(){
	

	// controllo se è abilitata la smartcard sul pc
	if (basePC.ABILITA_LOGIN_SMART_CARD=="S"){
		// tiro su dinicamicamente il jscript che gestisce
		// l'autenticazione della smartcard
		// NB questo file DOVRA' avere una "sorta" di interfaccia
		// comune a tutti i tipo di integrazione con smartcard
		if (basePC.JS_FILE_SMART_CARD==""){
			// nessuna gestione SMART_CARD
			alert("JS_FILE_SMART_CARD is not defined");
			return;
		}
		dhtmlLoadScript(basePC.JS_FILE_SMART_CARD, "idScriptSmartCard","initSmartCardManagement()");
	}
}

// dopo aver caricato
// il file esterno viene inizializzato il 
// pulsante per la gestione
function initSmartCardManagement(){
	
		var linkToCall;	
		// la funzione js da chiamare 
		// sul click del pulsante può essere ritornata 
		// da un funzione definita per ogni JS linkato al volo
		try{
			linkToCall = getJsFunctionToCall();
		}
		catch(e){
			alert(" initSmartCardManagement.getJsFunctionToCall - " + e.description);
		}
		if (linkToCall==""){
			alert(ritornaJsMsg("jsmsgNoLinkSmartCard"));			
			return;
		}
		addButtonToFirstRow('UP',linkToCall);
		// carico testo
		// del pulsante della smartcard
		initLabelButtonSmartCard("idLinkSmartCard");
}

// funzione che aggiunge al volo
// un pulsante alla prima riga
// il parametro rigaValue
// può essere UP o DOWN (prima o seconda riga)
function addButtonToFirstRow(rigaValue, linkButton){
	// aggiungo cella alla fine della riga
	var trObject;
	
	if (rigaValue.toUpperCase()=="UP"){
		trObject = document.getElementById("trFirstRowLogin");
	}
	else{
		trObject = document.getElementById("trSecondRowLogin");		
	}
	if (trObject){
		var tdObject = trObject.insertCell(-1);
		tdObject.className = "LoginButton";
		var pulsante = getButton("idLinkSmartCard",linkButton)
		tdObject.insertBefore(pulsante);
	}
	else{
		alert(ritornaJsMsg("jsmsgNoRow") + " " + rigaValue);
	}
}


// funzione che ritorna l'oggetto
// pulsante da gestire
function getButton(idValue, hrefValue){

	// esempio
	//	<div class='pulsante'><a id='oLinkPsw' href='#'></a></div>
	
	var divObject;
	var aObject;

	divObject =  document.createElement("DIV");
	divObject.className = "pulsante";
	
	aObject = document.createElement("A");
	aObject.id = idValue;
	aObject.href = hrefValue;
	
	divObject.appendChild(aObject);

	return divObject;
}