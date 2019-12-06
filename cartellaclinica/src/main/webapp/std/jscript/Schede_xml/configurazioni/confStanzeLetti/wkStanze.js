jQuery(document).ready(function(){
	WK_STANZE.init();
});



var WK_STANZE = {
		urlLetti:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_LETTI&ILLUMINA=illumina(this.sectionRowIndex);",
	
	init: function(){
		WK_STANZE.setEvents();
	},
	
	setEvents:function(){
		
		if (typeof apriChiudiInfoReferto === "undefined") {
			apriChiudiInfoReferto = function() {
				WK_STANZE.caricaLetti();
			};
		}
	},
	inserisci: function(){
		var url='servletGenerator?KEY_LEGAME=STANZA&KEY_ID=0&GRUPPO='+document.EXTERN.IDEN_GRUPPO.value;
		
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
			
			var url='servletGenerator?KEY_LEGAME=STANZA&KEY_ID='+iden+'&GRUPPO='+document.EXTERN.IDEN_GRUPPO.value;
			
				parent.$.fancybox({
					'padding'	: 3,
					'width'		: 600,
					'height'	: 400,
					'href'		: url,
					'type'		: 'iframe'
				});
		
	},
	caricaLetti:function(){

	 var where='&WHERE_WK=WHERE ';

	 where+=" IDEN_STANZA="+stringa_codici(array_iden);
		$('#frameLetti',parent.document)[0].src=WK_STANZE.urlLetti+where+'&IDEN_STANZA='+stringa_codici(array_iden)+'&GRUPPO='+stringa_codici(array_gruppo);
	}
	
};