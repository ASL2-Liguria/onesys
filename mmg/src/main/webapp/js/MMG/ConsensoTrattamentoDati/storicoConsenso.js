$(function(){
	WK_STORICO_CONSENSO.init();
	WK_STORICO_CONSENSO.setEvents();
});

// di default come data di inizio viene presa quella di un mese fa
var start = moment().subtract(30, 'days').format('YYYYMMDD');
// di default come data di fine presa quella odierna
var end = moment().format('YYYYMMDD');

var WK_STORICO_CONSENSO = {
		
	objWk : null,
	
	init: function(){
		
		$("#h-txtDaData").val(moment().subtract(1, 'years').format('YYYYMMDD'));
		$("#txtDaData").val(moment().subtract(1, 'years').format('DD/MM/YYYY'));
		$("#h-txtAData").val(moment().format('YYYYMMDD'));
		$("#txtAData").val(moment().format('DD/MM/YYYY'));
		
		WK_STORICO_CONSENSO.initWk();
	},
	
	setEvents: function(){
		
		$("#butApplica").parent().attr("colSpan","8");
		$("#butApplica").on("click", function(){
			WK_STORICO_CONSENSO.initWk();
		});
	},
	
	initWk: function(){
		
		$("#divWk").height( $('.contentTabs').innerHeight() - 80 ).width("98%");
		var params = {
	            "id"    : 'STORICO_CONSENSO',
	            "aBind" : ["iden_anag","iden_utente","da_data","a_data"],
	            "aVal"  : [$("#IDEN_ANAG").val(), $("#IDEN_PER").val(), $('#h-txtDaData').val(), $('#h-txtAData').val()]
		    };
		
	    this.objWk = new WK(params);
	    this.objWk.loadWk();			
	},
	
	visualizza:function(rec){
		
		//a seconda della scheda visualizzo il report corretto
		var report = rec[0].SCHEDA == 'CONSENSO_PRIVACY_MMG' ? 'STORICO_CONSENSO_PRIVACY_MMG.RPT' : 'STORICO_CONSENSO_PRIVACY_MMG_V2.RPT';
		
		var prompts = {pIdenPer : home.CARTELLA.getMedPrescr(), pIdenAnag :  rec[0].IDEN_ANAG, pIden : rec[0].IDEN};
		
		home.NS_PRINT.print({
			
			path_report: report + "&t=" + new Date().getTime(),
			prompts: prompts,
			show: 'S',
			output: "pdf"
		});
	}
};
