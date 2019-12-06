// variabile contenente il "report" in formato txt
var reportHtmlConvertedToTxt = "";
//variabile contenente il "report" in formato html
var reportHtmlOriginal = "";

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
//		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - (8*dimensioneBordoFrameset);
		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - 10;		
		
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
		if (dimensioneFramesetDx.toString().indexOf("%")>-1){
			dimensioneFramesetDx = parseInt(larghezzaSchermo * parseInt(dimensioneFramesetDx.toString().replace("%","")) / 100);
		}
		dimensioneBordoFrameset = parent.document.all.rightFramesetConsolle.border;		
		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - (8*dimensioneBordoFrameset);
		// *******************
		
		// *******************
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
		/*altezzaRptControl = parseInt(parent.document.all.framesetConsolle.rows.split(",")[1].replace("px","")) - parseInt(altezzaFirstLayout) - parseInt(altezzaSecondLayout) -  (2*altezzaHeader);
		//alert(parseInt(parent.document.all.framesetConsolle.rows.split(",")[1].replace("px","")));
		
		if (document.getElementById("divFirstLayout").style.display!='none'){
				altezzaRptControl = altezzaRptControl - altezzaFirstLayout;
		}
		if (document.getElementById("divSecondLayout")){
			if (document.getElementById("divSecondLayout").style.display!='none'){
					altezzaRptControl = altezzaRptControl - altezzaSecondLayout;
			}		
		}*/
		
		// tolgo spazio eventuale scrollbar
		larghezzaRptControl = larghezzaRptControl - 20;
		var bottomFrameHeight = parseInt(parent.document.all.framesetConsolle.rows.split(",")[1].replace("px",""));
		// tener conto del window title, eventuale status bar ed eventuale barra di windows
		altezzaRptControl = screen.availHeight - (parseInt(3 * altezzaFirstLayout) + parseInt(altezzaSecondLayout) +  (4*altezzaHeader) + bottomFrameHeight);
	}
//	alert(larghezzaRptControl + "*" + altezzaRptControl);
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
	
	// ***************
	var convertedText= "";
	var regex =new RegExp("&#13&#10" , "g");
	try{
		if(myTesto != '' && typeof myTesto != 'undefined')
		{
			if(myTesto.substr(0, 2) == '&#'){
				var y = document.createElement('textarea');
			  	y.innerHTML = myTesto;
				var txtHtml = y.value;
				convertedText = txtHtml.replace(new RegExp("#CRLF#" , "g"),"\r\n"); 
			}
			else{
				try{
					convertedText = decodeURI(myTesto);
				}
				catch(e){
					convertedText = myTesto;
				}
			}
		}
	
		if (objectReportControl){
			convertedText = convertCharSet(convertedText,"xml","utf_8",false);
			//alert("convertedText: " + convertedText);
			// per ora lo gestisco così (non so se è chiamato altrove)
			// dopo vedo se fare un prototype dell'oggetto objectReportControl
			try{objectReportControl.pasteText(convertedText);}
			catch(e){
				window.frames[reportControlID].importaRefertoSelezionato(convertedText);
			}
		}	
	}
	catch(e){
		alert("pasteText - Error - " + e.description);
	}

}

// funzione di inizializzazione del testo del
// report control
// @deprecated !!! lo si fa da consoleEngine
function initReportText(){
	var headerRTF= "{\\rtf1\\";
	var strDescrEsami = "";
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
			//alert("### in consoleRPTctlutil_moduloconsole initReportText forzareftxt")
			setReportControlTXTText(refertoTXT);			
		}
		else{
			if (refertoRTF!=""){
				//alert("### in consoleRPTctlutil_moduloconsole initReportText setta rtf")
				setReportControlRTFText(refertoRTF);
			}
			else{
				//alert("### in consoleRPTctlutil_moduloconsole initReportText setta txt")
				setReportControlTXTText(refertoTXT);
			}
		}
	}
}

// funzione che 
// inizializza dimensioni 
// e parametri vari dell'oggetto di reportistica
function initRptControl(){
		var dimensioneReportControl ;
		var paddingLayer ;
		var paddingLayerNumber =0;		
		
		try{
			dimensioniRptControl = getProcessedSize(); 
			try{
				paddingLayer = CSSRule('#myConsoleBody').style.padding;			
				paddingLayerNumber = parseInt(paddingLayer.toString().toLowerCase().split("px")[0]);
			}
			catch(e){
				paddingLayerNumber = 0;
			}			
			// *********
			// modifica nuovo privacy
			// DEVE ESSERE = "S"
			try{
				if (top.opener.top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
					setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber) - 170);					
				}
				else{
					setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber));
				}
			}
			catch(e){
				setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber));				
			}
			// **************
			initOtherParamsRptControl();
		}
		catch(e){
			alert("initRptControl - Error: " + e.description);
		}		
}

// funzione che
// inizializza i vari parametri
// dell'activex
//@TODO
function initOtherParamsRptControl(){
	// start del modulo !
	return;
}

function callbackFromIframeAfterLoading(value){
	var strIdenEsame = "";
	try{
//		alert(value);
		switch (value){
			case "INIT":
				// ciclare tra tutte le schede
				// per fare il caricamento sequenziale
				// gestire il timing
				for (var i = 0; i<array_iden_esame.length;i++){
					if (strIdenEsame ==""){
						strIdenEsame = array_iden_esame[i];
					} 
					else{
						strIdenEsame += "*" + array_iden_esame[i];
					}
				}
					
					// modifica 3/9/2014 aldo
					// ormai è assodato che gestiremo sempre e solo
					// un modulo per volta all'interno della console
					// quindi è inutile, e controproducente, richiamare 
					// n volre la initModuloConsole
//				for (var k =0; k<listaModuliConsole.length; k++){
					// ambulatorio
					// modifica del 2012-11-22
					// aggiunto iden_anag come parametro 2013-02-14
					//try{window.frames[reportControlID].initModuloConsole(globalIdenAnag,document.frmMain.HIDEN_REF.value,array_iden_esame[k],"","",tipoModalita,listaModuliConsole[k],baseUser.LOGIN);}catch(e){;}
					try{window.frames[reportControlID].initModuloConsole(globalIdenAnag,document.frmMain.HIDEN_REF.value,strIdenEsame,"","",tipoModalita,listaModuliConsole[0],baseUser.LOGIN);}catch(e){;}
					// *********************
					// modifica 11-6-2015 - chiamo funzione in commonFunctions
					try{window.frames[reportControlID].initMedInizSection();}catch(e){;}
					// *********************
					
//				}
				break;
			default:
				break;
		}
	}
	catch(e){
		alert("callbackFromIframeAfterLoading - error: " + e.description);
	}
}


//funzione che setta il valore
//di un oggetto (tramite suo id)
//contenuto in un IFrame (tramite suo id)
function setValueIframeObjectById(idIframe, idObject, valore){
	var iFrameObj
	var objText

	try{
		iFrameObj = document.getElementById(idIframe);
		if (iFrameObj){
			if ( iFrameObj.contentDocument ) { // DOM
				objText = iFrameObj.contentDocument.getElementById('idObject');
			} else if ( iFrameObj.contentWindow ) { // IE win questo è ok
				objText = iFrameObj.contentWindow.document.getElementById('txtAddress');
			}
			if (objText){
				objText.value = valore;
			}
		}	
	}
	catch(e){
		alert("setValueIframeObjectById " + e.description);
	}
	
}

// setta la dimensione di default 
// dell'activex
function setDefaultSizeChar(){
	return;
}

// funzione che abilita
// o meno il read only
// del controllo di refertazione
function setReportControlReadOnly(valore){

	var solaLettura = false;
	
	if (valore==""){
		return;
	}	
	if (valore=="S"){
		solaLettura = true;
	}
	else{
		if (valore=="N"){
			solaLettura = false;
		}
		else{
			solaLettura = valore;	
		}
	}
	//alert("TODO setReportControlReadOnly");
	return;
	if (objectReportControl){
		objectReportControl.setReadOnly = solaLettura;
	}
}


// funzione che ridimensiona l'oggetto ReportControl
function setReportControlObjectSize(larghezza, altezza){
	if (isNaN(larghezza)||isNaN(altezza)){return;}
	if (objectReportControl){
		objectReportControl.style.height = altezza;
		objectReportControl.style.width= larghezza;
	}
}


// funzione che setta la dimensione
// del testo selezionato
// @TODO
function setReportControlSelTextSize(dimensione){
	//alert("TODO setReportControlSelTextSize");
}


// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato TXT
function setReportControlTXTText(initValue){
	// alert("TODO setReportControlTXTText");
	return;
	
	// ************
	
}

// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato RTF
function setReportControlRTFText(initValue){
	//alert("TODO setReportControlRTFText");
}

// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato TXT
function setReportControlHTMLText(initValue){
	//alert("TODO setReportControlHTMLText");
}

// funzione che ritorna il testo formato HTML 
// del referto
function getReportControlHTML(){
	try{
		reportHtmlOriginal = window.frames[reportControlID].getDatiHtmlFormatted("",modulo_refertazione);
	}
	catch(e){
		alert("getReportControlHTML - Error: " + e.description);
	}	
	try{
		if (reportHtmlOriginal.toString()==""){
			alert("ERRORE GRAVE: dati html vuoti. Contattare l'amministratore di sistema");
		}	
	}catch(e){;}
	return reportHtmlOriginal;
}

// funzione che ritorna il testo formato TXT 
// del referto
function getReportControlTXT(){
	try{
		reportHtmlConvertedToTxt = window.frames[reportControlID].getDatiHtmlFormatted("XSLT_4_WRITING_TXT",modulo_refertazione);
	}
	catch(e){
		alert("getReportControlTXT - Error: " + e.description);
	}
	return reportHtmlConvertedToTxt;
}

// ******************************
// ********* nuovo 13/6/2011 ****
// ******************************
function getReportControlSelectedtext(){
	//alert("TODO getReportControlSelectedtext");
}
// ******************************

// funzione che ritorna il testo formato RTF 
// del referto
function getReportControlRTF(){
	//alert("TODO getReportControlRTF");
	return "";
}

//funzione che ritorna l'altezza del controllo
function getReportControlHeight(){
	if (objectReportControl){
		return objectReportControl.style.height;
	}	

}

//funzione che ritorna la larghezza del controllo
function getReportControlWidth(){
	if (objectReportControl){
		return objectReportControl.style.width;
	}	
}



// funzione
// che setta il fuoco sul controllo
// di refertazione, questo dipenderà
// dalla particolare scheda
function setFocusOnReportControl(){
	
	try{
		// non viene chiamato perchè il frame non è ancora
		// stato caricato
		setFocusOnFirstField();
	}
	catch(e){
		;
	}
}

// funzione
// chiamata all'unload della pagina
function unloadReportObject(){
	//alert("TODO unloadReportObject");
}



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
	reportHtmlConvertedToTxt = returnValue;
}