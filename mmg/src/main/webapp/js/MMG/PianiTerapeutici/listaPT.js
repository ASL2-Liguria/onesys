$(function() {
	LISTA_PT.init();
});

var LISTA_PT = {
	objWk: null,
	init: function() {
		$("#wkPT").height($(".contentTabs").height());
		this.objWk = new WK({
            "id"    	: 'WK_PT',
            "container" : "wkPT",
            "aBind" 	: ["iden_anag"],
            "aVal"  	: [home.ASSISTITO.IDEN_ANAG]
        });
		this.objWk.loadWk();
	},
	
	prescrivi: function(row) {
		home.NS_MMG.apri("MMG_SCELTA_FARMACI&CAMPO_VALUE=" + row.FARMACO.replace(",","_") + "&IDX_RIGA=" + home.RICETTA_FARMACI.getRigaIns().attr("idx") + "&PT_DATA_FINE=" + row.DATA_SCADENZA);
	},
	
    setStampaPT:function( data ){
    	
    	var icon_print = $(document.createElement('i')).addClass('icon-doc worklist-icon');
    	
    	icon_print.on('click', function(){ LISTA_PT.stampa( data ); } );
    	
    	return $(document.createElement('div')).append( icon_print );
    },
		
	stampa:function(data){

		var iden 		= data.IDEN_TESTATA;
		var query 		= 'PIANI_TERAPEUTICI.VISUALIZZA_PDF';
		var datasource	= 'WHALE';
		
		home.NS_MMG.caricaDocumento(iden, query, datasource);
	}
};