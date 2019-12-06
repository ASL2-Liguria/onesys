var records_del='';

jQuery(document).ready(function()
		{
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    SCHEDA_PAZ.init();
		});

var SCHEDA_PAZ = {
		
		init: function(){
			try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	        var maxLength = 4000;
	        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
	        $('textarea').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
	            maxlength(this, maxLength, msg);
	        });

	        $("textarea[class*=expand]").TextAreaExpander();
	        
	        
	        
	        $('#divProgrCommento,#divDiagnosiAcc,#divaffezioniConc,#divstadio,#divrecettoriOrm,#divparametriVal,#divindirTerap').prepend('<hr>');
	        
	        $('LABEL[name="lblElimina"]').parent().width('50px');
	        
	       //disabilita righe inserite da un utente diverso da quello loggato 
	        $('tr[uteIns!="'+baseUser.IDEN_PER+'"][uteIns!=""]').each(function(){
	        	$(this).find('TD').addClass('disabled');
	        	$(this).find('TEXTAREA').attr("disabled", "disabled");
	        });	
        
	        //disabilita il tasto elimina nelle righe di utenti diversi da quello loggato e da quella per il nuovo inserimento
	        $('tr[uteIns!="'+baseUser.IDEN_PER+'"],[uteIns=""]').each(function(){
		        	$(this).find('TD').addClass('disabled').find('LABEL[name="lblElimina"]').removeClass('butt_elimina');
	        })	
	        
	        //abilita la cancellazione per le righe inserite dall'utente loggato
	        $('tr[uteIns="'+baseUser.IDEN_PER+'"]').each(function(){
             $(this).find('LABEL[name="lblElimina"]').click(function() {
               if (confirm("Attenzione, confermare la cancellazione?")){
            	   if(records_del==''){records_del=$(this).parent().parent().attr('iden')}else{records_del+=','+$(this).parent().parent().attr('iden')}
            	   $(this).parent().parent().remove();
               }
            });
	        });
		},
		
		
		registra : function() {
			var dati='';
	
			$('tr[uteIns="'+baseUser.IDEN_PER+'"],tr[uteIns=""]').each(function(){
				if(dati!=''){dati+=','}
				dati+=$(this).attr('iden');
				dati+='$'+$(this).find('TEXTAREA').attr('id');				
			})
			//aggiungo a pagina campo nascosto con dati reperibili tramite xml nella funzione oracle di salvataggio
			$('input[name="PAGINA"]').after('<input type="hidden" name="RECORDS_OUTPUT" id="RECORDS_OUTPUT" value="'+dati+'"/>');
			$('input[name="PAGINA"]').after('<input type="hidden" name="RECORDS_DELETED" id="RECORDS_DELETED" value="'+records_del+'"/>');
			registra();
		}
	
}