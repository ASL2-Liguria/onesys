var _apri_scandb = true;

function check_parametri_scandb(obj, apri)
{
	var aRet = new Array('', '', '', '', '', apri, '');
	
	if(typeof obj.SCANDB_RIC != 'undefined' && typeof document.all[obj.SCANDB_RIC].value != 'undefined')
	{
		aRet[0] = document.all[obj.SCANDB_RIC].value;
	}
	
	if(typeof obj.SCANDB_PROC != 'undefined')
	{
		aRet[1] = obj.SCANDB_PROC;
	}
	
	if(typeof obj.SCANDB_WHERE != 'undefined')
	{
		aRet[2] = obj.SCANDB_WHERE;
	}
	
	if(typeof obj.SCANDB_OGG != 'undefined')
	{
		aRet[3] = obj.SCANDB_OGG;
	}
	
	if(typeof obj.SCANDB_REPARTO != 'undefined' && typeof document.all[obj.SCANDB_REPARTO].value != 'undefined')
	{
		aRet[4] = document.all[obj.SCANDB_REPARTO].value;
	}
	
	if(typeof obj.SCANDB_WHERE != 'undefined' && typeof document.all[obj.SCANDB_WHERE].value != 'undefined')
	{
		aRet[6] = document.all[obj.SCANDB_WHERE].value;
	}
	
	return aRet;
}

function set_open_scandb(valore)
{
	_apri_scandb = valore;
}

function finestra_popup(myRic, myProc, myWhere, myOgg, myReparto, apri, codice)
{
	if(!_apri_scandb) return;
	if(myProc == '') return;
	if(apri != 'S')
	{
		if(codice != '') return;
		if(myRic == '') return;
	}
		
	var popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	if(popup)
		popup.focus();
	else
		popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	
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

function launch_scandb_link(obj)
{
	var aPar = check_parametri_scandb(obj, 'S');
	
	finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
}

function launch_scandb_text(obj)
{
	var aPar = check_parametri_scandb(obj, 'N');
	
	finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
}