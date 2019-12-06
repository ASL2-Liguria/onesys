/**
 * User:  matteop, alessandroa
 * Date: 28/08/2013
 * Time: 10:10
 *
 * 20140313 - alessandro.arrighi - Gestione Metadati Tramite Map. <br />
 * 20140313 - alessandro.arrighi - Ottimizzazione Caricamento Dati da JSON. <br />
 * 20140522 - alessandro.arrighi - Gestione Chiamata Controller tramite POST. <br />
 * 20140722 - alessandro.arrighi - Correzioni su chiamata metodo Dimissione. <br />
 * 20140801 - alessandro.arrighi - Ottimizzazione Visualizzazione Button Stampa SDO. <br />
 * 20140801 - alessandro.arrighi - Ottimizzazione Funzioni + Stesura Commenti + AggiuntI Files per Gestione ICD e DRG (DimissioneICD.js e DimissioneDRG.js). <br />
 * 20140818 - matteo.pipitone - modifica setCodiceDRG
 * 20140827 - matteo.pipitone - modifica valorizeDateFromWhale dovrebbe valorizzare la data dimissione con la data registrata su whale
 * 20140911 - alessandro.arrighi - gestione Firma SDO
 * 20141014 - alessandro.arrighi - gestione utente compilatore SDO
 * 20141015 - alessandro.arrighi - gestione check Dimissione e Dimissione Protetta. Dimissione Protetta selezionabile solo se dimesso.
 * 20141016 - alessandro.arrighi - Reperimento diagnosi dimissione da Cartella Clinica se valorizzata.
 * 20141215 - alessandro.arrighi - Invocazione Chiamate a Controller tramite NS_CONTATTO_METHODS
 * 20160118 - matteo.pipitone - aggiunto controllo sulle date intervento
 */
var NS_DIMISSIONE_SDO = {

	SDOFirmata : false,
	SDOCompleta : false,
	SDOProgressivo : null,
	SDOCorrente : null,
	SDOInserita : null,
	ICDSuccess : true,

	hasTraumatismi : function(){
		return $("#cmbTraumatismiDimissione").find("option:selected").val().length > 0;
	},
	hasCausaEsterna : false,
	hasCategoriaCausaEsterna : false,
	hasDiagnosiTraumatica : false,
	isDiagnosiTraumatica : false,

	idenCdcDimi:null,
	flagIntDS:null,
	bloccoSalvataggio:false,

	init: function(){

		NS_DIMISSIONE_SDO.getSDO(function(){
			NS_DIMISSIONE_SDO.setStyle();
			NS_DIMISSIONE_SDO.setEvents();
			NS_DIMISSIONE_SDO.Setter.setButtonScheda();
			NS_FENIX_SCHEDA.addFieldsValidator({config : "V_ADT_DIMI"});
			NS_CHECK_A03.setSpecialitaCDCDimissione({CDC : _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].provenienza.idCentroDiCosto});
			NS_DIMISSIONE_SDO.overrideRegistra();
		});

		$("#acMedicoDimi").data('acList').returnSelected({DESCR:_JSON_CONTATTO.uteDimissione.descrizione,VALUE:_JSON_CONTATTO.uteDimissione.id});
	},

	setEvents: function() {


		home.NS_CONSOLEJS.addLogger({name: 'TAB_DIMISSIONE', console: 0});
		window.logger = home.NS_CONSOLEJS.loggers['TAB_DIMISSIONE'];

		// Risetto DIAGNOSI e INTERVENTI per settare l'obbligatorieta' dei campi data intervento
		// All'onload in modifica i campi non sono visibili e l'obbligatorieta' non risulta vedi NS_DIMISSIONE_ICD.setDataInterventoObbligatoria();
		// NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi();

		NS_DIMISSIONE_SDO.Setter.setIntestazione();

		// Abilito un pulsante in grado di importare la diagnosi alla dimissione dalla cartella clicnica.
		$('#butDiagnosiFromCartella').click(function () {
			NS_DIMISSIONE_SDO.Setter.getDiagnosiFromCartella();
		});

		// button importa traumatismi
		if (_JSON_CONTATTO.mapMetadatiCodifiche.hasOwnProperty('TRAUMATISMI')) {
			$('#butImportaTraumatismi').click(function () {
				NS_DIMISSIONE_SDO.importaTraumatismiDaAccettazione();
			});
		}

		// se il contatto è diacharged disabilito la possibilità di decheckare la dimissione
		if (_JSON_CONTATTO.stato.codice === "DISCHARGED") {
			$("#chkDimi").data("CheckBox").disable();
		}else{
			// La dimissione protetta deve essere selezionabile seolo la Dimissione � spuntata
			$('#chkDimi').click(function () {
				var _dimi = $('#h-chkDimi').val();
				var chkDimiProt = $("#chkDimiProt").data("CheckBox");
				if (_dimi == "1") {
					chkDimiProt.enable();
					$("#butDiagnosiFromCartella").show();
					$("#txtDiagnosiDimissione").removeAttr("disabled");
				} else {
					chkDimiProt.deselectAll();
					chkDimiProt.disable();
					$("#butDiagnosiFromCartella").hide();
					$("#txtDiagnosiDimissione").attr("disabled", "true");
				}

				$('#chkDimiProt_1').css({width: 180});

			});
		}

		// Valorizzo Sempre Il medico Compilaorte con l'utente Loggato se MEDICO
		if (home.baseUser.TIPO_PERSONALE == 'M') {
			$('#txtMedicoCompilatore').val(home.baseUser.DESCRIZIONE);
			$('#h-txtMedicoCompilatore').val(home.baseUser.IDEN_PER);
		}

		// Se sono in INSERIMENTO e l'utente loggato � medico valorizzo in automatico il medico dimettente con il medico loggato
		if (
			(_STATO_PAGINA === 'I' || _STATO_PAGINA === 'E') &&
			home.baseUser.TIPO_PERSONALE == 'M' &&
			_JSON_CONTATTO.uteDimissione.id == null
		) {
			$("#h-txtMedicoDimi").val(home.baseUser.IDEN_PER);
			$("#txtMedicoDimi").val(home.baseUser.DESCRIZIONE);
		}
		else {
			$('#txtMedicoDimi').attr('data-c-n_row', '1').attr('data-c-value', _JSON_CONTATTO.uteDimissione.id).attr('data-c-descr', _JSON_CONTATTO.uteDimissione.descrizione).val(_JSON_CONTATTO.uteDimissione.descrizione);
			$('#h-txtMedicoDimi').val(_JSON_CONTATTO.uteDimissione.id);
		}


		// Solo MEDICI e utenti di BACKOFFICE possono valorizzare diagnosi e interventi
		if (home.baseUser.TIPO_PERSONALE !== 'M' && !home.basePermission.hasOwnProperty('BACKOFFICE')) {
			for (var i = 0; i < 7; i++) {
				$("#acDiagnosiICD9" + i).data("acList").disable();
				$("#DiagnosiICD9" + i).attr("readonly", "readonly");
				$("#acInterventiICD9" + i).data("acList").disable();
				$("#InterventiICD9" + i).attr("readonly", "readonly");
				$("#txtDataInterventiICD9" + i).attr("readonly", "readonly");
				$("#txtDataInterventiICD9" + i).button({disabled: true});
			}
		}

		//solo i backoffice possono calcolare l'importo DRG
		if (!home.basePermission.hasOwnProperty('BACKOFFICE')){
			$("#butCalcoloDrgTariffa").hide();
			$("#txtImportoDRG").hide();
			$("#lblImportoDRG").hide();
			$("#txtImportoDRGFuoriSoglia").hide();
			$("#lblImportoDRGFuoriSoglia").hide();
		}

		if (typeof _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] != "undefined") {
			// Se il tipo DIMISSIONE salvato e' DECEDUTO rendo obbligatorio la combo del referto autoptico
			if ($("#cmbTipoDimi").find("option[value='" + _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'].id + "']").attr("data-codice") === "1") {
				V_ADT_DIMI.elements.cmbRefAutop.status = 'required';
				NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_DIMI"});
			}
		}

		// Visualizzazione Button della pagina di dimissione

		$(".interventi").on("change blur", function () {
			$(this).find('input').each(function () {
				if ($(this).val() == "") {
					NS_DIMISSIONE_ICD.setDataInterventoObbligatoria();
				}
			})
		});

		$("#btnInterventi, #btnDiagnosi").on("click", function (event) {
			  NS_DIMISSIONE_SDO.gestioneImportazioneDiagnosiInterventi.call(this);

		});

		//imposto su tutte le date degli interventi l'evento che fa il controllo sulle date
		for (var i = 0; i < 7; i++) {

			$("#txtDataInterventiICD9" + i).on("change blur" , function(){
				NS_DIMISSIONE_SDO.checkDataIntervento($(this).val(), $(this).attr("id"));
			});

		}
		//controlli alla modifica della data di dimissione
		$("#txtDataDimi").on("change blur", function () {
			NS_DIMISSIONE_SDO.checkDataDimi();
		});

		//controlli alla modifica della data di dimissione
		$("#txtOraDimi").on("change blur", function(){
			NS_DIMISSIONE_SDO.checkOraDimi();
		});


	},

	checkDataDimi : function () {
		var oraFine = $("#txtOraDimi");
		var dataFine = $("#txtDataDimi");
		var hDataFine = $("#h-txtDataDimi");
		if(oraFine.val() != '' && dataFine.val() != '' && hDataFine.val() != '' ){
			try{
				_JSON_CONTATTO.setDataFine(hDataFine.val() + oraFine.val());
			}catch(e){
				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
					dataFine.val("");
				}

			}

		}
	},
	checkOraDimi : function () {
		var oraFine = $("#txtOraDimi");
		var dataFine = $("#txtDataDimi");
		var hDataFine = $("#h-txtDataDimi");
		if(oraFine.val() != '' && dataFine.val() != '' && hDataFine.val() != '' ){
			try{
				_JSON_CONTATTO.setDataFine(hDataFine.val() + oraFine.val());
			}catch(e){
				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
					oraFine.val("");
				}

			}

		}
	},

	gestioneImportazioneDiagnosiInterventi : function () {
		var btn = $(this).attr("id");

		var fncConfirmImport = function(pType){

			var pTypeDescrizione = pType == "D" ? "DIAGNOSI" : "INTERVENTI";

			$.dialog("L'importazione dalla cartella non ha prodotto alcun risultato. Proseguendo verranno cancellate le " + pTypeDescrizione + " inserite. Si desidera continuare?",
				{
					id: "dialogConfirmImportazione",
					title: "Attenzione",
					width: 350,
					showBtnClose: false,
					movable: true,
					buttons: [
						{
							label: "Si", action: function (ctx) {
							NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi(pType);
							ctx.data.close();
						}
						},
						{
							label: "No", action: function (ctx) {
							ctx.data.close();
						}
						}
					]
				});
		};

		$.dialog("I dati inseriti verranno sovrascritti da quelli importati. Si desidera continuare?",
			{
				id: "dialogImportazione",
				title: "Attenzione",
				width: 350,
				showBtnClose: false,
				movable: true,
				buttons: [
					{
						label: "Si", action: function (ctx) {

						if (btn == "btnDiagnosi")
						{
							NS_DIMISSIONE_ICD.setCodiciICDfromCCE(function(data){

								_JSON_CONTATTO.codiciICD.mapCodiciICD = data;

								if (data[1].value.length == 0){
									fncConfirmImport("D");
								} else {
									NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi("D");
								}

							});
						}
						else if (btn == "btnInterventi") {
							NS_DIMISSIONE_ICD.setCodiciICDfromCCE(function(data){
								_JSON_CONTATTO.codiciICD.mapCodiciICD = data;

								if (data[1].value.length == 0){
									fncConfirmImport("P");
								} else {
									NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi('P');
								}

							});
						}
						ctx.data.close();
					}
					},
					{
						label: "No", action: function (ctx) {
						ctx.data.close();
					}
					}
				]
			});

	},
	checkDataIntervento : function (par, id) {
		/**
		 * la data di intervento deve essere maggiore della data di ingresso e non maggiore di 30 giorni della data di dimissione
		 * */

 		var range = 30;
		var date3 = moment(_JSON_CONTATTO.dataInizio,'YYYYMMDDhh:mi').format("DD/MM/YYYY");
		var date1 =  $("#txtDataDimi").val();
		var parameters  = {date1: date1 , date2 :par , date3 :date3,  rangeDate : range};
		if(date1 == ''){
			home.NOTIFICA.error({message: "Data fine ricovero non valorizzata, impossibile effettuare il controllo",title:"Error", timeout : 0});
			$("#"+id).val("");
		}else if(par !== '' && !DATE_CONTROL.checkBetwen3Date(parameters)){
			home.NOTIFICA.error({message: "Data intervento non valida: data inizio ricovero " + date3 + " data fine ricovero = " +date1 + " e data intervento " + par,title:"Error", timeout : 0});
			$("#"+id).val("");
		}
	},

	aggiornaPagina : function(){

		logger.debug("Aggiorna Pagina Dimissione - Iden Contatto -> " + _JSON_CONTATTO.id + ", Stato Pagina -> " + _STATO_PAGINA);

		// Gestione codice DRG
		if (_JSON_CONTATTO.codiceDRG != null)
		{
			NS_DIMISSIONE_SDO.Setter.setCodiceDRG();

			if (_JSON_CONTATTO.importoDRG != null)
			{
				$("#txtImportoDRG").val(_JSON_CONTATTO.importoDRG);
				$("#txtImportoDRGFuoriSoglia").val(_JSON_CONTATTO.importoDRGFuorisoglia);
			}
		}

		logger.debug("Aggiorna Pagina Dimissione - Tipo Personale -> " + home.baseUser.TIPO_PERSONALE + ", Codici ICD -> " + _JSON_CONTATTO.codiciICD.mapCodiciICD);

		// Valorizzo i Codici ICD9 per il contatto
		// Se in inserimento provo a recuperarli dalla cartella altrimenti valorizzo quelli precedentemente salvati.
		if (home.baseUser.TIPO_PERSONALE == "M" && _JSON_CONTATTO.codiciICD.mapCodiciICD.length == 0)
		{

                    var importaFromCCE = home.baseGlobal["adt.sdo.importaCodici." + _JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length -1].provenienza.idCentroDiCosto];

                    if (importaFromCCE === "N"){
                        NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi("E");
                    }else{
			NS_DIMISSIONE_ICD.setCodiciICDfromCCE(function(data){
				_JSON_CONTATTO.codiciICD.mapCodiciICD = data;
				NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi("E");
			});
                    }

		} else if (_JSON_CONTATTO.codiciICD.mapCodiciICD.length > 0){
			NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi("E");
			NS_DIMISSIONE_ICD.completaCampiDiagnosiInterventi();
		} else {
			NS_DIMISSIONE_ICD.hideSetICD({"type" : "E"});
			NS_DIMISSIONE_ICD.setOrdinamentoManuale();
		}

		// Se sono stati recuperate delle codifiche ICD9 le integro di alcuni campi nascostu necessati per i controlli sulla SDO
		// In un futuro non troppo lontano bisognerebbe riportare le informazioni nell'oggetto contatto
		if (_JSON_CONTATTO.codiciICD.mapCodiciICD.length > 0){
			NS_DIMISSIONE_ICD.completaCampiDiagnosiInterventi();
		}

		$("#txtCartella").val(_JSON_CONTATTO.codice.codice);
		$("#txtDataRicovero").val(moment(_JSON_CONTATTO.dataInizio,'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
		$("#h-txtDataRicovero").val(moment(_JSON_CONTATTO.dataInizio,'YYYYMMDDHH:mm').format('YYYYMMDD'));
		$("#txtOraRicovero").val(moment(_JSON_CONTATTO.dataInizio,'YYYYMMDDHH:mm').format('HH:mm'));
		$("#txtGgPermesso").val(_JSON_CONTATTO.mapMetadatiString['GIORNI_DI_PERMESSO']);
		$("#txtDataUltimoMov").val(moment(_JSON_CONTATTO.getLastAccessoGiuridico().dataInizio,'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
		$("#h-txtDataUltimoMov").val(moment(_JSON_CONTATTO.getLastAccessoGiuridico().dataInizio,'YYYYMMDDHH:mm').format('YYYYMMDD'));
		$("#txtOraUltimoMov").val(moment(_JSON_CONTATTO.getLastAccessoGiuridico().dataInizio,'YYYYMMDDHH:mm').format('HH:mm'));

		var _traumatismi = typeof _JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI_DIMISSIONE'] == 'undefined' ? "" : _JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI_DIMISSIONE'];

		logger.debug("Aggiorna Pagina Dimissione - Traumatismi -> " + JSON.stringify(_traumatismi));

		if(typeof _traumatismi.id != 'undefined'  && _traumatismi.id != '' && _traumatismi.id )
		{
			$("#cmbTraumatismiDimissione").val(_traumatismi.id);

			V_ADT_DIMI.elements.txtCategoriaCausaEsternaDimissione.status = "required";
			V_ADT_DIMI.elements.cmbCausaEsternaDimissione.status = "required";
		}

		// Gestione a Cascata di CATEGORIA CAUSA ESTERNA e CAUSA ESTERNA
		var  _categoria_causa_esterna = typeof _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA_DIMISSIONE'] == "undefined" ? "" : _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA_DIMISSIONE'];

		logger.debug("Aggiorna Pagina Dimissione - Categoria Causa Esterna - JSON -> " + JSON.stringify(_categoria_causa_esterna));

		if (_categoria_causa_esterna.id != null)
		{
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			var xhr =  db.select(
				{
					id: "SDJ.Q_RECORD_TIPI",
					parameter : {"IDEN":   {t: 'N', v: _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA_DIMISSIONE'].id}}
				});

			xhr.done(function (data) {

				$("#h-txtCategoriaCausaEsternaDimissione").val(data.result[0].IDEN);
				$("#txtCategoriaCausaEsternaDimissione").val(data.result[0].DESCRIZIONE).attr("data-c-value",data.result[0].IDEN);

				NS_DIMISSIONE_SDO.valorizeComboCausaEsterna(function(){$("#cmbCausaEsternaDimissione").val(_JSON_CONTATTO.mapMetadatiCodifiche['CAUSA_ESTERNA_DIMISSIONE'].id);});
			});
		}

		// Tipo Dimissione Trasferito ad altro istituto
		var _istitutoTrasferimento = typeof _JSON_CONTATTO.mapMetadatiCodifiche['ISTITUTO_TRASFERIMENTO_DIMISSIONE'] == "undefined" ? {} : _JSON_CONTATTO.mapMetadatiCodifiche['ISTITUTO_TRASFERIMENTO_DIMISSIONE'];
		var _tipoDimissione = typeof _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] == "undefined" ? {} : _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'];

		if (_tipoDimissione.codice === "6") {
			$("#cmbIstitutoTrasferimento").val(_istitutoTrasferimento.id != null ? _istitutoTrasferimento.id : null);
		} else {
			$("#cmbIstitutoTrasferimento").closest("TR").hide();
		}

		$("#txtRepartoAcc").val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.descrizione);

		// Gestione Stato Contatto
		if (_JSON_CONTATTO.stato.codice !== 'DISCHARGED')
		{
			// Ciclo i segmenti giuridici per essere sicuro di prendere quello attivo
			for (var x = _JSON_CONTATTO.contattiGiuridici.length - 1; x >= 0; x--)
			{
				if (_JSON_CONTATTO.contattiGiuridici[x].attivo) {
					$('#txtRepartoDeg').val(_JSON_CONTATTO.contattiGiuridici[x].provenienza.descrizione);
					// NS_DIMISSIONE_SDO.idenCdcDimi = _JSON_CONTATTO.contattiGiuridici[x].cdc.idCentroDiCosto;
				}
			}

			// Ciclo i segmenti assistenziali per essere sicuro di prendere quello attivo
			for (var y = _JSON_CONTATTO.contattiAssistenziali.length - 1; y >= 0; y--)
			{
				if (_JSON_CONTATTO.contattiAssistenziali[y].attivo) {
					$('#txtRepartoAss').val(_JSON_CONTATTO.contattiAssistenziali[y].provenienza.descrizione);
				}
			}
		}
		else
		{
			$('#txtRepartoDeg').val(_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length-1].provenienza.descrizione);
			// NS_DIMISSIONE_SDO.idenCdcDimi=_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length-1].cdc.idCentroDiCosto;
			$('#txtRepartoAss').val(_JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length-1].provenienza.descrizione);
		}
		//se è un dh nn si può mettere data fine a mano

		// Se sono in inserimento Dimissione e non ho mai salvato una data di dimissione Provo a Recuperare la data dimissione dalla cartella
		if (_JSON_CONTATTO.dataFine == null)
		{
			//se regime è dh bisogna valorizzare la data fine come data fine ultimo accesso
			//effettuare il controllo sia sul regime che sul tipo (_JSON_CONTATTO.regime.codice == 2 && (_JSON_CONTATTO.tipo.codice == 1 || _JSON_CONTATTO.tipo.codice == 4 || _JSON_CONTATTO.tipo.codice == 3)
			if(_JSON_CONTATTO.isDayHospital() && !_JSON_CONTATTO.isChirurgico()){

				var dataUltimoAccesso = _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length-1].dataFine;// 2015121114:50
				if(dataUltimoAccesso != "" && dataUltimoAccesso != null){

					$("#h-txtDataDimi").val(moment(dataUltimoAccesso, 'YYYYMMDDHH:mm').format('YYYYMMDD'));
					$("#txtDataDimi").val(moment(dataUltimoAccesso, 'YYYYMMDDHH:mm').format('DD/MM/YYYY')).attr("readonly","readonly").parent().find("button").off("click");
					$("#txtOraDimi").val(moment(dataUltimoAccesso, 'YYYYMMDDHH:mm').format('HH:mm')).attr("readonly","readonly");

					function callback (datafine){
						//formato data fine YYYYMMDD
						if(!DATE_CONTROL.equalsDate(dataUltimoAccesso.substring(0,8), datafine )){
							home.NOTIFICA.warning({message:"Attenzione trovata incoerenza date dimissioni: data fine accesso " +moment(dataUltimoAccesso, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + " data chiusura ricovero lettera dimissioni :" + moment(datafine, 'YYYYMMDD').format('DD/MM/YYYY') ,  timeout : 0, title : "Incoerenza date"});
						}
					}
					NS_DIMISSIONE_SDO.Setter.getDataDimissioneFromCartella(callback);
				} else{
					home.NOTIFICA.warning({message:"Attenzione e' presente un accesso di day hospital aperto", width : 220, timeout : 0, title : "Incoerenza date"});

				}
			}else{

				function cbk(resp){
					var $txtDataDImi = $("#txtDataDimi");
					if($txtDataDImi.val() == ''){
						$txtDataDImi.val(moment(resp,'YYYYMMDD').format('DD/MM/YYYY'));
						$("#h-txtDataDimi").val(resp);
					}

					logger.info("Get Data Dimissione From Cartella - NS_DIMISSIONE_SDO.getDataDimissioneFromCartella_" + _JSON_CONTATTO.id + " - Data Dimissione Caricata Correttamente -> " + resp);
				}
				NS_DIMISSIONE_SDO.Setter.getDataDimissioneFromCartella(cbk);
			}
		}
		else
		{
			NS_DIMISSIONE_SDO.valorizeDataOraFine(_JSON_CONTATTO.dataFine);
		}



		if (typeof _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] != "undefined")
		{
			var cmbTipoDimi = $('#cmbTipoDimi');
			cmbTipoDimi.val(_JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'].id);
			cmbTipoDimi.find("option[value='" + _JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'].id + "']").attr("selected","selected");

		}

		$("#cmbAssDomi").val(_JSON_CONTATTO.mapMetadatiString['NECESSITA_ASS_DOMICILIARE']);
		$("#cmbRefAutop").val(_JSON_CONTATTO.mapMetadatiString['RISCONTRO_AUTOPTICO']);

		if (NS_DIMISSIONE_SDO.SDOCompleta) {
			$("#chkSdoCompleta").data("CheckBox").selectAll();
		}

		if (_JSON_CONTATTO.stato.codice === "DISCHARGED")
		{
			var chkDImi = $("#chkDimi").data("CheckBox");
			chkDImi.selectAll();
			chkDImi.disable();
			$("#chkDimiProt").data("CheckBox").enable();
			$("#butDiagnosiFromCartella").show();
			$("#txtDiagnosiDimissione").removeAttr("disabled");
		}
		else
		{
			$("#chkDimiProt").data("CheckBox").disable();
			$("#butDiagnosiFromCartella").hide();
			$("#txtDiagnosiDimissione").attr("disabled","true");
		}

		if (_JSON_CONTATTO.mapMetadatiString['DIMISSIONE_PROTETTA'] == "S") {
			$("#chkDimiProt").data("CheckBox").selectAll();
		}

		if (_JSON_CONTATTO.regime.codice == "1")
		{
			$("#txtNumAccessiDh").hide();
			$("#lblNumAccessiDh").hide();
			$("#idAccessiDh").hide();
		}
		else
		{
			$("#idDegenza").hide();

			if (_JSON_CONTATTO.tipo.codice=='O'){ // one day surgery : 2 accessi
				$("#txtNumAccessiDh").val(2);
			} else{
				$("#txtNumAccessiDh").val(_JSON_CONTATTO.contattiAssistenziali.length);
			}
		}

		//qui bisogna gestire la parte della data di decesso e medico dimettente
		//query sull'anagrafica  che tira su data_morte
        //Q_DATI_MORTE
		var butStampaDecesso = $("#butStampaDecesso");


			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
			var xhr =  db.select(
				{
					id: "ADT.Q_DATI_MORTE",
					parameter : {"IDEN":   {t: 'N', v: _JSON_ANAGRAFICA.id}}
				});

			xhr.done(function (data, textStatus, jqXHR) {

				var result = data.result[0];
				//alert('ORA_MORTE_CCE : ' + result.ORA_MORTE_CCE  +'\n'+ 'IDEN_PER_MORTE_CCE : '+ result.IDEN_PER_MORTE_CCE  +'\n'+ 'MEDICO_DICHIARANTE : ' +  result.MEDICO_DICHIARANTE +'\n'+'DATA_MORTE_CCE : '+ result.DATA_MORTE_CCE );
				if(result.ORA_MORTE_CCE != '' && result.IDEN_PER_MORTE_CCE != '' && result.MEDICO_DICHIARANTE != '' && result.DATA_MORTE_CCE != ''){

					var dataRicovero = Number(moment($("#txtDataRicovero").val() + " " + $("#txtOraRicovero").val(), "DD/MM/YYYY HH:mm").format("YYYYMMDDHHmm"));
					var dataDimissione = _JSON_CONTATTO.dataFine !== null ? Number(moment(_JSON_CONTATTO.dataFine, "YYYYMMDDHH:mm").format("YYYYMMDDHHmm")) : null;
					var dataMorteCCE = Number(result.DATA_MORTE_CCE + result.ORA_MORTE_CCE.replace(":",""));
					logger.info("data ricovero : "+dataRicovero + " data dimissione : " + dataDimissione +" data morte : " + dataMorteCCE );
					if((dataMorteCCE > dataRicovero) && (dataMorteCCE < dataDimissione || dataDimissione == null)) {

						NS_DIMISSIONE_SDO.valorizeDataOraFine(result.DATA_MORTE_CCE + '' + result.ORA_MORTE_CCE);
						$('#txtMedicoDimi').attr('data-c-n_row', '1').attr('data-c-value', result.IDEN_PER_MORTE_CCE).attr('data-c-descr', result.MEDICO_DICHIARANTE).val(result.MEDICO_DICHIARANTE);
						$('#h-txtMedicoDimi').val(result.IDEN_PER_MORTE_CCE);

						var cmbTipoDimi = $('#cmbTipoDimi');
						cmbTipoDimi.find("option[data-codice='1']").attr("selected","selected");
						butStampaDecesso.show();
						V_ADT_DIMI.elements.cmbRefAutop.status = 'required';
						NS_FENIX_SCHEDA.addFieldsValidator({config: "V_ADT_DIMI"});
					}
					else{
						butStampaDecesso.hide();
					}
				}else{
					butStampaDecesso.hide();
				}
			});

			xhr.fail(function(data, textStatus, jqXHR){
				logger.error('Err -> '  + JSON.stringify(data) + '\ntextStatus -> ' + textStatus + '\njqXHR ->' +jqXHR);
				home.NOTIFICA.error({message: "Errore nel recepire i dati Morte ",title:"Error",width : 220});

			});

		logger.debug("Aggiorna Pagina Dimissione - Fine");

	},

	setStyle : function(){

		$('#InitInstance').hide();
		$("#IFRAMEFINDER").hide();
		//$("#IFRAMEFINDER").css({"width":"1000px", "height":"700px"});
		$('#cmbTipoDimi').parent().css({width:300});
		$('#chkDimiProt_1').css({width:180});
		$("#txtCodDRG, #txtDescrDRG").attr("readonly","readonly");

		$("#txtDiagnosiDimissione").closest('TD').attr("ROWSPAN","3");
		$("#lblDiagnosiDimissione").closest('TD').attr("ROWSPAN","3");
		$("#btnDiagnosi").css("float","right");
		$("#btnInterventi").css("float","right");

	},

	overrideRegistra : function(){

		NS_FENIX_SCHEDA.registra = function(){NS_DIMISSIONE_SDO.registra();};

		$('.butFirma').off("click").click(function(){

			var p = {firma : true};

			NS_DIMISSIONE_SDO.registra(p);

		});

	},

	registra : function(p) {
		try {

			logger.debug("Registrazione Dimissione - Init - parameters -> " + JSON.stringify(p));

			var bDimissione = $('#h-chkDimi').val() == "1";
			var sdoCompleta = $("#h-chkSdoCompleta").val() === '01';
			var responseControlli =  {"success" : true, "lock" : false, message : ""};

			logger.debug("Registrazione Dimissione - SDO Completa -> " + sdoCompleta + ", Dimissione -> " + bDimissione);

			if (typeof p == 'undefined') {
				p = {firma : false};
			}

			NS_DIMISSIONE_SDO.valorizeContatto();

			if(!NS_FENIX_SCHEDA.validateFields()){
				return false;
			}

			responseControlli = NS_DIMISSIONE_TEMPLATE_CONTROLLI.SDO[_JSON_CONTATTO.regime.codice].run({"contatto":_JSON_CONTATTO,"tipoPersonale":home.baseUser.TIPO_PERSONALE,"dimissione":bDimissione,"SDO":sdoCompleta});

			if (!responseControlli.success)
			{
				if (responseControlli.lock){
					return;
				}

				$("#chkSdoCompleta").data("CheckBox").deselectAll();

				if (sdoCompleta) {
					home.NOTIFICA.warning({message:"La sdo e' stata messa INCOMPLETA", width : 220, timeout : 10, title : "Warning SDO"});
					sdoCompleta = false;
				}
			}

                        //spostato fuori da valorizeContatto per intercettare i controlli effettuati successivamente alla sua chiamata
                        _JSON_CONTATTO.mapMetadatiString['SDO_COMPLETA'] = $("#h-chkSdoCompleta").val() === "01" ? "S" : "N";

			var vmsg = "La SDO risulta ";
			vmsg += sdoCompleta ? "COMPLETA" : "INCOMPLETA";
			vmsg += !bDimissione ? "<br>Campo \"dimissione\" non spuntato! <br>La dimissione non &egrave; effettiva" : "";
			vmsg += '<br> Si desidera procedere comunque?';

			// Visualizzo il messaggio solo agli utenti medici se la SDO e' incompleta
			if (!sdoCompleta && home.baseUser.TIPO_PERSONALE == 'M')
			{
				home.DIALOG.si_no({
					title: "Registrazione SDO",
					msg : vmsg,
					cbkNo : function(){ },
					cbkSi : function(){ NS_DIMISSIONE_SDO.updatePatient(p);}
				});
			}
			else
			{
				NS_DIMISSIONE_SDO.updatePatient(p);
			}
		}catch (e){
			logger.error(e.code  + ' - '+ e.message );
			if(typeof e.code != 'undefined' ){
				home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
			}
		}

	},

	valorizeContatto : function(){

		var _DimissioneProtetta = $('#h-chkDimiProt').val();
		var hTxtCategoriaCausaEsternaDimissione = $("#h-txtCategoriaCausaEsternaDimissione");
		var txtDataDimi = $('#h-txtDataDimi');
		var txtOraDimi = $("#txtOraDimi");
		var cmbTipoDimi = $("#cmbTipoDimi");
		var cmbIstitutoTrasferimento = $("#cmbIstitutoTrasferimento");
		var cmbCausaEsternaDimissione = $("#cmbCausaEsternaDimissione");

		NS_DIMISSIONE_SDO.hasCategoriaCausaEsterna = (hTxtCategoriaCausaEsternaDimissione.val().length > 0);
		NS_DIMISSIONE_SDO.hasCausaEsterna = (cmbCausaEsternaDimissione.children().length > 0);

		_JSON_CONTATTO.mapMetadatiString['DIMISSIONE_PROTETTA'] = _DimissioneProtetta == "1" ? "S" : "N";
		_JSON_CONTATTO.mapMetadatiString['GIORNI_DI_PERMESSO'] = $("#txtGgPermesso").val();
		_JSON_CONTATTO.mapMetadatiString['NECESSITA_ASS_DOMICILIARE'] = $("#cmbAssDomi").find("option:selected").val();
		_JSON_CONTATTO.mapMetadatiString['RISCONTRO_AUTOPTICO'] = $("#cmbRefAutop").find("option:selected").val();

		// Requisito per SDo Completa � la presenza di almeno una Diagnosi
		if ($("#DiagnosiICD90").val() == ""){
			$("#chkSdoCompleta").data("CheckBox").deselectAll();
		}

		_JSON_CONTATTO.uteDimissione.id = $('#h-txtMedicoDimi').val();
		_JSON_CONTATTO.uteModifica.id = home.baseUser.IDEN_PER;

		_JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : cmbTipoDimi.find("option:selected").val(), codice : cmbTipoDimi.find("option:selected").attr("data-codice")};
		_JSON_CONTATTO.setDataFine(txtDataDimi.val() + txtOraDimi.val());

		// In Aggiornamento di Dimissione imposto anche la data di fine dell'ultimo accesso giuridico e assistenziale
		_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
		_JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;


		_JSON_CONTATTO.getLastAccessoAssistenziale().setDataFine(txtDataDimi.val() + txtOraDimi.val());

		_JSON_CONTATTO.getLastAccessoGiuridico().setDataFine(txtDataDimi.val() + txtOraDimi.val());

		// Controllo appropriatezza accessi/trasferimenti chiusi
		if (_JSON_CONTATTO.isChirurgico()) {

			for (var i = 0; i < _JSON_CONTATTO.contattiAssistenziali.length; i++) {
				if (_JSON_CONTATTO.getAccessoAssistenziale(i).isAdmitted() || _JSON_CONTATTO.getAccessoAssistenziale(i).isAccesso()) {
					_JSON_CONTATTO.contattiAssistenziali[i].stato = {id: null, codice: "DISCHARGED"};
					_JSON_CONTATTO.contattiAssistenziali[i].attivo = false;
					_JSON_CONTATTO.getAccessoAssistenziale(i).setDataFine(_JSON_CONTATTO.dataFine);
				}
			}
		}

		// Salvataggio Traumatismi e causa esterna
		_JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI_DIMISSIONE'] = {id : $("#cmbTraumatismiDimissione").val() ,codice : null};
		_JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA_DIMISSIONE'] = {id :hTxtCategoriaCausaEsternaDimissione.val() ,codice : null};
		_JSON_CONTATTO.mapMetadatiCodifiche['CAUSA_ESTERNA_DIMISSIONE'] = {id :cmbCausaEsternaDimissione.find("option:selected").val() ,codice : null};
		_JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : cmbTipoDimi.find("option:selected").val(), codice : cmbTipoDimi.find("option:selected").attr("data-codice")};
		_JSON_CONTATTO.mapMetadatiCodifiche['ISTITUTO_TRASFERIMENTO_DIMISSIONE'] = {id : cmbTipoDimi.find("option:selected").attr("data-codice") == "6" && cmbIstitutoTrasferimento.find("option:selected").val().length > 0 ? cmbIstitutoTrasferimento.find("option:selected").val() : null ,codice : null};

		_JSON_CONTATTO.codiciICD = NS_DIMISSIONE_ICD.getCodiciICD();

		// Se La generazione dei Codici ICD non avviene Correttamente Interrompo il salvataggio
		if (!NS_DIMISSIONE_SDO.ICDSuccess) {
			return;
		}

		// Ogni volta che modifico il contatto se ha la tariffazione questa va eliminata.
		// Gli importi DRG se null devono essere valorizzati a ZERO per via della manipolazione dei converters degli oggetti DB.
		if (_JSON_CONTATTO.codiceDRG != null) {
			_JSON_CONTATTO.codiceDRG = null;
			_JSON_CONTATTO.importoDRG = 0;
			_JSON_CONTATTO.importoDRGFuorisoglia = 0;
		}
	},

	updatePatient : function(p) {

		var _Dimi = $('#h-chkDimi').val();

		logger.debug("Update Patient Information - NS_DIMISSIONE.UpdatePatient_" + _JSON_CONTATTO.id + " - Dimissione -> " + _Dimi == "1" ? "true" : "false"  + ", Stato Contatto: " + _JSON_CONTATTO.stato.codice + ", p (parametri): " + JSON.stringify(p));
		logger.debug("Update Patient Information - NS_DIMISSIONE.UpdatePatient_" + _JSON_CONTATTO.id + " - Traumatismi -> " + NS_DIMISSIONE_SDO.hasTraumatismi() + ", Categoria Causa Esterna -> " + NS_DIMISSIONE_SDO.hasCategoriaCausaEsterna + ", Causa Esterna -> " + NS_DIMISSIONE_SDO.hasCausaEsterna);
		logger.debug("Update Patient Information - NS_DIMISSIONE.UpdatePatient_" + _JSON_CONTATTO.id + " - Codici ICD ->  " + JSON.stringify(_JSON_CONTATTO.codiciICD));

		// Prima Dimissione
		if (_Dimi === "1" && !_JSON_CONTATTO.isDischarged())
		{
			var pA03 = {"contatto" : _JSON_CONTATTO, updateBefore :true, "hl7Event" : "A03", "notifica" : {"show" : "S", "timeout" : 2, "width" : 220, "message" : "Dimissione Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante la Dimissione del Ricovero"}, "cbkSuccess" : function(){_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto; NS_DIMISSIONE_SDO.registraSDO(p);}};
			NS_CONTATTO_METHODS.dischargeVisit(pA03);
		}
		// Update Dimissione
		else if (_Dimi === "1" && _JSON_CONTATTO.isDischarged())
		{
			var pA08 = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 2, "width" : 220 ,"message" : "Aggiornamento Dimissione Avvenuto con Successo", "errorMessage" : "Errore Durante Aggiornamento Dimissione"}, "cbkSuccess" : function(){_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto; NS_DIMISSIONE_SDO.registraSDO(p);}};
			NS_CONTATTO_METHODS.updatePatientInformation(pA08);
		}
		// Preparazione SDO Senza Dimissione
		else if (_Dimi !== "1" && _JSON_CONTATTO.isAdmitted())
		{
			var pA08 = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3, "width" : 220 ,"message" : "Aggiornamento Ricovero Avvenuto con Successo", "errorMessage" : "Errore Durante Aggiornamento Ricovero"}, "cbkSuccess" : function(){}};

			pA08.cbkSuccess = function()
			{
				_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

				if (p.firma) {
					home.NOTIFICA.warning({message: "Impossibile Firmare SDO - Contatto Non Dimesso",width:220,title:"Warning"});
				}
			};

			NS_CONTATTO_METHODS.updatePatientInformation(pA08);
		}
		// Dimissione avvenuta in un altra postazione simultaneamente
		else if (_Dimi != "1" && _JSON_CONTATTO.isDischarged())
		{
			return home.NOTIFICA.warning({message:"La dimissione del contatto &egrave; &egrave; avvenuta in altro contesto! \n Riaprire la scheda per ricaricare i dati dimissione",width:220,title:"Warning"});
		}

	},

	/**
	 * Se l'utente che procede cn l'inserimento della dimissione e' medico inserisco una versione su SDO_VERSIONI.
	 * Premendo sul tssto firma si procede con la rispettiva firma aprendo l'anteprima.	 *
	 * @param p
	 */
	registraSDO : function(p) {


		logger.debug("Registra SDO - Init - Input Parameter -> " + JSON.stringify(p));

		var _SDOCompleta = $('#h-chkSdoCompleta').val();

		logger.debug("Registra Dimissione - Registra SDO - parameters -> " + JSON.stringify(p) + ", SDO Completa -> " + _SDOCompleta);

		if (home.baseUser.TIPO_PERSONALE == 'M')
		{
			var _isUserBackoffice = home.basePermission.hasOwnProperty('BACKOFFICE');
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			var parameters =
			{
				'P_IDEN_CONTATTO' : {t: 'N', v: _JSON_CONTATTO.id, d:'I'} ,
				'P_UTENTE_INSERIMENTO' : {t: 'N', v: home.baseUser.IDEN_PER, d:'I'},
				'P_DA_FIRIMARE' : {t: 'V', v: NS_DIMISSIONE_SDO.SDOFirmata && !_isUserBackoffice ? 'S' : 'N', d:'I'},
				'P_DIAGNOSI' : {t: 'C', v: $('#txtDiagnosiDimissione').val(), d:'I'},
				'P_SDO_COMPLETA' : {t: 'V', v: _SDOCompleta == "01" ? "S" : "N", d:'I'},
				'P_RESULT' : {t:'C',d:'O'}
			};

			if (NS_DIMISSIONE_SDO.SDOCorrente !== null){
				parameters.P_PRECEDENTE = {t : 'N', v :  NS_DIMISSIONE_SDO.SDOCorrente, d:'I'};
			}

			logger.debug("Registra SDO - Parameters -> " + JSON.stringify(parameters));

			var xhr =  db.call_procedure(
				{
					id: 'FX$PCK_SDO.SALVA_VERSIONE',
					parameter : parameters
				});

			xhr.done(function (data, textStatus, jqXHR) {

				var message = data['P_RESULT'].split('|')[1]; message = message.replace(/\n/g,'\\n');

				logger.debug("Registra SDO - Response -> " + message);

				var resp =  JSON.parse(message);

				if (resp.success)
				{
					NS_DIMISSIONE_SDO.SDOInserita = resp.id;
					NS_DIMISSIONE_SDO.SDOProgressivo = resp.progressivo;

					logger.info("Registra SDO - Success");

					if (p.firma)
					{
						if (_SDOCompleta !== '01') {
							home.NOTIFICA.error({message: "Impossibile Firmare SDO NON Completa",title:"Error",width : 220});
							NS_DIMISSIONE_SDO.getSDO();
							return;
						}

						logger.debug("Registra SDO - Init Firma");

						NS_FIRMA_SDO.firma();
					}
					else
					{
						logger.info("Registra SDO - Termine SDO senza processo di Firma");

						home.NOTIFICA.success({message: 'Registrazione SDO Effettuata Correttamente', timeout: 3, width: 220, title: 'Success'});

						if (!_isUserBackoffice) {
							NS_FENIX_SCHEDA.chiudi({'refresh':true}); // se l'utente è backoffice non chiudo la pagina
						} else {
							NS_DIMISSIONE_SDO.getSDO();
						}
					}
				}

			});

			xhr.fail(function (response) {
				home.NOTIFICA.error({message: "Attenzione Errore durante Registrazione SDO",width:220,timeout:6,title: "Error"});
				logger.error("Registra SDO - Errore durante Registrazione SDO - Message -> " + JSON.stringify(response));
			});

		}
		else if(home.baseUser.TIPO_PERSONALE == 'I')
		{
			home.HOME_ADT.tab_sel = 'filtroRicoverati';
			NS_HOME_ADT_WK.caricaWk();
			NS_FENIX_SCHEDA.chiudi();
		}
		else
		{
			logger.info("INFO Registra SDO - NS_DIMISSIONE.registraSDO_" + _JSON_CONTATTO.id + "  - SDO Non registrabile da Utenti NON Medici");
		}

	},

	/**
	 * Funzione che recupera le informazioni specifiche della SDO.
	 * @param callbck
	 */
	getSDO : function(callbck){

		logger.debug("Recupero Dati SDO - Init - " + _IDEN_CONTATTO);

		var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

		var parameters =
		{
			'P_IDEN_CONTATTO' : {t: 'N', v: _IDEN_CONTATTO, d:'I'},
			'P_RESULT' : {t:'C',d:'O'}
		};

		var xhr =  db.call_procedure(
			{
				id: 'FX$PCK_SDO.GET_SDO',
				parameter : parameters
			});

		xhr.done(function (data, textStatus, jqXHR) {

			var message = data['P_RESULT'].split('|')[1];
			message = message.replace(/\n/g,'\\n');

			logger.debug("Recupero Dati SDO - Response Procedure - " + message);

			var GetSDOResponse =  JSON.parse(message);

			if (GetSDOResponse.success)
			{
				NS_DIMISSIONE_SDO.SDOFirmata = GetSDOResponse.firma;
				NS_DIMISSIONE_SDO.SDOCorrente = GetSDOResponse.id;
				NS_DIMISSIONE_SDO.SDOProgressivo = GetSDOResponse.progressivo;
				NS_DIMISSIONE_SDO.SDOCompleta = GetSDOResponse.completa === "S";
				$('#txtDiagnosiDimissione').val(GetSDOResponse.diagnosi);

				// La visualizzazione dei button la lancio in questo punto solo se sto inserendo un SDO (NO visualizza ricovero)
				// Evito quindi di sovrascrivere la ridefinizione dei Button a causa dell'asincronismo.
				if (_STATO_PAGINA === 'I' || _SDO === 'S' ) {
					NS_DIMISSIONE_SDO.Setter.setButtonScheda();
				}
			}
			else
			{
				logger.error("Recupero Dati SDO - Errore - message -> " + GetSDOResponse.message);
				home.NOTIFICA.error({message: "Attenzione Errore durante Recupero Informazioni SDO", width: 220, title: "Error"});
			}

			NS_DIMISSIONE_SDO.aggiornaPagina();
			if (typeof callbck == "function"){
				callbck();
			}

		});

		xhr.fail(function (response) {
			home.NOTIFICA.error({message: "Attenzione Errore durante Reperimento Informazioni SDO",width:220,timeout:6,title:"Error"});
			logger.error("Error Get SDO - NS_DIMISSIONE.getSDO_" + _JSON_CONTATTO.id + " - SDO.GET_SDO -> : " + JSON.stringify(response));
		});

	},

	Setter : {

		setIntestazione : function() {
			$('#lblTitolo').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);
		},

		/**
		 * Imposta Il Bottone di stampa SDO in base allo stato pagina.
		 * Viene Richiamato nel file di INIT della dimissione e dell'accettazione (Modifica).
		 */
		setStampa : function(){

			if (!NS_DIMISSIONE_SDO.SDOFirmata) {
				$(".butStampa").hide();
			} else {
				$(".butStampa").show().text('Stampa SDO').click(function(){ home.NS_FENIX_ADT.stampaSDO(_JSON_CONTATTO.id); });
			}
		},

		/**
		 * Se STATO_PAGINA = E e il codice DRG e' valorizzato viene recuperata la descrizione.
		 * Questo accade perche' nel JSON del contatto il DRG e' definito come una Stringa.	     *
		 */
		setCodiceDRG : function() {

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			var xhr =  db.select(
				{
					id: 'ADT.GET_DRG_BY_CODICE',
					parameter : {"CODICE_DRG":   {t: 'V', v: _JSON_CONTATTO.codiceDRG}}
				});

			xhr.done(function (data, textStatus, jqXHR) {

				if (data.result.length > 0)
				{
					$("#txtDescrDRG").val(data.result[0].DESCRIZIONE);
					$("#txtCodDRG").val(_JSON_CONTATTO.codiceDRG);
					$("#chkSdoCompleta").data("CheckBox").selectAll();

					logger.info("Get Codice DRG - NS_DIMISSIONE_SDO.setCodiceDRG_" + _JSON_CONTATTO.id + " - Codice DRG Caricato Correttamente -> " + data.result[0].DESCRIZIONE);
				}
			});

			xhr.fail(function (response) {
				logger.error("ERROR Get Codice DRG - NS_DIMISSIONE_SDO.setCodiceDRG_ " + _JSON_CONTATTO.id + " - " + JSON.stringify(response));
				home.NOTIFICA.error({ title: "Attenzione", width : 220, message: 'Errore nella lettura della descrizione DRG ' });
			});

		},

		/**
		 * Viene lanciato al caricamento della pagina per determinare i button da visualizzare in funzione al TAB attivo.
		 *
		 * @author alessandro.arrighi
		 */
		setButtonScheda : function() {

			var _isUserBackoffice = home.basePermission.hasOwnProperty('BACKOFFICE');
			var _isProvenienzaPS = typeof _JSON_CONTATTO.mapMetadatiString["DEA_ANNO"] !== "undefined";
			var butChiudi = $(".butChiudi");
			var butSalva = $('.butSalva');
			// Button in alto a destra per il print degli errori della pagina
			$("#butPrintVideata").remove();
			$(".headerTabs").append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));
			$("#lblTitolo").css({"width":"80%","display":"inline"});

			logger.debug('Set Button Scheda DIMISSIONE SDO - stato pagina -> ' + _STATO_PAGINA + ', SDO Firmata -> ' + NS_DIMISSIONE_SDO.SDOFirmata + ", _isUserBackoffice -> "+ _isUserBackoffice + ", _isProvenienzaPS -> " + _isProvenienzaPS);


			$('.butFirma').show();
			butSalva.show();
			butChiudi.show();

			NS_DIMISSIONE_SDO.Setter.setStampa();

			$("#butStampaDecesso").off('click').on("click",function(){



					var idenVisita = _JSON_CONTATTO.codiciEsterni.codice1

				var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});

				var xhr =  db.select(
					{
						id: "DATI.CHECK_SEGNALAZIONE_DECESSO",
						parameter : {"idenVisita":   {t: 'N', v: idenVisita}}
					});

				xhr.done(function (data, textStatus, jqXHR) {

					if(data.result[0].CONTO > 0){
						var par = {};
						par.URL = home.baseGlobal.PRINT_URL + 'report='+home.baseGlobal.PRINT_REPOSITORY_REPORT_WHALE + '/ASL2/SEGNALAZIONE_DECESSO.RPT&init=pdf&promptpIdenVisita=' + idenVisita+'&ts='+new Date().getTime();
						home.NS_FENIX_PRINT.caricaDocumento(par);
						par['beforeApri'] = home.NS_FENIX_PRINT.initStampa;
						home.NS_FENIX_PRINT.apri(par);
					}
					else{
						home.NOTIFICA.warning({title: "Attenzione",message:"Nessuna scheda compilata per il modulo richiesto"});
					}

				});



			});

			$('#butFinder').off('click').on("click",function(){
				var cmd = '5';
				DRG_FINDER.richiediAnalisiFinder(DRG_FINDER.writeXml(NS_DIMISSIONE_SDO.getJsonToWrite(cmd)));
			});

			$("#butFinderInterface").off('click').on("click",function(){
				var cmd = '0';
				DRG_FINDER.richiediAnalisiFinder(DRG_FINDER.writeXml(NS_DIMISSIONE_SDO.getJsonToWrite(cmd)));
			});

			$("#butCalcoloDrgTariffa").off('click').click(function(){
				DRG_FINDER.calcolaDrgTariffa(_JSON_CONTATTO.id);
			});

			// Se Modifico Un contatto alla chiusura della pagina conviene refreshare per evitare di vedere in WK cose NON aggiornate.
			butChiudi.off('click').on("click",function(){
				NS_FENIX_SCHEDA.chiudi({'refresh':true});
			});

			if (!(NS_DIMISSIONE_SDO.SDOFirmata && !_isUserBackoffice)) {
				butSalva.show();
			}

		},

		/**
		 * Funzione che restituisce la diagnosi alla dimissione scritta in cartella clinica.
		 * Viene lanciata una query su whale che restituisce il testo piano della sezione con id "idDiagnosiDimissione"
		 *
		 * @author alessandro.arrighi
		 */
		getDiagnosiFromCartella : function() {

			var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});
			var xhr =  db.select(
				{
					id: 'DATI.Q_DIAGNOSI_LETTERA_DIMISSIONE',
					parameter : {"NOSOLOGICO":   {t: 'V', v: _JSON_CONTATTO.codice.codice}}
				});

			xhr.done(function (data, textStatus, jqXHR) {

				if (data.result.length > 0)
				{
					$("#txtDiagnosiDimissione").val(data.result[0].TESTO_PIANO);

					logger.info("Get Diagnosi From Cartella - NS_DIMISSIONE_SDO.getDiagnosiFromCartella_" + _JSON_CONTATTO.id + " - Diagnosi Da cartella Caricata Correttamente");
				}
			});

			xhr.fail(function (response) {
				logger.error("ERROR Get Diagnosi From Cartella - NS_DIMISSIONE_SDO.getDiagnosiFromCartella_ " + _JSON_CONTATTO.id + " - " + JSON.stringify(response));
				home.NOTIFICA.error({ title: "Attenzione", width : 220, message: 'Errore nel recupero della diagnosi dalla Cartella' });
			});

		},

		/**
		 * Funzione che restituisce la diagnosi alla dimissione scritta in cartella clinica.
		 * Viene lanciata una query su whale che restituisce il testo piano della sezione con id "idDiagnosiDimissione"
		 *
		 * @author alessandro.arrighi
		 */
		getDataDimissioneFromCartella : function(cbk) {

			var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});

			var xhr =  db.select(
				{
					id: 'DATI.Q_DATA_FINE_LETTERA_DIMISSIONE',
					parameter : {"NOSOLOGICO":   {t: 'V', v: _JSON_CONTATTO.codice.codice}}
				});

			xhr.done(function (data, textStatus, jqXHR) {


				// Se Data e Ora Dimissione NON sono state registrate precedenti le valorizzo con quelle attuali
				if (data.result.length > 0)
				{

					if(typeof cbk == 'function'){
						cbk(data.result[0].DATA_FINE);
					}
					/*$("#txtDataDimi").val(moment(data.result[0].DATA_FINE,'YYYYMMDD').format('DD/MM/YYYY'));
					$("#h-txtDataDimi").val(data.result[0].DATA_FINE);
					logger.info("Get Data Dimissione From Cartella - NS_DIMISSIONE_SDO.getDataDimissioneFromCartella_" + _JSON_CONTATTO.id + " - Data Dimissione Caricata Correttamente -> " + data.result[0].DATA_FINE);
					*/
				}
				/*else
				{
					$('#txtDataDimi').val(moment().format('DD/MM/YYYY'));
					$('#h-txtDataDimi').val(moment().format('YYYYMMDD'));
				}  */

			});

			xhr.fail(function (response) {

				logger.error("Get Data Dimissione From Cartella - NS_DIMISSIONE_SDO.getDataDimissioneFromCartella_" + _JSON_CONTATTO.id + ' ' + JSON.stringify(response));
				home.NOTIFICA.error({ title: "Attenzione", message: 'Errore in lettura Data Dimissione da Cartella' });
			});

		}
	},



	getJsonToWrite:function(cmd){
		var json= {};
		json.cmd = cmd;
		json.agey = moment().diff(moment(_JSON_ANAGRAFICA.dataNascita,'YYYYMMDD'),'years');
		json.gndr =_JSON_ANAGRAFICA.sesso=='M'?'1':'2';

		json.adt = moment(_JSON_CONTATTO.dataInizio,"YYYYMMDDHH:mm").format('DD/MM/YYYY');

		var dataDimi = $("#h-txtDataDimi").val();
		var oraDimi = $("#txtOraDimi").val();
		var dataFine =  (dataDimi !== '' && oraDimi !='' && dataDimi != null && oraDimi != null)  ? dataDimi + oraDimi: _JSON_CONTATTO.dataFine;

		if(dataFine == null ||  dataFine === '' ){
			home.NOTIFICA.error({message: "Data fine non valorizzata", width : 220, title: "Error"});
			logger.error("Data fine non valorizzata JSON CONTATTO ->  " + JSON.stringify(_JSON_CONTATTO));
			return;
		}else{
			json.ddt = moment(dataFine,"YYYYMMDDHH:mm").format('DD/MM/YYYY');
		}
		json.disp = NS_DIMISSIONE_SDO.getDISP();

		json.ENCOUNTER = {};
		json.ENCOUNTER.CLAIM = {};
		json.ENCOUNTER.CLAIM.I9DX = [];  //diagnosi secondarie
		json.ENCOUNTER.CLAIM.I9DXP = {VALUE:$('#h-DiagnosiICD90').val()}; //diagnosi principale
		json.ENCOUNTER.CLAIM.I9PR = [];  //altri interventi
		json.ENCOUNTER.CLAIM.I9PRP = {VALUE:$("#h-InterventiICD90").val()}; //interventi principali
		DRG_FINDER.getAllCodeDiagnosi(json);
		DRG_FINDER.getAllCodeInterventi(json);

		return json;

	},

	getDISP :function (){
		//serve x codificare disp
		switch ( $('#cmbTipoDimi').find('option:selected').attr("data-codice")) {
			case '1' : // deceduto
				return '20';
				break;
			case '5' : // volontaria
				return '07';
				break;
			case '6' : // trasferito ad altro istituto
				return '04';
				break;
			default :
				return '01'; //ordinaria
				break;
		}
	},

	valorizeComboCausaEsterna : function(callback){

		var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
		var xhr =  db.select(
			{
				id: "ADT.Q_CAUSA_ESTERNA",
				parameter : {"codCategoria":   {t: 'V', v: $("#txtCategoriaCausaEsternaDimissione").attr("data-c-value")}}
			});

		xhr.done(function (data, textStatus, jqXHR) {

			$("#cmbCausaEsternaDimissione").empty();
			$("#cmbCausaEsternaDimissione").append("<option value=''></option>");

			$.each(data.result, function(i,v){
				$("#cmbCausaEsternaDimissione").append("<option value='"+v.VALUE+"'>"+v.DESCR+"</option>");
			});

			if (typeof callback === "function")
			{
				callback();
			}

		});

	},

	importaTraumatismiDaAccettazione : function(){

		var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

		var xhr =  db.select(
			{
				id: "SDJ.Q_RECORD_TIPI",
				parameter : {"IDEN":   {t: 'N', v: _JSON_CONTATTO.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'].id}}
			});

		xhr.done(function (data, textStatus, jqXHR) {

			$("#cmbTraumatismiDimissione").val(_JSON_CONTATTO.mapMetadatiCodifiche['TRAUMATISMI'].id);

			$("#h-txtCategoriaCausaEsternaDimissione").val(data.result[0].IDEN);
			$("#txtCategoriaCausaEsternaDimissione").attr("data-c-value",data.result[0].IDEN);
			$("#txtCategoriaCausaEsternaDimissione").val(data.result[0].DESCRIZIONE);

			NS_DIMISSIONE_SDO.valorizeComboCausaEsterna(function(){$("#cmbCausaEsternaDimissione").val(_JSON_CONTATTO.mapMetadatiCodifiche['CAUSA_ESTERNA'].id);});
		});
	},
	valorizeDataOraFine : function (data) {
		// dormato data fine YYYYMMDDHH:mm
		$("#h-txtDataDimi").val(moment(data, 'YYYYMMDDHH:mm').format('YYYYMMDD'));
		$("#txtDataDimi").val(moment(data, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
		$("#txtOraDimi").val(moment(data, 'YYYYMMDDHH:mm').format('HH:mm'));
	}
};

var NS_FIRMA_SDO = {

	firma : function (p) {

		$(".butSalva").off('click');

		home.FIRMA = $.extend({},home.FIRMA, home.FIRME_ADT["SDO"]);
		// home.NS_FENIX_FIRMA.getInstance(home.FIRME_ADT["SDO"]);

		if (typeof p == 'undefined') {

			var prompts = "&promptpIdenContatto=" + _JSON_CONTATTO.id + "&promptpIdenSDO=" + NS_DIMISSIONE_SDO.SDOInserita;

			p = {
				"STAMPA" : {"PRINT_REPORT":"SDO", "PRINT_DIRECTORY": "SDO", "PRINT_PROMPT": prompts},
				"FIRMA" : {}
			};
		}

		p['FIRMA'].FIRMA_COMPLETA = false;
		p['FIRMA'].PRIMA_FIRMA = !NS_DIMISSIONE_SDO.SDOFirmata;
		p['FIRMA'].IDEN_VERSIONE = NS_DIMISSIONE_SDO.SDOInserita;
		p['FIRMA'].IDEN_VERSIONE_PRECEDENTE = NS_DIMISSIONE_SDO.SDOCorrente;
		p['FIRMA'].TIPO_DOCUMENTO = "SDO";
		p['FIRMA'].TABELLA = "ADT.SDO_VERSIONI";
		p['FIRMA'].KEY_CONNECTION = "ADT";
		p['FIRMA'].CALLBACK = function(){ if ($("#EXIT_ALL").val() == 'S'){ NS_DIMISSIONE_SDO.getSDO(); return; } else { NS_FENIX_SCHEDA.chiudi({'refresh' : true});} };

		logger.debug("Firma - NS_FIRMA_SDO.firma - p -> " + JSON.stringify(p) + " - EXIT_ALL -> " + $("#EXIT_ALL").val());

		home.FIRMA.initFirma(p);
	}
};
