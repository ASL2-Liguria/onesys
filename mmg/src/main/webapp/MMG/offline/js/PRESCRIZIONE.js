$(document).ready(function() {
	
	PRESCRIZIONE.init();
	PRESCRIZIONE.setEvents();
	
	PRESCRIZIONE.triggerEvents();
	
	NS_LOADING.hideLoading();
	
	NS_FENIX_SCHEDA.chiudiScheda = PRESCRIZIONE.chiudi;
	
});

var semaforo_anteprima = $.Deferred();
var semaforo_caricamento_dati = $.Deferred();

var PRESCRIZIONE = {

	db: 'fenixMMG',
	
	istanza: null, /*FARMACI/ACCERTAMENTI*/
	
	objSalvataggio: null,
	
	init: function() {

		$('body').addClass('semi-transparent');
		
		$('#li-tabWorklistEsenzioni').hide();
		$('#li-tabWorklistProblemi').hide();
		
		PRESCRIZIONE.tabPrescrizione		= $("#li-tabPrescrizione");
		PRESCRIZIONE.tabAnteprima			= $('#li-tabAnteprimaRicetta');
		
		if (home.baseUser.GRUPPO_PERMESSI.indexOf("SUPER_ADMIN") < 0) {
			PRESCRIZIONE.tabAnteprima.hide();
		}
		
		PRESCRIZIONE.titolo					= $('#lblTitolo');
		PRESCRIZIONE.tipoRicetta			= $('#radTipoRicetta');
		PRESCRIZIONE.tipoPrescrizione		= $('#TIPO_PRESCRIZIONE');
		PRESCRIZIONE.filtro					= $('#txtFiltro');
		
		PRESCRIZIONE.fieldsetFiltro			= $('#fldFiltro');
		PRESCRIZIONE.fieldsetPrescrizione	= $('#fldSceltaPrescrizione');
		
		PRESCRIZIONE.butChiudi				= $(".butChiudi");
		
		PRESCRIZIONE.createPreview();
		
		ESENZIONE.init();
		
	},
	
	cur_index_anteprima: null,
	
	setEvents: function() {
		
		PRESCRIZIONE.tabPrescrizione.on('click', function() {
			PRESCRIZIONE.cur_index_anteprima = null;
		});
		
		PRESCRIZIONE.tabAnteprima.on('click', function() {

			$("#selezionati ul li.prescrizione").each(function(){
				var t = $(this);
				var indice = t.attr("spacchettamento") + t.attr("contatore");
				if (PRESCRIZIONE.cur_index_anteprima == null || PRESCRIZIONE.cur_index_anteprima != indice) {
					PRESCRIZIONE.initRicetta({
						spacchettamento: t.attr("spacchettamento"),
						contatore: t.attr("contatore")
					});
					PRESCRIZIONE.cur_index_anteprima = indice;
					return false;
				}
			});
		});
		
		PRESCRIZIONE.tipoRicetta.find('input[type="hidden"]') .on('change', PRESCRIZIONE.selezionaTipoRicetta );
		
		PRESCRIZIONE.filtro.on('keydown', function( event ) {
				event.stopPropagation();
				PRESCRIZIONE.istanza.setSearchDefault();
				if( event.keyCode == '13' ) {
					if (!PRESCRIZIONE.isFarmaci() && PRESCRIZIONE.filtro.val().indexOf(".") == 0) {
						/*Ricerco profili negli accertamenti se primo carattere e' . */
						PRESCRIZIONE.filtro.val(PRESCRIZIONE.filtro.val().substring(1));
						$("#butRicercaProfili").click();
					} else {
						PRESCRIZIONE.loadWk();
					}
				}
		});
		
		$("#butRicercaDefault").on("click", function() {
			PRESCRIZIONE.istanza.setSearchDefault();
			PRESCRIZIONE.loadWk();
		});
		$("#butRicercaDue").on("click", function() {
			PRESCRIZIONE.istanza.setSearchDue();
			PRESCRIZIONE.loadWk();
		});
		$("#butRicercaTre").on("click", function() {
			PRESCRIZIONE.istanza.setSearchTre();
			PRESCRIZIONE.loadWk();
		});
		$("#butRicercaProfili").on("click", function() {
			PRESCRIZIONE.istanza.tipoWK = 'OFFLINE_PROFILI';
			PRESCRIZIONE.istanza.store = 'PROFILI'; 
			PRESCRIZIONE.loadWk();
		});
		
		$("button.butPrescrivi").on("click", PRESCRIZIONE.prescrivi);
		
		$("#txtQuesito").on("keyup blur", function(event) {
			var max_chars = 240;
			var quesito = $("#txtQuesito").val();
			if (event.type == "blur" && quesito.length > max_chars) {
				home.NOTIFICA.warning({
					'title':	'Attenzione',
					'message':	traduzione.maxLunghezzaQuesito
				});
				quesito = quesito.substring(0,quesito.length-(quesito.length-max_chars));
				$("#txtQuesito").val(quesito);
			}
			$("#lblQuesito").text(traduzione.lblQuesito + " (" + quesito.length + "/" + max_chars + " caratteri)")
		});
		
		$("#txtEsenzione").on("keyup",function(){$(this).val($(this).val().toUpperCase())});
		
		$("#butNuovaRicetta").on("click", function() {
			var last = $("#selezionati ul li:last");
			if (last.hasClass("prescrizione")) {
				PRESCRIZIONE.nuovaRicetta(last.attr("spacchettamento"), (parseInt(last.attr("contatore")) + 1));
			}
		});

	},
	
	triggerEvents: function() {
		/*Default rossa*/
		PRESCRIZIONE.tipoRicetta.find("#radTipoRicetta_R").click();
		
		PRESCRIZIONE.selezionaTipoPrescrizione();
		
		PRESCRIZIONE.setTitle();
	},
	
	setTitle: function() {
		var title = traduzione.lblTitolo;
		PRESCRIZIONE.titolo.text( title + " " + PRESCRIZIONE.istanza.title);
	},
	
	isFarmaci: function() {
		return PRESCRIZIONE.tipoPrescrizione.val() == "FARMACI";
	},
	
	/*
	 * R/B
	 */
	getTipoRicetta: function() {
		return PRESCRIZIONE.tipoRicetta.find('input[type="hidden"]').val();
	},
	
	isStampaSuRossa: function() {
		return PRESCRIZIONE.getTipoRicetta() == "R" || home.NS_PRINT.getTipoStampante("RICETTA_BIANCA") == "STAMPANTE_RICETTA_ROSSA";
	},
	
	selezionaTipoRicetta: function() {
		if (PRESCRIZIONE.isStampaSuRossa()) {
			$('#anteprima').attr( 'src', 'MMG/offline/RicettaRossa.htm' );
		} else {
			$('#anteprima').attr( 'src', 'MMG/offline/RicettaBianca.htm' );
		}
		if (PRESCRIZIONE.getTipoRicetta() == "B") {
			$("#txtQuesito").attr("readonly", "true");
			$("#chkPrestazione").parents("tr:first").hide();
			if (PRESCRIZIONE.isStampaSuRossa()) {
				PRESCRIZIONE.istanza.setAsRicettaBianca();
			}
			$("#txtEsenzione").parents("tr:first").hide();
			$("#radUrgenza").parents("tr:first").hide();
		} else {
			$("#txtQuesito").removeAttr("readonly").val("");
			$("#chkPrestazione").parents("tr:first").show();
			$("#txtEsenzione").parents("tr:first").show();
			if (!PRESCRIZIONE.isFarmaci()) {
				$("#radUrgenza").parents("tr:first").show();
			}
		}
	},
	
	selezionaTipoPrescrizione: function() {
		
		if (PRESCRIZIONE.tipoPrescrizione.val() == "FARMACI") {
			PRESCRIZIONE.istanza = FARMACI;
			$("#butRicercaDefault").text(traduzione.butRicercaFarmaci);
			$("#butRicercaDue").text(traduzione.butRicercaPA);
			$("#butRicercaTre").hide();
			$("#butRicercaProfili").hide();
		} else {
			PRESCRIZIONE.istanza = ACCERTAMENTI;
			$("#butRicercaDefault").text(traduzione.butRicercaAccertamenti);
			$("#butRicercaDue").text(traduzione.butRicercaEsatta);
			$("#butRicercaTre").text(traduzione.butPrescrizioneLibera);
		}
		
		PRESCRIZIONE.createSelectedList();
		
		PRESCRIZIONE.istanza.init();
		
	},
	
	loadWk: function() {
		
		if( PRESCRIZIONE.istanza.tipoWK != 'OFFLINE_PROFILI'){
			if (PRESCRIZIONE.filtro.val().length < 2) {
				home.NOTIFICA.warning({
					'title':	'Attenzione',
					'message':	traduzione.minLunghezzaFiltroRicerca
				});
				return;
			}
		}

		var parameters	= {
			'id':					PRESCRIZIONE.istanza.tipoWK,
			'container':			'worklist',
			'aBind':				[],
			'aVal':					[],
			'loadData':				false,
			'build_callback': {
				'after':	PRESCRIZIONE.getWorklistData
			},
			'type': 'GET'
		};

		$( '#'+ parameters.container + ', #selezionati' ).height( PRESCRIZIONE.getWorklistHeight() );
				
		PRESCRIZIONE.wk = new WK( parameters );
		PRESCRIZIONE.wk.loadWk();
	},
	
	getWorklistHeight: function() {
		var height = $('.contentTabs').innerHeight() - $('.fldCampi').outerHeight(true) - ( $('.fldCampi').length * 45 );
		return height > 350 ? height : 350;
	},
	
	getWorklistData: function() {
		var txtFiltro = PRESCRIZIONE.filtro.val().toUpperCase();
		var filtro;
		var words;
		if (PRESCRIZIONE.istanza.getSearchIndex() == "WORDS") {
			words = txtFiltro.split("\ ");
			filtro = words[0];
		} else {
			words = [txtFiltro];
			filtro = txtFiltro;
		}
		var recordset	= new Array();
		var dataPromise;
		
		PRESCRIZIONE.wk.$wk.find('.clsWkLdg').addClass('forced');
		
		dataPromise = $.indexedDB( PRESCRIZIONE.db ).objectStore( PRESCRIZIONE.istanza.store ).index(PRESCRIZIONE.istanza.getSearchIndex()).each(
					function( record ) {
						var pushable = true;
						if (PRESCRIZIONE.istanza.getSearchIndex() == "WORDS" && words.length > 1) {
							var found = 1;
							for (var x=1; x < words.length; x++) {
								for (var y=0; y < record.value.WORDS.length; y++) {
									if (record.value.WORDS[y].indexOf(words[x]) == 0) {
										found++;
										continue;
									}
								}
							}
							if (found < words.length)
								pushable = false;
						}
						if (pushable) {
							recordset.push( record.value );
						}
						
					}, IDBKeyRange.bound( filtro, filtro + '\uffff' ) );
			
			return dataPromise.done(
				function() {
					
					PRESCRIZIONE.wkJSON = PRESCRIZIONE.getWorklistJSON( recordset );
					
					PRESCRIZIONE.wk.$wk.worklist().data.result = PRESCRIZIONE.wkJSON;
					PRESCRIZIONE.wk.$wk.worklist().grid.populate( PRESCRIZIONE.wkJSON );
					
					PRESCRIZIONE.wk.$wk.find('.clsWkLdg').removeClass('forced');
					
					return recordset;
					
				});
		
	},
	
	getWorklistJSON: function( recordset ) {
		
		var json = { 'page' : {}, 'rows' : [] };
		json.page = { 'total' : 1, 'current' : 1, 'size' : 100 };
		
		for( var i = 0; i < recordset.length; i++ ) {
			var row = new Object();
			for( var key in recordset[i] ) {
				row[key] = recordset[i][key];
			}
			row['N_ROW'] = i;
			json.rows.push( row );
		}
		
		return json;
	},
	
	createSelectedList: function() {
		var ul = $( document.createElement('ul') ).addClass('data-list');
		var no_rows = $( document.createElement('li') ).attr( 'id', 'no-rows' );
		no_rows.html( 'Non ci sono <strong>' + ( PRESCRIZIONE.tipoPrescrizione.val().toLowerCase() ) + '</strong> selezionati' );
		$('#selezionati').empty().append( ul.append( no_rows ) );
	},
	
	addToList: function( record , riprescrizione) {

		if (typeof riprescrizione == "undefined") {
			riprescrizione = false;
		}
		
		var item = $( document.createElement('li') );
		item.addClass("prescrizione");
		
		/*
		 * Codice farmaco o accertamento
		 */
		item.attr("codice", PRESCRIZIONE.istanza.getCodice(record, riprescrizione));
		
		/*
		 * Esenzione
		 */
		if (LIB.isValid(record.COD_ESENZIONE) && record.COD_ESENZIONE != "") {
			ESENZIONE.set(record.COD_ESENZIONE);
		}

		/*
		 * Cancella riga
		 */
		var icon = $("<i class='icon-cancel-circled'></i>");
		icon.on("click", function(){
			try {
				var par = $(this).parent("li");
				if (par.prev("li.nuova_ricetta").length == 1 && par.next("li.prescrizione").length == 0 ) {
					/*unico elemento di questa ricetta*/
					par.prev("li.nuova_ricetta").remove();
					/*
					$("#selezionati li.nuova_ricetta").each(function(cnt) {
						$(this).text("Ricetta " + (cnt+2));
						cnt++;
					});
					*/
				}
				par.remove();
			} catch (e) {
				console.log(e);
			}
			return false;
		});
		item.append(icon);
		
		/*
		 * Descrizione
		 */
		var descrizione = $(document.createElement('input')).addClass("descrizione");
		if (riprescrizione) {
			PRESCRIZIONE.istanza.setDescrizioneRiprescrizione(descrizione, record);
		} else {
			descrizione.val(record['DESCRIZIONE']);
		}
		item.append(descrizione);
		
		/*
		 * Numero/confezioni
		 */
		var numero = $( document.createElement('input') );
		numero.attr({
			'class': 'numero', 
			'placeholder':	PRESCRIZIONE.istanza.placeholder_numero
		});
		if (riprescrizione) {
			numero.val(record.QUANTITA);
		} else {
			numero.val("1");
		}
		numero.on("keyup", function() {
			if (isNaN(numero.val())) {
				numero.val("1");
			}
		})
		item.append(numero);
		
		/*
		 * Peculiarita' di farmaci/accertamenti
		 */
		PRESCRIZIONE.istanza.setRow(item, record, riprescrizione);
		
		$('#no-rows').remove();
		
		PRESCRIZIONE.spacchettamentoRicetta(item);
		PRESCRIZIONE.appendPrescrizione(item);
		
		PRESCRIZIONE.filtro.val("");
		PRESCRIZIONE.filtro.focus();
	},
	
	spacchettamentoRicetta: function(item) {
		/*TODO spacchettamento*/
		if (PRESCRIZIONE.getTipoRicetta() =="R") {
			item.attr("spacchettamento","standard");
		} else {
			/*Bianca*/
			item.attr("spacchettamento","standard");
		}
	},
	
	appendPrescrizione: function(item) {
		
		var contatore = 0;
		var ricetta_esistente = false;
		var last = $('#selezionati ul li[spacchettamento="' + item.attr("spacchettamento") +'"]:last');
		if (last.length > 0) {
			contatore = last.attr("contatore");
			if (last.hasClass("nuova_ricetta")) {
				ricetta_esistente = true;
			} else {
				var siblings = last.siblings('.prescrizione[spacchettamento="' + last.attr("spacchettamento") +'"][contatore="' + last.attr("contatore") + '"]');
				var quantita_elementi = 1 + siblings.length;
				var quantita_totale = parseInt(last.find("input.numero").val());
				siblings.each(function() {
					quantita_totale += parseInt($(this).find("input.numero").val());
				});
				if (
						quantita_elementi % PRESCRIZIONE.istanza.spacchettamento[item.attr("spacchettamento")].max_elementi != 0
						&&
						quantita_totale % PRESCRIZIONE.istanza.spacchettamento[item.attr("spacchettamento")].max_totale != 0
					) {
					ricetta_esistente = true;
				}
			}
		}
		if (ricetta_esistente) {
			item.attr("contatore", contatore);
			$('#selezionati li[spacchettamento="' + item.attr("spacchettamento") +'"][contatore="' + contatore + '"]:last').after(item);
		} else {
			item.attr("contatore", parseInt(contatore) + 1);
			if ($("#selezionati li.prescrizione").length > 0) {
				var nome_ricetta = PRESCRIZIONE.nuovaRicetta(item.attr("spacchettamento"), item.attr("contatore"));
				home.NOTIFICA.info({
					'title':	'Nuova ricetta',
					'message':	nome_ricetta
				});
			}
			$('#selezionati ul').append( item );
		}
	},
	
	nuovaRicetta:function(spacchettamento, contatore) {
		var item = $( document.createElement('li') );
		item.addClass("nuova_ricetta");
		item.attr("spacchettamento", spacchettamento);
		item.attr("contatore", contatore);
		var nome_ricetta = "Ricetta " + spacchettamento + " " + contatore;
		item.text(nome_ricetta);
		$('#selezionati ul').append( item );
		return nome_ricetta;
	},
	
	createPreview: function() {
		
		var iframe;
		
		if( $('#anteprima').length == 0 ){
			iframe = $( document.createElement('iframe') ).attr('id', 'anteprima').css( PRESCRIZIONE.getPreviewDimensions() );
			$('#tabAnteprimaRicetta').append( iframe );
		} else {
			iframe = $('#anteprima');
		}
		
	},
	
	getPreviewDimensions: function() {
		return { 'width': $('.contentTabs').innerWidth() - 10, 'height' : $('.contentTabs').innerHeight() - 10 };
	},
	
	/*
	 * param: spacchettamento, contatore, semaforo
	 */
	initRicetta: function(param) {

		PRESCRIZIONE.istanza.initOggettoSalvataggio(param);
		
		$.when(semaforo_anteprima).then(function(){
			var semaforo_firma;
			if (PRESCRIZIONE.isStampaSuRossa()) {
				semaforo_firma = PRESCRIZIONE.initRicettaRossa();
				PRESCRIZIONE.istanza.initRicettaRossa();
			} else {
				semaforo_firma = PRESCRIZIONE.initRicettaBianca();
				PRESCRIZIONE.istanza.initRicettaBianca();
			}
			$.when(semaforo_firma).then(function() {
				semaforo_caricamento_dati.resolve();
			});
		});
	},
	
	removeRicetta: function(param) {
		$('#selezionati ul li.prescrizione[spacchettamento="' + param.spacchettamento + '"][contatore="' + param.contatore +'"]').remove();
	},
	
	initRicettaRossa: function() {
		
		var RICETTA = PRESCRIZIONE.getAnteprima().RICETTA;
		RICETTA.setPaziente(home_offline.ASSISTITO.COGN + " " + home_offline.ASSISTITO.NOME);
		if (LIB.isValid(home_offline.ASSISTITO.RICETTA_INDIRIZZO)) {
			RICETTA.setResidenza(home_offline.ASSISTITO.RICETTA_INDIRIZZO);
		} else {
			RICETTA.setResidenza(home_offline.ASSISTITO.RES_INDIRIZZO + " " + home_offline.ASSISTITO.COMUNE);
		}
		RICETTA.setCodiceFiscale(home_offline.ASSISTITO.COD_FISC);
		
		if (LIB.isValid(home_offline.ASSISTITO.RICETTA_PROV_ASL)) {
			RICETTA.setProvinciaAsl(home_offline.ASSISTITO.RICETTA_PROV_ASL);
		} else {
			RICETTA.setProvinciaAsl(home_offline.ASSISTITO.PROVINCIA + home_offline.ASSISTITO.ASL);
		}
		
		RICETTA.setDataRicetta(moment(new Date()).format("DDMMYY"));
		RICETTA.setStampaPc(true);
		
		RICETTA.setQuesito($("#txtQuesito").val());
		
		var s_r_a = $("#chkPrestazione input").val();
		RICETTA.setSuggerita(s_r_a == "S");
		RICETTA.setRicovero(s_r_a == "R");
		RICETTA.setAltro(s_r_a == "A");
		
		RICETTA.setCodiceEsenzione(ESENZIONE.get().val());
		return PRESCRIZIONE.setFirmaMedico("ROSSA", RICETTA);
	},
	
	initRicettaBianca: function() {
		/*
		 * Eccetera
		 */
		var RICETTA = PRESCRIZIONE.getAnteprima().RICETTA;
		RICETTA.setPaziente(home_offline.ASSISTITO.COGN + " " + home_offline.ASSISTITO.NOME);
		if (LIB.isValid(home_offline.ASSISTITO.RICETTA_INDIRIZZO)) {
			RICETTA.setResidenza(home_offline.ASSISTITO.RICETTA_INDIRIZZO);
		} else {
			RICETTA.setResidenza(home_offline.ASSISTITO.RES_INDIRIZZO + " " + home_offline.ASSISTITO.COMUNE);
		}
		RICETTA.setCodiceFiscale(home_offline.ASSISTITO.COD_FISC);
		
		RICETTA.setDataRicetta(moment(new Date()).format("DD/MM/YYYY"));
		RICETTA.setSesso(home_offline.ASSISTITO.SESSO);
		
		var ritorno = home_offline.NS_OFFLINE.TABLE.PERSONALE.index('IDEN_PER').get(home_offline.MEDICO.getMedPrescr());
		ritorno.done(function(data){
			RICETTA.setMedico(data.DESCRIZIONE);
		});
		
		return PRESCRIZIONE.setFirmaMedico("BIANCA", RICETTA);
	},
	
	getAnteprima: function() {
		return document.getElementById("anteprima").contentWindow;
	},
	
	setFirmaMedico: function(tipo_ricetta, RICETTA) {
		var parametri = {
				ROSSA : "RICETTA_FIRMA_MEDICO",
				BIANCA: "RICETTA_BIANCA_FIRMA_MEDICO"
		};
		var ritorno = home_offline.NS_OFFLINE.TABLE.PERSONALE.index('IDEN_PER').get(home_offline.MEDICO.getMedPrescr());
		ritorno.done(function(data){
			RICETTA.setFirmaMedico(data[parametri[tipo_ricetta]]);
		});
		return ritorno;
	},
	
	prescrivi: function() {
		PRESCRIZIONE.prescriviOpt("S");
	},
	
	prescriviOpt: function(stampa) {
		
		if ($("#selezionati li.prescrizione").length == 0) {
			home.NOTIFICA.warning({
					'title':	'Attenzione',
					'message':	traduzione.prescrivereAlmenoUno
			});
			return;
		}
		
		if (!LIB.isValid(home_offline.MEDICO.getMedPrescr())) {
			home.NOTIFICA.warning({
					'title':	'Attenzione',
					'message':	traduzione.selezionareMedicoPrescrittore
			});
			home_offline.MEDICO.showMedPrescr();
			return;
		}
		
		if (PRESCRIZIONE.tipoPrescrizione.val()=="ACCERTAMENTI" && PRESCRIZIONE.getTipoRicetta() == "R" && $("#txtQuesito").val().length == 0) {
			home.NOTIFICA.warning({
					'title':	'Attenzione',
					'message':	traduzione.compilaQuesito
			});
			return;
		}
		
		var prescrizioni = {};
		
		$("#selezionati ul li.prescrizione").each(function(){
			var t = $(this);
			var indice = t.attr("spacchettamento") + t.attr("contatore");
			if (typeof prescrizioni[indice] == "undefined") {
				prescrizioni[indice]= {
					spacchettamento: t.attr("spacchettamento"),
					contatore: t.attr("contatore")
				};
			}
		});
		
		$.when(PRESCRIZIONE.ciclaPrescrizioni(prescrizioni, stampa)).then(function() {
			$.when(home_offline.NS_OFFLINE.updateAssistito()).then(function() {
				/*Tapullo, altrimenti non salva. Ovviamente non ho la minima idea del perche'.*/
				home_offline.NS_OFFLINE.updateAssistito({
					if_ok: function() {
						PRESCRIZIONE.istanza.refreshWorklistPaziente();
						PRESCRIZIONE.butChiudi.click();
					}
				});
			});
		});
	},
	
	ciclaPrescrizioni: function(prescrizioni, stampa) {
		var semaforo = $.Deferred().resolve();
		for (var p in prescrizioni) {
			prescrizioni[p].semaforo = semaforo;
			semaforo = PRESCRIZIONE.prescriviSingola(stampa, prescrizioni[p]);
		}
		return semaforo;
	},
	
	prescriviSingola: function(stampa, param) {
		
		var semaforoPrescrizione = $.Deferred();
		
		$.when(param.semaforo).then(function(){
			/*rendering*/
			PRESCRIZIONE.initRicetta(param);
			
			/*Richiesto da IE*/
			PRESCRIZIONE.tabAnteprima.click();
			var initial_height = $("#anteprima").height();
			var initial_width = $("#anteprima").width();
			$("#anteprima").height(1);
			$("#anteprima").width(1);
			/*/Richiesto da IE*/
			
			if (typeof stampa == "undefined") {
				stampa = "S";
			}
			if (stampa == "S") {
				PRESCRIZIONE.print({
					if_ok: function() {
						home_offline.NS_OFFLINE.accodaEvento("RICETTA",{ricetta:PRESCRIZIONE.objSalvataggio},function(result){
							PRESCRIZIONE.istanza.salvaOggettoOffline(result);
							PRESCRIZIONE.removeRicetta(param);
							semaforoPrescrizione.resolve();
						});
					},
					if_ko: function() {
						home.NOTIFICA.error({
							'title':	'Errore',
							'message':	"Errore in fase di stampa"
						});
						/*Richiesto da IE*/
						PRESCRIZIONE.tabPrescrizione.click();
						$("#anteprima").height(initial_height);
						$("#anteprima").width(initial_width);
						/*/Richiesto da IE*/
					}
				});
				
			} else {
				/*TODO che faccio?*/
			}
		});
		
		return semaforoPrescrizione;
	},
	
	print: function(callbacks) {
		var stampante;
		var opzioni;
		home.NS_PRINT.init({});
		if (PRESCRIZIONE.isStampaSuRossa()) {
			stampante = home.NS_PRINT.getStampante("STAMPANTE_RICETTA_ROSSA");
			opzioni = home.NS_PRINT.getOpzioni("STAMPANTE_RICETTA_ROSSA");
		} else {
			stampante = home.NS_PRINT.getStampante("STAMPANTE_RICETTA_BIANCA");
			opzioni = home.NS_PRINT.getOpzioni("STAMPANTE_RICETTA_BIANCA");
		}
		$.when(semaforo_anteprima, semaforo_caricamento_dati).then(function() {
			PRESCRIZIONE.getAnteprima().RENDER.print(function(dataurl){
				home.AppStampa.setSrcFromDataUrl(dataurl);
				if (home.AppStampa.print(stampante, opzioni)) {
					callbacks.if_ok();
				} else {
					callbacks.if_ko();
				};
				/*ricarico la ricetta cosi' torna alla dimensione originaria*/
				PRESCRIZIONE.resetAnteprima();
			}, stampante, opzioni);
		});
	},
	
	resetAnteprima: function() {
		$('#anteprima').attr("src",$('#anteprima').attr("src"));
		semaforo_anteprima = $.Deferred();
		semaforo_caricamento_dati = $.Deferred();
	},
	
	initOggettoSalvataggio: function(param) {

		var s_r_a = $("#chkPrestazione input").val();
		
		PRESCRIZIONE.objSalvataggio = {
				INVIO_PACKAGE	: "S",
				iden_anag		: home_offline.ASSISTITO.IDEN_ANAG,
				iden_utente		: home_offline.baseUser.IDEN_PER,
				iden_med_base	: home_offline.ASSISTITO.IDEN_MED_BASE,
				iden_med_prescr : home_offline.MEDICO.getMedPrescr(),
				note			: '',
				diagnosi		: he.encode($("#txtQuesito").val()),
				iden_accesso	: '',
				ricovero		: (s_r_a == "R") ? "S" : 'N',
				suggerita		: (s_r_a == "S") ? "S" : 'N',
				altro			: (s_r_a == "A") ? "S" : 'N',
				regime			: '' /*TODO*/,
				data_ricetta	: moment().format('YYYYMMDDHHmm')
		};
		
	}
	
};

var FARMACI = {
		
		store: "FARMACI",
		tipoWK: "OFFLINE_FARMACI",
		
		spacchettamento: {
			standard: {
				max_elementi: 2,
				max_totale: 6
			}
		},
		
		title: "FARMACI",
		placeholder_numero: "Confezioni",
		
		_search_index: "DESCRIZIONE",
		
		setSearchDefault: function() {
			FARMACI._search_index = "DESCRIZIONE";
		},
		
		setSearchDue: function() {
			FARMACI._search_index = "PRINCIPIO_ATTIVO";
		},
		
		setSearchTre: function() {
			/*Non usato*/
		},
		
		getSearchIndex: function() {
			return FARMACI._search_index;
		},
		
		init: function() {
			$("#radUrgenza").parents("tr:first").hide();
			
			var idx_farmaci = $("#IDX_FARMACI");
			
			if (idx_farmaci.length > 0) {
				var riprescrivi = idx_farmaci.val().split(",");
				for (var i = 0; i < riprescrivi.length; i++) {
					var ricetta = home_offline.ASSISTITO.RICETTE_FARMACI[riprescrivi[i]];
					PRESCRIZIONE.addToList(ricetta, true);
				}
			}
		},
		
		setRow: function(item, record, riprescrizione) {
			
			var chk_posologia = $( document.createElement('div')).text('S.P.').attr({"id" : "chk_posologia","title" : "Stampa posologia"}).addClass("offline_button").on("click", function() {
				var pos = $(this);
				if (pos.hasClass("offline_button_selected")) {
					NS_OFFLINE_ALL.buttonDeselect(pos);
				} else {
					NS_OFFLINE_ALL.buttonSelect(pos);
				};
			});
			
			item.append(chk_posologia);
			
			/*
			 * Posologia
			 */
			var  posologia = $( document.createElement('input') );
			posologia.attr({
				'placeholder':	'Posologia' 
			});
			posologia.addClass("posologia");
			
			$.ui.autocomplete({
					delay: 500,
					minLength: 1,
				    select: function(event, ui) {
				        $(this).attr("codice", ui.item.value);
				        $(this).val(ui.item.label);
				        return false;
				    },
					source: function(request, response) {
						var posologie = new Array();
						var x = home_offline.NS_OFFLINE.TABLE.POSOLOGIE.index("DESCRIZIONE").each(function(record){
							posologie.push({
								label: record.value.DESCRIZIONE,
								value: record.value.CODICE
							});
						}, IDBKeyRange.bound( request.term.toUpperCase(), request.term.toUpperCase() + '\uffff' ));
						$.when(x).then(function(){
							response(posologie);
						});
					},
					messages: {
						noResults: "",
						results: function(){}
					}
				},
				posologia
			);
			
			item.append(posologia);
			
			var note_cuf = $(document.createElement("span")).addClass("nota_cuf");
			item.append(note_cuf);
			
			item.attr("principio_attivo", record.PRINCIPIO_ATTIVO);
			
			if (riprescrizione) {
				item.attr("cod_pa", record.COD_PA);
				item.attr("concedibilita", record.CONCEDIBILITA);
				item.attr("cronicita", record.CRONICITA);
				posologia.attr("codice", record.COD_POSOLOGIA);
				if (LIB.isValid(record.COD_POSOLOGIA) && record.COD_POSOLOGIA != "") {
					home_offline.NS_OFFLINE.TABLE.POSOLOGIE.index("CODICE").get(record.COD_POSOLOGIA).done(function(data){
						posologia.val(data.DESCRIZIONE);
					});
				}
				var dbp = home_offline.NS_OFFLINE.TABLE.FARMACI.index("COD_FARMACO").each(function(data){
					FARMACI.setNoteCuf(note_cuf, data.value);
				}, IDBKeyRange.only(record.COD_FARMACO));
				$.when(dbp).then(function(){
					note_cuf.find("div:contains(" + record.NOTA_CUF + ")").click();
				});
			} else {
				item.attr("concedibilita", record.CONCEDIBILE_SSN);
				item.attr("cod_pa", record.CODICE_PRINCIPIO_ATTIVO);
				FARMACI.setNoteCuf(note_cuf, record);
				note_cuf.find("div:first-child").click();
			}
		},
		
		setNoteCuf: function(note_cuf, record) {
			if (LIB.isValid(record.NOTA_CUF_1) && record.NOTA_CUF_1 != "") {
				var nota_cuf_1 = $( document.createElement('div')).text('NOTA '+record.NOTA_CUF_1).addClass("offline_button");
				nota_cuf_1.attr("nota", record.NOTA_CUF_1);
				note_cuf.append(nota_cuf_1);
			}
			if (LIB.isValid(record.NOTA_CUF_2) && record.NOTA_CUF_2 != "") {
				var nota_cuf_2 = $( document.createElement('div')).text('NOTA '+record.NOTA_CUF_2).addClass("offline_button");
				nota_cuf_2.attr("nota", record.NOTA_CUF_2);
				note_cuf.append(nota_cuf_2);
			}
			note_cuf.children().on("click", function() {
				var nota = $(this);
				if (nota.hasClass("offline_button_selected")) {
					NS_OFFLINE_ALL.buttonDeselect(nota);
				} else {
					NS_OFFLINE_ALL.buttonDeselect(note_cuf.children());
					NS_OFFLINE_ALL.buttonSelect(nota);
				}
			});
		},
		
		initRicettaRossa: function() {
			var rif = PRESCRIZIONE.getAnteprima().FARMACI;
			rif.init();
			rif._show_farmaco_originale = (LIB.getParamUserGlobal("SHOW_FARMACO_ORIGINALE","1") == "1");
			for (var i=0; i < PRESCRIZIONE.objSalvataggio.farmaco.length; i++) {
				rif.add(PRESCRIZIONE.objSalvataggio.farmaco[i]);
			};
		},
		
		initRicettaBianca: function() {
			var rif = PRESCRIZIONE.getAnteprima().FARMACI;
			rif.init();
			rif._show_farmaco_originale = (LIB.getParamUserGlobal("SHOW_FARMACO_ORIGINALE","1") == "1");
			for (var i=0; i < PRESCRIZIONE.objSalvataggio.farmaco.length; i++) {
				rif.add(PRESCRIZIONE.objSalvataggio.farmaco[i]);
			};
		},
		
		setAsRicettaBianca: function() {
			$("#txtQuesito").val("ATTENZIONE!! Farmaci non concessi dal SSN");
		},
		
		initOggettoSalvataggio: function(param) {
			PRESCRIZIONE.initOggettoSalvataggio(param);
			
			PRESCRIZIONE.objSalvataggio.tipo_ricetta = 'FARMACI';
			PRESCRIZIONE.objSalvataggio.SHOW_FARMACO_ORIGINALE = LIB.getParamUserGlobal("SHOW_FARMACO_ORIGINALE", "1");
			PRESCRIZIONE.objSalvataggio.farmaco = new Array();

			$('#selezionati li.prescrizione[spacchettamento="' + param.spacchettamento + '"][contatore="' + param.contatore + '"]').each(function() {
				
				var riga = $(this);
				
				var farmaco = new Object();
				farmaco.iden = '';
				farmaco.cod_farmaco = NS_MMG_UTILITY.getAttr(riga, "codice");
				farmaco.data = moment().format('YYYYMMDD');
				farmaco.qta = parseInt(riga.find("input.numero").val());
				farmaco.pa_si_no = "S";
				farmaco.cod_pa = NS_MMG_UTILITY.getAttr(riga, "cod_pa");
				farmaco.sost_si_no = "S";
				farmaco.cronicita = NS_MMG_UTILITY.getAttr(riga, "cronicita");
				farmaco.periodicita = ""; /*TODO*/
				farmaco.temporaneita = ""; /*TODO*/
				farmaco.concedibilita = NS_MMG_UTILITY.getAttr(riga, "concedibilita");
				farmaco.da_stampare = "N";
				farmaco.blocco = "N";
				farmaco.note_cuf = NS_MMG_UTILITY.getAttr(riga.find(".nota_cuf .offline_button_selected"),"nota");
				farmaco.forzatura = PRESCRIZIONE.getTipoRicetta();
				farmaco.onere = ''; /*TODO*/
				farmaco.piano_terapeutico = ''; /*TODO*/
				farmaco.data_ini = '';
				farmaco.data_fine = '';
				farmaco.cod_posologia = NS_MMG_UTILITY.getAttr(riga.find("input.posologia"),"codice");
				farmaco.cod_esenzione = NS_MMG_UTILITY.getAttr(ESENZIONE.get(),"cod_esenzione");
				farmaco.motivo_sost = ""; /*TODO*/
				farmaco.problema = ""; /*TODO*/
				farmaco.codice_raggruppamento = 'OFFLINE'; /*per forzare lo spacchettamento*/
				farmaco.stampa_posologia = riga.find("#chk_posologia").hasClass('offline_button_selected') ? 'S' : 'N';
//				alert(farmaco.cod_esenzione)
				/*
				 * Servono per la pagina html della ricetta
				 */
				farmaco._descrizione = riga.find("input.descrizione").val();
				farmaco._principio_attivo = NS_MMG_UTILITY.getAttr(riga, "principio_attivo");
				farmaco._posologia = riga.find("input.posologia").val();
				if (farmaco.concedibilita == 'N' && (farmaco.cod_esenzione == "G01" || farmaco.cod_esenzione == "G02" || farmaco.cod_esenzione == "V01")) {//TODO  per esenzioni C01 ecc. ecc.
					farmaco._descrizione_extra = " (Legge 203/2000)";
				}
				farmaco._motivo_non_sostituibile = "";
				
				PRESCRIZIONE.objSalvataggio.farmaco.push(farmaco);
			});
		},
		
		salvaOggettoOffline: function(id_evento) {
			var obj = PRESCRIZIONE.objSalvataggio;
			for (var i=0; i < PRESCRIZIONE.objSalvataggio.farmaco.length; i++) {
				var far = PRESCRIZIONE.objSalvataggio.farmaco[i];
				home_offline.ASSISTITO.RICETTE_FARMACI.splice(0,0,{
					id_evento: id_evento,
					BLOCCO: far.blocco,
					CLASSE_FARMACO: "", /*TODO*/
					COD_ESENZIONE: far.cod_esenzione,
					COD_FARMACO: far.cod_farmaco,
					COD_PA: far.cod_pa,
					COD_POSOLOGIA: far.cod_posologia,
					COD_SOST: far.motivo_sost,
					CONCEDIBILITA: far.concedibilita,
					CRONICITA: far.cronicita,
					D: far.data,
					DATA: moment(far.data,'YYYYMMDD').format("DD/MM/YYYY"),
					DATA_FINE: "",
					DATA_INIZIO: "",
					DATA_ISO: far.data,
					DA_STAMPARE: obj.da_stampare,
					DESCR_SOST: far._motivo_non_sostituibile,
					FARMACO: (LIB.isValid(far._principio_attivo) && far._principio_attivo != "" ? "" : far._descrizione),
					FORZATURA: far.forzatura,
					GG_PERIODO: "",
					H: "N",
					IDEN: "O_" + id_evento + "_" + i,
					IDEN_ACCESSO: obj.iden_accesso,
					IDEN_ANAG: obj.iden_anag,
					IDEN_MEDICO: obj.iden_med_prescr,
					IDEN_PROBLEMA: obj.problema,
					IDEN_UTENTE: obj.iden_utente,
					NOTA_CUF: far.note_cuf,
					PA: far.pa_si_no,
					PERIODICITA: far.periodicita,
					PIANO_TERAPEUTICO: far.piano_terapeutico,
					POSOLOGIA: far._posologia,
					PRINCIPIO_ATTIVO: far._principio_attivo,
					QUANTITA: far.qta,
					SOST: far.sost_si_no,
					TEMPORANEITA: far.temporaneita
				});
			}
		},
		
		setDescrizioneRiprescrizione: function(obj, record) {
			if (LIB.isValid(record["FARMACO"]) && record["FARMACO"] != "") {
				obj.val(record["FARMACO"]);
			} else {
				home_offline.NS_OFFLINE.TABLE.FARMACI.index("COD_FARMACO").get(record.COD_FARMACO).done(function(data){
					obj.val(data.DESCRIZIONE);
				});
			}
		},
		
		getCodice: function(record, riprescrizione) {
			return record.COD_FARMACO;
		},
		
		refreshWorklistPaziente: function() {
			home_offline.RIEPILOGO_PAZIENTE.createListRicetteFarmaci();
		}
};

var ACCERTAMENTI = {

		store: "ACCERTAMENTI",
		tipoWK: "OFFLINE_ACCERTAMENTI",
		
		spacchettamento: {
			standard: {
				max_elementi: 8,
				max_totale: 12
			}
		},
		
		title: "ACCERTAMENTI",
		placeholder_numero: "Numero",
		
		_search_index: "DESCRIZIONE",
		
		setSearchDefault: function() {
			/* Nota: in Internet Explorer 10 e 11 non funzionano gli indici multiEntry
			 * Questo controllo non funziona su IE11 ma finche' lo forziamo a IE10 va bene
			 */
			if (LIB.getIEVersion() > -1) {
				ACCERTAMENTI._search_index = "DESCRIZIONE";
			} else {
				ACCERTAMENTI._search_index = "WORDS";
			}
			ACCERTAMENTI.tipoWK = "OFFLINE_ACCERTAMENTI";
			ACCERTAMENTI.store = "ACCERTAMENTI";
		},
		
		setSearchDue: function() {
			ACCERTAMENTI._search_index = "DESCRIZIONE";
			ACCERTAMENTI.tipoWK = "OFFLINE_ACCERTAMENTI";
			ACCERTAMENTI.store = "ACCERTAMENTI";
		},
		
		setSearchTre: function() {
			ACCERTAMENTI._search_index = "CODICE";
			ACCERTAMENTI.tipoWK = "OFFLINE_ACCERTAMENTI";
			ACCERTAMENTI.store = "ACCERTAMENTI";
			PRESCRIZIONE.filtro.val("LIBERA");
		},
		
		getSearchIndex: function() {
			return PRESCRIZIONE.istanza.tipoWK == 'OFFLINE_PROFILI' ? 'DESCRIZIONE' : ACCERTAMENTI._search_index;
		},
		
		init: function(){
			var idx_accertamenti = $("#IDX_ACCERTAMENTI");
			
			if (idx_accertamenti.length > 0) {
				var riprescrivi = idx_accertamenti.val().split(",");
				for (var i = 0; i < riprescrivi.length; i++) {
					var ricetta = home_offline.ASSISTITO.RICETTE_ACCERTAMENTI[riprescrivi[i]];
					PRESCRIZIONE.addToList(ricetta, true);
				}
			}
			if (LIB.getIEVersion() > -1) {
				/*La ricerca all'interno del testo in IE non funziona*/
				$("#butRicercaDefault").hide();
			}
		},
		
		setRow: function(item, record, riprescrizione) {
			
		},
		
		initRicettaRossa: function() {
			var rif = PRESCRIZIONE.getAnteprima().ACCERTAMENTI;
			rif.init();
			for (var i=0; i < PRESCRIZIONE.objSalvataggio.accertamento.length; i++) {
				rif.add(PRESCRIZIONE.objSalvataggio.accertamento[i]);
			};
			rif.setUrgenza(PRESCRIZIONE.objSalvataggio.urgenza);
		},
		
		initRicettaBianca: function() {
			var rif = PRESCRIZIONE.getAnteprima().ACCERTAMENTI;
			rif.init();
			for (var i=0; i < PRESCRIZIONE.objSalvataggio.accertamento.length; i++) {
				rif.add(PRESCRIZIONE.objSalvataggio.accertamento[i]);
			};
		},
		
		setAsRicettaBianca: function() {
			$("#txtQuesito").val("ATTENZIONE!! Prestazioni non concesse dal SSN");
		},
		
		initOggettoSalvataggio: function(param) {
			
			PRESCRIZIONE.initOggettoSalvataggio(param);
			
			PRESCRIZIONE.objSalvataggio.tipo_ricetta = 'ACCERTAMENTI';
			PRESCRIZIONE.objSalvataggio.accertamento = new Array();
			PRESCRIZIONE.objSalvataggio.urgenza = $("#h-radUrgenza").val();
			
			$('#selezionati li.prescrizione[spacchettamento="' + param.spacchettamento + '"][contatore="' + param.contatore + '"]').each(function() {
				var riga = $(this);
			
				var accertamento = new Object();
				accertamento.iden = "";
				accertamento.cod_accertamento = NS_MMG_UTILITY.getAttr(riga, "codice");
				accertamento.accertamento = he.encode(riga.find("input.descrizione").val());
				accertamento.data = moment().format('YYYYMMDD');
				accertamento.qta = parseInt(riga.find(".numero").val());
				accertamento.cod_esenzione = NS_MMG_UTILITY.getAttr(ESENZIONE.get(),"cod_esenzione");
				accertamento.cronicita = ""; /*TODO*/
				accertamento.periodicita = ""; /*TODO*/
				accertamento.temporaneita = ""; /*TODO*/
				accertamento.da_stampare = "N";
				accertamento.urgenza = $("#h-radUrgenza").val();
				accertamento.diagnosi = he.encode($("#txtQuesito").val());
				accertamento.blocco = ""; /*TODO*/
				accertamento.cod_situazione_clinica = "";
				accertamento.risultato = ""; /*TODO*/
				accertamento.problema = ""; /*TODO*/
				accertamento.onere = ""; /*TODO*/
				accertamento.forzatura = PRESCRIZIONE.getTipoRicetta();
				accertamento.codice_raggruppamento = 'OFFLINE'; /*per forzare lo spacchettamento*/
				
				PRESCRIZIONE.objSalvataggio.accertamento.push(accertamento);
			});
			
		},
		
		salvaOggettoOffline: function(id_evento) {
			var obj = PRESCRIZIONE.objSalvataggio;
			for (var i=0; i < obj.accertamento.length; i++) {
				var acc = obj.accertamento[i];
				home_offline.ASSISTITO.RICETTE_ACCERTAMENTI.splice(0,0,{
						id_evento: id_evento,
						ACCERTAMENTO: acc.accertamento,
						ATTIVO: "S",
						BLOCCO: acc.blocco,
						COD_ACCERTAMENTO: acc.cod_accertamento,
						COD_ESENZIONE: acc.cod_esenzione,
						COD_SITUAZIONE_CLINICA: acc.cod_situazione_clinica,
						CRONICITA: acc.cronicita,
						DATA: moment(acc.data,'YYYYMMDD').format("DD/MM/YYYY"),
						DATA_FINE: "",
						DATA_INIZIO: "",
						DATA_INS: "",
						DATA_ISO: acc.data,
						DA_STAMPARE: obj.da_stampare,
						DELETED: "N",
						DIAGNOSI: acc.diagnosi,
						FORZATURA: acc.forzatura,
						DM_COD_ACCERTAMENTO: "",
						GG_PERIODO: "",
						IDEN: "O_" + id_evento + "_" + i,
						IDEN_ACCESSO: obj.iden_accesso,
						IDEN_ANAG: obj.iden_anag,
						IDEN_MEDICO: obj.iden_med_prescr,
						IDEN_PROBLEMA: acc.problema,
						IDEN_UTENTE: obj.iden_utente,
						PAT_SUMMARY: "N",
						PERIODICITA: acc.periodicita,
						QUANTITA: acc.qta,
						TEMPORANEITA: acc.temporaneita,
						URGENZA: acc.urgenza,
				});
			}
		},
		
		setDescrizioneRiprescrizione: function(obj, record) {
			if (LIB.isValid(record["ACCERTAMENTO"]) && record["ACCERTAMENTO"] != "") {
				obj.val(record["ACCERTAMENTO"]);
			} else {
				home_offline.NS_OFFLINE.TABLE.ACCERTAMENTI.index("CODICE").get(record.COD_ACCERTAMENTO).done(function(data){
					obj.val(data.DESCRIZIONE);
				});
			}
		},
		
		getCodice: function(record, riprescrizione) {
			if (riprescrizione) {
				return record.COD_ACCERTAMENTO;
			} else {
				return record.CODICE;
			}
		},
		
		refreshWorklistPaziente: function() {
			home_offline.RIEPILOGO_PAZIENTE.createListRicetteAccertamenti();
		}
		
};


var PROFILI = {
		
		chose: function(riga) {
			$.each(riga.ACCERTAMENTI, function(idx, obj) {
				var accertamento_profilo = new Object();
				accertamento_profilo.CODICE = riga.ACCERTAMENTI[idx].CODICE_PREST;
				accertamento_profilo.DESCRIZIONE = riga.ACCERTAMENTI[idx].DESCRIZIONE;
				PRESCRIZIONE.addToList( accertamento_profilo );
			});
		}
};

var ESENZIONE = {
		
		init: function() {
			
			//setto di default la ricerca tra le esenzioni del paziente
			NS_OFFLINE_ALL.buttonSelect($("#butEsenzioniPaz"));
			
			ESENZIONE.setRicercaPaziente();
			
		
			$("#butEsenzioniPaz").on("click", function() {
				if ($(this).hasClass("offline_button_selected")) {
					NS_OFFLINE_ALL.buttonDeselect($(this));
					NS_OFFLINE_ALL.buttonSelect($("#butEsenzioniTutte"));
					ESENZIONE.setRicercaGlobale();
				} else {
					NS_OFFLINE_ALL.buttonSelect($(this));
					NS_OFFLINE_ALL.buttonDeselect($("#butEsenzioniTutte"));
					ESENZIONE.setRicercaPaziente();
				}
			});
			
			$("#butEsenzioniTutte").on("click", function() {
				if ($(this).hasClass("offline_button_selected")) {
					NS_OFFLINE_ALL.buttonDeselect($(this));
					NS_OFFLINE_ALL.buttonSelect($("#butEsenzioniPaz"));
					ESENZIONE.setRicercaPaziente();
				} else {
					NS_OFFLINE_ALL.buttonSelect($(this));
					NS_OFFLINE_ALL.buttonDeselect($("#butEsenzioniPaz"));
					ESENZIONE.setRicercaGlobale();
				}
			});

		},
		
		get: function() {
			return $("#txtEsenzione");
		},
		
		/*
		 * Se l'esenzione sta venendo valorizzata da un altro thread rinuncio a modificarla (esempio: riprescrizione di piu' farmaci/accertamenti)
		 */
		updating: false,
		
		set: function(esenzione) {
			if (ESENZIONE.updating)
				return;
			ESENZIONE.updating = true;
			if (PRESCRIZIONE.isFarmaci() && esenzione.indexOf("R")!=0 && esenzione!= "TDL01") {
				/* Va valorizzata con COD_FARMA */
				var query_codice = home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("CODICE").each(function(record_esenzione) {
						console.log("esenzione " + esenzione + " per CODICE");
						ESENZIONE.get().attr("cod_esenzione", esenzione);
						ESENZIONE.get().val(record_esenzione.value.COD_FARMA);
						$.when(ESENZIONE.addEsenzioneTotaleFarmaci(ESENZIONE.get())).then(function(){
							ESENZIONE.updating = false;
						});
					},
					IDBKeyRange.only(esenzione)
				);
				$.when(query_codice).then(function() {
					if (ESENZIONE.updating) {
						var query_farma = home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("COD_FARMA").each(function(record_esenzione) {
								console.log("esenzione " + esenzione + " per COD_FARMA");
								ESENZIONE.get().attr("cod_esenzione", record_esenzione.value.CODICE);
								ESENZIONE.get().val(record_esenzione.value.COD_FARMA);
								$.when(ESENZIONE.addEsenzioneTotaleFarmaci(ESENZIONE.get())).then(function(){
									ESENZIONE.updating = false;
								});
							},
							IDBKeyRange.only(esenzione)
						);
						$.when(query_farma).then(function() {
							if (ESENZIONE.updating) {
								console.log("esenzione " + esenzione + " assegnata tale e quale");
								ESENZIONE.get().attr("cod_esenzione", esenzione);
								ESENZIONE.get().val(esenzione);
								ESENZIONE.updating = false;
							}
						});
					}
				});
			} else {
				ESENZIONE.get().attr("cod_esenzione", esenzione);
				ESENZIONE.get().val(esenzione);
				ESENZIONE.updating = false;
			}
		},
		
		esenzioni_paziente: null,
		
		getEsenzioniPaziente: function() {
			if (ESENZIONE.esenzioni_paziente == null) {
				var ese = home_offline.ASSISTITO.ESENZIONI;
				ESENZIONE.esenzioni_paziente = new Array();
				for (var i=0; i<ese.length; i++) {
					ESENZIONE.esenzioni_paziente.push({
						label: ese[i].CODICE_ESENZIONE + " - " + ese[i].DESCR_ESENZIONE,
						value: PRESCRIZIONE.isFarmaci() ? ese[i].CODICE_ESENZIONE_FARMA : ese[i].CODICE_ESENZIONE,
						cod_esenzione: ese[i].CODICE_ESENZIONE
					});
				}
			}
			return ESENZIONE.esenzioni_paziente;
		},

		setRicercaPaziente: function() {
			try{
				ESENZIONE.get().autocomplete("destroy");
			} catch (e) {
				console.log(e);
			}
			var esenzioni = ESENZIONE.getEsenzioniPaziente();
			$.ui.autocomplete({
				    select: ESENZIONE.autocomplete_onselect,
					delay: 500,
					minLength: 0,
					source: esenzioni,
					messages: {
						noResults: "",
						results: function(){}
					},
					change: ESENZIONE.autocomplete_onchange
				},
				ESENZIONE.get()
			);
			ESENZIONE.get().on("click", function() {
				$(this).autocomplete('search', $(this).val());
			});
		},
		
		autocomplete_onselect: function(event, ui) {
	        $(this).attr("cod_esenzione", ui.item.cod_esenzione);
	        $(this).val(ui.item.value);
	        return false;
	    },
	    
	    autocomplete_onchange: function (event, ui) {
	    	if (ui.item) {
	    		ESENZIONE.set(ui.item.cod_esenzione);
	    	} else {
	    		ESENZIONE.set(ESENZIONE.get().val());
	    	}
	    },
		
		esenzioni: null,
		
		setRicercaGlobale: function() {
			ESENZIONE.get().off("click");
			try{
				ESENZIONE.get().autocomplete("destroy");
			} catch (e) {
				console.log(e);
			}
			$.ui.autocomplete({
				
				    select: ESENZIONE.autocomplete_onselect,
				    
					delay: 500,
					minLength: 1,
					source: function(request, response) {
						ESENZIONE.esenzioni = new Array();
						var x = home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("CODICE").each(function(record){
							ESENZIONE.esenzioni.push({
								label: record.value.CODICE + " - " + record.value.DESCRIZIONE,
								value: PRESCRIZIONE.isFarmaci() && record.value.CODICE.indexOf("R")!=0 ? record.value.COD_FARMA : record.value.CODICE,
								cod_esenzione: record.value.CODICE
							});
						}, IDBKeyRange.bound( request.term.toUpperCase(), request.term.toUpperCase() + '\uffff' ));
						$.when(x).then(function(){
							response(ESENZIONE.esenzioni);
						});
					},
					messages: {
						noResults: "",
						results: function(){}
					},
					change: ESENZIONE.autocomplete_onchange
				},
				ESENZIONE.get()
			);
		},
		
		addEsenzioneTotaleFarmaci: function( esenzione ) {
			return home_offline.NS_OFFLINE.TABLE.ESENZIONI.index("CODICE").each(function(record) {
					if (record.value.ESENZIONE == "P") {
						var found = false;
						for (var j=0; j<home_offline.ASSISTITO.ESENZIONI.length && !found; j++) {
							if (ESENZIONE.isTotaleFarmaci(home_offline.ASSISTITO.ESENZIONI[j].CODICE_ESENZIONE_FARMA)) {
								var new_cod_esenzione = esenzione.val() + home_offline.ASSISTITO.ESENZIONI[j].CODICE_ESENZIONE_FARMA;
								esenzione.val(new_cod_esenzione);
								found = true;
							}
						}
					}
				},
				IDBKeyRange.only(NS_MMG_UTILITY.getAttr(esenzione,"cod_esenzione"))
			);
			
		},
		
		isTotaleFarmaci: function(esenzione) {
			var totali = ["E01", "E02", "E03", "E04", "EPF"];
			for (var x=0; x < totali.length; x++) {
				if (esenzione == totali[x])
					return true;
			}
			return false;
		}
		
};