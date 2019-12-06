var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	CONSENSO_TRATTAMENTO_DATI_ASL5.init();
	CONSENSO_TRATTAMENTO_DATI_ASL5.setEvents();
	
});

var CONSENSO_TRATTAMENTO_DATI_ASL5 = {
		
	init : function(){
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		if (_STATO_PAGINA=='L'){			
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		};
		if (document.getElementById("txtData").getAttribute("value")==''){
			document.getElementById("txtData").setAttribute("value",getToday());
		}
	},
	
	setEvents: function() {
		
	},
	
	chiudiModulo :function(){
        WindowCartella.$.fancybox.close();
	},
	
	regOK : function(){
		$('iframe#frameWork',parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
		CONSENSO_TRATTAMENTO_DATI_ASL5.chiudiModulo();
	},
	
	stampaModulo : function(){
		
		var funzione	= document.EXTERN.TIPO.value;
		var anteprima	= 'S';
		var reparto		= WindowCartella.getAccesso("COD_CDC");
		var sf 			= '&prompt<pVisita>='+WindowCartella.getRicovero("IDEN");
        WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
	}
};


