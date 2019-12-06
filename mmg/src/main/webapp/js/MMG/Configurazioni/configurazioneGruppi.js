$(document).ready(function() {

	CONFIGURAZIONE_GRUPPI.init();
	CONFIGURAZIONE_GRUPPI.setTabAttivo();
	CONFIGURAZIONE_GRUPPI.setEvents();
	
	NS_FENIX_SCHEDA.beforeSave = CONFIGURAZIONE_GRUPPI.beforeSave;
	NS_FENIX_SCHEDA.afterSave = CONFIGURAZIONE_GRUPPI.afterSave;
});

var CONFIGURAZIONE_GRUPPI = {
		
		wkGruppi:null,
		
		init:function(){
			
			NS_LISTA_GRUPPI.init();
			CONFIGURAZIONE_GRUPPI.getPersonale();
			CONFIGURAZIONE_GRUPPI.getPersonaleGruppo( $("#CODICE_GRUPPO").val() );
			
	        NS_FENIX_SCHEDA.addFieldsValidator({config:"VCONFGRUPPO",formId:"dati"});
		},
		
		setEvents:function(){
			
			$("body").on("keyup",function(e){
				if(e.keyCode == '13'){
					if($("#li-tabLista").hasClass("tabActive")){						
						NS_LISTA_GRUPPI.refreshWk('DESCRIZIONE');
					}else if($("#li-tabConfigurazioneGruppi").hasClass("tabActive") && $("#txtRicercarPersonale").val()!=''){
						CONFIGURAZIONE_GRUPPI.getPersonale();
					}
				}
			});
			
			$("#li-tabConfigurazioneGruppi").on("click",function(){
				$(".butSalva").show();
			});
			
			$("#li-tabLista").on("click",function(){
				$(".butSalva").hide();
			});

			$("#butCercaCodice").on("click",function(){
				NS_LISTA_GRUPPI.refreshWk('CODICE');
			}).addClass("btnRicerca");
			
			$("#butCercaDescrizione").on("click",function(){
				NS_LISTA_GRUPPI.refreshWk('DESCRIZIONE');
			}).addClass("btnRicerca");
			
			$("#butCercaPersonale").on("click",function(){
				CONFIGURAZIONE_GRUPPI.getPersonale();
			}).addClass("btnRicerca");
			
			$(".butInserisci").on("click",function(){
				NS_LISTA_GRUPPI.inserisci();
			})
			
			$("#txtRicercaPersonale").blur(function(){
				$("#txtRicercaPersonale").val($("#txtRicercaPersonale").val().toUpperCase());
			})
		},
		
		afterSave:function(){
			
			NS_FENIX_SCHEDA.chiudi();
		},
		
		beforeSave:function(){
			$("#txtCodiceGruppo").val($("#txtCodiceGruppo").val().toUpperCase());
			CONFIGURAZIONE_GRUPPI.getIdenUtentiGruppo();
			return true;
		},

		checkDuplicates: function(){

			var comboIn = $('#ComboIn');
			var comboOut = $('#ComboOut');

			comboOut.find('option').each(function(){
				
				comboIn.find('option[value=\''+ $(this).attr('data-username') +'\']').remove();
			});
		},
		
		chiudiScheda:function(){
			NS_FENIX_SCHEDA.chiudi();
		},
		
		getIdenUtentiGruppo:function(){

			var idenUtentiGruppo = '';
			var userUtentiGruppo = '';
			
			$("#hIdenUtentiGruppo").val("");
			$("#hUserUtentiGruppo").val("");
			
			$("#ComboOut option").each(function(){
				idenUtentiGruppo += ($(this).attr("data-iden") + ",");
				userUtentiGruppo += ($(this).attr("data-username") + ",");
			});
			
			idenUtentiGruppo = idenUtentiGruppo.substring(0,idenUtentiGruppo.length-1);
			$("#hIdenUtentiGruppo").val(idenUtentiGruppo);
			
			userUtentiGruppo = userUtentiGruppo.substring(0,userUtentiGruppo.length-1);
			$("#hUserUtentiGruppo").val(userUtentiGruppo);
		},
		
		initWkGruppi:function() {
			
			$("#wkGruppi").css("height","200px");
			
			var vGruppo = $("#txtRicerca").val() != '' ? $("#txtRicerca").val().toUpperCase() : 'GROUPNOTDEFINED';
			var vCodice = $("#txtRicerca").val() != '' ? $("#txtRicerca").val().toUpperCase() : 'GROUPNOTDEFINED';
			
			CONFIGURAZIONE_GRUPPI.wkGruppi = new WK({
				"id"		: 'LISTA_GRUPPI',
    			"aBind"		: ["gruppo","codice"],
    			"aVal"		: [vGruppo, vCodice],
    			"container" : 'wkGruppi'
			});
			
			CONFIGURAZIONE_GRUPPI.wkGruppi.loadWk();
		},
		
		getPersonale: function(  ){

			var parameters ={
					"personale" : $("#txtRicercaPersonale").val().toUpperCase()
			};

			toolKitDB.getResultDatasource( 'MMG_DATI.PERSONALE', 'MMG_DATI', parameters, null, function( response ){
				CONFIGURAZIONE_GRUPPI.loadPersonale( response, $('#ComboIn'), '#ComboIn' );
			});
		},
		
		getPersonaleGruppo:function( codiceGruppo ){
			
			var parameters ={
				'codice' : codiceGruppo
			};

			toolKitDB.getResultDatasource( 'MMG_DATI.PERSONALE_GRUPPO', 'MMG_DATI', parameters, null, function( response ){
				CONFIGURAZIONE_GRUPPI.loadPersonale( response, $('#ComboOut'), '#ComboOut' );
			});
		},

		loadPersonale: function( list, target, id ){
			
			var option, attrName, attrValue;

			target.empty();

			$.each(list, function( key, value ){
				
				var idenUtente  	= value['IDEN'];		
				var usernameUtente  = value['USERNAME'];
				var tipo_medico 	= value['TIPO_MEDICO'] != '' && value['TIPO_MEDICO'] != null ? value['TIPO_MEDICO'] : '';
				var descrUtente 	= value['UTENTE'] + ' - ' + value['TIPO_UTENTE'] + ' ' + tipo_medico;

				option = $('<option>', { 'value' : idenUtente, 'text' : descrUtente } );
				option.attr("data-iden", idenUtente);
				option.attr("data-username", usernameUtente);
				option.appendTo( id );
			});

			CONFIGURAZIONE_GRUPPI.checkDuplicates();
		},
		
		setTabAttivo:function(){  
			
			if($("#TAB_ATTIVO").val()=='LISTA'){

				$("#li-tabLista").trigger("click");
				$("#li-tabConfigurazioneGruppi").hide();
				$(".butSalva").hide();
				
			}else{				
			
				$("#li-tabConfigurazioneGruppi").trigger("click");
				$("#li-tabLista").hide();
				$(".butInserisci").hide();
			}
		}
};


var NS_LISTA_GRUPPI = {
		
		init:function(){
			
			//antiscroll-inner
			var h = $('.contentTabs').innerHeight() - $('#fldRicercaGruppo').outerHeight(true) - 30;
			var w = $('.contentTabs').innerWidth()-50;
			$("#wkGruppi").height( h ).width(w);

			NS_LISTA_GRUPPI.refreshWk();
		},
	
		refreshWk: function(pType){
			
			if(pType == 'CODICE' && $("#txtRicerca").val() != ''){
				
				vCodice = $("#txtRicerca").val().toUpperCase();
				vGruppo = '';
			
			}else{
				
				vCodice = '';
				vGruppo = $("#txtRicerca").val().toUpperCase();
			
			}

			var objWk = new WK({
				"id"		: 'LISTA_GRUPPI',
    			"aBind"		: ["gruppo","codice"],
    			"aVal"		: [vGruppo, vCodice],
    			"container" : 'wkGruppi'
			});
			
			objWk.loadWk();
		},
		
		cancella:function(riga){
			
			var vCodice = typeof riga[0] == 'undefined' ? riga.CODICE : riga[0].CODICE ;
			var messaggio = traduzione.lblConfirmCancellaGruppo;
			messaggio += vCodice.toString();
			messaggio += '?';
			
			home.NS_MMG.confirm(messaggio, function(){ 

				var parameters={
						"pCodice" : vCodice
				}
				
				$.NS_DB.getTool({
					_logger: home.logger 
				}).call_function({
					id:			'MMG.CANCELLA_GRUPPO',
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
					home.logger.error('Errore NS_LISTA_GRUPPI.cancella: ' + errorThrown );
				});
			});
		},
		
		inserisci:function(riga){
			
			home.NS_MMG.apri("CONFIGURAZIONE_GRUPPI","&CODICE_GRUPPO=");
		},
		
		modifica:function(riga){
			
			var vCodice = typeof riga[0] == 'undefined' ? riga.CODICE : riga[0].CODICE ;
			
			home.NS_MMG.apri("CONFIGURAZIONE_GRUPPI","&CODICE_GRUPPO="+vCodice);
		},
		
		canModify:function(rec) {
			return LIB.isValid(rec.IDEN) || LIB.isValid(rec[0]) && LIB.isValid(rec[0].IDEN);
		}
};
