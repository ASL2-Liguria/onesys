// JavaScript Document 
var impaxExePathDEFAULT = "\"C://Program Files//Agfa//IMPAX Client//AppStart.exe\"";
var nomeProcessoImpaxDEFAULT ="impax-client-main.exe";
var agfaContextServerObject;
var flg_pwd_cambiata = "1";
var globalAction = "";
// dopo aver lanciato il client pacs
// aspetto timeoutToLogInImpax(ms) per far login
var timeoutToLogInImpax = 2000;

var logFileName = "logPol2Impax.log";
// valore massimo di log, espresso in byte
// setto un megabyte
var logFileLimitSize = "1048576";


// *********************************************
// *********** EPIC Mcs info *******************
// *********************************************
var urlEpicMcs = "http://localhost:7300/epicepr?";
var iFrameId4EpicMcs = "idEpicFrame";
// *********************************************

// *****************************************************************
var ElcoJsLogFileObjectVersion = "1.0";

//carico info aetitle PC !
function loadAeTitleInfo(){
	try{
		scriviLog("** loadAeTitleInfo - call getAetitleInfo");		
		getAetitleInfo(basePC.IDEN_AETITLE);
	}
	catch(e){
		scriviLog("** loadAeTitleInfo - Error: " + e.description);				
		alert("loadAeTitleInfo - Error: " + e.description);
	}
}
// NON lo faccio perchè il cambio aetitle è rischio per integr CSH
//window.onload = function(){loadAeTitleInfo();};

function ElcoJsLogFileObject() {
	// posso creare qualche proprietà
	this.classVersion = ElcoJsLogFileObjectVersion;
	this.saveDateTimeEachRow = false;
}

function mySetSaveDateTimeEachRow(value){
	this.saveDateTimeEachRow = value;
}

function myGetSaveDateTimeEachRow(){
	return this.saveDateTimeEachRow;
}


//@param pathFileName indica il percorso del file (path + file)
// la funzione crea il file e lo chiude senza scriverci dentro
// ATTENZIONE se il file esiste già il create lo AZZERA !!
function myCreateFile(pathFileName)
{
   var fso, tf;
   try{
	   if (pathFileName==""){
		   throw new Error("Path file is null");
	   }	   
	   fso = new ActiveXObject("Scripting.FileSystemObject");
	   tf = fso.CreateTextFile(pathFileName, true);
	   tf.Close();
   }
   catch(e){
	   throw e;
   }
   return;
}


function myGetUserTempFolder(){

	var WindowsFolder = 0 ;
	var SystemFolder = 1 ;
	var TemporaryFolder = 2	;
	var outputFolder = "";
	try{
/*		var ws = new ActiveXObject("WScript.Shell");
		outputFolder = ws.ExpandEnvironmentStrings("%Temp%");*/
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		outputFolder = fso.GetSpecialFolder(TemporaryFolder);
		//alert(tempFolder);
	}
	catch(e){
		throw e;
	}
	return outputFolder;
}



function myWriteToFile(pathFileName, textToAppend){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		try{
			var ts = fso.OpenTextFile(pathFileName, ForWriting);
		}
		catch(e){
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}


function myAppendToFile(pathFileName, textToAppend){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var ts;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		if (this.existFile(pathFileName)){
			ts = fso.OpenTextFile(pathFileName, ForAppending);
		}
		else{
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
			ts = fso.OpenTextFile(pathFileName, ForAppending);			
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}

// funzione che appende un testo ad un file
// MA se il file supera una dimensione limite 
// (prima della scrittura) lo cancella
// e lo scrive da zero
function myAppendToFileWithFileLimit(pathFileName, textToAppend, limitSize){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var ts;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		if (isNaN(limitSize)){
			throw new Error("Limit size is null");			
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		if (this.existFile(pathFileName)){
			try{
				var f = fso.GetFile(pathFileName);
			}
			catch(e){
				throw new Error("File does not exist");							
			}
			if (f.size>=limitSize){
				// supera, quindi apro in writing
				ts = fso.OpenTextFile(pathFileName, ForWriting);
			}
			else{
				// NON supera, apro in appending
				ts = fso.OpenTextFile(pathFileName, ForAppending);
			}
		}
		else{
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
			ts = fso.OpenTextFile(pathFileName, ForWriting);			
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}





function myDeleteFile(pathFileName){
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(pathFileName);
		f.Delete();
	}
	catch(e){
		throw e;		
	}
}


// NB i ath passati come parametri
// DEVONO avere il path completo di directory + nome file 
function myMoveFile(sourcePathFileName, targetPathFileName){
	try{
		if (sourcePathFileName==""){
			throw new Error("Source path is null");
		}		
		if (targetPathFileName==""){
			throw new Error("Target path is null");
		}				
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(sourcePathFileName);
		f.Move(targetPathFileName);
	}
	catch(e){
		throw e;		
	}	
}
	

// NB i ath passati come parametri
// DEVONO avere il path completo di directory + nome file 
function myCopyFile(sourcePathFileName, targetPathFileName){
	try{
		if (sourcePathFileName==""){
			throw new Error("Source path is null");
		}		
		if (targetPathFileName==""){
			throw new Error("Target path is null");
		}				
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(sourcePathFileName);
		f.Copy(targetPathFileName);
	}
	catch(e){
		throw e;		
	}	
}


function myExistFile(pathFileName){
	var bolExist = false;
	try{
		var f;
		if (pathFileName==""){
			throw new Error("Path file is null");
		}					
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		try{
			f = fso.GetFile(pathFileName);
			try{f.close();}catch(e){;}
			bolExist = true;			
		}
		catch(e){
			// NON esiste
			bolExist = false;
		}
	}
	catch(e){
		throw e;		
	}	
	return 	bolExist ;
}

//@return ritorna dimensione in byte
function myGetFileSize (pathFileName){
	var fileSize = 0;
	try{
		var f;
		if (pathFileName==""){
			throw new Error("Path file is null");
		}					
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		try{
			f = fso.GetFile(pathFileName);
		}
		catch(e){
			// NON esiste
			throw new Error("File does not exist");
		}
		fileSize = f.size;
	}
	catch(e){
		throw e;		
	}		
	return fileSize;
}

function myGetElcoClassVersion(){
	return this.classVersion;
}



function getDateTimeNow(){
	var strOutput = "";
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	strOutput = day + "/" + month + "/" + year;
	
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var second = currentTime.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	strOutput = strOutput + " - " + hours + ":" + minutes + ":"	+ second;
	return strOutput;
}


//var clsElcoJsLogFileObject = new ElcoJsLogFileObject();
ElcoJsLogFileObject.prototype.createFile = myCreateFile;
ElcoJsLogFileObject.prototype.getUserTempFolder = myGetUserTempFolder;
ElcoJsLogFileObject.prototype.writeToFile = myWriteToFile;
ElcoJsLogFileObject.prototype.appendToFile = myAppendToFile;
ElcoJsLogFileObject.prototype.deleteFile = myDeleteFile;
ElcoJsLogFileObject.prototype.moveFile = myMoveFile;
ElcoJsLogFileObject.prototype.copyFile = myCopyFile;
ElcoJsLogFileObject.prototype.existFile = myExistFile;
ElcoJsLogFileObject.prototype.getFileSize = myGetFileSize;
ElcoJsLogFileObject.prototype.appendToFileWithFileLimit = myAppendToFileWithFileLimit;
ElcoJsLogFileObject.prototype.getElcoClassVersion = myGetElcoClassVersion;
ElcoJsLogFileObject.prototype.getSaveDateTimeEachRow = myGetSaveDateTimeEachRow;
ElcoJsLogFileObject.prototype.setSaveDateTimeEachRow = mySetSaveDateTimeEachRow;


// *****************************************************************

// includo file di logging
//document.write("<script type='text/javascript' src='../jsElcoFileObject.js'></script>")

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
	try{
		azione = azione.toUpperCase();
		performAction(azione, objUtente, objStudio, additionalParameters);
	}
	catch(e){
		scriviLog("** actionPacs - Error: " + e.description);		
		alert("actionPacs - Error: " + e.description);		
	}

}

// funzione che esegue 'materialmente'
// l'azione sul pacs
// objUtente e objStudio derivano da basePacsUser e basePacsStudy 
// che sono implementati nel frame nascosto e contengono le info per la sincro
// questa funzione viene richiamata da checkNuAGFAagesOnCareStreamEngine.js
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
	var handleImpax;
	
	var epicFrame ;

	globalAction = azione;	
	//alert("action on IMPAX: " + azione);
	scriviLog("performAction - action: " + azione);
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
		
		switch (azione)
		{
		case "LOGIN":
			try{
				handleImpax = document.all.clsKillHome.getHandle("IMPAX 6.4", true);
			}
			catch(e){
				alert(e.description);
			}
			if (handleImpax !=""){
				// in esecuzione
				loginToImpax();
			}
			else{
				// devo lanciarlo
				launchImpaxApp();
			}

			return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			openStudies(patientId, basePacsStudy.ACCNUM);		
			return;	
		case "EDITPASSWORD":
			return;
		case "SHOWSTUDY":
			// chiudo tutti i canvas aperti
			closeAllStudies();
			// apro quelli nuovi
			openStudies(patientId, basePacsStudy.ACCNUM);
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
			closeAllStudies();
			logoutImpax();	
			return;		
		default:
			return;
		}
	}
	catch(e){
		scriviLog("** performAction - Error: " + e.description);				
		alert("performAction - Error: " + e.description);
	}
	

}



// lancia l'exe
function launchImpaxApp(){
	var pathToRun = "";
	
	try{
		if (typeof(pathToKill) == "undefined"){
			//alert("Attenzione il campo configura_pc.IMPAX_EXE_PATH non esiste!");
			pathToRun = "" ;
		}
		else{
			pathToRun = basePC.IMPAX_EXE_PATH ;
		}
		if (pathToRun==""){
			// uso il default
			pathToRun = impaxExePathDEFAULT;
		}
		else{
			pathToRun = "\""+ pathToRun + "\"";
		}
		//alert("launchImpaxApp - " + pathToRun);
		scriviLog("launchImpaxApp - Run: " + pathToRun);		
		myOpenShell(pathToRun,1);
		// dopo un intervallo prestabilito
		window.setTimeout("loginToImpax()", timeoutToLogInImpax);
	}
	catch(e){
		scriviLog("** launchImpaxApp - Error: " + e.description);						
		alert("launchImpaxApp - Error: " + e.description);
	}
}




function loginToImpax(){
	var ContextServerConnector;	
	var pwdCrypted="";
	var oggettoAgfa ;
	try{
		//alert("loginToImpax - " + baseUser.LOGIN + " - " + pwdDecrypted);
		scriviLog("loginToImpax - " + baseUser.LOGIN + " - [hide pwd]");
		try{
			ContextServerConnector = new ActiveXObject("mitra_context_server.connector_class");
			agfaContextServerObject = ContextServerConnector.ContextServer;
			// esempio event hooking 
			try{
				// var status = agfaContextServerObject.attachEvent("PerformUserValidationTrigger", handlePerformUserValidationTrigger);
			}
			catch(e){
				alert("Can't attach event handler");
			}
			
		}
		catch(e){
			scriviLog("** loginToImpax - createContextServerObject - Error: " + e.description);
			alert("loginToImpax - createContextServerObject - Error: " + e.description);
		}
		if (agfaContextServerObject){
			
			agfaContextServerObject.UserName = baseUser.LOGIN;
			oggettoAgfa = new ActiveXObject("agfaInterface.agfaPwdClass");
			if (oggettoAgfa){
				pwdCrypted= oggettoAgfa.EncryptPasswordAsByte(pwdDecrypted);
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
			scriviLog("agfaContextServerObject created,  Perform UserValidation");
			agfaContextServerObject.PerformUserValidation();
			//logToScreen("login OK " + user +" " + password);
		}
	}
	catch(e){
		scriviLog("** loginToImpax - Error: " + e.description);		
		alert("loginToImpax - Error: " + e.description);
	}
}

// accessionNumber lista di accNum splittati da *
function openStudies(patID, accessionNumber){
	var regEx = /\*/g;
	var lista;
	var i = 0;
	var bolUseEpic = false;
	var urlForEpic = "";
	var strTmp = "";
	var aetitleEsame = "";
	var finestra;
	
	try{
		
		//alert("openStudies - " + patID + " - " + accessionNumber);		
		scriviLog("openStudies PatdID: " + patID +" accessionNumber: " + accessionNumber);
		lista = accessionNumber.split("*");
		// basePC.IP
		// inserire controllo su utilizzo alternativo !!!
		if ((basePC.IP=="WS-OMRADIO4")||(basePC.IP=="WS-OMVRADIO7")){
			try{
				/*
				if (descrAeTitlePC==""){
					scriviLog("Aetitle del pc NULLO quindi uso OCX");
					bolUseEpic = false;
				}	
				else{			
					aetitleEsame = basePacsStudy.AETITLE.split("*")[0];
					if (descrAeTitlePC==aetitleEsame){
						scriviLog("Aetitle del pc e della sala uguali: " + descrAeTitlePC);
						// uguale
						// uso activex
						bolUseEpic = false;
					}
					else{
						// diverso
						// uso epic mcs
						scriviLog("Aetitle diversi, del pc: " + descrAeTitlePC + " della esame/sala: " + aetitleEsame);
						bolUseEpic = true;
					}
				}*/
				myReparto = basePacsStudy.REPARTO.split("*")[0];
				if ((myReparto != 'OMV')&&(myReparto != 'OAS')&&(myReparto != 'AMBPAC')&&(myReparto != 'AMBTOS')&&(myReparto != 'AMBRID')){
					bolUseEpic = true;				
				}
			}
			catch(e){ 
				bolUseEpic = false;			
			}
			// **************************
			
			// devo verificare quale modalità usare: ocx o EpicMcs
			if (bolUseEpic){
				scriviLog("Call EpicMcs");
				epicFrame = getEpicIframe();
				//alert("creato iframe");
				if (epicFrame){
					// ** test
					//epicFrame.src = "http://www.google.com";
					// *********
					// compongo url
					urlForEpic = urlEpicMcs;
					urlForEpic += "patientid=" + patID;
					for (i=0;i<lista.length;i++){
						if (strTmp==""){
							strTmp = lista[i];
						}	
						else{
							strTmp += "|" + lista[i];
						}
					}
					urlForEpic += "&accession=" + strTmp;
					urlForEpic += "&user=" + baseUser.LOGIN + "&password=" + pwdDecrypted;
					// devo comunque fare login ??????????
					// epicFrame.src = urlEpicMcs + "user=" + baseUser.LOGIN + "&password=" + pwdDecrypted
					// epicFrame.src = urlForEpic;
					// ***
					// devo comunque fare clearAll ??????
					// epicFrame.src = urlEpicMcs ;
					// epicFrame.src = urlForEpic;				
					// ******
					scriviLog("Url to call: " + urlForEpic);
					//alert (urlForEpic);
					epicFrame.src = urlForEpic; 
				}
				//alert("apro la finestra "+ urlForEpic);
				//finestra = window.open(urlForEpic,"wndEpicMcs","top=0,left=0,width=300,height=300");
				//alert("finestra aperta!"); 
			}
			else{
				scriviLog("Use Com interface (classic integration)");
				//alert("Uso interfaccia COM");
				// metodo classico
				if (agfaContextServerObject){
					for (i=0;i<lista.length;i++){
						agfaContextServerObject.DoAction("ADD_TO_DISPLAY_LIST",patID,lista[i],"");
						agfaContextServerObject.DoAction("SYNC_DISPLAY",patID,lista[i],"");
					}
		//			logToScreen("openStudies OK " + patID + " " + accessionNumber);
				}	
			}
		} // fine controllo su IP per test
		else{
			// metodo classico x tutte le altre workstation
			if (agfaContextServerObject){
				for (i=0;i<lista.length;i++){
					agfaContextServerObject.DoAction("ADD_TO_DISPLAY_LIST",patID,lista[i],"");
					agfaContextServerObject.DoAction("SYNC_DISPLAY",patID,lista[i],"");
				}
	//			logToScreen("openStudies OK " + patID + " " + accessionNumber);
			}	
		}
	}
	catch(e){
		scriviLog("** openStudies - Error: " + e.description + " PatID: " + patID + " AccNum: " + accessionNumber);		
		alert("openStudies - Error: " + e.description);
	}
 }


function closeAllStudies(){
	try{
		//alert("closeAllStudies");
		scriviLog("closeAllStudies");				
		if (agfaContextServerObject){
			agfaContextServerObject.DoAction("REMOVE_ALL_FROM_WORKLIST","","","");
			// forse non è necessario la chiamata di sotto
			agfaContextServerObject.DoAction("BLANK_DISPLAY","","","");
			//logToScreen("closeAllStudies OK");
		}
	}
	catch(e){
		scriviLog("** closeAllStudies - Error: " + e.description );				
		alert("closeAllStudies - Error: " + e.description);
		
	}
}

function logoutImpax(){
	try{
		scriviLog("logoutImpax");				
		if (agfaContextServerObject){
			agfaContextServerObject.DoAction("LOGOUT","","","");
			agfaContextServerObject.DoAction("LOGOUT","","","");
			//logToScreen("logout OK");			
			window.setTimeout("killaImpax()", 2000);
 		}
	}
	catch(e){
		scriviLog("** logoutImpax - Error: " + e.description );						
		alert("logoutImpax - Error: " + e.description);

	}
}

function killaImpax(){
	var strTmp = "";
	var pathToKill= "";
	try{
		try{
			pathToKill = basePC.PROCESSO_IMPAX;
		}
		catch(e){
			pathToKill = nomeProcessoImpaxDEFAULT;
		}

		if (typeof(pathToKill) == "undefined"){
			//alert("Attenzione il campo configura_pc.PROCESSO_IMPAX non esiste!");	
			pathToKill = nomeProcessoImpaxDEFAULT ;
		}
		else{
			pathToKill = basePC.PROCESSO_IMPAX	;
		}
		//alert("Kill - ##" + pathToKill +"##");				
		if (pathToKill==""){
			// uso il default
			pathToKill = nomeProcessoImpaxDEFAULT;
		}
		//clsKillHomeJsObject.getHandle("IMPAX 6.4", false);
		scriviLog("kill pocess: "+ pathToKill);				
	 	myOpenShell("taskkill.exe /im " + pathToKill,2);
	}
	catch(e){
		scriviLog("** killaImpax - Error: " + e.description );								
		alert("killaImpax - Error: "  + e.description);
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
		valore = valore.replace("Program Files","Programmi");
		try{
			ReturnCode = shell.Run(valore, windowMode, true);
		}
		catch(e1)
		{
			scriviLog("** myOpenShell - Error: " + e.description );
			alert("myOpenShell - Error: " + e1.description + " launc " + valore);
		}
	}
}


function scriviLog(testo){
	var logObj;
	try{

		logObj = new ElcoJsLogFileObject();
		logObj.setSaveDateTimeEachRow(true);
		logObj.appendToFileWithFileLimit(logObj.getUserTempFolder() +"\\" + logFileName, testo, logFileLimitSize);
	}
	catch(e){
		alert("scriviLog - Error: " + e.description);
	}		
}

function getEpicIframe(){
	
	var iFrameObj ;
	var oggetto;
	var epicFrame;
	
	try{
		epicFrame = document.getElementById(iFrameId4EpicMcs);
		if (epicFrame){
			return epicFrame;
		}
		else{
			iFrameObj =  document.createElement("IFRAME");
			//iFrameObj.src = "vocalchat.html";	
			//iFrameObj.className = "iframeVocalBox";
			iFrameObj.style.height = "300px";
			iFrameObj.style.width = "300px";			
			iFrameObj.id = iFrameId4EpicMcs;			
			//iFrameObj.onreadystatechange = function(){alert('Caricato!');};		
			oggetto = document.body;
			if (oggetto){
				oggetto.appendChild(iFrameObj);
			}
			return iFrameObj
		}
		
	}
	catch(e){
		alert("creaIframe " + e.description);
	}
}



function getAetitleInfo(iden){
	//alert("Carico le keyimages dentro iframe");
	
	var sql = "";
	var lista ;
	var strWhere = "";
	
	if (iden==""){return;}
	try{
		
		// verifico che ci siano delle immagini chiave associate
		// se esistono allora le carico
		strWhere = "iden = " + iden;
		sql = "select descr from tab_aetitle";
		sql += " where (" +strWhere + ")";
		scriviLog("** loadAeTitleInfo - sql: " + sql);		
		getXMLData("",parseSql(sql),"callbackGetInfoExamViaXml");		
	}
	catch(e){
		alert("getInfoExamViaXml - " + e.description);
	}
}

var descrAeTitlePC = "";
// funzione che viene chiamata in automatico
// dopo che sono state reperite le immagini chiave
function callbackGetInfoExamViaXml(xmlDoc){
	var descr = "";
	var rowTagObj;
	var chiaveTagObj;
	var chiaveValue;
	
		
	try{
		if (xmlDoc){
			// webuser
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			if (rowTagObj){
				for (var i=0; i < rowTagObj.length; i++){
					// ciclo nelle righe
					// chiave
					chiaveTagObj = rowTagObj[i].getElementsByTagName("DESCR")[0];
					chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
					if (descr==""){
						descr = chiaveValue;
					}
					else{
						descr += "@" + chiaveValue;
					}
				}
			}
		}			
		descrAeTitlePC = descr;
		scriviLog("Aetitle del PC: " + descrAeTitlePC);		
	}
	catch(e){
		alert("callbackGetInfoExamViaXml - " + e.description);
	}
	
}

