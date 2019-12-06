jQuery(document).ready(function(){
	window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    CONFIGURA_SCALE.init();

});

var CONFIGURA_SCALE = {

	init: function(){
	},
	
	setEvents:function(){
		
	},
	registra:function(){
		var scaleSel='';
		$('SELECT[name=elencoSelezionate]>option').each(function(){ 
			if(scaleSel!=''){scaleSel+=','}
			scaleSel+=this.value
		});
	    var resp=WindowCartella.executeStatement('configurazioni/confScale.xml','registraScale',[document.EXTERN.REPARTO.value,scaleSel],0);
	    if (resp[0]=="OK"){
	    		CONFIGURA_SCALE.chiudi();
	    	}
	    else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
		
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
	
};