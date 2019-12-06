function initGlobalObject(){
	var regex =new RegExp("&#13&#10" , "g");
	try{
		fillLabels(arrayLabelName,arrayLabelValue);
		if(testoReferto != '' && typeof testoReferto != 'undefined')
		{
			if(testoReferto.substr(0, 2) == '&#'){
				document.frmMain.txtRefStd.innerHTML = testoReferto.toString().replace(regex,"#CRLF#");
				document.frmMain.txtRefStd.value = document.frmMain.txtRefStd.value.toString().replace(new RegExp("#CRLF#" , "g"),"\r\n"); 
			}
			else{
				document.frmMain.txtRefStd.value = decodeURI(testoReferto);
			}
		}
	}
	catch(e){
		alert("initGlobalObject - Error - " + e.description);
	}
}


function resettaBottomFrame(){
	document.location.replace ("blank.htm");
}
