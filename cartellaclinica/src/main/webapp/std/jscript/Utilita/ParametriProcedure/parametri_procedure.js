var registrazione = false;

/*
function ob_comune_nascita()
{
	if(document.form_par.ob_codice_fiscale.checked == 1)
	{
		document.form_par.ob_nascita.checked = true;
		document.form_par.hob_nascita.value = 'S';
	}
}
*/

/*
function med_abilita_f()
{ 
 	var doc = document.form_par;
 	if(doc.med_abilita.checked == 0)
	{
 		doc.med_pwd.value = "";
 		doc.med_user.value = "";
 		doc.med_host.value = "";
 		doc.med_alias.value = "";
 		doc.med_applic.value = "";
	    doc.med_title.value = "";
	}
}*/

function chiudi()
{ 
	 document.location.replace("worklistInizio");
} 

function controlla_numero(valore)
{
	if(isNaN(valore.value))
	{
 		alert(ritornaJsMsg('alert_num'));
 		valore.value = '';
 		valore.focus();
 	}
}

function salva()
{ 
	var doc=document.form_par;
	if(doc.mn_ordine_mat[0].checked == 1)
		doc.hmn_ordine_mat.value='Q';
	if(doc.mn_ordine_mat[1].checked == 1)
		doc.hmn_ordine_mat.value='D';
	if(doc.numerazione[0].checked==1)
		doc.hnum_arc.value = 'P';
	if(doc.numerazione[1].checked==1)
		doc.hnum_arc.value = 'A';
	if(doc.hnum_arc.value == "")
	{
		alert(ritornaJsMsg('alert_numarc'));
		return;
	}

	if(doc.mnneltesto.checked==1) 
		doc.hmnneltesto.value="S";
	else
		doc.hmnneltesto.value="N";
	if(doc.mn_data_presente.checked==1) 
		doc.hmn_data_presente.value="S";
	else
		doc.hmn_data_presente.value="N";
	if(doc.mn_data_a_capo.checked==1) 
		doc.hmn_data_a_capo.value="S";
	else
		doc.hmn_data_a_capo.value="N";
	if (doc.mn_label_esami.checked==1) 
		doc.hmn_label_esami.value="S";
 	else
		doc.hmn_label_esami.value="N";
	if (doc.mn_separa.checked==1) 
		doc.hmn_separa.value="S";
	else
		doc.hmn_separa.value="N";
	if (doc.sottonumero.checked==1) 
		doc.hsottonumero.value="S";	
	else
		doc.hsottonumero.value="N";
	if (doc.separasottonumeri.checked==1) 
		doc.hseparasottonumeri.value="S";
 	else
		doc.hseparasottonumeri.value="N";
	if (doc.ob_ref_std_txt.checked==1) 
		doc.hob_ref_std_txt.value="S";
 	else
		doc.hob_ref_std_txt.value="N";
	if (doc.ob_approp.checked==1) 
		doc.hob_approp.value="S";
 	else
		doc.hob_approp.value="N";
	if (doc.abilita_approp.checked==1) 
		doc.habilita_approp.value="S";
 	else
		doc.habilita_approp.value="N";	
	if (doc.ckricevuta.checked==1) 
		doc.hricevuta.value="S";
 	else
		doc.hricevuta.value="N";
	
	if (doc.tecnico_non_mod.checked==1) 
		doc.htecnico_non_mod.value="S";
	else
		doc.htecnico_non_mod.value="N";
		
	if (doc.gestione_fine_esecuzione.checked==1) 
		doc.hgestione_fine_esecuzione.value="S";
	else
		doc.hgestione_fine_esecuzione.value="N";	
	
	/*
	if (doc.ob_nascita.checked==1) 
		doc.hob_nascita.value="S";
	else
		doc.hob_nascita.value="N";
	if (doc.ob_residenza.checked==1) 
		doc.hob_residenza.value="S";
 	else
		doc.hob_residenza.value="N";
	if (doc.ob_codice_fiscale.checked==1) 
		doc.hob_codice_fiscale.value="S";
 	else
		doc.hob_codice_fiscale.value="N";
	//Avviso in scheda anagrafica se il codice fiscale è nullo
	if(doc.check_cod_fisc.checked)
		doc.hcheck_cod_fisc.value = 'S';
	else
		doc.hcheck_cod_fisc.value = 'N';
	*/	
		
	if (doc.filtro_cdc.checked==1) 
		doc.hfiltro_cdc.value="S";	
	else
		doc.hfiltro_cdc.value="N";
	
	if (doc.abilita_acr_campi_referto.checked==1) 
		doc.habilita_acr_campi_referto.value="S";
	 else
		doc.habilita_acr_campi_referto.value="N";
	if (doc.segnala_appropriato.checked==1) 
		doc.hsegnala_appropriato.value="S";
	else
		doc.hsegnala_appropriato.value="N";
		
	if (doc.screening.checked==1) 
		doc.hscreening.value="S";
	else
		doc.hscreening.value="N";	
		
	if (doc.attiva_sinc_medisurf.checked==1) 
		doc.hattiva_sinc_medisurf.value="S";
	else
		doc.hattiva_sinc_medisurf.value="N";
	
	if (doc.accorpa_paz_x_medilink.checked==1)
		doc.haccorpa_paz_x_medilink.value = "S";
	else
		doc.haccorpa_paz_x_medilink.value = "N";
	
	if (doc.uso_dhcp.checked==1)
		doc.huso_dhcp.value = "S";
	else
		doc.huso_dhcp.value = "N";
		
	if (doc.stampa_etichette_prenotazione.checked==1)
		doc.hstampa_etichette_prenotazione.value = "S";
	else
		doc.hstampa_etichette_prenotazione.value = "N";	
	
	if (doc.interroga_dns_server.checked==1)
		doc.hinterroga_dns_server.value = "S";
	else
		doc.hinterroga_dns_server.value = "N";
		
	if (doc.verifica_lungh_pw.checked==1)
		doc.hverifica_lungh_pw.value = "S";
	else
		doc.hverifica_lungh_pw.value = "N";
		
	if(doc.acc_per_stessa_branca.checked==1)
		doc.hacc_per_stessa_branca.value = "S";
	else
		doc.hacc_per_stessa_branca.value = "N";
		
		
		
	if(doc.acc_per_stessa_metodica.checked==1)
		doc.hacc_per_stessa_metodica.value = "S";
	else
		doc.hacc_per_stessa_metodica.value = "N";	
		
	
	if(doc.acc_delgiorno.checked==1)
		doc.hacc_delgiorno.value = "S";
	else
		doc.hacc_delgiorno.value = "N";	
	
	
	if (doc.OB_ACR.checked==1)
		doc.hOB_ACR.value = "S";
	else
		doc.hOB_ACR.value = "N";
	if(doc.RPT_CTL_TRACE.checked)
	    doc.h_RPT_CTL_TRACE.value = 'S';
	else
	    doc.h_RPT_CTL_TRACE.value = 'N';
	if(doc.RPT_CTL_LOGREPORT.checked)
    	doc.h_RPT_CTL_LOGREPORT.value = 'S';
	else
    	doc.h_RPT_CTL_LOGREPORT.value = 'N';
	if(doc.RPT_CTL_SAVEALSOREPORTRTF.checked)
    	doc.h_RPT_CTL_SAVEALSOREPORTRTF.value = 'S';
	else
    	doc.h_RPT_CTL_SAVEALSOREPORTRTF.value = 'N';
		
	if(doc.abilita_autosync_ref.checked)
    	doc.habilita_autosync_ref.value = 'S';
	else
    	doc.habilita_autosync_ref.value = 'N';	

	if(doc.forza_reftxt.checked)
    	doc.hforza_reftxt.value = 'S';
	else
    	doc.hforza_reftxt.value = 'N';	
	
	if(doc.lockCheckBeforeReporting.checked)
    	doc.hlockCheckBeforeReporting.value = 'S';
	else
    	doc.hlockCheckBeforeReporting.value = 'N';	
		
	
	if(doc.usaocxkillhome.checked)
    	doc.husaocxkillhome.value = 'S';
	else
    	doc.husaocxkillhome.value = 'N';	
	
	if(doc.deleteDicomFileEachSign.checked)
    	doc.hdeleteDicomFileEachSign.value = 'S';
	else
    	doc.hdeleteDicomFileEachSign.value = 'N';	
		
	if(doc.notifica_div_refertante.checked)
    	doc.hnotifica_div_refertante.value = 'S';
	else
    	doc.hnotifica_div_refertante.value = 'N';			
		
	if(doc.definitivo_senza_pwd.checked)
    	doc.hdefinitivo_senza_pwd.value = 'S';
	else
    	doc.hdefinitivo_senza_pwd.value = 'N';			
	
	if(doc.processDicomObjInMemory.checked)
    	doc.hprocessDicomObjInMemory.value = 'S';
	else
    	doc.hprocessDicomObjInMemory.value = 'N';	

	if(doc.disablePrintIfPending.checked)
    	doc.hdisablePrintIfPending.value = 'S';
	else
    	doc.hdisablePrintIfPending.value = 'N';		

	/*if (doc.motivo_cancellazione_obb.checked == 1)
		doc.hmotivo_cancellazione_obb.value = "S";
	else
		doc.hmotivo_cancellazione_obb.value = "N";	*/
	
	if (doc.ob_pwd_canc.checked == 1)
		doc.hob_pwd_canc.value = "S";
	else
		doc.hob_pwd_canc.value = "N";	
	
	if(doc.ob_ric_paz_data.checked == 1)
		doc.hob_ric_paz_data.value = 'S';
	else
		doc.hob_ric_paz_data.value = 'N';
		
	
	if(doc.ob_ric_paz_nome.checked == 1)
		doc.hob_ric_paz_nome.value = 'S';
	else
		doc.hob_ric_paz_nome.value = 'N';
	
	
	if(doc.ricerca_anagrafica[0].checked == 1)
		doc.hricerca_anagrafica.value = '0';
	else
		if(doc.ricerca_anagrafica[1].checked == 1)
			doc.hricerca_anagrafica.value = '1';
		else
			if(doc.ricerca_anagrafica[2].checked == 1)
				doc.hricerca_anagrafica.value = '2';
			else
				if(doc.ricerca_anagrafica[3].checked == 1)
					doc.hricerca_anagrafica.value = '3';
	
	/*Parametri Prenotazione*/
	if(doc.prenotazione_per_centro.checked)
		doc.hprenotazione_per_centro.value = 'S';
	else
		doc.hprenotazione_per_centro.value = 'N';
	
	/*Gestione Mastrizzazione*/
	if(doc.cdburn_abilita.checked)
		doc.hcdburn_abilita.value = 'S';
	else
		doc.hcdburn_abilita.value = 'N';
	
	if(doc.cdburn_solodef.checked)
		doc.hcdburn_solodef.value = 'S';
	else
		doc.hcdburn_solodef.value = 'N';
		
	/*Gestione LDAP*/	
	if(doc.login_ldap.checked)
		doc.hlogin_ldap.value = 'S';
	else
		doc.hlogin_ldap.value = 'N';
		
	/*Magazzino*/
	if(doc.gestione_lotto.checked)
		doc.hgestione_lotto.value = 'S';
	else
		doc.hgestione_lotto.value = 'N';	
			

	/*Parametri gestione GERICOS*/				
	if(doc.disab_rich_meto_diversa.checked)
		doc.hdisab_rich_meto_diversa.value = 'S';
	else
		doc.hdisab_rich_meto_diversa.value = 'N';
		
	if(doc.gericos_alert_esa_urgente.checked)
		doc.hgericos_alert_esa_urgente.value = 'S';
	else
		doc.hgericos_alert_esa_urgente.value = 'N';	
		
	if(doc.gericos_vis_esa_firmati.checked)
		doc.hgericos_vis_esa_firmati.value = 'S';
	else
		doc.hgericos_vis_esa_firmati.value = 'N';		

	registrazione = true;
	doc.hregistra.value = registrazione;
	doc.submit();
	alert(ritornaJsMsg('reg'));
}
