$(document).ready(function() {
	RICETTA_UTILS_CONFERMA.init();
});

var RICETTA_UTILS = {
	
	getToolDb: function() {
		if (typeof RICETTA != "undefined") {
			return RICETTA.getToolDb();
		};
		return home.$.NS_DB.getTool({_logger : home.logger});
	},
	
	invioImmediato: function(dematerializzata) {
		if (home.MMG_CHECK.isMedico()) {
			return true;
		} else {
			var invio_utente = home.LIB.getParamUserGlobal( 'INVIO_RR_SAL', 'S' );
			var invio_medico = UTENTE.getParametroIdenPer(home.CARTELLA.getMedPrescr(), 'INVIO_RR_SAL', invio_utente);
			switch (invio_utente) {
			case "N":
				return false;
			case "Q":
				if (invio_medico == "N") {
					return false;
				} else {
					return dematerializzata == "S";
				}
			case  "S":
			default:
				return invio_medico == "S" || (dematerializzata == "S" && invio_medico == "Q");
			}
		}
	},
	
	normalizeCallback: function(callback) {
		if (typeof callback == "undefined") {
			callback = {
				done: function () {
				},
				fail: function () {
				}
			};
		} else {
			if (typeof callback.done == "undefined") {
				callback.done = function() {};
			}
			if (typeof callback.fail == "undefined") {
				callback.fail = function() {};
			}
		}
		return callback;
	},

	cancella : function(pTipo, pArIden, callback, domanda) {
		callback = RICETTA_UTILS.normalizeCallback(callback);
		
		if (!LIB.isValid(domanda)) {
			domanda = "Cancellare la prescrizione?";
		}

		home.NS_MMG.confirm(domanda, function() {

			NS_LOADING.showLoading();

			var promise = RICETTA_UTILS.getToolDb().call_procedure({
	            id:'RR_CANCELLA',
	            parameter:
	            {
	            	v_tipo		:{ v : pTipo, t : 'V'},
	            	v_ar_iden	:{ v : pArIden, t :'A'},
	            	c_errori	:{ t : 'C' , d: 'O'},
					n_iden_ute	:{ v : home.baseUser.IDEN_PER, t : 'N'},
					v_username	:{ v : home.baseUser.USERNAME, t : 'V'},
					v_note		:{ v : '', t : 'V'}
	            }
			});
			promise.done( function(response) {
				if (LIB.isValid(response["c_errori"]) && response["c_errori"] != "") {
					home.NOTIFICA.error({
						message: "Impossibile annullare la ricetta: " + response["c_errori"],
						title: "Attenzione"
					});
				}
				callback.done();
			});
			promise.fail(callback.fail);
		});
	},

	stampaRicette : function(obj, control_object) {
		
		control_object = RICETTA_UTILS.normalizeCallback(control_object);
		
		var tipi = eval("(" + obj + ")");
		/*
		 * Ho un oggetto {B: "125,126", F: "123,124", P: "127,128"} (ordine
		 * alfabetico) Lo devo ciclare per fare le varie stampe differenti.
		 */
		var report;
		var stampa;
		var stampa_ricetta = control_object.stampa_ricetta; //problema script liberato IE

		var chiedi_conferma = (home.NS_PRINT.getUserPcGlobal("CONFERMA_STAMPA_RICETTA","",['"N"']) == 'S');
		var tipo_ricetta;

		if (obj.stampaInformativa == 'S') {
			/* se va stampata anche l'informativa, aggiungo
			 * all'oggetto il tipo I con gli iden della ricetta rossa
			 */
			tipi["I"] = tipi["F"];
		}
		var semafori = new Array();
		for (var x in tipi) {
			if (x != "MESSAGGI") {
				semafori.push($.Deferred());
			}
		}
		var y = 0;
		for ( var x in tipi) {
			if (LIB.isValid(tipi[x]) && tipi[x] != "") {
				if (stampa_ricetta == "N") {
					stampa = false;
				} else {
					stampa = true;
				}
				switch (x) {
				case "F":
					report = "FARMACI";
					tipo_ricetta = "RICETTA ROSSA";
					break;
				case "P":
					report = "PRESTAZIONI";
					tipo_ricetta = "RICETTA ROSSA";
					break;
				case "FD":
					report = "FARMACI_DEMA";
					tipo_ricetta = "PROMEMORIA RICETTA DEMATERIALIZZATA";
					if (control_object.dematerializzata == "D") {
						stampa = false;
					}
					break;
				case "PD":
					report = "PRESTAZIONI_DEMA";
					tipo_ricetta = "PROMEMORIA RICETTA DEMATERIALIZZATA";
					if (control_object.dematerializzata == "D") {
						stampa = false;
					}
					break;
				case "B":
					report = "FARMACI_BIANCA";
					tipo_ricetta = "RICETTA BIANCA";
					break;
				case "Q": /*Ricetta bianca prestazioni*/
					report = "PRESTAZIONI_BIANCA";
					tipo_ricetta = "RICETTA BIANCA";
					break;
				case "I":
					report = "RICETTA_BIANCA";// "FARMACI";
					tipo_ricetta = "FOGLIO INFORMATIVO";// "INFORMATIVA";
					break;
				case "MESSAGGI":
					home.NOTIFICA.warning({
						message : tipi[x],
						title : "Attenzione",
						timeout:0
					});
					if (home.NS_PRINT.getUserPcGlobal("AVVISO_STAMPA_DEMA","", ['"S"']) == "S") {
						chiedi_conferma = true;
					}
					continue;
				default:
					var msg = "stampaRicette, caso non riconosciuto: " + x;
					home.NOTIFICA.warning({
						message : msg,
						title : "Attenzione"
					});
					return;
				}
				/* show potrei renderlo dipendente da parametro utente, per debug */
				var prompts = {};
				prompts.pIdenTestata = tipi[x];
				
				/*Ha utilita' solo per il pregresso, ora gestiamo la cosa direttamente da database. Lo toglieremo un giorno. */
				prompts.pShowOriginale = LIB.getParamUserGlobal("SHOW_FARMACO_ORIGINALE", "1");
				
				if (LIB.isValid(home.CARTELLA.stampaPosologia) && home.CARTELLA.stampaPosologia != '') {
					prompts.pPosologiaRR = home.CARTELLA.stampaPosologia;
				} else {
					if (LIB.isValid(home.baseUser.POSOLOGIA_RR)) {
						prompts.pPosologiaRR = home.baseUser.POSOLOGIA_RR;
					} else {
						prompts.pPosologiaRR = 'N';
					}
				}
				prompts.pIdenTestata = tipi[x];
	
				if (!chiedi_conferma
						|| (chiedi_conferma && confirm("Sto per stampare: "
								+ tipo_ricetta
								+ ".\nAssicurarsi di aver inserito la carta corretta nella stampante."))) {
	
					var print_params = {
						report : report,
						prompts : prompts,
						show : "N",
						output : "pdf",
						windowname : "" + y
					};
	
					if (home.baseUser.TIPO_UTENTE == 'A') {
						print_params.configurazione_stampa = home.CARTELLA.getMedPrescr();
					}
					var stampato;
					if (stampa && home.NS_PRINT.print(print_params)) {
						stampato = "S";
					} else {
						stampato = "N";
					}
					/*Se richiesta la conferma e ho stampato, o se non e' richiesta la stampa*/
					if (stampato == "S" || !stampa) {
						RICETTA_UTILS.confermaRicette({
							"p_tipo_ricetta"	: x,
							"p_iden_ricetta"	: tipi[x],
							"v_stampato"		: stampato
						},semafori[y]);
					} else {
						semafori[y].resolve();
					}
				} else {
					semafori[y].resolve();
				}
			}
			y++;
		};
		$.when.apply($, semafori).then(function() {
			control_object.done();
		});
	},

	confermaRicette : function(param, semaforo) {
		var procedura;
		var parameter;
		if (param.p_tipo_ricetta == "FD" || param.p_tipo_ricetta == "PD") {
			if (param.v_stampato == "S") {
				procedura = "RR_STAMPATO";
				parameter = {
					"p_iden_ricetta" : {v: param.p_iden_ricetta, t: 'V'},
					"p_result"		 : {t: 'V', d: 'O'}
				};
			} else {
				if (
					!RICETTA_UTILS.invioImmediato("S") && home.baseUser.IDEN_PER != home.CARTELLA.getMedPrescr()
				) {
					var v_oggetto = {};
					v_oggetto[param.p_tipo_ricetta] = param.p_iden_ricetta;
					procedura = "RR_CHIEDI_CONFERMA";
					parameter = {
						"v_iden_ricetta"	: {v: param.p_iden_ricetta, t: 'V'},
						"v_oggetto"			: {v: JSON.stringify(v_oggetto), t: 'V'},
						"v_mittente"		: {v: home.baseUser.USERNAME, t: 'V'},
						"p_result"			: {t: 'V', d: 'O'}
					};
				}
			}
		} else {
			if (RICETTA_UTILS.invioImmediato("N")) {
				procedura = "RR_CONFERMA";
				parameter = {
					"p_iden_ricetta"	: {v: param.p_iden_ricetta, t: 'V'},
					"v_stampato"		: {v: param.v_stampato, t: 'V'},
					"p_result"			: {t: 'V', d: 'O'}
				};
			} else {
				procedura = "RR_STAMPATO";
				parameter = {
					"p_iden_ricetta" : {v: param.p_iden_ricetta, t: 'V'},
					"p_result"		 : {t: 'V', d: 'O'}
				};
			}
		}
		RICETTA_UTILS.getToolDb().call_procedure({
            id: procedura,
            parameter: parameter
		}).done(function() {
			if (procedura == "RR_CHIEDI_CONFERMA") {
				home.NOTIFICA.info({
					title: "Richiesta approvazione",
					message: "La ricetta &egrave; stata inviata al medico per l'approvazione. E' possibile proseguire il proprio lavoro."
				});
			}
			semaforo.resolve();
		}).fail(function() {
			semaforo.resolve();
		});
	},
	
	richiesteRicevute: 0,
	
	updRichiesteRicevute: function(incremento) {
		RICETTA_UTILS.richiesteRicevute+=incremento;
		if (RICETTA_UTILS.richiesteRicevute < 0) {
			RICETTA_UTILS.richiesteRicevute = 0;
		}
		RICETTA_UTILS_CONFERMA.setNotificaNumber(RICETTA_UTILS.richiesteRicevute);
	},
	
	/*
	 * TODO: funzione richiamata quando un medico deve approvare le ricette dematerializzate
	 * Il medico avra' queste scelte:
	 * -confermare la ricetta e stamparla sul computer della segretaria
	 * -confermare la ricetta e stamparla sul proprio computer?
	 * -cancellare la ricetta (con notifica alla segretaria)
	 */
	chiediConferma: function(param) {
		
		//var param = '{"FD":"50069","PD":""}'
		
		//funzione che elimina i valori vuoti
		function checkArrayNull(arr){
			
			if(arr.length < 2 && arr[0] == ''){
				arr=[];
			}
			
			return arr;
		}
		
		var obj = $.parseJSON(param);
		var ElencoRicetteFarmaci = typeof obj.FD != "undefined" ? obj.FD.split(",") : [];
		ElencoRicetteFarmaci = checkArrayNull(ElencoRicetteFarmaci);
		var ElencoRicettePrestazioni = typeof obj.PD != "undefined" ? obj.PD.split(",") : [];
		ElencoRicettePrestazioni = checkArrayNull(ElencoRicettePrestazioni);
		
		var arrayElenco = $.merge(ElencoRicetteFarmaci, ElencoRicettePrestazioni);
		var stringElenco = JSON.stringify(arrayElenco).replace(/\"/g,"").replace(/\[/g,"").replace(/\]/g,"");
		
		switch (RICETTA_UTILS_CONFERMA.getMetodoConferma()) {
		case "CONFERMA_AUTOMATICA":
			RICETTA_UTILS.confermaDema(stringElenco, true, false, function() {
				/*TODO: Notifico all'utente che ho confermato una ricetta?*/
			});
			break;
		case "INCREMENTO_NOTIFICA":
			RICETTA_UTILS.updRichiesteRicevute(arrayElenco.length);
			/*mostro una notifica?*/
			break;
		case "CONFERMA_POPUP":
		default:
			RICETTA_UTILS.getToolDb().select({
				id: "WORKLIST.ELENCO_RICETTE_DEMA_MESSAGE",
				parameter: {
					'iden_ricette' : stringElenco
				}
			}).done(function(resp) {
				if(resp.result.length > 0){
					$(resp.result).each(function(){
						var param = {
							paziente:$(this)[0].PAZIENTE,
							utente:$(this)[0].UTENTE_INSERIMENTO,
							iden_utente:$(this)[0].UTE_INS,
							elenco:$(this)[0].ELENCO,
							iden_anag:$(this)[0].IDEN_ANAG,
							iden_ricetta:$(this)[0].IDEN,
							data:$(this)[0].DATA_RICETTA
						};
						RICETTA_UTILS_CONFERMA.getMessage(param);
					});
				}
			}).fail(function() {

			});
			break;
		}
		
		/* debug *****************************************
		
		var param = {
				paziente:'PAZIENTE DI DEMATERIALIZZATA',
				utente:'PINCO PALLO',
				elenco:'AUGMENTIN,AUGMENTIN,AUGMENTIN,AUGMENTIN,AUGMENTIN,',
				iden_anag:'667572',
				data:'20/04/2015 18:05'
		}
		
		RICETTA_UTILS_CONFERMA.getMessage(param);
		RICETTA_UTILS_CONFERMA.setEventsMsg();
		return;
		
		 end debug **************************************/
		
	},
	
	/*
	 * conferma ricette
	 */
	confermaDema: function(iden_ricetta, stampa_remota, stampa_locale, callback) {
		RICETTA_UTILS.getToolDb().call_procedure({
            id: "RR_CONFERMA_STAMPA",
            parameter: {
				"p_iden_ricetta"	: {v: iden_ricetta, t: 'V'},
				"p_result"			: {t: 'V', d: 'O'}
			}
		}).done(function(resp) {
			/*Ho confermato e ottenuto o l'oggetto con dema+rosse o un errore*/
			var result = resp.p_result;
			if (result.indexOf("KO") == 0) {
				home.NOTIFICA.error({
					title: "Errore",
					message: result.substring(3)
				});
			} else {
				var semaforo = $.Deferred();
				var resolver = function() {
					semaforo.resolve();
				};
				/*Invio la stampa sul computer dell'utente che ha inserito la ricetta (segretaria) o su quello corrente*/
				if (stampa_remota) {
					RICETTA_UTILS.getToolDb().call_procedure({
						id: "RR_STAMPA_REMOTA",
						parameter: {
							"v_oggetto"			: {v: result, t: 'V'},
							"v_iden_ricetta"	: {v: iden_ricetta, t: 'V'},
							"v_mittente"		: {v: home.baseUser.USERNAME, t: 'V'},
							"p_result"			: {t: 'V', d: 'O'}
						}
					}).done(function(resp) {
						var result_remota = resp.p_result;
						if (result_remota.indexOf("KO") == 0) {
							home.NOTIFICA.error({
								title: "Errore",
								message: result_remota.substring(3)
							});
						} else {
							home.NOTIFICA.info({
								title: "Ricetta Confermata",
								message: "Verr&agrave; stampata sul computer dell'utente richiedente"
							});
						}
						resolver();
					});
				} else {
					if (stampa_locale) {
						RICETTA_UTILS.stampaRicette(result, {
							done: resolver
						});
					} else {
						/*TODO: faccio qualcosa? Purtroppo non ho i dati della ricetta, nemmeno il mittente*/
						resolver();
					}
				}
				$.when(semaforo).then(function() {
					if (typeof callback == "function") {
						callback();
					}
					try {
						/*TODO*/
						RICETTA_UTILS.updRichiesteRicevute(-1);
					} catch(e) {
						console.error(e);
					}
				});
			}
		});
		
		//ricontrollo quante ricette rimangono da confermare
		RICETTA_UTILS_CONFERMA.getCountRicette();
	},
	
	stampaRemotaRicette: function(obj) {
		RICETTA_UTILS.stampaRicette(obj, {
			dematerializzata: "S",
			done: function() {
				//notificare al medico la stampa corretta?
			},
			fail: function() {
				//notificare al medico che non e' stata stampata? Metodo non ancora utilizzato a dire il vero, visto che i casi di errore sono difficili da identificare
			}
		});
	},
	
	cancellaeNotifica: function(iden_ricetta, iden_utente, callback, dati_ricetta) {
		if (typeof dati_ricetta == "undefined") {
			dati_ricetta = "";
		}
		RICETTA_UTILS.cancella("RICETTA",iden_ricetta, {
			done: function() {
				RICETTA_UTILS.inviaNotificaIdenPer(iden_utente, "Ricetta cancellata dal medico" + dati_ricetta, "warning", 30);
				callback.done();
			},
			fail: function() {
				callback.fail();
			}
		});
	},
	
	inviaNotificaInfo: function(destinatario, messaggio) {
		RICETTA_UTILS.getToolDb().call_function({
			id:'INVIO_ACTIVEMQ',
			parameter: {
				v_tipo_messaggio		:{ v : 'NOTICE', t : 'V'},
				v_utenti_destinatari	:{ v : destinatario, t :'V'},
				v_message				:{ v : messaggio, t : 'V'},
				v_title					:{ v : "Messaggio di notifica da " + home.baseUser.DESCRIZIONE, t : 'V'}
			}
		}).done(function() {
			/*Mi interessa sapere se ho inviato o no?*/
		});
	},
	
	inviaNotifica: function(destinatario, messaggio, tipo_notifica, timeout) {
		if (typeof timeout=="undefined") {
			timeout=0;
		}
		var param = {
			tipo_notifica: tipo_notifica,
			title: "Messaggio di notifica da " + home.baseUser.DESCRIZIONE,
			message: messaggio,
			timeout: timeout
		};
		RICETTA_UTILS.getToolDb().call_function({
			id:'INVIO_ACTIVEMQ',
			parameter: {
				v_tipo_messaggio		:{ v : 'JS_CALL', t : 'V'},
				v_utenti_destinatari	:{ v : destinatario, t :'V'},
				v_funzione				:{ v : "RICETTA_UTILS.riceviNotifica", t : 'V'},
				v_param_funzione		:{ v : JSON.stringify(param), t : 'V'}
			}
		}).done(function() {
			/*Mi interessa sapere se ho inviato o no?*/
		});
	},
	
	inviaNotificaIdenPer: function(iden_per, messaggio, tipo_notifica, timeout) {
		RICETTA_UTILS.inviaNotifica(UTENTE.getParametroIdenPer(iden_per, "USERNAME"), messaggio, tipo_notifica, timeout);
	},
	
	riceviNotifica: function(notifica) {
		var obj = JSON.parse(notifica);
		var tipo_notifica = obj.tipo_notifica;
		delete obj.tipo_notifica;
		home.NOTIFICA[tipo_notifica](obj);
	},
	
	/*Ai fini di debug e assistenza*/
	showRowInfo: function(icon) {
		var output="";
		var row = icon.closest("tr");
		var attrs = row.attributes;
		for (var a in attrs) {
			if (typeof attrs[a].nodeName != "undefined") {
				output += attrs[a].nodeName + ": " + attrs[a].nodeValue + "\n";
			}
		}
		alert(output);
	},
	
	oscura: function(obj, callback) {
		if(!home.MMG_CHECK.isDead()){return;}
		
		RICETTA_UTILS.getToolDb().call_procedure({
            id:'SP_OSCURAMENTO',
            parameter: obj
		}).done( function() {
			if (typeof callback == 'function')
				callback();
		});
	}
	
};

var RICETTA_UTILS_CONFERMA = {
	
	init: function() {
		//var invio = home.LIB.getParamUserGlobal('INVIO_RR_SAL', 'S');
		//if (invio == "N") { /*|| invio == "Q"*/
			RICETTA_UTILS_CONFERMA.getCountRicette();
		//}
	},
	
	heightElenco:'',

	heightConferma:'',

	toggleValue:true,

	getDiv:function(list){

		var div = RICETTA_UTILS_CONFERMA.structure.createStructure();
		div.append(RICETTA_UTILS_CONFERMA.structure.createList(list));

		//alert(div.html())

		return div;
	},

	getCountRicette:function(){

		RICETTA_UTILS.getToolDb().select({
			id:'MMG_DATI.COUNT_RICETTE_DA_CONFERMARE',
			parameter: {
				iden_med   :   { v : home.baseUser.IDEN_PER, t : 'N'}
			}
		}).done(function(resp) {
			RICETTA_UTILS_CONFERMA.setNotificaNumber(resp.result[0].CONTEGGIO_RICETTE);
		});
	},

	setNotificaNumber:function(vNumber){

		$("#numRicetteDaConfermare").remove();
		
		if(vNumber < 1){
			$("#linkRicette i").css("background","transparent");
			return;
		}
		var iconaNumber = $( document.createElement('div') );
		iconaNumber.attr( {
			'id' : 'numRicetteDaConfermare', 
			'title' : 'Ci sono '+ vNumber + ' ricette da confermare', 
			'class' : 'notificaApice' 
		} );
		iconaNumber.text( vNumber);
		iconaNumber.appendTo('#linkRicette');

		RICETTA_UTILS.richiesteRicevute = parseInt(vNumber);
		
		/*se si vuole dare risalto*/
		//$("#linkRicette i").css("background","yellow");
	},

	structure:{

		createStructure:function(){

			var div = $("<div></div>");
			div.attr("id","divElencoRicette");
			div.addClass("divConfermaRicette");

			var divIconTray = $("<div></div>");
			divIconTray.attr("id","divIconTray");
			divIconTray.addClass("divIconTray");
			
			var divTitle = $("<div></div>");
			divTitle.attr("id","divTitle");
			divTitle.addClass("divTitle");
			divTitle.html("RICETTE DEMATERIALIZZATE DA CONFERMARE DEL "+ moment().format("DD/MM/YYYY"));

			divIconTray.append(RICETTA_UTILS_CONFERMA.structure.createIconTray());
			div.append(divTitle, divIconTray);
			return div;
		},

		createList:function( list){

			var ul = $("<ul></ul>");
			ul.attr("id","ulListaRicette");

			for (var i=0; i<list.length;i++){
				var idenRicetta = list[i].IDEN;
				var li =  $("<li></li>");
				li.attr("id","liListaRicette");
				li.attr("idenRicetta", idenRicetta);
				li.attr("idenMedico", list[i].IDEN_MEDICO);
				li.attr("idenUtente", list[i].UTE_INS);
				li.attr("idenAnag", list[i].IDEN_ANAG);

				var divPaziente = $("<div></div>");
				divPaziente.attr("id","divPaziente_" + idenRicetta);
				divPaziente.addClass("divPaziente tableConferma");

				var divElenco = $("<div></div>");
				divElenco.attr("id","divElenco_" + idenRicetta);
				divElenco.addClass("divElenco tableConferma borderBottom");

				var divInfo = $("<div></div>");
				divInfo.attr("id","divInfoRicetta_" + idenRicetta);
				divInfo.addClass("divInfoRicetta tableConferma");

				var divUtenteIns = $("<div></div>");
				divUtenteIns.attr("id","divUtenteIns_" + idenRicetta);
				divUtenteIns.addClass("divUtenteIns tableConferma borderBottom");

				var divAction = RICETTA_UTILS_CONFERMA.structure.createDivAction(idenRicetta);
				divPaziente.html(list[i].PAZIENTE);
				divElenco.html(list[i].ELENCO);
				divInfo.html(list[i].DATA_RICETTA);
				divUtenteIns.html("( "+list[i].UTENTE_INSERIMENTO+" )");

				li.append(divInfo, divPaziente,  divAction, divUtenteIns, divElenco);
				ul.append(li);
			}

			return ul;
		},

		createFilter:function(){},

		createDivAction:function(idenRicetta){

			var div = $("<div></div>");
			div.attr("id","divAction_" + idenRicetta);
			div.addClass("divAction tableConferma borderBottom");			

			var i = $("<i></i>");
			i.addClass("icon-print icoGreen");
			var io = $("<i></i>");
			io.addClass("icon-ok icoGreen");
			var ic = $("<i></i>");
			ic.addClass("icon-trash icoRed");
			var iu = $("<i></i>");
			iu.addClass("icon-user");

			div.append(i, io, ic, iu);

			return div;
		},

		createFooter:function(){

			var div = $("<div></div>");
			div.attr("id", "divButton");

			var divBtConferma = $("<div></div>");
			divBtConferma.attr("id","butConferma").addClass("buttonConfermaRicette butConferma").html("CONFERMA TUTTE");
			
			var divBtConfermaStampa = $("<div></div>");
			divBtConfermaStampa.attr("id","butConfermaStampa").addClass("buttonConfermaRicette butConfermaStampa").html("CONFERMA TUTTE e STAMPA");

			var divBtChiudi = $("<div></div>");
			divBtChiudi.attr("id","butElenco").addClass("buttonConfermaRicette butElenco").html("VAI ALL'ELENCO COMPLETO");
			divBtConferma.append($("<i class='icon-ok icoDivAction icoGreen'></i>"));
			divBtConfermaStampa.append($("<i class='icon-print icoDivAction icoGreen'></i>"));
			divBtChiudi.append($("<i class='icon-th-list icoDivAction icoRed'></i>"));

			div.append(divBtChiudi, divBtConfermaStampa ); //divBtConferma, 

			return div;
		},

		createIconTray:function(){

			var div = $("<div></div>");
			div.attr("id", "divActionTray");

			var im = $("<i></i>");
			im.addClass("icon-minus iconTray");
			var ic = $("<i></i>");
			ic.addClass("icon-cancel iconTray icoRed");
			var ir = $("<i></i>");
			ir.addClass("icon-cog-2 iconTray");

			div.append(ic,im,ir);

			return div;
		}
	},

	setEvents:function(){

		$(".divAction i.icon-user").on("click", function(){
			home.NS_MMG.apriCartella( $(this).closest("li").attr("idenAnag"), 'SSN' );
			RICETTA_UTILS_CONFERMA.toggleElenco();
		});
		
		var butConfermaFunction = function(questo, stampa_remota){
			NS_LOADING.showLoading({destinazione: $("#divConfermaRicette")});
			var li = questo.closest("li");
			var dati_ricetta = "<br>" + $("#divPaziente_" + li.attr("idenRicetta")).text() + "<br>" + $("#divElenco_" + li.attr("idenRicetta")).text();
			RICETTA_UTILS.confermaDema( li.attr("idenRicetta"), stampa_remota, false, function() {
				li.hide("fast", function() {
					li.remove();
					if ($("#ulListaRicette li").length == 0) {
						RICETTA_UTILS_CONFERMA.closeElenco();
					}
					if (!stampa_remota) {
						RICETTA_UTILS.inviaNotificaIdenPer(li.attr("idenUtente"), "Ricetta confermata dal medico" + dati_ricetta, "info", 30);
					}
					NS_LOADING.hideLoading();
				});
			});
		};

		$(".divAction i.icon-ok").on("click", function() {
			butConfermaFunction($(this), false);
		});

		$(".divAction i.icon-print").on("click", function() {
			butConfermaFunction($(this), true);
		});

		$(".divAction i.icon-trash").on("click", function(){
			var questo = $(this);
			var li = questo.closest("li");
			
			var dati_ricetta = "<br>" + $("#divPaziente_" + li.attr("idenRicetta")).text() + "<br>" + $("#divElenco_" + li.attr("idenRicetta")).text();
			
			RICETTA_UTILS.cancellaeNotifica(li.attr("idenRicetta"), li.attr("idenUtente"),{
				done:function() {
					li.hide("fast", function() {
						li.remove();
						if ($("#ulListaRicette li").length == 0) {
							RICETTA_UTILS_CONFERMA.closeElenco();
						}
						NS_LOADING.hideLoading();
					});
				},
				fail:function() {
					/*traggedia*/
				}
			}, dati_ricetta);
		});

		$("#divActionTray i.icon-minus").on("click", function(){
			RICETTA_UTILS_CONFERMA.toggleElenco();
		});

		$("#divActionTray i.icon-cancel").on("click", function(){
			RICETTA_UTILS_CONFERMA.closeElenco();
		});

		$("#divActionTray i.icon-cog-2").on("click", function(){
			RICETTA_UTILS_CONFERMA.openOptions();
		});
		
		var butConfermaFunctionAll = function(stampa_remota){
			NS_LOADING.showLoading({destinazione: $("#divConfermaRicette")});
			var iden_ricetta = new Array();
			$("#ulListaRicette > li").each(function() {
				iden_ricetta.push($(this).attr("idenRicetta"));
			});
			
			RICETTA_UTILS.confermaDema(iden_ricetta.toString(), stampa_remota, false, function() {
				NS_LOADING.hideLoading();
				RICETTA_UTILS_CONFERMA.closeElenco();
				RICETTA_UTILS.updRichiesteRicevute(-iden_ricetta.length);
			});
		};

		$(".butConferma").on("click", function() {
			butConfermaFunctionAll(false);
		});
		
		$(".butConfermaStampa").on("click", function() {
			butConfermaFunctionAll(true);
		});

		$(".butElenco").on("click", function(){

			var vJson = {
				Dematerializzate 	: 'S',
				Confermate			: 'N',
				Stampate			: 'N',
				dataInizio			: moment().format("YYYYMMDD"),
				dataFine			: moment().format("YYYYMMDD")
			};

			vJson = JSON.stringify(vJson);

			RICETTA_UTILS_CONFERMA.closeElenco();
			home.NS_MMG.apri("CONFERMA_RICETTE", "&PARAMETRI="+vJson);
		});
	},

	closeElenco:function(){
		$("#divConfermaRicette").hide("fast", function() {
			$("#divConfermaRicette").remove();
		});
		//RICETTA_UTILS_CONFERMA.setNotificaNumber(0);
	},

	openOptions:function(){

		var div = $("<div></div>");
		div.attr("id", "divContentOptions");
		div.addClass("divOptions")
		div.html(traduzione.lblOpzioniDematerializzata);

		var but_conferma_automatica = {
			label : "Conferma automatica",
			action : function(ctx) {
				RICETTA_UTILS_CONFERMA.setMetodoConferma("CONFERMA_AUTOMATICA");
				home.$.dialog.hide();
			}
		};
		var but_popup = {
			label : "Popup",
			action : function(ctx) {
				RICETTA_UTILS_CONFERMA.setMetodoConferma("CONFERMA_POPUP");
				home.$.dialog.hide();
			}
		};
		var but_incremento = {
			label : "Incremento notifica",
			action : function(ctx) {
				RICETTA_UTILS_CONFERMA.setMetodoConferma("INCREMENTO_NOTIFICA");
				home.$.dialog.hide();
			} 
		};
		
		var attivo;
		switch(RICETTA_UTILS_CONFERMA.getMetodoConferma()) {
		case "CONFERMA_AUTOMATICA":
			attivo = but_conferma_automatica;
			break;
		case "INCREMENTO_NOTIFICA":
			attivo = but_incremento;
			break;
		case "CONFERMA_POPUP":
		default:
			attivo = but_popup;
			break;
		}
		attivo.keycode = 13;
		attivo.classe = "butVerde";
		
		var but_annulla = {
			label : "Annulla",
			action : function(ctx) {
				home.$.dialog.hide();
			}
		};

		var dialog = home.$.dialog(div,{

			id : "dialogOptions",
			title : "Opzioni dematerializzata",
			width : 600,
			showBtnClose : true,
			modal : true,
			movable : true,
			buttons : [
				but_conferma_automatica,
				but_popup,
				but_incremento,
				but_annulla
			]
		});
	},

	toggleElenco:function(){

		if(RICETTA_UTILS_CONFERMA.toggleValue){

			RICETTA_UTILS_CONFERMA.heightElenco = $("#divElencoRicette").height();
			RICETTA_UTILS_CONFERMA.heightConferma = $("#divConfermaRicette").height();

			$("#ulListaRicette, #divButton").hide()
			$("#divElencoRicette").height("20px")
			$("#divConfermaRicette").height("20px")
			RICETTA_UTILS_CONFERMA.toggleValue = false;

		}else{

			$("#ulListaRicette, #divButton").show();
			$("#divElencoRicette").height(RICETTA_UTILS_CONFERMA.heightElenco);
			$("#divConfermaRicette").height(RICETTA_UTILS_CONFERMA.heightConferma);
			RICETTA_UTILS_CONFERMA.toggleValue = true;
		}
	},

	getMessage:function(param){

		home.NOTIFICA.ambiance({
			type:"message",
			timeout: 0,
			title:"Ricetta dematerializzata dell'utente "+param.utente,
			message:RICETTA_UTILS_CONFERMA.getHtmlMessage(param)
		});

		RICETTA_UTILS_CONFERMA.setEventsMsg(param.iden_ricetta);
	},

	getHtmlMessage:function(param) {

		/* esempio di param
		 * param = {
				paziente:'',
				utente:'',
				iden_utente:'',
				elenco:'',
				iden_anag:'',
				iden_ricetta:'',
				data:''
		}*/

		var div = $("<div></div>");
		div.attr("id","divMessage_"+param.iden_ricetta);

		var divPaziente  = $("<div></div>");
		divPaziente.attr("id","divPaziente_"+param.iden_ricetta);
		divPaziente.addClass("linkCartella");
		divPaziente.html("Paziente: <a>"+param.paziente+"</a>");

		var divData = $("<div></div>");
		divData.attr("id","divData_"+param.iden_ricetta);
		divData.html("Data: "+param.data );

		var divElenco = $("<div></div>");
		divElenco.attr("id","divElencoPrescr_"+param.iden_ricetta);
		divElenco.html(param.elenco);

		var divDati = $("<div></div>");
		divDati.attr("id","divDati_"+param.iden_ricetta);
		divDati.attr("idenAnag", param.iden_anag);
		divDati.attr("idenRicetta", param.iden_ricetta);
		divDati.attr("idenUtente", param.iden_utente);

		var divButton = $("<div></div>");
		divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butConfermaStampaMsg", param.iden_ricetta, param.iden_utente, "icon-print icoGreen", "Conferma e Stampa"));
		divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butConfermaMsg", param.iden_ricetta, param.iden_utente, "icon-ok icoGreen", "Conferma"));
		divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butCancellaMsg", param.iden_ricetta, param.iden_utente, "icon-trash icoRed", "Cancella"));
		divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butElencoMsg", param.iden_ricetta, param.iden_utente, "icon-th-list ", "Elenco Smart"));
		//divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butCartellaMsg", param.iden_ricetta, param.iden_utente, "icon-user", "Assistito"));
		divButton.append(RICETTA_UTILS_CONFERMA.createButtonMsg("butOpzioniMsg", param.iden_ricetta, param.iden_utente, "icon-cog-2", "Opzioni"));

		div.append( divPaziente, divData, divElenco, divDati, divButton );

		return div;
	},

	createButtonMsg:function(id, idenRicetta, idenUtente, iClasse, testo){
		
		var button = $("<div></div>");
		button.attr("id", id+"_"+idenRicetta);
		button.attr("iden_ricetta", idenRicetta);
		button.attr("iden_utente", idenUtente);
		button.addClass("btnMsg");
		button.html("<i class='"+iClasse+"'></i><br>"+testo);
		
		return button;
	},
	
	setMetodoConferma: function(pValue) {
		localStorage["conferma_dematerializzata_" + home.baseUser.IDEN_PER] = pValue;
	},

	getMetodoConferma: function() {
		return localStorage["conferma_dematerializzata_" + home.baseUser.IDEN_PER];
	},

	setEventsMsg:function(idenRicetta){

		$("#butConfermaMsg_"+idenRicetta).on("click", function() {
			NS_LOADING.showLoading();
			var questo = $(this);
			var dati_ricetta = "<br>" + $("#divPaziente_" + idenRicetta).text() + "<br>" + $("#divElencoPrescr_" + idenRicetta).text();
			RICETTA_UTILS.confermaDema( questo.attr("iden_ricetta"), false, false, function () {
				RICETTA_UTILS.inviaNotificaIdenPer(questo.attr("iden_utente"), "Ricetta confermata dal medico" + dati_ricetta, "info", 30);
				RICETTA_UTILS_CONFERMA.closeAmbiance(questo);
				NS_LOADING.hideLoading();
			});
		});
		
		$("#butConfermaStampaMsg_"+idenRicetta).on("click", function() {
			NS_LOADING.showLoading();
			var questo = $(this);
			RICETTA_UTILS.confermaDema( questo.attr("iden_ricetta"), true, false, function () {
				NS_LOADING.hideLoading();
				RICETTA_UTILS_CONFERMA.closeAmbiance(questo);
			});
		});

		$("#butCancellaMsg_"+idenRicetta).on("click", function() {
			var questo = $(this);
			var dati_ricetta = "<br>" + $("#divPaziente_" + idenRicetta).text() + "<br>" + $("#divElencoPrescr_" + idenRicetta).text();
			RICETTA_UTILS.cancellaeNotifica(questo.attr("iden_ricetta"), questo.attr("iden_utente"),{
				done:function() {
					NS_LOADING.hideLoading();
					RICETTA_UTILS_CONFERMA.closeAmbiance(questo);
				},
				fail:function() {
					NS_LOADING.hideLoading();
					RICETTA_UTILS_CONFERMA.closeAmbiance(questo);
					/*traggedia*/
				}
			}, dati_ricetta);
		});

		$("#butElencoMsg_"+idenRicetta).on("click", function() {
			//RICETTA_UTILS_CONFERMA.toggleElenco();
			NS_MMG.apriConfermaRicette();
			RICETTA_UTILS_CONFERMA.closeAmbiance();
		});

		$("#divPaziente_"+idenRicetta).on("click", function() {
			RICETTA_UTILS_CONFERMA.closeElenco();
			home.NS_MMG.apriCartella( $("#divDati").attr("idenAnag"), 'SSN' );
		});

		$("#butOpzioniMsg_"+idenRicetta).on("click", function() {
			RICETTA_UTILS_CONFERMA.openOptions();
		});
	},

	closeAmbiance: function(obj) {
		if(typeof obj != 'undefined' ){			
			obj.closest(".ambiance-message").find(".ambiance-close").trigger("click");
		}else{
			$(".ambiance-close").trigger("click");
		}
	}
};
