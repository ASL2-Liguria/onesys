var NS_FENIX_PIC = {
	init: function(){ /*** Al momento non serve fare nulla ***/ },
	setEvents: function(){ /*** Al momento non serve fare nulla ***/ },
	
	print: {
		
		preview: function(cdc, idenConsenso, pIdenAnag, key_legame, vuoto) {

		    var report_unico = (key_legame === 'CONSENSO_UNICO' || key_legame === 'CAREGIVER_PAZIENTE')? true : false;
        	
        	var tipo_report, printPrompt;
        	if(vuoto){
        		tipo_report = 'VUOTO';
                printPrompt = (report_unico)? "&promptpTipoConsenso=VUOTO": '';
        	}else{
        		if(LIB.isValid(idenConsenso) && idenConsenso !== ''){
        			tipo_report = 'MOD';
                    printPrompt = (report_unico)? "&promptpTipoConsenso=CONSENSO" : "&promptpIdenConsenso=" + idenConsenso;
        			//printPrompt = "&promptpIdenConsenso=" + idenConsenso;
        		}else{
        			tipo_report = 'PRE';
                    printPrompt = (report_unico)? "&promptpTipoConsenso=ANAGRAFICA" : "&promptpPatientId=" + pIdenAnag;
        			//printPrompt = "&promptpPatientId=" + pIdenAnag;
        		}
        	}
        	var anag = LIB.isValid(pIdenAnag)? pIdenAnag: '';
            anag = (LIB.isValid(idenConsenso) && idenConsenso !== '')? '': anag;
            if(report_unico){
                printPrompt += "&promptpIdenConsenso=" + idenConsenso + "&promptpPatientId=" + anag;
            }

        	var report;
        	if(key_legame === 'CONSENSO_UNICO'){
                report = 'CONSENSO_GENERALE';
            }else if(key_legame === 'CAREGIVER_PAZIENTE'){
                report = 'CONSENSO_CAREGIVER';
            }else{
                report = NS_FENIX_PIC.search.getReportConsenso(key_legame, tipo_report);
                report = report[0].CODICE_DECODIFICA;
            }

            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: printPrompt,
                "PRINT_REPORT"				: report,
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });
        },
        
        stampa: function(cdc, idenConsenso, pIdenAnag, key_legame, vuoto) {

            var report_unico = (key_legame === 'CONSENSO_UNICO' || key_legame === 'CAREGIVER_PAZIENTE')? true : false;
        	
        	var tipo_report, printPrompt;
        	if(vuoto){
        		tipo_report = 'VUOTO';
                printPrompt = (report_unico)? "&promptpTipoConsenso=VUOTO": '';
        	}else{
        		if(LIB.isValid(idenConsenso) && idenConsenso !== ''){
        			tipo_report = 'MOD';
                    printPrompt = (report_unico)? "&promptpTipoConsenso=CONSENSO" : "&promptpIdenConsenso=" + idenConsenso;
        			//printPrompt = "&promptpIdenConsenso=" + idenConsenso;
        		}else{
        			tipo_report = 'PRE';
                    printPrompt = (report_unico)? "&promptpTipoConsenso=ANAGRAFICA" : "&promptpPatientId=" + pIdenAnag;
        			//printPrompt = "&promptpPatientId=" + pIdenAnag;
        		}
        	}
            var anag = LIB.isValid(pIdenAnag)? pIdenAnag: '';
            anag = (LIB.isValid(idenConsenso) && idenConsenso !== '')? '': anag;
            if(report_unico){
                printPrompt += "&promptpIdenConsenso=" + idenConsenso + "&promptpPatientId=" + anag;
            }

            var report;
            if(key_legame === 'CONSENSO_UNICO'){
                report = 'CONSENSO_GENERALE';
            }else if(key_legame === 'CAREGIVER_PAZIENTE'){
                report = 'CONSENSO_CAREGIVER';
            }else{
                var report = NS_FENIX_PIC.search.getReportConsenso(key_legame, tipo_report);
                report = report[0].CODICE_DECODIFICA;
            }

            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: printPrompt,
                "PRINT_REPORT"				: report,
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.stampa({})}
            });
        },

		stampa_informativa: function(cdc, report) {
            /*NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: '',
                "PRINT_REPORT"				: (report == 'MMG') ? "INFORMATIVA_CONSENSO_VISIBILITA_MMG" : "INFORMATIVA_PRIVACY_ASL2",
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });*/

            var urlInformativa = home.NS_FENIX_TOP.getAbsolutePathServer();

            if(report == 'MMG'){
                urlInformativa += encodeURI("PIC/Informativa_MMG.pdf");
			}else if(report == 'CAREGIVER'){
                urlInformativa += encodeURI("PIC/Informativa_Caregiver.pdf");
			}else{
                urlInformativa += encodeURI("PIC/Informativa_Privacy.pdf");
            }

            window.open( urlInformativa );
        },
        
		stampa_caregiver: function(cdc) {
            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: '',
                "PRINT_REPORT"				: "CONSENSO_CAREGIVER",
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });
        },
        
		stampa_revoca: function(cdc) {
            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: '',
                "PRINT_REPORT"				: "REVOCA_CONSENSO",
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });
        },
        
		stampa_elenco_accessi: function(cdc, pIdenAnag) {
            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: "&promptpPatientId=" + pIdenAnag,
                "PRINT_REPORT"				: "ELENCO_ACCESSI_PAZIENTE",
				"PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
				"PRINT_URL"					: baseGlobal.PRINT_URL,
				"okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });
        },

        stampa_consenso_documento: function(cdc, promptDOC) {

			var prompt = "&promptpIdenAnag=" + promptDOC.pIdenAnag;
			prompt += "&promptpIdDoc=" + promptDOC.pIdDoc;
            prompt += "&promptpData=" + promptDOC.pData;
            prompt += "&promptpConferimento=" + promptDOC.pConferimento;
            prompt += "&promptpOscuramento=" + promptDOC.pOscuramento;

            NS_FENIX_PRINT.caricaDocumento({
                "PRINT_DIRECTORY"			: cdc,
                "PRINT_PROMPT" 				: prompt,
                "PRINT_REPORT"				: "CONSENSO_DOCUMENTO",
                "PRINT_REPOSITORY_REPORT"	: baseGlobal.PRINT_REPOSITORY_REPORT,
                "PRINT_URL"					: baseGlobal.PRINT_URL,
                "okCaricaDocumento"			: function(){NS_FENIX_PRINT.apri({"beforeApri":NS_FENIX_PRINT.initStampa})}
            });
        }
    },

    search: new PicService().search
};

$(document).ready(function() {
    try {
    	NS_FENIX_PIC.init();
        NS_FENIX_PIC.setEvents();
    } catch (e) {

        home.NOTIFICA.error({
            message	: e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description,
            title	: "Errore!"
        });
    }
});