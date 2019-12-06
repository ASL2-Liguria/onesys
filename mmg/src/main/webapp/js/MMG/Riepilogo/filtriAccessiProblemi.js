$(function(){

	RIEP_ACCESSI_PROBLEMI.init();
	RIEP_ACCESSI_PROBLEMI.setEvents();
	
	home.RIEPILOGO.toggleButtons( $('#IDFRAME').val() );

});

var RIEP_ACCESSI_PROBLEMI = {

		objWk : null,
		init:function(){

			home.RIEP_ACCESSI_PROBLEMI = this;
			//NS_FENIX_SCHEDA.adattaLayout();
			
			//RIEP_ACCESSI_PROBLEMI.adattaLayout();
			
			home.RIEPILOGO.setLayout( $('#IDFRAME').val(), 'RIEP_ACCESSI_PROBLEMI', $( document ) );
			
			if(home.ASSISTITO.SESSO === 'M'){
				$(".butGravidanza").hide();
			}
			
			RIEP_ACCESSI_PROBLEMI.setSizeWk();
			RIEP_ACCESSI_PROBLEMI.initWk();
			
			//nascondo l'icona della x per chiudere
			$("div.iconContainer").find("i.icon-cancel-squared").hide()
		},

		initWk:function(arBindValue){
			
		    this.objWk = new WK({
		    	"id"    : 'PROBLEMI',
		        "aBind" : ["iden_anag","data_da","data_a","chiuso","nascosto","iden_utente"],
		        "aVal"  : [home.ASSISTITO.IDEN_ANAG,"0",moment().format('YYYYMMDD'),"S,N,R","N",home.baseUser.IDEN_PER],
		        "container" : 'divWk2'
		    });
		    this.objWk.loadWk();
		    
		},
		
		filterWk:function(params){
			
			$("#h-dadata").val(params.aVal[2]);
			$("#h-adata").val(params.aVal[3]);
			$("#h-nascosto").val(params.aVal[4]=="N"?"N":"S");
			$("#h-radchiusaperto").val(params.aVal[5]);
			this.objWk.filter(params);
		},

		setEvents:function(){
			
			$(".butInserisci").click( function(){if(!home.MMG_CHECK.isDead()){return;} WK_PROBLEMI.inserimentoProblema(); });
			$(".butFiltra").click( WK_PROBLEMI.openFiltri );
			$(".butGravidanza").click(function(){ home.NS_MMG.apri("GRAVIDANZA", "&IDEN="); } );
		},

		setSizeWk:function(){ 
			
			var h = $('.contentTabs').innerHeight() - 15;
			$("#divWk2").height( h );
		},
		
		adattaLayout: function(){
			
			var iframe		= home.RIEPILOGO.iframeHeight;
			var ulTabs		= $('.ulTabs').outerHeight( true );
			var headerTabs	= $('.headerTabs').outerHeight( true );
			var footerTabs	= $('.footerTabs').outerHeight( true );
			var h			= iframe - headerTabs - footerTabs - 10;
				
			$('.contentTabs').height(h);
			
			if( $('.icon-resize-full-1', '.iconContainer').length < 1 ){
				
				$(document.createElement('i'))
					.addClass('icon-resize-full-1')
					.attr('title', 'Espandi')
					.on('click', 
							function()
							{ 
								home.RIEPILOGO.expand( $('#IDFRAME').val(), home.RIEP_ACCESSI_PROBLEMI.adattaLayout ); 
							})
					.appendTo('.iconContainer');
				
				$(document.createElement('i'))
					.addClass('icon-resize-small-1')
					.attr('title', 'Restringi')
					.on('click', 
							function()
							{ 
								home.RIEPILOGO.resize(); 
								window.frameElement.contentWindow.location.reload(); 
							})
					.appendTo('.iconContainer');
			}
		}
};

var WK_PROBLEMI = {
		
		accorpa:function(rec, type){
			
			var idenDaAccorpare = rec[0].IDEN;
			var combo = $("<select/>",{style:"width:100%", id:"cmbProblemi"});
			
			var promise = home.$.NS_DB.getTool({_logger : home.logger}).select({
	            id:'SDJ.R_PROBLEMA_ACCORPAMENTO',
	            parameter:
	            {
	            	iden_utente		:{ v : home.baseUser.IDEN_PER, t : 'N'},
	            	iden_anag		:{ v : home.ASSISTITO.IDEN_ANAG, t :'N'},
	            	iden_problema	:{ v : idenDaAccorpare, t :'N'},
	            }
			});
			
			promise.done( function(resp) {
			
				var res = resp.result;
				var idenProblemaPrinc = '';
				
				combo.append($("<option/>", {"value" : ""}).text(""));
				
				$(res).each(function() {
					
					var vValue = $(this)[0].VALUE;
					var vDescr = $(this)[0].DESCR != null ? $(this)[0].DESCR : "";
				
					combo.append($("<option/>", {
						"value" : vValue,
					}).text(vDescr));
				});
				
				var divHtml = $("<div/>");
				divHtml.html(traduzione.lblAccorpamento).append(combo);
				
				var dialog = home.$.dialog(divHtml,
					{
						'id'			: "dialogAccorpa",
						'title'			: type == 'S' ? traduzione.lblAccorpa : traduzione.lblDisAccorpa,
						'width'			: 350,
						'showBtnClose'	: false,
						'modal'			: true,
						'movable'		: true,
						'ESCandClose'	: true,
						'created'		: function(){ $('.dialog').focus(); },
						buttons : [ 
						{
							label : type == 'S' ? traduzione.lblButAccorpa : traduzione.lblButDisAccorpa,
							keycode : "13",
							'classe': "butVerde",
							action : function(ctx) {
								
								WK_PROBLEMI.dialogOK(type, idenDaAccorpare);

								home.$.dialog.hide();
								//callbackOk();
							}
						}, 
						{
							label : traduzione.lblAnnulla,
							action : function(ctx) {
								home.$.dialog.hide();
							}
						} ]
					});
			});
			
			promise.fail(NS_LOADING.hideLoading);
						
		},
		
		dialogOK:function(type, idenDaAccorpare){
			
			if(type == 'S'){		
								
				idenProblemaPrinc = home.$("select#cmbProblemi").val();
				
				if(typeof idenProblemaPrinc == 'undefined' || idenProblemaPrinc == ''){
					home.NOTIFICA.warning({
						message:traduzione.lblErroreNoProblem,
						title: 'Attenzione!'
					});
					return;
				}
				WK_PROBLEMI.accorpaProblemi(idenProblemaPrinc, idenDaAccorpare);
			}else{

				WK_PROBLEMI.scorporaProblemi(idenDaAccorpare);
			}
		},
		
		accorpaProblemi:function(idenPrincipale, idenFiglio){
			
			var vOut;
			
			//alert(idenPrincipale + ' ' + idenFiglio)
			
			var promise = home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'ACCORPA_PROBLEMI',
	            parameter:
	            {
	            	vIdenPrincipale		:{ v : idenPrincipale, t : 'N'},
	            	vDaAccorpare		:{ v : idenFiglio, t :'N'},
	            	vOut				:{ v : vOut, t : 'V' , d: 'O'}
	            }
			});
			
			promise.done( function() {
				if (LIB.isValid(vOut) && vOut != "") {
					home.NOTIFICA.error({
						message: "Errore: "+vOut,
						title: "Attenzione"
					});
				}
				
				//fatto perchè rimaneva appeso la schermata di loading
				NS_LOADING.hideLoading();
				//ricarico la parte della ricetta
				RIEP_ACCESSI_PROBLEMI.objWk.refresh();
			});
			
			promise.fail(NS_LOADING.hideLoading);
		},
		
		allega_documento:function(rec){
			var url_agg = "&IDEN_EPISODIO="+rec[0].IDEN+"&TIPO_EPISODIO=PROBLEMA";
			///***secondo me e' la pagina DOCUMENTI_ALLEGATI a dover essere chiamata***/
			home.NS_MMG.apri("DOCUMENTI_ALLEGATI" + url_agg);
		},
		
		apriFancybox:function(url){
			
			parent.$.fancybox({
				'padding'	: 1,
				'width'		: 800,//(home.widthCartella-400),
				'height'	: 600,//(home.heightCartella-300),
				'href'		: url,
				'type'		: 'iframe'
			});
		},

		apriRiepilogoProblema:function(obj){

			var url = "&MEDICO_INSERIMENTO=" + obj[0].DESCR_MED;
			url += "&DATA_INSERIMENTO=" + obj[0].DATA_INSERIMENTO;
			url += "&PROBLEMA_COMPLETO=" + obj[0].PROBLEMA_COMPLETO;
			
			home.NS_MMG.apri("MMG_RIEPILOGO_INSERIMENTO_PROBLEMA&ID_PROBLEMA=" + obj[0].IDEN + url);
		},
		
		apriSubWorklist:function(rec, wk, obj){
			
			//alert('rec[0].OSCURATO' + rec.OSCURATO[0]);
			if(rec.PARENT[0] == 'S' && rec.OSCURATO[0] == 'N' ){
				return obj.openDetailRow(0, rec, wk);
			}else{
				return false;
			}
		},

		aux_chiusura:function(obj){
			
			if(confirm(traduzione.confirmChiusura)){
				WK_PROBLEMI.chiusuraRapida(obj);
			}
		},
		
		chiusuraProblema:function(obj){
			
			home.activeWk = RIEP_ACCESSI_PROBLEMI.objWk;
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val();
			
			if(typeof obj != 'undefined'){
				urlAgg +="&ID_PROBLEMA="+obj[0].IDEN;
			}
			
			if(obj[0].CHIUSO == 'S'){
				return alert(traduzione.lblProblemaChiuso);
			}
			
			home.NS_MMG.apri("CHIUSURA_PROBLEMA" + urlAgg);
		},
		
		chiusuraRapida:function(obj, rilevanteSINO){
			
			if( !$.isArray( obj ) ) {
				
				tmp = new Array();
				tmp.push( { 'IDEN' : obj  } );
				obj = tmp;
			}

			if(obj[0].CHIUSO == 'S'){
				
				home.NOTIFICA.warning({
					message:traduzione.lblProblemClosed,
					title: traduzione.lblAttenzione
				});
				
				return;  
			}
			
			var param = { 
					'V_IDEN_PROBLEMA' 	: obj[0].IDEN,
					'PUTENTE' 			: home.baseUser.IDEN_PER,
					'PNOTECHIUSURA' 	: 'chiusura rapida da menu contestuale',
					'PDATACHIUSURA' 	: '',
					'PRILEVANTE'		: rilevanteSINO
			};

			toolKitDB.executeProcedureDatasourceOut("SP_CLOSE_PROBLEMA","MMG_DATI",param,{'V_OUT': 'V_OUT'},function(response){
				RIEP_ACCESSI_PROBLEMI.objWk.refresh(); //RIEP_ACCESSI_PROBLEMI.initWk();
			});
		},
		
		//funziona dedicata al filtro della subworklist dei problemi
		filtraSubWorklist: function(rec){
			
			var arrBind = new Array("iden_anag","data_da","data_a","chiuso","nascosto","iden_utente","iden_parent");
			var arrValue = new Array(home.ASSISTITO.IDEN_ANAG,"0",moment().format('YYYYMMDD'),"S,N,R","N",home.baseUser.IDEN_PER,rec.IDEN);
			var v_where = $.managerWhere();
			
			v_where.set('', arrBind, arrValue);
			
			return v_where;
		},
		
		inserimentoProblema:function(obj, urlAgg){
			if(!home.MMG_CHECK.isDead()){return;}
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val();
			home.NS_MMG.apri("INSERIMENTO_PROBLEMA"+ urlAgg);
			
		},
		
		modificaProblema:function(obj){
			
			//controllo per valorizzare correttamente la variabile in entrambi i casi di apertura(doppio clic o menu contestuale)
			var pIden = typeof obj[0] == 'undefined' ? obj.IDEN : obj[0].IDEN;
			
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val()+"&IDEN="+ pIden;
			home.NS_MMG.apri("INSERIMENTO_PROBLEMA" + urlAgg);
			
		},
		
		mostraInPatSummary: function( row, pValore ) {

			if(!home.MMG_CHECK.isDead()){return;}
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'UPD_CAMPO_STORICIZZA',
	            parameter:
	            {
	            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pTabella" 			: { v : "MMG_PROBLEMI", t : 'V'},
					"pNomeCampo" 		: { v : "PAT_SUMMARY", t : 'V'},
					"pIdenTabella" 		: { v : row[0].IDEN, t : 'N' },
					"pNewValore" 		: { v : pValore, t : 'V' },
					"pStoricizza" 		: { v : "N", t : 'V' },
					"pCampoIdenWhere" 	: { v : "IDEN", t : 'V' }
	            }
			}).done( function() {
				
				home.NOTIFICA.success({
					message: "Salvataggio effettuato",
				});
				RIEP_ACCESSI_PROBLEMI.objWk.refresh();
			});
		},
		
		nascondiProblemaExecute:function(obj, v_type){

			if(v_type == 'ANNULLA'){ return; }
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SP_HIDE_SHOW_PROBLEMA',
	            parameter:
	            {
	            	"v_iden_problema" 	: { v : obj[0].IDEN, t : 'N'},
					"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pDataHide" 		: { v : '', t : 'V'},
					"pTypeRequest"	 	: { v : v_type, t : 'V' }
	            }
			}).done( function() {
				if (home.ASSISTITO.IDEN_PROBLEMA == obj[0].IDEN){
					home.MAIN_PAGE.unsetPatientProblem();
				}else{
					RIEP_ACCESSI_PROBLEMI.objWk.refresh();
				}

				home.ASSISTITO.setEsenzioni();
				home.FILTRI_DIARI_WK.objWk.refresh();
			});
		},
		
		nascondiProblema:function(obj, typerequest){
			
			var v_type = typerequest;
			
			switch(typerequest) {
			case 'HIDE':
				if(obj[0].NASCOSTO == 'S') {
					home.NOTIFICA.warning({
						message:traduzione.lblErrorVis,
						title: 'Attenzione!'
					});
					return;
				}

				if(!confirm(traduzione.lblNascondiProblema)){
					return;
				}else{
					WK_PROBLEMI.nascondiProblemaExecute(obj, typerequest);
				}
				break;

			case 'SHOW':
				if(obj[0].NASCOSTO == 'N'){
					home.NOTIFICA.warning({
						message:traduzione.lblErrorVis,
						title: 'Attenzione!'
					});
					return;
				}

				if(!confirm(traduzione.lblRendiVis)){
					return;
				}else{
					WK_PROBLEMI.nascondiProblemaExecute(obj, typerequest);
				}
				break;

			case 'DEL':

				if (home.MMG_CHECK.canDelete(obj[0].UTE_INS, obj[0].IDEN_MED)) {
					if(obj[0].PARENT == 'S') {
						var dialog = home.$.dialog(
							traduzione.lblCancellaProblema, {
								'id' 				: "dialogCancellaProblema",
								'title' 			: traduzione.lblCancellazioneProblema,
								'ESCandClose'		: true,
								'created'			: function(){ $('.dialog').focus(); },
								'width' 			: 600,
								'showBtnClose' 		: false,
								'modal' 			: true,
								'movable' 			: true,
								'buttons'	 		: [{
									label : traduzione.lblNoCancellaProblema,
									action : function(ctx) {
											v_type = typerequest;
											WK_PROBLEMI.nascondiProblemaExecute(obj, v_type);
											home.$.dialog.hide();
									}
								}, {
									label : traduzione.lblSiCancellaProblema,
									keycode : "13",
									'classe': "butVerde",
									action : function(ctx) {
											v_type = 'DEL_ALL';
											WK_PROBLEMI.nascondiProblemaExecute(obj, v_type);
											home.$.dialog.hide();
									}
								}, {
									label : traduzione.lblAnnulla,
									action : function(ctx) {
										v_type = 'ANNULLA';
										home.$.dialog.hide();
									}
								}]
							}
						);	
					} else {
						var dialog = home.$.dialog(
							traduzione.lblConfirmCancella, {
								'id' 			: "dialogCancellaProblema",
								'title'			: traduzione.lblCancellazioneProblema,
								'width' 		: 600,
								'showBtnClose'  : false,
								'ESCandClose'	: true,
								'created'		: function(){ $('.dialog').focus(); },
								'modal' 		: true,
								'movable' 		: true,
								'buttons' 		: [{
									label : traduzione.lblSi,
									keycode : "13",
									'classe': "butVerde",
									action : function(ctx) {
										v_type = typerequest;
										WK_PROBLEMI.nascondiProblemaExecute(obj, v_type);
										home.$.dialog.hide();
									}
								}, {
									label : traduzione.lblNo,
									action : function(ctx) {
										v_type = 'ANNULLA';
										home.$.dialog.hide();
									}
								} ]
							}
						);	
					}
				}
				break;
			}
			
		},
		
		openFiltri: function() {
			var adata = $("#h-adata").val();
			var dadata = $("#h-dadata").val();
			var radChiusoAperto = $("#h-radchiusaperto").val();
			var nascosto = $("#h-nascosto").val();
			var url = "FILTRI&FILTRO=PROBLEMI&DADATA="+dadata+"&ADATA="+adata+"&CHIUSOAPERTO="+radChiusoAperto+"&NASCOSTO="+nascosto;
			home.NS_MMG.apri( url );
		},
		
		oscura: function( rec, val)
		{
			home.NS_MMG.confirm( (val=='S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {

				home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
		            id:'UPD_CAMPO_STORICIZZA',
		            parameter:
		            {
		            	"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
						"pTabella" 			: { v : "MMG_PROBLEMI", t : 'V'},
						"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
						"pIdenTabella" 		: { v : rec[0].IDEN, t : 'N' },
						"pNewValore" 		: { v : val, t : 'V' },
						"pStoricizza" 		: { v : "S", t : 'V' },
		            }
				}).done( function() {
					RIEP_ACCESSI_PROBLEMI.objWk.refresh();
				});
			});

		},
		
		riapriProblema:function(rec){
			
			var param = { 
					'V_IDEN_PROBLEMA' 	: rec[0].IDEN,
					'PUTENTE' 			: home.baseUser.IDEN_PER
			};

			toolKitDB.executeProcedureDatasourceOut("SP_OPEN_PROBLEMA","MMG_DATI",param,{'V_OUT': 'V_OUT'},function(response){
				RIEP_ACCESSI_PROBLEMI.objWk.refresh();
			});
		},
		
		scorporaProblemi:function(idenFiglio){
			
			var vOut;
			
			var promise = home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SCORPORA_PROBLEMI',
	            parameter:
	            {
	            	vIdenProblema		:{ v : idenFiglio, t : 'N'},
	            	vOut				:{ v : vOut, t : 'V' , d: 'O'}
	            }
			});
			
			promise.done( function() {
				if (LIB.isValid(vOut) && vOut != "") {
					home.NOTIFICA.error({
						message: "Errore: "+vOut,
						title: traduzione.lblAttenzione
					});
				}
				
				//fatto perchè rimaneva appeso la schermata di loading
				NS_LOADING.hideLoading();
				//ricarico la parte della ricetta
				RIEP_ACCESSI_PROBLEMI.objWk.refresh();
			});
			
			promise.fail(NS_LOADING.hideLoading);
			
		},
		
		setProblema:function(riga){

			if(typeof riga.CODICE_ICD9 == 'undefined'|| riga.CODICE_ICD9 == ''){
				WK_PROBLEMI.inserimentoProblema(riga,"&TIPO_INS=MOD&DATA="+riga.DATA+"&DATA_ISO="+riga.DATA_ISO+"&DESCR_PROBLEMA="+riga.PROBLEMA_COMPLETO+"&IDEN_PROBLEMA="+riga.IDEN_PARENT_PROBLEMA);
				return;
			}
			
			home.MAIN_PAGE.setPatientProblem( riga['IDEN'], riga['PROBLEMA_COMPLETO'] );
			
		}
};

