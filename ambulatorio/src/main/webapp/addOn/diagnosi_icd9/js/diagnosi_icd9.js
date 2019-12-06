
var params;
var DIAGNOSI = {
	IDEN_ESAME:"",
	ICD_DIAGNOSI_CODICE:"",
	ICD_DIAGNOSI_DESCR:""
}
	
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

function init(){
	try{
		params = getParams();
		bindAutoCompleteToDiagnAtt('ricICD_DIAGNOSI');
		bindAutoCompleteToDiagnCod('ricICD_DIAGNOSI_CODICE');		
		DIAGNOSI.IDEN_ESAME = params.get("idenEsame");
		loadInitValue();
	}	
	catch(e){
		alert("init - Error:  "+ e.description);
	}
	finally{
		showLoader(false);
	}
}		


//funzione che carica i valori iniziali del modulo
//in caso di INSERIMENTO (record NON presente lato DB Ambulatorio) viene chiamata, 
//eventualmente, una procedura esterna x reperire i dati
//in caso di MODIFICA vengono caricati i dati locali da DETT_ESAMI
function loadInitValue(){
	var myLista = new Array();
	var rs;

	try{
		if ((DIAGNOSI.IDEN_ESAME=="")||(typeof(DIAGNOSI.IDEN_ESAME)=="undefined")){
			alert("Errore grave: iden esame nullo");
			return;
		}

		initAndResetDiagnosiJson();
		try{rs = getHomeFrame().executeQuery('diagnosi_icd9.xml','getSavedData',[DIAGNOSI.IDEN_ESAME]);}catch(e){alert("Errore: getSavedData");}
		//alert("###check rs ");
		if (rs.next()){
			if (rs.getString("cod_dec")!=""){
				jsonDiagnosiAttuale = {"lista":[{"descrizione":rs.getString("descrizione"), "codice":rs.getString("cod_dec"), "iden":rs.getString("iden")}]};
				//DIAGNOSI.ICD_DIAGNOSI_CODICE = jsonDiagnosiAttuale.lista[0].codice;
				//DIAGNOSI.ICD_DIAGNOSI_DESCR = jsonDiagnosiAttuale.lista[0].descrizione;	
				$("#COD_DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].codice);
				$("#DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].descrizione);
			}
		}
		
	}
	catch(e){
		alert("loadInitValue - Error: " + e.description);
	}
	finally{
		setTimeout(function() { document.getElementById('ricICD_DIAGNOSI').focus(); }, 10);
		
	}
}

function chiudiFormDiagnosi(){
	try{
		if (!isInFancybox()){
			self.close();	
			opener.aggiorna();
		}
		else{
			parent.jQuery.fancybox.close();						
		}
	
	}
	catch(e){
		alert("chiudiFormDiagnosi - Error: " + e.description);
	}	
}

function registra(){
	try{

		var codice = $("#COD_DIAGNOSI").val();
		if (codice==""){
			if (!(confirm("Attenzione il codice della diagnosi non \u00E8 compilato. Continuare comunque?"))){
				return;
			};
		}
		if ((DIAGNOSI.IDEN_ESAME=="")||(typeof(DIAGNOSI.IDEN_ESAME)=="undefined")){
			alert("Errore grave: iden esame nullo");
			return;
		}
		try{
			out = getHomeFrame().executeStatement('diagnosi_icd9.xml','saveDiagnosiICD9',[DIAGNOSI.IDEN_ESAME,codice],0);
		}
		catch(e){
			alert("Errore: nuovaGravidanza\n" + e.description);
			return;
		}
		if (out[0] != 'OK') {
			alert("Errore " + out[1]);
			return false;
		}
		else{
			alert("Operazione completata");
			chiudiFormDiagnosi();
		}
		
	}
	catch(e){
		alert("registra - Error: " + e.description);
	}	
}


function getHomeFrame(){
	try{
		
		switch ( params.get("sorgente")){
			default:
				if (!isInFancybox()){
					return opener.top;
				}
				else{
					return parent.top;
				}
				break;
		}
	}
	catch(e){
		alert("getHomeFrame - Error: " + e.description);
	}		
}

function isInFancybox(){
	try{
		var bolInFancy=false;		
		if(parent.jQuery().fancybox) {
			bolInFancy = true;
		}		
	}
	catch(e){
		alert("isInFancybox - Error: " + e.description);
	}		
	return 	bolInFancy;
}
	


var jsonDiagnosiAttuale ;
var jsonFieldsDiagnAttuali = {fields: [
					 {name:"DESCRIZIONE", type: "string", mappedJSONfield:"value"},
					 {name:"IDEN", type: "int", mappedJSONfield:"iden"},
					 {name:"COD_DEC", type: "string", mappedJSONfield:"codice"},
					 {name:"CATEGORIA", type: "string", mappedJSONfield:"categoria"}
					 ]};

var icdCache = {};
var icdCodCache = {};
function initAndResetDiagnosiJson(){
	try{
		jsonDiagnosiAttuale = {"lista":[]};
		jsonDiagnosiAttuale.lista.push({"descrizione":"", "codice":"", "iden":""});
	}
	catch(e){
		alert("initAndResetDiagnosiJson - Error: " + e.description);
	}
}


function resetDiagnosiField(){
	try{
		$("#ricICD_DIAGNOSI_CODICE").val("");
		$("#ricICD_DIAGNOSI").val("");
		$("#COD_DIAGNOSI").val("");
		$("#DIAGNOSI").val("");		
	}
	catch(e){
		alert("initAndResetDiagnosiJson - Error: " + e.description);
	}
}
function bindAutoCompleteToDiagnAtt(id){
	try{
		$("#" + id).autocomplete({
			width: 300,
			max: 10,
			delay: 100,
			minLength: 4,
			scroll: true,
			highlight: false,
			
			source: function(request, response) {
				var term = request.term;
				if ( term in icdCache ) {
				  response( icdCache[ term ] );
				  return;
				}
				$.ajax({
					url: "/" + window.location.pathname.split("/")[1] +"/getDataStore",
					dataType: "json",
					data: {
						// modifica aldo 17/12/14
					 term : ($("#chkInsideDesc").is(':checked')?'%' + request.term:request.term),
/*						 tipoRicerca : "diagnosi_attuali",
					 pool : "elcoPool_whale",
					 catalogo : "dati", */
					 xmlStatementFile: "diagnosi_icd9.xml",
					 statementName: "getDiagnosiICD9ByDescr",						 
					 jsonCampi: JSON.stringify(jsonFieldsDiagnAttuali)
					},
					success: function( data, textStatus, jqXHR) {
						icdCache[ term ] = data;
						// se non chiamo la riga sottostante
						// non prosegue il flusso di dati e non mostra nulla
						response( data );
					},
					error: function(jqXHR, textStatus, errorThrown){
						 alert("error: "+ textStatus +  "" + errorThrown);
					}
				});
			},
			select: function( event, ui ) {
				//alert(ui.item.iden + " - " + ui.item.value + " - " + ui.item.sostanza);
				var id = jQuery(this).attr("id"); // txt_DIAGNOSI_ATTUALI_1
//					jQuery(this).val(ui.item.value + " " + ui.item.codice);
				// aggiorno elemento ad array

/*					alert(idCod + "-" + ui.item.value  + "-" +  ui.item.codice  + "-" + ui.item.iden);
				alert(				jsonDiagnosiAttuale.lista.length);
				alert(idCod[idCod.length -1]-1);*/
				jsonDiagnosiAttuale.lista[0].descrizione = ui.item.value;
				jsonDiagnosiAttuale.lista[0].codice = ui.item.codice;
				jsonDiagnosiAttuale.lista[0].iden = ui.item.iden;
				$("#COD_DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].codice);
				$("#DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].descrizione);
				//DIAGNOSI.ICD_DIAGNOSI_CODICE = $("#COD_DIAGNOSI").val();
				//DIAGNOSI.ICD_DIAGNOSI_DESCR = $("#DIAGNOSI").val();
				return false;							
			}
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
		   .data( "item.autocomplete", item )
		   .append( "<a>" + item.value +" " + item.codice+ "</a>" )
		   .appendTo( ul ).attr("title","Categoria: " + item.categoria);
		};

	}
	catch(e){
		alert("bindAutoCompleteToDiagnAtt - Error: " + e.description);
	}
}


function bindAutoCompleteToDiagnCod(id){
	try{
		$("#" + id).autocomplete({
			width: 300,
			max: 10,
			delay: 100,
			minLength: 3,
			scroll: true,
			highlight: false,
			
			source: function(request, response) {
				var term = request.term;
				if ( term in icdCodCache ) {
				  response( icdCodCache[ term ] );
				  return;
				}
				$.ajax({
					url: "/" + window.location.pathname.split("/")[1] +"/getDataStore",
					dataType: "json",
					data: {
					 term : request.term,
/*						 tipoRicerca : "diagnosi_attuali",
					 pool : "elcoPool_whale",
					 catalogo : "dati", */
					 xmlStatementFile: "diagnosi_icd9.xml",
					 statementName: "getDiagnosiICD9ByCod",						 
					 jsonCampi: JSON.stringify(jsonFieldsDiagnAttuali)
					},
					success: function( data, textStatus, jqXHR) {
						icdCodCache[ term ] = data;
						// se non chiamo la riga sottostante
						// non prosegue il flusso di dati e non mostra nulla
						response( data );
					},
					error: function(jqXHR, textStatus, errorThrown){
						 alert("error: "+ textStatus +  "" + errorThrown);
					}
				});
			},
			select: function( event, ui ) {
				//alert(ui.item.iden + " - " + ui.item.value + " - " + ui.item.sostanza);
				var id = jQuery(this).attr("id"); // txt_DIAGNOSI_ATTUALI_1
//					jQuery(this).val(ui.item.value + " " + ui.item.codice);
				// aggiorno elemento ad array

/*					alert(idCod + "-" + ui.item.value  + "-" +  ui.item.codice  + "-" + ui.item.iden);
				alert(				jsonDiagnosiAttuale.lista.length);
				alert(idCod[idCod.length -1]-1);*/
				$( this ).val( ui.item.codice );
				jsonDiagnosiAttuale.lista[0].descrizione = ui.item.value;
				jsonDiagnosiAttuale.lista[0].codice = ui.item.codice;
				jsonDiagnosiAttuale.lista[0].iden = ui.item.iden;
				$("#COD_DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].codice);
				$("#DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].descrizione);
//				DIAGNOSI.ICD_DIAGNOSI_CODICE = $("#COD_DIAGNOSI").val();
	//			DIAGNOSI.ICD_DIAGNOSI_DESCR = $("#DIAGNOSI").val();				
				return false;							
			}
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
		   .data( "item.autocomplete", item )
		   .append( "<a>" + item.codice +" " + item.value+ "</a>" )
		   .appendTo( ul ).attr("title","Categoria: " + item.categoria);
		};

	}
	catch(e){
		alert("bindAutoCompleteToDiagnCod - Error: " + e.description);
	}
}



function showLoader(bolShow){
	if (bolShow){
		$("body").oLoader({
		  wholeWindow: true, //makes the loader fit the window size
		  lockOverflow: true, //disable scrollbar on body						  
		  backgroundColor: '#000',
		  fadeInTime: 1000,
		  fadeLevel: 0.4,
		  image: '../../std/jscript/jQueryOloader/images/ownageLoader/loader4.gif',
		  fadeOutTime: 1000,
		  fadeLevel: 0.8
		});
		
		
	}
	else{
		 $("body").oLoader('hide');		
	}
}