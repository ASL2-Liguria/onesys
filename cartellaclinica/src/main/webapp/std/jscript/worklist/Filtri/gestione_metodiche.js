function cambioCheck(chkObj)
{
	if(event.ctrlKey == false)
	{
		getSeldesel(false);
		chkObj.checked = true;
	}
	else
	{
		if(chkObj.checked)
		{
			chkObj.checked = true;
		}
		else
		{
			chkObj.checked = false;
		}
	}
}

/*function cambioCheck(chkObj)
{
	if(event.ctrlKey != true)
	{
		getSeldesel(false);
		chkObj.checked = true;
	}
	else
		chkObj.checked = true;
}
*/
		
function getSeldesel(check)
{
	for(i=0 ; i<document.frmDati.elements.length ; i++)
	document.frmDati.elements[i].checked = check;
}
		
function applica()
{
	var metodiche = '';
	var metodica_title = '';
	var count = 0;
	for(T=0 ; T<document.frmDati.elements.length ; T++)
	{
		chkObj=document.frmDati.elements[T];
		chkDescr = document.frmDati.elements[T-1];
		inputName=chkObj.name;
		if(inputName.length > 11 && inputName.substr(0, 11)=='chkMetodica' && chkObj.checked)
		{
			if(metodiche.length>0){
				metodiche+=',';
				metodica_title +=',';
			}
			metodiche += "'"+chkObj.value+"'";
			metodica_title += chkDescr.value;
			count ++;
		}
	}
	if(metodiche == ''){
		metodiche = '-1';
		alert(ritornaJsMsg('MSG_INSERT_MET_OBBL'));
		return;
	}

	opener.document.all.hMetodica.value = metodiche;
	opener.document.all.tabella_metodica.title = metodica_title;

	var label_metodica = metodica_title;
	if(metodica_title.length > 25)
		label_metodica = metodica_title.substring(0,25) + '...';
	opener.document.all.td_metodica.innerText = label_metodica;//'N° Metodiche sel.: ' + count;
	
	self.close();
}