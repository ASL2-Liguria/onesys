$(document).ready(function() {

	AGGIORNAMENTI.init();
	AGGIORNAMENTI.setEvents();

	NS_FENIX_SCHEDA.customizeJson = AGGIORNAMENTI.customizeJSON;
	NS_FENIX_SCHEDA.beforeSave = AGGIORNAMENTI.beforeSave;
	NS_FENIX_SCHEDA.successSave = AGGIORNAMENTI.successSave;
});

var AGGIORNAMENTI = {

	init : function() {

		$('#testo').css('height', AGGIORNAMENTI.getTextHeight());
		$("#txtProgetto").val("MMG");
		if (LIB.isValid($('#IDEN').val()))
			AGGIORNAMENTI.loadData();

		AGGIORNAMENTI.addEditor();
	},

	setEvents : function() {

		$("#txtTitoloAggiornamento").on("blur", function() {

			$(this).val($(this).val().toUpperCase());
		});

		$('#li-tabWorklist').on('click', AGGIORNAMENTI.loadWk);

	},

	loadWk : function() {

		var parameters = {
			'id' : 'WORKLIST_AGGIORNAMENTI',
			'container' : 'divWk',
			'aBind' : [ '' ],
			'aVal' : [ '' ]
		};

		if (!LIB.isValid(AGGIORNAMENTI.wk)) {

			var height = $('.contentTabs').innerHeight()
					- $('#fldWorklist').outerHeight(true) - 20;

			$('#' + parameters.container).height(height);

			AGGIORNAMENTI.wk = new WK(parameters);
			AGGIORNAMENTI.wk.loadWk();

		} else
			// AGGIORNAMENTI.wk.filter( parameters );
			AGGIORNAMENTI.refreshWk();

	},

	refreshWk : function() {
		AGGIORNAMENTI.wk.filter({
			'id' : 'WORKLIST_AGGIORNAMENTI',
			'container' : 'divWk',
			'aBind' : [ '' ],
			'aVal' : [ '' ]
		});
	},

	beforeSave : function() {
		// $("#hTesto").val(tinyMCE.activeEditor.getContent());
		return true;
	},

	successSave : function() {
		$('#IDEN').val('');
		home.NS_FENIX_TOP.chiudiUltima();
	},

	getTextHeight : function() {

		return $('.contentTabs').innerHeight()
				- $('#fldAggiornamenti').outerHeight(true)
				- $('#fldTesto').outerHeight(true) - 40;
	},

	addEditor : function() {

		tinymce.init({
			selector : 'textarea',
			mode : 'exact',
			plugins : ''
		});
	},

	customizeJSON : function(json) {
		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'MESSAGGIO',
			'col' : 'MESSAGGIO',
			'val' : tinyMCE.activeEditor.getContent()
		});
		console.log(json);
		return json;
	},

	loadData : function() {

		var parameters = {
			'iden' : $('#IDEN').val(),
			'iden_anag' : home.ASSISTITO.IDEN_ANAG
		};

		dwr.engine.setAsync(false);
		toolKitDB.getResultDatasource('SDJ.Q_ACCERTAMENTI', 'MMG_DATI',
				parameters, null, function(response) {

					if (LIB.isValid(response))
						$('#testo').val(response[0]['MESSAGGIO']);
				});
		dwr.engine.setAsync(true);
	},

	cancellaAggiornamento : function(row, action) {
		toolKitDB.executeProcedureDatasource(
			'CANCELLA_AGGIORNAMENTO',
			'MMG_DATI', {
				'pIdenScheda' : row[0].IDEN,
				'pAction' : action
			},
			function(response) {
				var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
				if (status == 'OK') {
					home.NOTIFICA.success({
						message : message,
						title : 'Successo!'
					});
					AGGIORNAMENTI.refreshWk();
				} else {
					home.NOTIFICA.error({
						message : message,
						title : 'Errore!'
					});
				}
			}
		);
	},

	modificaAggiornamento : function(row, n_scheda) {
		// alert('IDEN' + row[0].IDEN)
		// alert('n_scheda' + n_scheda)
		home.NS_MMG.reloadPage(n_scheda, 'AGGIORNAMENTI', '&IDEN=' + row[0]['IDEN']);
	},
};