function cambioCheck(chkObj)
{
	if(event.ctrlKey == false)
	{
		getSeldesel(false);
		chkObj.checked = true;
	}
	else
	{
		if((chkObj.checked && event.srcElement.nodeName == 'INPUT') || (event.srcElement.nodeName != 'INPUT' && !chkObj.checked))//if(chkObj.checked)
		{
			chkObj.checked = true;
		}
		else
		{
			chkObj.checked = false;
		}
	}
}
		
		
function getSeldesel(check)
{
	for(i=0 ; i<document.form.elements.length ; i++)
		document.form.elements[i].checked = check;
}
		
		
function applica()
{
	var tipoProv = '';
	var count = 0;
	var tipoProv_title = '';
	
	for(T = 0 ; T < document.form.elements.length ; T++)
	{
		chkObj   = document.form.elements[T];
		chkDescr = document.form.elements[T-1];
		inputName= chkObj.name;
	
		if(inputName.length > 11 && inputName.substr(0, 11) == 'chkTipoProv' && chkObj.checked)
		{
			if(tipoProv.length>0){
				tipoProv += ',';
				tipoProv_title += ',';
			}
			tipoProv += "'" + chkObj.value + "'";
			count ++;
			tipoProv_title += chkDescr.value;
		}
	}
	 if(tipoProv == '')
	 {
	 	tipoProv = '-1';
		alert(ritornaJsMsg('MSG_INSERT_PROV_OBBL'));
		return;
	 }
	 
	opener.document.formDati.hFilProv.value = tipoProv;

	opener.document.all.tabellaTipoProv.title = tipoProv_title;
	
	var labelTipoProv = tipoProv_title;
	if(tipoProv_title.length > 25)
		labelTipoProv = tipoProv_title.substring(0,25) + '...';
	opener.document.all.td_FILTRO_PROV.innerText = labelTipoProv;
	
	self.close();
}


function caricamento(){
	fillLabels(arrayLabelName,arrayLabelValue);	
	tutto_schermo();
}

