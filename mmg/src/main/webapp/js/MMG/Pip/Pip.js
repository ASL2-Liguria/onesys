$(document).ready(function()
{
	NS_PIP.init();
	NS_FENIX_SCHEDA.afterSave	  = NS_PIP.afterSave; 
});

var NS_PIP={
		
		init:function(){
			
			$("#radVaccino,#excClasseRischio").hide();
			$("#ComboIn, #ComboOut").width(280);
			
			if (!home.MMG_CHECK.isPediatra()){
				$("#txtPip_PLS").closest("tr").hide();
			}else{
				$("#txtPip").closest("tr").hide();
			}
			
			$("#txtPip").attr("placeholder",traduzione.phPPIP);
			
			WK_PIP.init();
		},
		
		scelta:function(valore){

			//PRIMA IL CODICE ERA IL 16... POI SIAMO PASSATI ALL'IDEN CHE e' IL 22... GESTIONE SBAGLIATISSIMA!!!! DA RIMEDIARE AL PIU0 PRESTO POSSIBILE
			if(valore == "16" && !home.MMG_CHECK.isPediatra()){
				$("#ComboOut").empty();
				//CONTROLLA ETA'
				if(parseInt(home.ASSISTITO.ETA) >=65){
					elem = $("#ComboIn option").each(function(){
						if(this.value == "2108"){
							$("#ComboOut").append(NS_MMG_UTILITY.createOption(this.value,this.text));
						}
					});
				}
				//CONTROLLA ESENZIONI PAZIENTE
				var par = {"iden_anag" : $("#IDEN_ANAG").val().toString(),"codice_esenzione":"013"};

				toolKitDB.getResultDatasource("MMG_DATI.ESENZIONI","MMG_DATI",par,null,function(resp){
					
					$.each(resp,function(k,b){
						$.each(b,function(a1,b1){
							if(a1=="CODICE_ESENZIONE"){
								if(b1 == "013"){
									elem = $("#ComboIn option").each(function(){
										if(this.value == "2102"){
											$("#ComboOut").append(NS_MMG_UTILITY.createOption(this.value,this.text));
										}
									});
								}
							}
						});
					});
				});

				$("#radVaccino,#excClasseRischio").show();
			
			}else{
				$("#radVaccino,#excClasseRischio").hide();
			}
		},
		
		afterSave: function(){
			
			$("#li-tabElencoPip").trigger('click');
			$("#txtPip,#txtPip_PLS,#taDescrizione").val("");
			$("#radVaccino,#excClasseRischio").hide();
			WK_PIP.initWk();
		}
};


var WK_PIP ={
		
		objWk: null,
		
		init:function()
		{
			var h = $('.contentTabs').innerHeight() - 60;
			$("#divWk").height(h);

			WK_PIP.initWk();
		},
		
		initWk:function(){
			this.objWk = new WK({
                "id"    	: $("#ID_WK").val(),
                "container" : "divWk",
                "aBind" 	: ["iden_medico","iden_anag"],
                "aVal"  	: [$("#IDEN_MED_PRESCR").val().toString(),$("#IDEN_ANAG").val()]//----> prima c'era  home.baseUser.IDEN_PER.toString()
            });
            this.objWk.loadWk();
		},
		
		cancellaPip: function(riga) {
			if (home.MMG_CHECK.canDelete(riga[0].UTE_INS, riga[0].IDEN_MED)) {
				home.NS_MMG.confirm("Cancellare la P.P.I.P. selezionata?",function() {
					toolKitDB.executeProcedureDatasource('CANCELLA_PIP', 'MMG_DATI', {pIden: riga[0].IDEN, pIdenPPIP: riga[0].IDEN_PIP, pUtente : home.baseUser.IDEN_PER}, function(resp){
						WK_PIP.objWk.refresh();
					});
				});
			}
		}
};