var WindowCartella = null;
var albero='';
var keyAlbero='';
var controllo = 0; //variabile che permette di aprire e chiudere l'albero. Guardare funzione divACR()

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	MODULO_RICHIESTA_ESENZIONE.init();
	MODULO_RICHIESTA_ESENZIONE.setEvents();
	
});

var MODULO_RICHIESTA_ESENZIONE = {
		
	init : function(){
	    try {
	        WindowCartella.utilMostraBoxAttesa(false);
	    } catch (e) {
	        /*catch nel caso non venga aperta dalla cartella*/
	    }
	    
        if (_STATO_PAGINA == 'L') {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
            $('#lnkPatologie').parent().attr('disabled', 'disabled');
        }
	    
	    
		try{$('#lblAlbero').css("width", "700 px");	}catch(e){}
		keyAlbero=WindowCartella.baseReparti.getValue(WindowCartella.getAccesso("COD_CDC"),'ALBERO_MODULO_RICHIESTA_ESENZIONE');
	},
	
	setEvents: function() {
		
		$("SELECT[name='PatologieElenco']").dblclick(function () {			 
			$(this).find('option[value='+$(this).val()+']').remove();
			})
		
	},
	
    chiudiModulo: function() {
        WindowCartella.$.fancybox.close();
    },
    
    regOK: function() {
        $('iframe#frameWork', parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();
        MODULO_RICHIESTA_ESENZIONE.chiudiModulo();
    },
	
	rispostaAlbero : function(obj){
		if($("SELECT[name='PatologieElenco'] option[value='"+obj.codice+"']").length > 0){
			albero.hide();
			return;
		}
		$('SELECT[name=PatologieElenco]').append('<option value='+obj.codice+'>'+obj.descrizione+'</option>');
		albero.hide();
	},
	
	registra : function(){
		
		var patologie='';
		$('#hGruppoAlbero').val(keyAlbero);
		$("SELECT[name=PatologieElenco] option").each(function()
			{
			    if(patologie!=''){patologie+=','}
				patologie+=$(this).val();
			});
		$('#hPatologie').val(patologie);
		
		$("#Gruppo_RICHIESTA_ESENZIONE_CARDIO").remove();
		registra();
	}
	
};

//function che carica il div dell'albero all'interno del group layer
function divACR(){
	//albero da creare
	if (controllo == 0){
		try{
			albero = NS_CascadeTree.append('#groupHeader',{gruppo:keyAlbero,abilita_ricerca_descrizione:'S',abilita_ricerca_codice:'N',onSelection:MODULO_RICHIESTA_ESENZIONE.rispostaAlbero,CreaNascosto:'N'});
			controllo=1;
		}catch(e){
			alert(e.description);
		}
	
	//albero da nascondere
	}else if(controllo == 1){
		
		albero.hide();
		controllo=2;
	
	//albero da mostrare
	}else if(controllo == 2){
		
		albero.show();
		controllo=1;
	}
}




