$(document).ready(function() {

	APPUNTI.init();
	APPUNTI.setEvents();
	NS_FENIX_SCHEDA.customizeJson = APPUNTI.customizeJSON;
	NS_FENIX_SCHEDA.afterSave = APPUNTI.afterSave;
});

var APPUNTI = {

	toPrint : false,

	init : function() {

		home.APPUNTI = this;
		APPUNTI.initTinyMCE();
		APPUNTI.loadWk();
	},

	setEvents : function() {

		$('#li-tabAppunti').on('click', function() {
			$('.butStampa').show();
			$("#tabAppunti").show();
		});
		
		$("body").on("keyup",function(e) {
		    if(e.keyCode == 13){
		    	APPUNTI.loadWk();		    
		    }
		});
		

		$('#li-tabListaAppunti, #butApplica').on('click', function() {
			$('.butStampa').hide();
			$("#tabAppunti").hide();
			APPUNTI.loadWk();
		});

		$('.butStampa').on('click', function() {
			APPUNTI.toPrint = true;
			NS_FENIX_SCHEDA.registra();
		});
	},

	initTinyMCE : function() {

		$('#txtTesto').height(APPUNTI.getTextHeight());

		tinymce.init({
			selector : 'textarea',
			mode : 'exact',
			plugins : '',
			menubar : false,
			style_formats : [ {
				title : 'Paragraph',
				format : 'p'
			} ],
			statusbar : false
		});
	},

	getTextHeight : function() {
		return $('.contentTabs').innerHeight()
				- $('#fldAppunti').outerHeight(true) - 60;
	},

	loadWk : function() {

		var titolo = $('#txtFiltroTitolo').val(), tipologia = $(
				'#radFiltroTipologia').data('RadioBox').val(), da_data = $('#h-txtDaData').val() != '' ? $(
				'#h-txtDaData').val()
				: '0', a_data = $('#h-txtAData').val();

		var parameters = {
			'id' : 'APPUNTI',
			'container' : 'divWk',
			'aBind' : [ 'iden_medico', 'titolo', 'tipologia', 'da_data',
					'a_data' ],
			'aVal' : [ home.baseUser.IDEN_PER, titolo, tipologia, da_data,
					a_data ]
		};

		if (!LIB.isValid(APPUNTI.wk)) {

			var height = $('.contentTabs').innerHeight()
					- $('#fldFiltriAppunti').outerHeight(true) - 40;
			$('#' + parameters.container).height(height);

			APPUNTI.wk = new WK(parameters);
			APPUNTI.wk.loadWk();

		} else {
			APPUNTI.wk.filter(parameters);
		}
	},

	customizeJSON : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'IDEN_MEDICO',
			'col' : 'IDEN_MEDICO',
			'val' : home.baseUser.IDEN_PER
		});
		json.campo.push({
			'id' : 'TESTO',
			'col' : 'TESTO',
			'val' : tinyMCE.activeEditor.getContent()
		});
		
		return json;
	},

	afterSave : function(obj) {
		if (APPUNTI.toPrint) {
			APPUNTI.stampa($('#IDEN').val());
		}

		$('#IDEN').val('');
		$('#li-tabListaAppunti').trigger('click');

		return true;
	},

	stampa : function(iden) {

		var v_report = 'APPUNTI_MEDICO.RPT', prompts = {
			pIden : iden,
			pIdenPer : home.baseUser.IDEN_PER
		};

		home.NS_PRINT.print({
			path_report : v_report + '&t=' + new Date().getTime(),
			prompts : prompts,
			show : LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI', 'N'),
			output : 'pdf'
		});

		home.APPUNTI.toPrint = false;
	}
};
