$(function(){
	MODULO_MALATTIA_INFETTIVA_NOT.init();
	MODULO_MALATTIA_INFETTIVA_NOT.setEvents();
	MODULO_MALATTIA_INFETTIVA_NOT.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_MALATTIA_INFETTIVA_NOT.successSave;

});

var MODULO_MALATTIA_INFETTIVA_NOT = {
		
			daStampare : false,
		
			init:function(){
				
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
				if(home.ASSISTITO.SESSO != 'F'){
					
					$("#txtConiugata").closest("tr").hide();
				}
				
				/****All'apertura della pagina faccio sparire determinati campi in base al valore di alcuni radio****/
				
				if($("#h-radVaccinazione").val()!= 'S'){
					
					$("#txtAnnoVacc").closest("tr").hide();
				}
				
				/****Carico il valore della professione, codice SSN e U.L.S.S. nel caso in cui la pagina sia in inserimento****/
				if(!LIB.isValid($("#IDEN").val())){
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_MODULO_ARMI_PROFESSIONE',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
			            }
					}).done( function(resp) {
						$("#txtProfessione").val(resp.result[0].PROFESSIONE);
					} );
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_COD_FISC',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
			            }
					}).done( function(resp) {
						$("#txtCodiceSSN").val(resp.result[0].COD_FISC);
					} );
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_COMUNE_MEDICO',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
							ute_ins			: { v : $("#UTE_INS").val(), t : 'N'}
			            }
					}).done( function(resp) {
						if(LIB.isValid(resp.result[0]) && resp.result[0].COMUNE != '')
							$("#txtComune").val(resp.result[0].COMUNE);
					} );
					
					$("#txtULSS").val("ASL2");
				}
				
			},
			
			setEvents:function(){
				
				/****sul click di alcuni radio faccio sparire/apparire determinati campi****/
				
				$("#radVaccinazione_N, #radVaccinazione_Non_Noto").on("click", function(){
					$("#txtAnnoVacc").closest("tr").hide();
				});
				
				$("#radVaccinazione_S").on("click", function(){
					$("#txtAnnoVacc").closest("tr").show();
				});
				
				$(".butStampa").on("click", MODULO_MALATTIA_INFETTIVA_NOT.salvaStampa );
				
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_MALATTIA_INFETTIVA_NOT.daStampare ) 
				{
					MODULO_MALATTIA_INFETTIVA_NOT.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_MALATTIA_INFETTIVA_NOT.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_MAL_INF.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}

};

