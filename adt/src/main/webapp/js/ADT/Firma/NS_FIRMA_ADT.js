var FIRMA_ADT =
{
		setDati : function(dati){
	        this.dati = dati;
	        NS_FENIX_FIRMA.LOGGER.debug("Dati - " + JSON.stringify(this.dati));
	    },
	    
	    getDati : function(nome){
	    	return (this.dati[nome]) ? this.dati[nome] : "";
	    },
	    
	    initAnteprima : function()
	    {
	    	$("#fldInfoDocumento").hide();
	        $("#fldFunzioniFirma").hide();
	        $("#fldFunzioniValida").hide();
	        $("#fldFunzioniStampa").show();
	        $("#fldFunzioniRitornaWk").hide();
	        $("#fldFunzioniSISS").hide();
	        return true;
	    },
	    
	    initFirma : function(params)
	    {
	    	var $this = this;
	    	
	    	$this.chiudiButton = NS_FENIX_PRINT.chiudi;
	        NS_FENIX_PRINT.chiudi = $this.chiudi;
	        
	        $this.setDati(params.FIRMA);
	    	
	    	home.NS_FENIX_PRINT.apri({'beforeApri':function(params){return true;}});
	        home.NS_FENIX_PRINT.caricaDocumento(params.STAMPA);
	        
	        $("#txtPin").off().on('keypress',function(event) { if (event.keyCode == 13){ $("#butFirma").trigger("click");} }).focus();
	    	$("#butChiudi").off("click").on("click",function(){ $this.chiudi(); });
	    	
	    	$("#fldInfoDocumento").hide();
	        $("#fldFunzioniFirma").show();
	        $("#fldFunzioniSISS").hide();
	        $("#fldFunzioniValida").hide();
	        $("#fldFunzioniStampa").hide();
	        $("#fldFunzioniRitornaWk").hide();
	        
	        if (typeof $this.getDati("CALLBACK") == "function") {
	        	$this.getDati("CALLBACK")();	
	        }
	        
	        return true;
	    },
	    
	    initValida : function(params){},
	    beforeValida : function(param){return true;},
	    valida : function (param){},
	    okValida : function(resp){},
	    koValida : function(resp){},
	    
	    beforeFirma : function(param)
	    {
	    	NS_LOADING.showLoading({"timeout" : 0});
	    	
	    	var idFromSmartcard = appletFenix.getSmartCardID();

	        if(baseUser.ID_SMART_CARD != idFromSmartcard)
	        {
	        	NS_LOADING.hideLoading();
	            NOTIFICA.error({message: "Smart Card non associata all'utente loggato o file firma.cfg non presente. Verificare!", title: "Error!", timeout: 3, width: 220});
	            return false;
	        }
	        
	        return true;
	    },
	    
	    firma : function (param) 
	    {   	
	    	NS_FENIX_FIRMA.LOGGER.debug("Inizio Processo di Firma - Time " + new Date().getTime());
	    	
	        if(!this.beforeFirma(param)) {
	        	return false;
	        }
	        
	        var resp = appletFenix.firma(param['pin']);

	        resp.status === "OK" ? setTimeout(function(){FIRMA.okFirma(resp);},100) : this.koFirma(resp);
	    },
	    
	    okFirma : function(resp)
	    {
	    	NS_FENIX_FIRMA.LOGGER.info("Documento Firmato con Successo - Time " + new Date().getTime());
	        this.archiviaDocumento(resp);
	    },
	    
	    koFirma : function(resp)
	    {
	    	NS_LOADING.hideLoading();
	    	
	    	if (resp.status === "FF") {
	    		NOTIFICA.error({message: "Pin Errato!", title: "Error!", timeout: 3, width: 220});
	    	} else {
	    		NS_FENIX_FIRMA.LOGGER.error("KO Firma - Errore Durante la Firma - message " + JSON.stringify(resp));
	    	}
	    },
	    
	    getDatiArchivia:function(resp)
	    {
	        var jsonArchivia = {
	        		success : true,
	        		fileBase64 : appletFenix.getDocumentBase64()
	        };
			
	        jsonArchivia.success = LIB.isValid(jsonArchivia.fileBase64) ? true : false;
	    	
	        return jsonArchivia;
	    },
	    
	    archiviaDocumento: function (resp) {
	    	
	        var $this = this;
	        var jsonDocumento = $this.getDatiArchivia();
	    	
	        NS_FENIX_FIRMA.LOGGER.debug("Archivia Documento - Init Processo - parametri " + JSON.stringify(resp) + " - Time " + new Date().getTime());
	    	
	    	if (!LIB.isValid(jsonDocumento.fileBase64)) {
	    		return home.NOTIFICA.error({message: "Errore Generazione Base 64 Pdf!", title: "Error", timeout: 6, width: 220});
	    	}
	    	
	    	var parameters = 
	    	{
	    			"P_KEY_TABELLA" : {t : "V", v : $this.getDati("TABELLA"), d : 'I'},
		        	"P_KEY_TABELLA_IDEN" : {t : "N", v : $this.getDati("IDEN_VERSIONE"), d : 'I'},	
		        	"P_URL_DOCUMENTO" : {t : 'V', v : "ND", d : 'I'},
		        	"P_PDF_BASE64" : {t : "C", v : jsonDocumento.fileBase64, d : 'I'},
		        	"P_RESULT" : {t : 'V', d : 'O'}
		    };
	    	
	    	// La prima Firma NON ha alcun precedente da disattivare.
	    	// Devo gestire la casistica per non mandare in errore NS_DB
	    	if ($this.getDati("IDEN_VERSIONE") !== null) {
				parameters.P_IDEN_DISATTIVARE = {t : 'N' , v : $this.getDati("IDEN_VERSIONE_PRECEDENTE"), d : 'I'};
			}
	    	
	    	var db = home.$.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	    	
	        var xhr =  db.call_procedure(
	        {
	            id: 'FX$PCK_DOCUMENTI.INSERISCI_VERSIONE',
	            parameter : parameters
	        });
	        
	        xhr.done(function (data, textStatus, jqXHR) {
	
	            var resp = JSON.parse(data['P_RESULT'].split('|')[1]);
	        
	            resp.success ? $this.okArchiviaDocumento(resp) : $this.koArchiviaDocumento(resp);
	        });
	        
	        xhr.fail(function (response) {
	        	$this.koArchiviaDocumento(response);
	        });
	        
	    },
	    
	    okArchiviaDocumento : function(resp)
	    {
	    	NS_FENIX_FIRMA.LOGGER.info("OK Archivia Documento - Archiviazione Documento Avvenuta con Successo - Time " + new Date().getTime());
	        this.attivaVersione(resp);
	    },
	    
	    koArchiviaDocumento : function(resp)
	    {       
	    	NS_LOADING.hideLoading();
	        NS_FENIX_FIRMA.LOGGER.error("KO Archivia Documento - Errore Durante Archiviazione Documento - message " + JSON.stringify(resp));
			NOTIFICA.error({message: "Errore Procedura Archiviazione Documento", title: "Error", timeout: 6, width: 220});
	    },
	
	    getDatiAttivaVersione : function(resp){
	            
	    	var $this = this;
	        var p = 
	        {
				"P_KEY_TABELLA" : {t : "V", v : $this.getDati("TABELLA"), d : 'I'},
	        	"P_KEY_TABELLA_IDEN" : {t : "N", v : $this.getDati("IDEN_VERSIONE"), d : 'I'},	
	        	"P_RESULT" : {t : 'V', d : 'O'}
		    };
	
	        return p;
	    },
	    
	    attivaVersione: function (resp) {
	   
	    	var $this = this;
	        var p = $this.getDatiAttivaVersione(resp);
	        var db = home.$.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	        
	        NS_FENIX_FIRMA.LOGGER.debug("Inizio Processo di Attivazione Documento - parametri " + JSON.stringify(p) + " Time " + new Date().getTime());
	    	
	        var xhr =  db.call_procedure(
	        {
	            id: 'FX$PCK_DOCUMENTI.ATTIVA_VERSIONE',
	            parameter : p
	        });
	        
	        xhr.done(function (data, textStatus, jqXHR) {
	
	            var resp = JSON.parse(data['P_RESULT'].split('|')[1]);
	        
	            NS_FENIX_FIRMA.LOGGER.debug("attivaVersione per iden " + $this.getDati("IDEN_VERSIONE") + " della tabella " + $this.getDati("TABELLA") + " : " + JSON.stringify(data));
	            
	            resp.success ? $this.okAttivaVersione(resp) : $this.koAttivaVersione();
	        });
	        
	        xhr.fail(function (response) {
	        	$this.koAttivaVersione();
	        });
	
	    },
	    
	    okAttivaVersione : function(resp)
	    {
	    	this.dati.FIRMA_COMPLETA = true;
	    	
	        $("#fldFunzioniFirma").hide();
	        $("#fldFunzioniValida").hide();
	        $("#fldFunzioniRitornaWk").hide();
	        $("#fldFunzioniStampa").show();
			
			$("#txtPin").val("");
			$("#txtPassword").val("");
	
			NS_LOADING.hideLoading();
			
			NS_FENIX_FIRMA.LOGGER.debug("Attivazione Documento Avvenuta con Successo - Time " + new Date().getTime());
			NOTIFICA.success({message: 'Firma Documento Avvenuta con Successo', timeout: 3, title: 'Success', width : 220});
	    },
	    
	    koAttivaVersione : function()
	    {
	    	NS_LOADING.hideLoading();
	    	NOTIFICA.error({message: "Errore Durante Attivazione Versione", title: "Error", width: 220});
	    },
	    
	    chiudiAnteprima : function(cbk) {
	    	
	    	this.dati = {};
    		
	    	$("#butChiudi").off("click").on("click", function (){NS_FENIX_PRINT.chiudi({}); });
    		$("#fldFunzioniFirma").show();
    		$('#fldFunzioniStampa').hide();
    		
    		$("#stampa").removeClass("visible");
    		$("#stampa").addClass("invisible");
    		
    		$("#txtPin").val("");
    		$("#txtPassword").val("");
    		
    		if (typeof cbk == "function") {
    			cbk();
    		}
    		
    	},
	    
    	/**
    	 * Ridefinizione della funzione di chiusura della console di firma.
    	 * Verifica che la firma sia andata a buon fine e se si tratta della prima firma del documento.
    	 * Se l'anteprima non viene completata e stiamo firmado una versione successiva alla prima viene effettuato il rollback.
    	 */
	    chiudi : function(){
	    	
	    	var $this = this;
	    	
	    	NS_FENIX_PRINT.chiudi = $this.chiudiButton;
	    	
	    	if (!$this.dati.FIRMA_COMPLETA && !$this.dati.PRIMA_FIRMA)
	    	{
	    		$this.rollback();
	    	}
	    	
	    	$this.chiudiAnteprima();
	    	
	    },
	    
	    /**
	     * Wrapper temporaneo della funzione di chiusura dell'anteprima di stampa/firma.
	     * Se firmo alla chiusura devo intercettare se la firma è completa o se si tratta della prima firma.
	     */
	    chiudiButton : function(){},
	    
	    /**
	     * Funzione invocata in caso di errore durante il processo di firma o archiviazione.
	     * Viene ridefinita ogni volta in base al documento che si intende firmare.
	     */
	    rollback : function(){},
};

var FIRME_ADT = 
{
		SDO : 
		{
			rollback : function()
			{
				var $this = this;
				
		        var parameters = { 
    					"P_IDEN_SDO" : {t : 'N', v : $this.dati.IDEN_VERSIONE, d : 'I'},
    					"P_RESULT" : {t : 'V', d : 'O'}
    			};
		        
				var db = home.$.NS_DB.getTool({setup_default:{datasource : $this.getDati("KEY_CONNECTION")}});
		        var xhr = db.call_procedure({id: "FX$PCK_SDO.ROLLBACK_SDO", parameter : parameters});
		        
		        xhr.done(function (data, textStatus, jqXHR) {
		        	
		        	var message = data['P_RESULT'].split('|')[1];

		            var resp = JSON.parse(message);
		        
		            if (resp.success) 
		            {
	            		NOTIFICA.success({message: 'Rollback Documento Avvenuto con Successo', timeout: 3, title: 'Success', width : 220});
	            		NS_FENIX_FIRMA.LOGGER.info("Rollback - Rollback Documento Avvenuto con Successo - Time " + new Date().getTime());
		            } 
		            else 
		            {
	                    NOTIFICA.error({message: "Errore durante Rollback SDO", timeout: 6, title: "Error"});
	                    NS_FENIX_FIRMA.LOGGER.info("Rollback - Errore Durante Rollback Documento - message " + message);
	                }
		        	
		            NS_LOADING.hideLoading();
		        });
		        
		        xhr.fail(function (response) {
		        	home.NOTIFICA.error({message: "Attenzione Errore durante Rollback SDO", timeout : 6, title: "Error"});
		        	NS_FENIX_FIRMA.LOGGER.info("KO Archivia Documento - Errore Durante Rollback Documento - message " + message);
		        });
			},
			
			koArchiviaDocumento : function(resp)
		    {     
				NS_FENIX_FIRMA.LOGGER.info("KO Archivia Documento - Inizio Procedura di Rollback - Time " + new Date().getTime());
				
		    },
		    
		    koAttivaVersione : function()
		    {
		    	NS_FENIX_FIRMA.LOGGER.info("KO Archivia Documento - Inizio Procedura di Rollback - Time " + new Date().getTime());
		    	this.rollback();
		    }
		}		
};