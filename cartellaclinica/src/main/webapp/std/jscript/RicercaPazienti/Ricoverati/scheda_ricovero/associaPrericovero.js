function associaPrericovero(){
	if(stringa_codici(array_iden)) {
		document.getElementById('hIdenPrericovero').value=stringa_codici(array_iden);
		registra();
	} else {
		alert('Selezionare un prericovero');
	}
}

function chiudiFinestra() {
	parent.CartellaPaziente.load(
		{iden_visita:parent.datiIniziali.iden_visita,iden_ricovero:parent.datiIniziali.iden_ricovero,ModalitaAccesso:'MODIFICA'}
	);
	parent.$.fancybox.close();
}