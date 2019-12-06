$(document)
		.ready(
				function() {

					ANAGRAFICA_CERTIFICATI.init();
					ANAGRAFICA_CERTIFICATI.setEvents();

					$('#IDEN').length > 0 ? $('#li-tabAnagraficaCertificati')
							.trigger('click') : ANAGRAFICA_CERTIFICATI.loadWk();

					NS_FENIX_SCHEDA.customizeJson = ANAGRAFICA_CERTIFICATI.customizeJSON;
					NS_FENIX_SCHEDA.afterSave = ANAGRAFICA_CERTIFICATI.afterSave;

				});

var ANAGRAFICA_CERTIFICATI = {

	init : function() {

		home.ANAGRAFICA_CERTIFICATI = this;
		ANAGRAFICA_CERTIFICATI.descrizione = $('#txtDescrizione');
		$(".butSalva").hide();
		
		if($("#ACTION").val() == 'INS'){
			$('#li-tabAnagraficaCertificati').trigger("click");
		}
	},

	setEvents : function() {

		$('#li-tabListaCertificati').on('click', function() {
			ANAGRAFICA_CERTIFICATI.loadWk;
			$(".butSalva").hide();
		});

		$('#li-tabAnagraficaCertificati').on('click', function() {
			$(".butSalva").show();
		});

		$('#h-radSegnaposto')
				.on(
						'change',
						function() {

							var text = ANAGRAFICA_CERTIFICATI.descrizione.val(), placeholder = $(
									this).val();

							ANAGRAFICA_CERTIFICATI.descrizione.val(text
									+ placeholder);

						});

		$('#txtDescrizione')
				.on(
						'keydown',
						function(event) {

							if (event.keyCode == '9') {

								var val = this.value, start = this.selectionStart, end = this.selectionEnd;

								this.value = val.substring(0, start) + '\t'
										+ val.substring(end);
								this.selectionStart = this.selectionEnd = start + 1;

								return false;

							}

						});

	},

	loadWk : function() {

		var parameters = {
			'id' : 'ANAGRAFICA_CERTIFICATI',
			'aBind' : [ 'ute_ins' ],
			'aVal' : [ home.baseUser.IDEN_PER ]
		};

		if (!LIB.isValid(ANAGRAFICA_CERTIFICATI.wkCertificati)) {

			var height = $('.contentTabs').innerHeight() - 50;

			$('#divWk').height(height);

			ANAGRAFICA_CERTIFICATI.wkCertificati = new WK(parameters);
			ANAGRAFICA_CERTIFICATI.wkCertificati.loadWk();

		} else
			ANAGRAFICA_CERTIFICATI.wkCertificati.filter(parameters);

	},

	customizeJSON : function(json) {
		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'UTE_INS',
			'col' : 'UTE_INS',
			'val' : $('#UTE_INS').val()
		});
		return json;
	},

	afterSave : function() {
		$('#li-tabListaCertificati').trigger('click');
		if (LIB.isValid(home.ALTRE_STAMPE)
				&& LIB.isValid(home.ALTRE_STAMPE.loadStandardText)) {
			home.ALTRE_STAMPE.loadStandardText();
		}
		home.NS_MMG.apri('ANAGRAFICA_CERTIFICATI', '');
		return true;
	},

	modificaCertificato : function(riga) {
		var iden = riga[0].IDEN;
		home.NS_MMG.apri('ANAGRAFICA_CERTIFICATI', '&IDEN=' + iden);
	},

	cancellaCertificato : function(riga) {
		if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].UTE_INS)) {
			var iden = riga[0].IDEN;
			toolKitDB.executeFunctionDatasource(
				'MMG.CANCELLA_CERTIFICATO_STANDARD',
				'MMG_DATI', {
					'pIden' : iden
				},
				function(response) {
					var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
					if (status == 'OK') {
						ANAGRAFICA_CERTIFICATI.loadWk();
					} else {
						home.NOTIFICA.error({
							message : message,
							title : 'Errore!'
						});
					}
				}
			);
		}
	}

};