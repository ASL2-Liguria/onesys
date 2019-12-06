var baseError=new Object();

function initbaseError(BOLERROR,STRDESCRERRORE,ORIGINE ){
	baseError.BOLERROR = BOLERROR;
	baseError.STRDESCRERRORE = STRDESCRERRORE;
	baseError.ORIGINE = ORIGINE;
}



function dopoDefinitivo(){
	// controllo errore di callback
	if (baseError.BOLERROR){
		// ERROREa
		try{
			self.close();
			opener.callbackErrorHandler(baseError);
		}
		catch(e){
			alert(baseError.STRDESCRERRORE);
		}
		try{opener.parent.opener.top.home.apri_attesa();	} catch(e){;}		
	}
	else{


		switch(sorgente){
		case "consolle":
			// controllo se devo fare altre
			// operazione dopo il definitivo
			// tipo:stampa..
			try{opener.parent.opener.top.home.apri_attesa();	} catch(e){;}				
			opener.afterSave(actionAfterSigned);
			top.close();
			break;
		case "worklist":
			opener.aggiorna();
			top.close();
			break;
		}
	}

}

function initGlobalObject(){

	// 20090828
	try{opener.mostraBoxAttesa(false);}catch(e){;}
	// tutto OK
	// se la gestione del sospeso è automatica 
	// DEVO rimappare la scritta del referto NON sospesa
	try{
		opener.bolSospeso = false;
		opener.classReferto.SOSPESO = 'N';
		opener.document.frmMain.Hsospeso.value = "N";			
		opener.settaInfoLabelSospeso(false);
		// ************** modifica aldo 20131230 ******
		try{opener.checkLockComboSale();}catch(e){;}
		// ********************************************			
	}
	catch(e){
		alert("definitivoEngine.initGlobalObject - Error: " + e.description);
	}	
	// ***********	
	initbaseError(BOLERROR,STRDESCRERRORE,ORIGINE );
	try{opener.parent.opener.top.home.apri_attesa();	} catch(e){;}			
	eval(functionToCall);
}
function aggiornaErrori(){
	opener.checkVersioni();
	top.close();
}
