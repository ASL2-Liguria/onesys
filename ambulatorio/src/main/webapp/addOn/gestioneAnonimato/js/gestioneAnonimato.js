// JavaScript Document

var array_combo_codifiche = new Array();
//@DEPRECATED
/*
array_combo_codifiche = ['BBSOLE_MOTIVAZIONE'];
// elenco SOLO quelli in ingresso (nel caso di listbox doppi col passaggio 
// dati verso un elemento OUT_)
var array_id_combo = new Array();
array_id_combo = ['IDEN_MOTIVAZIONE'];
*/

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
			/*
			if (params.get("sorgente")=="worklist"){
				objHomeFrame = parent.top;
			}
			else{
				// sono in iFrame, a meno che non lo sposti
				// in una fancybox
				objHomeFrame = parent.top;
			}
			*/
			switch (params.get("sorgente")){
				case "worklist":
					objHomeFrame = parent.top;
					break;
				case "consolle":
					objHomeFrame = parent.parent.top.opener.top;
					break;
				case "modulo_consolle":
					objHomeFrame = parent.parent.parent.top.opener.top;
					break;
			}			
			
			
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}




// parametri in ingresso
var inputParametri  = {"idenAnag":"","struttura":""};
function init(){
	var rs ;
	try{
		params = getParams();
		var strOggi = "";
/*		$( "#accordion" ).accordion({
		      heightStyle: "content"
	    });*/
		
		$( "button" )
	      .button()
	      .click(function( event ) {
	        event.preventDefault();
	      });
		 
		inputParametri.idenAnag = decodeURI(params.get("idenAnag"));		
		inputParametri.struttura = decodeURI(params.get("struttura"));				
		//loadAllCombo("");
		$( '#btRicerca' ).button().click(function( event ) {
				ricerca();
				event.preventDefault();
		}).css('width','100%');		
		
		//alert(inputParametri.idenAnag +"#");
		if (inputParametri.idenAnag!="" && typeof(inputParametri.idenAnag)!="undefined" && inputParametri.idenAnag!="undefined"){
			try{rs = getHomeFrame().executeQuery('gestione_anonimato.xml','getInfoAnag',[inputParametri.idenAnag]);}catch(e){alert("Errore getInfoAnag" + e.description);}
			if (rs.next()){
					// carico info paziente				
					$("#infoPaziente").html(rs.getString("COGN") +  " "+ rs.getString("NOME") +"["+ rs.getString("SESSO") +"] Nato il: " + rs.getString("data_nascita") +" - CF:"+ rs.getString("COD_FISC"));
				}		
		}
		
		var codiceAnonimo = "";
		// DA TOGLIERE / correggere
		if (inputParametri.struttura!="" && typeof(inputParametri.struttura)!="undefined" && inputParametri.struttura!="undefined"){
			$("#layerRicerca").hide();
			// carico / genero 
			try{rs = getHomeFrame().executeQuery('gestione_anonimato.xml','getCodiceAnonimo',[inputParametri.idenAnag,inputParametri.struttura ]);}catch(e){alert("Errore getCodiceAnonimo" + e.description);}
			if (rs.next()){
					// carico info paziente				
				codiceAnonimo = rs.getString("codice");
				if (codiceAnonimo!=""){
					$("#lblCodiceAnonimo").html(codiceAnonimo);					
				}
				/*else{
					var out = top.executeStatement('gestione_anonimato.xml','createCodiceAnonimo',[inputParametri.idenAnag ,inputParametri.struttura],1);
					if (out[0] == 'OK') {
						codiceAnonimo = out[2];
					}
					else{
						alert("impossibile creare codice " + out[1]);
					}
				}*/
				
			}	
		}
		else{
			// carico combo
			// baseUser.LISTAREPARTI
//			alert(getHomeFrame().baseUser.LISTAREPARTI.toString());
			try{rs = getHomeFrame().executeQuery('gestione_anonimato.xml','getAllStrutture',[getHomeFrame().baseUser.LISTAREPARTI.toString()]);}catch(e){alert("Errore getAllStrutture" + e.description);}			
			if (getHomeFrame().baseUser.LISTAREPARTI.length>1){				
				$('#CDC').append($('<option>', {
					value: '',
					text: ''
				}));			
			}
			while (rs.next()){
				$('#CDC').append($('<option>', {
					value: rs.getString("cod_cdc"),
					text: rs.getString("descr")
				}));
			}
			if (getHomeFrame().baseUser.LISTAREPARTI.length==1){
				ricerca();
			}
		}
		
		
		
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
}


var bolCodeCreated = false;
function ricerca(){
	try{
		var rs;
		$("#lblCodiceAnonimo").html("");
		if (getValue("CDC")==""){
			alert("Selezionare una unit&#224; ergante valida");
			return;
		}
		try{rs = getHomeFrame().executeQuery('gestione_anonimato.xml','getCodiceAnonimo',[inputParametri.idenAnag,getValue("CDC")]);}catch(e){alert("Errore getCodiceAnonimo" + e.description);}
		if (rs.next()){
				// carico info paziente				
			$("#lblCodiceAnonimo").html(rs.getString("codice"));
			bolCodeCreated = true;
		}	
		
		
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
}


//@DEPRECATED
/*
function salva(){
	try{
		var strToSave = "";
		var comboValue = "";
		comboValue = getValue(array_id_combo[0]);
		if (comboValue==""){
			alert("Prego selezionare una motivazione."); return;
		}
		// ********** aggiusto formato numerico
		var jsonObj = 	JSON.parse(inputParam);
		jsonObj.IDEN_ANAG = isNaN(jsonObj.IDEN_ANAG)?jsonObj.IDEN_ANAG:parseInt(jsonObj.IDEN_ANAG);
		for (var k=0;k<jsonObj.IDEN_ESAMI.length;k++){
			jsonObj.IDEN_ESAMI[k] = isNaN(jsonObj.IDEN_ESAMI[k])?jsonObj.IDEN_ESAMI[k]:parseInt(jsonObj.IDEN_ESAMI[k]);
		}
		// **************
		strToSave = "{\"IDEN_MOTIVAZIONE\":\"" + comboValue+ "\",\"DESCRIZIONE\":\"" + getText(array_id_combo[0])+ "\"}";
		var stm = getHomeFrame().executeStatement('motivazioni.xml',"salvaMotivazione",[JSON.stringify(jsonObj),strToSave, ""],0);			
		if (stm[0]!="OK"){
			alert("Errore nel salvataggio. Segnalare all'amministratore di sistema\n" + stm[1]);
			// vado avanti comunque ma genero errori
			// da verificare
			getHomeFrame().MOTIVAZIONE_HANDLER.setOutputFromFancy(strToSave);
			chiudi();
			return;
		}		
		else{
			getHomeFrame().MOTIVAZIONE_HANDLER.setOutputFromFancy(strToSave);
			chiudi();
		}
	}
	catch(e){
		alert("Errore nel salvataggio - Error: " + e.description);
		strToSave = "{\"IDEN_MOTIVAZIONE\":\"\",\"DESCRIZIONE\":\"\"}";
		try{getHomeFrame().MOTIVAZIONE_HANDLER.setOutputFromFancy(strToSave);}catch(e){;}
		chiudi();		
	}		
}*/

function chiudi(){
	try{
		if (bolCodeCreated){
			parent.aggiorna();
			return;
		}
		else{
			if (params.get("sorgente")=="consolle"){
				parent.j$.fancybox.close();
			}else{parent.jQuery.fancybox.close();}
		}

	}
	catch(e){
		alert("chiudi - Error: " + e.description);
	}		
	//document.location.replace("about:blank");
//	parent.jQuery.fancybox.close();						
}




// *******************



