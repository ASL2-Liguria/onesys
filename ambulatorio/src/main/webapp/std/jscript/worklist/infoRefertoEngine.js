window.onload = function (){bringConsoleUp();};
var functionToCallAfterCheckLock = "";
function initGlobalObject(){
	try{initbasePC();}catch(e){;}
	try{initbaseUser();}catch(e){;}
	try{initbaseGlobal();}catch(e){;}	
	try{
		if ((currentTabulator =="idPrecedenti")||(currentTabulator =="idKeyImages")){
			try{addAlternateColor();}catch(e){;}
		}
	}
	catch(e){
	}
	try{
		if(currentTabulator =="idPrecedenti"){
			bindReportLayerEvent();
		}
	}
	catch(e){
		// nessun tabulatore selezionato ?!
//		alert("nessun tabulatore selezionato ?!");
	}
	try{fillLabels(arrayLabelName, arrayLabelValue);}catch(e){;}
	try{if (baseGlobal.GESTIONE_SITI_REMOTI == 'S'){initCalendario();initInfoFiltriRemoti();}}catch(e){;}
	try{initSubGlobalObject();}catch(e){;}	
	// ****
	

	
	// ****

}

function caricaTab(valore){
	if (valore==""){
		return;
	}
	try{
		// carico il tabulatore selezionato
		risezeConsoleBottomFrame(true);
		document.frmTabulator.idTabulator.value = valore
		document.frmTabulator.submit();
	}
	catch(e){
		alert("caricaTab - Error: " + e.description);
	}
}

function closeInfoReferto(){
	try{
		parent.worklistMainFrame.apriChiudiInfoReferto();
	}
	catch(e){
		try{
			parent.RicPazWorklistFrame.apriChiudiInfoReferto();
		}
		catch(e){
			alert("closeInfoReferto - " + e.description);
		}
	}
}


//sposta la selezione del chiamante di una riga in giù 
function moveSelectionUpDown(valore){
	try{
		parent.worklistMainFrame.moveSelectionUpDown(valore);
	}
	catch(e){
		;
	}
}

function bringConsoleUp(){
	// porto in primo piano la console
	try{
		setTimeout("bringConsoleUpDelayed()",1000);
	}
	catch(e){
		;
	}		
}

function bringConsoleUpDelayed(){
	try{
		parent.leftConsolle.bringConsoleToFront();
	}
	catch(e)
	{;}
}

// funzione che crea il tabulatore
// per aprire il frame in console
// sul dblclick
function createMaximizeTabulator (){
	try{
		// aggancio doppio click
		// su striscia tabulatore
		// controllo che non ci sian il tabulatore per muoversi su e giù
		// tra gli esami della wk
		var oggetto 
		
		if (baseUser.USENEWCONSOLELAYOUT=="S"){
			oggetto = document.getElementById("containerCmdButtonOutside");
			if (!oggetto){
				// non esiste
				divObj =  document.createElement("DIV");
				divObj.id = "topRightTabulator";
				if (!parent.bolConsoleBottomFrameOpened){
					divObj.className = "toMaximize";
				}
				else{
					divObj.className = "toMinimize";					
				}

				divObj.onclick = function(){risezeConsoleBottomFrame();}
				document.body.appendChild(divObj);
			}
		}
	}
	catch(e){
		alert("Creating topRight layer: " + e.description);
	}	
}

// queste variabili devono essere 
// esterne al frame, le posiziono nel
// framset della console
function risezeConsoleBottomFrame(bolMaximize, bolMinimize){
	var dimensioneFrameset;
	var dimensioneFramesetTop;
	var dimensioneFramesetBottom;
	var forceMaximize = false;
	var bolInConsole = false;
	var forceMinimize = false;
	var nuovoLayout = "N";
	
	try{
		try{
			nuovoLayout = baseUser.USENEWCONSOLELAYOUT;
		}
		catch(e){
			// quando è chiamato dalla consoleEngine
			// può NON essere ancora inizializzato 
			// baseUser, in tal caso non faccio nulla
			return;
		}
		try{
			// sono in console
			dimensioneFrameset = parent.document.all.framesetConsolle.rows;			
			bolInConsole = true;			
		}
		catch(e){
			bolInConsole = false;
		}
		// se  NON sono in console NON massimizzo
		if (!bolInConsole){return;}
		if (nuovoLayout != "S"){					
			// vecchio layout
			return;
		}
		if ((bolMaximize=="") || (bolMaximize=='undefined')){
			// giro standard
			forceMaximize = false;
		}
		else{
			forceMaximize = bolMaximize;
		}
		if ((bolMinimize=="") || (bolMinimize=='undefined')){
			// giro standard
			forceMinimize = false;
		}
		else{
			forceMinimize = bolMinimize;
		}		
		if (forceMinimize && forceMaximize){return;}
		
		try{
			// se è già massimizzato e devo forzarlo non 
			// faccio nulla			
			if ((forceMaximize)&&(parent.bolConsoleBottomFrameOpened)){
				// simulo che sia chiuso
				return;		
			}
			// se è minimizzato e devo forzarlo
			// non faccio nulla
			if ((forceMinimize)&&(!parent.bolConsoleBottomFrameOpened)){
				// simulo che sia chiuso
				return;		
			}			
			
		}
		catch(e){
			;
		}

		if (parent.oldSizeConsoleBottomFrame==""){
			parent.oldSizeConsoleBottomFrame = dimensioneFrameset;		
		}
		if (!parent.bolConsoleBottomFrameOpened){
			// apro
			parent.bolConsoleBottomFrameOpened = true ;
			parent.document.all.framesetConsolle.rows = parseInt(screen.availHeight/2) + ",*";
			//alert(parent.document.all.framesetConsolle.rows);
			document.getElementById("topRightTabulator").className = "toMinimize";
		}
		else{
			// chiudo
			parent.bolConsoleBottomFrameOpened = false ;			
			parent.document.all.framesetConsolle.rows = parent.oldSizeConsoleBottomFrame;
			//alert(parent.document.all.framesetConsolle.rows);
			document.getElementById("topRightTabulator").className = "toMaximize";			
			
		}
//		dimensioneFramesetTop = dimensioneFrameset.split(",")[0];
//		dimensioneFramesetBottom = dimensioneFrameset.split(",")[1];		
		
	}
	catch(e){
		//alert("risezeConsoleBottomFrame - Error: " + e.description);
	}
}


function initBaseClass(){
	try{
		initbasePC();
		initbaseUser();
	}
	catch(e){
		;
	}
}

// ******
function creaPulsanteRegistrazione(){
	
	var tabella;
	var myTR ;
	var myTD ;
	try{
		if (bolTabulatorEditing){
			// possibile registrare
			// SOLO su archivi locali
			if ((document.frmAggiorna.cod_server_remoto.value=="")||(document.frmAggiorna.cod_server_remoto.value=="local")){
				tabella = document.getElementById("idTableDetail");
				if (tabella){
					myTR = AppendRow(tabella);				
					myTR.id = "idRowSaveButton";
					myTD = AppendCell(myTR);					
					myTD.colSpan = 2;
					myTD.appendChild(getDivButton("","idBtSave","pulsanteWide",linkSaveButton,"","Registra","Registra"));
				}
			}
		}
	}
	catch(e){
		alert("creaPulsanteRegistrazione - Error: " + e.description);
	}
}

function creaRadioButtonValutazione(){
	var tabella;
	var myTR ;
	var myTD ;
	var myTD1 ;
	try{
		if (bolTabulatorEditing){
			// possibile registrare
			// SOLO su archivi locali
			if ((document.frmAggiorna.cod_server_remoto.value=="")||(document.frmAggiorna.cod_server_remoto.value=="local")){
				tabella = document.getElementById("idTableDetail");
				
				if (tabella){
					myTR = AppendRow(tabella);				
					myTR.id = "idRowRadioButton";
					
					myTD1 = AppendCell(myTR);
					myTD1.className="classTdLabel";
					labelValHtml = '<label class="classTdLabel" id="lblValutazione">Valutazione</label>';
					var labelFragment = document.createElement('div');
    				 labelFragment.innerHTML = labelValHtml;
					 
					myTD1.appendChild(labelFragment);
					myTD = AppendCell(myTR);					
					myTD.colSpan = 1;
					myTD.className="classTdField";
					var radioHtml = '<input type="radio" name="radValutazione" value="1" >1</input>';
						radioHtml +='<input type="radio" name="radValutazione" value="2">2</input>';
						radioHtml +='<input type="radio" name="radValutazione" value="3">3</input>';
   				 	var radioFragment = document.createElement('div');
   				 	
    				  radioFragment.innerHTML = radioHtml;

					myTD.appendChild(radioFragment);
				}
			}
		}
	}
	catch(e){
		alert("creaPulsanteRadio - Error: " + e.description);
	}
}

function AppendRow(srcTable){
	try{
		if(srcTable != null){return srcTable.insertRow();}else{alert("Error while creating table. Cause: Container Table is null!");}
	}
	catch(e){
		alert("AppendRow - Error: " + e.description);
	}	
}

function AppendCell(srcRow){
	try{
		if(srcRow != null){return srcRow.insertCell();}else{alert("Error while creating table. Cause: Container row is null!");}
	}
	catch(e){
		alert("AppendCell - Error: " + e.description);
	}		
}

// esempio di pulsante <div id='idBtSave' class='pulsante'><a id='btSave' href='javascript:registra()'></a></div>
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


function registraDettEsame(){
	try{
		callCheckLockEsami(document.frmAggiorna.idenEsame.value);
		salvaValutazione();
	}
	catch(e){
		alert("registraDettEsame - Error: " + e.description);
	}
}



// **************************
// ******** AJAX ************
// **************************

function callCheckLockEsami(valore){

	try{
		if (valore==""){
			alert("Impossibile continuare. Iden nullo");
			return;
		}
		// selezionato
		functionToCallAfterCheckLock = "updateDati('"	+valore+"')"	;
		//esiste referto controllo
		parametro = valore;	
		ajaxLockManage.checkLockRecordReferto(valore,callbackCheckLock)
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
	
	try{	
		funzione = functionToCallAfterCheckLock;
		if (errore!=""){
			listaInfoErrore = errore.split("*");
			// record lockato
			if (listaInfoErrore[0].toString()=="LOCK"){
				//alert(errore);
				// visualizzo chi lo locka
				// avviso che qualcun altro ha aperta o lo scheda esame o il referto
				// chiedo conferma per continuare
	//			alert(baseUser.IDEN_PER +" " + listaInfoErrore[1] );
				if (baseUser.IDEN_PER!=listaInfoErrore[1]){
					// NON sono io !!
					if (confirm(ritornaJsMsg("jsmsgLock") + " " + listaInfoErrore[3].toString() + "\n Continuare?")){
						bolContinua = true;
					}
					else{
						// NON continua
						bolContinua = false;	
					}
				}
				else{
					// sono io !!
					bolContinua = true;
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
	catch(e){
		alert("caricaTab - Error: " + e.description);
	}
}


function updateDati(valore){
	var collectionCampi
	var strToEval = "";
	var bolInConsole = false;
	var allExamCodes = "";

	try{

		// prendo tutti i campi editabili
		collectionCampi = getElementsByAttribute(document.body, "*", "editabile", "S");				
		if (collectionCampi.length==0){
			alert("Nessun campo editabile da aggiornare");
			return;
		}

		// è andata a buon fine
		// quindi posso estendere la modifica
		// a tutti gli esami in fase di refertazione
		// se e solo se sono in console di refertazione
		try{
			// sono in console
			var dimensioneFrameset = parent.document.all.framesetConsolle.rows;			
			bolInConsole = true;			
		}
		catch(e){
			bolInConsole = false;
		}
		// resetto vecchi dati
		resetJSONObjEsa();
		// uso oggetto json per aggiornare
		objEsame.esameObj[0].IDEN = valore;
		for (var i=0;i<collectionCampi.length;i++){
			try{
				
				strToEval = "objEsame.esameObj[0]." + collectionCampi[i].nomecampo + " = '" + collectionCampi[i].value.toString().replaceAll("'","\\'") + "'";
				var re = /\n/g; 
				strToEval = strToEval.replace(re, '\\n'); 
				re = /\r/g; 
				strToEval = strToEval.replace(re, '\\r');	
				eval (strToEval);
			}
			catch(e){
				alert("Errore manca campo " + collectionCampi[i].nomecampo + "\n" + e.description);
				return;
			}
		}
		// apro tendina
		try{utilMostraBoxAttesa(true,"");}catch(e){;}		
		// valore indica esami.iden
		// per il o i quali fare l'aggiornamento
		if (!bolInConsole){
			// NON sono in console
			ajaxQueryCommand.ajaxUpdateEsami(JSON.stringify(objEsame),valore,replyUpdateDati);			
		}
		else{
			// SONO in console
			if (parent.leftConsolle.document.getElementById("oEsa_Ref").length==1){
				ajaxQueryCommand.ajaxUpdateEsami(JSON.stringify(objEsame),valore,replyUpdateDati);
			}
			else{
				// faccio aggiornamento multiplo SOLO SE
				// l'esame che ho scelto fa parte di uno di quelli in fase 
				// di refertazione
				allExamCodes = parent.leftConsolle.getAllOptionCode('oEsa_Ref');
				if (allExamCodes.toString().indexOf(valore)==-1){
					// NON ci sono match 
					// quindi è un esame che NON è tra quelli in fase di refertazione
					// aggiorno SOLO quello
					ajaxQueryCommand.ajaxUpdateEsami(JSON.stringify(objEsame),valore,replyUpdateDati);					
				}
				else{
					ajaxQueryCommand.ajaxUpdateEsami(JSON.stringify(objEsame),allExamCodes,replyUpdateDati);			
				}
			}			
		}

	}
	catch(e){
		alert("updateDati - Error: "+ e.description);
		try{utilMostraBoxAttesa(false,"");}catch(e){;}			
	}

}

var replyUpdateDati = function(returnValue){
	
	var oggetto;
	var idenEsame ;
	
	try{
		if (returnValue.split("*")[0]=="KO"){
			alert("Error: " + returnValue.split("*")[1]);
		}
	}
	catch(e){
		alert("replyUpdateDati - Error: "+ e.description);
	}
	finally{
		try{utilMostraBoxAttesa(false,"");;}catch(e){;}
		
	}
}


function salvaValutazione()
{
	
	if(getCheckedValue(radValutazione)!='')
	{
		
		toolKitDB.executeQueryData('{call  SP_SALVAVALUTAZIONE('+document.frmAggiorna.idenEsame.value+','+getCheckedValue(radValutazione)+')}',Ret_salvaValutazione);	
	}
}

function Ret_salvaValutazione(variab)
{
//alert(variab);
}
// in base all'id
// viene reso lampeggiante il tabulatore
// indicato
function setBlinkTabulator(tabId){
	var oggetto;
	try{
		oggetto = document.getElementById(tabId);
		if (oggetto){
			oggetto.className = "classTabulator_blink";
		}
	}
	catch(e){
		alert("setBlinkTabulator - Error: " + e.description);
	}
}

// stop del blink
function stopBlinkTabulator(tabId){
	var oggetto;
	try{
		oggetto = document.getElementById(tabId);
		if (oggetto){
			oggetto.className = "classTabulator";
		}
	}
	catch(e){
		alert("stopBlinkTabulator - Error: " + e.description);
	}
}

function apriUrlDoc(urlToCall){
	try{
		var finestra = window.open(urlToCall,"","fullscreen=yes, scrollbars=yes");
		if (finestra){
			finestra.focus();
		}
		else{
			finestra = window.open(urlToCall,"","fullscreen=yes, scrollbars=yes");
		}
	}
	catch(e){
		alert("apriUrlDoc - Error: " + e.description);	
	}	
}

function getCheckedValue(radioObj) {
	if(!radioObj)
		return "";
	var radioLength = radioObj.length;
	if(radioLength == undefined)
		if(radioObj.checked)
			return radioObj.value;
		else
			return "";
	for(var i = 0; i < radioLength; i++) {
		if(radioObj[i].checked) {
			return radioObj[i].value;
		}
	}
	return "";
}