/*
	Funzione richiamata all'onLoad della pagina che gestisce i radio button di Primo Esame
	e Controllo/Follow up a seconda che sia inserimento o aggiornamento(in questo caso contraddistinguo
	grazie ai campi obbligatori del controllo(primo Controllo - secondo Controllo - terzo Controllo)																		
*/
function primoEsame_controlloTAB_APP_ECD_ARTI()
{
	var doc = document.form_appr_obbl;	
	if(doc.medico.value == '')
	{
		doc.hcontrollo.value = 'S';
		abilita_controllo();//inserimento
	}
	else{
		if(doc.controllo[0].checked == true || doc.controllo[1].checked == true || doc.controllo[2].checked == true)
		{
			doc.primo_esame[0].checked = false;
			doc.primo_esame[1].checked = true;
			abilita_controllo();
		}
		else
		{
			abilita_primo_esame();
		}
	}
}

/*
	Funzione richiamata alla pressione del radio_buttom 'Primo Esame'
	Disabilita tutta la parte riguardante la colonna di 'Controllo/Follow up'
	e riabilita i checkbox rigurardanti la colonna del Primo Esame
*/
function abilita_primo_esame()
{
	var doc = document.form_appr_obbl;
	
	if(doc.altro.checked)
		doc.altro_descr.disabled = false;
	else
		doc.altro_descr.disabled = true;
	
	doc.esame_multiplo.disabled = false;
	doc.primo_aneurisma.disabled = false;
	doc.primo_trombosi.disabled = false;
	doc.primo_dito_blu.disabled = false;
	doc.primo_flebite_coscia.disabled = false;
	doc.primo_flebite_gamba.disabled = false;
	doc.primo_sindrome_varicosa.disabled = false;
	doc.primo_riduzione_autonomia.disabled = false;
	doc.primo_lesioni_arteriose.disabled = false;
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
	
	doc.controllo_tvp.disabled = true;
	doc.controllo_tvp.checked = false;
	doc.controllo_rivascolarizzazione.disabled = true;
	doc.controllo_rivascolarizzazione.checked = false;
	doc.controllo_chi_distale.disabled = true;
	doc.controllo_chi_distale.checked = false;
	doc.controllo_chi_aortica.disabled = true;
	doc.controllo_chi_aortica.checked = false;
	doc.controllo_sindrome_posttr.disabled = true;
	doc.controllo_sindrome_posttr.checked = false;
	doc.controllo_altro.disabled = true;
	doc.controllo_altro.checked = false;
	
	doc.controllo_da_mesi.value = "";
	doc.controllo_da_mesi.disabled = true;
	doc.controllo_tvp_mesi.value = "";
	doc.controllo_tvp_mesi.disabled = true;
	doc.controllo_rivascolarizzazione_mesi.value = "";
	doc.controllo_rivascolarizzazione_mesi.disabled = true;
	doc.controllo_chi_distale_mesi.value = "";
	doc.controllo_chi_distale_mesi.disabled = true;
	doc.controllo_chi_aortica_mesi.value = "";
	doc.controllo_chi_aortica_mesi.disabled = true;
	doc.controllo_altro_descr.value = "";
	doc.controllo_altro_descr.disabled = true;
	}//abilita_primo_esame()
	
	
	/*Questa funzione viene richiamata anche all'onLoad della pagina*/
	function abilita_controllo()
	{
	var doc = document.form_appr_obbl;
	doc.primo_esame[1].checked = 1;
	if(doc.altro.checked)
		doc.altro_descr.disabled = false;
	else
		doc.altro_descr.disabled = true;
	
	doc.esame_multiplo.disabled = true;
	doc.esame_multiplo.checked = false;	
	doc.primo_aneurisma.disabled = true;
	doc.primo_aneurisma.checked = false;	
	doc.primo_trombosi.disabled = true;
	doc.primo_trombosi.checked = false;	
	doc.primo_dito_blu.disabled = true;
	doc.primo_dito_blu.checked = false;
	doc.primo_flebite_coscia.disabled = true;
	doc.primo_flebite_coscia.checked = false;	
	doc.primo_flebite_gamba.disabled = true;
	doc.primo_flebite_gamba.checked = false;	
	doc.primo_sindrome_varicosa.disabled = true;
	doc.primo_sindrome_varicosa.checked = false;
	doc.primo_riduzione_autonomia.disabled = true;
	doc.primo_riduzione_autonomia.checked = false;
	doc.primo_lesioni_arteriose.disabled = true;
	doc.primo_lesioni_arteriose.checked = false;
	doc.primo_altro.disabled = true;
	doc.primo_altro.checked = false;	
	doc.primo_altro_descr.disabled = true;
	doc.primo_altro_descr.value = "";
	
	doc.controllo[0].disabled = false;
	doc.controllo[1].disabled = false;
	doc.controllo[2].disabled = false;
	
	doc.controllo_tvp.disabled = false;
	doc.controllo_rivascolarizzazione.disabled = false;
	doc.controllo_chi_distale.disabled = false;
	doc.controllo_chi_aortica.disabled = false;
	doc.controllo_sindrome_posttr.disabled = false;
	doc.controllo_altro.disabled = false;	
	doc.controllo_da_mesi.disabled = false;
	
	doc.controllo_tvp_mesi.disabled = true;
	doc.controllo_rivascolarizzazione_mesi.disabled = true;
	doc.controllo_altro_descr.disabled = true;
	doc.controllo_chi_distale_mesi.disabled = true;
	doc.controllo_chi_aortica_mesi.disabled = true;
	
	if (doc.controllo_tvp.checked)
		doc.controllo_tvp_mesi.disabled = false;
	if (doc.controllo_rivascolarizzazione.checked)
		doc.controllo_rivascolarizzazione_mesi.disabled = false;
	if (doc.controllo_chi_distale.checked)
		doc.controllo_chi_distale_mesi.disabled = false;
	if (doc.controllo_chi_aortica.checked)
		doc.controllo_chi_aortica_mesi.disabled = false;
	if (doc.controllo_altro.checked)
		doc.controllo_altro_descr.disabled = false;
}//abilita_controllo

/*
	Funzione che controlla se il campo checkbox corrispondente al campo textbox è contrassegnato 
	o meno per abilitare il campo testo
*/
function controlla_checkbox(tipo)
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
	if ((tipo = "controllo_tvp") && (doc.controllo_tvp.checked))
	{
		doc.controllo_tvp_mesi.disabled = false;
	}
	else
	{
		doc.controllo_tvp_mesi.disabled = true;
		doc.controllo_tvp_mesi.value = "";
	}
	if ((tipo = "controllo_rivascolarizzazione") && (doc.controllo_rivascolarizzazione.checked))
	{
		doc.controllo_rivascolarizzazione_mesi.disabled = false;
	}
	else
	{
		doc.controllo_rivascolarizzazione_mesi.disabled = true;
		doc.controllo_rivascolarizzazione_mesi.value = "";
	}
	if ((tipo = "controllo_chi_distale") && (doc.controllo_chi_distale.checked))
	{
		doc.controllo_chi_distale_mesi.disabled = false;
	}
	else
	{
		doc.controllo_chi_distale_mesi.disabled = true;
		doc.controllo_chi_distale_mesi.value = "";
	}
	if ((tipo = "controllo_chi_aortica") && (doc.controllo_chi_aortica.checked))
	{
		doc.controllo_chi_aortica_mesi.disabled = false;
	}
	else
	{
		doc.controllo_chi_aortica_mesi.disabled = true;
		doc.controllo_chi_aortica_mesi.value = "";
	}
}


function registra_tab_app_ecd_arti(provenienza)
{
	var mancano = registra_appropriatezza_esame('tab_app_ecd_arti', 'S', 'S', 'S', 'N', 'N');
	
	var doc = document.form_appr_obbl;
	
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
	
	if(doc.primo_aneurisma.checked)
		doc.hprimo_aneurisma.value = 'S';
	else
		doc.hprimo_aneurisma.value = 'N';
	if(doc.primo_trombosi.checked)	
		doc.hprimo_trombosi.value = 'S';
	else
		doc.hprimo_trombosi.value = 'N';
	if(doc.primo_dito_blu.checked)	
		doc.hprimo_dito_blu.value = 'S';
	else
		doc.hprimo_dito_blu.value = 'N';
	if(doc.primo_flebite_coscia.checked)	
		doc.hprimo_flebite_coscia.value = 'S';
	else
		doc.hprimo_flebite_coscia.value = 'N';
	if(doc.primo_flebite_gamba.checked)	
		doc.hprimo_flebite_gamba.value = 'S';
	else
		doc.hprimo_flebite_gamba.value = 'N';
	if(doc.primo_sindrome_varicosa.checked)	
		doc.hprimo_sindrome_varicosa.value = 'S';
	else
		doc.hprimo_sindrome_varicosa.value = 'N';
	if(doc.primo_riduzione_autonomia.checked)	
		doc.hprimo_riduzione_autonomia.value = 'S';
	else
		doc.hprimo_riduzione_autonomia.value = 'N';
	if(doc.primo_lesioni_arteriose.checked)	
		doc.hprimo_lesioni_arteriose.value = 'S';
	else
		doc.hprimo_lesioni_arteriose.value = 'N';
	if(doc.controllo_tvp.checked)	
		doc.hcontrollo_tvp.value = 'S';
	else
		doc.hcontrollo_tvp.value = 'N';
	if(doc.controllo_rivascolarizzazione.checked)	
		doc.hcontrollo_rivascolarizzazione.value = 'S';
	else
		doc.hcontrollo_rivascolarizzazione.value = 'N';
	if(doc.controllo_chi_distale.checked)	
		doc.hcontrollo_chi_distale.value = 'S';
	else
		doc.hcontrollo_chi_distale.value = 'N';
	if(doc.controllo_chi_aortica.checked)	
		doc.hcontrollo_chi_aortica.value = 'S';
	else
		doc.hcontrollo_chi_aortica.value = 'N';
	if(doc.controllo_sindrome_posttr.checked)	
		doc.hcontrollo_sindrome_posttr.value = 'S';
	else
		doc.hcontrollo_sindrome_posttr.value = 'N';
		
	if(doc.primo_altro.checked)	
		doc.hprimo_altro.value = 'S';
	else
		doc.hprimo_altro.value = 'N';	
	
	//if(registra_appropriatezza_esame('tab_app_ecd_arti', 'S', 'S', 'S', 'N', 'N'))
	//{
		if (!doc.primo_esame[0].checked && !doc.primo_esame[1].checked)
		{
			mancano += '- PRIMO ESAME O CONTROLLO\n';//alert(ritornaJsMsg("alert_primo_esame"));//Prego, inserire se è un primo esame od un controllo
		}
			
		if(!doc.controllo[0].checked && !doc.controllo[1].checked && !doc.controllo[2].checked && doc.primo_esame[1].checked)
		{
			mancano += '- PRIMO ESAME/CONTROLLO\n';//alert(ritornaJsMsg("alert_controllo"));//Prego, inserire un controllo(primo,secondo,terzo o successivo)
		}
		/*	
		if ((isNaN(doc.controllo_da_mesi.value)) && (doc.controllo_da_mesi.value != ''))
		{
			alert(ritornaJsMsg("alert_val_errato"));
			doc.controllo_da_mesi.focus();
			return;
		}
		if ((isNaN(doc.controllo_tvp_mesi.value)) && (doc.controllo_tvp_mesi.value != ''))
		{
			alert(ritornaJsMsg("alert_val_errato"));
			doc.controllo_tvp_mesi.focus();
			return;
		}
		if ((isNaN(doc.controllo_rivascolarizzazione_mesi.value)) && (doc.controllo_rivascolarizzazione_mesi.value != ''))
		{
			alert(ritornaJsMsg("alert_val_errato"));
			doc.controllo_rivascolarizzazione_mesi.focus();
			return;
		}
		if ((isNaN(doc.controllo_chi_distale_mesi.value)) && (doc.controllo_chi_distale_mesi.value != ''))
		{
			alert(ritornaJsMsg("alert_val_errato"));
			doc.controllo_chi_distale_mesi.focus();
			return;
		}
		if ((isNaN(doc.controllo_chi_aortica_mesi.value)) && (doc.controllo_chi_aortica_mesi.value != ''))
		{
			alert(ritornaJsMsg("alert_val_errato"));
			doc.controllo_chi_aortica_mesi.focus();
			return;
		
		}
		*/
		
		if(mancano != '')
		{
			alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
			return;
		}
		
		ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_ECD_ARTI', 'S', 'S', 'S', 'N', 'N');
	//}//if
}//registra_tab_app_ecd_arti()



function insert_tab_app_ecd_arti(provenienza)
{
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';

	var doc = document.form_appr_obbl;	
	var insert = 'insert into tab_app_ecd_arti ';
	
	insert += "(iden_esame, fatt_rischio_diabete, fatt_rischio_cardio, fatt_rischio_iperten, fatt_rischio_dislipi, fatt_rischio_arterio, ";
	insert += "fatt_rischio_fumo, fatt_rischio_familiarita, fatt_rischio_altro, fatt_rischio_altro_descr, ";			
	insert += "controllo_primo, controllo_secondo, controllo_terzo, ";
	insert += "primo_aneurisma, primo_trombosi, primo_dito_blu, primo_flebite_coscia, primo_flebite_gamba, primo_sindrome_varicosa, ";
	insert += "primo_riduzione_autonomia, primo_lesioni_arteriose, primo_altro, primo_altro_descr, ";
	insert += "controllo_da_mesi, controllo_tvp, controllo_tvp_mesi, controllo_rivascolarizzazione, controllo_rivascolarizz_mesi, ";
	insert += "controllo_chi_distale, controllo_chi_distale_mesi, controllo_chi_aortica, controllo_chi_aortica_mesi, ";
	insert += "controllo_sindrome_posttr, controllo_altro, controllo_altro_descr";
	insert += ")";			
	
	insert += " values (";
	
	var esami = doc.iden_esame.value;
	//alert('Esami: ' + esami);	
	
	if(esami.indexOf(",") > -1 )
		esami = esami.split(",")[0];
					
	insert +=  esami  + ", " + verifica_campo(doc.hfr_diabete.value) + ", " + verifica_campo(doc.hfr_cardio.value) + ", ";	
	insert +=  verifica_campo(doc.hfr_iperten.value)  + ", " + verifica_campo(doc.hfr_dislipi.value) + ", " + verifica_campo(doc.hfr_arterio.value) + ", ";
	insert +=  verifica_campo(doc.hfr_fumo.value)  + ", " + verifica_campo(doc.hfr_familiarita.value) + ", " + verifica_campo(doc.hfr_altro.value) + ", ";
	insert +=  verifica_campo(doc.altro_descr.value)  + ", " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_secondo.value) + ", " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_aneurisma.value)  + ", " + verifica_campo(doc.hprimo_trombosi.value) + ", " + verifica_campo(doc.hprimo_dito_blu.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_flebite_coscia.value)  + ", " + verifica_campo(doc.hprimo_flebite_gamba.value) + ", " + verifica_campo(doc.hprimo_sindrome_varicosa.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_riduzione_autonomia.value)  + ", " + verifica_campo(doc.hprimo_lesioni_arteriose.value) + ", " + verifica_campo(doc.hprimo_altro.value) + ", ";
	insert +=  verifica_campo(doc.primo_altro_descr.value)  + ", " + verifica_campo(doc.controllo_da_mesi.value) + ", " + verifica_campo(doc.hcontrollo_tvp.value) + ", ";
	insert +=  verifica_campo(doc.controllo_tvp_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_rivascolarizzazione.value) + ", " + verifica_campo(doc.controllo_rivascolarizzazione_mesi.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_chi_distale.value)  + ", " + verifica_campo(doc.controllo_chi_distale_mesi.value) + ", " + verifica_campo(doc.hcontrollo_chi_aortica.value) + ", ";
	
	insert +=  verifica_campo(doc.controllo_chi_aortica_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_sindrome_posttr.value) + ", " + verifica_campo(doc.hcontrollo_altro.value) + ", ";
	
	insert +=  verifica_campo(doc.controllo_altro_descr.value)  + "";
	
	
	insert += ")";				
	
	DOC_UPD.query_tab_specifica.value = insert;
	DOC_UPD.query_appropriatezza_esame.value = query_appropriatezza_esame;
	
	//alert('insert into APPROPRIATEZZA_ESAME: ' + document.form_update.query_appropriatezza_esame.value);
	//alert('insert into TAB_APP_ECD_ARTI: ' + document.form_update.query_tab_specifica.value);

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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_arti);
		dwr.engine.setAsync(true);
	}*/
}


function update_tab_app_ecd_arti(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_ecd_arti set ';
	update += "fatt_rischio_diabete = " + verifica_campo(doc.hfr_diabete.value) + ", ";
	update += "fatt_rischio_cardio = " + verifica_campo(doc.hfr_cardio.value) + ", ";
	update += "fatt_rischio_iperten = " + verifica_campo(doc.hfr_iperten.value) + ", ";
	update += "fatt_rischio_dislipi = " + verifica_campo(doc.hfr_dislipi.value) + ", ";
	update += "fatt_rischio_arterio = " + verifica_campo(doc.hfr_arterio.value) + ", ";
	update += "fatt_rischio_fumo = " + verifica_campo(doc.hfr_fumo.value) + ", ";
	update += "fatt_rischio_familiarita = " + verifica_campo(doc.hfr_familiarita.value) + ", ";
	update += "fatt_rischio_altro = " + verifica_campo(doc.hfr_altro.value) + ", ";
	update += "fatt_rischio_altro_descr = " + verifica_campo(doc.altro_descr.value) + ", ";
	
	update += "primo_aneurisma = " + verifica_campo(doc.hprimo_aneurisma.value) + ", ";
	update += "primo_trombosi = " + verifica_campo(doc.hprimo_trombosi.value) + ", ";
	update += "primo_dito_blu = " + verifica_campo(doc.hprimo_dito_blu.value) + ", ";
	update += "primo_flebite_coscia = " + verifica_campo(doc.hprimo_flebite_coscia.value) + ", ";
	update += "primo_flebite_gamba = " + verifica_campo(doc.hprimo_flebite_gamba.value) + ", ";
	update += "primo_sindrome_varicosa = " + verifica_campo(doc.hprimo_sindrome_varicosa.value) + ", ";
	update += "primo_riduzione_autonomia = " + verifica_campo(doc.hprimo_riduzione_autonomia.value) + ", ";
	update += "primo_lesioni_arteriose = " + verifica_campo(doc.hprimo_lesioni_arteriose.value) + ", ";
	update += "primo_altro = " + verifica_campo(doc.hprimo_altro.value) + ", ";
	update += "primo_altro_descr = " + verifica_campo(doc.primo_altro_descr.value) + ", ";
	update += "controllo_primo = " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	update += "controllo_secondo = " + verifica_campo(doc.hcontrollo_secondo.value) + ", ";
	update += "controllo_terzo = " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	update += "controllo_da_mesi = " + verifica_campo(doc.controllo_da_mesi.value) + ", ";
	update += "controllo_tvp = " + verifica_campo(doc.hcontrollo_tvp.value) + ", ";
	update += "controllo_tvp_mesi = " + verifica_campo(doc.controllo_tvp_mesi.value) + ", ";
	update += "controllo_rivascolarizzazione = " + verifica_campo(doc.hcontrollo_rivascolarizzazione.value) + ", ";
	update += "controllo_rivascolarizz_mesi = " + verifica_campo(doc.controllo_rivascolarizzazione_mesi.value) + ", ";
	update += "controllo_chi_distale = " + verifica_campo(doc.hcontrollo_chi_distale.value) + ", ";
	update += "controllo_chi_distale_mesi = " + verifica_campo(doc.controllo_chi_distale_mesi.value) + ", ";
	update += "controllo_chi_aortica = " + verifica_campo(doc.hcontrollo_chi_aortica.value) + ", ";
	update += "controllo_chi_aortica_mesi = " + verifica_campo(doc.controllo_chi_aortica_mesi.value) + ", ";
	update += "controllo_sindrome_posttr = " + verifica_campo(doc.hcontrollo_sindrome_posttr.value) + ", ";
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
	var insert = 'insert into tab_app_ecd_arti ';
	
	insert += "(iden_esame, fatt_rischio_diabete, fatt_rischio_cardio, fatt_rischio_iperten, fatt_rischio_dislipi, fatt_rischio_arterio, ";
	insert += "fatt_rischio_fumo, fatt_rischio_familiarita, fatt_rischio_altro, fatt_rischio_altro_descr, ";			
	insert += "controllo_primo, controllo_secondo, controllo_terzo, ";
	insert += "primo_aneurisma, primo_trombosi, primo_dito_blu, primo_flebite_coscia, primo_flebite_gamba, primo_sindrome_varicosa, ";
	insert += "primo_riduzione_autonomia, primo_lesioni_arteriose, primo_altro, primo_altro_descr, ";
	insert += "controllo_da_mesi, controllo_tvp, controllo_tvp_mesi, controllo_rivascolarizzazione, controllo_rivascolarizz_mesi, ";
	insert += "controllo_chi_distale, controllo_chi_distale_mesi, controllo_chi_aortica, controllo_chi_aortica_mesi, ";
	insert += "controllo_sindrome_posttr, controllo_altro, controllo_altro_descr";
	insert += ")";			
	
	insert += " values (";
	insert +=  doc.iden_esame.value  + ", " + verifica_campo(doc.hfr_diabete.value) + ", " + verifica_campo(doc.hfr_cardio.value) + ", ";	
	insert +=  verifica_campo(doc.hfr_iperten.value)  + ", " + verifica_campo(doc.hfr_dislipi.value) + ", " + verifica_campo(doc.hfr_arterio.value) + ", ";
	insert +=  verifica_campo(doc.hfr_fumo.value)  + ", " + verifica_campo(doc.hfr_familiarita.value) + ", " + verifica_campo(doc.hfr_altro.value) + ", ";
	insert +=  verifica_campo(doc.altro_descr.value)  + ", " + verifica_campo(doc.hcontrollo_primo.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_secondo.value) + ", " + verifica_campo(doc.hcontrollo_terzo.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_aneurisma.value)  + ", " + verifica_campo(doc.hprimo_trombosi.value) + ", " + verifica_campo(doc.hprimo_dito_blu.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_flebite_coscia.value)  + ", " + verifica_campo(doc.hprimo_flebite_gamba.value) + ", " + verifica_campo(doc.hprimo_sindrome_varicosa.value) + ", ";
	insert +=  verifica_campo(doc.hprimo_riduzione_autonomia.value)  + ", " + verifica_campo(doc.hprimo_lesioni_arteriose.value) + ", " + verifica_campo(doc.hprimo_altro.value) + ", ";
	insert +=  verifica_campo(doc.primo_altro_descr.value)  + ", " + verifica_campo(doc.controllo_da_mesi.value) + ", " + verifica_campo(doc.hcontrollo_tvp.value) + ", ";
	insert +=  verifica_campo(doc.controllo_tvp_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_rivascolarizzazione.value) + ", " + verifica_campo(doc.controllo_rivascolarizzazione_mesi.value) + ", ";
	insert +=  verifica_campo(doc.hcontrollo_chi_distale.value)  + ", " + verifica_campo(doc.controllo_chi_distale_mesi.value) + ", " + verifica_campo(doc.hcontrollo_chi_aortica.value) + ", ";
	
	insert +=  verifica_campo(doc.controllo_chi_aortica_mesi.value)  + ", " + verifica_campo(doc.hcontrollo_sindrome_posttr.value) + ", " + verifica_campo(doc.hcontrollo_altro.value) + ", ";
	
	insert +=  verifica_campo(doc.controllo_altro_descr.value)  + "";
	
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_arti);	
		dwr.engine.setAsync(true);
	}*/
}//update_tab_app_ecd_arti()

/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_ecd_arti(message)
{
	/*20080617*/
	document.form_rows_lock.hblocco.value = 'OK';
	
	CJsEMAltraSchedaAppr = null;
	var idenEsame_elencoEsami_statiEsami = message.split('@');
	
	//alert(idenEsame_elencoEsami_statiEsami);
	
	if(idenEsame_elencoEsami_statiEsami[0] == '')
	{
		//non ci sono più schede di appropriatezza da inserire
		var fin_scheda_esame_taea = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		if(fin_scheda_esame_taea)
			fin_scheda_esame_taea.focus();
		else
			fin_scheda_esame_taea = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
		
		fin_scheda_esame_taea.opener = opener;
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_taea = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		if(finestra_taea)
			finestra_taea.focus();
		else
			finestra_taea = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
		
		finestra_taea.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_ecd_arti);	
		dwr.engine.setAsync(true);
	}
}