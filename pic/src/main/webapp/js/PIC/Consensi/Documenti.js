var NS_DOCUMENTI = {

    init: function() {
        /* Carico le variabili EXTERN */
        NS_FUNCTIONS.loadExtern();   
        /* Se non ho l'iden dell'anagrafica chiamo la funzione gestAnag che me lo recupera */
        if (_PATIENT_ID == null) {
            NS_FUNCTIONS.gestAnag();
            /* Ricarico la pagina con la url completa */
            NS_FUNCTIONS.url.params.load();
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('PATIENT_ID', _PATIENT_ID);
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('ASSIGNING_AUTHORITY', home.baseGlobal.ASSIGNING_AUTHORITY);
            /*** alert(location.origin + location.pathname + _URL_PARAMS); ***/
            /*** alert("location.hash: " + location.hash + 
                    "\nlocation.host: "	+ location.host +
                    "\nlocation.hostname: "	+ location.hostname + 
                    "\nlocation.href: " + location.href + 
                    "\nlocation.origin: " + location.origin +
                    "\nlocation.pathname: " + location.pathname + 
                    "\nlocation.port: " + location.port +
                    "\nlocation.protocol: " + location.protocol + 
                    "\nlocation.search: " + location.search); ***/
            location.href = location.protocol + "//" + location.host + location.pathname + _URL_PARAMS;
        }else{
        
        	var titolare = LIB.isValid($("#TITOLARE_TRATTAMENTO").val()) ? $("#TITOLARE_TRATTAMENTO").val() : NS_FUNCTIONS.getTitolareTrattamentoDefault();
	        var ConsensoValues = NS_FUNCTIONS.getvalueConsensoUnico($("#PATIENT_ID").val(), 'CONSENSO_UNICO', titolare);
	        
	        if(ConsensoValues[0].INTEGRAZIONE_FUTURA !== 'S'){
	        	$(".butSalva, .butOscura, .butAttiva").hide();
	        	home.NOTIFICA.warning({message: "ATTENZIONE: Non è possibile indicare l'oscuramento a DSE dei documenti dal momento che il paziente NON ha autorizzato l'alimentazione del proprio Dossier Sanitario Elettronico", timeout: 10, title: "WARNING"});
	        }
        }
        
        NS_FUNCTIONS.loadHideParams();
        NS_DOCUMENTI.hideAllWk();
        NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_' + _TIPO});
        
        NS_DOCUMENTI.wkDocumentiInespressi = null;
        home.NS_DOCUMENTI = this;
        
        /*** Nascondo il tab della dichiarazione sostitutiva ***/
        $("#li-tabDichiarazioneSostitutiva").hide();
    },
    setEvents: function() {
        switch (_ACTION) {
	        case 'ESPRIMI':
	            /* Modalit� di attivamento del documento */
	        	$(".butSalva, .butOscura, .butAttiva").hide();
	        	$("#fldListaDocumenti legend").text('Lista Documenti su cui non è stato ancora espresso il consenso');
	            NS_DOCUMENTI.showWkDocumentiInespressi();
	            break;           
            case 'ATTIVA':
                /* Modalit� di attivamento del documento */
            	$(".butSalva, .butOscura").hide();
            	$("#fldListaDocumenti legend").text('Lista Documenti OSCURATI');
            	$(".butAttiva").on("click", function(){ NS_FENIX_SCHEDA.registra() });
                NS_FENIX_SCHEDA.registra = NS_DOCUMENTI.attiva.registra;
                NS_DOCUMENTI.showWkDocumentiOscurati();
                break;            
            case 'OSCURA':
                /* Modalit� di oscuramento del documento */
            	$(".butSalva, .butAttiva").hide();
            	$("#fldListaDocumenti legend").text('Lista Documenti ATTIVATI');
            	$(".butOscura").on("click", function(){ NS_FENIX_SCHEDA.registra() });
                NS_FENIX_SCHEDA.registra = NS_DOCUMENTI.oscura.registra;
                NS_DOCUMENTI.showWkDocumentiAttivati();
                break;
            default:
                /* Azione sconosciuta */

            	home.NOTIFICA.error({
                    message	: "UNKNOWN ACTION: " + _ACTION,
                    title	: "Errore!"
                });
                NS_FENIX_SCHEDA.chiudi();
        }
    },
    
    checkDicSost: function() {
    	
    	if (radTipoSostitutoDichiarante.val() == '' 
    		&& ( $("#txtSostitutoNomeCognome").val() != '' 
    			|| $("#txtSostitutoLuogoNascita").val() != '' 
    				|| $("#txtSostitutoDataNascita").val() != ''
    					|| $("#txtSostitutoResidente").val() != ''
    						|| $("#txtSostitutoDocumentoIdentita").val() != '') ){

            home.NOTIFICA.warning({
                message	: "Scegliere un'opzione per il campo 'dichiara sotto la propria responsabilità di' !",
                title	: "Attenzione!"
            });
        	return false;    		
    	}
        
        if (radTipoSostitutoDichiarante.val() != '' && !NS_DOCUMENTI.checkCampiDicSost()){

            home.NOTIFICA.warning({
                message	: "Controllare che i campi 'sottoscritto' e 'nato a' nella dichiarazione sostitutiva siano compilati!",
                title	: "Attenzione!"
            });
        	return false;
        }
    	return true;
    },
    
    checkCampiDicSost: function() {
    	if($("#txtSostitutoNomeCognome").val() == ''){
    		return false;
    	}
    	if($("#txtSostitutoLuogoNascita").val() == ''){
    		return false;
    	}
    	return true;
    },
    
    listaVuotaNotify: function() {
        home.NOTIFICA.warning({
            message	: "Controllare di aver selezionato almeno un documento!",
            title	: "Attenzione!"
        });
    	return false;
    },
    
    attiva: {
        registra: function(params) {
            /* Valido i campi */
            if (!NS_FENIX_SCHEDA.validateFields()) {
                return false;
            }

            if (!NS_DOCUMENTI.checkDicSost()){ return false; };
            
            /* Carico la lista dei documenti oscurati selezionati */
            NS_DOCUMENTI.loadListaDocumentiOscurati();
            /* Attivo i documenti oscurati selezionati */
            _LISTA_DOCUMENTI_OSCURATI != '' ? NS_FUNCTIONS.documento.attiva(true) : NS_DOCUMENTI.listaVuotaNotify();
        }
    },
    
    hideAllWk: function() {
        NS_DOCUMENTI.hideWkDocumenti();
    },
    
    hideWkDocumenti: function() {
        $("#divWkDocumentiAttivati").hide();
        $("#divWkDocumentiOscurati").hide();
        $("#divWkDocumentiInespressi").hide();
    },
    
    loadListaDocumentiAttivati: function() {
        _LISTA_DOCUMENTI_ATTIVATI = '';

        $("#divWkDocumentiAttivati .clsWk .clsWkScroll table tr").each(function(i) {
		//$("#divWkDocumentiAttivati table.clsAlterna tr").each(function(i) {
            var row = NS_FUNCTIONS.wkDocumentiAttivati.getRow(i);
            if ($(this).hasClass('rowSel clsSel')) {
                _LISTA_DOCUMENTI_ATTIVATI = _LISTA_DOCUMENTI_ATTIVATI == '' ? row.ID : _LISTA_DOCUMENTI_ATTIVATI + "#" + row.ID;
            }
        });
    },
    
    loadListaDocumentiOscurati: function() {
        _LISTA_DOCUMENTI_OSCURATI = '';

		$("#divWkDocumentiOscurati .clsWk .clsWkScroll table tr").each(function(i) {
        //$("#divWkDocumentiOscurati table.clsAlterna tr").each(function(i) {
            var row = NS_FUNCTIONS.wkDocumentiOscurati.getRow(i);
            if ($(this).hasClass('rowSel clsSel')) {
                _LISTA_DOCUMENTI_OSCURATI = _LISTA_DOCUMENTI_OSCURATI == '' ? row.ID : _LISTA_DOCUMENTI_OSCURATI + "#" + row.ID;
            }
        });
    },
    
    oscura: {
        registra: function(params) {
            /* Valido i campi */
            if (!NS_FENIX_SCHEDA.validateFields()) {
                return false;
            }

            if (!NS_DOCUMENTI.checkDicSost()){ return false; };

            /* Carico la lista dei documenti attivati selezionati */
            NS_DOCUMENTI.loadListaDocumentiAttivati();
            /* Oscuro i documenti attivati selezionati */
            _LISTA_DOCUMENTI_ATTIVATI != '' ? NS_FUNCTIONS.documento.oscura(true) : NS_DOCUMENTI.listaVuotaNotify();
            ;
        }
    },
    
    showWkDocumentiAttivati: function() {
        if (!NS_FUNCTIONS.wkDocumentiAttivati) {
            $("div#divWkDocumentiAttivati").height("500px");
            NS_FUNCTIONS.wkDocumentiAttivati = new WK({
                id: "RICERCA_DOCUMENTI_ATTIVATI",
                container: "divWkDocumentiAttivati",
                aBind: ['codice_fiscale'],
                aVal: [_CODICE_FISCALE]
            });
            NS_FUNCTIONS.wkDocumentiAttivati.loadWk();
        }

        $("#divWkDocumentiAttivati").show();
    },
    
    showWkDocumentiOscurati: function() {
        if (!NS_FUNCTIONS.wkDocumentiOscurati) {
            $("div#divWkDocumentiOscurati").height("500px");
            NS_FUNCTIONS.wkDocumentiOscurati = new WK({
                id: "RICERCA_DOCUMENTI_OSCURATI",
                container: "divWkDocumentiOscurati",
                aBind: ['codice_fiscale'],
                aVal: [_CODICE_FISCALE]
            });
            NS_FUNCTIONS.wkDocumentiOscurati.loadWk();
        }

        $("#divWkDocumentiOscurati").show();
    },      
    
    showWkDocumentiInespressi: function() {
        if (!NS_DOCUMENTI.wkDocumentiInespressi) {
            $("div#divWkDocumentiInespressi").height("500px");
            NS_DOCUMENTI.wkDocumentiInespressi = new WK({
                id: "RICERCA_DOCUMENTI_INESPRESSI",
                container: "divWkDocumentiInespressi",
                aBind: ['codice_fiscale'],
                aVal: [_CODICE_FISCALE]
            });
            NS_DOCUMENTI.wkDocumentiInespressi.loadWk();
        }

        $("#divWkDocumentiInespressi").show();
    },

    apriConsensoDoc: function(rec){

    	var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_DOCUMENTO';
        url += '&ASSIGNING_AUTHORITY=' 	+ home.baseGlobal.ASSIGNING_AUTHORITY;
        url += '&PATIENT_ID=' 			+ _PATIENT_ID;
        url += '&CODICE_FISCALE=' 		+ _CODICE_FISCALE;
        url += '&LOGOUT_ON_CLOSE=' 		+ 'N';
        url += '&ID_DOCUMENTO=' 		+ rec[0].ID;
        url += '&WK_REFRESH='			+'true';

        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
    },
};

$(document).ready(function() {
    try {
        NS_DOCUMENTI.init();
        NS_DOCUMENTI.setEvents();
        home.NS_LOADING.hideLoading();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});