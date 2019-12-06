// definisco gli array che conterranno
// le info degli oggetti da associare

// oggetto generico che
// individua 2 proprietà
// codice, quantità

var objTarMed

// variabile che indica il codEsa dell'esame da associare
var codEsa_toLink ="";

// array che conterrà la lista
// di oggetti elemTarMed
var arrayTarMed_toLink = new Array();

var arrayTarMed_toLink_x_Massi;

//id tooltip
var idToolTip = "idToolTip";
var timerToolTip = 1000;
var objTimer;
// indica se la query di insert è finita
// boolean utile per il referesh alla fine
var bolInsertDone = false;
// indica quale funzione si deve
// richiamare dopo la command query
// (usata nella funzione di callback di callQueryCommand)
var functionCallBack = "";
// numero di caratteri per limitazione descr Esami in tabella
// ovviamente a video
var globalNumCaratteriToLimitEsaDescr = 20;
// numero di caratteri per limitazione descr tarmed in tabella
// ovviamente a video
var globalNumCaratteriToLimitTarMedDescr = 75;
// suffisso che viene attaccato nel caso in cui venga fatta una 
// troncatura del testo
var globalSuffixForPadding = "...";


// costruttore
// delloggetto
function elemTarMed(codice,qta,descrizione, iden, editabile, iden_father, codice_father, descrizione_father, tipoTarMed, tipoProvenienza, gruppo, idenET, esami_tarmed_iden_father)
{
	this.codice = codice;
	this.qta = qta;
	this.descrizione = descrizione;
	this.iden = iden;
	this.gruppo = gruppo;
	// il tipo indica se è una prestazione base
	// in tal caso vale B
	this.tipoTarMed = tipoTarMed;
	// indica il tipo di Provenienza (E:esterna , I: Interna)
	this.tipoProvenienza = tipoProvenienza;
	this.editabile = editabile;
	this.iden_father = iden_father;
	this.codice_father = codice_father;
	this.descrizione_father = descrizione_father ;	
	// indica se è collegato a qualche esamiTarmed specifico 
	// derivante quindi da un preload o se è stato 
	// caricato a runtime
	this.idenET = idenET;
	this.esami_tarmed_iden_father = esami_tarmed_iden_father;
}

// ritorna il testo
// completo (nnon limitato)
// in base al codice passato
function getFullTextByCode(arrayCode, arrayText, selectedCode){
	var	strOutput = "";
	var dimensione ;
	var i=0;
	

	if (selectedCode!=""){
		dimensione = arrayCode.length;

		for (i=0;i<dimensione;i++){
			if (arrayCode[i].toString()==selectedCode.toString()){
				strOutput = arrayText[i];
				break;
			}
		}	
	}

	return strOutput;
}

// funzione
// che ritorna l'indice 
// di un array in base
// VALE SOLO PER l'array che contiene gli oggetti elemTarMed da associare
function getIndexByValue(arrayIn,valore){

	var	indiceOut = -1;
	var dimensione ;
	var i=0;
	dimensione = arrayIn.length;
	for (i=0;i<dimensione;i++){
		if (arrayIn[i].codice==valore){
			indiceOut=i;
			break;
		}
	}
	return indiceOut;
}

// funzione che rimuove un 
// elemento dall'array in base all'indice
// e restituisce una array compatto (e non sparso)
function removeElementFromArray(arrayIn, indice){
	var i=0;
	var arrayOutput = new Array(arrayIn.length-1);
	var bolSaltato = false;
	
	for (i=0;i<arrayIn.length;i++){
		if (i==indice){
			bolSaltato = true;
		}
		else{
			if (!bolSaltato){
				arrayOutput[i] = arrayIn[i];
			}
			else{
				arrayOutput[i-1] = arrayIn[i];
			}
		}
	}
	return arrayOutput;
}

function addElementToArray(arrayIn,oggetto){

	var i=0;
	var arrayOutput = new Array(arrayIn.length);
	
	
	for (i=0;i<arrayIn.length;i++){
		arrayOutput[i] = arrayIn[i];
	}
	arrayOutput[arrayIn.length]=oggetto;
	return arrayOutput;
}

// funzione che in base al valore di input
// restituisce l'occorrenza corrispettiva di un altro array
function ritornaInfoArray(valore, vettoreInput, vettoreOutput){
	var vettoreValori
	var stringaOutput="";
	var i=0, j=0;

	if (valore==""){return;}
	vettoreValori = valore.toString().split("*");
	for (i=0;i<vettoreValori.length;i++){
		for (j=0;j<vettoreInput.length;j++){
			if (vettoreValori[i]==vettoreInput[j]){
				if (stringaOutput==""){
					stringaOutput = vettoreOutput[j];
				}
				else{
					stringaOutput = stringaOutput + '*' + vettoreOutput[j];
				};
			}
		}
	}
	return stringaOutput;
}


// ****************** MAIN ***************
function initGlobalObject(){
	
	var oggetto;

	try{
		window.onunload = function scaricaPagina(){scarica();};	
		oggetto = document.getElementById("idSelTarMed");
		if (oggetto){
			oggetto.ondblclick = function(){selezionaTarMed();}
			// **** tooltip
			oggetto.oncontextmenu = function(){creaToolTipOnTheFly(idToolTip, getFullTextByCode(array_cod_esa_tarmed,array_descr_tarmed,this.value));}
			//oggetto.onmouseout = function(){distruggiToolTip(idToolTip);}
			// ******				
		}
		oggetto = null;
		oggetto = document.getElementById("idSelEsa");	
		if (oggetto){
			oggetto.ondblclick=function(){selezionaEsame();}
			oggetto.oncontextmenu = function(){creaToolTipOnTheFly(idToolTip, getFullTextByCode(array_cod_esa_tab_esa,array_descr_tab_esa,this.value));}			
		}
		oggetto = null;
		oggetto = document.getElementById("idRadioTarMedCodice");
		if (oggetto){
			oggetto.onclick=function(){if (document.frmMain.txtCercaTarMed.value!=""){cercaTarMed();}}

		}
		oggetto = null;
		oggetto = document.getElementById("idRadioTarMedDescrizione");
		if (oggetto){
			oggetto.onclick=function(){if (document.frmMain.txtCercaTarMed.value!=""){cercaTarMed();}}
		}
		oggetto = null;
		oggetto = document.getElementById("idRadioTabEsaCodice");
		if (oggetto){
			oggetto.onclick=function(){if (document.frmMain.txtCerca.value!=""){cerca();}}			
		}
		oggetto = null;
		oggetto = document.getElementById("idRadioTabEsaDescrizione");
		if (oggetto){
			oggetto.onclick=function(){if (document.frmMain.txtCerca.value!=""){cerca();}}
		}
		// linkare gestione eventi su onclick per controlli tipo provenienza
		oggetto = null;
		oggetto = document.getElementById("idRadioTarMedInterni");
		if (oggetto){
			oggetto.onclick=function(){cercaTarMed();}
		}		
		oggetto = null;
		oggetto = document.getElementById("idRadioTarMedEsterni");
		if (oggetto){
			oggetto.onclick=function(){cercaTarMed();}
		}			
		// *****
		
	}
	catch(e){
		;
	}
	fillLabels(arrayLabelName,arrayLabelValue);
	initAndDisableControls(tipoAssociazione);
}

// funzione che saibilita certi controlli
// in base alla provenienza della chiamata
function initAndDisableControls(valore){
	
	var oggetto ;
	var i=0;
	// fare controlli per disabilitazione nel caso 
	// di provenire da cambio associazione Esame - tarmed
	if (tipoAssociazione.toString().toUpperCase()=="ESAMI"){
		// disabilito certi controlli
		oggetto = document.getElementById("idBtFind");
		if (oggetto){
			oggetto.style.display = "none";
		}
		oggetto = document.getElementById("idBtAll");
		if (oggetto){
			oggetto.style.display = "none";
		}
		oggetto = document.getElementById("idbtIncludiEsa");
		if (oggetto){
			oggetto.style.display = "none";
		}		
		oggetto = document.getElementById("idRadioTabEsaCodice");
		if (oggetto){
			oggetto.disabled = true;
		}				
		oggetto = document.getElementById("idRadioTabEsaDescrizione");
		if (oggetto){
			oggetto.disabled = true;
		}		
		oggetto = document.getElementById("idCerca");
		if (oggetto){
			document.frmMain.txtCerca.disabled = true;
		}				
		// carico esame
		cerca('ALL');
		// disabilito lista esami	
		oggetto= document.getElementById("idSelEsa");
		if (oggetto){
			oggetto.disabled = true;
		}		
		// disabilito pulsanti di reset
		oggetto= document.getElementById("idBtResetEsame");
		if (oggetto){
			oggetto.style.display = "none";
		}	
		oggetto= document.getElementById("idBtResetAll");
		if (oggetto){
			oggetto.style.display = "none";
		}			
		
		
		// seleziono esame
		//selezionaEsame();
		document.frmListRefresh.numPre.value = numPre;
		// rimappo pulsante di registrazione
		
		// carico i TarMed già precaricati
		//var array_codice_tarMed_toPreLoad = new Array('ABC','DEF','LMN');
		//var array_descrizione_tarMed_toPreLoad = new Array('TARMED1','TARMED GHI','DESCR LMNO');
		//var array_iden_tarMed_toPreLoad = new Array(1,21,41);
		//var array_quantita_tarMed_toPreLoad = new Array(1,2,4);	
		// var array_iden_tarMed_father_toPreLoad
		// var array_codice_tarMed_father_toPreLoad
		// var array_descrizione_tarMed_father_toPreLoad

		try{
			if(typeof array_codice_tarMed_toPreLoad != "undefined") {
				for (i=0;i<array_codice_tarMed_toPreLoad.length;i++){
					var elem = new elemTarMed(array_codice_tarMed_toPreLoad[i],array_quantita_tarMed_toPreLoad[i],array_descrizione_tarMed_toPreLoad[i],array_iden_tarMed_toPreLoad[i], true, array_iden_tarMed_father_toPreLoad[i], array_codice_tarMed_father_toPreLoad[i], array_descrizione_tarMed_father_toPreLoad[i], array_tipo_tarMed_toPreLoad[i], array_provenienza_tarMed_toPreLoad[i], array_gruppo_tarMed_toPreLoad[i], array_idenET_toPreLoad[i], array_esami_tarmed_iden_father_toPreLoad[i]);
					// carico array globale
					arrayTarMed_toLink = addElementToArray(arrayTarMed_toLink,elem);
				}
			}
		}
		catch(e){
			// non esistono tarmed precaricati
		}
		//  aggiunta 20110110
		// ********************************************************
		arrayTarMed_toLink_x_Massi = arrayTarMed_toLink;
		// ********************************************************		
		// creo tabella
		creaTabellaAssociazioni();
		// carico label nel frame sottostante
		try{
			var labelPrestazione = parent.frames["frameMiddleAssociaTarMed"].document.getElementById("lblPrestazione");
			if (labelPrestazione){
				// se si vuole si può
				// provare a caricar il num_pre nell'header table di sotto
				//labelPrestazione.innerText = document.getElementById("lblEsa2Link").innerText;
				labelPrestazione.innerText = numPre;
			}
		}
		catch(e){;}
		
	}
	
}



// ricerca
// e riempie il combo degli ESAMI
function cerca(valore){
	
	var indiceArray = 0;
	var valoreDaRicercare = "";
	var radioGrp ;
	
	if (valore=="ALL"){
		// ricarica tutti 
		fill_select("idSelEsa", array_cod_esa_tab_esa,array_descr_tab_esa,globalNumCaratteriToLimitEsaDescr, globalSuffixForPadding);		
		//HideLayer("divTabEsa");
		return;
	}
	valoreDaRicercare = document.frmMain.txtCerca.value;
	if (valoreDaRicercare==""){
		alert(ritornaJsMsg("jsmsgNoInfoEsa"));
		return;
	}
	radioGrp = document.frmMain.radioEsa;
	for (var i = 0; i< radioGrp.length; i++) {
		if (radioGrp[i].checked) {
			indiceArray = i;
		}
	} 	
	
	fill_selectWithCheck("idSelEsa", array_cod_esa_tab_esa,array_descr_tab_esa,indiceArray,true,valoreDaRicercare,false, globalNumCaratteriToLimitEsaDescr, globalSuffixForPadding);	
	showMsgIfNotFound("idSelEsa");	

}

// ricerca
// e riempie il combo dei TARMED
function cercaTarMed(valore){
	var indiceArray = 0;	
	var valoreDaRicercare = "";	
	var radioGrp ;	
	var tipoProvenienza = "";
	var sourceEventObjectID = "";
	var sourceEventObjectName = "";	
	
	// elemento che ha generato l'evento
	try{
		sourceEventObjectID = event.srcElement.id ;
		sourceEventObjectName = event.srcElement.name ;
	}
	catch(e){
		// la funzione è stata richiamata manualmente
		// e non attravverso la gestione di eventi
	}
	if (valore=="ALL"){
		// ricarica tutti 
		//  ATTENZIONE: DEVO filtrare per gruppo
		fill_select_tarmed("idSelTarMed", array_cod_esa_tarmed,array_descr_tarmed);
		return;
	}

	valoreDaRicercare = document.frmMain.txtCercaTarMed.value;
	// controllo se devo fare check contenuto campo	
	if (sourceEventObjectName=="radioTarMedTipoProvenienza"){
		if (valoreDaRicercare==""){
			alert(ritornaJsMsg("jsmsgNoInfoTarMed"));
			return;
		}
	}
	// FILTRARE in base alla provenienza
	radioGrp = document.frmMain.radioTarMedTipoProvenienza;	
	for (var i = 0; i< radioGrp.length; i++) {
		if (radioGrp[i].checked) {
			tipoProvenienza = radioGrp[i].value;
		}
	} 		
	// ****************
	radioGrp = document.frmMain.radioTarMed;
	for (var i = 0; i< radioGrp.length; i++) {
		if (radioGrp[i].checked) {
			indiceArray = i;
		}
	} 	
	fill_selectWithCheck_tarmed("idSelTarMed", array_cod_esa_tarmed,array_descr_tarmed,indiceArray,true,valoreDaRicercare,false);		
	showMsgIfNotFound("idSelTarMed");
}


// funzione che ritorna a video 
// un msg nel caso in cui non sia stato trovato
// nulla
function showMsgIfNotFound(idSel){
	var oggetto;
	
	if (idSel==""){return;}
	try{
		oggetto = document.getElementById(idSel);
		if (parseInt(oggetto.length)<=0){
			alert(ritornaJsMsg("jsmsgNotFound"));			
		}
	}
	catch(e){
		alert("showMsgIfNotFound - " + e.description);
	}
}


// ************* FUNCTION IntercettaTasti
function intercetta_tasti(){
	 if (window.event.keyCode==13)
	 {
		 window.event.returnValue=false;
		 cerca('');
	 }
}

// ************* FUNCTION IntercettaTasti
function intercetta_tastiTarMed(){
	 if (window.event.keyCode==13)
	 {
		 window.event.returnValue=false;
		 cercaTarMed('');
	 }
}


// includo esame per l'associazione
function selezionaEsame(){
	var oggetto
	var descrizione ="";
	var idenTabEsa = "";	
	var codice = "";
	
	codice = getValue ("idSelEsa");
	descrizione = ritornaInfoArray(codice, array_cod_esa_tab_esa, array_descr_tab_esa);
	if (descrizione==""){
		return;
	}
	
	oggetto = document.getElementById("lblEsa2Link");
	if(oggetto){
		// rimappare la label lblEsa2Link
		oggetto.innerText = descrizione;
	}

	// rimappare la variabile codEsa_toLink che contiene il codice dell'esame
	codEsa_toLink = getValue("idSelEsa");

	// aggiorno la lsta sottostante
	idenTabEsa = ritornaInfoArray(codEsa_toLink, array_cod_esa_tab_esa, array_iden_tab_esa);
	if ((idenTabEsa!="") && (tipoAssociazione.toString().toUpperCase()!="ESAMI")){
		document.frmListRefresh.hidWhere.value = "WHERE IDEN_TAB_ESA= " + idenTabEsa.toString();
		document.frmListRefresh.submit();
		// è necessario ricaricare al volo i codici TarMed
		// dell'esame Selezionato, se ne ha 
		// devo rimappare gli array di preload
		callGetTarMedObject(idenTabEsa);
		
	}
	else{
		document.frmListRefresh.numPre.value = numPre;
		//document.frmListRefresh.submit();
	}
	
	
}
// includo tarMed
// nella tabella sottostante
function selezionaTarMed(){
	
	var codice = "";
	var descrizione = "";
	var i = 0;
	var idenTarMed = "";
	var tipoTarMed = "";
	var tipoProvenienzaTarMed = "";
	var gruppoTarMed = "";

	var indiceElemento=-1;
	

	codice = getValue("idSelTarMed");
	descrizione = ritornaInfoArray(codice, array_cod_esa_tarmed, array_descr_tarmed);
	idenTarMed = ritornaInfoArray(codice, array_cod_esa_tarmed, array_iden_tarmed);
	tipoTarMed = ritornaInfoArray(codice, array_cod_esa_tarmed, array_tipo_tarmed);
	tipoProvenienzaTarMed = ritornaInfoArray(codice, array_cod_esa_tarmed, array_provenienza_tarmed);
	gruppoTarMed =  ritornaInfoArray(codice, array_cod_esa_tarmed, array_gruppo_tarmed);
	if (tipoTarMed.toString().toUpperCase()=="B"){
		// inserisco
		// un tarMed base
		// quindi verifico se ne esiste già uno
		if (checkExistTarMedBase(idenTarMed)){
			alert(ritornaJsMsg("jsmsgBaseDoppio"));
			return;
		}		
	}
	if (codice==""){
		return;
	}
	//	 controllo se è già stato inserito
	// in tal caso aumento di uno la quantità
	indiceElemento=getIndexByValue(arrayTarMed_toLink,codice)
	if (indiceElemento==-1){
		// NON TROVATO
		var elem = new elemTarMed(codice,1,descrizione,idenTarMed, true,"","","",tipoTarMed, tipoProvenienzaTarMed, gruppoTarMed, -1, "");
		// carico array globale
		arrayTarMed_toLink = addElementToArray(arrayTarMed_toLink,elem);
	}
	else{
		// trovato
		// aggiungo la qta
		if (arrayTarMed_toLink[indiceElemento].editabile){
			if (arrayTarMed_toLink[indiceElemento].tipoTarMed.toString().toUpperCase()!="B"){
				arrayTarMed_toLink[indiceElemento].qta = parseInt(arrayTarMed_toLink[indiceElemento].qta) + 1;
			}
		}
	}
	// **********************
	creaTabellaAssociazioni();

	// le righe della tabella che contiene i tarMed con le quantità
}

function creaTabellaAssociazioni(){
	var arrayInfoTarMed;
	// cancello tutte le righe
	cancellaRighe();
	// creo al volo (cancellandole e ricreandole)
	for (i=0;i<arrayTarMed_toLink.length;i++){
		// ATTENZIONE
		arrayInfoTarMed = new Array(arrayTarMed_toLink[i].iden, arrayTarMed_toLink[i].codice,arrayTarMed_toLink[i].descrizione,arrayTarMed_toLink[i].qta,i,arrayTarMed_toLink[i].editabile, arrayTarMed_toLink[i].iden_father, arrayTarMed_toLink[i].descrizione_father, arrayTarMed_toLink[i].codice_father, arrayTarMed_toLink[i].tipoTarMed, arrayTarMed_toLink[i].tipoProvenienza, arrayTarMed_toLink[i].gruppo);
		creaRiga("idTableTarmMed2Esa",arrayInfoTarMed);
	}

}

// funzione che rimuove le righe
// dalla tabella di associazione
function cancellaRighe(){
	
	var i ;
	var oggetto;
	
	oggetto = document.getElementById("idTableTarmMed2Esa");
	if (oggetto){
		if (oggetto.rows.length>1){
			for (i=oggetto.rows.length-1;i>0;i--){
				oggetto.deleteRow(i);
			}
		}
	}
	
	

}

// funzione che inserisce una riga nella
// tabella individuata da idTable
// arrayValori contiene i vari valori (codici, descr, qta, indice riga di inserimento, editabile, idenTarMedFather, descrTarMedFather, codiceFather, tipoTarMed)
function creaRiga(idTable,arrayValori){
	
	var oggetto ;
	var myTR;
	var myTD;
	var bottone;
	var divContainer 
	var divTmp;
	var strTmp="";
	var indiceRigaTabella;
	var strmp= "";	
	var bolEditabile = false;
	var comboFather;
	var oOption;
	var i=0;
	
	// verifico esista la tabella
	if (idTable==""){return;}
	oggetto = document.getElementById(idTable);
	if (oggetto){
		indiceRigaTabella = arrayTarMed_toLink.length;
		// creo riga
		myTR = AppendRow(oggetto);
		myTR.style.backgroundColor = desel;
		myTR.id = "myTR" + indiceRigaTabella;
		myTR.attachEvent('onmouseover',function(){try{event.srcElement.parentNode.style.backgroundColor = col_over;}catch(e){;}});
		myTR.attachEvent('onmouseout',function(){try{event.srcElement.parentNode.style.backgroundColor = desel;}catch(e){;}});
		// codice
		myTD = AppendCell(myTR);
		myTD.innerText = arrayValori[1];
		myTD.style.width="100px";
		if (arrayValori[9].toString().toUpperCase()=="B"){
			myTD.className = "prestazioneBase";
		}		
		myTD = null;
		// descrizione
		// ATTENZIONE limitare dimensione descr TarMed a video e metterlo nel ToolTip
		myTD = AppendCell(myTR);
		myTD.innerText = limitazioneTesto(arrayValori[2],globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);
		myTD.title = arrayValori[2];
		if (arrayValori[9].toString().toUpperCase()=="B"){
			myTD.className = "prestazioneBase";
		}
		myTD.style.width="250px";		
		myTD = null;		
		// *****************************************
		// ************ INSERIRE TIPO PROVENIENZA
		// ****** ATTENZIONE NON CABLARE LE ETICHETTE ******
		myTD = AppendCell(myTR);
		if (arrayValori[10]=="E"){
			myTD.innerText = ritornaJsMsg("lblradioTarMedEsterni");
		}
		else{
			// usare alert(ritornaJsMsg(			
			myTD.innerText = ritornaJsMsg("lblradioTarMedInterni");			
		}
		myTD.style.width="250px";		
		myTD = null;		
		// *****************************************
		// ***************** GRUPPO
		myTD = AppendCell(myTR);
		myTD.innerText = limitazioneTesto(arrayValori[11],globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);
		myTD.style.width="100px";		
		myTD = null;			
		
		// qta
		myTD = AppendCell(myTR);
		myTD.innerText = arrayValori[3];
		myTD.style.width="80px";
		myTD = null;		
		// combo per tarmed father, x ora scrivo solo la descrizione
		myTD = AppendCell(myTR);		
		comboFather = document.createElement("SELECT");
		comboFather.id = "idComboTarMedFather";
		for (i=0;i<arrayTarMed_toLink.length;i++){
			if (i==0){
				//creo elemento vuoto
				oOption = document.createElement("Option");	
				oOption.text = "";
				oOption.value = "";		
				comboFather.add(oOption);	
				oOption = null;		
				// escludo me stesso
				if (arrayValori[0].toString()!=arrayTarMed_toLink[i].iden.toString()){
					// escludo quelli base
					if (arrayTarMed_toLink[i].tipoTarMed.toString().toUpperCase()!="B"){
						oOption = document.createElement("Option");				
						// carico tutti i TarMed (????) 
						// con preselezionato quello padre (se esiste)
//						oOption.text = arrayTarMed_toLink[i].descrizione.toString();
						oOption.text = limitazioneTesto(arrayTarMed_toLink[i].descrizione.toString(),globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);
						oOption.value = arrayTarMed_toLink[i].iden.toString() + "@@" +  arrayTarMed_toLink[i].codice.toString();
						comboFather.add(oOption);	
						if (arrayTarMed_toLink[i].iden.toString()==arrayValori[6].toString()){
							oOption.selected = true;
						}
						oOption = null;				
					}
				}
			}
			else{
				if (arrayValori[0].toString()!=arrayTarMed_toLink[i].iden.toString()){
					if (arrayTarMed_toLink[i].tipoTarMed.toString().toUpperCase()!="B"){
						oOption = document.createElement("Option");				
						// carico tutti i TarMed (????) 
						// con preselezionato quello padre (se esiste)
						//oOption.text = arrayTarMed_toLink[i].descrizione.toString();
						oOption.text = limitazioneTesto(arrayTarMed_toLink[i].descrizione.toString(),globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);						
						oOption.value = arrayTarMed_toLink[i].iden.toString() + "@@" +  arrayTarMed_toLink[i].codice.toString();
						comboFather.add(oOption);	
						if (arrayTarMed_toLink[i].iden.toString()==arrayValori[6].toString()){
							oOption.selected = true;
						}
						oOption = null;
					}
				}
			}
		}
		comboFather.attachEvent('onchange',function(){try{changeInfoFather(arrayValori[4],event.srcElement.options(event.srcElement.selectedIndex).value, event.srcElement.options(event.srcElement.selectedIndex).text);}catch(e){alert("onchange - " + e.description);}});	
	//	comboFather.attachEvent('onchange',function(){alert(arrayValori[4] + " " +event.srcElement.options(event.srcElement.selectedIndex).value);});			
		if (arrayValori[9].toString().toUpperCase()=="B"){
			// attenzione: modifica
			// fatta da Fabio perchè il codice base
			// deve essere possibile associarlo a qualcosa
			//comboFather.disabled = true;
		}

		myTD.appendChild(comboFather);
		comboFather = null;
		myTD.style.width="250px";
		myTD = null;			
		// tools - pulsante per qta+1 , qta-1, eliminare elemento TarMed
		// controllo se è editabile
		bolEditabile = arrayValori[5];
		if (bolEditabile){
			myTD = AppendCell(myTR);
			strTmp = "";
			strTmp = "<A href='javascript:changeQta("+ arrayValori[4] +",1);'><img src='imagexPix/button/mini/btPlus.gif' border='0' onmouseover=\"javascript:this.src='imagexPix/button/mini/btPlus_over.gif'\" onmouseout=\"javascript:this.src='imagexPix/button/mini/btPlus.gif'\" /></A>";
			strTmp += "<A href='javascript:changeQta("+ arrayValori[4] +",-1);'><img src='imagexPix/button/mini/btMinus.gif' border='0' onmouseover=\"javascript:this.src='imagexPix/button/mini/btMinus_over.gif'\" onmouseout=\"javascript:this.src='imagexPix/button/mini/btMinus.gif'\" /></A>"
			strTmp += "<A href='javascript:removeQta("+ arrayValori[4] +");'><img src='imagexPix/button/mini/closing.gif' border='0' onmouseover=\"javascript:this.src='imagexPix/button/mini/closingOver.gif'\" onmouseout=\"javascript:this.src='imagexPix/button/mini/closing.gif'\"/></A>"
			myTD.insertAdjacentHTML("afterBegin", strTmp)
			myTD.style.width="70px";
		}
		else{
			myTD = AppendCell(myTR);
			myTD.innerText = " ";
			myTD.style.width="70px";
			myTD = null;		
		}
	}
}



// funzione che registra i cambiamenti di "padre"
// dal combo
// sintassi di idenCodiceFather   iden@@codice
function changeInfoFather(indice, idenCodiceFather, descrFather){

	try{
		arrayTarMed_toLink[indice].iden_father = idenCodiceFather.toString().split("@@")[0];	
		arrayTarMed_toLink[indice].codice_father = idenCodiceFather.toString().split("@@")[1];			
		arrayTarMed_toLink[indice].descrizione_father = descrFather;
	}
	catch(e){
		alert("changeInfoFather - " + e.description);
	}
	//alert(arrayTarMed_toLink[indice].iden_father + " " + arrayTarMed_toLink[indice].codice_father + " " + arrayTarMed_toLink[indice].descrizione_father);	
}

// funzione che controlla
// se esiste già un codice TarMed con quell'iden (valore)
// tra quelli selezionati in lista
function checkExistTarMedBase(valore){
	var bolEsito = false;
	var i = 0;
	
	for (i=0;i<arrayTarMed_toLink.length;i++){
		if (arrayTarMed_toLink[i].iden.toString().toUpperCase()==valore.toString().toUpperCase()){
			bolEsito = true;
			break;
		}
	}
	
	return bolEsito;
	
}


function AppendRow(srcTable)
{
	if(srcTable != null)
	{
		return srcTable.insertRow();
	}
	else
	{
		alert("Error while creating table. Cause: Container Table is null!");
	}
}

function AppendCell(srcRow)
{
	if(srcRow != null)
	{
		return srcRow.insertCell();
	}
	else
	{
		alert("Error while creating table. Cause: Container row is null!");
	}
}

function getButton(idValue, hrefValue, className){

	// esempio
	//	<div class='pulsante'><a id='oLinkPsw' href='#'></a></div>
	
	var divObject;
	var aObject;

	divObject =  document.createElement("DIV");
	divObject.className = className;	
	aObject = document.createElement("A");
	aObject.id = idValue;
	aObject.href = hrefValue;
	divObject.appendChild(aObject);

	return divObject;
}



function changeQta(indiceRiga, valore){
	
	try{
		if (arrayTarMed_toLink[indiceRiga].tipoTarMed.toString().toUpperCase()!="B"){
			arrayTarMed_toLink[indiceRiga].qta = parseInt(arrayTarMed_toLink[indiceRiga].qta) + valore;
			if (arrayTarMed_toLink[indiceRiga].qta<1){
				arrayTarMed_toLink[indiceRiga].qta = 1;
			}
		}
	}
	catch(e){
		alert("changeQta - " + e.description);	
	}
	creaTabellaAssociazioni();
}

// funzione che rimuove elemento da array;
function removeQta(indiceRiga){

	try{
		// verifico che la riga
		// che si vuole cancellare non 
		// sia padre di altri TarMed
		if (isFatherOfAny(arrayTarMed_toLink[indiceRiga].iden)){
			alert(ritornaJsMsg("jsmsgDelFather"));	
			return;
		}
		arrayTarMed_toLink = removeElementFromArray(arrayTarMed_toLink,indiceRiga);
		creaTabellaAssociazioni();
	}
	catch(e){
		alert("removeQta - " + e.description)
	}
	
}


// in base ad un TarMed.iden
// verifico se è padre di qualche TarMed in lista
function isFatherOfAny(idenTarMed){
	var bolEsito = false;
	var i = 0;
	
	for (i=0;i<arrayTarMed_toLink.length;i++){
		if (arrayTarMed_toLink[i].iden_father.toString()!=""){
			if (arrayTarMed_toLink[i].iden_father.toString().toUpperCase()==idenTarMed.toString().toUpperCase()){
				// esiste un codice tarMed figlio 
				// di quello che si vuole cancellare
				bolEsito = true;
				break;
			}
		}
	}
	
	return bolEsito;
	
}


// effettuo controllo per correttezza dati
// NON deve esistere alcun record che abbia 
// specificato un TarMed padre che non sia 
// a sua volta definito nella lista!!
function controlloRelazioniPadreFiglio(){
	var strOutput = "OK";
	var i=0, j=0;
	var bolTrovatoPadre = false;
	
	/*
	for (var k=0;k<arrayTarMed_toLink.length;k++){
		alert("descrizione : " + arrayTarMed_toLink[k].descrizione + " padre: "+ arrayTarMed_toLink[k].descrizione_father);
	}*/

	// arrayTarMed_toLink contiene tutte le info
	// relative ai TarMed inseriti
	for (i=0;i<arrayTarMed_toLink.length;i++){
		if ((arrayTarMed_toLink[i].iden_father.toString()!="")&&(arrayTarMed_toLink[i].iden_father.toString()!="-1")){
			bolTrovatoPadre = false
			for (j=0;j<arrayTarMed_toLink.length;j++){
				// escludo lo  stesso iden
				if (arrayTarMed_toLink[j].iden.toString()!=arrayTarMed_toLink[i].iden.toString()){
					if (arrayTarMed_toLink[i].iden_father.toString()==arrayTarMed_toLink[j].iden.toString()){
						// trovato padre
						bolTrovatoPadre = true;
						break;
					}
				}
			}
			// controllo se ho trovato o meno il padre
			if (!bolTrovatoPadre){
				strOutput = arrayTarMed_toLink[i].descrizione;
				break;
			}
		}
	}
	// ***********************
	return strOutput;
	
}
// registra l'associazione tra 
// esame e tarmed
function registraAssociazione(){

	var idenTabEsa = "";
	var strEsito=""
	// controllo se è stato selezionato un esame
	if (tipoAssociazione!="ESAMI"){
		if (codEsa_toLink==""){
			alert(ritornaJsMsg("jsmsgNoEsa"));
			return;
		}
	}
	// controllo se è stato selezionato almeno un tramed
	if (arrayTarMed_toLink!=null){
		if (arrayTarMed_toLink.length<1){
			alert(ritornaJsMsg("jsmsgNoTarMed"));			
			return;
		}
	}
	else{
		alert(ritornaJsMsg("jsmsgNoTarMed"));		
		return;
	}
	// effettuo controllo per correttezza dati
	// NON deve esistere alcun record che abbia 
	// specificato un TarMed padre che non sia 
	// a sua volta definito nella lista!!
	strEsito = controlloRelazioniPadreFiglio();
	if (strEsito.toString().toUpperCase()!="OK"){
		// ritornerà l'errore da visualizzare
		alert(ritornaJsMsg("jsmsgRelationError") + " " + strEsito);		
		return;
	}
	// **********************
	idenTabEsa = ritornaInfoArray(codEsa_toLink, array_cod_esa_tab_esa, array_iden_tab_esa);
	if (tipoAssociazione=="ESAMI"){
		// sto modificando i TarMed degli esami
		// e non delle PRESTAZIONI (intese come record di tab_esa)
		functionCallBack = "doInsertTarMedForEsami()";
		doDeleteTarMedFromEsami();
	}
	else{
		// associazione classica
		if (idenTabEsa !=""){
			// controllo se non esiste già un'associazione
			callExistRecord(idenTabEsa);
		}
		else{
			alert(ritornaJsMsg("jsmsgNoEsa"));
			// errore
			return;
		}
	}
}


//funzione che resetta l'esame 
// o anche tutti i codici tarmed selezionati
// fino a quel momento
function resetTableTarMed2Esa(valore){

	if (valore=="ESAME"){
		codEsa_toLink ="";
			oggetto = document.getElementById("lblEsa2Link");
			if(oggetto){
				// rimappare la label lblEsa2Link
				oggetto.innerText = "";
			}
	}
	else if (valore=="ALL"){
		codEsa_toLink = "";
		oggetto = document.getElementById("lblEsa2Link");
		if(oggetto){
			// rimappare la label lblEsa2Link
			oggetto.innerText = "";
		}		
		arrayTarMed_toLink = new Array();
		cancellaRighe()
	}
	// Tutto OK
	// devo ora controllare se esiste già
	// un associazione per questo esame
	// in tal caso chiedo se voglio 
	// sovrascriverla
}


// riporto le funzioni qui
// e non uso quelle comuni perchè
// in questo caso NON faccio uso
// dell'array di appoggio vettore_indici_sel
function rowSelect_over(myIndice){
	try{
		document.all.idTableTarmMed2Esa.rows(myIndice).style.backgroundColor = col_over ;
	}
	catch(e){
		;
	}
}

function rowSelect_out(myIndice){
	try{
		document.all.idTableTarmMed2Esa.rows(myIndice).style.backgroundColor = desel ;
	}
	catch(e){
		;
	}
}


// funzione
// che scarica tutti gli
// oggetti instanziati
function scarica(){
	try{
		// dealloco oggetto 
		ajaxRecordCheck = null;		
	}
	catch(e){
		;
	}
	try{
		ajaxQueryCommand = null;
	}
	catch(e){
		;
	}
}

//  nel caso di tipoAssociazione = ESAMI
// la funzione cancella tutte le associazioni
// fatte nella tabella ESAMI_TARMED
function doDeleteTarMedFromEsami(){
	var sql ="";
	var idenTabEsa = "";
	
	if (tipoAssociazione == "ESAMI"){
		if (numPre==""){
			alert(ritornaJsMsg("jsmsgEsaNotValid"));
			return;
		}
		sql = "Delete from ESAMI_TARMED ";
		sql += " where NUM_PRE=" + numPre;
		// eseguo query di comando
		callQueryCommand(sql)		
	}
}

//  nel caso di tipoAssociazione = ESAMI
// la funzione inserisce i record
// nella tabella ESAMI_TARMED
function doInsertTarMedForEsami(){
	var sql = "";
	var idenTabEsa = "";
	var strTmp = "";
	var strEsamiIden = "";
	var strEsami_tarmed_iden_father = "";
	var numeroEsami = "";
	
	var toMassimo_esamiIden = "";
	var toMassimo_tarMedIdenFather = "";
	
	
	if (tipoAssociazione == "ESAMI"){
		if (numPre==""){
			alert(ritornaJsMsg("jsmsgEsaNotValid"));
			return;
		}
		bolInsertDone = false;		
		functionCallBack = "";
		numeroEsami = document.getElementById("idSelEsa").length;
		for (var i=0;i<arrayTarMed_toLink.length;i++){
			sql = "INSERT INTO ESAMI_TARMED ";
			strEsamiIden = "";		
			strEsami_tarmed_iden_father = "";
			for (var k=0;k<array_idenET_toPreLoad.length;k++){
				if (array_idenET_toPreLoad[k] == arrayTarMed_toLink[i].idenET){
					// sono uguali a quelli precaricati
					// prendo l' esame.iden collegato
					strEsamiIden = array_esami_iden_tarMed_toPreLoad[k];
					strEsami_tarmed_iden_father = array_esami_tarmed_iden_father_toPreLoad[k];
				}
			}
 			sql += "(NUM_PRE, TARMED_IDEN, QUANTITA, TARMED_IDEN_FATHER, ESAMI_IDEN, NUMERO_ESAMI, TIPO, ESAMI_TARMED_IDEN_FATHER) VALUES (";
			sql += numPre.toString() + "," + arrayTarMed_toLink[i].iden + "," + arrayTarMed_toLink[i].qta;
			if (arrayTarMed_toLink[i].iden_father.toString()!=""){
				// i padri
				sql += "," + arrayTarMed_toLink[i].iden_father.toString();
				if (toMassimo_tarMedIdenFather==""){
					toMassimo_tarMedIdenFather = arrayTarMed_toLink[i].iden_father.toString();
				}
				else{
					toMassimo_tarMedIdenFather += "," + arrayTarMed_toLink[i].iden_father.toString();
				}
			}
			else{
				sql += ", -1";
				if (toMassimo_tarMedIdenFather==""){
					toMassimo_tarMedIdenFather = "-1";
				}
				else{
					toMassimo_tarMedIdenFather += ",-1";
				}				
			}			
			// salvo anche esami.iden
			// num_esami e tipo
			if (strEsamiIden==""){strEsamiIden = "null";}
			sql += "," + strEsamiIden;
			if (numeroEsami==""){numeroEsami="0";}
			sql += "," + numeroEsami;
			sql += ",'" + arrayTarMed_toLink[i].tipoTarMed + "'";
			if (strEsami_tarmed_iden_father==""){strEsami_tarmed_iden_father = "null";}
			// NO non devo passargli questo valore perchè 
			// non è corretto (non aggiornato)
			//sql += "," + strEsami_tarmed_iden_father;
			sql += ", null";
			sql += ")"
			//alert(sql);
			callQueryCommand(sql);
		} // fine ciclo for
		// ************************************************
		/*for (var i=0;i<arrayTarMed_toLink_x_Massi.length;i++){
			if (toMassimo_tarMedIdenFather==""){
				toMassimo_tarMedIdenFather = arrayTarMed_toLink_x_Massi[i].iden_father.toString();
			}
			else{
				toMassimo_tarMedIdenFather += "," + arrayTarMed_toLink_x_Massi[i].iden_father.toString();
			}
		}*/
		// ************************************************
		// infine devo chiamare la procedura di massimo per mettere a posto il tutto
		toMassimo_esamiIden = stringa_all_codici(array_esami_iden_tarMed_toPreLoad,",");
		alert(toMassimo_tarMedIdenFather);
		alert(toMassimo_esamiIden);
		// lancio SP_AGGIUSTA_TARMED_IDEN_FATHER 
		sql = "begin SP_AGGIUSTA_TARMED_IDEN_FATHER('" + toMassimo_esamiIden + "','" + toMassimo_tarMedIdenFather + "'); end;";
		//alert(sql);
		callQueryCommand(sql);		
		// *************************************************************************
		bolInsertDone = true;	
	}
}

// effettua la cancellazione
// tramite una funzione AJAX che
// restituisce "OK"
// oppure "KO*descrizione errore"
// vengono cancellate le associazioni dalla tabella TAB_COD_EST_ESA
function doDelete(){
	var sql ="";
	var idenTabEsa = "";
	
	idenTabEsa = ritornaInfoArray(codEsa_toLink, array_cod_esa_tab_esa, array_iden_tab_esa);
	if (idenTabEsa==""){
		alert(ritornaJsMsg("jsmsgEsaNotValid"));
		return;
	}
	sql = "Delete from tab_cod_est_esa ";
	sql += " where iden_tab_esa=" + idenTabEsa;
	// eseguo query di comando
	callQueryCommand(sql)	
}


function doInsert(){
	var sql = "";
	var idenTabEsa = "";
	var strTmp = "";
	
	bolInsertDone = false;
	idenTabEsa = ritornaInfoArray(codEsa_toLink, array_cod_esa_tab_esa, array_iden_tab_esa);
	if (idenTabEsa==""){
		alert(ritornaJsMsg("jsmsgEsaNotValid"));
		return;
	}	
	functionCallBack = "";	
	for (var i=0;i<arrayTarMed_toLink.length;i++){
		sql = "INSERT INTO TAB_COD_EST_ESA ";
		sql += "(IDEN_TAB_ESA, IDEN_TAB_COD_EST, QUANTITA, IDEN_TAB_COD_EST_FATHER) VALUES (";
		sql += idenTabEsa.toString() + "," + arrayTarMed_toLink[i].iden + "," + arrayTarMed_toLink[i].qta;
		if (arrayTarMed_toLink[i].iden_father.toString()!=""){
			sql += "," + arrayTarMed_toLink[i].iden_father.toString();
		}
		else{
			sql += ",null";
		}
		sql += ")"
//		alert(sql);
		callQueryCommand(sql);
		parent.frameMiddleAssociaTarMed.aggiorna();		
	}
	bolInsertDone = true;
}

// *************************************
// **************************
// ******** AJAX ************
// **************************

// controlla se utente esiste
function callExistRecord(valore){


	if (valore==""){return;}
	try{
		ajaxRecordCheck.ajaxExistRecord("DATA","TAB_COD_EST_ESA","where iden_tab_esa =" + valore ,replyExistRecord)
	}
	catch(e){
		alert("callExistRecord - " + e.description)
	}
}

// funzione di callback
var replyExistRecord = function (returnValue){
	if (returnValue){
		// esiste già l'associazione
		// chiedo se si vuole fare update
		if (confirm("Associazione già esistente. Continuare con l'aggiornamento ?")){
			functionCallBack = "doInsert()";
			// update
			doDelete();
		}
	}
	else{
		// nessuna funzione da chiamare dopo
		functionCallBack = "";
		// TUTTO ok NON esiste alcuna associazione doppia
		// registro associazione
		doInsert();
	}
}

// esegue query di comando
function callQueryCommand(sql){
	if (sql==""){
		return;
	}
	try{
		dwr.engine.setAsync(false);	
		ajaxQueryCommand.ajaxDoCommand("DATA",sql ,replyQueryCommand)
	}
	catch(e){
		alert("callQueryCommand - " + e.description)
	}	
	finally{
		dwr.engine.setAsync(true);
	}
}

var replyQueryCommand = function (returnValue){
	
	var feedback;
	var strToRun = "";
	var myTimer;
	
	feedback = returnValue.split("*");
	if (feedback[0].toString().toUpperCase()!="OK"){
		// azzero funzione di callback 
		// da chiamare per interrompere la catena in caso di errore
		functionCallBack = "";
		alert("Error: " + feedback[1]);
	}
	else{
		if (bolInsertDone){
			// aggiorno il frame sottostante
			strToRun = "parent.frameMiddleAssociaTarMed.aggiorna();";
			try{
				myTimer = setTimeout(strToRun, 2000);
			}
			catch(e){
				alert("Error on Timeout");
			}
		}
		if (functionCallBack!=""){
			eval(functionCallBack)
		}
	}
	
}

// il parametro valore indica TABESA.IDEN
function callGetTarMedObject(valore){
	if (valore==""){return;}
	try{
		ajaxGetTarMedObject.getListTarMedByEsamiIden("DATA",valore,replyGetTarMedObject)
	}
	catch(e){
		alert("callGetTarMedObject - " + e.description);
	}
}

// verrà restitiuto
// un array di stringhe 
// ognie elemento formattato come 
// iden@@codice@@descrizione@@quantita@@iden_father@@codice_father@@descrizione_father@@tipoTarMed@@provenienza@@gruppo
var replyGetTarMedObject = function (returnValue){
	var i 
	var oggetto 
	var lista
	
	
	if (returnValue!=null){
		// azzero elementi
		arrayTarMed_toLink = new Array();
		for (i=0;i<returnValue.length;i++){
			lista = returnValue[i].split("@@");
			// ATTENZIONE
			// metto di default che non si può togliere
			var elem = new elemTarMed(lista[1],lista[3],lista[2],lista[0],true,lista[4],lista[5],lista[6], lista[7], lista[8], lista[9], -1, "");
			// carico array globale
			arrayTarMed_toLink = addElementToArray(arrayTarMed_toLink,elem);
		}
		// creo tabella
		creaTabellaAssociazioni();			
	}
	else{
		// nessun elemento trovato
		// opp.errore
		// azzero elementi		
		arrayTarMed_toLink = new Array();
		creaTabellaAssociazioni();			
	}
}

// ********** ATTENZIONE
// la funzione è stata riportata da optionJsUtil.js
// perchè DEVE essere personalizzata per l'esigenza specifica
// di filtrare su molteplici valori. Quindi gli è stato anche cambiato nome
// funzione che riempie un combo o listbox passandogli degli 
// array, previo azzeramento del combo.
// Si differenzia dal precedente perchè 
// durante il caricamento effettua una scelta
// sull'option da caricare o meno
// indiceArrayPerControllo: vale o 0 o 1 (indica se il
// controllo deve essere effettuato su arrayValue o arrayDescr )
// flgInside: vale true se si vuole ricercare all'interno o meno
// valoreConfronto: valore col quale effettuare il controllo
// flgCaseSensitive: vale true se si vuole tenere conto del case sensitive
// NB. deve essere cambiata in base al tipo di provenienza (Esterna / Interna) 
function fill_selectWithCheck_tarmed(elemento, arrayValue,arrayDescr, indiceArrayPerControllo,flgInside, valoreConfronto, flgCaseSensitive)
{
	var i
	var num_elementi = 0;
	var object
	var bolTrovato = false;
	var arrayToCompare = null;
	var tipoProvenienza = "";
	var radioProv ;	
	var tipoGruppo = "";	
	
	// controllo che non ci siano differenze di dimensioni
	if (arrayValue.length != arrayDescr.length){
		alert("Error on array's size");
		return;
	}
	num_elementi = arrayValue.length 
	i = num_elementi;
	object = document.getElementById(elemento);
	if (object){
		while (i>-1)
		{
			object.options.remove(i);
			i--;
		}
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			// resetto variabili
			bolTrovato = false;
			arrayToCompare = null;
			// ****			
			// verifico controllo su provenienza
			radioProv = document.frmMain.radioTarMedTipoProvenienza;
			for (var k = 0; k< radioProv.length; k++) {
				if (radioProv[k].checked) {
					tipoProvenienza = document.frmMain.radioTarMedTipoProvenienza[k].value;
				}
			} 			
			// controllo anche su gruppo
			tipoGruppo = getValue("idSelGruppo");			
			
			if (array_provenienza_tarmed[i] == tipoProvenienza){
				if ((array_gruppo_tarmed[i] == tipoGruppo)||(tipoGruppo=="")){				
					if (parseInt(indiceArrayPerControllo)==0){
						// lavoro su arrayValue 
						arrayToCompare = arrayValue;
					}
					else{
						// lavoro su arrayDescr 	
						arrayToCompare = arrayDescr;				
					}
					if (flgInside){
						if (flgCaseSensitive){
							if(arrayToCompare[i].toString().indexOf(valoreConfronto.toString())>-1){
								bolTrovato = true;
							}
							else{
								bolTrovato = false;
							}					
						}
						else{
							if(arrayToCompare[i].toString().toUpperCase().indexOf(valoreConfronto.toString().toUpperCase())>-1){
								bolTrovato = true;
							}
							else{
								bolTrovato = false;
							}					
						}
					}
					else{
						// match preciso
						if (flgCaseSensitive){
							if (arrayToCompare[i].toString()==valoreConfronto.toString()){
								bolTrovato = true;
							}
							else{
								bolTrovato = false;						
							}
						}
						else{
							if (arrayToCompare[i].toString().toUpperCase()==valoreConfronto.toString().toUpperCase()){
								bolTrovato = true;
							}
							else{
								bolTrovato = false;						
							}					
						}
					}
					
					// effettuo controllo
					if (bolTrovato){
						var oOption = document.createElement("Option");
						//oOption.text = arrayDescr[i];
						oOption.text = limitazioneTesto(arrayValue[i] + " - " + arrayDescr[i],globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);
						oOption.value = arrayValue[i];
						object.add(oOption);
					}
				} // fine contorllo su gruppo
			} // fine controllo su prvenienza
		}
	}
}


// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// NB ATTENZIONE anche questa funzione deve essere cambiata
// affinchè filtri anche per il tipo di provenienza (E , I)
function fill_select_tarmed(elemento, arrayValue,arrayDescr)
{
	var i
	var num_elementi = 0;
	var object
	var tipoProvenienza = "";
	var radioProv ;
	var tipoGruppo = "";
	
	// controllo che non ci siano differenze di dimensioni
	if (arrayValue.length != arrayDescr.length){
		alert("Error on array's size");
		return;
	}
	num_elementi = arrayValue.length 
	i = num_elementi;
	object = document.getElementById(elemento);
	if (object){
		while (i>-1)
		{
			object.options.remove(i);
			i--;
		}
		radioProv = document.frmMain.radioTarMedTipoProvenienza;
		for (var k = 0; k< radioProv.length; k++) {
			if (radioProv[k].checked) {
				tipoProvenienza = document.frmMain.radioTarMedTipoProvenienza[k].value;
			}
		} 
		// controllo su gruppo
		tipoGruppo = getValue("idSelGruppo");
		
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			// verifico controllo su provenienza
			if (array_provenienza_tarmed[i] == tipoProvenienza){
				if ((array_gruppo_tarmed[i] == tipoGruppo)||(tipoGruppo=="")){
					var oOption = document.createElement("Option");
					//oOption.text = arrayDescr[i];
					oOption.text = limitazioneTesto(arrayValue[i] + " - " + arrayDescr[i],globalNumCaratteriToLimitTarMedDescr,globalSuffixForPadding);
					oOption.value = arrayValue[i];
					object.add(oOption);				
				}
			}
		}
	}
}


function creaToolTipOnTheFly(id, valoreToolTip){
	// posizione layer tooltip
	var posDivLeft 
	var posDivTop 
	// posisione cursore
	var posCurX 
	var posCurY
	// oggetto Tooltip
	var objDivToolTip 
	
	distruggiToolTip(id);

	if (valoreToolTip==""){return;}	
	

	posCurX = document.body.scrollLeft + event.clientX;
	posCurY = document.body.scrollTop + event.clientY;
	

	var objDivToolTip=document.createElement("DIV");
	objDivToolTip.setAttribute("id",id);
	document.body.appendChild(objDivToolTip);
	objDivToolTip.innerText = valoreToolTip;
	objDivToolTip.style.position = "absolute";
	objDivToolTip.style.left = posCurX;
	objDivToolTip.style.top = posCurY;
	objDivToolTip.style.visibility = "visible";	
	//objDivToolTip.className = "ContextNull";
	objTimer = setTimeout("distruggiToolTip(" + id + ")",timerToolTip);


}

function distruggiToolTip(valore){
	
	try{
		clearTimeout(objTimer);

		// elimino div precedente (mettere timer che lo faccia)
		if (valore ==""){return;}
		
		var object = document.getElementById(valore);
		if (object){
			object.removeNode(true);
		}	
	}
	catch(e){
		alert("distruggiToolTip - " + e.description);
	}	
}

function stringa_all_codici(vettore, elementoSplit){
	
	var codici = '';
	for (i=0;i<vettore.length;i++){
		if (codici.toString()==''){
			codici = vettore[i];
		}
		else{
			codici = codici + elementoSplit + vettore[i];
		}
	}
	return codici;
}