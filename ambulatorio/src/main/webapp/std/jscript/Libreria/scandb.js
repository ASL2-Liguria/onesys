var apri_scandb = true;

function set_open_scandb(valore)
{
	apri_scandb = valore;
}

function finestra_popup(myRic, myProc, myWhere, myOgg, myReparto, apri, codice)
{
	if(!apri_scandb){ return;}
	if(myProc == ''){ return;}
	if(apri != 'S')
	{
		if(codice != ''){ return;}
		if(myRic == '') {return;}
	}
		
	var popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	if(popup){
		popup.focus();
	}else{
		popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	}
	myRic = myRic.toUpperCase();
	
	if(!document.tab_std)
	{
		// Non esiste la from
		var cForm  = document.createElement('form');
		cForm.setAttribute('name', 'tab_std');
		cForm.setAttribute('id', 'tab_std');
		cForm.setAttribute('target', 'winstd');
		cForm.setAttribute('action', 'scanDB');
		
		var cField = document.createElement('input');
		cField.setAttribute('type','hidden');
		cField.setAttribute('name','myric');
		cField.setAttribute('value', myRic == '' ? '' : myRic);
		
		cForm.appendChild(cField);
		
		cField = document.createElement('input');
		cField.setAttribute('type','hidden');
		cField.setAttribute('name','myproc');
		cField.setAttribute('value', myProc == '' ? '' : myProc);
		
		cForm.appendChild(cField);
		
		cField = document.createElement('input');
		cField.setAttribute('type','hidden');
		cField.setAttribute('name','mywhere');
		cField.setAttribute('value', myWhere == '' ? '' : myWhere);
		
		cForm.appendChild(cField);
		
		cField = document.createElement('input');
		cField.setAttribute('type','hidden');
		cField.setAttribute('name','myogg');
		cField.setAttribute('value', myOgg == '' ? '' : myOgg);
		
		cForm.appendChild(cField);
		
		cField = document.createElement('input');
		cField.setAttribute('type','hidden');
		cField.setAttribute('name','loc_reparto');
		cField.setAttribute('value', myReparto == '' ? '' : myReparto);
		
		cForm.appendChild(cField);
		
		document.appendChild(cForm);
		
		cForm.submit();
		
		document.removeChild(cForm);
	}
	else
	{
		document.tab_std.myric.value = myRic == '' ? '' : myRic;
		document.tab_std.myproc.value = myProc == '' ? '' : myProc;
		document.tab_std.mywhere.value = myWhere == '' ? '' : myWhere;
		document.tab_std.myogg.value = myOgg == '' ? '' : myOgg;
		document.tab_std.loc_reparto.value = myReparto == '' ? '' : myReparto;
		
		document.tab_std.submit();
	}
}