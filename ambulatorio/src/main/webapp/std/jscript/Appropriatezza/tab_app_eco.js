/*
Funzione che viene chiamata all'onLoad della pagina e verifica mediante un controllo
sul campo obbligatorio 'specifica_quesito' se siamo nel caso dell'inserimento o dell'aggiornamento.
Se siamo nel caso dell'inserimento disabilito tutti i campi per quanto riguarda la parte
di Controllo Richiesto - Quesito Diagnostico.
Nel caso dell'aggiornamento abilito solo i checkbox che dipendono dal Controllo Richiesto precedentemente
salvato.
*/
function load_scheda_eco()
{
	var doc = document.form_appr_obbl;
	if(doc.specifica_quesito[0].checked  || doc.specifica_quesito[1].checked)
	{//fase di update
		if(doc.controllo_epato.checked)
			abilita_controllo_epato(false);
		else
			abilita_controllo_epato(true);
			
		if(doc.controllo_rene.checked)
			abilita_controllo_rene(false);
		else
			abilita_controllo_rene(true);	
			
		if(doc.controllo_gine.checked)
			abilita_controllo_gine(false);
		else
			abilita_controllo_gine(true);		
			
		if(doc.controllo_tiroide.checked)
			abilita_controllo_tiroide(false);
		else
			abilita_controllo_tiroide(true);		
			
		if(doc.controllo_tessuti.checked)
			abilita_controllo_tessuti(false);
		else
			abilita_controllo_tessuti(true);		
	
		if(doc.controllo_senologia.checked)
			abilita_ecografia_mammaria(false);
		else
			abilita_ecografia_mammaria(true);			
		}
	else
	{//fase di inserimento
		abilita_controllo_epato(true);
		abilita_controllo_rene(true);
		abilita_controllo_gine(true);
		abilita_controllo_tiroide(true);
		abilita_controllo_tessuti(true);
		abilita_ecografia_mammaria(true);
	}
	
	doc.que_epato_non_spec.disabled = true;
	doc.que_epato_altro_descr.disabled = true;
	doc.que_epato_altro.disabled = true;
	
	doc.que_rene_non_spec.disabled = true;
	doc.que_rene_altro_descr.disabled = true;
	doc.que_rene_altro.disabled = true;
	
	doc.que_gine_non_spec.disabled = true;
	doc.que_gine_altro_descr.disabled = true;
	doc.que_gine_altro.disabled = true;

	doc.que_tiroide_non_spec.disabled = true;
	doc.que_tiroide_altro_descr.disabled = true;
	doc.que_tiroide_altro.disabled = true;
	
	doc.que_tessuti_non_spec.disabled = true;
	doc.que_tessuti_altro_descr.disabled = true;
	doc.que_tessuti_altro.disabled = true;
}


function registra_tab_app_eco(provenienza)
{
	var doc = document.form_appr_obbl;	
	var mancano = registra_appropriatezza_esame('tab_app_eco', 'N', 'S', 'N', 'N', 'N');
	
	//if(registra_appropriatezza_esame('tab_app_eco', 'N', 'S', 'N', 'N', 'N')){
	if(doc.tipo_esame[0].checked)
		doc.htipo_esame.value = 'P';
	if(doc.tipo_esame[1].checked)
		doc.htipo_esame.value = 'C';
	
	//if(doc.tipo_esame[2].checked)
		//doc.htipo_esame.value = 'S';		
	
	if(doc.tipo_richiesta[0].checked)
		doc.htipo_richiesta.value = 'G';
	if(doc.tipo_richiesta[1].checked)
		doc.htipo_richiesta.value = 'S';		
	if(doc.controllo_epato.checked)
		doc.hcontrollo_epato.value = 'S';
	else
		doc.hcontrollo_epato.value = 'N';
		
	if(doc.controllo_senologia.checked)
		doc.hcontrollo_senologia.value = 'S';
	else
		doc.hcontrollo_senologia.value = 'N';
	
		
	if(doc.controllo_rene.checked)
		doc.hcontrollo_rene.value = 'S';
	else
		doc.hcontrollo_rene.value = 'N';
	if(doc.controllo_gine.checked)
		doc.hcontrollo_gine.value = 'S';
	else
		doc.hcontrollo_gine.value = 'N';		
	if(doc.controllo_tiroide.checked)
		doc.hcontrollo_tiroide.value = 'S';
	else
		doc.hcontrollo_tiroide.value = 'N';
	if(doc.controllo_tessuti.checked)
		doc.hcontrollo_tessuti.value = 'S';
	else
		doc.hcontrollo_tessuti.value = 'N';	
		
	if(doc.htipo_esame.value == '')
	{
		mancano += '- PRIMA DIAGNOSI O CONTROLLO\n';//alert(ritornaJsMsg("alert_te"));//Prego, inserire se si tratta di prima diagnosi o controllo
	}
	
	if(doc.htipo_richiesta.value == '')
	{
		mancano += '- TIPO RICHIESTA\n';//alert(ritornaJsMsg("alert_tr"));//Prego, inserire il tipo della richiesta
	}
	
	if(!doc.controllo_epato.checked && !doc.controllo_senologia.checked && !doc.controllo_rene.checked && !doc.controllo_gine.checked && !doc.controllo_tiroide.checked && 
	   !doc.controllo_tessuti.checked)
	{
		mancano += '- CONTROLLO RICHIESTO\n';//alert(ritornaJsMsg("alert_cr"));//Prego, inserire un controllo
	}
	
	if(doc.que_epato_calcolosi.checked)
		doc.hque_epato_calcolosi.value = 'S';
	else
		doc.hque_epato_calcolosi.value = 'N';
	if(doc.que_epato_coleciste.checked)
		doc.hque_epato_coleciste.value = 'S';
	else
		doc.hque_epato_coleciste.value = 'N';
	if(doc.que_epato_steatori_epatica.checked)
		doc.hque_epato_steatori_epatica.value = 'S';
	else
		doc.hque_epato_steatori_epatica.value = 'N';
	if(doc.que_epato_lesioni_focali.checked)
		doc.hque_epato_lesioni_focali.value = 'S';
	else
		doc.hque_epato_lesioni_focali.value = 'N';
	if(doc.que_epato_epatite.checked)
		doc.hque_epato_epatite.value = 'S';
	else
		doc.hque_epato_epatite.value = 'N';
	if(doc.que_epato_polipi.checked)
		doc.hque_epato_polipi.value = 'S';
	else
		doc.hque_epato_polipi.value = 'N';
	if(doc.que_epato_non_spec.checked)
		doc.hque_epato_non_spec.value = 'S';
	else
		doc.hque_epato_non_spec.value = 'N';
	if(doc.que_epato_altro.checked)
		doc.hque_epato_altro.value = 'S';
	else
		doc.hque_epato_altro.value = 'N';
	
	if(doc.que_rene_cisti.checked)
		doc.hque_rene_cisti.value = 'S';
	else
		doc.hque_rene_cisti.value = 'N';
	if(doc.que_rene_ins_renale.checked)
		doc.hque_rene_ins_renale.value = 'S';
	else
		doc.hque_rene_ins_renale.value = 'N';
	if(doc.que_rene_sclero.checked)
		doc.hque_rene_sclero.value = 'S';
	else
		doc.hque_rene_sclero.value = 'N';
	if(doc.que_rene_non_spec.checked)
		doc.hque_rene_non_spec.value = 'S';
	else
		doc.hque_rene_non_spec.value = 'N';
	if(doc.que_rene_altro.checked)
		doc.hque_rene_altro.value = 'S';
	else
		doc.hque_rene_altro.value = 'N';
		
	if(doc.que_gine_fibromi.checked)
		doc.hque_gine_fibromi.value = 'S';
	else
		doc.hque_gine_fibromi.value = 'N';	
	if(doc.que_gine_isterectomia.checked)
		doc.hque_gine_isterectomia.value = 'S';
	else
		doc.hque_gine_isterectomia.value = 'N';	
	if(doc.que_gine_non_spec.checked)
		doc.hque_gine_non_spec.value = 'S';
	else
		doc.hque_gine_non_spec.value = 'N';	
	if(doc.que_gine_altro.checked)
		doc.hque_gine_altro.value = 'S';
	else
		doc.hque_gine_altro.value = 'N';		
	
	if(doc.que_tiroide_noduli.checked)
		doc.hque_tiroide_noduli.value = 'S';
	else
		doc.hque_tiroide_noduli.value = 'N';
	if(doc.que_tiroide_senza_noduli.checked)
		doc.hque_tiroide_senza_noduli.value = 'S';
	else
		doc.hque_tiroide_senza_noduli.value = 'N';	
	if(doc.que_tiroide_cronica.checked)
		doc.hque_tiroide_cronica.value = 'S';
	else
		doc.hque_tiroide_cronica.value = 'N';	
	if(doc.que_tiroide_non_spec.checked)
		doc.hque_tiroide_non_spec.value = 'S';
	else
		doc.hque_tiroide_non_spec.value = 'N';	
	if(doc.que_tiroide_altro.checked)
		doc.hque_tiroide_altro.value = 'S';
	else
		doc.hque_tiroide_altro.value = 'N';	
	
	if(doc.que_tessuti_cisti.checked)
		doc.hque_tessuti_cisti.value = 'S';
	else
		doc.hque_tessuti_cisti.value = 'N';	
	
	/*
	if(doc.que_tessuti_pregressa.checked)
		doc.hque_tessuti_pregressa.value = 'S';
	else
		doc.hque_tessuti_pregressa.value = 'N';	
	*/
	
	if(doc.que_tessuti_nuclei.checked)
		doc.hque_tessuti_nuclei.value = 'S';
	else
		doc.hque_tessuti_nuclei.value = 'N';	
	if(doc.que_tessuti_non_spec.checked)
		doc.hque_tessuti_non_spec.value = 'S';
	else
		doc.hque_tessuti_non_spec.value = 'N';	
	if(doc.que_tessuti_altro.checked)
		doc.hque_tessuti_altro.value = 'S';
	else
		doc.hque_tessuti_altro.value = 'N';		
		
		
	if(doc.ecografia_mammaria[0].checked)
		doc.hecografia_mammaria.value = '0';
	if(doc.ecografia_mammaria[1].checked)
		doc.hecografia_mammaria.value = '1';
	if(doc.ecografia_mammaria[2].checked)
		doc.hecografia_mammaria.value = '2';			
	
	if(mancano != '')
	{
		alert(ritornaJsMsg('alert_mancano') + '\n' + mancano);
		return;
	}
	
	ins_upd_appropriatezza_esame(provenienza, 'TAB_APP_ECO', 'N', 'S', 'N', 'N', 'N');
		
	//}//if
}//registra_tab_app_eco


function abilita_controllo_epato(parametro)
{
	var doc = document.form_appr_obbl;	
	doc.que_epato_calcolosi.disabled = parametro;
	doc.que_epato_coleciste.disabled = parametro;
	doc.que_epato_steatori_epatica.disabled = parametro;
	doc.que_epato_lesioni_focali.disabled = parametro;
	doc.que_epato_epatite.disabled = parametro;
	doc.que_epato_polipi.disabled = parametro;
	//doc.que_epato_non_spec.disabled = parametro;
	//doc.que_epato_altro.disabled = parametro;
	
	if(parametro)
	{
		doc.que_epato_calcolosi.checked = !parametro;
		doc.que_epato_coleciste.checked = !parametro;
		doc.que_epato_steatori_epatica.checked = !parametro;
		doc.que_epato_lesioni_focali.checked = !parametro;
		doc.que_epato_epatite.checked = !parametro;
		doc.que_epato_polipi.checked = !parametro;
		//doc.que_epato_non_spec.checked = !parametro;
		//doc.que_epato_altro.checked = !parametro;
	}
	/*if(doc.que_epato_altro.checked)
		doc.que_epato_altro_descr.disabled = false;
	else
	{
		doc.que_epato_altro_descr.disabled = true;
		doc.que_epato_altro_descr.value = '';
	}*/
}


function abilita_controllo_rene(parametro)
{
	var doc = document.form_appr_obbl;	
	doc.que_rene_cisti.disabled = parametro;
	doc.que_rene_ins_renale.disabled = parametro;
	doc.que_rene_sclero.disabled = parametro;
	//doc.que_rene_non_spec.disabled = parametro;
	//doc.que_rene_altro.disabled = parametro;
	
	if(parametro)
	{	
		doc.que_rene_cisti.checked = !parametro;
		doc.que_rene_ins_renale.checked = !parametro;
		doc.que_rene_sclero.checked = !parametro;
		//doc.que_rene_non_spec.checked = !parametro;
		//doc.que_rene_altro.checked = !parametro;
	}
	/*if(doc.que_rene_altro.checked)
		doc.que_rene_altro_descr.disabled = false;
	else
	{
		doc.que_rene_altro_descr.disabled = true;
		doc.que_rene_altro_descr.value = '';
	}*/
}

function abilita_controllo_gine(parametro)
{
	var doc = document.form_appr_obbl;	
	doc.que_gine_fibromi.disabled = parametro;
	doc.que_gine_isterectomia.disabled = parametro;
	//doc.que_gine_non_spec.disabled = parametro;
	//doc.que_gine_altro.disabled = parametro;
	
	if(parametro)
	{
		doc.que_gine_fibromi.checked = !parametro;
		doc.que_gine_isterectomia.checked = !parametro;
		//doc.que_gine_non_spec.checked = !parametro;
		//doc.que_gine_altro.checked = !parametro;
	}
	/*
	if(doc.que_gine_altro.checked)
		doc.que_gine_altro_descr.disabled = false;
	else
	{
		doc.que_gine_altro_descr.disabled = true;
		doc.que_gine_altro_descr.value = '';
	}*/
}


function abilita_controllo_tiroide(parametro)
{
	var doc = document.form_appr_obbl;	
	doc.que_tiroide_noduli.disabled = parametro;
	doc.que_tiroide_senza_noduli.disabled = parametro;
	doc.que_tiroide_cronica.disabled = parametro;
	//doc.que_tiroide_non_spec.disabled = parametro;
	//doc.que_tiroide_altro.disabled = parametro;
	
	if(parametro)
	{
		doc.que_tiroide_noduli.checked = !parametro;
		doc.que_tiroide_senza_noduli.checked = !parametro;
		doc.que_tiroide_cronica.checked = !parametro;
		//doc.que_tiroide_non_spec.checked = !parametro;
		//doc.que_tiroide_altro.checked = !parametro;
	}
	/*
	if(doc.que_tiroide_altro.checked)
		doc.que_tiroide_altro_descr.disabled = false;
	else
	{
		doc.que_tiroide_altro_descr.disabled = true;
		doc.que_tiroide_altro_descr.value = '';
	}*/
}


function abilita_controllo_tessuti(parametro)
{
	var doc = document.form_appr_obbl;
	doc.que_tessuti_cisti.disabled = parametro;
	//doc.que_tessuti_pregressa.disabled = parametro;
	doc.que_tessuti_nuclei.disabled = parametro;
	//doc.que_tessuti_non_spec.disabled = parametro;
	//doc.que_tessuti_altro.disabled = parametro;
	
	if(parametro)
	{
		doc.que_tessuti_cisti.checked = !parametro;
		//doc.que_tessuti_pregressa.checked = !parametro;
		doc.que_tessuti_nuclei.checked = !parametro;
		doc.que_tessuti_non_spec.checked = !parametro;
		//doc.que_tessuti_altro.checked = !parametro;
		//doc.que_tessuti_altro_descr.checked = !parametro;
	}
	/*
	if(doc.que_tessuti_altro.checked)
		doc.que_tessuti_altro_descr.disabled = false;
	else
	{
		doc.que_tessuti_altro_descr.disabled = true;
		doc.que_tessuti_altro_descr.value = '';
	}*/
}



function insert_tab_app_eco(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var insert = "insert into tab_app_eco (";
	insert += 'iden_esame, tipo_esame, tipo_richiesta, ';
	insert += 'controllo_epato, controllo_rene, controllo_gine, controllo_tiroide, controllo_tessuti, ';
	insert += 'que_epato_calcolosi, que_epato_coleciste, que_epato_steatori_epatica, que_epato_lesioni_focali, ';
	insert += 'que_epato_epatite, que_epato_polipi, que_epato_non_spec, que_epato_altro, que_epato_altro_descr, ';
	insert += 'que_rene_cisti, que_rene_ins_renale, que_rene_sclero, que_rene_non_spec, que_rene_altro, que_rene_altro_descr, ';
	insert += 'que_gine_fibromi, que_gine_isterectomia, que_gine_non_spec, que_gine_altro, que_gine_altro_descr, ';
	insert += 'que_tiroide_noduli, que_tiroide_senza_noduli, que_tiroide_cronica, que_tiroide_non_spec, que_tiroide_altro, '; 
	insert += 'que_tiroide_altro_descr, ';
	insert += 'que_tessuti_cisti, que_tessuti_nuclei, que_tessuti_non_spec, que_tessuti_altro, ';//que_tessuti_pregressa,
	insert += "que_tessuti_altro_descr, ecografia_mammaria, controllo_senologia) values (";
	
	var esami = doc.iden_esame.value;
	//alert('Esami: ' + esami);	
	
	if(esami.indexOf(",") > -1 )
		esami = esami.split(",")[0];
	
	
	insert += esami + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", " + verifica_campo(doc.htipo_richiesta.value) + ", ";
	insert += verifica_campo(doc.hcontrollo_epato.value) + ", " + verifica_campo(doc.hcontrollo_rene.value) + ", " + verifica_campo(doc.hcontrollo_gine.value)  + ", ";
	insert += verifica_campo(doc.hcontrollo_tiroide.value) + ", " + verifica_campo(doc.hcontrollo_tessuti.value) + ", ";
	insert += verifica_campo(doc.hque_epato_calcolosi.value)  + ", " + verifica_campo(doc.hque_epato_coleciste.value) + ", " + verifica_campo(doc.hque_epato_steatori_epatica.value) + ", ";
	insert += verifica_campo(doc.hque_epato_lesioni_focali.value) + ", " + verifica_campo(doc.hque_epato_epatite.value) + ", " + verifica_campo(doc.hque_epato_polipi.value) + ", "; 
	insert += verifica_campo(doc.hque_epato_non_spec.value) + ", " + verifica_campo(doc.hque_epato_altro.value) + ", " + verifica_campo(doc.que_epato_altro_descr.value) + ", ";
	insert += verifica_campo(doc.hque_rene_cisti.value) + ", " + verifica_campo(doc.hque_rene_ins_renale.value) + ", " + verifica_campo(doc.hque_rene_sclero.value) + ", ";
	insert += verifica_campo(doc.hque_rene_non_spec.value) + ", " + verifica_campo(doc.hque_rene_altro.value) + ", " + verifica_campo(doc.que_rene_altro_descr.value) + ", "; 
	insert += verifica_campo(doc.hque_gine_fibromi.value) + ", " + verifica_campo(doc.hque_gine_isterectomia.value) + ", " + verifica_campo(doc.hque_gine_non_spec.value) + ", "; 
	insert += verifica_campo(doc.hque_gine_altro.value) + ", " + verifica_campo(doc.que_gine_altro_descr.value) + ", "; 
	insert += verifica_campo(doc.hque_tiroide_noduli.value) + ", " + verifica_campo(doc.hque_tiroide_senza_noduli.value) + ", " + verifica_campo(doc.hque_tiroide_cronica.value) + ", ";
	insert += verifica_campo(doc.hque_tiroide_non_spec.value) + ", " + verifica_campo(doc.hque_tiroide_altro.value) + ", " + verifica_campo(doc.que_tiroide_altro_descr.value) + ", ";
	insert += verifica_campo(doc.hque_tessuti_cisti.value) + ", "  + verifica_campo(doc.hque_tessuti_nuclei.value) + ", ";//+ verifica_campo(doc.hque_tessuti_pregressa.value) + ", "
	insert += verifica_campo(doc.hque_tessuti_non_spec.value) + ", " + verifica_campo(doc.hque_tessuti_altro.value) + ", " + verifica_campo(doc.que_tessuti_altro_descr.value) + ", ";
	insert += verifica_campo(doc.hecografia_mammaria.value) + ", ";
	insert += verifica_campo(doc.hcontrollo_senologia.value);
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
	{
		chiudi();
	}
	else	
	{
		dwr.engine.setAsync(false);
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_eco);		
		dwr.engine.setAsync(true);
	}*/
}//insert_tab_app_eco



function update_tab_app_eco(provenienza)
{
	var doc = document.form_appr_obbl;	
	
	var DOC_UPD = document.form_update;
	DOC_UPD.target  = 'win_appropriatezza';
	DOC_UPD.action  = 'Update';
	DOC_UPD.method = 'POST';
	
	var update = 'update tab_app_eco set ';
	update += "tipo_esame = " + verifica_campo(doc.htipo_esame.value) + ", ";
	update += "controllo_senologia = " + verifica_campo(doc.hcontrollo_senologia.value) + ", ";
	update += "tipo_richiesta = " + verifica_campo(doc.htipo_richiesta.value) + ", ";
	update += "controllo_epato = " + verifica_campo(doc.hcontrollo_epato.value) + ", ";
	update += "controllo_rene = " + verifica_campo(doc.hcontrollo_rene.value) + ", ";
	update += "controllo_gine = " + verifica_campo(doc.hcontrollo_gine.value) + ", ";
	update += "controllo_tiroide = " + verifica_campo(doc.hcontrollo_tiroide.value) + ", ";
	update += "controllo_tessuti = " + verifica_campo(doc.hcontrollo_tessuti.value) + ", ";
	update += "que_epato_calcolosi = " + verifica_campo(doc.hque_epato_calcolosi.value) + ", ";
	update += "que_epato_coleciste = " + verifica_campo(doc.hque_epato_coleciste.value) + ", ";
	update += "que_epato_steatori_epatica = " + verifica_campo(doc.hque_epato_steatori_epatica.value) + ", ";
	update += "que_epato_lesioni_focali = " + verifica_campo(doc.hque_epato_lesioni_focali.value) + ", ";
	update += "que_epato_epatite = " + verifica_campo(doc.hque_epato_epatite.value) + ", ";
	update += "que_epato_polipi = " + verifica_campo(doc.hque_epato_polipi.value) + ", ";
	update += "que_epato_non_spec = " + verifica_campo(doc.hque_epato_non_spec.value) + ", ";
	update += "que_epato_altro = " + verifica_campo(doc.hque_epato_altro.value) + ", ";
	update += "que_epato_altro_descr = " + verifica_campo(doc.que_epato_altro_descr.value) + ", ";
	update += "que_rene_cisti = " + verifica_campo(doc.hque_rene_cisti.value) + ", ";
	update += "que_rene_ins_renale = " + verifica_campo(doc.hque_rene_ins_renale.value) + ", ";
	update += "que_rene_sclero = " + verifica_campo(doc.hque_rene_sclero.value) + ", ";
	update += "que_rene_non_spec = " + verifica_campo(doc.hque_rene_non_spec.value) + ", ";
	update += "que_rene_altro = " + verifica_campo(doc.hque_rene_altro.value) + ", ";
	update += "que_rene_altro_descr = " + verifica_campo(doc.que_rene_altro_descr.value) + ", ";
	update += "que_gine_fibromi = " + verifica_campo(doc.hque_gine_fibromi.value) + ", ";
	update += "que_gine_isterectomia = " + verifica_campo(doc.hque_gine_isterectomia.value) + ", ";
	update += "que_gine_non_spec = " + verifica_campo(doc.hque_gine_non_spec.value) + ", ";
	update += "que_gine_altro = " + verifica_campo(doc.hque_gine_altro.value) + ", ";
	update += "que_gine_altro_descr = " + verifica_campo(doc.que_gine_altro_descr.value) + ", ";
	update += "que_tiroide_noduli = " + verifica_campo(doc.hque_tiroide_noduli.value) + ", ";
	update += "que_tiroide_senza_noduli = " + verifica_campo(doc.hque_tiroide_senza_noduli.value) + ", ";
	update += "que_tiroide_cronica = " + verifica_campo(doc.hque_tiroide_cronica.value) + ", ";
	update += "que_tiroide_non_spec = " + verifica_campo(doc.hque_tiroide_non_spec.value) + ", ";
	update += "que_tiroide_altro = " + verifica_campo(doc.hque_tiroide_altro.value) + ", ";
	update += "que_tiroide_altro_descr = " + verifica_campo(doc.que_tiroide_altro_descr.value) + ", ";
	update += "que_tessuti_cisti = " + verifica_campo(doc.hque_tessuti_cisti.value) + ", ";
	//update += "que_tessuti_pregressa = " + verifica_campo(doc.hque_tessuti_pregressa.value) + ", ";
	update += "que_tessuti_nuclei = " + verifica_campo(doc.hque_tessuti_nuclei.value) + ", ";
	update += "que_tessuti_non_spec = " + verifica_campo(doc.hque_tessuti_non_spec.value) + ", ";
	update += "que_tessuti_altro = " + verifica_campo(doc.hque_tessuti_altro.value) + ", ";
	update += "que_tessuti_altro_descr = " + verifica_campo(doc.que_tessuti_altro_descr.value) + ", ";
	
	update += "ecografia_mammaria = " + verifica_campo(doc.hecografia_mammaria.value) + " ";
	
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
	var insert = "insert into tab_app_eco (";
	insert += 'iden_esame, tipo_esame, tipo_richiesta, ';
	insert += 'controllo_epato, controllo_rene, controllo_gine, controllo_tiroide, controllo_tessuti, ';
	insert += 'que_epato_calcolosi, que_epato_coleciste, que_epato_steatori_epatica, que_epato_lesioni_focali, ';
	insert += 'que_epato_epatite, que_epato_polipi, que_epato_non_spec, que_epato_altro, que_epato_altro_descr, ';
	insert += 'que_rene_cisti, que_rene_ins_renale, que_rene_sclero, que_rene_non_spec, que_rene_altro, que_rene_altro_descr, ';
	insert += 'que_gine_fibromi, que_gine_isterectomia, que_gine_non_spec, que_gine_altro, que_gine_altro_descr, ';
	insert += 'que_tiroide_noduli, que_tiroide_senza_noduli, que_tiroide_cronica, que_tiroide_non_spec, que_tiroide_altro, '; 
	insert += 'que_tiroide_altro_descr, ';
	insert += 'que_tessuti_cisti, que_tessuti_nuclei, que_tessuti_non_spec, que_tessuti_altro, ';//, que_tessuti_pregressa
	insert += "que_tessuti_altro_descr, controllo_senologia) values (";
	insert += doc.iden_esame.value + ", ";
	insert += verifica_campo(doc.htipo_esame.value) + ", " + verifica_campo(doc.htipo_richiesta.value) + ", ";
	insert += verifica_campo(doc.hcontrollo_epato.value) + ", " + verifica_campo(doc.hcontrollo_rene.value) + ", " + verifica_campo(doc.hcontrollo_gine.value)  + ", ";
	insert += verifica_campo(doc.hcontrollo_tiroide.value) + ", " + verifica_campo(doc.hcontrollo_tessuti.value) + ", ";
	insert += verifica_campo(doc.hque_epato_calcolosi.value)  + ", " + verifica_campo(doc.hque_epato_coleciste.value) + ", " + verifica_campo(doc.hque_epato_steatori_epatica.value) + ", ";
	insert += verifica_campo(doc.hque_epato_lesioni_focali.value) + ", " + verifica_campo(doc.hque_epato_epatite.value) + ", " + verifica_campo(doc.hque_epato_polipi.value) + ", "; 
	insert += verifica_campo(doc.hque_epato_non_spec.value) + ", " + verifica_campo(doc.hque_epato_altro.value) + ", " + verifica_campo(doc.que_epato_altro_descr.value) + ", ";
	insert += verifica_campo(doc.hque_rene_cisti.value) + ", " + verifica_campo(doc.hque_rene_ins_renale.value) + ", " + verifica_campo(doc.hque_rene_sclero.value) + ", ";
	insert += verifica_campo(doc.hque_rene_non_spec.value) + ", " + verifica_campo(doc.hque_rene_altro.value) + ", " + verifica_campo(doc.que_rene_altro_descr.value) + ", "; 
	insert += verifica_campo(doc.hque_gine_fibromi.value) + ", " + verifica_campo(doc.hque_gine_isterectomia.value) + ", " + verifica_campo(doc.hque_gine_non_spec.value) + ", "; 
	insert += verifica_campo(doc.hque_gine_altro.value) + ", " + verifica_campo(doc.que_gine_altro_descr.value) + ", "; 
	insert += verifica_campo(doc.hque_tiroide_noduli.value) + ", " + verifica_campo(doc.hque_tiroide_senza_noduli.value) + ", " + verifica_campo(doc.hque_tiroide_cronica.value) + ", ";
	insert += verifica_campo(doc.hque_tiroide_non_spec.value) + ", " + verifica_campo(doc.hque_tiroide_altro.value) + ", " + verifica_campo(doc.que_tiroide_altro_descr.value) + ", ";
	insert += verifica_campo(doc.hque_tessuti_cisti.value) + ", " + verifica_campo(doc.hque_tessuti_nuclei.value) + ", ";//+ verifica_campo(doc.hque_tessuti_pregressa.value) + ", "
	insert += verifica_campo(doc.hque_tessuti_non_spec.value) + ", " + verifica_campo(doc.hque_tessuti_altro.value) + ", " + verifica_campo(doc.que_tessuti_altro_descr.value) + ", " + verifica_campo(doc.hcontrollo_senologia.value) + ")";
	
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_eco);	
		dwr.engine.setAsync(true);
	}*/
}//update_tab_app_eco

/*
	Message contiene l'iden_esame della prossima scheda di appropriatezza da aprire.
	e se vi è WEB.ob_esecuzione == 'S' aprirà la scheda esame per effetture la registrazione.
*/
function cbk_apri_altra_scheda_appr_eco(message)
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
			var fin_scheda_esame_eco = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
			
			if(fin_scheda_esame_eco)
				fin_scheda_esame_eco.focus();
			else
				fin_scheda_esame_eco = window.open("schedaEsame?Hiden_esame="+idenEsame_elencoEsami_statiEsami[1]+"&tipo_registrazione="+idenEsame_elencoEsami_statiEsami[2],"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
			
		
			fin_scheda_esame_eco.opener = opener;
		}
	}
	else
	{
		//altra scheda di appropriatezza da inserire.
		var finestra_eco = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");

		if(finestra_eco)
			finestra_eco.focus();
		else
			finestra_eco = window.open("Appropriatezza?provenienza=EM&iden_paz="+document.form_appr_obbl.iden_anag.value+"&iden_esame="+idenEsame_elencoEsami_statiEsami[0]+"","","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");


		finestra_eco.opener = opener;
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
		CJsEMAltraSchedaAppr.apri_altra_scheda_appr(doc.iden_esame.value, cbk_apri_altra_scheda_appr_eco);	
		dwr.engine.setAsync(true);
	}
}




function abilita_ecografia_mammaria(parametro)
{
	var doc = document.form_appr_obbl;	
	doc.ecografia_mammaria[0].disabled = parametro;
	doc.ecografia_mammaria[1].disabled = parametro;
	doc.ecografia_mammaria[2].disabled = parametro;
	
	if(parametro)
	{
		doc.ecografia_mammaria[0].checked = !parametro;
		doc.ecografia_mammaria[1].checked = !parametro;
		doc.ecografia_mammaria[2].checked = !parametro;
	}
}

