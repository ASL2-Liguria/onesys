// JavaScript Document
function applicaAssocia ()
{
	var num_campi=0;
	var str_campi="";
	var num_utenti=0;
	var str_utenti="";
	num_campi=document.formAssCampo.campo_selezionato.length;
	for (i=0;i<num_campi;i++)
	{ str_campi+=document.formAssCampo.campo_selezionato.options[i].value+"*";}
	num_utenti=document.formAssCampo.utenti_selezionati.length;
	for (a=0;a<num_utenti;a++)
	{ str_utenti+=document.formAssCampo.utenti_selezionati.options[a].innerText+"*";}
	document.formAssCampo.Hstr_campi.value=str_campi;
	document.formAssCampo.Hstr_utenti.value=str_utenti;
	document.formAssCampo.Hstr_stato.value=document.formAssCampo.Ins_stato.value;
	//alert(document.formAssCampo.Hstr_scheda.value);
	document.formAssCampo.submit();
	
}

