/*
	Gestione dell'inserimento/modifica delle schede di appropriatezza.
	
	@param provenienza = 'A' indica che è stata scelta la voce Appropriatezza 
							 dal menù a tendina Esecuzione
*/
function appropriatezza(provenienza)
{
	var cod_scheda_appr = stringa_codici(array_scheda_appropriatezza);
	var esame_accettato = stringa_codici(array_accettato);
	var iden_esame = '';
	var iden_anag = '';
	var iden_esa = '';

	if(conta_esami_sel() == 0)
	{
		alert(ritornaJsMsg("jsmsg1"));//Prego, selezionare un esame
		return;
	}
	
	if(conta_esami_sel() > 1)
	{
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));//Prego, selezionare un solo esame
		return;
	}
	
	
	/*Controllo se il paziente è READONLY*/
	var iden_anag = stringa_codici(array_iden_anag);
	
	if(isLockPage('ANAGRAFICA', iden_anag, 'ANAG'))
	{
		alert(ritornaJsMsg('a_readonly'));//Attenzione, il paziente selezionato è di sola lettura
		return;		
	}
	/**/
	
	
	if(esame_accettato == '0')
	{
		alert(ritornaJsMsg("alert_esa_acc"));//Attenzione l'esame deve essere accettato
		return;
	}
	
	
	/*Caso in cui per l'esame selezionato non vi sia associata la scheda di appropriatezza:
                 TAB_ESA.cod_scheda is null*/
	if(cod_scheda_appr == '')
	{
		alert(ritornaJsMsg("no_cod_scheda_appr"));//Attenzione:l'esame selezionato non ha nessuna scheda di appropriatezza associata.
		return;
	}
	
	iden_esame = stringa_codici(array_iden_esame);
	iden_anag = stringa_codici(array_iden_anag);
	iden_esa = stringa_codici(array_iden_esa);//E SE FOSSE SCREENING?
	
	//alert(provenienza);
	//alert(cod_scheda_appr);
	//alert(iden_esame);
	
	var finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"&iden_esa="+iden_esa,"","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
	if (finestra){
		finestra.focus();
	}
	else{
		/*finestra = window.open("Appropriatezza?provenienza=R&cod_scheda=tab_app_filtro_rm_tc&iden_paz=244&num_esami=3&iden_esame=13","","top=0,left=0,width=800,height=600,status=yes");*/
		finestra = window.open("Appropriatezza?provenienza="+provenienza+"&iden_paz="+ iden_anag+"&iden_esame="+iden_esame+"&iden_esa="+iden_esa,"","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes, fullscreen = yes");
	}
	
	
	//document.frmReferta.idenEsame.value = iden_esame;
	//document.frmReferta.submit();
}

/*
		case 'appropriatezza':
			parent.mainFrame.workFrame.document.location.replace("Appropriatezza?provenienza=R&cod_scheda=tab_app_filtro_rm_tc&iden_paz=244&num_esami=3&iden_esame=13");
			return; 
			
//tab_app_altri   tab_app_rx_gin  	tab_app_tc_rm_gin   tab_app_rx_piede  tab_app_colonna

//tab_app_ecd_arti   tab_app_ecd_tsa  tab_app_eco   tab_app_filtro_rm_tc

//tab_app_risonanza 	tab_app_colonscopia		tab_app_clisma
			
*/