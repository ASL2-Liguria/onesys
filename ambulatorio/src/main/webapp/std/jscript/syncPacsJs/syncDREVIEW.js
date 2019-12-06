// JavaScript Document
// JavaScript Document
var flg_pwd_cambiata = "1";

var primoAccNumAperto = "";
var globalAction = "";

var L_strInitError_Message = "Error Initializing DReview"; 
var L_strLoginError_Message = "Error Logging in"; 
var login_DReviewSuccess = false;

window.error = HandleError;

var bInitialized = false;

// oggetto DReview
var objDReview ;
var timerTimeout ;
var timeOutAttivazioneShowStudy = 1000;




function sendToWebPacs(azione, objUtente, objStudio, additionalParameters){

	var regEx = /\*/g;
	var strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
	var strAetitle = objStudio.AETITLE.split("*")[0];
	
	
	
	alert("sendToWebPacs DReview");
	return;
	if (azione == "SHOWSTUDY_STUDY"){
		// prima cosa da fare è verificare dove andare a prendere le immagini
		// quindi devo interrogare l'archivio systemv per sapere l'aetitle
		// per far ciò chiamo checkNumImagesOnCareStreamEngine
		globalUtente = objUtente;
		globalStudio = objStudio;
	}
	else{
		// paziente
		performAction (azione, objUtente, objStudio, additionalParameters);
	}
}







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
// questa funzione viene richiamata da checkNumImagesOnCareStreamEngine.js (*solo* x CSH)
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
	var strToEval = "";
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
				// faccio corrispondere la login alla
				// creazione dell'oggetto
				createDreviewObject();
				return;
		case "GETCURRENTUSER":
			return;
		case "ADDIMAGES":
			return;	
		case "EDITPASSWORD":
			return;
		case "SHOWSTUDY":
			listaEsami = basePacsStudy.ACCNUM;
			if (objDReview==null){
				createDreviewObject();
			}
			Dreview_closeAllExams();
			// serve ancora temporizzare ?!
			strToEval = "Dreview_showStudy(\""+listaEsami +"\");";
			//alert(strToEval + " codice_idis :" + basePC.CODICE_IDIS);
			timerTimeout = setTimeout(strToEval,timeOutAttivazioneShowStudy);						
			return;
		case "CLOSE_CURR_SESSION":
			Dreview_closeAllExams();			
			return;
		case "LOCKWORKSTATION":
			return;
		case "UNLOCKWORKSTATION":
			return;	
		case "DEALLOCATE":
			return;
		case "QUIT":
			Dreview_Logout();	
			return;		
		default:
			return;
		}
	}
	catch(e){
		alert("performAction - Error: " + e.description)
	}
	

}


function createDreviewObject(){
	try{
		//objDReview = GetObject("DICOMEDBrokerClient.Review");
		//if (objDReview==null){
			alert("try to create object dreview...");
			objDReview = new ActiveXObject("DicomedBrokerClient.Review");
		//}
	}
	catch(e){
		alert("createDreviewObject - Error: "+ e.description);
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


// listaEsame è la stringa DA SPLITTARE
function Dreview_showStudy(listaEsami){
	
	var lista;
	var i=0;
	try{

		lista = listaEsami.split("*");
		if (objDReview!=null){
			try{clearTimeout(timerTimeout);}catch(e){;}
			for (i=0;i<lista.length;i++){
				alert ("add studies " + lista[i] + " , " +  basePC.CODICE_IDIS);
				objDReview.AddStudies(basePC.CODICE_IDIS, lista[i]);
			}
			alert("setusername administrator");
			objDReview.SetUserName("administrator");
			alert("showstudy");
			objDReview.ShowStudies();
		}
	}
	catch(e){
		alert("Dreview_showStudy - Error: " + e.description);
	}	
}

function Dreview_closeAllExams(){
	try{
		if (objDReview!=null){
			objDReview.Clear();
			objDReview.Discard();			
		}
	}
	catch(e){
		alert("Dreview_closeAllExams - Error: " + e.description);
	}
}



function Dreview_Logout(){

	var bRetVal
	var error	
	var oggetto ;
	try{
		if (objDReview!=null){
			objDReview.Discard();			
		}
	}
	catch(e){
		alert("Dreview_Logout - error: " + e.description);
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

