try { parent.removeVeloNero('oIFWk'); } catch (e) {}
try { parent.removeVeloNero('idWkRichieste'); } catch (e) {}

var WindowCartella = null;

$(document).ready(function(){
	//SecurityError
	try { var name = window.opener.name; } catch(e) { window.opener = {}; }

	window.WindowCartella = window;
	try {
		while((window.WindowCartella.name != 'Home' || window.WindowCartella.name != 'schedaRicovero') && window.WindowCartella.parent != window.WindowCartella){
			var name = window.WindowCartella.parent.name; // SecurityError Test
			window.WindowCartella = window.WindowCartella.parent;
		}
		switch(WindowCartella.name){
		case 'Home':
		    window.baseReparti 	= WindowCartella.baseReparti;
		    window.baseGlobal 	= WindowCartella.baseGlobal;
		    window.basePC 		= WindowCartella.basePC;
		    window.baseUser 	= WindowCartella.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowCartella.baseReparti;
		    window.baseGlobal 	= WindowCartella.baseGlobal;
		    window.basePC 		= WindowCartella.basePC;
		    window.baseUser 	= WindowCartella.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= top.baseReparti;
	    	window.baseGlobal 	= top.baseGlobal;
	    	window.basePC 		= top.basePC;
	    	window.baseUser 	= top.baseUser;				
			}			
	}
	} catch(e) {}
	
	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch(e) {}
});

var OE_WK_RICHIESTE = {
	
	getTipoWk:function(){
		WindowCartella = window;
		try {
			while((window.WindowCartella.name != 'Home' || window.WindowCartella.name != 'schedaRicovero') && window.WindowCartella.parent != window.WindowCartella){
				var name = window.WindowCartella.parent.name; // SecurityError Test
				window.WindowCartella = window.WindowCartella.parent;
			}
			switch(WindowCartella.name){
			case 'Home':
			    window.baseReparti 	= WindowCartella.baseReparti;
			    window.baseGlobal 	= WindowCartella.baseGlobal;
			    window.basePC 		= WindowCartella.basePC;
			    window.baseUser 	= WindowCartella.baseUser;
			    break;
			case 'schedaRicovero':
			    window.baseReparti 	= WindowCartella.baseReparti;
			    window.baseGlobal 	= WindowCartella.baseGlobal;
			    window.basePC 		= WindowCartella.basePC;
			    window.baseUser 	= WindowCartella.baseUser;
			    break;
			default:
			try{
			    window.baseReparti 	= opener.top.baseReparti;
		    	window.baseGlobal 	= opener.top.baseGlobal;
		    	window.basePC 		= opener.top.basePC;
		    	window.baseUser 	= opener.top.baseUser;
				}catch(e){
			    window.baseReparti 	= top.baseReparti;
		    	window.baseGlobal 	= top.baseGlobal;
		    	window.basePC 		= top.basePC;
		    	window.baseUser 	= top.baseUser;				
				}			
		}
		} catch(e) {}
		
		if(WindowCartella.name == 'schedaRicovero'){
			return window.baseReparti.getValue(WindowCartella.getForm(document).reparto,'OE_WK_RICHIESTE_PAZIENTE_TIPO_WK');
		}else{
			return window.baseReparti.getValue(baseUser.LISTAREPARTI[0],'OE_WK_RICHIESTE_TIPO_WK');
		}
	},
	apriElencoProvette : function(){
		setRiga();
		var idenTestata	= array_iden[rigaSelezionataDalContextMenu];
		var vRs 		= WindowCartella.executeQuery("OE_Richiesta.xml","getElencoProvetteRichiesta",[idenTestata]);
		var arProvette	= '';
		var html 		= '<div class="title">Elenco Provette</div>';
		while(vRs.next()){
			arProvette = vRs.getString("ETICHETTE");
		}
		arProvette	= arProvette.split(',');		
		for(var i = 0; i < arProvette.length; i++) {
			html += '<label>'+arProvette[i]+'</label><br/>';
		}
		
		var props = {
				contents : html,
				css: {
					'text-align':'left'
				}
		};
		OE_WK_RICHIESTE.infoPopup(props);
	},
	infoPopup:function(props) {
		
		$('div#infoPopup').remove();
		var infoContainer = $(document.createElement('DIV'));
		infoContainer.attr('id','infoPopup').addClass('boxInfoLayer');
		var infoContainerInner = $(document.createElement('DIV'));
		infoContainerInner.addClass('boxInfoLayer-inner').append(props.contents);
		infoContainer.append(infoContainerInner);
		var css = {
				'position':'absolute',
				'left':event.clientX,
				'top': event.clientY,
				'z-index':50,
				'display':'none'
		};
		infoContainer.css(css);
		if (typeof props.css != undefined) {
			infoContainer.css(props.css);
		}

		$('body').append(infoContainer);
		infoContainer.click(function(){
			$(this).remove();
		}).show(typeof props.showSpeed == 'undefined'?200:props.showSpeed);
	}

};

//funzione che richiama l'aggiornamento della wk delle richieste
function aggiorna(){
	aggiorna_wk();
}

//funzione che ricarica la worklist delle richieste
function aggiorna_wk(){

	//alert(WindowCartella.name);
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
		
		/*if(WindowCartella.name == 'schedaRicovero'){
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
	if (typeof WindowCartella.ModalitaCartella != 'undefined' && WindowCartella.ModalitaCartella.isReadonly(document)==true){
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


	/*$.fancybox({
		'padding'	: 3,
		'width'		: 600,
		'height'	: 250,
		'href'		: "annullamentoRichiestaPrenotazione.html",
		'type'		: 'iframe'
	});*/
	
		window.FinestraAnnullamentoParametri = {
		tipo_utente: WindowCartella.baseUser.TIPO,
		tipologia : tipologia_richiesta == '5' ? 'CONSULENZA' : 'RICHIESTA',
		callBackOk:annullaRichiestaPrenotazioneGenerica,
		callBackKo:function(){}
	};
	
	var finestra = window.open("annullamentoRichiestaPrenotazione.html", "winAnnullamento", "width=600, height=300, top=150, left=300,resizable=yes");
	try{
		WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){
		try{
			WindowCartella.closeWhale.pushFinestraInArray(finestra);					
		}catch(e){}
	}

}



function annullaRichiestaPrenotazioneGenerica(motivoAnnullamento,idenMed){

	//alert('motivo Annullamento: '+motivoAnnullamento);
	if(motivoAnnullamento != ''){
		motivoAnnullamento = motivoAnnullamento.toString().replace(/\'/,"''");
	}		
	OE_RICHIESTA.annulla({
		'iden_richiesta':stringa_codici(array_iden),
                                    'reparto_sorgente':stringa_codici(array_reparto_sorgente ),
                                    'reparto_destinatario':stringa_codici(array_cdc),
		'motivo_annullamento':motivoAnnullamento,
		'iden_med':idenMed,
		'callBackOk':aggiorna_wk,
		'callBackKo':function(resp){
			alert(resp.message);
		}
	});
	
}


function apriCartella(pIdenAnag,pFunzione){
	WindowCartella.NS_CARTELLA_PAZIENTE.apri({		
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

	if(WindowCartella.name == 'schedaRicovero'){
		WindowCartella.apriDatiLaboratorio({idenRichiesta:array_iden[rigaSelezionataDalContextMenu],reparto:array_reparto_sorgente[rigaSelezionataDalContextMenu]});
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

	if(WindowCartella.name == 'schedaRicovero'){
		WindowCartella.apriDatiTrasfusionale({idenRichiesta:array_iden[rigaSelezionataDalContextMenu],reparto:array_reparto_sorgente[rigaSelezionataDalContextMenu]});
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
		
		if(WindowCartella.name=='schedaRicovero'){
			WindowCartella.apriRichiesta(iden_richiesta,(pStato=='MOD'?'S':'N'));
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
	aggiungiCampiFrmAggiorna();
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

	//if(message != ''){alert('cbk_annullamentoRichiestaGenerica: ' + message);}

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

	window.open(url,'WHALE_winVisRich',"status=yes fullscreen=yes scrollbars=yes");
	
}


function eseguiRichiesta(){

	setRiga();
	
	var tipoRichiesta =array_tipologia_richiesta[rigaSelezionataDalContextMenu];
	var stato_richiesta=array_stato[rigaSelezionataDalContextMenu];
	
	
	if (tipoRichiesta!='4'){
	   alert('Funzione non abilitata per questa tipologia di richiesta');	
		return;
	}
	if (stato_richiesta=='E' || stato_richiesta=='R'){
		   alert('Richiesta già eseguita');	
			return;
	}
	
	OE_RICHIESTA.esegui({
		'iden_richiesta':array_iden[rigaSelezionataDalContextMenu],
		'iden_per':baseUser.IDEN_PER
	},cbk_richiestaEsegui);
	
}

function cbk_richiestaEsegui(resp){
		alert(resp.message);
		aggiorna_wk();
}

//funzioni legata alle iconcine R e P  sulla wk del paziente
function insPrenCartella(){
	WindowCartella.inserisciPrenotazione();
}

function insRichCartella(){
	WindowCartella.inserisciRichiestaConsulenza();
}


function inserisciRichiesta(){

    var str = stringa_codici(array_iden_anag).toString();
        var strSplitted = str.split('*');
        if(strSplitted.length > 1){
            return alert("Attenzione effettuare una selezione singola");
       }else if(stringa_codici(array_iden_anag).toString().length>0){
    	   WindowCartella.NS_CARTELLA_PAZIENTE.apri({iden_anag:stringa_codici(array_iden_anag),cod_cdc:stringa_codici(array_reparto_sorgente),funzione:"inserisciGenerico('ALBERO_RICHIESTE_LABORATORIO','INSERIMENTO_RICHIESTA','Inserimento richiesta');"});
       }else{
           return alert("Selezionare almeno un paziente");
       }
}
// graziav
// chiamata da wk esami/consulenze del menu verticale
// inserita per autologin da NOEMA a Parma
function inserisciRichiestaConsulenzaCart(){

    var str = stringa_codici(array_iden_anag).toString();
        var strSplitted = str.split('*');
        if(strSplitted.length > 1){
            return alert("Attenzione effettuare una selezione singola");
       }else if(stringa_codici(array_iden_anag).toString().length>0){
    	   WindowCartella.NS_CARTELLA_PAZIENTE.apri({iden_anag:stringa_codici(array_iden_anag),cod_cdc:stringa_codici(array_reparto_sorgente),funzione:"inserisciGenerico('ALBERO_RICHIESTE_CONSULENZE','INSERIMENTO_RICHIESTA','Inserimento richiesta');"});
       }else{
           return alert("Selezionare almeno un paziente");
       }
}


function loadWaitWindow(){

	var doc = document.form_wkl_richieste;

	doc.action = 'worklistRichieste';
	doc.target = '_self';

	//alert(this.name + '\n' + WindowCartella.name);
	/*if(WindowCartella.name == 'schedaRicovero')
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

	if (typeof WindowCartella.ModalitaCartella != 'undefined' && WindowCartella.ModalitaCartella.isReadonly(document)== true){
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

			//LABORATORIO, MEDNUC RIA, TRASFUSIONALE, ANATOMIA PATOLOGICA 
			case '0':
			case '3':
			case '6':
			case '7':
			case '8':
			case '12':
				if (stato_richiesta == 'I' && prelievo_effettuato != 'S'){
					apriVisModScheda('MOD');
				}else{
					richiediConfermaVisualizzazione();
				}
				break;				
	
			//RADIOLOGIA, MEDNUC VIVO n, CONSULENZE, GENERICA
			case '1':
			case '2':
			case '4':
			case '5':
			case '9':
			case '10':
			//Valutazione pre operatoria (visita chirurgica)	
			case '11':
			case '14':
				if (stato_richiesta == 'I' ){
					apriVisModScheda('MOD');
				}else{
					richiediConfermaVisualizzazione();
				}
				break;
			
			//DEFAULT
			default:
				richiediConfermaVisualizzazione();
				break;
		}
	}
	
	function richiediConfermaVisualizzazione(){
		if(confirm('Attenzione! La richiesta non può più essere modificata.\nVerrà aperta in modalità di visualizzazione. Continuare?')){
			apriVisModScheda('VIS');
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
	if (typeof WindowCartella.ModalitaCartella != 'undefined' && WindowCartella.ModalitaCartella.isReadonly(document)==true){
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

	var sf			= '';
	var funzione	= '';
	var sIdTestate	= '';
	
	var anteprima	= basePC.PRINTERNAME_ETI_CLIENT ==' ' || basePC.PRINTERNAME_ETI_CLIENT == null ? anteprima='S' : anteprima='N' ;

	if (typeof idenTestataRichieste == 'object') {
		idenTestataRichieste = $.map(idenTestataRichieste, function(val,index) {                    
			 return val;
		}).join(",");
	}
	
	sf = '&prompt<pRichieste>=' + idenTestataRichieste;
	WindowCartella.stampa('ETICHETTA_VITRO',sf,'S',basePC.DIRECTORY_REPORT,basePC.PRINTERNAME_ETI_CLIENT);

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
				WindowCartella.confStampaReparto('WK_CONSULENZE_GENERICHE',sf,'S',reparto,null);
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
			WindowCartella.confStampaReparto('WK_RICHIESTE_GENERICHE',sf,'S',reparto,null);
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
		var url = "ApriPDFfromDB?AbsolutePath="+WindowCartella.getAbsolutePath()+"&idenVersione="+idenReferto;
		window.open(url,'','scrollbars=yes,fullscreen=yes');
	}
	else if (statoReferto=='V')
	{
		//if(tipoWkUrl == 'WK_RICHIESTE_RICOVERATI_GENERICHE_PAZIENTE')
		if(WindowCartella.name == 'schedaRicovero')
		{
			/* Da dentro la cartella*/
			reparto  = WindowCartella.getForm(document).reparto;
			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
		}
		else
		{
			reparto  = repCdc;
			WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
		}
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

function stampaEtichettaVitro(pCase){

	var tipoWkUrl				= getUrlParameter('Htipowk');
	var arIndici				= []; 	// Collection Posizioni da Stampare
	var arTipoRichiesta			= [];	// Tipo Richiesta				- array_tipologia_richiesta[rigaSelezionataDalContextMenu];
	var arStatoRichiesta		= [];	// Stato Richiesta				- array_stato[rigaSelezionataDalContextMenu];
	var arBytStatoRichiesta		= [];	// Gestione Errore Richiesta	- parseInt(array_bytstatorichiesta[rigaSelezionataDalContextMenu])
	var arDataRichiesta			= [];	// Data Richiesta YYYYMMDD		- array_data_richiesta[rigaSelezionataDalContextMenu]	
	var arErrIntegrazione		= [];	// Errore Integrazione MNU		- array_errore_integrazione[rigaSelezionataDalContextMenu]
	var arIdenTestataRichieste	= [];	// Testata_Richieste.Iden		- array_iden[rigaSelezionataDalContextMenu]
	var arDataSlash				= [];	// Data dd/mm/yyyy				- isoToDate(dataRichiesta);
	var arIdRichiesta2			= [];	// Tr.id_richiesta2				- array_id_richiesta2[rigaSelezionataDalContextMenu];
	var arCdcDestinatario		= [];	// Collection Cdc Destinatario
	
	// Variabili Messaggio di Errore
	var arIdenTestataErrore		= [];
	var arDataRichiestaErrore	= [];
	var arNomePazienteErrore	= [];
	var arCognPazienteErrore	= [];
	var arDescrErrore			= [];
	var arTipoRichiestaErrore	= [];
	var msgErrore				= '';
	
	if (pCase == 'SINGOLA' || typeof pCase == 'undefined'){

		setRiga();		
		arIndici.push(rigaSelezionataDalContextMenu);

	}else if(pCase == 'SELEZIONATE'){
	
		arIndici	= vettore_indici_sel;
	
	}else if(pCase == 'TUTTE'){
		
		for(var i=0;i<array_id_richiesta2.length;i++)
			arIndici.push(i);		
	}

	// Controllo Tipologia Richiesta
	if (arIndici.length < 2) { 
		var richiesta = array_tipologia_richiesta[arIndici[0]];
		switch(richiesta) {
			case '0': case '3':	case '6':
			case '7': case '8':	case '12':
				break;
			default:
				alert('Tipologia di richiesta non adeguata');
				return;
		}
	}

	
	for(var i = 0; i < arIndici.length; i++){
		
		arDataSlash.push(isoToDate(array_data_richiesta[arIndici[i]]));	
		
		// Configurazione Stato Stampa Etichette
		var confStampaEtichette	= eval(baseReparti.getValue(array_reparto_sorgente[arIndici[i]],'statoRichiestaStampaEtichetta'))[array_cdc[arIndici[i]]];

		// ETICHETTE DI MEDICINA NUCLEARE	
		if (array_tipologia_richiesta[arIndici[i]] == '3'){
			if ($.inArray( array_stato[arIndici[i]],confStampaEtichette) >= 0)
			{				
				if (baseGlobal.SITO == 'ASL5' && array_errore_integrazione[i] != ''){
					arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
					arIdenTestataErrore.push(array_iden[arIndici[i]]);
					arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
					arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
					arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
					arDescrErrore.push(array_errore_integrazione[arIndici[i]]);
				}
				
				arIdenTestataRichieste.push(array_iden[arIndici[i]]);
				arTipoRichiesta.push(array_tipologia_richiesta[arIndici[i]]);
				
			}else{
				// Gestione Errori In Base Al Sito - Alert di Refresh solo per Stampa Etichetta Singola
				if (baseGlobal.SITO == 'ASL5'){
					arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
					arIdenTestataErrore.push(array_iden[arIndici[i]]);
					arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
					arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
					arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
					arDescrErrore.push('Etichetta Non Disponibile');
				}else{
					arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
					arIdenTestataErrore.push(array_iden[arIndici[i]]);
					arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
					arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
					arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
					arDescrErrore.push('La Richiesta deve Essere nello Stato: ' + confStampaEtichette );
				}		
				
			}
		}	
	
		// ETICHETTE DI EMOTRASFUSIONALE     		
		if ((array_tipologia_richiesta[arIndici[i]]=='6' || array_tipologia_richiesta[arIndici[i]] == '7' || array_tipologia_richiesta[arIndici[i]]=='8') && array_stato[arIndici[i]]=='I'){
	
			if(array_bytstatorichiesta[arIndici[i]] == 10){
				arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
				arIdenTestataErrore.push(array_iden[arIndici[i]]);
				arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
				arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
				arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
				arDescrErrore.push('Richiesta Annullata');
			}else if(array_bytstatorichiesta[arIndici[i]] == 40){
				arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
				arIdenTestataErrore.push(array_iden[arIndici[i]]);
				arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
				arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
				arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
				arDescrErrore.push('Richiesta in Errore');
			}else if(isNaN(array_bytstatorichiesta[arIndici[i]])){
				arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
				arIdenTestataErrore.push(array_iden[arIndici[i]]);
				arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
				arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
				arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
				arDescrErrore.push('Etichetta Non Disponibile');
			}else{
				arIdenTestataRichieste.push(array_iden[arIndici[i]]);
				arTipoRichiesta.push(array_tipologia_richiesta[arIndici[i]]);
			}
		}
	
		// ETICHETTE DI LABORATORIO
		if (array_tipologia_richiesta[arIndici[i]]=='0' || array_tipologia_richiesta[arIndici[i]]=='12')
		{
			if(array_stato[arIndici[i]] == 'I' && array_tipologia_richiesta[arIndici[i]]=='0'){
				
				if (array_id_richiesta2[arIndici[i]]=='')
				{
					if (array_bytstatorichiesta[arIndici[i]] == 40)
					{
						arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
						arIdenTestataErrore.push(array_iden[arIndici[i]]);
						arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
						arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
						arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
						arDescrErrore.push('Etichetta in Errore');
					}
					else
					{
						arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
						arIdenTestataErrore.push(array_iden[arIndici[i]]);
						arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
						arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
						arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
						arDescrErrore.push('Etichetta Non Disponibile');
					}
				}
				else
				{
					arIdenTestataRichieste.push(array_iden[arIndici[i]]);
					arTipoRichiesta.push(array_tipologia_richiesta[arIndici[i]]);
				}
				
			}else if (array_tipologia_richiesta[arIndici[i]]!='12') {
				// alert('Attenzione, la richiesta del ' + arDataSlash[i] + ' deve essere nello stato inviato o trasferito');
				arTipoRichiestaErrore.push(array_tipologia_richiesta[arIndici[i]]);
				arIdenTestataErrore.push(array_iden[arIndici[i]]);
				arDataRichiestaErrore.push(array_data_richiesta[arIndici[i]]);
				arNomePazienteErrore.push(array_nome_paz[arIndici[i]]);
				arCognPazienteErrore.push(array_cogn_paz[arIndici[i]]);
				arDescrErrore.push('Attenzione, la richiesta del ' + arDataSlash[i] + ' deve essere nello stato inviato o trasferito');
			}else{
				arIdenTestataRichieste=array_iden[arIndici[i]];
			}
			
		}
		
		// alert('loop al giro: ' + i + ' - tipo richiesta: ' +array_tipologia_richiesta[arIndici[i]] + '\n arIndici: ' + arIndici[i] + '\n Data Slash: ' + arDataSlash[i]);
		
	}
	
	// Debug Stampa Singola
	if(arIndici.length < 2 && arDescrErrore[0] == 'Etichetta Non Disponibile'){
		// Etichetta Non Disponibile. Chiedo il REFRESH
		if(confirm("Etichetta momentaneamente non disponibile per la richiesta del "+arDataSlash[0]+", ricaricare la worklist esami/consulenze?"))
		{
			if(WindowCartella.name == 'schedaRicovero' || tipoWkUrl == ''){
				WindowCartella.apriWorkListRichieste();
				return;
			}else{
				parent.applica_filtro_richieste();
				return;
			}
		}
		
	}else if(arIndici.length < 2 && arDescrErrore.length > 0){
		
		// Errore Generico
		alert('Errore: ' + arDescrErrore[0]);
		return;
	
	}else if(arIndici.length < 2 && arDescrErrore.length < 1){
		
		if (baseUser.LOGIN == 'arry')
			alert('Alert Solo Per Admin! \n - Stampa Singola: ' + arIdenTestataRichieste + '\n - arTipoRichiesta: ' + arTipoRichiesta);
		
		printEtiVitro(arIdenTestataRichieste,arTipoRichiesta,arIndici);
	}
	
	// Debug Stampa Etichette Multipla
	if (arIndici.length > 1){
		
		var vRefresh;
		msgErrore	= ' Attenzione! Le seguenti Etichette NON Sono Disponibili:';
		
		// Ciclo Le richieste in Errore
		if(arIdenTestataErrore.length > 0){			
			for (var j = 0; j < arIdenTestataErrore.length; j++){				
				msgErrore	+= '\n - Data Richiesta: ' +arDataSlash[j] + ' - Paziente: ' + arCognPazienteErrore[j] + ' ' + arNomePazienteErrore[j] + ' - ' + arDescrErrore[j];
			}			
			alert(msgErrore);			
		}
		
		if (baseUser.LOGIN == 'arry')
			alert('Alert Solo Per Admin! \n - prima stampa multipla: ' + arIdenTestataRichieste + '\n - arIdenTestataRichieste.length: ' + arIdenTestataRichieste.length);
		
		// Stampo Le Etichette Possibile
		if(arIdenTestataRichieste.length>0)			
			printEtiVitro(arIdenTestataRichieste,arTipoRichiesta,arIndici);		
	}
}

function printEtiVitro(idenTestataRichieste, tipoRichiesta, indici){

	var sf			= '';
	var funzione	= '';	
	var anteprima	= basePC.PRINTERNAME_ETI_CLIENT == '' || basePC.PRINTERNAME_ETI_CLIENT == null ? anteprima = 'S' : anteprima='N' ;
	
	if (typeof idenTestataRichieste == 'object') {
		idenTestataRichieste = $.map(idenTestataRichieste, function(val,index) {                    
			 return val;
		}).join(",");
	}
	
	sf = '&prompt<pRichieste>=' + idenTestataRichieste;
	WindowCartella.stampa('ETICHETTA_VITRO',sf,anteprima,basePC.DIRECTORY_REPORT,basePC.PRINTERNAME_ETI_CLIENT);
	
	savePrintEtichette(idenTestataRichieste, tipoRichiesta, indici);
	
	function savePrintEtichette(arIden, arTipoRichiesta, indice){
		
		var arIdenTR	= arIden.split(',');
		var sIdTestate	= '';
		
		// Salvo Stampa Tipo 0	
		// alert('Save print idenTestataRichieste: ' + arIdenTR + '\n  typeof: ' + typeof arIdenTR)	
		for(var i = 0; i < arIdenTR.length; i++){
			if (arTipoRichiesta[i]=='0')
				sIdTestate	+= sIdTestate=='' ? arIdenTR[i] : '*'+arIdenTR[i];					
		}
		
		// alert('Ar Iden: ' + arIden + '\n Tipo Rich: ' + tipoRichiesta + '\n sIdTestate: ' + sIdTestate);
		if(sIdTestate!=''){
			param = "SP_LABO_STAMPA_ETICHETTE@"+sIdTestate+"@TRUE@string";
			dwr.engine.setAsync(false);
			CJsUpdate.call_stored_procedure(param,cbk_stampaEtichette);
			dwr.engine.setAsync(true);
		}
		
		function cbk_stampaEtichette(resp){
			
			for(var i=0;i<indici.length;i++)
				array_stato_etic[indici[i]]='1';	
				
		}
	}	

}

function resp(res){

	if (res!='OK')
		alert(res);
}

function stampaRichiestaProvaCrociata(){
	
	setRiga();		
	var vResp	= WindowCartella.executeStatement("OE_Richiesta.xml","getInfoPaziente",[array_iden_anag[rigaSelezionataDalContextMenu],array_reparto_sorgente[rigaSelezionataDalContextMenu]],6);
	if(vResp[0]=='KO')
		return alert('Inserimento in Errore: \n' + vResp[1]);
		
	var oWord = new ActiveXObject("Word.Application");
	if (oWord != null){
		oWord.Visible = true;
//		oWord.Documents.Open("C:\\mod_01_trasfusio.docx");
//		oWord.Documents.Open("\\\\192.168.1.6\\home$\\AlessandroArry\\mod_01_trasfusio.docx");			
//		oWord.Documents.Open(WindowCartella.NS_APPLICATIONS.switchTo('WHALE','report/mod_01_trasfusio.docx'));			
//		oWord.Documents.Open(WindowCartella.NS_APPLICATIONS.switchTo('MODULI','MODULI_DOC/mod_01_trasfusio.docx'));			
//		alert('url whale: ' + WindowCartella.NS_APPLICATIONS.switchTo('WHALE',''));
		if (WindowCartella.NS_APPLICATIONS.switchTo('WHALE','').indexOf('.177') > 0)
			oWord.Documents.Open(WindowCartella.NS_APPLICATIONS.switchTo('WHALE','') + "GetExternalResource?resource=/opt/APACHE2/report/whale/MODULI_DOC/mod_01_trasfusio.doc");
		else	
			oWord.Documents.Open(WindowCartella.NS_APPLICATIONS.switchTo('WHALE','') + "/GetExternalResource?resource=/usr/local/report/whale/MODULI_DOC/mod_01_trasfusio.doc");			
		
		oWord.WindowState = 2;
    	oWord.WindowState = 1;
		oWord.Application.Visible = true;
		oWord.ActiveWindow.Activate();
		
	} 
	else{
		alert('cannot open Word application.');
	}

	var docActive	= oWord.ActiveDocument;
	var Table1		= docActive.Tables(2);
	var Table2		= docActive.Tables(9);
	var Table3		= docActive.Tables(16);
	
	var dataRich	= array_data_richiesta[rigaSelezionataDalContextMenu];

	dataRich		= dataRich.substring(6,8) + '/' + dataRich.substring(4,6) + '/' + dataRich.substring(0,4);
	
	Table1.Cell(2,4).Range.Text	= vResp[2];
	Table1.Cell(2,2).Range.Text	= vResp[3];
	Table1.Cell(3,2).Range.Text	= vResp[4];
	Table1.Cell(3,4).Range.Text	= vResp[5];
	Table1.Cell(3,4).Range.Text	= vResp[5];
	Table1.Cell(1,4).Range.Text	= dataRich;
	Table1.Cell(1,2).Range.Text	= vResp[7];
	
	Table2.Cell(2,4).Range.Text	= vResp[2];
	Table2.Cell(2,2).Range.Text	= vResp[3];
	Table2.Cell(3,2).Range.Text	= vResp[4];
	Table2.Cell(3,4).Range.Text	= vResp[5];
	Table2.Cell(3,4).Range.Text	= vResp[5];
	Table2.Cell(1,4).Range.Text	= dataRich;
	Table2.Cell(1,2).Range.Text	= vResp[7];
	
	Table3.Cell(2,4).Range.Text	= vResp[2];
	Table3.Cell(2,2).Range.Text	= vResp[3];
	Table3.Cell(3,2).Range.Text	= vResp[4];
	Table3.Cell(3,4).Range.Text	= vResp[5];
	Table3.Cell(3,4).Range.Text	= vResp[5];
	Table3.Cell(1,4).Range.Text	= dataRich;
	Table3.Cell(1,2).Range.Text	= vResp[7];
	/*
		word.docActive.Save();
		word.Quit();
		// Don't forget
		// set w.Visible=false 
	*/ 
	

}

function stampaRiepilogo(){

	setRiga();
	var sf;
	var funzione;
	var reparto;
	var anteprima;







	var keyLegame;
	var versione;
	var idRichiesta;
	var cdcDestinatario;
	var tipoRichiesta;
	var arrivatoDa;

	if (rigaSelezionataDalContextMenu==-1){
		keyLegame= stringa_codici(array_key_legame);
		versione=stringa_codici(array_versione);
		idRichiesta=stringa_codici(array_iden);
		cdcDestinatario=stringa_codici(array_cdc);
		tipoRichiesta=stringa_codici(array_tipologia_richiesta);
		arrivatoDa=stringa_codici(array_id_richiesta2);
	 if(vettore_indici_sel.length > 1){
		alert('Attenzione! Selezionare una sola riga');
		return;
	}
	}else{
	  keyLegame       = array_key_legame[rigaSelezionataDalContextMenu];
	  versione        = array_versione[rigaSelezionataDalContextMenu];
	  idRichiesta     = array_iden[rigaSelezionataDalContextMenu];
	  cdcDestinatario = array_cdc[rigaSelezionataDalContextMenu];
	  tipoRichiesta	  = array_tipologia_richiesta[rigaSelezionataDalContextMenu];
	  arrivatoDa	  = array_id_richiesta2[rigaSelezionataDalContextMenu];
	}
	
	if(basePC.PRINTERNAME_REF_CLIENT=='')
		anteprima='S';
	else{
		anteprima='N';
	}

	if (array_prenotazione_diretta[rigaSelezionataDalContextMenu]=='S'){
		var connection = '';
 		switch(arrivatoDa){
			case 'POLARIS'		: 
				funzione = "PRENOTAZIONE_POLARIS_WHALE.RPT";
				sf= "{COD_EST_ESAMI.COD9}='"+idRichiesta+"' and {COD_EST_ESAMI.ARRIVATODA}='WHALE'";
				reparto = cdcDestinatario;
				connection=baseGlobal.URL_PRENOTAZIONE;
				WindowCartella.stampaPrenotazioneDirettaSuPolaris(connection,funzione,sf,anteprima,reparto,null);
				break;
			case 'AMBULATORIO'	: 
				//funzione = "PRENOTAZIONE_AMBULATORIO_WHALE.RPT";
				funzione = "RICEVUTA_PRENO_WHALE";
				sf= "{COD_EST_ESAMI.COD1}='"+idRichiesta+"' and {COD_EST_ESAMI.ARRIVATODA}='WHALE'";			
				reparto = cdcDestinatario;
				//var loc = window.location;
				//connection=loc.protocol +'//' + loc.host +WindowCartella.NS_APPLICATIONS.getApplicationPath(arrivatoDa);
				WindowCartella.stampaPrenotazioneDirettaSuAmbulatorio(arrivatoDa,funzione,sf,anteprima,reparto,null);
				break;
			default				: '';	
		}

		// Foglio di Prenotazione
		/*funzione = "PRENOTAZIONE_POLARIS_WHALE.RPT";
		sf= "{COD_EST_ESAMI.COD9}='"+idRichiesta+"' and {COD_EST_ESAMI.ARRIVATODA}='WHALE'";
		reparto = cdcDestinatario;
		var polaris_connection=baseGlobal.URL_PRENOTAZIONE;
		WindowCartella.stampaPrenotazioneDirettaSuPolaris(polaris_connection,funzione,sf,anteprima,reparto,null);
		*/

	}else{
		
		if (array_tipologia_richiesta[rigaSelezionataDalContextMenu]=='5' || array_tipologia_richiesta[rigaSelezionataDalContextMenu]=='14'){

			// Consulenza
			sf= "&prompt<pIdenTR>="+array_iden[rigaSelezionataDalContextMenu];
			if (array_tipologia_richiesta[rigaSelezionataDalContextMenu]=='5'){
				funzione = 'CONSULENZE_REFERTAZIONE';
			}
			else{
				funzione = 'PRESA_IN_CARICO';
			}
			var tipoWkUrl=getUrlParameter('Htipowk');
			var reparto  = '';

			if(WindowCartella.name == 'schedaRicovero'){
				/* Da dentro la cartella dal paziente */
				reparto  = WindowCartella.getForm(document).reparto;
				WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,null);
			}else{
				reparto  = array_cdc[rigaSelezionataDalContextMenu];
				WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
			}

		}else{	
			// richiesta RADIO, LABO, TRASFUSIO		
			sf = '&prompt<pIdenTestata>=' + idRichiesta;
			funzione = cdcDestinatario + '_' + keyLegame;

			// alert('-funzione: ' + funzione + '\n-reparto: ' + cdcDestinatario + '\n sf: ' + sf);
			WindowCartella.stampa(funzione, sf, anteprima, cdcDestinatario, null);
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

	sf 		= '&prompt<pIdenTestata>=' + idRichiesta;
	funzione 	= 'TRASFUSIO_RITIRO_PRODOTTI';
	
	if(basePC.PRINTERNAME_REF_CLIENT=='')
		anteprima='S';
	else
		anteprima='N';
	
	if(tipoRichiesta == '7'){				
			
		var dataTSString 	= array_id_richiesta2[rigaSelezionataDalContextMenu];
		var stampaTS		= checkTS(dataTSString);

		if(!stampaTS)
		return;							
	}
	
	if(baseUser.LOGIN == 'usrradiologi' || baseUser.LOGIN == 'testrxb' || baseUser.LOGIN == 'testelco2')		
		alert('Alert x Admin \n - funzione: ' + funzione + '\n - reparto: ' + reparto + '\n - sf: ' + sf +'\n - anteprima: ' + anteprima);
	
	WindowCartella.stampa(funzione, sf, anteprima, 'TRASFUSIO', null);

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

function stampaConsenso(funzione){
	
	var reparto   = '';
	var anteprima = 'S';
	var idenTestata;	

	if(vettore_indici_sel.length > 1){
		alert('Attenzione! Selezionare una sola riga');
		return;
	}

	setRiga();

	if (rigaSelezionataDalContextMenu==-1){
		idenTestata= stringa_codici(array_iden);
		reparto=stringa_codici(array_reparto_sorgente);

	}else{
		idenTestata= array_iden[rigaSelezionataDalContextMenu];
		reparto=array_reparto_sorgente[rigaSelezionataDalContextMenu];
	}
	var sf ="&prompt<pIdenTR>="+idenTestata;
	WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
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
		iden_anag		=stringa_codici(array_iden_anag);
	}else{

		idenTestata   = array_iden[rigaSelezionataDalContextMenu];
		id_remoto     = array_id_remoto[rigaSelezionataDalContextMenu];
		stato         = array_stato[rigaSelezionataDalContextMenu];
		tipologia_ric = array_tipologia_richiesta[rigaSelezionataDalContextMenu];
		//codDecReparto = array_cod_dec_reparto[rigaSelezionataDalContextMenu];
		repCdc		   = array_cdc[rigaSelezionataDalContextMenu];
		iden_anag	   = array_iden_anag[rigaSelezionataDalContextMenu];
	}

	if(stato!='R' && stato!='RP'){alert("La richiesta dev'essere nello stato REFERTATO");return;}

	var vResp = WindowCartella.executeStatement("OE_Richiesta.xml","ConfermaLetturaEsito",[idenTestata,baseUser.IDEN_PER]);
	if(vResp[0]=='KO'){
		alert('Segnalazione di lettura avvenuta con errori.\n'+vResp[1]);
	}
	url = "servletGenerator?KEY_LEGAME=VISDOC&identificativoEsterno=WHALE"+idenTestata+"&reparto="+baseUser.LISTAREPARTIUTENTECODDEC[0];	
	var finestra = window.open (url,'','fullscreen=yes, scrollbars=no');
	try{
		WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
	}catch(e){
		try{
			WindowCartella.closeWhale.pushFinestraInArray(finestra);					
		}catch(e){}
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
		WindowCartella.confStampaReparto('REFERTI_LABO_NO_FIRMATI',sf,'S',reparto,null);
	}
}


function visualizzaRichiestaGenerica(richiesta){
	apriVisModScheda('VIS');
}


var INFO_PREPARAZIONE = {


	open:function(){
		var pBinds = new Array();	
		setRiga();
		pBinds.push(array_iden[rigaSelezionataDalContextMenu]);
		var  rs = WindowCartella.executeQuery("worklistRichieste.xml","preparazioneEsami",pBinds);

		WindowCartella.Popup.remove();


        var vObj = WindowCartella.$('<table></table>')
        .css("font-size","13px").css("table-layout","fixed")

        while(rs.next()){	
         vObj=vObj.append(
        	 WindowCartella.$('<tr></tr>')
                .append(WindowCartella.$('<th></th>').text(rs.getString("ESAME")))								
        );

         vObj=vObj.append(
        		 WindowCartella.$('<tr></tr>')
                    .append(
                    	WindowCartella.$('<td></td>').css("word-wrap","break-word")
                            .append(
                                $('<pre></pre>').text(rs.getString("PREPARAZIONE"))
                            )
                    )
            );	
        }					
        WindowCartella.Popup.append({
            obj:vObj,
            title:"Preparazione esami",
            width:550,
            height:200,
            position:[event.clientX+10,event.clientY+100]
        });
	},
    
    stampaWkAppPreOperatorioPaziente:function(){
            var idenVisita= WindowCartella.getRicovero('IDEN');
            var sf ="&prompt<pIdenVisita>="+idenVisita;
            var funzione='WK_APP_PREOPERATORIO_PAZ';
            var reparto = '';
            var anteprima = 'S';
            WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
    }

};




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
	
	if(WindowCartella.name == 'schedaRicovero')
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

/**
 * @author:linob
 * @scope:aggiunta dei campi per la gestione della privacy nel refresh manuale(ordinamento,allargamento colonne) della wk delle richieste
 */
function aggiungiCampiFrmAggiorna(){

	//alert(top.name);
	var doc = document.form_wkl_richieste;
	doc.action = 'worklistRichieste';
	doc.method = 'POST';


	doc.Htipowk.value = OE_WK_RICHIESTE.getTipoWk();
	if(WindowCartella.name === 'schedaRicovero'){
		if(WindowCartella.CartellaPaziente.checkPrivacy('WK_RICHIESTE')){
			doc.appendChild(addInputToForm("COD_DEC","COD_DEC",top.baseUser.COD_DEC))
			doc.appendChild(addInputToForm("COD_FISC","COD_FISC",$("form[name='frmPaziente'] input[name='COD_FISC']").val()))
			doc.appendChild(addInputToForm("PREDICATE_FACTORY","PREDICATE_FACTORY",encodeURIComponent(top.privacy.WK_RICHIESTE.PREDICATE_FACTORY)))
			doc.appendChild(addInputToForm("BUILDER","BUILDER",encodeURIComponent(top.privacy.WK_RICHIESTE.BUILDER)))
			doc.appendChild(addInputToForm("SET_EMERGENZA_MEDICA","SET_EMERGENZA_MEDICA",top.getPaziente("EMERGENZA_MEDICA")))
			doc.appendChild(addInputToForm("ID_REMOTO","ID_REMOTO",top.getPaziente("ID_REMOTO")))
			doc.appendChild(addInputToForm("QUERY","QUERY","getListDocumentPatient"))
			doc.appendChild(addInputToForm("COD_DEC","COD_DEC",top.baseUser.COD_DEC))
			doc.appendChild(addInputToForm("TIPOLOGIA_ACCESSO","TIPOLOGIA_ACCESSO", top.document.EXTERN.ModalitaAccesso.value))
			doc.appendChild(addInputToForm("EVENTO_CORRENTE","EVENTO_CORRENTE",top.getRicovero("NUM_NOSOLOGICO")))			
		}
	}
		
		

}

function addInputToForm(id,name,value){
	var input 	= document.createElement('INPUT');
	input.id 	= id;
	input.name 	= name;
	input.type	= "hidden";
	input.value	= value;
	return input;
}

