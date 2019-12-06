
jQuery(document).ready(function(){
	
	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
    NS_SCALE_FILTRO.init();
	 
});

var NS_SCALE_FILTRO = {
		
	init:function(){
	//	$('#cmbScale').selectedIndex = -1;
		document.getElementById('cmbScale').selectedIndex = -1;
		NS_SCALE_FILTRO.setEvents();
	},
	
	aggiornaDati : function(){

		try{WindowCartella.utilMostraBoxAttesa(true)}catch(e){};		
		NS_SCALE_FILTRO.loadIframe();
	},
		
	loadIframe:function(){
		
		var height 	= $(window.parent).height() - 140;
		$('#iframeAndamento').css({'height' : height});
		url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.andamentoScale.andamentoScale';
        url += '&idenVisita=' + document.EXTERN.idenVisita.value;
        url += '&scala=' + $('#cmbScale').val();
		$("#iframeAndamento").attr("src", url);
	},
	
	setEvents : function(){
		$('#refreshDati').attr({"title":"Aggiorna"}).click(NS_SCALE_FILTRO.aggiornaDati);
	}
}
