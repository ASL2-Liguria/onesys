$(document).ready(function() {

	CONSENSO_PRIVACY_MMG.init();
	CONSENSO_PRIVACY_MMG.setEvents();
	
	NS_FENIX_SCHEDA.beforeSave = CONSENSO_PRIVACY_MMG.beforeSave;
	NS_FENIX_SCHEDA.successSave = CONSENSO_PRIVACY_MMG.successSave;
	NS_FENIX_SCHEDA.afterSave = CONSENSO_PRIVACY_MMG.afterSave;
});

var CONSENSO_PRIVACY_MMG = {
		
		titolareConsenso: (typeof home.CARTELLA.IDEN_MED_PRESCR == 'undefined' ? '' : home.CARTELLA.IDEN_MED_PRESCR),
		descrTitolareConsenso: (typeof home.CARTELLA.DESCR_MED_PRESCR == 'undefined' ? '' : home.CARTELLA.DESCR_MED_PRESCR),
		
		idenMedPrescr: (typeof home.CARTELLA.IDEN_MED_PRESCR == 'undefined' ? '' : home.CARTELLA.IDEN_MED_PRESCR),
		descrMedPrescr: (typeof home.CARTELLA.DESCR_MED_PRESCR == 'undefined' ? '' : home.CARTELLA.DESCR_MED_PRESCR),
				
		labelTitoloOrig:$("#lblTitolo").text(),
		
		datiAnag:{
			
			paziente		: '',
			data_nascita	: '',
			data_iso		: '',
			com_nascita		: '',
			residenza		: '',
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
				
				var baseUrl = home.NS_FENIX_TOP.getAbsolutePathServer();;
				var vUrl= baseUrl + "MMG/informativaPrivacyMMG.pdf" ;
				
				window.open(vUrl,'','');
			});
			
			$(".butConsensoVergine").on("click",function(){
				
				var prompts = {pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer: home.CARTELLA.getMedPrescr()};
				
				home.NS_PRINT.print({
					
					path_report: "CONSENSO_PRIVACY_MMG_VERGINE.RPT" + "&t=" + new Date().getTime(),
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

			$("#txtGaranteNomeCognome").val($("#txtGaranteNomeCognome").val().toUpperCase());
			$("#txtGaranteLuogoNascita").val($("#txtGaranteLuogoNascita").val().toUpperCase());
			$("#txtGaranteResidente").val($("#txtGaranteResidente").val().toUpperCase());
			$("#txtGaranteCodiceFiscale").val($("#txtGaranteCodiceFiscale").val().toUpperCase());
			
			return true;
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
					
					$("#txtGaranteNomeCognome").val(CONSENSO_PRIVACY_MMG.datiAnag.paziente);
					$("[name='h-txtGaranteDataNascita']").val(CONSENSO_PRIVACY_MMG.datiAnag.data_iso);				
					$("#txtGaranteDataNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.data_nascita);
					$("#txtGaranteDataNascita").focus();
					$("#txtGaranteLuogoNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.com_nascita);
					$("#txtGaranteResidente").val(CONSENSO_PRIVACY_MMG.datiAnag.residenza);
					$("#txtGaranteCodiceFiscale").val(CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale);
					
					if(vDelete){					
						$("#txtSottoscrittoNomeCognome, #txtSottoscrittoDataNascita, #h-txtSottoscrittoDataNascita, " +
								"#txtSottoscrittoLuogoNascita, #txtSottoscrittoResidente, #txtSottoscrittoCodiceFiscale").val('');
					}
					
					break;
				
				case 'PAZIENTE':
					
					$("#txtSottoscrittoNomeCognome").val(CONSENSO_PRIVACY_MMG.datiAnag.paziente);
					$("[name='h-txtSottoscrittoDataNascita']").val(CONSENSO_PRIVACY_MMG.datiAnag.data_iso);		
					$("#txtSottoscrittoDataNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.data_nascita);
					$("#txtSottoscrittoDataNascita").focus();
					$("#txtSottoscrittoLuogoNascita").val(CONSENSO_PRIVACY_MMG.datiAnag.com_nascita);
					$("#txtSottoscrittoResidente").val(CONSENSO_PRIVACY_MMG.datiAnag.residenza);
					$("#txtSottoscrittoCodiceFiscale").val(CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale);
					
					if(vDelete){					
						$("#txtGaranteNomeCognome, #txtGaranteDataNascita, #h-txtGaranteDataNascita. #txtGaranteLuogoNascita, " +
								"#txtGaranteResidente, #txtGaranteCodiceFiscale").val('');
					}

					break;
			}
		},
		
		salvaStampa:function(){
		
			CONSENSO_PRIVACY_MMG.daStampare=true;
			
			NS_FENIX_SCHEDA.registra();
		},
		
		setDati:function(){
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
		        
				id:'SDJ.Q_ANAGRAFICA_PRIVACY',
	            parameter:	{ iden		: { v : $("#IDEN_ANAG").val(), t : 'N'} }
			
			}).done( function(resp) {
				
				CONSENSO_PRIVACY_MMG.datiAnag.paziente 		 = resp.result[0].PAZIENTE;
				CONSENSO_PRIVACY_MMG.datiAnag.data_nascita 	 = resp.result[0].DATA_NASCITA;
				CONSENSO_PRIVACY_MMG.datiAnag.data_iso	 	 = resp.result[0].DATA_ISO;
				CONSENSO_PRIVACY_MMG.datiAnag.com_nascita 	 = resp.result[0].COM_NASCITA;
				CONSENSO_PRIVACY_MMG.datiAnag.residenza 	 = resp.result[0].RESIDENZA;
				CONSENSO_PRIVACY_MMG.datiAnag.codice_fiscale = resp.result[0].COD_FISC;
				
				//se sto ricaricando un modulo già compilato non compilo automaticamente i campi anagrafici del paziente
				if($("#IDEN").val()==''){
					CONSENSO_PRIVACY_MMG.popola('PAZIENTE',false);
				}else{
					CONSENSO_PRIVACY_MMG.setDatiModulo();
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
			
			//nascondo il pulsante dell'informativa fino all'arrivo di quest'ultima
			$(".butInformativa").hide();
			
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
		
		successSave:function(pIden){
			
			if(CONSENSO_PRIVACY_MMG.daStampare){
				
				//controllo il parametro dedicato all'anteprima
				var vPdf = LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N');
				
				var prompts = {pIden: pIden, pIdenAnag: $("#IDEN_ANAG").val(), pIdenPer: CONSENSO_PRIVACY_MMG.titolareConsenso};
				
				home.NS_PRINT.print({
					
					path_report: "CONSENSO_PRIVACY_MMG.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: vPdf,
					output: "pdf"
				});
			}
		}
}