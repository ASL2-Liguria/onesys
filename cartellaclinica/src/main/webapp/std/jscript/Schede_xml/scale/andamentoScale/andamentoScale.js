var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	
    ANDAMENTO_SCALE.init();
});

var ANDAMENTO_SCALE ={
		
	init: function (){
		
		if ($('#divDati').length > 0){
			
			var offLeft		= $('#divLeft').outerWidth();
			var widthDati	= window.screen.availWidth - (offLeft + 8);
			var height 		= parent.document.getElementById('iframeAndamento').offsetHeight;
			
			$('#divDati').css({'width': widthDati,'position':'absolute','left':offLeft});
			$('#divLeft').css({'height' : height - 32 });		
			$('#divDati').css({'height' : height - 15 ,'width': widthDati,'position':'absolute','left':offLeft});
			
			$('#divDati').scroll(function(){
				$('#divLeft').scrollTop($('#divDati').scrollTop());
			});
			
			
			var cont=0;
			for (var i=0;i<document.all.tabLeft.rows.length;i++)
			{	
				cont=cont+1;
				if(document.all.tabLeft.rows[i].offsetHeight>20){	
					document.all.tabDati.rows[i].style.height=(document.all.tabLeft.rows[i].offsetHeight-4)+'px';
					// per certe versioni di ie8 il padding viene considerato
					if(document.all.tabDati.rows[i].offsetHeight<document.all.tabLeft.rows[i].offsetHeight){
						document.all.tabDati.rows[i].style.height=(document.all.tabLeft.rows[i].offsetHeight)+'px';
					}
				}
				if(document.all.tabDati.rows[i].offsetHeight>20){	
					document.all.tabLeft.rows[i].style.height=(document.all.tabDati.rows[i].offsetHeight-4)+'px';
					// per certe versioni di ie8 il padding viene considerato
					if(document.all.tabLeft.rows[i].offsetHeight<document.all.tabDati.rows[i].offsetHeight){
						document.all.tabLeft.rows[i].style.height=(document.all.tabDati.rows[i].offsetHeight)+'px';
					}
				}	  
			}
				
		}
	}	
}
