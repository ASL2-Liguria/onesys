var stato_add;
var stato_del;

function chiudi()
{
    try
    {
	opener.aggiorna();
    }
    catch(ex)
    {}
    self.close();
}

function chiudi_prenotazione()
{
	ritorna_prenotazione();
}

function carica_lista_esami(vis)
{
	var i;
	i = n_a_esa - 1;
	
	while(i>-1)
	{
		document.scelta_esame.esami_in.options.remove(i);
		i--;
	}
	
	for(i = 0; i < n_a_esa; i++)
	{
		var oOpt = document.createElement('Option');
		
		if(vis == 'D')
		{
			oOpt.text = a_descr[i];
		}
		else
		{
			oOpt.text = a_cod_esa[i] + ' ' + a_descr[i];
		}
		
		oOpt.value = a_iden[i];
		document.scelta_esame.esami_in.add(oOpt);
	}
}

function sortSelect(obj)
{
	var o = new Array();
	
	for (var i=0; i<obj.options.length; i++)
	{
		o[o.length] = new Option( obj.options[i].text, obj.options[i].value, obj.options[i].defaultSelected, obj.options[i].selected);
	}
	
	o = o.sort( 
				function(a,b)
				{ 
					if((a.text+"") < (b.text+"")){return -1;}
					if((a.text+"") > (b.text+"")){return 1;}
					
					return 0;
				}
			  );

	for (var i=0; i<o.length; i++)
	{
		obj.options[i] = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
	}
}

function check_evento_esame(elenco, mul, caso)//add_esame_check(mul)
{
	var launch = 'SP_CHECK_SCELTA_ESAME@';
	var par = '';
	var esami_sel = '';
	
	if(mul == 'S')
	{
		for(i = 0; i < elenco.length; i++)
		{
			if(elenco[i].selected)
			{
				if(esami_sel != '')
					esami_sel += ',';
				
				if(elenco.options(i).value.indexOf('*') > 0)
					esami_sel += elenco.options(i).value.split('*')[0];
				else
					esami_sel += elenco.options(i).value;
			}
		}
	}
	else
	{
		if(elenco.length > 0)
			if(elenco.options(elenco.selectedIndex).value.indexOf('*') > 0)
				esami_sel = elenco.options(elenco.selectedIndex).value.split('*')[0];
			else
				esami_sel = elenco.options(elenco.selectedIndex).value;
	}
	
	if(esami_sel != '')
	{
		par = 'SP_CHECK_SCELTA_ESAME@';
		par += 'IString#IString#IString#IString#IString#IString#OVarchar@';
		par += baseUser.LOGIN + '#';
		par += document.scelta_esame.tipo_registrazione.value + '#';
		par += caso + '#';
		par += esami_sel + '#';
		par += crea_stringa_esami().replace(/\*/g,",") + '#';
		par += document.scelta_esame.extra_db.value;
		
		dwr.engine.setAsync(false);
		
		functionDwr.launch_sp(par, responseDWR);
		
		dwr.engine.setAsync(true);
	}
}

function responseDWR(valore)
{
	var a_risp = valore.split("*");
	
	if(a_risp[0] != 'ERROR')
	{
		eval(valore);
	}
	else
	{
		alert('Errore interno, messaggio: ' + a_risp[1]);
	}
}

function add_esame_check(mul)
{
	stato_add = mul;
	
	check_evento_esame(document.scelta_esame.esami_in, mul, 'ADD');
}

function add_esame(mul)
{
	var i;
	
	if(mul == 'S')
	{
		for(i = 0; i < n_a_esa; i++)
		{
			if(document.scelta_esame.esami_in[i].selected)
			{
				var oOpt = document.createElement('Option');
				
				oOpt.text = document.scelta_esame.esami_in.options(i).text;
				oOpt.value = document.scelta_esame.esami_in.options(i).value + '*' + a_metodica[i];
				document.scelta_esame.esami_sel.add(oOpt);
			}
		}
	}
	else
	{
		var oOpt = document.createElement('Option');
		
		oOpt.text = document.scelta_esame.esami_in.options(document.scelta_esame.esami_in.selectedIndex).text;
		oOpt.value = document.scelta_esame.esami_in.options(document.scelta_esame.esami_in.selectedIndex).value + '*' + a_metodica[document.scelta_esame.esami_in.selectedIndex];
		
		document.scelta_esame.esami_sel.add(oOpt);
	}
	
	sortSelect(document.scelta_esame.esami_sel);
}

function del_esame_check(tutti)
{
	stato_del = tutti;
	
	if(tutti != 'S')
		check_evento_esame(document.scelta_esame.esami_sel, tutti, 'DEL');
	else
		del_esame(tutti);
}

function del_esame(tutti)
{
	if(tutti == 'S')
	{
		while(document.scelta_esame.esami_sel.length > 0)
		{
			document.scelta_esame.esami_sel.options.remove(document.scelta_esame.esami_sel.length - 1);
		}
	}
	else
	{
		if(document.scelta_esame.esami_sel.selectedIndex !=-1)
		{
			document.scelta_esame.esami_sel.options.remove(document.scelta_esame.esami_sel.selectedIndex);
		}
	}
}

function crea_stringa_esami(descr)
{
	var sEsa 		= '';
	var idEsa 		= '';
	var metEsa		= '';
	var descrEsa 	= '';
	var i;
	
	if(document.scelta_esame.esami_sel)
	{
		for(i = 0; i < document.scelta_esame.esami_sel.length; i++)
		{
			if(idEsa == '')
			{
				idEsa = document.scelta_esame.esami_sel.options(i).value.split("*")[0];
				metEsa = document.scelta_esame.esami_sel.options(i).value.split("*")[1];
				descrEsa = document.scelta_esame.esami_sel.options(i).text;
			}
			else
			{
				idEsa += '*' + document.scelta_esame.esami_sel.options(i).value.split("*")[0];
				metEsa += '*' + document.scelta_esame.esami_sel.options(i).value.split("*")[1];
				descrEsa += '*' + document.scelta_esame.esami_sel.options(i).text;
			}
		}
		sEsa = descr ? idEsa + '@' + descrEsa:idEsa;
		
		document.scelta_esame.Ha_sel_metodica.value = metEsa;
	}
	else
	{
		sEsa = document.scelta_esame.Hiden_esa.value;
	}
	
	return sEsa;
}

function cambia_cdc(valore)
{
	document.scelta_esame.Hcdc.value = valore;
	aggiorna(document.scelta_esame.Hzona.value, document.scelta_esame.Hmodalita.value);
}

function aggiorna(zona, modalita)
{
	document.scelta_esame.action = '\sceltaEsami';
	if(zona != '@')
	{
		document.scelta_esame.Hzona.value = zona;
	}
	if(modalita != '@')
	{
		document.scelta_esame.Hmodalita.value = modalita;
	}
	document.scelta_esame.Ha_sel_iden.value = crea_stringa_esami();
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	
	if(document.scelta_esame.tipo_registrazione.value == 'PR' || document.scelta_esame.tipo_registrazione.value == 'PC')
		document.scelta_esame.tipo_registrazione.value = 'P';
	
	
	document.scelta_esame.submit();
}


function ricerca()
{
	var cod = document.scelta_esame.codice_esame.value;
	var tipo = document.scelta_esame.optRicerca[0].checked ? 'C':'D';
	var i;
	
	if(cod == '')
	{
		alert('Inserire un valore di ricerca valido!');
		document.scelta_esame.codice_esame.focus();
		return;
	}
	
	if(tipo == 'C')
	{
		for(i = 0; i < n_a_esa; i++)
		{
			if(cod.toUpperCase() == a_cod_esa[i].toUpperCase())
			{
				var oOpt = document.createElement('Option');
				
				oOpt.text = a_descr[i];
				oOpt.value = a_iden[i];
				
				document.scelta_esame.esami_sel.add(oOpt);
				document.scelta_esame.codice_esame.value = '';
				document.scelta_esame.codice_esame.focus();
				return;
			}
		}
	}
	else
	{
		/*for(i = document.scelta_esame.esami_in.selectedIndex; i < n_a_esa; i++)
		{
			if(cod.toUpperCase() == a_descr[i].substr(0,cod.length).toUpperCase())
			{
				document.scelta_esame.esami_in.selectedIndex = i;
				
				return;
			}
		}*/
		document.scelta_esame.esami_in.selectedIndex = ricava_indice(document.scelta_esame.esami_in.selectedIndex, cod);
		if(document.scelta_esame.esami_in.selectedIndex> 0)
			return;
	}
	
	alert('Esame non trovato!');
	document.scelta_esame.codice_esame.focus();
}


function avanti(pass)
{
	initbaseUser();
	initbaseGlobal();
	
	//se sto agendo all'interno della cartella setto i valori conosciuti
	if(typeof top.getForm != 'undefined'){

		if(typeof document.scelta_esame.Hiden_visita == 'undefined'){	
			document.scelta_esame.appendChild(document.createElement('<input type="hidden" name="Hiden_visita" value=""/>'));
		}

		var vDati = top.getForm(document);

		document.scelta_esame.Hiden_pro.value = vDati.IdenPro;
		document.scelta_esame.Hiden_anag.value = vDati.iden_anag;	
		document.scelta_esame.Hiden_visita.value = vDati.iden_visita;	
	}

	document.scelta_esame.method = "GET";
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();

	if(document.scelta_esame.Hiden_pro.value == '')
	{
		document.scelta_esame.Hiden_pro.value = baseUser.PROVENIENZA_LOGIN_IDEN;
	}
	
	if((document.scelta_esame.Hiden_pro.value + '') == 'undefined')
	{
		document.scelta_esame.Hiden_pro.value = '';
	}
	
	if((document.scelta_esame.Htip_esec.value + '') == 'undefined')
	{
		document.scelta_esame.Htip_esec.value = '';
	}
	
	if(document.scelta_esame.Hiden_esa.value == '')
	{
		alert('Selezionare almeno un esame');
	}
	else
	{
		if(check_metodica())
		{
			if(parent.frameDirezione)
			{
				if(typeof pass == 'undefined')
				{
					if(parent.frameDirezione.document.all.btSchedaEsami.style.visibility == 'hidden')
					{
						document.scelta_esame.tipo_registrazione.value = 'P';
					}
					else
					{
						document.scelta_esame.tipo_registrazione.value = 'PR';
					}
					
					document.scelta_esame.action = 'javascript:next_prenotazione();';
				}
				
				if(typeof document.scelta_esame.esami_sel != 'undefined')
					parent.frameDirezione._num_esami_totali = document.scelta_esame.esami_sel.length;
				else
					parent.frameDirezione._num_esami_totali = document.scelta_esame.Hiden_esa.value.replace(/\*/g, ",").split(",").length;
				
				parent.frameDirezione.colora_sel_desel('btSchedaEsami');
			}
			
			if(document.scelta_esame.tipo_registrazione.value == 'A' && document.scelta_esame.apri_scheda_esame.value == 'S')
				document.scelta_esame.action = 'schedaEsame';
			
			document.scelta_esame.submit();
		}
		else
		{
			alert('Attenzione! Selezionare esami con la stessa metodica!');
		}
	}
}

function utenteFailed()
{
	alert('Utente non valido per eseguire l\'inserimento di un esame!');
	chiudi();
}

function annulla_invio()
{
	if (window.event.keyCode==13)
	{
		window.event.returnValue=false;
		ricerca();
	}
}

function check_metodica()
{
	var i;
	var f_met = '';
	var a_met = document.scelta_esame.Ha_sel_metodica.value.split('*');
	var ret = true;
	
	if(document.scelta_esame.tipo_registrazione.value.substr(0,1) != 'P' && baseGlobal.ACC_PER_STESSA_METODICA != 'N')
	{
		for(i=0; i < a_met.length && ret; i++)
		{
			if(f_met == '')
			{
				f_met = a_met[i];
			}
			
			ret = f_met == a_met[i];
		}
	}
	return ret;
}

function check_dati_prenota(cod_imp, forza)
{
	var esa = '';
	var par = '';
	
	// Inutile... ma non si sa mai!!!
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	document.scelta_esame.Hiden_posto.value = cod_imp;
	if(forza == 'S')
	{
		document.scelta_esame.tipo_registrazione.value = 'PF';
	}
	
	esa = document.scelta_esame.Hiden_esa.value.replace(/\*/g, ",");
	par = cod_imp + '*' + esa + '*S*' + forza;
	
	prenDWRClient.occupa_posto(par, check_dati_prenota_confirm);
}

function check_dati_prenota_confirm(msg)
{
	var a_msg = msg.split("*");
	
	document.scelta_esame.onSubmit = false;
	
	if(msg != null && msg.substr(0, 5).toUpperCase() == 'ERROR')
	{
		// Tutto ko, lo fermo
		alert(a_msg[1]);
	}
	else
	{
		// Tutto ok!
		document.scelta_esame.Hiden_posto.value = a_msg[1].replace(/\,/g, "*");
		document.scelta_esame.action = 'schedaEsame';
		document.scelta_esame.submit();
	}
}

function check_richiesta_prenota()
{
	var url_send;
	
	// Fa schifo, ma non ho scelta!!!
	document.scelta_esame.onSubmit = false;
	
	parent.iden_esa = crea_stringa_esami();
	
	// Compongo la url
	/*url_send = 'schedaEsame?'
	url_send += 'tipo_registrazione=P&'; // Tipo Prenotazione
	url_send += 'tipo_azione=C&'; // Indica ke deve passare nella consultazione...
	url_send += 'Hiden_anag=' + parent.iden_anag + '&';
	url_send += 'Hiden_esa=' + crea_stringa_esami() + '&';
	url_send += 'Hiden_infoweb_richiesta=' + parent.iden_infoweb_richiesta + '&';
	
	url_send += 'urgente=' + parent.urgente + '&';
	
	url_send += 'iden_med_rich=' + parent.iden_med_rich + '&';
	url_send += 'iden_tab_pro=' + parent.iden_tab_pro + '&';
	
	url_send += 'txtNote=' + parent.note + '&';
	url_send += 'txtQuadroClinico=' + parent.quadro_clinico + '&';
	url_send += 'txtQuesitoClinico=' + parent.quesito_clinico;
	
	document.location.replace(url_send);*/
	//document.scelta_esame.tipo_registrazione.value = 'P';
	//document.scelta_esame.tipo_azione.value = 'C';
	document.scelta_esame.appendChild(document.createElement("<input name='tipo_azione' type='hidden' value='C'>"));
	//document.scelta_esame.Hiden_anag.value = parent.iden_anag;
	document.scelta_esame.Hiden_esa.value = crea_stringa_esami();
	//document.scelta_esame.Hiden_infoweb_richiesta.value = parent.iden_infoweb_richiesta;
	
/*	if(document.scelta_esame.Htip_esec.value == '')
	{
		document.scelta_esame.Htip_esec.value = parent.tip_esec;
		if(document.scelta_esame.Htip_esec.value == 'undefined')
			document.scelta_esame.Htip_esec.value = '';
	}
	
	document.scelta_esame.urgente.value = parent.urgente;
	
	document.scelta_esame.iden_med_rich.value = parent.iden_med_rich;
//	document.scelta_esame.Hiden_pro.value = parent.iden_tab_pro;
	
	document.scelta_esame.txtNote.value = parent.note;
	document.scelta_esame.txtQuadroClinico.value = parent.quadro_clinico;
	document.scelta_esame.txtQuesitoClinico.value = parent.quesito_clinico;*/

	document.scelta_esame.action = 'schedaEsame';
	document.scelta_esame.method = 'POST';
	document.scelta_esame.target = '_self';
	
	document.scelta_esame.submit();
}

function set_descr_omino()
{
	if(typeof document.all["areaOmino0"] != 'undefined')
	{
		var aDescr = document.scelta_esame.Hdescr_omino.value.split(",");
		var idx;
		
		initbaseUser();
		
		for(idx=0; idx<aDescr.length; idx++)
		{
			document.all["areaOmino" + idx].alt=aDescr[idx];
		}
	}
}

function prestazioni_richiedibili()
{
	var esami_scelti 		= crea_stringa_esami(true).split('@');
	var esami_scelti_iden 	= esami_scelti[0];
	var esami_scelti_descr 	= esami_scelti[1];
	var iden 				= esami_scelti_iden.split('*');
	var descr 				= esami_scelti_descr.split('*');

	document.scelta_esame.onSubmit 		 = false;
	opener.document.form.Hmetodica.value = document.scelta_esame.Ha_sel_metodica.value.replace(/\*/g, ","); //document.scelta_esame.Hmodalita.value;
	opener.document.form.Hiden_esa.value = esami_scelti_iden;

	while(opener.document.form.prestazioni.length > 0)
	{
		opener.document.form.prestazioni.remove(opener.document.form.prestazioni.length - 1);
	}
	
	for(i = 0; i < descr.length; i++)
	{
		var oOpt = opener.document.createElement('Option');
		oOpt.text = descr[i];
		oOpt.value = iden[i];
		
		opener.document.form.prestazioni.add(oOpt);
	}
	
	chiudi();
}

function avviso_lock()
{
	alert('Attenzione! Impossibile proseguire, paziente di sola lettura!');
}

function check_riprenota()
{
	var url_send;
	
	document.scelta_esame.onSubmit = false;
	
	// Compongo la url
	url_send = 'schedaEsame?'
	url_send += 'tipo_registrazione=P&'; // Tipo Prenotazione
	url_send += 'tipo_azione=C&'; // Indica ke deve passare nella consultazione...
	url_send += 'Hiden_esa=' + crea_stringa_esami() + '&';
	url_send += 'Hiden_esame=' + document.scelta_esame.Hiden_esame.value;
	
	document.location.replace(url_send);
}

function ricava_indice(idx, ric)
{
	var ret_idx = -1;
	var esci	= false;
	var a_tmp;
	var primo;
	var i;
	
	if(idx < 0)
	{
		idx = 0;
		primo = false;
	}
	else
	{
		idx++;
		primo = true;
	}
	
	while(!esci)
	{
		for(i = idx; i < n_a_esa; i++)
		{
			if(document.scelta_esame.chkRicercaSens.checked)
			{
				if(a_descr[i].indexOf(ric) >= 0)
				{
					ret_idx = i;
					break;
				}
			}
			else
			{
				if(ric.toUpperCase() == a_descr[i].substr(0,ric.length).toUpperCase())
				{
					ret_idx = i;
					break;
				}
			}
		}
		if(ret_idx == -1 && primo)
		{
			idx = 0;
			primo = false;
		}
		else
		{
			esci = true;
		}
	}
	
	return ret_idx;
}

function check_ricerca()
{
	var tipo = document.scelta_esame.optRicerca[0].checked ? 'C':'D';
	
	if(document.scelta_esame.optRicerca[1].checked)
		document.all['tdCheckRicerca'].style.display = 'block';
	else
		document.all['tdCheckRicerca'].style.display = 'none';
}

function apri_scheda_dettaglio(url_send)
{
	var win = window.open(url_send,"","status=yes,scrollbars=yes,fullscreen=yes");
	
	if(win)
		win.focus();
	else
		win = window.open(url,"","status=yes,scrollbars=yes,fullscreen=yes");
}

function add_esame_acr(iden, iden_padre, iden_figlio, descr, quesito)
{
	var oOpt 	= null;
	var ret 	= true;
	
	if(document.scelta_esame.extra_db.value == '')
	{
		document.scelta_esame.Hiden_esa.value = iden_figlio;
		document.scelta_esame.extra_db.value = 'ACR_DETAIL=' + iden;
		document.scelta_esame.txtQuesitoClinico.value = quesito;
		
		oOpt = document.createElement('Option');
		
		oOpt.text = descr;
		oOpt.value = iden_figlio;
		
		document.scelta_esame.esami_sel.add(oOpt);
	}
	else
	{
		if(document.scelta_esame.extra_db.value == 'ACR_DETAIL=' + iden)
		{
			document.scelta_esame.Hiden_esa.value = '';
			document.scelta_esame.extra_db.value = '';
		}
		else
		{
			alert('Selezionare solo un\'esame acr!');
			
			ret = false;
		}
	}
	
	return ret;
}