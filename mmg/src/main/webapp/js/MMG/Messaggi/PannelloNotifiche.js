/*
SELECT * FROM CONFIG_WEB.PARAMETRI_GRUPPO 
WHERE tipo = 'UTENTI' 
AND GRUPPO = 'PERMESSI_GRUPPO'
AND ATTIVO = 'S'
AND SITO = 'MMG'
AND ID_GRUPPO LIKE '%SUPER_ADMIN%';
 */
$(document).ready(function() {
	PANNELLO_NOTIFICHE.init();
	PANNELLO_NOTIFICHE.setEvents();

	home.NS_CONSOLEJS.addLogger({
		name : 'PANNELLO_NOTIFICHE',
		console : 0
	});

	PANNELLO_NOTIFICHE.logger = home.NS_CONSOLEJS.loggers['PANNELLO_NOTIFICHE'];
	NS_FENIX_SCHEDA.customizeJson = PANNELLO_NOTIFICHE.customizeJSON;
});

var PANNELLO_NOTIFICHE = {

	init : function() {

		PANNELLO_NOTIFICHE.fldProprietaFunzione = $('#fldProprietaFunzione');

		if (MMG_CHECK.isAdministrator()) {
			PANNELLO_NOTIFICHE.fldProprietaFunzione.show();
		} else {
			PANNELLO_NOTIFICHE.fldProprietaFunzione.hide();
		}
		
		PANNELLO_NOTIFICHE.loadUsers();

		var icon_obj = {
			arrowPosition : 'top'
		};
		NS_MMG_UTILITY.infoPopup(traduzione['lblNota'], icon_obj, $("#lblDurataMsg"));
	},

	setEvents : function() {
		$("#butCerca").on("click", function() {
			PANNELLO_NOTIFICHE.loadUsers();
		});
		
		var butFiltraOnline = $("#butFiltraOnline");
		butFiltraOnline.on("click", function() {
			NS_MMG_UTILITY.buttonSwitch(
					butFiltraOnline,
					{before: PANNELLO_NOTIFICHE.filtraOnline},
					{before: PANNELLO_NOTIFICHE.rimuoviFiltroOnline}
			);
		});
		
		NS_MMG_UTILITY.buttonDeselect($("#butFiltraOnline"));

		$("body").on("keyup", function(e) {
			if (e.keyCode == 13) {
				PANNELLO_NOTIFICHE.loadUsers();
			}
		});

		//controllo se il valore inserito nel campo data è un valore numerico
		$("#txtDurataMsg").on("blur", function() {

			if (!home.NS_MMG_UTILITY.checkIsNumber($(this).val())) {

				//riporto il valore a quello di default
				$("#txtDurataMsg").val("300").focus();

				home.NOTIFICA.warning({
					message : traduzione.lblInsValNum,
					title : traduzione.lblAttenzione
				});
				return;
			}
		});
	},
	
	loadUsers : function() {
		$('#ComboInUser').empty();
		var parameters = {
			'userName' : $("#txtRicercaUtenti").val().toUpperCase()
		};

		$.NS_DB.getTool({_logger : PANNELLO_NOTIFICHE.logger}).select({
			id : 'MMG_DATI.PANNELLO_NOTIFICHE_UTENTI',
			parameter : parameters
		}).done(function(response) {
			if (typeof response.result != 'undefined') {
				var length = response.result.length, option = $(document.createElement('option'));
				for (var i = 0; i < length; i++) {
					option.clone().attr('value',
					response.result[i]['VALUE']).text(response.result[i]['DESCR']).appendTo('#ComboInUser');
				}
				PANNELLO_NOTIFICHE.checkDuplicates();
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			PANNELLO_NOTIFICHE.logger.error('Errore PANNELLO_NOTIFICHE.loadUsers: ' + errorThrown);
		});
	},

	checkDuplicates : function() {
		var comboIn = $('#ComboInUser'), comboOut = $('#ComboOutUser');

		comboOut.find('option').each(function() {
			comboIn.find('option[value=\'' + $(this).attr('value') + '\']').remove();
		});

	},

	customizeJSON : function(json) {

		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		/* QUESTI SONO I CAMPI CHE MMG NON USA RISPETTO A FENIX MA CHE SERVONO A LANCIARE CORRETTAMENTE LA NOTIFICA */

		var tipoMessaggio = MMG_CHECK.isAdministrator() && $('#txtMessaggio').val() == '' ? 'JS_CALL' : 'NOTICE';
		var titolo = "Messaggio di notifica da " + home.baseUser.DESCRIZIONE;

		json.campo.push({
			'id' : 'TITLE',
			'col' : 'TITLE',
			'val' : titolo
		});
		json.campo.push({
			'id' : 'TIPO_MESSAGGIO',
			'col' : 'TIPO_MESSAGGIO',
			'val' : tipoMessaggio
		});
		json.campo.push({
			'id' : 'PRIORITA',
			'col' : 'PRIORITA',
			'val' : 5
		});
		json.campo.push({
			'id' : 'TTL',
			'col' : 'TTL',
			'val' : 259200000 //3 giorni (86400*3*1000) //prima era settato a zero che rendeva permanente il messaggio
		});
		json.campo.push({
			'id' : 'SOUND',
			'col' : 'SOUND',
			'val' : ''
		});

		return json;
	},
	
	filtraOnline: function() {
		home.dwrBaseFactory.getActiveUsers(function(active_users) {
			$("select#ComboInUser option").each(function() {
				var option = $(this);
				if ($.inArray(option.val(),active_users) < 0) {
					option.hide();
				}
			});
		});
	},
	
	rimuoviFiltroOnline: function() {
		$("select#ComboInUser option").show();
	}

};