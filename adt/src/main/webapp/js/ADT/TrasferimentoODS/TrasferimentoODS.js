var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _STATO_PAGINA = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;

$(document).ready(function () {

	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();
	
	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;
	_IDEN_ANAG = _JSON_CONTATTO.anagrafica.id;
	
    NS_TRASFERIMENTO_ODS.init();
});

var NS_TRASFERIMENTO_ODS = {
	
	init : function () {
		
		NS_TRASFERIMENTO_ODS.valorizzaPagina();
		NS_TRASFERIMENTO_ODS.setEvents();
        NS_TRASFERIMENTO_ODS.setIntestazione();
        
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_TRASFERIMENTO_ODS"});
    },

	setEvents : function() {
		
		home.NS_CONSOLEJS.addLogger({name:'TabTrasferimentoODS',console:0});
	    window.logger = home.NS_CONSOLEJS.loggers['TabTrasferimentoODS'];
	    
	    NS_FENIX_SCHEDA.registra = NS_TRASFERIMENTO_ODS.registra;
	    
		NS_TRASFERIMENTO_ODS.setIntestazione();
		NS_TRASFERIMENTO_ODS.setButtonScheda();
		
		$("#acRepAss").data("acList").changeBindValue({"iden_provenienza" : _JSON_CONTATTO.contattiGiuridici[0].provenienza.id});
	},
    
    registra : function() {

		logger.debug("Registra Trasferimento ODS - Init - " + _JSON_CONTATTO.id);

    	var idenProvenienza = $('#h-repartoAssistenziale').val();
    	var _json_assistenziale = {};
    	var p = {
    		"contatto" : _JSON_CONTATTO, 
    		"hl7Event" : "A02", 
    		"tipoTrasferimento" : "A", 
    		"notifica" : {
    			"show" : "S", 
    			"timeout" : 3 ,
    			"message" : "Trasferimento ODS Effettuato con successo", 
    			"errorMessage" : "Errore Durante Trasferimento ODS"
    		}, 
    		"cbkSuccess" : function(){ 
    			for (var i = 1; i <= $("#N_SCHEDA").val(); i++) {
    				home.NS_FENIX_TOP.chiudiScheda({"n_scheda" : i});
    			}
    			NS_FENIX.aggiorna();
    		}
    	};
    	
    	if (!NS_FENIX_SCHEDA.validateFields()){
            return false;
        }

    	$.extend(_json_assistenziale,_JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length -1]);
        
        // Controllo che si stia tentando di fare un trasferimento assistenziale presso lo stesso reparto
    	if (_json_assistenziale.provenienza.id == idenProvenienza) {
    		return home.NOTIFICA.error({message: "Il paziente &egrave; gi&agrave; ubicato nel reparto selezionato", timeout: 5, title: "Error"});
    	}
        
        if (idenProvenienza == null || idenProvenienza === "") {
        	return home.NOTIFICA.warning({message: "Attenzione. Popolare Correttamente il Reparto Assistenziale", title: "Warning"});
        }
        
    	// Trasferimento Assistenziale
        _json_assistenziale.stato = {id : null, codice : "ADMITTED"};
		_json_assistenziale.accesso = false;
		_json_assistenziale.attivo = true;
        _json_assistenziale.mapMetadatiString['AMBULANZA'] = "N";
        _json_assistenziale.mapMetadatiString['DATA_PARTENZA_AMBULANZA'] = null;
        _json_assistenziale.mapMetadatiString['DATA_ARRIVO_AMBULANZA'] = null;
        
        _json_assistenziale.note = "Trasferimento Assistenziale ODS da " + _json_assistenziale.provenienza.id + " a " + idenProvenienza;
        _json_assistenziale.dataInizio = $("#h-txtDataInizio").val() + $("#txtOraInizio").val();
        _json_assistenziale.provenienza =  {id : idenProvenienza, codice : null, idCentroDiCosto : null};
        _json_assistenziale.precedente = {id : _json_assistenziale.id};
		_json_assistenziale.parent = {id : _JSON_CONTATTO.contattiAssistenziali[0].id};
        _json_assistenziale.id = null;

        _json_assistenziale.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};

		logger.debug("Registra Trasferimento ODS - JSON Contatto Assistenziale - " + JSON.stringify(_json_assistenziale));

        var isPrecedenteAccesso = _JSON_CONTATTO.contattiAssistenziali[_JSON_CONTATTO.contattiAssistenziali.length - 1].accesso;

		/*
		// se ci sono trasferimenti di accesso attivi essetto un trasferimento assistenziale su quest ultimo
		// questo al fine di avere un solo trasferimento di accesso attivo
		for (var i = 0; i < _JSON_CONTATTO.contattiAssistenziali.length; i++)
		{
			if (!(_JSON_CONTATTO.contattiAssistenziali[i].accesso)){
				continue;
			}
			if (_JSON_CONTATTO.contattiAssistenziali[i].stato.codice == "ADMITTED"){
				isPrecedenteAccesso = true;
			}
		}
		*/

		logger.debug("Registra Trasferimento ODS - Precedente Trasferimento Assistenziale -> " + isPrecedenteAccesso);

		p.contatto = _json_assistenziale;

		if (isPrecedenteAccesso){
			p.contatto = _json_assistenziale;
    		NS_CONTATTO_METHODS.trasferisiciAccesso(p);
		} else {
			_JSON_CONTATTO.contattiAssistenziali.push(_json_assistenziale);
			p.contatto = _JSON_CONTATTO;

			NS_CONTATTO_METHODS.transferPatient(p);
		}
    },
    
	setButtonScheda : function() {
		
 		$('.butSalva, .butChiudi').show();


		if (_STATO_PAGINA == 'L' || _JSON_CONTATTO.stato.codice == 'DISCHARGED') {
 			$(".butSalva").hide(); 	
 		}
 		
	},
	
	valorizzaPagina : function() {
		
		$('#txtCartella').val(_JSON_CONTATTO.codice.codice);
		$('#txtDataRicovero').val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'));
		$('#txtOraRicovero').val(moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('HH:mm'));
		
		$('#txtRepartoAttualeGiuridico').val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.descrizione);
		
		// Ciclo i segmenti assistenziali per essere sicuro di prendere quello attivo
		for (var y = _JSON_CONTATTO.contattiAssistenziali.length - 1; y >= 0; y--) 
		{
			if (_JSON_CONTATTO.contattiAssistenziali[y].attivo)
			{
				$('#txtRepartoAttualeAssistenziale').val(_JSON_CONTATTO.contattiAssistenziali[y].provenienza.descrizione);
			}
		}
		
	},
	
	setIntestazione : function(){

		$('#lblTitolo').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);

		// Button in alto a destra per il print degli errori della pagina
		$("#butPrintVideata").remove();
		$("#lblTitolo").css({"width":"80%","display":"inline"});
		$(".headerTabs").append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));
	}
};