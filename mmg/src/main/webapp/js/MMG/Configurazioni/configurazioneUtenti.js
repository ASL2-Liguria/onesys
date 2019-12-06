$(document).ready(function() {

	CONFIGURAZIONE_UTENTI.init();
	CONFIGURAZIONE_UTENTI.setTabAttivo();
	CONFIGURAZIONE_UTENTI.setEvents();
	
	NS_FENIX_SCHEDA.beforeSave = CONFIGURAZIONE_UTENTI.beforeSave;
	NS_FENIX_SCHEDA.afterSave = CONFIGURAZIONE_UTENTI.afterSave;
});

var CONFIGURAZIONE_UTENTI = {
		
		wkGruppi:null,
		
		init:function(){
			
			CONFIGURAZIONE_UTENTI.initWkGruppi();
			NS_LISTA_UTENTI.init();
			CONFIGURAZIONE_UTENTI.initChangePwd();
			
			NS_FENIX_SCHEDA.addFieldsValidator({config:"VCONFUTENTE",formId:"dati"});
		},
		
		setEvents:function(){
			
			$("body").on("keyup",function(e){
				if(e.keyCode == '13'){
					NS_LISTA_UTENTI.refreshWk();
				}
			});
			
			$("#li-tabConfigurazioneUtenti").on("click",function(){
				$(".butSalva").show();
			});
			
			$("#li-tabLista").on("click",function(){
				$(".butSalva").hide();
			});
			
			$("#butCerca").on("click",function(){
				NS_LISTA_UTENTI.refreshWk();
			});
			
			$(".butResetPwd").on("click",function(){
				$("#txtPassword").val("www");
				$("#txtPasswordClone").val("www");
				$("#txtPassword").blur();				
			});
			
			$(".butInserisci").on("click",function(){
				NS_LISTA_UTENTI.inserisci();
			});
		},
		
		afterSave:function(){
			
			NS_FENIX_SCHEDA.chiudi();
		},
		
		beforeSave:function(){
			if ($('#radMostraPassword').data('RadioBox').val() == "S") {
				$('#txtPassword').val($('#txtPasswordClone').val());
			}
			return true;
		},
		
		/*function che permette di visualizzare la pwd all'interno del campo dedicato*/
		initChangePwd:function(){
			
			var mostraPassword = $('#radMostraPassword').data('RadioBox');
			var password = $('#txtPassword');
			var passwordClone = password.clone().attr({
				'type' 	: 'text',
				'id' 	: 'txtPasswordClone',
				'name' 	: 'txtPasswordClone',
				'data-col-save': 'PASSWORD_CLONE'
			});

			$('#h-radMostraPassword').on('change', function() {
				
				if (mostraPassword.val() == 'S') {
					var pwd = password.hide().val();
					if ($('#txtPasswordClone').length == 0){							 
						passwordClone.appendTo(password.closest('td'));
					}
					passwordClone.val(pwd).show();
				} else {
					password.val(passwordClone.val()).show();
					passwordClone.hide();
				}
			});
		},
		
		initWkGruppi:function() {
			
			$("#wkGruppi").css("height","200px");
			
			var vUtente = $("#txtUsername").val() != '' ? $("#txtUsername").val() : 'USERNOTDEFINED';
			
			CONFIGURAZIONE_UTENTI.wkGruppi = new WK({
				"id"		: 'GRUPPI',
    			"aBind"		: ["utente","tipo_ricerca","gruppo"],
    			"aVal"		: [vUtente, 'UTENTE',""],
    			"container" : 'wkGruppi'
			});
			
			CONFIGURAZIONE_UTENTI.wkGruppi.loadWk();
		},
		
		setTabAttivo:function(){

			if( $("#UTENTE").val() != undefined){
				$("#fldGruppi").show();
				$("#li-tabConfigurazioneUtenti").trigger("click");
				$(".butInserisci").hide();
				$(".butResetPwd").show();
			}else{
				$("#li-tabLista").trigger("click");
				$("#li-tabConfigurazioneUtenti").hide();
				$(".butSalva").hide();
				$(".butResetPwd").hide();
			}
		},
		
		modificaGruppo:function(riga){
			
			var vCodice = typeof riga[0] == 'undefined' ? riga.CODICE : riga[0].CODICE ;
			
			home.NS_MMG.apri("CONFIGURAZIONE_GRUPPI","&CODICE_GRUPPO="+vCodice);
		},
		
		canModifyGruppo:function(rec) {
			return LIB.isValid(rec.IDEN) || LIB.isValid(rec[0]) && LIB.isValid(rec[0].IDEN);
		}
};

var NS_LISTA_UTENTI = {
		
		init:function(){
			
			//antiscroll-inner
			var h = $('.contentTabs').innerHeight() - $('#fldLista').outerHeight(true) -30;
			var w = $('.contentTabs').innerWidth()-50;
			$("#wkUtenti").height( h ).width(w);

			NS_LISTA_UTENTI.refreshWk();
		},
	
		refreshWk: function(){
			
			var vUtente = $("#txtRicerca").val() != '' ? $("#txtRicerca").val().toLowerCase() : 'USERNOTDEFINED';
			
			var objWk = new WK({
				"id"		: 'LISTA_UTENTI',
    			"aBind"		: ["username"],
    			"aVal"		: [vUtente],
    			"container" : 'wkUtenti'
			});
			
			objWk.loadWk();
		},
		
		apri:function(riga){
			
			var vUsername = typeof riga[0] == 'undefined' ? riga.USERNAME : riga[0].USERNAME ;
			
			home.NS_MMG.apri('CONFIGURAZIONE_UTENTI', "&UTENTE="+vUsername)
		},
		
		inserisci:function(riga){
			
			home.NS_MMG.apri("CONFIGURAZIONE_UTENTI","&UTENTE=");
		},
		
		cancella:function(riga){
			
			var vUsername = typeof riga[0] == 'undefined' ? riga.USERNAME : riga[0].USERNAME ;
			var messaggio = traduzione.lblConfirmCancella;
			messaggio += vUsername;
			messaggio += '?';
			
			home.NS_MMG.confirm(messaggio, function(){ 

				var parameters={
						"pUsername" : vUsername
				}
				
				$.NS_DB.getTool({
					_logger: home.logger 
				}).call_function({
					id:			'MMG.CANCELLA_UTENTE',
					parameter:	parameters
				}).done(function( response ){
					if( typeof response.p_result != 'undefined' ){
						home.NOTIFICA.success( { 
							title:		'Successo!',
							message:	response.p_result 
						});
						NS_LISTA_UTENTI.refreshWk();
					}
				}).fail(function( jqXHR, textStatus, errorThrown ) {
					home.logger.error('Errore NS_LISTA_UTENTI.cancella: ' + errorThrown );
				});
			});
		}
};