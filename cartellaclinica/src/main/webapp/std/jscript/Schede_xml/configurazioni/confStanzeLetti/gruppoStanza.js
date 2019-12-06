jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
	GRUPPO_STANZA.init();
});



var GRUPPO_STANZA = {
	
	init: function(){
				
		//modifica
		if (document.EXTERN.KEY_ID.value!='0'){

			var rs = WindowCartella.executeQuery("CCE_gestioneAllettamento.xml","gestioneStanze.getDatiGruppo",[document.EXTERN.KEY_ID.value]);
			if(rs.next()){
				$("#txtNome").val(rs.getString("DESCR"));
			}
		}
		//inserimento
		else
			{
			$("INPUT[name=radAttivo][value=S]").attr('checked','checked');
			}
	},
	
	setEvents:function(){
		
	},
	
	salva: function(){
		var pBinds = new Array();
		var strReparti='';

		
		if(			
		$("#txtNome").val()=='' ||
		$("SELECT[name=elencoSelezionati]").is(":empty"))
		{alert('Attenzione, inserire descrizione e almeno un reparto associato'); return;}	
		
		pBinds.push(document.EXTERN.KEY_ID.value);
		pBinds.push($("#txtNome").val());
		
		$('SELECT[name=elencoSelezionati] option').each(function(){ 
			if(strReparti!=''){strReparti+=','}
				strReparti+=this.value;
		});  
		
		pBinds.push(strReparti);
		pBinds.push(baseUser.IDEN_PER);
			

	    var resp=WindowCartella.executeStatement('CCE_gestioneAllettamento.xml','gestioneStanze.salvaGruppo',pBinds,0);

	    if (resp[0]=="OK"){
	    		GRUPPO_STANZA.chiudi();
	    		$('iframe#frameGruppi',parent.document)[0].contentWindow.location.reload();
	    } else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
};