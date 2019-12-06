// definisco le classi dei tabHeader 
// che verranno utilizzate nel caso in 
// cui il referto venga sospeso
var testataSx = "classTabHeaderSx";
var testataDx = "classTabHeaderDx";
var testataCentro = "classTabHeaderMiddle";
var testataPulsanti = "classButtonHeader";
var testataContainerPulsanti = "classButtonHeaderContainer";
// classe per testata x sospeso
var testataSxRed = "classTabHeaderSxRed";
var testataDxRed = "classTabHeaderDxRed";
var testataCentroRed = "classTabHeaderMiddleRed";
var testataPulsantiRed = "classButtonHeaderRed";
var testataContainerPulsantiRed = "classButtonHeaderContainerRed";

// vecchi valori del medico fi riferimento
// usati per abilitarlo / disabilitarlo
var objAlinkMedRif = "";
var objOnChangelinkMedRif = "";
var objAlinkImgMedRif = "";
// secondo medico
var objAlinkMedRif2 = "";
var objOnChangelinkMedRif2 = "";


// funzione da chiamare dopo il controllo dell'
// approriatezza
var functionToCallAfterCheckAppropriato = "";
// handle alla finestra per check  User / Pwd
var finestraCheckUserPwd

// booleana che indica se è la prima volta che viene premuto
// il pulsante di registrazione, nella sessione
// corrente di refertazione
var savingFirstTime= true;

// indica se è stato 
// premuto il pulsante registra
var bolPremutoRegistra = false;


// funzione che setta il medico 
// refertante uguale a quello dell'utente
// attualmente loggato
// Richiamato quando viene cambiato in automatico
// se si referta un referto altrui, previa conferma
function setMedicoRefertanteAttuale(){
	document.frmMain.txt_DESCR_REFERTANTE.value = baseUser.DESCRIPTION;
	document.frmMain.HIDEN_MEDR.value = baseUser.IDEN_PER;
}

// funzione che setta il secondo medico 
// uguale a quello dell'utente attualmente loggato
// Richiamato quando viene cambiato in automatico
// se si referta un referto altrui, previa conferma
function setSecondoMedicoAttuale(){
	document.frmMain.txt_DESCR_SEC_MEDICO.value = baseUser.DESCRIPTION;
	document.frmMain.HIDEN_MED2.value = baseUser.IDEN_PER;
}

// funzione che richiama funzioni di jack
// per autenticazione utente loggato
function richiestaAutenticazione(callback){
	try{
		document.richiediUtentePassword.setRichiediPwdRegistra(true);
		document.richiediUtentePassword.view(callback,"S");		
	}
	catch(e){
		alert("richiestaAutenticazione - Error: " + e.description);
	}
}


// funzione che registra
function registra(){
	
	var i = 0;
	var strTmp = ""; 
	var arraySchedeAppropriatezza;
	var bolSchedaApppropriatezzaVuota = true;
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start registra",deallocaLogJavascript);				
	if (registrazioneAbilitata==false){
		return;
	}
	// ************************************	
	if (savingFirstTime){
		savingFirstTime = false;
		// controllo se sto salvando
		// in seguito ad una richiesta di pressione di registra
		// o di validazione
		if (bolPremutoRegistra){	
			// resetto il flag
			bolPremutoRegistra = false;
			// controllo se devo sospenderlo in automatico
//			if ((baseUser.SOSPAUTOMDOPOREFERT == "S")&&(classReferto.IDEN=="")){
			if ((baseUser.SOSPAUTOMDOPOREFERT == "S")){	
				// mai refertato
				sospeso();
				return;
			}
		}
	}
	// ************************************
	// *** mettere controllo per richiesta
	// *** pwd forzata su bozza
	// ***  baseUser.RICH_PWD_SU_BOZZA
	// ************************************		
	
	// refertante obbligatorio
	if (document.frmMain.HIDEN_MEDR.value==""){
		resetActionAfterSave();
		alert(ritornaJsMsg("jsmsgRefertObblig"));
		return;
	}
	// check OK_FIRMA
	try{
		if (document.frmMain.checkOkFirma.checked==1){
			document.frmMain.Hok_firma.value='S';
		}
		else{
			document.frmMain.Hok_firma.value='';
		}
		// verificare se aggiornare
		// lo stato della classe referto locale
	}
	catch(e){
		alert("ok_firma " + e.description);
	}
	// controllo numero esami
	if (getAllOptionCode('oEsa_Ref')==""){
		alert("ERRORE - Nessun esame scelto da refertare.");
		return;
	}
	// controllo obbligatorietà 
	// appropriatezza
	if (baseGlobal.OB_APPROPRIATEZZA=="S"){
		// se tutti gli esami hanno scheda di appropriatezza
		// vuoto allora eseguo iter normale
		try{
			strTmp = top.opener.ritornaInfoEsame(getAllOptionCode('oEsa_Ref'),top.opener.array_iden_esame,top.opener.array_scheda_appropriatezza);
			arraySchedeAppropriatezza = strTmp.split("*");
			for (i=0;i<arraySchedeAppropriatezza.length;i++){
				if (arraySchedeAppropriatezza[i] !=""){
					bolSchedaApppropriatezzaVuota = false;
					break;
				}
			}		
		}
		catch(e){
			;
		}
		if (!bolSchedaApppropriatezzaVuota){
			// schede NON vuote
			// controllo appropriatezza
			functionToCallAfterCheckAppropriato	= "registraAfterCheck()";
			strTmp =  getAllOptionCode('oEsa_Ref');
			callCheckAppropriato(strTmp);
		}
		else{
			// tutte le schede di appr.vuote
			registraAfterCheck();
		}
	}
	else{
		// iter normale
		registraAfterCheck();
	}
	
	
}


function registraAfterCheck(){
	// ************************
	// lettura reparto
	document.frmMain.HREPARTO.value = getValue("idReparto");
	// **** aggiorno la form
	// di stampa affinchè prenda il layout report corretto 
	document.frmStampa.stampaReparto.value = getValue("idReparto");
	// estrapolo codici degli esami che si stanno refertando
	// e non sono stati esclusi
	document.frmMain.HIDEN_ESA.value = getAllOptionCode('oEsa_Ref');
	// tiro fuori gli esami esclusi
	// per NON aggiornare gli operatori di tutto il pacchetto 
	// che ha lo stesso numero accettazione
	document.frmMain.HIDEN_ESA_TO_EXCLUDE.value = getAllOptionCode('oEsa_Escl');	
	
	// estrapolo testo referto
	//LogJavascript.WriteInfo("consolleSaveFunction*call getReportControlTXT",deallocaLogJavascript);			
	document.frmMain.HTESTO_TXT.value = getReportControlTXT();

	if (document.frmMain.HTESTO_TXT.value==""){
		alert(ritornaJsMsg("jsmsgRefVuoto"));
		return;
	}
	//LogJavascript.WriteInfo("consolleSaveFunction*call getReportControlRTF",deallocaLogJavascript);
	document.frmMain.HTESTO_RTF.value=getReportControlRTF();
	document.frmMain.HTESTO_HTML.value=getReportControlHTML();	
	// ******************************
	// *** attenzione togliere !!!
	// ******************************
//	alert("TXT: " + document.frmMain.HTESTO_TXT.value);
//	alert("HTML: " + document.frmMain.HTESTO_HTML.value);
//	return;
	// ******************************
	
	// 20090828
	try{mostraBoxAttesa(true,"Registrazione in corso, attendere prego...");}catch(e){;}
	// ***********
	
	
	// apro finestra salvataggio
	var saveWindow = window.open("","wndSaveReport","top=80000,left=60000,width=1px,height=1px");
	if (saveWindow){
		saveWindow.focus();
	}
	else{
		saveWindow = window.open("","wndSaveReport","top=80000,left=60000,width=1px,height=1px");
	}
	//saveWindow.document.title = "Registrazione referto.Attendere prego.";
	// *************************
	// ******** ATTENZIONE
	// verificare se chiamare updateClassReferto
	// per aggiornare i dati locali del Referto
	// anche se non si rende definitivo
	// 	updateClassReferto(document.frmMain.HREPARTO.value,document.frmMain.HIDEN_MEDR.value, document.frmMain.HIDEN_MED2.value,"S");
	// **************************	
	//LogJavascript.WriteInfo("consolleSaveFunction*submit frmMain",deallocaLogJavascript);		

	document.frmMain.submit();	
}


// funzione che verrà chiamata
// dopo la fase di registrazione
// NB ANCHE se non si deve fare nulla!
function afterSave(valore){
	
	var bolTmp;
	//alert("afterSave: " + valore +"#");	
	//LogJavascript.WriteInfo("consolleSaveFunction*start afterSave valore: " + valore,deallocaLogJavascript);	
	registrazioneEffettuata = true;
	
	// 20090828
//	try{mostraBoxAttesa(false,"");}catch(e){;}
	// ***********
	// disabilito link su esami per scelta/esclusione prestazioni
	try{disabEsamiLink();}catch(e){alert(e.description);	}	
	try{	parent.opener.top.home.chiudi_attesa();		}catch(e){	}	
	// abilito il sospeso SE NECESSARIO
	//LogJavascript.WriteInfo("consolleSaveFunction*call attivazioneSospeso",deallocaLogJavascript);
	attivazioneSospeso();
	// *****
	if(valore==""){return;}
	//LogJavascript.WriteInfo("consolleSaveFunction*call resetActionAfterSave",deallocaLogJavascript);
	resetActionAfterSave();
	
	// ricarico immagini chiave
	try{
		refreshKeyImagesLayer()			
	}
	catch(e){
		alert("afterSave.refreshKeyImagesLayer() " + e.description);
	}
	// *********
	
	// controllare una variabile
	// pubblica per eseguire la funzione richiesta dopo la 
	// registrazione del referto
	switch(valore.toUpperCase()){
		case "DEFINITIVO":
			//LogJavascript.WriteInfo("consolleSaveFunction*call saveDefinitivo",deallocaLogJavascript);	
			if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
				try{mostraBoxAttesa(false,"");}catch(e){;}
				// FIRMA DIGITALE
				callFirmaDigitale();				
			}
			else{
				saveDefinitivo();
			}
			break;
		case "PRINT":
			//LogJavascript.WriteInfo("consolleSaveFunction*call doPrint",deallocaLogJavascript);
			doPrint(valore);
			break;
		case "PREVIEW":
			//LogJavascript.WriteInfo("consolleSaveFunction*call doPrint",deallocaLogJavascript);
			doPrint(valore);
			break;
		case "PRINTCLOSE":
			// ********
			//LogJavascript.WriteInfo("consolleSaveFunction*call doPrint",deallocaLogJavascript);	
			doPrint(valore);
			break;
		case "CLOSE":
			chiudi();
			break;
		case "SOSPENDI":
			// da verificare
			// nel caso in cui sono nello screening devo
			// forzare il sospeso se è il primo che referta
			sospeso();
			break;
		case "FIRMADIGITALE":
			// molto probabilmente
			// in seguito alla modifica del 25/2
			// per la variazione del flusso per la firma digitale 
			// di qua non ci passo più
			callFirmaDigitale();			
			break;
	}

}






// funzione
// che interrompe l'esecuzione del javascript
// di n ms
function pausecomp(millis) 
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 

// funzione che resetta
// l'azione chiamata successiva alla
// registrazione
// da chiamare quando c'e' un errore 
// per tornare alla situazione base
function resetActionAfterSave(){
	document.frmMain.HactionAfterSave.value ="";
}

// funzione che 
// fa i controlli per rendere 
// definitivo l'esame
function definitivo(){

	//LogJavascript.WriteInfo("consolleSaveFunction*start definitivo",deallocaLogJavascript);
	if (registrazioneAbilitata==true){
		// setto passo successivo
		document.frmMain.HactionAfterSave.value="DEFINITIVO";
		//LogJavascript.WriteInfo("consolleSaveFunction*call registra by definitivo",deallocaLogJavascript);
		registra();
	}
	else{
		// non salvo tutto ma
		// voglio salvare anche il testo del referto
		// ora eseguo il definitivo
		//LogJavascript.WriteInfo("consolleSaveFunction*call saveDefinitivo",deallocaLogJavascript);
		saveDefinitivo();
	}
	// ATTENZIONE
	// verificare se mettere altri controlli
}


// funzione
// che effettivamente lancia 
// procedura per il definitivo di un esame
function saveDefinitivo(){
	
	// 20090828
	try{mostraBoxAttesa(true, "Registrazione in corso.<BR>Attendere prego...");}catch(e){;}
	// ***********	
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start saveDefinitivo",deallocaLogJavascript);
	registrazioneAbilitata = false;
	// diabilito medico refertante
	//LogJavascript.WriteInfo("consolleSaveFunction*call disableLinkMedRiferimento",deallocaLogJavascript);
	disableLinkMedRiferimento(); 
	// nascondo il pulsante di salvataggio
	//LogJavascript.WriteInfo("consolleSaveFunction*call hideSaveButton",deallocaLogJavascript);
	hideSaveButton();	
	// aggiorno classe Referto locale 
	updateClassReferto(document.frmMain.HREPARTO.value,document.frmMain.HIDEN_MEDR.value, document.frmMain.HIDEN_MED2.value,"S");
	document.frmDefinitivo.HupdateReportText.value="S";
	document.frmDefinitivo.HTESTO_TXT.value=getReportControlTXT();
	if (document.frmDefinitivo.HTESTO_TXT.value==""){
		alert(ritornaJsMsg("jsmsgRefVuoto")+ "!");
		return;
	}	
	document.frmDefinitivo.HTESTO_RTF.value=getReportControlRTF();
	// Questo controllo non è strettamente necessario in 
	// quanto è sufficiente che sia presente
	// il testo in formato TXT
	/*
	if ((document.frmDefinitivo.HTESTO_RTF.value=="")||(document.frmDefinitivo.HTESTO_RTF.value=="undefined")){
		alert(ritornaJsMsg("jsmsgRefVuoto")+ "!!");
		return;
	}		*/
	document.frmDefinitivo.HTESTO_HTML.value=getReportControlHTML();		
	
	parent.opener.top.home.apri_attesa();	
	document.frmDefinitivo.idenEsame.value = array_iden_esame[0];
	document.frmDefinitivo.HidenMedFirma.value = document.frmMain.HIDEN_MEDR.value;
	document.frmDefinitivo.HidenSecondoMed.value = document.frmMain.HIDEN_MED2.value;
	// tolto quando si è tolta la prima riga dal layout
//	document.frmDefinitivo.HOPERATORE.value = document.frmMain.HOPERATORE.value
	document.frmDefinitivo.HREPARTO.value = document.frmMain.HREPARTO.value;
	// verificare
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		document.frmDefinitivo.HactionAfterSigned.value="FIRMADIGITALE";			
	}
	else{
		document.frmDefinitivo.HactionAfterSigned.value="STAMPA";	
	}

	// *******************************	
	// cambio icone dopo aver validato
	changeValidationIcon()

	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		// 20100210		
//		getDose();		
		callFirmaDigitale();
	}
	else{
		// *********** per verona **********
		// nel caso in cui NON sia richiesta pwd
		// allora stampo in automatico referto
		// ovvero rimappo actionAfterSigned
		if (baseGlobal.DEFINITIVO_SENZA_PWD=="S"){		
			document.frmDefinitivo.HactionAfterSigned.value = "PRINTCLOSE";
		}
		// *********************************
		var finestraDefinitivo = window.open("","wndDefinitivo","top=80000,left=60000,width=800px,height=600px,status=yes");
		if(finestraDefinitivo){
			finestraDefinitivo.focus();
		}
		else{
			finestraDefinitivo = window.open("","wndDefinitivo","top=80000,left=60000,width=800px,height=600px,status=yes");
		}	
		document.frmDefinitivo.submit();		
	}
}

// funzione che 
// cambia le icone perchè si è validato il referto
// attenzione: per ora le icone sono diverse solo nel 
// caso di firma NON digitale
function changeValidationIcon (){
	var oggetto
	// icona valida medRef: idImgValidaMedRif
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		// *********
	}
	else{
		try{
			oggetto = document.getElementById("idImgValidaMedRif");
			if (oggetto){
				oggetto.src = "imagexPix/button/icon/validaUtenteLockClosed.gif";
 				oggetto.onmouseover = function(){this.src="imagexPix/button/icon/validaUtenteLockClosed_over.gif";};
				oggetto.onmouseout = function(){this.src="imagexPix/button/icon/validaUtenteLockClosed.gif";};			
			}
		}
		catch(e){
			;
		}
		
	}
}

// **************
// cambia icona della validazione secondo medico
function changeValidationIconResident (){
	var oggetto
	// icona valida 2medico: idImgSecMed
	try{
		oggetto = document.getElementById("idImgSecMed");
		if (oggetto){
			oggetto.className = "classButtonValidaLockClosed";
		}
	}
	catch(e){
		;
	}
}



// funzione che richiama la procedura
// di firma digitale
function callFirmaDigitale(){
//	alert("callFirmaDigitale");
	try{
		if (classReferto.IDEN!=null && classReferto.IDEN!='')
		{		
			finestraCheckUserPwd = window.open("","wndFirmaDigitale","left=0; top=40px,width=350px, height=150px,status=yes");
			if(finestraCheckUserPwd){
				finestraCheckUserPwd.focus();
			}
			else{
				finestraCheckUserPwd = window.open("","wndFirmaDigitale","left=0; top=40px,width=350px, height=150px,status=yes");
			}		
			document.frmFirmaDigitale.HTESTO_TXT.value = getReportControlTXT();
			document.frmFirmaDigitale.HTESTO_RTF.value = getReportControlRTF();
			document.frmFirmaDigitale.HTESTO_HTML.value = getReportControlHTML();	
			document.frmFirmaDigitale.idenRef.value = classReferto.IDEN;
			document.frmFirmaDigitale.HREPARTO.value = getValue("idReparto");
			document.frmFirmaDigitale.HidenSecondoMed.value = document.frmMain.HIDEN_MED2.value;
			// vedere se modificarlo
			document.frmFirmaDigitale.hidFunctionToCall.value = "dopoValidaMedRiferimento";
			//LogJavascript.WriteInfo("consolleSaveFunction*submit frmFirmaDigitale",deallocaLogJavascript);
			if (basePC.GESTIONE_DAO=="S"){
				document.frmFirmaDigitale.action = "SrvDAO";
			} 
			document.frmFirmaDigitale.submit();
			// *******************************************************
			//registrazioneAbilitata = false;
			// diabilito medico refertante
			//disableLinkMedRiferimento(); 
			// nascondo il pulsante di salvataggio
			//hideSaveButton();				
			// *******************************************************
		}
		else{
			// non è stato salvato
			alert(ritornaJsMsg("jsNoSaved"));
			return;			
		}	
	}
	catch(e){
		alert("callFirmaDigitale - " + e.description);
	}

}



// funzione che valida il medico di riferimento
// Praticamente è come se rendesse il referto definitivo
function validaMedRiferimento(){
	
	var strTmp = "";
	// è possibile che non sia stato nessun medico di riferimento
	// fino alla validazione
	// apro finestra validazione
	//LogJavascript.WriteInfo("consolleSaveFunction*start validaMedRiferimento",deallocaLogJavascript);
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		definitivo();
	}
	else{
		if (baseGlobal.DEFINITIVO_SENZA_PWD=="S"){
			// NON è richiesta pwd
			// quindi compongo stringa per bypassare
			// il controllo della pwd
			strTmp = "OK*";
			strTmp += baseUser.IDEN_PER + "*";
			strTmp += baseUser.LOGIN + "*";			
			strTmp += baseUser.DESCRIPTION + "*";			
			strTmp += getValue("idReparto") + "*";			
			// attenzione, nella vecchia versione di imagoHttp
			// baseUSER.TIPO NON veniva settato passare quindi fisso M
			strTmp += baseUser.TIPO + "*";						
			strTmp += baseUser.TIPO_MED;
			//alert(strTmp);
			dopoValidaMedRiferimento(strTmp);
			
		}
		else{
			// richiesta pwd
			var finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
			if(finestraCheck){
				finestraCheck.focus();
			}
			else{
				finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
			}
			// setto il cdc di default
			document.frmCheckUser.hidCdcDefault.value = document.frmMain.HREPARTO.value;
			if (classReferto.FIRMATO.toString() =="S"){
				document.frmCheckUser.hidCdcLocked.value = "S";
			}
			else{
				document.frmCheckUser.hidCdcLocked.value = "N";
			}	
			// rimappo la chiamata fatta dopo
			// l'autenticazione
			document.frmCheckUser.hidFunctionToCall.value = "dopoValidaMedRiferimento";
			//LogJavascript.WriteInfo("consolleSaveFunction*submit frmCheckUser",deallocaLogJavascript);
			// ***
			document.frmCheckUser.submit();
		}
	}
}

// funzione che valida il secondo medico 
function validaSecondoMed(){
	
	var oldHidCdcLocked ="";
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start validaSecondoMed",deallocaLogJavascript);		
	// è possibile che non sia stato nessun medico di riferimento
	// fino alla validazione
	// apro finestra validazione
	var finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
	if(finestraCheck){
		finestraCheck.focus();
	}
	else{
		finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
	}
	// setto il cdc di default
	document.frmCheckUser.hidCdcDefault.value = document.frmMain.HREPARTO.value;
	// rimappo la chiamata fatta dopo
	// l'autenticazione
	if (baseGlobal.ABILITA_FIRMA_DIGITALE=="S"){
		// nulla
		
	}
	else{
		document.frmCheckUser.hidFunctionToCall.value = "dopoValidaSecondoMed";
	}
	document.frmCheckUser.hidCdcLocked.value = "S";
	//LogJavascript.WriteInfo("consolleSaveFunction*submit frmCheckUser",deallocaLogJavascript);
	document.frmCheckUser.submit();	
}

// funzione di ritorno
// dopo la validazione del Medico di riferimento
function dopoValidaMedRiferimento(valore){
	
	var arrayInfo;
	var idenMed = "";
	var descrMed = "";
	var cdcReferto = "";
	var userTipo = "";
	var userTipoMed = ""
	var login = ""
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start dopoValidaMedRiferimento",deallocaLogJavascript);
	if (valore==""){
		return;
	}
	// devo , in base ai valori ritornati
	// aggiornare il campo del medico di riferimento
	// dati in input:
	// OK * IDEN_MED * login* Descrizione medico * cdc * tipoUtente * tipoMedico
//	alert("dopoValidaMedRif " + valore);
	arrayInfo = valore.split("*");
	idenMed = arrayInfo[1];
	login = arrayInfo[2];
	descrMed = arrayInfo[3];
	cdcReferto = arrayInfo[4];
	userTipo = arrayInfo[5];	
	userTipoMed = arrayInfo[6];	
	// controllo il tipo di utente
	// che si è autenticato
	if (userTipo.toString()!="M"){
		alert(ritornaJsMsg("jsmsgUteNonRefert"));
		return;
	}
	else{
		// è medico
		if (userTipoMed.toString()!="R"){
			// medicon NON refertante
			alert(ritornaJsMsg("jsmsgUteNonRefert"));
			return;
		}
	}
	if (cdcReferto==""){
		alert(ritornaJsMsg("jsmsgCdcVuoto"));
		return;
	}	
	document.frmMain.txt_DESCR_REFERTANTE.value=descrMed;
	document.frmMain.HIDEN_MEDR.value = idenMed;
	if (classReferto.FIRMATO.toString() !="S"){
		// blocco il combo
		// e aggiungo l'elemento che mi interessa
		// indipendentemente che esista già
		add_elem("idReparto", cdcReferto, cdcReferto);
		// infine lo seleziono
		document.all.idReparto.selectedIndex = document.all.idReparto.length -1 ;
		document.all.idReparto.disabled = true;
	}
	// aggiorno operatore
	aggiornaOperatore(idenMed, descrMed);
	// comunico che sto validando il med di riferimento
	// verrà quindi creata la versione
	document.frmDefinitivo.HvalidatoDaMedRiferimento.value = "S";	
	// ********
	try{	parent.opener.top.home.chiudi_attesa();		}catch(e){	}	
	// ********
	if (baseGlobal.ABILITA_FIRMA_DIGITALE=="S"){
		//LogJavascript.WriteInfo("consolleSaveFunction*end dopoValidaMedRiferimento",deallocaLogJavascript);		
		//   faccio nulla
		return;
	}
	else{
		//LogJavascript.WriteInfo("consolleSaveFunction*call defintivo by dopoValidaMedRiferimento",deallocaLogJavascript);
		// firma NON digitale
		definitivo();
	}

}


// funzione chiamata dopo la validazione del seondo
// medico
function dopoValidaSecondoMed(valore){
	var arrayInfo;
	var idenMed = "";
	var descrMed = "";
	var cdcReferto = "";
	var userTipo = "";
	var userTipoMed = ""

	
	if (valore==""){
		return;
	}
	// dati in input:
	// OK * IDEN_MED * login* Descrizione medico * cdc * tipoUtente * tipoMedico
	arrayInfo = valore.split("*");
	idenMed = arrayInfo[1];
	login = arrayInfo[2];
	descrMed = arrayInfo[3];
	cdcReferto = arrayInfo[4];
	userTipo = arrayInfo[5];
	userTipoMed = arrayInfo[6];
	// controllo il tipo di utente
	// che si è autenticato
	if (userTipo.toString()!="M"){
		alert(ritornaJsMsg("jsmsgUteNonRefert"));
		return;
	}
	else{
		// è medico
		if ((userTipoMed.toString()!="R")&&(userTipoMed.toString()!="S")){
			// medicon NON refertante
			alert(ritornaJsMsg("jsmsgUteNonRefert"));
			return;
		}
	}	
	aggiornaSecMedico(idenMed, descrMed);
	// aggiorno operatore
	aggiornaOperatore(idenMed, descrMed);
	// comunico che sto validando il secondo 
	// NON verrò quindi creata la versione
	document.frmDefinitivo.HvalidatoDaMedRiferimento.value = "N";
	// cambia icona validazione
	changeValidationIconResident()	;
	// ************
	if (registrazioneAbilitata){
		//registra();
		simulateSaveButton();
	}
	else{
		// chiamo il definitivo
		// che aggiorna solo su referti e reftxt
		// ma NON crea versione
		definitivo();
	}
}
	


// metodo che nasconde il pulsante
// di salvataggio
function hideSaveButton(){
	HideLayer("idBtSave");
}

// metodo che mostra il pulsante
// di salvataggio
function showSaveButton(){
	ShowLayer("idBtSave");
}

// funzione
//  che aggiorna la calsse JS classReferto locale
// con i dati aggiornati del 
// REPARTO
// IDEN_MED
// IDEN_MED2
// FIRMATO
function updateClassReferto(INreparto,INiden_med, INiden_med2, INfirmato){
	//LogJavascript.WriteInfo("consolleSaveFunction*start updateClassReferto",deallocaLogJavascript);			
	if (classReferto.FIRMATO !="S"){
		classReferto.REPARTO = INreparto;	
		classReferto.IDEN_MED = INiden_med;
		classReferto.IDEN_MED2 = INiden_med2;
		classReferto.FIRMATO = INfirmato;
	}
}


// funzione che disabilita
// il link dell'etichetta del med.di riferimento
// e rimappa la gestione dell'evento onchange dello stesso
function disableLinkMedRiferimento(){
	var objectAlink;
	var objectText;
	var objectImg;
	var objectAlinkImg;
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start disableLinkMedRiferimento",deallocaLogJavascript);				
	objectImg = document.getElementById("idImgValidaMedRif");
	if (objectImg){
		objectImg.style.visibility = "hidden";
	}
	// tolgo link da etichetta del medico refertante
	objectAlink = document.getElementById("lblREFERTANTE");
	if (objectAlink){
		// salvo e disabilito link
		objAlinkMedRif = objectAlink.href;
		objectAlink.href = "#";
	}
	// tolgo gestione evento da textbox
	objectText = document.getElementById("idTextReferante");
	if (objectText){
		objOnChangelinkMedRif = objectText.onchange;
		objectText.onchange = "";
		objectText.disabled = true;
	}
	// tolgo link sull'immagine
	// idALinkImgValidaMedRif
	objectAlinkImg = document.getElementById("idALinkImgValidaMedRif");
	if (objectAlinkImg){
		objAlinkImgMedRif = objectAlinkImg.onclick;
		objectAlinkImg.onclick = "";
	}
	//LogJavascript.WriteInfo("consolleSaveFunction*end disableLinkMedRiferimento",deallocaLogJavascript);				
}

// funzione che Abilita
// il link dell'etichetta del med.di riferimento
// e rimappa la gestione dell'evento onchange dello stesso
function enableLinkMedRiferimento(){
	var objectAlink
		var objectImg;
	
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start enableLinkMedRiferimento",deallocaLogJavascript);						
	objectImg = document.getElementById("idImgValidaMedRif");
	if (objectImg){
		objectImg.style.visibility = "visible";
	}
	objectAlink = document.getElementById("lblREFERTANTE");
	if ((objectAlink)&&(objAlinkMedRif!="")){
		// abilito link
		objectAlink.href = objAlinkMedRif;
	}
	objectText = document.getElementById("idTextReferante");
	if ((objectText)&&(objOnChangelinkMedRif!="")){
		objectText.onchange = objOnChangelinkMedRif;
		objectText.disabled = false;
	}
	// ripristino link sull'immagine
	objectAlinkImg = document.getElementById("idALinkImgValidaMedRif");
	if ((objectAlinkImg)&&(objAlinkImgMedRif!="")){
		objectAlinkImg.onclick = objAlinkImgMedRif ;
	}	
	//LogJavascript.WriteInfo("consolleSaveFunction*end enableLinkMedRiferimento",deallocaLogJavascript);						
}

// funzione che aggiorna 
// il secondo a video
// campo nascosto incluso
function aggiornaSecMedico(iden, descr){
		// aggiorno il campo del secondo medico
	objectNode = document.getElementById("lblDESCR_SEC_MEDICO")
	if (objectNode){
		objectNode.innerText = descr;
	}
	document.frmMain.HIDEN_MED2.value = iden;	

}
// funzione che aggiorna 
// l'operatore a video
// campo nascosto incluso
function aggiornaOperatore(iden, descr){
	try{
		// non viene + visualizzato
		//objectNode = document.getElementById("lblDESCR_OPERATORE")
		// verrà lasciato il campo Hidden
		document.frmMain.HOPERATORE.value = iden;
	}
	catch(e){
		// dopo l'aggiornamento per Lagosanto (tolto operatore)
		// andrebbe in errore, lo gestisco ma lascio il codice 
		// per eventuali sviluppi
		;
	}
}

/*
// funzione che disabilita
// link per validazione primo medico
function hideValidaMedRif(){
	HideLayer("idImgMedRif");
}

// funzione che abilita
// link per validazione secondo medico
function showValidaMedRif(){
	ShowLayer("idImgMedRif");
}

*/

// funzione che disabilita
// link per validazione secondo medico
function hideValidaMedSecondo(){
	HideLayer("idImgSecMed");
}

// funzione che abilita
// link per validazione secondo medico
function showValidaMedSecondo(){
	ShowLayer("idImgSecMed");
}


// funzione che controlla se
// esiste referto: abilito pulsante sospeso
// referto sospeso: cambio colore intestazione referto e abilito pulsante sospeso SE E SOLO SE utente = utente di riferimento 
function attivazioneSospeso(){

	var objectNode ;


	//LogJavascript.WriteInfo("consolleSaveFunction*start attivazioneSospeso",deallocaLogJavascript);						
	/*if (classReferto.IDEN!=""){*/
		// esame refertato
		// controllo se è sospeso
		settaInfoLabelSospeso(bolSospeso);		
		if (bolSospeso==true){
			// diabilito medico refertante
			// ATTENZIONE provo a NON togliere
			// la firma in caso di referto sospeso
			// disableLinkMedRiferimento(); 
			// hideValidaMedSecondo();
		}
		else{
	
			enableLinkMedRiferimento();
			showValidaMedSecondo();			
		}
		/*
	}
	else{
		// referto non esiste
		// nascondo pulsante
		HideLayer("idDivSospeso");
		document.all.headerThirdLayoutSx.className = testataSx;
		document.all.headerThirdLayoutMiddle.className = testataCentro ;
		document.all.headerThirdLayoutButton.className = testataContainerPulsanti ;
		document.all.headerThirdLayoutDx.className = testataDx ;
		document.all.lbltitoloTestoReferto.innerText = "Referto ";
	}*/
	//LogJavascript.WriteInfo("consolleSaveFunction*end attivazioneSospeso",deallocaLogJavascript);
}

// qui rimappo le info della barra
// e le info di classReferto
function settaInfoLabelSospeso(value){
	try{
		if (value){
			// sospeso
			classReferto.SOSPESO = 'S';
			// per BOLOGNA
			// controllo se devo cmq gestire la visualizzaione
			// del pulsante sospeso
			if (baseUser.ABILITA_SOSPESO=="S"){
				if ((baseUser.IDEN_PER==classReferto.IDEN_MED)||(baseUser.SBLOCCA_REFERTO=="S")){
					// sono il medico di riferimento
					// o utente che ha la permissione di sblocco
					ShowLayer("idDivSospeso");
				}
			}
			else{
				HideLayer("idDivSospeso");				
			}
			/*
			document.all.headerThirdLayoutSx.className = testataSxRed ;
			document.all.headerThirdLayoutMiddle.className = testataCentroRed ;
			document.all.headerThirdLayoutButton.className = testataContainerPulsantiRed ;
			document.all.headerThirdLayoutDx.className = testataDxRed ;
			document.getElementById("headerThirdLayoutButton").className = testataContainerPulsantiRed;
			*/
			if (globalRefertoStrutturato =="S"){
				if (baseUser.LINGUA =="IT"){
					// sospeso
					document.getElementById("lbltitoloTestoReferto").innerHTML = "<span class='classSRtitlePending' onclick='apriKeyImgTab();'>Strutturato Sospeso</span>";
				}
				else{
					document.getElementById("lbltitoloTestoReferto").innerHTML = "<span class='classSRtitlePending' onclick='apriKeyImgTab();'>Structured pending</span>";									
				}					
			}
			else{
				document.getElementById("lbltitoloTestoReferto").innerText = "Referto Sospeso";
				document.getElementById("lbltitoloTestoReferto").style.color = "yellow";
				document.getElementById("lbltitoloTestoReferto").style.backgroundColor = "red";
			}	
		}
		else{
		// NON sospeso
			classReferto.SOSPESO = 'N';
			// controllo se devo cmq gestire la visualizzaione
			// del pulsante sospeso
			if (baseUser.ABILITA_SOSPESO=="S"){			
				// abilito pulsante se e solo se non è firmato
				if (classReferto.FIRMATO.toUpperCase()!="S"){
					ShowLayer("idDivSospeso");
				}
				else{
					// è firmato quindi
					// non ha senso il pulsante SOSPESO
					HideLayer("idDivSospeso");				
				}
			}
			else{
				HideLayer("idDivSospeso");				
			}
			// risetto cmq i colori della testata
			/*
			document.all.headerThirdLayoutSx.className = testataSx;
			document.all.headerThirdLayoutMiddle.className = testataCentro ;
			document.all.headerThirdLayoutButton.className = testataContainerPulsanti ;
			document.getElementById("headerThirdLayoutButton").className = testataContainerPulsanti;	
			document.all.headerThirdLayoutDx.className = testataDx ;
			*/
			if (globalRefertoStrutturato =="S"){
				if (baseUser.LINGUA =="IT"){
					document.getElementById("lbltitoloTestoReferto").innerHTML = "<span class='classSRtitle' onclick='apriKeyImgTab();'>Strutturato</span>";
				}
				else{
					document.getElementById("lbltitoloTestoReferto").innerHTML = "<span class='classSRtitle' onclick='apriKeyImgTab();'>Structured</span>";				
				}	
			}
			else{
				document.getElementById("lbltitoloTestoReferto").innerText = "Referto";
				document.getElementById("lbltitoloTestoReferto").style.color = "";
				document.getElementById("lbltitoloTestoReferto").style.backgroundColor = "";
			}			
		}
	}
	catch(e){
		alert("settaInfoLabelSospeso - Error: " + e.description);
	}
}


// funzione che gestisce il sospeso
function sospeso(){
	
	var strTmp="";
	//LogJavascript.WriteInfo("consolleSaveFunction*start sospeso",deallocaLogJavascript);
	// apro finestra validazione
	if (baseUser.PWD_SU_SOSPESO=="S"){
		var finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
		if(finestraCheck){
			finestraCheck.focus();
		}
		else{
			finestraCheck = window.open("","wndCheckUser","left=0; top=0,width=350px, height=150px,status=yes");
		}
		// propongo come login
		// quella dell'utente loggato
		// blocco la modifica (così son sicuro che SOLO il med.di rif. può
		// sbloccare il referto o l'utente che ha sblocca_referto attivo)
		// se il referto è già sospeso
		if (classReferto.SOSPESO=="S"){
			// è sospeso
			// quindi lock della login dell'utente
			// che sarà o med.riferimento o operatore con sblocca attivo
			document.frmCheckUser.hidLoginLocked.value = "S";
		}
		else{
			// non sospeso tutto ok
			document.frmCheckUser.hidLoginLocked.value = "N";
		}
		
		document.frmCheckUser.hidCdcDefault.value = document.frmMain.HREPARTO.value;
		document.frmCheckUser.hidCdcLocked.value = "N";
	
		// rimappo la chiamata fatta dopo
		// l'autenticazione
		document.frmCheckUser.hidFunctionToCall.value = "dopoValidaMedSospeso";
		// ***
		//LogJavascript.WriteInfo("consolleSaveFunction*submit frmCheckUser",deallocaLogJavascript);
		document.frmCheckUser.submit();
	}
	else{
		// NESSUNA PWD su Sospeso !!!
		// chiamo già la callback
		strTmp = "OK*";
		strTmp += baseUser.IDEN_PER + "*";
		strTmp += baseUser.LOGIN + "*";			
		strTmp += baseUser.DESCRIPTION + "*";			
		strTmp += getValue("idReparto") + "*";			
		strTmp += baseUser.TIPO + "*";						
		strTmp += baseUser.TIPO_MED;
		//alert(strTmp);
		dopoValidaMedSospeso(strTmp);		
	}
}

// funzione richiamata
// dopo l'autenticazione del medico che setta / toglie
// il sospeso
function dopoValidaMedSospeso(valore){
	
	var arrayInfo;
	var idenMed = "";
	var descrMed = "";
	var cdcReferto = "";
	var userTipo = "";
	var userTipoMed = ""
	var login = ""	
	
	// cambio stato sospeso
	// **************************************
	// ***************************************	
	if ((baseUser.SOSPAUTOMDOPOREFERT == "S")&&(baseUser.ABILITA_SOSPESO="N")&&(classReferto.FIRMATO.toString() !="S")){
		// gestione automatica del sospeso (bologna) quindi deve sempre esserlo
		bolSospeso = true;
		classReferto.SOSPESO = 'S';
		document.frmMain.Hsospeso.value = "S";
	}	
	else{	
		if (classReferto.SOSPESO == "S"){
			bolSospeso = false;
			classReferto.SOSPESO = 'N';
			document.frmMain.Hsospeso.value = "N";
		}
		else{
			bolSospeso = true;
			classReferto.SOSPESO = 'S';
			document.frmMain.Hsospeso.value = "S";
		}
	}
	// ***************************************
	// ***************************************	
	// parser utente autenticato
	arrayInfo = valore.split("*");
	idenMed = arrayInfo[1];
	login = arrayInfo[2];
	descrMed = arrayInfo[3];
	cdcReferto = arrayInfo[4];
	userTipo = arrayInfo[5];
	userTipoMed = arrayInfo[6];	
	// devo rimappare medico di riferimento
	// controllo il tipo di utente
	// che si è autenticato
	if (userTipo.toString()!="M"){
		alert(ritornaJsMsg("jsmsgUteNonRefert"));
		return;
	}
	else{
		// è medico
		if (userTipoMed.toString()!="R"){
			// medicon NON refertante
			alert(ritornaJsMsg("jsmsgUteNonRefert"));
			return;
		}
	}
	// attivo / disattivo sospeso
	attivazioneSospeso();
	document.frmMain.txt_DESCR_REFERTANTE.value=descrMed;
	document.frmMain.HIDEN_MEDR.value = idenMed;	
	// aggiorno classeReferto
	classReferto.IDEN_MED = idenMed;
	// registro
	registra();
	// controllo che se non era sospeso
	// , poi lo sospendo e NON sono il med.rif. o superutente
	// devo disabilitare salvataggio
	if ((bolSospeso)&&(baseUser.IDEN_PER!=classReferto.IDEN_MED)&&(baseUser.SBLOCCA_REFERTO!="S")){
		registrazioneAbilitata = false;
		// nascondo il pulsante di salvataggio
		hideSaveButton();			
	}
	try{
		parent.opener.top.home.chiudi_attesa();		
	}
	catch(e){
	}
	
}



function deallocaLogJavascript()
{
	return;
	LogJavascript = null;
}

// funzione per gestione Errore centralizzata
// viene chiamata come callback da funzioni
// quali la registrazione del firmato
// riceve in input un oggetto errore di tipo baseError
function callbackErrorHandler(errore){
	
	var origine = "";
	try{
		if (errore.BOLERROR){
			origine = errore.ORIGINE.toString().toLowerCase();
			switch(origine){
				case "definitivo":
					alert(errore.STRDESCRERRORE);
					break;
			}
		}
	}
	catch(e){
		alert("callbackErrorHandler - " + e.description);
	}
	
}


// funziona che controlla se settare la
// modalità readonly della console
// devo disabilitare:
// tasto registra - icone validazione medico ref e sec.medico
// inibire appropriatezza (controllo su variabili di salvataggio)
// variabile locale che inibisce la registrazione (di consegueneza lo fa per le stampe)
// inibire l'import dei ref.std
function checkReadOnlyConsole(){
	if (globalReadOnlyMode.toString().toUpperCase()=="S"){
		registrazioneAbilitata = false;
		hideSaveButton();
		hideValidaMedSecondo();
		disableLinkMedRiferimento();
	}
}

// ****************************************************
// ***************** AJAX ************************
// ***********************************************
function callCheckAppropriato(idenEsame){
	try{
		ajaxManageAppropriatezza.checkAppropriato(idenEsame,replyCheckAppropriato);
	}
	catch(e){
		alert("consolleSaveFunction Error: "+ e.description);
	}
	
}

var replyCheckAppropriato = function(returnValue){
	if (returnValue==false){
		// NON appropriato
		alert(ritornaJsMsg("jsmsgKOapprop"));
		try{mostraBoxAttesa(false,"");}catch(e){;}		
	}
	else{
		// appropriato !!
		// continuare la registrazione
		try{
			if (functionToCallAfterCheckAppropriato!=""){
				eval(functionToCallAfterCheckAppropriato);
			}
		}
		catch(e){
			alert("consolleSaveFunction Callback Error: "+ e.description);
		}
	}
	functionToCallAfterCheckAppropriato	= "";			
}

// ****************************************************


function creaBoxAttesa(){
	
	var divObject ;
	var spanObject ;
	
	
	try{
		divObject =  document.createElement("DIV");
		divObject.id = "attesaBox";	
		spanObject = document.createElement("SPAN");
		spanObject.className = "testoAttesaBox";
		spanObject.id = "spanAttesaBox";	
		spanObject.innerHTML = "<LABEL>Salvataggio Referto in corso. Attendere prego...</LABEL>";
		
		divObject.appendChild(spanObject);
		document.body.appendChild(divObject);
	}
	catch(e){
		alert("creaBoxAttesa - Error: " + e.description);
	}	
}

function mostraBoxAttesa(bolStato, testo){
	var oggetto
	var spanObj
	try{
		oggetto = document.getElementById("attesaBox");
		if (oggetto){
			if (bolStato){
				oggetto.style.visibility = "visible";				
				spanObj = document.getElementById("spanAttesaBox");
				if (spanObj){
					if (testo!=""){
						spanObj.innerHTML = "<LABEL>" + testo +"</LABEL>";
					}
				}
			}
			else{
				oggetto.style.visibility = "hidden";				
			}

		}
	}
	catch(e){
		alert("mostraBoxAttesa - Error: " + e.description);
	}
}

