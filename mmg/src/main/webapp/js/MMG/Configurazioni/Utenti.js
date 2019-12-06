$(document).ready(function() {

	UTENTI.init();
	UTENTI.setEvents();
	UTENTI.setLayout();

	NS_FENIX_SCHEDA.beforeSave = UTENTI.beforeSave;
	NS_FENIX_SCHEDA.customizeJson = UTENTI.customizeJson;
	NS_FENIX_SCHEDA.afterSave = UTENTI.afterSave;

});

var UTENTI = {

	init : function() {
		//OFFLINE_ATTIVO puo' essere 'S', 'N' oppure {"NB_MATTEO-TS.elco2009.it" : "S", "ciccio" : "N"}
		
		$("#radOffline_S").hide();
		$("#radAutoSyncOffline_S").hide();
		$("#radSincronizzaGruppoOffline_S").hide();

		UTENTI.ricaricaParametroOffline('OFFLINE_ATTIVO', '#radOffline');
		UTENTI.ricaricaParametroOffline('OFFLINE_AUTOSYNC', '#radAutoSyncOffline');
		UTENTI.ricaricaParametroOffline('OFFLINE_SINCRONIZZA_GRUPPO', '#radSincronizzaGruppoOffline');

		UTENTI.addTinyMCE();
	},
	
	ricaricaParametroOffline:function(parametro, radio) {
		
		var valore = LIB.getParamUserGlobal(parametro, 'N');
		var json;
		
		try{
			
			json = JSON.parse(valore);
			
			if (json[home.basePC.IP] == 'S') {
				$(radio).data('RadioBox').selectByValue('PC');
			} else {
				$(radio).data('RadioBox').selectByValue('NOTPC');
			}
			
		}catch(e){
			
			if (valore == "S") {
				$(radio).data('RadioBox').selectByValue('PC');
			} else {
				$(radio).data('RadioBox').selectByValue(valore);
			}
		}
	},

	setEvents : function() {

		var mostraPassword = $('#radMostraPassword').data('RadioBox');
		var password = $('#txtPassword');
		var passwordClone = password.clone().attr({
								'type' : 'text',
								'id' : 'txtPasswordClone',
								'name' : 'txtPasswordClone'
							});

		$('#h-radMostraPassword').on('change', function() {

			if (mostraPassword.val() == 'S') {

				var pwd = password.hide().val();

				if ($('#txtPasswordClone').length == 0){
					passwordClone.appendTo(password.closest('td'));
				}
				
				passwordClone.val(pwd).show();

			}else{

				var pwd = passwordClone.val() != password.val() ? passwordClone.val() : password.val();

				password.val(pwd).show();
				passwordClone.hide();
			}
		});

		NS_MMG_UTILITY.infoPopup(traduzione.lblInfoOffline, {}, $("#lblOffline"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblSyncOffline, {}, $("#lblAutoSyncOffline"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblSyncGruppoOffline, {}, $("#lblSincronizzaGruppoOffline"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblSyncSinonimiOffline, {}, $("#lblSinonimiAccertamentiOffline"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblInfoPersistenzaPrivacy, {}, $("#lblPersistenzaPrivacy"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblInfoPersistenzaAllergie, {}, $("#lblPersistenzaAllergie"));
		NS_MMG_UTILITY.infoPopup(traduzione.lblInfoPosologiaDefault, {}, $("#lblPosologiaDefault"));
		
		if (MMG_CHECK.isMedico()) {
			NS_MMG_UTILITY.infoPopup(traduzione.lblInvioRRSALInfoMed, {}, $("#lblInvioRRSAL"));
		} else {
			NS_MMG_UTILITY.infoPopup(traduzione.lblInvioRRSALInfoAMM, {}, $("#lblInvioRRSAL"));
		}
		
		$("#txtPersistenzaPrivacy").blur(function(){
			if($(this).val() > 30 || $(this).val() < 1){
				
				home.NOTIFICA.warning({
					title:traduzione.lblAttenzione,
					message:traduzione.lblBlurPersistenza,
					timeout:10
				});
				
				$(this).val("");
				$(this).focus();
			}
		});
		
		$("#txtPersistenzaAllergie").blur(function(){
			if($(this).val() > 30 || $(this).val() < 1){
				
				home.NOTIFICA.warning({
					title:traduzione.lblAttenzione,
					message:traduzione.lblBlurPersistenzaAllergie,
					timeout:10
				});
				
				$(this).val("");
				$(this).focus();
			}
		});
	},
	
	setLayout:function(){
		
		//nascondo la parte della posologia di default fino a quando non verrà gestita
		$("#txtPosologiaDefault, #lblPosologiaDefault").hide();
		$("#txtPosologiaDefault").closest("tr").hide();
		
		$("i.icon-lamp").hide();
		
		$('#txtNome, #txtCognome, #txtCodiceFiscale').attr('readOnly', true);
		
		//gestisco le voci in base alla tipologia di utente
		if (home.baseUser.TIPO_UTENTE == 'M'){
			$("#radMedicoPrescrittoreCurante").closest("tr").hide();
		}

		if (home.baseUser.TIPO_UTENTE == 'A'){
			$('#lblLayout').closest('tr').hide();
		}

		if (home.baseUser.TIPO_UTENTE != 'M'){
			$('#li-tabTimbri').hide();
		}else{
			$('#radAvvisoPrescrNonCroniche').closest("tr").hide();
		}
		
		if (typeof applicationCache == "undefined"){
			$('#li-tabOffline').hide();
		}
	},

	addTinyMCE : function() {

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

	beforeSave : function() {

		var mostraPassword = $('#radMostraPassword').data('RadioBox'), password = $('#txtPassword'), passwordClone = $('#txtPasswordClone');

		if (mostraPassword.val() == 'S') {
			password.val(passwordClone.val());
		}
		
		passwordClone.remove();

		return true;
	},

	customizeJson : function(json) {
		
		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		json.campo.push({
			'id' : 'USERNAME',
			'col' : 'USERNAME',
			'val' : $('#USERNAME').val()
		});
		json.campo.push({
			'id' : 'IDEN_PER',
			'col' : 'IDEN_PER',
			'val' : $('#IDEN_PER').val()
		});

		json.campo.push({
			'id' : 'PC_OFFLINE',
			'col' : 'PC_OFFLINE',
			'val' : UTENTI.salvaParametroOffline("#h-radOffline", "OFFLINE_ATTIVO")
		});

		json.campo.push({
			'id' : 'PC_OFFLINE_AUTOSYNC',
			'col' : 'PC_OFFLINE_AUTOSYNC',
			'val' : UTENTI.salvaParametroOffline("#h-radAutoSyncOffline", "OFFLINE_AUTOSYNC")
		});

		json.campo.push({
			'id' : 'PC_OFFLINE_GRUPPO',
			'col' : 'PC_OFFLINE_GRUPPO',
			'val' : UTENTI.salvaParametroOffline("#h-radSincronizzaGruppoOffline", "OFFLINE_SINCRONIZZA_GRUPPO")
		});

		for (var i = 0; i < tinyMCE.editors.length; i++) {

			var id = tinyMCE.editors[i]['id'];
			
			var trasc = {
					'txtTimbroRicettaRossa': 'TIMBRO_RICETTA_ROSSA',
					'txtTimbroRicettaBianca': 'TIMBRO_RICETTA_BIANCA',
					'txtTimbroCertificato': 'TIMBRO_CERTIFICATO'
			};

			json.campo.push({
				'id' : id,
				'col' : trasc[id],
				'val' : tinyMCE.editors[i].getContent()
			});
		}

		return json;
	},
	
	salvaParametroOffline: function(id, nomeparametro) {
		
		var parametro;
		
		switch ($(id).val()) {
			
			case 'S':
				parametro = 'S';
				break;
			case 'N':
				parametro = 'N';
				break;
			case 'PC':
				try {
					parametro = JSON.parse(LIB.getParamUserGlobal(nomeparametro));
				} catch (e) {
					parametro = {};
				}
				parametro[home.basePC.IP] = 'S';
				break;
			case 'NOTPC':
				try {
					parametro = JSON.parse(LIB.getParamUserGlobal(nomeparametro));
				} catch (e) {
					parametro = {};
				}
				parametro[home.basePC.IP] = 'N';
				break;
			default:
				parametro = 'N';
		}

		if (parametro != "S" && parametro != "N") {
			parametro = JSON.stringify(parametro);
		}
		
		return parametro;
	},

	afterSave : function() {

		var n_scheda = $('#N_SCHEDA').val(), key_legame = 'UTENTI', parameters = '';

		/*home.NOTIFICA.info( { message: 'Alcune delle modifiche apportate saranno attive alla prossima login sull\'applicativo', timeout: 5, title: 'Informazioni' } );
		
		home.NS_MMG.reloadPage (n_scheda, key_legame, parameters );*/

		home.NOTIFICA.info({
			message : 'Caricamento delle nuove impostazioni in corso',
			timeout : 5,
			title : 'Informazioni'
		});

		home.NS_MMG.reloadUser(true);
	}
};

//autocomplete posologia
var AC = {
		
	select:function(riga, type){
		$("#txtPosologiaDefault").val(riga.DESCR);
	}
};