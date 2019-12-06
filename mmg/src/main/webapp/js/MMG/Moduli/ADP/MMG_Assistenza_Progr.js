$(document).ready(function(){
	ASSISTENZA_PROGRAMMATA.init();
	ASSISTENZA_PROGRAMMATA.setEvents();
	NS_FENIX_SCHEDA.afterSave = ASSISTENZA_PROGRAMMATA.afterSave;

});

var vSalvaStampa = 'N';

var ASSISTENZA_PROGRAMMATA = {
		
			init:function(){
				
				CheckCarica = $("#txtValoreTotale").val();
				
				$("#txtAltro").hide();
				$("#txtImp_Log").hide();
				$("#txtValoreTotale").attr("disabled","disabled");
				
				if(CheckCarica != ""){ 
					
					$("#txtAltro").show();
					$("#txtImp_Log").show();
				}
				
				$(".butSalva").removeClass("butVerde");
				$(".butStampa").addClass("butVerde");
				
			},
			
			setEvents:function(){
				
				$(".butStampa").on("click", function(){
					
					ASSISTENZA_PROGRAMMATA.salvaStampa();
				});
				
				/****************************************/
				
				$("#chkDiagnosi9_D9").click(function(){
				    $("#txtAltro").toggle();
				    /*$("#txtAltro").val("");*/
				  });
				
				$("#chkDiagnosi10_D10").click(function(){
				    $("#txtImp_Log").toggle();
				    /*$("#txtImp_Log").val("");*/
				  });
				/****************************************/
				
				$("#fld2 select").on("change",function(){
					ASSISTENZA_PROGRAMMATA.calcola_totale();
				});
			},
			
			afterSave: function(resp){
				var iden = resp;
				if(vSalvaStampa == 'S'){
					ASSISTENZA_PROGRAMMATA.stampa(iden);
					//ASSISTENZA_PROGRAMMATA.chiudiScheda();
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
//				home.NS_FENIX_TOP.chiudiUltima();
			},
			
			salvaStampa: function(){
				
				vSalvaStampa = 'S';
				$(".butSalva").trigger("click");
			},
			
			stampa: function(pIden){
				
				var vIden = typeof pIden != 'undefined' ? pIden : $("#IDEN").val();
				
				var prompts = {pIdModulo:vIden, pIdenPer:home.baseUser.IDEN_PER };
				
				//alert(JSON.stringify(prompts));
				
				home.NS_PRINT.print({
					path_report: "MODULO_ASSISTENZA_PROGRAMMATA.RPT",
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			},
			
			calcola_totale:function(){
				  cmb1val = $("#Coerenza").val() == "" || $("#Coerenza").val() == "3" ? 0 : $("#Coerenza").val();
				  cmb1 = parseInt(cmb1val);
				  cmb2val = $("#Orientamento").val() == "" || $("#Orientamento").val() == "3" ? 0 : $("#Orientamento").val();
				  cmb2 = parseInt(cmb2val);
				  cmb3val = $("#Inserimento_Soc").val() == "" || $("#Inserimento_Soc").val() == "3" ? 0 : $("#Inserimento_Soc").val();
				  cmb3 = parseInt(cmb3val);
				  cmb4val = $("#Vista").val() == "" || $("#Vista").val() == "3" ? 0 : $("#Vista").val();
				  cmb4 = parseInt(cmb4val); 
				  cmb5val = $("#Udito").val() == "" || $("#Udito").val() == "3" ? 0 : $("#Udito").val();
				  cmb5 = parseInt(cmb5val);
				  cmb6val = $("#Parola").val() == "" || $("#Parola").val() == "3" ? 0 : $("#Parola").val();
				  cmb6 = parseInt(cmb6val);
				  cmb7val = $("#Igiene").val() == "" || $("#Igiene").val() == "3" ? 0 : $("#Igiene").val();
				  cmb7 = parseInt(cmb7val);
				  cmb8val = $("#Mob_Interna").val() == "" || $("#Mob_Interna").val() == "3" ? 0 : $("#Mob_Interna").val();
				  cmb8 = parseInt(cmb8val);
				  cmb9val = $("#Aiuto_Deamb").val() == "" || $("#Aiuto_Deamb").val() == "3" ? 0 : $("#Aiuto_Deamb").val();
				  cmb9 = parseInt(cmb9val);
				  cmb10val = $("#Abbigliamento").val() == "" || $("#Abbigliamento").val() == "3" ? 0 : $("#Abbigliamento").val();
				  cmb10 = parseInt(cmb10val);
				  cmb11val = $("#Tipo_Alim").val() == "" || $("#Tipo_Alim").val() == "3" ? 0 : $("#Tipo_Alim").val();
				  cmb11 = parseInt(cmb11val);	  
				  cmb12val = $("#Aiuto_Alim").val() == "" || $("#Aiuto_Alim").val() == "3" ? 0 : $("#Aiuto_Alim").val();
				  cmb12 = parseInt(cmb12val);  
				  cmb13val = $("#Continenza").val() == "" || $("#Continenza").val() == "3" ? 0 : $("#Continenza").val();
				  cmb13 = parseInt(cmb13val);
				  cmb14val = $("#Mob_dal_Letto").val() == "" || $("#Mob_dal_Letto").val() == "3" ? 0 : $("#Mob_dal_Letto").val();
				  cmb14 = parseInt(cmb14val);
				  cmb15val = $("#Igiene_Posto_Letto").val() == "" || $("#Igiene_Posto_Letto").val() == "3" ? 0 : $("#Igiene_Posto_Letto").val();
				  cmb15 = parseInt(cmb15val);
				  var somma = cmb1 + cmb2 + cmb3 + cmb4 + cmb5 + cmb6 + cmb7 + cmb8 + cmb9 + cmb10 + cmb11 + cmb12 + cmb13 + cmb14 + cmb15;
				  $("#txtValoreTotale").val(somma);				
			},
			
};
