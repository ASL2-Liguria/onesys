var winSceltaReparti = null;
var tipologiaPagina = '';

/*
Vedi funzione finestra_attesa(provenienza) che non è + richiamata con la ricerca dal db
*/
function funzione()
{
	
	try{
			top.chiudi_attesa();
		//parent.parent.hideFrame.chiudi_attesa();//parent.RicPazRicercaFrame.chiudi_attesa();
	}
	catch(e){
		//alert(e.description);
	}	
	
	try{
		parent.parent.hideFrame.chiudi_attesa();//parent.RicPazRicercaFrame.chiudi_attesa();
	}
	catch(e){
		//alert(e.description);
	}
	try{
		connectDragDropToObjectById();
		// definisco la funzione di callback
		// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
		setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
	}
	catch(e){
		//alert(e.description);
	}
	
	
	var oggetto = document.getElementById("oTable");

	if(document.form.provenienza.value == 'ripristino_cancellati'){
		oggetto.ondblclick = function(){visualizza_esami();};
	} 
/*	else{
		try{
			oggetto.ondblclick = function(){gestioneAnagrafica('VIS_ESA');}
		}
		catch(e){
			oggetto.ondblclick = function(){worklist_esami_da_prenotazione();}
		}
	}*/
	
	if(document.form.provenienza.value == 'RiconciliaSpostaEsami'){
		parent.RicPazUtilityFrame.location.reload("RiconciliaPazienti");
		
		//RiconciliaPazienti?servlet_call=" + this.menuVerticalMenu + "&cdc=" + this.cdc + "&elenco_richieste_da_accettare=" + this.elenco_richieste_da_accettare + "&stato_esame=" + this.tipo_registrazione
	}
	
	
}


/*
	Funzione richiamata dopo l'inserimento di un esame o l'annullamento
	dell'inserimento di un esame
*/
function aggiorna()
{
	parent.RicPazRicercaFrame.applica();
	self.close();	
	
}


function aggiorna_anag(cogn, nome, data, cod_fisc, id_paz_dicom, num_nos, num_arc, tipo_ricerca, provenienza)
{
	//alert(cogn + ' - ' + nome + ' - ' + data + ' - ' + cod_fisc + ' - ' + id_paz_dicom + ' - ' + num_nos);
	//alert('TIPO RICERCA: ' + tipo_ricerca + ' - PROVENIENZA: ' + provenienza);
	
	if(tipo_ricerca == '0')//COGN,NOME,DATA
	{
		parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
		
		/*parent.RicPazRicercaFrame.document.forms[0].elements(6).value = cogn;
		parent.RicPazRicercaFrame.document.forms[0].elements(7).value = nome;
		parent.RicPazRicercaFrame.document.forms[0].elements(8).value = data.substring(6,8) + "/" + data.substring(4,6) + "/" + data.substring(0,4);*/
		
		
		parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value = cogn;
		parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value = nome;
		parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value = data.substring(6,8) + "/" + data.substring(4,6) + "/" + data.substring(0,4);
		
		parent.RicPazRicercaFrame.ricercaCognNomeData();
	}
	else
		if(tipo_ricerca == '1')//COD_FISC
		{
			parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
			//parent.RicPazRicercaFrame.document.forms[0].elements(3).value = cod_fisc;
			parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value = cod_fisc;
			parent.RicPazRicercaFrame.ricercaCodiceFiscale();
		}
		else
			if(tipo_ricerca == '3')//ID_PAZ_DICOM
			{
				parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
				
				//parent.RicPazRicercaFrame.document.form_pag_ric.ID_PAZ_DICOM.value = id_paz_dicom;
				parent.RicPazRicercaFrame.ricercaIdPazDicom();
			}
			else
				if(tipo_ricerca == '4')//NUM_NOSOLOGICO
				{
					parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
					
					//parent.RicPazRicercaFrame.document.form_pag_ric.NUM_NOSOLOGICO.value = num_nos;
					parent.RicPazRicercaFrame.ricercaNumeroNosologico();
				}
				else
					if(tipo_ricerca == '2')//NUM_ARC
					{
						parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;
				
						parent.RicPazRicercaFrame.document.form_pag_ric.NUM_ARC.value = num_arc;
						parent.RicPazRicercaFrame.ricercaNumeroArchivio();
					}
					else
						if(tipo_ricerca == '5')//NUM_OLD
						{
							parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;

							parent.RicPazRicercaFrame.ricercaNumeroArchivioNumOld();
						}
						else
							if(tipo_ricerca == '6')//DA_CONFIGURARE
							{
								parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value = provenienza;

								parent.RicPazRicercaFrame.ricercaDaConfigurare();
							}
}


function aggiorna_chiudi()
{
	parent.RicPazRicercaFrame.applica(document.form.pagina_da_vis.value);
}


function aggiorna_chiudi_canc()
{
	var pag_da_vis = document.form.pagina_da_vis.value;
	var elenco_paz = iden.length;
	
	if(elenco_paz == 1)
		pag_da_vis = pag_da_vis - 1;
		
	parent.RicPazRicercaFrame.applica(pag_da_vis);
}

//functino che apre la wk dei pt per la direzione
function apriWkDirezione(){

	var url='servletGenerator?KEY_LEGAME=PT_FILTRI_WK_DIREZIONE';
	
	window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
}


/*
	utilizzo DWR solo ed esclusivamente per la ricerca del paziente che
	può essere effettuata in locale o remoto
*/
function gestioneAnagrafica(tipo_operazione)
{
	var tipo_ricerca = document.form.ricerca_anagrafica.value;//document.form_canc_paz.ricerca_anagrafica.value;
	iden_remote_anag = stringa_codici(iden);
	
//	alert('Tipo Ricerca Remota: ' + tipo_ricerca);
//	alert('Tipo Operazione: ' + tipo_operazione);
//	alert(iden_remote_anag);
	
	if(iden_remote_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));//Prego, effettuare una selezione
		return;
	}
	
	/*Controllo se il paziente è READONLY se la ricerca è in locale*/
	if((tipo_ricerca != '2' || tipo_ricerca != '3') && isLockPage('ANAGRAFICA', iden_remote_anag, 'ANAG') && tipo_operazione != 'VIS_ESA' && tipo_operazione != 'MOD')
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	if(tipo_operazione == 'MOD')
	{
		if(tipo_ricerca == 2){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, modificaAnagrafica);
			dwr.engine.setAsync(true);
		}
		else
			modificaAnagrafica();
	}
	else
		if(tipo_operazione == 'CANC')
		{
			if(tipo_ricerca == 2)
			{
				alert(ritornaJsMsg('no_canc_paz_remoti'));//Non si possono effettuare cancellazioni di pazienti remoti.
			}
			else
				cancellaAnagrafica();
		}
		else
			if(tipo_operazione == 'VIS_ESA')
			{
				if(tipo_ricerca == 2){
					dwr.engine.setAsync(false);
					CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, worklist_esami);
					dwr.engine.setAsync(true);
				}
				else
					worklist_esami(iden_remote_anag);
			}
			else
				if(tipo_operazione == 'INS_ESA')
				{
					if(tipo_ricerca == 2){
						dwr.engine.setAsync(false);
						CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, inserimentoEsame);
						dwr.engine.setAsync(true);
					}
					else
						inserimentoEsame();
				}
				else
				/*DA VERIFICARE PER LA RICERCA REMOTA*/
					if(tipo_operazione == 'VIS_NUM_ARCH')
					{
						if(tipo_ricerca == 2){
							dwr.engine.setAsync(false);
							CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, cbk_visualizza_numeri_archivio);
							dwr.engine.setAsync(true);
						}
						else
							visualizza_numeri_archivio();
					}
					
					
	if(tipo_operazione == 'INSERIMENTO_RICHIESTE'){
		if(tipo_ricerca == '2'){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, inserimentoRichieste);
			dwr.engine.setAsync(true);
		}
		else
			inserimentoRichieste(iden_remote_anag,tipo_ricerca);
	}	
	if(tipo_operazione == 'INSERIMENTO_PRENOTAZIONE'){
		if(tipo_ricerca == '2'){
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.gestione_anagrafica(iden_remote_anag, inserimentoPrenotazione);
			dwr.engine.setAsync(true);
		}
		else
			inserimentoPrenotazione(iden_remote_anag,tipo_ricerca);
	}
	
}

function inserimentoRichieste(idenAnag,tipo_ricerca){
//alert('idenAnag nella funzione:   ' + idenAnag);

//se tipo_ricerca == '2' deve cercare in remoto		
if (tipo_ricerca == '2'){
		if(idenAnag.indexOf('CJsGestioneAnagrafica') != -1){
				alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + idenAnag);
				return;
		}
	}

	//PARTE NUOVA Luca
	var nomePaz = stringa_codici(array_cognome)+' '+stringa_codici(array_nome)+' '+stringa_codici(array_data);
	//alert(nomePaz);

	var finestra = window.open('servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC&INT_EST=E&Hiden_anag='+idenAnag+'&tipoAlbero=ALBERO_RICHIESTE&PRENOTAZIONE=N&LETTURA=N&Hreparto_ricovero=&cod_dec_Reparto=&Hiden_pro=&PAZIENTE='+nomePaz,'WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");
	//window.open('servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&funzione=inserisciRichiestaGenerica();&iden_anag='+idenAnag+'&ModalitaCartella=MODIFICA','WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");
}


function inserimentoPrenotazione(idenAnag,tipo_ricerca){
//alert('idenAnag nella funzione:   ' + idenAnag);

//se tipo_ricerca == '2' deve cercare in remoto		
if (tipo_ricerca == '2'){
		if(idenAnag.indexOf('CJsGestioneAnagrafica') != -1){
				alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + idenAnag);
				return;
		}
	}
	//window.open('servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC&Hiden_anag='+idenAnag+'&PRENOTAZIONE=S&LETTURA=N&Hreparto_ricovero=&cod_dec_Reparto=&Hiden_pro=',"","status=yes fullscreen=yes scrollbars=yes");
	var finestra = window.open('servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC&Hiden_anag='+idenAnag+'&LETTURA=N&tipoAlbero=ALBERO_PRENOTAZIONI&PRENOTAZIONE=S&Hreparto_ricovero=&cod_dec_Reparto=&Hiden_pro=',"","status=yes fullscreen=yes scrollbars=yes");
}


function cbk_visualizza_numeri_archivio(anagIden)
{
	//alert('anag locale ' + anagIden);
	
	if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
		alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
		return;
	}
	
	visualizza_numeri_archivio(anagIden);
}


/*
	Funzione di callback
	modifica anagrafica
	
	SCHEDA ANAGRAFICA VECCHIA
*/
function modificaAnagraficaOld(anagIden)
{
	//alert('anag locale ' + anagIden);
	var readOnly = '';
	var varAnag = null;
	var doc = document.form_scheda_anag; 

	if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
		alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
		return;
	}

	if(isNaN(anagIden))
		anagIden = stringa_codici(iden);

	if(anagIden == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
	
	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
		
    varAnag = window.open('', 'winAnag', 'status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	
    doc.hIdenAnag.value = anagIden;
    doc.readOnly.value = readOnly;
	
	doc.permissione.value = baseUser.COD_OPE;
	doc.sorgente.value = parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value;//quella del menuVerticale

    doc.submit();
}

/*
	Funzione di callback
	modifica anagrafica
	
	SCHEDA ANAGRAFICA BY GENERATORE JACK
*/
function modificaAnagrafica(anagIden)
{
	var readOnly = '';

	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}

	if(isNaN(anagIden))
		anagIden = stringa_codici(iden);

	if(anagIden == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
	
	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
	
	/******************************************************************/
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA&IDEN_ANAG='+anagIden+'&READONLY='+readOnly;
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	   	}catch(e){}
	return finestra;
	/******************************************************************/
	
}

/*
	Inserimento nuovo paziente
	
	SCHEDA ANAGRAFICA VECCHIA
*/
function inserimentoAnagraficaOld()
{
	var doc = document.form_scheda_anag;
	var varAnag = null;
	
	varAnag = window.open('','winAnag','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	doc.hIdenAnag.value = '';

	var ric_per_nome = parent.RicPazRicercaFrame.document.getElementsByName('NOME');
	var ric_per_cod_fisc = parent.RicPazRicercaFrame.document.getElementsByName('COD_FISC');
	var ric_per_num_arc = parent.RicPazRicercaFrame.document.getElementsByName('NUM_ARC');
	var ric_per_num_nos = parent.RicPazRicercaFrame.document.getElementsByName('NUM_NOSOLOGICO');
	var ric_per_pat_id = parent.RicPazRicercaFrame.document.getElementsByName('ID_PAZ_DICOM');
		
  	if(ric_per_nome.length > 0)
	{
		//alert('ncd'+ric_per_nome.length);
        doc.strCogn.value = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;
        doc.strNome.value = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;
        doc.strDataPaz.value = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;
		//document.form_scheda_anag.strSesso.value = parent.RicPazRicercaFrame.document.form_ric_paz.SESSO.value;	
	}
	else
        if(ric_per_cod_fisc.length > 0)
		{
			//alert('cf'+ric_per_cod_fisc.length);
			//alert(parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value);
        	doc.strCodiceFisc.value = parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value;
		}
		else
			if(ric_per_num_arc.length > 0)
			{
				doc.num_arc.value = parent.RicPazRicercaFrame.document.form_pag_ric.NUM_ARC.value;
			}
			else
				if(ric_per_num_nos.length > 0)
				{
					doc.strNNos.value = parent.RicPazRicercaFrame.document.form_pag_ric.NUM_NOSOLOGICO.value;
				}
				else
					if(ric_per_pat_id.length > 0)
					{
						doc.strIdPazDicom.value = parent.RicPazRicercaFrame.document.form_pag_ric.ID_PAZ_DICOM.value;
					}
	
	
	doc.operazione.value = 'INS';
	doc.permissione.value = baseUser.COD_OPE;
	doc.sorgente.value = parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value;//quella del menuVerticale

	//alert(doc.sorgente.value);
	
	doc.submit();
}

/*
	Inserimento nuovo paziente
	
	SCHEDA ANAGRAFICA BY GENERATORE JACK
*/
function inserimentoAnagrafica(){
	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
	
	var ric_per_nome = parent.RicPazRicercaFrame.document.getElementsByName('NOME');
	var ric_per_cod_fisc = parent.RicPazRicercaFrame.document.getElementsByName('COD_FISC');
	
	if(ric_per_nome.length > 0){
		var strCogn = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;
        var strNome = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;
        var strData = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;
		if(strCogn != "") url += "&COGNOME="+strCogn;
		if(strNome != "") url += "&NOME="+strNome;
		if(strData != "") url += "&DATA="+strData;
	}	
	if(ric_per_cod_fisc.length > 0){
        var strCF = parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value;
		if(strCF != "") url += "&COD_FISC="+strCF;
	}
	
	var finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndInserimentoAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	   	}catch(e){}
	return finestra;
}

/*
	Modifica anagrafica da un link di una worklist
	
	SCHEDA ANAGRAFICA BY GENERATORE JACK
*/
function modificaAnagLinkOld(valore)
{
	var idenAnag = '';
    var readOnly = '';
	var doc = document.form_scheda_anag;
	var varAnag = null;
	
	if(valore.toString() == '')
    	idenAnag = stringa_codici(iden);
	else
	{
		idenAnag = iden[valore];
		readOnly = readonly[valore];
	}
    if(idenAnag == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
    varAnag = window.open('','winAnag','status=yes, scrollbars = yes, width=1000, height=680, top=0,left=5');
	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
    
	doc.hIdenAnag.value = idenAnag;
    doc.readOnly.value = readOnly;
    
	doc.permissione.value = baseUser.COD_OPE;
	doc.sorgente.value = parent.RicPazRicercaFrame.document.form_pag_ric.provenienza.value;//quella del menuVerticale
	
	doc.submit();
}

/*Modifica anagrafica da un link di una worklist*/
function modificaAnagLink(valore){

	var url='servletGenerator?KEY_LEGAME=SCHEDA_ANAGRAFICA';
	
	var idenAnag = '';
    var readOnly = '';
	var doc = document.form_scheda_anag;
	var varAnag = null;
	
	if(valore.toString() == '')
    	idenAnag = stringa_codici(iden);
	else{
		idenAnag = iden[valore];
		readOnly = readonly[valore];
	}
    if(idenAnag == 0){
    	alert(ritornaJsMsg('selezionare'));
        return;
    }

	if(readOnly == '')
    	readOnly = stringa_codici(readonly);
    
	url = url + "&IDEN_ANAG=" + idenAnag + "&READONLY=" + readOnly;	
	
	var finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	if (finestra) {
		finestra.focus();
	} else {
		finestra = window.open(url,"wndModificaAnagrafica","status=0,scrollbars=1,menubar=0,height=" + screen.availHeight + ",width=" + screen.availWidth + ",top=0,left=0");
	}
	
	return finestra;
}


function cancellaAnagrafica(iden_canc)
{
	var doc = document.form_canc_paz;
	var scelta = '';
	var ins_pwd = null;
	var finestra = null;
	
	if(isNaN(iden_canc))
		iden_canc = stringa_codici(iden);

    if(iden_canc == 0){
    	alert(ritornaJsMsg('selezionare'));
        return;
    }

	if(baseGlobal.OB_PWD_CANC == 'S'){//doc.ob_pwd_canc.value
		ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=ANAG','', 'height=250,width=400,scrollbars=no,top=200,left=300');
		return;
	}
	else
    	scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?
		
    if(scelta == true) 
	{
	    finestra = window.open("","winCancPaz","top=0,left=100000000");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winCancPaz","top=0,left=100000000");
		}
		
		doc.iden_paz_canc.value=iden_canc;
		
		doc.permissione.value = baseUser.COD_OPE;
		doc.ob_pwd_canc.value = baseUser.OB_PWD_CANC;
		doc.ricerca_anagrafica.value = baseGlobal.RICERCA_ANAGRAFICA;
        
		doc.submit();
	}
}
/*
	Funzione utilizzata dalla pagina di Riconciliazione/Sposta Esami
	che deve ricaricare la worklist della riconciliazione in caso 
	della cancellazione di un paziente
*/
function cancAnagRicSpEsami()
{
	var doc = document.form_canc_paz;
	var scelta = '';
	
	iden_canc = stringa_codici(iden);
	doc.permissione.value = baseUser.COD_OPE;
	
	//alert('TIPO RICERCA: ' + document.form.ricerca_anagrafica.value);
	if(document.form.ricerca_anagrafica.value == 2)
	{
		alert(ritornaJsMsg('no_canc_paz_remoti'));//Non si possono effettuare cancellazioni di pazienti remoti.
		return;
	}
    if(iden_canc == 0)
	{
    	alert(ritornaJsMsg('selezionare'));
        return;
    }
    //var scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?

	
	if(doc.ob_pwd_canc.value == 'S')
	{
		var ins_pwd = window.open('SL_InsPwdCancellazione?provenienza=ANAG','', 'height=250,width=400,scrollbars=no,top=200,left=300');
		return;
	}
	else
    	scelta = confirm(ritornaJsMsg('c1'));//Sei sicuro di voler cancellare il record selezionato?
	
	
    if(scelta == true) 
	{
		var finestra = window.open("","winCancPaz","top=0,left=100000000");
		if (finestra)
		{
			finestra.focus();
		}
		else
		{
			finestra = window.open("","winCancPaz","top=0,left=100000000");
		}
		
		doc.iden_paz_canc.value=iden_canc;
		
        doc.submit();
		
		parent.RicPazUtilityFrame.reloadMerge();
	}
}


function getCampiRicerca()
{
	var doc = document.form;
	try{
		if(parent.RicPazRicercaFrame.document.form_pag_ric.NOME){
			doc.NOME.value = parent.RicPazRicercaFrame.document.form_pag_ric.NOME.value;	
			doc.COGN.value = parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value;	
			doc.DATA.value = parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value;	
		}
		
		if(parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC){
			doc.COD_FISC.value = parent.RicPazRicercaFrame.document.form_pag_ric.COD_FISC.value;	
		}
	}
	catch(e){
	}
	
	doc.hidWhere.value = parent.RicPazRicercaFrame.document.form_pag_ric.hidWhere.value;	
	doc.hidOrder.value = parent.RicPazRicercaFrame.document.form_pag_ric.hidOrder.value;	
}


function avanti(numero_pagina)
{
	var doc = document.form;
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();

	doc.submit();
}

function indietro(numero_pagina)
{
	var doc = document.form;
	
	doc.pagina_da_vis.value = numero_pagina;
	getCampiRicerca();
	
	doc.submit();
}

function inserimentoEsame(iden_anag)
{
	//alert('inserimentoEsame: ' + iden_anag);
	var query = null;
	
	if(typeof iden_anag != 'undefined')
		if(iden_anag.indexOf('CJsGestioneAnagrafica') != -1)
		{
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + iden_anag);
			return;
		}
	
	if(isNaN(iden_anag))
		iden_anag = stringa_codici(iden);
	
	if(iden_anag == '')
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}
	
	if(parent.RicPazRicercaFrame.document.form_pag_ric.NUM_NOSOLOGICO){
		//alert('baseGlobal.REPARTO_DI_RICOVERO: ' + baseGlobal.REPARTO_DI_RICOVERO);
		if(baseGlobal.REPARTO_DI_RICOVERO == 'S'){
			query = 'select iden_pro provenienza from nosologici_paziente where iden_anag = ';
			query += iden_anag + " and dimesso = 'N' and deleted = 'N'";
			//alert(query);
			dwr.engine.setAsync(false);
			CJsGestioneAnagrafica.getRepartoRicovero(iden_anag, query, cbk_inserimentoEsame);
			dwr.engine.setAsync(true);
		}
		else
			cbk_inserimentoEsame(iden_anag + ", ''");
	}
	else	
		cbk_inserimentoEsame(iden_anag + ", ''");
}

/**
*/
function cbk_inserimentoEsame(iden_anagIden_pro){
	//alert('cbk_inserimentoEsame: ' + iden_anagIden_pro);
	var iden_anag = null;
	var iden_pro = null;
	var finestra = null;
	var doc = document.form_accetta_paziente;
	
	try{
		iden_anag = iden_anagIden_pro.split(",")[0];
		iden_pro = iden_anagIden_pro.split(",")[1];
	}
	catch(e){
		alert('ATTENZIONE errore: ' + iden_anagIden_pro + ' - ' + e.description);
	}
	
	doc.action = 'sceltaEsami';
	doc.target = 'winSceltaEsami';
	finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra = window.open("","winSceltaEsami","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	
	doc.Hiden_anag.value = iden_anag;
	
	iden_pro = iden_pro.replace(/\'/g, "");
	if(iden_pro != "''")
		doc.Hiden_pro.value = iden_pro;
	else
		doc.Hiden_pro.value = '';
	
	doc.tipo_registrazione.value = "I";		

	/*Aggiungo il campo hidden per poter ricaricare la worklist degli esami dall'inserimento esame
	dalla ricerca del paziente*/
	var campo_carica_worklist_esami = document.createElement("input");
	campo_carica_worklist_esami.type = 'hidden';
	campo_carica_worklist_esami.name = 'Hservlet_succ';
	campo_carica_worklist_esami.value = "javascript:opener.worklist_esami(" + iden_anag + ");self.close();";
	
	doc.appendChild(campo_carica_worklist_esami);

	doc.submit();
}

function apri_worklist()
{
	parent.document.location.replace("worklistInizio");
}


function conta_record_trovati()
{
	var risultato_ricerca = document.all.oTable.rows.length;	
	
	//alert('Risultato Ricerca: ' + risultato_ricerca);
	try
	{
		if(risultato_ricerca == 0 && (parent.RicPazRicercaFrame.document.form_pag_ric.COGN.value != '' || parent.RicPazRicercaFrame.document.form_pag_ric.DATA.value != ''))
		{	
		document.write('<html><head></head><body><table id="ricPazTable" class="classDataTable"><tr><td class="bianco"><div class="classRicVuota">Nessun Paziente trovato con i criteri impostati</div></td></tr></table></body></html>');
		}
	}
	catch(e){
	}
}


function finestra_attesa(provenienza)
{
	alert('PROVENIENZA: ' + provenienza);

	try{
		parent.parent.hideFrame.chiudi_attesa();	
	}
	catch(e){
		try{
			parent.parent.parent.hideFrame.chiudi_attesa();	
		}
		catch(e){
		}
	}
	
	var oggetto = document.getElementById("oTable");

	if(oggetto && provenienza != 'prenotazioneOrario')
		oggetto.ondblclick = function(){gestioneAnagrafica('VIS_ESA');};//oggetto.ondblclick = function(){worklist_esami();}
	else
		oggetto.ondblclick = function(){worklist_esami_da_prenotazione();};
}


function worklist_esami(iden_anag)
{
	//alert('worklist_esami: ' + iden_anag);
	var doc = document.form_visualizza_esami;
	
	if(typeof iden_anag != 'undefined' && isNaN(iden_anag))
		if(iden_anag.indexOf('CJsGestioneAnagrafica') != -1)
		{
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + iden_anag);
			return;
		}
	
	if(isNaN(iden_anag))
	{
		iden_anag = stringa_codici(iden);
		if(isNaN(iden_anag))
			iden_anag = iden[0];
	}
	//Non dovrebbe servire
	if(iden_anag == '')
		iden_anag = -100;
	
	doc.iden_anag.value = iden_anag;

	doc.target = 'RicPazWorklistFrame';//RicPazRecordFrame
	doc.action = 'worklist';
	
	doc.tipowk.value = 'WK_ESAMI_PER_UTENTE';

	if(parent.RicPazUtilityFrame)
		doc.namecontextmenu.value = 'worklistRiconciliaSpostaEsami';
	else
		doc.namecontextmenu.value = 'worklistRicPaz';
	
	doc.hidWhere.value = 'where iden_anag = ' + iden_anag;
	
	//alert('TEST: ' + doc.hidWhere.value);

	doc.submit();
}





/*
start GESTIONE IMPORTA PAZIENTE IN ANAG E NOSOLOGICI_PAZIENTE

function GericosInserimentoRichiestaDaRicPazRemote(){
	var id_remoto = null;
	
	tipologiaPagina = 'IR';
	
	id_remoto = stringa_codici(array_id_remoto);
	
	//alert('ID REMOTO: ' + id_remoto);
	
	if(id_remoto == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	importaAnagraficaInLocale(id_remoto);
}

function GericosInserimentoRichiestaDaRicPaz(){
	var id_remoto = null;
	
	tipologiaPagina = 'IR';
	
	id_remoto = stringa_codici(array_id_remoto);
	
	//alert('ID REMOTO: ' + id_remoto);
	
	if(id_remoto == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	scegliReparto();
}

function GericosInserimentoPrenotazioneDaRicPazRemote(){
	var id_remoto = null;
	
	tipologiaPagina = 'IP';
	
	id_remoto = stringa_codici(array_id_remoto);
	
	//alert('ID REMOTO: ' + id_remoto);
	
	if(id_remoto == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	importaAnagraficaInLocale(id_remoto);
}

function GericosInserimentoPrenotazioneDaRicPaz(){
	var id_remoto = null;
	
	tipologiaPagina = 'IP';
	
	id_remoto = stringa_codici(array_id_remoto);
	
	//alert('ID REMOTO: ' + id_remoto);
	
	if(id_remoto == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	scegliReparto();
}
*/


/**
*/
function importaAnagraficaInLocale(id_remoto){
	dwr.engine.setAsync(false);
	CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, scegliReparto);
	dwr.engine.setAsync(true);	
}


/**
*/
function scegliReparto(){
	var param = null;
	
	param = "select cod_dec, reparto from imagoweb.VIEW_CDCATTIVI_UTENTE where webuser = '"+ baseUser.LOGIN + "' order by reparto asc";
	param += '@cod_dec*reparto';//il campo che voglio venga restituito nella finestra di scelta
	param += '@1*4';//il campo è di tipo stringa

	dwr.engine.setAsync(false);
	CJsUpdate.select(param, cbk_scegliReparto);
	dwr.engine.setAsync(true);
}

/**
*/
function cbk_scegliReparto(elencoReparti){
	objRepartiUtente = new Object();
	
	var appo = elencoReparti.split("$");

	objRepartiUtente.cod_dec = appo[0];
	objRepartiUtente.reparti = appo[3];

	//alert(objRepartiUtente.cod_dec);
	//alert(objRepartiUtente.reparti);
	
	winSceltaReparti = window.open('sceltaRepartiUtente.html', 'winSceltaReparti','height=300px,width=900px,top=200px,left=80px,status=no');
}

/**
*/
function salvaRepartoRicovero(codiceRepartoScelto){
	//alert(codiceRepartoScelto);
	//alert(tipologiaPagina);
	
	var id_remoto = stringa_codici(array_id_remoto);
	
	/*if(tipologiaPagina == 'IR')
		apriGericosDaRicPaz(id_remoto, "SL_Inizio?topSource=IR", codiceRepartoScelto);	

	if(tipologiaPagina == 'IP')
		apriGericosDaRicPaz(id_remoto, "SL_Inizio?topSource=IP", codiceRepartoScelto);
	*/
	
	if(tipologiaPagina == 'IRC')
		inserimentoRichiestaCardioDaRicPaz(id_remoto, codiceRepartoScelto);
		
	winSceltaReparti.close();
}

/**

function apriGericosDaRicPaz(iden_anag_remoto, pulsante, repartoRicovero){
	var doc = document.form;
	var win_login_gericos = null;
	var indirizzoGericos = null;
	
	//alert('baseGlobal.URL_GERICOS: ' + baseGlobal.URL_GERICOS);
	indirizzoGericos = baseGlobal.URL_GERICOS;	

	indirizzoGericos += "?pulsante="+pulsante;
	indirizzoGericos += "&utente=" + baseUser.LOGIN;	
	

	indirizzoGericos += "&reparto=" + repartoRicovero;
	indirizzoGericos += "&idPaziente=" + iden_anag_remoto;
	
	//alert('URL: ' + indirizzoGericos);
	
	doc.target = 'wNew';
	doc.method = 'POST';
	doc.action = indirizzoGericos;
	
	win_login_gericos = window.open(indirizzoGericos, 'wNew','width='+width+',height='+height+', status=yes, resizable=yes, scrollbars=yes, resizable=yes, top=0,left=0');
	
	if (win_login_gericos){
		win_login_gericos.focus();
	}
	else{
		win_login_gericos = window.open(indirizzoGericos, 'wNew','width='+width+',height='+height+', status=yes, scrollbars=yes, resizable=yes, top=0,left=0');
	}
	
	doc.submit();
}
*/

function inserimentoRichiestaCardioDaRicPazRemote(){
	var id_remoto = null;
	
	tipologiaPagina = 'IRC';
	
	id_remoto = stringa_codici(array_id_remoto);
	
	//alert('ID REMOTO: ' + id_remoto);
	
	if(id_remoto == ''){
		alert('Attenzione: selezionare un paziente');
		return;
	}
	
	importaAnagraficaInLocale(id_remoto);
}


function inserimentoRichiestaCardioDaRicPaz(idRemotoPaziente, codiceRepartoScelto){
	alert ('passare i parametri');
	
	window.open('servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CARDIO_INT',"","status=yes, fullscreen=yes, scrollbars=yes");
}

function visualizza_referto()
{
	var id_remoto = null;
	
	id_remoto = stringa_codici(array_id_remoto);
	
	if (id_remoto == ''){
		alert('Per il paziente in questione non è presente l\'identificativo remoto');
	}
	
	window.open("header?idPatient="+id_remoto,'','fullscreen=yes');
	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, callbackIden);
		dwr.engine.setAsync(true);
	}	

	function callbackIden(anagIden){
		try{
			if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
				alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
				return;
			}
			
			aggiorna();
		}
		catch(e){
		}
	}
}

/*
end GESTIONE IMPORTA PAZIENTE IN ANAG E NOSOLOGICI_PAZIENTE
*/


//PIANI TERAPEUTICI


function inserimentoPT(){
	var id_remoto = stringa_codici(array_id_remoto);
	var tipo_ricerca = document.form.ricerca_anagrafica.value;

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}
	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, inserimentoPTBck);
		dwr.engine.setAsync(true);
	}	
	else
		inserimentoPTBck();

}

function inserimentoPTBck(anagIden){
var tipo_ricerca = document.form.ricerca_anagrafica.value;
var idRemoto='';
var paramOk=true;
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}

	if(isNaN(anagIden)){
		idRemoto = stringa_codici(array_id_remoto);
	}

	if(anagIden == 0)
	{
    		alert(ritornaJsMsg('selezionare'));
        	return;
    	}

	if(tipo_ricerca == 2){
	var sql='select a.com_res,a.cod_fisc,c.id1 from radsql.anag a join cod_est_anag c on (a.iden=c.iden_anag) where iden='+anagIden;
	sql+='@com_res*cod_fisc*id1@1*1*1';
	dwr.engine.setAsync(false);
	CJsUpdate.select(sql, controllaCampi);
	dwr.engine.setAsync(true);
	
function controllaCampi(ris){
var p = ris.split("$");	
var v =p[0].split("@");
if (v[0]==''){
alert('Inserire il comune di residenza dalla scheda anagrafica del paziente');
paramOk=false;
return;
}
if (v[1]==''){
	alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
paramOk=false;
return;
}	
idRemoto=v[2];
}

if (paramOk==false){
parent.idRicPazRicercaFrame.document.getElementById('Lricerca').click();	
return;
}
	
	}
	else{
	if (stringa_codici(array_com_res)==''){
	alert('Inserire la località dalla scheda anagrafica del paziente');
	return;
	}
	if (stringa_codici(array_cod_fisc)==''){
		alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
		return;
		}
	}
	
	
   var url = 'servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO=INSERIMENTO&idRemoto='+idRemoto +'&utente='+baseUser.LOGIN;
  
   var finestra = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
   try{
   top.parent.closeWhale.pushFinestraInArray(finestra);
   }catch(e){}
}




function inserimentoPTExtraReg(){
	var id_remoto = stringa_codici(array_id_remoto);
	var tipo_ricerca = document.form.ricerca_anagrafica.value;

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}
	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, inserimentoPTExtraRegBck);
		dwr.engine.setAsync(true);
	}	
	else
		inserimentoPTExtraRegBck();

}

function inserimentoPTExtraRegBck(anagIden){
var tipo_ricerca = document.form.ricerca_anagrafica.value;
var idRemoto='';
var paramOk=true;
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}

	if(isNaN(anagIden)){
		idRemoto = stringa_codici(array_id_remoto);
	}

	if(anagIden == 0)
	{
    		alert(ritornaJsMsg('selezionare'));
        	return;
    	}

	if(tipo_ricerca == 2){
		var sql='select a.com_res,a.cod_fisc,c.id1 from radsql.anag a join cod_est_anag c on (a.iden=c.iden_anag) where iden='+anagIden;
		sql+='@com_res*cod_fisc*id1@1*1*1';
		dwr.engine.setAsync(false);
		CJsUpdate.select(sql, controllaCampi);
		dwr.engine.setAsync(true);
		
	function controllaCampi(ris){
	var p = ris.split("$");	
	var v =p[0].split("@");
	if (v[0]==''){
	alert('Inserire il comune di residenza dalla scheda anagrafica del paziente');
	paramOk=false;
	return;
	}
	if (v[1]==''){
		alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
	paramOk=false;
	return;
	}	
	idRemoto=v[2];
	}


if (paramOk==false){
parent.idRicPazRicercaFrame.document.getElementById('Lricerca').click();	
return;
}
	
	}
	else{
	if (stringa_codici(array_com_res)==''){
	alert('Inserire la località dalla scheda anagrafica del paziente');
	return;
	}
	if (stringa_codici(array_cod_fisc)==''){
		alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
		return;
		}
	}
	
	var url = 'servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO=INSERIMENTO_EXTRA_REG&idRemoto='+idRemoto +'&utente='+baseUser.LOGIN;
	try{
		window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
	}catch(e){
		alert(e.description);
	}
}


function visualizzaPT(){
	var id_remoto = stringa_codici(array_id_remoto);
	var tipo_ricerca = document.form.ricerca_anagrafica.value;

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}
	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, visualizzaPTBck);
		dwr.engine.setAsync(true);
	}	
	else
		visualizzaPTBck();

}

function visualizzaPTBck(anagIden){
	
	var tipo_ricerca = document.form.ricerca_anagrafica.value;
	var idRemoto='';
	var paramOk=true;
		try{
			if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
				alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
				return;
			}
		}
		catch(e){
		}
		if(isNaN(anagIden)){
			idRemoto = stringa_codici(array_id_remoto);
		}

		if(anagIden == 0)
		{
	    		alert(ritornaJsMsg('selezionare'));
	        	return;
	    	}

		if(tipo_ricerca == 2){
			var sql='select a.com_res,a.cod_fisc,c.id1 from radsql.anag a join cod_est_anag c on (a.iden=c.iden_anag) where iden='+anagIden;
			sql+='@com_res*cod_fisc*id1@1*1*1';
			dwr.engine.setAsync(false);
			CJsUpdate.select(sql, controllaCampi);
			dwr.engine.setAsync(true);
			
		function controllaCampi(ris){
		var p = ris.split("$");	
		var v =p[0].split("@");
		if (v[0]==''){
		alert('Inserire il comune di residenza dalla scheda anagrafica del paziente');
		paramOk=false;
		return;
		}
		if (v[1]==''){
			alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
		paramOk=false;
		return;
		}	
		idRemoto=v[2];
		}
	if (paramOk==false){
	parent.idRicPazRicercaFrame.document.getElementById('Lricerca').click();	
	return;
	}
		
		}
		else{
		if (stringa_codici(array_com_res)==''){
		alert('Inserire la località dalla scheda anagrafica del paziente');
		return;
		}
		if (stringa_codici(array_cod_fisc)==''){
			alert('Inserire il codice fiscale dalla scheda anagrafica del paziente');
			return;
			}
		}
		
	
	var url = 'servletGenerator?KEY_LEGAME=GESTIONE_PIANI_TERAPEUTICI&TIPO=VISUALIZZA&idRemoto='+idRemoto +'&utente='+baseUser.LOGIN+'&codfisc='+stringa_codici(array_cod_fisc);
	var finestra = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
	try{
		top.closeWhale.pushFinestraInArray(finestra);
	   	}catch(e){}
	
}
//FINE PIANI TERAPEUTI

/*inizio RICETTA ROSSA*/

/**
	Funzione richiamata dalla ricerca pazienti menù Inserimento Ricetta Rossa Prestazioni
*/
function inserimentoRicettaRossa(){
	var id_remoto = stringa_codici(array_id_remoto);
	var tipo_ricerca = document.form.ricerca_anagrafica.value;

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}

	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, inserimentoRicettaRossaBck);
		dwr.engine.setAsync(true);
	}	
	else
		inserimentoRicettaRossaBck();
}

function inserimentoRicettaRossaBck(anagIden){
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}
	catch(e){
	}

	if(isNaN(anagIden)){
		anagIden = stringa_codici(array_id_remoto);
	}

	if(anagIden == 0)
	{
		alert(ritornaJsMsg('selezionare'));
		return;
	}

	anagIden = stringa_codici(array_id_remoto);
	if (stringa_codici(array_com_res)==''){
		alert('Inserire la località dalla scheda anagrafica del paziente');
		return;
	}
	
	var param = [
	    "KEY_LEGAME=RICETTA_PRESTAZIONI",
	    "idRemoto="+anagIden,
	    "utente="+baseUser.LOGIN
	];
	
	var url = "servletGenerator?"+param.join("&");
	
	var finestra = window.open(url,"WHALE_winRicettaRossa","status=yes, fullscreen=yes, scrollbars=yes");
	try{
		finestra.focus();
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}
}




/**
	Funzione richiamata dalla ricerca pazienti menù Inserimento Ricetta Rossa Farmaci
*/
function inserimentoRicettaRossaFarmaci(){
    var id_remoto = stringa_codici(array_id_remoto);
    var tipo_ricerca = document.form.ricerca_anagrafica.value;

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}
	
	if(tipo_ricerca == 2){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(id_remoto, inserimentoRicettaRossaFarmaciBck);
		dwr.engine.setAsync(true);
	}	
	else
		inserimentoRicettaRossaFarmaciBck();
}


function inserimentoRicettaRossaFarmaciBck(anagIden){
	try{
		if(anagIden.indexOf('CJsGestioneAnagrafica') != -1){
			alert('ATTENZIONE: si è verificato il seguente problema nella RICERCA REMOTA:\n' + anagIden);
			return;
		}
	}catch(e){}

	if(isNaN(anagIden)){
		anagIden = stringa_codici(array_id_remoto);
	}

	if(anagIden == 0){
		alert(ritornaJsMsg('selezionare'));
		return;
	}

	anagIden = stringa_codici(array_id_remoto);
	
	if (stringa_codici(array_com_res)==''){
		alert('Inserire la località dalla scheda anagrafica del paziente');
		parent.idRicPazRicercaFrame.document.getElementById('Lricerca').click();
		return;
	}
	
	var param = [
	    "KEY_LEGAME=RICETTA_FARMACI",
	    "idRemoto="+anagIden,
	    "utente="+baseUser.LOGIN
	];
	
	var url = "servletGenerator?"+param.join("&");
	
	var finestra = window.open(url,"WHALE_winRicettaRossa","status=yes, fullscreen=yes, scrollbars=yes");
	try{
		finestra.focus();
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}
}


function visualizzaWkRicettePaziente(){
	var id_remoto = stringa_codici(array_id_remoto);

	if(id_remoto == ''){
		alert('Attenzione:effettuare una selezione');
		return;
	}

	var param = [
	    "KEY_LEGAME=RICETTA_WORKLIST_CONFERMATE",
	    "idRemoto="+id_remoto
    ];
	
	var url = "servletGenerator?"+param.join("&");
	//url = 'servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CONFERMATE&idRemoto='+id_remoto+'&WHERE_WK=where STATO=\'C\' AND ID_REMOTO=\''+id_remoto+'\''; //&utente='+baseUser.LOGIN;
	//url = 'servletGenerator?KEY_LEGAME=RICETTA_WORKLIST_CREATE&idRemoto='+id_remoto+'&WHERE_WK=where STATO=\'C\' AND ID_REMOTO=\''+id_remoto+'\''; //&utente='+baseUser.LOGIN;

	var finestra = window.open(url,"WHALE_winRicettaRossa","status=yes, fullscreen=yes, scrollbars=yes");
	try{
		finestra.focus();
		top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){}    
}


function gestioneProfili(){
	var url = '';
    var id_remoto = stringa_codici(array_id_remoto);
   
    if(id_remoto == ''){
        alert('Attenzione:effettuare una selezione');
        return;
    }
   
    url = 'servletGenerator?KEY_LEGAME=CONFIGURAZIONE_PROFILI_RICETTA&idRemoto='+id_remoto+'&INSERIMENTO=S';//&utente='+baseUser.LOGIN;
    var finestra = window.open(url,"","status=yes, fullscreen=yes, scrollbars=yes");
    try{
    	top.closeWhale.pushFinestraInArray(finestra);
    }catch(e){}
}
/*fine RICETTA ROSSA*/


function inserimentoPrericovero(){
	var iden_anag = stringa_codici(iden);
	var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_ACCESSO&IDEN_ANAG="+iden_anag;
	url+="&TIPO=INSERIMENTO";
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 300,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function aggiorna(){	
	var doc = document.frmAggiorna;
	
//	doc.action = 'SL_RicPazRicoverati';
	//doc.target = 'RicPazWorklistFrame';
//	doc.method = 'POST';

	doc.tipo_wk.value = document.form.tipo_wk.value;
	doc.nome_vista.value = document.form.nome_vista.value;	
	doc.provenienza.value = document.form.provenienza.value;
	doc.hidWhere.value = document.form.hidWhere.value;
	doc.hidOrder.value = document.form.hidOrder.value;	
	
	doc.submit();
}