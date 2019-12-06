$(document).ready(function() {

	MEDICINA_INIZIATIVA.init();
	MEDICINA_INIZIATIVA.setEvents();

	NS_FENIX_SCHEDA.customizeJson = MEDICINA_INIZIATIVA.customizeJSON;
	NS_FENIX_SCHEDA.successSave = MEDICINA_INIZIATIVA.successSave;

});

var MEDICINA_INIZIATIVA = {

	init : function() {

		$('#li-tabInserimentoMedicinaDiIniziativa').trigger('click');

	},

	setEvents : function() {

		$('#li-tabListaMedicinaDiIniziativa').on('click',
				MEDICINA_INIZIATIVA.loadWk);

	},

	loadWk : function() {

		var parameters = {
			'id' : 'MEDICINA_DI_INIZIATIVA',
			'aBind' : [ 'iden_anag' ],
			'aVal' : [ home.ASSISTITO.IDEN_ANAG ]
		};

		if (!LIB.isValid(MEDICINA_INIZIATIVA.wk)) {

			var height = $('.contentTabs').innerHeight() - 20;

			$('#divWk').height(height);

			MEDICINA_INIZIATIVA.wk = new WK(parameters);
			MEDICINA_INIZIATIVA.wk.loadWk();

		} else
			MEDICINA_INIZIATIVA.wk.filter(parameters);

	},

	customizeJSON : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'IDEN_ANAG',
			'val' : home.ASSISTITO.IDEN_ANAG,
			'col' : 'IDEN_ANAG'
		});
		json.campo.push({
			'id' : 'UTE_INS',
			'val' : home.baseUser.IDEN_PER,
			'col' : 'UTE_INS'
		});

		return json;

	},

	successSave : function(iden) {

		var vMsg = 'Aderito al percorso di iniziativa '
			+ $('#cmbTipoMedicinaDiIniziativa :selected').text()
			+ ' in data ' + moment().format('DD/MM/YYYY');
		
		var vParameters = {
			'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
			'PIDENSCHEDA' 		: { v : iden, t : 'N'},
			'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
			'PIDENPROBLEMA'	 	: { v : null, t : 'N'},
			'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
			'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
			'P_DATA' 			: { v : moment().format('YYYYMMDD'), t : 'V'},
			'P_ACTION' 			: { v : 'MOD_SCHEDA', t : 'V'},
			'P_IDEN_NOTA'		: { v : '', t : 'N'},
			'V_OSCURATO'		: { v : 'N', t : 'V'},
			'P_NOTEDIARIO' 		: { v : vMsg, t : 'C'},
			'P_TIPO' 			: { v : 'MEDICINA_DI_INIZIATIVA', t : 'V'},
			'p_sito' 			: { v : 'MMG', t : 'V'},
			"V_RETURN_DIARIO"	: { t : 'V', d: 'O'}
		};

		$('#li-tabListaMedicinaDiIniziativa').trigger('click');

		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			id:'SP_NOTE_DIARIO',
			parameter: vParameters
		}).done( function() {});
		
		return true;
	}

};

var NS_MENU_MEDICINA_INIZIATIVA = {
	
		inserisci: function( rec, n_scheda ){
			
			 home.NS_MMG.reloadPage( n_scheda, 'MEDICINA_DI_INIZIATIVA', '&IDEN=' );
		},
		
		modifica: function( rec, n_scheda ){
			
			home.NS_MMG.reloadPage( n_scheda, 'MEDICINA_DI_INIZIATIVA', '&IDEN=' + rec[0]['IDEN'] );
		}
};
