$(document).ready(function(){
	WK_MODULI.init();
	WK_MODULI.setEvents();
});

var WK_MODULI = {
		
		prompts:null,
		 
		objReport:{
			ATTIVITA_SPORTIVA:'ATTIVITA_SPORTIVA',
			MMG_MODULO_MALATTIA_INFETTIVA_NOT:'MODULO_MAL_INF.RPT',
			MODULO_PATENTE:'MODULO_PATENTE.RPT',
			MMG_ASSISTENZA_PROGR:'MODULO_ASSISTENZA_PROGRAMMATA.RPT',
			MMG_ASSISTENZA_PROGR_V2:'MODULO_ASSISTENZA_PROGRAMMATA_V2.RPT',
			MMG_MODULO_PET:'MODULO_PET.RPT',
			MMG_MODULO_REAZIONE_AVVERSA:'MODULO_REAZIONE_AVVERSA.RPT',
			MMG_MODULO_RM:'MODULO_RM.RPT',
			MMG_MODULO_TC:'MODULO_TC.RPT',
			MMG_MODULO_RM_V2:'MODULO_RM_V2.RPT',
			MMG_MODULO_TC_V2:'MODULO_TC_V2.RPT',
			MMG_MODULO_TC_V3:'MODULO_TC_V3.RPT',
			MMG_MODULO_PORTO_ARMI:'MODULO_PORTO_ARMI.RPT',
			MMG_MODULO_PORTO_ARMI_V2:'MODULO_PORTO_ARMI_V2.RPT',
			MMG_MODULO_MALATTIA_INFETTIVA_PED:'MODULO_PEDICULOSI.RPT',
			MMG_PRIORITA_CLINICA:'MODULO_PRIORITA_CLINICA.RPT',
			MMG_MODULO_RSA:'MODULO_RSA.RPT',
			MMG_MODULO_DISPOSITIVI_DIABETE:'MODULO_DISPOSITIVI_DIABETE.RPT',
			MMG_MODULO_AMMISSIONE_RETE_SERVIZI:'MODULO_AMMISSIONE_RETE_ASSISTENZA.RPT',
			MMG_MODULO_SPORT_PLS:'MODULO_SPORT_PLS.RPT',
			MMG_MODULO_ELETTROMIOGRAFIA:'MODULO_ELETTROMIOGRAFIA.RPT'
		},
		
		init:function(){
			
			objWk : null,
			
			WK_MODULI.initWk();
		},
		setEvents:function(){
			
		},
		initWk: function(){
			
			var h = $('.contentTabs').innerHeight() - 30;
			$("#divWk").height( h );
			
			this.objWk = new WK({
		    	"id"    	: 'WK_MODULI',
		        "aBind" 	: ["IDEN_ANAG","IDEN_PER"],
		        "aVal"  	: [$("#IDEN_ANAG").val(),$("#IDEN_PER").val()],
		        "container" : 'divWk'
		    });

			this.objWk.loadWk();
			
		},
		apriModulo:function(rec){
			var iden = rec[0].IDEN;
			var pagina = rec[0].SCHEDA;
			
			//alert(pagina);
			
//			var url = pagina + "&IDEN="+iden;
			home.NS_MMG.apri( pagina, "&IDEN="+iden );
			
		},
		
		cancellaModulo:function(rec) {
			if (home.MMG_CHECK.canDelete(rec[0].UTE_INS, rec[0].IDEN_MED)) {
				$.dialog("Cancellare Il modulo selezionato?", {
					'title'				: "Attenzione",
					'ESCandClose'		: true,
					'created'			: function(){ $('.dialog').focus(); },
					'buttons'			: [{
						label : "Si",
						keycode : "13",
						classe	: "butVerde",
						action : function() {
								toolKitDB.executeProcedureDatasource('SP_CANCELLA_MODULO', 'MMG_DATI', {pIden: rec[0].IDEN}, function(resp){
									WK_MODULI.objWk.refresh();
									$.dialog.hide();
								});
							}
						}, {
							label:"No",
							action: function(){$.dialog.hide();}
						}]
					}
				);
			}
		},
		
		sceltaFormato:function(){
			
			v_report = '';

			home.$.dialog(traduzione.lblDialogFormato, {
				'title'				: traduzione.titleFormato,
				'movable' 			: true,
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'modal'				: true,
				'buttons' 			: [
						{
							label : traduzione.lblA4,
							action : function() {
								v_report = 'ATTIVITA_SPORTIVA_A4.RPT';
								WK_MODULI.stampa(v_report);		
								home.$.dialog.hide();
												}
						}, {
							label : traduzione.lblA5,
							action : function() {
								v_report = 'ATTIVITA_SPORTIVA_A5.RPT';
								WK_MODULI.stampa(v_report);
								home.$.dialog.hide();
							}
						}]
			});
		},
		
		stampaModulo:function(rec){

			var vIden 	= rec[0].IDEN;
			var vScheda = rec[0].SCHEDA;
			WK_MODULI.prompts = {pIdModulo:vIden, pIdenPer:home.CARTELLA.IDEN_MED_PRESCR };
			if(WK_MODULI.objReport[vScheda] == 'ATTIVITA_SPORTIVA'){
				WK_MODULI.sceltaFormato();
			}else{				
				v_report = WK_MODULI.objReport[vScheda];
				WK_MODULI.stampa(v_report);
			}
		},
		
		stampa:function(v_report){

			home.NS_PRINT.print({
				path_report: v_report + "&t=" + new Date().getTime(),
				prompts: WK_MODULI.prompts,
				show: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
				output: "pdf"
			});
		}
};