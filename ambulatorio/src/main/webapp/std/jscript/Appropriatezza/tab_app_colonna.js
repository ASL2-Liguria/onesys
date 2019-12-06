/******************************************************************************************/
/*							  	TAB_APP_COLONNA      								      */
/******************************************************************************************/
function registra_tab_app_colonna(provenienza)
{
	var mancano = registra_appropriatezza_esame('tab_app_colonna', 'S', 'S', 'S', 'N', 'S');
	var doc = document.form_appr_obbl;	
	
	if(doc.trauma[0].checked == 1)
		doc.htrauma.value = 'S';
	if(doc.trauma[1].checked == 1)
		doc.htrauma.value = 'N';
	if(doc.trauma_recente.checked == true)
		doc.htrauma_recente.value = 'S';
	else
		doc.htrauma_recente.value = 'N';
	if(doc.trauma_pregresso.checked == true)
		doc.htrauma_pregresso.value = 'S';
	else
		doc.htrauma_pregresso.value = 'N';
	if(doc.perdita_peso[0].checked == 1)
		doc.hperdita_peso.value = 'S';
	if(doc.perdita_peso[1].checked == 1)
		doc.hperdita_peso.value = 'N';	
	
	if(doc.dolore_rachide[0].checked == 1)
		doc.hdolore_rachide.value = 'S';
	if(doc.dolore_rachide[1].checked == 1)
		doc.hdolore_rachide.value = 'N';
		
	if(doc.dolore_rachide_mese[0].checked == 1)
		doc.hdolore_rachide_piu_mese.value = 'S';
	if(doc.dolore_rachide_mese[1].checked == 1)
		doc.hdolore_rachide_meno_mese.value = 'S';	
		
	if(doc.dolore_radicolare[0].checked == 1)
		doc.hdolore_radicolare.value = 'S';
	if(doc.dolore_radicolare[1].checked == 1)
		doc.hdolore_radicolare.value = 'N';
		
	if(doc.dolore_radicolare_mese[0].checked == 1)
		doc.hdolore_radicolare_piu_mese.value = 'S';
	if(doc.dolore_radicolare_mese[1].checked == 1)
		doc.hdolore_radicolare_meno_mese.value = 'S';	
	
	if(doc.pre_operatorio[0].checked == 1)
		doc.hpre_operatorio.value = 'S';
	if(doc.pre_operatorio[1].checked == 1)
		doc.hpre_operatorio.value = 'N';	
		
	if(doc.post_operatorio[0].checked == 1)
		doc.hpost_operatorio.value = 'S';
	if(doc.post_operatorio[1].checked == 1)
		doc.hpost_operatorio.value = 'N';	
		
	//if(registra_appropriatezza_esame('tab_app_colonna', 'S', 'S', 'S', 'N', 'S'))
	//{
		if(doc.htrauma.value == '')
		{
			mancano += '- INDICAZIONI SUL TRAUMA\n';//alert(ritornaJsMsg("alert_trauma"));//Prego, inserire indicazioni sul trauma
		}	
		
		if(doc.hperdita_peso.value == '')
		{
			mancano += '- INDICAZIONI SUL PESO\n';//alert(ritornaJsMsg("alert_perdita_peso"));//Prego, inserire indicazioni sul peso
		}
		
		if(doc.hdolore_rachide.value == '')
		{
			mancano += '- INDICAZIONI SU DOLORE RACHIDE\n';//alert(ritornaJsMsg("alert_dolore_rachide"));//Prego, inserire indicazione su dolore rachide
		}
		
		if(doc.hdolore_rachide.value == 'S' && doc.hdolore_rachide_piu_mese.value == 'N' && doc.hdolore_rachide_meno_mese.value == 'N')
		{
			mancano += '- DURATA SINTOMI DOLORE RACHIDE\n';//alert(ritornaJsMsg("alert_dol_rach_mese"));//Prego, inserire durata sintomi del dolore rachide
		}
		
		if(doc.hdolore_radicolare.value == '')
		{
			mancano += '- INDICAZIONI SUL DOLORE RADICOLARE\n';//alert(ritornaJsMsg("alert_dolore_radicolare"));//Prego, inserire indicazione sul dolore radicolare
		}
		
		if(doc.hdolore_radicolare.value == 'S' && doc.hdolore_radicolare_piu_mese.value == 'N' && doc.hdolore_radicolare_meno_mese.value == 'N')
		{
			mancano += '- DURATA SINTOMI DOLORE RADICOLARE\n';//alert(ritornaJsMsg("alert_dol_rad_mese"));//Prego, inserire la durata dei sintomi del dolore radicolare
		}
		
		if(doc.hpre_operatorio.value == '')
		{
			mancano += '- ESAME PRELIMINARE\n';//alert(ritornaJsMsg("alert_pre_operatorio"));//Prego, indicare se l''esame è preliminare
		}
		
		if(doc.hpost_operatorio.value == '')
		{
			mancano += '- INDAGINE POST-OPERATORIA\n';//alert(ritornaJsMsg("alert_post_operatorio"));//Prego, indicare se l''indagine è post operatoria
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
		
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_COLONNA', 'S', 'S', 'S', 'N', 'S');
	//}//if
}

function insert_tab_app_colonna(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var insert = 'insert into tab_app_colonna ';
	insert += "(iden_esame, trauma, grado_urgenza, perdita_peso, dolore_rachide, dolore_rachide_piu_mese, dolore_rachide_meno_mese, dolore_radicolare, dolore_radicolare_piu_mese, dolore_radicolare_meno_mese, pre_operatorio, post_operatorio, trauma_recente, trauma_pregresso) ";
	insert += "values (";
	insert +=  doc.iden_esame.value  + ", '" + doc.htrauma.value + "', " + verifica_campo(doc.hgrado_urgenza.value) + ", '";				   
	insert +=  doc.hperdita_peso.value + "', '" + doc.hdolore_rachide.value + "', " + verifica_campo(doc.hdolore_rachide_piu_mese.value) + ", ";
	insert +=  verifica_campo(doc.hdolore_rachide_meno_mese.value) + ", '" + doc.hdolore_radicolare.value + "', ";
	insert +=  verifica_campo(doc.hdolore_radicolare_piu_mese.value) + ", " + verifica_campo(doc.hdolore_radicolare_meno_mese.value) + ", '";
	insert +=  doc.hpre_operatorio.value + "', '" + doc.hpost_operatorio.value + "', ";
	insert +=  verifica_campo(doc.htrauma_recente.value) + ", " + verifica_campo(doc.htrauma_pregresso.value);
	insert += ")";				
	
	DOC_UPD.query_tab_specifica.value = insert;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	/*
		provenienza = 'E' o 'R'						  => ESAMI.stato = Y (appropriatezza)   
													  
		or provenienza = 'EM'						  => ESAMI.stato = E + Q (esame eseguito + esame appropriato)
	*/
		
	/*25.03.2008*/
	if(doc.happropriato.value == 'S')
		DOC_UPD.stato.value = 'Y';//Esame appropriato	
	if(doc.happropriato.value == 'N')
		DOC_UPD.stato.value = 'Z';//Esame NON appropriato	

	
	
	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.provenienza.value = provenienza;
	
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	
	
	
	DOC_UPD.submit();
	
	/*if(provenienza == 'A' || provenienza == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_colonna);
		dwr.engine.setAsync(true);
	}*/
}

function update_tab_app_colonna(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_colonna ';
	update += "set trauma = '" + doc.htrauma.value + "', ";
	update += "grado_urgenza = " + verifica_campo(doc.hgrado_urgenza.value) + ", ";
	update += "perdita_peso = '" + doc.hperdita_peso.value + "', ";
	update += "dolore_rachide = '" + doc.hdolore_rachide.value + "', ";
	update += "dolore_rachide_piu_mese = " + verifica_campo(doc.hdolore_rachide_piu_mese.value) + ", ";
	update += "dolore_rachide_meno_mese = " + verifica_campo(doc.hdolore_rachide_meno_mese.value) + ", ";
	update += "dolore_radicolare = '" + doc.hdolore_radicolare.value + "', ";
	update += "dolore_radicolare_piu_mese = " + verifica_campo(doc.hdolore_radicolare_piu_mese.value) + ", ";
	update += "dolore_radicolare_meno_mese = " + verifica_campo(doc.hdolore_radicolare_meno_mese.value) + ", ";
	update += "post_operatorio = '" + doc.hpost_operatorio.value + "', ";
	update += "pre_operatorio = '" + doc.hpre_operatorio.value + "', ";
	update += "trauma_recente = " + verifica_campo(doc.htrauma_recente.value) + ", ";
	update += "trauma_pregresso = " + verifica_campo(doc.htrauma_pregresso.value);
	update += " where iden_esame in (" + doc.iden_esame.value + ")";
	
	DOC_UPD.query_tab_specifica.value = update;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.tipo_connessione.value = 'DATA';

	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	/*25.03.2008*/
	if(doc.happropriato.value == 'S')
		DOC_UPD.stato.value = 'Y';
	if(doc.happropriato.value == 'N')
		DOC_UPD.stato.value = 'Z';
	
	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
	var insert = 'insert into tab_app_colonna ';
	insert += "(iden_esame, trauma, grado_urgenza, perdita_peso, dolore_rachide, dolore_rachide_piu_mese, dolore_rachide_meno_mese, dolore_radicolare, dolore_radicolare_piu_mese, dolore_radicolare_meno_mese, pre_operatorio, post_operatorio, trauma_recente, trauma_pregresso) ";
	insert += "values (";
	insert +=  doc.iden_esame.value  + ", '" + doc.htrauma.value + "', " + verifica_campo(doc.hgrado_urgenza.value) + ", '";				   
	insert +=  doc.hperdita_peso.value + "', '" + doc.hdolore_rachide.value + "', " + verifica_campo(doc.hdolore_rachide_piu_mese.value) + ", ";
	insert +=  verifica_campo(doc.hdolore_rachide_meno_mese.value) + ", '" + doc.hdolore_radicolare.value + "', ";
	insert +=  verifica_campo(doc.hdolore_radicolare_piu_mese.value) + ", " + verifica_campo(doc.hdolore_radicolare_meno_mese.value) + ", '";
	insert +=  doc.hpre_operatorio.value + "', '" + doc.hpost_operatorio.value + "', ";
	insert +=  verifica_campo(doc.htrauma_recente.value) + ", " + verifica_campo(doc.htrauma_pregresso.value);
	insert += ")";				
	
	DOC_UPD.Iquery_tab_specifica.value = insert;
	DOC_UPD.Iquery_appropriatezza_esame.value = I_appropriatezza_esame;
	DOC_UPD.provenienza.value = provenienza;
	/**/
	
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	
	
	DOC_UPD.submit();
	
	/*if(provenienza == 'A'  || provenienza == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_colonna);	
		dwr.engine.setAsync(true);
	}*/
}


/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_colonna(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_colo = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_colo)
			fin_scheda_esame_colo.focus();
		else
			fin_scheda_esame_colo = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		fin_scheda_esame_colo.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		//if(idenEsame_elencoEsami_statiEsami[0] == 'STOP')
			//return;
		//else
		//{
			var finestra_colo = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
			
			if(finestra_colo)
				finestra_colo.focus();
			else
				finestra_colo = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
			
			finestra_colo.opener = opener;
		//}
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_colonna);	
		dwr.engine.setAsync(true);
	}
}