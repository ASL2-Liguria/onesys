/*
	Funzioni js che gestiscono la pagina di inserimento o modifica di un filtro
	per ogni utente.
*/

function gestione_pren_acc(valore)
{
	var doc = document.form;

	if(valore == 'SP')
	{
		doc.accettati.checked = 0;
		doc.pren_acc.checked = 0;
	}
	if(valore  == 'SA')
	{
		doc.prenotati.checked = 0;
		doc.pren_acc.checked = 0;
	}
	if(valore == 'S')
	{
		doc.accettati.checked = 0;
		doc.prenotati.checked = 0;
	}
}


function applica()
{
	var doc = document.form;
	
	if(doc.prenotati.checked == 0 && doc.accettati.checked == 0 && doc.pren_acc.checked == 0)
	{
		alert('Prego, effettuare una selezione per accettati, prenotati od entrambi');
		return;
	}

	//PRENOTATI
	if(doc.prenotati.checked == 1)
	{
		doc.hpren_acc.value = doc.prenotati.value;
	}
	//ACCETTATI
	if(doc.accettati.checked == 1)
	{
		doc.hpren_acc.value = doc.accettati.value;
	}
	//ENTRAMBI	
	if(doc.pren_acc.checked == 1)
	{
		doc.hpren_acc.value = doc.pren_acc.value;
	}
	//ESEGUITO	
	if(doc.eseguito[0].checked == 1)
	{
		doc.heseguito.value = doc.eseguito[0].value;
	}
	if(doc.eseguito[1].checked == 1)
	{
		doc.heseguito.value = doc.eseguito[1].value;
	}
	//REFERTATO
	if(doc.refertato[0].checked == 1)
	{
		doc.hrefertato.value = doc.refertato[0].value;
	}
	if(doc.refertato[1].checked == 1)
	{
		doc.hrefertato.value = doc.refertato[1].value;
	}
	//VALIDATI/FIRMATI
	if(doc.firmato[0].checked == 1)
	{
		doc.hfirmato.value = doc.firmato[0].value;
	}
	if(doc.firmato[1].checked == 1)
	{
		doc.hfirmato.value = doc.firmato[1].value;
	}
	//REFERTO SOSPESO
	if(doc.referto_sospeso[0].checked == 1)
	{
		doc.hreferto_sospeso.value = doc.referto_sospeso[0].value;
	}
	if(doc.referto_sospeso[1].checked == 1)
	{
		doc.hreferto_sospeso.value = doc.referto_sospeso[1].value;
	}
	
	
	/*GESTIONE SCREENING*/
	if(baseGlobal.SCREENING == 'S')
	{
		try{
			if(doc.screening_primoMedicoRef[0].checked == 1)
			{
				doc.hscreening_primoMedicoRef.value = doc.screening_primoMedicoRef[0].value;
			}
			if(doc.screening_primoMedicoRef[1].checked == 1)
			{
				doc.hscreening_primoMedicoRef.value = doc.screening_primoMedicoRef[1].value;
			}		
			
			if(doc.screening_discordante[0].checked == 1)
			{
				doc.hscreening_discordante.value = doc.screening_discordante[0].value;
			}
			if(doc.screening_discordante[1].checked == 1)
			{
				doc.hscreening_discordante.value = doc.screening_discordante[1].value;
			}
			
			if(doc.screening_positivo[0].checked == 1)
			{
				doc.hscreening_positivo.value = doc.screening_positivo[0].value;
			}
			if(doc.screening_positivo[1].checked == 1)
			{
				doc.hscreening_positivo.value = doc.screening_positivo[1].value;
			}
			
			if(doc.screening_negativo[0].checked == 1)
			{
				doc.hscreening_negativo.value = doc.screening_negativo[0].value;
			}
			if(doc.screening_negativo[1].checked == 1)
			{
				doc.hscreening_negativo.value = doc.screening_negativo[1].value;
			}
			if(doc.screening_caso_aperto[0].checked == 1)
			{
				doc.hscreening_caso_aperto.value = doc.screening_caso_aperto[0].value;
			}
			if(doc.screening_caso_aperto[1].checked == 1)
			{
				doc.hscreening_caso_aperto.value = doc.screening_caso_aperto[1].value;
			}		
		}
		catch(e){
		}
	}
	/*fine GESTIONE SCREENING*/

	if(doc.nome_filtro.value == '')
	{
		alert('Prego, inserire il nome del filtro');
		return;
	}
	doc.nome_filtro.value = doc.nome_filtro.value.toUpperCase();

	var tab_filtri_stato = doc.hpren_acc.value + '@';
	tab_filtri_stato    += doc.heseguito.value + '@';
	tab_filtri_stato    += doc.hrefertato.value + '@';
	tab_filtri_stato    += doc.hfirmato.value + '@';
	tab_filtri_stato    += doc.hreferto_sospeso.value;
	/*Gestione Screening*/
	if(baseGlobal.SCREENING == 'S')
	{
		try{
			tab_filtri_stato    += '@' + doc.hscreening_primoMedicoRef.value + '@';//tab_filtri_stato    += '@' + doc.hscreening_discordante.value + '@';
			tab_filtri_stato    += doc.hscreening_discordante.value + '@';
			tab_filtri_stato    += doc.hscreening_positivo.value + '@';
			tab_filtri_stato    += doc.hscreening_negativo.value + '@' + doc.hscreening_caso_aperto.value;
		}
		catch(e){
		}
	}
	
	var where_cond_filtro_stato = crea_where_cond_stato(tab_filtri_stato);

	var whereCond_Nome_Valore = where_cond_filtro_stato + '*' + doc.nome_filtro.value + '*' + tab_filtri_stato;

	//alert(whereCond_Nome_Valore);
	
	if(doc.operazione.value == 'INS'){
		dwr.engine.setAsync(false);
		CJsFiltroStato.insert(whereCond_Nome_Valore, cbkFiltroStato);
		dwr.engine.setAsync(true);
	}
	
	if(doc.operazione.value == 'MOD'){
		dwr.engine.setAsync(false);
		CJsFiltroStato.update(whereCond_Nome_Valore + '*' + doc.tabFiltriStato_iden.value, cbkFiltroStato);
		dwr.engine.setAsync(true);
	}
}


function crea_where_cond_stato(stato_db)
{
	var strWhere  = '';
	var strWhereScreening = '';
	var stato 	  = stato_db.split(['@']);
	
	/*alert('STATO: ' + stato);
	alert('baseUser.TIPO: ' + baseUser.TIPO);
	alert('baseGlobal.GESTIONE_FINE_ESECUZIONE: ' + baseGlobal.GESTIONE_FINE_ESECUZIONE);*/

	if(stato[0] == "SP")
	{
		if(strWhere!="")
		{
			strWhere+=" AND ";
		}
		strWhere+='(PRENOTATO = "1" AND ACCETTATO <> "1")';
		//strInfo+="Stato:PRENOTATI - ";
	}
	else 
		if(stato[0] == "SA")
		{
			if(strWhere!="")
			{
				strWhere+=" AND ";
			}
			strWhere+='(PRENOTATO <> "1" AND ACCETTATO = "1")';
			//strInfo+="Stato:ACCETTATI - ";
		}
		else 
			if(stato[0] == "S")
			{
				if(strWhere!="")
				{
					strWhere+=" AND ";
				}
				strWhere+='(PRENOTATO = "1" OR ACCETTATO = "1")';
				//strInfo+="Stato:PRENOTATI/ACCETTATI - ";
			}
/*STATO: ESEGUITO*/
	if(stato[1] == "SE")
	{
		if(strWhere!="")
		{
			strWhere+=" AND ";
		}
		strWhere+= 'ESEGUITO = "1"';
		//strInfo+="Stato:ESEGUITI - ";
	}
	else
		if(stato[1] == "NE")
		{
			if(strWhere!="")
			{
				strWhere+=" AND ";
			}
			if(baseUser.TIPO == 'T' && baseGlobal.GESTIONE_FINE_ESECUZIONE == 'S')
				strWhere+= '(PRENOTATO = "1" OR ACCETTATO = "1" OR (ESEGUITO = "1" AND FINE_ESECUZIONE = "0"))';
			else
				strWhere+= 'ESEGUITO <> "1"';
			//strInfo+="Stato:NON ESEGUITI - ";
		}			
			
/*STATO: REFERTATO*/			
	if(stato[2] == "SR")
	{
		if(strWhere!="")
		{
			strWhere+=" AND ";
		}
		strWhere+= 'REFERTATO = "1"';
		//strInfo+="Stato:REFERTATI - ";
	}
	else
		if(stato[2] == "NR")
		{
			if(strWhere!="")
			{
				strWhere+=" AND ";
			}
			strWhere+=' REFERTATO <> "1"';
			//strInfo+="Stato:NON REFERTATI - ";
		}
/*STATO: VALIDATO/FIRMATO*/		
	if(stato[3] == "SF")
	{
		if(strWhere!="")
		{
			strWhere+=" AND ";
		}
		strWhere+='FIRMATO = "S"';
		//strInfo+="Stato:CON REFERTI VALIDATI/FIRMATI - ";
	}
	else 
		if(stato[3] == "NF")
		{
			if(strWhere!="")
			{
				strWhere+=" AND ";
			}
			strWhere+='(FIRMATO <> "S" OR FIRMATO IS NULL)';
			//strInfo+="Stato:CON REFERTI NON VALIDATI/FIRMATI - ";
		}				
/*STATO: REFERTO SOSPESO = VALIDATO/FIRMATO*/					
	if(stato[4] == "SRS")
	{
		if(strWhere!="")
		{
			strWhere+=" AND ";
		}
		strWhere+='SOSPESO = "S"';
		//strInfo+="Stato:CON REFERTI SOSPESI - ";
	}
	else 
		if(stato[4] == "NRS")
		{
			if(strWhere!="")
			{
				strWhere+=" AND ";
			}
			strWhere+= '(SOSPESO <> "S" OR SOSPESO IS NULL)';
			//strInfo+="Stato:CON REFERTI NON SOSPESI - ";
		}	
		
	
	/*GESTIONE SCREENING*/
	if(baseGlobal.SCREENING == 'S')
	{
		try{
			if(stato[5] == "SPL")
			{
				if(strWhere!="")
				{
					strWhereScreening += " AND (";
				}
				strWhereScreening += 'INFO_SCREENING = "2"';
			}
			
			
			if(stato[6] == "SSD")
			{
				if(strWhere != '' && strWhereScreening != '')
				{
					strWhereScreening+=" OR ";
				}
				else	
					strWhereScreening+=" AND ( ";
					
				strWhereScreening += 'ESITO_SCREENING = "NON NEGATIVO"';
				//strInfo+="Stato:SCREENING DISCORDANTE - ";
			}
			
			if(stato[7] == "SSP")
			{
				if(strWhere != '' && strWhereScreening != '')
				{
					strWhereScreening+=" OR ";
				}
				else	
					strWhereScreening+=" AND ( ";
					
				strWhereScreening += 'ESITO_SCREENING = "APPROFONDIMENTI"';
				//strInfo+="Stato:SCREENING POSITIVO - ";
			}
			
			if(stato[8] == "SSN")
			{
				if(strWhere != '' && strWhereScreening != '')
				{
					strWhereScreening+=" OR ";
				}
				else	
					strWhereScreening+=" AND ( ";
					
				strWhereScreening += 'ESITO_SCREENING = "NEGATIVO"';
				//strInfo+="Stato:SCREENING NEGATIVO - ";
			}
			
			if(stato[9] == "SCA")
			{
				if(strWhere != '' && strWhereScreening != '')
				{
					strWhereScreening+=" OR ";
				}
				else	
					strWhereScreening+=" AND ( ";
					
				strWhereScreening += 'SCREENING_CASO_APERTO = "S"';
			}
			
			if(strWhereScreening != '')
				strWhereScreening += ")";
		}
		catch(e){
		}
	}
	/*fine GESTIONE SCREENING*/

	//alert('where condition: ' + strWhere);
	//alert('where condition screening: ' + strWhereScreening);
	
	return strWhere + strWhereScreening;
}




function cbkFiltroStato(error)
{
	if(error != '')
		alert(error);
	
	chiudi();	
}



function gestione_eseguito(value)
{
	var doc = document.form;
	if(value == 'SE')
	{
		doc.refertato[1].checked = 1;
		doc.firmato[1].checked = 1;
		doc.referto_sospeso[1].checked = 1;
	}
	if(value == 'NE')
	{
		doc.refertato[1].checked = 1;
		doc.firmato[1].checked = 1;
		doc.referto_sospeso[1].checked = 1;
	}
}

function gestione_refertato(value)
{
	var doc = document.form;
	if(value == 'SR')
	{
		doc.eseguito[0].checked = 1;
		doc.firmato[1].checked = 1;
		doc.referto_sospeso[1].checked = 1;
	}
	if(value == 'NR')
	{
		doc.firmato[1].checked = 1;
		doc.referto_sospeso[1].checked = 1;
	}
}

function gestione_firmato(value)
{
	var doc = document.form;
	if(value == 'SF')
	{
		doc.eseguito[0].checked = 1;
		doc.refertato[0].checked = 1;
		doc.referto_sospeso[1].checked = 1;
	}
}

function gestione_sospeso(value)
{
	var doc = document.form;
	if(value == 'SRS')
	{
		doc.eseguito[0].checked = 1;
		doc.refertato[0].checked = 1;
		doc.firmato[1].checked = 1;
	}
}

/*SCREENING*/
function gestione_screening_primoMedicoRef(value){
	var doc = document.form;
	
	if(doc.screening_primoMedicoRef[0].checked){
		doc.screening_discordante[0].disabled = true;
		doc.screening_positivo[0].disabled = true;
		doc.screening_negativo[0].disabled = true;
		doc.screening_caso_aperto[0].disabled = true;
		
		doc.screening_discordante[1].checked = true;	
		doc.screening_positivo[1].checked = true;	
		doc.screening_negativo[1].checked = true;	
		doc.screening_caso_aperto[1].checked = true;
	}
	
	if(doc.screening_primoMedicoRef[1].checked){
		doc.screening_discordante[0].disabled = false;
		doc.screening_positivo[0].disabled = false;
		doc.screening_negativo[0].disabled = false;
		doc.screening_caso_aperto[0].disabled = false;
	}
	
}

function gestione_screening_discordante(value){
}

function gestione_screening_positivo(value){
}

function gestione_screening_negativo(value){
}

function gestione_screening_caso_aperto(value){
	var doc = document.form;
	if(doc.screening_caso_aperto[0].checked){
		doc.refertato[0].checked = 1;
		gestione_refertato('SR');
	}
}
/*fine SCREENING*/


function chiudi()
{
	opener.aggiorna();
	self.close();
}


function funzione(){
	if(baseGlobal.SCREENING == 'S'){
		gestione_screening_primoMedicoRef();
	}
}