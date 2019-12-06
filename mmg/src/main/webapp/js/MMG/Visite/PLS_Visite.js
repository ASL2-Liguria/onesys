$(function()
{
	VISITE.init();
	VISITE.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = VISITE.successSave;
	NS_FENIX_SCHEDA.beforeClose = VISITE.beforeClose;
});

var VISITE = {
		
			daStampare:false,
		
			init:function(){
				
				$("#lblTitolo").text(home.ASSISTITO.NOME_COMPLETO);

				if(!LIB.isValid($("#IDEN").val()) 
						&& LIB.isValid(home.ASSISTITO) 
						&& LIB.isValid(home.ASSISTITO.IDEN_PROBLEMA) 
						&& home.ASSISTITO.IDEN_PROBLEMA != ""){
					$("#cmbProblema").val(home.ASSISTITO.IDEN_PROBLEMA);
				}

				$("#txtBMI").attr("readonly","readonly").addClass("readonly");
				
				VISITE.setEvents();
			},
			
			setEvents:function()
			{
				PLS_UTILITY.showPercentile();
				$(".butBilanciSalute").on("click", VISITE.apriBilanciSalute );
				$(".butRilevazioni").on("click", VISITE.apriRilevazioni );
				$(".butStampa").on("click", function(){
					VISITE.salvaStampa();
				});
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			apriBilanciSalute: function(){
				
				home.NS_MMG.apri('RIEPILOGO_BILANCIO_SALUTE');
			},
			
			apriRilevazioni: function(){
				
				home.NS_MMG.apri('RIEPILOGO_RILEVAZIONI_PLS');
			},
			
			beforeClose: function() 
			{
				if ( !home.CARTELLA.isActive() ) 
				{
					home.NS_OBJECT_MANAGER.clear();
				}
				return true;
			},
			
			successSave: function(pIdenVisita)
			{

				if ( VISITE.daStampare ) {
					VISITE.stampa(pIdenVisita);
				}
				
				try{
					home.FILTRI_DIARI_WK.initWk();
				}
				catch(e) {}
				
				try{
					home.WK_VISITE.initWk();
				}catch(e) {}
				
				try{
					
					home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkNoteDiario();
					home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkVisite();
				}
				catch(e) {}
					
				NS_FENIX_SCHEDA.chiudi();
				
				return true;
			},
			
			salvaStampa: function()
			{
				VISITE.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIden:vIden, pIdenMed:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "VISITE.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
				
				VISITE.daStampare = false;
			}
					
};