var percorsoFile = window.location.pathname.split("/");
var paginaLocale = percorsoFile[percorsoFile.length - 1 ];



$(function(){
	window.HomeWindow = window.CartellaWindow = null;
	var win = window;

	while(win.parent != win){

		win = win.parent;

		switch(win.name){
			case 'schedaRicovero': 	window.CartellaWindow = win;
				break;
			case 'Home':			window.HomeWindow = win;
				break;
			default:break;
		}
	}
	
});

// ***************** ADT
function openADT(){
	try{ 

		var urlContest = "";
		var idenAnag = "";
		
		idenAnag = getLocalIdenAnag();			
		

		try{var rs = getHomeFrame().executeQuery('configurazioni.xml','getConfigModule',["ADT","RADIO"]);	}catch(e) {alert("Errore: problemi in getADTurl.");}
		if (rs.next()){
			urlContest = rs.getString("valore");
		}
		else{
			alert("Errore: problemi nel recupero dati modulo ADT.");
			return;
		}
		urlContest += "?username=" + baseUser.LOGIN ;
		urlContest += "&scheda=LISTA_ATTESA_SCELTA";

		
		myLista = new Array();
		myLista.push(idenAnag);		
		var rs = getHomeFrame().executeQuery('privacy.xml','getPrivacyAnagInfo',myLista);	
		if (rs.next()){
			urlContest += "%26COGNOME%3D" + rs.getString("COGN");
			urlContest += "%26CODICE_FISCALE%3D" + rs.getString("COD_FISC");
			urlContest += "%26COMUNE_NASCITA%3D" + rs.getString("COM_NASC");
//			urlContest += "%26COM_RES%3D" + rs.getString("COM_RES");
			urlContest += "%26DATA_NASCITA%3D" + rs.getString("DATA");
			urlContest += "%26NOME%3D" + rs.getString("NOME");
			urlContest += "%26SESSO%3D" + rs.getString("SESSO");
			urlContest += "%26STATO_PAGINA%3DT";
			
		}
		else{
			// ERRORE !!!
			alert("Errore grave: Paziente non trovato");
			return;
		}
		// *************************
		urlContest += "&nomeHost="+  basePC.IP ;
		//alert(urlContest);
		var finestra = window.open(urlContest, "", "scrollbars=yes, top=0, left=0, width="+screen.availWidth+", height="+screen.availHeight+", status=yes, resizable=yes");
	}
	catch(e){
		alert("openADT - Error: " + e.description);
	}		
}


// ************** privacy


function insOscCitt(idEsa){
	try{

		var idenEsame ="";
//		alert("insOscCitt");
		if (idEsa=="" || typeof(idEsa)=="undefined"){
			// ATTENZIONE , per default ora assumo di dover
			// selezionare UN SOLO ESAME e spalmare il salvataggio su tutti gli esami stesso num_pre
			if (paginaLocale=="worklist"){
				if (conta_esami_sel()!=1){ 
					alert("Prego, selezionare un solo esame.");
					return;
				}
				idenEsame = stringa_codici(array_iden_esame);
			}
			else if (paginaLocale == "consolle"){
				// attenzione da console ogni tanto non fa refresh
				idenEsame = array_iden_esame.toString();
				try{j$("linkToOpenOscCitt").remove();}catch(e){;}
				creaLivelloOscuramentoCittadino();
				j$("#linkToOpenOscCitt").attr("href", paginaOscuramentoCittadino + "?sorgente=" + paginaLocale +"&iden_esame=" + idenEsame.replace(/[*]/g, ","));		
				j$('#linkToOpenOscCitt').click();
				return;
			}
			else{
				alert("errore");
				return;
			}
		}
		else{
	 		idenEsame = idEsa;
		}
		$("#linkToOpenOscCitt").attr("href", paginaOscuramentoCittadino + "?sorgente=" + paginaLocale +"&iden_esame=" + idenEsame.replace(/[*]/g, ","));		
		$('#linkToOpenOscCitt').click();
		
	}
	catch(e){
		alert("insOscCitt - Error: " + e.description);
	}	
}




function privacyPortal(modalita, idPaz){
	try{ 

		var urlContest = "";
		var idenAnag = "";
		
		if (idPaz=="" || typeof(idPaz)=="undefined"){
			try{
				if (conta_esami_sel()!=1){
				alert("Prego, selezionare un solo esame.");
				return;
			}}catch(e){;} 
			idenAnag = getLocalIdenAnag();			
		}
		else{
			idenAnag = idPaz;
		}
		var myLista = new Array();
		myLista.push("RADIO");		
		myLista.push(idenAnag);
		stm = getHomeFrame().executeStatement('privacy.xml','getPrivacyHandlerKeys',myLista,2);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel recupero dati modulo privacy. Id remoto nullo.");
			return;
		}
		var urlPrivacyHandler = stm[2]; // primo parametro output
		var idenRemoto = stm[3]; // secondo parametro output
		if (urlPrivacyHandler==""){
			alert("Errore: Privacy Handler non corretta. urlPrivacyHandler: " + urlPrivacyHandler  +" idenRemoto: " + idenRemoto);
			return;
		}
		urlContest = urlPrivacyHandler;
		urlContest += "?username=" + baseUser.LOGIN ;

		if (modalita=="show"){
			urlContest += "&scheda=CONSENSO_UNICO%26ACTION%3DVISUALIZZA%26ASSIGNING_AUTHORITY%3DWHALE";
		}
		else{
			urlContest += "&scheda=CONSENSO_UNICO%26ACTION%3DINSERISCI%26ASSIGNING_AUTHORITY%3DWHALE";
		}
		
		myLista = new Array();
		myLista.push(idenAnag);		
		var rs = getHomeFrame().executeQuery('privacy.xml','getPrivacyAnagInfo',myLista);	
		if (rs.next()){
			urlContest += "%3A%3ACOGNOME%3D" + rs.getString("COGN");
			urlContest += "%3A%3ACODICE_FISCALE%3D" + rs.getString("COD_FISC");
			urlContest += "%3A%3ACOM_NASC%3D" + rs.getString("COM_NASC");
			urlContest += "%3A%3ACOM_RES%3D" + rs.getString("COM_RES");
			urlContest += "%3A%3ADATA_NASCITA%3D" + rs.getString("DATA");
			urlContest += "%3A%3ANOME%3D" + rs.getString("NOME");
			urlContest += "%3A%3ASESSO%3D" + rs.getString("SESSO");
		}
		else{
			// ERRORE !!!
			alert("Errore grave: Paziente non trovato");
			return;
		}
		// *************************
		urlContest += "&nomeHost="+  basePC.IP ;
//		alert(urlContest);
		var finestra = window.open(urlContest, "", "scrollbars=yes, top=0, left=0, width="+screen.availWidth+", height="+screen.availHeight+", status=yes, resizable=yes");
		if(finestra)
			finestra.focus();
		else
			finestra = window.open(urlContest, "", "scrollbars=yes, top=0, left=0, width="+screen.availWidth+", height="+screen.availHeight+", status=yes, resizable=yes");		
	}
	catch(e){
		alert("insPrivacy - Error: " + e.description);
	}		
		
}


function canInsertPrivacy(){
	var idPaziente="";
	var bolEsito = false;
	var PAZ_PRIVACY_CODE = "";
	var nonCompilatoValue = "NON COMPILATO";

	try{

		idPaziente = getLocalIdenAnag();
		if (idPaziente!=""){
			var myLista = new Array();
			myLista.push(idPaziente);
			var rs = top.executeQuery('privacy.xml','getPrivacyPazCode',myLista);	
			if (rs.next()){
				PAZ_PRIVACY_CODE = rs.getString("PAZ_PRIVACY_CODE");
				if (PAZ_PRIVACY_CODE==nonCompilatoValue){
					bolEsito = true;
				}
				else{
					bolEsito = false;
				}
			}
		}
		
	}
	catch(e){
		alert("canInsertPrivacy - Error: " + e.description);
		bolEsito = false;
	}
	return bolEsito;
}
// ***************************************************************************************
// ***************************************************************************************


function getFormRepository(urlRepo, paramUrl, utente, postazione, cod_cdc){
	try{
		var oggetto = document.getElementById("idformRepository");
		if (oggetto){
			return oggetto;
		}
		else{
			var elemForm = document.createElement("FORM");
			elemForm.name = "formRepository";
			elemForm.id = "idformRepository";
			elemForm.action = urlRepo;
			elemForm.method = "POST";
			elemForm.target = "wndRepo";
			
			var elemUser = document.createElement("INPUT");
			elemUser.type = "hidden";
			elemUser.name = "utente";
			elemUser.value = utente;
			elemForm.appendChild(elemUser);
			
			var elemPostazione = document.createElement("INPUT");
			elemPostazione.type = "hidden";
			elemPostazione.name = "postazione";
			elemPostazione.value = postazione;
			elemForm.appendChild(elemPostazione);
			
			
			var elemCodCdc = document.createElement("INPUT");
			elemCodCdc.type = "hidden";
			elemCodCdc.name = "cod_cdc";
			elemCodCdc.value = cod_cdc;
			elemForm.appendChild(elemCodCdc);
			

			var elemPagina = document.createElement("INPUT");
			elemPagina.type = "hidden";
			elemPagina.name = "pagina";
			elemPagina.value = "VISUALIZZATORE_EXT";
			elemForm.appendChild(elemPagina);

			var elemIdPatient = document.createElement("INPUT");
			elemIdPatient.name = "idPatient";
			elemIdPatient.type = "hidden";
			elemIdPatient.value = paramUrl;
			
			elemForm.appendChild(elemIdPatient);
			

			
			document.body.appendChild(elemForm);
			return document.getElementById("idformRepository");
		}
	}
	catch(e){
		alert("getFormRepository - Error: " + e.description);
	}
}


function apriRepository_da_ambulatorio(){
	var myLista = new Array();
	var urlRepo = "", idPaziente = "", paramUrl = "", cod_cdc="";
	var rs , stm , oggetto;
	var myWin;
	
	//alert("apriRepository_da_ambulatorio");

	
	if (paginaLocale=="worklist"){
		if (conta_esami_sel()!=1){
			alert("Prego, selezionare un solo esame.");
			return;
		}
	}
	try{
		//alert(paginaLocale);
		switch(paginaLocale){
			case "SL_RicPazWorklist":
				idPaziente = stringa_codici(iden);
				cod_cdc = stringa_codici(array_reparto);
				oggetto = top;
				break;
			case "worklist":
				if (conta_esami_sel()!=1){
					alert("Prego, selezionare un solo esame.");
					return;
				}
				idPaziente = stringa_codici(array_iden_anag);
				cod_cdc = stringa_codici(array_reparto);
				oggetto = top;
				break;
			case "consolle":
				// console
				oggetto = this;
				idPaziente = globalIdenAnag;				
				cod_cdc = array_reparto[0];
				break;				
			default:
				return;
		}
		if (idPaziente==""){
			alert("Errore: id Paziente Nullo");
			return;
		}
		// *******************
		apriRepository_byIdenAnag(idPaziente, oggetto, cod_cdc);

	}
	catch(e){
		alert("apriRepository - Error: " + e.description );
	}
	
}

function apriRepository_byIdenAnag_PER_LA_PRIVACY(idenAnag, homeFrame, cod_cdc){
	var myLista = new Array();
	var urlRepo = "",  paramUrl = "";
	var rs , stm , oggetto;
	var myWin;
	try{	
		
		

		
		myLista = new Array();
//		myLista.push("RADIO");		
		myLista.push("FENIX_ACCESS");		
		myLista.push(idenAnag);
		stm = homeFrame.executeStatement('info_repository.xml','getRepositoryKeys',myLista,2);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel recupero dati Repository");
			return;
		}
		urlRepo = stm[2]; // primo parametro output
		paramUrl = stm[3]; // secondo parametro output, id_remoto
		if ((urlRepo=="")||(paramUrl=="")){
			alert("Errore: Url repository non corretta. urlRepo: " + urlRepo  +" paramUrl: " + paramUrl);
			return;
		}
		
		
		if(paramUrl=='PRZVLV44B62B104T' || paramUrl=='PPERFL62H15A145D' || paramUrl =='PPELSN66E05A145T'){
			alert("Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys");
			return;
		}
		// **************************************************
		
		// *********** nuova parte da mettere *solo* su server di test
		urlRepo += "?username=" + baseUser.LOGIN ;
		urlRepo += "&nomeHost="+  basePC.IP ;
		urlRepo += "&scheda=DOCUMENTI_PAZIENTE%26SITO%3DPIC%26ASSIGNING_AUTHORITY%3DWHALE"
		myLista = new Array();
		myLista.push(idenAnag);		
		var rs = getHomeFrame().executeQuery('privacy.xml','getPrivacyAnagInfo',myLista);	
		if (rs.next()){
			urlRepo += "%26COGNOME%3D" + rs.getString("COGN");
			urlRepo += "%26CODICE_FISCALE%3D" + rs.getString("COD_FISC");
			urlRepo += "%26COM_NASC%3D" + rs.getString("COM_NASC");
			urlRepo += "%26COM_RES%3D" + rs.getString("COM_RES");
			urlRepo += "%26DATA_NASCITA%3D" + rs.getString("DATA");
			urlRepo += "%26NOME%3D" + rs.getString("NOME");
			urlRepo += "%26SESSO%3D" + rs.getString("SESSO");
			urlRepo += "%26EMERGENZA_MEDICA%3Dfalse";
			urlRepo += "%26ID_REMOTO%3D" + paramUrl;
			// da compilare ? con cosa ?
			urlRepo += "%26ANAGRAFICA%3D";
		}
		else{
			// ERRORE !!!
			alert("Errore grave: Paziente non trovato");
			return;
		}
		// ****************************************************************
//		alert(urlRepo);
		myWin=window.open(urlRepo,"","fullscreen=yes, status=no, scrollbars=no");
		
	}
	catch(e){
		alert("apriRepository_byIdenAnag - Error: " + e.description );
	}	
}


function apriRepository_byIdenAnag(idenAnag, homeFrame, cod_cdc){
	var myLista = new Array();
	var urlRepo = "",  paramUrl = "";
	var rs , stm , oggetto;
	var myWin;
	try{	
		
		

		
		myLista = new Array();
		myLista.push("RADIO");		
		myLista.push(idenAnag);
		stm = homeFrame.executeStatement('info_repository.xml','getRepositoryKeys',myLista,2);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel recupero dati Repository");
			return;
		}
		urlRepo = stm[2]; // primo parametro output
		paramUrl = stm[3]; // secondo parametro output
		if ((urlRepo=="")||(paramUrl=="")){
			alert("Errore: Url repository non corretta. urlRepo: " + urlRepo  +" paramUrl: " + paramUrl);
			return;
		}
		
		// ************** tappullo pazienti privacy *********
		if(paramUrl=='PRZVLV44B62B104T' || paramUrl=='PPERFL62H15A145D' || paramUrl =='PPELSN66E05A145T'){
			alert("Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys");
			return;
		}
		// **************************************************		

		var oggettoForm = getFormRepository(urlRepo, paramUrl, homeFrame.baseUser.LOGIN, homeFrame.basePC.IP, cod_cdc);
		
		
		if (oggettoForm){
			homeFrame.target = "wndRepo";
			myWin=window.open("","wndRepo","fullscreen=yes, status=no, scrollbars=no");
			oggettoForm.submit();
		}
		else{
			myWin=window.open(urlRepo+"?User=ImagoWeb&IdPatient="+paramUrl,"","fullscreen=yes, status=no, scrollbars=no");
		}		
	}
	catch(e){
		alert("apriRepository_byIdenAnag - Error: " + e.description );
	}	
}


function apriIPatient(){
	
	
	var idenAnag = ""		;
	var nEsami ; var idenRemoto = "";
	var myLista = new Array();
	var urlWhale=""; var urlToCall="";
	var rs ;
	try{
		nEsami = conta_esami_sel();
		if (nEsami==0){alert("Prego selezionare almeno una riga");return;}
		if (nEsami==1){
			idenAnag = stringa_codici(array_iden_anag);
		}
		else{
			idenAnag = stringa_codici(array_iden_anag).split("*")[0];
		}
		myLista.push("WHALE_URL_AUTOLOGIN");		
		myLista.push("SNODO");
		rs = top.executeQuery('info_repository.xml','getParamConfigPage',myLista);
		if (rs.next()){
			urlWhale = rs.getString("valore");
		}
		else{	alert("Errore: non definita pagina di configurazione nel DB");return;		}
		

		myLista = new Array();
		myLista.push(idenAnag);
		rs = top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
		if (rs.next()){
			idenRemoto = rs.getString("ID_REMOTO");
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}
		// *************** DA TOGLIERE !!!!! ****************		
		// ************** tappullo pazienti privacy *********
		if(idenRemoto=='PRZVLV44B62B104T' || idenRemoto=='PPERFL62H15A145D' || idenRemoto =='PPELSN66E05A145T'){
			alert("Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys");
			return;
		}
		// **************************************************
		urlToCall = urlWhale + "?utente=" + top.baseUser.LOGIN + "&pagina=I-PATIENT&id_paziente=" + idenRemoto + "&PROV_CHIAMATA=AMBULATORIO";	
		
		myWinCartella = window.open(urlToCall,"schedaRicovero","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
		
	}
	catch(e){
		alert("apriIPatient - Error: " + e.description );
	}	
}



var myWinCartella;
function apriCartella(funzione, iden_esame) {
	//alert("funzione: " + funzione);
	if(typeof CartellaWindow != 'undefined' && CartellaWindow != null){
		return alert('Not implement yet');
		switch(funzione){
			case '':
				break;
		}
	}
	
	// **************************
	// nuova funzione : CONSULENZE
	if (funzione=="CONSULENZE"){
		alert(funzione);
		return;
	}
	// **************************
	var urlCartella  = "Snodo?azione=Cartella&DO=OPEN";
	
	
	// ************ da togliere **************
	// tappullo RICCIO !!!
	if(funzione=="INSERIMENTO_RR_PRESTAZIONI_AMB" || funzione=="INSERIMENTO_RR_FARMACI_AMB" || funzione=="WORKLIST_RICETTE"){
		if (paginaLocale=="worklist"){
			var num_esami_selezionati = conta_esami_sel();
			if (num_esami_selezionati>1){
				alert("Prego selezionare un solo esame");
				return;
			}		
		}
	}
	// ********************************************
	
	if (paginaLocale=="worklist"){
		if (conta_esami_sel()!=1){
			alert("Prego, selezionare un solo esame.");
			return;
		}
	}
	try {
		if (typeof funzione != 'undefined') {
			switch (funzione){
				case "INSERIMENTO_RR_PRESTAZIONI_AMB":
				case "INSERIMENTO_RR_FARMACI_AMB":
				case "INSERIMENTO_PT":
				case "VISUALIZZA_PT":
				case "WORKLIST_RICETTE":
					var urlCartella  = "Snodo?azione=RicettaRossa&DO=OPEN";
					break;
				default:
					// non cambio nulla
					break;
			}
		}
		if (typeof iden_esame != 'undefined') {
			urlCartella += "&IDEN_ESAME=" + iden_esame;
		} else {
			var iden_anag = "";
			var reparto = "";
			var dataEsame = "";

			switch(paginaLocale){
				case "SL_RicPazWorklist":
					if(funzione!="INSERIMENTO_RR_PRESTAZIONI_AMB" && funzione!="INSERIMENTO_RR_FARMACI_AMB" && funzione!="WORKLIST_RICETTE"){				
						alert('Azione impossibile qui');
					}
					else{
						iden_anag = stringa_codici(iden);
						reparto = "";
						dataEsame = "";
						urlCartella += "&IDEN_ANAG=" + iden_anag;
						urlCartella += "&DATA_EVENTO=" + dataEsame;
						urlCartella += "&REPARTO=" + reparto;						
						urlCartella += "&IDEN_ESAME=" ;
					}
					break;					
				case "worklist":
					if (conta_esami_sel()!=1){
						alert("Prego, selezionare un solo esame.");
						return;
					}
					
					try {
						iden_visita = stringa_codici(array_iden_visita);
						if(iden_visita != null && iden_visita != 0 && iden_visita != -1 && iden_visita != ''){
							urlCartella += "&IDEN_ACCESSO=" + iden_visita;
						}
					} catch (e) {
						/*non ho iden_visita, tanti saluti*/
					}
					
					iden_esame = stringa_codici(array_iden_esame);
					urlCartella += "&IDEN_ESAME=" + iden_esame;
					urlCartella += "&IDEN_ANAG=" + stringa_codici(array_iden_anag);
					/*opzionali ma non fa male metterli comunque (reparto preferibilmente richiesto da piani terapeutici)*/
					urlCartella += "&DATA_EVENTO=" + stringa_codici(array_data_esame);
					urlCartella += "&REPARTO=" + stringa_codici(array_reparto);
					break;
				case "consolle":
					iden_anag = globalIdenAnag; //Sarebbe meglio un iden_esame
					reparto = array_reparto[0];
					dataEsame = array_dat_esa[0];
					urlCartella += "&IDEN_ANAG=" + iden_anag;
					urlCartella += "&DATA_EVENTO=" + dataEsame;
					urlCartella += "&REPARTO=" + reparto;
					break;		
				default:
					return;
			}
		}
		if (typeof funzione != 'undefined') {
			urlCartella += "&FUNZIONE=" + funzione;
		}
		

		// *********************************
		myLista = new Array();
		var myIdenAnag = "";
		var idenRemoto = "";
		if (paginaLocale=="worklist"){
			myIdenAnag = stringa_codici(array_iden_anag);	
			myLista.push(myIdenAnag);
			var rs = top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
			if (rs.next()){
				idenRemoto = rs.getString("ID_REMOTO");
			}
			
		}
		else if (paginaLocale =="consolle"){
			myIdenAnag = globalIdenAnag;	
			myLista.push(myIdenAnag);
			var rs = parent.top.opener.top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
			if (rs.next()){
				idenRemoto = rs.getString("ID_REMOTO");
			}
			
		}
		else if (paginaLocale =="SL_RicPazWorklist"){
			myIdenAnag = stringa_codici(iden);	
			myLista.push(myIdenAnag);
			var rs = top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
			if (rs.next()){
				idenRemoto = rs.getString("ID_REMOTO");
			}
		}		
		else{
				alert("Impossibile continuare. Contattare amministratore di sistema.");
				return;
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}
				
		if(idenRemoto=='PRZVLV44B62B104T' || idenRemoto=='PPERFL62H15A145D' || idenRemoto =='PPELSN66E05A145T'){
			alert("Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys");
			return;
		}

		//***************************
		//****** modifica DEMA ******
		//***************************
		if(funzione=="INSERIMENTO_RR_PRESTAZIONI_AMB" || funzione=="INSERIMENTO_RR_FARMACI_AMB" || funzione=="WORKLIST_RICETTE"){
			myWinCartella = window.open(urlCartella,"ambulatorio","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
		}
		else{
			myWinCartella = window.open(urlCartella,"schedaRicovero","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
		}
		//***************************		
		
		setTimeout(function(){
		if (funzione =="RICHIESTA"){
			var idenTestata = "592446";
			var idenEsame = stringa_codici(array_iden_esame).split("*")[0];
			var stm ;
			try{stm = top.executeStatement('multi_ricette.xml','updStatoRichLabo',[idenTestata,idenEsame],0);}catch(e){alert("errore in updStatoRichLabo");}
			if (stm[0]!="OK"){
				alert("Error: " + stm[1]);
			}
		}
							},10000);
		// ************		
		
		
		//setTimeout(function (){myWinCartella.focus();}, 6000 );
	} catch (e) {
		alert("apriCartella - Error: " + e.description );
	}
}




function check_iden_esa(funzione, errormsg) {
	var propJSONEsame = "";
	var jsonObj;
	var stm_par = new Array();
	stm_par.push(stringa_codici(array_iden_esa));
	var rs = top.executeQuery('infoWorklist.xml','getProprietaEPrestazione',stm_par);
	if (rs.next()){
		propJSONEsame = rs.getString("PROPRIETA");
		if (propJSONEsame!="") {
			jsonObj = JSON.parse(propJSONEsame);
			if(funzione == 'RICHIESTA' && jsonObj.RICHIEDIBILE=="N"){
				if (typeof errormsg != 'undefined')
					alert(errormsg);
				else
					alert("Impossibile associare una richiesta al tipo di esame.");
				return false;
			}
		}
	}
	return true;
}

function apriCartellaDaWk(funzione) {
	if (conta_esami_sel()!=1){
		alert("Prego, selezionare un solo esame.");
		return;
	}
	try{
		if (check_iden_esa(funzione)) {
			apriCartella(funzione);
		}
	} catch(e) {
		alert("Errore: apriCartellaDaWk");
	}
}

function setPrelievoEffettuato() {
	if (conta_esami_sel()!=1){
		alert("Prego, selezionare un solo esame.");
		return;
	}
	if (!check_iden_esa('RICHIESTA','Operazione non consentita')) {
		return;
	}
	try{
		var stm_par = new Array();
		var iden_esame = stringa_codici(array_iden_esame);
		var out = top.executeStatement('Cartella.xml','getDatiRichiestaAssociata',[iden_esame],4);
		if (out[0] == 'OK') {
			var iden_richiesta = out[2];
			try{top.executeStatement('Cartella.xml','setPrelievoEffettuato',[iden_richiesta],0);}catch(e){alert("setPrelievoEffettuato, idRichiesta" + iden_richiesta + " error: " + e.description);}  
			try{top.executeStatement('Cartella.xml','setPrelievoEffettuatoLocale',[iden_esame],0);}catch(e){alert("setPrelievoEffettuatoLocale error: " + e.description);};
		} else { 
			alert('Si e\' verificato un errore. Error: ' + out[1] + ' per iden_esame: ' + iden_esame);
		}
		aggiorna();
	} catch(e) {
		alert("Errore: setPrelievoEffettuato " + e.description + " per iden_esame: " + iden_esame );
	}
}


function apriPolaris(funzione) {
	
	var urlPolaris  = "Snodo?azione=PrenPolaris&DO=OPEN";
	var myWin;

	//alert(paginaLocale +"#");
	if (conta_esami_sel()!=1){
		alert("Prego, selezionare un solo esame.");
		return;
	}
	
	try {
		if (typeof funzione != 'undefined') {
			switch (funzione){
				case "PRENOTAZIONE":
					var urlPolaris  = "Snodo?azione=PrenPolaris&DO=OPEN";
					break;
				default:
					// non cambio nulla
					break;
			}
		}
		
		var iden_anag = "";
		var reparto = "";
		var dataEsame = "";

		switch(paginaLocale){
			case "SL_RicPazWorklist":
				alert('Azione impossibile qui - SL_RicPazWorklist');
				break;
			case "worklist":
				iden_esame = stringa_codici(array_iden_esame);
				urlPolaris += "&IDEN_ESAME=" + iden_esame;
				urlPolaris += "&IDEN_ANAG=" + stringa_codici(array_iden_anag);
				break;
			case "consolle":
				alert('Azione impossibile qui - consolle');
				break;

			default:
				return;
		}
		
		if (typeof funzione != 'undefined') {
			urlPolaris += "&FUNZIONE=" + funzione;
		}
		//alert("chiamerei " + urlPolaris );
		myWin = window.open(urlPolaris,"schedaRicovero","fullscreen=yes, status=no, scrollbars=no");
	} catch (e) {
		alert("apriPolaris - Error: " + e.description );
	}	
	
	
}

// chiamata effettuabile dalla/e worklist
function apriDatiStrutturati(){
	try{
		if (conta_esami_sel()!=1){
			alert("Prego, selezionare un solo esame.");
			return;
		}
		//alert("apriDatiStrutturati ") ;
		var iden_esame = stringa_codici(array_iden_esame);
		apriCartella("DATI_LABORATORIO", iden_esame);
		// apriCartella(''DATI_LABORATORIO'', Get_Value_Field('IDEN')
	}
	catch (e) {
		alert("apriDatiStrutturati - Error: " + e.description );
	}	
}


function getHomeFrame(){
	var objHomeFrame;
	
	try{
		switch(paginaLocale){
			case "SL_RicPazWorklist":
				objHomeFrame = top;
				break;
			case "worklist":
				objHomeFrame = top;
				break;
			case "consolle":
				objHomeFrame = parent.top.opener.top;			
				break;
			default:
				objHomeFrame = top;
		}		
	}
	catch(e){
		alert(e.description);
	}
	return objHomeFrame;
}

// funzione che a seconda di dove
// mi trovo recupera idenAnag corretto
function getLocalIdenAnag(){
	var idenAnag = "";
	try{
		switch(paginaLocale){
			case "SL_RicPazWorklist":
				idenAnag = stringa_codici(iden).split("*")[0];
				break;
			case "worklist":
				// limitare num.selezioni a 1 !
				// per non prendere più pazienti
				idenAnag = stringa_codici(array_iden_anag).split("*")[0];
				break;
			case "consolle": 
				// è possibile da qui ?!?!?! per ora no
				idenAnag = globalIdenAnag;
				break;
			default:
				idenAnag = "";
		}
	}
	catch(e){
		alert("getLocalIdenAnag - Error: " + e.description);
	}		
	return idenAnag ;
}


// modifica 16-4-15
function apriWkEsamiImmagini(){

	var idenAnag = ""		;
	var nEsami =0; var idenRemoto = "";
	var urlWhale=""; var urlToCall="";
	var rs ;
	try{
		switch(paginaLocale){
			case "SL_RicPazWorklist":
				idenAnag = stringa_codici(iden);
				break;
			case "worklist":					
				idenAnag = stringa_codici(array_iden_anag).split("*")[0];
				break;
			case "consolle":
				idenAnag = globalIdenAnag; 
				break;
			default:
				return;
		}
//	alert("#" + iden_anag +"#")
		rs = top.executeQuery('info_repository.xml','getParamConfigPage',["WHALE_URL_AUTOLOGIN","SNODO"]);
		if (rs.next()){
			urlWhale = rs.getString("valore");
		}
		else{	alert("Errore: non definita pagina di configurazione nel DB");return;		}

		rs = top.executeQuery('info_repository.xml','getIdenRemoto',[idenAnag]);
		if (rs.next()){
			idenRemoto = rs.getString("ID_REMOTO");
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}
		urlToCall = urlWhale + "?utente=" + top.baseUser.LOGIN + "&postazione="+ basePC.IP  + "&pagina=WORKLIST_ESAMI_IMMAGINI&idRemoto=" + idenRemoto ;
		myWinCartella = window.open(urlToCall,"schedaRicovero","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");
	}
	catch(e){
		alert("apriWkEsamiImmagini - Error: " + e.description );
	}	

}




function canRemoveAnonym(){
	var idPaziente="";
	var cdc = "";
	var esito
	var bolEsito = false;

	try{
		// dal momento che la funzionalità sara' possibile
		// solo dalla wk principale avro' "dietro" worklistEngine
		if (conta_esami_sel()!=1){
			return false;
		}
		// 		idPaziente = getLocalIdenAnag();
		idPaziente  =		stringa_codici(array_iden_anag).split("*")[0];
		cdc = stringa_codici(array_reparto).split("*")[0];
		if (idPaziente!="" && cdc != ""){
			var rs = top.executeQuery('gestione_anonimato.xml','isAnonimoByAnagCdc',[idPaziente, cdc]);	
			if (rs.next()){
				if (rs.getString("ESITO")=="S"){
					bolEsito = true;
				}
				else{
					bolEsito = false;
				}
			}
		}
	}
	catch(e){
		alert("canRemoveAnonym - Error: " + e.description);
		bolEsito = false;
	}
	return bolEsito;
}



// modifica diabetologia
// per problemi di riferimento 
// x DIABETOLOGIA !! ma utile per tutte le chiamate
// crossDomain
 if (window.addEventListener) {  // all browsers except IE before version 9
	 window.addEventListener("message", receiveMessageValue, false);
 } else {
	 if (window.attachEvent) {   // IE before version 9
		 window.attachEvent("onmessage", receiveMessageValue);     // Internet Explorer from version 8
	 }
 }
	
function receiveMessageValue(event) {
	var saveButton = document.getElementById('psavebutton');
	if (window.postMessage) {
		 var obj = event.data;
		 if (obj.success) {
			 // obj.success is defined. We received the response via postMessage
			 // as an object, and we are using a browser that supports
			 // postMessage objects (not IE8/9).
			 if (obj.success == 'ok') {
				 alert(obj.value);
			 } else {
				 alert('success: ' + obj.success);
			 }
		 } else {
			 // We received the response via postMessage as a string. This works
			 // for all browsers that support postMessage, including IE8/9.
			 var str = eval('(' + obj + ')');
			 if (str.success && str.success == 'ok') {
				 eval (str.value);
			 } else {
				 alert('success: ' + str.success);
			 }
		 }
	} else {
		alert('postMessage not supported');
	}
}
// ********