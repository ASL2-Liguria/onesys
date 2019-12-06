var reg = false;

    
function checkora(campo)
{
	var vettore;
    valore = campo.value;
    carattere_divisore = '';
    if(valore=='')
	{
    	return;
    }
    indice_punto = valore.indexOf('.');
    indice_linea = valore.indexOf(':');
    if (indice_punto != -1)
	{
    	carattere_divisore = '.';
    }
    if (indice_linea != -1)
	{
    	carattere_divisore = ':';
    }
    if (carattere_divisore == '' )
	{
    	alert(ritornaJsMsg('a1'));
		campo.value = '';
        campo.focus();
        return;
    }
    vettore= valore.split(carattere_divisore);
    ore = vettore[0];
    if (ore=='')
	{
    	alert(ritornaJsMsg('a2'));
        campo.focus();
        return;
     }
     if ((parseInt(ore)>23) || (parseInt(ore)<0))
	 {
     	alert(ritornaJsMsg('a3'));
        campo.focus();
        return;
     }
     min = vettore[1];
     if (min=='')
	 {
      	alert(ritornaJsMsg('a4'));
        campo.focus();
        return;
      }
      if ((parseInt(min)>59) || (parseInt(min)<0))
	  {
      	alert(ritornaJsMsg('a5'));
        campo.focus();
        return;
       }
       if (parseInt(ore)<10)
	   {
        	ore = '0' + parseInt(ore,10);
       }
       if (parseInt(min)<10)
	   {
        	min = '0' + parseInt(min,10);
       }
       campo.value = ore + ':' + min;
}
       

function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}

function chiudi_ins_mod()
{
	var tipo_ricerca;
	var campo_descr;
	tipo_ricerca = opener.parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	if(tipo_ricerca == 'DESCR')
		campo_descr = document.form_fasce.descr.value;
    else
		campo_descr = document.form_fasce.cod_dec.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);
	self.close();
}

    
function salva()
{
	doc = document.form_fasce;
    if (doc.cod_dec.value=='')
	{
    	alert(ritornaJsMsg('a6'));
		doc.cod_dec.focus();
        return;
    }
    if (doc.descr.value=='')
	{
    	alert(ritornaJsMsg('a7'));
		doc.descr.focus();
        return;
    }

	if(doc.hora_ini.value == '' || doc.hora_fine.value == '')
	{
		if(doc.hora_ini.value == '')
		{
			alert(ritornaJsMsg('no_ora_ini'));
			doc.hora_ini.focus();
			return;
		}
		else
			if(doc.hora_fine.value == '')
			{
				alert(ritornaJsMsg('no_ora_fine'));
				doc.hora_fine.focus();
				return;
			}
	}
	
	if(document.form_fasce.htipo_fascia.value == '')
	{
		alert(ritornaJsMsg('no_tipologia'));
		return;
	}
	
	if(doc.attivo.checked==1)
    	doc.hattivo.value='N';
    else
        doc.hattivo.value='S';
		
	
    reg = true;
	doc.registrazione.value = reg;
    
	doc.submit();
    
    alert(ritornaJsMsg('a8'));
	chiudi_ins_mod();
}

    
function ver_ora(campo,tipo)
{
        checkora(campo);
}

/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_fasce.hora_ini.value = '';
	document.form_fasce.hora_fine.value = '';
	document.form_fasce.hora_ini.focus();
}