var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	try{
		BISOGNO_ALIMENTARSI.init();	
		BISOGNO_AMBIENTE_SICURO.init();	
		BISOGNO_CARDIOCIRCOLATORIA.init();	
		BISOGNO_COMUNICARE.init();	
		BISOGNO_ELIMINAZIONE_URINARIA.init();	
		BISOGNO_IGIENE.init();	
		BISOGNO_MOVIMENTO.init();	
		BISOGNO_RESPIRARE.init();	
		BISOGNO_RIPOSO.init();	
		
		SINTESI_BISOGNI.init();
	
		BISOGNO_ALIMENTARSI.setEvents();
		BISOGNO_AMBIENTE_SICURO.setEvents();
		BISOGNO_CARDIOCIRCOLATORIA.setEvents();
		BISOGNO_COMUNICARE.setEvents();
		BISOGNO_ELIMINAZIONE_URINARIA.setEvents();
		BISOGNO_IGIENE.setEvents();
		BISOGNO_MOVIMENTO.setEvents();
		BISOGNO_RESPIRARE.setEvents();
		BISOGNO_RIPOSO.setEvents();
		
		SINTESI_BISOGNI.setEvents();
	}catch(e){
		alert(e.description);
	}
	try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
});

var SINTESI_BISOGNI ={
	
	init:function(){
				
		if(WindowCartella.ModalitaCartella.isReadonly(document)){
			$('#lblRegistra').parent().hide();
		}
		
		if(!WindowCartella.ModalitaCartella.isStampabile(document)){
			$('#lblStampa').parent().hide();
		}		
		
		$('form[name="BISOGNO_ALIMENTARSI"] input[name="FUNZIONE"]').val("BISOGNO_ALIMENTARSI");
		$('form[name="BISOGNO_AMBIENTE_SICURO"] input[name="FUNZIONE"]').val("BISOGNO_AMBIENTE_SICURO");
		$('form[name="BISOGNO_CARDIOCIRCOLATORIA"] input[name="FUNZIONE"]').val("BISOGNO_CARDIOCIRCOLATORIA");
		$('form[name="BISOGNO_COMUNICARE"] input[name="FUNZIONE"]').val("BISOGNO_COMUNICARE");
		$('form[name="BISOGNO_ELIMINAZIONE_URINARIA"] input[name="FUNZIONE"]').val("BISOGNO_ELIMINAZIONE_URINARIA");
		$('form[name="BISOGNO_IGIENE"] input[name="FUNZIONE"]').val("BISOGNO_IGIENE");
		$('form[name="BISOGNO_MOVIMENTO"] input[name="FUNZIONE"]').val("BISOGNO_MOVIMENTO");
		$('form[name="BISOGNO_RESPIRARE"] input[name="FUNZIONE"]').val("BISOGNO_RESPIRARE");
		$('form[name="BISOGNO_RIPOSO"] input[name="FUNZIONE"]').val("BISOGNO_RIPOSO");
		
		$('form[name="EDUCAZIONE_SANITARIA"] input[name="FUNZIONE"]').val("EDUCAZIONE_SANITARIA");
		
		$('input[name="IDEN_VISITA_REGISTRAZIONE"]').val($('form[name="EXTERN"] input[name="IDEN_VISITA_REGISTRAZIONE"]').val());											
	},
	
	setEvents:function(){
		//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
		$('form[name="EDUCAZIONE_SANITARIA"]').click(function(){
			$(this).attr("edited","edited");			
		});
	}
};