$(document).ready(function(){
	MODULO_PATENTE.init();
	MODULO_PATENTE.setEvents();
	MODULO_PATENTE.checkPrivacy();
	
	NS_FENIX_SCHEDA.successSave = MODULO_PATENTE.successSave;
});

var MODULO_PATENTE = {
		
			daStampare : false,
			
			init:function(){
				
				MODULO_PATENTE.appendInfo();

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_PATENTE.salvaStampa );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			appendInfo:function(){
				
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_I'], {}, $("#lblAffezioniCardioVascolari"));
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_II'], {}, $("#lblDiabete"));

				$("#lblInsufficienzaRenale").append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_III'], {}));
				$("#lblApparatoVisivo").append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_IV'], {}));
				$("#lblEpilessia").append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_V'], {}));
				$("#lblSostanzePsicotrope").append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_VI'], {}));
				$("#lblProtesi").append(NS_MMG_UTILITY.infoPopup(traduzione['lblNota_VII'], {}));
				
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_PATENTE.daStampare ) 
				{
					MODULO_PATENTE.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_PATENTE.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_PATENTE.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}		
};

