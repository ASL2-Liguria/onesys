
var LOG_DSE = {

    init: function() {

    	home.LOG_DSE = this;

    },

    whereApriConsensoUnico: function(){
    	/*** per ora disabilitiamo il controllo ***/
    	/*** return LIB.isValid(DOCUMENTI_PAZIENTE_DSE.unico.iden); ***/
    	return true;
    },

    apriConsensoUnico: function(){

	    var url = 'page?KEY_LEGAME=' 	+ 'CONSENSI/CONSENSO_UNICO';
	    url += '&TIPO_CONSENSO=' 		+ 'CONSENSO_UNICO';
	    url += '&ACTION=' 				+ 'INSERISCI';
	    url += '&ASSIGNING_AUTHORITY=' 	+ home.baseGlobal.ASSIGNING_AUTHORITY;
	    url += '&TITOLARE_TRATTAMENTO=' + home.baseGlobal.TITOLARE_TRATTAMENTO_DEFAULT;
	    url += '&PATIENT_ID=' 			+ $("#PATIENT_ID").val();
        url += '&LOGOUT_ON_CLOSE=' 		+ 'N';
	    url += '&WK_REFRESH='			+'true';
	
	    home.NS_FENIX_TOP.apriPagina({url:encodeURI(url),fullscreen:true});
    },
    
    apriDocRep: function(row) {
    	
    	if(home.basePermission.DOCUMENTI.VISUALIZZA === 'N'){

            home.NOTIFICA.warning({
                message	: "Operazione non consentita per il profilo dell'utente",
                title	: "Attenzione!"
            });
            return;
        }

        var r;
        if (LIB.isValid(row[0]))
            r = row[0];
        else
            r = row;

        var Uri = r.URI;
        console.log(Uri);

        home.NS_FENIX_PRINT.caricaDocumento({
			"URL": Uri,
			"okCaricaDocumento":function(){
					LOG_DSE.traceUserAction(r.ID, 'APRI', _PATIENT_ID);
					home.NS_FENIX_PRINT.apri({"beforeApri": home.NS_FENIX_PRINT.initStampa});
					
					home.NS_FENIX_PRINT.afterChiudi = function() {
						home.NS_FENIX_PRINT.afterChiudi = function(){/*** non serve fare nulla ***/};
						LOG_DSE.traceUserAction(r.ID, 'CHIUDI', _PATIENT_ID);
				    	return true;
					};
				}
        });
    },
    
    traceUserAction : function (id_documento, action, patient_id) {
    	
    	if(action === 'APRI'){
    		NS_FUNCTIONS.traceAperturaDocumento(id_documento, patient_id);
        	
    		if(LIB.isValid($("#FROM_MMG").val()) && $("#FROM_MMG").val() !== ''){
        		NS_FUNCTIONS.traceAperturaDocumentoMMG(id_documento, patient_id, $("#FROM_MMG").val());
        	}
    	}
    	
    	if(action === 'CHIUDI'){
    		NS_FUNCTIONS.traceChiusuraDocumento();
    	}
    }
};

$(document).ready(function() {
    try {
    	LOG_DSE.init();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});