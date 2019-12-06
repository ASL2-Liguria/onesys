var WindowCartella = null;
var reparto = '';
var iden_visita = '';
var iden_anag = '';

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
    	NS_INTERVENTI.init();
        NS_INTERVENTI.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

//funzione che serve per l'inserimento di un intervento dalla pagina di anamnesi
function inserisciIntervento(){
	var iden_visita=parent.document.EXTERN.IDEN_VISITA.value;
	var idenVisStorico=parent.document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value;
	
	/* @deprecato
	if ($('#hIdenVisitaStorico',parent.document).val()==''){
		call_get_iden_visita_storico(parent.document.EXTERN.IDEN_ANAG.value,response_storico);
	}else{
		idenVisStorico=$('#hIdenVisitaStorico',parent.document).val();
	}
	
	function response_storico(risp){
		$('#hIdenVisitaStorico',parent.document).val(risp);
		idenVisStorico=risp;
	}*/
	
	var url='servletGenerator?KEY_LEGAME=PAG_INS_INTERVENTI&IDEN=&IDEN_VIS_STORICO='+idenVisStorico;
		url+='&IDEN_VISITA='+iden_visita;
	
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 342,
		'href'		: url,
		'type'		: 'iframe',
		'onClosed': function() {
			NS_INTERVENTI.refresh();
		}
	});
}

//funzione che permette di modificare, se possibile, l'intervento selezionato
function modificaIntervento(readOnly){
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
	var idenVisStorico=parent.document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value;//$('#hIdenVisitaStorico',parent.document).val();
    var iden = stringa_codici(array_iden);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
	var arrivato_da=stringa_codici(array_arrivato_da).toUpperCase();
    
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = top.clsDate.difference.hour(new Date(),top.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }
	
    if (iden==''){
        //controllo l'iden dell'intervento
        return alert('Attenzione! Nessun intervento selezionato');
    }else if (arrivato_da != 'INTERFACCIA') {
		return alert('L\'intervento selezionato non può essere '+(readOnly ? 'visualizzato' : 'modificato')+' da interfaccia');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
        return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
        return alert('Attenzione! Utente di registrazione non trovato');
	}else if (!readOnly && parent.name == 'ANAMNESI') {
        if(ute_reg!=ute_log && arrivato_da == 'INTERFACCIA') {
        	//controllo sulla differenza degli utenti
            return alert("Attenzione! La modifica è consentita soltanto all'utente che ha inserito l'intervento.");
        }else if(ute_reg==ute_log && parseInt(difference)>12){
            //controllo sull'orario di registrazione in caso di utente autorizzato alla modifica
            return alert('Attenzione! La modifica è consentita solo entro 12 ore dalla registrazione');
        }
    }
    
	var url='servletGenerator?KEY_LEGAME=PAG_INS_INTERVENTI';
	url+='&IDEN='+iden;
	url+='&IDEN_VIS_STORICO='+idenVisStorico;
	url+='&IDEN_VISITA='+iden_visita;
	url+=(readOnly ? '&LETTURA=S' : '');
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 400,
		'href'		: url,
		'type'		: 'iframe',
		'onClosed': function() {
			NS_INTERVENTI.refresh();
		}
	});
}

function visualizzaIntervento(){
	modificaIntervento(true/* readOnly*/);
}

function cancellaIntervento() {
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
    var iden = stringa_codici(array_iden);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
	var arrivato_da=stringa_codici(array_arrivato_da).toUpperCase();
    
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = top.clsDate.difference.hour(new Date(),top.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }
	
    if (iden==''){
        //controllo l'iden dell'intervento
        return alert('Attenzione! Nessun intervento selezionato');
    }else if (arrivato_da != 'INTERFACCIA') {
		return alert('L\'intervento selezionato non può essere cancellato da interfaccia');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
        return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
        return alert('Attenzione! Utente di registrazione non trovato');
	}
	if (!confirm('Si conferma la cancellazione dell\'intervento selezionato?')){
		return;
	}
	
	var pBinds = new Array();
	var visibile=parseInt(difference)<=12 ? 'N' : 'S';
	if (parent.name == 'ANAMNESI' && ute_reg!=ute_log && parseInt(difference)<=12) {
		visibile='S';
	}
	pBinds.push(iden);
	pBinds.push(baseUser.IDEN_PER);
	if (window.duplicaInterventi) pBinds.push(iden_visita, iden_anag); else pBinds.push(null, null);
	pBinds.push(visibile); // VISIBILE
	
    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('anamnesi.xml','cancellaIntervento',pBinds,0,callBack);
    WindowCartella.dwr.engine.setAsync(true);

	function callBack(resp){
		if(resp[0]=='KO'){
			alert(resp[1]);
		}
		else
		{
			NS_INTERVENTI.refresh();
		}
	}
}

// @deprecata
function call_get_iden_visita_storico(in_iden_anag,call_back)
{
	//alert('call_get...');

	sql = "{call ? := RADSQL.GET_IDEN_VISITA_STORICO('" + in_iden_anag + "') }";
	
	dwr.engine.setAsync(false);
	toolKitDB.executeFunctionData(sql, call_back);
	dwr.engine.setAsync(true);
}

function visualizzaInfoPopup() {
	var data_ins = '';
	var data_canc = '';
	var descr_ute_ins = '';
	var descr_ute_canc = '';
	if (rigaSelezionataDalContextMenu==-1){
		data_ins = stringa_codici(array_data_ins);
		data_canc = stringa_codici(array_data_canc);
		descr_ute_ins = stringa_codici(array_descr_ute_ins);
		descr_ute_canc = stringa_codici(array_descr_ute_canc);
	}
	else{
		data_ins = array_data_ins[rigaSelezionataDalContextMenu];
		data_canc = array_data_canc[rigaSelezionataDalContextMenu];
		descr_ute_ins = array_descr_ute_ins[rigaSelezionataDalContextMenu];
		descr_ute_canc = array_descr_ute_canc[rigaSelezionataDalContextMenu];
	}
	
	// Nasconde l'utente se l'intervento non è salvato nel ricovero
	try {
		if (parent["NS_"+parent.name].importaInterventiIdenPaziente != null) {
			data_ins = '';
			data_canc = '';
			descr_ute_ins = '';
			descr_ute_canc = '';
		}
	} catch(e) {}
	
	MsgBox("INFORMAZIONI INTERVENTO", {"Utente inserimento:": descr_ute_ins, "Data inserimento:": data_ins, "Utente cancellazione:": descr_ute_canc, "Data cancellazione:": data_canc});
	
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

var NS_INTERVENTI = {
    init: function() {
        var vDati =  WindowCartella.getForm(document);
        reparto = vDati.reparto;
        iden_visita = vDati.iden_visita;
        iden_anag = vDati.iden_anag;
    },
    
    setEvents: function() {
	    // Imposta l'azione sul doppio click
	    if (typeof apriChiudiInfoReferto === "undefined") {
	    	apriChiudiInfoReferto = function() {return visualizzaIntervento.apply(this, []);};
	    }
    	
        // Segnala all'utente gli interventi cancellati
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
        $('td[name=WK_INTER_INFO]').attr("title", "").css("cursor", "pointer");
        try { window.duplicaInterventi = parent["NS_"+parent.name].importaInterventiIdenPaziente === Number(iden_anag); } catch (e) {}
    },
		
	refresh: function() {
	    try {
	    	// ANAMNESI, 36_SETTIMANA
	        document.location.replace(parent["NS_"+parent.name].getUrlWkInterventi());
	    } catch(e) {
	        // alert("refresh() -> document.location.reload()");
	        document.location.reload();
	    }
    }
};
