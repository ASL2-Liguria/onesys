/******************************************************************************************/
/*							  	TAB_APP_RX_PIEDE    								      */
/******************************************************************************************/	
function registra_tab_app_rx_piede(provenienza)
{
	var doc = document.form_appr_obbl;	
	var mancano = registra_appropriatezza_esame('tab_app_rx_piede', 'S', 'S', 'S', 'S', 'S');
	
	if(doc.cammina[0].checked == 1)
		doc.hcammina.value = 'S';
	if(doc.cammina[1].checked == 1)
		doc.hcammina.value = 'N';
	if(doc.tumefazione[0].checked == 1)
		doc.htumefazione.value = 'S';
	if(doc.tumefazione[1].checked == 1)
		doc.htumefazione.value = 'N';	
		
	//if(registra_appropriatezza_esame('tab_app_rx_piede', 'S', 'S', 'S', 'S', 'S'))
	//{
		if(doc.hcammina.value == '')
		{
			mancano += '- PAZIENTE IN GRADO DI CAMMINARE\n';//alert(ritornaJsMsg("alert_cammina"));//Prego, inserire se il paziente è in grado di camminare
		}
		
		if(doc.htumefazione.value == '')
		{
			mancano += '- TUMEFAZIONE EDEMATOSA\n';//alert(ritornaJsMsg("alert_tumefazione"));//Prego, indicare se presente tumefazione edematosa
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
	
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_RX_PIEDE', 'S', 'S', 'S', 'S', 'S');
	//}//if	
}

function insert_tab_app_rx_piede(provenienza)
{
	var doc = document.form_appr_obbl;		
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var insert = 'insert into tab_app_rx_piede ';	
	insert += " (iden_esame, cammina, tumefazione, tipo_esame, grado_urgenza) ";	
	insert += " values (";
	insert += doc.iden_esame.value + ", ";				
	insert += verifica_campo(doc.hcammina.value) + ", ";
	insert += verifica_campo(doc.htumefazione.value) + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", ";
	insert += verifica_campo(doc.hgrado_urgenza.value) + ")";
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_rx_piede);		
		dwr.engine.setAsync(true);
	}*/
}


function update_tab_app_rx_piede(provenienza)
{
	var doc = document.form_appr_obbl;		
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_rx_piede set ';
	update += "cammina = " + verifica_campo(doc.hcammina.value) + ", ";
	update += "tumefazione = " + verifica_campo(doc.htumefazione.value) + ", ";
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
	var insert = 'insert into tab_app_rx_piede ';	
	insert += " (iden_esame, cammina, tumefazione, tipo_esame, grado_urgenza) ";	
	insert += " values (";
	insert += doc.iden_esame.value + ", ";				
	insert += verifica_campo(doc.hcammina.value) + ", ";
	insert += verifica_campo(doc.htumefazione.value) + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", ";
	insert += verifica_campo(doc.hgrado_urgenza.value) + ")";   
	
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
	
	/*if(provenienza == 'A' || provenienza == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_rx_piede);
		dwr.engine.setAsync(true);
	}*/
}

/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_rx_piede(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_piede = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_piede)
			fin_scheda_esame_piede.focus();
		else
			fin_scheda_esame_piede = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		fin_scheda_esame_piede.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_piede = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra_piede)
			finestra_piede.focus();
		else
			finestra_piede = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");		
		
		finestra_piede.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_rx_piede);
		dwr.engine.setAsync(true);
	}
}