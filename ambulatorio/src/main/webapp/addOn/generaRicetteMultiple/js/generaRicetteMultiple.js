
// **************************************
// ********* LOG ************************
var globalLogFileObject = new ElcoJsLogFileObject();
var logFileName = "generaRicette.log";
// valore massimo di log, espresso in byte
// setto 2 megabyte
var logFileLimitSize = "2097152";
// *********************************


// **************
// costanti
// **************
var constCategoria = "SSN";
var constApplicativo = "AMB";
var constDema = "D";

// definire valori default quesito e priorita in ges_config_page
var constDefaultQuesito = "Richiesta ambulatoriale";
var constDefaultPriorita = "P";
var constDefaultPrimoAcc = "N";
// lista tab_esa.codEsa esami tipo prelevabilli, rich.radiologica
// che DEVONO avere iden testata richiesta
// ATTENZIONE da rivedere!!
var listaCodEsamiConRichiesta = ["PRELIEVO","PRELIEVO_EMATICO","RICHIESTA_RADIOLOGICA"];
//$.inArray(myTest , listaEsamiConRichiesta)>-1;

// JavaScript Document

//var jsonEsame = {"IDEN":"", "NUM_PRE":"", "PAZIENTE":"", "ESA_DESCR":"", "DESCR_SALA":"", "REPARTO":"","COD1":"","COD2":"","LEA_CLASSE_PRIORITA":"","ID1":"","ANONIMATO":"","COD_ESENZIONE":"", "QUESITO":"", "TIPO_RICETTA":"","LEA_PRESTAZIONI_PRIMO_ACC":""};
var listaEsami = [];


// JavaScript Document
// ******************
(function($) {
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
	var oTable = $("#TAB_ESAMI").dataTable();
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
 
 
function fnCreateSelect( aData )
{
	var strOutput= "";
	try{
		var r='<select><option value=""></option>', i, iLen=aData.length;
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

// *******************
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
		if (params.get("sorgente")=="worklist"){
			objHomeFrame = parent.top;
		}
		else if (params.get("sorgente")=="console"){
			objHomeFrame = parent.top.opener.parent.top;
		}
		else if (params.get("sorgente")=="MIOA"){
			objHomeFrame = parent.parent.top.opener.parent.top;
		}		
		else{
			// TBD
			objHomeFrame = parent;
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}

function init(){
	try{
		params = getParams();
		$.datepicker.setDefaults(
				  $.extend(
					{'dateFormat':'dd/mm/yyyy'},
					$.datepicker.regional['it']
				  )
				);	
		$( "#DALLA_DATA").datepicker();			
		$( "#ALLA_DATA").datepicker();		
		var strDomani = "";
	
		strDomani = strDomani.getNextBusinessDay();
		$( "#DALLA_DATA").val(strDomani.toItalianDateFormat());
		$( "#ALLA_DATA").val(strDomani.toItalianDateFormat());
		
		if (params.get("sorgente")=="MIOA" ){
			$("#lblInfoCdc").html(parent.parent.baseUser.LISTAREPARTI.toString());			
		}
		else{
			$("#lblInfoCdc").html(top.baseUser.LISTAREPARTI.toString());
		}
		initDataTable();
		
		// parte nuova, gestione chiamaa esterna da console
//		ricerca()
// se arriva idenAnag devo mostrare info paziente
// in label lblInfoDate
// settare date DALLA_DATA, ALLA_DATA
		if (params.get("sorgente")=="MIOA" && params.get("idenAnag")!=""){
			// chiamata da console
			$("#lblInfoDate").text("Prenotazioni del paziente: " + parent.parent.j$("#lblDescrizionePaziente").text());
			$( "#DALLA_DATA").val((new String("")).getTodayDateFormat());
			$( "#ALLA_DATA").val("01/01/2060");			
			
			$("#tableDates").hide();
			$("#chiudi").parent().parent().remove();
			
//			fillDataTable();
		}

	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
	finally{
		/*
		try{
			$("#infoImpegnativa").html(strInfoDemaNoNumimp);
		}catch(e){;}
		*/
	}
}

function highlightCheckCell(idCheck, triggeredBy){
	try{
//		alert($(triggeredBy).get(0).tagName);
		if($("#" + idCheck).attr('checked')){
			$("#" + idCheck).parent().addClass("selectedChk");
		}
		else{
			$("#" + idCheck).parent().removeClass("selectedChk");
		}
	}
	catch(e){
		alert("highlightCheckCell - Error:  "+ e.description);
	}
}

function ricerca(){
	try{
		if (params.get("sorgente")=="MIOA" && params.get("idenAnag")!=""){
			// non faccio nulla o risetto
			// ******
			scriviLog("Ricerca Prenotazioni del paziente: " + parent.parent.j$("#lblDescrizionePaziente").text());
			// ******			
			$("#lblInfoDate").text("Prenotazioni del paziente: " + parent.parent.j$("#lblDescrizionePaziente").text());			
		}
		else{
			// ******
			scriviLog("Ricerca dal " + $( "#DALLA_DATA").val() + " al " + $( "#ALLA_DATA").val());
			// ******			
			$("#lblInfoDate").html("dal " + $( "#DALLA_DATA").val() + " al " + $( "#ALLA_DATA").val());
		}
		
		
		fillDataTable();
	}
	catch(e){
		alert("ricerca - Error:  "+ e.description);
	}
}

function initDataTable(){
	try{
		if (params.get("sorgente")=="MIOA" ){
			oTable = $('#TAB_ESAMI').dataTable({
				"bPaginate": false,
				"bLengthChange": true,
				"bFilter": true,
				"bSort": true,
				"bInfo": false,
				"bAutoWidth": false,
				"sScrollY": "400px",
//				"sScrollY": ($(window).height() - 200),				
				"bScrollCollapse": true,
				"bJQueryUI": false,
				'bRetrieve': true,
				"aoColumns": [
					{ "sWidth": "1%" }, 						  
					{ "sWidth": "2%" },
					{ "sWidth": "3%" },	
					{ "sWidth": "3%" },				
					{ "sWidth": "20%" },	//paziente
					null,
					{ "sWidth": "5%" }, // data esame		
					{ "sWidth": "20%" }, // quesito
					{ "sWidth": "5%" }, //esenzione
					{ "sWidth": "6%" },
					{ "sWidth": "6%" },
					{ "sWidth": "15%" }
				],				
				"oLanguage": {
						"sZeroRecords": "Nessun elemento"
					},
				"fnDrawCallback": function() {
					$('#TAB_ESAMI').dataTable()._fnScrollDraw();        
					$('#TAB_ESAMI').closest(".dataTables_scrollBody").height(200);
			   }  			
			});
		}
		else{
		
			oTable = $('#TAB_ESAMI').dataTable({
				"bPaginate": false,
				"bLengthChange": true,
				"bFilter": true,
				"bSort": true,
				"bInfo": false,
				"bAutoWidth": false,
				"sScrollY": "400px",
				//"sScrollY": ($(window).height() - 200),
				"bScrollCollapse": true,
				"aoColumns": [
				{ "sWidth": "1%" }, 						  
				{ "sWidth": "2%" },
				{ "sWidth": "3%" },	
				{ "sWidth": "3%" },				
				{ "sWidth": "20%" },	//paziente
				null,
				{ "sWidth": "5%" }, // data esame		
				{ "sWidth": "20%" }, // quesito
				{ "sWidth": "5%" }, //esenzione
				{ "sWidth": "6%" },
				{ "sWidth": "6%" },
				{ "sWidth": "15%" }
				],				
				"bJQueryUI": false,
				'bRetrieve': true,
				"oLanguage": {
						"sZeroRecords": "Nessun elemento"
					},
				"fnDrawCallback": function( oSettings ) {
			//      alert( 'DataTables has redrawn the table' );
					$('#TAB_ESAMI').dataTable()._fnScrollDraw();        
					$('#TAB_ESAMI').closest(".dataTables_scrollBody").height(200);			
				}				
			});
		}
		

		
	}
	catch(e){
		alert("initDataTable " +e.description);
	}
}

function fillDataTable(){
	var strTmp= "";
	var indice = 1;
	var rs;
	try{
		showLoader(true);
		$('#TAB_ESAMI').dataTable().fnClearTable();
		var strDallaData = $( "#DALLA_DATA").val().dateToStringFormat();
		var strAllaData = $( "#ALLA_DATA").val().dateToStringFormat();
		var strCdc = "";
		if (params.get("sorgente")=="MIOA" ){
			strCdc = getHomeFrame().baseUser.LISTAREPARTI.toString();
		}
		else{
			strCdc = top.baseUser.LISTAREPARTI.toString();
		}
		var chkCiclo = "", chkEsaSel = "", comboEsenzioni = "", leaPriorita = "", placeHolderEsito="", infoIcon = "";		
		var comboPriorita="", comboPrimoAccesso="", comboCategoria="";

		var oggetto;
		var rsQuesito;
//		alert(strDallaData +", "+ strAllaData +", " + strCdc + ","+params.get("idenAnag"));
//		return;
		// devo filtrare anche per paziente se provengo da console!!!

//alert("fillDataTable");

		if (params.get("sorgente")=="MIOA" && params.get("idenAnag")!=""){
	 		try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getEsaPerRicette_x_IdenAnag',[strDallaData,strAllaData,strCdc, params.get("idenAnag")]);}catch(e){alert("Errore: getEsaPerRicette_x_IdenAnag " );return;}							
		}
		else{
	 		try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getEsaPerRicette',[strDallaData,strAllaData,strCdc]);}catch(e){alert("Errore: getEsaPerRicette " );return;}				
		}
		

		var strQuesito = "", strLEA_CLASSE_PRIORITA="", strCodEsa="", strLEA_PRESTAZIONI_PRIMO_ACC="";
		try{
			listaEsami = [];	
			var bolIncludi = false;
			while (rs.next()){
				bolIncludi = false;
				strQuesito = rs.getString("QUESITO");
				strCodEsa = rs.getString("COD_ESA") ;
				/*
				if ($.inArray(strCodEsa , listaCodEsamiConRichiesta)>-1 && rs.getString("IDEN_TESTATA_RICH")!=""){
					bolIncludi = true;
				}
				else{
					if ($.inArray(strCodEsa , listaCodEsamiConRichiesta)==-1){
						bolIncludi = true;
					}
				}*/
				// attenzione verificare se far vedere sempre tutti !
				bolIncludi = true;
				if (bolIncludi){
					strLEA_CLASSE_PRIORITA = rs.getString("LEA_CLASSE_PRIORITA")==""?constDefaultPriorita:rs.getString("LEA_CLASSE_PRIORITA");
					strLEA_PRESTAZIONI_PRIMO_ACC = rs.getString("LEA_PRESTAZIONI_PRIMO_ACC")==""?constDefaultPrimoAcc:rs.getString("LEA_PRESTAZIONI_PRIMO_ACC");
//					alert(strLEA_PRESTAZIONI_PRIMO_ACC + " " + rs.getString("LEA_PRESTAZIONI_PRIMO_ACC") +"#");
					if (strQuesito==""){
						// recupero QUESITO: recuperare, se presente, l'ultimo quesito inserito per quel paziente-ambulatorio
						try{rsQuesito = getHomeFrame().executeQuery('multi_ricette.xml','getLastQuesito',[rs.getString("IDEN_ANAG"),rs.getString("REPARTO")]);}catch(e){alert("Errore: getLastQuesito" );return;}						
						if (rsQuesito.next()){
							strQuesito = rsQuesito.getString("QUESITO");
						}
						else{
							strQuesito = constDefaultQuesito;
						}
					}
					oggetto = {"IDEN":rs.getString("IDEN"),
									"NUM_PRE":rs.getString("NUM_PRE"),
									"PAZIENTE":rs.getString("PAZIENTE"),
									"ESA_DESCR":rs.getString("ESA_DESCR"),
									"DAT_ESA":rs.getString("DAT_ESA"),
									"DESCR_SALA":rs.getString("DESCR_SALA"),
									"REPARTO":rs.getString("REPARTO"),
									"COD1":rs.getString("COD1"),
									"COD2":rs.getString("COD2"),
									"LEA_CLASSE_PRIORITA":strLEA_CLASSE_PRIORITA,
									"ID1":rs.getString("ID1"),
									"ANONIMATO":rs.getString("ANONIMATO"),
									"COD_ESENZIONE":"",
									"QUESITO":rs.getString("QUESITO"),
									"TIPO_RICETTA":rs.getString("TIPO_RICETTA"),
									"IDEN_ANAG":rs.getString("IDEN_ANAG"),
									"LEA_PRESTAZIONI_PRIMO_ACC":strLEA_PRESTAZIONI_PRIMO_ACC,
									"IDEN_ANAG_WHALE":"",
									"IDEN_TESTATA_RICH":rs.getString("IDEN_TESTATA_RICH"),
									"CODICE_VIEW_RR_PRETAZIONI":"",
									"QUESITO": strQuesito,
									"COD_ESA": strCodEsa
									};
					// lascio per ora un controllo
					// da valutare se saranno sempre tutte di default selezionate
					leaPriorita = rs.getString("LEA_CLASSE_PRIORITA")==""?"N":rs.getString("LEA_CLASSE_PRIORITA");
					if (oggetto.QUESITO == "" || oggetto.LEA_CLASSE_PRIORITA == ""){
						chkEsaSel = "&nbsp;";		
						comboEsenzioni = "&nbsp;";		 
					}
					else{
						chkEsaSel = "<input type='checkbox' checked = 'checked'  id='chkEsaSel_" +rs.getString("iden") + "_"+ rs.getString("num_pre") + "_"+  leaPriorita+ "'  onclick='javascript:highLightRow(this)' /><label for='chkEsaSel_" +rs.getString("iden") + "'>&nbsp;</label>";	
						comboEsenzioni = getEsenzioniPaziente(rs.getString("IDEN_ANAG"),rs.getString("ID1"),rs.getString("IDEN"),oggetto );					
					}
					// modifica 21-1-16
					
					comboPriorita = getPrioritaEsame(rs.getString("IDEN"),oggetto.LEA_CLASSE_PRIORITA);
					comboPrimoAccesso = getPrimoAccessoEsame(rs.getString("IDEN"),oggetto.LEA_PRESTAZIONI_PRIMO_ACC);
					comboCategoria = getCategoria(rs.getString("IDEN"));
					listaEsami.push(oggetto);
					//***************************				
					if (oggetto.IDEN_TESTATA_RICH!="" && oggetto.IDEN_TESTATA_RICH!="undefined" && typeof(oggetto.IDEN_TESTATA_RICH)!="undefined"){
						infoIcon = "<SPAN class='infoDettIcon' title='Dettaglio richiesta' onclick='javascript:openDettRichiesta(" + oggetto.IDEN_TESTATA_RICH+ ");'>&nbsp;</SPAN>"
					}
					else{
						infoIcon  = "";
					}
		//			oTable.fnAddData( [indice, chkEsaSel,rs.getString("paziente"),"<a href='#' onclick='javascript:modificaEsame("+ rs.getString("iden") +","+rs.getString("iden_anag")+");return false;'>" + rs.getString("esa_descr") +"</a>",rs.getString("num_pre"),rs.getString("LEA_CLASSE_PRIORITA"),rs.getString("descr_sala"),rs.getString("reparto")], false);		
					placeHolderEsito="<span id='plcHolder_" +rs.getString("iden")  +"'></span>";
					//oTable.fnAddData( [indice,placeHolderEsito, chkEsaSel,infoIcon,oggetto.PAZIENTE,"<a href='#' onclick='javascript:modificaEsame("+ oggetto.IDEN +","+oggetto.IDEN_ANAG+");return false;'>" + oggetto.ESA_DESCR +"</a>",oggetto.DAT_ESA,"<textarea id='QUESITO_" + oggetto.IDEN + "' style='margin-left:3px;margin-right:3px;'>" +oggetto.QUESITO +"</textarea>",comboEsenzioni,oggetto.LEA_CLASSE_PRIORITA,oggetto.LEA_PRESTAZIONI_PRIMO_ACC,constCategoria], false);		
						
					oTable.fnAddData( [indice,placeHolderEsito, chkEsaSel,infoIcon,oggetto.PAZIENTE,"<a href='#' onclick='javascript:modificaEsame("+ oggetto.IDEN +","+oggetto.IDEN_ANAG+");return false;'>" + oggetto.ESA_DESCR +"</a>",oggetto.DAT_ESA,"<textarea maxlength='4000' class='wideTextBox'  id='QUESITO_" + oggetto.IDEN + "' style='margin-left:3px;margin-right:3px;'>" +oggetto.QUESITO +"</textarea>",comboEsenzioni,comboPriorita,comboPrimoAccesso,comboCategoria], false);					
					
					indice ++;
				} // fine controllo tipo cod_esa
			} // fine loop su resultset	
		}
		catch(e){
			alert(e.description);
		}
		try{oTable.fnDraw();		}catch(e){}
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );	
//		setTimeout(function (){oTable.fnSort( [ [5,'asc'] ] );},1000);
		// li seleziono tutti , SOLO quelli selezionabili
	
		$("#TAB_ESAMI tr").filter(function(){
		    return $(this).find('[id^="chkEsaSel_"]').length == 1 ;
		}).children("td").addClass("highlight");
		//$('#TAB_ESAMI').closest(".dataTables_scrollBody").height(400);

		
		
//		showLoader(false);
		//***************************
		
		// converto checkbox
		/*$( "INPUT[type='checkbox'][id^='chkEsaSel_']").each(function(){ 
			$(this).button({ 
			  icons: {
				primary: "ui-icon-check"
			  },
			  text: false
			});
		});		*/
		// ****************************************************************
		/* Lasciare per ultimo: costruisce i filtri */
		/*
		$("tfoot th[id^='colCombo']").each( function ( i ) {
			var strHtml = "";
			var indiceColonna = $(this).attr("id").split("_")[1];
			if (indiceColonna!=0){
				strHtml = fnCreateSelect( oTable.fnGetColumnData(indiceColonna) );
				this.innerHTML =  strHtml ;
				$('select', this).change( function () {
					try{
						var valore = $(this).val();
						// resetto filtri pre esistenti
						$('#TAB_ESAMI').dataTable().fnFilter( "" );
						$('#TAB_ESAMI').dataTable().fnFilter( valore, indiceColonna );							
					}catch(e){alert(e.description);}
				} );
			}
		} );	
		*/
		// ****************************************************************		
		
		
	}
	catch(e){
		alert("fillDataTable - Error:  "+ e.description);
	}	
	finally{
		showLoader(false);
	}
}


var maxComboNumChar = 30;
function getEsenzioniPaziente(idenAnag, id1, idenEsame, oggetto){
	
	// IDEN_ANAG_WHALE
	var rs;
	var strOption = "<option value=''>&nbsp;</option>", strCombo="";
	try{
		if (id1=="" || typeof(id1)=="undefined"){
//			alert("Codice remoto nullo");
			return "<select id='cmbEsenzione_" + idenEsame+"'>"+strOption+"</select>";
		}
		// DA TOGLIERE !!! *** SOLO per test
		//id1 = "RSSRLD35B23I480F";
		// ********************
 		try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getEsenzioniPaziente',[id1]);}catch(e){alert("Errore: getEsenzioniPaziente " );return;}				
		// codice_esenzione
		// descr_esenzione
		while (rs.next()){
			oggetto.IDEN_ANAG_WHALE =  rs.getString("iden_anag"); 
			strOption += "<option value='" + rs.getString("codice_esenzione") + "' title='"+ rs.getString("descr_esenzione").toString().replace(new RegExp('\'', 'g'), '') +"'>"+ rs.getString("codice_esenzione")+" - "+ limitazioneTesto(rs.getString("descr_esenzione"),maxComboNumChar,"...")  +"</option>";
		}
		
		strCombo = "<select id='cmbEsenzione_" + idenEsame+"'  class='clsComboElenco'>"+strOption+"</select>";
		if (oggetto.IDEN_ANAG_WHALE==""){
			try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getIdenAnagWhale',[id1]);}catch(e){alert("Errore: getIdenAnagWhale " );return;}				
			if (rs.next()){		
				oggetto.IDEN_ANAG_WHALE	= rs.getString("iden_anag"); 
			}
			else{
				alert("Errore GRAVE: idenAnag cartella nullo!! " + id1);
				return "";
			}
		}
//		alert("IDEN_ANAG_WHALE " + oggetto.IDEN_ANAG_WHALE	);
	
	}
	catch(e){
		alert("getEsenzioniPaziente - Error:  "+ e.description);
	}	
	return strCombo;
}



function getPrioritaEsame(idenEsame, priorita){
	
	var strOption = "", strCombo="", strDefaultValue="";;
	try{
		// U,B,D,P
		if ((priorita=="undefined")||(priorita=="")||(typeof(priorita)=="undefined")){
			strDefaultValue = "P";
		}
		else{
			strDefaultValue = priorita;			
		}
		/*
		strOption = "<option value='U' " + (("U"==strDefaultValue)?"":"selected='selected'")+" >U</option>";
		strOption += "<option value='B' " + (("B"==strDefaultValue)?"":"selected='selected'")+" >B</option>";		
		strOption += "<option value='D' " + (("D"==strDefaultValue)?"":"selected='selected'")+" >D</option>";		
		*/
		
		if("U"==strDefaultValue){
			strOption += "<option value='U' selected='selected'>U</option>";						
		}
		else{
			strOption += "<option value='U' >U</option>";						
		}		
		if("B"==strDefaultValue){
			strOption += "<option value='B' selected='selected'>B</option>";						
		}
		else{
			strOption += "<option value='B' >B</option>";						
		}			
		if("D"==strDefaultValue){
			strOption += "<option value='D' selected='selected'>D</option>";						
		}
		else{
			strOption += "<option value='D' >D</option>";						
		}			
		if("P"==strDefaultValue){
			strOption += "<option value='P' selected='selected'>P</option>";						
		}
		else{
			strOption += "<option value='P' >P</option>";						
		}
		
		strCombo = "<select id='cmbPriorita_" + idenEsame+"'>"+strOption+"</select>";
	
	}
	catch(e){
		alert("getPrioritaEsame - Error:  "+ e.description);
	}	
	return strCombo;
} 

function getPrimoAccessoEsame(idenEsame, primoAccesso){
	
	var strOption = "", strCombo="", strDefaultValue="";;
	try{
		if ((primoAccesso=="undefined")||(primoAccesso=="")||(typeof(primoAccesso)=="undefined")){			strDefaultValue = "N";		}
		else{			strDefaultValue = primoAccesso;					}
		if ("S"==strDefaultValue){			strOption = "<option value='S' selected='selected'>SI</option>";		}
		else{			strOption = "<option value='S' >SI</option>";					}
		if ("N"==strDefaultValue){			strOption += "<option value='N' selected='selected' >NO</option>";		}
		else{			strOption += "<option value='N' >NO</option>";					}		
		strCombo = "<select id='cmbPrimoAccesso_" + idenEsame+"'>"+strOption+"</select>";
	}
	catch(e){
		alert("getPrioritaEsame - Error:  "+ e.description);
	}	
	return strCombo;
} 


function getCategoria(idenEsame ){
	

	var rs;
	var strOption = "", strCombo="";
	try{
		// limitazioneTesto(rs.getString("TIPO_DESC"),maxComboNumChar,"...")
 		try{var rs = getHomeFrame().executeQuery('multi_ricette.xml','getTipoRicetta',[]);}catch(e){alert("Errore: getTipoRicetta " );return;}				
		while (rs.next()){
			if (rs.getString("TIPO_IDEN")=="SSN"){
				strOption += "<option value='" + rs.getString("TIPO_IDEN") + "' selected='selected' title='"+ rs.getString("TIPO_DESC") +"'>"+  limitazioneTesto(rs.getString("TIPO_DESC"),maxComboNumChar,"...")  +"</option>";
			}
			else{
				strOption += "<option value='" + rs.getString("TIPO_IDEN") + "' title='" + rs.getString("TIPO_DESC") + "' >"+  limitazioneTesto(rs.getString("TIPO_DESC"),maxComboNumChar,"...")  +"</option>";				
			}
		}
		strCombo = "<select id='cmbCategoria_" + idenEsame+"' class='clsComboElenco'>"+strOption+"</select>";
	}
	catch(e){
		alert("getCategoria - Error:  "+ e.description);
	}	
	return strCombo;
} 



function highLightRow(oggetto){
	try{
		var id = "";
		

		id = $(oggetto).attr("id").split("_")[1];
		
		
		if ($(oggetto).parent().hasClass("highlight")){
			$(oggetto).parent().parent().each(function(){
				$(this).children("td").removeClass("highlight").addClass("normal");
			});
		}
		else{
			$(oggetto).parent().parent().each(function(){
				$(this).children("td").removeClass("normal").addClass("highlight");
			});
		}
	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}	
}


function generaRicette(){
	try{
		$("#lblAttesa").html("Attendere prego&nbsp;");
		showLoader(true);
		setTimeout(function(){
						try{
							doGeneraRicette();
						}
						catch(e){alert(e.description);}
						finally{
							$("#lblAttesa").html("");
							showLoader(false);
						}
		},500);
	}
	catch(e){
		alert("generaRicette - Error:  "+ e.description);
	}		
}

// NB !!!!
// ricordarsi di aggiornare sempre
// DETT_ESAMI.STATO_INVIO_RICETTA 
function doGeneraRicette(){
		// iden  _   numPre   _    leaPriorita


	var idenEsame = "";
	var oggetto;
	var oldIdenAnag="";
	var pPrestazioni="", pIdenAnag="", pIdenMed="", pDematerializzata="", pPriorita="", pCategoria="",	pDiagnosiICD9="", pDiagnosiDesc="", pQuesitoLibero="", pResult = "", pPrimoAccesso="",	pSito="", pAnonimo="";
	
	var rs;
	try{	

		// fare loop su tutti gli esami e rimappare oggetto.QUESITO
		// in base a quello che ha scelto utente
		// oppure farlo al volo quando compongo  pPrestazioni
		
		$("textarea[id^='QUESITO_']").each(function(i){
			idenEsame = $(this).attr("id").split("_")[1];
			oggetto = getJsonEsameByIden(idenEsame);
			oggetto.QUESITO = $(this).val();
	
		})

		var nRecTot = $("input[id^='chkEsaSel_'][checked='checked']").size();
		if (nRecTot==0){
			alert("Nessuna prestazione selezionata!");
			return;
		}
				// iden per whale
		// attenzione : correggere con getHomeFrame
		if (params.get("sorgente")=="MIOA" ){
			if (parent.parent.baseUser.COD_DEC_PERSONALE==""){alert("Errore GRAVE: nessun personale associato all'utente");return false;}			
			// ******
			scriviLog("sorgente :"  + params.get("sorgente") + ", COD_DEC_PERSONALE: " + parent.parent.baseUser.COD_DEC_PERSONALE);
			// ******			
			try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getIdenMedWhale',[parent.parent.baseUser.COD_DEC_PERSONALE]);}catch(e){alert("Errore: getIdenMedWhale " );return;}						
		}
		else{
			if (parent.baseUser.COD_DEC_PERSONALE==""){alert("Errore GRAVE: nessun personale associato all'utente");return false;}						
			// ******
			scriviLog("sorgente :"  + params.get("sorgente") + ", COD_DEC_PERSONALE: " + parent.baseUser.COD_DEC_PERSONALE);
			// ******			
			try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getIdenMedWhale',[parent.baseUser.COD_DEC_PERSONALE]);}catch(e){alert("Errore: getIdenMedWhale " );return;}	
		}
		if (rs.next()){pIdenMed = rs.getString("iden") ;}else{alert("Errore GRAVE: nessun match con il personale");return false;}			
		
		// ******
		scriviLog("pIdenMed: "  + pIdenMed);
		// ******					
		
		var bolFineRaggruppamento = true;
		$("input[id^='chkEsaSel_'][checked='checked']").each(function(i){
			idenEsame = $(this).attr("id").split("_")[1];
			// ******
			scriviLog("idenEsame: "  + idenEsame);
			// ******						
			oggetto = getJsonEsameByIden(idenEsame);	
			if (typeof(oggetto)=="undefined"){alert("ERRORE GRAVE: oggetto non definito");return false;}
			if (i==0){
				// salvo tutti i dati
				if (oggetto.IDEN_TESTATA_RICH!=""){
					// ******
					scriviLog("primo ciclo,  IDEN_TESTATA_RICH: "  + oggetto.IDEN_TESTATA_RICH);
					// ******						
			 		try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getSubPrestRichiesta',[oggetto.IDEN_TESTATA_RICH]);}catch(e){alert("Errore: getSubPrestRichiesta " );return;}
					while(rs.next()){
						if (pPrestazioni==""){
							pPrestazioni = rs.getString("codice");
						}else{
							pPrestazioni += ";" +  rs.getString("codice");
						}
						pPrestazioni +="$$$"+ rs.getString("descrizione");
						pPrestazioni +="$" + rs.getString("num_sedute");
						pPrestazioni +="$$1" ;// quantita
						pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
						pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
						pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  
					}
					// modifica del 17-2-16
					// aggiungere anche e comunque la prestazione principale !!!!
					if (pPrestazioni==""){
						pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
					}else{
						pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
					}
					pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
					pPrestazioni +="$1";
					pPrestazioni +="$$1" ;// quantita
					pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
					pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
					pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  					
					// ****************************
					
					// ******
					scriviLog("pPrestazioni: "  + pPrestazioni);
					// ******
					
				}
				else{
					// ******
					scriviLog("primo ciclo,  IDEN_TESTATA_RICH nullo");
					// ******						
					if (pPrestazioni==""){
						pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
					}else{
						pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
					}
					pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
					pPrestazioni +="$1";
					pPrestazioni +="$$1" ;// quantita
					pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
					pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
					pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  
					// ******
					scriviLog("pPrestazioni: "  + pPrestazioni);
					// ******
				}
				// iden anag whale
				pIdenAnag = oggetto.IDEN_ANAG_WHALE;
				pDematerializzata=constDema;
				//pPriorita=oggetto.LEA_CLASSE_PRIORITA;
				pPriorita = getValue("cmbPriorita_" + idenEsame);
//				pCategoria=constCategoria;
				pCategoria = getValue("cmbCategoria_"+ idenEsame);
				pDiagnosiICD9="";
				pDiagnosiDesc="";
				pQuesitoLibero=oggetto.QUESITO;
				pResult = "";
				//pPrimoAccesso=oggetto.LEA_PRESTAZIONI_PRIMO_ACC;
				pPrimoAccesso=getValue("cmbPrimoAccesso_" + idenEsame);
				pSito=constApplicativo;
				pAnonimo=oggetto.ANONIMATO;
				// ........
				if (nRecTot==1){
					//  sendRichiesta
					sendRichiesta(pPrestazioni,pIdenAnag, pIdenMed, pDematerializzata, pPriorita, pCategoria,	pDiagnosiICD9, pDiagnosiDesc, pQuesitoLibero, pResult, pPrimoAccesso,pSito, pAnonimo);
					return false;
				}
			}
			else{
				// secondo giro
				// esenzione usare "cmbEsenzione_"
				// usare getInfoRRprestazioni passando nell'ordine COD1 e COD2
				if (oldIdenAnag==oggetto.IDEN_ANAG){
					bolFineRaggruppamento = false;
					// più esami --> accodo
					if (oggetto.IDEN_TESTATA_RICH!=""){
						// ******
						scriviLog("ciclo successivo stesso paziente,  IDEN_TESTATA_RICH: "  + oggetto.IDEN_TESTATA_RICH);
						// ******							
						try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getSubPrestRichiesta',[oggetto.IDEN_TESTATA_RICH]);}catch(e){alert("Errore: getSubPrestRichiesta " );return;}
						while(rs.next()){
							if (pPrestazioni==""){
								pPrestazioni = rs.getString("codice");
							}else{
								pPrestazioni += ";" +  rs.getString("codice");
							}
							pPrestazioni +="$$$"+ rs.getString("descrizione");
							pPrestazioni +="$" + rs.getString("num_sedute");
							pPrestazioni +="$$1" ;// quantita
							pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
							pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
							pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  
						}
						// modifica del 17-2-16
						// aggiungere anche e comunque la prestazione principale !!!!
						if (pPrestazioni==""){
							pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
						}else{
							pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
						}
						pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
						pPrestazioni +="$1";
						pPrestazioni +="$$1" ;// quantita
						pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
						pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
						pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2 
						// **********
						// ******
						scriviLog("pPrestazioni: "  + pPrestazioni);
						// ******						
					}
					else{
						// ******
						scriviLog("ciclo successivo stesso paziente,  IDEN_TESTATA_RICH nullo "  );
						// ******							
						if (pPrestazioni==""){
							pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
						}else{
							pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
						}
						pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
						pPrestazioni +="$1";
						pPrestazioni +="$$1" ;// quantita
						pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
						pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
						pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  
						// ******
						scriviLog("pPrestazioni: "  + pPrestazioni);
						// ******	
					}
				}
				else{
					// UN solo esame per accettazione
					// oppure ho finito pacchetto per num_pre
					// compongo e mando	per oldIdenAnag
					bolFineRaggruppamento = true;
					sendRichiesta(pPrestazioni,pIdenAnag, pIdenMed, pDematerializzata, pPriorita, pCategoria,	pDiagnosiICD9, pDiagnosiDesc, pQuesitoLibero, pResult, pPrimoAccesso,pSito, pAnonimo);
					pPrestazioni = "";
					// quindi ricarico i dati
					// salvo tutti i dati
					if (oggetto.IDEN_TESTATA_RICH!=""){
						// ******
						scriviLog("ciclo successivo paziente diverso,  IDEN_TESTATA_RICH: "  + oggetto.IDEN_TESTATA_RICH);
						// ******							
						try{rs = getHomeFrame().executeQuery('multi_ricette.xml','getSubPrestRichiesta',[oggetto.IDEN_TESTATA_RICH]);}catch(e){alert("Errore: getSubPrestRichiesta " );return;}
						while(rs.next()){
							if (pPrestazioni==""){
								pPrestazioni = rs.getString("codice");
							}else{
								pPrestazioni += ";" +  rs.getString("codice");
							}
							pPrestazioni +="$$$"+ rs.getString("descrizione");
							pPrestazioni +="$" + rs.getString("num_sedute");
							pPrestazioni +="$$1" ;// quantita
							pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
							pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
							pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  
						}
						// modifica del 17-2-16
						// aggiungere anche e comunque la prestazione principale !!!!
						if (pPrestazioni==""){
							pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
						}else{
							pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
						}
						pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
						pPrestazioni +="$1";
						pPrestazioni +="$$1" ;// quantita
						pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
						pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
						pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2  						
						// ******
						scriviLog("pPrestazioni: "  + pPrestazioni);
						// ******
						
					}
					else{
						// ******
						scriviLog("ciclo successivo paziente diverso,  IDEN_TESTATA_RICH nullo");
						// ******								
						if (pPrestazioni==""){
							pPrestazioni = oggetto.COD1 +"@" + oggetto.COD2;
						}else{
							pPrestazioni += ";" +  oggetto.COD1 +"@" + oggetto.COD2;
						}
						pPrestazioni +="$$$"+ oggetto.ESA_DESCR;
						pPrestazioni +="$1";
						pPrestazioni +="$$1" ;// quantita
						pPrestazioni +="$" + getValue("cmbEsenzione_" + idenEsame) ;// codice esenzione
						pPrestazioni +="$$$$" + idenEsame; // mmg.accertamenti_dettaglio.cod1
						pPrestazioni +="$"+ oggetto.IDEN_TESTATA_RICH; // mmg.accertamenti_dettaglio.cod2 
						// ******
						scriviLog("pPrestazioni: "  + pPrestazioni);
						// ******						 
					}
					// iden anag whale
					// iden anag whale
					pIdenAnag = oggetto.IDEN_ANAG_WHALE;
					pDematerializzata=constDema;
//					pPriorita=oggetto.LEA_CLASSE_PRIORITA;
					pPriorita=getValue("cmbPriorita_" + idenEsame);
//					pCategoria=constCategoria;
					pCategoria=getValue("cmbCategoria_"+ idenEsame);
					pDiagnosiICD9="";
					pDiagnosiDesc="";
					pQuesitoLibero=oggetto.QUESITO;
					pResult = "";
					//pPrimoAccesso=oggetto.LEA_PRESTAZIONI_PRIMO_ACC;
					pPrimoAccesso=getValue("cmbPrimoAccesso_" + idenEsame);
					pSito=constApplicativo;
					pAnonimo=oggetto.ANONIMATO;
					// ........					
				}				
			}
			// aggiorno
			oldIdenAnag = oggetto.IDEN_ANAG;
		
	  }); // fine loop su selezionati
	  // mando gli ultimi dati
	  //bolFineRaggruppamento
	  
		if (nRecTot!=1 && pPrestazioni!=""){
			sendRichiesta(pPrestazioni,pIdenAnag, pIdenMed, pDematerializzata, pPriorita, pCategoria,	pDiagnosiICD9, pDiagnosiDesc, pQuesitoLibero, pResult, pPrimoAccesso,pSito, pAnonimo);
			pPrestazioni = "";
		}
	}
	catch(e){
		alert("doGeneraRicette - Error:  "+ e.description);
	}		
	finally{
		
	}
	alert("Generazione ricette terminata");
	ricerca();
}
		
		
function sendRichiesta(pPrestazioni,pIdenAnag, pIdenMed, pDematerializzata, pPriorita, pCategoria,	pDiagnosiICD9, pDiagnosiDesc, pQuesitoLibero, pResult, pPrimoAccesso,pSito, pAnonimo){
	try{
		var bolEsito = true;
		
		// ******
		scriviLog("sendRichiesta");
		// ******			
		
//		alert(pPrestazioni);
//		alert(pPrestazioni+"§\n" +pIdenAnag+"§\n" + pIdenMed+"§\n" + pDematerializzata+"§\n" + pPriorita+"§\n" + pCategoria+"§\n" +	pDiagnosiICD9+"§\n" + pDiagnosiDesc+"§\n" + pQuesitoLibero+"§\n" + pResult+"§\n" + pPrimoAccesso+"§\n" +pSito+"§\n" + pAnonimo);
// 		oggetto.EROGAZIONE_RICETTA
		// gestione default , da attivare o meno
		if (pPriorita=="" || typeof(pPriorita)=="undefined"){pPriorita=constDefaultPriorita;}
		if (pQuesitoLibero=="" || typeof(pQuesitoLibero)=="undefined"){pQuesitoLibero=constDefaultQuesito;}
		
		
		// ******
		scriviLog("Parametri:\n"+ pPrestazioni+"§\n" +pIdenAnag+"§\n" + pIdenMed+"§\n" + pDematerializzata+"§\n" + pPriorita+"§\n" + pCategoria+"§\n" +	pDiagnosiICD9+"§\n" + pDiagnosiDesc+"§\n" + pQuesitoLibero+"§\n" + pResult+"§\n" + pPrimoAccesso+"§\n" +pSito+"§\n" + pAnonimo);
		// ******			
		
		// *****************
		try{var out = getHomeFrame().executeStatement('multi_ricette.xml','generaRicetta',[pPrestazioni,pIdenAnag, pIdenMed, pDematerializzata, pPriorita, pCategoria,	pDiagnosiICD9, pDiagnosiDesc, pQuesitoLibero, pPrimoAccesso,pSito, pAnonimo],1);}catch(e){alert("Errore: generaRicetta " );return;}	
		if (out[0] != 'OK') {
			// ******
			scriviLog("generaRicetta stm ERRORE " + out[1]);
			// ******				
			alert("Errore " + out[1]);
			bolEsito = false;
		}
		else{
			
			// ******
			scriviLog("generaRicetta stm OK");
			// ******				
			bolEsito = true;
			// responso OK${"PD": "49699"}
			// RR_RICETTA_ROSSA_TESTATA.IDEN splittati da ,
			// il tipo 
			/* 
			B	ricetta bianca
			F	ricetta rossa farmaci
			FD	ricetta dematerializzata farmaci
			P	ricetta rossa prestazioni
			PD	ricetta dematerializzata prestazioni
			Q	ricetta bianca prestazioni
			*/
			var idenRicetta="";
			var obj , jsonStrResult = "";
			var jsonResult;
			try{
				/*
				try{
					if (typeof(out[2])!="undefined"){
						bolEsito = out[2].split("$")[0]=="OK";
					}
				}
				catch(e){
					alert("Test di manutenzione!!!\n" + e.description +"\n" + out[2] +"\n" + out[1] + "\n" + out[0]);
				}*/
				// da togliere

				try{
					if (typeof(out[2])!="undefined"){
						jsonStrResult= out[2].split("$")[1];
						// ******
						scriviLog("jsonStrResult:" + jsonStrResult);
						// ******				
						
						jsonResult =  JSON.parse(jsonStrResult);
						// prendo primo valore 
						// primo attributo
						for (var property in jsonResult) {
							if (jsonResult.hasOwnProperty(property)) {
								idenRicetta = jsonResult[property];
								break;
							}
						}								
					}
					//idenRicetta = jsonResult.PD;
				}
				catch(e){
					//alert("Errore di conversione " + e.description +"\n" + out[2] + "\n" + idenRicetta );
				}
				
			}
			catch(e){
				alert("Test di manutenzione!!\n" + e.description +"\n" + out[2]);
			}
		}
		// aggiorno lo stato
		var listaPrestazioni = pPrestazioni.split(";");
		var idenEsame = "";
		for (var z=0;z<listaPrestazioni.length;z++){
			idenEsame = listaPrestazioni[z].split("$")[11];
			// da modificare in base all'esito
			if (bolEsito){
				setEsitoPlaceHolder(idenEsame,"OK");
				
				// ******
				scriviLog("call updateStatoInvioRicetta, idenEsame: " + idenEsame + " esito$idenRicetta: "+ "S$" +idenRicetta);
				// ******
				
				updateStatoInvioRicetta(idenEsame,"S$" +idenRicetta );
			}
			else{
				setEsitoPlaceHolder(idenEsame,"KO");
				// ******
				scriviLog("call updateStatoInvioRicetta, idenEsame: " + idenEsame + " esito$idenRicetta: "+ "X$" +idenRicetta);
				// ******
				
				updateStatoInvioRicetta(idenEsame,"X$" +idenRicetta );
			}
			
		}		
		// settare esito : setEsitoPlaceHolder
	}
	catch(e){
		alert("sendRichiesta - Error:  "+ e.description);
	}	
}

function updateStatoInvioRicetta(iden, value){
	try{
//		updateStatoInvioRicetta
		var out = getHomeFrame().executeStatement('multi_ricette.xml','updateStatoInvioRicetta',[iden,value],0);
		if (out[0] != 'OK') {
			alert("Errore " + out[1]);
		}
	}
	catch(e){
		alert("updateStatoInvioRicetta - Error:  "+ e.description);
	}		
}
		
function setEsitoPlaceHolder(iden, esito){
	// esitoOK
	// plcHolder_
	try{
		if(iden =="" || typeof(iden)=="undefined"){return;}
		$("#plcHolder_" + iden).addClass("esito" + esito);
	}
	catch(e){
		alert("setEsitoPlaceHolder - Error:  "+ e.description);
	}			
}
		
function showLoader(bolShow){
	if (bolShow){
		$('#divTAB_ESAMI').oLoader({
		  backgroundColor:'#fff',
		  image: '../../std/jscript/jQueryOloader/images/ownageLoader/loader4.gif',
		  fadeInTime: 500,
		  fadeOutTime: 1000,
		  fadeLevel: 0.8
		});
	}
	else{
		 $('#divTAB_ESAMI').oLoader('hide');		
	}
}




function modificaEsame(idenEsame, idenAnag){
	try{
		alert(idenEsame +","+ idenAnag);
		/*
	document.frmEsame.Hiden_esame.value = codice;	
	document.frmEsame.Hiden_anag.value = "";
	document.frmEsame.tipo_registrazione.value = "M";			
	document.frmEsame.action = "schedaEsame";	
	
		*/
		window.open("../../schedaEsame?Hiden_esame=" + idenEsame +"&Hiden_anag=" + idenAnag +"&tipo_registrazione=M","","top=0,left=0,width=" + screen.availWidth + ",height=" + screen.availHeight +" , status=yes , scrollbars=auto");

	}
	catch(e){
		alert("modificaEsame - Error:  "+ e.description);
	}	
}

function getJsonEsameByIden(iden){
	var jsonMatch;
	try{
		for (var z=0;z<listaEsami.length;z++){
			if (listaEsami[z].IDEN==iden){
				jsonMatch = listaEsami[z];
				break;
			}
		}
	}
	catch(e){
		alert("getJsonEsameByIden - Error:  "+ e.description);
	}		
	return jsonMatch;
}


function chiudi(value){
	if (!value){
		if (!confirm("Chiudere la scheda corrente ?")){
			return ;
		}
	}
	parent.jQuery.fancybox.close();						
}

function openDettRichiesta(idenRichiesta){
	try{
//		alert(" openDettRichiesta " + iden);
		if (idenRichiesta=="" || typeof(idenRichiesta)=="undefined" || idenRichiesta == "undefined"){return;}
		
		// usare getInfoDettRichiesta
 		try{var rs = getHomeFrame().executeQuery('multi_ricette.xml','getInfoDettRichiesta',[idenRichiesta]);}catch(e){alert("Errore: getInfoDettRichiesta " );return;}				
		 var content = "" , listaDescr = "", quesito = "", medRich = "", opeRich="";
		 var idDivContent = "infoRich_" + idenRichiesta ;
		 content = "<div id='"+ idDivContent +"'>";
		 while (rs.next()){
			 if (listaDescr==""){
				 listaDescr += rs.getString("descr");				 
			 }
			 else{
				 listaDescr += ", " + rs.getString("descr");
			 }
			 quesito = rs.getString("quesito");
			 medRich = rs.getString("descr_med_richiedente");
			 opeRich = rs.getString("ope_rich");
		 }
		 
		content += "<label class='TitoloInfoFromWk'>Dettaglio richiesta</label>";		
		content += "<label class='dataInfoFromWk'>" + listaDescr+"</label>";		
		
		content += "<label class='TitoloInfoFromWk'>Quesito</label>";		
		content += "<label class='dataInfoFromWk'>" + quesito+"</label>";		
		
		content += "<label class='TitoloInfoFromWk'>Med.richiedente</label>";		
		content += "<label class='dataInfoFromWk'>" + medRich+"</label>";		
		
		content += "<label class='TitoloInfoFromWk'>Operatore richidente</label>";		
		content += "<label class='dataInfoFromWk'>" + opeRich+"</label>";		
		
		content += "</div>";
		  $.fancybox({
			  'titleShow': false,
				'autoScale': true,
				'hideOnOverlayClick': false,
				'centerOnScroll': true,
				'scrolling': 'no',
				'content': content
		  });		
		  
	  
	}
	catch(e){
		alert("openDettRichiesta - Error:  "+ e.description);
	}		
}
// *******************




function scriviLog(testo){
	try{
		globalLogFileObject.setSaveDateTimeEachRow(true);
		globalLogFileObject.appendToFileWithFileLimit(globalLogFileObject.getUserTempFolder() +"\\" + logFileName, testo, logFileLimitSize);
	}
	catch(e){
		alert("scriviLog - Error: " + e.description);
	}		
}

// **************************************