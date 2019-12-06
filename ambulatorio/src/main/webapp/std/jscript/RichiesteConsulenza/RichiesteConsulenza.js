function warning_emergenza() {
	alert('Si raccomanda di contattare il servizio tramite telefonata');
}

function registra_callback(id) {
//	window.location.reload();
	if (document.getElementById('URGENTE_' + id).value == 3)
		warning_emergenza();
	opener.aggiorna();
	self.close();
}

function annulla_callback() {
	window.location.reload();
}

function chiudi() {
	self.close();
}

function nuova_callback(x) {
	document.getElementById('START').innerHTML=x;
}