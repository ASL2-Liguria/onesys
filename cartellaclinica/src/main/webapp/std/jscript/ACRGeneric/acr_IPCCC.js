var _ACR_PARAMETER = new Object();

_ACR_PARAMETER._SQL_ELENCO_ACR 	= "select GET_HTML_ACR(#WHERE#, '#GRUPPO#') DESCRIZIONE from dual";
_ACR_PARAMETER._SQL_QUESITO_ACR = "select GET_QUESITO_ACR(#IDEN#, '#GRUPPO#', '#TIPO#') DESCRIZIONE from dual";
_ACR_PARAMETER._CALLBACK_LAST	= null;
_ACR_PARAMETER._CALLBACK_FIRST	= null;
_ACR_PARAMETER._GRUPPO			= null;

function creaDivACR(id_div, iden_padre, gruppo, call_back_ultimo, call_back_primo)
{	
	var div = id_div == '' ? undefined:document.all[id_div];
	var inputCode='';
	var inputDescr='';
	//alert(id_div + '\n' + iden_padre + '\n' + gruppo + '\n' + call_back_ultimo + '\n' + call_back_primo);
	if(typeof call_back_ultimo == 'function')
		_ACR_PARAMETER._CALLBACK_LAST = call_back_ultimo;
	else
		_ACR_PARAMETER._CALLBACK_LAST = null;
	
	if(typeof call_back_primo == 'function')
		_ACR_PARAMETER._CALLBACK_FIRST = call_back_ultimo;
	else
		_ACR_PARAMETER._CALLBACK_FIRST = null;
	
	_ACR_PARAMETER._GRUPPO = gruppo;

	if(typeof div == 'undefined')
	{ 
		// Non esiste il div, dunque lo creo!!
		div = document.createElement('DIV');
		div.id = id_div == '' ? 'clsACR':id_div;
		div.className = 'clsACR';
		
		if(id_div != '')
			document.all['body'].appendChild(div);
		else
		{
			div.style.display ='none';
		}
	}
		
	inputCode = document.createElement('input');
	inputCode.id = 'hCodeACR';
	inputCode.style.visibility = 'hidden';
	document.all['body'].appendChild(inputCode);
	
	inputDescr = document.createElement('input');
	inputDescr.id = 'hDescrACR';
	inputDescr.style.visibility = 'hidden';
	document.all['body'].appendChild(inputDescr);
	
	inputPosiz = document.createElement('input');
	inputPosiz.id = 'hIdenACR';
	inputPosiz.style.visibility = 'hidden';
	document.all['body'].appendChild(inputPosiz);

	if(caricaDivACR(div, iden_padre, gruppo))
		return _ACR_PARAMETER._OBJ_DIV_ACR;
	else
		null;
}

function coloraDivACR(div)
{
	div.style.background = div.numFiglio ? '#' + (225 - (parseInt(div.numFiglio) * 15)).toString(16) + 'F9FF':'#F2FEFF';
}

function caricaDivACR(div, iden_padre, gruppo)
{

	_ACR_PARAMETER._OBJ_DIV_ACR = null;

	if(typeof div != 'undefined' && div.nodeName == 'DIV')
	{
		_ACR_PARAMETER._OBJ_DIV_ACR = div;
		
		dwr.engine.setAsync(false);
		
		toolKitDB.getResultData(_ACR_PARAMETER._SQL_ELENCO_ACR.replace(/\#WHERE#/g, iden_padre).replace(/\#GRUPPO#/g, gruppo), respCaricaDivACR);
		
		dwr.engine.setAsync(true);
	}
	
	return true;
}

function respCaricaDivACR(risultato)
{
	_ACR_PARAMETER._OBJ_DIV_ACR.innerHTML = risultato;
}

function apriChiudiNodoACR(nodo, iden, gruppo)
{
	var div;
	var hDescr = document.getElementById('hDescrACR');
	var hCode = document.getElementById('hCodeACR'); 
	var hIden = document.getElementById('hIdenACR');
	
	//alert('iden: '+nodo.childNodes[0].iden);

	document.getElementById('rifIdenPadre').value= nodo.childNodes[0].iden;
	
	//var idenPadre = nodo.iden;

	if(typeof nodo != 'undefined')
	{
		if(nodo.id == 'ACRSel')
		{
			div = nodo.getElementsByTagName('DIV').item(0);
			
			if(typeof div != 'undefined'){

				jQuery(div).fadeOut(500, function(){nodo.removeChild(div);});
			}
			
			nodo.id = '';
		}
		else
		{
			div = creaDivACR('', iden, gruppo, _ACR_PARAMETER._CALLBACK_LAST, _ACR_PARAMETER._CALLBACK_FIRST);
			
			if(div.innerHTML != '<OL></OL>' && div.innerHTML != '')
			{
				nodo.id = 'ACRSel';
				nodo.appendChild(div);
				
				if(typeof div.numFiglio == 'undefined')
				{
					if(typeof div.parentElement != 'undefined' && typeof div.parentElement.parentElement != 'undefined' && typeof div.parentElement.parentElement.parentElement != 'undefined')
					{
						if(typeof div.parentElement.parentElement.parentElement.numFiglio != 'undefined')
							div.setAttribute('numFiglio', parseInt(div.parentElement.parentElement.parentElement.numFiglio, 10) + 1);
						else
							div.setAttribute('numFiglio', 1);
					}
				}
				
				coloraDivACR(div);

				jQuery(div).fadeIn(500, function(){});
			}
		}
	}
}

function avviaNodoACR(iden, iden_padre, iden_figlio, obj)
{	
	var hDescr = document.getElementById('hDescrACR');
	var hCode = document.getElementById('hCodeACR'); 
	var hIden = document.getElementById('hIdenACR');

	
	if(typeof obj.parentElement.parentElement.parentElement.numFiglio != 'undefined' && _ACR_PARAMETER._CALLBACK_LAST != null)
	{
		var descr_padre = obj.parentElement.parentElement.parentElement.parentElement.childNodes[0].innerText;
		var codice_padre = (obj.codPadre).toString() ;
		var codice = (obj.codice).toString() ;
		var iden_padre = obj.parentElement.parentElement.parentElement.parentElement.childNodes[0].iden; 

		if (obj.parentElement.innerText == 'no entry'){
			
			hDescr.value = ' .../ ' + descr_padre;
			hCode.value = codice_padre;
			hIden.value = iden_padre;
			
		}else{
			
			hDescr.value = ' .../ ' + descr_padre + ' / ' + obj.parentElement.innerText;
			hCode.value = codice_padre + '/' + codice ;
			hIden.value = iden_padre + '/' + iden ;
					
			/*}else{
			hDescr.value= nodo.getElementsByTagName('A')[0].innerText;
			hCode.value = hCode.value + iden;
			}*/
		}

	
		_ACR_PARAMETER._CALLBACK_LAST(iden, iden_padre, iden_figlio, obj.innerHTML);
		
	}
}

function avviaNodoACRDetail(iden, iden_padre, iden_figlio, descr, obj)
{
	var risposta = null;
	
	if(typeof descr != 'undefined' && _ACR_PARAMETER._CALLBACK_LAST != null)
	{
		if(typeof obj != 'undefined')
		{
			dwr.engine.setAsync(false);
			
			toolKitDB.getResultData(_ACR_PARAMETER._SQL_QUESITO_ACR.replace(/\#IDEN#/g, iden).replace(/\#GRUPPO#/g, _ACR_PARAMETER._GRUPPO).replace(/\#TIPO#/g, 'DETAIL'), respCaricaQuesito);
			
			dwr.engine.setAsync(true);
			
			risposta = _ACR_PARAMETER._CALLBACK_LAST(iden, iden_padre, iden_figlio, descr, respCaricaQuesito.quesito);
			
			if(typeof risposta == 'undefined' || risposta == null)
				risposta = true;
			
			if(risposta)
				obj.id = obj.id == '' ? 'DETAILSELEZIONATO':'';
		}
	}
}

function respCaricaQuesito(risposta)
{
	respCaricaQuesito.quesito = risposta;
}