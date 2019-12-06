$(function()
{
	VISITE.init();
	VISITE.checkPrivacy();
	NS_FENIX_SCHEDA.successSave 	= VISITE.successSave;
	NS_FENIX_SCHEDA.beforeClose 	= VISITE.beforeClose;
});

var VISITE = {
		
			daStampare:false,	
		
			init:function(){
				
				$("#lblTitolo").html($("#lblTitolo").html() + " - " + home.ASSISTITO.NOME_COMPLETO);
				
				if(LIB.isValid($("#ID_PROBLEMA").val()) && $("#ID_PROBLEMA").val() != ""){
					$("#IDEN_PROBLEMA").val($("#ID_PROBLEMA").val());
				}

				if(!LIB.isValid($("#IDEN").val()) 
						&& LIB.isValid(home.ASSISTITO) 
						&& LIB.isValid(home.ASSISTITO.IDEN_PROBLEMA) 
						&& home.ASSISTITO.IDEN_PROBLEMA != ""){
					$("#cmbProblema").val(home.ASSISTITO.IDEN_PROBLEMA);
				}
				
				if(!LIB.isValid($("#IDEN").val())){

					home.$.NS_DB.getTool({_logger : home.logger}).select({
			            id:'SDJ.Q_ALTEZZA_PAZIENTE',
			            parameter:
			            {
			            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
			            }
					}).done( function(resp) {
						$("#txtAltezza").val(resp.result[0].ALTEZZA);
					} );
				}
				
				VISITE.setLayout();
				VISITE.setEvents();
			},
			
			setEvents:function(){
				
				$("#cmbProblema").on("change", function(){
					$("#IDEN_PROBLEMA").val($("#cmbProblema").val());
				});
				
				$("#txtAltezza").keyup(function(){
					if($(this).val() != ''){

						VISITE.checkValueNumber($(this));
						
						if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
							var BMI = top.NS_MMG_UTILITY.calcoloBMI( $(this).val(), $("#txtPeso").val() );
							$("#txtBMI").val(BMI);
						}
					}
				});
				
				$("#txtPeso").keyup(function(){
					if($(this).val() != ''){

						VISITE.checkValueNumber($(this));

						if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
							var BMI = home.NS_MMG_UTILITY.calcoloBMI($("#txtAltezza").val(), $(this).val());
							$("#txtBMI").val(BMI);
						}
					}
				});
				
				$("#txtCirconferenza, #txtFrequenza, #txtRitmo, #txtAmpiezza, #txtSimmetria, #txtBMI," +
						"#txtMassima, #txtMinima, #txtTemperatura, #txtInr, #txtTao, #txtGlicemia, #txtSaturazione_Ossigeno").keyup(function(){
					if($(this).val() != ''){
						VISITE.checkValueNumber($(this));
					}
				});
				
				$("#txtAttFisica").blur(function(){
					if($(this).val() != ''){
						$(this).val($(this).val().toUpperCase());
					}
				});
				
				$(".butStampa").on("click", function(){
					
					VISITE.salvaStampa();
				});
				
				$("#txtBMI").attr("readonly","readonly").addClass("readonly");
			},
			
			beforeClose: function() {
				
				if ( !home.CARTELLA.isActive() ) {
					
					home.NS_OBJECT_MANAGER.clear();
				}
				return true;
			},
			
			checkValueNumber:function(obj){
				
				obj.val(obj.val().replace(",","."));
				
				if(	!$.isNumeric(obj.val())){
					obj.val("");
					obj.focus();
					home.NOTIFICA.warning({
			            message: 'Il valore inserito non \u00E8 numerico!',
			            title: traduzione.lblAttenzione
			        });
					return;
				}else{
					obj.val(obj.val().replace(".",","));
				}
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},

			
			salvaStampa: function(){
				
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
			},
			
			setLayout:function(){

				$("#Anamnesi").height(NS_MMG_UTILITY.getHeightPercent(40));
				$("#Esame").height(NS_MMG_UTILITY.getHeightPercent(60));
				$("#Ispezione").height(NS_MMG_UTILITY.getHeightPercent(60));
				$("#Considerazioni").height(NS_MMG_UTILITY.getHeightPercent(60));
				$("#txtBMI").attr("readonly","readonly").addClass("readonly");
			},
			
			successSave:function(pIdenVisita){

				var iden_problema = $('#IDEN_PROBLEMA').val();
				var vMsg = "Visita inserita " + (($("#cmbProblema option:selected").text() != "") ? (" - " + $("#cmbProblema option:selected").text()) : "");
				
				var vParameters = {
					'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
					'PIDENSCHEDA' 		: { v : pIdenVisita, t : 'N'},
					'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
					'PIDENPROBLEMA' 	: { v : iden_problema, t : 'N'},
					'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					'P_DATA' 			: { v : $("#h-txtData").val(), t : 'V'},
					'P_ACTION' 			: { v : 'MOD_SCHEDA', t : 'V'},
					'P_IDEN_NOTA'		: { v : '', t : 'V'},
					'V_OSCURATO'		: { v : 'N', t : 'V'},
					'P_NOTEDIARIO' 		: { v : vMsg, t : 'C'},
					'P_TIPO' 			: { v : 'VISITA', t : 'V'},
					'p_sito' 			: { v : 'MMG', t : 'V'},
					"V_RETURN_DIARIO"	: {	t : 'V', d: 'O'}
				};

				home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
					
					id:'SP_NOTE_DIARIO',
					parameter: vParameters
					
				}).done( function() {
					
					if ( VISITE.daStampare ) {
						VISITE.stampa(pIdenVisita);
					}
					
					try{
						home.FILTRI_DIARI_WK.initWk();
					}catch(e) {}
					
					try{
						home.WK_VISITE.initWk();
					}catch(e) {}
					
					try{
						home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkNoteDiario();
						home.RIEPILOGO_INSERIMENTO_PROBLEMA.initWkVisite();
					}catch(e) {}
					
					NS_FENIX_SCHEDA.chiudi();
				});
				
				return true;
			}
};