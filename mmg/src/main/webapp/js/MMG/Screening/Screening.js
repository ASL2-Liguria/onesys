$(document).ready(function()
{

	SCREENING.init();
	SCREENING.setEvents();
	NS_FENIX_SCHEDA.beforeSave = SCREENING.beforeSave;
	
});

var SCREENING = {

		init: function()
		{
			home.SCREENING = this;
			$(".butSalva").hide();
			SCREENING.initWk();
		},
		
		setEvents: function()
		{
			
			$("#butInserisci").on("click",function(){
				SCREENING.inserisciScreening();
			});
			
			$("#li-tabLista").on("click",function(){
				SCREENING.initWk();
			});
			
			$("#radSceltaScreening").on("change",function(){
				
				var val_rad = $("#h-radSceltaScreening").val();
				$("#txtTipoScreening").val(val_rad);
			});
		},

		beforeSave:function(){
			home.MMG_CHECK.isDead();
		},
		
		inserisciScreening: function(){
			
			var param = {
				'p_Iden_Anag' 			: $("#IDEN_ANAG").val(),
//				'p_Ute_Ins' 			: home.baseUser.IDEN_PER,
				'p_Ute_Ins' 			: $("#UTE_INS").val(),
				'p_Iden_Med_Prescr' 	: $("#IDEN_MED_PRESCR").val(),
				'p_Data_Screening' 		: $("#h-txtDataScreening").val(),
				'p_Tipo_Screening' 		: $("#txtTipoScreening").val(),
				'p_Esito_Screening' 	: $("#txtEsitoScreening").val(),
			};

			toolKitDB.executeFunctionDatasource("SAVE_MMG_SCREENING","MMG_DATI",param,function(resp){
				var r = resp['p_result'];
				if(r.substr(0,2) == 'OK'){
					
					NOTIFICA.success({
						message:traduzione.successSave,
						title: traduzione.successTitleSave
					});
					
					$("#txtDataScreening").val("");
					$("#txtTipoScreening").val("");
					$("#txtEsitoScreening").val("");
					$("#radSceltaScreening").data('RadioBox').empty();
					SCREENING.initWk();
					
				}
			});
		},
		
		initWk: function(){
        	
			var h = $('.contentTabs').innerHeight() - 60;
			$("#wkScreening").height(h);
			
			var params = {
                "id"    	: 'SCREENING',
                "container" : "wkScreening",
                "aBind" 	: ["ute_ins","iden_anag"],
                "aVal"  	: [home.baseUser.IDEN_PER.toString(),$("#IDEN_ANAG").val()]
            };

            /*this.wk = new WK(params);
            this.wk.loadWk();*/
            
            var objWk = new WK(params);
			objWk.loadWk();
		},
		
		cancellaScreening: function(riga){
			if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].IDEN_MED)) {
				home.NS_MMG.confirm("Vuoi veramente cancellare lo screening selezionato?", function(){
					toolKitDB.executeProcedureDatasource('SP_CANCELLA_SCREENING', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){
						SCREENING.initWk();
					});
				});
			}
		}
		
};
