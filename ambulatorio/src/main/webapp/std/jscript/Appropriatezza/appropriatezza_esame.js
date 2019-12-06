function verifica_campo(valore)
{
	if(valore != null && valore != '')
		return "'" + valore + "'";
	else
		return null;
}

/*
variabile utilizzata per effettuare l'insert o l'update (in base all'operazione)
sulla tabella APPROPRIATEZZA_ESAME
*/
var query_appropriatezza_esame;
/*
variabile utilizzata per effettuare l'insert in APPROPRIATEZZA_ESAME nel caso in cui vengano
selezionati più esami per l'esecuzione con la stessa scheda di appropriatezza ed uno di questi abbia
lo stato con la Y
*/
var I_appropriatezza_esame;


/*
Funzione che verifica le informazioni contentute nella parte obbligatoria di ogni scheda di appropriatezza
I campi sono contenuti nella tabella appropriatezza_esame 

@param nome_tabella_scheda  scheda di Appropriatezza specifica
@param medico               indica se nella parte generale(tabella appropriatezza_esame) è presente la scelta del medico
@param specifica_quesito	indica se è presente il quesito diagnostico
@param esame_multiplo		indica se è presente il campo esame_multiplo
@param tipo_esame			indica se è presente il campo tipo_esame ovvero la scelta fra primo esame (P) o esame di controllo (C) 
@param grado_urgenza		indica se è presente il grado di urgenza (Esame Richiesto in urgenza (U) o in elezione (E))

*/
function registra_appropriatezza_esame(nome_tabella_scheda, medico, specifica_quesito, esame_multiplo, tipo_esame, grado_urgenza)
{
	var doc = document.form_appr_obbl;
	var mancano = '';
	
	if(specifica_quesito == 'S')
	{
		if(doc.specifica_quesito[0].checked == 1)
			doc.hspecifica_quesito.value = 'S';
		if(doc.specifica_quesito[1].checked == 1)
			doc.hspecifica_quesito.value = 'N';
	}
	
	if(esame_multiplo == 'S')
	{
		if(doc.esame_multiplo[0].checked == 1)
			doc.hesame_multiplo.value = 'S';
		if(doc.esame_multiplo[1].checked == 1)
			doc.hesame_multiplo.value = 'N';
	}
	
	if(tipo_esame == 'S')
	{
		if(doc.tipo_esame[0].checked == 1)
			doc.htipo_esame.value = 'P';
		if(doc.tipo_esame[1].checked == 1)
			doc.htipo_esame.value = 'C';
	}
	
	if(grado_urgenza == 'S')
	{
		if(doc.grado_urgenza[0].checked == 1)
			doc.hgrado_urgenza.value = 'U';
		if(doc.grado_urgenza[1].checked == 1)
			doc.hgrado_urgenza.value = 'E';	
	}
	
	if(doc.provenienza.value == 'R')
	{	
		if(doc.appropriato[0].checked == 1)
			doc.happropriato.value = 'S';
		if(doc.appropriato[1].checked == 1)
			doc.happropriato.value = 'N';	
		
		if(doc.indagine[0].checked == 1)
			doc.hindagine.value = 'P';
		if(doc.indagine[1].checked == 1)
			doc.hindagine.value = 'N';		
	}
		
	if(medico == 'S')
	if(doc.medico.value == '')
	{
		mancano += '- MEDICO\n';//alert(ritornaJsMsg("alert_medico"));//Prego, inserire il medico
	}
	
	if(specifica_quesito == 'S')
		if(doc.hspecifica_quesito.value == '')
		{
			mancano += '- QUESITO DIAGNOSTICO\n';//alert(ritornaJsMsg("alert_specifica_quesito"));//Prego, indicare se è specificato il quesito diagnostico
		}
		
	if(esame_multiplo == 'S')
		if(doc.hesame_multiplo.value == '')
		{
			mancano += '- ESAME DI ACCERTAMENTO\n';//alert(ritornaJsMsg("alert_esame_multiplo"));//Prego, indicare se è un esame di accertamento
		}
		
	if(tipo_esame == 'S')
		if(doc.htipo_esame.value == '')
		{
			mancano += '- TIPO ESAME\n';//alert(ritornaJsMsg("alert_tipo_esame"));//Prego, indicare il tipo di esame
		}	
		
	if(grado_urgenza == 'S')
		if(doc.hgrado_urgenza.value == '')
		{
			mancano += '- GRADO URGENZA\n';//alert(ritornaJsMsg("alert_grado_urgenza"));//Prego, inserire il grado di urgenza dell''esame
		}
		
	if(doc.provenienza.value == 'R')
	{	
		if(doc.happropriato.value == '')
		{
			mancano += '- ESAME APPROPRIATO\n';//alert(ritornaJsMsg("alert_appropriato"));//Prego, indicare se l''esame è appropriato	
		}
		if(doc.hindagine.value == '')
		{
			mancano += '- TIPO INDAGINE\n';//alert(ritornaJsMsg("alert_indagine"));//Prego, indicare il tipo di indagine	
		}
	}//provenienza
		
	return mancano;
}//registra_appropriatezza_esame



/*
Funzione che effettua l'inserimento e l'update della scheda generale dell'appropriatezza (tabella APPROPRIATEZZA_ESAME)  
e l'inserimento e l'update della scheda specifica passata come parametro di input (cod_scheda)

@param provenienza          A indica che si è scelta la voce del menù Esecuzione -> Appropriatezza
@param nome_tabella_scheda  scheda di Appropriatezza specifica
@param medico               indica se nella parte generale(tabella appropriatezza_esame) è presente la scelta del medico
@param specifica_quesito	indica se è presente il quesito diagnostico
@param esame_multiplo		indica se è presente il campo esame_multiplo
@param tipo_esame			indica se è presente il campo tipo_esame ovvero la scelta fra primo esame (P) o esame di controllo (C) 
@param grado_urgenza		indica se è presente il grado di urgenza (Esame Richiesto in urgenza (U) o in elezione (E))
*/
function ins_upd_appropriatezza_esame(provenienza, cod_scheda, medico, specifica_quesito, esame_multiplo, tipo_esame, grado_urgenza)
{
	var doc = document.form_appr_obbl;
	document.form_update.tipo_connessione.value = 'DATA';
	
	/*INSERIMENTO IN APPROPRIATEZZA_ESAME*/
	var insert = 'insert into appropriatezza_esame ';
	
	
	var esami = doc.iden_esame.value;
	//alert('Esami: ' + esami);	
	
	if(esami.indexOf(",") > -1 )
		esami = esami.split(",")[0];
	
	var insert_value = " values ('" + esami + "'";//doc.iden_esame.value
	
	
	insert += '(iden_esame';
	
	if(medico == 'S')
	{
		insert += ', iden_tipo_rich';
		insert_value += ", '" + doc.medico.value + "'";   
	}
	
	if(specifica_quesito == 'S')
	{
		insert += ', specifica_quesito';
		insert_value += ", '" + doc.hspecifica_quesito.value + "'";
	}
	
	if(esame_multiplo == 'S')
	{
		insert += ', esame_multiplo';
		insert_value += ", '" + doc.hesame_multiplo.value + "'";
	}
	
	if(tipo_esame == 'S')
	{
		insert += ', tipo_esame';
		insert_value += ", '" + doc.htipo_esame.value + "'";
	}

	insert += ', cod_scheda';
	insert_value += ", '" + cod_scheda.toUpperCase() + "'";
	
	insert += ', ute_ins';
	insert_value += ", '" + doc.iden_per.value + "'";
	
	if(doc.provenienza.value == 'R')																	  
		insert += ', appropriato, indagine) ';																	  
	else
		insert += ') ';
	
	if(doc.provenienza.value == 'R')																	  
		insert_value += ", '" + doc.happropriato.value + "', '" + doc.hindagine.value + "') ";													
	else
		insert_value += ') ';
	
	
	query_appropriatezza_esame = insert + insert_value;
	
	
	/*UPDATE IN APPROPRIATEZZA_ESAME*/
	if(document.form_update.tipo_operazione.value == 'UPD')
	{
		update_appropriatezza_esame(medico, specifica_quesito, esame_multiplo, tipo_esame, grado_urgenza);
		I_appropriatezza_esame = insert + insert_value;
		//alert(I_appropriatezza_esame);
	}
	
	/*
		OPERAZIONE DI INSERIMENTO DELLA SCHEDA PASSATA COME PARAMETRO DI INPUT
	*/
	if(document.form_update.tipo_operazione.value == 'INS')
	{
		if(cod_scheda == 'TAB_APP_ALTRI')
			insert_tab_app_altri(provenienza);	
		
		if(cod_scheda == 'TAB_APP_CLISMA')
			insert_tab_app_clisma(provenienza);	
		
		if(cod_scheda == 'TAB_APP_COLONSCOPIA')
			insert_tab_app_colonscopia(provenienza);	
			
		if(cod_scheda == 'TAB_APP_RX_GIN')
			insert_tab_app_rx_gin(provenienza);	
		
		if(cod_scheda == 'TAB_APP_TC_RM_GIN')
			insert_tab_app_tc_rm_gin(provenienza);	
			
		if(cod_scheda == 'TAB_APP_RX_PIEDE')
			insert_tab_app_rx_piede(provenienza);
		
		if(cod_scheda == 'TAB_APP_COLONNA')
			insert_tab_app_colonna(provenienza);		
			
		if(cod_scheda == 'TAB_APP_ECD_ARTI')
			insert_tab_app_ecd_arti(provenienza);				
			
		if(cod_scheda == 'TAB_APP_ECD_TSA')
			insert_tab_app_ecd_tsa(provenienza);					
			
		if(cod_scheda == 'TAB_APP_ECO')
			insert_tab_app_eco(provenienza);		
	
		if(cod_scheda == 'TAB_APP_RISONANZA')
			insert_tab_app_risonanza(provenienza);		
	}
	
	/*
		OPERAZIONE DI UPDATE DELLA SCHEDA PASSATA COME PARAMETRO DI INPUT
	*/
	if(document.form_update.tipo_operazione.value == 'UPD')
	{
		if(cod_scheda == 'TAB_APP_ALTRI'){
			update_tab_app_altri(provenienza);
		}
		
		if(cod_scheda == 'TAB_APP_CLISMA'){
			update_tab_app_clisma(provenienza);
		}
		
		if(cod_scheda == 'TAB_APP_COLONSCOPIA'){
			update_tab_app_colonscopia(provenienza);
		}
		
		if(cod_scheda == 'TAB_APP_RX_GIN'){
			update_tab_app_rx_gin(provenienza);		
		}
		
		if(cod_scheda == 'TAB_APP_TC_RM_GIN'){
			update_tab_app_tc_rm_gin(provenienza);		
		}
		
		if(cod_scheda == 'TAB_APP_RX_PIEDE'){
			update_tab_app_rx_piede(provenienza);		
		}
		
		if(cod_scheda == 'TAB_APP_COLONNA')
			update_tab_app_colonna(provenienza);	
			
		if(cod_scheda == 'TAB_APP_ECD_ARTI')
			update_tab_app_ecd_arti(provenienza);		
			
		if(cod_scheda == 'TAB_APP_ECD_TSA')
			update_tab_app_ecd_tsa(provenienza);		
			
		if(cod_scheda == 'TAB_APP_ECO')
			update_tab_app_eco(provenienza);			
	
		if(cod_scheda == 'TAB_APP_RISONANZA')
			update_tab_app_risonanza(provenienza);		
			
	}//update

}//ins_upd_appropriatezza_esame


/*
	UPDATE sulla tabella APPROPRIATEZZA_ESAME
*/
function update_appropriatezza_esame(medico, specifica_quesito, esame_multiplo, tipo_esame, grado_urgenza)
{
	var doc = document.form_appr_obbl;
	var update = '';
	if(medico == 'S')
		update = "iden_tipo_rich = '" + doc.medico.value + "' ";
		
	if(specifica_quesito == 'S' && update != '')
		update += ", specifica_quesito = '" +  doc.hspecifica_quesito.value + "' ";
		
	if(specifica_quesito == 'S' && update == '')
		update += "specifica_quesito = '" +  doc.hspecifica_quesito.value + "' ";
		
	if(esame_multiplo == 'S' && update != '')
		update += ", esame_multiplo = '"  + doc.hesame_multiplo.value  + "' ";
		
	if(esame_multiplo == 'S' && update == '')
		update += "esame_multiplo = '"  + doc.hesame_multiplo.value  + "' ";
		
	if(tipo_esame == 'S' && update != '')
		update += ", tipo_esame = '"  + doc.htipo_esame.value  + "' ";
		
	if(tipo_esame == 'S' && update == '')
		update += "tipo_esame = '"  + doc.htipo_esame.value  + "' ";
	
	if(doc.provenienza.value == 'R' && update != ''){
		update += ", appropriato = '" +  doc.happropriato.value + "' ";
		update += ", indagine = '" + doc.hindagine.value  + "' ";
	}
	
	if(doc.provenienza.value == 'R' && update == ''){
		update += "appropriato = '" +  doc.happropriato.value + "' ";
		update += ", indagine = '" + doc.hindagine.value  + "' ";
	}
	
	update += ", ute_mod = '" + doc.iden_per.value + "' ";
	
	if(doc.provenienza.value == 'R')
		update += " where iden_esame in (" + doc.iden_esame.value + ')';
	else
		update += " where iden_esame = " + doc.iden_esame.value;
	
	
	query_appropriatezza_esame = 'update appropriatezza_esame set ' + update;

}


/*
	Funzione CHIUDI di tutte le  schede di appropriatezza
	tranne tab_app_filtro_rm_tc
*/
function chiudi(iden_esami)
{
	var doc = document.form_appr_obbl;
	//alert('appropriatezza_esame.js : ' + doc.provenienza.value);
	if(doc.provenienza.value == 'E' || doc.provenienza.value == 'R' || doc.provenienza.value == 'EM')
	{
		if(doc.provenienza.value == 'R')
			self.close();
		else
		{
		  annullamentoGestione.annullaAppr(iden_esami, aggiornamento);
		}
	}
	else
	{
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

/*
	Funzione richiamata nel caso dell'ESECUZIONE di un esame.(dal menù a tendina della worklist degli esami Esecuzione -> esegui):
	Tale funzione è richiamata solo nel caso in cui web.ob_esecuzione == 'S' ed effettuerà l'apertura della Scheda Esame;
	in questo caso l'operazione di esecuzione di un esame termina con la registrazione di quest'ultima.
*/
function apri_scheda_esame(stato)
{
	//alert(stato);
	var doc = document.form_appr_obbl;
	var fin_scheda_esame = window.open("schedaEsame?Hiden_esame="+doc.iden_esame.value+"&Hiden_anag="+doc.iden_anag.value+"&tipo_registrazione="+stato,"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");

	if (fin_scheda_esame) 
		fin_scheda_esame.focus();
	else
	{
		fin_scheda_esame = window.open("schedaEsame?Hiden_esame="+doc.iden_esame.value+"&Hiden_anag="+doc.iden_anag.value+"&tipo_registrazione="+stato,"","status=yes,scrollbars=yes,height=800,width=600, top=10, left=10");
	}
	
	fin_scheda_esame.opener = opener;
	self.close();
}

