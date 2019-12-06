var _a_status = null;
var _a_events = null;
var a_msg_dwr = new Array(100);
var _abilita_warning = false;

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
	try{
		a_msg_dwr[pos] = valore;
	}catch(e){alert("setMessageCheck - Error: " + e.description);}
}

// perche' viene usata espressione regolare 
// e non trim del js ?!?!
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
	var msg_warning = 'Avviso: non sono stati compilati i seguenti campi importanti:\n';
	var msg_tmp;
	var i;
	var j;
	var c = 0;
	var w = 0;
	

	try{
		for(i = 0; i < aCheck.length; i++)
		{
			if(aCheck[i] != '' && (aStato[i] == '30' || aStato[i] == '50'))
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
						if(aStato[i] == '30')
						{
							msg += aCheckDescr[i] + '\n';
							c++;
						}
						else
						{
							msg_warning += aCheckDescr[i] + '\n';
							w++;
						}
					}
				}
				
				oInp = null;
			}
		}
	}catch(e){
		alert("check_dati blocco 1 - Error:\n" + e.description +"\nindice:" + i);}
	
	try{
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
	}catch(e){alert("check_dati blocco 2 - Error:\n" + e.description +"\nindice:" + i);}
	
	try{
		if(c > 0)
		{
			alert(msg);
			ret = false;
		}
		else
		{
			if(w > 0 && _abilita_warning)
				alert(msg_warning);
		}
	}catch(e){alert("check_dati blocco 3 - Error:\n" + e.description);	}
	return ret;
}

function set_warning_out(attivo)
{
	_abilita_warning = attivo;
}

function set_eventi_check()
{
	var i;
	var js;
	var js_tmp;
	var js_dwr;
	var oField;
	
	try{
		for(i = 0; i <= aNomeCampi.length; i++)
		{
			try{
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
					// modifica del 20140304 - da momento che la chiamata
					//document.gestione_esame.provenienza.dwr();
					// in scheda_esame.js NON funziona
					// forzo eval SOLO per aEventiCampi[i]=="dwr"
					if  (aEventiCampi[i]=="dwr"){
						try{eval(js_dwr);}catch(e){
							//alert(e.description);
						}
					}
					oField.setAttribute(aEventiCampi[i], js);
				}
			 }
			}
			catch(e){
				alert("Error in set_eventi");
			}
		}
	}catch(e){
		alert("set_eventi_check - Error");
		alert("set_eventi_check - Error: " +  e.description);	
		alert("Indice:" + i +  "aNomeCampi[i]: " + aNomeCampi) ;
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
	try{
		a_campi = pCampoGet.split(",");
		campi = '';
		par_dwr = pIdenChk + '§';
		
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
		
		par_dwr += campi + '§' + pCampoEvento;
	}catch(e){alert("check_field_dwr - Error: " + e.description);}

	try{
		dwr.engine.setAsync(false);
		dwrCheckCampo.check_field(par_dwr, response_field_dwr);
		dwr.engine.setAsync(true);
	}catch(e){alert("dwrCheckCampo.check_field- Error: " + e.description);}
}

function response_field_dwr(pResponse)
{
	var i;
	var a_resp;
	var a_assign;
	var a_set;
	
	
	try{
		// INDICI
		// 0 -> OK, KO				V
		// 1 -> RETURN				V
		// 2 -> JS TRUE/FALSE		V
		// 3 -> JS AFTER			
		if(pResponse == '')	{		pResponse = 'KO*Errore risposta check!'	}
		a_resp = pResponse.split('*');
		
		if(a_resp[0].toUpperCase() == 'OK')
		{
			// Operazione riuscita
			// JS TRUE/FALSE //
			if(a_resp[2] != '')		{			eval(a_resp[2])		}
			// RETURN //
			a_assign = a_resp[1].split('@@');
			for(i=0; i < a_assign.length; i++)
			{
				if(a_assign[i] != '')
				{
					a_set = a_assign[i].split('=');
					if(a_set.length > 0)				{					document.all[a_set[0]].value = a_set[1];				}
				}
			}
			// JS AFTER //
			if(a_resp[3] != '')		{			eval(a_resp[3])		}
		}
		else
		{
			// Operazione fallita!
			//alert(a_resp[1]);
		}
		dwr_elab = false;
	}catch(e){alert("response_field_dwr - Error: " + e.description);}	
}

function copyStato()
{
	var idx;
	var js;
	var js_tmp;
	var js_origine;

	try{
		_a_status = new Array(aStato.length);
		_a_events = new Array(aEventiCampi.length);
		
		for(idx = 0; idx < _a_status.length; idx++)
		{
			_a_status[idx] = aStato[idx];
			_a_events[idx] = aEventiCampi[idx];
		}
	}catch(e){alert("copyStato - Error: " + e.description);}	

}

function setStatusField(stato, campo, js_enable)
{
	var idx;
	var idxFind;
	var oTd = null;
	var classSet = '';
	var js;
	var js_tmp;
	var js_dwr;
	
	try{
		if(js_enable == null)
			js_enable = true;
		
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
					
					if(classSet.indexOf('Link') > 0 && stato != '1')//if((classSet.indexOf('Link') > 0 || aEventiCampi[idxFind].toUpperCase() == 'ONCLICK') && stato != '1')
						classSet = 'classTdLabelLink';
					else
						classSet = 'classTdLabel';
					
					if(stato == '30')
						classSet += 'Obb';
					else
						if(stato == '50')
							classSet += 'Opt';
					
					oTd.className = classSet;
					
					if(stato == '1' || !js_enable)
					{
						js = new Function('');
					}
					else
					{
						js_dwr = 'check_field_dwr(';
						js_dwr += '\'' + aIdenCheck[idxFind] + '\',';
						
						if(aCampiGet[idxFind] != '')
						{
							js_dwr += '\''+ aCampiGet[idxFind] + '\',';
						}
						else
						{
							js_dwr += '\''+ aNomeCampi[idxFind] + '\',';
						}
						
						js_dwr += '\'' + aEventiCampi[idxFind] + '\'';
						js_dwr += ');';
						
						js = oTd.getAttribute(aEventiCampi[idxFind]);
						
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
					}
					
					oTd.setAttribute(aEventiCampi[idxFind], js);
				}
				
				oTd = null;
				
				aStato[idxFind] = stato;
			}
		}
	}catch(e){alert("setStatusField - Error: " + e.description);}		
}

function setStatusFieldMulti(stato, campi)
{
	var a_campi;
	var idx;
	try{
		a_campi = campi.split(',');
		
		for(idx = 0; idx < a_campi.length; idx++)
		{
			setStatusField(stato, a_campi[idx]);
		}
	}catch(e){alert("setStatusFieldMulti - Error: " + e.description);}			
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

function setDisabledField(fields)
{
	setEnabledDisabledField(fields, true);
}

function setEnabledField(fields)
{
	setEnabledDisabledField(fields, false);
}

function setEnabledDisabledField(fields, stato)
{
	var a_field;
	var idx;
	var oField;
	
	try{
		a_field = fields.split(',');
		
		for(idx = 0; idx < a_field.length; idx++)
		{
			oField = document.all[a_field[idx]];
			if(oField != null)
			{
				oField.readOnly = stato;
			}
		}
	}catch(e){alert("setEnabledDisabledField - Error: " + e.description);}				
}

function setDefaultField(campi, js_enable)
{
	var a_campi;
	var idx;
	var idxFind;
	var tmp_campo;
	var stato;
	
	try{
		// aggiunto per DEMA !!!
		/*if (_a_status==null || _a_status=="undefined" || typeof(_a_status)=="undefined"){				
			copyStato();
		}*/
		// *******************
		if(js_enable == null)
			js_enable = true;
		
		a_campi = campi.split(',');
		
		for(idx = 0; idx < a_campi.length; idx++)
		{
			tmp_campo = trim(a_campi[idx]);
			
			idxFind = aCampiNome.lastIndexOf(tmp_campo);
			
			if(idxFind >= 0)
			{
				if (_a_status!=null && _a_status!="undefined" && typeof(_a_status)!="undefined"){
					stato = _a_status[idxFind];
					if (stato!=null && stato!="undefined" && typeof(stato)!="undefined"){
						setStatusField(stato, tmp_campo, js_enable);
					}
				}
			}
		}
	}
	catch(e){
		alert("setDefaultField - Error: " + e.description);
		alert("setDefaultField - idx: " + idx);		
		alert("setDefaultField - a_campi[idx]: " + a_campi[idx]);		
		alert("setDefaultField - tmp_campo: "+ tmp_campo +", idxFind: " + idxFind);
		alert("setDefaultField - _a_status: "+ _a_status);
		alert("setDefaultField - stato: "+ stato);
		alert("setDefaultField - aCampiNome: " + aCampiNome);		
		
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