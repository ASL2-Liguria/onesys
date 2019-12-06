var agfaContextServerObject

var flg_pwd_cambiata = "1";

var globalAction = "";

var impaxExePath = "\"C://Program Files//Agfa//IMPAX Client//AppStart.exe\"";
var nomeProcessoImpax ="impax-client-main.exe";

// questa  la funzione base
// che deve sempre esser chiamata
// con la gestione delle STESSE chiamate

function actionPacs(azione, objUtente, objStudio, additionalParameters)
{
	var strAccessionNumber="";
	var strAetitle = "";
	var datiDaMandare = "";
	var regEx = /\*/g;
	
	//alert("azione: " + azione);
	
	if (azione=="")
	{
		return;
	}
	azione = azione.toUpperCase();
	
	performAction(azione, objUtente, objStudio, additionalParameters);

}

// funzione che esegue 'materialmente'
// l'azione sul pacs
// objUtente e objStudio derivano da basePacsUser e basePacsStudy 
// che sono implementati nel frame nascosto e contengono le info per la sincro
function performAction(azione, objUtente, objStudio, additionalParameters){
	
	var oggettoPacs;
	var err_number
	var err_descr
	var vecchio_acc_num = "";
	var azione_close="";
	var strAccessionNumber="";
	var strAetitle = "";
	var regEx = /\*/g;

	var accessionNumber = "";
	var patientId = "";
	var i =0;
	var listaEsami
	//alert(azione);

	try{
		globalAction = azione;
		// bolOpenedConsole indica se la console  aperta o meno
		// inizializzo l'azione da compiere
		// controllo tipo di sync
		// ****
		try{
			if (basePacsStudy.PATID.indexOf("*")==-1){
				patientId = basePacsStudy.PATID;
			}
			else{
				patientId = basePacsStudy.PATID.split("*")[0];
			}
		}
		catch(e){
			patientId = basePacsStudy.PATID;
		}
		switch (globalAction)
		{
		case "LOGIN":
				
				return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			listaEsami = basePacsStudy.ACCNUM.split("*");

			return;	
		case "EDITPASSWORD":
			return;
		case "SHOWSTUDY":
			// ciclo sui vari esami
			listaEsami = basePacsStudy.ACCNUM.split("*");
			return;
		case "CLOSE_CURR_SESSION":
			return;
		case "LOCKWORKSTATION":
			return;
		case "UNLOCKWORKSTATION":
			return;	
		case "DEALLOCATE":
			return;
		case "QUIT":
			return;		
		default:
			return;
		}
	}
	catch(e){
		alert("performAction - Error: " + e.description)
	}
	

}

function launchImpaxApp(){
	try{
		myOpenShell(impaxExePath,1);
	}
	catch(e){
		alert("launchImpaxApp - Error: " + e.description);
	}
}


/*0 Hide the window and activate another window. 
'1 Activate and display the window. (restore size and position) Specify this flag when displaying a window for the first time. 
'2 Activate & minimize. 
'3 Activate & maximize. 
'4 Restore. The active window remains active. 
'5 Activate & Restore. 
'6 Minimize & activate the next top-level window in the Z order. 
'7 Minimize. The active window remains active. 
'8 Display the window in its current state. The active window remains active. 
'9 Restore & Activate. Specify this flag when restoring a minimized window. 
'10 Sets the show-state based on the state of the program that started the application.
Percorso completo con /
*/
function myOpenShell (valore, windowMode){
	var ReturnCode ;
	try{
		var shell = new ActiveXObject("WScript.Shell") ;
		if (windowMode==""){windowMode=1;}
		var ReturnCode = shell.Run(valore, windowMode, true);
	}
	catch(e){
		alert("myOpenShell - Error: " + e.description);
	}
}


function createContextServerObject(){
	try{
		var ContextServerConnector;
		ContextServerConnector = new ActiveXObject("mitra_context_server.connector_class");
		agfaContextServerObject = ContextServerConnector.ContextServer;
		logToScreen("agfaContextServerObject successfully created");
		// esempio event hooking 
		try{
			var status = agfaContextServerObject.attachEvent("PerformUserValidationTrigger", handlePerformUserValidationTrigger);
		}
		catch(e){
			alert("Can't attach event handler");
		}

 		
		
	}
	catch(e){
		alert("createContextServerObject - Error: " + e.description);
	}
}


function handlePerformUserValidationTrigger(){
	try{
//		alert("PerformUserValidationTrigger event raised");
		logToScreen("PerformUserValidationTrigger event raised");
	}
	catch(e){
		alert("getContextServerObject - Error: " + e.description);
	}		  
}

function loginToImpax(user, password){
	var oggettoAgfa ;
	var pwdCrypted="";
	try{
		if (agfaContextServerObject){
			agfaContextServerObject.UserName = user;
			// attenzione la pwd deve essere criptata ? Con quale metodo?
			oggettoAgfa = new ActiveXObject("agfaInterface.agfaPwdClass");
			if (oggettoAgfa){
				pwdCrypted = oggettoAgfa.EncryptPasswordAsString(password);
			}
			else{
				alert("Error loading agfaInterface.agfaPwdClass");
			}
			if (pwdCrypted!=""){
				agfaContextServerObject.Password = pwdCrypted;
			}
			else{
				alert("Impossibile continuare: pwd criptata nulla");
				return;
			}
			agfaContextServerObject.PerformUserValidation();
			logToScreen("login OK " + user +" " + password);
		}
	}
	catch(e){
		alert("loginToImpax - Error: " + e.description);
	}
}


function logoutImpax(){
	try{
		if (agfaContextServerObject){
			agfaContextServerObject.DoAction("LOGOUT","","","");
			logToScreen("logout OK");			
 		}
	}
	catch(e){
		alert("logoutImpax - Error: " + e.description);
		logToScreen("logout error - " + e.description);
	}
}


// accessionNumber lista di accNum splittati da *
// l'interfaccia li accetta splittati da \
function openStudies(patID, accessionNumber){
	var regEx = /\*/g;
	var wellFormedList = "";
	var lista;
	var i = 0;

	try{
		wellFormedList = accessionNumber.replace(regEx,"\\");
		// primo metodo
/*
		if (agfaContextServerObject){
			agfaContextServerObject.DoAction("RIS_SHOW_STUDIES",patID,wellFormedList,"");
			logToScreen("openStudies OK " + patID + " " + accessionNumber);
		}
*/

		// secondo metodo
		if (agfaContextServerObject){
			lista = accessionNumber.split("*");
			for (i=0;i<lista.length;i++){
				agfaContextServerObject.DoAction("ADD_TO_DISPLAY_LIST",patID,lista[i],"");
				agfaContextServerObject.DoAction("SYNC_DISPLAY",patID,lista[i],"");

			}

			logToScreen("openStudies OK " + patID + " " + accessionNumber);
		}		
	}
	catch(e){
		alert("openStudies - Error: " + e.description);
		logToScreen("openStudies - Error: " + e.description + patID + " " + accessionNumber);
	}
 }


function closeAllStudies(){
	try{
		if (agfaContextServerObject){
			agfaContextServerObject.DoAction("REMOVE_ALL_FROM_WORKLIST","","","");
			// forse non è necessario la chiamata di sotto
			agfaContextServerObject.DoAction("BLANK_DISPLAY","","","");
			logToScreen("closeAllStudies OK");
		}
	}
	catch(e){
		alert("closeAllStudies - Error: " + e.description);
		logToScreen("closeAllStudies - Error: " + e.description);
	}
	
}

function killaImpax(){
	try{
	 	myOpenShell("taskkill.exe /im " + nomeProcessoImpax,2);
	}
	catch(e){
		alert("killaImpax - Error: "  + e.description);
	}
}

/*
function addStudy(accNum){
	agfaContextServerObject.StudyId = accNum;
	agfaContextServerObject.DoAction("");

}
*/

function logToScreen(msg){
	document.getElementById("lblOutput").innerHTML = msg;
}


String.prototype.replaceAll = function(stringToBeReplaced, stringToReplace)
{
	var strOutput = "";
	
	var regex =new RegExp(stringToBeReplaced , "g");
	return this.replace(regex,stringToReplace);
}




