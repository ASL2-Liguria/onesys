var WK_ALLERGIE_INTOLLERANZE = {
		
		cancella:function(rec){
			if (home.MMG_CHECK.canDelete(rec[0].UTE_INS, rec[0].IDEN_MED)) {
				home.NS_MMG.confirm("Cancellare l'allergia/intolleranza selezionata?", function(){

					dwr.engine.setAsync(false);
					var id = rec[0].IDEN;
					var param = {"p_request":id};
					toolKitDB.executeFunctionDatasource("DEL_ALLERGIA_INTOLLERANZE", "MMG_DATI", param, function(resp){

					});
					var paramfx = {
							'viden_anag' : $("#IDEN_ANAG").val()
					};
					toolKitDB.executeFunctionDatasource("GET_ALLERGIE_INT","MMG_DATI",paramfx,function(resp){
						WK_ALLERGIE_INTOLLERANZE.gestisciIconaBar(resp);
					});

					MMG_ALLERGIE.wkAllergie.refresh();
					dwr.engine.setAsync(true);
				});
			}
		},
		
		gestisciIconaBar:function(resp){
			try{
				var r = resp["p_result"].split("*");
				//alert(r[0] + ' ' +r[1]);
				if(r[0] == "S" ){
					var iconaAllInt = jQuery("<div></div>").addClass("iconaAllergieInt").attr("title", r[1]);
					parent.$("#divAllInt").on("click",function(){
						NS_MMG.apri('PATIENT_SUMMARY',"&OPENTAB=tabAllergie");
					});
					parent.$("#divAllInt").html(iconaAllInt);
				}else{
					var iconaAllInt = jQuery("<div></div>").addClass("iconaNoAllergieInt").attr("title","Nessuna Allergia/Intolleranza");
					parent.$("#divAllInt").html(iconaAllInt);
				}
			}
			catch(e){
				//alert(e.description);
			}
		},
		
		scelta: function(atc, descr, codice){
			$("#cmbLivello").empty();
			if (atc != ""){
				
				var me=this;
				me.opt=$("<option>");
				
				me.opt.val(atc);
                me.opt.attr("data-valore",atc);
                me.opt.html(atc + ' - ' + descr);
    			me.opt.attr("data-descr",atc + ' - ' + descr);
						
				$("#cmbLivello").append(me.opt);
			}
			
			$("#PrincipioAttivo").val(descr);
			$("#h-PrincipioAttivo").val(codice);
			if($("#txtAllergia").val()=='') {
				$("#txtAllergia").val(descr);
			}
		},
		
		scelta_livello:function(codice_prodotto, descr_farmaco){
			$("#cmbLivello").empty();
			params = {"codice_prodotto":codice_prodotto.toString()};
			toolKitDB.getResultDatasource("PATIENT_SUMMARY.CODICI_PRODOTTI","MMG_DATI",params,null,function(resp){
				$.each(resp,function(k,v){
					var me=this;
					me.opt=$("<option>");
					$.each(v,function(k1,v1){
						if(k1 == "CODICE"){
							me.opt.val(v1);
		                    me.opt.attr("data-valore",v1);
						}
						if(k1 == "DESCR"){
		                    me.opt.html(v1);
		        			me.opt.attr("data-descr",v1);
						}
					});
					$("#cmbLivello").append(me.opt);
				});
			});
			$("#Farmaco").val(descr_farmaco);
			$("#h-Farmaco").val(codice_prodotto);
			if($("#txtAllergia").val()==''){
				$("#txtAllergia").val(descr_farmaco);
			}
		},
		
		oscura: function( rec, val)
		{
			home.NS_MMG.confirm( (val=='S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {

				home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
		            id:'UPD_CAMPO_STORICIZZA',
		            parameter:
		            {
		            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
						"pTabella" 			: { v : "MMG_ALLERGIE_INTOLLERANZE", t : 'V'},
						"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
						"pIdenTabella" 		: { v : rec[0].IDEN, t : 'N' },
						"pNewValore" 		: { v : val, t : 'V' },
						"pStoricizza" 		: { v : "S", t : 'V' },
		            }
				}).done( function() {
					MMG_ALLERGIE.wkAllergie.refresh();
				});
			});

		}
};
