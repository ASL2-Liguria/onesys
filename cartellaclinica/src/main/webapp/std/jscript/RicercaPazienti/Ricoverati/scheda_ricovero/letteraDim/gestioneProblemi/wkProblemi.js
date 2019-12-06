function setPriorita(obj,tipoUte)
{
	if (tipoUte!='M')
	{
		alert('Funzionalità riservata al personale medico');
		obj.selectedIndex = obj.prioritaOriginale;
		return;
	}
	if (confirm("Modificare la priorità per il problema selezionato?"))
	{
		document.formWkProblemi.id2mod.value=obj.name;
		document.formWkProblemi.newPriority.value=obj.options[obj.selectedIndex].value;
		aggiorna();
	}else
	{
		obj.selectedIndex = obj.prioritaOriginale;
	}
}
function aggiorna()
{
	document.formWkProblemi.submit();
	try{top.document.all['frameProblemi'].src = top.document.all['frameProblemi'].src;}catch(e){/*caso in cui non sia configurato il frame in cartella*/}
}

function risolviProblema(obj,tipoUte)
{
	if (tipoUte!='M')
	{
		alert('Funzionalità riservata al personale medico');
		return;
	}
	if (obj.risolto=='N')
	{
		if (confirm("Confermare la risoluzione del problema selezionato?"))
		{
			document.formWkProblemi.id2mod.value=obj.iden_problema;
			document.formWkProblemi.setRisolto.value='S';
			aggiorna();
		}
	}else
	{
		if (confirm("Confermare la riapertura del problema selezionato?"))
		{
			document.formWkProblemi.id2mod.value=obj.iden_problema;
			document.formWkProblemi.setRisolto.value='N';
			aggiorna();
		}
	}
}
function apriProblema(idProblema,tipoUte)
{
	if (tipoUte!='M')
	{
		alert('Funzionalità riservata al personale medico');
		return;
	}
	window.open("schedaProblema?idProblema="+idProblema+"&idenVisita="+top.getForm(document).iden_visita,'schedaProblema', 'fullscreen=yes, status=no ,scrollbars=yes');
}
function aggiornaWkProblemi()
{
	try{top.document.all['frameProblemi'].src = top.document.all['frameProblemi'].src;}catch(e){/*caso in cui non sia configurato il frame in cartella*/}
}
