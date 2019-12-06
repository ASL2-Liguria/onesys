// JavaScript Document
var console_schedaDaCaricare = "";

// ***********************
// modifica 30-04-2015
var glbMedIniziativa = false;
// ***********************
function initSchedaInConsole(){
	var i=0;
	var bolSchedaExist = false;
	var oggetto ;
	var spanFormula	= "";

	
	// da deprecare
	// *****************
	console_schedaDaCaricare = "";
	// *****************
	// controllo se esiste almeno una scheda da associare
	try{
		//alert("###initSchedaInConsole ");
		if (array_iden_esame.length != listaSchedaConsole.length){
			alert("Numero lista schede funzionali non corretto!");
			return;
		}
		//alert("###loop for ");
		for (i=0;i<listaSchedaConsole.length;i++){
			if (listaSchedaConsole[i]!=""){
				bolSchedaExist = true;
				break;
			}
		}
		//alert("###bolSchedaExist "+ bolSchedaExist);
		if (bolSchedaExist){
			spanFormula = "<span id='boxOpenExamForm' onclick='javascript:apriSchedaInConsole();' title='Apri Calcolo Formule esame'>&nbsp;</span>";
			// esiste almeno una scheda
			oggetto = document.getElementById("idFormulaPlaceHolder");
			if(oggetto){
				oggetto.innerHTML = spanFormula;
			}
		}
		// "aggiusto" le classi degli esami in base al fatto
		// che posssano avere una scheda associata o meno 
		// e che possa essere compilata o meno
		fixCarouselExamClass();
	}
	catch(e){
		alert("initSchedaInConsole - Error: " + e.description);
	}

}


function fixCarouselExamClass(){
	var i = 0;
	var bolCompiledForm = false;
	var oggetto ;
	try{
		// array_iden_esame		
		// listaIdenEsame_SchedaConsole
		// listaIdenSchedaConsole
		// listaSchedaConsole
		for (i=0; i<listaSchedaConsole.length;i++){
			bolCompiledForm = false;
			if (listaSchedaConsole[i]!=""){
				// Esiste la scheda specifica
				// controllo se esiste l'iden
				if (listaIdenSchedaConsole[i]==""){
					// NON compilata
					bolCompiledForm = false;
					
				}
				else{
					bolCompiledForm = true;
				}
				// trovo esame corrispondente
				oggetto = document.getElementById("imgCarousel_Exam" + listaIdenEsame_SchedaConsole[i]);
				// gli cambio la classe
				if (oggetto){
					if (!bolCompiledForm){
						oggetto.className = "classImmagineCarosello_incompleto";
						oggetto.src = "imagexPix/button/mini/infoIncompleto.png";
					}
					else{
						oggetto.className = "classImmagineCarosello_compilato";	
						oggetto.src = "imagexPix/button/mini/infoCompilato.png";						
					}
				}				
			}
		}
		
	}
	catch(e){
		alert("fixCarouselExamClass - Error: " + e.description);
	}
}

function getScheda_e_iden_da_idenEsa(idenEsa){
	var i=0;
	var strOutput = "";
	try{
		for (i=0;i<listaIdenEsame_SchedaConsole.length;i++){
			if (listaIdenEsame_SchedaConsole[i] == idenEsa){
				// trovato !
				strOutput = listaIdenSchedaConsole[i] + "*" + listaSchedaConsole[i] ;
				break;
			}
		}
	}
	catch(e){
		alert("getScheda_e_iden_da_idenEsa - Error: "+ e.description);
	}
	return strOutput;
}

// funzione chiamata in  automatico
// commonProcedures.js quando si è salvata
// la scheda collegata e si deve quindi aggiornare
// il nuovo valore di idenScheda
function updateIdenScheda_by_IdenEsa(idenScheda, idenEsame){
	var i=0;
	try{
		for (i=0;i<listaIdenEsame_SchedaConsole.length;i++){
			if (listaIdenEsame_SchedaConsole[i] == idenEsame){
				listaIdenSchedaConsole[i] = idenScheda;
				break;
			}
		}		
		// in automatico aggiorno lo stato delle classi !
		fixCarouselExamClass();
		// aggiorno tabulatore di sotto
		//caricaBottomTabulator("idInfoProcessedReport");
	}
	catch(e){
		alert("updateIdenScheda_by_IdenEsa - Error: " + e.description);
	}
}

function caricaBottomTabulator(value){
	try{
		if (value==""){return;}
		parent.frameBottomConsolle.caricaTab(value);
	}
	catch(e){
		alert("caricaBottomTabulator - Error: " + e.description);
	}
}

// ATTENZIONE valutare se unificare la gestione dell' apertura
// delle finestre
function apriSchedaInConsole(){
	
	var url = "";
	var timer ;
	var strTmp = "";
	
	try{
		// controllare se esistono più esami 
		// 
		// ATTENZIONE !!!! NON deveo più prendere il primo esame, ipotizzando
		// ce ne sia sempre e solo uno !!!
		// getValue("oEsa_Ref")
		var iden_esame_selezionato = "";
		iden_esame_selezionato = getValue("oEsa_Ref");
		// cambiare anche il riferimento a iden_scheda_in_console e console_schedaDaCaricare !!!
		// basarsi su listaSchedaConsole listaIdenSchedaConsole listaIdenEsame_SchedaConsole
		
		strTmp = getScheda_e_iden_da_idenEsa(iden_esame_selezionato);
		iden_scheda_in_console = strTmp.split("*")[0];
		console_schedaDaCaricare = strTmp.split("*")[1];
		/*alert(iden_esame_selezionato);
		alert(iden_scheda_in_console);
		alert(console_schedaDaCaricare);*/
		switch (console_schedaDaCaricare){
			case "VIEW_ECO_OST_X_CONSOLE":
				url= "esameinfoeco?";
				url += "idenEsa=" + iden_esame_selezionato;
				url += "&idenAnag=" + globalIdenAnag;
				url += "&refreshOnExit=N";				
				if (classReferto.FIRMATO !="S"){
					url += "&readonly=N";
				}
				else{
					url += "&readonly=S";
				}
				var finestra = window.open(url,"wndInfoEcoOst","status=yes,top=0,left=0,width="+ screen.availWidth +", height=" + screen.availHeight+",scrollbars=yes");
				if (finestra){
					finestra.focus();
				}
				else{
					finestra = window.open(url ,"wndInfoEcoOst","status=yes,top=0,left=0,width="+ screen.availWidth +", height=" + screen.availHeight+",scrollbars=yes");
				}	
				timer = window.setTimeout("try{finestra.focus();}catch(e){;})",500);							
				break;
			default:
				url = console_schedaDaCaricare + ".html?iden_esame="+ iden_esame_selezionato + "&iden_anag=" + globalIdenAnag + "&scheda=" + console_schedaDaCaricare + "&iden_scheda=" + iden_scheda_in_console + "&iden_ref=" + classReferto.IDEN + "&ute_mod=" + baseUser.IDEN_PER;
				// aggiungo callback
				url += "&callback=opener.caricaBottomTabulator('idInfoProcessedReport');";  
				// CAMBIARE APERTURA ! Mettere apertura thickbox like 
				var finestra = window.open(url,"","top=0, left=0, width="+ screen.availWidth +", height=" + screen.availHeight+", status=yes, scrollbars=yes");
				if (finestra){
					finestra.focus();
				}
				else{
					finestra = window.open(url,"","top=0, left=0, width="+ screen.availWidth +", height=" + screen.availHeight+", status=yes, scrollbars=yes");			
				}
				timer = window.setTimeout("try{finestra.focus();}catch(e){;})",500);			
				break;
		}

	}
	catch(e){
		alert("apriSchedaInConsole - Error: "  + e.description);
	}
}

// acr/acr_js.js
// JavaScript Document
function initACR() {

document.write('<object classid="clsid:869BE2E1-262D-49B0-901C-14B4DD46A44D" codebase="cab/ACR/ACR.CAB#version=3,0,0,0" Id="ACR">');
document.write('<param name="Enabled" value="-1">');
document.write('<param name="Appearance" value="1">');
document.write('<param name="Codice" value="' + codice + '">');
document.write('<param name="gestione" value="' + gestione + '">');
document.write('<param name="Indirizzo_Ip" value="' + db2xml_path + '">');
document.write('<param name="larghezza" value="' + (screen.height - (screen.height/12)) + '">');
document.write('<param name="altezza" value="' + (screen.width - (screen.width/70)) + '">');
document.write('</object>');

document.ACR.width=screen.width - (screen.width/70);
document.ACR.height=screen.height - (screen.height/12);

}

function apriACR(idenRef,op,codice) {

	wndAnag = window.open("SL_ACROCX?idenRef=" + idenRef + "&ACRopener=" + op + "&codice=" + codice,"","top=200,left=300,width=700,height=745,status=no,scrollbars=no");
}
		
function ACRtoCampo (op) {
	var a ="";
	var campo;

	if (op=='1')
	{
		opener.document.formACR_Cons.Fie_Acr1.value=document.frmID2.hcodice.value;
	}
	if (op=='2')
	{
		opener.document.formACR_Cons.Fie_Acr2.value=document.frmID2.hcodice.value;
	}
	if (op=='3')
	{	
		opener.document.formACR_Cons.Fie_Acr3.value=document.frmID2.hcodice.value;
	}
	self.close();

}

function salvaTab()
{	
	Update.UpdateDB(document.formACR_Cons.combo_scn1.value+"*"+document.formACR_Cons.combo_scn2.value+"*"+document.formACR_Cons.TxtNote.value+"*"+document.formACR_Cons.Fie_Acr1.value+"*"+document.formACR_Cons.Fie_Acr2.value+"*"+document.formACR_Cons.Fie_Acr3.value+"*"+document.formACR_Cons.idenRef.value,close_as);
}

function close_as(Errore)
{
	if (Errore.lenght>3){
		alert(Errore);
	}
	self.close();
}

function caricaCodScie(){}

// consolleZoomFunction

// JavaScript Document

var rightZoomClass="toRight";
var leftZoomClass ="toLeft";

//funzione che ritorna la larghezza del frame di sinistra
function getLeftFrameWidth(){
	return parent.document.all.leftConsolle.width;
}


// ridimensiona il frame di sinistra alla percentuale
// passata come parametro
function resizeLeftFrameToMaxInPercent(percentuale){
	
	var larghezzaFrameSx;
	// ridimensiono Frameset	
	// a circa il 70 per cento
	try{
		if (isNaN(percentuale)){
			return;
		}
		try{
			larghezzaFrameSx = Math.round(parseInt(larghezzaSchermo*percentuale)/100);
		}
		catch(e){
			alert("resizeLeftFrameToMaxInPercent - Error: " + e.description);
		}
		parent.document.all.framesetConsolle.cols=larghezzaFrameSx + " ,*";
		// ridimensiono controllo 
		setReportControlObjectSize(larghezzaFrameSx,getReportControlHeight());
	}
	catch(e){
		alert("resizeLeftFrameToMaxInPercent - Error:" + e.description);
	}
	
	
}

// ridimensiona il frame di destra alla percentuale
// passata come parametro
function resizeRightFrame(dimensione){
	
	var larghezzaFrameSx;
	try{
		if (isNaN(dimensione)){
			return;
		}
		try{
			larghezzaFrameSx = Math.round(parseInt(larghezzaSchermo-dimensione-10));
		}
		catch(e){
			alert("resizeRightFrame - Error: " + e.description);
		}
		parent.document.all.framesetConsolle.cols="*," + dimensione;
		// ridimensiono controllo 
		setReportControlObjectSize(larghezzaFrameSx,getReportControlHeight());
	}
	catch(e){
		alert("resizeRightFrame - Error:" + e.description);
	}	
}


function setZoomClass(valore,classType){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);
	if (objectNode){
		objectNode.className=classType;
	}
}

// funzione che gestisce
// lo zoom del frame di sinistra
function zoomConsolleLeftFrame(){
	objectNode = document.getElementById("divBtZoom");
	if (objectNode){
		if (objectNode.className==leftZoomClass){
			// devo settare pulsante right
			// ZOOM NORMALE
			setZoomClass("divBtZoom",rightZoomClass);
			resizeRightFrame(dimensioneDefaultRightFrame);
		}
		else{
			// ZOOM MAX
			setZoomClass("divBtZoom",leftZoomClass);
			resizeRightFrame(0);
		}
	}
}

// funzione che fa lo zoom
// della parte di refertazione
// ridimensionando al volo 2 layer
function zoomConsolle(){
	ShowHideLayer('divFirstLayout');
	resizeRptCtlAfterCloseLayer('divFirstLayout');
	ShowHideLayer('divSecondLayout');
	resizeRptCtlAfterCloseLayer('divSecondLayout');	
}
 
 
 // checkMN/consolleCheckMN
 
 // funzione che ritorna
// una boolean in base alla 
// modalità degli esami che
// si stanno refertando
// true: esami MN
// false: esami NON mn 
// ************
// accetta come parametri
// l'array contenente le metodiche
function checkModalitaEsami(lista){
	
	var oldMetodica = "-1";
	var esito = true;
	var i = 0;

	try{
		for (i=0;i<lista.length;i++){
			if (lista[i].toString().toUpperCase()!="Z"){
				esito = false;
				break;
			}
		}
	}
	catch(e){
		esito = false;
	}
	return esito;
}

// funzione
// che ritorna l'intestazione 
// del  testo del referto 
// per gli esami MN
function getMNreportHeader(){
	
	var strHeaderReferto ="";
	var i = 0;
	// usare gestione
	// errore try catch
	// nel caso si accedesse a un 
	// array non definito
	try{
		for (var i =0;i<array_descr_esame.length;i++){
			// label esami
			if (baseGlobal.MN_LABEL_ESAMI=="S"){
				strHeaderReferto  = strHeaderReferto + "Esami: " + array_descr_esame[i] + "\r\n";
			}
			// label data esecuzione esame
			if (baseGlobal.MN_DATA_PRESENTE=="S"){
				if (baseGlobal.MN_DATA_A_CAPO=="S"){
					strHeaderReferto  = strHeaderReferto + baseGlobal.MN_LABEL_DATA +" " + iso2data(array_dat_esa[i]) + "\r\n";
				}
				else{
					strHeaderReferto  = strHeaderReferto + baseGlobal.MN_LABEL_DATA + " " +iso2data(array_dat_esa[i]) + "\r\n";					
				}
			}
		}
		for (var i =0;i<array_descr_art.length;i++){
			// materiale
			// array_descr_art
			// array_qta_art
			if (i==0){
				strHeaderReferto = strHeaderReferto + baseGlobal.MN_LABEL_MAT + "\r\n\r\n";
			}
			try{
				if (baseGlobal.MN_ORDINE_MAT=="Q"){
					// prima la quantità
					strHeaderReferto = strHeaderReferto + "- " +array_qta_art[i] + " " + array_descr_art[i] + "\r\n";
				}
				else{
					// prima la descrizione materiale
					strHeaderReferto = strHeaderReferto + "- " + array_descr_art[i] + " " + array_qta_art[i] + "\r\n";
				}
			}
			catch(e){
				;
			}
		}
	}
	catch(e){
		//strHeaderReferto = "Error";
	}
	
	return strHeaderReferto;
}

// funzione che
// che converte la data da formato ISO
// aaaammgg a formato data gg/mm/aaaa
function iso2data(valore){
	if (valore==""){return"";}
	return valore.substr(6,2) + "/" + valore.substr(4,2) +"/" + valore.substr(0,4); 
}

// worklist/consoleEngine

// JavaScript Document
var altezzaSchermo;
var larghezzaSchermo;
var objectReportControl;
var registrazioneEffettuata = false;

// questa variabile NON viene usata col nuovo 
// layout
var dimensioneDefaultRightFrame ="";

// titolo del frameset della console
var framesetTitleConsolePolaris = "_Console";
var toolBarTitle = "_Toolbar";
var timerToolBar ;
var delaySetToolBarOnTop = 2000;
var handleToolbar;

// variabile publica che indica il tipo di action da
// tracciare
var typeUserAction = "CONSOLE";
//
// variabile contenente l'oggetto pacs che deve sincronizzare
var pacsType = parent.opener.top.hideFrame.objectSyncPacs;

// handle finestra di popup
var popup_scandb;

// variabile publica usata solo
// nel caso di tipoModalita = INSERIMENTO
// che contiene il testo del referto inziale
// debitamente processato secondo tab_esa.javaprocessclass
// tramite chiamate ajax
//var initialProcessedTextReport = "";
var arrayInitialProcessedTextReport ;

var j$ = jQuery.noConflict();

// function per il refresh automatico o pilotato della consolle
function aggiorna(){
	document.frmAggiorna.submit();
}
// funzione che aggiorna i precedenti
function aggiornaPrecedenti(){

	var bolEqualToPreviousExams = false;
	// *************************************
	// *************** LOG *****************
	// *************************************
	//LogJavascript.WriteInfo("consolleEngine*Submit frmListaPrecedenti",deallocaLogJavascript);
	// *************************************
	try{document.frmListaPrecedenti.idenRef.value = classReferto.IDEN}catch(e){;}


	try{
		var schedaAssociata = "";
		schedaAssociata = getScheda_e_iden_da_idenEsa(getValue("oEsa_Ref")).strTmp.split("*")[1];
		document.frmListaPrecedenti.schedaEsame.value = schedaAssociata;
	}catch(e){;} 	
	// verifico se il tabulatore attivo è diverso (o nullo al primo caricamento)
	// dai precedenti. Nella situazione dei casi rilevanti caricati NON
	// aggiorno nulla
	
	try{
		if (parent.frameTopConsolle.currentTabulator){
			
				bolEqualToPreviousExams = true;
			
		}	
		else{
			bolEqualToPreviousExams = true;
		}
	}
	catch(e){
		// non eiste elemento quindi sono allo startup
		// faccio refresh
		bolEqualToPreviousExams = true; 
	}
	//alert(bolEqualToPreviousExams);
	if (bolEqualToPreviousExams){
		document.frmListaPrecedenti.submit();
	}

}

function initPublicVariables(){
	// GESTIONE BOOLEAN CONSOLE
	try{
		parent.opener.top.hideFrame.bolOpenedConsole = true;
	}
	catch(e){
		alert("Can't set openedConsole flag - Error: " + e.description);
	}
	altezzaSchermo=screen.availHeight;
	larghezzaSchermo=screen.availWidth;
	objectReportControl = document.getElementById(reportControlID);
	// inizializzo campi hidden per il testo del referto
	document.frmMain.HTESTO_TXT.value=refertoTXT;
	document.frmMain.HTESTO_RTF.value=refertoRTF;
}

// funzione che seleziona il primo
// esame
function setSelectedExamInCarousel(idenEsa){
	var oggetto ;
	var collection ;
	
	try{

//			oggetto.className = "labelSingleElemCarousel_ExamSelected";
//			alert(oggetto.className);
		// resetto quelli selezionati
		collection = document.getElementById("idbeltCarousel_Exam").getElementsByTagName("A");
		if (collection){
			for (var i=0;i<collection.length;i++){
				 if (collection.item(i).onclick.toString().indexOf(idenEsa)!=-1){
					 // trovato
					 oggetto = collection.item(i);
					 // DEVO settare anche la classe della label sottostante !!
					 // a labelSingleElemCarousel_Exam
					 break;
				 }
			}
		}
		if (oggetto){
			// aggiorno quello cliccato
	//		oggetto.childNodes[1].className = "labelSingleElemCarousel_ExamSelected";	
			oggetto.style.backgroundColor = "yellow";
			oggetto.style.fontSize = "12";
			oggetto.style.textDecoration = "none";
			oggetto.childNodes.item(1).className="labelSingleElemCarousel_ExamSelected";
		}
		/*
		// deseleziono tutti 
		deSelectAllElement("oEsa_Ref");
		// selezionono quello sul quale ho cliccato
		selectOptionByValue("oEsa_Ref",value);
		// cambiato per carosello !!
		document.frmListaPrecedenti.idenEsame.value = value;
		// aggiorno precedenti
		aggiornaPrecedenti();
		*/
	}
	catch(e){
		alert("selectFirstExamInCarousel - Error: " + e.description);
	}	
}

/**
* funzione che aggiorna i codici degli esami selezionati
*/
function updateSelectedExam(value){
	var oggetto ;
	var collection ;
	
	try{
		oggetto = event.srcElement;
		if (oggetto){
//			oggetto.className = "labelSingleElemCarousel_ExamSelected";
//			alert(oggetto.className);
			// resetto quelli selezionati
			collection = getElementsByAttribute(document.body, "*", "className", "labelSingleElemCarousel_ExamSelected");
			for (var i =0;i<collection.length;i++){
				collection[i].className = "labelSingleElemCarousel_Exam";
				collection[i].parentNode.style.backgroundColor = "";
//				collection[i].parentNode.style.color = "";				
				collection[i].parentNode.style.fontSize = "";
				collection[i].parentNode.style.textDecoration = "";
			}
			// aggiorno quello cliccato
			oggetto.className = "labelSingleElemCarousel_ExamSelected";	
			oggetto.parentNode.style.backgroundColor = "yellow";
//			oggetto.parentNode.style.color = "red";
			oggetto.parentNode.style.fontSize = "12";
			oggetto.parentNode.style.textDecoration = "none";
			//oggetto.innerHTML = "<FONT color ='red'>" + oggetto.innerHTML + "</FONT>";
//			alert(oggetto.className);
		}
		// deseleziono tutti 
		deSelectAllElement("oEsa_Ref");
		// selezionono quello sul quale ho cliccato
		selectOptionByValue("oEsa_Ref",value);
		// cambiato per carosello !!
		document.frmListaPrecedenti.idenEsame.value = value;
		// aggiorno precedenti
		aggiornaPrecedenti();
	}
	catch(e){
		alert("updateSelectedExam - Error: " + e.description);
	}
}

// seleziona primo esame
function selectFirstExam(){
	// aggiorno esame selezionato
	document.frmListaPrecedenti.idenEsame.value = array_iden_esame[0];
}

// ****************************************************************************
//*********************** modifica per problema scadenza sessione 19/9/14
var timerScadenzaSessione;
// 3 minuti;
var timeoutTimerScadenzaSessione = 180000;
//var timeoutTimerScadenzaSessione = 10000;
var idFrameScadenzaSessione = "iFrameScadenzaSessione";

function updateFrameScadenzaSessione(){
	
	var iFrameObj ;
	var oggetto;
	var myFrame;
	
	try{
		myFrame = document.getElementById(idFrameScadenzaSessione);
		if (myFrame){
			myFrame.src = "classAttesa";
		}
		else{
			iFrameObj =  document.createElement("IFRAME");
			iFrameObj.src = "classAttesa";	
			//iFrameObj.className = "iframeVocalBox";
			iFrameObj.style.height = "1px";
			iFrameObj.style.width = "1px";		
			iFrameObj.style.display="none";
			iFrameObj.id = idFrameScadenzaSessione;			
			//iFrameObj.onreadystatechange = function(){alert('Caricato!');};		
			oggetto = document.body;
			if (oggetto){
				oggetto.appendChild(iFrameObj);
			}
		}
		
	}
	catch(e){
		alert("getNEOIframe " + e.description);
	}
}
// ****************************************************************************
// ****************************************************************************
// ******* aldo 20140923
// tappullo nel caso in cui il java di consoleEngine 
// non fosse allineato al js 

var modulo_refertazione = ""
// *********
function initGlobalObject(){
	var oggetto;
	var strTmp = "";


	// ******* aldo 20140923
	// tappullo nel caso in cui il java di consoleEngine 
	// non fosse allineato al js 

	// *********
	// ***
	document.body.id ="myConsoleBody";	
	initbaseGlobal();
	initbaseUser();
	initbasePC();

	// creo box attesa
	try{creaBoxAttesa();}catch(e){;}
	try{mostraBoxAttesa(true, "Caricamento in corso...");}catch(e){;}	

	try{
		initclassReferto();
		initPublicVariables();
		fillLabels(arrayLabelName,arrayLabelValue);
		ShowLayer('divFirstLayout');
		ShowLayer('divSecondLayout');
		ShowLayer('divThirdLayout');
		initWindowSize();
		
		// attivo disattivo sospeso
		// sia il pulsante che il colore della testata che evidenzia
		// il sospeso
		attivazioneSospeso();
		// disabilito firma e sospeso se non si può operare sul cdc dell'esame
		verificaCdcAbilitatiPerFirma();
		// seleziono primo esame della lista
		// ed aggiorno relativo campo
		selectFirstExam();
		// inizializza dimensione right frame
		if (baseUser.USENEWCONSOLELAYOUT != "S"){
			dimensioneDefaultRightFrame = parent.document.all.framesetConsolle.cols.toString().split(",")[1];
		}
		// ****************************
		// ora carico i precedenti
		aggiornaPrecedenti();
		window.onunload = function scaricaFrameset(){scarica();};
		// chiude eventuale finestra di attesa aperta
		parent.opener.top.home.chiudi_attesa();
		// setto il fuoco sull'oggetto di report
		//setFocusOnReportControl();
		// creazione toolbar always on top 
		// per ripristino console in primo piano on demand
		initToolBar();
		// controllo se sono in readOnlyMode
		checkReadOnlyConsole();
		
		// ***	
		// controllo del diverso medico Refertante
		checkDiversoRefertante();
		// trace 
		//alert("###trace console");
		traceConsole(typeUserAction);
		// rimappo onclick del pulsante salva
		// x problema Sospeso automatico
		try{
			oggetto = document.getElementById("btSave");
			if (oggetto){
				strTmp = oggetto.href;
				if (baseUser.RICH_PWD_SU_BOZZA=="N"){
					oggetto.href = "javascript:bolPremutoRegistra = true;"+ strTmp.split(":")[1] +";";
				}
				else{
					// caso di richiesta password ad ogni registrazione
					oggetto.href = "javascript:bolPremutoRegistra = true;richiestaAutenticazione('" + strTmp.split(":")[1].toString().replaceAll("'","\\'") + "');";
				}
			}
		}
		catch(e){
			;
		}
		//alert("###initprocessedtext");
		//alert("son qui in ... " + tipoModalita);
		// solo nel caso di inserimento vado a processare il testo del referto
		if (tipoModalita=='INSERIMENTO'){
			initProcessedTextReport();
		}
		//alert("###controllo data futura");
		controlloDataFutura();
		// inizializza box scelta Esami
		try{creaBoxSceltaEsami(); 		fill_select('oEsa_Ref',array_iden_esame, array_descr_esame,20,"...");}catch(e){;}
		// deseleziono tutti 
		deSelectAllElement("oEsa_Ref");
		// selezionono quello sul quale ho cliccato
		selectOptionByValue("oEsa_Ref",array_iden_esame[0]);	
		// **********************************************
		//alert("###carosello");
		// carosello
		try{initCarousel();initCarouselExam();}catch(e){alert("Can't init carousel");}
		// bind evento click su layer
		// dell'oggetto per testo referto
		// che implica un resize del frame sottostante
		//alert("###setto mousover su modulo refertazione");
		try{
			if (baseUser.USENEWCONSOLELAYOUT == "S"){		
				document.getElementById("idDivReportControl").onmouseover = function(){try{parent.frameBottomConsolle.risezeConsoleBottomFrame(false, true);}catch(e){;}};
			}
		}
		catch(e){
			;
		}
		//alert("###aggiornaEtaPaziente");
		// aggiorno età
		try{aggiornaEtaPaziente();}catch(e){alert("Impossibile aggiornare eta' del paziente.");}
		// controllo se devo aprire / far apparire link per apertura schede specifiche
		//alert("###init scheda console");
		// ambulatorio
		initSchedaInConsole();
		// *************************


		//alert("###carosello");
		// carosello
		try{initCarousel(); if(NS_SCHEDA_REFERTAZIONE.scheda==null) {initCarouselExam();}}catch(e){alert("Can't init carousel");}
		
		/*
		* SCHEDA STRUTTURATA FENIX
		*/
//		NS_SCHEDA_REFERTAZIONE.initSchedaStrutturata();
		
		//alert("###init text report control");
//		if (NS_SCHEDA_REFERTAZIONE.scheda === null)
			initTextReportControl();
		
		// *****
		//alert("###set sel exam in carousel");
		try{setSelectedExamInCarousel(array_iden_esame[0]);}catch(e){;}
		//startupPacs();		
		//alert("###init jqueryui");
		try{initJQueryUI();}catch(e){alert(e.description);};
		//alert("###init sugg e concl");
		try{initSuggerimentiConclusioni();}catch(e){;}
		// conferma di chiusura se il referto non è stato salvato
		window.onbeforeunload = function confirmExit() 
		{
			event.returnValue = (classReferto.IDEN =="") ? "ATTENZIONE: Referto non salvato, procedendo gli eventuali dati inseriti andranno persi." : undefined;
	    	window.onbeforeunload = null;
	    	setTimeout(function(){ window.onbeforeunload = confirmExit; },1000);
	    };
	    j$('a').not("#btExit").hover( function(){window.onbeforeunload=null;}, function(){window.onbeforeunload=confirmExit ;}); //altrimenti il click su qualunque anchor fa scattare onbeforeunload


		// setto il fuoco sull'oggetto di report
		setFocusOnReportControl();

		// ******************************** 20131230
		// *** modifica per la gestione delle sale
		initComboSale();
		// *****************************************
		// ************
		// nuovo privacy
		// *********
		creaLivelloOscuramentoCittadino();
		// **************
		// modifica aldo 16-06-2014
		// tooltip : elenco prestazioni
		var strDescrEsami = "";
		for (var k =0;k<array_descr_esame.length;k++){
			if(strDescrEsami==""){
				strDescrEsami = "- " + array_descr_esame[k];
			}
			else{
				strDescrEsami = strDescrEsami + "\r\n- " + array_descr_esame[k];
			}
		}
		j$("span[class='lenteInLine'],#idElencoEsami").attr("title",strDescrEsami);
		// **************************

		// ****************************************************************************
		//*********************** modifica per problema scadenza sessione 19/9/14
		// aggiungere parametro su ges_config_page !!!!
		try{
			if (parent.opener.top.home.getConfigParam("CONSOLE_KEEP_ALIVE_SESSION")=="S"){
				var TIMEOUT_KEEP_ALIVE_CONSOLE = parent.opener.top.home.getConfigParam("TIMEOUT_KEEP_ALIVE_CONSOLE");
				if (TIMEOUT_KEEP_ALIVE_CONSOLE!=""){
					try{timeoutTimerScadenzaSessione = parseInt(parent.opener.top.home.getConfigParam("TIMEOUT_KEEP_ALIVE_CONSOLE"));}
					catch(e){timeoutTimerScadenzaSessione = 180000;}
				}
				timerScadenzaSessione = setInterval(function(){ 
					updateFrameScadenzaSessione();
				}, timeoutTimerScadenzaSessione);
			}
		}
		catch(e){
			alert("Error init CONSOLE_KEEP_ALIVE_SESSION - Error: " + e.description);
		}
		// ****************************************************************************
		// *************
		modulo_refertazione = listaModuliConsole[0];
		if (modulo_refertazione=="" || modulo_refertazione == "undefined"){
			modulo_refertazione = "GENERICA";
		}
//alert(modulo_refertazione);

		// ***************
		// *********** gestione firma multipla
		// dal momento che consolleFirstLayout è stato
		// modificato per la gestione "particolare" della refertazione
		// "stile Ferrara" , gestisco i campi relativi a "Pronto validazione"
		// da codice js e non da java
		
		// append campi ok_firma
		// se e solo se è abilitata la gestione
		// modifica aldo 26-9-2014
		try{
			if (parent.opener.top.home.getConfigParam("GESTIONE_PRONTO_VALIDAZIONE_CONSOLE")=="S"){
				initProntoValidazione();
			}

		}
		catch(e){
//			alert(e.description);
		}
		// *******************
		// ********** modifica 13/10/14
		// GESTIONE_ATTIVA - modifica per la privacy
		// non ha più senso di esserci: il pulsante del carosello
		// NON viene + gestito
		/*
		if (getHomeFrame().home.getConfigParam("GESTIONE_ATTIVA_PVCY")!="S"){
			j$("div[class='beltCarousel'] a[onclick='javascript:insOscCitt();']").each(function(){
				j$(this).parent().parent().remove(); 
			});
		}*/
		// ***********************************
		try{initPrivacySection();}catch(e){;}		
	}
	catch(e){
		alert("initGlobalObject - Error: " + e.description);
	}
	finally{
		try{mostraBoxAttesa(false, "");}catch(e){;}
	}

}

function getHomeFrame(){
	var objHomeFrame;
	try{
		if (document.all && !document.querySelector) {			objHomeFrame = this;		}
		else{			objHomeFrame = parent.top.opener.top;		}
	}
	catch(e){;}
	return objHomeFrame;
}

// ***************
// modifica aldo 26-9-2014
function initProntoValidazione(){
	try{
		var strToAppend = "";
		strToAppend ="<label id='idLblProntoValid'>Pronto Valid.</label><input type='checkbox' name='checkOkFirma' id='checkOkFirma' value='S' />";
		// modifica 26-11-14
		// in seguito a sdoppiamento parametro  
		// GESTIONE_PRONTO_VALIDAZIONE , GESTIONE_PRONTO_VALIDAZIONE_CONSOLE
		// e jar NON allineato
		try{
			document.frmMain.Hok_firma.value = document.frmMain.Hok_firma.value;
		}
		catch(e){
			// non esiste
			strToAppend += "<input name='Hok_firma' type='hidden' value=''>";
		}
		// ***********************************		
		j$("#lbltitoloTestoReferto").parent().prepend(strToAppend);
		
		// controllo se è refertato
		j$("input[type='hidden'][name='Hok_firma']").val(classReferto.OK_FIRMA);
		if (classReferto.OK_FIRMA == 'S'){
			j$("#checkOkFirma").attr("checked","checked");
		}
	}
	catch(e){
		alert("initProntoValidazione - Error: " + e.description);
	}
}
// **************


var numMaxCaratteriCombo = 15;
var gblJsonSalEsame = {"IDEN":"", "DESCR":"", "COD_DEC":""};
function initComboSale(){
	var objHomeFrame;
	var strTmp = ""
	try{
		var strColToAppend = "<td class='classTdLabel'>Sale</td><td class='classTdField'>&nbsp;<select id='selSale'></select>";
		j$("#idTableFirstLayout tr:first").append(strColToAppend);
		var myLista = new Array();
		myLista.push(array_iden_esame[0]);
		myLista.push(array_iden_esame[0]);
		// Select iden_sal From Moduli_Console  Where Iden_Esa = 5640 And Modulo ='GENERICA' And (Reparto In (Select Column_Value  From Table (Split('AMB,DH_MED_SV,FIS_EST_AL'))) or reparto is null)
		objHomeFrame = getHomeFrame();
		try{var rs = objHomeFrame.executeQuery('consolle.xml','getInfoComboSale',myLista);}catch(e){alert("Errore: getInfoComboSale!!!!");return;}
		while (rs.next()){
			//add_elem("selSale", rs.getString("IDEN"), limitazioneTesto(rs.getString("DESCR"),numMaxCaratteriCombo, "..."));			
			add_elem("selSale", rs.getString("IDEN"), limitazioneTesto(rs.getString("DESCR"),numMaxCaratteriCombo, "..."), "", rs.getString("DESCR"));			
		}
		myLista = new Array();
		myLista.push(array_iden_esame[0]);		
		try{rs = objHomeFrame.executeQuery('consolle.xml','getInfoSala',myLista);}catch(e){alert("Errore: getInfoSala!!!!");return;}		
		if (rs.next()){
			gblJsonSalEsame.IDEN = rs.getString("IDEN");
			gblJsonSalEsame.DESCR = rs.getString("DESCR");
			gblJsonSalEsame.COD_DEC = rs.getString("COD_DEC");
		}
		if (gblJsonSalEsame.IDEN!=""){
			selectOptionByValue("selSale", gblJsonSalEsame.IDEN);
		}
		checkLockComboSale();
	}
	catch(e){
		alert("initComboSale - Error: " + e.description);
	}		
}

function checkLockComboSale (){
	try{
		// se firmato blocco il combo
		if(classReferto.FIRMATO=='S'){
			j$('#selSale').attr("disabled", true); 
		}
	}
	catch(e){
		alert("initComboSale - Error: " + e.description);
	}			
}

function initSuggerimentiConclusioni(){
	try{
		tinyMCE.init({
			mode : "exact",
			elements : "suggerimenti",
			theme : "advanced",
			skin : "o2k7",
			theme_advanced_buttons1 : "",

			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",			
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_path : false,
			setup : function(ed) {
			  ed.onActivate.add(function(ed) {
					
			  });			
			  ed.onDeactivate.add(function(ed) {
					
			  });								  
			  
			},						
			content_css : "std/jscript/tiny_mce/css/polarisTinyContent.css?" + new Date().getTime()			
		});	
		tinyMCE.init({
			mode : "exact",
			elements : "conclusioni",
			theme : "advanced",
			skin : "o2k7",
			theme_advanced_buttons1 : "",
			theme_advanced_buttons2 : "",
			theme_advanced_buttons3 : "",			
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_path : false,	
			setup : function(ed) {
			  ed.onActivate.add(function(ed) {
						
			  });		
			  ed.onDeactivate.add(function(ed) {
				 		
			  });					  
			},							
			content_css : "std/jscript/tiny_mce/css/polarisTinyContent.css?" + new Date().getTime()			
		});				
	}
	catch(e){
		//alert("initSuggerimentiConclusioni - Error: " + e.description +"!!");
	}
}


function initJQueryUI(){


// ******************************************************************
	j$(function() {
		// a workaround for a flaw in the demo system (http://dev.jqueryui.com/ticket/4375), ignore!
		j$("#dialog").dialog("destroy");
		
		var suggerimenti = j$("#suggerimenti"),
			conclusioni = j$("#conclusioni"),
			allFields = j$([]).add(suggerimenti).add(conclusioni),
			tips = j$(".validateTips");

		function updateTips(t) {
			tips
				.text(t)
				.addClass('ui-state-highlight');
			setTimeout(function() {
				tips.removeClass('ui-state-highlight', 1500);
			}, 500);
		}


		function checkLength(o,n,min,max) {

			if ( o.val().length > max || o.val().length < min ) {
				o.addClass('ui-state-error');
				updateTips("Lunghezza de " + n + " deve essere tra "+min+" e "+max+" caratteri.");
				return false;
			} else {
				return true;
			}

		}
		j$("#dialog-form").dialog({
			autoOpen: false,
			height: 400,
			width: 500,
			modal: true,
			buttons: {
				'Ok': function() {
					var bValid = true;
					allFields.removeClass('ui-state-error');

					bValid = bValid && checkLength(suggerimenti,"Suggerimenti",0,4000);
					bValid = bValid && checkLength(conclusioni,"Conclusioni",0,4000);
					showHideReportControlLayer(true);

					// qui metto cosa fare se passa i controlli
					aggiornaValoriSuggConclChiudi();
				},
				"Chiudi": function() {
					j$(this).dialog('close');
					showHideReportControlLayer(true);					
					// quando chiudo risetto il fuoco
					// sul controllo del testo del referto
					setFocusOnReportControl();					
				}
			},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
			}
		});

		
		j$("#dialog-form-casi").dialog({
			autoOpen: false,
			height: 400,
			width: 600,
			modal: true,
			buttons: {
				'Registra': function() {
					var bValid = true;
					allFields.removeClass('ui-state-error');

					//bValid = bValid && checkLength(suggerimenti,"Suggerimenti",0,4000);
					//bValid = bValid && checkLength(conclusioni,"Conclusioni",0,4000);
					showHideReportControlLayer(true);
					// qui metto cosa fare se passa i controlli
					// aggiorna la struttura json del caso
					updateJsonStructCase();
					// registra i dati in base 
					// alla struttura json
					registraCasoRilevante();
				},
				"Chiudi": function() {
					updateJsonStructCase();
					j$(this).dialog('close');
					showHideReportControlLayer(true);					
					// quando chiudo risetto il fuoco
					// sul controllo del testo del referto
					setFocusOnReportControl();	
					
				}
			},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
			}
		});
		
		
		j$( "#selectableRilevanza" ).selectable({
	    stop:function(event, ui){
    	    j$(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
	    }
		});
		
		//@deprecated (?)
		j$('#apriConclusioni')
			.button()
			.click(function() {
				j$('#dialog-form').dialog('open');
			});
		// **************
			
		j$(function() {
				
			});		


	});
// ******************************************************************	

}	

// dal momento che il link 
// del pulsante registra può essere rimappato
// al volo per esser sicuri di simulare esattamente
// la pressione del pulsante registra
// ritorno il valore di href
function simulateSaveButton(){
	var oggetto;
	var strTmp;
	try{
		oggetto = document.getElementById("btSave");
		if (oggetto){
			strTmp = oggetto.href;
			eval(strTmp);
		}
	}
	catch(e){
		alert("" + e.description);
	}
}


function aggiornaEtaPaziente(){
	var dataNasc = "";
	var strTmp = "";
	var oggetto ;
	var anni="";
	var mesi = "";
	var giorni = "";
	var descrizionePaziente ="";
	var strSexIcon ="";
	var id_sexIcon = "";
	try{
		
		oggetto = document.getElementById("lblDescrizionePaziente");
		if (oggetto){
			descrizionePaziente = oggetto.innerHTML;
			dataNasc = descrizionePaziente.toString().substr(descrizionePaziente.length-10,10);
			if (dataNasc!=""){
				giorni = dataNasc.substr(0,2);
				if (giorni.substr(0,1)=="0"){giorni=giorni.substr(1,1);}
				mesi = dataNasc.substr(3,2);
				if (mesi.substr(0,1)=="0"){mesi=mesi.substr(1,1);}				
				anni = dataNasc.substr(6,4);
//				alert(giorni + " " + mesi  +"  " + anni)
				strTmp = calage(giorni,mesi,anni);	
				giorni = strTmp.split("*")[0];
				mesi = strTmp.split("*")[1];
				anni = strTmp.split("*")[2];
				if ((anni=="")||(mesi=="")||(giorni=="")){return;}
//				alert(oggetto.parentNode.innerHTML);
				if(PatientSex == "F"){
					strSexIcon="<SPAN id='femaleIconInfo' title='Donna' class='classeIconaSessoPaziente' ></span>";
					id_sexIcon = "femaleIconInfo";
				}
				else{
					strSexIcon="<SPAN id='maleIconInfo' title='Uomo' class='classeIconaSessoPaziente' ></span>";
					id_sexIcon = "maleIconInfo";
				}
				// ***********************
				// modifica 30-04-2015
				// modifica 3-8-15 DEVO Considerare anche permissione su utente
				try{
					//glbMedIniziativa =  parent.top.opener.top.gestioneNotifiche.isAnagMedIniziativa(globalIdenAnag);
					if ((parent.top.opener.top.gestioneNotifiche.isAnagMedIniziativa(globalIdenAnag))&&(parent.opener.top.WEB_ATTRIBUTES.getAttributeValue("MED_INIZIATIVA")=="S")){
						glbMedIniziativa = true
					}else{glbMedIniziativa = false;}
				}catch(e){;}
				//	********
				var strMedIniz = "";
				if (glbMedIniziativa){
					// modifica 29-7-15
					strMedIniz = "<span class='anagIniziativa' title='Paziente sottoposto a percorso di Med.di iniziativa' id='anagIniziativa_"+ globalIdenAnag +"' onclick='javascript:creaNuovaNotificaSuPaziente("+globalIdenAnag+");'></span>";
					// ****************
				}
				// ***********************				
				oggetto.parentNode.innerHTML = "Data ref.: " + dataOraRefertoHtmlValue + strSexIcon + strMedIniz + "Paz.: <label id='lblDescrizionePaziente' >" + descrizionePaziente +"</label>&nbsp;Età: <LABEL id='lblAgeValue' >" + anni + " aa "+ mesi + " mm " + giorni +" gg</label>";
				// fare il binding dell'evento over per le info 

				 /*j$(".classeIconaSessoPaziente").fancybox(j$("#divChangeStatus_container").html(),{
						//fancybox options
						'centerOnScroll': true,
						'transitionIn': 'fade',
						'transitionOut': 'fade',
						'type': 'inline'
					});*/
				
				 /*
				  * NON cancellare
				  * meglio gestire evento click
				  * se si riprista hoverIntent
				  * decommentare funzioni che lo gestiscono ad inizio file
				j$(".classeIconaSessoPaziente").hoverIntent({
					sensitivity: 7,
					interval:500,timeout:0,
					over: openAnagDialog,
					out: closeAnagDialog 
				});
				*/
				
				createLayerAnagInfo();
				j$("#" + id_sexIcon).bind('click', function() {
					openAnagDialog();
				});
				
			}
		}
	}
	catch(e){
		alert("aggiornaEtaPaziente - Error: " + e.description);
	}		
		
}

function openAnagDialog(){
	//j$(this).trigger("click");
	/*j$.fancybox(j$("#divAnagInfoConsole").html(),{
		//fancybox options
		'centerOnScroll': false,
		'transitionIn': 'fade',
		'transitionOut': 'fade',
		'type': 'inline'
	});	*/
	
				
      j$( "#divAnagInfoConsole" ).dialog( "open");
      //position:[parseInt(j$(".classeIconaSessoPaziente")[0].offsetLeft +10), 10 ],
      /*var x = j$(".classeIconaSessoPaziente")[0].offsetLeft;
      var y = j$(".classeIconaSessoPaziente")[0].offsetTop;
      jQuery("#divAnagInfoConsole").dialog('option', 'position', [x,y]);*/
      //  return false;
}
function closeAnagDialog(){
	//j$.fancybox.close();
	j$( "#divAnagInfoConsole" ).dialog( "close" );
}

function createDiv(idValue){var oggetto ;	oggetto = document.createElement("DIV");	oggetto.id = idValue;	return oggetto;}
function createLabel(id){	var oggetto ;		oggetto = document.createElement("LABEL");	oggetto.id = id;	return oggetto;}
function createA(id, hrefLink){	var oggetto;	oggetto = document.createElement("A");	oggetto.href = hrefLink;	oggetto.id = id;	return oggetto;}

function createLayerAnagInfo(){
	var div_container;
	var rs;
	var myLista = new Array();
	var contentHtml = "";
	var valueParam="";
	var strAccordion ="", strFields="", strAccordionTmp = "";
	var bolIE7 = false; 
	var objHomeFrame ;
	
	try{
		// patch internet explorer 7
		// faccio questo controllo perchè
		// su ie7 sembra impossibile raggiungere
		// il frame che contiene home.js e si 
		// "frizza" IE !!
		if (document.all && !document.querySelector) {
		    bolIE7 = true;
		    objHomeFrame = this;
		}
		else{
			objHomeFrame = parent.top.opener.top;
		}
		
		div_container = createDiv("divAnagInfoConsole");
		myLista.push(baseUser.LOGIN); 
		myLista.push("infoAnagInConsolle");
		
		
		try{rs = objHomeFrame.executeQuery('parametriUtente.xml','getParamPerUtente',myLista);}catch(e){alert("Errore: getParamPerUtente");}
		//alert("###createLayerAnagInfo after query");
		if (rs.next()){
			valueParam = rs.getString("VALORE_PARAMETRO");
			if (valueParam!=""){

				var jsonObj = JSON.parse(valueParam);
//				alert(jsonObj.Anagrafica[1]);
				// estrapolo info anag
				myLista = new Array();
				myLista.push(globalIdenAnag);
				try{var rsAnag = objHomeFrame.executeQuery('consolle.xml','getInfoAnagInConsolle',myLista);}catch(e){alert("Errore: getInfoAnagInConsolle");}
				//alert("###createLayerAnagInfo after second query");
				if (rsAnag.next()){
					//var myObject = { name: "Cody", status: "Surprised" };
					for (var propertyName in jsonObj) {
						//document.writeln( propertyName + " : " + jsonObj[propertyName] );
						strAccordion += "<h3>" + propertyName + "</h3>";
						strFields = "";
						for (var k=0; k< jsonObj[propertyName].length;k++){
							strFields += "<B>" + jsonObj[propertyName][k] + "</B> : " + rsAnag.getString(jsonObj[propertyName][k]) + "<BR/>";
							//strFields += jsonObj[propertyName][k] + " : " + k + "<BR/>";
						}
						strAccordion += "<div>" + strFields + "</div>";
					}
					strAccordion = "<div id='accordionInfoAnag'>" + strAccordion + "</div>";
				}
				//alert(strAccordion);
			}
		}
		div_container.innerHTML = strAccordion;
		div_container.title = "Paziente";
		document.body.appendChild(div_container);
		//if (document.getElementById("accordionInfoAnag")){alert("esiste");}
        
        //j$('#accordionInfoAnag').multiAccordion("option", "active", [0, 2 , 3, 4]);
		j$('#accordionInfoAnag').multiAccordion();
		j$('#accordionInfoAnag').multiAccordion('option', 'active', 'all');
		var winLeft = parseInt((j$(document).contents().width()- 600)/2);
		var winTop =  parseInt((j$(document).contents().width() - 500)/2); 
//		alert(winLeft + " - "+ winTop);
		j$( "#divAnagInfoConsole").dialog({
			autoOpen: false,
			height:500,
			width:600,
			modal: true ,
			resizable: false
		});		
	
		
	}
	catch(e){
		alert("createLayerAnagInfo - Error: " + e.description);
	}		

}



// ATTENZIONE VEDERE PERCHè NON FUNZIONA + !!!
// funzione che richiama la tracciatura dell'utente
function traceConsole(azione){
	// trace
	try{
		resetTraceUserObject();	

		objTraceUserAction.userAction[0].action = azione;
		objTraceUserAction.userAction[0].iden_anag = globalIdenAnag;
		objTraceUserAction.userAction[0].iden_esame = getAllOptionCode('oEsa_Ref');
		if (tipoModalita!='INSERIMENTO'){
			// modifica, ho iden_ref
			objTraceUserAction.userAction[0].iden_ref = classReferto.IDEN;
		}
		
		
		callTraceUserAction();						
	}
	catch(e){
		alert("traceConsole " + e.description);
	}		
}



function finestre_popup(valore)
{
	if (valore=="" || valore=="#") 
	{return;}
	if (valore=="R")
	{
		//refertante
/*		if (document.frmMain.txt_DESCR_REFERTANTE.value=="")
		{
			return;
		}*/
		document.frmTabelleStandard.myric.value=document.frmMain.txt_DESCR_REFERTANTE.value;		
		document.frmTabelleStandard.myproc.value="CONSOLLE_TAB_MEDR";
	}
	if (valore=="RS")
	{
/*		if (document.frmMain.txt_DESCR_SEC_MEDICO.value=="")
		{
			return;
		}		*/
		document.frmTabelleStandard.myric.value=document.frmMain.txt_DESCR_SEC_MEDICO.value;		
		document.frmTabelleStandard.myproc.value="CONSOLLE_TAB_MEDR2";
	}
	popup_scandb = window.open("","winstd","status=yes,scrollbars=no,height=1,width=1, top=10, left=10");
	if (popup_scandb){
		popup_scandb.focus();
	}else{
		popup_scandb = window.open("","winstd","status=yes,scrollbars=no,height=1,width=1, top=10, left=10");
	}
	// *************************************
	// *************** LOG *****************
	// *************************************
	//LogJavascript.WriteInfo("consolleEngine*Call finestre_popup - valore: "+ valore,deallocaLogJavascript);
	// *************************************
	document.frmTabelleStandard.submit();
}

// funzione che effettua
// ridimensionamento del frameset principale
// e inizializzazione dimensioni RPTcontrol
// e testo dell'offetto x scrivere referto
function initWindowSize(){
		
	var strDescrEsami = ""	;
	try{
		// posiziono frameset al massimo
		top.resizeTo(larghezzaSchermo,altezzaSchermo);
		top.moveTo(0,0);
		if (objectReportControl){
			// ridimensiono
			// e setto posizione controllo ocx
			initRptControl();
		}
	}
	catch(e){
	//	alert("initWindowSize - " + e.description);
	}
}

// funzione che reperisce i valori iniziali
// per ogni esame in base alla loro javaprocessclass
function initProcessedTextReport(){
	// ATTENZIONE
	// Faccio questa approssimazione:
	// dal momento che solitamente le schede, quanto meno al momento è così,
	// specifiche degli esami sono compilate NON per OGNI singolo esame bensi
	// per "pacchetti" di esami tutti della stessa metodica (tipicamente anche stesso num.accettazione)
	// elaboro solo il primo esame!
	// VERIFICARE se è valido....
	var size;
	try{
		//alert("passo da initProcessedTextReport ");
		try{size = array_iden_esame.length;}catch(e){size=1;}
		//arrayInitialProcessedTextReport = new Array();	
		//for (var i =0;i<size;i++){arrayInitialProcessedTextReport.push("");}
		arrayInitialProcessedTextReport = new Array(size);
		// inizializzo i valori
		for (var i =0;i<arrayInitialProcessedTextReport.length;i++){
			arrayInitialProcessedTextReport[i] = "";
		}
		callGetReportProcessed ();
	}
	catch(e){
		alert("initProcessedTextReport - Error: " + e.description);
	}
}

// inizializza il testo del report control
function initTextReportControl(){

	var strDescrEsami = "";
	var strTmp = "";
	

	try{
		try{mostraBoxAttesa(true, "Caricamento in corso...");}catch(e){;}			
		if (objectReportControl){
			// questa funzione
			// inizializza il testo del 
			// referto *SOLO* con la descrizione
			// degli esami
			if (tipoModalita=="MODIFICA"){
				//alert("###Modifica initextrptcontrol");
				// SOLO NEL CASO DI MODIFICA
				// chiamo initReportText
				// negli altri casi indipendentemente
				// dall'ocx setto il text
				initReportText();
			}
			else{
				// ricavo descr esami
				//alert("chiamo getInitialProcessedTextReport")
				strTmp = getInitialProcessedTextReport();
				
				if (strTmp==""){
					for (var i =0;i<array_descr_esame.length;i++){
						if(strDescrEsami==""){
							strDescrEsami = array_descr_esame[i];
						}
						else{
							strDescrEsami = strDescrEsami + "\r\n" + array_descr_esame[i];
						}
					}
				}
				else{
					strDescrEsami = strTmp;
				}
			
				// INSERIMENTO 
				// devo controllare se sono 
				// nel caso di esami MN
				if (checkModalitaEsami(array_metodica)==true){
					// ok esami MN
					// controllo se devo applicare
					// i controlli x MN
					if (baseGlobal.MNNELTESTO=="S"){
						// setto  testo iniziale
						try{
						
							// per MN setto header + descr
							if (baseGlobal.MN_SEPARA=="S"){
								setReportControlTXTText(getMNreportHeader() + "\r\n\r\n" + baseGlobal.MN_LABEL_REFERTO+ "\r\n\r\n" +strDescrEsami + "\r\n\r\n");	
							}
							else{
								setReportControlTXTText(getMNreportHeader() + "\r\n\r\n"  + baseGlobal.MN_LABEL_REFERTO+ "\r\n\r\n");	
							}
						}
						catch(e){
							// errore inizializzazione testo
							;
						}
					}
					else{
	
						// attenzione: solo a Bergamo NON vogliono che si lasci la riga vuota					
						setReportControlTXTText(strDescrEsami + "\r\n");					
					}
				}
				else{
									
					// attenzione: solo a Bergamo NON vogliono che si lasci la riga vuota
					if (((baseUser.USETINYMCE=="S")||(baseUser.USENEWREPORTTOOL=="S"))&&(baseUser.USAVOCALE=="N")){
						//strTmp = "<p>" + strDescrEsami.toString().replaceAll("\r\n","<br />") + "<br /></p>";
						if (baseUser.USETINYMCE=="S"){
							strTmp = "<p>" + strDescrEsami.toString().replaceAll("\r\n","<br />") + "<br /></p>";
						}
						else{
							strTmp = strDescrEsami.toString().replaceAll("\r\n","<br />") + "<br />";
						}
						setReportControlHTMLText(strTmp);							
					}
					else{
						setReportControlTXTText(strDescrEsami + "\r\n ");	
					}
				}
				
			}
			// aggiunto il 20070802
			// attenzione dovra essere dinamico
			// in base alla dimensione personalizzata
	//		setReportControlSelTextSize	(20);
			try{
				// uso il try catch perchè
				// al momento non è implementato su
				// tutte le integrazioni
				setDefaultSizeChar();
			}
			catch(e){
			}
		}
	}
	catch(e){
		alert("initTextReportControl - Error: " + e.description);
	}
	finally{
		try{mostraBoxAttesa(false, "");}catch(e){;}	
	}	
}


// funzione che lavora sui CSS e restituisce 
// dei CSSRule
function CSSRule(selText) { 
        for(i = 0; i < document.styleSheets.length;i++) { 
                var st = document.styleSheets(i); 
                for (ir = 0; ir < st.rules.length; ir++) { 
                        if (st.rules(ir).selectorText == selText) { 
                                return st.rules(ir); 
                        } 
                } 
        } 
} 

// funzione che chiude la consolle di refertazione
function chiudi(){
	try{
		top.close();
	}
	catch(e){
		alert("Chiudi - " + e.description);
	}
}



// funzione che stampa: sia preview che stampa classica
// controlla se prima è necessario salvare
function stampa(tipoStampa){
	
	var strAction = "";
	// controllo se è nello stato di sospeso
	// in tal caso, in base al parametro,
	// NON effettuo la stampa
	strAction = tipoStampa;
	if (classReferto.FIRMATO!="S"){
		// il referto NON è firmato
		// quindi potrebbe essere stampato
		if ((registrazioneAbilitata==true)&&(baseUser.SOSPAUTOMDOPOREFERT =="S")&&(baseGlobal.DISABLEPRINTIFPENDING=="S")){
			parent.opener.parent.parent.hideFrame.showTimeoutWindow(400, 150,ritornaJsMsg("jsWarning"), ritornaJsMsg("jsNoPrintIfPending"), 4000, true);
			// resetto azione 
			// successiva alla registrazione
			strAction = "";
		}
		if((classReferto.SOSPESO=="S")&&(baseGlobal.DISABLEPRINTIFPENDING=="S")&&((baseUser.SOSPAUTOMDOPOREFERT =="N"))){
			alert(ritornaJsMsg("jsNoPrintIfPending"));
			return;			
		}
	}
	
	if (tipoStampa.toLowerCase()=="preview"){
		// controlla se è stato registrato
		if(classReferto.IDEN ==""){
			alert(ritornaJsMsg("jsNoSaved"));
			return;
		}
	}
	if (registrazioneAbilitata==true){
		// setto passo successivo
//		document.frmMain.HactionAfterSave.value=tipoStampa;
		document.frmMain.HactionAfterSave.value=strAction;
		//LogJavascript.WriteInfo("consolleEngine*call registra from stampa.",deallocaLogJavascript);	
		simulateSaveButton();
	}
	else{
		//LogJavascript.WriteInfo("consolleEngine*call doPrint from stampa.",deallocaLogJavascript);
		doPrint(tipoStampa);
	}
}

// funzione che stampa direttamente
// senza salvare nulla
function doPrint(tipoStampa){
	//LogJavascript.WriteInfo("consolleEngine*start doPrint - tipoStampa: "+ tipoStampa,deallocaLogJavascript);
	// apre finestra di stampa
	var wndPreviewPrint = window.open("","wndPreviewPrint","top=0, left=0,width="+ screen.availWidth + ", height="+ screen.availHeight);
	if (wndPreviewPrint){
		wndPreviewPrint.focus();
	}
	else{
		wndPreviewPrint = window.open("","wndPreviewPrint","top=0, left=0,width="+ screen.availWidth + ", height="+ screen.availHeight);
	}	
	if (tipoStampa==""){
		alert("Tipo di stampa nullo");
		tipoStampa = "print";
	}
	// dal momento che potrebbe esser stato escluso uno o più esami 
	// rimappo al volo quello da stampare in base al primo presente in lista
	document.frmStampa.stampaIdenEsame.value = getAllOptionCode('oEsa_Ref').split("*")[0];
	try{
		switch (tipoStampa.toLowerCase()){
		case "print":
			document.frmStampa.stampaAnteprima.value = "N";
			//LogJavascript.WriteInfo("consolleEngine*submit frmStampa - Stampa",deallocaLogJavascript);
			document.frmStampa.submit();
			break;
		case "preview":
			document.frmStampa.stampaAnteprima.value = "S";
			//LogJavascript.WriteInfo("consolleEngine*submit frmStampa - Anteprima",deallocaLogJavascript);
			document.frmStampa.submit();
			break;
		case "printclose":
			document.frmStampa.stampaAnteprima.value = "N";
			//LogJavascript.WriteInfo("consolleEngine*submit frmStampa - Stampa e chiudi",deallocaLogJavascript);
			document.frmStampa.submit();	
			top.close();
			break;
		}
	}
	catch(e){
		alert("Errore di switch: - tipoStampa:" + tipoStampa + " - " +e.description);
	}
}

// funzione che ricarica la lista dei precedenti
// il tab selezionato sarà quello preso dalla tabella
// relativa
// @deprecated  VIENE ORA USATO  SOLO aggiornaPrecedenti
/*function caricaPrecedenti(){
	try{document.frmListaPrecedenti.idenRef.value = classReferto.IDEN}catch(e){;}
	try{
		var schedaAssociata = "";
		schedaAssociata = getScheda_e_iden_da_idenEsa(getValue("oEsa_Ref")).strTmp.split("*")[1];
		document.frmListaPrecedenti.schedaEsame.value = schedaAssociata;
	}catch(e){;} 		
	document.frmListaPrecedenti.submit();
}
*/



function urldecode (str) {
	  return decodeURIComponent((str + '').replace(/\+/g, '%20'));
	}
//funzione che carica automaticamente
//i referti standard collegati agli esami in fase
//di refertazione (solo quelli presenti nella listbox di sx)
function importaRefertoStdAutomatico(){
	var idenEsaSelezionati = "";
	var codEsaSelezionati="";
	var popup;
	try{
		//LogJavascript.WriteInfo("consolleEngine*Start importaRefertoStdAutomatico",deallocaLogJavascript);
		idenEsaSelezionati = getAllOptionCode('oEsa_Ref');
		codEsaSelezionati = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_cod_esa);

		//alert(convertCharSet("&#82&#101&#102&#101","xml","utf-8",false));return;
		var popup = window.open("","wnd_importaRefertiStd","status=yes,scrollbars=no,height=500,width=500, top=10000, left=10000");
		if (popup) {
			popup.focus();}
		else{
			popup = window.open("","wnd_importaRefertiStd","status=yes,scrollbars=no,height=500,width=500, top=10000, left=10000");}	
		document.frmImportaRefertiStd.codEsa.value = codEsaSelezionati ;
		document.frmImportaRefertiStd.idenMedR.value = document.frmMain.HIDEN_MEDR.value;
		
		//LogJavascript.WriteInfo("consolleEngine*Submit frmImportaRefertiStd - idenMedR: " + document.frmImportaRefertiStd.idenMedR.value  + " - codEsa: " + document.frmImportaRefertiStd.codEsa.value,deallocaLogJavascript);
		document.frmImportaRefertiStd.submit();
	}
	catch(e){
		alert("importaRefertoStdAutomatico - Error: " + e.description);
	}	
}

// funzione che apre la finestra di ricerca
// dei referti standard
function importaRefertoStdManuale(){
	var idenEsaSelezionati = "";
	var codEsaSelezionati="";
	var popup;

	try{
		//LogJavascript.WriteInfo("consolleEngine*Start importaRefertoStdManuale",deallocaLogJavascript);	
		idenEsaSelezionati = getAllOptionCode('oEsa_Ref');
		codEsaSelezionati = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_cod_esa);
		// apro finestra
		var popup = window.open("","wnd_importaRefertiStd","status=yes,scrollbars=no,height=700,width=800, top=10, left=10");
		if (popup) {
			popup.focus();}
		else{
			popup = window.open("","wnd_importaRefertiStd","status=yes,scrollbars=no,height=700,width=800, top=10, left=10");}	
		document.frmImportaRefertiStdManuale.codEsa.value = codEsaSelezionati ;
		// ********************** modifica 20140313
		var idenMedR = "";
		idenMedR = document.frmMain.HIDEN_MEDR.value;
		// usare anche baseUser.TIPO_MED se serve
		if (idenMedR=="" && baseUser.TIPO == 'M'){
			idenMedR =  baseUser.IDEN_PER;
		}
		document.frmImportaRefertiStdManuale.idenMedR.value = idenMedR;
		// ***********************
		//alert("####" + idenEsaSelezionati +"#"+ document.frmImportaRefertiStdManuale.codEsa.value + "#" + document.frmImportaRefertiStdManuale.idenMedR.value);
		//LogJavascript.WriteInfo("consolleEngine*Submit frmImportaRefertiStd - idenMedR: " + document.frmImportaRefertiStdManuale.idenMedR.value  + " - codEsa: " + document.frmImportaRefertiStdManuale.codEsa.value,deallocaLogJavascript);	
		document.frmImportaRefertiStdManuale.submit();
	}
	catch(e){
		alert("importaRefertoStdManuale - Error: " + e.description);
	}
}

// in base alla serie di esami.iden (splittati da *)
// passati come parametro viene ritornata l'informazione
// relativa e corrispondente all'array richiesto
// esempio: passo esami.iden = 1 , 'array_iden_esa' come input e 'array_cod_esa' come output
// verrà ritornato il cod_esa preso da array_cod_esa relativo a quell'esame.iden
function ritornaInfoEsame(valore, vettoreInput, vettoreOutput){
	var vettoreValori;
	var stringaOutput="";
	var i=0, j=0;

	try{
		vettoreValori = valore.toString().split("*");
		for (i=0;i<vettoreValori.length;i++){
			for (j=0;j<vettoreInput.length;j++){
				if (vettoreValori[i]==vettoreInput[j]){
					if (stringaOutput==""){
						stringaOutput = vettoreOutput[j];
					}
					else{
						stringaOutput += "*" + vettoreOutput[j];
					};
				}
			}
		}
	}
	catch(e){
		alert("ritornaInfoEsame: " + e.description);
	}
	return stringaOutput;
	
}


// funzione chiamata
// sull'unload del frame
// Tappullo per test neologica
function scarica(){
	// ****************************************************************************
	//*********************** modifica per problema scadenza sessione 19/9/14
	try{		clearInterval(timerScadenzaSessione);	}	catch(e){;	}
	// ****************************************************************************	
	if (pacsType!=""){
		closeExamOnPacs();
	}	
	// resetto timer
	try{clearInterval(timerToolBar);}catch(e){;}	
	// resetto oggetto per check appropriatezza
	try{ajaxManageAppropriatezza = null;}catch(e){;}
	try{LogJavascript = null;}catch(e){;}
	try{
		// chiudo finestra di check pwd, se aperta
		if (finestraCheckUserPwd){
			finestraCheckUserPwd.close();
		}
	}catch(e){;}
	try{	
		ajaxPcManage = null;
	}
	catch(e){;}		
	// trace
	try{
		traceConsole("UNLOAD_" + typeUserAction);
	}
	catch(e){
		;
	}
	// scarico oggetto di report
	try{unloadReportObject();}catch(e){;}
	
}

// funzione
// che gestisce autosync con eventuali pacs
// abilitati
function startupPacs(){
	return;
	//LogJavascript.WriteInfo("consolleEngine*Start startupPacs",deallocaLogJavascript);	
	if (pacsType==""){return;}
	if (baseGlobal.ABILITA_AUTOSYNC_REF=="S"){
		// è richiesta l'auto sincronizzazione
		// controllo i vari pacs abilitati
		//LogJavascript.WriteInfo("consolleEngine*call syncToPacs - pacsType: " + pacsType,deallocaLogJavascript);		
		syncToPacs(pacsType,"");
	}
}

// funzione che sincronizza
// gli esami con il pacs
function syncToPacs(pacsType,additionalParameters){
	
	var strAccession_number = "";
	var strAETITLE = "";
	var strReparto = "";
	var idenEsaSelezionati = "";
	var strMetodica = "";
	
	return;
	//LogJavascript.WriteInfo("consolleEngine*start syncToPacs",deallocaLogJavascript);
	if (pacsType==""){return;}
	// rimettere come prima !!!
	idenEsaSelezionati = getAllOptionCode('oEsa_Ref');
	strAccession_number = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_id_esame_dicom);
	strAETITLE = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_aetitle); 
	strReparto = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_reparto);
	strMetodica = ritornaInfoEsame(idenEsaSelezionati, array_iden_esame,array_metodica);
	parent.opener.parent.parent.hideFrame.basePacsStudy.ACCNUM = strAccession_number;
	parent.opener.parent.parent.hideFrame.basePacsStudy.AETITLE = strAETITLE;
	parent.opener.parent.parent.hideFrame.basePacsStudy.PATID = PatientId;	
	parent.opener.parent.parent.hideFrame.basePacsStudy.REPARTO = strReparto;
	// *****
	//LogJavascript.WriteInfo("consolleEngine*sendToPacs  CLOSE_CURR_SESSION",deallocaLogJavascript);
	parent.opener.parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION",pacsType,"fromConsole=true",deallocaLogJavascript);
	if (additionalParameters==""){
		// modifica fatta per medipass
		additionalParameters = strMetodica;
	}
	//LogJavascript.WriteInfo("consolleEngine*sendToPacs  SHOWSTUDY",deallocaLogJavascript);
	parent.opener.parent.parent.hideFrame.sendToPacs("SHOWSTUDY",pacsType,"fromConsole=true",deallocaLogJavascript);
	
}

// funzione che 
// chiude eventuali esami aperti sul pacs
function closeExamOnPacs(){
	return;
	if (registrazioneEffettuata==true){
		parent.opener.parent.parent.hideFrame.actionAfterSaveReport="CONFIRM";
	}
	else{
		parent.opener.parent.parent.hideFrame.actionAfterSaveReport="DISMISS";
	}
	// *******************
	// ATTENZIONE modifica fatta per forzare ogni volta creazione keyimages
	//parent.opener.parent.parent.hideFrame.actionAfterSaveReport="CONFIRM";
	// *******************
	parent.opener.parent.parent.hideFrame.sendToPacs("CLOSE_CURR_SESSION",pacsType,"");
	// resetto StudyObject
	parent.opener.parent.parent.hideFrame.resetStudyObject();			
}


// funzione 
// per gestire l'inserimento
// dei codici ACR dalla consolle
function gestioneACR(){
	
	//LogJavascript.WriteInfo("consolleEngine*start gestioneACR",deallocaLogJavascript);				
	if (document.frmMain.HIDEN_REF.value==""){
		// NON ho ancora registrato
		alert(ritornaJsMsg("jsNoSaved"));
		return;
	}
	document.frmACR.idenRef.value = document.frmMain.HIDEN_REF.value;
	var finestraACR = window.open("","wndACR","top=0,left=0,width=325,height=245,status=yes");
	if (finestraACR){
		finestraACR.focus();
	}
	else{
		finestraACR =  window.open("","wndACR","top=0,left=0,width=325,height=245,status=yes");
	}	
	//LogJavascript.WriteInfo("consolleEngine*submit frmACR",deallocaLogJavascript);				
	document.frmACR.submit();
}


function deallocaLogJavascript()
{
	return;
	LogJavascript = null;
}


function initToolBar(){
	var wndToolBar;
	var answer;
	var framesetConsole;
	
	// rinomino titolo frameset console
	// per fare il retrieve dell'handle
	top.document.title = framesetTitleConsolePolaris;
	try{
		if (basePC.SHOW_TOOLBAR=="S"){
			apriToolBar();
		}
	}
	catch(e){
	}
}


function apriToolBar(){
		
		try{
			var wndToolBar = window.open("toolBar.html","","width=120px, height=60px, top=0, left=0, status=no");
			if (wndToolBar){
				wndToolBar.focus();
			}
			else{
				wndToolBar= window.open("toolBar.html","","width=120px, height=60px, top=0, left=0, status=no");
			}
			wndToolBar.title =	toolBarTitle;
			handleToolbar = "" ;
		}
		catch(e){
			//alert("*" + e.description + "*");
		}
		try{
//			alert("ToolBar attiva");
			setToolBarOnTop();
		}
		catch(e){
			alert("apriToolBar - " + e.description);
		}

} 

function setToolBarOnTop(){
	try{
		// ATTENZIONE DA RIVEDERE !!!
		//handleToolbar = parent.opener.parent.parent.hideFrame.clsKillHome.ShowWindowOnTopByTitle("toolBar", true,0,0,130,100);	
	}
	catch(e){
		alert("Error on setToolBarOnTop " + e.description);
	}
}



function apriAppropriatezza(){
	
	var provenienza = "R";
	var iden_anag= "";
	var iden_esame = "";
	var i = 0;
	var arraySchedeAppropriatezza;
	var bolSchedeUguali = true;
	var oldValue = "";
	var strTmp = "";
	var timer;
	
	iden_anag = globalIdenAnag;
	// ***********
/*	if (!registrazioneAbilitata){
		alert(ritornaJsMsg("jsDeny4ReadOnly"));
		return;		
	}*/
	try{
		//strTmp = top.opener.ritornaInfoEsame(getAllSelectedOptionCode('oEsa_Ref'),top.opener.array_iden_esame,top.opener.array_scheda_appropriatezza);	
		strTmp = top.opener.ritornaInfoEsame(getAllSelectedOptionCode('oEsa_Ref'),top.opener.array_iden_esame,top.opener.array_scheda_appropriatezza);			
		arraySchedeAppropriatezza = strTmp.split("*");
		if (arraySchedeAppropriatezza.length>1){
			for (i=0;i<arraySchedeAppropriatezza.length;i++){
				if (i==0){
					oldValue = arraySchedeAppropriatezza[i];
				}
				else{
					if (oldValue!=arraySchedeAppropriatezza[i]){
						// schede diverse
						bolSchedeUguali = false;
						break;
					}
				}
			}
		}
		else{
			// un solo esame
			bolSchedeUguali = true;
		}
		
	}
	catch(e){
		// errore, magari non esiste l'array
		bolSchedeUguali = false;
	}

	if (!bolSchedeUguali){
		alert("Impossibile continuare. Schede di appropriatezza diverse.");
		return;
	}
	// ORA faccio conrollo che se almeno la prima scheda
	// appropriatezza è vuota (le altre sono uguali alla prima)
	// allora blocco il giro
	try{
		if (arraySchedeAppropriatezza.length>0){
			if (arraySchedeAppropriatezza[0]==""){
				alert("Attenzione! Nessuna scheda appropriatezza associata all'esame/i selezionati.");
				return;
			}
		}
	}
	catch(e){
		;
	}
	
	// tutti gli iden
	iden_esame = getAllSelectedOptionCode('oEsa_Ref');
	// solo il primo iden dell'esame selezionato
	if ((iden_esame=="")||(iden_esame == "")){
		return;
	}
	var finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
	}
	timer = window.setTimeout("try{finestra.focus();}catch(e){;}",500);
}


// controlla e notifica
// se l'utente loggato è diverso da quello refertante
function checkDiversoRefertante(){
	try{
		if ((baseGlobal.NOTIFICA_DIV_REFERTANTE=="S")&&(tipoModalita=="MODIFICA")&&(baseUser.TIPO_MED == 'R')){
			// controllo se il medico refertante è diverso da quello loggato
			if(classReferto.IDEN_MED != baseUser.IDEN_PER ){
				openTimeoutWindow(ritornaJsMsg("jsDivRefertante"),4000);
				//alert(ritornaJsMsg("jsDivRefertante"));
				return;
			}
		}
	}
	catch(e){
		alert("checkDiversoRefertante - Error: " + e.description);
	}
}

// attenzione vedere se inserire
// in home rendendola + parametrica
function openTimeoutWindow(testo, ntime){
	try{
		j$("#myConsoleBody").append("<div id='dialogMedicoRef' title='Attenzione'><p>"+ testo +"</p></div>")

		j$( "#dialogMedicoRef" ).dialog({
			autoOpen: true,
			height: 150,
			width: 300
		});
		setTimeout(function(){
			j$("#dialogMedicoRef").fadeOut("slow", function () {
				j$("#dialogMedicoRef").remove();
			});}, ntime);
	}
	catch(e){
		alert("openTimeoutWindow - Error: " + e.description);
	}
}

// se abilitato
// viene controllo se si sta refertando
// un esame con data futura a quella odierna
function controlloDataFutura(){
	
	var dataEsame = "";
	var dataOggi = "";
	var data = new Date();
	var dd = '00' + data.getDate();
	var mm = '00' + (data.getMonth() + 1);
	var yyyy = data.getYear();	
	
	try{
		if (basePC.NFY_REFERTO_FUTURO=="S"){
			dataEsame = array_dat_esa[0];
			dataOggi = yyyy + mm + dd;			
			if (dataEsame > dataOggi){
//				alert(ritornaJsMsg("jsNfyEsaFuturo"));		
				parent.opener.parent.parent.hideFrame.showTimeoutWindow(400, 100,ritornaJsMsg("jsWarning"), ritornaJsMsg("jsNfyEsaFuturo"), 4000, true);				
			}
		}
	}
	catch(e){
		alert("probably missing NFY_REFERTO_FUTURO field on PC - Error: " + e.description);
	}
}


// funzione che carica le info
// processate dell'esame/i in fase di 
// refertazione. Le info possono dipendere
// da schede correlate quali cardiologia, eco ostetrica ...
var lastIndexProcessedExam = 0;
function callGetReportProcessed(){
	var idenEsame ="";

	try{
		idenEsame = array_iden_esame[lastIndexProcessedExam];
//		alert("@" + idenEsame + "@" + array_iden_esame.length + "@" + lastIndexProcessedExam);				
		dwr.engine.setAsync(false);	
		// ATTENZIONE: per test qui ho messo HTML
		// da mettere sempre TXT !!!
		// o usare tale proprietà solo quando si usa l'oggetto che usa l'html
		if ((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S")){
			ajaxGetReportProcessed.getReportProcessed(idenEsame,"HTML", replyGetReportProcessed);
		}
		else{
			ajaxGetReportProcessed.getReportProcessed(idenEsame,"TXT", replyGetReportProcessed);			
		}
		
		dwr.engine.setAsync(true);	
	}
	catch(e){
		dwr.engine.setAsync(true);			
		alert("callGetReportProcessed - Error: " + e.description);
	}
	finally{
	}
}

function replyGetReportProcessed(returnValue){
	try{
		//alert("#" + returnValue + "#" + array_iden_esame.length + "#" + lastIndexProcessedExam);
		arrayInitialProcessedTextReport[lastIndexProcessedExam] = returnValue;
		//alert("arrayInitialProcessedTextReport.length " + arrayInitialProcessedTextReport.length);
		try{	
			if (lastIndexProcessedExam < parseInt(array_iden_esame.length-1)){
				lastIndexProcessedExam++;
				callGetReportProcessed();
			}
			else{
				// finito
				//alert("arrayInitialProcessedTextReport size: " + arrayInitialProcessedTextReport.length);
			}
		}
		catch(e){
			alert("replyGetReportProcessed - Error: " + e.description);
		}

	}
	catch(e){
		alert("replyGetReportProcessed - Error: " + e.description);		
	}
}

// ritorna un boolean
// indicante:
// true se tutti gli esami in fase di refertazione sono della stessa metodica
// false se NON sono della stessa metodica
function sameModality(){
	var bolEsito = false;
	var oldMet ="";
	try{
		if (array_metodica.length==1){
			bolEsito = true;
		}
		else{
			for(var i =0;i<array_metodica.length;i++){
				if (oldMet==""){
					oldMet = array_metodica[i];
				}
				else{
					if (oldMet!=array_metodica[i]){
						bolEsito = false;
						break;
					}
					else{
						bolEsito = true;
					}
				}
			}
		}
	}
	catch(e){
		alert("sameModality - Error: "+ e.description);
	}
	return bolEsito;
}


// porta la console in primo piano
function bringConsoleToFront(){
	this.focus();
}

// controlla se l'utente ha
// le permissioni di firmare il referto 
// aperto
// Mettere in join il controllo hForceWriting !!
function verificaCdcAbilitatiPerFirma(){
	var abilitato = false;
	var effettuaControllo = true;
	var i=0;

	try{
		try{
			if (forceWritingNoCDCcheck=="S"){
				abilitato = true;
				effettuaControllo = false;
			}
		}
		catch(e){
			effettuaControllo = true;
		}
		if (effettuaControllo){
			for (i=0;i<baseUser.LISTAREPARTI.length;i++){
				if (baseUser.LISTAREPARTI[i]==array_reparto[0]){
					abilitato = true;
					break;
				}
			}
		}
		if (!abilitato){
			disableLinkMedRiferimento(); 
			hideValidaMedSecondo();
			HideLayer("idDivSospeso");			
		}
		
	}
	catch(e){
		alert("verificaCdcAbilitatiPerFirma - Error: " + e.description);
	}
}


// *******************************************************
// *******************************************************
// funzione che costruisce
// e ritorna un divButton cosruito 
// secondo i parametri passatogli (rollover incluso)
function getDivButton(Aid,DIVid,DIVclass,Ahref,Aclass,toolTip,textToAppend){
	
	var divObject;
	var aObject;
	
	try{
		divObject =  document.createElement("DIV");
		divObject.className = DIVclass;	
		divObject.id = DIVid;
		divObject.title = toolTip;
		aObject = document.createElement("A");
		aObject.id = Aid;
		aObject.href = Ahref;
		aObject.className = Aclass;
		aObject.innerHTML = textToAppend;
		divObject.appendChild(aObject);	
	}
	catch(e){
		alert("getDivButton " + e.description);
	}
	
	return divObject;
}


function refertoCardiologico()
{
	var iden_esame;
	var finestra;
	
//	iden_esame = getAllSelectedOptionCode('oEsa_Ref');	
	iden_esame = getAllOptionCode('oEsa_Ref');	
	if(iden_esame=="" || iden_esame == "")
	{
		return;
	}
	
	finestra = window.open("gesCardiologia?chiave="+iden_esame, "", "scrollbars=yes, fullscreen = yes");
	if(finestra){
		finestra.focus();
	}else{
		finestra = window.open("gesCardiologia?chiave="+iden_esame, "", "scrollbars=yes, fullscreen = yes");
	}
}



function initCarouselExam(){
	
	var oggetto;
	var i =0;
	var strToEval = ""; 
	try{
		// prendo la collection dei carousel
		oggetto = document.getElementById("mygallery_esami");
		if (oggetto){
			if (stepcarousel){
				stepcarousel.setup({galleryid: 'mygallery_esami', beltclass: 'beltCarousel_Exam', panelclass: 'panelCarousel_Exam', autostep: {enable:false, moveby:1, pause:3000}, panelbehavior: {speed:300, wraparound:true, persist:true}, defaultbuttons: {enable: true, moveby: 3, leftnav: ['imagexPix/button/mini/arrowl.png', -5, 0], rightnav: ['imagexPix/button/mini/arrowr.png', -10, 0]}, 	statusvars: ['statusA', 'statusB', 'statusC'], contenttype: ['inline']});
			}
		}
		
	}
	catch(e){
		alert("initCarouselExam - Error: " + e.description);
	}
	
}



function getInfoExamViaXml(accNum){
	//alert("Carico le keyimages dentro iframe");
	
	var sql = "";
	var lista ;
	var strWhere = "";
	
	if (accNum==""){return;}
	try{
		// verifico che ci siano delle immagini chiave associate
		// se esistono allora le carico
		lista = accNum.split("*");
		if (lista.length<1){return;}
		for (var i=0;i<lista.length;i++){
			if (strWhere ==""){
				strWhere += " e.iden =" + lista[i] ;
			}
			else{
				strWhere += " OR e.iden=" + lista[i];
			}
		}
		strWhere = "(" + strWhere +")";
		sql = "select e.iden, e.quadro_cli, e.quesito, te.descr descr_esame from esami e , tab_esa te";
		sql += " where (" +strWhere + ")";
		sql += " and e.iden_esa = te.iden";
		getXMLData("",parseSql(sql),"callbackGetInfoExamViaXml");		
	}
	catch(e){
		alert("getInfoExamViaXml - " + e.description);
	}
}


// funzione che viene chiamata in automatico
// dopo che sono state reperite le immagini chiave
function callbackGetInfoExamViaXml(xmlDoc){
	var descrEsame = "";
	var quadro = "";
	var quesito = "";
	var textToShow = "";
	var i = 0;
	var strTmp = "";	

	try{
		descrEsame = getValueXmlTagViaXmlDoc(xmlDoc, "DESCR_ESAME","@").split("@");
		quadro =  getValueXmlTagViaXmlDoc(xmlDoc, "QUADRO_CLI","@").split("@");
		quesito = getValueXmlTagViaXmlDoc(xmlDoc, "QUESITO","@").split("@");
		if (descrEsame.length>0){
			for (i=0;i<descrEsame.length;i++){	
				strTmp += "<li>Esame: " + descrEsame[i] + "</li>";
				if ((quesito[i]!=null)&&(quesito[i]!="")&&(quesito[i]!="null")){
					strTmp += "<li>Quesito: " + quesito[i] + "</li>";		
				}
				if ((quadro[i]!=null)&&(quadro[i]!="")&&(quadro[i]!="null")){				
					strTmp += "<li>Quadro: " + quadro[i] + "</li>";	
				}
				strTmp += "<BR>";					
			}
		}
		textToShow = strTmp;
		textToShow = "<ul>" + textToShow + "</ul>";		
		// *********
		WRAPPER = document.body.id;	
		showHideReportControlLayer(false);		
		showDialog('Elenco esami',textToShow,'warning');
		document.getElementById("dialog-close").onmouseup = function(){try{showHideReportControlLayer(true);}catch(e){;}};
		// *********
		
	}
	catch(e){
		alert("callbackGetInfoExamViaXml - " + e.description);
	}
	
}


function apriInfoListaEsami(){
	
	var textToShow = "";
	var valueComboList;
	var strTmp = "";
	
	try{
		getInfoExamViaXml(getAllOptionCode('oEsa_Ref'));
	}
	catch(e){
		alert("apriInfoListaEsami - Error: " + e.description);
	}	
}

function apriSceltaEsami(){
	try{
		//showCarouselLayer (false);
		showHideReportControlLayer(false);		
		mostraBoxSceltaEsami(true);
	}
	catch(e){
		alert("apriSceltaEsami - Error: " + e.description);
	}		
}

function chiudiSceltaEsami(){
	try{
		//showCarouselLayer(true);
		showHideReportControlLayer(true);
		mostraBoxSceltaEsami(false);
		updateCarouselBeltExam();
	}
	catch(e){
		alert("chidiSceltaEsami - Error: " + e.description);
	}	
}


function updateCarouselBeltExam(){
	var panelCollection;
	try{
		panelCollection = getElementsByAttribute(document.body, "*", "className", "panelCarousel_Exam");
		for (var i =0;i<panelCollection.length;i++){
			if(panelCollection[i].id!=""){
				removeHtmlElementById(panelCollection[i].id);			
			}
		}
		addPanelToBelt("idbeltCarousel_Exam");
		// seleziono il primo esame preso della lista nascosta
		setSelectedExamInCarousel(getAllOptionCode('oEsa_Ref').split("*")[0]);
		// controllo classi relative al completamento schede personalizzate
		fixCarouselExamClass();		
	}
	catch(e){
		alert("updateCarouselBeltExam - Error: " + e.description);
	}
}

// funzione utile
// per nascondere i caroselli (workround per problema sovrapposizione livelli)
function showCarouselLayer(flag){
	try{
		//mygallery_esami
		// mygallery_0
		if (flag){
			document.getElementById("mygallery_esami").style.visibility = "visible";			
			document.getElementById("mygallery_0").style.visibility = "visible";						
		}
		else{
			document.getElementById("mygallery_esami").style.visibility = "hidden";	
			document.getElementById("mygallery_0").style.visibility = "hidden";				
		}
	}
	catch(e){
		alert("showHideCarouselLayer - Error: " + e.description);		
	}
}



// aggiugo elementi al carosello degli esami !!
function addPanelToBelt(idBeltWhereAttach){
	var belt ;
	var gallery ;
	var newAttr;
	var panel;
	var span;
	var aLink;
	var img;
	var label;
	var i=0;
	var valueComboList = "";
	var textComboList = "";
	var strToEval = "";
	
	try{
		if (idBeltWhereAttach==""){return;}
		belt = document.getElementById(idBeltWhereAttach);
		if (belt){
			// devo crearla
			// prendo solo esami selezionati
			valueComboList = getAllOptionCode('oEsa_Ref').split("*");
			textComboList = getAllOptionText('oEsa_Ref').split("*");
			for (i=0;i<valueComboList.length;i++){
				valueCombo = valueComboList[i];
				textCombo = ritornaInfoEsame(valueCombo, array_iden_esame, array_descr_esame);
				// panel
				panel = document.createElement('DIV');
				panel.className = "panelCarousel_Exam";
				panel.id = "panelCarousel_Exam_" + i;
				// ****
				
				// SPAN
				span = document.createElement('SPAN');
				span.className = "singleElemCarousel_Exam";
				// ****
				
				// aLink
				aLink = document.createElement('A');
				aLink.href ="#";
		
				strToEval = "aLink.onclick = function(){try{javascript:updateSelectedExam(" + valueCombo +")}catch(e){;}};";
				eval(strToEval);
				// ****
				// img
				img = document.createElement('IMG');
				img.alt = textCombo;
				img.border = 0;
				img.src = "imagexPix/button/mini/info.png";
				img.id = "imgCarousel_Exam" + valueCombo;
				img.setAttribute("relatedIdenEsa", valueCombo);
				// ****
				
				// LABEL
				label = document.createElement('LABEL');
				newAttr = document.createAttribute('title');
				newAttr.value = textCombo;
				label.setAttributeNode(newAttr);					
				label.className = "labelSingleElemCarousel_Exam";
				label.innerHTML = limitazioneTesto(textCombo,20,"...");
				// ****
				
				// appendo
				aLink.appendChild(img);
				aLink.appendChild(label);
				span.appendChild(aLink);
				panel.appendChild(span);
				belt.appendChild(panel);
				
			} // fine for
		}
	}
	catch(e){
		alert("addPanelToBelt - Error: " + e.description);
	}

}

function creaBoxSceltaEsami(){
	
	var divObject ;
	var spanObject ;
	
	
	try{
		divObject =  document.createElement("DIV");
		divObject.id = "sceltaEsamiBox";	
		divObject.innerHTML = document.frmMain.HSCELTA_ESAMI.value;	
		document.body.appendChild(divObject);
	}
	catch(e){
		alert("creaBoxSceltaEsami - Error: " + e.description);
	}	
}

function mostraBoxSceltaEsami(bolStato){
	var oggetto;
	var label ;
	try{
		oggetto = document.getElementById("sceltaEsamiBox");
		//oggetto.height = document.body.scrollTop + screen.availHeight;
		// setto altezza layer 
		// limitatamente alla parte sopra all'oggetto di refertazione
		// in quanto nel caso di uso di ocx questo rimarrebbe sempre in primo piano
		oggetto.height = document.getElementById("divFirstLayout").style.height + document.getElementById("divSecondLayout").style.height + 25;
		oggetto.style.top = document.body.scrollTop;
		if (oggetto){
			if (bolStato){
				oggetto.style.visibility = "visible";				
			}
			else{
				oggetto.style.visibility = "hidden";				
			}

		}

	}
	catch(e){
		alert("mostraBoxSceltaEsami - Error: " + e.description);
	}
}


// dopo primo salvataggio
// deve essere chiamata questa funzione
// che inibisce il link per aprire la 
// scelta degli esami 
function disabEsamiLink(){
	var aLink;
	try{
		try{document.getElementById("lblESAMI").className = "";}catch(e){;}
		aLink = document.getElementById("idLinkSceltaEsami");
		if (aLink){
			aLink.onclick = function(){alert("Registrazione già effettuata. Impossibile modificare elenco esami.");return true;};
		}
	}
	catch(e){
		alert("disabEsamiLink - Error: " + e.description);
	}
}

// ****
// funzione usata per 
// nascondere il controllo
// per la scrittura del referto
// true: mostra
// false: nascondi
function showHideReportControlLayer(value){
	try{
		if (value){
			document.getElementById("idDivReportControl").style.visibility = "visible";					
		}
		else{
			document.getElementById("idDivReportControl").style.visibility = "hidden";								
		}

	}
	catch(e){
		alert("showHideReportControlLayer - Error: " + e.description);
	}	

}


function showImgSelector(){
//	apro selettore immagini
	var idenEsa = "";
	try{	
		idenEsa = ritornaInfoEsame(getAllOptionCode('oEsa_Ref'), array_iden_esame,array_iden_esame);
	
		var finestra = window.open("keySelector?idenEsa=" + idenEsa,"","status=yes,scrollbars=no,height=" + screen.availHeight +",width="+ screen.availWidth+ ", top=0, left=0");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open("keySelector?idenEsa=" + idenEsa,"","status=yes,scrollbars=no,height=" + screen.availHeight +",width="+ screen.availWidth+ ", top=0, left=0");		
		}
	}
	catch(e){
		alert("showImgSelector - Error: " + e.description);		
	}	
}







// ***************************************************************************
function apriDialogConclusioni(){
	var suggerimenti = "";
	var conclusioni = "";
	var oggetto;
	var editor;
	try{
		showHideReportControlLayer(false);
		try{
			if (basePC.ABILITA_HYPERSM_SDK != "S"){
				setStyleEditor("conclusioni","mceContentBody_whiteStyle");
	//			setStyleEditor("suggerimenti","mceContentBody");			
			}	
		}		catch(e){;}
		j$('#dialog-form').dialog('open');

		// oggetto = document.getElementById("HsuggerimentiHTML");
		oggetto = document.frmMain.HsuggerimentiHTML;
		
		if (oggetto){
			editor = tinyMCE.get('suggerimenti');
			suggerimenti = oggetto.value;
			if (editor){
				editor.setContent(suggerimenti);
			}
			else{
				alert("Errore: Non esiste oggetto suggerimenti");
			}
		}
		//oggetto = document.getElementById("HconclusioniHTML");
		oggetto = document.frmMain.HconclusioniHTML;
		if (oggetto){
			conclusioni = oggetto.value;
			editor = tinyMCE.get('conclusioni');
			if (editor){
				editor.setContent(conclusioni);
			}			
		}
	}
	catch(e){
		alert("apriDialogConclusioni - Error: " + e.description);
	}
}


// tiene allineati i valori dei textarea
// con i campi hidden
function aggiornaValoriSuggConclChiudi(){
	try{
		var oggetto;		
		var value = "";
		
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){	
			strOutput = myEditor.getContent();
		}
		
		oggetto = tinyMCE.get("suggerimenti");
		if (oggetto){
			document.frmMain.HsuggerimentiHTML.value = oggetto.getContent();
		}
		oggetto = tinyMCE.get("conclusioni");	
		if (oggetto){
			document.frmMain.HconclusioniHTML.value = oggetto.getContent();
		}		
		
		// infine chiudo
		j$('#dialog-form').dialog('close');	
		showHideReportControlLayer(true);
		// quando chiudo risetto il fuoco
		// sul controllo del testo del referto
		setFocusOnReportControl();		
	}
	catch(e){
		alert("apriDialogConclusioni - Error: " + e.description);
	}	
}


// worklist/consoleSaveFunction

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
var finestraCheckUserPwd;

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
	if (isRegularConsole()){
		document.frmMain.txt_DESCR_SEC_MEDICO.value = baseUser.DESCRIPTION;
		document.frmMain.HIDEN_MED2.value = baseUser.IDEN_PER;
	}
}

// funzione che richiama funzioni di jack
// per autenticazione utente loggato
function richiestaAutenticazione(callback){
	try{
		document.richiediUtentePassword.setRichiediPwdRegistra(true);
		showHideReportControlLayer(false);
//		showThirdLayout(false);
		// rimappo callback nel caso di ok
		callback = ("showHideReportControlLayer(true);try{document.getElementById('divAttesa').style.visibility = 'hidden';}catch(e){;}") + callback;
		// aggancio callback nel caso di annulla
		//document.richiediUtentePassword.annulla = function(){showThirdLayout(true);};
		document.richiediUtentePassword.annulla = function(){showHideReportControlLayer(true);try{document.getElementById('divAttesa').style.visibility = 'hidden';}catch(e){;}};		
		// valorizzo utente iniziale
		document.richiediUtentePassword.USERNAME = baseUser.LOGIN;
		// nel caso esistesse il velo nero lo mostro		
		try{document.getElementById("divAttesa").style.visibility = "visible";}catch(e){;}
		document.richiediUtentePassword.view(callback,"S");	
		try{document.getElementById("txtRichiestaPassword").focus();}catch(e){;}
		try{document.getElementById("txtRichiestaUtente").value = baseUser.LOGIN;}catch(e){;}
	}
	catch(e){
		alert("richiestaAutenticazione - Error: " + e.description);
	}
}

function showThirdLayout(value){
	if (value){
		// nascondo eventuale velo nero di jack
		try{document.getElementById("divAttesa").style.visibility = "hidden";}catch(e){;}
		// mostra
		try{document.getElementById("divThirdLayout").style.visibility = "visible";}catch(e){alert("showThirdLayout - Error:" + e.description);}
	}
	else{
		// nascondi
		try{document.getElementById("divThirdLayout").style.visibility = "hidden";}catch(e){alert("showThirdLayout - Error:" + e.description);}	
	}
}

// funzione che registra
function registra(){
	
	var i = 0;
	var strTmp = ""; 
	var arraySchedeAppropriatezza;
	var bolSchedaApppropriatezzaVuota = true;
	//alert("registra");
	//LogJavascript.WriteInfo("consolleSaveFunction*start registra",deallocaLogJavascript);				
	if (registrazioneAbilitata==false){
		return;
	}
	// modifica 27-5-15
	if (NS_SCHEDA_REFERTAZIONE.scheda == null) {
		try{scriviLog("\n*******************************\nUtente: " + baseUser.LOGIN +", " + baseUser.IDEN_PER +"\nPc: " + basePC.IP + "\nIdenAnag: "+ globalIdenAnag +"\nIdenEsami: " + getAllOptionCode('oEsa_Ref') +"\nReferto.IDEN: " + classReferto.IDEN +"\nmodulo_refertazione: " + modulo_refertazione);}catch(e){;}	
		try{scriviLog(window.frames[reportControlID].getFormValueInXml()+"\n*******************************\n");}catch(e){;}
	}
	// ********************	
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
	// riattivo per gestire il check per cardiologia 
	// modifica aldo 26-9-2014
	try{
		if (j$("#checkOkFirma").attr("checked") =="checked"  || j$("#checkOkFirma").attr("checked")==true ){ 
			document.frmMain.Hok_firma.value='S';
		}
		else{
			document.frmMain.Hok_firma.value='';
		}
	}
	catch(e){
		// gestisco eccezione 
		try{document.frmMain.Hok_firma.value='';	}catch(e){;}
	}
	//	***************
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

function registraAfterCheck() {
	// nuovo privacy
	try{
		if (salvaOscuramentoCittadino()==false){return;}
	}catch(e){;}
	//****************

	if (NS_SCHEDA_REFERTAZIONE.scheda != null) 
		NS_SCHEDA_REFERTAZIONE.salvaSchedaStrutturata({"callback": registraAfterSalvaScheda});
	else 
		registraAfterSalvaScheda();
}
function registraAfterSalvaScheda(){

	// ************************
	// lettura reparto
	if (isRegularConsole()){
		document.frmMain.HREPARTO.value = getValue("idReparto");
		// **** aggiorno la form
		// di stampa affinchè prenda il layout report corretto 
		document.frmStampa.stampaReparto.value = getValue("idReparto");		
	}
	else{
		document.frmMain.HREPARTO.value = array_reparto[0];
		document.frmStampa.stampaReparto.value = array_reparto[0];
	}

	// estrapolo codici degli esami che si stanno refertando
	// e non sono stati esclusi
	document.frmMain.HIDEN_ESA.value = getAllOptionCode('oEsa_Ref');
	// tiro fuori gli esami esclusi
	// per NON aggiornare gli operatori di tutto il pacchetto 
	// che ha lo stesso numero accettazione
	document.frmMain.HIDEN_ESA_TO_EXCLUDE.value = getAllOptionCode('oEsa_Escl');	
	
	
	// ********************** 
	// ***** AMBULATORIO
	try{
		var todoNext = "";
		
		// ************************** modifica aldo 20131230
		// salvo la sala se e solo se è cambiata
		if (getValue("selSale")==""){
			try{alert("Attenzione: il codice stanza è nullo, verrà quindi mantenuto il valore originale.\nContattare l'amministratore di sistema indicando codice (iden=" + array_iden_esame +")");}catch(e){;}
		}
		else{
			if (getValue("selSale")!= gblJsonSalEsame.IDEN){
				// salvo iden_sal per tutti gli esami in refertazione
				var myLista = new Array();
				myLista.push(getValue("selSale"));
				myLista.push(array_iden_esame.toString());
				var stm = parent.opener.top.executeStatement('consolle.xml','updateIdenSal',myLista,0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nel salvataggio della sala");
				}
				else{
					//alert("Elementi aggiornati correttamente.");
					gblJsonSalEsame.COD_DEC = "";
					gblJsonSalEsame.DESCR = getText("selSale");
					// non lo conosco, quindi 
					gblJsonSalEsame.IDEN = getValue("selSale");
				}
			}
		}
		// appena salvata aggiorno il valore json locale
		// ***********************************************************
		
		// faccio questa approssimazione 
		// x ora limitandomi al primo valore;
		if (!isRegularConsole()){
			// chiamo funzione per validare i dati 
			try{
				if (!window.frames[reportControlID].validateModule()){
					alert("Impossibile validare il modulo");
					return;
				}
			}
			catch(e){
				alert("Error validating frame");
				return;
			}
			if (document.frmMain.HactionAfterSave.value !="DEFINITIVO"){todoNext = "BOZZA";}else{todoNext = "DEFINITIVO";}
			if (!window.frames[reportControlID].getDatiXmlAndSave(todoNext, modulo_refertazione)){
				//errore
				return;
			}
			//alert("chiamata fatta");
		}
		
	}
	catch(e){
		alert("registraAfterCheck -  Error ambulatorio" + e.description);
	}
	//return;
	// ********
	// **********************
	// estrapolo testo referto
	//LogJavascript.WriteInfo("consolleSaveFunction*call getReportControlTXT",deallocaLogJavascript);			
	if (NS_SCHEDA_REFERTAZIONE.scheda != null) {
		document.frmMain.HTESTO_TXT.value = NS_SCHEDA_REFERTAZIONE.testoPianoReferto;//getReportControlTXT();
	} else {
		document.frmMain.HTESTO_TXT.value=getReportControlTXT();
	}	

	if (document.frmMain.HTESTO_TXT.value==""){
		alert(ritornaJsMsg("jsmsgRefVuoto"));
		return;
	}
	// ****************************
	// ******** MED INIZIATIVA
	// ****************************
	// modifica 11-6-15
	try{
	if (glbMedIniziativa){
		 // da completare		
		 if (globalIdenAnag=="undefined"||globalIdenAnag==""||typeof(globalIdenAnag)=="undefined"){
			 var structData = {"IDEN_ANAG":globalIdenAnag,"IDEN_MED_BASE":baseUser.IDEN_PER,"DATA_NOTA":(new String("")).getTodayStringFormat(),"NOTA":document.frmMain.HTESTO_TXT.value,"TIPOLOGIA":"NOTA","SORGENTE":"AMBU"};			 
		 }
		 else{
			 var structData = {"IDEN_ANAG":document.frmListaPrecedenti.idenAnag.value,"IDEN_MED_BASE":baseUser.IDEN_PER,"DATA_NOTA":(new String("")).getTodayStringFormat(),"NOTA":document.frmMain.HTESTO_TXT.value,"TIPOLOGIA":"NOTA","SORGENTE":"AMBU"};			 
		 }
//		 parent.top.opener.top.gestioneNotifiche.sendMessage("MMG",JSON.stringify(structData));
		 parent.top.opener.top.gestioneNotifiche.sendMessage("MMG",structData);
	}}catch(e){alert(e.description +"!");}
	// ****************************
	//LogJavascript.WriteInfo("consolleSaveFunction*call getReportControlRTF",deallocaLogJavascript);
	document.frmMain.HTESTO_RTF.value=getReportControlRTF();
	document.frmMain.HTESTO_HTML.value=getReportControlHTML();	

	// ******************************
	// *** attenzione togliere !!!
	// ******************************
	//alert("TXT: " + document.frmMain.HTESTO_TXT.value);
	//alert("HTML: " + document.frmMain.HTESTO_HTML.value);
//	return;
	// ******************************
	
	// 20090828
	try{mostraBoxAttesa(true,"Registrazione in corso, attendere prego...");}catch(e){;}
	// ***********
	
	
	// apro finestra salvataggio
	var saveWindow = window.open("","wndSaveReport","top=8000,left=6000,width=1px,height=1px");
	if (saveWindow){
		saveWindow.focus();
	}
	else{
		saveWindow = window.open("","wndSaveReport","top=8000,left=6000,width=1px,height=1px");
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

// ********************** 
// ***** AMBULATORIO
// **********************
function isRegularConsole(){	
		
	if (NS_SCHEDA_REFERTAZIONE.scheda!= null)
		return true;
	
	var bolEsito = true;
	
	try{
		// nuovo privacy
		if (listaModuliConsole[0]!="" || modulo_refertazione!=""){
			bolEsito = false;
		}
	}
	catch(e){
		bolEsito = true;
	}
	return bolEsito ;
}

// **********************


// ******************************************
// **************** 20120109 ****************
// ******************************************
function updateIdenRefSchedaConsole(idenRef){
	var i=0;
	var sql = "";
	var elFound = false;
	try{
		if (idenRef==""){return;}
		// mettere controllo per 
		// vedere quando fare salvataggio
		// se è già firmato ho già associato
		// il referto alla scheda 
		if (classReferto.FIRMATO.toString() !="S"){		
			// ciclo su tutte le schede SALVATE
			for  (i=0;i<listaIdenSchedaConsole.length;i++){
				if (listaIdenSchedaConsole[i]!=""){
					// esiste scheda salvata associata
					// alert("salvo idenRef: " + idenRef + " per idenScheda: " + listaIdenSchedaConsole[i]);
					// listaIdenEsame_SchedaConsole
					// listaIdenSchedaConsole
					// listaSchedaConsole				
					// ATTENZIONE !! VERIFICARE che l'esame di tale scheda faccia parte di quelli selezionati
					// perchè potrei compilare ua scheda quindi togliere l'esame dall'elenco! 
					// Devo quindi escluder questi casi!!
					elFound =containElementByValue("oEsa_Ref", listaIdenEsame_SchedaConsole[i])
					// alert(elFound + " " +  listaIdenEsame_SchedaConsole[i]);
					if (elFound){
						// lo contiene, quindi salvo idenRef a relativo valore 
						sql = "update " + listaSchedaConsole[i] + " set iden_ref=" + idenRef + " where iden = " + listaIdenSchedaConsole[i] + " and iden_esame=" + listaIdenEsame_SchedaConsole[i];
						//alert(sql);
						dwr.engine.setAsync(false);
						toolKitDB.executeQueryData(sql, function(risp){})
						dwr.engine.setAsync(true);						
					}
				}
			}
		}
	}
	catch(e){
		alert("updateIdenRefSchedaConsole - Error:" + e.description);
	}
	

	
}


// funzione che verrà chiamata
// dopo la fase di registrazione
// NB ANCHE se non si deve fare nulla!
function afterSave(valore){

	// ***************
	// modifica 1-10-15
	// *****************	
	try{
		if (parent.top.opener.top.home.getConfigParam("SITO")=="SAVONA"){
			var costInizioCiclo = "CICLICA";
			for (var k=0;k<array_iden_esame.length;k++){
				// updateStatoCiclo_NonAncoraEseguiti
				// consolle.xml
				// iden_esa, costInizioCiclo
				var stm = parent.opener.top.executeStatement('consolle.xml','updateStatoCiclo_NonAncoraEseguiti',[array_iden_esame[k],costInizioCiclo],0);
				if (stm[0]!="OK"){
					alert("Errore: " + stm[1]);
				}
			}
		}
	}catch(e){;}
	// ******

	if (NS_SCHEDA_REFERTAZIONE.scheda != null) {
		NS_SCHEDA_REFERTAZIONE.updateVersioneScheda(function() {
			afterUpdateVersione(valore);
		});	
	} else
		afterUpdateVersione(valore);
}

function afterUpdateVersione(valore)
{
	// ambulatorio
	try{
		if(typeof _TIPO_NC_SELEZIONATO != 'undefined')
		{
			if(_TIPO_NC_SELEZIONATO != '')
			{
				dwr.engine.setAsync(false);
				//alert("update ESAMI set " + _TIPO_NC_SELEZIONATO + " = '1' where IDEN in (" + getAllOptionCode('oEsa_Ref').replace(/\*/g,",") + ")");
				toolKitDB.executeQueryData("update ESAMI set " + _TIPO_NC_SELEZIONATO + " = '1' where IDEN in (" + getAllOptionCode('oEsa_Ref').replace(/\*/g,",") + ")", function(risp){})
				dwr.engine.setAsync(true);
			}
		}
	}
	catch(e){
		;
	}

	try{
		// ******************************************
		// **************** 20120109 ****************
		// salvare idenRef per tutte le schede console
		// collegate !!!
		updateIdenRefSchedaConsole(classReferto.IDEN);
		// ******************************************

		var bolTmp;
		//LogJavascript.WriteInfo("consolleSaveFunction*start afterSave valore: " + valore,deallocaLogJavascript);	
		registrazioneEffettuata = true;

		// 20090828
//		try{mostraBoxAttesa(false,"");}catch(e){;}
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
		// *********
		// controllare una variabile
		// pubblica per eseguire la funzione richiesta dopo la 
		// registrazione del referto
		switch(valore.toUpperCase()){
		case "DEFINITIVO":
			//LogJavascript.WriteInfo("consolleSaveFunction*call saveDefinitivo",deallocaLogJavascript);	
			if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
				// 20100210
				//getDose();
				// 20090828
				try{mostraBoxAttesa(false,"");}catch(e){;}
				// ***********
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
			// 20100210			
			//getDose();
			callFirmaDigitale();			
			break;
		}
	}
	catch(e){
		alert("afterSave - Error : " + e.description);
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
		// modifica 27-5-15
		if (NS_SCHEDA_REFERTAZIONE.scheda != null) {
			try{scriviLog("\n*******************************\nUtente: " + baseUser.LOGIN +", " + baseUser.IDEN_PER +"\nPc: " + basePC.IP + "\nIdenAnag: "+ globalIdenAnag +"\nIdenEsami: " + getAllOptionCode('oEsa_Ref') +"\nReferto.IDEN: " + classReferto.IDEN +"\nmodulo_refertazione: " + modulo_refertazione);}catch(e){;}	
			try{scriviLog(window.frames[reportControlID].getFormValueInXml()+"\n*******************************\n");}catch(e){;}
		}
		// ********************			
		
		// ********************** 
		// ***** AMBULATORIO
		try{
			// faccio questa approssimazione 
			// x ora limitandomi al primo valore;
			if (!isRegularConsole()){
				if (!window.frames[reportControlID].getDatiXmlAndSave("DEFINITIVO", modulo_refertazione)){
					//errore
					return;
				}
				//alert("chiamata fatta");
			}
			
		}
		catch(e){
			alert("registraAfterCheck -  Error ambulatorio" + e.description);
		}
		// **********************
		// nuovo privacy
		try{
			if (salvaOscuramentoCittadino()==false){return;}
		}catch(e){;}
		//****************		
		if (NS_SCHEDA_REFERTAZIONE.scheda!= null) 
			NS_SCHEDA_REFERTAZIONE.salvaSchedaStrutturata({"callback" : saveDefinitivo});
		else
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
	if (isRegularConsole()){
		updateClassReferto(document.frmMain.HREPARTO.value,document.frmMain.HIDEN_MEDR.value, document.frmMain.HIDEN_MED2.value,"S");
	}
	else{
		// ambulatorio
		// layout senza gestione sec.medico
		document.frmMain.HREPARTO.value = array_reparto[0];
		updateClassReferto(document.frmMain.HREPARTO.value,document.frmMain.HIDEN_MEDR.value, "","S");
	}
	document.frmDefinitivo.HupdateReportText.value="S";
	if (NS_SCHEDA_REFERTAZIONE.scheda!= null)
		document.frmDefinitivo.HTESTO_TXT.value= NS_SCHEDA_REFERTAZIONE.testoPianoReferto;
	else
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
	// ****************************
	// ******** MED INIZIATIVA
	// ****************************
	// modifica 11-6-15
	try{
	if (glbMedIniziativa){
		 // da completare
		 // oltre al testo del referto metterei da quale ambu è stato prodotto
		 // da chi e quando
	 // da completare		
		 if (globalIdenAnag=="undefined"||globalIdenAnag==""||typeof(globalIdenAnag)=="undefined"){
			 var structData = {"IDEN_ANAG":globalIdenAnag,"IDEN_MED_BASE":baseUser.IDEN_PER,"DATA_NOTA":(new String("")).getTodayStringFormat(),"NOTA":document.frmMain.HTESTO_TXT.value,"TIPOLOGIA":"NOTA","SORGENTE":"AMBU"};			 
		 }
		 else{
			 var structData = {"IDEN_ANAG":document.frmListaPrecedenti.idenAnag.value,"IDEN_MED_BASE":baseUser.IDEN_PER,"DATA_NOTA":(new String("")).getTodayStringFormat(),"NOTA":document.frmMain.HTESTO_TXT.value,"TIPOLOGIA":"NOTA","SORGENTE":"AMBU"};			 
		 }
		 parent.top.opener.top.gestioneNotifiche.sendMessage("MMG",structData);
	}}catch(e){alert(e.description +"!!");}
	// ****************************		
	parent.opener.top.home.apri_attesa();	
	document.frmDefinitivo.idenEsame.value = array_iden_esame[0];
	document.frmDefinitivo.HidenMedFirma.value = document.frmMain.HIDEN_MEDR.value;
	if (isRegularConsole()){
		document.frmDefinitivo.HidenSecondoMed.value = document.frmMain.HIDEN_MED2.value;
	}
	// tolto quando si è tolta la prima riga dal layout
//	document.frmDefinitivo.HOPERATORE.value = document.frmMain.HOPERATORE.value
	document.frmDefinitivo.HREPARTO.value = document.frmMain.HREPARTO.value;
	// verificare
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		document.frmDefinitivo.HactionAfterSigned.value="FIRMADIGITALE";			
	}
	else{
		// attenzione VERIFICARE !! (Aldo)
		document.frmDefinitivo.HactionAfterSigned.value="STAMPA";	
	}

	changeValidationIcon();
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
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
		var finestraDefinitivo = window.open("","wndDefinitivo","top=8000,left=6000,width=10px,height=10px,status=yes");
		if(finestraDefinitivo){
			finestraDefinitivo.focus();
		}
		else{
			finestraDefinitivo = window.open("","wndDefinitivo","top=8000,left=6000,width=10px,height=10px,status=yes");
		}	
		document.frmDefinitivo.submit();		
	}
}

// funzione che 
// cambia le icone perchè si è validato il referto
// attenzione: per ora le icone sono diverse solo nel 
// caso di firma NON digitale
function changeValidationIcon (){
	var oggetto;
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
	var oggetto;
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
	
	try{
		// per savona ***
		if (bolSospeso){
			alert("Referto sospeso. Togliere la sospensione prima di continuare.");
			return;
		}
		// ****
		if (classReferto.IDEN!=null && classReferto.IDEN!='')
		{		

			if (NS_SCHEDA_REFERTAZIONE.scheda!=null) 
				document.frmFirmaDigitale.HTESTO_TXT.value = NS_SCHEDA_REFERTAZIONE.testoPianoReferto;
			else
				document.frmFirmaDigitale.HTESTO_TXT.value = getReportControlTXT();
				
			document.frmFirmaDigitale.HTESTO_RTF.value = getReportControlRTF();
			// verificare che ritorni html
			document.frmFirmaDigitale.HTESTO_HTML.value = getReportControlHTML();
			// *** ambulatorio
			// ATTENZIONE faccio approssimazione : avrò sempre
			// un solo esame da refertare
			if (!isRegularConsole()){
				document.frmFirmaDigitale.H_XML_MODULE_OUTPUT.value = window.frames[reportControlID].getFormValueInXml();
				document.frmFirmaDigitale.H_HTML_MODULE_OUTPUT.value = window.frames[reportControlID].getDatiHtmlFormatted("",modulo_refertazione);
				//alert("document.frmFirmaDigitale.H_HTML_MODULE_OUTPUT.value " + document.frmFirmaDigitale.H_HTML_MODULE_OUTPUT.value);
			}
			
			// **************
			finestraCheckUserPwd = window.open("","wndFirmaDigitale","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
			if(finestraCheckUserPwd){
				finestraCheckUserPwd.focus();
			}
			else{
				finestraCheckUserPwd = window.open("","wndFirmaDigitale","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=yes, fullscreen = yes");
			}					
			document.frmFirmaDigitale.idenRef.value = classReferto.IDEN;
			// ambulatorio
			if (isRegularConsole()){
				document.frmFirmaDigitale.HREPARTO.value = getValue("idReparto");				
			}
			else{
				// prendo CDC dell'esame
				document.frmFirmaDigitale.HREPARTO.value  =	array_reparto[0];
			}
			
			if (isRegularConsole()){
				document.frmFirmaDigitale.HidenSecondoMed.value = document.frmMain.HIDEN_MED2.value;
			}
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
	var bolEsito = false;
	// è possibile che non sia stato nessun medico di riferimento
	// fino alla validazione
	// apro finestra validazione
	//LogJavascript.WriteInfo("consolleSaveFunction*start validaMedRiferimento",deallocaLogJavascript);
	
	if (basePC.ABILITA_FIRMA_DIGITALE=="S"){
		// per savona ***
		if (bolSospeso){
			alert("Referto sospeso. Togliere la sospensione prima di continuare.");
			return;
		}
		// ****
		definitivo();
	}
	else{
		// firma LEGGERA !!
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
			// ambulatorio
			if (isRegularConsole()){
				document.frmMain.HREPARTO.value = getValue("idReparto");				
			}
			else{
				// prendo CDC dell'esame
				document.frmMain.HREPARTO.value  =	array_reparto[0];
			}
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
	// ambulatorio
	if (!isRegularConsole()){document.frmMain.HREPARTO.value  =	array_reparto[0];	}
	// **
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
	var userTipoMed = "";
	var login = "";
	
	
	//alert("dopoValidaMedRif " + valore);
	
	//LogJavascript.WriteInfo("consolleSaveFunction*start dopoValidaMedRiferimento",deallocaLogJavascript);
	if (valore==""){
		return;
	}
	// devo , in base ai valori ritornati
	// aggiornare il campo del medico di riferimento
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
		if (userTipoMed.toString()!="R"){
			// medicon NON refertante
			alert(ritornaJsMsg("jsmsgUteNonRefert"));
			return;
		}
	}
	
	if (cdcReferto==""){
		try{
			cdcReferto = array_reparto[0];
		}
		catch(e){		
			alert(ritornaJsMsg("jsmsgCdcVuoto"));
			return;
		}
	}	
	document.frmMain.txt_DESCR_REFERTANTE.value=descrMed;
	document.frmMain.HIDEN_MEDR.value = idenMed;
	if (classReferto.FIRMATO.toString() !="S"){
		// blocco il combo
		// e aggiungo l'elemento che mi interessa
		// indipendentemente che esista già
		// *********
		// ambulatorio
		// *********
		if (document.getElementById("idReparto")){
			add_elem("idReparto", cdcReferto, cdcReferto);
			// 	infine lo seleziono
			document.all.idReparto.selectedIndex = document.all.idReparto.length -1 ;
			document.all.idReparto.disabled = true;
		}
		// **************
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
	var userTipoMed = "";

	
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
	var objectAlink;
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
	objectNode = document.getElementById("lblDESCR_SEC_MEDICO");
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
	
	var collection	;
	var el;
	
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

			document.getElementById("lbltitoloTestoReferto").innerText = "Sospeso";
			document.getElementById("lbltitoloTestoReferto").style.color = "yellow";
			document.getElementById("lbltitoloTestoReferto").style.backgroundColor = "red";
	
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

			try{
				collection = getElementsByAttribute(document.body, "*", "alt", "Ordina Img");
				for (var k=0;k<collection.length;k++){
					el = collection[k].parentNode.parentNode.parentNode;
					el.parentNode.removeChild(el);
				}
				collection = getElementsByAttribute(document.body, "*", "alt", "Prendi KeyImg");
				for (var k=0;k<collection.length;k++){
					el = collection[k].parentNode.parentNode.parentNode;
					el.parentNode.removeChild(el);
				}					
			}
			catch(e){
				alert(e.description);
			}
			// ******
			document.getElementById("lbltitoloTestoReferto").innerHTML = "&nbsp;";
			document.getElementById("lbltitoloTestoReferto").style.color = "";
			document.getElementById("lbltitoloTestoReferto").style.backgroundColor = "";
					
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
		// ambulatorio
		if (!isRegularConsole()){document.frmMain.HREPARTO.value  =	array_reparto[0];}
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
	var userTipoMed = "";
	var login = "";
	
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
	// OK*2945*zak*PADOLECCHIA DR R.*RADIO*M*I
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
};

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
	var oggetto;
	var spanObj;
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


// aldoutil.js
// JavaScript Document

// accetta la data in formato 
// dd/mm/yyyy
// ritorna GLI ANNI 
function retrieveAge(data){

 var bD;
 var strOutput = "";
	
 now = new Date();
 bD = data.split('/');
 
 if(bD.length==3){
   born = new Date(bD[2], bD[1]*1-1, bD[0]);
   years = Math.floor((now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
   strOutput = years;
 }
 return strOutput;
}



var startyear = "1950";
var endyear = "2010";
var dat = new Date();
var curday = dat.getDate();
var curmon = dat.getMonth()+1;
var curyear = dat.getFullYear();
function checkleapyear(datea)
{
	if(datea.getYear()%4 == 0)
	{
		if(datea.getYear()% 10 != 0)
		{
			return true;
		}
		else
		{
			if(datea.getYear()% 400 == 0){
				return true;
			}else{
				return false;}
		}
	}
return false;
}
function DaysInMonth(Y, M) {
    with (new Date(Y, M, 1, 12)) {
        setDate(0);
        return getDate();
    }
}
function datediff(date1, date2) {
    var y1 = date1.getFullYear(), m1 = date1.getMonth(), d1 = date1.getDate(),
	 y2 = date2.getFullYear(), m2 = date2.getMonth(), d2 = date2.getDate();

    if (d1 < d2) {
        m1--;
        d1 += DaysInMonth(y2, m2);
    }
    if (m1 < m2) {
        y1--;
        m1 += 12;
    }
    return [y1 - y2, m1 - m2, d1 - d2];
}

// ritorna la l'età in giorni*mesi*anni
function calage(giorno, mese, anno)
{
	var calday = giorno;
	var calmon = mese;
	var calyear = anno;

	var curd = new Date(curyear,curmon-1,curday);
	var cald = new Date(calyear,calmon-1,calday);

	var diff =  Date.UTC(curyear,curmon,curday,0,0,0) - Date.UTC(calyear,calmon,calday,0,0,0);

	var dife = datediff(curd,cald);

	return dife[2] +"*" + dife[1] + "*" + dife[0];
	

}


// worklist/preocessReportText/processTextFunction

// funzione che appoggiandosi a
// arrayInitialProcessedTextReport
// ritornerà il testo iniziale secondo le 
// situazioni del caso (metodica, sito...)
function getInitialProcessedTextReport(){
	var strOutput = "";
	var i=0;
	
	
	try{
		// controllo se sto refertando la stessa metodica
		// di tipo ECO Ostetrica
		if ((sameModality()) && (array_metodica[0]=="K")){
			// METODICA: ECO OSTETRICA
			for (i=0;i<array_descr_esame.length;i++){
				if(strOutput==""){
					strOutput = array_descr_esame[i];
				}
				else{
					strOutput = strOutput + "\r\n" + array_descr_esame[i];
				}
			}			
			if (((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S"))&&(basePC.ABILITA_SYNTHEMA=="N"&& basePC.ABILITA_PHONEIDOS=="N" && basePC.ABILITA_MAGIC_PHONEIDOS=="N")){
				strOutput = "<P>" + strOutput + "</P><p><br />&nbsp;</p>";
			}
			strOutput += "\r\n" + arrayInitialProcessedTextReport[0];			
		}
		else{
			// ALTRI
			
			for (i=0;i<array_descr_esame.length;i++){
				if(strOutput==""){
					strOutput = array_descr_esame[i];
				}
				else{
					strOutput = strOutput + "\r\n" + array_descr_esame[i];
				}
				if (((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S"))&&(basePC.ABILITA_SYNTHEMA=="N"&& basePC.ABILITA_PHONEIDOS=="N" && basePC.ABILITA_MAGIC_PHONEIDOS=="N")){
					strOutput = "<P>" + strOutput + "</P><p><br />&nbsp;</p>";
				}				
				strOutput += arrayInitialProcessedTextReport[i];
			}
		}
		if (((baseUser.USENEWREPORTTOOL=="S")||(baseUser.USETINYMCE=="S"))&&(basePC.ABILITA_SYNTHEMA=="N"&& basePC.ABILITA_PHONEIDOS=="N" && basePC.ABILITA_MAGIC_PHONEIDOS=="N")){
			// fare replaceall di \r\n con <BR>
			strOutput.toString().replaceAll("\r\n","<br />");
		}
//		alert("#" + strOutput +"#");
	}
	catch(e){
		alert("getInitialProcessedTextReport - Error: "+ e.description);
	}
	
	return strOutput;
}

// carousel/carouselHAndler

function initCarousel(){
	
	var collection;
	var i =0;
	var strToEval = ""; 
	try{
		// prendo la collection dei carousel
		collection = getElementsByAttribute(document.body, "*", "className", "stepcarousel");		
		for (i=0;i<collection.length;i++){
//			alert(collection[i].id);
			strToEval = "stepcarousel.setup({galleryid: '" + collection[i].id + "', beltclass: 'beltCarousel', panelclass: 'panelCarousel', autostep: {enable:false, moveby:1, pause:3000}, panelbehavior: {speed:300, wraparound:true, persist:true}, defaultbuttons: {enable: true, moveby: 3, leftnav: ['imagexPix/button/mini/arrowl.png', -5, 0], rightnav: ['imagexPix/button/mini/arrowr.png', -10, 0]}, 	statusvars: ['statusA', 'statusB', 'statusC'], contenttype: ['inline']})";

			eval (strToEval);
		}
		
	}
	catch(e){
		alert("initCarousel - Error: " + e.description);
	}
	
}

// objTraceUserACtion
// uso struttura JSon
var objTraceUserAction = {"userAction": [
        {"action": "", "iden_anag": "", "iden_esame": "" , "iden_ref":""}
    ]
};

var callBackFunctionAfterAjaxTrace = "";

// resetta oggetto per tracciatura
function resetTraceUserObject(){
	objTraceUserAction.userAction[0].action = "";
	objTraceUserAction.userAction[0].iden_anag = "";
	objTraceUserAction.userAction[0].iden_esame = "";
	objTraceUserAction.userAction[0].iden_ref = "";	
}

// richiamo funzione ajax
// per salvare oggetto globale objTraceUserAction
// ATTENZIONE mettere queste 2 funzioni in objTraceUserAction.js
function callTraceUserAction(){
		
	try{
//		alert(JSON.stringify(objTraceUserAction));
		ajaxTraceUserAction.saveAction(JSON.stringify(objTraceUserAction), replyTraceUserAction);
	}
	catch(e){
		//alert("callTraceUserAction " + e.description);
	}
}


var replyTraceUserAction = function(returnValue){
	return;
};

// verifica quale è 
// l'ultima azione compiuta dall'utente
function callGetLastActionUser(user, myCallBack){
	callBackFunctionAfterAjaxTrace = myCallBack;
	try{
		ajaxTraceUserAction.getLastAction(user, replyGetLastActionUser);
	}
	catch(e){
		alert("callGetLastActionUser " + e.description);
	}	
}

var replyGetLastActionUser = function(returnValue){
	var tmp = "";
	var objTmp = "";

	try{	
		objTmp = JSON.parse(returnValue);
		objTraceUserAction.userAction[0].action = objTmp.action;
		objTraceUserAction.userAction[0].iden_anag = objTmp.idenAnag;
		objTraceUserAction.userAction[0].iden_esame = objTmp.idenEsame;
		objTraceUserAction.userAction[0].iden_ref = objTmp.idenRef;		
		if (callBackFunctionAfterAjaxTrace!=""){
			tmp = callBackFunctionAfterAjaxTrace;
			callBackFunctionAfterAjaxTrace = "";
			eval(tmp);
		}
	}
	catch(e){
		alert("replyGetLastActionUser - " + e.description);
	}	
	
};



	
// firma/closeFirma.js

function closeforzata (value){
    Update_Firmato.RollBackDb(value,aggiornaFirma);
}

function aggiornaFirma()
{
}

function FirmaLeggera()
{
var old_ABILITA_FIRMA_DIGITALE=basePC.ABILITA_FIRMA_DIGITALE;
basePC.ABILITA_FIRMA_DIGITALE="N";
document.frmDefinitivo.HtoCallAfterSigned.value='aggiornaErrori();';
validaMedRiferimento()	;
}

function setStyleEditor(id, value){
	try{
		// devo lavorare su 
		// editor attivo
		var editor = tinyMCE.getInstanceById(id);	
		//var editor = tinyMCE.activeEditor;
		if (editor){
			editor.getBody().className = value;
		}
	}
	catch(e){
		alert("setStyleEditor - Error: " + e.description);
	}
}

function checkVersioni(){
functionDwr.launch_sp('SP_AGGIUSTA_VERSIONI@IString@' + document.frmMain.HIDEN_REF.value, risposta_check_versione);// + '@O#S', risposta_cancella_versione);
}

function risposta_check_versione(aa){
parent.opener.top.home.chiudi_attesa();
}

function AccorpaReferto(){
if(classReferto.FIRMATO=='S')
{
	if(classReferto.IDEN_MED==baseUser.IDEN_PER || baseUser.LIVELLO=='0') 
	{
		functionDwr.launch_sp('SP_ACCORPA_SU_REFERTO@IString#IString#IString#IString#OVarchar@' + classReferto.IDEN + '#'+ globalIdenAnag + '#'+ array_iden_esame + '#'+  baseUser.IDEN_PER, risposta_accorpa_su_referto);// + '@O#S', risposta_cancella_versione);
	}
	else
	{
		alert('Impossibile continuare: \r\n contattare il medico intestatorio del Referto o un System Administrator')
	}
}
else
	{
		alert('Esame non Ancora Firmato')
	}
}

function risposta_accorpa_su_referto(variab)
{

	var a_risp = variab.split("*");
	
	if(a_risp[0] != 'KO')
	{
		var rispos=confirm(a_risp[1] + '\r\n Occorre rifirmare il referto. \r\n Si Vuole Procedere ora ? ' )
		if (rispos)
			{
				validaMedRiferimento();
			}
	}
	else
	{
		alert('Errore interno, messaggio: ' + a_risp[1]);
	}	
}


// JavaScript Document

// Set di funzioni per la gestione di tag <SELECT>


// funzione che rimuove elemento selezionato
function remove_elem_by_sel(elemento)
{
	
	var object;
	
	object = document.getElementById(elemento);
	if (object){
		if (object.selectedIndex !=-1)
		{
			object.options.remove(object.selectedIndex);
		}
	}
}

// funzione che rimuove l'elemento passandogli l'indice
function remove_elem_by_id(elemento, indice){
	
	var object;

	object = document.getElementById(elemento);
	if (object){
		if (!isNaN(indice)){
			if (indice>-1){
				object.options.remove(indice)
			}
		}
	}
}


// funzione che rimuove tutti gli elementi
function remove_all_elem(elemento)
{
	
	var object;
	var indice;
	try{
		object = document.getElementById(elemento);
		if (object){
			try{indice = parseInt(object.length);}catch(e){indice = 0;}
			while (indice>-1)
			{
				object.options.remove(indice);
				indice--;
			}
		}
	}
	catch(e){
		alert("remove_all_elem - Error:" + e.description);
	}
}

// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// NB NON è necessario fornire numCaratteri e suffixString
// in tal caso fuziona in modo classico
function fill_select(elemento, arrayValue,arrayDescr, numCaratteri, suffixString)
{
	var i
	var num_elementi = 0;
	var object
	
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
			var oOption = document.createElement("Option");
			if (!isNaN(numCaratteri)){
				oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
			}
			else{
				oOption.text = arrayDescr[i];
			}
			oOption.title = arrayDescr[i];
			oOption.value = arrayValue[i];
			object.add(oOption);
		}
	}
}


// uguale alla precedente
// ma aggiunge un option vuoto
// funzione duplicata(senza aggiungere parametro
// alla precedente) per evitare che codice pre esistente
// mal funzionasse
function fill_selectWithEmptyOption(elemento, arrayValue,arrayDescr, numCaratteri, suffixString)
{
	var i
	var num_elementi = 0;
	var object
	var oOption
	
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
		oOption = document.createElement("Option");
		oOption.text =  "";
		oOption.value = "";
		object.add(oOption);		
		//carico descr esami - ci vuole un flag per cod + descr o solo descr
		for (i=0; i<num_elementi; i++)
		{
			oOption = document.createElement("Option");
			if (!isNaN(numCaratteri)){
				oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
			}
			else{
				oOption.text = arrayDescr[i];
			}
			oOption.title = arrayDescr[i];			
			oOption.value = arrayValue[i];
			object.add(oOption);
		}
	}
}

// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// Si differenzia dal precedente perchè 
// durante il caricamento effettua una scelta
// sull'option da caricare o meno
// indiceArrayPerControllo: vale o 0 o 1 (indica se il
// controllo deve essere effettuato su arrayValue o arrayDescr )
// flgInside: vale true se si vuole ricercare all'interno o meno
// valoreConfronto: valore col quale effettuare il controllo
// flgCaseSensitive: vale true se si vuole tenere conto del case sensitive
//
// *** ATTENZIONE *** Verificare se il controllo == è case sensitive
function fill_selectWithCheck(elemento, arrayValue,arrayDescr, indiceArrayPerControllo,flgInside, valoreConfronto, flgCaseSensitive, numCaratteri, suffixString)
{
	var i
	var num_elementi = 0;
	var object
	var bolTrovato = false;
	var arrayToCompare = null;
	try{
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
				try{
					if (parseInt(indiceArrayPerControllo)==0){
						// lavoro su arrayValue 
						arrayToCompare = arrayValue;
					}
					else{
						// lavoro su arrayDescr 	
						arrayToCompare = arrayDescr;				
					}
				}catch(e){arrayToCompare = arrayValue;}
				
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
					if (!isNaN(numCaratteri)){
						oOption.text = limitazioneTesto(arrayDescr[i],numCaratteri, suffixString);
					}
					else{
						oOption.text = arrayDescr[i];
					}
					oOption.title = arrayDescr[i];				
					oOption.value = arrayValue[i];
					object.add(oOption);
				}
			}
		}
	}
	catch(e){
		alert("fill_selectWithCheck - Error:" + e.description);
	}
}



// funzione che riempie un combo o listbox passandogli degli 
// array, previa azzeramento del combo.
// uguale al metodo precedente con un 
// flag in + che indica (se true) di NON caricare
// le option con codice vuoto
function fill_select_NoEmptyCodeOption(elemento, arrayValue,arrayDescr, addEmptyCodeElement)
{
	var i
	var num_elementi = 0;
	var object
	
	
	try{
		if (addEmptyCodeElement!=true){
			fill_select (elemento, arrayValue, arrayDescr);
			return;
		}
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
				if ((arrayValue[i]!="")&&(arrayValue[i]!="''")){
					var oOption = document.createElement("Option");
					oOption.text = arrayDescr[i];
					oOption.value = arrayValue[i];
					oOption.title = arrayDescr[i];				
					object.add(oOption);
				}
			}
		}
	}
	catch(e){
		alert("fill_select_NoEmptyCodeOption - Error: " + e.description);
	}
}


// funzione che aggiunge elemento al combo
// è permesso anche l'inserimento di elementi vuoti
function add_elem(elemento, valore, testo)
{
	var object;
	try{
		object = document.getElementById(elemento);
		if (object){
			var oOption = document.createElement("Option");
			oOption.text = testo;
			oOption.value = valore;
			oOption.title = testo;
			object.add(oOption);
		}
	}
	catch(e){
		alert("add_elem -- Error: " + e.description);
	}	
}

// funzione che aggiunge elemento al combo
// è permesso anche l'inserimento di elementi vuoti
// specificando anche la classe
function add_elem(elemento, valore, testo, classe)
{
	var object;
	try{
		object = document.getElementById(elemento);
		if (object){
			var oOption = document.createElement("Option");
			oOption.text = testo;
			oOption.value = valore;
			try{oOption.className = classe;}catch(e){;}
			oOption.title = testo;		
			object.add(oOption);
		}
	}
	catch(e){
		alert("add_elem - - Error: " + e.description);
	}		
}

// funzione che aggiunge gli elementi selezionati in una listbox 
// ad un altra listbox. E' possibile specificare se rimuovere
// o meno l'elemento dalla listbox d'origine
// Il parametro rimozione è un booleano. true: rimuovi sorgente   false: NON rimuovi

function add_selected_elements(elementoOrigine, elementoDestinazione, rimozione){
	
	var objectSource;
	var objectTarget;
	var num_elementi=0;
	var i=0;
	
	var valore_iden, valore_descr;

	try{
		objectSource = document.getElementById(elementoOrigine);
		objectTarget = document.getElementById(elementoDestinazione);
		if ((objectSource)&&(objectTarget)){
			num_elementi = objectSource.length ;
			for (i=0;i<num_elementi;i++)
			{
				if (objectSource[i].selected)
				{
					valore_iden = objectSource.options(i).value;
					valore_descr = objectSource.options(i).text;
					var oOption = document.createElement("Option");
					oOption.text = valore_descr;
					oOption.value = valore_iden;
					oOption.title = valore_descr;					
					objectTarget.add(oOption);
					// rimuovo elemento
					if (rimozione==true){
						remove_elem_by_id(elementoOrigine,i);
						i--;
						num_elementi--;
					}
				}
			}
		}
	}
	catch(e){
		alert("add_selected_elements - Error: " + e.description);
	}
}




// ritorna il value dell'elemento selezionato
function getValue(elemento){
	
	var outString = "";
	
	var object
	try{
		object = document.getElementById(elemento);
		if (object){
			if (object.selectedIndex !=-1)
			{	
				outString = object.options(object.selectedIndex).value;
			}
		}
	}
	catch(e){
		alert("getValue - Error: " + e.description);
	}	
	return outString;
}

// ritorna il testo dell'elemento selezionato
function getText(elemento){
	
	var outString = "";
	
	var object

	try{
		object = document.getElementById(elemento);
		if (object){
			if (object.selectedIndex !=-1)
			{	
				outString = object.options(object.selectedIndex).text;
			}
		}
	}
	catch(e){
		alert("getValue - Error: " + e.description);
	}	
	return outString;
}

// ritorna tutti i codici delle option del tag select
// splittati dal carattere *
function getAllOptionCode(elemento){
	var i;
	var object;
	var outString = "";	
	
	try{
		object = document.getElementById(elemento);
		if (object){
			for (i=0;i<object.length;i++){
				if (outString==""){
						outString = object.options(i).value;
				}
				else{
						outString = outString + "*" +object.options(i).value;					
				}
			}
		}
	}
	catch(e){
		alert("getAllOptionCode - Error: " + e.description);
	}		
	return outString;
}


// ritorna tutti i codici delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionCode(elemento){
	var i;
	var object;
	var outString = "";	

	try{
		object = document.getElementById(elemento);
		if (object){
			for (i=0;i<object.length;i++){
				if (object.options(i).selected){
					if (outString==""){
							outString = object.options(i).value;
					}
					else{
							outString = outString + "*" +object.options(i).value;					
					}
				}
			}
		}
	}
	catch(e){
		alert("getAllSelectedOptionCode - Error: " + e.description);
	}			
	return outString;
}


// ritorna tutti i codici delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionCodeWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";	
	
	if (splitElement==""){splitElement="*";}
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).selected){
				if (outString==""){
						outString = object.options(i).value;
				}
				else{
						outString = outString + splitElement + object.options(i).value;					
				}
			}
		}
	}
	return outString;
}

// ritorna tutti le descrizioni delle option *selezionati* del tag select
// splittati dal carattere *
function getAllSelectedOptionText(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).selected){			
				if (outString==""){
						outString = object.options(i).text;
				}
				else{
						outString = outString + "*" +object.options(i).text;					
				}
			}
		}
	}
	return outString;
}



// ritorna tutti i codici delle option del tag select
// splittati dal carattere specificato
// se non viene specificato nulla verrà usato "*"
function getAllOptionCodeWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";	
	
	if (splitElement==""){splitElement="*";}
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options(i).value;
			}
			else{
					outString = outString + splitElement + object.options(i).value;					
			}
		}
	}
	return outString;
}

// ritorna tutti le descrizioni delle option del tag select
// splittati dal carattere *
function getAllOptionText(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options(i).text;
			}
			else{
					outString = outString + "*" +object.options(i).text;					
			}
		}
	}
	return outString;
}


// ritorna tutti le descrizioni delle option del tag select
// splittati dal carattere  specificato
// se non viene specificato nulla verrà usato "*"
function getAllOptionTextWithSplitElement(elemento, splitElement){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (outString==""){
					outString = object.options(i).text;
			}
			else{
					outString = outString + splitElement +object.options(i).text;					
			}
		}
	}
	return outString;
}


// funzione che seleziona un elemento
// attrverso il suo codice
function selectOptionByValue(elemento, valoreValue){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).value==valoreValue){
					object.options(i).selected = true;
					break;
			}
		}
	}	
}


// funzione che seleziona un elemento
// attrverso la sua descrizione
function selectOptionByText(elemento, valoreText){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).text==valoreText){
					object.options(i).selected = true;
					break;
			}
		}
	}		
}


function updateTextSelectedByText(elemento, newText, oldText){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).text==oldText){
					object.options(i).text = newText;
					break;
			}
		}
	}		
}

function updateValueSelectedByValue(elemento, newValue, oldValue){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	if (object){
		for (i=0;i<object.length;i++){
			if (object.options(i).value==oldValue){
					object.options(i).value = newValue;
					break;
			}
		}
	}		
}


// funzione che seleziona *tutti* gli
// elementi del combo
function selectAllElement(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	for (i=0;i<object.length;i++){	
		if (object){
			object.options(i).selected = true;
		}	
	}
}

// funzione che DEseleziona  *tutti* gli
// elementi del combo
function deSelectAllElement(elemento){
	var i;
	var object;
	var outString = "";	
	
	object = document.getElementById(elemento);
	for (i=0;i<object.length;i++){
		if (object){
			object.options(i).selected = false;
		}	
	}
}


// sposta l'option selezionata di STEP posozioni
// il parametro STEP può essere positivo o negativo
function moveUpDownElement(elemento,step){
	
	var object;
	var tmpValue;
	var tmpText;
	var dimensioneListBox;
	var nuovaPosizione 
	var indiceSelezionato
	
	object = document.getElementById(elemento);
	if (object){
		dimensioneListBox = object.length;		
		// controllo se esiste un elemento selezionato
		if (object.selectedIndex !=-1){
			indiceSelezionato = object.selectedIndex;
			// controllo di non essere fuori dai limiti
			nuovaPosizione = object.selectedIndex + step;
			if ((nuovaPosizione>=0) && (nuovaPosizione<dimensioneListBox)){
				// sono nei limiti
				// salvo valore dell'option che verrà sovrascritto
				tmpText = object.options(nuovaPosizione).text;
				tmpValue =  object.options(nuovaPosizione).value;
				// sovrascrivo con nuovi valori
				object.options(nuovaPosizione).text = object.options(indiceSelezionato).text;
				object.options(nuovaPosizione).value = object.options(indiceSelezionato).value;				
				// effettuo scambio
  			    object.options(indiceSelezionato).text = tmpText;
				object.options(indiceSelezionato).value = tmpValue;
				// riposiziono selezione su nuovo indice
				object.selectedIndex = nuovaPosizione;
			}
		}
	}
	
}


// funzione che limita la dimensione
// di una stringa a "numCaratteri" e
// in coda appende suffixString
function limitazioneTesto(valore, numCaratteri, suffixString){
	
	var strOutput="";
	var appendoSuffisso = false;
	
	if (isNaN(numCaratteri)){
		return valore;
	}
	try{
		if (parseInt(valore.toString().length) <= parseInt(numCaratteri)){
			appendoSuffisso = false;
		}
		else{
			appendoSuffisso = true;
		}
		if (appendoSuffisso){
			strOutput = valore.substr(0,numCaratteri) + suffixString;
		}
		else{
			strOutput = valore;
		}
	}
	catch(e){
		strOutput = valore;
	}
	return strOutput;
	
}

// partendo da un XmlDoc 
// viene riempito un combo referenziato tramite elemId
// "chiave" indica quale tag deve essere preso per settare il value dell'option
// "valore" indica quale tag deve essere preso per settare la descrizione dell'option
// *** ATTENZIONE questa funzione si basa sull'uso di XML2DB
// verranno riempiti 2 vettori per richiamare poi il metodo base fill_select
function fill_selectFromXmlDoc (xmlDoc,elemId, chiave, valore, numCaratteri, suffixString){
	
	var oggetto
	var arrayCode
	var arrayDescr

	var chiaveTagObj
	var chiaveValue
	var valoreTagObj
	var valoreValue	
	
	var rowTagObj
	var i=0;
	
	var strCode = "";
	var strDescr = "";
	
	
	oggetto = document.getElementById(elemId);
	if (oggetto){
		// esiste combo
		try{
			if (xmlDoc){
				// webuser
				rowTagObj = xmlDoc.getElementsByTagName("ROW");
				if (rowTagObj){
					
					for (i=0; i < rowTagObj.length; i++){
						// ciclo nelle righe
						// chiave
						chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
						chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
						if (strCode==""){
							strCode = chiaveValue;
						}
						else{
							strCode = strCode + "@@" + chiaveValue;
						}
						// descrizione
						valoreTagObj = rowTagObj[i].getElementsByTagName(valore)[0];
						valoreValue = valoreTagObj.childNodes[0].nodeValue;
						if (strDescr==""){
							strDescr = valoreValue;
						}
						else{
							strDescr = strDescr + "@@" + valoreValue;
						}
					}
					// creo array
					arrayCode = strCode.split("@@");
					arrayDescr = strDescr.split("@@");
					fill_select(elemId, arrayCode,arrayDescr, numCaratteri, suffixString);
				}
			}
		}
		catch(e){
			alert("fill_selectFromXmlDoc - Error: " + e.description)
		}
	}
}


function fill_selectFromXmlDocWithBlankOption (xmlDoc,elemId, chiave, valore, numCaratteri, suffixString){
	
	var oggetto
	var arrayCode
	var arrayDescr

	var chiaveTagObj
	var chiaveValue
	var valoreTagObj
	var valoreValue	
	
	var rowTagObj
	var i=0;
	
	var strCode = "";
	var strDescr = "";
	
	
	oggetto = document.getElementById(elemId);
	if (oggetto){
		// esiste combo
		try{
			if (xmlDoc){
				// webuser
				rowTagObj = xmlDoc.getElementsByTagName("ROW");
				if (rowTagObj){
					
					for (i=0; i < rowTagObj.length; i++){
						// ciclo nelle righe
						// chiave
						chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
						chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
						if (strCode==""){
							strCode = chiaveValue;
						}
						else{
							strCode = strCode + "@@" + chiaveValue;
						}
						// descrizione
						valoreTagObj = rowTagObj[i].getElementsByTagName(valore)[0];
						valoreValue = valoreTagObj.childNodes[0].nodeValue;
						if (strDescr==""){
							strDescr = valoreValue;
						}
						else{
							strDescr = strDescr + "@@" + valoreValue;
						}
					}
					// creo array
					arrayCode = strCode.split("@@");
					arrayDescr = strDescr.split("@@");
					fill_selectWithEmptyOption(elemId, arrayCode,arrayDescr, numCaratteri, suffixString);
				}
			}
		}
		catch(e){
			alert("fill_selectFromXmlDocWithBlankOption - Error: " + e.description)
		}
	}
}

// funzione che carica un combo
// passando attraverso una select
// ATTENZIONE si basa sulla funzione
// getXMLData inclusa in xmlHttpRequestHandler.js
// che si basa su XML2DB
var varSelectFromSqlViaXml_elemId = "";
var varSelectFromSqlViaXml_chiave = "";
var varSelectFromSqlViaXml_valore = "";
var varSelectFromSqlViaXml_numCaratteri = "";
var varSelectFromSqlViaXml_suffixString = "";

function fill_selectFromSqlViaXml(sql,elemId, chiave, valore, numCaratteri, suffixString){
	try{
		// setto variabili globali
		// affinchè possono essere usate
		// dalla callback
		varSelectFromSqlViaXml_elemId = elemId;
		varSelectFromSqlViaXml_chiave = chiave;
		varSelectFromSqlViaXml_valore = valore;
		varSelectFromSqlViaXml_numCaratteri = numCaratteri;
		varSelectFromSqlViaXml_suffixString = suffixString;
//		alert(parseSql(sql));
		getXMLData("",parseSql(sql),"callBackFillSelectFromSqlViaXml");		
	}
	catch(e){
		alert("fill_selectFromSqlViaXml - Error: " + e.description);
	}
}

// *************************************
function callBackFillSelectFromSqlViaXml(xmlDoc){
	try{
		if (xmlDoc){
			fill_selectFromXmlDoc(xmlDoc,varSelectFromSqlViaXml_elemId, varSelectFromSqlViaXml_chiave,varSelectFromSqlViaXml_valore, varSelectFromSqlViaXml_numCaratteri, varSelectFromSqlViaXml_suffixString);
			
		}
	}
	catch(e){
		alert("callBackFillSelectFromSqlViaXml - Error: " + e.description)
	}	
}



// funzione che passatole l'xmlDoc
// e il nome del tag xml ritorna
// tutti i relativi valori splittati da splitElement
// *** ATTENZIONE questa funzione si basa sull'uso di XML2DB
function getValueXmlTagViaXmlDoc(xmlDoc, chiave, splitElement){
	
	var strOutput = "";
	
	try{
		if (xmlDoc){
			// webuser
			rowTagObj = xmlDoc.getElementsByTagName("ROW");
			if (rowTagObj){
				for (i=0; i < rowTagObj.length; i++){
					// ciclo nelle righe
					// chiave
					chiaveTagObj = rowTagObj[i].getElementsByTagName(chiave)[0];
					chiaveValue = chiaveTagObj.childNodes[0].nodeValue;
					if (strOutput==""){
						strOutput = chiaveValue;
					}
					else{
						strOutput = strOutput + splitElement + chiaveValue;
					}
				}
			}
		}	
	}
	catch(e){
		alert("getValueXmlTagViaXmlDoc - Error: " + e.description);
	}	
	return strOutput;
}





// uguale a fill_selectFromSqlViaXml
// MA inserisce come primo valore un option vuoto
function fill_selectFromSqlViaXmlWithBlankOption(sql,elemId, chiave, valore, numCaratteri, suffixString){
	try{
		// setto variabili globali
		// affinchè possono essere usate
		// dalla callback
		varSelectFromSqlViaXml_elemId = elemId;
		varSelectFromSqlViaXml_chiave = chiave;
		varSelectFromSqlViaXml_valore = valore;
		varSelectFromSqlViaXml_numCaratteri = numCaratteri;
		varSelectFromSqlViaXml_suffixString = suffixString;
//		alert(parseSql(sql));
		getXMLData("",parseSql(sql),"callBackFillSelectFromSqlViaXmlWithBlankOption");		
	}
	catch(e){
		alert("fill_selectFromSqlViaXmlWithBlankOption - Error: " + e.description);
	}
}

// *************************************
function callBackFillSelectFromSqlViaXmlWithBlankOption(xmlDoc){
	try{
		if (xmlDoc){
			fill_selectFromXmlDocWithBlankOption(xmlDoc,varSelectFromSqlViaXml_elemId, varSelectFromSqlViaXml_chiave,varSelectFromSqlViaXml_valore, varSelectFromSqlViaXml_numCaratteri, varSelectFromSqlViaXml_suffixString);
			
		}
	}
	catch(e){
		alert("callBackFillSelectFromSqlViaXmlWithBlankOption - Error: " + e.description)
	}	
}


/*
function che valorizza un campo nascosto con i value del listbox di interesse 
id_sorgente= id del listbox
id_destinazione = id dell'hinput di destinazione
*/
function aggiornaInputValue(id_sorgente,id_destinazione)

{
	try{
		campo_hidden_destinazione = document.all[id_destinazione];
		elemento_sorgente = document.all[id_sorgente];
		campo_hidden_destinazione.value="";
		for (var i=0;i<elemento_sorgente.length;i++)
					   campo_hidden_destinazione.value+="'"+elemento_sorgente.options[i].value+"',";
		campo_hidden_destinazione.value=campo_hidden_destinazione.value.substring(0,campo_hidden_destinazione.value.length-1);
	}
	catch(e){
		alert("aggiornaInputValue - Error: " + e.description)
	}		
}

function settaCommentoImmagine(){
	var testo = "";
	try{
		testo = getReportControlSelectedtext();
		if(testo==""){
			if (!confirm("Testo selezionato nullo. Continuare comunque?")){
				return;
			}
		}
		// ...
		// verificare che ci sia un'immagine selezionata
		try{
			if (parent.frameBottomConsolle.getSelectedRowId()<0){
				alert("Errore: non è stato selezionata alcuna immagine");	
				return;
			}
		}
		catch(e){
			alert("Errore: non è stato selezionato il tabulatore delle immagini");
			return;
		}
		// richiamare setDidascaliaOnSelectedImage
		parent.frameBottomConsolle.setDidascaliaOnSelectedImage(testo);
		
	}
	catch(e){
		alert("settaCommentoImmagine - Error: " + e.description);
	}
	
}

// *************************************************
// ***** AMBULATORIO
// *************************************************
// ****************** x ora li sistemo qui

function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	dwr.engine.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	dwr.engine.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,pBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	dwr.engine.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeQuery(pFileName , pStatementName , pBinds){
	var vRs;
	dwr.engine.setAsync(false);
	dwrUtility.executeQueryXml(pFileName,pStatementName,pBinds,callBack);
	dwr.engine.setAsync(true);
	return vRs;

	function callBack(resp){
		var valid=true;
		var error='';
		var ArColumns,ArData;
		if(resp[0][0]=='KO'){
			isValid = false;
			error = resp[0][1];
			ArColumns =  ArData =  new Array();
		}else{
			ArColumns = resp[1];
			ArData = resp.splice(2,resp.length-1);
		}
		vRs = {
			isValid:valid,
			getError:function(){return error;},
			columns:ArColumns,
			data:ArData,
			size:ArData.length,
			current:null,
			next:function(){
				if(this.current==null && this.size>0){
					this.current = 0;
					return true;
				}else{
					return ++this.current < this.size;
				}
			},
			getString:function(pColumnName){
				//alert(this.current);
				return this.data[this.current][this.getColumnIndex(pColumnName)];
			},
			getInt:function(pColumnName){
				return parseInt(this.getString(pColumnName),10);
			},
			getColumnIndex:function(pColumnName){
				pColumnName = pColumnName.toUpperCase();
				for (var i = 0; i< this.columns.length;i++){
					if(this.columns[i] == pColumnName){
						return i;
					}
				}
			}
		}
	}
}



/*
function apriCartella(){
	try{
		alert("Apro cartella");
	}
	catch(e){
		alert("apriCartella - Error: " + e.description);
	}	
}*/



function openMsgInfo(messaggio){
	try{
		var oggetto;
		

		try{j$("#divInfoDiario").dialog("destroy").remove();} catch(e){alert(e.description);}
		j$('<div>').attr('id','divInfoDiario').attr('title','Diario').html("<p>"+ messaggio + "</p>").appendTo('body');
//		j$('#accordionInfoAnag').multiAccordion();
//		j$('#accordionInfoAnag').multiAccordion('option', 'active', 'all');
		j$( "#divInfoDiario").dialog({
			autoOpen: false,
			height:400,
			width:'100%',
			modal:true,
			open: function( event, ui ) {try{showHideReportControlLayer(false);}catch(e){;}},
		    close: function( event, ui ) {try{showHideReportControlLayer(true);}catch(e){;}}
		}).dialog("open");
//		j$("#divInfoDiario").position({   my: "center",   at: "center",   of: window});
//		j$("#divInfoDiario").css({left:100,top:200});
		//j$("#divInfoDiario").dialog({position: ['center', 'top']});
//		j$("#divInfoDiario").dialog('option', 'position', j$("#divInfoDiario").dialog('option','position'));

	}
	catch(e){
		alert("openMsgInfoAtPosition - Error: " + e.description);
	}		
}

function closeMsgInfo(){
	try{
		j$( "#divInfoDiario").dialog("close");
	}
	catch(e){
		alert("closeMsgInfo - Error: " + e.description);
	}
}

function isMsgInfoOpen(){
	try{
		// non funziona correttamente isOpen, quindi workaround;
		if (j$( "#divInfoDiario").closest('.ui-dialog').is(':visible')){return true;}else{return false;}
	}
	catch(e){
		alert("isMsgInfoOpen - Error: " + e.description);
	}		
}

// *******************************************************
// ************** DIARIO RICCIO **************************
// *******************************************************

function apriDiarioMedico(){
	try{
		servlet = "SL_RicercaGenericaFrameset?modulo=DIARIO_MEDICO";
		servlet += "&rf1=105&rf2=*&rf3=0";
		servlet += "&provenienza=ricercaPaziente";
		servlet += "&tipo_ricerca=7";
		servlet += "&iden_anag="+globalIdenAnag;
//		alert(servlet);
		j$.fancybox(
		{	
			'width'		: document.documentElement.offsetWidth/10*9,
			'height'	: document.documentElement.offsetHeight/10*8,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'title'	:	'Diario medico', 
			'href'	:	servlet,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'type'				: 'iframe',
			'scrolling'   		: 'no',
			'showCloseButton'	: true,
			'onStart'	: function(  ) {try{showHideReportControlLayer(false);}catch(e){;}},
			'onClosed'	: function( ) {try{showHideReportControlLayer(true);}catch(e){;}},
			'onComplete': function() {
		    }		
		});				
	}
	catch(e){
		alert("diarioMedico - Error: " + e.description);
	}		
}

// ***********************************************************************************
// ******************** nuovo PRIVACY 	**************************************************
// ***********************************************************************************
var paginaOscuramentoCittadino = "oscuramentoCittadino.html";
function creaLivelloOscuramentoCittadino(){
	try{
		var strToAppend = "";
		strToAppend ="<a class='fancybox' href='"+ paginaOscuramentoCittadino +"' data-fancybox-type='iframe' id ='linkToOpenOscCitt'></a>";
		j$(strToAppend).appendTo('body');
		j$('#linkToOpenOscCitt').fancybox(
		{	
			'width'				: 800,
			'height'			: 170,
			'autoDimensions'	: false,			
			'autoScale'     	: false,
			'type'				: 'iframe',
			'showCloseButton'	: false,
			'iframe': {
              preload: false // fixes issue with iframe and IE
	         },
			'scrolling'   		: 'no' ,
			'onComplete': function() {
				var top = (j$('body').height() - 180)/2;
			    var left = (j$('body').width()-800)/2;	
			    j$("#fancybox-wrap").css({ 'top': top + 'px', 'left': left + 'px'});
				j$('#fancybox-content').width(760);				
			//	j$('body').css('width', '800px');
		    }
		});
		
	}
	catch(e){
		alert("creaLivelloOscuramentoCittadino - Error: " + e.description);
	}
}

/*********************** di qui in poi le funzioni di CARDIOLOGIA **************************/
/*******************************************************************************************/
/** @author: alessandroc *******************************************************************/

var NS_SCHEDA_REFERTAZIONE = {

	scheda : null,
	iden_esame_pilota : null, /* esame principale in base alla priorità */

	testoPianoReferto : '',
	
	/*
	* appende dinamicamente alla console un iframe con la scheda strutturata relativa all'esame
	*/
	initSchedaStrutturata: function()
	{
		var vResponse = '';
		var vKeyLegame = '';
		var vIdenEsame = '';
		var vIdenRef = classReferto.IDEN;
		
		/* ottenimento della scheda di refertazione appropriata per l'esame mediante la chiamata a cardio.get_key_legame_ref_multi, ritorna l'iden esame e il key_legame con maggiore priorita' */
	
		var sql = "begin ? := cardio.get_key_legame_ref_multi('"+array_iden_esame.toString()+"'); end;";
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, function(resp){
			vResponse=resp;
		});	
		dwr.engine.setAsync(true);

		if (vResponse==null || vResponse=='')return;
		
		vIdenEsame = vResponse.split('#')[0];
		vKeyLegame = vResponse.split('#')[1];
		
		/* creazione dinamica dell'iframe contenente la scheda di refertazione che viene appeso alla console */
		var iStruct = j$("<iframe id='iStruct'></iframe>")
			//.attr("src",vUrl)
			.css({width:'100%',height:j$("body").height()-145});
		j$("div#divThirdLayout td:first").append(iStruct);
		
		/* modifiche al layout della console */
		j$("div#idDivReportControl").hide(); //, div#divSecondLayout, div#mygallery_0
		zoomConsolleLeftFrame(); //j$("#framesetConsolle",top.document).attr("cols","*,300");
		
		/* aggiunta tasti per apertura schede cartella cardiologica */
		/*NS_SCHEDA_REFERTAZIONE.addBtnAnamnesi();
		NS_SCHEDA_REFERTAZIONE.addBtnDatiStrutturati();*/
		
		NS_SCHEDA_REFERTAZIONE.scheda = vKeyLegame;
		NS_SCHEDA_REFERTAZIONE.iden_esame_pilota = vIdenEsame;
		
		/* controllo presenza di un referto precedente di tipo analogo (stesso key_legame), e richiede l'importazione */
		if (vIdenRef=='') {
			var vIdenRefPrecedente = NS_SCHEDA_REFERTAZIONE.getIdenRefPrecedente(vKeyLegame);
			if (vIdenRefPrecedente!=null && confirm("E' presente un referto precedente per il paziente, si desidera importarlo?")) {
				vIdenRef=vIdenRefPrecedente;
			}
		}
		var vUrl = NS_APPLICATIONS.switchTo("FENIX_CIS", 'page?KEY_LEGAME='+vKeyLegame+'&IDEN_REFERTO='+vIdenRef+'&IDEN_ESAME='+vIdenEsame+"&COD_CDC="+getValue("idReparto"));
		iStruct.attr("src",vUrl);
		
		j$("#idReparto").change( function() {
			NS_SCHEDA_REFERTAZIONE.updateCDC();
		});
	},
	
	/*
	* chiama il salvataggio della scheda strutturata tramite NS_FENIX_SCHEDA.registra
	*/
	salvaSchedaStrutturata: function( params ) 
	{			
		j$("iframe#iStruct").contents().find("input#IDEN_REFERTO").val(classReferto.IDEN == ''? 0 : classReferto.IDEN);	
		
		j$("iframe#iStruct")[0].contentWindow.NS_FENIX_SCHEDA.checkIden = function( response ) 
		{
			NS_SCHEDA_REFERTAZIONE.successSaveScheda( response , params );
		};
		
		j$("iframe#iStruct")[0].contentWindow.NS_FENIX_SCHEDA.registra({extern:true});
	},

	/*
	* se esiste una scheda salvata per il paziente con lo stesso key_legame, propone all'utente di importarla in console
	*/
	importaPrecedente: function(pKeyLegame, pWindow)
	{
		var vIdenRefPrecedente = NS_SCHEDA_REFERTAZIONE.getIdenRefPrecedente(pKeyLegame);
		NS_SCHEDA_REFERTAZIONE.importaReferto( vIdenRefPrecedente, pKeyLegame, pWindow );
	},
	
	/*
	 * importa referto selezionato nei precedenti 
	 */
	importaSelezionato: function( pKeyLegame, pWindow )
	{
		var frame = top.frames['rightFramesetConsolle'].document.frames['topConsolle'];
		var vIdenRefSelezionato = frame.stringa_codici(frame.array_iden_ref);
		NS_SCHEDA_REFERTAZIONE.importaReferto( vIdenRefSelezionato, pKeyLegame, pWindow );
	},
	
	/*
	 * importa un referto dato un iden_ref
	 */
	importaReferto : function ( pIdenRef, pKeyLegame, pWindow ) 
	{
		if (pIdenRef!=null && pIdenRef!='') 
		{
			pWindow.NS_FENIX_REFERTAZIONE.confirm("Procedere con l'importazione del referto precedente? Le modifiche correnti verranno perse", function() {
				
				var vUrl = NS_APPLICATIONS.switchTo("FENIX_CIS", 'page?KEY_LEGAME='+pKeyLegame+'&IDEN_REFERTO='+pIdenRef+'&IDEN_ESAME='+NS_SCHEDA_REFERTAZIONE.iden_esame_pilota +"&COD_CDC="+getValue("idReparto"));
				j$("iframe#iStruct").attr('src',vUrl);
			});
			
		} 
		else 
			pWindow.NOTIFICA.warning({
				message : "Nessun referto precedente importabile per il paziente",
				title : "Attenzione"
			});
	},
	/*
	* funzione che cerca se esiste una scheda salvata per il paziente con lo stesso key_legame, ritornando l'iden_ref
	*/
	getIdenRefPrecedente: function(pKeyLegame) 
	{
		var vIdenRefPrecedente = null;
		var sql = "select r.iden from referti r join esami e on e.iden_ref = r.iden join cardio.cardio_schede_xml ca on ca.iden_referto = r.iden";
		sql += " where e.iden_anag="+j$('input[name="idenAnag"]').val()+" and key_legame='"+pKeyLegame+"' and ca.stato<>'X' order by data_ins desc";
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(sql, function(resp){
			vIdenRefPrecedente=resp;
		});	
		dwr.engine.setAsync(true);
		return vIdenRefPrecedente;
	},

	/*
	* funzione che aggiunge dinamicamente alla barra del carosello una tasto per l'apertura dell'anamnesi
	*/
	/*addBtnAnamnesi: function() 
	{
		j$("#menuDDcontainer").append("<div title='Anamnesi' class='pulsante' id='idDivAnamnesi' style='display: " +
		"inline;'><a id='btAnamnesi' href='javascript:NS_SCHEDA_REFERTAZIONE.apriAnamnesi();'><span id='idSpanImgAnam'></span>"+
		"Anamnesi Cardiologica</a></div>" );
	},*/

	/*
	* funzione che aggiunge dinamicamente alla barra del carosello una tasto per l'apertura dei dati strutturati di laboratorio
	*/
	/*addBtnDatiStrutturati: function() 
	{	
		j$("#menuDDcontainer").append("<div title='Dati strutturati' class='pulsante' id='idDivDatiStrutturati' " +
		"style='display: inline;'><a id='btDatiStrutturati' href='javascript:NS_SCHEDA_REFERTAZIONE.apriDatiStrutturati();'>" +
		"<span id='idSpanImgDatiStrutt'></span>Dati Strutturati</a></div>");
	},*/

	updateVersioneScheda: function(callback) 
	{
		var vIdenEsame = NS_SCHEDA_REFERTAZIONE.iden_esame_pilota;
		//alert("updateVersioneScheda() | iden_scheda:"+ gIdenScheda )
		
		var sql = "begin cardio.UPD_VERSIONE_REFERTI_SCHEDA("+gIdenScheda+", "+vIdenEsame+"); end;";
		toolKitDB.executeQueryData(sql, function(resp){
			callback();
		});	
	},

	successSaveScheda: function ( response, params ) 
	{
		//alert("successSaveScheda() | response:" +response)
		var i = response.indexOf("#");
		gIdenScheda = response.substring(0,i);
		NS_SCHEDA_REFERTAZIONE.testoPianoReferto = response.substring(i+1);
		
		if (typeof params.callback == 'function')
			params.callback();
		
		return true;
	},
	
	/* function che aggiorna il campo nascosto per il CDD_CDC in scheda di refertazione*/
	updateCDC: function() 
	{
		j$("iframe#iStruct").contents().find("#COD_CDC").val(getValue("idReparto"));
	}
};

var NS_MENU_CAROUSEL = {
		
		/*
		* funzione che lancia l'apertura della scheda anamnesi cardiovascolare del paziente
		*/
		apriAnamnesiCV: function()
		{
			var vIdenAnag=j$("input[name='idenAnag']").val();
			var vPaziente = j$("#lblDescrizionePaziente").text();
			var vUrl = NS_APPLICATIONS.switchTo("FENIX_CIS", 'page?KEY_LEGAME=ANAMNESI&IDEN_ANAG='+vIdenAnag+'&COD_CDC='+getValue("idReparto")+'&PAZIENTE='+vPaziente);
			top.window.open(vUrl,"","top=0,left=0,width=" + screen.availWidth  + ",height=" + screen.availHeight +
			" , status=no , scrollbars=yes, fullscreen = yes");
				
		},
		
		/*
		* funzione che lancia l'apertura dei dati strutturati di laboratorio del paziente
		*/
		apriDatiStrutturati: function()
		{
			var vIdPaz = "BNNLSE81A63I480Q";
			
			var url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro';
			url += '&reparto=MMG&nosologico=&elencoEsami=&numRichieste=5&idPatient='+ vIdPaz;
			url += '&DATA_NASC=' + ""+ '&daData=20131001&aData=20131130&provRisultati=&provChiamata=MMG&userLogin='+ 
			"alessandroc" +'&idenAnag='+ "534825"+"&modalita=PAZIENTE";
			url = NS_APPLICATIONS.switchTo( 'WHALE', url );
			top.window.open(url,"","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +
			" , status=no , scrollbars=yes, fullscreen = yes");
		}
}

var NS_APPLICATIONS = {
	
	addApplication:function(pKey,pApplicationPath,pCampoSwitch,pCampoUser,pCampoIp){
		NS_APPLICATIONS.applications[pKey] = {
			path:'/'+pApplicationPath+'/',
			session_created:false,
			campo_switch:typeof pCampoSwitch != 'undefined' ? pCampoSwitch : 'KEY',
			campo_user:typeof pCampoUser != 'undefined' ? pCampoUser : 'USER',
			campo_ip:typeof pCampoIp != 'undefined' ? pCampoIp : 'IP'						
		};
	},
	
	applications:{
		'WHALE':{path:null,session_created:false,last_call:null,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'},
		'FENIX_CIS':{path:'/fenix_cis/',session_created:false,last_call:null,campo_user:'username',campo_ip:'nomeHost'},
		'AMBULATORIO':{path:null,session_created:false,last_call:null},
		'REPOSITORY':{path:null,session_created:false,last_call:null},
		'RR_PT':{path:null,session_created:false,last_call:null,campo_switch:'pagina',campo_user:'utente',campo_ip:'postazione'}
	},

	getApplicationCampoSwitch:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_switch != 'undefined' ? app.campo_switch :'KEY';
	},
	
	getApplicationCampoUser:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_user != 'undefined' ? app.campo_user :'USER';
	},		
	
	getApplicationCampoIp:function(pApplication){
		var app = NS_APPLICATIONS.applications[pApplication];
		return typeof app.campo_ip != 'undefined' ? app.campo_ip :'IP';
	},		
	
	getApplicationPath:function(pApplication){
		if(NS_APPLICATIONS.applications[pApplication].path == null){
			dwr.engine.setAsync(false);
			dwrUtility.getApplicationUrl(pApplication,function(resp){
				NS_APPLICATIONS.applications[pApplication].path = resp;
			});
			dwr.engine.setAsync(true);
		}
		return NS_APPLICATIONS.applications[pApplication].path;
	},
	
	performLogin:function(pApplication)
	{
		var success = false;
		
		if(NS_APPLICATIONS.applications[pApplication].session_created
				&& NS_APPLICATIONS.applications[pApplication].last_call > (new Date().getTime() - 60 * 60 * 1000) )
		{
			success = true;
		}
		else
		{
			var url_autologin = NS_APPLICATIONS.getApplicationPath(pApplication);			
			
			if (url_autologin != null)
			{
				url_autologin  +=	"Autologin"
								//+	"?" + NS_APPLICATIONS.getApplicationCampoSwitch(pApplication) + "=CHECK_LOGIN"
								+	"?" + NS_APPLICATIONS.getApplicationCampoUser(pApplication) + "=" +baseUser.LOGIN
								+	"&" + NS_APPLICATIONS.getApplicationCampoIp(pApplication) + "=" +basePC.IP;

				//j$.support.cors = true;
				//alert(url_autologin);
				j$.ajax({
					//crossDomain: true,
					url: url_autologin,
					async:false,
					success:function(data){
							NS_APPLICATIONS.applications[pApplication].session_created=true;
							success = true;
						},
					error:function(obj,message,errorThrown){
							alert('Login application['+pApplication+'] error:' + errorThrown);
						}
				});
			}
		}
		//alert(success);
		return success;
				
	},
	
	switchTo:function(pApplication,pResource)
	{
		if(NS_APPLICATIONS.performLogin(pApplication))
		{	
			NS_APPLICATIONS.applications[pApplication].last_call = new Date().getTime();
			return NS_APPLICATIONS.getApplicationPath(pApplication) + pResource;
		}
	}	
};


// modifica 27-5-15


//carico info aetitle PC !
function ElcoJsLogFileObject() {
	// posso creare qualche proprietà
	this.classVersion = ElcoJsLogFileObjectVersion;
	this.saveDateTimeEachRow = false;
}

function mySetSaveDateTimeEachRow(value){
	this.saveDateTimeEachRow = value;
}

function myGetSaveDateTimeEachRow(){
	return this.saveDateTimeEachRow;
}


//@param pathFileName indica il percorso del file (path + file)
// la funzione crea il file e lo chiude senza scriverci dentro
// ATTENZIONE se il file esiste già il create lo AZZERA !!
function myCreateFile(pathFileName)
{
   var fso, tf;
   try{
	   if (pathFileName==""){
		   throw new Error("Path file is null");
	   }	   
	   fso = new ActiveXObject("Scripting.FileSystemObject");
	   tf = fso.CreateTextFile(pathFileName, true);
	   tf.Close();
   }
   catch(e){
	   throw e;
   }
   return;
}


function myGetUserTempFolder(){

	var WindowsFolder = 0 ;
	var SystemFolder = 1 ;
	var TemporaryFolder = 2	;
	var outputFolder = "";
	try{
/*		var ws = new ActiveXObject("WScript.Shell");
		outputFolder = ws.ExpandEnvironmentStrings("%Temp%");*/
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		outputFolder = fso.GetSpecialFolder(TemporaryFolder);
		//alert(tempFolder);
	}
	catch(e){
		throw e;
	}
	return outputFolder;
}



function myWriteToFile(pathFileName, textToAppend){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		try{
			var ts = fso.OpenTextFile(pathFileName, ForWriting);
		}
		catch(e){
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}


function myAppendToFile(pathFileName, textToAppend){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var ts;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		if (this.existFile(pathFileName)){
			ts = fso.OpenTextFile(pathFileName, ForAppending);
		}
		else{
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
			ts = fso.OpenTextFile(pathFileName, ForAppending);			
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}

// funzione che appende un testo ad un file
// MA se il file supera una dimensione limite 
// (prima della scrittura) lo cancella
// e lo scrive da zero
function myAppendToFileWithFileLimit(pathFileName, textToAppend, limitSize){
	
	var ForReading = 1, ForWriting = 2, ForAppending = 8;
	var ts;
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		if (textToAppend==""){
			return;
		}
		if (isNaN(limitSize)){
			throw new Error("Limit size is null");			
		}
		var fso = new ActiveXObject("Scripting.FileSystemObject");	
		if (this.existFile(pathFileName)){
			try{
				var f = fso.GetFile(pathFileName);
			}
			catch(e){
				throw new Error("File does not exist");							
			}
			if (f.size>=limitSize){
				// supera, quindi apro in writing
				ts = fso.OpenTextFile(pathFileName, ForWriting);
			}
			else{
				// NON supera, apro in appending
				ts = fso.OpenTextFile(pathFileName, ForAppending);
			}
		}
		else{
			// se vado in eccezione il file NON esiste
			// quindi lo creo
			try{
				this.createFile(pathFileName);
			}
			catch(e){
				throw new Error("AppendFile - can't create file");
			}
			ts = fso.OpenTextFile(pathFileName, ForWriting);			
		}
		if (this.getSaveDateTimeEachRow()){
			ts.WriteLine(getDateTimeNow() +" " + textToAppend) ;			 
		}
		else{
			ts.WriteLine(textToAppend) ;			
		}
//		ts.WriteBlankLines(1) ;
		ts.Close();
	}
	catch(e){
		throw e;
	}
}





function myDeleteFile(pathFileName){
	try{
		if (pathFileName==""){
			throw new Error("Path file is null");
		}		
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(pathFileName);
		f.Delete();
	}
	catch(e){
		throw e;		
	}
}


// NB i ath passati come parametri
// DEVONO avere il path completo di directory + nome file 
function myMoveFile(sourcePathFileName, targetPathFileName){
	try{
		if (sourcePathFileName==""){
			throw new Error("Source path is null");
		}		
		if (targetPathFileName==""){
			throw new Error("Target path is null");
		}				
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(sourcePathFileName);
		f.Move(targetPathFileName);
	}
	catch(e){
		throw e;		
	}	
}
	

// NB i ath passati come parametri
// DEVONO avere il path completo di directory + nome file 
function myCopyFile(sourcePathFileName, targetPathFileName){
	try{
		if (sourcePathFileName==""){
			throw new Error("Source path is null");
		}		
		if (targetPathFileName==""){
			throw new Error("Target path is null");
		}				
		var fso = new ActiveXObject("Scripting.FileSystemObject");			
		var f = fso.GetFile(sourcePathFileName);
		f.Copy(targetPathFileName);
	}
	catch(e){
		throw e;		
	}	
}


function myExistFile(pathFileName){
	var bolExist = false;
	try{
		var f;
		if (pathFileName==""){
			throw new Error("Path file is null");
		}					
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		try{
			f = fso.GetFile(pathFileName);
			try{f.close();}catch(e){;}
			bolExist = true;			
		}
		catch(e){
			// NON esiste
			bolExist = false;
		}
	}
	catch(e){
		throw e;		
	}	
	return 	bolExist ;
}

//@return ritorna dimensione in byte
function myGetFileSize (pathFileName){
	var fileSize = 0;
	try{
		var f;
		if (pathFileName==""){
			throw new Error("Path file is null");
		}					
		var fso = new ActiveXObject("Scripting.FileSystemObject");		
		try{
			f = fso.GetFile(pathFileName);
		}
		catch(e){
			// NON esiste
			throw new Error("File does not exist");
		}
		fileSize = f.size;
	}
	catch(e){
		throw e;		
	}		
	return fileSize;
}

function myGetElcoClassVersion(){
	return this.classVersion;
}



function getDateTimeNow(){
	var strOutput = "";
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	strOutput = day + "/" + month + "/" + year;
	
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var second = currentTime.getSeconds();
	if (minutes < 10){
		minutes = "0" + minutes;
	}
	strOutput = strOutput + " - " + hours + ":" + minutes + ":"	+ second;
	return strOutput;
}


//var clsElcoJsLogFileObject = new ElcoJsLogFileObject();
ElcoJsLogFileObject.prototype.createFile = myCreateFile;
ElcoJsLogFileObject.prototype.getUserTempFolder = myGetUserTempFolder;
ElcoJsLogFileObject.prototype.writeToFile = myWriteToFile;
ElcoJsLogFileObject.prototype.appendToFile = myAppendToFile;
ElcoJsLogFileObject.prototype.deleteFile = myDeleteFile;
ElcoJsLogFileObject.prototype.moveFile = myMoveFile;
ElcoJsLogFileObject.prototype.copyFile = myCopyFile;
ElcoJsLogFileObject.prototype.existFile = myExistFile;
ElcoJsLogFileObject.prototype.getFileSize = myGetFileSize;
ElcoJsLogFileObject.prototype.appendToFileWithFileLimit = myAppendToFileWithFileLimit;
ElcoJsLogFileObject.prototype.getElcoClassVersion = myGetElcoClassVersion;
ElcoJsLogFileObject.prototype.getSaveDateTimeEachRow = myGetSaveDateTimeEachRow;
ElcoJsLogFileObject.prototype.setSaveDateTimeEachRow = mySetSaveDateTimeEachRow;




var globalLogFileObject = new ElcoJsLogFileObject();
var logFileName = "reportingTrace.log";
// valore massimo di log, espresso in byte
// setto 2 megabyte
var logFileLimitSize = "2097152";
var ElcoJsLogFileObjectVersion = "1.0";
function scriviLog(testo){
	try{
		globalLogFileObject.setSaveDateTimeEachRow(true);
		globalLogFileObject.appendToFileWithFileLimit(globalLogFileObject.getUserTempFolder() +"\\" + logFileName, testo, logFileLimitSize);
	}
	catch(e){
		//alert("scriviLog - Error: " + e.description);
	}		
}

// *************************


// modifica 29-7-15
function creaNuovaNotificaSuPaziente(idenAnag){
	
	var urlToCall = "";
	urlToCall = parent.top.opener.top.gestioneNotifiche.getUrlCreateMsgOnAnag(idenAnag);
	if (urlToCall==""){
		alert("Errore nel recupero delle informazioni del pazienti. Riprovare.");
		return ;
	}
	urlToCall += "&sorgente=console";
//	alert(urlToCall);
	j$.fancybox(
		{	
			'width'		: document.documentElement.offsetWidth/10*9,
			'height'	: document.documentElement.offsetHeight/10*8,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
//			'title'	:	'Stampa moduli', 
			'href'	:	urlToCall,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'type'				: 'iframe',
			'scrolling'   		: 'yes',
			'showCloseButton'	: true,
			//'onStart'	: function(  ) {try{showHideReportControlLayer(false);}catch(e){;}},
			//'onClosed'	: function( ) {try{showHideReportControlLayer(true);}catch(e){;}},
			'onComplete': function() {
		    }		
		});			
}
// ****************

// modifica 13-8-15
function caricaPrenotazioniPaziente(){
	// cambio approcio perchè questo si inchioda INSPIEGABILMENTE
	try{
		var  urlRicetteMultiple = "addOn/generaRicetteMultiple/generaRicetteMultiple.html?sorgente=console";
		urlRicetteMultiple += "&idenAnag=" + globalIdenAnag;
		j$.fancybox(
		{	
			'width'		: document.documentElement.offsetWidth/10*9,
			'height'	: document.documentElement.offsetHeight/10*8,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
//			'title'	:	'Stampa moduli', 
			'href'	:	urlRicetteMultiple,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'type'				: 'iframe',
			'scrolling'   		: 'yes',
			'showCloseButton'	: true,
			//'onStart'	: function(  ) {try{showHideReportControlLayer(false);}catch(e){;}},
			//'onClosed'	: function( ) {try{showHideReportControlLayer(true);}catch(e){;}},
			'onComplete': function() {
		    }		
		});			
	}
	catch(e){
		alert("caricaPrenotazioniPaziente - Error: " + e.description);
	}
	
	

	

	/*$.fancybox({
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
		'scrolling'   		: 'no'
   });*/
}

// ***************************************
//  modifica 21-9-15
function apriStoricoPaziente(){
	try{
		var  urlStoricoPaziente = "addOn/storicoPaziente/storicoPaziente.html?sorgente=console";
		urlStoricoPaziente += "&idenAnag=" + globalIdenAnag;
		j$.fancybox(
		{	
			'width'		: document.documentElement.offsetWidth/10*9,
			'height'	: document.documentElement.offsetHeight/10*8,
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
//			'title'	:	'Stampa moduli', 
			'href'	:	urlStoricoPaziente,
			'iframe': {
				preload: false // fixes issue with iframe and IE
			},
			'type'				: 'iframe',
			'scrolling'   		: 'yes',
			'showCloseButton'	: true,
			//'onStart'	: function(  ) {try{showHideReportControlLayer(false);}catch(e){;}},
			//'onClosed'	: function( ) {try{showHideReportControlLayer(true);}catch(e){;}},
			'onComplete': function() {
			}	,
			'onClosed'	: function( ) {
							try{
								j$(this).href="about:blank";
							}catch(e){;}		
					}			
		});			
	}
	catch(e){
		alert("apriStoricoPaziente - Error: " + e.description);
	}	
}
