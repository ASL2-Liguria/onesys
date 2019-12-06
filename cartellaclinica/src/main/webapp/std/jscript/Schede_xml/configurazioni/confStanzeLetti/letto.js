jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
	LETTO.init();
});



var LETTO = {
	
	init: function(){
				
		//modifica
		if (document.EXTERN.KEY_ID.value!='0'){
			var rs = WindowCartella.executeQuery("CCE_gestioneAllettamento.xml","gestioneStanze.getDatiLetto",[document.EXTERN.KEY_ID.value]);
			if(rs.next()){
				$("#txtNome").val(rs.getString("DESCR_LETTO"));
				$("#txtNote").val(rs.getString("NOTE"));
				$("INPUT[name=radAttivo][value="+rs.getString("ATTIVO")+"]").attr('checked','checked');
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

		
		if(			
		$("#txtNome").val()=='' ||
		$("#txtNote").val()=='')
		{alert('Attenzione, inserire un valore in tutti in campi'); return;}	
		
		pBinds.push(document.EXTERN.KEY_ID.value);
		pBinds.push($("#txtNome").val());
		pBinds.push($("#txtNote").val());
		pBinds.push($("INPUT[name=radAttivo]:checked").val());
		
		
		pBinds.push(document.EXTERN.IDEN_STANZA.value);
		pBinds.push(document.EXTERN.GRUPPO.value);
			
		

	    var resp=WindowCartella.executeStatement('CCE_gestioneAllettamento.xml','gestioneStanze.salvaLetto',pBinds,1);

	    if (resp[0]=="OK"){
	    	if(resp[2]!=' '){
	    		alert(resp[2]);
	    	}
	    	else{
	    		LETTO.chiudi();
	    		$('iframe#frameLetti',parent.document)[0].contentWindow.location.reload();
	    	}
	    } else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
};