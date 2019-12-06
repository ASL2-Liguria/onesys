var NS_ACC_RICOVERO_SALVATAGGI =
{
		/**
		 * Si occupa della registrazione del contatti in INSERIMENTO.
		 * Prima di inserire il contatto registra, se valorizzati il codice STP ed ENI
		 *
		 * @returns
		 */

		registraInserimento : function() {
			try {
				logger.debug("Registra Inserimento - Init");
				NS_LOADING.showLoading({"timeout" : 0, loadingclick : false});

				NS_ACC_RICOVERO_CHECK.stopRegistra = false;

				if(!NS_FENIX_SCHEDA.validateFields()) {
					NS_LOADING.hideLoading();

					return;
				}

				if(!NS_ACC_RICOVERO_CHECK.checkPresalvataggio()) {
					NS_LOADING.hideLoading();
					return;
				}

				_JSON_CONTATTO = NS_ACC_RICOVERO_SALVATAGGI.valorizzaContatto(_JSON_CONTATTO);

				//_JSON_CONTATTO = NS_ACC_RICOVERO_ANAGRAFICA.setMetadatiAnagrafica(_JSON_CONTATTO);
				NS_ACC_RICOVERO_ANAGRAFICA.salvaAnagrafica(completaSalvataggio);

				var idenParent = $("#IDEN_CONTATTO_PRE").val();

				if(idenParent != "" && typeof idenParent != "undefined"){

					_JSON_CONTATTO.parent = {id: idenParent};

				}
				function completaSalvataggio(){
					logger.debug("Registra Inserimento - Valorizzato _JSON_CONTATTO tramite NS_ACC_RICOVERO_SALVATAGGI.valorizzaContatto");

					var completaInserimento = function () {
						_JSON_CONTATTO.deleted = false;
						_JSON_CONTATTO.codice = {
							assigningAuthority    : "FENIX",
							assigningAuthorityArea: "ADT",
							codice                : null,
							contatto              : null
						};

						// Con Sommo dispiacere devo dividere la funzione se il regime DH.
						// Se regime DH devo chiedere conferma dei dati di primo Accesso.
						// Non posso inserirla dentro una funzione comune perche' $.dialog non ? sincrono come un confirm
						if(_JSON_CONTATTO.isDayHospital() && !_JSON_CONTATTO.isODS()) {
							NS_LOADING.hideLoading();
							home.DIALOG.si_no({
								title: "Registrazione ricovero in regime Day Hospital",
								msg  : "Si confermano i dati di chiusura del primo accesso?",
								cbkNo: function () {
								NS_LOADING.hideLoading();
									return;
								},
								cbkSi: function () {

									var p = {
										"contatto"  : _JSON_CONTATTO,
										"notifica"  : {
											"show"        : "S",
											"timeout"     : 3,
											"message"     : "Accettazione Ricovero Avvenuta con Successo",
											"errorMessage": "Errore Durante Accettazione Ricovero"
										},
										"hl7Event"  : "A01",
										"cbkSuccess": function () {
										}
									};

									p.cbkSuccess = function () {

										_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

										NS_ACC_RICOVERO_SALVATAGGI.setStatoCartellaIncompleta();
										NS_ACC_RICOVERO_SALVATAGGI.mostraWKRicoverati();

										$("#txtNumNosologico").val(_JSON_CONTATTO.codice.codice);

										if(NS_ACC_RICOVERO.lista) {
											NS_ACC_RICOVERO_SALVATAGGI.modificaPosizioneListaAttesa();
										}

									NS_LOADING.hideLoading();

										home.DIALOG.si_no({
											title: "Stampa Verbale di Ricovero",
											msg  : "Si desidera stampare il verbale di ricovero?",
											cbkNo: function () {
												NS_ACC_RICOVERO_SALVATAGGI.apriPIC();
											},
											cbkSi: function () {
												home.HOME_ADT.printVerbaleRicovero(_JSON_CONTATTO.id);
												NS_ACC_RICOVERO_SALVATAGGI.apriPIC();
											}
										});

									};

									NS_CONTATTO_METHODS.admitVisitNotification(p);
								}
							});
						}
						else {
							var p = {
								"contatto"  : _JSON_CONTATTO,
								"hl7Event"  : "A01",
								"notifica"  : {
									"show"        : "S",
									"timeout"     : 3,
									"message"     : "Accettazione Ricovero Avvenuta con Successo",
									"errorMessage": "Errore Durante Accettazione Ricovero"
								},
								"cbkSuccess": function () {
								}
							};

							p.cbkSuccess = function () {

								_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

								NS_ACC_RICOVERO_SALVATAGGI.setStatoCartellaIncompleta();
								NS_ACC_RICOVERO_SALVATAGGI.mostraWKRicoverati();

								$("#txtNumNosologico").val(_JSON_CONTATTO.codice.codice);

								if(NS_ACC_RICOVERO.lista) {
									NS_ACC_RICOVERO_SALVATAGGI.modificaPosizioneListaAttesa();
								}

							NS_LOADING.hideLoading();

								home.DIALOG.si_no({
									title: "Stampa Verbale di Ricovero",
									msg  : "Si desidera stampare il verbale di ricovero?",
									cbkNo: function () {
										NS_ACC_RICOVERO_SALVATAGGI.apriPIC();
									},
									cbkSi: function () {
										home.HOME_ADT.printVerbaleRicovero(_JSON_CONTATTO.id);
										NS_ACC_RICOVERO_SALVATAGGI.apriPIC();
									}
								});
							};

							NS_CONTATTO_METHODS.admitVisitNotification(p);
						}
					};

					// CONTROLLO REPARTI CHE PERMETTONO LA MODIFICA NELLE 24 ORE
					var REPARTI_MODIFICA_24H = JSON.parse(home.baseGlobal.REPARTI_MODIFICA_24H);
					var iden_cdc = $("#cmbRepartoRico option:selected").attr("data-iden_cdc");
					var index, valorized = 0;

					for(index = 0; index < REPARTI_MODIFICA_24H.length; ++index) {
						if(iden_cdc == REPARTI_MODIFICA_24H[index]) {
							valorized = 1;
						}
					}

					var _today = moment();
					var datainserita = $('#txtDataRico').val();
					var orainserita = $('#txtOraRico').val();
					var _datainserimento = datainserita + orainserita;
					var _dataInizio = moment(_datainserimento, "DD/MM/YYYYHH:mm");
					var ore_trascorse = _today.diff(_dataInizio, 'hours')

					if(valorized == 1 && ore_trascorse < 0) {
						ore_trascorse = NS_ACC_RICOVERO_CHECK.differenza(); //calcolo il n di giorni (festivi sabato e domenica) e rimuovo dal totale *24
						ore_trascorse = ore_trascorse + 24;
					}

					if(ore_trascorse < 0) {
						if(valorized == 0)
							return home.NOTIFICA.error({
								message: "Impossibile Inserire Ricovero, Data o Ora di Ricovero Superiore A Data Odierna, Modificare Data o Ora e Riprovare",
								timeout: 10,
								title  : "Error"
							});
						else
							return home.NOTIFICA.error({
								message: "Impossibile Inserire Ricovero, La Data o l Ora di Ricovero e Superiore Alle 24 Ore Lavorative dalla Data Odierna, Modificare Data o Ora e Riprovare",
								timeout: 10,
								title  : "Error"
							});
					}

					var changedSTP = NS_ACC_RICOVERO_CHECK.codiceSTPChanged();
					var changedENI = NS_ACC_RICOVERO_CHECK.codiceENIChanged();

					if(NS_ACC_RICOVERO_CHECK.stopRegistra) {
						return logger.debug("Registra Inserimento - la registrazione ? stata impedita a seguito della errata valorizzazione dei codici STP ed ENI");
					}

					if(changedSTP && changedENI) {
						logger.debug("Registra Inserimento - Valorizzazione codice STP e ENI");
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceENI();
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceSTP(completaInserimento);
					}
					else if(changedSTP && !changedENI) {
						logger.debug("Registra Inserimento - Valorizzazione codice STP");
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceSTP(completaInserimento);
					}
					else if(!changedSTP && changedENI) {
						logger.debug("Registra Inserimento - Valorizzazione codice ENI");
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceENI(completaInserimento);
					}
					else {
						logger.debug("Registra Inserimento - Nessuna modifica dei Codici STP ed ENI");
						completaInserimento();
					}
				}
			}catch (e){
				NS_LOADING.hideLoading();

				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
				}
			}

		},

		/**
		 * Funzione per il salvataggo del contatto aperto in modifica.
		 * Prima del salvataggio valuta il salvataggio del codice ENI e STP.
		 *
		 * @author alessandro.arrighi
		 */

		registraModifica : function(){

			logger.debug("Registra Modifica - Init");
			try {

				NS_ACC_RICOVERO_CHECK.stopRegistra = false;

				if (!NS_FENIX_SCHEDA.validateFields()) {
					NS_LOADING.hideLoading();
					return;
				}

				if (!NS_ACC_RICOVERO_CHECK.checkPresalvataggio()) {
					NS_LOADING.hideLoading();
					return;
				}

				function manipolaContatto (){

					_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_JSON_CONTATTO.id,{"cbkSuccess": function(){

						_JSON_CONTATTO = NS_ACC_RICOVERO_SALVATAGGI.valorizzaContatto(NS_CONTATTO_METHODS.contatto);
						_JSON_CONTATTO.uteModifica.id = home.baseUser.IDEN_PER;

						completaModifica();
					}});
				};

				function completaModifica()
				{

					function completaSalvataggio () {
						//quando salvo la modifica del ricovero aggiorno anche i metadati dell'anagrafica
						_JSON_CONTATTO = NS_ACC_RICOVERO_ANAGRAFICA.setMetadatiAnagrafica(_JSON_CONTATTO);

						var dataFineAccesso = $("#h-txtDataFineAccesso").val()+ $("#txtOraFineAccesso").val();
						try {
							if(_JSON_CONTATTO.isDayHospital() && dataFineAccesso != '') {
								_JSON_CONTATTO.getAccessoAssistenziale(0).setDataFine(dataFineAccesso);
							}
						}catch(e){
                            logger.error(e.code  + ' - '+ e.message );
                            if(typeof e.code != 'undefined' ){
                                home.NOTIFICA.error({ title: "Attenzione", message: "Errore nella valorizazione della data di fine del primo accesso", timeout : 0});
                            }
                            throw e;
						}

						var p = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Modifica Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Modifica Ricovero"}, "cbkSuccess" : function(){}};

						NS_CONTATTO_METHODS.updatePatientInformation(p);
					}

					if (_JSON_CONTATTO.stato.codice=='ADMITTED'){  // se ricovero aperto : aggiorno anagrafica ANAG

						NS_ACC_RICOVERO_ANAGRAFICA.salvaAnagrafica(completaSalvataggio);
					}else{

						completaSalvataggio();
					}

				};

				var changedSTP = NS_ACC_RICOVERO_CHECK.codiceSTPChanged();
				var changedENI = NS_ACC_RICOVERO_CHECK.codiceENIChanged();

				if (NS_ACC_RICOVERO_CHECK.stopRegistra)
				{
					return logger.debug("Registra Inserimento - la registrazione e' stata impedita a seguito della errata valorizzazione dei codici STP ed ENI");
				}

				if (changedSTP && changedENI)
				{
					logger.debug("Registra Modifica - Valorizzazione codice STP e ENI");
					NS_ACC_RICOVERO_CHECK.checkModificaFromUtente(function(){
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceENI();
						NS_ACC_RICOVERO_SALVATAGGI.registraCodiceSTP(manipolaContatto);
					});
				}
				else if (changedSTP && !changedENI)
				{
					logger.debug("Registra Modifica - Valorizzazione codice STP");
					NS_ACC_RICOVERO_CHECK.checkModificaFromUtente(function(){ NS_ACC_RICOVERO_SALVATAGGI.registraCodiceSTP(manipolaContatto); });
				}
				else if (!changedSTP && changedENI)
				{
					logger.debug("Registra Modifica - Valorizzazione codice ENI");
					NS_ACC_RICOVERO_CHECK.checkModificaFromUtente(function(){ NS_ACC_RICOVERO_SALVATAGGI.registraCodiceENI(manipolaContatto); });
				}
				else
				{
					logger.debug("Registra Inserimento - Nessuna modifica dei Codici STP ed ENI");
					NS_ACC_RICOVERO_CHECK.checkModificaFromUtente(manipolaContatto);
				}
			}catch(e){
				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
				}
			}

		},

		registraDaPrericovero : function(){
			try {

				var idenContattoPre = _IDEN_CONTATTO;
				var idenContattoPreFromUrl = $("#IDEN_CONTATTO_PRE").val();
				if(typeof idenContattoPreFromUrl != "undefined" && idenContattoPreFromUrl != ""){
					idenContattoPre = idenContattoPreFromUrl;
				}

				var _JSON_A03 = NS_CONTATTO_METHODS.getContattoById(idenContattoPre);
				var _JSON_A01 = NS_CONTATTO_METHODS.getContattoEmpty();

				if (!NS_FENIX_SCHEDA.validateFields()) {
					return;
				}

				_JSON_A03.uteDimissione.id = home.baseUser.IDEN_PER;
				_JSON_A03.setDataFine( moment().format('YYYYMMDD') + moment().format('HH:mm'));
				_JSON_A03.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null ,codice : '9P'};
				_JSON_A03.contattiGiuridici[_JSON_A03.contattiGiuridici.length-1].uteModifica.id = home.baseUser.IDEN_PER;
				_JSON_A03.contattiAssistenziali[_JSON_A03.contattiAssistenziali.length-1].uteModifica.id = home.baseUser.IDEN_PER;


				_JSON_A01 = NS_ACC_RICOVERO_SALVATAGGI.valorizzaContatto(_JSON_A01);
				_JSON_A01 = NS_ACC_RICOVERO_ANAGRAFICA.setMetadatiAnagrafica(_JSON_A01);
				_JSON_A01.deleted = false;
				_JSON_A01.codice = {assigningAuthority : "FENIX", assigningAuthorityArea : "ADT", codice : null, contatto : null};
				_JSON_A01.parent = _JSON_A03;
				/*
				console.log(_JSON_A03);
				console.log(_JSON_A01);*/
				// Parametri Invocazione A03 Pre-ricovero
				var pA03 = {"contatto" : _JSON_A03, "updateBefore" : true, "hl7Event" : "A03", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Chiusura Pre-ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante la Chiusura del Pre-ricovero"}, "cbkSuccess" : function(){}};

				// Parametri Invocazione A01 Ricovero
				var pA01 = {"contatto" : _JSON_A01, "hl7Event" : "A01", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Accettazione Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Accettazione Ricovero"}, "cbkSuccess" : function(){}};

				pA01.cbkSuccess = function(){

					_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;

					NS_ACC_RICOVERO_SALVATAGGI.setStatoCartellaIncompleta(_JSON_CONTATTO.id);
					NS_ACC_RICOVERO_SALVATAGGI.mostraWKRicoverati();
					NS_CONTATTO_METHODS.dischargeVisit(pA03);

					$("#txtNumNosologico").val(_JSON_CONTATTO.codice.codice);

					home.DIALOG.si_no({
						title: "Stampa Verbale di Ricovero",
						msg  : "Si desidera stampare il verbale di ricovero?",
						cbkNo: function () { NS_ACC_RICOVERO_SALVATAGGI.apriPIC(); },
						cbkSi: function () {
							home.HOME_ADT.printVerbaleRicovero(_JSON_CONTATTO.id);
							NS_ACC_RICOVERO_SALVATAGGI.apriPIC();
						}
					});
				};
				// Invocazione A01 Ricovero
				NS_CONTATTO_METHODS.admitVisitNotification(pA01);
			}catch (e) {
				logger.error(e.code  + ' - '+ e.message );
				if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
				}
			}


		},

		registraCodiceSTP : function(cbk){

			var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});
            var scadenza = $("#txtScadCodSTP").val() !== '' ? moment($("#txtScadCodSTP").val(),'DD/MM/YYYY').format('YYYYMMDD'): "";

            db.call_procedure(
                {
                    id: 'ANAGRAFICA_FROM_FENIX.gest_COD_EST_ANAG',
                    parameter:
                    {
                        'idenAnag' :  {v : _IDEN_ANAG, t : "N"},
                        'v1':{ v:$("#txtCodSTP").val(),t:"V"},
                        'v2': {v:scadenza, t:"V"},
                        'vType': {v:'STP',t:"V"}
                    },
                    success: function(data){

                        logger.debug('Registra STP - ANAGRAFICA_FROM_FENIX.gest_COD_EST_ANAG Response -> ' + JSON.stringify(data));

                        if (typeof cbk === "function")
                        {
                        	logger.debug("Registra STP - Eseguo Callback - " + cbk);
                        	cbk();
                        }
                    },
                    error: function(data){
                        logger.error('Non inserito cod_stp' + JSON.stringify(data));
                    }

                });
		},

		registraCodiceENI : function(cbk){

            var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});
            var scadenza = $("#txtScadCodENI").val() !== '' ? moment($("#txtScadCodENI").val(),'DD/MM/YYYY').format('YYYYMMDD'): "";

            db.call_procedure(
                {
                    id: 'ANAGRAFICA_FROM_FENIX.gest_COD_EST_ANAG',
                    parameter:
                    {
                        'idenAnag' :  {v : _IDEN_ANAG, t : "N"},
                        'v1':{ v:$("#txtCodENI").val(),t:"V"},
                        'v2': {v:scadenza, t:"V"},
                        'vType': {v:'ENI',t:"V"}
                    },
                    success: function(data){

                    	logger.debug("Registra ENI - ANAGRAFICA_FROM_FENIX.gest_COD_EST_ANAG Response -> " + JSON.stringify(data));

                        if (typeof cbk === "function")
                        {
                        	logger.debug("Registra ENI - Eseguo Callback - " + cbk);
                        	cbk();
                        }
                    },
                    error: function(data){
                        logger.error('Non inserito COD_ENI' + JSON.stringify(data));
                    }

                });
		},

		setStatoCartellaIncompleta : function(idenContatto){

			logger.debug("Set Stato Cartella INCOMPLETA - Init ");

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var parametri = {
            		pStato : {v : '00', t : "V"},
            		pIdenContatto : {v : typeof idenContatto == "undefined" ? _JSON_CONTATTO.id : idenContatto, t : "N"},
            		pIdenPer : {v : home.baseUser.IDEN_PER, t : "N"},
            		pArchivio : {v : $("#cmbRepartoRico option:selected").attr('data-iden_cdc'), t : "N"},
            		pData : {v :$("#txtDataRico").val()+ " " +$("#txtOraRico").val(), t : "V"},
    				P_RESULT : {t : "V", d : "O"}
    		};

            logger.debug("Set Stato Cartella INCOMPLETA - parametri -> " + JSON.stringify(parametri));

    		var xhr = db.call_procedure(
    		{
    			id: "ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella",
    			parameter : parametri
    		});

    		xhr.done(function (data, textStatus, jqXHR)
    		{
    			if (data['P_RESULT'] == 'OK')
    			{
    				logger.info("Set Stato Cartella INCOMPLETA - Set Stato Cartella Avvenuto con SUCCESSO");
		            home.NOTIFICA.success({message: 'Stato cartella incompleta', timeout: 3, title: 'Success'});
		        }
    			else
    			{
    				logger.error("Set Stato Cartella INCOMPLETA - ERRORE PROCEDURA Durante Set Stato Cartella");
		            home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
		        }

    		});

    		xhr.fail(function (response) {
    			logger.error("Set Stato Cartella INCOMPLETA - ERRORE XHR Durante Set Stato Cartella");
	            home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
    		});

		},

		/**
		 * In Accettazione da Posizione in Lista di Attesa cambio lo stato della posizione stessa.
		 * La posizione in lista passa dallo stato <b>INSERITO</b> a <b>SFOCIATO_IN_RICOVERO</b>
		 *
		 * @author alessandro.arrighi
		 */

		modificaPosizioneListaAttesa : function(){

			logger.debug("Modifica Posizione in Lista di Attesa - Init ");

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var parametri = {
            		P_IDEN : {v : $('#IDEN_LISTA').val(), t : "N"},
            		P_STATO : {v : _JSON_CONTATTO.regime.codice === "3" ? "ESITO_PRERICOVERO" : "ESITO_RICOVERO", t : "V"},
            		P_IDEN_CONTATTO : {v : _JSON_CONTATTO.id, t : "N"},
            		P_UTENTE_MODIFICA : {v : home.baseUser.IDEN_PER, t : "N"}
    		};

            logger.debug("Modifica Posizione in Lista di Attesa per Accettazione RICOVERO - parametri -> " + JSON.stringify(parametri));

    		var xhr = db.call_procedure(
    		{
    			id: "FX$PCK_LISTA_ATTESA_PZ.MODIFICA",
    			parameter : parametri
    		});

    		xhr.done(function (data, textStatus, jqXHR)
    		{
				logger.info("Modifica Posizione in Lista di Attesa per Accettazione RICOVERO SUCCESS - Rimozione PZ da Lista Attesa Avvenuto con Successo");
				home.NOTIFICA.success({message: 'Rimozione Paziente da Lista di Attesa Avvenuto con Successo', timeout: 3, title: 'Success'});

    		});

    		xhr.fail(function (response) {
    			logger.error("Rimozione PZ Lista Attesa per RICOVERO ERROR - NS_ACC_RICOVERO.Registra.registra - Rimozione PZ da lista di Attesa in ERRORE!" + JSON.stringify(response));
    			home.NOTIFICA.error({message: "Errore durante rimozione Paziente da Lista di Attesa", timeout: 10, title: "Error"});
    			NS_FENIX_SCHEDA.chiudi({'refresh' : true});
    		});

		},

		apriPIC : function(){

			logger.debug("Apri PIC - Init ");

			var paramsPic =
			{
				tipoConsenso :'INSERIMENTO_CONSENSO_EVENTO',
                anagrafica : _JSON_ANAGRAFICA.id,
                cognome : _JSON_ANAGRAFICA.cognome,
                nome:_JSON_ANAGRAFICA.nome,
                sesso : _JSON_ANAGRAFICA.sesso,
                codice_fiscale : _JSON_ANAGRAFICA.codiceFiscale,
                comuneNascita:_JSON_ANAGRAFICA.comuneNascita.codice,
                codice : _JSON_CONTATTO.id,
                callback : NS_FENIX_SCHEDA.chiudi,
                paramsCallback : {'refresh':true}
			};

			paramsPic.action = _STATO_PAGINA == 'I' ? 'INSERISCI' : 'VISUALIZZA';
            paramsPic.data_nascita = moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('YYYYMMDD') == 'undefined' ? '' : moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('YYYYMMDD');

            logger.debug("Apri PIC - paramsPIC -> " + JSON.stringify(paramsPic));

            home.NS_PRIVACY.openPick(paramsPic);
		},

		mostraWKRicoverati : function(){
			var obj = top.$("#iContent").contents().find("#li-filtroRicoverati");
			obj.trigger('click');
		},

		/**
		 * Completa la valorizzazione dell 'oggetto _JSON_CONTATTO.
		 * La valorizzazione iniziale, standard, avviene al ready della pagina.
		 *
		 * @author alessandro.arrighi
		 */
		valorizzaContatto : function(_json){
			try {

				var dataInizio = $("#h-txtDataRico").val() + $("#txtOraRico").val();
				_json.anagrafica.id = _IDEN_ANAG;
				_json.setDataInizio(dataInizio);
				_json.stato.codice = _json.stato.codice==null ? 'ADMITTED' : _json.stato.codice;

				if (_STATO_PAGINA === "I") {
					_json.uteInserimento.id = home.baseUser.IDEN_PER;
				}

				var regime =$("#cmbRegime").find("option:selected").val();
				var tipo = $("#cmbTipoRico").find("option:selected").val()
				_json.uteAccettazione.id = $("#h-txtMedicoAcc").val();
				_json.setRegime(regime);
				_json.setTipo(tipo);
				_json.setUrgenza($("input[name='cmbLivelloUrg']").val());
				_json.setMotivo($("#cmbMotivoRico").find("option:selected").val());
				_json.mapMetadatiString['NEONATO'] = NS_ACC_RICOVERO.flgNeonato ? 'S' : 'N';
				_json.mapMetadatiString['PESO_NEONATO'] = NS_ACC_RICOVERO.flgNeonato ? $("#txtPesoNascita").val() : "";
				_json.mapMetadatiString['DIAGNOSI_ACCETTAZIONE'] = $("#txtDiagnosiAcc").val();
				_json.mapMetadatiString['DATA_PRENOTAZIONE'] = $("#h-txtDataPren").val() !== "" && $("#h-txtDataPren").val() != null ? $("#h-txtDataPren").val() + '00:00' : null;
				_json.mapMetadatiString['SDO_COMPLETA'] = _json.mapMetadatiString['SDO_COMPLETA']==null ? 'N' : _json.mapMetadatiString['SDO_COMPLETA'];
				_json.mapMetadatiString['NOTE_BRACCIALETTO_RICOVERO'] =  $("#taNoteBraccialettoRicovero").val();

				var $provenienza =  $("#cmbProvenienza");
				var provenienza = $provenienza.find("option:selected").val() == null ? null : $provenienza.find("option:selected").val();

				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_PROVENIENZA'] = {codice : null, id : provenienza};
				_json.mapMetadatiCodifiche['LATERALITA'] = {codice : null, id : $("#h-radLateralita").val()};
				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_NEONATO'] = {id : $("#cmbTipoNeonato").find("option:selected").val() ,codice : null};
				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'] = {id : $("#cmbOnere").find("option:selected").val(), codice : null};
				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_SUB_ONERE'] = {id : $("#cmbSubOnere").find("option:selected").val(), codice : null};
				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_MEDICO_PRESC'] = {id : $("#cmbTipoMedicoPresc").find("option:selected").val(), codice : null};
				_json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TICKET'] = {id : $("#cmbTicket").find("option:selected").val() ,codice : null};
				_json.mapMetadatiCodifiche['TRAUMATISMI'] = {id : $("#cmbTrauma").val() ,codice : null};
				_json.mapMetadatiCodifiche['CATEGORIA_CAUSA_ESTERNA'] = {id : $("#h-txtCategoriaCausaEsterna").val() ,codice : null};
				_json.mapMetadatiCodifiche['CAUSA_ESTERNA'] = {id : $("#cmbCausaEsterna").find("option:selected").val() ,codice : null};

			   // _json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO']= {codice:null,id: $("#cmbTitoloStudio option:selected").val() == null ? null : $("#cmbTitoloStudio option:selected").val()};

				var $htxtCartellaMadre =  $("#h-txtMadreCartella");
				if (NS_ACC_RICOVERO.flgNeonato && $htxtCartellaMadre.val() != null && $htxtCartellaMadre.val() !== "")
				{
					_json.mapMetadatiString['MADRE_CARTELLA'] = $("#txtMadreCartella").attr("data-c-codice");
					_json.mapMetadatiCodifiche['CONTATTO_TIPO_RELAZIONE_PARENT'] = {id : null ,codice : 'neonato.madre'};
					_json.parent = {id : $htxtCartellaMadre.val()};
				}

				_json.contattiGiuridici[0].provenienza = {id : $("#cmbRepartoRico").find("option:selected").val(), codice : null, idCentroDiCosto : null};
				_json.contattiGiuridici[0].regime.codice = regime ;
				_json.contattiGiuridici[0].tipo.codice = tipo;
				_json.contattiGiuridici[0].dataFine =_json.contattiGiuridici[0].dataFine==null ? null : _json.contattiGiuridici[0].dataFine;
				_json.contattiGiuridici[0].stato.codice = _json.contattiGiuridici[0].stato.codice==null ? 'ADMITTED' : _json.contattiGiuridici[0].stato.codice;

				_json.getAccessoGiuridico(0).setDataInizio(dataInizio);

				if (_STATO_PAGINA === "I") {
					_json.contattiGiuridici[0].uteInserimento.id = home.baseUser.IDEN_PER;
				} else if (_STATO_PAGINA === "E") {
					_json.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;
				}

				_json.contattiAssistenziali[0].provenienza = {id : $("#cmbRepartoAss").find("option:selected").val(), codice : null, idCentroDiCosto : null};
				_json.contattiAssistenziali[0].dataFine = _json.contattiAssistenziali[0].dataFine==null ? null : _json.contattiAssistenziali[0].dataFine;
				_json.contattiAssistenziali[0].stato.codice = _json.contattiAssistenziali[0].stato.codice==null ? 'ADMITTED' : _json.contattiAssistenziali[0].stato.codice;

				_json.getAccessoAssistenziale(0).setDataInizio(dataInizio);
				_json.contattiAssistenziali[0].accesso = _json.isDayHospital();

				if (_STATO_PAGINA === "I") {
					_json.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;
				} else if (_STATO_PAGINA === "E") {
					_json.contattiAssistenziali[0].uteModifica.id = home.baseUser.IDEN_PER;
				}
				var htxtDataFineAccesso = $("#h-txtDataFineAccesso").val();
				var txtOraFineAccesso = $("#txtOraFineAccesso").val();
				if (htxtDataFineAccesso !== "" && txtOraFineAccesso !== ""){
					 _json.getAccessoAssistenziale(0).setDataFine(htxtDataFineAccesso + txtOraFineAccesso);
				}else if(_json.isDayHospital() && _json.isChirurgico()){
					_json.getAccessoAssistenziale(0).dataFine = null;
				}

				if ($("#h-txtDiagnosiICD9").val() != "") {
					_json.codiciICD  = NS_ACC_RICOVERO.Diagnosi.getDiagnosi();
				}

				_json = NS_ACC_RICOVERO_ANAGRAFICA.setMetadatiAnagrafica(_json);
				return _json;
			}catch (e) {
				logger.error(e.code  + ' - '+ e.message );
				/*if(typeof e.code != 'undefined' ){
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
				}*/
				throw e;

			}

		}
};