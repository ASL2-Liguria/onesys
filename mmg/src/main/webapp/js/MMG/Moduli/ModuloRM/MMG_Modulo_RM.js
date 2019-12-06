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
				
				/******se la pagina viene caricata dalla wk delle ricette valorizzo alcuni campi con valori ricavati dalla ricetta ***********************************/
				
//				if (LIB.isValid($("#PROBLEMA_RICETTA").val()) && $("#PROBLEMA_RICETTA").val() != "null"){
//					
//					var problema = $("#PROBLEMA_RICETTA").val();
//					$("#Quesito").val(problema);
//				}
				
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
				
				/********* Faccio apparire alcuni text se il rispettivo radio ha valore S*****************/
				
				if($("#h-Corpi_Metallici").val() == 'S'){
					
					$("#Dett_Corpi_Metallici_CORP0, #Dett_Corpi_Metallici_CORP1, #Dett_Corpi_Metallici_CORP2, #Dett_Corpi_Metallici_CORP3, " +
							"#Dett_Corpi_Metallici_CORP4, #Dett_Corpi_Metallici_CORP5, #Dett_Corpi_Metallici_CORP6, #Dett_Corpi_Metallici_CORP7").show();
				}else{
					
					$("#Dett_Corpi_Metallici_CORP0, #Dett_Corpi_Metallici_CORP1, #Dett_Corpi_Metallici_CORP2, #Dett_Corpi_Metallici_CORP3, " +
							"#Dett_Corpi_Metallici_CORP4, #Dett_Corpi_Metallici_CORP5, #Dett_Corpi_Metallici_CORP6, #Dett_Corpi_Metallici_CORP7").hide();
				}
				
				if($("#h-EsameRM").val() == 'S'){
					
					$("#lblDove, #lblQuando, #lblParte_Corpo, #lblPerche, #Dove, #Quando, #Parte_Corpo, #Perche").show();
					
				}else{
					
					$("#lblDove, #lblQuando, #lblParte_Corpo, #lblPerche, #Dove, #Quando, #Parte_Corpo, #Perche").hide();
				};
				
				//$(".sololettura").attr('readonly', true);
				
				if($("#h-radInsuff_Renale").val() == 'S'){
					
					$("#lblCreatininemia, #Creatininemia, #lblAzotemia, #Azotemia").show();
					
				}else{
					
					$("#lblCreatininemia, #Creatininemia, #lblAzotemia, #Azotemia").hide();
				};
				
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
				
				$("#Corpi_Metallici_N, #Corpi_Metallici_Non_Noto").on("click", function() {
					$("#Dett_Corpi_Metallici_CORP0, #Dett_Corpi_Metallici_CORP1, #Dett_Corpi_Metallici_CORP2, #Dett_Corpi_Metallici_CORP3, " +
							"#Dett_Corpi_Metallici_CORP4, #Dett_Corpi_Metallici_CORP5, #Dett_Corpi_Metallici_CORP6, #Dett_Corpi_Metallici_CORP7").hide();
				});
				
				$("#Corpi_Metallici_S").on("click", function() {
					$("#Dett_Corpi_Metallici_CORP0, #Dett_Corpi_Metallici_CORP1, #Dett_Corpi_Metallici_CORP2, #Dett_Corpi_Metallici_CORP3, " +
							"#Dett_Corpi_Metallici_CORP4, #Dett_Corpi_Metallici_CORP5, #Dett_Corpi_Metallici_CORP6, #Dett_Corpi_Metallici_CORP7").show();
				});
				
				$("#radInsuff_Renale_S").on("click", function() {
					$("#lblCreatininemia, #Creatininemia, #lblAzotemia, #Azotemia").show();//--->prima era toggle();
				});
				
				$("#radInsuff_Renale_N, #radInsuff_Renale_Non_Noto").on("click", function() {
					$("#lblCreatininemia, #Creatininemia, #lblAzotemia, #Azotemia").hide();
				});
				
				$("#EsameRM_S").on("click", function() {
					$("#lblDove, #lblQuando, #lblParte_Corpo, #lblPerche, #Dove, #Quando, #Parte_Corpo, #Perche").show();
				});
				
				$("#EsameRM_N, #EsameRM_Non_Noto").on("click", function() {
					$("#lblDove, #lblQuando, #lblParte_Corpo, #lblPerche, #Dove, #Quando, #Parte_Corpo, #Perche").hide();
				});
				
				$("#butCerca").on("click",function(){
					
					var urlAgg = "&PROVENIENZA=MODULO_RM&VALORE_RICERCA=" + $("#Accertamenti").val();
					var url = "MMG_WORKLIST_ACCERTAMENTI" + urlAgg;
					home.NS_MMG.apri( url );
				});
				
				$(".butStampa").on("click", MODULO_RM.salvaStampa );
				$(".butStampaInformativa").on("click", MODULO_RM.stampaInformativa );
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
				if ( MODULO_RM.daStampare ) 
				{
					MODULO_RM.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_RM.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
					
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_RM.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			},
			
			stampaInformativa:function(){

				home.NS_PRINT.print({
					path_report: "INFORMATIVA_MODULO_RM.RPT" + "&t=" + new Date().getTime(),
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
				
			}
};
