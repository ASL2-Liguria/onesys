function controllo_num_nos()
{
	if(document.form_pag_ric.NUM_NOSOLOGICO.value == '')
	{
		alert(ritornaJsMsg('alert_num_nos'));
		if(document.getElementById('div').style.display != 'none')
			document.form_pag_ric.NUM_NOSOLOGICO.focus();
		document.form_pag_ric.NUM_NOSOLOGICO.value = '';
		return;
	}
	else
	{
		document.form_pag_ric.NUM_NOSOLOGICO.value = replace_stringa(document.form_pag_ric.NUM_NOSOLOGICO.value, "'");
		
		document.form_pag_ric.NUM_NOSOLOGICO.value = trim(document.form_pag_ric.NUM_NOSOLOGICO.value);
		

		document.form_pag_ric.hidWhere.value = "where ID_ANAG_REMOTO like '" + raddoppia_apici(document.form_pag_ric.NUM_NOSOLOGICO.value) + "'";
		
		
		
		
		document.form_pag_ric.submit();
	}
}