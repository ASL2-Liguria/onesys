$(document).ready(function(){
	
	NUOVO_ACCESSO.init();
	NUOVO_ACCESSO.setEvents();
//	NS_FENIX_SCHEDA.beforeSave 	= NUOVO_ACCESSO.beforeSave;
//	NS_FENIX_SCHEDA.afterSave 	= NUOVO_ACCESSO.afterSave;
	NS_FENIX_SCHEDA.successSave = NUOVO_ACCESSO.successSave;
	
});


var NUOVO_ACCESSO={
		
	init:function(){
		
		NUOVO_ACCESSO.setRadio();
		
		//$("#fldAccesso").find(".tdTextarea").attr("colspan",3);

		$("#li-tabFumoAlcol").hide();
		$("#li-tabBMI").hide();
		
		$("#txtIndirizzoAccesso").closest("tr").hide();
		$("#txtOperatoreAccesso").closest("tr").hide();
		$("#fldAccesso .tdRadio").attr("colSpan","2");
		
		$("#txtBMI").attr("readonly","readonly").addClass("readonly");
		
		if(LIB.isValid($("#IDEN").val())){
			
			$("#li-tabProblema").hide();
			//$("#li-tabFumoAlcol").hide(); //--->tolti su indicazione del Dr Fusetti
			//$("#li-tabBMI").hide();		//--->tolti su indicazione del Dr Fusetti
			$(".butSalva").hide();
			
		}else{
			
			$(".butSalvaModifiche").hide();
			
			home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'SDJ.Q_INDIRIZZO_PAZIENTE',
	            parameter:
	            {
	            	iden_anag		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'}
	            }
			}).done( function(resp) {
				$("#txtIndirizzoAccesso").val(resp.result[0].INDIRIZZO);
			} );
		}
		
		if($("#h-radAccesso").val() == 'DOM_ADI'){
			$("#txtIndirizzoAccesso").closest("tr").show();
			$("#txtOperatoreAccesso").closest("tr").show();
		}
		
		if($("#h-radAccesso").val() == 'DOM_ADP' || $("#h-radAccesso").val() == 'RP'){
			$("#txtIndirizzoAccesso").closest("tr").show();
		}
	},
	
	beforeSave: function()
	{
		if($("#txtProblema").val()=="" && $("#h-CodProblema").val()==""){
		
	        home.NOTIFICA.warning({
	            message: "Specificare il campo Problema",
	            title: "Attenzione"
	        });
			
	        return false;
		}
		else
			return true;
	},
	
	setEvents:function(){
		
		$("#txtAltezza").blur(function(){
			if($(this).val() != ''){
				
				if(	!$.isNumeric($(this).val())){
					$(this).val("");
					$(this).focus();
					return alert( traduzione.valoreNonNumerico );
				}
				
				if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
					var BMI = home.NS_MMG_UTILITY.calcoloBMI( $(this).val(), $("#txtPeso").val() );
					$("#txtBMI").val(BMI);
				}
			}
		});
		
		$("#txtPeso").blur(function(){
			if($(this).val() != ''){
				
				if(	!$.isNumeric($(this).val())){
					$(this).val("");
					$(this).focus();
					return alert( traduzione.valoreNonNumerico );
				}
				
				if($("#txtAltezza").val() != '' && $("#txtPeso").val() != ''){
					var BMI = home.NS_MMG_UTILITY.calcoloBMI($("#txtAltezza").val(), $(this).val());
					$("#txtBMI").val(BMI);
				}
			}
		});
		
		$("#txtCirconfernza").blur(function(){
			if($(this).val() != ''){
				
				if(	!$.isNumeric($(this).val())){
					$(this).val("");
					$(this).focus();
					return alert( traduzione.valoreNonNumerico );
				}
			}
		});
	
		$("#txtAttFisica").blur(function(){
			if($(this).val() != ''){
				$(this).val($(this).val().toUpperCase());
			}
		});
		
		$("#radAccesso").on("change",function(){
			
			if($("#h-radAccesso").val() == 'DOM_ADI'){
				$("#txtIndirizzoAccesso").closest("tr").show();
				$("#txtOperatoreAccesso").closest("tr").show();
				
			}else if($("#h-radAccesso").val() == 'DOM_ADP'){
				$("#txtIndirizzoAccesso").closest("tr").show();
				$("#txtOperatoreAccesso").closest("tr").hide();
				
			}else if($("#h-radAccesso").val() == 'RP'){
				$("#txtIndirizzoAccesso").closest("tr").show();
				$("#txtOperatoreAccesso").closest("tr").hide();
				
			}else{
				$("#txtIndirizzoAccesso").closest("tr").hide();
				$("#txtOperatoreAccesso").closest("tr").hide();
			}
		});
		
		$(".butSalvaModifiche").on("click", function(){
			
			toolKitDB.executeProcedureDatasource('MODIFICA_NUOVO_ACCESSO', 'MMG_DATI', NUOVO_ACCESSO.getValori(), function() {
				home.WK_CRONOLOGIA_ACCESSI.objWk.refresh();
				NS_FENIX_SCHEDA.chiudi();
			});
			
		});
	},
	
	getValori: function(){
		
		var modifiche = {};

		modifiche.p_data 			= $("#h-txtDataAccesso").val();
		modifiche.p_rad_accesso 	= $("input[name=radAccesso]").val();
		modifiche.p_rad_regime 		= $("input[name=Regime]").val();
		modifiche.p_note 			= $("#txtAreaNote").val();
		modifiche.p_iden_riga 		= $("#IDEN").val();
		modifiche.p_indir_accesso 	= $("#txtIndirizzoAccesso").val();
		modifiche.p_oper_accesso	= $("#txtOperatoreAccesso").val();
		//alert(JSON.stringify(modifiche));
		
		return modifiche;
	},
	
	setRadio:function(){
	
//		if ($("#STATO_PAGINA").val() != 'M'){
		if(!LIB.isValid($("#IDEN").val())){
			
			if($("#NUOVA_ANAGRAFICA").val() == 'S'){
				
				$("input[name=Regime]").val("LP");
				$("#Regime_LP").addClass("RBpulsSel");
			}else{
				
				$("input[name=Regime]").val("SSN");
			}
		}
	},
	
	afterSave: function() {
		
	},
	
	successSave: function(resp){
					
		var v_split = resp.split("#");

		home.ASSISTITO.IDEN_ACCESSO  	= 	v_split[0];
		home.ASSISTITO.DATA_ACCESSO 	=  	v_split[1];
		home.CARTELLA.REGIME 			=	$("input[name=Regime]").val() != 'LP' ? 'SSN' : $("input[name=Regime]").val();
		home.ASSISTITO.TIPO_ACCESSO		=	$("input[name=radAccesso]").val();
		//decommentare la parte se si ha intenzione di settare il problema dopo averlo inserito dalla pagina dell'accesso
		/*
		home.ASSISTITO.IDEN_PROBLEMA 	= 	v_split[2]; 
		
		alert("v_split[0]: " + v_split[0])
		alert("v_split[1]: " + v_split[1])
		alert("v_split[2]: " + v_split[2])
		alert("v_split[3]: " + v_split[3])

		if(v_split[2] != ""){//-->vanno in errore le due wk in basso: i diari e gli accertamenti
			home.MAIN_PAGE.setPatientProblem(v_split[2],v_split[3]);
		}
		*/
		
		if (LIB.isValid(home.RIEP_ACCESSI_PROBLEMI)){
			home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
		}
		
		NS_FENIX_SCHEDA.chiudi();
		return true;
	}
};

var AC = {

	select:function(riga){

			$("#CodProblema").val(riga.VALUE);
			$("#DescrProblema").val(riga.DESCR);
			$("#h-CodProblema").val(riga.VALUE);
			$("#h-DescrProblema").val(riga.DESCR);

	}
};