jQuery(document).ready(function () {
    NS_HOME_PAC.init();
    NS_HOME_PAC.setEvents();
});

var NS_HOME_PAC =
{
    tab : null,
    tab_sel : null,

    init : function () {

    	home.HOME_PAC = NS_HOME_PAC;

    	NS_HOME_PAC.initLogger();

        if($("#TAB_SEL").val() != null && $("#TAB_SEL").val() != '' ){
            home.tabAttivo=  $("#TAB_SEL").val();
        }

        $("#divWk").css({'height':document.body.offsetHeight  - $("#filtri").height() - 15 });

        NS_FENIX_WK.beforeApplica = NS_HOME_PAC_WK.beforeApplica;

        NS_HOME_PAC.tab_sel = "filtroPACAperti";
        NS_HOME_PAC_WK.caricaWkPACAperti();

        if(typeof home.tabAttivo !== 'undefined')
        {
            $('#tabs-Worklist li#' + home.tabAttivo).trigger("click");

            NS_HOME_PAC.tab_sel = $('#tabs-Worklist li#' + home.tabAttivo).attr('data-tab');
            NS_HOME_PAC_WK.caricaWk();
        };

    },

    setEvents : function () {

        $('#tabs-Worklist').children().click(function(){
            NS_HOME_PAC.tab_sel = $(this).attr('data-tab');
            NS_HOME_PAC_WK.caricaWk();
        });

        // Allineo il comportamento del tasto invio su un filtro a quello del tasto applica
    	// Vedi NS_FENIX_WK.setInputEnterEvent e NS_FENIX_WK.setApplicaEvent
    	$("table.tblFiltri input").off("keypress").on("keypress", function (e)
		{
			if (e.keyCode === 13)
			{
				$("input", "table.tblFiltri").each(function(){$(this).val($(this).val().toUpperCase());});

				if(!NS_FENIX_WK.beforeApplica())
				{
					NS_FENIX_WK.setApplicaEvent();
					return false;
				}
				NS_FENIX_FILTRI.applicaFiltri(NS_FENIX_WK.params);
			}
		});

    },

    chiudiPAC : function(rec)
    {
    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
    	var _accessi_aperti = false;
    	var _table = $(	"<table><tr><td><div id='gestioneChiusuraPAC'></div></td></tr><tr><td id='tdOraChiusuraPAC' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataChiusuraPAC'/><input type='text' id='txtOraChiusuraPAC' class='tdObb' /></td></tr></table>");


        // Verifico la presenza di accessi aperti
        for (var i = 0; i < _json_contatto.contattiAssistenziali.length; i++ )
        {
        	if (_json_contatto.contattiAssistenziali[i].stato.codice === "ADMITTED")
        	{
        		_accessi_aperti = true;
        		_json_contatto.contattiAssistenziali[i].attivo = false;
        		_json_contatto.contattiAssistenziali[i].stato = {id : null, codice : "DISCHARGED"};
        		_json_contatto.contattiAssistenziali[i].uteModifica.id = home.baseUser.IDEN_PER;
    			_json_contatto.contattiAssistenziali[i].note  = "Accesso PAC chiuso in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

        	}
        }

        var completaChiusuraPAC = function(){

			logger.debug("Chiusura DSA - Init");

        	var _ora = $('#txtOraChiusuraPAC').val();
         	var _data = $('#h-txtDataChiusuraPAC').val();

             if (_data === "" || _data == null) {
             	return home.NOTIFICA.error({message: "Selezionare la data di chiusura del PAC", timeout: 6, title: 'Error'});
             }

             if (_ora.length < 5) {
             	return home.NOTIFICA.error({message: "Popolare correttamente l'ora di chiusura del PAC", timeout: 6, title: 'Error'});
             }

			logger.debug("Chiusura DSA - Data fine -> " + _data + ", Ora -> " + _ora);

			var hasAccessoBefore = false;
			for (var i = 0; i < _json_contatto.contattiAssistenziali.length; i++){
				logger.debug("Chiusura DSA - Data Accesso  -> " + moment(_json_contatto.contattiAssistenziali[i].dataInizio,"YYYYMMDDHH:mm").format("YYYYMMDDHH:mm") + ", Data chiusura (_data) -> " + moment(_data + _ora,"DD/MM/YYYYHH:mm").format("YYYYMMDDHH:mm"));
				if(moment(_json_contatto.contattiAssistenziali[i].dataInizio,"YYYYMMDDHH:mm").isBefore(moment(_data + _ora,"DD/MM/YYYYHH:mm"))){
					hasAccessoBefore = true;
				}
			}

			logger.debug("Chiusura DSA - hasAccessoBefore -> " + hasAccessoBefore);

			_json_contatto.uteDimissione.id = home.baseUser.IDEN_PER;
			_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora;
			_json_contatto.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : null ,codice : '2'};

			_json_contatto.contattiGiuridici[0].dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora;
			_json_contatto.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiGiuridici[0].note = "Contatti Giuridico PAC chiuso in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			logger.debug("Chiusura DSA - Set Stato Cartella INCOMPLETA - Init ");

			var registraChiusuraPAC = function(){

				var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

				var parametri = {
					pStato : {v : '00', t : "V"},
					pIdenContatto : {v :  _json_contatto.id , t : "N"},
					pIdenPer : {v : home.baseUser.IDEN_PER, t : "N"},
					pArchivio : {v :Number(_json_contatto.contattiGiuridici[0].provenienza.idCentroDiCosto), t : "N"},
					pData : {v : moment(_json_contatto.dataInizio, 'YYYYMMDDh:mm').format("DD/MM/YYYY h:mm"), t : "V"},
					P_RESULT : {t : "V", d : "O"}
				};

				logger.debug("Set Stato Cartella INCOMPLETA - parametri -> " + JSON.stringify(parametri));

				var xhr = db.call_procedure(
					{
						id: "ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella",
						parameter : parametri
					});

				xhr.done(function (data)
				{
					if (data['P_RESULT'] === 'OK')
					{
						logger.info("Set Stato Cartella INCOMPLETA - Set Stato Cartella Avvenuto con SUCCESSO");
						home.NOTIFICA.success({message: 'Stato cartella incompleta', timeout: 3, title: 'Success'});
						var pA03 = {"contatto" : _json_contatto, "hl7Event" : "A03", "updateBefore" : true, "notifica" : {"show" : "S", "message" : "Chiusura PAC Avvenuta con Successo", "errorMessage" : "Errore Durante Chiusura PAC", "timeout" : 3}, "cbkSuccess" : function(){
							$.dialog.hide();
							NS_HOME_PAC_WK.wkPACAperti.refresh();
						}, "cbkError" : function(){}};

						NS_CONTATTO_METHODS.dischargeVisit(pA03);
					}
					else
					{
						logger.error("Set Stato Cartella INCOMPLETA - ERRORE PROCEDURA Durante Set Stato Cartella");
						home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
					}

				});

				xhr.fail(function () {
					logger.error("Set Stato Cartella INCOMPLETA - ERRORE XHR Durante Set Stato Cartella");
					home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
				});

			};

			if (!hasAccessoBefore){
				$.dialog("Per la data di chiusura selezionata non ci sono accessi attivi. Proseguendo il ricovero verr&agrave; annullato.", {
					buttons :
						[
							{label: "Annulla", action: function () { $.dialog.hide(); }},
							{label : "Prosegui", action : function(){ $.dialog.hide();
								registraChiusuraPAC();
							}}
						],
					title : "Completa Chiusura PAC " + _json_contatto.codice.codice,
					height : 100,
					width : 250
				});
			}
			else
			{
				registraChiusuraPAC();
			}

        };

        var dialogII = function()
        {
	        $.dialog(_table, {
						buttons :
						[
						 	{label: "Annulla", action: function () { $.dialog.hide(); }},
					        {label : "Prosegui", action : function(){ completaChiusuraPAC(); }}
						],
						title : "Chiudi PAC " + _json_contatto.codice.codice,
			          	height : 340,
			          	width : 250
	        });

	        _table.Zebra_DatePicker({always_visible: $("#gestioneChiusuraPAC"), direction: [moment(_json_contatto.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")], onSelect: function(data) {
	        	$("#h-txtDataChiusuraPAC").val(data);
	        }});

	        $('#txtOraChiusuraPAC').live().setMask("29:59").keypress(function() {

	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";

	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }

	         });

	         $("#gestioneChiusuraPAC div.Zebra_DatePicker").css({"position":"relative"});
	         $("#tdOraChiusuraPAC").css({"padding-top":"5px"});

        };

        var dialogI = function()
        {
        	$.dialog("Per il PAC in oggetto ci risulatano ancore aperti degli accessi. Se si prosegue questi ultimi verranno chiusi.", {
				buttons :
				[
				 	{label: "Annulla", action: function () { $.dialog.hide(); }},
			        {label : "Prosegui", action : function(){ $.dialog.hide();
						dialogII();
					}}
				],
				title : "Chiudi PAC " + _json_contatto.codice.codice,
	          	height : 75,
	          	width : 300
        	});
        };

        if (_accessi_aperti) {
        	dialogI();
        } else {
        	dialogII();
        }

    },

    annullaPAC : function(rec)
    {
    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);

        var completaAnnullamentoPAC = function(){

			_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;

			_json_contatto.contattiGiuridici[0].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiGiuridici[0].note = "Contatti Giuridico PAC annullato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			_json_contatto.contattiAssistenziali[0].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiAssistenziali[0].note  = "Accesso PAC annullato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			var pA11 = {"contatto" : _json_contatto, "hl7Event" : "A11", "updateBefore" : true, "notifica" : {"show" : "S", "message" : "Annullamento PAC Avvenuta con Successo", "errorMessage" : "Errore Durante Annullamento PAC", "timeout" : 3}, "cbkSuccess" : function(){NS_HOME_PAC_WK.wkPACAperti.refresh();}, "cbkError" : function(){}};

			NS_CONTATTO_METHODS.cancelAdmission(pA11);
        };

        home.DIALOG.si_no(
		{
			cbkSi : function(){ $.dialog.hide();
				completaAnnullamentoPAC();
			}
		});

    },

    annullaChiusuraPAC : function(rec)
    {
    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);

        var completaAnnullamentoChiusuraPAC = function(){

			_json_contatto.uteModifica.id = home.baseUser.IDEN_PER;

			_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiGiuridici[_json_contatto.contattiGiuridici.length - 1].note = "Contatti Giuridico PAC riattivato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].uteModifica.id = home.baseUser.IDEN_PER;
			_json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1].note  = "Accesso PAC riattivato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";

			var pA13 = {"contatto" : _json_contatto, "hl7Event" : "A13", "updateBefore" : true, "notifica" : {"show" : "S", "message" : "Annullamento Chiusura PAC Avvenuta con Successo", "errorMessage" : "Errore Durante Annullamento Chiusura PAC", "timeout" : 3}, "cbkSuccess" : function(){NS_HOME_PAC_WK.wkPACAperti.refresh();}, "cbkError" : function(){}};

			NS_CONTATTO_METHODS.cancelDischarge(pA13);
        };

        home.DIALOG.si_no(
		{
			cbkSi : function(){ $.dialog.hide();
				completaAnnullamentoChiusuraPAC();
			}
		});

    },

    /**
     * Metodo per l'inserimento di un accesso PAC.
     * Riutilizzo dei metodi per la segnalazione dell'accessoDH.
     * All'inserimento dell'accesso è obbligatorio inserire data di inizio e di fine.
     * Un accesso PAC non può durare piu' giorni.
     *
     * @author alessandro.arrighi
     */
    inserisciAccessoPAC : function(rec)
    {
    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
        var _table = $(	"<table>" +
        		"<tr><td colspan='2'><div id='gestioneInizioAccessoPAC'></div></td></tr>" +
        		"<tr class='trOraDialog'><td><span>Ora Inizio</span></td><td class='tdText oracontrol w80px'><input type='hidden' id='h-txtDataAccessoPAC'/><input type='text' id='txtOraInizioAccessoPAC' class='tdObb' /></td></tr>" +
        		"<tr class='trOraDialog'><td><span>Ora Fine</span></td><td class='tdText oracontrol w80px'><input type='text' id='txtOraFineAccessoPAC' class='tdObb' /></td></tr>" +
        	"</table>");

        var completaInserimentoAccessoPAC = function(){

        	var _ora_inizio = $('#txtOraInizioAccessoPAC').val();
        	var _ora_fine = $('#txtOraFineAccessoPAC').val();
         	var _data = $('#h-txtDataAccessoPAC').val();

         	if (_data === "" || _data == null) {
         		return home.NOTIFICA.error({message: "Selezionare la data di inizio dell'accesso PAC", timeout: 6, title: 'Error'});
         	}

         	if (_ora_inizio.length < 5) {
         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di inizio dell'accesso PAC", timeout: 6, title: 'Error'});
         	}

         	if (_ora_fine.length < 5) {
         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di fine dell'accesso PAC", timeout: 6, title: 'Error'});
         	}

         	var _json_assistenziale = {};

         	$.extend(_json_assistenziale, _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1]);

         	_json_assistenziale.id = null;
         	_json_assistenziale.stato = {id : null, codice : "ADMITTED"};
            _json_assistenziale.dataInizio = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora_inizio;
            _json_assistenziale.dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora_fine;
            _json_assistenziale.uteInserimento = {id : home.baseUser.IDEN_PER, codice : null};
            _json_assistenziale.note = "Accesso PAC aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";
			_json_assistenziale.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};

			var pSegnalaAccesso = {"contatto" : _json_assistenziale, "hl7Event" : "Segnala accesso PAC","notifica" : {"show" : "S", "message" : "Inserimento Accesso PAC Avvenuto con Successo", "errorMessage" : "Errore Durante Inserimento Accesso PAC", "timeout" : 3}, "cbkSuccess" : function(){
				$.dialog.hide();
				NS_HOME_PAC_WK.wkPACAperti.refresh();
			}, "cbkError" : function(){}};

			NS_CONTATTO_METHODS.upsertAccesso(pSegnalaAccesso);
        };

        $.dialog(_table, {
					buttons :
					[
					 	{label: "Annulla", action: function () { $.dialog.hide(); }},
				        {label : "Prosegui", action : function(){ completaInserimentoAccessoPAC(); }}
					],
					title : "Inserisci Accesso PAC " + _json_contatto.codice.codice,
		          	height : 340,
		          	width : 250
        });

        _table.Zebra_DatePicker({always_visible: $("#gestioneInizioAccessoPAC"), direction: [moment(_json_contatto.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")], onSelect: function(data) {
        	$("#h-txtDataAccessoPAC").val(data);
        }});

        $('#txtOraInizioAccessoPAC, #txtOraFineAccessoPAC').live().setMask("29:59").keypress(function() {

        	var currentMask = $(this).data('mask').mask;
            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";

            if (newMask != currentMask) {
            	$(this).setMask(newMask);
            }

         });

         $("#gestioneInizioAccessoPAC div.Zebra_DatePicker").css({"position":"relative"});
         $(".trOraDialog > td").css({"padding-top":"5px"});
    },

    printCertificato : function(idenContatto){
    	var _par = {};
        _par.PRINT_DIRECTORY = 'PAC';
        _par.PRINT_REPORT = 'CERTIFICATO_PAC';
        _par.PRINT_PROMPT = "&promptpIdenContatto=" + idenContatto;
        _par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        home.NS_FENIX_PRINT.caricaDocumento(_par);
        home.NS_FENIX_PRINT.apri(_par);
    },

    initLogger : function(){
        top.NS_CONSOLEJS.addLogger({name:'HOME_PAC',console:0});
        window.logger = top.NS_CONSOLEJS.loggers['HOME_PAC'];
    }





};