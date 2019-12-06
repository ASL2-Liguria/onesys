jQuery(document).ready(function(){
	WK_GRUPPI.init();
});



var WK_GRUPPI = {
		urlStanze:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_STANZE&ILLUMINA=illumina(this.sectionRowIndex);",
	
	init: function(){
		WK_GRUPPI.setEvents();
	},
	
	setEvents:function(){
		
		if (typeof apriChiudiInfoReferto === "undefined") {
			apriChiudiInfoReferto = function() {
				WK_GRUPPI.caricaStanze();
			};
		}
	},
	inserisci: function(){
		
		var url='servletGenerator?KEY_LEGAME=GRUPPO_STANZA&KEY_ID=0';
		
			parent.$.fancybox({
				'padding'	: 3,
				'width'		: 800,
				'height'	: 500,
				'href'		: url,
				'type'		: 'iframe'
			});
	},
	modifica: function(){
		 var iden = stringa_codici(array_iden);		 
			
			var url='servletGenerator?KEY_LEGAME=GRUPPO_STANZA&KEY_ID='+iden;
			
				parent.$.fancybox({
					'padding'	: 3,
					'width'		: 800,
					'height'	: 500,
					'href'		: url,
					'type'		: 'iframe'
				});
		
	},
	caricaStanze:function(){

	 var where='&WHERE_WK=WHERE ';

	 where+=" IDEN_GRUPPO="+stringa_codici(array_iden);
	 $('#frameStanze',parent.document)[0].src=WK_GRUPPI.urlStanze+where+'&IDEN_GRUPPO='+stringa_codici(array_iden);
	}
	
};