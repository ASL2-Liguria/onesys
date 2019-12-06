$(document).ready(function(){
	PRIORITA_CLINICA.init();
	PRIORITA_CLINICA.setEvents();
	PRIORITA_CLINICA.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = PRIORITA_CLINICA.afterSave;
	NS_FENIX_SCHEDA.beforeClose = PRIORITA_CLINICA.beforeClose;

});

var iden = '';
var vSalvaStampa = 'N';
var prov = '';

var PRIORITA_CLINICA = {
		
			accertamento : $("#txtAcc_Eff"),
		
			init:function(){
				
				$("#txtQuadroClinico").parents().attr("colSpan","4");
				
				if (home.ASSISTITO.IDEN_ANAG==null) {
					prov = 'CARTELLA_OUT';
					home.NS_OBJECT_MANAGER.init($("#IDEN_ANAG").val());
				}
				
				home.PRIORITA_CLINICA = this;
				PRIORITA_CLINICA.body = $("body");
				
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
				/******se la pagina viene caricata dalla wk delle ricette valorizzo alcuni campi con valori ricavati dalla ricetta ***********************************/
				
//				if (LIB.isValid($("#PROBLEMA_RICETTA").val()) && $("#PROBLEMA_RICETTA").val() != "null"){
//					
//					var problema = $("#PROBLEMA_RICETTA").val();
//					$("#Sosp_Diagn").val(problema);
//				}
				
				if(LIB.isValid($("#PROBLEMA_RICETTA").val()) && $("#PROBLEMA_RICETTA").val() != ''){
					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id			:'SDJ.Q_QUESITO_FROM_RR_TESTATA',
			            parameter	:
			            {
			            	iden_ricetta		: { v : $("#PROBLEMA_RICETTA").val(), t : 'N'}
			            }
					}).done( function(resp) {
						$("#Sosp_Diagn").val(resp.result[0].QUESITO);
					});
				}
				
				if (LIB.isValid($("#ACCERTAMENTO_RICETTA").val())){
					
					var accertamento = $("#ACCERTAMENTO_RICETTA").val();
					$("#txtAcc_Eff").val(accertamento);
				}
				
				/****** Nel caso in cui la pagina venga chiamata da TAB_RR_ACCERTAMENTI ci pensa la query su DB a popolare i campi del problema e dell'accertamento********/
				if (LIB.isValid($("#URGENZA").val()) && $("#URGENZA").val() != "null"){
					
					var urgenza = $("#URGENZA").val();
//					alert("urgenza: " + urgenza)
					if (urgenza == 'U'){$('#radPri_Cli').data('RadioBox').selectByValue( 'PR1' );}
					if (urgenza == 'B'){$('#radPri_Cli').data('RadioBox').selectByValue( 'PR2' );}
				}
				
				/********Faccio sparire il fieldset dei valori relatvi all'anagrafica del paziente*********/
				
				$("#fld1").hide();
				
				var params = {config:"VPRIORITA_CLINICA",formId:"dati"};
				NS_FENIX_SCHEDA.addFieldsValidator(params);
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", function(){

					PRIORITA_CLINICA.salvaStampa();
				});
				
				$("#butCerca").on("click",function(){
					
					var urlAgg = "&PROVENIENZA=PRIORITA_CLINICA";
					var url = "MMG_WORKLIST_ACCERTAMENTI" + urlAgg;
					home.NS_MMG.apri( url );
				});
				
				$("#butInserisci").on("click", PRIORITA_CLINICA.inserisciProblema );
			},
			
			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([$("#txtQuadroClinico"),$("#Sosp_Diagn")]);
				
			},

			afterSave: function(resp) {

				var iden = resp;

				if(vSalvaStampa == 'S'){
					PRIORITA_CLINICA.stampa(iden);
					PRIORITA_CLINICA.chiudiScheda();
				}
			},
			
			beforeClose: function() {
				
				if (prov=="CARTELLA_OUT") {
					home.NS_OBJECT_MANAGER.clear();
				}
				return true;
			},
			
			chiudiScheda:function(){

				home.NS_FENIX_TOP.chiudiUltima();
			},
			
			inserisciProblema: function() {
				if($("#cmbProblemiPaziente").val() != ''){
					PRIORITA_CLINICA.riempiQuadroClinico();
				}
			},
			
			riempiQuadroClinico: function() {
				
				if($("#txtQuadroClinico").val() == ''){
					$("#txtQuadroClinico").val($("#cmbProblemiPaziente").val());
					
				} else{
					$("#txtQuadroClinico").val($("#txtQuadroClinico").val() + ', ' + $("#cmbProblemiPaziente").val());
				}
				$("#cmbProblemiPaziente").val("");
			},
			
			
			salvaStampa:function(){

				vSalvaStampa = 'S';
				$(".butSalva").trigger("click");
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };

				home.NS_PRINT.print({
					path_report: "MODULO_PRIORITA_CLINICA.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};

