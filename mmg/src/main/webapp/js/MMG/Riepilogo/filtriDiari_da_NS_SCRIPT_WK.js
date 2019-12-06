/*Questo era contenuto in NS_SCRIPT_WK. Verificare se serve a qualcosa*/
var WK_DIARI = {
		
		init: function(){
		
			home.WK_DIARI = this;
			WK_DIARI.body = $("body");
		},

		inserisci:function(obj){
			
			WK_DIARI.apriDialog('Inserimento', 'INS', '');
		},

		modifica:function(obj){
			
			if(obj[0].SCHEDA != 'NOTE' && obj[0].TIPO != 'GRAVIDANZA'){
				
				WK_DIARI.apriVisita(obj);
			}else{
				
				var url = '&IDEN='+obj[0].IDEN+'&NOTA='+obj[0].NOTA+'&DATA='+obj[0].DATA_ISO+"&IDEN_PROBLEMA="+obj[0].IDEN_PROBLEMA;
				WK_DIARI.apriDialog('Modifica', 'MOD', url);
			}
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
			if(home.MMG_CHECK.isPediatra()) {
				url = "PLS_VISITE";
			} else {
				url = "MMG_VISITE";
			}
			home.NS_MMG.apri(url + '&PROVENIENZA=RIEPILOGO');
		},
		
		apriVisita: function(riga){
			
			var pIden_scheda_xml = riga[0].IDEN;
			
			var urlAgg = "&IDEN=" + pIden_scheda_xml;
			urlAgg += '&IDX='+$("#IDX").val();
			urlAgg += '&PROVENIENZA=RIEPILOGO'/* + '&IDEN_ANAG=' + home.ASSISTITO.getIdenAnag()*/;
			home.NS_MMG.apri(riga[0].SCHEDA + urlAgg);
		},
		
		apriElencoVisite: function(riga){
			
			var urlAgg = "&PARTENZA=FILTRI_DIARI";
			urlAgg += '&IDX='+$("#IDX").val();
			home.NS_MMG.apri("MMG_WK_VISITE" + urlAgg);			
		},
		
		cancella:function(obj){
			
			if (home.MMG_CHECK.canDelete(obj[0].UTE_INS, obj[0].IDEN_MED)) {
			
				var vAction = 'DEL';
				var iden_visita = obj[0].IDEN;
				var scheda = obj[0].SCHEDA;
				var vType = (scheda != 'NOTE' && scheda !='RILEVAZIONI') ? 'XML' : 'NOTA';
				
				switch(vType){
				
					case 'XML':
						
						var testo_dialog ='';
						if (scheda.indexOf("VISIT") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneVisita;}
						if (scheda.indexOf("ANAMNESI") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneAnamnesi;}
						if (scheda.indexOf("BILANCIO") >= 0){testo_dialog = traduzione.lblConfermaCancellazioneBilancio;}
						
						home.$.dialog(testo_dialog,{
							
							'title'			:"Attenzione",
							'ESCandClose'	: true,
							'created'		: function(){ $('.dialog').focus(); },
							'buttons'		:[
			                         {
			                        	 label : "Si",
			                        	 action : function() {
			                        		 toolKitDB.executeProcedureDatasource("DELETE_SCHEDA_XML",'MMG_DATI',{'pIdenScheda': obj[0].IDEN}, function(response){
			             						home.RIEPILOGO.wkDiarioClinico.refresh();
			             						home.NOTIFICA.success( { message : 'OK' , title : 'Successo!' } );
			             						home.$.dialog.hide();
			             					 });
			                        	 }
			                         },
			                         {
			                        	 label:"No",
			                        	 action: function(){home.$.dialog.hide();}
			                         }]
						});
						
						break;
					
					case 'NOTA':
					default:
	
						home.$.dialog(traduzione.lblConfermaCancellazioneNota, {
							'title'				: "Attenzione",
							'ESCandClose'		: true,
							'created'			: function(){ $('.dialog').focus(); },
							'buttons'			: [
			                         {
			                        	 label : "Si",
			                        	 action : function() {
			                        		 
			                        		 /*var param = {
			             							'PIDENANAG' 	: home.ASSISTITO.IDEN_ANAG,
			             							'PIDENMED' 		: home.baseUser.IDEN_PER,
			             							'PUTENTE' 		: home.baseUser.IDEN_PER,
			             							'PIDENACCESSO' 	: home.ASSISTITO.IDEN_ACCESSO,
			             							'PIDENPROBLEMA' : obj[0].IDEN_PROBLEMA, 
			             							'P_DATA' 		: obj[0].DATA_ISO,
			             							'P_NOTEDIARIO' 	: obj[0].NOTA,
			             							'P_IDEN_NOTA'  	: obj[0].IDEN,
			             							'P_ACTION' 		: vAction
			             					};
			                        		 
			                        		 toolKitDB.executeProcedureDatasourceOut("SP_NOTE_DIARIO",'MMG_DATI',param,{'V_RETURN_DIARIO': 'V_RETURN_DIARIO'}, function(response){
			                        			home.RIEPILOGO.wkDiarioClinico.refresh();
			             						home.CARTELLA.NOTE = '';
			             						home.$.dialog.hide();
			             					 });*/
			                        		 
			                        		 var vParameters = {
			 										'PIDENANAG' 		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
			 										'PIDENSCHEDA' 		: { v : null, t : 'N'},
			 										'PIDENACCESSO' 		: { v : home.ASSISTITO.IDEN_ACCESSO, t : 'N'},
			 										'PIDENPROBLEMA' 	: { v : obj[0].IDEN_PROBLEMA, t : 'N'},
			 										'PIDENMED' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
			 										'PUTENTE' 			: { v : home.baseUser.IDEN_PER, t : 'N'},
			 										'P_DATA' 			: { v : obj[0].DATA_ISO, t : 'V'},
			 										'P_ACTION' 			: { v : vAction, t : 'V'},
			 										'P_IDEN_NOTA'		: { v : obj[0].IDEN, t : 'N'},
			 										'V_OSCURATO'		: { v : 'N', t : 'V'},
			 										'P_NOTEDIARIO' 		: { v : obj[0].NOTA, t : 'C'},
			 										'P_TIPO' 			: { v : 'NOTE', t : 'V'},
			 										'p_sito' 			: { v : 'MMG', t : 'V'},
			 										"V_RETURN_DIARIO"	: { t : 'V', d: 'O'}
			 									};

			 								home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			 									id:'SP_NOTE_DIARIO',
			 									parameter: vParameters
			 								}).done( function(){
			 									home.RIEPILOGO.wkDiarioClinico.refresh();
			             						home.CARTELLA.NOTE = '';
			             						home.$.dialog.hide();
			             					});
			                        	 }
			                         },
			                         {
			                        	 label:"No",
			                        	 action: function(){home.$.dialog.hide();}
			                         }]
						});
	
						break;
				}
			}
		}
};