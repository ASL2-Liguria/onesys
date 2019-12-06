$(function(){
	MODULO_RM.init();
	MODULO_RM.setEvents();
	MODULO_RM.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_RM.successSave;
	NS_FENIX_SCHEDA.beforeClose = MODULO_RM.beforeClose;
	NS_FENIX_SCHEDA.beforeSave = MODULO_RM.beforeSave;
});

var MODULO_RM = {
		
		daStampare : false,
		
		accertamento : $("#txtAcc_Eff"),
		
		init:function(){
			
			$(".butSalva").removeClass("butVerde");
			$(".butStampa").addClass("butVerde");
			
			home.MODULO_RM = this;
			
			$("#Notizie_Clin").parents().attr("colSpan","4");
			
			if(LIB.isValid($("#PROBLEMA_RICETTA").val()) && $("#PROBLEMA_RICETTA").val() != ''){
				home.$.NS_DB.getTool({_logger : home.logger}).select({
		            id			:'SDJ.Q_QUESITO_FROM_RR_TESTATA',
		            parameter	:
		            {
		            	iden_ricetta		: { v : $("#PROBLEMA_RICETTA").val(), t : 'N'}
		            }
				}).done( function(resp) {
					$("#Quesito").val(resp.result[0].QUESITO);
				});
			}
			
			if (LIB.isValid($("#ACCERTAMENTO_RICETTA").val())){
				
				var accertamento = $("#ACCERTAMENTO_RICETTA").val();
				$("#txtAcc_Eff").val(accertamento);
			}
			
			/****** Nel caso in cui la pagina venga chiamata da TAB_RR_ACCERTAMENTI ********/
			
			if(LIB.isValid($("#IDEN_ACCERTAMENTO").val()) && $("#IDEN_ACCERTAMENTO").val() != ''){
				home.$.NS_DB.getTool({_logger : home.logger}).select({
		            id			:'SDJ.Q_INDAGINE',
		            parameter	:
		            {
		            	iden_accertamento		: { v : $("#IDEN_ACCERTAMENTO").val(), t : 'N'}
		            }
				}).done( function(resp) {
					$("#txtAcc_Eff").val(resp.result[0].INDAGINE);
				});
			}
			
			if(LIB.isValid($("#ID_PROBLEMA").val()) && $("#ID_PROBLEMA").val() != ''){
				home.$.NS_DB.getTool({_logger : home.logger}).select({
		            id			:'SDJ.Q_QUESITO',
		            parameter	:
		            {
						iden_problema		: { v : $("#ID_PROBLEMA").val(), t : 'N'}
		            }
				}).done( function(resp) {
					$("#Quesito").val(resp.result[0].QUESITO);
				});
			}	
		},
		
		setEvents:function(){
			
			$("#butInserisci").on("click", MODULO_RM.inserisciProblema );
			
			$("#txtPeso").blur(function(){
				if($(this).val() != ''){
					
					if(	!$.isNumeric($(this).val())){
						$(this).val("");
						$(this).focus();
						home.NOTIFICA.warning({
				            message: 'Il valore inserito non \u00E8 numerico!',
				            title: "Attenzione"
				        });
						return;
					}
				}
			});
			
			$("#butCerca").on("click",function(){
				
				var urlAgg = "&PROVENIENZA=MODULO_RM&VALORE_RICERCA=" + $("#Accertamenti").val();
				var url = "MMG_WORKLIST_ACCERTAMENTI" + urlAgg;
				home.NS_MMG.apri( url );
			});
			$(".butStampa").on("click", MODULO_RM.salvaStampa );
			$(".butStampaInformativa").on("click", function() {
				MODULO_RM.stampaInformativa('INFORMATIVA');
			});
			$(".butStampaIndicazioni").on("click", function() {
				MODULO_RM.stampaInformativa('INDICAZIONI');
			});
			
			NS_MMG_UTILITY.infoPopup(traduzione.lblInfoDispoEleNR, {}, $("#lblDispoEleNR"));
			NS_MMG_UTILITY.infoPopup(traduzione.lblInfoProtesi, {}, $("#lblProtesi"));
			NS_MMG_UTILITY.infoPopup(traduzione.lblInfoFiltriStentSpiraliNon, {}, $("#lblFiltriStentSpiraliNon"));
		},

		checkPrivacy:function(){
			
			NS_MMG_UTILITY.checkPermessoSpecialista([$("#Notizie_Clin"),$("#Quesito")]);
		},
		
		inserisciProblema: function() {
			
			if($("#cmbProblemiPaziente").val() != ''){
				MODULO_RM.riempiAnamnesi();
			}
		},
		
		riempiAnamnesi: function() {
			
			if($("#Notizie_Clin").val() == ''){
			
				$("#Notizie_Clin").val($("#cmbProblemiPaziente").val());
				
			} else{
				$("#Notizie_Clin").val($("#Notizie_Clin").val() + ', ' + $("#cmbProblemiPaziente").val());
			}
			
			$("#cmbProblemiPaziente").val("");
		},
		
		beforeSave: function() {
			
			$("#cmbProblemiPaziente").val("");
			
			return true;
		},
		
		beforeClose: function() {
			
			if ( !home.CARTELLA.isActive() ) {
				
				home.NS_OBJECT_MANAGER.clear();
			}
			return true;
		},
		
		successSave: function(pIden) {
			
			if ( MODULO_RM.daStampare ){
				
				MODULO_RM.stampa(pIden);
			}
			NS_FENIX_SCHEDA.chiudi();
		},
		
		salvaStampa: function(){
			
			MODULO_RM.daStampare = true;
			
			NS_FENIX_SCHEDA.registra();
		},
		
		stampa: function(pIden){
				
			var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
			
			var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
			
			home.NS_PRINT.print({
				path_report: "MODULO_RM_V2.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
		},
		
		stampaInformativa:function(vType){

			if (vType === 'INDICAZIONI') {
				home.NS_PRINT.print({
					path_report: "INFORMATIVA_MODULO_RM_V2.RPT&t=" + new Date().getTime(),
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','S'),
					output: "pdf"
				});
			} else {
				home.NS_PRINT.print({
					url: home.NS_FENIX_TOP.getAbsolutePathServer() + encodeURI("MMG/MOD 142-76  informativa e consenso all'esame RM.pdf") + '?',
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','S')
				});
			}
			
		}
};
