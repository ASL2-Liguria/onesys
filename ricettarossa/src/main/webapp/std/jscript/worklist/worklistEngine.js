// ************************************
// funzioni per la selezione riga
// JavaScript Document
// JavaScript Document
var timer_resize_tab_header
var timeout_resize_tab_header = 300;


var vettore_indici_sel = new Array();
var old_selezionato = -1;
var oldStyle;


var dimFramesetSenzaInfoEsame = "0,*,0";
// devo ridimensionarlo in base allo spazio disponibile
// (availHeight - topFrame(filtri) - 20) / 2
var dimFramesetConInfoEsame = "";

// handle finestra della consolle
var hndConsolleRefertazione

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
	if (document.all.oTable.rows(indice).style.backgroundColor == sel){
		document.all.oTable.rows(indice).style.backgroundColor = desel;
		rimuovi_indice(indice);
		}
	else{
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		nuovo_indice_sel(indice);
		 if ((old_selezionato!=-1)&&(old_selezionato!=indice)){
			  document.all.oTable.rows(old_selezionato).style.backgroundColor = desel;
			  rimuovi_indice(old_selezionato);
		   }
	 }
	old_selezionato = indice;
}

// funzione ILLUMINA multiplo
function illumina_multiplo(indice){
	
	var resto=0;
	var bolEnableAlternateColors 


	resto = (indice)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}
	
	if (document.all.oTable.rows(indice).style.backgroundColor == sel){
		// deseleziona
		rimuovi_indice(indice);
		if (bolEnableAlternateColors!="S"){
			document.all.oTable.rows(indice).style.backgroundColor = desel;
		}
		else{

			if (resto!=0){
				// dispari
				document.all.oTable.rows(indice).style.backgroundColor = oddRowColor ;
			}
			else{
				//pari
				document.all.oTable.rows(indice).style.backgroundColor = evenRowColor ;
			}
		}
	}
	else{
		// seleziona
		nuovo_indice_sel(indice);		
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		auto_deselezione_paz_div(indice)
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
		document.all.oTable.rows(myIndice).style.backgroundColor = col_over ;
	}
}

function rowSelect_out(myIndice){
	
	var resto=0;
	var bolEnableAlternateColors 


	resto = (myIndice)%2;
	try{
		bolEnableAlternateColors = enableAlternateColors;
	}
	catch(e){
		bolEnableAlternateColors="N";
	}	
	
	if (!arrayContieneElemento(vettore_indici_sel,myIndice)){
		if (bolEnableAlternateColors!="S"){
			document.all.oTable.rows(myIndice).style.backgroundColor = desel ;
		}
		else{
			if (resto!=0){
				// dispari
				document.all.oTable.rows(myIndice).style.backgroundColor = oddRowColor ;
			}
			else{
				//pari
				document.all.oTable.rows(myIndice).style.backgroundColor = evenRowColor ;
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
for (i=0;i<vettore_indici_sel.length;i++){
	selezionati ++;
	if (codici_esami_sel.toString()==''){
		codici_esami_sel = vettore[vettore_indici_sel[i]];
	}
	else{
		codici_esami_sel = codici_esami_sel + '*' + vettore[vettore_indici_sel[i]];
	}
}
return codici_esami_sel;
}


// in base alla serie di esami.iden (splittati da *)
// passati come parametro viene ritornata l'informazione
// relativa e corrispondente all'array richiesto
// esempio: passo esami.iden = 1 , 'array_iden_esame ' come input e 'array_cod_esa' come output
// verrà ritornato il cod_esa preso da array_cod_esa relativo a quell'esame.iden
function ritornaInfoEsame(valore, vettoreInput, vettoreOutput){
	var vettoreValori
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
				};
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

/*Funzione Modifica Anagrafica*/
/*
function modAnag(valore)
{
	var idenAnag = '';
    var readOnly = '';
	idenAnag = array_iden_anag[valore];
    if(idenAnag == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
    varAnag = window.open('','wndSchedaAnag','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	readOnly = array_readonly[valore];
    document.frmAnag.hIdenAnag.value = idenAnag;
    document.frmAnag.readOnly.value = readOnly;
    document.frmAnag.submit();
}

*/

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
			;
		}
	}
	if (iden_anag==""){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	
	if(isLockPage('SCELTA_ESAME', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg("a_readonly"));
		return;
	}
	
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	// rimappo la form
	document.frmEsame.Hiden_anag.value = iden_anag;
	document.frmEsame.Hiden_esame.value = "";
	document.frmEsame.tipo_registrazione.value = "I";		
	document.frmEsame.action = 'sceltaEsami';
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
	
	if(isLockPage('ACCETTAZIONE_PRENOTATO', codice, 'ESAMI'))
	{
		alert(ritornaJsMsg("a_readonly"));
		return;
	}
	
	document.frmEsame.action = "accettazioneEsame";
	document.frmEsame.Hiden_esame.value = codice;
	
	var finestra = window.open("","wndSchedaEsame","top=0,left=0,width=600,height=150,status=yes,scrollbars=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","wndSchedaEsame","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.frmEsame.submit();
}


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
	
	if(isLockPage('ASSOCIA_ESAME', codice, 'ESAMI'))
	{
		alert(ritornaJsMsg("a_readonly"));
		return;
	}
	
	document.frmEsame.action = "sceltaEsami?next_servlet=associaEsame&Hiden_sal=" + sala;
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
	parent.parent.hideFrame.apri_attesa();
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
	
	if(stringaIdenEsa==""){return;}
	//controllo obbligatorietà
	if (baseUser.OB_ESECUZIONE=="S"){
		// controllo siano stati eseguiti gli esami
		if (foundInStato(stringaIdenEsa,"E") || foundInStato(stringaIdenEsa,"S")){
			return true;
		}
		else{
			return false;
		}
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
	if ((basePC.RICERCA_KEYIMAGES=="S")&&(bolRefertaEsamiMetodicheDiverse)){
		// metodiche differenti e ricerca immagini attivata
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


// funzione che controlla gli esami hanno
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

// funzione che ritorna la presenza o meno
// di una lettera dello stato nel campo stato
// true: trovato	false: NON trovato
function foundInStato(stringaIdenEsa, carattereStato){
	
	var stringaStato = "";
	var vettoreStato;
	var i= 0;
	if (carattereStato==""){return;}
	stringaStato = ritornaInfoEsame(stringaIdenEsa, array_iden_esame, array_stato);
	vettoreStato = stringaStato.split("*");
	for (i=0;i<vettoreStato.length;i++){
		if (vettoreStato[i].replace(carattereStato,"").length!=vettoreStato[i].length){
			// trovato
			return true;
		}
	}
	return false;
	
}

function resetVariableOpenModeConsole(){
	// reset variabile apertura stato console
	bolOpenConsoleInReadOnlyMode = false;
	document.frmReferta.HopenConsoleInReadOnlyMode.value = "N";
	// **************************************
}



// function per refertare
function referta(){
	var stringa_iden_esame="";
	var num_esami_selezionati = 0;
	var iden_ref = "";
	var bolByPassAllCheckForAutoDriving_LOCAL = false;
	
	resetVariableOpenModeConsole();
	// ***********
	bolByPassAllCheckForAutoDriving_LOCAL = bolByPassAllCheckForAutoDriving;
	bolByPassAllCheckForAutoDriving = false;
	// ***********
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
		
	}
	stringa_iden_esame = stringa_codici(array_iden_esame);
	// controllo per EMPOLI
	// controllo solo uno dei record scelti
	// perchè appartenenti allo stesso paziente
	
	if(isLockPage('REFERTA', stringa_iden_esame.toString().split("*")[0], 'ESAMI'))
	{	
		// controllo se è stato refertato
		idenRef = ritornaInfoEsame(stringa_iden_esame,array_iden_esame ,array_iden_ref);
		if ((idenRef==-1)||(idenRef==0)){
			// non è refertato
			alert(ritornaJsMsg("jsmsgNonRefertato"));
			return;		
		}	
		// controllo che sia refertato
		if (array_iden_ref==-1){
			// NON è refertato quindi mi blocco...
			return;
		}
		// apro in sola lettura
		bolOpenConsoleInReadOnlyMode = true;
		document.frmReferta.HopenConsoleInReadOnlyMode.value = "S";
		// ***************************** 
		// se è non è già  refertato NON aprire neanche la console
	}	
	// ***********************
	
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
		parent.parent.hideFrame.apri_attesa();
		// scarico il frame di sotto
		// per non aver + sessioni di msg aperta
		if (bolInfoEsameAperto){
			apriChiudiInfoReferto();
		}
		document.frmReferta.submit();
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
	document.frmDefinitivo.idenEsame.value = stringa_iden_esame
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
			document.all.oTable.rows(vettore_indici_sel[i]).style.backgroundColor = desel
			rimuovi_indice(vettore_indici_sel[i])
			// torno indietro di uno per non perdermi gli altri elementi
			if (vettore_indici_sel.length>1){
				i = i -1
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
		easterEgg.document.write("<html><body oncontextmenu='javascript:return false;' background='imagexPix/wallpaper/easter_egg.jpg'></body></html>")
	}
	
	return true; // return false to cancel key 
} 

function initGlobalObject(){
	try{
		window.onunload = function scaricaFrameset(){scaricaWorklist();};
		initbaseGlobal();
		initbaseUser();
		initbasePC();
		// chiudo eventuale finestra di attesa aperta	
		parent.parent.hideFrame.chiudi_attesa();
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
			;
		}
		// gestore eventi
		try{
			if (document.layers) { 
			   document.captureEvents(Event.KEYPRESS); 
			} 	
			document.onkeypress = keyHandler;
		}
		catch(e){;}
		// carico info esame / referto
		caricaInfoEsame()
		// ridimensionamento tabheader
		resizeTabHeader();
		startResizeTabHeaderOnTheFly();
		// collassa le righe
		//collapseAllRows();
		try{
			if ((baseUser.WORKLIST_REFRESH!="")&&(baseUser.WORKLIST_REFRESH!="0")){
				attivaRefreshAutomaticoWorklist();
			}
		}
		catch(e){
			;
		}
		
		// carica layer per spostamento colonne
		try{
			initProcedureCreateLayerSortingColumns();
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
			;
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
		//ppppp = window.open("getimagefromdb?accNum=1325440&sopUID=sop_A&seriesUID=series_A&studyUID=study_A","","top=0,left=0, width = 500, height = 400, status=yes");
		
		// questa chiamata DEVE essere sempre l'ultima
		forceCommitToDb();
		// ****
	}
	catch(e){
		alert("iniGlobalObjectError - Error: " + e.description);
	}
	finally{
		;
	}
}

// funzione
// che in base allo spazio
// visibile del frame ridimensiona
// "al volo" i tabheader affinchè
// si riescano a vedere 
function resizeTabHeader(){
	var containerPulsanti = CSSRule('TABLE.classTabHeader TD.classButtonHeaderContainer');
	var middleHeader = CSSRule('TABLE.classTabHeader TD.classTabHeaderMiddle');
	var headerTable = CSSRule('TABLE.classTabHeader');
	var larghezzaMenuVerticale = top.document.all.oFrameset.cols.split(",")
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
    var bolEsisteFrame = false
	var codiceAnag = "";
	var codiceEsame = "";
	var sringaToLoad ="";
	var oggettoFrame
	var idDefaultTabulator="";
	
	// controllo se frame è aperto
	// contrariamente non carico nulla
	if (!bolInfoEsameAperto){
		return;
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
	if (bolEsisteFrame){
		// controllo che non ci sia + di un esame seleazionato
		/*if (conta_esami_sel()!=1){
			// NB il codice dell'errore
			// deve essere quello configurato in LINGUE
			// per la servlet errorMsg
			sringaToLoad = "errorMsg?ricarica=N&caricaOnTop=N&errore=lblSoloUnEsame"
			parent.worklistInfoEsame.document.location.replace (sringaToLoad);
			return;
		}*/				
		// verifico se non è attiva la chat
		// e non faccio nulla
		if (parent.worklistInfoEsame.activeTabulator=="idChatTabulator"){
			// notificare che 
			parent.parent.hideFrame.showTimeoutWindow(250, 80,"Warning", ritornaJsMsg("jsmsgWarnChat"), 4000, true)	;	
			return;
		}
		// ****
		codiceAnag = stringa_codici(array_iden_anag);
		codiceEsame = stringa_codici(array_iden_esame);
//		if ((codiceAnag =="")||(codiceEsame=="")){return;}
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
		document.frmTabulator.submit();
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


// ****************************************************
// *********** Integrazione PACS **********************
// ****************************************************
// funzione che fai i 
// primi controlli per sincronizzare le
// immagini con il pacs
//@param pacsType: individua il tipo di pacs con una costante 
//@param additionalParameters: indica eventuali parametri opzionali
function syncToPacs(pacsType,additionalParameters)
{
	var stringa_iden_esame="";
	var strAccession_number = "";
	var strAETITLE = "";
	var strReparto = "";
	var strPatId = ""
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
		var AEdiversi = 0
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
		parent.parent.hideFrame.basePacsStudy.ACCNUM = strAccession_number;
		parent.parent.hideFrame.basePacsStudy.AETITLE = strAETITLE;
		parent.parent.hideFrame.basePacsStudy.REPARTO = strReparto;
		parent.parent.hideFrame.basePacsStudy.PATID = strPatId;
		// *****
		parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION",pacsType,additionalParameters);
		parent.parent.hideFrame.sendToPacs("SHOWSTUDY", pacsType, additionalParameters);
	}
	catch(e){
		alert("syncToPacs - Error: "+ e.description);
	}
}

// ***********
// vedere se tenere o meno
// ***********
function closeExamOnPacs(){
		parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION","jsMEDIPRIME","");
}



/**
* funzione che controlla se è stato
* superato il limite di record
* visualizzabili per la wk corrente
*/

function controlloLimiteRecord(){
	var intLimiteRecord
	
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
		;
	}
	
	
}

// funzione
// chiamata sull'ordinamento
// per colonna
function loadWaitWindow(){
	parent.parent.hideFrame.apri_attesa();
}


// **************************
// ******** AJAX ************
// **************************

function callCheckLockEsami(valore){

	var parametro = "";
	
	// mi baso sul primo esame
	// selezionato
	functionToCallAfterCheckLock = "refertaSubmit('"	+valore+"')"	;
	//esiste referto controllo
	parametro = valore;	
	try{
		ajaxLockManage.checkLockRecordReferto(parametro,callbackCheckLock)
	}
	catch(e){
		alert("callCheckLockEsami - " + e.description)
	}
}

// funzione di callback
function callbackCheckLock(errore){
	
	//errore così codificato
	// LOCK*iden_per*tipo*descr errore
	
	var funzione = "";
	var bolContinua = false;
	var listaInfoErrore
	
	
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
				// inibisco totalmente l'apertura della console
				// ATTENZIONE !!! Modificare affinchè si apra in sola lettura !!
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
	
	var vettoreDimensioni
	var strDimensioni = "";


/*	if (conta_esami_sel()==0){
		return;
	}*/
	try{
		try{
			strDimensioni = parent.document.all.oFramesetWorklist.rows;
		}
		catch(e){
			strDimensioni = parent.document.all.oFramesetRicercaPaziente.rows;
		}
		vettoreDimensioni = strDimensioni.split(",");
		if (bolInfoEsameAperto){
			// scarico quello che era aperto
			// mi serve per non aver + di una sessione di 
			// messaggistica eventualmente aperta
			parent.worklistInfoEsame.document.location.replace ("blank.htm");
			// frame aperto 
			// quindi lo chiudo
			try{
				parent.document.all.oFramesetWorklist.rows = vettoreDimensioni[0] +","+ dimFramesetSenzaInfoEsame;
			}
			catch(e){
				parent.document.all.oFramesetRicercaPaziente.rows = vettoreDimensioni[0] +",*,0";
			}
			bolInfoEsameAperto = false;
		}
		else{
			// frame chiuso
			// quindi lo apro
			try{
				var altezza = parseInt(screen.availHeight - parseInt(vettoreDimensioni[0]));
				altezza = parseInt((altezza - 20)/2);
				dimFramesetConInfoEsame = "0,*," + altezza;
				parent.document.all.oFramesetWorklist.rows = vettoreDimensioni[0] +","+  dimFramesetConInfoEsame;		
			}
			catch(e){
				parent.document.all.oFramesetRicercaPaziente.rows = vettoreDimensioni[0] +",*,200";
			}
			bolInfoEsameAperto = true;
			caricaInfoEsame();
		}
	}
	catch(e){
		;
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
	
	var vettoreDimensioni
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
		;
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
		selectOnlyFirstIndexed()
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
	var strOutput = ""
	try{
		strOutput = parent.parent.barFrame.getStartInitTabulator();
	}
	catch(e){
		;
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
		alert("forceCommitToDb - Error: " + e.description)
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
		alert("replyQueryCommand - Error: " + e.description)
	}
	finally{
		functionCallBack ="";
	}
	
}

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
		
		for(i = 0; i < achkfirma.length && chkfirma; chkfirma = (achkfirma[i++] == 'S'));
		
		if(!chkfirma)
		{
			alert('Selezionare solo firmati!');
		}
		else
		{
			param = 'sp_InviaEsamiTarmed@';
			param += 'IString@';
			param += id_esa;
			
			functionDwr.launch_sp(param, chk_rinvio_tarmed)
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
		if(aRet[0] == 'ERROR')
			alert(aRet[1]);
	}
}
