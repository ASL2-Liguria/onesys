var NS_HOME_ADT_FUNZIONI_CONTATTO = {

        anagPinnata : "",
		tipoRicovero : "",

		inserisiciRicovero : function(rec){

			var _JSON_CONTATTO = null;
			var _JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(rec[0].IDEN_ANAGRAFICA);

			//Verifico se l'anagrafica e' pinnata
			//Se pinnata passo un parametro true all'inserimento del ricovero per rendere in sola lettura
			//i campi fondamentali

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			var xhr =  db.select(
				{
					id: "ADT.Q_ANAGRAFICA_PINNATA",
					parameter : {"idenAnag":   {t: 'N', v: _JSON_ANAGRAFICA.id}}
				});

			xhr.done(function (data, textStatus, jqXHR) {

				if(data.result[0].ID4 !== ""){
					NS_HOME_ADT_FUNZIONI_CONTATTO.anagPinnata = "S";
				}
				else{
					NS_HOME_ADT_FUNZIONI_CONTATTO.anagPinnata = "";
				}

			});

			// Verifica della presenza di contatti aperti
			// Se presenti e intenzionati i DH vengono CHIUSI!
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			var xhr =  db.select(
				{
					id: "ADT.Q_CONTATTI_APERTI",
					parameter : {"idenAnag":   {t: 'N', v: _JSON_ANAGRAFICA.id}}
				});

			xhr.done(function (data, textStatus, jqXHR) {

				if (data.result.length>0)
				{
					var dhAperto = false;
					var tableRic="<table border='2' style='width:450px' ><caption>Ricoveri aperti</caption><tr><th>Nosologico</th><th>Regime</th><th>Reparto</th><th>Data</th></tr><tr>";

					for (var i=0; i<data.result.length; i++)
					{
						tableRic += "<td>" + data.result[i].NOSOLOGICO + "</td>";
						tableRic += "<td>" + data.result[i].REGIME + "</td>";
						tableRic += "<td>" + data.result[i].REPARTO + "</td>";
						tableRic += "<td>" + data.result[i].DATA_INIZIO + "</td>";

						if (data.result[i].REGIME == '2') {
							dhAperto = true;
						}
					}

					tableRic += "</table>";

					if (dhAperto) {
						tableRic += "<p>Se si sceglie di proseguire, il ricovero DH verra' chiuso</p>";
					}

					$.dialog(tableRic, {
						buttons :
							[
								{label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
								{label: "Prosegui", action: function (ctx){

									$.dialog.hide();

									var j = 0;

									// Chiusura Forzata DH
									for (var i = 0; i < data.result.length; i++)
									{
										if (data.result[i].REGIME === "2")
										{
											// Variabile che indica se un DH ha almeno un accesso con data precedente alla data di inserimento a quello ordinario
											var dhInvalid = true;

											j++;
											_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(data.result[i].IDEN_CONTATTO);
											// _JSON_CONTATTO.uteDimissione.id = _JSON_CONTATTO.uteAccettazione.id;
											_JSON_CONTATTO.uteModifica.id = home.baseUser.IDEN_PER;
											_JSON_CONTATTO.dataFine = _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].dataFine; // moment().format('YYYYMMDD') + moment().format('HH:mm')
											_JSON_CONTATTO.mapMetadatiString['CHIUSURA_FORZATA'] = 'S';
											_JSON_CONTATTO.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null,codice : '7'};
											_JSON_CONTATTO.contattiGiuridici[_JSON_CONTATTO.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
											_JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

											for (var x = 0; x < _JSON_CONTATTO.contattiAssistenziali.length; x++){
												if ("DISCHARGED" === _JSON_CONTATTO.contattiAssistenziali[x].stato.codice){
													dhInvalid = false;
												}
											}

											var pA03 = {"contatto" : _JSON_CONTATTO, "updateBefore" : false, "hl7Event" : "A03 Chiusura Forzata", "notifica" : {"show" : "S", "timeout" : 10, "message" : "Dimissione Forzata Ricovero DH Avvenuta con Successo", "errorMessage" : "Errore Durante la Dimissione Forzata Ricovero DH"}, "cbkSuccess" : function(){}};

											pA03.cbkSuccess = function(){
												var url = 'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&TIPO=WKPAZ' + '&IDEN_CONTATTO=0&STATO_PAGINA=I&CONTATTI_APERTI=S&CHIUSURA_FORZATA=S';
												NS_HOME_ADT_FUNZIONI_CONTATTO.checkPreRicovero(rec,url,'AccRicovero');
												//home.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&TIPO=WKPAZ' + '&IDEN_CONTATTO=0&STATO_PAGINA=I&CONTATTI_APERTI=S&CHIUSURA_FORZATA=S', id:'AccRicovero',fullscreen:true});
											};

											if (dhInvalid){

												pA03.notifica.message = "Cancellazione ricovero DH non valido eseguita con successo";

												$.dialog("Il ricovero " + _JSON_CONTATTO.codice.codice + " non dispone di accessi chiusi. Proseguendo verrà annullato", {
													buttons : 	[
														{
															label: "Annulla",
															action: function (ctx) {
																$.dialog.hide();
															}
														},
														{
															label: "Prosegui",
															action: function (ctx) {
																$.dialog.hide();
																NS_CONTATTO_METHODS.cancelAdmission(pA03);
															}
														}
													],
													title : "Ricovero DH senza accessi chiusi",
													height:50,
													width:500
												});

											} else {
												NS_CONTATTO_METHODS.dischargeVisit(pA03);
											}
										}
									}

									if (j==0){
										var url = 'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA + '&TIPO=WKPAZ' + '&IDEN_CONTATTO=0&STATO_PAGINA=I&CONTATTI_APERTI=S&CHIUSURA_FORZATA=S&ANAG_PINNATA=' + NS_HOME_ADT_FUNZIONI_CONTATTO.anagPinnata;
										NS_HOME_ADT_FUNZIONI_CONTATTO.checkPreRicovero(rec,url,'AccRicovero');
									}



								}
								}
							],
						title : "Ricoveri sovrapposti",
						height:200,
						width:500
					});
				}
				else
				{
					var url = 'page?KEY_LEGAME=ACC_RICOVERO&IDEN_ANAG=' + rec[0].IDEN_ANAGRAFICA +'&TIPO=WKPAZ'+'&IDEN_CONTATTO=0&CONTATTI_APERTI=N&STATO_PAGINA=I&ANAG_PINNATA='+NS_HOME_ADT_FUNZIONI_CONTATTO.anagPinnata;
					NS_HOME_ADT_FUNZIONI_CONTATTO.checkPreRicovero(rec,url,'AccRicovero');
				}

			});

		},

		accettaTrasferimento:function(rec){

	        logger.debug("accettaTrasferimento - rec: " + JSON.stringify(rec[0]));

	        var _iden_contatto = rec[0].IDEN_CONTATTO;

	        var completaAccettazione = function()
	        {
                var dataArrivoPZ =  $('#h-txtDataArrivoPZ');
                var oraArrivoPZ = $('#txtOraArrivoPZ');
	            if (
	                (dataArrivoPZ.val() == null || dataArrivoPZ.val() == '') ||
	                (oraArrivoPZ.val() == '' || oraArrivoPZ.val() == null)
	                )
	            {
	                return home.NOTIFICA.error({ message : "Popolare i campi Data e Ora di Arrivo del Paziente", title : "Accettazione Trasferimento" });
	            }

	            var contatto = NS_CONTATTO_METHODS.getContattoById(_iden_contatto);

	            // Ultima Posizione Segmenti GIURIDICI
	            var i = contatto.contattiGiuridici.length - 1;

	            // Controllo che la data inserita (Data di Arrivo) non sia inferiore a quella di partenza
	            var _data_partenza = moment(contatto.contattiAssistenziali[i].mapMetadatiString['DATA_PARTENZA_AMBULANZA'],'YYYYMMDDHH:mm');
	            var _data_arrivo = moment(dataArrivoPZ.val() + oraArrivoPZ.val(),'YYYYMMDDHH:mm');

	            if (_data_partenza > _data_arrivo)
	            {
	            	return home.NOTIFICA.error({ message : "Impossibile Accettare il Trasferimento con data di arrivo (" + _data_arrivo.format("DD/MM/YYYY HH:mm") + ") inferiore alla data di partenza (" + _data_arrivo.format("DD/MM/YYYY HH:mm") + ")", title : "Error", timeout : 9 });
	            }

	            // Ultima Posizione Segmenti ASSISTENZIALI
	            var j = contatto.contattiAssistenziali.length - 1;

	            if( contatto.contattiAssistenziali[j].stato.codice == 'REQUESTED')
	            {
	                contatto.contattiAssistenziali[j].uteModifica.id = home.baseUser.IDEN_PER;
	                contatto.contattiAssistenziali[j].precedente = {id:contatto.contattiAssistenziali[j-1].id};
	                contatto.contattiAssistenziali[j].dataInizio = dataArrivoPZ.val() + oraArrivoPZ.val();
	                contatto.contattiAssistenziali[j].mapMetadatiString['DATA_ARRIVO_AMBULANZA'] = dataArrivoPZ.val() + oraArrivoPZ.val();
	            }
	            else
	            {
	            	return home.NOTIFICA.error({message : "Trasferimento da Accettare Assente", title : "Accettazione Trasferimento" });
	            }

	            logger.debug("accettaTrasferimento - Data Arrivo Ambulanza: " + dataArrivoPZ.val() + oraArrivoPZ.val());

	            var pA08 = {"contatto" : contatto, "hl7Event" : "AccettazioneTrasferimento", "notifica" : {"show" : "S", "timeout" : 3, "width" : 220 ,"message" : "Accettazione trasferimento Avvenuta con Successo", "errorMessage" : "Errore Durante Accettazione Trasferimento!"}, "cbkSuccess" : function(){ $.dialog.hide(); NS_HOME_ADT_WK.caricaWk();}};

				if( contatto.contattiGiuridici[i].stato.codice == 'REQUESTED') {
					NS_CONTATTO_METHODS.accettaTrasferimentoGiuridico(pA08);
				} else {
					NS_CONTATTO_METHODS.accettaTrasferimentoAssistenziale(pA08);
				}
	        };

	        var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Paziente</td><td colspan='2'>" + rec[0].ASSISTITO + "</td>";
	        tbl += "</tr>";

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Data Richiesta Trasferimento</td><td colspan='2'>" + rec[0].DATA_RICHIESTA_TRASFERIMENTO + "</td>";
	        tbl += "</tr>";

	        if (rec[0].AMBULANZA_DATA_PARTENZA)
	        {
	            tbl += "<tr style='height:25px'>";
	            tbl += "<td>Data partenza con Ambulanza</td><td>" + moment(rec[0].AMBULANZA_DATA_PARTENZA,'YYYYMMDDHH:mm').format('DD/MM/YYYY') + "</td>";
	            tbl += "<td>Ora </td><td>" + moment(rec[0].AMBULANZA_DATA_PARTENZA,'YYYYMMDDHH:mm').format('HH:mm') + "</td>";
	            tbl += "</tr>";
	        }

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Data arrivo paziente</td>" +
	            "<td class='tdData' id ='tdTest'>" +
	            "<input type='text' id='txtDataArrivoPZ' class='tdObb' />" +
	            "<input name='h-txtDataArrivoPZ' type='hidden' data-col-save='DATA_ARRIVO_PZ' id='h-txtDataArrivoPZ' value='' />" +
	            "</td>";

	        tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraArrivoPZ' class='tdObb'></td>";
	        tbl += "</tr>";
	        tbl += "</table>";

	        $.dialog(tbl, {
	            buttons : 	[
	                {
	                    label: "Annulla", action: function (ctx)
	                {
	                    $.dialog.hide();
	                }
	                },
	                {
	                    label: "Prosegui",
	                    action: function (ctx)
	                    {
	                        completaAccettazione();
	                    }
	                }
	            ],
	            title : "Accettazione Trasferimento - Dettaglio",
	            height:175,
	            width:500
	        });

	        $('#txtDataArrivoPZ').Zebra_DatePicker({startWithToday:true, readonly_element: false, format: 'd/m/Y', view: 'month',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});

	        $('#txtOraArrivoPZ')
	            .live()
	            .setMask("29:59")
	            .keypress(function() {
	                var currentMask = $(this).data('mask').mask;
	                var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	                if (newMask != currentMask) {
	                    $(this).setMask(newMask);
	                }
	            }).val(moment().format('HH:mm'));

	        return;

	    },

	    richiediTrasferimento : function(idenContatto){
	        home.NS_FENIX_TOP.apriPagina({url : "page?KEY_LEGAME=RIC_TRASF_GIURIDICO&IDEN_CONTATTO=" + idenContatto, id : "Trasferimento", fullscreen:true});
	    },

	    richiediCancellazioneRicovero : function(rec){

	    	var db = $.NS_DB.getTool({setup_default:{datasource : 'WHALE'}});

	        var xhr =  db.select(
	        {
	                id: 'DATI.CHECKDATICARTELLA',
	                parameter : {"NOSOLOGICO":   {t: 'V', v: rec.CODICE}}
	        });

	        xhr.done(function (data, textStatus, jqXHR) {

	        	logger.debug("Richiesta Cancellazione Ricovero - CHECKDATICARTELLA - Response per NOSOLOGICO " + rec.CODICE + " -> " + JSON.stringify(data));

	        	if(data.result[0].NUM == null )
	        	{
	        		home.NOTIFICA.error({message: "Attenzione! Errore durante la determinazione della presenza dati in cartella clinica.", timeout : 6, title: "Error"});
	        		return logger.debug("CHECKDATICARTELLA = null quindi c'e' il nosologico che non corrisponde da adt a whale");
	        	}

	        	logger.debug("Richiesta Cancellazione Ricovero - Utente BACKOFFICE -> " + home.basePermission.hasOwnProperty('BACKOFFICE'));

	        	if(data.result[0].NUM > 0 && home.basePermission.hasOwnProperty('BACKOFFICE'))
	            {
	               home.NOTIFICA.warning({message: "Attenzione! Per Il ricovero sono gi&agrave; presenti dei dati in cartella clinica", timeout : 6, title: "Warning"});
	            }
	            else if (data.result[0].NUM > 0 && !home.basePermission.hasOwnProperty('BACKOFFICE'))
	            {
	            	return home.NOTIFICA.error({message: "Attenzione! Impossibile cancellare il ricovero selezionato. Per Il ricovero sono gi&agrave; presenti dei dati in cartella clinica", timeout : 6, title: "Error"});
	            }

	        	var idenContatto = rec.IDEN_CONTATTO;

	        	var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

	            tbl += "<tr>";
	            tbl += "<td>Motivo Cancellazione</td><td colspan='2'><textarea id='txtMotivoCancellazione' style='width:250px;height:60px;'></textarea></td>";
	            tbl += "</tr>";
	            tbl += "</table>";


	            $.dialog(tbl, {
	                buttons : 	[
	                    {
	                    	label: "Annulla", action: function (ctx) { $.dialog.hide(); }
	                    },
	                    {
	                        label: "Prosegui", action: function (ctx)
	                        	{
	                        		$.dialog.hide();

	    	                    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
	    	                    	_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
	    	                    	_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	    	                    	_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	    	                    	_json_contatto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO'] = $('#txtMotivoCancellazione').val();

	    	                    	logger.debug("Annullamento Ricovero - Inizio Annullamento Ricovero ID -> " + _json_contatto.id + ", UTE MODIFICA -> " + _json_contatto.uteModifica.id + ", MOTIVO -> " + _json_contatto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO']);

	    	                    	var pCancel = {"contatto" : _json_contatto, hl7Event : "A11", "updateBefore": true, "notifica" : {"show" : "S", "timeout" : 3, "message" : "Cancellazione Ricovero Avvenuta Con Successo", "errorMessage" : "Errore Durante la Cancellazione Ricovero"}, "cbkSuccess" : function(){$.dialog.hide(); NS_HOME_ADT_WK.wkRicoverati.refresh();}, "cbkError" : function(){}};

	    	                    	if (_json_contatto.stato.codice === "ADMITTED")
	    	                    	{
	    	                    		NS_CONTATTO_METHODS.cancelAdmission(pCancel);
	    	                    	}
	    	                    	else
	    	                    	{
	    	                    		NS_CONTATTO_METHODS.cancelPreAdmission(pCancel);
	    	                    	}

	    	                    }
	                    }
	                ],
	                title : "Annullamento Ricovero - Motivo",
	                height : 125,
	                width : 500
	            });

	        });

	    },

	    richiediCancellazioneRicoveroDimesso : function(iden_contatto){

	    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(iden_contatto);

	        var param = { "NOSOLOGICO":  _json_contatto.codice.codice};

	        toolKitDB.getResultDatasource("DATI.CHECKDATICARTELLA", "WHALE", param, null, function(resp) {

	            if(resp[0].NUM == null ){logger.debug("CHECKDATICARTELLA = null quindi c'e' il nosologico che non corrisponde da adt a whale"); return; }

	            if(resp[0].NUM > 0 )
	            {
	               home.NOTIFICA.warning({message: "Attenzione! Per Il ricovero sono gi&agrave; presenti dei dati in cartella clinica", timeout : 6, title: "Warning"});
	            }
	        });

	    	var dialogConsensoI = function(){

	    		var _textConsensoI = "Si vuole procedere alla cancellazione di un ricovero dimesso?";

	    		$.dialog(_textConsensoI, {
	                buttons : 	[
	                    {
	                    	label: "Annulla", action: function (ctx) { $.dialog.hide(); }
	                    },
	                    {
	                        label: "Prosegui", action: function (ctx) { dialogConsensoII(); }
	                    }
	                ],
	                title : "Cancellazione Ricovero Dimesso - I Consenso",
	                height : 50,
	                width : 500
	            });

	    	};

	    	var dialogConsensoII = function(){

	    		var _textConsensoII = "Procedendo si conferma la cancellazione di un ricovero dimesso e di tutti i dati ad esso associati, procedere?";
	    		var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

	            tbl += "<tr>";
	            tbl += "<td>Motivo Cancellazione</td><td colspan='2'><textarea id='txtMotivoCancellazione' style='width:250px;height:60px;'></textarea></td>";
	            tbl += "</tr>";

	            tbl += "</table>";
	            _textConsensoII=_textConsensoII + tbl;
	    		$.dialog(_textConsensoII, {
	                buttons : 	[
	                    {
	                    	label: "Annulla", action: function (ctx) { $.dialog.hide(); }
	                    },
	                    {
	                        label: "Prosegui", action: function (ctx) {annullaRicoveroDimesso(); $.dialog.hide();}
	                    }
	                ],
	                title : "Cancellazione Ricovero Dimesso - II Consenso",
	                height : 125,
	                width : 500
	            });

	    	};

	    	var annullaRicoveroDimesso = function() {

	    		_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
	        	_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	        	_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	        	 var pCancelDischarge = {"contatto" : _json_contatto, "notifica" : "S", "cbkSuccess" : function(){

	    			var _json_contattoRiaperto = NS_CONTATTO_METHODS.getContattoById(iden_contatto);
	            	_json_contattoRiaperto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO'] = $('#txtMotivoCancellazione').val();

	            	var pCancelAdmission = {"contatto" : _json_contattoRiaperto, "updateBefore": true,"notifica" : {"show" : "S", "timeout" : 3, "message" : "Cancellazione Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Cancellazione Ricovero!"}, "cbkSuccess" : function(){$.dialog.hide(); NS_HOME_ADT_WK.wkDimessi.refresh();}, "cbkError" : function(){}};
	            	NS_CONTATTO_METHODS.cancelAdmission(pCancelAdmission);
	            	},
	            	"cbkError" : function(){}
	            };
	    		NS_CONTATTO_METHODS.cancelDischarge(pCancelDischarge);

	    	};

	    	dialogConsensoI();
	    },

	    richiediAnnullamentoDimissione: function(idenContatto){

	        home.DIALOG.si_no(
	        		{
	        			cbkSi:function(){

	        				var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
	        				_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
	        				_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
	        				_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

	        				var pCancelDischarge = {"contatto" : _json_contatto, "hl7Event" : "A13", "updateBefore" : false, "notifica" : {"show" : "S", "message" : "Annullamento Dimissione Avvenuto con Successo", "errorMessage" : "Errore Durante Annullamento Dimissione", "timeout" : 3}, "cbkSuccess" : function(){NS_HOME_ADT_WK.wkDimessi.refresh();}, "cbkError" : function(){}};

	        				NS_CONTATTO_METHODS.cancelDischarge(pCancelDischarge);
	        			}
	        		});
	    },

		/**
		 * Funzione per l'annullamento dell'ultimo Trasferimento Giuridico. <br />
		 * Il trasferimento pu� essere cancellato solo dal reparto che lo ha richiesto/effettuato entro 12 Ore dall'inserimento (CONTATTI_GIURIDICI.data_ins).
		 *
		 * @param rec
		 */
		richiediAnnullamentoTrasferimento : function(idenContatto, idenSegmentoCartella){

			logger.debug("Cancellazione Trasferimento - Contatto -> " + idenContatto + ", Riferimento Contatto Assistenziale Cartella -> " + idenSegmentoCartella);

			var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenContatto);
			_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;

			if (typeof idenSegmentoCartella == "undefined" || idenSegmentoCartella == null)
			{
				return home.NOTIFICA.error({message: "Riferimento del Trasferimento a Cartella Clinica NON Valido. Impossibile Cancellare il Trasferimento" , timeout: 0, title: "Error"});
			}

			var db = $.NS_DB.getTool({setup_default:{datasource : 'WHALE'}});

	        var xhr =  db.select(
	        {
	                id: 'DATI.CHECKDATIACCESSO',
	                parameter : {"IDEN":   {t: 'N', v: idenSegmentoCartella}}
	        });

	        xhr.done(function (data, textStatus, jqXHR) {

				logger.debug("Cancellazione Trasferimento - Quesry DATI.CHECKDATIACCESSO Eseguita con Successo - Result -> " + JSON.stringify(data));

	        	if(data.result[0].NUM === "0" )
		       	{
					logger.debug("Cancellazione Trasferimento - Assenza di dati in Cartella Clinica - Procedo con cancellazione");

					home.DIALOG.si_no({
			           	title : "Cancellazione Trasferimento",
			           	msg : "Si conferma l'operazione di ANNULLAMENTO del trasferimento selezionato?",
			           	cbkNo : function(){ return; },
			           	cbkSi: function(){
			           		var pCancelTransferpatient = {"contatto" : _json_contatto, "hl7Event" : "A12", "tipoTrasferimento" : "GA", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Cancellazione Trasferimento Avvenuta con Successo", "errorMessage" : "Errore Durante Cancellazione Trasferimento"}, "cbkSuccess" : function(){NS_HOME_ADT_WK.wkTrasferimenti.refresh();}};
			           		NS_CONTATTO_METHODS.cancelTransferPatient(pCancelTransferpatient);
			           	}
		        	});

		       	}
	        	else
	        	{
		       		return home.NOTIFICA.error({message: "Attenzione Presenti Dati in Cartella Clinica. Impossibile Annullare il Trasferimento" , timeout: 0, title: "Error"});
		       	}

	        });

	        xhr.fail(function (response) {
	            logger.error("Cancellazione Trasferimento  - XHR Error -> " + JSON.stringify(response));
	            home.NOTIFICA.error({message: "Errore nella Determinazione dell Presenza di Dati in Cartella Clinica" , timeout: 0, title: "Error"});
	        });

		},

	    inserisciPermesso : function(rec) {

	    	var idContatto = rec.IDEN_CONTATTO;
	    	var idContattoAssistenziale = rec.IDEN_CONTATTO_ASSISTENZIALE;
			var dataInizio;
			if(rec.DATA_CHIUSURA_ULTIMO_PERMESSO != '' && rec.DATA_CHIUSURA_ULTIMO_PERMESSO != null) {
				dataInizio = rec.DATA_CHIUSURA_ULTIMO_PERMESSO;
			}else{
				dataInizio = rec.DATA_INIZIO_ISO;
			}


	        var completaPermesso = function()
	        {
				var hDataInizioPermesso =  $('#h-txtDataInizioPermesso').val();
				var oraInizioPermesso =  $('#txtOraInizioPermesso').val();


	            if (
	                (hDataInizioPermesso == null || hDataInizioPermesso == '') ||
	                (oraInizioPermesso == '' || oraInizioPermesso == null)
	                )
	            {
	                return home.NOTIFICA.error({ message : "Popolare i campi data e ora di inizio del permesso", title : "Inserimento Permesso" });
	            }

	            var dataOraInizioPermesso = moment(hDataInizioPermesso + oraInizioPermesso,'YYYYMMDDHH:mm').format('YYYYMMDDHH:mm');
	            var dataOraFinePermesso = "";

				var hDataFinePermesso =  $('#h-txtDataFinePermesso').val();
				var txtOraFinePermesso = $('#txtOraFinePermesso').val();

	            if (hDataFinePermesso != "" &&  txtOraFinePermesso != "")
	            {
	            	dataOraFinePermesso = moment(hDataFinePermesso + txtOraFinePermesso,'YYYYMMDDHH:mm').format('YYYYMMDDHH:mm');;
	            }
	            else if (hDataFinePermesso!= "" && txtOraFinePermesso == "")
	            {
	            	return home.NOTIFICA.error({ message : "Popolare l'ora di fine del permesso", title : "Error", timeout : 9 });
	            }
	            else if (hDataFinePermesso == "")
	            {
	            	dataOraFinePermesso = null;
	            }


	            if (dataOraInizioPermesso > dataOraFinePermesso)
	            {
	            	return home.NOTIFICA.error({ message : "Impossibile inserire il permesso con data di fine (" + moment(dataOraFinePermesso,'YYYYMMDDHH:mm').format("DD/MM/YYYY HH:mm") + ") inferiore alla data di inizio (" + moment(dataOraInizioPermesso,'YYYYMMDDHH:mm').format("DD/MM/YYYY HH:mm") + ")", title : "Error", timeout : 9 });
	            }

	        	var permesso = NS_PERMESSO.getPermessoStruttura();
	        	permesso.idContatto = idContatto;
	        	permesso.idContattoAssistenziale =	idContattoAssistenziale;
	        	permesso.dataInizio = dataOraInizioPermesso;
	        	permesso.dataFine = dataOraFinePermesso;
	        	permesso.utenteInserimento.id = home.baseUser.IDEN_PER;
	        	permesso.note = "Note inserimento permesso da interfaccia";

	            var pA21 = {"permesso" : permesso, "hl7Event" : "A21", "notifica" : {"show" : "S", "timeout" : 3, "message" : "Inserimento Permesso Avvenuto con Successo", "errorMessage" : "Errore Durante Inserimento Permesso!"}, "cbkSuccess" : function(){ $.dialog.hide(); NS_HOME_ADT_WK.caricaWk();}};

	            NS_PERMESSO.inserisciPermesso(pA21);

	        };

	        var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Paziente</td><td colspan='4'>" + rec.ASSISTITO + "</td>";
	        tbl += "</tr>";

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Data inizio permesso</td>" +
	            "<td class='tdData' id ='tdDataInizioPermesso'>" +
	            "<input type='text' id='txtDataInizioPermesso' class='tdObb' />" +
	            "<input name='h-txtDataInizioPermesso' type='hidden' id='h-txtDataInizioPermesso' value=''/>" +
	            "</td>";
	        tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraInizioPermesso' class='tdObb'></td>";
	        tbl += "</tr>";

	        tbl += "<tr style='height:25px'>";
	        tbl += "<td>Data fine permesso</td>" +
	            "<td class='tdData' id ='tdDataFinePermesso'>" +
	            "<input type='text' id='txtDataFinePermesso' class='' />" +
	            "<input name='h-txtDataFinePermesso' type='hidden' id='h-txtDataFinePermesso' value=''/>" +
	            "</td>";
	        tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraFinePermesso' class=''></td>";
	        tbl += "</tr>";

	        tbl += "</table>";

	        $.dialog(tbl, {
	            buttons :
	            	[
	            	 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
	                    {label: "Prosegui", action: function (ctx) { completaPermesso(); }}
	            	 ],
	            title : "Inserimento Permesso",
	            height : 100,
	            width : 500
	        });
			var txtDataFinePermesso = $('#txtDataFinePermesso');
			var txtDataInizioPermesso =  $('#txtDataInizioPermesso');
			txtDataInizioPermesso.Zebra_DatePicker({startWithToday : true, readonly_element: false, format: 'd/m/Y', view: 'month',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});
			txtDataFinePermesso.Zebra_DatePicker({startWithToday : false, readonly_element: false, format: 'd/m/Y', view: 'month',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});
	        $('#txtDataInizioPermesso, #txtDataFinePermesso').maskData({separatorIn: '/',separatorOut: '/',formatIn: 'd m Y', formatOut: 'd m Y',disabled:false});

	        $('#txtOraInizioPermesso, #txtOraFinePermesso')
	        	.live()
	            .setMask("29:59")
	            .keypress(function() {
	                var currentMask = $(this).data('mask').mask;
	                var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	                if (newMask != currentMask) {
	                    $(this).setMask(newMask);
	                }
	            });
			var txtOraInizioPermesso = $('#txtOraInizioPermesso');
			txtOraInizioPermesso.val(moment().format('HH:mm'));

			function fncCheckDataIniPermesso (id) {

				if(!DATE_CONTROL.checkBetwen2Date({date1 :  txtOraInizioPermesso.val() +' ' + txtDataInizioPermesso.val()  , date2 : dataInizio} )){
					home.NOTIFICA.error({ message : "Popolare correttamente data inizio permesso. Ultimo permesso sucessivo alla data inserita" + dataInizio, title : "Termine Permesso", timeout : 0});
					$("#"+id).val("");
				}
			}

			txtDataInizioPermesso.on({"change" : function(){
				if($(this).val()!= ''){
					fncCheckDataIniPermesso($(this).attr("id"));
				}
			},"blur" :function(){
				if($(this).val()!= ''){
					fncCheckDataIniPermesso($(this).attr("id"));
				}
			}});
			txtOraInizioPermesso.on({"blur" :function(){

				if(txtDataInizioPermesso.val() !== ''){
					fncCheckDataIniPermesso($(this).attr("id"));
				}

			}});




	    },

	    terminaPermesso : function(rec) {

	    	var contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
	    	var permesso = contatto.permessi[contatto.permessi.length - 1];

	    	for (var j = 0; j < contatto.permessi.length; j++){
	    		if (contatto.permessi[j].stato.codice == "ABSENT"){
	    			permesso = contatto.permessi[j];
	    		}
	    	}

	        var completaTerminePermesso = function()
	        {

	            if (
	                ($('#h-txtDataFinePermesso').val() == null || $('#h-txtDataFinePermesso').val() == '') ||
	                ($('#txtOraInizioPermesso').val() == '' || $('#txtOraInizioPermesso').val() == null)
	                )
	            {
	                return home.NOTIFICA.error({ message : "Popolare data e ora di fine del permesso", title : "Termine Permesso", timeout : 3});
	            }

	            var dataOraInizioPermesso = moment(permesso.dataInizio,'YYYYMMDDHH:mm');
	            var dataOraFinePermesso = moment($('#h-txtDataFinePermesso').val() + $('#txtOraFinePermesso').val(),'YYYYMMDDHH:mm');

	            if (dataOraInizioPermesso > dataOraFinePermesso)
	            {
	            	return home.NOTIFICA.error({ message : "Impossibile inserire il permesso con data di fine (" + moment(dataOraFinePermesso,'YYYYMMDDHH:mm').format("DD/MM/YYYY HH:mm") + ") inferiore alla data di inizio (" + moment(dataOraInizioPermesso,'YYYYMMDDHH:mm').format("DD/MM/YYYY HH:mm") + ")", title : "Error", timeout : 5 });
	            }

	        	permesso.dataInizio = dataOraInizioPermesso.format("YYYYMMDDHH:mm");
	        	permesso.dataFine = dataOraFinePermesso.format("YYYYMMDDHH:mm");
	        	permesso.utenteChiusura.id = home.baseUser.IDEN_PER;
	        	permesso.note = "Note inserimento permesso da interfaccia";

	            var pA22 = {"permesso" : permesso, "hl7Event" : "A22", "notifica" : {"show" : "S", "timeout" : 3, "message" : "Chiusura Permesso Avvenuto con Successo", "errorMessage" : "Errore Durante Chiusura Permesso!"}, "cbkSuccess" : function(){ $.dialog.hide(); NS_HOME_ADT_WK.caricaWk();}};

	            NS_PERMESSO.terminaPermesso(pA22);
	        };

	        var tbl = "<table border='2' style='width:450px;font-size:14px;'>";
	        var dataFine = permesso.dataFine == null ? moment() : moment(permesso.dataFine,'YYYYMMDDHH:mm');

	        tbl += "<tr style='height:30px'>";
	        tbl += "<td>Paziente</td><td colspan='4'>" + rec.ASSISTITO + "</td>";
	        tbl += "</tr>";

	        tbl += "<tr style='height:30px'>";
	        tbl += "<td>Data inizio permesso</td>" +
	            "<td class='tdData' id ='tdDataInizioPermesso'>" +
	            "<input type='text' readonly id='txtDataInizioPermesso' value='" + moment(permesso.dataInizio,'YYYYMMDDHH:mm').format("DD/MM/YYYY") + "' />" +
	            "<input name='h-txtDataInizioPermesso' type='hidden' id='h-txtDataInizioPermesso' value='" + permesso.dataInizio + "'/>" +
	            "</td>";
	        tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraInizioPermesso' readonly value='" + moment(permesso.dataInizio,'YYYYMMDDHH:mm').format("HH:mm") + "'></td>";
	        tbl += "</tr>";



	        tbl += "<tr style='height:30px'>";
	        tbl += "<td>Data fine permesso</td>" +
	            "<td class='tdData' id ='tdDataFinePermesso'>" +
	            "<input type='text' id='txtDataFinePermesso' class='tdObb' value='" + dataFine.format("DD/MM/YYYY") + "'/>" +
	            "<input name='h-txtDataFinePermesso' type='hidden' id='h-txtDataFinePermesso' value='" + dataFine.format("YYYYMMDD") + "'/>" +
	            "</td>";
	        tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraFinePermesso' class='tdObb' value='" + dataFine.format("HH:mm") + "'></td>";
	        tbl += "</tr>";

	        tbl += "</table>";

	        $.dialog(tbl, {
	            buttons :
	            	[
	            	 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
	                    {label: "Prosegui", action: function (ctx) { completaTerminePermesso(); }}
	            	 ],
	            title : "Inserimento Permesso",
	            height : 120,
	            width : 500
	        });

	        $('#txtDataFinePermesso').Zebra_DatePicker({startWithToday : false, readonly_element: false, format: 'd/m/Y', view: 'month',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});
	        $('#txtDataFinePermesso').maskData({separatorIn: '/',separatorOut: '/',formatIn: 'd m Y', formatOut: 'd m Y',disabled:false});

	        $('#txtOraFinePermesso')
	        	.live()
	            .setMask("29:59")
	            .keypress(function() {
	                var currentMask = $(this).data('mask').mask;
	                var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	                if (newMask != currentMask) {
	                    $(this).setMask(newMask);
	                }
	            });

	    },

	    /**
	     * Metodo per la gestione della chiusura delpre-ricovero.
	     * Se il PRE e' stato inserito da un cdc VPO questo deve avere valorizzato il cdc di destinazione
	     * in caso contrario viene chiesta la modifica del pre-ricovero volta a popolare questo campo.
	     * Se il PRE � stato inserito da un cdc NON VPO questo il cdc di destinazione non � richiesto.
	     * La chiusura del PRE richiede solo l'inserimento di una data che corri
	     *
	     * @author alessandro.arrighi
	     */
	    chiudiPrericovero : function(rec,callback)
	    {
	    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
	        var _table = $(	"<table><tr><td><div id='gestioneChiusuraPrericovero'></div></td></tr><tr><td id='tdOraChiusuraPrericovero' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataChiusuraPrericovero'/><input type='text' id='txtOraChiusuraPrericovero' class='tdObb' /></td></tr></table>");

	        var apriModificaPrericovero = function(){
	        	top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=INS_PRERICOVERO&IDEN_ANAG=' + _json_contatto.anagrafica.id +'&IDEN_CONTATTO=' + _json_contatto.id +'&ORIGINE=WK_CONTATTI&STATO_PAGINA=E', id : 'INS_PRERICOVERO',fullscreen:true});
	        };

	        var completaChiusuraPrericovero = function(){

	        	var _ora = $('#txtOraChiusuraPrericovero').val();
	         	var _data = $('#h-txtDataChiusuraPrericovero').val();

	             if (_data === "" || _data == null) {
	             	return home.NOTIFICA.error({message: "Selezionare la data di chiusura del pre-ricovero", timeout: 6, title: 'Error'});
	             }

	             if (_ora.length < 5) {
	             	return home.NOTIFICA.error({message: "Popolare correttamente l'ora di chiusura del pre-ricovero", timeout: 6, title: 'Error'});
	             }

				_json_contatto.uteDimissione.id = home.baseUser.IDEN_PER;
				_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
				_json_contatto.dataFine = moment(_data, "DD/MM/YYYY").format('YYYYMMDD') +_ora;
				_json_contatto.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null ,codice : '9P'};

				_json_contatto.contattiGiuridici[0].dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora;
				_json_contatto.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;
				_json_contatto.contattiGiuridici[0].note = "Contatto Giuridico PRE-RICOVERO chiuso in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

				_json_contatto.contattiAssistenziali[0].dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora;
				_json_contatto.contattiAssistenziali[0].uteModifica.id = home.baseUser.IDEN_PER;
				_json_contatto.contattiAssistenziali[0].note = "Contatto Assistenziale PRE-RICOVERO chiuso in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

				var pCancelDischarge = {"contatto" : _json_contatto, "hl7Event" : "A03", "updateBefore" : true, "notifica" : {"show" : "S", "message" : "Chiusura pre-ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Chiusura pre-ricovero", "timeout" : 3}, "cbkSuccess" : function(){NS_HOME_ADT_WK.wkRicoverati.refresh();}, "cbkError" : function(){}};

				NS_CONTATTO_METHODS.dischargeVisit(pCancelDischarge);
	        };

	        var _isFromVPO = _json_contatto.mapMetadatiString.hasOwnProperty('CDC_DESTINAZIONE_VPO');
	        var _has_cdc_destinazione = _json_contatto.mapMetadatiString["CDC_DESTINAZIONE_VPO"] != null && _json_contatto.mapMetadatiString["CDC_DESTINAZIONE_VPO"] !== "" ? true : false;

	        if (_isFromVPO && !_has_cdc_destinazione)
	        {
	        	$.dialog("Il pre-ricovero &egrave; stato inserito dal reparto <b>" + _json_contatto.contattiGiuridici[0].provenienza.descrizione + "</b> abilitato all'inserimento di pre-ricoveri VPO. <br /> Il reparto di destinazione non &egrave; stato indicato pertanto si desidera aprire la modifica del pre-ricovero?", {
					buttons :
					[
					 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
				        {label : "Prosegui", action : function (ctx) { $.dialog.hide(); apriModificaPrericovero(); }}
					],
					title : "Chiusura pre-ricovero " + _json_contatto.codice.codice,
		          	height : 80,
		          	width : 350
	        	});
	        }
	        else
	        {
		        $.dialog(_table, {
							buttons :
							[
							 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
						        {label : "Prosegui", action : function(){ $.dialog.hide(); completaChiusuraPrericovero(); if(typeof callback == "function"){callback();}}}
							],
							title : "Chiusura pre-ricovero " + _json_contatto.codice.codice,
				          	height : 340,
				          	width : 250
		        });
	        }


	        _table.Zebra_DatePicker({always_visible: $("#gestioneChiusuraPrericovero"), direction: [moment(_json_contatto.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")], onSelect: function(data,dataIso) {
	        	$("#h-txtDataChiusuraPrericovero").val(data);
	        }});

	        $('#txtOraChiusuraPrericovero').live().setMask("29:59").keypress(function() {

	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";

	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }

	         }).val(moment().format('HH:mm'));

	         $("#gestioneChiusuraPrericovero div.Zebra_DatePicker").css({"position":"relative"});
	         $("#tdOraChiusuraPrericovero").css({"padding-top":"5px"});
	    },

	checkPreRicovero : function(rec,url,idScheda){
		var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

		var xhr = db.select(
			{
				id: "ADT.Q_CHECK_PRERICOVERO",
				parameter: {
					"idenAnag": {t: 'N', v: rec[0].IDEN_ANAGRAFICA},
					"username": {t: 'V', v: home.baseUser.USERNAME}
				}
			});

		xhr.done(function (data, textStatus, jqXHR) {

			var tableRic="<table border='2' style='width:450px' ><caption>Prericoveri aperti <br> Se si vuole , selezionare prericovero da associare al ricovero<br><br></caption><tr><th>Nosologico</th><th>Data</th><th>Seleziona</th></tr><tr>";
			var resp = data.result;

			if(resp.length > 0){
				for (var i=0; i<resp.length; i++)
				{

					tableRic += "<tr data-iden='"+resp[i].IDEN+"'><td>" + resp[i].CODICE + "</td>";
					tableRic += "<td>" + moment(resp[i].DATA_INIZIO, 'YYYYMMDDHH:mm').format('DD/MM/YYYY HH:mm') + "</td><td><input class='prericovero' type='checkbox' name='prericovero' onclick='NS_HOME_ADT_FUNZIONI_CONTATTO.svuotaCheck(this);'></td></tr>";

				}


				$.dialog(tableRic, {
					buttons :
						[
							{label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
							{label: "Prosegui", action: function (ctx){

								$.dialog.hide();

								$(".prericovero").each(function(){
									if ($(this).is(":checked")){
										var idenCont = $(this).closest("td").closest("tr").attr('data-iden');
										var rec = {"IDEN_CONTATTO": idenCont};
										url += '&IDEN_CONTATTO_PRE='+idenCont;
										var newTipo = "DAPRE";
										url = url.replace(/(TIPO=).*?(&)/,'$1' + newTipo + '$2');//url.replace("WKPAZ","DAPRE");

										/*NS_HOME_ADT_FUNZIONI_CONTATTO.chiudiPrericovero(rec,function(){home.NS_FENIX_TOP.apriPagina({
												url: url,
												id: 'AccRicovero',
												fullscreen: true
											})
										})*/

										home.NS_FENIX_TOP.apriPagina({
											url: url,
											id: idScheda,
											fullscreen: true
										});
									}
									else{
										if($(".prericovero:checked").length == 0){
											home.NS_FENIX_TOP.apriPagina({
												url: url,
												id: idScheda,
												fullscreen: true
											});
										}

									}
								})





							}
							}
						],
					title : "Prericoveri presenti",
					height:200,
					width:500
				});
			}
			else{
				NS_HOME_ADT_FUNZIONI_CONTATTO.checkListaAttesa(rec,url,idScheda,'RICOVERO');
			}





		});
	},

	svuotaCheck : function(elem){
		$(".prericovero").not(elem).each(function(){
			$(this).removeAttr("checked");
		})
	},


	checkListaAttesa : function(rec,url,idScheda,tipo){
		var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});

		var xhr = db.select(
			{
				id: "ADT.Q_CHECK_LISTA_ATTESA",
				parameter: {
					"idenAnag": {t: 'N', v: rec[0].IDEN_ANAGRAFICA},
					"username": {t: 'V', v: home.baseUser.USERNAME}
				}
			});

		xhr.done(function (data, textStatus, jqXHR) {

			var tableRic="<table border='2' style='width:1000px' ><caption>Posizioni lista attese presenti per il paziente<br> Se si vuole , selezionare posizione da associare al " + tipo + "<br><br></caption><tr><th>Data Prenotazione</th><th>Lista inserimento</th><th>Diagnosi</th><th>Note</th><th>Seleziona</th></tr><tr>";
			var resp = data.result;

			if(resp.length > 0){
				for (var i=0; i<resp.length; i++)
				{

					tableRic += "<tr data-iden='"+resp[i].IDEN+"' data-iden_lista='"+resp[i].IDEN_LISTA+"'><td align='center'>" + moment(resp[i].DATA_PRENOTAZIONE,'YYYYMMDDHH:mm').format('DD/MM/YYYY HH:mm') + "</td>";
					tableRic += "<td align='center'>" + resp[i].LISTA_DESCRIZIONE + "</td>";
					tableRic += "<td align='center'>" + resp[i].DIAGNOSI + "</td>";
					tableRic += "<td align='center'>" + resp[i].NOTE + "</td><td><input class='listaAttesa' type='checkbox' name='listaAttesa' onclick='NS_HOME_ADT_FUNZIONI_CONTATTO.svuotaCheckListaAttesa(this);'></td></tr>";

				}


				$.dialog(tableRic, {
					buttons :
						[
							{label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
							{label: "Prosegui", action: function (ctx){

								$.dialog.hide();

								$(".listaAttesa").each(function(){
									if ($(this).is(":checked")){
										var idenLista = $(this).closest("td").closest("tr").attr('data-iden');
										var idenListaAttesa = $(this).closest("td").closest("tr").attr('data-iden_lista');



										var newTipo = "";
										if(tipo == "RICOVERO"){
											newTipo = "LISTA";
											url = url.replace(/(TIPO=).*?(&)/,'$1' + newTipo + '$2');//url.replace("WKPAZ","LISTA");
											url += '&IDEN_LISTA='+idenLista;
										}
										else if (tipo == "PRERICOVERO"){
											url += '&ORIGINE=LISTA_ATTESA&IDEN_LISTA_ELENCO='+idenListaAttesa+'&IDEN_LISTA='+idenLista;
										}



										home.NS_FENIX_TOP.apriPagina({
											url: url,
											id: idScheda,
											fullscreen: true
										});
									}
									else{
										if($(".listaAttesa:checked").length == 0){
											home.NS_FENIX_TOP.apriPagina({
												url: url,
												id: idScheda,
												fullscreen: true
											});
										}

									}

								})

							}
							}
						],
					title : "Posizioni lista attesa",
					height:200,
					width:1100
				});
			}
			else{
				home.NS_FENIX_TOP.apriPagina({
					url: url,
					id: idScheda,
					fullscreen: true
				});
			}


		});
	},

	svuotaCheckListaAttesa : function(elem){
		$(".listaAttesa").not(elem).each(function(){
			$(this).removeAttr("checked");
		})
	}
};