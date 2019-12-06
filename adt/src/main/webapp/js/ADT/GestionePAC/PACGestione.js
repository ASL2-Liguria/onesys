var _STATO_PAGINA = null;
var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;

jQuery(document).ready(function () {

	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_ANAG = $('#IDEN_ANAGRAFICA').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();

	if(_STATO_PAGINA !== 'I')
    {
    	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
    	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;
    }
	
	if(_STATO_PAGINA === 'I')
    {
		_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoEmpty();
    	_JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(_IDEN_ANAG);
    }
	
	NS_PAC.setIntestazione();
    NS_PAC.init();
    
});

var NS_PAC = {
	
	init : function() {
		
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_GESTIONE_PAC"});
        NS_PAC.setEvents();
    },
	
	setEvents : function(){
		
		home.NS_CONSOLEJS.addLogger({name:'INSERISICI_PAC',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['INSERISICI_PAC'];
        
        NS_FENIX_SCHEDA.registra = _STATO_PAGINA === "E" ? NS_PAC.registraModifica : NS_PAC.registraInserimento;

		if (_JSON_CONTATTO.stato.codice !== "DISCHARGED")
        {
        	$("#txtDataFinePAC, #txtOraFinePAC").attr("disabled","disabled");
        };
        
        if (_STATO_PAGINA !== "I")
        {
        	NS_PAC.aggiornaPagina();
        	NS_PAC_WK_ACCESSI.init();
        };
        
        if (_STATO_PAGINA === "L")
        {
        	$(".butSalva").hide();
        };
        
	},
	
	/**
	 * Se modifico la data di inizio del pac propongo la modifica della data del primo accesso.
	 * Nella maggior parte dei casi le due date coincidono.
	 * 
	 * @author alessandro.arrighi
	 * @param data
	 */
	setDataPrimoAccesso : function(data) {
		
		var daData = $("#txtDataPrimoAccessoPAC" ).data('Zebra_DatePicker');
		daData.setDataIso(data);
		
	},
	aggiornaPagina : function(){
		
		_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
		
		var dataPrenotazione = _JSON_CONTATTO.mapMetadatiString["DATA_PRENOTAZIONE"];
		
		$("#cmbReparto").val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.id);
        $("#h-txtDataInizioPAC").val(moment(_JSON_CONTATTO.dataInizio,"YYYYMMDDHH:mm").format("YYYYMMDD"));
        $("#txtDataInizioPAC").val(moment(_JSON_CONTATTO.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"));
        
        if (dataPrenotazione !== null && dataPrenotazione !== "") {
        	$("#h-txtDataPrenotazionePAC").val(moment(_JSON_CONTATTO.mapMetadatiString["DATA_PRENOTAZIONE"],"YYYYMMDDHH:mm").format("YYYYMMDD"));
        	$("#txtDataPrenotazionePAC").val(moment(_JSON_CONTATTO.mapMetadatiString["DATA_PRENOTAZIONE"],"YYYYMMDDHH:mm").format("DD/MM/YYYY"));
        }
        
        $("#h-txtDataPrimoAccessoPAC").val(moment(_JSON_CONTATTO.contattiAssistenziali[0].dataInizio,"YYYYMMDDHH:mm").format("YYYYMMDD"));
        $("#txtDataPrimoAccessoPAC").val(moment(_JSON_CONTATTO.contattiAssistenziali[0].dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"));
        $("#txtOraInizioPrimoAccessoPAC").val(moment(_JSON_CONTATTO.contattiAssistenziali[0].dataInizio,"YYYYMMDDHH:mm").format("HH:mm"));
        
        if (_JSON_CONTATTO.contattiAssistenziali[0].dataFine != null) {
        	$("#txtOraFinePrimoAccessoPAC").val(moment(_JSON_CONTATTO.contattiAssistenziali[0].dataFine,"YYYYMMDDHH:mm").format("HH:mm"));
        }
        
        $("#cmbCodPAC").val(_JSON_CONTATTO.contattiGiuridici[0].percorsoCure.id);
        
        if (_JSON_CONTATTO.stato.codice === "DISCHARGED")
        {
        	$("#h-txtDataFinePAC").val(moment(_JSON_CONTATTO.dataFine,"YYYYMMDDHH:mm").format("YYYYMMDD"));
            $("#txtDataFinePAC").val(moment(_JSON_CONTATTO.dataFine,"YYYYMMDDHH:mm").format("DD/MM/YYYY"));
        }
        
        for (var i = 0; i < _JSON_CONTATTO.codiciICD.mapCodiciICD.length; i++){
			
			if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].key == 'DIAGNOSI')
			{
				$("#txtDiagnosiICD9").val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[0].codice + ' - ' + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[0].descrizione);
				$("#h-txtDiagnosiICD9").val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[0].codice);
				$("#txtDiagnosiICD9").attr("data-c-codice",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[0].codice);
				$("#txtDiagnosiICD9").attr("data-c-value",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[0].codice);
			}
			else if (_JSON_CONTATTO.codiciICD.mapCodiciICD[i].key == 'PROCEDURE')
			{
				for (var j = 0; j < _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value.length; j++)
				{
					$("#InterventiICD9" + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].ordine).val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice + ' - ' + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].descrizione);
					$("#h-InterventiICD9" + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].ordine).val(_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
					$("#InterventiICD9" + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].ordine).attr("data-c-codice",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
					$("#InterventiICD9" + _JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].ordine).attr("data-c-value",_JSON_CONTATTO.codiciICD.mapCodiciICD[i].value[j].codice);
				}
			}
		}
	},
	
	registraInserimento : function() {
		 
		if (!NS_FENIX_SCHEDA.validateFields()) {
			return;
	    }
        
		var pA01 = {"contatto" : NS_PAC.valorizzaContatto(), "hl7Event" : "A01", "notifica" : {"show" : "S", "message" : "Inserimento PAC Avvenuto Correttamente", "errorMessage" : "Errore Durante Inserimento PAC", "timeout" : 3}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({"refresh" : true});}};
		
		NS_CONTATTO_METHODS.admitVisitNotification(pA01);
	},
	
	registraModifica : function()
	{
		if (!NS_FENIX_SCHEDA.validateFields()) {
			return;
	    }
		
		var pA08 = {"contatto" : NS_PAC.valorizzaContatto(), "hl7Event" : "A08", "notifica" : {"show": "S", "message" : "Modifica Intervento PAC Avvenuta Correttamente", "errorMessage" : "Errore Durante Modifica Intervento PAC"}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({"refresh" : true});}};
        
		NS_CONTATTO_METHODS.updatePatientInformation(pA08);
	},
	
	valorizzaContatto : function(){
	
		var dataInizio =  $('#h-txtDataInizioPAC').val(); dataInizio =  dataInizio !== "" && dataInizio != null ? dataInizio + "00:00" : null;
		var dataPrenotazione = $('#h-txtDataPrenotazionePAC').val(); dataPrenotazione = dataPrenotazione != null && dataPrenotazione !== "" ? dataPrenotazione + "00:00" : null;
		var dataInizioAccesso = $('#h-txtDataPrimoAccessoPAC').val() + $("#txtOraInizioPrimoAccessoPAC").val();
		var dataFineAccesso = $("#txtOraFinePrimoAccessoPAC").val() != null && $("#txtOraFinePrimoAccessoPAC").val() !== "" ? $('#h-txtDataPrimoAccessoPAC').val() + $("#txtOraFinePrimoAccessoPAC").val() : null;
		
		_JSON_CONTATTO.codice.assigningAuthorityArea = "AMB";
        _JSON_CONTATTO.codice.assigningAuthority = "FENIX";
        _JSON_CONTATTO.anagrafica.id = $('#IDEN_ANAGRAFICA').val();
        _JSON_CONTATTO.dataInizio = dataInizio;
		_JSON_CONTATTO.dataFine = null;
        _JSON_CONTATTO.stato = {id : null, codice : _STATO_PAGINA === "I" ? "ADMITTED" : _JSON_CONTATTO.stato.codice};      
        _JSON_CONTATTO.tipo = {id : null, codice : 'PAC'};
        _JSON_CONTATTO.regime = {id : null, codice : 'AMB'};
        _JSON_CONTATTO.mapMetadatiString["DATA_PRENOTAZIONE"] = dataPrenotazione;
        _JSON_CONTATTO[_STATO_PAGINA === "I" ? "uteAccettazione" : "uteModifica"].id = home.baseUser.IDEN_PER;
        _JSON_CONTATTO[_STATO_PAGINA === "I" ? "uteInserimento" : "uteModifica"].id = home.baseUser.IDEN_PER;
        
        if (_JSON_CONTATTO.stato.codice === "DISCHARGED")
        {
        	var dataFine = $('#h-txtDataFinePAC').val(); dataFine = dataFine !== "" && dataFine != null ? dataFine + "00:00" : null;
        	_JSON_CONTATTO.dataFine = dataFine;
        }	
        
        // Resetto Diagnosi e Interventi
        _JSON_CONTATTO.codiciICD.mapCodiciICD = [];
        
        if ($("#txtDiagnosiICD9").val() != "")
        {
	        var diagnosiICD =
	        {
	        		"key" :  "DIAGNOSI", value : [
	        		{
	        			"descrizione": $("#txtDiagnosiICD9").val(),
	        			"evento": { 
	        				"descrizione": null,
	        				"id": null,
	        				"codice": "A01"
	        			},
	        			"data": null,
	        			"ordine": 0,
	        			"id": null,
	        			"codice": $("#h-txtDiagnosiICD9").val()
	        		}]
	        };
	        
	        _JSON_CONTATTO.codiciICD.mapCodiciICD.push(diagnosiICD);
        }
        
        // Il PAC prevede al massimo due interventi
        // Definisco una struttura di interventi vuota che associo al contatto solo se almeno uno è valorizzato
        var interventiICD = { "key" :  "PROCEDURE", value : [] };
        
        if ($("#InterventiICD90").val() != "")
        {
	        var interventoI =
	        {
    			"descrizione": $("#InterventiICD90").val(),
    			"evento": { 
    				"descrizione": null,
    				"id": null,
    				"codice": "A01"
    			},
    			"data": null,
    			"ordine": 0,
    			"id": null,
    			"codice": $("#h-InterventiICD90").val()
	        };
	        
	        interventiICD.value.push(interventoI);
        }
        
        if ($("#InterventiICD91").val() != "")
        {
        	var interventoII =
	        {
    			"descrizione": $("#InterventiICD91").val(),
    			"evento": { 
    				"descrizione": null,
    				"id": null,
    				"codice": "A01"
    			},
    			"data": null,
    			"ordine": 1,
    			"id": null,
    			"codice": $("#h-InterventiICD91").val()
	        };
	        
        	interventiICD.value.push(interventoII);
        }
        
        if (interventiICD.value.length > 0){
        	_JSON_CONTATTO.codiciICD.mapCodiciICD.push(interventiICD);
        }
        
        _JSON_CONTATTO.contattiGiuridici[0].dataInizio = dataInizio;
        _JSON_CONTATTO.contattiGiuridici[0].stato = {id : null, codice : 'ADMITTED'};
        _JSON_CONTATTO.contattiGiuridici[0].regime = {id : null, codice : 'AMB'};
        _JSON_CONTATTO.contattiGiuridici[0].tipo.codice = 'PAC';
        _JSON_CONTATTO.contattiGiuridici[0].percorsoCure = {id : $("#cmbCodPAC option:selected").val(), codice : null};
        _JSON_CONTATTO.contattiGiuridici[0].provenienza = {id : $('#cmbReparto option:selected').attr("data-value"), idCentroDiCosto : null, codice : null, descrizione : null};
        _JSON_CONTATTO.contattiGiuridici[0][_STATO_PAGINA === "I" ? "uteInserimento" : "uteModifica"].id = home.baseUser.IDEN_PER;
        _JSON_CONTATTO.contattiGiuridici[0].note = "Accesso PAC aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

		_JSON_CONTATTO.contattiAssistenziali[0].accesso = true;
        _JSON_CONTATTO.contattiAssistenziali[0].stato = {id : null, codice : 'ADMITTED'};
        _JSON_CONTATTO.contattiAssistenziali[0].provenienza = {id : $('#cmbReparto option:selected').attr("data-value"), idCentroDiCosto : null, codice : null, descrizione : null};
        _JSON_CONTATTO.contattiAssistenziali[0].dataInizio = dataInizioAccesso;
        _JSON_CONTATTO.contattiAssistenziali[0].dataFine = dataFineAccesso;
        _JSON_CONTATTO.contattiAssistenziali[0][_STATO_PAGINA === "I" ? "uteInserimento" : "uteModifica"].id = home.baseUser.IDEN_PER;
        _JSON_CONTATTO.contattiAssistenziali[0].note = "Accesso PAC aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

        return _JSON_CONTATTO;
	},
	
	setIntestazione : function(){

		$('#lblTitle').html(_JSON_ANAGRAFICA.cognome + ' ' + _JSON_ANAGRAFICA.nome + ' - ' + _JSON_ANAGRAFICA.sesso + ' - ' + moment(_JSON_ANAGRAFICA.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + _JSON_ANAGRAFICA.codiceFiscale);

		// Button in alto a destra per il print degli errori della pagina
		$("#butPrintVideata").remove();
		$(".headerTabs").append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));
		$("#lblTitle").css({"width":"80%","display":"inline"});

	}
};