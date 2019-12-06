// lo so... fa skifo... tutto!
// Variabili di conteggio degli esami da prenotare e già prenotati...
var _num_esami_totali    = 0;
var _num_esami_prenotati = 0;
var _ret_dwr = '';
var _ret_dwr_status = 'OK';
var _campi_ric = '';

function scelta_esami()
{
	var pagina = getUrlName();
	
	if(pagina != 'sceltaEsami')
	{
		if(pagina == 'schedaEsame')
		{
			parent.frameMaster.document.forms[0].tipo_registrazione.value = 'PC';
			// ambulatorio
			parent.frameMaster.document.forms[0].action = 'sceltaEsami?visualizza_metodica=N&cmd_extra=hideMan();';
			parent.frameMaster.document.forms[0].method = 'post';
			
			parent.frameMaster.document.forms[0].submit();
		}
		else
		{
			if(pagina == 'SL_RicercaPazienteFrameset')
			{
				save_dati_ricerca_paz();
			}
			
			apri_pagina('sceltaEsami?tipo_registrazione=PR&visualizza_metodica=N&cmd_extra=hideMan();');
		}
		
		colora_sel_desel('btSceltaEsami');
	}
}

function scheda_esami()
{
	var pagina = getUrlName();
	
	if(pagina != 'schedaEsame')
	{
		if(pagina == 'sceltaEsami')
		{
			parent.frameMaster.document.forms[0].tipo_registrazione.value = 'PR';
			parent.frameMaster.document.forms[0].action = 'javascript:next_prenotazione();';
			
			parent.frameMaster.avanti();
		}
		else
		{
			if(pagina == 'SL_RicercaPazienteFrameset')
			{
				save_dati_ricerca_paz();
			}
			
			apri_pagina('schedaEsame?tipo_registrazione=PR');
		}
		
		colora_sel_desel('btSchedaEsami')
	}
}

function data_ora()
{
	var pagina = getUrlName();
	var stmp   = '';
	
	if(pagina != 'prenotazioneInizio')
	{
		if(pagina == 'schedaEsame')
		{
			parent.frameMaster.document.forms[0].tipo_registrazione.value = 'PC';
			parent.frameMaster.document.forms[0].action = 'javascript:next_prenotazione();';
			
			parent.frameMaster.continua();
		}
		else
		{
			if(pagina == 'sceltaEsami')
			{
				parent.frameMaster.document.forms[0].tipo_registrazione.value = 'PR';
				parent.frameMaster.document.forms[0].action = 'prenotazioneInizio';
				
				parent.frameMaster.avanti('ok');
			}
			else
			{
				if(pagina == 'SL_RicercaPazienteFrameset')
				{
					save_dati_ricerca_paz();
					
					apri_pagina('prenotazioneInizio?tipo_registrazione=PR');
				}
				else
					apri_pagina('prenotazioneInizio?tipo_registrazione=PR&Hiden_esa=' + parent.frameMaster.document.forms[0].Hiden_esa.value);
			}
		}
		
		colora_sel_desel('btDataOra');
	}
}

function scelta_paziente()
{
	var pagina = getUrlName();
	
	_ret_dwr = '';
	
	if(pagina != 'SL_RicercaPazienteFrameset')
	{
		if(pagina == 'sceltaEsami')
		{
			_num_esami_totali = parent.frameMaster.document.forms[0].esami_sel.length;
			
			dwr.engine.setAsync(false);
			
			prenDWRBar.check_dati(parent.frameMaster.crea_stringa_esami(), chk_num_esa);
			
			dwr.engine.setAsync(true);
		}
		else
		{
			dwr.engine.setAsync(false);
			
			prenDWRBar.getCountPrenotare(chk_num_esa);
			
			dwr.engine.setAsync(true);
		}
		
		if(_ret_dwr == '0')
		{
			if(pagina == 'schedaEsame')
			{
				parent.frameMaster.document.forms[0].action = 'schedaEsame';
				parent.frameMaster.document.forms[0].target = '_self';
				
				//parent.frameMaster.document.forms[0].js_first_load.value = 'document.location.replace("SL_RicercaPazienteFrameset?param_ric=COGN,NOME,DATA&rows_frame_uno=141&rows_frame_due=*&menuVerticalMenu=prenotazioneOrario&servlet_call_after=javascript:check_prenota();' + _campi_ric + '");';
				parent.frameMaster.document.forms[0].js_first_load.value = 'document.location.replace("SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=0&provenienza=prenotazioneOrario&tipo_ricerca=0&servlet_call_after=javascript:check_prenota();' + _campi_ric + '");';
				parent.frameMaster.document.forms[0].tipo_registrazione.value = 'PC';
				
				parent.frameMaster.document.forms[0].submit();
			}
			else
			{
		//apri_pagina('SL_RicercaPazienteFrameset?param_ric=COGN,NOME,DATA&rows_frame_uno=141&rows_frame_due=*&menuVerticalMenu=prenotazioneOrario&servlet_call_after=javascript:check_prenota();' + _campi_ric);
				apri_pagina('SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=0&provenienza=prenotazioneOrario&tipo_ricerca=0&servlet_call_after=javascript:check_prenota();' + _campi_ric);
			}
		}
		else
			alert('Attenzione! Mancano ' + (_ret_dwr) + ' esame/i da prenotare! Prego effettuare gli inserimenti rimanenti!');
		
		colora_sel_desel('btSceltaPaziente');
	}
}

function chk_num_esa(sRet)
{
	var a_ret = sRet.split('*');
	
	_ret_dwr_status = a_ret[0];
	_ret_dwr = a_ret[1];
}

function apri_pagina(pag)
{
	parent.frameMaster.document.location.replace(pag);
}

function getUrlName()
{
	var aTmp = parent.frameMaster.document.location.href.split('/');
	var sRet = aTmp[aTmp.length - 1].indexOf('?') > 0 ? aTmp[aTmp.length - 1].substr(0, aTmp[aTmp.length - 1].indexOf('?')):aTmp[aTmp.length - 1];
		
	return sRet;
}

function save_dati_ricerca_paz()
{
	_campi_ric = '&cogn_paz=' + parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.COGN.value;
	_campi_ric += '&nome_paz=' + parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.NOME.value;
	_campi_ric += '&data_nasc=' + encodeURIComponent(parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.DATA.value);
	
	
	/*var stmp;

	stmp = 'gestione_ricerca_personale#';
	stmp += parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.COGN.value + '*';
	stmp += parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.NOME.value + '*';
	stmp += parent.frameMaster.RicPazRicercaFrame.document.form_pag_ric.DATA.value + '*';
	
	
	
	dwr.engine.setAsync(false);
	
	prenDWRBar.set_data_session(stmp);
	
	dwr.engine.setAsync(true);*/
}