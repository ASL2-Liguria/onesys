var provenienza = '';
var pIden = '';


jQuery(document).ready(function () {
	WK_CERTIFICATI.init();
	WK_CERTIFICATI.setEvents();

});

var WK_CERTIFICATI = {
	objWk: null,
	init: function () {

		home.WK_CERTIFICATI = this;
		WK_CERTIFICATI.initWk();
		provenienza = typeof home.provenienza != 'undefined' ? home.provenienza : 'CARTELLA';

		/**********Nascondo le righe che contengono Nome, Cognome e data di nascita se mi trovo dentro la cartella******/
		if (LIB.isValid($("#IDEN_ANAG").val())) {

			$("#lblCognome").parents("tr").hide();
			$("#lblDataNascita").parents("tr").hide();
		}
	},
	setEvents: function () {

		$("#butRicerca").on("click", function () {
			WK_CERTIFICATI.refreshWk();
		});

		$(".butInserisci").on("click", function () {
			home.NS_MMG.apri('MMG_CERTIFICATO_MALATTIA');
		});

		$("body").on("keyup", function (e) {
			if (e.keyCode == 13) {
				WK_CERTIFICATI.refreshWk();
			}
		});
	},
	refreshWk: function () {

		var idenMed = home.baseUser.IDEN_PER;
		var idenAnag = home.ASSISTITO.IDEN_ANAG;
		var p_cognome = $("#txtCognome").val().toUpperCase();
		var p_nome = $("#txtNome").val().toUpperCase();

		var p_data_nascita = $("#txtDataNascita").val();
		/*var da_data = $("#h-txtDaData").val();
		 if (da_data ==""){
		 da_data = '0';
		 }
		 var a_data = $("#h-txtAData").val();*/
		var da_data = $("#txtDaData").val();
		if (da_data == "") {

			da_data = '01/01/1900';
		}
		var a_data = $("#txtAData").val();

		WK_CERTIFICATI.objWk.filter({
			"aBind": ["iden_anag", "ute_ins", "nome", "cognome", "data_nascita", "da_data", "a_data"],
			"aVal": [idenAnag, idenMed, p_nome, p_cognome, p_data_nascita, da_data, a_data]
		});
	},
	initWk: function () {

		var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) - 20;
		$("#divWk").height(h);

		var idenMed = home.baseUser.IDEN_PER;
		var idenAnag = home.ASSISTITO.IDEN_ANAG;
		var p_cognome = $("#txtCognome").val().toUpperCase();
		var p_nome = $("#txtNome").val().toUpperCase();

		var p_data_nascita = $("#txtDataNascita").val();
		/*var da_data = $("#h-txtDaData").val();
		 if (da_data ==""){
		 da_data = '0';
		 }
		 var a_data = $("#h-txtAData").val();*/
		var da_data = $("#txtDaData").val();
		if (da_data == "") {

			da_data = '01/01/1900';
		}
		var a_data = $("#txtAData").val();

		this.objWk = new WK({
			"id": 'WK_CERTIFICATI',
			"aBind": ["iden_anag", "ute_ins", "nome", "cognome", "data_nascita", "da_data", "a_data"],
			"aVal": [idenAnag, idenMed, p_nome, p_cognome, p_data_nascita, da_data, a_data],
			"container": 'divWk'
		});
		this.objWk.loadWk();
	},
	rettificaCertificato: function (row) {

		pIden = row[0].IDEN;
		var pPaziente = row[0].PAZIENTE;

		home.NS_MMG.apri("MMG_CERTIFICATO_MALATTIA&IDEN=" + pIden + "&PAZIENTE=" + pPaziente);
	},
	annullaCertificato: function (riga) {
		if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].UTE_INS)) {
			var r = confirm("Il certificato selezionato verr&agrave; cancellato. Procedere?");
			if (r == true) {
				toolKitDB.executeProcedureDatasource('SP_CERTIFICATO_ANNULLA', 'MMG_DATI', WK_CERTIFICATI.getValori(riga), function () {
					WK_CERTIFICATI.refreshWk();
				});
			}
		}
	},
	getValori: function (row) {

		var param = {};
		param.pIden = row[0].IDEN;
		param.pAnag = row[0].IDEN_ANAG;
		param.pUte = row[0].UTE_INS;
		return param;
	},
	stampaCertificato: function (row, pPdf, pTypeCertificato, pAllPages) {

		//controllo se devo stampare tutte le pagine (ALL), altrimenti stampo solo la prima
		var vAllPages = (typeof pAllPages != 'undefined' && pAllPages == 'ALL') ? pAllPages : '';

		//a seconda del valore stampo il modulo vecchio o quello nuovo
		var report = pTypeCertificato != 'NEW' ? "MALATTIA.RPT" : "MALATTIA_NEW.RPT";

		//controllo se e' stato segnalato di stampare il pdf
		var vPdf = pPdf != 'S' ? LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI', 'N') : pPdf;

		var prompts = {pIdCertificato: row[0].IDEN, pPagina: vAllPages};

		home.NS_PRINT.print({
			path_report: report,
			prompts: prompts,
			show: vPdf,
			output: "pdf"
		});
	},
	inserisciCertificato: function () {
		home.NS_MMG.apri('MMG_CERTIFICATO_MALATTIA', '&PROVENIENZA=ELENCO_CERTIFICATI');
	},
	preparaMail: function (row) {

		var testo_mail = 'Invio del certificato di malattia Numero di Protocollo: ' + row[0].ID_CERTIFICATO + '.' + '\n\n';
		testo_mail += 'Non rispondere a questa mail.';
		var oggetto_mail = 'Certificato di Malattia';

		var frm = $(document.createElement('form'))
				.attr({"id": "frmDialog"})
				.append(
						$(document.createElement('p')).append(
						$(document.createElement('label')).attr({"for": "txtCampoA", "id": "lbltxtCampoA"}).text(traduzione.lbltxtCampoA)
						.append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_I'], {})),
						$(document.createElement('input')).attr({"id": "txtCampoA", "name": "txtCampoA", "type": "text"})
						),
						$(document.createElement('p')).append(
						$(document.createElement('label')).attr({"for": "txtCampoCC", "id": "lbltxtCampoCC"}).text(traduzione.lbltxtCampoCC)
						.append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_II'], {})),
						$(document.createElement('input')).attr({"id": "txtCampoCC", "name": "txtCampoCC", "type": "text"})
						),
						$(document.createElement('p')).append(
						$(document.createElement('label')).attr({"for": "txtOggettoMail", "id": "lbltxtOggettoMail"}).text(traduzione.lbltxtOggettoMail),
						$(document.createElement('input')).attr({"id": "txtOggettoMail", "name": "txtOggettoMail", "type": "text"}).val(oggetto_mail)
						),
						$(document.createElement('p')).append(
						$(document.createElement('label')).attr({"for": "txtTestoMail", "id": "lbltxtTestoMail"}).text(traduzione.lbltxtTestoMail),
						$(document.createElement('textarea')).attr({"id": "txtTestoMail", "name": "txtTestoMail"}).val(testo_mail)
						)
						);

		home.$.NS_DB.getTool({_logger: home.logger}).select({
			id: 'SDJ.Q_EMAIL_PAZIENTE',
			parameter:
					{
						iden_anag: {v: home.ASSISTITO.IDEN_ANAG, t: 'N'}
					}
		}).done(function (resp) {
			$("#txtCampoA").val(resp.result[0].EMAIL);
		});

		$.dialog(frm, {
			'id': 'dialogWk',
			'title': "Invio Mail",
			'showBtnClose': false,
			'ESCandClose': true,
			'created': function () {
				$('.dialog').focus();
			},
			'width': 500,
			buttons:
					[{
							"label": "Invio",
							"action": function () {

								if ($("#txtCampoA").val().trim() == "") {
									home.NOTIFICA.warning({
										message: "E' necessario inserire almeno un indirizzo",
										title: "Attenzione",
										timeout: 10
									});
									$("#txtCampoA").focus();
									return;
								}
								;

								if ($("#txtTestoMail").val().trim() == "") {
									home.NOTIFICA.warning({
										message: "E' necessario inserire un testo per la mail",
										title: "Attenzione",
										timeout: 10
									});
									$("#txtTestoMail").focus();
									return;
								}
								;

								if ($("#txtCampoA").val() != "" && $("#txtTestoMail").val() != "") {

									var indirizzi = $("#txtCampoA").val().trim();
									var arIndirizzi = indirizzi.split(',');
									for (var i = 0; i < arIndirizzi.length; i++) {

										if (!WK_CERTIFICATI.isValidEmailAddress(arIndirizzi[i].trim())) {
											home.NOTIFICA.warning({
												message: arIndirizzi[i].trim() + traduzione.lblmailNonValida,
												title: "Attenzione",
												timeout: 10
											});
											return false;
										}
									}
									;
								}
								;

								if ($("#txtCampoCC").val().trim() != "" && $("#txtCampoA").val() != "" && $("#txtTestoMail").val() != "") {

									var indirizziCC = $("#txtCampoCC").val().trim();
									var arIndirizziCC = indirizziCC.split(',');
									for (var i = 0; i < arIndirizziCC.length; i++) {

										if (!WK_CERTIFICATI.isValidEmailAddress(arIndirizziCC[i].trim())) {
											home.NOTIFICA.warning({
												message: arIndirizziCC[i].trim() + traduzione.lblmailNonValida,
												title: "Attenzione",
												timeout: 10
											});
											return false;
										}
									}
								}
								;
								var emailA = $("#txtCampoA").val();
								emailA = emailA.replace(",", ";");

								var emailCC = $("#txtCampoCC").val();
								emailCC = emailCC.replace(",", ";");

								//var url = "http://10.106.128.181:18082/invioMail?"; //192.168.3.83 quella di Massimo

								var url = home.baseGlobal.URL_INVIO_MAIL_CERTIFICATI;
								url += "idenCertificato=" + row[0].IDEN;
								url += "&recipients=" + emailA;
								url += "&urlCC=" + LIB.getParamUserGlobal("URL_PRINT") + "MALATTIA.RPT";
								url += "%26init=pdf";
								url += "%26promptpIdCertificato=" + row[0].IDEN;
								url += "%26promptpPagina=ALL";
								url += "&subject=" + $("#txtOggettoMail").val();
								url += "&message=" + $("#txtTestoMail").val();
								url += "&sender=noreply@asl2.liguria.it"; //no-reply@noSource.com
								if ($("#txtCampoCC").val() != '') {
									url += "&recipientsCC=" + emailCC;
								}

								//alert(url)

								$.support.cors = true;

								NS_LOADING.showLoading({"timeout": 30});

								$.ajax({
									type: "POST",
									url: url,
									dataType: "text",
									success: function (resp) {

										NS_LOADING.hideLoading();
										$.support.cors = false;

										if (resp != 'OK') {

											NOTIFICA.warning({
												message: resp.toString(),
												title: "Anomalia nell'invio. Verificare l'effettivo recapito della mail o riprovare"

											});

										} else {

											home.NOTIFICA.success({
												message: "Mail inviata correttamente",
												title: "Success",
												timeout: 10
											});
											$.dialog.hide();
										}
										;
									},
									error: function (resp) {

										NS_LOADING.hideLoading();
										$.support.cors = false;
										NOTIFICA.error({
											message: resp.statusText,
											title: "Errore"
										});
									},
								});
							}
						},
						{
							"label": "Annulla",
							"action": function () {
								$.dialog.hide();
							}
						}]
		});
	},
	isValidEmailAddress: function (emailAddress) {
		var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
		return pattern.test(emailAddress);
	}
};