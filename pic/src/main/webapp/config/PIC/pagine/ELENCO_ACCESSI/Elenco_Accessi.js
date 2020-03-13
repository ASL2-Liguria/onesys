var ELENCO_ACCESSI = {
	
	init : function() {
    	
    	/*if(!(/\bSUPERUSER\b/i.test(LIB.getParamUserGlobal('GRUPPO_PERMESSI', '')) || /\bPOWERUSER\b/i.test(LIB.getParamUserGlobal('GRUPPO_PERMESSI', '')))){
    		$("#li-tabElencoAccessi").hide();
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
	        NS_FUNCTIONS.loadPatient();
		}		

        NS_FUNCTIONS.loadUser();
        
        $('div#ElencoAccessi div.headerTabs h2#lblTitolo').html( "Elenco Accessi di " + 
            _NOME + " " + _COGNOME + " nato a " + _COMUNE_NASCITA + " il " + _DATA_NASCITA.substring(6, 8) + "/" + _DATA_NASCITA.substring(4, 6) + "/" + _DATA_NASCITA.substring(0, 4) + " (CF: " + _CODICE_FISCALE + "; SESSO: " + _SESSO + ")"
        );

    	ELENCO_ACCESSI.objWk = null;

		home.ELENCO_ACCESSI	= this;
		
		home.NS_CONSOLEJS.addLogger({name : 'ELENCO_ACCESSI', console : 0});
	    window.logger = home.NS_CONSOLEJS.loggers['ELENCO_ACCESSI'];
		
		 $('#divWkElencoAccessi').height("650px");
	     ELENCO_ACCESSI.initWk();
	},
	
	setEvents: function(){

        $(".butStampa").click(function() {
            home.NS_FENIX_PIC.print.stampa_elenco_accessi("1", $("#PATIENT_ID").val());
        });
	},
		
	initWk: function() {

		ELENCO_ACCESSI.objWk = new WK({
			id 			: "WK_ELENCO_ACCESSI",
			container 	: "divWkElencoAccessi",
			aBind 		: ['patient_id'],
			aVal 		: [$('#PATIENT_ID', '#EXTERN').val()]
		});

		this.objWk.loadWk();
	},
    
    getvalueDocumento: function(iden){

		home.$.NS_DB.getTool({_logger : home.logger}).select({
			datasource	: 'PORTALE_PIC',
            id			: 'XDSREGISTRY.DOCUMENTO',
            parameter	:
	            {
	            	iden_documento		: { v : iden, t : 'V'},
	            }
		}).done( function(resp) {

			ELENCO_ACCESSI.buildPopupDocumento(resp.result[0])
		});
	},
	
	buildPopupDocumento: function(params){
		
		var data = PROCESS_CLASS.processClassDataISO(params.DATA_DOCUMENTO);
        
		var frm = $(document.createElement('form'))
			.attr({"id": "frmDialog"})
			.append(
					$("<table/>", {"class":"tableDatiDocumento", "id": "tableDatiDocumento"}).css({"width": "100%"})
		);

		$.dialog(frm, {
			'id'			: 'dialogWk',
			'title'			: 'Dettaglio',
			'showBtnClose'	: true,
			'ESCandClose'	: true,
			'created'		: function () { $('.dialog').focus(); },
			'width'			: 500,
		});
		
		ELENCO_ACCESSI.buildRow($("#tableDatiDocumento"), "AUTORE", params.AUTORE);
		ELENCO_ACCESSI.buildRow($("#tableDatiDocumento"), "DATA CREAZIONE", data);
		ELENCO_ACCESSI.buildRow($("#tableDatiDocumento"), "REPARTO EROGATORE", params.REPARTOEROG);
		ELENCO_ACCESSI.buildRow($("#tableDatiDocumento"), "TIPO DOCUMENTO", params.DESCRIZIONE);
	},
    
    getvalueEvento: function(iden){

		home.$.NS_DB.getTool({_logger : home.logger}).select({
			datasource	: 'EVENTI',
            id			: 'WORKLIST.EVENTO',
            parameter	:
	            {
	            	num_nosologico		: { v : iden, t : 'V'},
	            }
		}).done( function(resp) {

			ELENCO_ACCESSI.buildPopupEvento(resp.result[0])
		});
	},
	
	buildPopupEvento: function(params){
//		alert(params)
		var data_inizio = PROCESS_CLASS.processClassDataISO(params.DATA_INIZIO);
		var data_fine = PROCESS_CLASS.processClassDataISO(params.DATA_FINE);
        
		var frm = $(document.createElement('form'))
			.attr({"id": "frmDialog"})
			.append(
					$("<table/>", {"class":"tableDatiEvento", "id": "tableDatiEvento"}).css({"width": "100%"})
			);

		$.dialog(frm, {
			'id'			: 'dialogWk',
			'title'			: 'Dettaglio',
			'showBtnClose'	: true,
			'ESCandClose'	: true,
			'created'		: function () { $('.dialog').focus(); },
			'width'			: 500,
		});
		
		ELENCO_ACCESSI.buildRow($("#tableDatiEvento"), "DATA INIZIO", data_inizio);
		ELENCO_ACCESSI.buildRow($("#tableDatiEvento"), "DATA FINE", data_fine);
		ELENCO_ACCESSI.buildRow($("#tableDatiEvento"), "REPARTO", params.REPARTO);
		ELENCO_ACCESSI.buildRow($("#tableDatiEvento"), "TIPO RICOVERO", params.TIPO_RICOVERO);
	},
	
	buildRow: function(table, label, descr) {
		
		table.append($("<tr/>", {"class":"headColumns", "style":"border-bottom: 1px solid;"})
			.append($("<td/>",{"width": "30%"})
				.append( $('<div>',{"style":"text-align:right; padding-right:2px; background-color:#dddddd; font-weight:bold;"}).text(label) )
			)
			.append($("<td/>",{"width": "70%"})
				.append( $('<div>',{"style":"text-align:left; padding-left:2px; background-color:white;"}).text(descr) )
			)
		)
		
	},
	
	processClassSetLink: function(data) {
    	
    	var iden = data.ID;
    	var parametri = data.PARAMETRI;
    	var div = $("<div>").html(iden);
    	if(parametri === 'DOC' || parametri === 'EV'){
    		div.css('cursor','pointer').on("click", function(){
        		
        		if(parametri === 'DOC'){
        			ELENCO_ACCESSI.getvalueDocumento(data.ID);
        		}
        		
        		if(parametri === 'EV'){
        			ELENCO_ACCESSI.getvalueEvento(data.ID);
        		}
        	});
		}

    	return div;
    }
};

$(document).ready(function() {
	
	ELENCO_ACCESSI.init();
	ELENCO_ACCESSI.setEvents();
});