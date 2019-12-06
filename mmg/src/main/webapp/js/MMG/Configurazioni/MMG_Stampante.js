$(document).ready(function () {
	STAMPANTE.init();
	STAMPANTE.setEvents();
	NS_FENIX_SCHEDA.registra = STAMPANTE.registra;

});

var config_stampa;

var STAMPANTE = {
	oggetto_salvataggio: {},
	valore_prec_combo_utente: "",
	init: function () {

		/*se il menu a tendina contiene scelte molto lunghe, il tasto 'Cancella configurazione' appare schiacciato...gli metto il title*/
		$("#but_CancellaImpostazioniUtente").attr("title", "Cancella configurazione");

		/*carico il combo iniziale con i valori di home.basePC.CONFIGURAZIONI_STAMPA_EXTRA*/
		if (LIB.isValid(home.basePC.CONFIGURAZIONI_STAMPA_EXTRA)) {
			config_stampa = JSON.parse(home.basePC.CONFIGURAZIONI_STAMPA_EXTRA);
			for (x in config_stampa) {
				var combo = document.getElementById('ImpostaUtente');
				var nuova_opzione = document.createElement('option');
				nuova_opzione.innerHTML = "Configurazione " + x;
				nuova_opzione.value = "_" + x;
				combo.appendChild(nuova_opzione);
			}
		} else {
			config_stampa = {};
		}

		/*carico i valori dei combo relativi alle stampanti*/
		var Main_Printer = document.getElementById('Main_Printer');
		var RR_Printer = document.getElementById('RR_Printer');
		var RB_Printer = document.getElementById('RB_Printer');
		var DemaPrinter = document.getElementById('DemaPrinter');

		STAMPANTE.caricaSelect(Main_Printer);
		STAMPANTE.caricaSelect(RR_Printer);
		STAMPANTE.caricaSelect(RB_Printer);
		STAMPANTE.caricaSelect(DemaPrinter);

		/*carico il nome del PC nell'header*/
		var nome_PC = home.basePC.IP;
		document.getElementById("lblTitolo").innerHTML = "<h2> STAMPANTI " + nome_PC + "</h2>";

		/*Configurazione ricetta bianca*/
		var options = ["su stampante predefinita", "su ricetta rossa", "su foglio bianco"];
		var values = ['STAMPANTE_DEFAULT', 'STAMPANTE_RICETTA_ROSSA', 'STAMPANTE_RICETTA_BIANCA'];
		var SceltaStampanteRB = document.getElementById('SceltaStampanteRB');
		for (var i = 0; i < options.length; i++) {
			var chose = document.createElement('option');
			chose.innerHTML = options[i];
			chose.value = values[i];
			SceltaStampanteRB.appendChild(chose);
		}

		STAMPANTE.getComboAttivoNonAttivo('Avviso_Conferma_Stampa');
		STAMPANTE.getComboAttivoNonAttivo('AvvisoDema');

		STAMPANTE.loadComboRotazione('B_Allineamento');
		STAMPANTE.loadComboRotazione('Allineamento');
		STAMPANTE.loadComboRotazione('DemaAllineamento');

		/*carico i combo delle stampanti coi valori di basePC */

		var ris = "";
		var default_printer = home.AppStampa.getDefaultPrinterName();

		ris = STAMPANTE.estraiValore_home("STAMPANTE_DEFAULT", default_printer);
		$('#Main_Printer').val(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_BIANCA", default_printer);
		$('#RB_Printer').val(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_ROSSA", default_printer);
		$('#RR_Printer').val(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_DEMA", default_printer);
		$('#DemaPrinter').val(ris);

		ris = STAMPANTE.estraiValore_home("CONFERMA_STAMPA_RICETTA", "N");
		$('#Avviso_Conferma_Stampa').val(ris);

		ris = STAMPANTE.estraiValore_home("AVVISO_STAMPA_DEMA", "S");
		$('#AvvisoDema').val(ris);

		ris = STAMPANTE.estraiValore_home("TIPO_STAMPANTE_RICETTA_BIANCA", home.NS_PRINT.array_report_stampante["RICETTA_BIANCA"]);
		$('#SceltaStampanteRB').val(ris);

		ris = STAMPANTE.estraiValore_home("DESCRIZIONE", home.basePC["IP"] + " - " + home.baseUser.USERNAME);
		$('#Descrizione_PC').val(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_ROSSA_OPZIONI", home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA);
		STAMPANTE.impostaParamRossa(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_BIANCA_OPZIONI", home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA);
		STAMPANTE.impostaParamBianca(ris);

		ris = STAMPANTE.estraiValore_home("STAMPANTE_RICETTA_DEMA_OPZIONI", home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_DEMA_A4);
		STAMPANTE.impostaParamDema(ris);

		/*faccio sparire il field delle scelte per la ricetta bianca a seconda del valore che trova in basePC*/
		/*carico il valore del combo relativo al medico*/
		var user = home.baseUser.IDEN_PER;
		var opzione_rb_caricata = "";
		var medico = "_" + user;
		if (home.basePC["CONFIGURAZIONE_STAMPANTI_" + user] == 'S') {
			opzione_rb_caricata = home.basePC["TIPO_STAMPANTE_RICETTA_BIANCA" + medico];
			STAMPANTE.setValoreUtente(medico);
		} else {
			opzione_rb_caricata = home.basePC.TIPO_STAMPANTE_RICETTA_BIANCA;
		}
		$("#SceltaStampanteRB").attr("class", "rb_" + opzione_rb_caricata);

		if (opzione_rb_caricata != 'STAMPANTE_RICETTA_BIANCA') {
			$("#fldRBPrinter").hide();
			$("#but_Impost_Predef_RB").hide();
			$("#but_Impost_Predef_RB_LS").hide();
			$("#but_Impost_Predef_RB_A5").hide();
			$("#but_Impost_Predef_RB_A5_LS").hide();
			$("#butStampa_di_Prova_RB").hide();
		}

		if (STAMPANTE.estraiValoreUtente() == "") {
			$("#but_CancellaImpostazioniUtente").hide();
		} else {
			$("#but_CancellaImpostazioniUtente").show();
		}

		var combo = document.getElementById("ImpostaUtente");
		for (var w = 0; w < combo.options.length; w++) {
			var selezionata = combo.options[w].value;
			if (selezionata != "_" && LIB.isValid(home.basePC["CONFIGURAZIONE_STAMPANTI" + selezionata])) {
				$('select>option[value ="' + selezionata + '"]').addClass("profilo");
			}
		}

		if (home.basePC.REPORT_FARMACI != home.baseGlobal.REPORT_FARMACI || home.basePC.REPORT_PRESTAZIONI != home.baseGlobal.REPORT_PRESTAZIONI) {
			$("#tabRR_Printer legend:first").text($("#tabRR_Printer legend:first").text() + " (report personalizzato)");
		}
	},
	getComboAttivoNonAttivo: function (elem_id) {
		var attivo = ["Attivo", "Non Attivo"];
		var valori = ['S', 'N'];
		var Scelta = document.getElementById(elem_id);
		for (var i = 0; i < attivo.length; i++) {
			var chose = document.createElement('option');
			chose.innerHTML = attivo[i];
			chose.value = valori[i];
			Scelta.appendChild(chose);
		}
	},
	setEvents: function () {

		$("#but_ConfigurazioniStampa").on("click", function () {
			STAMPANTE.aggiungiOpzione();
		});

		$("#butStampa_di_Prova").on("click", function () {
			var stampa_di_prova = STAMPANTE.getValori();
			home.NS_PRINT_CONFIG.testStampaRR(stampa_di_prova.p_stampante_RR, stampa_di_prova.p_parametri_stampa_RR);
		});

		$("#butStampa_di_Prova_RB").on("click", function () {
			var stampa_di_prova_RB = STAMPANTE.getValori();
			home.NS_PRINT_CONFIG.testStampaRB(stampa_di_prova_RB.p_stampante_RB, stampa_di_prova_RB.p_parametri_stampa_RB, "", stampa_di_prova_RB.p_tipo_report_FB, stampa_di_prova_RB.p_stampante_RR, stampa_di_prova_RB.p_parametri_stampa_RR);
		});

		$("#butStampaProvaDema").on("click", function () {
			var stampa_di_prova_Dema = STAMPANTE.getValori();
			home.NS_PRINT_CONFIG.testStampaDema(stampa_di_prova_Dema.p_stampante_DEMA, stampa_di_prova_Dema.p_parametri_stampa_DEMA);
		});

		$("#but_Impost_Predef_RR").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA_RR;
			STAMPANTE.impostaParamRossa(str_impostazioni_predefinite);
		});

		/*Il nome del report farmaci viene usato per definire quali siano le impostazioni predefinite da usare*/
		var report_farmaci = LIB.getParamPcGlobal("REPORT_FARMACI", "FARMACI.RPT");

		$("#but_Impost_Predef_RR_A4").on("click", function () {
			var str_impostazioni_predefinite;
			if (report_farmaci == "FARMACI.RPT") {
				str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA;
			} else {
				str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA_A4;
			}
			STAMPANTE.impostaParamRossa(str_impostazioni_predefinite);
		});

		$("#but_Impost_Predef_RR_A4_LS").on("click", function () {
			var str_impostazioni_predefinite;
			if (report_farmaci == "FARMACI.RPT") {
				str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA_LANDSCAPE;
			} else {
				str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_ROSSA_A4_LANDSCAPE;
			}
			STAMPANTE.impostaParamRossa(str_impostazioni_predefinite);
		});

		$("#but_Impost_JOLLY_RR").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.JOLLY;
			STAMPANTE.impostaParamRossa(str_impostazioni_predefinite);
		});
		$("#but_Impost_JOLLY_RR").hide();

		$("#but_Impost_Predef_RB").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA;
			STAMPANTE.impostaParamBianca(str_impostazioni_predefinite);
		});
		
		$("#but_Impost_Predef_RB_LS").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA_LANDSCAPE;
			STAMPANTE.impostaParamBianca(str_impostazioni_predefinite);
		});
		
		$("#but_Impost_Predef_RB_A5").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA_A5;
			STAMPANTE.impostaParamBianca(str_impostazioni_predefinite);
		});
		
		$("#but_Impost_Predef_RB_A5_LS").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA_A5_LANDSCAPE;
			STAMPANTE.impostaParamBianca(str_impostazioni_predefinite);
		});

		$("#butImpostPredefDema").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_DEMA;
			STAMPANTE.impostaParamDema(str_impostazioni_predefinite);
		});

		$("#butImpostPredefDemaA4").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_DEMA_A4;
			STAMPANTE.impostaParamDema(str_impostazioni_predefinite);
		});

		$("#butImpostPredefDemaRB").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.STAMPANTE_RICETTA_BIANCA;
			STAMPANTE.impostaParamDema(str_impostazioni_predefinite);
		});

		$("#but_Impost_JOLLY_Dema").on("click", function () {
			var str_impostazioni_predefinite = home.NS_PRINT.array_stampante_opzioni.JOLLY;
			STAMPANTE.impostaParamDema(str_impostazioni_predefinite);
		});
		$("#but_Impost_JOLLY_Dema").hide();

		$("#txtAltezza").on("blur", function () {
			numero = $("#txtAltezza").val();
			id = "#txtAltezza";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#txtLarghezza").on("blur", function () {
			numero = $("#txtLarghezza").val();
			id = "#txtLarghezza";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#txtMarTop").on("blur", function () {
			numero = $("#txtMarTop").val();
			id = "#txtMarTop";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#txtMarRight").on("blur", function () {
			numero = $("#txtMarRight").val();
			id = "#txtMarRight";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#txtMarBottom").on("blur", function () {
			numero = $("#txtMarBottom").val();
			id = "#txtMarBottom";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#txtMarLeft").on("blur", function () {
			numero = $("#txtMarLeft").val();
			id = "#txtMarLeft";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtAltezza").on("blur", function () {
			numero = $("#B_txtAltezza").val();
			id = "#B_txtAltezza";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtLarghezza").on("blur", function () {
			numero = $("#B_txtLarghezza").val();
			id = "#B_txtLarghezza";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtMarTop").on("blur", function () {
			numero = $("#B_txtMarTop").val();
			id = "#B_txtMarTop";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtMarRight").on("blur", function () {
			numero = $("#B_txtMarRight").val();
			id = "#B_txtMarRight";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtMarBottom").on("blur", function () {
			numero = $("#B_txtMarBottom").val();
			id = "#B_txtMarBottom";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#B_txtMarLeft").on("blur", function () {
			numero = $("#B_txtMarLeft").val();
			id = "#B_txtMarLeft";
			STAMPANTE.checkNumber(numero, id);
		});

		$("#SceltaStampanteRB").on("change", function () {

			var controllo = $("#SceltaStampanteRB").val();

			$("#SceltaStampanteRB").attr("class", "rb_" + controllo);

			if (controllo == "STAMPANTE_RICETTA_BIANCA") {

				$("#fldRBPrinter").show();
				$("#but_Impost_Predef_RB").show();
				$("#but_Impost_Predef_RB_LS").show();
				$("#but_Impost_Predef_RB_A5").show();
				$("#but_Impost_Predef_RB_A5_LS").show();
				$("#butStampa_di_Prova_RB").show();
			}

			else {

				$("#fldRBPrinter").hide();
				$("#but_Impost_Predef_RB").hide();
				$("#but_Impost_Predef_RB_LS").hide();
				$("#but_Impost_Predef_RB_A5").hide();
				$("#but_Impost_Predef_RB_A5_LS").hide();
				$("#butStampa_di_Prova_RB").hide();
			}
		});

		$("#but_CancellaImpostazioniUtente").on("click", function () {

			var r = confirm("Le impostazioni per l'utente scelto verrano cancellate al salvataggio. Procedere?");
			if (r == true) {

				var utente_scelto = STAMPANTE.estraiValoreUtente();
				STAMPANTE.salvaImpostazioniInOggetto(utente_scelto);
				var selOpt = $("#ImpostaUtente").find('option[value ="' + utente_scelto + '"]');

				selOpt.removeClass("profilo");

				var selNew = selOpt.clone();

				selOpt.html(selNew.html());
				selOpt.addClass("cancellato");
				/*
				 $('select>option[value ="' + utente_scelto + '"]').removeClass("profilo");
				 $('select>option[value ="' + utente_scelto + '"]').addClass("cancellato");
				 $("#ImpostaUtente").find('option[value ="' + utente_scelto + '"]').css("background","red");
				 $("#ImpostaUtente").find('option[value ="' + utente_scelto + '"]').addClass("cancellato");
				 */

				//$("#ImpostaUtente").val("--impostazioni globali--");//ma adesso andra' su chrome???
				STAMPANTE.setValoreUtente("_");
				$("#ImpostaUtente").change();

				STAMPANTE.oggetto_salvataggio[utente_scelto].p_attivo = "N";

				utente_scelto = utente_scelto.replace("_", "");
				delete config_stampa[utente_scelto];

			}
			;

		});

		$("#ImpostaUtente").on("focus", function () {
			STAMPANTE.valore_prec_combo_utente = STAMPANTE.estraiValoreUtente();
			STAMPANTE.salvaImpostazioniInOggetto(STAMPANTE.valore_prec_combo_utente);
		}).on("change", function () {
			//1) salva impostazioni correnti in un oggetto (getValori ecc.) FATTO
			//2) crea un oggetto analogo da passare a caricaImpostazioniMedico
			//	a) se esiste gia' per quell'utente gli passa quello
			//	b) se non esiste lo crea da basePC

			var scelta = STAMPANTE.estraiValoreUtente();

			if (scelta != ""
					&& !LIB.isValid(STAMPANTE.oggetto_salvataggio[scelta])
					&& !LIB.isValid(home.basePC["CONFIGURAZIONE_STAMPANTI" + scelta])) {
				if (!confirm("Creare una configurazione delle stampanti per l'utente selezionato?")) {
					STAMPANTE.setValoreUtente(STAMPANTE.valore_prec_combo_utente);
					return;
				}
				;
			}

			var selectedOpt = $("#ImpostaUtente").find('option[value ="' + scelta + '"]');
			var selectedNew = selectedOpt.clone();
			if (LIB.isValid(STAMPANTE.oggetto_salvataggio[scelta]) && STAMPANTE.oggetto_salvataggio[scelta].p_attivo == "N") {
				home.NOTIFICA.warning({
					message: "La cancellazione della configurazione per questo utente &egrave; stata annullata.", //\u00E8-->per la " e' ";
					title: "Attenzione"
				});
				//$('select>option[value ="' + scelta + '"]').removeClass("cancellato");
				//var selectedOpt = $("#ImpostaUtente").find('option[value ="' + scelta + '"]');

				selectedOpt.removeClass("cancellato");
				//var selectedNew = selectedOpt.clone();

			}

			if (scelta == "") {
				$("#but_CancellaImpostazioniUtente").hide();
			} else {
				$("#but_CancellaImpostazioniUtente").show();
				//$('select>option[value ="' + scelta + '"]').addClass("profilo");


				selectedOpt.html(selectedNew.html());
				selectedOpt.addClass("profilo");
			}
			STAMPANTE.caricaImpostazioniMedico(STAMPANTE.getOggettoImpostazioni(scelta));

		});
		$("#butPageScaleRR, #butPageScaleRB, #butPageScaleDema").on("click", function () {
			NS_MMG_UTILITY.buttonSwitch($(this));
		});

	},
	registra: function () {

		var utente_corrente = STAMPANTE.estraiValoreUtente();
		STAMPANTE.salvaImpostazioniInOggetto(utente_corrente);
		var semafori = new Array();
		for (var i in STAMPANTE.oggetto_salvataggio) {
			STAMPANTE.oggetto_salvataggio[i].p_descrizione_pc = $("#Descrizione_PC").val();
			STAMPANTE.oggetto_salvataggio[i].p_configurazione_stampa = JSON.stringify(config_stampa);
			STAMPANTE.oggetto_salvataggio[i].p_report_farmaci = LIB.getParamPcGlobal("REPORT_FARMACI", "FARMACI.RPT");
			STAMPANTE.oggetto_salvataggio[i].p_report_prestazioni = LIB.getParamPcGlobal("REPORT_PRESTAZIONI", "PRESTAZIONI.RPT");
			var parametro = {};
			for (var param in STAMPANTE.oggetto_salvataggio[i]) {
				parametro[param] = {v: STAMPANTE.oggetto_salvataggio[i][param], t:'V'};
			}
			parametro.p_result = {t: 'V', d: 'O'};
			var saver = function (parametro, semaforo_precedente) {
				var semaforo_corrente = $.Deferred();
				$.when(semaforo_precedente).then(function() {
					$.when(home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
						id:'MMG_CONFIG.PRINT_SAVE',
						parameter: parametro
					})).then(function() {
						semaforo_corrente.resolve();
					});
					console.log(parametro);
				});
				return semaforo_corrente;
			};
			if (i == 0) {
				semafori.push(saver(parametro,$.Deferred().resolve()));
			} else {
				semafori.push(saver(parametro,semafori[i]));
			}
		}
		$.when.apply($, semafori).then(function() {
			home.NS_MMG.reloadPC(true);
		});
	},
	estraiValoreUtente: function () {
		var rit = $("#ImpostaUtente option:selected")[0].getAttribute("value", 2);//$("#ImpostaUtente").val();
		if (rit == "_")
			return "";
		else
			return rit;
	},
	setValoreUtente: function (selezionato) {
		if (selezionato == "")
			selezionato = "_";
		$("#ImpostaUtente").val(selezionato);
	},
	estraiUtente: function (combo_value) {

		var sel_text = $('select>option[value ="' + combo_value + '"]').text();
		/*var combo = document.getElementById("ImpostaUtente");
		 for(var w=0; w<combo.options.length; w++){
		 
		 if(combo.options[w].value == combo_value){
		 return combo.options[w].text;
		 break;
		 }
		 }*/
		return sel_text;

	},
	salvaImpostazioniInOggetto: function (val_combo_utente) {
		var oggetto = STAMPANTE.getValori();
		//alert(val_combo_utente + " " + JSON.stringify(oggetto));
		STAMPANTE.oggetto_salvataggio[val_combo_utente] = oggetto;
	},
	chiudiScheda: function () {

		home.NS_FENIX_TOP.chiudiUltima();
	},
	checkNumber: function (numero, id) {

		if (isNaN(numero)) {

			alert("Inserire un numero");
			$(id).val('');
			$(id).focus();
		}
	},
	caricaSelect: function (Printer) {

		var stampanti = home.NS_PRINT_CONFIG.getPrinterList();

		for (var i = 0; i < stampanti.printers.length; i++) {
			//if (stampanti.printers[i] !="Fax"){
			if (stampanti.printers[i].toUpperCase().indexOf('FAX') === -1) {
				var opt = document.createElement('option');
				opt.innerHTML = stampanti.printers[i];
				opt.value = stampanti.printers[i];
				Printer.appendChild(opt);
			}
		}
	},
	getOggettoImpostazioni: function (nuova_scelta) {
		if (LIB.isValid(STAMPANTE.oggetto_salvataggio[nuova_scelta])) {
			return STAMPANTE.oggetto_salvataggio[nuova_scelta];
		}
		if (LIB.isValid(home.basePC["CONFIGURAZIONE_STAMPANTI" + nuova_scelta])) {

			var conf_s = STAMPANTE.creaOggetto(nuova_scelta);
			return conf_s;
		}
		else {
			var conf_n = STAMPANTE.creaOggetto("");
			return conf_n;
		}
	},
	creaOggetto: function (ut) {

		var oggetto = {};
		oggetto.p_stampante_default = home.basePC["STAMPANTE_DEFAULT" + ut];
		oggetto.p_stampante_RR = home.basePC["STAMPANTE_RICETTA_ROSSA" + ut];
		oggetto.p_stampante_RB = home.basePC["STAMPANTE_RICETTA_BIANCA" + ut];
		oggetto.p_stampante_DEMA = home.basePC["STAMPANTE_RICETTA_DEMA" + ut];
		oggetto.p_conferma_stampa = home.basePC["CONFERMA_STAMPA_RICETTA" + ut];
		oggetto.p_avviso_stampa_dema = home.basePC["AVVISO_STAMPA_DEMA" + ut];
		oggetto.p_descrizione_pc = home.basePC["DESCRIZIONE"];
		oggetto.p_tipo_stampante_RB = home.basePC["TIPO_STAMPANTE_RICETTA_BIANCA" + ut];
		oggetto.p_parametri_stampa_RR = home.basePC["STAMPANTE_RICETTA_ROSSA_OPZIONI" + ut];
		oggetto.p_parametri_stampa_RB = home.basePC["STAMPANTE_RICETTA_BIANCA_OPZIONI" + ut];
		oggetto.p_parametri_stampa_DEMA = home.basePC["STAMPANTE_RICETTA_DEMA_OPZIONI" + ut];
		return oggetto;
	},
	caricaImpostazioniMedico: function (oggetto_impostato) {

		$('#Main_Printer').val(oggetto_impostato.p_stampante_default);
		$('#RB_Printer').val(oggetto_impostato.p_stampante_RB);
		$('#RR_Printer').val(oggetto_impostato.p_stampante_RR);
		$('#DemaPrinter').val(oggetto_impostato.p_stampante_DEMA);
		$('#Avviso_Conferma_Stampa').val(oggetto_impostato.p_conferma_stampa);
		$('#AvvisoDema').val(oggetto_impostato.p_avviso_stampa_dema);
		//$('#Descrizione_PC').val(oggetto_impostato.p_descrizione_pc);

		$('#SceltaStampanteRB').val(oggetto_impostato.p_tipo_stampante_RB);
		$("#SceltaStampanteRB").attr("class", "rb_" + oggetto_impostato.p_tipo_stampante_RB);

		if (oggetto_impostato.p_tipo_stampante_RB != 'STAMPANTE_RICETTA_BIANCA') {

			$("#fldRBPrinter").hide();
			$("#but_Impost_Predef_RB").hide();
			$("#but_Impost_Predef_RB_LS").hide();
			$("#but_Impost_Predef_RB_A5").hide();
			$("#but_Impost_Predef_RB_A5_LS").hide();
			$("#butStampa_di_Prova_RB").hide();
		}
		else {

			$("#fldRBPrinter").show();
			$("#but_Impost_Predef_RB").show();
			$("#but_Impost_Predef_RB_LS").show();
			$("#but_Impost_Predef_RB_A5").show();
			$("#but_Impost_Predef_RB_A5_LS").show();
			$("#butStampa_di_Prova_RB").show();
		}

		STAMPANTE.impostaParamRossa(oggetto_impostato.p_parametri_stampa_RR);
		STAMPANTE.impostaParamBianca(oggetto_impostato.p_parametri_stampa_RB);
		STAMPANTE.impostaParamDema(oggetto_impostato.p_parametri_stampa_DEMA);
	},
	impostaParamRossa: function (param_stringa) {
		var RR_printer_val = home.NS_PRINT_CONFIG.getOpzioniParam(param_stringa);
		$("#txtMarTop").val(RR_printer_val.marginTop);
		$("#txtMarRight").val(RR_printer_val.marginRight);
		$("#txtMarBottom").val(RR_printer_val.marginBottom);
		$("#txtMarLeft").val(RR_printer_val.marginLeft);
		if (RR_printer_val.autoRotateAndCenter == "true") {
			$("#Allineamento").val("auto");
		} else {
			$("#Allineamento").val(RR_printer_val.pageOrientation);
		}
		$("#txtAltezza").val(RR_printer_val.pageHeight);
		$("#txtLarghezza").val(RR_printer_val.pageWidth);
		if (RR_printer_val.pageScale == "1") {
			NS_MMG_UTILITY.buttonSelect($("#butPageScaleRR"));
		} else {
			NS_MMG_UTILITY.buttonDeselect($("#butPageScaleRR"));
		}
	},
	impostaParamBianca: function (param_stringa) {
		var RB_printer_val = home.NS_PRINT_CONFIG.getOpzioniParam(param_stringa);
		$("#B_txtMarTop").val(RB_printer_val.marginTop);
		$("#B_txtMarRight").val(RB_printer_val.marginRight);
		$("#B_txtMarBottom").val(RB_printer_val.marginBottom);
		$("#B_txtMarLeft").val(RB_printer_val.marginLeft);
		if (RB_printer_val.autoRotateAndCenter == "true") {
			$("#B_Allineamento").val("auto");
		} else {
			$("#B_Allineamento").val(RB_printer_val.pageOrientation);
		}
		$("#B_txtAltezza").val(RB_printer_val.pageHeight);
		$("#B_txtLarghezza").val(RB_printer_val.pageWidth);
		if (RB_printer_val.pageScale == "1") {
			NS_MMG_UTILITY.buttonSelect($("#butPageScaleRB"));
		} else {
			NS_MMG_UTILITY.buttonDeselect($("#butPageScaleRB"));
		}
	},
	impostaParamDema: function (param_stringa) {
		var DEMA_printer_val = home.NS_PRINT_CONFIG.getOpzioniParam(param_stringa);
		$("#txtDemaMarTop").val(DEMA_printer_val.marginTop);
		$("#txtDemaMarRight").val(DEMA_printer_val.marginRight);
		$("#txtDemaMarBottom").val(DEMA_printer_val.marginBottom);
		$("#txtDemaMarLeft").val(DEMA_printer_val.marginLeft);
		if (DEMA_printer_val.autoRotateAndCenter == "true") {
			$("#DemaAllineamento").val("auto");
		} else {
			$("#DemaAllineamento").val(DEMA_printer_val.pageOrientation);
		}
		$("#txtDemaAltezza").val(DEMA_printer_val.pageHeight);
		$("#txtDemaLarghezza").val(DEMA_printer_val.pageWidth);
		if (DEMA_printer_val.pageScale == "1") {
			NS_MMG_UTILITY.buttonSelect($("#butPageScaleDema"));
		} else {
			NS_MMG_UTILITY.buttonDeselect($("#butPageScaleDema"));
		}
	},
	estraiValore_home: function (parametro, def) {
		var medico_user = home.baseUser.IDEN_PER;
		var str = home.basePC["CONFIGURAZIONE_STAMPANTI_" + medico_user];
		var valore;
		if (str == 'S') {
			if (LIB.isValid(home.basePC[parametro + "_" + medico_user])) {
				valore = home.basePC[parametro + "_" + medico_user];
				//alert("s");
				return valore;
			} else {
				if (LIB.isValid(home.basePC[parametro])) {
					valore = home.basePC[parametro];
					//alert("s basePC");
					return valore;
				} else {
					valore = def;
					//alert("s default");
					return valore;
				}
			}
			return valore;
		} else {
			if (LIB.isValid(home.basePC[parametro])) {
				valore = home.basePC[parametro];
				//alert("non s basePC");
				return valore;
			} else {
				valore = def;
				//alert("non s default");
				return valore;
			}
		}
		return valore;
	},
	getValori: function () {
		var ritorno = {};
		ritorno.p_pc = home.basePC.IP;
		ritorno.p_medico = STAMPANTE.estraiValoreUtente();
		ritorno.p_attivo = "S";
		ritorno.p_descrizione_pc = $("#Descrizione_PC").val();

		ritorno.p_conferma_stampa = $("#Avviso_Conferma_Stampa").val();
		ritorno.p_avviso_stampa_dema = $("#AvvisoDema").val();
		ritorno.p_stampante_default = $("#Main_Printer").val();
		ritorno.p_stampante_RR = $("#RR_Printer").val();
		ritorno.p_stampante_RB = $("#RB_Printer").val();
		ritorno.p_stampante_DEMA = $("#DemaPrinter").val();

		var contr = $("#SceltaStampanteRB").val();
		switch (contr) {
			case "STAMPANTE_DEFAULT":
				ritorno.p_tipo_report_FB = "RICETTA_BIANCA";
				ritorno.p_tipo_report_PB = "RICETTA_BIANCA";
				ritorno.p_tipo_stampante_RB = "STAMPANTE_DEFAULT";
				break;
			case "STAMPANTE_RICETTA_ROSSA":
				ritorno.p_tipo_report_FB = "FARMACI";
				ritorno.p_tipo_report_PB = "PRESTAZIONI";
				ritorno.p_tipo_stampante_RB = "STAMPANTE_RICETTA_ROSSA";
				break;
			default:
				ritorno.p_tipo_report_FB = "RICETTA_BIANCA";
				ritorno.p_tipo_report_PB = "RICETTA_BIANCA";
				ritorno.p_tipo_stampante_RB = 'STAMPANTE_RICETTA_BIANCA';
		}

		var param_DEMA = {};

		param_DEMA.pageHeight = $("#txtDemaAltezza").val();
		param_DEMA.pageWidth = $("#txtDemaLarghezza").val();
		param_DEMA.marginTop = $("#txtDemaMarTop").val();
		param_DEMA.marginBottom = $("#txtDemaMarBottom").val();
		param_DEMA.marginLeft = $("#txtDemaMarLeft").val();
		param_DEMA.marginRight = $("#txtDemaMarRight").val();
		STAMPANTE.getAllineamento(param_DEMA, "#DemaAllineamento");
		STAMPANTE.getPageScale(param_DEMA, "#butPageScaleDema");

		var param_RB = {};

		param_RB.pageHeight = $("#B_txtAltezza").val();
		param_RB.pageWidth = $("#B_txtLarghezza").val();
		param_RB.marginTop = $("#B_txtMarTop").val();
		param_RB.marginBottom = $("#B_txtMarBottom").val();
		param_RB.marginLeft = $("#B_txtMarLeft").val();
		param_RB.marginRight = $("#B_txtMarRight").val();
		STAMPANTE.getAllineamento(param_RB, "#B_Allineamento");
		STAMPANTE.getPageScale(param_RB, "#butPageScaleRB");

		var param = {};

		param.pageHeight = $("#txtAltezza").val();
		param.pageWidth = $("#txtLarghezza").val();
		param.marginTop = $("#txtMarTop").val();
		param.marginBottom = $("#txtMarBottom").val();
		param.marginLeft = $("#txtMarLeft").val();
		param.marginRight = $("#txtMarRight").val();
		STAMPANTE.getAllineamento(param, "#Allineamento");
		STAMPANTE.getPageScale(param, "#butPageScaleRR");

		ritorno.p_parametri_stampa_RR = home.NS_PRINT_CONFIG.getOpzioniStringa(param);
		ritorno.p_parametri_stampa_RB = home.NS_PRINT_CONFIG.getOpzioniStringa(param_RB);
		ritorno.p_parametri_stampa_DEMA = home.NS_PRINT_CONFIG.getOpzioniStringa(param_DEMA);

		return ritorno;
	},
	getAllineamento: function (oggetto, allineamento_id) {
		var allineamento = $(allineamento_id).val();
		if (allineamento == "auto") {
			oggetto.pageOrientation = 1;
			oggetto.autoRotateandCenter = "true";
		} else {
			oggetto.pageOrientation = allineamento;
			oggetto.autoRotateandCenter = "false";
		}
		return oggetto;
	},
	getPageScale: function (oggetto, scale_id) {
		if ($(scale_id + ".selected").length > 0) {
			oggetto.pageScale = "1";
		} else {
			oggetto.pageScale = "0";
		}
	},
	loadComboRotazione: function (id_combo) {

		var array = [
			{value: "1", descr: "0&#176;"},
			{value: "2", descr: "90&#176;"},
			{value: "auto", descr: "automatica"}
		];
		var combo = document.getElementById(id_combo);
		for (var i = 0; i < array.length; i++) {
			var chose = document.createElement('option');
			chose.innerHTML = array[i].descr;
			chose.value = array[i].value;
			combo.appendChild(chose);
		}
	},
	aggiungiOpzione: function () {

		if ($("#txtConfigStampa").val() != "") {

			var codice = $("#txtConfigStampa").val();
			codice = codice.replace(/ /g, "_");
			codice = codice.replace(/[|&;$%@"<>()+,\/\\]/g, "-");
			for (x in config_stampa) {
				if (x == codice) {

					alert("Il nome inserito \u00E8 gi\u00E0 presente nelle configurazioni salvate.");
					$("#txtConfigStampa").val("");
					return
				}
			}

			var valore = "Configurazione " + codice;
			config_stampa[codice] = '';
			$("#txtConfigStampa").val("");

			var combo = document.getElementById('ImpostaUtente');
			var nuova_opzione = document.createElement('option');
			nuova_opzione.innerHTML = valore;
			nuova_opzione.value = "_" + codice;
			combo.appendChild(nuova_opzione);
			$('#ImpostaUtente').trigger("focus");
			$('#ImpostaUtente').val(nuova_opzione.value);
			$('#ImpostaUtente').trigger("change");
		} else {
			home.NOTIFICA.warning({
				message: "Inserire un nome per la configurazione che si desidera creare.",
				title: "Attenzione"
			});
			$("#txtConfigStampa").val('Nuova configurazione').select().focus();

		}

		//$('select>option:eq(3)').attr('selected', true);
	}

};