$(function(){
	
	ANAGRAFICA.init();
	ANAGRAFICA.setEvents();
	
	NS_FENIX_SCHEDA.beforeSave = ANAGRAFICA.beforeSave;
	NS_FENIX_SCHEDA.errorSave  = ANAGRAFICA.errorSave;
	NS_FENIX_SCHEDA.successSave  = ANAGRAFICA.successSave;
	NS_FENIX_SCHEDA.customizeJson = ANAGRAFICA.customizeJson;
});

var ANAGRAFICA = {
		
	daStampare:false,
	
	idenConsenso:null,
	moduloConsenso:LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2"),

    init:function(){
    	
    	// nascondo il fieldset del consenso privacy
    	//$("#fldConsenso").hide();
    	$("#lblConsenso").hide();
    	$("#lblConsenso").next().hide();

    	if(LIB.isValid($("#RETRO_RICETTA").val())){
    		$("#li-tabDatiAggiuntivi").trigger("click");
    	}
    	
    	ANAGRAFICA.setLayout();
    	
    	if ((typeof home.ASSISTITO.PIN_AAC != "undefined" && (home.ASSISTITO.PIN_AAC != "" && home.ASSISTITO.PIN_AAC != null) ) && $("#IDEN_ANAG").val() != '') {
    		ANAGRAFICA.setPinnata();
        }
    	
    	ANAGRAFICA.checkDaCompletare();
    	
        $("#txtEta, #txtMedBase, #txtUSLAss").attr("disabled",true);

        ANAGRAFICA.customizeValidator();
        NS_FENIX_SCHEDA.addFieldsValidator({config:"VANAG",formId:"dati"});
        
        ANAGRAFICA.caricaIdenConsenso();
    },
	
	setEvents:function(){
		
		$(".butStampa").on("click",function(){
			var prompts = {pIdenAnag:home.ASSISTITO.IDEN_ANAG };
			
			home.NS_PRINT.print({
				path_report: "ANAGRAFICA.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
		});
		
		$("#butStampaRetro").on("click",function(){
			
			ANAGRAFICA.stampaRetro();
		});
		
		$(".butConsensoPrivacy").on("click",function(){
			
			//home.NS_MMG.callPrivacyPortal('INSERISCI', home.ASSISTITO.IDEN_ANAG );
			
			var prompts = {pIdenAnag:home.ASSISTITO.IDEN_ANAG };
			
			home.NS_PRINT.print({
				path_report: "CONSENSO_TRATTAMENTO_DATI.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: "S",
				output: "pdf"
			});
		});
		
		$(".butInfoPrivacy").on("click",function(){
			
			var baseUrl = home.NS_FENIX_TOP.getAbsolutePathServer();;
			var vUrl= baseUrl + "MMG/informativaPrivacyMMG.pdf" ;
			
			window.open(vUrl,'','');
			
			/*home.NS_FENIX_PRINT.apri({URL:vUrl})
			home.NS_PRINT.print({
				url: "MMG/informativaPrivacyASL2.pdf" ,
				show: "S"
			});*/
		});
		
		$("#butConsensoVergine").on("click",function(){
			
			var prompts = {pIdenAnag: home.ASSISTITO.IDEN_ANAG, pIdenPer: home.ASSISTITO.IDEN_MED_BASE};
			
			home.NS_PRINT.print({
				
				path_report: "CONSENSO_PRIVACY_MMG_V2_VERGINE.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: 'S',
				output: "pdf"
			});
		});
		
		$("#butRecepisciConsenso").on("click",function(){
			
			var idenAnag = home.ASSISTITO.IDEN_ANAG;
			
			home.NS_MMG.apriModuloConsenso(idenAnag, ANAGRAFICA.moduloConsenso, ANAGRAFICA.idenConsenso, home.ASSISTITO.IDEN_MED_BASE);
			NS_FENIX_SCHEDA.chiudi();
		});
		
		$("#butVisualizzaConsenso").on("click",function(){
			
			if(home.baseUser.IDEN_PER != home.ASSISTITO.IDEN_MED_BASE 
					|| home.CARTELLA.IDEN_MED_PRESCR != home.ASSISTITO.IDEN_MED_BASE){
				home.NOTIFICA.warning({
					title:traduzione.lblAttenzione,
					message:home.traduzione.lblNoMedicoCurante2
				});
				return;
			}
			
			var prompts = {pIden: ANAGRAFICA.idenConsenso, pIdenAnag: home.ASSISTITO.IDEN_ANAG, pIdenPer: home.CARTELLA.IDEN_MED_PRESCR};
			var moduloConsenso = ANAGRAFICA.moduloConsenso + ".RPT";
			
			//TODO: alert o popup che avvisi che il modulo non è quello in vigore attualmente
			
			home.NS_PRINT.print({
				
				path_report: moduloConsenso + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: 'S',
				output: "pdf"
			});
		});
		
		$("#butVisualizzaStoricoConsenso").on("click", function(){
			home.NS_MMG.apri("STORICO_CONSENSO","&IDEN_ANAG="+home.ASSISTITO.IDEN_ANAG+"&IDEN_PER="+home.baseUser.IDEN_PER);
		});
		
		$("input[type=text]").not("#txtMail").on("blur", function(){
			$(this).val($(this).val().toUpperCase());
		});
		
		$("#txtCodFisc").on("blur",function(){
			if(!ANAGRAFICA.verificaCodiceFiscaleDefinitivo()){
				home.NOTIFICA.error({
					title	: 'Errore',
					message	: 'Codice fiscale non valido',
					timeout	: 5
				});
			}
		});
		
		$("#txtStatoEstero").on("blur", function() {
			if ($(this).val() == "") {
				AC.sbiancaNazione();
			}
		});
	},
	
	successSave:function(){
		
		if(ANAGRAFICA.daStampare){
			ANAGRAFICA.stampaRetro();
			NS_LOADING.hideLoading();
		}else{
			NS_FENIX_SCHEDA.chiudi();
		}
	},
	
	auxStampa:function(){
		NS_LOADING.showLoading({"timeout": 30});
		ANAGRAFICA.daStampare = true;
		NS_FENIX_SCHEDA.registra();
	},
	
	beforeSave:function(){
		if(ANAGRAFICA.verificaCodiceFiscaleDefinitivo() == true){
			return home.MMG_CHECK.isDead();
		}else{
			home.NOTIFICA.error({
				title	: 'Errore',
				message	: 'Codice fiscale non valido',
				timeout	: 5
			});
		}
	},

	blocca: function(){
		
		$("body input").attr("disabled","disabled");
		$("body select").attr("disabled","disabled");
		$("body textarea ").attr("disabled","disabled");
		$("body button ").attr("disabled","disabled");
		
		$("#lblLuogoNasc").off("click");
		$("#lblProf").off("click");
		$("#lblLocRes").off("click");
		$("#lblLocDom").off("click");
		$("#lblLocRV").off("click");
		
		radSesso.disable();
		$(".butStampa").attr("disabled",false);
		$(".butChiudi").attr("disabled",false);
	},
	
	caricaIdenConsenso:function(){
		
		home.$.NS_DB.getTool({_logger : home.logger}).select({
            id:'SDJ.Q_INFO_CONSENSO_MMG',
            parameter:
            {
            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
            }
		}).done( function(resp) {

			ANAGRAFICA.idenConsenso = typeof resp.result[0] == 'undefined' ? '' : resp.result[0].IDEN;
			ANAGRAFICA.moduloConsenso = typeof resp.result[0] == 'undefined' ? '' : resp.result[0].CONSENSO;
			
			if(ANAGRAFICA.idenConsenso == ''){
				$("#butVisualizzaConsenso, #butVisualizzaStoricoConsenso").hide();
			}
		});		
	},
	
	isDaCompletare: function() {
		return typeof $("#STATO_ANAGRAFICA") != 'undefined' && $("#STATO_ANAGRAFICA").val() == 'DA_COMPLETARE';
	},
	
	checkDaCompletare:function(){
		
		var messaggio = traduzione.lblAnagraficaDaCompletare;

		if(ANAGRAFICA.isDaCompletare()) {
    		
			home.NOTIFICA.warning({
				message	: messaggio,
				title	: traduzione.lblTitleAnagraficaDaCompletare,
				timeout : "30"
			});
    		
			$(".butChiudi").off("click");
			$(".butChiudi").on("click", function(){
				home.NS_MMG.goHome();
				//NS_FENIX_SCHEDA.chiudiScheda();
			});
    	}
	},
	
	customizeValidator: function() {
		
		if (home.MMG_CHECK.isPediatra()) {
			
			delete VANAG.elements.txtCodFisc;
			VANAG.elements.txtLuogoNasc = {
					 status: "required",
					 name: "Luogo di nascita"
			};
		}
	},
	
	customizeJson: function(json) {
		json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
		if (ANAGRAFICA.isDaCompletare()) {
			json.campo.push({
				'id' : 'READONLY',
				'col' : 'READONLY',
				'val' : 'N'
			});
		}
		return json;
	},
	
	errorSave:function(resp){
		
		home.NOTIFICA.error({
			message: resp.message,
			title: traduzione.lblTitoloErrore
		});
	},
	
	hideDatiAggiuntivi: function(){
		
		$("#li-tabDatiAggiuntivi,#fldConsenso,.butStampa").hide();
	},
	
	setLayout: function(){
		
		//background giallo per la privacy
		$("#fldConsenso").addClass("backgroundYellow")
    	
    	//nascondo i pulsanti del consenso fino a nuovo ordine (28/10/2014)
    	$(".butConsensoPrivacy, .butInfoPrivacy").hide();
    	
    	$("#butRecepisciConsenso").parent().attr("colSpan","50");
    	
		switch ($("#LAYOUT").val()) {
			case 'EMBEDDED':
				ANAGRAFICA.setEmbeddedLayout();
				break;
			case 'BREVE': 
				ANAGRAFICA.hideDatiAggiuntivi();
				break;
			case 'READONLY':
				ANAGRAFICA.setReadonly();
				break;
			case 'LOCKED':
				ANAGRAFICA.blocca();
				break;
			default: null;
		}
	},
	
	setPinnata: function() {

		$("#txtCognome,#txtNome,#txtDataNasc,#txtCodFisc,#txtLuogoNasc").attr("disabled",true);
		$("#lblLuogoNasc").unbind().parent().css({"cursor":"default","text-decoration":"initial"});
		radSesso.disable();
		$("#fldDP legend").append(
				$("<i/>", { "class" : "icon-lock", "title" : "dati non modificabili allineati con anagrafica centrale", "style" : "cursor:default" })
		);
	},
	
	setReadonly: function() {
		$(".butStampa,.butSalva").hide();
	},
	
	setEmbeddedLayout: function() 
	{
		$("body").addClass("embedded");
		var height 			= home.RIEPILOGO_WRAPPER.getContentHeight() - 20;
		$('.contentTabs').height(height);
		
		$(".butChiudi").hide();
	},
	
	stampaRetro:function(){
		
		var prompts = {pIdenAnag: home.ASSISTITO.IDEN_ANAG};
		
		var report;
		if (LIB.getParamPcGlobal("REPORT_FARMACI","FARMACI.RPT")=="FARMACI_A4.RPT") {
			report = "RICETTA_RETRO_A4.RPT";
		} else {
			report = "RICETTA_RETRO.RPT";
		}

		home.NS_PRINT.print({
			path_report: report + "&t=" + new Date().getTime(),
			stampante: home.NS_PRINT.getStampante("STAMPANTE_RICETTA_ROSSA"),
			opzioni: home.NS_PRINT.getOpzioni("STAMPANTE_RICETTA_ROSSA"),
			prompts: prompts,
			output: "pdf"
		});
	},
	
	verificaCodiceFiscaleDefinitivo: function(){
		
		var sesso = $("#radSesso").data('RadioBox').val();		
		var cfins = $("#txtCodFisc").val();
		var cf = cfins.toUpperCase();
		var cfReg = /^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}\w{4}[A-Z]{1}$/;
		var cfNum = /^[0-9]+$/;
		
		if( cfins == '' )  return false;
		
		//controllo la lunghezza del codice (16 codice fiscale normale, 11 codice fiscale provvisorio)
		if( cfins.length != 16 && cfins.length != 11){			
			return false;
		//se il codice fiscale è lungo 11 controllo che siano tutti numeri	
		}else if(cfins.length == 11 ){
			if (!cfNum.test(cf)){				
				return false;
			}else{
				//è un codice provvisorio (molto probabilmente) quindi return true in modo che si possa salvare
				return true;
			}
		//è lungo 16, quindi controllo la formalità con la regular expression. Se è corretto formalmente posso procedere con gli altri controlli
		}else if(cfins.length == 16 ){		
			
			if (!cfReg.test(cf))
				return false;
		}
		
		//controllo il sesso rispetto al codice fiscale inserito
		if(sesso == 'F'){
			if((parseInt(cfins.substring(9,11)) - 40) < 0 ){
				home.NOTIFICA.warning({
					message:traduzione.msgCodFiscSexWrong,
					title:traduzione.lblAttenzione,
					timeout:"15"
				});
				return false;
			}
		}else if(sesso == 'M'){
			if((parseInt(cfins.substring(9,11))) > 40 ){
				home.NOTIFICA.warning({
					message:traduzione.msgCodFiscSexWrong,
					title:traduzione.lblAttenzione,
					timeout:"15"
				});
				return false;
			}
		}
		
		var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
		var s = 0;
		for( var i = 1; i <= 13; i += 2 )
			s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));
		for( var k = 0; k <= 14; k += 2 )
			s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(k) )));
		if ( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) )
			return false;
		return true;
	}
};

var AC = {
		
		selectNazione:function(riga){
			
			$("#txtCodStatoEstero").val(riga.VALUE);
			$("#h-txtStatoEstero").val(riga.VALUE);
			$("#txtStatoEstero").val(riga.DESCR);	
			$("#hIdenStatoEstero").val(riga.IDEN);
		},
		
		sbiancaNazione: function() {
			$("#txtCodStatoEstero").val("");
			$("#h-txtStatoEstero").val("");
			$("#txtStatoEstero").val("");	
			$("#hIdenStatoEstero").val("");
		},
		
		selectComuneDomicilio:function(riga){

			$("#txtLocDom").val(riga.DESCR);
			$("#h-txtLocDom").val(riga.VALUE);
			$("#txtCAPDom").val(riga.CAP);
			$("#txtProvDom").val(riga.PROVINCIA);
		},
		
		selectComuneResidenza:function(riga){

			$("#txtLocRes").val(riga.DESCR);
			$("#h-txtLocRes").val(riga.VALUE);
			$("#txtCAPRes").val(riga.CAP);
			$("#txtProvRes").val(riga.PROVINCIA);
		},
		
		selectComuneVisita:function(riga){

			$("#txtLocRV").val(riga.DESCR);
			$("#h-txtLocRV").val(riga.VALUE);
			$("#txtCAPRV").val(riga.CAP);
			$("#txtProvRV").val(riga.PROVINCIA);
		}
};