function verifica_campo(valore)
{
	if(valore != null && valore != '')
		return "'" + valore + "'";
	else
		return null;
}



function scegli_elemento(campo_return, procedura)
{
	var doc_r = document.form_scandb;
	win_scandb = window.open('','win_scandb', 'width=400, height=600, resizable = yes, status=yes, top=10,left=10');
	doc_r.myric.value = campo_return;
	doc_r.myproc.value = procedura;
	doc_r.mywhere.value = '';
	doc_r.method = 'POST';
	doc_r.submit();	
}

function registra()
{
	var doc = document.form_appr_filtro_rm_tc;	
	var mancano = '';
	
	if(doc.tipo_esame[0].checked == 1)
		doc.htipo_esame.value = 'P';
	if(doc.tipo_esame[1].checked == 1)
		doc.htipo_esame.value = 'C';
	if(doc.tipo_esame[2].checked == 1)
		doc.htipo_esame.value = 'S';	
		
	if(doc.specifica_quesito[0].checked == 1)
		doc.hspecifica_quesito.value = 'S';
	if(doc.specifica_quesito[1].checked == 1)
		doc.hspecifica_quesito.value = 'N';	
		
	if(doc.altre_indagini_pe.checked == 1)
		doc.haltre_indagini_pe.value = 'S';
	else
		doc.haltre_indagini_pe.value = 'N';		
		
	if(doc.altre_indagini_tc.checked == 1)
		doc.haltre_indagini_tc.value = 'S';
	else
		doc.haltre_indagini_tc.value = 'N';			
	
	if(doc.altre_indagini_rx.checked == 1)
		doc.haltre_indagini_rx.value = 'S';
	else
		doc.haltre_indagini_rx.value = 'N';		
		
	if(doc.altre_indagini_eco.checked == 1)
		doc.haltre_indagini_eco.value = 'S';
	else
		doc.haltre_indagini_eco.value = 'N';		
		
	if(doc.altre_indagini_no.checked == 1)
		doc.haltre_indagini_no.value = 'S';
	else
		doc.haltre_indagini_no.value = 'N';			
	
	if(doc.provenienza.value == 'R'){
		if(doc.appropriato[0].checked == 1)
			doc.happropriato.value = 'S';
		if(doc.appropriato[1].checked == 1)
			doc.happropriato.value = 'N';
	}
		
	if(doc.hiden_medr.value == '')
	{
		mancano += '- MEDICO CHE ESEGUE LA VALUTAZIONE\n';//alert(ritornaJsMsg("alert_med_r"));//Prego,specificare il medico che esegue la valutazione radiologica
	}
	
	if(doc.iden_tipo_inv.value == '')
	{
		mancano += '- MEDICO CHE HA PRESCRITTO L\'ESAME\n';//alert(ritornaJsMsg("alert_med_i"));//Prego,specificare il medico che ha prescritto l''esame
	}	
	/*if(doc.inviante.value == ''){
		alert(ritornaJsMsg("alert_med_in"));
		doc.inviante.focus();
		return;	
	}*/	
	if(doc.htipo_esame.value == '')
	{
		mancano += '- PRIMA DIAGNOSI O CONTROLLO\n';//alert(ritornaJsMsg("alert_tipo_esame"));//Prego, specificare se si tratta di prima diagnosi o controllo
	}	
	
	if(doc.hspecifica_quesito.value == '')
	{
		mancano += '- QUESITO DIAGNOSTICO\n';//alert(ritornaJsMsg("alert_sq"));//Prego,specificare il quesito diagnostico
	}		
	
	if(!doc.altre_indagini_pe.checked && !doc.altre_indagini_tc.checked && !doc.altre_indagini_rx.checked && !doc.altre_indagini_eco.checked  && !doc.altre_indagini_no.checked)
	{
		mancano += '- ALTRE INDAGINI\n';//alert(ritornaJsMsg("alert_indagini"));//Prego,specificate le altre indagini eseguite per medesimo problema clinico
	}
	
	if(doc.descr_esame1.value == '')
		doc.hiden_esa.value = '';
	if(doc.descr_esame2.value == '')
		doc.hiden_esa2.value = '';
	if(doc.descr_esame3.value == '')
		doc.hiden_esa3.value = '';	
		
	if((doc.hiden_esa.value == '') && (doc.hiden_esa2.value == '') && (doc.hiden_esa3.value == '') && (doc.esame_richiesto_altro.value == '')){
		mancano += '- ESAME RICHIESTO\n';//alert(ritornaJsMsg("alert_esame_richiesto"));//Prego,indicare l''esame richiesto
	}			
	
	if(doc.descr_esame4.value == '')
		doc.hiden_esa4.value = '';
	if(doc.descr_esame5.value == '')
		doc.hiden_esa5.value = '';
	if(doc.descr_esame6.value == '')
		doc.hiden_esa6.value = '';	
	if ((doc.hiden_esa4.value == '') && (doc.hiden_esa5.value == '') && (doc.hiden_esa6.value == '') && (doc.esame_eseguito_altro.value == ''))
	{
		mancano += '- ESAME ESEGUITO/PRENOTATO\n';//alert(ritornaJsMsg("alert_esame_eseguito"));//Prego,specificare l''esame eseguito/prenotato
	}			
	if(doc.descr_sintomo.value == '')
		doc.cod_sintomo.value = '';
	if(doc.descr_sintomo2.value == '')
		doc.cod_sintomo2.value = '';
		
	if(doc.cod_sintomo.value == '' && doc.cod_sintomo2.value == '')
	{
		mancano += '- SINTOMO/PROBLEMA CLINICO\n';//alert(ritornaJsMsg("alert_sintomi"));//Prego, indicare sintomo/problema clinico
	}		
	
	if(doc.priorita.value == '')
	{
		mancano += '- PRIORITA\'\n';//alert(ritornaJsMsg("alert_priorita"));//Prego,specificare la priorità
	}
	
	if(doc.provenienza.value == 'R')
	{
		if(doc.happropriato.value == '')
		{
			mancano += '- VALUTAZIONE DEL RADIOLOGO\n';//alert(ritornaJsMsg("alert_appropriato"));//Prego, indicare la valutazione del radiologo
		}
	}
	
	if(mancano != '')
	{
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	
	DOC_UPD.tipo_connessione.value = 'DATA';
	
	if(DOC_UPD.tipo_operazione.value == 'INS')
		insert_tab_app_filtro_rm_tc();
	else
		if(DOC_UPD.tipo_operazione.value == 'UPD')
			update_tab_app_filtro_rm_tc();
		
}

/*
	Funzione di inserimento dentro la tabella TAB_APP_FILTRO_RM_TC
	ed alla tabella APPROPRIATEZZA_ESAME.
	Inoltre verrà effettuata un'update sulla tabella ESAMI per modificare il 
	medico refertante
*/
function insert_tab_app_filtro_rm_tc()
{
	var doc = document.form_appr_filtro_rm_tc;
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	/*Insert nella tabella APPROPRIATEZZA_ESAME*/
	var insert_appr = "insert into appropriatezza_esame (ute_ins, iden_esame, specifica_quesito, cod_scheda";
	if(doc.provenienza.value == 'R'){
		insert_appr += ", appropriato";
	}
	insert_appr += ") values('";
	insert_appr += doc.iden_per.value + "', '";																							
	insert_appr += doc.iden_esame.value + "', '" + doc.hspecifica_quesito.value + "', 'TAB_APP_FILTRO_RM_TC'";				
	if(doc.provenienza.value == 'R')
		insert_appr += ",'" + doc.happropriato.value + "'";
    insert_appr += ")";		

	/*Insert nella tabella specifica TAB_APP_FILTRO_RM_TC*/
	var insert_filtro = 'insert into tab_app_filtro_rm_tc (iden_esame, iden_tipo_inv, inviante, iden_tipo_prop, proponente, ';
	insert_filtro += 'tipo_esame, altre_indagini_pe, altre_indagini_tc, altre_indagini_rx, altre_indagini_eco, ';													
	insert_filtro += 'altre_indagini_no, note, iden_esame_richiesto1, iden_esame_richiesto2, iden_esame_richiesto3, ';
	insert_filtro += 'esame_richiesto_altro, iden_esame_eseguito1, iden_esame_eseguito2, iden_esame_eseguito3, ';
	insert_filtro += "esame_eseguito_altro, cod_sintomo, cod_sintomo2, priorita) values(";
	insert_filtro += doc.iden_esame.value + ", " + verifica_campo(doc.iden_tipo_inv.value) + ", " + verifica_campo(doc.inviante.value) + ", ";
	insert_filtro += verifica_campo(doc.iden_tipo_prop.value) + ", " + verifica_campo(doc.proponente.value) + ", " + verifica_campo(doc.htipo_esame.value) + ", ";
	insert_filtro += verifica_campo(doc.haltre_indagini_pe.value) + ", " + verifica_campo(doc.haltre_indagini_tc.value) + ", " + verifica_campo(doc.haltre_indagini_rx.value) + ", ";
	insert_filtro += verifica_campo(doc.haltre_indagini_eco.value) + ", " +  verifica_campo(doc.haltre_indagini_no.value) + ", ";
	insert_filtro += verifica_campo(doc.note.value) +  ", " +  verifica_campo(doc.hiden_esa.value) + ", ";
	insert_filtro += verifica_campo(doc.hiden_esa2.value) +  ", " +  verifica_campo(doc.hiden_esa3.value) + ", " + verifica_campo(doc.esame_richiesto_altro.value) + ", ";
	insert_filtro += verifica_campo(doc.hiden_esa4.value) +  ", " +  verifica_campo(doc.hiden_esa5.value) + ", " + verifica_campo(doc.hiden_esa6.value) + ", ";
	insert_filtro += verifica_campo(doc.esame_eseguito_altro.value) +  ", " +  verifica_campo(doc.cod_sintomo.value) + ", " + verifica_campo(doc.cod_sintomo2.value) + ", ";
	insert_filtro += verifica_campo(doc.priorita.value) + ")";

	/*
		provenienza = 'E' o 'R'						  => ESAMI.stato = Y (appropriatezza)   
													  
		or provenienza = 'EM'						  => ESAMI.stato = E + Q (esame eseguito + esame appropriato)
	*/
	if(doc.provenienza.value == 'A'  || doc.provenienza.value == 'R')
		DOC_UPD.stato.value = 'Y';//appropriatezza	

	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	DOC_UPD.query_tab_specifica.value = insert_filtro;
	DOC_UPD.query_appropriatezza_esame.value = insert_appr;
	DOC_UPD.provenienza.value = doc.provenienza.value;
	/*
	Update sulla tabella esami per cambiare il medico refertante
	*/
	//alert('MED R: ' + doc.hiden_medr.value);
	var upd_esami = '';
	if(doc.hiden_medr.value != '' && doc.hiden_medr.value != '0')
		upd_esami = 'update esami set iden_medr = ' + doc.hiden_medr.value + ' where iden = ' + doc.iden_esame.value;
	
	DOC_UPD.query.value = upd_esami;
	
	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	

	DOC_UPD.submit();
	
	
	/*if(doc.provenienza.value == 'A')
		chiudi_tab_app_filtro_rm_tc();
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_filtro);
		dwr.engine.setAsync(true);
	}*/
}//insert


function update_tab_app_filtro_rm_tc()
{
	var doc = document.form_appr_filtro_rm_tc;
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	/*Update sulla tabella generica APPROPRIATEZZA_ESAME*/
	var upd_appr = "update appropriatezza_esame set specifica_quesito = '";
	upd_appr += doc.hspecifica_quesito.value + "' ";
	if(doc.provenienza.value == 'R')
		upd_appr += ", appropriato = '" + doc.happropriato.value + "' ";
	upd_appr += ", ute_mod = '" + doc.iden_per.value + "' ";
	upd_appr += 'where iden_esame = ' + doc.iden_esame.value;
	
	/*Update sulla tabella specifica TAB_APP_FILTRO_RM_TC*/
	var upd_filtro = 'update tab_app_filtro_rm_tc set ';
	upd_filtro += "iden_tipo_inv = " + verifica_campo(doc.iden_tipo_inv.value) + ", ";
	upd_filtro += "inviante = " + verifica_campo(doc.inviante.value) + ", ";
	upd_filtro += "iden_tipo_prop = " + verifica_campo(doc.iden_tipo_prop.value) + ", ";
	upd_filtro += "proponente = " + verifica_campo(doc.proponente.value) + ", ";
	upd_filtro += "tipo_esame = " + verifica_campo(doc.htipo_esame.value) + ", ";
	upd_filtro += "altre_indagini_pe = " + verifica_campo(doc.haltre_indagini_pe.value) + ", ";
	upd_filtro += "altre_indagini_tc = " + verifica_campo(doc.haltre_indagini_tc.value) + ", ";
	upd_filtro += "altre_indagini_rx = " + verifica_campo(doc.haltre_indagini_rx.value) + ", ";
	upd_filtro += "altre_indagini_eco = " + verifica_campo(doc.haltre_indagini_eco.value) + ", ";
	upd_filtro += "altre_indagini_no = " + verifica_campo(doc.haltre_indagini_no.value) + ", ";
	upd_filtro += "note = " + verifica_campo(doc.note.value) + ", ";
	upd_filtro += "iden_esame_richiesto1 = " + verifica_campo(doc.hiden_esa.value) + ", ";
	upd_filtro += "iden_esame_richiesto2 = " + verifica_campo(doc.hiden_esa2.value) + ", ";
	upd_filtro += "iden_esame_richiesto3 = " + verifica_campo(doc.hiden_esa3.value) + ", ";
	upd_filtro += "esame_richiesto_altro = " + verifica_campo(doc.esame_richiesto_altro.value) + ", ";
	upd_filtro += "iden_esame_eseguito1 = " + verifica_campo(doc.hiden_esa4.value) + ", ";
	upd_filtro += "iden_esame_eseguito2 = " + verifica_campo(doc.hiden_esa5.value) + ", ";
	upd_filtro += "iden_esame_eseguito3 = " + verifica_campo(doc.hiden_esa6.value) + ", ";
	upd_filtro += "esame_eseguito_altro = " + verifica_campo(doc.esame_eseguito_altro.value) + ", ";
	upd_filtro += "cod_sintomo = " + verifica_campo(doc.cod_sintomo.value) + ", ";
	upd_filtro += "cod_sintomo2 = " + verifica_campo(doc.cod_sintomo2.value) + ", ";
	upd_filtro += "priorita = " + verifica_campo(doc.priorita.value) + "  ";
	upd_filtro += 'where iden_esame in (' + doc.iden_esame.value + ')';
	/*
	Update sulla tabella esami per cambiare il medico refertante
	*/
	var upd_esami = 'update esami set iden_medr = ' + doc.hiden_medr.value + ' where iden = ' + doc.iden_esame.value;

	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.query_tab_specifica.value = upd_filtro;
	DOC_UPD.query_appropriatezza_esame.value = upd_appr;
	DOC_UPD.query.value = upd_esami;
	DOC_UPD.iden_esame.value = doc.iden_esame.value;


	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
	
	/*Insert nella tabella APPROPRIATEZZA_ESAME*/
	var insert_appr = "insert into appropriatezza_esame (ute_ins, iden_esame, specifica_quesito, cod_scheda";
	if(doc.provenienza.value == 'R'){
		insert_appr += ", appropriato";
	}
	insert_appr += ") values('";
	insert_appr += doc.iden_per.value + "', '";																							
	insert_appr += doc.iden_esame.value + "', '" + doc.hspecifica_quesito.value + "', 'TAB_APP_FILTRO_RM_TC'";				
	if(doc.provenienza.value == 'R')
		insert_appr += ",'" + doc.happropriato.value + "'";
    insert_appr += ")";		

	/*Insert nella tabella specifica TAB_APP_FILTRO_RM_TC*/
	var insert_filtro = 'insert into tab_app_filtro_rm_tc (iden_esame, iden_tipo_inv, inviante, iden_tipo_prop, proponente, ';
	insert_filtro += 'tipo_esame, altre_indagini_pe, altre_indagini_tc, altre_indagini_rx, altre_indagini_eco, ';													
	insert_filtro += 'altre_indagini_no, note, iden_esame_richiesto1, iden_esame_richiesto2, iden_esame_richiesto3, ';
	insert_filtro += 'esame_richiesto_altro, iden_esame_eseguito1, iden_esame_eseguito2, iden_esame_eseguito3, ';
	insert_filtro += "esame_eseguito_altro, cod_sintomo, cod_sintomo2, priorita) values(";
	insert_filtro += doc.iden_esame.value + ", " + verifica_campo(doc.iden_tipo_inv.value) + ", " + verifica_campo(doc.inviante.value) + ", ";
	insert_filtro += verifica_campo(doc.iden_tipo_prop.value) + ", " + verifica_campo(doc.proponente.value) + ", " + verifica_campo(doc.htipo_esame.value) + ", ";
	insert_filtro += verifica_campo(doc.haltre_indagini_pe.value) + ", " + verifica_campo(doc.haltre_indagini_tc.value) + ", " + verifica_campo(doc.haltre_indagini_rx.value) + ", ";
	insert_filtro += verifica_campo(doc.haltre_indagini_eco.value) + ", " +  verifica_campo(doc.haltre_indagini_no.value) + ", ";
	insert_filtro += verifica_campo(doc.note.value) +  ", " +  verifica_campo(doc.hiden_esa.value) + ", ";
	insert_filtro += verifica_campo(doc.hiden_esa2.value) +  ", " +  verifica_campo(doc.hiden_esa3.value) + ", " + verifica_campo(doc.esame_richiesto_altro.value) + ", ";
	insert_filtro += verifica_campo(doc.hiden_esa4.value) +  ", " +  verifica_campo(doc.hiden_esa5.value) + ", " + verifica_campo(doc.hiden_esa6.value) + ", ";
	insert_filtro += verifica_campo(doc.esame_eseguito_altro.value) +  ", " +  verifica_campo(doc.cod_sintomo.value) + ", " + verifica_campo(doc.cod_sintomo2.value) + ", ";
	insert_filtro += verifica_campo(doc.priorita.value) + ")";
	
	DOC_UPD.Iquery_tab_specifica.value = insert_filtro;
	DOC_UPD.Iquery_appropriatezza_esame.value = insert_appr;
	DOC_UPD.provenienza.value = doc.provenienza.value;
	/**/

	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	
	
	DOC_UPD.submit();
	
	/*if(doc.provenienza.value == 'A')
		chiudi_tab_app_filtro_rm_tc();
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_filtro);	
		dwr.engine.setAsync(true);
	}*/	
}//update


/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_filtro(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');

	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		if(opener.baseUser.OB_ESECUZIONE == 'S')
		{
			/*non ci sono più schede di appropriatezza da inserire*/
			var fin_scheda_esame_filtro = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
			
			
			if(fin_scheda_esame_filtro)
				fin_scheda_esame_filtro.focus();
			else
				fin_scheda_esame_filtro = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
			fin_scheda_esame_filtro.opener = opener;
		}
	}
	else
	{
		/*altra scheda di appropriatezza da inserire.*/
		var finestra_filtro = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_filtro_rm_tc.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");

		if(finestra_filtro)
			finestra_filtro.focus();
		else
			finestra_filtro = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_filtro_rm_tc.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");


		finestra_filtro.opener = opener;
	}
	
	self.close();
}

function chiudi_tab_app_filtro_rm_tc(iden_esami)
{
	var doc = document.form_appr_filtro_rm_tc;
	//alert('appropriatezza_esame.js : ' + doc.provenienza.value);
	if(doc.provenienza.value == 'E' || doc.provenienza.value == 'R' || doc.provenienza.value == 'EM')
	{
		annullamentoGestione.annullaAppr(iden_esami, aggiornamento);
	}
	else
		if(doc.provenienza.value == 'A')
		{
			/*Caso dell'appropriatezza. Esecuzione->Appropriatezza*/
			opener.aggiorna();
			try{
				opener.parent.worklistTopFrame.applica(); 
			}
			catch(e){
			}
			self.close();
		}
}

function aggiornamento(message)
{
	opener.aggiorna();
	try{
		opener.parent.worklistTopFrame.applica(); 
	}
	catch(e){
	}
	self.close();	
}


function after_update()
{
	var doc = document.form_appr_obbl;
	if(doc.provenienza.value == 'A' || doc.provenienza.value == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_filtro);	
		dwr.engine.setAsync(true);
	}
}