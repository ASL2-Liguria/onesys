function cambioCheck(chkObj)
{
	if(event.ctrlKey == false)
	{
		getSeldesel(false);
		chkObj.checked = true;
	}
	else
	{
		if(chkObj.checked)
		{
			chkObj.checked = true;
		}
		else
		{
			chkObj.checked = false;
		}
	}
}

/*function cambioCheck(chkObj)
{
	if(event.ctrlKey != true)
	{
		getSeldesel(false);
		chkObj.checked = true;
	}
	else
		chkObj.checked = true;
}*/

		
function getSeldesel(check)
{
	for(i=0 ; i<document.frmDati.elements.length ; i++)
	document.frmDati.elements[i].checked = check;
}
		
/*
	Funzione associata al pulsante 'Applica' che gestisce l'associazione dei cdc nella sezione dei FILTRI della worklist
*/		
function applica_worklist_esami()
{
	var cdc = '';
	var count = 0;
	var cdc_title = '';
	for(T=0 ; T<document.frmDati.elements.length ; T++)
	{
		chkObj=document.frmDati.elements[T];
		inputName=chkObj.name;
		if(inputName.length > 6 && inputName.substr(0, 6)=='chkCDC' && chkObj.checked)
		{
			if(cdc.length>0){
				cdc+=',';
				cdc_title += ',';
			}
			cdc += "'"+chkObj.value+"'";
			cdc_title += chkObj.value;
			count++;
		}
	}
	if(cdc == ''){
		cdc = '-1';
		alert(ritornaJsMsg('MSG_INSERT_CDC_OBBL'));
		return;
	}

	opener.document.all.td_cdc_label.title = cdc_title;
	opener.document.all.td_cdc.title = cdc_title;

	var label_cdc = cdc_title;
	if(cdc_title.length > 25)
		label_cdc = cdc_title.substring(0,25) + '...';
	opener.document.all.td_cdc.innerText = label_cdc;//'N° CDC sel.: ' + count;

	/*Aggiornamento CDC nella tabella FILTRI where FILTRI.tipo = 2*/
	document.frmDati.action = 'SL_GestFiltroCDC';
	document.frmDati.update_cdc.value = 'true';
	document.frmDati.cdc.value = cdc;
	document.frmDati.nome_funzione_applica.value = 'applica_worklist_esami()';
	document.frmDati.nome_funzione_chiudi.value = 'chiudi()';
	document.frmDati.submit();
	/*Aggiorno il frame dei filtri attraverso un frame nascosto*/
	opener.refresh_filtri(cdc);
	
    self.close();
}
/*
	Funzione associata al pulsante 'Applica' che gestisce l'associazione dei cdc nella Gestione delle Richieste
*/
function applica_richieste()
{
	var cdc = '';
	var count = 0;
	var cdc_title = '';
	for(T=0 ; T<document.frmDati.elements.length ; T++)
	{
		chkObj=document.frmDati.elements[T];
		inputName=chkObj.name;
		if(inputName.length > 6 && inputName.substr(0, 6)=='chkCDC' && chkObj.checked)
		{
			if(cdc.length>0){
				cdc+=',';
				cdc_title += ',';
			}
			cdc += "'"+chkObj.value+"'";
			cdc_title += chkObj.value;
			count++;
		}
	}
	if(cdc == ''){
		cdc = '-1';
		alert(ritornaJsMsg('MSG_INSERT_CDC_OBBL'));
		return;
	}

	opener.document.all.td_cdc.title = cdc_title;
	opener.document.all.td_cdc_label.title = cdc_title;

	var label_cdc = cdc_title;
	if(cdc_title.length > 25)
		label_cdc = cdc_title.substring(0,25) + '...';
	opener.document.all.td_cdc.innerText = label_cdc;//'N° CDC sel.: ' + count;

	opener.document.all.cdc.value = cdc;
	
	/*Aggiornamento CDC nella tabella FILTRI where FILTRI.tipo = 2*/
	document.frmDati.action = 'SL_GestFiltroCDC';
	document.frmDati.update_cdc.value = 'true';
	document.frmDati.cdc.value = cdc;
	document.frmDati.nome_funzione_applica.value = 'applica_richieste()';
	document.frmDati.nome_funzione_chiudi.value = 'chiudi()';
	document.frmDati.submit();
	
	/*Funzione contenuta in /GestioneRichieste/gesRichieste.js*/
	opener.ass_reparto_prov_cdc(cdc);

    self.close();
}

/*
	Funzione di chiusura della finestra di scelta dei centri di costo richiamata dai filtri 
	e dalla gestione delle richieste
*/
function chiudi()
{
	self.close();
}

/*
	Funzioni associata al pulsante 'Applica' per la gestione dell'associazione dei centri di costo all'utente loggato
	richiamata dal top menù CDC
*/
function applica()
{
	var cdc = '';
	var count = 0;
	var cdc_title = '';
	for(T=0 ; T<document.frmDati.elements.length ; T++)
	{
		chkObj=document.frmDati.elements[T];
		inputName=chkObj.name;
		if(inputName.length > 6 && inputName.substr(0, 6)=='chkCDC' && chkObj.checked)
		{
			if(cdc.length>0){
				cdc+=',';
				cdc_title += ',';
			}
			cdc += "'"+chkObj.value+"'";
			cdc_title += chkObj.value;
			count++;
		}
	}
	if(cdc == '')
	{
		cdc = '-1';
		alert(ritornaJsMsg('MSG_INSERT_CDC_OBBL'));
		return;
	}
	
	/*Aggiornamento CDC nella tabella FILTRI where FILTRI.tipo = 2*/
	document.frmDati.action = 'SL_GestFiltroCDC';
	document.frmDati.update_cdc.value = 'true';
	document.frmDati.cdc.value = cdc;
	document.frmDati.nome_funzione_applica.value = 'applica()';
	document.frmDati.nome_funzione_chiudi.value = 'chiudi_cdc()';
	document.frmDati.submit();
	
	
    self.close();
}
/*
	Funzione associata al pulsante 'Chiudi' della finestra di scelta dei cdc richiamata dal link 'CDC' 
	collocato nella barra del top menù
*/
function chiudi_cdc(){
	top.parent.mainFrame.workFrame.document.location.replace("worklistInizio");
}


/*
	Funzione associata al pulsante 'Applica' che gestisce l'associazione dei cdc nella sezione dei FILTRI della 
	worklist della MEDICINA NUCLEARE
	
function applica_wk_mn()
{
	var cdc = '';
	var count = 0;
	var cdc_title = '';
	for(T=0 ; T<document.frmDati.elements.length ; T++)
	{
		chkObj=document.frmDati.elements[T];
		inputName=chkObj.name;
		if(inputName.length > 6 && inputName.substr(0, 6)=='chkCDC' && chkObj.checked)
		{
			if(cdc.length>0){
				cdc+=',';
				cdc_title += ',';
			}
			cdc += "'"+chkObj.value+"'";
			cdc_title += chkObj.value;
			count++;
		}
	}
	if(cdc == ''){
		cdc = '-1';
		alert(ritornaJsMsg('MSG_INSERT_CDC_OBBL'));
		return;
	}

	opener.document.all.td_cdc_label.title = cdc_title;
	opener.document.all.td_cdc.title = cdc_title;

	var label_cdc = cdc_title;
	if(cdc_title.length > 25)
		label_cdc = cdc_title.substring(0,25) + '...';
	opener.document.all.td_cdc.innerText = label_cdc;//'N° CDC sel.: ' + count;

	//Aggiornamento CDC nella tabella FILTRI where FILTRI.tipo = 200
	document.frmDati.action = 'SL_GestFiltroCDC';
	document.frmDati.update_cdc.value = 'medicina_nucleare';
	document.frmDati.cdc.value = cdc;

	
	document.frmDati.nome_funzione_applica.value = 'applica_wk_mn()';
	document.frmDati.nome_funzione_chiudi.value = 'chiudi()';
	
	document.frmDati.submit();
	
    self.close();
}
*/	

/*
	Funzione associata al pulsante 'Applica' che gestisce l'associazione dei cdc nella sezione dei FILTRI della 
	worklist dei RICOVERATI
*/	
function applica_wk_ricoverati(){
	var doc = document.frmDati;
	var cdc = '';
	var count = 0;
	var cdc_title = '';
	var posizioneCDC = '';
	var COD_DECcdc = '';
	var HchkObj = '';
	
	for(T=0 ; T < doc.elements.length ; T++)
	{
		chkObj = doc.elements[T];
		inputName = chkObj.name;
		if(inputName.length > 6 && inputName.substr(0, 6)=='chkCDC' && chkObj.checked)
		{
			posizioneCDC = inputName.substr(6, 7);
			//alert(posizioneCDC);
			HchkObj = doc.elements[T-1];
			//alert(HchkObj.name);
			
			if(cdc.length > 0){
				cdc += ',';
				COD_DECcdc += ',';
				cdc_title += ',';
			}
			
			cdc += "'" + chkObj.value + "'";
			COD_DECcdc += "'" + HchkObj.value + "'";
			cdc_title += chkObj.value;
			count++;
		}
	}
	if(cdc == ''){
		cdc = '-1';
		alert(ritornaJsMsg('MSG_INSERT_CDC_OBBL'));
		return;
	}

	//alert('CDC ' + cdc);
	//alert('COD_DEC ' + COD_DECcdc);
	
	opener.document.all.td_cdc.title = cdc_title;	
	opener.document.all.TXThcdc.value = COD_DECcdc;	
	opener.document.form_pag_ric.hcdc.value = cdc;	

	var label_cdc = cdc_title;
	if(cdc_title.length > 25)
		label_cdc = cdc_title.substring(0,25) + '...';

	//opener.document.all.td_cdc.innerText = label_cdc;//'N° CDC sel.: ' + count;
	
	opener.document.all.lreparti.innerText = label_cdc;


	/*Aggiornamento CDC nella tabella FILTRI where FILTRI.tipo = 200*/
	doc.action = 'SL_GestFiltroCDC';
	doc.update_cdc.value = 'ricoverati';
	doc.cdc.value = cdc;

	doc.nome_funzione_applica.value = 'applica_wk_ricoverati()';
	doc.nome_funzione_chiudi.value = 'chiudi()';
	
	doc.submit();
	
    self.close();
}



