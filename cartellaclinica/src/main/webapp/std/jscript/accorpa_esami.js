// Funzioni vari
function chiudi(doc)
{
	spedisci(doc, 'SL_RicercaPazienteFrameset?param_ric=COGN,NOME,DATA&rows_frame_uno=141&rows_frame_due=380,*&menuVerticalMenu=RiconciliaSpostaEsami&nome_funzione_ricerca=ric_cogn_nome_data(');
}

function conferma(doc)
{
	var aEsami;
	aEsami = getAllOptionCode('elencoD');
	if(aEsami != '')
	{
		doc.a_esami.value = aEsami;
		spedisci(doc, 'mergeRegistra');
	}
	else
	{
		// MESSAGGIO DI ERRORE!!!!
	}
}

function spedisci(doc, act)
{
	if(doc != null && act != null && act != '')
	{
		doc.target = '_self';
		doc.action = act;
		doc.submit();
	}

}


// Selezione e Deselezione degli esami
function sel_des(elenco, valore)
{
	if(elenco != null && valore != null)
	{
		var i;
		for(i = 0; i < elenco.length; i++)
		{
			elenco[i].selected = valore;
		}
	}
}

// Spostamenti esami...
function sposta_esame(elSorg, elDest)
{
	if(elSorg != null && elDest != null)
	{
		var i;
		for(i = elSorg.length-1; i >= 0; i--)
		{
			if(elSorg[i].selected)
			{
				var oOpt = document.createElement('Option');
				
				oOpt.text = elSorg.options(i).text;
				oOpt.value = elSorg.options(i).value;
				
				elDest.add(oOpt);
				
				elSorg.options.remove(i);
			}
		}
	}
}