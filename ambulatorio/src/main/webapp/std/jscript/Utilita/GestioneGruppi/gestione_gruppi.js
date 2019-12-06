/*function controlla_univ_cod_dec()
{
	var doc = document.form_check_cod_dec;
	if(doc.cod_dec.value != ''){
		doc.campoPk.value = 'cod_dec';
		doc.nome_form.value = 'frmInsModGroup';
		doc.nome_servlet.value = 'SL_InsModGroup';
		doc.campi_select.value = 'iden, deleted';
		doc.table.value = 'gruppi';
		doc.tipo_connessione.value = 'webConnection';
	
		doc.value = document.frmInsModGroup.cod_dec.value;
		
		var win_check = window.open('', 'checkCodDec', 'status=yes, top=100000, left = 10');
		
		document.form_check_cod_dec.submit();
	}
}*/

/*GESTIONE DWR(Direct Web Remoting)*/

function ckeckPrimaryKey()
{
	if(document.frmInsModGroup.cod_dec.value != '')
	{
		dwr.engine.setAsync(false);
		CJsCheckPrimaryKey.check_primary_key("gruppi@cod_dec='"+document.frmInsModGroup.cod_dec.value+"'@deleted", cbkPrimaryKey);
		dwr.engine.setAsync(true);
	}
}
	
function cbkPrimaryKey(deleted)
{
	if(deleted == 'S')
	{
		var ripristina = confirm(ritornaJsMsg('gruppo_cancellato'));//Il codice inserito è già presente nel database ma è cancellato:vuoi ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.frmInsModGroup.cod_dec.value = '';
			document.frmInsModGroup.cod_dec.focus();
		}
		return;
	}
	if(deleted == 'N')
	{
		alert(ritornaJsMsg('gruppo_esistente'));//Il codice inserito è già presente nel database.Modificare il codice.
		document.frmInsModGroup.cod_dec.value = '';
		document.frmInsModGroup.cod_dec.focus();
		return;
	}
	else
		if(deleted != 'S' && deleted != 'N' && deleted != '')
		{
			alert(deleted);//errore
			return;
		}
}

function ripristina_pc()
{	
	dwr.engine.setAsync(false);
	CJsCheckPrimaryKey.ripristina_record("gruppi@cod_dec = '" + document.frmInsModGroup.cod_dec.value + "'@deleted='N'", cbkRipristino);
	dwr.engine.setAsync(true);
}
	
function cbkRipristino(message)
{
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		chiudi();
	}
}
/**/


function salva()
{
	var mancano = '';
	if(document.frmInsModGroup.cod_dec.value == '' || document.frmInsModGroup.txtDescr.value == '')
	{
		if(document.frmInsModGroup.cod_dec.value == '')
		{
			mancano += '- CODICE GRUPPO\n';//alert(ritornaJsMsg("MSG_INSCODICEGRUPPO"));
		}
		if(document.frmInsModGroup.txtDescr.value == '')
		{
			mancano += '- DESCRIZIONE\n';//alert(ritornaJsMsg("MSG_INSDESCRIZIONEGRUPPO"));
		}
	    alert(ritornaJsMsg("alert_mancano") + '\n' + mancano);
		return;
	}

	costruisciCodOpe();
	costruisciPermissioniTabelle();
	document.frmInsModGroup.submit();
}



/**
Funzione richiamata solo nel caso della modifica di un gruppo.
Aggiorna la tabella GRUPPI ed i campi WEB.cod_ope e WEB.permissioni_tabelle di tutti gli utenti
che appartengono al gruppo che si è andato a modificare.
*/
function salva_aggiorna_web()
{
	var aggiorna_web = confirm('Si desidera aggiornare anche le permissioni associate agli utenti del gruppo ' + document.frmInsModGroup.txtDescr.value + '.Attenzione verranno perse le eventuali modifiche fatte "ad hoc"');
		
	if(aggiorna_web)
	{
		costruisciCodOpe();
		costruisciPermissioniTabelle();
		
		document.frmInsModGroup.hiden_group.value = opener.stringa_codici(opener.iden);
		
		document.frmInsModGroup.submit();
	}
}


function costruisciPermissioniTabelle()
{
	var doc = document.frmInsModGroup;
	
	if(doc.pt_a.checked)
		doc.hpt_a.value = 'A';
	else
		doc.hpt_a.value = '_';
	
	if(doc.pt_t.checked)
		doc.hpt_t.value = 'T';		
	else
		doc.hpt_t.value = '_';		
	
	if(doc.pt_e.checked)
		doc.hpt_e.value = 'E';		
	else
		doc.hpt_e.value = '_';		
	
	if(doc.pt_r.checked)
		doc.hpt_r.value = 'R';		
	else
		doc.hpt_r.value = '_';		
	
	if(doc.pt_p.checked)
		doc.hpt_p.value = 'P';		
	else
		doc.hpt_p.value = '_';		
	
	if(doc.pt_o.checked)
		doc.hpt_o.value = 'O';	
	else
		doc.hpt_o.value = '_';		
	
	if(doc.pt_c.checked)
		doc.hpt_c.value = 'C';		
	else
		doc.hpt_c.value = '_';		
	
	if(doc.pt_x.checked)
		doc.hpt_x.value = 'X';		
	else
		doc.hpt_x.value = '_';			

	doc.hpermissioni_tabelle.value  = doc.hpt_a.value;
	doc.hpermissioni_tabelle.value += doc.hpt_t.value;
	doc.hpermissioni_tabelle.value += doc.hpt_e.value;
	doc.hpermissioni_tabelle.value += doc.hpt_r.value;
	doc.hpermissioni_tabelle.value += doc.hpt_p.value;
	doc.hpermissioni_tabelle.value += doc.hpt_o.value;
	doc.hpermissioni_tabelle.value += doc.hpt_c.value;
	doc.hpermissioni_tabelle.value += doc.hpt_x.value;
	
	//alert('WEB.PERMISSIONI_TABELLE: ' + doc.hpermissioni_tabelle.value);
}



function costruisciCodOpe()
{
	var cod_ope = '';
	cod_ope = document.all.lstPren.options[document.all.lstPren.selectedIndex].value;
	cod_ope += document.all.lstAcc.options[document.all.lstAcc.selectedIndex].value;
	cod_ope += document.all.lstEse.options[document.all.lstEse.selectedIndex].value;
	cod_ope += document.all.lstRef.options[document.all.lstRef.selectedIndex].value;
	cod_ope += document.all.lstModAnag.options[document.all.lstModAnag.selectedIndex].value;
	cod_ope += document.all.lstGesPara.options[document.all.lstGesPara.selectedIndex].value;
	cod_ope += document.all.lstTabMaga.options[document.all.lstTabMaga.selectedIndex].value;
	cod_ope += document.all.lstRefDef.options[document.all.lstRefDef.selectedIndex].value;
	cod_ope += document.all.lstRipristinoCancellati.options[document.all.lstRipristinoCancellati.selectedIndex].value;
	cod_ope += document.all.lstCancEsa.options[document.all.lstCancEsa.selectedIndex].value;
	
	document.frmInsModGroup.hCodOpe.value = cod_ope;
	
	//alert('WEB.COD_OPE: ' + document.frmInsModGroup.hCodOpe.value);
}


function chiudi(){
	opener.aggiorna();
	self.close();
}