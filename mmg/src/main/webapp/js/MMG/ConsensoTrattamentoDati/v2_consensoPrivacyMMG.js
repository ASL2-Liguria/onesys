$(document).ready(function() {

	CONSENSO_PRIVACY_MMG.init();
	CONSENSO_PRIVACY_MMG.setEvents();
	
	NS_FENIX_SCHEDA.beforeSave = CONSENSO_PRIVACY_MMG.beforeSave;
	NS_FENIX_SCHEDA.successSave = CONSENSO_PRIVACY_MMG.successSave;
	NS_FENIX_SCHEDA.afterSave = CONSENSO_PRIVACY_MMG.afterSave;

	NS_FENIX_SCHEDA.customizeJson = CONSENSO_PRIVACY_MMG.customizeJson;
});

var CONSENSO_PRIVACY_MMG = {
		
		titolareConsenso: (typeof home.CARTELLA.IDEN_MED_PRESCR == 'undefined' || home.CARTELLA.IDEN_MED_PRESCR == 'null')? '' : home.CARTELLA.IDEN_MED_PRESCR,
		descrTitolareConsenso: (typeof home.CARTELLA.DESCR_MED_PRESCR == 'undefined' || home.CARTELLA.DESCR_MED_PRESCR == 'null')? '' : home.CARTELLA.DESCR_MED_PRESCR,
		
		idenMedPrescr: (typeof home.CARTELLA.IDEN_MED_PRESCR == 'undefined' || home.CARTELLA.IDEN_MED_PRESCR == 'null')? '' : home.CARTELLA.IDEN_MED_PRESCR,
		descrMedPrescr: (typeof home.CARTELLA.DESCR_MED_PRESCR == 'undefined' || home.CARTELLA.DESCR_MED_PRESCR == 'null') ? '' : home.CARTELLA.DESCR_MED_PRESCR,
		
		idenModulo:$("#IDEN").val(),
		
		importato:false,
				
		labelTitoloOrig:$("#lblTitolo").text(),
		
		datiAnag:{
			
			cogn			: '',
			nome			: '',
			data_nascita	: '',
			data_iso		: '',
			com_nascita		: '',
			indirizzo		: '',
			comune			: '',
			codice_fiscale	: ''				
		},
		
		all_checks: $("#radCollaboratori, #radAssociati, #radSpecialista, #radTrattamentoDatiSostituto, #radTrattamentoDatiConsenso, #radConsensoDatiSensibili, #radConsensoPersonaleASL, #radConsensoComunicazione"),
		
		daStampare:false,
		
		init:function(){
			
			CONSENSO_PRIVACY_MMG.setLayout();
			CONSENSO_PRIVACY_MMG.setDati();
			
			$("#txtDataModulo, #txtOraModulo, #txtUtenteModulo").attr("disabled","disabled");
			
			if ($("#radTrattamentoDatiConsenso").data("RadioBox").val()=="N") {
				CONSENSO_PRIVACY_MMG.negaTutti();
			}
			
			var icon_obj = { arrowPosition : 'top', width : '300' };
			NS_MMG_UTILITY.infoPopup(traduzione['msgMedicoTitolare'], icon_obj, $("#fldMedicoTitolare"));
			
			if(CONSENSO_PRIVACY_MMG.descrTitolareConsenso == ''){
				CONSENSO_PRIVACY_MMG.getMedicoBase();
			}else{
				CONSENSO_PRIVACY_MMG.setMedicoTitolare();
			}
			
			//in attesa di trovare una soluzione globale... non mi piace molto ma è efficace (Redmine #1713)
			if(!LIB.isValid(home.ASSISTITO.IDEN_ANAG)){
				home.ASSISTITO.IDEN_ANAG = home.ASSISTITO.getIdenAnag();
			}
			
			if(!LIB.isValid(home.ASSISTITO.IDEN_MED_PRESCR)){
				home.ASSISTITO.IDEN_MED_PRESCR = home.CARTELLA.getMedPrescr();
			}
		},
		
		setEvents:function(){
			
			$("#radTipoDichiarante").on("click",function(){
				
				//a seconda dell'azione popolo le parti corrette
				if($("#radTipoDichiarante").data("RadioBox").val() != ''){
					CONSENSO_PRIVACY_MMG.popola('GARANTE', true);
				}else{
					CONSENSO_PRIVACY_MMG.popola('PAZIENTE', true);
				}
			});
			
			$("#radConsensoComunicazione").on("click",function(){
				
				if($("#radConsensoComunicazione").data("RadioBox").val() == 'S'){
					$("#fldElencoNominativo").show();
				}else{
					$("#fldElencoNominativo").hide();
				}
			});
			
			$("#radTrattamentoDatiConsenso_N").on("click",CONSENSO_PRIVACY_MMG.negaTutti);
			
			$("#radTrattamentoDatiConsenso_S").on("click",function() {
				CONSENSO_PRIVACY_MMG.all_checks.not("#radTrattamentoDatiConsenso").each(function() {
					$(this).data("RadioBox").enable();
					$(this).find(":not(.RBpulsSel)[data-value=S]").trigger("click");
				});
			});
			
			$(".butStampa").on("click",function(){
				CONSENSO_PRIVACY_MMG.salvaStampa();
			});
			
			$(".butInformativa").on("click",function(){
				CONSENSO_PRIVACY_MMG.stampaInformativa();
			});
			
			$(".butConsensoVergine").on("click",function(){
				
				var prompts = {pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer: home.CARTELLA.getMedPrescr()};
				
				home.NS_PRINT.print({
					
					path_report: "CONSENSO_PRIVACY_MMG_V2_VERGINE.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: 'S',
					output: "pdf"
				});
			});
			
			$(".butVersPrec").on("click",function(){
				
				var prompts = {pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer: home.CARTELLA.getMedPrescr(), pIden : CONSENSO_PRIVACY_MMG.idenModulo};
				var report = ($("#CONSENSO_RELATIVO").val()+".RPT");
				
				home.NS_PRINT.print({
					
					path_report: ($("#CONSENSO_RELATIVO").val()+".RPT") + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: 'S',
					output: "pdf"
				});
			});
			
			$("#butMedicoTitolare").on("click",function(){
				CONSENSO_PRIVACY_MMG.getMedicoBase();
			});
			
			$(".butChiudi").off("click");
			$(".butChiudi").on("click",function(){
				//riporto il medico prescrittore a quello di partenza
				home.CARTELLA.IDEN_MED_PRESCR = CONSENSO_PRIVACY_MMG.idenMedPrescr;
				NS_FENIX_SCHEDA.chiudi();
			})
		},
		
		afterSave:function(){
		
			//riporto il medico prescrittore a quello di partenza
			home.CARTELLA.IDEN_MED_PRESCR = CONSENSO_PRIVACY_MMG.idenMedPrescr;		
		},
		
		beforeSave:function(){

			$("#txtGaranteCognome").val($("#txtGaranteCognome").val().toUpperCase());
			$("#txtGaranteNome").val($("#txtGaranteNome").val().toUpperCase());
			$("#txtGaranteLuogoNascita").val($("#txtGaranteLuogoNascita").val().toUpperCase());
			$("#txtGaranteIndirizzo").val($("#txtGaranteIndirizzo").val().toUpperCase());
			//$("#txtGaranteComune").val($("#txtGaranteComune").val().toUpperCase());
			$("#txtGaranteCodiceFiscale").val($("#txtGaranteCodiceFiscale").val().toUpperCase());
			$("#txtSottoscrittoCognome").val($("#txtSottoscrittoCognome").val().toUpperCase());
			$("#txtSottoscrittoNome").val($("#txtSottoscrittoNome").val().toUpperCase());
			$("#txtSottoscrittoLuogoNascita").val($("#txtSottoscrittoLuogoNascita").val().toUpperCase());
			$("#txtSottoscrittoIndirizzo").val($("#txtSottoscrittoIndirizzo").val().toUpperCase());
			//$("#txtSottoscrittoComune").val($("#txtSottoscrittoComune").val().toUpperCase());
			$("#txtSottoscrittoCodiceFiscale").val($("#txtSottoscrittoCodiceFiscale").val().toUpperCase());
			
			return true;
		},
		
		checkModulo:function(){
		
			if($("#CONSENSO_RELATIVO").val() != '' && $("#CONSENSO_RELATIVO").val() != LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2")){
				
				var iden_consenso = $("#IDEN").val();

				CONSENSO_PRIVACY_MMG.mergeDatiFromOldToNew($("#IDEN_ANAG").val(), iden_consenso)
				
				$(".butVersPrec").show();
				
				$.dialog( CONSENSO_PRIVACY_MMG.getMessageHtml() , {
					id				: "dialogConfirm",
					title			: traduzione.lblAttenzione,
					width			: 800,
					height			: 200,
					showBtnClose	: false,
					modal			: true,
					movable       	: true,
					ESCandClose		: true,
					created			: function(){ $('.dialog').focus(); },
					buttons			: 
					[{ 
						label: traduzione.butChiudi, 
						action: function (ctx) {
							$.dialog.hide();
						}
					}]
				});
			}
		},
		
		customizeJson : function(json) {
			
			//devo aggiungere questi campi in modo che il salvataggio funzioni anche dall'esterno della cartella dove non viene creato l'oggetto consenso
			json = NS_FENIX_SCHEDA_MMG.customizeJson(json);
			
			json.campo.push({
				'id' : 'IDEN_ANAG_CONSENSO',
				'col' : 'IDEN_ANAG_CONSENSO',
				'val' : $('#IDEN_ANAG').val()
			});
			json.campo.push({
				'id' : 'IDEN_MED_PRESCR_CONSENSO',
				'col' : 'IDEN_MED_PRESCR_CONSENSO',
				'val' : $('#IDEN_MED_PRESCR').val()
			});

			return json;
		},
		
		getMedicoBase:function(){
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
		        
				id:'SDJ.Q_MEDICO_CURANTE',
	            parameter:	{ iden_med_base		: { v : $("#IDEN_MED_BASE_OK").val(), t : 'N'} }
			
			}).done( function(resp) {
				//alert(resp)
				CONSENSO_PRIVACY_MMG.setMedicoTitolare(resp.result[0].MEDICO,  $("#IDEN_MED_BASE_OK").val());
			});
		},
		
		getMessageHtml:function(){
			
			var div = $(document.createElement("div"));
			var msg = "<a>"+traduzione.lblInfoMerge
			msg += "</br></br>"+traduzione.lblInfoMerge2
			msg += "</br></a><ul>";
			msg += "<li> - "+traduzione.lblInfoMergeNome;
			msg += "<li> - "+traduzione.lblInfoMergeIndirizzo;
			msg += "<li> - "+traduzione.lblInfoMergeCompletezza;
			msg += "</ul></br></br>";
			msg += traduzione.lblPulsanteConsultaDatiVecchioModulo;
			div.html(msg);
			
			return div;
		},
		
		mergeDatiFromOldToNew:function(idenAnag, idenConsenso){
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
		        
				id:'SDJ.Q_MERGE_CONSENSO_MMG',
				parameter:	{ iden		: { v : idenConsenso, t : 'N'} }
			
			}).done( function(resp) {
				
				var res = resp.result[0];
				
				$("#txtGaranteCognome").val(res.GARANTE_PAZIENTE);
				$("#txtGaranteNome").val();
				//$("#txtSottoscrittoComune").val();
				$("[name='h-txtGaranteDataNascita']").val(res.DATA_NASCITA_GARANTE_ISO);				
				$("#txtSottoscrittoIndirizzo").val(res.RESIDENZA);
				$("#txtGaranteIndirizzo").val(res.RESIDENZA_GARANTE);
				$("#txtGaranteDataNascita").val(res.DATA_NASCITA_GARANTE);
				$("#txtGaranteDataNascita").focus();
				$("#txtGaranteLuogoNascita").val(res.LUOGO_NASCITA_GARANTE);
				$("#txtGaranteComune").val("");
				$("#txtGaranteCodiceFiscale").val(res.CODICE_FISCALE_GARANTE);
				$("#txtSottoscrittoCognome").val(res.PAZIENTE);
				$("[name='h-txtSottoscrittoDataNascita']").val(res.DATA_NASCITA_ISO);		
				$("#txtSottoscrittoDataNascita").val(res.DATA_NASCITA);
				$("#txtSottoscrittoDataNascita").focus();
				$("#txtSottoscrittoLuogoNascita").val(res.LUOGO_NASCITA);
				$("#txtDataRecepimento").val(res.DATA_RECEPIMENTO);
				$("#h-txtDataRecepimento").val(res.DATA_RECEPIMENTO_ISO);
				$("#txtOpeRecepimento").val(res.OPE_RECEPIMENTO);
				$("#txtDataRecepimento").focus();
				
				if(res.TIPO_GARANTE == ''){
					
					$("#txtSottoscrittoCognome").val(res.COGNOME);
					$("#txtSottoscrittoNome").val(res.NOME);
					$("#txtSottoscrittoCodiceFiscale").val(res.COD_FISC);
					//$("#txtSottoscrittoComune").val(res.DESCR_RES + ' (' + res.PROV_RES + ') ';	
					$("#txtSottoscrittoIndirizzo").val(res.INDIRIZZO_RESIDENZA);
					$("#txtSottoscrittoLuogoNascita").val(res.DESCR_NASC);
					
				}else{
					
					$("#txtGaranteCognome").val(res.COGNOME);
					$("#txtGaranteNome").val(res.NOME);
					$("#txtGaranteCodiceFiscale").val(res.COD_FISC);
					$("#txtGaranteIndirizzo").val(res.INDIRIZZO_RESIDENZA);
				}
				
				home.NOTIFICA.warning({
					'message'	: CONSENSO_PRIVACY_MMG.getMessageHtml(),
					'title'		: traduzione.msgTitleWarningMerge,
					'timeout'	: 30
				});
			});
			
			CONSENSO_PRIVACY_MMG.importato = true;
		},
		
		negaTutti: function() {
			
			var checks = CONSENSO_PRIVACY_MMG.all_checks.not("#radTrattamentoDatiConsenso");
			
			checks.find(":not(.RBpulsSel)[data-value=N]").trigger("click");
			checks.each(function() {
				$(this).data("RadioBox").disable();
			});
		},
		
		popola:function(target,vDelete){
			
			vDelete = typeof vDelete != 'undefined' ? vDelete : 'false';
			
			switch(target){
			
				case 'GARANTE':
					
					$("#txtGaranteCognome").val(CONSENSO_PRIVACY_MMG.datiAnag.cognome);
					$("#txtGaranteNome").val(CONSENSO_PRIVACY_MMG.datiAnag.nome);
					$("[name='h-txtGaranteDataNascita']").val(CONSENSO_PRIVACY_MMG.datiAnag.data_iso);				
					$("#txtGaranteDataNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.data_nascita);
					$("#txtGaranteDataNascita").focus();
					$("#txtGaranteLuogoNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.com_nascita);
					$("#txtGaranteIndirizzo").val(CONSENSO_PRIVACY_MMG.datiAnag.indirizzo);
					//$("#txtGaranteComune").val(CONSENSO_PRIVACY_MMG.datiAnag.comune);
					$("#txtGaranteCodiceFiscale").val(CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale);
					
					if(vDelete){					
						$("#txtSottoscrittoCognome, #txtSottoscrittoNome, #txtSottoscrittoDataNascita, #h-txtSottoscrittoDataNascita, " +
								"#txtSottoscrittoLuogoNascita, #txtSottoscrittoIndirizzo, #txtSottoscrittoCodiceFiscale").val('');
					}
					
					break;
				
				case 'PAZIENTE':
					
					$("#txtSottoscrittoCognome").val(CONSENSO_PRIVACY_MMG.datiAnag.cognome);
					$("#txtSottoscrittoNome").val(CONSENSO_PRIVACY_MMG.datiAnag.nome);
					$("[name='h-txtSottoscrittoDataNascita']").val(CONSENSO_PRIVACY_MMG.datiAnag.data_iso);		
					$("#txtSottoscrittoDataNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.data_nascita);
					$("#txtSottoscrittoDataNascita").focus();
					$("#txtSottoscrittoLuogoNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.com_nascita);
					$("#txtSottoscrittoIndirizzo").val(CONSENSO_PRIVACY_MMG.datiAnag.indirizzo);
					//$("#txtSottoscrittoComune").val(CONSENSO_PRIVACY_MMG.datiAnag.comune);
					$("#txtSottoscrittoCodiceFiscale").val(CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale);
					
					if(vDelete){					
						$("#txtGaranteCognome, #txtGaranteNome, #txtGaranteDataNascita, #h-txtGaranteDataNascita. #txtGaranteLuogoNascita, " +
								"#txtGaranteIndirizzo, #txtGaranteCodiceFiscale").val('');
					}

					break;
			}
		},
		
		salvaStampa:function(){
		
			CONSENSO_PRIVACY_MMG.daStampare=true;
			
			NS_FENIX_SCHEDA.registra();
		},
		
		setDati:function(){
			
			CONSENSO_PRIVACY_MMG.checkModulo();
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
		        
				id:'SDJ.Q_ANAGRAFICA_PRIVACY',
	            parameter:	{ iden		: { v : $("#IDEN_ANAG").val(), t : 'N'} }
			
			}).done( function(resp) {
				
				CONSENSO_PRIVACY_MMG.datiAnag.cognome 		 = resp.result[0].COGNOME;
				CONSENSO_PRIVACY_MMG.datiAnag.nome	 		 = resp.result[0].NOME;
				CONSENSO_PRIVACY_MMG.datiAnag.data_nascita 	 = resp.result[0].DATA_NASCITA;
				CONSENSO_PRIVACY_MMG.datiAnag.data_iso	 	 = resp.result[0].DATA_ISO;
				CONSENSO_PRIVACY_MMG.datiAnag.com_nascita 	 = resp.result[0].COM_NASCITA;
				CONSENSO_PRIVACY_MMG.datiAnag.indirizzo 	 = resp.result[0].RESIDENZA;
				//CONSENSO_PRIVACY_MMG.datiAnag.comune	 	 = resp.result[0].COMUNE;
				CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale = resp.result[0].COD_FISC;
				
				//se sto ricaricando un modulo già compilato non compilo automaticamente i campi anagrafici del paziente
				if($("#IDEN").val()== '' && !CONSENSO_PRIVACY_MMG.importato){
					CONSENSO_PRIVACY_MMG.popola('PAZIENTE',false);
				}else if($("#IDEN").val()!= '' && CONSENSO_PRIVACY_MMG.importato){
					CONSENSO_PRIVACY_MMG.setDatiModulo();
					$("#IDEN").val("");
				}
			});
		},
		
		//funzione che prende i dati di chi ha compilato il modulo e di quando lo ha fatto e popola i campi corretti
		setDatiModulo:function(){
		
			home.$.NS_DB.getTool({_logger : home.logger}).select({
		        
				id:'MMG_DATI.Q_DATI_MODULO',
	            parameter:	{ iden		: { v : $("#IDEN").val(), t : 'N'} }
			
			}).done( function(resp) {
				
				$("#txtDataModulo").val(resp.result[0].DATA_MODULO);
				$("#h-txtDataModulo").val(resp.result[0].DATA_ISO_MODULO);
				$("#txtUtenteModulo").val(resp.result[0].UTENTE);
				$("#txtOraModulo").val(resp.result[0].ORA);
			})
		},
		
		setLayout:function(){
			
			$("#lblTrattamentoDatiSostituto, #lblSpecialista, #lblAssociati, " +
				"#lblConsensoComunicazione, #lblTrattamentoDiBase, #lblDomandaConsenso," +
				"#lblTrattamentoConsensoDati, #lblTrattamentoConsensoDatiPost, #lblConsensoDatiSensibili," +
				"#lblConsensoDatiSensibiliPost, #lblInformativa, #lblCondivisioneDati, #lblCollaboratori, #lblConsensoPersonaleASL").addClass("lblConsenso");
			
			$("#lblDomandaConsenso, #lblConsensoComunicazione").attr("colSpan", "8");
			CONSENSO_PRIVACY_MMG.all_checks.css("padding-left","330px");
		
			//inserisco il nome del medico all'interno della label del modulo (in fase di inserimento)
			var textReplace = $("#lblInformativa").html().replace(/SOSTITUIRE_CON_NOME_MEDICO/g,home.CARTELLA.DESCR_MED_PRESCR);
			$("#lblInformativa").html(textReplace);
			
			$("#txtOraModulo").width("110px")
			
			$(".butVersPrec").hide();
			
			//se l'utente è il medico è lui il titolare del consenso
			if(home.baseUser.TIPO_UTENTE == 'M'){	
				$("#fldMedicoTitolare").hide()
			}
		},
		
		setMedicoTitolare:function(valMedico, idenMedico){
			
			if(typeof valMedico != 'undefined' && typeof idenMedico != 'undefined'){
				CONSENSO_PRIVACY_MMG.titolareConsenso = idenMedico;
				CONSENSO_PRIVACY_MMG.descrTitolareConsenso = valMedico;			
			}
			 
			//popolo le label a seconda del medico titolare
			$("#lblTitolo").text(CONSENSO_PRIVACY_MMG.labelTitoloOrig + ' -  Medico Titolare del consenso:      ' + CONSENSO_PRIVACY_MMG.descrTitolareConsenso);
			$("#fldMedicoTitolare legend").html('Medico Titolare del consenso: '+CONSENSO_PRIVACY_MMG.descrTitolareConsenso);
			home.CARTELLA.IDEN_MED_PRESCR=CONSENSO_PRIVACY_MMG.titolareConsenso;
		},
		
		stampaInformativa:function(){
			
			//controllo il parametro dedicato all'anteprima
			//var vPdf = LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N');
			
			var vPdf = 'S';
			
			var prompts = {pIdenPer: CONSENSO_PRIVACY_MMG.titolareConsenso};
			
			home.NS_PRINT.print({
				
				path_report: "INFORMATIVA_PRIVACY_MMG.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: vPdf,
				output: "pdf"
			});
			
		},
		
		successSave:function(pIden){
		
			if(CONSENSO_PRIVACY_MMG.daStampare){
				
				//controllo il parametro dedicato all'anteprima
				var vPdf = LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N');
				
				var prompts = {pIden: pIden, pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer: CONSENSO_PRIVACY_MMG.titolareConsenso};
				
				home.NS_PRINT.print({
					
					path_report: LIB.getParamUserGlobal("CONSENSO_PRIVACY", "CONSENSO_PRIVACY_MMG_V2")+".RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: vPdf,
					output: "pdf"
				});
			}
		}
}