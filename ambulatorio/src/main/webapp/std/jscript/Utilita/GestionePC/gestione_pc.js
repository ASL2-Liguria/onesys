/*function controllo_active_x()
{
	document.form_pc.printername_eti_client.value = document.form_pc.ComboBoxPrinterList_eti.text;
	document.form_pc.printername_ref_client.value = document.form_pc.ComboBoxPrinterList_ref.text;
}
*/

$(document).ready(function() 
{	
/*	$("table[class='classTabHeader']").each(function(indice, valore){
		// salta il primo
		if (indice!=0){
			$(this).hide();
		}
	});*/
});

function ab_dis_combo_stampanti()
{
	var indirizzo_ip = document.form_pc.ip_locale.value;
	var nome_host_locale = document.form_pc.nome_host_locale.value;
	//alert('NOME_HOST LOCALE: ' + nome_host_locale + " - IP LOCALE:" + indirizzo_ip);

	if(document.form_pc.ip.value != indirizzo_ip && document.form_pc.nome_host.value != nome_host_locale)
	{
		//HideLayer("id_stampante_etichette");
		//HideLayer("id_stampante_referto");
		document.form_pc.printername_eti_client.disabled = true;
		document.form_pc.printername_ref_client.disabled = true;
		document.form_pc.configurazione_eti.disabled = true;
	}
	else
	{
		//ShowLayer("id_stampante_etichette");
		//ShowLayer("id_stampante_referto");
		document.form_pc.printername_eti_client.disabled = false;
		document.form_pc.printername_ref_client.disabled = false;
		document.form_pc.configurazione_eti.disabled = false;
	}
}



function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}


function chiudi_ins_mod()
{
	opener.parent.Ricerca.put_last_value(document.form_pc.ip.value);
	//self.close();
}

var saveWin;
function salva()
{
	var doc = document.form_pc; 
	if (doc.ip.value == '')
	{
		alert(ritornaJsMsg('a_ip'));//'Prego, inserire un IP'
		doc.ip.focus(); 
		return;
	}
	else
	{
		if(document.form_pc.hop.value != 'MOD')
		{
			ckeckPrimaryKey();
		}
		else
			registra = true;
	}

	doc.reg.value = registra;
	
	if(!registra)
	{
		return;
	}
		
	//doc.ip.value = doc.ip.value.toUpperCase();

	if(doc.nome_host.value == '')
	{ 
		alert(ritornaJsMsg('a_nome_host')); //'Inserire Nome Computer prego'
		doc.nome_host.focus();
		return;
	}

	
	if(doc.abilita_sinc_isite.checked == 1)
		doc.habilita_sinc_isite.value = 'S';
	else
		doc.habilita_sinc_isite.value = 'N';
		
	if(doc.abilita_firma_digitale.checked == 1)
		doc.habilita_firma_digitale.value = 'S';
	else
		doc.habilita_firma_digitale.value = 'N';		
		
	
	if(doc.attiva_carebox.checked == 1)
		doc.hattiva_carebox.value = 'S';
	else
		doc.hattiva_carebox.value = 'N';		
		
		
	if(doc.abilita_phoneidos.checked == 1)
		doc.Habilita_phoneidos.value = 'S';
	else
		doc.Habilita_phoneidos.value = 'N';	
		
	if(doc.ABILITA_MAGIC_PHONEIDOS.checked == 1)
		doc.Habilita_magic_phoneidos.value = 'S';
	else
		doc.Habilita_magic_phoneidos.value = 'N';		

	if(doc.tiponome_server_web[0].checked == 1)
		doc.htiponome_server_web.value = 'I';
	if(doc.tiponome_server_web[1].checked == 1)
		doc.htiponome_server_web.value = 'N';
	
	if (doc.scelta_stampante.checked) 
		doc.hscelta_stampante.value = 'S'; 
	else
		doc.hscelta_stampante.value = 'N';
	if (doc.auto_stampa_eti_anag.checked) 
		doc.hauto_stampa_eti_anag.value = 'S';
	else 
		doc.hauto_stampa_eti_anag.value = 'N';
	 
	if(doc.processPSforKeyImages.checked)
		doc.hprocessPSforKeyImages.value = 'S';
	else
		doc.hprocessPSforKeyImages.value = 'N'; 
	 
	if(doc.MedSt4_Enable.checked)
		doc.hMedSt4_Enable.value = 'S';
	else
		doc.hMedSt4_Enable.value = 'N';
	if(doc.MedSt4_Verbose.checked)
		doc.hMedSt4_Verbose.value = 'S';
	else
		doc.hMedSt4_Verbose.value = 'N';	
	if(doc.optmedst4_SyncDataPatId[0].checked)
		doc.hoptmedst4_SyncDataPatId.value = 'PATID';
	if(doc.optmedst4_SyncDataPatId[1].checked)
		doc.hoptmedst4_SyncDataPatId.value = 'PATID2';	
	if(doc.optmedst4_SyncDataPatId[2].checked)
		doc.hoptmedst4_SyncDataPatId.value = '';	
	
	if(doc.optMedst4_SyncData[0].checked)
		doc.hoptMedst4_SyncData.value = 'STYID';
	if(doc.optMedst4_SyncData[1].checked)
		doc.hoptMedst4_SyncData.value = 'STYACCNUMBER';	
	if(doc.optMedst4_SyncData[2].checked)
		doc.hoptMedst4_SyncData.value = '';		
		
	if(doc.abilita_sinc_mediprime.checked)
		doc.habilita_sinc_mediprime.value = 'S';
	else
		doc.habilita_sinc_mediprime.value = 'N';	
		
	if(doc.abilita_sinc_mediprime_url.checked)
		doc.habilita_sinc_mediprime_url.value = 'S';
	else
		doc.habilita_sinc_mediprime_url.value = 'N';	

	if(doc.abilita_log_MP.checked)
		doc.habilita_log_MP.value = 'S';
	else
		doc.habilita_log_MP.value = 'N';	
	if(doc.abilita_mp2img.checked)
		doc.habilita_mp2img.value = 'S';
	else
		doc.habilita_mp2img.value = 'N';		
	
	if (doc.voc_abilita.checked==1)
		doc.Hvoc_abilita.value = 'S';
	else
		doc.Hvoc_abilita.value = 'N';

	if(doc.abilita_login_smart_card.checked)
		doc.habilita_login_smart_card.value = 'S';
	else
		doc.habilita_login_smart_card.value = 'N';

	if(doc.abilita_synthema.checked)
		doc.habilita_synthema.value = 'S';
	else
		doc.habilita_synthema.value = 'N';
		
	if(doc.CDBURN_burnEveryExam.checked)
		doc.hCDBURN_burnEveryExam.value = 'S';
	else
		doc.hCDBURN_burnEveryExam.value = 'N';
		
	if(doc.usa_utente_emergenza_sysv.checked)
		doc.husa_utente_emergenza_sysv.value = 'S';
	else
		doc.husa_utente_emergenza_sysv.value = 'N';	
		
	if(doc.show_toolbar.checked)
		doc.hshow_toolbar.value = 'S';
	else
		doc.hshow_toolbar.value = 'N';	
	
	if(doc.ABILITA_SYNC_VE.checked)
		doc.hABILITA_SYNC_VE.value = 'S';
	else
		doc.hABILITA_SYNC_VE.value = 'N';	
		
		
	if(doc.abilita_pacs_agfa.checked)
		doc.habilita_pacs_agfa.value = 'S';
	else
		doc.habilita_pacs_agfa.value = 'N';		
		
		
	if(doc.abilita_pacs_mim.checked)
		doc.habilita_pacs_mim.value = 'S';
	else
		doc.habilita_pacs_mim.value = 'N';		
		
	if(doc.ALEUS_PLAYSOUND.checked)
		doc.hALEUS_PLAYSOUND.value = 'S';
	else
		doc.hALEUS_PLAYSOUND.value = 'N';		
		
///////////////////////////////////////////////////////
/////////////////////////////////////////////////

	//controllo_active_x();
	
	document.form_pc.hgu.value = document.form_pc.ip.value;



	saveWin = window.open("","mySaveWin","top=2000,left=2000,width=100,height=100,status=yes,scrollbars=yes");
	if (saveWin){
		saveWin.focus();
	}
	else{
		saveWin = window.open("","mySaveWin","top=2000,left=2000,width=100,height=100,status=yes,scrollbars=yes");
	}
	document.form_pc.target = "mySaveWin";
	doc.submit();
	setTimeout(function(){try{saveWin.close();alert ("Salvataggio effettuato!");self.close();}catch(e){;}},1000);
	 
	//alert(document.form_pc.ip.value);
	
	chiudi_ins_mod();
}

/*Controllo univocità dell' IP utilizzando AJAX*/
function ckeckPrimaryKey()
{
	if(document.form_pc.ip.value != '')
	{
		dwr.engine.setAsync(false);
		CJsCheckPrimaryKey.check_primary_key("configura_pc@ip='"+document.form_pc.ip.value+"'@deleted", cbkPrimaryKey);
		dwr.engine.setAsync(true);
	}
}
	
function cbkPrimaryKey(deleted)
{
	registra = true; 
	if(deleted == 'S')
	{
		var ripristina = confirm(ritornaJsMsg('ip_cancellato'));//L'ip inserito è già presente nel database ma è cancellato:vuoi 					                                                                  ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.form_pc.ip.value = '';
			document.form_pc.ip.focus();
		}
			
		registra = false; 
		return;
	}
	if(deleted == 'N')
	{
		alert(ritornaJsMsg('a_ipEsistente'));//L'ip inserito è già presente nel database.Modificare l'ip
		document.form_pc.ip.value = '';
		document.form_pc.ip.focus();
		registra = false; 
		return;
	}
	else
		if(deleted != 'S' && deleted != 'N' && deleted != '')
		{
			alert(deleted);//errore
			registra = false; 
			return;
		}
		else
			{
				registra = true;
			}
}

function ripristina_pc()
{	
	dwr.engine.setAsync(false);
	CJsCheckPrimaryKey.ripristina_record("configura_pc@ip = '" + document.form_pc.ip.value + "'@deleted='N'", cbkRipristino);
	dwr.engine.setAsync(true);
}
	
function cbkRipristino(message)
{
	CJsCheckPrimaryKey = null;
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		chiudi_ins_mod();
	}
}
	
function MedSt4_gestionePatID(valore)
{
	if (valore == '')
	{
		document.form_pc.Medst4_SyncDataPatId.value = '';
		document.form_pc.Medst4_SyncDataPatId.focus()		
		return;
	}
	document.form_pc.Medst4_SyncDataPatId.value = valore;
}	

	
function MedSt4_gestione(valore)
{
	if (valore == '')
	{
		document.form_pc.Medst4_SyncData.value = '';
		document.form_pc.Medst4_SyncData.focus()		
		return;
	}
	document.form_pc.Medst4_SyncData.value = valore;
}	

/*
	Funzione richiamata alla fine della costruzione della pagina di ins/modifica PC
	per il riempimento dei combo-box delle stampanti etichette e stampanti referti.
	La funzione js carica_combo_printer è nel file js jscript/enumPrinter.js
*/
function combo_box_stampanti_eti_ref(st_eti, st_ref)
{
	if(document.form_pc.hop.value == "INS" || 
	   (document.form_pc.hop.value == "MOD" && 
	   (document.form_pc.ip.value != document.form_pc.ip_locale.value && document.form_pc.nome_host_locale.value != document.form_pc.		        nome_host.value)))
	{
		document.all.id_st_etichette.title = "Disabilitato";
		document.all.id_st_referti.title = "Disabilitato";
		document.all.id_conf_eti.title = "Disabilitato";

		document.form_pc.printername_eti_client.disabled = true;
		document.form_pc.printername_ref_client.disabled = true;
		document.form_pc.configurazione_eti.disabled = true;
	}

	carica_combo_printer(document.form_pc.printername_ref_client, st_ref);
	carica_combo_printer(document.form_pc.printername_eti_client, st_eti);
}


function controlla_numero(valore)
{
	if(isNaN(valore.value))
	{
 		alert(ritornaJsMsg('a_num'));
 		valore.value = '';
 		valore.focus();
 	}
}