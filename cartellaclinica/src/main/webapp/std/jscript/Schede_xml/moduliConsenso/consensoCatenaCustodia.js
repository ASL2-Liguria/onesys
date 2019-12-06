var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	CATENA_CUSTODIA.init();
	CATENA_CUSTODIA.setEvents();
	
});

var CATENA_CUSTODIA = {
		
	init : function(){
	//	document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		if (_STATO_PAGINA=='L'){			
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		};
		$('input[name=txtNome]').attr('disabled', 'disabled');
		$('input[name=txtCogn]').attr('disabled', 'disabled');
		$('input[name=txtDataNasc]').attr('disabled', 'disabled');
		
		CATENA_CUSTODIA.controlloData('txtData');
		CATENA_CUSTODIA.controlloData('txtDataB');
        
		$("#txtOra").blur(function(){ oraControl_onblur(document.getElementById('txtOra')); });
		$("#txtOra").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOra')); });
		$("#txtOreB").blur(function(){ oraControl_onblur(document.getElementById('txtOreB')); });
		$("#txtOreB").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOreB')); });
		
	},
	
	setEvents: function() {
		
	},
	
	chiudiModulo :function(){
        WindowCartella.$.fancybox.close();
	},
	
	regOK : function(){
		$('iframe#frameWork',parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
		CATENA_CUSTODIA.chiudiModulo();
	},
	
	stampaModulo : function(){
		
		var funzione	= document.EXTERN.TIPO.value;
		var anteprima	= 'S';
		var reparto		= WindowCartella.getAccesso("COD_CDC");
		var sf 			= '&prompt<pVisita>='+WindowCartella.getRicovero("IDEN");
        WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
	},
	
	controlloData:function(id){
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
	}
};


