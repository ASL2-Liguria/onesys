$(document).ready(function(){
	ATTRIBUTI.init();
	ATTRIBUTI.setEvents();
	CRONO_RR_FARMACI.init();
	CRONO_RR_FARMACI.setEvents();
	CRONO_RR_ACCERTAMENTI.init();
	CRONO_RR_ACCERTAMENTI.setEvents();
	NS_FENIX_SCHEDA.afterSave		= ATTRIBUTI.afterSave; 

});

var ATTRIBUTI = {
	
	tipo: null,
	nsRicetta: null,
	
	init:function(){
		ATTRIBUTI.setLayout();
		ATTRIBUTI.setTitle();
		
		switch( $("#KEY_LEGAME").val() ) {
		case "CRONO_RR_FARMACI" :
			this.tipo = "FARMACI";
			this.nsRicetta = home.RICETTA_FARMACI;
			break;
		default:
			this.tipo = "ACCERTAMENTI";
			this.nsRicetta = home.RICETTA_ACCERTAMENTI;
		}
	},
	
	setEvents:function(){
		
		$(".butRimuovi").on("click",function(){
			ATTRIBUTI.removeAttributes();
		});
		
		//controllo sul campo numerico
		$("#txtggPeriodo").on("blur",function(){
			if(!home.NS_MMG_UTILITY.checkIsNumber($("#txtggPeriodo").val())){
				$(this).val("").focus();
				return alert("Inserire solo valori numerici");
			}
		});
	},
	
	setTitle:function(){
		
		if ($("#OBJ").length>0) {
			var titolo = $("#lblTitolo").html().toString();
			
			titolo += ' - ';
			titolo += $("#OBJ").val();
			
			$("#lblTitolo").html(titolo);
		}
	},
	
	removeAttributes:function(){
		
		switch($("#CASE").val()){
		
			case 'PT':
				mex='Proseguendo le informazioni del PT verranno rimosse. Continuare?';
				break;
				
			case 'PERIODICA':
				mex = 'Proseguendo la periodicit&agrave; verr&agrave; rimossa. Continuare?';
				break;
				
			default:
				mex = 'Proseguendo la temporaneit&agrave; verr&agrave; rimossa. Continuare?';
		}
		
		if(!confirm(mex)){
			return;
		}
		
		var param = {
				
				'pIden' 			: $("#IDEN").val(),
				'pUtente' 			: home.baseUser.IDEN_PER,
				'pTipo'				: this.tipo,
				'pTemporaneita'		: "N",
				'pPeriodicita'		: "N",
				'pPt'				: "N"
		};

		toolKitDB.executeProcedureDatasourceOut("SP_REMOVE_ATTRIBUTES","MMG_DATI",param,{'pOut': 'pOut'}, function(response){
			ATTRIBUTI.nsRicetta.reload();
			NS_FENIX_SCHEDA.chiudi();
		});
	},
	
	/*setDate:function(){
		
		var data1 = $("#DATA_INIZIO").val();
		var data2 = $("#DATA_FINE").val();

		var dataInizio = data1.substr(6,2) + '/';
		dataInizio += data1.substr(4,2) + '/';
		dataInizio += data1.substr(0,4);
		
		var dataFine = data2.substr(6,2) + '/';
		dataFine += data2.substr(4,2) + '/';
		dataFine += data2.substr(0,4);
		
		if(data1 != ''){
			$("#txtDaData").val(dataInizio);
			$("#h-txtDaData").val(data1);
		}
		
		if(data2 != ''){
			$("#txtAData").val(dataFine);
			$("#h-txtAData").val(data2);
		}
	},*/
	
	
	setLayout:function(){
		
		if($("#CASE").val()=='PERIODICA'){
			
			$("#fldTemporanea").hide();
			$("#fldNote").hide();
		
		}else if($("#CASE").val()=='PT'){
			
			$("#fldPeriodica").hide();
			$("#fldNote").hide();
			$("#lblBlocco").parent().hide();
			radPT.selectByValue("PT");
		
		}else if($("#CASE").val()=='NOTA'){	
			
			$("#fldTemporanea").hide();
			$("#fldPeriodica").hide();
			
		}else{
			
			$("#fldPeriodica").hide();
			$("#radPT_PT").parent().hide();
		}
	},
	
	afterSave: function(){
		
		ATTRIBUTI.nsRicetta.reload();
		NS_FENIX_SCHEDA.chiudi();
	}
};

var CRONO_RR_FARMACI = {

	init:function(){
		$("#hTipoPeriodo").val($("#CASE").val());
	},
	
	setEvents:function(){
	
	}
};

var CRONO_RR_ACCERTAMENTI = {

	init:function(){
		$("#hTipoPeriodo").val($("#CASE").val());
		$("#txtNotePrescrizione").height(400);
	},
	
	setEvents:function(){
	
	}
};

var AC = {

	select:function(){
	
	}
};
