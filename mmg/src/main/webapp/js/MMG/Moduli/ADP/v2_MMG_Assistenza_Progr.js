$(document).ready(function(){
	
	ASSISTENZA_PROGRAMMATA.init();
	ASSISTENZA_PROGRAMMATA.setEvents();
	NS_FENIX_SCHEDA.successSave = ASSISTENZA_PROGRAMMATA.successSave;
});

var ASSISTENZA_PROGRAMMATA = {
		
			daStampare:false,
		
			init:function(){
				
				$(".butSalva").removeClass("butVerde");
				$(".butSalvaStampa").addClass("butVerde");
				
				ASSISTENZA_PROGRAMMATA.setLayout();
			},
			
			setEvents:function(){
				
				$(".butSalvaStampa").on("click", function(){
					ASSISTENZA_PROGRAMMATA.salvaStampa();
				});
				
				$(".butStampa").on("click", function(){
					ASSISTENZA_PROGRAMMATA.stampa();
				});
				
				$("#butInserisciAnamnesi").on("click",function(){
					ASSISTENZA_PROGRAMMATA.inserisciValore($("#txtAnamnesi"), $("#cmbProblemiPaziente").val());
				});
				
				$("#butInserisciDiagnosi").on("click",function(){
					ASSISTENZA_PROGRAMMATA.inserisciValore($("#txtDiagnosiAttuale"), $("#cmbDiagnosiPaziente").val());
				});
				
				$("#butInserisciTerapia").on("click",function(){
					ASSISTENZA_PROGRAMMATA.inserisciValore($("#txtTerapia"), $("#cmbTerapiaPaziente").val());
				});
				
				$("#chkDiagnosi3").on("click", function(){
					
					if($("#chkDiagnosi3").data("CheckBox").val()== ''){
						$("#fldSpec").hide();
					}else{
						$("#fldSpec").show();
					}
				});
			},
			
			successSave: function(resp){
				
				var iden = resp;
				
				ASSISTENZA_PROGRAMMATA.insertPromemoria(iden);
				
				if(ASSISTENZA_PROGRAMMATA.daStampare){
					ASSISTENZA_PROGRAMMATA.stampa(iden);
					ASSISTENZA_PROGRAMMATA.chiudiScheda();
				}
			},
			
			errorSave:function(){
				
				NOTIFICA.error({
					message:traduzione.lblErrore,
					title: traduzione.lblTitoloErrore
				});
			},
			
			chiudiScheda:function(){
				
				NS_FENIX_SCHEDA.chiudi();
			},
			
			//funzione che inserisce dal combo alle textarea corrispondenti
			inserisciValore:function(target, valore){

				previousVal = (target.val() != '') ? (target.val() + '\n')  : target.val() ;
				
				target.val(previousVal + $.trim(valore));				
			},
			
			insertPromemoria:function(pIden){
				
				var obj = { 
				 	iden_anag : home.ASSISTITO.IDEN_ANAG,
				 	text : traduzione.lblMsgPromemoria + moment($("#h-txtDataScadenza"), 'YYYYMMDD').add(12, 'months').format('DD/MM/YYYY'),
				 	note : traduzione.lblMsgAutomatico,
				 	data_inizio : moment().subtract(1, 'months').format('YYYYMMDD'),
				 	data_fine : moment($("#h-txtDataScadenza").val(), 'YYYYMMDD').add(12, 'months').format('YYYYMMDD'),
				 	priorita : '3',
				 	iden_riferimento : pIden,
				 	tabella_riferimento : 'MMG_SCHEDE_XML'
				 }

				NS_MMG_UTILITY.insertPromemoria(obj);
			},
			
			salvaStampa: function(){
				
				ASSISTENZA_PROGRAMMATA.daStampare = true;
				$(".butSalva").trigger("click");
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				var prompts = {pIdModulo:vIden, pIdenPer:home.baseUser.IDEN_PER };
				
				home.NS_PRINT.print({
					path_report: "MODULO_ASSISTENZA_PROGRAMMATA_V2.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			},
			
			setLayout:function(){
				
				$("#txtAnamnesi").parent().attr("colSpan","4");
				$("#txtDiagnosiAttuale").parent().attr("colSpan","4");
				$("#txtTerapia").parent().attr("colSpan","4");
				
				if($("#chkDiagnosi3").data("CheckBox").val()== ''){
					$("#fldSpec").hide();
				}else{
					$("#fldSpec").show();
				}
			}
};
