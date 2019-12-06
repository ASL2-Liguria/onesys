function ricerca()
{
	var doc = document.form;
	var where_condition = '';
	
	if(doc.txtDaData.value == '' && doc.txtAData.value == '')
	{
		where_condition = ' where iden_ref = -1';
	}
	else
	{
		where_condition = " where (data_esame >= '" + doc.txtDaData.value;
		where_condition += "' and data_esame <= '" + doc.txtAData.value;
		where_condition += "') and refertato = '1' and pdf_firmato_creato = 'N'";
	}
	
	doc.action = 'SL_FirmaDigitaleMultiplaWorklist';
	doc.target = 'Worklist';
	doc.method = 'POST';
	
	doc.hidOrder.value = ' order by data_esame desc';
	
	doc.namecontextmenu.value = 'firma_digitale_multipla';
	doc.tipowk.value = 'WK_FIRMA_DIGITALE_MULTIPLA';
	
	doc.hidWhere.value = where_condition;
	
	//alert('WHERE CONDITION: ' + doc.hidWhere.value);
	
	doc.submit();
}

function riposiziona_frame_righe()
{
	
}