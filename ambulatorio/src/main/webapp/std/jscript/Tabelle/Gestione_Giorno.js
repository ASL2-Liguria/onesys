document.onkeyup = function(){document.form_cong_giorno.KeyName.value = "";}
document.onkeydown = function()
{
   var KeyID = event.keyCode;
   
   switch(KeyID)
   {
      case 16:
		  document.form_cong_giorno.KeyName.value = "Shift";
		  break;
	  case 17:
		  document.form_cong_giorno.KeyName.value = "Ctrl";
		  break;
	  case 18:
		  document.form_cong_giorno.KeyName.value = "Alt";
		  break;
	  case 19:
		  document.form_cong_giorno.KeyName.value = "Pause";
		  break;
	  case 37:
		  document.form_cong_giorno.KeyName.value = "Arrow Left";
		  break;
	  case 38:
		  document.form_cong_giorno.KeyName.value = "Arrow Up";
		  break;
	  case 39:
		  document.form_cong_giorno.KeyName.value = "Arrow Right";
		  break;
	  case 40:
		  document.form_cong_giorno.KeyName.value = "Arrow Down";
		  break;
	}
}

function cambiogiorno ()
{	
	//alert(document.all.day.value);
	parent.GestGiorno.document.form_cong_giorno.iden_gio.value=document.all.day.value;
	parent.GestGiorno.document.form_cong_giorno.pagina_da_vis.value="1";
	parent.GestGiorno.document.form_cong_giorno.target="_self";
	parent.GestGiorno.document.form_cong_giorno.submit();
	parent.GestGiorno.focus();
}

function avanti(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da.value);
document.form_cong_giorno.pagina_da_vis.value = numero_pagina;
	//alert(document.form_schede.pagina_da.value);
	//getCampiRicerca();
parent.GestGiorno.document.form_cong_giorno.target="_self";
document.form_cong_giorno.submit();
	//document.form_schede.pagina_da.value = numero_pagina;
	//alert(vettore_indici_sel);
}

function indietro(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da.value);
	document.form_cong_giorno.pagina_da_vis.value = numero_pagina;
	//alert(document.form_schede.pagina_da.value);
	//getCampiRicerca();
	parent.GestGiorno.document.form_cong_giorno.target="_self";
	document.form_cong_giorno.submit();
	//document.form_schede.pagina_da.value = numero_pagina;
}

function AbilitaOra(){

	UpdateTabConfigGiorno.UpdateConfGiorno('S*'+stringa_codici(iden),close_as);
	document.form_cong_giorno.target="_self";
	document.form_cong_giorno.submit();
}

function DisabilitaOra(){
	

	UpdateTabConfigGiorno.UpdateConfGiorno('N*'+stringa_codici(iden),close_as);
	document.form_cong_giorno.target="_self";
	document.form_cong_giorno.submit();

}
function close_as(Errore)
{
	if (Errore.lenght>3)
	alert(Errore);
	self.close();
	
}

function inserisci_orario_giorno()
{
	var iden_selezionato=stringa_codici(iden);
	if(iden_selezionato.toString().indexOf('*')>0)
	{	
		alert('Selezionare un solo orario')
		return;
	}
	parent.SelGiorno.inserisci_orario_engine(iden_selezionato);
}

function inserisci_orario_engine(in_iden)
{
	functionDwr.launch_sp('inserisci_orario_config_gg@IString@' + in_iden , risposta_inserisci_orario);}

function  risposta_inserisci_orario(to_alert)
{
cambiogiorno();
}