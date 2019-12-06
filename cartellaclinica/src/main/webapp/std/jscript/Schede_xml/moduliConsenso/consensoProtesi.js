var WindowCartella = null;
alert('aaaaa');

jQuery(document).ready(function(){
	alert('bb');
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	CONSENSO_PROTESI.init();
	CONSENSO_PROTESI.setEvents();
	
});

var CONSENSO_PROTESI = {
		
	init : function(){
		if (_STATO_PAGINA=='L'){			
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		};
		
		$('input[name=txtNome]').attr('disabled', 'disabled');
		$('input[name=txtCogn]').attr('disabled', 'disabled');
		
  
	},
	
	setEvents: function() {
		
	},
	
	chiudi :function(){
        WindowCartella.$.fancybox.close();
	},
	
	registra : function(){
		alert($("input[name='chkIntervento']").val());
		alert($("input[name='chkInterventoB']").val());
		alert("Attenzione! Selezionare almeno un tipo di intervento!");
		$('iframe#frameWork',parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
		CONSENSO_PROTESI.chiudiModulo();
	},
	
	stampa : function(){
		
		var funzione	= document.EXTERN.TIPO.value;
		var anteprima	= 'S';
		var reparto		= WindowCartella.getAccesso("COD_CDC");
		var sf 			= '&prompt<pVisita>='+WindowCartella.getRicovero("IDEN");
        WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
	}
};


