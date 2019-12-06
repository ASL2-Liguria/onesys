function verifica_campo(valore)
{
	if(valore != null && valore != '')
		return "'" + valore + "'";
	else
		return null;
}



function abilita_campi_clisma()
{
	var doc = document.form_appr_obbl;	
	if (doc.polipo1.checked == false)
	{
		doc.dimensione_lesione1.disabled = true;
		doc.sede_lesione1.disabled = true;
	}
	else
	{
		doc.dimensione_lesione1.disabled = false;
		doc.sede_lesione1.disabled = false;
	}
	
	if (doc.polipo2.checked == false)
	{
		doc.dimensione_lesione2.disabled = true;
		doc.sede_lesione2.disabled = true;
	}
	else
	{
		doc.dimensione_lesione2.disabled = false;
		doc.sede_lesione2.disabled = false;
	}
	
	if (doc.polipo3.checked == false)
	{
		doc.dimensione_lesione3.disabled = true;
		doc.sede_lesione3.disabled = true;
	}
	else
	{
		doc.dimensione_lesione3.disabled = false;
		doc.sede_lesione3.disabled = false;
	}
}

function azzera_clisma(num)
{
	var doc = document.form_appr_obbl;	
	abilita_campi_clisma();
	
	if (num == 1)
	{
		doc.dimensione_lesione1.value = '';
		doc.sede_lesione1.value = '';
	}
	if (num == 2)
	{
		doc.dimensione_lesione2.value = '';
		doc.sede_lesione2.value = '';
	}
	if (num == 3)
	{
		doc.dimensione_lesione3.value = '';
		doc.sede_lesione3.value = '';
	}
}


function registra_tab_app_clisma(provenienza)
{
	var doc = '';
	var mancano = registra_appropriatezza_esame('tab_app_clisma', 'S', 'S', 'S', 'S', 'N');
	
	//if(registra_appropriatezza_esame('tab_app_clisma', 'S', 'S', 'S', 'S', 'N'))
	//{
		doc = document.form_appr_obbl;
		
		if(doc.presenza_lesione[0].checked)
			doc.hpresenza_lesione.value = 'S';
		if(doc.presenza_lesione[1].checked)
			doc.hpresenza_lesione.value = 'N';
		if(doc.polipo1.checked)
			doc.hpolipo1.value = 'S';
		else
			doc.hpolipo1.value = 'N';
			
		if(doc.polipo2.checked)
			doc.hpolipo2.value = 'S';
		else
			doc.hpolipo2.value = 'N';
			
		if(doc.polipo3.checked)
			doc.hpolipo3.value = 'S';
		else
			doc.hpolipo3.value = 'N';

		if(doc.modalita_accesso.value == '' || doc.modalita_accesso.value == 0)
		{
			mancano += '- MODALITA\' DI ACCESSO\n';//alert(ritornaJsMsg("alert_mod_acc"));//Prego, indicare una modalità di accesso
		}
		
		if(doc.numero_polipi.value == '')
		{
			mancano += '- NUMERO POLIPI\n';//alert(ritornaJsMsg("alert_num_polipi"));//Prego, indicare il numero di polipi
		}
		if(doc.data_indicazione_conclusione.value == '')
		{
			mancano += '- DATA INDICAZIONE/CONCLUSIONE\n';//alert(ritornaJsMsg("alert_data_ic"));//Prego, inserire la data della Indicazione/Conclusione
		}
		if(doc.indicazioni_conclusioni.value == '' || doc.indicazioni_conclusioni.value == 0)
		{
			mancano += '- INDICAZIONE/CONCLUSIONE\n';//alert(ritornaJsMsg("alert_ic"));//Prego, inserire Indicazioni/Conclusioni
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}

		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_CLISMA', 'S', 'S', 'S', 'S', 'N');
	//}
}//registra

function formatta_data(data_)
{
	var giorno = data_.substring(0,2);
	var mese = data_.substring(3,5);
	var anno = data_.substring(6,10);
	var a_m_g = anno.toString() + mese.toString() + giorno.toString();
	return a_m_g;
}

function insert_tab_app_clisma(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var insert = 'insert into tab_app_clisma ';	
	insert += '(iden_esame, modalita_accesso, visione_pulizia, ';
	insert += 'presenza_lesione, polipo1, polipo2, polipo3, ';			
	insert += 'sede_lesione1, sede_lesione2, sede_lesione3, ';
	insert += 'dimensione_lesione1, dimensione_lesione2, dimensione_lesione3, ';
	insert += 'numero_polipi, ';
	insert += 'data_indicazione_conclusione, indicazioni_conclusioni) values (';
	
	insert += doc.iden_esame.value + ", '" + doc.modalita_accesso.value + "', " + verifica_campo(doc.visione_pulizia.value) + ", ";
	insert += verifica_campo(doc.hpresenza_lesione.value) + ", ";
	insert += verifica_campo(doc.hpolipo1.value) + ", " + verifica_campo(doc.hpolipo2.value) + ", " + verifica_campo(doc.hpolipo3.value) + ", ";
	insert += verifica_campo(doc.sede_lesione1.value) + ", " + verifica_campo(doc.sede_lesione2.value) + ", " + verifica_campo(doc.sede_lesione3.value) + ", ";
	insert += verifica_campo(doc.dimensione_lesione1.value) + ", " + verifica_campo(doc.dimensione_lesione2.value) + ", " + verifica_campo(doc.dimensione_lesione3.value) + ", ";
	insert += doc.numero_polipi.value + ", '";
	insert += formatta_data(doc.data_indicazione_conclusione.value) + "', '";
	insert += doc.indicazioni_conclusioni.value + "')";
	
	DOC_UPD.tipo_connessione.value = 'DATA';
	DOC_UPD.tipo_operazione.value = 'INS';
	DOC_UPD.provenienza.value = provenienza;
	/*
	provenienza = 'E' o 'R'						  => ESAMI.stato = Y (appropriatezza)   
												
	provenienza = 'EM'(esecuzione multipla)  	  => ESAMI.stato = E + Q (esame eseguito + esame appropriato)

	*/
	if(doc.provenienza.value == 'A'  || doc.provenienza.value == 'R')
		DOC_UPD.stato.value = 'Y';//appropriatezza	
	
	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	
	DOC_UPD.query_tab_specifica.value = insert;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_clisma);
		dwr.engine.setAsync(true);
	}*/
}



function update_tab_app_clisma(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_clisma set ';	
	update += "modalita_accesso = '" + doc.modalita_accesso.value + "', ";
	update += "visione_pulizia = " + verifica_campo(doc.visione_pulizia.value) + ", ";
	update += "presenza_lesione = " + verifica_campo(doc.hpresenza_lesione.value) + ", ";
	update += "polipo1 = " + verifica_campo(doc.hpolipo1.value) + ", ";
	update += "polipo2 = " + verifica_campo(doc.hpolipo2.value) + ", ";
	update += "polipo3 = " + verifica_campo(doc.hpolipo3.value) + ", ";
	update += "dimensione_lesione1 = " + verifica_campo(doc.dimensione_lesione1.value) + ", ";
	update += "dimensione_lesione2 = " + verifica_campo(doc.dimensione_lesione2.value) + ", ";
	update += "dimensione_lesione3 = " + verifica_campo(doc.dimensione_lesione3.value) + ", ";
	update += "sede_lesione1 = " + verifica_campo(doc.sede_lesione1.value) + ", ";
	update += "sede_lesione2 = " + verifica_campo(doc.sede_lesione2.value) + ", ";
	update += "sede_lesione3 = " + verifica_campo(doc.sede_lesione3.value) + ", ";
	update += "numero_polipi = " + doc.numero_polipi.value + ", ";
	update += "data_indicazione_conclusione = '" + formatta_data(doc.data_indicazione_conclusione.value) + "', ";
	update += "indicazioni_conclusioni = '" + doc.indicazioni_conclusioni.value + "' ";
	update += "where iden_esame in (" + doc.iden_esame.value + ")";
	
	
	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.tipo_connessione.value = 'DATA';
	
	DOC_UPD.query_tab_specifica.value = update;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
	var insert = 'insert into tab_app_clisma ';	
	insert += '(iden_esame, modalita_accesso, visione_pulizia, ';
	insert += 'presenza_lesione, polipo1, polipo2, polipo3, ';			
	insert += 'sede_lesione1, sede_lesione2, sede_lesione3, ';
	insert += 'dimensione_lesione1, dimensione_lesione2, dimensione_lesione3, ';
	insert += 'numero_polipi, ';
	insert += 'data_indicazione_conclusione, indicazioni_conclusioni) values (';
	
	insert += doc.iden_esame.value + ", '" + doc.modalita_accesso.value + "', " + verifica_campo(doc.visione_pulizia.value) + ", ";
	insert += verifica_campo(doc.hpresenza_lesione.value) + ", ";
	insert += verifica_campo(doc.hpolipo1.value) + ", " + verifica_campo(doc.hpolipo2.value) + ", " + verifica_campo(doc.hpolipo3.value) + ", ";
	insert += verifica_campo(doc.sede_lesione1.value) + ", " + verifica_campo(doc.sede_lesione2.value) + ", " + verifica_campo(doc.sede_lesione3.value) + ", ";
	insert += verifica_campo(doc.dimensione_lesione1.value) + ", " + verifica_campo(doc.dimensione_lesione2.value) + ", " + verifica_campo(doc.dimensione_lesione3.value) + ", ";
	insert += doc.numero_polipi.value + ", '";
	insert += formatta_data(doc.data_indicazione_conclusione.value) + "', '";
	insert += doc.indicazioni_conclusioni.value + "')";
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_clisma);	
		dwr.engine.setAsync(true);
	}*/
}

/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_clisma(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_cli = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_cli)
			fin_scheda_esame_cli.focus();
		else
			fin_scheda_esame_cli = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");		
		
		
		fin_scheda_esame_cli.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_cli = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra_cli)
			finestra_cli.focus();
		else
			finestra_cli = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		
		finestra_cli.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_clisma);	
		dwr.engine.setAsync(true);
	}
}