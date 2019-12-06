function chiudi(pagina_da_vis)
{
	var pagina = 1;
	if(pagina_da_vis != 1)
		pagina = opener.document.form_ric_maga.pagina_da_vis.value;
	opener.parent.RicercaMagazzinoFrame.ricerca(pagina);
	self.close();
}
         
function chiudi_ins_mod()
{
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.descr_causali.value = document.form_mg_cau.descr.value;
	chiudi(1);
}

function registra()
{
	var doc = document.form_mg_cau;
	var mancano = '';
	
	if(doc.tipologia[0].checked == 1)
		doc.htipologia.value = 'C';
	if(doc.tipologia[1].checked == 1)
		doc.htipologia.value = 'S';
	
	
	if(doc.descr.value == '' || doc.htipologia.value == '')
	{
		if(doc.descr.value == '')
		{
			/*alert(ritornaJsMsg('empty_value_descr'));
			doc.descr.focus();
			return;*/
			mancano = '- DESCRIZIONE\n';
		 }
		
		if(doc.htipologia.value == '')
		{
			/*alert(ritornaJsMsg('empty_value_tipologia'));
			return;*/
			mancano += '- TIPOLOGIA';
		}
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	doc.nome_campi.value = 'descr*tip_cau';
	doc.request.value = 'descr*htipologia';
	doc.tipo_campo_db.value = 'S*S';
	doc.submit();
	
	alert(ritornaJsMsg('registrazione'));//Registrazione effettuata
	
	chiudi_ins_mod();
}