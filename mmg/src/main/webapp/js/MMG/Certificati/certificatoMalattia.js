var statoPagina = '';
var dataFineMalattia = '';

$(document).ready(function () {
	CERTIFICATO_MALATTIA.init();
	CERTIFICATO_MALATTIA.setEvents();
	var params = {config: "VCERT", formId: "dati"};
	NS_FENIX_SCHEDA.addFieldsValidator(params);
	NS_FENIX_SCHEDA.beforeSave = CERTIFICATO_MALATTIA.beforeSave;
	NS_FENIX_SCHEDA.successSave = CERTIFICATO_MALATTIA.successSave;
});

var CERTIFICATO_MALATTIA = {
		init: function () {

			$(".butAnnulla").hide();
			$("#txtCivico").closest("tr").hide();

			if (home.MMG_CHECK.isAdministrator()) {
				CERTIFICATO_MALATTIA.showHideTab("SHOW");
			} else {
				CERTIFICATO_MALATTIA.checkLogin();
				CERTIFICATO_MALATTIA.setLayout();
			}

			//$("#li-tabLogin").hide();
			CERTIFICATO_MALATTIA.setLabelLink();

			if ($("#txtPin").val() != "") {
				RicordaPin.selectByValue("S");
			}

			if ($("#txtPwd").val() != "") {
				RicordaPwd.selectByValue("S");
			}

			dataFineMalattia = $("#h-txtDataFine").val();
			$("#hdiff").val(10);

			$("#hStatoPagina").val($("#STATO_PAGINA_PROVA").val());
			$("#hIden").val($("#IDEN").val());
			NS_FENIX_SCHEDA.customizeParam = function (params) {
				params.extern = true;
				return params;
			};

			/*** Faccio sparire il tasto che rimanda all'elenco dei certificati 
			 * nel caso in cui il certificato corrente sia stato chiamato proprio 
			 * dalla wk dell'elenco dei certificati ***/
			if ($("#PROVENIENZA").val() == 'ELENCO_CERTIFICATI' || LIB.isValid($("#IDEN").val())) {
				$(".butElencoCertificati").hide();
			}
		},
		
		setEvents: function () {

			$(".butElencoCertificati").on("click", function () {
				CERTIFICATO_MALATTIA.elencoCertificati();
			});

			$(".butRipulisci").on("click", function () {
				CERTIFICATO_MALATTIA.ripulisci();
			});

			$(".butReset").on("click", function () {
				CERTIFICATO_MALATTIA.ripulisciLogin();
			});

			$(".butAnteprima").on("click", function () {
				CERTIFICATO_MALATTIA.apriRiepilogo();
			});

			$("#butResetRepe").on("click", function () {
				CERTIFICATO_MALATTIA.ripulisciIndirizzoRepe();
			});

			$("#butLogin").on("click", function () {
				CERTIFICATO_MALATTIA.checkLogin();
			});

			$('#txtDataMalattia').on("change", function () {
				CERTIFICATO_MALATTIA.setGiornataLavorata();
			});

			$('#txtDataFine').on("change", function () {
				CERTIFICATO_MALATTIA.checkDataFine();
			});

			$('#txtDataFine').on("change", function () {
				CERTIFICATO_MALATTIA.checkDateUguali();
			});

			$('#txtDataMalattia').on("change", function () {
				CERTIFICATO_MALATTIA.checkDateUguali();
			});

			$('.butAnnulla').on("click", CERTIFICATO_MALATTIA.annullaCertificato);
		},
		elencoCertificati: function () {
			home.NS_MMG.apri('MMG_WORKLIST_CERTIFICATI');
		},
		annullaCertificato: function () {

			home.NS_MMG.confirm("Il certificato selezionato verr\u00E0 cancellato. Procedere?", function () {


				var promise = home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
					datasource: 'MMG_DATI',
					id: 'SP_CERTIFICATO_ANNULLA',
					parameter: {
						pIden: {v: $("#IDEN").val(), t: 'N'},
						pAnag: {v: $("#IDEN_ANAG").val(), t: 'N'},
						pUte: {v: $("#UTE_INS").val(), t: 'N'},
						p_result: {t: 'V', d: 'O'}
					}
				});
				promise.done(function (response) {
					var pIdenCancellazione = response.p_result.split('$')[1];
					CERTIFICATO_MALATTIA.checkSuccess(pIdenCancellazione, 'del');
				});
			});
		},
		//apre il riepilogo delle informazioni inserite nel certificato
		apriRiepilogo: function () {

			function getTitleRadio(nameRadio) {
				var vReturn;
				eval("var value = " + nameRadio + ".val()");
				if (value == '') {
					vReturn = traduzione.lblDatoNoIns;
				} else {
					eval("var obj = $('#" + nameRadio + "_" + value + "')");
					vReturn = obj.find('span').html();
				}
				return vReturn;
			}

			//creo l'html che andrà a popolare il dialog di riepilogo
			var table = "<table id='tableAnteprima'>" +
			"<tr class='trTable'><td class='labelIntestazione' colSpan='2'><a>" + traduzione.fldCertificato + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblDataRilascio + "</a></td><td class='valIns'>" + $('#txtDataRilascio').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblDataMalattia + "</a></td><td class='valIns'>" + $('#txtDataMalattia').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblDataFine + "</a></td><td class='valIns'>" + $('#txtDataFine').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblTipoVisita + "</a></td><td class='valIns'>" + getTitleRadio('radTipoVisita') + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblTipoCertificato + "</a></td><td class='valIns'>" + getTitleRadio('radTipoCertificato') + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblCodDiagnosi + "</a></td><td class='valIns'>" + $('#txtCodDiagnosi').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblDiagnosi + "</a></td><td class='valIns'>" + $('#txtDiagnosi').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblNoteDiagnosi + "</a></td><td class='valIns'>" + $('#txtNoteDiagnosi').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblGiornataLavorata + "</a></td><td class='valIns'>" + getTitleRadio('radGiornataLavorata') + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lbltrauma + "</a></td><td class='valIns'>" + getTitleRadio('radTrauma') + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblAgevolazione + "</a></td><td class='valIns'>" + getTitleRadio('radAgevolazione') + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblCodFisc + "</a></td><td class='valIns'>" + $('#txtCodFisc').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelIntestazione' colSpan='2'><a>" + traduzione.fldResidenza + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblIndirizzo + "</a></td><td class='valIns'>" + $('#txtIndirizzo').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblComune + "</a></td><td class='valIns'>" + $('#txtComune').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblCAP + "</a></td><td class='valIns'>" + $('#txtCAP').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblProvincia + "</a></td><td class='valIns'>" + $('#txtProvincia').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelIntestazione' colSpan='2'><a>" + traduzione.fldReperibilita + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblNome + "</a></td><td class='valIns'>" + $('#txtNome').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblIndirizzoRepe + "</a></td><td class='valIns'>" + $('#txtIndirizzoRepe').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblComuneRepe + "</a></td><td class='valIns'>" + $('#txtComuneRepe').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblCAPRepe + "</a></td><td class='valIns'>" + $('#txtCAPRepe').val() + "</td></tr>" +
			"<tr class='trTable'><td class='labelInt'><a>" + traduzione.lblProvinciaRepe + "</a></td><td class='valIns'>" + $('#txtProvinciaRepe').val() + "</td></tr></table>";

			var dialogContent = $("<div id='divRiepilogo'></div>").html(table);

			$.dialog(dialogContent, {
				id: "dialogConfirm",
				title: traduzione.lblAnteprima,
				width: 800,
				height: 500,
				showBtnClose: false,
				modal: true,
				movable: true,
				ESCandClose: true,
				created: function () {
					$('.dialog').focus();
				},
				buttons:
					[{
						label: traduzione.butChiudi,
						action: function (ctx) {
							$.dialog.hide();
						}
					},
					{
						label: traduzione.butSalvaCert,
						keycode: "13",
						'classe': "butVerde",
						action: function (ctx) {
							$(".butSalva").trigger("click");
							$.dialog.hide();
						}
					}]
			});
		},
		beforeSave: function () {

			if (home.MMG_CHECK.isDead()) {
				if ((
						$("#txtNome").val() != '' ||
						$("#txtIndirizzoRepe").val() != '' ||
						$("#txtComuneRepe").val() != '' ||
						$("#txtCAPRepe").val() != '' ||
						$("#txtProvinciaRepe").val() != ''
				)
				&& (
						$("#txtNome").val() == '' ||
						(/[^ a-zA-Z]+/.test($("#txtNome").val())) ||
						$("#txtIndirizzoRepe").val() == '' ||
						$("#txtComuneRepe").val() == '' ||
						$("#txtCAPRepe").val() == '' ||
						$("#txtProvinciaRepe").val() == ''
				)) {
					home.NOTIFICA.error({
						message: "Compilare completamente i campi relativi all'indirizzo di reperibilit&agrave; (e inserire solo lettere nel Nominativo)",
						title: "Errore"
					});
					return false;

				} else {
					return true;
				}
			} else {
				return false;
			}
		},
		checkDateUguali: function () {

			var data_start = $("#h-txtDataMalattia").val();
			var data_end = $("#h-txtDataFine").val();

			if (data_start == data_end) {

				var radio = $("#radGiornataLavorata").data('RadioBox');
				radio.selectByValue("N");
				radio.disable();

			} else {

				CERTIFICATO_MALATTIA.setGiornataLavorata();
			}
		},
		setGiornataLavorata: function () {

			var today = moment().format('YYYYMMDD');

			if ($("#STATO_PAGINA").val() == 'I') {

				if ($("#h-txtDataMalattia").val() != today) {

					var radio = $("#radGiornataLavorata").data('RadioBox');
					radio.selectByValue("N");
					radio.disable();
				} else {

					var radio = $("#radGiornataLavorata").data('RadioBox');
					radio.selectByValue("");
					$("#h-radGiornataLavorata").val("");
					$("#radGiornataLavorata_N").removeClass("RBpulsSel");
					radio.enable();
				}
			}
		},
		checkDataFine: function () {

			if ($("#STATO_PAGINA").val() == 'M') {

				$("#hdiff").val('');
				var dataNuovaFine = $("#h-txtDataFine").val();

				var diff = dataFineMalattia - dataNuovaFine;
				//alert(diff);----->alert utile x quantificare la differenza fra le date
				if (diff < 0) {

					alert("La data impostata \u00E8 succcessiva a quella precedentemente inserita");
					diff = "errore";
					dataOriginale = DATE.format({date: dataFineMalattia, format: "YYYYMMDD", format_out: "DD/MM/YYYY"});

					$("#txtDataFine").val(dataOriginale);
					//$("#h-txtDataFine").val(dataFineMalattia);
				}

				$("#hdiff").val(diff);
			}
		},
		setLabelLink: function () {

			var url_login_portale_INPS = home.baseGlobal.URL_LOGIN_PORTALE_INPS;
			var url_progetto_tessera_sanitaria = home.baseGlobal.URL_PROGETTO_TESSERA_SANITARIA;

			$("#lblLogin").text("Login INPS").attr('href', url_login_portale_INPS).attr("target", "_blank");
			$("#lblProgTess").text("Progetto Tessera Sanitaria").attr('href', url_progetto_tessera_sanitaria).attr("target", "_blank");

		},
		setLayout: function () {

			if ($("#STATO_PAGINA").val() == 'I') {
				statoPagina = 'INS';
			} else {
				statoPagina = 'MOD';
			}

			$("#txtDataRilascio").attr("disabled", true);

			if (statoPagina == 'MOD') {

				$("#radRuolo").data('RadioBox').disable();
				$("#radTipoVisita").data('RadioBox').disable();
				$("#radGiornataLavorata").data('RadioBox').disable();
				$("#radTrauma").data('RadioBox').disable();
				$("#radAgevolazione").data('RadioBox').disable();
				$("#txtDataMalattia, #txtCodDiagnosi, #txtDiagnosi, #txtNoteDiagnosi").attr("disabled", true);
				$("#tabLavoratore, #li-tabLavoratore").hide();
				$("#lblCodDiagnosi, #lblDiagnosi").hide();
				$("#li-tabDatiCertificato").hide();
				$(".butRipulisci").hide();

			} else {
				CERTIFICATO_MALATTIA.showHideTab();
			}

			var $legend = $("#fldLavoratore legend");
			var nomePaziente = home.ASSISTITO.NOME_COMPLETO;
			$legend.html(nomePaziente);
			$("#lblTitolo").html($("#lblTitolo").html() + ' per l\'assistito   ' + nomePaziente);

			$("#butReset, #butLogin, #butResetRepe").parents().attr("colSpan", "2");
			$("#txtDataRilascio").next().hide();

			$("#lblErroreLogin").attr("colSpan", "4").css({"text-align": "center", "color": "red"});
			$("#butLogin").addClass("butVerde");
		},
		checkLogin: function () {

			var url = home.baseGlobal.URL_VERIFICA_LOGIN_INPS;
			var codFiscPaz = $("#txtCodFisc").val();
			var codAsl = $("#hCodAsl").val();
			var codReg = $("#hCodReg").val();
			var pinCode = $("#txtPin").val();
			var userName = $("#txtUsername").val();
			var userPwd = $("#txtPwd").val();

			var param = {codFiscPaz: codFiscPaz, codAsl: codAsl, codReg: codReg, pinCode: pinCode, userName: userName, userPwd: userPwd};

			var msg = "DEBUG: ";
			msg += "\nURL: " + url;
			msg += "\nCODICE FISCALE: " + codFiscPaz;
			msg += "\nCODICE ASL: " + codAsl;
			msg += "\nCODICE REGIONE: " + codReg;
			msg += "\nPINCODE: " + pinCode;
			msg += "\nUSERNAME: " + userName;
			msg += "\nPWD: " + userPwd;

			//home.logger.debug('INVIO CERTIFICATO DI MALATTIA: '+msg);

			$.support.cors = true;

			NS_LOADING.showLoading({"timeout": 30});

			var param_medico = {
					p_user: {v: $("#IDEN_PER").val(), t: 'N'},
					p_username: {v: $("#txtUsername").val(), t: 'V'},
					p_pwd: {v: $("#txtPwd").val(), t: 'V'},
					p_pincode: {v: $("#txtPin").val(), t: 'V'},
					p_ricorda_pwd: {v: $("#h-RicordaPwd").val(), t: 'V'},
					p_ricorda_pincode: {v: $("#h-RicordaPin").val(), t: 'V'},
					p_result: {t: 'V', d: 'O'}
			};

			$.ajax({
				type: "POST",
				url: url,
				data: param,
				dataType: "text",
				success: function (resp) {
					NS_LOADING.hideLoading();
					//alert('resp: '+resp);
					$.support.cors = false;
					if (resp != 'OK') {
						home.NOTIFICA.warning({
							message: resp.toString(),
							title: "Errore Login"
						});

						$("#lblErroreLogin").text(resp.toString());

						home.NS_MMG.confirm("Errore durante il tentativo di login. Salvare comunque i dati di accesso inseriti?", function () {
							var promise = home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
								datasource: 'MMG_DATI',
								id: 'SP_SAVE_INFO_MEDICO',
								parameter: param_medico
							});
						});

					} else {

						home.NOTIFICA.success({
							message: traduzione.lblMessaggioLoginOK,
							title: "Login"
						});

						CERTIFICATO_MALATTIA.showHideTab('SHOW');
						$("#lblErroreLogin").text(traduzione.lblMessaggioLoginOK);

						var promise = home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
							datasource: 'MMG_DATI',
							id: 'SP_SAVE_INFO_MEDICO',
							parameter: param_medico
						});
					}
					;
				},
				error: function (response) {
					NS_LOADING.hideLoading();
					$.support.cors = false;
					home.NOTIFICA.error({
						message: response.statusText,
						title: "Errore"
					});

					home.NS_MMG.confirm("Server di login non accessibile. Salvare comunque i dati di accesso inseriti?", function () {
						var promise = home.$.NS_DB.getTool({_logger: home.logger}).call_procedure({
							datasource: 'MMG_DATI',
							id: 'SP_SAVE_INFO_MEDICO',
							parameter: param_medico
						});
					});
				}
			});
		},
		successSave: function (pIdenEvento) {

			CERTIFICATO_MALATTIA.checkSuccess(pIdenEvento, 'ins');
		},
		checkSuccess: function (pIdenEvento, stato) {

			var url = home.baseGlobal.URL_VERIFICA_INVIO_INPS + pIdenEvento;
			var mess = '';
			if (stato == 'ins') {
				mess = "Invio a INPS eseguito correttamente";
			} else {
				mess = "Cancellazione eseguita correttamente";
			}

			NS_LOADING.showLoading({"timeout": 0});

			$.support.cors = true;
			$.ajax({
				type: "POST",
				url: url,
				dataType: "text",
				success: function (resp) {
					var esito = resp.split('*')[0];
					$.support.cors = false;
					NS_LOADING.hideLoading();

					if (esito == 'OK')
					{
						home.NOTIFICA.success({
							message: mess,
							title: "Successo"
						});

						if (stato == 'del') {
							home.NOTIFICA.info({
								message: "Annullamento: " + resp.split(':')[1],
								title: "Annullamento certificato",
								timeout: 0
							});
						}

						if ($("#STATO_PAGINA").val() == 'I') {
							if ($("#PROVENIENZA").val() == 'ELENCO_CERTIFICATI') {
								home.WK_CERTIFICATI.refreshWk();
							} else {
								home.NS_MMG.apri("MMG_WORKLIST_CERTIFICATI");
							}

						} else {
							home.WK_CERTIFICATI.refreshWk();
						}

						//TODO: probabilmente su IE chiude prima di fare le successive istruzioni
						NS_FENIX_SCHEDA.chiudi();

					}else{
					
						home.NOTIFICA.error({
							message: resp.split('*')[0],
							title: "Errore invio certificato a INPS",
							timeout: 8
						});
					}
				},
				error: function (response)
				{
					$.support.cors = false;
					NS_LOADING.hideLoading();

					home.NOTIFICA.error({
						message: response.statusText,
						title: "Errore"
					});
				}
			});

			return true;

		},
		showHideTab: function (type) {

			if (statoPagina != 'MOD') {
				$("#li-tabLogin").trigger("click");
			}

			if (type == 'SHOW') {
				$("#li-tabDatiCertificato, #li-tabLavoratore").show();
				if (statoPagina == 'MOD') {

					$(".butAnnulla").show();
					$("#tabLavoratore, #li-tabLavoratore").hide();
				}
				$("#li-tabDatiCertificato").trigger("click");

			} else {
				$("#tabDatiCertificato ,#tabLavoratore, #li-tabDatiCertificato, #li-tabLavoratore").hide();
			}
		},
		ripulisci: function () {

			if (confirm(traduzione.lblRipulisci)) {
				$(".RBpulsSel").removeClass("RBpulsSel");
				$("#txtDataMalattia, #txtDataFine, #txtCodDiagnosi, #txtDiagnosi, #txtNoteDiagnosi").val("");
				$("#h-txtDataMalattia, #h-txtDataFine, #h-txtCodDiagnosi, #h-txtDiagnosi, #txtNoteDiagnosi").val("");
			}
		},
		ripulisciIndirizzoRepe: function () {
			$("#txtNome, #txtIndirizzoRepe, #txtCivicoRepe, #txtComuneRepe, #txtProvinciaRepe, #txtCAPRepe").val("");
			$("#h-txtCouneRepe").val("");
		},
		ripulisciLogin: function () {

			if (confirm(traduzione.lblRipulisci)) {

				$("#txtUsername, #txtPwd, #txtPin").val("");
			}
		}
};

var AC = {
		select: function (riga) {

			$("#txtCodDiagnosi").val(riga.VALUE);
			$("#txtDiagnosi").val(riga.DESCR);
			$("#h-txtCodDiagnosi").val(riga.VALUE);
			$("#h-txtDiagnosi").val(riga.DESCR);
		},
		selectComune: function (riga) {

			$("#txtComune").val(riga.DESCR);
			$("#h-txtComune").val(riga.DESCR);//ci vuole DESCR (sembra strano ma e' cosi')
			$("#txtCAP").val(riga.CAP);
			$("#txtProvincia").val(riga.PROVINCIA);
		},
		selectComuneRepe: function (riga) {

			$("#txtComuneRepe").val(riga.DESCR);
			$("#h-txtComuneRepe").val(riga.DESCR);//ci vuole DESCR (sembra strano ma e' cosi')
			$("#txtCAPRepe").val(riga.CAP);
			$("#txtProvinciaRepe").val(riga.PROVINCIA);
		}
};
