var ret_value = '';
var ret_descr = '';
var tipo_sel = '';

function ritorna_valori()
{
	var i;
	ret_value = '';
	ret_descr = '';
	
	if(document.scelta.check_value.length)
	{
		for(i=0; i<document.scelta.check_value.length; i++)
		{
			if(document.scelta.check_value[i].checked)
			{
				ret_value += (ret_value != '' ? ',':'') + '\'' + document.scelta.check_value[i].value + '\'';
				ret_descr += (ret_descr != '' ? ', ':'') + document.all.lbl_value[i].innerHTML;
			}
		}
	}
	else
	{
		ret_value += (ret_value != '' ? ',':'') + '\'' + document.scelta.check_value.value + '\'';
		ret_descr += (ret_descr != '' ? ', ':'') + document.all.lbl_value.innerHTML;
	}
}

function de_sel_tutti(valore)
{
	var i;
	
	if(document.scelta.check_value.length == 'undefined')
	{
		document.scelta.check_value.checked = valore;
	}
	else
	{
		for(i=0; i<document.scelta.check_value.length; i++)
		{
			document.scelta.check_value[i].checked = valore;
		}
	}
}

function seleziona_tutti()
{
	de_sel_tutti(true);
}

function deseleziona_tutti()
{
	de_sel_tutti(false);
}

function applica(tipo)
{
	ritorna_valori();
	
	tipo_sel = tipo;
	
	if(tipo == "SQL")
	{
		opener.set_view_sale(ret_value, ret_descr);
		continua('');
	}
	else
	{
		opener.set_view_cdc(ret_value, ret_descr);
		
		consultazioneSceltaDWR.get_descr_filter("select IDEN, DESCR from TAB_SAL where ATTIVO = 'S' and REPARTO in (" + ret_value + ") order by DESCR asc", continua);
	}
}

function continua(valore)
{
	var a_tmp;
	
	if(valore != '')
	{
		a_tmp = valore.split("*");
		opener.set_view_sale(a_tmp[0], a_tmp[1].replace(/'/g, ""));
	}
	
	opener.aggiorna(tipo_sel);
	
	dwr.engine.setAsync(false);
	
	consultazioneSceltaDWR.registra(opener.document.opzioni.Hcdc.value + '#' + opener.document.opzioni.Hiden_sal.value);
	
	dwr.engine.setAsync(true);
	
	chiudi();
}

function chiudi()
{
	self.close();
}

function sel_check(obj)
{
	if(event.ctrlKey == false)
	{
		deseleziona_tutti();
		
		obj.firstChild.checked = true;
	}
	else
	{
		if(event.srcElement.nodeName != 'INPUT')
		{
			obj.firstChild.checked = !obj.firstChild.checked;
		}
	}
}