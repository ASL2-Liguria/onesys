jQuery(document).ready(function(){
});



var WK_LETTI = {
	init: function(){
		null;
	},
	
	setEvents:function(){
		null;
	},
	inserisci: function(){
		
		var url='servletGenerator?KEY_LEGAME=LETTO&KEY_ID=0&IDEN_STANZA='+document.EXTERN.IDEN_STANZA.value+'&GRUPPO='+document.EXTERN.GRUPPO.value;
		
			parent.$.fancybox({
				'padding'	: 3,
				'width'		: 600,
				'height'	: 400,
				'href'		: url,
				'type'		: 'iframe'
			});
	},
	modifica: function(){
		 var iden = stringa_codici(array_iden);		 
			
			var url='servletGenerator?KEY_LEGAME=LETTO&KEY_ID='+iden+'&IDEN_STANZA='+document.EXTERN.IDEN_STANZA.value+'&GRUPPO='+document.EXTERN.GRUPPO.value;
			
				parent.$.fancybox({
					'padding'	: 3,
					'width'		: 600,
					'height'	: 400,
					'href'		: url,
					'type'		: 'iframe'
				});
		
	}
};