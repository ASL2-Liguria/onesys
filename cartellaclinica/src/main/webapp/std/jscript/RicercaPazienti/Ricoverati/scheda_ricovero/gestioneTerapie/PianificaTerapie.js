$(function() {

	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	
    try{
        WindowCartella.utilMostraBoxAttesa(false);
		}catch(e)
		{/*catch nel caso non venga aperta dalla cartella*/}
});

var PIANIFICA_TERAPIE = {
		
	loadPlgTerapia: function (pProcedura,pIdenTerapia,pIdenScheda){

		if(_STATO_PAGINA=='L'){alert('Funzionalità disabilitata per le schede in sola lettura');return;}
	
		var url="servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
		url+="&modality=I&layout=O&reparto="+document.EXTERN.REPARTO.value;
		url+="&idenAnag="+document.EXTERN.IDEN_ANAG.value;
		url+="&idenVisita="+WindowCartella.FiltroCartella.getIdenRiferimentoInserimento(WindowCartella.getForm(document));
		url+="&statoTerapia=B";
		url+="&btnGenerali=";	
		url+="Pianifica::registra('conferma');";
		url+="&PROCEDURA="+pProcedura;		
			
		$.fancybox({
				'padding'	: 3,
				'width'		: screen.availWidth,
				'height'	: 800,
				'href'		: url,
				'type'		: 'iframe'
		});	
	},
	
	cancellaTerapia:function(pIden){
		if(typeof pIden=='undefined' || pIden==null || pIden==''){
			return alert('Effettuare una selezione');
		}
		if (confirm('Si conferma la cancellazione della terapia?')) {
            var resp = WindowCartella.executeStatement("terapie.xml", "cancella",
                [pIden], 1);
            if (resp[0]=="OK"){
            	PIANIFICA_TERAPIE.refresh();
            } else{
                return alert(resp[0] +" "+ resp[1]);
            }
        }
	},
	
	refresh: function() {
		document.location.href = document.location.href;
	}
};