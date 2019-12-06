// JavaScript Document 

var flg_pwd_cambiata = "1";
var globalAction = "";
var logFileName = "logPol2Centr.log";
// valore massimo di log, espresso in byte
// setto un megabyte
var logFileLimitSize = "1048576";


// oggetto COM per integrazione Centricity
var clsFoInt = new ActiveXObject("geF_officeInterface.clsFoInt");	
// indica se centricity è già
// stato inizializzato
var bolCentricityInit = false;



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


function initObjCom(){
	var err_descr;
	var bol = false;
		try{
			scriviLog("call InitGEObject");
			if (clsFoInt.InitGEObject(err_descr)==false)
			{
				scriviLog("Error on call InitGEObject");
			}				
			else{
				bol = true;
			}
		}
		catch(e){
			alert("initObjCom - Error: "+ e.description);
		}
		return bol;
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
	
	
	

	globalAction = azione;	
	var lista;
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
				
				scriviLog("call login method user: " + baseUser.LOGIN + " pwd: "+ pwdDecrypted);
				if (clsFoInt.login(baseUser.LOGIN ,pwdDecrypted,err_descr)==false)
				{
					scriviLog("Error on call login method");
				}				
			}
			catch(e){
				alert(e.description);
			}
			return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			
			if (!bolCentricityInit){
				bolCentricityInit = initObjCom();
			}
			scriviLog("call OpenExamsByAccessionNumber method, list accNum: " + basePacsStudy.ACCNUM);
			if (clsFoInt.OpenExamsByAccessionNumber(basePacsStudy.ACCNUM,err_descr)==false){
				scriviLog("Error on call OpenExamsByAccessionNumber method");
			}
			return;	
		case "EDITPASSWORD":
			if (!bolCentricityInit){
				bolCentricityInit = initObjCom();
			}
			scriviLog("call ChangePassword method ");
			// non supportato, al momento
			if(clsFoInt.ChangePassword(afterChangePwd_vecchiaPwd,pwdDecrypted,err_descr)==false)
			{
				scriviLog("Error on call ChangePassword method");
			}			
			return;
		case "SHOWSTUDY":
			// chiudo tutti i canvas aperti
			// closeAllStudies();
			// apro quelli nuovi
			// openStudies(patientId, basePacsStudy.ACCNUM);
			if (!bolCentricityInit){
				bolCentricityInit = initObjCom();
			}
			scriviLog("call OpenExamsByAccessionNumber, list accNum: " + basePacsStudy.ACCNUM);
			if (clsFoInt.OpenExamsByAccessionNumber(basePacsStudy.ACCNUM,err_descr)==false){
				scriviLog("Error on call OpenExamsByAccessionNumber method");
			}			
			return;
		case "CLOSE_CURR_SESSION":
			if (!bolCentricityInit){
				bolCentricityInit = initObjCom();
			}
			scriviLog("call CloseAllExams method ");
			if (clsFoInt.CloseAllExams(err_descr)==false)
			{
				scriviLog("Error on call CloseAllExams method");
			}				
			return;
		case "LOCKWORKSTATION":
			return;
		case "UNLOCKWORKSTATION":
			return;	
		case "DEALLOCATE":
			return;
		case "QUIT":
			if (!bolCentricityInit){
				bolCentricityInit = initObjCom();
			}
			scriviLog("call CloseAllExams method ");
			if (clsFoInt.CloseAllExams(err_descr)==false)
			{
				scriviLog("Error on call CloseAllExams method");
			}				
			scriviLog("call Quit method ");					
			if (clsFoInt.Quit(err_descr)==false)
			{
				scriviLog("Error on call Quit method");
			}		
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


