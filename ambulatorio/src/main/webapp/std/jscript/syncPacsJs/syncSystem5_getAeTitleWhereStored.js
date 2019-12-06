// JavaScript Document

// ************************************************************
// ************************ AJAX ******************************
// ************************************************************
function getAeTitleWhereStored(azione, accessionNumber,aetitleTarget){
	
	parAEtitleWhereGettingKeyImages	= ""
	if (accessionNumber==""){return;}
	try{
		dwr.engine.setAsync(false);			
		ajaxRetrieveImgNumber.getAeTitleToCall(azione, accessionNumber,aetitleTarget,replyGetAeTitleWhereStored)
		dwr.engine.setAsync(true);
	}
	catch(e){
		alert("callRetrieveImgNumber: " + e.description)
	}
	
	return parAEtitleWhereGettingKeyImages;
}

// funzione di callback
var replyGetAeTitleWhereStored = function (returnValue){
	
	var aetitleToCall = "";
	var numImg = "";
	var azione = "";
	var node_name = "";

	if (returnValue==""){return ;}
//	alert(returnValue);
	try{
		azione= returnValue.toString().split('*')[0];
		numImg = returnValue.toString().split('*')[1];
		aetitleToCall = returnValue.toString().split('*')[2];
		node_name = returnValue.toString().split('*')[3];
		parAEtitleWhereGettingKeyImages = aetitleToCall;
	}
	catch(e){
		alert("replyRetrieveImgNumber - " + e.description);
	}
	
}