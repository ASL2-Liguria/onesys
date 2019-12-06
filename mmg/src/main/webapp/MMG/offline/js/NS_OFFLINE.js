$(function(){
	NS_OFFLINE.init();
});

var NS_OFFLINE = {
		
		/*
		 * semaforo per sapere se l'oggetto UTENTE e' stato inizializzato
		 */
		semaforo_utente: $.Deferred(),
		
		/*
		 * Semaforo utilizzabile da esterno per sapere se e' possibile operare su database locale (sincronizzazione terminata)
		 */
		semaforo: $.Deferred(),
		
		DB: null,
		
		doIfOnline: function(if_online, if_offline, params) {
			if (typeof if_online == 'undefined') {
				if_online = function(){console.log("dummy if_online");};
			}
			if (typeof if_offline == 'undefined') {
				if_offline = function(){console.log("dummy if_offline");};
			}
			if (typeof params == 'undefined') {
				params = {
				};
			};
				
			if(navigator.onLine) {
				/*Uso offline.appcache perche' so che NON e' in cache*/
				var a = $.ajax({
					type: "GET",
					url: 'MMG/offline/test_online',
					cache: false,
					timeout: 1000
				});
				a.done(function() {
					var b = NS_OFFLINE.block_sync(params);
					b.done(function(data){
						var messaggio = data.p_result;
						if (!LIB.isValid(messaggio)) {
							if_online();
						} else {
							if (messaggio != "SILENT") {
								home.NOTIFICA.warning({
									title: "Sincronizzazione non possibile",
									message: messaggio
								});
							}
						}
					});
					b.fail(if_offline);
				});
				a.fail(if_offline);
			} else {
				if_offline();
			}
		},
		
		syncTabella: function(tabella, param) {
			if (typeof NS_OFFLINE_UPDATES != "undefined") {
				NS_OFFLINE_UPDATES.sync(tabella, param);
			}
		},
		
		init: function() {
			
			/*Tabelle comuni*/
			NS_OFFLINE.DB = $.indexedDB(
				"fenixMMG",
				{
					"version": 2,
					"upgrade": function(transaction) {
					},
					"schema": {
						1: function(transaction) {
							
							var accertamenti = transaction.createObjectStore("ACCERTAMENTI");
							accertamenti.createIndex("CODICE_DESCRIZIONE");
							accertamenti.createIndex("CODICE");
							accertamenti.createIndex("DESCRIZIONE");
							accertamenti.createIndex("WORDS", {unique:false,multiEntry:true});

							/*Questo era nel database dell'utente ora abolito*/
							var assistiti = transaction.createObjectStore("ASSISTITI");
							assistiti.createIndex("IDEN_ANAG");
							assistiti.createIndex("COGN");
							assistiti.createIndex("COD_FISC");
							assistiti.createIndex("PAZIENTE");
							assistiti.createIndex("IDEN_MED_BASE");

							var esenzioni = transaction.createObjectStore("ESENZIONI");
							esenzioni.createIndex("CODICE");
							esenzioni.createIndex("COD_FARMA");
							esenzioni.createIndex("DESCRIZIONE");
							
							var farmaci = transaction.createObjectStore("FARMACI");
							farmaci.createIndex("COD_FARMACO");
							farmaci.createIndex("DESCRIZIONE");
							farmaci.createIndex("PRINCIPIO_ATTIVO");
							
							var parametri = transaction.createObjectStore("PARAMETRI");
							parametri.createIndex("NOME");
							
							var personale = transaction.createObjectStore("PERSONALE");
							personale.createIndex("IDEN_PER");
							
							/*Questo era nel database dell'utente ora abolito*/
							var posologie = transaction.createObjectStore("POSOLOGIE");
							posologie.createIndex("IDEN");
							posologie.createIndex("CODICE");
							posologie.createIndex("DESCRIZIONE");
							
							var problemi = transaction.createObjectStore("PROBLEMI");
							problemi.createIndex("IDEN");
							problemi.createIndex("DESCRIZIONE");
							problemi.createIndex("DESCR_ICD9");
							
							var eventi = transaction.createObjectStore("EVENTI", {
							    "autoIncrement" : true,
							    "keyPath" : "id"
							});
							eventi.createIndex("tipo");
						},
						
						2: function(transaction) {
							var profili = transaction.createObjectStore("PROFILI");
							profili.createIndex("DESCRIZIONE");
						}
					}
				}
			);
			NS_OFFLINE.DB.done(function(db, event) {
				NS_OFFLINE.sync_all();
			});
			NS_OFFLINE.DB.progress(function(db, event) {
			});
			NS_OFFLINE.DB.fail(function(error, event){
			    alert(event);
			});
		},
		
		semaforo_parametri: $.Deferred(),
		semaforo_personale: $.Deferred(),
		
		sync_all: function(forza) {
			
			if (typeof forza == "undefined") {
				forza = 0;
			}
			
			NS_OFFLINE.TABLE.PARAMETRI = NS_OFFLINE.DB.objectStore("PARAMETRI");
			$.when(NS_OFFLINE.TABLE.PARAMETRI).then(function() {
				var par = NS_OFFLINE.TABLE.PARAMETRI.each(function(item) {
					if (LIB.isValid(item.value.VALORE) && !LIB.isValid(localStorage[item.value.NOME])) {
						localStorage[item.value.NOME]=item.value.VALORE;
					}
				});
				par.done(function() {
					NS_OFFLINE.semaforo_parametri.resolve();
				});
			});

			/* semaforo_importazione viene risolto quando il personale e' stato importato e l'oggetto UTENTE e' stato inizializzato */
			NS_OFFLINE.TABLE.PERSONALE = NS_OFFLINE.DB.objectStore("PERSONALE");
			$.when(NS_OFFLINE.semaforo_parametri, NS_OFFLINE.TABLE.PERSONALE).then(function() {
				NS_OFFLINE.syncTabella("PERSONALE", {forza: forza, semaforo: NS_OFFLINE.semaforo_personale});
				$.when(NS_OFFLINE.semaforo_personale).then(function() {
					var g = NS_OFFLINE.TABLE.PERSONALE.index("IDEN_PER").get(home.baseUser.IDEN_PER);
					g.done(function(result) {
						UTENTE.init(result);
						NS_OFFLINE.semaforo_utente.resolve();
					});
				});
			});
			
			/*Prima elaboro gli eventi in coda e poi allineo le tabelle (se necessario)*/
			$.when(NS_OFFLINE.syncEventi(), NS_OFFLINE.semaforo_utente).then(function() {
				
				var semaforo_importazione = NS_OFFLINE.semaforo_utente;
				
				for (tabella in NS_OFFLINE.TABLE_DA_SINCRONIZZARE) {
					NS_OFFLINE.TABLE[tabella] = NS_OFFLINE.DB.objectStore(tabella);
					
					if (tabella == "ASSISTITI") {
						for (var i=0; i < UTENTE.IDEN_MEDICI_GRUPPO.length; i++) {
							var iden_utente = UTENTE.IDEN_MEDICI_GRUPPO[i];
							if (!OFFLINE_LIB.sincronizzazioneGruppo() && iden_utente != home.baseUser.IDEN_PER) {
								continue;
							}
							semaforo_importazione = NS_OFFLINE.sincronizzatore(tabella, {forza: forza, ritardo: 500, sottoinsieme: iden_utente, queryparam_custom:{iden_med_base: iden_utente}}, semaforo_importazione);
						}
					} else {
						semaforo_importazione = NS_OFFLINE.sincronizzatore(tabella, {forza: forza, ritardo: 250}, semaforo_importazione);
					}
				};
				$.when(semaforo_importazione).then(function(){
					NS_OFFLINE.semaforo.resolve();
				});
			});
		},
		
		sincronizzatore: function(tabella, param, semaforo_precedente) {
			var semaforo_corrente = $.Deferred();
			/*
			 * Ogni tabella aspetta che sia stata terminata l'importazione di quella precedente
			 */
			$.when(semaforo_precedente).then(function() {
				if (OFFLINE_LIB.sincronizzazioneAutomatica() || param.forza > 0) {
					$.when(NS_OFFLINE.TABLE[tabella]).then(function(){
						param.semaforo = semaforo_corrente;
						NS_OFFLINE.syncTabella(tabella, param);
					});
				} else {
					semaforo_corrente.resolve();
				}
			});
			return semaforo_corrente;
		},
		
		log_sync: function(operazione, param) {
			var stringa = "utente: " + home.baseUser.USERNAME + " pc: " + home.basePC.IP + " iden_per: " + home.baseUser.IDEN_PER + " operazione: " + operazione + " tabella: " + param.tabella_sottoinsieme + " forzatura: " + param.forza + " data_aggiornamento: " + moment(NS_OFFLINE_UPDATES.getUpdateDate(param.tabella_sottoinsieme)).format("DD/MM/YYYY HH:mm");
			if (operazione == "END") {
				stringa += " importati: " + param.importati + " errori: " + param.errori;
			}
			return NS_OFFLINE_UPDATES.pageDB.call_procedure({
				id: 'OFFLINE_LOG',
				parameter: {
					"c_messaggio": { v : stringa, t : 'C', d: 'I'}
				}
			}).done(function(){
				console.log("Log riuscito");
			}).fail(function(data){
				console.error(data);
			});
		},
		
		block_sync: function(params) {
			return NS_OFFLINE_UPDATES.pageDB.call_function({
				id: 'OFFLINE_BLOCK_SYNC',
				parameter: {
					v_username: {v: home.baseUser.USERNAME, t: 'V'},
					v_pc: {v: home.basePC.IP, t: 'V'},
					n_iden_per: {v: home.baseUser.IDEN_PER, t: 'N'},
					n_forzatura: {v: LIB.isValid(params.forza) ? params.forza : 0, t: 'N'},
					v_tabella: {v: LIB.isValid(params.tabella) ? params.tabella : "SCONOSCIUTA", t: 'V'},
					v_tabella_sottoinsieme: {v: LIB.isValid(params.tabella_sottoinsieme) ? params.tabella_sottoinsieme : "SCONOSCIUTA", t: 'V'}
				}
			});
		},

		destroy: function() {
			localStorage.clear();
			$.indexedDB("fenixMMG").deleteDatabase();
		},
		
		wipeCache: function() {
			NS_OFFLINE.doIfOnline(
				function() {
					console.log("delete applicationCache");
					delete applicationCache;
					try {
						console.log("apro OFFLINE_PRESCRIZIONE");
						NS_OFFLINE_TOP.apri("OFFLINE_PRESCRIZIONE");
					} catch (e) {
						console.error(e);
					}
					try {
						console.log("ricarico OFFLINE_PRESCRIZIONE");
						$("#iScheda-1").contentWindow.location.reload(true);
					} catch (e) {
						console.error(e);
					}
					$($("#iScheda-1").contentWindow).ready(function(){
						console.log("ricarico OFFLINE");
						document.location.reload(true);
					});
				},
				function() {
					home.NOTIFICA.warning({
						'title':	'Attenzione',
						'message':	traduzione.lblRicaricaPagineError
					});
				}
			);
		},
		
		/*Le promise per ogni dataStore*/
		TABLE: {
			ACCERTAMENTI: null,
			ASSISTITI: null,
			ESENZIONI: null,
			FARMACI: null,
			PARAMETRI: null,
			PERSONALE: null, /*Viene allineata prima delle altre:*/
			POSOLOGIE: null, /*,
			PROBLEMI: null*/
			PROFILI: null
		},
		
		put: function(tabella, record, campo_chiave) {
			if (typeof NS_OFFLINE.TABLE_PUT[tabella] != "undefined") {
				return NS_OFFLINE.TABLE_PUT[tabella](tabella, record, campo_chiave);
			} else {
				return NS_OFFLINE.TABLE_PUT._default(tabella, record, campo_chiave);
			}
		},
		
		TABLE_PUT: {
			_default: function(tabella, record, campo_chiave) {
				return NS_OFFLINE.TABLE[tabella].put(record, record[campo_chiave]);
			},
			
			ACCERTAMENTI: function(tabella, record, campo_chiave) {
				record.CODICE_DESCRIZIONE=record.CODICE+"_"+record.DESCRIZIONE;
				record.WORDS = record.DESCRIZIONE.split(" ");
				return NS_OFFLINE.TABLE_PUT._default(tabella, record, campo_chiave);
			}
		},
		
		/*Valorizzare per vedere il popup di notifica, null altrimenti*/
		TABLE_DA_SINCRONIZZARE: {
			ACCERTAMENTI: 1,
			ESENZIONI: 1,
			FARMACI: 1,
			POSOLOGIE: 1,
			ASSISTITI: 1,
			PROFILI: 1
		},
		
		EVENTI: null,
		
		getEVENTI: function() {
			if (NS_OFFLINE.EVENTI == null) {
				NS_OFFLINE.EVENTI = NS_OFFLINE.DB.objectStore("EVENTI");
			}
			return NS_OFFLINE.EVENTI;
		},
		
		inviaEvento: function(item) {
			var mydef = $.Deferred();
			NS_OFFLINE.semafori_eventi.push(mydef);
			var p_function = {
				id: 'OFFLINE_ELABORA_EVENTO',
				datasource:'MMG_DATI',
				parameter: {
					v_tipo: {v: item.value.tipo, t: 'V'},
					v_oggetto: {v: json2xml(item.value.OGGETTO), t: 'C'}
				}
			};
			var pDBfunction = NS_OFFLINE_UPDATES.pageDB.call_function(p_function);
			pDBfunction.done(function(data, textStatus, jqXHR){
				if (data.p_result.substring(0,2) == "OK") {
					console.log("Evento elaborato: " + item.key);
					var deletePromise = NS_OFFLINE.getEVENTI()["delete"](item.key);
					deletePromise.done(function(){
						console.log("Evento rimosso: " + item.key);
					});
					deletePromise.fail(function(){
						console.log("Errore rimuovendo l'evento: " + item.key);
					});
				} else {
					console.error("Errore elaborazione evento " + item.key);
					home.NOTIFICA.error({
						title: "OFFLINE: Errore durante l'invio di un elemento al server",
						message: data.p_result.substring(2),
						timeout: 0
					});
				}
				mydef.resolve();
			});
			pDBfunction.fail(function(data, textStatus, errorThrown){
				console.error(data);
				mydef.resolve();
			});
		},
		
		semafori_eventi: new Array(),
		
		semaforo_eventi: null,
		
		syncEventi: function(notifiche) {
			if (typeof notifiche == "undefined") {
				notifiche = false;
			}
			var params_ifonline = {
				tabella: "EVENTI"
			};
			
			NS_OFFLINE.semaforo_eventi = $.Deferred();
			
			NS_OFFLINE.doIfOnline(function() {
				NS_OFFLINE.semafori_eventi.length = 0;
				var promise = NS_OFFLINE.getEVENTI().each(function(item) {
					NS_OFFLINE.inviaEvento(item);
				});
				promise.done(function(result, event) {
					$.when.apply($, NS_OFFLINE.semafori_eventi).then(function() {
						NS_OFFLINE.semaforo_eventi.resolve();
						console.log("Elaborazione " + NS_OFFLINE.semafori_eventi.length + " eventi in coda completata.");
						if (NS_OFFLINE.semafori_eventi.length > 0) {
							NS_OFFLINE_UPDATES.setUpdateDate("EVENTI",new Date());
							if (notifiche) {
								home.NOTIFICA.info({
									'title' : 'Informazioni',
									'message' : 'Offline: inviati ' + NS_OFFLINE.semafori_eventi.length + ' elementi al server'
								});
							}
						} else {
							if (notifiche) {
								home.NOTIFICA.info({
									'title' : 'Informazioni',
									'message' : 'Nessun elemento da inviare'
								});
							}
						}
					});
				});
				promise.fail(function(result, event) {
					var messaggio = "Errore durante l'elaborazione degli eventi in coda: " + result;
					console.error(messaggio);
					if (notifiche) {
						home.NOTIFICA.error({
							'title' : 'Errore',
							'message' : messaggio
						});
					}
					NS_OFFLINE.semaforo_eventi.resolve();
				});
			}, function() {
				var messaggio = "Non online, impossibile elaborare gli eventi in coda.";
				console.log(messaggio);
				if (notifiche) {
					home.NOTIFICA.warning({
						'title' : 'Attenzione',
						'message' : messaggio
					});
				}
				NS_OFFLINE.semaforo_eventi.resolve();
			}, params_ifonline);
			
			return NS_OFFLINE.semaforo_eventi;
		},
		
		accodaEvento: function(tipo, oggetto, callback) {
			var promise = NS_OFFLINE.getEVENTI().add({tipo: tipo, OGGETTO: oggetto});
			promise.done(function(result, event) {
				/*bug imbarazzante di chrome: anche se il risultato e' success, e' possibile perdersi l'oggetto appena salvato*/
				var getPromise = NS_OFFLINE.getEVENTI().get(result);
				getPromise.done(function() {
					console.log("accodamento " + tipo + " riuscito");
					if (!OFFLINE_LIB.isAttivo()) {
						/*Se OFFLINE_ATTIVO e' N assumo che queste prescrizioni potrebbero perdersi, quindi provo a inviarle ora.*/
						console.log("Elaboro eventi in coda, OFFLINE_ATTIVO=N");
						$.when(NS_OFFLINE.syncEventi(true)).then(function() {
							if (typeof callback == "function") {
								callback(result);
							}
						});
					} else {
						/*Altrimenti auspico che gli eventi verranno inviati al prossimo login*/
						if (typeof callback == "function") {
							callback(result);
						}
					}
				});
				getPromise.fail(function(result, event) {
					console.error("accodamento " + tipo + " fallito - get");
				});
			});
			promise.fail(function(result, event) {
				console.error("accodamento " + tipo + " fallito - add");
			});
		},
		
		deleteEvento: function(id_evento, callback) {
			var promise = NS_OFFLINE.getEVENTI().get(id_evento);
			promise.done(function(result, event) {
				if (typeof result != "undefined") {
					NS_OFFLINE.getEVENTI()["delete"](id_evento); /*e speriamo che vada a buon fine*/
					console.log("eliminazione evento  " + id_evento);
					if (typeof callback == "object" && typeof callback.if_ok == "function") {
						callback.if_ok();
					}
				} else {
					console.log("evento " + id_evento + " non esistente");
					if (typeof callback == "object" && typeof callback.if_ko == "function") {
						callback.if_ko();
					}
				}
			});
			promise.fail(function(result, event) {
				console.log("eliminazione evento " + id_evento + " fallita per un errore non gestito");
				if (typeof callback == "object" && typeof callback.if_ko == "function") {
					callback.if_ko();
				}
			});
		},
		
		updateAssistito: function(callback) {
			var assistito = home_offline.ASSISTITO;
			var dbpu = home_offline.NS_OFFLINE.TABLE.ASSISTITI.put(assistito, assistito.IDEN_ANAG);
			var semaforo = $.Deferred();
			dbpu.done(function(){
				console.log("ASSISTITO offline aggiornato");
				if (typeof callback == "object" && typeof callback.if_ok == "function") {
					callback.if_ok(assistito);
				}
				semaforo.resolve();
			});
			dbpu.fail(function(){
				console.log("Errore aggiornamento ASSISTITO offline");
				if (typeof callback == "object" && typeof callback.if_ko == "function") {
					callback.if_ko(assistito);
				}
				semaforo.resolve();
			});
			return semaforo;
		},
	
		setLocalStorage: function(parametro, valore) {
			localStorage[parametro]=valore;
			var setPromise = NS_OFFLINE.TABLE.PARAMETRI.put({"NOME":parametro, "VALORE":valore}, parametro);
			setPromise.fail(function() {
				console.error("setLocalStorage, errore per " + parametro + "=" + valore);
			});
		},

		deleteLocalStorage: function(parametro) {
			delete localStorage[parametro];
			var deletePromise = NS_OFFLINE.TABLE.PARAMETRI.delete(parametro);
			deletePromise.fail(function() {
				console.error("deleteLocalStorage, errore per " + parametro + "=" + valore);
			});
		}
};
