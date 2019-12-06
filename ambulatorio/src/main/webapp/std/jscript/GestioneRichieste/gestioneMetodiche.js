function annulla()
{
	self.close();
}

function applica()
{
	var doc = document.form;
	var metodiche = '';
	var metodica_title = '';
	var count = 0;

	for(T=0 ; T < doc.elements.length ; T++)
	{
		chkObj = doc.elements[T];
		chkDescr = doc.elements[T+1];
		inputName=chkObj.name;
		if(inputName.length > 11 && inputName.substr(0, 11)=='chkMetodica' && chkObj.checked)
		{
			if(metodiche.length > 0)
			{
				metodiche += ',';
				metodica_title +=',';
			}
			metodiche += "'%" + chkObj.value + "%'";
			metodica_title += chkDescr.value;
			count ++;
		}
	}

	opener.document.all.hMetodica.value = metodiche;

	if(metodica_title == '')
		metodica_title = ritornaJsMsg('nms');//"Nessuna Metodica Selezionata";
	
	//opener.document.all.tabella_metodica.title = metodica_title;
	
	opener.document.all.td_metodica_label.title = metodica_title;
	opener.document.all.td_metodica_field.title = metodica_title;

	var label_metodica = metodica_title;
	if(metodica_title.length > 25)
		label_metodica = metodica_title.substring(0,25) + '...';
	
	opener.document.all.td_metodica_field.innerText = label_metodica;
	
	
	//alert('METODICHE: ' + metodiche);
	//alert('DESCR METODICHE: ' + metodica_title);
	dwr.engine.setAsync(false);
	CJsRichieste.gestione_metodica(metodiche, cbkMetodiche);
	dwr.engine.setAsync(true);
}

function cbkMetodiche(message)
{
	CJsRichieste = null;//CJsGestioneFiltri
	
	if(message != '')
		alert(message);
	
	self.close();
}

function getSeldesel(check)
{
	for(i=0 ; i<document.form.elements.length ; i++)
		document.form.elements[i].checked = check;
}

