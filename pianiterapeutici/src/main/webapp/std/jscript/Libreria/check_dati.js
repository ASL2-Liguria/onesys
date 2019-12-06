var _a_status = null;
var a_msg_dwr = new Array(100);

Array.prototype.lastIndexOf = function(elt /*, from*/)
  {
    var len = this.length;

    var from = Number(arguments[1]);
    if (isNaN(from))
    {
      from = len - 1;
    }
    else
    {
      from = (from < 0) ? Math.ceil(from):Math.floor(from);
      if(from < 0)
        from += len;
      else if(from >= len)
        from = len - 1;
    }

    for(; from > -1; from--)
    {
      if(from in this && this[from] === elt)
        return from;
    }
    return -1;
  };

function setMessageCheck(valore, pos)
{
	a_msg_dwr[pos] = valore;
}

function trim(stringa)
{
	stringa = stringa.replace(/^\s+/g, "");
	return stringa.replace(/\s+$/g, "");
}

function check_dati()
{
	var oInp = null;
	var ret = true;
	var msg = 'Mancano i seguenti campi:\n';
	var msg_tmp;
	var i;
	var j;
	var c = 0;
	
	for(i = 0; i < aCheck.length; i++)
	{
		if(aCheck[i] != '' && aStato[i] == '30')
		{
			oInp = document.all[aCheck[i]];
			
			if(oInp != null)
			{
				try
				{
					oInp.check_data();
				}
				catch(ex)
				{
				}
				
				if((oInp.value == '' || oInp.value == '-1') && oInp.style.visibility != 'hidden')
				{
					msg += aCheckDescr[i] + '\n';
					c++;
				}
			}
			
			oInp = null;
		}
	}
	
	for(i=0; i < a_msg_dwr.length; i++)
	{
		msg_tmp = '';
		msg_tmp = a_msg_dwr[i];
		
		if(msg_tmp != '' && msg_tmp != 'undefined' && msg_tmp != null)
		{
			msg += msg_tmp + '\n';
			c++;
		}
	}
	
	if(c > 0)
	{
		alert(msg);
		ret = false;
	}
	
	return ret;
}

function set_eventi_check()
{
	var i;
	var js;
	var js_tmp;
	var js_dwr;
	var oField;
	
	for(i = 0; i <= aNomeCampi.length; i++)
	{
		if(aIdenCheck[i] != '' && aNomeCampi[i] != '' && aEventiCampi[i] != '')
		{
			oField = document.all[aNomeCampi[i]];
			
			if(oField != null)
			{
				js_dwr = 'check_field_dwr(';
 			    js_dwr += '\'' + aIdenCheck[i] + '\',';
				
				if(aCampiGet[i] != '')
				{
 				    js_dwr += '\''+ aCampiGet[i] + '\',';
				}
				else
				{
	 			    js_dwr += '\''+ aNomeCampi[i] + '\',';
				}
				
				js_dwr += '\'' + aEventiCampi[i] + '\'';
				js_dwr += ');';
				
				js = oField.getAttribute(aEventiCampi[i]);
				
				if(js != null)
				{
					js_tmp = js.toString();
					js_tmp = js_tmp.substr(js_tmp.indexOf('{') + 2, (js_tmp.indexOf('}') - js_tmp.indexOf('{')) - 3);
					js_tmp += '\n';
				}
				else
				{
					js_tmp = '';
				}
				
				js = new Function(js_tmp + js_dwr);
				
				oField.setAttribute(aEventiCampi[i], js);
			}
		}
	}
}

function check_field_dwr(pIdenChk, pCampoGet, pCampoEvento)
{
	var par_dwr;
	var oField;
	var i;
	var a_campi;
	var campi;
	
	dwr_elab = true;
	
	a_campi = pCampoGet.split(",");
	campi = '';
	par_dwr = pIdenChk + '*';
	
	for(i = 0; i < a_campi.length; i++)
	{
		if(i > 0)
		{
			campi += '@';
		}
		
		if(a_campi[i] != '')
		{
			oField = document.all[a_campi[i]];
			if(oField != null)
			{
				campi += oField.value;
			}
		}
	}
	
	par_dwr += campi + '*' + pCampoEvento;
	
	dwrCheckCampo.check_field(par_dwr, response_field_dwr);
}

function response_field_dwr(pResponse)
{
	var i;
	var a_resp;
	var a_assign;
	var a_set;
	
	// INDICI
	// 0 -> OK, KO				V
	// 1 -> RETURN				V
	// 2 -> JS TRUE/FALSE		V
	// 3 -> JS AFTER			
	if(pResponse == '')
	{
		pResponse = 'KO*Errore risposta check!'
	}
	
	a_resp = pResponse.split('*');
	
	if(a_resp[0].toUpperCase() == 'OK')
	{
		// Operazione riuscita
		
		// JS TRUE/FALSE //
		if(a_resp[2] != '')
		{
			eval(a_resp[2])
		}
		
		// RETURN //
		a_assign = a_resp[1].split('@@');
		
		for(i=0; i < a_assign.length; i++)
		{
			if(a_assign[i] != '')
			{
				a_set = a_assign[i].split('=');
				
				if(a_set.length > 0)
				{
					document.all[a_set[0]].value = a_set[1];
				}
			}
		}
		
		// JS AFTER //
		if(a_resp[3] != '')
		{
			eval(a_resp[3])
		}
	}
	else
	{
		// Operazione fallita!
		//alert(a_resp[1]);
	}
	
	dwr_elab = false;
}

function copyStato()
{
	var idx;
	
	_a_status = new Array(aStato.length);
	
	for(idx = 0; idx < _a_status.length; idx++)
	{
		_a_status[idx] = aStato[idx];
	}
}

function setStatusField(stato, campo)
{
	var idx;
	var idxFind;
	var oTd = null;
	var classSet = '';
	
	campo = trim(campo);
	
	if(campo != null && campo != '')
	{
		idxFind = aCampiNome.lastIndexOf(campo);
		
		if(idxFind >= 0)
		{
			oTd = document.getElementById(aCampiNome[idxFind]);
			
			if(oTd != null)
			{
				classSet = oTd.className;
				
				if(classSet.indexOf('Link') > 0)
					classSet = 'classTdLabelLink';
				else
					classSet = 'classTdLabel';
				
				if(stato == '30')
					classSet += 'Obb';
				else
					if(stato == '50')
						classSet += 'Opt';
					else
						if(stato == '1')
						{
							document.all[aCheck[idxFind]].readOnly=true;
							//oTd.readOnly=true;
						}
				
				oTd.className = classSet;
			}
			
			oTd = null;
			
			aStato[idxFind] = stato;
		}
	}
}

function setStatusFieldMulti(stato, campi)
{
	var a_campi;
	var idx;
	
	a_campi = campi.split(',');
	
	for(idx = 0; idx < a_campi.length; idx++)
	{
		setStatusField(stato, a_campi[idx]);
	}
}

function setObligatoryField(campi)
{
	setStatusFieldMulti('30', campi);
}

function setImportantField(campi)
{
	setStatusFieldMulti('50', campi);
}

function setEditableField(campi)
{
	setStatusFieldMulti('20', campi);
}

function setReadOnlyField(campi)
{
	setStatusFieldMulti('1', campi);
}

function setDefaultField(campi)
{
	var a_campi;
	var idx;
	var idxFind;
	var tmp_campo;
	var stato;
	
	a_campi = campi.split(',');
	
	for(idx = 0; idx < a_campi.length; idx++)
	{
		tmp_campo = trim(a_campi[idx]);
		
		idxFind = aCampiNome.lastIndexOf(tmp_campo);
		
		if(idxFind >= 0)
		{
			stato = _a_status[idxFind];
			
			setStatusField(stato, tmp_campo);
		}
	}
}


/*
function getStatusFields(a_lbl_name)
{
	var idx;
	var oField;
	
	if(a_lbl_name != null)
	{
		a_status_label = new Array(a_lbl_name.length);
		
		for(idx = 0; idx < a_lbl_name.length; idx++)
		{
			oField = document.getElementById(a_lbl_name[idx]);
			
			if(oField != null)
			{
				a_status_label[idx] = oField.parentElement.className;
			}
		}
	}
	else
	{
		a_status_label = new Array(0);
	}
}
*/