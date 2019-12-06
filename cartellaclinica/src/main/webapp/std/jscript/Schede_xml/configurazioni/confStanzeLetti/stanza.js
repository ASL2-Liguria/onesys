jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
	STANZA.init();
});



var STANZA = {
	
	init: function(){
				
		//modifica
		if (document.EXTERN.KEY_ID.value!='0'){
			var rs = WindowCartella.executeQuery("CCE_gestioneAllettamento.xml","gestioneStanze.getDatiStanza",[document.EXTERN.KEY_ID.value]);
			if(rs.next()){
				$("#txtNome").val(rs.getString("DESCR_STANZA"));
				$("#txtCodice").val(rs.getString("COD_STANZA"));
				$("SELECT[name=cmbTipo]").val(rs.getString("TIPO_STANZA"));
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
		$("#txtCodice").val()=='' ||
		$("SELECT[name=cmbTipo]").val()=='')
		{alert('Attenzione, inserire un valore in tutti in campi'); return;}	
		
		pBinds.push(document.EXTERN.KEY_ID.value);
		pBinds.push($("#txtNome").val());
		pBinds.push($("#txtCodice").val());
		pBinds.push($("SELECT[name=cmbTipo]").val());
		pBinds.push(document.EXTERN.GRUPPO.value);
		pBinds.push($("INPUT[name=radAttivo]:checked").val());
			

	    var resp=WindowCartella.executeStatement('CCE_gestioneAllettamento.xml','gestioneStanze.salvaStanza',pBinds,1);

	    if (resp[0]=="OK"){
	    	if(resp[2]!=' '){
	    		alert(resp[2]);
	    	}
	    	else{
	    		STANZA.chiudi();
	    		$('iframe#frameStanze',parent.document)[0].contentWindow.location.reload();
	    	}
	    } else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
};