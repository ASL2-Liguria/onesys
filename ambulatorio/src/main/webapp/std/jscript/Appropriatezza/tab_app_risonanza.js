function calcola_sup_corporea()
{
	var doc = document.form_appr_obbl;
	if(doc.peso.value == 0.0 || doc.altezza.value == 0.0 || doc.peso.value == '' || doc.altezza.value == ''){
		//alert(ritornaJsMsg('alert_val_errato_nome_alt'));
		//doc.peso.focus();
		doc.peso.value = 0.0;
		doc.altezza.value = 0.0;
		doc.sup_corporea.value = 0.0;
		return;
	}
		var peso = parseFloat(doc.peso.value);
		var pesoEle = Math.pow(peso,0.425);
		var altezza = parseFloat(doc.altezza.value);
		var altezzaEle = Math.pow(altezza,0.725);
		var eleVtot = pesoEle * altezzaEle;
		var tot = eleVtot * 0.007184;
		doc.sup_corporea.value = tot.toString();
}

function calcola_delta()
{
	var doc = document.form_appr_obbl;
	if(doc.vsntd.vlaue == 0.0 || doc.vsnts.value == 0.0 || doc.vsntd.vlaue == '' || doc.vsnts.value == '')
	{
		alert(ritornaJsMsg('alert_val_errato_vsntd_vsnts'));
		doc.vsntd.focus();
		return;
	}
	var vsntd = parseFloat(doc.vsntd.value);
	var vsnts = parseFloat(doc.vsnts.value);
	var totsub = vsntd - vsnts;
	var totmolt = vsntd * 100;
	var tot = totsub / vsntd;
	var tot = tot * 100;
	doc.delta.value = tot.toString();
}

function calcola_IspessSiv()
{
	var doc = document.form_appr_obbl;
	if(doc.sivtd.vlaue == 0.0 || doc.sivts.value == 0.0 || doc.sivtd.vlaue == '' || doc.sivts.value == ''){
		alert(ritornaJsMsg('alert_val_errato_sivtd_sivts'));
		doc.sivtd.focus();
		return;
	}
	var sivtd = parseFloat(doc.sivtd.value);
	var sivts = parseFloat(doc.sivts.value);
	var totsub = sivts - sivtd;
	var totmolt = sivts * 100;
	var tot = totsub / sivts;
	var tot = tot * 100;
	doc.ispess_siv.value = tot.toString();
}

function calcola_Ispess_pp()
{
	var doc = document.form_appr_obbl;
	if(doc.pptd.vlaue == 0.0 || doc.ppts.value == 0.0 || doc.pptd.vlaue == '' || doc.ppts.value == ''){
		alert(ritornaJsMsg('alert_val_errato_pptd_ppts'));
		doc.pptd.focus();
		return;
	}
	var pptd = parseFloat(doc.pptd.value);
	var ppts = parseFloat(doc.ppts.value);
	var totsub =  ppts - pptd;
	var totmolt = pptd * 100;
	var tot = totsub / ppts;
	var tot = tot * 100;
	doc.ispess_pp.value = tot.toString();
}


function registra_tab_app_risonanza(provenienza)
{
	var doc = document.form_appr_obbl;	
	var mancano = registra_appropriatezza_esame('tab_app_risonanza', 'S', 'S', 'S', 'S', 'N');
	
	//if(registra_appropriatezza_esame('tab_app_risonanza', 'S', 'S', 'S', 'S', 'N'))
	//{
		if(doc.frequenza.value == '')
		{
			mancano += '- FREQUENZA\n';
		}
		
		if(doc.vsntd.value == '')
		{
			mancano += '- VSn Td\n';
		}
		
		if(doc.asn.value == '')
		{
			mancano += '- Asn\n';
		}
		
		if(doc.vsnts.value == '')
		{
			mancano += '- VSn Ts\n';
		}
		
		if(doc.adx.value == '')
		{
			mancano += '- Adx\n';
		}
		
		if(doc.vdxtd.value == '')
		{
			mancano += '- VDx Td\n';
		}
		
		if(doc.sivtd.value == '')
		{
			mancano += '- Siv Td\n';
		}
		
		if(doc.ed_vol.value == '')
		{
			mancano += '- Ed Volume\n';
		}
		
		if(doc.sivts.value == '')
		{
			mancano += '- Siv Ts\n';
		}
		
		if(doc.es_vol.value == '')
		{
			mancano += '- Es Volume\n';
		}
		
		if(doc.pptd.value == '')
		{
			mancano += '- Pp Td\n';
		}
		
		if(doc.stroke_vol.value == '')
		{
			mancano += '- Stroke Volume\n';
		}
		
		if(doc.ppts.value == '')
		{
			mancano += '- Pp Ts\n';
		}
		
		if(doc.frazione_eiezione.value == '')
		{
			mancano += '- Frazione Eiezione\n';
		}
		
		if(doc.pvdxtd.value == '')
		{
			mancano += '- PVDx Td\n';
		}
		
		if(doc.massa_ventr_sn.value == '')
		{
			mancano += '- Massa ventricolare sx\n';
		}
		
		if(doc.delta.value == '')
		{
			mancano += '- Delta\n';
		}
		
		if(doc.ispess_siv.value == '')
		{
			mancano += '- Ispess SIV\n';
		}
		
		if(doc.ispess_pp.value == '')
		{
			mancano += '- Ispess PP\n';
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
		
		calcola_sup_corporea();
		calcola_delta();
		calcola_IspessSiv();
		calcola_Ispess_pp();
		
		
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_RISONANZA', 'S', 'S', 'S', 'S', 'N');
	 //}//if
}

function insert_tab_app_risonanza(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';

	var doc = document.form_appr_obbl;	
	var insert = "insert into tab_app_risonanza (iden_esame, "; 
	insert += 'peso, altezza, sup_corporea, qualita, frequenza, sequenza, proiezioni, ';											 
	insert += 'vsntd, asn, vsnts, adx, vdxtd, ispess_siv, deltad, ispess_pp, sivtd, ed_vol, ';
	insert += 'sivts, es_vol, pptd, stroke_vol, ppts, frazione_eiezione, pvdxtd, massa_ventr_sn) values (';
	insert += doc.iden_esame.value + ", ";
	insert += doc.peso.value + ", " + doc.altezza.value + ", " + doc.sup_corporea.value + ", ";
	insert += verifica_campo(doc.qualita.value) + ", " + doc.frequenza.value + ", " + verifica_campo(doc.sequenza.value) + ", " + verifica_campo(doc.proiezioni.value)  + ", ";
	insert += doc.vsntd.value + ", " + doc.asn.value + ", " + doc.vsnts.value  + ", " + doc.adx.value + ", " + doc.vdxtd.value + ", ";
	insert += doc.ispess_siv.value + ", " + doc.delta.value + ", " + doc.ispess_pp.value + ", " + doc.sivtd.value + ", ";
	insert += doc.ed_vol.value + ", " + doc.sivts.value + ", " + doc.es_vol.value + ", " + doc.pptd.value + ", ";
	insert += doc.stroke_vol.value + ", " + doc.ppts.value + ", " + doc.frazione_eiezione.value + ", " + doc.pvdxtd.value + ", ";
	insert += doc.massa_ventr_sn.value  + ")"; 
	
	DOC_UPD.query_tab_specifica.value = insert;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	/*
		provenienza = 'E' o 'R'						  => ESAMI.stato = Y (appropriatezza)   
													  
		or provenienza = 'EM'						  => ESAMI.stato = E + Q (esame eseguito + esame appropriato)
	*/
	if(doc.provenienza.value == 'A'  || doc.provenienza.value == 'R')
		DOC_UPD.stato.value = 'Y';//appropriatezza	

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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_risonanza);	
		dwr.engine.setAsync(true);
	}*/
}//ins


function update_tab_app_risonanza(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';

	var doc = document.form_appr_obbl;	
	var update = 'update tab_app_risonanza set ';
	update += "peso = " + doc.peso.value + ", ";
	update += "altezza = " + doc.altezza.value + ", ";
	update += "sup_corporea = " + doc.sup_corporea.value + ", ";
	update += "qualita = " + verifica_campo(doc.qualita.value) + ", ";
	update += "frequenza = " + doc.frequenza.value + ", ";
	update += "sequenza = " + verifica_campo(doc.sequenza.value) + ", ";
	update += "proiezioni = " + verifica_campo(doc.proiezioni.value) + ", ";
	update += 'vsntd = ' + doc.vsntd.value + ', ';
	update += 'vsnts = ' + doc.vsnts.value + ', ';
	update += 'deltad = ' + doc.delta.value + ', ';
	update += 'vdxtd = ' + doc.vdxtd.value + ', ';
	update += 'sivtd = ' + doc.sivtd.value + ', ';
	update += 'sivts = ' + doc.sivts.value + ', ';
	update += 'pptd = ' + doc.pptd.value + ', ';
	update += 'ppts = ' + doc.ppts.value + ', ';
	update += 'pvdxtd = ' + doc.pvdxtd.value + ', ';
	update += 'asn = ' + doc.asn.value + ', ';
	update += 'adx = ' + doc.adx.value + ', ';
	update += 'ispess_siv = ' + doc.ispess_siv.value + ', ';
	update += 'ispess_pp = ' + doc.ispess_pp.value + ', ';
	update += 'ed_vol = ' + doc.ed_vol.value + ', ';
	update += 'es_vol = ' + doc.es_vol.value + ', ';
	update += 'stroke_vol = ' + doc.stroke_vol.value + ', ';
	update += 'frazione_eiezione = ' + doc.frazione_eiezione.value + ', ';
	update += 'massa_ventr_sn = ' + doc.massa_ventr_sn.value + ' ';
	update += 'where iden_esame in (' + doc.iden_esame.value  + ')';
	
	DOC_UPD.query_tab_specifica.value = update;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	DOC_UPD.tipo_operazione.value = 'UPD';
	DOC_UPD.tipo_connessione.value = 'DATA';

	DOC_UPD.iden_esame.value = doc.iden_esame.value;
	
	/*
	Caso di esecuzione multipla con esami con stesse schede di appropriatezza ed uno dei quali con la lettera Y
	*/
var insert = "insert into tab_app_risonanza (iden_esame, "; 
	insert += 'peso, altezza, sup_corporea, qualita, frequenza, sequenza, proiezioni, ';											 
	insert += 'vsntd, asn, vsnts, adx, vdxtd, ispess_siv, deltad, ispess_pp, sivtd, ed_vol, ';
	insert += 'sivts, es_vol, pptd, stroke_vol, ppts, frazione_eiezione, pvdxtd, massa_ventr_sn) values (';
	insert += doc.iden_esame.value + ", ";
	insert += doc.peso.value + ", " + doc.altezza.value + ", " + doc.sup_corporea.value + ", ";
	insert += verifica_campo(doc.qualita.value) + ", " + doc.frequenza.value + ", " + verifica_campo(doc.sequenza.value) + ", " + verifica_campo(doc.proiezioni.value)  + ", ";
	insert += doc.vsntd.value + ", " + doc.asn.value + ", " + doc.vsnts.value  + ", " + doc.adx.value + ", " + doc.vdxtd.value + ", ";
	insert += doc.ispess_siv.value + ", " + doc.delta.value + ", " + doc.ispess_pp.value + ", " + doc.sivtd.value + ", ";
	insert += doc.ed_vol.value + ", " + doc.sivts.value + ", " + doc.es_vol.value + ", " + doc.pptd.value + ", ";
	insert += doc.stroke_vol.value + ", " + doc.ppts.value + ", " + doc.frazione_eiezione.value + ", " + doc.pvdxtd.value + ", ";
	insert += doc.massa_ventr_sn.value  + ")"; 
	
	DOC_UPD.Iquery_tab_specifica.value = insert;
	DOC_UPD.Iquery_appropriatezza_esame.value = I_appropriatezza_esame;
	DOC_UPD.provenienza.value = provenienza;
	/**/
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_risonanza);
		dwr.engine.setAsync(true);
	}*/
}


/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_risonanza(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_ris = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_ris)
			fin_scheda_esame_ris.focus();
		else
			fin_scheda_esame_ris = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		fin_scheda_esame_ris.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_ris = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra_ris)
			finestra_ris.focus();
		else
			finestra_ris = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");	
		
		
		finestra_ris.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_risonanza);
		dwr.engine.setAsync(true);
	}
}