jQuery(document).ready(function () {
	NS_DELETE_LISTA_ATTESA.init();
});

var NS_DELETE_LISTA_ATTESA = {
		
		init : function(){
				
			NS_DELETE_LISTA_ATTESA.setIntestazione();
			NS_DELETE_LISTA_ATTESA.overrideRegistra();
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_LISTA_ATTESA_DELETE"});
			
            $("#txtUtente").val(home.baseUser.DESCRIZIONE).attr("disabled");
		},
	        
		setIntestazione : function(){
				
			var _json_anagrafica = NS_ANAGRAFICA.Getter.getAnagraficaById($('#IDEN_ANAG').val());
				
			$('#lblTitolo').html("Annullamento - " + _json_anagrafica.cognome + ' ' + _json_anagrafica.nome + ' - ' + _json_anagrafica.sesso + ' - ' + moment(_json_anagrafica.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _json_anagrafica.codiceFiscale);
	    },
        
	    overrideRegistra : function(){
	    	NS_FENIX_SCHEDA.registra = NS_DELETE_LISTA_ATTESA.registra;
	    },
			
		/**
		 * Invoca la procedura FX$PCK_LISTA_ATTESA_PAZIENTI.ANNULLA.
		 * La cancellazione viene consentita solo se il pre-ricovero associato non è sfociato a sua volta in un ricovero.
		 * 
		 * @author alessandro.arrighi
		 */
		registra : function(){
 
			// Posizione in lista di attesa
			var _iden_lista = $('#IDEN_LISTA_ATTESA').val();
			// Numero di ricoveri scaturiti dal PRE-RICOVERO
			var _n_ricoveri = jsonData.N_RICOVERI;
			// Stato della posizione in lista di attesa
			var _stato_lista = jsonData.STATO_LISTA;
			
			var _iden_prericovero = jsonData.IDEN_CONTATTO;
			
			if (!NS_FENIX_SCHEDA.validateFields()) {
	        	return;
	        }
	    	
			if (_stato_lista === "ESITO_PRERICOVERO"  && _n_ricoveri > 0)
			{
				return home.NOTIFICA.warning({message: "Il pre-ricovero scaturito dalla posizione &egrave; sfociato a sua volta in ricovero. Impossibile proseguire", timeout: 0, title: "Attenzione"});
			}
			
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	    	
	        var parametriLista = {
	        		P_IDEN : {v : _iden_lista, t : "N"},
	        		P_MOTIVO : {v : $('#txtMotivoDelete').val(), t : "V"},
	        		P_DATA_FINE : {v : moment().format("YYYYMMDD HH:mm:ss") , t : "T"},	        		
	        		P_UTENTE_MODIFICA : {v : home.baseUser.IDEN_PER, t : "N"}
			};
	        
	        var xhr = db.call_procedure(
			{
				id: "FX$PCK_LISTA_ATTESA_PAZIENTI.ANNULLA",
				parameter : parametriLista
			});	
			
			xhr.done(function (data, textStatus, jqXHR) 
			{
				home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
				
				if (_iden_prericovero > 0){
					NS_DELETE_LISTA_ATTESA.cancellaPrericovero(_iden_prericovero);
				} else {
					NS_FENIX_SCHEDA.chiudi({'refresh' : true});
				}
				
			});
			
			xhr.fail(function (response) {
				logger.error("Rimozione PZ Lista Attesa - XHR FAIL - NS_DELETE_LISTA_ATTESA.registra - Rimozione PZ in ERRORE -> " + JSON.stringify(response));
				home.NOTIFICA.error({message: "Rimozione Paziente da Lista Attesa in Errore", timeout: 0, title: "Error"});
			});
			
		},
		
		cancellaPrericovero : function(idenPrericovero){
			
			var _json_contatto = NS_CONTATTO_METHODS.getContattoById(idenPrericovero);
        	_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
        	_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
        	_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
        	_json_contatto.mapMetadatiString['MOTIVO_CANCELLAZIONE_RICOVERO'] = $('#txtMotivoDelete').val();
        	
        	var pCancel = {"contatto" : _json_contatto, hl7Event : "A11", "updateBefore": true, "notifica" : {"show" : "S", "timeout" : 3, "message" : "Cancellazione pre-icovero Avvenuta Con Successo", "errorMessage" : "Errore Durante la cancellazione del pre-ricovero"}, "cbkSuccess" : function(){ NS_FENIX_SCHEDA.chiudi({'refresh' : true}); }, "cbkError" : function(){}};
    		
        	NS_CONTATTO_METHODS.cancelPreAdmission(pCancel);
		}
};