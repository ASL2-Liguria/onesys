var valoreRitorno = false;
// in utenteOriginale metto l'utente
// col quale vengo chiamato
var utenteOriginale = "";
var utenteDaValidare = "";

function initGlobalObject(){

	window.onunload = function scaricaTutto(){scarica();};	
	initbaseGlobal();
	initbaseUser();
	initbasePC();

	fillLabels(arrayLabelName,arrayLabelValue);
	initLoginFields();
	
	
}

function initLoginFields(){
	document.frmMain.UserName.value = baseUser.LOGIN ;
	document.frmMain.Password.value = "" ;
	utenteOriginale = document.frmMain.UserName.value;	
}

// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	 if (window.event.keyCode==13){
		 window.event.returnValue=false;
		 verifica_pwd();}
}


function verifica_pwd(){
	var utente ="";
	var password ="";
	
	utente = document.frmMain.UserName.value;
	password = document.frmMain.Password.value;

	if (utente==""){
		alert(ritornaJsMsg("jsmsgUserNull"));
		return;
	}
	if (password==""){
		alert(ritornaJsMsg("jsmsgPwdNull"));
		return;
	}	
	utenteDaValidare = utente;	
	// fare chiamate ajax
	// per controllo password
	callCheckUserPwd(utente,password);
}

// funzione che aggiorna 
// la pagina corrente
function aggiorna(){
	document.frmAggiorna.submit();
}

// chiude la form corrente
function chiudi(){
	valoreRitorno = false
	window.close();
}

function scarica(){
	window.returnValue = valoreRitorno;
}
// ************************************************************
// *****************  AJAX  ***********************************
// ************************************************************
// metodo che controlla se la password è corretta o meno
function callCheckUserPwd(utente, pwd){
	
	if (utente==""){return;}
	
	try{
		ajaxUserManage.ajaxCheckUserPwd(utente,pwd,replyCheckUserPwd);
	}
	catch(e){
		alert("Error: " + e.description)
	}	
}

var replyCheckUserPwd = function (returnValue){

	if (returnValue==true){
		// autenticazione corretta
		// verifico se ho cambiato utente
		if (utenteOriginale.toString() != utenteDaValidare.toString()){
			//altro utente
			valoreRitorno = false;
		}
		else{
			// utente orginale
			valoreRitorno = true;
		}
		window.close();
	}
	else{
		// errore
		alert(ritornaJsMsg("jsmsgKO"));
		initLoginFields();
	}
}
// *****************************************************************
// *****************************************************************