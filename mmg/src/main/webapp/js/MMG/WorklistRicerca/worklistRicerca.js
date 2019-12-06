$(document).ready(function()
{
	
	WORKLIST_RICERCA.init();
	
	WORKLIST_RICERCA.cognome.focus();
	
	NS_FENIX_WK.beforeApplica	= WORKLIST_RICERCA.beforeSearch; 
	NS_FENIX_WK.aggiornaWk		= WORKLIST_RICERCA.loadWorklist;
	
});

var WORKLIST_RICERCA = {
		
		init: function(){
			
			home.WORKLIST_RICERCA				= this;
			WORKLIST_RICERCA.butApplica			= $('.butApplica');
			WORKLIST_RICERCA.butInserisci		= $('.butInserisci');
			WORKLIST_RICERCA.butReset			= $('.butAzzeraFiltri');
			WORKLIST_RICERCA.butLastAccess		= $('.butUltimiAccessi');
			WORKLIST_RICERCA.divWk				= $('#divWk');
			WORKLIST_RICERCA.cognome			= $('#txtCognome');
			WORKLIST_RICERCA.nome				= $('#txtNome');
			WORKLIST_RICERCA.data				= $('#h-txtDataNascita');
			WORKLIST_RICERCA.txtData			= $('#txtDataNascita');
			WORKLIST_RICERCA.codFisc			= $('#txtCodiceFiscale');
			WORKLIST_RICERCA.anagrafe			= radAnagrafe;
			WORKLIST_RICERCA.tipoAssistito		= radTipoAssistito;
			WORKLIST_RICERCA.hAnagrafe			= $('#h-radAnagrafe');
			WORKLIST_RICERCA.idenMedBase 		= '';
			
			WORKLIST_RICERCA.divWk.addClass('adaptiveContainer');
			
			WORKLIST_RICERCA.resizeWorklist();
			
			WORKLIST_RICERCA.getGruppo();
			WORKLIST_RICERCA.setEvents();
			WORKLIST_RICERCA.setDefaults();
			
			home.NS_OBJECT_MANAGER.clear( home.MAIN_PAGE.toggleMenu );
			home.MAIN_PAGE.setPatientInfo();
						
			WORKLIST_RICERCA.setFilters();
		},
		
		setEvents: function(){
			
			var WORKLIST_RICERCA = this;
			
			$(window).resize( WORKLIST_RICERCA.resizeWorklist );
			
			$('body').on('keydown', function( event ){
		

				if( home.NS_MMG.MOBILE.isMobile() && event.keyCode == '13' )
					home.NS_MMG.MOBILE.hideKeyboard();
		
				if( event.keyCode == '13' ){
					event.preventDefault();
					event.stopPropagation();
					WORKLIST_RICERCA.butApplica.trigger("click");			
				}
			});
			
			WORKLIST_RICERCA.hAnagrafe
				.on('change',function(){ WORKLIST_RICERCA.anagrafe.val() == 'SANITARIA' ? $('#radTipoAssistito').closest('tr').hide() : $('#radTipoAssistito').closest('tr').show(); });
			
			WORKLIST_RICERCA.cognome
				.on('blur',function(){ $(this).val( $(this).val().toUpperCase() ); });
		
			WORKLIST_RICERCA.nome
				.on('blur',function(){ $(this).val( $(this).val().toUpperCase() ); });
			
			WORKLIST_RICERCA.codFisc
				.on('blur',function(){ $(this).val( $(this).val().toUpperCase() ); });
			
			WORKLIST_RICERCA.butInserisci
				.on('click', WORKLIST_RICERCA.inserisciNuovaAnagrafica );

			WORKLIST_RICERCA.butReset
				.on('click', WORKLIST_RICERCA.reset );
			
			WORKLIST_RICERCA.butLastAccess
				.on('click', WORKLIST_RICERCA.loadLastAccess );
			
			$(".butLastVal")
				.on('click',WORKLIST_RICERCA.setLastVal );
		},
		
		setLastVal: function(){
			
			if (typeof (home.CARTELLA.lastPat) != 'undefined'){
				WORKLIST_RICERCA.nome.val(home.CARTELLA.lastPat.nome);
				WORKLIST_RICERCA.cognome.val(home.CARTELLA.lastPat.cognome);
				WORKLIST_RICERCA.txtData.val(home.CARTELLA.lastPat.dataNascita);
				WORKLIST_RICERCA.data.val(home.CARTELLA.lastPat.h_dataNascita);
				WORKLIST_RICERCA.codFisc.val(home.CARTELLA.lastPat.codFisc);
				radTipoAssistito.selectByValue(home.CARTELLA.lastPat.tipoAssistito);
				radAnagrafe.selectByValue(home.CARTELLA.lastPat.anagrafe);
			}
		},
		
		getLastVal: function(){
			
			home.CARTELLA.lastPat = {
					
				'nome'			: WORKLIST_RICERCA.nome.val(),
				'cognome'		: WORKLIST_RICERCA.cognome.val(),
				'dataNascita'	: WORKLIST_RICERCA.txtData.val(),
				'h_dataNascita'	: WORKLIST_RICERCA.data.val(),
				'codFisc'		: WORKLIST_RICERCA.codFisc.val(),
				'anagrafe'		: WORKLIST_RICERCA.anagrafe.val(),
				'tipoAssistito'	: WORKLIST_RICERCA.tipoAssistito.val()
			};
		},
		
		setDefaults: function(){
			
			if( home.baseUser.TIPO_UTENTE == 'M' && home.baseUser.TIPO_UTENTE != 'A' )
			{
				WORKLIST_RICERCA.anagrafe.selectByValue('ASSISTITI');
				WORKLIST_RICERCA.tipoAssistito.selectByValue('SSN');
			}
			else
			{
				WORKLIST_RICERCA.anagrafe.selectByValue('ASSISTITI');
				WORKLIST_RICERCA.tipoAssistito.selectByValue('MEDGRUP');
			}
			
		},		
		
		resizeWorklist: function()
		{
			NS_FENIX_WK.adattaAltezzaWk();
		},
		
		addReadOnly: function()
		{
			
			$('.RadioBox').each(
				function()
				{
					
					var plugin = $(this).data('RadioBox');
					
					plugin.disable();
					
				});
			
			$(':input').attr('readOnly', true);
			
		},
		
		removeReadOnly: function()
		{
			
			$('.RadioBox').each(
					function(){
						
						var plugin = $(this).data('RadioBox');
						plugin.enable();
					});
				$(':input').attr('readOnly', false);
		},
		
		loadLastAccess: function()
		{	
			var parameters = 
				{
					'id':		'ULTIMI_ACCESSI_CARTELLA',
					'aBind':	[ 'webuser' ],
					'aVal':		[ home.baseUser.USERNAME ]
				};
			
			if( !WORKLIST_RICERCA.butLastAccess.hasClass('selected') )
			{
				
				WORKLIST_RICERCA.butLastAccess.addClass('selected');
				//WORKLIST_RICERCA.addReadOnly();
				
				WORKLIST_RICERCA.objWk	= new WK( parameters );
				WORKLIST_RICERCA.objWk.loadWk();
				
				home.WORKLIST_RICERCA.objWk = WORKLIST_RICERCA.objWk;
				
			}else{
				
				WORKLIST_RICERCA.butLastAccess.removeClass('selected');
				//WORKLIST_RICERCA.removeReadOnly();
			}
		},
		
		loadWorklist: function() {
			
			var parameters = WORKLIST_RICERCA.getWkParameters();
			
			WORKLIST_RICERCA.butLastAccess.removeClass('selected');
			WORKLIST_RICERCA.removeReadOnly();
			
			delete WORKLIST_RICERCA.objWk;
			WORKLIST_RICERCA.objWk	= new WK( parameters );
			
			if( WORKLIST_RICERCA.anagrafe.val() == 'SANITARIA' )
				if (LIB.getParamUserGlobal("ANAGRAFICA_REMOTA","N") == "S") {
					home.NS_LOADING.showLoading();
					home.dwrMMG.RicercaInRemoto( parameters.aBind, parameters.aVal, {
						callback: function() {
							WORKLIST_RICERCA.objWk.loadWk();
							home.NS_LOADING.hideLoading();
						},
						errorHandler: function(message) {
							home.NOTIFICA.warning({
								title: "Attenzione",
								message: "Troppi risultati, aggiungere dettagli nei filtri di ricerca paziente",
								timeout: 10
							});
							WORKLIST_RICERCA.objWk.loadWk();
							home.NS_LOADING.hideLoading();
						},
						timeout: 0
					});
				} else {
					WORKLIST_RICERCA.objWk.loadWk();
				}
			else {
				WORKLIST_RICERCA.objWk.loadWk();
			}
			
			home.WORKLIST_RICERCA.objWk = WORKLIST_RICERCA.objWk;
			WORKLIST_RICERCA.butLastAccess.removeClass('selected');
			
		},
		
		getWkParameters: function() {
			var parameters = { id : null, aBind : new Array(), aVal : new Array() };
			parameters.aBind.push( 'cogn', 'nome', 'data', 'cod_fisc' );
			parameters.aVal.push( this.cognome.val().toUpperCase(), this.nome.val().toUpperCase(), this.data.val(), this.codFisc.val().toUpperCase() );
			
			if( WORKLIST_RICERCA.anagrafe.val() == 'SANITARIA' ) {
				parameters.id = 'ANAGRAFE_SANITARIA';
			} else {
				switch( WORKLIST_RICERCA.tipoAssistito.val() ) {
				case 'SSN':
					parameters.id = 'ASSISTITI';
					parameters.aBind.push( 'iden_utente', 'decesso');
					parameters.aVal.push( home.baseUser.IDEN_PER, 'N');
					break;
				case 'LP':
					parameters.id = 'ASSISTITI_ACCESSO';
					parameters.aBind.push( 'iden_utente', 'regime_accesso' );
					parameters.aVal.push( home.baseUser.IDEN_PER, 'LP' );
					break;
				case 'MEDGRUP':
					parameters.id = 'ASSISTITI_GRUPPO';
					parameters.aBind.push( 'iden_utente' );
					parameters.aVal.push( home.baseUser.IDEN_PER );
					break;
				case 'SPEC':
					parameters.id = 'ASSISTITI_ACCESSO';
					parameters.aBind.push( 'iden_utente', 'regime_accesso' );
					parameters.aVal.push( home.baseUser.IDEN_PER, 'SP' );
					break;
				case 'REV':
					parameters.id = 'ASSISTITI_STORICO';
					parameters.aBind.push( 'iden_med_base' );
					parameters.aVal.push( home.CARTELLA.getMedPrescr() );
					break;
				case 'DEC':
					parameters.id = 'ASSISTITI';
					parameters.aBind.push( 'iden_utente', 'decesso' );
					parameters.aVal.push( home.baseUser.IDEN_PER, 'S' );
					break;
				case 'TUTTI':
					parameters.id = 'ASSISTITI_ALL';
					parameters.aBind.push( 'iden_utente' );
					parameters.aVal.push( home.baseUser.IDEN_PER );
					break;				
				}
			}
			home.ActiveWKFilter =  { anagrafe : radAnagrafe.val(), tipoAssistito : radTipoAssistito.val() };
			return parameters;
		},
		
		beforeSearch: function()
		{
			WORKLIST_RICERCA.getLastVal();
			var performSearch = true;
			var cognome = WORKLIST_RICERCA.cognome.val();
			
			if( WORKLIST_RICERCA.anagrafe.val() == '' )
			{
				home.NOTIFICA.warning({ title: traduzione.lblAttenzione, message: traduzione.lblSelAnagrafica });
				performSearch = false;
			}
			
			if( WORKLIST_RICERCA.tipoAssistito.val() == '' )
			{
				home.NOTIFICA.warning({ title: traduzione.lblAttenzione, message: traduzione.lblSelTipoAssistito });
				performSearch = false;
			}
			
			if( $.trim(cognome).length < 2 && WORKLIST_RICERCA.codFisc.val() == '' )
			{	
				home.NOTIFICA.warning({ title: traduzione.lblAttenzione, message: traduzione.lblSelCognomePaziente});
				performSearch = false;	
			}
			
			return performSearch;
		},
		
		setFilters: function() 
		{
			
			if (home.ActiveWKFilter != null){
				
				switch(home.ActiveWKFilter.anagrafe) {
					case 'SANITARIA':
						radAnagrafe.selectByValue("SANITARIA"); 
						break;
					case 'ASSISTITI':
						radTipoAssistito.selectByValue(home.ActiveWKFilter.tipoAssistito);
						break;
					default:
						radAnagrafe.selectByValue("ASSISTITI");
						radTipoAssistito.selectByValue("SSN");
						break;
				}
			}
		},
		
		getGruppo: function(){
			
			toolKitDB.getResultDatasource( 'MMG_DATI.MEDICI_GRUPPO', 'MMG_DATI', { 'iden_per': home.baseUser.IDEN_PER }, null, 
				function( response )
				{
					WORKLIST_RICERCA.gruppoMedico = response[0].GRUPPO;
				});
		},
		
		inserisciNuovaAnagrafica: function() {
			home.NS_MMG.apri( "SCHEDA_ANAGRAFICA_MMG", "&LAYOUT=BREVE" );
		},
		
		reset:function(){

			WORKLIST_RICERCA.cognome.val('');
			WORKLIST_RICERCA.nome.val('');
			WORKLIST_RICERCA.data.val('');
			WORKLIST_RICERCA.txtData.val('');
			WORKLIST_RICERCA.codFisc.val('');
			radTipoAssistito.selectByValue("SSN");
			radAnagrafe.selectByValue("ASSISTITI");
		}
};
