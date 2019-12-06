$(function(){
	MODULO_RSA.init();
	MODULO_RSA.setEvents();
	MODULO_RSA.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_RSA.successSave;
	NS_FENIX_SCHEDA.beforeSave = MODULO_RSA.beforeSave;
});

var MODULO_RSA = {
		
			daStampare : false,
			
			init:function(){
				
				$("#txtAffezioni").parents().attr("colSpan","4");
				
				MODULO_RSA.checkValRadio();

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_RSA.salvaStampa );
				$("#radRicovero").on("click", MODULO_RSA.checkValRadio );
				$("#butInserisci").on("click", MODULO_RSA.inserisciProblema );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#txtAffezioni"),$("#cmbProblemiPaziente")]);
			},
			
			checkValRadio: function() { 
				if (radRicovero.val()=='RAD_1' || radRicovero.val()=='RAD_2') {
					$("#radTipRicovero").closest("tr").show();
					$("#radDettADI").closest("tr").hide();
					
				} else if (radRicovero.val()=='RAD_5'){
					$("#radDettADI").closest("tr").show();
					$("#radTipRicovero").closest("tr").hide();
					
				} else {
					$("#radDettADI").closest("tr").hide();
					$("#radTipRicovero").closest("tr").hide();
				}
			},
			
			inserisciProblema: function() {
				if($("#cmbProblemiPaziente").val() != ''){
					MODULO_RSA.riempiAnamnesi();
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
			
			beforeSave: function() {
				$("#cmbProblemiPaziente").val("");
				
				return true;
			},
			
			beforeClose: function() 
			{
				
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_RSA.daStampare ) 
				{
					MODULO_RSA.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_RSA.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_RSA.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};
