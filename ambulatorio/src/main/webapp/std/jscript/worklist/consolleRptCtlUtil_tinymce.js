
var timerDelayedSettingText
var reportToInit = "";

// variabile usata 
// dalla chiamata Ajax che converte
// da html a txt (deprecated)
var reportHtmlConverted = "";

var publicDimensioniRptControl = "";

var initTextFirstCall = true;
var initialEditorClassName = "";


var editorStyle_vocalON = "mceContentBody_vocalON";
var editorStyle_vocalOFF = "mceContentBody_vocalOFF";
var editorStyle_error = "mceContentBody_error";
var editorStyle_disabled = "mceContentBody_disable";
var editorStyle_working = "mceContentBody_working";



// in seguito ad introduzione suggerimenti e conclusioni
// è meglio gestire l'evento di attivazione affinchè venga
// ogni volta settato il controllo attivo
var activeTinyId = "";
// indica a quale altezza si trova il controllo
// per scrivere il referto
// setto cmq un valore di default 
var topReportControl = 120;

// funzione che calcola le dimensioni del Report Control
// in base all'apertura/chiusura dei vari layer e frame

function getProcessedSize(){
	
	var dimensioneFrameset	="";
	var dimensioneFramesetDx	="";
	var dimensioneBordoFrameset = "";	
	var altezzaFinestraPrincipale = altezzaSchermo;
	var altezzaFirstLayout ="", altezzaSecondLayout="", altezzaHeader="";
	// imposto default
	var larghezzaRptControl="", altezzaRptControl="";


	if (baseUser.USENEWCONSOLELAYOUT != "S"){
		// estrapolo dimensione frame di dx
		dimensioneFrameset = parent.document.all.framesetConsolle.cols;
		dimensioneFramesetDx = dimensioneFrameset.split(",")[1];
		dimensioneBordoFrameset = parent.document.all.framesetConsolle.border;
		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - (8*dimensioneBordoFrameset);
		
		altezzaFirstLayout = document.all.headerFirstLayout.height;
		try{altezzaSecondLayout = document.all.headerSecondLayout.height;}catch(e){altezzaSecondLayout=0;}
		altezzaThirdLayout	= document.all.headerThirdLayout.height;
		altezzaHeader = CSSRule('TABLE.classTabHeader').style.height;
		altezzaFirstLayout = CSSRule('#divFirstLayout').style.height;
		// *******
		document.getElementById("divFirstLayout").style.height = altezzaFirstLayout;
		// *******	
		if (document.getElementById("divSecondLayout")){
			altezzaSecondLayout = CSSRule('#divSecondLayout').style.height;
			document.getElementById("divSecondLayout").style.height = altezzaSecondLayout;	
		}
		else{
			altezzaSecondLayout = "0px";
		}
		// *******		
		altezzaHeader = altezzaHeader.replace("px","");
		altezzaFirstLayout = altezzaFirstLayout.replace("px","");
		altezzaSecondLayout = altezzaSecondLayout.replace("px","");
		altezzaRptControl = altezzaFinestraPrincipale - (7*altezzaHeader);
		if (document.getElementById("divFirstLayout").style.display!='none'){
				altezzaRptControl = altezzaRptControl - altezzaFirstLayout;
		}
		if (document.getElementById("divSecondLayout")){
			if (document.getElementById("divSecondLayout").style.display!='none'){
					altezzaRptControl = altezzaRptControl - altezzaSecondLayout;
			}
		}
	}
	else{
		dimensioneFrameset = parent.document.all.rightFramesetConsolle.cols;
		dimensioneFramesetDx = dimensioneFrameset.split(",")[1];		
		dimensioneBordoFrameset = parent.document.all.rightFramesetConsolle.border;		
		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - (8*dimensioneBordoFrameset);
		
		altezzaFirstLayout = document.all.headerFirstLayout.height;
		try{altezzaSecondLayout = document.all.headerSecondLayout.height;}catch(e){altezzaSecondLayout=0;}
		altezzaThirdLayout	= document.all.headerThirdLayout.height;
		altezzaHeader = CSSRule('TABLE.classTabHeader').style.height;
		altezzaFirstLayout = CSSRule('#divFirstLayout').style.height;		
		
		// *******
		document.getElementById("divFirstLayout").style.height = altezzaFirstLayout;
		// *******	
		if (document.getElementById("divSecondLayout")){
			altezzaSecondLayout = CSSRule('#divSecondLayout').style.height;
			altezzaSecondLayout = parseInt(altezzaSecondLayout.replace("px","") - 150);
			altezzaSecondLayout	= altezzaSecondLayout + "px";
			document.getElementById("divSecondLayout").style.height = altezzaSecondLayout;
		}
		else{
			altezzaSecondLayout = "0px";
		}		
		altezzaHeader = altezzaHeader.replace("px","");
		altezzaFirstLayout = altezzaFirstLayout.replace("px","");
		altezzaSecondLayout = altezzaSecondLayout.replace("px","");
		try{topReportControl = parseInt(altezzaFirstLayout) + parseInt(altezzaSecondLayout) + (3*parseInt(altezzaHeader));}catch(e){;}
		/*altezzaRptControl = parseInt(parent.document.all.framesetConsolle.rows.split(",")[0].replace("px","")) - parseInt(altezzaFirstLayout) - parseInt(altezzaSecondLayout) -  (2*altezzaHeader) + 40;
		if (document.getElementById("divFirstLayout").style.display!='none'){
				altezzaRptControl = altezzaRptControl - altezzaFirstLayout;
		}
		if (document.getElementById("divSecondLayout")){
			if (document.getElementById("divSecondLayout").style.display!='none'){
					altezzaRptControl = altezzaRptControl - altezzaSecondLayout;
			}		
		}	*/
		var bottomFrameHeight = parseInt(parent.document.all.framesetConsolle.rows.split(",")[1].replace("px",""));
		// tener conto del window title, eventuale status bar ed eventuale barra di windows
		altezzaRptControl = screen.availHeight - (parseInt(3 * altezzaFirstLayout) + parseInt(altezzaSecondLayout) +  (4*altezzaHeader) + bottomFrameHeight);
	}
	return larghezzaRptControl + "*" + altezzaRptControl;
}


function resizeRptCtlAfterCloseLayer(nomeLivello){
	var larghezzaRptControl = "";
	var altezzaRptControl = "";
	var altezzaLayer ="";

	
	if (objectReportControl){
		larghezzaRptControl = objectReportControl.getWidth();
		altezzaRptControl =  objectReportControl.getHeight();
	}	
	altezzaLayer = CSSRule('#'+nomeLivello).style.height;
	altezzaLayer = altezzaLayer.replace("px","");	
	if (document.getElementById(nomeLivello)){
		if (document.getElementById(nomeLivello).style.display=='none'){
			altezzaRptControl = parseInt(altezzaRptControl) + parseInt(altezzaLayer);
		}
		else{
			altezzaRptControl = parseInt(altezzaRptControl) - parseInt(altezzaLayer);
		}
		setReportControlObjectSize (larghezzaRptControl, altezzaRptControl);
	}
}


// metodo che incolla il testo 
// nel controllo del report
function pasteText(myTesto){
	var myReport;
	try{
		//alert("son qui ");
		var convertedText = convertCharSet(myTesto,"xml","utf_8",false);
		//alert("son qua ");
		tinyMCE.execCommand('mceInsertContent',false,convertedText);			
	}
	catch(e){
		alert("pasteText - Error: " + e.description);
	}

}

// funzione di inizializzazione del testo del
// report control
function initReportText(){

	var strDescrEsami = "";
	
	try{
		try{mostraBoxAttesa(true, "Caricamento in corso...");}catch(e){;}			
		if (tipoModalita=="INSERIMENTO"){
			// costruisco stringa con descrizione esami
			for (var i =0;i<array_descr_esame.length;i++){
				if(strDescrEsami==""){
					strDescrEsami = array_descr_esame[i];
				}
				else{
					strDescrEsami = strDescrEsami + "\r\n" + array_descr_esame[i];
				}
			}
			setReportControlTXTText(strDescrEsami);
		}
		else{
			if (baseGlobal.FORZA_REFTXT=="S"){
				reportToInit = refertoTXT;									
				setReportControlTXTText(refertoTXT);			
			}
			else{
				if (refertoHTML!=""){
					setReportControlHTMLText(refertoHTML);
				}
				else{
					setReportControlTXTText(refertoTXT);
				}
			}
		}
	}
	catch(e){
		alert("initReportText - Error: " + e.description)
	}
	finally{
		try{mostraBoxAttesa(false, "");}catch(e){;}	
	}
}

// funzione che 
// inizializza dimensioni 
// e parametri vari dell'oggetto di reportistica
function initRptControl(){
	// vedere http://tinymce.moxiecode.com/forum/viewtopic.php?id=22709
		var dimensioneReportControl ;
		var numeroRighe = 28;
		var paddingLayer ;
		var paddingLayerNumber =0;
		var altezza;
		var larghezza;
		
		try{
			// inizializzo prima il testo
			tinyMCE.init({
				mode : "exact",
				plugins: "contextmenu_refertazione",
				elements : "objReportControl",
				theme : "advanced",
				skin : "o2k7",
				skin_variant : "silver",
				theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,|,code",
				theme_advanced_buttons2 : "",
				theme_advanced_buttons3 : "",
				theme_advanced_toolbar_location : "top",
				theme_advanced_toolbar_align : "left",
				theme_advanced_statusbar_location : "bottom",
				theme_advanced_resizing : true,
				setup : function(ed) {
					  ed.onSetContent.add(function(ed) {
						  onSetContentCall(ed);
					  });				
					  ed.onInit.add(function(ed) {
						  onInitCall(ed);
					  });
 					  ed.onActivate.add(function(ed) {
						  setActiveControlId(ed.id);
					  });	
 					  ed.onDeactivate.add(function(ed) {
						  deactiveTinyControl(ed.id);
					  });		
				   },	
				content_css : "std/jscript/tiny_mce/css/polarisTinyContent.css?" + new Date().getTime()
			});	
			
			try{
				/*
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
						  setActiveControlId(ed.id);
					  });			
 					  ed.onDeactivate.add(function(ed) {
						  deactiveTinyControl(ed.id);
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
						  setActiveControlId(ed.id);
					  });		
 					  ed.onDeactivate.add(function(ed) {
						  deactiveTinyControl(ed.id);
					  });					  
				    },							
					content_css : "std/jscript/tiny_mce/css/polarisTinyContent.css?" + new Date().getTime()			
				});			*/		
			}
			catch(e){
				alert("error!!");
			}
		}		
		catch(e){
			alert("Can't init tinyMCE object");
			return;
		}
		// 28 righe per 1280*1024
		// cmq sia con il nuovo layout è fissa la 
		// dimensione di sopra 640
		document.getElementById("objReportControl").rows = numeroRighe;
		try{
			dimensioniRptControl = getProcessedSize(); 
			// le rendo pubbliche per essere accessibili ognidove
			publicDimensioniRptControl = dimensioniRptControl;
			
			try{
				paddingLayer = CSSRule('#myConsoleBody').style.padding;			
				paddingLayerNumber = parseInt(paddingLayer.toString().toLowerCase().split("px")[0]);
			}
			catch(e){
				paddingLayerNumber = 0;
			}
			if (parseInt(paddingLayerNumber)==0){paddingLayerNumber=10;}
			altezza = parseInt(dimensioniRptControl.split("*")[1]) - parseInt(2*paddingLayerNumber);
			larghezza = parseInt(dimensioniRptControl.split("*")[0]-10);
			setReportControlObjectSize(larghezza, altezza);
			// **************
			initOtherParamsRptControl();
		}
		catch(e){
			alert("initRptControl - Error: " + e.description);
		}
		
}


// funzione chiamata quando è generato
// l'evento oninit del controllo tinyMCE
function onInitCall(oggetto){
	try{
	
		if (initTextFirstCall){
			// prima chiamata
			initTextFirstCall = false;
	//		var editor = tinyMCE.getInstanceById('objReportControl');
	//		initialEditorClassName = editor.getBody().className;
	//		editor.getBody().style.backgroundColor = "#FFFF66";		
		}
	}
	catch(e){
		alert("onInitCall - Error: " + e.description);
	}
}

function onSetContentCall(oggetto){
	//alert("settato contenuto " + oggetto.id + "#" );
	
}

// funzione che
// inizializza i vari parametri
// dell'activex
function initOtherParamsRptControl(){
	return;
}


// setta la dimensione di default 
// dell'activex
function setDefaultSizeChar(){
	
	
	var myEditor;
	// la dimensione del testo deve essere
	// settata solo all'inserimento e NON alla modifica
	// mentre  il valore del combo lo setto sempre
	try{
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){					
			if (baseUser.PH_DIMCAR!=""){
				if (!isNaN(baseUser.PH_DIMCAR)){
					myEditor.execCommand('SelectAll');
					myEditor.execCommand('FontSize', false, baseUser.PH_DIMCAR);				
					// devo rimappare la line height se la dimensione del carattere
					// e maggiore di 18
//					objectReportControl.setComboFontDefaultSize(baseUser.PH_DIMCAR);					
				}
			}
		}
	}
	catch(e){
		alert("setDefaultSizeChar - " + e.description);
	}	
	// non supportata
	return;
}

// funzione che abilita
// o meno il read only
// del controllo di refertazione
function setReportControlReadOnly(valore){
	// non supportata
	return;
}


// funzione che ridimensiona l'oggetto ReportControl
// da rivedere
function setReportControlObjectSize(larghezza, altezza){
	
	var oggettoInside
	if (isNaN(larghezza)||isNaN(altezza)){return;}
	//alert("prima - "+ larghezza + " " + altezza);
	if (objectReportControl){
		objectReportControl.style.width = parseInt(larghezza);
		objectReportControl.style.height = parseInt(altezza);
		
	}
	//alert("dopo - "+ larghezza + " " + altezza);
}


// funzione che setta la dimensione
// del testo selezionato
function setReportControlSelTextSize(dimensione){
	// non supportata
	return;
}


// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato TXT
function setReportControlTXTText(initValue){
	var regEx = /\r\n+/g;	
	try{
		reportToInit = initValue.replace(regEx, "<BR />");
		timerDelayedSettingText = setInterval("delayedSettingReportText()", 1000);		
	}
	catch(e){
		alert("setReportControlTXTText - Error: " + e.description);
	}
}




// dal momento che l'oggetto W3
// viene inizializzato in ritardo devo 
function delayedSettingReportText(){

	var testo = "";
	var myEditor;	
	var esito =false;


	testo = reportToInit;
	if (objectReportControl){
		try{mostraBoxAttesa(true, "Caricamento in corso...");}catch(e){;}			
		try{
			myEditor = tinyMCE.get('objReportControl');
			if (myEditor){
				clearInterval(timerDelayedSettingText);				
				myEditor.focus();
				// per fare insert nel punto del cursore
//				esito = tinyMCE.execCommand('mceInsertContent',false,testo);	
				myEditor.setContent(testo);
//				myEditor.execCommand('SelectAll');
//				myEditor.execCommand('Bold');
//				myEditor.execCommand('FontName', false, 'Times');				
//				myEditor.execCommand('FontSize', false, '7');				
//				il setStyleInfo non funzia
//				myEditor.execCommand('mceSetStyleInfo', false, "test1");

//				myEditor.execCommand('FormatBlock', false, 'h3');
//				tinyMCE.activeEditor.dom.addClass(tinyMCE.activeEditor.dom.select('p'), 'tinyParagraph'); 				

			}
		}	
		catch(e){
			//alert("W3 not found");
			clearInterval(timerDelayedSettingText);	
			try{
				timerDelayedSettingText = setInterval("delayedSettingReportText()", 2000);		
			}
			catch(e){
				alert("Error reinitializing tinyMce");
				try{
					timerDelayedSettingText = setInterval("delayedSettingReportText()", 2000);							
				}
				catch(e){
					alert("Error reinitializing tinyMce. Second try.");	
				}

			}
		}	
		finally{
			setDefaultSizeChar();
			try{mostraBoxAttesa(false, "");}catch(e){;}
		}
	}
	else{
		clearInterval(timerDelayedSettingText);		
		try{mostraBoxAttesa(false, "");}catch(e){;}
	}
}



// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato RTF
function setReportControlRTFText(initValue){
	// non supportata
	// mi comporto allo stesso modo del testo plain
	// da verificare !!
	// **************************
	// ***** NON SUPPORTATA *****
	// **************************		
	return;
}


// funzione che ritorna il testo formato TXT 
// del referto
// ATTENZIONE - QUI DEVE essere fatta una
// conversione HTML -> TXT 
function getReportControlTXT(){
	var strOutput = "";
	var myEditor;
	try{
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){	
			strOutput = myEditor.getContent();
		}
		dwr.engine.setAsync(false);				
		callAjaxConverter (strOutput);
		return reportHtmlConverted;
	}
	catch(e){
		alert("getReportControlTXT - Error: " + e.description);
	}
	finally{
		dwr.engine.setAsync(true);		
	}
}


// ******************************
// ********* nuovo 13/6/2011 ****
// ******************************
function getReportControlSelectedtext(){
	var strOutput = "";
	var myEditor;
	try{
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){	
			strOutput = myEditor.selection.getContent();
		}
		dwr.engine.setAsync(false);				
		callAjaxConverter (strOutput);
		return reportHtmlConverted;
	}
	catch(e){
		alert("getReportControlSelectedtext - Error: " + e.description);
	}
	finally{
		dwr.engine.setAsync(true);		
	}
}
// ******************************

// funzione che ritorna il testo formato RTF 
// del referto
function getReportControlRTF(){
	// NON gestito 
	return "";
}



// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato HTML
function setReportControlHTMLText(initValue){
	try{
		reportToInit = initValue;
		timerDelayedSettingText = setInterval("delayedSettingReportText()", 2000);		
	}
	catch(e){
		alert("setReportControlHTMLText - Error: " + e.description);
	}
	finally{
		try{mostraBoxAttesa(false, "");}catch(e){;}	
	}
}

// funzione che ritorna il testo formato HTML 
// del referto
function getReportControlHTML(){
	var strOutput = "";
	var myEditor;
	try{
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){	
			strOutput = myEditor.getContent();
		}		
		return strOutput;
	}
	catch(e){
		alert("getReportControlHTML - Error: " + e.description);
	}
}

//funzione che ritorna l'altezza del controllo
function getReportControlHeight(){
	var altezza  = "";
	var myEditor;	
	try{
		myEditor = tinyMCE.get('objReportControl');
		altezza = myEditor.rows;		
	}
	catch(e){
		alert("getReportControlHeight - Error: " + e.description);
	}
	return altezza;

}

//funzione che ritorna la larghezza del controllo
function getReportControlWidth(){
	var largh  = "";
	try{
		// fissa perchè
		// tinymce supporta solo il nuovo layout
		// con colonne a larghezza fissa!
		largh = "640";
	}
	catch(e){
		alert("getReportControlWidth - Error: " + e.description);
	}
	
	return largh;	
}



// funzione
// che setta il fuoco sul controllo
// di refertazione
function setFocusOnReportControl(){
	
	var myEditor;
	try{
		myEditor = tinyMCE.get('objReportControl');
		if (myEditor){
			myEditor.focus();
		}
	}
	catch(e){
		;
	}
}

// funzione
// chiamata all'unload della pagina
function unloadReportObject(){
	
	
}


// **************************************
// ****************** AJAX
// **************************************
function callAjaxConverter(value){
	var strToSend = "";
	try{
		// dal momento che il controllo 
		// quando ci sono 2 spazi mette "&nbsp; "
		// annullo il &nbsp; lasciando solo lo spazio
		// ovviamente il testo html verrà salvato così
		// come preso dal controllo senza alcun parsing
		strToSend = value.toString().replaceAll("&nbsp;","");
		ajaxFormatConverter.convertHtmlToText(strToSend, replyAjaxConverter);
	}
	catch(e){
		alert("callAjaxConverter - Error: " + e.description)
	}		
}

var replyAjaxConverter = function(returnValue){
	reportHtmlConverted = returnValue;
	
}


// funzione che fa il "detag" dei tag html
// facendo la conversione da html a txt
function removeHTMLTags(value){
		
		
		try{
	 		var strInputCode = ""
			var strOutput = "";
			
			if (value==""){
				return strOutput;
			}
			else{
				strInputCode = value;
			}
			/* 
				This line is optional, it replaces escaped brackets with real ones, 
				i.e. < is replaced with < and > is replaced with >
			*/	
			strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
				return (p1 == "lt")? "<" : ">";
			});
			var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
			//	alert("Output text:\n" + strTagStrippedText);	
			strOutput = strTagStrippedText;
		   // Use the alert below if you want to show the input and the output text
		   // alert("Input code:\n" + strInputCode + "\n\nOutput text:\n" + strTagStrippedText);	
		}
		catch(e){
			alert("removeHTMLTags - Error: " + e.description);
		}

}

// funzione triggerata su attivazione 
// di un controllo tinyMCE
// setterà l'id del controllo attivo
// e , nel caso di integrazione con 
// hyperspeechSDK, anche la classe
// di visualizzazione
function setActiveControlId(value){
	try{
		activeTinyId = value;
		if (value==""){return;}		
		
	}
	catch(e){
		alert("setActiveControlId - Error: " + e.description);
	}
}

// funzione triggerata su disattivazione 
// di un controllo tinyMCE
// setterà , nel caso di integrazione con 
// hyperspeechSDK, anche la classe
// di visualizzazione OFF
function deactiveTinyControl(value){
	try{
		var status;
		if (value==""){return;}
	
	}
	catch(e){
		alert("deactiveTinyControl - Error: " + e.description);
	}	
}