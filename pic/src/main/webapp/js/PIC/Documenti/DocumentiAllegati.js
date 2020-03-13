var DOCUMENTI_ALLEGATI = {

	extensions: 	[ 'pdf', 'xls', 'xlsx', 'png', 'jpeg', 'jpg', 'gif', 'doc', 'bmp', 'docx', 'avi', 'txt' ],
//	fileServerPath: 'DocumentoAllegato',
	fileServerPath: 'DocumentoAllegato;jsessionid=' + home.$("#AppStampa param[name=session_id]").val(),	

	init: function() {
		DOCUMENTI_ALLEGATI.tabWorklist	= $('#li-tabDocumentiAllegati');
		DOCUMENTI_ALLEGATI.tabAllega	= $('#li-tabAllegaDocumento');
		DOCUMENTI_ALLEGATI.file			= $('#AllegaFile');
		DOCUMENTI_ALLEGATI.nomeAllegato	= $('#txtNomeAllegato');
		DOCUMENTI_ALLEGATI.comboScanner = $("#comboScanner");
		
		DOCUMENTI_ALLEGATI.setEvents();

		!LIB.isValid($('#TIPO_EPISODIO').val()) || $('#TIPO_EPISODIO').val() == '' ? 
				($('#radAllegaPazienteEpisodio').data('RadioBox').selectByValue( 'P' ), DOCUMENTI_ALLEGATI.loadWk()) : 
				($('#radAllegaPazienteEpisodio').data('RadioBox').selectByValue( 'E' ), DOCUMENTI_ALLEGATI.tabAllega.trigger('click'));

		$('#radAllegaPazienteEpisodio').data('RadioBox').disable();
		
		$("#radTipoCaricamentoFile_daFile").trigger("click");
	},
	
	setEvents: function() {
		DOCUMENTI_ALLEGATI.tabWorklist.on('click', DOCUMENTI_ALLEGATI.clearForm );
		DOCUMENTI_ALLEGATI.tabAllega.on('click', function(){
			$('.butSalva').show();
		});
		
		DOCUMENTI_ALLEGATI.file.on('change', function() {
			DOCUMENTI_ALLEGATI.nomeAllegato.val( ( $(this).val().split('\\') )[ $(this).val().split('\\').length - 1 ].toString() );
		});
		
		$("#radTipoCaricamentoFile_daFile").on("click", function() {
			$("#AllegaFile").parent().parent().show();
			$("#lblSelezionaScanner").parent().hide();
		});

		$("#radTipoCaricamentoFile_daScanner").on("click", function() {
			$("#AllegaFile").parent().parent().hide();
			$("#lblSelezionaScanner").parent().show();
			if (DOCUMENTI_ALLEGATI.nomeAllegato.val() == "") {
				DOCUMENTI_ALLEGATI.nomeAllegato.val(DOCUMENTI_ALLEGATI.getDescrizioneFileScanner());
			}
			/*if (DOCUMENTI_ALLEGATI.comboScanner.find("option").length == 0) {
				var scanner = JSON.parse(home.AppStampa.getScannerList(DOCUMENTI_ALLEGATI.scannerDllPath))["scanners"];
				var s;
				for (s=0; s < scanner.length; s++) {
					var selected = localStorage["fenixMMG_SCANNER"] == scanner[s] ? " selected='selected'" : "";
					$("<option" + selected + ">" + scanner[s] + "</option>").appendTo(DOCUMENTI_ALLEGATI.comboScanner);
				}
				if (s==0) {
					home.NOTIFICA.warning({
						message: 'Nessuno scanner rilevato',
						title: 'Attenzione'
					});
					$("#radTipoCaricamentoFile_daFile").trigger("click");
				}
			}*/
		});
	},
	
	clearForm: function() {
		$('#IDEN, #txtNomeAllegato, #AllegaFile').val( '' );
		$('.butSalva').hide();
		DOCUMENTI_ALLEGATI.loadWk();
	},
	
	beforeSave : function(){
			
			if(!DOCUMENTI_ALLEGATI.daScanner() && DOCUMENTI_ALLEGATI.checkExtension( $('#AllegaFile').val() ) == -1 ) {
				home.NOTIFICA.warning({
					message: 'L\'estensione del file che si sta tentando di caricare non e\' supportata! <br>Le estensioni ammesse sono:<br> ' + DOCUMENTI_ALLEGATI.extensions.join(', '),
					title: 'Attenzione'
				});

				return false;
			} else {
				$('input#IDEN_ANAG').clone().appendTo('form#dati');
				return true;
			}
 
	},
	
	checkExtension : function( file ){
		var ext		 = file.split('.');
		ext			 = ext[ ext.length -1 ].toString().toLowerCase();
		return $.inArray( ext, this.extensions );
	},
	
	daScanner: function() {
		return $("#h-radTipoCaricamentoFile").val() == "daScanner";
	},
	
	save : function() {
		if (DOCUMENTI_ALLEGATI.daScanner()) {
			DOCUMENTI_ALLEGATI.saveFileScanner();
		} else {
			DOCUMENTI_ALLEGATI.saveFile();
		}
	},

	saveFile : function() {
		
		$.support.cors = true;

		$('form#dati').attr( { 'enctype' : 'multipart/form-data', 'action' : DOCUMENTI_ALLEGATI.getActionForm(), 'method' : 'POST'} );

		$('form#dati').ajaxForm({
			url:			DOCUMENTI_ALLEGATI.fileServerPath,
			crossDomain:	true ,
			dataType:		'json',
			type:			'POST'
		}).ajaxSubmit({
			 success : function( response ) {
				 var status = response.split('$')[0];
				 var message = response.split('$')[1];
				 
				 if( status == 'OK' )  {
					 home.NOTIFICA.success({ 'title': 'Successo', 'message': traduzione.fileCaricato });
					 DOCUMENTI_ALLEGATI.tabWorklist.trigger('click');
				 } else {
					 home.NOTIFICA.error({ 'title': 'Errore', 'message': message }); 
				 }
				 
			  },
			  error: function( response ) {
				  home.NOTIFICA.error({ 'title': 'Errore', 'message': response });
			  }
		});
	},
	
	getDescrizioneFileScanner: function() {
		return "Scansione-" + moment().format("YYYY-MM-DD_HHmm");
	},
	
	scannerFormat: "jpg",
	
	scannerDllPath: "${APPDATA}/fenixMMG/AspriseJTwain.dll",
	
	saveFileScanner: function() {
		
		if (DOCUMENTI_ALLEGATI.nomeAllegato.val().trim().length == 0) {
			DOCUMENTI_ALLEGATI.nomeAllegato.val(DOCUMENTI_ALLEGATI.getDescrizioneFileScanner());
		}
		
		var scanner_selezionato = DOCUMENTI_ALLEGATI.comboScanner.val();
		localStorage["fenixMMG_SCANNER"]=scanner_selezionato;
		var response = home.AppStampa.scanGeneric(
				scanner_selezionato,
				DOCUMENTI_ALLEGATI.scannerDllPath,
				home.NS_FENIX_TOP.getAbsolutePathServer() + DOCUMENTI_ALLEGATI.getActionForm(),
				"{'fileParameterName':'file'}",
				'{"methodsSource":[' +
					'{"setAutoScan": [true]},' +
					'{"setAutoFeed": [true]},' +
					'{"setUIEnabled": [false]},' +
					'{"setAuthor": [' + home.baseUser.USERNAME + ']},' +
					'{"setXResolution": [150.0]},' +
					'{"setYResolution": [150.0]}' +
				'],' +
				'"output":"' + DOCUMENTI_ALLEGATI.scannerFormat + '"},' +
				'"methodsImageWriteParam":{"setCompressionMode":[2]},' +
				'{"setCompressionQuality":[0.8f]}'
		); /*setCompression: 6 JPEG, 9 PNG */

		var status = response.split('$')[0];
		var message = response.split('$')[1];
		if (status == "OK") {
			home.NOTIFICA.success({ 'title': 'Successo', 'message': traduzione.fileCaricato });
			DOCUMENTI_ALLEGATI.tabWorklist.trigger('click');
		} else {
			home.NOTIFICA.error({ 'title': 'Errore', 'message': message }); 
		}
	},
	
	getActionForm: function() {
		var url				= DOCUMENTI_ALLEGATI.fileServerPath + '?';
		var iden_episodio	= $('#IDEN_EPISODIO').val() || '';
		var tipo_episodio	= $('#TIPO_EPISODIO').val() || '';
		var descrizione		= DOCUMENTI_ALLEGATI.nomeAllegato.val();
		var nome_file;
		var mimetype;
		if (DOCUMENTI_ALLEGATI.daScanner()) {
			nome_file = descrizione + "." + DOCUMENTI_ALLEGATI.scannerFormat;
			mimetype = LIB.getMymeType(DOCUMENTI_ALLEGATI.scannerFormat);
		} else {
			nome_file = $('#AllegaFile').val();
			mimetype = LIB.getMymeType( ( nome_file.split('.') )[ nome_file.split('.').length -1 ].toString().toLowerCase() );
		}
		var tipo_documento	= $('#cmbTipoDocAllegato').val();
		
		url += 'IDEN_ANAG='			+ home.ASSISTITO.IDEN_ANAG;
		url += '&IDEN_EPISODIO=' 	+ iden_episodio;
		url += '&TIPO_EPISODIO=' 	+ tipo_episodio;
		url += '&DESCRIZIONE=' 		+ encodeURIComponent(descrizione);
		url += '&MIME_TYPE=' 		+ mimetype;
		url += '&UTENTE=' 			+ encodeURIComponent(home.baseUser.USERNAME);
		url += '&IDEN_PER='			+ home.baseUser.IDEN_PER;
		url += '&NOME_FILE=' 		+ encodeURIComponent(nome_file);
		url += '&TIPO_DOCUMENTO=' 	+ tipo_documento;
		
		return url;
	}
};

$(document).ready(function() {
	DOCUMENTI_ALLEGATI.init();
	NS_FENIX_SCHEDA.registra = DOCUMENTI_ALLEGATI.save;
});