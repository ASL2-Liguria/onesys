function check_ora_slot(objOra, slot)
{
	if(slot == null || slot == 0)
	{
		slot = 1;
	}
	var hh = '';
	var mm = '';
	var ora = objOra.value;
	var minuti = (parseInt(ora.substring(0, 2), 10) * 60) + (parseInt(ora.substring(3, 5), 10));
	var diviso = Math.round(minuti/slot);
	var moltiplica = diviso * slot;
	hh = '' + Math.floor(moltiplica/60);
	mm = '' + moltiplica % 60;
	if(hh.length < 2)
	{
		hh = '0' + hh;
	}
	if(mm.length < 2)
	{
		mm = '0' + mm;
	}
	objOra.value = hh + ':' + mm;
}

function genera_stringa_gg()
{
	var sRet = '';
	var i;
	
	for(i=0; i < a_iden_giorno.length; i++)
	{
		if(sRet != '')
		{
			sRet += '#';
		}
		
		if(a_iden_giorno.length == 1)
		{
			sRet += a_iden[i] + '@' + a_iden_giorno[i] + '@' + document.giorni.ora_apre.value + '@' + document.giorni.ora_chiude.value;
		}
		else
		{
			sRet += a_iden[i] + '@' + a_iden_giorno[i] + '@' + document.giorni.ora_apre[i].value + '@' + document.giorni.ora_chiude[i].value;
		}
	}
	
	return sRet;
}