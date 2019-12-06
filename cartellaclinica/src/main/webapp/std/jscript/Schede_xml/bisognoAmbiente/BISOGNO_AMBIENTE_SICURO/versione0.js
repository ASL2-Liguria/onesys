var WindowCartella = null;
jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }


	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_AMBIENTE_SICURO.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_AMBIENTE_SICURO.init();
		BISOGNO_AMBIENTE_SICURO.setEvents();	

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}

});

var BISOGNO_AMBIENTE_SICURO = {

		init : function(){

			$('label#lblLegendaConley').css({"width":"1000px"});	

			setRadioResettable('BISOGNO_AMBIENTE_SICURO',[
			                                              {radio:"chkContenzione"},
			                                              {radio:"chkSostanze"}
			                                              ]);	

			BISOGNI.caricaWkObiettivi('BISOGNO_AMBIENTE_SICURO');			
			BISOGNI.input.setDisables('BISOGNO_AMBIENTE_SICURO',['txtEsitoConley','txtDataConley','txtDataSucConley'],true);	
			BISOGNI.initChkPrincipale("BISOGNO_AMBIENTE_SICURO");
            $('#lblAttivita').click(function(){BISOGNO_AMBIENTE_SICURO.inserisciAttivita()});
		},

		setEvents : function(){
			$('form[name="BISOGNO_AMBIENTE_SICURO"] label[name="lblConley"]').click(BISOGNO_AMBIENTE_SICURO.apriConley);		
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_AMBIENTE_SICURO"]').click(function(){
				$(this).attr("edited","edited");			
			});				
		},

		apriConley : function(){	
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_CONLEY&FUNZIONE=SCALA_CONLEY&BISOGNO=S&READONLY="+WindowCartella.ModalitaCartella.isReadonly(document)+"&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value+ "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px',{win:this});

		},
		
		stampaConley : function(){
            WindowCartella.stampaTabWorkScalaConley();
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

