//window.onload=function(){window.resizeTo(400,400);}
function chiudiToolBar()
{
	self.close();
}


function setConsoleOnTop(){
	// faccio retrieve del nome della consolle
	//  che DEVE essere definito nell'opener
	var strObjectToRaise = "";
	var strHndConsolePolaris;
	var returnValue;
	
	try{
		if (opener){
			strObjectToRaise = opener.framesetTitleConsolePolaris;
		}
	}
	catch(e){
		//alert("Error: " +e.description);
	}
	if (strObjectToRaise==""){
		strObjectToRaise = "Polaris";
	}
	try{
		strHndConsolePolaris = document.all.clsKillHome.getHandle(strObjectToRaise, true)
		returnValue = document.all.clsKillHome.HideWindow("", strHndConsolePolaris, true)
		returnValue = document.all.clsKillHome.HideWindow("", strHndConsolePolaris, false)
	}
	catch(e){
		alert("Error on object: "+ e.description);
	}

}