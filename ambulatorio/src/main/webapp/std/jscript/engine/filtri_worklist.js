var _DEFAULT_ID = 'chkValore';
var _DEFAULT_LABEL = 'lblValoreCheck';

function _sel_desel_object(id, stato)
{
	if(typeof document.all[id] != 'undefined')
	{
		if(typeof document.all[id].length != 'undefined')
		{
			for(var ind = 0; ind < document.all[id].length; document.all[id][ind++].checked = stato);
		}
		else
		{
			document.all[id].checked = stato;
		}
	}
}

function seleziona_tutti(id)
{
	_sel_desel_object(typeof id == 'undefined' ? _DEFAULT_ID:id, true);
}

function deseleziona_tutti(id)
{
	_sel_desel_object(typeof id == 'undefined' ? _DEFAULT_ID:id, false);
}

function seleziona_singolo(idx, obj)
{
	var oLbl = typeof document.all[_DEFAULT_LABEL].length != 'undefined' ? document.all[_DEFAULT_LABEL][idx]:document.all[_DEFAULT_LABEL];
	var oChk = typeof document.all[_DEFAULT_ID].length != 'undefined' ? document.all[_DEFAULT_ID][idx]:document.all[_DEFAULT_ID];
	
	if(!event.ctrlKey)
	{
		deseleziona_tutti()
	}
	
	oLbl.innerText = oLbl.innerText;
	
	if(typeof obj != 'undefined' && obj.type == 'checkbox')
	{
		obj.checked = true;
	}
	else
	{
		oChk.checked = !oChk.checked;
	}
}

function applica(id, lbl)
{
	var ret_valore = '';
	var ret_descrizione = '';
	
	var a_obj_value = document.all[typeof id == 'undefined' ? _DEFAULT_ID:id];
	var a_obj_descr = document.all[typeof lbl == 'undefined' ? _DEFAULT_LABEL:id];
	
	var id_value_dest = document.all['FILTRO_CAMPO_VALORE'].value;
	var id_descr_dest = document.all['FILTRO_CAMPO_DESCRIZIONE'].value;
	
	var obj_value_dest = opener.document.all[id_value_dest];
	var obj_descr_dest = opener.document.all[id_descr_dest];
	
	if(typeof a_obj_value != 'undefined' && typeof a_obj_descr != 'undefined')
	{
		if(typeof a_obj_value.length != 'undefined')
		{
			for(var idx = 0; idx < a_obj_value.length; idx++)
			{
				if(a_obj_value[idx].checked)
				{
					if(trim(ret_valore) != '')
					{
						ret_valore += ', ';
						ret_descrizione += ', ';
					}
					
					ret_valore += a_obj_value[idx].value;
					ret_descrizione += a_obj_descr[idx].innerHTML;
				}
			}
		}
		else
		{
			if(a_obj_value.checked)
			{
				ret_valore = a_obj_value.value;
				ret_descrizione = a_obj_descr.innerHTML;
			}
		}
		
		if(trim(ret_valore) != '')
		{
			obj_value_dest.value = ret_valore;
			obj_descr_dest.innerHTML = ret_descrizione;
			obj_descr_dest.title = ret_descrizione;
			
			self.close();
		}
	}
}

function chiudi()
{
	self.close();
}