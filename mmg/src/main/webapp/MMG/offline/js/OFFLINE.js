$(document).ready(function() {
	
	OFFLINE.init();
	OFFLINE.setEvents();

	OFFLINE.addMobileSupport();

/*	OFFLINE.setPatientInformations( traduzione.lblNoPatient );*/

	MEDICO.setButton();

	ULTIMI_AGGIORNAMENTI.init();
	
});

var ASSISTITO=null;

/*
 *  GESTISCE LE INTERAZIONI E GLI EVENTI GLOBALI DELLA PAGINA KEY_LEGAME = OFFLINE
 */
var OFFLINE = {
	
	init: function() {
		
		OFFLINE.patient				= $('#divInfo');
		OFFLINE.tabs				= $('.ulTabs').find('li'); 
		OFFLINE.tabAssititi			= $('#li-tabWorklistAssistiti');
		OFFLINE.tabRiepilogo		= $('#li-tabRiepilogoAssistito');
		OFFLINE.tabDatiAssistito	= $('#li-tabDatiAssistito');
		OFFLINE.tabAggiornamenti	= $('#li-tabUltimiAggiornamenti');
		OFFLINE.title				= $('#lblTitolo');
		
		OFFLINE.tabRiepilogo.hide();
		OFFLINE.tabDatiAssistito.hide();
	},
	
	setEvents: function() {
		
		$( window ).on('resize', OFFLINE.resize );
		OFFLINE.tabs.on('click', function(){ OFFLINE.setTitle( $(this) ); } );
		OFFLINE.tabAssititi.on('click', function() {
			WORKLIST_ASSISTITI.reset();
		});
		
		if (home.baseUser.TIPO_UTENTE=="A") {
			$("#butSoloMieiAssistiti").hide();
		} else {
			if (LIB.isValid(localStorage["butSoloMieiAssistiti_" + home.baseUser.IDEN_PER])) {
				NS_OFFLINE_ALL.buttonSelect($("#butSoloMieiAssistiti"));
			}
			
			$("#butSoloMieiAssistiti").on("click", function() {
				if (NS_OFFLINE_ALL.buttonSwitch($(this))) {
					localStorage["butSoloMieiAssistiti_" + home.baseUser.IDEN_PER] = "1";
				} else {
					delete localStorage["butSoloMieiAssistiti_" + home.baseUser.IDEN_PER];
				};
			});
		}
		
		
	},
	
	resize: function()
	{
		
		// Adatta il layout della finestra principale
		NS_FENIX_SCHEDA.adattaLayout();

		// Adatta il layout di ogni scheda
		home_offline.$('.iScheda').each(
			function()
			{
				
				var height 		= $(this).height( LIB.getHeight() - $("#divInfo").height() );
				var hWin		= LIB.getHeight();
				var body		= $("body");
				var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom");
				var hInfoPaz	= home.$("#divInfo").outerHeight(true); //serve per calcolare anche l'altezza del div delle info paziente
				var content		= hWin - $(".ulTabs",".tabs").outerHeight(true) - $(".headerTabs",".tabs").outerHeight(true) - $(".footerTabs",".tabs").outerHeight(true) - paddingBody - hInfoPaz;
				
				$(this).height( height ).css('height', height);
				
				$(this).contents().find('.contentTabs').height( content - 20 );
				
			});
		
	},
	
	setTitle: function( liSelected ) {
		
		var tab	= liSelected.attr('data-tab');
		
		switch( tab ) {
		
			case 'tabWorklistAssistiti':
				OFFLINE.title.text( traduzione.lblTabWorklistAssistiti );
				break;
			
			case 'tabRiepilogoAssistito':
				OFFLINE.title.text( traduzione.lblTabAssistito +' '+ ASSISTITO.PAZIENTE );
				break;
		
			case 'tabDatiAssistito':
				OFFLINE.title.text( traduzione.lblTabDatiAssistito +' '+ ASSISTITO.PAZIENTE );
				break;	
				
			case 'tabWorklistFarmaci':
				OFFLINE.title.text( traduzione.lblTabFarmaci );
				break;
				
			case 'tabWorklistProblemi':
				OFFLINE.title.text( traduzione.lblTabProblemi );
				break;	
				
			case 'tabWorklistAccertamenti':
				OFFLINE.title.text( traduzione.lblTabAccertamenti );
				break;
				
			case 'tabWorklistEsenzioni':
				OFFLINE.title.text( traduzione.lblTabEsenzioni );
				break;
			
			case 'tabUltimiAggiornamenti':
				OFFLINE.title.text( traduzione.lblTabUltimiAggiornamenti );
				break;	
				
		}
		
	},
	
	setPatient: function( record_worklist ) 
	{
		
		var request = NS_OFFLINE.TABLE.ASSISTITI.index("IDEN_ANAG").get(record_worklist.IDEN_ANAG);
		
		request.done(
			function(record)
			{
				
				ASSISTITO = record;
				
				OFFLINE.getEsenzioni();
				OFFLINE.setPatientInformations( ASSISTITO.PAZIENTE );
				
				OFFLINE.setPatientInfoList();
				
				MEDICO.setButton();
				
				RIEPILOGO_PAZIENTE.load();
				
				OFFLINE.tabRiepilogo.show();
				OFFLINE.tabDatiAssistito.show();
				OFFLINE.tabRiepilogo.click();
		});
		
	},
	
	setPatientInformations: function( text ) 
	{
		
		OFFLINE.patient.html( text );
		
		OFFLINE.patient.on('click', 
			function(event)
			{
				
				event.stopImmediatePropagation();
			
				OFFLINE.togglePatientMenu(); 
			
			});
		
	},
	
	addMobileSupport: function() {
		var metaTag = $( document.createElement('meta') ).attr({
			'name':			'viewport',
			'content':		'width=device-width, initial-scale=1, maximum-scale=1'	
		});
		
		$('head').append( metaTag );
	},
	
	beforeLoadWk: function( fieldToCheck, lunghezza ) {
		if (typeof lunghezza=="undefined")
			lunghezza = 2;
		if( fieldToCheck.val().length >= lunghezza )
			return true;
		else
			return OFFLINE.notMininumCharacters( fieldToCheck.attr('id').replace( 'txt', '' ), lunghezza );
	},
	
	getEsenzioni:function(){
		
		var esenzioni = ASSISTITO.ESENZIONI;
		var retEsenzioni = new Array();
		
		for(var i=0;i<esenzioni.length;i++) {
			if(esenzioni[i].CODICE_ESENZIONE != null){
				retEsenzioni.push(esenzioni[i].CODICE_ESENZIONE);
			}
		}
		
		ASSISTITO.ESENZIONI_PAZIENTE = retEsenzioni;
		
		return retEsenzioni.toString();
	},
	
	setPatientInfoList: function()
	{
		
		var 
			ul 		= $( document.createElement( 'ul' ) ).addClass('closed'),
			li		= $( document.createElement( 'li' ) ),
			icon	= $( document.createElement( 'i' ) ).addClass('icon-down-dir');
		
		OFFLINE.patient.find('ul').remove();
		
		ul.append( li.clone().text( 'Cod. Fiscale: '+ ASSISTITO.COD_FISC ) );
		
		ul.append( li.clone().text( 'Medico di Base: '+ ASSISTITO.MED_BASE_DESCR ) );
		
		if( ASSISTITO.ESENZIONI_PAZIENTE != '' )
			ul.append( li.clone().text( 'Esenzioni: '+ ASSISTITO.ESENZIONI_PAZIENTE ) );	
		else
			ul.append( li.clone().text( 'Nessuna esenzione presente per questo paziente' ) );
		
		OFFLINE.patient.append( icon, ul );
		
	},
	
	notMininumCharacters: function( nome_campo , lunghezza ) {
		home.NOTIFICA.warning({ 'title': traduzione.lblAttenzione, 'message': traduzione.lblInsCampo.replace("#LUNGHEZZA#", lunghezza) + ' ' + nome_campo });
		return false;
	},
	
	togglePatientMenu: function()
	{
		
		var list = OFFLINE.patient.find('ul');
		
		if( list.hasClass('closed') )
		{
			
			OFFLINE.patient.addClass('alt');
			list.removeClass('closed');
			
		}
		else
		{
			
			OFFLINE.patient.removeClass('alt');
			list.addClass('closed');
			
		}
		
	},
	
	/*
	 *	EQUIVALENTE DELLA FUNZIONE LIKE 'qualcosa%' DI ORACLE
	 */
	startsWith: function( str, startsWith ) {
		return str.toString().indexOf( startsWith ) == 0;
	},
	
	datoDaOscurare: function(oggetto) {
		return (LIB.isValid(oggetto['OSCURATO']) && oggetto['OSCURATO'] == "S" && ASSISTITO.IDEN_MED_BASE!=home.baseUser.IDEN_PER);
	},
	
	ricercaSoloMieiAssistiti: function() {
		return $("#butSoloMieiAssistiti").hasClass("offline_button_selected");
	},
	
};

var MEDICO = {
		
		prescrittoreUgualeCurante: "Prescrittore uguale al curante",
		
		ifPrescrittoreUgualeCurante: function() {
			return LIB.getParamUserGlobal("PRESCRITTORE_UGUALE_CURANTE", "N") == "S" || localStorage["IDEN_MED_PRESCR"] == "PRESCRITTORE_UGUALE_CURANTE"
		},
		
		setButton: function() {
			if (home.baseUser.TIPO_UTENTE=="A") {
				var text = traduzione.butMedPrescr;
				var bottone = $('<button type="button" class="btn" id="butMedPrescr">' + text + '</button>');
				bottone.on('click', MEDICO.showMedPrescr );
				bottone.appendTo("#divInfo");
				MEDICO.updateButtonMedPrescr();
			}
		},
		
		updateButtonMedPrescr: function() {
			if (home.baseUser.TIPO_UTENTE=="A") {
				if (MEDICO.ifPrescrittoreUgualeCurante()) {
					$("#butMedPrescr").text(MEDICO.prescrittoreUgualeCurante);
				} else {
					var iden_per = MEDICO.getMedPrescr();
					if (LIB.isValid(iden_per)) {
						$.when(home_offline.NS_OFFLINE.semaforo).then(function(){
							home_offline.NS_OFFLINE.TABLE.PERSONALE.index("IDEN_PER").get(iden_per).done(function(data) {
								$("#butMedPrescr").text("Prescrittore: " + data.DESCRIZIONE);
								UTENTE.MEDICO_PRESCRITTORE = data.DESCRIZIONE;
							});
						});
					}
				}
			}
		},
		
		getMedPrescr: function() {
			if (home.baseUser.TIPO_UTENTE=="M")
				return home.baseUser.IDEN_PER;
			else {
				if (MEDICO.ifPrescrittoreUgualeCurante()) {
					if (home_offline.ASSISTITO != null) {
						return home_offline.ASSISTITO.IDEN_MED_BASE;
					} else {
						return null;
					}
				} else {
					return localStorage["IDEN_MED_PRESCR"];
				}
			}
		},
		
		caricaCombo:function(select) {
			
			var valueSelected = localStorage["IDEN_MED_PRESCR"];
			
			var optionPUC = $("<option></option>");
			optionPUC.attr("value","PRESCRITTORE_UGUALE_CURANTE");
			if (valueSelected == "PRESCRITTORE_UGUALE_CURANTE") {
				optionPUC.attr("selected", "selected");
			}
			optionPUC.text(MEDICO.prescrittoreUgualeCurante);
			select.append(optionPUC);
			
			home_offline.NS_OFFLINE.TABLE.PERSONALE.each(function(record){
				if (record.value.TIPO == "M") {
					var option = $("<option></option");
					option.attr("value", record.value.IDEN_PER);
					option.text(record.value.DESCRIZIONE);
					if (record.value.IDEN_PER == valueSelected) {
						option.attr("selected", "selected");
					}
					select.append(option);
				}
			});
		},
		
		showMedPrescr: function(event) {
			event.stopImmediatePropagation();
			
			var div = $("<div></div>");
			div.text(traduzione.lblDialogMedPrescr);
			var select = $("<select id='selectMedPrescr'></select>");
			MEDICO.caricaCombo(select);
			div.append(select);
			
			var dialog = home.$.dialog(div, {
				buttons : [ {
					"label"  : traduzione.lblSalva ,
					'keycode' : "13",
					'classe'  : "butVerde",
					"action" :  function() {
						MEDICO.setMedPrescr($("#selectMedPrescr option:selected").val());
						home.$.dialog.hide();
						
						dialog.destroy();
					}
				}, {
					"label"  :  "Annulla",
					"action" :   function() {
						home.$.dialog.hide();
						
						dialog.destroy();
					}
				} ],
				title : traduzione.lblTitleMedPrescr,
				width : 600
			});
		},
		
		setMedPrescr: function(iden_per) {
			localStorage["IDEN_MED_PRESCR"] = iden_per;
			MEDICO.updateButtonMedPrescr();
		}
};

