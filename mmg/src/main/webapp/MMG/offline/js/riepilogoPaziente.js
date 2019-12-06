$(document).ready(function(){
	RIEPILOGO_PAZIENTE.setIcon();
	RIEPILOGO_PAZIENTE.setEvents();
	
});

var RIEPILOGO_PAZIENTE = {
	
	accertamenti: $("#fldRicetteAccertamentiAssistito"),
	farmaci: $("#fldRicetteFarmaciAssistito"),
		
	load: function() {
		RIEPILOGO_PAZIENTE.getData();
		RIEPILOGO_PAZIENTE.getLists();
		RIEPILOGO_PAZIENTE.setLayout();
		
	},
	
	setEvents: function() {
		
		$(window).resize( RIEPILOGO_PAZIENTE.setLayout );
		
		$("#butPrescrizioneFarmaci").on("click", RIEPILOGO_PAZIENTE.prescriviFarmaci);
		$("#butPrescrizioneAccertamenti").on("click", RIEPILOGO_PAZIENTE.prescriviAccertamenti);

	},
	
	setLayout:function(){
			
		var tipo_layout = home_offline.LIB.getParamUserGlobal( 'LAYOUT', "4" );
		var height		= $('.jspContainer').innerHeight();
		
		if( tipo_layout == "2" ) {
			
			height -= 20;
			
			$('#fldProblemiAssistito, #fldDiarioAssistito').css('display','none');
			
			$('#fldRicetteFarmaciAssistito, #fldRicetteAccertamentiAssistito').addClass('half-width').css('height', height - 10 );
			
			$('#listaRicetteFarmaciAssistito, #listaRicetteAccertamentiAssistito').css('height', height - 65 );
			
		} else {

			height -= 60;
			
			$('#fldProblemiAssistito, #fldRicetteFarmaciAssistito, #fldDiarioAssistito, #fldRicetteAccertamentiAssistito')
				.height( parseInt( height / 2 ) - 10 );
			
			$('#listaProblemiAssistito, #listaDiarioAssistito')
				.height( parseInt( height / 2 ) - 20  );
				
			$('#listaRicetteFarmaciAssistito, #listaRicetteAccertamentiAssistito')
				.height( parseInt( height / 2 ) - 40 );
		}
		
	},
	
	getData: function(){
		
		RIEPILOGO_PAZIENTE.populate( ASSISTITO );
	},
	
	hideShowFieldset: function(legend){
	
	},
	
	populate: function( record ){
	
		$('#txtCognomeAssistito').val( record['COGN'] );
		$('#txtNomeAssistito').val( record['NOME'] );
		$('#txtDataDiNascitaAssistito').val( moment( record['DATAORDER'], 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) );
		$('#txtCodiceFiscaleAssistito').val( record['COD_FISC'] );
		$('#txtLuogoNascitaAssistito').val( record['COMUNE_NASCITA'] );
		$('#txtResidenzaAssistito').val( record['RES_INDIRIZZO'] + ', '+ record['COMUNE'] + ' (' + record['PROVINCIA'] + ')' );
		if (LIB.isValid(record['DOM_INDIR']) && LIB.isValid(record['DOM_COMUNE']) && LIB.isValid(record['DOM_PROV'])) {
			$('#txtDomicilioAssistito').val( record['DOM_INDIR'] + ', '+ record['DOM_COMUNE'] + ' (' + record['DOM_PROV'] + ')');
		} else {
			$('#txtDomicilioAssistito').val("");
		}
		$('#fldDatiAnagrafici :input').attr('readOnly', true);
		
	},
	
	getLists: function(){
		
		RIEPILOGO_PAZIENTE.createListEsenzioni();
		RIEPILOGO_PAZIENTE.createListProblemi();
		RIEPILOGO_PAZIENTE.createListDiario();
		RIEPILOGO_PAZIENTE.createListRicetteAccertamenti();
		RIEPILOGO_PAZIENTE.createListRicetteFarmaci();
	},
	
	createListEsenzioni: function(){
		var esenzioni = ASSISTITO['ESENZIONI'];
		var ul = $("#tableEsenzioni");
		if (ul.length == 0) {
			ul = $( document.createElement('ul') ).addClass('data-list').attr("id","tableEsenzioni");
		} else {
			ul.empty();
		}
		
		if( LIB.isValid( esenzioni ) && esenzioni.length > 0 ){
		
			for( var i = 0; i < esenzioni.length; i++ ){
				
				var li = $( document.createElement('li') ), text = '';
				text = '<strong>'+ esenzioni[i]['CODICE_ESENZIONE'] + '</strong> - '+ esenzioni[i]['DESCR_ESENZIONE'];
				li.html( text ).appendTo( ul );
			}
		
		}else{
			$( document.createElement('li') ).html( traduzione.lblNoEsenzioni).appendTo( ul );
		}
		
		$('#listaEsenzioniAssistito').empty().append( ul );
	},
	
	createListProblemi: function(){
		
		var problemi = ASSISTITO['PROBLEMI'];
		
		var table = $("#tableProblemi");
		if (table.length == 0) {
			table = $( document.createElement('table') ).addClass('tableList').attr("id","tableProblemi");
		} else {
			table.empty();
		}
		
		if( LIB.isValid( problemi ) && problemi.length > 0 ){

			for( var i = 0; i < problemi.length; i++ ){
				
				if (!home.OFFLINE.datoDaOscurare(problemi[i])) {
					var tr = $( document.createElement('tr') );
					tr.attr('iden', problemi[i]['IDEN']);
					tr.attr('idx', i);
					
					var td = $('<td></td>'), text = '';
					text = '<strong>'+ problemi[i]['DATA_INSERIMENTO'] + '</strong>';
					td.html( text ) .addClass('tdData').appendTo( tr );
					td = $('<td></td>');
					text = problemi[i]['PROBLEMA_COMPLETO'];
					td.html( text ).addClass('tdProblema').appendTo( tr );
					td = $('<td></td>');
					text = problemi[i]['CHIUSO_DESCR'];
					td.html( text ).addClass('tdChiuso').appendTo( tr );
					
					table.append(tr);
				}
			}
	
		}else{
			tr = $( document.createElement('tr') );
			tr.append($( document.createElement('td') ).html( traduzione.lblNoProblemi ));
			tr.appendTo( table );
		}
			
		$('#listaProblemiAssistito').empty().append( table );
	},
	
	createListDiario: function(){
		
		var diario = ASSISTITO['DIARIO'];
		
		var table = $( document.createElement('table') ).addClass('tableList').attr("id","tableDiario");
		
		if (home.baseUser.TIPO_UTENTE=="M") {
			table.append( $( document.createElement('tr') ).append( RIEPILOGO_PAZIENTE.getDiarioIcons() ) );
		}
		
		if( LIB.isValid( diario ) && diario.length > 0 ){

			for( var i = 0; i < diario.length; i++ ){
				
				var tr = $( document.createElement('tr') );
				tr.attr('iden', diario[i]['IDEN']);
				tr.attr('idx', i);
				
				var td = $('<td></td>'), text = '';
				
				text = '<strong>'+ moment( diario[i]['DATA_ISO'] , 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) + '</strong>';
				td.html( text ) .addClass('tdData').appendTo( tr );
				td = $('<td></td>');
				text = diario[i]['NOTA'];
				
				
				if (LIB.isValid(diario[i]["id_evento"])) {
					var del_icon = RIEPILOGO_PAZIENTE.getIconaCancellaElemento(diario[i]["id_evento"], "DIARIO", RIEPILOGO_PAZIENTE.createListDiario);
					td.append(del_icon);
				}

				td.append( text ).addClass('tdNota');
				td.appendTo( tr );
				
				table.append(tr);
			}
	
		}else{
			tr = $( document.createElement('tr') );
			tr.append($( document.createElement('td') ).html( traduzione.lblNoDiario ));
			tr.appendTo( table );
		}
		
		$('#listaDiarioAssistito').empty().append( table );
	},
	
	getDiarioIcons: function()
	{
		
		var 
			icon		= $( document.createElement('i') ).addClass('worklist-icon'),
			inserisci	= icon.clone().addClass('icon-plus-circled');
		
		
		inserisci.on( 'click', RIEPILOGO_PAZIENTE.openInsertDialog );
		
		return $( document.createElement('td') ).attr('colspan',2).append( inserisci );
		
	},
	
	getIconaCancellaElemento: function(id_evento, array_elementi, callback) {
		var del_icon = $("<i class='icon-cancel-circled'></i>");
		del_icon.on("click",function() {
			
			var msg = 'Sei sicuro di voler eliminare questo elemento?';
			
			home_offline.NS_OFFLINE_TOP.confirm( msg, function() {
				NS_OFFLINE.deleteEvento(id_evento,{
					if_ok:function(){
						var elementi = home.ASSISTITO[array_elementi];
						var i=0;
						while(i < elementi.length && LIB.isValid(elementi[i].id_evento)) { /*Le ricette prescritte offline sono in cima*/
							if (elementi[i].id_evento == id_evento) {
								elementi.splice(i,1);
							} else {
								i++;
							}
						}
						home_offline.NS_OFFLINE.updateAssistito({
							if_ok:function(){
								callback();
							}
						});
						home.NOTIFICA.info({ 'title': "Eseguito", 'message': traduzione.lblCancellaRicettaOK});
					},
					if_ko:function(){
						home.NOTIFICA.error({ 'title': traduzione.lblAttenzione, 'message': traduzione.lblCancellaRicettaKO});
					}
				});
				
			});
		});
		return del_icon;
	},
	
	rigaAccertamenti: function(tr, ricetta_i) {
		
		$( '<td><strong>'+ moment( ricetta_i['DATA_ISO'] , 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) + '</strong></td>' ) .addClass('tdData').appendTo( tr );
		
		var tdAccertamento = $('<td></td>').addClass('tdAccertamento').appendTo( tr );
		if (LIB.isValid(ricetta_i["id_evento"])) {
			var del_icon = RIEPILOGO_PAZIENTE.getIconaCancellaElemento(ricetta_i["id_evento"], "RICETTE_ACCERTAMENTI", RIEPILOGO_PAZIENTE.createListRicetteAccertamenti);
			tdAccertamento.append(del_icon);
		}
		if (LIB.isValid(ricetta_i['ACCERTAMENTO']) && ricetta_i['ACCERTAMENTO'] != "") {
			/*descrizione personalizzata accertamento*/
			tdAccertamento.append( ricetta_i['ACCERTAMENTO'] );
		} else {
			/*uso il codice*/
			home_offline.NS_OFFLINE.TABLE.ACCERTAMENTI.index("CODICE").get(ricetta_i['COD_ACCERTAMENTO']).done(function(data) {
				if (typeof data != "undefined") {
					tdAccertamento.append( data.DESCRIZIONE );
				}
			});
		}
		var tdCodice = $('<td></td>').addClass('tdCodice').appendTo( tr );
		try {
			var codici = ricetta_i["COD_ACCERTAMENTO"].split("@");
			tdCodice.append(codici[1]);
			tdCodice.attr("title", codici[0]);
		} catch (e) {
			console.error(e);
		}

		var cod_esenzione = ricetta_i['COD_ESENZIONE'];
		var tdEsenzione = $('<td></td>').html( cod_esenzione ).addClass('tdEsenzione').appendTo( tr );
		if (LIB.isValid(cod_esenzione) && cod_esenzione != "") {
			home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("CODICE").get(ricetta_i['COD_ESENZIONE']).done(function(data) {
				if (typeof data != "undefined")
					tdEsenzione.attr("title", data.DESCRIZIONE);
			});
		}

		$('<td></td>').html( ricetta_i['QUANTITA'] ).addClass('tdQta').appendTo( tr );
		
		tr.on("click",function(){
			var riga = $(this);
			if (riga.hasClass("nonattivo")) {
				return;
			}
			if(riga.hasClass("selected")){
				riga.removeClass("selected");
			} else{
				riga.addClass("selected");
			}
			$("#accertamentiSelezionati").text("(" + $("#listaRicetteAccertamentiAssistito .selected").length + " selezionati)");
		});
	},
	
	createListRicetteAccertamenti: function() {
		
		var ricette = ASSISTITO['RICETTE_ACCERTAMENTI'];
		
		var table = $( document.createElement('table') ).addClass('tableList').attr("id","tableAccertamenti");
		
		if( LIB.isValid( ricette ) && ricette.length > 0 ){
			
			var tr = $( document.createElement('tr') ).addClass("intestazione");
			var td = $('<td></td>');
			td.html( '<strong>Data<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Accertamento <span id="accertamentiSelezionati"></span><strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Codice<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Esenzione<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( "<strong>Qta'<strong>" ).appendTo( tr );
			table.append(tr);

			for( var i = 0; i < ricette.length; i++ ){
				
				var tr = $( document.createElement('tr') ).appendTo(table);
				tr.attr('iden', ricette[i]['IDEN']);
				if (ricette[i]['ATTIVO'] == "N") {
					tr.addClass("nonattivo");
					tr.attr("title", "Accertamento non riprescrivibile");
				}
				tr.attr('idx', i);
				
				if (ricette[i].CRONICITA == "S") {
					tr.addClass("ricettaCronica");
				}
				
				RIEPILOGO_PAZIENTE.rigaAccertamenti(tr, ricette[i]);
				
			}
	
		} else {
			var tr = $( document.createElement('tr') );
			tr.append($( document.createElement('td') ).html( traduzione.lblNoRicettaAccertamenti ));
			tr.appendTo( table );
		}
		
		$('#listaRicetteAccertamentiAssistito').empty().append( table );
	},
	
	descrizioneFarmaco:function(elemento, ricetta_i) {
		var notaCuf = ricetta_i['NOTA_CUF'];
		var PT = ricetta_i['PIANO_TERAPEUTICO'];
		var data_inizio = (LIB.isValid(ricetta_i['DATA_INIZIO']) && ricetta_i['DATA_INIZIO'] != "") ? moment( ricetta_i['DATA_INIZIO'], 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) : '';   
		var data_fine = (LIB.isValid(ricetta_i['DATA_FINE']) && ricetta_i['DATA_FINE'] != "") ? moment( ricetta_i['DATA_FINE'], 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) : '';  
		
		var scadPT = (LIB.isValid(ricetta_i['DATA_FINE']) && ricetta_i['DATA_FINE'] != "" && ricetta_i['DATA_FINE'] < moment().format('YYYYMMDD') ) ? ' ' + '<span class="offline_warning">' + moment( ricetta_i['DATA_FINE'], 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) + '</span>' : '';  
		
		if (LIB.isValid(ricetta_i["FARMACO"]) && ricetta_i["FARMACO"] != "") {
			/*Presidi e farmaci non in commercio:*/
			elemento.append(ricetta_i["FARMACO"]);
			if(PT == 'S') {
				elemento.append(' - <strong title="Piano terapeutico dal ' + data_inizio + ' al ' + data_fine + '"> PT </strong>' + scadPT);
			}
			if(notaCuf != '') {
				elemento.append(' - Prescritto con <strong>nota ' + notaCuf + '</strong>');
			}
		} else {
			home_offline.NS_OFFLINE.TABLE.FARMACI.index("COD_FARMACO").get(ricetta_i['COD_FARMACO']).done(function(data) {
				if (typeof data != "undefined") {
					var textFarmaco = data.DESCRIZIONE;
					if(PT == 'S') {
						textFarmaco += ' - <strong title="Piano terapeutico dal ' + data_inizio + ' al ' + data_fine + '"> PT </strong>' + scadPT;
					}
					if(notaCuf != '') {
						textFarmaco += ' - Prescritto con <strong>nota ' + notaCuf + '</strong>';
					}
					elemento.append( textFarmaco );
				}
			});
		}
	},
	
	rigaFarmaci: function(tr, ricetta_i) {
		
		var td = $('<td></td>');
		var text = '<strong>'+ moment( ricetta_i['DATA_ISO'] , 'YYYYMMDD' ).format( 'DD/MM/YYYY' ) + '</strong>';
		td.html( text ) .addClass('tdData').appendTo( tr );
		
		var tdFarmaco = $('<td></td>').addClass('tdFarmaco').attr("title", ricetta_i['PRINCIPIO_ATTIVO']).appendTo( tr );
		if (LIB.isValid(ricetta_i["id_evento"])) {
			var del_icon = RIEPILOGO_PAZIENTE.getIconaCancellaElemento(ricetta_i["id_evento"], "RICETTE_FARMACI", RIEPILOGO_PAZIENTE.createListRicetteFarmaci);
			tdFarmaco.append(del_icon);
		}
		var descrFarmaco = $("<span>");
		tdFarmaco.append(descrFarmaco);
		RIEPILOGO_PAZIENTE.descrizioneFarmaco(descrFarmaco, ricetta_i);
		
		var tdPoso = $('<td></td>').addClass('tdPosologia').appendTo( tr );
		if (LIB.isValid(ricetta_i['COD_POSOLOGIA']) && ricetta_i['COD_POSOLOGIA'] != "") {
			home_offline.NS_OFFLINE.TABLE.POSOLOGIE.index("CODICE").get(ricetta_i['COD_POSOLOGIA']).done(function(data) {
				if (typeof data != "undefined")
					tdPoso.html( data.DESCRIZIONE );
			});
		}
		
		var cod_esenzione = ricetta_i['COD_ESENZIONE'];
		var tdEsenzione = $('<td></td>').html( cod_esenzione ).addClass('tdEsenzione').appendTo( tr );
		if (LIB.isValid(cod_esenzione) && cod_esenzione != "") {
			home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("CODICE").get(ricetta_i['COD_ESENZIONE']).done(function(data) {
				if (typeof data != "undefined")
					tdEsenzione.attr("title", data.DESCRIZIONE);
			});
		}
		
		td = $('<td></td>');
		text = ricetta_i['QUANTITA'];
		td.html( text ).addClass('tdQta').appendTo( tr );
		
		tr.on("click",function(){
			var riga = $(this);
			if (riga.hasClass("nonattivo")) {
				return;
			}
			if(riga.hasClass("selected")){
				riga.removeClass("selected");
			}else{
				riga.addClass("selected");
			}

			$("#farmaciSelezionati").text("(" + $("#listaRicetteFarmaciAssistito .selected").length + " selezionati)");
		});
	},
	
	createListRicetteFarmaci: function(){
		
		var ricette = ASSISTITO['RICETTE_FARMACI'];
		
		var table = $( document.createElement('table') ).addClass('tableList').attr("id","tableFarmaci");
		
		if( LIB.isValid( ricette ) && ricette.length > 0 ){

			var tr = $( document.createElement('tr') ).addClass("intestazione");
			var td = $('<td></td>');
			td.html( '<strong>Data<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Farmaco <span id="farmaciSelezionati"></span><strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Posologia<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( '<strong>Esenzione<strong>' ).appendTo( tr );
			td = $('<td></td>');
			td.html( "<strong>Qta'<strong>" ).appendTo( tr );
			table.append(tr);
			
			for( var i = 0; i < ricette.length; i++ ){
				var tr = $( document.createElement('tr') ).appendTo(table);
				tr.attr('iden', ricette[i]['IDEN']);
				if (ricette[i]['ATTIVO'] == "N") {
					tr.addClass("nonattivo");
					tr.attr("title", "Farmaco non riprescrivibile");
				}
				tr.attr('idx', i);
				if (ricette[i].CRONICITA == "S") {
					tr.addClass("ricettaCronica");
				}
				RIEPILOGO_PAZIENTE.rigaFarmaci(tr, ricette[i]);
			}
	
		} else {
			var tr = $( document.createElement('tr') );
			tr.append($( document.createElement('td') ).html( traduzione.lblNoRicettaFarmaci ));
			tr.appendTo( table );
		}
			
		$('#listaRicetteFarmaciAssistito').empty().append( table );
	},
	
	prescrivi: function( tipo, idTabella ) {
		
		var parametri = "";
		$("#" + idTabella +" tr.selected").each(function() {
			if (parametri.length == 0) {
				parametri = "&IDX_" + tipo + "=" + $(this).attr("idx");
			} else {
				parametri += "," + $(this).attr("idx");
			}
		});
		
		NS_OFFLINE_TOP.apri( 'OFFLINE_PRESCRIZIONE', 'TIPO_PRESCRIZIONE=' + tipo + parametri);
	},
	
	prescriviAccertamenti: function() {
		RIEPILOGO_PAZIENTE.prescrivi("ACCERTAMENTI", "tableAccertamenti");
	},
	
	prescriviFarmaci: function() {
		RIEPILOGO_PAZIENTE.prescrivi("FARMACI", "tableFarmaci");
	},
	
	setIcon : function(){
		
	},
	
	openInsertDialog: function() {
		
		var content 	= $( document.createElement('div') );
		var textarea	= $( document.createElement('textarea') ).attr({ 'id': 'dialog-textarea', 'maxLength' : 4000 }).css({ 'width' : '100%', 'height': 200 });
		
		var dialog = $.dialog( content.append( textarea ), {
				buttons : [{
						 "label"  : "Salva",
						 "action" : function( ctx ) {
							 	
							 	var diario_item = {
							 			'IDEN_ANAG':		home_offline.ASSISTITO.IDEN_ANAG,
							 			'IDEN_MED':			home_offline.baseUser.IDEN_PER,
							 			'DATA_ISO':			moment().format('YYYYMMDD'),
							 			'IDEN':				'',
							 			'IDEN_PROBLEMA':	'',	
							 			'NOTA':				$('#dialog-textarea').val(),
							 			'TIPO':				''
							 	};
							 	
							 	$.dialog.hide();
								
							 	home_offline.NS_OFFLINE.accodaEvento( 'NOTA', {diario: diario_item},  function(result) {
								 	
							 		diario_item.id_evento=result;
								 	home_offline.ASSISTITO.DIARIO.splice( 0, 0, diario_item );
						 			home_offline.NS_OFFLINE.updateAssistito();
						 			RIEPILOGO_PAZIENTE.createListDiario();
								 	
					 			});
							 
							 }
					 }, 
					 {
						 "label"  :  "Chiudi",
						 "action" :   $.dialog.hide
				}],
				title : 'Nota del diario',
				width : '90%',
		});
		
	}
	
};