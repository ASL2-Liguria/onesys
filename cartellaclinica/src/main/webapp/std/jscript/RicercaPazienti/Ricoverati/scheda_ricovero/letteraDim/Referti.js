function visualizza_testo_referto(){
	if (old_selezionato==-1) {
		return alert('Selezionare un esame');
	}
	var testo_referto = stringa_codici(array_testo_referto);
	showDialog('Visualizza Referto',testo_referto,'success');
}


function copia_referto(param) {
	var rowIndex = $(event.srcElement).closest('tr').prevAll().length;
	var testoDaCopiare = "";
	if (param.data == true) {
		testoDaCopiare += array_data_referto[rowIndex] + " - ";
	}
	testoDaCopiare += array_testo_referto[rowIndex];
	
	if (testoDaCopiare=='') {
		alert('Referto non presente');	
	} else {
		window.clipboardData.setData("Text", testoDaCopiare);
		alert('Testo del referto copiato negli appunti');		
	}
}

function checkReferti() {
	if(document.all.oTable.rows.length==0) {
		alert('Non sono presenti esami radiologici del paziente eseguiti durante il periodo di ricovero');
	}
}