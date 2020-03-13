var NS_EVENTI = {
    /*wkEventiAccessoPsAttivati: null,
    wkEventiCartellaAmbAttivati: null,
    wkEventiRicoveroAttivati: null,
    wkEventiAccessoPsOscurati: null,
    wkEventiCartellaAmbOscurati: null,
    wkEventiRicoveroOscurati: null,    */
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
	        	home.NOTIFICA.warning({message: "ATTENZIONE: Non è possibile indicare l'oscuramento a DSE degli eventi dal momento che il paziente NON ha autorizzato l'alimentazione del proprio Dossier Sanitario Elettronico", timeout: 10, title: "WARNING"});
	        }
        }

        NS_FUNCTIONS.loadHideParams();
        NS_EVENTI.hideAllWk();
        NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_' + _TIPO});
        
        home.NS_EVENTI = this;
        
        /*** Nascondo il tab della dichiarazione sostitutiva ***/
        $("#li-tabDichiarazioneSostitutiva").hide();
    },
    
    setEvents: function() {
        switch (_ACTION) {
	        case 'ESPRIMI':
	            /* Modalit� di attivamento dell'evento */
	        	$(".butSalva, .butAttiva, .butOscura").hide();
	        	$("#fldListaEventi legend").text('Lista Eventi su cui non è stato ancora espresso il consenso');
//	        	$(".butAttiva").on("click", function(){ NS_FENIX_SCHEDA.registra() });
//	            NS_FENIX_SCHEDA.registra = NS_EVENTI.attiva.registra;
	            $("<div id='divListaEventi'><select id='selectListaEventi'><option value='0'></option><option value='1'>Accesso Pronto Soccorso</option>"+/*"<option value='2'>Cartella Ambulatoriale</option>"*/"<option value='3'>Ricovero</option></select></div>").insertBefore("div#divWkEventiAccessoPsOscurati");                
	            $("#selectListaEventi").change(function() {
	                switch ($("#selectListaEventi option:selected").val()) {
	                    case '1':
	                        NS_EVENTI.showWkEventiAccessoPsInespressi();
	                        break;
	                    case '2':
	                        NS_EVENTI.showWkEventiCartellaAmbInespressi();
	                        break;
	                    case '3':
	                        NS_EVENTI.showWkEventiRicoveroInespressi();
	                        break;                            
	                    default:
	                        NS_EVENTI.hideWkEventiInespressi();
	                        break;                            
	                }
	            });
	            /*** $("#selectListaEventi").val('3'); // se volessimo far partire il select con una scelta gia' selezionata
	            NS_EVENTI.showWkEventiRicoveroOscurati(); ***/
	            break;
            case 'ATTIVA':
                /* Modalit� di attivamento dell'evento */
            	$(".butSalva, .butOscura").hide();
            	$("#fldListaEventi legend").text('Lista Eventi OSCURATI');
            	$(".butAttiva").on("click", function(){ NS_FENIX_SCHEDA.registra() });
                NS_FENIX_SCHEDA.registra = NS_EVENTI.attiva.registra;
                $("<div id='divListaEventi'><select id='selectListaEventi'><option value='0'></option><option value='1'>Accesso Pronto Soccorso</option>"+/*"<option value='2'>Cartella Ambulatoriale</option>"*/"<option value='3'>Ricovero</option></select></div>").insertBefore("div#divWkEventiAccessoPsOscurati");                
                $("#selectListaEventi").change(function() {
                    switch ($("#selectListaEventi option:selected").val()) {
                        case '1':
                            NS_EVENTI.showWkEventiAccessoPsOscurati();
                            break;
                        case '2':
                            NS_EVENTI.showWkEventiCartellaAmbOscurati();
                            break;
                        case '3':
                            NS_EVENTI.showWkEventiRicoveroOscurati();
                            break;                            
                        default:
                            NS_EVENTI.hideWkEventiOscurati();
                            break;                            
                    }
                });
                /*** $("#selectListaEventi").val('3'); // se volessimo far partire il select con una scelta gia' selezionata
                NS_EVENTI.showWkEventiRicoveroOscurati(); ***/
                break;
            case 'OSCURA':
                /* Modalit� di oscuramento dell'evento */
            	$(".butSalva, .butAttiva").hide();
            	$("#fldListaEventi legend").text('Lista Eventi ATTIVATI');
            	$(".butOscura").on("click", function(){ NS_FENIX_SCHEDA.registra() });
                NS_FENIX_SCHEDA.registra = NS_EVENTI.oscura.registra;
                $("<div id='divListaEventi'><select id='selectListaEventi'><option value='0'></option><option value='1'>Accesso Pronto Soccorso</option>"+/*"<option value='2'>Cartella Ambulatoriale</option>"*/"<option value='3'>Ricovero</option></select></div>").insertBefore("div#divWkEventiAccessoPsAttivati");                
                $("#selectListaEventi").change(function() {
                    switch ($("#selectListaEventi option:selected").val()) {
                        case '1':
                            NS_EVENTI.showWkEventiAccessoPsAttivati();
                            break;
                        case '2':
                            NS_EVENTI.showWkEventiCartellaAmbAttivati();
                            break;
                        case '3':
                            NS_EVENTI.showWkEventiRicoveroAttivati();
                            break;                            
                        default:
                            NS_EVENTI.hideWkEventiAttivati();
                            break;
                    }
                });
                /*** $("#selectListaEventi").val('3'); // se volessimo far partire il select con una scelta gia' selezionata
                NS_EVENTI.showWkEventiRicoveroAttivati(); ***/
                break;
            default:

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
        
        if (radTipoSostitutoDichiarante.val() != '' && !NS_EVENTI.checkCampiDicSost()){

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
            message	: "Controllare di aver selezionato almeno un evento!",
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

            if (!NS_EVENTI.checkDicSost()){ return false; };

            /* Carico la lista degli eventi oscurati selezionati */
            NS_EVENTI.loadListaEventiOscurati();
            /* Attivo gli eventi oscurati selezionati */
            _LISTA_EVENTI_OSCURATI != '' ? NS_FUNCTIONS.evento.attiva() : NS_EVENTI.listaVuotaNotify();
            /* Carico la lista dei documenti relativi agli eventi oscurati selezionati */
//            NS_EVENTI.loadListaDocumentiOscuratiQuery();
            /* Attivo i documenti relativi agli eventi oscurati selezionati */
//            _LISTA_DOCUMENTI_OSCURATI != '' ? NS_FUNCTIONS.documento.attiva(false) : null;
        }
    },
    
    hideAllWk: function() {
        NS_EVENTI.hideWkEventiInespressi();
        NS_EVENTI.hideWkEventiAttivati();
        NS_EVENTI.hideWkEventiOscurati();
    },
    
    hideWkEventiInespressi: function() {
        $("#divWkEventiAccessoPsInespressi").hide();
        $("#divWkEventiCartellaAmbInespressi").hide();
        $("#divWkEventiRicoveroInespressi").hide();
    },
    
    hideWkEventiAttivati: function() {
        $("#divWkEventiAccessoPsAttivati").hide();
        $("#divWkEventiCartellaAmbAttivati").hide();
        $("#divWkEventiRicoveroAttivati").hide();
    },
    
    hideWkEventiOscurati: function() {
        $("#divWkEventiAccessoPsOscurati").hide();
        $("#divWkEventiCartellaAmbOscurati").hide();
        $("#divWkEventiRicoveroOscurati").hide();
    },
    
    loadListaDocumentiAttivatiQuery: function() {
        _LISTA_DOCUMENTI_ATTIVATI = '';
        
        /* Recupero i documenti per gli eventi selezionati */
        var resp = home.NS_FENIX_PIC.search.documentsForEvent(_CODICE_FISCALE, _LISTA_EVENTI_ATTIVATI);
        
        if (resp != null) {
            for (var i = 0; i < resp.length; i++) {
                _LISTA_DOCUMENTI_ATTIVATI = i == 0 ? _LISTA_DOCUMENTI_ATTIVATI + resp[i].PARENT : _LISTA_DOCUMENTI_ATTIVATI + '#' + resp[i].PARENT; 
            }
        }     

        /*** /alert(_LISTA_DOCUMENTI_ATTIVATI); ***/
    },
    
    loadListaDocumentiOscuratiQuery: function() {
        _LISTA_DOCUMENTI_OSCURATI = '';
        
        /* Recupero i documenti per gli eventi selezionati */
        var resp = home.NS_FENIX_PIC.search.documentsForEvent(_CODICE_FISCALE, _LISTA_EVENTI_OSCURATI);
        
        if (resp != null) {
            for (var i = 0; i < resp.length; i++) {
                _LISTA_DOCUMENTI_OSCURATI = i == 0 ? _LISTA_DOCUMENTI_OSCURATI + resp[i].PARENT : _LISTA_DOCUMENTI_OSCURATI + '#' + resp[i].PARENT; 
            }
        }  

        /*** alert(_LISTA_DOCUMENTI_OSCURATI); ***/
    },
    
    loadListaEventiAttivati: function() {
        _LISTA_EVENTI_ATTIVATI = '';

        if ($('#selectListaEventi').val() == 1) {
//        if ($('#divWkEventiAccessoPsAttivati').is(':visible')) {
            $("#divWkEventiAccessoPsAttivati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiAccessoPsAttivati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_ATTIVATI = _LISTA_EVENTI_ATTIVATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_ATTIVATI + "#" + row.NUM_PRATICA;
                }
            });
        }
        if ($('#selectListaEventi').val() == 2) {
//        if ($('#divWkEventiCartellaAmbAttivati').is(':visible')) {
            $("#divWkEventiCartellaAmbAttivati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiCartellaAmbAttivati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_ATTIVATI = _LISTA_EVENTI_ATTIVATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_ATTIVATI + "#" + row.NUM_PRATICA;
                }
            });
        }
        if ($('#selectListaEventi').val() == 3) {
//        if ($('#divWkEventiRicoveroAttivati').is(':visible')) {
            $("#divWkEventiRicoveroAttivati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiRicoveroAttivati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_ATTIVATI = _LISTA_EVENTI_ATTIVATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_ATTIVATI + "#" + row.NUM_PRATICA;
                }
            });
        }

       /*** alert(_LISTA_EVENTI_ATTIVATI); ***/
    },
    
    loadListaEventiOscurati: function() {
        _LISTA_EVENTI_OSCURATI = '';

        if ($('#selectListaEventi').val() == 1) {
//        if ($('#divWkEventiAccessoPsOscurati').is(':visible')) {
            $("#divWkEventiAccessoPsOscurati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiAccessoPsOscurati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_OSCURATI = _LISTA_EVENTI_OSCURATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_OSCURATI + "#" + row.NUM_PRATICA;
                }
            });
        }
        if ($('#selectListaEventi').val() == 2) {
//        if ($('#divWkEventiCartellaAmbOscurati').is(':visible')) {
            $("#divWkEventiCartellaAmbOscurati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiCartellaAmbOscurati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_OSCURATI = _LISTA_EVENTI_OSCURATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_OSCURATI + "#" + row.NUM_PRATICA;
                }
            });
        }
        if ($('#selectListaEventi').val() == 3) {
//        if ($('#divWkEventiRicoveroOscurati').is(':visible')) {
            $("#divWkEventiRicoveroOscurati .clsWk .clsWkScroll table tr").each(function(i) {
                var row = NS_FUNCTIONS.wkEventiRicoveroOscurati.getRow(i);
                if ($(this).hasClass('rowSel clsSel')) {
                    _LISTA_EVENTI_OSCURATI = _LISTA_EVENTI_OSCURATI == '' ? row.NUM_PRATICA : _LISTA_EVENTI_OSCURATI + "#" + row.NUM_PRATICA;
                }
            });
        }

        /*** alert(_LISTA_EVENTI_OSCURATI); ***/
    },
    
    oscura: {
        registra: function(params) {
            /* Valido i campi */
            if (!NS_FENIX_SCHEDA.validateFields()) {
                return false;
            }

            if (!NS_EVENTI.checkDicSost()){ return false; };

            /* Carico la lista degli eventi attivati selezionati */
            NS_EVENTI.loadListaEventiAttivati();
            /* Oscuro gli eventi attivati selezionati */
            _LISTA_EVENTI_ATTIVATI != '' ? NS_FUNCTIONS.evento.oscura() : NS_EVENTI.listaVuotaNotify();
            /* Carico la lista dei documenti relativi agli eventi attivati selezionati */
//            NS_EVENTI.loadListaDocumentiAttivatiQuery();
            /* Oscuro i documenti relativi agli eventi attivati selezionati */
//            _LISTA_DOCUMENTI_ATTIVATI != '' ? NS_FUNCTIONS.documento.oscura(false) : null;

        }
    },
    
    checkIfApriConsenso: function(data){
    	if(data.DIMESSO !== 'S'){
    		home.NOTIFICA.warning(
    				{
    					message	: "ATTENZIONE: Non è possibile acquisire un consenso per l'evento selezionato dal momento che si riferisce ad un episodio clinico NON concluso", 
    					timeout	: 10, 
    					title	: "WARNING"
    				});
    	}else{
    		NS_EVENTI.apriConsensoEvento(data.NUM_PRATICA);
    	}
    },
    
    apriConsensoEvento: function(id_evento){
    	
        var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_EVENTO';
        url += '&ASSIGNING_AUTHORITY=' 	+ home.baseGlobal.ASSIGNING_AUTHORITY;
        url += '&PATIENT_ID=' 			+ _PATIENT_ID;
        url += '&CODICE_FISCALE=' 		+ _CODICE_FISCALE;
        url += '&LOGOUT_ON_CLOSE=' 		+ 'N';
        url += '&WK_REFRESH=' 			+ 'true';
        url += '&NOSOLOGICO_PAZIENTE=' 	+ id_evento;
        
        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
    },
    
    refresInespressi: function(){
    	NS_FUNCTIONS.evento.aggiornaWkInespressi();
    },
    
    /*** PS ***/
    
    showWkEventiAccessoPsInespressi: function() {
        $("#divWkEventiRicoveroInespressi").hide();
        $("#divWkEventiCartellaAmbInespressi").hide();
        if (!NS_FUNCTIONS.wkEventiAccessoPsInespressi) {
            $("div#divWkEventiAccessoPsInespressi").height("500px");
            NS_FUNCTIONS.wkEventiAccessoPsInespressi = new WK({
                id			: "RICERCA_ACCESSI_PS_INESPRESSI",
                container	: "divWkEventiAccessoPsInespressi",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiAccessoPsInespressi.loadWk();
        }
        $("#divWkEventiAccessoPsInespressi").show();
    },
    
    showWkEventiAccessoPsAttivati: function() {
        $("#divWkEventiRicoveroAttivati").hide();
        $("#divWkEventiCartellaAmbAttivati").hide();
        if (!NS_FUNCTIONS.wkEventiAccessoPsAttivati) {
            $("div#divWkEventiAccessoPsAttivati").height("500px");
            NS_FUNCTIONS.wkEventiAccessoPsAttivati = new WK({
                id			: "RICERCA_ACCESSI_PS_ATTIVATI",
                container	: "divWkEventiAccessoPsAttivati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiAccessoPsAttivati.loadWk();
        }
        $("#divWkEventiAccessoPsAttivati").show();
    },
    
    showWkEventiAccessoPsOscurati: function() {
        $("#divWkEventiRicoveroOscurati").hide();
        $("#divWkEventiCartellaAmbOscurati").hide();
        if (!NS_FUNCTIONS.wkEventiAccessoPsOscurati) {
            $("div#divWkEventiAccessoPsOscurati").height("500px");
            NS_FUNCTIONS.wkEventiAccessoPsOscurati = new WK({
                id			: "RICERCA_ACCESSI_PS_OSCURATI",
                container	: "divWkEventiAccessoPsOscurati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiAccessoPsOscurati.loadWk();
        }
        $("#divWkEventiAccessoPsOscurati").show();
    },
    
    /*** Cartelle Ambulatoriali ***/
    
    showWkEventiCartellaAmbInespressi: function() {
        $("#divWkEventiRicoveroInespressi").hide();
        $("#divWkEventiAccessoPsInespressi").hide();
        if (!NS_FUNCTIONS.wkEventiCartellaAmbInespressi) {
            $("div#divWkEventiCartellaAmbInespressi").height("500px");
            NS_FUNCTIONS.wkEventiCartellaAmbInespressi = new WK({
                id			: "RICERCA_CARTELLE_AMB_INESPRESSE",
                container	: "divWkEventiCartellaAmbInespressi",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiCartellaAmbInespressi.loadWk();
        }
        $("#divWkEventiCartellaAmbInespressi").show();
    },
    
    showWkEventiCartellaAmbAttivati: function() {
        $("#divWkEventiRicoveroAttivati").hide();
        $("#divWkEventiAccessoPsAttivati").hide();
        if (!NS_FUNCTIONS.wkEventiCartellaAmbAttivati) {
            $("div#divWkEventiCartellaAmbAttivati").height("500px");
            NS_FUNCTIONS.wkEventiCartellaAmbAttivati = new WK({
                id			: "RICERCA_CARTELLE_AMB_ATTIVATE",
                container	: "divWkEventiCartellaAmbAttivati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiCartellaAmbAttivati.loadWk();
        }
        $("#divWkEventiCartellaAmbAttivati").show();
    },
    
    showWkEventiCartellaAmbOscurati: function() {
        $("#divWkEventiRicoveroOscurati").hide();
        $("#divWkEventiAccessoPsOscurati").hide();
        if (!NS_FUNCTIONS.wkEventiCartellaAmbOscurati) {
            $("div#divWkEventiCartellaAmbOscurati").height("500px");
            NS_FUNCTIONS.wkEventiCartellaAmbOscurati = new WK({
                id			: "RICERCA_CARTELLE_AMB_OSCURATE",
                container	: "divWkEventiCartellaAmbOscurati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiCartellaAmbOscurati.loadWk();
        }
        $("#divWkEventiCartellaAmbOscurati").show();
    },
    
    /*** Ricoveri ***/
    
    showWkEventiRicoveroInespressi: function() {
        $("#divWkEventiAccessoPsInespressi").hide();
        $("#divWkEventiCartellaAmbInespressi").hide();
        if (!NS_FUNCTIONS.wkEventiRicoveroInespressi) {
            $("div#divWkEventiRicoveroInespressi").height("500px");
            NS_FUNCTIONS.wkEventiRicoveroInespressi = new WK({
                id			: "RICERCA_RICOVERI_INESPRESSI",
                container	: "divWkEventiRicoveroInespressi",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiRicoveroInespressi.loadWk();
        }
        $("#divWkEventiRicoveroInespressi").show();
    },
    
    showWkEventiRicoveroAttivati: function() {
        $("#divWkEventiAccessoPsAttivati").hide();
        $("#divWkEventiCartellaAmbAttivati").hide();
        if (!NS_FUNCTIONS.wkEventiRicoveroAttivati) {
            $("div#divWkEventiRicoveroAttivati").height("500px");
            NS_FUNCTIONS.wkEventiRicoveroAttivati = new WK({
                id			: "RICERCA_RICOVERI_ATTIVATI",
                container	: "divWkEventiRicoveroAttivati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiRicoveroAttivati.loadWk();
        }
        $("#divWkEventiRicoveroAttivati").show();
    },
    
    showWkEventiRicoveroOscurati: function() {
        $("#divWkEventiAccessoPsOscurati").hide();
        $("#divWkEventiCartellaAmbOscurati").hide();
        if (!NS_FUNCTIONS.wkEventiRicoveroOscurati) {
            $("div#divWkEventiRicoveroOscurati").height("500px");
            NS_FUNCTIONS.wkEventiRicoveroOscurati = new WK({
                id			: "RICERCA_RICOVERI_OSCURATI",
                container	: "divWkEventiRicoveroOscurati",
                aBind		: ['anagrafica'],
                aVal		: [_PATIENT_ID]
            });
            NS_FUNCTIONS.wkEventiRicoveroOscurati.loadWk();
        }
        $("#divWkEventiRicoveroOscurati").show();
    }            
};

$(document).ready(function() {
    try {
        NS_EVENTI.init();
        NS_EVENTI.setEvents();
        home.NS_LOADING.hideLoading();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});