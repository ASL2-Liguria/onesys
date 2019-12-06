$(document).ready(function() {

	ALTRE_STAMPE.init();
	ALTRE_STAMPE.setEvents();
	ALTRE_STAMPE.checkPrivacy();

	$('#txtGiorniPrognosi').trigger('keyup');
	$('#STD').trigger('click');

	NS_FENIX_SCHEDA.beforeSave = ALTRE_STAMPE.beforeSave;
	NS_FENIX_SCHEDA.afterSave = ALTRE_STAMPE.afterSave;
	NS_FENIX_SCHEDA.customizeJson = ALTRE_STAMPE.customizeJSON;
	NS_FENIX_SCHEDA.successSave = ALTRE_STAMPE.successSave;
	NS_FENIX_SCHEDA.beforeClose = ALTRE_STAMPE.beforeClose;

});

var Stampa = 'N';

var ALTRE_STAMPE = {

	init : function() {
		if (LIB.isValid($("#ID_PROBLEMA").val()) && $("#ID_PROBLEMA").val() != "") {
			
			$("#IDEN_PROBLEMA").val($("#ID_PROBLEMA").val());
		}
		
		home.ALTRE_STAMPE = this;
		ALTRE_STAMPE.COD_CERTIFICATO = $("#hCodCertificato").val();
		ALTRE_STAMPE.setTextHeight();

		$("#radTimbroMedico").data('RadioBox').selectByValue('S');
		$("#radIntestazioneMedico").data('RadioBox').selectByValue('S');

		$('#container').append(ALTRE_STAMPE.getTypeBar(),
				ALTRE_STAMPE.getIcons(), ALTRE_STAMPE.getSearchBar());
		$(
				'#txtCognome, #txtNome, #txtCodiceFiscale, #txtLuogoNascita, #txtDataScadenza, #txtIndirizzoResidenza')
				.attr('readOnly', true);

		if (LIB.isValid($('#IDEN').val()))
			ALTRE_STAMPE.loadData();

		ALTRE_STAMPE.initTinyMCE();

		ALTRE_STAMPE.gestButton();

	},

	setEvents : function() {

		$('#li-tabLista').on('click', function() {
			ALTRE_STAMPE.loadWk();
			$(".butSalva, .butSalvaStampa").hide();
		});

		$('#li-tabAltreStampe').on('click', function() {
			$(".butSalva, .butSalvaStampa").show();
			tinyMCE.activeEditor.setContent("");
		});

		$(".butStampa").on('click', function() {

			ALTRE_STAMPE.auxStampa($("#IDEN").val());
		});
		

		$('.typeBar').on(
				'click',
				'div',
				function(event) {

					$('#STD, #NO-STD').removeClass('active');
					$(this).addClass('active');

					ALTRE_STAMPE
							.loadStandardText($(this).attr('id') == 'STD' ? 'S'
									: 'N');

				});

		$('#butImporta').on('click', function(event) {

			var text = '';

			text += home.ASSISTITO.SESSO == 'M' ? 'Il Sig. ' : 'La Sig.ra ';
			text += '<nome> <cognome> ';
			text += home.ASSISTITO.SESSO == 'M' ? 'nato il ' : 'nata il ';
			text += $('#txtDataDiNascita').val();
			text += ' a ' + $('#txtLuogoNascita').val();
			text += ' e residente a ' + $('#txtIndirizzoResidenza').val();

			ALTRE_STAMPE.setText(text);

		});

		$('#txtGiorniPrognosi').on(
				'keyup',
				function() {

					var gg = $(this).val();
					if (!isNaN(gg)) {
						$('#txtDataScadenza').val(
								ALTRE_STAMPE.getExpirationDate(gg));
						$("#h-txtDataScadenza").val(
								moment().add('days', gg).format('YYYYMMDD'));
					} else
						home.NOTIFICA.warning({
							'title' : 'Attenzione',
							'message' : traduzione.numeroIntero,
							'timeout' : 5
						});

				});

		$('#container').on(
				'keyup',
				'#search',
				function() {

					var value = $(this).val().toUpperCase();

					if (value.length < 3)
						$('#list').find('li').show();
					else {

						$('#list').find('li').hide().filter(
								':contains(' + value + ')').show();

					}

				});

		$('#container').on(
				'click',
				'.search-filter',
				function() {

					var value = $(this).attr('data-value');

					$('.search-container').hide();
					$('#list').find('li').hide().filter(
							'[data-type=' + value + ']').show();

				});

		$('.butSalvaStampa').on('click', function() {

			Stampa = 'S';
			NS_FENIX_SCHEDA.registra({
				close : false
			});

		});

	},

	checkPrivacy:function(){
		
		NS_MMG_UTILITY.checkPermessoSpecialista([]);
	},

	auxStampa : function(idenCertificato) {
		
		home.$.dialog(traduzione.lblDialogFormato, {
			'title' 			: traduzione.titleFormato,
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			'movable'			: true,
			buttons : [ {
				label : traduzione.lblA4,
				action : function() {
					ALTRE_STAMPE.stampa(idenCertificato, 'A4');
					home.$.dialog.hide();
				}
			}, {
				label : traduzione.lblA5,
				action : function() {
					ALTRE_STAMPE.stampa(idenCertificato, 'A5');
					home.$.dialog.hide();
				}
			}, {
				label : traduzione.lblAnnulla,
				action : function() {
					home.$.dialog.hide();
				}
			} ]
		});

	},

	gestButton : function() {

		$(".butSalva").removeClass("butVerde");
		$(".butSalvaStampa").addClass("butVerde");

		if (!LIB.isValid($("#IDEN").val())) {
			$(".butStampa").hide();
		}

	},

	initTinyMCE : function() {

		tinymce.init({
			selector 		: 'textarea',
			mode 			: 'exact',
			plugins 		: '',
			menubar 		: false,
			resize 			: true,
			style_formats 	: 
			[ {
				title 	: 'Paragraph',
				format 	: 'p'
			} ],
			statusbar 		: true
		});

	},

	loadWk : function() {

		var parameters = {
			'id' : 'ALTRE_STAMPE',
			'aBind' : [ 'iden_per', 'iden_anag' ],
			'aVal' : [ home.baseUser.IDEN_PER, $("#IDEN_ANAG").val() ]
		};

		if (!LIB.isValid(ALTRE_STAMPE.wk)) {

			var height = $('.contentTabs').innerHeight() - 50;
			$('#divWk').height(height);

			ALTRE_STAMPE.wk = new WK(parameters);
			ALTRE_STAMPE.wk.loadWk();

		} else {
			ALTRE_STAMPE.wk.filter(parameters);
		}
	},

	setTextHeight : function() {

		$('#container').css({
			'height' : $('.contentTabs').innerHeight() - 60
		});
		$('#testo').css({
			'height' : ALTRE_STAMPE.getTextHeight() - 180
		});

	},

	getTextHeight : function() {

		return $('.contentTabs').outerHeight(true)
				- $('#fldDatiPaziente').outerHeight(true)
				- $('#fldDatiCertificato').outerHeight(true);

	},

	loadData : function() {
		var parameters = {
			'iden' : $('#IDEN').val(),
			'iden_anag' : home.ASSISTITO.IDEN_ANAG
		};

		toolKitDB.getResultDatasource('SDJ.Q_ALTRE_STAMPE', 'MMG_DATI',
			parameters, null, function(response) {
				if (LIB.isValid(response)) {
					$('#testo').val(response[0]['TESTO']);
				}
		});
	},

	loadStandardText : function(onlyStd) {

		var parameters = {
			'ute_ins' : home.baseUser.IDEN_PER,
			'std' : typeof onlyStd == 'undefined' ? 'N' : onlyStd
		};

		home.NS_LOADING.showLoading({
			'container' : '#container'
		});

		toolKitDB.getResultDatasource('MMG_DATI.ALTRI_CERTIFICATI_UTENTE',
				'MMG_DATI', parameters, null, function(response) {

					$('#list').remove();

					ALTRE_STAMPE.createList(response);

					home.NS_LOADING.hideLoading({
						'container' : '#container'
					});

				});

	},

	createList : function(items) {

		var type = '';
		var ul = $(document.createElement('ul')).attr('id', 'list').appendTo('#container');

		for (var i = 0; i < items.length; i++) {
			var li = $(document.createElement('li'));
			var divider = $(document.createElement('li')).addClass('divider');

			if (type != items[i]['TIPO']) {

				type = items[i]['TIPO'];
				i > 0 ? divider.appendTo(ul) : null;

			}

			li.attr({
				'data-id' : items[i]['IDEN'],
				'data-text' : items[i]['TESTO'],
				'data-type' : items[i]['TIPO'],
				'data-std' : items[i]['STD']
			}).html(items[i]['TITOLO']).on('click', function() {
				ALTRE_STAMPE.select($(this).attr('data-id'));
			}).on('dblclick', function() {
				ALTRE_STAMPE.COD_CERTIFICATO = $(this).attr('data-id');
				ALTRE_STAMPE.select($(this).attr('data-id'));
				ALTRE_STAMPE.setText();
			}).appendTo(ul);
		}
		
		home.NS_LOADING.hideLoading();
	},

	getTypeBar : function() {
		var std = $(document.createElement('div')).attr('id', 'STD').text('Standard');
		var notStd = $(document.createElement('div')).attr('id', 'NO-STD').text('Personali');

		return $(document.createElement('div')).addClass('typeBar').append(std, notStd);
	},

	getIcons : function() {

		var iconEdit = $(document.createElement('i')).addClass('icon-pencil').attr('title', 'Modifica certificato');
		var iconLeft = $(document.createElement('i')).addClass('icon-left-circled').attr('title', 'Importa certificato nel testo corrente');
		var iconPlus = $(document.createElement('i')).addClass('icon-plus').attr('title', 'Inserisci nuovo certificato');
		var iconDelete = $(document.createElement('i')).addClass('icon-trash').attr('title', 'Elimina certificato');
		var iconSearch = $(document.createElement('i')).addClass('icon-search').attr('title', 'Cerca tra i certificati');
		var iconContainer = $(document.createElement('div')).addClass('icons');

		iconLeft.on('click', function() {
			if (ALTRE_STAMPE.isSelected()) {
				ALTRE_STAMPE.COD_CERTIFICATO = $('li.selected', '#list').attr('data-id');
				ALTRE_STAMPE.setText();
			} else {
				ALTRE_STAMPE.notify();
			}
		});

		iconPlus.on('click', function() {
			home.NS_MMG.apri('ANAGRAFICA_CERTIFICATI',"&ACTION=INS");
		});

		iconEdit.on('click', function() {

			if (ALTRE_STAMPE.isSelected()) {
				home.NS_MMG.apri('ANAGRAFICA_CERTIFICATI', '&IDEN='
						+ $('li.selected', '#list').attr('data-id'));
			} else {
				ALTRE_STAMPE.notify();
			}
		});

		iconDelete.on('click', function() {
			home.ALTRE_STAMPE.deleteIt();
		});

		iconSearch.on('click', function() {

			$('.search-container').toggle();

			if ($('#search').is(':visible')) {
				$('#search').focus();
			} else {
				$('#list').find('li').show();
			}
		});

		return iconContainer.append(iconLeft, iconPlus, iconEdit, iconDelete,
				iconSearch);

	},

	getSearchBar : function() {

		var attributes = {
			'id' : 'search',
			'type' : 'text'
		};
		var search = $(document.createElement('input')).attr(attributes);
		var searchContainer = $(document.createElement('div')).addClass('search-container');
		var modulo = $(document.createElement('div')).addClass('search-filter');
		var certificato = $(document.createElement('div')).addClass('search-filter')
		var lettera = $(document.createElement('div')).addClass('search-filter');

		modulo.attr('data-value', 'MODULO').html('Moduli');
		certificato.attr('data-value', 'CERTIFICATO').html('Certificati');
		lettera.attr('data-value', 'LETTERA').html('Lettere');

		$(modulo, certificato, lettera).on('click');

		return searchContainer.append(search, modulo, certificato, lettera);

	},

	select : function(id) {

		var target = $('li[data-id=' + id + ']', '#list');

		$('li', '#list').not(target).removeClass('selected');

		target.hasClass('selected') ? target.removeClass('selected') : target
				.addClass('selected');

	},

	isSelected : function() {
		return $('li.selected', '#list').length > 0;
	},

	setText : function(text) {

		text = typeof text !== 'undefined' ? text : $('li.selected', '#list')
				.attr('data-text');

		//tinyMCE.activeEditor.dom.add(tinyMCE.activeEditor.getBody(), 'p', {},
		tinyMCE.activeEditor.execCommand('mceInsertContent', false,
				ALTRE_STAMPE.getFormattedText(text));
	},
	
	getFormattedText : function(text) {

		var html = text.split('<nome>').join($('#txtNome').val()).split(
				'<cognome>').join($('#txtCognome').val()).split(
				'<codice_fiscale>').join($('#txtCodiceFiscale').val()).split(
				'<data_nascita>').join($('#txtDataDiNascita').val()).split(
				'<luogo_nascita>').join($('#txtLuogoNascita').val()).split(
				'<indirizzo_residenza>')
				.join($('#txtIndirizzoResidenza').val());

		return html;

	},

	deleteIt : function() {

		var iden = $('li.selected', '#list').attr('data-id');
		var std = $('li.selected', '#list').attr('data-std');

		//controllo che ciò che sto cercando di cancellare sia un testo non std
		if (std == 'S') {

			home.NOTIFICA.error({
				message : traduzione.lblNoDeleteTestiSTD,
				title : 'Errore!',
				timeout : 10
			});
			return;
		}

		//controllo che ci sia qualcosa di selezionato
		if (ALTRE_STAMPE.isSelected()) {
			home.NS_MMG.confirm(
				traduzione.cancella,
				function(context) {
					toolKitDB.executeFunctionDatasource(
						'MMG.CANCELLA_CERTIFICATO_STANDARD',
						'MMG_DATI',
						{'pIden' : iden},
						function(response) {
							var status = response.p_result.split('$')[0];
							var message = response.p_result.split('$')[1];

							if (status == 'OK') {
								home.ALTRE_STAMPE.loadStandardText($("#STD").hasClass("active") ? 'S' : 'N');
							} else {
								home.NOTIFICA.error({
									message : message,
									title : 'Errore!'
								});
							}
						});
				});
		} else {
			ALTRE_STAMPE.notify();
		}
	},

	getExpirationDate : function(days) {

		return moment().add('d', days).format('DD/MM/YYYY');
	},

	notify : function() {

		home.NOTIFICA.warning({
			'title' : 'Attenzione',
			'message' : traduzione.selezionareRiga,
			'timeout' : 5
		});
	},

	beforeSave : function() {

		if ($('#txtGiorniPrognosi').val() == '')
			$('#txtGiorniPrognosi').val(0).trigger('keyup');

		return true;

	},

	customizeJSON : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);

		var iden_problema = $('#IDEN_PROBLEMA').val() == '' ? home.ASSISTITO.IDEN_PROBLEMA
				: $('#IDEN_PROBLEMA').val();

		json.campo.push({
			'id' : 'COD_CERTIFICATO',
			'col' : 'COD_CERTIFICATO',
			'val' : ALTRE_STAMPE.COD_CERTIFICATO
		});
		json.campo.push({
			'id' : 'UTE_INS',
			'col' : 'UTE_INS',
			'val' : home.baseUser.IDEN_PER
		});
		json.campo.push({
			'id' : 'IDEN_MED',
			'col' : 'IDEN_MED',
			'val' : home.CARTELLA.getMedPrescr()
		});
		json.campo.push({
			'id' : 'IDEN_ANAG',
			'col' : 'IDEN_ANAG',
			'val' : $('#IDEN_ANAG').val()
		});
		json.campo.push({
			'id' : 'TESTO',
			'col' : 'TESTO',
			'val' : tinyMCE.activeEditor.getContent()
		});
		json.campo.push({
			'id' : 'IDEN_PROBLEMA',
			'col' : 'IDEN_PROBLEMA',
			'val' : iden_problema
		});
		json.campo.push({
			'id' : 'IDEN_ACCESSO',
			'col' : 'IDEN_ACCESSO',
			'val' : home.ASSISTITO.IDEN_ACCESSO
		});

		return json;

	},

	successSave : function(resp) {
		var idenCertificato = resp;

		if (Stampa == 'S') {
			ALTRE_STAMPE.auxStampa(idenCertificato);
		} else {
			home.$.dialog(traduzione.lblChiusura, {
				'title' 			: traduzione.titleChiusura,
				'movable' 			: true,
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'buttons' 			: [ {
					label : traduzione.lblSi,
					action : function() {
						home.$.dialog.hide();
					}
				}, {
					label : traduzione.lblNo,
					action : function() {
						home.$.dialog.hide();
						home.NS_FENIX_TOP.chiudiUltima();
					}
				} ]
			});
		}

		$('#IDEN').val(idenCertificato);
	},

	afterSave : function() {
		try {
			home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkCertificati();
		} catch (e) {
		}
		return true;

	},

	beforeClose : function() {

		delete home.ALTRE_STAMPE;
		return true;

	},

	stampa : function(iden, formato) {
		var v_report;
		var v_opzioni;

		if (formato == 'A4') {
			v_report = 'CERTIFICATI_STD_A4.RPT';
			v_opzioni = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_DEFAULT_A4;
		} else {
			v_report = 'CERTIFICATI_STD_A5.RPT';
			v_opzioni = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_DEFAULT_A5;
		}

		//alert(v_opzioni)
		
		var timbro = $("#radTimbroMedico").data('RadioBox').val();
		var intestazione = $("#radIntestazioneMedico").data('RadioBox').val();

		//var utente = home.baseUser.IDEN_PER;
		var utente = home.CARTELLA.IDEN_MED_PRESCR;

		var prompts = {
			pIdenCertificato : iden,
			pIdenPer : utente,
			pIntestazione : intestazione,
			pTimbro : timbro
		};

		home.NS_PRINT.print({
			path_report : v_report + '&t=' + new Date().getTime(),
			prompts : prompts,
			show : LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI', 'N'),
			output : 'pdf',
			opzioni : v_opzioni
		});
	}
};

var NS_MENU_ALTRE_STAMPE = {
	
		inserisciCertificato: function( rec, n_scheda ){
			
			 home.NS_MMG.reloadPage( n_scheda, 'ALTRE_STAMPE', '&IDEN=' );
		},
		
		modificaCertificato: function( rec, n_scheda ){
			
			home.NS_MMG.reloadPage( n_scheda, 'ALTRE_STAMPE', '&IDEN=' + rec[0]['IDEN'] );
		},
		
		eliminaCertificato: function( rec ) {
			
			if (home.MMG_CHECK.canDelete(rec[0].UTE_INS, rec[0].UTE_INS)) {
				home.ALTRE_STAMPE.idenCertificato = rec[0]['IDEN'];

				home.NS_MMG.confirm(
					traduzione.cancella, 
					function(){	
						var parameters = { 'pIden' : home.ALTRE_STAMPE.idenCertificato };
						toolKitDB.executeFunctionDatasource( 'CANCELLA_CERTIFICATO', 'MMG_DATI', parameters, function( response ){
							var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
							if( status == 'OK' ){
								home.NOTIFICA.success({ message : message , title : 'Successo!' });
								home.ALTRE_STAMPE.loadWk();
							}else{
								home.NOTIFICA.error({ message : message , title : 'Errore!' });
							}
						});
					}
				);
			}
		},
		
		stampaCertificato:function( rec ){
			ALTRE_STAMPE.auxStampa( rec[0].IDEN );
		}
};
