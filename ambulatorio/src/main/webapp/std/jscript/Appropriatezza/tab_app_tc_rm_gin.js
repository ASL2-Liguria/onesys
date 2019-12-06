/******************************************************************************************/
/*							  	TAB_APP_TC_RM_GIN									      */
/******************************************************************************************/		
function registra_tab_app_tc_rm_gin(provenienza)
{
	var doc = document.form_appr_obbl;	
	var mancano = registra_appropriatezza_esame('tab_app_tc_rm_gin', 'S', 'S', 'S', 'S', 'S');
	
	if(doc.trauma[0].checked == 1)
		doc.htrauma.value = 'S';	
		
	if(doc.trauma[1].checked == 1)
		doc.htrauma.value = 'N';
	
	if(doc.eseguito_rx[0].checked == 1)
		doc.heseguito_rx.value = 'S';
	if(doc.eseguito_rx[1].checked == 1)
		doc.heseguito_rx.value = 'N';
	
	if(doc.sospetta_inf[0].checked == 1)
		doc.hsospetta_inf.value = 'S';
	if(doc.sospetta_inf[1].checked == 1)
		doc.hsospetta_inf.value = 'N';
	
	if(doc.sospetta_frat[0].checked == 1)
		doc.hsospetta_frat.value = 'S';
	if(doc.sospetta_frat[1].checked == 1)
		doc.hsospetta_frat.value = 'N';
	
	if(doc.perdita_peso[0].checked == 1)
		doc.hperdita_peso.value = 'S';
	if(doc.perdita_peso[1].checked == 1)
		doc.hperdita_peso.value = 'N';
	
	if(doc.pre_operatorio[0].checked == 1)
		doc.hpre_operatorio.value = 'S';
	if(doc.pre_operatorio[1].checked == 1)
		doc.hpre_operatorio.value = 'N';
		
	if(doc.post_operatorio[0].checked == 1)
		doc.hpost_operatorio.value = 'S';
	if(doc.post_operatorio[1].checked == 1)
		doc.hpost_operatorio.value = 'N';	
	
	//if(registra_appropriatezza_esame('tab_app_tc_rm_gin', 'S', 'S', 'S', 'S', 'S'))
	//{
		if(doc.htrauma.value == '')
		{
			mancano += '- TRAUMA\n';//alert(ritornaJsMsg("alert_trauma"));//Prego, inserire indicazioni sul trauma
		}
		
		if(doc.hsospetta_inf.value == '')
		{
			mancano += '- INFEZIONE\n';//alert(ritornaJsMsg("alert_sospetta_inf"));//Prego, inserire indicazioni sull''infezione
		}
		
		if(doc.hsospetta_frat.value == '')
		{
			mancano += '- FRATTURA\n';//alert(ritornaJsMsg("alert_sospetta_frat"));//Prego, inserire indicazioni sulla frattura
		}
		
		if(doc.hperdita_peso.value == '')
		{
			mancano += '- PESO\n';//alert(ritornaJsMsg("alert_perdita_peso"));//Prego, inserire indicazioni sul peso
		}
		
		if(doc.heseguito_rx.value == '')
		{
			mancano += '- ESECUZIONE DELL\'RX STANDARD DELL\'ARTICOLAZIONE\n';//alert(ritornaJsMsg("alert_eseguito_rx"));//Prego, indicare se è stato eseguito RX standard dell''articolazione
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
		
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_TC_RM_GIN', 'S', 'S', 'S', 'S', 'S');
	//}//if
}


function insert_tab_app_tc_rm_gin(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var doc = document.form_appr_obbl;		
	var insert = 'insert into tab_app_tc_rm_gin ';	
	insert += "(iden_esame, trauma, sospetta_inf, sospetta_frat, perdita_peso, eseguito_rx, pre_operatorio, post_operatorio, tipo_esame, grado_urgenza)";
	insert += " values (";
	insert += doc.iden_esame.value + ", ";					
	insert += verifica_campo(doc.htrauma.value) + ", " + verifica_campo(doc.hsospetta_inf.value) + ", " + verifica_campo(doc.hsospetta_frat.value) + ", ";					
	insert += verifica_campo(doc.hperdita_peso.value) + ", " + verifica_campo(doc.heseguito_rx.value) + ", ";
	insert += verifica_campo(doc.hpre_operatorio.value) + ", " + verifica_campo(doc.hpost_operatorio.value) + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", " + verifica_campo(doc.hgrado_urgenza.value) + ")";
	
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
	
	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	
	
	DOC_UPD.submit();
	
	/*if(provenienza == 'A' || provenienza == 'R')
		chiudi();
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_tc_rm_gin);	
		dwr.engine.setAsync(true);
	}*/
}


function update_tab_app_tc_rm_gin(provenienza)
{
	var doc = document.form_appr_obbl;		
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_tc_rm_gin set ';
	update += "trauma = " + verifica_campo(doc.htrauma.value) + ", ";
	update += "sospetta_inf = " + verifica_campo(doc.hsospetta_inf.value) + ", ";
	update += "sospetta_frat = " + verifica_campo(doc.hsospetta_frat.value) + ", ";
	update += "perdita_peso = " + verifica_campo(doc.hperdita_peso.value) + ", ";
	update += "eseguito_rx = " + verifica_campo(doc.heseguito_rx.value) + ", ";
	update += "pre_operatorio = " + verifica_campo(doc.hpre_operatorio.value) + ", ";
	update += "post_operatorio = " + verifica_campo(doc.hpost_operatorio.value) + ", ";
	update += "tipo_esame = " + verifica_campo(doc.htipo_esame.value) + ", ";
	update += "grado_urgenza = " + verifica_campo(doc.hgrado_urgenza.value) + " ";
	update += "where iden_esame in (" + doc.iden_esame.value + ")";

	DOC_UPD.query_tab_specifica.value = update;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.tipo_connessione.value = 'DATA';
	
	/*25.03.2008*/
	if(doc.happropriato.value == 'S')
		DOC_UPD.stato.value = 'Y';
	if(doc.happropriato.value == 'N')
		DOC_UPD.stato.value = 'Z';

	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
	var insert = 'insert into tab_app_tc_rm_gin ';	
	insert += "(iden_esame, trauma, sospetta_inf, sospetta_frat, perdita_peso, eseguito_rx, pre_operatorio, post_operatorio, tipo_esame, grado_urgenza)";
	insert += " values (";
	insert += doc.iden_esame.value + ", ";					
	insert += verifica_campo(doc.htrauma.value) + ", " + verifica_campo(doc.hsospetta_inf.value) + ", " + verifica_campo(doc.hsospetta_frat.value) + ", ";					
	insert += verifica_campo(doc.hperdita_peso.value) + ", " + verifica_campo(doc.heseguito_rx.value) + ", ";
	insert += verifica_campo(doc.hpre_operatorio.value) + ", " + verifica_campo(doc.hpost_operatorio.value) + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", " + verifica_campo(doc.hgrado_urgenza.value) + ")"; 
	
	DOC_UPD.Iquery_tab_specifica.value = insert;
	DOC_UPD.Iquery_appropriatezza_esame.value = I_appropriatezza_esame;
	DOC_UPD.provenienza.value = provenienza;
	/**/

	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	/*20080609*/
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_tc_rm_gin);
		dwr.engine.setAsync(true);
	}*/
}

/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_tc_rm_gin(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame)
			fin_scheda_esame.focus();
		else
			fin_scheda_esame = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		
		fin_scheda_esame.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra)
			finestra.focus();
		else
			finestra = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		
		finestra.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_tc_rm_gin);
		dwr.engine.setAsync(true);
	}
}