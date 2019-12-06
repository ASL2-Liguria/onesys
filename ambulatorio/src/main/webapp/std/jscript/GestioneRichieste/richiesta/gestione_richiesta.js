function chiudi()
{
	opener.aggiorna();
	self.close();
}

/*Function richiamata dalla finestra di scelta Esami (omino)*/
function aggiorna()
{
	
}

function registra()
{
	var doc = document.form;

	doc.iden_tab_allerte.value = '';
	doc.iden_tab_controind.value = '';
	
	for(i = 0; i < doc.allerta.length; i++)
	{
		doc.iden_tab_allerte.value += doc.allerta[i].value + ','; 
	}
	try{
		doc.iden_tab_allerte.value = doc.iden_tab_allerte.value.substring(0, doc.iden_tab_allerte.value.length-1);
	}
	catch(e){
	}
	
	for(i = 0; i < doc.controindicazione.length; i++)
	{
		doc.iden_tab_controind.value += doc.controindicazione[i].value + ','; 
	}
	try{
		doc.iden_tab_controind.value = doc.iden_tab_controind.value.substring(0, doc.iden_tab_controind.value.length-1);
	}
	catch(e){
	}
	
	
	//alert('METODICHE: ' + doc.Hmetodica.value);
	//alert('IDEN_ESA: ' + doc.Hiden_esa.value);
	//alert('DESCR ESA: ' + doc.prestazioni.text);
	//alert('OPERAZIONE: ' + doc.operazione.value);
	//alert('ALLERTE: ' + doc.iden_tab_allerte.value);
	//alert('CONTROINDICAZIONI: ' + doc.iden_tab_controind.value);
	var mancano = '';
	if(doc.Hiden_esa.value == '' || doc.cdc.value == '' || doc.num_nosologico.value == '')
	{
		if(doc.num_nosologico.value == '')
			mancano += '- NUMERO NOSOLOGICO \n';
		
		if(doc.Hiden_esa.value == '')
			mancano += '- PRESTAZIONI \n';
		
		if(doc.cdc.value == '')
			mancano += '- CENTRO DI COSTO';		
			
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	/*Controllo del numero nosologico*/
	if(doc.num_nosologico.value != doc.num_nosologico_old.value)
		doc.inserisci_nosologico.value = 'S';
	else
		doc.inserisci_nosologico.value = 'N';
		
	
	if(doc.autorizza_mdc.checked)
		doc.hautorizza_mdc.value = 'S';
	else
		doc.hautorizza_mdc.value = 'N';
		
	if(doc.dichiara_controind.checked)	
		doc.hdichiara_controind.value = 'S';
	else
		doc.hdichiara_controind.value = 'N';
	
	
	
	doc.registrazione.value = 'true';
	
	
	doc.action = 'SL_VisualizzaRichiesta';
	doc.target = '_self';
	doc.method = 'POST';
	
	doc.submit();
	
	carica_wk_richieste();
}

/*
Caricamento della worklist delle richieste con i seguenti campi valorizzati:
nome, cognome e data di nascita.
*/
function carica_wk_richieste()
{
	var doc = document.form;
	var window_opener = opener.name;
	
	if(window_opener == 'RicPazWorklistFrame')//RicPazRecordFrame
	{
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = doc.cogn.value;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = doc.nome.value;
		opener.parent.opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = doc.data_paz.value;
		
		opener.parent.opener.parent.worklistTopFrame.ricerca();
		opener.parent.close();
		self.close();
	}
	
	if(window_opener == 'worklistMainFrame')
	{
		opener.parent.worklistTopFrame.document.form_ric_richieste.cognome.value = doc.cogn.value;
		opener.parent.worklistTopFrame.document.form_ric_richieste.nome.value = doc.nome.value;
		opener.parent.worklistTopFrame.document.form_ric_richieste.txtDataNascita.value = doc.data_paz.value;
		opener.parent.worklistTopFrame.ricerca();
		
		self.close();
	}
}



function apri_scan_db(procedura, campo)
{
	var read_only 		= document.form.readonly.value;
	if(read_only == 'false')
	{
		var doc 			= document.form_scandb;
		doc.target 			= 'GRwinScanDb';
		doc.action 			= 'scanDB';
		doc.method		    = 'POST';
		doc.myric.value 	= campo;
		doc.myproc.value 	= procedura;
		doc.mywhere.value 	= '';
	
		var finestra = window.open('','GRwinScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
		
		doc.submit();
	}
}

function apri_omino()
{
	var read_only 		= document.form.readonly.value;
	if(read_only == 'false')
	{
		var servlet = 'sceltaEsami?next_servlet=javascript:prestazioni_richiedibili();&Ha_sel_iden='+document.form.Hiden_esa.value;
		var finestra = window.open(servlet,'GRwinOmino','resizable = yes, status=yes');
	}
}



function setta_urgenza(urg)
{
	if(urg == '')
		urg = '0';
		
	document.form.hurgenza.value = urg;
	switch(urg)
		{
			// Non urgente
			case '0':
				document.all.t_grado_urgenza.innerText = 'Grado Urgenza: ' + 'Non Urgenza';//document.all.nu.innerText;
				break;
			
			// Urgenza differita
			case '1':
				document.all.t_grado_urgenza.innerText = 'Grado Urgenza: ' + 'Urgenza differita';//+ document.all.ud.innerText;
				break;
			
			// Urgenza
			case '2':
				document.all.t_grado_urgenza.innerText = 'Grado Urgenza: ' +  'Urgenza';//document.all.u.innerText;
				break;
			
			// Emergenza
			case '3':
				document.all.t_grado_urgenza.innerText = 'Grado Urgenza: ' + 'Emergenza';//+ document.all.e.innerText;
				break;
		}
	
	return;
}

/*Gestione associazione cdc alla richista*/
function associaCdcRichiesta()
{
	var read_only 		= document.form.readonly.value;
	if(read_only == 'false')
	{
		var doc = document.form;
		doc.action = 'SL_AssociaCdcRich';
		doc.target = 'GRwinSceltaCDC';
		doc.method = 'POST';
		var finestra = window.open('','GRwinSceltaCDC','width=500,height=600, resizable = yes, status=yes, top=10,left=10');
		
		doc.submit();
	}
}


function apri_scelta(tabella, label_titolo, campo)
{
	var read_only 		= document.form.readonly.value;
	if(read_only == 'false')
	{
		var doc = document.form_scelta;
		
		doc.action = 'SL_Scelta';
		doc.target = 'GRwinScelta';
		
		doc.table.value 				= tabella;
		doc.ltitle.value 				= label_titolo;
		
		//alert('METODICA: ' + document.form.Hmetodica.value);
		
		if(tabella == 'TAB_CONTROIND')
		{
			var metodica = '';
			var controind = '';
			
			var a = document.form.Hmetodica.value.indexOf(",");
			if(a != -1)	
				metodica  = "'" + document.form.Hmetodica.value.replace(/,/g, "','") + "'";
			else
				metodica = "'" + document.form.Hmetodica.value + "'";
			
			if(document.form.controindicazione.length == 0)
			{
				controind = "-1";
			}
			else
			{
				for(i = 0; i < document.form.controindicazione.length; i++)
				{
					if(document.form.controindicazione.length-1 == i)
						controind += document.form.controindicazione[i].value;
					else
						controind += document.form.controindicazione[i].value + ',';
				}
			}
			
			doc.where_condition_sx.value = " metodica in ("+ metodica +") and iden not in ("+ controind +") and deleted = 'N'";
			doc.where_condition_dx.value = " metodica in ("+ metodica +") and iden in ("+ controind +") and deleted = 'N'";
		}
		//alert('COMBO SX: ' + doc.where_condition_sx.value);
		//alert('COMBO DX: ' + doc.where_condition_dx.value);
	
		if(tabella == 'TAB_ALLERTE')
		{
			if(document.form.allerta.length == 0)
			{
				/*tutti da scegliere*/
				doc.where_condition_sx.value 	= " deleted = 'N'";
				/*nessuno*/
				doc.where_condition_dx.value 	= " iden in (-1)";
			}
			else
			{
				var allerta = '';
				
				for(i = 0; i < document.form.allerta.length; i++)
				{
					if(document.form.allerta.length-1 == i)
						allerta += document.form.allerta[i].value;
					else
						allerta += document.form.allerta[i].value + ',';
				}
				
				doc.where_condition_sx.value 	= " iden not in ("+ allerta + ") and deleted = 'N'";
				doc.where_condition_dx.value 	= " iden in ("+ allerta + ") and deleted = 'N'";
			}
		}
		
		doc.campo.value	= campo;
		
		window.open('','GRwinScelta','width=500,height=600, resizable = yes, status=yes, top=10,left=10');
		
		doc.submit();
	}
}

function invia()
{
	if(document.form.cdc.value == '')
	{
		alert(ritornaJsMsg("alert_cdc"));
		return;
	}
	opener.document.form.cdc.value = document.form.cdc.value;
	self.close();
}