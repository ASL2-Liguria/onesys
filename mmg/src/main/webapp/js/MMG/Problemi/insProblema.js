$(document).ready(function(){

	PROBLEMI.init();
	PROBLEMI.setEvents();

	NS_FENIX_SCHEDA.beforeSave = PROBLEMI.beforeSave;
	NS_FENIX_SCHEDA.beforeClose = PROBLEMI.beforeClose;
	NS_FENIX_SCHEDA.successSave = PROBLEMI.successSave;
	var params = {config:"VPROBL",formId:"dati"};
	NS_FENIX_SCHEDA.addFieldsValidator(params);
	
});


var PROBLEMI = {
		
		descrProblema:'',
		
		init:function(){
			
			home.PROBLEMI = this;
			
			PROBLEMI.setLayout();
			PROBLEMI.hideDate();
			
			if (typeof $("#IDEN").val() == 'undefined') { //caso inserimento
				radTipoProblema.selectByValue("ATT");
			}
		},
		
		setEvents:function(){

			$("#btnGravidanza").on("click",function(){
				PROBLEMI.checkDate($(this));
			});
		},
		
		beforeClose: function(){
			
			home.ASSISTITO.IDEN_PROBLEMA = '';
			return true;
			
		},
		
		beforeSave: function(){
			/**Faccio equivalere una gravidanza a rischio impostata senza l'autocomplete a una impostata con l'autocomplete**/
			if($("#h-radaRischio").val() == 'S' && $("#h-txtCodProblema").val() == "V22.0"){
				$("#txtDescrProblema").val('GRAVIDANZA A RISCHIO');
				$("#txtCodProblema").val('V23.9');
				$("#h-txtDescrProblema").val('GRAVIDANZA A RISCHIO');
				$("#h-txtCodProblema").val('V23.9');
			}
			
			PROBLEMI.descrProblema = $("#txtProblema").val() + ' - ' + $("#txtDescrProblema").val();
			
			if($("#h-txtCodProblema").val() == "V23.9"){
				$("#radaRischio").data("RadioBox").selectByValue("S");
			}
//			in caso di inserimento
			if(typeof $("#IDEN").val() == 'undefined'){
				if(($("#h-txtCodProblema").val() == "V22.2" && $("#h-txtDataUM").val() == "") || ($("#h-txtCodProblema").val() == "V22.0" && $("#h-txtDataUM").val() == "") ||($("#h-txtCodProblema").val() == "V23.9" && $("#h-txtDataUM").val() == "")) {
					home.NOTIFICA.warning({
			            message: 	traduzione.lblProblGravidanza,
			            title: 		"Attenzione",
			            timeout:	8
			        });
					return false;	
				}else
					return true;
			}else
				return true;
		},

		
		checkDate:function(obj){

			var aperto = typeof obj.attr("aperto") != 'undefined'?obj.attr("aperto"):false;
			
			if(aperto == 'true'){
				PROBLEMI.removeGravidanza();
				PROBLEMI.hideDate();
			}else{
				PROBLEMI.setGravidanza();
				PROBLEMI.showDate();
			}
		},
		
		hideDate:function(){
			$("#btnGravidanza").attr("aperto","false");
			$("td#lblDataUM").hide();
			$("#txtDataUM").parent().hide();
		},
		
		removeGravidanza:function(){
			
			$("#txtCodProblema").val("");
			$("#txtDescrProblema").val("");
			$("#h-txtCodProblema").val("");
			$("#h-txtDescrProblema").val("");
		},
		
		setGravidanza:function(){
			
			if($("#h-txtCodProblema").val()!=''){
				return;
			}
			
			$("#txtCodProblema").val("V22.0");
			$("#txtDescrProblema").val("GRAVIDANZA");
			$("#h-txtCodProblema").val("V22.0");
			$("#h-txtDescrProblema").val("GRAVIDANZA");
		},
		
		setLayout:function(){
			
			//nascondo se necessario il pulsante della gravidanza
			if(home.ASSISTITO.SESSO != 'F'){
				$("#btnGravidanza").hide();
			}
			
			//assegno i vari colspan
			$("#btnGravidanza").parent().attr("colSpan","2").css("text-align","center");
			
			$("#txtCodProblema").parent().attr("colSpan","2");
			$("#txtDescrProblema").parent().attr("colSpan","2");
			$("#txtProblema").parent().attr("colSpan","2");
			$(".tdRadio").attr("colSpan","2");
		},
		
		showDate:function(){
			
			$("#btnGravidanza").attr("aperto","true");
			$("td#lblDataUM").show();
			$("#txtDataUM").parent().show();
		},
	
		successSave:function(resp){
			
			var setProb = home.LIB.getParamUserGlobal( 'CHIEDI_SETTAGGIO_PROBLEMA', 'S' );
			
			if(setProb  == 'S' ){
				
				var arrayButton = new Array();
				
				arrayButton.push({
					
					label:traduzione.lblSi,
					keycode:"13",
					action: function(){
						
						home.MAIN_PAGE.setPatientProblem( resp, home.PROBLEMI.descrProblema );
						home.$.dialog.hide();
						home.PROBLEMI.chiudiScheda();
					}
				});
				
				arrayButton.push({
					
					label:traduzione.lblNo, 
					action:function(){
						
						home.$.dialog.hide();
						home.RIEP_ACCESSI_PROBLEMI.initWk();
						home.FILTRI_DIARI_WK.initWk();
						home.ASSISTITO.setEsenzioni();
						home.PROBLEMI.chiudiScheda();
					}
				});
				
				home.$.dialog(traduzione.lblSetProblema,{
					
					'id'				: "dialog",
					'title'				: home.PROBLEMI.descrProblema,
					'width'				: 800,
					'showBtnClose'		: false,
					'modal'				: true,
					'movable'			: true,
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'buttons' 			: arrayButton
				});
			
			}else{
				
				home.$.dialog.hide();
				home.RIEP_ACCESSI_PROBLEMI.initWk();
				home.FILTRI_DIARI_WK.initWk();
				home.ASSISTITO.setEsenzioni();
				home.PROBLEMI.chiudiScheda();
			}
		},
		
		//questa funzione viene chiamata solo da PROBLEMI.registra...che a sua volta non viene mai chiamata...
		updateProblema:function(){
			
			vIdenIcd = typeof $("#hIdenIcd").val() != 'undefined' ? $("#hIdenIcd").val() : '';
			
			var param={
				pIdenProblema	:	$("#ID_PROBLEMA").val(),
				pData			:	$("#h-txtData").val(),
				pCodice			:	$("#txtCodProblema").val(),
				pDescr			:	$("#txtDescrProblema").val(),
				pProblema		:	$("#txtProblema").val(),
				pNote			:	$("#txtAreaNoteProblema").val(),
				pIdenIcd		:	vIdenIcd,
				pRischio		:   $("#h-radaRischio").val()// io aggiungo lo stesso questa correzione
 			};
			
			dwr.engine.setAsync(false);
			toolKitDB.executeProcedureDatasource('SP_UPDATE_PROBLEMA','MMG_DATI',param,function(resp){  });
			dwr.engine.setAsync(true);
		},

		registra:function() {//...ma questa funzione non viene mai chiamata
			
			if(typeof $("#ID_PROBLEMA").val()== 'undefined'){
				NS_FENIX_SCHEDA.registra();
			}else{
				PROBLEMI.updateProblema();
			}
			
			PROBLEMI.chiudiScheda();
		},
		
		chiudiScheda: function(){
			
			return home.NS_FENIX_TOP.chiudiUltima();
		}
};

var AC = {
		
		select:function(riga, type){

			//alert(riga.VALUE + ' ' + riga.DESCR);
			switch(type){
				
				case 'PROBLEMA':
					$("#txtCodProblema").val(riga.VALUE);
					$("#txtDescrProblema").val(riga.DESCR);
					$("#h-txtCodProblema").val(riga.VALUE);
					$("#h-txtDescrProblema").val(riga.DESCR);
					$("#hIdenIcd").val(riga.IDEN);
					break;
				
				case 'RAO':
					$("#txtProblemaRAO").val(riga.DESCR);
					$("#h-txtProblemaRAO").val(riga.VALUE);
					break;
				
				default: 
					$("#txtCodProblema").val(riga.VALUE);
					$("#txtDescrProblema").val(riga.DESCR);
					$("#h-txtCodProblema").val(riga.VALUE);
					$("#h-txtDescrProblema").val(riga.DESCR);
					$("#hIdenIcd").val(riga.IDEN);
					break;
			}
		}
};
	
	