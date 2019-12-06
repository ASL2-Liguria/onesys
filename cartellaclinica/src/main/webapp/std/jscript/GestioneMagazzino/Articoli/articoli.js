function chiudi(pagina_da_vis)
{
	var pagina = 1;
	if(pagina_da_vis != 1)
		pagina = opener.document.form_ric_maga.pagina_da_vis.value;
		
	opener.parent.RicercaMagazzinoFrame.ricerca(pagina);
	self.close();
}

function chiudi_ins_mod()
{
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.descr_art.value = document.form_mg_art.descr.value;
	opener.parent.RicercaMagazzinoFrame.document.form_ric_maga.cod_bar.value = document.form_mg_art.cod_bar.value;
	chiudi(1);
}

            
function registra()
{
	var mancano = '';
	var doc = document.form_mg_art;
	
	if(doc.cod_art.value == '' || doc.descr.value == '' || (doc.costo_std_unitario.value == '' || doc.costo_std_unitario.value == 0.0))
	{
		if(doc.cod_art.value == '')
		{
			mancano = '- CODICE\n';
		}
		if(doc.descr.value == '')
		{
			mancano += '- DESCRIZIONE\n';
		}
		if(doc.costo_std_unitario.value == '' || doc.costo_std_unitario.value == 0.0)
		{
			mancano += '- COSTO STANDARD UNITARIO\n';
		}
		
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
			
	doc.nome_campi.value = 'cod_art*descr*cod_bar*codice_categoria*cod_gara*descr_gara*un_mis*mdc_sino*conto_dep*nuclide*forma_chimica*stato_fisico*data_taratura*tracciante*costo_std_unitario*emivita';
	doc.request.value = 'cod_art*descr*cod_bar*codice_categoria*cod_gara*descr_gara*un_mis*hmdc_sino*hconto_dep*nuclide*forma_chimica*stato_fisico*txtDaData*htracciante*costo_std_unitario*emivita';
 	doc.tipo_campo_db.value = 'S*S*S*S*S*S*S*S*S*S*S*S*S*S*D*D';
            
	if(doc.conto_dep.checked == 1)
		doc.hconto_dep.value = 'S';
	else
		doc.hconto_dep.value = 'N';
            
	if(doc.mdc_sino.checked == 1)
		doc.hmdc_sino.value = 'S';
	else
		doc.hmdc_sino.value = 'N';
		
	if(doc.tracciante.checked == 1)
		doc.htracciante.value = 'S';
	else
		doc.htracciante.value = 'N';	
		
		
	var dataTaratura = doc.txtDaData.value;
	if(dataTaratura != '')
	 doc.txtDaData.value = dataTaratura.substring(6,10)+dataTaratura.substring(3,5)+dataTaratura.substring(0,2);	
	
	doc.submit();
	
	alert(ritornaJsMsg('registrazione'));//Registrazione effettuata
	
	chiudi_ins_mod();
	CJsCheck = null;
}
 

function controlla_cod_art()
{
	CJsCheck.esistenzaCodice("cod_art@mg_art@cod_art = '" + document.form_mg_art.cod_art.value.toUpperCase() + "'", cbkCodice);			
}

/*
	0: record inesistente
	1: record esistente
	errore
*/
function cbkCodice(message)
{
	if(message == '1')
	{
		alert(ritornaJsMsg('record_esistente'));//Il codice articolo è già presente nel db.Prego, modificare il campo
		document.form_mg_art.cod_art.value = '';
		document.form_mg_art.cod_art.focus();
		return;
	}
	else
		if(message != '0')
			{
				alert(message);//errore
				document.form_mg_art.cod_art.value = '';
				return;
			}
	//CJsCheck = null;		
}

function statoFisico(stato)
{
	switch(stato)
	{
		case 0: document.form_mg_art.scelta_stato_fisico[0].value = 'L';
			    document.form_mg_art.stato_fisico.value = 'LIQUIDO';
		        break;
		case 1: document.form_mg_art.scelta_stato_fisico[1].value = 'S';
		        document.form_mg_art.stato_fisico.value = 'SOLIDO';
		        break;
		case 2: document.form_mg_art.scelta_stato_fisico[2].value = 'C';
		        document.form_mg_art.stato_fisico.value = 'CAPSULE';
		        break;
		case 3: document.form_mg_art.scelta_stato_fisico[3].value = 'A';
				document.form_mg_art.stato_fisico.value = '';
		   		document.form_mg_art.stato_fisico.focus();
		   		break;
	}
	
	document.form_mg_art.stato_fisico.value = document.form_mg_art.stato_fisico.value.toUpperCase();
}



function femivita(){
	var doc = document.form_mg_art;
	
	if(isNaN(doc.emivita.value)){
		alert(ritornaJsMsg('alert_number'));
		doc.emivita.focus();
	}
}

function fcosto_std_unitario(){
	var doc = document.form_mg_art;
	
	if(isNaN(doc.costo_std_unitario.value)) {
		alert(ritornaJsMsg('alert_number')); 
		doc.costo_std_unitario.focus();
	}
}