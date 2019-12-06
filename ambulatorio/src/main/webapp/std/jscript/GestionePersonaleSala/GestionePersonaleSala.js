function finestra_popup_persal(tipo_per, reparto) {
	document.getElementById('frmTabPerSal').SELECTED_TIPO_PER.value=tipo_per;
	var tipo = new String(tipo_per).substring(0,1);
	tipo = tipo == 'A' ? 'M' : tipo;
	var myWhere = "TIPO='" + tipo + "'";
	if (tipo == 'M') {
		myWhere = myWhere + " and TIPO_MED=";

		switch (tipo_per) {
		case 'ANE':
			myWhere = myWhere + "'A'";	
			break;
		case 'MEDE2':
			myWhere = myWhere + "'S'";
			break;
		default:
			myWhere = myWhere + "'R'";
		}
	}
	finestra_popup(document.getElementById('DESCR_' + tipo_per).value, 'GESTIONE_TAB_PER_SAL', myWhere, '', reparto, 'S', '');
}

function aggiorna_dati() {
	var tipo_per = document.getElementById('frmTabPerSal').SELECTED_TIPO_PER.value;
	document.getElementById('DESCR_' + tipo_per).value = document.getElementById('SELECTED_DESCR').value;
	document.getElementById('IDEN_' + tipo_per).value = document.getElementById('SELECTED_IDEN').value;
}

function chiudi() {
	window.close();
}

function registra() {
	var f = document.getElementById('frmTabPerSal');
	var l = f.getElementsByTagName('INPUT');
	var b = true;
	for (x=1; x<(l.length-7); x=x+4) {
		if (l[x].value == null || l[x].value == '') {
			b = false;
			break;
		}
	}
	if (b)
		f.submit();
	else
		alert('Tutti i campi devono essere compilati.');
}

function check_if_nulled(descrizione, iden_tipo) {
	if(descrizione == null || descrizione.replace(" ", "")=="")
		document.getElementById(iden_tipo).value=null;
}

function reset() {
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i < inputs.length; i++) {
		if (inputs[i].name != "IDEN_SAL")
			inputs[i].value = "";
	}
}