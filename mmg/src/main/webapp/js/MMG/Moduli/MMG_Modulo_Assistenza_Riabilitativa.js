$(function(){
	MODULO_ASSITENZA_RIABILITATIVA.init();
	MODULO_ASSITENZA_RIABILITATIVA.setEvents();
	MODULO_ASSITENZA_RIABILITATIVA.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_ASSITENZA_RIABILITATIVA.successSave;
	NS_FENIX_SCHEDA.beforeSave = MODULO_ASSITENZA_RIABILITATIVA.beforeSave;
});

var MODULO_ASSITENZA_RIABILITATIVA = {
		
			daStampare : false,
			
			init:function(){
				MODULO_ASSITENZA_RIABILITATIVA.checkValRadio();
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_ASSITENZA_RIABILITATIVA.salvaStampa );
				$("#butInserisci").on("click", MODULO_ASSITENZA_RIABILITATIVA.inserisciProblema );
				$("#radRiferito").on("click", MODULO_ASSITENZA_RIABILITATIVA.checkValRadio );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#txtAffezioni"), $("#cmbProblemiPaziente")]);
			},
			
			checkValRadio: function() { 
				if (radRiferito.val()=='S') {
					$("#radLivello").closest("tr").show();
					
				} else {
					$("#radLivello").closest("tr").hide();
				}
			},
			
			inserisciProblema: function() {
				if($("#cmbProblemiPaziente").val() != ''){
					MODULO_ASSITENZA_RIABILITATIVA.riempiAnamnesi();
				}
				
			},
			
			riempiAnamnesi: function() {
				
				if($("#txtAffezioni").val() == ''){
					$("#txtAffezioni").val($("#cmbProblemiPaziente").val());
					
				} else{
					$("#txtAffezioni").val($("#txtAffezioni").val() + ', ' + $("#cmbProblemiPaziente").val());
				}
				$("#cmbProblemiPaziente").val("");
			},
			
			beforeSave: function(){
				
				$("#cmbProblemiPaziente").val("");
				if(radRiferito.val() =='S' && radLivello.val() == ''){
					home.NOTIFICA.warning({

		                message		: "Selezionare un valore tra 1, 2, 3, o 4 per 'Riferito'",
		                title		: "Attenzione",
		                timeout		: 10
		            });
					
					return false;
				}else{
					return true;
				}
			},
			
			successSave: function(pIden) {
				
				if ( MODULO_ASSITENZA_RIABILITATIVA.daStampare ){
					MODULO_ASSITENZA_RIABILITATIVA.stampa(pIden);
				}
				
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function(){
				
				MODULO_ASSITENZA_RIABILITATIVA.daStampare = true;
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_AMMISSIONE_RETE_ASSISTENZA.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};
