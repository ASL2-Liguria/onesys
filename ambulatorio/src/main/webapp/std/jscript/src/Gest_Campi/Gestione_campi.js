// JavaScript Document
// JavaScript Document
function InsCampo ()
{
	var idendesc=stringa_codici(campo);
	//alert(idendesc);
	document.form_campi.Azione.value="Inserisci"
	document.form_campi.target = 'wRegistraCampo';
	document.form_campi.action = 'SL_Aggiungi_Campo';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_campi.submit();
	document.form_campi.target = '_self';
	document.form_campi.action = 'Serv_GestCampi_Campi';
}


function ModCampo ()
{	var idendesc=stringa_codici(campo);
	
	document.form_campi.Azione.value="Modifica";
	document.form_campi.selezionato.value=idendesc;
	document.form_campi.target = 'wRegistraCampo';
	document.form_campi.action = 'SL_Aggiungi_Campo';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_campi.submit();
	document.form_campi.target = '_self';
	document.form_campi.action = 'Serv_GestCampi_Campi';
}

function CancCampo ()
{	var idendesc=stringa_codici(campo);
	//alert(idendesc);
	if (idendesc=="")
		{alert("selezionare un campo")}
	else {	
	var ok = confirm("Cancellare il Campo "+ idendesc+" ?");
	
	if (ok==true)
	{document.form_campi.Azione.value="Cancella";
	document.form_campi.selezionato.value=idendesc;
	document.form_campi.target = 'wRegistraCampo';
	document.form_campi.action = 'SL_Aggiungi_Campo';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width=0,height=0,status=yes,scrollbars=yes");
	document.form_campi.submit();
	document.form_campi.target = '_self';
	document.form_campi.action = 'Serv_GestCampi_Ope';}
	else
	alert("Cancellazione annullata");}
}



function AssociaScheda()
{	
	var aff="";
	idendesc=stringa_codici(iden);
	//alert(idendesc);
	//alert(document.all.hidWhere.value);
	if (document.all.hidWhere==null)
	{aff="";}
	else
	{aff=document.all.hidWhere.value;}
	//alert(aff);
	if (aff == "") 
	{alert ("selezionare una scheda")}
	else{document.form_campi.selezionato.value=idendesc;
	document.form_campi.target = 'wAssociaCampo';
	document.form_campi.action = 'SL_Associa_Campo';
	wnd = window.open("","wAssociaCampo","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_campi.submit();
	document.form_campi.target = '_self';
	document.form_campi.action = 'Serv_GestCampi_Campi';}
}

function getCampiRicerca(){
	document.form_schede.hidWhere.value = parent.GestCampi_Campo.document.form_schede.hidWhere.value;
}
	  
function avanti_campi(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da_vis.value);
	document.form_campi.pagina_da_vis.value = numero_pagina;
	//alert(document.form_schede.pagina_da_vis.value);
	//getCampiRicerca();
	document.form_campi.submit();
	//document.form_schede.pagina_da_vis.value = numero_pagina;
}

function indietro_campi(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da_vis.value);
	document.form_campi.pagina_da_vis.value = numero_pagina;
	//alert(document.form_schede.pagina_da_vis.value);
	//getCampiRicerca();
	document.form_campi.submit();
	//document.form_schede.pagina_da_vis.value = numero_pagina;
}
function selCampo() {
var iden_iden=stringa_codici(iden);
var idendesc=stringa_codici(campo);
var myutente=stringa_codici_con_vuoti(utente);
//alert(myutente);
parent.VisualPerm.document.all.lblDescrizioneCampo.innerText=idendesc;	
document.form_campi.selezionato.value=idendesc;  
 //alert(document.form_campi.selezionato.value); 
  var scheda=parent.VisualPerm.document.all.lblDescrizioneScheda.innerText;
	parent.VisualPerm.document.all.Hscheda.value=scheda;
	//alert(parent.VisualPerm.document.all.user.value);
  parent.VisualPerm.document.all.Hutente.value=document.form_campi.utente_sel.value;
  parent.VisualPerm.document.all.Hutente_worklist_campo.value=myutente;
  parent.VisualPerm.document.all.Hcampo.value=idendesc;
  parent.VisualPerm.document.formVisual.submit();
  
 
}