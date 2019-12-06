// JavaScript Document
var flg_pwd_cambiata = "1";

var user_mim = "turbine";
var userPwd_mim = "turbine";

var primoAccNumAperto = "";
var globalAction = "";


var infoMim=new Object();
function initInfoMim(){
	infoMim.ACCNUM = "";
	infoMim.TIMESTAMP = "";
	infoMim.PATID = "";	
	infoMim.KEYCODE = "";	
	infoMim.USERID = "";
	infoMim.PWD = "";
	infoMim.AZIONE = "";
}

// funzione che resetta 
// l'oggetto che descrive le indo
function resetInfoMim(){
	infoMim.ACCNUM = "";
	infoMim.TIMESTAMP = "";
	infoMim.PATID = "";	
	infoMim.KEYCODE = "";	
	infoMim.USERID = "";
	infoMim.PWD = "";
	infoMim.AZIONE = "";	
}




// questa è la funzione base
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
// questa funzione viene richiamata da checkNumImagesOnCareStreamEngine.js
function performAction(azione, objUtente, objStudio, additionalParameters){
	
	var oggettoPacs;
	var err_number
	var err_descr
	var vecchio_acc_num = "";
	var azione_close="";
	var strAccessionNumber="";
	var strAetitle = "";
//	var MP_applicationName="";
	var urlCareStreamToCall = "";
	var abilitazioneSincViaURL = "N";
	var regEx = /\*/g;
	var utente_emergenza_sysv = "";
	var password_emergenza_sysv = "";

	globalAction = azione;
	// bolOpenedConsole indica se la console è aperta o meno
	initInfoMim();
	// inizializzo l'azione da compiere
	infoMim.AZIONE = azione;
	// controllo tipo di sync
	// ****
	
	switch (globalAction)
	{
	case "LOGIN":
			break;
	case "GETCURRENTUSER":
		break;
	case "ADDIMAGES":
		callAjaxMimKeyCalc ();	
		break;	
	case "EDITPASSWORD":
		break;
	case "SHOWSTUDY":
		/*alert ("ACCNUM: " +	basePacsStudy.ACCNUM);
		alert ("AETITLE: " +	basePacsStudy.AETITLE);
		alert ("REPARTO: " +	basePacsStudy.REPARTO);
		alert ("PATID: " +	basePacsStudy.PATID);
		alert ("NODE_NAME: " +	basePacsStudy.NODE_NAME);*/
		callAjaxMimKeyCalc ();
		break;
	case "CLOSE_CURR_SESSION":
		
		if (primoAccNumAperto!=""){
			callAjaxMimKeyCalc ();	
		}
		break;

	case "LOCKWORKSTATION":
		break;
	case "UNLOCKWORKSTATION":
		break;	
		
	case "DEALLOCATE":
		break;
	case "QUIT":
		break;		
	default:
		break;
	}
	

}



function callUrlMim(){
	// devo ciclare su tutti gli esami richiesti	
	var urlToCall = "";
	var urlParam = "";
	
	try{
		//alert("console: "+ bolOpenedConsole) 
		
		if (bolOpenedConsole){
			urlToCall = basePC.URL_PACS_MIM_ACTION;		
			switch (globalAction)
			{
				case "ADDIMAGES":
					urlToCall += "addStudy?";
					break;	
				case "CLOSE_CURR_SESSION":
					urlToCall += "closeView?";				
					break;					
			}			
		}
		else{
			// console chiuse
			urlToCall = basePC.URL_PACS_MIM;
		}

		urlParam = "user_id=" + infoMim.USERID;
		urlParam += "&time=" + infoMim.TIMESTAMP;
		urlParam += "&key=" + infoMim.KEYCODE;
		urlParam += "&acc_no=" + infoMim.ACCNUM;
		
		if (globalAction == "SHOWSTUDY"){
			// chiamo la chiusura 
			if (primoAccNumAperto !=""){
				urlToCall = basePC.URL_PACS_MIM_ACTION;	
				urlToCall += "closeView?";
				urlParam = "user_id=" + infoMim.USERID;
				urlParam += "&time=" + infoMim.TIMESTAMP;
				urlParam += "&key=" + infoMim.KEYCODE;
				urlParam += "&acc_no=" + basePacsStudy.ACCNUM.split("*")[0];			
				urlToCall += urlParam;				
				apriMIMwin (urlToCall);
				primoAccNumAperto = "";
			}
			
			primoAccNumAperto =  basePacsStudy.ACCNUM.split("*")[0];
			// *****************************
			// chiamo l'apertura
			if (bolOpenedConsole){
				urlToCall = basePC.URL_PACS_MIM_ACTION;		
				urlToCall += "showStudies?";				
			}
			else{
				// console chiuse
				urlToCall = basePC.URL_PACS_MIM;
			}			
			urlParam = "user_id=" + infoMim.USERID;
			urlParam += "&time=" + infoMim.TIMESTAMP;
			urlParam += "&key=" + infoMim.KEYCODE;
			urlParam += "&acc_no=" + infoMim.ACCNUM;
			urlToCall += urlParam;
		}
		else{
			urlToCall += urlParam;
		}
		apriMIMwin (urlToCall);

		

	}
	catch(e){
		alert("callURL - Error: " + e.description);
	
	}
	finally{
		resetStudyObject();					
		resetInfoMim();		
	}
	


}

function apriMIMwin(urlToCall){
	try{
		//alert("url:" + urlToCall);
		//return;
		var finestraMim = window.open(urlToCall,"","top=0,left=0,width=1024,height=700, resizeable, scrollbars = yes");
		if (finestraMim){
			finestraMim.focus();
		}
		else
		{
			finestraMim = window.open(urlToCall,"","top=0,left=0,width=1024,height=700, resizeable, scrollbars = yes");
		}
	}
	catch(e){
		alert("apriMIMwin - url: " + urlToCall + " error: "+ e.description);
	}
}


// ********************************
// ********** AJAX ****************
// ********************************

function callAjaxMimKeyCalc (){
	var myData = new Date();
	var listaAccNum ;
	
	
	try{
		
		resetInfoMim();	
		listaAccNum = basePacsStudy.ACCNUM.split("*");
		infoMim.USERID = user_mim;
		infoMim.PWD = userPwd_mim;		
		// GLI PASSO SOLO IL PRIMO ESAME
//		ajaxMimKeyCalc.getHash(infoMim.USERID, basePacsStudy.PATID.split("*")[0], listaAccNum[examIndex], "", infoMim.PWD, replyAjaxMimKeyCalc );
/*
		alert("userid: " + infoMim.USERID);
		alert("patid: " + basePacsStudy.PATID.split("*")[0]);
		alert("accessNum: " +listaAccNum[0]);
		alert("pwd: " + infoMim.PWD		);
		alert("azione: " + globalAction);*/
		if ((globalAction=="CLOSE_CURR_SESSION")&&(primoAccNumAperto!="")){
			dwr.engine.setAsync(false);
			ajaxMimKeyCalc.getHash(infoMim.USERID, "", primoAccNumAperto, "", infoMim.PWD, replyAjaxMimKeyCalc );						
			dwr.engine.setAsync(true);		
		}
		else{
			dwr.engine.setAsync(false);
			ajaxMimKeyCalc.getHash(infoMim.USERID, "", listaAccNum[0], "", infoMim.PWD, replyAjaxMimKeyCalc );						
			dwr.engine.setAsync(true);		
		}
		

		
	}
	catch(e){
		alert("callAjaxMimKeyCalc - error: " + e.description);
		resetStudyObject();					
		resetInfoMim();		
	}
}

var replyAjaxMimKeyCalc = function (returnValue){
	
	var keyCode = "";
	var regex =new RegExp("[*]" , "g");
	
	
	try{
		keyCode = returnValue.split("*")[1];
		infoMim.TIMESTAMP = returnValue.split("*")[0];
		//alert(returnValue);
		// setto proprietà oggetto
		infoMim.ACCNUM = basePacsStudy.ACCNUM.toString().replaceAll("[*]","|");
		// prendo sempre il primo, tanto sono =
		infoMim.PATID = basePacsStudy.PATID.split("*")[0];	
		infoMim.KEYCODE = keyCode;	
		// ****
		if (keyCode==""){
			alert("Key is null. Please check it out");
			return;
		}
		if ((globalAction=="CLOSE_CURR_SESSION")&&(primoAccNumAperto!="")){
			var urlToCall = basePC.URL_PACS_MIM_ACTION;	
			urlToCall += "closeView?";
			var urlParam = "user_id=" + infoMim.USERID;
			urlParam += "&time=" + infoMim.TIMESTAMP;
			urlParam += "&key=" + infoMim.KEYCODE;
			urlParam += "&acc_no=" + primoAccNumAperto;			
			urlToCall += urlParam;				
			primoAccNumAperto = "";
			apriMIMwin (urlToCall);		
			
		}
		else{
			// chiamo pacs
			callUrlMim();		
		}
		
		
	}

	catch(e){
		alert("replyAjaxMimKeyCalc - error: " + e.description);		
		resetStudyObject();					
		resetInfoMim();		
	}
}


String.prototype.replaceAll = function(stringToBeReplaced, stringToReplace)
{
	var strOutput = "";
	
	var regex =new RegExp(stringToBeReplaced , "g");
	return this.replace(regex,stringToReplace);
}

