// JavaScript Document

var hnd_attesa = null; 	function apri_attesa() 	{	try{	this.hnd_attesa = window.open("../../classAttesa","wnd_attesa","left=" + (parseInt(screen.availWidth/2)-80)+ " ,top=" + (parseInt(screen.availHeight/2)-35) +",width=240,height=70,statusbar=no")			}	catch(e){alert(e.description);} 	} 	 	function chiudi_attesa() 	{	try{	if (this.hnd_attesa)	{	this.hnd_attesa.close();	}	}	catch(e){	} 	}


var jsonModuliAttuale ;
var jsonFields = {fields: [
					 {name:"DESCRIZIONE", type: "string", mappedJSONfield:"value"},
					 {name:"IDEN", type: "int", mappedJSONfield:"iden"},
					 {name:"COD_DEC", type: "string", mappedJSONfield:"codice"}
					 ]};

(function($) {
/*
 * Function: fnGetColumnData
 * Purpose:  Return an array of table values from a particular column.
 * Returns:  array string: 1d data array
 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
 *           int:iColumn - the id of the column to extract the data from
 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
 */
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
	var oTable = $("#TAB_MODULI").dataTable();
    // check that we have a column id
    if ( typeof iColumn == "undefined" ) return new Array();
     
    // by default we only want unique data
    if ( typeof bUnique == "undefined" ) bUnique = true;
     
    // by default we do want to only look at filtered data
    if ( typeof bFiltered == "undefined" ) bFiltered = true;
     
    // by default we do not want to include empty values
    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
     
    // list of rows which we're going to loop through
    var aiRows;
     
    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
    // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers
 
    // set up data array   
    var asResultData = new Array();

    for (var i=0,c=aiRows.length; i<c; i++) {
        iRow = aiRows[i];
//        var aData = this.fnGetData(iRow);
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];
        // ignore empty values?
//		if (typeof(sValue)!="undefined"){
			try{
				if (typeof(sValue) != "undefined"){
					if (bIgnoreEmpty == true && sValue.toString==""){ 
						continue; 
					}
					// ignore unique values?
					else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1){
						continue;
					}
					// else push the value onto the result data array
					else{
						asResultData.push(sValue);
					}
				}
			}catch(e){alert("##" + e.description +"##");}
//		}
    }
//	alert("#" + asResultData +"#");
    return asResultData;
}}(jQuery));
 
 
function fnCreateSelect( aData, indiceColonna )
{
	var strOutput= "";
	try{
		var r='<select id="comboFiltro_' + indiceColonna+'"><option value=""></option>', i, iLen=aData.length;
//		var r='<select id="comboFiltro_' + indiceColonna+'">', i, iLen=aData.length;
		for ( i=0 ; i<iLen ; i++ )
		{
			r += '<option value="'+aData[i]+'">'+aData[i]+'</option>';
		}
		strOutput = r+'</select>';

	}
	catch(e){
		alert("fnCreateSelect - Error: " + e.description);
	}
    return strOutput;
}
// *******************************
jQuery.ajaxSetup({
  beforeSend: function() {
     $('#loader').show();
  },
  complete: function(){
     $('#loader').hide();
  },
  success: function() {}
});
// *******************************

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



function initAndResetModuliJson(value){
	try{
		jsonModuliAttuale = {"listaEsami":[],"idenSala":"","descrSala":"","codCdc":"","descrCdc":"","modulo":""};
		// pulire
		if (value=="ALL"){
			$('#ricESAME').empty();
		}
		else{
		}
//		jsonModuliAttuale.listaEsami.push({"descrizione":"", "codice":"", "iden":""});
	}
	catch(e){
		alert("initAndResetDiagnosiJson - Error: " + e.description);
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
		var strOggi = "";
		$('div[id^="multiAccordion"]').each(function(i) {
				jQuery(this).multiAccordion({active: [0] });
		});
		initAndResetModuliJson('ALL');
		bindAutoCompleteExam('ricESAME');
		bindAutoCompleteCdc('ricCDC');
		loadComboFormat();
		//loadFormatInUse();
		$("#btCreaFormat").button();
		
		initDataTable();

	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
}

function resetField(value){
	try{
		switch (value){
			case "ESAME":
				$('#ricESAME').html("");
				jsonModuliAttuale.listaEsami = [];
				$('#selESAME').empty();
				break;
			case "CDC":
				$('#ricCDC').html("");			
				jsonModuliAttuale.codCdc = "";
				jsonModuliAttuale.descrCdc = "";
				$("#lblCDC").html("");
				break;
			case "SALA":
				jsonModuliAttuale.idenSala = "";
				jsonModuliAttuale.descrSala = "";		
				$("#ricSALA option:first").attr('selected','selected');
				$("#lblSALA").html("");				
				break;
			case "MODULO":
				jsonModuliAttuale.modulo = "";
				$("#ricMODULO option:first").attr('selected','selected');
				$("#lblMODULO").html("");
				break;				
			default:
				break;
		}
		
	}
	catch(e){
		alert("resetField - Error:  "+ e.description);
	}		
}

var examCache = {};
var cdcCache = {};
var saleCache = {};

// ************** ESAMI ************
function bindAutoCompleteExam(id){
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
				if ( term in examCache ) {
				  response( examCache[ term ] );
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
					 xmlStatementFile: "gestione_format.xml",
					 statementName: "getEsaByDescr",						 
					 jsonCampi: JSON.stringify(jsonFields)
					},
					success: function( data, textStatus, jqXHR) {
						examCache[ term ] = data;
						// se non chiamo la riga sottostante
						// non prosegue il flusso di dati e non mostra nulla
						//try{alert(data.length);}catch(e){;}
						response( data );
						$("#" + id).focus();
					},
					error: function(jqXHR, textStatus, errorThrown){
						 alert("error: "+ textStatus +  "" + errorThrown);
					}
				});
			},
			select: function( event, ui ) {
				var id = jQuery(this).attr("id");
				try{
					jsonModuliAttuale.listaEsami.push({"descrizione":ui.item.value, "codice":ui.item.codice, "iden":ui.item.iden});
				}
				catch(e){
					alert(e.description);
				}
				$('#selESAME').append($('<option>', { 
					value: ui.item.iden,
					text : ui.item.value ,
					title : ui.item.value + " - " + ui.item.codice
				}));
				return false;							
			}
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
		   .data( "item.autocomplete", item )
		   .append( "<a>" + item.value +" " + item.codice+ "</a>" )
		   .appendTo( ul );//.attr("title","Categoria: " + item.categoria);
		};

	}
	catch(e){
		alert("bindAutoCompleteExam - Error: " + e.description);
	}
}



// ************** CDC ************
function bindAutoCompleteCdc(id){
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
				if ( term in cdcCache ) {
				  response( cdcCache[ term ] );
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
					 xmlStatementFile: "gestione_format.xml",
					 statementName: "getCdcByDescr",						 
					 jsonCampi: JSON.stringify(jsonFields)
					},
					success: function( data, textStatus, jqXHR) {
						cdcCache[ term ] = data;
						// se non chiamo la riga sottostante
						// non prosegue il flusso di dati e non mostra nulla
						//try{alert(data.length);}catch(e){;}
						response( data );
						$("#" + id).focus();
					},
					error: function(jqXHR, textStatus, errorThrown){
						 alert("error: "+ textStatus +  "" + errorThrown);
					}
				});
			},
			select: function( event, ui ) {
				var id = jQuery(this).attr("id");
				try{
					jsonModuliAttuale.codCdc = ui.item.codice;
					jsonModuliAttuale.descrCdc = ui.item.value;
					// carico combo sala !!!
					loadComboSale(jsonModuliAttuale.codCdc);
				}
				catch(e){
					alert(e.description);
				}
				$('#lblCDC').html(ui.item.value + " - " + ui.item.codice);
				return false;							
			}
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
		   .data( "item.autocomplete", item )
		   .append( "<a>" + item.value +" " + item.codice+ "</a>" )
		   .appendTo( ul );//.attr("title","Categoria: " + item.categoria);
		};

	}
	catch(e){
		alert("bindAutoCompleteCdc - Error: " + e.description);
	}
}




// ************** SALE ************
/*
function bindAutoCompleteSala(id){
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
				if ( term in cdcCache ) {
				  response( cdcCache[ term ] );
				  return;
				}
				$.ajax({
					url: "/" + window.location.pathname.split("/")[1] +"/getDataStore",
					dataType: "json",
					data: {
					 term : request.term,

					 xmlStatementFile: "gestione_format.xml",
					 statementName: function(){
						 var strStmName = "";
						 //alert("here");
						 // controllo se non ha selezionato il cdc
						 if (jsonModuliAttuale.codCdc!=""){
							 strStmName = "getSalaByDescrFilteredByCdc";
						 }
						 else{strStmName = "getSalaByDescr";}
						 alert(strStmName);
						 return strStmName;
					 },						 
					 jsonCampi: JSON.stringify(jsonFields)
					},
					success: function( data, textStatus, jqXHR) {
						cdcCache[ term ] = data;
						// se non chiamo la riga sottostante
						// non prosegue il flusso di dati e non mostra nulla
						//try{alert(data.length);}catch(e){;}
						response( data );
						$("#" + id).focus();
					},
					error: function(jqXHR, textStatus, errorThrown){
						 alert("error: "+ textStatus +  "" + errorThrown);
					}
				});
			},
			select: function( event, ui ) {
				var id = jQuery(this).attr("id");
				try{
					jsonModuliAttuale.idenSala = ui.item.codice;
					jsonModuliAttuale.descrSala = ui.item.value;
				}
				catch(e){
					alert(e.description);
				}
				$('#lblSALA').html(ui.item.value + " - " + ui.item.codice);
				return false;							
			}
		}).data( "autocomplete" )._renderItem = function( ul, item ) {
			return $( "<li>" )
		   .data( "item.autocomplete", item )
		   .append( "<a>" + item.value +" " + item.codice+ "</a>" )
		   .appendTo( ul );//.attr("title","Categoria: " + item.categoria);
		};

	}
	catch(e){
		alert("bindAutoCompleteSala - Error: " + e.description);
	}
}
*/

function updateJsonSala(oggetto){
	try{
		jsonModuliAttuale.idenSala = getValue(oggetto.id);
		jsonModuliAttuale.descrSala = getText(oggetto.id);
		$('#lblSALA').html(jsonModuliAttuale.descrSala + " - " + jsonModuliAttuale.idenSala);
	}
	catch(e){
		alert("updateJsonSala - Error: " + e.description);
	}	
}


function updateJsonModulo(oggetto){
	try{
		jsonModuliAttuale.modulo = getValue(oggetto.id);
		$('#lblMODULO').html(jsonModuliAttuale.modulo);
	}
	catch(e){
		alert("updateJsonModulo - Error: " + e.description);
	}		
}


function loadComboFormat(){
	
//function fill_selectFromResultSet (rs,elemId, chiave, valore, numCaratteri, suffixString, cod_decValue){
	try{
		try{
			var rs = getHomeFrame().executeQuery('gestione_format.xml','getAllFormat',[]);
			fill_selectFromResultSetWithBlankOption(rs,"ricMODULO", "MODULO", "MODULO", -1);			
		}catch(e){alert("Errore: getAllFormat");}
	}
	catch(e){
		alert("loadComboFormat - Error: " + e.description);
	}		
}

function loadComboSale(cdc){
	try{
		try{
			if (cdc == "") {return;}
			// filtro per jsonModuliAttuale.codCdc 
			$('#ricSALA').empty();			
			var rs = getHomeFrame().executeQuery('gestione_format.xml','getSalaByDescrFilteredByCdc',[cdc]);
			fill_selectFromResultSetWithBlankOption(rs,"ricSALA", "iden", "descrizione", -1);			
		}catch(e){alert("Errore: getSalaByDescrFilteredByCdc");}
	}
	catch(e){
		alert("loadComboSale - Error: " + e.description);
	}		
}

function loadFormatInUse(){
	try{
		var strDescr = "";
		$('#formatSaved').empty();	
		var rs = getHomeFrame().executeQuery('gestione_format.xml','getFormatInUse',[]);
		while (rs.next()){
			strDescr = rs.getString("descr_esa") +"#" + rs.getString("descr_cdc") +"#" + rs.getString("descr_sal") + "#" + rs.getString("modulo"); 
			add_elem("formatSaved", strDescr, strDescr,"","");		
		}
	}
	catch(e){
		alert("loadFormatInUse - Error: " + e.description);
	}
	
}


function chiudi(value){

	document.location.replace("about:blank");
//	parent.jQuery.fancybox.close();						
}

function validate(){
	var strOutput = "";
	// controllo  	jsonModuliAttuale
	try{
		if (jsonModuliAttuale.listaEsami.length==0){
			strOutput = "Requisito minimo: almeno un esame selezionato.\n";
		}
		if (jsonModuliAttuale.modulo==""){
			strOutput += "Selezionare un format / modulo.\n";
		}		
		if (strOutput==""){
			strOutput = "OK";
		}
	}
	catch(e){
		alert("validate - error: "+ e.description);
		strOutput = e.description;
	}
	finally{
		return strOutput ;
	}
}

function registra(){
	try{
		var strError = "";
		var rs ;
		var strPrevModulo = "";
		var stm;
		
		strError = validate();
		if (strError!="OK"){
			alert(strError); 
			return;
		}
		for (var k=0;k<jsonModuliAttuale.listaEsami.length;k++){
			// controllare che per la terna
			// non ci sia già il valore
//			var out =  getHomeFrame().executeStatement('gestione_format.xml','getExistedFormat_by_IdenEsa',[jsonModuliAttuale.listaEsami[k].iden, jsonModuliAttuale.codCdc, jsonModuliAttuale.idenSala],1);
			if (jsonModuliAttuale.codCdc=="" && jsonModuliAttuale.idenSala==""){
//				alert("getExistedFormat_by_Esa " + jsonModuliAttuale.listaEsami[k].iden);
				rs = getHomeFrame().executeQuery('gestione_format.xml','getExistedFormat_by_Esa',[jsonModuliAttuale.listaEsami[k].iden]);			
			}
			else if (jsonModuliAttuale.codCdc!="" && jsonModuliAttuale.idenSala==""){
//				alert("getExistedFormat_by_Esa_Cdc " + jsonModuliAttuale.listaEsami[k].iden +", " + jsonModuliAttuale.codCdc);				
				rs = getHomeFrame().executeQuery('gestione_format.xml','getExistedFormat_by_Esa_Cdc',[jsonModuliAttuale.listaEsami[k].iden, jsonModuliAttuale.codCdc]);			
			}
			else if (jsonModuliAttuale.codCdc!="" && jsonModuliAttuale.idenSala!=""){
///				alert("getExistedFormat_by_Esa_Cdc_Sala " + jsonModuliAttuale.listaEsami[k].iden +", " + jsonModuliAttuale.codCdc + ", " + jsonModuliAttuale.idenSala );								
				rs = getHomeFrame().executeQuery('gestione_format.xml','getExistedFormat_by_Esa_Cdc_Sala',[jsonModuliAttuale.listaEsami[k].iden, jsonModuliAttuale.codCdc, jsonModuliAttuale.idenSala]);			
			}			
			if (rs.next()) {
				alert ("Esiste già il format / modulo: " + rs.getString("modulo") + " per la combinazione Esame: " + jsonModuliAttuale.listaEsami[k].descrizione +", Cdc: "+ jsonModuliAttuale.descrCdc +", Sala:" + jsonModuliAttuale.descrSala +" selezionata");
				return;
			}
//			alert(JSON.stringify(jsonModuliAttuale));
			stm = getHomeFrame().executeStatement('gestione_format.xml','creaAssocizioneFormat',[jsonModuliAttuale.listaEsami[k].iden, jsonModuliAttuale.codCdc, jsonModuliAttuale.idenSala, jsonModuliAttuale.modulo],0);
			if (stm[0]!="OK"){
				alert("Errore: problemi nella salvataggio\n" + stm[1] );
				return;
			}
			else{ 
				stm = getHomeFrame().executeStatement('gestione_format.xml','updateXslOnFormat',[jsonModuliAttuale.modulo],0);			
				if (stm[0]!="OK"){
					alert("Errore: problemi nella salvataggio xsl\n" + stm[1] );
					return;
				}			
				else{
					alert("Registrazione effettuata - Esame: " + jsonModuliAttuale.listaEsami[k].descrizione +", Unita' erog. / Cdc: "+ (jsonModuliAttuale.descrCdc==""?"[Qualunque]":jsonModuliAttuale.descrCdc) +", Sala:" + (jsonModuliAttuale.descrSala==""?"[Qualunque]":jsonModuliAttuale.descrSala) +", format / modulo: " + jsonModuliAttuale.modulo);
				}
			}
			
		}
		// finito
		// comment perchè filtro per esame inserito
		resetField("ESAME");
		resetField("CDC");
		resetField("SALA");
		resetField("MODULO");
		initDataTable();
		
		// *** valutare se serve , dopo registrazione
		// il filtro su esame/modulo appena inserito
		/*
		$('#comboFiltro_4 option[value="GENERICA"]').attr("selected", "selected"); 
		$('#comboFiltro_4').change();
		*/
		// **************
	}
	catch(e){
		alert("registra - Error: " + e.description);
	}
}


// *******************

// vedere https://datatables.net/extensions/scroller/
function initDataTable(){
	var strTmp= "";
	try{
		apri_attesa();
//		$('#formatTable').oLoader();  			
//		$('#TAB_MODULI').dataTable().fnDestroy();

		
		oTable = $('#TAB_MODULI').on( 'draw.dt', function () {
				$('#formatTable').oLoader('hide');
			}).on( 'processing.dt', function ( e, settings, processing ) {
				$('#formatTable').oLoader();
			}).dataTable({
			"bPaginate": false,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,
			"bAutoWidth": false,
 		 	"sScrollY": "300px",
 		 	"scrollY": "200px",
			"scrollX": false,
			"dom": "frtiS",
	        "deferRender": true,			

	        //"bScrollCollapse": true,	// parametro che fa collassare layout (altezza) se ci sono "pochi record"
			"aoColumns": [
			{ "sWidth": "5%" , "bSearchable": false}, // 0th column width 							  
			{ "sWidth": "5%" , "bSearchable": false}, // 1st column width 							  			
			{ "sWidth": "30%" , "bSearchable": true}, // 2st column width 
			{ "sWidth": "30%" , "bSearchable": true}, // 3rd column width 
			{ "sWidth": "25%" , "bSearchable": true }, // 4th column width 
			{ "sWidth": "5%" , "bSearchable": false} // 5th column width 
			
			],				
			"bJQueryUI": false,
			'bRetrieve': true,
			"oLanguage": {
					"sZeroRecords": "Nessun elemento"
				}
			});
		try{		$('#TAB_MODULI').dataTable().fnClearTable();		}catch(e){;}

		// decommentare 
		// mettere contatore a video per capire che fa !!
 		try{rs = getHomeFrame().executeQuery('gestione_format.xml','getNumOfFormatInUse',[]);}catch(e){alert("Errore: getNumOfFormatInUse");}		
		if (rs.next()){
			$("#lblTotFormat").html(rs.getString("numero_moduli"));
		}
		
 		try{rs = getHomeFrame().executeQuery('gestione_format.xml','getFormatInUse',[]);}catch(e){alert("Errore: getFormatInUse");}		
		var spanDelFormat = "";
		var counter = 0;
		while (rs.next()){
				spanDelFormat = "<span title=\"Cancella associazione format\" onclick=\"javascript:deleteFormat('" + rs.getString("IDEN_ESA")+"','" + rs.getString("COD_CDC") + "','" + rs.getString("IDEN_SAL") +"','"+ rs.getString("MODULO") + "');\"class=\"deleteFormat\">&nbsp;</span>";
				// aggiunto false come secondo parametro e 
				// chiamato successivamente fnDraw
				oTable.fnAddData( ["<span title=\"Anteprima modulo\" onclick=\"javascript:openFormatPreview('" + rs.getString("modulo") +"');\" class=\"previewFormat\">&nbsp;</span>",spanDelFormat, rs.getString("descr_esa") ,rs.getString("descr_cdc"),rs.getString("descr_sal"), rs.getString("modulo")], false);
				counter++;
				$("#lblIesimoFormat").html(counter);				
		}
		// aggiunto fnDraw
		oTable.fnDraw();
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );	
		setTimeout(function (){oTable.fnSort( [ [5,'asc'] ] );},1000);
		$("#TAB_MODULI tr").hover(function()
		{
			$(this).children("td").removeClass("normal").addClass("highlight");
		},
		function()
		{
			$(this).children("td").removeClass("highlight").addClass("normal");
		});		
						
				
		/* Lasciare per ultimo: costruisce i filtri */
		
		$("tfoot th[id^='colCombo']").each( function ( i ) {
			var strHtml = "";
//				var indiceColonna = $(this).attr("id").split("_")[1];
			var indiceColonna = $(this).index();
//				if (indiceColonna!=0){
				strHtml = fnCreateSelect( oTable.fnGetColumnData(indiceColonna) , indiceColonna);
				this.innerHTML =  strHtml ;
				$('select', this).change( function () {
					try{
						var valore = $(this).val();
						// resetto filtri pre esistenti
						$('#TAB_MODULI').dataTable().fnFilter( "" );
						$('#TAB_MODULI').dataTable().fnFilter( valore, indiceColonna );							
					}catch(e){alert(e.description);}
				} );
			//}
		} );	
		// ordinamento elementi 
		$("select[id^='comboFiltro_']").each( function ( i ) {
			var id = $(this).attr("id");
			$(this).html($('#' + id +' option').sort(function(x, y) {
				return $(x).text() < $(y).text() ? -1 : 1;
			}))
			$("#"+ id).get(0).selectedIndex = 0;
		});		
			
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}	
	finally{
		try{
			//$('#formatTable').oLoader('hide');
			chiudi_attesa();
		}
		catch(e){;}
	}
}

function deleteFormat(iden_esa, cod_cdc, iden_sal, modulo){
	try{
		alert(iden_esa +","+ cod_cdc+","+ iden_sal+","+ modulo);
		if (!confirm("Cancellare associazione relativa al format " + modulo + "?")){
			return;
		}
		if (iden_esa=="" || modulo ==""){
			alert("Errore: Impossibile cancellare. Id esame o modulo nullo.");
			return;
		}

		stm = getHomeFrame().executeStatement('gestione_format.xml','deleteAssocizioneFormat',[iden_esa, cod_cdc, iden_sal, modulo],0);
		if (stm[0]!="OK"){
			alert("Errore: problemi nella cancellazione\n" + stm[1] );
			return;
		}
		else{ 
			// ok
			alert("Associazione cancellata");
			initDataTable();
		}
			
	}
	catch(e){
		alert("deleteFormat - Error: " + e.description);
	}		
}

function openFormatPreview(modulo){
	try{
		var urlToOpen = "";
		var bolExistScreenshot = true;
		
		if ((typeof (modulo) =="undefined") || (modulo=="") || (modulo =="undefined")){return;} 
		// ../../../moduloConsole/screenshot/
		urlToOpen = top.home.getReturnHomepage() + "moduloConsole/screenshot/" + modulo + ".jpg";
		// controllo esista screenshot
		$.ajax(
		  {
			  type: "get",
			  url: urlToOpen,
			  cache: false,
			  statusCode: {
					404: function ()
					   {
						  bolExistScreenshot = false;
					   }
				   },
			  async: false
		  });		
		if (!bolExistScreenshot){
			alert("Non esiste alcuno screenshot relativo al format / modulo: " + modulo);
			return;
		}

		
		top.loadInFancybox({'url':urlToOpen,'onClosed':function(){
		 //document.location.replace(document.location);
		 },showCloseButton:true, enableEscapeButton:true});	
	}
	catch(e){
		alert("openFormatPreview - Error: " + e.description);
	}
}

function resetFilter(id){
	try{

		$("select[id^='comboFiltro_']  option:first-child").each( function ( i ) {		
			$(this).attr("selected", "selected");
		 });
		

		
		var oTable = $("#" + id).dataTable();
		var oSettings = oTable.fnSettings();
		for(iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
			oSettings.aoPreSearchCols[ iCol ].sSearch = '';
		}
		oSettings.oPreviousSearch.sSearch = '';
		oTable.fnDraw();
		
		
	}
	catch(e){
		alert("resetFilter - Error: " + e.description);
	}
}


