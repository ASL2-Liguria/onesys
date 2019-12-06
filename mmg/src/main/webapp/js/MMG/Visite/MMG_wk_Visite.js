$(function()
{
	WK_VISITE.init();
	WK_VISITE.setEvents();
});

var WK_VISITE = {
		
			objWk : null,
			
			init: function(){
				
				home.WK_VISITE = this;

				WK_VISITE.initWk();
				
				if( home.CARTELLA.isActive() ){
					$("#Nome").closest("tr").hide();
				}
			},
			
			setEvents:function(){
				
				$("#butCerca").on("click", WK_VISITE.refreshWk );
				
				$("body").on("keyup",function(e) {
				    if(e.keyCode == 13){
				    	WK_VISITE.refreshWk();
				    }
				});
				
				$("#Nome,#Cognome").on('keyup',function(){ $(this).val( $(this).val().toUpperCase() ); });
			},
			
			refreshWk:function(){
				
				var vIdenAnag = home.CARTELLA.isActive() ? home.ASSISTITO.IDEN_ANAG : "";
				
				WK_VISITE.objWk.filter({
					"aBind"     :	["nome", "cognome", "iden_anag", "iden_utente", "iden_med", "da_data", "a_data"],
	    			"aVal"      :	[$("#Nome").val(), $("#Cognome").val(), vIdenAnag, home.baseUser.IDEN_PER, home.CARTELLA.getMedPrescr(), $("#h-txtDaData").val(), $("#h-txtAData").val()]
				});
			},
			
			initWk: function(){
				
				var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
				$("#ElencoWork").height( h );
				
				
				var vIdenAnag;
				var worklist; 
				if (home.CARTELLA.isActive()) {
					vIdenAnag = home.ASSISTITO.IDEN_ANAG;
					worklist = "WK_VISITE_PAZIENTE";
				} else {
					vIdenAnag = "";
					worklist = "WK_VISITE";
				}
				
				this.objWk = new WK({
					"id"        : 	worklist,
	    			"aBind"     :	["nome","cognome", "iden_anag", "iden_utente", "iden_med","da_data","a_data"],
	    			"aVal"      :	[$("#Nome").val(), $("#Cognome").val(), vIdenAnag, home.baseUser.IDEN_PER, home.CARTELLA.getMedPrescr(), $("#h-txtDaData").val(),$("#h-txtAData").val()],
	    			"container" : 	'ElencoWork'
				});
				this.objWk.loadWk();
				
			},
			
			apriVisita: function(row){
				
				if ( !home.CARTELLA.isActive() ){
					home.NS_OBJECT_MANAGER.init(row[0].IDEN_ANAG, function() { 
						home.NS_MMG.apri( row[0].SCHEDA , "&IDEN=" + row[0].IDEN );} 
					);
				}else{
					home.NS_MMG.apri( row[0].SCHEDA , "&IDEN=" + row[0].IDEN );
				}
			},
			
			cancellaVisita: function(row){
				
				if (home.MMG_CHECK.canDelete(row[0].UTE_INS, row[0].IDEN_MED)) {
					home.NS_MMG.confirm(traduzione.lblCancellaVisita, function(){

						toolKitDB.executeProcedureDatasource( 'DELETE_SCHEDA_XML', 'MMG_DATI', { 'pIdenScheda' : row[0].IDEN }, 
								function( response )
								{
									var status = response.p_result.split('$')[0], message = response.p_result.split('$')[1];
									if( status == 'OK' )
									{
										home.NOTIFICA.success( { message : message , title : 'Successo!' } );
										WK_VISITE.refreshWk();
										try {
											home.FILTRI_DIARI_WK.objWk.refresh();
										}
										catch(e) {}
									}
									else
										home.NOTIFICA.error( { message : message , title : 'Errore!' } );
								});
					});
				}
			},
			
			oscura:function(obj){
				
				var vAction = 'OSCURA';
				var vIden = obj[0].IDEN;
				var scheda = obj[0].SCHEDA;
				var val =  obj[0].OSCURATO;
				var valNew = obj[0].OSCURATO == 'S' ? 'N' : 'S';
			
				home.NS_MMG.confirm( (valNew=='S') ? traduzione.confirmOscura : traduzione.confirmDisoscura , function() {
					
		       		home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
			            id:'UPD_CAMPO_STORICIZZA',
			            parameter:
			            {
			            	"pTabella" 			: { v : "MMG_SCHEDE_XML", t : 'V'},
			            	"pIdenTabella" 		: { v : vIden, t : 'N' },
							"pNomeCampo" 		: { v : "OSCURATO", t : 'V'},
							"pNewValore" 		: { v : valNew, t : 'V' },
							"pIdenPer" 			: { v : home.baseUser.IDEN_PER, t : 'N' },
							"pStoricizza" 		: { v : "S", t : 'V' }
			            } 
					}).done( function() {
						WK_VISITE.refreshWk();
					});
				});
			},
			
			stampa: function(obj){
				
				var vIden = obj[0].IDEN;
				var prompts = {pIden:vIden};
				
				home.NS_PRINT.print({
					path_report: "VISITE.RPT" + "&t=" + new Date().getTime(),
					prompts: prompts,
					show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
					output: "pdf"
				});
			}
};