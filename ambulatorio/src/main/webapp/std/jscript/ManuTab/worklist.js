function associazione_materiali()
{
	var iden_utente = stringa_codici(iden);
    if(iden_utente == '')
	{
    	alert(ritornaJsMsg('esegui_1')); 
        return;
    }
    else
	{
    	var ass_mat = window.open('', 'winAssociaMateriali','width=1020, height=680, status=yes, top=0,left=0');
        document.form_associa_materiali.iden.value = iden_utente;
        document.form_associa_materiali.submit();
    }
}


function getCampiRicerca()
{
	document.form_worklist.hricerca.value = parent.Ricerca.document.form_ricerca.hricerca.value;

	document.form_worklist.hattivo.value = parent.Ricerca.document.form_ricerca.hattivo.value;
	document.form_worklist.htipo_ricerca.value = parent.Ricerca.document.form_ricerca.htipo_ricerca.value;
	document.form_worklist.where_condition.value = parent.Ricerca.document.form_ricerca.where_condition.value;
	
	document.form_worklist.iden_sala.value = parent.Ricerca.document.form_ricerca.iden_sala.value;
	document.form_worklist.iden_mac.value = parent.Ricerca.document.form_ricerca.iden_mac.value;
	document.form_worklist.iden_area.value = parent.Ricerca.document.form_ricerca.iden_area.value;
	document.form_worklist.campo_attivo_db.value = parent.Ricerca.document.form_ricerca.campo_attivo_db.value;
}


function aggiorna_worklist()
{
	getCampiRicerca();
	document.form_worklist.submit();
}

//********************                FUNZIONE ESEGUI
function esegui(valore)
{
	var doc = document.form;

	var codice='';
    var iden_per = ''; 
    var val = valore;
    if (valore='')
	{
		return;
	}
    codice = stringa_codici(iden);
    //iden_per = stringa_codici(array_iden_per);
    if (codice.toString()=='' && (val=='CANC' || val == 'MOD'))
	{
		alert(ritornaJsMsg('esegui_1'));/*Prego effettuare una selezione*/
        return;
    }
/*cancellazione PC e UTENTI*/
	if (val == 'CANC') 
	{
    	var scelta = confirm(ritornaJsMsg('esegui_c1'));
    	if(scelta == true) 
		{
			var win_del = window.open('', doc.target ,'top=0,left=1000000');
    		doc.hoperazioneTab.value = val;
        	doc.hidenTab.value = codice;
			doc.submit();
        	alert(ritornaJsMsg('esegui_3'));//Operazione effettuata
			win_del.close();
			aggiorna_worklist_after_canc();
		}
    return;
	}
/*fine cancellazione*/
	if(val == 'MOD' || val == 'INS')// || val == 'ASSOCIA'
	{
        window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	}
	
    doc.hoperazioneTab.value = val;
    doc.hidenTab.value = codice;
    doc.submit();
}

/*
	Funzione utilizzata per la cancellazione dei pc o degli utenti
*/
function aggiorna_worklist_after_canc()
{
	var pag_da_vis = document.form_worklist.pagina_da_vis.value;
	var elenco_record = iden.length;
	
	if(elenco_record == 1)
		pag_da_vis = pag_da_vis - 1;
		
	parent.Ricerca.ricerca(pag_da_vis);
}


function avanti(pagina)
{
	document.form_worklist.pagina_da_vis.value = pagina;
	getCampiRicerca();
	
	document.form_worklist.submit();
}

function indietro(pagina)
{
	document.form_worklist.pagina_da_vis.value = pagina;
	getCampiRicerca();
	
	document.form_worklist.submit();
}

///////////////////////////////////////////////////////////////
/*	GESTIONE TABELLE TAB_SAL - TAB_MAC - TAB_ARE - TARE_ESA  */
//////////////////////////////////////////////////////////////
/*
	GESTIONE SALE
*/
function visualizza_sale()
{
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_SALE");
}

/*
	GESTIONE MACCHINE
*/
function visualizza_macchine_da_sala()
{
	var iden_sala = stringa_codici(iden);
	if (iden_sala == '')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }
	var campo_attivo_db = stringa_codici(attivo);
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_MAC&iden_sala="+iden_sala+"&campo_attivo_db="+campo_attivo_db);
}

function visualizza_macchine_da_area()
{
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_MAC&iden_sala="+iden_sala);
}


function esegui_ins_mod_mac(operazione)
{
	var campo_attivo_db = parent.Ricerca.document.form_ricerca.campo_attivo_db.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	var iden_mac = stringa_codici(iden);
	
	var doc = document.form;
	if (iden_mac == '' && operazione == 'MOD')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }

	window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	
	doc.iden_sala.value = iden_sala;
	doc.iden_mac.value = iden_mac;
	doc.campo_attivo_db.value = campo_attivo_db;
	
    doc.hoperazioneTab.value = operazione;
    doc.hidenTab.value = iden_mac;
    doc.submit();
}

/*
	GESTIONE AREE
*/
function visualizza_aree_da_macchine()
{
	var iden_mac = stringa_codici(iden);
	if (iden_mac == '')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_ARE&iden_mac="+iden_mac+"&iden_sala="+iden_sala);
}

function visualizza_aree_da_esami()
{
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_ARE&iden_mac="+iden_mac+"&iden_sala="+iden_sala);
}


function esegui_ins_mod_aree(operazione)
{
	var campo_attivo_db = parent.Ricerca.document.form_ricerca.campo_attivo_db.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_area = stringa_codici(iden);
	
	var doc = document.form;
	if (iden_area == '' && operazione == 'MOD')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }

	window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	
	doc.iden_sala.value = iden_sala;
	doc.iden_mac.value = iden_mac;
	doc.iden_area.value = iden_area;
	doc.campo_attivo_db.value = campo_attivo_db;
	
    doc.hoperazioneTab.value = operazione;
    doc.hidenTab.value = iden_area;
    doc.submit();
}


function visualizza_esami_associati()
{
	var iden_area = stringa_codici(iden);
	if(iden_area == '')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_TARE_ESA&iden_sala="+iden_sala+"&iden_mac="+iden_mac+"&iden_area="+iden_area);
}

function visualizza_esami_associati_provenienza()
{
	var iden_pro = stringa_codici(iden);
	if(iden_pro == '')
	{
        alert(ritornaJsMsg('esegui_1'));
         return;
    }
	
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_TAB_ESA_PROV&iden_pro="+iden_pro+"&where_cond_agg=iden_pro=" +iden_pro+"&context_menu_in=T_TAB_ESA_PROV"); 
}

/*
	ASSOCIAZIONE ESAMI (sala-macchina-area)
*/
function esegui_associa_esami()
{
	var doc = document.form;
	var iden_area = parent.Ricerca.document.form_ricerca.iden_area.value;
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	
	if(debug == 1)
		alert("SALA: " + iden_sala + " MACCHINA: " + iden_mac + " AREA: " + iden_area);
	
	window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	
	doc.iden_sala.value = iden_sala;
	doc.iden_mac.value = iden_mac;
	doc.iden_area.value = iden_area;

    doc.hoperazioneTab.value = 'MOD';
    doc.submit();
}

function esegui_associa_esami_prov()
{
	
	
	var iden_pro = parent.Ricerca.document.form_ricerca.where_cond_agg.value.split('=')[1];
	
	
	window.open('SL_AssEsamiSalaMacArea?iden_pro='+iden_pro, '' ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	
	}


function duplica_utente()
{
	var iden_utente = stringa_codici(iden);
    if(iden_utente == '')
	{
    	alert(ritornaJsMsg('esegui_1'));
        return;
    }
    else
	{
    	var duplica = window.open('', 'winDuplicaUtente','width=1000, height=600, status=yes, top=0,left=0');
        document.form_duplica_utente.iden.value = iden_utente;
        document.form_duplica_utente.submit();
     }
}
        
function duplica_pc()
{
	var iden_utente = stringa_codici(iden);
    if(iden_utente == '')
	{
    	alert(ritornaJsMsg('esegui_1')); 
        return;
    }
    else
	{
    	var duplica = window.open('', 'winDuplicaPC','width=1000, height=600, status=yes, top=0,left=0');
        document.form_duplica_pc.iden.value = iden_utente;
        document.form_duplica_pc.submit();
    }
}


/*
	Gestione dell'Associazione degli esami alle Sale-Macchine-Aree.
	In particolare dalla worklist degli esami associati alla sala-macchina-area
	verranno eliminati dall'associazione.
*/

function escludi_selezionato_prov()
{
	var elenco_iden_esami = stringa_codici(iden_esa);
	aggiorna_tab_esa_prov(elenco_iden_esami);
}

function escludi_tutti_prov()
{
	var elenco_iden_esami = iden_esa;
	aggiorna_tab_esa_prov(elenco_iden_esami);
}


function aggiorna_tab_esa_prov(elenco_iden_esami)
{
	//alert('ELENCO ESAMI DA DISASSOCIARE: ' + elenco_iden_esami);
	if(elenco_iden_esami == '')
	{
		alert(ritornaJsMsg('selezionare_esame'));
		return;
	}
	else
	{
		dwr.engine.setAsync(false);
		//alert('D@'+iden_pro[]+'@'+elenco_iden_esami);
		CJsUpdTareEsa.update_tab_esa_prov('D@'+iden_pro[1]+'@'+elenco_iden_esami, cbkUpdateTareEsa);
		dwr.engine.setAsync(true);
	}
}

function escludi_selezionato()
{
	var elenco_iden_esami = stringa_codici(iden);
	aggiorna_tare_esa(elenco_iden_esami);
}


function escludi_tutti()
{
	var elenco_iden_esami = iden;
	aggiorna_tare_esa(elenco_iden_esami);
}

function aggiorna_tare_esa(elenco_iden_esami)
{
	//alert('ELENCO ESAMI DA DISASSOCIARE: ' + elenco_iden_esami);
	if(elenco_iden_esami == '')
	{
		alert(ritornaJsMsg('selezionare_esame'));
		return;
	}
	else
	{
		var sal_mac_are_esami = parent.Ricerca.document.form_ricerca.iden_sala.value + '@';
		sal_mac_are_esami += parent.Ricerca.document.form_ricerca.iden_mac.value + '@';
		sal_mac_are_esami += parent.Ricerca.document.form_ricerca.iden_area.value + '@';
		sal_mac_are_esami += elenco_iden_esami;
	
		dwr.engine.setAsync(false);
		CJsUpdTareEsa.update_tare_esa(sal_mac_are_esami, cbkUpdateTareEsa);
		dwr.engine.setAsync(true);
	}
}

function cbkUpdateTareEsa(messaggio)
{
	if(messaggio == '')
	{
		parent.Ricerca.ricerca();
	}
	else
		alert(messaggio);
}

/********************************************************
	GESTIONE ASSOCIAZIONE AREE - PROVENIENZE
*********************************************************/

/*
	Funzione richiamata dalla wk delle aree.
	L'area deve essere PRENOTABILE: tab_are.prenotabile = 0: prenotabile
														  1: cup
														  2: entrambi

*/
function visualizza_prov_abilitate()
{
	var prenotabile = stringa_codici(array_prenotabile);
	if(prenotabile == '')
	{
		alert("Attenzione, selezionare un'area prenotabile.");
		return;
	}
	
	var iden_area = stringa_codici(iden);
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	
	//alert('PRENOTABILE: ' + prenotabile);
	//alert('SALA: ' + iden_sala + ' MACCHINA: ' + iden_mac + ' AREA: ' + iden_area);
	
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_AREE_PROVENIENZE&iden_sala="+iden_sala+"&iden_mac="+iden_mac+"&iden_area="+iden_area);
}


function esegui_associa_provenienze()
{
	var doc = document.form;
	var iden_area = parent.Ricerca.document.form_ricerca.iden_area.value;
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	
	//alert("SALA: " + iden_sala + " MACCHINA: " + iden_mac + " AREA: " + iden_area);
	
	window.open('', doc.target ,'width=1000,height=600, status=yes, top=0,scrollbars=yes, resizable=no,left=0');
	
	doc.iden_sala.value = iden_sala;
	doc.iden_mac.value = iden_mac;
	doc.iden_area.value = iden_area;

    doc.hoperazioneTab.value = 'MOD';
    doc.submit();
}

/*function escludi_provenienze()
{
	var iden_are = parent.Ricerca.document.form_ricerca.iden_area.value;
	//alert('IDEN AREA: ' + iden_are);
	
	CJsAreeProvenienze.delete_tab_aree_provenienze(" IDEN_ARE = " + iden_are , cbkAreeProvenienze);
}*/

function escludi_provenienze()
{
	var iden_provenienze = iden;
	var iden_are = parent.Ricerca.document.form_ricerca.iden_area.value;
	if(iden_provenienze != ''){
		//alert('IDEN PROVENIENZE: ' + iden_provenienze);
		dwr.engine.setAsync(false);
		CJsAreeProvenienze.delete_tab_aree_provenienze(" IDEN_PRO in (" + iden_provenienze + ") and IDEN_ARE=" + iden_are, cbkAreeProvenienze);
		dwr.engine.setAsync(true);
	}
}



function cbkAreeProvenienze(messaggio)
{
	if(messaggio == '')
	{
		parent.Ricerca.ricerca();
	}
	else
		alert(messaggio);
}



function escludi_prov_selezionata()
{
	var iden_area = parent.Ricerca.document.form_ricerca.iden_area.value;
	var iden_prov = stringa_codici(iden);
	
	if(iden_prov == '')
	{
		alert(ritornaJsMsg('esegui_1')); 
		return;
	}
	
	var where_condition = ' IDEN_ARE = ' + iden_area + ' AND IDEN_PRO = ' + iden_prov;
	
	//alert('WHERE CONDITION: ' + where_condition);
	
	dwr.engine.setAsync(false);
	CJsAreeProvenienze.delete_tab_aree_provenienze(where_condition, cbkAreeProvenienze);
	dwr.engine.setAsync(true);
}

function visualizza_aree_da_provenienze()
{
	var iden_mac = parent.Ricerca.document.form_ricerca.iden_mac.value;
	var iden_sala = parent.Ricerca.document.form_ricerca.iden_sala.value;
	parent.Ricerca.document.location.replace("SL_Manu_Tab_Ricerca?procedura=T_ARE&iden_mac="+iden_mac+"&iden_sala="+iden_sala);
}


