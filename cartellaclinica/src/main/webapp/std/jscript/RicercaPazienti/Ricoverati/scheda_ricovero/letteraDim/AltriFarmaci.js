function chiudi() {
//	self.close();
	parent.$.fancybox.close();
}

function registraFarmaco() {
	if (old_selezionato==-1) {
		alert('Selezionare un farmaco');
		return;
	}
	var farmaco = document.getElementsByTagName('tr')[old_selezionato+2].getElementsByTagName('td')[0].innerText;
	var iden_far = stringa_codici(array_iden_farmaco);
	var cod_dec = stringa_codici(array_cod_dec);
	parent.sostituisciFarmaco(farmaco, iden_far, cod_dec);
	chiudi();
}

function checkFarmaci() {
	if(document.all.oTable.rows.length==0) {
		alert('Non sono presenti farmaci sostitutivi dispensabili dalla farmacia per il primo ciclo');
		chiudi();
	}
}