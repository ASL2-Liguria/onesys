// JavaScript Document

var dicomThreadOver= false;


// file specifico per systemV
// per fare il retrieve delle keyimages
// NB se si usa DWR
// chiamare
// 	dwr.engine.setAsync(false);
//	dwr.nomeFunzione(par_dwr, callback);
//	dwr.engine.setAsync(true);
// per far si che non continui la procedura
var parAEtitleWhereGettingKeyImages =""; 

// effettua retrieve img chiave
// sull'aetitle specificato
function retrieveKeyImages(iden_anag, accNumber, strAETITLE, strIdenRef){
	//alert(iden_anag + "#"+  accNumber + "#"+ strAETITLE+ "#"+ strIdenRef)
	try{mostraBoxAttesa(true,ritornaJsMsg("jsWaitLoadKY"));}catch(e){;}
	if ((accNumber=="")){
		alert("Warning! Accession number is null!!");
		return;
	}		
	if ((strAETITLE=="")){
		alert("Warning! Aetitle is null!!");
		return;
	}	
	if ((iden_anag=="")){
		alert("Warning! IdenAnag is null!!");
		return;
	}	
	if ((strIdenRef=="")){
		alert("Warning! IdenRef is null!!");
		return;
	}		

	try{	
		// forza chiusura con salvataggio
		parent.opener.parent.parent.hideFrame.actionAfterSaveReport="CONFIRM";	
		// forzo chiusura e riapertura per creazione keyimage
		parent.opener.parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION",pacsType,"");
		// in base alla nuova patch posso chiamare il metodo per sapere se è aperta
		// il metodo è sincrono quindi non mi metto in loop
		parent.opener.parent.parent.hideFrame.sendToPacs("IS_SESSION_OPEN",pacsType,"");		
		// resetto StudyObject
		parent.opener.parent.parent.hideFrame.resetStudyObject();
		// attenzione che se l'utente ha aperto altre immagini
		// queste verranno chiuse e riaperte quelle relative
		// all'esame/i che si sta firmando
		// ATTENZIONE è necessario riaprire le immagini !??!
		// direi di no perchè sto firmando....
		//startupPacs()
		//replyRetrieveKeyImages
		
		
		// ometto la richiesta di attesa
		/*
		if (!confirm("Si vuole includere al referto le immagini chiave? \n Saranno necessari alcuni secondi per il recupero delle immagini.")){
			return;
		}*/
		//parent.opener.parent.parent.hideFrame.showTimeoutWindow(400, 150,ritornaJsMsg("jsWarning"), ritornaJsMsg("jsWaitLoadKY"), 4000, true)		
		try{mostraSpanNotifica("Attendere KeyImages...",true);}catch(e){;}
		//try{mostraBoxAttesa(true,ritornaJsMsg("jsWaitLoadKY"));}catch(e){;}
		// attesa
		//parent.opener.parent.parent.hideFrame.apri_attesa();
//		alert("apri attesa")
		// ********
		dwr.engine.setAsync(false);
		//alert(accNumber +" " + strAETITLE);
		//dwr.engine.setErrorHandler(dwr_errh);
		ajaxGetKeyImages.getKeyImages(iden_anag, accNumber,strAETITLE,strIdenRef,callbackRetrieveKeyImages);
		dwr.engine.setAsync(true);			
//				alert("chiudi attesa")

		try{parent.opener.parent.parent.hideFrame.chiudi_attesa();}catch(e){;}
	}
	catch(e){
		alert("retrieveKeyImages: " + e.description)
	}


}

/*
function dwr_errh(msg) {
  alert("dwr errore " + msg);
}*/





function callbackRetrieveKeyImages (value){
//	alert("callbackRetrieveKeyImages - " + value);
//	alert("replyRetrieveKeyImages");
	//parent.opener.parent.parent.hideFrame.chiudi_attesa();
	if (value!=""){
		alert(value);
	}
	try{mostraBoxAttesa(false,"");}catch(e){;}	
	try{mostraSpanNotifica("",false);}catch(e){;}
}




