function StampaRefertiEsterni()
{
  var f_iden=stringa_codici(array_iden_esame);
  var f_num_pre=stringa_codici(array_num_pre);
  var f_iden_ref=stringa_codici(array_iden_ref);

  var finestra  = window.open('SrvRefertoEsterno?req_iden_esame=' + f_iden + '&req_num_pre=' + f_num_pre + '&req_iden_ref='+ f_iden_ref +"","","top=0,left=0");

	if(finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra  = window.open('SrvRefertoEsterno?req_iden_esame=' + f_iden + '&req_num_pre=' + f_num_pre + '&req_iden_ref='+ f_iden_ref +"","","top=0,left=0");
	}
}

function InizializzaRefertoEsterno (){

dwr.engine.setAsync(false);

dwrGetUrlRefertiEsterni.dwrGetUrlEsterna("select http_to_CALL from View_http_referti_esterni where num_pre = " +  req_num_pre,callAfterDwrUrl);
dwr.engine.setAsync(true);
}

function closeAnteprima()
{

	if (sorgente=='worklist')
	{
		opener.aggiorna();
		self.close();
	}
	else
	{
		self.close();
	}
}
