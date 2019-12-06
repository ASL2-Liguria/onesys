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
    	NS_PATOLOGIE.init();
    	NS_PATOLOGIE.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

//funzione che serve per l'inserimento di una patologia dalla pagina di anamnesi
function inserisciPatologia() {
	var url = "servletGenerator?KEY_LEGAME=SCELTA_PATOLOGIE";
	url+="&IDEN_VISITA="+WindowCartella.getAccesso('IDEN');
	url+='&IDEN_ANAG='+WindowCartella.getPaziente('IDEN');
	url+="&IMPORTA_PATOLOGIE="+(window.duplicaPatologie ? 'S' : 'N');
    parent.$.fancybox({
        'padding': 3,
        'width': 1024,
        'height': 580,
        'href': url,
        'type': 'iframe',
		'onClosed': function() {
			NS_PATOLOGIE.refresh();
		}
    });
}

//funzione che permette di modificare, se possibile, la patologia selezionata
function modificaPatologia(readOnly) {
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
    var iden = stringa_codici(array_iden);
    var cod_patologia = stringa_codici(array_cod_patologia);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
    
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = WindowCartella.clsDate.difference.hour(new Date(),WindowCartella.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }
	
    if (iden==''){
        //controllo l'iden della patologia
        return alert('Attenzione! Nessuna patologia selezionata');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
        return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
        return alert('Attenzione! Utente di registrazione non trovato');
	}else if (!readOnly && parent.name == 'ANAMNESI') {
        if(ute_reg!=ute_log) {
        	//controllo sulla differenza degli utenti
            return alert("Attenzione! La modifica è consentita soltanto all'utente che ha inserito la patologia.");
        }else if(ute_reg==ute_log && parseInt(difference)>12){
            //controllo sull'orario di registrazione in caso di utente autorizzato alla modifica
            return alert('Attenzione! La modifica è consentita solo entro 12 ore dalla registrazione');
        }
    }
    
	var url = 'servletGenerator?KEY_LEGAME=SCELTA_PATOLOGIE';
	url+='&IDEN='+iden;
	url+='&IDEN_ANAG='+WindowCartella.getPaziente('IDEN');
	url+='&IDEN_VISITA='+iden_visita;
	url+='&COD_PATOLOGIA='+cod_patologia;
	url+="&IMPORTA_PATOLOGIE="+(window.duplicaPatologie ? 'S' : 'N');
	url+='&READONLY='+readOnly;
    parent.$.fancybox({
        'padding' : 3,
        'width'   : 1024,
        'height'  : 580,
        'href'    : url,
        'type'    : 'iframe',
		'onClosed': function() {
			NS_PATOLOGIE.refresh();
		}
    });
}

function visualizzaPatologia() {
	modificaPatologia(true/* readOnly*/);
}

function cancellaPatologia() {
    var ute_log = WindowCartella.baseUser.IDEN_PER;
    var iden_visita = stringa_codici(array_iden_visita);
    var iden = stringa_codici(array_iden);
    var ute_reg = stringa_codici(array_ute_ins);
    var data_reg = stringa_codici(array_data_ins).slice(0, 10);
    var ora_reg = stringa_codici(array_data_ins).slice(11, 16);
    
    //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    var difference = 0;
    if(data_reg!='' && ora_reg != ''){
        difference = WindowCartella.clsDate.difference.hour(new Date(),WindowCartella.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    }
	
    if (iden==''){
        //controllo l'iden della patologia
        return alert('Attenzione! Nessuna patologia selezionata');
    }else if(ute_log=='') {
        //controllo l'utente che ha effettuato l'accesso
        return alert('Attenzione! Utente corrente non trovato');
    }else if(ute_reg=='') {
        //controllo l'utente che ha effettuato la registrazione
        return alert('Attenzione! Utente di registrazione non trovato');
	}
	if (!confirm('Si conferma la cancellazione della patologia selezionata?')){
		return;
	}
	
	var pBinds = new Array();
	var visibile=parseInt(difference)<=12 ? 'N' : 'S';
	if (parent.name == 'ANAMNESI' && ute_reg!=ute_log && parseInt(difference)<=12) {
		visibile='S';
	}
	pBinds.push(iden);
	pBinds.push(baseUser.IDEN_PER);
	if (window.duplicaPatologie) pBinds.push(iden_visita, iden_anag); else pBinds.push(null, null);
	pBinds.push(visibile); // VISIBILE
	
    WindowCartella.dwr.engine.setAsync(false);
    WindowCartella.dwrUtility.executeStatement('anamnesi.xml','cancellaPatologia',pBinds,0,callBack);
    WindowCartella.dwr.engine.setAsync(true);

	function callBack(resp){
		if(resp[0]=='KO'){
			alert(resp[1]);
		}
		else
		{
			NS_PATOLOGIE.refresh();
		}
	}
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
	
	// Nasconde l'utente se la patologia non è salvata nel ricovero
	try {
		if (parent["NS_"+parent.name].importaPatologieIdenPaziente != null) {
			data_ins = '';
			data_canc = '';
			descr_ute_ins = '';
			descr_ute_canc = '';
		}
	} catch(e) {}
	
	MsgBox("INFORMAZIONI PATOLOGIA", {"Utente inserimento:": descr_ute_ins, "Data inserimento:": data_ins, "Utente cancellazione:": descr_ute_canc, "Data cancellazione:": data_canc});
	
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

var NS_PATOLOGIE = {
	popup: new parent.POPUP({'url': "modalUtility/ModificaInput.html", 'width': 350, 'height': 100/*, 'mode': "openModalDialog"*/}),
	
    init: function() {
        var vDati =  WindowCartella.getForm(document);
        reparto = vDati.reparto;
        iden_visita = vDati.iden_visita;
        iden_anag = vDati.iden_anag;
    },
    
    setEvents: function() {   	
	    // Imposta l'azione sul doppio click
	    if (typeof apriChiudiInfoReferto === "undefined") {
	    	apriChiudiInfoReferto = function() {return visualizzaPatologia.apply(this, []);};
	    }
    	
        // Segnala all'utente le patologie cancellate
        if (typeof array_deleted === 'object') {
    	    for (var i=0; i<array_deleted.length; i++) {
    	    	
    	        var ute_log = WindowCartella.baseUser.IDEN_PER;
    	        var ute_reg = array_ute_ins[i];
    	        var data_reg = array_data_ins[i].slice(0, 10);
    	        var ora_reg = array_data_ins[i].slice(11, 16);
    	        
    	        //valorizzo le ore di differenza tra la data odierna e la data di registrazione.
    	        var difference = 0;
    	        if(data_reg!='' && ora_reg != ''){
    	            difference = WindowCartella.clsDate.difference.hour(new Date(),WindowCartella.clsDate.str2date(data_reg,'DD/MM/YYYY',ora_reg));
    	        }
    	    	
    	    	if (array_deleted[i] == 'S') {
    	    		$('tr#idRow0_'+i).css({"text-decoration":"line-through","color":"gray"});
    	    		$('tr#idRow0_'+i).attr("data-deleted", "S");
    	    	} else if (parent.name == 'ANAMNESI' && (ute_reg!=ute_log || (ute_reg==ute_log && parseInt(difference)>12))) {
    	    		$('tr#idRow0_'+i).attr("data-deleted", "N");
    	    	} else {
    	    		// campi modificabili
    	    		$('tr#idRow0_'+i).attr("data-deleted", "N");
    	    		var anno = $('tr#idRow0_'+i+' td[name=WK_PATOLOGIE_ANNO] div');
    	    		var note = $('tr#idRow0_'+i+' td[name=WK_PATOLOGIE_NOTE] div');
    	    		anno.html('<input name="txtAnno" readonly="readonly" type="text" maxlength="100" style="cursor:pointer;width:100%"/ value="' + anno.text() + '" onkeyup="NS_PATOLOGIE.modificaPato(this, '+array_iden[i]+');" onclick="NS_PATOLOGIE.modificaPato(this, '+array_iden[i]+');">');
    	    		note.html('<input name="txtNote" readonly="readonly" type="text" maxlength="100" style="cursor:pointer;width:100%"/ value="' + note.text() + '" onkeyup="NS_PATOLOGIE.modificaPato(this, '+array_iden[i]+');" onclick="NS_PATOLOGIE.modificaPato(this, '+array_iden[i]+');">');
        	    	//$('tr#idRow0_'+i+' td div').addClass("patologieScelte").attr({"valore":array_cod_patologia[i], "indice":"1"});
    	    	}
    	    }
        }
        $('td[name=WK_PATOLOGIE_INFO]').attr("title", "").css("cursor", "pointer");
        try { window.duplicaPatologie = parent["NS_"+parent.name].importaPatologieIdenPaziente === Number(iden_anag); } catch (e) {}
    },
		
	refresh: function() {
		WindowCartella.CartellaPaziente.refresh.avvertenze.paziente();
	    try {
	    	// ANAMNESI
	        document.location.replace(parent["NS_"+parent.name].getUrlWkPatologie());
	    } catch(e) {
	        // alert("refresh() -> document.location.reload()");
	        document.location.reload();
	    }
    },
    
    modificaPato: function(campo, iden) {
    	var callback = function(value) {
	    	if (value != null && typeof value === "string" && value != campo.value) { 
	    		// Salvo il valore come attributo
	    		var anno = campo.getAttribute("name") == 'txtAnno' ? value : $(campo.parentElement.parentElement.parentElement).find('input[name=txtAnno]').val();
	    		var note = campo.getAttribute("name") == 'txtNote' ? value : $(campo.parentElement.parentElement.parentElement).find('input[name=txtNote]').val();
	    		var rs = WindowCartella.executeStatement("anamnesi.xml","modificaDettagliPatologia",[anno.HTMLencode(), note.HTMLencode(), Number(iden)]);
				if (rs[0]=='KO') return alert(rs[1]);
	    		campo.value = value;
	    	}
    	};
    	
    	var title = "";
    	switch (campo.getAttribute("name")) {
    	case "txtAnno" : title = "Anno"; break;
    	case "txtNote" : title = "Note"; break;
    	default: "";
    	}
    	
    	NS_PATOLOGIE.popup.openDialog(callback, title, 'E', campo.value);
    }
};
