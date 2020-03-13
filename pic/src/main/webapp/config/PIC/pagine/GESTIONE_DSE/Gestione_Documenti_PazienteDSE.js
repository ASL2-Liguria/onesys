/* global home, NS_FENIX_SCHEDA, LIB */

var PAZIENTE_DSE = {
		
		unico: {
			iden : null,
			trattamento_dati : null,
			integrazione_passata : null,
			integrazione_futura : null
		},
	    
	    setDatiUnico: function() {

	        var Consenso = home.NS_FENIX_PIC.search.consensus($("#PATIENT_ID").val(), 'CONSENSO_UNICO');
	        if(Consenso != ''){
	        	PAZIENTE_DSE.unico.iden = Consenso.IDEN;
	        	PAZIENTE_DSE.unico.trattamento_dati = Consenso.TRATTAMENTO_DATI;
	        	PAZIENTE_DSE.unico.integrazione_passata = Consenso.INTEGRAZIONE_PASSATA;
	        	PAZIENTE_DSE.unico.integrazione_futura = Consenso.INTEGRAZIONE_FUTURA;
	        }    	
	    },

		setIconDSEPatientSection: function(){

	    	var icon_paziente = {
	    		icon: null,
	    		title: null
	    	};

	    	if( !LIB.isValid(PAZIENTE_DSE.unico.iden) ){
	    		icon_paziente.icon = 'assente';
	    		icon_paziente.title = 'Consenso Unico Non Presente';
	    	}else{

	    		icon_paziente.icon = 'KO';
	    		icon_paziente.title = 'Il paziente NON acconsente alla gestione completa dai propri dati personali. ';

		    	if((PAZIENTE_DSE.unico.trattamento_dati === 'S') &&
		    			(PAZIENTE_DSE.unico.integrazione_futura === 'S') &&
		    				(PAZIENTE_DSE.unico.integrazione_passata === 'S')){
		    		icon_paziente.icon = 'OK';
		    		icon_paziente.title = 'Il paziente acconsente alla gestione completa dai propri dati personali. ';
		    	}
	    	}

	    	return icon_paziente;
		}		
}

var DOCUMENTI_PAZIENTE_DSE = {

	alreadyOpened: false,

    init: function() {
    	
    	/*if(!(/\bSUPERUSER\b/i.test(LIB.getParamUserGlobal('GRUPPO_PERMESSI', '')) || /\bPOWERUSER\b/i.test(LIB.getParamUserGlobal('GRUPPO_PERMESSI', '')))){
    		$("#li-tabDocDSE").hide();
    	}*/
		
		/* Carico le variabili EXTERN */
		NS_FUNCTIONS.loadExtern();

		/* Se non ho l'iden dell'anagrafica chiamo la funzione gestAnag che me lo recupera */
		if (_PATIENT_ID == null) {

			NS_FUNCTIONS.gestAnag();

			/* Ricarico la pagina con la url completa */
			NS_FUNCTIONS.url.params.load();
			_URL_PARAMS += NS_FUNCTIONS.url.params.set('PATIENT_ID', _PATIENT_ID);
            _URL_PARAMS += NS_FUNCTIONS.url.params.set('ASSIGNING_AUTHORITY', home.baseGlobal.ASSIGNING_AUTHORITY);
			location.href = location.protocol + "//" + location.host + location.pathname + _URL_PARAMS;
		}else{
	        NS_FUNCTIONS.loadPatient();
		}
        
        $('div#GestioneDSE div.headerTabs h2#lblTitolo').html( "Gestione DSE di " + 
            _NOME + " " + _COGNOME + " nato a " + _COMUNE_NASCITA + " il " + _DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4) + " (CF: " + _CODICE_FISCALE + "; SESSO: " + _SESSO + ")"
        );

    	DOCUMENTI_PAZIENTE_DSE.objWk = null;

    	home.DOCUMENTI_PAZIENTE_DSE = this;

        $('#ElencoWorkDSE').height("650px");
    },

    setEvents: function() {

        	var msg = "Le informazioni in questa pagina sono ad uso esclusivo del paziente.<br/>" +
        				"L'apertura di questa pagina verra' registrata.<br/>Proseguire?";

			var $div = $("<div>", {"id":"DivDialogConferma"}).append($("<p>").html(msg));

			if(!DOCUMENTI_PAZIENTE_DSE.alreadyOpened){

				$.dialog(
					$div, {
						width	: 400,
						title	: "Attenzione",
						buttons	: [
							       	   {
							       		   label: "Si",
							       		   action: function () {
							       			   $.dialog.hide();
							       			   DOCUMENTI_PAZIENTE_DSE.alreadyOpened = true;
							       			   /*** fai partire lw wk ***/
							       			   DOCUMENTI_PAZIENTE_DSE.initWk();
							       			   /*** loggare l'evento ***/
							       			   DOCUMENTI_PAZIENTE_DSE.traceUserActionOpen();
							       		   }
							       	   },
							       	   {
							       		   label: "No",
							       		   action: function () {
							       			   $.dialog.hide();
							       			   /*** mi sposto di tab... ***/
							       			   /*$("#li-tabDocRepository").trigger("click");*/
							       			   /*** ...oppure chiudo? ***/
							       			   NS_FENIX_SCHEDA.chiudi();
							       		   }
							       	   }
						       	  ]
					}
				);
			}

    },

    initWk: function() {

    	PAZIENTE_DSE.setDatiUnico();

    	DOCUMENTI_PAZIENTE_DSE.objWk = new WK({
			id 			: "WK_REPOSITORY_DSE",
			container 	: "ElencoWorkDSE",
			aBind 		: ['patientId'],
			aVal 		: [_CODICE_FISCALE]
		});

    	DOCUMENTI_PAZIENTE_DSE.objWk.loadWk();
	},

	refreshWk: function() {

		PAZIENTE_DSE.setDatiUnico();

		DOCUMENTI_PAZIENTE_DSE.objWk.refresh();
	},

    setIconDSE: function(data) {

    	var paziente = PAZIENTE_DSE.setIconDSEPatientSection();
        
        var oscuramento;
    	var title_oscuramento;

        switch (data.DSE_OSCURAMENTO) {

            case "A":
            	oscuramento = 'KO';
            	title_oscuramento = 'Oscurato';
                break;

            case "R":
            	oscuramento = 'OK';
            	title_oscuramento = 'NON oscurato';
                break;

            default:
            	oscuramento = 'assente';
            	title_oscuramento = "Nessuna informazione sull' oscuramento";
                break;
        }
        
        var iconGenerale = $("<div>", { "class" : "pcyPaz_" + paziente.icon, "style": "width: 35px; height: 30px; cursor: pointer; float: left;" } )
							.attr("title", paziente.title)
								.on('click', function(){ LOG_DSE.apriConsensoUnico(); });
        
        var iconDocumento = $("<div>", { "class" : "pcyEsa_" + oscuramento, "style": "width: 35px; height: 30px; cursor: pointer; float: left;" } )
							.attr("title", 'Documento '+ title_oscuramento)
								.on('click', function(){ DOCUMENTI_PAZIENTE_DSE.apriConsensoDoc(data.ID); });

        return $("<div>").append(iconGenerale, iconDocumento);
    },

    apriConsensoDoc: function(id_doc){
    	
    	var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_DOCUMENTO';
        url += '&ASSIGNING_AUTHORITY=' 	+ home.baseGlobal.ASSIGNING_AUTHORITY;
        url += '&PATIENT_ID=' 			+ $("#PATIENT_ID").val();
        url += '&CODICE_FISCALE=' 		+ _CODICE_FISCALE;
        url += '&LOGOUT_ON_CLOSE=' 		+ 'N';
        url += '&ID_DOCUMENTO=' 		+ id_doc;
        url += '&WK_REFRESH='			+'true';

        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
    },
    
    traceUserActionOpen : function () {
    	/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
		NS_FUNCTIONS.traceAperturaWKDocDSE($("#PATIENT_ID").val());
    }
};

$(document).ready(function() {
    try {
    	DOCUMENTI_PAZIENTE_DSE.init();
    	DOCUMENTI_PAZIENTE_DSE.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});