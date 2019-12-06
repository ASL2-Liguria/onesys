// uso struttura JSon
var objDrivePc = {"drivePcObj": [
        {"iden":"", "ip": "", "iden_anag": "", "iden_esame": "" , "iden_ref":"", "procedura":"", "utente_chiamante":"", "ip_chiamante":"", "parametri":""}
    ]
};

var callBackFunctionAfterAjaxCall = "";
	

// resetta oggetto per tracciatura
function resetDrivePcObject(){
	objDrivePc.drivePcObj[0].iden = "";	
	objDrivePc.drivePcObj[0].ip = "";
	objDrivePc.drivePcObj[0].iden_anag = "";
	objDrivePc.drivePcObj[0].iden_esame = "";
	objDrivePc.drivePcObj[0].iden_ref = "";	
	objDrivePc.drivePcObj[0].procedura = "";	
	objDrivePc.drivePcObj[0].utente_chiamante = "";	
	objDrivePc.drivePcObj[0].ip_chiamante = "";	
	objDrivePc.drivePcObj[0].parametri = "";		
}


// funzione che setta l'eseguito
// sul record iesimo
// 
function callDrivePc_setEventAsExecuted(idenEvento, callBackFunction){
	try{
		if (idenEvento==""){return;}
		callBackFunctionAfterAjaxCall = callBackFunction;
		ajaxPcManage.ajaxDrivePc_setEventAsExecuted(idenEvento, replyDrivePc_setEventAsExecuted);
	}
	catch(e){
		alert("callDrivePc_setEventAsRead - " + e.description);
	}
}

replyDrivePc_setEventAsExecuted = function(returnValue){
	var tmp = ""
	try{	
		if (callBackFunctionAfterAjaxCall!=""){
			tmp = callBackFunctionAfterAjaxCall;
			callBackFunctionAfterAjaxCall = "";
			eval(tmp);
		}
	}
	catch(e){
		alert("replyDrivePc_setEventAsExecuted - " + e.description);
	}
}

// *********************** crea evento
function callDrivePc_createEvent(callBackFunction){
	
	try{
		callBackFunctionAfterAjaxCall = callBackFunction;	
		// oggettoDrivePc + di tipoJSon
		ajaxPcManage.ajaxDrivePc_createEvent(JSON.stringify(objDrivePc),replyDrivePc_createEvent);
	}
	catch(e){
		alert("callDrivePc_createEvent - " + e.description);
	}
}

replyDrivePc_createEvent = function(returnValue){
	var tmp = ""
	
	// returnvalue è di tipo JSON
	try{	
//		alert(returnValue);
//		alert(returnValue.stringify);	
		if (callBackFunctionAfterAjaxCall!=""){
			tmp = callBackFunctionAfterAjaxCall;
			callBackFunctionAfterAjaxCall = "";
			eval(tmp);
		}
	}
	catch(e){
		alert("replyDrivePc_createEvent - " + e.description);
	}	
	
}