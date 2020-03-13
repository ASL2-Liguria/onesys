var NS_EVENTO = {

	DSE_abilita : null,
	DSE_conferma_lettura_abilita : null,
	oscuramento_start : null,
	ConsensoValues : [{
		"IDEN" : null, 
		"TRATTAMENTO_DATI" : null, 
		"INTEGRAZIONE_PASSATA" : null,
		"INTEGRAZIONE_FUTURA" : null
	}],
    saved : false,
		
    init: function() {
        NS_FENIX_SCHEDA.customizeParam = NS_EVENTO.customizeParam;
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
        	NS_EVENTO.ConsensoValues = NS_FUNCTIONS.getvalueConsensoUnico($("#PATIENT_ID").val(), 'CONSENSO_UNICO', titolare);
            
            if(NS_EVENTO.ConsensoValues[0].INTEGRAZIONE_FUTURA !== 'S'){
                
                if ( $("#h-radOscuramentoDSE").val() === '') {
                	radOscuramentoDSE.selectByValue('P');
                }
            	radOscuramentoDSE.disable();
            	chkPazInc.disable();
            	home.NOTIFICA.warning({message: "ATTENZIONE: Non è possibile indicare l'oscuramento a DSE dell' evento dal momento che il paziente NON ha autorizzato l'alimentazione del proprio Dossier Sanitario Elettronico", timeout: 10, title: "WARNING"});
                NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_CONSENSO_EVENTO_NO_DSE'});
            }else{
            	/*** se il radio venisse ricaricato con il valore a 'P' in fase di salvataggio tale valore aggirerebbe il controllo del validator ***/
            	if(chkPazInc.val !== 'S' && radOscuramentoDSE.val() === 'P'){
            		radOscuramentoDSE.empty();
            	}
                NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_CONSENSO_EVENTO'});
            }
        }

        NS_FUNCTIONS.loadHideParams();
        if (_NOSOLOGICO_PAZIENTE == '' || _NOSOLOGICO_PAZIENTE == undefined) {
            home.NOTIFICA.error({message: "ATTENZIONE: nosologico paziente assente", timeout: 5, title: "Error"});
            NS_FENIX_SCHEDA.chiudi();
        }        

        /* Dopo il loading */
        NS_EVENTO.oscuramento_start = $("#h-radOscuramentoDSE").val();

        var consenso_evento = JSON.parse(home.baseGlobal.consenso_evento);
        NS_EVENTO.DSE_abilita = consenso_evento.DSE.abilita;
        NS_EVENTO.DSE_conferma_lettura_abilita = consenso_evento.DSE.conferma_lettura.abilita;
        
        NS_EVENTO.DSE_abilita == 'N'? $("#fldDSE").hide() : null;
        NS_EVENTO.DSE_conferma_lettura_abilita == 'N'? $("#chkVisInfoDSE").closest("tr").hide() : null;

        $("#radOscuramentoDSE_P").hide();
        NS_EVENTO.checkSuperSensibileParam();
        NS_EVENTO.checkStatoOscuramentoV();
        NS_EVENTO.checkpazienteNONCapace();
    },
    
    setEvents: function() {
    	
        $("#h-radStatoOscuramento").on("change", function() {
            if ( $("#radStatoOscuramento_V").hasClass("RBpulsSel") ) {
            	radOscuramentoDSE.selectByValue('A');
            }
        });

        $("#chkPazInc").on("click", function() {
        	if (chkPazInc.val() === 'S') {
//            	radOscuramentoDSE.enable();
            	radOscuramentoDSE.selectByValue('P');
            	radOscuramentoDSE.disable();
            	NS_EVENTO.setValidator(V_CONSENSO_EVENTO_NO_DSE);
            }else if(NS_EVENTO.ConsensoValues[0].INTEGRAZIONE_FUTURA === 'S'){
            	radOscuramentoDSE.enable();
            	radOscuramentoDSE.empty()
            	NS_EVENTO.setValidator(V_CONSENSO_EVENTO);
            }
        });
        
        $(".butChiudi").off("click");
        $(".butChiudi").on("click", function() {
        	NS_PIC_BRIDGE.chiudiPagina($("#h-idenConsenso").val(), NS_EVENTO.saved);
        });
        
        if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            }; 
        }
    },
	
    checkpazienteNONCapace: function(){
    	if (chkPazInc.val() === 'S') {
        	radOscuramentoDSE.selectByValue('P');
        	radOscuramentoDSE.disable();
        	NS_EVENTO.setValidator(V_CONSENSO_EVENTO_NO_DSE);
        }
	},
	
	setValidator: function(vTipologiavalidator){
	
		var vVoidvalidator = {};
		var $vValidator = $.extend(true, vVoidvalidator, V_CONSENSO_EVENTO_NO_DSE, vTipologiavalidator);
		NS_FENIX_SCHEDA.addFieldsValidator({config: $vValidator});
	},
    
    checkSuperSensibileParam: function() {
    	
	    if( LIB.isValid($("#SUPER_SENSIBILE_DEFAULT")) && $("#SUPER_SENSIBILE_DEFAULT").val() === 'S'){
	    	radStatoOscuramento.selectByValue('V');
	    	radStatoOscuramento.disable();
	    }
    },
    
    checkStatoOscuramentoV: function() {
        
        if ( $("#radStatoOscuramento_V").hasClass("RBpulsSel") && $("#h-radOscuramentoDSE").val() === '') {
        	radOscuramentoDSE.selectByValue('A');
        }
    },
    
    beforeSave: function() {
        /*if ($("#h-radStatoOscuramento").val() == '') {
        	home.NOTIFICA.warning({message: "ATTENZIONE: selezionare un valore per lo 'Stato oscuramento'", timeout: 5, title: "WARNING"});
            return false;
        }*/
        if (NS_EVENTO.DSE_conferma_lettura_abilita == 'S' && $("#h-chkVisInfoDSE").val() == '') {
            home.NOTIFICA.warning({message: "ATTENZIONE: indicare che il paziente ha preso visione e compreso l'informativa fornita riguardante il DSE prima di proseguire", timeout: 5, title: "WARNING"});
            return false;
        }
        
        return true;
    },
    
    customizeParam: function(params) {
        params.beforeSave = NS_EVENTO.beforeSave;
        params.refresh = true;
        params.successSave = NS_EVENTO.successSave;
        return params;
    },

	traceUserAction: function() {
		/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/        
        if(($("#h-radOscuramentoDSE").val() == 'R') && NS_EVENTO.oscuramento_start == 'A'){
        	NS_FUNCTIONS.traceDeoscuraEvento(_PATIENT_ID, _NOSOLOGICO_PAZIENTE);
        }			
	},
	
	refreshWk: function() {
    	if($("#WK_REFRESH").val() && LIB.isValid(home.EVENTI_PAZIENTE_DSE)){
    		try {
    			home.EVENTI_PAZIENTE_DSE.refreshWk();
        	} catch (e) {}
        }
    	
    	if($("#WK_REFRESH").val() && LIB.isValid(home.NS_EVENTI)){
    		try {
    			home.NS_EVENTI.refresInespressi();
        	} catch (e) {}
        }
	},
    
    successSave: function(message) {

	    $("#h-idenConsenso").val(message);
        NS_EVENTO.saved = true;
        NS_EVENTO.traceUserAction();        
        NS_EVENTO.oscuramento_start = $("#h-radOscuramentoDSE").val();
        
        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio":message, "tabellaModulo": "PIC_MODULI_CONSENSO"}], null, NS_PIC_BRIDGE.refreshWKEventi);
        
        /*** Qui, eventualmente, sarebbero da oscurare i documenti associati all'evento appena oscurato ***/
    }
};

$(document).ready(function() {
    try {
        NS_EVENTO.init();
        NS_EVENTO.setEvents();
        home.NS_LOADING.hideLoading();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});