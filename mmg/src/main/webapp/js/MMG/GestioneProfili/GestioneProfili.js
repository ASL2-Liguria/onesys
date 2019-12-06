$(document).ready(function(){
	NS_GES_PROFILI.init();
	NS_GES_PROFILI.setEvents();
});

var NS_GES_PROFILI = {
	init:function(){
		
		$("#txtNomeGruppo").attr("disabled",true);
		$("#butRegistra, #butRimuovi").parents().attr("colSpan", "4");
//		$("#butDuplica").hide();
		/*************ATTENZIONE il primo combo listGruppi e' caricato da DB, il secondo listCross da js*************/
	},
	setEvents:function(){
		
		$("#listGruppi").on("click",function(){
			$("#fldDettaglio").show();
			NS_GES_PROFILI.loadDettaglio($("#listGruppi").val().toString(),$("#listGruppi option:selected").text());
		});
		
		$("#listCross").on("click",function(){
			NS_GES_PROFILI.loadPrestazione($("#listCross").val(),$("#listCross option:selected").text());
		});
		
		$("#butAggiungiAccertamento").on("click",function(){
			NS_GES_PROFILI.registra();
		});
		
		$("#butRimuoviAccertamento").on("click",function(){
			NS_GES_PROFILI.rimuovi();
		});
		
		$("#butChiudiDettaglio").on("click",function(){
			$("#txtNomeGruppo").val("").removeClass("light_blue");
			$("#listCross").val("");
			$("#fldDettaglio").hide();
		});
		
		$("#txtCercaGruppi").on("keyup",function(e) {
		    if(e.keyCode == 13) {
		    	NS_GES_PROFILI.ricerca_gruppi($(this).val());
		    }
		});
		
		$("#txtCercaGruppi").on("blur",function(e) {
			jQuery(this).val(jQuery(this).val().toUpperCase());
		});
		
		$("#butAggiungi").on("click",function(){
			$("#fldDettaglio").show();
			NS_GES_PROFILI.aggiungiProfilo();
		});
		
		$("#butDuplica").on("click",function(){
			if($("#txtNomeGruppo").val() == ""){
				home.NOTIFICA.warning({

	                message: "Scegliere un profilo da duplicare",
	                title: "Attenzione",
	                timeout: 10
				});
				return;
			}
			$("#fldDettaglio").show();
			NS_GES_PROFILI.duplicaProfilo();
		});
		
		$("#butModificaNome").on("click",function(){
			if($("#txtNomeGruppo").val() == ""){
				home.NOTIFICA.warning({

	                message: "Scegliere un profilo da rinominare",
	                title: "Attenzione",
	                timeout: 10
				});
				return;
			}
			NS_GES_PROFILI.changeName();
		});
		
		$("#butElimina").on("click",function(){
			NS_GES_PROFILI.eliminaProfilo();
		});
		
		$("#txtNomeGruppo").on("keyup",function(){
			$("#txtNomeGruppo").removeClass("light_blue");
		});
	},
	
	changeName: function(){
		
		var oldName = $("#txtNomeGruppo").val();
		var newName = '';
		var vContent = $("<textarea>",{'id':'txtModificaNome'}).css({width: 300, height: 30}).val(oldName);
//		$("#txtModificaNome").focus();
		$.dialog( vContent, {

			'id'				: 'dialogWk',
			'title'				: "Inserire nuovo nome",
			'showBtnClose'		: false,
			'width'				: 350,
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			buttons : 
				[{
					 "label"  : "OK",
					 "action" :  function(){
						 if($("#txtModificaNome").val() == ""){
							 home.NOTIFICA.warning({

					                message: "Inserire il nuovo nome per il profilo",
					                title: "Attenzione",
					                timeout: 10
					         });
							 $("#txtModificaNome").focus();
						 }else{
		 					newName = $("#txtModificaNome").val().toString().toUpperCase();;
	 						$("#txtNomeGruppo").attr("disabled",true).val(newName);
	 						var param = {
	 								"pNomeGruppo"	:newName,
	 								"pPrestazione" 	:$("#h-prestazioni").val().toString(),
	 								"pAbilitato" 	:"S",
	 								"pIden_Per"		:home.baseUser.IDEN_PER
	 						};
	 						
	 						if(LIB.isValid($("#HIdenGruppo").val().toString()) && $("#HIdenGruppo").val()!=""){
	 							
	 							param.pIdenGruppo = $("#HIdenGruppo").val().toString();
	 						}
	 						else{
	 							
	 							param.pIdenGruppo = null;
	 						}
	 						
	 						toolKitDB.executeProcedureDatasource("SP_REGISTRA_PROFILI","MMG_DATI",param,function(resp){
	 							$.each(resp,function(k,v){
	 								
	 								if(v.split("@GRUP=NOT*CODICE=")[0] =="OK"){
	 									home.NOTIFICA.success({

						                message: "Nome profilo modificato",
						                title: "",
						                timeout: 5
	 									});
	 									window.location.reload();
	 								}
	 							});
	 						});
	 						$.dialog.hide();
					 	}
					 }
				 }, 
				 {
					 "label"  :  "Chiudi",
					 "action" :   function(){$.dialog.hide();}
				}],
		});
	},
	
	duplicaProfilo: function(){
		
		$("#txtNomeGruppo").attr("disabled",false).addClass("light_blue").val("").focus();
		var oldHidenGruppo = $("#HIdenGruppo").val();
		$("#HIdenGruppo").val("");
		var newName = '';
		var vContent = $("<textarea>",{'id':'txtDuplica'}).css({width: 300, height: 30});//-->non riesco a trasformarla in un piu' semplice text...ora ho imparato
		$.dialog( vContent, {

			'id'				: 'dialogWk',
			'title'				: "Inserire nuovo nome",
			'showBtnClose'		: false,
			'width'				: 350,
			'ESCandClose'		: true,
			'created'			: function(){ $('.dialog').focus(); },
			buttons : 
				[{
					 "label"  : "OK",
					 "action" :  function(){
						 if($("#txtDuplica").val() == ""){
							 home.NOTIFICA.warning({

					                message: "E' necessario inserire un nome per il nuovo profilo che si desidera duplicare",
					                title: "Attenzione",
					                timeout: 10
					            });
							 $("#txtDuplica").focus();
						 }else{
						 					newName = $("#txtDuplica").val().toString().toUpperCase();;
					 						$("#txtNomeGruppo").attr("disabled",true).val(newName);
					 						var param = {
					 							
					 							"oldHidenGruppo"	:oldHidenGruppo,
					 							"newName"			:newName,
					 							"pIden_Per"			:home.baseUser.IDEN_PER
					 						};
					 						toolKitDB.executeProcedureDatasource("SP_DUPLICA_PROFILO","MMG_DATI",param,function(resp){
					 							$.each(resp,function(k,v){
					 								
					 								if(v.split("@")[0] =="OK"){
					 									var iden = v.split("@")[1];
					 									$("#HIdenGruppo").val(iden);
					 									NS_GES_PROFILI.loadDettaglio(iden,newName);
					 									$("#txtNomeGruppo").attr("disabled",true);
					 									$("#txtCercaGruppi").val(newName);

					 									$("#listGruppi").append(
					 											$("<option>",{"value":iden}).text(newName));
					 									NS_LISTBOX.set_new_default($("#listGruppi"));
					 									NS_GES_PROFILI.ricerca_gruppi(newName);
					 								}
					 							});
					 						});
					 						$.dialog.hide();
					 	}
					 }
				 }, 
				 {
					 "label"  :  "Chiudi",
					 "action" :   function(){$.dialog.hide();}
				}],
		});
	},

	aggiungiProfilo:function(){
		$("#txtNomeGruppo").attr("disabled",false).addClass("light_blue").val("").focus();
		$("#HIdenGruppo").val("");
		$("#listCross").empty();
	},
	loadDettaglio:function(valore,nome_gruppo){
		$("#txtNomeGruppo").val(nome_gruppo);
		$("#HIdenGruppo").val(valore);
		NS_GES_PROFILI.svuota();

		var param = {
				"iden_profilo":valore
		};
		//alert("valore " + valore);
		toolKitDB.getResultDatasource("MMG_DATI.PROFILI_CROSS","MMG_DATI",param,null,function(resp){
			$.each(resp,function(k,v){
				$("#listCross").append(createOption(v));
			});
		});
	},
	loadPrestazione:function(valore,testo){
		//alert(valore)
		$("#h-prestazioni").val(valore);
		$("#prestazioni").val(testo);
	},
	registra:function(){
		var check = NS_GES_PROFILI.valida();
		if(check=="OK"){
			
			var vNomeGruppo = $("#txtNomeGruppo").val().toString().toUpperCase();

			var param = {
					"pNomeGruppo"	: vNomeGruppo,
					"pPrestazione" 	:$("#h-prestazioni").val().toString(),
					"pAbilitato" 	:"S",
					"pIden_Per"		:home.baseUser.IDEN_PER
			};
			
			if(LIB.isValid($("#HIdenGruppo").val().toString()) && $("#HIdenGruppo").val()!=""){
				
				param.pIdenGruppo = $("#HIdenGruppo").val().toString();
			}
			else{
				
				param.pIdenGruppo = null;
			}
			
			//home.logger.debug("Prova" + JSON.stringify(param));
			//alert(JSON.stringify(param));
			
			toolKitDB.executeProcedureDatasource("SP_REGISTRA_PROFILI","MMG_DATI",param,function(resp){

				$.each(resp,function(k,v){
					//alert(v.split("@")[1])
					if(v.split("@")[0] =="OK"){
						resgrup = v.split("@")[1].split("#")[0];
						resprest = v.split("@")[1].split("#")[1];
						//alert("1");
						if(resgrup.split("*")[0] == "GRUP=INS"){
							striden = resgrup.split("*")[1];
							var iden = striden.split("=")[1];
							//alert(iden);
							NS_GES_PROFILI.loadDettaglio(iden,vNomeGruppo);
							$("#txtNomeGruppo").attr("disabled",true);
							$("#txtCercaGruppi").val(vNomeGruppo);

							$("#listGruppi").append(
									$("<option>",{"value":iden}).text(vNomeGruppo));
							NS_LISTBOX.set_new_default($("#listGruppi"));
							NS_GES_PROFILI.ricerca_gruppi(vNomeGruppo);
						}else{
							striden = resgrup.split("*")[1];
							var iden = striden.split("=")[1];
							//alert(iden);
							NS_GES_PROFILI.loadDettaglio(iden,vNomeGruppo);
							$("#txtNomeGruppo").attr("disabled",true);
							$("#txtCercaGruppi").val(vNomeGruppo);
							//$("#listGruppi").trigger("click");	
						}
						
					}
					else{
						//alert("Qualcosa \u00E8 andato storto");
					}
				});
				
				
			});

		}
		
		$("#prestazioni").focus();

	},
	rimuovi:function(){

			var param = {
					"pNomeGruppo"	:$("#txtNomeGruppo").val().toString(),
					"pPrestazione" 	:$("#listCross").val().toString(),
					"pAbilitato" 	:"N",
					"pIdenGruppo"	:$("#HIdenGruppo").val().toString(),
					"pIden_Per"		:home.baseUser.IDEN_PER
			};
			
			toolKitDB.executeProcedureDatasource("SP_CANCELLA_PROFILI","MMG_DATI",param,function(resp){
				
				
				$.each(resp,function(k,v){
					//alert(v.split("@")[1])
					if(v.split("@")[0] =="OK"){
						resgrup = v.split("@")[1].split("#")[0];
						resprest = v.split("@")[1].split("#")[1];
						if(resgrup.split("*")[0] == "GRUP=SEL"){
							striden = resgrup.split("*")[1];
							var iden = striden.split("=")[1];
							NS_GES_PROFILI.loadDettaglio(iden,$("#txtNomeGruppo").val());
							$("#txtNomeGruppo").attr("disabled",true);
							$("#txtCercaGruppi").val($("#txtNomeGruppo").val());
							
						}else{
							$("#listGruppi").trigger("click");	
						}
						
					}
				});
				
			});

	},
	valida:function(){
		if(!LIB.isValid($("#txtNomeGruppo").val()) || $("#txtNomeGruppo").val()==""){ 
			alert(traduzione.NomeNonCorretto);
			return 'KO';
		}
		if($("#h-radAbilitato").val()==""){
			return "KO";
		}
		if(!LIB.isValid($("#h-prestazioni").val()) || $("#h-prestazioni").val() == "" ){ 
			alert(traduzione.NessunAccertamento);
			return 'KO';
		}
//		if(!LIB.isValid($("#HIdenGruppo").val())){
//			alert("#HIdenGruppo")
//			return 'KO';
//		}
		return 'OK';
	},
	svuota:function(){
		/*svuoto il dettaglio delle prestazioni*/
		$("#listCross").empty();

		$("#h-prestazioni").val("");
		$("#prestazioni").val("");
	},
	ricerca_gruppi:function(valore){
		//ricerca nel listbox
		//alert(valore);
		if(valore !=""){
			NS_LISTBOX.search($("#listGruppi"),$("#txtCercaGruppi").val());	
		}else{
			NS_LISTBOX.backDefault($("#listGruppi"));
		}
		
	},
	eliminaProfilo: function(){
		
		var r=confirm("Sei sicuro?");
		if (r==true){
		
			var param = {
					
					"pIdenGruppo":$("#HIdenGruppo").val().toString(),
					"pIden_Per":home.baseUser.IDEN_PER
			};
			//alert(JSON.stringify(param));
			toolKitDB.executeProcedureDatasource("SP_ELIMINA_PROFILI","MMG_DATI",param,function(resp){
				
				$.each(resp,function(k,v){
					
					if (v !="OK") {
						alert(traduzione.lblCancellazioneError);
					} else {
						home.NOTIFICA.success({
							message:traduzione.lblCancellazioneEseguita,
							title: traduzione.lblTitoloCancellazioneEseguita
						});	
					}
				});

				window.location.reload();//-->refresha la pagina corrente
				
			});
			
		} else {
			
			alert(traduzione.lblCancellazioneAnnullata);
		}
	}
};

function createOption(v)
{
        var me=this;
        me.opt=$("<option>");
        $.each(v,function(k1,v1)
        {
        	if(k1 == "VALUE"){
        		me.opt.attr("data-valore",v1);
        		me.opt.val(v1);
        	}
        	if(k1=="DESCR"){
        		me.opt.html(v1);	
        	}
        });

        return me.opt;
}