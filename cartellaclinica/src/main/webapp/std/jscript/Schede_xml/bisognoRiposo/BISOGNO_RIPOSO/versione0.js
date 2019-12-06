var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_RIPOSO.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_RIPOSO.init();
		BISOGNO_RIPOSO.setEvents();

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	}

});

var BISOGNO_RIPOSO = {

		init : function(){

			setRadioResettable('BISOGNO_RIPOSO',[
			                                     {radio:"chkIpnotici"},
			                                     {radio:"chkSponde"},
			                                     {radio:"chkCompagnia"}			
			                                     ]);	

			BISOGNI.caricaWkObiettivi('BISOGNO_RIPOSO');	
			BISOGNI.initChkPrincipale("BISOGNO_RIPOSO");
            
            $('#lblAttivita').click(function(){BISOGNO_RIPOSO.inserisciAttivita()});
		},

		setEvents : function(){
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_RIPOSO"]').click(function(){
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
