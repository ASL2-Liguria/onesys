try { parent.removeVeloNero('oIFWk'); } catch (e) {}
try { parent.removeVeloNero('idWkRichieste'); } catch (e) {}


var OE_WK_RICHIESTE = {
	getTipoWk:function(){
		if(top.name == 'schedaRicovero'){
			return top.baseReparti.getValue(top.getForm(document).reparto,'OE_WK_RICHIESTE_PAZIENTE_TIPO_WK');
		}else{
			return top.baseReparti.getValue(top.baseReparti.getValue('','SITO'),'OE_WK_RICHIESTE_TIPO_WK');
		}
	}
};

//funzione che richiama l'aggiornamento della wk delle richieste
function aggiorna(){
	aggiorna_wk();
}

//funzione che ricarica la worklist delle richieste
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
		
		/*if(top.name == 'schedaRicovero'){
			doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE';
		}else{
			doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE';
		}*/
		doc.Htipowk.value = OE_WK_RICHIESTE.getTipoWk();

	}catch(e){
		alert(e.description);
	}

	doc.submit();
}

//funzione che apre la pagina per l'annullamento delle richieste
function annullamentoRichiestaGenerica(){

	//controllo se in sola lettura
	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)==true){
		alert('Funzionalità non disponibile');
		return;
	}

	var bloccoAnnullamento = false;

	var iden_richiesta = stringa_codici(array_iden);
	var stato_richiesta = stringa_codici(array_stato);
	var prenotazione_diretta = stringa_codici(array_prenotazione_diretta);
	var prelievo = stringa_codici(array_prelievo_effettuato);
	var tipologia_richiesta = stringa_codici(array_tipologia_richiesta);

	if(iden_richiesta == '' || (iden_richiesta.length > 1 && iden_richiesta.indexOf('*') != -1)){
		alert(ritornaJsMsg("selezionare"));
		return;
	}

	//alert('tipologia_richiesta: '+tipologia_richiesta + '\nprenotazione_diretta: '+prenotazione_diretta+'\nstato_richiesta: '+stato_richiesta);
	//alert('controllo annullamento: '+ (tipologia_richiesta != '3' && prenotazione_diretta == 'N' && stato_richiesta != 'I'));

	if(tipologia_richiesta == '3'){
		if(stato_richiesta != 'P' && stato_richiesta != 'I'){
			bloccoAnnullamento = true;
		}else{
			bloccoAnnullamento = false;
		}
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

	if(prelievo=='S'){
		alert('Impossibile annullare una richiesta già prelevata');
		return;
	}

	window.open("annullamentoRichiestaPrenotazione.html", "winAnnullamento", "width=600, height=300, top=150, left=300,resizable=yes");
}


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


function apriCartella(pIdenAnag,pFunzione){
	top.NS_CARTELLA_PAZIENTE.apri({		
		iden_anag:pIdenAnag,
		funzione:pFunzione
	});	
}


function apriDatiLaboratorio(){

	if(vettore_indici_sel.length > 1){
		alert('Attenzione! Selezionare una sola riga');
		return;
	}

	setRiga();

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

function apriDatiTrasfusionale(){

	if(vettore_indici_sel.length > 1){
		alert('Attenzione! Selezionare una sola riga');
		return;
	}

	setRiga();

	if(top.name == 'schedaRicovero'){
		top.apriDatiTrasfusionale({idenRichiesta:array_iden[rigaSelezionataDalContextMenu],reparto:array_reparto_sorgente[rigaSelezionataDalContextMenu]});
	}else{
		var strParametri="{";
		strParametri+="idenRichiesta:\'"		+array_iden[rigaSelezionataDalContextMenu]+"\',";
		strParametri+="reparto:\'"			+array_reparto_sorgente[rigaSelezionataDalContextMenu]+"\'";
		strParametri+="}";
		
		apriCartella(array_iden_anag[rigaSelezionataDalContextMenu],"apriDatiTrasfusionale("+strParametri+");");
	}
}

function apriVisModScheda(pStato, indice){

	try{
		
		iden_anag = (typeof indice == 'undefined' ? stringa_codici(array_iden_anag) : array_iden_anag[indice]);
		iden_richiesta = (typeof indice == 'undefined' ? stringa_codici(array_iden) : array_iden[indice]);
		
		if(top.name=='schedaRicovero'){
			top.apriRichiesta(iden_richiesta,(pStato=='MOD'?'S':'N'));
		}else{			
			apriCartella(iden_anag,"apriRichiesta("+iden_richiesta+",'"+(pStato=='MOD'?'S':'N')+"');");
		}
		
	}catch(e){
		alert(e.description);
	}
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


function cbk_annullamentoRichiestaGenerica(message){
	if(message != '' && message != 'OK'){alert('cbk_annullamentoRichiestaGenerica: ' + message);return;}
	aggiorna_wk();
}

function cbk_richiestaLaboratorioPrelevata(message){

	if(message == null){
		aggiorna_wk();
		return;
	}

	var msg = message.toString().split('@');

	if(message != ''){alert('cbk_annullamentoRichiestaGenerica: ' + message);}

	if(message!= null && message != '' ){

		if (controllaNrRichieste(msg[1]).split('@')[0] == 'OK'){

			var msgConfirm = msg[0] += '\n\n\n\Aprire la richiesta con la diuresi da compilare?';
			var indice = controllaNrRichieste(msg[1]).split('@')[1];
			
			if (confirm(msgConfirm)){
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
		var indice=jQuery.inArray(v_splitIden[0], array_iden.toString().split(','));
		retMsg = 'OK@'+indice;
	}
	return retMsg;
}


//Funzione che effettua il controllo se le richieste selezionate sono INVIATE (TR.stato_richiesta == 'I')
function controllo_stato_richieste(stato_richiesta_necessario, label_alert){
		
	setRiga();
	
	if (rigaSelezionataDalContextMenu==-1){
		var stato = stringa_codici(array_stato);
	}else{
		var stato = array_stato[rigaSelezionataDalContextMenu];
	}
	
	
	var errore = false;
	var stati = stato.split('*');
	
	for(var i = 0; i < stati.length; i++){
		if(stati[i] != stato_richiesta_necessario){
			errore = true;
			alert('Attenzione: la richiesta deve essere nello ' +label_alert);
			i = stati.lenght;
		}
	}
	
	return errore;
}


//alessandroa - funzione relativa alla richiesta di globuli rossi del trasfusionale
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
	day			= idRichiesta2.substring(6,8);
	hours		= idRichiesta2.substring(8,10);
	minutes		= idRichiesta2.substring(10,12);
	msg			= 'La Scadenza del TS per questa richiesta e\' prevista per il giorno ' + day + '/' + month + '/' + year + ' alle ore '+ hours+':'+minutes;
	alert(msg);
}


//funzione che, dato un indice, restituisce i valori corretti, presi dalla wk delle richieste, per richiamare la function per il prelevato
function getParametriRichiesta(pIndex){
	return {
		statoRichiesta:array_stato[pIndex],
		tipoRichiesta:array_tipologia_richiesta[pIndex],
		dataRichiesta:array_data_richiesta[pIndex],
		idRichiesta2:array_id_richiesta2[pIndex],
		idenTestata:array_iden[pIndex],
		tipo_ricovero_codice:array_tipo_ricovero_codice[pIndex],
		prelievoEffettuato:array_prelievo_effettuato[pIndex],
		statoEtic:array_stato_etic[pIndex]
	};
};


//funzione che permette di estrapolare parametri prendendoli direttamente dalla url della pagina
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


//funzione legata al più (+) pulsante sulla wk degli esami/consulenze al di fuori della cartella
//tipo = 'RICHIESTE' , 'PRENOTAZIONI'
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


//funzioni legata alle iconcine R e P  sulla wk del paziente
function insPrenCartella(){
	top.inserisciPrenotazione();
}

function insRichCartella(){
	top.inserisciRichiestaConsulenza();
}


function loadWaitWindow(){

	var doc = document.form_wkl_richieste;

	doc.action = 'worklistRichieste';
	doc.target = '_self';

	//alert(this.name + '\n' + top.name);
	/*if(top.name == 'schedaRicovero')
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE';
	else
		doc.Htipowk.value = 'WK_RICHIESTE_RICOVERATI_GENERICHE';*/

	doc.Htipowk.value = OE_WK_RICHIESTE.getTipoWk();

	doc.submit();
}


//funzione che apre la scheda richiesta in modifica dalla wk di riepilogo delle richieste
function modificaRichiestaGenerica(){
	
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
			
			//CONSULENZE
			case '5':
				if (stato_richiesta == 'I'){
					apriVisModScheda('MOD');
				}else{
					if(confirm('Attenzione! La consulenza non può più essere modificata.\nVerrà aperta in modalità di visualizzazione. Continuare?')){
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


//funzione che raccoglie i dati e li invia alla funzione di prelievo per le richieste
function prelevaRichiesta(tipo){

	var parametri = {
		statoRichiesta:'',
		tipoRichiesta:'',
		dataRichiesta:'',
		idRichiesta2:'',
		idenTestata:'',
		tipo_ricovero_codice:'',
		prelevioEffettuato:'',
		statoEtic:''
	};
	
	var arParametri = new Array();
	var msg = "";
	
	//controllo se la cartella è in sola lettura
	if (typeof top.ModalitaCartella != 'undefined' && top.ModalitaCartella.isReadonly(document)==true){
		alert('Funzionalità non disponibile');
		return;
	}
	
	if(tipo!='SINGOLA'){
		msg = "Proseguendo le richieste saranno indicate come PRELEVATE";
	}else{
		msg = "Proseguendo l'esame sarà indicato come PRELEVATO";
	}
	
	if(!confirm(msg)){
		return;
	}
	
	switch(tipo){
	
		case 'SINGOLA' : 

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
				parametri.prelievoEffettuato	= stringa_codici(array_prelievo_effettuato);
				parametri.statoEtic				= stringa_codici(array_stato_etic);
			
			}else{
				parametri = getParametriRichiesta(rigaSelezionataDalContextMenu);
			}

			arParametri.push(parametri);
			
			//richiamo la funzione per il prelevato
			OE_RICHIESTA.preleva(arParametri, tipo, cbk_richiestaLaboratorioPrelevata);
			
			break;
			
		case 'PRELEVA_SEL' :

			if (vettore_indici_sel == ''){
				alert('Attenzione! Nessuna riga selezionata');
				return;
			}
			
			for (var i=0;i<vettore_indici_sel.length;i++){
				
				//ricavo i parametri
				parametri = getParametriRichiesta(vettore_indici_sel[i]);
				//li metto dentro l'array
				arParametri.push(parametri);	
			}
			
			//richiamo la funzione per il prelevato
			OE_RICHIESTA.preleva(arParametri, tipo , cbk_richiestaLaboratorioPrelevata);

			break;
			
		case 'PRELEVA_ALL' : 
		
			for(var x=0;x<array_stato.length;x++){
				
				//ricavo i parametri
				parametri = getParametriRichiesta(x);
				//li metto dentro l'array
				arParametri.push(parametri);
			
			}
			
			//richiamo la funzione per il prelevato
			OE_RICHIESTA.preleva(arParametri, tipo, cbk_richiestaLaboratorioPrelevata);
			
			break;
	};
}


function printEtiVitro(idenTestataRichieste, tipoRichiesta, indice){

	var sf;
	var funzione	= '';
	
	// EMOTRASFUSIONALE -> Spezia
	if(tipoRichiesta == '6' || tipoRichiesta == '7' || tipoRichiesta == '8'){
		funzione 	= "ETICHETTA_VITRO_TRASFUSIO";
		sf= " {VIEW_ETI_TRASFUSIO.ID_WHALE}  in  ['WHALE" + idenTestataRichieste + "','" + idenTestataRichieste + "FUN']";
	}
	else
	{
		funzione = 'ETICHETTA_VITRO';
		sf= " {RPT_VIEW_ETI_WHALE.IDENTIFICATIVO_ESTERNO}  in  [" + idenTestataRichieste + "]";
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
	if (typeof idenTestataRichieste == 'object'){
		for(var i=0;i<idenTestataRichieste.length;i++){
			//salvo la stampa solo se è una richiesta di laboratorio/microbiologia	
			if (tipoRichiesta[i]=='0'){
				if (sIdTestate==''){
					sIdTestate=idenTestataRichieste[i];
				}
				else{
					sIdTestate += '*'+idenTestataRichieste[i];
				}	
			}
		}
	
	}else{
		if(tipoRichiesta=='0')
			sIdTestate=idenTestataRichieste;
		else
			sIdTestate='';
	}
	
	if(sIdTestate!=''){
		param = "SP_LABO_STAMPA_ETICHETTE@"+sIdTestate+"@TRUE@string";
		dwr.engine.setAsync(false);
		CJsUpdate.call_stored_procedure(param,cbk_stampaEtichette);
		dwr.engine.setAsync(true);
	}

	function cbk_stampaEtichette(resp){
		//se non viene passato l'indice della riga vuole dire che è stato cliccato stampa tutte
		if (indice == ''){
			for(var i=0;i<array_stato_etic.length;i++){
				array_stato_etic[i]='1';
			}
		}else{
			array_stato_etic[indice]='1';
		}
	}
}



function resp(res){

	if (res!='OK')
		alert(res);
}


//function che restituisce l'indice della riga che è stata selezionata tramite il clic su un'icona delle avvertenze
function setRiga(obj){

	if(event.srcElement.nodeName.toUpperCase()!='DIV')return;

	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	return rigaSelezionataDalContextMenu;
}



//Lino - stampa worklist esami e consulenze
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


function stampaConsulenzaDaWkRichieste(statoReferto,idenReferto,idenTestata,repCdc){
	
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
		//if(tipoWkUrl == 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE')
		if(top.name == 'schedaRicovero')
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
	var statoRichiesta;		// stato della richiesta
	var bytStatoRichiesta;	// gestione dell'errore dello stato della richiesta
	var dataRichiesta;		// data della richiesta presa da testata_richieste(YYYYMMDD)
	var errIntegrazione;	// array errore integrazione per la gestione dell'errore della medicina nucleare
	var idenTestataRichieste;		// array_iden: iden testata_richieste
	var dataSlash;			// data in formato dd/mm/yyyy
	var idRichiesta2;		//array_id_richiesta2 = testata_richieste.id_richiesta2
	

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		tipoRichiesta		= stringa_codici(array_tipologia_richiesta);
		statoRichiesta 		= stringa_codici(array_stato);
		bytStatoRichiesta 	= parseInt(stringa_codici(array_bytstatorichiesta));
		dataRichiesta		= stringa_codici(array_data_richiesta);
		errIntegrazione 	= stringa_codici(array_errore_integrazione);
		idenTestataRichieste= stringa_codici(array_iden);
		dataSlash			= isoToDate(dataRichiesta);
		idRichiesta2		= stringa_codici(array_id_richiesta2);	
	}else{
		indice=rigaSelezionataDalContextMenu;
		tipoRichiesta		= array_tipologia_richiesta[rigaSelezionataDalContextMenu];
		statoRichiesta 		= array_stato[rigaSelezionataDalContextMenu];
		bytStatoRichiesta 	= parseInt(array_bytstatorichiesta[rigaSelezionataDalContextMenu]);
		dataRichiesta		= array_data_richiesta[rigaSelezionataDalContextMenu];
		errIntegrazione 	= array_errore_integrazione[rigaSelezionataDalContextMenu];
		idenTestataRichieste= array_iden[rigaSelezionataDalContextMenu];
		dataSlash			= isoToDate(dataRichiesta);
		idRichiesta2		= array_id_richiesta2[rigaSelezionataDalContextMenu];
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
	if (top.baseReparti.getValue('','SITO')=='ASL2'){
		if (tipoRichiesta=='3' && statoRichiesta =='I'){
			if(!confirm("Proseguendo verrà stampata l'etichetta"))
			{
				return;
			}
			
			printEtiVitro(idenTestataRichieste,tipoRichiesta,indice);
			return;
		}
	}else{
		if (tipoRichiesta=='3' && statoRichiesta =='I')
		{//etichetta per il mednuc ria non ha ancora l'etichetta, solo quando viene processata dalla procedura viene messa in stato P
			if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
			{
				//if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
				if(top.name == 'schedaRicovero' || tipoWkUrl == '')
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
				
				printEtiVitro(idenTestataRichieste,tipoRichiesta,indice);
				return;
			}
		}
	}
	/*
	 * 	ETICHETTE DI EMOTRASFUSIONALE     		
	 * 	alert('- TIPO RICHIESTA: ' + tipoRichiesta +'\n-bytStatoRichiesta: ' + bytStatoRichiesta + '-\nidEtichetta: '+ idEtichetta + '\n-idRichiesta: ' + idRichiesta );
	 */
	if ((tipoRichiesta=='6' || tipoRichiesta=='7' || tipoRichiesta=='8') && statoRichiesta=='I'){
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
			printEtiVitro(idenTestataRichieste,tipoRichiesta,indice);
			return;
		}
	}

	/*
	* ETICHETTE DI LABORATORIO
	* gestione del trasferito -> Spezia
	*/
	if (tipoRichiesta=='0' && statoRichiesta=='I')
	{
		if (idRichiesta2=='')
		{
			if (bytStatoRichiesta == 40)
			{
				alert('Etichetta in errore');
				return;
			}
			else
			{
				if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+dataSlash+", ricaricare la worklist esami/consulenze?"))
				{
	
					//if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE' || tipoWkUrl == '')
					if(top.name == 'schedaRicovero' || tipoWkUrl == '')
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
		}
		else
		{
			if(!confirm("Proseguendo verrà stampata l'etichetta"))
			{
				return;
			}
			printEtiVitro(idenTestataRichieste,tipoRichiesta,indice);
		}
	}
	else
	{
		alert('Attenzione, la richiesta del '+dataSlash+' deve essere nello stato inviato o trasferito');
		return;
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




function stampaEtichettaVitroTutte(indice){	//Non stampa le etichette di Trasfusionale perchè hanno report diverso

	var arIdenTestataRichieste	= new Array();
	var arTipRic     			= new Array();
	
	var tipoWkUrl				= getUrlParameter('Htipowk');
	var idx						= new Array();
	var arIdenTestataDebug		= new Array();
	var arErroreDebug			= new Array();
	var arTipoRichiestaDebug	= new Array();
	var arDataRichiestaDebug	= new Array();
	var arNomePazienteDebug		= new Array();
	var arCognPazienteDebug		= new Array();
	var msgDebug				= new String;

	if (typeof indice == 'undefined'){
		indice = new Array();
		for(var i=0;i<array_id_richiesta2.length;i++){
			indice.push(i);
		}
	}

	for(var i=0;i<indice.length;i++)
	{
		if(array_tipologia_richiesta[indice[i]]=='3' || array_tipologia_richiesta[indice[i]]=='0')
		{
			if(array_tipologia_richiesta[indice[i]]=='3')
			{	// GESTIONE RICHIESTE DI MEDICINA NUCLEARE
				if (top.baseReparti.getValue('','SITO')=='ASL5'){
					if (array_stato[indice[i]] =='I')
					{
						// Inserisco in Array di Debug Richiesta Non Stampabile
						arTipoRichiestaDebug.push(array_tipologia_richiesta[indice[i]]);
						arIdenTestataDebug.push(array_iden[indice[i]]);
						arDataRichiestaDebug.push(array_data_richiesta[indice[i]]);
						arNomePazienteDebug.push(array_nome_paz[indice[i]]);
						arCognPazienteDebug.push(array_cogn_paz[indice[i]]);
						arErroreDebug.push('');
					}
					else	
					{
						if (array_errore_integrazione[indice[i]]!='')
						{	
							// etichetta MedNuc in errore
							arTipoRichiestaDebug.push(array_tipologia_richiesta[indice[i]]);
							arIdenTestataDebug.push(array_iden[indice[i]]);
							arDataRichiestaDebug.push(array_data_richiesta[indice[i]]);
							arNomePazienteDebug.push(array_nome_paz[indice[i]]);
							arCognPazienteDebug.push(array_cogn_paz[indice[i]]);
							arErroreDebug.push(array_errore_integrazione[indice[i]]);
						}
						else
						{
							//etichetta MedNuc Corretta
							arIdenTestataRichieste.push(array_iden[indice[i]]);
							arTipRic.push(array_tipologia_richiesta[indice[i]]);
						}
					}
				}
				else if ((top.baseReparti.getValue('','SITO')=='ASL2'))
				{
					// In ASL2 le richieste di MNU sono stampabili fin dallo stato I
					if (array_stato[indice[i]] =='I')
					{
						arIdenTestataRichieste.push(array_iden[indice[i]]);
						arTipRic.push(array_tipologia_richiesta[indice[i]]);						
					}
				}
			}
			else
			{	
				// GESTIONE ETICHETTA DI LABORATORIO TUTTE
				if (array_stato[indice[i]] =='I')
				{
					if (array_id_richiesta2[indice[i]]=='')
					{
						if (parseInt(array_bytstatorichiesta[indice[i]]) == 40)
						{
							//Etichetta LABO in errore
							arTipoRichiestaDebug.push(array_tipologia_richiesta[indice[i]]);
							arIdenTestataDebug.push(array_iden[indice[i]]);
							arDataRichiestaDebug.push(array_data_richiesta[indice[i]]);
							arNomePazienteDebug.push(array_nome_paz[indice[i]]);
							arCognPazienteDebug.push(array_cogn_paz[indice[i]]);
							arErroreDebug.push(array_errore_integrazione[indice[i]]);
						}
						else
						{							
							arTipoRichiestaDebug.push(array_tipologia_richiesta[indice[i]]);
							arIdenTestataDebug.push(array_iden[indice[i]]);
							arDataRichiestaDebug.push(array_data_richiesta[indice[i]]);
							arNomePazienteDebug.push(array_nome_paz[indice[i]]);
							arCognPazienteDebug.push(array_cogn_paz[indice[i]]);
							arErroreDebug.push('');
						}
					}
					else
					{
						arIdenTestataRichieste.push(array_iden[indice[i]]);
						arTipRic.push(array_tipologia_richiesta[indice[i]]);
					}
				}
			}
		}
	}

	// Se Ci Sono Richieste NON Stampabili...
	if(arIdenTestataDebug.length > 0)
	{
		msgErrore	= ' Attenzione! Le seguenti Etichette NON Sono Disponibili';
		for (var j = 0; j < arIdenTestataDebug.length; j++){			
			msgErrore	+= '\n Data Richiesta: ' + arDataRichiestaDebug[j].substring(6,8)+ '/' + arDataRichiestaDebug[j].substring(4,6) + '/' + arDataRichiestaDebug[j].substring(0,4)+ ' - Paziente: ' + arCognPazienteDebug[j] + ' ' + arNomePazienteDebug[j];
		}
		alert(msgErrore);
	}
	
	// Stampo Le Etichette Possibile
	if(arIdenTestataRichieste.length>0){			
		printEtiVitro(arIdenTestataRichieste,arTipRic,'');
	}	
	
}


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

			//if(tipoWkUrl=='WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE'){
			if(top.name == 'schedaRicovero'){
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
			
			if (top.baseReparti.getValue('','SITO')=='ASL5'){
				//SPEZIA sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
				sf= "{TESTATA_RICHIESTE.IDEN}="+idRichiesta;
				funzione = cdcDestinatario + '_' + keyLegame + '_' + versione ;
				reparto = cdcDestinatario;
			}else{//ASL2 - SPE-CIV
				sf= "{VIEW_VIS_RICHIESTA_REPORT.IDEN}="+idRichiesta;
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


//funzione che stampa solo quelle selezionate
function stampaSelezionate(){

	if (vettore_indici_sel == ''){
		alert('Attenzione! Nessuna riga selezionata');
		return;
	}

	for (var i=0;i<vettore_indici_sel.length;i++){

		var indice = vettore_indici_sel[i];
	}
	stampaEtichettaVitroTutte(vettore_indici_sel);
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


function visualizza_esa2(variabili){

	var altezza = screen.availHeight;
	var largh = screen.availWidth;

	//alert(baseGlobal.URI_REGISTRY);
	//alert(call);

	var myWin=window.open(baseGlobal.URI_REGISTRY+"?User=ImagoWeb&URN="+variabili,"","toolbar=no, menubar=no, resizable=yes, height=" + altezza + ", width=" + largh +",top=0,left=0,status=yes");
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


function visualizzaRichiestaGenerica(richiesta){
	apriVisModScheda('VIS');
}





/******* FUNZIONI CHE SONO IN QUARANTENA IN ATTESA DI ESSERE DEFINITIVAMENTE ELIMINATE **************
 * lucas 11/10/2012 ******

-avanti();
-indietro();
-prelevaPaziente();
-trasportaPaziente();
-post() callback di preleva e trasportaPaziente

//Funzione per la paginazione associata al pulsante 'Avanti' della worklist delle Richieste 
//@param pagina indica la pagina successiva a quella corrente
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


//Funzione per la paginazione associata al pulsante 'Indietro' della worklist delle Richieste
//@param pagina indica la pagina precedente a quella corrente
function indietro(pagina){
	avanti(pagina);
}



function trasportaPaziente(){

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		iden_richiesta = stringa_codici(array_iden);
		stato_richiesta = stringa_codici(array_stato);
		ubicazione = stringa_codici(array_ubicazione_paziente);
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		stato_richiesta = array_stato[rigaSelezionataDalContextMenu];
		ubicazione = array_ubicazione_paziente[rigaSelezionataDalContextMenu];
	}

	if (stato_richiesta=='X'){
		alert("L'indagine non è stata annullata");
		return;
	}
	if (stato_richiesta=='1'){
		alert('Il paziente è già stato trasportato nel reparto di destinazione');
		return;
	}
	if (ubicazione=='2'){
		alert('Il paziente è già stato riportato nel reparto di ricovero');
		return;
	}

	if (!confirm("Si desidera confermare l'avvenuto trasporto del paziente?")){return;}

	dwr.engine.setAsync(false);
	dwrEseguiOperazione.init('T',null,iden_richiesta,null,null,post);
}


function prelevaPaziente(){

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		iden_richiesta = stringa_codici(array_iden);
		stato_richiesta = stringa_codici(array_stato);
		ubicazione = stringa_codici(array_ubicazione_paziente);
	}else{
		iden_richiesta = array_iden[rigaSelezionataDalContextMenu];
		stato_richiesta = array_stato[rigaSelezionataDalContextMenu];
		ubicazione = array_ubicazione_paziente[rigaSelezionataDalContextMenu];
	}

	if (stato_richiesta=='X' && stato_richiesta=='I'){
		alert("L'indagine non è ancora stata pianificata o è stata annullata");
		return;
	}
	
	if (stato_richiesta=='A' && stato_richiesta=='P'){
		alert("L'indagine non è ancora conclusa");
		return;
	}
	
	if (ubicazione=='2'){
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


 */



