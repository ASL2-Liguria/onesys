// *************
// *********** Integrazione PACS **********************
// ****************************************************

// uso questa variabile
// come ritorno della GETCURRENTUSER
// i dati di ritorno saranno login*pwd
// quindi splittabili
// i dati sono in chiaro
var userLoggedOnPacs = "";



// funzione che fai i 
// primi controlli per sincronizzare le
// immagini con il pacs
//@param pacsType: individua il tipo di pacs con una costante 
//@param additionalParameters: indica eventuali parametri opzionali

// funzione che controllo
// se esiste una sinc pacs 
// attiva e prova a fare una getcurrentuser
// nel caso il ris fosse crashato
function startupPacs(){
	
	var vett_login
	var userPacs = "";
	var passwordPacs = "";
	
	if (bolSyncPacsActive==false){return;}
	
	sendToPacs("GETCURRENTUSER",objectSyncPacs,"");
	//alert("utente: " + userLoggedOnPacs);
	// attenzione
	// verificare se la chiamata è sincrona
	// affinchè non si vada avanti prima
	// che la funzione abbia ritornato 
	// dei valori per user e pwd
	try{
		vett_login = userLoggedOnPacs.split("*");
	}
	catch(e){
		// pacs not active
		return;
	}
	userPacs = vett_login[0];
	passwordPacs = vett_login[2];
	
	if ((userPacs!="")&&(passwordPacs!=""))
	{
		document.accesso.UserName.value = userPacs;
		document.accesso.Password.value = passwordPacs;
		startup();
	}
	else{
		//alert(ritornaJsMsg("jsmsgUserLoggedPacsNull"));
		// dealloco l'adapter
		sendToPacs("DEALLOCATE",objectSyncPacs,"");
	}
}

// funzione che manda i dati
// all'oggetto pacs
function sendToPacs(azione, pacsType, additionalParameters){
	
	var oggettoPacs;
	
	try{
		if (azione == ""){return;}
		azione = azione.toUpperCase();
		// IMPORTANTE 
		// Ricordarsi di mettere gli oggetti
		// js da richiamare relativi al pacs
		// nella tabella LINGUE 
		// relativi a classStartImagex
		oggettoPacs = ritornaJsMsg(pacsType)
		//alert("oggettoPacs:" + oggettoPacs );
		// devo chiamare la funzione relativa al pacstype	
		eval (oggettoPacs + "(azione,'', '', additionalParameters);");
	}
	catch(e){
		alert("sendToPacs ---- Error: " + e.description);
	}
}