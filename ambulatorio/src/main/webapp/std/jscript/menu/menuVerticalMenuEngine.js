
function expandLoggedUser(){
	ShowHideLayer("divContainerLoggedUser");
}


// funzione
// che gestisce le varie chiamate del menu
function apri(valore)
{
	var contatore=0;
	var framesetCreato=false;
	if (valore=="")
	{
    	return;
	}
	// ****************
	// controllo se ha generato il frameset
	while(contatore<200){
		try{
			if (parent.mainFrame.workFrame.document){
				framesetCreato = true;
				break;
			}
		}
		catch(e){
			;
		}
		contatore++;
	}
	if (!framesetCreato){
		return;
	}
	// ****************

    switch (valore)
	{
		/*        
			GESTIONE DELLE TABELLE CON LA SERVLET SL_Manu_Tab_Frameset in imago.Manu_Tab
		*/
		case 'T_PATOLOGIE': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_TAB_TIPO_MOD_MED_M': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_TAB_TIPO_MOD_MED_A': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_TAB_TIPO_MOD_MED_P': 
			 manu_tab(valore, '');
             return; 	  	 
			 
		case 'T_CDC': 
			 manu_tab(valore, '');
             return; 
		
		case 'T_CS': 
			 manu_tab(valore, '');
             return;
			 
		case 'T_CS_1': 
			 manu_tab(valore, '');
             return;
		
		case 'T_COMUNI': 
			 manu_tab(valore, '');
             return;
		
		case 'T_ESA': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_FASCE_ORA': 
			 manu_tab(valore, '');
             return;			 
		
		case 'T_MED': 
			 manu_tab(valore, '');
             return; 
		//*********************************************************************
		case 'utentiLoggati':
		  document.form_hidden.action = "utentiactionlistframeset";
          document.form_hidden.submit();	
		  return;		
		//****************************** TARMED *******************************		
		case 'T_TARMED': 
			 manu_tab(valore, '');
             return; 
		//*********************************************************************			
			 
		case 'T_ONERE': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_OPE': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_PRF': 
			 manu_tab(valore, '');
             return;
			 
		case 'T_PRO': 
			 manu_tab(valore, '');
             return;			 
			 
		case 'T_REFSTD': 
			 manu_tab(valore, '');
             return;			 
		
		case 'T_TEST': 
			 manu_tab(valore, '');
             return;			 
					
		case 'T_STATO_PAZ': 
			 manu_tab(valore, '');
             return;
		
		case 'T_STATO_CART': 
			 manu_tab(valore, '');
             return;
			 
		case 'T_SALE': 
			 manu_tab(valore, '');
             return; 

		case 'T_MAC': 
			 manu_tab(valore, '');
             return; 

		case 'T_ARE': 
			 manu_tab(valore, '');
             return; 
			 
		case 'T_TARE_ESA': 
			manu_tab(valore, '');
            return; 

		case 'T_TEC': 
			 manu_tab(valore, '');
			 return; 			 
		//****************************** TARMED *******************************		
		case 'T_TARMED': 
			 manu_tab(valore, '');
             return; 
		//*********************************************************************					 
	 	case 'T_TICKET': 
			 manu_tab(valore, '');
             return; 
        /*
		GESTIONE DEGLI UTENTI 
		*/
		case 'utenti': 
			 manu_tab('T_WEB', '105,*');
             return; 
		/*
		GESTIONE PC 
		*/
		case 'pc': 
			 manu_tab('T_PC', '80,*');
             return; 	 
		
		/*MEDICINA NUCLEARE: PREPARAZIONE RADIOFARMACO*/	 
		case 'preparazione_radiofarmaco':
			  parent.mainFrame.workFrame.document.location.replace("SL_PrepRadiofarmacoFrameset?hcontext_menu=preparazione_radiofarmaco");
			  return; 
		case 'worklist_medicina_nucleare':
             parent.mainFrame.workFrame.document.location.replace("SL_WkMedicinaNucleare");
             return;	  
	
		case 'magazzinomn':
		 	 //parent.mainFrame.workFrame.document.location.replace("SL_MagazzinoMNFrameset?colonne=50,50&righe=33,33,33");	
			 magazzinoMN();
			 return;

		case 'BidoniMN':
			parent.mainFrame.workFrame.document.location.replace("SL_BidoniMNFrameset?colonne=100&righe=18,40,42");
			return;
			 
		 /*
		 GESTIONE DEI PARAMETRI DELLE PROCEDURE
		 */
         case 'globali':
             parent.mainFrame.workFrame.document.location.replace("ParamProcServlet");
             return;
			 
		/*
		GESTIONE DEI CAMPI
		 */
         case 'GestCampi':
             parent.mainFrame.workFrame.document.location.replace("Servlet_GestCampi");
             return;
			 
			              /*
		GESTIONE SISS
		 */
         case 'SISS_Santer_RicercaPaziente':
             parent.mainFrame.workFrame.document.location.replace("SrvRicercaPazSissFramese");
             return;


		/*
		/*
		RIPRISTINO CANCELLATI
		*/	 
		case 'ripristino_cancellati':
			ricerca_pazienti('141', '*', '0', 'ripristino_cancellati', '0');
			//ricerca_pazienti('COGN,NOME,DATA', '141', '*', 'ripristino_cancellati', 'ric_cogn_nome_data(');
			return; 
			
		/*
		RICONCILIA/SPOSTA ESAMI
		*/	
		case 'riconcilia_sposta_esami':
			ricerca_pazienti('141', '380', '*', 'RiconciliaSpostaEsami', '0');
			//ricerca_pazienti('COGN,NOME,DATA', '141', '380,*', 'RiconciliaSpostaEsami', 'ric_cogn_nome_data(');
			return; 
		
		/*
		RICERCA NEL TESTO DEL REFERTO
		*/	
		case 'ricerca_testo_referto':
			document.form_hidden.action = "SL_RicercaTestoRefertoFrameset?htipo_wk=WK_RICERCA_TESTO_REFERTO&hcontext_menu=ric_testo_referto";
    		document.form_hidden.submit();
            return; 	 	
			
		/*FIRMA DIGITALE MULTIPLA*/	
		case 'firma_digitale_multipla':
			document.form_hidden.action = "SL_FirmaDigitaleMultiplaWorklist";
    		document.form_hidden.submit();
            return; 	
			 
		/*
		GESTIONE DELLA RICERCA DEL PAZIENTE 	 
		*/
		case 'cognomeNomeData':
			ricerca_pazienti('141', '*', '0', 'FromMenuVerticalMenu', 'A');//ricerca_pazienti('COGN,NOME,DATA', '141', '*,0', 'FromMenuVerticalMenu', 'ric_cogn_nome_data(');//,*
			return; 

		case 'numeroArchivio':
			if(baseGlobal.SOTTONUMERO == 'S')
				ricerca_pazienti('110', '*', '0', 'FromMenuVerticalMenu', 'F');																																									            else
				ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', 'C');//ricerca_pazienti('NUM_ARC', '110', '*,0', 'FromMenuVerticalMenu', 'ric_num_arc(');
																																								
			return; 	
		
		case 'codiceFiscale':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', 'B');//ricerca_pazienti('COD_FISC', '82', '*,0', 'FromMenuVerticalMenu', 'ric_cod_fisc(');//,*
			return; 
			
		case 'patientID':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', 'D');//ricerca_pazienti('ID_PAZ_DICOM', '82', '*,0', 'FromMenuVerticalMenu', 'ric_pat_id(');//,*
			return; 
			
		case 'numero_nosologico':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', 'E');//ricerca_pazienti('NUM_NOSOLOGICO', '82', '*,0', 'FromMenuVerticalMenu', 'ric_num_nos(');//,*
			return; 
			
		case 'ricercaDaConfigurare':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', 'G');
			return; 	
			

		//*********************************     GESTIONE DELLA RICERCA ESAMI		*************************************************/
		case 'id_esame_dicom':
			document.form_ric_esa.topSource.value = 'ParametriRicercaEsa?param_ric_esa=id_esame_dicom';
			document.form_ric_esa.submit();
			return; 	
			
		case 'num_pre':
			document.form_ric_esa.topSource.value = 'ParametriRicercaEsa?param_ric_esa=numacc';
			document.form_ric_esa.submit();
			return; 	
			
		case 'cognome_nome_data':
			document.form_ric_esa.topSource.value = 'ParametriRicercaEsa?param_ric_esa=cognome';
			document.form_ric_esa.submit();
			return; 		
			
		/***************************************************************************************************************************/
		
		
		/*********************************        GESTIONE DEL MAGAZZINO		*************************************************/
		case 'mg_magazzini':
			magazzino('descr_maga', 'FromMenuVerticalMenu', 'mg_magazzini', '82', 'applica_mg_mag');
			return;

	    case 'mg_art':
			magazzino('descr_art,cod_bar,attivo,attivo, attivo', 'FromMenuVerticalMenu', 'mg_art', '110', 'applica_mg_art');
			return;
			
	     case 'mg_cau':
		 	magazzino('descr_causali', 'FromMenuVerticalMenu', 'mg_cau', '82', 'applica_mg_cau');
			return;
	
		case 'mg_mov':
		magazzino('descr_mov_art,magazzino_attivo,codice_mov_barre,lotto_mov,txtDaData,txtAData', 'FromMenuVerticalMenu', 'mg_mov', '142', 'applica_mg_mov');//,ordinamento_mov,tipo_ordinamento
			return;
		
/********************************************       GESTIONE RICHIESTE		*************************************************/
		case 'richieste':
			parent.mainFrame.workFrame.document.location.replace("GestRichiesteFrameSet");
			return;
/****************************************************************************************************************************/ 		 
		case 'teleconsulto':
			parent.mainFrame.workFrame.document.location.replace("SrvTeleCFiltri");
			return;	 
         case 'anag':
             wndAnag = window.open("SL_MainAnag","","width=800,height=650, status=yes, top=0,left=0");
             return;
         case 'worklist':
             parent.mainFrame.workFrame.document.location.replace("worklistInizio");
             return;
         case 'campiwk':
             parent.mainFrame.workFrame.document.location.replace("utentiCampiWk");
             return;
         case 'gruppi':
             parent.mainFrame.workFrame.document.location.replace("SL_Group");
             return;

		/************************* Jack *************************/
		// Genera Agenda...
		case 'genera_agenda':
			parent.mainFrame.workFrame.document.location.replace("agendaInizio");
			return;
		
		// Prenota esame
		case 'prenotazione':
			parent.mainFrame.workFrame.document.location.replace("prenotazioneFrame?visual_bt_direzione=S&servlet=sceltaEsami%3Ftipo_registrazione%3DP%26cmd_extra%3DhideMan()%3Bparent.parametri%253Dnew+Array('PRENOTAZIONE')%3B%26next_servlet%3Djavascript:next_prenotazione();%26Hclose_js%3Dchiudi_prenotazione()%3B&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&visual_bt_direzione=N"); //3DschedaEsame
			return;
		
		// Consulta prenotazione
		case 'consulta_prenotazione':
			parent.mainFrame.workFrame.document.location.replace("prenotazioneFrame?servlet=consultazioneInizio%3Ftipo%3DCDC&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');");
			return;
		
		// Disabilita macchine/ Modifica orari
		case 'disab_mac':
			parent.mainFrame.workFrame.document.location.replace("disabilitaMacchinaInizio");
			return;
		
		// Disabilita macchine/ Modifica orari
		case 'statistiche_prenotazione':
			parent.mainFrame.workFrame.document.location.replace("statisticheEsami");
			return;
		
		// Ebbene si... firma....
		case 'mn_firma_multipla':
			parent.mainFrame.workFrame.document.location.replace("vitroWork");
			return;
		/********************************************************/
		
		// ********* gestione campi menu preferiti 	 ** //
		case 'menu_preferiti':
			parent.mainFrame.workFrame.document.location.replace("utentiOptionPreferiti");		
			return;
		// *********************************************//
		// ********* gestione associazione Esami TarMed 	 ** //
		case 'associaTarMed2Esa':
			parent.mainFrame.workFrame.document.location.replace("associaTarMed2Esa_frameset");		
			return;
		// associazione pazienti remoti  **/
		case 'anagRemotaTarMed':
			parent.mainFrame.workFrame.document.location.replace("tarMed_Paziente2Esami_frameset");				
			return;			
	
		/***********************************************************/
		/************************* Fabio *************************/
		case 'STAMPA_TABELLE':
			wndAnag = window.open("SL_Stampa_Tab","","top=0,left=0,width="+ screen.availWidth +",height=" + screen.availHeight +",status=yes,scrollbars=yes");
			return;
			case 'accMultipla':
			wndAnag = window.open("SL_ACC_MULFrameset","","top=200,left=300,width="+ screen.availWidth -20+",height=" + screen.availHeight-20 +",status=yes,scrollbars=yes");
        	return;
			
		 case 'ACR':
			wndAnag = window.open("SL_ACROCX","","top=200,left=300,width=700,height=745,status=yes,scrollbars=yes");
        	return;
		case 'PLGiornaliero':
			wndAnag = window.open("FrameSetLavoroGiornaliero","","top=0,left=0,width="+ screen.availWidth -20+",height=" + screen.availHeight-20 +"status=yes,scrollbars=yes");
        	return;
		case 'Previsione':
			wndAnag = window.open("frameSetPrevisione","","top=0,left=0,width="+ screen.availWidth -20+",height=" + screen.availHeight-20 +"status=yes,scrollbars=yes");
        	return;
		/***********************************************************/
		case 'log_errori':
			document.form_hidden.action = "SL_Log_errori_Tab_Frameset";
    		document.form_hidden.submit();
            return;
		case 'rows_coll':
			document.form_hidden.action = "SL_Rows_coll_Frameset";
    		document.form_hidden.submit();
            return;        
		case 'cssProfile':
			document.form_hidden.action = "personalcssframeset";
    		document.form_hidden.submit();
			return;
		case 'actionList':
			document.form_hidden.action = "utentiactionlistframeset";
    		document.form_hidden.submit();
			return;			
			
		/*GESTIONE RIA*/
	case 'esiti':
          document.form_hidden.action = "LaboEsitiMainFrame";
          document.form_hidden.submit();
          return;
	case 'checkin':
          document.form_hidden.action = "LaboCheckInMainFrame";
          document.form_hidden.submit();
          return;
	case 'prenotazioni':
          document.form_hidden.action = "LaboPrenotazioniMainFrame";
          document.form_hidden.submit();
          return;
	case 'accettazioni':
          document.form_hidden.action = "LaboAccettazioniMainFrame";
          document.form_hidden.submit();
          return;	

	/*
		Console admin / Richieste modifica
	*/
	case 'console_admin':
		parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CONSOLE_ADMIN');
		return;
	/* Screening */
	case 'screening':
		parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=SCREENING');
		return;
		
	case 'screening_consulta':
		parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=SCREENING_CONSULTA_PREN');
		return;
	case 'screening_esclusioni':
		parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=SCREENING_ESCLUSIONI');
		return;
	
	case 'screening_invitate':
		parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=SCREENING_INVITI');
		return;
		
	case 'visualizzatoreCartelle':
		parent.mainFrame.workFrame.document.location.replace('visualizzatoreCartelle');
		return;
	}
}

// funzione chiamata
// sul load della servlet

function initGlobalObject(){
	window.onunload = function scaricaTutto(){scarica();};	
	initbaseGlobal();
	initbasePC();
	initbaseUser();
	fillLabels(arrayLabelName, arrayLabelValue);
	//apri("worklist");
}   

function fillLabelUtentiLoggati(indice){
	
	if (isNaN(indice)){return};
	if (indice<0){return;}
	try{
		document.all.lblCodeValue_WEBUSER.innerText = listaUtentiLoggati[indice].WEBUSER ;
		document.all.lblCodeValue_IP.innerText = listaUtentiLoggati[indice].IP ;
		document.all.lblCodeValue_DATA_ACCESSO.innerText = listaUtentiLoggati[indice].DATA_ACCESSO ;
		document.all.lblCodeValue_WEBSERVER.innerText = listaUtentiLoggati[indice].WEBSERVER ;
		document.all.lblCodeValue_SCOLLEGA.innerText = listaUtentiLoggati[indice].SCOLLEGA ;						
	}
	catch(e){
	}
}


function manu_tab(procedura, frame_rows){
	/*form_hidden è dentro la classe menu/MenuVerticalMenu*/
	document.form_hidden.action = "SL_Manu_Tab_Frameset";
    document.form_hidden.procedura.value = procedura;
	if(frame_rows == '')
		frame_rows = '133,*';
	document.form_hidden.frame_rows.value = frame_rows;
    document.form_hidden.submit();
}


/**
*/
function ricerca_pazienti(rows_frame_uno, rows_frame_due, rows_frame_tre, provenienza, tipo_ricerca)
{
	/*form_ric_paz è dentro la classe menu/MenuVerticalMenu*/
	
	var doc = document.form_ric_paz;
	
	doc.rf1.value = rows_frame_uno;
	doc.rf2.value = rows_frame_due;
	doc.rf3.value = rows_frame_tre;
	doc.provenienza.value    = provenienza;
	doc.tipo_ricerca.value   = tipo_ricerca;
	
	//alert(rows_frame_uno + '  ' + rows_frame_due + '  ' + rows_frame_tre);

	doc.action = 'SL_RicercaPazienteFrameset';
	doc.target = 'workFrame';

	doc.submit();
}

/*
function ricerca_pazienti(tipo_ricerca, righe_frame_uno, righe_frame_due, provenienza, nome_funz)
{
	//form_ric_paz è dentro la classe menu/MenuVerticalMenu
	
	document.form_ric_paz.action = 'SL_RicercaPazienteFrameset';//RicPazFrameset
	
	document.form_ric_paz.param_ric.value = tipo_ricerca;
	document.form_ric_paz.rows_frame_uno.value = righe_frame_uno;
	document.form_ric_paz.rows_frame_due.value = righe_frame_due;
	document.form_ric_paz.menuVerticalMenu.value = provenienza;
	document.form_ric_paz.nome_funzione_ricerca.value = nome_funz;
	document.form_ric_paz.submit();
}*/


function magazzino(tipo_ricerca, menuVerticalMenu, nome_tabella, frame_rows, nome_funzione_ricerca){
	document.form_magazzino.action = "GesMagazzinoFrameset";
	document.form_magazzino.nome_funzione_ricerca.value = nome_funzione_ricerca;
	document.form_magazzino.tipo_ricerca.value = tipo_ricerca;
	document.form_magazzino.menuVerticalMenu.value=menuVerticalMenu;
	document.form_magazzino.nome_tabella.value = nome_tabella;
	document.form_magazzino.frame_rows.value = frame_rows;
	document.form_magazzino.submit();
}



// **************************

function callChangeUserStatus(indice){
	
	var parametro = ""
	
	return;
	if (isNaN(indice)){return};
	if (indice<0){return;}
	try{
		ajaxUserManage.ajaxRemoveLoggedUser(listaUtentiLoggati[indice].WEBUSER,listaUtentiLoggati[indice].IP,callbackChangeUserConnectStatus)
	}
	catch(e){
		alert("Ajax error");
	}
}


function callbackChangeUserConnectStatus(errore){
	
	var indiceSelezionato
	// controllare errore
	if (errore!=""){
		alert(errore);
		return;
	}
	indiceSelezionato = document.all.idSelConnUser.selectedIndex;
	// cancellarlo dalla lista delle option
	remove_elem_by_sel("idSelConnUser");

}

function magazzinoMN(){
	var doc = document.form_magazzinoMN;

	doc.action = "SL_MagazzinoMNFrameset";
	
	doc.colonne.value = '50,50';
	doc.righe.value = '33,33,33';
	
	doc.tipo_wk_mr.value = 'MMN_MATERIALI_RADIOATTIVI';
	doc.label_titolo_mr.value = 'lt_mr';
	doc.table_mr.value = 'magazzinomn.MATERIALI_RADIOATTIVI';
	doc.hattivita_mr.value = 'S';
	
	doc.tipo_wk_kf.value = 'MMN_KIT_FREDDI';
	doc.label_titolo_kf.value = 'lt_kf';
	doc.table_kf.value = 'magazzinomn.KIT_FREDDI';
	doc.hattivita_kf.value = 'S';
	
	doc.tipo_wk_gen.value = 'MMN_GENERATORI';
	doc.label_titolo_gen.value = 'lt_g';
	doc.table_gen.value = 'magazzinomn.GENERATORI';
	doc.hattivita_gen.value = 'S';
	
	doc.tipo_wk_el.value = 'MMN_ELUIZIONI';
	doc.label_titolo_el.value = 'lt_e';
	doc.table_el.value = 'magazzinomn.ELUIZIONI';
	doc.hattivita_el.value = 'S';
	
	doc.tipo_wk_kc.value = 'MMN_KIT_CALDI';
	doc.label_titolo_kc.value = 'lt_kc';
	doc.table_kc.value = 'magazzinomn.KIT_CALDI';
	doc.hattivita_kc.value = 'S';
	
	doc.tipo_wk_b.value = 'MMN_BIDONI';
	doc.label_titolo_b.value = 'lt_b';
	doc.table_b.value = 'magazzinomn.BIDONI';
	doc.where_condition_b.value = " WHERE DELETED = 'N' AND CHIUSO = 'N' AND RITIRATO = 'N'";
	doc.hattivita_b.value = 'S';

	doc.submit();
}	
	
	


// funzione
// chiamata sull unload del frame
function scarica(){
	ajaxUserManage = null;	
}
// **************************
function RiconciliaPazCognNomeData(in_cogn,in_nome,in_data){
	
	apri('riconcilia_sposta_esami');
	setTimeout("RiconciliaPazCognNomeData2('"+in_cogn+"','"+in_nome+"','"+in_data+"')",1250);
	

}

function RiconciliaPazCognNomeData2(in_cogn,in_nome,in_data){
	
var doc = top.mainFrame.workFrame.RicPazRicercaFrame.document;

	doc.all.COGN.value=in_cogn;
	doc.all.NOME.value=in_nome;
	doc.all.DATA.value=in_data;
	top.mainFrame.workFrame.RicPazRicercaFrame.ricercaCognNomeData();
}