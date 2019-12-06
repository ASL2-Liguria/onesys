$(document).ready(function () {
    NS_CARTELLA_STORICA.init();
});

var NS_CARTELLA_STORICA = {

    contatto : null,
    anagrafica : null,

    init : function(){

        logger.debug("Cartella Pregressa - Init");

        NS_CARTELLA_STORICA.anagrafica = NS_ANAGRAFICA.Getter.getAnagraficaById($("#IDEN_ANAGRAFICA").val());
        NS_CARTELLA_STORICA.contatto = NS_CONTATTO_METHODS.getContattoEmpty();

        NS_REGIME_TIPO_MOTIVO_RICOVERO.valorizeTree();
        NS_FENIX_SCHEDA.addFieldsValidator({config : "V_CARTELLA_STORICA"});

        NS_CARTELLA_STORICA.setEvents();
        NS_CARTELLA_STORICA.setIntestazione();

    },

    setEvents : function(){

        logger.debug("Cartella Pregressa - Set Events - Init");

        NS_FENIX_SCHEDA.registra = NS_CARTELLA_STORICA.registra;

        // Ridefinizione per manipolazione urgenza
        // Se selezionata due volte consecutive la stessa urgenza viene deselezionata l'opzione scelta
        $("#cmbLivelloUrgenza > div").off("click").on("click", function(){

            var _old_value = $("#h-cmbLivelloUrgenza").val();
            var _new_value = $(this).attr("data-value");

            if ($(this).parent().hasClass("CBdisabled")) {
                return;
            }

            if (_new_value !== _old_value) {
                $("#h-cmbLivelloUrgenza").val($(this).attr("data-value"));
                $(this).parent().find("div").removeClass("CBpulsSel");
                $(this).addClass("CBpulsSel");
            } else {
                $("#h-cmbLivelloUrgenza").val(null);
                $(this).parent().find("div").removeClass("CBpulsSel");
            }
        });

        // Nascondo la sezione relativa ai dati del primo accesso DH
        $("#fldDatiAccessoDH").hide();

        $("#txtStruttura, #txtCartella").on("blur",function(){
            NS_CARTELLA_STORICA.completaCodiceContatto();
        });

        $("#txtAnno").on("blur",function(){
            NS_CARTELLA_STORICA.setDataAccettazioneBase();
            NS_CARTELLA_STORICA.completaCodiceContatto();
        });

    },

    /**
     * Alla selezione della data devo cambiare la bind dell'autocomplete dei reparti relativa alla data di inizio ricovero.
     *
     * @param data - Data inizio ricovero
     */
    bindACReparto : function(data){

        logger.debug("Cartella Pregressa - Bind autocomplete reparto - Init");

        var _dtInizioRicovero = moment(data, "YYYYMMDD");

        logger.debug("Cartella Pregressa - Bind autocomplete reparto - Data Inizio Ricovero -> " + _dtInizioRicovero.format("YYYYMMDD"));

        $('#acRepartoGiuridico').data('acList').changeBindValue({"data_ricovero":_dtInizioRicovero.format("YYYYMMDD")});
        $('#txtRepartoGiuridico').data('autocomplete').changeBindValue({"data_ricovero": _dtInizioRicovero.format("YYYYMMDD")});

        $('#acRepartoGiuridicoDimissione').data('acList').changeBindValue({"data_ricovero":_dtInizioRicovero.format("YYYYMMDD")});
        $('#txtRepartoGiuridicoDimissione').data('autocomplete').changeBindValue({"data_ricovero": _dtInizioRicovero.format("YYYYMMDD")});

        logger.debug("Cartella Pregressa - Bind autocomplete reparto - Bind completato");
    },

    completaCodiceContatto : function(){

        logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - Init");

        var _struttura = $("#txtStruttura").val();
        var _anno = $("#txtAnno").val();
        var _cartella = $("#txtCartella").val();
        var _data = $("#h-txtDataRicovero").val();

        if (_struttura.length > 5) {
            logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - Il valore della struttura deve avere una lunghezza massima di 5 caratteri");
            home.NOTIFICA.error({ message: "Il valore della struttura deve avere una lunghezza massima di 5 caratteri", timeout : 10, title: 'Attenzione'});
            $("#txtStruttura").val("").focus();
            return false;
        }

        if (_cartella.length > 8) {
            logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - Il valore della cartella deve avere una lunghezza massima di 8 caratteri");
            home.NOTIFICA.error({ message: "Il valore della cartella deve avere una lunghezza massima di 8 caratteri", timeout : 10, title: 'Attenzione'});
            $("#txtCartella").val("").focus();
            return false;
        }

        if (isNaN(_cartella)) {
            logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - Il valore della cartella deve essere riconducibile ad un numero");
            home.NOTIFICA.error({ message: "Il valore della cartella deve essere riconducibile ad un numero", timeout : 10, title: 'Attenzione'});
            $("#txtCartella").val("").focus();
            return false;
        }


        logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - Valori: struttura -> " + _struttura + ", anno -> " + _anno + ", cartella -> " + _cartella + ", data ricovero -> " + _data);

        if (_data !== "" && _data != null)
        {
            if (_anno != moment(_data,"YYYYMMDD").format("YYYY"))
            {
                logger.debug("Cartella Pregressa - Valorizzazione dinamica codice - L'anno del codice non corrisponde all'anno della data di inizio ricovero");
                home.NOTIFICA.error({ message: "L'anno del codice non corrisponde all'anno della data di inizio ricovero", timeout : 10, title: 'Attenzione'});
                return false;
            }
        }

        if (_struttura !== "" && _anno !== "" && _cartella !== "") {
            $("#txtCodice").val(_struttura + "-" + _anno + "-" + _cartella);
        }

        return true;
    },

    setDataAccettazioneBase : function(){

        var _anno = $("#txtAnno").val();
        var _dtRicovero = $("#txtDataRicovero").val();

        if (_anno == null || _anno == "" ){
            return;
        }

        if (_dtRicovero != null && _dtRicovero != "" ){
            return;
        }

        var _dataAccettazione = moment(_anno + "0101", "YYYYMMDD");
        $("#h-txtDataRicovero").val(_dataAccettazione.format("YYYYMMDD"));
        $("#txtDataRicovero").val(_dataAccettazione.format("DD/MM/YYYY"));

        NS_CARTELLA_STORICA.bindACReparto(_dataAccettazione.format("YYYYMMDD"));
    },

    valorizzaContatto : function(){
        var hDataRicovero = $("#h-txtDataRicovero");
        var $oraRicovero = $("#txtOraRicovero");
        var oraRicovero = $oraRicovero.val() != '' ? $oraRicovero.val() : '00:00';
        var $htxtDataFineRicovero = $("#h-txtDataFineRicovero");

        var _dtRicovero = hDataRicovero.val() != "" && hDataRicovero.val() != null ? moment(hDataRicovero.val() + oraRicovero,"YYYYMMDDHH:mm").format("YYYYMMDDHH:mm") : null;
        var _dtDimissione = $htxtDataFineRicovero.val() != "" && $htxtDataFineRicovero.val() != null ? moment($htxtDataFineRicovero.val() + $("#txtOraFineRicovero").val(),"YYYYMMDDHH:mm").format("YYYYMMDDHH:mm") : null;

        var  _JSON = NS_CARTELLA_STORICA.contatto;

        _JSON.anagrafica.id = $("#IDEN_ANAGRAFICA").val();
        _JSON.dataInizio = _dtRicovero;
        _JSON.dataFine = _dtDimissione;
        _JSON.stato.codice = "DISCHARGED";
        _JSON.uteInserimento.id = home.baseUser.IDEN_PER;

        _JSON.codice.struttura = $("#txtStruttura").val();
        _JSON.codice.anno = $("#txtAnno").val();
        _JSON.codice.cartella = $("#txtCartella").val();
        _JSON.codice.codice = $("#txtCodice").val();
        _JSON.codice.assigningAuthority = "FENIX-ARCHIVIO";

        _JSON.uteAccettazione.id = $("#h-txtMedicoAccettazione").val();
        _JSON.regime = {id : null, codice : $("#cmbRegimeRicovero option:selected").val()};
        _JSON.tipo = {id : null, codice : $("#cmbTipoRicovero option:selected").val()};
        _JSON.urgenza = {id : null, codice : $("input[name='cmbLivelloUrgenza']").val()};

        _JSON.mapMetadatiString['NEONATO'] = "N";
        _JSON.mapMetadatiString['SDO_COMPLETA'] = "N";
        _JSON.mapMetadatiCodifiche['ADT_ACC_RICOVERO_PROVENIENZA'] = {codice : null, id : $("#cmbProvenienzaRicovero option:selected").val() == null ? null : $("#cmbProvenienzaRicovero option:selected").val()};
        _JSON.mapMetadatiCodifiche['ADT_ACC_RICOVERO_ONERE'] = {id : $("#cmbOnere option:selected").val(), codice : null};
        _JSON.mapMetadatiCodifiche['ADT_ACC_RICOVERO_SUB_ONERE'] = {id : $("#cmbSubOnere option:selected").val(), codice : null};
        _JSON.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TIPO_MEDICO_PRESC'] = {id : $("#cmbTipoMedicoPrescrivente option:selected").val(), codice : null};
        _JSON.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TICKET'] = {id : $("#cmbTicket option:selected").val() ,codice : null};
        _JSON.mapMetadatiCodifiche['ADT_DIMISSIONE_TIPO'] = {id : $("#cmbTipoDimissione option:selected").val() ,codice : null};

        _JSON.contattiGiuridici[0].provenienza = {id : null, codice : null, idCentroDiCosto : $("#h-txtRepartoGiuridico").val()};
        _JSON.contattiGiuridici[0].regime.codice = $("#cmbRegimeRicovero option:selected").val();
        _JSON.contattiGiuridici[0].tipo.codice = $("#cmbTipoRicovero option:selected").val();
        _JSON.contattiGiuridici[0].stato.codice = "DISCHARGED";
        _JSON.contattiGiuridici[0].dataInizio = _dtRicovero;
        _JSON.contattiGiuridici[0].dataFine = _dtDimissione;
        _JSON.contattiGiuridici[0].uteInserimento.id = home.baseUser.IDEN_PER;
        _JSON.contattiGiuridici[0].note = "Contatto Giuridico Contatto creato da archivio";

        _JSON.contattiAssistenziali[0].provenienza = {id : null, codice : null, idCentroDiCosto : $("#h-txtRepartoGiuridico").val()};
        _JSON.contattiAssistenziali[0].stato.codice = "DISCHARGED";
        _JSON.contattiAssistenziali[0].dataInizio = _dtRicovero;
        _JSON.contattiAssistenziali[0].dataFine = _dtDimissione;
        _JSON.contattiAssistenziali[0].accesso = _JSON.regime.codice === NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH ? true : false;
        _JSON.contattiAssistenziali[0].uteInserimento.id = home.baseUser.IDEN_PER;
        _JSON.contattiAssistenziali[0].note = "Contatto Assistenziale Contatto creato da archivio";

        if ($("#h-txtRepartoGiuridicoDimissione").val() !== $("#h-txtRepartoGiuridico").val()) {

            var _json_assistenziale = {};
            var _json_giuridico = {};
            var _dtTrasferimento = $("#h-txtDataTrasferimento").val() != "" && $("#h-txtDataTrasferimento").val() != null ? moment($("#h-txtDataTrasferimento").val() + $("#txtOraTrasferimento").val(),"YYYYMMDDHH:mm").format("YYYYMMDDHH:mm") : null;

            $.extend(_json_assistenziale,_JSON.contattiAssistenziali[_JSON.contattiAssistenziali.length -1]);
            $.extend(_json_giuridico, _JSON.contattiGiuridici[_JSON.contattiGiuridici.length -1]);

            _json_giuridico.provenienza = {id : null, codice : null, idCentroDiCosto : $("#h-txtRepartoGiuridicoDimissione").val()};
            _json_giuridico.regime.codice = $("#cmbRegimeRicovero option:selected").val();
            _json_giuridico.tipo.codice = $("#cmbTipoRicovero option:selected").val();
            _json_giuridico.stato.codice = "DISCHARGED";
            _json_giuridico.dataInizio = _dtTrasferimento;
            _json_giuridico.dataFine = _dtDimissione;
            _json_giuridico.uteInserimento.id = home.baseUser.IDEN_PER;
            _json_giuridico.note = "Contatto Giuridico Contatto creato da archivio";

            _json_assistenziale.provenienza = {id : null, codice : null, idCentroDiCosto : $("#h-txtRepartoGiuridicoDimissione").val()};
            _json_assistenziale.stato.codice = "DISCHARGED";
            _json_assistenziale.dataInizio = _dtTrasferimento;
            _json_assistenziale.dataFine = _dtDimissione;
            _json_assistenziale.accesso = _JSON.regime.codice === NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH;
            _json_assistenziale.uteInserimento.id = home.baseUser.IDEN_PER;
            _json_assistenziale.note = "Contatto Assistenziale Contatto creato da archivio";

            // Essendoci un trasferimento la data di fine del primo segmento diventa la data di trasferimento
            _JSON.contattiGiuridici[0].dataFine = _dtTrasferimento;
            _JSON.contattiAssistenziali[0].dataFine = _dtTrasferimento;

            if (_JSON.contattiGiuridici.length > 1){
                _JSON.contattiGiuridici.splice(1,1,_json_giuridico);
            } else {
                _JSON.contattiGiuridici.push(_json_giuridico);
            }

            if (_JSON.contattiAssistenziali.length > 1){
                _JSON.contattiAssistenziali.splice(1,1,_json_assistenziale);
            } else {
                _JSON.contattiAssistenziali.push(_json_assistenziale);
            }
        }

        if ($("#h-txtDataFineAccesso").val() !== "" && $("#txtOraFineAccesso").val() !== ""){
            _JSON.contattiAssistenziali[0].dataFine =  $("#h-txtDataFineAccesso").val() + $("#txtOraFineAccesso").val();
        }
        var $hDiagnosi = $("#h-txtDiagnosiICD9");

        if ($hDiagnosi.val() != "") {
            _JSON.codiciICD.mapCodiciICD.push(
                {
                    "key": "DIAGNOSI",
                    "value":
                        [
                            {
                                "descrizione": $("#txtDiagnosiICD9").val(),
                                "evento": {
                                    "id": null,
                                    "codice": "A01"
                                },
                                "data": null,
                                "id": null,
                                "codice": $hDiagnosi.val(),
                                "ordine" : 0
                            }
                        ]
                });
        }

        return _JSON;
    },

    /**
     * Funzione che verifica una volta selezionato il reparto se la data inserita è valorizzata.
     * Se valorizzata controlla che sia adeguata con le date di validità del reparto.
     * Viene invocata alla selezione di un valore relativo al reparto tramite autocomplete.
     *
     * @param rec - corrisponde all'oggetto JSON restituito dall'AUTOCOMPLETE
     */
    checkRepartoValorizzato : function(rec){

        var _dt = $("#h-txtDataRicovero").val();
        var _regime = $("#cmbRegimeRicovero").find("option:selected").val();

        logger.debug("Cartella Pregressa - Controllo data per filtro AC Reparti - Data -> " + _dt);

        if (_dt == "" || _dt == null){
            logger.error("Cartella Pregressa - Controllo data per filtro AC Reparti - La data valorizzata " + _dt + " è null");
            home.NOTIFICA.warning({ message: "La data di inizio ricovero non &egrave; valorizzata", timeout : 10, title: 'Attenzione'});
            $("#txtRepartoGiuridico").val("");
        };

        if (!moment(_dt,"YYYYMMDD").isValid()){
            logger.error("Cartella Pregressa - Controllo data per filtro AC Reparti - La data valorizzata " + _dt + " NON è valida");
            home.NOTIFICA.warning({ message: "La data di inizio ricovero non &egrave; valida", timeout : 10, title: 'Attenzione'});
            $("#txtRepartoGiuridico").val("");
        };

        if (moment(_dt,"YYYYMMDD").isBefore(moment(rec.DATA_INIZIO_VALIDITA,"YYYYMMDD"))){
            logger.error("Cartella Pregressa - Controllo data per filtro AC Reparti - La data valorizzata " + _dt + " NON è valida");
            home.NOTIFICA.warning({ message: "La data di inizio ricovero non &egrave; valida", timeout : 10, title: 'Attenzione'});
            $("#txtRepartoGiuridico").val("");
        }

        V_CARTELLA_STORICA.elements.txtDataTrasferimento.status = "";
        V_CARTELLA_STORICA.elements.txtOraTrasferimento.status = "";

        if (_regime == "2"){
            V_CARTELLA_STORICA.elements.txtDataFineAccesso.status = "required";
            V_CARTELLA_STORICA.elements.txtOraFineAccesso.status = "required";
        } else {
            V_CARTELLA_STORICA.elements.txtDataFineAccesso.status = "";
            V_CARTELLA_STORICA.elements.txtOraFineAccesso.status = "";
        }

        if (_regime != "2" && ($("#txtRepartoGiuridicoDimissione").val() != "" && $("#txtRepartoGiuridicoDimissione").val() != null) && ($("#h-txtRepartoGiuridicoDimissione").val() != $("#h-txtRepartoGiuridico").val()))
        {
            V_CARTELLA_STORICA.elements.txtDataTrasferimento.status = "required";
            V_CARTELLA_STORICA.elements.txtOraTrasferimento.status = "required";
        }
        else if (_regime == "2" && ($("#txtRepartoGiuridicoDimissione").val() != "" && $("#txtRepartoGiuridicoDimissione").val() != null) && ($("#h-txtRepartoGiuridicoDimissione").val() != $("#h-txtRepartoGiuridico").val()))
        {
            logger.error("Cartella Pregressa - Controllo coerenza reparto dimissione - Per ricoveri DH il reparto di accettazione e dimissione devono coincidere");
            home.NOTIFICA.error({ message: "Per ricoveri DH i reparti  di accettazione e dimissione devono coincidere", timeout : 10, title: 'Attenzione'});
            $("#txtRepartoGiuridicoDimissione").val("");
        }

        NS_FENIX_SCHEDA.addFieldsValidator({config : "V_CARTELLA_STORICA"});
    },

    /**
     * Funzione di controllo della data inserita tramite il datepicker.
     *
     * @param pData
     */
    checkDataAccettazioneInserita : function(pData){
        var _dtAccettazione = moment(pData,"YYYYMMDD");
        var _dtNascita = moment(NS_CARTELLA_STORICA.anagrafica.dataNascita,"YYYYMMDD");

        logger.debug("Cartella Pregressa - Controllo Coerenza Date - Data di accettazione inserita -> " + _dtAccettazione.format("YYYYMMDD"));

        if (_dtNascita.isAfter(_dtAccettazione)){
            logger.debug("Cartella Pregressa - Controllo Coerenza Date - La data di accettazione inserita (" + _dtAccettazione.format("YYYYMMDD") + ") e precedenta alla data di nascita del PZ (" + _dtNascita.format("YYYYMMDD") + ")");
            home.NOTIFICA.error({ message: "La data di accettazione inserita (" + _dtAccettazione.format("DD/MM/YYYY") + ") e precedenta alla data di nascita del PZ (" + _dtNascita.format("DD/MM/YYYY") + ")", timeout : 6, title: 'Attenzione'});
            return false;
        }

        if (_dtAccettazione.isAfter(moment())){
            logger.debug("Cartella Pregressa - Controllo Coerenza Date - La data di accettazione inserita (" + _dtAccettazione.format("YYYYMMDD") + ") &egrave; futura alla data odierna (" + moment().format("YYYYMMDD") + ")");
            home.NOTIFICA.error({ message: "La data di accettazione inserita (" + _dtAccettazione.format("DD/MM/YYYY") + ") &egrave; successiva alla data odierna (" + moment().format("DD/MM/YYYY") + ")", timeout : 6, title: 'Attenzione'});
            return false;
        }

        return true;

    },

    /**
     * Prima di procedere con la registrazione controllo che le date valorizzate siano coerenti.
     * In particolare se il reparto iniziale e finale non corrispondono richiedo l'inserimento di una data intermedia.
     *
     * @returns {boolean}
     */
    checkDateContatto : function() {

        logger.debug("Cartella Pregressa - Controllo Coerenza Date - Init");

        var _dtInizioRicovero = moment($("#h-txtDataRicovero").val() + $("#txtOraRicovero").val(),"YYYYMMDDHH:mm");
        var _dtFineRicovero;
        var _regime = $("#cmbRegimeRicovero option:selected").val();

        logger.debug("Cartella Pregressa - Controllo Coerenza Date - Data Inizio Ricovero -> " + _dtInizioRicovero.format("YYYYMMDDHH:mm"));

        if (!NS_CARTELLA_STORICA.checkDataAccettazioneInserita(_dtInizioRicovero.format("YYYYMMDD"))) {
            return false;
        };

        if ($("#h-txtDataFineRicovero").val() != "" && $("#h-txtDataFineRicovero").val() != null){

            _dtFineRicovero = moment($("#h-txtDataFineRicovero").val() + $("#txtOraFineRicovero").val(),"YYYYMMDDHH:mm");

            logger.debug("Cartella Pregressa - Controllo Coerenza Date - Data Fine Ricovero -> " + _dtFineRicovero.format("YYYYMMDDHH:mm"));

            // Controllo coerenza tra data inizio e data fine
            if (_dtInizioRicovero.isAfter(_dtFineRicovero)) {
                home.NOTIFICA.error({ message: "La data di inizio ricovero &egrave; successiva alla data di fine", timeout : 10, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - Data Inizio maggiore di Data fine");
                return false;
            }
        }

        var _anno = $("#txtAnno").val();

        // Controllo coerenza tra data inizio ANNO relativo al codice
        if (_dtInizioRicovero.format("YYYY") !== _anno) {
            home.NOTIFICA.error({ message: "il valore dell'anno " + _anno + " non &egrave; coerente con la data di inizio ricovero " + _dtInizioRicovero.format("DD/MM/YYYY"), timeout : 10, title: 'Errore'});
            logger.error("il valore dell'anno " + _anno + " non &egrave; coerente con la data di inizio ricovero " + _dtInizioRicovero.format("DD/MM/YYYY"));
            return false;
        }

        V_CARTELLA_STORICA.elements.txtDataTrasferimento.status = "";
        V_CARTELLA_STORICA.elements.txtOraTrasferimento.status = "";

        // Se il reparto di inizio e quello di fine non coincidono obbligo la valorizzazione della data di trasferimento
        if ($("#h-txtRepartoGiuridicoDimissione").val() !== $("#h-txtRepartoGiuridico").val() && _regime !== "2") {

            logger.debug("Cartella Pregressa - Controllo Coerenza Date - Reparto di accettazione e dimissione non coincidono. Accettazione -> " + $("#h-txtRepartoGiuridico").val() + ", Dimissione -> " + $("#h-txtRepartoGiuridicoDimissione").val());

            if ($("#txtDataTrasferimento").val() == "" || $("#txtDataTrasferimento").val() == null) {
                home.NOTIFICA.error({ message: "Il reparto di accettazione e quello di dimissione non coincidono. Valorizzare la data di trasferimento.", timeout : 10, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - I reparti di accettazione e dimissione (" + $("#h-txtRepartoGiuridicoDimissione").val() + " e " + $("#h-txtRepartoGiuridico").val() + ") non coincidono. Valorizzare data trasferimento");
                return false;
            }

            var _dtTrasferimento = moment($("#h-txtDataTrasferimento").val(),"YYYYMMDD");

            // controllo appropriatezza data di trasferimento
            if (_dtTrasferimento.isAfter(_dtFineRicovero)){
                home.NOTIFICA.error({ message: "La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta successiva alla data di dimissione " + _dtFineRicovero.format("DD/MM/YYYY"), timeout : 6, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta successiva alla data di dimissione " + _dtFineRicovero.format("DD/MM/YYYY"));
                return false;
            } else if (_dtTrasferimento.isBefore(_dtInizioRicovero)) {
                home.NOTIFICA.error({ message: "La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta precedente alla data di inizio ricovero " + _dtInizioRicovero.format("DD/MM/YYYY"), timeout : 6, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta precedente alla data di inizio ricovero " + _dtInizioRicovero.format("DD/MM/YYYY"));
                return false;
            } else if (_dtTrasferimento.format("YYYY")!= _dtInizioRicovero.format("YYYY")){
                home.NOTIFICA.error({ message: "La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta effettuata in un anno differente da quello della data di accettazione " + _dtInizioRicovero.format("DD/MM/YYYY"), timeout : 6, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - La data di trasferimento " + _dtTrasferimento.format("DD/MM/YYYY")+ " risulta effettuata in un anno differente da quello della data di accettazione " + _dtInizioRicovero.format("DD/MM/YYYY"));
                return false;
            }

        } else if ($("#h-txtRepartoGiuridicoDimissione").val() !== $("#h-txtRepartoGiuridico").val() && _regime == "2") {
            home.NOTIFICA.error({ message: "Per i ricoveri DH il reparto di accettazione e quello di dimissione devono coincidere", timeout : 6, title: 'Errore'});
            logger.error("Cartella Pregressa - Controllo Coerenza Date - I reparti di accettazione e dimissione (" + $("#h-txtRepartoGiuridicoDimissione").val() + " e " + $("#h-txtRepartoGiuridico").val() + ") non coincidono. Per i DH devono essere uguali");
            return false;
        }

        if (_regime == "2") {

            var _dtFineAccesso = moment($("#h-txtDataFineAccesso").val(),"YYYYMMDD");
            var _dtInizioAccesso = moment($("#h-txtDataRicovero").val(),"YYYYMMDD");

            if (!(_dtFineAccesso.isSame(_dtInizioAccesso))){
                home.NOTIFICA.error({ message: "Per il ricovero DH data accettazione e data fine accesso devono coincidere", timeout : 6, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - Per il ricovero DH data accettazione e data fine accesso devono coincidere (Data Accesso -> " + _dtInizioAccesso.format("YYYYMMDDHH:mm") + "Data Dimissione -> " + _dtFineAccesso.format("YYYYMMDDHH:mm") + ")");
                return false;
            }

            _dtInizioAccesso = moment($("#h-txtDataRicovero").val() +$("#txtOraRicovero").val(),"YYYYMMDDHH:mm");
            _dtFineAccesso = moment($("#h-txtDataFineAccesso").val() + $("#txtOraFineAccesso").val(),"YYYYMMDDHH:mm");

            if (!(_dtFineAccesso.isAfter(_dtInizioAccesso))){
                home.NOTIFICA.error({ message: "La data di fine accesso deve essere successiva alla data di inizio", timeout : 6, title: 'Errore'});
                logger.error("Cartella Pregressa - Controllo Coerenza Date - La data di fine accesso deve essere precedente alla data di inizio");
                return false;
            }
        }

        return true;
    },

    registra : function(){

        logger.debug("Cartella Pregressa - Registra - Init");

        if (!NS_FENIX_SCHEDA.validateFields()) { return; }

        logger.debug("Cartella Pregressa - Registra - Superato controllo su obbligatorieta campi");

        if (!NS_CARTELLA_STORICA.checkDateContatto()) { return; }

        logger.debug("Cartella Pregressa - Registra - Superato controllo coerenza date");

        if (!NS_CARTELLA_STORICA.completaCodiceContatto()){ return; }

        logger.debug("Cartella Pregressa - Registra - Superato controllo valorizzazione codice");

        var _json = NS_CARTELLA_STORICA.valorizzaContatto();

        logger.debug("Cartella Pregressa - Registra - Valorizzato contatto con codice -> " + _json.codice.codice);

        var p = {"contatto" : _json, "notifica" : {"show" : "S", "timeout" : 6 ,"message" : "Accettazione Ricovero Avvenuta con Successo", "errorMessage" : "Errore Durante Accettazione Ricovero"}, "hl7Event" : "A01", "cbkSuccess" : function(){
            NS_CARTELLA_STORICA.setStatoCartellaIncompleta(NS_CONTATTO_METHODS.contatto.id);
        }};

        NS_CONTATTO_METHODS.admitVisitNotification(p);
    },

    setStatoCartellaIncompleta : function(idenContatto){

        logger.debug("Set Stato Cartella INCOMPLETA - Init ");

        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

        var parametri = {
            pStato : {v : '00', t : "V"},
            pIdenContatto : {v : typeof idenContatto == "undefined" ? _JSON_CONTATTO.id : idenContatto, t : "N"},
            pIdenPer : {v : home.baseUser.IDEN_PER, t : "N"},
            pArchivio : {v : $("#h-txtRepartoGiuridico").val(), t : "N"},
            pData : {v :$("#txtDataRicovero").val() + " " + $("#txtOraRicovero").val(), t : "V"},
            P_RESULT : {t : "V", d : "O"}
        };

        logger.debug("Set Stato Cartella INCOMPLETA - parametri -> " + JSON.stringify(parametri));

        var xhr = db.call_procedure(
            {
                id: "ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella",
                parameter : parametri
            });

        xhr.done(function (data, textStatus, jqXHR)
        {
            if (data['P_RESULT'] == 'OK')
            {
                logger.info("Set Stato Cartella INCOMPLETA - Set Stato Cartella Avvenuto con SUCCESSO");
                home.NOTIFICA.success({message: 'Stato cartella incompleta', timeout: 3, title: 'Success'});
                NS_FENIX_SCHEDA.chiudi({"refresh":true});
            }
            else
            {
                logger.error("Set Stato Cartella INCOMPLETA - ERRORE PROCEDURA Durante Set Stato Cartella " + JSON.stringify(data));
                home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
            }

        });

        xhr.fail(function (response) {
            logger.error("Set Stato Cartella INCOMPLETA - ERRORE XHR Durante Set Stato Cartella");
            home.NOTIFICA.error({message: "Attenzione errore nella modifica di stato cartella", title: "Error"});
        });

    },

    setIntestazione : function(){
        $('#lblTitolo').html(NS_CARTELLA_STORICA.anagrafica.cognome + ' ' + NS_CARTELLA_STORICA.anagrafica.nome + ' - ' + NS_CARTELLA_STORICA.anagrafica.sesso + ' - ' + moment(NS_CARTELLA_STORICA.anagrafica.dataNascita, 'YYYYMMDDHH:mm').format('DD/MM/YYYY') + ' - ' + NS_CARTELLA_STORICA.anagrafica.codiceFiscale);
    }
};

var NS_REGIME_TIPO_MOTIVO_RICOVERO =
{
    regimeOrdinario : "1",
    regimeDH : "2",

    Tree :
    {
        tipologiaRicovero : {
            "1" : [],
            "2" : []
        }
    },

    /**
     * Valorizza un JSON a partire dai dati caricati nelle combo.
     * Il JSON viene poi utilizzato per la valorizzazione delle combo del tipo del motivo al change del motivo.
     */

    valorizeTree : function() {

        $("#cmbTipoRicovero optgroup").each(function(idx, value) {
            var regimeOptgroup = $(value).attr('label') == "ORD" ? "1" : "2";
            if (NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regimeOptgroup].length==0){
                $(this).find("option").each(function(idx, value) {
                    NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regimeOptgroup].push(
                        {id : "cmbTipoRicovero_" + $(value).val(), value : $(value).val(), text : $(value).text()}
                    );
                });
            }
        });

    },

    setTipoFromRegime : function(r)
    {
        var regime = typeof r == 'undefined' ? $("#cmbRegimeRicovero option:selected").val() : r;

        // Gestione Tipologia Ricovero da Regime solo se non gia' valorizzato
        $("#cmbTipoRicovero optgroup").remove();
        $("#cmbTipoRicovero").append($("<optgroup></optgroup>").attr("label", regime == "1" ? "Ordinario" : "Day Hospital")).removeAttr("disabled");

        for (var i = 0; i < NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regime].length; i++)
        {
            var opt = NS_REGIME_TIPO_MOTIVO_RICOVERO.Tree.tipologiaRicovero[regime][i];
            $("#cmbTipoRicovero optgroup").append($("<option></option>").attr("id",opt.id).val(opt.value).text(opt.text));
        }
    },

    SHDatiPrimoAccessoDH : function(regime){

        if (regime === "2") {
            $("#fldDatiAccessoDH").show();
        } else {
            $("#fldDatiAccessoDH").hide();
        }
    }
};