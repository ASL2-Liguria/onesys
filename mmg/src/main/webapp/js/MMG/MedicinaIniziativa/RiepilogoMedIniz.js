$(function(){

	ACCERTAMENTI_MED_INIZ.init();
	FARMACI_MED_INIZ.init();
	DIARI_MED_INIZ.init();
	RIEPILOGO_MEDICINA_INIZIATIVA.init();
	
});

var RIEPILOGO_MEDICINA_INIZIATIVA = {
	
		
		init:function(){
			
			RIEPILOGO_MEDICINA_INIZIATIVA.setEvents();
		},
		
		setEvents: function() {
			
			$(".butDocumenti").on("click",function(){
				home.NS_MMG.apri( 'DOCUMENTI_PAZIENTE' ) 
			});
			
			$(".butCercaAcc").on("click",function(){
				ACCERTAMENTI_MED_INIZ.initWk();
			});
			
			$(".butCercaFarmaci").on("click",function(){
				FARMACI_MED_INIZ.initWk();
			});
			
			$("body").on("keyup",function(e) {
				
				if(e.keyCode == 13) {
					if($("#li-tabFarmaciMedIniz").hasClass("tabActive")){
						FARMACI_MED_INIZ.initWk();
					}else{
						ACCERTAMENTI_MED_INIZ.initWk();
					}
				}
			});
		}
}

var DIARI_MED_INIZ = {
		
		objWk: null,
		
		init:function(){
			
			DIARI_MED_INIZ.initWk();
			DIARI_MED_INIZ.setEvents();
		},
		
		setEvents: function() {
			
		},
		
		initWk: function(){
			
			var h = $('.contentTabs').innerHeight() - $('#tabDiariMedicinaDiIniziativa').outerHeight( true ) - 10;
			var w = $('.contentTabs').innerWidth() - 50;
			$("#divWk").height( h ).width(w);
			
			var tipo_wk = '', tipo_med;
			
			var parameters = {
					
				"id"    	: 'DIARI_WK_MED_INIZ',
				"aBind" 	: ["iden_utente","iden_anag","iden_problema","data_da","data_a","scheda", "iden_gruppo"],
				"aVal"  	: [home.baseUser.IDEN_PER,home.ASSISTITO.IDEN_ANAG,null,"0",moment().format('YYYYMMDD'),"ALL",null]
			};
			
			this.objWk = new WK( parameters );
		    this.objWk.loadWk();			
		}
};

var ACCERTAMENTI_MED_INIZ = {
		
		objWk: null,
		
		init:function(){
			
			var h =  $('.contentTabs').innerHeight(); - $('#tabAccertamentiMedIniz').height() - 10;
			var w = $('.contentTabs').innerWidth(); - 50;
			
			$("#divWkAcc").height( h ).width(w);
			
			ACCERTAMENTI_MED_INIZ.initWk();
		},
		
		initWk: function(){
			
			var daData 	= $("#h-txtDaDataAccertamento").val() != '' ? $("#h-txtDaDataAccertamento").val() : '0';
			var aData	= $("#h-txtADataAccertamento").val() != '' ? $("#h-txtADataAccertamento").val() : moment().format('YYYYMMDD');
			var utente	= $("#Utente").val().toUpperCase();
			var medico	= $("#UtenteMedico").val().toUpperCase();
			
			var tipo_wk = '', tipo_med;
			
			var parameters = {
					
				"id"    	: 'ACCERTAMENTI_MED_INIZ',
				"aBind" 	: ["utente", "medico","iden_anag","data_da","data_a"],
				"aVal"	 	: [utente, medico, home.ASSISTITO.IDEN_ANAG,daData,aData],
				"container"	: "divWkAcc"
			};
			
			this.objWk = new WK( parameters );
		    this.objWk.loadWk();			
		}
}

var FARMACI_MED_INIZ = {
		
		objWk: null,
		
		init:function(){
			
			var h = $('.contentTabs').innerHeight() - $('#tabFarmaciMedIniz').outerHeight( true ) - 10;
			var w = $('.contentTabs').innerWidth() - 50;
			
			$("#divWkFarmaci").height( h ).width(w);
			
			FARMACI_MED_INIZ.initWk();
		},
		
		initWk: function(){
			
			var daData 	= $("#h-txtDaData").val() != '' ? $("#h-txtDaData ").val() : '0';
			var aData	= $("#h-txtAData").val() != '' ? $("#h-txtAData").val() : moment().format('YYYYMMDD');
			var utente	= $("#UtenteFarmaci").val().toUpperCase();
			var medico	= $("#UtenteMedicoFarmaci").val().toUpperCase();
			
			var tipo_wk = '', tipo_med;
			
			var parameters = {
					
				"id"    	: 'FARMACI_MED_INIZ',
				"aBind" 	: ["utente", "medico","iden_anag","data_da","data_a"],
				"aVal"	 	: [utente, medico, home.ASSISTITO.IDEN_ANAG,daData,aData],
				"container"	: "divWkFarmaci"
			};
			
			this.objWk = new WK( parameters );
		    this.objWk.loadWk();			
		}
}


var WK_DIARI = {
		
		init: function(){
		
			home.WK_DIARI = this;
			WK_DIARI.body = $("body");
		},
		
		apriDialog : function(title, action, urlAgg) {

			var urlAggio = "&USER_IDEN_PER="+home.baseUser.IDEN_PER+"&PROVENIENZA=RIEPILOGO&IDEN_ANAG="+home.ASSISTITO.getIdenAnag()+"&ACTION="+action+urlAgg;
			home.NS_MMG.apri( "INSERIMENTO_DIARIO" + urlAggio );
		},
		
		apriVisita: function(riga){
			
			//controllo per valorizzare correttamente le variabili in entrambi i casi di apertura(doppio clic o menu contestuale)
			var pIden_scheda_xml = typeof riga[0] == 'undefined' ? riga.IDEN : riga[0].IDEN ;
			var pScheda = typeof riga[0] == 'undefined' ? riga.SCHEDA : riga[0].SCHEDA ;
			
			var urlAgg = "&IDEN=" + pIden_scheda_xml;
			urlAgg += '&IDX='+$("#IDX").val();
			urlAgg += '&PROVENIENZA=RIEPILOGO'/* + '&IDEN_ANAG=' + home.ASSISTITO.getIdenAnag()*/;
			
			home.NS_MMG.apri(pScheda + urlAgg);
		},
		
		cancella:function(obj) {
			
			if (home.MMG_CHECK.canDelete(obj[0].UTE_INS, obj[0].IDEN_MED)) {
				
				var vAction = 'DEL';
				var iden_visita = obj[0].IDEN;
				var scheda = obj[0].SCHEDA;
				//var vType = (scheda != 'NOTE' && scheda !='RILEVAZIONI') ? 'XML' : 'NOTA';

				switch(scheda){
				
					case 'NOTE':
						home.$.dialog(traduzione.lblConfermaCancellazioneNota, {
							'title'				: "Attenzione",
							'ESCandClose'		: true,
							'created'			: function(){ $('.dialog').focus(); },
							'buttons'			: [{
								label : "Si",
								keycode : "13",
								'classe': "butVerde",
								action : function() {
	
									var vParameters = {
											'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
											'PIDENSCHEDA' 		: { v : iden, t : 'N'},
											'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
											'PIDENPROBLEMA'	 	: { v : null, t : 'N'},
											'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
											'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
											'P_DATA' 			: { v : moment().format('YYYYMMDD'), t : 'V'},
											'P_ACTION' 			: { v : vAction, t : 'V'},
											'P_IDEN_NOTA'		: { v : '', t : 'N'},
											'V_OSCURATO'		: { v : 'N', t : 'V'},
											'P_NOTEDIARIO' 		: { v : vMsg, t : 'C'},
											'P_TIPO' 			: { v : 'MEDICINA_DI_INIZIATIVA', t : 'V'},
											'P_SITO' 			: { v : 'MMG', t : 'V'},
											"V_RETURN_DIARIO"	: { t : 'V', d: 'O'}
										};

										$('#li-tabListaMedicinaDiIniziativa').trigger('click');

										home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
											id:'SP_NOTE_DIARIO',
											parameter: vParameters
										}).done( function(){
											FILTRI_DIARI_WK.objWk.refresh();
									   		home.CARTELLA.NOTE = '';
									   		home.$.dialog.hide();
										});
								}
							}, {
								label:"No",
								keycode : "27",
								action: function(){home.$.dialog.hide();}
							}]
						});
						break;
	
					case 'RILEVAZIONI':
							break;
							
					case 'GRAVIDANZA':
						home.NS_MMG.confirm(traduzione.lblConfermaCancellazioneGravidanza, function()  {
	
							home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
								id:'SP_HIDE_SHOW_PROBLEMA',
								parameter: {
									"v_iden_problema" 	: { v : obj[0].IDEN_PROBLEMA, t : 'N'},
									"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
									"pDataHide" 		: { v : '', t : 'V'},
									"pTypeRequest"	 	: { v : 'DEL', t : 'V' }
								}
							}).done( function() {
								home.ASSISTITO.setEsenzioni();
								if (home.ASSISTITO.IDEN_PROBLEMA == obj[0].IDEN_PROBLEMA)
									home.MAIN_PAGE.unsetPatientProblem();
								else
									home.RIEP_ACCESSI_PROBLEMI.objWk.refresh();
							});
							try {
								FILTRI_DIARI_WK.objWk.refresh();
								home.RIEPILOGO.wkDiarioClinico.refresh();
							}
							catch(e) {}
						});
						break;
						
					default:
	
						var testo_dialog ='';
						if (scheda.indexOf("VISIT") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneVisita;}
						if (scheda.indexOf("ANAMNESI") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneAnamnesi;}
						if (scheda.indexOf("BILANCIO") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneBilancio;}
	
						home.$.dialog(testo_dialog, {
							'title'				: "Attenzione",
							'ESCandClose'		: true,
							'created'			: function(){ $('.dialog').focus(); },
							buttons:[{
								label: "Si",
								keycode : "13",
								action: function() {
									toolKitDB.executeProcedureDatasource("DELETE_SCHEDA_XML",'MMG_DATI',{'pIdenScheda': obj[0].IDEN}, function(response){
										FILTRI_DIARI_WK.objWk.refresh();
										home.NOTIFICA.success( { message : 'OK' , title : 'Successo!' } );
										home.$.dialog.hide();
									});
								}
							}, {
								label:"No",
								keycode : "27",
								action: function(){home.$.dialog.hide();}
							}]
						});
						break;
				}
			}
		},
		
		inserisciVisita: function(){	
			
			var url;
			if(home.MMG_CHECK.isPediatra() || home.MMG_CHECK.isPediatraAmm()) {
				url = "PLS_VISITE";
			}else{
				url = "MMG_VISITE";
			}
			home.NS_MMG.apri(url + '&PROVENIENZA=RIEPILOGO');
		},
		
		modifica:function(obj){

			if(obj[0].SCHEDA != 'NOTE' && obj[0].SCHEDA != 'DIAGNOSTICA' && obj[0].SCHEDA != 'CONSULENZA' && obj[0].TIPO != 'GRAVIDANZA'){
				WK_DIARI.apriVisita(obj);
				
			}else if(obj[0].TIPO == 'GRAVIDANZA'){
				home.NS_MMG.apri("GRAVIDANZA", "&IDEN=" + obj[0].IDEN);
				
			}else{
				var url = '&IDEN='+obj[0].IDEN+'&NOTA='+escape(obj[0].NOTA)+'&DATA='+obj[0].DATA_ISO+"&ID_PROBLEMA="+obj[0].IDEN_PROBLEMA;
				WK_DIARI.apriDialog('Modifica', 'MOD', url);
			}
		},
		
		modificaDblClick:function(obj){

			if(obj.SCHEDA != 'NOTE' && obj.TIPO != 'GRAVIDANZA'){
				WK_DIARI.apriVisita(obj);
			
			}else if(obj.TIPO == 'GRAVIDANZA'){
				home.NS_MMG.apri("GRAVIDANZA", "&IDEN=" + obj.IDEN);
			
			}else{
				var url = '&IDEN='+obj.IDEN+'&NOTA='+escape(obj.NOTA)+'&DATA='+obj.DATA_ISO+"&ID_PROBLEMA="+obj.IDEN_PROBLEMA;
				WK_DIARI.apriDialog('Modifica', 'MOD', url);
			}
		},
		
		stampa:function(riga){
			
			var tipoScheda = riga[0].SCHEDA;

			switch(tipoScheda){
				
				case 'NOTA':
					
					var prompts = {pIden:riga[0].IDEN, pIdenMed:home.CARTELLA.IDEN_MED_PRESCR };
					
					home.NS_PRINT.print({
						path_report: "NOTE.RPT" + "&t=" + new Date().getTime(),
						prompts: prompts,
						show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
						output: "pdf"
					});
					
					break;
				
				case 'MMG_VISITE':
					
					var prompts = {pIden:riga[0].IDEN, pIdenMed:home.CARTELLA.IDEN_MED_PRESCR };
					
					home.NS_PRINT.print({
						path_report: "VISITE.RPT" + "&t=" + new Date().getTime(),
						prompts: prompts,
						show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
						output: "pdf"
					});
					
					break;
				
				case 'PLS_VISITE':
					
					var prompts = {pIden:riga[0].IDEN, pIdenMed:home.CARTELLA.IDEN_MED_PRESCR };
					
					home.NS_PRINT.print({
						path_report: "VISITE.RPT" + "&t=" + new Date().getTime(),
						prompts: prompts,
						show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
						output: "pdf"
					});
					
					break;
			}
		}
};

var MEDICINA_INIZIATIVA = {
		
		setMI:function(rec, vType){
			
			var tipologia = '';
		
			switch(rec[0].SCHEDA){
				case "NOTE":
					tipologia = 'NOTE';
					break;
				case "MMG_VISITE":
					tipologia = 'VISITE';
					break;
				case "PLS_VISITE":
					tipologia = 'VISITE';
					break;
				default:
					tipologia = '';
					break;
			}
			
			if(tipologia == ''){
				return;
			}
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
				id:'MMG.SP_MEDICINA_INIZIATIVA',
				parameter:
				{
					//pAction in varchar2, pType in array_string, pIden in array_string, pMedIniz in array_string, pUtente in number, pIdenMed in number, vOut out nocopy varchar2) as
					"pAction" 			: { v : 'SET', t : 'V'},
					"pType" 			: { v : tipologia, t : 'A'},
					"pIden" 			: { v : rec[0].IDEN, t : 'A'},
					"pMedIniz" 			: { v : vType, t : 'A' },
					"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N' },
					"pIdenMed" 			: { v : home.CARTELLA.getMedPrescr(), t : 'N' },
					"vOut"				: { t : 'V', d: 'O'}
				}
			}).done( function() {
				DIARI_MED_INIZ.initWk();
			});
		},
		
		removeMI:function(){
			
		}
}