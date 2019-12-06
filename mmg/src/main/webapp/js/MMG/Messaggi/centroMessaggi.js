$(document).ready(function() {
	
	CENTRO_MESSAGGI.init();
	CENTRO_MESSAGGI.setEvents();

	home.NS_CONSOLEJS.addLogger({
		name : 'CENTRO_MESSAGGI',
		console : 1
	});

	CENTRO_MESSAGGI.logger = home.NS_CONSOLEJS.loggers['CENTRO_MESSAGGI'];
	
});

var CENTRO_MESSAGGI = {
		
		styleMsg : ' style="color:#afafaf; font-style:italic; font-size:11px;" ',
		
		vAction : 'NUOVO',
		
		IDEN_DISCUSSIONE: null,
		
		vPazienteCorrente : false,
		
		init:function(){
			
			CENTRO_MESSAGGI.initTinyMCE();
			CENTRO_MESSAGGI.setLayout();
			
			if(typeof localStorage != "undefined" && LIB.isValid(localStorage["inviatiRicevuti"])){
				$("#radInviatiRicevuti").data("RadioBox").selectByValue(localStorage["inviatiRicevuti"]);
			}else{
				$("#radInviatiRicevuti").data("RadioBox").selectByValue('RICEVUTI');
			}
			
			CENTRO_MESSAGGI.loadWk();
			
			NS_FENIX_SCHEDA.registra = CENTRO_MESSAGGI.save;
			
			
			CENTRO_MESSAGGI.gestione_visualizzazione.showHideAnteprima("HIDE");
		},
		
		setEvents:function(){
			
			$("#butCerca").on("click", function() {
				CENTRO_MESSAGGI.filtri.loadUsers();
			});
			
			$("#butCercaMsg").on("click", function(){
				CENTRO_MESSAGGI.loadWk();
			});
			
			$("#butMsgPazienteCorrente").on("click", function(){
				
				if(CENTRO_MESSAGGI.vPazienteCorrente){
					NS_MMG_UTILITY.buttonDeselect($(this));
					CENTRO_MESSAGGI.vPazienteCorrente = false;
				}else{					
					NS_MMG_UTILITY.buttonSelect($(this));
					CENTRO_MESSAGGI.vPazienteCorrente = true;
				}
				
				CENTRO_MESSAGGI.loadWk();
			});
			
			
			$(".butNuovoMessaggio").on("click", function(){
				CENTRO_MESSAGGI.apriTabInvio('INVIO');
			});
			
			CENTRO_MESSAGGI.setEventsIcons();
			
			$(".ulTabs").on("click", function(){
				
				if($("#li-tabMessaggi").hasClass('tabActive')){
					$(".butSalva").hide();
				}else{
					$(".butSalva").show();
				}
			});
			
			var butFiltraOnline = $("#butFiltraOnline");
			butFiltraOnline.on("click", function() {
				NS_MMG_UTILITY.buttonSwitch(
						butFiltraOnline,
						{before: CENTRO_MESSAGGI.filtri.filtraOnline},
						{before: CENTRO_MESSAGGI.filtri.rimuoviFiltroOnline}
				);
			});
			
			NS_MMG_UTILITY.buttonDeselect($("#butFiltraOnline"));

			$("body").on("keyup", function(e) {
				
				if($("#li-tabMessaggiInvio").hasClass("tabActive")){
				
					if (e.keyCode == 13) {
						CENTRO_MESSAGGI.filtri.loadUsers();
					}
				
				}else{
					
					if (e.keyCode == 13) {
						CENTRO_MESSAGGI.loadWk();
					}
				}
			});
			
			$("#li-tabMessaggiInvio").on("click", function(eventObject, semaforo) {
				
				CENTRO_MESSAGGI.filtri.loadUsers().done(function () {
					if (typeof semaforo != "undefined") {
						semaforo.resolve();
					}
				});
				CENTRO_MESSAGGI.nuovoMessaggio();
				
			});
			
			$("#li-tabMessaggi").on("click", function(eventObject, semaforo) {
				CENTRO_MESSAGGI.resetPaginaMessaggio();
			});
			
			
			$("#h-radTipoUtente").on("change", function(){
				CENTRO_MESSAGGI.filtri.loadUsers();
			});
			
			$("#h-radInviatiRicevuti").on("change", function(){
				CENTRO_MESSAGGI.loadWk();
				localStorage["inviatiRicevuti"] = $("#h-radInviatiRicevuti").val();
			});
			
			if ($("#IDEN_ANAG").val() == '') {
				$("#lblCollegamentoPaziente").parent().hide();
			}
		},
		
		setEventsIcons:function(riga){
			
			$("#iconCancella").on("click", function(){
				CENTRO_MESSAGGI.worklist.cancella(riga);
			});
			$("#iconRispondi").on("click", function(){
				CENTRO_MESSAGGI.worklist.rispondi(riga);
			});
			$("#iconInoltra").on("click", function(){
				CENTRO_MESSAGGI.worklist.inoltra(riga);
			});
			$("#iconCreaNota").on("click", function(){
				CENTRO_MESSAGGI.worklist.creaNota(riga);
			});
		},
		
		setLayout:function(){
			
			$(".butSalva").hide();
			
			//nascondo il pulsante per la ricerca messaggi relativi al paziente
			if($("#IDEN_ANAG").val() == ''){
				$("#butMsgPazienteCorrente").parent().hide();
			}
			
			$("#fldVisualizzazione").addClass("backgroundYellow");
			
			if($("#IDEN_ANAG").val() != ''){
				$("#butMsgPazienteCorrente").html($("#butMsgPazienteCorrente").html() + ' ' + home.ASSISTITO.NOME_COMPLETO)
				NS_MMG_UTILITY.buttonSelect($("#butMsgPazienteCorrente"));
				CENTRO_MESSAGGI.vPazienteCorrente = true;
			}
			
			$("#radInviatiRicevuti").parent().attr("colSpan","4");
			
			CENTRO_MESSAGGI.setHeight();
			
			$("#divMsg").width($("#fldVisualizzazione").outerWidth(true) - $("#divAction").width() - 50);
			
			$("#txtRicerca").attr("placeholder", traduzione.lblPHRicercaMsg);
			$("#txtOggettoMessaggio").attr("placeholder", traduzione.lblInserisciOggetto);
			$("#txtRicercaUtenti").attr("placeholder", traduzione.lblInserisciDestinatario);
			
			$("#radTipoUtente").data("RadioBox").selectByValue("MMG");
		},
		
		apriTabInvio:function(pCase, messaggio){

			var semaforo = $.Deferred();
			
			$("#li-tabMessaggiInvio").trigger("click", semaforo);
			$.when(semaforo).then(function() {
				switch(pCase){
					case 'RISPOSTA':
						var destinatari = messaggio.DESTINATARI.split(",");
						for (var d = 0; d < destinatari.length; d++) {
							var dest = destinatari[d].split("|")[0];
							var opt = $("#ComboInUser option[value='" + dest + "']");
							if (opt.length > 0) {
								$("#ComboOutUser").append(opt.remove());
							} else {
								opt.remove();
								var valorizzatore = function (destinatario) {
									$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).select({
										id : 'MMG_DATI.PANNELLO_NOTIFICHE_UTENTI_ALL',
										parameter : {
											'userName' 		: "",
											'tipo_utente'	: "",
											'value'			: destinatario
										}
									}).done(function(response) {
										$("#ComboOutUser").append("<option value='" + destinatario + "'>" + response.result[0].DESCR + "</option>");
									});
								};
								valorizzatore(dest);
							};
						}
						CENTRO_MESSAGGI.setRisposta(messaggio);
						break;

					case 'INOLTRO':
						CENTRO_MESSAGGI.setInoltro(messaggio);
						break;

					case 'INVIO':
					default:
						CENTRO_MESSAGGI.nuovoMessaggio();
						break;
				}
			});
		},
		
		getListHeight:function(){
			return $('.contentTabs').outerHeight(true) - $('#fldRicerca').outerHeight(true) - $("#fldTipoMessaggi").outerHeight(true);
		},
		
		getTextHeight : function() {
			return $('.contentTabs').outerHeight(true) - $('#divMsg').outerHeight(true);
		},
		
		initTinyMCE : function() {

			tinymce.init({
				selector : '#txtMessaggio',
				mode : 'exact',
				plugins : '',
				height: '200px',
				menubar : false,
				style_formats : [ {
					title : 'Paragraph',
					format : 'p'
				} ],
				statusbar : false
			});
			
		},

		loadWk : function() {
			
			var pTesto 	= $("#txtRicerca").val();
			var vTesto 	= typeof pTesto != 'undefined' ? pTesto.toUpperCase() : '';
			var vCase 	= $("#h-radInviatiRicevuti").val();
			
			if(!CENTRO_MESSAGGI.vPazienteCorrente){
				
				vParameters = {
					'id' : 'LISTA_MESSAGGI',
					'aBind' : [ 'username', 'sito', 'titolo', 'case'],
					'aVal' : [ home.baseUser.USERNAME, home.NS_FENIX_TOP.sito, pTesto, vCase]
				};
			}else{
				
				vParameters = {
					'id' : 'LISTA_MESSAGGI_PAZIENTE',
					'aBind' : [ 'username', 'sito', 'titolo', 'id_argomento', 'tipo_discussione', 'case'],
					'aVal' : [ home.baseUser.USERNAME, home.NS_FENIX_TOP.sito, vTesto, home.ASSISTITO.COD_FISC, 'MSG_ANAG', vCase]
				};
			}
			
			var height = CENTRO_MESSAGGI.getListHeight()- 60;
			$('#divWk').height(height);

			CENTRO_MESSAGGI.wk = new WK(vParameters);
			CENTRO_MESSAGGI.wk.loadWk();

		},

		nuovoMessaggio:function(riga){
			
			CENTRO_MESSAGGI.vAction = 'NUOVO';
			CENTRO_MESSAGGI.IDEN_DISCUSSIONE = null;
			
			//svuoto i destinatari, il testo del messaggio e l'oggetto
			$("#ComboOutUser").empty();
			tinyMCE.activeEditor.setContent('');
			tinyMCE.activeEditor.focus();
			$("#txtOggettoMessaggio").val("");
			$("#radCollegamentoPaziente").data("RadioBox").enable();
			if ($("#IDEN_ANAG").val() != "") {
				$("#radCollegamentoPaziente_S:not(.RBpulsSel)").trigger("click");
				if (LIB.isValid(home.ASSISTITO.NOME_COMPLETO)) {
					$("#txtOggettoMessaggio").val(home.ASSISTITO.NOME_COMPLETO);
				}
			}
		},
		
		save:function(){
			
			switch(CENTRO_MESSAGGI.vAction){
			
				case "NUOVO":
				case "INOLTRO":
					CENTRO_MESSAGGI.saveNuovo();
					break;
					
				case "RISPOSTA":
					CENTRO_MESSAGGI.saveRisposta();
					break;
					
				default:
					break;
			}
		},
		
		saveNuovo:function(param){
			
			var vIdArgomento = $("#h-radCollegamentoPaziente").val() == 'S' ? home.ASSISTITO.COD_FISC : '';
			var vTipoDiscussione = $("#h-radCollegamentoPaziente").val() == 'S' ? 'MSG_ANAG' : 'CHAT';
			var vPriorita = $("#h-radPriorita").val();
			var vOggettoMsg = $("#txtOggettoMessaggio").val() != '' ? $("#txtOggettoMessaggio").val() : "Messaggio dall'utente "+home.baseUser.DESCRIZIONE;
			var vDestinatari = "";
			var destinatari_ambulatorio = "";
			
			$("#ComboOutUser").find("option").each(function(){
				
				var destinatario = $(this).val();
				
				if (vDestinatari.length == 0) {
					vDestinatari = destinatario;
				} else {
					vDestinatari += "," + $(this).val();
				}
				
				if (destinatario.indexOf("@AMB") > 0) {
					if (destinatari_ambulatorio.length == 0) {
						destinatari_ambulatorio = destinatario.split("@")[0];
					} else {
						destinatari_ambulatorio += "," + $(this).val();
					}
				}
			});
			
			if (vDestinatari == "") {
				home.NOTIFICA.warning({
					title: "Impossibile inviare",
					message: "Aggiungere almeno un destinatario"
				});
				return;
			}
			
			var vParameters = {
					c_messaggio 		: { v : tinyMCE.activeEditor.getContent({format : 'text'}), t : 'V'}, /*da controllare */
					c_messaggio_html 	: { v : tinyMCE.activeEditor.getContent(), t : 'V'}, /*da controllare */
			        v_mittente 			: { v : home.baseUser.USERNAME, t : 'V'},
			        v_mittente_sito		: { v : "MMG", t : 'V'},
		        	v_destinatari 		: { v : vDestinatari, t : 'V'}, /* da controllare username@sito,username@sito,username@sito */
			        v_titolo 			: { v : vOggettoMsg, t : 'V'}, /*da controllare */
			        v_tipo_discussione 	: { v : vTipoDiscussione, t : 'V'}, /* da controllare CHAT, MSG_ANAG */
			        v_id_argomento 		: { v : vIdArgomento, t : 'V'}, /* dipende dal tipo discussione, se MSG_ANAG metto iden_anag pz */ 
			        n_priorita 			: { v : vPriorita, t : 'N'},
					p_result 			: { t : 'V', d: 'O'},
					n_iden_messaggio 	: { t : 'N', d: 'O'}
			};
			
			$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_procedure({
				
				id : 'UTILITY_MESSAGGI.NUOVO',
				datasource : 'CONFIG_WEB',
				parameter : vParameters
			
			}).done(function(response) {
				
				/*da togliere dopo demo*/
				$("#icon-spin3").trigger("click");
				
				CENTRO_MESSAGGI.notificaAmbulatorio(response.n_iden_messaggio, destinatari_ambulatorio);
				CENTRO_MESSAGGI.resetPaginaMessaggio();
				CENTRO_MESSAGGI.tornaAllaLista();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.saveNuovo: ' + errorThrown);
			});
		},
		
		notificaAmbulatorio: function(n_iden_messaggio, v_utenti) {
			if (v_utenti != "") {
				$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_procedure({

					id : 'PCK_AMBULATORIO.GET_DATI_CREANOTIFICA',
					datasource : 'CONFIG_WEB',
					parameter : {
						n_iden_messaggio: { v : n_iden_messaggio, t : 'N'},
						v_utenti		: { v : v_utenti, t : 'V'},
						c_xml 			: { t : 'C', d: 'O'},
						v_destinatari 	: { t : 'V', d: 'O'}
					}
				}).done(function(response) {
					$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_procedure({
						id : 'PCK_NOTIFICHE.CREANOTIFICA',
						datasource : 'AMBULATORIO',
						parameter : {
							vXML			: { v : response.c_xml, t : 'C'},
							vCodDecTarget	: { v : response.v_destinatari, t : 'V'}
						}
					}).done(function(response) {
						home.NOTIFICA.info({
							title: "Invio riuscito",
							message: "Messaggio recapitato agli utenti dell'ambulatorio"
						});
					});
				});
			}
		},
		
		resetPaginaMessaggio: function() {
			
			//svuoto oggetto e testo del messaggio
			$("#txtOggettoMessaggio").val("");
			tinyMCE.activeEditor.setContent('');
			
			//riabilito, nel caso fossero disabled, i listbox della pagina del messaggio, svuoto i destinatari
			$("#ComboOutUser").attr("disabled", false);
 			$("#ComboInUser").attr("disabled", false);
 			$("#ComboOutUser").empty();
 			
 			//mostro i pulsanti di gestione delle liste destinatari
 			$(".exchangeList button").show();
 			
 			//mostro la rucerca utente
 			$("#fldRicercaUtenti").show();
 			
 			//riabilito la scelta dell'associazione del messaggio al paziente (non visibile in alcuni casi)
			$("#radCollegamentoPaziente").data("RadioBox").enable();
			
		},
		
		tornaAllaLista: function() {
			$("#li-tabMessaggi").trigger("click");
			CENTRO_MESSAGGI.loadWk();
		},
		
		saveRisposta:function(param){
			var destinatari_ambulatorio = "";
			$("#ComboOutUser").find("option").each(function(){
				var destinatario = $(this).val();
				if (destinatario.indexOf("@AMB") > 0) {
					if (destinatari_ambulatorio.length == 0) {
						destinatari_ambulatorio = destinatario.split("@")[0];
					} else {
						destinatari_ambulatorio += "," + $(this).val();
					}
				}
			});
		  		
			var vParameters = {
					c_messaggio 		: { v : tinyMCE.activeEditor.getContent({format : 'text'}), t : 'V'}, /*da controllare */
					c_messaggio_html 	: { v : tinyMCE.activeEditor.getContent(), t : 'V'}, /*da controllare */
			        v_mittente 			: { v : home.baseUser.USERNAME, t : 'V'},
			        v_mittente_sito		: { v : home.NS_FENIX_TOP.sito, t : 'V'},
		        	n_iden_discussione	: { v : CENTRO_MESSAGGI.IDEN_DISCUSSIONE, t : 'N'}, /* è il campo iden_discussione che raggruppa i messaggi di una stessa discussione */
			        n_priorita 			: { v : 0, t : 'N'},
			        v_titolo			: { v : $("#txtOggettoMessaggio").val(), t : 'V'},
					p_result 			: { t : 'V', d: 'O'},
					n_iden_messaggio 	: { t : 'N', d: 'O'}
			};
			
			$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_procedure({
				id : 'UTILITY_MESSAGGI.RISPONDI',
				datasource : 'CONFIG_WEB',
				parameter : vParameters
			}).done(function(response) {
				
				/*da togliere dopo demo*/
				$("#icon-spin3").trigger("click");
				
				CENTRO_MESSAGGI.notificaAmbulatorio(response.n_iden_messaggio, destinatari_ambulatorio);
				CENTRO_MESSAGGI.resetPaginaMessaggio();
				CENTRO_MESSAGGI.tornaAllaLista();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.saveRisposta: ' + errorThrown);
			});
		},
				
		setInoltro:function(riga){
			
			CENTRO_MESSAGGI.vAction = 'INOLTRO';
			CENTRO_MESSAGGI.IDEN_DISCUSSIONE = null;
			
			var testo_inoltrato  = '<br><br><br><div '+ CENTRO_MESSAGGI.styleMsg +' >************************   ' + traduzione.lblTestoRisposta + ' ' + riga.MITTENTE + '   ************************';
			testo_inoltrato		+= '<div '+CENTRO_MESSAGGI.styleMsg+' >';
			testo_inoltrato		+= riga.MESSAGGIO_HTML;
			testo_inoltrato		+= '</div>';
			tinyMCE.activeEditor.setContent(testo_inoltrato);
			tinyMCE.activeEditor.focus();
			var oggetto;
			if (LIB.isValid(riga.TITOLO)) {
				oggetto = riga.TITOLO;
			} else {
				oggetto = "";
			}
			
			if (oggetto.indexOf("Fwd:") != 0 && oggetto.indexOf("Fw:") != 0) {
				oggetto = "Fw: " + oggetto;
			}
			
			$("#txtOggettoMessaggio").val(oggetto);
			$("#radCollegamentoPaziente").data("RadioBox").enable();
		},
		
		setHeight : function() {

			$('#testoMsg').css({
				'height' : CENTRO_MESSAGGI.getTextHeight() - 90
			});
			
			$("#fldVisualizzazione").css({
				'height': $('.contentTabs').outerHeight(true)-20
			});
			
			$('#fldListaMessaggi').css({
				'height' : CENTRO_MESSAGGI.getListHeight() - 30
			});
		},
		
		setRisposta: function(riga){

			CENTRO_MESSAGGI.vAction = 'RISPOSTA';
			CENTRO_MESSAGGI.IDEN_DISCUSSIONE = riga.IDEN_DISCUSSIONE;
			
			var testo_messaggio  = '<br><br><br><div ' + CENTRO_MESSAGGI.styleMsg + ' >************************   ' + traduzione.lblTestoRisposta + ' ' + riga.MITTENTE + '    ************************</div>'
			testo_messaggio		+= '<div '+CENTRO_MESSAGGI.styleMsg+' >';
			testo_messaggio		+= riga.MESSAGGIO_HTML;
			testo_messaggio		+= '</div>';
			
 			tinyMCE.activeEditor.setContent(testo_messaggio);
 			tinyMCE.activeEditor.focus();
 			
			var oggetto;
			if (LIB.isValid(riga.TITOLO)) {
				oggetto = riga.TITOLO;
			} else {
				oggetto = "";
			}
			
			if (oggetto.indexOf("Re:") != 0 && oggetto.indexOf("R:") != 0) {
				oggetto = "Re: " + oggetto;
			}
			
 			$("#txtOggettoMessaggio").val(oggetto);
 			$("#ComboOutUser").attr("disabled", true);
 			$("#ComboInUser").attr("disabled", true);
 			$(".exchangeList button, #fldRicercaUtenti").hide();
			$("#radCollegamentoPaziente").data("RadioBox").disable();
		},
		
		worklist:{
			
			cancella: function(riga) {
				
				if (riga.MITTENTE == home.baseUser.USERNAME && riga.MITTENTE_SITO == home.NS_FENIX_TOP.sito) {
					
					home.NS_MMG.confirm(traduzione.lblConfirmCancella, function()  {
					
						$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_function({
							id : 'UTILITY_MESSAGGI.CANCELLA',
							datasource: 'CONFIG_WEB',
							parameter : {
								v_utente : {v: home.baseUser.USERNAME, t: 'V'},
								v_utente_sito : {v: home.NS_FENIX_TOP.sito, t: 'V'},
								n_iden_messaggio : {v: riga.IDEN, t: 'N'}
							}
						}).done(function(response) {
							CENTRO_MESSAGGI.loadWk();
						}).fail(function(jqXHR, textStatus, errorThrown) {
							CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.worklist.cancella: ' + errorThrown);
							home.NOTIFICA.error({
								title: "Errore",
								messaggio: "Impossibile cancellare il messaggio"
							});
						});
						
					});
					
				} else {
					home.NOTIFICA.warning({
						title: "Impossibile cancellare",
						message: "Messaggio inviato da un altro utente"
					});
				}
			},
			
			creaNota:function(){

				var vMittente = $("a#mittente").html(); 
				
				var vMsg = 'Nota creata dal messaggio di '+vMittente+': ' + $("#testoMsg").html();
				
				var vParameters = {
					'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
					'PIDENSCHEDA' 		: { v : null, t : 'N'},
					'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
					'PIDENPROBLEMA' 	: { v : null, t : 'N'},
					'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					'P_DATA' 			: { v : moment().format('YYYYMMDD'), t : 'V'},
					'P_ACTION' 			: { v : 'INS', t : 'V'},
					'P_IDEN_NOTA'		: { v : null, t : 'N'},
					'V_OSCURATO'		: { v : 'N', t : 'V'},
					'P_NOTEDIARIO' 		: { v : vMsg, t : 'C'},
					'P_TIPO' 			: { v : 'NOTE', t : 'V'},
					'p_sito' 			: { v : 'MMG', t : 'V'},
					"V_RETURN_DIARIO"	: {	t : 'V', d: 'O'}
				};
				
				home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
					id:'SP_NOTE_DIARIO',
					parameter: vParameters
				}).done( function() {
					home.NS_MMG.apri( 'RIEPILOGO', '', {fullscreen:false} );
				});
			},
			
			showMessaggio: function(riga) {
								
				CENTRO_MESSAGGI.gestione_visualizzazione.showHideAnteprima();
				CENTRO_MESSAGGI.gestione_visualizzazione.setIntestazione(riga);
				CENTRO_MESSAGGI.gestione_visualizzazione.setIcone(riga);
				CENTRO_MESSAGGI.gestione_visualizzazione.setMessaggio(riga);
			},
			
			rispondi:function(riga){
				CENTRO_MESSAGGI.apriTabInvio('RISPOSTA', riga )
			},
			
			nuovo_messaggio:function(riga){
				CENTRO_MESSAGGI.apriTabInvio('INVIO', riga )
			},
			
			inoltra:function(riga){
				CENTRO_MESSAGGI.apriTabInvio('INOLTRO', riga )
			},
			
			setLetto:function(riga, obj) {
				
				if (riga.DA_LEGGERE == "S") {
					if(typeof obj == 'undefined'){
						obj = $("tr[data-iden="+riga.IDEN+"]");
					}
					var ultimo_letto = riga.IDEN;

					$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_function({
						id : 'UTILITY_MESSAGGI.LEGGI',
						datasource: 'CONFIG_WEB',
						parameter : {
							v_utente 			: {v: home.baseUser.USERNAME, t: 'V'},
							v_utente_sito 		: {v: home.NS_FENIX_TOP.sito, t: 'V'},
							n_iden_discussione 	: {v: riga.IDEN_DISCUSSIONE, t: 'N'},
							n_ultimo_letto 		: {v: ultimo_letto, t: 'N'}
						}
					}).done(function(response) {
						obj.find('#divStatoLettura i').hide();
						home.NS_MESSAGGI.getCountMessaggi();
					}).fail(function(jqXHR, textStatus, errorThrown) {
						CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.worklist.setLetto: ' + errorThrown);
					});
				}
			},
			
			setDaLeggere: function(riga) {
				
				var ultimo_letto = parseInt(riga.IDEN) - 1;

				$.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).call_function({
					id : 'UTILITY_MESSAGGI.LEGGI',
					datasource: 'CONFIG_WEB',
					parameter : {
						v_utente 			: {v: home.baseUser.USERNAME, t: 'V'},
						v_utente_sito 		: {v: home.NS_FENIX_TOP.sito, t: 'V'},
						n_iden_discussione 	: {v: riga.IDEN_DISCUSSIONE, t: 'N'},
						n_ultimo_letto 		: {v: ultimo_letto, t: 'N'}
					}
				}).done(function(response) {
					obj.find('#divStatoLettura i').show();
					home.NS_MESSAGGI.getCountMessaggi();
				}).fail(function(jqXHR, textStatus, errorThrown) {
					CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.worklist.setDaLeggere: ' + errorThrown);
				});
			}
		},
		
		gestione_visualizzazione:{
			
			setIntestazione:function(riga){
				
				var vMittente = riga.MITTENTE_DESCR_USERNAME;
				var vDestinatari = '';
				var vDataMsg = riga.DATA;
				var vOggetto;
				if (LIB.isValid(riga.TITOLO)) {
					vOggetto = riga.TITOLO;
				} else {
					vOggetto = "";
				}
				
				var arrayDestinatari = riga.DESTINATARI.split(",");
				
				$(arrayDestinatari).each(function(){
					//username@sito|descrizione
					var vSplit1 = $(this)[0].split('@');
					var vSplit2 = vSplit1[1].split('|');
					if (vSplit1[0] != riga.MITTENTE) {
						if(vDestinatari != ''){
							vDestinatari += ', ';
						}
						vDestinatari += vSplit2[1]+' ('+ vSplit1[0]+')';
					}
				});
				
				
				$("#intestazione").remove();

				var int =  '<div id = "intestazione" >';
				int 	+= '<div id="divDataMsg" class="borderBottom"><a id="IntDataMsg" class="IntGrassetto">Data: </a><a id="dataMsg">' + vDataMsg + '</a></div>';
				int		+= '<div id="divMittente" class="borderBottom"><a id="IntMittente" class="IntGrassetto">Mittente: </a><a id="mittente">'+ vMittente + '</a></div>';
				int		+= '<div id="divDestinatari" class="borderBottom"><a id="IntDestinatari" class="IntGrassetto">Destinatari: </a><a id="destinatari">'+ vDestinatari + '</a></div>';
				int 	+= '<div id="divOggetto"><a id="IntOggetto" class="IntGrassetto">Oggetto: </a><a id="oggetto">' + vOggetto + '</a></div></div>'; 
				
				$("div#divMsg").append(int);
			},
			
			setIcone:function(riga){

				$("#divIcone").remove();

				var action = '<div id="divIcone">';
				if(riga.MITTENTE == home.baseUser.USERNAME){
					action += '<i class="icon-trash" id="iconCancella" title="Cancella messaggio"></i>';
				}
				action += '<i class="icon-reply" id="iconRispondi" title="Rispondi"></i>';
				action += '<i class="icon-forward" id="iconInoltra" title="Inoltra"></i>';
				
				if($("#IDEN_ANAG").val() != '') {			
					action += '<i class="icon-export" id="iconCreaNota" title="Crea Nota"></i>';
				}
				
				action += '</div>';

				$("div#divAction").append(action);
				
				$("#divIcone").height($("#divAction").outerHeight(true) - 4);
				
				CENTRO_MESSAGGI.setEventsIcons(riga);
			},
			
			setMessaggio:function( riga ){
				$("#testoMsg").html(riga.MESSAGGIO_HTML);
			},
			
			showHideAnteprima:function(pType){
				
				if(pType == 'HIDE'){
					$("#fldVisualizzazione").css("visibility", "hidden");
				}else{
					$("#fldVisualizzazione").css("visibility", "visible");
				}
			}
		},
		
		filtri:{

			checkDuplicates : function() {
				var comboIn = $('#ComboInUser'), comboOut = $('#ComboOutUser');

				comboOut.find('option').each(function() {
					comboIn.find('option[value=\'' + $(this).attr('value') + '\']').remove();
				});
			},
			
			loadUsers : function() {
				
				var tipoUtente = '';
				
				if($("#h-radTipoUtente").val() == 'OTH'){
					tipoUtente = 'MMG,AMB,CC';
				}else{
					tipoUtente = $("#radTipoUtente").data("RadioBox").val();
				}
				
				$('#ComboInUser').empty();
				
				var vParameters = {
					'userName' 		: $("#txtRicercaUtenti").val().toUpperCase(),
					'tipo_utente'	: tipoUtente,
					'value'			: null
				};
				
				var promise = $.NS_DB.getTool({_logger : CENTRO_MESSAGGI.logger}).select({
					
					id : 'MMG_DATI.PANNELLO_NOTIFICHE_UTENTI_ALL',
					parameter : vParameters
				
				}).done(function(response) {
					
					
					if (typeof response.result != 'undefined') {
						
						var length = response.result.length;
						var option = $(document.createElement('option'));
						
						for (var i = 0; i < length; i++) {
							option.clone().attr('value', response.result[i].VALUE).text(response.result[i].DESCR).appendTo('#ComboInUser'); //+ '@' + response.result[i].TIPO_UTENTE
						}
						//CENTRO_MESSAGGI.filtri.checkDuplicates();
						if ($("button#butFiltraOnline.selected").length > 0) {
							CENTRO_MESSAGGI.filtri.filtraOnline();
						}
					}
				
				}).fail(function(jqXHR, textStatus, errorThrown) {
					
					CENTRO_MESSAGGI.logger.error('Errore CENTRO_MESSAGGI.filtri.loadUsers: ' + errorThrown);
				});
				return promise;
			},
			
			filtraOnline: function() {
				home.dwrBaseFactory.getActiveUsers(function(active_users) {
					$("select#ComboInUser option").each(function() {
						var option = $(this);
						var val = option.val();
						if ($.inArray(val.substring(0,val.indexOf("@")),active_users) < 0) {
							option.hide();
						}
					});
				});
			},
			
			rimuoviFiltroOnline: function() {
				$("select#ComboInUser option").show();
			}
		}
};

