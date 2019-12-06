$(document).ready(function(){
	INSERIMENTO_MEDICO.init();
	INSERIMENTO_MEDICO.setEvents();

});

var INSERIMENTO_MEDICO = {

	init:function(){
		
		if($(".RadioBox").find(".RBpuls").length == 0){
			$(".tdRadio").hide();
		}else{
			$(".tdRadio").show();
		}

		INSERIMENTO_MEDICO.check();
	},
	
	setEvents:function(){
		
		$(".butChiudi").on("click",function(){
			if(typeof $("#PROVENIENZA") != 'undefined' && $("#PROVENIENZA").val() == 'RIEPILOGO'){
				parent.RIEPILOGO.setSrc($("#IDX").val());
			}else{
				try{
					//TODO:funzione che setta il medico nella label sovrastante
				}catch(e){
					
				}
			}
			home.NS_MMG.chiudiAttesa();
		});
		
		$(".butPulisci").on("click", function(){
			INSERIMENTO_MEDICO.deleteListaMedici();
		});
		
		$(".butSalvataggio").on("click",function(){
			INSERIMENTO_MEDICO.registra();
		});
	},
	
	check:function(){
		if($(".RBpuls").length<1){
			var divNoMed = $("<div></div>");
			divNoMed.attr("id", "divNoMed").addClass("tdLbl");
			$("#lblListaMedici").append(divNoMed);
			$("#lblListaMedici").hide();
		}
	},
	
	deleteListaMedici:function(){
		
		var param = {
				'PUTENTE' : home.baseUser.IDEN_PER
		};
		
		toolKitDB.executeProcedureDatasource("DELETE_LISTA_MEDICI",'MMG_DATI',param,function(response){
			INSERIMENTO_MEDICO.deletePuls();
			INSERIMENTO_MEDICO.check();
		});
		
	},
	
	deletePuls:function(){
		
		$(".RBpuls").remove();
		
	},
	
	setLabelMedico:function(iden_medico, medico){
		
		home.CARTELLA.IDEN_MEDICO_PRESCRITTORE_ESTERNO 	= iden_medico;
		home.CARTELLA.DESCR_MEDICO_PRESCRITTORE_ESTERNO	= medico;
		home.MAIN_PAGE.setPrescriber( iden_medico, medico);

	},
	
	registra:function(){
		
		var medico = $("#Medico").val();
		var iden_medico = $("#h-Medico").val();
		var utente = home.baseUser.IDEN_PER; 
		var param = '';

		if(iden_medico == ''){
			
			var k = $(".RBpuls");
			
			k.each(function(){
				if($(this).hasClass("RBpulsSel")){
					
					param = {  
							"pIdenMed"		:$(this).attr("data-value"),
							"pMedico"		:$(this).attr("title"),
							"pUtente"		:utente
					};
					
					//alert(param.pIdenMed +'\n'+ param.pMedico+'\n'+ param.pUtente);
					toolKitDB.executeFunctionDatasource("SET_ORDER_MEDICI_SELEZIONATI", "MMG_DATI", param, function(response){registraCallBack(response);} );
				}
			});
			
		}else{
			
			param = {  
					"pIdenMed"		:iden_medico,
					"pMedico"		:medico,
					"pUtente"		:utente
			};
			
			//alert(param.pIdenMed +'\n'+ param.pMedico+'\n'+ param.pUtente);
			toolKitDB.executeFunctionDatasource("SAVE_MEDICI_SELEZIONATI", "MMG_DATI", param, function(response){registraCallBack(response);} );
		}
		
		function registraCallBack(response){

			$.each(response,function(k,v){
				//alert(k + ' ' + v);
				if(v == 'OK'){
					INSERIMENTO_MEDICO.setLabelMedico(param.pIdenMed, param.pMedico);
					home.$("#lblMedPrescrittore").removeClass("evidenzia");
					home.NS_FENIX_TOP.chiudiUltima();
				}else{
					alert(traduzione.salvataggioNonRiuscito);
				}
			});
		}
	}
};
