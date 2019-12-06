// JavaScript Document
function InsScheda ()
{
	var idendesc=stringa_codici(Scheda);
	//alert(document.form_schede.action);
	document.form_schede.Azione.value="Inserisci"
	document.form_schede.target = 'wRegistraCampo';
	document.form_schede.action = 'SL_Aggiungi_Scheda';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_schede.submit();
	document.form_schede.target = '_self';
	document.form_schede.action = 'Serv_GestCampi_Ope';
}


function ModScheda ()
{
	var idendesc=stringa_codici(Scheda);
	//alert(document.form_schede.action);
	if (idendesc=="")
		{alert(ritornaJsMsg("sel_one"))}
	else {	
	document.form_schede.Azione.value="Modifica"
	document.form_schede.selezionato.value=idendesc;
	document.form_schede.target = 'wRegistraCampo';
	document.form_schede.action = 'SL_Aggiungi_Scheda';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_schede.submit();
	document.form_schede.target = '_self';
	document.form_schede.action = 'Serv_GestCampi_Ope';}
}

function CancScheda ()
{	var idendesc=stringa_codici(Scheda);
	//alert(idendesc);
	if (idendesc=="")
		{alert("selezionare un esame")}
	else {	
	var ok = confirm("Cancellare la Scheda "+ idendesc+" ?");
	
	if (ok==true)
	{document.form_schede.Azione.value="Cancella";
	document.form_schede.selezionato.value=idendesc;
	document.form_schede.target = 'wRegistraCampo';
	document.form_schede.action = 'SL_Aggiungi_Scheda';
	wnd = window.open("","wRegistraCampo","top=0,left=0,width=0,height=0,status=yes,scrollbars=yes");
	document.form_schede.submit();
	document.form_schede.target = '_self';
	document.form_schede.action = 'Serv_GestCampi_Ope';}
	else
	alert("Cancellazione annullata");}
}


function getCampiRicerca(){
	document.form_schede.hidWhere.value = parent.GestCampi_Scheda.document.form_schede.hidWhere.value;
}
	  
function avanti(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da.value);
	document.form_schede.pagina_da.value = numero_pagina;
	//alert(document.form_schede.pagina_da.value);
	//getCampiRicerca();
	document.form_schede.submit();
	//document.form_schede.pagina_da.value = numero_pagina;
}

function indietro(numero_pagina){
	//alert(numero_pagina);
	//alert(document.form_schede.pagina_da.value);
	document.form_schede.pagina_da.value = numero_pagina;
	//alert(document.form_schede.pagina_da.value);
	//getCampiRicerca();
	document.form_schede.submit();
	//document.form_schede.pagina_da.value = numero_pagina;
}


function cambiacampi (){

var iden_iden=stringa_codici(iden);
var idendesc=stringa_codici(Scheda)
//alert(iden_iden);
parent.GestCampi_Campo.document.form_campi.hidWhere.value="";
parent.GestCampi_Campo.document.form_campi.pagina_da_vis.value=1;
if  (iden_iden!="")
{parent.GestCampi_Campo.document.form_campi.hidWhere.value=""+iden_iden;
parent.VisualPerm.document.all.Hscheda.value=idendesc;
parent.VisualPerm.document.all.lblDescrizioneScheda.innerText=idendesc;	
parent.VisualPerm.document.all.Hcampo.value="";
parent.VisualPerm.document.all.lblDescrizioneCampo.innerText="    ";	
//alert(parent.VisualPerm.document.all.Stato.value);
parent.VisualPerm.document.all.Stato.value="1";
//  parent.VisualPerm.document.formVisual.Hscheda.value=idendesc;
}
else {parent.VisualPerm.document.all.lblDescrizioneScheda.innerText=" " ;	}
	parent.VisualPerm.document.all.Stato.value="1";

	parent.GestCampi_Campo.document.form_campi.submit();

}

function AssociaScheda()
{	
/*	var aff="";
	idendesc=stringa_codici(iden);
	//alert(idendesc);
	//alert(document.all.hidWhere.value);
	if (document.all.hidWhere==null)
	{aff="";}
	else
	{aff=document.all.hidWhere.value;}
	//alert(aff);
	if (idendesc=="" || aff == "") 
	{alert ("selezionare una scheda")}*/
	///*else{*/document.form_schede.selezionato.value=idendesc;
	document.form_schede.target = 'wAssociaScheda';
	document.form_schede.action = 'SL_Associa_Schede';
	wnd = window.open("","wAssociaScheda","top=0,left=0,width="+ screen.availWidth +",height=" + screen.																					availHeight +",status=yes,scrollbars=yes");
	document.form_schede.submit();
	document.form_schede.target = '_self';
	document.form_schede.action = 'Serv_GestCampi_Ope';}
//}
