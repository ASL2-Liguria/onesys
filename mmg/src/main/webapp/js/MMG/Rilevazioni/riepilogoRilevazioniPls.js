$(function(){

	RIEPILOGO_RILEVAZIONI.init();
	RIEPILOGO_RILEVAZIONI.setEvents();
	
});

var RIEPILOGO_RILEVAZIONI = {
		
		wkBMI:null,
		wkPressione:null,
		wkCircCranica:null,
		wkDiaFontanella:null,
		wkTemperatura:null,
		wkAltro:null,
		activeWk:null,
		
		init:function()
		{	
			
			var h = $('.contentTabs').innerHeight() - $('#fldRicerca').outerHeight(true) -10;
			$("#ElencoWork").height( h );
			
			home.RIEPILOGO_RILEVAZIONI = this;
		},
		
		setEvents:function()
		{
			$(".butInserisci").on("click", RIEPILOGO_RILEVAZIONI.inserisciRilevazione );
			$(".butGrafici").on("click", RIEPILOGO_RILEVAZIONI.apriGrafici );
			
			$("#but_BMI, #but_CircCranica, #but_DiaFontanella, #but_Pressione, #but_Temperatura, #but_Altro").on("click",function(){
				
				var idRilevazione = $(this).attr('id').split("_")[1];
				
				var da_data = $("#txtDaData").val() != "" ? $("#h-txtDaData").val() : '19000101';
				var a_data = $("#h-txtAData").val();

				RIEPILOGO_RILEVAZIONI.apriWk( idRilevazione, da_data, a_data );
				
			});
		},
		
		apriWk: function(id_Riv, data_start, data_end)
		{
			
			switch (id_Riv){
			case 'BMI':
				RIEPILOGO_RILEVAZIONI.caricaWkBMI(data_start, data_end);
				break;
			case 'CircCranica':
				RIEPILOGO_RILEVAZIONI.caricaWkCircCranica(data_start, data_end);
				break;
			case 'DiaFontanella':
				RIEPILOGO_RILEVAZIONI.caricaWkDiaFontanella(data_start, data_end);
				break;
			case 'Pressione':
				RIEPILOGO_RILEVAZIONI.caricaWkPressione(data_start, data_end);
				break;
			case 'Temperatura':
				RIEPILOGO_RILEVAZIONI.caricaWkTemperatura(data_start, data_end);
				break;
			case 'Altro':
				RIEPILOGO_RILEVAZIONI.caricaWk("RILEVAZIONI_ALTRO",data_start, data_end);
				break;
			}
		},
		
		caricaWk: function(pTipo, data_start, data_end) {

			this.wkAltro = new WK({
				"id"   		: pTipo,
				"aBind" 	: ["iden_anag", "iden_med","da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkAltro.loadWk();
			this.activeWk = this.wkAltro;

		},
		
		caricaWkBMI:function(data_start, data_end)
		{
			this.wkBMI = new WK({
				"id"    	: 'RILEVAZIONI_BMI_PLS',
				"aBind" 	: ["iden_anag", "iden_med", "da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkBMI.loadWk();
			this.activeWk = this.wkBMI;
		},
		
		caricaWkPressione:function(data_start, data_end)
		{
				
			this.wkPressione = new WK({
				"id"    	: 'RILEVAZIONI_PRESSIONE',
				"aBind" 	: ["iden_anag", "iden_med", "da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkPressione.loadWk();
			this.activeWk = this.wkPressione;
		},
		
		caricaWkCircCranica:function(data_start, data_end)
		{

			this.wkCircCranica = new WK({
				"id"    	: 'RILEVAZIONI_CIRC_CRANICA',
				"aBind" 	: ["iden_anag", "iden_med", "da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkCircCranica.loadWk();
			this.activeWk = this.wkCircCranica;
		},
		
		caricaWkDiaFontanella:function(data_start, data_end)
		{		
			this.wkDiaFontanella = new WK({
				"id"    	: 'RILEVAZIONI_DIA_FONTANELLA',
				"aBind" 	: ["iden_anag", "iden_med", "da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkDiaFontanella.loadWk();
			this.activeWk = this.wkDiaFontanella;
		},
		
		caricaWkTemperatura:function(data_start, data_end) {
			this.wkTemperatura = new WK({
				"id"    	: 'RILEVAZIONI_TEMPERATURA',
				"aBind" 	: ["iden_anag", "iden_med", "da_data", "a_data"],
				"aVal"  	: [home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER, data_start, data_end],
				"container" : 'ElencoWork'
			});
			this.wkTemperatura.loadWk();
			this.activeWk = this.wkTemperatura;
		},
		
		cancellaRilevazione:function(row) {
			if (home.MMG_CHECK.canDelete(row[0].UTE_INS, row[0].IDEN_MED)) {
				if(row[0].IDEN_VISITA != null){
					home.NOTIFICA.warning({

						message: "La rilevazione selezionata risulta legata ad una visita, ad un'anamnesi o ad un bilancio di salute. Cancellare la relativa visita, anamnesi o bilancio se si desidera eliminare la rilevazione selezionata.",
						title: "Attenzione",
						timeout: 10
					});				
					return;
				}else{
					home.NS_MMG.confirm( "Cancellare la rilevazione selezionata?", function() {

						toolKitDB.executeProcedureDatasource('SP_DEL_RILEVAZIONI', 'MMG_DATI',{pIden:row[0].IDEN,pTipo:row[0].TIPO_RILEVAZIONE}, function(resp) {
							RIEPILOGO_RILEVAZIONI.activeWk.refresh();
						}); 
					});
				}
			}
		},
		
		inserisciRilevazione: function() 
		{
			home.NS_MMG.apri('INSERIMENTO_RILEVAZIONI_PLS');//-->se inserisco una nuova rilevazione al salvataggio di questa 
															//non viene refreshata la pagina del riepilogo
		},
		
		apriGrafici: function() 
		{
			home.NS_MMG.apri('MMG_GRAFICI_CRESCITA');
		}
};