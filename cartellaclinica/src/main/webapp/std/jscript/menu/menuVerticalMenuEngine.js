var v_load_on_startup='';


//alert(parent.mainFrame.workFrame.document.location);
//alert(parent.mainFrame.workFrame.document.location + "&PROFILO="+profilo);


//se si dovesse incraniare Whale e db commentare la funzione setImagowebLoadOnStartup da tutto il js

// funzione che
// mostra o meno il layer
// del log della sincro
function expandLogSyncPacs(){
	ShowHideLayer("divLogSyncPacs");
}

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
		try{
			while(contatore<200){

				if (parent.mainFrame.workFrame.document){
					framesetCreato = true;
					break;
				}
				contatore++;
			}
		}
		catch(e){
			if(e.number==-2147024891); //accesso negato nel caso di frame contenente pagina di altro webapps
				framesetCreato = true;
		}

	if (!framesetCreato){
		return;
	}
	// ****************

    switch (valore)
	{
		/*GESTIONE DELLE TABELLE CON LA SERVLET SL_Manu_Tab_Frameset in imago.Manu_Tab*/
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
		/*
		RIPRISTINO CANCELLATI
		*/
		case 'ripristino_cancellati':
			ricerca_pazienti('COGN,NOME,DATA', '141', '*', 'ripristino_cancellati', 'ric_cogn_nome_data(');
			return;

		/*
		RICONCILIA/SPOSTA ESAMI
		*/
		case 'riconcilia_sposta_esami':
			ricerca_pazienti('COGN,NOME,DATA', '141', '380,*', 'RiconciliaSpostaEsami', 'ric_cogn_nome_data(');
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
			ricerca_pazienti('141', '*', '0', 'FromMenuVerticalMenu', '0');
			return;

		case 'numeroArchivio':
			if(baseGlobal.SOTTONUMERO == 'S')
				ricerca_pazienti('110', '*', '0', 'FromMenuVerticalMenu', '5');
			else
				ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', '2');
			return;

		case 'codiceFiscale':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', '1');
			return;

		case 'patientID':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', '3');
			return;

		case 'numero_nosologico':
			ricerca_pazienti('82', '*', '0', 'FromMenuVerticalMenu', '4');
			return;

		case 'ricerca_paz_reparto':	;
			//parent.mainFrame.workFrame.document.location.replace("SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=7&provenienza=FromMenuVerticalMenu");
			//setLoadOnStartup('SL_RicercaPazienteFrameset?rf1=141&rf2=*&rf3=0&provenienza=FromMenuVerticalMenu');
			//ricerca_pazienti('141', '*', '0,0', 'NoMenu', '7');
			ricerca_pazienti('141', '*', '0', 'consultazione_anagrafica', '7');
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
			magazzino('descr_art,cod_bar', 'FromMenuVerticalMenu', 'mg_art', '82', 'applica_mg_art');
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

		// Genera Agenda...
		case 'genera_agenda':
			parent.mainFrame.workFrame.document.location.replace("agendaInizio");
			return;

		// Prenota esame
		case 'prenotazione':
			parent.mainFrame.workFrame.document.location.replace("prenotazioneFrame?visual_bt_direzione=S&servlet=sceltaEsami%3Ftipo_registrazione%3DP%26cmd_extra%3Dparent.parametri%253Dnew+Array('PRENOTAZIONE')%3B%26next_servlet%3Djavascript:next_prenotazione();%26Hclose_js%3Dchiudi_prenotazione()%3B&events=onunload&actions=libera_all('" + baseUser.IDEN_PER + "', '" + basePC.IP + "');&visual_bt_direzione=N"); //3DschedaEsame
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

		case 'visualizzatoreCartelle':
			parent.mainFrame.workFrame.document.location.replace('visualizzatoreCartelle');
			return;

		case 'ricercaBisogni':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CARTELLA_CLIN_FILTRO_WK_BISOGNI');
			return;
		/********************************************************/

		// ********* gestione campi menu preferiti 	 ** //
		case 'menu_preferiti':
			parent.mainFrame.workFrame.document.location.replace("utentiOptionPreferiti");
			return;

		case 'cssProfile':
			document.form_hidden.action = "personalcssframeset";
    		document.form_hidden.submit();
			return;
		case 'actionList':
			document.form_hidden.action = "utentiactionlistframeset";
    		document.form_hidden.submit();
			return;

		case 'vistaStanzeReparto':
			parent.expandMenu();
			setLoadOnStartup('allettamento');
//			parent.mainFrame.workFrame.document.location.replace("allettamento");
			return;

		case 'wkPendenti':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CARTELLA_CLI_WK_PENDENTI');
			return;
		case 'wkRichiesteGeneriche':
			setLoadOnStartup('servletGenerator?KEY_LEGAME=FILTRO_RICHIESTE_RICOVERATI_GENERICHE');
//			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=FILTRO_RICHIESTE_RICOVERATI_GENERICHE');
			return;

		case 'WkBarellieri':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=WK_BARELLIERI_PAGINA');
			return;

		case 'WkStampaReferti':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=STAMPA_REFERTI_ON_DEMAND');
			return;

		case 'confLaboratorio':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CONFIGURAZIONE_PROFILO_LABORATORIO&INSERIMENTO=N');
			return;
		case 'configVisualLabo':
			parent.mainFrame.workFrame.document.location.replace('servletGeneric?class=configurazioneReparto.confLabo.cConfiguraVisualizzazioneDatiLaboratorio');
			return;

		case 'configSchedeLabo':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=WK_SCHEDE_FILTRO');
			return;
		/*case 'ConfVisualizzazione':
			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CONFIG_VISUALIZZAZIONE_ESA_LABORATORIO&CDC='+baseUser.LISTAREPARTI[0]);
			return;		*/
		case 'worklistRicoverati':
			var profilo=baseUser.MODALITA_ACCESSO;
			parent.mainFrame.barFrame.gestioneProfiliWk(profilo);
			setLoadOnStartup('servletGenerator?KEY_LEGAME=FILTRO_WK_RICOVERATI');
//			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=FILTRO_WK_RICOVERATI');
			return;

		/*Test Integraizione PS - Lino*/

		case 'datiLabPs':
			parent.expandMenu();
			parent.mainFrame.workFrame.document.location.replace('IntegPs?tipo=D&reparto=MED_1&num_nosologico=1-2010-29223');
			return;
		case 'datiEtichettePs':
			parent.expandMenu();
			parent.mainFrame.workFrame.document.location.replace('IntegPs?tipo=E&idRichiesta=22222');
			return;
		case 'refConsulenze':
			parent.expandMenu();
			setLoadOnStartup('servletGenerator?KEY_LEGAME=FILTRO_WK_CONSULENZE');
//			parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=FILTRO_WK_CONSULENZE');
			return;
        case 'CONSULTAZIONE_IN_OUT':
            parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=CONSULTAZIONE_IN_OUT');
            return;
         case 'accessi_dh':
			setLoadOnStartup('servletGenerator?KEY_LEGAME=FILTRO_WK_ACCESSI_DH');
//        	parent.mainFrame.workFrame.document.location.replace('servletGenerator?KEY_LEGAME=FILTRO_RICHIESTE_RICOVERATI_GENERICHE');
			return;
         case 'prescrizioniStd': 
        	 parent.mainFrame.workFrame.document.location.replace("servletGenerator?KEY_LEGAME=WRAPPER_CDC&funzione="+valore);
        	 return;
	}
}
/*
function setLoadOnStartup(url){
	if(url!=baseUser.LOADONSTARTUP){
		dwr.engine.setAsync(false);
		dwrUtility.executeQuery("update imagoweb.web set loadonstartup='"+url+"' where webuser='"+baseUser.LOGIN+"'",callBack);
		dwr.engine.setAsync(true);
	}else{
		parent.mainFrame.workFrame.document.location.replace(url);
	}

	baseUser.LOADONSTARTUP=url;

	function callBack(resp){
		if(resp!='1')	alert("Errore durante il salvataggio di un'impostazione");
		parent.mainFrame.workFrame.document.location.replace(url);
	}
}*/
function setLoadOnStartup(url){

	parent.mainFrame.workFrame.document.location.replace(url);
	v_load_on_startup=url;
}

//funzione che setta il campo loadonstartup con la url appena chiusa
function setImagowebLoadOnStartup(){

	var url=v_load_on_startup;
	//alert("update imagoweb.web set loadonstartup='"+url+"' where webuser='"+baseUser.LOGIN+"'");


	if (url!=''){
		if(url!=baseUser.LOADONSTARTUP){
			top.executeStatement("Web.xml","setLoadOnStartup",[baseUser.LOGIN,url]);
		}
	}

	function callBack(resp){
		//if(resp!='1'){	alert("Errore durante il salvataggio di un'impostazione");}
		//parent.mainFrame.workFrame.document.location.replace(url);
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
	document.body.onunload=function(){setImagowebLoadOnStartup();};
}

function fillLabelUtentiLoggati(indice){

	if (isNaN(indice)){return;};
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
}
*/


/**
 * ricerca_pazienti('140', '*', '0', 'FromMenuVerticalMenu', '6');
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

	//alert(rows_frame_uno + '  ' + rows_frame_due + '  ' + rows_frame_tre + 'tipo_ricerca: '+tipo_ricerca);

	doc.action = 'SL_RicercaPazienteFrameset';
	doc.target = 'workFrame';

	doc.submit();
}


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

	var parametro = "";

	return;
	if (isNaN(indice)){return;};
	if (indice<0){return;}
	try{
		ajaxUserManage.ajaxRemoveLoggedUser(listaUtentiLoggati[indice].WEBUSER,listaUtentiLoggati[indice].IP,callbackChangeUserConnectStatus);
	}
	catch(e){
		alert("Ajax error");
	}
}


function callbackChangeUserConnectStatus(errore){

	var indiceSelezionato='';
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
