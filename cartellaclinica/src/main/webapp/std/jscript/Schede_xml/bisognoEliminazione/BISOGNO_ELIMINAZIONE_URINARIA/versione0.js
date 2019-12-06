var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_ELIMINAZIONE_URINARIA.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_ELIMINAZIONE_URINARIA.init();
		BISOGNO_ELIMINAZIONE_URINARIA.setEvents();

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}

});

var BISOGNO_ELIMINAZIONE_URINARIA = {

		init : function(){

			setRadioResettable('BISOGNO_ELIMINAZIONE_URINARIA',[
			                                                    {radio:"chkLassativi"},
			                                                    {radio:"chkDiuretici"},
			                                                    {radio:"radEliUri"},
			                                                    {radio:"radEliFec"},
			                                                    {radio:"chkContinente"},
			                                                    {radio:"chkPortatore"},						
			                                                    {radio:"chkPortatore"}			
			                                                    ]);	

			BISOGNI.caricaWkObiettivi('BISOGNO_ELIMINAZIONE_URINARIA');			
			BISOGNI.initChkPrincipale("BISOGNO_ELIMINAZIONE_URINARIA");
            
            $('#lblAttivita').click(function(){BISOGNO_ELIMINAZIONE_URINARIA.inserisciAttivita()});
		},

		setEvents : function(){	
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_ELIMINAZIONE_URINARIA"]').click(function(){
				$(this).attr("edited","edited");			
			});																																																
		},
        
        inserisciAttivita:function(){
            var pBinds = new Array();
            pBinds.push($('#FUNZIONE').val());
            var rs = WindowCartella.executeQuery('bisogni.xml','returnIdenBisogno',pBinds);
            while (rs.next()) {
                var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.pianificaAttivita";
                url+= typeof $('#FUNZIONE').val()=='undefined'?"":"&iden_bisogno_selezionato=" + rs.getString("iden");
                url+= "&cod_cdc=" + WindowCartella.getForm().reparto;
                $.fancybox({
                    'padding' : 3,
                    'width' : 800,
                    'height' : 540,
                    'href' : url,
                    'type' : 'iframe'
                });
            }
        }
};