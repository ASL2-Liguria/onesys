// JavaScript Document
var divNotifica = "idNotifica";
var jsonMsg = {"iden":"","oggetto":"", "messaggio":"", "proprieta":""};
// definisco le proprietà di default
var jsonProprieta = {"inviato_a":"","priorita":"","popup_on_startup":"", "inviato_a_descr":"", "generato_da":"","target_system":""};

var jsonAnag = {"COGNOME":"","NOME":"","CODICE_FISCALE":"","DATA_NASCITA":"", "SESSO":"","ID_REMOTO":""};


// parametri gestiti in ingresso
// codUtente: chi crea  il msg (?) VERIFICARE
// sorgente:	chi chiami
// idenAnag:	riferimento anagrafico
// idRemoto:	CF del paziente
//	idMsg:		id del messaggio
//	reply:		S/N



// JavaScript Document
// ******************
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
	var oTable = $("#TAB_NOTIFICHE").dataTable();
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
		if (params.get("sorgente")=="home"){
			objHomeFrame = parent;
		}
		else if (params.get("sorgente")=="console"){
			// modifica 29-7-15
			objHomeFrame = parent.parent.top.opener.top;
		}
		else{
			objHomeFrame = parent;
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}

function init(){
	try{
		params = getParams();
		creaLivelloPerNotifica();
		initDialogDataEntry();
		initDataTable();
		fillDataTable();
		initUsersFilter();
		initWhoReadDialog();
		
		// controllo se è associato ad angrafica
		var idRemoto = params.get("idRemoto");


		if ((idRemoto!="undefined" && idRemoto!="" && typeof(idRemoto)!="undefined")||(params.get("reply")=="S")){		
			if (params.get("reply")=="S"){
				if (params.get("idMsg")=="undefined" || params.get("idMsg")=="" || typeof(params.get("idMsg"))=="undefined"){
					alert("Errore idMsg null!");
					return;
				}
				else{
					try{var rsMsg = getHomeFrame().executeQuery('notificheSistema_SV.xml','getMessageByIden',[params.get("idMsg")]);}catch(e){alert("Errore: getMessageByIden");}							
					if (rsMsg.next()){
						var codTarget = rsMsg.getString("XML_SORGENTE") +"@"+ rsMsg.getString("XML_COD_UTENTE_SOURCE");
						var oggetto = rsMsg.getString("XML_OGGETTO");
						var testo = rsMsg.getString("XML_TESTO");
						var descr_utente_source = rsMsg.getString("XML_DESCR_UTENTE_SOURCE");
						idRemoto = rsMsg.getString("XML_CODICE_FISCALE");
					}
					else{
						alert("Errore: il messaggio oiginale e' stato cancellato!");
						return;					
					}
				}
			}
			
		
			try{var rs = getHomeFrame().executeQuery('notificheSistema_SV.xml','getAnagInfo',[idRemoto]);}catch(e){alert("Errore: getAnagInfo");}		
			if (rs.next()){
				$("#anagTarget").html("Messaggio relativo al paziente: " + rs.getString("cogn") +" " + rs.getString("nome") +" " + rs.getString("data_nasc"));
				jsonAnag.COGNOME = rs.getString("cogn");
				jsonAnag.NOME =  rs.getString("nome") ;
				jsonAnag.CODICE_FISCALE = rs.getString("cod_fisc");
				jsonAnag.ID_REMOTO = rs.getString("cod_fisc");
				jsonAnag.DATA_NASCITA = rs.getString("data_nasc");
				jsonAnag.SESSO = rs.getString("sesso");		
			}			
		}
		
		if ((idRemoto!="undefined" && idRemoto!="" && typeof(idRemoto)!="undefined")||(params.get("reply")=="S")){
			// automatizzo creazione nuovo msg
			$("#create-message" ).click();
			$("#infoAnagTarget").css("display", "block");			
			$("#infoAnagTarget").css("visibility","visible");
			// nel caso di reply devo compilare anche oggetto , destinatario e testo quotato
			// ........
			if (params.get("reply")=="S"){			
				$("#txt_oggetto").val("Re: " + oggetto);
				$("#txt_messaggio").val("\n\n**** Testo Messaggio di " + descr_utente_source +" ****\n" + testo);
				add_elem("PERSONALE_TARGET", codTarget, descr_utente_source);
			}
		}

	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
}

function initUsersFilter(){


	var strTmp = "";
	var idCheck="";
	
	
	try{
		$( "#radioSistema" ).buttonset();               		
		var tipo = $("input[type='radio'][name='rdSistema']:checked").val();
		if (tipo=="") {return;}
		reloadTargets(tipo);
		$('button[id^="btPERSONALE_"]').each(function(){
			$(this).button();
		});
	}
	catch(e){
		alert("initUsersFilter - Error:  "+ e.description);
	}		  
}

function reloadTargets(tipo){
	try{
		remove_all_elem("PERSONALE_SOURCE");
		try{var rs = getHomeFrame().executeQuery('notificheSistema_SV.xml','getAllUsers_' + tipo,[]);}catch(e){alert("Errore: getAllUsers_");}		
		fill_selectFromResultSet(rs,"PERSONALE_SOURCE","userkey","descr",-1);		
		$('#PERSONALE_SOURCE').filterByText($('#fldRicerca'), false);		
	}
	catch(e){
		alert("reloadTargets - Error:  "+ e.description);
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


function  initDialogDataEntry(){
	try{
			// ***************** dialog inserimento ************
		$( "#dialog-form" ).dialog({
			  autoOpen: false,
			  height: "auto",
			  width: "auto",
			  modal: true,
			  buttons: {
				"Annulla": function() {
				  $( this ).dialog( "close" );
				},
				"Registra": function() {
					var bolEsito = saveMessage();
					if (bolEsito){
						$( this ).dialog( "close" );
						fillDataTable();
					}
				}
			  },
			  close: function() {
				$("#messageForm")[0].reset();
			  }
			});		
		
		$( "#create-message" )
		  .button()
		  .click(function() {
			$( "#dialog-form" ).dialog( "open" );
			$("#divDestinatari").show();
			// 
			$("#PERSONALE_TARGET").empty();
			reloadTargets('MMG');
		  });
		$( "#create-chiudi" )
		  .button()
		  .click(function() {
			chiudi(false);
		  });		
		$( "#btnAll" )
		  .button()
		  .click(function() {
			for (var i =0;i<getHomeFrame().baseUser.LISTAREPARTI.length;i++){
				$("#check_" + getHomeFrame().baseUser.LISTAREPARTI[i]).attr("checked", true);		
				// select xcdcToSerialCdc('XX') from dual
				// select distinct webuser from imagoweb.web_cdc where reparto in  ('AMB','DH_MED_SV')
				// fare blocco di insert per cdc (tutti utenti di quel cdc)
				// se tutti i cdc sono selezionati lasciare stm già presenti
			}
			$( "#cdcGroup" ).buttonset();					
		  });	
		  
		  $( "#radioPriorita" ).buttonset();	
		  

		  
		  
	}
	catch(e){
		alert("initDialogDataEntry - Error:  "+ e.description);
	}		  
}

function initDataTable(){
	var strTmp= "";
	try{
		var oTable = $('#TAB_NOTIFICHE').dataTable({
			"bPaginate": false,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,
			"bAutoWidth": false,
 		 	"sScrollY": "600px",
	        "bScrollCollapse": true,
			"width":"98%",
			"aoColumns": [
/*			{ "sWidth": "45px" , "bSearchable": false},
			{ "sWidth": "45px" , "bSearchable": false},*/
			{ "sWidth": "45px" , "bSearchable": false},			
			{ "sWidth": "32px" , "bSearchable": false},
			{ "sWidth": "150px","bSearchable": true}, 			
			{ "sWidth": "200px","bSearchable": true}, 			
			{ "sWidth": "100px","bSearchable": true}, 
			{ "sWidth": "100px","bSearchable": true },
			{ "sWidth": "80px","bSearchable": true }			
			],				
			"bJQueryUI": false,
			'bRetrieve': true,
			"oLanguage": {
					"sZeroRecords": "Nessun elemento"
				}
			});
		// *************************************************
		
	}
	catch(e){
		alert("initDataTable - Error:  "+ e.description);
	}	
}

function initWhoReadDialog(){
	try{
		$( "#dialog-infoWhoRead" ).dialog({
			  autoOpen: false,
			  height: "auto",
			  width: 700,
			  modal: true,
			  buttons: {
				"Chiudi": function() {
				  $( this ).dialog( "close" );
				}
			  },
			  create: function( event, ui ) {
				  // inizializzare datatable
			  },
			  close: function() {
	
			  }
			});
		var oTable = $('#TAB_DETT_LETTORI').dataTable({
			"bPaginate": false,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,
			"bAutoWidth": false,
			"aoColumns" : [
				{ sWidth: '40px' },
				{ sWidth: '150px' },
				{ sWidth: '150px' }
			]  ,
/* 		 	"sScrollY": "500px", */
	        "bScrollCollapse": true,
						
			"bJQueryUI": false,
			'bRetrieve': true,
			"oLanguage": {
					"sZeroRecords": "Nessun elemento"
				}
			});		
	}
	catch(e){
		alert("initWhoReadDialog - Error:  "+ e.description);
	}		
}


function whoRead(indice){
	try{
		var rs;
		var strStatoLetto="";
		// whoReadMessage
		// parametro idenNotifica
		var oTable = $('#TAB_DETT_LETTORI').dataTable();
		oTable.fnClearTable();	
		try{rs = getHomeFrame().executeQuery('notificheSistema_SV.xml','whoReadMessage',[listaNotifiche[indice].IDEN]);}catch(e){alert("Errore: whoReadMessage");}		
		while (rs.next()){
			if (rs.getString("letto")=="S"){
				strStatoLetto = "<span class='docRead' title='Messaggio letto'  ></span>";				
			}
			else{
				strStatoLetto = "<span class='docUnread' title='Messaggio non letto' ></span>";				
			}		
			oTable.fnAddData( [ strStatoLetto,rs.getString("destinatario"),rs.getString("data_lettura_ita")]);				
		}
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );	
//			setTimeout(function (){oTable.fnSort( [ [3,'desc'] ] );},1000)
		$( "#dialog-infoWhoRead" ).dialog( "open" );		
	}
	catch(e){
		alert("whoRead - Error:  "+ e.description);
	}		
}



function fillDataTable(){
	try{
		var strTitle = "";
		var oTable = $('#TAB_NOTIFICHE').dataTable();

		oTable.fnClearTable();	
		listaNotifiche = new Array();
		// decommentare 
 		try{rs = getHomeFrame().executeQuery('notificheSistema_SV.xml','getMySentMessages',[params.get("codUtente")]);}catch(e){alert("Errore: getMySentMessages");}		

		while (rs.next()){
			strTmp = "{\"IDEN\":\"" + rs.getString("IDEN") +"\"";
			strTmp += ",\"MESSAGGIO\":\"" + rs.getString("messaggio").toString().replaceAll("\"","\\\"") + "\"";
			strTmp += ",\"OGGETTO\":\"" + rs.getString("oggetto").toString().replaceAll("\"","\\\"") + "\"";			
			strTmp += ",\"DATA_INSERIMENTO\":\"" + rs.getString("DATA_INSERIMENTO") +"\"";									
			strTmp += ",\"CREATORE\":\"" + rs.getString("CREATORE") +"\"";		
			strTmp += ",\"DESTINATARIO\":\"" + rs.getString("DESTINATARIO") +"\"";					
			strTmp += ",\"DATA_INSERIMENTO_ITA\":\"" + rs.getString("DATA_INSERIMENTO_ITA") +"\"";
			
			strTmp += ",\"COGNOME\":\"" + rs.getString("XML_COGNOME") +"\"";				
			strTmp += ",\"NOME\":\"" + rs.getString("XML_NOME") +"\"";				
			strTmp += ",\"CODICE_FISCALE\":\"" + rs.getString("XML_CODICE_FISCALE") +"\"";				
			strTmp += ",\"SESSO\":\"" + rs.getString("XML_SESSO") +"\"";							
			strTmp += ",\"DATA_NASCITA\":\"" + rs.getString("XML_DATA_NASCITA") +"\"";			
			
			if (rs.getString("proprieta")==""){
				strTmp += ",\"PROPRIETA\":" + JSON.stringify(jsonProprieta) ;
			}
			else{
				strTmp += ",\"PROPRIETA\":" + rs.getString("proprieta").toString();			
			}
			strTmp += "}";
			strTmp = strTmp.replaceAll("\n","\\n");
			try{jsonObj = JSON.parse(strTmp);}catch(e){alert("error on parsing" + e.description);}
			listaNotifiche.push(jsonObj);
		}		
		var jsonTmp ;
		var strPriorita="", paziente = "", strTargetSystem="";;
		if (listaNotifiche.length>0){

			
			for(var i=0;i<listaNotifiche.length;i++){
			
				paziente = listaNotifiche[i].COGNOME +" " + listaNotifiche[i].NOME +" " +listaNotifiche[i].DATA_NASCITA;
				if (listaNotifiche[i].PROPRIETA.priorita!="" && listaNotifiche[i].PROPRIETA.priorita!="undefined" && typeof(listaNotifiche[i].PROPRIETA.priorita)!="undefined") {
/*					alert(listaNotifiche[i].PROPRIETA);
					alert(JSON.stringify(listaNotifiche[i].PROPRIETA));*/
					strPriorita = listaNotifiche[i].PROPRIETA.priorita.toString() =="1"?"<span class='altaPriorita'>&nbsp;</span>":"<span class='bassaPriorita'>&nbsp;</span>";
//					jsonTmp = listaNotifiche[i].PROPRIETA
	//				strPriorita = jsonTmp.priorita;
				}
				else{
					strPriorita = "<span class='bassaPriorita'>&nbsp;</span>";
				}
				if (listaNotifiche[i].PROPRIETA.target_system!="" && listaNotifiche[i].PROPRIETA.target_system!="undefined" && typeof(listaNotifiche[i].PROPRIETA.target_system)!="undefined") {
					strTargetSystem = listaNotifiche[i].PROPRIETA.target_system.toString();
				}
				else{
					strTargetSystem = "";
				}
				
				// da riabilitare se si vuole geestione edit e del
//				oTable.fnAddData( [ "<span class='editMsg' title='Modifica notifica' id='id_editMsg_" + i + "' onclick='javascript:manageMsg(" + i  + ",\"" + "EDIT" + "\");return false;'></span>","<span class='delMsg' title='Cancella notifica' id='id_delMsg_" + i + "' onclick='javascript:manageMsg(" + i + ",\"" + "DEL" + "\");return false;'></span>", strPriorita,"<a href\"#\" onclick=\"openDialog(" + i +");\" class=\"linkOggettoMsg\" title='"+ listaNotifiche[i].OGGETTO +"'>" + listaNotifiche[i].OGGETTO.toString().cutAndPad(60,"...") +"</a>",listaNotifiche[i].DATA_INSERIMENTO_ITA,listaNotifiche[i].CREATORE, "<span title='" + listaNotifiche[i].PROPRIETA.inviato_a +"'>" + strDescrCdc +"</span>", strIcoLettori]);	

				oTable.fnAddData( ["<span class='delMsg' title='Cancella notifica' id='id_delMsg_" + i + "' onclick='javascript:manageMsg(" + i + ",\"" + "DEL" + "\");return false;'></span>",strPriorita,"<a href\"#\" onclick=\"openDialog(" + i +");\" class=\"linkOggettoMsg\" title='"+ listaNotifiche[i].OGGETTO +"'>" + listaNotifiche[i].OGGETTO.toString().cutAndPad(60,"...") +"</a>",paziente,listaNotifiche[i].DATA_INSERIMENTO_ITA, listaNotifiche[i].DESTINATARIO,strTargetSystem]);	

			}			
			setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );	
			setTimeout(function (){oTable.fnSort( [ [4,'asc'] ] );},1000);
			$("#TAB_NOTIFICHE tr").hover(function()
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
				var indiceColonna = $(this).attr("id").split("_")[1];
				if (indiceColonna!=0){
					strHtml = fnCreateSelect( oTable.fnGetColumnData(indiceColonna) );
					this.innerHTML =  strHtml ;
					$('select', this).change( function () {
						try{
							var valore = $(this).val();
							// resetto filtri pre esistenti
							$('#TAB_NOTIFICHE').dataTable().fnFilter( "" );
							$('#TAB_NOTIFICHE').dataTable().fnFilter( valore, indiceColonna );			
							
							
				
							
						}catch(e){alert(e.description);}
					} );
				}
			} );	

		}		
	}
	catch(e){
		alert("fillDataTable - Error:  "+ e.description);
	}	
}

function resetJsonObject(){
	jsonMsg = {"iden":"","oggetto":"", "messaggio":"", "proprieta":""};
	// definisco le proprietà di default
	jsonProprieta = {"inviato_a":"","priorita":"","popup_on_startup":"", "inviato_a_descr":"", "generato_da":"","target_system":""};	
}

function saveMessage(){
	var bolEsito = false;
	var strPersonaleDestinatario = "";
	try{
		// ****** spostare logica in notificheSistema !!!
		// **********************
		var stm;
		resetJsonObject();

		if ($("#txt_oggetto").val()=="" || $("#txt_oggetto").val()=="undefined"){
			alert("Prego inserire l'oggetto della notifica.");
			$("#txt_oggetto").focus();
			return;
		}
		jsonMsg.oggetto = $("#txt_oggetto").val();
		if ($("#txt_messaggio").val()=="" || $("#txt_messaggio").val()=="undefined"){
			alert("Prego inserire il corpo della notifica.");
			$("#txt_messaggio").focus();
			return;
		}		
		jsonMsg.messaggio = $("#txt_messaggio").val();

		if (jsonMsg.messaggio.length > 2000){
			alert("Impossibile registrare più di 4000 caratteri"); return false;	
		}
		
		if ($("#idenMsg").val()!="" && $("#idenMsg").val()!="undefined"){
			// modifica
			// @DEPRECATED (x il momento)
			jsonMsg.iden = $("#idenMsg").val();
//			alert(jsonMsg.oggetto + " " + jsonMsg.messaggio  + " " + params.get("codUtente") + " " +  jsonMsg.iden);
			stm = getHomeFrame().executeStatement('notificheSistema_SV.xml','aggiornaNotifica',[jsonMsg.oggetto,jsonMsg.messaggio ,params.get("codUtente"), jsonMsg.iden],0);			
		}
		else{
			// inserimento
			// 		alert(JSON.stringify(jsonMsg));
			// ora salvo messaggio "puro", poi salvare il msg
			// in formato json per salvare + dati
			strPersonaleDestinatario = getAllOptionCode("PERSONALE_TARGET");
			if (strPersonaleDestinatario == ""){
				alert("Impossibile continuare: selezionare almeno un destinatario");
				return false;
			}
			
			var listaCodDecTarget = getAllOptionCode("PERSONALE_TARGET").split("*");
			var listaDescrTarget = getAllOptionText("PERSONALE_TARGET").split("*");			
			// gestisco 2 tipi di strutture, vedo poi quale usare
			var jsonToSend = {"TIPOLOGIA":"MSG_PVT","DATI_JSON":"","COD_DEC_SOURCE":"","COD_DEC_TARGET_LIST":"","XML_DATA":""};
			var bolEsito=false;
			var strXml = "";
			// fare loop per ogni personale
			try{
				for (var z=0;z<listaCodDecTarget.length;z++){
						// var jsonMsg = {"iden":"","oggetto":"", "messaggio":"", "proprieta":""};
						//var jsonProprieta = {"inviato_a":"","priorita":"","popup_on_startup":"", "inviato_a_descr":"", "generato_da":"","target_system":""};
						jsonProprieta.inviato_a = listaCodDecTarget[z].split("@")[1];
						jsonProprieta.inviato_a_descr = listaDescrTarget[z];
						jsonProprieta.priorita = $("input[name='radioPr']:checked").val();
						jsonProprieta.generato_da = getHomeFrame().gestioneNotifiche.codiceSorgenteInviante;
						jsonProprieta.target_system = listaCodDecTarget[z].split("@")[0];
						jsonMsg.proprieta = jsonProprieta;
	//					 alert(JSON.stringify(jsonMsg));
						jsonToSend.DATI = jsonMsg;
						jsonToSend.COD_DEC_SOURCE = params.get("codUtente");
						jsonToSend.COD_DEC_TARGET_LIST = listaCodDecTarget[z].split("@")[1];
						
						
						strXml = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><NOTIFICA>	<MESSAGGIO>";						
						strXml += "<OGGETTO><![CDATA["+ jsonToSend.DATI.oggetto + "]]></OGGETTO>";
						strXml += "<TESTO><![CDATA["+ jsonToSend.DATI.messaggio + "]]></TESTO>";
						strXml += "<PRIORITA>"+ jsonToSend.DATI.proprieta.priorita + "</PRIORITA>";
						strXml += "</MESSAGGIO>";						
						// NON ricordo cosa servisse ??!
//						strXml += "<SORGENTE>"+ jsonToSend.DATI.proprieta.generato_da + "</SORGENTE>";						
						strXml += "<SORGENTE>"+ getHomeFrame().gestioneNotifiche.codiceSorgenteInviante + "</SORGENTE>";						
						strXml += "<COD_DEC_UTENTE_SOURCE>"+ params.get("codUtente") + "</COD_DEC_UTENTE_SOURCE>";	
						strXml += "<DESCR_UTENTE_SOURCE>"+ getHomeFrame().baseUser.DESCRIPTION + "</DESCR_UTENTE_SOURCE>";	
						strXml += "<TARGET_SYSTEM>"+ listaCodDecTarget[z].split("@")[0] + "</TARGET_SYSTEM>";	
						if (jsonAnag.ID_REMOTO!="undefined" && jsonAnag.ID_REMOTO!="" && typeof(jsonAnag.ID_REMOTO)!="undefined"){
							strXml += "<ANAGRAFICA>";
							strXml += "<COGNOME>"+ jsonAnag.COGNOME + "</COGNOME>";														
							strXml += "<NOME>"+ jsonAnag.NOME + "</NOME>";														
							strXml += "<CODICE_FISCALE>"+ jsonAnag.CODICE_FISCALE + "</CODICE_FISCALE>";														
							strXml += "<DATA_NASCITA>"+ jsonAnag.DATA_NASCITA + "</DATA_NASCITA>";														
							strXml += "<SESSO>"+ jsonAnag.SESSO + "</SESSO>";																					
							strXml += "<ID_REMOTO>"+ jsonAnag.CODICE_FISCALE  + "</ID_REMOTO>";							
							strXml += "</ANAGRAFICA>";				
						}
						else{
							strXml += "<ANAGRAFICA><COGNOME></COGNOME><NOME></NOME><CODICE_FISCALE></CODICE_FISCALE><DATA_NASCITA></DATA_NASCITA><SESSO></SESSO><ID_REMOTO></ID_REMOTO></ANAGRAFICA>";
						}
						strXml += "</NOTIFICA>";							
						jsonToSend.XML_DATA = strXml;
						getHomeFrame().gestioneNotifiche.sendMessage(listaCodDecTarget[z].split("@")[0],jsonToSend);
				}
				bolEsito=true;
			}
			catch(e){bolEsito=false;;}
			// refresh
			if (bolEsito){
				alert("Operazione completata.");
				$( "#dialog-form" ).dialog( "close" );
				fillDataTable();				
			}
			else{
				alert("Problemi di comunicazione. Riprovare la registrazione.");
			}
			
			
			// ***
			// usare oggetto gestioneNotifiche in notificheSistema.js

		}
	}
	catch(e){
		alert("saveMessage - Error:  "+ e.description);
	}			
	return bolEsito;
}

function manageMsg(indice, opType){
	try{
		switch (opType){
			case "EDIT":
				$( "#dialog-form" ).dialog( "open" );
				// fill data
				$("#txt_oggetto").val(listaNotifiche[indice].OGGETTO);
				$("#txt_messaggio").val(listaNotifiche[indice].MESSAGGIO);
				$("#idenMsg").val(listaNotifiche[indice].IDEN);
				// nascondo i cdc che non sono più modificabili
				$("#divDestinatari").hide();
				break;
			case "DEL":
				if (!confirm("Procedere nella cancellazione della notifica con oggetto: '" + listaNotifiche[indice].OGGETTO +"' ?")){return;}
				var stm = getHomeFrame().executeStatement('notificheSistema_SV.xml','cancellaNotifica',[listaNotifiche[indice].IDEN],0);
				if (stm[0]!="OK"){
					alert("Errore: problemi nella cancellazione\n" + stm[1] );
				}
				else{
					// alla fine faccio refresh 
					fillDataTable();					
				}
				break;
		}
	}
	catch(e){
		alert("manageMsg - Error:  "+ e.description);
	}	
}

function openDialog(indice){
	try{
		$( "#" + divNotifica).html(listaNotifiche[indice].MESSAGGIO.replace( /\r?\n/g, "<br/>" ));
		$( "#"+ divNotifica ).dialog( "option", "title", "Messaggio del " + listaNotifiche[indice].DATA_INSERIMENTO_ITA + ", inviato a: " + listaNotifiche[indice].DESTINATARIO  ).dialog( "open") ;
		// cambio stato letto nel db
		getHomeFrame().gestioneNotifiche.setRead(listaNotifiche[indice].IDEN);
		// cambio icona !
		$( "#notificaLettura_"+ indice ).removeClass( "docUnread" ).addClass( "docRead" );
	}
	catch(e){
		alert("openDialog - Error:  "+ e.description);
	}	
}


function creaLivelloPerNotifica(testo){
	try{
//				$( "#divAnagInfoConsole" ).remove();
		jQuery('<div/>', {
			id: divNotifica,
			title: 'Messaggio'
		}).appendTo('#myBody');
		$( "#" + divNotifica).dialog({
			autoOpen: false,
			height:"auto",
			width:600,
			modal:true
		});	
	}
	catch(e){
		alert("openDialog - Error:  "+ e.description);
	}	
}


function chiudi(value){
	if (!value){
		if (!confirm("Chiudere la scheda corrente ?")){
			return ;
		}
	}
	if (params.get("sorgente")=="console"){
		parent.j$.fancybox.close();	
	}
	else{
		getHomeFrame().jQuery.fancybox.close();						
	}
}


// *******************

// estensione per filtrare select
/*
textbox
This could be a jQuery selector, a jQuery object, or a DOM object.
selectSingleMatch
This is optional, if you set it to true, when the filtered list includes only one item, that item will be automatically selected.

bind sample

$(function() {
  $('#select').filterByText($('#textbox'), true);
});  

*/
jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
  return this.each(function() {
    var select = this;
    var options = [];
    $(select).find('option').each(function() {
      options.push({value: $(this).val(), text: $(this).text()});
    });
    $(select).data('options', options);
    $(textbox).bind('change keyup', function() {
      var options = $(select).empty().scrollTop(0).data('options');
      var search = $.trim($(this).val());
      var regex = new RegExp(search,'gi');

      $.each(options, function(i) {
        var option = options[i];
        if(option.text.match(regex) !== null) {
          $(select).append(
             $('<option>').text(option.text).val(option.value)
          );
        }
      });
      if (selectSingleMatch === true && 
          $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
    });
  });
};

