function intercetta_tasti()
{
	if(window.event.keyCode == 13)
	{
		window.event.keyCode = 0;
		ricerca();
  	}
}

function raddoppia_apici(value){
	var stringa = value.replace(/\'/g, "\'\'");//var stringa = value.replace('\'', '\'\'');
	return stringa;
}

function applica_mg_art(numero_pagina)
{
	var doc = document.form_ric_maga;
	var where_cond = '';
	
	doc.action = 'RisultatiRicerca';
	doc.target = 'RecordMagazzinoFrame';
	doc.method = 'POST';
	
	if(numero_pagina != '')
		doc.pagina_da_vis.value = numero_pagina;
		
	doc.descr_art.value = doc.descr_art.value.toUpperCase();
	doc.cod_bar.value = doc.cod_bar.value.toUpperCase();
	
	doc.descr_art.value = replace_stringa(doc.descr_art.value, "'");
	doc.cod_bar.value   = replace_stringa(doc.cod_bar.value, "'");
	
	if(doc.descr_art.value != '')
		where_cond = "where descr like '" + raddoppia_apici(doc.descr_art.value) + "%'";
	else
		where_cond = "where descr like '%%'";

	if(doc.cod_bar.value != '')
		if(where_cond == '')
			where_cond = "where cod_bar like '" + raddoppia_apici(doc.cod_bar.value) + "%'";
		else
			where_cond += " and cod_bar like '" + raddoppia_apici(doc.cod_bar.value) + "%'";
	
	if(doc.attivo[0].checked)
		where_cond += " and attivo = 'S'";	
	if(doc.attivo[1].checked)
		where_cond += " and attivo = 'N'";		
		
	doc.hidWhere.value = where_cond;
	
	/*if(baseUser.PERSONAL_ORDER_WK == '')
		doc.hidOrder.value = " order by descr";
	else{
		if(baseUser.PERSONAL_ORDER_WK.indexOf("WK_MAGAZZINO_ARTICOLI") == -1)
			doc.hidOrder.value = " order by descr";
	}
	*/

	//alert('TEST: ' + doc.hidWhere.value);
	//alert('TEST: ' + doc.hidOrder.value);
	
	doc.submit();
}

function applica_mg_cau(numero_pagina)
{
	var doc = document.form_ric_maga;
	var where_cond = '';
	if(numero_pagina != '')
		doc.pagina_da_vis.value = numero_pagina;
		
	doc.descr_causali.value = doc.descr_causali.value.toUpperCase();
	doc.descr_causali.value = replace_stringa(doc.descr_causali.value, "'");
	
	if(doc.descr_causali.value != '')
		where_cond = "where descr like '" + raddoppia_apici(doc.descr_causali.value) + "%'";
	else
		where_cond = "where descr like '%%'";
		
	doc.hidWhere.value = where_cond;
	doc.submit();
}

function applica_mg_mag(numero_pagina)
{
	var doc = document.form_ric_maga;
	var where_cond = '';
	if(numero_pagina != '')
		doc.pagina_da_vis.value = numero_pagina;
	doc.descr_maga.value = doc.descr_maga.value.toUpperCase();
	doc.descr_maga.value = replace_stringa(doc.descr_maga.value, "'");
	
	if(doc.descr_maga.value != '')
		where_cond = "where descr like '" + raddoppia_apici(doc.descr_maga.value) + "%'";
	else
		where_cond = "where descr like '%%'";	
		
	doc.hidWhere.value = where_cond;
	doc.submit();
}



function applica_mg_mov(numero_pagina)
{
	var doc = document.form_ric_maga;
	var where_cond = '';
	
	var da_data = document.all.txtDaData.value.substring(6,10) + document.all.txtDaData.value.substring(3,5) + document.all.txtDaData.value.substring(0,2);
	var a_data = document.all.txtAData.value.substring(6,10) + document.all.txtAData.value.substring(3,5) + document.all.txtAData.value.substring(0,2);
	
	if(da_data != '' && a_data != '' && da_data > a_data)
	{
		alert('Attenzione:il filtro A DATA è antecedente al filtro DA DATA.La ricerca non verrà effettuata');
		return;
	}
	
	if(numero_pagina != '')
		doc.pagina_da_vis.value = numero_pagina;
	
	doc.descr_mov_art.value = doc.descr_mov_art.value.toUpperCase();
	doc.codice_mov_barre.value = doc.codice_mov_barre.value.toUpperCase();
	doc.lotto_mov.value = doc.lotto_mov.value.toUpperCase();
	
	doc.descr_mov_art.value = replace_stringa(doc.descr_mov_art.value, "'");
	doc.codice_mov_barre.value = replace_stringa(doc.codice_mov_barre.value, "'");
	doc.lotto_mov.value = replace_stringa(doc.lotto_mov.value, "'");
	
	if(doc.descr_mov_art.value != '')
		where_cond = "where descr_art like '" + raddoppia_apici(doc.descr_mov_art.value) + "%'";
	else
		where_cond = "where descr_art like '%%'";	
		
	if(doc.codice_mov_barre.value != '')
		if(where_cond == '')
			where_cond = "where cod_bar like '" + raddoppia_apici(doc.codice_mov_barre.value) + "%'";		
		else
			where_cond += " and cod_bar like '" + raddoppia_apici(doc.codice_mov_barre.value) + "%'";		

	if(doc.lotto_mov.value != '')
		if(where_cond == '')
			where_cond = "where cod_lotto like '" + raddoppia_apici(doc.lotto_mov.value) + "%'";		
		else
			where_cond += " and cod_lotto like '" + raddoppia_apici(doc.lotto_mov.value) + "%'";	
			
	if(doc.magazzino_attivo.value != '')
		if(where_cond == '')
			where_cond = "where iden_magazzino like '" + raddoppia_apici(doc.magazzino_attivo.value) + "'";		
		else
			where_cond += " and iden_magazzino like '" + raddoppia_apici(doc.magazzino_attivo.value) + "'";			
			
	if(doc.txtDaData.value != '')
		if(where_cond == '')
			where_cond = "where dat_mov >= '" + doc.txtDaData.value.substring(6,10)+doc.txtDaData.value.substring(3,5)+doc.txtDaData.value.substring(0,2)+ "'";		
		else
			where_cond += " and dat_mov >= '" + doc.txtDaData.value.substring(6,10)+doc.txtDaData.value.substring(3,5)+doc.txtDaData.value.substring(0,2)+ "'";		
	if(doc.txtAData.value != '')
		if(where_cond == '')
			where_cond = "where dat_mov <= '" + doc.txtAData.value.substring(6,10)+doc.txtAData.value.substring(3,5)+doc.txtAData.value.substring(0,2) + "'";		
		else
			where_cond += " and dat_mov <= '" + doc.txtAData.value.substring(6,10)+doc.txtAData.value.substring(3,5)+doc.txtAData.value.substring(0,2) + "'";	
			
	
		
	doc.hidWhere.value = where_cond;
	
	doc.submit();
}


/**
*/
function gestioneCalendario(){
	jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});
	jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	
}