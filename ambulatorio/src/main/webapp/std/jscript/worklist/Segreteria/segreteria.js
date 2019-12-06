function verifica_campo(valore)
{
	if(valore != null && valore != '')
		return "'" + valore + "'";
	else
		return null;
}

/*
	Funzione richiamata dal menu a tendina 'Segreteria' presente nella worklist degli esami
*/
function segreteria(operazione_segreteria)
{
	var iden_esame="";
	var iden_anag = '';
	if (conta_esami_sel()==0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	iden_esame = stringa_codici(array_iden_esame);
	//alert(iden_esame);
	
	iden_anag = stringa_codici(array_iden_anag);
	//alert(iden_anag);
	
	/*Controllo se il paziente è READONLY*/
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	
	var finestra = window.open("SL_Segreteria?operazione_segreteria="+operazione_segreteria+"&iden_anag="+iden_anag+"&iden_esame="+iden_esame+"","","top=0,left=0,width=800,height=600,status=yes");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		window.open("SL_Segreteria?operazione_segreteria="+operazione_segreteria+"&iden_anag="+iden_anag+"&iden_esame="+iden_esame+"","","top=0,left=0,width=800,height=600,status=yes");
	}
}
	
/*	
	Funzione che chiude la scheda della segreteria e ricarica
	la worklist degli esami
*/
function annulla()
{
	opener.aggiorna();
	self.close();
}	
	
/*
	Funzione richiamata dalla Scheda di Segreteria Visione per poter effettuare la scelta sulla provenienza 
	mediante l'apertura della scandb
*/
function apri_scandb(procedura, value_campo)
{
	var doc_r = document.form_scandb;
	win_scandb = window.open('','win_scandb', 'width=400, height=600, resizable = yes, status=yes, top=10,left=10');
	doc_r.myric.value = value_campo;
	doc_r.myproc.value = procedura;
	doc_r.mywhere.value = '';
	doc_r.submit();	
}
	
/*
	Funzione di registrazione della scheda VISIONE
*/
function registra_visione()
{
	var insert;
	var doc = document.form;
	var DOC_UPD = document.form_update;
	DOC_UPD.action = 'Update';
	DOC_UPD.method = 'POST';
	DOC_UPD.target = 'win_segr_upd';

	if(doc.hiden_pro.value == '')
	{
		alert(ritornaJsMsg("alert_provenienza"));
		doc.provenienza.value = '';
		doc.provenienza.focus();
		return;
	}
	if(doc.signore.value == '')
	{
		alert(ritornaJsMsg("alert_signore"));
		doc.signore.focus();
		return;
	}
	insert = 'insert into SEGR_VISIONE_PAZ (iden_pro, data_consegna, signore, iden_tab_per';
	insert += ")values(";
	insert += verifica_campo(doc.hiden_pro.value) + ", '" + doc.data_consegna.value.substring(6,10) +  doc.data_consegna.value.substring(3,5) + doc.	data_consegna.value.substring(0,2)  + "', " + verifica_campo(doc.signore.value) +  ", ";				  
	insert += verifica_campo(doc.hiden_tab_per.value);
	insert +=  ")";

	DOC_UPD.query.value = insert;
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.tipo_connessione.value = 'DATA';

	/*
	inserimento anche nella tabella SEGR_VIS_PAZ_ESAMI:
	viene effettuato riempendo un campo nascosto della form_update
	con i valori degli esami precedentemente selezionati nella worklist degli esami
	*/
	DOC_UPD.nome_tabella.value = 'SEGR_VIS_PAZ_ESAMI';
	DOC_UPD.nome_sequence.value = 'SEQ_SEGR_VISIONE_PAZ';
	DOC_UPD.segr_ins_esami.value = doc.hiden_esami.value;
	
	/*20080609*/
	var win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');	
	
	DOC_UPD.submit();

	annulla();
}

/*
	Questa operazione di modifica viene effettuata solo sulla tabella SEGR_VISIONE_PAZ
	e solo dalla worklist dello storico dove può essere inserita l'operazione di restituzione
	dell'esame
*/
function update_visione()
{
	var doc = document.form;
	
	if(opener.stringa_codici(opener.iden_stato) == 'ANNULLATO')
	{
		alert(ritornaJsMsg("no_restituzione"));
		return;
	}
	
	/*if(doc.consegnante.value == '')
	{
		alert('Attenzione, indicare la persona che restituisce l\'esame');//alert(ritornaJsMsg(""));
		doc.consegnante.focus();
		return;
	}*/
	
	
	var valori = doc.data_restituzione.value.substring(6,10) +  doc.data_restituzione.value.substring(3,5) + doc.data_restituzione.value.substring(0,2) + '@';
	valori += doc.consegnante.value + '@'; 
	valori += doc.ricevente.value + '@';
	valori += doc.iden_segreteria.value;
	
	dwr.engine.setAsync(false);
	CJsSegreteria.restituzione_visione(valori, cbkRestituzioneVisione);
	dwr.engine.setAsync(true);
}

function cbkRestituzioneVisione(message)
{
	if(message != '')
	{
		alert(message);
		return;
	}
	self.close();
	/*Devo aggiornare la worklist dello storico della segreteria*/
	aggiorna_wk_visione();
}

/*
	Funzione richiamata dalla pagina di visione per effettuare l'update
	della restituzione dell'esame preso in visione; richiamata dal pulsante
	'Annulla'
*/
function annulla_visione()
{
	aggiorna_wk_visione();
	self.close();
}
/*
	Funzione per effettuare il caricamento della pagina dopo aver effettuato l'update 
	della scheda di Visione (per la gestione della restituzione)
*/
function aggiorna_wk_visione()
{
	opener.document.form_vis_wk.iden_segreteria.value = document.form.elenco_iden_segreteria.value;
	opener.document.form_vis_wk.submit();
	
	self.close();
}


/*
	Funzione richiamata dal pulsante 'Azzera' nella pagina della scheda VISIONE
*/
function azzera_visione()
{
	var doc = document.form;
	doc.hiden_pro.value = '';
	doc.provenienza.value = '';
	doc.signore.value = '';
	doc.consegnante.value = '';
}

/*
	Funzione richiamata dal pulsante 'Azzera' nella pagina della scheda ARCHIVIAZIONE
*/
function azzera_archivia()
{
	var doc = document.form;
	doc.hiden_stato_cartella.value = '';
	doc.archivio.value = '';
}


/*
	Funzione che effettua la insert in tabella SEGR_ARCHIVIA_PAZ e in SEGR_ARCH_PAZ_ESAMI
	scheda di ARCHIVIAZIONE
*/
function registra_archivia()
{
	var insert;
	var doc     = document.form;
	var DOC_UPD = document.form_update;
	DOC_UPD.action = 'Update';
	DOC_UPD.method = 'POST';
	DOC_UPD.target = 'win_segr_upd';

	if(doc.hiden_stato_cartella.value == '')
	{
		alert(ritornaJsMsg("alert_archivio"));
		doc.archivio.value = '';
		doc.archivio.focus();
		return;
}	


	insert = 'insert into SEGR_ARCHIVIA_PAZ (iden_stato_cart, data_consegna, iden_tab_per) ';
	insert += "values(";
	insert += verifica_campo(doc.hiden_stato_cartella.value) + ", '" + doc.data_consegna.value.substring(6,10) +  doc.data_consegna.value.substring(3,5) + doc.data_consegna.value.substring(0,2)  + "', ";	  
	insert += verifica_campo(doc.hiden_tab_per.value) + ")";

	DOC_UPD.query.value = insert;
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.tipo_connessione.value = 'DATA';

	/*
	inserimento anche nella tabella SEGR_ARCH_PAZ_ESAMI:
	viene effettuato riempendo un campo nascosto della form_update
	con i valori degli esami precedentemente selezionati nella worklist degli esami
	*/
	DOC_UPD.nome_tabella.value = 'SEGR_ARCH_PAZ_ESAMI';
	DOC_UPD.nome_sequence.value = 'SEQ_SEGR_ARCHIVIA_PAZ';
	DOC_UPD.segr_ins_esami.value = doc.hiden_esami.value;
	
	/*20080609*/
	var win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');	

	DOC_UPD.submit();

	annulla();
}
	
/*
	Funzione che effettua la insert in tabella SEGR_CONSEGNA_PAZ e in SEGR_CONS_PAZ_ESAMI
	scheda di CONSEGNA AL PAZIENTE
*/	
function registra_consegna()
{
	var insert;
	var doc = document.form;
	var DOC_UPD = document.form_update;
	DOC_UPD.action = 'Update';
	DOC_UPD.method = 'POST';
	DOC_UPD.target = 'win_segr_upd';
	
	if(doc.immediato.checked)
		doc.himmediato.value = 'S';
	else
		doc.himmediato.value = 'N';
	if(doc.completato.checked)
		doc.hcompletato.value = 'S';
	else
		doc.hcompletato.value = 'N';	
	if(doc.medico_base.checked)
		doc.hmedico_base.value = 'S';
	else
		doc.hmedico_base.value = 'N';		
	

	if(doc.iden_tab_tipo_supporto.value == '')
	{
		alert(ritornaJsMsg("alert_supp"));
		doc.iden_tab_tipo_supporto.focus();
		return;
	}
	
	
	
insert = 'insert into SEGR_CONSEGNA_PAZ (IDEN_TAB_PER, IDEN_TAB_TIPO_SUPPORTO, IMMEDIATO, COMPLETATO, MEDICO_BASE, OP_CONSEGNA, ';
insert += 'RICEVENTE, DOCUMENTAZIONE, IDEN_PROT_STAMPA, IDEN_TIPO_FORMATO, QUANTITA, DATA_CONSEGNA, ORA_CONSEGNA) ';
insert += "values(";
insert += verifica_campo(doc.hiden_tab_per.value) + ", " + verifica_campo(doc.iden_tab_tipo_supporto.value) + ", " + verifica_campo(doc.himmediato.value) + ", ";
insert += verifica_campo(doc.hcompletato.value) + ", " + verifica_campo(doc.hmedico_base.value) + ", " + verifica_campo(doc.op_consegna.value) + ", ";
insert += verifica_campo(doc.ricevente.value) + ", " + verifica_campo(doc.documentazione.value) + ", " + verifica_campo(doc.iden_prot_stampa.value) + ", ";
insert += verifica_campo(doc.iden_tipo_formato.value) + ", " + verifica_campo(doc.quantita.value) + ", '" + doc.data_consegna.value.substring(6,10) +  doc.data_consegna.value.substring(3,5) + doc.data_consegna.value.substring(0,2) + "', ";
insert += verifica_campo(doc.ora_consegna.value) + ")";

	DOC_UPD.query.value = insert;
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.tipo_connessione.value = 'DATA';

	/*
	inserimento anche nella tabella SEGR_CONS_PAZ_ESAMI:
	viene effettuato riempendo un campo nascosto della form_update
	con i valori degli esami precedentemente selezionati nella worklist degli esami
	*/
	DOC_UPD.nome_tabella.value = 'SEGR_CONS_PAZ_ESAMI';
	DOC_UPD.nome_sequence.value = 'SEQ_SEGR_CONSEGNA_PAZ';
	DOC_UPD.segr_ins_esami.value = doc.hiden_esami.value;
	
	/*20080609*/
	var win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_segr_upd", 'width=1, height=1, status=yes, top=800000, left=800000');	

	DOC_UPD.submit();

	annulla();
}

function azzera_consegna()
{
	var doc = document.form;
	doc.ora_consegna.value = '';
	doc.op_consegna.value = '';
	doc.ricevente.value = '';
	doc.quantita.value = '';
	doc.documentazione.value = '';
	doc.iden_tab_tipo_supporto.value = '';
	doc.iden_prot_stampa.value = '';
	doc.iden_tipo_formato.value = '';

	doc.medico_base.checked = false;
	doc.immediato.checked = false;
	doc.completato.checked = false;
}

/**************************************   GESTIONE WORKLIST STORICO SEGRETERIA		******************************************/	
/*
	Funzione richiamata dal menu a tendina della Segreteria per visualizzare lo storico
	@param worklist A: storico archiviazione; V: storico visione; C:storico consegna	
*/
function open_worklist_storico(worklist)
{
	var iden_esame = stringa_codici(array_iden_esame);
	var iden_anag  = stringa_codici(array_iden_anag);
	//alert('iden_esami: ' + iden_esame);
	if(iden_esame == '')
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}

	try
	{
	parent.worklistMainFrame.document.location.replace("SL_WorklistSegreteria?operazione_segreteria="+worklist+"&esame_selezionato="+iden_esame+"&iden_anag="+iden_anag);
	}
	catch(e)
	{
		parent.RicPazWorklistFrame.document.location.replace("SL_WorklistSegreteria?operazione_segreteria="+worklist+"&esame_selezionato="+iden_esame+"&iden_anag="+iden_anag);//RicPazRecordFrame
	}
}

/*
	Chiusura della pagina di sola visualizzazione.
	Aperta dalla worklist dello storico della segreteria
*/	
function chiudi()
{
	try
	{
		aggiorna_wk_visione();
	}
	catch(e)
	{
		opener.document.form_vis_wk.iden_segreteria.value = opener.iden_worklist;
		opener.document.form_vis_wk.submit();
	}
	self.close();
}
	