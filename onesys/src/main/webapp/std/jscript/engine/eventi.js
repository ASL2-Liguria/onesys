var _a_events = null;

function setEventPage(id, ev, js)
{
	var obj = document.all[id];
	var js_obj;
	var js_tmp;
	
	if(typeof obj != 'undefined')
	{
		if(typeof obj.length != 'undefined' && obj.type != 'select-one' && obj.type != 'text' && obj.type != 'select-multiple')
		{
			for(var idx = 0; idx < obj.length; idx++)
			{
				js_obj = obj[idx].getAttribute(ev);
				
				if(js_obj != null && (typeof js_obj != 'undefined'))
				{
					js_tmp = js_obj.toString();
					js_tmp = js_tmp.substr(js_tmp.indexOf('{') + 2, (js_tmp.indexOf('}') - js_tmp.indexOf('{')) - 3);
					js_tmp += '\n';
				}
				else
					js_tmp = '';
				
				obj[idx].setAttribute(ev, new Function(js_tmp + js))
			}
		}
		else
		{
			js_obj = obj.getAttribute(ev);
			
			if(js_obj != null && (typeof js_obj != 'undefined'))
			{
				js_tmp = js_obj.toString();
				js_tmp = js_tmp.substr(js_tmp.indexOf('{') + 2, (js_tmp.indexOf('}') - js_tmp.indexOf('{')) - 3);
				js_tmp += '\n';
			}
			else
				js_tmp = '';
			
			obj.setAttribute(ev, new Function(js_tmp + js))
		}
	}
}

function runEventPage(key, ev, tipo, sito)
{
	dwr.engine.setAsync(false);
	
	eventDWR.processEvent(new Array(key, ev, tipo, sito));
	
	dwr.engine.setAsync(true);
}

function setFieldDWR(campi, key, ev, tipo, sito)
{
	var a_campi = campi.split(',');
	var idx;
	var idx_sub;
	var valore;
	
	dwr.engine.setAsync(false);
	
	for(idx = 0; idx < a_campi.length; idx++)
	{
		if(trim(a_campi[idx]) != '')
		{
			valore = '';
			
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					for(idx_sub = 0; idx_sub < document.all[a_campi[idx]].length && valore == ''; idx_sub++)
					{
						if(document.all[a_campi[idx]][idx_sub].checked)
							valore = document.all[a_campi[idx]][idx_sub].value;
					}
				}
				else
					valore = document.all[a_campi[idx]].value;
			}
			else
			{
				if(document.all[a_campi[idx]].type == 'checkbox')
				{
					if(document.all[a_campi[idx]].checked)
						if(document.all[a_campi[idx]].value != '')
							valore = document.all[a_campi[idx]].value;
						else
							valore = 'S'; // Default
					else
						valore = '';
				}
				else
					valore = document.all[a_campi[idx]].value;
			}
			
			eventDWR.setFieldForm(a_campi[idx], valore);
		}
	}
	
	eventDWR.execEvent(new Array(key, ev, tipo, sito), responseEventPage);
	
	dwr.engine.setAsync(true);
}

function responseEventPage(risposta)
{
	var idx;
	
	if(risposta != null && typeof risposta.length != 'undefined')
	{
		_a_events = new Array(risposta.length);
		
		for(idx = 0; idx < risposta.length; _a_events[idx] = new Function(risposta[idx++]));
		
		executeEvent(0);
	}
	else
	{
		alert('Errore durante la processione degli eventi!');
	}
}

function executeEvent(idx)
{
	var ret = _a_events[idx] != null ? _a_events[idx]():'';
	
	if(++idx < _a_events.length)
		return executeEvent(idx);
	else
	{
		a_events = new Array(0);
		return null;
	}
}