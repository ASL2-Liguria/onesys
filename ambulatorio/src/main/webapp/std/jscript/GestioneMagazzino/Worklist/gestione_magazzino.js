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
	var doc = document.form_ric_maga;
	
	doc.hidWhere.value = parent.RicercaMagazzinoFrame.document.form_ric_maga.hidWhere.value;	
	
	doc.hidOrder.value = parent.RicercaMagazzinoFrame.document.form_ric_maga.hidOrder.value;	
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
	
	try{
		iden_mag = stringa_codici(iden);
	}
	catch(e){
		iden_mag = '';
	}
	
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

            document.form_mag.submit();
		}
        else
			if(operazione == 'CANC_MG_ART'){
				var opQuery = "2@update mg_art set attivo = 'N' where iden = " + stringa_codici(iden);
				//alert(opQuery);
				dwr.engine.setAsync(false);
				CJsUpdate.insert_update(opQuery, cbk_operazioni);
				dwr.engine.setAsync(true);
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


function cbk_operazioni(messaggio){
	CJsUpdate = null;
	if(messaggio != ''){
		alert(messaggio);
		return;
	}
	parent.RicercaMagazzinoFrame.applica_mg_art();
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
	var numeroTotalePagine = null;
	var numeroDigitato = null;
	
	numeroTotalePagine = document.form_ric_maga.num_tot_pag.value;
	numeroDigitato = document.all.vai_a_pagina.value;
	
	if (window.event.keyCode == 13)
	{
		window.event.keyCode = 0;
		
		//alert('TOT: ' + numeroTotalePagine);
		//alert('SCELTA: ' + numeroDigitato);
		
		if(isNaN(document.all.vai_a_pagina.value) || (parseInt(numeroTotalePagine) < parseInt(numeroDigitato)))
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


/**
*/
function movimentazioneCaricoScaricoArticolo(){
	var doc = parent.RicercaMagazzinoFrame.document.form_ric_maga;
	var mancano = '';
	var parametri = null;
	
	if(doc.descr_mov_art.value == '' || doc.txtDaData.value == '' || doc.txtAData.value == ''){
		if(doc.descr_mov_art.value == '')
			mancano = '\n- Descrizione Articolo';
			
		if(doc.txtDaData.value == '')
			mancano += '\n - Da Data';
			
		if(doc.txtAData.value == '')
			mancano += '\n - A Data';
			
		alert('Attenzione, inserire:' + mancano);
		return;
	}
	
	
	parametri = 'radsql.SP_MOVIMENTAZIONE_ARTICOLO';
	parametri += '@' + doc.descr_mov_art.value+'%';
	parametri += ',' + doc.txtDaData.value.substring(6,10)+doc.txtDaData.value.substring(3,5)+doc.txtDaData.value.substring(0,2);
	parametri += ',' + doc.txtAData.value.substring(6,10)+doc.txtAData.value.substring(3,5)+doc.txtAData.value.substring(0,2);
	parametri += '@TRUE@String';
	
	dwr.engine.setAsync(false);
	CJsUpdate.call_stored_procedure(parametri, cbk_movimentazioneCaricoScaricoArticolo);
	dwr.engine.setAsync(true);
}


/**
*/
function cbk_movimentazioneCaricoScaricoArticolo(messaggio){
	CJsUpdate = null;
	
	if(messaggio != '' && messaggio.indexOf('jsRemote.CJsUpdate') != -1){
		alert('ATTENZIONE: si è verificato il seguente errore:\n' + messaggio);
		return;
	}
	else
		alert(messaggio);
		
	parent.RicercaMagazzinoFrame.applica_mg_mov();		
}

