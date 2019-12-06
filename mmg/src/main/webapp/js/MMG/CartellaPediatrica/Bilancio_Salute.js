$(document).ready(function()
{
	BILANCIO_SALUTE.init();
	NS_FENIX_SCHEDA.customizeParam	= BILANCIO_SALUTE.customizeParam;
	NS_FENIX_SCHEDA.successSave     = BILANCIO_SALUTE.successSave;

});

var paramOut = {'p_result': 'p_result', 'p_years': 'p_years', 'p_months': 'p_months', 'p_days': 'p_days'};

var BILANCIO_SALUTE = {
		
	daStampare : false,
		
	init: function(){
		
		$(".butSalva").removeClass("butVerde");
		$(".butStampa").addClass("butVerde");
		
		$(".butStampa").on("click", BILANCIO_SALUTE.salvaStampa );
		$("#txtData").on("change", function(){ BILANCIO_SALUTE.getAgeYMD(); });
		$("#txtData").on("blur", function(){ BILANCIO_SALUTE.getAgeYMD(); });
		
		PLS_UTILITY.showPercentile();

		var iden = $("#hIden").val();
		if (iden != '') {
			$("#IDEN").val(iden);
			$("#txtAltezza, #txtPeso, #txtCirconferenza_Cranica").keyup();
			
		} else {
			$("#hIden").remove();
			
			BILANCIO_SALUTE.getAgeYMD();
			/*toolKitDB.executeProcedureDatasourceOut('SP_AGE_YMD', 'MMG_DATI', {'V_IDEN_ANAG': home.ASSISTITO.IDEN_ANAG}, paramOut, function(result){
				
				$("#txtEtaAnni").val(result.p_years);
				$("#txtEtaMesi").val(result.p_months);
				$("#txtEtaGiorni").val(result.p_days);
			});*/
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
				id:'SDJ.BILANCIO_INSERIMENTO',
				parameter:
				{
					iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
				}
			}).done( function(resp) {

				if(typeof resp.result[0] != 'undefined'){
					$("#txtPeso").val(resp.result[0].PESO);
					$("#txtAltezza").val(resp.result[0].ALTEZZA);
					$("#txtCirconferenza_Cranica").val(resp.result[0].CIRCONFERENZA_CRANICA);
				}
				$("#txtAltezza, #txtPeso, #txtCirconferenza_Cranica").keyup();
			} );
			
		}
		
		$("#txtBMI").attr("readonly","readonly").addClass("readonly");
	},
	
	customizeParam: function( params )
	{
		params.extern = true;
		return params;
	},
	
	getAgeYMD:function(){
		
		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
		
			id:'MMG.SP_AGE_YMD_DATE',
			parameter: {
				'V_IDEN_ANAG'	: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
				'P_DATE' 		: { v : $("#h-txtData").val(), t : 'V'},
				p_result		: { v : null, t : 'V' , d: 'O'},
				p_years			: { v : null, t : 'N' , d: 'O'},
				p_months		: { v : null, t : 'N' , d: 'O'},
				p_days			: { v : null, t : 'N' , d: 'O'}
			}

		}).done( function(resp) {

			$("#txtEtaAnni").val(resp.p_years);
			$("#txtEtaMesi").val(resp.p_months);
			$("#txtEtaGiorni").val(resp.p_days);
		} );

	},
	
	salvaStampa: function()
	{
		BILANCIO_SALUTE.daStampare = true;
		NS_FENIX_SCHEDA.registra();
	},
	
	stampa: function(pIden){
		
		var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
		
		var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
		
		var path_report = "BILANCIO_SALUTE_" + $("#KEY_LEGAME").val().split("_")[2] + ".RPT" + "&t=" + new Date().getTime();
		
		home.NS_PRINT.print({
			path_report	: path_report,
			prompts		: prompts,
			show		: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output		: "pdf"
		});
	},
	
	successSave: function(pIden){

		var idBilancio = $("#KEY_LEGAME").val().split("_")[2];
		
		if ( BILANCIO_SALUTE.daStampare ) 
		{
			BILANCIO_SALUTE.stampa(pIden);
		}

		try {
			home.NS_RIEPILOGO_BILANCIO_SALUTE.aggiorna(idBilancio);
			home.NS_RIEPILOGO_BILANCIO_SALUTE.refreshWk();
		} catch(e) {}
			
		try {
			home.FILTRI_DIARI_WK.objWk.refresh();
		} catch(e) {}
		
		try {
			home.SCADENZARIO_BACHECA.objWk.refresh();
		} catch(e) {}
		NS_FENIX_SCHEDA.chiudi();
		
		return true;
	},
	
	getValori: function(val){
		var ritorno = {};
		
		ritorno.PIDENANAG = home.ASSISTITO.IDEN_ANAG;
		ritorno.PIDENSCHEDA = val;
		
		ritorno.PIDENACCESSO = home.ASSISTITO.IDEN_ACCESSO;
		ritorno.PIDENPROBLEMA = home.ASSISTITO.IDEN_PROBLEMA;
		
		ritorno.PIDENMED = home.baseUser.IDEN_PER;
		ritorno.PUTENTE = home.baseUser.IDEN_PER;
		
		ritorno.P_DATA = DATE.format({date:$("#txtData").val(),format:"DD/MM/YYYY",format_out:"YYYYMMDD"});
		ritorno.P_NOTEDIARIO = "Compilato Bilancio di Salute n. " + $("#KEY_LEGAME").val().split("_")[2];
		ritorno.P_TIPO = 'BILANCIO_SALUTE';
		
		return ritorno;
	}
};
