var reg = false;

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
		campo_descr = document.form_are.descr.value;
    else
		if(tipo_ricerca == 'COD_DEC')
			campo_descr = document.form_are.cod_dec.value;
		else
			if(tipo_ricerca == 'IDEN_MAC')
				campo_descr = document.form_are.cod_autom_macch.value;
		 	else
				if(tipo_ricerca == 'IDEN_SAL')
					campo_descr = document.form_are.cod_autom_sala.value;
	
	opener.parent.Ricerca.put_last_value(campo_descr);

	self.close();
}
    
function salva()
{
	reg = true;
    doc = document.form_are;
    if(doc.cod_dec.value == '')
	{
    	alert(ritornaJsMsg('a1'));
        doc.cod_dec.focus();
        return;
    }
    if(doc.descr.value == '')
	{
    	alert(ritornaJsMsg('a2'));
        doc.descr.focus();
        return;
    }

	for(T = 0 ; T < doc.elements.length ; T++)
	{
		obj = doc.elements[T];
		if(obj.name.length > 4 && obj.name.substr(0, 4) == 'apre' && obj.value != '')
		{
			obj = doc.elements[T+7];
			//alert(obj.name);
			if(obj.name.length > 6 && obj.name.substr(0,6) == 'chiude' && obj.value == '')
			{
				alert('Inserire orario di chiusura o cancellare orario di apertura');
				obj.focus();
				return;
			}
		}
	}

	if(doc.attivo.checked == 1)
    	doc.hattivo.value = 'N';
    else
        doc.hattivo.value = 'S';

 	/*if(doc.prenotabile.checked == 1 && doc.visa_cup.checked == 0)
		doc.hprenotabile.value = '0';
			
    if(doc.prenotabile.checked == 0 && doc.visa_cup.checked == 1)
		doc.hprenotabile.value = '1';
			
    if (doc.prenotabile.checked == 1 && doc.visa_cup.checked == 1) 
        doc.hprenotabile.value = '2';*/
		
		
	doc.hprenotabile.value = calcola_prenotabile();	
		

	doc.registrazione.value = reg;
    doc.submit();
    alert(ritornaJsMsg('a3'));
	
	/*
	Per l'operazione di inserimento la servlet 'ServletMain_config_giorno' viene richiamata dalla classe che effettua l'update:
	CAreeUpdate
	*/
	if(document.form_are.hop.value == 'MOD')
	{
		/*
		Apertura pagina di Jack collegata alla tabella TAB_CONFIG_GIORNO (dove vi sono gli orari).
		Come parametro verrà passato tab_are.iden
		*/
		//alert(document.form_are.iden.value);
		document.location.replace("ServletMain_config_giorno?iden_are="+document.form_are.iden.value);
	}
	/*else
		chiudi_ins_mod();*/
}


function calcola_prenotabile()
{
	var doc = document.form_are;
	var prenotabile = '';
	
	if(doc.prenotabile.checked == 1 && doc.visa_cup.checked == 0)
		prenotabile = '0';
			
    if(doc.prenotabile.checked == 0 && doc.visa_cup.checked == 1)
		prenotabile = '1';
			
    if (doc.prenotabile.checked == 1 && doc.visa_cup.checked == 1) 
        prenotabile = '2';
		
	return prenotabile;	
}


function check_attivo()
{
	doc = document.form_are;

	doc.prenotabile.disabled = doc.attivo.checked;
	doc.visa_cup.disabled    = doc.attivo.checked;
	
	if(doc.attivo.checked)
	{
		doc.prenotabile.checked  = !doc.attivo.checked;
		doc.visa_cup.checked     = !doc.attivo.checked;
	}
}

function checkNumber(oggetto)
{
	if(isNaN(oggetto.value) || oggetto.value == '0')
	{
		alert('Prego, inserire un valore numerico o superiore a 0!');
		oggetto.value = '';
		oggetto.focus();
		return;
	}
}

/*
	Funzione richiamata dalla funzione di callback del dwr (cbkJsCheck())
	contenuta nel file check.js
*/
function funzione()
{
	document.form_are.cod_dec.value = '';
	document.form_are.cod_dec.focus();
}