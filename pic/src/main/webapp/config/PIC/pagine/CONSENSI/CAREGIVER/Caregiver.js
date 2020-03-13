var NS_CAREGIVER = {

    saved: false,
		
    init: function() {
        NS_FENIX_SCHEDA.customizeParam = NS_CAREGIVER.customizeParam;
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
	        NS_FUNCTIONS.loadPatient();
		}

        NS_FUNCTIONS.loadHideParams();
        
        $('div#Caregiver div.headerTabs h2#lblTitolo').html(
            $('div#Caregiver div.headerTabs h2#lblTitolo').html() + " di " + 
            _NOME + " " + _COGNOME + " " + _DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4) + " (CF: " + _CODICE_FISCALE + "; SESSO: " + _SESSO + ")"
        );
        
        if (($("#TITOLARE_TRATTAMENTO").val() == '' || $("#TITOLARE_TRATTAMENTO").val() == undefined) && LIB.isValid(home.baseUser.TITOLARE_TRATTAMENTO)){
        	NS_FUNCTIONS.getTitolareTrattamento();
        }else if ($("#TITOLARE_TRATTAMENTO").val() == '' || $("#TITOLARE_TRATTAMENTO").val() == undefined) {
            home.NOTIFICA.error({message: "ATTENZIONE: titolare del trattamento assente", timeout: 5, title: "Error"});

        	var msg = "ATTENZIONE: titolare del trattamento assente";

			var $div = $("<div>", {"id":"DivDialogConferma"}).append($("<p>").html(msg));

			$.dialog(
				$div, {
					width	: 400,
					title	: "Attenzione",
					buttons	: [
						       	   {
						       		   label: "Chiudi",
						       		   action: function () {
						       			   $.dialog.hide();

						                   if (_LOGOUT_ON_CLOSE != 'N') {
						                       NS_FENIX_SCHEDA.beforeClose = function(){
						                           home.NS_FENIX_TOP.logout();
						                       };
						                   }
						                   NS_FENIX_SCHEDA.chiudi();
						       		   }
						       	   }
					       	  ]
				}
			);
        }
        
        if(LIB.isValid(_NOSOLOGICO_PAZIENTE)){
        	$('div#Caregiver div.headerTabs h2#lblTitolo').html(
                    $('div#Caregiver div.headerTabs h2#lblTitolo').html() + " per il nosologico n° " + _NOSOLOGICO_PAZIENTE
                );
        	$("#lblCaregiverPaziente").closest("tr").hide();
        }else{
        	$("#lblCaregiverEvento").closest("tr").hide();
        }
        
        NS_CAREGIVER.checkValStatoSalute();
        NS_CAREGIVER.checkValUbicazione();
        
        NS_FENIX_SCHEDA.addFieldsValidator({'config': 'V_CAREGIVER'});

        if(_ACTION === 'VISUALIZZA'){
        	$(".butSalva").hide();
        }
    },
    
    setEvents: function() {

        if(LIB.isValid(_NOSOLOGICO_PAZIENTE)){
            $("#Caregiver\\@butStampa").hide();
        }else{
            $("#Caregiver\\@butStampa").click(function() {
                NS_PIC_BRIDGE.stampaCaregiverPaziente();
            });
        }
    	
    	var y = 400;
    	
		// Centramento
		$('#dati').css('padding-top', (parent.$('body').height() / 2) - (y / 2) - 80);

		// Setto l'altezza
		$('.contentTabs').height(y);
		/*$('#wkVersioniConsensoUnico').height($('.contentTabs').height() - $('#fldVersioniInner').height() - 25);*/
        
    	if (_LOGOUT_ON_CLOSE != 'N') {
            NS_FENIX_SCHEDA.beforeClose = function(){
                home.NS_FENIX_TOP.logout();
            }; 
        }

        $("#radCaregiverStatoSalute").on("change", NS_CAREGIVER.checkValStatoSalute);
        $("#radCaregiverUbicazione").on("change", NS_CAREGIVER.checkValUbicazione);
        
        $(".butChiudi").off("click");
        $(".butChiudi").on("click", function() {
        	NS_PIC_BRIDGE.chiudiCaregiver($("#h-idenConsenso").val(), NS_CAREGIVER.saved);
        });
    },
    
    checkValStatoSalute: function(e){
        if (radCaregiverStatoSalute.val() === 'S') {
        	$("#txtCaregiverStatoSalute").prop('disabled', false);
        } else {
        	$("#txtCaregiverStatoSalute").prop('disabled', true).val('');
        }
    },
    
    checkValUbicazione: function(e){
        if (radCaregiverUbicazione.val() === 'S') {
        	$("#txtCaregiverUbicazione").prop('disabled', false);
        } else {
        	$("#txtCaregiverUbicazione").prop('disabled', true).val('');
        }
    },
    
    beforeSave: function() {
        
        return true;
    },
    
    customizeParam: function(params) {
        params.beforeSave = NS_CAREGIVER.beforeSave;
        params.refresh = true;
        params.successSave = NS_CAREGIVER.successSave;
        return params;
    },
	
	myCustomizeJson: function( json ) {
		
		json.TITOLARE_TRATTAMENTO = (LIB.isValid($("#TITOLARE_TRATTAMENTO").val()) && $("#TITOLARE_TRATTAMENTO").val() !== '') ? $("#TITOLARE_TRATTAMENTO").val() : home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
		return json;
    },
    
    successSave: function(message) {
        $("#h-idenConsenso").val(message);
        NS_CAREGIVER.saved = true;
        NS_FUNCTIONS.callAjax.EVC([{"idenDettaglio":message, "tabellaModulo": "PIC_MODULI_CONSENSO"}]);
    }            
};

$(document).ready(function() {
    try {
        NS_CAREGIVER.init();
        NS_CAREGIVER.setEvents();
        home.NS_LOADING.hideLoading();
    	NS_FENIX_SCHEDA.customizeJson = NS_CAREGIVER.myCustomizeJson;
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});