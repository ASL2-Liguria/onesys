var win_del = '';

function ricerca(numero_pagina)
{
	if(numero_pagina == '')
		document.form_ric_maga.pagina_da_vis.value = 1;
	else
		document.form_ric_maga.pagina_da_vis.value = numero_pagina;
	document.form_ric_maga.submit();
}

function getCampiRicerca(){
	document.form_ric_maga.hidWhere.value = parent.RicercaMagazzinoFrame.document.form_ric_maga.hidWhere.value;	
}
	  
function avanti(numero_pagina){
	document.form_ric_maga.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	document.form_ric_maga.submit();
}

function indietro(numero_pagina){
	document.form_ric_maga.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	document.form_ric_maga.submit();
}

            
function operazioni(operazione)
{
	var iden_mag = '';
	iden_mag = stringa_codici(iden);
	if(((operazione == 'CANC') || (operazione == 'MOD') || (operazione == 'GIACENZA')) && (iden_mag == ''))
	{
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
            
	if(operazione == 'GIACENZA')
	{
		var giacenze =  window.open('','winGiacenze','width=1000,height=600, status=yes, top=5,left=5');
		document.form_giacenze.iden_mag.value = iden_mag;
        document.form_giacenze.submit();
     }
	else
	{
		if(operazione == 'CANC')
		{
			win_del = window.open('','winMagUpd','top=1000000,left=0');
			document.form_mag.operazione.value = operazione;
            
			
			document.form_mag.iden_art.value = iden_mag;
			document.form_mag.iden_mag.value = iden_mag;
			
			
			//alert('Articolo: ' + document.form_mag.iden_art.value);

			
            document.form_mag.submit();
			//alert(ritornaJsMsg('cancellazione'));//Cancellazione effettuata
			//aggiorna_chiudi_canc();
			//win_del.close();
		}
        else
		{
			finestraUpdate = window.open('','winMagUpd','width=1000,height=600, status=yes, top=5,left=5, scrollbars=yes');
            document.form_mag.operazione.value = operazione;
            document.form_mag.iden_mag.value = iden_mag;
            document.form_mag.submit();
		}
	}
}

function cancellazione_effettuata()
{
	alert(opener.ritornaJsMsg('cancellazione'));//Cancellazione effettuata
	
	var pag_da_vis = opener.document.form_ric_maga.pagina_da_vis.value;
	var elenco_paz = opener.iden.length;
	
	if(elenco_paz == 1)
		pag_da_vis = pag_da_vis - 1;
		
	opener.parent.RicercaMagazzinoFrame.ricerca(pag_da_vis);

	self.close();
}

function aggiorna_chiudi_canc()
{
	var pag_da_vis = document.form_ric_maga.pagina_da_vis.value;
	var elenco_paz = iden.length;
	
	if(elenco_paz == 1)
		pag_da_vis = pag_da_vis - 1;
		
	parent.RicercaMagazzinoFrame.ricerca(pag_da_vis);
}


function vai_a_pagina()
{
	if (window.event.keyCode == 13)
	{
		window.event.keyCode = 0;
		
		if(isNaN(document.all.vai_a_pagina.value) || (document.form_ric_maga.num_tot_pag.value < document.all.vai_a_pagina.value))
		{
			if(isNaN(document.all.vai_a_pagina.value))
				alert(ritornaJsMsg('notanumber'));
			else	
				alert(ritornaJsMsg('nopag'));
				
			document.all.vai_a_pagina.focus();
			return;
		}
		else
			ricerca(document.all.vai_a_pagina.value);
	}
}

