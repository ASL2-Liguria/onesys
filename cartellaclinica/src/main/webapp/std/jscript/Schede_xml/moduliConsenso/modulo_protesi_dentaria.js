var WindowCartella = null;
jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	MODULO_PROTESI_DENTARIA.init();
	MODULO_PROTESI_DENTARIA.setEvents();
	
});

var MODULO_PROTESI_DENTARIA = {
		
	init : function(){
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		if (_STATO_PAGINA=='L'){			
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		};
		if (document.getElementById("txtData").getAttribute("value")==''){
			document.getElementById("txtData").setAttribute("value",getToday());
		}
		$('input[name=txtNome]').attr('disabled', 'disabled');
		$('input[name=txtCogn]').attr('disabled', 'disabled');
		$('input[name=txtDataNasc]').attr('disabled', 'disabled');
	},
	
	setEvents: function() {
		
	},
	
	chiudiModulo :function(){
        WindowCartella.$.fancybox.close();
	},
	
	regOK : function(){
		$('iframe#frameWork',parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
		MODULO_PROTESI_DENTARIA.chiudiModulo();
	},
	
	stampaModulo : function(){
		
		var funzione	= document.EXTERN.TIPO.value;
		var anteprima	= 'S';
		var reparto		= WindowCartella.getAccesso("COD_CDC");
		var sf 			= '&prompt<pVisita>='+WindowCartella.getRicovero("IDEN");
        WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
	}
};


