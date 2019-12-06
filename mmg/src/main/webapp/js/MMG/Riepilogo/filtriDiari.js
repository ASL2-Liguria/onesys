$(function(){

	FILTRI_DIARI_WK.init();
	WK_DIARI.init();
	
	home.RIEPILOGO.toggleButtons( $('#IDFRAME').val() );
	
	
	if( !home.MMG_CHECK.isPediatra() && !home.MMG_CHECK.isPediatraAmm())
		$("#chkFiltriNoteDiario_BILANCI_DI_SALUTE, #chkFiltriNoteDiario_RILEVAZIONI").hide();
	
});



var FILTRI_DIARI_WK = {
		
		objWk: null,
		
		init:function(){
			
			home.FILTRI_DIARI_WK = this;

			var filtri = home.CARTELLA.filtri.diari.split(",");
			for (var i = 0; i < filtri.length ; i++)
				$('#chkFiltriNoteDiario').data('CheckBox').selectByValue(filtri[i]);
			
			
			home.RIEPILOGO.setLayout( $('#IDFRAME').val(), 'FILTRI_DIARI_WK' );
			
			FILTRI_DIARI_WK.initWk();
			FILTRI_DIARI_WK.setEvents();
			
			//nascondo l'icona della x per chiudere
			$("div.iconContainer").find("i.icon-cancel-squared").hide();
		},
		
		setEvents: function() {
			
			$(".butInserisci").on("click",WK_DIARI.inserisci );
			$(".butInserisciVisita").on("click",WK_DIARI.inserisciVisita );
			$(".butFiltraDiari").on("click",WK_DIARI.openFiltri );
			//$(".icon-lamp").on("click", home.NS_INFORMATIONS.init );
			
			$("#chkFiltriNoteDiario>div").on("click", function(){
				
				var chkFiltro = $('#chkFiltriNoteDiario').data('CheckBox');
				var v = $(this).data("value");
				
				if (v =='ALL') {
					chkFiltro.deselectAll();
					chkFiltro.selectByValue('ALL');
				} else
					chkFiltro.deselectByValue('ALL');
				
				home.CARTELLA.filtri.diari = chkFiltro.val();
				
				var vEsclusione = home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 ? 'NO_PROBLEM' : 'MEDICINA_DI_INIZIATIVA';
				
				var params = {
						"aBind" : ["iden_utente","iden_anag","iden_problema","data_da","data_a","scheda", "iden_gruppo", "tipo_med","tipo_nota","escludiMI"],
						"aVal"  : [home.baseUser.IDEN_PER,home.ASSISTITO.IDEN_ANAG,home.ASSISTITO.IDEN_PROBLEMA,"0",moment().format('YYYYMMDD'),"ALL",null,'P',home.CARTELLA.filtri.diari, vEsclusione]
				};
				
				FILTRI_DIARI_WK.filterWk(params);
			});
			
		},
		
		initWk: function(){
			
			var h = $('.contentTabs').innerHeight() - $('#tableFiltri').outerHeight( true ) - 10;
			$("#divWk").height( h );
			
			var tipo_wk = '';
			var tipo_med = '';
			var vEsclusione = home.ASSISTITO.MEDICINA_INIZIATIVA.length > 0 ? 'NO_PROBLEM' : 'MEDICINA_DI_INIZIATIVA';
			
			if(home.MMG_CHECK.isPediatra() || home.MMG_CHECK.isPediatraAmm()){
				
				var parameters = 
				{
					"id"    : 'DIARI_WK_PLS',
					"aBind" : ["iden_utente","iden_anag","iden_problema","data_da","data_a","scheda", "iden_gruppo", "tipo_med","tipo_nota"],
					"aVal"  : [home.baseUser.IDEN_PER,home.ASSISTITO.IDEN_ANAG,home.ASSISTITO.IDEN_PROBLEMA,"0",moment().format('YYYYMMDD'),"ALL",null,'P',home.CARTELLA.filtri.diari]
				};
				
			}else{
				
				var parameters = 
				{
					"id"    : 'DIARI_WK',
					"aBind" : ["iden_utente","iden_anag","iden_problema","data_da","data_a","scheda", "iden_gruppo", "tipo_med","tipo_nota", "escludiMI"],
					"aVal"  : [home.baseUser.IDEN_PER,home.ASSISTITO.IDEN_ANAG,home.ASSISTITO.IDEN_PROBLEMA,"0",moment().format('YYYYMMDD'),"ALL",null,'P',home.CARTELLA.filtri.diari, vEsclusione]
				};
			}
			
			this.objWk = new WK( parameters );
		    this.objWk.loadWk();			
		},

		filterWk: function(params) {
			this.objWk.filter(params);
		}
};



var WK_DIARI = {
		
		init: function(){
		
			home.WK_DIARI = this;
			WK_DIARI.body = $("body");
		},

		inserisci:function(obj){
			
			WK_DIARI.apriDialog('Inserimento', 'INS', '');
		},

		modifica:function(obj){
			obj = obj[0];
			switch (obj.TIPO_NOTE) {
			case "RILEVAZIONI":
				return;
			case "GRAVIDANZA": //MMG_DIARIO.TIPO, valorizzata IDEN_GRAVIDANZA
				home.NS_MMG.apri("GRAVIDANZA", "&IDEN=" + obj.IDEN);
				break;
			case "CONSULENZA": //MMG_DIARIO.TIPO, pregresso
			case "DIAGNOSTICA": //MMG_DIARIO.TIPO, pregresso
			case "MEDICINA_DI_INIZIATIVA"://MMG_DIARIO.TIPO
			case "NOTE":
				var url = '&IDEN='+obj.IDEN+'&NOTA='+escape(obj.NOTA)+'&DATA='+obj.DATA_ISO+"&ID_PROBLEMA="+obj.IDEN_PROBLEMA;
				WK_DIARI.apriDialog('Modifica', 'MOD', url);
				break;
			case "ANAMNESI": //MMG_DIARIO.TIPO, prevalentemente pregresso
			case "BILANCI_DI_SALUTE": //TIPO_NOTE
			case "BILANCIO_SALUTE": //MMG_DIARIO.TIPO, pregresso (che ha anche una scheda xml vuota associata)
			case "VISITA": //MMG_DIARIO.TIPO
			case "VISITE": //TIPO_NOTE
			default:
				WK_DIARI.apriVisita(obj);
				break;
			}
			
/*
Casi in cui TIPO e TIPO_NOTE differiscono:
TIPO			TIPO_NOTE			COUNT
BILANCIO_SALUTE	BILANCI_DI_SALUTE	6148
ANAMNESI		VISITE				11181
VISITA			VISITE				201156
 */
			/*
			if(obj.SCHEDA != 'NOTE' 
				&& obj.SCHEDA != 'DIAGNOSTICA' 
					&& obj.SCHEDA != 'CONSULENZA' 
						&& obj.TIPO != 'GRAVIDANZA' 
							&& obj.TIPO != 'MEDICINA_DI_INIZIATIVA'){
				
				WK_DIARI.apriVisita(obj);
			
			}else if(obj.TIPO == 'GRAVIDANZA'){
				home.NS_MMG.apri("GRAVIDANZA", "&IDEN=" + obj.IDEN);
			
			}else{
				var url = '&IDEN='+obj.IDEN+'&NOTA='+escape(obj.NOTA)+'&DATA='+obj.DATA_ISO+"&ID_PROBLEMA="+obj.IDEN_PROBLEMA;
				WK_DIARI.apriDialog('Modifica', 'MOD', url);
			}
			*/
		},
		
		modificaDblClick:function(obj){
			WK_DIARI.modifica([obj]);
		},

		select:function(riga){
			home.CARTELLA.NOTE = riga.NOTA;
		},
		
		openFiltri: function() {
			var adata = $("#h-adata").val();
			var dadata = $("#h-dadata").val();
			var url = "FILTRI&FILTRO=DIARI&DADATA="+dadata+"&ADATA="+adata;
			home.NS_MMG.apri( url );
		},
		
		apriDialog : function(title, action, urlAgg) {

			var urlAggio = "&USER_IDEN_PER="+home.baseUser.IDEN_PER+"&PROVENIENZA=RIEPILOGO&IDEN_ANAG="+home.ASSISTITO.getIdenAnag()+"&ACTION="+action+urlAgg;
			home.NS_MMG.apri( "INSERIMENTO_DIARIO" + urlAggio );
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
		
		apriVisita: function(riga){
			
			//controllo per valorizzare correttamente le variabili in entrambi i casi di apertura(doppio clic o menu contestuale)
			var pIden_scheda_xml = typeof riga[0] == 'undefined' ? riga.IDEN : riga[0].IDEN ;
			var pScheda = typeof riga[0] == 'undefined' ? riga.SCHEDA : riga[0].SCHEDA ;
			
			var urlAgg = "&IDEN=" + pIden_scheda_xml;
			urlAgg += '&IDX='+$("#IDX").val();
			urlAgg += '&PROVENIENZA=RIEPILOGO'/* + '&IDEN_ANAG=' + home.ASSISTITO.getIdenAnag()*/;
			
			home.NS_MMG.apri(pScheda + urlAgg);
		},
		
		apriElencoVisite: function(riga){
			
			var urlAgg = "&PARTENZA=FILTRI_DIARI";
			urlAgg += '&IDX='+$("#IDX").val();
			home.NS_MMG.apri("MMG_WK_VISITE" + urlAgg);			
			
		},
		
		cancella:function(obj) {
			
			if (home.MMG_CHECK.canDelete(obj[0].UTE_INS, obj[0].IDEN_MED)) {
				
				var vAction = 'DEL';
				var iden_visita = obj[0].IDEN;
				var scheda = obj[0].SCHEDA;
				//var vType = (scheda != 'NOTE' && scheda !='RILEVAZIONI') ? 'XML' : 'NOTA';

				switch(scheda){
				case 'NOTE':
				case 'MEDICINA_DI_INIZIATIVA':
					home.$.dialog(traduzione.lblConfermaCancellazioneNota, {
						'title'				: "Attenzione",
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'buttons'			: [{
							label : "Si",
							keycode : "13",
							'classe': "butVerde",
							action : function() {

								/*var param = {
									   'PIDENANAG' 		: home.ASSISTITO.IDEN_ANAG,
									   'PIDENMED' 		: home.baseUser.IDEN_PER,
									   'PUTENTE' 		: home.baseUser.IDEN_PER,
									   'PIDENACCESSO' 	: home.ASSISTITO.IDEN_ACCESSO,
									   'PIDENPROBLEMA' 	: obj[0].IDEN_PROBLEMA, 
									   'P_DATA' 		: obj[0].DATA_ISO,
									   'P_NOTEDIARIO' 	: obj[0].NOTA,
									   'P_IDEN_NOTA'  	: obj[0].IDEN,
									   'P_ACTION' 		: vAction
								};*/
								
								var vParameters = {
									'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
									'PIDENSCHEDA' 		: { v : null, t : 'N'},
									'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
									'PIDENPROBLEMA'		: { v : obj[0].IDEN_PROBLEMA, t : 'N'},
									'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
									'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
									'P_DATA' 			: { v : obj[0].DATA_ISO, t : 'V'},
									'P_ACTION' 			: { v : vAction, t : 'V'},
									'P_IDEN_NOTA'		: { v : obj[0].IDEN, t : 'N'},
									'V_OSCURATO'		: { v : 'N', t : 'V'},
									'P_NOTEDIARIO' 		: { v : obj[0].NOTA, t : 'C'},
									'P_TIPO' 			: { v : 'NOTE', t : 'V'},
									'P_SITO' 			: { v : 'MMG', t : 'V'},
									"V_RETURN_DIARIO"	: { t : 'V', d: 'O'}
								};

								home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
									id:'SP_NOTE_DIARIO',
									parameter: vParameters
								}).done( function(){
									   FILTRI_DIARI_WK.objWk.refresh();
									   home.CARTELLA.NOTE = '';
									   home.$.dialog.hide();
								});

								/*toolKitDB.executeProcedureDatasourceOut("SP_NOTE_DIARIO",'MMG_DATI',param,{'V_RETURN_DIARIO': 'V_RETURN_DIARIO'}, function(response){
								   FILTRI_DIARI_WK.objWk.refresh();
								   home.CARTELLA.NOTE = '';
								   home.$.dialog.hide();
								});*/
							}
						}, {
							label:"No",
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
					else if (scheda.indexOf("ANAMNESI") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneAnamnesi;}
					else if (scheda.indexOf("BILANCIO") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneBilancio;}
					else {testo_dialog = traduzione.lblConfermaCancellazioneNota;}

					home.$.dialog(testo_dialog, {
						'title'				: "Attenzione",
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						buttons:[{
							label: "Si",
							action: function() {
								toolKitDB.executeProcedureDatasource("DELETE_SCHEDA_XML",'MMG_DATI',{'pIdenScheda': obj[0].IDEN}, function(response){
									FILTRI_DIARI_WK.objWk.refresh();
									home.NOTIFICA.success( { message : 'OK' , title : 'Successo!' } );
									home.$.dialog.hide();
								});
							}
						}, {
							label:"No",
							action: function(){home.$.dialog.hide();}
						}]
					});
					break;
				}
			}
		},
		
		oscura:function(obj){
			
			var vAction = 'OSCURA';
			var vIden = obj[0].IDEN;
			var scheda = obj[0].SCHEDA;
			var val =  obj[0].OSCURATO;
			var valNew = obj[0].OSCURATO == 'S' ? 'N' : 'S';
			
			switch(scheda){
			
				case 'NOTE':
				
				home.NS_MMG.confirm( (valNew == 'S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {

					home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			            id:'UPD_CAMPO_STORICIZZA',
			            parameter:
			            {
			            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
							"pTabella" 			: { v : "MMG_DIARIO", t : 'V'},
							"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
							"pIdenTabella" 		: { v : vIden, t : 'N' },
							"pNewValore" 		: { v : valNew, t : 'V' },
							"pStoricizza" 		: { v : "S", t : 'V' },
			            }
					}).done( function() {
						
						FILTRI_DIARI_WK.objWk.refresh();
					});
				});
					
				break;
			
			default:
				
				/* se vogliamo fare differenze di trattamento
					if (scheda.indexOf("VISIT") >= 0){;}
					if (scheda.indexOf("ANAMNESI") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneAnamnesi;}
					if (scheda.indexOf("BILANCIO") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneBilancio;}
				*/
				
				//TODO:creare oscuramento anche per le rilevazioni e per le gravidanze. Sono un po' più difficili
				if (scheda.indexOf("RILEVAZIONI") >= 0){
						return home.NOTIFICA.warning({
							message: traduzione.lblDeniedOscuramentoRilevazione,
							title: traduzione.lblTitleDeniedRilevazione,
							timeout: 20
						});	
				}
				
				home.NS_MMG.confirm( (valNew=='S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {
				
            		 home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
 			            id:'UPD_CAMPO_STORICIZZA',
 			            parameter: {
 			            	"pTabella" 			: { v : "MMG_SCHEDE_XML", t : 'V'},
 			            	"pIdenTabella" 		: { v : vIden, t : 'N' },
							"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
 							"pNewValore" 		: { v : valNew, t : 'V' },
 							"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N' },
 							"pStoricizza" 		: { v : "S", t : 'V' }
 			            }
                		 
     					}).done( function() {
     						
     						FILTRI_DIARI_WK.objWk.refresh();
     						home.$.dialog.hide();
     					});
                	 
					});
				
				break;
			}
		},
		
		stampa:function(riga){
			
			var tipoScheda = riga[0].SCHEDA;
			
			switch(tipoScheda){
				
				case 'NOTE':
					
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
			
			var vAction = 'SET';
			MEDICINA_INIZIATIVA.callDb(rec, vAction, vType);
		},
		
		removeMI:function(rec){

			var vAction = 'REMOVE';
			MEDICINA_INIZIATIVA.callDb(rec, vAction, '');
		},
		
		callDb:function(rec, vAction, vType){
					
			var tipologia = '';
			var vIden = rec[0].IDEN;
			
			switch(rec[0].SCHEDA){
				case "NOTE":
					tipologia = 'NOTE';
					vIden = rec[0].IDEN_NOTA;
					break;
				case "MMG_VISITE":
					tipologia = 'VISITE';
					break;
				case "PLS_VISITE":
					tipologia = 'VISITE';
					break;
				default:
					tipologia = 'NOTE';
					vIden = rec[0].IDEN_NOTA;
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
					"pAction" 			: { v : vAction, t : 'V'},
					"pType" 			: { v : tipologia, t : 'A'},
					"pIden" 			: { v : vIden, t : 'A'},
					"pMedIniz" 			: { v : vType, t : 'A' },
					"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N' },
					"pIdenMed" 			: { v : home.CARTELLA.getMedPrescr(), t : 'N' },
					"vOut"				: { t : 'V', d: 'O'}
				}
			}).done( function() {

					FILTRI_DIARI_WK.objWk.refresh();
			});
		}
}