/*Questo era contenuto in NS_SCRIPT_WK. Verificare se serve a qualcosa*/
var WK_PROBLEMI = {
		
		apriRiepilogoProblema:function(obj){
			
			var url = "&MEDICO_INSERIMENTO=" + obj[0].DESCR_MED;
			url += "&DATA_INSERIMENTO=" + obj[0].DATA_INSERIMENTO;
			url += "&PROBLEMA_COMPLETO=" + obj[0].PROBLEMA_COMPLETO;
			home.NS_MMG.apri("MMG_RIEPILOGO_INSERIMENTO_PROBLEMA&ID_PROBLEMA=" + obj[0].IDEN + url);
		},

		aux_chiusura:function(obj){
			
			if(confirm("Si vuole chiudere il problema?")){
				WK_PROBLEMI.chiusuraRapida(obj);
			}
		},
		
		chiusuraRapida:function(obj, rilevanteSINO){
			
			if(obj.CHIUSO == 'S'){
				return alert("Il problema risulta chiuso");
			}
			
			var param = { 
					
					'V_IDEN_PROBLEMA' 	: obj[0].IDEN,
					'PUTENTE' 			: home.baseUser.IDEN_PER,
					'PNOTECHIUSURA' 	: 'chiusura rapida da menu contestuale',
//					'PCHIUSURA' 		: 'S',
					'PDATACHIUSURA' 	: '',
					'PRILEVANTE'		: rilevanteSINO
			};

			toolKitDB.executeProcedureDatasourceOut("SP_CLOSE_PROBLEMA","MMG_DATI",param,{'V_OUT': 'V_OUT'},function(response){

				home.RIEPILOGO.loadWkProblemi();
			});
		},
		
		inserimentoProblema:function(obj, urlAgg){
			if(!home.MMG_CHECK.isDead()){return;}
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val();
			home.NS_MMG.apri("INSERIMENTO_PROBLEMA"+ urlAgg);
			
		},
		
		modificaProblema:function(obj){
			
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val()+"&IDEN="+ obj[0].IDEN;
			home.NS_MMG.apri("INSERIMENTO_PROBLEMA" + urlAgg);
			
		},
		
		chiusuraProblema:function(obj){
			
			home.activeWk = home.RIEPILOGO.wkProblemi;
			var urlAgg = "&PROVENIENZA=RIEPILOGO&IDX="+$("#IDX").val();
			
			if(typeof obj != 'undefined'){
				urlAgg +="&ID_PROBLEMA="+obj[0].IDEN;
			}
			
			if(obj[0].CHIUSO == 'S'){
				return alert("Il problema risulta chiuso");
			}
			
			home.NS_MMG.apri("CHIUSURA_PROBLEMA" + urlAgg);
		},
		
		openFiltri: function() {
			var adata = $("#h-adata").val();
			var dadata = $("#h-dadata").val();
			var radChiusoAperto = $("#h-radchiusaperto").val();
			var nascosto = $("#h-nascosto").val();
			var url = "FILTRI&FILTRO=PROBLEMI&DADATA="+dadata+"&ADATA="+adata+"&CHIUSOAPERTO="+radChiusoAperto+"&NASCOSTO="+nascosto;
			home.NS_MMG.apri( url );
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
				home.RIEPILOGO.wkProblemi.refresh();
			});
		},
		
		nascondiProblema:function(obj, typerequest){
			
			switch(typerequest){
			
				case 'HIDE':
					if(obj.NASCOSTO == 'S'){
						home.NOTIFICA.warning({
							message:traduzione.lblErrorVis,
							title: 'Attenzione!'
						});
						return;
					}
					
					if(!confirm(traduzione.lblNascondiProblema)){
						return;
					}
					break;
				
				case 'SHOW':
					if(obj.NASCOSTO == 'N'){
						home.NOTIFICA.warning({
							message:traduzione.lblErrorVis,
							title: 'Attenzione!'
						});
						return;
					}
					
					if(!confirm(traduzione.lblRendiVis)){
						return;
					}
					break;
				
				case 'DEL':
					if(!confirm(traduzione.lblConfirmCancella)){
						return;
					}
					break;
			}
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SP_HIDE_SHOW_PROBLEMA',
	            parameter:
	            {
	            	"v_iden_problema" 	: { v : obj[0].IDEN, t : 'N'},
					"pUtente" 			: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pDataHide" 		: { v : '', t : 'V'},
					"pTypeRequest"	 	: { v : typerequest, t : 'V' }
	            }
			}).done( function() {
				if (home.ASSISTITO.IDEN_PROBLEMA == obj[0].IDEN)
					home.MAIN_PAGE.unsetPatientProblem();
				else
					home.RIEPILOGO.wkProblemi.refresh();
					
			});
						
		},
		
		setProblema:function(riga){

			if(typeof riga.CODICE_ICD9 == 'undefined'|| riga.CODICE_ICD9 == ''){
				WK_PROBLEMI.inserimentoProblema(riga,"&TIPO_INS=MOD&DATA="+riga.DATA+"&DATA_ISO="+riga.DATA_ISO+"&DESCR_PROBLEMA="+riga.PROBLEMA_COMPLETO+"&IDEN_PROBLEMA="+riga.IDEN);
				return;
			}
			
			home.MAIN_PAGE.setPatientProblem( riga.IDEN, riga.PROBLEMA_COMPLETO );
			
		},
		
		allega_documento:function(rec){
			var url_agg = "&IDEN_EPISODIO="+rec[0].IDEN+"&TIPO_EPISODIO=PROBLEMA";
			/***secondo me e' la pagina DOCUMENTI_ALLEGATI a dover essere chiamata***/
			home.NS_MMG.apri("DOCUMENTI_ALLEGATI" + url_agg);
		},
		
		oscura: function( rec, val){

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
					home.RIEPILOGO.wkProblemi.refresh();
				});
			});

		}
};