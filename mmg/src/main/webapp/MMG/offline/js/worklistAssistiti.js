$(document).ready(function() {
	WORKLIST_ASSISTITI.init();
	WORKLIST_ASSISTITI.setEvents();
	
});

/*
 *	GESTISCE LA WORKLIST DEGLI ASSISTITI
 */
var WORKLIST_ASSISTITI = {
		
	init: function() {
		$.when(NS_OFFLINE.semaforo).then(function(){
			/*Meglio non caricare tutta la lista se ci sono 1000 pazienti*/
			//WORKLIST_ASSISTITI.loadWk();
		});
	},
	
	reset: function() {
		$('#txtNome, #txtCognome, #txtCodiceFiscale, #txtDataDiNascita, #h-txtDataDiNascita').val("");
		$('#txtCognome').focus();
	},
	
	setEvents: function() {
		
		$('#txtNome, #txtCognome, #txtCodiceFiscale').on( 'keyup', function( event ) {
			event.keyCode != '13' ? $(this).val( $(this).val().toUpperCase() ) : WORKLIST_ASSISTITI.loadWk();
		});
		
		$('#butApplicaAssistito').on('click', WORKLIST_ASSISTITI.loadWk );

	},
	
	/*
	 *	E' BRUTTO MA LA WK DEVE ESSERE SEMPRE REINIZIALIZZATA PER POTER USUFRUIRE DELLA CALLBACK SULL'EVENTO
	 *	AFTER_BUILD_CALLBACK
	 */
	loadWk: function() {
		
		if (
				($("#txtCognome").val().length == 0 && $("#txtCodiceFiscale").val().length == 0 && !OFFLINE.beforeLoadWk($("#txtCognome"), 2))
				||
				($("#txtCognome").val().length > 0 && !OFFLINE.beforeLoadWk($("#txtCognome"), 2))
				||
				($("#txtCodiceFiscale").val().length > 0 && !OFFLINE.beforeLoadWk($("#txtCodiceFiscale"), 16))
				) {
			return;
		}
		
		var parameters	=  {
			'id':					'OFFLINE_ASSISTITI',
			'container':			'divWorklistAssistiti',
			'aBind':				[],
			'aVal':					[],
			'loadData':				false,
			'build_callback':		{ 'after': WORKLIST_ASSISTITI.getWorklistData },
			'type': 'GET'
		};
		
		if( !LIB.isValid( WORKLIST_ASSISTITI.wkAssistiti ) ) {
			
			var h = $('.contentTabs').innerHeight() - $('#fldWorklistAssistiti').outerHeight(true) - 10;
			$( '#'+ parameters.container ).height( h );
		}
		
		WORKLIST_ASSISTITI.wkAssistiti = new WK( parameters );
		WORKLIST_ASSISTITI.wkAssistiti.loadWk();
		
	},
	
	/*
	 *	INTERROGAZIONE DELL'INDEXEDDB E GESTIONE TRAMITE PROMISES DEI DATI RISULTANTI.
	 *	NELLA VARIABILE recordset VANNO INSERITE TUTTE LE COLONNE DELLA WORKLIST OFFLINE_ASSISTITI 
	 */
	getWorklistData: function() 
	{
		
		var cognome			= $('#txtCognome').val().trim().toUpperCase(),
			codiceFiscale	= $('#txtCodiceFiscale').val().trim().toUpperCase(),
			recordset		= new Array(),
			dataPromise;
		
		WORKLIST_ASSISTITI.wkAssistiti.$wk.find('.clsWkLdg').addClass('forced');
		
		var funzione_checker;
		
		if (OFFLINE.ricercaSoloMieiAssistiti()) {
			funzione_checker = function(iden_med){return iden_med==home.baseUser.IDEN_PER;};
		} else {
			funzione_checker = function(iden_med){return UTENTE.inMyGroup(iden_med);};
		}
		
		if( LIB.isValid( codiceFiscale ) && codiceFiscale.length==16) {
			dataPromise = home_offline.NS_OFFLINE.TABLE.ASSISTITI.index('COD_FISC').each(
					function( record ) {
						if (funzione_checker(record.value.IDEN_MED_BASE))
							recordset.push( record.value );
					}, 
				IDBKeyRange.only( codiceFiscale )
			);
			
		} else {
			dataPromise = home_offline.NS_OFFLINE.TABLE.ASSISTITI.index('COGN').each(
					function( record ) {
						if (funzione_checker(record.value.IDEN_MED_BASE) && WORKLIST_ASSISTITI.whereCondition(record))
							recordset.push( record.value );
					},
				IDBKeyRange.bound( cognome, cognome + '\uffff' )
			);
		}
		
		
		return dataPromise.done(
			function() {
				WORKLIST_ASSISTITI.wkJSON = WORKLIST_ASSISTITI.getWorklistJSON( recordset );
				WORKLIST_ASSISTITI.wkAssistiti.$wk.worklist().data.result = WORKLIST_ASSISTITI.wkJSON;
				WORKLIST_ASSISTITI.wkAssistiti.$wk.worklist().grid.populate( WORKLIST_ASSISTITI.wkJSON );
				
				WORKLIST_ASSISTITI.wkAssistiti.$wk.find('.clsWkLdg').removeClass('forced');
				
				return recordset;
			});
	},
	
	/*
	 *	FILTRA TRAMITE WHERE CONDITION I DATI RICEVUTI DA getWorklistData().
	 *	RITORNA TRUE SE IL RECORD PUO' ESSERE INSERITO NELLA WORKLIST, FALSE ALTRIMENTI. 
	 */
	whereCondition: function( recordset ) {
		var nome	= $('#txtNome').val().trim().toUpperCase(),
			data	= $('#h-txtDataDiNascita').val(),
			passed	= true;
		
		if( nome != '' && recordset.value['NOME'].indexOf(nome) < 0 )
			passed = false;
		
		if( data != '' && recordset.value['DATAORDER'] != data )
			passed = false;
		
		return passed;
	},
	
	/*
	 *	COSTRUISCE IL JSON DI DATI COSI' COME LO RESTITUIREBBE LA SERVLET DELLA WORKLIST SE FOSSE INTERROGATA.
	 *	ANCHE QUI VANNO INSERITE TUTTE LE COLONNE DEFINITE NELLA STRUTTURA DELLA WORKLIST
	 */
	getWorklistJSON: function( recordset ) {
		var json = { 'page' : {}, 'rows' : [] };
		json.page = { 'total' : 1, 'current' : 1, 'size' : 100 };
		for( var i = 0; i < recordset.length; i++ ) {
			var row = recordset[i];
			row.N_ROW=i;
			json.rows.push( row );
		}
		return json;
	},
	
};



