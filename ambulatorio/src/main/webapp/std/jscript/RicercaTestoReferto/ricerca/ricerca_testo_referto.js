function applica()
{
	try
	{
		//parent.Worklist.document.form.iden.value;
		document.form.action = 'SL_RicTestoRef_Worklist?classe=CRicTestoRef_Worklist';
		document.form.target = 'Worklist';
	}
	catch(e)
	{
		alert('prova:' + e);
		document.form.action = 'SL_RicTestoRef_Worklist?classe=listaPrecedentiEngine_RicercaTestoReferto';
		document.form.target = '_self';
	}
	
	var and_or;
	if(document.form.testo.value.substring(0,1) == '%' && document.form.testo.value.substring(1,2) == '%')
	{
		alert(ritornaJsMsg('alert_%'));
		document.form.testo.value = '';
		document.form.testo.focus();
		return;
	}
	else
		if(document.form.testo.value == '' || document.form.testo.value.length < 2)
		{
			alert(ritornaJsMsg('alert_testo'));
			if(document.getElementById('div').style.display != 'none')
				document.form.testo.focus();
			return;
		}
	
	crea_worklist();
}

function crea_worklist()
{
	if(document.form.and_or[0].checked == 1)
		and_or = document.form.and_or[0].value;
	else
		and_or = document.form.and_or[1].value;

	/*CONTROLLO CAMPO TESTO*/
	if(document.form.testo.value != '')
	{
		controllo_caratteri_testo();
		
		var blank_end_string = 0;
		for(i = document.form.testo.value.length; i > 0; i--)
		{
			if(document.form.testo.value.substring(i-1, i) == ' ')
				blank_end_string = blank_end_string+1;

			if(document.form.testo.value.substring(i-2, i-1) != ' ' && document.form.testo.value.substring(i-2, i-1) != '"')
				i=0;
		}
		//alert(blank_end_string);
		
		/*testo senza spazi bianchi alla fine della stringa da ricercare nel testo*/
		document.form.testo.value = document.form.testo.value.substring(0, document.form.testo.value.length-blank_end_string);
		/*sostituisco gli spazi bianchi con il carattere - */
		document.form.htesto.value = document.form.testo.value.replace(/ /g, '-');

		//alert('REPLACE MENO: ' + document.form.htesto.value);
		if(controllo_ricerca_sequenza_corretta())
			return;

		document.form.hwhere.value = document.form.htesto.value.replace(/-/g, ' ' + and_or + ' ');
		//alert('REPLACE AND/OR: ' + document.form.htesto.value);
	}

	/*CONTROLLO CAMPI DATA*/
	if(document.form.txtDaData.value != '' || document.form.txtAData.value != '')
	{
		var da_data = document.form.txtDaData.value.substring(6,10)+document.form.txtDaData.value.substring(3,5)+document.form.txtDaData.value.substring(0,2);		
	    var a_data  = document.form.txtAData.value.substring(6,10)+document.form.txtAData.value.substring(3,5)+document.form.txtAData.value.substring(0,2);	
		var where_cond_data = '';

		if(da_data != '' && a_data != '')
		{
			if(a_data < da_data)
			{
				alert(ritornaJsMsg('alert_data'));
				return;
			}
			where_cond_data = " AND DAT_REF >= '" + da_data + "' AND DAT_REF <= '" + a_data + "'";
		}
		else
			if(da_data != '')
				where_cond_data = " AND DAT_REF >= '" + da_data + "'";
			else
				where_cond_data = " AND DAT_REF <= '" + a_data + "'";
				
		document.form.hrange_data_ref.value = where_cond_data;
	}
	

	if(debug == 1)
		alert('WHERE COND: ' + document.form.hwhere.value + document.form.hrange_data_ref.value);

	document.form.submit();
}


function resetta()
{
	document.form.testo.value = '';
	document.form.txtDaData.value = '';
	document.form.txtAData.value = '';
	document.form.and_or[1].checked = 1;

	document.form.hrange_data_ref.value = '';
	document.form.hwhere.value = '';
	
	if(document.getElementById('div').style.display != 'none')
	document.form.testo.focus();
}


function intercetta_tasti()
{
	if (window.event.keyCode==13)
	{
     window.event.keyCode = 0;
     applica();
 	}
}

/*
	Funzione per il controllo della correttezza della stringa di testo da ricercare all'interno di un referto
	(il campo di testo con questa regular expression deve contenere lettere e numeri e il caratteri 'speciali'
	 ", %, lo spazio più tutte le lettere accentate)

    * @return:							 TRUE se la ricerca può andare avanti
										 FALSE se i caratteri immessi non sono accettabili
*/
function controllo_caratteri_testo()
{
	var risultato = true;
	var re=/^[a-zA-Z]$|^[a-zA-Z0-9]$|^[a-zA-Z0-9\"\à\è\é\ì\ò\ù\ \%]+$/;
	var valore_in = document.form.testo.value;
	var check = valore_in.match(re);
	if(check)
	{
		valore_in = '';
		var s = new String(valore_in);
    	var sr = s.replace(/'/g, "");
	}
	else
	{
		if(document.form.testo.value == '')
			return;
 		alert(ritornaJsMsg('error_testo'));
		risultato = false;
		document.form.testo.value = '';
		document.form.testo.focus();
		return;
    }
	return risultato;
}

/*
Funzione che controlla se la ricerca deve essere fatta con la corretta sequenza in cui viene digitata
dall'utente; ovvero verrà racchiusa da doppi apici("testo da ricercare")

Prima di mettere le parole in AND o OR controllo che non vi siano doppi apici

*/
function controllo_ricerca_sequenza_corretta()
{
	var blocca = false;
	var inizio = -1;
	var fine   = -1;
	var testo = document.form.htesto.value;
	for(i = 0; i < testo.length; i++)
	{
		if(testo.substring(i, i+1) == '"')
		{
			inizio = i;	
			i = testo.length;
		}
	}
	for(j = inizio; j < testo.length; j++)
	{
			/*if(testo.substring(j, j+1) == ' ')
			{
				testo = testo.substring(i, j);
			}
			if(testo.substring(j, j+1) == '"')
			{
				fine = j+1;
			}*/
		if(testo.substring(j+1, j+2) == '"')
		{
			fine = j;	
			j = testo.length;
		}
	}
	//alert(inizio + '  ' + fine);
	if(inizio != -1 && fine == -1)
	{
		alert(ritornaJsMsg('error_spazi'));//Attenzione: manca un carattere " per delimitare la ricerca alla sequenza esatta di parole; oppure vi sono spazi bianchi all\'interno dei caratteri ".."
		blocca = true;
	}
	var sequenza = '';
	var sequenza_in_and = '';
	if(inizio != -1 && fine != -1)
	{
		sequenza = trim(testo.substring(inizio, fine));
		sequenza_in_and = sequenza.replace(/-/g, ' AND ');
		//alert('STRINGA FRA APICI CON AND: ' + sequenza_in_and);
		document.form.htesto.value = testo.substring(0, inizio) + sequenza_in_and + testo.substring(fine, testo.length);
	}
	return blocca;
}

function trim(stringa)
{
	stringa = stringa.replace(/^\s+/g, "");
	return stringa.replace(/\s+$/g, "");
}


function gestioneCalendario()
{
	jQuery('#txtDaData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	

	jQuery('#txtAData').datepick({showOnFocus: false, showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"></img>'});	

}