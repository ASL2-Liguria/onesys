// ********************
// SYSTEM V
// ********************
// *** ATTENZIONE : VERIFICARE CHE VENGA fatto il replace
// perchè alla servlet arriva 92000025606\92000025607 e non 92000025606*92000025607
var flg_pwd_cambiata = "1";
var MP_applicationName="";
// al momento definisco
// il prefisso della url che devo chiamare
// nel caso la sync sia via URL
//var prefixUrlCareStream = "http://199.203.80.69/masterview/mv.jsp?server_name=corwin&close_on_exit=true&start_monitor=1&num_of_monitors=2";
// esiste una proprietà
// legata al pc che indica se usare la sync
// via url o via com verso Mediprime
// la sync via URL NON prevede la login e molte altre operazione
// il campo è abilita_sinc_mediprime_url




//NB nell'oggetto objSTUDIO 
// che viene passato per riferimento
// ho SEMPRE l'ultimo esame chiamato
// questo oggetto viene "resettato" 
// quando chiudo uno studio o chiudo il pacs



var parAEtitleWhereGettingKeyImages = "";


// questa è la funzione base
// che deve sempre esser chiamata
// con la gestione delle STESSE chiamate
function actionPacs(azione, objUtente, objStudio, additionalParameters)
{
	var strAccessionNumber="";
	var strAetitle = "";
	var datiDaMandare = "";
	var regEx = /\*/g;
	
	if (azione=="")
	{
		return;
	}
	// test
	var objectNode = document.getElementById("prjImago2MP");
	// da VERIFICARE
	/*
	oggettoPacs = getObjectPacsById(getObjectPacsById);
	if (oggettoPacs){
		alert("ok Oggetto pacs");
	}
	*/
//	alert(azione);
	azione = azione.toUpperCase();

	if ((azione=="SHOWSTUDY")||(azione=="ADDIMAGES")){
			// nel caso di systemV
			// devo fare una query sul
			// db di system V per verificare quale
			// aetitle devo chiamare
			strAccessionNumber = basePacsStudy.ACCNUM.replace(regEx,"\\");
			strAetitle = basePacsStudy.AETITLE.split("*")[0];
			datiDaMandare = "?aetitle_esame=" + strAetitle;
			datiDaMandare = datiDaMandare + "&accnum="+strAccessionNumber;
			datiDaMandare = datiDaMandare + "&azione="+azione;
			var wndCheckDbSystemV = window.open("checkNumImagesOnCareStream" + datiDaMandare,"wndCheckDbSystemV","top=60000,left=60000,width=600,height=600,statusbar=yes");
			if (wndCheckDbSystemV){
				wndCheckDbSystemV.focus();
			}
			else{
				wndCheckDbSystemV = window.open("checkNumImagesOnCareStream" + datiDaMandare,"wndCheckDbSystemV","top=60000,left=60000,width=600,height=600,statusbar=yes");
			}
			// in worklist/carestreamIntegration/checkNumImagesOnCareStreamEngine.js
			// viene fatto sulla callback
			// 	opener.basePacsStudy.AETITLE = outputAEtitle_esame;
			//	opener.performAction(outputAzione, opener.basePacsUser, opener.basePacsStudy);
			//	top.close();
			// USARE 
			// dwr.engine.setAsync(false);		
		// ajaxRetrieveImgNumber.getAeTitleToCall("SHOWSTUDY", accNumber.split("*")[0],strAeTitle.split("*")[0],replyGetAeTitle);
			// dwr.engine.setAsync(true);
			
			
	}
	else{
		// non è stata chiamata la showstudy 
		// quindi:esecuzione normale
		performAction(azione, objUtente, objStudio, additionalParameters);
	}

}

var replyGetAeTitle = function(returnValue){
	var aetitleToCall="";
	if (returnValue==""){return ;}
//	alert(returnValue);
	try{
		aetitleToCall = returnValue.toString().split('*')[2];
		if (aetitleToCall==""){
			alert("Attenzione aetitle nullo !!");
		}
		parAEtitleWhereGettingKeyImages = aetitleToCall;
		
	}
	catch(e){
		alert("replyRetrieveImgNumber - " + e.description);
	}	
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
	// tipicamente DEVE essere 0
	var initParam ="0";
	
	try{
		// se arrivo dalla homepage
		// non ho ancora l'oggetto basePC
		// in futuro sarebbe interessante
		// implementarlo a runtime mediante Ajax
		abilitazioneSincViaURL = basePC.ABILITA_SINC_MEDIPRIME_URL ;
	}
	catch(e){
		abilitazioneSincViaURL = "N";
	}
	
	
	
	// da togliere
	 // ****************
//	alert(azione)
	// controllo tipo di sync
	if (abilitazioneSincViaURL=="S"){
		urlCareStreamToCall = basePC.PREFIXURLCARESTREAM;
		switch (azione)
		{
		case "SHOWSTUDY":
			strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
			urlCareStreamToCall = urlCareStreamToCall + "&user_name="+ objUtente.LOGIN;
			urlCareStreamToCall = urlCareStreamToCall + "&password="+ objUtente.PWD;
			urlCareStreamToCall = urlCareStreamToCall + "&accession_number="+ strAccessionNumber;
			//alert(urlCareStreamToCall);
			var hndMP = window.open(urlCareStreamToCall,"wndMP","top =0, left=0,width=500,height=500");
			if (hndMP){
				hndMP.focus();
			}
			else{
				hndMP = window.open(urlCareStreamToCall,"wndMP","top =0, left=0,width=500,height=500");
			}
			return;
		default:
			return;
		}
		
	}
	else{
		// ****
		switch (azione)
		{
		case "LOGIN":
			// ******** ATTENZIONE
			// gestire il parametro per l'autenticazione in caso di emergenza
			// nel caso true entro con utente generico predefinito
			if (basePC.USA_UTENTE_EMERGENZA_SYSV=="S"){
				utente_emergenza_sysv = basePC.UTENTE_EMERGENZA_SYSV;
				// ATTENZIONE ricordarsi di criptare la pwd
				// ********************
				password_emergenza_sysv = basePC.PASSWORD_EMERGENZA_SYSV;
				// chiamata ajax per conversione
				callGetCryptedString (password_emergenza_sysv);
				
				// **************
				// prjImago2MP.MP_login(utente_emergenza_sysv,password_emergenza_sysv,MP_applicationName,err_number,err_descr);						
			}
			else{
				// ****************************
				//	NB BISOGNA togliere l'application name (terzo parametro)
				// per l'integr. reale con l'exe della kodak
				// ****************************
				//alert (azione + "#" + afterChangePwd_vecchiaPwd + "#" +objUtente.PWD_CRYPTED + "#" + afterChangePwd_cambioPwd);
				if (afterChangePwd_cambioPwd.toUpperCase().toString()!="S"){
					try{
						// caso di ocx vers < 1.0.10
						prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName,err_number,err_descr);
					}
					catch(e){
						// caso di ocx vers = 1.0.10
						prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName,initParam,err_number,err_descr);
					}
				}
				else{
					// faccio login con vecchia pwd
					try{
						prjImago2MP.MP_login(objUtente.LOGIN,afterChangePwd_vecchiaPwd,MP_applicationName,err_number,err_descr);
					}
					catch(e){
						prjImago2MP.MP_login(objUtente.LOGIN,afterChangePwd_vecchiaPwd,MP_applicationName, initParam, err_number,err_descr);					
					}
					// chiamo editpassword		
					prjImago2MP.MP_EditPassword(objUtente.LOGIN,afterChangePwd_vecchiaPwd,objUtente.PWD_CRYPTED);
					flg_pwd_cambiata = "0";
				}			
			}
			return;
		case "GETCURRENTUSER":
			// attenzione 
			// la variabile di scambio
			// per passare user e password è userLoggedOnPacs 
			// ed è dichiarata nel file syncStartUp.js
			// file standard per tutte le sincronizzazioni PACS
			// Il file viene incluso (x ora) *SOLO* nella 
			// pagina di login
			userLoggedOnPacs = document.all.prjImago2MP.MP_GetCurrentUser("RIS",err_number,err_descr);
			return;
		case "ADDIMAGES":
			vecchio_acc_num = lastAccessionNumberOpened;
			if (prjImago2MP.MP_active()!=true)
			{
				try{
					prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName,err_number,err_descr);
				}
				catch(e){
					prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName,initParam, err_number,err_descr);				
				}
				if (vecchio_acc_num!="")
				{
					strAetitle = objStudio.AETITLE.split("*")[0];
					prjImago2MP.MP_showstudy(vecchio_acc_num,"",strAetitle,err_number,err_descr)
				}
				else
				{
					// nn esiste esame primario
					alert(ritornaJsMsg("jsmsgNoPrimaryStudy"));
					return;
				}
			}
			strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
			strAetitle = objStudio.AETITLE.split("*")[0];
			prjImago2MP.MP_addimages(strAccessionNumber,strAetitle,err_number,err_descr)	
	
			return;	
		case "EDITPASSWORD":
			// resetto flag
			//alert("old pwd: " + afterChangePwd_vecchiaPwd + " new pwd: " + objUtente.PWD_CRYPTED);
			prjImago2MP.MP_EditPassword(objUtente.LOGIN,afterChangePwd_vecchiaPwd,objUtente.PWD_CRYPTED);
			flg_pwd_cambiata = "0"
			return;
		case "SHOWSTUDY":
			vecchio_acc_num = lastAccessionNumberOpened;
			if (actionAfterSaveReport==""){
				azione_close = "DISMISS";
			}
			else{
				azione_close = actionAfterSaveReport;
			}
			// ATTENZIONE 
			// fare replace con carattere di split di systemV "\\"
			strAccessionNumber = objStudio.ACCNUM.toString().replace(regEx,"\\");
			strAetitle = objStudio.AETITLE.split("*")[0];
			// controllo che MP sia su
			if (prjImago2MP.MP_active()!=true)
			{
				try{
					prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName,err_number,err_descr);
				}
				catch(e){
					prjImago2MP.MP_login(objUtente.LOGIN,objUtente.PWD_CRYPTED,MP_applicationName, initParam, err_number,err_descr);					
				}
			}
			if (vecchio_acc_num!="")
			{
				prjImago2MP.MP_closesession(vecchio_acc_num,azione_close,err_number,err_descr)
			}
			prjImago2MP.MP_showstudy(strAccessionNumber,"",strAetitle,err_number,err_descr)
			// aggiorno variabili publiche
			lastAccessionNumberOpened = strAccessionNumber;
			//actionAfterSaveReport = "";
			// *****
			// resetto StudyObject
			resetStudyObject();	
			return;
		case "CLOSE_CURR_SESSION":
			vecchio_acc_num = lastAccessionNumberOpened;
			if (vecchio_acc_num!="")
			{
	//			alert("close_session");
	//			alert("vecchio_acc_num " + vecchio_acc_nume);
	//			alert("actionAfterSaveReport " + actionAfterSaveReport);
				prjImago2MP.MP_closesession(vecchio_acc_num,actionAfterSaveReport,err_number,err_descr);
			}
			// aggiorno variabili publiche
			lastAccessionNumberOpened = "";
			actionAfterSaveReport = "";
			return;
		case "IS_SESSION_OPEN":
			var sessioneAperta = false;
//			prjImago2MP.MP_isSessionOpen();
			sessioneAperta = prjImago2MP.MP_isSessionOpen();
			//alert("Sessione aperta: " + sessioneAperta);
			// ritorno l'esito anche se non lo gestisco
			// perchè il metodo è sincrono, ovvero mi ritornerà
			// sempre true, SOLO quando ha finito
			return sessioneAperta;
		case "LOCKWORKSTATION":
			// lock MP
			prjImago2MP.MP_LockWorkstation()
			return;
		case "UNLOCKWORKSTATION":
			// unlock MP
			// la libreria prende automaticamente le variabili di sessione
			// aggiornate, così si evita il problema della editpassword
			prjImago2MP.MP_UnlockWorkstation(objUtente.LOGIN,objUtente.PWD_CRYPTED)
			return;	
			
		case "DEALLOCATE":
			try{
				prjImago2MP.MP_deallocateAdapter();			
			}
			catch(e){
				alert("Can't deallocate Adapter - " + e.description);
			}			
		case "QUIT":
			try{
				prjImago2MP.MP_logout(err_number,err_descr);
			}
			catch(e){
				;			
			}
			try{
				prjImago2MP.MP_deallocateAdapter();			
			}
			catch(e){
				alert("Can't deallocate Adapter - " + e.description);
			}
			return;		
		default:
			return;
		}
	}

}


// **************************************************************
// ***************** AJAX ***************************************
function callGetCryptedString(value){
	if (value==""){return;}
	try{
		ajaxUserManage.getCryptedString(value,replyGetCryptedString);
	}
	catch(e){
		alert("callGetCryptedString - " + e.description)
	}	
}

var replyGetCryptedString =  function (returnValue){
	var err_number
	var err_descr
	
	
//	alert(returnValue);
	try{
		prjImago2MP.MP_login(basePC.UTENTE_EMERGENZA_SYSV,returnValue,MP_applicationName,err_number,err_descr);
	}
	catch(e){
		alert("replyGetCryptedString - " + e.description);
	}

}
// **************************************************************