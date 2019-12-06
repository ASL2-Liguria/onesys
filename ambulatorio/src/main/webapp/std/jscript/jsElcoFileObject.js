// JavaScript Document
/*
esempio inclusione
document.write("<script type='text/javascript' src='Global.js'></script>")
*/

var ElcoJsLogFileObjectVersion = "1.0";

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




