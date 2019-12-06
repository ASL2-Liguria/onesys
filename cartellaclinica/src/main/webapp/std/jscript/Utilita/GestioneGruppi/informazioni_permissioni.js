function extractDescrPermTabelle(permissioni)
{
	var strRet='';
	if(permissioni == '') 
		return;
		
    switch(permissioni)
		{
        	case 'A':
        		strRet='[A] Enable';
        		break;
        	case 'T':
        		strRet='[T] Enable';
        		break;
			case 'E':
        		strRet='[E] Enable';
        		break;
			case 'R':
        		strRet='[R] Enable';
        		break;		
			case 'P':
        		strRet='[P] Enable';
        		break;	
			case 'O':
        		strRet='[O] Enable';
        		break;		
			case 'C':
        		strRet='[C] Enable';
        		break;
			case 'X':
        		strRet='[X] Enable';
        		break;
        	default:
        		strRet='[D] Disable';
        		break;
        }
	return strRet;
}


function extractDescrPermission(groupNum, cod, objToSet, byteNum)
{
	var strRet='';
	var codInt=' ';
	if(isNaN(groupNum)) 
		return;
    
	switch(groupNum)
    {
        case 1:
			switch(cod)
			{
				case 'X':
					strRet='[X] Administrator';
					break;
				case 'S':
					strRet='[S] Standard User';
					break;
				case 'L':
					strRet='[L] Read User';
					break;
				case 'D':
					strRet='[D] Disable';
					break;
				default:
					strRet='Undefined';
					codInt='K';
					break;
			}
			break;
        case 2:
			switch(cod)
			{
				case 'X':
					strRet='[X] Valida';
					break;
				case 'S':
					strRet='[S] Modifica';
					break;
				case 'L':
					strRet='[L] Lettura';
					break;
				case 'D':
					strRet='[D] Disable';
					break;
				default:
					strRet='Udefined';
					codInt='K';
					break;
			}
			break;
        case 3:
			switch(cod)
			{
				case 'S':
					strRet='[S] Administrator';
					break;
				case 'U':
					strRet='[U] Standard User';
					break;
				case 'D':
					strRet='[D] Disable';
					break;
				default:
					strRet='Undefined';
					codInt='K';
					break;
			}
			break;
        case 4:
			switch(cod)
			{
				case '0':
					strRet='[0] Disable';
					break;
				case '1':
					strRet='[1] Enable';
					break;
			}
			break;
        case 5:
			switch(cod)
			{
				case '0':
					strRet='[0] Disable';
					break;
				case '1':
					strRet='[1] Prenotato';
					break;
				case '2':
					strRet='[2] Accettato';
					break;
				case '3':
					strRet='[3] Eseguito';
					break;
				case '4':
					strRet='[4] Refertato';
					break;
				case '5':
					strRet='[5] Definitivo/Sbloccato';
					break;
				default:
					strRet='Undefined';
					codInt='K';
					break;
			}
			break;
        case 6:
			switch(cod)
			{
				case 'X':
					strRet='[X] Administrator';
					break;
				case 'S':
					strRet='[S] Primario';
					break;
				case 'L':
					strRet='[L] Read User';
					break;
				default:
					strRet='Undefined';
					codInt='K';
					break;
			}
			break;
        case 7:
			switch(cod)
			{
				case 'D':
					strRet='[D] Disable';
					break;
				case 'S':
					strRet='[S] Enable';
					break;
				default:
					strRet='Undefined';
					codInt='K';
					break;
			}
			break;
        }
        return strRet;
   }

function informazioni_permissioni()
{
	/*Il combo box contenente l'elenco dei gruppi ha come value un indice che mi serve
	 per trovare il nome del gruppo dall'array della pagina di visualizzazione elenco gruppi*/
	var indice_array_gruppo = document.form.gruppi.value;

	var cod_gruppo = opener.cod_dec[indice_array_gruppo];
	var descr_gruppo = opener.descr[indice_array_gruppo];
	var permission = opener.cod_ope[indice_array_gruppo];
	var permissioni_tabella = opener.permissioni_tabelle[indice_array_gruppo];

	var T=0;
    document.all.cod_gruppo.innerText = cod_gruppo;
    document.all.descr_gruppo.innerText = descr_gruppo;
    /*Prenotazione*/
    document.all.prenotazione.innerText=extractDescrPermission(1, permission.charAt(0), '', 1);
    /*Accettazione*/
    document.all.accettazione.innerText=extractDescrPermission(1, permission.charAt(1), '', 2);
    /*Esecuzione*/
    document.all.esecuzione.innerText=extractDescrPermission(1, permission.charAt(2), '', 3);
    /*Refertazione*/
    document.all.refertazione.innerText=extractDescrPermission(2, permission.charAt(3), '', 4);
    /*Modifica Anagrafica*/
    document.all.gestione_anagrafica.innerText=extractDescrPermission(1, permission.charAt(4), '', 5);
    /*Gestione Parametri*/
    document.all.gestione_parametri.innerText=extractDescrPermission(7, permission.charAt(5), '', 6);
    /*Tabelle Magazzino*/
    document.all.gestione_magazzino.innerText=extractDescrPermission(3, permission.charAt(6), '', 7);
    /*Referti definitivi*/
    document.all.referti_definitivi.innerText=extractDescrPermission(6, permission.charAt(7), '', 8);
	
	/*Ripristino Cancellati ed Altro*/
	document.all.ripristino_cancellati_altro.innerText=extractDescrPermission(4, permission.charAt(8), '', 9);
	
    /*Cancellazione Esami*/
	document.all.cancellazione_esami.innerText=extractDescrPermission(5, permission.charAt(9), '', 10);
	
	/*Gestione Tabelle*/
	document.all.sale_macch_aree.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(0));
	document.all.tick_onere.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(1));
	document.all.esami.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(2));
	document.all.ref_std_acr.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(3));
	document.all.prov.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(4));
	document.all.op_tec_med.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(5));
	document.all.cdc.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(6));
	document.all.statoPaz_fasceOra_prof.innerText=extractDescrPermTabelle(permissioni_tabella.charAt(7));

	//document.all.botChiudi.style.visibility='visible';
    //document.all.divInfo.style.display='block';
    //document.all.divGroup.style.display='none';

	for(T=0 ; T<document.all.gruppi.options.length ; T++)
    {
        if(document.all.gruppi.options[T].text == cod_gruppo.innerText)
        {
        	document.all.gruppi.options[T].selected=true;
        	break;
        }
    }
}

function chiudi(){
	self.close();
}