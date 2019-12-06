  $(function()
{
	MODULO_TC.init();
	MODULO_TC.setEvents();
	MODULO_TC.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_TC.successSave;
	NS_FENIX_SCHEDA.beforeClose = MODULO_TC.beforeClose;
	NS_FENIX_SCHEDA.beforeSave = MODULO_TC.beforeSave;
});

var MODULO_TC = {
		
			daStampare : false,
			
			accertamento : $("#txtAcc_Eff"),
			
			init:function(){
				
				home.MODULO_TC = this;
				$("#Anamnesi").parents().attr("colSpan","4");
				
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
				/****** Se la pagina viene caricata dalla wk delle ricette valorizzo alcuni campi con valori ricavati dalla ricetta ***********************************/
				
				/*if (LIB.isValid($("#PROBLEMA_RICETTA").val()) && $("#PROBLEMA_RICETTA").val() != "null"){
					
					var problema = $("#PROBLEMA_RICETTA").val();
					$("#Quesito").val(problema);
				}*/
				
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
				/*if(LIB.isValid($("#ACCERTAMENTO_RICETTA").val()) && $("#ACCERTAMENTO_RICETTA").val() != ''){
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id			:'SDJ.Q_INDAGINE',
			            parameter	:
			            {
			            	iden_accertamento		: { v : $("#ACCERTAMENTO_RICETTA").val(), t : 'V'}
			            }
					}).done( function(resp) {
						$("#txtAcc_Eff").val(resp.result[0].INDAGINE);
					});
				}*/
				
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
				
				/********* Faccio apparire alcuni text se il rispettivo radio ha valore S*****************/
				
				if($("#h-radTratt_Farma").val()!= 'S'){
					$("#Dett_Tratt_Farma").hide();
				}else{
					$("#Dett_Tratt_Farma").show();
				};
				
				if($("#h-radRischio_Allergico").val()!= 'S'){
					$("#Dett_Rischio_Allergico").hide();
				}else{
					$("#Dett_Rischio_Allergico").show();
				};
				
				$(".sololettura").attr('readonly', true);
			},
			
			setEvents:function(){
				
				$("#butInserisci").on("click", MODULO_TC.inserisciProblema );

				$("#radTratt_Farma_S").on("click", function() {
					$("#Dett_Tratt_Farma").toggle();
				});
				
				$("#radTratt_Farma_N").on("click", function() {
					$("#Dett_Tratt_Farma").hide();
				});
				
				$("#radTratt_Farma_Non_Noto").on("click", function() {
					$("#Dett_Tratt_Farma").hide();
				});

				$("#radRischio_Allergico_S").on("click", function() {
					$("#Dett_Rischio_Allergico").toggle();
				});
				
				$("#radRischio_Allergico_N").on("click", function() {
					$("#Dett_Rischio_Allergico").hide();
				});
				
				$("#radRischio_Allergico_Non_Noto").on("click", function() {
					$("#Dett_Rischio_Allergico").hide();
				});
				
				$("#butCerca").on("click",function(){
					
					var urlAgg = "&PROVENIENZA=MODULO_TC&VALORE_RICERCA=" + $("#Accertamenti").val();
					var url = "MMG_WORKLIST_ACCERTAMENTI" + urlAgg;
					home.NS_MMG.apri( url );
				});
				
				$(".butStampa").on("click", MODULO_TC.salvaStampa );
				$(".butConsensoInformato").on("click", MODULO_TC.stampaConsensoInformato );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#Anamnesi"),$("#Quesito")]);
				
			},
			
			inserisciProblema: function() {
				if($("#cmbProblemiPaziente").val() != ''){
					MODULO_TC.riempiAnamnesi();
				}
			},
			
			riempiAnamnesi: function() {
				
				if($("#Anamnesi").val() == ''){
					$("#Anamnesi").val($("#cmbProblemiPaziente").val());
					
				} else{
					$("#Anamnesi").val($("#Anamnesi").val() + ', ' + $("#cmbProblemiPaziente").val());
				}
				$("#cmbProblemiPaziente").val("");
			},
			
			beforeSave: function() {
				$("#cmbProblemiPaziente").val("");
				
				return true;
			},
			
			beforeClose: function() 
			{
				if ( !home.CARTELLA.isActive() ) 
				{
					home.NS_OBJECT_MANAGER.clear();
				}
				return true;
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_TC.daStampare ) 
				{
					MODULO_TC.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_TC.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_TC_V2.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			},
			
			stampaConsensoInformato:function(){

				home.NS_PRINT.print({
					path_report: "INFORMATIVA_MODULO_TC_V2.RPT" + "&t=" + new Date().getTime(),
					prompts: '',
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};