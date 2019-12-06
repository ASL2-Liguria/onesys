function cercaRemoti(){
	try{
		document.frmAggiorna.cod_server_remoto.value = getValue("idComboRis");
		document.frmAggiorna.filtri_remoti.value = getValue("idComboMetodiche") + "@" + document.getElementById("idDaData").value;
		document.frmAggiorna.submit();
	}
	catch(e){
		alert("cercaRemoti - Error:" + e.description);
	}
}

function resetDaData(){
	try{
		document.getElementById("idDaData").value = "";
	}
	catch(e){
		alert("resetDaData - Error:" + e.description);	
	}
}

function refreshDati(){
	try{
		
	}
	catch(e){
		alert("refreshDati - Error: "+ e.description);
	}
}