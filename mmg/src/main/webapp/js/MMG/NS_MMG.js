var NS_MMG = {
		
		apriPagina: function( key_legame, parameters, data ) {
			NS_MMG.open( key_legame, '', parameters, data );
		},
		
		apri: function( key_legame, url_extra, parameters, data ) {
			NS_MMG.open( key_legame, ( url_extra || '' ) + NS_MMG.getCommonParameters(), parameters, data );
		},
		
		open: function( key_legame, url_extra, parameters, data ) {	
			
			var url			= 'page?KEY_LEGAME=' + key_legame;
			var defaults	= { url : url + ( url_extra || '' ) , fullscreen : true, showloading : true };
				
			if( NS_MMG.beforeOpen( key_legame, data ) ) {
				
				home.NS_LOADING.showLoading();
				
				parameters = $.extend( defaults, parameters );
				
				home.NS_FENIX_TOP.apriPagina( parameters );
				
				NS_MMG.afterOpen();
			}
			
		},
                
		objPrivacy: {
			'CONSENSO_DATI'				: traduzione.lblConsensoDatiNegato,
			'SOSTITUTO'					: traduzione.lblSostitutoNegato,
			'ASSOCIATI'					: traduzione.lblAssociatiNegato,
			'COLLABORATORI'				: traduzione.lblCollaboratoriNegato,
			'CONSENSO_PERSONALE_ASL'	: traduzione.lblConsensoPersASLNegato,
			'SPECIALISTA'				: traduzione.lblSpecialistaNegato,
			'CONSENSO_COMUNICAZIONE'	: traduzione.lblConsensoComunicazioneNegato,
			'CONSENSO_DATI_SENSIBILI'	: traduzione.lblConsensoDatiSensibiliNegato,
			'VISIONE_DATI_ASL'			: traduzione.lblConsensoVisioneDatiAslNegato
		},

		apriDettaglioPrivacyMMG:function(){
			
			var msg = '<div id="dialogDettaglioConsensoMMG" class = "consensoMMG" style="overflow:auto; height:100%" >'
			msg += '<a>'+traduzione.lblCatConsensoNegato+'</a>';
			
			riga='';
			
			var permessiNegati = home.PERMESSI.getPermessiNegati();
			
			$(permessiNegati).each(function(i,v){
				riga += '<br><li><i class="icon-cancel" style="font-size:14px;color:red"></i><a>' + NS_MMG.objPrivacy[v] + '</a></li><br>';
			});
			
			msg += riga + '</div>';
			
			var modulo_consenso = LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2"); 
			
			home.$.dialog(msg, {
				'title'				: traduzione.lblDettaglioConsenso,
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'movable' 			: true,
				'width'				: '50%',
				'height'			: "500px",
				'buttons' 			: [
						{
							label : traduzione.butConsenso,
							action : function() {
								home.NS_MMG.apriModuloConsenso(home.ASSISTITO.IDEN_ANAG, modulo_consenso, undefined, home.ASSISTITO.IDEN_MED_BASE );
								home.$.dialog.hide();
							}
						},
						{
							label : traduzione.butChiudi,
							action : function() {
								home.$.dialog.hide();
							}
						}]
			});
		},
		
		//in attesa del consenso generale dell'ASL2, questa funzione non viene utilizzata
		apriDettaglioPrivacy:function(idenAnag){
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
            
				id: 'SDJ.Q_PRIVACY',
	            parameter: {iden_anag :{ v : idenAnag, t : 'N'}}

			}).done( function(resp) {
				
				var riga = '', locuzione = '', avverbio = '';
				var msg = $('<div style="overflow:auto; height:100%" ></div>');
				var xml = resp.result[0].PRIVACY;
				
				
				//ciclo l'xml e vado a formare l'html del dialog
				$(xml).find("flag").each(function () {
					
					var descrizione = $(this).text();
					scelta = $(this).attr("value") == 'S' ? 'SI' : 'NO';
					icona = $(this).attr("value") == 'S' ? '<i class="icon-ok" style = "color:green"></i>' : '<i class="icon-cancel-1" style = "color:red"></i>';
					avverbio = $(this).attr("value") == 'S' ? '' : 'NON';
					
					riga += '<li><a style="font-weight:700"><strong> ' + $(this).attr("key") + ' - ' /*+ avverbio*/;
					riga += descrizione + '</a> ' ;
					riga += '<br>';
					riga += traduzione.lblScelta + ' ' + '<a style="font-weight:700">'+scelta + ' ' + icona;
					riga += '</a><br><br>';
					
					msg.html(riga)
					
					home.$.dialog(msg, {
						'title' 			: traduzione.lblPrivacyASL,
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'movable'			: true,
						'width'				: '50%',
						'height'			: "500px",
						'buttons' 			: [
								{
									label : traduzione.butPortale,
									action : function() {
										home.NS_MMG.callPrivacyPortal('INSERISCI', home.ASSISTITO.IDEN_ANAG );
										home.$.dialog.hide();
									}
								},
								{
									label : traduzione.butChiudi,
									action : function() {
										home.$.dialog.hide();
									}
								}]
					});
				});
			});
		},
		
		/**funzione per visualizzare i documenti del paziente su fenix_PIC o in locale**/
		apriDocumentiPaziente: function ( data ) {

			if( home.LIB.getParamUserGlobal( 'DOCUMENTI_PAZIENTE_VISUALIZZATORE', 'LOCALE' ) == 'PIC' ){
			
				if( NS_MMG.beforeOpen( 'DOCUMENTI_PAZIENTE', data ) ){
					var vNome 		= '';
					var vCognome 	= '';
					var vComNascita = '';
					var vSesso 		= '';
					var vDataNasc 	= '';
					var vCodFisc 	= (typeof (data.COD_FISC)  != 'undefined' && data.COD_FISC  != '')? data.COD_FISC  : home.ASSISTITO.COD_FISC;
					var vIdenAnag 	= (typeof (data.IDEN_ANAG) != 'undefined' && data.IDEN_ANAG != '')? data.IDEN_ANAG : home.ASSISTITO.IDEN_ANAG;
					var vIdRemoto 	= (typeof (data.ID_REMOTO) != 'undefined' && data.ID_REMOTO != '')? data.ID_REMOTO : home.ASSISTITO.ID_REMOTO;
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
						id:'SDJ.Q_NOME_COGNOME_PAZIENTE',
						parameter:
						{
							iden_anag		: { v : vIdenAnag, t : 'N'}
						}
					}).done( function(resp) {
						vNome 		= resp.result[0].NOME;
						vCognome 	= resp.result[0].COGN;
						vComNascita = resp.result[0].COM_NASC;
						vSesso 		= resp.result[0].SESSO;
						vDataNasc 	= resp.result[0].DATA;
					
					var url = home.baseGlobal.URL_PIC;
					url += 'username=' + home.baseUser.USERNAME + '&';
					url += 'nomeHost=' + home.basePC.IP + '&';
					url += 'scheda=DOCUMENTI_PAZIENTE%' + '26SITO%3DPIC%' + '26ASSIGNING_AUTHORITY%3DWHALE%';
					url += '26CODICE_FISCALE%' + '3D' + vCodFisc + '%';
					url += '26COGNOME%' + '3D' + vCognome + '%';
					url += '26COM_NASC%' + '3D' + vComNascita + '%';
					url += '26DATA_NASCITA%' + '3D' + vDataNasc + '%';
					url += '26EMERGENZA_MEDICA%3Dfalse%';
					url += '26ID_REMOTO%' + '3D' + vIdRemoto + '%';
					url += '26NOME%' + '3D' + vNome + '%';
					url += '26ANAGRAFICA%' + '3D' + vIdenAnag + '%';
					url += '26SESSO%' + '3D' + vSesso;

					window.open( url );
					});
				}
			}else{
				NS_MMG.apri( 'DOCUMENTI_PAZIENTE' );
			}
		},
		
		apriModuloConsenso:function(idenAnag, consenso, iden, iden_med_base) {
			
			/* 08/01/2015 lucas: modificata per aprire sempre l'ultimo modulo consenso in vigore, ma prendendo anche iden di moduli prededenti, in modo da poter importare i dati sul modulo nuovo */
			
			var idenAnag_in = typeof idenAnag != 'undefined' ? idenAnag : home.ASSISTITO.IDEN_ANAG;
			var modulo_consenso = LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2"); 
			var iden_consenso = typeof iden != 'undefined' ? iden : '';
			var iden_med_base_in = typeof iden_med_base != 'undefined' ? iden_med_base : home.ASSISTITO.IDEN_MED_BASE;
			var consenso_relativo = typeof consenso != 'undefined' ? consenso : '';
			
			//se ho l'iden lo apro con quello, altrimenti lo vado a rintracciare
			if(typeof iden != 'undefined' && iden != '') {
				
				var urlAgg = "&IDEN="+iden_consenso+"&IDEN_ANAG="+idenAnag_in+"&IDEN_MED_BASE_OK="+iden_med_base_in+"&CONSENSO_RELATIVO="+consenso_relativo;
				NS_MMG.apri(modulo_consenso, urlAgg, {}, iden_med_base_in);
			
			} else {
				
				home.$.NS_DB.getTool({_logger : home.logger}).select({
					id:'SDJ.Q_INFO_CONSENSO_MMG',
					parameter: {
						iden_anag		: { v : idenAnag_in, t : 'N'}
					}
				}).done( function(resp) {
					try {
						iden_consenso = typeof resp.result[0].IDEN == 'undefined'  ? '' : resp.result[0].IDEN;
						consenso_relativo = typeof resp.result[0].CONSENSO == 'undefined'  ? '' : resp.result[0].CONSENSO;
					} catch (e) {
						iden_consenso = "";
					}
					
					var urlAgg = "&IDEN="+iden_consenso+"&IDEN_ANAG="+idenAnag_in+"&IDEN_MED_BASE_OK="+iden_med_base_in+"&CONSENSO_RELATIVO="+consenso_relativo;
					NS_MMG.apri(modulo_consenso, urlAgg, {}, iden_med_base_in);
				});
			}
		},
		
		apriPatientSummary: function(){
			
			if(MMG_CHECK.checkFunctionAccesso()){
				if(home.ASSISTITO.isMioAssistito() || home.MMG_CHECK.isAdministrator()){
					NS_MMG.apri( 'MMG_PATIENT_SUMMARY&STATO=MOD' );
				}else{
					home.NS_PRINT.print({
						path_report	: "PATIENT_SUMMARY_PRIVACY_V2.RPT",
						prompts		: {
							pIdenAnag:home.ASSISTITO.IDEN_ANAG,
							pIdenPer: home.baseUser.IDEN_PER,
							pProvenienza: "MMG"
						},
						show		: 'S',
						output		: 'pdf'
					});
				}
			}
		},
		
		afterOpen: function() {
			home.NS_LOADING.hideLoading();
			return true;
		},

		apriCartella : function( pIdenAnag, pRegime, callback ) {
			
			NS_FENIX_TOP.chiudiTutte();
			$("#statDx .scheda-min").remove();
			
			NS_OBJECT_MANAGER.init( pIdenAnag , function() {
				
				MAIN_PAGE.setPatientInfo();
				
				MAIN_PAGE.toggleMenu();
				
				if( !NS_MMG.MOBILE.isMobile() )
					NS_MMG.apri( 'RIEPILOGO', '', { fullscreen : false } );
				else
					NS_MMG.apri( 'RIEPILOGO_MOBILE', '', { fullscreen : false } );
									
				CARTELLA.setRegime(pRegime);
				
				if (typeof callback === 'function') 
					callback();
				
			});
			CARTELLA.active = true;
			
		},
		
		apriUrl: function( url, parameters, pCase, data ) {
			
			NS_MMG.openUrl( url, parameters, pCase, data );
		},
		
		apriModuloConsensoAvviso:function(){
			NS_MMG.apriModuloConsenso(home.ASSISTITO.IDEN_ANAG, LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2"),undefined,home.ASSISTITO.IDEN_MED_BASE);
		},
		
		avvisoPermessiPrivacy:function(){
			
			//aggiungo il link 'Vai al modulo'
			var msg_link = '<br><a style = "float:right; position: relative; bottom:0px; font-weight:bold;" href="#" onclick="javascript:NS_MMG.apriModuloConsensoAvviso();$(\'.ambiance-close\').trigger(\'click\');">'+traduzione.butConsenso+'</a>';
			var div = '<div><a>'+ traduzione.msgConsensoNonRecepito + '</a>'+msg_link+'</div>';
			
			//controllo se il modulo è stato recepito o meno
			if(home.NS_MMG.checkRecepimentoConsenso() == 'X'){
				
				home.NOTIFICA.warning({
					'message'	: div,
					'title'		: traduzione.msgTitleConsensoNonRecepito,
					'timeout'	: parseInt(LIB.getParamUserGlobal("PRIVACY_PERSISTENZA_AVVISO", "15"))
				});
			}
			
			var permessiNegati = home.PERMESSI.getPermessiNegati();
			
			if(permessiNegati.length>0){
				
				var msg = traduzione.lblCatConsensoNegato;
				
				riga='';
				
				$(permessiNegati).each(function(i,v){
					
					riga += '<br><br> - '+ NS_MMG.objPrivacy[v];
				});
				
				msg += riga;
				
				home.NOTIFICA.warning({
					title	: traduzione.lblDettaglioConsenso,
					message	: msg + msg_link,
					timeout	: parseInt(LIB.getParamUserGlobal("PRIVACY_PERSISTENZA_AVVISO", "15"))
				});
			}
		},
		
		beforeOpen: function( pagina, data ) {
			return home.MMG_CHECK.check( pagina, data );
		},
		
		callPrivacyPortal:function(vAction, vIdenAnag){
			
			var objDati = { username:home.baseUser.USERNAME, 
				nomeHost:			home.basePC.IP, 
				url: 				'/page?KEY_LEGAME=MAIN_PAGE',
				key_scheda: 		'CONSENSO_UNICO',
				assigning_authority:'MMG',
				action:				vAction,
				iden_anag:			vIdenAnag
			};
			
			//CONTROLLO di essere all'interno della cartella dell'assistito
			if(typeof home.ASSISTITO.IDEN_ANAG != 'undefined' && home.ASSISTITO.IDEN_ANAG == null){
				
				objDati.cognome   		= home.ASSISTITO.COGNOME;
				objDati.nome 	  	 	= home.ASSISTITO.NOME;
				objDati.data_nascita 	= home.ASSISTITO.DATA_NASCITA_ISO;
				objDati.sesso		 	= home.ASSISTITO.SESSO;
				objDati.codice_fiscale  = home.ASSISTITO.COD_FISC;
				objDati.com_nasc		= home.ASSISTITO.COM_NASC;
				objDati.com_res			= home.ASSISTITO.COM_RES;
			
				NS_MMG.creaUrlPortale(objDati);
				
			}else{
				
				home.$.NS_DB.getTool({_logger : home.logger}).select({
		            
					id: 'SDJ.Q_SCHEDA_ANAGRAFICA',
		            parameter: {iden :{ v : vIdenAnag, t : 'N'}}

					}).done( function(resp) {
						//alert(resp.result[0].COGN);
						objDati.cognome   		= resp.result[0].COGN;
						objDati.nome 	  	 	= resp.result[0].NOME;
						objDati.data_nascita 	= resp.result[0].DATA;
						objDati.sesso		 	= resp.result[0].SESSO;
						objDati.codice_fiscale  = resp.result[0].COD_FISC;
						objDati.com_nasc		= resp.result[0].COM_NASC;
						objDati.com_res			= resp.result[0].COM_RES;
						
						NS_MMG.creaUrlPortale(objDati);
					});
			}
		},
		
		//funzione che richiama la servlet showDocumentoAllegato con i tre parametri che si attende
		caricaDocumento:function(pIden, pQuery, pDatasource){
			
			var params = {
				"URL": top.NS_FENIX_TOP.getAbsolutePathServer() + 
				'showDocumentoAllegato' +
				';jsessionid=' + $("#AppStampa param[name=session_id]").val() +
				'?IDEN=' + pIden
			};
			
			if (LIB.isValid(pQuery) && pQuery != "") {
				params.URL += "&QUERY=" + pQuery;
			}
			
			if (LIB.isValid(pDatasource) && pDatasource != "") {
				params.URL += "&DATASOURCE=" + pDatasource;
			}
			
			home.NS_FENIX_PRINT.caricaDocumento(params);
		},

		checkAccesso: function(){
			
			var vIdenMedico = (home.ASSISTITO.IDEN_MED_PRESCR == '' || home.ASSISTITO.IDEN_MED_PRESCR == null) ? home.baseUser.IDEN_PER : home.ASSISTITO.IDEN_MED_PRESCR;
			var param = {
					"p_iden_utente" 			: { v : home.baseUser.IDEN_PER, t : 'V'},
					"p_iden_anag" 				: { v : home.ASSISTITO.IDEN_ANAG, t : 'V'},
					"p_iden_med"	 			: { v : parseInt(vIdenMedico), t : 'V' },
					'p_note'					: { v : 'Accesso inserito automaticamente dal sistema prima di una prescrizione', t : 'V' },
					"p_cod_accesso"	 			: { v : '', t : 'V' },
					"p_cod_regime"	 			: { v : CARTELLA.REGIME, t : 'V' },
					"p_indirizzo_accesso"	 	: { v : '', t : 'V' },
					"p_operatore_accesso"	 	: { v : '', t : 'V' },
					"p_result"	 				: { t : 'V', d : 'O'}
				};
			
			if(!LIB.isValid(ASSISTITO.IDEN_ACCESSO) || ASSISTITO.IDEN_ACCESSO == "") {

				return home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
				
					id:'SP_GET_ACCESSO',
					parameter:param
				
				}).done( function(jqXHR, textStatus, errorThrown) {
					
					//alert(jqXHR);
					home.ASSISTITO.IDEN_ACCESSO = jqXHR.p_result;
				
				}).fail(function(jqXHR, textStatus, errorThrown){
					//alert(jqXHR);
					home.logger.warn('Errore nel salvataggio dell\'accesso: '+errorThrown);
				});
				
			} else {
				return $.Deferred().resolve();
			}
		},
		
		checkPromemoriaBacheca: function(){
			
			var paziente_semaforo = $.Deferred();
			var utente_semaforo = $.Deferred();
			var oggi_semaforo = $.Deferred();
			var paziente_count = 0;
			var utente_count = 0;
			var oggi_count = 0;
			var title = 'Promemoria importante';
			var timeout = LIB.getParamUserGlobal('ALLERGIE_PERSISTENZA_AVVISO',0);
			
			paziente_semaforo = $.NS_DB.getTool({_logger : home.logger}).select({
				id: 'MMG_DATI.BACHECA_PAZIENTE',
	            parameter: {
					'iden_anagrafica': {v: home.ASSISTITO.IDEN_ANAG, t: 'N'},
					'iden_personale' : {v: home.baseUser.IDEN_PER, t: 'N'},
					'oggi' : {v: moment().format('YYYYMMDD'), t: 'V' }
				}
			}).done( function(resp) {
				var response = resp.result;
				for( var i = 0; i < response.length; i++ ) {		
					if( response[i]['PRIORITA'] == 3 ) {
						if( response[i]['SEZIONE'] == 'BACHECA_ALLERGIA_INTOLLERANZA')
							home.NOTIFICA.important({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
						else
							home.NOTIFICA.warning({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
					}
				}
				paziente_count = response.length;
			});
			
			utente_semaforo = $.NS_DB.getTool({_logger : home.logger}).select({
				id: 'MMG_DATI.BACHECA_UTENTE',
	            parameter: {
					'iden_personale' : {v: home.baseUser.IDEN_PER, t: 'N'},
					'oggi' : {v: moment().format('YYYYMMDD'), t: 'V' }
				}
			}).done( function(resp) {
				var response = resp.result;
				for( var i = 0; i < response.length; i++ ) {
					if( response[i]['PRIORITA'] == 3 ) {
						if( response[i]['SEZIONE'] == 'BACHECA_ALLERGIA_INTOLLERANZA')
							home.NOTIFICA.important({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
						else
							home.NOTIFICA.warning({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
					}
				}
				utente_count = response.length;
			});
			
			oggi_semaforo = $.NS_DB.getTool({_logger : home.logger}).select({
				id: 'MMG_DATI.BACHECA_OGGI',
	            parameter: {
					'iden_per' : {v: home.baseUser.IDEN_PER, t: 'N'},
					'oggi' : {v: moment().format('YYYYMMDD'), t: 'V' }
				}
			}).done( function(resp) {
				var response = resp.result;
				for( var i = 0; i < response.length; i++ ) {
					if( response[i]['PRIORITA'] == 3 ) {
						if( response[i]['SEZIONE'] == 'BACHECA_ALLERGIA_INTOLLERANZA')
							home.NOTIFICA.important({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
						else
							home.NOTIFICA.warning({ 'title' : title, 'message' : response[i]['DESCRIZIONE'], 'timeout' : timeout });
					}
				}
				oggi_count = response.length;
			});
			$.when(paziente_semaforo, utente_semaforo, oggi_semaforo).then(function() {
				home.MAIN_PAGE.updatePromemoriaBacheca(paziente_count + utente_count + oggi_count);
			});
		},
		
		checkRecepimentoConsenso:function(){
			
			//TODO: in attesa di istruzioni più precise
			return home.ASSISTITO.CONSENSO_PRIVACY_MMG;
			
		},
		
		creaUrlPortale: function(objDati){
			
			var url= 'username='+objDati.username;
			url += '&IDEN_ANAG='+objDati.iden_anag;
			url += '&NOME_HOST='+objDati.nomeHost;
			/*url += '&url='+objDati.url;*/
			url += '&scheda='+objDati.key_scheda;
			var escapeUrl = '&ACTION='+objDati.action;
			escapeUrl += '&ASSIGNING_AUTHORITY='+objDati.assigning_authority;
			escapeUrl += '&COGNOME=' +objDati.cognome;
			escapeUrl += '&NOME='+objDati.nome;
			escapeUrl += '&DATA_NASCITA='+objDati.data_nascita;
			escapeUrl += '&SESSO='+objDati.sesso;
			escapeUrl += '&CODICE_FISCALE='+objDati.codice_fiscale;
			escapeUrl += '&COM_NASC='+objDati.com_nasc;
			escapeUrl += '&COM_RES='+objDati.com_res;
			
			var urlFinale = LIB.getParamUserGlobal('URL_PIC','') + url + escape(escapeUrl);
			//alert(urlFinale);
			
			window.open(urlFinale,'Portale Privacy ASL2',"fullscreen=yes resizable=no");
		},
		
		confirm: function( msg, ifTrue, ifFalse, dialogParameters ) {
			
			var defaults = {
				'width'				: '500px',
				'id'				: 'dialogConfirm',
				'title'				: 'Richiesta di conferma',
				'showButtonClose'	: false,
				'buttons'			: new Array(),
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); }
			};
			
			dialogParameters = $.extend( defaults, dialogParameters );
			
			dialogParameters.content = msg;
			dialogParameters.buttons.push({ 
				'label' : 'Si', 
				'action': function() {
					$.dialog.hide();

					if (typeof ifTrue === 'function')
						ifTrue.apply( this );
				},
				'keycode': '13',
				'classe': "butVerde"
			});
			
			dialogParameters.buttons.push({ 
				'label' : 'No', 
				'action': function() {
					$.dialog.hide();
				
					if (typeof ifFalse === 'function')
						ifFalse.apply( this );
				},
				'keycode': '27'
			});

			return $.dialog( msg, dialogParameters );			
		},
		
		debug: function() {
			
			var text = '';

			text += '\n @ASSISTITO.NOME_COMPLETO: \t'			+ ASSISTITO.NOME_COMPLETO;
			text += '\n @ASSISTITO.IDEN_ANAG: \t'				+ ASSISTITO.IDEN_ANAG;
			text += '\n @ASSISTITO.IDEN_MED_BASE: \t'			+ ASSISTITO.IDEN_MED_BASE;
			text += '\n @ASSISTITO.ID_REMOTO: \t'				+ ASSISTITO.ID_REMOTO;
			text += '\n @ASSISTITO.CONSENSO_PRIVACY_MMG: \t'	+ ASSISTITO.CONSENSO_PRIVACY_MMG;
			text += '\n @PERMESSI.consensoPersonaleASL(): \t'	+ home.PERMESSI.consensoPersonaleASL();
			text += '\n @PERMESSI.visioneDatiAsl(): \t'			+ home.PERMESSI.visioneDatiAsl();
			text += '\n @ASSISTITO.COD_CDC: \t'					+ ASSISTITO.COD_CDC;
			text += '\n @ASSISTITO.IDEN_ACCESSO: \t'			+ ASSISTITO.IDEN_ACCESSO;
			text += '\n @ASSISTITO.DATA_ACCESSO: \t'			+ ASSISTITO.DATA_ACCESSO;
			text += '\n @ASSISTITO.IDEN_PROBLEMA: \t'			+ ASSISTITO.IDEN_PROBLEMA;
			text += '\n @ASSISTITO.SESSO: \t'					+ ASSISTITO.SESSO;
			text += '\n @ASSISTITO.DATA_MORTE: \t'				+ ASSISTITO.DATA_MORTE;
			text += '\n @BASEUSER.USERNAME: \t'					+ baseUser.USERNAME;
			text += '\n @BASEUSER.IDEN_PER: \t'					+ baseUser.IDEN_PER; 
			text += '\n @BASEPC.IP: \t'							+ basePC.IP;
			text += '\n @BASEUSER.TIPO_UTENTE: \t'				+ baseUser.TIPO_UTENTE;
			text += '\n @CARTELLA.REGIME: \t'					+ CARTELLA.REGIME;
			
			alert( text );
			
		},
		
		getCommonParameters: function() {
			
			var parameters =	'&IDEN_ANAG='		+ ( LIB.isValid( ASSISTITO.IDEN_ANAG ) 		? ASSISTITO.IDEN_ANAG 		: '' );
			parameters += 		'&IDEN_MED_BASE='	+ ( LIB.isValid( ASSISTITO.IDEN_MED_BASE )	? ASSISTITO.IDEN_MED_BASE 	: '' );
			parameters += 		'&ID_REMOTO=' 		+ ( LIB.isValid( ASSISTITO.ID_REMOTO ) 		? ASSISTITO.ID_REMOTO 		: '' );
			parameters += 		'&IDEN_ACCESSO=' 	+ ( LIB.isValid( ASSISTITO.IDEN_ACCESSO ) 	? ASSISTITO.IDEN_ACCESSO 	: '' );
			parameters += 		'&IDEN_PROBLEMA=' 	+ ( LIB.isValid( ASSISTITO.IDEN_PROBLEMA ) 	? ASSISTITO.IDEN_PROBLEMA 	: '' );
			parameters += 		'&IDEN_PER='		+ ( LIB.isValid( baseUser.IDEN_PER ) 		? baseUser.IDEN_PER 		: '' );
			parameters += 		'&UTE_INS=' 		+ ( LIB.isValid( baseUser.IDEN_PER ) 		? baseUser.IDEN_PER 		: '' );
			parameters += 		'&IDEN_MED_PRESCR=' + CARTELLA.getMedPrescr();
//fatto da apriPagina			parameters += 	'&t=' 				+ new Date().getTime();

			return parameters;
		},
		
		getWhaleUrl: function() {
			
			var whaleUrl = '';
			
			whaleUrl += 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioFiltro&reparto=MMG';
			whaleUrl += '&nosologico=&elencoEsami=&numRichieste=5&idPatient='+ASSISTITO.ID_REMOTO+'&DATA_NASC='+ASSISTITO.DATA_NASCITA_ISO;
			whaleUrl += '&daData=&aData=&provRisultati=&provChiamata=MMG&userLogin='+baseUser.USERNAME+'&idenAnag='+ASSISTITO.IDEN_ANAG + '&modalita=PAZIENTE';
			
			return whaleUrl;
			
		},
		
		goHome: function() {
		
			//elimino le notifiche prima di chiudere la cartella
			$(".ambiance").hide();
			
			NS_FENIX_TOP.chiudiTutte();
			$("#statDx .scheda-min").remove();
			
			NS_MMG.apri( 'WORKLIST_RICERCA', '', { fullscreen : false } );
			
			CARTELLA.active = false;
			
		},
		
		openDocument: function( url, parameters, data ) {
			
			NS_MMG.apri( 'VISUALIZZATORE', '&path='+ url, parameters, data );
			
		},
		
		openUrl: function( url, parameters, pCase, data) {
			
			var vCase = typeof pCase != 'undefined' ? pCase : url;
			var defaults	= { url : url, fullscreen : true, showloading : true };
			parameters		= $.extend( defaults, parameters );
			
			if( NS_MMG.beforeOpen(vCase, data) )
			{
				
				home.NS_FENIX_TOP.apriPagina( parameters );
				NS_MMG.afterOpen();
				
			}
			
		},
		
		returnUrl: function() {
			return 'page?KEY_LEGAME='+ key_legame;
		},
		
		reloadUser:function(reload) {
			home.dwrBaseFactory.reloadUser("","","",function(resp) {
				if (typeof reload == "undefined" || reload) {
					home.location.reload();
				} else {
					home.baseUser = JSON.parse(resp);
				}
			});
		},
		
		reloadPC:function(reload) {
			home.dwrBaseFactory.reloadPC("","","",function(resp) {
				if (typeof reload == "undefined" || reload) {
					home.location.reload();
				} else {
					home.basePC = JSON.parse(resp);
				}
			});
		},
		
		reloadPage: function( n_scheda, key_legame, parameters ) {
			var iScheda;
			n_scheda || NS_FENIX_TOP.body.find('.iScheda').length;
			iScheda = NS_FENIX_TOP.body.find( '#iScheda-'+ n_scheda );
			iScheda.attr('src', 'page?KEY_LEGAME='+ key_legame + parameters + NS_MMG.getCommonParameters() +'&N_SCHEDA='+ n_scheda );
		},
		
		MOBILE : {
		
			isMobile: function() {
				return $.browser.ipad || $.browser.iphone || $.browser.android;
			},
			
			getPixelRation: function() {
				return window.devicePixelRatio;
			},
			
			hideKeyboard: function() {
				$(':focus').blur();
			},
			
			isLandscape: function() {
				return $(body).innerWidth() >= $(body).innerHeight();
			},
			
			isPortrait: function() {
				return ! NS_MMG.MOBILE.isLandscape();
			},
			
			// http://www.html5rocks.com/en/mobile/fullscreen/ 
			toggleFullScreen: function() {
				
				  var
				  	doc					= window.document,
				  	docEl				= doc.documentElement,
				  	requestFullScreen	= docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen,
				  	cancelFullScreen	= doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

				  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
					  requestFullScreen.call(docEl);
				  } else {
					  cancelFullScreen.call(doc);
				  }
			}
		
		},
		
		apriConfermaRicette:function() {
			
			var divConfermaRicette = $("<div></div>");
			divConfermaRicette.attr("id","divConfermaRicette");
			divConfermaRicette.hide();
			
			if($("#divConfermaRicette").length > 0){
				home.RICETTA_UTILS_CONFERMA.closeElenco();
			} else {
				//$("body").parents().find("#menuShortcut").append(divConfermaRicette);
				$("body").parents().find("#menuBar").append(divConfermaRicette);

				home.$.NS_DB.getTool({_logger : home.logger}).select({

					id:'WORKLIST.ELENCO_RICETTE_CONFERMATE_DIV',
					parameter:
					{
						iden_med		: { v : home.baseUser.IDEN_PER, t : 'N'},
						stato			: { v : 'I', t : 'V'},
						data_inizio		: { v : moment().format('YYYYMMDD'), t : 'v'},
						/*data_inizio		: { v : moment().format('YYYYMMDD'), t : 'v'},*/
						data_fine		: { v : moment().format('YYYYMMDD'), t : 'v'},
						demasn			: { v : 'S,D', t : 'V'},
						stampato		: { v : 'N', t : 'V'},
					}

				}).done( function(resp) {
					divConfermaRicette.append(home.RICETTA_UTILS_CONFERMA.getDiv(resp.result));
					divConfermaRicette.append(home.RICETTA_UTILS_CONFERMA.structure.createFooter());
					divConfermaRicette.show("fast");
					home.RICETTA_UTILS_CONFERMA.setEvents();
				});
			}
		}
};

