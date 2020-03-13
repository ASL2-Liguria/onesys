var EVENTI_PAZIENTE_DSE = {
		
	alreadyOpened: false,
		
    init: function() {
    	
    	EVENTI_PAZIENTE_DSE.objWk = null;
    	
    	home.EVENTI_PAZIENTE_DSE = this;
    	
        $('#ElencoWorkEventiDSE').height("650px");
    },
    
    setEvents: function() {
    	$("#li-tabEventiDSE").on("click", function(){
        	
        	var msg = "Le informazioni in questa pagina sono ad uso esclusivo del paziente.<br/>" +
        				"L'apertura di questa pagina verra' registrata.<br/>Proseguire?";

			var $div = $("<div>", {"id":"DivDialogConferma"}).append($("<p>").html(msg));							
			
			if(!EVENTI_PAZIENTE_DSE.alreadyOpened){
				
				$.dialog(
					$div, {
						width	: 400,
						title	: "Attenzione",
						buttons	: [
							       	   {
							       		   label: "Si",
							       		   action: function () {
							       			   $.dialog.hide();
							       			   EVENTI_PAZIENTE_DSE.alreadyOpened = true;
							       			   /*** fai partire lw wk ***/
							       			   EVENTI_PAZIENTE_DSE.initWk();
							       			   /*** loggare l'evento ***/
							       			   EVENTI_PAZIENTE_DSE.traceUserAction();
							       		   }
							       	   },
							       	   {
							       		   label: "No",
							       		   action: function () {
							       			   $.dialog.hide();
							       			   /*** mi sposto di tab... ***/
							       			   /*** ...oppure chiudo? ***/
							       			   NS_FENIX_SCHEDA.chiudi();
							       		   }
							       	   }
						       	  ]
					}
				);
			}
    		
    	});

    },
    
    initWk: function() {
    	
    	PAZIENTE_DSE.setDatiUnico();
		
    	EVENTI_PAZIENTE_DSE.objWk = new WK({
			id 			: "WK_EVENTI_DSE",
			container 	: "ElencoWorkEventiDSE",
			aBind 		: ['anagrafica'],
			aVal 		: [$("#PATIENT_ID").val()]
		});
			
    	EVENTI_PAZIENTE_DSE.objWk.loadWk();
	},
	
	refreshWk: function() {

    	PAZIENTE_DSE.setDatiUnico();
		
		EVENTI_PAZIENTE_DSE.objWk.refresh();
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
        
        var iconEvento = $("<div>", { "class" : "pcyEsa_" + oscuramento, "style": "width: 35px; height: 30px; cursor: pointer; float: left;" } )
							.attr("title", 'Evento '+ title_oscuramento)
								.on('click', function(){ EVENTI_PAZIENTE_DSE.checkIfApriConsenso(data); });

        return $("<div>").append(iconGenerale, iconEvento);
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
    		EVENTI_PAZIENTE_DSE.apriConsensoEvento(data.NUM_PRATICA);
    	}
    },    
    
    apriConsensoEvento: function(id_evento){
    	
        var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_EVENTO';
        url += '&ASSIGNING_AUTHORITY=' 	+ home.baseGlobal.ASSIGNING_AUTHORITY;
        url += '&PATIENT_ID=' 			+ $("#PATIENT_ID").val();
        url += '&CODICE_FISCALE=' 		+ _CODICE_FISCALE;
        url += '&LOGOUT_ON_CLOSE=' 		+ 'N';
        url += '&WK_REFRESH=' 			+ 'true';
        url += '&NOSOLOGICO_PAZIENTE=' 	+ id_evento;
        
        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
    },
    
    traceUserAction : function () {
    	/*** Registro l'operazione su IMAGOWEB.TRACE_USER_ACTION ***/
		NS_FUNCTIONS.traceAperturaWKEventiDSE($("#PATIENT_ID").val());
    },
    
    apriCaregiverEvento: function(id_evento){

        var url = 'page?KEY_LEGAME='	+ 'CONSENSI/CAREGIVER';
        url += '&ASSIGNING_AUTHORITY='	+ home.baseGlobal.ASSIGNING_AUTHORITY;
        url += '&PATIENT_ID='			+ $("#PATIENT_ID").val()
        url += '&CODICE_FISCALE='		+ _CODICE_FISCALE
        url += '&COGNOME='				+ _COGNOME;
        url += '&DATA_NASCITA='			+ _DATA_NASCITA;
        url += '&NOME='					+ _NOME;
        url += '&COM_NASC='				+ _COM_NASC;
        url += '&SESSO='				+ _SESSO;
        url += '&LOGOUT_ON_CLOSE='		+ 'N';        
        url += '&NOSOLOGICO_PAZIENTE=' 	+ id_evento;
        url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;

        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true});
    }
};

$(document).ready(function() {
    try {
    	EVENTI_PAZIENTE_DSE.init();
    	EVENTI_PAZIENTE_DSE.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});