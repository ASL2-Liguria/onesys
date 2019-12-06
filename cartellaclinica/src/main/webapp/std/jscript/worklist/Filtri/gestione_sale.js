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
		
		
function getSeldesel(check)
{
	for(i=0 ; i<document.frmDati.elements.length ; i++)
		document.frmDati.elements[i].checked = check;
}
		
		
function applica()
{
	var idenSal = '';
	var count = 0;
	var sale_title = '';
	for(T = 0 ; T < document.frmDati.elements.length ; T++)
	{
		chkObj   = document.frmDati.elements[T];
		chkDescr = document.frmDati.elements[T-1];
		inputName= chkObj.name;
		if(inputName.length > 7 && inputName.substr(0, 7) == 'chkSala' && chkObj.checked)
		{
			if(idenSal.length>0){
				idenSal += ',';
				sale_title += ',';
			}
			idenSal += chkObj.value;
			count ++;
			sale_title += chkDescr.value;
		}
	}
	 if(idenSal == '')
	 {
	 	idenSal = '-1';
		alert(ritornaJsMsg('MSG_INSERT_SALE_OBBL'));
		return;
	 }
	 
	opener.document.all.hSale.value=idenSal;
	
	opener.document.all.tabella_sale.title = sale_title;
	
	var label_sale = sale_title;
	if(sale_title.length > 25)
		label_sale = sale_title.substring(0,25) + '...';
	opener.document.all.td_sale.innerText = label_sale;//'N° Sale sel.: ' + count;
	
	self.close();
}