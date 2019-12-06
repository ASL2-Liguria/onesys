var cdc;
var setCdc = false;
var pwdPS;

            
function canc_iden(n)
{
	if (n==1) 
	{
		document.frm_web.iden_per.value=''; 
		document.frm_web.tipo.value=''; 
		document.frm_web.htipo_iden_per.value = ''; 
	}
}
            
function sel_radio()
{
	doc=document.frm_web;	
	if (doc.tipo.value=='O')
	{
		doc.tipo_utente[3].checked=1; 
		return;
	}
	if (doc.tipo.value=='I')
	{
		doc.tipo_utente[2].checked=1; 
		return;
	}
	if (doc.tipo.value=='T')
	{
		doc.tipo_utente[1].checked=1; 
		return;
	}
	if ((doc.tipo.value=='M') || (doc.tipo.value=='S') || (doc.tipo.value=='P') || (doc.tipo.value=='R'))
	{
		doc.tipo_utente[0].checked=1; return;
	}
}


/*
function addCDC(testo,valore)
{
    var newCdc = new Option(testo, valore);
    document.frm_web.cdc_attivi_utente.add(newCdc, document.frm_web.cdc_attivi_utente.length);
}
*/

function removeCDC()
{
    for(var i = document.frm_web.cdc_attivi_utente.length; i > 0; i--)
    	document.frm_web.cdc_attivi_utente.remove(0);
}
            
function salva()
{
    var pressRegistra 	= false;
    var doc 			= document.frm_web;
    var doc_gen 		= document.frm_generale;
    var mancano			= '';
		
	if(doc.webuser.value == '' || (doc.livello[0].checked == 0 && doc.livello[1].checked == 0) || cdc == '' || doc.cdc_attivi_utente.value == ''
	|| (doc.opIMC.value == 'INS' && doc.iden_per.value == '') || (doc.opIMC.value == 'MOD' && doc.nome_per.value == ''))																						
	{
		if (doc.webuser.value == '')
		{
			 mancano = '- UTENTE\n';
		}

		if((doc.opIMC.value == 'INS' && doc.iden_per.value == '') || (doc.opIMC.value == 'MOD' && doc.nome_per.value == ''))
		{
			mancano += '- NOME UTENTE\n';
		}
		
		if (doc.livello[0].checked == 0 && doc.livello[1].checked == 0)
		{
			 mancano += '- LIVELLO UTENTE\n';
		}

		if(cdc == '' || doc.cdc_attivi_utente.value == '')
		{
			 mancano += "- CDC ASSOCIATI ALL'UTENTE\n";
		}
		
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	 }
		

	/*Gestione campo web.FILTRI_VOCI_INATTIVE*/
	if(doc.filtri_voci_inattive.checked)
		doc_gen.hfiltri_voci_inattive.value = 'S';
	else
		doc_gen.hfiltri_voci_inattive.value = 'N';
		
	/*CD DIRECT*/
	if(doc.ABILITA_CDBURN.checked)
		doc_gen.hABILITA_CDBURN.value = 'S';
	else
		doc_gen.hABILITA_CDBURN.value = 'N';
		
	/*SBLOCCA REFERTO*/	
	if(doc.sblocca_referto.checked)
		doc_gen.hsblocca_referto.value = 'S';
	else
		doc_gen.hsblocca_referto.value = 'N';
		
	/*ABILITA_CONTEXT_MENU*/	
	if(doc.abilita_context_menu.checked)
		doc_gen.habilita_context_menu.value = 'S';
	else
		doc_gen.habilita_context_menu.value = 'N';	
		
	
	if(doc.attiva_nuova_worklist.checked)
		doc_gen.hattiva_nuova_worklist.value = 'S';
	else
		doc_gen.hattiva_nuova_worklist.value = 'N';	
		
	/*abilita_auto_info_precedenti*/	
	if(doc.abilita_auto_info_precedenti.checked)
		doc_gen.habilita_auto_info_precedenti.value = 'S';
	else
		doc_gen.habilita_auto_info_precedenti.value = 'N';		
		
		
	if(doc.sospAutomDopoRefert.checked)
		doc_gen.hsospAutomDopoRefert.value = 'S';
	else
		doc_gen.hsospAutomDopoRefert.value = 'N';	
	
	if(doc.useNewConsoleLayout.checked)
		doc_gen.huseNewConsoleLayout.value = 'S';
	else
		doc_gen.huseNewConsoleLayout.value = 'N';	
		
	if(doc.useNewReportTool.checked)
		doc_gen.huseNewReportTool.value = 'S';
	else
		doc_gen.huseNewReportTool.value = 'N';	
		
	if(doc.useTinyMCE.checked)
		doc_gen.huseTinyMCE.value = 'S';
	else
		doc_gen.huseTinyMCE.value = 'N';	
	
	if(doc.rich_pwd_su_bozza.checked)
		doc_gen.hrich_pwd_su_bozza.value = 'S';
	else
		doc_gen.hrich_pwd_su_bozza.value = 'N';		
		
	if(doc.usaVocale.checked)
		doc_gen.husaVocale.value = 'S';
	else
		doc_gen.husaVocale.value = 'N';		

	if(doc.cdc_utente.checked)
		doc_gen.hcdc_utente.value = 'S';
	else
		doc_gen.hcdc_utente.value = 'N';		
		
	
    doc_gen.worklist_refresh.value = doc.worklist_refresh.value;
    doc_gen.hiden_group.value = doc.group.value;
    doc_gen.hwebuser.value = doc.webuser.value;
    doc_gen.hiden_per.value = doc.iden_per.value;
	doc_gen.ldapWarningDays_pwdExpired.value = doc.ldapWarningDays_pwdExpired.value;
    doc_gen.hcod_ope.value = '';
    doc_gen.hcod_ope.value = doc.cod_ope_pre.value + doc.cod_ope_acc.value + 
    doc.cod_ope_ese.value + doc.cod_ope_ref.value+doc.cod_ope_ana.value + 
    doc.cod_ope_par.value + doc.cod_ope_mag.value+doc.cod_ope_can.value + doc.ripr_canc.value + 
    doc.cod_canc_esa.value+doc.codScreening.value+doc.codTeleconsulto.value+doc.codGestRichieste.value+
    doc.codRicercaEsami.value+doc.codRicercaPazienti.value+doc.codworklist.value+doc.codtabelle.value +
    doc.codmedNuc.value+doc.codRichMod.value;
	
    var permessi_tabelle = ''
    
	if (doc.permesso_tabelleA.checked == 1)
         permessi_tabelle += 'A';
    else
         permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleT.checked == 1)
         permessi_tabelle += 'T';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleE.checked == 1) 
		permessi_tabelle += 'E';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleR.checked == 1)
         permessi_tabelle += 'R';
    else
         permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleP.checked == 1)
         permessi_tabelle += 'P';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleO.checked == 1)
         permessi_tabelle += 'O';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleC.checked == 1)
        permessi_tabelle += 'C';
    else
    	permessi_tabelle += ' ';
    
	if (doc.permesso_tabelleX.checked == 1)
         permessi_tabelle += 'X';
    else
    	permessi_tabelle += ' ';
		
	if(permessi_tabelle == '        ')
		permessi_tabelle = '          ';
	
	//alert(permessi_tabelle.length);
	
	doc_gen.hgest_tab.value = permessi_tabelle;
	
    if (doc.livello[0].checked == 1)
         doc_gen.hlivello.value = doc.livello[0].value;
    if (doc.livello[1].checked == 1)
         doc_gen.hlivello.value = doc.livello[1].value;
    doc_gen.hnome_per.value = doc.nome_per.value;
    if (doc.ob_esecuzione.checked==1) 
         doc_gen.hob_esecuzione.value='S'; 
    else
         doc_gen.hob_esecuzione.value = 'N';
		 
		 
	if (doc.ob_ins_pwd_esecuzione.checked==1) 
         doc_gen.hob_ins_pwd_esecuzione.value='S'; 
    else
         doc_gen.hob_ins_pwd_esecuzione.value = 'N';	 
		 

    if (document.frm_web.medst4_loginRis.checked==1)
         doc_gen.hmedst4_loginRis.value='S'; 
    else
         doc_gen.hmedst4_loginRis.value='N';
    if (document.frm_web.ultima_provenienza.checked==1)
         doc_gen.hultima_provenienza.value='S';
     else
         doc_gen.hultima_provenienza.value='N';
		 
	if (document.frm_web.ultimo_med_resp_ins.checked==1)
         doc_gen.hultimo_med_resp_ins.value='S';
     else
         doc_gen.hultimo_med_resp_ins.value='N';
	
    doc_gen.hcdc_attivi_utente.value = doc.cdc_attivi_utente.value; 
    doc_gen.hPH_DimCar.value = doc.PH_DimCar.value; 
	doc_gen.infoGruppoLDAP.value = doc.infoGruppoLDAP.value; 
    doc_gen.hlingua.value = doc.lingua.value; 
    doc_gen.hordin_prestazioni.value = doc.select.value;
    if (doc.tipo_utente[0].checked == 1)
         doc_gen.htipo.value =doc.tipo_utente[0].value;
    if (doc.tipo_utente[1].checked == 1)
         doc_gen.htipo.value = 'T';
    if (doc.tipo_utente[2].checked == 1)
         doc_gen.htipo.value = 'I';
    if (doc.tipo_utente[3].checked == 1)
         doc_gen.htipo.value = 'O';
		 
	if(doc.visualizza_omino.value == '0')
		doc_gen.hvisualizza_omino.value = '0';
		
	if(doc.visualizza_omino.value == '1')
		doc_gen.hvisualizza_omino.value = '1';
		
	if(doc.visualizza_omino.value == '2')
		doc_gen.hvisualizza_omino.value = '2';
		
	if(doc.visualizza_omino.value == '3')
		doc_gen.hvisualizza_omino.value = '3';
		
	
	if(doc.tipo_scelta_esami.value == '0')
		doc_gen.htipo_scelta_esami.value = 'ACR';
		
	if(doc.tipo_scelta_esami.value == '1')
		doc_gen.htipo_scelta_esami.value = 'OMINO';
	
	doc_gen.hfiltro_provenienza.value = doc.filtro_provenienza.value;
		 
    pressRegistra = true;
    document.frm_generale.hpressRegistra.value = pressRegistra;
    document.frm_generale.hcodici.value = cdc;
    document.frm_generale.hgu.value = document.frm_web.webuser.value;
    document.frm_generale.hop.value = document.frm_web.opIMC.value;
    
	if(document.frm_web.opIMC.value == '')
         document.frm_generale.hop.value='CANC';
    
	if(document.frm_generale.hop.value == 'INS')
	{
        popup = window.open('PasswordServlet?nome_form=frm_generale','popDialog','height=250,width=400,scrollbars=no,top=200,left=300');
	}
    else {
         document.frm_generale.submit(); 
         alert(ritornaJsMsg('reg'));
         
		 chiudi_ins_mod();
        }
}
  
  
function chiudi()
{
	opener.aggiorna_worklist();
	self.close();
}
     
	 
function chiudi_ins_mod()
{
	opener.parent.Ricerca.put_last_value(document.frm_web.webuser.value);
	self.close();
}	 
         

function popolaVisualizzaOmino()
{
	var vis_omino_salvato = document.frm_web.hvis_omino.value;
	var TipoSceltaEsami = document.frm_web.htipo_scelta_esami.value;

	//alert('Visualizza Omino: ' + vis_omino_salvato);
	
	document.all.visualizza_omino.options[0] = new Option('NON visualizzare omino', '0', false, false);	
	document.all.visualizza_omino.options[1] = new Option('Visualizzare omino in prenotazione', '1', false, false);	
	document.all.visualizza_omino.options[2] = new Option('Visualizzare omino in accettazione', '2', false, false);	
	document.all.visualizza_omino.options[3] = new Option('Visualizzare omino sia in prenotazione che in accettazione', '3', false, false);
	
	if(vis_omino_salvato == '')
		document.all.visualizza_omino.options[3].selected = true;
		
	if(vis_omino_salvato == '0')
		document.all.visualizza_omino.options[0].selected = true;
	if(vis_omino_salvato == '1')
		document.all.visualizza_omino.options[1].selected = true;
	if(vis_omino_salvato == '2')
		document.all.visualizza_omino.options[2].selected = true;
	if(vis_omino_salvato == '3')
		document.all.visualizza_omino.options[3].selected = true;	
		
		
		
	
	document.all.tipo_scelta_esami.options[0] = new Option('ACR', '0', false, false);	
	document.all.tipo_scelta_esami.options[1] = new Option('OMINO', '1', false, false);
	
	if(TipoSceltaEsami == '')
		document.all.tipo_scelta_esami.options[1].selected = true;
		
	if(TipoSceltaEsami == 'ACR')
		document.all.tipo_scelta_esami.options[0].selected = true;
	if(TipoSceltaEsami == 'OMINO')
		document.all.tipo_scelta_esami.options[1].selected = true;
	
	document.all.filtro_provenienza.options[0] = new Option('Singola', '0', false, false);	
	document.all.filtro_provenienza.options[1] = new Option('Multipla', '1', false, false);
	
	if(document.all.hfiltro_provenienza.value == '1')
		document.all.filtro_provenienza.options[1].selected = true;
	else
		document.all.filtro_provenienza.options[0].selected = true;
		
	gestioneOCXRefertazione('useNewReportTool');
	gestioneOCXRefertazione('useTinyMCE');
}		 

		 
function apri_scan_db(procedura, campo)
{
    var finestra = window.open('','winScanDb','width=250,height=600, resizable = yes, status=yes, top=10,left=10');
    document.form_scan_db.myric.value = campo;
    document.form_scan_db.myproc.value = procedura;
    document.form_scan_db.mywhere.value = '';
    document.form_scan_db.submit();
}

function CambiaTipoPersonale(ck)
{
	if(ck)
	{
	 	switch(document.frm_web.htipo_iden_per.value)
	 	{
     		case 'M': document.frm_web.tipo_utente[0].checked = true; break;
     		case 'T': document.frm_web.tipo_utente[1].checked = true; break;
     		case 'I': document.frm_web.tipo_utente[2].checked = true; break;
     		case 'O': document.frm_web.tipo_utente[3].checked = true; break;
     	}
	}
	document.frm_web.nome_per_precedente.value = document.frm_web.nome_per.value;
}


function controlla_webuser()
{
	var res = controllo_correttezza_webuser(document.frm_web.webuser, 'alert_wrong_webuser');
	if(res == 1){
		dwr.engine.setAsync(false);
		CJsCheckPrimaryKey.check_primary_key("web@webuser='"+document.frm_web.webuser.value+"'@attivo", cbkPrimaryKey);
		dwr.engine.setAsync(true);
	}
}

function cbkPrimaryKey(attivo)
{
	if(attivo == 'N')
	{
		var ripristina = confirm(ritornaJsMsg('webuser_cancellato'));//L'utente inserito è già presente nel database ma è cancellato:vuoi ripristinarlo?
		if(ripristina)
			ripristina_pc();
		else
		{
			document.frm_web.webuser.value = '';
			document.frm_web.webuser.focus();
		}
		return;
	}
	if(attivo == 'S')
	{
		alert(ritornaJsMsg('webuser_esistente'));//L'utente inserito è già presente nel database.Modificare il webuser
		document.frm_web.webuser.value = '';
		document.frm_web.webuser.focus();
		return;
	}
	else
		if(attivo != 'S' && attivo != 'N' && attivo != '')
		{
			alert(attivo);//errore
			return;
		}
}

function ripristina_pc()
{	
	dwr.engine.setAsync(false);
	CJsCheckPrimaryKey.ripristina_record("web@webuser = '" + document.frm_web.webuser.value + "'@attivo='S',deleted='N'", cbkRipristino);
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
		chiudi_ins_mod();
	}
}


function gestioneOCXRefertazione(ocx){
	if(ocx == 'useNewReportTool'){
		if(document.frm_web.useNewReportTool.checked)
			document.frm_web.useTinyMCE.disabled = true;
		else
			document.frm_web.useTinyMCE.disabled = false;
	}
	
	if(ocx == 'useTinyMCE'){
		if(document.frm_web.useTinyMCE.checked)
			document.frm_web.useNewReportTool.disabled = true;
		else
			document.frm_web.useNewReportTool.disabled = false;
	}
}








