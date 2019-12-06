// JavaScript Document
function applicaRicercaOpe () {
	var wherecond="";
	
	
	parent.GestCampi_Scheda.document.form_schede.hidUtente.value=document.all.user.value;
	//alert(parent);
	parent.VisualPerm.document.all.Hutente.value=document.all.user.value;
	parent.GestCampi_Campo.document.form_campi.hidWhere.value='';
	parent.GestCampi_Campo.document.form_campi.utente_sel.value=document.all.user.value;
	parent.GestCampi_Campo.document.form_campi.submit();
	parent.GestCampi_Scheda.document.form_schede.submit();
	parent.VisualPerm.document.formVisual.Hscheda.value="";
	//alert("2");
	//alert(parent.VisualPerm.document.formVisual.Hscheda.value);
	parent.VisualPerm.document.formVisual.submit();
	
}

function changeUtente () {
	document.all.Hscheda.value=document.all.lblDescrizioneScheda.innerText;
	document.all.Hcampo.value=document.all.lblDescrizioneCampo.innerText;
	alert(document.all.user.value);
	document.all.Hutente.value=document.all.user.value;
	document.formVisual.submit();
}

function modPerm () {
document.all.Hscheda.value=document.all.lblDescrizioneScheda.innerText;
document.all.Hcampo.value=document.all.lblDescrizioneCampo.innerText;

document.all.Hutente.value=parent.GestCampi_ricerca.document.all.user.value;
document.all.Hperm.value=document.all.Stato.value;
document.all.Hazione.value="mod"
if (document.all.Hscheda.value==null || document.all.Hscheda.value=="" || document.all.Hscheda.value=="Nessuna Scheda")
{alert("Selezionare una scheda");
return;}
if (document.all.Hcampo.value==null || document.all.Hcampo.value=="" || document.all.Hcampo.value=="Nessun Campo")
{alert("Selezionare un campo");
return;}
UpdatePermissioni.UpdatePermDB("mod*"+document.all.Hscheda.value+"*"+document.all.Hcampo.value+"*"+document.all.Hutente.value+"*"+document.all.Stato.value,CallBackUpdate);
//document.formVisual.target = 'wRegistraPerm';
//	document.formVisual.action = 'SL_PermissioniDB';
//	wnd = window.open("","wRegistraPerm","top=0,left=0,width=0,height=0,status=yes,scrollbars=yes");
//	document.formVisual.submit();
//	document.formVisual.target = '_self';
//	document.formVisual.action = 'Serv_VisualPerm';
//	document.formVisual.submit();
//	parent.GestCampi_Campo.document.form_campi.submit();
//	parent.GestCampi_Scheda.document.form_schede.submit();
	
}

function cancPerm () {
document.all.Hscheda.value=document.all.lblDescrizioneScheda.innerText;
document.all.Hcampo.value=document.all.lblDescrizioneCampo.innerText;
document.all.Hutente.value=parent.GestCampi_ricerca.document.all.user.value;
document.all.Hperm.value=document.all.Stato.value;
document.all.Hazione.value="canc"
if (document.all.Hscheda.value==null || document.all.Hscheda.value=="" || document.all.Hscheda.value=="Nessuna Scheda")
{alert("Selezionare una scheda");
return;}
if (document.all.Hcampo.value==null || document.all.Hcampo.value=="" || document.all.Hcampo.value=="Nessun Campo")
{alert("Selezionare un campo");
return;}
UpdatePermissioni.DeletePermDB("canc*"+document.all.Hscheda.value+"*"+document.all.Hcampo.value+"*"+document.all.Hutente.value+"*"+document.all.Stato.value,CallBackDelete);

}



function CallBackUpdate(Errore)
{
	//alert(Errore.length);
	if (Errore.length<3)
	{
		alert("Modifica Eseguita");
		parent.GestCampi_Campo.document.form_campi.submit();
		parent.GestCampi_Scheda.document.form_schede.submit();
	}
	else
	{
		var scelta=confirm(Errore);
		if (scelta)
		{
			UpdatePermissioni.InsertPermDB("ins*"+document.all.Hscheda.value+"*"+document.all.Hcampo.value+"*"+document.all.Hutente.value+"*"+document.all.Stato.value,CallBackInsert);
			parent.GestCampi_Campo.document.form_campi.submit();
		parent.GestCampi_Scheda.document.form_schede.submit();
		}
		else
		{
			alert("Modifica Annullata");
			return;
		}
	}
}
	
function CallBackInsert(Errore)
	{
		alert(Errore);
		parent.GestCampi_Campo.document.form_campi.submit();
		parent.GestCampi_Scheda.document.form_schede.submit();
	}

function CallBackDelete(Errore)
	{
		alert(Errore);
		parent.GestCampi_Campo.document.form_campi.submit();
		parent.GestCampi_Scheda.document.form_schede.submit();
	}
