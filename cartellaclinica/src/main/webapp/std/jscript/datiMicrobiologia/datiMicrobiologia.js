var WindowCartella 	= null;


jQuery(document).ready(function(){
	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
	NS_DATI_MICROBIOLOGIA.init();
	
});

var NS_DATI_MICROBIOLOGIA = {
	
	init : function(){
		try{top.utilMostraBoxAttesa(false);}catch(e){}
		NS_DATI_MICROBIOLOGIA.setStyles();
	},
	
	
	setStyles : function(){
	//	if ($('#divRis').length > 0){
			
			var height 		= parent.parent.document.getElementById('frameWork').offsetHeight;
			var offLeft		= $('#divRichieste').outerWidth(); // /*document.getElementById('divDati').offsetLeft*/
			var widthRis	= window.screen.availWidth - (offLeft + 8);
			
			
			$('#divWrapper').css({'height' : height - 195});
			$('#divRichieste').css({'height' : height - 222});		
			$('#divRis').css({'height' : height - 205 ,'width': widthRis,'position':'absolute','left':offLeft});
		//	$('#divIntAntib').css({'width' : widthRis - 18,'position':'absolute','left':offLeft});
			
//		}
			$('#divRis>table').height($('#divRichieste>table').height());	
		
			//	NS_DATI_LABO_GRIGLIA.STYLES.setAltezzaCol();			
		
			    $('#divRis').scroll(function(){
					$('#divRichieste').scrollTop($('#divRis').scrollTop());
					$('#divIntAntib').scrollLeft($('#divRis').scrollLeft());
				});
			    
				$("td[class~='noteRichiesta']").each(function(){
					$(this).prepend('<div title="'+$(this).attr('NOTE')+'" class="noteRichiestaIco"></div>');
				});	
				
		
	}
	

	};

