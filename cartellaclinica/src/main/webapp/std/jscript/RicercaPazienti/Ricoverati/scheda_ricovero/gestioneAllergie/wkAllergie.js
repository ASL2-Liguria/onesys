function inserisci(tipo)
{
	document.formWkAllergie.inserisci.value=tipo;
	document.formWkAllergie.submit();
}
function salvaTutto()
{
	var valoriRiga = '';
	var request = '';
	arRow = document.all.oTable.rows;
	for (i=1;i<arRow.length;i++)
	{
		iden = arRow[i].id;
		superato = arRow[i].cells[0].superato;
		testo = arRow[i].cells[2].firstChild.value;
		cmbTipo = arRow[i].cells[3].firstChild;
		valTipo = cmbTipo.options[cmbTipo.selectedIndex].value;
		cmbSint = arRow[i].cells[4].firstChild;
		valSint = cmbSint.options[cmbSint.selectedIndex].value;

		valoriRiga = iden+'|'+superato+'|'+testo+'|'+valTipo+'|'+valSint+'§';
		request+=valoriRiga;
	}
	//alert (request.substring(0,request.length-1));
	if (request=='')
		alert('Nessun dato presente');
	else
		document.all.frameSave.src="saveAllergie?request="+request.substring(0,request.length-1);
}
function switchSuperato(obj)
{
	if (obj.superato=='N')
	{
		obj.superato='S';
		obj.className= 'risoltoS';
	}else
	{
		obj.superato='N';
		obj.className= 'risoltoN';
	}
}
function aggiornaWkAllergie()
{
    var vDati = top.getForm(document);
	top.frameAllergie.location.replace("frameWkAllergie?idRemoto="+vDati.idRemoto+"&reparto="+vDati.reparto+"&ricovero="+vDati.ricovero);
	top.framePaziente.location.replace("servletGenerator?KEY_LEGAME=VISUALIZZA_CARTELLA_DETTAGLIO_PAZIENTE&idRemoto="+vDati.idRemoto+"&reparto="+vDati.reparto+"&ricovero="+vDati.ricovero);

}
