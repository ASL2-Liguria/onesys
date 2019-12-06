function visualizza_quesiti(id)
{
	var sql = 'select QUESITO_CLINICO, QUADRO_CLINICO from CRONOLOGIA_ESAMI_QUESITI where IDEN = ' + id;
	
	dwr.engine.setAsync(false);
	
	toolKitDB.getResultData(sql, popola_text);
	
	dwr.engine.setAsync(true);
}

function popola_text(elenco)
{
	if(elenco.length > 1)
	{
		document.dati.txtQuesiti.value = elenco[0];
		document.dati.txtQuardo.value = elenco[1];
	}
}