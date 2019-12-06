function verifica_campo(valore)
{
	if(valore != null && valore != '')
		return "'" + valore + "'";
	else
		return null;
}

/*
	Funzione richiamata dal menù della worklist degli esami dal pulsante 
	Esecuzione -> Dati Esecuzione.
	Richiamerà una servlet che crea 2 frame:
	il primo di scelta per la visualizzazione dei dati tecnici di esecuzione dell'esame ed
	il secondo conterrà la pagina in questione
*/
function dati_esecuzione()
{
	if (conta_esami_sel()== 0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1)
	{
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	var iden_esame = stringa_codici(array_iden_esame);
	var iden_anag = stringa_codici(array_iden_anag);
	
	
	//alert(iden_esame);
	//alert(iden_anag);
	
	 var win_dati_esecuzione = window.open("SL_DatiEsecuzioneFrameset?iden_esame="+ iden_esame+"&iden_anag="+iden_anag+"&provenienza=ST&sorgente="+document.frmAggiorna.sorgente.value, '', 'width=1024,height=768, resizable = yes, status=yes, top=0,left=0');
	win_dati_esecuzione.opener = opener;
	try{
		win_dati_esecuzione.width = screen.height;
		win_dati_esecuzione.height = screen.width;
	}
	catch(e){
		;
	}
}
	

function scheda_tecnica()
{
	/*
	alert(document.form.provenienza.value);
	alert(document.form.iden_esame.value);
	alert(document.form.iden_anag.value);
	*/
	document.form.provenienza.value = 'ST';

	document.form.submit();
}

/*
	Funzione che apre lo Scarico Materiale con il passaggio del parametro
	num_pre alla servlet scaricoInizio
*/
function scarico_materiale()
{
	//alert(document.form_sc_mat.NUM_PRE.value);
	document.form_sc_mat.action = 'scaricoMateriale';
	document.form_sc_mat.method = 'get';
	document.form_sc_mat.submit();
}

function libretto_radiologico()
{
	document.form.provenienza.value = 'LR';
	
	document.form.submit();
}
	
/*
	Funzione richiamata dalla Scheda Tecnica per aprire la scanDb
*/	
function scegli_elemento(readonly, campo_return, procedura)
{
	if(readonly != 'S')
	{
		var doc_r = document.form_scandb;
		win_scandb = window.open('','win_scandb', 'width=400, height=600, resizable = yes, status=yes, top=10,left=10');
		doc_r.myric.value = campo_return;
		doc_r.myproc.value = procedura;
		doc_r.mywhere.value = '';
		doc_r.submit();	
	}
}	

function registra_scheda_tecnica()
{
	var doc = document.gestione_esame;
	var DOC_UPD = document.form_update;
	DOC_UPD.action = 'Update';
	DOC_UPD.target = 'win_update';
	DOC_UPD.method = 'POST';
	
	var upd = 'UPDATE ESAMI SET ';
	
	if(doc.dat_esa.value == '')
	{
		alert("Prego, inserire la data dell'esame correttamente");
		doc.dat_esa.focus();
		return;
	}
	
	upd += "dat_esa = '" + doc.dat_esa.value.substring(6,10) +  doc.dat_esa.value.substring(3,5) + doc.	dat_esa.value.substring(0,2)+ "', ";
	var sal_mac = '';
  	sal_mac = doc.sale_mac.value.split("*");
	upd += "iden_sal =" + verifica_campo(sal_mac[0]) + ", ";
	upd += "iden_mac =" + verifica_campo(sal_mac[1]) + ", ";
	
	if(doc.medicoinviante.value == '')
		doc.Hiden_medi.value = 0;
	if(doc.tecnico1.value == '')
		doc.Hiden_tec1.value = 0;
	if(doc.tecnico2.value == '')
		doc.Hiden_tec2.value = 0;
	if(doc.descr_infermiere.value == '')
		doc.Hiden_inf1.value = 0;
	if(doc.descr_infermiere2.value == '')
		doc.Hiden_inf2.value = 0;
	if(doc.anestesista.value == '')
		doc.Hiden_ane.value = 0;
	if(doc.medicoesecutore.value == '')
		doc.Hiden_mede.value = 0;	
		
	
	upd += "iden_medi = " + verifica_campo(doc.Hiden_medi.value) + ", ";
	upd += "iden_tec = " + verifica_campo(doc.Hiden_tec1.value) + ", ";
	upd += "iden_tec2 = "+ verifica_campo(doc.Hiden_tec2.value) + ", ";
	upd += "iden_inf = "+ verifica_campo(doc.Hiden_inf1.value) + ", ";
	upd += "iden_inf2 = "+ verifica_campo(doc.Hiden_inf2.value) + ", ";
	upd += "iden_ane = "+ verifica_campo(doc.Hiden_ane.value) + ", ";
	upd += "iden_mede = " + verifica_campo(doc.Hiden_mede.value) + ", "; 
	
	
	upd += "premedicazione = " + verifica_campo(doc.premedicazione.value) + ", ";
	upd += "ora_ini_anestesia = " + verifica_campo(doc.ora_ini_anestesia.value) + ", ";
	upd += "ora_fine_anestesia = " + verifica_campo(doc.ora_fine_anestesia.value) + ", ";
	upd += "num_verbale = " + verifica_campo(doc.num_verbale.value) + ", ";
	upd += "procedura = " + verifica_campo(doc.procedura.value) + ", ";
	upd += "ora_ini_procedura = " + verifica_campo(doc.ora_ini_procedura.value) + ", ";
	upd += "ora_fine_procedura = " + verifica_campo(doc.ora_fine_procedura.value) + ", ";
	upd += "equival_dose = " + verifica_campo(doc.equival_dose.value) + ", ";
	upd += "descr_procedura = " + verifica_campo(doc.descr_procedura.value) + " ";
	upd += "where iden = " + doc.iden_esame.value;
	
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.query.value = upd;
	//alert('UPD ESAMI: ' + upd);
	
	/*20080609*/
	var win = window.open("", "win_update", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win)
		win.focus();
	else
		win = window.open("", "win_update", 'width=1, height=1, status=yes, top=800000, left=0');

	DOC_UPD.submit();

	ricarica_scheda_tecnica(doc.iden_esame.value, doc.iden_anag.value, 'ST');	
}

function chiudi()
{
	var iden_esame = parent.DatiEsecuzioneSceltaFrame.document.form.iden_esame.value;
	var iden_anag = parent.DatiEsecuzioneSceltaFrame.document.form.iden_anag.value;
	var hidWhere = parent.DatiEsecuzioneSceltaFrame.document.form.hidWhere.value;
	var sorgente = parent.DatiEsecuzioneSceltaFrame.document.form.sorgente.value;

	//alert('IDEN_ESAME:' + iden_esame + " - IDEN_ANAG:" + iden_anag + " - WHERE_COND WK:" + hidWhere);
	//alert(sorgente);
	
	
	parent.parent.opener.aggiorna();
	parent.close();
}


function ricarica_scheda_tecnica(iden_esame, iden_anag, provenienza)
{
	parent.DatiEsecuzioneSceltaFrame.document.form.iden_esame.value = iden_esame;
	parent.DatiEsecuzioneSceltaFrame.document.form.iden_anag.value = iden_anag;
	parent.DatiEsecuzioneSceltaFrame.document.form.provenienza.value = provenienza;
	parent.DatiEsecuzioneSceltaFrame.document.form.submit();
}

function registra_libretto_radiologico()
{
	var doc = document.gestione_esame;

	if(doc.operazione.value == 'INS')
		insert_into_registro_esami();
	if(doc.operazione.value == 'UPD')
		update_on_registro_esami();
}

function ricarica_libretto_radiologico(iden_esame, iden_anag, provenienza)
{
	parent.DatiEsecuzioneSceltaFrame.document.form.iden_esame.value = iden_esame;
	parent.DatiEsecuzioneSceltaFrame.document.form.iden_anag.value = iden_anag;
	parent.DatiEsecuzioneSceltaFrame.document.form.provenienza.value = provenienza;
	parent.DatiEsecuzioneSceltaFrame.document.form.submit();
	//top.mainFrame.workFrame.document.location.replace("SL_DatiEsecuzioneFrameset?iden_esame="+ iden_esame+"&iden_anag="+iden_anag+"&provenienza="+provenienza);
}

function insert_into_registro_esami()
{
	var doc = document.gestione_esame;	
	var DOC_UPD = document.form_update;	
	
	if(doc.hmdc.value == 'S'){
		if(doc.flusso.value == '' || doc.modalita_iniezione.value == ''){
			alert('Attenzione: inserire il flusso e la modalità di iniezione');
			return;
		}
	}
	
	DOC_UPD.action = 'Update';
	DOC_UPD.target = 'win_update';
	DOC_UPD.method = 'POST';
	
	if(doc.total_settoriale[0].checked) 
		doc.htotal_settoriale.value = 'N';
	if(doc.total_settoriale[1].checked) 
		doc.htotal_settoriale.value = 'S';
		
	freazioni_allergiche();	

	var ins = 'INSERT INTO REGISTRO_ESAMI (IDEN_ESAME, DAP, NUM_PROIEZIONI, NUM_PROIEZ_SCARTATE, TMP_SCOPIA, ';
	ins += 'CTDI, DLP, NUM_SEZIONI, SPESSORE_SEZIONI, DURATA_SCANSIONE, TMP_ESPOSIZIONE, TOTAL_SETTORIALE, ';
	ins += 'REAZIONI_ALLERGICHE, NOTE, FLUSSO, MODALITA_INIEZIONE';
	
	ins += ') VALUES (';				
	
	ins += doc.iden_esame.value + ", '" + doc.dap.value.replace(".", ",") + "', '" + doc.num_proiezioni.value.replace(".", ",") + "', '";
	ins += doc.num_proiez_scartate.value.replace(".", ",") + "', '" + doc.tmp_scopia.value.replace(".", ",") + "', '" + doc.ctdi.value.replace(".", ",") + "', '";
	ins += doc.dlp.value.replace(".", ",") + "', '" + doc.num_sezioni.value.replace(".", ",") + "', '" + doc.spessore_sezioni.value.replace(".", ",") + "' , '";
	ins += doc.durata_scansione.value.replace(".", ",") + "', '" + doc.tmp_esposizione.value.replace(".", ",") + "', '" + doc.htotal_settoriale.value.replace(".", ",") + "', ";
	
	
	ins += "'" + doc.hreazioni_allergiche.value + "', '" + doc.note.value + "', '" + doc.flusso.value.replace(".", ",") + "', ";
	ins += "'" + doc.modalita_iniezione.value + "'";
	
	
	ins +=  ")";
	
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.query.value = ins;
	
	/*20080609*/
	var win = window.open("", "win_update", 'width=100, height=100 status=yes, top=800000, left=800000');
	if(win)
		win.focus();
	else
		win = window.open("", "win_update", 'width=100, height=100, status=yes, top=800000, left=800000');
	
	DOC_UPD.submit();
	
	ricarica_libretto_radiologico(doc.iden_esame.value, doc.iden_anag.value, 'LR');
}

function update_on_registro_esami()
{
	var doc = document.gestione_esame;
	var DOC_UPD = document.form_update;

	if(doc.hmdc.value == 'S'){
		if(doc.flusso.value == '' || doc.modalita_iniezione.value == ''){
			alert('Attenzione: inserire il flusso e la modalità di iniezione');
			return;
		}
	}
	
	DOC_UPD.action = 'Update';
	DOC_UPD.target = 'win_update';
	DOC_UPD.method = 'POST';
	
	if(doc.total_settoriale[0].checked) 
		doc.htotal_settoriale.value = 'N';
	if(doc.total_settoriale[1].checked) 
		doc.htotal_settoriale.value = 'S';
		
	freazioni_allergiche();	
	
	var upd = 'UPDATE REGISTRO_ESAMI SET ';
	upd += "dap = '" + doc.dap.value.replace(".", ",") + "', ";
	upd += "num_proiezioni = '" + doc.num_proiezioni.value.replace(".", ",") + "', ";
	upd += "num_proiez_scartate = '" + doc.num_proiez_scartate.value.replace(".", ",") + "', ";
	upd += "tmp_scopia = '" + doc.tmp_scopia.value.replace(".", ",") + "', ";
	upd += "ctdi = '" + doc.ctdi.value.replace(".", ",") + "', ";
	upd += "dlp = '" + doc.dlp.value.replace(".", ",") + "', ";
	upd += "num_sezioni = '" + doc.num_sezioni.value.replace(".", ",") + "', ";
	upd += "spessore_sezioni = '" + doc.spessore_sezioni.value.replace(".", ",") + "', ";
	upd += "durata_scansione = '" + doc.durata_scansione.value.replace(".", ",") + "', ";
	upd += "tmp_esposizione = '" + doc.tmp_esposizione.value.replace(".", ",") + "', ";
	upd += "total_settoriale = '" + doc.htotal_settoriale.value.replace(".", ",") + "', ";	
	
	upd += "reazioni_allergiche = '" + doc.hreazioni_allergiche.value + "', ";
	upd += "note = '" + doc.note.value + "', ";
	upd += "flusso = '" + doc.flusso.value.replace(".", ",") + "', ";
	upd += "modalita_iniezione = '" + doc.modalita_iniezione.value + "' ";
	
	upd += "where iden_esame = " + doc.iden_esame.value;
	
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.query.value = upd;
	
	/*20080609*/
	var win = window.open("", "win_update", 'width=100, height=100, status=yes, top=800000, left=800000');
	if(win)
		win.focus();
	else
		win = window.open("", "win_update", 'width=100, height=100, status=yes, top=800000, left=800000');
	
	DOC_UPD.submit();
	
	ricarica_libretto_radiologico(doc.iden_esame.value, doc.iden_anag.value, 'LR');
}


function fnote(){
	var doc = document.gestione_esame;
	doc.note.value = doc.note.value.toUpperCase();
}


function freazioni_allergiche(){
	var doc = document.gestione_esame;
		
	if(doc.reazioni_allergiche[0].checked) 
		doc.hreazioni_allergiche.value = 'S';
	if(doc.reazioni_allergiche[1].checked) 
		doc.hreazioni_allergiche.value = 'N';	
}




