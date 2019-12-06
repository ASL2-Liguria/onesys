
var NS_OFFLINE_UPDATES = {
		
		pageDB: $.NS_DB.getTool({
    		_logger: NS_CONSOLEJS.loggers['NS_OFFLINE']
		}),

		temp: {
		},
		
		/*In giorni: */
		TABLE_EXPIRATION: {
			ACCERTAMENTI: 11 + Math.random(),
			ASSISTITI: 1 + Math.random(),
			ESENZIONI: 37 + Math.random(),
			FARMACI: 3 + Math.random(),
			PERSONALE: 0,
			POSOLOGIE: 5,
			PROBLEMI: 311 + Math.random(),
			PROFILI: 37
		},
		
		TABLE_BULK: {
			ACCERTAMENTI: 100, /*C'e' un sottocursore, quindi sono 100 cursori aperti alla volta...*/
			ASSISTITI: 3, /*Ci sono 5 sottocursori, quindi sono 15 cursori aperti alla volta...*/
			ESENZIONI: 1000,
			FARMACI: 1000,
			PERSONALE: 100,
			POSOLOGIE: 1000,
			PROBLEMI: 1000,
			PROFILI: 10
		},
		
		getUpdateDate: function(tabella) {
			var data_output;
			var data = localStorage["fenixMMG_UPDATES_" + tabella + "_DATE"];
			if (typeof data == "undefined") {
				data_output = new Date(0);
				NS_OFFLINE_UPDATES.setUpdateDate(tabella,data_output);
			} else {
				data_output = new Date(data);
			}
			return data_output;
		},
		
		getUpdateDateYMD: function(tabella) {
			var data = NS_OFFLINE_UPDATES.getUpdateDate(tabella);
			return moment(data).subtract("minutes", 10).format("YYYYMMDDHHmm");
		},
		
		setUpdateDate: function(tabella, data) {
			NS_OFFLINE.setLocalStorage("fenixMMG_UPDATES_" + tabella + "_DATE", data);
		},
		
		updatedDaysAgo: function (tabella) {
			return (new Date() - NS_OFFLINE_UPDATES.getUpdateDate(tabella))/(1000 * 60 * 60 * 24);
		},
		
		needsUpdate: function(tabella, tabella_sottoinsieme) {
			return NS_OFFLINE_UPDATES.updatedDaysAgo(tabella_sottoinsieme) >= NS_OFFLINE_UPDATES.TABLE_EXPIRATION[tabella];
		},
		
		getUpdateProgress: function(tabella) {
			if (typeof localStorage["fenixMMG_UPDATES_" + tabella + "_PROGRESS"] == 'undefined') {
				NS_OFFLINE.setLocalStorage("fenixMMG_UPDATES_" + tabella + "_PROGRESS", 1);
			}
			return parseInt(localStorage["fenixMMG_UPDATES_" + tabella + "_PROGRESS"]);
		},
		
		incrementUpdateProgress: function(tabella, incremento) {
			NS_OFFLINE.setLocalStorage("fenixMMG_UPDATES_" + tabella + "_PROGRESS", NS_OFFLINE_UPDATES.getUpdateProgress(tabella) + incremento);
		},
		
		resetUpdateProgress: function(tabella) {
			NS_OFFLINE.deleteLocalStorage("fenixMMG_UPDATES_" + tabella + "_PROGRESS");
		},
		
		resetUpdateDate: function(tabella) {
			NS_OFFLINE.deleteLocalStorage("fenixMMG_UPDATES_" + tabella + "_DATE");
		},
		
		resetTable: function(tabella) {
			NS_OFFLINE_UPDATES.resetUpdateDate(tabella);
			NS_OFFLINE_UPDATES.resetUpdateProgress(tabella);
		},
		
		/*SOLO PER DEBUG, risultato dell'ultima query da NS_DB*/
		TABLE_BUFFER: {
			ACCERTAMENTI: null,
			ASSISTITI: null,
			ESENZIONI: null,
			FARMACI: null,
			PERSONALE: null,
			POSOLOGIE: null,
			PROBLEMI: null,
			PROFILI: null
		},
		
		sync_param_default: {
			forza: 0,
			sottoinsieme: "",
			handler: {
				start:function(parametri){
					NS_OFFLINE_UPDATES.TABLE_SYNC.updateProgress(parametri.tabella_sottoinsieme, "Importazione in corso...", false);
				},
				done:function(parametri){
					/*Le tabelle sincronizzate forzate non le notifico cosi' non disturbo*/
					if( parametri.importati > 0 && LIB.isValid(NS_OFFLINE.TABLE_DA_SINCRONIZZARE[parametri.tabella])) {
						home.NOTIFICA.info( { 'title' : 'Informazioni', 'message' : 'Offline: importati '+ parametri.importati +' '+ parametri.tabella } );
					}
					NS_OFFLINE_UPDATES.TABLE_SYNC.updateProgress(parametri.tabella_sottoinsieme, "Importazione completata (" + parametri.importati + " elementi nuovi)", true);
					if (typeof parametri.semaforo != "undefined") {
						parametri.semaforo.done(function(){
							console.log(parametri.tabella_sottoinsieme + " resolved");
						});
								parametri.semaforo.resolve();
						}
				},
				fail:function(parametri){
					if (applicationCache.status != applicationCache.UPDATEREADY) {
						home.NOTIFICA.error( { 'title' : 'Errore', 'message' : 'Offline: errore importazione '+ parametri.tabella } );
					}
					console.error('Offline: errore importazione '+ parametri.tabella);
					NS_OFFLINE_UPDATES.TABLE_SYNC.updateProgress(parametri.tabella_sottoinsieme, "Errore importazione.", true);
					if (typeof parametri.semaforo != "undefined") {
						parametri.semaforo.resolve();
					}
				}
			},
			queryparam_custom: {}
		},
		
		setDefaultsForObject: function(p_default, p_nuovo) {
			if (typeof p_nuovo == "object") {
				var p_origine = $.extend(true, {}, p_default);
				for (var s in p_origine) {
					/*chi trasforma questo switch in qualcos'altro muore*/
					switch (typeof p_nuovo[s]) {
					case "undefined":
						p_nuovo[s]=p_origine[s];
						break;
					case "object":
						NS_OFFLINE_UPDATES.setDefaultsForObject(p_origine[s], p_nuovo[s]);
						break;
					default:
						/*ho gia' quello che mi serve*/
					}
				};
			}
		},
		
		overwriteAttributes: function(destinazione, sorgente) {
			for (var a in sorgente) {
				destinazione[a] = sorgente[a];
			}
		},
		
		getSyncParameter: function(tabella, param) {
			param.tabella = tabella;
			NS_OFFLINE_UPDATES.setDefaultsForObject(NS_OFFLINE_UPDATES.sync_param_default, param);
			param.tabella_sottoinsieme = tabella + param.sottoinsieme;
			var table_sync_param = $.extend(true, {}, NS_OFFLINE_UPDATES.TABLE_SYNC_PARAMS[tabella]);
			param.queryparam = table_sync_param.queryparam;
			param.campo_chiave = table_sync_param.campo_chiave;
			NS_OFFLINE_UPDATES.overwriteAttributes(param.queryparam.parameter, param.queryparam_custom);
			return param;
		},
		
		sync: function(tabella, param_in) {
			var param = NS_OFFLINE_UPDATES.getSyncParameter(tabella, param_in);
			
			var ifonline_params = {
				tabella: tabella,
				tabella_sottoinsieme: param.tabella_sottoinsieme,
				forza: param.forza
			};
			
			if (NS_OFFLINE_UPDATES.needsUpdate(tabella, param.tabella_sottoinsieme) || param.forza > 0) {
				NS_OFFLINE.doIfOnline(function() {
					
					NS_OFFLINE.log_sync("BEGIN", param);
					
					var wait_clear;

					if (param.forza == 2) {
						if (tabella == "ASSISTITI" && OFFLINE_LIB.sincronizzazioneGruppo()) {
							wait_clear = NS_OFFLINE.TABLE[tabella].index("IDEN_MED_BASE").each(function(record){
								record["delete"]();
							}, IDBKeyRange.only(param.sottoinsieme)
							);
						} else {
							wait_clear = NS_OFFLINE.TABLE[tabella].clear();
						}
						NS_OFFLINE_UPDATES.resetUpdateDate(param.tabella_sottoinsieme);
					} else {
						wait_clear = $.Deferred().resolve();
					}
					
					$.when(wait_clear).then(function() {
						NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_importati"] = 0;
						NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_errori"] = 0;
						NS_OFFLINE_UPDATES.TABLE_SYNC._sync(tabella, param);
					});
				}, function() {
					console.log("Non online, non aggiorno");
					if (param.forza > 0) {
						home.NOTIFICA.warning( { 'title' : "Impossibile aggiornare i dati", "message" : "Server non raggiungibile o utente non autenticato online"} );
					}
					if (typeof param.semaforo != "undefined") {
						param.semaforo.resolve();
					}
				}, ifonline_params);
			} else {
				if (typeof param.semaforo != "undefined") {
					param.semaforo.resolve();
				}
			}
		},
		
		TABLE_SYNC: {
			
			updateProgress: function(tabella_sottoinsieme, testo, end) {
				if (typeof ULTIMI_AGGIORNAMENTI != "undefined") {
					ULTIMI_AGGIORNAMENTI.updateProgress(tabella_sottoinsieme, testo, end);
				}
			},
			
			_sync: function(tabella, param) {

				param.handler.start(param);
				
				param.queryparam.parameter.lower={v: NS_OFFLINE_UPDATES.getUpdateProgress(param.tabella_sottoinsieme), t: 'N'};
				param.queryparam.parameter.upper = {v: param.queryparam.parameter.lower.v + NS_OFFLINE_UPDATES.TABLE_BULK[tabella]-1, t: 'N'};
				param.queryparam.parameter.data_aggiornamento = NS_OFFLINE_UPDATES.getUpdateDateYMD(param.tabella_sottoinsieme);
				var pDBselect = NS_OFFLINE_UPDATES.pageDB.select(param.queryparam);
				
				pDBselect.done(function(data, event) {
					if (typeof param.ritardo != "undefined" && param.ritardo > 0) {
						console.log("select differita di " + param.ritardo + " millisecondi");
						window.setTimeout(function() {
							NS_OFFLINE_UPDATES.TABLE_SYNC._done(tabella, param, data, event);
						}, param.ritardo);
					} else {
						NS_OFFLINE_UPDATES.TABLE_SYNC._done(tabella, param, data, event);
					}
				});
				
				pDBselect.fail(function(data, event) {
					NS_OFFLINE_UPDATES.TABLE_SYNC._fail(tabella, param, data, event);
				});
			},
			
			_done: function(tabella, param, data, event) {
				NS_OFFLINE_UPDATES.TABLE_BUFFER[param.tabella_sottoinsieme] = data.result;
				var importati = 0;
				var errori = 0;
				var deferred_puts = new Array();
				for (var i=0; i<data.result.length; i++) {
					var record = data.result[i];
					deferred_puts[i] = NS_OFFLINE.put(tabella, record, param.campo_chiave);
					deferred_puts[i].done(function(){
						importati++;
					});
					deferred_puts[i].fail(function(){
						errori++;
					});
				}
				$.when.apply($, deferred_puts).then(function() {
					if (importati==0) {
						/*presumo di aver finito*/
						console.log(param.tabella_sottoinsieme + ": " + NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_importati"] + " importati, " + NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_errori"] + " errori");
						
						NS_OFFLINE_UPDATES.setUpdateDate(param.tabella_sottoinsieme, new Date().toString());
						NS_OFFLINE_UPDATES.resetUpdateProgress(param.tabella_sottoinsieme);
						
						param.importati = NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_importati"];
						param.errori = NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_errori"];
						
						NS_OFFLINE.log_sync("END", param);
						
						param.handler.done(param);
					} else {
						NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_importati"] += importati;
						NS_OFFLINE_UPDATES.temp[param.tabella_sottoinsieme + "_errori"] += errori;
						NS_OFFLINE_UPDATES.incrementUpdateProgress(param.tabella_sottoinsieme, NS_OFFLINE_UPDATES.TABLE_BULK[param.tabella]);
						NS_OFFLINE_UPDATES.TABLE_SYNC._sync(tabella, param);
					}
				});
			},
			
			_fail: function(tabella, param, data, event) {
				param.handler.fail(param);
			}
		},
		
		TABLE_SYNC_PARAMS: {
			
			ACCERTAMENTI: {
				queryparam: {
						id:'OFFLINE.ACCERTAMENTI',
						datasource:'MMG_DATI',
						parameter: {
							importa_sinonimi: LIB.getParamUserGlobal("OFFLINE_IMPORTA_SIN_ACC", "N")
						}
				},
				campo_chiave: "CODICE_DESCRIZIONE"
			},
			
			ASSISTITI: {
				queryparam: {
							id:'OFFLINE.ASSISTITI',
							datasource:'MMG_DATI',
							parameter: {
								iden_med_base: home.baseUser.IDEN_PER /*e' il default, ma puo' essere sovrascritto*/
							}
				},
				campo_chiave: "IDEN_ANAG"
			},
			
			ESENZIONI: {
				queryparam: {
							id:'OFFLINE.ESENZIONI',
							datasource:'MMG_DATI',
							parameter: {
							}
				},
				campo_chiave: "CODICE"
			},
			
			FARMACI: {
				queryparam: {
							id:'OFFLINE.FARMACI',
							datasource:'MMG_DATI',
							parameter: {
							}

				},
				campo_chiave: "COD_FARMACO"
			},
			
			PERSONALE: {
				queryparam: {
							id:'OFFLINE.PERSONALE',
							datasource:'MMG_DATI',
							parameter: {
								iden_utente: home.baseUser.IDEN_PER
							}

				},
				campo_chiave: "IDEN_PER"
			},
			
			POSOLOGIE: {
				queryparam: {
							id:'OFFLINE.POSOLOGIE',
							datasource:'MMG_DATI',
							parameter: {
								iden_utente: home.baseUser.IDEN_PER
							}
				},
				campo_chiave: "IDEN"
			},
			
			PROBLEMI: {
				queryparam: {
							id:'OFFLINE.PROBLEMI',
							datasource:'MMG_DATI',
							parameter: {
							}
				},
				campo_chiave: "IDEN"
			},
			
			PROFILI: {
				queryparam: {
							id:'OFFLINE.PROFILI',
							datasource:'MMG_DATI',
							parameter: {
								iden_utente: home.baseUser.IDEN_PER
							}
				},
				campo_chiave: "IDEN"
			},
		}

};
