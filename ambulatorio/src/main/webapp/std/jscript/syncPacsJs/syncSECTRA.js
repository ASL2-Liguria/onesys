// JavaScript Document 
var sectraExePathDEFAULT = "\"C://Program Files//Sectra//IDS5//bin//run_ids5.exe\"";
var nomeProcessoSectraDEFAULT ="workstation.exe";

//*********** per IDS7 ************************************
var webWindowTitleIDS7 = "IDS7 -";
// ATTENZIONE Deve essere parametrizzato su PC !
// definisco valore di default
var urlIDS7_default = "http://pacs-pieve/ids7";
// ********************************************************
var sectraObj;
var flg_pwd_cambiata = "1";
var globalAction = "";
// dopo aver lanciato il client pacs
// aspetto timeoutToLogInSectra(ms) per far login
var timeoutToLogInSectra = 2000;
windowTitleSectra = "Finestra informazioni";
windowTitleSectraEN = "Information window";
var handleSectra;

// questa è la funzione base
// che deve sempre esser chiamata
// con la gestione delle STESSE chiamate
function actionPacs(azione, objUtente, objStudio, additionalParameters)
{
	var strAccessionNumber="";
	var strAetitle = "";
	var datiDaMandare = "";
	var regEx = /\*/g;
	
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
	var urlToCall = "";
	var regEx = /\*/g;

	globalAction = azione;	
	//alert("action on SECTRA: " + azione);
	// controllo tipo di sync
	// ****
	try{
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
//		alert(azione);
		switch (azione)
		{
		case "LOGIN":
			try{
				// per IDS5
				//handleSectra = document.all.clsKillHome.getHandle(windowTitleSectra, false);
				// per IDS7
				if (webWindowTitleIDS7==""){
					alert("webWindowIDS7 NON configurato");
					webWindowTitleIDS7 = "IDS7 -";
				}				
				try{handleSectra = document.all.clsKillHome.getHandle(webWindowTitleIDS7, true);}
				catch(e){alert("Impossibile recuperare l'handle del processo IDS7");}
			}
			catch(e){
				alert(e.description);
			}
			if (handleSectra !=""){
				// in esecuzione
				loginToSectra();
			}
			else{
				// devo lanciarlo
				launchSectraApp();
			}
			return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			openStudies(patientId, basePacsStudy.ACCNUM, additionalParameters);		
			return;	
		case "EDITPASSWORD":
			return;
		case "SHOWSTUDY":
			// chiudo tutti i canvas aperti
			closeAllStudies();
			// apro quelli nuovi
			openStudies(patientId, basePacsStudy.ACCNUM, additionalParameters);
			return;
		case "CLOSE_CURR_SESSION":
			closeAllStudies();			
			return;
		case "LOCKWORKSTATION":
			return;
		case "UNLOCKWORKSTATION":
			return;	
		case "DEALLOCATE":
			return;
		case "QUIT":
//			closeAllStudies();
			logoutSectra();	
	//		killaSectra();
			return;		
		default:
			return;
		}
	}
	catch(e){
		alert("performAction - Error: " + e.description);
	}
	

}



// lancia l'exe
function launchSectraApp(){
	var pathToRun = "";
	var altezza = screen.availHeight;
	var largh = screen.availWidth;
	var handleIDS7 ;
	var myUrlIDS7 = "";
	
	try{
		// per IDS7 c'è la URL
		try{
			// usiamo URL_PACS_MIM
			// per non modificare altre parti,x ora (20111020)
			if ((basePC.URL_PACS_MIM)&&(basePC.URL_PACS_MIM!="")){
			//if ((basePC.URLIDS7)&&(basePC.URLIDS7!="")){
				myUrlIDS7 = basePC.URL_PACS_MIM;
				//myUrlIDS7 = basePC.URLIDS7;
			}
			else{
				myUrlIDS7 = urlIDS7_default;
			}
		}
		catch(e){
			// valore default
			myUrlIDS7 = urlIDS7_default;
		}
		handleIDS7 = window.open(myUrlIDS7,"","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0, left=" + largh +",status=yes");
		window.setTimeout("loginToSectra()", timeoutToLogInSectra);
		return;
		// PER IDS5 c'era l'eseguibile
		if (pathToRun==""){
			// uso il default
			pathToRun = sectraExePathDEFAULT;
		}
		else{
			pathToRun = "\""+ pathToRun + "\"";
		}
		//alert("launchSectraApp - " + pathToRun);
		myOpenShell(pathToRun,1);
		// dopo un intervallo prestabilito
		window.setTimeout("loginToSectra()", timeoutToLogInSectra);
	}
	catch(e){
		alert("launchSectraApp - Error: " + e.description);
	}
}



// NON esiste la login su sectra
// quindi questa funzione viene sfruttata per
// creare l'oggetto al quale linkarsi
function loginToSectra(){
	
	var pwdCrypted="";
	var oggettoAgfa ;
	try{
		//alert("loginToSectra - " + baseUser.LOGIN + " - " + pwdDecrypted);
		sectraObj = new ActiveXObject("Sectra_desktop_sync.SectraDesktopSync");
		try{
			sectraObj.PACSInitialize("POLARIS",1000) ; 
		}
		catch(e){
			alert("Error on PACSInitialize - Error: " + e.description);
		}		
	}
	catch(e){
		alert("loginToSectra - Error: " + e.description);
	}
}

// accessionNumber lista di accNum splittati da *
function openStudies(patID, accessionNumber, arrayMetodica){
	var regEx = /\*/g;
	var lista;
	var i = 0;
	var bolAlmenoUno = false;

	try{
		if (sectraObj){
//			alert("openStudies - " + patID + " - " + accessionNumber);					
			// resetto lista
			// attenzione lo faccio già con la close
			sectraObj.PACSResetDisplayList(); 
			// ****
			lista = accessionNumber.split("*");
			for (i=0;i<lista.length;i++){

				// numero visita di esempio 201003089108
				// id esame di esempio 20100308910
				//sectraObj.PACSAddToDisplayList('201003089108','20100308910'); 
				// altri con valori (sembra) uguali 
				// 041011_03    041011_02    041011_01
				// 030601A    030602A    030603A
				if (arrayMetodica!=""){
					if (arrayMetodica.split("*")[i]!="2"){
						//	salto SOLO le eco
						bolAlmenoUno = true;
						sectraObj.PACSAddToDisplayList(lista[i],lista[i]); 						
					}
				}
				else{
					bolAlmenoUno = true;
					sectraObj.PACSAddToDisplayList(lista[i],lista[i]); 
				}
			}
			if (bolAlmenoUno){
				sectraObj.PACSShowDisplayList(3);
			}
			else{
				//alert("Nessun esame visualizzabile su Pacs"); 
			}
//			logToScreen("openStudies OK " + patID + " " + accessionNumber);
		}		
		else{
			alert("Workstation chiusa");
			launchSectraApp();
		}
	}
	catch(e){
		alert("openStudies - Error: " + e.description);
//		logToScreen("openStudies - Error: " + e.description + patID + " " + accessionNumber);
	}
 }


function closeAllStudies(){
	try{

		if (sectraObj){
//			alert("closeAllStudies");			
			sectraObj.PACSResetDisplayList(); 
			sectraObj.PACSCloseImages();
		}
	}
	catch(e){
		alert("closeAllStudies - Error: " + e.description);
		//logToScreen("closeAllStudies - Error: " + e.description);
	}
}

// deprecato
function logoutSectra(){
	try{
		//logToScreen("logout OK");			
		if (sectraObj){
			sectraObj.PACSLogout(baseUser.LOGIN, "End Ris session");
		}		
		
	}
	catch(e){
		alert("logoutSectra - Error: " + e.description);
		//logToScreen("logout error - " + e.description);
	}
}

function killaSectra(){
	var strTmp = "";
	var pathToKill= "";
	try{
//		alert("killa");
		/*
		try{
			pathToKill = basePC.PROCESSO_Sectra;
		}
		catch(e){
			pathToKill = nomeProcessoSectraDEFAULT;
		}

		if (typeof(pathToKill) == "undefined"){
			//alert("Attenzione il campo configura_pc.PROCESSO_Sectra non esiste!");	
			pathToKill = nomeProcessoSectraDEFAULT ;
		}
		else{
			pathToKill = basePC.PROCESSO_Sectra	;
		}
		//alert("Kill - ##" + pathToKill +"##");				
		if (pathToKill==""){
			// uso il default
			pathToKill = nomeProcessoSectraDEFAULT;
		}
		//clsKillHomeJsObject.getHandle("Sectra 6.4", false);
		myOpenShell("taskkill.exe /im " + pathToKill,2);*/
		handleSectra = document.all.clsKillHome.getHandle(windowTitleSectra, true)
		if (handleSectra==""){
			// provo in inglese
			handleSectra = document.all.clsKillHome.getHandle(windowTitleSectraEN, true)			
		}
		document.all.clsKillHome.KillaProcesso("", handleSectra)		
	}
	catch(e){
		alert("killaSectra - Error: "  + e.description);
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