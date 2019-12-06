function ricerca_paziente_remota()
{
	var doc = document.form_ric_remota;
	doc.action = 'SL_Ric_Paz_Remota';
	doc.target = 'win_ric_remota';
	doc.method = 'POST';
	
	try{
		doc.nome.value = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;
		doc.cognome.value = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;
		doc.data.value = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;
	}
	catch(e){
		alert('Attenzione:la ricerca remota è attiva solo nella ricerca paziente per COGNOME, NOME E DATA');
		return;
	}
	
	if(doc.nome.value == '' && doc.cognome.value == '' && doc.data.value == '')
	{
		alert('Attenzione:inserire i parametri per la ricerca remota.');
		parent.RicPazRicercaFrame.document.form_pag_ric.COGN.focus();
		return;
	}
	
	if(doc.cognome.value != '')
		doc.hidwhere.value = " WHERE COGN like '" + doc.cognome.value + "%'";
	if(doc.nome.value != '')
		doc.hidwhere.value += " AND NOME like '" + doc.nome.value + "%'";
	if(doc.data.value != '')
		doc.hidwhere.value += " AND DATA = '" + doc.data.value + "'";
	
	//alert('WHERE CONDITION: ' + doc.hidwhere.value);

	
    var finestra = window.open("","win_ric_remota","toolbar=no,menubar=no,resizable=yes,height=600,width=1000,top=0,left=0,status=yes");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("","win_ric_remota","toolbar=no,menubar=no,resizable=yes,height=600,width=1000,top=0,left=0,status=yes");
	}
	
	doc.submit();
}