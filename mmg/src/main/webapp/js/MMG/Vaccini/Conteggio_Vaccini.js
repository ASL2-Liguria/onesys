$(function(){
	CONTEGGIO_VACCINI.init();
	NS_FENIX_SCHEDA.successSave = CONTEGGIO_VACCINI.successSave;

});

var CONTEGGIO_VACCINI = {
		
			objWk : null,
			
			init:function(){
				
				home.CONTEGGIO_VACCINI = this;
				CONTEGGIO_VACCINI.initWk();
				CONTEGGIO_VACCINI.setEvents();
			},
			
			setEvents:function(){
								
				$("#lblVacciniLink").on("click",function(event){
					
					event.preventDefault();
					
					home.NS_LOADING.showLoading();
					
					home.NS_MMG.apri("MMG_INSERIMENTO_VACCINO", "&TIPOLOGIA=ANTINFLUENZALE&PROVENIENZA=CONTEGGIO_VACCINI");
					
				});
				
			},
			
			initWk: function(){
				
				var h = $('.contentTabs').innerHeight() - $('#fld0').outerHeight(true) - 50;
				$("#wkConteggi").height( h );
				
				this.objWk = new WK({
					"id"        : 'CONTEGGIO_VACCINI',
	    			"aBind"     : ["iden_med"],
	    			"aVal"      : [home.baseUser.IDEN_PER],
	    			"container" : 'wkConteggi'
				});
				this.objWk.loadWk();
				
			},
			
			successSave: function(){
				
				CONTEGGIO_VACCINI.objWk.refresh();
				$("#txtVacciniConsegnati,#txtNrLotto,#DataScadenza,#h-DataScadenza").val("");
				radTipoVaccino.empty();
			},
			
			cancellaLotto: function(riga){
				
				$.dialog("Cancellare l'inserimento selezionato?",
		            {
					'title'				:"Attenzione",
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'buttons'			:[
                         {
                        	 label : "Si",
                        	 action : function() {
							toolKitDB.executeProcedureDatasource('SP_CANCELLA_LOTTO', 'MMG_DATI', {pIden: riga[0].IDEN}, function(resp){
								CONTEGGIO_VACCINI.objWk.refresh();
								$.dialog.hide();
							});}
                         },
                         {
                        	 label:"No",
                        	 action: function(){$.dialog.hide();}
                         }]
				});
				
			}
			
};