$(document).ready(function(){
	MODULO_MALATTIA_INFETTIVA.init();
	MODULO_MALATTIA_INFETTIVA.setEvents();
	MODULO_MALATTIA_INFETTIVA.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_MALATTIA_INFETTIVA.successSave;

});

var MODULO_MALATTIA_INFETTIVA = {
		
			daStampare : false,
		
			init:function(){
				
				/****All'apertura della pagina faccio sparire determinati campi in base al valore di alcuni radio****/
				
				if($("#h-radTrattamento").val()!= 'TRT_1'){
					
					$("#txtTipo, #txtDurata").closest("tr").hide();
				}
				
				if($("#h-radControllati").val()!= 'S'){
					
					$("#radPrescrProfilassi").closest("tr").hide();
				}
				
				/****Carico il valore della professione nel caso in cui la pagina sia in inserimento****/
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
					
					$("#txtASLDomicilio").val("ASL2");
					$("#txtASLResidenza").val("ASL2");
				}

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
			},
			
			setEvents:function(){
				
				/****sul click di alcuni radio faccio sparire/apparire determinati campi****/
				
				$("#radTrattamento_TRT_2, #radTrattamento_TRT_3").on("click", function(){
					$("#txtTipo, #txtDurata").closest("tr").hide();
				});
				
				$("#radTrattamento_TRT_1").on("click", function(){
					$("#txtTipo, #txtDurata").closest("tr").show();
				});
				
				$("#radControllati_N").on("click", function(){
					$("#radPrescrProfilassi").closest("tr").hide();
				});
				
				$("#radControllati_S").on("click", function(){
					$("#radPrescrProfilassi").closest("tr").show();
				});
				
				$(".butStampa").on("click", MODULO_MALATTIA_INFETTIVA.salvaStampa );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_MALATTIA_INFETTIVA.daStampare ) 
				{
					MODULO_MALATTIA_INFETTIVA.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_MALATTIA_INFETTIVA.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_PEDICULOSI.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
			
};

