function cambioCheck(chkObj)
{
	if(chkObj.checked)
	{
		chkObj.checked=false;
	}
	else
	{
		chkObj.checked=true;
    }
}
		
function getSeldesel(check)
{
	for(i=0 ; i<document.form.elements.length ; i++)
	document.form.elements[i].checked = check;
}
		
function applica()
{
	var esami = '';
	var esami_title = '';
	var count = 0;
	for(T=0 ; T<document.form.elements.length ; T++)
	{
		chkObj=document.form.elements[T];
		chkDescr = document.form.elements[T+1];
		inputName=chkObj.name;
		if(inputName.length > 8 && inputName.substr(0, 8)=='chkEsame' && chkObj.checked)
		{
			if(esami.length>0)
			{
				esami+=',';
				esami_title +=',';
			}
			esami += chkObj.value;
			esami_title += chkDescr.value;
			count ++;
		}
	}
	/*if(esami == '')
	{
		esami = '-1';
		alert(ritornaJsMsg('MSG_INSERT_ESA_OBBL'));
		return;
	}*/

	opener.document.form.htipologia_esami.value = esami;
	opener.document.all.td_tipologia_esami_field.title = esami_title;

	var label_esami = esami_title;
	if(esami_title.length > 25)
		label_esami = esami_title.substring(0,25) + '...';
		
	if(esami_title.length == 0)
		label_esami = ritornaJsMsg('nes');//label_esami = 'Nessun Esame Selezionato';

	var valori_filtri = esami;//valori_filtri = opener.document.form.hCdc.value + '@' + esami;
	
	//alert('Esami:' + valori_filtri);
	
	opener.document.all.td_tipologia_esami_field.innerText = label_esami;//'N° Esami sel.: ' + count;
	
	
	CJsUpdTabFiltri.update_filtri_medicina_nucleare(valori_filtri, cbk_update_filtri_medicina_nucleare);
}

function cbk_update_filtri_medicina_nucleare()
{
	self.close();
}


function chiudi()
{
	self.close();
}