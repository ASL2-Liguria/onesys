var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_IGIENE.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_IGIENE.init();
		BISOGNO_IGIENE.setEvents(); 

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}

});

var BISOGNO_IGIENE = {

		init : function(){

			setRadioResettable('BISOGNO_IGIENE',[
			                                     {radio:"chk'BISOGNO_IGIENE'Cambio"},
			                                     {radio:"chkModalita"}			
			                                     ]);	

			BISOGNI.caricaWkObiettivi('BISOGNO_IGIENE');	
			BISOGNI.initChkPrincipale("BISOGNO_IGIENE");
            
            $('#lblAttivita').click(function(){BISOGNO_IGIENE.inserisciAttivita()});
		},

		setEvents : function(){	
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_IGIENE"]').click(function(){
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
