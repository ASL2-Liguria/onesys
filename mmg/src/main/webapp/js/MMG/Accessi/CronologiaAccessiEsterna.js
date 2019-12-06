$(document).ready(function()
{

	CRONOLOGIA_ACCESSI.init();
	CRONOLOGIA_ACCESSI.setEvents();

});

var CRONOLOGIA_ACCESSI = {
	
	init: function() {
		home.CRONOLOGIA_ACCESSI_ESTERNA = this;
		CRONOLOGIA_ACCESSI.loadWk();
	},
	
	setEvents: function() {
		$('#txtCognome, #txtNome, #txtCodiceFiscale').on('keydown', function( event ) {
			$(this).val( $(this).val().toUpperCase() );
			if( event.keyCode == 13 )
				CRONOLOGIA_ACCESSI.loadWk();
		});
		$('#butApplica').on('click', CRONOLOGIA_ACCESSI.loadWk );
		$('.butStampa').on('click', CRONOLOGIA_ACCESSI.stampa );
	},
	
	checkFilters: function() {
		var passed = true;
		if( $('#txtCognome').val().length < 2 ) {
			home.NOTIFICA.warning({ 'message' : 'Inserire almeno 2 caratteri per il campo COGNOME.', 'title' : 'Attenzione' });
			passed = false;
		}
		return passed;
	},
	
	loadWk: function() {
		
		var  parameters =  {
			'id'		: 'CRONOLOGIA_ACCESSI_ESTERNA',
			'container'	: 'divWk',
			'aBind'		: ['da_data_accesso', 'a_data_accesso', 'cognome', 'nome', 'codice_fiscale', 'pIdenPer'],
			'aVal'		: [ $('#h-txtDaDataAccesso').val(), $('#h-txtADataAccesso').val(), $('#txtCognome').val().toUpperCase(), $('#txtNome').val().toUpperCase(), $('#txtCodiceFiscale').val().toUpperCase(), home.baseUser.IDEN_PER ]
		};
		
//		if( CRONOLOGIA_ACCESSI.checkFilters() )
//		{
		
			if( !LIB.isValid( CRONOLOGIA_ACCESSI.wk ) ) {
				$( '#'+ parameters.container ).height(  CRONOLOGIA_ACCESSI.getWkHeight() );
				CRONOLOGIA_ACCESSI.wk = new WK( parameters );
				CRONOLOGIA_ACCESSI.wk.loadWk();
			} else {
				CRONOLOGIA_ACCESSI.wk.filter( parameters );
			}
//		}	
			
	},
	
	getWkHeight: function() {
		return $('.contentTabs').innerHeight() - $('#fldFiltri').outerHeight( true ) - 20;
	},
	
	stampa: function() {
		var vDaData 	= $("#h-txtDaDataAccesso").val() == '' ? moment().subtract('months', 1).format('YYYYMMDD') : $("#h-txtDaDataAccesso").val();
		var vAData 		= $("#h-txtADataAccesso").val() == '' ? moment().format('YYYYMMDD') : $("#h-txtADataAccesso").val();
		var vNome 		= $("#txtNome").val();
		var vCognome 	= $("#txtCognome").val();
		var vCodFisc 	= $("#txtCodiceFiscale").val();
		
		var prompts = {
			pNome		: vNome,
			pCognome	: vCognome,
			pCodFisc	: vCodFisc,
			pDaData		: vDaData, 
			pAData		: vAData, 
			pIdenMed	: home.baseUser.IDEN_PER 
		};
	
		home.NS_PRINT.print({
			path_report	: "CRONOLOGIA_ACCESSI_ESTERNA.RPT" + "&t=" + new Date().getTime(),
			prompts		: prompts,
			show		: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output		: "pdf"
		});
	}
};

var NS_MENU_CRONOLOGIA_ACCESSI ={
		
		apriCartella: function( rec ){
			
			NS_MENU_WORKLIST_ASSISTITI.apriCartellaAssistito( rec ); 
			NS_FENIX_SCHEDA.chiudi();
		},
		
		cancellaAccesso: function( rec ){
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'UPD_CAMPO_STORICIZZA',
	            parameter:
	            {
	            	"pIdenPer" 		: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pTabella" 		: { v : "MMG_ACCESSI", t : 'V'},
					"pNomeCampo" 	: { v : "DELETED", t : 'V'},
					"pIdenTabella" 	: { v : rec[0].IDEN_ACCESSO, t : 'N' },
					"pNewValore" 	: { v : "S", t : 'V' }
	            }
			}).done( function() {
				
				home.NOTIFICA.success({ message : 'Accesso cancellato correttamente per il paziente '+ rec[0].PAZIENTE, title : 'Successo!' });
				home.CRONOLOGIA_ACCESSI_ESTERNA.loadWk();
				
			});
		}
};
