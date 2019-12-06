// JavaScript Document

var hnd_attesa = null; 	function apri_attesa() 	{	try{	this.hnd_attesa = window.open("../../classAttesa","wnd_attesa","left=" + (parseInt(screen.availWidth/2)-80)+ " ,top=" + (parseInt(screen.availHeight/2)-35) +",width=240,height=70,statusbar=no")			}	catch(e){alert(e.description);} 	} 	 	function chiudi_attesa() 	{	try{	if (this.hnd_attesa)	{	this.hnd_attesa.close();	}	}	catch(e){	} 	}


var DATA_ENTRY_TABLE_CREATOR = {
	nomeSezione: "",
	fieldsArray: [],
	stmToSave:"",
	setSezione: function(value){
		this.nomeSezione = value;
	},
	getSezione: function(){
		return this.nomeSezione;
	},
	setStmToSave: function(value){
		this.stmToSave = value;
	},
	getStmToSave: function(){
		return this.stmToSave;
	},
	setFieldsArray: function(lista){
		this.fieldsArray = lista;
	},
	getFieldsArray: function(){
		return this.fieldsArray;
	},
	getRenderedTable:function(){
		var strTable = "", strTbody = "", strTfoot = "";
		/*<thead>  <tr>     <th>Month</th>     <th>Savings</th>  </tr> </thead>*/
		var listaCampi = this.getFieldsArray();
		if (typeof(listaCampi)=="undefined"){
			throw new Error("Errore campi non definiti") ;
		}
		try{
			for (var k=0; k < listaCampi.length; k++){
				// listaCampi[k].
				strTbody += "<tr>";
				// settare il delStatement e non getSezione
				strTbody += "<td class='classTdLabelRicerca'>" + listaCampi[k].descr + "</td><td>";
				// tipoControllo
				switch (listaCampi[k].tipoControllo){
					case "text":
						strTbody += "<input type='text' id='" + listaCampi[k].nomedb +"' gruppo='dataentry_" + this.getSezione() +"' ";
						// valore default
						if (listaCampi[k].defaultValue!="" || listaCampi[k].stmToInitDeafaultValue!=""){
							// per ora gestisco solo defaultValue
							strTbody += " value =\"" + listaCampi[k].defaultValue +"\" ";
						}
						// lunghezza massima maxLung
						if (!isNaN(listaCampi[k].maxLung)){
							strTbody += " maxlength='" + listaCampi[k].maxLung +"' ";					
						}
						// upper case
						if (listaCampi[k].upCase){
							strTbody += " onblur='javascript:this.value = this.value.toUpperCase();' " ;
						}
						// size		
						strTbody += " size='50' ";			
						// attributi extra
						for (var z=0;z<listaCampi[k].extra_attributi.lenth;z++){
							strTbody += listaCampi[k].extra_attributi[z].attributo +" = \"" + listaCampi[k].extra_attributi[z].valore +"\"";
						}
						strTbody += "/>";					
						break;
					case "combo":
							strTbody += "<select id='" + listaCampi[k].nomedb +"'  gruppo='dataentry_" + this.getSezione() + "'";
							// attributi extra
							for (var z=0;z<listaCampi[k].extra_attributi.length;z++){
								strTbody += " " + listaCampi[k].extra_attributi[z].attributo +" = \"" + listaCampi[k].extra_attributi[z].valore +"\"";
							}
							strTbody += "><option value=''><option>";
							if (listaCampi[k].stmToInitDeafaultValue!=""){
								try{
									var rs = getHomeFrame().executeQuery('gestioneNuovoAmbu.xml',listaCampi[k].stmToInitDeafaultValue,[]);
									while (rs.next()){
										// fare replace
										strTbody += "<option value=\"" + rs.getString("codice") +"\" >" + rs.getString("descrizione") + "</option>"; 
									}
								}
								catch(e){alert("Error on " +listaCampi[k].stmToInitDeafaultValue + " " + e.description);}
							}
							strTbody += "</select>";
							// fill_selectFromResultSetWithBlankOption(rs,"ricMODULO", "COD_ESA", "DESCR", -1);	
							
						break;
					default:
						break;
				}
				strTbody += "</td></tr>";
			}
			if (strTbody!=""){
				strTbody = "<tbody>" + strTbody + "</tbody>"
			}
			strTable = "<table id='dataentryTable_" + this.getSezione() +"' class='clsDatiTabella'>" + strTbody + "</table>";
//			alert(strTable);
		}
		catch(e){
			throw new Error("getRenderedTable, Error: " + e.description) ;
		}
		return strTable;
	}
}

// *****************************************
// *****************************************
// ***** NB al momento x problemi di tempo
// ***** le sezioni sono cablate, sarebbe
// più opportuno rendere tutto dinamico
// creando un parametro ad hoc in ges_config_page
// con un valore di tipo json ove viene descritta
// tutta la struttura delle sezioni
// *****************************************
// *****************************************

var LOG_FIELD = {
	localIdObj : "",
	getStdMsgNoOp :function(){
		return "Nessuna elaborazione eseguita";
	},
	setLogObjectId: function(value){
		this.localIdObj = value;
	},
	getLogObjectId: function(){
		return this.localIdObj;
	},
	resetLog: function(){
		this.writeInfo(this.getStdMsgNoOp());
	},
	writeInfo: function(value){
		$("#" + this.getLogObjectId()).removeClass($("#" + this.getLogObjectId()).attr("class"));		
		$("#" + this.getLogObjectId()).addClass("info");				
		$("#" + this.getLogObjectId()).html(value);
	},	
	writeWarning: function(value){
		$("#" + this.getLogObjectId()).removeClass($("#" + this.getLogObjectId()).attr("class"));		
		$("#" + this.getLogObjectId()).addClass("warning");		
		$("#" + this.getLogObjectId()).html(value);
	},
	writeError: function(value){
		$("#" + this.getLogObjectId()).removeClass($("#" + this.getLogObjectId()).attr("class"));		
		$("#" + this.getLogObjectId()).addClass("errore");
		$("#" + this.getLogObjectId()).html(value);
	}
	
}



var params;
function getParams() {
	try{
		var idx = document.URL.indexOf('?');
		if (idx != -1) {
			var tempParams =  new Hashtable();
			var pairs = document.URL.substring(idx+1,document.URL.length).split('&');
			for (var i=0; i<pairs.length; i++) {
				nameVal = pairs[i].split('=');
				tempParams.put(nameVal[0],nameVal[1]);
			}
			return tempParams;
		}
	}
	catch(e){
		alert("getParams - Error:  "+ e.description);
	}
}	


function getHomeFrame(){
	var objHomeFrame;
	
	try{
		if (typeof (params) == "undefined"){
			objHomeFrame = parent.top;
		}
		else{
			if (params.get("sorgente")=="worklist"){
				objHomeFrame = parent.top;
			}
			else{
				// sono in iFrame, a meno che non lo sposti
				// in una fancybox
				objHomeFrame = parent.top;
			}
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}

function init(){
	try{
		params = getParams();
		initNote_e_Pulsanti();		
		$( "#accordion" ).accordion({
		      heightStyle: "content"
	    });
		$( "button" )
	      .button()
	      .click(function( event ) {
	        event.preventDefault();
	      });		
		LOG_FIELD.setLogObjectId("lblLogInfo");
		LOG_FIELD.writeInfo(LOG_FIELD.getStdMsgNoOp());
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
}

//test
function creaInterfacciaGestione(value){
	var urlIFrameGestione = "";
	var strSezione = value;
	var indexToLoad = -1;
	var objSezione;
	var strTable ="";
	var stmToLoad = "";	
	try{

		try{
			var idxA = Object.GetObjectKeyIndex(jsonNoteSezioni.elencoSezioni,strSezione);
			var objA = jsonNoteSezioni.elencoSezioni[idxA][strSezione]; 	
			urlIFrameGestione = objA.urlIFrameGestione;
		}catch(e){alert(e.description);urlIFrameGestione=""};
		

		if (urlIFrameGestione=="" || typeof(urlIFrameGestione)=="undefined"){
			indexToLoad = Object.GetObjectKeyIndex(jsonDataInfo.elencoSezioni,strSezione);
			if (indexToLoad==-1){
				alert("Configurazione non trovata per: " + value);
				return;
			}
			$("#containerDataTable_" + strSezione).remove();
			objSezione = jsonDataInfo.elencoSezioni[indexToLoad][strSezione]; 		
			stmToLoad = objSezione.stmToLoad;			
				// caso "classico" di tabella
			TABLE_BUILDER.setHome(getHomeFrame());
			TABLE_BUILDER.setSezione(strSezione);
			TABLE_BUILDER.setStmToLoad(stmToLoad);
			TABLE_BUILDER.setFieldsArray(objSezione.fieldsToLoad);
			try{
				strTable = TABLE_BUILDER.getRenderedTable();
			}
			catch(e){alert(e.description);}
			
			$("#sezione_" + strSezione).append("<div class='containerDataTable' id='containerDataTable_"+ strSezione +"'>" + strTable + "</div>");
		}
		else{
			// carico e creo iframe
			// alert("carico iframe: " + urlIFrameGestione);
			
			var ifrmHtml = "";
			if (objA.iFrame_height==""){
				ifrmHtml = '<iframe width="95%" src="' + urlIFrameGestione +'" id="iFrameDettaglio" ></iframe>'			;
			}
			else{
				ifrmHtml = '<iframe width="95%" src="' + urlIFrameGestione +'" height="' + objA.iFrame_height + '" id="iFrameDettaglio" ></iframe>'			; 
			}
				
			if ( $( "#iFrameDettaglio" ).length ) {
				// lo rimuovo perchè la sezione potrebbe essere differente	
				$( "#iFrameDettaglio" ).remove();
			}
			$("#sezione_" + strSezione).append(ifrmHtml);			
		}
	}
	catch(e){
		alert("creaInterfacciaGestione - Error: "  + e.description);
	}
}


function initNote_e_Pulsanti(){
	try{	
		var nota ="", legenda = "", linkFunction="";
		var strPulsante ;
		var strSezione = ""; var objSezione;
		var strFieldSet = "";

//		alert(objSezione.linkInterfaccia);return;
		
		for (var k=0;k<jsonNoteSezioni.elencoSezioni.length;k++){
//			alert(jsonNoteSezioni[elencoSezioni[k]].nota);
			strSezione = Object.keyAt(jsonNoteSezioni.elencoSezioni[k], 0);
			objSezione = jsonNoteSezioni.elencoSezioni[k][strSezione]; 
			nota = objSezione.nota;
			legenda = objSezione.legenda;
			linkFunction = objSezione.linkInterfaccia;
			if (nota !=""){
//				$("#lbllegend_" + strSezione).html(legenda);			
//				$("#lblnote_" + strSezione).html(nota);		
				strFieldSet = "<fieldset><legend><label id='lbllegend_" + strSezione +"'>"+ legenda +"</label></legend><div><label id='lblnote_" + strSezione + "'>"+ nota +"</label></div></fieldset>";
				$("#sezione_" + strSezione).append(strFieldSet);
				
			}
			if (linkFunction!=""){
//				<button class='clsEseguiInterfaccia' onclick='javascript:getHomeFrame().manu_tab(\'amb_T_CDC\');'>Apri interfaccia di configurazione</button>
				$("#sezione_" + strSezione).append("<button class='clsEseguiInterfaccia' onclick=\""+ linkFunction +"\">" + strDefaultPulsanteApriInterfaccia +"</button>"); 
			}
		};
	}
	catch(e){
		alert("initNote - Error:  "+ e.description);
	}
}

function createButtonInterface(){
	try{
		var linkFunction="";
		for (var k=0;k<elencoSezioni.length;k++){
			linkFunction = jsonNoteSezioni[elencoSezioni[k]].nota;
		}
	}
	catch(e){
		alert("createButtonInterface - Error:  "+ e.description);
	}
}




function chiudi(value){

	document.location.replace("about:blank");
//	parent.jQuery.fancybox.close();						
}




// *******************
//@deprecated
function insertRow(sezione){
	var strTableHtml= "<html><body>Test</body></html>";
	
	try{
		DATA_ENTRY_TABLE_CREATOR.setSezione(sezione);
		var indexToLoad = Object.GetObjectKeyIndex(jsonDataInfo.elencoSezioni,sezione);
		if (indexToLoad==-1){
			alert("Configurazione non trovata per: " + value);
			return;
		}
		var objSezione = jsonDataInfo.elencoSezioni[indexToLoad][sezione]; 		
		var stmToSave = objSezione.stmToSave;		
		DATA_ENTRY_TABLE_CREATOR.setStmToSave(stmToSave);		
		DATA_ENTRY_TABLE_CREATOR.setFieldsArray(objSezione.fieldsToInsert);		
		strTableHtml= DATA_ENTRY_TABLE_CREATOR.getRenderedTable();
		// appendo in conda il salvataggio
		strTableHtml +="<a href='#' onclick='javascript:registra(\"" + sezione+"\");'>Registra</a>&nbsp;<a href ='#' onclick='javascript:$.fancybox.close();'>Annulla</a>";
		$.fancybox({ 
			'padding'	: 3,
			 autoDimensions: false,
			'width'		: document.documentElement.offsetWidth/10*5,
			'height'	: document.documentElement.offsetHeight/10*4,
			'left':	0,
			'content' : strTableHtml,
			'hideOnOverlayClick':false,
			'overlayColor':'#D6D6D6',
			'showCloseButton':true,
			'enableEscapeButton':false,
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
				//return window.confirm('Close?');
			}
			
		});		
	}
	catch(e){
		alert("insertRow - Error:  "+ e.description);
	}
}

// *******************
//@deprecated
function deleteRow(sezione, rowid){
	try{
		alert("Cancella record per " + sezione +" , rowid: " + rowid);
		// NB NON posso usare il rowid per cancellare la riga, troppo richioso
		// in quanto non univoco nel tempo
				
	}
	catch(e){
		alert("deleteRow - Error:  "+ e.description);
	}		
}

// *******************
//@deprecated
function registra(sezione){
	try{			
		var myListaDati = new Array();
		if (sezione=="")return;
		//usare oggetto saver
		var indexToLoad = Object.GetObjectKeyIndex(jsonDataInfo.elencoSezioni,sezione);
		if (indexToLoad==-1){
			alert("Configurazione non trovata per: " + value);
			return;
		}
		var objSezione = jsonDataInfo.elencoSezioni[indexToLoad][sezione]; 		
		var stmToSave = objSezione.stmToSave;				
		SAVER.setStmToSave(stmToSave);
		// cerco collection per gruppo "dataentry_ " + sezione
		// dataentry_CUP_TAB_ESA
		$('input[type="text"][gruppo="dataentry_' + sezione + '"][daSalvare="S"], textarea[gruppo="dataentry_'+ sezione + '"][daSalvare="S"], select[gruppo="dataentry_'+ sezione + '"][daSalvare="S"]').each(function(i){
			// ATTENZIONE i valori devono esser presei in base al tipo di controllo
			alert($(this).get(0).tagName);
			switch($(this).get(0).tagName){
				case "INPUT":
					myListaDati.push($(this).val());
					break;
				case "SELECT":
					myListaDati.push($(this).find('option:selected').val());
				default :
					myListaDati.push($(this).val());				
					break;
			}

		});
		SAVER.setValuesArray(myListaDati);
		try{
			SAVER.doSave();
			// ricarico tabella
			TABLE_BUILDER.setSezione(sezione);
			creaInterfacciaGestione(sezione);
		}
		catch(e){
			alert(e.description);
		}
		finally{
			$.fancybox.close();
		}
	}
	catch(e){
		alert("registra - Error:  "+ e.description);
	}	
}