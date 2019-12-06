

function initGlobalObject(){
	initbaseGlobal();
	initbaseUser();
	initbasePC();

	fillLabels(arrayLabelName,arrayLabelValue);
	if (document.all.idCdc.length==0){
		alert(ritornaJsMsg("jsmsgUserNotExist"));
		document.frmMain.UserName.value="";
		document.frmMain.UserName.focus();
		return;
	}
	if (!loginLocked){
		if (document.frmMain.UserName.value==""){
			document.frmMain.UserName.focus();
		}
		else{
			document.frmMain.Password.focus();
		}
	}
	else{
		document.frmMain.Password.focus();
	}
	// resetto il cdc
	// di feault per forzare l'obbligatorietà
	//resetSelectedCdcAddNullOption();
}


function resetSelectedCdcAddNullOption(){
	// devo 
	// - effettuare le seguenti operazioni SOLO 
	// se sono alla prima validazione
	// - aggiungere selezione vuota
	// - selezionare l'option vuota inserirta in testa
	// - aggiungere controllo che ci sia una selezione nel combo
	
	var stringaCodici = "";
	var stringaDescr = "";
	var objectCdc;	
	var numCdc ;
	
	var arrayCodici;
	var arrayDescr;
	
	objectCdc = document.getElementById("idCdc");
	if (objectCdc){	
		// devo verificare se sono alla prima validazione o meno!!
		if (objectCdc.disabled){
			return;
		}
		numCdc = objectCdc.length;
		// se ho un solo elemento non faccio nulla
		if (parseInt(numCdc)==1){
			return;
		}
		// salvo vecchi valori
		stringaCodici = getAllOptionCode("idCdc");
		stringaDescr = getAllOptionText("idCdc");
		// cancello tutto
		remove_all_elem("idCdc");
		// carico elemento vuoto
		add_elem("idCdc","", "");
		arrayCodici = stringaCodici.split("*") ;
		arrayDescr = stringaDescr.split("*");
		for (var i =0;i<numCdc;i++){
			add_elem("idCdc",arrayCodici[i], arrayDescr[i]);			
		}
		// seleziono il primo vuoto
		objectCdc[0].selected = true;
	}
}


// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	 if (window.event.keyCode==13){
		 window.event.returnValue=false;
		 verifica_pwd();}
}

// funzione che verifica la 
// correttezza della password
function verifica_pwd(){
	if (document.frmMain.UserName.value==""){
		alert(ritornaJsMsg("jsmsgUserNull"));
		return;
	}
	if (document.frmMain.Password.value==""){
		alert(ritornaJsMsg("jsmsgPwdNull"));
		return;
	}
	if (getValue("idCdc")==""){
		alert(ritornaJsMsg("jsmsgCdcNull"));
		return;
	}
	document.frmCheckUser.hidLogin.value= document.frmMain.UserName.value;
	document.frmCheckUser.hidPwd.value = document.frmMain.Password.value;
	document.frmCheckUser.hidReparto.value = getValue("idCdc");
	
	var wndCheckUserEngine = window.open("","wndCheckUserEngine","top=10.left=10,width=300,height=300,status=yes");
	if (wndCheckUserEngine){
		wndCheckUserEngine.focus();
	}
	else{
		wndCheckUserEngine = window.open("","wndCheckUserEngine","top=10.left=10,width=300,height=300,status=yes");
	}
	document.frmCheckUser.submit();
}


// funzione che gestisce
// l'esito del controllo
function continua(valore){
	
	var functionToCall="";
	
	if ((valore=="")||(valore=="KO")){
		alert(ritornaJsMsg("jsmsgKO"));
	}
	if (valore.substr(0,2)=="OK"){
		functionToCall = "opener." + document.frmAggiorna.hidFunctionToCall.value;
		// 
		functionToCall  = functionToCall + "(\"" + valore +"\")";
		eval(functionToCall);
	}
	chiudi();
}

// funzione che ricarica i
// cdc di costo relativi all'utente
function reloadCdc(){
	// controllo che non sia stato variato l'utente
	var utenteVariato = false;
	
	if (document.frmMain.UserName.value!=document.frmAggiorna.hidUser.value){
		utenteVariato=true;
	}
	if (utenteVariato){
		// devo fare il refresh
		document.frmAggiorna.hidUser.value = document.frmMain.UserName.value;
		aggiorna();
	}
	else{
		document.frmMain.Password.focus();
	}
}

// funzione che aggiorna 
// la pagina corrente
function aggiorna(){
	document.frmAggiorna.submit();
}

// chiude la form corrente
function chiudi(){
	self.close();
}