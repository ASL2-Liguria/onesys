jQuery(document).ready(function(){
	window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    CONF_ALBERI.init();

});

var CONF_ALBERI = {
    tipoConf:'',
	init: function(){
		$("#txtArea").attr('wrap','off').css('marginBottom','10px');
		$("#txtArea").parent().prepend('<DIV id=divInt><DIV>');
		
		
		 $('SELECT[name=cmbRami]').css({'float':'left'}).parent().append($('<div id=buttonCopia class="pulsante"></div>').attr("title","Copia ramo negli appunti"));
		 $('#buttonCopia').css({'float':'left'}).append('<A href="javascript:CONF_ALBERI.copia();">Copia negli appunti</A>');
		 
		CONF_ALBERI.setEvents();
	},
	
	setEvents:function(){
		
		$('select[name=cmbTipo]').change(function() {
			  if(this.value==''){$("#txtArea").val('');return;}
			  CONF_ALBERI.caricaAlbero(document.EXTERN.REPARTO.value,this.value);
			});
		
	},
	
	copia : function(){
		var rs = WindowCartella.executeQuery("configurazioni/confAlberi.xml","getRamo",[$('select[name=cmbRami]').val()]);
		if(rs.next()){
			window.clipboardData.setData("Text",rs.getString("RAMO"));
		}
		  
	},
	
	caricaAlbero : function(reparto,tipo) {
		
	 var resp=WindowCartella.executeStatement('configurazioni/confAlberi.xml','getAlbero',[reparto,tipo],2);

	    if (resp[0]=="OK"){
	    	CONF_ALBERI.tipoConf=resp[3];
	    	
	    	switch(CONF_ALBERI.tipoConf){
	    	case 'REPARTO':
	    		$('#divInt').html('Albero del reparto di:'+reparto).css('background-color','#7CCC88');
	    		break;
	    	case 'STRUTTURA':
	    		alert('Attenzione, questo reparto non ha un albero specifico e utilizza la configurazione base della struttura a cui appartiene');
	    		$('#divInt').html('Albero generico della struttura a cui appartiene il reparto di:'+reparto).css('background-color','#FC2845');
	    		break;
	    	case 'SITO':
	    		alert('Attenzione, questo reparto non ha un albero specifico e la struttura a cui appartiene non ha un albero configurato. Viene utilizzato l\'albero base');
	    		$('#divInt').html('Albero generico').css('background-color','#FC2845');
	    		break;
	    	default:	
	    		alert('Attenzione, non è stata trovata una configurazione per questo tipo di albero');
	    	}
	    	
	    		    	
	    	$("#txtArea").val(resp[2]);
	    	}
	    else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	},
	registra:function(){
		if(CONF_ALBERI.tipoConf!='REPARTO'){
			if (confirm('Attenzione, la configurazione non è relativa allo specifico reparto, modificandola altri reparti potrebbero risentire del cambiamento. Creare un albero per il reparto di '+document.EXTERN.REPARTO.value+'?')){
				CONF_ALBERI.tipoConf='REPARTO';
			}
		}
		
		
	    var resp=WindowCartella.executeStatement('configurazioni/confAlberi.xml','registraAlbero',[$("#txtArea").val(),document.EXTERN.REPARTO.value,$('select[name=cmbTipo]').val(),CONF_ALBERI.tipoConf],0);

	    if (resp[0]=="OK"){
	    		CONF_ALBERI.chiudi();
	    	}
	    else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
		
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
	
};