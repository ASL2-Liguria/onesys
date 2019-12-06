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
	var strAccessionNumber="";
	var strAetitle = "";
	var datiDaMandare = "";
	var regEx = /\*/g;
	
	//alert("azione: " + azione);
	
	if (azione=="")
	{
		return;
	}
	if (stopCalling == true){
		clearInterval(myTimer);
		stopCalling = false;
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
		switch (globalAction)
		{
		case "LOGIN":
				createISRobject();
				return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			listaEsami = basePacsStudy.ACCNUM.split("*");
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
	try{
		hndISITEwindow = window.open("","","top=200, left=200, width=" + parseInt(screen.availWidth - 200) +", height=" + parseInt(screen.availHeight - 200));
		hndISITEwindow.document.write('<OBJECT id="Radiology" CLASSID = "clsid:AA8570C0-DFF9-45d2-8843-2179776CEF24" height="100%" width="100%" ></OBJECT>');
		hndISITEwindow.document.write('<OBJECT width=0 height=0  classid="clsid:550dda30-0541-11d2-9ca9-0060b0ec3d39" id="xmldso"></OBJECT>');	
		window.setTimeout("InitializeISR()", 1000);
	}
	catch(e){
		alert("createISRobject - Error: "+ e.description);
	}
	
}



function InitializeISR()
{
	var oggetto
	try{
//		alert("bInitialized: " + bInitialized);	
		// only initialize once
		if (!bInitialized)
		{

			oggetto = hndISITEwindow.document.getElementById("Radiology");	
			oggetto.iSyntaxServerIP = "10.67.214.12";
			oggetto.iSyntaxServerPort = "6464";
			oggetto.ImageSuiteURL = "http://10.67.214.12/iSiteWeb/WorkList/PrimaryWorkList.ashx";
			/// IMPORTANTISSIMO !!!
			oggetto.Options = "StentorBackEnd";			
			oggetto.ImageSuiteDSN = "iSite";
			if (oggetto.Initialize())
			{
				bInitialized = true;
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
		utente = "philips";
		password = "polaris";
		authsource = "spedalibs.it";
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		if (oggetto){
			login_iSiteSuccess = oggetto.Login(utente,password,authsource, "", "");
			if (login_iSiteSuccess){
				window.setTimeout("top.focus()", 1000);			
			}
		}
		else{
			alert("Can't find Isite object!!");
		}
	}
	catch(e){
		alert("iRadiology_login \n" + L_strLoginError_Message + "\n" + e.description)
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
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			return;
		}
			
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		listaAccnum	= arrayAccessionNumber;	
		
		patId = patientId;
		
		//alert("try to find accNum " + accnum + " patId: " + patId);
		// DEVE essere parametrizzato il terzo parametro di findExam
		organization = "BRESCIA";
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
			listaIDX[i] = IDXIntExamID;
		}
		
		for (i=0;i<listaIDX.length;i++){
			if(listaIDX[i]!=""){
				bolNoStudy = false;
				break;
			}
			else{
				bolNoStudy = true;
			}
		}		

		if (bolNoStudy){
			alert("Lo studio non ha immagini.");
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
	
	try{
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		
		for (i=0;i<listaIDX.length;i++){
			//alert("try to open canvas for: " + IDXIntExamID);
			CanvasPageID = oggetto.OpenCanvasPage(listaIDX[i], "", true, true, bolOpenNewCanvas);
			//alert("CanvasPageID " + CanvasPageID);
			if ((CanvasPageID == "")&&(listaIDX.length==1))
			{
				// sono nel caso di un solo esame
				//error = oggetto.GetLastErrorCode();
				alert("Nessuna immagine trovata per l'esame con Accession number: " + listaAccnum[i]);
				return;
			}		
			else{
				// tutto OK 
				// aggiorno la lista delle canvas aperte
				listaEsamiIsite.put(patId + "*" + listaAccnum[i],CanvasPageID);
			}
		}
//		document.getElementById("CanvasPageID").value = CanvasPageID;		
	}
	catch(e){
		alert("iRadiology_openCanvas - error: " + e.description);
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
		
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
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
			return;
		}
	}
	catch(e){
		alert("closeAllCanvas - Error: " + e.description);
	}
}


// funzione che chiuder
// la canvas specifica
function iRadiology_closeCanvas(cID){


	var CanvasPageID;
	var strRetVal
	var error
	var oggetto ;
	try{
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			return;
		}		
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		CanvasPageID = cID;	
		if (CanvasPageID==""){
			//alert("CanvasPageID is null");
			return;
		}			
		strRetVal = oggetto.CloseCanvasPage(CanvasPageID, false);
		if (strRetVal == "")
		{
			error = oggetto.GetLastErrorCode();
			//alert("CloseCanvas - error " + error);
			return;
		}		
	}
	catch(e){
		alert("iRadiology_closeCanvas - error: " + e.description);
	}
}

function iRadiology_Logout(){

	var bRetVal
	var error	
	var oggetto ;
	try{
		
		if (!login_iSiteSuccess){
			alert("Utente non autenticato sul pacs");
			return;
		}		
		oggetto = hndISITEwindow.document.getElementById("Radiology");
		bRetVal = oggetto.Logout();
		if (bRetVal == false)
		{
			error = oggetto.GetLastErrorCode();
			alert("Logout - error " + error);
			return;
		}
		try{hndISITEwindow.close()}catch(e){;}
		
	}
	catch(e){
		alert("iRadiology_Logout - error: " + e.description);
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

