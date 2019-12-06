$(document).ready(function(){
	MODULO_SPORT_PLS.init();
	MODULO_SPORT_PLS.setEvents();
	MODULO_SPORT_PLS.checkPrivacy();
	
	NS_FENIX_SCHEDA.successSave = MODULO_SPORT_PLS.successSave;
});
/*** Questo modulo deve essere visibile solo ai PLS e loro segretarie: 
 * in CONFIG_WEB.PERMESSI sono pressenti 2 righe 
 * una per il gruppo PEDIATRA, l'altra PLS_AMM ***/
var MODULO_SPORT_PLS = {
		
			daStampare : false,
			
			init:function(){
				
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_SPORT_PLS.salvaStampa );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},

			successSave: function(pIden) 
			{
				if ( MODULO_SPORT_PLS.daStampare ) 
				{
					MODULO_SPORT_PLS.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_SPORT_PLS.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_SPORT_PLS.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}		
};

