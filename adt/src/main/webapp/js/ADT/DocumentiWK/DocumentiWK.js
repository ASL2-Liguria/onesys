$(document).ready(function () {
	NS_DOCUMENTI_WK.init();
});

var NS_DOCUMENTI_WK = 
{		
		TIPO_APERTURA : null,
		
		WK : null,
		
		init : function()
		{
			NS_DOCUMENTI_WK.TIPO_APERTURA = $("#TIPO").val();
			
			NS_DOCUMENTI_WK.initLogger();
			NS_DOCUMENTI_WK.definisciComportamento();
		},
		
		/**
		 * Funzione Iniziale che determina il comportamento in base ai parametri di apertura (RICHIESTA, PAZIENTE...)
		 * A seconda dei parametri in ingresso mostra la WK del caso.
		 * Apertura per richiesta mostra la WK solo per la setssa sono presenti più documenti.
		 * Gli altri casi non sono per il momento gestiti in quanto bisogna considerare le regole della privacy.
		 */
		definisciComportamento : function(){
			
			NS_DOCUMENTI_WK.setIntestazione();
			NS_DOCUMENTI_WK.setStyle();
			
			var parametersWK  = 
			{
				aBind : null,
				aVal : null,
				load_callback : {after : null}
			};
			
			switch(NS_DOCUMENTI_WK.TIPO_APERTURA)
			{
			case "RICHIESTA" :
				parametersWK.aBind = ["iden_richiesta"];
				parametersWK.aVal = ["WHALE" + $("#IDEN_RICHIESTA").val()];
				parametersWK.load_callback.after = NS_DOCUMENTI_WK.processDocumentiRichiesta;
				parametersWK.ID_WK = "WK_DOCUMENTI_RICHIESTA";
				parametersWK.QUERY = "WORKLIST.WK_DOCUMENTI_RICHIESTA";
				break;
				
			case "NOSOLOGICO" :
			case "ID_PAZIENTE" :
			case "IDEN_ANAGRAFICA" :
				break;
			}
			
			NS_DOCUMENTI_WK.caricaWKDocumenti(parametersWK);
		},
		
		/**
		 * Viene invocata in seguito a NS_DOCUMENTI_WK.definisciComportamento.
		 * Si limita ad aprire la WK in base ai parametri che sono stati passati.
		 * 
		 * @param params
		 */
		caricaWKDocumenti : function(params)
		{
			NS_DOCUMENTI_WK.WK = new WK({
	            id : params.ID_WK,
	            container : "divWkDocumenti",
	            aBind : params.aBind,
	            aVal : params.aVal,
	            load_callback : params.load_callback.after
	        });
			
			NS_DOCUMENTI_WK.WK.loadWk();
		},
		
		/**
		 * Funzione che dato un documento in base alla rispettiva URI ne visualizza il documento firmato.
		 * Viene invocata direttamente in caso di apertura per richiesta con un solo documento associato oppre
		 * direttamente tramite il menu contestuale della WK.
		 *  
		 * @param parameters
		 */
		apriDocumento : function(parameters)
		{
			var par = {};
			par.URL = parameters.URI;
			
			home.$('#fldFunzioniRitornaWk').hide();
			
			logger.debug("Apri Documento - par -> " + JSON.stringify(par));
			
			par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
			home.NS_FENIX_PRINT.caricaDocumento(par);
			home.NS_FENIX_PRINT.apri(par);
			
			if (typeof parameters.CBK === "function")
			{
				loggerDocumenti.debug("Eseguo Callback Apertura Documento" + parameters.CBK);
				parameters.CBK();
			}
		},
		
		/**
		 * Funzione specifica dell'apertura della WK per RICHIESTA.
		 * Una volta caricati i documenti della richiesta verifica quanti documenti vi sono associati.
		 * Se è associato un solo documento apre direttamente la visualizzazione al contrario 
		 * mostra la WK se più di un documento è associato alla richiesta.
		 */
		processDocumentiRichiesta : function()
		{
			var rowWK = NS_DOCUMENTI_WK.WK.getRows();
			
			if (rowWK.length > 1)
			{
				loggerDocumenti.info("Presenti piu documenti per - RICHIESTA " + rowWK[rowWK.length - 1].IDEN_RICHIESTA);
				return;
			}
			else
			{
				loggerDocumenti.info("Apro Unico Documento - RICHIESTA " + rowWK[rowWK.length - 1].IDEN_RICHIESTA + ", ID -> " + rowWK[rowWK.length - 1].ID);
				
				NS_DOCUMENTI_WK.apriDocumento({"URI" : rowWK[rowWK.length - 1].URI, "CBK" : function(){NS_FENIX_SCHEDA.chiudi();}});
			}
		},
		
		setIntestazione : function()
		{
			var anagrafica = NS_ANAGRAFICA.Getter.getAnagraficaById($("#IDEN_ANAGRAFICA").val());
			$('#lblTitolo').html(anagrafica.cognome + ' ' + anagrafica.nome + ' - ' + anagrafica.sesso + ' - ' + moment(anagrafica.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + anagrafica.codiceFiscale);
		},
		
		setStyle : function()
		{
			$("#divWkDocumenti").height("450px");
		},
		
		initLogger : function()
		{
			home.NS_CONSOLEJS.addLogger({name:'WK_DOCUMENTI',console:0});
		    window.loggerDocumenti = home.NS_CONSOLEJS.loggers['WK_DOCUMENTI'];
		}
};