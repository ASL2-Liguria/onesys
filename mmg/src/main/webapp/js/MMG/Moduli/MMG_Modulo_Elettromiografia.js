$(document).ready(function(){
	MODULO_ELETTROMIOGRAFIA.init();
	MODULO_ELETTROMIOGRAFIA.setEvents();
	MODULO_ELETTROMIOGRAFIA.checkPrivacy();
	
	NS_FENIX_SCHEDA.successSave = MODULO_ELETTROMIOGRAFIA.successSave;
});

var MODULO_ELETTROMIOGRAFIA = {
		
	daStampare : false,
	
	init:function(){

		$(".butSalva").removeClass("butVerde");
		$(".butStampa").addClass("butVerde");
		
		$("#h-sospettoDiagnostico").val()!= 'SospDia4' ? $("#fldDettMononeuropatia").hide() : $("#fldDettMononeuropatia").show();
		$("#h-sospettoDiagnostico").val()!= 'SospDia10' ? $("#fldDettAltro").hide() : $("#fldDettAltro").show();
		
		if($("[name='NUMERO_TELEFONO']").val() == ''){
								
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				
				id:'SDJ.Q_SCHEDA_ANAGRAFICA',
				parameter:
				{
					iden		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
				}
			
			}).done( function(resp) {
				
				var valore = typeof resp.result[0].TEL == 'undefined' ? '' : resp.result[0].TEL;
				$("[name='NUMERO_TELEFONO']").val(valore);
			});
		}

		MODULO_ELETTROMIOGRAFIA.setLabelInformativa();
	},
	
	setEvents:function(){
		
		$(".butStampa").on("click", MODULO_ELETTROMIOGRAFIA.salvaStampa );
		
		$("#h-sospettoDiagnostico").on("change", function() {
			$("#h-sospettoDiagnostico").val()!= 'SospDia4' ? $("#fldDettMononeuropatia").hide() : $("#fldDettMononeuropatia").show();
			$("#h-sospettoDiagnostico").val()!= 'SospDia10' ? $("#fldDettAltro").hide() : $("#fldDettAltro").show();
		} );
	},

	checkPrivacy:function(){
		
		NS_MMG_UTILITY.checkPermessoSpecialista([]);
	},
	
	setLabelInformativa:function(){
		
		var testo = "<a><p>";
		testo += "<b>" + traduzione.lblInformativa1 + '</b></br>'
		testo += traduzione.lblInformativa2 + '</br></br>'
		testo += "<b>" + traduzione.lblInformativa3 + '</b></br>'
		testo += traduzione.lblInformativa4 + '</br>'
		testo += traduzione.lblInformativa5 + "</p></a>"
		
		$("#fldSospettoDiagnostico .campi").append(NS_MMG_UTILITY.getLabelInformativa({text : testo}));
		
	},
	
	successSave: function(pIden) {
		
		if ( MODULO_ELETTROMIOGRAFIA.daStampare ){
			MODULO_ELETTROMIOGRAFIA.stampa(pIden);
		}
		
		NS_FENIX_SCHEDA.chiudi();
	},
	
	salvaStampa: function(){
		
		MODULO_ELETTROMIOGRAFIA.daStampare = true;
		NS_FENIX_SCHEDA.registra();
	},
	
	stampa: function(pIden){
		
		var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
		
		var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
		
		home.NS_PRINT.print({
			path_report: "MODULO_ELETTROMIOGRAFIA.RPT" + "&t=" + new Date().getTime(),
			prompts: prompts,
			show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output: "pdf"
		});
	}		
};

