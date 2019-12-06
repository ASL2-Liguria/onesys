$(document).ready(function() {

	SEGNALAZIONI.init();
	SEGNALAZIONI.setEvents();

	NS_FENIX_SCHEDA.beforeSave = SEGNALAZIONI.beforeSave;
	NS_FENIX_SCHEDA.customizeJson = SEGNALAZIONI.customizeJSON;
});

var SEGNALAZIONI = {

	init : function() {

		if ($('#IDEN').val() != '')
			SEGNALAZIONI.setDefaults();

		SEGNALAZIONI.setLayout();
		SEGNALAZIONI.setEditorHeight();
		SEGNALAZIONI.addTinyMCE();
	},

	setEvents : function() {

		$('#li-tabSegnalazioni').on('click', SEGNALAZIONI.loadWk);
		//$("#radTipoSegnalazione").on('click', SEGNALAZIONI.sceltaTipologia);
	},

	addTinyMCE : function() {

		$('textarea').attr('maxLength', 4000);

		tinymce.init({
			selector : 'textarea',
			mode : 'exact',
			plugins : ''
		});
	},

	beforeSave : function() {

		if ($('#hStatoSegnalazione').val() == '')
			$('#hStatoSegnalazione').val('A');

		return true;
	},

	customizeJSON : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'TESTO',
			'col' : 'TESTO',
			'val' : tinyMCE.activeEditor.getContent()
		});
		json.campo.push({
			'id' : 'UTE_INS',
			'col' : 'UTE_INS',
			'val' : home.baseUser.IDEN_PER
		});

		return json;
	},

	getEditorHeight : function() {

		return $('.contentTabs').innerHeight()
				- $('#fldErroreApplicativo').outerHeight(true)
				- $('#fldProblemaAnagrafica').outerHeight(true)
				- $('#fldInserimentoSegnalazioni').outerHeight(true)
				- $('#fldTesto').outerHeight(true) - 45;
	},

	loadWk : function() {

		var parameters = {
			'id' : 'SEGNALAZIONI',
			'container' : 'divWk',
			'aVal' : [],
			'aBind' : []
		};

		if (!LIB.isValid(SEGNALAZIONI.wk)) {

			var height = $('.contentTabs').innerHeight()
					- $('#fldSegnalazioni').outerHeight(true);

			$('#' + parameters.container).height(height);

			SEGNALAZIONI.wk = new WK(parameters);
			SEGNALAZIONI.wk.loadWk();

		} else
			SEGNALAZIONI.wk.filter(parameters);
	},
	
	sceltaTipologia:function(){
		
		/*var scelta = $("#radTipoSegnalazione").data("RadioBox").val();
		
		if(scelta == 'ERRORE_APPLICATIVO'){
			$("#fldErroreApplicativo").show();
			$("#fldProblemaAnagrafica").hide();
			$("#radProblemaAnagrafica").data("RadioBox").deselectAll();
		}else if(scelta == 'PROBLEMA_ANAGRAFICA'){
			$("#fldErroreApplicativo").hide();
			$("#radErroreApplicativo").data("RadioBox").deselectAll();
			$("#fldProblemaAnagrafica").show();
		}else{
			$("#fldErroreApplicativo").hide();
			$("#fldProblemaAnagrafica").hide();
			$("#radErroreApplicativo").data("RadioBox").deselectAll();
			$("#radProblemaAnagrafica").data("RadioBox").deselectAll();
		}
		*/
		
	},
	
	setDefaults : function() {

		var cmbTipoSegnalazione = LIB.isValid(home.ASSISTITO.IDEN_ANAG) ? 'ERRORE_PAZIENTE'
				: 'ERRORE';

		$('#cmbTipoSegnalazione').val(cmbTipoSegnalazione);
	},
	
	setEditorHeight : function() {

		$('#Testo').height(SEGNALAZIONI.getEditorHeight());
	},
	
	setLayout:function(){
		
		$("#fldErroreApplicativo").hide();
		$("#fldProblemaAnagrafica").hide();
	}
};

var NS_MENU_SEGNALAZIONI = {

		whereApri: function( rec ){
			return rec.length == 1;
		},
		
		apri: function( rec, n_scheda ){
			
			home.NS_MMG.reloadPage( n_scheda, 'SEGNALAZIONI', '&IDEN=' + rec[0]['IDEN'] );
		}
};
