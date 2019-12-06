$(function(){
	ANAMNESI_PRE_NEONATALE.init();
	ANAMNESI_PRE_NEONATALE.setEvents();

	NS_FENIX_SCHEDA.successSave = ANAMNESI_PRE_NEONATALE.successSave;
	NS_FENIX_SCHEDA.beforeSave = ANAMNESI_PRE_NEONATALE.beforeSave;
});

var ANAMNESI_PRE_NEONATALE = {
		
			init:function(){
				
				$("#txtControlli, #txtTerapie, #radParto_III, #txtNoteParto, #txtManovre," +
						" #txtInfezioni, #txtFarmaci, #txtRx, #txtDettGravidanza, #txtAltreMalFam").parents().attr("colSpan","4");
				
				$("#txtDettPresentazione").parents().attr("colSpan","2");
				
				//perchè cavolo c'era 'sto pulsante se non c'è nemmeno il report
				$(".butStampa").hide();
				
				ANAMNESI_PRE_NEONATALE.checkParto_I();
				ANAMNESI_PRE_NEONATALE.checkParto_II();
				ANAMNESI_PRE_NEONATALE.checkPresentazione();
				ANAMNESI_PRE_NEONATALE.checkGravidanza();
				
				PLS_UTILITY.showPercentile( home.ASSISTITO.DATA_NASCITA_ISO );

				var iden = $("#hIden").val();
				
				if (iden != '') {
				
					$("#IDEN").val(iden);
					$("#txtAltezza, #txtPeso, #txtCirconferenza_Cranica").keyup();
				
				} else {
					
					$("#hIden").remove();
					
					/**************Carico alcuni campi con le ultime rilevazioni effettuate per quel paziente**************/
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
					});
				}
			},
			
			setEvents:function(){
				
				PLS_UTILITY.showPercentile();
				
				$("#radParto_I").on("click", ANAMNESI_PRE_NEONATALE.checkParto_I );
				$("#radParto_II").on("click", ANAMNESI_PRE_NEONATALE.checkParto_II );
				$("#radPresentazione").on("click", ANAMNESI_PRE_NEONATALE.checkPresentazione );
				$("#radGravidanza").on("click", ANAMNESI_PRE_NEONATALE.checkGravidanza );
				
				$(".butInserisciRilevazioni").on("click", function(){
					home.NS_MMG.apri('INSERIMENTO_RILEVAZIONI_PLS');
				});
			},
			
			beforeSave:function(){
				
				if($("#txtPesoDimissione").val() != '' && $("#h-txtDataDimissione").val() == ''){
					
					home.NOTIFICA.warning({
						title: traduzione.lblAttenzione,
						message: traduzione.lblDataNonCompilata,
						timeout: "15"
					});
					return false;
					
				/*parte commentata, nel caso si volesse controllare il fatto che la data della dimissione risulta compilata mentre il peso alla dimissione è vuoto
				
				}else if($("#h-txtDataDimissione").val() != '' && $("#txtPesoDimissione").val() == ''){
					
					home.NOTIFICA.warning({
						title: traduzione.lblAttenzione,
						message: traduzione.lblPesoNonCompilato,
						timeout: "15"
					});
					return false;
					
				*/	
				}else{
					
					return true;
				};
			},
			
			checkParto_I: function() { 
				if (radParto_I.val()=='P1_II') {
					$("#lblGemelli, #txtGemelli").show();
				} else {
					$("#lblGemelli, #txtGemelli").hide();
				}
			},
			
			checkParto_II: function() {
				if (radParto_II.val()=='P2_II') {
					$("#radParto_III").show();
				} else {
					$("#radParto_III").hide();
				}
			},
			
			checkPresentazione: function() {
				if (radPresentazione.val()=='PRES_3') {
					$("#txtDettPresentazione").show();
				} else {
					$("#txtDettPresentazione").hide();
				}
			},
			
			checkGravidanza: function() {
				if (radGravidanza.val()=='G2') {
					$("#txtDettGravidanza").show();
				} else {
					$("#txtDettGravidanza").hide();
				}
			},
			
			successSave: function(resp){
				
				home.FILTRI_DIARI_WK.objWk.refresh();
				NS_FENIX_SCHEDA.chiudi();
				return true;
			},
			
			getValori: function(val){
				var ritorno = {};
				
				ritorno.PIDENANAG = $("#IDEN_ANAG").val();
				ritorno.PIDENSCHEDA = val;
				
				ritorno.PIDENACCESSO = home.ASSISTITO.IDEN_ACCESSO;
				ritorno.PIDENPROBLEMA = home.ASSISTITO.IDEN_PROBLEMA;
				
				ritorno.PIDENMED = home.baseUser.IDEN_PER;
				ritorno.PUTENTE = home.baseUser.IDEN_PER;
				
				ritorno.P_DATA = DATE.format({date:$("#txtData").val(),format:"DD/MM/YYYY",format_out:"YYYYMMDD"});
				ritorno.P_NOTEDIARIO = "Anamnesi";
				ritorno.P_TIPO = 'ANAMNESI';
				
				return ritorno;
			}
};