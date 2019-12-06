jQuery(document).ready(function(){
	window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

});

var WK_REPARTI = {

	init: function(){
		
	},
	
	setEvents:function(){
		
	},
	
	configuraAlberi : function() {
		var reparto = stringa_codici(array_cod_cdc);
		var url='servletGenerator?KEY_LEGAME=CONF_ALBERI&REPARTO='+reparto;
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()-20,
			'height'	: 500,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	configuraScale : function() {
		var reparto = stringa_codici(array_cod_cdc);	
		var url='servletGenerator?KEY_LEGAME=CONFIGURA_SCALE&REPARTO='+reparto;
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()-20,
			'height'	: 500,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	configuraParametriVitali : function() {
		var reparto = stringa_codici(array_cod_cdc);	
		var url='servletGenerator?KEY_LEGAME=ASSOCIA_PARAMETRI&REPARTO='+reparto;
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()-20,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	configuraProfili : function() {
		var reparto = stringa_codici(array_cod_cdc);	
		var url='servletGenerator?KEY_LEGAME=CONFIGURAZIONE_PROFILI_RICETTA&INSERIMENTO=S&idRemoto=&REPARTO='+reparto;
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: $(document).width()-20,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	inserisci : function(){
		
		var url='servletGenerator?KEY_LEGAME=REPARTO';
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: 800,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe'
		});
		
	},
	modifica : function(){
		var reparto = stringa_codici(array_cod_cdc);
		var url='servletGenerator?KEY_LEGAME=REPARTO&REPARTO='+reparto;
		
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: 800,
			'height'	: 600,
			'href'		: url,
			'type'		: 'iframe'
		});
		
	}
	
};