var MANUALE =
	{
		
		url: 		home.baseGlobal.URL_MANUALE,
		section:	'',
		
		/*
		 * INSERIRE QUI IL KEY_LEGAME DELLA PAGINA COME CHIAVE E L'ID DELLA PAGINA DEL MANUALE COME VALORE
		 */
		pages:  
			[
			 	{ 'MMG_AGENDA':						'agenda' },
			 	{ 'ALTRE_STAMPE':					'cartella-assistito/altre-stampe' },
			 	{ 'BACHECA':						'cartella-assistito/bacheca' },
			 	{ 'DIARI_WK':						'cartella-assistito/diari-e-visite' },
			 	{ 'DOCUMENTI_PAZIENTE':				'cartella-assistito/documenti-paziente' },
			 	{ 'MMG_CERTIFICATO_MALATTIA': 		'cartella-assistito/certificati-di-malattia' },
			 	{ 'MMG_WORKLIST_CERTIFICATI': 		'cartella-assistito/certificati-di-malattia' },
			 	{ 'MMG_PATIENT_SUMMARY': 			'cartella-assistito/patient-summary' },
			 	{ 'MMG_STAMPANTE': 					'configurazioni/configurazione-stampanti' },
			 	{ 'MMG_VISITE': 					'cartella-assistito/diari-e-visite' },
			 	{ 'TAB_RR_ACCERTAMENTI':			'cartella-assistito/prescrizione-ricette/prescrizione-accertamenti' },
			 	{ 'TAB_RR_FARMACI': 				'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'UTENTI':							'configurazioni/configurazione-utente' },
			 	{ 'RIEP_ACCESSI_PROBLEMI':			'cartella-assistito/problemi' },
			 	{ 'INSERIMENTO_PROBLEMA':			'cartella-assistito/problemi' },
			 	{ 'INSERIMENTO_DIARIO':				'cartella-assistito/diari-e-visite' },
			 	{ 'MMG_VISITE':						'cartella-assistito/diari-e-visite' },
			 	{ 'MMG_SCELTA_POSOLOGIA':			'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'MMG_SCELTA_FARMACI':				'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'MMG_SCELTA_ESENZIONI':			'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'MMG_SCELTA_POSOLOGIA':			'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'MMG_SCELTA_ACCERTAMENTI':		'cartella-assistito/prescrizione-ricette/prescrizione-accertamenti' },
			 	{ 'MMG_SCELTA_POSOLOGIA':			'cartella-assistito/prescrizione-ricette/prescrizione-farmaci' },
			 	{ 'PANNELLO_NOTIFICHE':				'notifiche-in-tempo-reale' },
			 	{ 'MMG_SOSTITUZIONE_MEDICO':		'medico/sostituzione-temporanea' },
				{ 'ricetta_dematerializzata':		'cartella-assistito/prescrizione-ricette/prescrizione-ricette-dematerializzate' }
			],	

		getUrl: function()
		{
			
			return MANUALE.url;
			
		},
		
		pageExists: function( key_legame )
		{	
			var exists = false;
			
			for( var i = 0; i < MANUALE.pages.length; i++ ){
				
				for( var key in MANUALE.pages[i] )
				{
					if( key == key_legame )
					{
						exists			= true;
						MANUALE.section	= MANUALE.pages[i][key]; 	
					}
				}
			}
				
			return exists;
			
		},
		
		open: function( key_legame )
		{
			if( MANUALE.pageExists( key_legame ) )
			{
				
				window.open( MANUALE.getUrl() + MANUALE.section, 'Manuale_MMG' );
				
			}
			else
			{
				
				var message = traduzione.lblNoPagineManuale, title = traduzione.lblInformazione;
				
				home.NOTIFICA.info( { 'title' : title, 'message' : message });
				
			}
			
		}
		
	};