$(function(){
	MODULO_DISPOSITIVI_DIABETE.init();
	MODULO_DISPOSITIVI_DIABETE.setEvents();
	MODULO_DISPOSITIVI_DIABETE.checkPrivacy();
	NS_FENIX_SCHEDA.successSave = MODULO_DISPOSITIVI_DIABETE.successSave;
	NS_FENIX_SCHEDA.beforeSave 	= MODULO_DISPOSITIVI_DIABETE.beforeSave;
});

var MODULO_DISPOSITIVI_DIABETE = {
		
			daStampare : false,
			
			init:function(){
				
				$("#radStrisce, #lblStrisce").parents().attr("colSpan","4");
				$("#txtMax12Mesi1, #txtMax12Mesi2").parents().attr("colSpan","7");
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				$("#fldTabella2").hide();
				$("#txtData").val(moment().format("DD/MM/YYYY"));
				$("#h-txtData").val(moment().format("YYYYMMDD"));
				
				MODULO_DISPOSITIVI_DIABETE.checkValRadio();				
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", MODULO_DISPOSITIVI_DIABETE.salvaStampa );
				$("#radStrisce").on("click", MODULO_DISPOSITIVI_DIABETE.checkValRadio );
				
				$(".center").keyup(function(){
					if($(this).val() != ''){
						
						if(MODULO_DISPOSITIVI_DIABETE.checkNumero($(this).val()) == false){
							$(this).val("");
							$(this).focus();
							return;
						};
					}
				});
				
				$(".mesi").keyup(function(){
					if($(this).val() != ''){
						
						if(MODULO_DISPOSITIVI_DIABETE.checkNumero($(this).val()) == false){
							$(this).val("");
							$(this).focus();
							return;
						};
						
						if($(this).val() < 1 || $(this).val() > 12){
							
							$(this).val("");
							$(this).focus();
							home.NOTIFICA.warning({
					            message		:'Il valore inserito non \u00E8 valido. Inserire un valore tra 1 e 12',
					            title		:"Attenzione",
					            timeot		:6
					        });
							return;
						}
					}
				});
			},

			checkPrivacy:function(){
				
				NS_MMG_UTILITY.checkPermessoSpecialista([]);
			},
			
			checkValRadio: function() { 
				if (radStrisce.val() == 'STR4') {
					$("#txtDettGlucometro").closest("tr").show();
					$("#txtDettRischio").closest("tr").show();
					
				} else {
					$("#txtDettGlucometro").closest("tr").hide();
					$("#txtDettRischio").closest("tr").hide();
				}
			},
			
			checkNumero: function(val){
				
				if(	!$.isNumeric(val) ){
					home.NOTIFICA.warning({
			            message		:'Il valore inserito non \u00E8 numerico!',
			            title		:"Attenzione",
			            timeot		:6
			        });
					return false;
				}else{
					return true;
				}
				
			},
			
			/*inserisciProblema: function() {
				if($("#cmbProblemiPaziente").val() != ''){
					MODULO_RSA.riempiAnamnesi();
				}
				
			},
			
			riempiAnamnesi: function() {
				
				if($("#txtAffezioni").val() == ''){
					$("#txtAffezioni").val($("#cmbProblemiPaziente").val());
					
				} else{
					$("#txtAffezioni").val($("#txtAffezioni").val() + ', ' + $("#cmbProblemiPaziente").val());
				}
				$("#cmbProblemiPaziente").val("");
			},
			*/
			beforeSave: function() {

				var label = traduzione.lblDialogDataDiff1 + ' (' + $("#txtData").val() + ')</br> ' +
							traduzione.lblDialogDataDiff2 + ' (' + moment().format('DD/MM/YYYY') + ')</br> ' +
							traduzione.lblDialogDataDiff3 ;
				
				var div = $("<div/>");
				div.attr("id","divDialog");
				div.css("text-align","center");
				
				if($("#h-txtData").val() != moment().format('YYYYMMDD')){
					return confirm("La data di compilazione all'interno del modulo (17/09/2015)\nnon corrisponde alla data odierna  (17/09/2015)\nProseguire ugualmente con il salvataggio?");
				/*
					$.dialog(div.append(label), {			
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'buttons'			: [ 
         			   	{
							"label"  			: "Ok",
							'classe'			: "butVerde",
							"action" 			:  function() {
								ret = true
								$.dialog.hide();
							}
						},{
							"label"  			: "Annulla",

							"keycode"			: "27",
							"action"			: function(){
								ret = false; 
								$.dialog.hide;
							}
						} ],
						'title' 				: "Inserisci risultato",
						'width' 				: 600,
						'height'				: 150
					});
				}*/
				} else {
					return true;
				}
			},
			
			beforeClose: function() 
			{
				
			},
			
			successSave: function(pIden) 
			{
				if ( MODULO_DISPOSITIVI_DIABETE.daStampare ) 
				{
					MODULO_DISPOSITIVI_DIABETE.stampa(pIden);
				}
				NS_FENIX_SCHEDA.chiudi();
			},
			
			salvaStampa: function()
			{
				MODULO_DISPOSITIVI_DIABETE.daStampare = true;
				
				NS_FENIX_SCHEDA.registra();
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
				
				home.NS_PRINT.print({
					path_report: "MODULO_DISPOSITIVI_DIABETE.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};
