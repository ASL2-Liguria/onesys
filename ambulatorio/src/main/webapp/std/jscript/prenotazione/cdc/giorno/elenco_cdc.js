// modifica 18-4-16
$(function(){
	try{
		var targetCdc = "";		
		try{initbaseUser();}catch(e){;}
		var objCaller =  window.parent.parent.parent.parent.objCaller;		
		var caller ;
		try{caller = objCaller.caller;}catch(e){caller="";}
		if ((caller=="undefined")||(typeof(caller)=="undefined")){
			caller = "";
		}
		if (caller!=""){
//			targetCdc = $("#oTable label").first().html();			
			var listaParametri =objCaller.url.split("?")[1].split("&");
			for (var z=0;z<listaParametri.length;z++){
				if (listaParametri[z].substr(0, 4).toUpperCase()=="HCDC"){
					targetCdc = listaParametri[z].split("=")[1].split("@")[0];
					break;
				}
			}
			// faccio altri controlli
			var listaCdcUtente = baseUser.LISTAREPARTI;
			var bolFound = false;
			for (var z=0;z<listaCdcUtente.length;z++){
				if (targetCdc==listaCdcUtente[z]){
					bolFound = true;
					break;
				}
				if (bolFound){break;}
			}
			if (bolFound){
				// uno dei cdc dell'utente e' di cardiologia
				window.parent.parent.parent.frameOpzioni.creaCheckPostiOccupati();
			}
		} // fine controllo se arrivo da esterno
	}
	catch(e){
		alert("ElencoCdc ready - " + e.description);
	}
});
// **********

function deselAll()
{
	var i;
	for(i=0; i<parent.frames.length; i++)
	{
		if(parent.frames[i].document.elenco.indice.value != '')
		{
			parent.frames[i].illumina(parseInt(parent.frames[i].document.elenco.indice.value));
			parent.frames[i].document.elenco.indice.value = '';
		}
	}
}

function visualizza_dettaglio(id_aree, id_imp, id_esa, idx_esa, data)
{
	if(id_aree != null && id_aree != '' && id_esa !=null && id_esa != '')//&& id_imp != null && id_imp != '')
	{
		initbaseUser();
		initbasePC();
		
		parent.parent.parent.frameElenco.prenDWRClient.libera_tutto('S*' + baseUser.IDEN_PER + '*' + basePC.IP);
		
		parent.parent.parent.frameDettaglio.document.location.replace('prenotazioneDettaglio?id_imp=' + id_imp + '&id_aree=' + id_aree + '&id_esame=' + id_esa + '&idx_esame=' + idx_esa + '&Hdata=' + data);
	}
}