// JavaScript Document
// questa funzione verrà
// chiamata da ogni "anello" che 
// sarà interessato dall'evento da gestire
function evalDrivePcEvent(){
	
	return;
	
	var evento = "";
	var idenRef = "";
	var idenAnag="";
	var idenEsa=""
	var indice = 0;
	var indexToSelect;
	var idenEvento = "";
	
	evento = parent.opener.parent.parent.hideFrame.objDrivePc.drivePcObj[0].procedura;
	idenEsa = parent.opener.parent.parent.hideFrame.objDrivePc.drivePcObj[0].iden_esame;
	idenAnag = parent.opener.parent.parent.hideFrame.objDrivePc.drivePcObj[0].iden_anag;
	idenEvento = parent.opener.parent.parent.hideFrame.objDrivePc.drivePcObj[0].iden;
	listaIdenEsa = idenEsa.split("*");
	if (evento==""){return;}
	try{
		switch(evento){
			case "CONSOLE":
				// resettare l'evento 			
				parent.opener.parent.parent.hideFrame.resetDrivePcObject();
				// devo settare eseguito 
				parent.opener.parent.parent.hideFrame.callDrivePc_setEventAsExecuted(idenEvento,"");
				break;
			default:
				break;
		}
	}
	catch(e){
		alert("worklistDrivePcEvent.evalDrivePcEvent - " + e.description);
	}	
}


	


