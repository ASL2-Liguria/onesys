var timeoutLoginDaSmartCard = 1000;
var timerLoginDaSmartCard;
// funzione che dovrà essere richiamata
// al momento del click sul pulsante
// questa funzione DEVE essere sempre implmentata
// e da usare a mo' di interfaccia
function getJsFunctionToCall(){
	
	var functionToCall = "javascript:getUserPwdFromCard()";
	return functionToCall;
}

// inizializza a posteriori il
// testo da metterenel pulsante
// questa funzione DEVE essere implementata
function initLabelButtonSmartCard(id){
	
	var objectNode; 
	var testo ;
	
	objectNode = document.getElementById(id)
	if (objectNode){
		testo = ritornaJsMsg(id);
		objectNode.innerText =testo;
	}
}

// funzione che estrapola
// dalla DLL della smartcard 
// l'utente e la pwd corretti
function getUserPwdFromCard(){
	
	document.accesso.UserName.focus();
	document.accesso.UserName.value = "elco";
	document.accesso.Password.focus();
	// l'autenticazione deve essere ritardata per dare la 
	// possibilità ad ajax di fare i suoi controlli
	// opppure provo a chiamare startup
	timerLoginDaSmartCard = setTimeout('autentica()', timeoutLoginDaSmartCard);
}


// effettua "simulandolo"
// l'autenticazione
function autentica(){
	clearTimeout(timerLoginDaSmartCard);
	document.accesso.Password.value = "www";	
	autenticaLogin();
}

