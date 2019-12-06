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
				{
					js_tmp = '';
				}
				
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
			{
				js_tmp = '';
			}
			
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
	var a_campi  = campi.split(',');
	var a_valore = new Array(campi.length);
	var idx;
	var idx_sub;
	var valore;
	
	for(idx = 0; idx < a_campi.length; idx++)
	{
		if(trim(a_campi[idx]) != '')
		{
			a_valore[idx] = '';
			
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					for(idx_sub = 0; idx_sub < document.all[a_campi[idx]].length && valore == ''; idx_sub++)
					{
						if(document.all[a_campi[idx]][idx_sub].checked)
						{
							a_valore[idx] = document.all[a_campi[idx]][idx_sub].value;
						}
					}
				}
				else
				{
					a_valore[idx] = document.all[a_campi[idx]].value;
				}
			}
			else
			{
				if(document.all[a_campi[idx]].type == 'checkbox')
				{
					if(document.all[a_campi[idx]].checked)
					{
						if(document.all[a_campi[idx]].value != '')
						{
							a_valore[idx] = document.all[a_campi[idx]].value;
						}
						else
						{
							a_valore[idx] = 'S'; // Default
						}
					}
					else
					{
						a_valore[idx] = '';
					}
				}
				else
				{
					a_valore[idx] = document.all[a_campi[idx]].value;
				}
			}
		}
		else
		{
			a_valore[idx] = '';
		}
	}
	
	dwr.engine.setAsync(false);
	
	if(a_campi.length > 0 && trim(campi) != '')
	{
		eventDWR.setFieldFormMulti(a_campi, a_valore);
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
	{
		return executeEvent(idx);
	}
	else
	{
		a_events = new Array(0);
		return null;
	}
}

if (typeof jQuery === 'function') {
	jQuery(window).load(function() {
		
		/**
		 * Ridefinisce l'evento keydown per gestire la pressione dei tasti BACKSPACE e DEL sugli elementi della pagina HTML.
		 * Se il tag dell'elemento rilevato è TEXTAREA oppure INPUT di tipo TEXT, PASSWORD, FILE e EMAIL, allora
		 * la cancellazione è consentita solo se gli attributi readonly o disabled sono falsi.
		 * Per impostazione predefinita, la pressione dei tasti BACKSPACE e DEL su altri elementi è disabilitata
		 * per evitare che il browser reindirizzi alla pagina precedente.
		 * 
		 * @author  gianlucab
		 * @version 1.0
		 * @since   2014-04-23
		 */
		jQuery(document).unbind('keydown').bind('keydown', function (event) {
			var doPrevent = false;
			if (event.keyCode === 8 ||  /* BACKSPACE */
				event.keyCode === 46) { /* DEL */
				var s = event.srcElement || event.target;
				if (s.tagName.toUpperCase() === 'TEXTAREA' ||
					(s.tagName.toUpperCase() === 'INPUT' &&	(
						s.type.toUpperCase() === 'TEXT' || s.type.toUpperCase() === 'PASSWORD' || s.type.toUpperCase() === 'FILE' || s.type.toUpperCase() === 'EMAIL' )
					)) {
					doPrevent = s.readOnly || s.disabled;
				}
				else {
					doPrevent = true;
				}
			}
			if (doPrevent) {
				event.preventDefault();
			}
		});
	
		/**
		 * Ricarica il frame interno se nel frame superiore il valore di CONTROLLO_ACCESSO è differente.
		 * 
		 * @author  gianlucab
		 * @version 1.0
		 * @since   2014-10-03
		 */
		try {
			if (typeof WindowCartella === 'object' && WindowCartella && typeof WindowCartella.CartellaPaziente === 'object') 
				WindowCartella.CartellaPaziente.controllaPaziente($('form[name=EXTERN] input[name=CONTROLLO_ACCESSO]').val());
		} catch(e) {
			alert(e.message);
		}
	});
	
	/**
	 * Gestore di eventi per supportare l'attributo maxlength (HTML5) sulle textarea.
	 * 
	 * @author  gianlucab
	 * @version 1.0
	 * @since   2015-01-12
	 */
    jQuery('textarea[maxlength]').live('keypress', function(e) {
        var maxlength = parseInt($(this).attr('maxlength'));
        if (!isNaN(maxlength)) {
            var text = $(this)[0].value;

            if (text.length >= maxlength) {
                $(this).val(text.substring(0, maxlength));
                e.preventDefault();
                return false;
            }
        }
    });
}
