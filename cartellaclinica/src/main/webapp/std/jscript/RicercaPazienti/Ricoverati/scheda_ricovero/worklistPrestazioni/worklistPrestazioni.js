var WindowCartella = null;

$(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
});
	

var WORKLIST_PRESTAZIONI = {

	apriDoc:function(){
	
	var iden_ref = stringa_codici(ar_iden_ref);
	var firmato = stringa_codici(ar_firmato);
	
	if (firmato==''){
		alert('Attenzione, referto non presente o non ancora firmato');
		return;
	}
	var vRs = WindowCartella.executeQuery("worklistPrestazioni.xml","getIdDocumento",[iden_ref]);
	
	var idDoc="";
	while(vRs.next()) {
		idDoc = vRs.getString("id_repository");
	}
	if (idDoc=="") {
		alert("Referto non trovato");
	} else {
		url = "servletGenerator?KEY_LEGAME=VISDOC&idDocumento="+idDoc+"&btnChiudi=S&reparto="+baseUser.LISTAREPARTIUTENTECODDEC[0];	
		window.open (url,'','fullscreen=yes, scrollbars=no');
	}	
	
	},
	
	apriTestoReferto: function() {
		//var firmato;
		var iden_ref;

		//firmato = stringa_codici(ar_firmato);
		iden_ref = stringa_codici(ar_iden_ref);
		
		/*if (firmato =='N' || firmato=='')
		{
			alert("Esame non selezionato o referto non firmato");			
		}*/
		//alert(iden_ref);
		if(iden_ref == '' || iden_ref == '-1'){
			alert('Attenzione, referto non presente');
		}
		else
		{
			var rs = WindowCartella.executeStatement("worklistPrestazioni.xml","getTestoReferto",[iden_ref],1);
		    if(rs[0]=='KO'){
		        return alert(rs[0] + '\n' + rs[1]);
		    }else{
		    	showDialog('Visualizza Referto',rs[2],'success');
		    }

		}

	}
	
}