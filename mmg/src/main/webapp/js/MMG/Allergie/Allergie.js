$(function(){
	MMG_ALLERGIE.init();
	MMG_ALLERGIE.setEvents();
});

var MMG_ALLERGIE = {
			
			init:function(){
				
				$("#PrincipioAttivo").closest("tr").hide();
				$("#PrincipioAttivo").attr("placeholder",traduzione.phPrincipioAttivo);
				$("#Farmaco").attr("placeholder",traduzione.phFarmaco);
				
				var h = $('.contentTabs').innerHeight() - $('#fldInserimentoAllergie').outerHeight(true) - 30;
				$("#divWkAllergie").height( h );
				
				$("#buttonInsAllergie").addClass("butVerde");
				$("#buttonInsAllergie").parent().attr("colSpan","5");
				
				MMG_ALLERGIE.initWkAllergie();
				
				dwr.engine.setAsync(false);
				toolKitDB.executeFunctionDatasource("CHECK_ASSENZA_ALLERGIE","MMG_DATI",{ 'pIdenAnag' : $("#IDEN_ANAG").val() },function(resp){
					
					var r = resp['p_result'];
					if(r.substr(0,2) == 'KO'){
						
						home.NOTIFICA.warning({
		                     message: "Il paziente risulta avere allergie o intolleranze",
		                     title: "Attenzione"
	            		 });
					}else{
						chkAssenza_Allergie.selectByValue("S");
					}
				});
				dwr.engine.setAsync(true);
			},
			
			setEvents:function(){
				$("#li-tabElencoAllergie").on("click",function() {
					if (MMG_ALLERGIE.wkAllergie==null) {
						MMG_ALLERGIE.initWkAllergie();
					}
				});
				
				$("#buttonInsAllergie").on("click", MMG_ALLERGIE.inserisciAllergia );
				
				$("#chkAssenza_Allergie").on("change",function(){
					
					if ($("#h-chkAssenza_Allergie").val() == 'S'){
						
						dwr.engine.setAsync(false);

						toolKitDB.executeFunctionDatasource("CHECK_ASSENZA_ALLERGIE","MMG_DATI",{ 'pIdenAnag' : $("#IDEN_ANAG").val() },function(resp){
							
							var r = resp['p_result'];
							if(r.substr(0,2) == 'KO'){
								
								home.NOTIFICA.warning({
				                     message: "Il paziente risulta avere allergie o intolleranze",
				                     title: "Attenzione"
			            		 });
								
								$("#chkAssenza_Allergie_S").removeClass("CBpulsSel");
								$("#h-chkAssenza_Allergie").val("");
//								$("#chkAssenza_Allergie_S").empty(); ---> non funziona coi check
							}
						});
						dwr.engine.setAsync(true);
					}
				});
				
				$("#radTipoSostanza").on("change", function(){
					$("#cmbLivello").empty();
					$("#cmbLivello").val("");
					if($("#h-radTipoSostanza").val() == 'FAR'){
						$("#Farmaco").closest("tr").show();
						$("#PrincipioAttivo").closest("tr").hide();
						$("#PrincipioAttivo").val("");
						$("#h-PrincipioAttivo").val("");
						$("#txtAllergia").val("");
					}else{
						$("#PrincipioAttivo").closest("tr").show();
						$("#Farmaco").closest("tr").hide();
						$("#Farmaco").val("");
						$("#h-Farmaco").val("");
					}
				});
			},
			
			initWkAllergie:function() {
				MMG_ALLERGIE.wkAllergie = new WK({
					"id"    	: 'ALLERGIE_INTOLLERANZE',
	                "aBind" 	: ["iden_anag"],
	                "aVal"  	: [home.ASSISTITO.IDEN_ANAG],
	                "container" : "divWkAllergie"
				});
				MMG_ALLERGIE.wkAllergie.loadWk();
			},
			
			//function associata al tasto inserisci
			inserisciAllergia:function(){

				var descrAllergia = $("#txtAllergia").val().toUpperCase();
				var Allergia = '';
				var radioAllergia = $("#h-radTipoAllergia").val();
				if($("#h-radTipoSostanza").val() == 'FAR'){
					Allergia = descrAllergia != '' ?  descrAllergia : $("#Farmaco").attr("data-c-descr"); 
				}
				if($("#h-radTipoSostanza").val() == 'PA'){
					Allergia = descrAllergia != '' ?  descrAllergia : $("#PrincipioAttivo").attr("data-c-descr");
				}

				if (typeof Allergia == 'undefined'){
					home.NOTIFICA.warning({
					
		                message	: "Indicare a quale farmaco o principio attivo si riferisce l'allergia o l'intolleranza",
		                title	: "Attenzione",
		                timeout	: 6
		            });
					
					return;
				}
				if(radioAllergia == ""){
		            home.NOTIFICA.warning({
		                message	: "Specificare se si tratta di allergia o intolleranza",
		                title	: "Attenzione",
		                timeout	: 6
		            });
					
		            return;
				}
				
				var assenza_allergie = $("#h-chkAssenza_Allergie").val();
				if (assenza_allergie == ""){
					
					assenza_allergie = 'N';
				}
				
				if (Allergia != "" ||  radioAllergia != ""){
					
					assenza_allergie = 'N';
					$("#chkAssenza_Allergie_S").removeClass("CBpulsSel");
					$("#h-chkAssenza_Allergie").val("");
				}
				
				var param = {
						'pIdenAnag' 	: $("#IDEN_ANAG").val(),
						'pDescr' 		: Allergia,
						'pTipo' 		: radioAllergia,
						'pUteIns' 		: home.baseUser.IDEN_PER,
						'pIdenMed' 		: $("#IDEN_MED_PRESCR").val(),
						'pAtcGmp' 		: $("#cmbLivello").val(),
						'pCodFarmaco' 	: $("#h-Farmaco").val(),
						'pTipoReaz'     : $("#txtTipoReazAllergica").val(),
						'pAsseAllergie' : assenza_allergie,
						'pCod_Pa' 		: $("#h-PrincipioAttivo").val()
				};
		
				var paramfx = {
						'viden_anag' : $("#IDEN_ANAG").val()
				}, 
				iden_riferimento = '';

				//alert(JSON.stringify(param));
				
				dwr.engine.setAsync(false);
				toolKitDB.executeProcedureDatasource('SP_SAVE_ALLERGIE_INT','MMG_DATI',param,function(resp){
					
					var status = resp.p_result.split('$')[0];
					
					if( status == 'OK' ){
						iden_riferimento = resp.p_result.split('$')[1];
						home.NOTIFICA.success({
			                message: 'Inserimento eseguito correttamente',
			                title: "Success"
			            });
					}
					else
					{
						iden_riferimento = '';
						
						home.NOTIFICA.error({
			                message: resp.p_result.split('$')[1],
			                title: "Errore"
			            });
					}
				});

				toolKitDB.executeFunctionDatasource("GET_ALLERGIE_INT","MMG_DATI",paramfx,function(resp){
									
					WK_ALLERGIE_INTOLLERANZE.gestisciIconaBar(resp);
				});

				dwr.engine.setAsync(true);
				
				var parameters = new Object();
				
				if( iden_riferimento != '' && $('#radTipoAllergia').data('RadioBox').val() == 'ALL' )
				{
					parameters.iden_anagrafica		= home.ASSISTITO.IDEN_ANAG;
					parameters.text					= "Allergia inserita: " + $("#Farmaco").val() + ' | ' + Allergia;
					parameters.data_inizio			= moment().format('YYYYMMDD');
					parameters.data_fine			= moment().add( 100,'years' ).format('YYYYMMDD');
					parameters.sezione				= 'BACHECA_ALLERGIA_INTOLLERANZA';
					parameters.iden_riferimento		= iden_riferimento;
					parameters.tabella_riferimento	= 'MMG_ALLERGIE_INTOLLERANZE';
					
					//toolKitDB.executeFunction( 'SAVE_PROMEMORIA_BACHECA', parameters , function(){} );
					
					home.NS_MMG_UTILITY.insertPromemoria(parameters);
				}
					
				MMG_ALLERGIE.wkAllergie.refresh();
			    
			    $("#txtAllergia").val("");
			    $("#Farmaco").val("");
			    $("#h-Farmaco").val("");
			    $("#PrincipioAttivo").val("");
			    $("#h-PrincipioAttivo").val("");
			    $("#h-radTipoAllergia").val("");
			    $("#txtTipoReazAllergica").val("");
			    $("#radTipoAllergia div").removeClass("RBpulsSel");
			    $("#cmbLivello").empty();
			},
			
			beforeClose: function(){},
			
			successSave: function(pIden) {}
};
