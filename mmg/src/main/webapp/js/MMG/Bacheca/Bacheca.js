$(document).ready(function() {

	BACHECA.init();
	BACHECA.setEvents();

	NS_FENIX_SCHEDA.customizeJson = BACHECA.customizeJson;
	NS_FENIX_SCHEDA.afterSave = BACHECA.afterSave;

	$('.butSalva').hide();

});

var BACHECA = {

	datasource : 'MMG_DATI',
	functions : {
		'today' : 'MMG_DATI.BACHECA_OGGI',
		'patient' : 'MMG_DATI.BACHECA_PAZIENTE',
		'user' : 'MMG_DATI.BACHECA_UTENTE',
		'asl' : 'MMG_DATI.BACHECA_ASL',
		'update' : 'CANCELLA_PROMEMORIA_BACHECA'
	},

	init : function() {

		home.BACHECA = this;

		$('#divPaziente, #divOggi, #divUtente, #divASL').width(906);

		if ($('#IDEN_ANAG').val() == '') {
			$('#fldPaziente').hide();
			$("#lblMostraUtente, #radMostraUtente").hide();
		} else {
			BACHECA.appendReminders({
				'div': '#divPaziente',
				'checkReminders': BACHECA.getPatientRemindersParameters()
			});
		}
		BACHECA.appendReminders({
			'div': '#divOggi',
			'checkReminders': BACHECA.getTodayRemindersParameters()
		});
		BACHECA.appendReminders({
			'div': '#divUtente',
			'checkReminders': BACHECA.getUserRemindersParameters()
		});
		BACHECA.appendReminders({
			'div': '#divASL',
			'checkReminders': BACHECA.getASLRemindersParameters()
		});

		// cancello la riga della nota che penso non serva a niente per ora
		$("tr > #txtNote").hide();

		// se non ho l'iden anag sono fuori dalla cartella e quindi non serve la
		// riga dell'associa al paziente corrente
		if ($("#IDEN_ANAG").val() == '') {
			$("#lblAssociaPaziente, #radAssociaPaziente").hide();
		}
	},

	setEvents : function() {

		var liHeight = 26;

		$('#txtDescrizione, #txtNote').attr('maxLength', 4000);

		$('#divPaziente, #divOggi, #divUtente, #divASL').on(
				'click',
				'i.icon-cancel-circled',
				function() {
					BACHECA.idPromemoria = $(this).closest('li').attr('data-id');
					var dialog = home.NS_MMG.confirm (
						traduzione.cancellaPromemoria,
						function(context) {
							toolKitDB.executeFunctionDatasource(
								home.BACHECA.functions.update,
								home.BACHECA.datasource, {
									'pIden' : home.BACHECA.idPromemoria
								},
								function(response) {
									var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
									if (status == 'OK') {
										var li = $('li[data-id=\'' + home.BACHECA.idPromemoria + '\']'), ul = li.closest('ul');
										li.remove();
										if (ul.find('li').length < 1) {
											$(document.createElement('li')).addClass('no-result').text('Non ci sono promemoria per questa sezione.').appendTo(ul);
										}
									} else {
										home.NOTIFICA.error({
											message : message,
											title : 'Errore!'
										});
									}
									if (LIB.isValid(home.MAIN_PAGE)) {
										home.MAIN_PAGE.updatePromemoriaBacheca($('#divPaziente').find('li').filter(':not(.no-result)').length);
									}
								});
						}, function() {
							return true;
						}
					);
				}
			).on(
				'click',
				'i.icon-down',
				function() {
					$(this).removeClass('icon-down').addClass('icon-up').closest('li').css('height', 'auto');
				}
			).on(
				'click',
				'i.icon-up',
				function() {
					$(this).removeClass('icon-up').addClass('icon-down').closest('li').css('height', 26);
				}
			).on(
				'click',
				'i.icon-attach-1',
				function() {
					var allegato = $(this).closest('li').attr('data-allegato');
					home.NS_MMG.apri('IMMAGINE', '&IDEN=' + allegato);
				}
			);

		$('#li-tabAggiornamenti').on('click', BACHECA.loadListaAggiornamenti);
		$('#li-tabInserimento').on('click', function() {
			$("#lblMostraUtente, #radMostraUtente").hide();
		});

		$('.ulTabs').on(
				'click',
				'li',
				function() {

					$(this).attr('id') == 'li-tabInserimento' ? $('.butSalva')
							.show() : $('.butSalva').hide();

				});

	},

	getPatientRemindersParameters : function() {

		var parameters = {
			functionName : BACHECA.functions.patient,
			datasource : BACHECA.datasource,
			functionParameters : {
				'iden_anagrafica' : home.ASSISTITO.getIdenAnag(),
				'iden_personale' : home.baseUser.IDEN_PER,
				'oggi' : moment().format('YYYYMMDD')
			}
		};

		return parameters;

	},

	getTodayRemindersParameters : function() {

		var parameters = {
			functionName : BACHECA.functions.today,
			datasource : BACHECA.datasource,
			functionParameters : {
				'oggi' : moment().format('YYYYMMDD'),
				'iden_per' : home.baseUser.IDEN_PER
			}
		};

		return parameters;

	},

	getUserRemindersParameters : function() {

		var parameters = {
			functionName : BACHECA.functions.user,
			datasource : BACHECA.datasource,
			functionParameters : {
				'iden_personale' : home.baseUser.IDEN_PER,
				'oggi' : moment().format('YYYYMMDD')
			}
		};

		return parameters;

	},

	getASLRemindersParameters : function() {

		var parameters = {
			functionName : BACHECA.functions.asl,
			datasource : BACHECA.datasource,
			functionParameters : {}
		};

		return parameters;

	},

	checkReminders: function(parameters, callback) {
		var data = new Array();
		toolKitDB.getResultDatasource(parameters.functionName,
			parameters.datasource, parameters.functionParameters, null,
			function(response) {

				if (LIB.isValid(response)) {
					for (var i = 0; i < response.length; i++) {
						data.push({
							'IDEN' : response[i]['IDEN'],
							'DESCRIZIONE' : response[i]['DESCRIZIONE'],
							'PRIORITA' : response[i]['PRIORITA'],
							'ALLEGATO' : response[i]['IDEN_DOCUMENTO']
						});
					}
				}
				callback(data);
		});
	},
	
	appendReminders: function(parameters) {
		BACHECA.checkReminders(parameters.checkReminders, function(reminders) {
			BACHECA.loadReminders({
				"div": parameters.div,
				"reminders": reminders
			});
		});
	},

	loadReminders : function(parameters) {

		var reminders = parameters.reminders, ul = $(
				document.createElement('ul')).addClass('reminderList');

		if (reminders.length > 0) {

			for (var i = 0; i < reminders.length; i++) {

				var li = $(document.createElement('li')).attr({
					'data-id' : reminders[i]['IDEN'],
					'data-allegato' : reminders[i]['ALLEGATO']
				}), divIcon = $(document.createElement('div')), iconDelete = $(
						document.createElement('i')).addClass(
						'icon-cancel-circled').attr('title',
						'Cancella promemoria'), iconDoc = $(
						document.createElement('i')).addClass('icon-attach-1')
						.attr('title', 'Visualizza allegato');
				iconDown = $(document.createElement('i')).addClass('icon-down')
						.attr('title', 'Mostra/nascondi il testo completo');
				iconPriority = $(document.createElement('i')).addClass(
						'icon-stop priorita_' + reminders[i]['PRIORITA']);

				if (LIB.isValid(reminders[i]['ALLEGATO']))
					iconDoc.appendTo(divIcon);

				iconDelete.appendTo(divIcon);

				iconDown.appendTo(divIcon);

				li.text(reminders[i]['DESCRIZIONE']).prepend(iconPriority)
						.append(divIcon).appendTo(ul);

			}

		} else {

			var li = $(document.createElement('li')).addClass('no-result')
					.text('Non ci sono promemoria per questa sezione.');
			li.appendTo(ul);

		}

		ul.appendTo(parameters.div);

		if (!home.MMG_CHECK.isAdministrator()) {
			$('#divASL').find('.icon-cancel-circled').hide();
		}

	},

	refresh : function() {

		$('#divPaziente, #divOggi, #divUtente, #divASL').empty();

		BACHECA.appendReminders({
			'div' : '#divPaziente',
			'checkReminders': BACHECA.getPatientRemindersParameters()
		});
		BACHECA.appendReminders({
			'div' : '#divOggi',
			'checkReminders': BACHECA.getTodayRemindersParameters()
		});
		BACHECA.appendReminders({
			'div' : '#divUtente',
			'checkReminders': BACHECA.getUserRemindersParameters()
		});
		BACHECA.appendReminders({
			'div': '#divASL',
			'checkReminders': BACHECA.getASLRemindersParameters()
		});

	},

	loadListaAggiornamenti : function() {

		var parameters = {
			'id' : 'AGGIORNAMENTI',
			'aBind' : [ '' ],
			'aVal' : [ '' ]
		};

		if (!LIB.isValid(BACHECA.wkAggiornamenti)) {

			$('#divWk').height($('.contentTabs').outerHeight(true) - 60);

			BACHECA.wkAggiornamenti = new WK(parameters);
			BACHECA.wkAggiornamenti.loadWk();

		} else
			BACHECA.wkAggiornamenti.filter(parameters);

	},

	customizeJson : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		var IDEN_PERSONALE = $('#radMostraUtente').data('RadioBox').val() == 'S' ? home.baseUser.IDEN_PER : '';
		var IDEN_ANAGRAFICA = $('#radAssociaPaziente').data('RadioBox').val() == 'S' ? home.ASSISTITO.getIdenAnag() : '';

		json.campo.push({
			'id' : 'IDEN_PERSONALE',
			'val' : IDEN_PERSONALE,
			'col' : 'IDEN_PERSONALE'
		});
		json.campo.push({
			'id' : 'IDEN_ANAGRAFICA',
			'val' : IDEN_ANAGRAFICA,
			'col' : 'IDEN_ANAGRAFICA'
		});
		json.campo.push({
			'id' : 'UTE_INS',
			'val' : home.baseUser.IDEN_PER,
			'col' : 'UTE_INS'
		});

		return json;

	},

	afterSave : function() {

		var file = $('#AllegaFile').val(), continueSaving = true;

		if (file !== '')
			BACHECA.saveFile();

		$('#IDEN').val('');
		BACHECA.refresh();

	},

	saveFile : function() {

		// CROSS DOMAIN ALLOWED
		$.support.cors = true;

		var IDEN_ANAG;
		if (LIB.isValid(home.ASSISTITO.IDEN_ANAG) && home.ASSISTITO.IDEN_ANAG != '') {
			IDEN_ANAG = home.ASSISTITO.IDEN_ANAG;
		} else {
			IDEN_ANAG = 0;
		}
		var nome_file = $('#AllegaFile').val();
		var action = 'DocumentoAllegato;jsessionid=' + home.$("#AppStampa param[name=session_id]").val() + "?";
		var descrizione = (nome_file.split('\\'))[nome_file.split('\\').length - 1].split('.')[0];
		var extension = (nome_file.split('.'))[nome_file.split('.').length - 1].toString();

		BACHECA.mymetype = LIB.getMymeType(extension);

		action += 'IDEN_ANAG=' + IDEN_ANAG;
		action += '&DESCRIZIONE=' + descrizione;
		action += '&NOME_FILE=' + descrizione;
		action += '&MIME_TYPE=' + BACHECA.mymetype;
		action += '&UTENTE=' + home.baseUser.USERNAME;
		action += '&IDEN_PER=' + home.baseUser.IDEN_PER;
		action += '&IDEN_EPISODIO=' + $('#IDEN').val();
		action += '&TIPO_EPISODIO=PROMEMORIA_BACHECA&TIPO_DOCUMENTO=GEN';

		$('form#dati').attr({
			'enctype' : 'multipart/form-data',
			'action' : action,
			'method' : 'POST'
		}).ajaxForm({
			url : this.fileServerPath,
			crossDomain : true,
			dataType : 'json',
			type : 'POST'
		}).ajaxSubmit(
				{

					success : function(response) {

						var status = response.split('$')[0], msg = response
								.split('$')[1];

						if (status == 'OK')
							$('#li-tabBacheca').trigger('click');
						else
							home.NOTIFICA.error({
								'title' : 'Errore',
								'msg' : traduzione.erroreAllegato
							});

					}

				});

	}

};
