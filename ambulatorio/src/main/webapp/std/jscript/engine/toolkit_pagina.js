function _setVisibilityCampo(campi, stato)
{
	var a_campi = campi.split(',');
	
	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			document.all[a_campi[idx]].style.visibility = stato;
		}
	}

}

function _setVisibilityColumnCampo(campi, stato_campo, stato_colonna)
{
	var a_campi = campi.split(',');
	
	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					document.all[a_campi[idx]][0].parentElement.style.display = stato_colonna;
				}
				else
				{
					document.all[a_campi[idx]].parentElement.style.display = stato_colonna;
				}
			}
			else
			{
				document.all[a_campi[idx]].parentElement.style.display = stato_colonna;
			}
		}
	}
}


function _setVisibilityRowCampo(campi, stato_riga)
{
	var a_campi = campi.split(',');
	
	for(var idx = 0; idx < a_campi.length; idx++)
	{
		if(typeof document.all[a_campi[idx]] != 'undefined')
		{
			if(typeof document.all[a_campi[idx]].length != 'undefined')
			{
				if(document.all[a_campi[idx]][0].type == 'radio')
				{
					document.all[a_campi[idx]][0].parentElement.parentElement.style.display = stato_riga;
				}
				else
				{
					for(var i = 0; i < document.all[a_campi[idx]].length; document.all[a_campi[idx]](i++).parentElement.parentElement.style.display = stato_riga);
				}
					//document.all[a_campi[idx]].parentElement.parentElement.style.display = stato_riga;
			}
			else
			{
				document.all[a_campi[idx]].parentElement.parentElement.style.display = stato_riga;
			}
		}
	}
}

function _setVisibilityDiv(id, stato_div)
{
	var a_div = id.split(',');
	
	for(var idx = 0; idx < a_div.length; idx++)
	{
		obj = typeof document.all[a_div[idx]] == 'undefined' ? document.getElementsByName(a_div[idx]):document.all[a_div[idx]]
		if(typeof obj != 'undefined')
		{
			obj.style.display = stato_div;
		}
	}
}

function _generaSequenzaNomi(campo, idx_start, idx_end)
{
	var seq_ret = '';
	
	for(var idx = parseInt(idx_start, 10); idx <= parseInt(idx_end, 10); idx++)
	{
		if(seq_ret != '')
		{
			seq_ret += ',';
		}
		
		seq_ret += campo + idx;
	}
	
	return seq_ret;
}

function setVisibilityPage()
{
	document.body.style.visibility = 'visible';
}

function nascondiCampo(campi)
{
	_setVisibilityCampo(campi, 'hidden');
}

function visualizzaCampo(campi)
{
	_setVisibilityCampo(campi, 'visible');
}

function nascondiColonnaCampo(campi)
{
	_setVisibilityColumnCampo(campi, 'hidden', 'none');
}

function visualizzaColonnaCampo(campi)
{
	_setVisibilityColumnCampo(campi, 'visible', 'block');
}

function nascondiRigaCampo(campi)
{
	_setVisibilityRowCampo(campi, 'none');
}

function visualizzaRigaCampo(campi)
{
	_setVisibilityRowCampo(campi, 'block');
}

function nascondiRigaRangeCampo(campo, idx_start, idx_end)
{
	_setVisibilityRowCampo(_generaSequenzaNomi(campo, idx_start, idx_end), 'none');
}

function visualizzaRigaRangeCampo(campo, idx_start, idx_end)
{
	_setVisibilityRowCampo(_generaSequenzaNomi(campo, idx_start, idx_end), 'block');
}

function nascondiBloccoDiv(div)
{
	_setVisibilityDiv(div, 'none');
}

function visualizzaBloccoDiv(div)
{
	_setVisibilityDiv(div, 'block');
}

function allargaCampo(campi, dimensione)
{
	var idx;
	var a_campi;
	
	if(typeof dimensione == 'undefined')
	{
		dimensione = '100%';
	}
	
	a_campi = campi.split(',');
	
	for(idx = 0; idx < a_campi.length; idx++)
	{
		if(a_campi[idx] != '')
		{
			if(typeof document.all[a_campi[idx]] != 'undefined')
			{
				document.all[a_campi[idx]].style.width = dimensione;
			}
		}
	}
}

function setCheckedCampo(nome, indice)
{
	try
	{
		document.all[nome](indice).checked = true;
		document.all[nome](indice).onclick();
	}
	catch(ex)
	{
	}
}

//funzione che controlla se un elemento è associato alla classe
function hasClass(elemento,classe)
{	
	return elemento.className.match(new RegExp('(\\s|^)'+classe+'(\\s|$)'));
}

//funzione che aggiunge una classe all'elemento
function addClass(elemento,classe)
{
	if(!hasClass(elemento,classe))
	{
		elemento.className += " "+classe;
	}
}

//funzione che rimuove la classe all'elemento
function removeClass(elemento,classe)
{
	if(hasClass(elemento,classe))
	{
		var reg=new RegExp('(\\s|^)'+classe+'(\\s|$)');
		elemento.className=elemento.className.replace(reg,' ');
	}
}