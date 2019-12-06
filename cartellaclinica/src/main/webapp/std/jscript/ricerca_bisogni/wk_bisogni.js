function visualizzaCartellaPaziente(servlet)
{

	var iden_anag=stringa_codici(array_iden);
	//var cod_dec_Reparto = stringa_codici(array_reparto_di_ricovero);
	var idRemoto=stringa_codici(array_id_remoto);
	var reparto=stringa_codici(array_reparto_di_ricovero);
	var ricovero=stringa_codici(array_num_nosologico);
	var iden_visita=stringa_codici(array_iden_visita);
	var iden_pro=stringa_codici(array_iden_pro);
	
	
	var url="servletGenerator?KEY_LEGAME=VISUALIZZA_CARTELLA_PAZIENTE";
	url += "&iden_anag="+iden_anag;
	//url += "&cod_dec_Reparto="+cod_dec_Reparto;
	url += "&idRemoto="+idRemoto;
	url += "&reparto="+reparto;
	url += "&ricovero="+ricovero;
	url += "&funzione=apriBisogniAssistenziali";
	url += "&iden_visita="+iden_visita;
	url += "&iden_pro="+iden_pro;
	//alert(url);
	//window.showModalDialog(url,this,"dialogWidth:"+screen.availWidth+"px;dialogHeight:"+screen.availHeight+"px;scroll:no");
	window.open(url, 'schedaRicovero', 'fullscreen=yes, status=no');
}

