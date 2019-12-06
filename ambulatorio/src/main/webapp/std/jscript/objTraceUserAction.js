// uso struttura JSon
var objTraceUserAction = {"userAction": [
        {"action": "", "iden_anag": "", "iden_esame": "" , "iden_ref":""}
    ]
};

var callBackFunctionAfterAjaxTrace = "";

// resetta oggetto per tracciatura
function resetTraceUserObject(){
	objTraceUserAction.userAction[0].action = "";
	objTraceUserAction.userAction[0].iden_anag = "";
	objTraceUserAction.userAction[0].iden_esame = "";
	objTraceUserAction.userAction[0].iden_ref = "";	
}

// richiamo funzione ajax
// per salvare oggetto globale objTraceUserAction
// ATTENZIONE mettere queste 2 funzioni in objTraceUserAction.js
function callTraceUserAction(){
	// modifica del 26-2-2015
	// non ha + senso tracciare
	// comporta solo dei problemi
	return;				
	try{
//		alert(JSON.stringify(objTraceUserAction));
		ajaxTraceUserAction.saveAction(JSON.stringify(objTraceUserAction), replyTraceUserAction);
	}
	catch(e){
		//alert("callTraceUserAction " + e.description);
	}
}


var replyTraceUserAction = function(returnValue){
	return;
}

// verifica quale è 
// l'ultima azione compiuta dall'utente
function callGetLastActionUser(user, myCallBack){
	callBackFunctionAfterAjaxTrace = myCallBack;
	try{
		ajaxTraceUserAction.getLastAction(user, replyGetLastActionUser);
	}
	catch(e){
		alert("callGetLastActionUser " + e.description);
	}	
}

var replyGetLastActionUser = function(returnValue){
	var tmp = "";
	var objTmp = "";

	try{	
		objTmp = JSON.parse(returnValue);
		objTraceUserAction.userAction[0].action = objTmp.action;
		objTraceUserAction.userAction[0].iden_anag = objTmp.idenAnag;
		objTraceUserAction.userAction[0].iden_esame = objTmp.idenEsame;
		objTraceUserAction.userAction[0].iden_ref = objTmp.idenRef;		
		if (callBackFunctionAfterAjaxTrace!=""){
			tmp = callBackFunctionAfterAjaxTrace;
			callBackFunctionAfterAjaxTrace = "";
			eval(tmp);
		}
	}
	catch(e){
		alert("replyGetLastActionUser - " + e.description);
	}	
	
}
