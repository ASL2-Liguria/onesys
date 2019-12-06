/*
function insAllerta(tipo){

	descrizione = getMotivoModale(5);
	if (descrizione=='')
		return;

	dwr.engine.setAsync(false);
	dwrAllerte.insAllerta(tipo,top.EXTERN.iden_visita.value,descrizione,callBack);
	dwr.engine.setAsync(true);

	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		//top.apriProblemiAllerte();
		document.location.replace(document.location);
		aggiornaWkAllerte();
	}
}
function updDb(tabella,campo,valore,iden){

	if (campo=='SUPERATO')
		if (!confirm('Attenzione!! Dato critico, si conferma la modifica?'))
			return;
	dwr.engine.setAsync(false);
	dwrAllerte.updDb(tabella,campo,valore,iden,callBack);
	dwr.engine.setAsync(true);

	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		//top.apriProblemiAllerte();
		document.location.replace(document.location);
		aggiornaWkAllerte();
	}
}
function insReazioneAvversa(){
	window.open("scanDB?myric=&myproc=VIEW_CC_FARMACI&mywhere=&myogg=&loc_reparto=","","status=no");
}
function scandDBcallBack()
{
	//alert(document.dati.hIdenFarmaco.value);

	var sql ="insert into CC_ALLERTE_RICOVERO (TIPO,IDEN_VISITA,IDEN_FARMACO,IDEN_TERAPIA,UTE_INS) values ('AVVERSA',"+top.EXTERN.iden_visita.value+","+document.dati.hIdenFarmaco.value+",null,"+top.baseUser.IDEN_PER+")";

	dwr.engine.setAsync(false);
	dwrTerapie.execute(sql,callBack);
	dwr.engine.setAsync(true);

	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		//top.apriProblemiAllerte();
		document.location.replace(document.location);
		aggiornaWkAllerte();
	}
}
function aggiornaWkAllerte()
{
	//top.frameAllergie.location.replace("frameWkAllergie?iden_visita="+top.EXTERN.iden_visita.value);
	try{
	top.framePaziente.location.replace("servletGenerator?KEY_LEGAME=VISUALIZZA_CARTELLA_DETTAGLIO_PAZIENTE&idRemoto="+top.EXTERN.idRemoto.value+"&reparto="+top.EXTERN.reparto.value+"&ricovero="+top.EXTERN.ricovero.value+"&iden_visita="+top.EXTERN.iden_visita.value);
	top.frameAllergie.location.replace("frameWkAllergie?iden_visita="+top.EXTERN.iden_visita.value);
	}catch(e){}
}
function eliminaRecord(){
	alert(stringa_codici(array_iden))
	if (stringa_codici(array_iden)==undefined || stringa_codici(array_iden)=='')
	{
		alert("Selezionare un'allerta");
		return;
	}
	dwr.engine.setAsync(false);
	dwrAllerte.eliminaRecord(stringa_codici(array_iden),callBack);
	dwr.engine.setAsync(true);

	function callBack(resp){
		if (resp!='OK')
			alert(resp);
		else{
			//top.apriProblemiAllerte();
			document.location.replace(document.location);
			aggiornaWkAllerte();
		}
	}
}
*/
var WindowCartella = null;
var reparto = '';
var iden_visita = '';
var iden_anag = '';

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
    	NS_ALLERTE.init();
    	NS_ALLERTE.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

function chiudiScheda(){
	parent.$.fancybox.close();
}

function inserisciAllerta(){
    url="servletGenerator?KEY_LEGAME=PT_WRAPPER&TIPO_DATO=SCELTA_ALLERTE&RELOAD=frameWkAllerte&STATO_PAGINA=I&CODICE_REPARTO="+reparto+"&IDEN_VISITA="+iden_visita+"&STATO=I&SITO=ALLERTE";
    
    parent.$.fancybox({
        'padding'   : 3,
        'width'     : 1024,
        'height'    : 700,
        'href'      : url,
        'type'      : 'iframe',
        'onClosed'  : function() {
        	NS_ALLERTE.refresh();
        }
    });
}

function modificaAllerta(){
	
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
    var iden = stringa_codici(array_iden);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
    
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = top.clsDate.difference.hour(new Date(),top.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }

    if (iden==''){
        //controllo l'iden dell'allerta
        return alert('Attenzione! Nessuna allerta selezionata');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
       return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
       return alert('Attenzione! Utente di registrazione non trovato');
    }else if (parent.name == 'ANAMNESI') {
        if(ute_reg!=ute_log) {
        	//controllo sulla differenza degli utenti
            return alert("Attenzione! La modifica è consentita soltanto all'utente che ha inserito l'allerta.");
        }else if(ute_reg==ute_log && parseInt(difference)>12){
            //controllo sull'orario di registrazione in caso di utente autorizzato alla modifica
            return alert('Attenzione! La modifica è consentita solo entro 12 ore dalla registrazione');
        }
    }
	
	var key_legame=stringa_codici(array_key_legame);
	var url='servletGenerator?KEY_LEGAME=PT_WRAPPER&STATO_PAGINA=E&RELOAD=frameWkAllerte&KEY_PROCEDURA='+key_legame;
	url+='&IDEN_PROCEDURA=&IDEN_SCHEDA='+iden+'&SITO=ALLERTE&IDEN_VISITA='+iden_visita;
	url+='&TIPO_DATO=SCELTA_ALLERTE';

	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 700,
		'href'		: url,
		'type'		: 'iframe',
        'onClosed'  : function() {
        	NS_ALLERTE.refresh();
        }
	});
}

function visualizzaAllerta(){
	
	var iden=stringa_codici(array_iden);
	var key_legame=stringa_codici(array_key_legame);
	var url='servletGenerator?KEY_LEGAME=PT_WRAPPER&STATO_PAGINA=L&KEY_PROCEDURA='+key_legame;
	url+='&IDEN_PROCEDURA=&IDEN_SCHEDA='+iden+'&SITO=ALLERTE&IDEN_VISITA='+iden_visita;
	url+='&TIPO_DATO=SCELTA_ALLERTE';

	if (iden!=''){
		parent.$.fancybox({
			'padding'	: 3,
			'width'		: 1024,
			'height'	: 700,
			'href'		: url,
			'type'		: 'iframe',
	        'onClosed'  : function() {
	        	NS_ALLERTE.refresh();
	        }
		});
	}else{
		alert('Attenzione! Nessuna allerta selezionata');
	}
}

function rimuoviAllerta(){
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
    var iden = stringa_codici(array_iden);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
	
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = top.clsDate.difference.hour(new Date(),top.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }
	
    if (iden==''){
        //controllo l'iden dell'allerta
        return alert('Attenzione! Nessuna allerta selezionata');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
       return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
       return alert('Attenzione! Utente di registrazione non trovato');
    }
	
	if (stringa_codici(array_deleted)=="S"){
		return alert('L\'allerta selezionata è già stata cancellata');
	}

	if (!confirm('Si conferma la cancellazione dell\'allerta selezionata?')){
		return;
	}
	
	var pBinds = new Array();
	var visibile=parseInt(difference)<=12 ? 'N' : 'S';
	if (parent.name == 'ANAMNESI' && ute_reg!=ute_log && parseInt(difference)<=12) {
		visibile='S';
	}
	pBinds.push(iden);
	pBinds.push(baseUser.IDEN_PER);
	if (window.duplicaAllerte) pBinds.push(iden_visita, iden_anag); else pBinds.push(null, null);
	pBinds.push(visibile); // VISIBILE
	
    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('anamnesi.xml','cancellaAllerta',pBinds,0,callBack);
    WindowCartella.dwr.engine.setAsync(true);

	function callBack(resp){
		if(resp[0]=='KO'){
			alert(resp[1]);
		}
		else
		{
			NS_ALLERTE.refresh();
		}
	}
}

function visualizzaInfoAllerta() {
	var tipo = '';
	var data_ins = '';
	var data_canc = '';
	var descr_ute_ins = '';
	var descr_ute_canc = '';
	if (rigaSelezionataDalContextMenu==-1){
		tipo = stringa_codici(array_tipo);
		data_ins = stringa_codici(array_data_ins);
		data_canc = stringa_codici(array_data_canc);
		descr_ute_ins = stringa_codici(array_descr_ute_ins);
		descr_ute_canc = stringa_codici(array_descr_ute_canc);
	}
	else{
		tipo = array_tipo[rigaSelezionataDalContextMenu];
		data_ins = array_data_ins[rigaSelezionataDalContextMenu];
		data_canc = array_data_canc[rigaSelezionataDalContextMenu];
		descr_ute_ins = array_descr_ute_ins[rigaSelezionataDalContextMenu];
		descr_ute_canc = array_descr_ute_canc[rigaSelezionataDalContextMenu];
	}
	
	// Nasconde l'utente se l'allergia non è salvata nel ricovero
	try {
		if (parent["NS_"+parent.name].importaAllergieIdenPaziente != null) {
			data_ins = '';
			data_canc = '';
			descr_ute_ins = '';
			descr_ute_canc = '';
		}
	} catch(e) {}
	
	MsgBox("INFORMAZIONI "+tipo.replace(/[_]+/g, ' '), {"Utente inserimento:": descr_ute_ins, "Data inserimento:": data_ins, "Utente cancellazione:": descr_ute_canc, "Data cancellazione:": data_canc});
	
	function MsgBox(title, message) {
		WindowCartella.Popup.remove();
		
		var vObj = $('<table/>');//.css("font-size","12px")
		
		if (typeof message === 'string') {
			vObj = vObj.append($('<tr/>').append($('<td/>').text(message)));
		} else if (typeof message === 'object') { 
			for (var m in message) {
				vObj = vObj.append($('<tr/>')
					.append($('<td/>').text(m))
					.append($('<td/>').text(message[m]))
				);
			}
		}

		WindowCartella.Popup.append({
			obj:vObj,
			title: title,
			position: null
		});
	}
}

function setRiga(obj){
	if(typeof obj =='undefined') obj = event.srcElement;

	while(obj.nodeName.toUpperCase() != 'TR'){
		obj = obj.parentNode;
	}
	rigaSelezionataDalContextMenu = obj.sectionRowIndex;
	return rigaSelezionataDalContextMenu;
}

var NS_ALLERTE = {
    init: function() {
	    var vDati =  WindowCartella.getForm(document);
	    reparto = vDati.reparto;
	    iden_visita = vDati.iden_visita;
	    iden_anag = vDati.iden_anag;
    },
    
    setEvents: function() {
	    // Imposta l'azione sul doppio click
	    if (typeof apriChiudiInfoReferto === "undefined") {
    		apriChiudiInfoReferto = function() {return visualizzaAllerta.apply(this, []);};
	    }
	    
	    // Segnala all'utente le allerte cancellate
	    if (typeof array_deleted === 'object') {
		    for (var i=0; i<array_deleted.length; i++) {
		    	if (array_deleted[i] == 'S') {
		    		$('tr#idRow0_'+i).css({"text-decoration":"line-through","color":"gray"});
		    		$('tr#idRow0_'+i).attr("data-deleted", "S");
		    	} else {
		    		$('tr#idRow0_'+i).attr("data-deleted", "N");
		    	}
		    }
	    }
	    $('td[name=WK_ALLERTE_INFO]').attr("title", "").css("cursor", "pointer");
	    try { window.duplicaAllerte = parent["NS_"+parent.name].importaAllergieIdenPaziente === Number(iden_anag); } catch (e) {}
    },
		
	refresh: function() {
	    try {
	        // alert("refresh() -> parent.NS_ANAMNESI.getUrlWkAllerte()");
	    	/* Controllo che tutte le allerte siano caricate in worklist */
	        //NS_ALLERTE.listProcessingAlerts();  
	        
	    	// ANAMNESI, 36_SETTIMANA, QUESTIONARIO_ANAMNESTICO
	    	document.location.replace(parent["NS_"+parent.name].getUrlWkAllerte());
	    } catch(e) {
	        // alert("refresh() -> document.location.reload()");
	        document.location.reload();
	    }
    },
    
    /**
     * @deprecata
     * Funzione per l'inserimento/aggiornamento in worklist dell'allerta appena registrata/modificata su DB.
     * Per ottenere il record inserito viene preso quello con max(iden) ed ute_ins dell'utente loggato
     * (escamotage per recuperare il "NOSTRO" record aggiunto)
     * 
     */
    listProcessingAlerts : function() {
//        alert("NS_FUNCTIONS_ALERTS.listProcessingAlerts()");

        //alert(parent.$('#hArrayAllergie').val());
        var listAlertsRecordedHistory = parent.$('#hArrayAllergie').val();
        var split = listAlertsRecordedHistory.split(",");
        var listAlertInsertedHistory = "";
        
        //alert(parent.document.EXTERN.IDEN_ANAG.value);
        var rs = WindowCartella.executeQuery('anamnesi.xml', 'listAlerts', [parent.document.EXTERN.IDEN_ANAG.value, baseUser.IDEN_PER]);
        
//        if (rs.next()) {
//            if (rs.getString('IDEN') != null && rs.getString('IDEN') != 'undefined') {
//                listAlertInsertedHistory += "," + rs.getString('IDEN');
//            }
//        }
        
        while (rs.next()) {
            var found = false;
            var i = 0;
            
            while (i < split.length && !found) {
                if (split[i] == rs.getString('IDEN')) {found = true;} 
                else {i++;}
            }
            
            if (!found) {listAlertInsertedHistory =  rs.getString('IDEN');}
        }            

//        alert("Allerte vecchie: " + listAlertsRecordedHistory);
//        alert("Allerte nuove: " + listAlertInsertedHistory);
        parent.$('#hArrayAllergie').val((listAlertsRecordedHistory==''?'':listAlertsRecordedHistory+',') + listAlertInsertedHistory);        
    }
};