var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_RESPIRARE.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_RESPIRARE.init();
		BISOGNO_RESPIRARE.setEvents();

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}

});

var BISOGNO_RESPIRARE = {

		init : function(){

			setRadioResettable('BISOGNO_RESPIRARE',[
			                                        {radio:"radDispneaSpec"},
			                                        {radio:"radColorito"},
			                                        {radio:"radTosse",Function:BISOGNO_RESPIRARE.gestOpzioni.Tosse},
			                                        {radio:"radPostObb"},
			                                        {radio:"radEscreato"},
			                                        {radio:"radResp"},
			                                        {radio:"radO2",Function:BISOGNO_RESPIRARE.gestOpzioni.O2},
			                                        {radio:"radUmidifi"},																		
			                                        {radio:"radDoloreTor"},
			                                        {radio:"radTracheo"},
			                                        {radio:"radDisfo"},			
			                                        {radio:"radO2Vent"}			
			                                        ]);

			BISOGNI.caricaWkObiettivi('BISOGNO_RESPIRARE');	
			BISOGNI.initChkPrincipale("BISOGNO_RESPIRARE");	
			BISOGNO_RESPIRARE.escludiDispnea(); 
			BISOGNO_RESPIRARE.escludiEupnea();
			BISOGNO_RESPIRARE.gestOpzioni.Tosse();
			BISOGNO_RESPIRARE.gestOpzioni.O2();
            
            $('#lblAttivita').click(function(){BISOGNO_RESPIRARE.inserisciAttivita()});

		},

		setEvents : function(){			

			$('form[name="BISOGNO_RESPIRARE"] input[name="radDispnea"]').click(BISOGNO_RESPIRARE.escludiEupnea);

			$('form[name="BISOGNO_RESPIRARE"] input[name="radEupnea"]').click(BISOGNO_RESPIRARE.escludiDispnea);		

			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_RESPIRARE"]').click(function(){
				$(this).attr("edited","edited");			
			});	
		},

		escludiDispnea:function (){

			if ($('form[name="BISOGNO_RESPIRARE"] input[name="radEupnea"]').is(':checked')){
				BISOGNI.input.setCheckeds('BISOGNO_RESPIRARE',["radDispnea","radDispneaSpec"],false);
				BISOGNI.input.setDisables('BISOGNO_RESPIRARE',["radDispneaSpec"],true);
			}		

		},

		escludiEupnea : function (){		
			if ($('form[name="BISOGNO_RESPIRARE"] input[name="radDispnea"]').is(':checked')){
				BISOGNI.input.setCheckeds('BISOGNO_RESPIRARE',["radEupnea"],false);
				BISOGNI.input.setDisables('BISOGNO_RESPIRARE',["radDispneaSpec"],false);
			}else{
				BISOGNI.input.setDisables('BISOGNO_RESPIRARE',["radDispneaSpec"],true);
			}
		},

		gestOpzioni:{
			Tosse : function(){			
				BISOGNI.gestOpzioni.set('BISOGNO_RESPIRARE','radTosse','0',[],['radEscreato']);		
			},

			O2 : function(){
				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(0)').is(':checked')) {// forcelle
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Forcella"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Forcella"]').attr("disabled","disabled").val("");
				}

				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(1)').is(':checked')){// maschera semplice
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Maschera"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Maschera"]').attr("disabled","disabled").val("");
				}

				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(2)').is(':checked')){ // maschera venturi
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Venturi"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Venturi"]').attr("disabled","disabled").val("");
				}

				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(3)').is(':checked')){ // maschera reservoir
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Reservoir"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtO2Reservoir"]').attr("disabled","disabled").val("");
				}

				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(4)').is(':checked')){ //C-PAP
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtCPAP_PEEP"]').attr("disabled","");
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtFiO2"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtCPAP_PEEP"]').attr("disabled","disabled").val("");
					$('form[name="BISOGNO_RESPIRARE"] input[name="txtFiO2"]').attr("disabled","disabled").val("");
				}

				if ($('form[name="BISOGNO_RESPIRARE"] input[name="radO2"]:eq(5)').is(':checked')) {// ventilatore meccanico
					$('form[name="BISOGNO_RESPIRARE"] input[name="radO2Vent"]').attr("disabled","");
				}
				else{
					$('form[name="BISOGNO_RESPIRARE"] input[name="radO2Vent"]').attr("disabled","disabled").attr("checked","");
				}
			}

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