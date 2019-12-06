$(document).ready(function(){
	MODULO_REAZIONE_AVVERSA.init();
	MODULO_REAZIONE_AVVERSA.setEvents();
	MODULO_REAZIONE_AVVERSA.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_REAZIONE_AVVERSA.successSave;

});

var MODULO_REAZIONE_AVVERSA = {
		
			daStampare : false,
			
			init:function(){

				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
				$("#txtOrigineEtnica").attr("ciao","ciao");
				
				$("#txtCodiceASL, #txtNome, #txtCognome, #txtIndirizzo, #txtTelefono, #txtFax, #txtEMail").closest("tr").hide();
				
				if($("#h-radGravitaReazione").val() == 'GRAVE'){
					$("#chkDettGravitaReazione").closest("tr").show();
					
				}else{
					$("#chkDettGravitaReazione").closest("tr").hide();
				}
				
				if($("#h-radEsito").val() == 'E_5'){
					$("#txtDataDecesso").closest("tr").show();
					$("#chkDettDecesso").closest("tr").show();
					
				}else{
					$("#txtDataDecesso").closest("tr").hide();
					$("#chkDettDecesso").closest("tr").hide();
				}
				
				if($("#h-radEsito").val() == 'E_1'){
					$("#txtDataRisoluzione").closest("tr").show();
					
				}else{
					$("#txtDataRisoluzione").closest("tr").hide();
				}
				
				
				if(!LIB.isValid($("#IDEN").val())){
					
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_DATI_MEDICO',
			            parameter:
			            {
			            	iden_med		: { v : $("#IDEN_PER").val(), t : 'N'}
			            }
					}).done( function(resp) {
						$("#txtNome").val(resp.result[0].NOME);
						$("#txtCognome").val(resp.result[0].COGNOME);
						$("#txtIndirizzo").val(resp.result[0].INDIRIZZO);
						$("#txtCodiceASL").val(resp.result[0].CODICE_ASL);
						$("#txtTelefono").val(resp.result[0].TELEFONO);
						$("#txtEMail").val(resp.result[0].EMAIL);
						$("#txtFax").val(resp.result[0].FAX);
					} );
				}
				
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_I'], {}, $("#fldVII > legend"));
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_II'], {}, $("#lbltxtFarmaco1, #lbltxtFarmaco2, #lbltxtFarmaco3"));
				NS_MMG_UTILITY.infoPopup(traduzione['lblNota_III'], {}, $("#lblEsami"));
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_REAZIONE_AVVERSA.salvaStampa );
				
				$("#radGravitaReazione_GRAVE").on("click", function(){
					$("#chkDettGravitaReazione").closest("tr").show();
				});
				
				$("#radGravitaReazione_NOTGRAVE").on("click", function(){
					$("#chkDettGravitaReazione").closest("tr").hide();
				});
				
				$("#radEsito_E_5").on("click", function(){
					$("#txtDataDecesso").closest("tr").show();
					$("#chkDettDecesso").closest("tr").show();
				});
				
				$("#radEsito_E_1, #radEsito_E_2, #radEsito_E_3, #radEsito_E_4, #radEsito_E_6").on("click", function(){
					$("#txtDataDecesso").closest("tr").hide();
					$("#chkDettDecesso").closest("tr").hide();
				});
				
				$("#radEsito_E_1").on("click", function(){
					$("#txtDataRisoluzione").closest("tr").show();
				});
				
				$("#radEsito_E_2, #radEsito_E_3, #radEsito_E_4, #radEsito_E_5, #radEsito_E_6").on("click", function(){
					$("#txtDataRisoluzione").closest("tr").hide();
				});
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#taDescrReazione")]);
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_REAZIONE_AVVERSA.daStampare ) 
				{
					MODULO_REAZIONE_AVVERSA.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_REAZIONE_AVVERSA.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_REAZIONE_AVVERSA.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};

