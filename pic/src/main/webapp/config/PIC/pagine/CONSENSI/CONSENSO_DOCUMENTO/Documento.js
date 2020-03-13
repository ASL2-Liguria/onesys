var NS_DOCUMENTO = {

	DSE_abilita : null,
	DSE_conferma_lettura_abilita : null,
	FSE_abilita : null,
	FSE_conferma_lettura_abilita : null,
	oscuramento_start : null,
    idPICDoc : null,
    saved : false,
		
    init: function() {
        NS_FENIX_SCHEDA.customizeParam = NS_DOCUMENTO.customizeParam;
        /* Carico le variabili EXTERN */
        NS_FUNCTIONS.loadExtern();
        /* Se non ho l'iden dell'anagrafica chiamo la funzione gestAnag che me lo recupera */
        if (_PATIENT_ID == null) {
            NS_FUNCTIONS.gestAnag();
            /* Ricarico la pagina con la url completa */
            NS_FUNCTIONS.url.params.load();
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('PATIENT_ID', _PATIENT_ID);
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('ASSIGNING_AUTHORITY', home.baseGlobal.ASSIGNING_AUTHORITY);
            /***alert(location.origin + location.pathname + _URL_PARAMS); ***/
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
                
                if ( $("#h-radOscuramentoDSE").val() === '') {
                	radOscuramentoDSE.selectByValue('P');
                }
	        	radOscuramentoDSE.disable();
	        	home.NOTIFICA.warning({message: "ATTENZIONE: Non è possibile indicare l'oscuramento a DSE del documento dal momento che il paziente NON ha autorizzato l'alimentazione del proprio Dossier Sanitario Elettronico", timeout: 10, title: "WARNING"});
	            NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_CONSENSO_DOCUMENTO_NO_DSE'});
	        }else{
	        	/*** se il radio venisse ricaricato con il valore a 'P' in fase di salvataggio tale valore aggirerebbe il controllo del validator ***/
	        	if(radOscuramentoDSE.val() === 'P'){
	        		radOscuramentoDSE.empty()
	        	}
	            NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_CONSENSO_DOCUMENTO'});
	        }
        }

        NS_FUNCTIONS.loadHideParams();

        if (_ID_DOCUMENTO == '' || _ID_DOCUMENTO == undefined) {
            home.NOTIFICA.error({message: "ATTENZIONE: id documento assente", timeout: 5, title: "Error"});
            NS_FENIX_SCHEDA.chiudi();
        }  
        
        /* Dopo il loading */
        NS_DOCUMENTO.oscuramento_start = $("#h-radOscuramentoDSE").val();

        var consenso_documento = JSON.parse(home.baseGlobal.consenso_documento);
        NS_DOCUMENTO.DSE_abilita = consenso_documento.DSE.abilita;
        NS_DOCUMENTO.DSE_conferma_lettura_abilita = consenso_documento.DSE.conferma_lettura.abilita;
        NS_DOCUMENTO.FSE_abilita = consenso_documento.FSE.abilita;
        NS_DOCUMENTO.FSE_conferma_lettura_abilita = consenso_documento.FSE.conferma_lettura.abilita;
        
        NS_DOCUMENTO.DSE_abilita == 'N'? $("#fldDSE").hide() : null;
        NS_DOCUMENTO.FSE_abilita == 'N'? $("#fldFSE").hide() : null;
        
        NS_DOCUMENTO.DSE_conferma_lettura_abilita == 'N'? $("#chkVisInfoDSE").closest("tr").hide() : null;
        NS_DOCUMENTO.FSE_conferma_lettura_abilita == 'N'? $("#chkVisInfoFSE").closest("tr").hide() : null;
        
        $("#radOscuramentoDSE_P").hide();
        NS_DOCUMENTO.checkSuperSensibileParam();
        NS_DOCUMENTO.checkStatoOscuramentoV();
        
        if($("#h-indFSE").val() === '1'){
        	radInserimentoFSE.disable();
        	radOscuramentoFSE.disable();
        }
    },
    
    setEvents: function() {
        
        $("#h-radStatoOscuramento").on("change", function() {
            if ( $("#radStatoOscuramento_V").hasClass("RBpulsSel") ) {
            	radOscuramentoDSE.selectByValue('A');
            	if($("#h-indFSE").val() === '0'){
	            	radInserimentoFSE.selectByValue('R');
	            	radInserimentoFSE.disable();
	//            	radOscuramentoFSE.empty();
	//            	radOscuramentoFSE.disable();
            	}
            } else {
            	if($("#h-indFSE").val() === '0'){
	            	radInserimentoFSE.enable();
	            	if (!$("#radInserimentoFSE_R").hasClass("RBpulsSel")) {
	            		radOscuramentoFSE.enable();
	            	}
            	}
            }
        });
        
        $("#h-radInserimentoFSE").on("change", function() {
            if ( $("#radInserimentoFSE_R").hasClass("RBpulsSel") && $("#h-indFSE").val() === '0') {
            	radOscuramentoFSE.empty();
            	radOscuramentoFSE.disable();
            }else {
            	radOscuramentoFSE.enable();
            }
        });
        
        $(".butChiudi").off("click");
        $(".butChiudi").on("click", function() {
        	NS_PIC_BRIDGE.chiudiPagina(NS_DOCUMENTO.idPICDoc, NS_DOCUMENTO.saved);
        });
        
        if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            }; 
        }
    },
    
    checkSuperSensibileParam: function() {
        
        if( LIB.isValid($("#SUPER_SENSIBILE_DEFAULT")) && $("#SUPER_SENSIBILE_DEFAULT").val() === 'S'){
        	radStatoOscuramento.selectByValue('V');
        	radStatoOscuramento.disable();
        }    	
    },
    
    checkStatoOscuramentoV: function() {
    	
        if ( $("#radStatoOscuramento_V").hasClass("RBpulsSel") ) {

        	if($("#h-radOscuramentoDSE").val() === ''){
        		radOscuramentoDSE.selectByValue('A');
        	}
        	
        	radInserimentoFSE.selectByValue('R');
        	radInserimentoFSE.disable();
        	radOscuramentoFSE.empty();
        	radOscuramentoFSE.disable();
        }
    },
    
    beforeSave: function() {
        /*if ($("#h-radStatoOscuramento").val() == '') {
        	home.NOTIFICA.warning({message: "ATTENZIONE: selezionare un valore per lo 'Stato oscuramento'", timeout: 5, title: "WARNING"});
            return false;
        }*/
        if (NS_DOCUMENTO.DSE_conferma_lettura_abilita == 'S' && $("#h-chkVisInfoDSE").val() == '') {
            home.NOTIFICA.warning({message: "ATTENZIONE: indicare che il paziente ha preso visione e compreso l'informativa fornita riguardante il DSE prima di proseguire", timeout: 5, title: "WARNING"});
            return false;
        }
        if (NS_DOCUMENTO.FSE_conferma_lettura_abilita == 'S' && $("#h-chkVisInfoFSE").val() == '') {
            home.NOTIFICA.warning({message: "ATTENZIONE: indicare che il paziente ha preso visione e compreso l'informativa fornita riguardante il FSE prima di proseguire", timeout: 5, title: "WARNING"});
            return false;
        }
        
        return true;
    },
    
    customizeParam: function(params) {
        params.beforeSave = NS_DOCUMENTO.beforeSave;
        params.refresh = true;
        params.successSave = NS_DOCUMENTO.successSave;
        return params;
    },

	traceUserAction: function() {
		/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
        if(($("#h-radOscuramentoDSE").val() == 'R') && NS_DOCUMENTO.oscuramento_start == 'A'){
        	NS_FUNCTIONS.traceDeoscuraDocumento(_PATIENT_ID, _ID_DOCUMENTO);
        }
	},
	
	refreshWk: function() {

        if ($("#WK_REFRESH").val() && LIB.isValid(home.DOCUMENTI_PAZIENTE_DSE)) {
        	try {
        		home.DOCUMENTI_PAZIENTE_DSE.refreshWk();
        	} catch (e) {}
        }
        
        if ($("#WK_REFRESH").val() && LIB.isValid(home.NS_DOCUMENTI)) {
        	try {
	        	home.NS_DOCUMENTI.wkDocumentiInespressi.refresh();
	    	} catch (e) {}
        }
	},
    
    successSave: function(message) {

        NS_DOCUMENTO.idPICDoc = message;
        NS_DOCUMENTO.saved = true;
        NS_DOCUMENTO.traceUserAction();        
        NS_DOCUMENTO.oscuramento_start = $("#h-radOscuramentoDSE").val();
        
        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio":message, "tabellaModulo": "PIC_MODULI_CONSENSO"}], null, NS_PIC_BRIDGE.refreshWKDocumenti);
    }
};

$(document).ready(function() {
    try {
        NS_DOCUMENTO.init();
        NS_DOCUMENTO.setEvents();
        home.NS_LOADING.hideLoading();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});