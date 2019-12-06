
$(document).ready(function(){
	
	DIARIO.init();
	DIARIO.setEvents();
	NS_FENIX_SCHEDA.successSave = DIARIO.successSave;
	NS_FENIX_SCHEDA.afterSave = DIARIO.afterSave;
});


DIARIO = {
		
		daStampare:false,
		
		init:function(){ 
			
			if(LIB.isValid($("#ID_PROBLEMA").val()) && $("#ID_PROBLEMA").val() != ""){
				$("#IDEN_PROBLEMA").val($("#ID_PROBLEMA").val());
			}
			
			$("#hAction").val($("#ACTION").val());
			
			if($("#ACTION").val() == 'MOD'){
				$("#txtData").val($("#DATA").val());
				$("#h-txtData").val(moment($("#DATA").val(), "DD/MM/YYYY").format("YYYYMMDD"));
				$("#txtNote").text(he.unescape($("#NOTA").val()));
				DIARIO.checkProblema($("#IDEN_PROBLEMA").val());
			}else{
				var problema = home.ASSISTITO.IDEN_PROBLEMA;
				DIARIO.checkProblema(problema);
			}
		},
		
		setEvents:function(){
			$(".butStampa").on("click", function(){
				
				DIARIO.salvaStampa();
			});
		},
		
		checkProblema:function(problema){
			if(problema != ''){
				$("#cmbProblema").val(problema);
			}
		},

		salvaStampa: function(){

			DIARIO.daStampare = true;
			
			NS_FENIX_SCHEDA.registra();
		},
		
		stampa: function(pIden){
			
			var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
			
			var prompts = { pIden:vIden, pIdenMed:home.CARTELLA.IDEN_MED_PRESCR };
			
			home.NS_PRINT.print({
				path_report: "NOTE.RPT" + "&t=" + new Date().getTime(),
				prompts: prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
			
			DIARIO.daStampare = false;
		},
		
		successSave: function(pIden) {
			
			try{
				home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkNoteDiario();
				home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkVisite();
			}catch(e) {
				//alert(e.description);
			}
			
			if ( DIARIO.daStampare ) {
				DIARIO.stampa(pIden);
			}
		},
		
		afterSave:function(){

			home.FILTRI_DIARI_WK.initWk();
			home.NS_FENIX_TOP.chiudiUltima();
		}
};	
