$(document).ready(function()
{
	window.onunload = function() {
		window.open("logout.html?t=" + new Date().getTime() + ($.browser.msie ? "#IE" : ""),"logout","top=0,left=0,height=100,width=100,menubar=no,scrollbars=no,status=no,titlebar=no");
	}
	
	NS_LOADING.showLoading();
	
	MAIN_PAGE.init();
	MAIN_PAGE.setEvents();
	
    UTENTE.init();
    PERMESSI.init();
	
});

var MAIN_PAGE = {

		init: function(){
			
			home.document.title = "MMG";
			
			home.MAIN_PAGE			= this;
			MAIN_PAGE.iContent		= $('#iContent', '#content');
			
			if( ! MAIN_PAGE.gestAutoLogin( unescape( NS_MMG_UTILITY.getUrlParameter('KEY_SCHEDA') ) ) ){	
				MAIN_PAGE.loadPatientSearch();
			}
			
			var icon_chat = $( document.createElement('i') ).addClass('icon-chat').attr('title', 'Invia una notifica in tempo reale');
			icon_chat.on('click',  function( event ) {
				home.NS_MMG.apri('PANNELLO_NOTIFICHE');
			});
			$('#statDx').append( icon_chat );
			
			MAIN_PAGE.offlineAttach();
		},
		
		setEvents: function(){
			
			MAIN_PAGE.updatePromemoriaBacheca();
			
			$('#divInfo').on('dblclick', '.infoDatiPaziente', function(event){ event.stopImmediatePropagation(); NS_MMG.debug(); });
		},
		
		gestAutoLogin:function( pagina ){
			
			if( pagina ){
				
				NS_OBJECT_MANAGER.init( NS_MMG_UTILITY.getUrlParameter('IDEN_ANAG'), function() 
					{
						var url_extra = '&PROVENIENZA=AUTOLOGIN&'+NS_MMG_UTILITY.getUrlParameter('URL_EXTRA');
						home.NS_MMG.apri( pagina, url_extra );
					}
				);
				
				return true;
				
			}else{
				
				return false;
			}
		},
		
		updatePromemoriaBacheca: function( promemoria ){
						
			if( !isNaN( promemoria ) && promemoria > 0 )
			{
				
				var link = '<a href=\'javascript: home.NS_MMG.apri("BACHECA");\'>Visualizza</a>';
				
				$("#dettaglioBacheca").remove();
				$( document.createElement('div') )
					.attr( { 'id' : 'dettaglioBacheca', 'title' : 'Ci sono '+ promemoria + ' promemoria da visualizzare', 'class' : 'notificaApice' } )
					.text( promemoria )
					.appendTo('#linkBacheca');
				
				NOTIFICA.info({ 'title' : 'Informazioni', 'message' : 'Sono presenti ' + promemoria + ' promemoria.<br>' + link, 'timeout' : 5 });
			}
		},
		
		toggleMenu: function(){
			
			var 
				menuCartella		= $('#menuCartella'), 
				menuEsterno			= $('#menuEsterno'), 
				menuRapidoCartella	= $('.internal', '#menuShortcut'),
				menuRapidoEsterno	= $('.external', '#menuShortcut'),
				menuMessaggi		= $("#linkMessaggi"),
				linkAnagrafica		= $('#linkRicercaAnagrafica');
			
			if( LIB.isValid( ASSISTITO.IDEN_ANAG ) ){
				
				menuCartella.show();
				menuRapidoCartella.closest('li').show();
				
				menuEsterno.hide();
				menuRapidoEsterno.closest('li').hide();
				
				//controllo che sia autorizzato per la medicina di iniziativa per mostrargli l'icona dei messaggi
				if(!MMG_CHECK.isMedIniz()){
					menuMessaggi.hide();
				}
				
			}else{
				
				menuCartella.hide();
				menuRapidoCartella.closest('li').hide();
				
				menuEsterno.show();
				menuRapidoEsterno.closest('li').show();
				
				//controllo che sia autorizzato per la medicina di iniziativa per mostrargli l'icona dei messaggi
				if(!MMG_CHECK.isMedIniz()){
					menuMessaggi.hide();
				}
			}
		},
		
		loadPatientSearch: function(){
			MAIN_PAGE.iContent.attr( 'src', 'page?KEY_LEGAME=WORKLIST_RICERCA' );
		},
		
		//gestione della barra delle informazioni in alto nella cartella
		setPatientInfo: function(){
			
			if( ! LIB.isValid( ASSISTITO.IDEN_ANAG ) ){
				/*Non sono in una cartella paziente*/
				var infoContainer	= $('#divInfo');
				infoContainer.empty();
				$( document.createElement('span') ).appendTo( infoContainer );
				
				if (home.baseUser.TIPO_UTENTE == "A") {
					home.$.NS_DB.getTool({_logger : home.logger}).select({
						id: "MMG_DATI.INTESTAZIONE",
						datasource: 'MMG_DATI',
						parameter: {
							'iden_per' : {v: home.baseUser.IDEN_PER, t: 'N'}
						}
					}).done( function(resp) {
						var response = resp.result;
						MAIN_PAGE.setPrescriber(response[0].IDEN_MED_PRESCR, response[0].MEDICO_PRESCRITTORE);
					});
				}
				return;
			}
			
			var infoContainer	= $('#divInfo');
			var infoPaziente 	= [
				{
					'class':	'infoDatiPaziente',
					'icon': 	ASSISTITO.SESSO == 'M' ? 'icon-male' : 'icon-female',
					'title':	'Dati del paziente',
					'text':		ASSISTITO.NOME_COMPLETO,
					'function': function(){ return false; }//NS_MMG.apriDettaglioPrivacy(ASSISTITO.IDEN_ANAG); }
				},
				{
					'class':	'infoEta',
					'icon':		'icon-tag',
					'title':	'Eta\'',
					'text':		ASSISTITO.ETA_DESCR,
					'function': function(){ return; }
				},
				{
					'class':	'infoCF',
					'icon':		'icon-vcard',
					'title':	'Cod.Fiscale',
					'text':		ASSISTITO.COD_FISC,
					'function':	function(){ return; }
				},
				{
					'class':	'infoEsenzioni',
					'icon':		'icon-euro',
					'title':	'Esenzioni',
					'text':		'<span/>',
					'function':	function(){ return; }
				},
				{
					'class':	'infoMedBase',
					'icon':		'icon-stethoscope',
					'title':	'Medico curante',
					'text':		ASSISTITO.DESCR_MED_BASE,
					'function': function(){ return; }
				}
			];
			var allergie		= ASSISTITO.INFO_ALLERGIE_INT.split('*');
			var paziente		= '';
			var dettaglio		= '';
			
			infoContainer.empty();
			
			var titlePrivacy = '';
			
			for( var i = 0; i < infoPaziente.length; i++ ){
				
				var 
					icon		 = $( document.createElement('i') ).addClass( infoPaziente[i]['icon'] ).attr("id","iconaPaziente").on('click', infoPaziente[i]['function'] ),	
					title		 = infoPaziente[i]['title'],
					text		 = infoPaziente[i]['text'],
					colorPrivacy = "";
				
				
				if(infoPaziente[i]['class'] == 'infoDatiPaziente'){
					
					if (ASSISTITO.CONSENSO_PRIVACY_MMG == 'S'){
						
						titlePrivacy = traduzione.lblPrivacyConcessa;
						colorPrivacy = "#2CBB68"; //verde
						icon.css("color", colorPrivacy);
						
					}else if(ASSISTITO.CONSENSO_PRIVACY_MMG == 'N'){
						
						titlePrivacy = traduzione.lblPrivacyNonConcessa;
						colorPrivacy = "#fc4141"; //rosso
						icon.css("color", colorPrivacy);
						
					}else{
						
						titlePrivacy = traduzione.lblPrivacyNonRilevata;
						colorPrivacy = "yellow";
						icon.css("color", colorPrivacy);
					}
					
					icon.on("click",function(){home.NS_MMG.apri( 'SCHEDA_ANAGRAFICA_MMG');});
					$( document.createElement('span') ).attr( 'title', titlePrivacy).addClass( infoPaziente[i]['class'] ).html( text ).prepend( icon ).appendTo( infoContainer );
					
				}else{
					
					icon.on("click",function(){home.NS_MMG.apri( 'SCHEDA_ANAGRAFICA_MMG');});
					$( document.createElement('span') ).attr( 'title', title ).addClass( infoPaziente[i]['class'] ).html( text ).prepend( icon ).appendTo( infoContainer );
				}
			}
			
			dettaglio = NS_MMG_UTILITY.getDettaglioConsenso();
			
			//pezzo di codice che aggiunge il div piccolo in alto con il numero (style Apple)
			var iconAllerta = $( document.createElement('div') ).attr({ 'id' : 'dettaglioPaziente', 'title' : dettaglio, 'class' : 'notificaApice' });
			
			iconNumber = home.PERMESSI.getPermessiNegati().length ;
			
			icon.css("background", colorPrivacy);
			
			var spanNome = $('#divInfo').find("span:first-child");
			var spanDivInfo = $('#divInfo').find("span");
			var iconMedIniz = $("<i></i>");
			
			/*MEDICINA_INIZIATIVA*/
			if(ASSISTITO.MEDICINA_INIZIATIVA.length > 0){
				
				var tipo_mi = "";
				for (var mi = 0; mi < home.ASSISTITO.MEDICINA_INIZIATIVA.length; mi++) {
					if (mi > 0) {
						tipo_mi += ", ";
					}
					tipo_mi += home.ASSISTITO.MEDICINA_INIZIATIVA[mi].DESCRIZIONE;
				}
				
				/* (30/07/2015) lucas: commentato per evitare il messaggio all'entrata della cartella 
				home.NOTIFICA.info({
					message: traduzione.lblPazienteMedIniz + " " + tipo_mi,
					title:"Medicina di iniziativa",
					timeout: "10"
				});*/
				
				// metto tutti gli span di colore giallo
				spanDivInfo.css("color","yellow");
				 
				iconMedIniz.addClass("icon-medkit");
				iconMedIniz.css({"color":"yellow","cursor":"pointer"});
				iconMedIniz.on("click",function(e){
					e.stopImmediatePropagation();
					home.NS_MMG.apri("RIEPILOGO_MEDICINA_INIZIATIVA");
				});
				 
				spanNome.find("i").prepend(iconMedIniz);
			}
			
			if(iconNumber > 0) {
				
				iconAllerta.text( iconNumber );
				iconAllerta.on("click",function(e){ 
					e.stopImmediatePropagation();
					e.preventDefault;
					home.NS_MMG.apriDettaglioPrivacyMMG(); 
				});
				iconAllerta.appendTo($("#iconaPaziente"))
			}
			
			
			//Se è impostato il medico prescrittore uguale al medico curante non viene fatta l'assegnazione
			if( 
				(LIB.isValid( CARTELLA.IDEN_MEDICO_PRESCRITTORE_ESTERNO ) &&
				CARTELLA.IDEN_MEDICO_PRESCRITTORE_ESTERNO != CARTELLA.IDEN_MED_PRESCR) &&
				(!LIB.isValid( home.baseUser.PRESCRITTORE_UGUALE_CURANTE)  ||
				home.baseUser.PRESCRITTORE_UGUALE_CURANTE == 'N')
			){				
				CARTELLA.IDEN_MED_PRESCR	= CARTELLA.IDEN_MEDICO_PRESCRITTORE_ESTERNO;
				CARTELLA.DESCR_MED_PRESCR	= CARTELLA.DESCR_MEDICO_PRESCRITTORE_ESTERNO;		
			}
			
			MAIN_PAGE.setPrescriber( CARTELLA.IDEN_MED_PRESCR, CARTELLA.DESCR_MED_PRESCR );
			MAIN_PAGE.setPatientProblem( '', 'Nessun problema selezionato' );
			MAIN_PAGE.setEvents();
			home.NS_MMG.avvisoPermessiPrivacy();
		},
		
		setPatientProblem: function( iden_problema, descrizione ){
			
			var iconProblema	= $(document.createElement('i')).addClass('icon-alert').on('click', function(){ MAIN_PAGE.unsetPatientProblem(); });
			var smallDescr		= descrizione.length > 40 ? descrizione.substr( 0, 40 ) + '...' : descrizione;
			
			ASSISTITO.IDEN_PROBLEMA		= iden_problema;
			ASSISTITO.DESCR_PROBLEMA	= descrizione;
			
			if( $('#problema', '#divInfo').length < 1 ){ 
				$( document.createElement('span') ).attr( 'id', 'problema' ).text( 'Nessun problema selezionato').prepend( iconProblema ).appendTo( $('#divInfo') );
			}else{
				$('#problema', '#divInfo').addClass('selezionato').attr('title', descrizione).text( smallDescr ).prepend( iconProblema );
			}
			
			if( typeof home.RIEPILOGO !== 'undefined' && home.RIEPILOGO !== null ){
			
				home.NS_LOADING.showLoading();
				home.NS_MMG.MOBILE.isMobile() ? NS_MMG.apri( 'RIEPILOGO_MOBILE', '', { fullscreen : false } ) : home.RIEPILOGO.init();
			}
		},
		
		unsetPatientProblem: function(){
			
			var descrizione		= 'Nessun problema selezionato';
			var iconProblema	= $(document.createElement('i')).addClass('icon-alert').on('click', function(){ MAIN_PAGE.unsetPatientProblem(); });
			
			$('#problema', '#divInfo').removeClass('selezionato').attr('title', descrizione).text( descrizione ).prepend( iconProblema );
			
			ASSISTITO.IDEN_PROBLEMA		= '';
			ASSISTITO.DESCR_PROBLEMA	= '';
			
			if( typeof home.RIEPILOGO !== 'undefined' ){
				
				home.NS_LOADING.showLoading();
				home.RIEPILOGO.init();
			}
		},
		
		setPrescriber: function( iden_medico_prescrittore, descrizione ){
			var icon = $(document.createElement('i')).addClass('icon-pencil').on('click', function(){ NS_MMG.apri('INSERIMENTO_MEDICO'); });
			
			if( $('#prescrittore', '#divInfo').length < 1 ){
				$( document.createElement('span') ).attr({ 'id' : 'prescrittore', 'title' : 'Medico prescrittore' }).text( descrizione ).prepend( icon ).appendTo( $('#divInfo') );
			}else{
				$('#prescrittore', '#divInfo').text( descrizione ).prepend( icon );
			}
			 
			CARTELLA.IDEN_MED_PRESCR	= iden_medico_prescrittore;
			CARTELLA.DESCR_MED_PRESCR 	= descrizione  != '' ? descrizione : 'Nessun Medico selezionato';
		},
		
		setInfoEsenzioni: function(){
			
			$('.infoEsenzioni span', '#divInfo').html(ASSISTITO.ESENZIONI.length>0 ? ASSISTITO.getEsenzioniAsStringForInt() : 'nessuna');
		},
		
		info: function(){
			
			NS_INFORMATIONS.homeContent	= NS_INFORMATIONS.appendTo = $('body');
			NS_INFORMATIONS.key_legame	= 'MAIN_PAGE';
			
			NS_INFORMATIONS.plugin		=
				NS_INFORMATIONS.homeContent.Info(
					{
						'appendTo':				NS_INFORMATIONS.appendTo,
						'width':				350,
						'content': 				NS_INFORMATIONS.getContent(),
						'closeOnOverlayClick':	true,
						'infoClick':			function( info, event ){ return info; }
					});
			
			NS_INFORMATIONS.plugin.show();
		},
		
		offlineAttach: function() {
			
			if (OFFLINE_LIB.isAttivo()) {
				
				var iframe = $( document.createElement('iframe') );
				var target = $('#offline').empty();
				
				iframe.attr({
					'src':	OFFLINE_LIB.getUrl(),
					'id':	'offline_iframe'
				}).css({
					'width': 	0,
					'height':	0
				}).appendTo( target );
			
				MAIN_PAGE.offline = iframe[0];

			} else {
				$('#mOffline').hide();
			}
		},
		
		offlineDetach: function() {
			$('#offline').empty();
		},
		
		offlineOpen: function() {
			
			var opzioni = '', w;
			
			MAIN_PAGE.offlineDetach();
			
			if( navigator.userAgent.toLowerCase().indexOf('msie') >= 0 ) 
				opzioni += 'height=' + window.innerHeight + ',width=' + window.innerWidth + ',location=yes,toolbar=yes,left=0,top=0';
			
			w = window.open( OFFLINE_LIB.getUrl(), 'fenixMMG_' + baseUser.USERNAME, opzioni );
			w.onbeforeunload = function() {
				MAIN_PAGE.offlineAttach();
			};
		}
};
