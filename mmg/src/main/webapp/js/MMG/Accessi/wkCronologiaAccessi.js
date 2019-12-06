$(document).ready(function() {
	WK_CRONOLOGIA_ACCESSI.init();
	WK_CRONOLOGIA_ACCESSI.setEvents();
});

var WK_CRONOLOGIA_ACCESSI={
		
	objWk : null,
	
	init:function() {
		home.WK_CRONOLOGIA_ACCESSI = this;
		
		WK_CRONOLOGIA_ACCESSI.initWk();
		
		/***setto la data di partenza della ricerca un mese prima di quella odierna***/
		$("#txtDaDataAccesso").val(moment().subtract('months', 1).format('DD/MM/YYYY'));
		$("#h-txtDaDataAccesso").val(moment().subtract('months', 1).format('YYYYMMDD'));
	},
	
	setEvents: function() {
		$('#butApplica').on('click', WK_CRONOLOGIA_ACCESSI.initWk );
		
		$('.butStampa').on('click', WK_CRONOLOGIA_ACCESSI.stampa );
	},
	
	initWk: function()  {
		var h = $('.contentTabs').innerHeight() - $('#fldFiltri').outerHeight( true ) - 20;
		$("#divWk").height(h);
		
		var daData 	= $("#h-txtDaDataAccesso").val() == '' ? moment().subtract('months', 1).format('YYYYMMDD') : $("#h-txtDaDataAccesso").val();
		var aData 	= $("#h-txtADataAccesso").val() == '' ? moment().format('YYYYMMDD') : $("#h-txtADataAccesso").val();

	    this.objWk = new WK({
	    	"id"    : 'CRONOLOGIA_ACCESSI',
	        "aBind" : ['da_data_accesso', 'a_data_accesso', 'iden_anag', 'iden_utente'],
	        "aVal"  : [daData, aData, home.ASSISTITO.IDEN_ANAG, home.CARTELLA.IDEN_MED_PRESCR]
	    });
	    this.objWk.loadWk();
	},
	
	modificaAccesso: function(row) {
		home.NS_MMG.apri("NUOVO_ACCESSO&IDEN=" + row[0].IDEN);
	},
	
	cancellaAccesso: function(row) {
		if (home.MMG_CHECK.canDelete(row[0].UTE_INS, row[0].IDEN_MED)) {
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
				id:'UPD_CAMPO_STORICIZZA',
				parameter:
				{
					"pIdenPer" 		: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pTabella" 		: { v : "MMG_ACCESSI", t : 'V'},
					"pNomeCampo" 	: { v : "DELETED", t : 'V'},
					"pIdenTabella" 	: { v : row[0].IDEN, t : 'N' },
					"pNewValore" 	: { v : "S", t : 'V' }
				}
			}).done( function() {
				WK_CRONOLOGIA_ACCESSI.objWk.refresh(); 
			});
		}
	},
	
	stampa: function() {
		var vDaData 	= $("#h-txtDaDataAccesso").val() == '' ? moment().subtract('months', 1).format('YYYYMMDD') : $("#h-txtDaDataAccesso").val();
		var vAData	 	= $("#h-txtADataAccesso").val() == '' ? moment().format('YYYYMMDD') : $("#h-txtADataAccesso").val();
		
		var prompts = {
				pDaData		: vDaData, 
				pAData		: vAData,
				pIdenAnag	: home.ASSISTITO.IDEN_ANAG, 
				pIdenMed	: home.CARTELLA.IDEN_MED_PRESCR
				};
	
		home.NS_PRINT.print({
			path_report	: "CRONOLOGIA_ACCESSI_CARTELLA.RPT" + "&t=" + new Date().getTime(),
			prompts		: prompts,
			show		: LIB.getParamUserGlobal('ANTEPRIMA_STAMPA_MODULI','N'),
			output		: "pdf"
		});
//		alert(prompts)
	}
};