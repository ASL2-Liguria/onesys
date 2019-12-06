function registra_tab_app_altri(provenienza)
{
	var mancano = registra_appropriatezza_esame('TAB_APP_ALTRI', 'S', 'S', 'S', 'S', 'S');
	
	if(mancano != '')
	{
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_ALTRI', 'S', 'S', 'S', 'S', 'S');
}


/*
	Funzione che effettua l'INSERIMENTO in TAB_APP_ALTRI (tabella specifica)
*/
function insert_tab_app_altri(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var doc = document.form_appr_obbl;

	DOC_UPD.tipo_connessione.value = 'DATA';

	var insert = 'insert into tab_app_altri (iden_esame, tipo_esame, grado_urgenza)';

	
	insert += " values ('" +  doc.iden_esame.value + "', '" + doc.htipo_esame.value + "', '" + doc.hgrado_urgenza.value + "')";

	DOC_UPD.query_tab_specifica.value = insert;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	/*
	provenienza = 'E' o 'R'						  => ESAMI.stato = Y (appropriatezza)   
												
	provenienza = 'EM'(esecuzione multipla)  	  => ESAMI.stato = E + Q (esame eseguito + esame appropriato)

	*/

	if(doc.happropriato.value == 'S')
		DOC_UPD.stato.value = 'Y';//Esame appropriato	
	if(doc.happropriato.value == 'N')
		DOC_UPD.stato.value = 'Z';//Esame NON appropriato		


	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.provenienza.value = provenienza;
	
	
	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=800000');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=800000');

	DOC_UPD.submit();
	

	/*if(provenienza == 'A'  || provenienza == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_altri);
		dwr.engine.setAsync(true);
	}*/
}

/*
	UPDATE su TAB_APP_ALTRI
*/
function update_tab_app_altri(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var doc = document.form_appr_obbl;
	var update;
	update = "update tab_app_altri ";
	update += "set tipo_esame = '" + doc.htipo_esame.value + "', ";
	update += "grado_urgenza = '" + doc.hgrado_urgenza.value + "' ";

	update += 'where iden_esame in (' + doc.iden_esame.value + ')';

	DOC_UPD.query_tab_specifica.value = update;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	/*25.03.2008*/
	if(doc.happropriato.value == 'S')
		DOC_UPD.stato.value = 'Y';
	if(doc.happropriato.value == 'N')
		DOC_UPD.stato.value = 'Z';

	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
	var insert = 'insert into tab_app_altri (iden_esame, tipo_esame, grado_urgenza)';
	insert += " values ('" +  doc.iden_esame.value + "', '" + doc.htipo_esame.value + "', '" + doc.hgrado_urgenza.value + "')";
	DOC_UPD.Iquery_tab_specifica.value = insert;
	DOC_UPD.Iquery_appropriatezza_esame.value = I_appropriatezza_esame;
	DOC_UPD.provenienza.value = provenienza;
	/**/

	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.tipo_connessione.value = 'DATA';

	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=800000');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=800000');
	
	DOC_UPD.submit();
	
	/*if(provenienza == 'A' || provenienza == 'R')
	{
		chiudi();
	}
	else
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_altri);	
		dwr.engine.setAsync(true);
	}*/
}

/*
Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
*/
function cbk_apri_altra_scheda_appr_altri(message)
{	
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');

	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		if(opener.baseUser.OB_ESECUZIONE == 'S')
		{
			//non ci sono più schede di appropriatezza da inserire
			var fin_scheda_esame_altri = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
			if(fin_scheda_esame_altri)
				fin_scheda_esame_altri.focus();
			else
				fin_scheda_esame_altri = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
			
			
			fin_scheda_esame_altri.opener = opener;
		}
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_altri = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		if(finestra_altri)
			finestra_altri.focus();
		else
			finestra_altri = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		
		finestra_altri.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_altri);	
		dwr.engine.setAsync(true);
	}
}