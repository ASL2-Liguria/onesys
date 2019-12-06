$(function(){
	MODULO_PET.init();
	MODULO_PET.setEvents();
	MODULO_PET.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_PET.successSave;
	//NS_FENIX_SCHEDA.beforeClose = MODULO_PET.beforeClose;
});

var MODULO_PET = {
		
			daStampare : false,
			
			init:function(){
				
				home.MODULO_PET = this;

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
				$("#radSesso_U").hide();
				radProvenienza.disable();
				$("#txtDett_Diagnosi").parents().attr("colSpan","8");
				
				if(!LIB.isValid($("#IDEN").val())){
					
					/*******In inserimento carico alcuni campi...********/
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.INTERVENTI_DATA',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
			            }
					}).done( function(resp) {

						var str = '';
						
						for(var i = 0; i < resp.result.length; i++) {
							
							//alert(resp.result[i].INTERVENTI)
							str += resp.result[i].INTERVENTI + "\n";
						}
						$("#taInterventi").val(str);
					} );
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_ALTEZZA_PAZIENTE',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
			            }
					}).done( function(resp) {
						$("#txtAltezza").val(resp.result[0].ALTEZZA);
					} );
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_DIABETE_PAZIENTE',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
			            	iden_med		: { v : $("#IDEN_PER").val(), t : 'N'},
			            	descr			: { v : 'DIABETE MELLITO', t : 'V'}
			            }
					}).done( function(resp) {
						if(resp.result[0].DIABETE != 0){
							radDiabete.selectByValue( 'S' );
						}
					} );
					
					/*******...e ne svuoto altri********/
					
					$("#txtDett_Richiesta").val("");
					$("#txtDett_Diagnosi").val("");
					radRichiesta.empty();
					radDiagnosi.empty();
					radQuesitoClinico.empty();
					$("#taEsordio").val("");
					$("#txtAltro").val("").hide();
					radSesso.selectByValue( home.ASSISTITO.SESSO );
				}
			},
			
			setEvents:function(){
				
				$("#txtAltezza, #txtPeso").keyup(function(){
					if($(this).val() != ''){
						
						if(	!$.isNumeric($(this).val())){//--->si puo' usare il punto, ma non la virgola
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
				
				$("#radQuesitoClinico").on("change", function(){
					if($("#h-radQuesitoClinico").val() == 'Q_6'){
						
						$("#txtAltro").show();
					}else{
						$("#txtAltro").hide();
					}
				});
				
				$(".butStampa").on("click", MODULO_PET.salvaStampa );
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#txtDett_Diagnosi"), $("#taEsordio")]);
			},
			
			beforeClose: function() 
			{
				
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_PET.daStampare ) 
				{
					MODULO_PET.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_PET.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_PET.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};
