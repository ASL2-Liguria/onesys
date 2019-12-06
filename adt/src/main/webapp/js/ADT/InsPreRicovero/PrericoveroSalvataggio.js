var NS_PRERICOVERO_SALVATAGGI = {

		registraInserimento : function()
		{
			var dataInizio = $('#h-txtDataPre').val() + $('#txtOraPre').val();
	        var tipoPrericovero = $("#cmbTipoPreRicovero").find("option:selected").val();
	        _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoEmpty();
	        _JSON_CONTATTO.anagrafica.id = $('#IDEN_ANAG').val();
	        _JSON_CONTATTO.urgenza = {codice : $('#h-cmbLivelloUrg').val(), id : null};
            _JSON_CONTATTO.dataInizio = dataInizio;
	        _JSON_CONTATTO.stato = {id : null, codice : 'ADMITTED'};
			_JSON_CONTATTO.setTipo(tipoPrericovero);

	       // _JSON_CONTATTO.tipo = {id : null, codice : 'PRE'};
	        _JSON_CONTATTO.regime = {id : null, codice : '3'};
			_JSON_CONTATTO.codice.assigningAuthorityArea = "ADT";
	        _JSON_CONTATTO.uteInserimento.id = home.baseUser.IDEN_PER;
	        _JSON_CONTATTO.uteAccettazione.id = home.baseUser.IDEN_PER;

	        // Gestione CDC Destinatario
	        if ($('#cmbReparto option:selected').attr("data-abilita_vpo") === "S")
	        {
	        	_JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"] = $("#h-txtRepartoDestinazione").val();
	        }

	        _JSON_CONTATTO.contattiGiuridici[0].provenienza = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiGiuridici[0].dataInizio = dataInizio;
	        _JSON_CONTATTO.contattiGiuridici[0].regime = {id : null, codice : '3'};
	        _JSON_CONTATTO.contattiGiuridici[0].tipo.codice = 'PRE';
	        _JSON_CONTATTO.contattiGiuridici[0].stato = {id : null, codice : 'ADMITTED'};
	        _JSON_CONTATTO.contattiGiuridici[0].uteInserimento.id = home.baseUser.IDEN_PER;
	        _JSON_CONTATTO.contattiGiuridici[0].note = "Contatto Giuridico PRE-RICOVERO aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

	        _JSON_CONTATTO.contattiAssistenziali[0].provenienza = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiAssistenziali[0].dataInizio = dataInizio;
	        _JSON_CONTATTO.contattiAssistenziali[0].stato = {id : null, codice : 'ADMITTED'};
	        _JSON_CONTATTO.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;
	        _JSON_CONTATTO.contattiAssistenziali[0].note = "Contatto Assistenziale PRE-RICOVERO aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			var p = {"contatto" : _JSON_CONTATTO, "hl7Event" : "A05", "notifica" : {"show" : "S", "message" : "Inserimento Pre-ricovero Avvenuto Correttamente", "errorMessage" : "Errore Durante Inserimento Pre-ricovero", "timeout" : 3}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({'refresh' : true});}};

			if(_ORIGINE === 'LISTA_ATTESA')
			{
	            p.cbkSuccess = function(){
	            	_JSON_CONTATTO = NS_CONTATTO_METHODS.contatto;
	            	NS_PRERICOVERO_SALVATAGGI.inserisiciEsitoListaAttesa();};
	        }

			NS_CONTATTO_METHODS.preAdmitVisitNotification(p);
		},

		registraModifica : function()
		{
			var dataInizio = $('#h-txtDataPre').val() + $('#txtOraPre').val();

			_JSON_CONTATTO.dataInizio = dataInizio;
			_JSON_CONTATTO.urgenza = {codice : $('#h-cmbLivelloUrg').val(), id : null};
			_JSON_CONTATTO.uteModifica.id = home.baseUser.IDEN_PER;

	        // Gestione CDC Destinatario
	        if ($('#cmbReparto option:selected').attr("data-abilita_vpo") === "S")
	        {
	        	_JSON_CONTATTO.mapMetadatiString["CDC_DESTINAZIONE_VPO"] = $("#h-txtRepartoDestinazione").val();
	        }

	        _JSON_CONTATTO.contattiGiuridici[0].dataInizio = dataInizio;
	        _JSON_CONTATTO.contattiGiuridici[0].provenienza = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiGiuridici[0].cdc = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;
	        _JSON_CONTATTO.contattiGiuridici[0].note = "Contatto Giuridico PRE-RICOVERO modificato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

	        _JSON_CONTATTO.contattiAssistenziali[0].dataInizio = dataInizio;
	        _JSON_CONTATTO.contattiAssistenziali[0].provenienza = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiAssistenziali[0].cdc = {id : null, idCentroDiCosto : $('#cmbReparto option:selected').attr("data-value"), codice : null, descrizione : null};
	        _JSON_CONTATTO.contattiAssistenziali[0].uteModifica.id = home.baseUser.IDEN_PER;
	        _JSON_CONTATTO.contattiAssistenziali[0].note = "Contatto Assistenziale PRE-RICOVERO modificato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

	        NS_CONTATTO_METHODS.updatePatientInformation({"contatto" : _JSON_CONTATTO, "hl7Event" : "A08", "notifica" : {"show": "S", "message" : "Modifica pre-ricovero Avvenuta Correttamente", "errorMessage" : "Errore Durante"}, "cbkSuccess" : function(){NS_FENIX_SCHEDA.chiudi({refresh:true});}});
		},

		inserisiciEsitoListaAttesa : function() {

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

	        var parametri = {
	        		P_IDEN : {v : $('#IDEN_LISTA').val(), t : "N"},
	        		P_STATO : {v : _JSON_CONTATTO.regime.codice === "3" ? "ESITO_PRERICOVERO" : "ESITO_RICOVERO", t : "V"},
	        		P_IDEN_CONTATTO : {v : _JSON_CONTATTO.id, t : "N"},
	        		P_UTENTE_MODIFICA : {v : home.baseUser.IDEN_PER, t : "N"}
			};

	        logger.debug("Inserimento Esito PZ Lista PRE-RICOVERO - NS_PRERICOVERO_SALVATAGGI.registra - parametri -> " + JSON.stringify(parametri));

			var xhr = db.call_procedure(
			{
				id: "FX$PCK_LISTA_ATTESA_PZ.MODIFICA",
				parameter : parametri
			});

			xhr.done(function (data, textStatus, jqXHR)
			{
				logger.info("Inserimento Esito PZ Lista PRE-RICOVERO SUCCESS - NS_PRERICOVERO_SALVATAGGI.inserisiciEsitoListaAttesa - Inserimento esito lista di Attesa Avvenuto con Successo");
				home.NOTIFICA.success({message: 'Posizione in Lista di attesa sfociata in pre-ricovero', timeout: 5, title: 'Success'});
				NS_PRERICOVERO.getUrlCartellaPaziente(_JSON_CONTATTO.codice.codice, function(){ setTimeout(function(){ NS_FENIX_SCHEDA.chiudi({'refresh' : true}); }, 2000); });
			});

			xhr.fail(function (response) {
				logger.error("Inserimento Esito PZ Lista PRE-RICOVERO ERROR - NS_PRERICOVERO_SALVATAGGI.inserisiciEsitoListaAttesa - Inserimento esito lista di Attesa in ERRORE!" + JSON.stringify(response));
				home.NOTIFICA.error({message: "Errore Durante Salvataggio Esito Paziente in Lista di Attesa", timeout: 10, title: "Error"});
				NS_FENIX_SCHEDA.chiudi({'refresh' : true});
			});
		}
};