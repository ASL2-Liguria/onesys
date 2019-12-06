var WindowCartella = null;

$(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	document.getElementById('lblTitleCDC').innerText='GESTIONE RICHIESTA';
	gestioneComboRepSorgente();

	switch (baseGlobal.SITO) {
		case 'ASL2':
			break;
		case 'VERONA':
			if (typeof WindowCartella.$("form[name=EXTERN] input#auto_login").val() === "string" && typeof WindowCartella.CartellaPaziente !== "undefined"){
				WindowCartella.CartellaPaziente.Menu.hide();
				WindowCartella.$("div.chiudi, div.info, div.patient").hide();
			}
			break;
		default:
	}

	$('select[name=cmbRepSorgente]').change(function(){
			WindowCartella.DatiCartella.loadReparto($(this).find("option:selected").val().split('@')[$(this).find("option:selected").val().split('@').length-1]);
			appendDivACR(document.all.cmbRepDest.parentNode);
	});
	
	$("body").css({'overflow-y': 'auto'});
	
	try{
        WindowCartella.utilMostraBoxAttesa(false);
	}catch(e){
		/*se non è aperto dalla cartella*/
	}

	try{
		if(parent.document.getElementById('frameWork') != null){
			jQuery('#lblChiudi').parent().hide();
		}
	}catch(e){}

});


//funzione che scatta all'onload della pagina RICHIESTA_GENERICA_CDC e che gestisce il combo dei reparti di provenienza
function gestioneComboRepSorgente(){

	try{
		var cont=0;
		var combo=document.dati.cmbRepSorgente;
		var reparto = $('form[name=EXTERN] input[name=Hreparto_ricovero]').val() || getUnicoRepartoInElenco($('select[name=cmbRepSorgente] option[value!=""]'));

		//controllo se il reparto ricovero è valorizzato (e quindi sono dentro il reparto e dentro la cartella) e disabilito il combo
		if (reparto != "" && typeof reparto != 'undefined'){
			combo.disabled = true;
		}
		
		for(var i = 0; i < combo.options.length; i++){
			//alert(document.dati.cmbRepSorgente +'\n'+document.dati.cmbRepSorgente.options[i].innerText);

			var splitCombo = combo.options[i].value.split('@');

			if(splitCombo[3] == reparto){
				combo.options[i].selected = true;
				cont=1;
				break;
			}
		}

		// se non trovo il reparto giuridico tra quelli del paziente allora lo inserisco come  option all'interno del combo e lo seleziono
		if (cont==0 && reparto!='' && typeof reparto != 'undefined'){

			var vDati = WindowCartella.getForm(document);
			var vSelect = 'select descr from CENTRI_DI_COSTO where COD_CDC = \'' +vDati.reparto + '\'';
			
			
			var idenPro=WindowCartella.getForm(document).IdenPro;
			var codDecReparto=vDati.cod_dec_Reparto;
			var valueCombo=idenPro+ '@'+codDecReparto+'@I@'+vDati.reparto;

			dwr.engine.setAsync(false);
			toolKitDB.getResultData(vSelect , resp_check);
			dwr.engine.setAsync(true);

			function resp_check(resp){
				var text = resp;
				//alert('text: '+text+'\nvalue: '+valueCombo);
				combo.add( new Option(text, valueCombo,false,true));
			}
		}

		//se sono dentro la cartella, e quindi il combo è disabilitato, nascondo il pulsante chiudi
		if (combo.disabled == true){
			jQuery('#lblChiudi').parent().hide();
		}

		appendDivACR(document.all.cmbRepDest.parentNode);

		//cambio il titolo della pagina se ho le info sul paziente
		if (typeof document.EXTERN.PAZIENTE != 'undefined'){document.all.lblTitleCDC.innerText='Paziente: '+document.EXTERN.PAZIENTE.value;}

		//cambio delle labels
		switch(document.EXTERN.tipoAlbero.value){
		
			case 'ALBERO_PRENOTAZIONI':
				document.getElementById('lblTitleCDC').innerText = 'GESTIONE PRENOTAZIONE';
				break;
				
			case 'ALBERO_RICHIESTE_CONSULENZE':
				document.getElementById('lblTitleCDC').innerText  = 'GESTIONE RICHIESTA/CONSULENZA';
				break;
				
			default:
				document.getElementById('lblTitleCDC').innerText  = 'GESTIONE RICHIESTA';
				break;
		}
		
	}catch(e){
		//alert(e.description);
	}
	
	function getUnicoRepartoInElenco($cmb) {
		for(var i=0,length=$cmb.length;i<length;i++) {
			if (length==1) {
				return $cmb.get(i).value.split('@')[3];
			}
			break;
		}
		return '';
	}
}


function apriConsulenzaWhale(keyLegame, versione, destinatario, tipoRichiesta, tipoStruttura ) {

	var url;

	url = 'servletGenerator?KEY_LEGAME='+keyLegame;
	url+='&DESTINATARIO='+destinatario;
	url+='&Hiden_anag=' + document.EXTERN.Hiden_anag.value;
	url+='&HrepartoRicovero=' + document.EXTERN.Hreparto_ricovero.value;
	url+='&REPARTO=' + document.EXTERN.Hreparto_ricovero.value;
	url+='&LETTURA=N';

	if(typeof document.EXTERN.Hiden_visita!='undefined'){
		url+='&Hiden_visita=' + document.EXTERN.Hiden_visita.value;
	}

	url+='&TIPOLOGIA_RICHIESTA='+ tipoRichiesta;
	url+='&VERSIONE=' + versione;
	url+='&ID_STAMPA=&STAMPA=N';
	url+='&STRUTTURA='+tipoStruttura;
	url+='&Hiden_pro=' + document.EXTERN.Hiden_pro.value;
	url+='&FUNZIONE='+keyLegame;
	url+='&IDEN=';

	insNomePaz();
  	document.all.frameSchede.src = url;
}


//		Il parametro 'tipoRichiesta' è il codice che distingue la tipologia di richiesta;
//		la decrizione dei valori si trova nel commento
//		della colonna TIPOLOGIA_RICHIESTA nella tabella infoweb.TESTATA_RICHIESTE
function apriSchedaRichiesta(keyLegame,destinatario,versione,tipoRichiesta,tipo_scheda){

	var url;

	url = 'servletGenerator?KEY_LEGAME='+keyLegame;
	url+='&IDEN=';
	url+='&VERSIONE=' + versione;
	url+='&DESTINATARIO='+destinatario;
	url+='&Hiden_anag=' + document.EXTERN.Hiden_anag.value;
	url+='&HrepartoRicovero=' + document.EXTERN.Hreparto_ricovero.value;
	url+='&LETTURA=N';


	if(typeof tipo_scheda!='undefined'){
		url+='&Hcodice_scheda=' + tipo_scheda;
	}

	if(typeof document.EXTERN.Hiden_visita!='undefined'){
		url+='&Hiden_visita=' + document.EXTERN.Hiden_visita.value;
	}

	url+='&TIPOLOGIA_RICHIESTA='+ tipoRichiesta;
	url+='&ID_STAMPA=&STAMPA=N';
	url+='&Hiden_pro=' + document.EXTERN.Hiden_pro.value;
	
//	alert(top.DatiInterfunzione.get('CODICI_ESTERNI'))
	
	/*if (typeof top.document.EXTERN.CODICI_ESTERNI != 'undefined' && top.document.EXTERN.CODICI_ESTERNI.value != null) {
		url += "&CODICI_ESTERNI=" + top.document.EXTERN.CODICI_ESTERNI.value;
	}*/
	
	if(WindowCartella.DatiInterfunzione.get('CODICI_ESTERNI') != ""){
		url += "&CODICI_ESTERNI=" + WindowCartella.DatiInterfunzione.get('CODICI_ESTERNI').replace(/:/g,"=");
        WindowCartella.DatiInterfunzione.remove('CODICI_ESTERNI');
	}

	insNomePaz();

  	document.all.frameSchede.src = url;
}


function apriInserimentoVisita(keyLegame, versione, destinatario, tipoRichiesta,idenEsame,title) {

	var url;

	url = 'servletGenerator?KEY_LEGAME='+keyLegame;
	url+='&DESTINATARIO='+destinatario;
	url+='&Hiden_anag=' + document.EXTERN.Hiden_anag.value;
	url+='&HrepartoRicovero=' + document.EXTERN.Hreparto_ricovero.value;
	url+='&REPARTO=' + document.EXTERN.Hreparto_ricovero.value;
	url+='&LETTURA=N';

	if(typeof document.EXTERN.Hiden_visita!='undefined'){
		url+='&Hiden_visita=' + document.EXTERN.Hiden_visita.value;
	}

	url+='&TIPOLOGIA_RICHIESTA='+ tipoRichiesta;
	url+='&VERSIONE=' + versione;
	url+='&ID_STAMPA=&STAMPA=N';
	url+='&Hiden_pro=' + document.EXTERN.Hiden_pro.value;
	url+='&FUNZIONE='+keyLegame;
	url+='&IDEN_ESAME='+idenEsame;
	url+='&TITLE='+title;
	url+='&IDEN=';
	insNomePaz();
  	document.all.frameSchede.src = url;
}

function inserisciNoteVpo(){
	
	        var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_NOTE_VPO";
	        url += "&KEY_ID=0";
	        url += "&Hiden_anag="			+ document.EXTERN.Hiden_anag.value;
	        url += "&Hiden_visita="			+ document.EXTERN.Hiden_visita.value;
	        url+= '&reparto='               + document.EXTERN.Hreparto_ricovero.value;
	        document.all.frameSchede.src = url;
	    }
	



//funzione che crea il menu ad albero per la scelta della scheda di richiesta. Configurabile in CONFIG_ACR.
//Si passa 'obj' che è l'oggetto al quale si appende il div e il 'gruppo' che è l'omonima colonna in Radsql.CONFIG_ACR
function appendDivACR(obj){

	//se non ho reparto attivo h inutile proseguire
	if(document.dati.cmbRepSorgente.selectedIndex==0)return;

	var valueCmb = document.dati.cmbRepSorgente.options[document.dati.cmbRepSorgente.selectedIndex].value;

	splitValueCmb=valueCmb.split('@');

	var reparto = splitValueCmb[3];
	var gruppo='';

	_ACR_PARAMETER._SQL_ELENCO_ACR  = WindowCartella.baseReparti.getValue(reparto,document.EXTERN.tipoAlbero.value+'_SQL').replace('#REPARTO#',reparto).replace('#TIPO_ALBERO#',document.EXTERN.tipoAlbero.value);

	switch(document.EXTERN.tipoAlbero.value){
			
		case 'ALBERO_PRENOTAZIONI':
			gruppo = 'SCELTA_SCHEDA_PRENOTAZIONE_'+reparto;
			break;
			
		default:
			gruppo = 'SCELTA_SCHEDA_RICHIESTA_'+reparto;
			break;
	}
	

	document.EXTERN.Hreparto_ricovero.value=reparto;
	document.EXTERN.cod_dec_Reparto.value=splitValueCmb[1];
	document.EXTERN.Hiden_pro.value=splitValueCmb[0];
	document.getElementById('hIntEst').value=splitValueCmb[2];

	//al cambio di selezione svuoto il contenuto e lo ricreo
	if(document.all.cmbRepDest.parentNode.lastChild.id=='clsACR')
		document.all.cmbRepDest.parentNode.lastChild.removeNode(true);

	if(!document.all['clsACR']){
		divAcr = document.createElement('DIV');
		divAcr.id='clsACR';
		divAcr.className = 'clsACR';
		obj.appendChild(divAcr);
	}

	creaDivACR('clsACR', 0, gruppo , chiudiAlbero);

	try{
		
		var elmOL = document.all.cmbRepDest.parentNode.lastChild.firstChild;
		
		switch(document.EXTERN.tipoAlbero.value){
			
			case 'ALBERO_PRENOTAZIONI':
				elmOL.childNodes[0].firstChild.click();
				elmOL.childNodes[1].firstChild.click();
				break;
				
			case 'ALBERO_RICHIESTE_CONSULENZE':
				elmOL.childNodes[0].firstChild.click();
				elmOL.childNodes[1].firstChild.click();
				break;
			case 'ALBERO_RICHIESTE_CONSULENZE_PRE':
				elmOL.childNodes[0].firstChild.click();
				elmOL.childNodes[1].firstChild.click();
				break;
			case 'ALBERO_RICHIESTE_CONSULENZE_VPO':
				elmOL.childNodes[0].firstChild.click();
				elmOL.childNodes[1].firstChild.click();
				elmOL.childNodes[2].firstChild.click();
				elmOL.childNodes[3].firstChild.click();
				break;				
			default:
				elmOL.childNodes[0].firstChild.click();
				break;
		}	

	}catch(e){
		//alert(e.description);
	}
}


//funzione che dopo il clic per la scelta della richiesta nasconde il div dell'albero
function chiudiAlbero(){

	HideLayer('groupCDC');
}

/******************************************************************************************************************
Prenotazione richiamando POLARIS*/
function apriPrenotazionePolaris(tipo_chiamata, applicazione, cdc_destinatario/*idenAnagWhale, codDecProvWhale*/){

    WindowCartella.utilMostraBoxAttesa(false);

	var parametroCjs;
	var parametriProcedura = null;
	var idenAnagWhale=document.EXTERN.Hiden_anag.value;
	var codDecProvWhale = document.EXTERN.cod_dec_Reparto.value;
	var tipo='';
	var app='';
	var cdc='';
	var baseurl='';

	if(typeof tipo_chiamata != 'undefined'){
		tipo='PRENOTA';
	}else{
		tipo=tipo_chiamata;
	}
	
	if(typeof applicazione == 'undefined'){
		app='POLARIS';
	}else{
		app=applicazione;
	}
	
	if(typeof cdc_destinatario == 'undefined') {
		cdc == 'WHALE';
	} else {
		cdc = cdc_destinatario;
	}

	parametriProcedura = idenAnagWhale + ',' + codDecProvWhale;
	
	switch (app) {
	case 'GERICOS':
		parametroCjs = "GET_IDENTIFICATIVI_GERICOS@"+parametriProcedura+"@TRUE@string";
		baseurl = WindowCartella.baseGlobal.URL_PRENOTAZIONE;
		break;


	case 'POLARIS':
		parametroCjs = "GET_IDENTIFICATIVI_POLARIS@"+parametriProcedura+"@TRUE@string";
		baseurl = WindowCartella.baseGlobal.URL_PRENOTAZIONE;
		break;
	case 'AMBULATORIO':
		parametroCjs = "GET_IDENTIFICATIVI_AMBULATORIO@"+parametriProcedura+"@TRUE@string";
		//baseurl = WindowCartella.baseReparti.getValue(document.EXTERN.Hreparto_ricovero.value, 'URL_AMBULATORIO');
		  baseurl = top.NS_APPLICATIONS.switchTo('AMBULATORIO','');
		break;
	case 'ENDO':
		parametroCjs = "GET_IDENTIFICATIVI_POLARIS@"+parametriProcedura+"@TRUE@string";
		baseurl = 'http://10.106.0.145:8082/ambulatorio';
		break;
	default:
		alert('Applicazione destinataria sconosciuta');
		return;
	}
	//parametroCjs = "GET_IDENTIFICATIVI_POLARIS@"+parametriProcedura+"@TRUE@string";
	//parametroCjs = "GET_IDENTIFICATIVI_AMBULATORIO@"+parametriProcedura+"@TRUE@string";

	dwr.engine.setAsync(false);
	CJsUpdate.call_stored_procedure(parametroCjs, callPrenotazionePolaris);
	dwr.engine.setAsync(true);


	function callPrenotazionePolaris(POLARIS_idenAnag_idenPro) {

		var url = null;
		var parametri = null;

		if(POLARIS_idenAnag_idenPro != '' && POLARIS_idenAnag_idenPro.indexOf('jsRemote.CJsUpdate') != -1){
		
			alert('ATTENZIONE: si è verificato il seguente errore:\n' + POLARIS_idenAnag_idenPro);
			return;
		
		}else{
			parametri = POLARIS_idenAnag_idenPro.split('@');
			
			switch(tipo_chiamata){
				case 'PRENOTA_GERICOS':
				
					url = baseurl + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=PRENOTAZIONE_WHALE';
					url += '&ID_ANAG='+parametri[0];
					url += '&COD_PRO='+parametri[1];
					url += '&CDC=' + cdc;
					//url += '&events=onunload&actions=libera_all("' + baseUser.IDEN_PER + '", "' + basePC.IP + '");';
					//alert('Prenotazione GERICOS: \n\n' + url);
					break;

	
				case 'PRENOTA':
				
					url = baseurl + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=PRENOTAZIONE';
					url += '&IDEN_ANAG='+parametri[0];
					url += '&IDEN_PRO='+parametri[1];
					url += '&CDC_IDEN_PRO=' + cdc + '%40'+parametri[1];
					//url += '&events=onunload&actions=libera_all("' + baseUser.IDEN_PER + '", "' + basePC.IP + '");';
					//alert('Prenotazione POLARIS: \n\n' + url);
					break;

				case 'CONSULTA':

					url = baseurl + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=CONSULTAZIONE';
					url += '&IDEN_ANAG='+parametri[0];
					url += '&IDEN_PRO='+parametri[1];
					url += '&CDC_IDEN_PRO=' + cdc + '%40'+parametri[1];
					//alert('Consultazione prenotazione POLARIS: \n\n' + url);
					break;
				case 'ENDO':

					url = baseurl + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=PRENOTAZIONE_ENDO';
					url += '&IDEN_ANAG='+parametri[0];
					url += '&IDEN_PRO='+parametri[1];
					url += '&CDC_IDEN_PRO=' + cdc + '%40'+parametri[1];			
					url += "&visualizza_metodica=N&cmd_extra=scelta_endoscopia();";
					//alert('Prenotazione ENDOSV POLARIS: \n\n' + url);
					break;
				default:
					url = baseurl + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
					url += '&IP='+WindowCartella.basePC.IP;
					url += '&KEY=PRENOTAZIONE';
					url += '&IDEN_ANAG='+parametri[0];
					url += '&IDEN_PRO='+parametri[1];
					url += '&CDC_IDEN_PRO=' + cdc + '%40'+parametri[1];
					break;
			}
			//lancio la url nel frame
			document.all.frameSchede.src = url;//window.open(url,"","status=yes fullscreen=yes scrollbars=yes");
		}
	}
}

/**/

function apriPrenotazioneGericos(){

	// url di esempio
	// http://10.67.3.30:8082/gericos/autoLogin?KEY=PRENOTAZIONE_CONSULTA&USER=jack&ID_NOSO=1110053180
    WindowCartella.utilMostraBoxAttesa(false);
	var num_nosologico =  WindowCartella.getForm(document).ricovero;
	
	var url = WindowCartella.baseGlobal.URL_PRENOTAZIONE + '/autoLogin?USER=' + WindowCartella.baseUser.LOGIN ;
	url += '&KEY=PRENOTAZIONE_CONSULTA';
	url += '&ID_NOSO='+num_nosologico;
	
	document.all.frameSchede.src = url;


}

/**/

/******************************************************************************************************************/

function apriPrenotazioneWhale(destinatario){

    WindowCartella.utilMostraBoxAttesa(false);
	
	var split = document.dati.cmbRepSorgente.options[document.dati.cmbRepSorgente.selectedIndex].value.split('@');

    url = "prenotazioneFrame?visual_bt_direzione=S&servlet=sceltaEsami%3Ftipo_registrazione%3DP%26" ;
    url += "Hiden_pro%3D"+ split[0];
    url += "%26Hcdc%3D"  + document.EXTERN.Hreparto_ricovero.value + "§"  + destinatario + "§";
    url += "%26Hiden_anag%3D" + document.EXTERN.Hiden_anag.value;
	//url += "%26Hiden_visita="+document.EXTERN.Hiden_visita.value;
	url += "%26cmd_extra%3Dparent.parametri%253Dnew+Array('PRENOTAZIONE_SCHEDA_RICOVERO')%3B%26next_servlet%3Djavascript:next_prenotazione();%26Hclose_js%3Dchiudi_prenotazione()%3B";
	url += "&events=onunload&actions=libera_all('" + WindowCartella.baseUser.IDEN_PER + "', '" + WindowCartella.basePC.IP + "');";

	//alert(url);
    document.all.frameSchede.src = url;
}

//funzione che apre le schede richiesta/prenotazione sul clic dell'albero
function RichiediPrenota(parametri){
	var abilitato = false;
	var Dest='';

	if(typeof parametri.utentiAbilitati=='undefined')
		abilitato=true;
	else{
		var ArTipi = parametri.utentiAbilitati.split('#');
		for (var i=0;i<ArTipi.length;i++)if(WindowCartella.baseUser.TIPO==ArTipi[i])abilitato=true;
	}

	/****** CONTROLLO PER ASL5 *****************/

	/************************** CONTROLLO (DA ELIMINARE IL PRIMA POSSIBILE) PER ABILITARE I TRE UTENTI INFERMIERI ALL'INSERIMENTO DELLE RICHIESTE DI RADIOLOGIA ********************/
	if(WindowCartella.baseGlobal.SITO=='ASL5'){
		if (parametri.tipoRichiesta == '1' || parametri.tipoRichiesta == '2'){
			if(WindowCartella.baseUser.LOGIN == '03119'|| WindowCartella.baseUser.LOGIN == '01373'|| WindowCartella.baseUser.LOGIN == '03246'){
				abilitato=true;
			}
		}
	}
	/********************************************************************************************************************************************************************************/

	if(!abilitato){
		alert('Utente non abilitato alla funzione richiesta');
		return;
	}

    WindowCartella.utilMostraBoxAttesa(true);

	var vSelect = 'select descr from CENTRI_DI_COSTO where COD_CDC = \'' +parametri.cdcDestinatario + '\'';

	dwr.engine.setAsync(false);
	toolKitDB.getResultData(vSelect , callBack);
	dwr.engine.setAsync(true);

	function callBack(resp){
		Dest = resp;
	}

	switch (parametri.tipo){
		case 'PG'://prenotazione GERICOS
			document.all.lblTitleCDC.innerText = 'Inserimento Prenotazione';
			//alert('111    ' + parametri.cdcDestinatario);
			apriPrenotazionePolaris('PRENOTA_GERICOS','GERICOS', parametri.cdcDestinatario);
			break;


			
		case 'RW'://richiesta whale
			document.all.lblTitleCDC.innerText = 'Invio Richiesta a: ' + Dest;
			parametri.cod_scheda_tab_codifiche = (typeof parametri.tipo_scheda =='undefined'?'':parametri.tipo_scheda);
			apriSchedaRichiesta(parametri.keyLegame,parametri.cdcDestinatario,parametri.versione,parametri.tipoRichiesta,parametri.tipo_scheda);
			break;
		case 'PW'://prenotazione whale
			parametri.cdcDestinatario = (typeof parametri.cdcDestinatario =='undefined'?WindowCartella.getForm(document).reparto:parametri.cdcDestinatario);
			document.all.lblTitleCDC.innerText = 'Invio Prenotazione a: ' + Dest;
			apriPrenotazioneWhale(parametri.cdcDestinatario);
			break;
		case 'PP'://prenotazione polaris
			document.all.lblTitleCDC.innerText = 'Inserimento Prenotazione';
			apriPrenotazionePolaris('PRENOTA','POLARIS');
			break;
		/*case 'PA'://prenotazione ambulatorio (non strumentale)
			document.all.lblTitleCDC.innerText = 'Inserimento Prenotazione';
			apriPrenotazionePolaris('PRENOTA','AMBULATORIO', parametri.cdcDestinatario);
			break;*/
		case 'PPE'://prenotazione polaris
			document.all.lblTitleCDC.innerText = 'Inserimento Prenotazione';
			apriPrenotazionePolaris('ENDO','ENDO');
			break;
		case 'CPB'://prenotazione polaris
			document.all.lblTitleCDC.innerText = 'Consulta Prenotazione';
			apriPrenotazioneGericos();
			break;
		case 'CP'://prenotazione polaris
			document.all.lblTitleCDC.innerText = 'Consulta Prenotazione';
			apriPrenotazionePolaris('CONSULTA','POLARIS');
			break;
		case 'CA'://consultazione ambulatorio (non strumentale)
			document.all.lblTitleCDC.innerText = 'Consulta Prenotazione';
			apriPrenotazionePolaris('CONSULTA','AMBULATORIO', parametri.cdcDestinatario);
			break;
		case 'CW'://consulenza whale
			document.all.lblTitleCDC.innerText = 'Inserimento Consulenza';
			//top.CartellaPaziente.setFunzione("INSERIMENTO_CONSULENZA");
			apriConsulenzaWhale(parametri.keyLegame,parametri.versione,parametri.cdcDestinatario,parametri.tipoRichiesta, parametri.tipoStruttura);
			break;
		case 'PA'://prenotazione ambulatorio
			//alert(parametri.cdcDestinatario)
            WindowCartella.inserisciPrestazioneSuReparto(parametri.cdcDestinatario);
			break;
		case 'VW'://visite pre operatorio whale
			document.all.lblTitleCDC.innerText = 'Inserimento Visite';
			apriInserimentoVisita(parametri.keyLegame,parametri.versione,parametri.cdcDestinatario,parametri.tipoRichiesta, parametri.iden_esame,parametri.title);
			break;
		case 'RC'://presa in carico
			document.all.lblTitleCDC.innerText = 'Richiesta di presa in carico';
			apriInserimentoVisita(parametri.keyLegame,parametri.versione,parametri.cdcDestinatario,parametri.tipoRichiesta, parametri.iden_esame,parametri.title);
			break;
	}

	chiudiAlbero();

}

//funzione che inserisce il nome del paziente nel title di RICHIESTA_GENERICA_CDC
function insNomePaz(){

	if (typeof document.EXTERN.PAZIENTE != 'undefined'){

		var spazi='\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t';
		var nomeAtt=document.all.lblTitleCDC.innerText;
		document.all.lblTitleCDC.innerText='Paziente: '+document.EXTERN.PAZIENTE.value+spazi+nomeAtt;
		//document.all.lblTitleCDC.innerText+=spazi+nomeAtt;
	}
}


//prende parametri dal top
function  gup( name ){

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var tmpURL = WindowCartella.location.href;
	var results = regex.exec( tmpURL );

	if( results == null ){
		return "";
	}else{
		return results[1];
	}
}