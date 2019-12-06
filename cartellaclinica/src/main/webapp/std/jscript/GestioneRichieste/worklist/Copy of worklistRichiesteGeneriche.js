try {
	parent.removeVeloNero('oIFWk');
} catch (e) {}

try {
	parent.removeVeloNero('idWkRichieste');
} catch (e) {}


function chiudiWkRichiesteGeneriche()
{
	top.opener.aggiorna();
	top.close();
}

//funzione legata al più (+) pulsante sulla wk degli esami/consulenze al di fuori della cartella
// tipo = 'RICHIESTE' , 'PRENOTAZIONI'
function insExt(tipo){

	var idenAnag=stringa_codici(array_iden_anag);
	var nome=stringa_codici(array_nome);
	var cognome=stringa_codici(array_cognome);
	var dataNascita=stringa_codici(array_data);
	var nomePaz='';
	var url='';

	//caso dove solo una riga è selezionata
	if (idenAnag != ''){

		nomePaz = cognome+' '+nome+' '+dataNascita;

	//caso nel quale ci siano più righe selezionate; per non creare problemi prendo il primo selezionato
	}else if(idenAnag.indexOf("*")>-1){

		var split=idenAnag.split("*");
		idenAnag=split[0].toString();

		split=nome.split("*");
		nome=split[0].toString();

		split=cognome.split("*");
		cognome=split[0].toString();

		split=dataNascita.split("*");
		dataNascita=split[0].toString();

		nomePaz = cognome+' '+nome+' '+dataNascita;

	//caso dove nessuna riga è selezionata
	}else if (idenAnag == ''){

		alert('Selezionare un paziente!');
		return;
	}

	switch(tipo){

		case 'RICHIESTE':

			//alert(tipo);
			url='servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC&INT_EST=E&Hiden_anag='+idenAnag;
			url+='&tipoAlbero=ALBERO_RICHIESTE';
			url+='&PRENOTAZIONE=N&LETTURA=N&Hreparto_ricovero=&cod_dec_Reparto=&Hiden_pro=';
			url+='&PAZIENTE='+nomePaz;

		break;

		case 'PRENOTAZIONI':

			//alert(tipo);
			url='servletGenerator?KEY_LEGAME=RICHIESTA_GENERICA_CDC&INT_EST=E&Hiden_anag='+idenAnag;
			url+='&tipoAlbero=ALBERO_PRENOTAZIONI';
			url+='&PRENOTAZIONE=S&LETTURA=N&Hreparto_ricovero=&cod_dec_Reparto=&Hiden_pro=';
			url+='&PAZIENTE='+nomePaz;

		break;

	}

	//alert(url);
	window.open(url,'WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");
}

//funzioni legata al più (+) pulsante sulla wk del paziente
function insRichCartella(){

	top.inserisciRichiestaConsulenza();

}

function insPrenCartella(){

	top.inserisciPrenotazione();

}

function vis_pop(idx)
{
	var cont = "<div><table>";//class='body_info'
	cont += "<tr>";
	cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.esa_prenotati.value + "</td>";
	cont += "</tr>";
	cont += "<tr>";
	cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][0] + "</td>";
	cont += "</tr>";

	if(array_informazioni[idx][1] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.med_pre.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][1]+"</td>";
		cont += "</tr>";
	}

	if(array_informazioni[idx][2] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.ope_rich.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][2] + "</td>";
		cont += "</tr>";
	}


	if(array_informazioni[idx][3] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.stato_paziente.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][3] + "</td>";
		cont += "</tr>";
	}

	if(array_informazioni[idx][4] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.quesito.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][4] + "</td>";
		cont += "</tr>";
	}

	if(array_informazioni[idx][5] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.quadro_cli.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][5] + "</td>";
		cont += "</tr>";
	}

	if(array_informazioni[idx][6] != '')
	{
		cont += "<tr>";
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.ope_contr.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>"+  array_informazioni[idx][6]+"</td>";
		cont += "</tr>";
		cont += "<tr>";
	}

	if(array_informazioni[idx][7] != '')
	{
		cont += "<td class = 'Titolo'>" + document.form_wkl_richieste.ope_annulla.value + "</td>";
		cont += "</tr>";
		cont += "<tr>";
		cont += "<td class = 'classTdFieldAppr'>" + array_informazioni[idx][7] + "</td>";
		cont += "</tr>";
	}

	cont += "</table></div>";

	popup(cont, '#f0ffff',100);
}


function aggiorna_wk(){

	//alert(top.name);
	var doc = document.frmAggiorna;

	doc.action = 'worklistRichieste';
	doc.target = '_self';
	doc.method = 'POST';

	inputPulsante = document.createElement('INPUT');
	inputPulsante.id = 'pulsanti';
	inputPulsante.name = 'pulsanti';
	inputPulsante.type = 'hidden';
	document.frmAggiorna.appendChild(inputPulsante);
	//alert(document.form_wkl_richieste.pulsanti.value);
	doc.pulsanti.value = document.form_wkl_richieste.pulsanti.value;

	try{

		doc.nome_vista.value = 'INFOWEB.VIEW_RICHIESTE_WORKLIST';
		doc.hidWhere.value = document.form_wkl_richieste.hidWhere.value;
		doc.provenienza.value = 'worklistRichieste';
		
		if(top.name == 'schedaRicovero'){
			doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE';
		}else{
			doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE';
		}

	}catch(e){
		alert(e.description);
	}

	doc.submit();
}

/*
	Funzione che effettua il controllo se le richieste selezionate sono INVIATE (TR.stato_richiesta == 'I')
*/
function controllo_stato_richieste(stato_richiesta_necessario, label_alert)
{
	var errore = false;
	var stato = stringa_codici(array_stato);
    //alert('STATO RICHIESTA: ' + stato);

	var stati = stato.split('*');

	for(var i = 0; i < stati.length; i++)
	{
		if(stati[i] != stato_richiesta_necessario)
		{
			errore = true;
			alert('Attenzione: la richiesta deve essere nello ' +label_alert);//alert(ritornaJsMsg(label_alert));
			i = stati.lenght;
		}
	}
	return errore;
}


function visualizza_referto()
{
	var idenTestata = null;
	var id_remoto = null;
	var codDecReparto = null;

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){

		idenTestata    = stringa_codici(array_iden);
		id_remoto      = stringa_codici(array_id_remoto);
		stato          = stringa_codici(array_stato);
		tipologia_ric  = stringa_codici(array_tipologia_richiesta);
		//codDecReparto  = stringa_codici(array_cod_dec_reparto);
		repCdc		   = stringa_codici(array_cdc);
	}else{

		idenTestata   = array_iden[rigaSelezionataDalContextMenu];
		id_remoto     = array_id_remoto[rigaSelezionataDalContextMenu];
		stato         = array_stato[rigaSelezionataDalContextMenu];
		tipologia_ric = array_tipologia_richiesta[rigaSelezionataDalContextMenu];
		//codDecReparto = array_cod_dec_reparto[rigaSelezionataDalContextMenu];
		repCdc		   = array_cdc[rigaSelezionataDalContextMenu];
	}

	if(stato!='R' && stato!='RP'){alert("La richiesta dev'essere nello stato REFERTATO");return;}

	if (tipologia_ric=='5'){

		/*Controllo su esami lo stato della consulenza*/
		var pBinds = new Array();
		pBinds.push(idenTestata);
		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeStatement('stampe.xml','ConsulenzeFromWKRichieste.Stampa',pBinds,2,returnStampaConsulenza);
		top.dwr.engine.setAsync(true);

		function returnStampaConsulenza(resp){

			if(resp[0]=='KO'){
				alert('Stampa Referto Consulenza in Errore\n'+resp[1]);
			}else{
				stampaConsulenzaDaWkRichieste(resp[2],resp[3],idenTestata,repCdc);
			}
		}

	}else{

		/*dwr.engine.setAsync(false);
		dwrConfermaLetturaEsito.init(idenTestata,resp);
		dwr.engine.setAsync(true);*/
		//url = "header?idPatient="+id_remoto+"&reparto="+codDecReparto ;
		//url += "&filtriAggiuntivi=identificativoEsterno~WHALE"+idenTestata;
                var vResp = top.executeStatement("OE_Richiesta.xml","ConfermaLetturaEsito",[idenTestata,baseUser.IDEN_PER]);
		 if(vResp[0]=='KO'){
		   alert('Segnalazione di lettura avvenuta con errori.\n'+vResp[1]);
                }

		url = "header?filtriAggiuntivi=identificativoEsterno~WHALE"+idenTestata;
		window.open (url,'','fullscreen=yes');
	}
}


function resp(res){

	if (res!='OK')
		alert(res);
}


function stampaConsulenzaDaWkRichieste(statoReferto,idenReferto,idenTestata,repCdc)
{
	var tipoWkUrl = getUrlParameter('Htipowk');
	var funzione  = 'CONSULENZE_REFERTAZIONE';
	var sf		  = "&prompt<pIdenTR>="+idenTestata;
	var reparto   = '';
	var anteprima = 'S';

	if (statoReferto == 'F')
	{
		var url = "ApriPDFfromDB?AbsolutePath="+top.getAbsolutePath()+"&idenVersione="+idenReferto;
		window.open(url,'','scrollbars=yes,fullscreen=yes');
	}
	else if (statoReferto=='V')
	{
		if(tipoWkUrl == 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE')
		{
			/* Da dentro la cartella*/
			reparto  = top.getForm(document).reparto;
			top.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
		}
		else
		{
			reparto  = repCdc;
			top.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
		}
	}
}

function visualizza_esa2(variabili){

	var altezza = screen.availHeight;
	var largh = screen.availWidth;

	//alert(baseGlobal.URI_REGISTRY);
	//alert(call);

	var myWin=window.open(baseGlobal.URI_REGISTRY+"?User=ImagoWeb&URN="+variabili,"","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");
}

function trasportaPaziente(){

	setRiga();

	if (rigaSelezionataDalContextMenu==-1)
	{
		iden_richiesta = stringa_codici(array_iden);
		stato_richiesta = stringa_codici(array_stato);
		ubicazione = stringa_codici(array_ubicazione_paziente);
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		stato_richiesta = array_stato[rigaSelezionataDalContextMenu];
		ubicazione = array_ubicazione_paziente[rigaSelezionataDalContextMenu];
	}

	if (stato_richiesta=='X')
	{
		alert("L'indagine non è stata annullata");
		return;
	}
	if (stato_richiesta=='1')
	{
		alert('Il paziente è già stato trasportato nel reparto di destinazione');
		return;
	}
	if (ubicazione=='2')
	{
		alert('Il paziente è già stato riportato nel reparto di ricovero');
		return;
	}

	if (!confirm("Si desidera confermare l'avvenuto trasporto del paziente?")){return;}

	dwr.engine.setAsync(false);
	dwrEseguiOperazione.init('T',null,iden_richiesta,null,null,post);
}


function prelevaPaziente(){

	setRiga();

	if (rigaSelezionataDalContextMenu==-1)
	{
		iden_richiesta = stringa_codici(array_iden);
		stato_richiesta = stringa_codici(array_stato);
		ubicazione = stringa_codici(array_ubicazione_paziente);
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		stato_richiesta = array_stato[rigaSelezionataDalContextMenu];
		ubicazione = array_ubicazione_paziente[rigaSelezionataDalContextMenu];
	}

	if (stato_richiesta=='X' && stato_richiesta=='I')
	{
		alert("L'indagine non è ancora stata pianificata o è stata annullata");
		return;
	}
	if (stato_richiesta=='A' && stato_richiesta=='P')
	{
		alert("L'indagine non è ancora conclusa");
		return;
	}
	if (ubicazione=='2')
	{
		alert('Il paziente è già stato riportato nel reparto di ricovero');
		return;
	}

	if (!confirm("Si desidera confermare l'avvenuto trasporto del paziente?")){return;}

	dwr.engine.setAsync(false);
	dwrEseguiOperazione.init('P',null,iden_richiesta,null,null,post);
}


function post(resp){

	if (resp!='OK')alert(resp);else{aggiorna_wk();}
	dwr.engine.setAsync(true);
}


function loadWaitWindow(){

	var doc = document.form_wkl_richieste;

	doc.action = 'worklistRichieste';
	doc.target = '_self';


	//alert(this.name + '\n' + top.name);
	if(top.name == 'schedaRicovero')
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE';
	else
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE';

	doc.submit();
}

/*
	Funzione per la paginazione associata al pulsante 'Avanti' della worklist delle Richieste
	@param pagina indica la pagina successiva a quella corrente
*/
function avanti(pagina){

	var doc = document.form_wkl_richieste;

	doc.action = 'worklistRichieste';
	doc.target = '_self';

	if(top.name == 'schedaRicovero')
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE';
	else{
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE';
	}

	doc.pagina_da_vis.value = pagina;
	doc.submit();
}

/*
	Funzione per la paginazione associata al pulsante 'Indietro' della worklist delle Richieste
	@param pagina indica la pagina precedente a quella corrente
*/
function indietro(pagina){

	avanti(pagina);
}


function caricamento(){

	try{
		connectDragDropToObjectById();
		// definisco la funzione di callback
		// che DOVRA' accettare in ingresso 2 parametri (nomeCampo, variazioneRelativa
		setCallBackAfterDragDrop("callBackFunctionAfterColResizing");
	}catch(e){
		alert(e.description);
	}
	try{top.utilMostraBoxAttesa(false);}catch(e){/*nel caso in cui non sia caricata nella cartella*/}
}

/**
*/
function annullamentoRichiestaGenerica(){

	//controllo se in sola lettura
	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)==true){
		alert('Funzionalità non disponibile');
		return;
	}

	var iden_richiesta = null;
	var stato_richiesta = null;
	var prenotazione_diretta = null;
	var tipologia_richiesta = null;
	var bloccoAnnullamento = false;

	iden_richiesta = stringa_codici(array_iden);
	stato_richiesta = stringa_codici(array_stato);
	prenotazione_diretta = stringa_codici(array_prenotazione_diretta);
	prelievo = stringa_codici(array_prelievo_effettuato);
	tipologia_richiesta = stringa_codici(array_tipologia_richiesta);

	if(iden_richiesta == '' || (iden_richiesta.length > 1 && iden_richiesta.indexOf('*') != -1)){
		alert(ritornaJsMsg("selezionare"));
		return;
	}

	//alert('tipologia_richiesta: '+tipologia_richiesta + '\nprenotazione_diretta: '+prenotazione_diretta+'\nstato_richiesta: '+stato_richiesta);
	//alert('controllo annullamento: '+ (tipologia_richiesta != '3' && prenotazione_diretta == 'N' && stato_richiesta != 'I'));

	//if((prenotazione_diretta == 'N' && stato_richiesta != 'I') || (stato_richiesta != 'P' && prenotazione_diretta == 'S')){

	if(tipologia_richiesta == '3'){
		if(stato_richiesta != 'P' && stato_richiesta != 'I')
			bloccoAnnullamento = true;
		else
			bloccoAnnullamento = false;

	}else{
		if(tipologia_richiesta != '3' && prenotazione_diretta == 'N' && stato_richiesta != 'I'){
			bloccoAnnullamento = true;
		}else{
			if(tipologia_richiesta != '3' && stato_richiesta != 'P' && prenotazione_diretta == 'S'){
				bloccoAnnullamento = true;
			}
		}
	}

	if(bloccoAnnullamento){
		alert('Attenzione: selezionare una prenotazione/richiesta inviata');
		return;
	}

	if(prelievo=='S'){alert('Impossibile annullare una richiesta già prelevata');return;}

	window.open("annullamentoRichiestaPrenotazione.html", "winAnnullamento", "width=600, height=300, top=150, left=300,resizable=yes");
}


/**
*/
function annullaRichiestaPrenotazioneGenerica(motivoAnnullamento){

	var param = null;
	var iden_richiesta = null;

	iden_richiesta = stringa_codici(array_iden);
	
	if(motivoAnnullamento != ''){
		motivoAnnullamento = motivoAnnullamento.toString().replace(/\'/,"''");
	}
	
	param="SP_ANNULLA_RICHIESTA@"+iden_richiesta+","+motivoAnnullamento+","+baseUser.IDEN_PER+"@TRUE@string";
	//alert('param='+param);
	dwr.engine.setAsync(false);
	CJsUpdate.call_stored_procedure(param,cbk_annullamentoRichiestaGenerica);
	dwr.engine.setAsync(true);
	
}

/**
*/
function cbk_annullamentoRichiestaGenerica(message){
	if(message != '' && message != 'OK'){alert('cbk_annullamentoRichiestaGenerica: ' + message);return;}
	aggiorna_wk();
}


function visualizzaRichiestaGenerica(richiesta){

	apriVisModScheda('VIS');
}


/**
*/
function richiestaLaboratorioPrelevata(){

	//controllo se in sola lettura
	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)==true){
		alert('Funzionalità non disponibile');
		return;
	}

	if(vettore_indici_sel.length > 1){

		alert('Attenzione! Selezionare una sola riga');
		return;
	}

	var param = null;
	var iden_richiesta = null;
	var stato_richiesta = null;
	var tipologia_richiesta = null;
	var prelevato = null;
	var messaggioErrore = '';
	var data='';
	var tipo_ricovero_codice = null;
	var id_richiesta2 = null;

	setRiga();

	if (rigaSelezionataDalContextMenu==-1)
	{
		iden_richiesta = stringa_codici(array_iden);
		stato_richiesta = stringa_codici(array_stato);
		tipologia_richiesta = stringa_codici(array_tipologia_richiesta);
		prelevato = stringa_codici(array_prelievo_effettuato);
		data = stringa_codici(array_data_richiesta);
		tipo_ricovero_codice=stringa_codici(array_tipo_ricovero_codice);
		id_richiesta2 = stringa_codici(array_id_richiesta2);
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		stato_richiesta = array_stato[rigaSelezionataDalContextMenu];
		tipologia_richiesta = array_tipologia_richiesta[rigaSelezionataDalContextMenu];
		prelevato = array_prelievo_effettuato[rigaSelezionataDalContextMenu];
		data = array_data_richiesta[rigaSelezionataDalContextMenu];
		tipo_ricovero_codice = array_tipo_ricovero_codice[rigaSelezionataDalContextMenu];
		id_richiesta2 = array_id_richiesta2[rigaSelezionataDalContextMenu];
	}
	
	if(/*tipologia_richiesta != '3' &&*/ tipologia_richiesta != '6' && tipologia_richiesta != '7' &&  tipologia_richiesta != '8'){
		
		if (id_richiesta2==''){
			if(confirm('Invio al laboratorio non effettuato.\n\nRicaricare la worklist esami/consulenze?')){
				aggiorna_wk();
				return;
			}else{
				return;
			}
		}

		if (top.baseReparti.getValue('','SITO')=='ASL2'){
			if(tipo_ricovero_codice == 'PRE-DH'){
				return alert('Impossibile segnalare prelevata una richiesta relativa ad un PRE-DH');
			}
		}else if (top.baseReparti.getValue('','SITO')=='ASL5'){
			//ISTRUZIONE EVENTUALE PER LA SPEZIA
		}
		
		//alert('IDEN: ' + iden_richiesta + '\nSTATO RICHIESTA: ' + stato_richiesta + '\nTIPOLOGIA_RICHIESTA: ' + tipologia_richiesta + '\nPRELIEVO: ' + prelevato);
	
		if	(
				iden_richiesta == '' ||
				(tipologia_richiesta == '0' && stato_richiesta != 'I') 			||
				(tipologia_richiesta != '0' && tipologia_richiesta != '3') 		||
				((tipologia_richiesta == '0' ||  tipologia_richiesta == '3') && prelevato == 'S')
			){
	
			if(iden_richiesta == '' ||
				(tipologia_richiesta == '0' && stato_richiesta != 'I')){
				messaggioErrore += '- selezionare una prenotazione/richiesta di laboratorio nello stato inviato\n';
			}
	
			if(tipologia_richiesta != '0' && tipologia_richiesta != '3'){
				if(messaggioErrore == '')
					messaggioErrore += '- selezionare una prenotazione/richiesta di laboratorio nello stato inviato\n';
			}
	
			if((tipologia_richiesta == '0' || tipologia_richiesta == '3') && prelevato == 'S'){
				messaggioErrore += '- la prenotazione/richiesta è già prelevata\n';
			}
			alert('Attenzione:\n' + messaggioErrore);
			return;
		}

		if(controllo_data(data).equal){
			if(array_stato_etic[rigaSelezionataDalContextMenu]=='2'){
			alert('Attenzione, la richiesta necessita di ristampa etichette');	
		}
	}
		
	if(!confirm("Proseguendo l'esame sarà indicato come PRELEVATO")){return;}

		//param = "2@UPDATE infoweb.TESTATA_RICHIESTE SET PRELIEVO_EFFETTUATO = 'S', ute_prelievo = "+baseUser.IDEN_PER+" WHERE IDEN = " + iden_richiesta;
		param="SP_LABO_PRELIEVO@"+iden_richiesta+","+baseUser.IDEN_PER+"@TRUE@string";
		//alert('param='+param);
		dwr.engine.setAsync(false);
		CJsUpdate.call_stored_procedure(param,cbk_richiestaLaboratorioPrelevata);
		dwr.engine.setAsync(true);

	}else{
		alert('Attenzione! Non è possibile dare il prelevato se la data richiesta è differente dalla data odierna');
	}
}


/**
*/
function cbk_richiestaLaboratorioPrelevata(message){

	if(message == null){
		aggiorna_wk();
		return;
	}

	var msg = message.toString().split('@');

	if(message != ''){alert('cbk_annullamentoRichiestaGenerica: ' + message);}

	if(message!= null && message != '' ){

		//alert('funzione di controllo: '+controllaNrRichieste(msg[1]).split('@')[0]);
		//return;
		if (controllaNrRichieste(msg[1]).split('@')[0] == 'OK'){

			var msgConfirm = msg[0] += '\n\n\n\Aprire la richiesta con la diuresi da compilare?';
			var indice = controllaNrRichieste(msg[1]).split('@')[1];
			//alert('msgConfirm: '+msgConfirm);

			if (confirm(msgConfirm)){
				//alert('apro la richiesta');
				apriVisModScheda('MOD', indice);
			}else{
				aggiorna_wk();
			}

		}else{
			alert(msg[0]);
			aggiorna_wk();
		}

	}else{
		aggiorna_wk();
	}
}


//funzione che controlla se la richiesta non prelevata è singola e restituisce l'indice nell'array per aprirla in modifica
function controllaNrRichieste(msg){

	//alert('msg funzion controllaN: '+msg);
	var v_splitIden=msg.split(',');
	var retMsg = 'KO@';


	if (v_splitIden.length == 1){

		//alert('v_splitIden[0] : '+v_splitIden[0]);
		//alert('array_iden : '+array_iden.toString());

		var indice=jQuery.inArray(v_splitIden[0], array_iden.toString().split(','));

		//alert('indice della richiesta nell\'array: '+indice);

		retMsg = 'OK@'+indice;
	}

	return retMsg;
}


function setRiga(obj){

	if(event.srcElement.nodeName.toUpperCase()!='DIV')return;

	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	return rigaSelezionataDalContextMenu;
}


function preleva(tipo){
	
	var sIdRichieste="";
	var sIdRicDaStamp="";
	var sIdRicDaPrel="";
	var sIdRicDH="";
	var risultatoErrore="";
	
	var parametri = {
		statoRichiesta:'',
		tipoRichiesta:'',
		dataRichiesta:'',
		idRichiesta2:'',
		idenTestata:'',
		tipo_ricovero_codice:'',
		prelevioEffettuato:'',
		statoEtic:''
	}
	
	//controllo se in sola lettura
	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)==true){
		alert('Funzionalità non disponibile');
		return;
	}
			
	switch(tipo){
	
		case 'PROVETTA' : 

			if(vettore_indici_sel.length > 1){
				alert('Attenzione! Selezionare una sola riga');
				return;
			}

			setRiga();

			if (rigaSelezionataDalContextMenu==-1){
			
				parametri.statoRichiesta 		= stringa_codici(array_stato);
				parametri.tipoRichiesta			= stringa_codici(array_tipologia_richiesta);
				parametri.dataRichiesta			= stringa_codici(array_data_richiesta);
				parametri.idRichiesta2			= stringa_codici(array_id_richiesta2);
				parametri.idenTestata			= stringa_codici(array_iden);
				parametri.tipo_ricovero_codice	= stringa_codici(array_tipo_ricovero_codice);
				parametri.prelevioEffettuato	= stringa_codici(array_prelievo_effettuato);
				parametri.statoEtic				= stringa_codici(array_stato_etic);
			
			}else{
			
				parametri.statoRichiesta 		= array_stato[rigaSelezionataDalContextMenu];
				parametri.tipoRichiesta			= array_tipologia_richiesta[rigaSelezionataDalContextMenu];
				parametri.dataRichiesta			= array_data_richiesta[rigaSelezionataDalContextMenu];
				parametri.idRichiesta2			= array_id_richiesta2[rigaSelezionataDalContextMenu];
				parametri.idenTestata			= array_iden[rigaSelezionataDalContextMenu];
				parametri.tipo_ricovero_codice	= array_tipo_ricovero_codice[rigaSelezionataDalContextMenu];
				parametri.prelevioEffettuato	= array_prelievo_effettuato[rigaSelezionataDalContextMenu];
				parametri.statoEtic				= array_stato_etic[rigaSelezionataDalContextMenu];
			}
			
			risultatoErrore=WK_RICHIESTE.controllaPrelievo(parametri);
				
				if (risultatoErrore!=''){
					if (sIdRichieste==""){
						sIdRichieste=risultatoErrore.sIdRichieste;
					}else{
						sIdRichieste += "*"+risultatoErrore.sIdRichieste;
					}										
					if (sIdRicDaStamp==""){
						sIdRicDaStamp=risultatoErrore.sIdRicDaStamp;
					}else{
						sIdRicDaStamp += "*"+risultatoErrore.sIdRicDaStamp;
					}										
					if (sIdRicDaPrel==""){
						sIdRicDaPrel=risultatoErrore.sIdRicDaPrel;
					}else{
						sIdRicDaPrel += "*"+risultatoErrore.sIdRicDaPrel;
					}										
					if (sIdRicDH==""){
						sIdRicDH=risultatoErrore.sIdRicDH;
					}else{
						sIdRicDH += "*"+risultatoErrore.sIdRicDH;
					}
				}
			
			break;
			
		case 'PRELEVA_SEL' :

			if (vettore_indici_sel == ''){
				alert('Attenzione! Nessuna riga selezionata');
				return;
			}
			
			for (var i=0;i<vettore_indici_sel.length;i++){
				
				//var indice = vettore_indici_sel[i];

				parametri = getParametri(vettore_indici_sel[i])
			
				risultatoErrore=WK_RICHIESTE.controllaPrelievo(parametri);
				
				if (risultatoErrore!=''){
					if (sIdRichieste==""){
						sIdRichieste=risultatoErrore.sIdRichieste;
					}else{
						sIdRichieste += "*"+risultatoErrore.sIdRichieste;
					}										
					if (sIdRicDaStamp==""){
						sIdRicDaStamp=risultatoErrore.sIdRicDaStamp;
					}else{
						sIdRicDaStamp += "*"+risultatoErrore.sIdRicDaStamp;
					}										
					if (sIdRicDaPrel==""){
						sIdRicDaPrel=risultatoErrore.sIdRicDaPrel;
					}else{
						sIdRicDaPrel += "*"+risultatoErrore.sIdRicDaPrel;
					}										
					if (sIdRicDH==""){
						sIdRicDH=risultatoErrore.sIdRicDH;
					}else{
						sIdRicDH += "*"+risultatoErrore.sIdRicDH;
					}
				}
			}
		
			break;
			
		case 'PRELEVA_TUTTE' : 
		
			for(var i=0;i<array_stato.length;i++){
				
				/*parametri.statoRichiesta 		= array_stato[i];
				parametri.tipoRichiesta			= array_tipologia_richiesta[i];
				parametri.dataRichiesta			= array_data_richiesta[i];
				parametri.idRichiesta2			= array_id_richiesta2[i];
				parametri.idenTestata			= array_iden[i];
				parametri.tipo_ricovero_codice	= array_tipo_ricovero_codice[i];
				parametri.prelevioEffettuato	= array_prelievo_effettuato[i];
				parametri.statoEtic				= array_stato_etic[i];*/
				
				parametri = getParametri(i);
			
				risultatoErrore=WK_RICHIESTE.controllaPrelievo(parametri);
				
				if (risultatoErrore!=''){
					if (sIdRichieste==""){
						sIdRichieste=risultatoErrore.sIdRichieste;
					}else{
						sIdRichieste += ","+risultatoErrore.sIdRichieste;
					}										
					if (sIdRicDaStamp==""){
						sIdRicDaStamp=risultatoErrore.sIdRicDaStamp;
					}else{
						sIdRicDaStamp += ","+risultatoErrore.sIdRicDaStamp;
					}										
					if (sIdRicDaPrel==""){
						sIdRicDaPrel=risultatoErrore.sIdRicDaPrel;
					}else{
						sIdRicDaPrel += ","+risultatoErrore.sIdRicDaPrel;
					}										
					if (sIdRicDH==""){
						sIdRicDH=risultatoErrore.sIdRicDH;
					}else{
						sIdRicDH += ","+risultatoErrore.sIdRicDH;
					}
				}
			}
			break;
	
	}
	
	WK_RICHIESTE.preleva_msg(sIdRichieste, sIdRicDaStamp, sIdRicDaPrel, sIdRicDH, tipo, cbk_richiestaLaboratorioPrelevata)
	
	function getParametri(pIndex){
		return {
			statoRichiesta:array_stato[pIndex],
			tipoRichiesta:array_tipologia_richiesta[pIndex],
			dataRichiesta:array_data_richiesta[pIndex],
			idRichiesta2:array_id_richiesta2[pIndex],
			idenTestata:array_iden[pIndex],
			tipo_ricovero_codice:array_tipo_ricovero_codice[pIndex],
			prelevioEffettuato:array_prelievo_effettuato[pIndex],
			statoEtic:array_stato_etic[pIndex]
		}
	}
	
}


//funzione che da il prelevato a tutte le richieste della giornata in questione. Controlla la data dall'array_data_richiesta e la tipologia delle richieste
function prelevaTutti(){

	var arIdRichiesta = new Array();
	var sIdRichieste="";
	var sIdRicDaStamp="";
	var sIdRicDaPrel='';
	var msg='Attenzione!';
	try{
		if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadOnly(document)==true){
			return alert('Funzionalità non disponibile');
		}
	}catch(e){}

	if(!confirm("Proseguendo le richieste saranno indicate come PRELEVATE")){
		return;
	}else{

		for(var i=0;i<array_stato.length;i++){
			
			var statoRichiesta = array_stato[i];
			var tipoRichiesta = array_tipologia_richiesta[i];
			var idRichiesta2 = ar

			//alert(array_data_richiesta[i]);

			if(controllo_data(array_data_richiesta[i]).equal){

				//alert('controllo_data('+array_data_richiesta[i]+').equal');

				if(statoRichiesta=='I'){
					
					if(tipoRichiesta=='0' || tipoRichiesta=='3'){
						
						if(array_prelievo_effettuato[i]=='N'){
							
							if (idRichiesta2!=''){
								
								//caso di SAVONA, il controllo sul PRE-DH viene effettuato
								if (top.baseReparti.getValue('','SITO')=='ASL2'){
									
									//controllo se è un PRE-DH, nel caso lo fosse nn lo prelevo
									if(tipo_ricovero_codice != 'PRE-DH'){
										
										if (sIdRichieste==""){
											sIdRichieste=array_iden[indice];
										}
										else{
											sIdRichieste += "*"+array_iden[indice];
										}
										
									}else{
										
										sIdRicDH=array_iden[indice];
									}
								
								//caso di SPEZIA, il controllo sul PRE-DH  NON  viene effettuato
								}else if (top.baseReparti.getValue('','SITO')=='ASL5'){
									
									if (sIdRichieste==""){
										sIdRichieste=array_iden[indice];
									}
									else{
										sIdRichieste += "*"+array_iden[indice];
									}
								}
								
								//controllo che l'etichetta non sia da ristampare in seguito alla modifica dal laboratorio
								if(array_stato_etic[indice]=='2'){
									if (sIdRicDaStamp==""){
										sIdRicDaStamp=array_id_richiesta2[indice];
									}
									else{
										sIdRicDaStamp += ","+array_id_richiesta2[indice];
									}
								}
							
							}else{
								
								sIdRicDaPrel=array_iden[indice];
							}

						}
					}
				}
			}
		}
	}

	if(arIdRichiesta.length==0){
		alert('Nessun esame prelevabile in data odierna');
		return;
	}

	//if(sIdRicDaStamp!=''){alert('Attenzione, le seguenti richieste necessitano di ristampa etichette: '+sIdRicDaStamp);}
	
	if(sIdRicDaStamp!=''){
		msg+='\n Sono presenti richieste che necessitano di ristampa etichette!';
	}
	
	if(sIdRicDaPrel != ''){
		msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio!';
	}
	
	if(msg != 'Attenzione!'){
		alert(msg);
	}
	
	if(sIdRicDaStamp!=''){alert('Attenzione, le seguenti richieste necessitano di ristampa etichette: '+sIdRicDaStamp);}

	param = "SP_LABO_PRELIEVO@"+sIdRichieste+","+baseUser.IDEN_PER+"@TRUE@string";
	//alert('param='+param);
	dwr.engine.setAsync(false);
	//CJsUpdate.insert_update(param, cbk_richiestaLaboratorioPrelevata);
	CJsUpdate.call_stored_procedure(param,cbk_richiestaLaboratorioPrelevata);
	dwr.engine.setAsync(true);
}


//funzione che preleva solo quelle selezionate
function prelevaSelezionate(){
	
	if (vettore_indici_sel == ''){

		alert('Attenzione! Nessuna riga selezionata');
		return;
	}
	
	try{
		if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadOnly(document)==true){
			return alert('Funzionalità non disponibile');
		}
	}catch(e){}	

	var sIdRichieste='';
	var sIdRicDaStamp='';
	var sIdRicDaPrel='';
	var sIdRicDH='';
	var msg = 'Attenzione!';
	
	for (var i=0;i<vettore_indici_sel.length;i++){

		var indice = vettore_indici_sel[i];

		statoRichiesta  = array_stato[indice];
		tipoRichiesta   = array_tipologia_richiesta[indice];
		dataRichiesta   = array_data_richiesta[indice];
		idRichiesta2	= array_id_richiesta2[indice];
		tipo_ricovero_codice = array_tipo_ricovero_codice[indice];
		
		
		
		/* DEBUG
		alert('statoRichiesta : '+statoRichiesta);
		alert('tipoRichiesta : '+tipoRichiesta);
		alert('dataRichiesta : '+dataRichiesta);
		alert('controllo_data(dataRichiesta).equal : '+controllo_data(dataRichiesta).equal);
		*/
		if(controllo_data(dataRichiesta).equal){

			//alert(controllo_data(dataRichiesta).equal);

			if(statoRichiesta=='I'){

				if(tipoRichiesta=='0' || tipoRichiesta=='3'){

					if(array_prelievo_effettuato[indice]=='N'){
						
						if (idRichiesta2!=''){
							
							//caso di SAVONA, il controllo sul PRE-DH viene effettuato
							if (top.baseReparti.getValue('','SITO')=='ASL2'){
								
								//controllo se è un PRE-DH, nel caso lo fosse nn lo prelevo
								if(tipo_ricovero_codice != 'PRE-DH'){
									
									if (sIdRichieste==""){
										sIdRichieste=array_iden[indice];
									}
									else{
										sIdRichieste += "*"+array_iden[indice];
									}
									
								}else{
									
									sIdRicDH=array_iden[indice];
								}
							
							//caso di SPEZIA, il controllo sul PRE-DH  NON  viene effettuato
							}else if (top.baseReparti.getValue('','SITO')=='ASL5'){
								
								if (sIdRichieste==""){
									sIdRichieste=array_iden[indice];
								}
								else{
									sIdRichieste += "*"+array_iden[indice];
								}
							}
							
							//controllo che l'etichetta non sia da ristampare in seguito alla modifica dal laboratorio
							if(array_stato_etic[indice]=='2'){
								if (sIdRicDaStamp==""){
									sIdRicDaStamp=array_id_richiesta2[indice];
								}
								else{
									sIdRicDaStamp += ","+array_id_richiesta2[indice];
								}
							}
						
						}else{
							
							sIdRicDaPrel=array_iden[indice];
						}
					}
				}
			}
		}
	}

	if(sIdRichieste==''){alert('Nessun esame prelevabile tra i selezionati');return;}
	
	//if(sIdRicDaStamp!=''){alert('Attenzione, le seguenti richieste necessitano di ristampa etichette: '+sIdRicDaStamp);}
	
	if(sIdRicDaStamp!=''){
		msg+='\n Sono presenti richieste che necessitano di ristampa etichette! Le richieste hanno identificativo: '+sIdRicDaStamp;
	}
	
	if(sIdRicDaPrel != ''){
		msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio!';
	}
	
	if(sIdRicDH != ''){
		msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio poichè sono richieste relative ad un PRE-DH';
	}
	
	if(msg != 'Attenzione!'){
		alert(msg);
	}
	
	param = "SP_LABO_PRELIEVO@"+sIdRichieste+","+baseUser.IDEN_PER+"@TRUE@string";
	//alert('param='+param);
	dwr.engine.setAsync(false);
	CJsUpdate.call_stored_procedure(param,cbk_richiestaLaboratorioPrelevata);
	dwr.engine.setAsync(true);

}



//funzione che stampa solo quelle selezionate
function stampaSelezionate(){

	if (vettore_indici_sel == ''){
		alert('Attenzione! Nessuna riga selezionata');
		return;
	}

	for (var i=0;i<vettore_indici_sel.length;i++){

		var indice = vettore_indici_sel[i];
		stampaEtichettaVitro(indice);
	
	}
}



/*
 * Non cancellare, valori che assume bytstatorichieste per monitorare lo stato delle richieste di laboratorio
 * 30-35 cancellata
 * 40 in errore
 * 45 appena scritta sulle dfrichieste ma non ancora elaborata
 * 50 processata correttaemnte e ritornata
 * 60 è stato dato il prelevato ma non ancora comunicato al laboratorio
 * 65 prelevato comunicato al laboratorio
 *
 */


function stampaEtichettaVitro(indice){

	
	if (typeof indice == 'undefined'){
		if(vettore_indici_sel.length > 1){
			alert('Attenzione! Selezionare una sola riga');
			return;
		}
	}
	/*DEFINISCE IL TIPO DI WORKLIST NEL QUALE MI TROVO*/
	var tipoWkUrl=getUrlParameter('Htipowk');
	var tipoRichiesta;		// tipo della richiesta
	var idEtichetta;		// SP:dfelco.idrichiestalab = stridrichiesta = testata_richieste.id_richiesta2; SV:dnlab.tbldbfrichieste.stridrichiesta = testata_richieste.id_richiesta2
	var statoRichiesta;		// stato della richiesta
	var bytStatoRichiesta;	// gestione dell'errore dello stato della richiesta
	var dataRichiesta;		// data della richiesta presa da testata_richieste(YYYYMMDD)
	var errIntegrazione;	// array errore integrazione per la gestione dell'errore della medicina nucleare
	var idRichiesta;		// array_iden: iden testata_richieste
	var dataSlash;			// data in formato dd/mm/yyyy

	if (typeof indice != 'undefined'){

		tipoRichiesta		= array_tipologia_richiesta[indice];
		idEtichetta			= array_etichette_laboratorio[indice];
		statoRichiesta 		= array_stato[indice];
		bytStatoRichiesta 	= parseInt(array_bytstatorichiesta[indice]);
		dataRichiesta		= array_data_richiesta[indice];
		errIntegrazione 	= array_errore_integrazione[indice];
		idRichiesta			= array_iden[indice];
		idTestataR			= array_iden[indice];
		dataSlash			= isoToDate(dataRichiesta);

	}else{

		setRiga();

		if (rigaSelezionataDalContextMenu==-1){
			tipoRichiesta		= stringa_codici(array_tipologia_richiesta);
			idEtichetta 		= stringa_codici(array_etichette_laboratorio);
			statoRichiesta 		= stringa_codici(array_stato);
			bytStatoRichiesta 	= parseInt(stringa_codici(array_bytstatorichiesta));
			dataRichiesta		= stringa_codici(array_data_richiesta);
			errIntegrazione 	= stringa_codici(array_errore_integrazione);
			idRichiesta			= stringa_codici(array_iden);
			idTestataR			= stringa_codici(array_iden);
			dataSlash			= isoToDate(dataRichiesta);

		}else{
			indice=rigaSelezionataDalContextMenu;
			tipoRichiesta		= array_tipologia_richiesta[rigaSelezionataDalContextMenu];
			idEtichetta			= array_etichette_laboratorio[rigaSelezionataDalContextMenu];
			statoRichiesta 		= array_stato[rigaSelezionataDalContextMenu];
			bytStatoRichiesta 	= parseInt(array_bytstatorichiesta[rigaSelezionataDalContextMenu]);
			dataRichiesta		= array_data_richiesta[rigaSelezionataDalContextMenu];
			errIntegrazione 	= array_errore_integrazione[rigaSelezionataDalContextMenu];
			idRichiesta			= array_iden[rigaSelezionataDalContextMenu];
			idTestataR			= array_iden[rigaSelezionataDalContextMenu];
			dataSlash			= isoToDate(dataRichiesta);
		}
	}

	//Controllo che non permette di stampare etichette antecedenti alla data attuale
/*	if (controllo_data(dataRichiesta).previous){

		alert("Impossibile stampare l'etichetta: la richiesta è prevista per una data antecedente alla data odierna");
		return;
	}*/

	//controllo la tipologia della richiesta
	if (tipoRichiesta!='3' && tipoRichiesta!='0' && tipoRichiesta!='6' && tipoRichiesta!='7' && tipoRichiesta!='8'){

		alert('Tipologia di richiesta non adeguata');
		return;
	}
/*
 * ETICHETTE DI MEDICINA NUCLEARE
 * */

	if (tipoRichiesta=='3' && statoRichiesta =='I')
	{//etichetta per il mednuc ria non ha ancora l'etichetta, solo quando viene processata dalla procedura viene messa in stato P
		if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
		{
			if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
			{
				top.apriWorkListRichieste();
				return;
			}
			else
			{
				parent.applica_filtro_richieste();
				return;
			}
		}
		else
		{
			return;
		}

	}else if (tipoRichiesta=='3' && statoRichiesta !='I'){

		if (errIntegrazione!='')
		{// etichetta in errore
			alert("Etichetta in errore");
			return;
		}
		else
		{
			// alert di conferma per la stampa singola dell'etichetta
			if(!confirm("Proseguendo verrà stampata l'etichetta"))
			{
				return;
			}
			
			printEtiVitro(idRichiesta,tipoRichiesta,indice,idTestataR);
			return;
		}
	}

	/*
	 * 	ETICHETTE DI EMOTRASFUSIONALE     		
	 * 	alert('- TIPO RICHIESTA: ' + tipoRichiesta +'\n-bytStatoRichiesta: ' + bytStatoRichiesta + '-\nidEtichetta: '+ idEtichetta + '\n-idRichiesta: ' + idRichiesta );
	 */
	if ((tipoRichiesta=='6' || tipoRichiesta=='7' || tipoRichiesta=='8') && (statoRichiesta=='I' || statoRichiesta=='L')){
		// RICHIESTA IN ERRORE O ANNULLATA
		if (bytStatoRichiesta == 10 || bytStatoRichiesta == 40){
			if(bytStatoRichiesta == 10){
				alert('Impossibile stampare le etichette di una richiesta Annullata');
			}else{
				alert('Impossibile stampare le etichette di una richiesta in Errore');
			}
			return;
		}
		else{ // STAMPO L'ETICHETTA
			if(!confirm("Proseguendo verrà stampata l'etichetta")){
				return;
			}
			printEtiVitro(idRichiesta,tipoRichiesta,indice,idTestataR);
			return;
		}
	}

	/*
	* ETICHETTE DI LABORATORIO
	* gestione del trasferito -> Spezia
	*/
	if (tipoRichiesta=='0' && (statoRichiesta=='I' || statoRichiesta=='L'))
	{
		if (idEtichetta=='')
		{
			if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
			{

				if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
				{
					top.apriWorkListRichieste();
					return;
				}
				else
				{
					parent.applica_filtro_richieste();
					return;
				}
			}
		}
		else
		{
			if (bytStatoRichiesta <= 45)
			{
				if (bytStatoRichiesta == 40)
				{//Etichetta in errore
					alert('Etichetta in errore');
					return;
				}
				else
				{//Etichetta non disponibile, ricarica la pagina in automatico
					if (top.baseReparti.getValue('','SITO')=='ASL5')
					{
						if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
						{
							if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
							{

								top.apriWorkListRichieste();
								return;
							}
							else
							{
								parent.applica_filtro_richieste();
								return;
							}
						}
						else
						{
							return;
						}
					}
					else
					{
						if (idEtichetta == '')
						{
							if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
							{
								if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
								{
									top.apriWorkListRichieste();
									return;
								}
								else
								{
									parent.applica_filtro_richieste();
									return;
								}
							}
						}
						else
						{
							if(!confirm("Proseguendo verrà stampata l'etichetta"))
							{
								return;
							}
							printEtiVitro(idEtichetta,tipoRichiesta,indice,idTestataR);
						}
					}
				}
			}
			else
			{
				if(!confirm("Proseguendo verrà stampata l'etichetta"))
				{
					return;
				}
					if (top.baseReparti.getValue('','SITO')=='ASL5'){
						printEtiVitro(idRichiesta,tipoRichiesta,indice,idTestataR);
					}
					else
					{
						printEtiVitro(idEtichetta,tipoRichiesta,indice,idTestataR);
					}
			}
		}
	}
	else
	{
		alert('Attenzione, la richiesta del '+dataSlash+' deve essere nello stato inviato o trasferito');
		return;
	}

}

function stampaEtichettaVitroTutte(){	//Non stampa le etichette di Trasfusionale perchè hanno report diverso

	var arIdRichieste	= new Array();
	var arIdTestataR	= new Array();
	var arTipRic     	= new Array();
	var arIdRichiesteER = new Array();
	var tipoWkUrl		= getUrlParameter('Htipowk');

	for(var i=0;i<array_etichette_laboratorio.length;i++)
	{
		if(array_tipologia_richiesta[i]=='3' || array_tipologia_richiesta[i]=='0')
		{
			if(array_tipologia_richiesta[i]=='3')
			{// GESTIONE RICHIESTE DI MEDICINA NUCLEARE
				if (array_stato[i] =='I')
				{// Chiedo se si vuole ricaricare la pagina per avere tutte le etichette disponibili
					if(confirm("Etichetta momentaneamente non disponibile, ricaricare la worklist esami/consulenze?"))
					{
						if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
						{
							top.apriWorkListRichieste();
							return;
						}
						else
						{
							parent.applica_filtro_richieste();
							return;
						}
					}
					else
					{
						return;
					}
				}
				else
				{
					if (array_errore_integrazione[i]!='')
					{// etichetta MedNuc in errore
						arIdRichiesteER.push(array_iden[i]);
					}
					else
					{//etichetta MedNuc Corretta
						arIdRichieste.push(array_iden[i]);
						arIdTestataR.push(array_iden[i]);
						arTipRic.push(array_tipologia_richiesta[i]);
					}
				}
			}
			else
			{// GESTIONE ETICHETTA DI LABORATORIO TUTTE
				if (array_stato[i] =='I' || array_stato[i] =='L')
				{
					if (array_etichette_laboratorio[i]=='')
					{
						if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
						{
							top.apriWorkListRichieste();
							return;
						}
						else
						{
						parent.applica_filtro_richieste();
						return;
						}
					}
					else
					{

						if (parseInt(array_bytstatorichiesta[i]) <= 45)
						{
							if (parseInt(array_bytstatorichiesta[i]) == 40)
							{//Etichetta in errore
								arIdRichiesteER.push(array_iden[i]);
							}
							else
							{//Etichetta non disponibile, ricarica la pagina in automatico
								if (top.baseReparti.getValue('','SITO')=='ASL5')
								{
									if(confirm("Etichetta momentaneamente non disponibile, ricaricare la worklist esami/consulenze?"))
									{
										if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
										{
											top.apriWorkListRichieste();
											return;
										}
										else
										{
											parent.applica_filtro_richieste();
											return;
										}
									}
									else
									{
										return;
									}
								}else
								{
									if (array_etichette_laboratorio[i] == '')
									{
										if(confirm("Etichetta momentaneamente non disponibile, ricaricare la worklist esami/consulenze?"))
										{
											if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
											{
												top.apriWorkListRichieste();
												return;
											}
											else
											{
											parent.applica_filtro_richieste();
											return;
											}
										}
									}
									else
									{
										arIdRichieste.push(array_etichette_laboratorio[i]);
										arTipRic.push(array_tipologia_richiesta[i]);
										arIdTestataR.push(array_iden[i]);
									}
								}
							}
						}
						else
						{//Etichetta di laboratorio corretta
							if (top.baseReparti.getValue('','SITO')=='ASL5'){
								arIdRichieste.push(array_iden[i]);
							}else
							{
								arIdRichieste.push(array_etichette_laboratorio[i]);
							}
							arTipRic.push(array_tipologia_richiesta[i]);
							arIdTestataR.push(array_iden[i]);
						}
					}
				}
			}
		}
	}
	if(arIdRichieste.length>0)
	{
		printEtiVitro(arIdRichieste,arTipRic,'',arIdTestataR);
	}
}

function printEtiVitro(idRichieste, tipoRichiesta, indice, testataRichieste){
	var sf;
	var funzione	= '';
	
// EMOTRASFUSIONALE -> Spezia
	if(tipoRichiesta == '6' || tipoRichiesta == '7' || tipoRichiesta == '8'){
		funzione 	= "ETICHETTA_VITRO_TRASFUSIO";
		sf= " {VIEW_ETI_TRASFUSIO.ID_WHALE}  in  ['WHALE" + idRichieste + "','" + idRichieste + "FUN']";
	}
	else if ((tipoRichiesta == '3' || tipoRichiesta=='0') && (baseUser.LOGIN=='elena' || baseUser.LOGIN=='arry' || baseUser.LOGIN=='lino' ))
	{	
		alert(' Alert Solo per Admin: ' + '\n - IDIRCHIESTE: ' + idRichieste + '\n - TIPO RICHIESTA: ' + tipoRichiesta + '\n - TESTATA RICHIESTE:' + testataRichieste);
		funzione = 'ETICHETTA_VITRO_TEST';
		sf= " {TMP_VIEW_STAMPA_ETI_WHALE.IDENTIFICATIVO_ESTERNO}  in  [" + testataRichieste + "]";
	}
	else
	{
		funzione = 'ETICHETTA_VITRO';
		if (top.baseReparti.getValue('','SITO')=='ASL2')
		{
//SAVONA
			sf= " {VIEW_STAMPA_ETI_LAB_WHALE.SEQRICHIESTA}  in  [" + idRichieste + "]";//testata_richieste_idRichiesta2
		}
		else if (top.baseReparti.getValue('','SITO')=='ASL5')
		{
//SPEZIA, la selection formula è su identificativo_esterno per mantenere lo stesso report e la stessa selection formula per gestire sia la medicina nucleare ria che il
// laboratorio. VIEW_STAMPA_ETI_LAB_WHALE.IDENTIFICATIVO_ESTERNO=TESTATE_RICHIESTA.IDEN			
			sf= " {VIEW_STAMPA_ETI_LAB_WHALE.IDENTIFICATIVO_ESTERNO}  in  [" + idRichieste + "]";
		}
	}
	if(basePC.PRINTERNAME_ETI_CLIENT=='')
		anteprima='S';
	else{
		anteprima='N';
	}
	//alert('-SF: ' + sf + '\n-FUNZIONE: ' + funzione);
	top.stampa(funzione,sf,anteprima,basePC.DIRECTORY_REPORT,basePC.PRINTERNAME_ETI_CLIENT);
	
	var sIdTestate='';

	//se viene passato un array
	if (typeof testataRichieste == 'object'){
		for(var i=0;i<testataRichieste.length;i++){
			//salvo la stampa solo se è una richiesta di laboratorio/microbiologia	
			if (tipoRichiesta[i]=='0'){
				if (sIdTestate==''){
					sIdTestate=testataRichieste[i];
				}
				else{
					sIdTestate += '*'+testataRichieste[i];
				}	
			}
		}
	}
	else
	{
		if(tipoRichiesta=='0')
			sIdTestate=testataRichieste;
		else
			sIdTestate='';
	}
	if(sIdTestate!=''){
		param = "SP_LABO_STAMPA_ETICHETTE@"+sIdTestate+"@TRUE@string";
		dwr.engine.setAsync(false);
		CJsUpdate.call_stored_procedure(param,cbk_stampaEtichette);
		dwr.engine.setAsync(true);
	}

	function cbk_stampaEtichette(resp)
	{
		//se non viene passato l'indice della riga vuole dire che è stato cliccato stampa tutte
		if (indice == ''){
			for(var i=0;i<array_stato_etic.length;i++){
				array_stato_etic[i]='1';
			}
		}
		else{
			array_stato_etic[indice]='1';
		}
	}

}



/*SAVONA OLD
 * function stampaEtichettaVitroTutte(){

	var arIdRichieste	= new Array();
	var tipoWkUrl		= getUrlParameter('Htipowk');

	for(var i=0;i<array_etichette_laboratorio.length;i++){

		if(array_tipologia_richiesta[i]=='3' || array_tipologia_richiesta[i]=='0')
		{
			if(array_etichette_laboratorio[i]!='' && array_stato[i]=='I')
			{
				arIdRichieste.push(array_etichette_laboratorio[i]);
			}else
			{
				if (array_errore_integrazione[i]=='')
				{
					if(confirm("Dati non ancora disponibili, ricaricare la worklist esami/consulenze?"))
					{
						if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE')
						{
							top.apriWorkListRichieste();return;
						}else
						{
							parent.applica_filtro_richieste();return;
						}
					}
					else
					{
						if (idRichiesta2=='')
						{
							alert('Etichetta in errore');
							return;
						}
					}
				}
			}
		}
	}

	if(arIdRichieste.length>0){
		printEtiVitro(arIdRichieste);
	}
}
SPEZIA OLD
	for(var i=0;i<array_seq_richiesta.length;i++)
		{
		if(array_tipologia_richiesta[i]=='3' || array_tipologia_richiesta[i]=='0')
			{
			if(array_etichette_laboratorio[i]!='')
				{ //in errore
					if (array_seq_richiesta[i]!='')
						{
							arIdRichieste.push(array_seq_richiesta[i]);
						}
				}
			}
		}
*/

function stampaRiepilogo(){

	setRiga();
	var sf;
	var funzione;
	var reparto;
	var anteprima;
	var keyLegame       = array_key_legame[rigaSelezionataDalContextMenu];
	var versione        = array_versione[rigaSelezionataDalContextMenu];
	var idRichiesta     = array_iden[rigaSelezionataDalContextMenu];
	var cdcDestinatario = array_cdc[rigaSelezionataDalContextMenu];
	var tipoRichiesta	= array_tipologia_richiesta[rigaSelezionataDalContextMenu];

	if(basePC.PRINTERNAME_REF_CLIENT=='')
		anteprima='S';
	else{
		anteprima='N';
	}

	if (array_prenotazione_diretta[rigaSelezionataDalContextMenu]=='S'){
		// stampa foglio prenotazione
		funzione = "PRENOTAZIONE_POLARIS_WHALE.RPT";
		sf= "{COD_EST_ESAMI.COD9}='"+idRichiesta+"' and {COD_EST_ESAMI.ARRIVATODA}='WHALE'";
		reparto = cdcDestinatario;
		var polaris_connection=baseGlobal.URL_PRENOTAZIONE;
		top.stampaPrenotazioneDirettaSuPolaris(polaris_connection,funzione,sf,anteprima,reparto,null);
		//alert('-funzione: ' + funzione + '\n-reparto: ' + cdcDestinatario + '\n sf: ' + sf);
	}else{
		if (array_tipologia_richiesta[rigaSelezionataDalContextMenu]=='5'){
			
			//stampa foglio richiesta di consulenza
			sf= "&prompt<pIdenTR>="+array_iden[rigaSelezionataDalContextMenu];
			funzione = 'CONSULENZE_REFERTAZIONE';
			var tipoWkUrl=getUrlParameter('Htipowk');
			var reparto  = '';

			if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE'){
				/* Da dentro la cartella dal paziente */
				reparto  = top.getForm(document).reparto;
				top.confStampaReparto(funzione,sf,anteprima,reparto,null);
			}else{
				reparto  = array_cdc[rigaSelezionataDalContextMenu];
				top.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
			}

		}else if(tipoRichiesta == '6' || tipoRichiesta == '7' || tipoRichiesta == '8'){
			
			//SPEZIA EMOTRASFUSIONALE			
			sf			= '{TESTATA_RICHIESTE.IDEN}='+idRichiesta;
			var funzione 		= 'RICHIESTA_EMOTRASFUSIONALE';
			var reparto 		= 'TRASFUSIO';
			var anteprima 	= 'S';			

			if(baseUser.LOGIN == 'usrradiologi' || baseUser.LOGIN == 'testrxb' || baseUser.LOGIN == 'testelco2'){			
				alert('TRASFUSIO RICHIESTA: \n - funzione: ' + funzione + '\n - reparto: ' + reparto + '\n - sf: ' + sf +'\n - anteprima: ' + anteprima);
			}
			top.stampa(funzione,sf,anteprima,reparto,null);

		}else{	//stampa foglio richiesta radiologica, Laboratorio
			
			if (top.baseReparti.getValue('','SITO')=='ASL2'){
				//SAVONA
				sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
				funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
				reparto = cdcDestinatario;
				
			}else if (top.baseReparti.getValue('','SITO')=='ASL5'){
				//SPEZIA sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
				sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
				funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
				reparto = cdcDestinatario;
			}
				//alert('-funzione: ' + funzione + '\n-reparto: ' + cdcDestinatario + '\n sf: ' + sf);
				top.stampa(funzione,sf,anteprima,reparto,null);
			
		}
	}
}

function stampaRiepilogoEmocomponenti(){
	setRiga();
	var sf;
	var funzione;
	var reparto;
	var anteprima;

	var idRichiesta     = array_iden[rigaSelezionataDalContextMenu];
	var tipoRichiesta	= array_tipologia_richiesta[rigaSelezionataDalContextMenu];

	sf 		= '&prompt<idenTestata>=' + idRichiesta;
	funzione 	= 'RITIRO_PRODOTTI_TRASFUSIO';
	reparto 	= 'TRASFUSIO';
	anteprima 	= 'S';

	if(tipoRichiesta == '7'){				
			
		var dataTSString 	= array_id_richiesta2[rigaSelezionataDalContextMenu];
		var stampaTS		= checkTS(dataTSString);

		if(!stampaTS)
		return;							
	}
	if(baseUser.LOGIN == 'usrradiologi' || baseUser.LOGIN == 'testrxb' || baseUser.LOGIN == 'testelco2'){			
		alert('TRASFUSIO RICHIESTA: \n - funzione: ' + funzione + '\n - reparto: ' + reparto + '\n - sf: ' + sf +'\n - anteprima: ' + anteprima);
	}
	top.stampa(funzione,sf,anteprima,reparto,null);

	function checkTS(dataTS){

		if(dataTS == null || dataTS == ''){
			alert('Per questa Richiesta non è ancora stato prodotto il Documento di T&S');
			return false;
		}

		var today 			= new Date();
		var dataTSDate		= new Date(dataTS.substring(0,4),(parseInt(dataTS.substring(4,6))-1),dataTS.substring(6,8),dataTS.substring(8,10),dataTS.substring(10,12));
	
		var DataTSString		= dataTS.substring(6,8)+'-'+dataTS.substring(4,6)+'-'+dataTS.substring(0,4)+' alle ore '+dataTS.substring(8,10)+':'+dataTS.substring(10,12);

		if(dataTS == null || dataTS == ''){
			alert('Per questa Richiesta non è ancora stato prodotto il Documento di T&S');
			return false;
		}else if(today > dataTSDate){
			alert('Il Type & Screen per questa richiesta risulta essere gia scaduto in data ' + DataTSString);
			return false;
		}else{					
			return true;
		}			
	}	
}

function stampaRiepilogoOld(){

	var sf;
	var funzione;
	var reparto;
	var anteprima;

	if(basePC.PRINTERNAME_REF_CLIENT=='')
		anteprima='S';
	else{
		anteprima='N';
	}

	setRiga();

	if (array_prenotazione_diretta[rigaSelezionataDalContextMenu]=='S')
	{// stampa foglio prenotazione
		var idRichiesta     = array_iden[rigaSelezionataDalContextMenu];
		var cdcDestinatario = array_cdc[rigaSelezionataDalContextMenu];
		funzione = "PRENOTAZIONE_POLARIS_WHALE.RPT";
		sf= "{COD_EST_ESAMI.COD9}='"+idRichiesta+"' and {COD_EST_ESAMI.ARRIVATODA}='WHALE'";
		reparto = cdcDestinatario;
		var polaris_connection=baseGlobal.URL_PRENOTAZIONE;
		top.stampaPrenotazioneDirettaSuPolaris(polaris_connection,funzione,sf,anteprima,reparto,null);

	}
	else
	{
		if (array_tipologia_richiesta[rigaSelezionataDalContextMenu]=='5')
		{//stampa foglio richiesta di consulenza
			sf= "&prompt<pIdenTR>="+array_iden[rigaSelezionataDalContextMenu];
			funzione = 'CONSULENZE_REFERTAZIONE';
			var tipoWkUrl=getUrlParameter('Htipowk');
			var reparto  = '';
			if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE')
			{
				/* Da dentro la cartella dal paziente */
				reparto  = top.getForm(document).reparto;
				top.confStampaReparto(funzione,sf,anteprima,reparto,null);
			}
			else
			{
				reparto  = array_cdc[rigaSelezionataDalContextMenu];
				top.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
			}
		}
		else
		{//stampa foglio richiesta radiologica
			var keyLegame       = array_key_legame[rigaSelezionataDalContextMenu];
			var versione        = array_versione[rigaSelezionataDalContextMenu];
			var idRichiesta     = array_iden[rigaSelezionataDalContextMenu];
			var cdcDestinatario = array_cdc[rigaSelezionataDalContextMenu];
			if (top.baseReparti.getValue('','SITO')=='ASL2')
			//SAVONA
				sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
			//SPEZIA sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
			else if (top.baseReparti.getValue('','SITO')=='ASL5')
				sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
			funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
			reparto = cdcDestinatario;
			top.stampa(funzione,sf,anteprima,reparto,null);
		}
	}
}


function visualizza_referto_non_firmato(){

	var iden_richiesta = stringa_codici(array_iden);
	var reparto = stringa_codici(array_reparto_sorgente);
	if(iden_richiesta == '')
	{
		alert('Attenzione: effettuare una selezione');
		return;
	}
	else
	{
		var sf= " {VIEW_CC_RISULTATI_LAB_TEMP_2.IDEN_TESTATA}  in  [" + iden_richiesta + "]";
		//var sf= " {VIEW_CC_RISULTATI_LAB_TEMP.IDEN_TESTATA}=" + iden_richiesta + "";
		top.confStampaReparto('REFERTI_LABO_NO_FIRMATI',sf,'S',reparto,null);
	}
}


//funzione che apre la scheda richiesta in modifica dalla wk di riepilogo delle richieste
function modificaRichiestaGenerica(){
	//alert('modificaRichiestaGenerica:'+stringa_codici(array_iden));
	var vIdenRichiesta= stringa_codici(array_iden);

	if(vIdenRichiesta == ''){

		alert('Attenzione: effettuare una selezione');
		return;

	}else{

		try{
		      if(vIdenRichiesta.indexOf('*') != '-1'){
				alert('Attenzione: selezionare una sola prenotazione/richiesta');
				return;
			}
		}catch(e){}
	}

	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)== true){
		return alert('Funzionalità non disponibile');
	}

	var stato_richiesta=stringa_codici(array_stato);
	var prelievo_effettuato=stringa_codici(array_prelievo_effettuato);
	var prenotazione_diretta=stringa_codici(array_prenotazione_diretta);
	var tipologia_richiesta=stringa_codici(array_tipologia_richiesta);
	var iden_esame=stringa_codici(array_iden_esame);

	//caso PRENOTAZIONE
	if (prenotazione_diretta == 'S'){

		if(iden_esame != '' && iden_esame != '-1'){

			//GESTIONE PRENOTAZIONE
			try{
	    		if(iden_richiesta.indexOf('*') != '-1'){
	    			alert('Attenzione: selezionare una sola prenotazione/richiesta');
	    			return;
	    		}
		    }catch(e){}
		}


		alert('La prenotazione verrà aperta in modalità di visualizzazione');
		//window.open("servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&funzione=apriPrenotazione("+iden_esame+");&iden_anag="+stringa_codici(array_iden_anag),'WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");
		apriCartella(stringa_codici(array_iden_anag),"apriPrenotazione("+iden_esame+");");
	//caso RICHIESTA
	}else{

		//CONTROLLO CHE ESCLUDE LA MODIFICA PER TUTTI I DESTINATARI TRANNE LABO (tipologia_richiesta 0.6.7.8) E MNU RIA... se il destinatario è diverso apre la scheda o la prenotazione in sola lettura...
		switch (tipologia_richiesta){

		//LABORATORIO E MEDNUC RIA E TRASFUSIONALE
		case '0':
		case '3':
		case '6':
		case '7':
		case '8':
			if (stato_richiesta == 'I' && prelievo_effettuato != 'S'){

				apriVisModScheda('MOD');

			}else{

				if(confirm('Attenzione! La richiesta non può più essere modificata.\nVerrà aperta in modalità di visualizzazione. Continuare?')){
					apriVisModScheda('VIS');
				}
			}
			break;

		//RADIOLOGIA E MEDNUC VIVO
		case '1':
		case '2':
			if (stato_richiesta == 'I' ){

				apriVisModScheda('MOD');

			}else{

				if(confirm('Attenzione! La richiesta non può più essere modificata.\nVerrà aperta in modalità di visualizzazione. Continuare?')){
					apriVisModScheda('VIS');
				}

			}
			break;

		//DEFAULT
		default:
			if(confirm('Attenzione! La richiesta non può più essere modificata.\nVerrà aperta in modalità di visualizzazione. Continuare?')){
				apriVisModScheda('VIS');
			}
			break;
		}
	}
}


/* Lino - stampa worklist esami e consulenze*/
function stampa_worklist(tipoRicerca){

	var arIdRichiesteGeneriche	= new Array();
	var arIdConsulenze			= new Array();
	var iden_per 				= baseUser.IDEN_PER;
	var sf						= '';
	var reparto 				= '';
	var reparti 				= parent.document.getElementById("hRepartiElenco").value;
	reparti=reparti.replace(/\'/g,"");
	for (var i=0;i<array_iden.length;i++)
	{
		if (array_tipologia_richiesta[i]=='5')
		{
			arIdConsulenze.push(array_iden[i]);
		}
		else
		{
			arIdRichiesteGeneriche.push(array_iden[i]);
		}
	}
	if (tipoRicerca=='C')
	{
		if (arIdConsulenze.length<1)
			{
			alert('Attenzione, non ci sono consulenze nella worklist');
			return;
			}
		else
			{
				sf= "{VIEW_RICHIESTE_WK_REPORT.IDEN} in [" + arIdConsulenze + "]";// and {VIEW_RICHIESTE_WK_REPORT.IDEN_PER}="+iden_per;//+"&prompt<pRep>="+reparti;
				top.confStampaReparto('WK_CONSULENZE_GENERICHE',sf,'S',reparto,null);
			}
	}
	else
	{
		if (arIdRichiesteGeneriche.length<1)
		{
			alert('Attenzione, non ci sono richieste nella worklist');
			return;
		}
		else
		{
//			sf= "{VIEW_RICHIESTE_WK_REPORT.IDEN} in [" + arIdRichiesteGeneriche + "] and {VIEW_RICHIESTE_WK_REPORT.IDEN_PER}="+iden_per+"&prompt<pRep>="+reparti;
			sf= "{VIEW_RICHIESTE_WK_REPORT.IDEN} in [" + arIdRichiesteGeneriche + "]";

			top.confStampaReparto('WK_RICHIESTE_GENERICHE',sf,'S',reparto,null);
		}
	}
}


function getUrlParameter(name){

	var tmpURL = document.location.href;
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( tmpURL );
	if( results == null )
		return "";
	else
		return results[1];
}





function apriDatiLaboratorio(){

	if(vettore_indici_sel.length > 1){

		alert('Attenzione! Selezionare una sola riga');
		return;
	}

	setRiga();

	//window.open("servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&funzione=apriDatiLaboratorio("+strParametri+");&iden_anag="+array_iden_anag[rigaSelezionataDalContextMenu],'',"status=yes fullscreen=yes scrollbars=yes");
	if(top.name == 'schedaRicovero'){
		top.apriDatiLaboratorio({idenRichiesta:array_iden[rigaSelezionataDalContextMenu],reparto:array_reparto_sorgente[rigaSelezionataDalContextMenu]});
	}else{
		var strParametri="{";
		strParametri+="idenRichiesta:\'"		+array_iden[rigaSelezionataDalContextMenu]+"\',";
		strParametri+="reparto:\'"			+array_reparto_sorgente[rigaSelezionataDalContextMenu]+"\'";
		strParametri+="}";
		
		apriCartella(array_iden_anag[rigaSelezionataDalContextMenu],"apriDatiLaboratorio("+strParametri+");");
	}
}


function aggiorna(){
	aggiorna_wk();
}

function apriVisModScheda(pStato, indice){

	try{

		/*if (typeof indice == 'undefined'){

			key_legame			= stringa_codici(array_key_legame);
			versione			= stringa_codici(array_versione);
			iden				= stringa_codici(array_iden_xml);
			iden_richiesta		= stringa_codici(array_iden);
			sorgente			= stringa_codici(array_reparto_sorgente);
			destinatario		= stringa_codici(array_cdc);
			urgenza				= stringa_codici(array_urgenza);
			iden_anag			= stringa_codici(array_iden_anag);
			iden_pro			= stringa_codici(array_iden_pro);
			iden_visita			= stringa_codici(array_iden_visita);
			tipologia			= stringa_codici(array_tipologia_richiesta);

		}else{

			key_legame			= array_key_legame[indice];
			versione			= array_versione[indice];
			iden				= array_iden_xml[indice];
			iden_richiesta		= array_iden[indice];
			sorgente			= array_reparto_sorgente[indice];
			destinatario		= array_cdc[indice];
			urgenza				= array_urgenza[indice];
			iden_anag			= array_iden_anag[indice];
			iden_pro			= array_iden_pro[indice];
			iden_visita			= array_iden_visita[indice];
			tipologia			= array_tipologia_richiesta[indice];
		}*/


		/*var strParametri="{";
		strParametri+="key_legame:\'"		+ key_legame +"\',";
		strParametri+="versione:\'"			+ versione +"\',";
		strParametri+="iden:\'"				+ iden +"\',";
		strParametri+="iden_richiesta:\'"	+ iden_richiesta +"\',";
		strParametri+="sorgente:\'"			+ sorgente +"\',";
		strParametri+="destinatario:\'"		+ destinatario +"\',";
		strParametri+="urgenza:\'"			+ urgenza +"\',";
		strParametri+="iden_anag:\'"		+ iden_anag +"\',";
		strParametri+="iden_pro:\'"			+ iden_pro +"\',";
		strParametri+="iden_visita:\'"		+ iden_visita +"\',";
		strParametri+="tipologia:\'"		+ tipologia +"\',";

		strParametri+="lettura:\'"+(pStato=='VIS'?'S':'N')+"\',";
		strParametri+="modifica:\'"+(pStato=='MOD'?'S':'N')+"\'";

		strParametri+="}";*/

		iden_anag = (typeof indice == 'undefined' ? stringa_codici(array_iden_anag) : array_iden_anag[indice]);
		iden_richiesta = (typeof indice == 'undefined' ? stringa_codici(array_iden) : array_iden[indice]);
		
		//top.utilMostraBoxAttesa(true);
		//alert('iden_anag:'+iden_anag);
		//alert('iden_richiesta:'+iden_richiesta);
		if(top.name=='schedaRicovero'){
			//eval('top.apriRichiesta('+strParametri+')');
			top.apriRichiesta(iden_richiesta,(pStato=='MOD'?'S':'N'));
			
		}else{
//			window.open("servletGeneric?class=cartellaclinica.cartellaPaziente.cartellaPaziente&funzione=apriRichiesta("+strParametri+");&iden_anag="+stringa_codici(array_iden_anag),'WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");			
			apriCartella(iden_anag,"apriRichiesta("+iden_richiesta+",'"+(pStato=='MOD'?'S':'N')+"');");
		}
	}catch(e){
		alert(e.description);
	}
}

function apriCartella(pIdenAnag,pFunzione){
	

	top.NS_CARTELLA_PAZIENTE.apri({		
		iden_anag:pIdenAnag,
		funzione:pFunzione
	});	
	
}


function getMessageTS(){
	setRiga();
	
	var day;
	var month;
	var year;
	var hours;
	var minutes;
	var msg	= '';	
	
	idRichiesta2	= array_id_richiesta2[rigaSelezionataDalContextMenu];
	
	// Estrapolo la data del TS dall'ID_RICHIESTA_2
	year		= idRichiesta2.substring(0,4);
	month		= idRichiesta2.substring(4,6);
	day		= idRichiesta2.substring(6,8);
	hours		= idRichiesta2.substring(8,10);
	minutes	= idRichiesta2.substring(10,12);
	msg		= 'La Scadenza del TS per questa richiesta e\' prevista per il giorno ' + day + '/' + month + '/' + year + ' alle ore '+ hours+':'+minutes;
	alert(msg);
}