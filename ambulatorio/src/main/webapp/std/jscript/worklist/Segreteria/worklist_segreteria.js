function worklist_esami_paziente(iden_anag)
{
	//alert('IDEN_ANAG ' + iden_anag);

	document.form_wkl_segr.iden_anag.value = iden_anag;

	document.form_wkl_segr.target = 'RicPazWorklistFrame';//RicPazRecordFrame
	document.form_wkl_segr.action = 'worklist';	
	document.form_wkl_segr.namecontextmenu.value = 'worklistRicPaz';
	
	/**/
	
	var campo_sorgente = document.createElement("input");
	campo_sorgente.type = 'hidden';
	campo_sorgente.name = 'sorgente';
	campo_sorgente.value = 'ANAGRAFICA';
	
	document.form_wkl_segr.appendChild(campo_sorgente);
	
	var campo_tipo_wk = document.createElement("input");
	campo_tipo_wk.type = 'hidden';
	campo_tipo_wk.name = 'tipowk';
	campo_tipo_wk.value = 'WK_AMB_ESAMI_PER_UTENTE';
	
	document.form_wkl_segr.appendChild(campo_tipo_wk);
	
	
	/**/
	
	document.form_wkl_segr.hidWhere.value = 'where iden_anag = ' + iden_anag;
	
	document.form_wkl_segr.submit();
}

/*function chiudi()
{
	try
	{
    	if(parent.worklistTopFrame.document.form_worklist.numacc)
			//Ricerca Esame per num accettazione		
			parent.worklistTopFrame.applica('', 'numacc');
		else
			//worklist esami sotto i filtri
			parent.worklistTopFrame.applica();
	}
	catch(e)
	{
		try
		{
			//Ricerca Esame per id esame
			parent.worklistTopFrame.applica('', 'id_esame_dicom');
		}
		catch(e)
			{
				//Dalla Ricerca Del Paziente
				var idenAnag = document.form_wkl_segr.iden_anag.value.split('*');
				//alert('IDEN_ANAG: ' + idenAnag);
				worklist_esami_paziente(idenAnag[0]);
			}
	}
}*/



function chiudi()
{
	try
	{
		/*Ricerca Esame per num accettazione*/
    	if(parent.worklistTopFrame.document.form_worklist.numacc)	
			parent.worklistTopFrame.applica('', 'numacc');
		else
		    /*Ricerca Esame per id esame*/
			if(parent.worklistTopFrame.document.form_worklist.id_esame_dicom)	
				parent.worklistTopFrame.applica('', 'id_esame_dicom');
			else
				/*Ricerca Esame per cognome, nome e data nascita*/
				if(parent.worklistTopFrame.document.form_worklist.cognome)	
					parent.worklistTopFrame.applica('', 'cognome');
				else
					/*worklist esami sotto i filtri*/
					parent.worklistTopFrame.applica();
	}
	catch(e)
	{
		/*Dalla Ricerca Del Paziente*/
		var idenAnag = document.form_wkl_segr.iden_anag.value.split('*');
		worklist_esami_paziente(idenAnag[0]);
	}
}



/*
	Funzione richiamata dal link delle worklist della segreteria per 
	visionare le schede di Archiviazione, Visione o Consegna
*/
function visualizza_segr(riga, operazione_segreteria)
{
	var iden_segr = '';
	
	if (riga.toString()=="")
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}

	iden_segr = iden_worklist[riga];
	document.form_vis_segr.iden_segr.value = iden_segr;
	
	document.form_vis_segr.elenco_iden_segreteria.value = iden_worklist;
	
	document.form_vis_segr.operazione_segreteria.value = operazione_segreteria;

	var finestra = window.open("","winVisSegr","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	if (finestra)
	{
		finestra.focus();
	}
	else
	{
		finestra = window.open("","winVisSegr","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
	}
	document.form_vis_segr.submit();
}

/*
	Funzione richiamata dalla worklist dello storico della Segreteria mediante 
	il menù di contesto.
	Posso annullare un esame alla volta.
*/
function annulla()
{
	var iden_anag = document.form_wkl_segr.iden_anag.value;

	if(stringa_codici(iden_stato) == 'ANNULLATO')
	{
		alert(ritornaJsMsg("gia_annullato"));
		return;
	}
	
	var iden_segr =	stringa_codici(iden_worklist);
	if (iden_segr == '')
	{
		alert(ritornaJsMsg("selezionare"));
		return;
	}
	else
	{
		/*Controllo se il paziente è READONLY*/
		if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
		{
			alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
			return;		
		}
		/**/
		
		var nome_tabella = document.form_update.nome_tabella.value;
		//alert(iden_anag);
		dwr.engine.setAsync(false);
		CJsSegreteria.annullamento(nome_tabella + '@' + iden_segr + '@' + iden_anag, cbkSegreteria);
		dwr.engine.setAsync(true);
	}
}

function cbkSegreteria(message)
{
	if(message.split('@')[0] != '')
	{
		alert(message.split('@')[0]);
		return;
	}

	document.form_vis_wk.iden_anag.value = message.split('@')[1];

	document.form_vis_wk.iden_segreteria.value = iden_worklist;
	document.form_vis_wk.action = 'SL_WorklistSegreteria';
	//document.form_vis_wk.target = 'worklistMainFrame';

	document.form_vis_wk.submit();
}

