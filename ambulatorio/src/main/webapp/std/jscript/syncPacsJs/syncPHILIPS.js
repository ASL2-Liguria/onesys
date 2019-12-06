// JavaScript Document
// JavaScript Document
var flg_pwd_cambiata = "1";

var primoAccNumAperto = "";
var globalAction = "";

var L_strInitError_Message = "Error Initializing ISR"; 
var L_strLoginError_Message = "Error Logging in"; 
var login_iSiteSuccess = false;

window.error = HandleError;
var listaEsamiIsite = new Hashtable();

var bInitialized = false;
var hndISITEwindow ;


// questa  la funzione base
// che deve sempre esser chiamata
// con la gestione delle STESSE chiamate
function actionPacs(azione, objUtente, objStudio, additionalParameters)
{
	
	WriteLogTemp('Eseguita Chiamata a actionPacs azione:' + azione)
	
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
// questa funzione viene richiamata da checkNumImagesOnCareStreamEngine.js
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
		WriteLogTemp('performAction: globalAction: ' + globalAction +  '  Patient Id=' + patientId )
		switch (globalAction)
		{
		case "LOGIN":
				WriteLogTemp('performAction: *******  TENTATIVO NUOVA LOGIN  *************');
				createISRobject();
				return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":	
			listaEsami = basePacsStudy.ACCNUM.split("*");
			WriteLogTemp('listaEsami : ' + listaEsami)
			iRadiology_query(patientId, listaEsami, false)			
			return;	
		case "EDITPASSWORD":
			return;
		case "SHOWSTUDY":
			// ciclo sui vari esami
			
			listaEsami = basePacsStudy.ACCNUM.split("*");
			// chiudo tutti i canvas aperti
			closeAllCanvas();
			// apro quelli nuovi
			//alert("sto per chiamare query...  " + patientID + "#input#" + basePacsStudy.PATID);
			iRadiology_query(patientId, listaEsami, true)						
			return;
		case "CLOSE_CURR_SESSION":
			closeAllCanvas();			
			return;
		case "LOCKWORKSTATION":
			return;
		case "UNLOCKWORKSTATION":
			return;	
		case "DEALLOCATE":
			return;
		case "QUIT":
			iRadiology_Logout();	
			return;		
		default:
			return;
		}
	}
	catch(e){
		alert("performAction - Error: " + e.description)
	}
	

}


function createISRobject(){
	WriteLogTemp('Tentativo createISRobject')

	try{
		hndISITEwindow = window.open("","","top=200, left=200, width=" + parseInt(screen.availWidth - 200) +", height=" + parseInt(screen.availHeight - 200));
		hndISITEwindow.document.write('<OBJECT id="Radiology" CLASSID = "clsid:AA8570C0-DFF9-45d2-8843-2179776CEF24" height="100%" width="100%" ></OBJECT>');
		hndISITEwindow.document.write('<OBJECT width=0 height=0  classid="clsid:550dda30-0541-11d2-9ca9-0060b0ec3d39" id="xmldso"></OBJECT>');	
		window.setTimeout("InitializeISR()", 1000);
	}
	catch(e){
		WriteLogTemp('createISRobject - Error: '+ e.description)
		alert("createISRobject - Error: "+ e.description);
	}
	WriteLogTemp('createISRobject Riuscito')
}



function InitializeISR()
{
	var oggetto
	WriteLogTemp('Tentativo InitializeISR')
	try{
//		alert("bInitialized: " + bInitialized);	
		// only initialize once
		WriteLogTemp('InitializeISR: bInitialized ' + bInitialized)

		if (!bInitialized)
		{

			oggetto = hndISITEwindow.document.getElementById("Radiology");
			WriteLogTemp('InitializeISR: oggetto trovato');
			oggetto.iSyntaxServerIP = basePC.PH_SERVERIP;
			WriteLogTemp('InitializeISR: Settato IP ' + basePC.PH_SERVERIP);
			oggetto.iSyntaxServerPort = basePC.PH_SERVERPORT;
			WriteLogTemp('InitializeISR: Settato iSyntaxServerPort ' + basePC.PH_SERVERPORT);
			oggetto.ImageSuiteURL = basePC.PH_SERVERURL;
			WriteLogTemp('InitializeISR: Settata Url ' +basePC.PH_SERVERURL);
			/// IMPORTANTISSIMO !!!
			oggetto.Options = basePC.PH_SERVEROPTIONS;			
			WriteLogTemp('InitializeISR: Settato PH_SERVEROPTIONS ' + basePC.PH_SERVEROPTIONS);
			oggetto.ImageSuiteDSN = basePC.PH_SERVERDSN;
			WriteLogTemp('InitializeISR: Settato PH_SERVERDSN ' + basePC.PH_SERVERDSN);
			if (oggetto.Initialize())
			{
				bInitialized = true;
				WriteLogTemp('InitializeISR: oggetto Inizializzato');
         			    window.setTimeout("iRadiology_login()", 1000);
			}
			else
			{
				//alert(L_strInitError_Message)
			}
		}
		else{
			alert("ISR already initialized");
		}		
	}

	catch(e){
		alert("InitializeISR - error: " + e.description);
	}
}


function HandleError(msg, url, lno)
{
	var errMsg = 	"Error Occurred.\n" +
								"Error: " + msg +
								"URL: " + URL +
								"Line: " + lno;
	alert(errMsg);
	return;
}


// log in and show the iRadiology enterprise control in a dialog
// the dialog will open the exam, see ISEDlgJavaScript.htm
// *************************************
function iRadiology_login(){
	var utente
	var password
	var authsource
	var oggetto


	try{
		utente = baseUser.LOGIN;
		WriteLogTemp('iRadiology_login: utente =' + baseUser.LOGIN);
		password = pwdDecrypted;
		WriteLogTemp('iRadiology_login: Password Passata');
		authsource = basePC.PH_AUTHSOURCE;
		WriteLogTemp('iRadiology_login: authsource ='+ basePC.PH_AUTHSOURCE);
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		if (oggetto){
			login_iSiteSuccess = oggetto.Login(utente,password,authsource, "", "");
			WriteLogTemp('iRadiology_login: login_iSiteSuccess =' + login_iSiteSuccess);
			if (login_iSiteSuccess){
				window.setTimeout("top.focus()", 1000);			
			}
		}
		else{
			alert("Can't find Isite object!!");
			WriteLogTemp("Can't find Isite object!!");
		}
	}
	catch(e){
		alert("iRadiology_login \n" + L_strLoginError_Message + "\n" + e.description)
		WriteLogTemp("iRadiology_login \n" + L_strLoginError_Message + "\n" + e.description);
	}
}

// funzione che cerca
// l'id iSite dell'esame
// quindi lo passo alla funzione 
// che aprir il canvas
// bolUseOldCanvas : indica se usare il vecchio canvas aperto ( sempre quello di un solo paziente)
// o meno. Se uso lo stesso canvas vuol dire che visualizzo un precedente
function iRadiology_query(patientId, arrayAccessionNumber, bolOpenNewCanvas){


	var QueryRetVal
	var error
	var IDXIntExamID
	var oggetto
	
	var patId = "";
	var listaAccnum	= "";
	var organization = ""
	
	var listaIDX 
	var i = 0;
	var bolNoStudy = true;

	try{
		//alert("in query...  patientId" + patientID + " acc.num." + arrayAccessionNumber);
		WriteLogTemp('iRadiology_query : tentativo Query')
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			WriteLogTemp("Utente non autenticato sul pacs")
			return;
		}
			
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		WriteLogTemp('iRadiology_query: oggetto trovato')
		listaAccnum	= arrayAccessionNumber;	
		
		patId = patientId;
		
		//alert("try to find accNum " + accnum + " patId: " + patId);
		// DEVE essere parametrizzato il terzo parametro di findExam
		organization = basePC.PH_ORGANIZATION;
		WriteLogTemp('iRadiology_query : organization = ' + basePC.PH_ORGANIZATION);
		if (listaAccnum.length==1){
			listaIDX = new Array()
		}
		else{
			listaIDX = new Array(listaAccnum.length)
		}
		
		for (i=0;i<listaAccnum.length;i++){
			IDXIntExamID = "";
			//alert("patientId: " +patientId +" accNum: " + listaAccnum[i] + " patId: " +patId);
			IDXIntExamID = oggetto.FindExam(listaAccnum[i], patId, organization);	
			//alert("call findExam on Pacs - accNum: " + listaAccnum[i] +" patId: " + patId + " organization: " +organization + " IDXIntExamID: " + IDXIntExamID);
			WriteLogTemp('iRadiology_query :  call findExam on Pacs - accNum: ' + listaAccnum[i] +' patId: ' + patId + ' organization: ' +organization + ' IDXIntExamID: ' + IDXIntExamID );
			listaIDX[i] = IDXIntExamID;
		}
		WriteLogTemp('iRadiology_query : find study');
		for (i=0;i<listaIDX.length;i++){
			if(listaIDX[i]!=""){
				bolNoStudy = false;
				break;
			}
			else{
				bolNoStudy = true;
			}
		}		
		WriteLogTemp('iRadiology_query : studio trovato' +  bolNoStudy );
		if (bolNoStudy){
			alert("Lo studio non ha immagini.");
			WriteLogTemp('iRadiology_query : studio trovato = ' +  bolNoStudy );
			return;
		}
		iRadiology_openCanvas(patientId, listaAccnum, listaIDX, bolOpenNewCanvas)
	}
	catch(e){
		alert("iRadiology_query - error: " + e.description);
	}
}


// apro la canvas e aggiorno anche l'hashtable
// lo aggiungo all'hashtable 
function iRadiology_openCanvas(patientId, listaAccnum,listaIDX, bolOpenNewCanvas){

	var IDXIntExamID = "";
	var CanvasPageID;
	var error ;
	var oggetto 
	
	var patId = "";
	var accnum	= "";
	var i = 0;
	WriteLogTemp('iRadiology_openCanvas start');
	try{
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		WriteLogTemp('iRadiology_openCanvas trovato oggetto');
		for (i=0;i<listaIDX.length;i++){
			//alert("try to open canvas for: " + IDXIntExamID);
			WriteLogTemp('iRadiology_openCanvas try to open canvas for: ' + IDXIntExamID);
			CanvasPageID = oggetto.OpenCanvasPage(listaIDX[i], "", true, true, bolOpenNewCanvas);
			WriteLogTemp('iRadiology_openCanvas open canvas for: ' + IDXIntExamID);

			if ((CanvasPageID == "")&&(listaIDX.length==1))
			{
				// sono nel caso di un solo esame
				//error = oggetto.GetLastErrorCode();
				alert("Nessuna immagine trovata per l'esame con Accession number: " + listaAccnum[i]);
				WriteLogTemp('iRadiology_openCanvas Nessuna immagine trovata per l esame con Accession number: ' + listaAccnum[i]);
				return;
			}		
			else{
				// tutto OK 
				// aggiorno la lista delle canvas aperte
				listaEsamiIsite.put(patId + "*" + listaAccnum[i],CanvasPageID);
			}
		}
		WriteLogTemp('iRadiology_openCanvas CanvasPageID: ' + CanvasPageID);
//		document.getElementById("CanvasPageID").value = CanvasPageID;		
	}
	catch(e){
		alert("iRadiology_openCanvas - error: " + e.description);
		WriteLogTemp('iRadiology_openCanvas - error: ' + e.description);
	}
}

// funzione che badandosi
// sull hashtable "listaEsamiIsite"
// va a chiudere TUTTE le canvas aperte
function closeAllCanvas(){
	try{
		var chiavi
		var i = 0;
		var canvasId = "";
		WriteLogTemp('closeAllCanvas');

		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			WriteLogTemp('closeAllCanvas: Utente non autenticato sul pacs');

			return;
		}		
		
		if(!listaEsamiIsite.isEmpty()){
			chiavi = listaEsamiIsite.keys();
			for (i=0;i<chiavi.length;i++){
				canvasId = listaEsamiIsite.get(chiavi[i]);
				iRadiology_closeCanvas(canvasId);
				listaEsamiIsite.remove(chiavi[i]);
			}	
		}
		else{
			// nessun esame aperto
			WriteLogTemp('closeAllCanvas - Nessum Esame Aperto')
			return;
		}
	}
	catch(e){
		alert("closeAllCanvas - Error: " + e.description);
		WriteLogTemp('closeAllCanvas - Error: ' + e.description);

	}
}


// funzione che chiuder
// la canvas specifica
function iRadiology_closeCanvas(cID){


	var CanvasPageID;
	var strRetVal
	var error
	var oggetto ;
	WriteLogTemp('iRadiology_closeCanvas');
	try{
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			WriteLogTemp('iRadiology_closeCanvas : Utente non autenticato sul pacs');
			return;
		}		
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		WriteLogTemp('iRadiology_closeCanvas : trovato oggetto');
		CanvasPageID = cID;	
		if (CanvasPageID==""){
			//alert("CanvasPageID is null");
			return;
		}			
		WriteLogTemp('iRadiology_closeCanvas : close ' + CanvasPageID);
		strRetVal = oggetto.CloseCanvasPage(CanvasPageID, false);
		if (strRetVal == "")
		{
			error = oggetto.GetLastErrorCode();
			//alert("CloseCanvas - error " + error);
			WriteLogTemp('iRadiology_closeCanvas : errore : ' + error );
			return;
		}		
	}
	catch(e){
		alert("iRadiology_closeCanvas - error: " + e.description);
		WriteLogTemp('iRadiology_closeCanvas : errore : ' + e.description);
	}
}

function iRadiology_Logout(){

	var bRetVal
	var error	
	var oggetto ;
	WriteLogTemp('iRadiology_Logout');
	try{
		
		if (!login_iSiteSuccess){
			WriteLogTemp('iRadiology_Logout : Utente non autenticato sul pacs');
			alert("Utente non autenticato sul pacs");
			return;
		}		
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		WriteLogTemp('iRadiology_Logout : trovato oggetto');
		WriteLogTemp('iRadiology_Logout : tentativo Logout');
		bRetVal = oggetto.Logout();
		if (bRetVal == false)
		{
			error = oggetto.GetLastErrorCode();
			alert("Logout - error " + error);
			WriteLogTemp('iRadiology_Logout : errore Logout : ' + error );
			return;
		}
		WriteLogTemp('iRadiology_Logout : chiudo pagina pacs');
		try{hndISITEwindow.close()}catch(e){;}
		
	}
	catch(e){
		alert("iRadiology_Logout - error: " + e.description);
		WriteLogTemp('iRadiology_Logout : errore : ' + e.description);
	}	
}



// ********************************
// ********** AJAX ****************
// ********************************


String.prototype.replaceAll = function(stringToBeReplaced, stringToReplace)
{
	var strOutput = "";
	
	var regex =new RegExp(stringToBeReplaced , "g");
	return this.replace(regex,stringToReplace);
}

function WriteLogTemp(stringa){
try{

	var d = new Date();
	var Day = d.getDate();
	var H = d.getHours();
	var M = d.getMinutes();
	var Sec = d.getSeconds();
	var Mlsec= d.getMilliseconds();
	var DataOra = Day + ' ' + H +':'+M+':'+Sec+':' +Mlsec;
	var Str = DataOra + ' '+ stringa;
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var path = fso.GetSpecialFolder(2);

	 var  a, ForAppending;
	  ForAppending = 8;
	  var File_Log;

	  File_Log=path+"\\Sync_Philips.txt";
  
	  if (!fso.FileExists(File_Log))
		{
			fso.CreateTextFile (File_Log);
		}
	  a = fso.OpenTextFile(File_Log, ForAppending, false);
	  a.Write(Str );
	  a.WriteBlankLines(1);
	  a.Close();
	}	catch(e){
		alert()
	}

}
