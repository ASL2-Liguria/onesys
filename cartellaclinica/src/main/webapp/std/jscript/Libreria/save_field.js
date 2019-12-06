var risp_dwr;

function chk_load_dati_page(ret)
{
	if(ret != null && ret != '')
		risp_dwr = ret;
}

function load_dati_page(nodo)
{
	var par = nodo + '§';
	var tmp = '';
	var aType = new Array('input', 'hidden', 'textarea', 'select');
	var aInp;
	var idxType
	var idxElement;
	risp_dwr='';
	
	for(idxType = 0; idxType < aType.length; idxType++)
	{
		aInp = document.getElementsByTagName(aType[idxType]);
		
		for(idxElement = 0; idxElement < aInp.length; idxElement++)
		{
			if(aInp[idxElement].type == 'checkbox')
			{
				if(aInp[idxElement].checked)
				{
					tmp += (tmp == '' ? '':'ççç') + aInp[idxElement].name + '=' + aInp[idxElement].value;
				}
				else
				{
					tmp += (tmp == '' ? '':'ççç') + aInp[idxElement].name + '=';
				}
			}
			else
			{
				tmp += (tmp == '' ? '':'ççç') + aInp[idxElement].name + '=' + aInp[idxElement].value;
			}
		}
	}
	
	par += tmp;
	
	dwr.engine.setAsync(false);
	
	fieldDWR.readDati(par, chk_load_dati_page);
	
	dwr.engine.setAsync(false);
	
	return risp_dwr;
}