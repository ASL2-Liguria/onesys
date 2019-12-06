function selectLettera(check){
	var iden_lettera = $(check).parent().attr('iden_lettera');
	if ($(check).attr('checked')==true) {
		$('tr[iden_lettera='+iden_lettera+']').addClass('selected').find('input[type=checkbox]').attr('checked',true);
		
	} else {
		$('tr[iden_lettera='+iden_lettera+']').removeClass('selected').find('input[type=checkbox]').attr('checked',false);
		
	}
}

function selectRow(check){
	if ($(check).attr('checked')==true) {
		$(check).closest('tr').addClass('selected');
	} else {
		$(check).closest('tr').removeClass('selected');
	}
}

function aggiungiTerapie() {
	if($('tr.selected').length==0)
		return alert('Nessuna terapia selezionata');
	$('tr.selected').each(function(){
		var td =  $(this).find('td');
		var farmaco =td[1].innerText;
		var iden = td[1].iden_far;
		var cod_dec = td[1].cod_dec;
		var id_sos = td[1].id_sos;
		var pCiclo =td[0].checked?td[0].checked:'';
		var dose = td.find('input')[0].value;
		var durata = td.find('input')[1].value;
		var scatole = td.find('input')[2].value;
		var categoria = td[5].innerText;
		parent.nuovaTerapia(farmaco, iden, pCiclo, cod_dec, id_sos,dose,durata,scatole,categoria,window);
	});
	parent.$.fancybox.close();
}

function sostituisciTerapie() {
	if($('tr.selected').length==0)
		return alert('Nessuna terapia selezionata');
	parent.$("tr#initTr").nextUntil("tr#nuoveTerapieTr").remove();
	parent.$("tr#nuoveTerapieTr").nextUntil("tr#finalTr").remove();
	aggiungiTerapie();
}

