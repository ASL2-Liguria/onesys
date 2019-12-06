var NS_ANAGRAFICA = {
		
		Getter : {
			
			getAnagrafica : function(p) {
				
				var url = p.urlPattern + "/" + p.type + "/" + p.value;
				var anagrafica = null;

				$.ajax({
					   url: url,
					   dataType:'json',
					   cache : false,
					   error:function(data){
                            logger.error("Errore getAnagrafica -> "+ JSON.stringify(data));
                            return {};
					   },
					   success:function(data){
	                        anagrafica =  data.anagrafica;
					   },
	                   async:   false

				});
				
				return anagrafica;
			},
			
			getAnagraficaById : function(value) {
				return NS_ANAGRAFICA.Getter.getAnagrafica({"urlPattern" : "anagrafica/GetAnagraficaById", "type" : "string", "value" : value});
			},
			
			getAnagraficaByCodiceFiscale : function() {
				
			}
		},
		
		Check : {
			
			checkDatiFondamentali : function(_json_anagrafica, sconosciuto) {

				var isSconosiuto = typeof sconosciuto == "undefined" ? false : sconosciuto;
				var isNeonato = moment().diff(moment(_json_anagrafica.dataNascita, 'YYYYMMDD'), 'day') <= 3;
				var campiNonValorizzati = new Array();
	    		
	    		if (_json_anagrafica.nome == null || _json_anagrafica.nome == "") {
	    			campiNonValorizzati.push("Nome");
				}
				
				if (_json_anagrafica.cognome == null || _json_anagrafica.cognome == "") {
					campiNonValorizzati.push("Cognome");
				}
				
				if (!isNeonato && (_json_anagrafica.codiceFiscale == null || _json_anagrafica.codiceFiscale == "")) {
					campiNonValorizzati.push("Codice Fiscale");
				}
				
				if (_json_anagrafica.sesso == null) {
					campiNonValorizzati.push("Sesso");
				}
				
				if (isSconosiuto) {
					return campiNonValorizzati;
				}
				
				if (_json_anagrafica.dataNascita == null) {
	    			campiNonValorizzati.push("Data di Nascita");
	    		}
				
				if (_json_anagrafica.comuneResidenza.regione.codice == null) {
					campiNonValorizzati.push("Regione di Residenza");
				}
				
	    		if (_json_anagrafica.comuneNascita.id == null) {
	    			campiNonValorizzati.push("Comune Nascita");
	    		}
	    		
				if (_json_anagrafica.comuneResidenza.id == null) {
					campiNonValorizzati.push("Comune Residenza");
				}
				
				if (_json_anagrafica.comuneResidenza.indirizzo == null) {
					campiNonValorizzati.push("Indirizzo di Residenza");
				}
				
				if (_json_anagrafica.comuneResidenza.cap == null) {
					campiNonValorizzati.push("CAP di Residenza");
				}
				
				if (_json_anagrafica.titoloStudio.id == null) {
					campiNonValorizzati.push("Titolo di Studio");
				}
				
				if (_json_anagrafica.statoCivile.id == null) {
					campiNonValorizzati.push("Stato Civile");
				}
				
				if (_json_anagrafica.cittadinanze.length == 0) {
					campiNonValorizzati.push("Cittadinanza");
				}
				
				if (_json_anagrafica.nazionalita.id == null) {
					campiNonValorizzati.push("Nazionalit&agrave;");
				}
				
				if (_json_anagrafica.comuneResidenza.asl.codice == null) {
					campiNonValorizzati.push("ASL di Residenza");
				}
				
				return campiNonValorizzati;
			}			
		}
};