
var menuStampa = {
		"menu" : {
			"id"		: "MENU_STAMPA",
			"structure"	: { "list": [] },
			"title"		: '\"Stampa\"',
			"status"	: true
		}};

var menuAllega = {
		"menu" : {
			"id"		: "MENU_ALLEGA",
			"structure"	: { "list": [] },
			"title"		: '\"Allega\"',
			"status"	: true
		}};

var $alleg = {};
var $crono = {};

var NS_GESTISCI_CONSENSI = {
		
	assigning_authority		: home.baseGlobal.ASSIGNING_AUTHORITY,
	arrayConsensi			: [],
	arrayConsensiPaziente	: [],
	deceduto				: false,
		
    init: function(){

    	NS_GESTISCI_CONSENSI.db = $.NS_DB.getTool({_logger : window.logger});
    	home.NS_GESTISCI_CONSENSI = this;
    	
    	if(LIB.isValid($("#DATA_MORTE").val()) && $("#DATA_MORTE").val() !== 'null'){ NS_GESTISCI_CONSENSI.deceduto = true;}
    	
    	NS_GESTISCI_CONSENSI.setLayout();
    	NS_GESTISCI_CONSENSI.getConsensiEsistenti();
    },
    
    setEvents: function() {
		
		$("#txtRicerca").on('keyup', function() {
			NS_GESTISCI_CONSENSI.searchByStato();
		});
		
		$("#radStatoConsenso").on('change', function() {
			NS_GESTISCI_CONSENSI.searchByStato();
		});
    },
    
    searchByStato: function() {
		
		var cerca = $("#txtRicerca").val().toUpperCase();

    	switch ($("#h-radStatoConsenso").val()) {
		case "C":
			$(".divConsenso").each(function(){
				var testo = $(this).text().toUpperCase();
				var row = $(this).closest(".row");
				if(row.hasClass("attivo") && testo.indexOf(cerca) >= 0){
					row.show();				
				}else{
					row.hide();
				}
			});
			return;
			break;
		case "N":
			$(".divConsenso").each(function(){
				var testo = $(this).text().toUpperCase();
				var row = $(this).closest(".row");
				if(!row.hasClass("attivo") && testo.indexOf(cerca) >= 0){
					row.show();				
				}else{
					row.hide();
				}
			});
			return;
			break;
		default:
			NS_GESTISCI_CONSENSI.searchText();
			return;
		}
    },
	
	setLayout: function() {
        
        $('div#GestisciConsensi div.headerTabs h2#lblTitolo').html(
            $('div#GestisciConsensi div.headerTabs h2#lblTitolo').html() + " di " + 
            $("#NOME").val() + " " + $("#COGNOME").val() + " nato a " + $("#COMUNE_NASCITA").val() + " il " + $("#DATA_NASCITA").val().substring(6, 8) + "/" + $("#DATA_NASCITA").val().substring(4, 6) + "/" + $("#DATA_NASCITA").val().substring(0, 4) + " (CF: " + $("#CODICE_FISCALE").val() + "; SESSO: " + $("#SESSO").val() + ")"
        );
		
		$('#tabs-GestisciConsensi').hide();
				
		var y = 420;
		
		// Centramento
		$('#dati').css('padding-top', (parent.$('body').height() / 2) - (y / 2));

		// Setto l'altezza
		$('.contentTabs').height(y);
		$('#fld_Consensi').height($('.contentTabs').height() - $('#fldRicerca').height() - 90);
	},
        
    getConsensiEsistenti: function(){

		home.$.NS_DB.getTool({_logger : home.logger}).select({
			datasource	: 'PORTALE_PIC',
            id			: 'SDJ.TIPI_CONSENSO',
            parameter	: {}
		}).done( function(resp) {
			NS_GESTISCI_CONSENSI.arrayConsensi = resp.result;
	    	$(".row").remove();
			NS_GESTISCI_CONSENSI.buildElencoConsensi(NS_GESTISCI_CONSENSI.arrayConsensi);
		});
	},
	
	buildElencoConsensi: function(arrayConsensi){
		for (var i=0; i<arrayConsensi.length; i++ ){
			NS_GESTISCI_CONSENSI.inserisciOpzione(arrayConsensi[i].VALUE, arrayConsensi[i].DESCR, arrayConsensi[i].PARAMETRI);
		}
		NS_GESTISCI_CONSENSI.searchByStato();
	},
    
	inserisciOpzione: function(value, descr, parametri) {

		menuStampa.menu.structure.list = [];
		menuAllega.menu.structure.list = [];
		parametri = JSON.parse(parametri);
		
		for(var k=0; k<parametri.length; k++ ){
			NS_GESTISCI_CONSENSI.addItemMenuStampa(parametri[k].LABEL, parametri[k].FUNCTION);
		}
		
		var consenso = home.NS_FENIX_PIC.search.consensus($("#PATIENT_ID").val(), value);
		
		var iden, data_dichiarazione, utente_dichiarazione, data_inserimento, utente_inserimento;
		if(consenso != ''){
			iden 					= consenso.IDEN;
			data_dichiarazione 		= NS_GESTISCI_CONSENSI.processClassDataISO(consenso.DATA_DIC);
			utente_dichiarazione	= consenso.UTE_DIC;
			data_inserimento 		= NS_GESTISCI_CONSENSI.processClassDataISO(consenso.DATA_INSERIMENTO);
			utente_inserimento		= home.NS_FENIX_PIC.search.user_by_cod_dec(consenso.UTE_INS).DESCR;
		}else{
			iden = data_dichiarazione = utente_dichiarazione = data_inserimento = utente_inserimento = null;
		}
		
		var param = {
				'iden' 					: iden, 
				'data_dichiarazione' 	: data_dichiarazione, 
				'utente_dichiarazione' 	: utente_dichiarazione, 
				'data_inserimento' 		: data_inserimento, 
				'utente_inserimento' 	: utente_inserimento, 
		}
		
		$crono[value] = $("[data-consenso ='" + value + "'] .icon-print").contextMenu(menuStampa,{openSubMenuEvent: "click", openInfoEvent: "click"});
		
		var $iconInserisci = $("<i>", {"class":"icon-plus inserisci tasto", "title": "Inserisci Consenso", "data-consenso": value});
		var $iconModifica = $("<i>", {"class":"icon-pencil modifica tasto", "title": "Modifica Consenso", "data-consenso": value});
		var $iconVisualizza = $("<i>", {"class":"icon-search visualizza tasto", "title": "Visualizza Consenso", "data-consenso": value});
		var $iconStampa = $("<i>", {"class":"icon-print stampa tasto", "title": "Funzioni di Stampa", "data-consenso": value})
			.on("click",function(e){
	
				e.preventDefault();
				e.stopImmediatePropagation();
				NS_GESTISCI_CONSENSI.closeContextMenu();
				$crono[value].test(e, this);
			});
		
		var $iconCancella = $("<i>", {"class":"icon-trash elimina tasto", "title": "Cancella Consenso", "data-consenso": value});
		var $iconStorico = $("<i>", {"class":"icon-doc-text storico tasto", "title": "Storico Consenso", "data-consenso": value})
			.on("click", function(){NS_GESTISCI_CONSENSI.versioniConsenso($(this).attr("data-consenso"))});

		var $iconAllegato = $("<i>", {"class":"icon-attach allegato tasto", "title": "Allegato", "data-consenso": value});
		var $iconInfo = $("<i>", {"class":"icon-info-circled informazioni tasto", "title": "Dettaglio Consenso", "data-consenso": value});
		var $divRow = $('<div>', {"class":"row"});
		var $divConsenso = $('<div>', {"class":"divConsenso"}).text(descr);
		
		var riga = {
				'iconInserisci' 	: $iconInserisci, 
				'iconModifica' 		: $iconModifica, 
				'iconVisualizza' 	: $iconVisualizza, 
				'iconStampa' 		: $iconStampa, 
				'iconCancella' 		: $iconCancella, 
				'iconStorico' 		: $iconStorico, 
				'iconAllegato' 		: $iconAllegato, 
				'iconInfo' 			: $iconInfo, 
				'divRow' 			: $divRow, 
				'divConsenso' 		: $divConsenso
		}
				
		NS_GESTISCI_CONSENSI.checkStatoIcona(value, iden, param, riga);

		$("#fldConsensi").append(
			$divRow
				.append(
					$divConsenso,
					$('<div>', {"class":"divTasti"})
					.append(
						$iconInserisci,
						$iconModifica,
						$iconVisualizza,
						$iconStorico,
						$iconStampa,
						$iconCancella,
						$iconAllegato,
						$iconInfo
					)
				)
		);
    },
    
    checkStatoIcona: function(value, iden, param, riga) {
		
		if(NS_GESTISCI_CONSENSI.deceduto){
			riga.iconInserisci.addClass("iconadisattiva");
			riga.iconModifica.addClass("iconadisattiva");
			riga.iconCancella.addClass("iconadisattiva");
			if(iden !== null){
				riga.divRow.addClass("attivo");
				riga.iconVisualizza.removeClass("iconadisattiva");
				riga.iconVisualizza.on("click", function(){NS_GESTISCI_CONSENSI.visualizzaConsenso($(this).attr("data-consenso"), iden)});
				riga.iconInfo.removeClass("iconadisattiva");
				riga.iconInfo.on("click", function(){NS_GESTISCI_CONSENSI.showInfoConsenso(param)});
				NS_GESTISCI_CONSENSI.setMenuAllega(riga.iconAllegato, value, iden);
			}else{
				riga.divRow.removeClass("attivo");
				riga.iconVisualizza.addClass("iconadisattiva");
				riga.iconInfo.addClass("iconadisattiva");
				riga.iconAllegato.addClass("iconadisattiva");
			}
		}else{
			
			if(iden !== null){
				riga.divRow.addClass("attivo");
				riga.iconInserisci.addClass("iconadisattiva");
				riga.iconModifica.removeClass("iconadisattiva");
				riga.iconModifica.on("click", function(){NS_GESTISCI_CONSENSI.modificaConsenso($(this).attr("data-consenso"))});
				riga.iconVisualizza.removeClass("iconadisattiva");
				riga.iconVisualizza.on("click", function(){NS_GESTISCI_CONSENSI.visualizzaConsenso($(this).attr("data-consenso"), iden)});
				NS_GESTISCI_CONSENSI.setMenuAllega(riga.iconAllegato, value, iden);
				
				riga.iconInfo.removeClass("iconadisattiva");
				riga.iconInfo.on("click", function(){NS_GESTISCI_CONSENSI.showInfoConsenso(param)});
				if(/\bSUPERUSER\b/i.test(LIB.getParamUserGlobal('GRUPPO_PERMESSI', ''))){
					riga.iconCancella.removeClass("iconadisattiva");
					riga.iconCancella.on("click", function(){NS_GESTISCI_CONSENSI.confermaCancellazioneConsenso(iden)});
				}else{
					riga.iconCancella.addClass("iconadisattiva");
				}
			}else{
				riga.divRow.removeClass("attivo");
				riga.iconInserisci.removeClass("iconadisattiva");
				riga.iconInserisci.on("click", function(){NS_GESTISCI_CONSENSI.apriConsenso($(this).attr("data-consenso"))});
				riga.iconModifica.addClass("iconadisattiva");
				riga.iconVisualizza.addClass("iconadisattiva");
				riga.iconAllegato.addClass("iconadisattiva");
				
				riga.iconInfo.addClass("iconadisattiva");
				riga.iconCancella.addClass("iconadisattiva");
			}
		}
    },
    
    setMenuAllega: function(iconAllegato, value, idenConsenso) {
    	
    	iconAllegato.removeClass("iconadisattiva");
		var allegato = home.NS_FENIX_PIC.search.allegato(idenConsenso);
		var idenAllegato = allegato.IDEN;
    	
    	menuAllega.menu.structure.list = [
			{
				"id"		: idenConsenso,
				"concealing": "true",
				"link"		:  function(){NS_GESTISCI_CONSENSI.allegaConsenso($(this))},
				"enable"	: "S",
				"url_image"	: './img/CMenu/aggiungi.png',
				"where"		: function(){return (!(NS_GESTISCI_CONSENSI.deceduto));},
				"output"	: '\"Allega al Modulo di Consenso\"',
				"separator"	: "false"
			},
			{
				"id"		: idenConsenso,
				"concealing": "true",
				"link"		:  function(){NS_GESTISCI_CONSENSI.visualizzaAllegato($(this))},
				"enable"	: "S",
				"url_image"	: './img/CMenu/anteprima.png',
				"where"		: function(){return (allegato !== '' ? true: false);},
				"output"	: '\"Visualizza Allegato\"',
				"separator"	: "false"
			},
			{
				"allegato"	: idenAllegato,
				"id"		: idenConsenso,
				"concealing": "true",
				"link"		:  function(){NS_GESTISCI_CONSENSI.confermaCancellazioneAllegato($(this))},
				"enable"	: "S",
				"url_image"	: './img/CMenu/anteprima.png',
				"where"		: function(){return (allegato !== '' && !(NS_GESTISCI_CONSENSI.deceduto));},
				"output"	: '\"Cancella Allegato\"',
				"separator"	: "false"
			}
		]
    	
    	$alleg[value] = $("[data-consenso ='" + value + "'] .icon-print").contextMenu(menuAllega,{openSubMenuEvent: "click", openInfoEvent: "click"});
    	
    	iconAllegato.on("click",function(e){
    		
			e.preventDefault();
			e.stopImmediatePropagation();
			NS_GESTISCI_CONSENSI.closeContextMenu();
			$alleg[value].test(e, this);
		});
    },
    
    addItemMenuStampa: function(label, funzione) {
		
		var item =
			{
				"id"		: funzione,
				"concealing": "true",
				"link"		:  function(){NS_GESTISCI_CONSENSI.stampaModulo($(this))},
				"enable"	: "S",
				"url_image"	: './img/CMenu/printer.png',
				"where"		: function(){ return  true; },
				"output"	: '\"' + label + '\"',
				"separator"	: "false"
			};
		menuStampa.menu.structure.list.push(item);    	
    },
    
    apriConsenso: function(key_legame, action) {
    	
    	action = LIB.isValid(action) ? action : 'INSERISCI';
    	
    	if(key_legame === "CAREGIVER_PAZIENTE"){
    		key_legame = "CAREGIVER";
    	}

        var data_nascita = $("#DATA_NASCITA").val();

        var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/' + key_legame;
        url += '&TIPO_CONSENSO=' 		+ key_legame;
        url += '&ACTION=' 				+ action;
        url += '&ASSIGNING_AUTHORITY=' 	+ NS_GESTISCI_CONSENSI.assigning_authority;
        url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
        url += '&PATIENT_ID=' 			+ $("#PATIENT_ID").val();
        url += '&TESSERA_SANITARIA=' 	+ $("#TESSERA_SANITARIA").val();
        url += '&CODICE_FISCALE=' 		+ $("#CODICE_FISCALE").val();
        url += '&COGNOME=' 				+ $("#COGNOME").val();
        url += '&COMUNE_NASCITA=' 		+ $("#COMUNE_NASCITA").val();
        url += '&COMUNE_RESIDENZA=' 	+ $("#COMUNE_RESIDENZA").val();
		url += '&INDIRIZZO=' 			+ $("#INDIRIZZO").val();
        url += '&DATA_NASCITA=' 		+ data_nascita;
        url += '&NOME=' 				+ $("#NOME").val();
        url += '&COM_NASC=' 			+ $("#COM_NASC").val();
        url += '&SESSO=' 				+ $("#SESSO").val();
        url += '&LOGOUT_ON_CLOSE=N';

        home.NS_FENIX_TOP.apriPagina({url:encodeURI(url),fullscreen:true});
    },
    
    modificaConsenso: function(key_legame) {
    	NS_GESTISCI_CONSENSI.apriConsenso(key_legame);
    },
    
    confermaCancellazioneConsenso: function(iden) {
    	var params = {
	            "title"	: "Attenzione",
	            "msg"	: "Procedere con la cancellazione del consenso?",
	            "cbkSi"	: function(){ NS_GESTISCI_CONSENSI.cancellaConsenso(iden, null); }
	        }
		home.DIALOG.si_no(params);
    },
    
    cancellaConsenso: function(idenConsenso, idenRevoca){
		
    	NS_GESTISCI_CONSENSI.db.call_function(
				{
					id: 'CANCELLA_CONSENSO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"p_iden_consenso" 	: {v: idenConsenso, 				t: 'N'},
						"p_user_iden_per" 	: {v: $("#USER_IDEN_PER").val(), 	t: 'N'}
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Cancellato il consenso desiderato",
						'timeout'	: 5
					});
					var idenAttivo = resp.p_result.substr(2, resp.p_result.length);
					
					/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
					NS_FUNCTIONS.traceCancellaConsenso($("#PATIENT_ID").val(), idenConsenso);
					
			        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio": idenAttivo, "tabellaModulo": "PIC_MODULI_CONSENSO"}]);

					if (LIB.isValid(idenRevoca)) {
						NS_GESTISCI_CONSENSI.cancellaConsenso(idenRevoca, null);
					}else{
						NS_GESTISCI_CONSENSI.getConsensiEsistenti();
					}
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Impossibile cancellare il consenso desiderato",
						'timeout'	: 5
					});
				}
			}
		);
	},
	
	showInfoConsenso: function(params){
        
		var frm = $(document.createElement('form'))
			.attr({"id": "frmDialog"})
			.append(
					$("<table/>", {"class":"tableInfoConsenso", "id": "tableInfoConsenso"}).css({"width": "100%"})
			);

		$.dialog(frm, {
			'id'			: 'dialogWk',
			'title'			: 'Dettaglio',
			'showBtnClose'	: false,
			'created'		: function () { $('.dialog').focus(); },
			'width'			: 500,
            "buttons": [
	            {"label": "Chiudi", "action": function (){
	                    $.dialog.hide();
	                }
	            }]
		});
		
		NS_GESTISCI_CONSENSI.buildRow($("#tableInfoConsenso"), "DATA DICHIARAZIONE", params.data_dichiarazione);
		NS_GESTISCI_CONSENSI.buildRow($("#tableInfoConsenso"), "UTENTE DICHIARAZIONE", params.utente_dichiarazione);
		NS_GESTISCI_CONSENSI.buildRow($("#tableInfoConsenso"), "DATA INSERIMENTO", params.data_inserimento);
		NS_GESTISCI_CONSENSI.buildRow($("#tableInfoConsenso"), "UTENTE INSERIMENTO", params.utente_inserimento);
	},
	
	buildRow: function(table, label, descr) {
		
		descr = (descr !== null) ? descr : ''; 
		
		table.append($("<tr/>", {"class":"headColumns", "style":"border-bottom: 1px solid;"})
			.append($("<td/>",{"width": "30%"})
				.append( $('<div>',{"style":"text-align:right; padding-right:2px; background-color:#dddddd; font-weight:bold;"}).text(label) )
			)
			.append($("<td/>",{"width": "70%"})
				.append( $('<div>',{"style":"text-align:left; padding-left:2px; background-color:white;"}).text(descr) )
			)
		)
	},

	versioniConsenso: function(tipo_consenso){

        var url = 'page?KEY_LEGAME=' 	+ 'VERSIONI_CONSENSO_UNICO';
        url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
        url += '&PATIENT_ID=' 			+ $("#PATIENT_ID").val();
        url += '&TIPO_CONSENSO=' 		+ tipo_consenso;
        url += '&LOGOUT_ON_CLOSE=N';

        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
	},
	
	/* Funzione di ricerca testuale all'interno dei div dei consensi */
	searchText: function() {
		
		var cerca = $("#txtRicerca").val().toUpperCase();

		if(cerca == ''){
			$(".row").show();
			return;
		}
		
		$(".divConsenso").each(function(){
			var testo = $(this).text().toUpperCase();
			var row = $(this).closest(".row");
			if(testo.indexOf(cerca) >= 0){
				row.show();				
			}else{
				row.hide();
			}
		});
	},
    
    processClassDataISO: function(dataISO) {    	
    	var creation_time = dataISO.substr(6,2) + '/' + dataISO.substr(4,2) + '/' + dataISO.substr(0,4);
    	return creation_time;    	
    },
	
	closeContextMenu:function(){
		for (var c in $crono) {
			$crono[c].close();
		}

		for (var z in $alleg) {
			$alleg[z].close();
		}
	},
    
    stampaCaregiver: function() {
    	home.NS_FENIX_PIC.print.stampa_caregiver('1')
    },
    
    stampaModulo: function(obj) {
    	var funzione = obj[0].id;
    	eval(funzione);
    },
    
    /*** viene aperta la scheda del consenso SENZA il tasto 'Salva' ***/
    visualizzaConsenso: function(key_legame) {
    	
    	NS_GESTISCI_CONSENSI.apriConsenso(key_legame, 'VISUALIZZA');
    },
    
    /*** viene aperta l'anteprima di stampa del consenso ***/
    visualizzaConsensoAnteprima: function(tipo_consenso, idenConsenso) {
    	
    	home.NS_FENIX_PIC.print.preview("1", idenConsenso, $("#PATIENT_ID").val(), tipo_consenso, null);
    },

	stampa:{

		vuoto: function(key_legame){
        	home.NS_FENIX_PIC.print.stampa('1', null, null, key_legame, true);
		},

		datiAnagrafici: function(key_legame){
			home.NS_FENIX_PIC.print.stampa("1", null, $("#PATIENT_ID").val(), key_legame, false);
		},

		consensoCompleto: function(key_legame){

			var resp = home.NS_FENIX_PIC.search.consensus($("#PATIENT_ID").val(), key_legame);

            if (resp === '') {

                var $fr = $("<form>").attr("id","noConsensoSaved");
		        $fr.append("<label style='display:block; text-align:center'>" + "Nessun consenso salvato per il paziente selezionato!" + "</label>");
		    	$.dialog($fr,{"width":"400px",
		            "title":'ATTENZIONE',
		            "buttons": [
		                {"label": "OK", "action": function ()
			                {
			                    $.dialog.hide();
			                }
			            }
		            ]
		        });

            } else {

            	if(key_legame === 'CONSENSO_UNICO' && !NS_FUNCTIONS.checkvalueConsensoUnico($("#PATIENT_ID").val())){
            		/*** NON SERVE FARE NULLA ***/
            		return;
				}
                home.NS_FENIX_PIC.print.stampa("1", resp.IDEN, null, key_legame, false);
            }
		}
	},
	
	allegaConsenso: function(obj){
		var idenConsenso = {"IDEN" : obj[0].id};
		var rec = [{"IDEN_ANAGRAFICA": $("#PATIENT_ID").val()}];
      	WK_RICERCA_ANAGRAFICA.allegato.allega(rec, idenConsenso);
	},
    
	visualizzaAllegato: function(obj) {
    	var idenConsenso = obj[0].id;
		window.open("showDocumentoAllegato?IDEN="+idenConsenso);
    },

	confermaCancellazioneAllegato: function(obj){
		var idenConsenso = obj[0].id;
		var idenAllegato = obj[0].allegato;
		var params = {
	            "title"	: "Attenzione",
	            "msg"	: "Procedere con la cancellazione dell'allegato?",
	            "cbkSi"	: function(){NS_GESTISCI_CONSENSI.cancellaAllegato(idenConsenso, idenAllegato);}
	        }
        home.DIALOG.si_no(params);
	},
	
	cancellaAllegato: function(idenConsenso, idenAllegato){
		
		NS_GESTISCI_CONSENSI.db.call_function(
				{
					id: 'CANCELLA_ALLEGATO_CONSENSO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"p_iden_allegato" 	: {v: idenAllegato, t: 'N'},
						"p_iden_consenso" 	: {v: idenConsenso, t: 'N'},
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Cancellato l'allegato desiderato",
						'timeout'	: 5
					});
					NS_GESTISCI_CONSENSI.getConsensiEsistenti();
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Impossibile cancellare l'allegato desiderato",
						'timeout'	: 5
					});
				}
			}
		);
	}
};

$(document).ready(function() {
    try {
    	NS_GESTISCI_CONSENSI.init();
    	NS_GESTISCI_CONSENSI.setEvents();
        home.NS_LOADING.hideLoading();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});