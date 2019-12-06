// carica il progr
function caricaInfoReferto(){
	var progr_selezionato="";
	//carico info referto
	try{
		progr_selezionato= stringa_codici(array_progr);
		if (progr_selezionato.toString()!=""){
			document.frmInfoReferto.progr.value = progr_selezionato;
			document.frmTabulator.progr.value = progr_selezionato;		
		}
		else{
			// sono allo startup
			// nessun selezionato quindi 
			// simulo selezione del primo
			if (array_iden_ref.length>0){
				// seleziono il primo
				illumina(0);
				progr_selezionato= stringa_codici(array_progr);
				document.frmInfoReferto.progr.value = progr_selezionato;
				document.frmTabulator.progr.value = progr_selezionato;
			}
		}
		// cmq faccio la submit
		document.frmInfoReferto.submit();
	}
	catch(e){
		alert("caricaInfoReferto - Error:  "+ e.description);
	}
}
