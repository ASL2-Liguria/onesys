var PROCESS_CLASS = {
    
    processClassAttiva: function(data/*, wk, callFunction*/) {

    	return $("<div>", ( data.ATTIVA == 'S' ) ? 
    		{ "class" : "active", "style": "width: 16px; height: 16px;" } : 
    		{ "class" : "deactivate", "style": "width: 16px; height: 16px;" } );
    },
    
    checkIfRevoked: function(data, wk, callFunction) {
    	
    	if(data.REVOCA === 'N' && data.TIPO !== "CAREGIVER_PAZIENTE"){
    		return PROCESS_CLASS.processClassApri(data, wk, callFunction)
    	}else{
    		return null;
    	}
    },
    
    processClassCheckIfVerificato: function(data) {
    	
    	var div = $("<div>", ( data.VERIFICATO == 'S' ) ? 
        		{ "class" : "active", "style": "width: 16px; height: 16px;" } : 
        		{ "class" : "deactivate", "style": "width: 16px; height: 16px;" } );
    	
    	if(data.VERIFICATO == 'S'){
    		div.attr("title", "Da " + data.UTE_VERIFICA_DESCR + " in data " + data.DATA_VERIFICA );
    	}

    	return div;
    },
    
    processClassApri: function(data, wk, callFunction) {

    	return $("<i>", { "class" : "icon-search", "style": "width: 16px; height: 16px;" } )
    		.attr("title", "Visualizza Documento")
    			.on("click", function(){callFunction(data);});
    },
    
    processClassTipoConsenso: function(data) {
    	
    	var tipo_consenso;
    	
        switch (data.TIPO) {

            case "CONSENSO_CANALE_VISIBILITA_MMG":
            	tipo_consenso = 'Visibilità MMG';
                break;

            case "CONSENSO_UNICO":
            	tipo_consenso = 'Consenso Generale';
                break;

            case "CAREGIVER_PAZIENTE":
            	tipo_consenso = 'Caregiver Paziente';
                break;

            default:
            	tipo_consenso = 'Consenso non classificabile';
                break;
        }
        
        if(data.REVOCA === 'S'){
        	tipo_consenso = 'REVOCA ' + tipo_consenso;
        }

    	return tipo_consenso;
    },
    
    processClassAllegato: function(data/*, wk, callFunction*/) {
    	
    	var title = "Visualizza Allegato";
    	
    	if(home.NS_FENIX_PIC.search.allegato(data.IDEN) != ''){
    		var note = home.NS_FENIX_PIC.search.allegato(data.IDEN).NOTE;
    		if (note != '' && note != null && note != 'null'){
    			title = "Visualizza Allegato: " + note;
    		}
    		
    		return $("<i>", { "class" : "icon-doc-text", "style": "width: 16px; height: 16px;" } )
    			.attr("title", title)
    				.on("click", function(){ window.open("showDocumentoAllegato?IDEN=" + data.IDEN); });
    	}else{
    		return null;
    	}
    },
    
    processClassDataOraISO: function(data/*, wk, callFunction*/) {

    	var dataISO = data.CREATIONTIME;
    	var creation_time = PROCESS_CLASS.processClassDataISO(dataISO) + dataISO.substr(8,6);
    	return creation_time;    	
    },
    
    processClassDataISO: function(dataISO) {
    	
    	var creation_time = dataISO.substr(6,2) + '/' + dataISO.substr(4,2) + '/' + dataISO.substr(0,4);
    	return creation_time;    	
    },
    
    processClassActionDescr: function(data) {
    	
    	var dataAction = data.ACTION;
    	var div = $("<div>").html(data.ACTION_DESCR);
    	
    	if(dataAction === 'APRI'){
    		
    		var dataFunction = data.FUNZIONE;
    		var APRIjson = JSON.parse(data.PARAMETRI);
    		
    		div.html( APRIjson[dataFunction] );
    	}
    	
    	if(LIB.isValid(data.NOTE) && data.NOTE !== ''){
    		div.attr("title", data.NOTE );
    		div.prepend( $("<i>", { "class" : "icon-attention-alt", "style": "width: 16px; height: 16px;" } ) );
    	}

    	return div;
    },
    
    processClassPazDecedutoCogn: function(data, td) {
    	
    	var div = $(document.createElement('div'));

    	if (data.DATA_MORTE != null && data.DATA_MORTE != "")
    	{
    		div.css({"color" : "white", "text-decoration" : "none"});
    		td.css({"background-color" : "#3e4045", "color" : "white"});
    	}

    	div.text(data.COGNOME);

    	return div;
    },
    
    processClassPazDecedutoNome: function(data, td) {
    	
    	var div = $(document.createElement('div'));

    	if (data.DATA_MORTE != null && data.DATA_MORTE != "")
    	{
    		div.css({"color" : "white", "text-decoration" : "none"});
    		td.css({"background-color" : "#3e4045", "color" : "white"});
    		data.NOME += " (Deceduto)";
    	}

    	div.text(data.NOME);

    	return div;
    }
};