/*
	Funzione richiamata all'onLoad della pagina che gestisce i radio button di Primo Esame
	e Controllo/Follow up a seconda che sia inserimento o aggiornamento(in questo caso contraddistinguo
	grazie ai campi obbligatori del controllo(primo Controllo - secondo Controllo - terzo Controllo)																		
*/
function primoEsame_controlloTAB_APP_ECD_TSA()
{
    var doc = document.form_appr_obbl;	
	if(doc.medico.value == '')
	{
		doc.hcontrollo.value = 'S';
		abilita_controllo_tsa();//inserimento
	}
	else
	{
		if(doc.controllo[0].checked == true || doc.controllo[1].checked == true || doc.controllo[2].checked == true)
		{
			doc.primo_esame[0].checked = false;
			doc.primo_esame[1].checked = true;
			abilita_controllo_tsa();
		}
		else
		{
			abilita_primo_esame_tsa();
		}
	}
}

/*
	Funzione richiamata alla pressione del radio_buttom 'Primo Esame'
	Disabilita tutta la parte riguardante la colonna di 'Controllo/Follow up'
	e riabilita i checkbox riguardanti la colonna del Primo Esame
*/
function abilita_primo_esame_tsa()
{
	var doc = document.form_appr_obbl;
	if(doc.altro.checked)
		doc.altro_descr.disabled = false;
	else
		doc.altro_descr.disabled = true;
	
	doc.esame_multiplo.disabled = false;
	doc.primo_ictus.disabled = false;
	doc.primo_coronaropatia.disabled = false;
	doc.primo_arteriopatia.disabled = false;
	doc.primo_aneurisma.disabled = false;
	doc.primo_succlava.disabled = false;
	doc.primo_cv.disabled = false;
	if(doc.primo_cv.checked == false)
		doc.primo_cv_qta.disabled = true;
	else
		doc.primo_cv_qta.disabled = false;
	doc.primo_soffio.disabled = false;
	doc.primo_vertigini.disabled = false;
	doc.primo_claudicatio.disabled = false;
	doc.primo_ictus_recente.disabled = false;
	if(doc.primo_ictus_recente.checked == false)
		doc.primo_ictus_recente_giorni.disabled = true;
	else
		doc.primo_ictus_recente_giorni.disabled = false;
	doc.primo_altro.disabled = false;
	if(doc.primo_altro.checked == false)
		doc.primo_altro_descr.disabled = true;
	else
		doc.primo_altro_descr.disabled = false;
	
	doc.controllo[0].disabled = true;
	doc.controllo[0].checked = false;
	doc.controllo[1].disabled = true;
	doc.controllo[1].checked = false;
	doc.controllo[2].disabled = true;
	doc.controllo[2].checked = false;
	
	doc.controllo_endo.disabled = true;
	doc.controllo_endo.checked = false;
	doc.controllo_ictus.disabled = true;
	doc.controllo_ictus.checked = false;
	doc.controllo_occlusione.disabled = true;
	doc.controllo_occlusione.checked = false;
	doc.controllo_carotide_50_sin.disabled = true;
	doc.controllo_carotide_50_sin.checked = false;
	doc.controllo_carotide_50_asin.disabled = true;
	doc.controllo_carotide_50_asin.checked = false;
	doc.controllo_carotide_70_sin.disabled = true;
	doc.controllo_carotide_70_sin.checked = false;
	doc.controllo_carotide_70_asin.disabled = true;
	doc.controllo_carotide_70_asin.checked = false;
	doc.controllo_carotide_piu70_asin.disabled = true;
	doc.controllo_carotide_piu70_asin.checked = false;
	doc.controllo_placca.disabled = true;
	doc.controllo_placca.checked = false;
	doc.controllo_altro.disabled = true;
	doc.controllo_altro.checked = false;
	doc.controllo_altro_descr.disabled = true;
	doc.controllo_altro_descr.value = "";
	/*
	if(doc.controllo_altro.checked == false)
		doc.controllo_altro_descr.disabled = true;
	else
		doc.controllo_altro_descr.disabled = false;
	*/
	doc.controllo_da_mesi.value = "";
	doc.controllo_da_mesi.disabled = true;
	doc.controllo_endo_mesi.value = "";
	doc.controllo_endo_mesi.disabled = true;
	doc.controllo_ictus_mesi.disabled = true;
	doc.controllo_ictus_mesi.value = "";
}//abilita_primo_esame_tsa()


/*Questa funzione viene richiamata anche all'onLoad della pagina*/
function abilita_controllo_tsa()
{
	var doc = document.form_appr_obbl;
	doc.primo_esame[1].checked = 1;
	if(doc.altro.checked)
		doc.altro_descr.disabled = false;
	else
		doc.altro_descr.disabled = true;
	
	doc.esame_multiplo.disabled = true;
	doc.esame_multiplo.checked = false;	
	doc.primo_ictus.disabled = true;
	doc.primo_ictus.checked = false;	
	doc.primo_coronaropatia.disabled = true;
	doc.primo_coronaropatia.checked = false;	
	doc.primo_arteriopatia.disabled = true;
	doc.primo_arteriopatia.checked = false;
	doc.primo_aneurisma.disabled = true;
	doc.primo_aneurisma.checked = false;	
	doc.primo_succlava.disabled = true;
	doc.primo_succlava.checked = false;	
	doc.primo_cv.disabled = true;
	doc.primo_cv.checked = false;
	doc.primo_cv_qta.disabled = true;
	doc.primo_cv_qta.value = "";
	doc.primo_soffio.disabled = true;
	doc.primo_soffio.checked = false;
	doc.primo_vertigini.disabled = true;
	doc.primo_vertigini.checked = false;
	doc.primo_claudicatio.disabled = true;
	doc.primo_claudicatio.checked = false;	
	doc.primo_altro.checked = false;
	doc.primo_altro.disabled = true;
	doc.primo_altro_descr.disabled = true;
	doc.primo_altro_descr.value = "";
	doc.primo_ictus_recente.disabled = true;
	doc.primo_ictus_recente.checked = false;	
	doc.primo_ictus_recente_giorni.disabled = true;
	doc.primo_ictus_recente_giorni.value = "";
	
	doc.controllo[0].disabled = false;
	doc.controllo[1].disabled = false;
	doc.controllo[2].disabled = false;
	
	doc.controllo_endo.disabled = false;
	doc.controllo_ictus.disabled = false;
	doc.controllo_occlusione.disabled = false;
	doc.controllo_carotide_50_sin.disabled = false;
	doc.controllo_carotide_50_asin.disabled = false;
	doc.controllo_carotide_70_sin.disabled = false;
	doc.controllo_carotide_70_asin.disabled = false;
	doc.controllo_carotide_piu70_asin.disabled = false;	
	doc.controllo_placca.disabled = false;	
	doc.controllo_altro.disabled = false;
	
	doc.controllo_da_mesi.disabled = false;
	doc.controllo_endo_mesi.disabled = true;
	doc.controllo_ictus_mesi.disabled = true;
	doc.controllo_altro_descr.disabled = true;
	
	if (doc.controllo_endo.checked)
		doc.controllo_endo_mesi.disabled = false;
	else
		doc.controllo_endo_mesi.disabled = true;
	if (doc.controllo_ictus.checked)
		doc.controllo_ictus_mesi.disabled = false;
	else
		doc.controllo_ictus_mesi.disabled = true;
	if (doc.controllo_altro.checked)
		doc.controllo_altro_descr.disabled = false;
	else
		doc.controllo_altro_descr.disabled = true;
}//abilita_controllo

/*
	Funzione che controlla se il campo checkbox corrispondente al campo textbox è contrassegnato 
	o meno per abilitare il campo testo
*/
function controlla_checkbox_tsa(tipo)
{
	var doc = document.form_appr_obbl;
	if ((tipo = "primo_altro") && (doc.primo_altro.checked))
	{
		doc.primo_altro_descr.disabled = false;
	}
	else
	{
		doc.primo_altro_descr.disabled = true;
		doc.primo_altro_descr.value = "";
	}
	
	if ((tipo = "primo_cv") && (doc.primo_cv.checked))
	{
		doc.primo_cv_qta.disabled = false;
	}
	else
	{
		doc.primo_cv_qta.disabled = true;
		doc.primo_cv_qta.value = "";
	}
	
	if ((tipo = "primo_ictus_recente") && (doc.primo_ictus_recente.checked))
	{
		doc.primo_ictus_recente_giorni.disabled = false;
	}
	else
	{
		doc.primo_ictus_recente_giorni.disabled = true;
		doc.primo_ictus_recente_giorni.value = "";
	}
	if ((tipo = "controllo_altro") && (doc.controllo_altro.checked))
	{
		doc.controllo_altro_descr.disabled = false;
	}
	else
	{
		doc.controllo_altro_descr.disabled = true;
		doc.controllo_altro_descr.value = "";
	}
	if ((tipo = "altro") && (doc.altro.checked))
	{
		doc.altro_descr.disabled = false;
	}
	else
	{
		doc.altro_descr.disabled = true;
		doc.altro_descr.value = "";
	}
	if ((tipo = "controllo_endo") && (doc.controllo_endo.checked))
	{
		doc.controllo_endo_mesi.disabled = false;
	}
	else
	{
		doc.controllo_endo_mesi.disabled = true;
		doc.controllo_endo_mesi.value = "";
	}
	if ((tipo = "controllo_ictus") && (doc.controllo_ictus.checked))
	{
		doc.controllo_ictus_mesi.disabled = false;
	}
	else
	{
		doc.controllo_ictus_mesi.disabled = true;
		doc.controllo_ictus_mesi.value = "";
	}
	
}


function registra_tab_app_ecd_tsa(provenienza)
{
	var doc = document.form_appr_obbl;
	var mancano = registra_appropriatezza_esame('tab_app_ecd_tsa', 'S', 'S', 'S', 'N', 'N');
	
	if(doc.diabete.checked)
		doc.hfr_diabete.value = 'S';
	else
		doc.hfr_diabete.value = 'N';
	if(doc.cardio.checked)
		doc.hfr_cardio.value = 'S';
	else
		doc.hfr_cardio.value = 'N';	
	if(doc.iperten.checked)
		doc.hfr_iperten.value = 'S';
	else
		doc.hfr_iperten.value = 'N';	
	if(doc.dislipi.checked)
		doc.hfr_dislipi.value = 'S';
	else
		doc.hfr_dislipi.value = 'N';	
	if(doc.arterio.checked)
		doc.hfr_arterio.value = 'S';
	else
		doc.hfr_arterio.value = 'N';	
	if(doc.fumo.checked)
		doc.hfr_fumo.value = 'S';
	else
		doc.hfr_fumo.value = 'N';	
	if(doc.familiarita.checked)
		doc.hfr_familiarita.value = 'S';
	else
		doc.hfr_familiarita.value = 'N';	
	if(doc.altro.checked)
		doc.hfr_altro.value = 'S';
	else
		doc.hfr_altro.value = 'N';	
		
	if(doc.controllo_altro.checked) 
		doc.hcontrollo_altro.value = 'S';
	else
		doc.hcontrollo_altro.value = 'N';
		
	
	if (doc.controllo[0].checked)
		doc.hcontrollo_primo.value = "S";
	else
		doc.hcontrollo_primo.value = "N";
	if (doc.controllo[1].checked)
		doc.hcontrollo_secondo.value = "S";
	else
		doc.hcontrollo_secondo.value = "N";
	if (doc.controllo[2].checked)
		doc.hcontrollo_terzo.value = "S";
	else
		doc.hcontrollo_terzo.value = "N";
	
	if(doc.primo_ictus.checked)
		doc.hprimo_ictus.value = 'S';
	else
		doc.hprimo_ictus.value = 'N';
	if(doc.primo_coronaropatia.checked)	
		doc.hprimo_coronaropatia.value = 'S';
	else
		doc.hprimo_coronaropatia.value = 'N';
	if(doc.primo_arteriopatia.checked)	
		doc.hprimo_arteriopatia.value = 'S';
	else
		doc.hprimo_arteriopatia.value = 'N';
	if(doc.primo_aneurisma.checked)	
		doc.hprimo_aneurisma.value = 'S';
	else
		doc.hprimo_aneurisma.value = 'N';
	if(doc.primo_succlava.checked)	
		doc.hprimo_succlava.value = 'S';
	else
		doc.hprimo_succlava.value = 'N';
	if(doc.primo_cv.checked)	
		doc.hprimo_cv.value = 'S';
	else
		doc.hprimo_cv.value = 'N';
	if(doc.primo_soffio.checked)	
		doc.hprimo_soffio.value = 'S';
	else
		doc.hprimo_soffio.value = 'N';
	if(doc.primo_vertigini.checked)	
		doc.hprimo_vertigini.value = 'S';
	else
		doc.hprimo_vertigini.value = 'N';
	if(doc.primo_claudicatio.checked)	
		doc.hprimo_claudicatio.value = 'S';
	else
		doc.hprimo_claudicatio.value = 'N';
	if(doc.primo_ictus_recente.checked)	
		doc.hprimo_ictus_recente.value = 'S';
	else
		doc.hprimo_ictus_recente.value = 'N';	
	if(doc.primo_altro.checked)	
		doc.hprimo_altro.value = 'S';
	else
		doc.hprimo_altro.value = 'N';		
		
	if(doc.controllo_endo.checked)	
		doc.hcontrollo_endo.value = 'S';
	else
		doc.hcontrollo_endo.value = 'N';
	if(doc.controllo_ictus.checked)	
		doc.hcontrollo_ictus.value = 'S';
	else
		doc.hcontrollo_ictus.value = 'N';
	if(doc.controllo_occlusione.checked)	
		doc.hcontrollo_occlusione.value = 'S';
	else
		doc.hcontrollo_occlusione.value = 'N';
	if(doc.controllo_carotide_50_sin.checked)	
		doc.hcontrollo_carotide_50_sin.value = 'S';
	else
		doc.hcontrollo_carotide_50_sin.value = 'N';
	if(doc.controllo_carotide_50_asin.checked)	
		doc.hcontrollo_carotide_50_asin.value = 'S';
	else
		doc.hcontrollo_carotide_50_asin.value = 'N';	
		
	if(doc.controllo_carotide_70_sin.checked)	
		doc.hcontrollo_carotide_70_sin.value = 'S';
	else
		doc.hcontrollo_carotide_70_sin.value = 'N';	
		
	if(doc.controllo_carotide_70_asin.checked)	
		doc.hcontrollo_carotide_70_asin.value = 'S';
	else
		doc.hcontrollo_carotide_70_asin.value = 'N';	
	
	if(doc.controllo_carotide_piu70_asin.checked)	
		doc.hcontrollo_carotide_piu70_asin.value = 'S';
	else
		doc.hcontrollo_carotide_piu70_asin.value = 'N';
		
	if(doc.controllo_placca.checked)	
		doc.hcontrollo_placca.value = 'S';
	else
		doc.hcontrollo_placca.value = 'N';	
		
	if(doc.controllo_altro.checked)	
		doc.hcontrollo_altro.value = 'S';
	else
		doc.hcontrollo_altro.value = 'N';		
		
	if(doc.primo_altro.checked)	
		doc.hprimo_altro.value = 'S';
	else
		doc.hprimo_altro.value = 'N';	
	
	//if(registra_appropriatezza_esame('tab_app_ecd_tsa', 'S', 'S', 'S', 'N', 'N'))
	//{
		
		if (!doc.primo_esame[0].checked && !doc.primo_esame[1].checked)
		{
			mancano += '- PRIMO ESAME O ESAME DI CONTROLLO\n';//alert(ritornaJsMsg("alert_primo_esame"));//Prego, inserire se è un primo esame od un controllo
		}
			
		if(!doc.controllo[0].checked && !doc.controllo[1].checked && !doc.controllo[2].checked && doc.primo_esame[1].checked)
		{
			mancano += '- PRIMO ESAME/CONTROLLO\n';//alert(ritornaJsMsg("alert_controllo"));//Prego, inserire un controllo(primo,secondo,terzo o successivo)
		}
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
		
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_ECD_TSA', 'S', 'S', 'S', 'N', 'N');
	//}//if
}//registra_tab_app_ecd_tsa()



function insert_tab_app_ecd_tsa(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var insert = 'insert into tab_app_ecd_tsa ';
	
	insert += "(iden_esame, fatt_rischio_diabete, fatt_rischio_cardio, fatt_rischio_iperten, fatt_rischio_dislipi, fatt_rischio_arterio, ";
	insert += "fatt_rischio_fumo, fatt_rischio_familiarita, fatt_rischio_altro, fatt_rischio_altro_descr, ";			
	insert += "controllo_primo, controllo_secondo, controllo_terzo, ";
	insert += "primo_ictus, primo_coronaropatia, primo_arteriopatia, primo_aneurisma, primo_succlava, primo_cv, ";
	insert += "primo_cv_qta, primo_soffio, primo_vertigini, primo_claudicatio, ";
	insert += "primo_ictus_recente, primo_ictus_recente_giorni, primo_altro, primo_altro_descr, ";
	insert += "controllo_da_mesi, controllo_endo, controllo_endo_mesi, controllo_ictus, controllo_ictus_mesi, ";
	insert += "controllo_occlusione, controllo_carotide_50_sin, controllo_carotide_50_asin, controllo_carotide_70_sin, ";
	insert += "controllo_carotide_70_asin, controllo_carotide_piu70_asin, controllo_placca, ";
	insert += "controllo_altro, controllo_altro_descr";
	insert += ")";			
	
	var esami = doc.iden_esame.value;
	//alert('Esami: ' + esami);	
	
	if(esami.indexOf(",") > -1 )
		esami = esami.split(",")[0];
	
	insert += " values (";
	insert +=  esami  + ", " + verifica_campo(doc.hfr_diabete.value) + ", " + verifica_campo(doc.hfr_cardio.value) + ", ";	
	insert +=  verifica_campo(doc.hfr_iperten.value)  + ", " + verifica_campo(doc.hfr_dislipi.value) + ", " + verifica_campo(doc.hfr_arterio.value) + ", ";
	insert +=  verifica_campo(doc.hfr_fumo.value)  + ", " + verifica_campo(doc.hfr_familiarita.value) + ", " + verifica_campo(doc.hfr_altro.value) + ", ";
	insert +=  verifica_campo(doc.altro_descr.value)  + ", " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_secondo.value) + ", " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_ictus.value)  + ", " + verifica_campo(doc.hprimo_coronaropatia.value) + ", " + verifica_campo(doc.hprimo_arteriopatia.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_aneurisma.value)  + ", " + verifica_campo(doc.hprimo_succlava.value) + ", " + verifica_campo(doc.hprimo_cv.value) + ", ";
	insert +=  verifica_campo(doc.primo_cv_qta.value)  + ", " + verifica_campo(doc.hprimo_soffio.value) + ", " + verifica_campo(doc.hprimo_vertigini.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_claudicatio.value)  + ", " + verifica_campo(doc.hprimo_ictus_recente.value) + ", " + verifica_campo(doc.primo_ictus_recente_giorni.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_altro.value)  + ", " + verifica_campo(doc.primo_altro_descr.value) + ", ";
	insert +=  verifica_campo(doc.controllo_da_mesi.value) + ", " + verifica_campo(doc.hcontrollo_endo.value) + ", ";
	insert +=  verifica_campo(doc.controllo_endo_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_ictus.value) + ", " + verifica_campo(doc.controllo_ictus_mesi.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_occlusione.value)  + ", " + verifica_campo(doc.hcontrollo_carotide_50_sin.value) + ", " + verifica_campo(doc.hcontrollo_carotide_50_asin.value) + ", ";
	
	insert +=  verifica_campo(doc.hcontrollo_carotide_70_sin.value)  + ", " + verifica_campo(doc.hcontrollo_carotide_70_asin.value) + ", " + verifica_campo(doc.hcontrollo_carotide_piu70_asin.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_placca.value)  + ", " + verifica_campo(doc.hcontrollo_altro.value) + ", ";
	insert +=  verifica_campo(doc.controllo_altro_descr.value);
	
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
	
	/*20080609*/
	var win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');
	if(win_registrazione)
		win_registrazione.focus();
	else
		win_registrazione = window.open("", "win_appropriatezza", 'width=1, height=1, status=yes, top=800000, left=0');

	
	DOC_UPD.submit();
	
	/*if(provenienza == 'A'  || provenienza == 'R')
		chiudi();
	else	
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_tsa);	
		dwr.engine.setAsync(true);
	}*/
}


function update_tab_app_ecd_tsa(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_ecd_tsa set ';
	update += "fatt_rischio_diabete = " + verifica_campo(doc.hfr_diabete.value) + ", ";
	update += "fatt_rischio_cardio = " + verifica_campo(doc.hfr_cardio.value) + ", ";
	update += "fatt_rischio_iperten = " + verifica_campo(doc.hfr_iperten.value) + ", ";
	update += "fatt_rischio_dislipi = " + verifica_campo(doc.hfr_dislipi.value) + ", ";
	update += "fatt_rischio_arterio = " + verifica_campo(doc.hfr_arterio.value) + ", ";
	update += "fatt_rischio_fumo = " + verifica_campo(doc.hfr_fumo.value) + ", ";
	update += "fatt_rischio_familiarita = " + verifica_campo(doc.hfr_familiarita.value) + ", ";
	update += "fatt_rischio_altro = " + verifica_campo(doc.hfr_altro.value) + ", ";
	update += "fatt_rischio_altro_descr = " + verifica_campo(doc.altro_descr.value) + ", ";
	
	update += "primo_ictus = " + verifica_campo(doc.hprimo_ictus.value) + ", ";
	update += "primo_coronaropatia = " + verifica_campo(doc.hprimo_coronaropatia.value) + ", ";
	update += "primo_arteriopatia = " + verifica_campo(doc.hprimo_arteriopatia.value) + ", ";
	update += "primo_aneurisma = " + verifica_campo(doc.hprimo_aneurisma.value) + ", ";
	update += "primo_succlava = " + verifica_campo(doc.hprimo_succlava.value) + ", ";
	update += "primo_cv = " + verifica_campo(doc.hprimo_cv.value) + ", ";
	update += "primo_cv_qta = " + verifica_campo(doc.primo_cv_qta.value) + ", ";
	update += "primo_soffio = " + verifica_campo(doc.hprimo_soffio.value) + ", ";
	update += "primo_vertigini = " + verifica_campo(doc.hprimo_vertigini.value) + ", ";
	update += "primo_claudicatio = " + verifica_campo(doc.hprimo_claudicatio.value) + ", ";
	update += "primo_ictus_recente = " + verifica_campo(doc.hprimo_ictus_recente.value) + ", ";
	update += "primo_ictus_recente_giorni = " + verifica_campo(doc.primo_ictus_recente_giorni.value) + ", ";
	update += "primo_altro = " + verifica_campo(doc.hprimo_altro.value) + ", ";
	update += "primo_altro_descr = " + verifica_campo(doc.primo_altro_descr.value) + ", ";
	
	update += "controllo_primo = " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	update += "controllo_secondo = " + verifica_campo(doc.hcontrollo_secondo.value) + ", ";
	update += "controllo_terzo = " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	update += "controllo_da_mesi = " + verifica_campo(doc.controllo_da_mesi.value) + ", ";
	update += "controllo_endo = " + verifica_campo(doc.hcontrollo_endo.value) + ", ";
	update += "controllo_endo_mesi = " + verifica_campo(doc.controllo_endo_mesi.value) + ", ";
	update += "controllo_ictus = " + verifica_campo(doc.hcontrollo_ictus.value) + ", ";
	update += "controllo_ictus_mesi = " + verifica_campo(doc.controllo_ictus_mesi.value) + ", ";
	update += "controllo_occlusione = " + verifica_campo(doc.hcontrollo_occlusione.value) + ", ";
	update += "controllo_carotide_50_sin = " + verifica_campo(doc.hcontrollo_carotide_50_sin.value) + ", ";
	update += "controllo_carotide_50_asin = " + verifica_campo(doc.hcontrollo_carotide_50_asin.value) + ", ";
	update += "controllo_carotide_70_sin = " + verifica_campo(doc.hcontrollo_carotide_70_sin.value) + ", ";
	update += "controllo_carotide_70_asin = " + verifica_campo(doc.hcontrollo_carotide_70_asin.value) + ", ";
	update += "controllo_carotide_piu70_asin = " + verifica_campo(doc.hcontrollo_carotide_piu70_asin.value) + ", ";
	update += "controllo_placca = " + verifica_campo(doc.hcontrollo_placca.value) + ", ";
	update += "controllo_altro = " + verifica_campo(doc.hcontrollo_altro.value) + ", ";
	update += "controllo_altro_descr = " + verifica_campo(doc.controllo_altro_descr.value) + " ";
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
	var insert = 'insert into tab_app_ecd_tsa ';
	
	insert += "(iden_esame, fatt_rischio_diabete, fatt_rischio_cardio, fatt_rischio_iperten, fatt_rischio_dislipi, fatt_rischio_arterio, ";
	insert += "fatt_rischio_fumo, fatt_rischio_familiarita, fatt_rischio_altro, fatt_rischio_altro_descr, ";			
	insert += "controllo_primo, controllo_secondo, controllo_terzo, ";
	insert += "primo_ictus, primo_coronaropatia, primo_arteriopatia, primo_aneurisma, primo_succlava, primo_cv, ";
	insert += "primo_cv_qta, primo_soffio, primo_vertigini, primo_claudicatio, ";
	insert += "primo_ictus_recente, primo_ictus_recente_giorni, primo_altro, primo_altro_descr, ";
	insert += "controllo_da_mesi, controllo_endo, controllo_endo_mesi, controllo_ictus, controllo_ictus_mesi, ";
	insert += "controllo_occlusione, controllo_carotide_50_sin, controllo_carotide_50_asin, controllo_carotide_70_sin, ";
	insert += "controllo_carotide_70_asin, controllo_carotide_piu70_asin, controllo_placca, ";
	insert += "controllo_altro, controllo_altro_descr";
	insert += ")";			
	
	insert += " values (";
	insert +=  doc.iden_esame.value  + ", " + verifica_campo(doc.hfr_diabete.value) + ", " + verifica_campo(doc.hfr_cardio.value) + ", ";	
	insert +=  verifica_campo(doc.hfr_iperten.value)  + ", " + verifica_campo(doc.hfr_dislipi.value) + ", " + verifica_campo(doc.hfr_arterio.value) + ", ";
	insert +=  verifica_campo(doc.hfr_fumo.value)  + ", " + verifica_campo(doc.hfr_familiarita.value) + ", " + verifica_campo(doc.hfr_altro.value) + ", ";
	insert +=  verifica_campo(doc.altro_descr.value)  + ", " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_secondo.value) + ", " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_ictus.value)  + ", " + verifica_campo(doc.hprimo_coronaropatia.value) + ", " + verifica_campo(doc.hprimo_arteriopatia.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_aneurisma.value)  + ", " + verifica_campo(doc.hprimo_succlava.value) + ", " + verifica_campo(doc.hprimo_cv.value) + ", ";
	insert +=  verifica_campo(doc.primo_cv_qta.value)  + ", " + verifica_campo(doc.hprimo_soffio.value) + ", " + verifica_campo(doc.hprimo_vertigini.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_claudicatio.value)  + ", " + verifica_campo(doc.hprimo_ictus_recente.value) + ", " + verifica_campo(doc.primo_ictus_recente_giorni.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_altro.value)  + ", " + verifica_campo(doc.primo_altro_descr.value) + ", ";
	insert +=  verifica_campo(doc.controllo_da_mesi.value) + ", " + verifica_campo(doc.hcontrollo_endo.value) + ", ";
	insert +=  verifica_campo(doc.controllo_endo_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_ictus.value) + ", " + verifica_campo(doc.controllo_ictus_mesi.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_occlusione.value)  + ", " + verifica_campo(doc.hcontrollo_carotide_50_sin.value) + ", " + verifica_campo(doc.hcontrollo_carotide_50_asin.value) + ", ";
	
	insert +=  verifica_campo(doc.hcontrollo_carotide_70_sin.value)  + ", " + verifica_campo(doc.hcontrollo_carotide_70_asin.value) + ", " + verifica_campo(doc.hcontrollo_carotide_piu70_asin.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_placca.value)  + ", " + verifica_campo(doc.hcontrollo_altro.value) + ", ";
	insert +=  verifica_campo(doc.controllo_altro_descr.value);
	
	insert += ")";				
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_tsa);
		dwr.engine.setAsync(true);
	}*/
}//update_tab_app_ecd_tsa()


/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_ecd_tsa(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_taet = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_taet)
			fin_scheda_esame_taet.focus();
	    else
			fin_scheda_esame_taet = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		
		fin_scheda_esame_taet.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_taet = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra_taet)
			finestra_taet.focus();
		else
			finestra_taet = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");	
		
		
		finestra_taet.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_tsa);
		dwr.engine.setAsync(true);
	}
}