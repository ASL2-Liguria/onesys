// JavaScript Document

var errorHref = "errorMsg";
var param = "?errore=lblerroreLogin";
var unloadWindow = "unloadSession";

function initGlobalObject(){
	initbaseUser();
	initbasePC();	
	confirmDisconnect();
}

// funzione
// che chiede conferma della disconnessione
function confirmDisconnect(){
	var ipToDisconnect ="";
	
	if (confirm(ritornaJsMsg('jsmsgDisconnetti')+ " " + ipWhereConnected)){
		ipToDisconnect = ipWhereConnected;
		document.location.replace (callBack+"?ipWhereConnected=" + ipToDisconnect);	
	}
	else{
		// ip locale
		//ipToDisconnect = basePC.IP;
		// reindirizzo all'errore
//		document.location.replace (errorHref+param);			
		// verificare se si chide la sessione 
		// ***************
//		finestra = window.open("","unloadSession","top=100000,left=100000,width=400,height=400");
		document.location.replace (unloadWindow);			
	}

}
