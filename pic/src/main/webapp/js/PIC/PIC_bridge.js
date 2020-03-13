
var NS_PIC_BRIDGE = {
		
    stampaConsenso: function() {
        home.NS_FENIX_PIC.print.preview("1", $("#h-idenConsenso").val(), $("#PATIENT_ID").val(), $("#TIPO_CONSENSO").val(), null);
    },

    stampaCaregiverPaziente: function() {
        home.NS_FENIX_PIC.print.preview("1", $("#h-idenConsenso").val(), $("#PATIENT_ID").val(), 'CAREGIVER_PAZIENTE', null);
    },
    
    chiudiPagina: function(idConsenso, saved) {
        /*** idConsenso, saved parametri che servono ad altri applicativi ***/
		NS_FENIX_SCHEDA.chiudi();
    },
		
    refreshWKUnico: function() {
        
        if ($("#WK_REFRESH").val()) {
            
        	if(LIB.isValid(home.DOCUMENTI_PAZIENTE_DSE.objWk)){
        		
        		home.DOCUMENTI_PAZIENTE_DSE.refreshWk();
        	}
            
        	if(LIB.isValid(home.EVENTI_PAZIENTE_DSE.objWk)){
        		
        		home.EVENTI_PAZIENTE_DSE.refreshWk();
        	}
        }
        
        NS_PIC_BRIDGE.refreshGestisciConsensi();
    },
    
    refreshGestisciConsensi: function() {
        
        if(LIB.isValid(home.NS_GESTISCI_CONSENSI)){

            try {
                home.NS_GESTISCI_CONSENSI.getConsensiEsistenti();
            } catch (e) {}
    	}
    },
		
    refreshWKEventi: function() {
    	NS_EVENTO.refreshWk();
    },
		
    refreshWKDocumenti: function() {
    	NS_DOCUMENTO.refreshWk();
    },
    
    chiudiCaregiver: function(idConsenso, saved) {
    	NS_PIC_BRIDGE.refreshGestisciConsensi();
		NS_FENIX_SCHEDA.chiudi();
    }
};