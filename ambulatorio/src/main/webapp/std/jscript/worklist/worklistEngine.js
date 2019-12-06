// ************************************
// funzioni per la selezione riga
// JavaScript Document
var timer_resize_tab_header;
var timeout_resize_tab_header = 300;


var vettore_indici_sel = new Array();
var old_selezionato = -1;
var oldStyle;


var dimFramesetSenzaInfoEsame = "0,*,0";
// devo ridimensionarlo in base allo spazio disponibile
// (availHeight - topFrame(filtri) - 20) / 2
var dimFramesetConInfoEsame = "";

// handle finestra della consolle
var hndConsolleRefertazione;

var bolInfoEsameAperto = false;
// funzione da richiamare dopo il
// controllo sul lock de l record
// in una tabella
var functionToCallAfterCheckLock="";

// questa variabile è utilizzata
// per bypassare tutti i controlli su eventuali lock
// ed è utilizzata per pilotare in automatico Polaris
// Se usata per refertare DEVE andare in combinata con
// l'apertura in sola lettura
var bolByPassAllCheckForAutoDriving = false;

var bolOpenConsoleInReadOnlyMode= false;
// ***************************************************
// SPEZIA - variabile per notifica se esame NON ancora eseguito
var bolNotificaEsameNonEseguito = true;
// indica le lettere relative alle metodiche per le quali applicare il controllo
// RX, TAC, RM
var modalityToNotify = "";
// ***************************************************

// variabile indicante se si è scelto di refertare
// in modalità "strutturata"
var strRefertoStrutturato = "N";


// *********** nuovo privacy
// *** valutare se spostare in 
// posto comune , come home
var msgPrivacyNotCompiled = "Impossibile continuare: i moduli del consenso per il\ntrattamento dei dati non sono stati compilati.";
var msgPrivacyReportNotAllowed = "Impossibile continuare: non e'stato dato il consenso alla refertazione.";
// ***************

function arrayContieneElemento(vettore,elemento){
	var i=0;
	
	for(i=0;i<vettore.length;i++){
		if(vettore[i]==elemento){
			return true;
		}
	}
	return false;
}


/*FUNZIONE ILLUMINA*/
function illumina(indice){
	
	// ****
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		removeClass(document.all.oTable.rows(indice), "sel");
		rimuovi_indice(indice);
		}
	else{
		addClass(document.all.oTable.rows(indice), "sel");
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			  removeClass(document.all.oTable.rows(old_selezionato), "sel");
			  rimuovi_indice(old_selezionato);
		   }
	 }
	old_selezionato = indice;
}

// funzione ILLUMINA multiplo
function illumina_multiplo(indice){
	
	var resto = 0;
	var bolEnableAlternateColors;


	resto = (indice) % 2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
	
	if (hasClass(document.all.oTable.rows(indice), "sel")){
		// deseleziona
		rimuovi_indice(indice);
		if (bolEnableAlternateColors!="S"){
			removeClass(document.all.oTable.rows(indice), "sel");
		}
		else{

			if (resto!=0){
				// dispari
				removeClass(document.all.oTable.rows(indice), "sel");
			}
			else{
				//pari
				removeClass(document.all.oTable.rows(indice), "sel");
			}
		}
	}
	else{
		// seleziona
		nuovo_indice_sel(indice);		
		addClass(document.all.oTable.rows(indice), "sel");
		auto_deselezione_paz_div(indice);
	}
		// ***************
		/*
		parent.parent.barFrame.resetStartInitTabulator();		
		document.frmTabulator.idGroupTabulator.value = "idTabInfoRefertoInWorklist";
		document.frmTabulator.idTabulator.value = "idPrecedenti";
		apriChiudiInfoReferto();*/
		// ******************	
}



/** funzione che permette il rollover della riga */
function rowSelect_over(myIndice){
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		addClass(document.all.oTable.rows(myIndice), "col_over");
	}
}

function rowSelect_out(myIndice){
	
	var resto=0;
	var bolEnableAlternateColors;


	resto = (myIndice)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}	
	
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		if (bolEnableAlternateColors!="S"){
			removeClass(document.all.oTable.rows(myIndice), "col_over");
		}
		else{
			if (resto!=0){
				// dispari
				removeClass(document.all.oTable.rows(myIndice), "col_over");
			}
			else{
				//pari
				removeClass(document.all.oTable.rows(myIndice), "col_over");
			}
		}		
		
	}
}
 

 
/*FUNZIONE RIMUOVI_INDICE*/       
function rimuovi_indice(indice){
var trovato = false;
var lunghezza_array = vettore_indici_sel.length;
for (i=0;i<lunghezza_array;i++){
if (vettore_indici_sel[i]==indice){
	vettore_indici_sel[i] = -1;
	vettore_indici_sel.sort(confronto_dec);
	vettore_indici_sel.length = lunghezza_array -1;
	vettore_indici_sel.sort(confronto_asc);
	trovato = true;
	break;
		}
 	}
}

/*FUNZIONE NUOVO_INDICE_SEL*/     
function nuovo_indice_sel(indice){
	var trovato = false;
	lunghezza_array = vettore_indici_sel.length;
	for (i=0;i<lunghezza_array;i++){
		if (vettore_indici_sel[i]==indice){
		   trovato = true;
			break;
		}
	 }
	 if (trovato==false){
		vettore_indici_sel[lunghezza_array] = indice;
	}
	vettore_indici_sel.sort(confronto_asc);
}

/*FUNZIONE CONFRONTO_ASC*/
function confronto_asc (a,b){
 return a - b;
}
        
/*FUNZIONE CONFRONTO_DEC*/		
function confronto_dec (a,b){
 return b - a;
}

/*FUNZIONE STRINGA CODICI*/
function stringa_codici(vettore){
	var selezionati = 0;
	var codici_esami_sel = '';
	try{
		for (i=0;i<vettore_indici_sel.length;i++){
			selezionati ++;
			if (codici_esami_sel.toString()==''){
				codici_esami_sel = vettore[vettore_indici_sel[i]];
			}
			else{
				codici_esami_sel = codici_esami_sel + '*' + vettore[vettore_indici_sel[i]];
			}
		}
	}
	catch(e){
		alert("stringa_codici - Error: " +e.description);
	}
	return codici_esami_sel;
}


// in base alla serie di esami.iden (splittati da *)
// passati come parametro viene ritornata l'informazione
// relativa e corrispondente all'array richiesto
// esempio: passo esami.iden = 1 , 'array_iden_esame ' come input e 'array_cod_esa' come output
// verrà ritornato il cod_esa preso da array_cod_esa relativo a quell'esame.iden
function ritornaInfoEsame(valore, vettoreInput, vettoreOutput){
	var vettoreValori;
	var stringaOutput="";
	var i=0, j=0;
	var bolPrimoMatch = true;

	if (valore==""){return;}
	vettoreValori = valore.toString().split("*");
	for (i=0;i<vettoreValori.length;i++){
		for (j=0;j<vettoreInput.length;j++){
			if (vettoreValori[i]==vettoreInput[j]){
				//if (stringaOutput==""){	
				if (bolPrimoMatch){					
					stringaOutput = vettoreOutput[j];
				}
				else{
					stringaOutput = stringaOutput + '*' + vettoreOutput[j];
				}
				bolPrimoMatch = false;
			}
		}
	}
	return stringaOutput;
}
// ************************************************************************************************************************************************
// ************************************************************************************************************************************************


function creaElemento(tag){
	var x = document.createElement(tag);
	return x;
}

// funzione che crea e aappende un
// tag LINK per i file js esterni
function setJs(nomeFile)
{
	var l = creaElemento("SCRIPT");
	if (nomeFile==""){return;}
	l.setAttribute("type", "text/javascript");
	l.setAttribute("src",nomeFile);
	l.setAttribute("language","JavaScript");
	document.getElementsByTagName("head")[0].appendChild(l);
}

// funzione inserimento esame

function insEsame(valore){
	var codice='';
	var iden_anag = "";
	if (valore==''){return;}
	// controllo di non essere stato
	// chiamato dall'esterno
	if (document.frmExtParam.extParam_idenAnag.value!=""){
		iden_anag = document.frmExtParam.extParam_idenAnag.value; 
	}
	else{
	// ***
		iden_anag = stringa_codici(array_iden_anag);
	}
	if (iden_anag==''){
		try{
			iden_anag = document.frmAggiorna.iden_anag.value; 
		}
		catch(e){
			
		}
	}
	if (iden_anag==""){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	// ferrara
	var bolGestioneSole = false;
	
	//****** modifica del 10-02-15
	if (top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
		// controllo che abbia compilato il consenso unico
		// modifica 7-10-15
		/*
		if (canInsertPrivacy()){
				alert(top.PVCY_HANDLER.getErrorMessage("PVCY_NOT_COMPILED"));
				return;
		}
		*/
	}
	// ******************************	
	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(iden_anag)){return;}
	/* ******************* */	
	
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	// rimappo la form
	document.frmEsame.Hiden_anag.value = iden_anag.split("*")[0];
	document.frmEsame.Hiden_esame.value = "";
	document.frmEsame.tipo_registrazione.value = "I";		
	document.frmEsame.action = 'sceltaEsami?visualizza_metodica=N&cmd_extra=hideMan();';
	document.frmEsame.submit();
}

// funzione modifica Esame
function modEsame(valore){
	
	var codice='';
	
	// controllo se nessuno è definito
	if (valore == undefined){
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}			
		codice = array_iden_esame[vettore_indici_sel[0]];
	}
	else{
		
		codice = array_iden_esame[valore];
	}
	
	if ((codice == 0 )||(codice=="")){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	// resetto i valori 
	
	document.frmEsame.Hiden_esame.value = codice;	
	document.frmEsame.Hiden_anag.value = "";
	document.frmEsame.tipo_registrazione.value = "M";			
	document.frmEsame.action = "schedaEsame";	
	// ***
	document.frmEsame.submit();
}

function accettaEsame()
{
	var codice='';
	if (conta_esami_sel()!=0){
		codice = stringa_codici(array_iden_esame);
	}
	else{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (codice==""){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	// modifica aldo 31/7/14
	if (foundInStato(codice,"A")){
		alert("Prestazione già accettata.");		
		return;
	}	
	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(stringa_codici(array_iden_anag).toString().split("*")[0])){return;}
	/* ******************* */	

	// ********************
	// modifica 14-6-16
	if (top.home.getConfigParam("SITO")=="SAVONA"){
		// modifica 31-8-16
		/*
		if(!checkEsamiAccettazioneDiverse(codice))
		{
			alert("Non è possibile accettare prenotazione aventi numero di prenotazione differenti.")
			return;
		}
		*/ 
		// ***********		
		var intEst = stringa_codici(array_int_est).toString().split('*')[0];
		intEst = intEst.substr(0,1).toUpperCase();
		
		// ****************
		var bolImpegnativaObbligatoria = false;
		var rs ;
		var listaIdenEsami = codice.split('*');
		for (var z=0;z<listaIdenEsami.length;z++){
			try{rs=top.executeQuery('worklist_main.xml','isImpegnativaObbligatoria',[listaIdenEsami[z]]);}catch(e){alert("Errore isImpegnativaObbligatoria\n" + e.description); }
			if (rs.next()){
				if (rs.getString("esito")=="S"){
					bolImpegnativaObbligatoria = true;
					break;
				}
			}
			else{
				alert("Errore grave: esame cancellato " + listaIdenEsami[z]);
				return;
			}			
		}
		if (bolImpegnativaObbligatoria){
			// giro nuovo di Ago		
			if(intEst == 'E' && !stessaImpegnativaPresente())
			{
				scaricoRicettaDaEsami(codice,"A");
				return;
			}
		}
		// *******************	
	}
	// *************	
	
	// modifica 2-9-15
	try{
		if ((top.home.getConfigParam("SITO")=="SAVONA") && (array_reparto[vettore_indici_sel[0]] == "AMB_RAD_SV")){
			// controllo impegnativa
			var idenEsame = stringa_codici(array_iden_esame).split("*")[0];
			var rs ;
			try{rs=top.executeQuery('worklist_main.xml','getNumImpRich',[idenEsame]);}catch(e){alert("Errore getNumImpRich\n" + e.description); }
			if (rs.next()){
				//	*************************
				// modifica 23-9-15
				try{
					var rsRT = top.executeQuery('radioTerapia.xml','getNumCartella',[stringa_codici(array_iden_anag).toString().split("*")[0], stringa_codici(array_reparto).toString().split("*")[0]]);
					if (rsRT.next()){
						if (rsRT.getString("NUM_CARTELLA")==""){
							alert("Impossibile accettare l'esame: non e' stato inserito alcun numero cartella valido.");
							return false;
						}
					}
					else{
						alert("Impossibile accettare l'esame: non e' stato inserito alcun numero cartella valido.");
						return false;
					}
				}catch(e){;}
				//	*************************				
				var NUMIMP_NUMRICH = rs.getString("NUMIMP_NUMRICH");
				var INT_EST = rs.getString("INT_EST");
				if ((NUMIMP_NUMRICH=="")||(NUMIMP_NUMRICH=="undefined")||(typeof(NUMIMP_NUMRICH)=="undefined")){
					// modifica 26-10
					// escludere le 2 provenienze
					var IDEN_PRO = rs.getString("IDEN_PRO");
					// modifica 13-6-16	
					// attenzione: questi controlli spostarli su una funzione !!!!
					var IDEN_TICK = rs.getString("IDEN_TICK");
					if (IDEN_TICK!="107"){ 
						if ((INT_EST=="E")&&(IDEN_PRO!="2872")&&(IDEN_PRO!="4492")){
							alert("Impossibile accettare l'esame: impegnativa non compilata.");
							return false;
						}
					}
					// ******************
				}
			}
			else{
				alert("Errore grave : Esame cancellato\n" +idenEsame);
				return false;
			}			
		}
	}catch(e){;}
	//	***********
	doAccettaEsame();
	/*
	document.frmEsame.action = "accettazioneEsame";
	document.frmEsame.Hiden_esame.value = codice;
	
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=600,height=150,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.frmEsame.submit();*/
}

function doAccettaEsame(){
	try{
//		alert("doAccettaEsame"); return;
		document.frmEsame.action = "accettazioneEsame";
		document.frmEsame.Hiden_esame.value = stringa_codici(array_iden_esame);
		var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=600,height=150,status=yes,scrollbars=yes");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}
		document.frmEsame.submit();
	}
	catch(e){
		alert("doaAcettaEsame - Error: " + e.description);
	}
}


// modifica 14-6-16
function accettaEsameNew (pIdenEsame) {
	document.frmEsame.action = "accettazioneEsame";
	document.frmEsame.Hiden_esame.value = pIdenEsame;
	//alert(pIdenEsame);
	document.frmEsame.target = "wndSchedaEsame";
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=600,height=150,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=150,status=yes,scrollbars=yes");
	}	
	
	document.frmEsame.submit();
}


function stessaImpegnativaPresente()
{
	var i = 0;
	var impegnative = stringa_codici_con_vuoti(array_impegnativa).toString().split('*');
	var tipo_ricette = stringa_codici_con_vuoti(array_tipo_ricetta).toString().split('*');
	var arrIntEst = stringa_codici_con_vuoti(array_int_est).toString().split('*');
	var arrTicket = stringa_codici_con_vuoti(array_ticket).toString().split('*');
	var arrProvenienza = stringa_codici_con_vuoti(array_provenienza).toString().split('*');
	var impegnativaCur= "";
	for(i=0; i<impegnative.length;i++){
		if (arrIntEst[i].substr(0,1).toUpperCase()!= 'E') continue;
		
		if (arrProvenienza[i]==2872 || arrProvenienza[i]== 4492) continue;
		if (arrTicket[i]!=6 && arrTicket[i]!= 87 && arrTicket[i]!="") continue;
		if (impegnative[i]=="") return false;
		// modifica 31-8-16
		/*		
		if (tipo_ricette[i]=="DEMA") continue;		
		if (impegnativaCur=="") impegnativaCur=impegnative[i];
		else if (impegnativaCur!=impegnative[i]) return false;
		*/
		// ********
	}
	return true;
}



// function per il refresh automatico o pilotato della worlist
function aggiornaDema(){
	parent.parent.hideFrame.apri_attesa_dema();
	document.frmAggiorna.submit();
}
// **************  fine modifica 14-6-16 *******

function associaEsame(valore)
{
	var codice='';
	var sala='';
	
	if (valore){
		if (valore.toString()==""){
			alert(ritornaJsMsg("jsmsg1"));
			return;}
		codice = array_iden_esame[valore];
		sala = array_iden_sal[valore];
	}
	else{
		if (conta_esami_sel()==1){
			codice = array_iden_esame[vettore_indici_sel[0]];
			sala = array_iden_sal[vettore_indici_sel[0]];
		}
	}
	if (codice==""){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	
	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(stringa_codici(array_iden_anag).toString().split("*")[0])){return;}
	/* ******************* */	
	
	document.frmEsame.action = "sceltaEsami?visualizza_metodica=N&cmd_extra=hideMan();&next_servlet=associaEsame&Hiden_sal=" + sala;
	document.frmEsame.Hiden_esame.value = codice;
	document.frmEsame.tipo_registrazione.value = "A";
	
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=600,height=150,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.frmEsame.submit();
}


// function per il refresh automatico o pilotato della worlist
function aggiorna(){
	top.home.apri_attesa();
	document.frmAggiorna.submit();
}

function conta_esami_sel()
//conta numero esami selezionati
{
	return vettore_indici_sel.length;
}

// funzione che controlla esecuzione obbligatoria
// in input arrivano gli iden degli esami splittati da un *
// true: tutto OK		false: problema
function checkEsecuzioneObbligatoria(stringaIdenEsa){
	var strEsaObl = "";
	try{
		if(stringaIdenEsa==""){return;}
		//controllo obbligatorietà
		
		if (baseUser.OB_ESECUZIONE=="S"){
			strEsaObl = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_esa_esecuz_obbl);

			if (strEsaObl.toString().indexOf("S")<0){
				// tutti N 
				return true;
			}
			else{
				// trovato almeno un esame che richiede esecuzione
			}
			// controllo siano stati eseguiti gli esami

			if (foundInStato(stringaIdenEsa,"E") || foundInStato(stringaIdenEsa,"S") || foundInStato(stringaIdenEsa,"e")){
				return true;
			}
			else{
				return false;
			}
		}
	}
	catch(e){
		alert("checkEsecuzioneObbligatoria - Error: "+ e.description);
		return false;
	}
	return true;
}

// funzione che controlla che 
// lo stato dell'esame non sia SOLO
// prenotato 
// true: SOLO prenotato false:non solo prenotato
function checkSoloPrenotato(stringaIdenEsa){
	
	var stringaStato="";
	var vettoreStato;
	
	if(stringaIdenEsa==""){return;}

	stringaStato = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_stato);
	vettoreStato = stringaStato.split("*");
	for (i=0;i<vettoreStato.length;i++){
		if ((vettoreStato[i].replace(carattereStato,"").length==1)&&
			(vettoreStato[i].replace(carattereStato,"")=="P")){
			// trovato
			return true;
		}
	}
	return false;
}

// funzione che controlla se sono
// stati selezionati esami con num.acc. diversi
// true: tutto ok 	false: problemi
function checkEsamiAccettazioneDiverse(stringaIdenEsa){
	var stringaNumPre = "";
	var oldNumPre="";
	var vettoreNumPre;	
//	var bolEsamiStessaAccettazione = false;
	var bolRefertaEsamiAccettazioneDiverse = true;
	var i=0;
	
	// resetto variabile della form che andrà a refertare
	document.frmReferta.HaccDiverse.value = "N";	
	if(stringaIdenEsa==""){return;}
	
	stringaNumPre = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_num_pre);
	vettoreNumPre = stringaNumPre.toString().split("*");	

	// controllo che siano esami stessa accettazione
	for(i=0;i<vettoreNumPre.length;i++){
		if(oldNumPre==""){
			// primo giro
			oldNumPre = vettoreNumPre[i];
		}
		else{
			if (oldNumPre!=vettoreNumPre[i]){
				bolRefertaEsamiAccettazioneDiverse = false;
				break;
			}
		}
	}
	return bolRefertaEsamiAccettazioneDiverse;
}


// funzione che controlla se le metodiche
// degli esami che si vuole refertare
// siano diverse
// true: tutto ok	false: problemi
function checkMetodicheDiverse(stringaIdenEsa){
	var stringaMetodiche = "";
	var oldMetodiche="";
	var vettoreMetodiche;	
//	var bolEsamiStessaAccettazione = false;
	var bolRefertaEsamiMetodicheDiverse = false;
	var i=0;	
	
	
	// resetto variabile della form che andrà a refertare
	document.frmReferta.HmetDiverse.value = "N";
	
	if(stringaIdenEsa==""){return;}
	stringaMetodiche = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_metodica);
	vettoreMetodiche = stringaMetodiche.toString().split("*");	
	// controllo che siano esami stessa accettazione
	for(i=0;i<vettoreMetodiche.length;i++){
		if(oldMetodiche==""){
			// primo giro
			oldMetodiche = vettoreMetodiche[i];
		}
		else{
			if (oldMetodiche!=vettoreMetodiche[i]){
				bolRefertaEsamiMetodicheDiverse = true;
				break;
			}
		}
	}
	
	// controllo per referto strutturato
	if ((strRefertoStrutturato=="S")&&(bolRefertaEsamiMetodicheDiverse)){
		// metodiche differenti e scelto referto strutturato
		return false;
	}
	else{
		// chiedo conferma refertazione
		// metodiche diverse
		if (bolRefertaEsamiMetodicheDiverse){
			// accettazione diverse, segnalo
			if (!confirm(ritornaJsMsg("jsmsgMetDiverse")))
			{
				return false;
			}		
			else{
				document.frmReferta.HmetDiverse.value = "S";
			}
		}
	}
	return true;

}


// funzione che controlla se le date 
// degli esami che si vuole refertare
// siano diverse
// true: tutto ok	false: problemi
function checkDataEsaDiverse(stringaIdenEsa){
	var stringaDataEsa = "";
	var oldDataEsa="";
	var vettoreDataEsa;	
//	var bolEsamiStessaAccettazione = false;
	var bolRefertaEsamiDataEsaDiverse = false;
	var i=0;	
	
	
	// resetto variabile della form che andrà a refertare
	document.frmReferta.HdataEsaDiverse.value = "N";
	
	if(stringaIdenEsa==""){return;}
	stringaDataEsa = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_data_esame);
	vettoreDataEsa = stringaDataEsa.toString().split("*");	
	// controllo che siano esami stessa accettazione
	for(i=0;i<vettoreDataEsa.length;i++){
		if(oldDataEsa==""){
			// primo giro
			oldDataEsa = vettoreDataEsa[i];
		}
		else{
			if (oldDataEsa!=vettoreDataEsa[i]){
				bolRefertaEsamiDataEsaDiverse = true;
				break;
			}
		}
	}
	// chiedo conferma refertazione
	// metodiche diverse
	if (bolRefertaEsamiDataEsaDiverse){
		// accettazione diverse, segnalo
		if (!confirm(ritornaJsMsg("jsmsgDataEsaDiverse")))
		{
			return false;
		}		
		else{
			document.frmReferta.HdataEsaDiverse.value = "S";
		}
	}
	return true;
}

// funzione che controlla gli esami abbiano
// reparti differenti
// true: tutto ok	false: problemi
function checkRepartoDiversi(stringaIdenEsa){
	
	var stringaReparto = "";
	var vettoreReparto;
	var i=0;
	var oldReparto = "";
	
	if(stringaIdenEsa==""){return;}
	stringaReparto = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_reparto);
	vettoreReparto = stringaReparto.toString().split("*");	
	
	for(i=0;i<vettoreReparto.length;i++){
		if (vettoreReparto[i].toString!=""){
			if(oldReparto==""){
				// primo giro
				oldReparto = vettoreReparto[i];
			}
			else{
				if (oldReparto!=vettoreReparto[i]){
					return false;
					break;
				}
			}
		}
	}
	return true;
	
}


// funzione che controlla se gli esami hanno
// referti differenti
// true: tutto ok	false: problemi
function checkRefertiDiversi(stringaIdenEsa){
	var stringaIdenRef = "";
	var oldIdenRef="";
	var vettoreIdenRef;	
	var i=0;	
	
	
	if(stringaIdenEsa==""){return;}
	stringaIdenRef = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_iden_ref);
	vettoreIdenRef = stringaIdenRef.toString().split("*");	
	// controllo che siano esami stessa accettazione
	for(i=0;i<vettoreIdenRef.length;i++){
		// escludo gli elementi che hanno iden_ref="" , =0 opp =-1
		if ((vettoreIdenRef[i].toString!="")&&
			(parseInt(vettoreIdenRef[i])!=0) &&
				(parseInt(vettoreIdenRef[i])!=-1)){
					if(oldIdenRef==""){
						// primo giro
						oldIdenRef = vettoreIdenRef[i];
					}
					else{
						if (oldIdenRef!=vettoreIdenRef[i]){
							return false;
							break;
						}
					}
		}
	}
	return true;
}

// ***************************************************************
// **************** X SPEZAIA ************************************
// ***************************************************************
// funzione che controlla se per gli esami di stringa_iden_esame
// ce ne sia almeno uno di metodica presente in modalityToNotify
// return bolean: true esiste almeno un esame tale metodica    false: nessun esame
function checkModalityForNotify(stringa_iden_esame,modalityToNotify){
	var bolEsito = false;
	var stringaMetodica = "";
	var vettoreMetodica;
	var i =0;
	var j =0;
	try{
		stringaMetodica = ritornaInfoEsame(stringa_iden_esame, array_iden_esame, array_metodica);
		vettoreMetodica = stringaMetodica.split("*");
		// in stringaMetodica ho solo le motodiche degli esami
		for (i=0;i<vettoreMetodica.length;i++){
			if (modalityToNotify.indexOf(vettoreMetodica[i])!=-1){
				// trovato
				bolEsito = true;
				break;
			}
		}
	}
	catch(e){
		alert("checkModalityForNotify - Error: " + e.description);
	}
	return bolEsito;
}
// ***************************************************************

// funzione che ritorna la presenza o meno
// di una lettera dello stato nel campo stato
// true: trovato	false: NON trovato
function foundInStato(stringaIdenEsa, carattereStato){

	var stringaStato = "";
	var vettoreStato;
	var i= 0;
	var listaEsami;
	var statoValue = "";
	
	if (carattereStato==""){return;}
	stringaStato = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_stato);
	vettoreStato = stringaStato.split("*");
	// controllare primi caratteri di stringaStato
	for (i=0;i<vettoreStato.length;i++){
		if (stringaStato.substr(0,4)=="<div"){
			statoValue = $(vettoreStato[i]).html();
		}
		else{
			statoValue = vettoreStato[i];
		}
//		$(stringaStato).html()
		if (statoValue.replace(carattereStato,"").length!=statoValue.length){
			// trovato
		}
		else{
			return false;
		}
	}
	return true;
}


function resetVariableOpenModeConsole(){
	try{
	// reset variabile apertura stato console
		bolOpenConsoleInReadOnlyMode = false;
		document.frmReferta.HopenConsoleInReadOnlyMode.value = "N";
	}
	catch(e){
		alert("resetVariableOpenModeConsole - Error:  "+ e.description);
	}
	// **************************************
}


function cancelBubble(e) {
	var evt = e ? e:window.event;
	if (evt.stopPropagation)    evt.stopPropagation();
	if (evt.cancelBubble!=null) evt.cancelBubble = true;
}

// function per refertare
// modifica 19-8-15
var bolAlreadyCalled = false;
function referta(idenEsaFromWk){
	var stringa_iden_esame="";
	var num_esami_selezionati = 0;
	var iden_ref = "";
	var bolByPassAllCheckForAutoDriving_LOCAL = false;


	// *********************
	// modifica 19-2-16
	// modifica 14-6-16
	// ************ 
	if ((idenEsaFromWk!="undefined")&&(idenEsaFromWk!="")&&(typeof(idenEsaFromWk)!="undefined")){
		var indiceSelezionato = -1;
		for (var z=0;z<array_iden_esame.length;z++){
			if (array_iden_esame[z]==idenEsaFromWk){
				indiceSelezionato = z;
				break;
			}
		}
		vettore_indici_sel =[];
		vettore_indici_sel.push(indiceSelezionato);
	}
	// ************


	// **************
	// modifica 29-1-16
	// modifica 14-6-16
	var listaPrenotati = stringa_codici(array_prenotato).split("*");
	var listaAccettati = stringa_codici(array_accettato).split("*");
	var bolSoloPrenotato = false;
	for (var z=0;z<listaPrenotati.length;z++){
		if ((listaPrenotati[z]=="1")&&(listaAccettati[z]=="0")){
			bolSoloPrenotato = true;
			break;
		}
	}	
	if (bolSoloPrenotato){
		if (!confirm("Attenzione: refertando una prestazione prenotata verrà automaticamente accettata.\nContinuare?")){
			return ;
		}
	}
	// ********


	// modifica 19-8-15
	if (!bolAlreadyCalled)
	{
		bolAlreadyCalled=true;
		// faccio partire timeout
		setTimeout(function(){bolAlreadyCalled=false;},5000);
	}
	else{
		return false;
	}
	// **************
	
	resetVariableOpenModeConsole();
	// ***********
	bolByPassAllCheckForAutoDriving_LOCAL = bolByPassAllCheckForAutoDriving;
	bolByPassAllCheckForAutoDriving = false;
	// ***********
	if ((typeof idenEsaFromWk =="undefined") || (idenEsaFromWk=="")){
		num_esami_selezionati = conta_esami_sel();
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}
		// nel caso ci siano +
		// record selezionati verifico che non siano
		// pazienti differenti
		if (num_esami_selezionati>1){
			// controllo anagrafica diversa
			if (checkPazientiDiversi()==true){
				// ATTENZIONE modificare con label variabile !
				alert(ritornaJsMsg("jsmsgAnagDiv"));
				return;
			}
			//alert("Prego selezionare un solo esame");
			//return;
		}
		stringa_iden_esame = stringa_codici(array_iden_esame);
	}
	else{
		stringa_iden_esame = idenEsaFromWk;
	}
	// ***** nuovo privacy ****
 	if (top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
		//  modifica 7-10-15
		/*
		if (!isReportAllowed()){
			alert(top.PVCY_HANDLER.getErrorMessage("CANNOT_REPORT"));
			return;
		}
		*/
		if (!isPrivacyOK()){
			alert(top.PVCY_HANDLER.getErrorMessage("PVCY_NOT_COMPILED"));
			//alert(msgPrivacyNotCompiled);
			return;
		}
	}

	

	// ***********************
	// x Spezia
	// ************************
	try{
		if (baseGlobal.NFY_ESA_NON_ESEGUITO=="S"){
			bolNotificaEsameNonEseguito = true;
		}
		else{
			bolNotificaEsameNonEseguito = false;
		}
	}
	catch(e){
		// se non esiste il campo 
		// di default lo pongo a true (x Spezia)
		bolNotificaEsameNonEseguito = true;
	}
	try{
		modalityToNotify = baseGlobal.MET_NFY_ESA_NON_ESEGUITO;
	}
	catch(e){
		// di default metto alcune metodiche
		// rx tc rm
		modalityToNotify = "134";		  
	}
	if (bolNotificaEsameNonEseguito){
		// attenzione mettere controllo su tipo metodica
		if (modalityToNotify!=""){
			if (checkModalityForNotify(stringa_iden_esame,modalityToNotify)){
				// sono nel caso in cui almeno uno degli esami è
				// di metodica per la quale è richiesta notifica
				if ((!foundInStato(stringa_iden_esame,"E")) && (!foundInStato(stringa_iden_esame,"e"))){
					// NON trovo ne eseguito inizio nè fine
					if (!confirm("Uno o più esami non sono stati eseguiti. Continuare comunque?")){
						return;
					}
				}
			}
		}
	}
	/* modifica aldo 06-02-15 */
	if (isNaN(idenEsaFromWk)){
		if (!isPatientReadOnlyCheck(stringa_codici(array_iden_anag).toString().split("*")[0])){return;}			  
	}
	else{
		var idenAnagToCheck;
		var idxToCheck = -1;
		try{
			idxToCheck = $.inArray(idenEsaFromWk.toString(),array_iden_esame);
			idenAnagToCheck = array_iden_anag[idxToCheck];
			if (!isNaN(idenAnagToCheck)){ 
				if (!isPatientReadOnlyCheck(idenAnagToCheck.toString())){return;}			  
			}
			else{return;}
		}catch(e){return;}
	}
	/* ******************* */		
	// ***********************	
	// controllo per EMPOLI
	// controllo solo uno dei record scelti
	// perchè appartenenti allo stesso paziente
	if(isLockPage('REFERTA', stringa_iden_esame.toString().split("*")[0], 'ESAMI'))
	{	
		// controllo se è stato refertato
		idenRef = ritornaInfoEsame(stringa_iden_esame,array_iden_esame ,array_iden_ref);
		
		if ((idenRef==-1)||(idenRef==0)){
			// non è refertato
			alert("Attenzione! Impossibile proseguire, paziente di sola lettura! Per renderlo utilizzabile aprire una segnalazione alla assistenza tecnica comunicando le informazioni anagrafiche corrette.");
			return;		
		}	
		// controllo che sia refertato
		if (array_iden_ref==-1){
			// NON è refertato quindi mi blocco...
			return;
		}
		//alert("7");		
		// apro in sola lettura
		bolOpenConsoleInReadOnlyMode = true;
		document.frmReferta.HopenConsoleInReadOnlyMode.value = "S";
		// ***************************** 
		// se è non è già  refertato NON aprire neanche la console
	}	
	// controllo esecuzione obbligatoria
	if (!checkEsecuzioneObbligatoria(stringa_iden_esame)){
		alert(ritornaJsMsg("jsmsg3"));
		return;
	}
	// controllo accettazioni diverse
	if (!checkEsamiAccettazioneDiverse(stringa_iden_esame)){
			// chiedo conferma refertazione
		// accettazioni diverse
		if (!confirm(ritornaJsMsg("jsmsgRefertaAccDiverse")))
		{
			return false;
		}		
		else{
			document.frmReferta.HaccDiverse.value = "S";	
		}
	}
	// controllo metodiche diverse
	if (!checkMetodicheDiverse(stringa_iden_esame)){
		alert(ritornaJsMsg("jsmsgErrMetDiv"));
		return;
	}
	// controllo che esami non abbiamo 
	// iden_ref diverso tra loro
	if (!checkRefertiDiversi(stringa_iden_esame)){
		alert(ritornaJsMsg("jsmsgErrRefertiDiv"));
		return;
	}	
	// controllo che esami non abbiano date esame diverse
	// tra loro
	if (!checkDataEsaDiverse(stringa_iden_esame)){
		alert(ritornaJsMsg("jsmsgErrDataEsaDiv"));
		return;
	}	
	// ************
	// provo a bypassare controllo, x ora
	
	try{
		//var rs = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[stringa_iden_esame],2);
		var rs = top.executeStatement('worklist_main.xml','checkEsameRefertabile',[stringa_iden_esame.toString().split("*")[0]],2);
		if (rs[0] == 'KO') { 
			alert('checkEsameRefertabile' + rs[1]);
			return;
		}
		if (rs[2] == 'KO') { 
			alert(rs[3]);
			return;
		}
	} catch (e) {
		alert("Errore: checkEsameRefertabile");
	}
	// ********************
	// modifica 18-12-15	
	if (!foundInStato(stringa_codici(array_iden_esame),"A")&& (top.home.getConfigParam("SITO")=="SAVONA")){
		var bolAccettaError = true;

		try{
			var strDataOggi =  (new String("")).getTodayStringFormat();
			var strOraOggi = (new Date()).timeNow();
			var rs = top.executeStatement('worklist_main.xml','accettaEsamePrenotato',[strDataOggi,strOraOggi,baseUser.IDEN_PER,stringa_codici(array_iden_esame)],0);
			if (rs[0] == 'KO') { 
				alert('accettaEsamePrenotato ' + rs[1]);
				bolAccettaError = true;
			}
			else if (rs[2] == 'KO') { 
				alert(rs[3]);
				bolAccettaError = true;
			}
			else{
				bolAccettaError = false;
			}
		} catch (e) {
			alert("Errore: accettaEsamePrenotato");
		}		
		if (bolAccettaError){return false;}
	}
	// *********************************************

	callCheckLockEsami(stringa_iden_esame);
}


function checkPazientiDiversi(){
	var i =0;
	var bolEsito = false;
	var iden_primo_paziente = "";
	
	
	//alert("iden_anag ultimo paz sel: " + iden_ultimo_paz_selez)
	//vettore_indici_sel.length CAMBIA DINAMICAMENTE !!
	for (i=0;i<vettore_indici_sel.length;i++)
	{	
		if (i!=0){
			if (array_iden_anag[vettore_indici_sel[i]]!=iden_primo_paziente){
				// paziente diverso
				bolEsito = true;
				break;
			}
		}
		else{
			// inizializzo al primo
			iden_primo_paziente = array_iden_anag[vettore_indici_sel[i]];
		}
	}	
	return bolEsito;
}

//  spezzo la funzione
// per problemi di chiamata
// Ajax
function refertaSubmit(codici){
	var rs ;
	var propJSONEsame = "";
	var myLista = new Array();
	var jsonObj;
	var x;
	try{
		if(baseGlobal.GESTIONE_FINE_ESECUZIONE=='S')
		{
			var stringa_fine_esecuzio=stringa_codici(array_fine_esecuzione);
			if (stringa_fine_esecuzio==""){
				stringa_fine_esecuzio = ritornaInfoEsame(codici, array_iden_esame, array_fine_esecuzione);
			}
			var stringa_ese_obbl=stringa_codici(array_esa_esecuz_obbl);
			if (stringa_ese_obbl==""){
				stringa_ese_obbl = ritornaInfoEsame(codici, array_iden_esame, array_esa_esecuz_obbl);
			}			
//			alert(stringa_fine_esecuzio);
	//		alert(stringa_fine_esecuzio.indexOf('0'));
			if(stringa_fine_esecuzio.indexOf('0')>=0 && stringa_ese_obbl.indexOf('S')>=0 )
			{
				document.frmReferta.HopenConsoleInReadOnlyMode.value = "S";
			}

		}
 		var proprieta_sel = stringa_codici(array_contextmenu);
		if (proprieta_sel==""){
			proprieta_sel = ritornaInfoEsame(codici, array_iden_esame, array_contextmenu);
		}
 		myLista = proprieta_sel.split("*");
 		//alert(proprieta_sel);
 		for (var k=0;k<myLista.length;k++){
 			x = eval('(' + myLista[k] + ')');
 			if (x["REFERTABILE"]=="N"){
 				alert("Impossibile proseguire: selezionato almeno un esame non refertabile.");
				return;
 			}
 		}
		// modifica 14-6-16
		//if(!controllo_erogabile()) return;
		if (top.home.getConfigParam("SITO")=="SAVONA"){
			var intEst = stringa_codici(array_int_est).toString().split('*');
			var i;
			
			for(i=0; i<intEst.length; i++)
			{
				if(intEst[i].substr(0,1).toUpperCase() == 'E' && !stessaImpegnativaPresente())
				{
					scaricoRicettaDaEsami(stringa_iden_esame,"R");
					return;
				}
			}
		}
		// ***************		
		// **********************************
		// ambulatorio
		// do x scontato che l'esame è
		// sempre uno solo!
 		/*
		myLista.push(stringa_codici(array_iden_esa));
		try{rs = top.executeQuery('infoWorklist.xml','getProprietaEPrestazione',myLista);}catch(e){alert("Errore: getProprietaEPrestazione");}
		if (rs.next()){
			propJSONEsame = rs.getString("PROPRIETA");
			if (propJSONEsame!=""){
				jsonObj = JSON.parse(propJSONEsame);
				if(jsonObj.REFERTABILE=="N"){
					alert("Impossibile proseguire: l'esame non è refertabile.");
					return;
				}
			}
		}*/
		// **********************************
		var finestra = window.open("","wndConsolle","top=0,left=0,width=800,height=600,status=yes");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open("","wndConsolle","top=0,left=0,width=800,height=600,status=yes");
		}
		hndConsolleRefertazione = finestra;
		if (codici!=""){
			document.frmReferta.idenEsame.value = codici;
			top.home.apri_attesa();
			// scarico il frame di sotto
			// per non aver + sessioni di msg aperta
			if (bolInfoEsameAperto){
				apriChiudiInfoReferto();
			}
			// setto variabile per referto strutturato e la resetto
			try{document.frmReferta.refertoStrutturato.value = strRefertoStrutturato;strRefertoStrutturato="N";}catch (e){}
			// ***
			// **************************************************
			// modifica per refertare + esami
			// document.frmReferta.HrimappaIdenEsame.value = "S";
			// **************************************************
			
			document.frmReferta.submit();
		}
	}
	catch(e){
		alert("refertaSubmit - Error: " + e.description);
	}
}

// funzione che controlla 
function definitivo(){
	var stringa_iden_esame="";
	var idenRef = "";
	if (conta_esami_sel()==0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	
	stringa_iden_esame = stringa_codici(array_iden_esame);
	// verifico che non si possa selezionare + di
	// un esame per volta
	if (conta_esami_sel()!=1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}	
	// controllo se è stato refertato
	idenRef = ritornaInfoEsame(stringa_iden_esame,array_iden_esame ,array_iden_ref);
	if ((idenRef==-1)||(idenRef==0)){
		// non è refertato
		alert(ritornaJsMsg("jsmsgNonRefertato"));
		return;		
	}
	// ****
	document.frmDefinitivo.idenEsame.value = stringa_iden_esame;
	var finestra = window.open("","wndDefinitivo","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndDefinitivo","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}	
	document.frmDefinitivo.submit();
}

// funzione per autodeselzione di paziente selezionato diverso dal precedente
function auto_deselezione_paz_div(indice_ultimo_paz){
	var iden_ultimo_paz_selez= "";
	var i =0;
	iden_ultimo_paz_selez = array_iden_anag[indice_ultimo_paz];
	//alert("iden_anag ultimo paz sel: " + iden_ultimo_paz_selez)
	//vettore_indici_sel.length CAMBIA DINAMICAMENTE !!
	for (i=0;i<vettore_indici_sel.length;i++)
	{	
	/*	alert("i: " + i + "indici selezionati nel vettore :" + vettore_indici_sel.length)
		alert("indice nel vettore indici:" + vettore_indici_sel[i])
		alert("iden_anag i-esimo selezionato:"+  array_iden_anag[vettore_indici_sel[i]])
		*/
		if (array_iden_anag[vettore_indici_sel[i]]!=iden_ultimo_paz_selez){
			// deillumino
			removeClass(document.all.oTable.rows(vettore_indici_sel[i]), "sel");
			removeClass(document.all.oTable.rows(vettore_indici_sel[i]), "col_over");
			rimuovi_indice(vettore_indici_sel[i]);
			// torno indietro di uno per non perdermi gli altri elementi
			if (vettore_indici_sel.length>1){
				i = i -1;
			}
		}
	}
}
        
// questa funzione ritorna un boolean
// se non viene soddisfatta la seguente condizione
// viene passato in ingresso:
//
// ArrayPerControllo: array sul quale fare i confronti
// valoreRiferimento: valore di confronto
//
// Esempio:nel caso volessi refertare due esami 
// devo controllare se hanno num.accett.diverso
// quindi, automaticamente in base agli esami evidenziati, passerò
// alla funzione come array quello dei num.accettazione e come
// valore di riferimento il primo num.accettazione che fungerà
// da valore di confronto. Se ALMENO UNO dei codici,presenti nell'array,
// relativi agli esami selezionati è diverso dal valoreRiferimento
// verrà restituito TRUE, se sono tutti uguali FALSE
function checkCodiciDiversi(ArrayPerControllo, valoreRiferimento){
	try{
		for (i=0;i<vettore_indici_sel.length;i++)
		{	
			if(ArrayPerControllo[vettore_indici_sel[i]]!=valoreRiferimento){
				return true;
			}
		}
	}
	catch(e){
		alert("checkCodiciDiversi Error: " + e.description);
	}
	return false;
}



function keyHandler (evt) { 

	var easterEgg;
	var keyCode = window.event ? event.keyCode : 
				 evt.which ? evt.which : 
				 evt.keyCode ? evt.keyCode : evt.charCode; 
	if (keyCode==80){
		easterEgg = window.open("","wndEaster","top=0,left=0,width=1024,height=760");
		easterEgg.document.write("<html><body oncontextmenu='javascript:return false;' background='imagexPix/wallpaper/easter_egg.jpg'></body></html>");
	}
	
	return true; // return false to cancel key 
} 

function initGlobalObject(){
	try{
		window.onunload = function scaricaFrameset(){scaricaWorklist();};
		initbaseGlobal();
		initbaseUser();
		initbasePC();
		
		// ***************************
		// *** azzero variabile per problema prenotazione
		top.prenotaDaConsulta = "";
		// ***************************
		
		
		// chiudo eventuale finestra di attesa aperta	
		top.home.chiudi_attesa();
		// controllo limitazione numero record
		controlloLimiteRecord();
		// richiamo in ogni caso
		// il menu floating
		// gestendo l'errore nel caso in cui non 
		// fosse richiesto
		addAlternateColor();
		try{
			JSFX_FloatTopDiv();
	
		}
		catch(e){
			// nessun menu floating
			
		}
		// gestore eventi
		try{
			if (document.layers) { 
			   document.captureEvents(Event.KEYPRESS); 
			} 	
			document.onkeypress = keyHandler;
		}
		catch(e){}
		// carico info esame / referto
		caricaInfoEsame();
		// ridimensionamento tabheader
//		resizeTabHeader();
//		startResizeTabHeaderOnTheFly();
		// collassa le righe
		//collapseAllRows();
		try{
			if ((baseUser.WORKLIST_REFRESH!="")&&(baseUser.WORKLIST_REFRESH!="0")){
				attivaRefreshAutomaticoWorklist();
			}
		}
		catch(e){
			
		}
		// inizializzo 
		try{
			initProcedureCreateLayerChangeStatus();
		}
		catch(e){
			alert("Call initProcedureCreateLayerSortingColumns -" + e.description);
			alert("Error: can't load layer for shifting wk columns");
		}		
		
		try{
			// Pacs Web
			initPacsWebObject();	
		}
		catch(e){
	//		alert("Error loading PacsWeb objects - " + e.description)
		}		
		// ****** init per resizing colonne
		try{
			connectDragDropToObjectById();
			// definisco la funzione di callback
			// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
			setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
		}
		catch(e){
			
		}
		// *********************************
		
		
		fillLabels(arrayLabelName,arrayLabelValue);	
		if (getTabulatorToLoadOnStartUp()!=""){
			// DEVO rimappare 
			// il tabulatore di default dell'utente
			// oppure vedere se accetta in input 
			// il nome del tabulatore da caricare
			apriChiudiInfoReferto();
		}
		// codice per tracciare posizione dell'utente
		try{
			resetTraceUserObject();		
			objTraceUserAction.userAction[0].action = tipoWorklist;
			callTraceUserAction();		
		}
		catch(e){
			alert("initGlobalObject.InitTraceUserAction " + e.description);
		}
		// valuto eventuale evento da gestire
		try{
			evalDrivePcEvent();
		}
		catch(e){
			alert("worklist.evalDrivePcEvent - " + e.description);
		}
		// ambulatorio
		creaPrototypeArray();
		
		// **************************
		// completamento diagnosi
		try{
			// setto cosa fare dopo caricamento
			// worklist nuova
			jQuery('#oTable').callJSAfterInitWorklist("buildIconeAggiuntive();toDoAfterWkBuild();");
		}catch(e){
			//alert(e.description);
		}
		// **************************
		
		// inizializzo menuMatic solo se c'è il livello che lo contiene
		if (document.getElementById('nav')){
			
			/*try{
				window.addEvent('domready', function() {	
					try{var myMenuMatic = new MenuMatic();}catch(e){}
			});	
			}
			catch(e){
							}*/
			jQuery('div#menuDDcontainer ul#nav li').click(
			function(ev)
			{
				var idx = jQuery('div#menuScrollPD').attr('idx');
				idx = (typeof idx == 'undefined' ? -1:parseInt(idx));
				jQuery('div#menuScrollPD').fadeOut(250);
				jQuery('div#menuScrollPD').remove();
				if(idx != jQuery(this).index())
				{
					var div = document.createElement('div');
					var l   = 0;
					var t   = 22;
					jQuery(div).hover(function(){}, function()
					{
						jQuery('div#menuScrollPD').fadeOut(250);
						jQuery('div#menuScrollPD').remove();
					});
					jQuery(div).hide();
					jQuery(div).attr('id', 'menuScrollPD');
					jQuery(div).attr('idx', jQuery(this).index());
					jQuery(div).html('<ul>' + jQuery(this).find('ul').html() + '</ul>');
					jQuery('li', div).hover(function(){jQuery(this).addClass('clsOverMenu')}, function(){jQuery(this).removeClass('clsOverMenu')});
					jQuery('div#idLayerWorklist').prepend(div);
					l = jQuery('div#menuDDcontainer').position().left + (jQuery(this).index() * jQuery('div#menuDDcontainer ul#nav li').first().width());
					if((l + 200) > jQuery('body').width()){
						l = jQuery('body').width() - jQuery(div).width();
					}
					/*			
					if(jQuery('div.clsWorklist').size() > 0)

					else
						jQuery(div).css({'left': (jQuery('div#menuDDcontainer').position().left + (jQuery(this).index() * jQuery('div#menuDDcontainer ul#nav li').first().width()))});
					*/
					jQuery(div).css({'left': l, 'top':t});
					jQuery(div).fadeIn(400);
					return false;
				}
			});	
		}

	}
	catch(e){
		alert("iniGlobalObjectError - Error: " + e.description);
	}
	finally{
		
	}
}


/*
replyGetAeTitleWhereStored = function (returnValue){
	alert(returnValue);
}*/

// funzione
// che in base allo spazio
// visibile del frame ridimensiona
// "al volo" i tabheader affinchè
// si riescano a vedere 
function resizeTabHeader(){
	var containerPulsanti = CSSRule('TABLE.classTabHeader TD.classButtonHeaderContainer');
	var middleHeader = CSSRule('TABLE.classTabHeader TD.classTabHeaderMiddle');
	var headerTable = CSSRule('TABLE.classTabHeader');
	var larghezzaMenuVerticale = top.document.all.oFrameset.cols.split(",");
	var dimensioneMainFrame = screen.availWidth - parseInt(larghezzaMenuVerticale) - 20;
	dimensioneMainFrame = dimensioneMainFrame + document.body.scrollLeft;
	headerTable.style.width = dimensioneMainFrame + "px";
}


// funzione che lavora sui CSS e restituisce 
// dei CSSRule
function CSSRule(selText) { 
        for(i = 0; i < document.styleSheets.length;i++) { 
                var st = document.styleSheets(i); 
                for (ir = 0; ir < st.rules.length; ir++) { 
								//alert("ir: "+st.rules(ir).selectorText);				
                        if (st.rules(ir).selectorText == selText) { 
                                return st.rules(ir); 
                        } 
                } 
        } 
} 

// carica info esame /referti
// nel frame sottostante
function caricaInfoEsame(){
	var bolEsisteFrame = false;
	var codiceAnag = "";
	var codiceEsame = "";
	var sringaToLoad ="";
	var oggettoFrame;
	var idDefaultTabulator="";
	var bolWk_da_ricPaz = false;
	// controllo se frame è aperto
	// contrariamente non carico nulla
	if (!bolInfoEsameAperto){
		return;
	}


	try{
		var strDimensioni = parent.document.all.oFramesetWorklist.rows;
	}
	catch(e){
		var strDimensioni = parent.document.all.oFramesetRicercaPaziente.rows;
		bolWk_da_ricPaz = true;
	}
	// verifico se esiste un frame
	try{
		if (parent.worklistInfoEsame){
			bolEsisteFrame = true;
		}
		else{
			bolEsisteFrame = false;
		} 
	}
	catch(e){
		bolEsisteFrame=false;
	}
	// ****
	// 'idRicPazWorklistFrame' name='RicPazWorklistFrame'
	// ambulatorio
		//alert(parent.frames.length + " " + bolEsisteFrame);
		//bolEsisteFrame = true;
	try{
		//if (bolEsisteFrame){
			// ****
			codiceAnag = stringa_codici(array_iden_anag);
			codiceEsame = stringa_codici(array_iden_esame);
//			if ((codiceAnag =="")||(codiceEsame=="")){return;}
			// carico info necessarie
			document.frmTabulator.idenEsame.value = codiceEsame;
			document.frmTabulator.idenAnag.value = codiceAnag;
			// verifico se devo caricare un tabulatore in particolare
			// lo resetto cmq
			idDefaultTabulator = getTabulatorToLoadOnStartUp();
			if (idDefaultTabulator!=""){
				document.frmTabulator.idTabulator.value = idDefaultTabulator;
				// resetto il vecchio valore
				parent.parent.barFrame.resetStartInitTabulator();		
			}
			// ************** mappare l'eventuale groupTabulator corretto
			document.frmTabulator.idGroupTabulator.value = "idTabInfoRefertoInWorklist";
			// *********************
//					alert(bolWk_da_ricPaz + " " + document.frmTabulator.target);
//			document.frmTabulator.target = parent.document.all.oFramesetRicercaPaziente.document.getElementById('idworklistInfoEsame').name;
			if (bolWk_da_ricPaz)	{
				document.frmTabulator.target = "RicPazUtilityFrame";
			}

			document.frmTabulator.submit();
		//}
	}
	catch(e){
		alert("caricaInfoEsame - Error: " + e.description);
	}

}



// funzione che crea un campo hidden
// alla form di aggiornamento
// ATTENZIONE verificare perchè NON funziona
function addHiddenFormAggiorna(nomeHidden, valoreHidden){
	var objInput = creaElemento("INPUT");
	if ((nomeHidden=="")||(valoreHidden=="")){return;}
	objInput.setAttribute("type", "hidden");
	objInput.setAttribute("value",valoreHidden);
	objInput.setAttribute("name",nomeHidden);
	if (objInput){
		document.getElementsByTagName("frmAggiorna")[0].appendChild(objInput);
	}
}

// funzione che controlla
// l'esistenza di un campo nel document
// ricercandolo tramite il TagName
function esisteCampo(nomeOggetto){
	var oggetto;
	if (document.getElementsByTagName(nomeOggetto)[0]){
		return true;
	}
	else{
		return false;
	}
}



//****************************************************
//*********** Integrazione PACS **********************
//****************************************************
//funzione che fai i 
//primi controlli per sincronizzare le
//immagini con il pacs
//@param pacsType: individua il tipo di pacs con una costante 
//@param additionalParameters: indica eventuali parametri opzionali
function syncToPacs(pacsType,additionalParameters)
{
	var stringa_iden_esame="";
	var strAccession_number = "";
	var strAETITLE = "";
	var strReparto = "";
	var strPatId = "";
	var oldAEtitle;
	
	try{
		//alert("qui: "  + pacsType +"@");
		if(pacsType==""){return;}
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}
		// controllo AETITLE diversi
		// ********************************
		oldAEtitle = array_aetitle[vettore_indici_sel[0]];
		var AEdiversi = 0;
		for (i=0;i<vettore_indici_sel.length;i++)
		{
			if (oldAEtitle != array_aetitle[vettore_indici_sel[i]])
			{
				// errore
				AEdiversi = 1;
				break;
			}
		}
		if (AEdiversi==1)
		{
			alert(ritornaJsMsg("jsmsgAetitleNotValid"));
			return;
		}
		// ****************************
		strAccession_number = stringa_codici(array_id_esame_dicom);
		strAETITLE = stringa_codici(array_aetitle);
		strReparto = stringa_codici(array_reparto);
		strPatId = stringa_codici(array_id_paz_dicom);
		if ((strAccession_number==""))
		{
			alert(ritornaJsMsg("jsmsgAccNumNotValid"));
			return;
		}
		// devo riempire struttura
		// dello studio
		top.hideFrame.basePacsStudy.ACCNUM = strAccession_number;
		top.hideFrame.basePacsStudy.AETITLE = strAETITLE;
		top.hideFrame.basePacsStudy.REPARTO = strReparto;
		top.hideFrame.basePacsStudy.PATID = strPatId;
		// *****
		//alert(pacsType);
		// inutile x quello web
		//top.hideFrame.sendToPacs("CLOSE_CURR_SESSION",pacsType,additionalParameters);
		top.hideFrame.sendToPacs("SHOWSTUDY", pacsType, "fromConsole=false");
	}
	catch(e){
		alert("syncToPacs - Error: "+ e.description);
	}
}


function closeExamOnPacs(){
		parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION","jsMEDIPRIME","");
}


/**
* funzione che controlla se è stato
* superato il limite di record
* visualizzabili per la wk corrente
*/

function controlloLimiteRecord(){
	var intLimiteRecord;
	
	try{
		if (numeroLimiteRecordWk==""){
			return;
		}
		else {
			intLimiteRecordWk = parseInt(numeroLimiteRecordWk);
			// conto numero righe
			if (array_id_esame_dicom.length >intLimiteRecordWk){
				alert(ritornaJsMsg("jsmsg_limiterecord") + " " + (parseInt(numeroLimiteRecordWk)));
			}
		}
	}
	catch(e){
		
	}
	
	
}

// funzione
// chiamata sull'ordinamento
// per colonna
function loadWaitWindow(){
	top.home.apri_attesa();
}


// **************************
// ******** AJAX ************
// **************************

function callCheckLockEsami(valore){

	var parametro = "";
	
	// mi baso sul primo esame
	// selezionato
	functionToCallAfterCheckLock = "refertaSubmit('"+valore+"')"	;
	//esiste referto controllo
	parametro = valore;	
	try{
		// prevista gestione iden multipli splittati *
		ajaxLockManage.checkLockRecordReferto(parametro,callbackCheckLock);
	}
	catch(e){
		alert("callCheckLockEsami - " + e.description);
	}
}

// funzione di callback
function callbackCheckLock(errore){
	
	//errore così codificato
	// LOCK*iden_per*tipo*descr errore
	
	var funzione = "";
	var bolContinua = false;
	var listaInfoErrore;
	
	
	funzione = functionToCallAfterCheckLock;
	if (errore!=""){
		listaInfoErrore = errore.split("*");
		// record lockato
		if (listaInfoErrore[0].toString()=="LOCK"){
			//alert(errore);
			// visualizzo chi lo locka
			if (baseGlobal.LOCKCHECKBEFOREREPORTING=="N"){
				// lagosanto
				// avviso che qualcun altro ha aperta o lo scheda esame o il referto
				// chiedo conferma per continuare
				if (confirm(ritornaJsMsg("jsmsgLock") + " " + listaInfoErrore[3].toString() + "\n Continuare?")){
					if(listaInfoErrore[2].toString()!="M"){
						// è aperto da un NON medico
						// apro in scrittura
						bolOpenConsoleInReadOnlyMode = false;
						document.frmReferta.HopenConsoleInReadOnlyMode.value = "N";
						// apro la consolle in scrittura!!
						bolContinua = true;						
					}
					else{
						// è aperto da un medico 
						// quindi apro in sola lettura
						bolOpenConsoleInReadOnlyMode = true;
						document.frmReferta.HopenConsoleInReadOnlyMode.value = "S";
						bolContinua = true;						
					}
					
				}
				else{
					// NON continua
					return;
				}

			}	
			else{
				// vecchia situazione
				// ************************************
				// modifica
				if (listaInfoErrore[1]==baseUser.IDEN_PER && listaInfoErrore[3].split(" - ")[0] == basePC.IP ){
					// *************
					// tutto ok
					myLista = new Array();
					myLista.push(listaInfoErrore[1]);		
					var stm = top.executeStatement('worklist_main.xml','cancellaLockPerUtente',myLista,0);
					if (stm[0]!="OK"){
						alert("Errore: problemi nella cancellazione del lock. Prego aggiornare la worklist.");
						bolContinua = false;
					}
					else{
						// *************
						bolContinua = true;
					}
				}
				else{
					// ************************************
					if (confirm(ritornaJsMsg("jsmsgLock") + " " + listaInfoErrore[3].toString() + "\n" + ritornaJsMsg("jsmsgOpenReadMode"))){
						bolOpenConsoleInReadOnlyMode = true;
						document.frmReferta.HopenConsoleInReadOnlyMode.value = "S";
						bolContinua = true;
					}
					else{
						return;
					}
				}
			}
		}
		else{
			alert(errore);
			bolContinua = false;
		}
	}	
	else{
		// NON ci sono lock
		bolContinua = true;
	}
	if (bolContinua){
		if (funzione!=""){
			functionToCallAfterCheckLock  = "";	
			eval(funzione);
		}
	}
}


// ****************
// ****************
// mostra il layer dello stato
function showLayerStato(){
	showLayerSetPos('idLayLegStato');
}


// **************************

// funzione che apre o chiude 
// le info dell'esame
function apriChiudiInfoReferto(){
	
	var vettoreDimensioni;
	var strDimensioni = "";
	var bolWk_da_ricPaz = false;

/*	if (conta_esami_sel()==0){
		return;
	}*/
	try{
		try{
			strDimensioni = parent.document.all.oFramesetWorklist.rows;
		}
		catch(e){
			strDimensioni = parent.document.all.oFramesetRicercaPaziente.rows;
			bolWk_da_ricPaz = true;
		}
	
		vettoreDimensioni = strDimensioni.split(",");
		if (bolInfoEsameAperto){
			// scarico quello che era aperto
			// mi serve per non aver + di una sessione di 
			// messaggistica eventualmente aperta
			if (!bolWk_da_ricPaz){			
				parent.worklistInfoEsame.document.location.replace ("blank.htm");
				// frame aperto 
				// quindi lo chiudo
				parent.document.all.oFramesetWorklist.rows = vettoreDimensioni[0] +","+ dimFramesetSenzaInfoEsame;
			}
			else{
				parent.document.all.oFramesetRicercaPaziente.rows = vettoreDimensioni[0] +",*,0";
			}
			bolInfoEsameAperto = false;
		}
		else{
			// frame chiuso
			// quindi lo apro
			try{
				if (!bolWk_da_ricPaz){
					var altezza = parseInt(screen.availHeight - parseInt(vettoreDimensioni[0]));
					altezza = parseInt((altezza - 20)/2);
					dimFramesetConInfoEsame = "0,*," + altezza;
					parent.document.all.oFramesetWorklist.rows = vettoreDimensioni[0] +","+  dimFramesetConInfoEsame;		
				}
				else{
					if (vettoreDimensioni[0].toString()==""){
						parent.document.all.oFramesetRicercaPaziente.rows = "85,*,400,0";						
					}
					else{
						parent.document.all.oFramesetRicercaPaziente.rows = vettoreDimensioni[0] +",*,400,0";
					}
				}
			}
			catch(e){
				alert(e.description);
				//parent.document.all.oFramesetRicercaPaziente.rows = vettoreDimensioni[0] +",*,200";
			}
			bolInfoEsameAperto = true;
			caricaInfoEsame();
		}
	}
	catch(e){
		alert("apriChiudiInfoReferto - Error: " + e.description); 
	}
}

// funzione
// che scarica tutti gli oggetti
function scaricaWorklist(){
	try{
		clearTimeout(timer_resize_tab_header);
	}
	catch(e){
		alert("clearTimeout - " + e.description);
	}
	// elimino timer refresh worklist
	try{
		if ((baseUser.WORKLIST_REFRESH!="")&&(baseUser.WORKLIST_REFRESH!="0")){
			// provo a cancellare il timer
			// se esiste
			clearTimeout(timerRefreshAutomaticoWorklist);
		}
	}
	catch(e){
		alert("worklist.worklist_refresh -  " + e.description);
	}
	try{
		resetTraceUserObject();
		objTraceUserAction.userAction[0].action = "UNLOAD_" + tipoWorklist;
		callTraceUserAction();				
	}
	catch(e){
		alert("error tracing user action -  " + e.description);
	}
	try{
		svuotaFrameInfoEsame();
	}
	catch(e){
		alert("worklist.svuotaFrameInfoEsame - " + e.description);
	}
}

// carica
// nel frame che contiene le info esame
// la pagina vuota
function svuotaFrameInfoEsame(){
	
	var vettoreDimensioni;
	var strDimensioni = "";
	
	try{
		strDimensioni = parent.document.all.oFramesetWorklist.rows;
		vettoreDimensioni = strDimensioni.split(",");
		parent.document.all.oFramesetWorklist.rows = vettoreDimensioni[0] +","+ dimFramesetSenzaInfoEsame;
		bolInfoEsameAperto = false;		
		parent.worklistInfoEsame.document.location.replace ("blank");
		// dealloco oggetto 
		ajaxLockManage = null;		
	}
	catch(e){
		
	}
}

// **********
// funzione per il ridimensionamento al volo
// del tabheader

function startResizeTabHeaderOnTheFly(){
	timer_resize_tab_header = setInterval('resizeTabHeader()', timeout_resize_tab_header);	
}






// funzione che seleziona 
// , nel caso di selezione multipla,
// SOLO il primo della lista
// affinchè si possa scorrere la lista con
// i pulsanti di "spostamento selezione su"
// e spostamento selezione giù
function selectOnlyFirstIndexed(){
	if (vettore_indici_sel.length==1){
		return;
	}
	// ciclo
	// sulla lista di indici escludendo il primo indicizzato
	// richiamando la funzione illumina verrà automaticamente
	// deselezionato ed eliminato dalla lista (parto quindi dal fondo e vado a ritroso
	//alert(vettore_indici_sel.length);
	for (i=vettore_indici_sel.length-1;i>0;i--){
		illumina_multiplo(vettore_indici_sel[i]);
	}
}


// funzione che sposta la selezione 
// in su o in giù di offset posizioni
function moveSelectionUpDown(offset){
	
	var i = 0;
	var indiceSelezionatoOld;
	var nRigheTab = 0;
	var newIndexToSelect;
	
	if (isNaN(offset)){
		return;
	}
	// controllo se esiste almeno una selezione
	if (vettore_indici_sel.length!=0){
		// limito, in ogni caso,
		// la selezione al primo indicizzato
		selectOnlyFirstIndexed();
		// sposto selezione di offset pozizioni
		// stando attento ai bound della tabella
		indiceSelezionatoOld = vettore_indici_sel[0];
		// calcolo numero righe tabella
		try{
			nRigheTab = document.getElementById("oTable").rows.length;
		}

		catch(e){
			alert("moveSelectionUpDown.Getting Table - " + e.description);
			return;
		}
		newIndexToSelect = parseInt(indiceSelezionatoOld + parseInt(offset));
		// controllo limiti
		if (newIndexToSelect<0){
			return;
		}
		if (newIndexToSelect>=nRigheTab){
			// sfora l'indice massimo
			return;
		}
		// rimuove indice e deseleziona
		illumina_multiplo(indiceSelezionatoOld);
		// ATTENZIONE non è del tutto corretto
		// il fatto che richiami arbitrariamente una funzione
		// anzichè un'altra: dovrei estrapolare la chiamata
		// fatta sull'evento onclick della riga 
		// e richiamare quella.
		
		illumina_multiplo(newIndexToSelect);
		caricaInfoEsame();
	}
	else{
		// nessuna selezione
		return;
	}
}


// funzione che gestisce le info
// riguardanti il TarMed
function openTarMed(){
	
	var codice='';

	if (conta_esami_sel()!=1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}			
	codice = array_num_pre[vettore_indici_sel[0]];
	manageTarMedOfExam(codice);
}

// funzione che apre il dettaglio della
// richiesta
function visualizza_richiesta(idRichiesta, idAnag){
	var iden_richiesta='';	
	var iden_anag = "";
	
	try{
		if ((idRichiesta=="")||(idAnag=="")){return;}

		var url_send = 'SL_VisualizzaRichiesta?readonly=true&iden=' + idRichiesta + '&iden_anag=' + idAnag;
		var finestra = window.open(url_send,"winVisRich","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open(url_send,"winVisRich","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}
	}
	catch(e){
		alert("visualizza_richiesta - " + e.description);
	}
}


function openExamFromGericosBooking(oggetto)
{
	try
	{
		//modEsame(oggetto.parentElement.parentElement.parentElement.parentElement.sectionRowIndex);
		modEsame(document.all.oTable.parentElement.parentElement.parentElement.sectionRowIndex);
	}
	catch(e)
	{
		alert("openExamFromGericosBooking - " + e.description);
	}
}

// funzione che controlla
// variabile presente nel frame barFrame
// che indica se e quale tabulatore caricare
// allo startup
function getTabulatorToLoadOnStartUp(){
	var strOutput = "";
	try{
		strOutput = parent.parent.barFrame.getStartInitTabulator();
	}
	catch(e){
		
	}
	return strOutput;
}



// mostra referto multimediale
function showMMreport(){
	
	var idenRef = "";
	try{
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}				
		idenRef = stringa_codici(array_iden_ref);
		//alert("idenRef: "+ idenRef);
		if ((idenRef==-1)||(idenRef==0)||(idenRef=="")){
			// non è refertato
			alert(ritornaJsMsg("jsmsgNonRefertato"));
			return;		
		}	
		var handleViewer = window.open("viewerkeyimages?iden_ref=" + idenRef ,"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
		if (handleViewer){
			handleViewer.focus();
		}
		else{
			handleViewer = window.open("viewerkeyimages?iden_ref=" + idenRef,"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");		
		}		
	}
	catch(e){
		alert("showMMreport - Error: " + e.description);
	}
}


function stampaIstruzioni()
{
	var sql = "";
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	var iden_esame = stringa_codici(array_iden_esame);
	var reparto = stringa_codici(array_reparto);
	
	var finestra = window.open('elabStampa?stampaFunzioneStampa=ISTRUZIONI_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S',"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open('elabStampa?stampaFunzioneStampa=ISTRUZIONI_STD&stampaIdenEsame=' + iden_esame + '&stampaReparto=' + reparto + '&stampaAnteprima=S',"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
	}
	
	try{
		if ((iden_esame!="")&&(iden_esame!="undefined")){
			sql = "update esami set stampato_cons_refonline='S' where iden = " + iden_esame;
			callQueryCommand(sql);
		}
	}
	catch(e){
		alert("Impossibile aggiornare stato stampa consenso - " + e.description);
	}
}


// *******************************************************
// *******************************************************
// ******** aggiunto per problema su commit **************
// *******************************************************
// *******************************************************
function forceCommitToDb(){
	var sql = "";
	
	try{
		sql = "begin SP_EXTRA_ESAMI('','','',''); end;";
		callQueryCommand(sql);
	}
	catch(e){
		alert("forceCommitToDb - Error: " + e.description);
	}
}

// esegue query di comando
function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		dwr.engine.setAsync(false);
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand);
	//	window.setTimeout(ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand),1000);		
		dwr.engine.setAsync(true);			
	}
	catch(e){
		alert("callQueryCommand - " + e.description);
	}	
}

var replyQueryCommand = function (returnValue){
	
	var feedback;
	var tmp ="";
	feedback = returnValue.split("*");
	
	try{
		if (feedback[0].toString().toUpperCase()!="OK"){
			// azzero funzione di callback 
			// da chiamare per interrompere la catena in caso di errore
			functionCallBack = "";
			alert("Error: " + feedback[1]);
		}
		else{
//			alert("tutto ok");
		}
	}
	catch(e){
		alert("replyQueryCommand - Error: " + e.description);
	}
	finally{
		functionCallBack ="";
	}
	
};

// *******************************************************
// *******************************************************


function rinvio_tarmed()
{
	var param     = '';
	var id_esa    = '';
	var firma     = '';
	var chkfirma  = true;
	var achkfirma;
	var i;
	
	if(conta_esami_sel() == 0)
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		id_esa = stringa_codici(array_iden_esame);
		firma = stringa_codici(array_firmato);
		achkfirma = firma.split("*");
		
		for(i = 0; i < achkfirma.length && chkfirma; chkfirma = (achkfirma[i++] == 'S')){}
		
		if(!chkfirma)
		{
			alert('Selezionare solo firmati!');
		}
		else
		{
			param = 'sp_InviaEsamiTarmed@';
			param += 'IString@';
			param += id_esa;
			
			functionDwr.launch_sp(param, chk_rinvio_tarmed);
		}
	}
}

function chk_rinvio_tarmed(ret)
{
	var aRet;
	
	if(ret != null && ret != '')
	{
		ret += '****';
		aRet = ret.split('*');
		if(aRet[0] == 'ERROR'){
			alert(aRet[1]);
		}
	}
}


function openSupportRequestWk(value){
	try{
		top.leftFrame.apri("console_admin");
	}
	catch(e){
		alert("openSupporRequestWk - Error: " + e.description);
	}
}

function riprenota_esame_wk()
{
	var id = array_iden_esame[vettore_indici_sel[0]];
	var met = array_metodica[vettore_indici_sel[0]];
	var url_send;
	
	if(id == '' || id == '-1')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{	
		// ************* controllo readonly
		try{
			var idenAnagPren = array_iden_anag[vettore_indici_sel[0]];
			/* modifica aldo 12-14 */
			if (!isPatientReadOnlyCheck(idenAnagPren)){return;}
			/* ******************* */				
		}
		catch(e){;}
		//	**********************
		url_send = "prenotazioneFrame?";
		//url_send += "servlet=sceltaEsami%3F";
		url_send += "servlet=prenotazioneInizio%3F";
		url_send += "Hiden_esame%3D" + id + "%26";
		url_send += "tipo_registrazione%3DP%26";
		url_send += "next_servlet%3Djavascript%3Acheck_riprenota()%3B%26";
		url_send += "Hclose_js%3Dchiudi_prenotazione()%3B";
		url_send += "&events=onunload&actions=libera_all('" + baseUser.iden_per + "', '" + basePC.ip + "');";
		
		parent.document.location.replace(url_send);
		
	}
}

function prenota_esame_paziente()
{
	var anagIden = array_iden_anag[vettore_indici_sel[0]];
	var url_send;
	if(anagIden == '' || anagIden == '-1')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		
		//*******************************		
		// modifica 01-04-2015
		// controllo telefono
		try{
			var rs = top.executeStatement('worklist_main.xml','checkAnagPrenotabile',[anagIden],2);
			if (rs[0] == 'KO') { /* errori database */
				// **************************					
				// modifica 18-3-15
				if (rs[1].toString().indexOf("lettura del file")>-1){
					return true;
				}
				// **************************
				alert('checkAnagPrenotabile - ' + rs[1]);
				alert("ATTENZIONE : ID anagrafico non valido - ID: " + iden_anag);
				return false;
			}
			if (rs[2] == 'KO') { /* errori di flusso/logica */
				if (confirm(rs[3])) {
					//apro scheda anag
					modificaAnagLink(vettore_indici_sel[0]);
					return;
				}
			}		
		}catch(e){;}
		//*******************************				
		// ************* controllo readonly
		/* modifica aldo 12-14 */
		if (!isPatientReadOnlyCheck(anagIden)){return;}
		/* ******************* */	
		
		// ***************************
		top.prenotaDaConsulta = "N";
		// ***************************
		url_send = "prenotazioneFrame?servlet=consultazioneInizio%3Ftipo%3DCDC%26Hiden_anag%3D" + anagIden + "&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&Hiden_anag=" + anagIden;
		parent.document.location.replace(url_send);
	}
}


function cambiaStato(){
	var codice = "";
	var idenRef = "";
	try{

		/*
	        $.fancybox({
	            'width': '40%',
	            'height': '40%',
	            'autoScale': true,
	            'transitionIn': 'fade',
	            'transitionOut': 'fade',
	            'type': 'iframe',
	            'href': 'divSortCol_container'
	        });*/

		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}			
/*		idenRef = stringa_codici(array_iden_ref);
		if ((idenRef!= "" )&&(idenRef!=-1)){
			alert("Impossibile cambiare lo stato per una prestazione già refertata.");
			return;
		}*/
		// controllare che l'esame non sia già eseguito o refertato !!! (query)
		if (isBeenExecuted( array_iden_esame[vettore_indici_sel[0]])){
			alert("Impossibile cambiare lo stato per una prestazione già eseguita o refertata.");
			return;
		}
		// *********************
		codice = array_iden_esame[vettore_indici_sel[0]];		
		$.fancybox(
				$("#divChangeStatus_container").html(), //fancybox works perfect with hidden divs
				{
					//fancybox options
					'centerOnScroll': true,
					'transitionIn': 'fade',
					'transitionOut': 'fade',
					'type': 'inline'
				}
		);	
		$('#fancybox-content').width(400);
		$('#fancybox-wrap').width(420);
		// settare valore iniziale !!!
		try{
			$('input[gruppo="statoAgg"]').each(function(indice) {
				// Iterate through all checked radio buttons
				if($(this).val()==array_cod_stato_agg[vettore_indici_sel[0]]) {
					$(this).attr('checked', true);
					adjustStatusStyle();
				}
			});
			
		}catch(e){alert(e.description);}
		
	}
	catch(e){
		alert("cambiaStato - Error: " + e.description);
	}
}

// funzione che ritorna se l'esame è stato eseguito
function isBeenExecuted(idenEsame){
	var bolEseguito = false;
	if (idenEsame!=""){
		var rs =  top.executeQuery('cambioStato.xml','isBeenExecuted',[idenEsame]);
		if (rs.next()){
			if (rs.getString("eseguito")=="1"){bolEseguito = true;}
		}
	}
	
	return bolEseguito;
}


function salvaStatoAggiuntivo(){
	var radioValue = "";
	var myLista = new Array();
	var myWin;
	try{
		idenEsame = array_iden_esame[vettore_indici_sel[0]];
		//alert("salvaStatoAggiuntivo " + idenEsame);
		radioValue = $("input[@name='listaStati']:checked").val();
		if ((radioValue=="")||(typeof(radioValue) == "undefined")){
			alert("Prego selezionare un nuovo stato.");
			return;
		}
		try{	
			myLista = new Array();
			myLista.push(radioValue);		
			myLista.push(idenEsame);
			var stm = top.executeStatement('cambioStato.xml','setStatoAggiuntivo',myLista,0);
			if (stm[0]!="OK"){
				alert("Errore: problemi nel salvataggio dello stato");
				return;
			}
		}
		catch(e){
			alert(e.description);
		}
		chiudiFancyBox();
		if (radioValue=="DP"){
			// riprenoto
			riprenota_esame_wk();			
		}
		else{
			aggiorna();
		}
	}
	catch(e){
		alert("salvaStatoAggiuntivo - Error: " + e.description);
	}

}



function buildIconeAggiuntive(){
	var idenAnag = "";
	var idenEsame = "";
	var stringaReparto = "";
	var idenRemoto= "";
	var diagnosi = "";
	var myLista;

	// per sapere iden_visita
	// select * from cc_problemi_ricovero where iden_visita in (SELECT IDEN FROM NOSOLOGICI_PAZIENTE WHERE IDEN_ANAG = 563735);
	try{
		
		if (top.home.getConfigParam("MOSTRA_NOTIFICA_DIAGNOSI_IN_WK")=="S"){
			// modifica 03/02/2015
			// verificare MOSTRA_NOTIFICA_DIAGNOSI_IN_WK.REPARTI
			// se presente in baseUser.LISTAREPARTI
			var bolShowDiagnIcon = false;
			var elencoCdcAbilitati = "";
			try{
				elencoCdcAbilitati = top.home.getConfigParam("MOSTRA_NOTIFICA_DIAGNOSI_IN_WK.REPARTI");
				var jsonObj = JSON.parse(elencoCdcAbilitati.replace(/[']/g, "\""));
				for (var k=0;k<baseUser.LISTAREPARTI.length;k++){
					if (jQuery.inArray(baseUser.LISTAREPARTI[k], jsonObj.elenco)>-1){
						bolShowDiagnIcon = true;
						break;
					}
				}			
				if (!bolShowDiagnIcon){return;}
			}catch(e){bolShowDiagnIcon= true;}		
			$("SPAN[class='placeHolderCompDiagnosi']").each(function(){		
				//alert(jQuery(this).attr("id"));
				//jQuery(this).addClass("icoCompDiagnosiCompilata");
	
				idenAnag = jQuery(this).attr("id").toString().split("_")[1];
				idenEsame = jQuery(this).attr("id").toString().split("_")[2];
				//alert(idenEsame +", "+idenAnag);
				myLista = new Array();
				myLista.push(idenAnag);
				rs = top.executeQuery('info_repository.xml','getIdenRemoto',myLista);
				if (rs.next()){
					idenRemoto = rs.getString("ID_REMOTO") + "";
				}
				if (idenRemoto==""){
					//alert("Errore: idenRemoto nullo");
					jQuery(this).addClass("icoCompDiagnosiNonCompilata")
					return;	
				}
				myLista = new Array();
				stringaReparto = ritornaInfoEsame(idenEsame, array_iden_esame, array_reparto);
				// togliere TEST
				//idenRemoto = "BSEMTR35S48I480N";
				//stringaReparto = "UTIM_SV";
				// ***********
				myLista.push(idenRemoto);
				if (stringaReparto=='AMB_EMA_SV'){
					
					try{var rsDiagnRich = top.executeQuery('worklist_main.xml','getDiagnosiRichiestaMedSv',[idenRemoto]);}
					catch(e){
						alert("Errore: getDiagnosiRichiestaMedSv " + e.description);
						jQuery(this).addClass("icoCompDiagnosiNonCompilata");
						return;
					}
				}
				else{
					try{var rsDiagnRich = top.executeQuery('worklist_main.xml','getDiagnosiRichiestaCodCdc',[idenRemoto, stringaReparto]);}
					catch(e){
						alert("Errore: getDiagnosiRichiestaCodCdc " + e.description);
						jQuery(this).addClass("icoCompDiagnosiNonCompilata");
						return;
					}
					
				}				
				if (rsDiagnRich.next()){
					jQuery(this).addClass("icoCompDiagnosiCompilata");
				}
				else{
					jQuery(this).addClass("icoCompDiagnosiNonCompilata");
				}
				jQuery(this).attr('title','Apri diagnosi');
				jQuery(this).click(function(){
					var idenEsame = jQuery(this).attr("id").toString().split("_")[2];
					setTimeout("apriCartella('PROBLEMI'," + idenEsame+ ");",1000);
					return true;
				});
				
			});
			try{
				$("SPAN[class='placeHolderVersPrec']").each(function(){	
					 try{
						idenAnag = jQuery(this).attr("id").toString().split("_")[1];
						jQuery(this).attr('title','Elenco versioni validate');
						jQuery(this).click(function(){
							versArchLettera(this);
							return true;
						});
					}catch(e){;}
				});		
			}catch(e){;}
		}

	}
	catch(e){
		alert("buildIconeAggiuntive - Error: " + e.description);
	}
}


// ATTENZIONE viene SEMPRE chiamata questa 
// DOPO che la wk nuova è stata costruita
function toDoAfterWkBuild(){
	try{
		creaLivelloRipetiCiclo();
		// ***********
		// nuovo privacy
		if (top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
			creaLivelloOscuramentoCittadino();
			// creo livello per info mancanza totalita esami
			creaLivelloInfoFascioloParziale();
		}
		// *****************		
		// ***********************
		// modifica 30-04-2015
		try{
			if (top.home.getConfigParam("SITO")=="SAVONA"){
				$("span[id^='anagIniziativa_']").each(function() {
					$(this).click(function( event ) {
						event.stopPropagation();
						var idAnag = $(this).attr("id").split("_")[1];
						top.gestioneNotifiche.openByIdenAnag(idAnag);
					})
				});
				// modifica 14-5-15
				//anonym_	
				// subordinare click su attributo GESTIONE_ANONIMATO
				// dell'utente
				$("span[id^='anonym_']").each(function() {
					$(this).click(function( event ) {
						event.stopPropagation();
						var idAnag = $(this).attr("id").split("_")[1];
						var idEsame = $(this).attr("id").split("_")[2];
						creaCodiceAnonimato(idAnag,idEsame);
					})
				});				
			}
			

		}catch(e){;}
		// ***********************					
	}
	catch(e){
		alert("toDoAfterWkBuild - Error: " + e.description);
	}
}

// **** nuovo
// **************************************************
// *************************** nuovo privacy **************
// **************************************************
function creaLivelloInfoFascioloParziale(){
	var strToAppend = "";
	try{
//		strToAppend ="<div id='divInfoFascParz' style='position:absolute; left:20; width:410px; height:10; visibility:hidden'>   <font face='verdana, arial, helvetica, sans-serif' size='2'>    <div style='float:left; background-color:yellow; padding:3px; border:1px solid black'>    <span style='float:right; background-color:gray; color:white; font-weight:bold; width='20px'; text-align:center; cursor:pointer' onclick='javascript:hideIt()'>&nbsp;X&nbsp;</span>Il fascicolo puo' non essere completo</div>   </font></font></div>";
		strToAppend ="<div id='divInfoFascParz'><div id ='divInfoFascParz_inside' >Il fascicolo puo' non essere completo</div></div>";
		$(strToAppend).appendTo('body');
		var y1 = 20;
		window.setTimeout(function(){
			document.getElementById("divInfoFascParz").style.top = "0px";
			document.getElementById("divInfoFascParz").style.visibility='visible';}, 10);
		//window.setTimeout("placeIt()", 10);	
	}
	catch(e){
		alert("creaLivelloInfoFascioloParziale - Error: " +e.description);
	}
}




var paginaOscuramentoCittadino = "oscuramentoCittadino.html";
function creaLivelloOscuramentoCittadino(){
	try{
		var strToAppend = "";
		strToAppend ="<a class='fancybox' href='"+ paginaOscuramentoCittadino +"' data-fancybox-type='iframe' id ='linkToOpenOscCitt'></a>";
		var today = new Date();
		/*$('<div/>',{
		  id: 'cal-full-year'
		}).appendTo('body')
		  .html(html)
		  .css({
			 'z-index': '10'
		});*/
		$(strToAppend).appendTo('body');
	
		$('#linkToOpenOscCitt').fancybox(
		{	'width'				: '80%',
			'height'			: 160,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
              preload: false // fixes issue with iframe and IE
	         },
			'scrolling'   		: 'no' ,			
			'onComplete' : function() {
				$('#fancybox-frame').load(function() {
					/*resize della fancybox in base al contenuto: i 20px sono quelli che la fancybox mette come border*/
					//$('#fancybox-content').width(($(this).contents().find('form').width())+80);
					//$('#fancybox-content').height(($(this).contents().find('form').height())+2);
					//$('#fancybox-content').css("border","none");
					
				});
			}
		});
		
	}
	catch(e){
		alert("creaLivelloOscuramentoCittadino - Error: " + e.description);
	}
}


function isPrivacyOK (){
	var bolEsito = false;
	var cod_oscuramento = "";
	var bolPrivacyAttiva = false;
	var bolOneRecordAtLeast = false;

	// modifica 7-10-15
	return true;
	// *******************

	try{
		/*
		var rs =  top.executeQuery('configurazioni.xml','getConfigPageParam',['PRIVACY','GESTIONE_ATTIVA_PVCY','S']);
		if (rs.next()){
			if (rs.getString("valore")=="S"){bolPrivacyAttiva = true;}
		}*/
		bolPrivacyAttiva = top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S";
	}
	catch(e){
		bolPrivacyAttiva = false;
	}


	if (bolPrivacyAttiva){
		if (canInsertPrivacy()){
			bolEsito = false;
		}
		else{
			var myLista = new Array();
			var idenEsami = (stringa_codici(array_iden_esame)).replace(/[*]/g, ",");
			myLista.push(idenEsami);
			rs = top.executeQuery('privacy.xml','getPrivacyEsame',myLista);
			while (rs.next()){
				bolOneRecordAtLeast = true;
				cod_oscuramento = rs.getString("COD_OSCURAMENTO");
		//		alert(cod_oscuramento);
				// se almeno uno NON è compilato esco
				if (cod_oscuramento==""){
					bolEsito = false;
					break;
				}
				else{
					bolEsito = true;
				}
			}
		
		}
	}
	else{
		// NON è attivo controllo privacy
		bolEsito = true;
	}
	return bolEsito;
}

// controllo su valore tag A1
function isReportAllowed(){
	var bolEsito = false; 
	try{
		var tagA1value = "";
		var stmPvcyTag = top.executeStatement('privacy.xml','getPazPrivacyTagValue',['A1',stringa_codici(array_iden_anag).toString().split("*")[0]],1);
		if (stmPvcyTag[0]=="OK"){
			tagA1value = stmPvcyTag[2]; 
		}
		if (tagA1value=="S"){
			bolEsito = true;
		}
	}
	catch(e){
		alert("Error on getPrivacyTagValue: " +e.description);
	}
	return bolEsito;
}
// **************************************************



function creaLivelloRipetiCiclo(){
	var strToAppend = "";
	strToAppend ="<a class='fancybox' href='ciclicheAnnuali.html' data-fancybox-type='iframe' id ='linkToOpenRipetiCiclo'></a>";
	var today = new Date();
	/*$('<div/>',{
	  id: 'cal-full-year'
	}).appendTo('body')
	  .html(html)
	  .css({
		 'z-index': '10'
	});*/
    $(strToAppend).appendTo('body');
	// modifica 14-6-16
	// modifica 14-7-16, variata dimensione di apertura
	try{
		$('#linkToOpenRipetiCiclo').fancybox(
		{	'width'				: 780,
			'height'			: '95%',
			'autoScale'     	: false,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none',
			'type'				: 'iframe'
		});
	}
	catch(e){
		alert("creaLivelloRipetiCiclo - " + e.description);
	}
}

// modifica 24-10-16
function checkErogatiRegione(idenEsami){
	try{
		var rs=top.executeQuery('worklist_main.xml','getCountErogatiRegione',[idenEsami]);
		if (rs.next()){
			try{
				if (parseInt(rs.getString("esito"))>0){
					throw new Error("Impossibile proseguire: alcune delle prestazioni scelte son state gi\u00E0 erogate al ministero !");
				}
			}catch(e){
				// errore di conversione, non dovrebbe mai esserci
				throw new Error("Impossibile proseguire: alcune delle prestazioni scelte son state gi\u00E0 erogate al ministero !!!");
			}
		}else{
			throw new Error("Errore grave: esami cancellati");
		}
	}catch(e){
		throw e;
	}		
}
// *********

// viene chiamata da lista esami da paz e da wk principale
function ripetiCiclo(){
	try{
		// modifica 2-5-16
		// controllare se ha un'impegnativa
		// altrimenti blocco
		var rs ;
		var bolImpegnativaDaCompilare = false;
		var bolImpegnativaDiversa = false;
		
		
		// DA ATTIVARE IN FUTURO
		// mettere controllo su impegnative diverse
		/*
		if ((stringa_codici(array_iden_esame)).split("*").length>1){
			try{rs=top.executeQuery('worklist_main.xml','getCountImpegnative',[(stringa_codici(array_iden_esame)).replace(/[*]/g, ",")]);}catch(e){alert("Errore getCountImpegnative\n" + e.description); }		
			if (rs.next()){
				if (parseInt(rs.getString("NUM"))>1){
					bolImpegnativaDiversa = true;
				}
			}
		}
		if (bolImpegnativaDiversa){
			alert("Impossibile ripetere l'esame: selezionati esami aventi impegnative diverse tra loro.");
			return;			
		}
		*/
		// *****************
		
		// modifica 13-6-16
		// DA ATTIVARE IN FUTURO, FORSE
		/*
		try{
			// SOLO per le prestazioni NON cicliche
			rs=top.executeQuery('worklist_main.xml','getCountDema',[(stringa_codici(array_iden_esame)).replace(/[*]/g, ",")]);
			if (rs.next()){
				if (parseInt(rs.getString("NUM"))!=0){
					alert("Attenzione, non \u00E8 possibile effettuare la ripetizione delle prestazioni per una impegnativa dematerializzata.");
					return;	
				}
			}
		}catch(e){alert("Errore getCountDema\n" + e.description); }
		*/

		// modifica 24-10-16
		try{
			checkErogatiRegione((stringa_codici(array_iden_esame)).replace(/[*]/g, ","));
		}catch(e){
			alert(e.description);
			return;
		}		
		// *****************		
		
		try{rs=top.executeQuery('worklist_main.xml','getNumImpRich',[stringa_codici(array_iden_esame).split("*")[0]]);}catch(e){alert("Errore getNumImpRich\n" + e.description); }
		if (rs.next()){
			// modifica 14-6-16
			if (rs.getString("IDEN_TICK")!="107"){
				if ((rs.getString("NUMIMP_NUMRICH")=="")&&(rs.getString("INT_EST")=="E")){
					// modifica 6-7-16
					// casi extra LEA
					var arrProvenienza = stringa_codici(array_provenienza).toString().split('*');				
					if (jQuery.inArray( "2872", arrProvenienza) == -1 && jQuery.inArray( "4492", arrProvenienza) == -1 && top.home.getConfigParam("SITO")=="SAVONA"){
						bolImpegnativaDaCompilare=true;
					}
					// ***********
				}
			}
		}
		if (bolImpegnativaDaCompilare){
			alert("Impossibile ripetere l'esame: impegnativa non compilata.");
			return;
		}
		// ******** FINE modifica 13-6-16
		
		
		// modifica 10-3-2015
		var urlToChange = "";
		urlToChange  = "ciclicheAnnuali.html?sorgente=worklist&idenEsame=" +  stringa_codici(array_iden_esame); 
		$('#linkToOpenRipetiCiclo').attr("href",urlToChange);
		// *******************
		$('#linkToOpenRipetiCiclo').click();
	}
	catch(e){
		alert("ripetiCiclo - Error: " + e.description);
	}	
}



// valore : date esami
// modifica 10-3-2015
// modifica 27-4-15
// modifica 11-5-15
// modifica 14-6-16
// modifica 14-7-16
function generaEsamiCiclici(valore, idenEsame, jsonObj, closeOnExit){
	try{
		var bolEsitoInsert = true;
		var strTmpData = "";
		// valore contiene le date in formato gg/mm/yyyy
		var listaDate ;
		var myLista 
		var stm;
		var myJson ;
		
		var myCloseOnExit = true;
		if (typeof closeOnExit=="undefined"){myCloseOnExit = true;		}
		else{	myCloseOnExit = closeOnExit;}
		
		
		try{
			myJson = JSON.parse(jsonObj);
		}
		catch(e){
			alert("Errore di conversione dati. Impossibile continuare.");
			return;
		}
		
		if (valore==""){
			alert("Nessuna data valida selezionata");
			return;
		}
		if (myJson.ora_accettazione=="" || myJson.ora_accettazione=="undefined"){
			alert("Nessuna ora valida selezionata");
			return ;
		}		
//		alert(valore); return;
		listaData = valore.split(",")

		var idenPerUtente = baseUser.IDEN_PER ;
		
		// **************
		var listaEsami = idenEsame.split("*");
		var ID_GRUPPO_CICLICA = "";
		// per ogni esame di partenza, quindi selezionato
		for (var z=0;z<listaEsami.length;z++){
			// genero comunque un codice di raggruppamento
			// internamente a creaEsameCiclico
			// ci sara' il controllo che se l'esame sorgente lo avra' gia'
			// valorizzato si prendera' quello
			// altrimenti si accetta quello esterno e lo si spalma su *tutti*
			// quello sorgente incluso !!!
			// ID_GRUPPO_CICLICA = generateUUID();
			ID_GRUPPO_CICLICA = "";
			stm = top.executeStatement('worklist_main.xml','getIdGruppoCiclica',[],1);
			if (stm[0]!="OK"){
				alert("Errore: problemi nel recupero id gruppo cicliche.\n"+ + stm[1]);
				return;
			}
			ID_GRUPPO_CICLICA = stm[2]; // primo parametro output
			if (isNaN(ID_GRUPPO_CICLICA)){
				alert("Errore: codice gruppo ciclica NON numerico.");
				return;			
			}
			// alert(listaEsami[z] +" , " + ID_GRUPPO_CICLICA);
			// per ogni data selezionata
			for (var i=0;i<listaData.length;i++){
				// vado ad inserire l'esame ripetuto
				myLista = new Array();
				//myLista.push(idenEsame);	
				myLista.push(listaEsami[z]);						
				myLista.push(idenPerUtente);
				strTmpData = listaData[i].substring(6,10) + listaData[i].substring(3,5) + listaData[i].substring(0,2);
				myLista.push(strTmpData);
				myLista.push(parseInt(ID_GRUPPO_CICLICA)); 
				// *************
				if (i== listaData.length-1){
					// ultimo del pacchetto
					myLista.push("S");
				}
				else{
					myLista.push("N");
				}
				//***********
				myLista.push(myJson.ora_accettazione);
				myLista.push(myJson.note_accettazione);						
	//			alert(idenEsame +"#"+ idenPerUtente + "#" + strTmpData+"#" + JSON.stringify(jsonObj));
				stm = top.executeStatement('worklist_main.xml','creaEsameCiclico',myLista,0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nel salvataggio dell'esame ciclico.\n" + stm[1] + "\n" + myLista);
					bolEsitoInsert = false;
					break;
				}			
			}// fine loop sulle data
		}// fine loop su esami
		if (!bolEsitoInsert){
			// ERRORE!!
			// todo completare
			return;
		}
		else{
			// alla fine vado a visualizzare tutti gli esami del paziente
			if(myCloseOnExit){visualizza_esami();}
		}
	}
	catch(e){
		alert("generaEsamiCiclici - Error: " + e.description);
	}	
}
// **********************


//************** toniutti
function versArchLettera(oggetto){
	try{
		var idenRef="", idenAnag="";
		var urlToCall = "";
		idenRef = oggetto.id.toString().split("_")[1];		
		idenAnag = oggetto.id.toString().split("_")[2];		
		if ((idenRef == "")||(idenAnag=="")){return;}
		urlToCall = "SL_VersioniPrecedentiFrameset?iden_ref="+idenRef+"&sorgente="+document.frmAggiorna.sorgente.value+"&iden_anag="+idenAnag;
		win_versioni_pecedenti = window.open(urlToCall, '','width=1000, height=680, status=yes, top=0,left=0');
	}
	catch(e){
		alert("versArchLettera - Error: " + e.description);
	}		
}

function lettera(idenEsaFromWk){
	var stringa_iden_esa="";
	var stringa_iden_ref="";
	var stringa_iden_anag="";
	try{
		var myLista = new Array();
		var idenEsame = "";
		var rs , stm , oggetto;
		var urlLettera = "layoutLettera/consoleLettera.html";
		var paramLettera ="";

		if ((typeof idenEsaFromWk =="undefined") || (idenEsaFromWk=="")){
			var num_esami_selezionati = conta_esami_sel();
			if (conta_esami_sel()==0){
				alert(ritornaJsMsg("jsmsg1"));
				return;
			}
			// nel caso ci siano +
			// record selezionati verifico che non siano
			// pazienti differenti
			if (num_esami_selezionati>1){
				// controllo anagrafica diversa
				if (checkPazientiDiversi()==true){
					// ATTENZIONE modificare con label variabile !
					alert(ritornaJsMsg("jsmsgAnagDiv"));
					return;
				}
				//alert("Prego selezionare un solo esame");
				//return;
			}
			stringa_iden_ref = stringa_codici(array_iden_ref);	
			stringa_iden_esa = stringa_codici(array_iden_esame);
		}
		else{
			stringa_iden_esa = idenEsaFromWk;
			stringa_iden_ref = ritornaInfoEsame(stringa_iden_esa, array_iden_esame, array_iden_ref);
		}
		stringa_iden_ref == "-1"?stringa_iden_ref="":stringa_iden_ref = stringa_iden_ref;	
		stringa_iden_anag = ritornaInfoEsame(stringa_iden_esa, array_iden_esame, array_iden_anag);			
		paramLettera = "?iden_anag=" + stringa_iden_anag + "&iden_esame=" + stringa_iden_esa + "&iden_ref=" + stringa_iden_ref +"&login=" +  baseUser.LOGIN + "&iden_medr=" + baseUser.IDEN_PER;
		var finestra = window.open(urlLettera + paramLettera,"wndInserimentoAnagrafica","status=1,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
		if (finestra) {
			finestra.focus();
		} else {
			finestra = window.open(urlLettera + paramLettera,"wndInserimentoAnagrafica","status=1,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
		}		
	}
	catch(e){
		alert("lettera - Error: " + e.description);
	}
}

//*****************



// **************************************

// *********************************************
// ******* Erogazione multipla *****************
// *********************************************
var urlErogazioneMultipla = "addOn/erogazioneMultipla/erogazioneMultipla.html?sorgente=worklist";
function openErogaMultiplo(value){
	try{
		
		$.fancybox({
			'href'			: urlErogazioneMultipla,
			'width'				: '90%',
			'height'			: 700,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'scrolling'   		: 'no',
			onStart		:	function() {
				//return window.confirm('Continue?');
			},
			onCancel	:	function() {
				//alert('Canceled!');
			},
			onComplete	:	function() {
				//alert('Completed!');
			},
			onCleanup	:	function() {
				//return window.confirm('Close?');
			},
			onClosed	:	function() {
				aggiorna();
			}
	   });
		
	}
	catch(e){
		alert("openErogaMultiplo - error: " + e.description);
	}	
}


/* modifica aldo 12-14 */
// ritorna true se è tutto ok e si può procedere
function isPatientReadOnlyCheck(idenAnag){
	var bolCheck = false;
	var readOnly = "";
	try{var rs = top.executeQuery('anagrafica.xml','getReadOnlyState',[idenAnag]);}catch(e){alert("Error on getReadOnlyState"); return;}
	if (rs.next()){
			readOnly = rs.getString("readonly");
	}
	else{
		 alert("Errore grave: non esiste il paziente"); return false;
	}

	if (readOnly == "S"){
		bolCheck = false;
		if (confirm("Attenzione l'anagrafica non e' completa, per agire su di essa si devono compilare le informazioni obbligatorie, procedere?")){
			// apro scheda anagrafica
			var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
			url = url + "&IDEN_ANAG=" + idenAnag + "&READONLY=" + readOnly + "&SBLOCCA_READONLY=S";
			var finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			if (finestra) {
				finestra.focus();
			} else {
				finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
			}			
		}
	}
	else{
		bolCheck = true;
	}
	return bolCheck;
}
/* ******************* */


// modifica Aldo 15-12-14
// in un array esterno e caricarlo subito allo startup
function canPrint(valore){
	try{
		var bolEsito = false;
		if (valore==""){return;}
		switch (valore){
			case "HOLTER":
				if (conta_esami_sel()!=1){
					//alert(ritornaJsMsg("jsmsgSoloUnEsame"));
					return false;
				}			
				var codice = stringa_codici(array_iden_esame);
				try{rs = top.executeQuery('worklist_main.xml','isInSalaHolter',[codice]);}catch(e){alert("Error on isInSalaHolter"); return;}
				if (rs.next()){
					if (rs.getString("esito")=="OK"){
						bolEsito = true;
					}
				}
				else{
					 bolEsito = false;
				}
				break;
		}
	}
	catch(e){
	 	bolEsito = false;
		alert("canPrint - error: " + e.description);
	}
	finally{
		return bolEsito;
	}
}

function stampa_modulo(valore){
	var urlStampa="";
	var sf = "";
	var finestraStampaModulo;
	try{
		switch (valore){
			case "HOLTER":
				idenEsame =  stringa_codici(array_iden_esame);
				sf = "{ESAMI.IDEN}=" + idenEsame.split("*")[0];
				urlStampa = 'elabStampa?stampaFunzioneStampa=MODULO_HOLTER&stampaSelection=' + sf + '&stampaAnteprima=S';								
				break;
		}
		if (urlStampa!=""){
			finestraStampaModulo  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
			if(finestraStampaModulo)
				{finestraStampaModulo.focus();}
			else
				{finestraStampaModulo  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);		}					
		}
		
	}
	catch(e){
		alert("fineGiornata - error: " + e.description);
	}	
}


// ********** nuova modifica per Ferrara 
function mergeReport(){
	try{
		var nIdenRef = 0;
		
		if (vettore_indici_sel.length<2){
			alert("Prego selezionare almeno 2 prestazioni");
			return;
		}
		var listaEseguiti , listaIdenEsame;
		var bolTuttiEseguiti = true;
		var idenEsameSource_toMerge = "";
		var idenEsamiTarget_toMerge = "";
		var idenRef = "";
		var bolFirmato = false;

		listaIdenEsame = stringa_codici(array_iden_esame).split("*");
		listaEseguiti = stringa_codici(array_eseguito).split("*");
		for (var k=0;k<listaIdenEsame.length;k++){
			idenRef = ritornaInfoEsame(listaIdenEsame[k], array_iden_esame, array_iden_ref);
			if (idenRef!="" ){
				nIdenRef++;
				idenEsameSource_toMerge = listaIdenEsame[k];
			}
			if (listaEseguiti[k]==0){
				bolTuttiEseguiti = false;
			}
			else{
				if (idenEsamiTarget_toMerge==""){
					idenEsamiTarget_toMerge = listaIdenEsame[k];
				}
				else{
					idenEsamiTarget_toMerge += "," + listaIdenEsame[k];
				}
			}
			if ( ritornaInfoEsame(listaIdenEsame[k], array_iden_esame, array_firmato) =="S"){
				bolFirmato = true;
			}
		}
		if (nIdenRef!=1){
			alert("Errore: prego selezionare un singolo esame refertato.");
			return;
		}
		if (!bolTuttiEseguiti){
			alert("Errore: le prestazioni selezionate devono essere gia' erogate.");
			return;
		}
		if (bolFirmato){
			alert("Errore: non si possono unire referti gia' firmati.");
			return;
		}
//		alert("ok\n" + idenEsameSource_toMerge + "\n" + idenEsamiTarget_toMerge);
		var out = top.executeStatement('worklist_main.xml','mergeReport',[idenEsameSource_toMerge,idenEsamiTarget_toMerge]);
		if (out[0] != 'OK') {
			alert("Errore " + out); return;
		}
		else{
			// refresh worklist
			aggiorna();
		}

		
	}
	catch(e){
		alert("mergeReport - error: " + e.description);
	}
}


// ***** modifica DEMA
function stampaDema(){
	var idenEsame = "";
	try{
		var codice = "";
		var nre = "";
		
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}	
		codice = stringa_codici(array_iden_esame);		
		try{var rs = top.executeQuery('dema.xml','getCodiciDema',[codice]);}catch(e){alert("Error on getCodiciDema"); return;}
		if (rs.next()){
			if (rs.getString("codice_autenticazione_sac")!=""){
				// stampo
				nre = rs.getString("nre");
				
				var sf = "{Query.NRE}='" + nre + "' and {Query.IDEN} = " + codice;
//				alert("stampo, sf " + sf);
				//{Query.NRE}  = '0700A4000011637' and  {Query.IDEN}  = 1162687
				urlStampa = 'elabStampa?stampaFunzioneStampa=PRESTAZIONI_DEMA&stampaSelection=' + sf + '&stampaAnteprima=S';
		//		urlStampa += '&prompt<mioparam>=aa';
				var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
				if(finestra)
				{
					finestra.focus();
				}
				else
				{
					finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
				}				
				
				
			}
			else{
				// chiamata RRPT
				if (confirm("Attenzione, ricetta dematerializzata non presente: si vuole procedere alla prescrizione?")){
					apriCartella('INSERIMENTO_RR_PRESTAZIONI_AMB');
				}
			}					
		}
		else{
			alert("Errore grave: esame inesistente, iden: " + codice);
			return;
		}
	}
	catch(e){
		alert("stampaDema - error: " + e.description);
	}
}


function canPrintDEMA(){
	var bolEsito = false;
	try{
		// modificato 9-6-16
		if (top.home.getConfigParam("SITO")=="SAVONA"){
			var codice = stringa_codici(array_iden_esame);
			try{var rs = top.executeQuery('dema.xml','getCodiciDema',[codice]);}catch(e){alert("Error on getCodiciDema"); return;}
			if (rs.next()){
				if (rs.getString("esame_associato")=="S"){
					bolEsito = true;
				}
			}
			else{
				 bolEsito = false;
			}	
		}
	}
	catch(e){
		alert("canPrintDEMA - error: " + e.description);
	}
	return bolEsito;
}
// *******************


// modifica 11-5-15
function stampaTabVisitaRRF(){
	try{
		var idenRef = stringa_codici(array_iden_ref);
		//alert("idenRef: "+ idenRef);
		if ((idenRef==-1)||(idenRef==0)||(idenRef=="")){
			// non è refertato
			alert("Impossibile stampare: esame non ancora refertato.");
			return;		
		}	
/*		alert(idenAnag + " " +idenEsame);
		return;*/
		var sf = "{ESAMI.IDEN_REF}=" + idenRef.split("*")[0];
		urlStampa = 'elabStampa?stampaFunzioneStampa=STAMPA_VISITA_RRF&stampaSelection=' + sf + '&stampaAnteprima=S';
//		urlStampa += '&prompt<mioparam>=aa';
		var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		if(finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
		}
	}	
	catch(e){
		alert("stampaTabVisitaRRF - error: " + e.description);
	}
}

// ***********************
// modifica 12-5-15
// ***********************
String.prototype.getTodayStringFormat = function()
{
	var dataOggi ;


	dataOggi=new Date();
	var dataOggiGiorno=dataOggi.getDate();
	if (parseInt(dataOggiGiorno)<10){dataOggiGiorno = "0" + dataOggiGiorno.toString();}
	var dataOggiMese=dataOggi.getMonth()+1;
	if (parseInt(dataOggiMese)<10){dataOggiMese = "0" + dataOggiMese.toString(); }
	var dataOggiAnno=dataOggi.getFullYear();
	var dataOggiStringa= dataOggiAnno.toString() + dataOggiMese.toString() + dataOggiGiorno.toString();
	return dataOggiStringa;
};

function stampaReport(funzione_chiamante){
	try{
		var idenAnag = "", sf = "";var finestraStampa;
		if (funzione_chiamante==""){return;}
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}			
		switch (funzione_chiamante){
			case"LISTA_PRENO_PAZ":
				idenAnag = stringa_codici(array_iden_anag).split("*")[0];
//				idenEsame=idenEsame.replace(/\*/g, ",");
				sf= "{ESAMI.IDEN_ANAG} = " + idenAnag  + " and {ESAMI.REPARTO} in ['" +  baseUser.LISTAREPARTI.toString().replace(/,/g, "','") + "']";
				sf += " AND {ESAMI.DAT_ESA} >'" + (new String("")).getTodayStringFormat() +"'";
				// modifica 2-10-15
//				sf += " AND {ESAMI.PRENOTATO} ='1' and {ESAMI.ACCETTATO} ='0'";
				sf += " AND {ESAMI.ESEGUITO} ='0'";
				// *****
				sf += " AND {ESAMI.DELETED} ='N'";
				strUrl = "elabStampa?stampaFunzioneStampa="+funzione_chiamante+"&stampaSelection=" + sf + "&stampaAnteprima=S";
					finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight); 
				if(finestraStampa){finestraStampa.focus();}
					else{finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);}
				break;
			case "MODULO_DIABETOLOGIA":
				idenAnag = stringa_codici(array_iden_anag).split("*")[0];
				sf = "  {ANAG.IDEN} ="+idenAnag;
				strUrl = "elabStampa?stampaFunzioneStampa="+funzione_chiamante+"&stampaSelection=" + sf + "&stampaAnteprima=S";
				finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight); 
				if(finestraStampa){finestraStampa.focus();}
					else{finestraStampa  = window.open(strUrl,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);}
					
				break;	
			default:
				break;
		}
	}	
	catch(e){
		alert("stampaReport - error: " + e.description);
	}
}
// ***********************

// modifica 14-5-15
var urlRicetteMultiple = "addOn/generaRicetteMultiple/generaRicetteMultiple.html?sorgente=worklist";
function generaMultiRicette(){
	try{
		$.fancybox({
			'href'			: urlRicetteMultiple,
			'width'				: '90%',
			'height'			: 700,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'scrolling'   		: 'no',
			onStart		:	function() {
				//return window.confirm('Continue?');
			},
			onCancel	:	function() {
				//alert('Canceled!');
			},
			onComplete	:	function() {
				//alert('Completed!');
			},
			onCleanup	:	function() {
				//return window.confirm('Close?');
			},
			onClosed	:	function() {
				//aggiorna();
			}
	   });
				
		
	}	
	catch(e){
		alert("generaMultiRicette - error: " + e.description);
	}	
}

function confermaRR(iden_esame,idenAnag,reparto,dataEsame){
	try{
		var urlCartella  = "Snodo?azione=RicettaRossa&DO=OPEN";
		urlCartella += "&IDEN_ESAME=" + iden_esame;
		urlCartella += "&IDEN_ANAG=" + idenAnag;
		urlCartella += "&DATA_EVENTO=" + dataEsame;
		urlCartella += "&REPARTO=" + reparto;
		urlCartella += "&FUNZIONE=WORKLIST_RICETTE";
		var	myWinCartella = window.open(urlCartella,"ambulatorio","top=0,left=0, width=" + screen.availWidth +", height=" + screen.availHeight + ", status=no, scrollbars=yes");		
		
		// fare trigger su cambio stato impegnativa da null ad un valore
		// setto comunque dett_esami.STATO_RR_CONFERMA = 'S'
		
			
	}	
	catch(e){
		alert("confermaRR - error: " + e.description);
	}		
}

function creaCodiceAnonimato(idenAnag, idenEsame){
	try{

	/*
		if (!confirm("Proseguire con la creazione di un codice di anonimato per il paziente selezionato ?")){
			return false;
		}*/

		var urlGestAnonimato="addOn/gestioneAnonimato/gestioneAnonimato.html";
		var param = "";
		if (typeof(idenAnag)=="undefined" && typeof(idenEsame)=="undefined" ){
			if (conta_esami_sel()==0){
				alert(ritornaJsMsg("jsmsg1"));
				return;
			}			
			param = "?idenAnag=" + stringa_codici(array_iden_anag).split("*")[0] + "&struttura=" + array_reparto[vettore_indici_sel[0]]; 
		}
		else{
			param = "?idenAnag=" + idenAnag + "&struttura=" + ritornaInfoEsame(idenEsame, array_iden_esame, array_reparto);  
		}
		
			$.fancybox({
				'href'			: urlGestAnonimato + param + "&sorgente=worklist",
				'width'				: '60%',
				'height'			: 250,
				'autoScale'     	: false,
				'transitionIn'	:	'elastic',
				'transitionOut'	:	'elastic',
				'type'				: 'iframe',
				'showCloseButton'	: false,
				'iframe': {
					preload: false // fixes issue with iframe and IE
				},
				'scrolling'   		: 'no',
				onStart		:	function() {
					//return window.confirm('Continue?');
				},
				onCancel	:	function() {
					//alert('Canceled!');
				},
				onComplete	:	function() {
					//alert('Completed!');
				},
				onCleanup	:	function() {
					//return window.confirm('Close?');
				},
				onClosed	:	function() {
					try{
						//alert("onclosed");
					}catch(e){alert(e.description +"##");}
					//aggiorna();
				}
			});	
	}	
	catch(e){
		alert("creaCodiceAnonimato - error: " + e.description);
	}		
	
}


// modifica 31-7-15
function stampaDemaDaIcona(idenEsame){

	var sf = "{Query.IDEN} = " + idenEsame;
	
	urlStampa = 'elabStampa?stampaFunzioneStampa=PRESTAZIONI_DEMA&stampaSelection=' + sf + '&stampaAnteprima=S';
	urlStampa += "&stampaReparto=" + ritornaInfoEsame(idenEsame, array_iden_esame, array_reparto)	;
	alert(urlStampa);
	// *********
	var finestra  = window.open(urlStampa,'','top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight);
	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open(urlStampa,'','top=100000,left=100000, width=' + screen.availWidth+', height=' + screen.availHeight);
	}		
	
}

// modifica 28-5-15
function stampaModuliFE(){
	try{
		var urlToCall = "";
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}		
		urlToCall = "consensi_SOLE/moduliStampa.html";
		urlToCall += "?idenAnag=" + stringa_codici(array_iden_anag).split("*")[0];;
		urlToCall += "&idenEsame="+ stringa_codici(array_iden_esame); 
//		alert(urlToCall );
		$.fancybox(
		{	
			'width'		: document.documentElement.offsetWidth/10*9,
			'height'	: document.documentElement.offsetHeight/10*8,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'title'	:	'Stampa moduli', 
			'href'	:	urlToCall,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'type'				: 'iframe',
			'scrolling'   		: 'yes',
			'showCloseButton'	: true,
			'onStart'	: function(  ) {
				//try{showHideReportControlLayer(false);}catch(e){;}
				},
			'onClosed'	: function( ) {
				//try{showHideReportControlLayer(true);}catch(e){;}
				},
			'onComplete': function() {
		    }		
		});				
	}
	catch(e){
		alert("stampaModuliFE - Error: " + e.description);
	}
		
}

// modifica 5-6-15
function openCertEsenzioni(){
	try{
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}			
		var urlGestEsenzioni="addOn/moduliEsenzioni/moduliEsenzioni.html";
		var param = "?idenAnag=" + stringa_codici(array_iden_anag).split("*")[0];
		window.open(urlGestEsenzioni + param + "&sorgente=worklist","",'top=0,left=0, width=' + screen.availWidth+', height=' + screen.availHeight+ ",status=yes,scrollbars=yes");
	}	
	catch(e){
		alert("openCertEsenzioni - error: " + e.description);
	}		
}

//  modifica 11-6-15
function rimuoviCodiceAnonimato(){
	try{
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}
		var idPaziente=stringa_codici(array_iden_anag).split("*")[0];
		var cdc = stringa_codici(array_reparto).split("*")[0];		
		if (idPaziente!="" && cdc != ""){
			if (!confirm("Procedere con la rimozione dell'anonimato?")){return;}
			var out = top.executeStatement('gestione_anonimato.xml','rimuoviAnonimo',[idPaziente,cdc]);
			if (out[0] != 'OK') {
				alert("Errore " + out[1]);
			}
			else{
				aggiorna();
			}
		}
		else{
			alert("Erore grave, codici nulli!!\n" + idPaziente + "#\n" + cdc +"#");
		}
		
	}	
	catch(e){
		alert("rimuoviCodiceAnonimato - error: " + e.description);
	}			
}



// modifica 7-9-15
function isCiclico(){
	var bolEsito = false; 
	try{
		
		var listaIdenEsa = stringa_codici(array_iden_esame).replace(/\*/g, ',')
		var rs =  top.executeQuery('worklist_main.xml','countEseguibiliCiclici',[listaIdenEsa]);
		if (rs.next()){
			/*
			var numeroEsami = stringa_codici(array_iden_esame).split("*").length;			
			if (parseInt(rs.getString("conteggio"))==numeroEsami){
				bolEsito =  true;
			}
			else{
				bolEsito = false;
			}*/
			if (parseInt(rs.getString("conteggio"))>0){
				bolEsito = false;
			}
			else{
				bolEsito = true;
			}			
		}	
		else{
			bolEsito = false;
		}
	}
	catch(e){
		alert("Error on isCiclico: " +e.description);
	}
	return bolEsito;	
}

function isEseguibileNonCiclico(){
	var bolEsito = false; 
	try{
		var listaIdenEsa = stringa_codici(array_iden_esame).replace(/\*/g, ',')
		var rs =  top.executeQuery('worklist_main.xml','countEseguibiliNonCiclici',[listaIdenEsa]);
		if (rs.next()){
			/*
			var numeroEsami = stringa_codici(array_iden_esame).split("*").length;			
			if (parseInt(rs.getString("conteggio"))==numeroEsami){
				bolEsito =  true;
			}
			else{
				bolEsito = false;
			}*/
			if (parseInt(rs.getString("conteggio"))>0){
				bolEsito = false;
			}
			else{
				bolEsito = true;
			}
		}	
		else{
			bolEsito = false;
		}
	}
	catch(e){
		alert("Error on isEseguibileNonCiclico: " +e.description);
	}
	return bolEsito;	
	
}


// spostare funzione in un punto comune
// come la home !!!
function apriModulistica(){
	try{
		
		var urlModulistica="addOn/stampeOculistica/stampeOculistica.html";
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}			
		var param = "?idenAnag=" + stringa_codici(array_iden_anag).split("*")[0];
		try{var rs = top.executeQuery('oculistica.xml','getIntRef',[array_iden_esame[vettore_indici_sel[0]].split("*")[0]]);}catch(e){alert("Errore: getIntRef!!!");return;}
		if (rs.next()){
			param += "&citta=" + rs.getString("CITTA");
		}
		else{
			param += "&citta=" ;
		}
		
		top.loadInFancybox({'url':urlModulistica + param + "&sorgente=worklist" ,'onClosed':function(){
		},showCloseButton:true, enableEscapeButton:true});		
	}	
	catch(e){
		alert("apriModulistica - error: " + e.description);
	}	
}



// *************************
// modifica 27-5-16
function canDiagnosiICD9(){
	var bolEsito = false;
	try{
		// controllo se posso mostrare il menu
		var arrayCdc = ['AMB_CDA_PL','AMB_PSI_SV','AMB_PSI_TE'];

		// evito una query e faccio il controllo inline
		if ((top.home.getConfigParam("SITO")=="SAVONA") && (jQuery.inArray( array_reparto[vettore_indici_sel[0]], arrayCdc )>-1)){
			bolEsito = true;			
		}
		else{
			bolEsito = false;
		}
	}
	catch(e){
		alert("Error on canDiagnosiICD9: " +e.description);
	}
	return bolEsito;			
}

function openDiagnosiICD9(){
	var idenEsame = "";
	var urlToCall = "";
	try{
		if (conta_esami_sel()!=1){
			alert(ritornaJsMsg("jsmsgSoloUnEsame"));
			return;
		}		
		idenEsame = array_iden_esame[vettore_indici_sel[0]]	;
		urlToCall = "addOn/diagnosi_icd9/diagnosi_icd9.html?idenEsame=" + idenEsame + "&sorgente=worklist";	
		$.fancybox({
			'href'			: urlToCall,
			'width'				: 900,
			'height'			: 350,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'hideOnOverlayClick':false,
			'hideOnContentClick':false,
			'scrolling' : 'yes',
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			onClosed: function() {
				aggiorna();
			}			
		});		
		return;
		
		var finestra = window.open(urlToCall,"wndICD9","top=0,left=0,width=850,height=300,status=yes,scrollbars=yes");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(urlToCall,"wndICD9","top=0,left=0,width=850,height=300,status=yes,scrollbars=yes");
		}
	}
	catch(e){
		alert("Error on openDiagnosiICD9: " +e.description);
	}
}
// *************************
// modificato 9-6-16
function canAssociate(){
	var idenEsame;
	var bolEsito = false;
	try{
		if (conta_esami_sel()==1){
			idenEsame = stringa_codici(array_iden_esame).split("*")[0];
			try{
				rs=top.executeQuery('worklist_main.xml','canAssociate',[idenEsame]);
				if (rs.next()){
					if ((rs.getString("int_est")!="E")||(rs.getString("cod_dec_pro")=="LEA")||(rs.getString("cod_dec_tick")=="S")){
						bolEsito = true;
					}
				}
			}catch(e){alert("Errore canAssociate\n" + e.description); }				
		}
	}
	catch(e){
		alert("Error on canAssociate: " +e.description);
	}		
	return bolEsito;
}
// *************************