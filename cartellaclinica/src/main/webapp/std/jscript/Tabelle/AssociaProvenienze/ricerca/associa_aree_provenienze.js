function chiudi()
{
		parent.opener.parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_AREE_PROVENIENZE&iden_sala="+parent.RicercaProvenienzeFrame.document.form.iden_sala.value+"&iden_mac="+parent.RicercaProvenienzeFrame.document.form.iden_mac.value+"&iden_area="+parent.RicercaProvenienzeFrame.document.form.iden_area.value);
	
	parent.close();
}

function applica()
{
	var doc = document.form;
	var where_cond = '';
	
	doc.text_ricerca.value = doc.text_ricerca.value.toUpperCase();
	
	where_cond = " where iden not in (select iden_pro from TAB_AREE_PROVENIENZE where iden_sal = '" + doc.iden_sala.value;
	where_cond += "' and iden_mac = '" + doc.iden_mac.value;
	where_cond += "' and iden_are = '" + doc.iden_area.value + "') AND ATTIVO = 'S'";
	
	if(doc.text_ricerca.value != '' && doc.tipo_ricerca[0].checked)
		where_cond += " and descr like '" + doc.text_ricerca.value  + "%'";
	if(doc.text_ricerca.value != '' && doc.tipo_ricerca[1].checked)
		where_cond += " and cod_dec like '" + doc.text_ricerca.value  + "%'";	
	
	if(doc.tipo_ricerca[0].checked)
		doc.order_by.value = ' ORDER BY DESCR';
	if(doc.tipo_ricerca[1].checked)
		doc.order_by.value = ' ORDER BY COD_DEC';
										
	doc.where_condition.value = where_cond;						
	
	/*alert('WHERE CONDITION: ' + doc.where_condition.value);
	alert('ORDER BY: ' + doc.order_by.value);*/
	
	doc.action = 'SL_ProvenienzeDaAssociare';
	doc.target = 'ProvenienzeDaAssociareFrame';
	doc.method = 'POST';
	
	doc.submit();
}

function intercetta_tasti()
{
	if (window.event.keyCode == 13)
		applica();
}


