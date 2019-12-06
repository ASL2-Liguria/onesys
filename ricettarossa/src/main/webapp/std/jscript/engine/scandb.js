var _apri_scandb = true;

function check_parametri_scandb(obj, apri)
{
	var aRet = new Array('', '', '', '', '', apri, '');
	
	if(typeof obj.getAttribute('SCANDB_RIC') == 'string' && typeof document.getElementById(obj.getAttribute('SCANDB_RIC')).value != 'undefined')
	{
		aRet[0] = document.getElementById(obj.getAttribute('SCANDB_RIC')).value;
	}
	
	if(typeof obj.getAttribute('SCANDB_PROC') == 'string')
	{
		aRet[1] = obj.getAttribute('SCANDB_PROC');
	}
	
	if(typeof obj.getAttribute('SCANDB_WHERE') == 'string')
	{
		aRet[2] = obj.getAttribute('SCANDB_WHERE');
	}
	
	if(typeof obj.getAttribute('SCANDB_OGG') == 'string')
	{
		aRet[3] = obj.getAttribute('SCANDB_OGG');
	}
	
	if(typeof obj.getAttribute('SCANDB_REPARTO') == 'string' && typeof document.getElementById(obj.getAttribute('SCANDB_REPARTO')).value != 'undefined')
	{
		aRet[4] = document.getElementById(obj.getAttribute('SCANDB_REPARTO')).value;
	}
	
	if(typeof obj.getAttribute('SCANDB_WHERE') == 'string' && typeof document.getElementById(obj.getAttribute('SCANDB_WHERE')).value != 'undefined')
	{
		aRet[6] = document.getElementById(obj.getAttribute('SCANDB_WHERE')).value;
	}
	
	return aRet;
}

function set_open_scandb(valore)
{
	_apri_scandb = valore;
}

function finestra_popup(myRic, myProc, myWhere, myOgg, myReparto, apri, codice)
{
	if(!_apri_scandb) {return;}
	if(myProc == '') {return;}
	if(apri != 'S')
	{
		if(codice != '') {return;}
		if(myRic == '') {return;}
	}
		
	var popup = window.open('', 'winstd', 'status = yes, scrollbars = no, height = 1, width = 1, top = 1500, left = 1500');
	if(popup)
	{
		popup.focus();
	}
	else
	{
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
		
		document.body.appendChild(cForm);
		
		cForm.submit();
		
		document.body.removeChild(cForm);
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

/**
 * Imposta il valore di ritorno da una scandb con la possibilità di usare campi rinominati.
 * 
 * @author  gianlucab
 * @version 1.1
 * @since   2014-06-23
 */
var scan_db_items = null;

function set_scan_db_value(attribute, value, formName) {
	
	function retValue(element, value) {
		element.value = value;
		
		// callback
		if (typeof document.body.scan_db_callback === 'function') {
			document.body.scan_db_callback(element, value);
		}
	}
	
/*	try {
		eval("window.document."+formName+"."+attribute+".value = value;");
	} catch(e) {		*/
		var attr = attribute;
		if (scan_db_items != null){
			attr = scan_db_items[attribute];
		}
		
		// Tenta di individuare l'elemento tramite l'id
		var element = jQuery('#'+attr);
		if (typeof element[0] === 'object') {
			return retValue(element[0], value);
		}
	
		// Tenta di individuare l'elemento tramite il nome
		element = jQuery('[name='+attr+']');
		if (typeof element[0] === 'object') {
			return retValue(element[0], value);
		}
		//alert('Impossibile trovare il campo '+attr);
//	}
}

function launch_scandb_link(obj, items /* opzionale */)
{
	scan_db_items = null;
	if (typeof items === 'object'){
		scan_db_items = items;
	}
	var aPar = check_parametri_scandb(obj, 'S');
	
	finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
}

function launch_scandb_text(obj)
{
	var aPar = check_parametri_scandb(obj, 'N');
	
	finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
}

function launch_scandb_link_where(obj, whereCond, items /* opzionale */)
{
	scan_db_items = null;
	if (typeof items === 'object'){
		scan_db_items = items;
	}
	var aPar = check_parametri_scandb(obj, 'S');
	
	if (typeof whereCond =='undefined'||whereCond==''){
	
		finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
	
	}else{
	
		finestra_popup(aPar[0], aPar[1], whereCond, aPar[3], aPar[4], aPar[5], aPar[6]);
	
	}
}

function launch_scandb_text_where(obj,whereCond)
{
	var aPar = check_parametri_scandb(obj, 'N');
	
	if (typeof whereCond =='undefined'||whereCond==''){
	
		finestra_popup(aPar[0], aPar[1], aPar[2], aPar[3], aPar[4], aPar[5], aPar[6]);
	
	}else{
	
		finestra_popup(aPar[0], aPar[1], whereCond, aPar[3], aPar[4], aPar[5], aPar[6]);
	
	}
}


//setta la where cond della pagina
function setWhereScanDB(whereCond){
	
	document.getElementById('hWhereCond').value=whereCond;
	
}
