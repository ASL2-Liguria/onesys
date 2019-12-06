function seleziona_prenotati(stato)
{
	try{
		for(var i=0; i < a_prenotati.length; i++)
		{
			if(document.all.oTable.rows(i).style.backgroundColor != sel)
			{
				if(stato == a_prenotati[i])
				{
					illumina_multiplo(i, a_indice_pren);
				}
			}
		}
	}catch(e){alert("seleziona_prenotati - Error: " + e.description);}
}

function aggiorna_calendario()
{
	parent.frameOpzioni.aggiorna('CDC');
}

function getIdenEsa(idx)
{
	var sRet = '';
	var i, j;
	var aIdx;

	try{
		idx += '';
		idx = idx.toLowerCase();

		if(idx == 'undefined')
		{
			for(i=0; i < a_prenotati.length; i++)
			{
				if(a_iden_esa[i] != '')
				{
					if(a_prenotati[i] == 'N')
					{
						sRet += (sRet != '' ? ',':'') + a_iden_esa[i];
					}
				}
			}
		}
		else
		{
			aIdx = idx.split('*');
			for(i=0; i < aIdx.length; i++)
			{
				for(j = 0; j < a_indice_pren.length; j++)
				{
					if(aIdx[i] == a_indice_pren[j])
					{
						sRet += (sRet != '' ? ',':'') + a_iden_esa[j];
					}
				}
			}
		}

		if(sRet == '')
		{
			sRet = '-1';
		}
	}catch(e){//alert("getIdenEsa - Error: " + e.description);
	}
	return sRet;
}

function getIdxEsa()
{
	var sRet = '';
	var i;
	
	try{
		for(i=0; i < a_prenotati.length; i++)
		{
			if(a_iden_esa[i] != '')
			{
				if(a_prenotati[i] == 'N')
				{
					sRet += (sRet != '' ? ',':'') + (i-1);
				}
			}
		}
	}catch(e){alert("getIdxEsa - Error: " + e.description);}
	return sRet;
}

function getIdxSel()
{
	var sRet = '';
	try{
		for(var i=0; i < a_prenotati.length; i++)
		{
			if(document.all.oTable.rows(i).style.backgroundColor == sel)
			{
				sRet += (sRet != '' ? '*':'') + a_indice_pren[i];
			}
		}
	}catch(e){alert("getIdxSel - Error: " + e.description);}
	return sRet;
}

function count_rimanenti_esami()
{
	var i;
	var cRet = 0;
	
	for(i=0; i<a_prenotati.length; cRet += a_prenotati[i++] == 'N' ? 1:0);
	
	//cRet -= (i != 0);
	
	return cRet;
}

function registra()
{
	var cEsa = count_rimanenti_esami();
	
	if(cEsa > 0)
	{
		alert('Attenzaione! Mancano ancora ' + cEsa + ' da prenotare!');
	}
	else
	{
		parent.document.location.replace('prenotazioneRegistrazione');
	}
}

function annulla_prenotazione()
{
	var ind = getIdxSel();
	
	if(ind == '')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		prenDWRClient.ripristina_esami(ind, check_remove);
	}
}

function cancella_prenotazione()
{
	var ind = getIdxSel();
	
	if(ind == '')
	{
		alert('Selezionare almeno un esame!');
	}
	else
	{
		prenDWRClient.rimuovi_esami(ind, check_remove);
	}
}

function check_remove(msg)
{
	var par;
	
	if(msg != null && msg != '')
	{
		alert(msg);
	}
	else
	{
		par = 'N*' + baseUser.IDEN_PER + '*' + ip_locale;
		
		prenDWRClient.libera_tutto(par);
		
		document.location.replace('consultazioneRiepilogo');
	}
}