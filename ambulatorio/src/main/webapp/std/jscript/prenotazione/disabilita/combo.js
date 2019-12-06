var sCampi = 'select DESCR, IDEN from TAB_';
var sWhere = ' where ATTIVO = \'S\' and IDEN_';
var sSql = '';
var oCombo = null;

function aggiorna_cmb(id, tab, campo, cmbName, cmbDel)
{
	init_combo(cmbDel);
	
	if(id != '')
	{
		oCombo = document.all[cmbName];
		sSql = sCampi + tab + sWhere + campo + ' = ' + id;
		disabilitaMacchinaDWR.carica_combo(sSql, carica_cmb);
	}
}

function carica_cmb(valore)
{
	var aTmp;
	var aDescr;
	var aVal;
	var i;
	
	if(valore != null && valore != '' && valore.indexOf('*') > 0)
	{
		aTmp = valore.split('*')
		aDescr = aTmp[0].split(',');
		aVal = aTmp[1].split(',');
		
		oCombo.options[oCombo.length] = new Option('', '');
		
		for(i = 0; i < aDescr.length && i < aVal.length; i++)
		{
			oCombo.options[oCombo.length] = new Option(aDescr[i], aVal[i]);
		}
	}
}

function init_combo(nCmb)
{
	var i, j;
	var aCmb
	var oCmb;
	
	if(nCmb != null)
	{
		aCmb = nCmb.split(',');
		
		for(i = 0; i < aCmb.length; i++)
		{
			oCmb = document.all[aCmb[i]];
			for(j = oCmb.length - 1; j >= 0 ; j--)
			{
				oCmb.options[j] = null;
			}
		}
	}
}

function seleziona_dati(cmbName, cmbValue)
{
	var a_cmb = cmbName.split(',');
	var a_val = cmbValue.split(',');
	var i;
	var j;
	
	for(i=0; i < a_cmb.length; i++)
	{
		if(a_cmb[i] != '')
		{
			oCombo = document.all[a_cmb[i]];
			if(oCombo != null)
			{
				for(j = 0; j < oCombo.length; j++)
				{
					if(oCombo.options[j].value == a_val[i])
					{
						oCombo.options[j].selected = true;
					}
				}
			}
			oCombo = null;
		}
	}
}