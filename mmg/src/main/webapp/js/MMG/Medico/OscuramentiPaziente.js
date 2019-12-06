$(document).ready(function() {

	OSCURAMENTI_PAZIENTE.init();
	OSCURAMENTI_PAZIENTE.setEvents();

	NS_FENIX_SCHEDA.customizeJson = OSCURAMENTI_PAZIENTE.customizeJson;
	NS_FENIX_SCHEDA.afterSave = OSCURAMENTI_PAZIENTE.afterSave;

});

var note = '';
var gruppo = false;

var OSCURAMENTI_PAZIENTE = {
	objWk : null,

	init : function() {
		$(".butSalva").hide();

		$("#lblTitolo").html(
				"Oscuramenti per il paziente: " + home.ASSISTITO.NOME_COMPLETO);
		OSCURAMENTI_PAZIENTE.initWk();
	},

	setEvents : function() {
		$("#radGruppoOscurato_S")
				.on(
						"click",
						function() {

							home.$.NS_DB
									.getTool({
										_logger : home.logger
									})
									.select({
										id : 'SDJ.Q_OSCURAMENTI_PAZIENTE',
										parameter : {
											iden_anag : {
												v : home.ASSISTITO.IDEN_ANAG,
												t : 'N'
											}
										}
									})
									.done(
											function(resp) {

												if (resp.result[0].GRUPPO_OSCURATO == 'S') {
													home.NOTIFICA
															.warning({
																message : 'Oscuramento per il gruppo gi&agrave; inserito',
																title : 'Attenzione',
																timeout : 10
															});
												} else {
													gruppo = true;
													OSCURAMENTI_PAZIENTE
															.dialogNota();
												}
											});
						});

		$("#radGruppoOscurato_N").on("click", function() {
			OSCURAMENTI_PAZIENTE.cancellaOscuramento('-1');
		});
	},

	initWk : function() {

		var h = $('.contentTabs').innerHeight()
				- $('#fldSetOscuramenti').outerHeight(true) - 10;
		$("#ElencoWork").height(h);

		this.objWk = new WK({
			"id" : 'WK_OSCURAMENTI_PAZIENTE',
			"aBind" : [ "iden_anag" ],
			"aVal" : [ home.ASSISTITO.IDEN_ANAG ],
			"container" : 'ElencoWork'
		});
		this.objWk.loadWk();
	},

	refreshWk : function() {

		OSCURAMENTI_PAZIENTE.objWk.filter({
			"aBind" : [ "iden_anag" ],
			"aVal" : [ home.ASSISTITO.IDEN_ANAG ]
		});
	},

	cancellaOscuramento : function(row) {
		home.NS_MMG
				.confirm(
						"Vuoi veramente cancellare l'oscuramento corrente?",
						function() {

							var idUtenteOscurato = row == '-1' ? -1
									: row[0].IDEN_UTENTE_OSCURATO;
							var idTipoUtenteOscurato = row == '-1' ? 'ESCLUSIONE_GRUPPO'
									: row[0].TIPO;
							if (idUtenteOscurato == -1) {
								$('#radGruppoOscurato').data('RadioBox')
										.selectByValue('N');
							}

							var params = {};
									params.pAction = 'UPD',
									params.pIdenAnag = home.ASSISTITO.IDEN_ANAG,
									params.pTipo = idTipoUtenteOscurato,
									params.pIdenUtente = idUtenteOscurato,
									params.pAttivo = 'N'

							toolKitDB
									.executeProcedureDatasource(
											'SP_SAVE_OSCURAMENTI_PAZIENTE',
											'MMG_DATI',
											params,
											function(response) {
												var status = response.p_result
														.split('$')[0];
												if (status == 'OK') {
													home.NOTIFICA
															.success({
																message : 'Oscuramento cancellato con successo',
																title : 'Successo!'
															});
													OSCURAMENTI_PAZIENTE
															.refreshWk();
												} else
													home.NOTIFICA
															.error({
																message : response.p_result
																		.split('$')[1],
																title : 'Errore!'
															});
											});
						});
	},

	dialogNota : function() {

		var vContent = $("<div>");
		vContent.append($('<label>', {
			'class' : 'label_note',
			'id' : 'lbltxtNote'
		}).text('Note: (max. 1000 caratteri)'));
		vContent.append($("<textarea>", {
			'id' : 'txtNote'
		}).css({
			width : 580,
			height : 100
		}).on('keyup blur', OSCURAMENTI_PAZIENTE.updateNoteChars));
		vContent
				.append($('<label>', {
					'class' : 'label_note',
					'id' : 'lblAvvertenza'
				})
						.css({
							color : 'red'
						})
						.text(
								"(I dati del paziente verranno oscurati per l'utente selezionato cliccando su 'Salva')"));

		var utenteObs = gruppo == true ? "il gruppo" : "l'utente "
				+ $("#txtMedOscurato").val();

		$
				.dialog(
						vContent,
						{

							'id' 				: 'dialogWk',
							'title' 			: "Oscurare i dati del paziente per " + utenteObs + " ?",
							'showBtnClose' 		: false,
							'ESCandClose'		: true,
							'created'			: function(){ $('.dialog').focus(); },
							'width' 			: 600,
							buttons : [
									{
										"label" : "Salva",
										"action" : function() {
											if ($("#txtNote").val().length > 1000) {
												home.NOTIFICA
														.warning({
															message : 'Il testo inserito &egrave; troppo lungo. Limitarsi a 1000 caratteri.',
															title : 'Attenzione',
															timeout : 10
														});
											} else {
												note = $("#txtNote").val();
												NS_FENIX_SCHEDA.registra();
												$.dialog.hide();
											}
										}
									},
									{
										"label" : "Annulla",
										"action" : function() {
											OSCURAMENTI_PAZIENTE
													.emptyMedOscurato();
											$.dialog.hide();
										}
									} ],
						});
	},

	customizeJson : function(json) {
		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		/***/
		json.campo.push({
			'id' : 'IDEN_ANAG',
			'col' : 'IDEN_ANAG',
			'val' : home.ASSISTITO.IDEN_ANAG
		});
		/***/
		var tipo = gruppo == true ? 'ESCLUSIONE_GRUPPO' : 'ESCLUSIONE_UTENTE';
		json.campo.push({
			'id' : 'TIPO',
			'col' : 'TIPO',
			'val' : tipo
		});
		/***/
		var medOscurato = gruppo == true ? -1 : $("#h-txtMedOscurato").val();
		json.campo.push({
			'id' : 'IDEN_UTENTE',
			'col' : 'IDEN_UTENTE',
			'val' : medOscurato
		});
		/***/
		json.campo.push({
			'id' : 'NOTE',
			'col' : 'NOTE',
			'val' : note
		});

		return json;
	},

	afterSave : function() {
		OSCURAMENTI_PAZIENTE.emptyMedOscurato();
		note = '';
		OSCURAMENTI_PAZIENTE.refreshWk();
	},

	emptyMedOscurato : function() {
		$("#h-txtMedOscurato").val('');
		$("#txtMedOscurato").val('');
	},

	updateNoteChars : function() {
		$('#lbltxtNote').text(
				'Note: (max. 1000 caratteri: ' + $("#txtNote").val().length
						+ '/1000)');
	}

};

var AC = {

	select : function() {

		if ($("#h-txtMedOscurato").val() == home.baseUser.IDEN_PER) {
			home.NOTIFICA.warning({
				message : 'Oscuramento non valido',
				title : 'Attenzione',
				timeout : 10
			});
			OSCURAMENTI_PAZIENTE.emptyMedOscurato();
			return;
		}

		home.$.NS_DB
				.getTool({
					_logger : home.logger
				})
				.select({
					id : 'SDJ.Q_OSCURAMENTI_PAZIENTE_UTENTE',
					parameter : {
						iden_anag : {
							v : home.ASSISTITO.IDEN_ANAG,
							t : 'N'
						},
						iden_utente : {
							v : $("#h-txtMedOscurato").val(),
							t : 'N'
						}
					}
				})
				.done(
						function(resp) {
							if (resp.result[0].UTENTE_OSCURATO != 0) {
								home.NOTIFICA
										.warning({
											message : "Oscuramento gi&agrave; inserito per l'utente "
													+ $("#txtMedOscurato")
															.val() + " .",
											title : 'Attenzione',
											timeout : 10
										});
								OSCURAMENTI_PAZIENTE.emptyMedOscurato();
							} else {
								gruppo = false;
								OSCURAMENTI_PAZIENTE.dialogNota();
							}
						});
	},

	choose : function() {
	}
}