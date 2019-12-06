var WindowCartella = null;
$(document).ready(function(){
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;

    }
	SCHEDA_DIAGNOSI.init();
	SCHEDA_DIAGNOSI.setEvents();

});

var gruppo;

var SCHEDA_DIAGNOSI = {
	init:function(){
		gruppo=WindowCartella.getReparto('COD_STRUTTURA');
		if (parent.WK_PROBLEMI.filtroDiagnosi=="ANAG_STRUTTURA"){
			$('#lblCodICD9').attr('disabled', 'disabled');
			$('#lblCodICD9').attr('onclick','');
			$('#lblCodICD9').css('cursor','default'); 
			$('#txtCodiceICD').attr('disabled', 'disabled');
			
			$('#lblDescrICD9').attr('disabled', 'disabled');
			$('#lblDescrICD9').attr('onclick','');
			$('#lblDescrICD9').css('cursor','default');
			$('#txtDescrizioneICD').attr('disabled', 'disabled');
		}
		else{
			$('#lblCodDiaRep').attr('onclick','');
			$('#lblCodDiaRep').attr('disabled', 'disabled');
			$('#lblCodDiaRep').css('cursor','default');
			$('#txtCodDiaRep').attr('disabled', 'disabled');
			
			$('#lblDescrDiaRep').attr('onclick','');
			$('#lblDescrDiaRep').attr('disabled', 'disabled');
			$('#lblDescrDiaRep').css('cursor','default');
			$('#txtDescrDiaRep').attr('disabled', 'disabled');
		}
		$("#hWhereCond").val("ATTIVO='S' AND CATEGORIA='"+ gruppo + "'");
		$("#hIdenVisita").val(parent.WK_PROBLEMI.idenNoso);
		$("#hIdenPer").val(parent.WK_PROBLEMI.idenPer);
		setCheckedCampo(document.getElementById('radTipoDia').getAttribute("name"), 0);
	},

	setEvents:function(){
	},
	
	testDati: function(){
		if ($("#hIdenDiagnosi").val()==""){
			alert("Inserire una diagnosi");
			return;
		}
		registra();		
	},
	chiudiScheda: function(){
		self.close(); //dialogbox
		parent.$.fancybox.close(); //fancybox
	},
	
	chiudiAggiornaWk: function(){
		SCHEDA_DIAGNOSI.chiudiScheda();
		parent.aggiorna();
	}
	
};

