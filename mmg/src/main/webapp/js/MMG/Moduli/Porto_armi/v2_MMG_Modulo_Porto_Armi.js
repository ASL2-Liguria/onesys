$(document).ready(function(){
	MODULO_PORTO_ARMI.init();
	MODULO_PORTO_ARMI.setEvents();
	MODULO_PORTO_ARMI.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_PORTO_ARMI.successSave;
	
});

var MODULO_PORTO_ARMI = {
		
			daStampare : false,
			
			init:function(){

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
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
						$("#txtTessera").val(resp.result[0].COD_FISC);
					} );
				}
				
				//nascondo perchè nella versione nuova del modulo (comunicazione del 5 novembre) non è più presente (lucas)
				//TODO:da gestire il versioning del modulo per reperire il giusto report
				$("#lblDellaPersonalita").parent().hide();

				//commentato perchè presente sul modulo da replicare ma non utile al fine della informatizzazione
				//NS_MMG_UTILITY.infoPopup(traduzione['lblNota_I'], {}, $("#lblMalattieSysNervoso, #lblTurbePsichiche, #lblSostanzeStupefacenti"));
				
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_II'], {}, $("#lblEpilessia"));
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_III'], {}, $("#lblUsoStupefacenti, #lblUsoSosPsicotrope, #lblDipendenzaSosPsicotrope"));
				
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_PORTO_ARMI.salvaStampa );
				
				$("#txtDettaglio").on("blur", function(){
					
					var dettaglio = $("#txtDettaglio").val().toUpperCase();
					$("#txtDettaglio").val(dettaglio);
				});
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			successSave: function(pIden) {
				
				if ( MODULO_PORTO_ARMI.daStampare ) {
					
					MODULO_PORTO_ARMI.stampa(pIden);
				}
				
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function(){
				
				MODULO_PORTO_ARMI.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					/*path_report: "MODULO_PORTO_ARMI.RPT" + "&t=" + new Date().getTime(), REPORT VECCHIO*/
					path_report: "MODULO_PORTO_ARMI_V2.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};

