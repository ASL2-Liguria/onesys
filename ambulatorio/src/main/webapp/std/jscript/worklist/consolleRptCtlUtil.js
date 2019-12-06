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
		dimensioneBordoFrameset = parent.document.all.rightFramesetConsolle.border;		
		larghezzaRptControl = larghezzaSchermo - dimensioneFramesetDx - (8*dimensioneBordoFrameset) - 40;
		
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
		/*altezzaRptControl = parseInt(parent.document.all.framesetConsolle.rows.split(",")[0].replace("px","")) - parseInt(altezzaFirstLayout) - parseInt(altezzaSecondLayout) -  (2*altezzaHeader);
		if (document.getElementById("divFirstLayout").style.display!='none'){
				altezzaRptControl = altezzaRptControl - altezzaFirstLayout;
		}
		if (document.getElementById("divSecondLayout")){
			if (document.getElementById("divSecondLayout").style.display!='none'){
					altezzaRptControl = altezzaRptControl - altezzaSecondLayout;
			}		
		}*/
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
	if (objectReportControl){
		var convertedText = convertCharSet(myTesto,"xml","utf_8",false);
		objectReportControl.pasteText(convertedText);
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
			setReportControlTXTText(refertoTXT);			
		}
		else{
			if (refertoRTF!=""){
				setReportControlRTFText(refertoRTF);
			}
			else{
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
			if (top.opener.top.home.getConfigParam("GESTIONE_ATTIVA_PVCY")=="S"){
				setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber) - 170);
				setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber) - 170);				
			}
			else{			
				setReportControlObjectSize(dimensioniRptControl.split("*")[0], dimensioniRptControl.split("*")[1] - parseInt(2*paddingLayerNumber));
				// viene chiamata due volte perche' il controllo prjReportControl alla versione 1.0.5 ha un baco sul resize 
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
function initOtherParamsRptControl(){
	if (objectReportControl){
		objectReportControl.idreport = paramRptControl_idreport;
		objectReportControl.infostatusbar = paramRptControl_infostatusbar;
		objectReportControl.refreshInfoPanel();
/*		
		objectReportControl.trace ="true";
		objectReportControl.readonly="true";
		objectReportControl.logreport="true";
		objectReportControl.saveAlsoReportRtf="true";
		objectReportControl.infostatusbar=" ";
		objectReportControl.daybeforedelete="2";*/
		
	}	

}

// setta la dimensione di default 
// dell'activex
function setDefaultSizeChar(){
	
	var lunghezzaTesto ;
	// la dimensione del testo deve essere
	// settata solo all'inserimento e NON alla modifica
	// mentre  il valore del combo lo setto sempre
	try{
		if (baseUser.PH_DIMCAR!=""){
			if (!isNaN(baseUser.PH_DIMCAR)){
				if (tipoModalita=="INSERIMENTO"){
					lunghezzaTesto = objectReportControl.getTextLenght();
					objectReportControl.selectText(0,lunghezzaTesto)		
					setReportControlSelTextSize(baseUser.PH_DIMCAR);			
				}
				objectReportControl.setComboFontDefaultSize(baseUser.PH_DIMCAR);					
			}
		}
	}
	catch(e){
		alert("setDefaultSizeChar - " + e.description);
	}
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
	if (objectReportControl){
		objectReportControl.setReadOnly = solaLettura;
	}
}


// funzione che ridimensiona l'oggetto ReportControl
function setReportControlObjectSize(larghezza, altezza){
	if (isNaN(larghezza)||isNaN(altezza)){return;}
	if (objectReportControl){
		objectReportControl.setSize(larghezza, altezza);
	}
}


// funzione che setta la dimensione
// del testo selezionato
function setReportControlSelTextSize(dimensione){
	var lunghTesto
	try{
		if (objectReportControl){
			lunghTesto = objectReportControl.getTextLenght();
			objectReportControl.selectText(0,lunghTesto);
			objectReportControl.setSelTextFontSize(dimensione);	
		}
	}
	catch(e){
		;
	}
}


// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato TXT
function setReportControlTXTText(initValue){
	if (objectReportControl){
		objectReportControl.setTXTtext(initValue);
	}	
}

// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato RTF
function setReportControlRTFText(initValue){
	if (objectReportControl){
		objectReportControl.setRTFtext(initValue);
	}	
}

// funzione che setta il testo iniziale dell' oggetto di controllo
// nel formato TXT
function setReportControlHTMLText(initValue){
	// non gestito
	return;
}

// funzione che ritorna il testo formato HTML 
// del referto
function getReportControlHTML(){
	// NON gestito 
	return "";
}

// funzione che ritorna il testo formato TXT 
// del referto
function getReportControlTXT(){
	if (objectReportControl){
		return objectReportControl.getTXTtext();
	}	
}

// ******************************
// ********* nuovo 13/6/2011 ****
// ******************************
function getReportControlSelectedtext(){
	try{
		if (objectReportControl){
			return objectReportControl.getSelectedTXTtext();
		}	
	}	
	catch(e){
		alert(e.description);
	}
}
// ******************************

// funzione che ritorna il testo formato RTF 
// del referto
function getReportControlRTF(){
	if (objectReportControl){
		return objectReportControl.getRTFtext();
	}	
}

//funzione che ritorna l'altezza del controllo
function getReportControlHeight(){
	if (objectReportControl){
		return objectReportControl.getHeight();
	}	

}

//funzione che ritorna la larghezza del controllo
function getReportControlWidth(){
	if (objectReportControl){
		return objectReportControl.getWidth();
	}	
}



// funzione
// che setta il fuoco sul controllo
// di refertazione
function setFocusOnReportControl(){
	
	try{
		if (objectReportControl){
			objectReportControl.focus();
		}	
	}
	catch(e){
		;
	}
}

// funzione
// chiamata all'unload della pagina
function unloadReportObject(){
	try{
		if (objectReportControl){
			document.all.objectReportControl.SaveReport();
		}	
	}
	catch(e){
		;
	}	
}
// definizione di un'istanza della classe Object()

/*
	for (prop in Computer)
 	{
 		alert(prop + ": " + Computer[prop]);
	}
*/