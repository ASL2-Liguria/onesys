function modificaAnagLink(valore){
	
	idenAnag = array_iden_anag[valore];
	if(idenAnag == 0){
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
	/* modifica aldo 12-14 */
	if (!isPatientReadOnlyCheck(idenAnag)){return;}
	/* ******************* */	
	readOnly = array_readonly[valore];
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG='+idenAnag+'&READONLY='+readOnly;
	
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}


/*
	CANCELLAZIONE ESAMI
	Verranno cancellati solo gli esami non ancora refertati; quindi
	per cancellare un esame refertato bisognerà prima cancellare i referti associati.
*/
function cancEsami()
{
	if(stringa_codici(array_iden_esame) == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	/*
		CONTROLLO REPARTO APPARTENENTE A QUELLI DELL'UTENTE (cdc attivi in web_cdc)
	*/
	//alert('LISTA REPARTI WEB_CDC: ' + baseUser.LISTAREPARTI);
	//alert('MOTIVO CANCELLAZIONE: ' + baseGlobal.MOTIVO_CANCELLAZIONE_OBB);
	var reparto = stringa_codici(array_reparto).toString().split("*");	
	//alert('REPARTI SELEZ: ' + reparto);
	var operazione_consentita = false;

	for(y = 0; y < reparto.length; y++)
	{
		for(i = 0; i < baseUser.LISTAREPARTI.length; i++)
		{
			//alert('REP SEL: ' + reparto[y] + '  MIO REP: ' + baseUser.LISTAREPARTI[i]);
			if(reparto[y].toString() == baseUser.LISTAREPARTI[i].toString())
			{
				operazione_consentita = true;
			}
		}
		if(!operazione_consentita)	
		{
			alert(ritornaJsMsg('no_rep_ute'));//Operazione di cancellazione non consentita: selezionare reparti appartenenti all utente				
			return;
		}
	}

	/*
		CONTROLLO PERMISSIONI UTENTE PER LA CANCELLAZIONE DI UN ESAME
	*/
	var perm_canc_esa = document.frmCancEsa.permissione.value.substring(9,10);
	/*CONTROLLO PERMISSIONI UTENTE CON LO STATO DELL'ESAME PER LA CANCELLAZIONE DI UN ESAME*/
	if(perm_canc_esa == 0)
	{
		alert(ritornaJsMsg('no_perm_canc_esa'));//L utente non è abilitato alla cancellazione di esami
		return;
	}
	else
	{
		var stato_esami = stringa_codici(array_stato);
		
		if(!perm_stato(perm_canc_esa, stato_esami, document.frmCancEsa))
			return;

		if(baseGlobal.OB_PWD_CANC == 'S')
		{
			var ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=ESAMI','', 'height=250,width=400,scrollbars=no,top=200,left=300');
			return;
		}


		var canc_esa_ref = confirm(ritornaJsMsg("canc_esa"));
		
		cancellazioneEsami(canc_esa_ref);
		
		/*if (canc_esa_ref == true)
		{
			document.frmCancEsa.action = 'SL_CancellazioneEsami';
			document.frmCancEsa.target = 'winInsertMotivazione';
			var ins_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
			if (ins_motivo)
			{
				ins_motivo.focus();
			}
			else
			{
				ins_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
			}
			document.frmCancEsa.submit();
		}*/
	}
}

function cancellazioneEsami(canc_esa_ref)
{
	if (canc_esa_ref == true)
	{
		dwr.engine.setAsync(false);
		toolKitDB.getResultData("select is_cancellabile('"+stringa_codici(array_iden_esame)+"') from dual",cancellazioneEsami2);
		dwr.engine.setAsync(true);
	}
	}
function cancellazioneEsami2(canc_esa_ret)
{

	if (canc_esa_ret[0].length<4)
		{
			document.frmCancEsa.action = 'SL_CancellazioneEsami';
			document.frmCancEsa.target = 'winInsertMotivazione';
			var ins_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
			if (ins_motivo)
			{
				ins_motivo.focus();
			}
			else
			{
				ins_motivo = window.open("","winInsertMotivazione","top=200,left=120,width=800,height=223,status=yes,scrollbars=no");
			}
			document.frmCancEsa.submit();
		}
	else
		{
		alert(canc_esa_ret);
		}
}

/*
Funzioni utilizzate per la gestione dell'inserimento della pwd obbligatoria per la cancellazione
di esami
*/
function cancellaESAMI()
{
	if(document.form.pwd.value == '')
	{
		alert('Prego, inserire la password.');
		document.form.pwd.focus();
		return;
	}
	var webpassword = document.form.hpwd.value;//web.webpassword
	var pwd_inserita = document.form.pwd.value;
	
	if(webpassword != pwd_inserita)
	{
		alert('Password errata.');
		document.form.pwd.value = '';
		document.form.pwd.focus();
		return;
	}
	else
	{
		opener.cancellazioneEsami(true);
		self.close();
	}
}

function annullaESAMI()
{
	opener.aggiorna();
	self.close();
}

/*
	@param  perm_canc_esa WEB.cod_ope decima posizione (0..5)
	@param  stato_esami ESAMI.stato degli esami selezionati
*/
function perm_stato(perm_canc_esa, stato_esami, doc_form)
{	
	var elenco_esami = stringa_codici(array_iden_esame);

	/*alert('PERMISSIONE: ' + perm_canc_esa);
	alert('STATO: ' + stato_esami);
	alert('REC SELEZ ' + vettore_indici_sel.length);
	alert('ACCETTATI ' + stringa_codici(array_accettato));
	alert('ESEGUITI ' + stringa_codici(array_eseguito));*/
	
	//alert('ESAMI: ' + elenco_esami);

	/*GESTIONE CANCELLAZIONE ESAMI PRENOTATI*/
	//prenDWRClient.cancella(elenco_esami, check_delete);

	var accettati = stringa_codici(array_accettato);
	try{
		accettati = stringa_codici(array_accettato).split('*');
	}
	catch(e){
	}
	
	var eseguiti = stringa_codici(array_eseguito);
	try{
		eseguiti = stringa_codici(array_eseguito).split('*');
	}
	catch(e){
	}
	

	var cancella = true;
	
	if(stato_esami.substring(9,10) == 'R')
	{
		alert(ritornaJsMsg('prima_canc_ref'));//Prego, prima effettuare la cancellazione dei referti associati
		cancella = false;
		return;
	}
	else
		if(perm_canc_esa == 1)
		{
			for(i = 0; i < vettore_indici_sel.length; i++)
			{
				if(accettati[i] == '1')//stato_esami.substring(0,1) != 'P'
				{
					alert(ritornaJsMsg('perm_canc_p'));//L utente può effettuare la cancellazione di esami fino allo stato prenotato
					cancella = false;
					return;
				}
			}
		}
		else
			if(perm_canc_esa == 2)
			{
				for(i = 0; i < vettore_indici_sel.length; i++)
				{
					if(eseguiti[i] == '1')//stato_esami.substring(1,2) != 'A' && stato_esami.substring(0,1) != 'P'
					{
						//L utente può effettuare la cancellazione di esami fino allo stato accettato
						alert(ritornaJsMsg('perm_canc_a'));
						cancella = false;
						return;
					}
				}
			}
			else
				if(perm_canc_esa == 3)
				{
					for(i = 0; i < vettore_indici_sel.length; i++)
					{
						if(stato_esami.substring(9,10) == 'R')//stato_esami.substring(2,3) != 'E' && stato_esami.substring(1,2) != 'A' && stato_esami.substring(0,1) != 'P'
						{
							//L utente può effettuare la cancellazione di esami fino allo stato eseguito
							alert(ritornaJsMsg('perm_canc_e'));
							cancella = false;
							return;
						}
					}
				}
	return cancella;
}

/**
 	Funzione richiamata dal dwr per la cancellazione di esami
	PRENOTATI.
*/
function check_delete(errore)
{
	if(errore != '')
	{
		alert(errore);
		return;
	}	
}




/*FINE CANCELLAZIONE ESAMI*/

/*
	VISUALIZZA ESAMI DEL PAZIENTE SELEZIONATO DALLA WK dei filtri
*/
function visualizza_esami()
{
	if(conta_esami_sel() == 0)
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	
	var iden_anag = stringa_codici(array_iden_anag);
	
	if (conta_esami_sel() > 1)
	{
		ar_iden_anag = iden_anag.split("*");
		iden_anag = ar_iden_anag[0];
	}
	
	//alert(iden_anag);
	
	/*var doc = document.frmVisEsa;
	doc.hidWhere.value = ' where iden_anag = ' + iden_anag;
	doc.campi_ricerca.value = stringa_codici(array_cogn) + '*' + stringa_codici(array_nome) + '*' + stringa_codici(array_data);
	doc.iden_anag.value = iden_anag;
	document.frmAggiorna.hidWhere.value += ' and iden_anag = ' + iden_anag;*/
	
	document.frmAggiorna.hidWhere.value = '  where iden_anag = ' + iden_anag;

	document.frmAggiorna.submit();
}

/*
	CANCELLAZIONE REFERTO
*/
function cancella_referto()
{
	if (conta_esami_sel() == 0)
	{
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1)
	{
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	/*Controllo se il paziente è READONLY*/
	var iden_anag = stringa_codici(array_iden_anag);
	
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	

	/*Controllo CDC*/
	var reparto = stringa_codici(array_reparto);
	var controllo_reparto = false;
	for(i = 0; i < baseUser.LISTAREPARTI.length; i++)
		if(reparto.toString() == baseUser.LISTAREPARTI[i])
		{
			controllo_reparto = true;
		}
	if(!controllo_reparto)
	{
		alert(ritornaJsMsg('no_rep_ute'));//Operazione di cancellazione non consentita: selezionare reparti appartenenti all utente				
		return;
	}
	
	/*Controllo permissioni*/
	var perm_canc_ref = document.frmCancEsa.permissione.value.substring(9,10);
	//alert("PERMIS CANC REF: " + perm_canc_ref);
	
	/*DEVO CANCELLARE SOLO REFERTI CON LO STATO ESAME =  R */
	if(perm_canc_ref == 4 || perm_canc_ref == 5)
		{
			if(controllo_stato_esame())
			{
				document.frmCancEsa.idenReferto.value = stringa_codici(array_iden_ref);

				var ins_pwd_cancellazione = baseGlobal.OB_PWD_CANC;
				if(ins_pwd_cancellazione == 'S')
				{
					var ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=REFERTI','', 'height=250,width=400,scrollbars=no,top=200,left=300');
					return;
				}
				else
				{
					var canc_ref = confirm(ritornaJsMsg("canc_ref"));
					if(canc_ref)
					{
						document.frmCancEsa.action = 'SL_CancellazioneReferto';
						document.frmCancEsa.target = '_self';//win_canc_ref
						//alert('IDEN_REF: ' + document.frmCancEsa.idenReferto.value);
					
						document.frmCancEsa.submit();
					
						/*var win_canc_ref = window.open("","win_canc_ref","top=10000,left=0");
						if (win_canc_ref)
						{
							win_canc_ref.focus();
						}
						else
						{
							win_canc_ref = window.open("","win_canc_ref","top=10000,left=0");
						}*/
			
						//document.frmCancEsa.submit();
					
						aggiorna_worklist();//win_canc_ref

					}//if(canc_ref)
				}//else
			}//controllo_stato_esame())
		}//if(perm_canc_ref == 4 || perm_canc_ref == 5)
	else
	{
		alert(ritornaJsMsg('perm_no_suff'));//'Permissioni non sufficienti per cancellare un referto'
		return;
	}
}

function controllo_stato_esame()
{
	var canc_ref 	= true;
	var stato  		= stringa_codici(array_stato);
	var iden_ref 	= stringa_codici(array_iden_ref);
	
	//alert('STATO ESAME:' + stato);
	
	if(stato.indexOf('R') == -1 || iden_ref == '-1')
	{
		alert(ritornaJsMsg('esa_ref_canc_ref'));//alert('L esame deve essere refertato per poter cancellare il referto associato.');
		canc_ref = false;
		return;
	}
	
	if(stato.indexOf('F') > -1 || stato.indexOf('S')>-1)
	{
		if(stato.indexOf('S') > -1)
			alert(ritornaJsMsg('no_ref_s'));//alert('Impossibile cancellare un referto sospeso.Per cancellare un referto bisogna prima togliere il sospeso.');
		else
			alert(ritornaJsMsg('no_ref_f'));//alert('Impossibile cancellare un referto che è già stato firmato');
		canc_ref = false;
		return;
	}
	return canc_ref;
}

function aggiorna_worklist()//win_canc_ref
{
	//win_canc_ref.close();
	aggiorna();
}

/*
Funzioni che gestiscono la parte di inserimento della password per la cancellazione del referto.
*/
function cancellaREFERTI()
{
	if(document.form.pwd.value == '')
	{
		alert('Prego, inserire la password.');
		document.form.pwd.focus();
		return;
	}
	var webpassword = document.form.hpwd.value;//web.webpassword
	var pwd_inserita = document.form.pwd.value;
	
	if(webpassword != pwd_inserita)
	{
		alert('Password errata.');
		document.form.pwd.value = '';
		document.form.pwd.focus();
		return;
	}
	else
	{
		opener.document.frmCancEsa.action = 'SL_CancellazioneReferto';
		opener.document.frmCancEsa.target = '_self';
		opener.document.frmCancEsa.idenReferto.value = opener.stringa_codici(opener.array_iden_ref);
		//alert('IDEN_REF: ' + opener.document.frmCancEsa.idenReferto.value);

		opener.document.frmCancEsa.submit();

		opener.aggiorna_worklist();
		
		self.close();
	}
	
}

function annullaREFERTI()
{
	opener.aggiorna();
	self.close();
}


/*FINE CANCELLAZIONE REFERTO*/





/*Inserimento anagrafica*/
function inserimentoAnagrafica()
{
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}

function apri_worklist()
{
	parent.document.location.replace("worklistInizio");
}

function apri_ric_paz_NCD()
{
	parent.document.location.replace("SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=0&provenienza=FromMenuVerticalMenu&tipo_ricerca=0");	//parent.document.location.replace("SL_RicercaPazienteFrameset?rows_frame_uno=141&rows_frame_due=*,0&param_ric=COGN,NOME,DATA&menuVerticalMenu=FromMenuVerticalMenu&nome_funzione_ricerca=ric_cogn_nome_data(");

}

/*function esami_preparati()
{
	for(i=0; i < array_stato_esameMN.length; i++)
	{
		if(array_stato_esameMN[i] == 'P')
		{
			document.all.oTable.rows(i).className = 'MN_esami_preparati';
		}
		else
			if(array_stato_esameMN[i] == 'S')
			{
				document.all.oTable.rows(i).className = 'MN_esami_somministrati';
			}
	}
}*/


function apri_preparazioneMN(indice_wk)
{
	var iden_esame = array_iden_esame[indice_wk];
	
	//alert('IDEN_ESAME: ' + iden_esame);
	
	calcolo_dose('NO_MOD', iden_esame);
}


/*function chiudi_visEsami_daGestRichieste()
{
	parent.document.all.oFramesetGesRichieste.rows = '167,*,0';	
	parent.RicercaRichiesteFrame.ricerca();
}*/

function chiudi_visEsami_daGestRichieste()
{
	var pagina = parent.RecordRichiesteFrame.document.form_wkl_richieste.pagina_da_vis.value;
	
	//alert('NUMERO PAGINA: ' + pagina);
		
	parent.document.all.oFramesetGesRichieste.rows = '167,*,0';	
	parent.RicercaRichiesteFrame.ricerca(pagina);
}


function apri_blank()
{
	window.open('blank','','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
}


/**/
function vis_MN_paz_esa_tracc()
{
	var selezione = stringa_codici(array_iden_anag);
	var metodica = stringa_codici(array_metodica);
	var posizione = -1;
	
	try{
		posizione = selezione.indexOf("*");
	}
	catch(e){
		posizione = -1;
	}
	

	if(selezione == '' ||  posizione!= -1 || metodica != 'Z'){		
		if(selezione == '' ||  posizione!= -1)
			alert(ritornaJsMsg('selezionare'));//Prego, selezionare un solo paziente
		else
			alert('Attenzione: selezionare un esame di Medicina Nucleare');
		return;
	}
	
	
	var sf= '{VIEW_MMN_STAMPA_PAZ_ESA_TRACC.IDEN_ANAG} = ' + selezione;

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=MN_PAZIENTE_ESAMI_TRACCIANTI&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
}


/**
Gestione RIA
*/
function modificaRIA(){
	var finestra = null;
	var selezione = stringa_codici(array_iden_esame);
	var height = screen.availHeight;
	var width = screen.availWidth;
	var metodica = null;
	var msg = null;
	
	// Ambulatorio
	alert("Modifica RIA disabilita");
	return;
	// ************
	
	metodica = stringa_codici(array_metodica);

	if(metodica.indexOf("*") != - 1){
		msg = 'Attenzione: selezionare un solo esame';
	}
	if(metodica != '0')
		if(msg == null)
			msg = 'Attenzione: selezionare un esame RIA';
		else
			msg += ' RIA';
	
	if(msg != null){
		alert(msg);	
		return;
	}
	
	url = 'LaboDettaglioMainFrame?IDEN_TEMP='+selezione+'&COD_ESA=VITRO';
	url += '&IDEN_ANAG=' + stringa_codici(array_iden_anag);

	finestra  = window.open(url, "", "width="+width+",height="+height+"top=0,left=0");
}



function stampaCredenziale()
{
	var sql = "";
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	var iden_esame = stringa_codici(array_iden_esame);
	var reparto = stringa_codici(array_reparto);
	
	var sf= '{VIEW_MN_CREDENZIALI_VIVO_VITRO.IDEN_ESAME}=' + iden_esame + ''

	var finestra  = window.open('elabStampa?stampaFunzioneStampa=CREDENZIALE&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");

	if (finestra){
		finestra.focus();
	}
	else{
		var finestra  = window.open('elabStampa?stampaFunzioneStampa=CREDENZIALE&stampaSelection=' + sf + '&stampaAnteprima=S'+"","","top=0,left=0");
	}
}

/*fine gestione RIA*/



/**
Funzione richiamata da Inserimento Paziente solo a VERONA
*/
function inserimentoAnagraficaVerona()
{

 if(parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value=='' || parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value=='' || parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value=='' )
	{
	alert("Effettuare prima la ricerca compilando nome cognome e data di nascita del paziente")
	return;
	}

	inserimentoAnagrafica()
}



function diarioMedico(){
	var iden_anag = null;
	var servlet = null;
	
	iden_anag = stringa_codici(array_iden_anag);
	if(iden_anag == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	//alert(iden_anag);
	
	servlet = "SL_RicercaGenericaFrameset?modulo=DIARIO_MEDICO";
	servlet += "&rf1=105&rf2=*&rf3=0";
	servlet += "&provenienza=ricercaPaziente";
	servlet += "&tipo_ricerca=7";
	servlet += "&iden_anag="+iden_anag;
	
	//window.open(servlet,"","width="+screen.width+",height="+screen.height+", status=yes, top=0,left=0");
	window.open(servlet,"","width=1280,height=1024, status=yes, top=0,left=0");
}